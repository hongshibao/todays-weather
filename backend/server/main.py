from typing import Callable, Optional
from fastapi import FastAPI, Request
from anyio.lowlevel import RunVar
from anyio import CapacityLimiter
from starlette_context import plugins, context
from starlette_context.header_keys import HeaderKeys
from starlette_context.middleware.raw_middleware import RawContextMiddleware
from contextlib import asynccontextmanager
import time
import os
import json
import redis.asyncio as redis

from utils.log import logger
from server import schema
from server.weather_if import WeatherIf
from server.open_weather_api import OpenWeatherAPI


# Env vars
FASTAPI_MAX_THREADS = int(os.getenv("FASTAPI_MAX_THREADS", 8))
OPEN_WEATHER_API_KEY = os.environ["OPEN_WEATHER_API_KEY"]
OPEN_WEATHER_API_TIMEOUT = float(os.getenv("OPEN_WEATHER_API_TIMEOUT", 5))
REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
REDIS_DB = int(os.getenv("REDIS_DB", 0))


weather_api: WeatherIf = None
redis_client: redis.Redis = None


async def _query_geolocation_with_cache(
    city: str, country: str
) -> Optional[schema.Geolocation]:
    '''
    Since geolocation change is rare for a city, Redis cache is used for caching API results.
    '''
    geolocation = None

    # Key for cache item
    key = f"{city.lower()}-{country.lower()}"
    cached_result = await redis_client.get(key)
    if cached_result is None:
        # No result is cached, query API
        geolocation = await weather_api.get_geocoding(city, country)
        if geolocation:
            # Cache result
            geolocation_json = geolocation.model_dump_json()
            await redis_client.set(key, geolocation_json)
    else:
        cached_data = json.loads(cached_result)
        geolocation = schema.Geolocation(**cached_data)

    return geolocation


async def _query_weather(
    geolocation: schema.Geolocation,
) -> Optional[schema.WeatherReport]:
    '''
    Query weather information. If performance is a concern, Redis cache can still be used here 
        with a suitable cache item timeout setting.
    '''
    weather_report = await weather_api.get_weather(geolocation)
    return weather_report


@asynccontextmanager
async def lifespan(app: FastAPI):
    global weather_api, redis_client

    logger.debug("Running startup")
    RunVar("_default_thread_limiter").set(CapacityLimiter(FASTAPI_MAX_THREADS))
    # Init OpenWeatherAPI
    weather_api = OpenWeatherAPI(
        api_key=OPEN_WEATHER_API_KEY, timeout_seconds=OPEN_WEATHER_API_TIMEOUT
    )
    await weather_api.__aenter__()
    # Init Redis connection
    redis_client = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=REDIS_DB)
    logger.debug("Finished running startup")
    yield
    # Close Redis connection
    await redis_client.aclose()
    # Close OpenWeatherAPI
    await weather_api.__aexit__()


app = FastAPI(lifespan=lifespan, root_path="/api")


@app.middleware("http")
async def log_process_time(req: Request, call_next: Callable):
    if req.url.path.endswith("/healthz"):
        return await call_next(req)

    # Inject correlation_id in logging for each request
    with logger.contextualize(correlation_id=context.get(HeaderKeys.correlation_id)):
        # Add an enter log for the request
        logger.bind(
            state="begin",
            req_url_path=req.url.path,
            req_method=req.method,
            req_url_query=req.url.query,
        ).info("Enter API")

        start_time = time.time()
        resp = await call_next(req)
        end_time = time.time()
        used_time = end_time - start_time

        # Add an exit log for the request
        logger.bind(
            state="finish",
            req_url_path=req.url.path,
            req_method=req.method,
            req_url_query=req.url.query,
            duration=round(used_time * 1000, 2),
            status_code=resp.status_code,
        ).info("Exit API")

        return resp


app.add_middleware(RawContextMiddleware, plugins=[plugins.CorrelationIdPlugin()])


@app.get("/healthz")
def check_health():
    return {"status": "ok"}


@app.get("/weather")
async def get_weather(city: str, country: str) -> schema.WeatherResponse:
    # Default Error: Not Found
    resp = schema.WeatherResponse(City=city, Country=country, Error="Not Found")
    try:
        geolocation = await _query_geolocation_with_cache(city, country)
        if geolocation:
            weather_report = await _query_weather(geolocation)
            if weather_report:
                resp.Report = weather_report
                resp.Error = ""
    except Exception as ex:
        logger.exception(ex)
        # All exception is treated as `System Error`. Error info can be further refined.
        resp.Error = "System Error"

    return resp

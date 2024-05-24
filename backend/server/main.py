from fastapi import FastAPI, Request
from anyio.lowlevel import RunVar
from anyio import CapacityLimiter
from starlette_context import plugins, context
from starlette_context.header_keys import HeaderKeys
from starlette_context.middleware.raw_middleware import RawContextMiddleware
from contextlib import asynccontextmanager
import time
import os


from utils.log import logger
from server import schema


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.debug("Running startup")
    fastapi_max_threads = int(os.getenv("FASTAPI_MAX_THREADS", 8))
    RunVar("_default_thread_limiter").set(CapacityLimiter(fastapi_max_threads))
    logger.debug("Finished running startup")
    yield


app = FastAPI(lifespan=lifespan)


@app.middleware("http")
async def log_process_time(req: Request, call_next):
    if req.url.path.endswith("/healthz"):
        return await call_next(req)

    with logger.contextualize(correlation_id=context.get(HeaderKeys.correlation_id)):
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
    pass

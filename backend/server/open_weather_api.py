from typing import Optional
from typing_extensions import Self
import aiohttp
from server import schema
from server.weather_if import WeatherIf


class OpenWeatherAPI(WeatherIf):
    '''
    `OpenWeatherAPI` implements `WeatherIf` interface.
    Parameters:
        api_key: openweather API key
        timeout_seconds: http timeout settings in seconds
    '''
    def __init__(self, api_key: str, timeout_seconds: float) -> None:
        self._api_key = api_key
        self._timeout_seconds = timeout_seconds
        self._client_session = aiohttp.ClientSession(
            base_url="https://api.openweathermap.org",
            timeout=aiohttp.ClientTimeout(total=timeout_seconds),
        )

    async def __aenter__(self) -> Self:
        await self._client_session.__aenter__()
        return self

    async def __aexit__(self, *args, **kwargs) -> None:
        await self._client_session.__aexit__(*args, **kwargs)

    async def get_geocoding(
        self, city: str, country: str
    ) -> Optional[schema.Geolocation]:
        async with self._client_session.get(
            "/geo/1.0/direct",
            params={"q": f"{city},{country}", "appid": self._api_key, "limit": 1},
        ) as resp:
            result = await resp.json()
        if not result or "lat" not in result[0] or "lon" not in result[0]:
            return None
        return schema.Geolocation(Lat=result[0]["lat"], Lon=result[0]["lon"])

    async def get_weather(
        self, geolocation: schema.Geolocation
    ) -> Optional[schema.WeatherReport]:
        async with self._client_session.get(
            "/data/2.5/weather",
            params={
                "lat": geolocation.Lat,
                "lon": geolocation.Lon,
                "appid": self._api_key,
            },
        ) as resp:
            result = await resp.json()

        if not result:
            return None

        return schema.WeatherReport(
            Group=result["weather"][0]["main"],
            Description=result["weather"][0]["description"],
            Temperature=f'{result["main"]["temp_min"]}°C ~ {result["main"]["temp_max"]}°C',
            Humidity=f'{result["main"]["humidity"]}%',
            Time=result["dt"],
            Timezone=result["timezone"],
        )

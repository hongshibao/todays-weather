from typing import Optional
from typing_extensions import Self
import aiohttp
from server import schema
from server.weather_if import WeatherIf


class OpenWeatherAPI(WeatherIf):
    """
    `OpenWeatherAPI` implements `WeatherIf` interface.
    Parameters:
        api_key: openweather API key
        timeout_seconds: http timeout settings in seconds
    """

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

    async def get_weather(
        self, city: str, country: Optional[str]
    ) -> Optional[schema.WeatherReport]:
        if country:
            query_str = f"{city},{country}"
        else:
            query_str = city

        async with self._client_session.get(
            "/data/2.5/weather",
            params={"q": query_str, "appid": self._api_key},
        ) as resp:
            result = await resp.json()

        if not result or result.get("cod") == "404":
            return None

        if "weather" not in result:
            raise RuntimeError(f"Unknown result format {result}")

        return schema.WeatherReport(
            Group=result["weather"][0]["main"],
            Description=result["weather"][0]["description"],
            Temperature=f'{result["main"]["temp_min"]}°C ~ {result["main"]["temp_max"]}°C',
            Humidity=f'{result["main"]["humidity"]}%',
            Time=result["dt"],
            Timezone=result["timezone"],
        )

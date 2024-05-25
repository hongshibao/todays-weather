from abc import ABC, abstractmethod
from contextlib import AbstractAsyncContextManager
from typing import Optional
from server import schema


class WeatherIf(AbstractAsyncContextManager, ABC):
    """
    `WeatherIf` is the interface to provide weather information.
        get_weather: get weather information by city and country
    """

    @abstractmethod
    async def get_weather(
        self, city: str, country: Optional[str]
    ) -> Optional[schema.WeatherReport]:
        pass

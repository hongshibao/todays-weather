from abc import ABC, abstractmethod
from contextlib import AbstractAsyncContextManager
from typing import Optional
from server import schema


class WeatherIf(AbstractAsyncContextManager, ABC):
    @abstractmethod
    async def get_geocoding(
        self, city: str, country: str
    ) -> Optional[schema.Geolocation]:
        pass

    @abstractmethod
    async def get_weather(
        self, geolocation: schema.Geolocation
    ) -> Optional[schema.WeatherReport]:
        pass

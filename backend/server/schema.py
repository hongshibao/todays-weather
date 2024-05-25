from typing import Optional
from pydantic import BaseModel


class Geolocation(BaseModel):
    Lat: float
    Lon: float


class WeatherReport(BaseModel):
    Group: str
    Description: str
    Temperature: str
    Humidity: str
    # timestamp
    Time: int
    # timezone offset to UTC (in seconds)
    Timezone: int


class WeatherResponse(BaseModel):
    City: str
    Country: str
    # Report
    Report: Optional[WeatherReport] = None
    # Error message
    Error: str

from typing import Optional
from pydantic import BaseModel


class Geolocation(BaseModel):
    Lat: float
    Lon: float


class WeatherReport(BaseModel):
    Group: str
    Description: str
    Temperature: float
    Humidity: str
    # timestamp
    Time: int


class WeatherResponse(BaseModel):
    City: str
    Country: str
    # Report
    Report: Optional[WeatherReport] = None
    # Error message
    Error: str

from pydantic import BaseModel, Field

class WeatherResponse(BaseModel):
    group: str
    description: str
    temperature: str
    humidity: str
    time: str

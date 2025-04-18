from pydantic import BaseModel
from datetime import datetime

class TimeSeriesData(BaseModel):
    timestamp: datetime
    oil_rate: float
    pressure: float
    temperature: float

from pydantic import BaseModel
from typing import List

class WellBase(BaseModel):
    name: str
    collection: str
    latitude: float
    longitude: float

class WellOut(WellBase):
    id: int
    start_ms: int
    end_ms: int

    class Config:
        orm_mode = True

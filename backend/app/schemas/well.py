from pydantic import BaseModel
from typing import List

class WellBase(BaseModel):
    name: str
    latitude: float
    longitude: float

class WellOut(WellBase):
    id: int

    class Config:
        orm_mode = True

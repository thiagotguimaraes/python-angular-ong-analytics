from fastapi import APIRouter, Query
from typing import List
from app.schemas.timeseries import TimeSeriesData
from app.schemas.well import WellOut
from app.services.well_service import get_all_wells
from app.services.timeseries_service import get_timeseries_data

router = APIRouter()

@router.get("/health")
async def health_check():
    return {"status": "ok"}

@router.get("/wells", response_model=List[WellOut])
async def list_wells():
    return await get_all_wells()

@router.get("/data", response_model=List[TimeSeriesData])
async def get_data(well: str = Query(...), start_ms: str = Query(...), end_ms: str = Query(...)):
    return await get_timeseries_data(well_table=well, start_ms=int(start_ms), end_ms=int(end_ms))

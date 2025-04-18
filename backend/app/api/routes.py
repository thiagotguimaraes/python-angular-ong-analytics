from fastapi import APIRouter, Query
from typing import List
from app.schemas.well import WellOut
from app.services.well_service import get_all_wells
from app.db.timescale import get_timeseries_data

router = APIRouter()

@router.get("/health")
async def health_check():
    return {"status": "ok"}

@router.get("/wells", response_model=List[WellOut])
async def list_wells():
    return await get_all_wells()

@router.get("/data")
async def get_data(wellId: str = Query(...), start: str = Query(...), end: str = Query(...)):
    return await get_timeseries_data(wellId, start, end)

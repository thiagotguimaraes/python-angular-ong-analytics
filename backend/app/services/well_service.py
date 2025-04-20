from typing import List
from app.schemas.well import WellOut
from app.services.timeseries_service import get_wells_ranges
from sqlalchemy.future import select
from app.db.models import Well
from app.db.database_manager import db_manager
from app.db.timescale_db_manager import ts_db_manager
from app.utils.logger import logger

async def get_all_wells()->List[WellOut]:
    async for session in db_manager.get_session():
        # Fetch all wells
        wells_result = await session.execute(select(Well))
        wells = wells_result.scalars().all()

    date_ranges = await get_wells_ranges(wells)

    result: List[WellOut] = []
    for well, date_range in zip(wells, date_ranges):
        well_dict = {
            "name": well.name,
            "collection": well.collection,
            "latitude": well.latitude,
            "longitude": well.longitude,
            "id": well.id,
            "start_ms": int(date_range[0].timestamp() * 1000) if date_range[0] else None,
            "end_ms": int(date_range[1].timestamp() * 1000) if date_range[1] else None,
        }
        result.append(well_dict)

    logger.info("Result: %s", result)
    return result



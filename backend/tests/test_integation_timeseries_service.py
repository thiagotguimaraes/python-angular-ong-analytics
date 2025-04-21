import pytest
from app.services.timeseries_service import get_timeseries_data, get_wells_ranges
from app.db.timescale_db_manager import ts_db_manager
from app.db.models import Well

@pytest.mark.asyncio
async def test_get_timeseries_data():
    """Test the get_timeseries_data function."""
    well_table = "well_1"
    start_ms = 1735689600000  # 2025-01-01T00:00:00Z
    end_ms = 1743789600000  # 2025-04-01T02:00:00Z
    wells = [
        Well(collection="well_1"),
        Well(collection="well_2"),
        Well(collection="well_3"),
    ]

    data1 = await get_timeseries_data("well_1", start_ms, end_ms)
    assert len(data1) == 91

    data2 = await get_timeseries_data("well_2", start_ms, end_ms)
    assert len(data2) == 91

    data3 = await get_timeseries_data("well_3", start_ms, end_ms)
    assert len(data3) == 91

    ranges = await get_wells_ranges(wells)
    assert len(ranges) == 3

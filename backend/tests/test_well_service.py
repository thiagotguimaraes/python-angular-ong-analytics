import pytest
from unittest.mock import AsyncMock, patch, Mock
from app.services.well_service import get_all_wells
from app.db.models import Well

class AsyncIterator:
    """Helper class to mock an async iterator."""
    def __init__(self, items):
        self._items = items

    def __aiter__(self):
        return self

    async def __anext__(self):
        if not self._items:
            raise StopAsyncIteration
        return self._items.pop(0)

@pytest.mark.asyncio
async def test_get_all_wells():
    # Mock well objects
    mock_wells = [
        Well(id=1, name="Well 1", collection="well_1", latitude=24.466667, longitude=54.366669),
        Well(id=2, name="Well 2", collection="well_2", latitude=25.276987, longitude=55.296249),
    ]

    # Mock date ranges for each well
    mock_date_ranges = [
        [Mock(timestamp=lambda: 1735689600), Mock(timestamp=lambda: 1743465600)],  # Well 1
        [Mock(timestamp=lambda: 1735689600), Mock(timestamp=lambda: 1743465600)],  # Well 2
    ]

    with patch("app.services.well_service.db_manager.get_session") as mock_get_session, \
         patch("app.services.well_service.get_wells_ranges", new_callable=AsyncMock) as mock_get_wells_ranges:
        # Mock get_session to return an async iterator
        mock_session = AsyncMock()
        mock_get_session.return_value = AsyncIterator([mock_session])

        # Mock the execute method to return a mock result
        mock_result = Mock()
        mock_scalars = Mock()
        mock_scalars.all = Mock(return_value=mock_wells)
        mock_result.scalars = Mock(return_value=mock_scalars)
        mock_session.execute.return_value = mock_result

        # Mock get_wells_ranges to return the mock date ranges
        mock_get_wells_ranges.return_value = mock_date_ranges

        # Call the function under test
        result = await get_all_wells()

        # Expected result
        expected_result = [
            {
                "name": "Well 1",
                "collection": "well_1",
                "latitude": 24.466667,
                "longitude": 54.366669,
                "id": 1,
                "start_ms": 1735689600000,
                "end_ms": 1743465600000,
            },
            {
                "name": "Well 2",
                "collection": "well_2",
                "latitude": 25.276987,
                "longitude": 55.296249,
                "id": 2,
                "start_ms": 1735689600000,
                "end_ms": 1743465600000,
            },
        ]

        # Assertions
        assert result == expected_result
        mock_session.execute.assert_called_once()
        mock_get_wells_ranges.assert_called_once_with(mock_wells)
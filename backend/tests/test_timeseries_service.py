import pytest
from unittest.mock import AsyncMock, patch, ANY
from app.services.timeseries_service import get_timeseries_data, get_wells_ranges
from app.db.models import Well

# Helper class for mocking async iterators
class AsyncIterator:
    def __init__(self, items):
        self._items = items

    def __aiter__(self):
        return self

    async def __anext__(self):
        if not self._items:
            raise StopAsyncIteration
        return self._items.pop(0)


@pytest.mark.asyncio
async def test_get_wells_ranges_empty_wells():
    mock_wells = []

    with patch("app.services.timeseries_service.ts_db_manager.get_connection") as mock_get_connection:
        # Mock the TimescaleDB connection
        mock_conn = AsyncMock()
        mock_get_connection.return_value = AsyncIterator([mock_conn])

        # Call the function under test
        result = await get_wells_ranges(mock_wells)

        # Assertions
        assert result == []
        mock_conn.fetch.assert_not_called()


@pytest.mark.asyncio
async def test_get_timeseries_data_connection_failure():
    well_table = "test_table"
    start_ms = 1622505600000
    end_ms = 1622592000000

    with patch("app.services.timeseries_service.ts_db_manager.get_connection") as mock_get_connection, \
         patch("app.services.timeseries_service.logger") as mock_logger:
        # Simulate a connection failure
        mock_get_connection.side_effect = Exception("Database connection failed")

        # Call the function under test
        with pytest.raises(Exception, match="Database connection failed"):
            await get_timeseries_data(well_table, start_ms, end_ms)

        # Assertions
        mock_logger.error.assert_called_with("Database connection failed")


@pytest.mark.asyncio
async def test_get_timeseries_data_table_exists():
    well_table = "test_table"
    start_ms = 1622505600000  # Example start timestamp in milliseconds
    end_ms = 1622592000000    # Example end timestamp in milliseconds
    mock_rows = [
        {"timestamp": "2021-06-01T00:00:00Z", "oil_rate": 100, "pressure": 200, "temperature": 300},
        {"timestamp": "2021-06-01T01:00:00Z", "oil_rate": 110, "pressure": 210, "temperature": 310},
    ]

    with patch("app.services.timeseries_service.ts_db_manager.get_connection") as mock_get_connection, \
         patch("app.services.timeseries_service.logger") as mock_logger:
        # Mock the database connection
        mock_conn = AsyncMock()
        mock_get_connection.return_value = AsyncIterator([mock_conn])

        # Mock table existence check
        mock_conn.fetchval.return_value = True

        # Mock the query result
        mock_conn.fetch.return_value = mock_rows

        # Call the function under test
        result = await get_timeseries_data(well_table, start_ms, end_ms)

        # Assertions
        assert result == mock_rows
        mock_logger.info.assert_called_with(f"Fetching data from {well_table} between {start_ms / 1000} and {end_ms / 1000}")
        mock_conn.fetchval.assert_called_once()
        mock_conn.fetch.assert_called_once_with(
            ANY,  # Ignore exact query string formatting
            start_ms / 1000,
            end_ms / 1000,
        )

@pytest.mark.asyncio
async def test_get_timeseries_data_table_does_not_exist():
    well_table = "nonexistent_table"
    start_ms = 1622505600000
    end_ms = 1622592000000

    with patch("app.services.timeseries_service.ts_db_manager.get_connection") as mock_get_connection, \
         patch("app.services.timeseries_service.logger") as mock_logger:
        # Mock the database connection
        mock_conn = AsyncMock()
        mock_get_connection.return_value = AsyncIterator([mock_conn])

        # Mock table existence check to return False
        mock_conn.fetchval.return_value = False

        # Call the function under test
        result = await get_timeseries_data(well_table, start_ms, end_ms)

        # Assertions
        assert result == []
        mock_logger.error.assert_called_with(f"Table {well_table} does not exist in the database.")
        mock_conn.fetchval.assert_called_once()
        mock_conn.fetch.assert_not_called()

@pytest.mark.asyncio
async def test_get_wells_ranges():
    mock_wells = [
        Well(id=1, name="Well 1", collection="well_1"),
        Well(id=2, name="Well 2", collection="well_2"),
    ]
    mock_rows_well_1 = [
        {"timestamp": "2021-06-01T00:00:00Z"},
        {"timestamp": "2021-06-30T23:59:59Z"},
    ]
    mock_rows_well_2 = [
        {"timestamp": "2021-07-01T00:00:00Z"},
        {"timestamp": "2021-07-31T23:59:59Z"},
    ]

    with patch("app.services.timeseries_service.ts_db_manager.get_connection") as mock_get_connection:
        # Mock the TimescaleDB connection
        mock_conn = AsyncMock()
        mock_get_connection.return_value = AsyncIterator([mock_conn])

        # Mock the query results for each well
        mock_conn.fetch.side_effect = [mock_rows_well_1, mock_rows_well_2]

        # Call the function under test
        result = await get_wells_ranges(mock_wells)

        # Assertions
        assert result == [
            ["2021-06-01T00:00:00Z", "2021-06-30T23:59:59Z"],
            ["2021-07-01T00:00:00Z", "2021-07-31T23:59:59Z"],
        ]
        assert mock_conn.fetch.call_count == 2
        mock_conn.fetch.assert_any_call(
            ANY  # Ignore exact query string formatting
        )


@pytest.mark.asyncio
async def test_get_timeseries_data_query_string():
    well_table = "test_table"
    start_ms = 1622505600000
    end_ms = 1622592000000

    expected_query = """SELECT timestamp, oil_rate, pressure, temperature FROM "test_table" WHERE timestamp BETWEEN to_timestamp($1) AND to_timestamp($2) ORDER BY timestamp;"""

    with patch("app.services.timeseries_service.ts_db_manager.get_connection") as mock_get_connection:
        # Mock the database connection
        mock_conn = AsyncMock()
        mock_get_connection.return_value = AsyncIterator([mock_conn])

        # Mock table existence check
        mock_conn.fetchval.return_value = True

        # Call the function under test
        await get_timeseries_data(well_table, start_ms, end_ms)

        # Assertions
        mock_conn.fetch.assert_called_once()
        actual_query = mock_conn.fetch.call_args[0][0]
        assert actual_query.strip() == expected_query.strip()


@pytest.mark.asyncio
async def test_get_wells_ranges_query_strings():
    mock_wells = [
        Well(id=1, name="Well 1", collection="well_1"),
        Well(id=2, name="Well 2", collection="well_2"),
    ]

    expected_query_well_1 = """(SELECT * FROM "well_1" ORDER BY timestamp ASC LIMIT 1) UNION ALL (SELECT * FROM "well_1" ORDER BY timestamp DESC LIMIT 1)"""

    expected_query_well_2 = """(SELECT * FROM "well_2" ORDER BY timestamp ASC LIMIT 1) UNION ALL (SELECT * FROM "well_2" ORDER BY timestamp DESC LIMIT 1)"""

    with patch("app.services.timeseries_service.ts_db_manager.get_connection") as mock_get_connection:
        # Mock the TimescaleDB connection
        mock_conn = AsyncMock()
        mock_get_connection.return_value = AsyncIterator([mock_conn])

        # Mock the query results for each well
        mock_conn.fetch.side_effect = [[{"timestamp": "2021-06-01T00:00:00Z"}], [{"timestamp": "2021-07-01T00:00:00Z"}]]

        # Call the function under test
        await get_wells_ranges(mock_wells)

        # Assertions for well_1
        actual_query_well_1 = mock_conn.fetch.call_args_list[0][0][0]
        assert actual_query_well_1.strip() == expected_query_well_1.strip()

        # Assertions for well_2
        actual_query_well_2 = mock_conn.fetch.call_args_list[1][0][0]
        assert actual_query_well_2.strip() == expected_query_well_2.strip()

@pytest.mark.asyncio
async def test_table_check_query():
    well_table = "test_table"
    start_ms = 1622505600000
    end_ms = 1622592000000

    expected_query = """SELECT EXISTS (SELECT FROM information_schema.tables WHERE LOWER(table_name) = LOWER($1));"""

    with patch("app.services.timeseries_service.ts_db_manager.get_connection") as mock_get_connection:
        # Mock the database connection
        mock_conn = AsyncMock()
        mock_get_connection.return_value = AsyncIterator([mock_conn])

        # Mock table existence check
        mock_conn.fetchval.return_value = True

        # Call the function under test
        await get_timeseries_data(well_table, start_ms, end_ms)

        # Assertions
        mock_conn.fetchval.assert_called_once()
        actual_query = mock_conn.fetchval.call_args[0][0]
        assert actual_query.strip() == expected_query.strip()

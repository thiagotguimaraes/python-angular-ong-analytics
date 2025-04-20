import pytest
from unittest.mock import AsyncMock, patch, MagicMock, ANY, Mock
from app.db.timescale_db_manager import TimescaleDBManager

@pytest.mark.asyncio
async def test_connect_success():
    with patch("app.db.timescale_db_manager.asyncpg.create_pool", new_callable=AsyncMock) as mock_create_pool, \
         patch("app.db.timescale_db_manager.logger") as mock_logger:
        # Mock the pool creation
        mock_pool = MagicMock()
        mock_create_pool.return_value = mock_pool

        # Create an instance of TimescaleDBManager
        db_manager = TimescaleDBManager()

        # Call the connect method
        await db_manager.connect()

        # Assertions
        mock_create_pool.assert_called_once_with(
            user=ANY,
            password=ANY,
            database=ANY,
            host=ANY,
            port=ANY,
            min_size=1,
            max_size=10
        )
        assert db_manager.pool == mock_pool
        mock_logger.info.assert_called_with("Connected to TimescaleDB successfully.")

@pytest.mark.asyncio
async def test_connect_failure():
    with patch("app.db.timescale_db_manager.asyncpg.create_pool", new_callable=AsyncMock) as mock_create_pool, \
         patch("app.db.timescale_db_manager.logger") as mock_logger:
        # Simulate a connection failure
        mock_create_pool.side_effect = Exception("Connection failed")

        # Create an instance of TimescaleDBManager
        db_manager = TimescaleDBManager()

        # Call the connect method
        await db_manager.connect()

        # Assertions
        mock_create_pool.assert_called_once()
        assert db_manager.pool is None
        mock_logger.error.assert_called_with("Failed to connect to TimescaleDB: Connection failed")

@pytest.mark.asyncio
async def test_close_success():
    with patch("app.db.timescale_db_manager.logger") as mock_logger:
        # Mock the pool
        mock_pool = AsyncMock()
        db_manager = TimescaleDBManager()
        db_manager.pool = mock_pool

        # Call the close method
        await db_manager.close()

        # Assertions
        mock_pool.close.assert_called_once()
        assert db_manager.pool is None
        mock_logger.info.assert_called_with("Connection to TimescaleDB closed.")

@pytest.mark.asyncio
async def test_close_no_pool():
    with patch("app.db.timescale_db_manager.logger") as mock_logger:
        # Create an instance of TimescaleDBManager with no pool
        db_manager = TimescaleDBManager()

        # Call the close method
        await db_manager.close()

        # Assertions
        mock_logger.info.assert_not_called()

@pytest.mark.asyncio
async def test_get_connection_success():
    with patch("app.db.timescale_db_manager.asyncpg.create_pool", new_callable=AsyncMock) as mock_create_pool, \
         patch("app.db.timescale_db_manager.logger") as mock_logger:
        # Mock the pool and connection
        mock_conn = AsyncMock()
        mock_pool = AsyncMock()
        mock_pool.acquire.return_value = mock_conn

        # Mock pool attributes
        mock_pool._queue.qsize = AsyncMock(return_value=5)  # Simulate 5 available connections
        mock_pool._holders = [1, 2, 3, 4, 5, 6]  # Simulate 6 holders as a regular list

        # Assign the mocked pool
        mock_create_pool.return_value = mock_pool
        db_manager = TimescaleDBManager()
        db_manager.pool = mock_pool

        # Call the get_connection method
        async for conn in db_manager.get_connection():
            yield conn

        # Assertions
        mock_create_pool.assert_called_once()
        mock_pool.acquire.assert_called_once()
        mock_logger.info.assert_any_call("Pool status before acquiring: available=5, in_use=1")

@pytest.mark.asyncio
async def test_get_connection_no_pool():
    with patch("app.db.timescale_db_manager.TimescaleDBManager.connect", new_callable=AsyncMock) as mock_connect, \
         patch("app.db.timescale_db_manager.logger") as mock_logger:
        # Mock the connection method
        mock_conn = AsyncMock()
        mock_pool = AsyncMock()
        mock_pool.acquire.return_value = mock_conn

        # Mock pool attributes
        mock_pool._queue.qsize.return_value = 5
        mock_pool._holders = [1, 2, 3, 4, 5, 6]  # Simulate 6 holders

        # Assign the mocked pool
        mock_connect.return_value = None
        db_manager = TimescaleDBManager()
        db_manager.pool = mock_pool

        # Call the get_connection method
        async for conn in db_manager.get_connection():
            yield conn
            # assert conn == mock_conn

        # Assertions
        mock_connect.assert_called_once()
        mock_pool.acquire.assert_called_once()
        mock_logger.info.assert_any_call("Pool status before acquiring: available=5, in_use=1")
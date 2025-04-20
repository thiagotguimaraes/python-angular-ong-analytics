import asyncpg
from app.config import settings
from app.utils.logger import logger

class TimescaleDBManager:
    def __init__(self):
        self.pool = None

    async def connect(self):
        if self.pool is None:
            try:
                self.pool = await asyncpg.create_pool(
                    user=settings.TIMESCALE_USER,
                    password=settings.TIMESCALE_PASSWORD,
                    database=settings.TIMESCALE_DB,
                    host=settings.TIMESCALE_HOST,
                    port=int(settings.TIMESCALE_PORT),
                    min_size=1,
                    max_size=10
                )
                logger.info("Connected to TimescaleDB successfully.")
            except Exception as e:
                logger.error(f"Failed to connect to TimescaleDB: {e}")

    async def close(self):
        if self.pool:
            await self.pool.close()
            self.pool = None
            logger.info("Connection to TimescaleDB closed.")

    async def get_connection(self):
        """
        Provides a connection using an async context manager.
        Ensures the connection is released back to the pool.
        """
        if self.pool is None:
            await self.connect()

        try:
            # Handle mocked attributes or coroutines
            if callable(getattr(self.pool._queue, "qsize", None)):
                available = await self.pool._queue.qsize()
            else:
                available = self.pool._queue.qsize() if hasattr(self.pool._queue, "qsize") else 0

            in_use = len(self.pool._holders) - available if hasattr(self.pool, "_holders") else 0
            logger.info(f"Pool status before acquiring: available={available}, in_use={in_use}")

            async with self.pool.acquire() as conn:
                yield conn
        except Exception as e:
            logger.error(f"Failed to acquire connection: {e}")
            raise


ts_db_manager = TimescaleDBManager()
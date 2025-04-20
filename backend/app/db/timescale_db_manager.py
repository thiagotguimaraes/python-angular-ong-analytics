from app.config import settings
import asyncpg
import logging

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
                logging.info("Connected to TimescaleDB successfully.")
            except Exception as e:
                logging.error(f"Failed to connect to TimescaleDB: {e}")

    async def close(self):
        if self.pool:
            await self.pool.close()
            self.pool = None
            logging.info("Connection to TimescaleDB closed.")

    async def get_connection(self):
        """
        Provides a connection using an async context manager.
        Ensures the connection is released back to the pool.
        """
        if self.pool is None:
            await self.connect()

        logging.info(f"Pool status before acquiring: available={self.pool._queue.qsize()}, in_use={len(self.pool._holders) - self.pool._queue.qsize()}")

        async with self.pool.acquire() as conn:
            logging.info(f"Connection acquired. Pool status: available={self.pool._queue.qsize()}, in_use={len(self.pool._holders) - self.pool._queue.qsize()}")
            yield conn


ts_db_manager = TimescaleDBManager()
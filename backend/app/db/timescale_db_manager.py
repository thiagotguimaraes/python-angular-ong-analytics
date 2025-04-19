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

    async def acquire(self):
        if self.pool is None:
           await self.connect()

        return await self.pool.acquire()

    async def close(self):
        if self.pool:
            await self.pool.close()
            self.pool = None
            logging.info("Connection to TimescaleDB closed.")


ts_db_manager = TimescaleDBManager()
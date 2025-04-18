import asyncpg
from app.config import settings
import logging

# Create a global connection pool
pool = None

async def init_db_pool():
    global pool
    try:
        pool = await asyncpg.create_pool(
            user=settings.POSTGRES_USER,
            password=settings.POSTGRES_PASSWORD,
            database=settings.POSTGRES_DB,
            host=settings.POSTGRES_HOST,
            port=int(settings.POSTGRES_PORT),
            min_size=1,
            max_size=10
        )
        logging.info("Connection pool initialized successfully.")
    except Exception as e:
        logging.error(f"Failed to initialize connection pool: {e}")

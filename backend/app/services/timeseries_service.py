import logging
import asyncpg
from app.config import settings

async def get_timeseries_data(well_table: str, start_ms: int, end_ms: int):
    start_s = start_ms / 1000
    end_s = end_ms / 1000
    logging.info(f"Fetching data from {well_table} between {start_s} and {end_s}")

    pool = await asyncpg.create_pool(
            user=settings.TIMESCALE_USER,
            password=settings.TIMESCALE_PASSWORD,
            database=settings.TIMESCALE_DB,
            host=settings.TIMESCALE_HOST,
            port=int(settings.TIMESCALE_PORT),
            min_size=1,
            max_size=10
        )

    if pool is None:
        logging.error("Database connection pool is not initialized.")
        return []
    
    async with pool.acquire() as conn:
        table_check_query = """
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE LOWER(table_name) = LOWER($1)
            );
        """
        table_exists = await conn.fetchval(table_check_query, well_table)
        if not table_exists:
            logging.error(f"Table {well_table} does not exist in the database.")
            return []
        
        query = f"""
            SELECT timestamp, oil_rate, pressure, temperature
            FROM "{well_table}"
            WHERE timestamp BETWEEN to_timestamp($1) AND to_timestamp($2)
            ORDER BY timestamp;
        """
        rows = await conn.fetch(query, start_s, end_s)
        return [dict(row) for row in rows]
import asyncpg
from app.config import settings

async def get_timeseries_data(well_table: str, start_ms: int, end_ms: int):
    start_s = start_ms / 1000
    end_s = end_ms / 1000

    conn = await asyncpg.connect(
        user=settings.TIMESCALE_USER,
        password=settings.TIMESCALE_PASSWORD,
        database=settings.TIMESCALE_DB,
        host=settings.TIMESCALE_HOST,
        port=int(settings.TIMESCALE_PORT),
    )

    query = f"""
        SELECT timestamp, oil_rate, pressure, temperature
        FROM "{well_table}"
        WHERE timestamp BETWEEN to_timestamp($1) AND to_timestamp($2)
        ORDER BY timestamp;
    """
    rows = await conn.fetch(query, start_s, end_s)
    await conn.close()
    return [dict(row) for row in rows]

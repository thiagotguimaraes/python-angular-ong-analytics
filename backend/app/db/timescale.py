import asyncpg
from app.config import settings

async def get_timeseries_data(well_table: str, start: str, end: str):
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
        WHERE timestamp BETWEEN $1 AND $2
        ORDER BY timestamp;
    """
    rows = await conn.fetch(query, start, end)
    await conn.close()
    return [dict(row) for row in rows]

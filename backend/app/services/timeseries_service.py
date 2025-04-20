from app.db.timescale_db_manager import ts_db_manager
from app.utils.logger import logger

async def get_timeseries_data(well_table: str, start_ms: int, end_ms: int):
    start_s = start_ms / 1000
    end_s = end_ms / 1000
    logger.info(f"Fetching data from {well_table} between {start_s} and {end_s}")
    
    try:
        async for conn in ts_db_manager.get_connection():
            table_check_query = """SELECT EXISTS (SELECT FROM information_schema.tables WHERE LOWER(table_name) = LOWER($1));"""
            table_exists = await conn.fetchval(table_check_query, well_table)
            if not table_exists:
                logger.error(f"Table {well_table} does not exist in the database.")
                return []
            
            query = f"""SELECT timestamp, oil_rate, pressure, temperature FROM "{well_table}" WHERE timestamp BETWEEN to_timestamp($1) AND to_timestamp($2) ORDER BY timestamp;"""
            rows = await conn.fetch(query, start_s, end_s)
            return [dict(row) for row in rows]
    except Exception as e:
        logger.error(str(e))
        raise
    

async def get_wells_ranges(wells):
    async for ts_conn in ts_db_manager.get_connection():
        date_ranges = []
        for well in wells:
            # Query to fetch the first and last rows from the well's collection table
            query = f"""(SELECT * FROM "{well.collection}" ORDER BY timestamp ASC LIMIT 1) UNION ALL (SELECT * FROM "{well.collection}" ORDER BY timestamp DESC LIMIT 1)"""
            rows = await ts_conn.fetch(query)
            date_ranges.append([row["timestamp"] for row in rows])

    return date_ranges
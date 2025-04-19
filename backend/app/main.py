import logging
from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.api.routes import router
from app.db.timescale_db_manager import ts_db_manager
from app.db.database_manager import db_manager


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    async with db_manager.get_engine().begin() as conn:
        await conn.run_sync(db_manager.get_base().metadata.create_all)
    
    await ts_db_manager.connect()
    
    try:
        yield  # Application runs here
    finally:
        # Shutdown logic
        ts_db_manager.close()
        logging.info("Shutting down application...")



app = FastAPI(lifespan=lifespan)

app.include_router(router)

from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.api.routes import router
from app.db.database import Base, engine
from app.db.timescale import init_db_pool
import logging

pool = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global pool
    # Startup logic
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    try:
        yield  # Application runs here
    finally:
        # Shutdown logic
        logging.info("Shutting down application...")



app = FastAPI(lifespan=lifespan)

app.include_router(router)

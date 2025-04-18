from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.api.routes import router
from app.db.database import Base, engine
import logging

@asynccontextmanager
async def lifespan(app: FastAPI):
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

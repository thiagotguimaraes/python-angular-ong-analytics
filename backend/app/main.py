from fastapi import FastAPI
from app.api.routes import router
from app.db.database import Base, engine
from app.db.database import SessionLocal

app = FastAPI()

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

app.include_router(router)

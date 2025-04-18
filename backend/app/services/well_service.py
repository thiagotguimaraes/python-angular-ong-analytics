from sqlalchemy.future import select
from app.db.models import Well
from app.db.database import SessionLocal

async def get_all_wells():
    async with SessionLocal() as session:
        result = await session.execute(select(Well))
        return result.scalars().all()

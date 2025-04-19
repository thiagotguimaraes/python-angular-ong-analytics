from sqlalchemy.future import select
from app.db.models import Well
from app.db.database_manager import db_manager

async def get_all_wells():
    async for session in db_manager.get_session():
        result = await session.execute(select(Well))
        return result.scalars().all()

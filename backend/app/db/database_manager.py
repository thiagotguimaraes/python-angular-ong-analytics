from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

class DatabaseManager:
    def __init__(self):
        self.url = f"postgresql+asyncpg://{settings.POSTGRES_USER}:{settings.POSTGRES_PASSWORD}@{settings.POSTGRES_HOST}:{settings.POSTGRES_PORT}/{settings.POSTGRES_DB}"
        self.engine = create_async_engine(self.url, echo=True, future=True)
        self.session_local = sessionmaker(self.engine, class_=AsyncSession, expire_on_commit=False)
        self.base = declarative_base()

    async def get_session(self):
        """
        Provides a database session for use in async contexts.
        """
        async with self.session_local() as session:
            try:
                yield session
            except Exception as e:
                await session.rollback()
                raise e
            finally:
                await session.close()

    def get_engine(self):
        """
        Returns the database engine.
        """
        return self.engine
    
    def get_base(self):
        """
        Returns the base class for declarative models.
        """
        return self.base

db_manager = DatabaseManager()
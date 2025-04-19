from sqlalchemy import Column, Integer, String, Float
from app.db.database_manager import db_manager

Base = db_manager.get_base()

class Well(Base):
    __tablename__ = "wells"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    collection = Column(String, unique=True, index=True)
    latitude = Column(Float)
    longitude = Column(Float)

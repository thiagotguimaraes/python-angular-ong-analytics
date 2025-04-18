from sqlalchemy.orm import Session
from sqlalchemy import select
from app.db.models import Well  # Import your SQLAlchemy Well model

async def initialize_database(db: Session):
    # Check if the wells table is empty
    wells_exist = (await db.execute(select(Well).limit(1))).first()
    if not wells_exist:
        # Insert wells into the database
        db.add_all([
            Well(name="Well 1", latitude=24.466667, longitude=54.366669),  # Abu Dhabi
            Well(name="Well 2", latitude=25.276987, longitude=55.296249),  # Dubai
            Well(name="Well 3", latitude=25.405216, longitude=55.513643),  # Sharjah
        ])
        await db.commit()
        print("Inserted initial wells into the database.")
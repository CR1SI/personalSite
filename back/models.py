#models.py

from sqlalchemy import Column, Boolean, Integer, String
from sqlalchemy.dialects.postgresql import JSONB
from database import Base

class Photos(Base):
    __tablename__ = "photos"

    id = Column(Integer, primary_key=True, index=True)
    favorite = Column(Boolean, default=False)
    category = Column(String)
    title = Column(String)
    location = Column(String)
    description = Column(String)
    img_src = Column(String)
    photo_metadata = Column(JSONB)
import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Text, JSON
from app.database import Base

class Speaker(Base):
    __tablename__ = "speakers"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(150), nullable=False, index=True)
    title = Column(String(200), default="Technology Leader")
    company = Column(String(150), default="NexziByte Ecosystem")
    bio = Column(Text, nullable=True)
    expertise = Column(JSON, default=list)
    image_url = Column(String(500), nullable=True)
    twitter = Column(String(255), nullable=True)
    linkedin = Column(String(255), nullable=True)
    github = Column(String(255), nullable=True)
    is_featured = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

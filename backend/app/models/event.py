import datetime
from sqlalchemy import Column, String, Integer, DateTime, Text, JSON
from app.database import Base

class Summit(Base):
    __tablename__ = "summits"

    id = Column(String(64), primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=True)
    subtitle = Column(String(300), nullable=True)
    badge = Column(String(100), default="UPCOMING FLAGSHIP")
    description = Column(Text, nullable=True)
    full_description = Column(Text, nullable=True)
    banner_image = Column(String(500), nullable=True)
    date = Column(String(100), nullable=False)
    time = Column(String(100), default="09:00 AM - 06:00 PM IST")
    location = Column(String(200), default="Hyderabad, India")
    venue = Column(String(255), default="HICC - Hyderabad International Convention Centre")
    address = Column(Text, nullable=True)
    max_seats = Column(Integer, default=500)
    registered_count = Column(Integer, default=0)
    status = Column(String(50), default="Upcoming", index=True)  # "Upcoming", "Active", "Completed", "Archived", "Draft"
    
    agenda = Column(JSON, default=list)
    speakers = Column(JSON, default=list)
    perks = Column(JSON, default=list)
    passes_info = Column(JSON, default=list)

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class FounderMeet(Base):
    __tablename__ = "founder_meets"

    id = Column(String(64), primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=True)
    subtitle = Column(String(300), nullable=True)
    badge = Column(String(100), default="FOUNDER & INVESTOR ROUNDTABLE")
    description = Column(Text, nullable=True)
    full_description = Column(Text, nullable=True)
    banner_image = Column(String(500), nullable=True)
    date = Column(String(100), nullable=False)
    time = Column(String(100), default="04:00 PM - 08:30 PM IST")
    location = Column(String(200), default="Hyderabad, India")
    venue = Column(String(255), default="T-Hub Innovation Hub / HITEC City")
    address = Column(Text, nullable=True)
    founder_info = Column(Text, nullable=True)
    max_seats = Column(Integer, default=60)
    registered_count = Column(Integer, default=0)
    status = Column(String(50), default="Upcoming", index=True)  # "Upcoming", "Active", "Completed", "Archived", "Draft"
    
    agenda = Column(JSON, default=list)
    speakers = Column(JSON, default=list)
    perks = Column(JSON, default=list)

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

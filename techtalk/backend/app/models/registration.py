import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Text, JSON, ForeignKey
from app.database import Base

class Registration(Base):
    __tablename__ = "registrations"

    id = Column(String(64), primary_key=True, index=True)
    pass_id = Column(String(64), unique=True, index=True, nullable=False)
    user_id = Column(String(64), nullable=True, index=True)
    
    event_type = Column(String(50), default="summit")  # "summit", "founder_meet", "general"
    event_id = Column(String(64), nullable=True, index=True)
    event_name = Column(String(200), default="TechTalk 2026")
    
    attendee_name = Column(String(150), nullable=False)
    email = Column(String(255), nullable=False, index=True)
    phone = Column(String(50), nullable=True)
    organization = Column(String(150), nullable=True)
    role = Column(String(150), nullable=True)
    
    pass_type = Column(String(80), default="VISITOR PASS")  # "VISITOR PASS", "STUDENT PASS", "FOUNDER PASS", "DELEGATION PASS"
    amount = Column(String(30), default="FREE")
    badge = Column(String(100), default="Visitor")
    status = Column(String(40), default="Verified")  # "Verified", "Pending", "Cancelled"
    
    checked_in = Column(Boolean, default=False)
    check_in_time = Column(String(50), nullable=True)
    qr_data = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    tags = Column(JSON, default=list)

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

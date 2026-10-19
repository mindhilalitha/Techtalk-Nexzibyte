import datetime
import uuid
from sqlalchemy import Column, String, DateTime, Text, Boolean
from app.database import Base

class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(String(64), primary_key=True, index=True, default=lambda: f"msg_{uuid.uuid4().hex[:10]}")
    name = Column(String(150), nullable=False)
    email = Column(String(255), nullable=False, index=True)
    phone = Column(String(255), nullable=True)
    organization = Column(String(255), nullable=True)
    form_type = Column(String(100), default="contact")
    subject = Column(String(500), default="general")
    message = Column(Text, nullable=False)
    status = Column(String(40), default="unread")  # "unread", "read", "replied"
    is_archived = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Text, JSON
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(64), primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    name = Column(String(120), nullable=False)
    full_name = Column(String(120), nullable=True)
    role = Column(String(30), default="user", nullable=False)  # "admin", "user", "editor"
    title = Column(String(150), default="Tech Community Member")
    bio = Column(Text, nullable=True)
    location = Column(String(120), default="Hyderabad, India")
    phone = Column(String(40), nullable=True)
    avatar_url = Column(String(500), nullable=True)
    avatar_initials = Column(String(8), default="TT")
    skills = Column(JSON, default=list)  # list of strings or skill objects
    
    # Verification & Auth
    is_verified = Column(Boolean, default=False)
    verification_otp = Column(String(10), nullable=True)
    otp_expires_at = Column(DateTime, nullable=True)
    verification_token = Column(String(255), nullable=True)
    reset_password_token = Column(String(255), nullable=True)
    reset_password_otp = Column(String(10), nullable=True)
    reset_password_expires_at = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)

    # Detailed Community Profile & Onboarding Fields
    timezone = Column(String(100), default="(GMT +05:30) Chennai")
    headline = Column(String(255), nullable=True)
    linkedin_url = Column(String(255), nullable=True)
    department = Column(String(100), nullable=True)
    experience_years = Column(String(50), nullable=True)
    job_search_status = Column(String(100), nullable=True)
    job_search_duration = Column(String(100), nullable=True)
    visa_status = Column(String(100), nullable=True)
    career_challenge = Column(String(255), nullable=True)
    mentorship_interest = Column(String(100), nullable=True)
    accountability_group_interest = Column(String(100), nullable=True)
    share_profile_with_partners = Column(String(100), nullable=True)
    referral_source = Column(String(255), nullable=True)
    permission_email_public = Column(Boolean, default=False)
    permission_prevent_messages = Column(Boolean, default=False)
    permission_show_directory = Column(Boolean, default=True)
    profile_completed = Column(Boolean, default=False)

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

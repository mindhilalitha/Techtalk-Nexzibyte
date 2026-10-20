from typing import Optional, List, Any
import datetime
from pydantic import BaseModel, EmailStr

class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    full_name: Optional[str] = None
    title: Optional[str] = None
    headline: Optional[str] = None
    role: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    phone: Optional[str] = None
    skills: Optional[List[Any]] = None
    avatar_url: Optional[str] = None
    timezone: Optional[str] = None
    linkedin_url: Optional[str] = None
    department: Optional[str] = None
    experience_years: Optional[str] = None
    job_search_status: Optional[str] = None
    job_search_duration: Optional[str] = None
    visa_status: Optional[str] = None
    career_challenge: Optional[str] = None
    mentorship_interest: Optional[str] = None
    accountability_group_interest: Optional[str] = None
    share_profile_with_partners: Optional[str] = None
    referral_source: Optional[str] = None
    permission_email_public: Optional[bool] = None
    permission_prevent_messages: Optional[bool] = None
    permission_show_directory: Optional[bool] = None
    profile_completed: Optional[bool] = None

class OnboardingProfileCreate(BaseModel):
    full_name: str
    timezone: Optional[str] = "(GMT +05:30) Chennai"
    headline: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    linkedin_url: Optional[str] = None
    department: Optional[str] = None
    experience_years: Optional[str] = None
    job_search_status: Optional[str] = None
    job_search_duration: Optional[str] = None
    visa_status: Optional[str] = None
    career_challenge: Optional[str] = None
    mentorship_interest: Optional[str] = None
    accountability_group_interest: Optional[str] = None
    share_profile_with_partners: Optional[str] = None
    referral_source: Optional[str] = None
    permission_email_public: Optional[bool] = False
    permission_prevent_messages: Optional[bool] = False
    permission_show_directory: Optional[bool] = True
    avatar_url: Optional[str] = None

class UserOut(BaseModel):
    id: str
    email: EmailStr
    name: str
    full_name: Optional[str] = None
    role: str
    title: Optional[str] = None
    headline: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    avatar_initials: Optional[str] = "TT"
    skills: Optional[List[Any]] = None
    is_verified: bool
    is_active: bool
    timezone: Optional[str] = "(GMT +05:30) Chennai"
    linkedin_url: Optional[str] = None
    department: Optional[str] = None
    experience_years: Optional[str] = None
    job_search_status: Optional[str] = None
    job_search_duration: Optional[str] = None
    visa_status: Optional[str] = None
    career_challenge: Optional[str] = None
    mentorship_interest: Optional[str] = None
    accountability_group_interest: Optional[str] = None
    share_profile_with_partners: Optional[str] = None
    referral_source: Optional[str] = None
    permission_email_public: Optional[bool] = False
    permission_prevent_messages: Optional[bool] = False
    permission_show_directory: Optional[bool] = True
    profile_completed: Optional[bool] = False
    created_at: Optional[datetime.datetime] = None

    class Config:
        from_attributes = True

from typing import Optional, List
import datetime
from pydantic import BaseModel

class SpeakerCreate(BaseModel):
    name: str
    title: Optional[str] = "Technology Leader"
    company: Optional[str] = "NexziByte Ecosystem"
    bio: Optional[str] = None
    expertise: Optional[List[str]] = None
    image_url: Optional[str] = None
    twitter: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    is_featured: Optional[bool] = False

class SpeakerOut(BaseModel):
    id: str
    name: str
    title: Optional[str] = None
    company: Optional[str] = None
    bio: Optional[str] = None
    expertise: Optional[List[str]] = None
    image_url: Optional[str] = None
    image: Optional[str] = None
    twitter: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    is_featured: Optional[bool] = False
    created_at: Optional[datetime.datetime] = None

    class Config:
        from_attributes = True

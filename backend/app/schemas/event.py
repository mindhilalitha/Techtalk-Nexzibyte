from typing import Optional, List, Any
import datetime
from pydantic import BaseModel

class SummitCreate(BaseModel):
    title: str
    slug: Optional[str] = None
    subtitle: Optional[str] = None
    badge: Optional[str] = "UPCOMING FLAGSHIP"
    description: Optional[str] = None
    full_description: Optional[str] = None
    banner_image: Optional[str] = None
    date: str
    time: Optional[str] = "09:00 AM - 06:00 PM IST"
    location: Optional[str] = "Hyderabad, India"
    venue: Optional[str] = "HICC - Hyderabad International Convention Centre"
    address: Optional[str] = None
    max_seats: Optional[int] = 500
    status: Optional[str] = "Upcoming"
    agenda: Optional[List[Any]] = None
    speakers: Optional[List[Any]] = None
    perks: Optional[List[Any]] = None

class SummitOut(BaseModel):
    id: str
    title: str
    slug: Optional[str] = None
    subtitle: Optional[str] = None
    badge: Optional[str] = None
    description: Optional[str] = None
    full_description: Optional[str] = None
    banner_image: Optional[str] = None
    banner: Optional[str] = None
    date: str
    time: Optional[str] = None
    location: Optional[str] = None
    venue: Optional[str] = None
    address: Optional[str] = None
    max_seats: Optional[int] = 500
    registered_count: Optional[int] = 0
    status: Optional[str] = "Upcoming"
    agenda: Optional[List[Any]] = None
    speakers: Optional[List[Any]] = None
    perks: Optional[List[Any]] = None
    created_at: Optional[datetime.datetime] = None

    class Config:
        from_attributes = True

class FounderMeetCreate(BaseModel):
    title: str
    slug: Optional[str] = None
    subtitle: Optional[str] = None
    badge: Optional[str] = "FOUNDER & INVESTOR ROUNDTABLE"
    description: Optional[str] = None
    full_description: Optional[str] = None
    banner_image: Optional[str] = None
    date: str
    time: Optional[str] = "04:00 PM - 08:30 PM IST"
    location: Optional[str] = "Hyderabad, India"
    venue: Optional[str] = "T-Hub Innovation Hub / HITEC City"
    address: Optional[str] = None
    founder_info: Optional[str] = None
    max_seats: Optional[int] = 60
    status: Optional[str] = "Upcoming"
    agenda: Optional[List[Any]] = None
    speakers: Optional[List[Any]] = None
    perks: Optional[List[Any]] = None

class FounderMeetOut(BaseModel):
    id: str
    title: str
    slug: Optional[str] = None
    subtitle: Optional[str] = None
    badge: Optional[str] = None
    description: Optional[str] = None
    full_description: Optional[str] = None
    banner_image: Optional[str] = None
    banner: Optional[str] = None
    date: str
    time: Optional[str] = None
    location: Optional[str] = None
    venue: Optional[str] = None
    address: Optional[str] = None
    founder_info: Optional[str] = None
    max_seats: Optional[int] = 60
    registered_count: Optional[int] = 0
    status: Optional[str] = "Upcoming"
    agenda: Optional[List[Any]] = None
    speakers: Optional[List[Any]] = None
    perks: Optional[List[Any]] = None
    created_at: Optional[datetime.datetime] = None

    class Config:
        from_attributes = True

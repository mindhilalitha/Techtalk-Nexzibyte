from typing import Optional, List, Any
from pydantic import BaseModel

class DashboardStats(BaseModel):
    total_users: int = 1250
    total_posts: int = 340
    published_posts: int = 285
    total_categories: int = 7
    upcoming_summits: int = 4
    upcoming_founder_meets: int = 3
    total_speakers: int = 28
    event_registrations: int = 486
    recent_activity: Optional[List[Any]] = None
    recent_posts: Optional[List[Any]] = None
    upcoming_events: Optional[List[Any]] = None

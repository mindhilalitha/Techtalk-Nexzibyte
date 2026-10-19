from typing import Optional, List
import datetime
from pydantic import BaseModel

class CategoryCreate(BaseModel):
    name: str
    slug: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = "Tag"

class CategoryOut(BaseModel):
    id: str
    name: str
    slug: str
    description: Optional[str] = None
    icon: Optional[str] = "Tag"
    post_count: int = 0
    created_at: Optional[datetime.datetime] = None

    class Config:
        from_attributes = True

class PostCreate(BaseModel):
    title: str
    content: str
    category: Optional[str] = "GENERAL TECH"
    excerpt: Optional[str] = None
    tags: Optional[List[str]] = None
    coverImage: Optional[str] = None
    cover_image: Optional[str] = None
    status: Optional[str] = "Published"
    author_name: Optional[str] = None
    author_role: Optional[str] = None

class PostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    excerpt: Optional[str] = None
    tags: Optional[List[str]] = None
    cover_image: Optional[str] = None
    coverImage: Optional[str] = None
    status: Optional[str] = None

class PostOut(BaseModel):
    id: str
    title: str
    slug: Optional[str] = None
    author_id: Optional[str] = None
    author_name: Optional[str] = None
    author_role: Optional[str] = None
    author_avatar: Optional[str] = None
    category: str
    excerpt: Optional[str] = None
    content: str
    tags: Optional[List[str]] = None
    cover_image: Optional[str] = None
    coverImage: Optional[str] = None
    reading_time: Optional[str] = None
    readingTime: Optional[str] = None
    views: Optional[int] = 1
    likes: Optional[int] = 0
    status: Optional[str] = "Published"
    created_at: Optional[datetime.datetime] = None
    date: Optional[str] = None

    class Config:
        from_attributes = True

class CommentCreate(BaseModel):
    comment: str

class CommentOut(BaseModel):
    id: str
    post_id: str
    user_id: str
    user_name: str
    user_avatar: Optional[str] = None
    comment: str
    created_at: Optional[datetime.datetime] = None

    class Config:
        from_attributes = True

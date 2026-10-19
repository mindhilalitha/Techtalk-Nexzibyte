import datetime
from sqlalchemy import Column, String, Integer, DateTime, Text, JSON, ForeignKey, Boolean
from app.database import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False, index=True)
    slug = Column(String(120), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    icon = Column(String(50), default="Tag")
    post_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Post(Base):
    __tablename__ = "posts"

    id = Column(String(64), primary_key=True, index=True)
    author_id = Column(String(64), nullable=True, index=True)
    author_name = Column(String(120), default="TechTalk Member")
    author_role = Column(String(120), default="Senior Developer")
    author_avatar = Column(String(500), nullable=True)
    
    title = Column(String(300), nullable=False, index=True)
    slug = Column(String(350), nullable=True, index=True)
    category = Column(String(100), default="GENERAL TECH", index=True)
    excerpt = Column(Text, nullable=True)
    content = Column(Text, nullable=False)
    tags = Column(JSON, default=list)
    cover_image = Column(String(500), nullable=True)
    reading_time = Column(String(30), default="5 min read")
    views = Column(Integer, default=1)
    likes = Column(Integer, default=0)
    status = Column(String(30), default="Published", index=True)  # "Published", "Draft", "Archived"
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class Comment(Base):
    __tablename__ = "comments"

    id = Column(String(64), primary_key=True, index=True)
    post_id = Column(String(64), ForeignKey("posts.id", ondelete="CASCADE"), index=True, nullable=False)
    user_id = Column(String(64), nullable=False, index=True)
    user_name = Column(String(120), default="Anonymous")
    user_avatar = Column(String(500), nullable=True)
    comment = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Reaction(Base):
    __tablename__ = "reactions"

    id = Column(String(64), primary_key=True, index=True)
    post_id = Column(String(64), ForeignKey("posts.id", ondelete="CASCADE"), index=True, nullable=False)
    user_id = Column(String(64), nullable=False, index=True)
    reaction_type = Column(String(30), default="like")  # "like", "clap", "insightful"
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class SavedPost(Base):
    __tablename__ = "saved_posts"

    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), nullable=False, index=True)
    post_id = Column(String(64), ForeignKey("posts.id", ondelete="CASCADE"), index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

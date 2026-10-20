import uuid
import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.post import Post, Category, Comment, Reaction, SavedPost
from app.models.user import User
from app.schemas.post import PostCreate, PostUpdate, PostOut, CommentCreate, CommentOut
from app.services.auth_service import get_current_user, get_current_user_optional

router = APIRouter(prefix="/posts", tags=["Technical Posts & Community Content"])

@router.get("", response_model=List[PostOut])
async def list_posts(
    category: Optional[str] = Query(None, description="Filter by Category"),
    status: Optional[str] = Query(None, description="Filter by Status (Published/Draft)"),
    search: Optional[str] = Query(None, description="Search in title or content"),
    author_id: Optional[str] = Query(None, description="Filter by Author"),
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    query = db.query(Post)
    if status:
        query = query.filter(Post.status == status)
    if category and category.upper() != "ALL TOPICS" and category.upper() != "ALL":
        query = query.filter(Post.category.ilike(f"%{category}%"))
    if author_id:
        query = query.filter(Post.author_id == author_id)
    if search:
        s = f"%{search.lower()}%"
        query = query.filter((Post.title.ilike(s)) | (Post.content.ilike(s)) | (Post.excerpt.ilike(s)))
    
    posts = query.order_by(Post.created_at.desc()).offset(offset).limit(limit).all()
    
    # Format dates
    res = []
    for p in posts:
        d = p.__dict__.copy()
        d["date"] = p.created_at.strftime("%b %d, %Y") if p.created_at else "Jan 15, 2026"
        d["readingTime"] = p.reading_time
        d["coverImage"] = p.cover_image
        res.append(d)
    return res

@router.get("/saved", response_model=List[PostOut])
async def get_saved_posts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    saved = db.query(SavedPost).filter(SavedPost.user_id == current_user.id).all()
    post_ids = [s.post_id for s in saved]
    posts = db.query(Post).filter(Post.id.in_(post_ids)).all()
    
    res = []
    for p in posts:
        d = p.__dict__.copy()
        d["date"] = p.created_at.strftime("%b %d, %Y") if p.created_at else "Jan 15, 2026"
        d["readingTime"] = p.reading_time
        d["coverImage"] = p.cover_image
        res.append(d)
    return res

# Category Management Endpoints (placed before /{post_id})
@router.get("/categories")
async def list_categories(db: Session = Depends(get_db)):
    cats = db.query(Category).order_by(Category.name.asc()).all()
    res = []
    for c in cats:
        count = db.query(Post).filter(Post.category.ilike(f"%{c.name}%")).count()
        res.append({
            "id": c.id,
            "name": c.name,
            "slug": c.slug,
            "description": c.description,
            "icon": c.icon,
            "post_count": count or c.post_count or 0
        })
    return res

@router.post("/categories")
async def create_category(payload: dict, db: Session = Depends(get_db)):
    cat_id = f"cat_{uuid.uuid4().hex[:8]}"
    name = payload.get("name", "New Category")
    slug = payload.get("slug") or name.lower().replace(" ", "-").replace("&", "and")
    cat = Category(
        id=cat_id,
        name=name,
        slug=slug,
        description=payload.get("description", ""),
        icon=payload.get("icon", "Tag"),
        post_count=0
    )
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat

@router.put("/categories/{category_id}")
async def update_category(category_id: str, payload: dict, db: Session = Depends(get_db)):
    cat = db.query(Category).filter(Category.id == category_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    if "name" in payload:
        cat.name = payload["name"]
    if "slug" in payload:
        cat.slug = payload["slug"]
    if "description" in payload:
        cat.description = payload["description"]
    if "icon" in payload:
        cat.icon = payload["icon"]
    db.commit()
    db.refresh(cat)
    return cat

@router.delete("/categories/{category_id}")
async def delete_category(category_id: str, db: Session = Depends(get_db)):
    cat = db.query(Category).filter(Category.id == category_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    db.delete(cat)
    db.commit()
    return {"message": "Category deleted successfully"}

@router.get("/{post_id}", response_model=PostOut)
async def get_post_by_id(post_id: str, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found.")
    
    # Increment views
    post.views = (post.views or 0) + 1
    db.commit()
    
    d = post.__dict__.copy()
    d["date"] = post.created_at.strftime("%b %d, %Y") if post.created_at else "Jan 15, 2026"
    d["readingTime"] = post.reading_time
    d["coverImage"] = post.cover_image
    return d

@router.post("", response_model=PostOut)
async def create_post(
    payload: PostCreate,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    author_name = current_user.name if current_user else (payload.author_name or "M. L. S. V. Aiswarya")
    author_role = current_user.title if current_user else (payload.author_role or "Senior Full Stack Developer")
    author_id = current_user.id if current_user else f"usr_guest_{uuid.uuid4().hex[:6]}"
    
    words = len(payload.content.split())
    read_mins = max(1, words // 200)
    reading_time = f"{read_mins} min read"
    
    cover = payload.cover_image or payload.coverImage or "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80"
    post_id = f"post_{uuid.uuid4().hex[:10]}"
    slug = payload.title.lower().replace(" ", "-").replace("/", "-")[:100]

    post = Post(
        id=post_id,
        author_id=author_id,
        author_name=author_name,
        author_role=author_role,
        title=payload.title,
        slug=slug,
        category=payload.category or "GENERAL TECH",
        excerpt=payload.excerpt or payload.content[:140] + "...",
        content=payload.content,
        tags=payload.tags or ["TechTalk", payload.category or "Engineering"],
        cover_image=cover,
        reading_time=reading_time,
        status=payload.status or "Published",
        views=1,
        likes=0
    )
    db.add(post)
    
    # Update category post count
    cat = db.query(Category).filter(Category.name.ilike(post.category)).first()
    if cat:
        cat.post_count += 1

    db.commit()
    db.refresh(post)

    d = post.__dict__.copy()
    d["date"] = post.created_at.strftime("%b %d, %Y") if post.created_at else "Today"
    d["readingTime"] = post.reading_time
    d["coverImage"] = post.cover_image
    return d

@router.put("/{post_id}", response_model=PostOut)
async def update_post(
    post_id: str,
    payload: PostUpdate,
    db: Session = Depends(get_db)
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found.")
    
    if payload.title is not None:
        post.title = payload.title
    if payload.content is not None:
        post.content = payload.content
        words = len(payload.content.split())
        post.reading_time = f"{max(1, words // 200)} min read"
    if payload.category is not None:
        post.category = payload.category
    if payload.excerpt is not None:
        post.excerpt = payload.excerpt
    if payload.tags is not None:
        post.tags = payload.tags
    if payload.cover_image or payload.coverImage:
        post.cover_image = payload.cover_image or payload.coverImage
    if payload.status is not None:
        post.status = payload.status

    db.commit()
    db.refresh(post)

    d = post.__dict__.copy()
    d["date"] = post.created_at.strftime("%b %d, %Y") if post.created_at else "Today"
    d["readingTime"] = post.reading_time
    d["coverImage"] = post.cover_image
    return d

@router.delete("/{post_id}")
async def delete_post(
    post_id: str,
    db: Session = Depends(get_db)
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found.")
    db.delete(post)
    db.commit()
    return {"message": "Post deleted successfully.", "id": post_id}

@router.post("/{post_id}/like")
async def like_post(
    post_id: str,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found.")
    
    post.likes = (post.likes or 0) + 1
    
    if current_user:
        reaction = Reaction(
            id=f"rx_{uuid.uuid4().hex[:8]}",
            post_id=post_id,
            user_id=current_user.id,
            reaction_type="like"
        )
        db.add(reaction)
    db.commit()
    return {"message": "Liked post successfully.", "likes": post.likes}

@router.post("/{post_id}/save")
async def toggle_save_post(
    post_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    saved = db.query(SavedPost).filter(
        SavedPost.user_id == current_user.id,
        SavedPost.post_id == post_id
    ).first()

    if saved:
        db.delete(saved)
        db.commit()
        return {"saved": False, "message": "Post removed from bookmarks."}
    else:
        new_save = SavedPost(
            id=f"sav_{uuid.uuid4().hex[:8]}",
            user_id=current_user.id,
            post_id=post_id
        )
        db.add(new_save)
        db.commit()
        return {"saved": True, "message": "Post bookmarked successfully."}

@router.get("/{post_id}/comments", response_model=List[CommentOut])
async def list_post_comments(post_id: str, db: Session = Depends(get_db)):
    return db.query(Comment).filter(Comment.post_id == post_id).order_by(Comment.created_at.desc()).all()

@router.post("/{post_id}/comments", response_model=CommentOut)
async def add_post_comment(
    post_id: str,
    payload: CommentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    comment = Comment(
        id=f"cmt_{uuid.uuid4().hex[:8]}",
        post_id=post_id,
        user_id=current_user.id,
        user_name=current_user.name,
        user_avatar=current_user.avatar_url,
        comment=payload.comment
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment

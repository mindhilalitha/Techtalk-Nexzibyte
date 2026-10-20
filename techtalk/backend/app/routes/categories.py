import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.post import Category
from app.schemas.post import CategoryCreate, CategoryOut
from app.models.user import User
from app.services.auth_service import get_current_admin

router = APIRouter(prefix="/categories", tags=["Categories Management"])

@router.get("", response_model=List[CategoryOut])
async def list_categories(db: Session = Depends(get_db)):
    return db.query(Category).order_by(Category.name.asc()).all()

@router.post("", response_model=CategoryOut)
async def create_category(
    payload: CategoryCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    slug = payload.slug or payload.name.lower().replace(" ", "-").replace("/", "-")
    existing = db.query(Category).filter((Category.name == payload.name) | (Category.slug == slug)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Category with this name or slug already exists.")
    
    cat = Category(
        id=f"cat_{uuid.uuid4().hex[:8]}",
        name=payload.name,
        slug=slug,
        description=payload.description,
        icon=payload.icon or "Tag"
    )
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat

@router.put("/{category_id}", response_model=CategoryOut)
async def update_category(
    category_id: str,
    payload: CategoryCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    cat = db.query(Category).filter(Category.id == category_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found.")
    cat.name = payload.name
    cat.slug = payload.slug or payload.name.lower().replace(" ", "-")
    cat.description = payload.description
    cat.icon = payload.icon or cat.icon
    db.commit()
    db.refresh(cat)
    return cat

@router.delete("/{category_id}")
async def delete_category(
    category_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    cat = db.query(Category).filter(Category.id == category_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found.")
    db.delete(cat)
    db.commit()
    return {"message": "Category deleted successfully.", "id": category_id}

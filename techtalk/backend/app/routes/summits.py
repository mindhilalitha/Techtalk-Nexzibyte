import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.event import Summit
from app.schemas.event import SummitCreate, SummitOut
from app.models.user import User
from app.services.auth_service import get_current_admin

router = APIRouter(prefix="/summits", tags=["TechTalk Summits Management"])

@router.get("", response_model=List[SummitOut])
async def list_summits(
    status: Optional[str] = Query(None, description="Filter by status (Upcoming/Active/Completed/Archived)"),
    search: Optional[str] = Query(None, description="Search summits"),
    db: Session = Depends(get_db)
):
    query = db.query(Summit)
    if status:
        query = query.filter(Summit.status == status)
    if search:
        s = f"%{search.lower()}%"
        query = query.filter((Summit.title.ilike(s)) | (Summit.description.ilike(s)) | (Summit.venue.ilike(s)))
    
    summits = query.order_by(Summit.created_at.desc()).all()
    res = []
    for s in summits:
        d = s.__dict__.copy()
        d["banner"] = s.banner_image
        res.append(d)
    return res

@router.get("/{summit_id}", response_model=SummitOut)
async def get_summit(summit_id: str, db: Session = Depends(get_db)):
    summit = db.query(Summit).filter(Summit.id == summit_id).first()
    if not summit:
        raise HTTPException(status_code=404, detail="Summit not found.")
    d = summit.__dict__.copy()
    d["banner"] = summit.banner_image
    return d

@router.post("", response_model=SummitOut)
async def create_summit(
    payload: SummitCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    summit_id = f"summit_{uuid.uuid4().hex[:8]}"
    slug = payload.slug or payload.title.lower().replace(" ", "-").replace("/", "-")[:80]
    
    summit = Summit(
        id=summit_id,
        title=payload.title,
        slug=slug,
        subtitle=payload.subtitle,
        badge=payload.badge or "UPCOMING FLAGSHIP",
        description=payload.description,
        full_description=payload.full_description or payload.description,
        banner_image=payload.banner_image,
        date=payload.date,
        time=payload.time or "09:00 AM - 06:00 PM IST",
        location=payload.location or "Hyderabad, India",
        venue=payload.venue or "HICC - Hyderabad International Convention Centre",
        address=payload.address,
        max_seats=payload.max_seats or 500,
        registered_count=0,
        status=payload.status or "Upcoming",
        agenda=payload.agenda or [],
        speakers=payload.speakers or [],
        perks=payload.perks or []
    )
    db.add(summit)
    db.commit()
    db.refresh(summit)
    
    d = summit.__dict__.copy()
    d["banner"] = summit.banner_image
    return d

@router.put("/{summit_id}", response_model=SummitOut)
async def update_summit(
    summit_id: str,
    payload: SummitCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    summit = db.query(Summit).filter(Summit.id == summit_id).first()
    if not summit:
        raise HTTPException(status_code=404, detail="Summit not found.")
    
    summit.title = payload.title
    summit.subtitle = payload.subtitle
    summit.description = payload.description
    summit.full_description = payload.full_description or payload.description
    if payload.banner_image:
        summit.banner_image = payload.banner_image
    summit.date = payload.date
    summit.time = payload.time
    summit.location = payload.location
    summit.venue = payload.venue
    summit.address = payload.address
    summit.max_seats = payload.max_seats
    summit.status = payload.status
    if payload.agenda is not None:
        summit.agenda = payload.agenda
    if payload.speakers is not None:
        summit.speakers = payload.speakers
    if payload.perks is not None:
        summit.perks = payload.perks

    db.commit()
    db.refresh(summit)

    d = summit.__dict__.copy()
    d["banner"] = summit.banner_image
    return d

@router.delete("/{summit_id}")
async def delete_summit(
    summit_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    summit = db.query(Summit).filter(Summit.id == summit_id).first()
    if not summit:
        raise HTTPException(status_code=404, detail="Summit not found.")
    db.delete(summit)
    db.commit()
    return {"message": "Summit deleted successfully.", "id": summit_id}

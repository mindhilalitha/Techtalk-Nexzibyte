import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.event import FounderMeet
from app.schemas.event import FounderMeetCreate, FounderMeetOut
from app.models.user import User
from app.services.auth_service import get_current_admin

router = APIRouter(prefix="/founder-meets", tags=["Founder Meets Management"])

@router.get("", response_model=List[FounderMeetOut])
async def list_founder_meets(
    status: Optional[str] = Query(None, description="Filter by status (Upcoming/Active/Completed/Archived)"),
    search: Optional[str] = Query(None, description="Search founder meets"),
    db: Session = Depends(get_db)
):
    query = db.query(FounderMeet)
    if status:
        query = query.filter(FounderMeet.status == status)
    if search:
        s = f"%{search.lower()}%"
        query = query.filter((FounderMeet.title.ilike(s)) | (FounderMeet.description.ilike(s)) | (FounderMeet.venue.ilike(s)))
    
    meets = query.order_by(FounderMeet.created_at.desc()).all()
    res = []
    for m in meets:
        d = m.__dict__.copy()
        d["banner"] = m.banner_image
        res.append(d)
    return res

@router.get("/{meet_id}", response_model=FounderMeetOut)
async def get_founder_meet(meet_id: str, db: Session = Depends(get_db)):
    meet = db.query(FounderMeet).filter(FounderMeet.id == meet_id).first()
    if not meet:
        raise HTTPException(status_code=404, detail="Founder Meet not found.")
    d = meet.__dict__.copy()
    d["banner"] = meet.banner_image
    return d

@router.post("", response_model=FounderMeetOut)
async def create_founder_meet(
    payload: FounderMeetCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    meet_id = f"meet_{uuid.uuid4().hex[:8]}"
    slug = payload.slug or payload.title.lower().replace(" ", "-").replace("/", "-")[:80]
    
    meet = FounderMeet(
        id=meet_id,
        title=payload.title,
        slug=slug,
        subtitle=payload.subtitle,
        badge=payload.badge or "FOUNDER & INVESTOR ROUNDTABLE",
        description=payload.description,
        full_description=payload.full_description or payload.description,
        banner_image=payload.banner_image,
        date=payload.date,
        time=payload.time or "04:00 PM - 08:30 PM IST",
        location=payload.location or "Hyderabad, India",
        venue=payload.venue or "T-Hub Innovation Hub / HITEC City",
        address=payload.address,
        founder_info=payload.founder_info,
        max_seats=payload.max_seats or 60,
        registered_count=0,
        status=payload.status or "Upcoming",
        agenda=payload.agenda or [],
        speakers=payload.speakers or [],
        perks=payload.perks or []
    )
    db.add(meet)
    db.commit()
    db.refresh(meet)
    
    d = meet.__dict__.copy()
    d["banner"] = meet.banner_image
    return d

@router.put("/{meet_id}", response_model=FounderMeetOut)
async def update_founder_meet(
    meet_id: str,
    payload: FounderMeetCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    meet = db.query(FounderMeet).filter(FounderMeet.id == meet_id).first()
    if not meet:
        raise HTTPException(status_code=404, detail="Founder Meet not found.")
    
    meet.title = payload.title
    meet.subtitle = payload.subtitle
    meet.description = payload.description
    meet.full_description = payload.full_description or payload.description
    if payload.banner_image:
        meet.banner_image = payload.banner_image
    meet.date = payload.date
    meet.time = payload.time
    meet.location = payload.location
    meet.venue = payload.venue
    meet.address = payload.address
    meet.founder_info = payload.founder_info
    meet.max_seats = payload.max_seats
    meet.status = payload.status
    if payload.agenda is not None:
        meet.agenda = payload.agenda
    if payload.speakers is not None:
        meet.speakers = payload.speakers
    if payload.perks is not None:
        meet.perks = payload.perks

    db.commit()
    db.refresh(meet)

    d = meet.__dict__.copy()
    d["banner"] = meet.banner_image
    return d

@router.delete("/{meet_id}")
async def delete_founder_meet(
    meet_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    meet = db.query(FounderMeet).filter(FounderMeet.id == meet_id).first()
    if not meet:
        raise HTTPException(status_code=404, detail="Founder Meet not found.")
    db.delete(meet)
    db.commit()
    return {"message": "Founder Meet deleted successfully.", "id": meet_id}

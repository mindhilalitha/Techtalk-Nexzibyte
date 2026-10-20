import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.speaker import Speaker
from app.schemas.speaker import SpeakerCreate, SpeakerOut
from app.models.user import User
from app.services.auth_service import get_current_admin

router = APIRouter(prefix="/speakers", tags=["Speakers & Founders Management"])

@router.get("", response_model=List[SpeakerOut])
async def list_speakers(
    search: Optional[str] = Query(None, description="Search by name or company"),
    featured: Optional[bool] = Query(None, description="Filter by featured"),
    db: Session = Depends(get_db)
):
    query = db.query(Speaker)
    if featured is not None:
        query = query.filter(Speaker.is_featured == featured)
    if search:
        s = f"%{search.lower()}%"
        query = query.filter((Speaker.name.ilike(s)) | (Speaker.company.ilike(s)) | (Speaker.title.ilike(s)))
    
    speakers = query.order_by(Speaker.name.asc()).all()
    res = []
    for spk in speakers:
        d = spk.__dict__.copy()
        d["image"] = spk.image_url
        res.append(d)
    return res

@router.get("/{speaker_id}", response_model=SpeakerOut)
async def get_speaker(speaker_id: str, db: Session = Depends(get_db)):
    speaker = db.query(Speaker).filter(Speaker.id == speaker_id).first()
    if not speaker:
        raise HTTPException(status_code=404, detail="Speaker not found.")
    d = speaker.__dict__.copy()
    d["image"] = speaker.image_url
    return d

@router.post("", response_model=SpeakerOut)
async def create_speaker(
    payload: SpeakerCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    spk_id = f"spk_{uuid.uuid4().hex[:8]}"
    speaker = Speaker(
        id=spk_id,
        name=payload.name,
        title=payload.title or "Technology Leader",
        company=payload.company or "NexziByte Ecosystem",
        bio=payload.bio,
        expertise=payload.expertise or [],
        image_url=payload.image_url,
        twitter=payload.twitter,
        linkedin=payload.linkedin,
        github=payload.github,
        is_featured=payload.is_featured or False
    )
    db.add(speaker)
    db.commit()
    db.refresh(speaker)

    d = speaker.__dict__.copy()
    d["image"] = speaker.image_url
    return d

@router.put("/{speaker_id}", response_model=SpeakerOut)
async def update_speaker(
    speaker_id: str,
    payload: SpeakerCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    speaker = db.query(Speaker).filter(Speaker.id == speaker_id).first()
    if not speaker:
        raise HTTPException(status_code=404, detail="Speaker not found.")
    
    speaker.name = payload.name
    speaker.title = payload.title
    speaker.company = payload.company
    speaker.bio = payload.bio
    if payload.expertise is not None:
        speaker.expertise = payload.expertise
    if payload.image_url:
        speaker.image_url = payload.image_url
    speaker.twitter = payload.twitter
    speaker.linkedin = payload.linkedin
    speaker.github = payload.github
    speaker.is_featured = payload.is_featured

    db.commit()
    db.refresh(speaker)

    d = speaker.__dict__.copy()
    d["image"] = speaker.image_url
    return d

@router.delete("/{speaker_id}")
async def delete_speaker(
    speaker_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    speaker = db.query(Speaker).filter(Speaker.id == speaker_id).first()
    if not speaker:
        raise HTTPException(status_code=404, detail="Speaker not found.")
    db.delete(speaker)
    db.commit()
    return {"message": "Speaker deleted successfully.", "id": speaker_id}

import uuid
import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from app.database import get_db, Base, engine
from app.models.contact_message import ContactMessage

# Ensure table exists
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"[Contact DB Notice]: {e}")

router = APIRouter(prefix="/contact", tags=["Contact & Inquiries"])

class ContactMessageCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    organization: Optional[str] = None
    form_type: Optional[str] = None
    subject: Optional[str] = "general"
    message: str

class ContactMessageOut(BaseModel):
    id: str
    name: str
    email: str
    phone: Optional[str] = None
    organization: Optional[str] = None
    form_type: Optional[str] = "contact"
    subject: Optional[str] = "general"
    message: str
    status: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True

@router.post("", status_code=status.HTTP_201_CREATED)
async def submit_contact_message(payload: ContactMessageCreate, db: Session = Depends(get_db)):
    if not payload.name or not payload.email or not payload.message:
        raise HTTPException(status_code=400, detail="Name, email and message are required.")
    
    sub = (payload.subject or "general").strip()[:500]
    sub_lower = sub.lower()
    
    # Auto-classify form type if not explicitly supplied
    ft = payload.form_type
    if not ft:
        if "host" in sub_lower:
            ft = "host_proposal"
        elif "speaker" in sub_lower:
            ft = "speaker_proposal"
        elif "partner" in sub_lower:
            ft = "partnership"
        elif "internship" in sub_lower:
            ft = "internship"
        elif "course" in sub_lower:
            ft = "course"
        else:
            ft = "contact"
            
    org = (payload.organization or "").strip()[:255] if payload.organization else None
    
    new_msg = ContactMessage(
        id=f"msg_{uuid.uuid4().hex[:10]}",
        name=payload.name.strip()[:150],
        email=payload.email.strip().lower()[:255],
        phone=payload.phone.strip()[:255] if payload.phone else None,
        organization=org,
        form_type=ft[:100],
        subject=sub,
        message=payload.message.strip(),
        status="unread",
        created_at=datetime.datetime.utcnow()
    )
    
    db.add(new_msg)
    db.commit()
    db.refresh(new_msg)
    
    return {
        "success": True,
        "message": "Your proposal/message has been successfully recorded in NexziByte database and dispatched to the Admin team.",
        "id": new_msg.id
    }

@router.get("/messages")
async def get_all_contact_messages(db: Session = Depends(get_db)):
    messages = db.query(ContactMessage).order_by(ContactMessage.created_at.desc()).all()
    return [
        {
            "id": m.id,
            "name": m.name,
            "email": m.email,
            "phone": m.phone or "Not provided",
            "organization": m.organization or "N/A",
            "form_type": m.form_type or "contact",
            "subject": m.subject,
            "message": m.message,
            "status": m.status,
            "created_at": m.created_at.strftime("%b %d, %Y • %I:%M %p") if m.created_at else "Recently"
        }
        for m in messages
    ]

@router.patch("/messages/{msg_id}/toggle-status")
async def toggle_message_status(msg_id: str, db: Session = Depends(get_db)):
    msg = db.query(ContactMessage).filter(ContactMessage.id == msg_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found.")
    
    msg.status = "read" if msg.status == "unread" else "unread"
    db.commit()
    return {"success": True, "status": msg.status}

@router.delete("/messages/{msg_id}")
async def delete_message(msg_id: str, db: Session = Depends(get_db)):
    msg = db.query(ContactMessage).filter(ContactMessage.id == msg_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found.")
    
    db.delete(msg)
    db.commit()
    return {"success": True, "message": "Message deleted."}

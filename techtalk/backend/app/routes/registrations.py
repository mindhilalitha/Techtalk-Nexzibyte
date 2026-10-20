import uuid
import random
import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.registration import Registration
from app.schemas.registration import PassRegisterRequest, PassOut
from app.models.user import User
from app.services.auth_service import get_current_user_optional, get_current_admin
from app.services.email_service import send_payment_confirmation_email

router = APIRouter(prefix="/passes", tags=["Event Registrations & Digital Passes"])

@router.get("", response_model=List[PassOut])
async def list_passes(
    email: Optional[str] = Query(None, description="Filter by attendee email"),
    event_id: Optional[str] = Query(None, description="Filter by Event"),
    search: Optional[str] = Query(None, description="Search by name, pass ID, or email"),
    db: Session = Depends(get_db)
):
    query = db.query(Registration)
    if email:
        query = query.filter(Registration.email.ilike(email.strip()))
    if event_id:
        query = query.filter(Registration.event_id == event_id)
    if search:
        s = f"%{search.lower()}%"
        query = query.filter((Registration.attendee_name.ilike(s)) | (Registration.pass_id.ilike(s)) | (Registration.email.ilike(s)))
    
    passes = query.order_by(Registration.created_at.desc()).all()
    res = []
    for p in passes:
        d = p.__dict__.copy()
        d["passId"] = p.pass_id
        d["holder"] = p.attendee_name.upper()
        d["passType"] = p.pass_type
        d["price"] = p.amount
        d["checkedIn"] = p.checked_in
        res.append(d)
    return res

@router.get("/{pass_id}", response_model=PassOut)
async def get_pass_by_id(pass_id: str, db: Session = Depends(get_db)):
    reg = db.query(Registration).filter((Registration.pass_id == pass_id) | (Registration.id == pass_id)).first()
    if not reg:
        raise HTTPException(status_code=404, detail="Pass not found.")
    d = reg.__dict__.copy()
    d["passId"] = reg.pass_id
    d["holder"] = reg.attendee_name.upper()
    d["passType"] = reg.pass_type
    d["price"] = reg.amount
    d["checkedIn"] = reg.checked_in
    return d

@router.post("/register", response_model=PassOut)
async def register_pass(
    payload: PassRegisterRequest,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    attendee_name = payload.attendee_name or payload.attendeeName or (current_user.name if current_user else "ATTENDEE")
    email = payload.email.lower().strip()
    contact = payload.phone or payload.contact or "+91 98765 43210"
    pass_type_raw = (payload.pass_type or payload.passType or "VISITOR PASS").upper()
    
    if "STUDENT" in pass_type_raw:
        resolved_type = "STUDENT PASS"
        resolved_price = payload.amount or "₹99"
        badge = "Student & Researcher"
        qr_code_type = "STUDENT"
    elif "FOUNDER" in pass_type_raw:
        resolved_type = "FOUNDER PASS"
        resolved_price = payload.amount or "₹499"
        badge = "Founder & CXO"
        qr_code_type = "FOUNDER"
    elif "DELEGAT" in pass_type_raw:
        resolved_type = "DELEGATION PASS"
        resolved_price = payload.amount or "₹250"
        badge = "Corporate Delegate"
        qr_code_type = "DELEGATE"
    else:
        resolved_type = "VISITOR PASS"
        resolved_price = "FREE"
        badge = "Community Visitor"
        qr_code_type = "VISITOR"

    random_num = random.randint(100000, 999999)
    new_pass_id = f"TT26-{random_num}"
    qr_data = f"TECHTALK:{new_pass_id}:{attendee_name.upper()}:{qr_code_type}:{resolved_price}:VERIFIED"

    reg = Registration(
        id=f"reg_{uuid.uuid4().hex[:10]}",
        pass_id=new_pass_id,
        user_id=current_user.id if current_user else None,
        event_type=payload.event_type or "summit",
        event_id=payload.event_id,
        attendee_name=attendee_name,
        email=email,
        phone=contact,
        organization=payload.organization or "",
        role=payload.role or "",
        pass_type=resolved_type,
        amount=resolved_price,
        badge=badge,
        status="Verified",
        checked_in=False,
        qr_data=qr_data,
        notes=payload.notes or "",
        tags=["Secure", "Unique", "Contactless", badge]
    )

    db.add(reg)
    db.commit()
    db.refresh(reg)

    # Dispatch branded payment receipt & digital entry pass email to attendee
    try:
        resolved_payment_method = payload.payment_method or payload.paymentMethod or "Online Payment (UPI / Net Banking)"
        resolved_txn = payload.txn_id or payload.txnId or f"TXN-IN-{random.randint(10000000, 99999999)}"
        await send_payment_confirmation_email(
            to_email=email,
            attendee_name=attendee_name,
            pass_id=new_pass_id,
            pass_type=resolved_type,
            amount=resolved_price,
            payment_method=resolved_payment_method,
            txn_id=resolved_txn,
            organization=payload.organization or "NexziByte Community",
            role=payload.role or badge,
            qr_data=qr_data,
            notes=payload.notes
        )
    except Exception as e:
        # Don't fail the registration if email network encounters issues
        print(f"[WARN] Error dispatching payment confirmation email: {e}")

    d = reg.__dict__.copy()
    d["passId"] = reg.pass_id
    d["holder"] = reg.attendee_name.upper()
    d["passType"] = reg.pass_type
    d["price"] = reg.amount
    d["checkedIn"] = reg.checked_in
    return d

@router.post("/{pass_id}/check-in")
async def check_in_pass(pass_id: str, db: Session = Depends(get_db)):
    reg = db.query(Registration).filter((Registration.pass_id == pass_id) | (Registration.id == pass_id)).first()
    if not reg:
        raise HTTPException(status_code=404, detail="Pass not found.")
    
    check_in_time = datetime.datetime.now().strftime("%I:%M %p")
    reg.checked_in = True
    reg.check_in_time = check_in_time
    db.commit()

    return {
        "message": f"Check-in verified for Pass {reg.pass_id}! Welcome to TechTalk 2026.",
        "pass_id": reg.pass_id,
        "attendee": reg.attendee_name,
        "checked_in": True,
        "check_in_time": check_in_time
    }

@router.post("/{pass_id}/reset-check-in")
async def reset_check_in(pass_id: str, db: Session = Depends(get_db)):
    reg = db.query(Registration).filter((Registration.pass_id == pass_id) | (Registration.id == pass_id)).first()
    if not reg:
        raise HTTPException(status_code=404, detail="Pass not found.")
    
    reg.checked_in = False
    reg.check_in_time = None
    db.commit()

    return {
        "message": f"Check-in reset for Pass {reg.pass_id}. Ready for scan.",
        "pass_id": reg.pass_id,
        "checked_in": False
    }

@router.patch("/{registration_id}/status")
async def update_registration_status(
    registration_id: str,
    status: str = Query(..., description="New status (Verified/Cancelled/Pending)"),
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    reg = db.query(Registration).filter(Registration.id == registration_id).first()
    if not reg:
        raise HTTPException(status_code=404, detail="Registration not found.")
    reg.status = status
    db.commit()
    return {"message": f"Registration status updated to {status}.", "id": registration_id, "status": status}

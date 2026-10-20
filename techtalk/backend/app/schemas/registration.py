from typing import Optional, List
import datetime
from pydantic import BaseModel, EmailStr

class PassRegisterRequest(BaseModel):
    attendee_name: Optional[str] = None
    attendeeName: Optional[str] = None
    email: EmailStr
    phone: Optional[str] = None
    contact: Optional[str] = None
    organization: Optional[str] = None
    role: Optional[str] = None
    pass_type: Optional[str] = None
    passType: Optional[str] = None
    amount: Optional[str] = "FREE"
    payment_method: Optional[str] = None
    paymentMethod: Optional[str] = None
    txn_id: Optional[str] = None
    txnId: Optional[str] = None
    notes: Optional[str] = None
    event_id: Optional[str] = None
    event_type: Optional[str] = "general"

class PassOut(BaseModel):
    id: str
    pass_id: str
    passId: Optional[str] = None
    holder: Optional[str] = None
    attendee_name: str
    email: str
    phone: Optional[str] = None
    contact: Optional[str] = None
    organization: Optional[str] = None
    role: Optional[str] = None
    pass_type: str
    passType: Optional[str] = None
    amount: str
    price: Optional[str] = None
    badge: Optional[str] = None
    status: str
    checked_in: bool = False
    checkedIn: Optional[bool] = False
    check_in_time: Optional[str] = None
    qr_data: Optional[str] = None
    notes: Optional[str] = None
    created_at: Optional[datetime.datetime] = None

    class Config:
        from_attributes = True

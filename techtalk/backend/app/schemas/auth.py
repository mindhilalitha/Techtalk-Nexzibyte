from typing import Optional
from pydantic import BaseModel, EmailStr

class UserRegister(BaseModel):
    email: EmailStr
    password: Optional[str] = "Pass1234!"
    name: Optional[str] = None
    full_name: Optional[str] = None
    phone: Optional[str] = None
    role: Optional[str] = "user"
    title: Optional[str] = None
    organization: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    name: Optional[str] = None

class VerifyEmailOTP(BaseModel):
    email: EmailStr
    code: str

class ResendOTP(BaseModel):
    email: EmailStr

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = "bearer"
    user: dict
    otp_demo: Optional[str] = None

class LoginResponse(BaseModel):
    otp_required: bool = True
    email: EmailStr
    message: str
    access_token: Optional[str] = None
    token_type: Optional[str] = "bearer"
    user: Optional[dict] = None

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ForgotPasswordResponse(BaseModel):
    success: bool = True
    message: str
    email: str
    otp_demo: Optional[str] = None
    token_demo: Optional[str] = None

class ResetPasswordRequest(BaseModel):
    token: Optional[str] = None
    email: Optional[EmailStr] = None
    code: Optional[str] = None
    new_password: str

class ResetPasswordResponse(BaseModel):
    success: bool = True
    message: str
    access_token: Optional[str] = None
    token_type: Optional[str] = "bearer"



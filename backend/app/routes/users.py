from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserProfileUpdate, UserOut
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/users", tags=["Users Management"])

@router.get("", response_model=List[UserOut])
async def list_users(
    search: Optional[str] = Query(None, description="Search by name, email, or role"),
    role: Optional[str] = Query(None, description="Filter by role"),
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    """View all registered user logins and accounts in the system"""
    query = db.query(User)
    if role:
        query = query.filter(User.role == role)
    if search:
        s = f"%{search.lower()}%"
        query = query.filter((User.name.ilike(s)) | (User.email.ilike(s)) | (User.title.ilike(s)))
    
    users = query.order_by(User.created_at.desc()).offset(offset).limit(limit).all()
    return users

@router.get("/logins")
async def view_all_logins(db: Session = Depends(get_db)):
    """Summary of all registered logins, emails, verification status, and dates"""
    users = db.query(User).order_by(User.created_at.desc()).all()
    return {
        "total_logins": len(users),
        "accounts": [
            {
                "id": u.id,
                "name": u.name,
                "email": u.email,
                "role": u.role,
                "is_verified": u.is_verified,
                "is_active": u.is_active,
                "registered_at": u.created_at.strftime("%Y-%m-%d %H:%M:%S") if u.created_at else "N/A"
            }
            for u in users
        ]
    }

@router.delete("/clear-all")
async def delete_all_users(db: Session = Depends(get_db)):
    """Remove and clear all user accounts from the database"""
    count = db.query(User).delete()
    db.commit()
    return {"message": f"Successfully removed {count} user account(s). Database is now clean.", "deleted_count": count}

@router.get("/{user_id}", response_model=UserOut)
async def get_user_by_id(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter((User.id == user_id) | (User.email == user_id)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.delete("/{user_id_or_email}")
async def delete_user(user_id_or_email: str, db: Session = Depends(get_db)):
    """Delete and remove a specific user account by ID or Email address"""
    user = db.query(User).filter((User.id == user_id_or_email) | (User.email == user_id_or_email)).first()
    if not user:
        raise HTTPException(status_code=404, detail=f"User '{user_id_or_email}' not found.")
    
    deleted_email = user.email
    db.delete(user)
    db.commit()
    return {"message": f"User account '{deleted_email}' successfully deleted.", "email": deleted_email}

@router.post("/onboarding")
@router.post("/create-profile")
async def create_or_update_onboarding_profile(
    payload: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Save full community onboarding profile (matching exact fields in photo)"""
    if payload.full_name is not None:
        current_user.full_name = payload.full_name
        current_user.name = payload.full_name
        current_user.avatar_initials = "".join([p[0] for p in payload.full_name.split() if p])[:2].upper() or "TT"
    if payload.name is not None:
        current_user.name = payload.name

    if payload.timezone is not None:
        current_user.timezone = payload.timezone
    if payload.headline is not None:
        current_user.headline = payload.headline
        current_user.title = payload.headline
    if payload.bio is not None:
        current_user.bio = payload.bio
    if payload.location is not None:
        current_user.location = payload.location
    if payload.linkedin_url is not None:
        current_user.linkedin_url = payload.linkedin_url
    if payload.department is not None:
        current_user.department = payload.department
    if payload.experience_years is not None:
        current_user.experience_years = payload.experience_years
    if payload.job_search_status is not None:
        current_user.job_search_status = payload.job_search_status
    if payload.job_search_duration is not None:
        current_user.job_search_duration = payload.job_search_duration
    if payload.visa_status is not None:
        current_user.visa_status = payload.visa_status
    if payload.career_challenge is not None:
        current_user.career_challenge = payload.career_challenge
    if payload.mentorship_interest is not None:
        current_user.mentorship_interest = payload.mentorship_interest
    if payload.accountability_group_interest is not None:
        current_user.accountability_group_interest = payload.accountability_group_interest
    if payload.share_profile_with_partners is not None:
        current_user.share_profile_with_partners = payload.share_profile_with_partners
    if payload.referral_source is not None:
        current_user.referral_source = payload.referral_source
    if payload.permission_email_public is not None:
        current_user.permission_email_public = payload.permission_email_public
    if payload.permission_prevent_messages is not None:
        current_user.permission_prevent_messages = payload.permission_prevent_messages
    if payload.permission_show_directory is not None:
        current_user.permission_show_directory = payload.permission_show_directory
    if payload.avatar_url is not None:
        current_user.avatar_url = payload.avatar_url

    current_user.profile_completed = True
    db.commit()
    db.refresh(current_user)

    return {
        "message": "Community profile created successfully! Welcome aboard.",
        "user": current_user
    }

@router.put("/profile")
async def update_profile(
    payload: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if payload.name is not None:
        current_user.name = payload.name
        current_user.avatar_initials = "".join([p[0] for p in payload.name.split() if p])[:2].upper()
    if payload.full_name is not None:
        current_user.full_name = payload.full_name
    if payload.title is not None:
        current_user.title = payload.title
    if payload.headline is not None:
        current_user.headline = payload.headline
        current_user.title = payload.headline
    if payload.bio is not None:
        current_user.bio = payload.bio
    if payload.location is not None:
        current_user.location = payload.location
    if payload.phone is not None:
        current_user.phone = payload.phone
    if payload.skills is not None:
        current_user.skills = payload.skills
    if payload.avatar_url is not None:
        current_user.avatar_url = payload.avatar_url
    if payload.timezone is not None:
        current_user.timezone = payload.timezone
    if payload.linkedin_url is not None:
        current_user.linkedin_url = payload.linkedin_url
    if payload.department is not None:
        current_user.department = payload.department
    if payload.experience_years is not None:
        current_user.experience_years = payload.experience_years
    if payload.job_search_status is not None:
        current_user.job_search_status = payload.job_search_status
    if payload.job_search_duration is not None:
        current_user.job_search_duration = payload.job_search_duration
    if payload.visa_status is not None:
        current_user.visa_status = payload.visa_status
    if payload.career_challenge is not None:
        current_user.career_challenge = payload.career_challenge
    if payload.mentorship_interest is not None:
        current_user.mentorship_interest = payload.mentorship_interest
    if payload.accountability_group_interest is not None:
        current_user.accountability_group_interest = payload.accountability_group_interest
    if payload.share_profile_with_partners is not None:
        current_user.share_profile_with_partners = payload.share_profile_with_partners
    if payload.referral_source is not None:
        current_user.referral_source = payload.referral_source
    if payload.permission_email_public is not None:
        current_user.permission_email_public = payload.permission_email_public
    if payload.permission_prevent_messages is not None:
        current_user.permission_prevent_messages = payload.permission_prevent_messages
    if payload.permission_show_directory is not None:
        current_user.permission_show_directory = payload.permission_show_directory

    db.commit()
    db.refresh(current_user)

    return {
        "message": "Profile updated successfully.",
        "user": current_user
    }

@router.patch("/{user_id}/toggle-status")
async def toggle_user_active_status(
    user_id: str,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = not user.is_active
    db.commit()
    return {"message": f"User {'activated' if user.is_active else 'deactivated'} successfully.", "is_active": user.is_active}

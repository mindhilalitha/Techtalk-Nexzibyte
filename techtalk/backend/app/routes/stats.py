from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.stats_service import get_comprehensive_admin_dashboard

router = APIRouter(prefix="/stats", tags=["Admin Dashboard & Analytics"])

@router.get("/dashboard")
async def get_dashboard_statistics(db: Session = Depends(get_db)):
    metrics = get_comprehensive_admin_dashboard(db)
    return {
        "total_users": metrics["overview"]["total_members"],
        "total_posts": metrics["overview"]["total_dispatches"],
        "published_posts": metrics["overview"]["total_dispatches"],
        "total_categories": metrics["overview"]["total_categories"],
        "upcoming_summits": metrics["overview"]["total_summits"],
        "upcoming_founder_meets": metrics["overview"]["total_founder_meets"],
        "total_speakers": metrics["overview"]["total_speakers"],
        "event_registrations": metrics["overview"]["total_passes_issued"]
    }

@router.get("/admin-dashboard")
async def get_admin_dashboard_full(db: Session = Depends(get_db)):
    """Returns complete admin statistics, site visitor metrics, member pass status, and analytics"""
    return get_comprehensive_admin_dashboard(db)


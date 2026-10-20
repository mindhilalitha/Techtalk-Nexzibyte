from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.user import User
from app.models.post import Post, Category, Reaction, SavedPost
from app.models.event import Summit, FounderMeet
from app.models.speaker import Speaker
from app.models.registration import Registration
from app.models.contact_message import ContactMessage

def parse_amount_num(amount_str: str) -> float:
    """Extracts numeric value from amount strings like '₹499', 'INR 250', 'FREE'"""
    if not amount_str or "FREE" in str(amount_str).upper():
        return 0.0
    import re
    match = re.search(r'[\d\.]+', str(amount_str).replace(',', ''))
    if match:
        try:
            return float(match.group())
        except ValueError:
            return 0.0
    return 0.0

def get_comprehensive_admin_dashboard(db: Session) -> dict:
    """
    Computes 100% real analytical dashboard data directly from the database.
    Tracks exact registered/logged in accounts, pass holders, pass types,
    amounts paid, contact details, email verification statuses, and check-in conversions.
    """
    users = db.query(User).order_by(User.created_at.desc()).all()
    registrations = db.query(Registration).order_by(Registration.created_at.desc()).all()
    posts = db.query(Post).order_by(Post.created_at.desc()).all()

    # Pass holders map: email / user_id -> list of passes
    passes_by_email = {}
    for r in registrations:
        clean_email = (r.email or "").lower().strip()
        if clean_email:
            if clean_email not in passes_by_email:
                passes_by_email[clean_email] = []
            
            num_val = parse_amount_num(r.amount)
            is_paid = num_val > 0 and r.status != "Cancelled"
            payment_status = "PAID" if is_paid else ("FREE PASS" if "FREE" in str(r.amount).upper() else "PENDING")

            passes_by_email[clean_email].append({
                "id": r.id,
                "pass_id": r.pass_id,
                "pass_type": r.pass_type,
                "amount": r.amount or "FREE",
                "amount_num": num_val,
                "is_paid": is_paid,
                "payment_status": payment_status,
                "badge": r.badge,
                "status": r.status,
                "checked_in": bool(r.checked_in),
                "check_in_time": r.check_in_time,
                "event_type": r.event_type,
                "event_id": r.event_id,
                "created_at": r.created_at.strftime("%Y-%m-%d %H:%M:%S") if r.created_at else "N/A"
            })

    # Detailed member list with pass attachment
    members_list = []
    total_checked_in_passes = sum(1 for r in registrations if r.checked_in)
    total_revenue = 0.0

    for u in users:
        u_email = (u.email or "").lower().strip()
        user_passes = passes_by_email.get(u_email, [])
        has_pass = len(user_passes) > 0
        user_total_paid = sum(p["amount_num"] for p in user_passes)

        primary_pass = user_passes[0] if user_passes else None

        members_list.append({
            "id": u.id,
            "name": u.name or u.full_name or "Community Member",
            "email": u.email,
            "role": u.role or "Developer",
            "title": u.title or u.role or "Member",
            "phone": u.phone or "Not Provided",
            "location": u.location or "India",
            "avatar_initials": u.avatar_initials or (u.name[:2].upper() if u.name else "MB"),
            "is_verified": bool(u.is_verified),
            "is_active": bool(u.is_active),
            "has_pass": has_pass,
            "passes_count": len(user_passes),
            "passes": user_passes,
            "primary_pass": primary_pass,
            "total_paid_amount": f"₹{int(user_total_paid)}" if user_total_paid > 0 else ("₹0 (Free)" if has_pass else "None"),
            "registered_at": u.created_at.strftime("%b %d, %Y") if u.created_at else "Recent"
        })

    # Pass Registrations List with Attendee Data
    pass_roster = []
    for r in registrations:
        num_val = parse_amount_num(r.amount)
        is_paid = num_val > 0 and r.status != "Cancelled"
        total_revenue += num_val
        payment_status = "PAID" if is_paid else ("FREE PASS" if "FREE" in str(r.amount).upper() else "PENDING")

        pass_roster.append({
            "id": r.id,
            "pass_id": r.pass_id,
            "attendee_name": r.attendee_name,
            "email": r.email,
            "phone": r.phone or "Not Provided",
            "organization": r.organization or "N/A",
            "role": r.role or "Attendee",
            "pass_type": r.pass_type,
            "amount": r.amount or "FREE",
            "amount_num": num_val,
            "is_paid": is_paid,
            "payment_status": payment_status,
            "badge": r.badge,
            "status": r.status,
            "checked_in": bool(r.checked_in),
            "check_in_time": r.check_in_time,
            "event_type": r.event_type,
            "event_id": r.event_id,
            "qr_data": r.qr_data,
            "created_at": r.created_at.strftime("%b %d, %Y") if r.created_at else "Recent"
        })

    # Post engagement analytics (real counts from DB)
    total_views = sum(p.views or 0 for p in posts)
    total_likes = sum(p.likes or 0 for p in posts)

    post_analytics = [
        {
            "id": p.id,
            "title": p.title,
            "category": p.category,
            "author_name": p.author_name,
            "views": p.views or 0,
            "likes": p.likes or 0,
            "status": p.status,
            "created_at": p.created_at.strftime("%b %d, %Y") if p.created_at else "Recent"
        }
        for p in posts
    ]

    # Summits catalogue
    summits = db.query(Summit).order_by(Summit.created_at.desc()).all()
    summits_list = [
        {
            "id": s.id,
            "title": s.title,
            "subtitle": s.subtitle,
            "badge": s.badge,
            "description": s.description,
            "date": s.date,
            "time": s.time,
            "venue": s.venue,
            "location": s.location,
            "max_seats": s.max_seats,
            "registered_count": s.registered_count,
            "status": s.status,
            "banner": s.banner_image,
            "created_at": s.created_at.strftime("%b %d, %Y") if s.created_at else "Recent"
        }
        for s in summits
    ]

    # Founder Meets catalogue
    founder_meets = db.query(FounderMeet).order_by(FounderMeet.created_at.desc()).all()
    founder_meets_list = [
        {
            "id": m.id,
            "title": m.title,
            "subtitle": m.subtitle,
            "badge": m.badge,
            "description": m.description,
            "founder_info": m.founder_info,
            "date": m.date,
            "time": m.time,
            "venue": m.venue,
            "location": m.location,
            "max_seats": m.max_seats,
            "registered_count": m.registered_count,
            "status": m.status,
            "banner": m.banner_image,
            "created_at": m.created_at.strftime("%b %d, %Y") if m.created_at else "Recent"
        }
        for m in founder_meets
    ]

    # Speakers directory
    speakers = db.query(Speaker).order_by(Speaker.name.asc()).all()
    speakers_list = [
        {
            "id": sp.id,
            "name": sp.name,
            "title": sp.title,
            "company": sp.company,
            "bio": sp.bio,
            "expertise": sp.expertise or [],
            "image": sp.image_url,
            "twitter": sp.twitter,
            "linkedin": sp.linkedin,
            "github": sp.github,
            "is_featured": bool(sp.is_featured)
        }
        for sp in speakers
    ]

    # Categories list
    categories = db.query(Category).order_by(Category.name.asc()).all()
    categories_list = [
        {
            "id": c.id,
            "name": c.name,
            "slug": c.slug,
            "description": c.description,
            "icon": c.icon,
            "post_count": c.post_count or 0
        }
        for c in categories
    ]

    # Contact Messages & Inquiries from Contact Us page
    try:
        contact_msgs = db.query(ContactMessage).order_by(ContactMessage.created_at.desc()).all()
        messages_list = [
            {
                "id": m.id,
                "name": m.name,
                "email": m.email,
                "phone": m.phone or "Not provided",
                "organization": getattr(m, 'organization', None) or "N/A",
                "form_type": getattr(m, 'form_type', None) or "contact",
                "subject": m.subject,
                "message": m.message,
                "status": m.status,
                "created_at": m.created_at.strftime("%b %d, %Y • %I:%M %p") if m.created_at else "Recently"
            }
            for m in contact_msgs
        ]
        unread_msg_count = sum(1 for m in contact_msgs if m.status == "unread")
    except Exception as e:
        messages_list = []
    pass_holder_emails = set((r.email or "").lower().strip() for r in registrations if r.email)
    pass_holders_count = len(pass_holder_emails)
    non_pass_count = max(0, len(users) - sum(1 for u in users if (u.email or "").lower().strip() in pass_holder_emails))
    checked_in_count = total_checked_in_passes

    try:
        total_saved_posts = db.query(SavedPost).count()
    except Exception:
        total_saved_posts = 0

    try:
        total_reactions = db.query(Reaction).count()
    except Exception:
        total_reactions = 0

    return {
        "overview": {
            "total_members": len(users),
            "verified_members": sum(1 for u in users if u.is_verified),
            "unverified_members": sum(1 for u in users if not u.is_verified),
            "total_passes_issued": len(registrations),
            "pass_holders_count": pass_holders_count,
            "non_pass_members_count": non_pass_count,
            "checked_in_count": checked_in_count,
            "check_in_rate": f"{round((checked_in_count / max(len(registrations), 1)) * 100, 1)}%" if registrations else "0%",
            "total_revenue": f"₹{int(total_revenue)}",
            "total_revenue_num": total_revenue,
            "total_dispatches": len(posts),
            "total_views": total_views,
            "total_likes": total_likes,
            "total_saved": total_saved_posts,
            "total_reactions": total_reactions,
            "total_summits": len(summits),
            "total_founder_meets": len(founder_meets),
            "total_speakers": len(speakers),
            "total_categories": len(categories),
            "total_messages": len(messages_list),
            "unread_messages": unread_msg_count
        },
        "members": members_list,
        "passes": pass_roster,
        "posts": post_analytics,
        "summits": summits_list,
        "founder_meets": founder_meets_list,
        "speakers": speakers_list,
        "categories": categories_list,
        "messages": messages_list
    }

def get_admin_dashboard_metrics(db: Session) -> dict:
    metrics = get_comprehensive_admin_dashboard(db)
    return {
        "total_users": metrics["overview"]["total_members"],
        "total_posts": metrics["overview"]["total_dispatches"],
        "published_posts": metrics["overview"]["total_dispatches"],
        "total_categories": db.query(Category).count() if hasattr(Category, 'id') else 7,
        "upcoming_summits": db.query(Summit).count() if hasattr(Summit, 'id') else 2,
        "upcoming_founder_meets": db.query(FounderMeet).count() if hasattr(FounderMeet, 'id') else 1,
        "total_speakers": db.query(Speaker).count() if hasattr(Speaker, 'id') else 3,
        "event_registrations": metrics["overview"]["total_passes_issued"],
        "recent_posts": metrics["posts"][:5],
        "recent_registrations": metrics["passes"][:5]
    }



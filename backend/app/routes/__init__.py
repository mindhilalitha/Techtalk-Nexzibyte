from app.routes.auth import router as auth_router
from app.routes.users import router as users_router
from app.routes.posts import router as posts_router
from app.routes.categories import router as categories_router
from app.routes.summits import router as summits_router
from app.routes.founder_meets import router as founder_meets_router
from app.routes.speakers import router as speakers_router
from app.routes.registrations import router as registrations_router
from app.routes.stats import router as stats_router

__all__ = [
    "auth_router",
    "users_router",
    "posts_router",
    "categories_router",
    "summits_router",
    "founder_meets_router",
    "speakers_router",
    "registrations_router",
    "stats_router"
]

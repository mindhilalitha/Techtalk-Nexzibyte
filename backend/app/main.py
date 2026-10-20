import sys
import os
backend_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_root not in sys.path:
    sys.path.insert(0, backend_root)

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
from app.seed.seed_data import seed_database
from app.routes.auth import router as auth_router
from app.routes.users import router as users_router
from app.routes.posts import router as posts_router
from app.routes.categories import router as categories_router
from app.routes.summits import router as summits_router
from app.routes.founder_meets import router as founder_meets_router
from app.routes.speakers import router as speakers_router
from app.routes.registrations import router as registrations_router
from app.routes.stats import router as stats_router
from app.routes.contact import router as contact_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure database schema and default seeds exist
    try:
        Base.metadata.create_all(bind=engine)
        seed_database()
    except Exception as e:
        print(f"[Database Startup Notice]: {e}")
    yield
    # Shutdown

app = FastAPI(
    title="NexziByte TechTalk API",
    description="Backend foundation and management system for TechTalk — NexziByte Knowledge, Community & Events Platform.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS Configuration
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://localhost:4000",
    settings.FRONTEND_URL,
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local dev flexibility
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.responses import RedirectResponse

# Root Redirect to Swagger Docs
@app.get("/", include_in_schema=False)
def root():
    return RedirectResponse(url="/docs")

# Health Check
@app.get("/api/health", tags=["System"])
@app.get("/health", tags=["System"])
def health_check():
    return {
        "status": "online",
        "service": "NexziByte TechTalk FastAPI Engine",
        "version": "1.0.0",
        "framework": "Python FastAPI + SQLAlchemy ORM",
        "docs": "/docs"
    }

# Mount Routers both with /api and without prefix for resilient Vercel routing
all_routers = [
    auth_router, users_router, posts_router, categories_router,
    summits_router, founder_meets_router, speakers_router,
    registrations_router, stats_router, contact_router
]
for r in all_routers:
    app.include_router(r, prefix="/api")
    app.include_router(r)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=True)

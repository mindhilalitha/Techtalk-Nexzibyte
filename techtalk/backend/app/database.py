import logging
import re
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

logger = logging.getLogger("techtalk.database")

# Clean and normalize PostgreSQL connection URL
raw_url = (settings.DATABASE_URL or "").strip()
if raw_url.startswith("postgres://"):
    raw_url = raw_url.replace("postgres://", "postgresql://", 1)

# Remove ?schema=... from URL since psycopg2 does not accept "schema" as a connection parameter
clean_url = re.sub(r'(\?|&)schema=[^&]*', '', raw_url).rstrip('?')

try:
    if "postgresql" in clean_url and "YOUR_POSTGRES_PASSWORD" not in clean_url:
        engine = create_engine(
            clean_url,
            pool_pre_ping=True,
            pool_size=5,
            max_overflow=10,
            connect_args={"connect_timeout": 10}
        )
        # Test connection
        with engine.connect() as conn:
            pass
        logger.info(f"Connected to PostgreSQL database: {clean_url.split('@')[-1]}")
    else:
        raise ValueError("PostgreSQL URL is placeholder or unconfigured. Activating local SQLite database.")
except Exception as e:
    logger.warning(f"PostgreSQL connection note: {e}. Using resilient local database.")
    from pathlib import Path
    import tempfile
    tmp_dir = tempfile.gettempdir()
    db_file_path = (Path(tmp_dir) / "techtalk_local.db").as_posix()
    sqlite_url = f"sqlite:///{db_file_path}"
    engine = create_engine(
        sqlite_url,
        connect_args={"check_same_thread": False}
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """FastAPI Dependency for database sessions"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

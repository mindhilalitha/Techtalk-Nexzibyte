import os
from pathlib import Path
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Explicitly load .env from backend directory
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

class Settings(BaseSettings):
    PROJECT_NAME: str = "NexziByte TechTalk API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Server & CORS
    PORT: int = int(os.getenv("PORT", "4000"))
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")
    
    # Database URL
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql://neondb_owner:npg_x7zmtNqJlL8n@ep-young-cherry-aoz27kz5-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
    )
    
    # JWT Secrets
    JWT_ACCESS_SECRET: str = os.getenv("JWT_ACCESS_SECRET", "nexzibyte-access-secret-change-this-2026")
    JWT_REFRESH_SECRET: str = os.getenv("JWT_REFRESH_SECRET", "nexzibyte-refresh-secret-change-this-2026")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    
    # SMTP Email Verification
    SMTP_HOST: str = os.getenv("SMTP_HOST", "smtp.gmail.com")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER: str = os.getenv("SMTP_USER", "mindhilalitha@gmail.com")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "kjgwkgujipfhkyab")
    EMAIL_FROM: str = os.getenv("EMAIL_FROM", "NexziByte TechTalk <mindhilalitha@gmail.com>")

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()

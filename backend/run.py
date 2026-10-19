import sys
import uvicorn
from app.config import settings

def main():
    print(f"""
    ==================================================================
    [NEXZIBYTE TECHTALK BACKEND] - PYTHON + FASTAPI + POSTGRESQL
    API Base URL:  http://localhost:{settings.PORT}/api
    Swagger Docs:  http://localhost:{settings.PORT}/docs
    ReDoc:         http://localhost:{settings.PORT}/redoc
    Database ORM:  SQLAlchemy (PostgreSQL / Resilient fallback)
    Auth Security: JWT Bearer Tokens + Email Verification OTP
    ==================================================================
    """)
    uvicorn.run("app.main:app", host="127.0.0.1", port=settings.PORT, reload=False)

if __name__ == "__main__":
    main()

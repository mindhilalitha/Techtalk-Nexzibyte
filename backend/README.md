# NexziByte TechTalk — FastAPI & PostgreSQL Backend

Backend foundation and management system for **TechTalk: NexziByte Knowledge, Community & Events Platform**.

---

## 🚀 Technology Stack

- **Language:** Python 3.10+
- **Framework:** FastAPI
- **Database:** PostgreSQL
- **ORM:** SQLAlchemy
- **Authentication:** JWT Bearer tokens (access + refresh) + bcrypt password hashing
- **Email Verification:** SMTP HTML delivery (with OTP + activation link) and developer console fallback

---

## 📁 Architecture Overview

```text
TechTalk React Frontend (:5173)
       │
       ▼  REST / JSON
FastAPI Backend (:4000)
       │
  ┌────┴───────────────────────────┐
  │ • JWT Auth & Email OTP         │
  │ • Posts & Category CRUD        │
  │ • TechTalk Summits Management  │
  │ • Founder Meets Management     │
  │ • Speakers & Founders          │
  │ • Passes & Event Registrations │
  │ • Admin Dashboard Analytics    │
  └────┬───────────────────────────┘
       │  SQLAlchemy ORM
       ▼
PostgreSQL Database
```

---

## ⚙️ Environment Configuration (`.env`)

Create a `.env` file in the `backend/` directory:

```env
DATABASE_URL="postgresql://postgres:YOUR_POSTGRES_PASSWORD@localhost:5432/nexzibyte_crm?schema=public"

JWT_ACCESS_SECRET="nexzibyte-access-secret-change-this-2026"
JWT_REFRESH_SECRET="nexzibyte-refresh-secret-change-this-2026"

PORT=4000
FRONTEND_URL="http://localhost:5173"

SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="yourgmail@gmail.com"
SMTP_PASSWORD="YOUR_16_CHARACTER_APP_PASSWORD"
EMAIL_FROM="NexziByte Solutions <yourgmail@gmail.com>"
```

---

## 🛠️ Quick Setup & Running

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run the Backend Server
```bash
python run.py
```

The server starts at `http://localhost:4000`.

- **Interactive Swagger Docs:** [http://localhost:4000/docs](http://localhost:4000/docs)
- **ReDoc Documentation:** [http://localhost:4000/redoc](http://localhost:4000/redoc)
- **Health Check:** `GET http://localhost:4000/api/health`

---

## 🔑 Default Seed Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@nexzibyte.com` | `admin123` |
| **Member** | `aiswarya@nexzibyte.com` | `Pass1234!` |

---

## 📡 API Endpoints Summary

### Authentication & Email Verification
- `POST /api/auth/register` — Register user & send verification OTP email
- `POST /api/auth/login` — Login & receive JWT access + refresh tokens
- `POST /api/auth/verify-email` — Verify account using 6-digit OTP
- `GET /api/auth/verify?token=...` — Verify account with one-click link
- `POST /api/auth/resend-verification` — Resend verification OTP code
- `GET /api/auth/me` — Get current logged-in user profile

### Technical Posts & Community Content
- `GET /api/posts` — List posts (supports category filter, status, and search query)
- `GET /api/posts/{id}` — Get post details & increment view count
- `POST /api/posts` — Create technical post or draft
- `PUT /api/posts/{id}` — Update post
- `DELETE /api/posts/{id}` — Delete post
- `POST /api/posts/{id}/like` — Like post
- `POST /api/posts/{id}/save` — Bookmark / save post
- `GET /api/posts/saved` — List bookmarked posts
- `GET /api/posts/{id}/comments` — List post comments
- `POST /api/posts/{id}/comments` — Add comment

### Categories Management
- `GET /api/categories` — List all categories
- `POST /api/categories` — Add category (Admin)
- `PUT /api/categories/{id}` — Edit category (Admin)
- `DELETE /api/categories/{id}` — Delete category (Admin)

### TechTalk Summits Management
- `GET /api/summits` — List all summits (filter by status)
- `GET /api/summits/{id}` — Get summit details
- `POST /api/summits` — Create new summit (Admin)
- `PUT /api/summits/{id}` — Update summit (Admin)
- `DELETE /api/summits/{id}` — Archive / delete summit (Admin)

### Founder Meets Management
- `GET /api/founder-meets` — List all founder meets
- `GET /api/founder-meets/{id}` — Get founder meet details
- `POST /api/founder-meets` — Create founder meet (Admin)
- `PUT /api/founder-meets/{id}` — Update founder meet (Admin)
- `DELETE /api/founder-meets/{id}` — Delete founder meet (Admin)

### Speakers & Founders Profiles
- `GET /api/speakers` — List speakers & founders
- `GET /api/speakers/{id}` — Get speaker profile
- `POST /api/speakers` — Create speaker profile (Admin)
- `PUT /api/speakers/{id}` — Update speaker profile (Admin)
- `DELETE /api/speakers/{id}` — Delete speaker profile (Admin)

### Event Passes & Check-in Verification
- `GET /api/passes` — List registrations & passes (filter by email/event)
- `POST /api/passes/register` — Register pass with unique ID & QR code
- `POST /api/passes/{pass_id}/check-in` — Contactless QR check-in
- `POST /api/passes/{pass_id}/reset-check-in` — Reset check-in status

### Admin Dashboard & Statistics
- `GET /api/stats/dashboard` — Live overview metrics (total users, posts, upcoming summits, founder meets, speakers, registrations, recent activity)

# Techvoto — Full-Stack EdTech Platform

> React 18 + Vite + Tailwind CSS frontend · Django 5 + DRF + SimpleJWT backend

All data-heavy pages now load from the Django API. No hardcoded arrays.

---

## What Loads From the Backend

| Page | API Calls |
|------|-----------|
| Courses | `GET /api/courses/` (with filters) · `GET /api/courses/categories/` · `POST /api/courses/<slug>/enroll/` |
| Blog | `GET /api/blog/` (tag filter) · `GET /api/blog/tags/` · `POST /api/blog/newsletter/` |
| Mentorship | `GET /api/mentorship/` · `POST /api/mentorship/<id>/book/` |
| Certifications | `GET /api/certifications/` · `GET /api/certifications/mine/` |
| Labs | `GET /api/labs/` · `POST /api/labs/<slug>/launch/` |
| LMS Dashboard | `GET /api/courses/my-courses/` · `GET /api/certifications/mine/` · `GET /api/auth/me/` |
| Contact | `POST /api/contact/` |

---

## Quick Start

### 1. Backend

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # Edit SECRET_KEY
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver    # → http://localhost:8000
```

**Seed sample data via Django admin** at `http://localhost:8000/admin/`:
- Add Categories: Backend, Frontend, Cloud, DevOps, Data & AI
- Add Courses (mark `is_published = True`)
- Add Blog Posts (mark `is_published = True`, set `published_at`)
- Add Labs, Certifications, and Mentor Profiles

### 2. Frontend

```bash
cd frontend
npm install
npm run dev    # → http://localhost:3000
```

The Vite dev server proxies `/api/*` requests to `http://localhost:8000` automatically.

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register/` | No  | Register → returns JWT + user |
| POST | `/api/auth/login/`    | No  | Login → returns JWT + user |
| POST | `/api/auth/token/refresh/` | No | Refresh access token |
| GET  | `/api/auth/me/`       | Yes | Current user profile |
| PATCH| `/api/auth/profile/`  | Yes | Update profile |
| GET  | `/api/courses/`       | No  | List courses (search, level, price, category filters) |
| GET  | `/api/courses/categories/` | No | All categories |
| GET  | `/api/courses/<slug>/` | No | Course detail + lessons + reviews |
| POST | `/api/courses/<slug>/enroll/` | Yes | Enrol in course |
| GET  | `/api/courses/my-courses/` | Yes | My enrollments + progress |
| GET  | `/api/blog/`          | No  | Blog posts (tag filter, search) |
| GET  | `/api/blog/tags/`     | No  | All tags |
| GET  | `/api/blog/<slug>/`   | No  | Post detail |
| POST | `/api/blog/newsletter/` | No | Subscribe to newsletter |
| POST | `/api/contact/`       | No  | Submit contact form |
| GET  | `/api/mentorship/`    | No  | All mentor profiles |
| POST | `/api/mentorship/<id>/book/` | Yes | Book a session |
| GET  | `/api/mentorship/my-sessions/` | Yes | My booked sessions |
| GET  | `/api/certifications/` | No  | All certifications |
| GET  | `/api/certifications/mine/` | Yes | My certs + progress |
| GET  | `/api/certifications/verify/<token>/` | No | Verify cert by UUID |
| GET  | `/api/labs/`          | No  | All labs |
| POST | `/api/labs/<slug>/launch/` | Yes | Launch a lab sandbox |

**Interactive docs:** `http://localhost:8000/api/docs/` (Swagger UI)

---

## Project Structure

```
techvoto/
├── frontend/
│   ├── src/
│   │   ├── components/      Navbar, Footer, Layout, Feedback, ToastContainer
│   │   ├── context/         ThemeContext, AuthContext
│   │   ├── hooks/           useFetch, useToast
│   │   ├── pages/           All 18 pages
│   │   └── utils/           api.js (Axios + silent JWT refresh)
│   ├── index.html
│   ├── vite.config.js       Proxy /api → Django
│   └── package.json
│
└── backend/
    ├── techvoto/            settings.py, urls.py, wsgi.py
    └── apps/
        ├── users/           Custom email auth, JWT, plan tiers
        ├── courses/         Courses, Lessons, Enrollments, Reviews
        ├── blog/            Posts, Tags, Newsletter
        ├── contact/         Contact form messages
        ├── mentorship/      Mentor profiles + session booking
        ├── certifications/  Certs + UUID blockchain verification
        └── labs/            Sandbox labs + attempt tracking
```

---

## Deployment

**Frontend → Vercel**
```
Root directory:  frontend
Build command:   npm run build
Output:          dist
Env var:         VITE_API_URL=https://your-backend.onrender.com/api
```

**Backend → Render**
```
Root directory:  backend
Build command:   pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate
Start command:   gunicorn techvoto.wsgi:application
Env vars:        SECRET_KEY, DEBUG=False, DATABASE_URL, CORS_ALLOWED_ORIGINS, ALLOWED_HOSTS
```

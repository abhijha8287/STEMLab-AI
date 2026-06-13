# STEMLab AI

AI-powered STEM Virtual Laboratory — perform physics experiments, build circuits, and learn with Gemini AI guidance.

## Quick Start (Docker)

```bash
# 1. Copy environment file and add your API keys
cp .env.example .env
# Edit .env: add GEMINI_API_KEY, SUPABASE_URL, SUPABASE_KEY

# 2. Start all services
docker compose up --build

# 3. Open in browser
# App:      http://localhost:80
# Frontend: http://localhost:3000
# Backend:  http://localhost:8000
# API Docs: http://localhost:8000/docs
```

## Services

| Service    | Port | Description |
|---|---|---|
| Frontend   | 3000 | Next.js 15 |
| Backend    | 8000 | FastAPI |
| PostgreSQL | 5432 | Primary database |
| Nginx      | 80   | Reverse proxy |

## Development (without Docker)

### Backend
```bash
cd backend
pip install -e ".[dev]"
cp .env.example .env   # edit with real values

# Needs a running PostgreSQL instance
alembic upgrade head
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend
```bash
cd frontend
npm install
cp .env.local.example .env.local

npm run dev
# Open http://localhost:3000
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Yes | Google Gemini API key |
| `SUPABASE_URL` | Yes | Supabase project URL (for PDF storage) |
| `SUPABASE_KEY` | Yes | Supabase anon key |
| `POSTGRES_PASSWORD` | No | DB password (default: stemlab_dev_password) |

## Project Structure

```
├── backend/     FastAPI + SQLAlchemy backend
├── frontend/    Next.js 15 frontend
├── docker/      Nginx config
└── infrastructure/  AWS deployment config
```

## API Documentation

Available at `http://localhost:8000/docs` when backend is running.

## Testing

```bash
cd backend
pytest tests/unit/
pytest tests/integration/   # requires test PostgreSQL DB
```

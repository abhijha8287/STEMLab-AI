from datetime import datetime, timezone
from fastapi import APIRouter
from sqlalchemy import text
from app.core.dependencies import DBSession

router = APIRouter()


@router.get("/health", tags=["system"])
async def health_check(db: DBSession) -> dict:
    db_status = "ok"
    try:
        await db.execute(text("SELECT 1"))
    except Exception:
        db_status = "error"

    return {
        "status": "ok" if db_status == "ok" else "degraded",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "database": db_status,
        "version": "1.0.0",
    }

from fastapi import APIRouter
from app.api.v1.endpoints import health, analytics, history, physics, circuit, ai_instructor

router = APIRouter(prefix="/api/v1")

router.include_router(health.router)
router.include_router(analytics.router)
router.include_router(history.router)
router.include_router(physics.router)
router.include_router(circuit.router)
router.include_router(ai_instructor.router)

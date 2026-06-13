from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError

from app.core.config import get_settings
from app.core.database import init_db, close_db
from app.core.logging import configure_logging
from app.middleware.error_handler import (
    stemlab_exception_handler,
    validation_exception_handler,
    unhandled_exception_handler,
)
from app.middleware.logging_middleware import LoggingMiddleware
from app.middleware.session_middleware import SessionMiddleware
from app.core.exceptions import STEMLabError
from app.api.v1.router import router as v1_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    configure_logging()
    await init_db()
    yield
    await close_db()


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title="STEMLab AI",
        description="AI-powered STEM Virtual Laboratory API",
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.add_middleware(LoggingMiddleware)
    app.add_middleware(SessionMiddleware)

    app.add_exception_handler(STEMLabError, stemlab_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(Exception, unhandled_exception_handler)

    app.include_router(v1_router)

    return app


app = create_app()

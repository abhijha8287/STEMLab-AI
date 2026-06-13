from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from pydantic import ValidationError as PydanticValidationError
from app.core.exceptions import STEMLabError
from app.core.logging import get_logger

logger = get_logger(__name__)


async def stemlab_exception_handler(request: Request, exc: STEMLabError) -> JSONResponse:
    logger.warning("application_error", code=exc.code, message=exc.message, path=str(request.url))
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.code, "message": exc.message},
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    details = {}
    for error in exc.errors():
        field = ".".join(str(loc) for loc in error["loc"])
        details[field] = error["msg"]
    logger.info("validation_error", path=str(request.url), details=details)
    return JSONResponse(
        status_code=422,
        content={"error": "validation_error", "message": "Request validation failed", "details": details},
    )


async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.error("unhandled_exception", exc_info=exc, path=str(request.url))
    return JSONResponse(
        status_code=500,
        content={"error": "internal_error", "message": "An unexpected error occurred"},
    )

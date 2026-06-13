class STEMLabError(Exception):
    """Base exception for all application errors."""

    def __init__(self, message: str, code: str = "internal_error", status_code: int = 500):
        super().__init__(message)
        self.message = message
        self.code = code
        self.status_code = status_code


class NotFoundError(STEMLabError):
    def __init__(self, resource: str, resource_id: str | None = None):
        msg = f"{resource} not found" if resource_id is None else f"{resource} '{resource_id}' not found"
        super().__init__(msg, "not_found", 404)


class ValidationError(STEMLabError):
    def __init__(self, message: str, details: dict | None = None):
        super().__init__(message, "validation_error", 400)
        self.details = details or {}


class SimulationError(STEMLabError):
    def __init__(self, message: str):
        super().__init__(message, "simulation_error", 422)


class AIServiceError(STEMLabError):
    def __init__(self, message: str):
        super().__init__(message, "ai_unavailable", 503)


class StorageError(STEMLabError):
    def __init__(self, message: str):
        super().__init__(message, "storage_error", 500)

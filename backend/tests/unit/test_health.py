import pytest


def test_health_endpoint_exists():
    """Verify health endpoint is registered."""
    from app.main import app
    routes = [route.path for route in app.routes]
    assert "/api/v1/health" in routes

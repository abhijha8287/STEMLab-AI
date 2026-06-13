import pytest
import pytest_asyncio


@pytest.mark.asyncio
async def test_health_returns_ok(client):
    response = await client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ("ok", "degraded")
    assert "timestamp" in data
    assert "database" in data
    assert "version" in data

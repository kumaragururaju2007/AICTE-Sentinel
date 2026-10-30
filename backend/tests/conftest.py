import os
import sys
from pathlib import Path
import pytest
from fastapi.testclient import TestClient

backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from app.main import app
from app.database.session import SessionLocal

@pytest.fixture(scope="session")
def client():
    with TestClient(app) as test_client:
        yield test_client

@pytest.fixture(scope="session")
def admin_headers(client):
    res = client.post("/api/auth/login", json={
        "email": "admin@aicte.gov.in",
        "password": "password123"
    })
    assert res.status_code == 200, f"Admin login failed: {res.text}"
    token = res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture(scope="session")
def officer_headers(client):
    res = client.post("/api/auth/login", json={
        "email": "officer@aicte-india.org",
        "password": "password123"
    })
    assert res.status_code == 200, f"Officer login failed: {res.text}"
    token = res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture(scope="session")
def institution_headers(client):
    res = client.post("/api/auth/login", json={
        "email": "principal@institution.ac.in",
        "password": "password123"
    })
    assert res.status_code == 200, f"Institution login failed: {res.text}"
    token = res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


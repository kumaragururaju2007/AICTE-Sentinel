import pytest

def test_login_success(client):
    res = client.post("/api/auth/login", json={
        "email": "admin@aicte.gov.in",
        "password": "password123"
    })
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["role"] == "ADMINISTRATOR"

def test_login_invalid_password(client):
    res = client.post("/api/auth/login", json={
        "email": "admin@aicte.gov.in",
        "password": "wrong_password"
    })
    assert res.status_code == 401
    assert "Invalid email or password" in res.json()["detail"]

def test_get_current_user_me(client, admin_headers):
    res = client.get("/api/auth/me", headers=admin_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["email"] == "admin@aicte.gov.in"
    assert data["role"] == "ADMINISTRATOR"

def test_token_refresh(client):
    login_res = client.post("/api/auth/login", json={
        "email": "officer@aicte-india.org",
        "password": "password123"
    })
    assert login_res.status_code == 200
    refresh_token = login_res.json()["refresh_token"]

    refresh_res = client.post("/api/auth/refresh", json={
        "refresh_token": refresh_token
    })
    assert refresh_res.status_code == 200
    data = refresh_res.json()
    assert "access_token" in data


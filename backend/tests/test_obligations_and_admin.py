import pytest

def test_admin_dashboard_kpis(client, admin_headers):
    res = client.get("/api/admin/dashboard", headers=admin_headers)
    assert res.status_code == 200
    data = res.json()
    assert "kpi_metrics" in data
    kpi = data["kpi_metrics"]
    assert "total_applications" in kpi
    assert "pending_applications" in kpi
    assert "approved_applications" in kpi

def test_admin_users_list(client, admin_headers):
    res = client.get("/api/admin/users", headers=admin_headers)
    assert res.status_code == 200
    users = res.json()
    assert isinstance(users, list)
    assert len(users) >= 3

def test_sla_configurations(client, admin_headers):
    res = client.get("/api/obligations/sla-ladder", headers=admin_headers)
    assert res.status_code == 200
    ladder = res.json()
    assert isinstance(ladder, list)
    assert len(ladder) >= 1

def test_obligation_scan_trigger(client, admin_headers):
    res = client.post("/api/obligations/scan", headers=admin_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "success"
    assert "scan_result" in data

def test_audit_logs_tamper_chain(client, admin_headers):
    res = client.get("/api/admin/audit-logs", headers=admin_headers)
    assert res.status_code == 200
    logs = res.json()
    assert isinstance(logs, list)
    assert len(logs) >= 3
    # Check that SHA-256 block hash is present
    for entry in logs:
        assert "event_hash" in entry
        assert len(entry["event_hash"]) == 64  # standard sha-256 hex length

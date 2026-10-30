import pytest

def test_officer_list_applications(client, officer_headers):
    res = client.get("/api/officer/applications", headers=officer_headers)
    assert res.status_code == 200
    apps = res.json()
    assert isinstance(apps, list)
    assert len(apps) >= 1
    assert any(a["application_number"] == "AICTE-2026-00123" for a in apps)

def test_officer_application_detail(client, officer_headers):
    # First get list to find an app id
    list_res = client.get("/api/officer/applications", headers=officer_headers)
    assert list_res.status_code == 200
    app_id = list_res.json()[0]["id"]

    detail_res = client.get(f"/api/officer/applications/{app_id}", headers=officer_headers)
    assert detail_res.status_code == 200
    data = detail_res.json()
    assert "application_number" in data
    assert "current_stage" in data

def test_officer_workload_and_deadlines(client, officer_headers):
    res_wl = client.get("/api/officer/workload", headers=officer_headers)
    assert res_wl.status_code == 200
    wl = res_wl.json()
    assert "active_cases" in wl
    assert "workload_utilization_pct" in wl

    res_dl = client.get("/api/officer/deadlines", headers=officer_headers)
    assert res_dl.status_code == 200
    assert isinstance(res_dl.json(), list)

def test_institution_submit_application(client, institution_headers):
    payload = {
        "application_type": "Extension of Approval",
        "academic_year": "2026-27",
        "course_type": "Engineering & Technology (UG/PG)",
        "intake_requested": 180
    }
    res = client.post("/api/applications", json=payload, headers=institution_headers)
    assert res.status_code == 201
    created = res.json()
    assert "application_number" in created
    assert created["status"] == "UNDER_REVIEW"

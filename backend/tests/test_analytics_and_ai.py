import pytest

def test_analytics_overview(client, admin_headers):
    res = client.get("/api/analytics/overview", headers=admin_headers)
    assert res.status_code == 200
    data = res.json()
    assert "total_applications" in data
    assert "pending_applications" in data
    assert "sla_compliance_rate" in data

def test_ai_rag_query(client, officer_headers):
    res = client.post("/api/ai/rag-query", json={
        "query": "What is the requirement for 30-year registered lease deed under AICTE norms?"
    }, headers=officer_headers)
    assert res.status_code == 200
    data = res.json()
    assert "answer" in data
    assert "source_citations" in data
    assert len(data["source_citations"]) > 0

def test_ai_predict_delay(client, officer_headers):
    # Fetch an application to test prediction
    apps_res = client.get("/api/officer/applications", headers=officer_headers)
    assert apps_res.status_code == 200
    apps = apps_res.json()
    assert len(apps) > 0
    app_id = apps[0]["id"]

    res = client.get(f"/api/ai/predict-delay/{app_id}", headers=officer_headers)
    assert res.status_code == 200
    data = res.json()
    assert "risk_score" in data
    assert "risk_category" in data
    assert "contributing_factors" in data

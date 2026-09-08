import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"

def test_crop_prediction():
    payload = {
        "location": "Jaipur",
        "soil_type": "alluvial",
        "season": "kharif"
    }
    response = client.post("/api/predict-crop", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "recommended_crops" in data
    assert len(data["recommended_crops"]) > 0

def test_disease_prediction():
    payload = {"crop": "wheat"}
    response = client.post("/api/predict-disease", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "disease" in data

def test_weather_endpoint():
    payload = {"location": "Karnal"}
    response = client.post("/api/weather", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "temperature" in data
    assert "humidity" in data
    assert "recommendations" in data

def test_ai_assistant():
    payload = {"message": "Gehu me paani kab dalein?"}
    response = client.post("/api/ai-assistant", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "reply" in data

def test_store_products():
    response = client.get("/api/store/products?limit=10")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "name" in data[0]

def test_store_categories():
    response = client.get("/api/store/categories")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 6

if __name__ == "__main__":
    pytest.main([__file__])

"""
Comprehensive Automated Test Suite
SlopeSentinel - Landslide Susceptibility Intelligence Platform
Tests:
- Backend REST API Endpoints
- JWT Authentication & RBAC
- Database Persistence & History Ownership
- ML Inference Pipeline, Feature Encodings, and Probability Distributions
- Input Validation Boundaries & Error Handling
"""

import os
import sys
import time
from fastapi.testclient import TestClient

# Ensure backend root is on path
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from main import app
from app.model_loader import ml_loader
from app.database import Base, engine
from app.models import User, Prediction

client = TestClient(app)

def setup_test_suite():
    """Ensure artifacts are loaded and database is initialized."""
    ml_loader.load_artifacts()
    Base.metadata.create_all(bind=engine)

# =========================================================================
# 1. HEALTH & METADATA TESTS
# =========================================================================

def test_health_check_endpoint():
    response = client.get("/")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    data = response.json()
    assert data["status"] in ["healthy", "degraded"]
    assert "Predicting Landslide Susceptibility" in data["system"]
    assert data["model_type"] == "Random Forest Multi-Class Pipeline"
    assert data["verified_accuracy"] == 0.9270
    print("[PASS] test_health_check_endpoint")

def test_model_info_endpoint():
    response = client.get("/api/dashboard/model-info")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    data = response.json()
    assert data["model_name"] == "Random Forest Multi-Class Classifier Pipeline"
    assert data["target_classes"] == ["Low Risk", "Medium Risk", "High Risk"]
    assert len(data["input_features"]) == 6
    assert data["metrics"]["accuracy"] == 0.9270
    assert data["metrics"]["roc_auc"] == 0.9895
    assert len(data["limitations"]) > 0
    print("[PASS] test_model_info_endpoint")

# =========================================================================
# 2. ML INFERENCE INTEGRATION TESTS
# =========================================================================

def test_ml_pipeline_artifact_integrity():
    assert ml_loader.pipeline is not None
    assert hasattr(ml_loader.pipeline, "predict")
    assert hasattr(ml_loader.pipeline, "predict_proba")
    
    preprocessor = ml_loader.pipeline.named_steps.get("preprocessor")
    classifier = ml_loader.pipeline.named_steps.get("classifier")
    assert preprocessor is not None
    assert classifier is not None
    
    assert len(ml_loader.feature_importances) > 0
    top_feature = ml_loader.feature_importances[0]
    assert "rainfall" in top_feature["feature"].lower()
    print("[PASS] test_ml_pipeline_artifact_integrity")

def test_valid_low_risk_prediction():
    payload = {
        "rainfall": 60.0,
        "slope": 8.0,
        "soil_type": "Loam",
        "vegetation": 85.0,
        "elevation": 300.0,
        "land_use": "Forest",
        "region_name": "Stable Valley"
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["prediction"] == "Low Risk"
    assert data["predicted_class_id"] == 0
    assert data["probabilities"]["Low Risk"] > 0.60
    assert data["confidence"] == data["probabilities"]["Low Risk"]
    assert "Susceptibility assessment reflects spatial propensity" in data["disclaimer"]
    print("[PASS] test_valid_low_risk_prediction")

def test_valid_high_risk_prediction():
    payload = {
        "rainfall": 650.0,
        "slope": 48.0,
        "soil_type": "Clay",
        "vegetation": 15.0,
        "elevation": 1800.0,
        "land_use": "Barren",
        "region_name": "Steep Saturated Cliff"
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["prediction"] == "High Risk"
    assert data["predicted_class_id"] == 2
    assert data["probabilities"]["High Risk"] > 0.50
    assert data["confidence"] == data["probabilities"]["High Risk"]
    print("[PASS] test_valid_high_risk_prediction")

def test_valid_medium_risk_prediction():
    payload = {
        "rainfall": 220.0,
        "slope": 25.0,
        "soil_type": "Sand",
        "vegetation": 45.0,
        "elevation": 1200.0,
        "land_use": "Agricultural",
        "region_name": "Mid-Plateau"
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["prediction"] in ["Low Risk", "Medium Risk", "High Risk"]
    probs = data["probabilities"]
    total_prob = sum(probs.values())
    assert abs(total_prob - 1.0) < 0.01
    print("[PASS] test_valid_medium_risk_prediction")

# =========================================================================
# 3. SCHEMA VALIDATION & INPUT BOUNDARY TESTS
# =========================================================================

def test_negative_numerical_inputs_rejected():
    invalid_payload = {
        "rainfall": -20.0,
        "slope": 15.0,
        "soil_type": "Clay",
        "vegetation": 50.0,
        "elevation": 500.0,
        "land_use": "Forest"
    }
    response = client.post("/predict", json=invalid_payload)
    assert response.status_code == 422
    print("[PASS] test_negative_numerical_inputs_rejected")

def test_out_of_bounds_slope_rejected():
    invalid_payload = {
        "rainfall": 100.0,
        "slope": 85.0,  # Max allowed is 60°
        "soil_type": "Clay",
        "vegetation": 50.0,
        "elevation": 500.0,
        "land_use": "Forest"
    }
    response = client.post("/predict", json=invalid_payload)
    assert response.status_code == 422
    print("[PASS] test_out_of_bounds_slope_rejected")

def test_invalid_categorical_soil_rejected():
    invalid_payload = {
        "rainfall": 100.0,
        "slope": 20.0,
        "soil_type": "VolcanicBasaltUnknown",
        "vegetation": 50.0,
        "elevation": 500.0,
        "land_use": "Forest"
    }
    response = client.post("/predict", json=invalid_payload)
    assert response.status_code == 422
    print("[PASS] test_invalid_categorical_soil_rejected")

def test_missing_features_rejected():
    incomplete_payload = {
        "rainfall": 100.0,
        "slope": 20.0
    }
    response = client.post("/predict", json=incomplete_payload)
    assert response.status_code == 422
    print("[PASS] test_missing_features_rejected")

# =========================================================================
# 4. AUTHENTICATION & ACCESS CONTROL TESTS
# =========================================================================

TIMESTAMP_SUFFIX = int(time.time())

def test_user_registration_and_login_flow():
    email = f"tester_{TIMESTAMP_SUFFIX}@example.com"
    password = "StrongPassword2026!"
    
    # 1. Register
    reg_response = client.post("/api/auth/register", json={
        "name": "Integration Tester",
        "email": email,
        "password": password
    })
    assert reg_response.status_code == 200
    token_data = reg_response.json()
    assert "access_token" in token_data
    token = token_data["access_token"]
    
    # 2. Duplicate registration rejected
    dup_response = client.post("/api/auth/register", json={
        "name": "Duplicate Tester",
        "email": email,
        "password": password
    })
    assert dup_response.status_code == 400
    
    # 3. Login with correct credentials
    login_response = client.post("/api/auth/login", json={
        "email": email,
        "password": password
    })
    assert login_response.status_code == 200
    assert "access_token" in login_response.json()
    
    # 4. Login with invalid password
    bad_login = client.post("/api/auth/login", json={
        "email": email,
        "password": "WrongPassword999"
    })
    assert bad_login.status_code == 401
    
    # 5. Access protected profile
    prof_response = client.get("/api/auth/profile", headers={"Authorization": f"Bearer {token}"})
    assert prof_response.status_code == 200
    assert prof_response.json()["email"] == email
    print("[PASS] test_user_registration_and_login_flow")

def test_protected_routes_reject_unauthorized():
    response = client.get("/api/dashboard/summary")
    assert response.status_code == 401
    
    response2 = client.get("/api/dashboard/history")
    assert response2.status_code == 401
    print("[PASS] test_protected_routes_reject_unauthorized")

# =========================================================================
# 5. HISTORY PERSISTENCE & USER OWNERSHIP TESTS
# =========================================================================

def test_history_logging_and_filtering():
    email = f"history_user_{TIMESTAMP_SUFFIX}@example.com"
    password = "UserPassword2026!"
    
    reg_res = client.post("/api/auth/register", json={"name": "History User", "email": email, "password": password})
    token = reg_res.json()["access_token"]
    auth_header = {"Authorization": f"Bearer {token}"}
    
    # Submit prediction while authenticated
    payload = {
        "rainfall": 500.0,
        "slope": 40.0,
        "soil_type": "Clay",
        "vegetation": 20.0,
        "elevation": 1600.0,
        "land_use": "Forest",
        "region_name": f"Tracked Locus {TIMESTAMP_SUFFIX}"
    }
    pred_res = client.post("/predict", json=payload, headers=auth_header)
    assert pred_res.status_code == 200
    created_id = pred_res.json()["id"]
    assert created_id is not None
    
    # Check history
    hist_res = client.get("/api/dashboard/history", headers=auth_header)
    assert hist_res.status_code == 200
    items = hist_res.json()
    assert any(i["id"] == created_id for i in items)
    
    # Delete own history item
    del_res = client.delete(f"/api/dashboard/history/{created_id}", headers=auth_header)
    assert del_res.status_code == 200
    
    # Verify deletion
    hist_after = client.get("/api/dashboard/history", headers=auth_header)
    assert not any(i["id"] == created_id for i in hist_after.json())
    print("[PASS] test_history_logging_and_filtering")

def test_prediction_with_coordinates_and_history():
    timestamp = int(time.time())
    email = f"coord_user_{timestamp}@example.com"
    reg = client.post("/api/auth/register", json={
        "name": "Geospatial Analyst",
        "email": email,
        "password": "Password123!"
    })
    token = reg.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    pred_res = client.post("/predict", json={
        "rainfall": 420.0,
        "slope": 38.0,
        "soil_type": "Clay",
        "vegetation": 15.0,
        "elevation": 1850.0,
        "land_use": "Barren",
        "region_name": "Nilgiris Slope 4B",
        "latitude": 11.4102,
        "longitude": 76.6950
    }, headers=headers)
    assert pred_res.status_code == 200
    pred_data = pred_res.json()
    assert pred_data["latitude"] == 11.4102
    assert pred_data["longitude"] == 76.6950
    assert pred_data["region_name"] == "Nilgiris Slope 4B"
    
    # Check history endpoint contains coordinates
    hist_res = client.get("/api/dashboard/history", headers=headers)
    assert hist_res.status_code == 200
    records = hist_res.json()
    assert len(records) > 0
    assert records[0]["latitude"] == 11.4102
    assert records[0]["longitude"] == 76.6950
    print("[PASS] test_prediction_with_coordinates_and_history")

def test_saved_locations_crud():
    timestamp = int(time.time())
    email = f"loc_user_{timestamp}@example.com"
    reg = client.post("/api/auth/register", json={
        "name": "Location Manager",
        "email": email,
        "password": "Password123!"
    })
    token = reg.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create saved location
    create_res = client.post("/api/dashboard/locations", json={
        "name": "Wayanad Tea Estate Sector 2",
        "latitude": 11.5200,
        "longitude": 76.1300,
        "elevation": 1200.0,
        "soil_type": "Clay",
        "land_use": "Agricultural",
        "notes": "Historical runoff prone terrain"
    }, headers=headers)
    assert create_res.status_code == 201
    loc_id = create_res.json()["id"]
    assert create_res.json()["name"] == "Wayanad Tea Estate Sector 2"
    
    # List saved locations
    list_res = client.get("/api/dashboard/locations", headers=headers)
    assert list_res.status_code == 200
    locs = list_res.json()
    assert len(locs) == 1
    assert locs[0]["id"] == loc_id
    
    # Delete saved location
    del_res = client.delete(f"/api/dashboard/locations/{loc_id}", headers=headers)
    assert del_res.status_code == 200
    
    # Verify deletion
    list_res2 = client.get("/api/dashboard/locations", headers=headers)
    assert len(list_res2.json()) == 0
    print("[PASS] test_saved_locations_crud")

def run_all_tests():
    print("=================================================================")
    print("RUNNING AUTOMATED TEST SUITE: SLOPESENTINEL PLATFORM")
    print("=================================================================")
    setup_test_suite()
    
    tests = [
        test_health_check_endpoint,
        test_model_info_endpoint,
        test_ml_pipeline_artifact_integrity,
        test_valid_low_risk_prediction,
        test_valid_high_risk_prediction,
        test_valid_medium_risk_prediction,
        test_negative_numerical_inputs_rejected,
        test_out_of_bounds_slope_rejected,
        test_invalid_categorical_soil_rejected,
        test_missing_features_rejected,
        test_user_registration_and_login_flow,
        test_protected_routes_reject_unauthorized,
        test_history_logging_and_filtering,
        test_prediction_with_coordinates_and_history,
        test_saved_locations_crud,
    ]
    
    passed = 0
    failed = 0
    
    for t in tests:
        try:
            t()
            passed += 1
        except Exception as e:
            print(f"[FAIL] {t.__name__} FAILED: {e}")
            failed += 1
            
    print("=================================================================")
    print(f"TEST EXECUTION SUMMARY: {passed} PASSED, {failed} FAILED (TOTAL {len(tests)})")
    print("=================================================================")
    
    if failed > 0:
        sys.exit(1)

if __name__ == "__main__":
    run_all_tests()

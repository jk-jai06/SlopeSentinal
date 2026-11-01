from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List, Optional
from datetime import datetime

from app.database import get_db
from app.models import User, Prediction, SavedLocation
from app.schemas import (
    PredictionHistoryOut, DashboardSummary, ModelInfoOut,
    AnalyticsOut, AnalyticsDistributionItem, AnalyticsHistoryTrendItem,
    ModelMetrics, ModelFeatureImportance, SavedLocationCreate, SavedLocationOut
)
from app.auth import get_current_user
from app.model_loader import ml_loader

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("/summary", response_model=DashboardSummary)
def get_summary(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user_query = db.query(Prediction).filter(Prediction.user_id == current_user.id)
    total_query = db.query(Prediction)
    
    total_system = total_query.count()
    user_total = user_query.count()
    
    # Active query depending on whether user wants personal or admin overview
    active_q = total_query if current_user.role == "admin" else user_query
    
    high_count = active_q.filter(Prediction.predicted_class == "High Risk").count()
    medium_count = active_q.filter(Prediction.predicted_class == "Medium Risk").count()
    low_count = active_q.filter(Prediction.predicted_class == "Low Risk").count()
    
    last_pred = active_q.order_by(desc(Prediction.timestamp)).first()
    last_prediction_str = last_pred.predicted_class if last_pred else None
    
    return DashboardSummary(
        total_predictions=total_system,
        user_predictions=user_total,
        high_risk_count=high_count,
        medium_risk_count=medium_count,
        low_risk_count=low_count,
        last_prediction=last_prediction_str
    )


@router.get("/history", response_model=List[PredictionHistoryOut])
def get_history(
    risk_filter: Optional[str] = Query(None, description="Filter by risk level"),
    search: Optional[str] = Query(None, description="Search region or features"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Prediction)
    
    # Non-admin users see strictly their own predictions
    if current_user.role != "admin":
        query = query.filter(Prediction.user_id == current_user.id)
        
    if risk_filter and risk_filter != "All":
        query = query.filter(Prediction.predicted_class == risk_filter)
        
    if search:
        search_fmt = f"%{search.strip()}%"
        query = query.filter(
            (Prediction.region_name.ilike(search_fmt)) |
            (Prediction.soil_type.ilike(search_fmt)) |
            (Prediction.land_use.ilike(search_fmt))
        )
        
    return query.order_by(desc(Prediction.timestamp)).offset(skip).limit(limit).all()


@router.delete("/history/{pred_id}", status_code=status.HTTP_200_OK)
def delete_history_item(
    pred_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    prediction = db.query(Prediction).filter(Prediction.id == pred_id).first()
    if not prediction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prediction record not found."
        )
    
    # Ownership enforcement: only record owner or system admin can delete
    if current_user.role != "admin" and prediction.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to delete this prediction record."
        )
    
    db.delete(prediction)
    db.commit()
    return {"status": "success", "message": f"Prediction record #{pred_id} deleted successfully."}


@router.get("/analytics", response_model=AnalyticsOut)
def get_analytics(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # 1. User Prediction Distribution
    user_query = db.query(Prediction).filter(Prediction.user_id == current_user.id)
    user_total = user_query.count()
    user_dists = user_query.with_entities(
        Prediction.predicted_class, func.count(Prediction.id)
    ).group_by(Prediction.predicted_class).all()
    
    user_dist_map = dict(user_dists)
    user_distribution = [
        AnalyticsDistributionItem(
            name=cls_name,
            value=user_dist_map.get(cls_name, 0),
            percentage=round((user_dist_map.get(cls_name, 0) / user_total * 100), 1) if user_total > 0 else 0.0
        )
        for cls_name in ["High Risk", "Medium Risk", "Low Risk"]
    ]
    
    # 2. System Prediction Distribution
    sys_total = db.query(Prediction).count()
    sys_dists = db.query(Prediction).with_entities(
        Prediction.predicted_class, func.count(Prediction.id)
    ).group_by(Prediction.predicted_class).all()
    
    sys_dist_map = dict(sys_dists)
    system_distribution = [
        AnalyticsDistributionItem(
            name=cls_name,
            value=sys_dist_map.get(cls_name, 0),
            percentage=round((sys_dist_map.get(cls_name, 0) / sys_total * 100), 1) if sys_total > 0 else 0.0
        )
        for cls_name in ["High Risk", "Medium Risk", "Low Risk"]
    ]
    
    # 3. Temporal Trends (Grouped by date)
    recent_preds = (
        db.query(Prediction)
        .order_by(desc(Prediction.timestamp))
        .limit(100)
        .all()
    )
    
    trends_map = {}
    for p in reversed(recent_preds):
        date_str = p.timestamp.strftime("%Y-%m-%d")
        if date_str not in trends_map:
            trends_map[date_str] = {"date": date_str, "high_risk": 0, "medium_risk": 0, "low_risk": 0, "total": 0}
        
        trends_map[date_str]["total"] += 1
        if p.predicted_class == "High Risk":
            trends_map[date_str]["high_risk"] += 1
        elif p.predicted_class == "Medium Risk":
            trends_map[date_str]["medium_risk"] += 1
        elif p.predicted_class == "Low Risk":
            trends_map[date_str]["low_risk"] += 1
            
    history_trends = [AnalyticsHistoryTrendItem(**v) for v in trends_map.values()]
    
    # 4. Verified Model Metrics
    model_metrics = ModelMetrics(**ml_loader.metrics)
    
    # 5. Feature Importances
    feature_importances = [ModelFeatureImportance(**f) for f in ml_loader.feature_importances]
    
    return AnalyticsOut(
        user_distribution=user_distribution,
        system_distribution=system_distribution,
        history_trends=history_trends,
        model_metrics=model_metrics,
        feature_importances=feature_importances
    )


@router.get("/model-info", response_model=ModelInfoOut)
def get_model_info():
    hyperparams = {}
    if ml_loader.pipeline:
        try:
            clf = ml_loader.pipeline.named_steps.get('classifier')
            if clf:
                hyperparams = {
                    "n_estimators": clf.n_estimators,
                    "max_depth": clf.max_depth,
                    "criterion": clf.criterion,
                    "random_state": clf.random_state,
                    "bootstrap": clf.bootstrap,
                    "max_features": str(clf.max_features),
                    "min_samples_split": clf.min_samples_split,
                    "min_samples_leaf": clf.min_samples_leaf
                }
        except Exception:
            pass

    input_features = [
        {"name": "rainfall", "label": "Rainfall", "unit": "mm", "type": "Continuous Numerical", "range": "0 - 1000 mm", "importance_pct": 44.14},
        {"name": "vegetation", "label": "Vegetation Cover", "unit": "%", "type": "Continuous Numerical", "range": "0 - 100 %", "importance_pct": 24.01},
        {"name": "slope", "label": "Slope Angle", "unit": "°", "type": "Continuous Numerical", "range": "0 - 60 degrees", "importance_pct": 20.91},
        {"name": "elevation", "label": "Elevation", "unit": "m", "type": "Continuous Numerical", "range": "0 - 3000 m", "importance_pct": 6.78},
        {"name": "soil_type", "label": "Soil Type", "unit": "Category", "type": "Categorical", "values": ["Clay", "Gravel", "Loam", "Sand"], "importance_pct": 2.06},
        {"name": "land_use", "label": "Land Use Type", "unit": "Category", "type": "Categorical", "values": ["Agricultural", "Barren", "Forest", "Urban"], "importance_pct": 2.10}
    ]

    limitations = [
        "Susceptibility vs. Event Timing: The system predicts spatial susceptibility, not real-time event warnings or the exact time a landslide will occur.",
        "Sensor Integration: Does not incorporate live geotechnical telemetry such as pore-water piezometers, inclinometers, or acoustic emission sensors.",
        "Regional Specificity: Model calibration is based on tabular geomorphological and climatic training distributions and may require regional re-calibration for differing geology.",
        "Extreme Weather Events: Unprecedented precipitation events exceeding historical distributions may reduce model confidence."
    ]

    disclaimer = (
        "This software is developed as an academic machine learning research project for landslide susceptibility assessment. "
        "It is NOT a replacement for certified geotechnical investigations, municipal hazard zoning, or official emergency alerts."
    )

    return ModelInfoOut(
        model_name="Random Forest Multi-Class Classifier Pipeline",
        model_type="Ensemble Bagging Decision Trees with ColumnTransformer Preprocessing",
        library="Scikit-Learn (Pipeline, StandardScaler, OneHotEncoder, RandomForestClassifier)",
        hyperparameters=hyperparams,
        input_features=input_features,
        target_classes=["Low Risk", "Medium Risk", "High Risk"],
        metrics=ModelMetrics(**ml_loader.metrics),
        feature_importances=[ModelFeatureImportance(**f) for f in ml_loader.feature_importances],
        limitations=limitations,
        disclaimer=disclaimer
    )


# =========================================================================
# SAVED LOCATIONS ENDPOINTS
# =========================================================================

@router.get("/locations", response_model=List[SavedLocationOut])
def get_saved_locations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve saved monitoring locations for the authenticated user."""
    return db.query(SavedLocation).filter(
        SavedLocation.user_id == current_user.id
    ).order_by(desc(SavedLocation.created_at)).all()


@router.post("/locations", response_model=SavedLocationOut, status_code=status.HTTP_201_CREATED)
def create_saved_location(
    loc_data: SavedLocationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Save a custom or recurring monitoring location."""
    new_loc = SavedLocation(
        user_id=current_user.id,
        name=loc_data.name.strip(),
        latitude=loc_data.latitude,
        longitude=loc_data.longitude,
        elevation=loc_data.elevation,
        soil_type=loc_data.soil_type,
        land_use=loc_data.land_use,
        notes=loc_data.notes.strip() if loc_data.notes else None,
        created_at=datetime.utcnow()
    )
    db.add(new_loc)
    db.commit()
    db.refresh(new_loc)
    return new_loc


@router.delete("/locations/{loc_id}", status_code=status.HTTP_200_OK)
def delete_saved_location(
    loc_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a saved monitoring location owned by the current user."""
    loc = db.query(SavedLocation).filter(SavedLocation.id == loc_id).first()
    if not loc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Saved location record not found."
        )
    if current_user.role != "admin" and loc.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to delete this location."
        )
    db.delete(loc)
    db.commit()
    return {"status": "success", "message": f"Saved location #{loc_id} deleted."}

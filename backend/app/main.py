import os
import logging
from contextlib import asynccontextmanager
from datetime import datetime
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from sqlalchemy.orm import Session

from app.schemas import PredictionInput, PredictionOutput
from app.model_loader import ml_loader
from app.database import engine, Base, get_db
from app.models import Prediction
from app.auth import get_optional_user
from app.routers import auth_routes, dashboard_routes

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("landslide_api")

# Create tables
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing Landslide Prediction API...")
    loaded = ml_loader.load_artifacts()
    if loaded:
        logger.info("Model pipeline verified and ready for inference.")
    else:
        logger.warning("Pipeline artifacts could not be loaded at startup.")
    yield
    logger.info("Shutting down Landslide Prediction API...")

app = FastAPI(
    title="SlopeSentinel - Landslide Susceptibility Intelligence API",
    description="Full-stack enterprise application for landslide susceptibility risk classification using a trained Random Forest Pipeline.",
    version="2.0.0",
    lifespan=lifespan
)

# CORS configuration supporting development and production URLs
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "")
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174"
]
if allowed_origins_env:
    for o in allowed_origins_env.split(","):
        if o.strip() and o.strip() not in origins:
            origins.append(o.strip())

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth_routes.router)
app.include_router(dashboard_routes.router)

@app.get("/")
def health_check():
    is_ready = ml_loader.pipeline is not None
    return {
        "status": "healthy" if is_ready else "degraded",
        "system": "SlopeSentinel (Predicting Landslide Susceptibility System)",
        "product": "SlopeSentinel",
        "category": "Landslide Susceptibility Intelligence Platform",
        "model_loaded": is_ready,
        "model_type": "Random Forest Multi-Class Pipeline",
        "verified_accuracy": ml_loader.metrics.get("accuracy", 0.9270),
        "timestamp": datetime.utcnow().isoformat()
    }

@app.post("/predict", response_model=PredictionOutput)
@app.post("/api/predict", response_model=PredictionOutput)
def predict_susceptibility(
    data: PredictionInput,
    db: Session = Depends(get_db),
    current_user = Depends(get_optional_user)
):
    if ml_loader.pipeline is None:
        success = ml_loader.load_artifacts()
        if not success or ml_loader.pipeline is None:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Inference Engine is currently unavailable: Model pipeline artifact could not be loaded."
            )
            
    try:
        # Construct DataFrame matching exact feature names expected by pipeline
        input_dict = {
            "rainfall": data.rainfall,
            "slope": data.slope,
            "vegetation": data.vegetation,
            "elevation": data.elevation,
            "soil_type": data.soil_type,
            "land_use": data.land_use
        }
        df = pd.DataFrame([input_dict])
        
        # Pipeline prediction
        prediction_class_id = int(ml_loader.pipeline.predict(df)[0])
        probabilities = ml_loader.pipeline.predict_proba(df)[0]
        
        classes = list(ml_loader.pipeline.classes_)
        prob_dict = dict(zip(classes, probabilities))
        
        low_prob = float(prob_dict.get(0, 0.0))
        medium_prob = float(prob_dict.get(1, 0.0))
        high_prob = float(prob_dict.get(2, 0.0))
        
        class_map = {
            0: "Low Risk",
            1: "Medium Risk",
            2: "High Risk"
        }
        final_prediction = class_map.get(prediction_class_id, "Low Risk")
        
        out_probabilities = {
            "Low Risk": round(low_prob, 4),
            "Medium Risk": round(medium_prob, 4),
            "High Risk": round(high_prob, 4)
        }
        
        confidence = round(out_probabilities[final_prediction], 4)
        
        # Save to database
        db_prediction = Prediction(
            user_id=current_user.id if current_user else None,
            rainfall=data.rainfall,
            slope=data.slope,
            soil_type=data.soil_type,
            vegetation=data.vegetation,
            elevation=data.elevation,
            land_use=data.land_use,
            region_name=data.region_name.strip() if data.region_name else None,
            latitude=data.latitude,
            longitude=data.longitude,
            predicted_class=final_prediction,
            probability_high=high_prob,
            probability_medium=medium_prob,
            probability_low=low_prob,
            timestamp=datetime.utcnow()
        )
        db.add(db_prediction)
        db.commit()
        db.refresh(db_prediction)
        
        return {
            "id": db_prediction.id,
            "prediction": final_prediction,
            "predicted_class_id": prediction_class_id,
            "confidence": confidence,
            "probabilities": out_probabilities,
            "model_name": "SlopeSentinel Random Forest Ensemble (ColumnTransformer Pipeline)",
            "timestamp": db_prediction.timestamp,
            "input_features": input_dict,
            "region_name": db_prediction.region_name,
            "latitude": db_prediction.latitude,
            "longitude": db_prediction.longitude,
            "disclaimer": "Susceptibility assessment reflects spatial propensity based on historical environmental patterns. Not an early warning alert."
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Inference computation error: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Inference failed: {str(e)}"
        )

from fastapi import APIRouter, HTTPException
from app.schemas import PredictionInput, PredictionOutput
from app.preprocessing import preprocess_input
from app.model_loader import ml_loader
from app.utils import determine_risk_level

router = APIRouter()

@router.get("/")
def health_check():
    status = "healthy" if ml_loader.model is not None else "models missing"
    return {"status": status, "message": "Landslide Prediction API is running."}

@router.post("/predict", response_model=PredictionOutput)
def predict_susceptibility(data: PredictionInput):
    if ml_loader.model is None or ml_loader.scaler is None or ml_loader.encoder is None:
        raise HTTPException(
            status_code=500, 
            detail="Machine learning models are not loaded. Please ensure models/ directory is populated."
        )
    
    try:
        # Preprocess input utilizing Scaler + Encoder
        x_input = preprocess_input(data.dict())
        
        # Predict probability of the positive class (class 1 -> susceptible)
        probability_array = ml_loader.model.predict_proba(x_input)
        
        if probability_array.shape[1] > 1:
            probability = float(probability_array[0][1])
        else:
            # Fallback if probability shape issues arise
            probability = float(probability_array[0][0])
            
        risk_label = determine_risk_level(probability)
        
        return PredictionOutput(
            prediction=risk_label,
            probability=probability
        )
            
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction failed: {str(e)}")

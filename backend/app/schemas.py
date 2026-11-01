from pydantic import BaseModel, Field
from typing import Literal, Optional, List, Dict, Any
from datetime import datetime

EMAIL_PATTERN = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"

class PredictionInput(BaseModel):
    rainfall: float = Field(..., ge=0.0, le=1000.0, description="Rainfall in millimeters (0-1000 mm)")
    slope: float = Field(..., ge=0.0, le=60.0, description="Slope Angle in degrees (0-60°)")
    soil_type: Literal['Clay', 'Sand', 'Loam', 'Gravel'] = Field(..., description="Soil Classification")
    vegetation: float = Field(..., ge=0.0, le=100.0, description="Vegetation Cover percentage (0-100%)")
    elevation: float = Field(..., ge=0.0, le=3000.0, description="Elevation in meters (0-3000 m)")
    land_use: Literal['Urban', 'Forest', 'Agricultural', 'Barren'] = Field(..., description="Land Use Classification")
    region_name: Optional[str] = Field(None, max_length=100, description="Optional region or locality identifier")
    latitude: Optional[float] = Field(None, ge=-90.0, le=90.0, description="Optional latitude coordinate")
    longitude: Optional[float] = Field(None, ge=-180.0, le=180.0, description="Optional longitude coordinate")

class PredictionOutput(BaseModel):
    id: Optional[int] = None
    prediction: Literal["High Risk", "Medium Risk", "Low Risk"]
    predicted_class_id: int
    confidence: float
    probabilities: Dict[str, float]
    model_name: str
    timestamp: datetime
    input_features: Dict[str, Any]
    region_name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    disclaimer: str

class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., pattern=EMAIL_PATTERN)
    password: str = Field(..., min_length=6, max_length=128)

class UserLogin(BaseModel):
    email: str = Field(..., pattern=EMAIL_PATTERN)
    password: str

class PasswordChange(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=6, max_length=128)

class PasswordResetRequest(BaseModel):
    email: str = Field(..., pattern=EMAIL_PATTERN)

class PasswordResetConfirm(BaseModel):
    email: str = Field(..., pattern=EMAIL_PATTERN)
    reset_code: str
    new_password: str = Field(..., min_length=6, max_length=128)

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    role: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

class PredictionHistoryOut(BaseModel):
    id: int
    user_id: Optional[int] = None
    rainfall: float
    slope: float
    soil_type: str
    vegetation: float
    elevation: float
    land_use: str
    region_name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    predicted_class: str
    probability_high: float
    probability_medium: float
    probability_low: float
    timestamp: datetime

    class Config:
        from_attributes = True

class SavedLocationCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    latitude: Optional[float] = Field(None, ge=-90.0, le=90.0)
    longitude: Optional[float] = Field(None, ge=-180.0, le=180.0)
    elevation: Optional[float] = Field(None, ge=0.0, le=3000.0)
    soil_type: Optional[Literal['Clay', 'Sand', 'Loam', 'Gravel']] = None
    land_use: Optional[Literal['Urban', 'Forest', 'Agricultural', 'Barren']] = None
    notes: Optional[str] = Field(None, max_length=300)

class SavedLocationOut(BaseModel):
    id: int
    user_id: int
    name: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    elevation: Optional[float] = None
    soil_type: Optional[str] = None
    land_use: Optional[str] = None
    notes: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class DashboardSummary(BaseModel):
    total_predictions: int
    user_predictions: int
    high_risk_count: int
    medium_risk_count: int
    low_risk_count: int
    last_prediction: Optional[str] = None

class ModelFeatureImportance(BaseModel):
    feature: str
    importance: float
    percentage: float

class ModelMetrics(BaseModel):
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    roc_auc: float
    test_samples: int
    train_samples: int
    confusion_matrix: List[List[int]]
    classes: List[str]

class ModelInfoOut(BaseModel):
    model_name: str
    model_type: str
    library: str
    hyperparameters: Dict[str, Any]
    input_features: List[Dict[str, Any]]
    target_classes: List[str]
    metrics: ModelMetrics
    feature_importances: List[ModelFeatureImportance]
    limitations: List[str]
    disclaimer: str

class AnalyticsDistributionItem(BaseModel):
    name: str
    value: int
    percentage: float

class AnalyticsHistoryTrendItem(BaseModel):
    date: str
    high_risk: int
    medium_risk: int
    low_risk: int
    total: int

class AnalyticsOut(BaseModel):
    user_distribution: List[AnalyticsDistributionItem]
    system_distribution: List[AnalyticsDistributionItem]
    history_trends: List[AnalyticsHistoryTrendItem]
    model_metrics: ModelMetrics
    feature_importances: List[ModelFeatureImportance]

import pandas as pd
import numpy as np
from app.model_loader import ml_loader

def preprocess_input(data: dict) -> np.ndarray:
    """
    Transforms the raw incoming dictionary map into an explicit array ready for prediction 
    by scaling numerical features and one-hot encoding categorical features.
    """
    # Define columns strictly matching training script logic
    numerical_cols = ['rainfall', 'slope', 'vegetation', 'elevation']
    categorical_cols = ['soil_type', 'land_use']
    
    # Convert data dictionary to DataFrame shape (1 sample)
    df = pd.DataFrame([data])
    
    # Apply pre-fitted scaler
    X_num = ml_loader.scaler.transform(df[numerical_cols])
    
    # Apply pre-fitted encoder
    X_cat = ml_loader.encoder.transform(df[categorical_cols])
    
    # Stack features uniformly
    X_processed = np.hstack((X_num, X_cat))
    return X_processed

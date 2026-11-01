import pandas as pd
import numpy as np
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report

import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def generate_fallback_dataset(file_path):
    """Generates a synthetic dataset mirroring the requested real dataset schema if it's missing."""
    logger.info(f"Dataset not found at {file_path}. Generating synthetic dataset for fallback...")
    
    np.random.seed(42)
    n_samples = 5000
    
    rainfall = np.random.uniform(0, 1000, n_samples)
    slope = np.random.uniform(0, 60, n_samples)
    vegetation = np.random.uniform(0, 100, n_samples)
    elevation = np.random.uniform(0, 3000, n_samples)
    
    soil_types = ['Clay', 'Sand', 'Loam', 'Gravel']
    soil_type = np.random.choice(soil_types, n_samples)
    
    land_uses = ['Urban', 'Forest', 'Agricultural', 'Barren']
    land_use = np.random.choice(land_uses, n_samples)
    
    df = pd.DataFrame({
        'rainfall': rainfall,
        'slope': slope,
        'soil_type': soil_type,
        'vegetation': vegetation,
        'elevation': elevation,
        'land_use': land_use
    })
    
    # Generate risk labels mimicking required structure
    def get_risk(row):
        r, s, v, e = row['rainfall'], row['slope'], row['vegetation'], row['elevation']
        if r > 300 and s > 35 and v < 30 and 500 <= e <= 2000:
            return "High"
        elif 150 <= r <= 300 and 20 <= s <= 35 and 30 <= v <= 60:
            return "Medium"
        elif r < 150 and s < 20 and v > 60:
            return "Low"
        else:
            score = (r * 0.3) + (s * 3.0) - (v * 2.0)
            if score > 150: return "High"
            elif score > 50: return "Medium"
            return "Low"
            
    df['risk_level'] = df.apply(get_risk, axis=1)
    
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    df.to_csv(file_path, index=False)
    logger.info(f"Synthetic dataset saved to {file_path}")
    return df

def train_and_save():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(base_dir, 'data', 'landslide_dataset.csv')
    models_dir = os.path.join(base_dir, 'models')
    
    # Ensure data directory exists
    os.makedirs(os.path.join(base_dir, 'data'), exist_ok=True)
    os.makedirs(models_dir, exist_ok=True)
    
    # 1. Load Dataset
    if not os.path.exists(data_path):
        df = generate_fallback_dataset(data_path)
    else:
        logger.info(f"Loading real dataset from {data_path}")
        df = pd.read_csv(data_path)
    
    # 2. Target Mapping
    risk_map = {"Low": 0, "Medium": 1, "High": 2} # 0=Low, 1=Medium, 2=High
    if 'risk_level' not in df.columns:
        raise ValueError("Dataset is missing the 'risk_level' column.")
        
    df['target'] = df['risk_level'].map(risk_map)
    df = df.dropna(subset=['target']) # Drop unmappable rows
    
    X = df.drop(['risk_level', 'target'], axis=1)
    y = df['target'].astype(int)
    
    # 3. Features
    numerical_features = ['rainfall', 'slope', 'vegetation', 'elevation']
    categorical_features = ['soil_type', 'land_use']
    
    # Ensure columns exist
    for col in numerical_features + categorical_features:
        if col not in X.columns:
             raise ValueError(f"Dataset is missing required feature column '{col}'")
    
    X = X[numerical_features + categorical_features]
    
    # 4. Train/Test Split (80/20)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20, random_state=42, stratify=y)
    
    # 5. Pipeline Setup
    logger.info("Building ColumnTransformer Pipeline...")
    
    numeric_transformer = StandardScaler()
    categorical_transformer = OneHotEncoder(handle_unknown='ignore')
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, numerical_features),
            ('cat', categorical_transformer, categorical_features)
        ]
    )
    
    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('classifier', RandomForestClassifier(n_estimators=100, random_state=42, max_depth=12))
    ])
    
    # 6. Training Process
    logger.info("Training Pipeline...")
    pipeline.fit(X_train, y_train)
    
    # 7. Evaluation
    logger.info("Evaluating Model...")
    y_pred = pipeline.predict(X_test)
    
    accuracy = accuracy_score(y_test, y_pred)
    logger.info(f"\nModel Accuracy: {accuracy:.4f}\n")
    
    print("Confusion Matrix:")
    print(confusion_matrix(y_test, y_pred))
    
    print("\nClassification Report:")
    target_names = ['Low Risk', 'Medium Risk', 'High Risk']
    
    # Handle missing classes in smaller datasets safely
    unique_classes_in_test = np.unique(y_test)
    names = [target_names[i] for i in unique_classes_in_test]
    print(classification_report(y_test, y_pred, target_names=names))
    
    # 8. Save Pipeline
    pipeline_path = os.path.join(models_dir, 'landslide_pipeline.pkl')
    joblib.dump(pipeline, pipeline_path)
    logger.info(f"Complete predictive pipeline saved successfully to {pipeline_path}")

if __name__ == "__main__":
    train_and_save()

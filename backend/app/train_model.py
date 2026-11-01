import pandas as pd
import numpy as np
import joblib
import os
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler, OneHotEncoder

def determine_risk(row):
    r = row['rainfall']
    s = row['slope']
    v = row['vegetation']
    e = row['elevation']
    
    # User's strict logic
    # High Risk: Rainfall > 300, Slope > 35, Vegetation < 30, Elevation 500-2000
    if r > 300 and s > 35 and v < 30 and 500 <= e <= 2000:
        return 2 # High Risk
        
    # Medium Risk: Rainfall 150-300, Slope 20-35, Vegetation 30-60
    elif 150 <= r <= 300 and 20 <= s <= 35 and 30 <= v <= 60:
        return 1 # Medium Risk
        
    # Low Risk: Rainfall < 150, Slope < 20, Vegetation > 60
    elif r < 150 and s < 20 and v > 60:
        return 0 # Low Risk
        
    else:
        # Generic deterministic logic for in-between outliers
        score = (r * 0.3) + (s * 3.0) - (v * 2.0)
        
        if score > 150:
            return 2 # High
        elif score > 50:
            return 1 # Medium
        return 0 # Low
        

def generate_synthetic_data(n_samples=5000):
    np.random.seed(42)
    
    # Numerical Ranges based exactly on requested validation
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
    
    # Classification: 0 (Low), 1 (Medium), 2 (High)
    df['target'] = df.apply(determine_risk, axis=1)
    
    return df

def train_and_save():
    print("Generating synthetic dataset (5000+ samples)...")
    df = generate_synthetic_data(5500)
    
    X = df.drop('target', axis=1)
    y = df['target']
    
    numerical_cols = ['rainfall', 'slope', 'vegetation', 'elevation']
    categorical_cols = ['soil_type', 'land_use']
    
    print("Fitting Scaler and Encoder...")
    scaler = StandardScaler()
    scaler.fit(X[numerical_cols])
    
    encoder = OneHotEncoder(sparse_output=False, handle_unknown='ignore')
    encoder.fit(X[categorical_cols])
    
    X_num = scaler.transform(X[numerical_cols])
    X_cat = encoder.transform(X[categorical_cols])
    X_processed = np.hstack((X_num, X_cat))
    
    print("Training RandomForest Multi-class Classifier...")
    rf_clf = RandomForestClassifier(n_estimators=100, random_state=42, max_depth=12)
    rf_clf.fit(X_processed, y)
    
    # Save Artifacts
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    models_dir = os.path.join(base_dir, 'models')
    os.makedirs(models_dir, exist_ok=True)
    
    joblib.dump(rf_clf, os.path.join(models_dir, 'landslide_model.pkl'))
    joblib.dump(scaler, os.path.join(models_dir, 'scaler.pkl'))
    joblib.dump(encoder, os.path.join(models_dir, 'encoder.pkl'))
    
    print("Auto-training complete. Artifacts saved securely.")

if __name__ == "__main__":
    train_and_save()

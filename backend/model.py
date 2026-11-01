import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import pickle
import os

os.makedirs('backend', exist_ok=True)

def generate_model():
    print("Generating synthetic data for new schema...")
    np.random.seed(42)
    n_samples = 1500
    
    # 6 Features
    rainfall = np.random.uniform(50, 600, n_samples)
    slope = np.random.uniform(0, 70, n_samples)
    soil_type = np.random.randint(0, 4, n_samples) # 0: Clay, 1: Sand, 2: Loam, 3: Gravel
    vegetation = np.random.uniform(0, 100, n_samples)
    elevation = np.random.uniform(10, 2000, n_samples)
    land_use = np.random.randint(0, 4, n_samples) # 0: Urban, 1: Forest, 2: Agricultural, 3: Barren
    
    risk_score = (rainfall * 0.4) + (slope * 2.5) - (vegetation * 0.8) + (elevation * 0.05)
    noise = np.random.normal(0, 15, n_samples)
    target = ((risk_score + noise) > 120).astype(int)
    
    df = pd.DataFrame({
        'rainfall': rainfall,
        'slope': slope,
        'soil_type': soil_type,
        'vegetation': vegetation,
        'elevation': elevation,
        'land_use': land_use,
        'target': target
    })
    
    X = df.drop('target', axis=1)
    y = df['target']
    
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y)
    
    model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'model.pkl')
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
    print(f"Model saved to {model_path}")

if __name__ == "__main__":
    generate_model()

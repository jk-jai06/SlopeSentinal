# SlopeSentinel Backend API

A robust, full-stack Machine Learning application providing an AI-driven, research-grade predictive model integrating FastAPI and React.

## System Architecture

### Backend Stack
- **API Runtime:** FastAPI with Uvicorn server processing `PredictionInput` schemas.
- **Machine Learning Core:** A hybrid classification model combining `RandomForestClassifier` and `GradientBoostingClassifier` orchestrated dynamically via scikit-learn's `VotingClassifier` (soft voting).
- **Data Engineering:** `train_model.py` pipeline with categorical logic generation, one-hot encoding, and numerical standardization utilizing modular `StandardScaler` mechanisms.

### Application Architecture (`/app`)
```text
\u251C\u2500\u2500 app/
\u2502   \u251C\u2500\u2500 main.py             # FastAPI Server Entrypoint
\u2502   \u251C\u2500\u2500 routes.py           # Endpoint Controller (/predict)
\u2502   \u251C\u2500\u2500 schemas.py          # Pydantic input/output schemas
\u2502   \u251C\u2500\u2500 model_loader.py     # Joblib engine for loading PKL artifacts
\u2502   \u251C\u2500\u2500 preprocessing.py    # Transforming JSON input into NumPy Arrays
\u2502   \u2514\u2500\u2500 utils.py            # Utility logical operations
\u251C\u2500\u2500 models/               # Contains pre-fitted artifacts (.pkl)
```

## Running the Architecture

### Running the API Engine

Activate your local python environment or initialize one.
```bash
python -m venv .venv
# Activate:
.venv\Scripts\activate   # Windows
# or
source .venv/bin/activate # Unix
```

Install requirements:
```bash
cd backend
pip install -r requirements.txt
```

Generate advanced hybrid classification logic:
```bash
python train_model.py
```

Serve the FastAPI endpoint instances over uvicorn:
```bash
uvicorn app.main:app --reload
```
The server will be available dynamically handling Cross-Origin routing at `http://localhost:8000`. Test via `/docs` (Swagger UI).

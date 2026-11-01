# PROJECT AUDIT & SYSTEM IMPLEMENTATION PLAN
**Project:** Predicting Landslide Susceptibility Using Machine Learning  
**Author / Candidate:** Jaisnav Krishna H S (Reg No: 24CS0351), Jayasurya P (Reg No: 24CS0369)  
**Institution:** Chennai Institute of Technology (CIT), Autonomous  
**Audit Date:** October 2026  
**Auditor / Architect:** Senior Full-Stack & ML Integration Systems Engineer  

---

## 1. Executive Summary & Audit Context

This audit evaluates the codebase and technical artifacts of the **Landslide Susceptibility Prediction System** against:
1. The project academic report: `Jaisnav CCP report.pdf` (CIT CSE Dept).
2. The provided UI screenshots illustrating the target production dashboard.
3. The actual source code, dataset files, and serialized model artifacts present in the repository.

The objective of this initiative is to eliminate architectural discrepancies, resolve severe runtime defects, unify the UI/UX with the dark navy/blue-purple dashboard aesthetic, and deliver an enterprise-grade, fully functional application suitable for technical demonstrations, academic evaluation, and portfolio publication—without modifying or retraining the protected machine learning model.

---

## 2. Repository & Architecture Audit

### 2.1 Technology Stack & Versions
- **Backend Framework:** FastAPI 0.100+, Uvicorn 0.23+ (ASGI)
- **Programming Language (Backend):** Python 3.12 (CPython)
- **Machine Learning & Data Engine:** Scikit-Learn 1.8.0, Pandas 2.1+, NumPy 1.25+, Joblib 1.3+
- **Database / ORM:** SQLite 3 (`backend/landslide.db`) managed via SQLAlchemy 2.0+
- **Security & Authentication:** `python-jose` (HS256 JWT tokens), `bcrypt` (salted password hashing)
- **Frontend Framework:** React 18.2.0, Vite 4.5.14
- **Frontend Styling:** Tailwind CSS 3.3.5, Custom Glassmorphism CSS utilities
- **UI Components & Icons:** Lucide-react 0.292.0
- **Data Visualization:** Recharts 2.9.0
- **Client Routing:** React Router DOM 6.18.0
- **HTTP Client:** Axios 1.6.0

### 2.2 Directory Structure & Entry Points
```text
SlopeSentinel/
├── backend/
│   ├── app/
│   │   ├── auth.py              # JWT authentication & password verification logic
│   │   ├── database.py          # SQLAlchemy SQLite connection & sessionmaker
│   │   ├── main.py              # Modular FastAPI app with routers
│   │   ├── models.py            # SQLAlchemy ORM models (User, Prediction)
│   │   ├── model_loader.py      # Singleton artifact loader
│   │   ├── preprocessing.py     # Data transformation helpers
│   │   ├── schemas.py           # Pydantic v2 schemas for request/response validation
│   │   ├── train_model.py       # Pipeline construction & training script
│   │   ├── utils.py             # Evaluation & analytical utilities
│   │   └── routers/
│   │       ├── auth_routes.py       # /api/auth/register, /login, /profile
│   │       └── dashboard_routes.py  # /api/dashboard/summary, /history, /analytics
│   ├── data/
│   │   └── landslide_dataset.csv    # 5,000 tabular observation samples
│   ├── models/
│   │   ├── landslide_pipeline.pkl   # Fitted Scikit-Learn Pipeline (ColumnTransformer + RF)
│   │   ├── landslide_model.pkl      # Standalone RF classifier
│   │   ├── scaler.pkl               # StandardScaler for numeric features
│   │   └── encoder.pkl              # OneHotEncoder for categorical features
│   ├── landslide.db             # Active SQLite database
│   ├── main.py                  # Legacy standalone FastAPI script (to be unified)
│   ├── model.py                 # Legacy synthetic data generator
│   ├── train_model.py           # Training script for pipeline artifact
│   └── requirements.txt         # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/          # Navbar, PredictionForm, ResultCard, Charts, ProtectedRoute
│   │   ├── context/             # AuthContext (JWT management)
│   │   ├── layouts/             # DashboardLayout
│   │   ├── pages/               # Home, Login, Register, Summary, History, Analytics, Settings
│   │   ├── services/            # Centralized API service
│   │   ├── App.jsx              # Main routing configuration
│   │   └── index.css            # Global styling & Tailwind directives
│   ├── package.json             # NPM package manifest
│   └── vite.config.js           # Vite dev server & build settings
├── PROJECT_AUDIT.md             # This comprehensive audit document
└── README.md                    # Project documentation
```

---

## 3. Machine Learning Inference Pipeline Audit

### 3.1 Loaded Model Artifact
- **File:** `backend/models/landslide_pipeline.pkl`
- **Class:** `sklearn.pipeline.Pipeline`
- **Pipeline Structure:**
  1. `preprocessor`: `sklearn.compose.ColumnTransformer`
     - `num`: `StandardScaler` fitted on `['rainfall', 'slope', 'vegetation', 'elevation']`
     - `cat`: `OneHotEncoder(handle_unknown='ignore')` fitted on `['soil_type', 'land_use']`
  2. `classifier`: `sklearn.ensemble.RandomForestClassifier`
     - `n_estimators`: 100
     - `max_depth`: 12
     - `random_state`: 42
     - `criterion`: 'gini'

### 3.2 Feature Specification & Valid Ranges
| Feature Name | Type | Unit / Allowed Categories | Source / Transformer | Valid Range / Categories |
| :--- | :--- | :--- | :--- | :--- |
| `rainfall` | Numeric | Millimeters (mm) | StandardScaler | $0.0 \le x \le 1000.0$ |
| `slope` | Numeric | Degrees (°) | StandardScaler | $0.0 \le x \le 60.0$ |
| `vegetation`| Numeric | Percent (%) | StandardScaler | $0.0 \le x \le 100.0$ |
| `elevation` | Numeric | Meters (m) | StandardScaler | $0.0 \le x \le 3000.0$ |
| `soil_type` | Categorical | Discrete classes | OneHotEncoder | `Clay`, `Sand`, `Loam`, `Gravel` |
| `land_use` | Categorical | Discrete classes | OneHotEncoder | `Urban`, `Forest`, `Agricultural`, `Barren` |

### 3.3 Target Classification & Class Mapping
The pipeline predicts a 3-class target integer array:
- `0` $\rightarrow$ **Low Risk** (Favorable slope, dense vegetation, low precipitation)
- `1` $\rightarrow$ **Medium Risk** (Moderate slope, intermediate precipitation or vegetation)
- `2` $\rightarrow$ **High Risk** (Steep slope, excessive rainfall, deforested/barren terrain)

### 3.4 Verified Evaluation Metrics (Independent 20% Test Split)
Evaluated on `backend/data/landslide_dataset.csv` (1,000 unseen test samples, stratified holdout):
- **Accuracy:** $92.70\%$
- **Weighted Precision:** $92.70\%$
- **Weighted Recall:** $92.70\%$
- **Weighted F1-Score:** $92.69\%$
- **Multiclass ROC-AUC (OvR Weighted):** $0.9895$
- **Confusion Matrix:**
  $$\begin{pmatrix} 218 & 23 & 0 \\ 14 & 257 & 22 \\ 0 & 14 & 452 \end{pmatrix}$$
- **Feature Importances:**
  - `rainfall`: $44.14\%$
  - `vegetation`: $24.01\%$
  - `slope`: $20.91\%$
  - `elevation`: $6.78\%$
  - Categorical variables (`soil_type`, `land_use`): $\approx 4.16\%$ aggregate

---

## 4. Resolution of the Five Critical Project Issues

### Issue 1: Dataset Features vs. Prediction Form Mismatch
* **Finding:** While the introductory literature review of `Jaisnav CCP report.pdf` references an exploratory Kaggle dataset featuring precipitation, soil moisture, elevation, temperature, and humidity, the actual engineered dataset (`landslide_dataset.csv`), the trained pipeline artifact (`landslide_pipeline.pkl`), the report's own code screenshot (page 50), and the report's UI screenshots (page 48) strictly utilize the six geomorphological and climatic parameters:
  $$\text{Rainfall (mm)}, \text{Slope Angle (°)}, \text{Soil Type}, \text{Vegetation Cover (%)}, \text{Elevation (m)}, \text{Land Use Type}$$
* **Resolution:** The prediction form schema in the frontend and Pydantic models in the backend strictly enforce these exact six parameters. No fake sensor feeds or artificial parameter conversions are introduced.

### Issue 2: Accurate Model Naming & Transparency
* **Finding:** The prior UI displayed a button labeled "Run Neural Analysis", giving the misleading impression that a Deep Neural Network (ANN/LSTM) was performing inference. The loaded artifact is an ensemble Scikit-Learn `RandomForestClassifier`.
* **Resolution:**
  - The primary action button is renamed to **"Predict Landslide Risk"**.
  - The model is clearly and accurately presented as a **Random Forest Ensemble Classifier** throughout the application and in the dedicated Model Information page.

### Issue 3: Data Leakage and Evaluation Validity
* **Finding:** The pipeline encapsulates both feature scaling (`StandardScaler`) and encoding (`OneHotEncoder`) along with the classifier. In the training script, `pipeline.fit(X_train, y_train)` was executed exclusively on the training split, preventing data leakage. However, the report refers to a "spatial-temporal split", whereas the available data lacks explicit temporal timestamps and spatial GPS polygon coordinates, making the actual implementation a stratified random holdout split.
* **Resolution:** This technical distinction is formally documented in this audit and in the Model Information page, clearly indicating that temporal/spatial cross-validation represents a future production enhancement when GIS boundary coordinates and time-series sensor feeds are integrated.

### Issue 4: Susceptibility Assessment vs. Real-Time Early Warning
* **Finding:** The system performs static/quasi-static environmental susceptibility classification. It does not measure real-time pore water pressure, acoustic emissions, or ground displacement.
* **Resolution:** The system is explicitly titled and presented as a **Landslide Susceptibility Assessment System**. Disclaimers clarify that the application predicts the spatial propensity for slope instability given the entered parameters, not the exact timing of slope failure, and does not replace official meteorological or civil protection warning systems.

### Issue 5: Performance Evidence & Claim Reconciliation
* **Finding:** The report mentions 94% accuracy in the abstract, ~91% in Section 5.4, and 92% in Table 6.1.
* **Resolution:** The actual verified test accuracy of the saved `landslide_pipeline.pkl` model is **92.70%** (ROC-AUC 0.9895). The system UI will display this independently verified empirical metric rather than unverified static claims.

---

## 5. Architectural & Security Defect Remediation

1. **Passlib + Bcrypt Python 3.12 Crash:**
   - *Problem:* Passlib 1.7.4 inspects `bcrypt.__about__.__version__`, which was deprecated and removed in Bcrypt 4.1.0+, causing user registration and login to throw fatal 500 exceptions on Python 3.12.
   - *Solution:* Replace Passlib's broken wrapper with direct, standardized `bcrypt.hashpw()` and `bcrypt.checkpw()` invocations, ensuring robust, fault-tolerant password hashing.
2. **Unified Backend Entrypoint:**
   - *Problem:* `backend/main.py` loaded a legacy binary model (`backend/model.pkl`) without database or auth routes, while `backend/app/main.py` held the complete application.
   - *Solution:* Update `backend/main.py` to import and expose `app` directly from `backend.app.main`, guaranteeing that both `uvicorn backend.main:app` and `uvicorn backend.app.main:app` execute the complete multi-class system.
3. **Frontend Visual Identity Unification:**
   - *Problem:* While `/` used dark glassmorphism, `/login`, `/register`, and `/dashboard/*` loaded generic white/light-mode pages.
   - *Solution:* Re-architect all pages (`Login`, `Register`, `Dashboard`, `History`, `Analytics`, `Settings`) to adhere to the dark navy (`#11182F`) and blue-purple gradient aesthetic shown in the screenshots.
4. **ResultCard Confidence & Chart Mapping:**
   - *Problem:* Prior chart logic combined Medium and High risk into an ambiguous "Hazard" bar and inverted probabilities in certain edge cases.
   - *Solution:* Implement a horizontal bar chart depicting all three classes (**Low Risk**, **Medium Risk**, **High Risk**) with genuine probability values extracted directly from `pipeline.predict_proba()`.
5. **Prediction History & Persistence:**
   - *Problem:* Prediction records lacked filtering, search, pagination, and user ownership deletion checks.
   - *Solution:* Enhance `/api/dashboard/history` with query parameters (`risk_filter`, `skip`, `limit`) and allow authenticated users to delete their own historical records safely.

---

## 6. Implementation Checklist & Verification Gates
- [x] Phase 1: Complete repository and model audit (`PROJECT_AUDIT.md`).
- [ ] Phase 2: Fix 5 critical project issues in codebase.
- [ ] Phase 3: Unify frontend design system (Dark navy `#11182F`, `#1C2740` cards, neon glows).
- [ ] Phase 4: Implement secure authentication (Login, Register, Forgot Password, Bcrypt 3.12 safe).
- [ ] Phase 5: Re-export backend entry points and enhance prediction API with robust error handling.
- [ ] Phase 6: Upgrade prediction persistence, history filtering, pagination, and ownership enforcement.
- [ ] Phase 7: Complete all pages (Dashboard, History, Analytics, Model Info, Settings).
- [ ] Phase 8: Centralize frontend API client and types.
- [ ] Phase 9: Secure credentials, add `.env.example`, `.gitignore`.
- [ ] Phase 10: Run full test suite (backend API tests, ML integration tests, frontend production build).
- [ ] Phase 11: Provide comprehensive startup instructions and final project documentation.

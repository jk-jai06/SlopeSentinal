import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [formData, setFormData] = useState({
        rainfall: '',
        slope: '',
        soil_type: 0,
        vegetation: 0
    });

    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setPrediction(null);

        try {
            // Parse numeric values
            const payload = {
                rainfall: parseFloat(formData.rainfall),
                slope: parseFloat(formData.slope),
                soil_type: parseInt(formData.soil_type, 10),
                vegetation: parseInt(formData.vegetation, 10)
            };

            const response = await axios.post('http://127.0.0.1:8000/predict', payload);
            setPrediction(response.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to connect to the backend server. Make sure it is running!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-container">
            <div className="glass-panel">
                <header className="app-header">
                    <h1>Landslide Predictor \u26A0\uFE0F</h1>
                    <p>AI-powered susceptibility analysis based on environmental parameters.</p>
                </header>

                <form className="prediction-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Rainfall (mm)</label>
                        <input
                            type="number"
                            name="rainfall"
                            value={formData.rainfall}
                            onChange={handleChange}
                            placeholder="e.g. 150.5"
                            step="0.1"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Slope (Degrees)</label>
                        <input
                            type="number"
                            name="slope"
                            value={formData.slope}
                            onChange={handleChange}
                            placeholder="e.g. 25.0"
                            step="0.1"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Soil Type</label>
                        <select name="soil_type" value={formData.soil_type} onChange={handleChange}>
                            <option value={0}>Sandy</option>
                            <option value={1}>Clay</option>
                            <option value={2}>Loamy</option>
                            <option value={3}>Silty</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Vegetation Cover</label>
                        <select name="vegetation" value={formData.vegetation} onChange={handleChange}>
                            <option value={0}>None / Barren</option>
                            <option value={1}>Sparse</option>
                            <option value={2}>Dense</option>
                        </select>
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Analyzing...' : 'Predict Susceptibility'}
                    </button>
                </form>

                {error && <div className="error-message">{error}</div>}

                {prediction && (
                    <div className={`result-card ${prediction.prediction === 1 ? 'danger' : 'safe'}`}>
                        <h2>{prediction.result}</h2>
                        <div className="result-details">
                            <div className="detail-item">
                                <span className="label">Risk Probability:</span>
                                <span className="value">{(prediction.probability * 100).toFixed(1)}%</span>
                            </div>
                        </div>
                        {prediction.prediction === 1 && (
                            <p className="warning-text">Warning: High risk of landslide detected. Immediate preventive measures recommended.</p>
                        )}
                        {prediction.prediction === 0 && (
                            <p className="safe-text">Status Normal: Low susceptibility detected for the given parameters.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;

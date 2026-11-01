import React, { useState, useEffect } from 'react';
import PredictionForm from '../components/PredictionForm';
import ResultCard from '../components/ResultCard';
import { predictLandslide, getHealth } from '../services/api';
import { ShieldCheck, AlertCircle } from 'lucide-react';

const Home = () => {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [backendStatus, setBackendStatus] = useState(null);

    useEffect(() => {
        const checkBackend = async () => {
            try {
                const health = await getHealth();
                setBackendStatus(health);
            } catch (err) {
                setBackendStatus({ status: 'offline', message: 'Backend unreachable' });
            }
        };
        checkBackend();
    }, []);

    const handlePredict = async (formData) => {
        setLoading(true);
        setError('');
        setResult(null);
        try {
            const response = await predictLandslide(formData);
            setResult(response);
        } catch (err) {
            const detailMsg = err.response?.data?.detail;
            if (typeof detailMsg === 'string') {
                setError(detailMsg);
            } else if (Array.isArray(detailMsg)) {
                setError(detailMsg.map(d => `${d.loc?.slice(-1)[0]}: ${d.msg}`).join(', '));
            } else {
                setError(err.message || 'Failed to communicate with prediction backend. Is the FastAPI service active on port 8000?');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setResult(null);
        setError('');
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* System Status Pill */}
            {backendStatus && backendStatus.status === 'offline' && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-300 text-sm animate-pulse">
                    <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
                    <span>FastAPI inference backend is not detected at <code>http://127.0.0.1:8000</code>. Please start the backend service.</span>
                </div>
            )}

            {/* Desktop Two-Column Layout strictly matching screenshots */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Panel: Form (Col span 7 on large desktop) */}
                <div className="lg:col-span-7 w-full animate-[fadeIn_0.3s_ease-out]">
                    <PredictionForm onPredict={handlePredict} loading={loading} />
                </div>

                {/* Right Panel: Output Card (Col span 5 on large desktop) */}
                <div className="lg:col-span-5 w-full flex justify-center lg:sticky lg:top-24 animate-[fadeIn_0.5s_ease-out]">
                    <ResultCard
                        result={result}
                        error={error}
                        loading={loading}
                        onReset={handleReset}
                    />
                </div>
            </div>
        </div>
    );
};

export default Home;

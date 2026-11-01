import React, { useState } from 'react';
import PredictionForm from '../../components/PredictionForm';
import ResultCard from '../../components/ResultCard';
import { predictLandslide } from '../../services/api';

const NewPrediction = () => {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
                setError(err.message || 'Failed to connect to the prediction server.');
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
        <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
            <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    SlopeSentinel Risk Assessment
                </h1>
                <p className="text-xs sm:text-sm text-[#94a3b8] mt-1">
                    Execute inference through the SlopeSentinel Random Forest pipeline with custom geomorphological and climatic parameters.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 w-full">
                    <PredictionForm onPredict={handlePredict} loading={loading} />
                </div>
                <div className="lg:col-span-5 w-full flex justify-center lg:sticky lg:top-8">
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

export default NewPrediction;

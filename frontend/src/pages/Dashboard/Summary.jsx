import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Activity, AlertTriangle, ShieldCheck, Flame, Compass, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getDashboardSummary } from '../../services/api';

const Summary = () => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const data = await getDashboardSummary();
                setSummary(data);
            } catch (error) {
                console.error("Failed to fetch dashboard summary", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-8 bg-[#1c2740] rounded-xl w-64"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-32 bg-[#1c2740] rounded-2xl"></div>
                    ))}
                </div>
            </div>
        );
    }

    const cards = [
        {
            title: "Total Evaluations",
            value: summary?.total_predictions ?? 0,
            subtitle: user?.role === 'admin' ? "System-wide predictions" : `${summary?.user_predictions ?? 0} personal evaluations`,
            icon: Activity,
            color: "text-blue-400",
            bg: "bg-blue-500/10 border-blue-500/20",
            border: "border-blue-500/30"
        },
        {
            title: "High Risk Zones",
            value: summary?.high_risk_count ?? 0,
            subtitle: "Critical susceptibility flagged",
            icon: Flame,
            color: "text-rose-400",
            bg: "bg-rose-500/10 border-rose-500/20",
            border: "border-rose-500/30"
        },
        {
            title: "Medium Risk Zones",
            value: summary?.medium_risk_count ?? 0,
            subtitle: "Intermediate vulnerability",
            icon: AlertTriangle,
            color: "text-amber-400",
            bg: "bg-amber-500/10 border-amber-500/20",
            border: "border-amber-500/30"
        },
        {
            title: "Low Risk Zones",
            value: summary?.low_risk_count ?? 0,
            subtitle: "Stable geomorphology",
            icon: ShieldCheck,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10 border-emerald-500/20",
            border: "border-emerald-500/30"
        },
    ];

    return (
        <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        SlopeSentinel Dashboard
                    </h1>
                    <p className="text-xs sm:text-sm text-[#94a3b8] mt-1">
                        Monitor assessments, explore environmental conditions, and understand landslide susceptibility. Welcome back, <strong className="text-white">{user?.name}</strong>.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        to="/dashboard/predict"
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2864f0] to-[#8b42f5] hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2"
                    >
                        <Compass className="w-4 h-4" />
                        <span>New Prediction</span>
                    </Link>
                </div>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, idx) => (
                    <div
                        key={idx}
                        className={`bg-[#1c2740] rounded-2xl p-6 shadow-xl border ${card.border} hover:border-[#2864f0]/60 transition-all duration-300 relative overflow-hidden group`}
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider mb-2">
                                    {card.title}
                                </p>
                                <h3 className="text-3xl font-black text-white font-mono tracking-tight">
                                    {card.value}
                                </h3>
                                <p className="text-[11px] text-slate-400 mt-1">
                                    {card.subtitle}
                                </p>
                            </div>
                            <div className={`p-3 rounded-xl border ${card.bg} ${card.color} shadow-inner`}>
                                <card.icon className="h-6 w-6" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Status & Scientific Guidance Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Status Card */}
                <div className="lg:col-span-7 bg-[#1c2740] rounded-2xl p-6 border border-[#334155]/80 shadow-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-[#334155]/60 pb-3">
                        <div className="flex items-center gap-2">
                            <Activity className="w-5 h-5 text-blue-400" />
                            <h2 className="text-base font-bold text-white tracking-tight">Latest System Activity</h2>
                        </div>
                        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 font-medium">
                            Live Database
                        </span>
                    </div>

                    {summary?.last_prediction ? (
                        <div className="bg-[#18213a] rounded-xl p-4 border border-[#334155] flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <span className={`w-3.5 h-3.5 rounded-full ${
                                    summary.last_prediction === 'High Risk' ? 'bg-rose-500 ring-4 ring-rose-500/20' :
                                    summary.last_prediction === 'Medium Risk' ? 'bg-amber-400 ring-4 ring-amber-400/20' :
                                    'bg-emerald-400 ring-4 ring-emerald-400/20'
                                }`}></span>
                                <div>
                                    <p className="text-sm text-slate-200">
                                        Most recent evaluation: <strong className="text-white">{summary.last_prediction}</strong>
                                    </p>
                                    <p className="text-[11px] text-[#94a3b8]">Evaluated using Scikit-Learn Random Forest Pipeline</p>
                                </div>
                            </div>
                            <Link
                                to="/dashboard/history"
                                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                            >
                                <span>View History</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    ) : (
                        <div className="p-8 text-center text-[#94a3b8] text-sm bg-[#18213a] rounded-xl border border-[#334155]">
                            No predictions recorded in your account yet. Use the New Prediction module to evaluate a terrain locus.
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <Link
                            to="/dashboard/history"
                            className="p-4 rounded-xl bg-[#18213a] border border-[#334155] hover:border-blue-500/50 transition-all flex items-center justify-between group"
                        >
                            <div>
                                <h4 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">Historical Logs</h4>
                                <p className="text-xs text-[#94a3b8]">Review past evaluations with filter & export</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                        </Link>
                        <Link
                            to="/dashboard/analytics"
                            className="p-4 rounded-xl bg-[#18213a] border border-[#334155] hover:border-blue-500/50 transition-all flex items-center justify-between group"
                        >
                            <div>
                                <h4 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">Risk Analytics</h4>
                                <p className="text-xs text-[#94a3b8]">Distribution graphs & feature importances</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                        </Link>
                    </div>
                </div>

                {/* Right: Academic Model Notice */}
                <div className="lg:col-span-5 bg-[#1c2740] rounded-2xl p-6 border border-[#334155]/80 shadow-xl space-y-4">
                    <div className="flex items-center gap-2 border-b border-[#334155]/60 pb-3">
                        <Sparkles className="w-5 h-5 text-indigo-400" />
                        <h2 className="text-base font-bold text-white tracking-tight">Model Specifications</h2>
                    </div>

                    <div className="space-y-3 text-xs">
                        <div className="flex justify-between py-1.5 border-b border-[#334155]/40 text-[#94a3b8]">
                            <span>Algorithm:</span>
                            <span className="font-semibold text-white">Random Forest (Ensemble)</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-[#334155]/40 text-[#94a3b8]">
                            <span>Verified Accuracy:</span>
                            <span className="font-semibold text-emerald-400 font-mono">92.70%</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-[#334155]/40 text-[#94a3b8]">
                            <span>Multiclass ROC-AUC:</span>
                            <span className="font-semibold text-emerald-400 font-mono">0.9895</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-[#334155]/40 text-[#94a3b8]">
                            <span>Holdout Test Observations:</span>
                            <span className="font-semibold text-white font-mono">1,000 samples</span>
                        </div>
                        <div className="flex justify-between py-1.5 text-[#94a3b8]">
                            <span>Primary Trigger Factor:</span>
                            <span className="font-semibold text-blue-300">Rainfall (44.14% importance)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Summary;

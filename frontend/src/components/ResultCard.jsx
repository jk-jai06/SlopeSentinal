import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Charts from './Charts';
import { 
  AlertCircle, RotateCcw, Activity, ShieldCheck, AlertTriangle, 
  Flame, Info, LifeBuoy, FileDown, CloudRain, MapPin, Printer, X, Mountain
} from 'lucide-react';
import { LanguageContext } from '../context/LanguageContext';

const ResultCard = ({ result, error, loading, onReset }) => {
  const { t } = useContext(LanguageContext);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  // 1. Loading State
  if (loading) {
    return (
      <div className="bg-[#1c2740] rounded-2xl p-8 w-full max-w-md mx-auto min-h-[480px] flex flex-col items-center justify-center border border-indigo-500/30 shadow-[0_0_40px_rgba(99,102,241,0.15)] relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-500/5 animate-pulse"></div>
        <div className="relative z-10 flex flex-col items-center text-center">
          <Activity className="w-16 h-16 text-blue-400 animate-pulse mb-6" />
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <p className="text-white font-semibold text-lg mt-6 tracking-wide">Executing Inference Pipeline...</p>
          <p className="text-xs text-[#94a3b8] mt-2 max-w-xs">
            Standardizing numerical signals, one-hot encoding geological categories & evaluating 100 decision trees.
          </p>
        </div>
      </div>
    );
  }

  // 2. Error State
  if (error) {
    return (
      <div className="bg-[#1c2740] rounded-2xl p-8 w-full max-w-md mx-auto flex flex-col items-center justify-center border border-red-500/50 shadow-2xl relative min-h-[480px]">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-red-500"></div>
        <AlertCircle className="w-16 h-16 text-red-400 mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
        <h3 className="text-2xl font-bold text-white mb-2">Inference Error</h3>
        <p className="text-red-200/90 text-center mb-8 px-4 text-sm leading-relaxed">{error}</p>
        <button
          onClick={onReset}
          className="px-6 py-3 bg-[#18213a] hover:bg-slate-700 active:bg-slate-800 rounded-xl text-white font-semibold transition-all shadow-lg border border-[#334155] flex items-center gap-2 group"
        >
          <RotateCcw className="w-4 h-4 group-hover:-rotate-180 transition-transform duration-500" />
          Dismiss Error
        </button>
      </div>
    );
  }

  // 3. Standby State (Pre-Prediction)
  if (!result) {
    return (
      <div className="bg-[#1c2740] rounded-2xl p-8 w-full max-w-md mx-auto min-h-[480px] flex flex-col items-center justify-center text-center border border-[#334155]/80 shadow-xl opacity-90 transition-all hover:border-[#334155] hover:opacity-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-600 via-slate-500 to-slate-600"></div>
        <div className="p-4 bg-[#18213a] rounded-2xl mb-6 border border-[#334155] shadow-inner">
          <Activity className="w-12 h-12 text-blue-400" strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-bold text-white mb-2 tracking-wide">Model Standby</h3>
        <p className="text-sm text-[#94a3b8] leading-relaxed px-4 mb-5">
          Enter environmental parameters or select a regional preset on the left to evaluate terrain susceptibility.
        </p>

        {/* Auxiliary Regional Monsoon Reference Context */}
        <div className="w-full bg-[#162035]/90 border border-blue-500/20 rounded-xl p-3 text-left space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-400">
            <CloudRain className="w-3.5 h-3.5" />
            <span>Seasonal Reference Context</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Indian Peninsula: SW Monsoon (June - Sept) & NE Monsoon (Oct - Dec) are the primary rainfall trigger windows for slope movement.
          </p>
        </div>
      </div>
    );
  }

  // 4. Prediction Success State
  const { prediction, probabilities, confidence, input_features, id, timestamp, region_name, latitude, longitude } = result;

  const isHigh = prediction === "High Risk";
  const isMedium = prediction === "Medium Risk";
  const isLow = prediction === "Low Risk";

  let indicatorColor = "text-[#10b981]";
  let borderColor = "border-[#10b981]/50";
  let glowShadow = "shadow-[0_0_35px_rgba(16,185,129,0.25)]";
  let pillStyle = "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30";
  let topBarGradient = "bg-gradient-to-r from-[#10b981] to-teal-400";
  let RiskIcon = ShieldCheck;
  let explanation = "Terrain parameters indicate stable conditions with sufficient vegetative anchoring and gentle gradient to withstand typical precipitation.";

  if (isHigh) {
    indicatorColor = "text-[#f43f5e]";
    borderColor = "border-[#f43f5e]/60";
    glowShadow = "shadow-[0_0_40px_rgba(244,63,94,0.3)]";
    pillStyle = "bg-[#f43f5e]/10 text-[#f43f5e] border-[#f43f5e]/30";
    topBarGradient = "bg-gradient-to-r from-[#f43f5e] to-rose-600";
    RiskIcon = Flame;
    explanation = "Critical combination of high rainfall, steep inclination, and vulnerable soil/vegetation layers. Elevated gravitational shear stress poses severe slope failure risk.";
  } else if (isMedium) {
    indicatorColor = "text-[#f59e0b]";
    borderColor = "border-[#f59e0b]/50";
    glowShadow = "shadow-[0_0_35px_rgba(245,158,11,0.25)]";
    pillStyle = "bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/30";
    topBarGradient = "bg-gradient-to-r from-[#f59e0b] to-amber-500";
    RiskIcon = AlertTriangle;
    explanation = "Moderate slope vulnerability. Sustained rainfall saturation can compromise stability. Regular surface drainage clearance and slope monitoring recommended.";
  }

  const displayConfidence = confidence !== undefined
    ? (confidence * 100).toFixed(1)
    : ((probabilities?.[prediction] || 0) * 100).toFixed(1);

  return (
    <div className={`bg-[#1c2740] rounded-2xl p-6 md:p-8 w-full max-w-md mx-auto min-h-[480px] border ${borderColor} shadow-2xl ${glowShadow} transition-all duration-500 flex flex-col relative overflow-hidden`}>
      {/* Dynamic Top Border Gradient */}
      <div className={`absolute top-0 left-0 w-full h-1.5 ${topBarGradient}`}></div>

      <div className="flex-grow flex flex-col items-center">
        {/* Header Badge */}
        <div className="text-center mt-1 mb-4">
          <div className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest mb-3 ${pillStyle}`}>
            <RiskIcon className="w-3.5 h-3.5" />
            SlopeSentinel Assessment
          </div>

          {/* Result Risk Title with neon glow */}
          <div className={`text-4xl lg:text-5xl font-black ${indicatorColor} mb-2 tracking-tight drop-shadow-[0_0_20px_currentColor]`}>
            {prediction}
          </div>

          {/* Predicted Class Probability */}
          <div className="flex items-center justify-center gap-2 text-[#94a3b8]">
            <span className="text-xs uppercase tracking-wider font-semibold">{t('risk_confidence', 'Confidence')}:</span>
            <span className="text-lg font-bold text-white font-mono">
              {displayConfidence}%
            </span>
          </div>

          {/* Location / Locus if present */}
          {(region_name || input_features?.region_name) && (
            <p className="text-xs text-blue-300 font-medium mt-1 flex items-center justify-center gap-1">
              <MapPin className="w-3 h-3" />
              {region_name || input_features?.region_name}
              {latitude && longitude ? ` (${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°)` : ''}
            </p>
          )}
        </div>

        {/* Plain Language Interpretation */}
        <div className="w-full bg-[#18213a] rounded-xl p-3.5 mb-4 border border-[#334155] text-left">
          <p className="text-xs text-slate-300 leading-relaxed">
            {explanation}
          </p>
        </div>

        {/* Probability Distribution Box */}
        <div className="w-full bg-[#18213a] rounded-xl p-4 mb-4 border border-[#334155] shadow-inner">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider">
              {t('risk_probabilities', 'Class Probabilities')}
            </h4>
            <span className="text-[10px] text-slate-500 font-mono">Random Forest 100 Trees</span>
          </div>
          <Charts result={result} />
        </div>

        {/* Preparedness / Safety Guidance Link for High or Medium Risk */}
        {(isHigh || isMedium) && (
          <div className="w-full mb-4">
            <Link
              to="/safety"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-semibold transition-all shadow-sm"
            >
              <LifeBuoy className="w-3.5 h-3.5 text-blue-400" />
              <span>{t('btn_view_safety', 'View Safety & Emergency Protocols')}</span>
            </Link>
          </div>
        )}

        {/* System Notice / Disclaimer */}
        <div className="w-full bg-[#11182f]/60 rounded-xl p-2.5 mb-4 border border-[#334155]/60 text-center">
          <p className="text-[10px] text-[#94a3b8] leading-tight">
            <strong>SlopeSentinel Assessment:</strong> Statistical spatial susceptibility based on physical terrain features. Not an early warning alert siren.
          </p>
        </div>
      </div>

      {/* Action Buttons: Report & Reset */}
      <div className="space-y-2 mt-auto">
        <button
          onClick={() => setReportModalOpen(true)}
          className="w-full py-2.5 bg-[#18213a] hover:bg-[#202b48] border border-[#334155] rounded-xl text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <FileDown className="w-3.5 h-3.5 text-blue-400" />
          <span>{t('btn_download_report', 'View Assessment Report')}</span>
        </button>

        <button
          onClick={onReset}
          className="w-full py-2.5 bg-slate-800/60 hover:bg-slate-700/60 border border-[#334155] rounded-xl text-slate-300 hover:text-white font-medium text-xs transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          <span>Evaluate Another Terrain Profile</span>
        </button>
      </div>

      {/* Printable Assessment Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-[fadeIn_0.15s_ease-out]">
          <div className="bg-[#1c2740] rounded-2xl max-w-lg w-full border border-[#334155] shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
            <div className={`w-full h-1.5 ${topBarGradient}`}></div>
            
            <div className="p-6 overflow-y-auto space-y-5 print:text-black print:bg-white">
              <div className="flex items-center justify-between pb-3 border-b border-[#334155]">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400">
                    <Mountain className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wider text-blue-400 font-mono">SlopeSentinel</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">Official Report</span>
                    </div>
                    <h3 className="text-base font-bold text-white tracking-tight">Landslide Susceptibility Report</h3>
                    <p className="text-[11px] text-[#94a3b8]">
                      Assessment #{id || 'TEMP'} &bull; Generated: {new Date(timestamp || Date.now()).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setReportModalOpen(false)}
                  className="p-1.5 rounded-xl bg-[#18213a] text-slate-400 hover:text-white border border-[#334155]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Assessment Outcome */}
              <div className="p-4 rounded-xl bg-[#18213a] border border-[#334155] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#94a3b8] uppercase tracking-wider block">Assessed Susceptibility</span>
                  <span className={`text-2xl font-black ${indicatorColor}`}>{prediction}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#94a3b8] block">Model Confidence</span>
                  <span className="text-lg font-bold text-white font-mono">{displayConfidence}%</span>
                </div>
              </div>

              {/* Input Feature Summary */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Observed Parameters</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#18213a] border border-[#334155]">
                    <span className="text-slate-400 block text-[10px]">Rainfall</span>
                    <span className="font-bold text-white font-mono">{input_features?.rainfall} mm</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#18213a] border border-[#334155]">
                    <span className="text-slate-400 block text-[10px]">Slope Angle</span>
                    <span className="font-bold text-white font-mono">{input_features?.slope}°</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#18213a] border border-[#334155]">
                    <span className="text-slate-400 block text-[10px]">Vegetation Cover</span>
                    <span className="font-bold text-white font-mono">{input_features?.vegetation}%</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#18213a] border border-[#334155]">
                    <span className="text-slate-400 block text-[10px]">Elevation</span>
                    <span className="font-bold text-white font-mono">{input_features?.elevation} m</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#18213a] border border-[#334155]">
                    <span className="text-slate-400 block text-[10px]">Soil Type</span>
                    <span className="font-bold text-white">{input_features?.soil_type}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#18213a] border border-[#334155]">
                    <span className="text-slate-400 block text-[10px]">Land Use</span>
                    <span className="font-bold text-white">{input_features?.land_use}</span>
                  </div>
                </div>
              </div>

              {/* Probabilities */}
              <div className="p-3 rounded-xl bg-[#18213a] border border-[#334155] space-y-1.5 text-xs font-mono">
                <span className="text-[11px] font-semibold text-slate-300 block font-sans">Multi-Class Probability Distribution:</span>
                <div className="flex justify-between text-rose-400">
                  <span>High Risk:</span>
                  <span>{((probabilities?.['High Risk'] || 0) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-amber-400">
                  <span>Medium Risk:</span>
                  <span>{((probabilities?.['Medium Risk'] || 0) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>Low Risk:</span>
                  <span>{((probabilities?.['Low Risk'] || 0) * 100).toFixed(1)}%</span>
                </div>
              </div>

              {/* Verified Disclaimer */}
              <div className="text-[10px] text-slate-400 bg-[#162035] p-3 rounded-lg border border-[#334155] leading-relaxed">
                <strong>SlopeSentinel Platform Notice:</strong> This document was generated by the SlopeSentinel environmental intelligence platform using a Scikit-Learn Random Forest pipeline (Accuracy: 92.70%, ROC-AUC: 0.9895). It provides spatial susceptibility screening based on geomorphological and climatic patterns. It does not replace on-site geotechnical boreholes, municipal zoning clearances, or emergency evacuation directives.
              </div>

              {/* Modal Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  onClick={() => setReportModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#18213a] hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-[#334155]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultCard;

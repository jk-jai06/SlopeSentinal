import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { 
  CloudRain, Mountain, Trees, Layers, Compass, Building2, 
  ArrowRight, ShieldCheck, AlertTriangle, AlertOctagon, 
  HelpCircle, CheckCircle2, ChevronRight, Binary, FileText
} from 'lucide-react';
import { LanguageContext } from '../context/LanguageContext';

const HowItWorks = () => {
  const { t } = useContext(LanguageContext);

  const factors = [
    {
      icon: CloudRain,
      color: "from-blue-500 to-cyan-500",
      border: "border-blue-500/30",
      bg: "bg-blue-500/10",
      title: "Rainfall & Water Saturation",
      weight: "44.1% Impact",
      why: "Water increases pore pressure within soil layers and acts as a lubricant along subterranean slip planes, while adding immense weight to slope mass.",
      plain: "Heavy or prolonged rainfall is the single primary trigger for slope collapse in tropical and mountainous zones."
    },
    {
      icon: Trees,
      color: "from-emerald-500 to-teal-500",
      border: "border-emerald-500/30",
      bg: "bg-emerald-500/10",
      title: "Vegetation & Canopy Cover",
      weight: "24.0% Impact",
      why: "Deep root networks mechanically anchor loose topsoil to bedrock, while tree canopies intercept high-velocity raindrops, moderating ground saturation.",
      plain: "Dense forests dramatically reduce landslide occurrence, whereas deforested or barren slopes fail rapidly."
    },
    {
      icon: Mountain,
      color: "from-amber-500 to-orange-500",
      border: "border-amber-500/30",
      bg: "bg-amber-500/10",
      title: "Slope Angle (Steepness)",
      weight: "20.9% Impact",
      why: "Gravitational shear stress directly increases with terrain inclination. Slopes beyond 25°-35° surpass the internal friction angle of saturated soils.",
      plain: "The steeper the hill, the greater the downward pull on wet rock and soil."
    },
    {
      icon: Compass,
      color: "from-indigo-500 to-blue-500",
      border: "border-indigo-500/30",
      bg: "bg-indigo-500/10",
      title: "Elevation Baseline",
      weight: "6.8% Impact",
      why: "Higher altitudes experience orographic precipitation, intense freeze-thaw cycles, and higher potential energy for debris travel distance.",
      plain: "High mountain elevations concentrate storm rainfall and funnel landslides down drainage basins."
    },
    {
      icon: Building2,
      color: "from-purple-500 to-pink-500",
      border: "border-purple-500/30",
      bg: "bg-purple-500/10",
      title: "Land Use & Surface Modification",
      weight: "2.1% Impact",
      why: "Unplanned urbanization, road cuts, slope terracing, and artificial drainage alter natural hydrology, creating unstable cuts and surcharge loads.",
      plain: "Human construction on steep hillsides without retaining structures triggers artificial slope failures."
    },
    {
      icon: Layers,
      color: "from-rose-500 to-amber-500",
      border: "border-rose-500/30",
      bg: "bg-rose-500/10",
      title: "Soil Geotechnical Type",
      weight: "2.1% Impact",
      why: "Soil grain distribution dictates hydraulic conductivity and cohesion. Clay expands and liquefies, while gravel drains quickly but lacks cohesion.",
      plain: "Clay soils hold water and turn into slick mudflows, whereas sandy gravels drain faster but can slip when undermined."
    }
  ];

  const steps = [
    {
      num: "01",
      title: "Input Environmental Observations",
      desc: "Specify regional rainfall, terrain slope, elevation, vegetation density, soil type, and land use—either by choosing a regional preset or entering measured survey data."
    },
    {
      num: "02",
      title: "Random Forest Ensemble Evaluation",
      desc: "A trained pipeline standardizes numerical values, one-hot encodes soil and land categories, and evaluates 100 decision trees to detect complex multi-factor non-linear thresholds."
    },
    {
      num: "03",
      title: "Susceptibility & Action Plan",
      desc: "The system outputs a calibrated risk level (Low, Medium, High) with explicit probability distributions and practical safety recommendations tailored to the terrain."
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12 animate-[fadeIn_0.3s_ease-out]">
      
      {/* Hero Section */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#162035] via-[#1a2542] to-[#12192c] border border-[#334155]/60 p-8 md:p-14 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold tracking-wide uppercase">
            <ShieldCheck className="w-4 h-4" />
            SlopeSentinel Intelligence Guide
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Understand Your Terrain. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
              Make Informed Decisions.
            </span>
          </h1>
          
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            SlopeSentinel is a machine-learning-powered landslide susceptibility assessment platform designed to help users understand terrain-related risks through environmental data analysis, accessible assessments, and safety preparedness information.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/assess"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-[0_0_20px_rgba(37,99,235,0.35)] transition-all transform hover:-translate-y-0.5"
            >
              Start SlopeSentinel Assessment
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/safety"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-medium text-slate-300 bg-[#1c2740] hover:bg-[#233152] border border-[#334155] transition-all"
            >
              Safety & Preparedness Guide
            </Link>
          </div>
        </div>
      </div>

      {/* 3-Step Process Diagram */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">How SlopeSentinel Evaluates Risk in 3 Steps</h2>
          <p className="text-slate-400 text-sm sm:text-base">A transparent, deterministic pipeline from environmental data to decision support.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, idx) => (
            <div key={idx} className="relative rounded-2xl bg-[#162035]/90 border border-[#334155]/60 p-6 flex flex-col justify-between hover:border-blue-500/40 transition-all shadow-lg group">
              <div className="space-y-4">
                <span className="text-3xl font-black text-blue-500/40 font-mono group-hover:text-blue-400 transition-colors">
                  {step.num}
                </span>
                <h3 className="text-lg font-bold text-white tracking-tight">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-700/50 flex items-center text-xs font-semibold text-blue-400">
                Phase {idx + 1} of Assessment
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* The 6 Environmental Factors */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            The 6 Critical Terrain Factors
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-3xl">
            Our predictive model relies exclusively on six physical geomorphological and meteorological inputs. 
            Here is what each factor represents and why it dictates slope stability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {factors.map((f, i) => {
            const Icon = f.icon;
            return (
              <div 
                key={i} 
                className={`rounded-2xl bg-[#162035]/80 border ${f.border} p-6 space-y-4 hover:bg-[#1a2542] transition-all shadow-lg flex flex-col justify-between`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${f.color} text-white shadow-md`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {f.weight}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">{f.title}</h3>
                  <p className="text-xs text-blue-300/90 leading-relaxed italic bg-blue-950/30 p-2.5 rounded-lg border border-blue-900/40">
                    "{f.plain}"
                  </p>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {f.why}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interpreting Risk Levels */}
      <div className="rounded-3xl bg-[#162035]/90 border border-[#334155]/60 p-6 sm:p-10 space-y-8 shadow-xl">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Understanding Your Risk Classification
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            What do Low, Medium, and High Susceptibility actually mean for your location?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Low Risk */}
          <div className="rounded-2xl bg-[#102422]/60 border border-emerald-500/40 p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-emerald-400">Low Susceptibility</h3>
                <span className="text-xs text-slate-400">Class 0</span>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Terrain displays strong natural stabilizing properties (gentle slope, dense forest cover, permeable soil). Failure under normal seasonal conditions is statistically unlikely.
            </p>
            <div className="text-xs text-emerald-300/80 pt-2 border-t border-emerald-500/20 font-medium">
              Standard seasonal maintenance and natural drainage clearance recommended.
            </div>
          </div>

          {/* Medium Risk */}
          <div className="rounded-2xl bg-[#262118]/60 border border-amber-500/40 p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-amber-400">Medium Susceptibility</h3>
                <span className="text-xs text-slate-400">Class 1</span>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Marginal equilibrium. Moderate slopes with limited vegetation or partial cut-slopes. Prolonged multi-day precipitation can trigger localized slips or mudflows.
            </p>
            <div className="text-xs text-amber-300/80 pt-2 border-t border-amber-500/20 font-medium">
              Inspect retaining walls, clear drainage ditches, and monitor terrain during storms.
            </div>
          </div>

          {/* High Risk */}
          <div className="rounded-2xl bg-[#2a171d]/60 border border-rose-500/40 p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <AlertOctagon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-rose-400">High Susceptibility</h3>
                <span className="text-xs text-slate-400">Class 2</span>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Hazardous terrain profile. Steep inclination combined with intense rainfall, barren ground, or unstable clay soils. High probability of gravitational slope failure.
            </p>
            <div className="text-xs text-rose-300/80 pt-2 border-t border-rose-500/20 font-medium">
              Immediate safety preparedness: identify evacuation paths and avoid cut slopes during rain.
            </div>
          </div>
        </div>
      </div>

      {/* Honest Limitations & Transparency */}
      <div className="rounded-2xl bg-[#1c2740]/60 border border-[#334155] p-6 sm:p-8 space-y-4">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">SlopeSentinel Scope & System Boundaries</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              SlopeSentinel calculates <span className="text-amber-400 font-semibold">spatial susceptibility</span>—the relative likelihood of terrain failure based on physical environmental characteristics. 
              It does <span className="text-rose-400 font-semibold">NOT</span> predict the exact day or minute a landslide will occur, nor does it replace on-site geotechnical boreholes, geophysical radar, or official municipal evacuation orders.
            </p>
            <p className="text-xs text-slate-400">
              Evaluated with a 92.70% holdout test accuracy and ROC-AUC of 0.9895 using the calibrated Scikit-Learn Random Forest pipeline.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Footer */}
      <div className="text-center py-6 space-y-4">
        <h3 className="text-xl font-bold text-white">Ready to inspect your location?</h3>
        <div className="flex flex-wrap justify-center items-center gap-4">
          <Link
            to="/assess"
            className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 shadow-[0_0_20px_rgba(37,99,235,0.35)] transition-all"
          >
            Open Risk Assessment Form
          </Link>
          <Link
            to="/safety"
            className="px-6 py-3 rounded-xl font-medium text-slate-300 bg-[#1c2740] border border-[#334155] hover:bg-[#253354] transition-all"
          >
            Emergency Preparedness Guide
          </Link>
        </div>
      </div>

    </div>
  );
};

export default HowItWorks;


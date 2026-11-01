import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, PhoneCall, CheckCircle2, AlertTriangle, 
  MapPin, Eye, Compass, Bell, ExternalLink, HelpCircle,
  FileCheck2, LifeBuoy, HeartHandshake, ArrowRight
} from 'lucide-react';

const SafetyPrep = () => {
  const [activeTab, setActiveTab] = useState('before');

  const warningSigns = [
    {
      title: "Ground & Structural Cracks",
      desc: "New or widening cracks appearing on plaster, foundations, road surfaces, or retaining walls.",
      urgency: "High Caution"
    },
    {
      title: "Tilting Trees & Utility Poles",
      desc: "Trees, electrical posts, or fences leaning downhill or in irregular directions (called 'drunken trees').",
      urgency: "Active Movement"
    },
    {
      title: "Muddying of Streams & Springs",
      desc: "Sudden cloudiness or muddy discoloration in previously clear mountain springs, streams, or tube wells.",
      urgency: "Internal Erosion"
    },
    {
      title: "Bulging Walls & Jammed Doors",
      desc: "Retaining walls visibly bowing outward; doors and windows suddenly sticking due to foundation deflection.",
      urgency: "Structural Shift"
    },
    {
      title: "Rumbling or Cracking Sounds",
      desc: "Unusual low-frequency rumbling noise, snapping tree roots, or rocks clattering downhill.",
      urgency: "Immediate Hazard"
    },
    {
      title: "Water Seepage in Dry Terrain",
      desc: "Springs or soggy patches suddenly appearing at base of slopes that are normally dry.",
      urgency: "Pore Pressure Spike"
    }
  ];

  const emergencyContacts = [
    {
      org: "National Disaster Management Authority (NDMA)",
      purpose: "National apex disaster crisis coordination & advisories",
      number: "1078 / 011-26701728",
      type: "Toll-Free 24x7",
      link: "https://ndma.gov.in"
    },
    {
      org: "National Emergency Helpline",
      purpose: "Single-window emergency dispatch (Police, Fire, Medical, NDRF)",
      number: "112",
      type: "National Helpline",
      link: "https://112.gov.in"
    },
    {
      org: "State Disaster Management Authority (SDMA)",
      purpose: "State Emergency Operations Center (SEOC) state-wide response",
      number: "1070",
      type: "State Operations",
      link: null
    },
    {
      org: "District Emergency Operations Center (DDMA)",
      purpose: "District Collectorate immediate search, rescue & shelter teams",
      number: "1077",
      type: "District Level",
      link: null
    },
    {
      org: "Geological Survey of India (GSI)",
      purpose: "National Landslide Susceptibility Mapping & Geological Bulletins",
      number: "gsi.gov.in",
      type: "Scientific Authority",
      link: "https://gsi.gov.in"
    }
  ];

  const checklists = {
    before: [
      "Inspect surface drains and stormwater culverts; clear all debris, leaves, and loose soil before the monsoon.",
      "Check retaining walls for drainage weep holes. Ensure weep holes are open and free of compacted mud.",
      "Identify two safe uphill or ridge-line evacuation routes leading away from steep valleys and ravines.",
      "Prepare a 72-hour family emergency kit (water purification, dry rations, first-aid, flashlights, power banks, essential documents in waterproof pouch).",
      "Avoid planting heavy taproot-less ornamental plants on loose cut-slopes; prefer native deep-root soil-binding shrubs.",
      "Never excavate slope toes or construct unsanctioned buildings directly beneath steep cliff faces."
    ],
    during: [
      "Evacuate immediately if you hear cracking trees, rumbling sounds, or notice sudden water flow changes.",
      "Move to designated relief centers or ridge tops. Never seek shelter in low-lying stream beds or drainage gullies.",
      "Do NOT attempt to cross flowing mud, debris channels, or submerged mountain road bridges.",
      "If caught inside a collapsing structure, curl into a tight ball and protect your head under a sturdy desk or interior doorframe.",
      "Stay alert while driving in hilly terrain: look out for collapsed pavement, falling rocks, and fallen utility wires.",
      "Turn on battery-powered radios or local disaster SMS alerts for official NDRF and SDMA advisories."
    ],
    after: [
      "Stay completely clear of the slide zone. Secondary landslides, mudflows, and flash floods frequently follow primary failures.",
      "Check for injured or trapped persons in nearby safe zones without directly entering the unstable slide debris.",
      "Report broken power cables, fractured gas lines, and ruptured water mains to local authorities immediately.",
      "Do not consume tap or stream water until certified safe, as landslide slurry often contaminates regional water supplies.",
      "Consult certified geotechnical engineers and local planning authorities before re-occupying hillside dwellings."
    ]
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12 animate-[fadeIn_0.3s_ease-out]">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#162035] via-[#1c2740] to-[#12192c] border border-[#334155]/60 p-8 md:p-12 overflow-hidden shadow-2xl">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            SlopeSentinel Safety & Preparedness
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Safety & Emergency Preparedness
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            SlopeSentinel helps you stay informed and prepared. Knowing early physical indicators, 
            practicing proactive drainage clearance, and keeping emergency numbers accessible saves lives.
          </p>
        </div>
      </div>

      {/* Verified Indian Emergency Numbers Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <PhoneCall className="w-6 h-6 text-blue-400" />
              Verified Disaster Helplines (India)
            </h2>
            <p className="text-slate-400 text-sm">Official government response hotlines for hill regions and landslide emergencies.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {emergencyContacts.map((contact, idx) => (
            <div 
              key={idx}
              className="rounded-2xl bg-[#162035]/90 border border-[#334155]/60 p-5 space-y-3 hover:border-blue-500/50 transition-all shadow-md flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {contact.type}
                  </span>
                  {contact.link && (
                    <a href={contact.link} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
                <h3 className="text-base font-bold text-white">{contact.org}</h3>
                <p className="text-xs text-slate-400">{contact.purpose}</p>
              </div>

              <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between">
                <span className="text-lg font-black text-blue-400 font-mono tracking-wide">
                  {contact.number}
                </span>
                <span className="text-xs text-slate-400 font-medium">Toll Free</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Early Warning Physical Signs */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Eye className="w-6 h-6 text-amber-400" />
            Early Warning Signs of Terrain Movement
          </h2>
          <p className="text-slate-400 text-sm">Physical indicators to inspect around hillside properties before full slope failure occurs.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {warningSigns.map((sign, i) => (
            <div 
              key={i} 
              className="rounded-2xl bg-[#162035]/70 border border-[#334155]/60 p-5 space-y-2.5 hover:border-amber-500/40 transition-all shadow-md"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">{sign.title}</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  {sign.urgency}
                </span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{sign.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Actionable Checklists (Before, During, After) */}
      <div className="rounded-3xl bg-[#162035]/90 border border-[#334155]/60 p-6 sm:p-10 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <FileCheck2 className="w-6 h-6 text-emerald-400" />
              Actionable Safety Checklist
            </h2>
            <p className="text-slate-400 text-sm">Step-by-step practical procedures before, during, and after severe weather.</p>
          </div>

          {/* Tab Selector */}
          <div className="inline-flex p-1.5 rounded-xl bg-[#1c2740] border border-[#334155]">
            <button
              onClick={() => setActiveTab('before')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'before'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Before Monsoon
            </button>
            <button
              onClick={() => setActiveTab('during')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'during'
                  ? 'bg-rose-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              During Hazard
            </button>
            <button
              onClick={() => setActiveTab('after')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'after'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              After Landslide
            </button>
          </div>
        </div>

        {/* Checklist Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {checklists[activeTab].map((item, idx) => (
            <div 
              key={idx}
              className="flex items-start gap-3.5 p-4 rounded-xl bg-[#1c2740]/80 border border-[#334155]/60"
            >
              <div className="mt-0.5 p-1 rounded-full bg-blue-500/20 text-blue-400 shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-sm text-slate-200 leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Disclaimer Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-950/40 via-indigo-950/40 to-slate-900 border border-blue-500/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-base font-bold text-white">Emergency Warning Notice</h4>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            In the event of active flash floods, slope collapse, or intense storm warnings issued by the India Meteorological Department (IMD) or district administration, follow official evacuation orders immediately.
          </p>
        </div>
        <Link
          to="/assess"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-500 shrink-0 shadow transition-all"
        >
          Check Terrain with SlopeSentinel
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
};

export default SafetyPrep;


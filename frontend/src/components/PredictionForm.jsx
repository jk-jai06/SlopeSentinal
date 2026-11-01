import React, { useState, useContext } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { Sparkles, Compass, MapPin, Info, Save, Check } from 'lucide-react';
import { LanguageContext } from '../context/LanguageContext';
import { AuthContext } from '../context/AuthContext';
import { createSavedLocation } from '../services/api';

const REGIONAL_PRESETS = [
  {
    name: 'Wayanad (Meppadi, KL)',
    category: 'High Hazard Zone',
    data: {
      rainfall: 450.0,
      slope: 42.0,
      soil_type: 'Clay',
      vegetation: 35.0,
      elevation: 1150.0,
      land_use: 'Agricultural',
      region_name: 'Wayanad (Meppadi Slope)',
      latitude: 11.5540,
      longitude: 76.1320
    }
  },
  {
    name: 'Nilgiris (Ooty, TN)',
    category: 'High Hazard Zone',
    data: {
      rainfall: 380.0,
      slope: 36.0,
      soil_type: 'Clay',
      vegetation: 28.0,
      elevation: 2240.0,
      land_use: 'Forest',
      region_name: 'Nilgiris (Ooty Basin)',
      latitude: 11.4102,
      longitude: 76.6950
    }
  },
  {
    name: 'Idukki (Munnar, KL)',
    category: 'Medium Hazard Ridge',
    data: {
      rainfall: 320.0,
      slope: 32.0,
      soil_type: 'Loam',
      vegetation: 48.0,
      elevation: 1532.0,
      land_use: 'Agricultural',
      region_name: 'Idukki (Munnar Ridge)',
      latitude: 10.0889,
      longitude: 77.0595
    }
  },
  {
    name: 'Shimla (HP)',
    category: 'Medium Urbanized Slope',
    data: {
      rainfall: 260.0,
      slope: 35.0,
      soil_type: 'Gravel',
      vegetation: 30.0,
      elevation: 2200.0,
      land_use: 'Urban',
      region_name: 'Shimla Urbanized Slope',
      latitude: 31.1048,
      longitude: 77.1734
    }
  },
  {
    name: 'Darjeeling (WB)',
    category: 'High Hazard Slope',
    data: {
      rainfall: 410.0,
      slope: 38.0,
      soil_type: 'Sand',
      vegetation: 25.0,
      elevation: 2042.0,
      land_use: 'Urban',
      region_name: 'Darjeeling Hill Town',
      latitude: 27.0410,
      longitude: 88.2663
    }
  },
  {
    name: 'Deccan Foothill (MH)',
    category: 'Stable Foothills',
    data: {
      rainfall: 70.0,
      slope: 10.0,
      soil_type: 'Loam',
      vegetation: 85.0,
      elevation: 540.0,
      land_use: 'Forest',
      region_name: 'Western Ghats Stable Foothill',
      latitude: 18.5204,
      longitude: 73.8567
    }
  }
];

const PredictionForm = ({ onPredict, loading }) => {
  const { t } = useContext(LanguageContext);
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    rainfall: '',
    slope: '',
    soil_type: '',
    vegetation: '',
    elevation: '',
    land_use: '',
    region_name: '',
    latitude: '',
    longitude: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const applyPreset = (presetData) => {
    setFormData({
      rainfall: presetData.rainfall.toString(),
      slope: presetData.slope.toString(),
      soil_type: presetData.soil_type,
      vegetation: presetData.vegetation.toString(),
      elevation: presetData.elevation.toString(),
      land_use: presetData.land_use,
      region_name: presetData.region_name || '',
      latitude: presetData.latitude ? presetData.latitude.toString() : '',
      longitude: presetData.longitude ? presetData.longitude.toString() : ''
    });
    setFormErrors({});
  };

  const validate = () => {
    const errors = {};
    const rf = parseFloat(formData.rainfall);
    const sl = parseFloat(formData.slope);
    const veg = parseFloat(formData.vegetation);
    const el = parseFloat(formData.elevation);
    const lat = formData.latitude ? parseFloat(formData.latitude) : null;
    const lon = formData.longitude ? parseFloat(formData.longitude) : null;

    if (isNaN(rf) || rf < 0 || rf > 1000) errors.rainfall = 'Rainfall must be between 0 and 1000 mm';
    if (isNaN(sl) || sl < 0 || sl > 60) errors.slope = 'Slope angle must be between 0° and 60°';
    if (!formData.soil_type) errors.soil_type = 'Please select a soil classification';
    if (isNaN(veg) || veg < 0 || veg > 100) errors.vegetation = 'Vegetation cover must be 0% - 100%';
    if (isNaN(el) || el < 0 || el > 3000) errors.elevation = 'Elevation must be between 0 and 3000 m';
    if (!formData.land_use) errors.land_use = 'Please select a land use type';

    if (lat !== null && (isNaN(lat) || lat < -90 || lat > 90)) {
      errors.latitude = 'Latitude must be between -90 and +90';
    }
    if (lon !== null && (isNaN(lon) || lon < -180 || lon > 180)) {
      errors.longitude = 'Longitude must be between -180 and +180';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onPredict({
      rainfall: parseFloat(formData.rainfall),
      slope: parseFloat(formData.slope),
      soil_type: formData.soil_type,
      vegetation: parseFloat(formData.vegetation),
      elevation: parseFloat(formData.elevation),
      land_use: formData.land_use,
      region_name: formData.region_name.trim() || undefined,
      latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
      longitude: formData.longitude ? parseFloat(formData.longitude) : undefined
    });
  };

  const handleSaveLocation = async () => {
    if (!user) {
      alert("Please sign in to bookmark monitoring locations.");
      return;
    }
    const name = formData.region_name.trim() || `Location (${formData.elevation || '0'}m)`;
    setSaveLoading(true);
    try {
      await createSavedLocation({
        name,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        elevation: formData.elevation ? parseFloat(formData.elevation) : null,
        soil_type: formData.soil_type || null,
        land_use: formData.land_use || null,
        notes: `Saved via quick assessment form: ${formData.slope || '0'}° slope, ${formData.vegetation || '0'}% vegetation.`
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to save location.");
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="bg-[#1c2740] rounded-2xl p-6 md:p-8 shadow-2xl border border-[#334155]/80 relative overflow-hidden group">
      {/* Top gradient accent line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2864f0] via-indigo-500 to-[#8b42f5]"></div>

      {/* Header and Presets */}
      <div className="space-y-3 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              SlopeSentinel Risk Assessment
            </h2>
            <p className="text-xs text-[#94a3b8] mt-0.5">
              Assess terrain susceptibility by entering observed parameters or loading a regional preset.
            </p>
          </div>

          {user && (
            <button
              type="button"
              onClick={handleSaveLocation}
              disabled={saveLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#18213a] text-blue-300 hover:text-white hover:bg-blue-600/30 border border-[#334155] transition-colors shrink-0"
              title="Bookmark this location profile"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Location Saved</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5 text-blue-400" />
                  <span>{saveLoading ? 'Saving...' : t('btn_save_location', 'Save Location')}</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Regional Presets Pills */}
        <div className="pt-2 border-t border-[#334155]/60">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-blue-400" />
              Presets:
            </span>
            {REGIONAL_PRESETS.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => applyPreset(p.data)}
                className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-[#18213a] text-blue-300 hover:text-white hover:bg-blue-600/30 border border-[#334155] transition-all whitespace-nowrap shadow-sm"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* RAINFALL */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">
                {t('param_rainfall', 'Rainfall')} (mm) *
              </label>
              <span className="text-[10px] text-slate-500 font-mono">0 - 1000 mm</span>
            </div>
            <input
              type="number"
              step="0.1"
              name="rainfall"
              value={formData.rainfall}
              onChange={handleChange}
              required
              className={`w-full bg-[#18213a] border ${formErrors.rainfall ? 'border-red-500' : 'border-[#334155]'} rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2864f0]/60 focus:border-[#2864f0] transition-all`}
              placeholder="e.g. 380.0"
            />
            {formErrors.rainfall && <p className="text-[11px] text-red-400">{formErrors.rainfall}</p>}
            <p className="text-[10px] text-slate-500">24-48hr accumulated precipitation volume.</p>
          </div>

          {/* SLOPE ANGLE */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">
                {t('param_slope', 'Slope Angle')} (°) *
              </label>
              <span className="text-[10px] text-slate-500 font-mono">0° - 60°</span>
            </div>
            <input
              type="number"
              step="0.1"
              name="slope"
              value={formData.slope}
              onChange={handleChange}
              required
              className={`w-full bg-[#18213a] border ${formErrors.slope ? 'border-red-500' : 'border-[#334155]'} rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2864f0]/60 focus:border-[#2864f0] transition-all`}
              placeholder="e.g. 36.0"
            />
            {formErrors.slope && <p className="text-[11px] text-red-400">{formErrors.slope}</p>}
            <p className="text-[10px] text-slate-500">Terrain steepness inclination gradient.</p>
          </div>

          {/* SOIL TYPE */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">
                {t('param_soil', 'Soil Type')} *
              </label>
              <span className="text-[10px] text-slate-500 font-mono">Classification</span>
            </div>
            <div className="relative">
              <select
                name="soil_type"
                value={formData.soil_type}
                onChange={handleChange}
                required
                className={`w-full bg-[#18213a] border ${formErrors.soil_type ? 'border-red-500' : 'border-[#334155]'} rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#2864f0]/60 focus:border-[#2864f0] transition-all appearance-none cursor-pointer`}
              >
                <option value="" disabled>Select Dominant Soil</option>
                <option value="Clay">Clay (Slow drainage, high cohesion)</option>
                <option value="Sand">Sand (High friction, fast drainage)</option>
                <option value="Loam">Loam (Balanced silt, clay & sand)</option>
                <option value="Gravel">Gravel (Coarse granular particles)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#94a3b8]">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
                </svg>
              </div>
            </div>
            {formErrors.soil_type && <p className="text-[11px] text-red-400">{formErrors.soil_type}</p>}
          </div>

          {/* VEGETATION COVER */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">
                {t('param_vegetation', 'Vegetation Cover')} (%) *
              </label>
              <span className="text-[10px] text-slate-500 font-mono">0% - 100%</span>
            </div>
            <input
              type="number"
              step="0.1"
              name="vegetation"
              value={formData.vegetation}
              onChange={handleChange}
              required
              className={`w-full bg-[#18213a] border ${formErrors.vegetation ? 'border-red-500' : 'border-[#334155]'} rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2864f0]/60 focus:border-[#2864f0] transition-all`}
              placeholder="e.g. 28.0"
            />
            {formErrors.vegetation && <p className="text-[11px] text-red-400">{formErrors.vegetation}</p>}
            <p className="text-[10px] text-slate-500">Root anchoring and forest canopy coverage.</p>
          </div>

          {/* ELEVATION */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">
                {t('param_elevation', 'Elevation')} (m) *
              </label>
              <span className="text-[10px] text-slate-500 font-mono">0 - 3000 m</span>
            </div>
            <input
              type="number"
              step="0.1"
              name="elevation"
              value={formData.elevation}
              onChange={handleChange}
              required
              className={`w-full bg-[#18213a] border ${formErrors.elevation ? 'border-red-500' : 'border-[#334155]'} rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2864f0]/60 focus:border-[#2864f0] transition-all`}
              placeholder="e.g. 2240"
            />
            {formErrors.elevation && <p className="text-[11px] text-red-400">{formErrors.elevation}</p>}
            <p className="text-[10px] text-slate-500">Height above mean sea level.</p>
          </div>

          {/* LAND USE TYPE */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">
                {t('param_land_use', 'Land Use Type')} *
              </label>
              <span className="text-[10px] text-slate-500 font-mono">Surface Use</span>
            </div>
            <div className="relative">
              <select
                name="land_use"
                value={formData.land_use}
                onChange={handleChange}
                required
                className={`w-full bg-[#18213a] border ${formErrors.land_use ? 'border-red-500' : 'border-[#334155]'} rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#2864f0]/60 focus:border-[#2864f0] transition-all appearance-none cursor-pointer`}
              >
                <option value="" disabled>Select Land Use</option>
                <option value="Forest">Forest (Undisturbed natural canopy)</option>
                <option value="Agricultural">Agricultural (Plantations, crops)</option>
                <option value="Urban">Urban (High density, roads & masonry)</option>
                <option value="Barren">Barren (Exposed rock & eroded soil)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#94a3b8]">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
                </svg>
              </div>
            </div>
            {formErrors.land_use && <p className="text-[11px] text-red-400">{formErrors.land_use}</p>}
          </div>
        </div>

        {/* Optional Location Name & Coordinates */}
        <div className="pt-2 border-t border-[#334155]/60 space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-blue-400" />
              {t('param_region', 'Location Name / Identifier')} (Optional)
            </label>
            <input
              type="text"
              name="region_name"
              value={formData.region_name}
              onChange={handleChange}
              className="w-full bg-[#18213a] border border-[#334155] rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2864f0]/60 focus:border-[#2864f0] transition-all text-sm"
              placeholder="e.g. Nilgiris Kotagiri Sector B"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" />
                {t('param_latitude', 'Latitude')} (Optional)
              </label>
              <input
                type="number"
                step="0.0001"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                className="w-full bg-[#18213a] border border-[#334155] rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                placeholder="e.g. 11.4102"
              />
              {formErrors.latitude && <p className="text-[10px] text-red-400">{formErrors.latitude}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-purple-400" />
                {t('param_longitude', 'Longitude')} (Optional)
              </label>
              <input
                type="number"
                step="0.0001"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                className="w-full bg-[#18213a] border border-[#334155] rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                placeholder="e.g. 76.6950"
              />
              {formErrors.longitude && <p className="text-[10px] text-red-400">{formErrors.longitude}</p>}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#2864f0] to-[#8b42f5] hover:opacity-95 text-white font-bold tracking-wide shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 text-base"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" />
                <span>{t('btn_evaluating', 'Evaluating Terrain Susceptibility...')}</span>
              </>
            ) : (
              t('btn_predict', 'Evaluate Susceptibility')
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PredictionForm;

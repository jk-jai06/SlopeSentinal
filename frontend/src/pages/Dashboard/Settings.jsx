import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { User, Lock, Shield, CheckCircle, AlertCircle, Key, MapPin, Trash2, BookmarkCheck, Compass } from 'lucide-react';
import { changePassword, getSavedLocations, deleteSavedLocation } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const Settings = () => {
  const { user } = useContext(AuthContext);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [locations, setLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(true);

  const fetchLocations = async () => {
    setLoadingLocations(true);
    try {
      const data = await getSavedLocations();
      setLocations(data);
    } catch (err) {
      console.error("Failed to load saved locations", err);
    } finally {
      setLoadingLocations(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (newPassword !== confirmPassword) {
      setErrorMessage("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage("New password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await changePassword(currentPassword, newPassword);
      setSuccessMessage(res.message || "Password updated successfully.");
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setErrorMessage(err.response?.data?.detail || "Failed to update password. Verify your current password.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLocation = async (id) => {
    if (!window.confirm("Remove this saved location bookmark?")) return;
    try {
      await deleteSavedLocation(id);
      setLocations(prev => prev.filter(l => l.id !== id));
    } catch (err) {
      alert("Failed to remove saved location.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-[fadeIn_0.3s_ease-out]">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          SlopeSentinel Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#94a3b8] mt-1">
          Manage your credentials, monitoring locations, role privileges, and authentication preferences.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-[#1c2740] rounded-2xl p-6 border border-[#334155]/80 shadow-xl space-y-6">
        <div className="flex items-center gap-3 border-b border-[#334155]/60 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-lg font-bold text-white shadow-lg shadow-blue-500/20">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{user?.name || "SlopeSentinel User"}</h2>
            <p className="text-xs text-[#94a3b8]">{user?.email}</p>
          </div>
          <span className="ml-auto px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/15 text-blue-400 border border-blue-500/30">
            {user?.role || "user"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-[#18213a] border border-[#334155]">
            <p className="text-[#94a3b8] mb-1 font-medium">Account ID</p>
            <p className="text-sm font-bold text-white font-mono">#{user?.id || 1}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#18213a] border border-[#334155]">
            <p className="text-[#94a3b8] mb-1 font-medium">Session Protocol</p>
            <p className="text-sm font-bold text-white font-mono">HS256 JWT Token</p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#18213a] border border-[#334155]">
            <p className="text-[#94a3b8] mb-1 font-medium">Hash Algorithm</p>
            <p className="text-sm font-bold text-emerald-400 font-mono">Bcrypt (12 Rounds)</p>
          </div>
        </div>
      </div>

      {/* Saved Locations Management */}
      <div className="bg-[#1c2740] rounded-2xl p-6 border border-[#334155]/80 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#334155]/60 pb-3">
          <div className="flex items-center gap-2">
            <BookmarkCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white tracking-tight">Saved Monitoring Locations</h2>
          </div>
          <span className="text-xs text-slate-400">{locations.length} bookmarked</span>
        </div>

        {loadingLocations ? (
          <div className="py-8 flex justify-center">
            <LoadingSpinner size="md" />
          </div>
        ) : locations.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">
            <Compass className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-60" />
            <p>No saved monitoring locations yet.</p>
            <p className="text-[11px] text-slate-500 mt-1">Bookmark locations directly from the Assess Risk form to revisit them quickly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {locations.map((loc) => (
              <div 
                key={loc.id} 
                className="p-3.5 rounded-xl bg-[#18213a] border border-[#334155] flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>{loc.name}</span>
                  </div>
                  {loc.latitude && loc.longitude && (
                    <p className="text-[11px] text-emerald-400 font-mono">
                      {loc.latitude.toFixed(4)}°, {loc.longitude.toFixed(4)}°
                    </p>
                  )}
                  <p className="text-[10px] text-slate-400">
                    Elevation: {loc.elevation ? `${loc.elevation}m` : 'N/A'} &bull; Soil: {loc.soil_type || 'N/A'}
                  </p>
                  {loc.notes && (
                    <p className="text-[10px] text-slate-500 italic">{loc.notes}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteLocation(loc.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Remove location bookmark"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Password Change Card */}
      <div className="bg-[#1c2740] rounded-2xl p-6 border border-[#334155]/80 shadow-xl space-y-6">
        <div className="flex items-center gap-2 border-b border-[#334155]/60 pb-3">
          <Key className="w-5 h-5 text-blue-400" />
          <h2 className="text-base font-bold text-white tracking-tight">Update Password</h2>
        </div>

        {successMessage && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-300">
            <CheckCircle className="w-5 h-5 shrink-0 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-xs text-red-300">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-semibold text-[#94a3b8] uppercase tracking-wider mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-[#18213a] border border-[#334155] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2864f0]/60 focus:border-[#2864f0] transition-all"
              placeholder="Enter current password"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94a3b8] uppercase tracking-wider mb-1.5">
              New Password
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-[#18213a] border border-[#334155] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2864f0]/60 focus:border-[#2864f0] transition-all"
              placeholder="Minimum 6 characters"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94a3b8] uppercase tracking-wider mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[#18213a] border border-[#334155] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2864f0]/60 focus:border-[#2864f0] transition-all"
              placeholder="Re-enter new password"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#2864f0] to-[#8b42f5] hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50"
            >
              {loading ? <LoadingSpinner size="sm" /> : "Save New Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;

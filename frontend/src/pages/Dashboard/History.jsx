import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { LanguageContext } from '../../context/LanguageContext';
import { 
  Trash2, Filter, Search, Download, Eye, X, Calendar, 
  Compass, AlertCircle, RefreshCw, Printer, FileDown, MapPin, Mountain 
} from 'lucide-react';
import { getPredictionHistory, deletePrediction } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [reportModalItem, setReportModalItem] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [page, setPage] = useState(0);
  const pageSize = 15;

  const { user } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await getPredictionHistory({
        risk_filter: filter,
        search: searchTerm.trim() || undefined,
        skip: page * pageSize,
        limit: pageSize
      });
      setHistory(data);
    } catch (error) {
      console.error("Failed to fetch assessment records", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [filter, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchHistory();
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Permanently delete assessment record #${id}?`)) return;

    setDeleteLoading(id);
    try {
      await deletePrediction(id);
      setHistory(prev => prev.filter(item => item.id !== id));
      if (selectedItem?.id === id) setSelectedItem(null);
      if (reportModalItem?.id === id) setReportModalItem(null);
    } catch (error) {
      alert(error.response?.data?.detail || "Delete operation failed.");
    } finally {
      setDeleteLoading(null);
    }
  };

  const exportToCSV = () => {
    if (!history.length) return;
    const headers = ["ID", "Timestamp", "Region", "Latitude", "Longitude", "Rainfall (mm)", "Slope (°)", "Soil Type", "Vegetation (%)", "Elevation (m)", "Land Use", "Predicted Class", "P(High)", "P(Med)", "P(Low)"];
    const rows = history.map(item => [
      item.id,
      new Date(item.timestamp).toISOString(),
      `"${item.region_name || 'N/A'}"`,
      item.latitude || '',
      item.longitude || '',
      item.rainfall,
      item.slope,
      item.soil_type,
      item.vegetation,
      item.elevation,
      item.land_use,
      item.predicted_class,
      (item.probability_high * 100).toFixed(1) + '%',
      (item.probability_medium * 100).toFixed(1) + '%',
      (item.probability_low * 100).toFixed(1) + '%'
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `landslide_assessments_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getRiskPill = (risk) => {
    switch (risk) {
      case 'High Risk':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'Medium Risk':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Low Risk':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-slate-700/30 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
      {/* Page Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {t('nav_my_assessments', 'My Assessments')}
          </h1>
          <p className="text-xs sm:text-sm text-[#94a3b8] mt-1">
            Historical susceptibility evaluations, parameter distributions, and printable formal reports.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportToCSV}
            disabled={!history.length}
            className="px-4 py-2 rounded-xl bg-[#1c2740] hover:bg-slate-700 text-slate-200 hover:text-white border border-[#334155] text-xs font-semibold flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={fetchHistory}
            title="Refresh history"
            className="p-2 rounded-xl bg-[#1c2740] hover:bg-slate-700 text-slate-300 border border-[#334155] transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#1c2740] rounded-2xl p-4 border border-[#334155]/80 shadow-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Box */}
        <form onSubmit={handleSearchSubmit} className="relative flex-grow max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by region, coordinates, soil, or land use..."
            className="w-full bg-[#18213a] border border-[#334155] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2864f0]/60 focus:border-[#2864f0] transition-all"
          />
        </form>

        {/* Risk Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs text-[#94a3b8] font-medium mr-1.5 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-blue-400" />
            Filter:
          </span>
          {['All', 'High Risk', 'Medium Risk', 'Low Risk'].map((r) => (
            <button
              key={r}
              onClick={() => { setFilter(r); setPage(0); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                filter === r
                  ? 'bg-[#2864f0] text-white shadow-md shadow-blue-500/30'
                  : 'bg-[#18213a] text-[#94a3b8] hover:text-white hover:bg-slate-700/60 border border-[#334155]'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* History Table */}
      <div className="bg-[#1c2740] rounded-2xl border border-[#334155]/80 shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center">
            <LoadingSpinner size="lg" />
            <p className="text-xs text-[#94a3b8] mt-4">Retrieving historical records from database...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="p-16 text-center">
            <Compass className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">No Assessment Records Found</h3>
            <p className="text-xs text-[#94a3b8] max-w-sm mx-auto">
              {searchTerm || filter !== 'All'
                ? "No evaluations match your current search/filter parameters."
                : "You haven't conducted any landslide susceptibility assessments yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#334155]/80 bg-[#162035]/80 text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider">
                  <th className="py-3.5 px-4">Evaluation Date</th>
                  <th className="py-3.5 px-4">Region / Coordinates</th>
                  <th className="py-3.5 px-4">Environmental Parameters</th>
                  <th className="py-3.5 px-4">Predicted Risk</th>
                  <th className="py-3.5 px-4">Confidence Breakdown</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#334155]/50 text-xs">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-[#18213a]/80 transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-300">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-blue-400" />
                        {new Date(item.timestamp).toLocaleDateString()}
                      </div>
                      <span className="text-[10px] text-slate-500 block ml-5">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-white font-medium">
                      <div>
                        {item.region_name || <span className="text-slate-500 italic">Unspecified Region</span>}
                      </div>
                      {item.latitude !== null && item.longitude !== null && (
                        <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                          <MapPin className="w-2.5 h-2.5 text-emerald-400" />
                          <span>{item.latitude.toFixed(2)}°, {item.longitude.toFixed(2)}°</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col text-slate-300">
                        <span className="font-semibold text-white">Rain: {item.rainfall}mm, Slope: {item.slope}°</span>
                        <span className="text-[11px] text-[#94a3b8]">Veg: {item.vegetation}%, Elev: {item.elevation}m, {item.soil_type}, {item.land_use}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getRiskPill(item.predicted_class)}`}>
                        {item.predicted_class}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="text-rose-400" title="High Risk">H: {(item.probability_high * 100).toFixed(0)}%</span>
                        <span className="text-amber-400" title="Medium Risk">M: {(item.probability_medium * 100).toFixed(0)}%</span>
                        <span className="text-emerald-400" title="Low Risk">L: {(item.probability_low * 100).toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setReportModalItem(item)}
                          className="p-1.5 rounded-lg bg-[#18213a] text-blue-400 hover:text-white hover:bg-blue-600/30 border border-[#334155] transition-colors"
                          title="Generate Formal PDF Report"
                        >
                          <FileDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="p-1.5 rounded-lg bg-[#18213a] text-slate-300 hover:text-white hover:bg-slate-700/60 border border-[#334155] transition-colors"
                          title="View Quick Parameters"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {(user?.role === 'admin' || item.user_id === user?.id || item.user_id === null) && (
                          <button
                            onClick={() => handleDelete(item.id)}
                            disabled={deleteLoading === item.id}
                            className="p-1.5 rounded-lg bg-[#18213a] text-red-400 hover:text-white hover:bg-red-600/30 border border-[#334155] transition-colors disabled:opacity-50"
                            title="Delete assessment"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        <div className="p-4 bg-[#162035]/60 border-t border-[#334155]/60 flex items-center justify-between text-xs text-[#94a3b8]">
          <span>Page {page + 1} ({history.length} records shown)</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1.5 rounded-lg bg-[#18213a] border border-[#334155] hover:bg-slate-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={history.length < pageSize}
              className="px-3 py-1.5 rounded-lg bg-[#18213a] border border-[#334155] hover:bg-slate-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Quick Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-[fadeIn_0.15s_ease-out]">
          <div className="bg-[#1c2740] rounded-2xl max-w-lg w-full border border-[#334155] shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2864f0] via-indigo-500 to-[#8b42f5]"></div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#334155]">
                <div>
                  <h3 className="text-lg font-bold text-white">Assessment #{selectedItem.id} Details</h3>
                  <p className="text-xs text-[#94a3b8]">
                    Recorded on {new Date(selectedItem.timestamp).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-1.5 rounded-xl bg-[#18213a] text-slate-400 hover:text-white border border-[#334155]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-3 rounded-xl bg-[#18213a] border border-[#334155] flex items-center justify-between">
                  <span className="font-semibold text-[#94a3b8]">Susceptibility Level:</span>
                  <span className={`px-3 py-1 rounded-full font-bold border ${getRiskPill(selectedItem.predicted_class)}`}>
                    {selectedItem.predicted_class}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-[#18213a] border border-[#334155]">
                    <p className="text-[#94a3b8] mb-1">Rainfall</p>
                    <p className="text-sm font-bold text-white font-mono">{selectedItem.rainfall} mm</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#18213a] border border-[#334155]">
                    <p className="text-[#94a3b8] mb-1">Slope Angle</p>
                    <p className="text-sm font-bold text-white font-mono">{selectedItem.slope}°</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#18213a] border border-[#334155]">
                    <p className="text-[#94a3b8] mb-1">Vegetation Cover</p>
                    <p className="text-sm font-bold text-white font-mono">{selectedItem.vegetation}%</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#18213a] border border-[#334155]">
                    <p className="text-[#94a3b8] mb-1">Elevation</p>
                    <p className="text-sm font-bold text-white font-mono">{selectedItem.elevation} m</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#18213a] border border-[#334155]">
                    <p className="text-[#94a3b8] mb-1">Soil Classification</p>
                    <p className="text-sm font-bold text-white">{selectedItem.soil_type}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#18213a] border border-[#334155]">
                    <p className="text-[#94a3b8] mb-1">Land Use Type</p>
                    <p className="text-sm font-bold text-white">{selectedItem.land_use}</p>
                  </div>
                </div>

                {selectedItem.latitude && selectedItem.longitude && (
                  <div className="p-3 rounded-xl bg-[#18213a] border border-[#334155] flex justify-between">
                    <span className="text-slate-400">Coordinates:</span>
                    <span className="font-mono text-emerald-400">{selectedItem.latitude}° N, {selectedItem.longitude}° E</span>
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => {
                    const item = selectedItem;
                    setSelectedItem(null);
                    setReportModalItem(item);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Formal Report</span>
                </button>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2.5 rounded-xl bg-[#18213a] hover:bg-slate-700 text-white font-semibold text-xs border border-[#334155] transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Formal Printable Assessment Report Modal */}
      {reportModalItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-[fadeIn_0.15s_ease-out]">
          <div className="bg-[#1c2740] rounded-2xl max-w-lg w-full border border-[#334155] shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
            <div className="w-full h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
            
            <div className="p-6 overflow-y-auto space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#334155]">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400">
                    <Mountain className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wider text-blue-400 font-mono">SlopeSentinel</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">Official Assessment</span>
                    </div>
                    <h3 className="text-base font-bold text-white tracking-tight">Landslide Susceptibility Assessment Sheet</h3>
                    <p className="text-[11px] text-[#94a3b8]">
                      Assessment ID: #{reportModalItem.id} &bull; Generated: {new Date(reportModalItem.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setReportModalItem(null)}
                  className="p-1.5 rounded-xl bg-[#18213a] text-slate-400 hover:text-white border border-[#334155]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Assessment Outcome */}
              <div className="p-4 rounded-xl bg-[#18213a] border border-[#334155] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#94a3b8] uppercase tracking-wider block">Susceptibility Classification</span>
                  <span className="text-2xl font-black text-white">{reportModalItem.predicted_class}</span>
                </div>
                {reportModalItem.region_name && (
                  <div className="text-right">
                    <span className="text-xs text-[#94a3b8] block">Locus</span>
                    <span className="text-xs font-bold text-blue-300">{reportModalItem.region_name}</span>
                  </div>
                )}
              </div>

              {/* Input Feature Summary */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Observed Parameters</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#18213a] border border-[#334155]">
                    <span className="text-slate-400 block text-[10px]">Rainfall</span>
                    <span className="font-bold text-white font-mono">{reportModalItem.rainfall} mm</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#18213a] border border-[#334155]">
                    <span className="text-slate-400 block text-[10px]">Slope Angle</span>
                    <span className="font-bold text-white font-mono">{reportModalItem.slope}°</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#18213a] border border-[#334155]">
                    <span className="text-slate-400 block text-[10px]">Vegetation Cover</span>
                    <span className="font-bold text-white font-mono">{reportModalItem.vegetation}%</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#18213a] border border-[#334155]">
                    <span className="text-slate-400 block text-[10px]">Elevation</span>
                    <span className="font-bold text-white font-mono">{reportModalItem.elevation} m</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#18213a] border border-[#334155]">
                    <span className="text-slate-400 block text-[10px]">Soil Type</span>
                    <span className="font-bold text-white">{reportModalItem.soil_type}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#18213a] border border-[#334155]">
                    <span className="text-slate-400 block text-[10px]">Land Use</span>
                    <span className="font-bold text-white">{reportModalItem.land_use}</span>
                  </div>
                </div>
              </div>

              {/* Probabilities */}
              <div className="p-3 rounded-xl bg-[#18213a] border border-[#334155] space-y-1 text-xs font-mono">
                <span className="text-[11px] font-semibold text-slate-300 block font-sans">Ensemble Class Probabilities:</span>
                <div className="flex justify-between text-rose-400">
                  <span>High Risk:</span>
                  <span>{(reportModalItem.probability_high * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-amber-400">
                  <span>Medium Risk:</span>
                  <span>{(reportModalItem.probability_medium * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>Low Risk:</span>
                  <span>{(reportModalItem.probability_low * 100).toFixed(1)}%</span>
                </div>
              </div>

              {/* Official Disclaimer */}
              <div className="text-[10px] text-slate-400 bg-[#162035] p-3 rounded-lg border border-[#334155] leading-relaxed">
                <strong>SlopeSentinel Platform Notice:</strong> Computed via the SlopeSentinel machine-learning pipeline (Accuracy: 92.70%, ROC-AUC: 0.9895). This document summarizes statistical terrain susceptibility. It does not replace on-site borehole geotechnical tests or civil defence emergency directives.
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
                  onClick={() => setReportModalItem(null)}
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

export default History;

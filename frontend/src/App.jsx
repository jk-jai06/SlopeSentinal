import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import HowItWorks from './pages/HowItWorks';
import SafetyPrep from './pages/SafetyPrep';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import ProtectedRoute from './components/ProtectedRoute';

import DashboardLayout from './layouts/DashboardLayout';
import Summary from './pages/Dashboard/Summary';
import NewPrediction from './pages/Dashboard/NewPrediction';
import Analytics from './pages/Dashboard/Analytics';
import History from './pages/Dashboard/History';
import Settings from './pages/Dashboard/Settings';

import { Mountain } from 'lucide-react';

const PublicLayout = () => (
  <div className="min-h-screen flex flex-col bg-[#11182f] text-[#f4f7fc] selection:bg-blue-500/30">
    <Navbar />
    <main className="flex-grow flex items-start justify-center">
      <Outlet />
    </main>
    <footer className="bg-[#0e1424] border-t border-[#1e293b] py-8 px-4 sm:px-6 lg:px-8 mt-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400">
            <Mountain className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white tracking-tight">SlopeSentinel</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 font-medium">v2.0</span>
            </div>
            <p className="text-[11px] text-slate-400">Landslide Susceptibility Intelligence Platform</p>
          </div>
        </div>
        
        <p className="text-center text-[11px] text-slate-400 max-w-md">
          "Understand Your Terrain. Stay Informed. Stay Prepared." &bull; Powered by Scikit-Learn Random Forest Pipeline.
        </p>

        <div className="flex items-center gap-4 text-[11px]">
          <a href="/how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <a href="/safety" className="hover:text-white transition-colors">Safety Guide</a>
        </div>
      </div>
    </footer>
  </div>
);

const AuthLayout = () => (
  <div className="min-h-screen flex flex-col bg-[#11182f] text-[#f4f7fc] selection:bg-blue-500/30">
    <Navbar simplified={true} />
    <main className="flex-grow flex items-center justify-center p-4">
      <Outlet />
    </main>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <Routes>
            {/* Public & Main Navigation Experience */}
            <Route element={<PublicLayout />}>
              {/* 1. Home / Dashboard */}
              <Route path="/" element={<Home />} />
              {/* 2. Assess Risk */}
              <Route path="/assess" element={<Home />} />
              {/* 3. My Assessments */}
              <Route
                path="/assessments"
                element={
                  <ProtectedRoute>
                    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                      <History />
                    </div>
                  </ProtectedRoute>
                }
              />
              {/* 4. Analytics */}
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                      <Analytics />
                    </div>
                  </ProtectedRoute>
                }
              />
              {/* 5. How It Works */}
              <Route path="/how-it-works" element={<HowItWorks />} />
              {/* 6. Safety & Preparedness */}
              <Route path="/safety" element={<SafetyPrep />} />
              {/* 7. Profile & Settings */}
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                      <Settings />
                    </div>
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Authentication Workflows */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Route>

            {/* Authenticated Research Console with Sidebar */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Summary />} />
              <Route path="predict" element={<NewPrediction />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="history" element={<History />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Direct Aliases */}
            <Route path="/history" element={<Navigate to="/assessments" replace />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;

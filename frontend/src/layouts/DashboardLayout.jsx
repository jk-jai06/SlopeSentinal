import React, { useContext, useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Mountain, User, Menu, X, ChevronRight } from 'lucide-react';

const DashboardLayout = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="h-screen flex flex-col bg-[#11182f] text-[#f4f7fc] overflow-hidden font-sans">
            {/* Top Dashboard Header */}
            <header className="bg-[#162035] border-b border-[#334155]/70 shadow-lg z-20 shrink-0">
                <div className="flex items-center justify-between px-4 sm:px-6 py-3.5">
                    {/* Left: Brand & Mobile Toggle */}
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
                            className="md:hidden p-2 rounded-xl bg-[#1c2740] border border-[#334155] text-slate-300 hover:text-white"
                        >
                            {mobileDrawerOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                        
                        <Link to="/" className="flex items-center space-x-3 group">
                            <div className="h-9 w-9 bg-[#2864f0]/20 border border-[#2864f0]/40 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(40,100,240,0.25)] group-hover:bg-[#2864f0]/30 transition-all">
                                <Mountain className="h-5 w-5 text-blue-400" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-base sm:text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 leading-tight">
                                    SlopeSentinel
                                </span>
                                <span className="text-[10px] text-[#94a3b8] font-medium uppercase tracking-wider hidden sm:block">
                                    Landslide Susceptibility Intelligence
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Right: User Information & Actions */}
                    <div className="flex items-center space-x-4">
                        <Link
                            to="/"
                            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1c2740] border border-[#334155] hover:border-blue-500/50 text-xs font-semibold text-[#94a3b8] hover:text-white transition-all"
                        >
                            <span>Public Predictor</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                        </Link>

                        <div className="flex items-center space-x-3 border-l border-[#334155] pl-4">
                            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow">
                                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div className="hidden sm:block text-left">
                                <p className="text-xs font-semibold text-white leading-tight">{user?.name || "Researcher"}</p>
                                <p className="text-[10px] text-[#94a3b8] uppercase font-bold tracking-wider">{user?.role || "user"}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                title="Sign out"
                                className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                                <LogOut className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Drawer */}
            {mobileDrawerOpen && (
                <div className="md:hidden bg-[#162035] border-b border-[#334155] p-4 space-y-2 z-30">
                    <Link
                        to="/dashboard"
                        onClick={() => setMobileDrawerOpen(false)}
                        className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-[#1c2740] hover:text-white"
                    >
                        Overview
                    </Link>
                    <Link
                        to="/dashboard/predict"
                        onClick={() => setMobileDrawerOpen(false)}
                        className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-[#1c2740] hover:text-white"
                    >
                        New Prediction
                    </Link>
                    <Link
                        to="/dashboard/history"
                        onClick={() => setMobileDrawerOpen(false)}
                        className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-[#1c2740] hover:text-white"
                    >
                        Prediction History
                    </Link>
                    <Link
                        to="/dashboard/analytics"
                        onClick={() => setMobileDrawerOpen(false)}
                        className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-[#1c2740] hover:text-white"
                    >
                        Risk Analytics
                    </Link>
                    <Link
                        to="/dashboard/settings"
                        onClick={() => setMobileDrawerOpen(false)}
                        className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-[#1c2740] hover:text-white"
                    >
                        Account Settings
                    </Link>
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-y-auto bg-[#11182f] p-4 sm:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;

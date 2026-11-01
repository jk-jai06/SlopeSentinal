import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Compass, History, BarChart2, Settings, PlayCircle } from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { path: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
        { path: "/dashboard/predict", label: "New Prediction", icon: PlayCircle },
        { path: "/dashboard/history", label: "Prediction History", icon: History },
        { path: "/dashboard/analytics", label: "Risk Analytics", icon: BarChart2 },
        { path: "/dashboard/settings", label: "Account Settings", icon: Settings },
    ];

    return (
        <aside className="w-64 bg-[#162035] border-r border-[#334155]/60 hidden md:flex flex-col h-full shadow-xl shrink-0">
            <div className="p-4 space-y-6">
                <div className="px-3 pt-2">
                    <p className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider">
                        SlopeSentinel Console
                    </p>
                </div>

                <nav className="space-y-1.5">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.exact}
                            className={({ isActive }) =>
                                `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                    ? "bg-[#2864f0]/20 text-white border border-[#2864f0]/40 shadow-[0_0_15px_rgba(40,100,240,0.2)] font-semibold"
                                    : "text-[#94a3b8] hover:bg-[#1c2740] hover:text-white"
                                }`
                            }
                        >
                            <item.icon className="h-4 w-4 shrink-0 text-blue-400" />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>

            {/* Bottom System Info Widget */}
            <div className="mt-auto p-4 m-3 rounded-xl bg-[#1c2740] border border-[#334155]/80 text-xs">
                <div className="flex items-center justify-between text-[#94a3b8] mb-1">
                    <span>Model Engine:</span>
                    <span className="text-emerald-400 font-bold font-mono">ACTIVE</span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono">Random Forest (100 trees)</p>
                <div className="mt-2 text-[10px] text-slate-500">
                    Accuracy: 92.70% (Holdout)
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;

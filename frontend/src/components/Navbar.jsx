import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Mountain, LayoutDashboard, History, BarChart2, 
  Settings, LogOut, User, Menu, X, ShieldAlert, LifeBuoy, 
  HelpCircle, Sparkles, Globe, ChevronDown, Check
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';

const Navbar = ({ simplified = false }) => {
  const { user, logout } = useContext(AuthContext);
  const { language, setLanguage, t } = useContext(LanguageContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setProfileMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { path: '/', label: t('nav_home', 'Dashboard'), icon: LayoutDashboard },
    { path: '/assess', label: t('nav_assess', 'Assess Risk'), icon: Sparkles },
    { path: '/assessments', label: t('nav_my_assessments', 'My Assessments'), icon: History, protected: true },
    { path: '/analytics', label: t('nav_analytics', 'Analytics'), icon: BarChart2, protected: true },
    { path: '/how-it-works', label: t('nav_how_it_works', 'How It Works'), icon: HelpCircle },
    { path: '/safety', label: t('nav_safety', 'Safety & Prep'), icon: LifeBuoy },
  ];

  const languages = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  ];

  const isActive = (path) => {
    if (path === '/' && (location.pathname === '/' || location.pathname === '/dashboard')) return true;
    if (path === '/assess' && location.pathname === '/assess') return true;
    if (path === '/assessments' && (location.pathname === '/assessments' || location.pathname === '/history' || location.pathname === '/dashboard/history')) return true;
    if (path === '/analytics' && (location.pathname === '/analytics' || location.pathname === '/dashboard/analytics')) return true;
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 bg-[#162035]/95 backdrop-blur-md border-b border-[#334155]/60 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Brand / Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 group transition-all">
              <div className="bg-[#2864f0]/20 p-2.5 rounded-xl border border-[#2864f0]/40 group-hover:bg-[#2864f0]/30 transition-all shadow-[0_0_15px_rgba(40,100,240,0.25)] flex items-center justify-center">
                <Mountain className="text-[#3b82f6] w-6 h-6 transform group-hover:scale-105 transition-transform" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg md:text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 tracking-tight whitespace-nowrap">
                  SlopeSentinel
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          {!simplified && (
            <nav className="hidden xl:flex items-center space-x-1">
              {navLinks.map((item) => {
                const active = isActive(item.path);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      active
                        ? 'bg-[#2864f0]/20 text-white border border-[#2864f0]/40 shadow-[0_0_15px_rgba(40,100,240,0.2)]'
                        : 'text-[#94a3b8] hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Right Header Controls */}
          <div className="flex items-center gap-2.5">
            
            {/* Language Dropdown Selector */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#1c2740] border border-[#334155] text-xs font-medium text-slate-300 hover:text-white hover:border-blue-500/50 transition-all"
                title="Select language"
              >
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span className="uppercase font-bold text-[11px]">{language}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-36 rounded-xl bg-[#1c2740] border border-[#334155] shadow-2xl py-1.5 z-50 animate-[fadeIn_0.15s_ease-out]">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setLangMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs text-left text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold">{l.native}</span>
                        <span className="text-[10px] text-slate-500">{l.label}</span>
                      </div>
                      {language === l.code && <Check className="w-3.5 h-3.5 text-blue-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User / Auth State */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1c2740] border border-[#334155] hover:border-blue-500/50 transition-all text-xs font-medium text-white shadow-sm"
                >
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-[11px] font-bold text-white shadow">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden sm:inline font-medium text-[#f4f7fc] max-w-[100px] truncate">{user.name}</span>
                </button>

                {/* Profile Dropdown Menu */}
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#1c2740] border border-[#334155] shadow-2xl py-2 z-50 animate-[fadeIn_0.15s_ease-out]">
                    <div className="px-4 py-2 border-b border-[#334155]/60">
                      <p className="text-sm font-semibold text-white">{user.name}</p>
                      <p className="text-xs text-[#94a3b8] truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/settings"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#94a3b8] hover:text-white hover:bg-slate-800/60 transition-colors"
                    >
                      <Settings className="w-3.5 h-3.5 text-blue-400" />
                      {t('nav_settings', 'Settings')}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      {t('nav_signout', 'Sign Out')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#94a3b8] hover:text-white hover:bg-slate-800/50 transition-colors"
                >
                  {t('nav_signin', 'Sign In')}
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#2864f0] to-[#8b42f5] hover:opacity-95 transition-opacity shadow-[0_0_15px_rgba(40,100,240,0.3)]"
                >
                  {t('nav_register', 'Register')}
                </Link>
              </div>
            )}

            {/* Mobile / Tablet Menu Toggle */}
            {!simplified && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 rounded-xl bg-[#1c2740] border border-[#334155] text-slate-300 hover:text-white"
                title="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Navigation Drawer */}
      {mobileMenuOpen && !simplified && (
        <div className="xl:hidden border-t border-[#334155] bg-[#162035] px-4 pt-3 pb-5 space-y-1">
          {navLinks.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  active
                    ? 'bg-[#2864f0]/20 text-white border border-[#2864f0]/40'
                    : 'text-[#94a3b8] hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <Icon className="w-4 h-4 text-blue-400" />
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};

export default Navbar;

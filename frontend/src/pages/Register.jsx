import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mountain, Lock, Mail, User, AlertCircle, ArrowRight } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match. Please re-enter.");
            return;
        }

        if (password.length < 6) {
            setError("Password must contain at least 6 characters.");
            return;
        }

        setLoading(true);
        try {
            await register(name, email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.detail || "Registration failed. This email may already be in use.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto my-8">
            <div className="bg-[#1c2740] rounded-2xl shadow-2xl p-8 border border-[#334155]/80 relative overflow-hidden group">
                {/* Top Accent Gradient */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2864f0] via-indigo-500 to-[#8b42f5]"></div>

                {/* Header with Mountain Icon */}
                <div className="text-center mb-8">
                    <div className="mx-auto w-14 h-14 bg-[#2864f0]/20 rounded-2xl flex items-center justify-center border border-[#2864f0]/40 shadow-[0_0_20px_rgba(40,100,240,0.25)] mb-3">
                        <Mountain className="w-8 h-8 text-[#3b82f6]" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-400 font-mono">
                        SlopeSentinel
                    </span>
                    <h2 className="text-2xl font-extrabold text-white tracking-tight mt-1">Create Your Account</h2>
                    <p className="mt-1.5 text-xs text-[#94a3b8]">
                        Join SlopeSentinel to access landslide susceptibility assessments.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-red-300 leading-relaxed">{error}</p>
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-xs font-semibold text-[#94a3b8] uppercase tracking-wider mb-1.5">
                            Full Name
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                <User className="h-4 w-4" />
                            </div>
                            <input
                                type="text"
                                required
                                className="w-full bg-[#18213a] border border-[#334155] rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2864f0]/60 focus:border-[#2864f0] transition-all text-sm"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your full name"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-[#94a3b8] uppercase tracking-wider mb-1.5">
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                <Mail className="h-4 w-4" />
                            </div>
                            <input
                                type="email"
                                required
                                className="w-full bg-[#18213a] border border-[#334155] rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2864f0]/60 focus:border-[#2864f0] transition-all text-sm"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-[#94a3b8] uppercase tracking-wider mb-1.5">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                <Lock className="h-4 w-4" />
                            </div>
                            <input
                                type="password"
                                required
                                className="w-full bg-[#18213a] border border-[#334155] rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2864f0]/60 focus:border-[#2864f0] transition-all text-sm"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="At least 6 characters"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-[#94a3b8] uppercase tracking-wider mb-1.5">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                <Lock className="h-4 w-4" />
                            </div>
                            <input
                                type="password"
                                required
                                className="w-full bg-[#18213a] border border-[#334155] rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2864f0]/60 focus:border-[#2864f0] transition-all text-sm"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Re-enter password"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-[#2864f0] to-[#8b42f5] hover:opacity-95 text-white font-bold text-sm tracking-wide shadow-lg shadow-blue-500/25 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? <LoadingSpinner size="sm" /> : (
                            <>
                                <span>Create Account</span>
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-[#334155]/60 text-center">
                    <p className="text-xs text-[#94a3b8]">
                        Already registered?{' '}
                        <Link to="/login" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                            Sign in here
                        </Link>
                    </p>
                    <p className="text-xs text-[#94a3b8] mt-2">
                        <Link to="/" className="text-slate-400 hover:text-white transition-colors">
                            ← Return to SlopeSentinel Home
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;

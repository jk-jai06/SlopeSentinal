import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mountain, Mail, Key, Lock, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { requestPasswordReset, confirmPasswordReset } from '../services/api';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Request, 2: Reset
    const [email, setEmail] = useState('');
    const [resetCode, setResetCode] = useState('CIT-RESET-2026');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRequest = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await requestPasswordReset(email);
            setMessage(res.message);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.detail || "Request failed. Please verify your email.");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async (e) => {
        e.preventDefault();
        setError('');
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);
        try {
            const res = await confirmPasswordReset(email, resetCode, newPassword);
            setMessage(res.message);
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to reset password. Verify your code.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto my-8">
            <div className="bg-[#1c2740] rounded-2xl shadow-2xl p-8 border border-[#334155]/80 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2864f0] via-indigo-500 to-[#8b42f5]"></div>

                <div className="text-center mb-8">
                    <div className="mx-auto w-14 h-14 bg-[#2864f0]/20 rounded-2xl flex items-center justify-center border border-[#2864f0]/40 shadow-[0_0_20px_rgba(40,100,240,0.25)] mb-3">
                        <Mountain className="w-8 h-8 text-[#3b82f6]" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-400 font-mono">
                        SlopeSentinel
                    </span>
                    <h2 className="text-2xl font-extrabold text-white tracking-tight mt-1">Password Recovery</h2>
                    <p className="mt-1.5 text-xs text-[#94a3b8]">
                        Reset your credentials to regain access to your SlopeSentinel workspace
                    </p>
                </div>

                {message && (
                    <div className="mb-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-200 leading-relaxed">{message}</p>
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-red-300 leading-relaxed">{error}</p>
                    </div>
                )}

                {step === 1 && (
                    <form className="space-y-4" onSubmit={handleRequest}>
                        <div>
                            <label className="block text-xs font-semibold text-[#94a3b8] uppercase tracking-wider mb-1.5">
                                Account Email Address
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

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#2864f0] to-[#8b42f5] hover:opacity-95 text-white font-bold text-sm tracking-wide shadow-lg shadow-blue-500/25 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? <LoadingSpinner size="sm" /> : (
                                <>
                                    <span>Send Reset Instructions</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form className="space-y-4" onSubmit={handleReset}>
                        <div>
                            <label className="block text-xs font-semibold text-[#94a3b8] uppercase tracking-wider mb-1.5">
                                Verification Code
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                    <Key className="h-4 w-4" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-[#18213a] border border-[#334155] rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2864f0]/60 focus:border-[#2864f0] transition-all text-sm"
                                    value={resetCode}
                                    onChange={(e) => setResetCode(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-[#94a3b8] uppercase tracking-wider mb-1.5">
                                New Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                    <Lock className="h-4 w-4" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-[#18213a] border border-[#334155] rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2864f0]/60 focus:border-[#2864f0] transition-all text-sm"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-[#94a3b8] uppercase tracking-wider mb-1.5">
                                Confirm New Password
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
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#2864f0] to-[#8b42f5] hover:opacity-95 text-white font-bold text-sm tracking-wide shadow-lg shadow-blue-500/25 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? <LoadingSpinner size="sm" /> : <span>Update Password</span>}
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <div className="text-center py-4">
                        <Link
                            to="/login"
                            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-[#2864f0] to-[#8b42f5] text-white font-bold text-sm shadow-lg hover:opacity-95 transition-opacity"
                        >
                            Return to Login
                        </Link>
                    </div>
                )}

                <div className="mt-8 pt-6 border-t border-[#334155]/60 text-center">
                    <Link to="/login" className="text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                        ← Back to Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;

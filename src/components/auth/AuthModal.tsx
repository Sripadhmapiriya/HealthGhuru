'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { signIn } from 'next-auth/react';
import {
  X,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Building2,
  ArrowRight,
  Check,
  KeyRound,
  HeartPulse,
} from 'lucide-react';
import { useAuthModal, AuthModalMode } from '@/context/AuthModalContext';

export function AuthModal() {
  const {
    isOpen,
    mode,
    intentTitle,
    intentSubtitle,
    closeLoginModal,
    setMode,
    handleAuthSuccess,
  } = useAuthModal();

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [newsletter, setNewsletter] = useState(true);

  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // Clear errors and inputs when modal closes or mode changes
  useEffect(() => {
    if (!isOpen) {
      setErrorMessage('');
      setSuccessMessage('');
      setLoading(false);
      setResetSent(false);
    }
  }, [isOpen]);

  useEffect(() => {
    setErrorMessage('');
    setSuccessMessage('');
  }, [mode]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeLoginModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeLoginModal]);

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const passwordScore = getPasswordStrength(password);
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-600'];

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      const result = await signIn('credentials', {
        redirect: false,
        email: cleanEmail,
        password,
      });

      if (result?.error) {
        if (result.error.includes('suspended')) {
          setErrorMessage('This account is suspended. Please contact support.');
        } else {
          setErrorMessage('Invalid email or password. Please verify your credentials.');
        }
        setLoading(false);
        return;
      }

      setSuccessMessage('Welcome back! Logging you in...');
      setTimeout(() => {
        handleAuthSuccess();
      }, 500);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to sign in. Please try again.');
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!acceptTerms) {
      setErrorMessage('Please accept the Terms of Service and Privacy Policy.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanName = name.trim();

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          password,
          subscribeNewsletter: newsletter,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to register account.');
      }

      setSuccessMessage('Account created! Authenticating your session...');

      // Auto sign in immediately
      const signInRes = await signIn('credentials', {
        redirect: false,
        email: cleanEmail,
        password,
      });

      if (signInRes?.error) {
        setMode('signin');
        setSuccessMessage('Account registered! Please sign in with your password.');
        setLoading(false);
      } else {
        setTimeout(() => {
          handleAuthSuccess();
        }, 500);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'An error occurred during registration.');
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      if (res.ok) {
        setResetSent(true);
        setSuccessMessage('Password recovery instructions sent! Check your inbox.');
      } else {
        const data = await res.json();
        setErrorMessage(data.error || 'Unable to process password reset request.');
      }
    } catch {
      // Fallback message
      setResetSent(true);
      setSuccessMessage('If an account exists with that email, reset instructions have been sent.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop overlay with blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeLoginModal}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-all"
          aria-hidden="true"
        />

        {/* Modal Dialog Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-10 my-auto"
        >
          {/* Top Decorative Header Accent */}
          <div className="h-2 bg-gradient-to-r from-emerald-600 via-[#f06d2f] to-emerald-500" />

          {/* Close Button */}
          <button
            onClick={closeLoginModal}
            className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors z-20"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>

          <div className="p-6 sm:p-8">
            {/* Brand Logo & Title */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center mb-3">
                <div className="relative w-40 h-10">
                  <Image
                    src="/images/logo_transparent.png"
                    alt="HealthGhuru"
                    fill
                    sizes="160px"
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              {/* Contextual Intent Banner */}
              {intentTitle ? (
                <div className="bg-gradient-to-r from-emerald-50 via-orange-50/50 to-emerald-50 border border-emerald-200/80 rounded-2xl p-3.5 mb-4 text-left shadow-xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-heading font-bold text-xs">
                    <Sparkles size={14} className="text-[#f06d2f] shrink-0" />
                    <span>{intentTitle}</span>
                  </div>
                  {intentSubtitle && (
                    <p className="text-[11px] text-gray-600 mt-1 leading-relaxed pl-5">
                      {intentSubtitle}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-xs text-text-secondary">
                  Access clinical wellness intelligence, manage campaigns &amp; bookmark insights.
                </p>
              )}

              {/* Tab Selector (Sign In vs Create Account) */}
              {mode !== 'forgot' && (
                <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-2xl mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      setErrorMessage('');
                    }}
                    className={`py-2 text-xs sm:text-sm font-heading font-bold rounded-xl transition-all ${
                      mode === 'signin'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      setErrorMessage('');
                    }}
                    className={`py-2 text-xs sm:text-sm font-heading font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                      mode === 'signup'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-emerald-700 hover:text-emerald-900'
                    }`}
                  >
                    <span>Register</span>
                    <span className="px-1.5 py-0.5 text-[9px] font-bold bg-[#f06d2f] text-white rounded-full uppercase tracking-wider">
                      Free
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-red-700 text-xs"
              >
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{errorMessage}</div>
              </motion.div>
            )}

            {/* Success Message Alert */}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2 text-emerald-800 text-xs"
              >
                <CheckCircle2 size={15} className="shrink-0 mt-0.5 text-emerald-600" />
                <div className="flex-1 font-medium">{successMessage}</div>
              </motion.div>
            )}

            {/* ── MODE: SIGN IN ────────────────────────────────────── */}
            {mode === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-heading font-bold text-gray-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@hospital.com or user@gmail.com"
                      className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none transition-all placeholder:text-gray-400"
                    />
                    <Mail size={16} className="absolute left-3.5 top-3 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-heading font-bold text-gray-700">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-xs font-heading font-semibold text-[#f06d2f] hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none transition-all placeholder:text-gray-400"
                    />
                    <Lock size={16} className="absolute left-3.5 top-3 text-gray-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs text-gray-600">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                    />
                    <span>Remember this device</span>
                  </label>
                  <span className="text-[11px] text-gray-400 flex items-center gap-1">
                    <ShieldCheck size={12} className="text-emerald-600" /> 256-bit SSL
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-emerald-700 to-[#f06d2f] hover:from-emerald-800 hover:to-[#e05a1b] text-white rounded-xl text-sm font-heading font-bold transition-all shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In &amp; Continue</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                {/* Highlighted New User / Registration Callout */}
                <div className="mt-4 p-3.5 bg-gradient-to-r from-emerald-50 via-teal-50 to-orange-50/60 border border-emerald-200/90 rounded-2xl flex items-center justify-between gap-3 text-left shadow-xs">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-heading font-bold text-emerald-950">
                      <Sparkles size={14} className="text-[#f06d2f]" />
                      <span>Not registered on HealthGhuru?</span>
                    </div>
                    <p className="text-[11px] text-gray-600 mt-0.5">
                      Create a free account in 30 seconds to bookmark &amp; advertise.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      setErrorMessage('');
                    }}
                    className="px-3.5 py-1.5 bg-[#f06d2f] hover:bg-[#e05a1b] text-white rounded-xl text-xs font-heading font-bold transition-all shadow-xs shrink-0 cursor-pointer flex items-center gap-1"
                  >
                    <span>Register Free</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </form>
            )}

            {/* ── MODE: SIGN UP (REGISTER) ────────────────────────── */}
            {mode === 'signup' && (
              <form onSubmit={handleRegister} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="block text-xs font-heading font-bold text-gray-700">
                    Full Name / Organization Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Dr. Ramesh Kumar or Apollo Clinics"
                      className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-gray-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none transition-all placeholder:text-gray-400"
                    />
                    <User size={16} className="absolute left-3.5 top-2.5 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-heading font-bold text-gray-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@hospital.com or user@gmail.com"
                      className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-gray-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none transition-all placeholder:text-gray-400"
                    />
                    <Mail size={16} className="absolute left-3.5 top-2.5 text-gray-400" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-heading font-bold text-gray-700">
                      Create Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min 6 characters"
                        className="w-full pl-9 pr-8 py-2 text-sm rounded-xl border border-gray-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none transition-all placeholder:text-gray-400"
                      />
                      <Lock size={15} className="absolute left-3 top-2.5 text-gray-400" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-heading font-bold text-gray-700">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full pl-9 pr-8 py-2 text-sm rounded-xl border border-gray-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none transition-all placeholder:text-gray-400"
                      />
                      <Lock size={15} className="absolute left-3 top-2.5 text-gray-400" />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Password Strength Meter */}
                {password && (
                  <div className="space-y-1 pt-0.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-gray-500">Password strength:</span>
                      <span className="font-heading font-bold text-gray-800">
                        {strengthLabels[passwordScore - 1] || 'Too Weak'}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`h-full rounded-full transition-all ${
                            i < passwordScore ? strengthColors[passwordScore - 1] : 'bg-transparent'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Agreements */}
                <div className="space-y-2 pt-1">
                  <label className="flex items-start gap-2 cursor-pointer text-xs text-gray-600">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 mt-0.5 shrink-0"
                    />
                    <span className="text-[11px] leading-tight">
                      I agree to the{' '}
                      <a href="/terms-of-service" target="_blank" className="text-emerald-700 underline">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="/privacy-policy" target="_blank" className="text-emerald-700 underline">
                        Privacy Policy
                      </a>
                      .
                    </span>
                  </label>

                  <label className="flex items-start gap-2 cursor-pointer text-xs text-gray-600">
                    <input
                      type="checkbox"
                      checked={newsletter}
                      onChange={(e) => setNewsletter(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 mt-0.5 shrink-0"
                    />
                    <span className="text-[11px] leading-tight">
                      Receive weekly clinical news digest &amp; platform updates.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-emerald-700 to-[#f06d2f] hover:from-emerald-800 hover:to-[#e05a1b] text-white rounded-xl text-sm font-heading font-bold transition-all shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer mt-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Create Account &amp; Sign In</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ── MODE: FORGOT PASSWORD ───────────────────────────── */}
            {mode === 'forgot' && (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="text-center mb-2">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-2">
                    <KeyRound size={22} />
                  </div>
                  <h3 className="font-heading font-bold text-base text-gray-900">
                    Reset Your Password
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the email registered with HealthGhuru to receive a secure recovery link.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-heading font-bold text-gray-700">
                    Account Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@hospital.com"
                      className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none transition-all"
                    />
                    <Mail size={16} className="absolute left-3.5 top-3 text-gray-400" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-heading font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Send Reset Link'
                  )}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className="text-xs font-heading font-semibold text-emerald-700 hover:underline inline-flex items-center gap-1"
                  >
                    ← Back to Sign In
                  </button>
                </div>
              </form>
            )}

            {/* Bottom Trust Indicators */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
              <span className="flex items-center gap-1">
                <ShieldCheck size={13} className="text-emerald-600" /> Verified Partner Shield
              </span>
              <span className="flex items-center gap-1">
                <HeartPulse size={13} className="text-[#f06d2f]" /> HIPAA-Compliant Architecture
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { 
  GraduationCap, 
  Lock, 
  Mail, 
  User, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck, 
  KeyRound, 
  HelpCircle,
  Sparkles,
  Info,
  Clock,
  RotateCcw,
  Check,
  FileText,
  TrendingUp
} from 'lucide-react';
import { storage } from '../services/storage.ts';
import type { AuthUser } from '../types.ts';

interface AuthPageProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
  redirect?: string;
  planId?: string;
  slotNumber?: number;
  message?: string;
}

type AuthMode = 'OTP_LOGIN' | 'PASSWORD_LOGIN' | 'SIGNUP' | 'FORGOT';

export const AuthPage: React.FC<AuthPageProps> = ({ 
  onNavigate, 
  redirect = 'dashboard',
  planId,
  slotNumber,
  message
}) => {
  const [mode, setMode] = useState<AuthMode>('OTP_LOGIN');
  
  // Registration & User details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [category, setCategory] = useState<'General' | 'OBC-NCL' | 'EWS' | 'SC' | 'ST'>('General');
  const [targetCollege, setTargetCollege] = useState('NIT Trichy / IIIT Allahabad');

  // OTP State
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [otpSending, setOtpSending] = useState(false);
  const [otpSandboxPreview, setOtpSandboxPreview] = useState<string | null>(null);

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(message || null);
  const [showLegalModal, setShowLegalModal] = useState<'TERMS' | 'PRIVACY' | null>(null);

  // References for 6-digit OTP input boxes
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for Resend OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [resendCountdown]);

  // Handle successful authentication redirect
  const handleAuthSuccess = (user: AuthUser, welcomeMsg: string) => {
    setSuccessMessage(welcomeMsg);
    setTimeout(() => {
      if (redirect === 'pricing') {
        onNavigate('pricing', { selectedPlanId: planId });
      } else if (redirect === 'instructions' && slotNumber) {
        onNavigate('instructions', { slotNumber });
      } else {
        onNavigate('dashboard');
      }
    }, 700);
  };

  // Send 6-digit Email OTP
  const handleSendOtp = async (purpose: 'LOGIN' | 'REGISTER' | 'RESET_PASSWORD' = 'LOGIN') => {
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (purpose === 'REGISTER' && !name.trim()) {
      setErrorMessage('Please enter your full name to proceed with registration.');
      return;
    }

    setErrorMessage(null);
    setOtpSending(true);
    setOtpSandboxPreview(null);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          purpose,
          name: name.trim() || undefined
        })
      });

      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        setResendCountdown(60); // 60-second cooldown
        setSuccessMessage(`A 6-digit verification code has been dispatched to ${email.trim()}.`);
        if (data.previewCode) {
          setOtpSandboxPreview(data.previewCode);
        }
        // Focus first OTP input
        setTimeout(() => {
          otpInputsRef.current[0]?.focus();
        }, 100);
      } else {
        setErrorMessage(data.error || 'Failed to send OTP code. Please check your email.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error while requesting verification code.');
    } finally {
      setOtpSending(false);
    }
  };

  // Handle single digit input in 6-digit box
  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/[^0-9]/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);

    // Auto-advance to next input
    if (digit && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  // Handle Backspace navigation in OTP boxes
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  // Handle Paste event across 6 boxes
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (!pasted) return;

    const newDigits = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasted[i] || '';
    }
    setOtpDigits(newDigits);

    const nextIndex = Math.min(pasted.length, 5);
    otpInputsRef.current[nextIndex]?.focus();
  };

  // Verify OTP & Continue
  const handleVerifyOtpAndContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpDigits.join('');
    if (code.length !== 6) {
      setErrorMessage('Please enter the full 6-digit verification code.');
      return;
    }

    setErrorMessage(null);
    setLoading(true);

    try {
      const purpose = mode === 'SIGNUP' ? 'REGISTER' : 'LOGIN';
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          otp: code,
          purpose,
          name: name.trim() || undefined,
          password: password || undefined,
          category,
          targetCollege
        })
      });

      const data = await res.json();
      if (data.success && data.token && data.user) {
        storage.setAuthToken(data.token);
        storage.setAuthUser(data.user);
        handleAuthSuccess(data.user, `Verified! Welcome, ${data.user.name}.`);
      } else {
        setErrorMessage(data.error || 'Verification code failed. Please check and try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error verifying code.');
    } finally {
      setLoading(false);
    }
  };

  // Standard Password Login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      });

      const data = await res.json();
      if (data.success && data.token && data.user) {
        storage.setAuthToken(data.token);
        storage.setAuthUser(data.user);
        handleAuthSuccess(data.user, `Welcome back, ${data.user.name}!`);
      } else {
        setErrorMessage(data.error || 'Invalid email or password.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error during sign in.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Logins for Testing
  const handleQuickDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setMode('PASSWORD_LOGIN');
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4 sm:px-6 space-y-8">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div 
          onClick={() => onNavigate('home')} 
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-500 text-white shadow-lg shadow-blue-500/20 cursor-pointer hover:scale-105 transition-transform"
        >
          <TrendingUp className="h-7 w-7 stroke-[2.5]" />
        </div>
        <div className="pt-1">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-sky-400">
            TOP RANKER · Practice Smart. Rank Higher.
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {mode === 'OTP_LOGIN' && 'Sign In with Email OTP'}
          {mode === 'PASSWORD_LOGIN' && 'Sign In to Your Account'}
          {mode === 'SIGNUP' && 'Create Candidate Account'}
          {mode === 'FORGOT' && 'Reset Account Password'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          {mode === 'OTP_LOGIN' && 'Passwordless, 100% secure one-time code sent directly to your email.'}
          {mode === 'PASSWORD_LOGIN' && 'Access all 30 full-length mock papers, bookmarks, and test analytics.'}
          {mode === 'SIGNUP' && 'Join serious JEE Main aspirants practicing authentic PYQs on TOP RANKER.'}
          {mode === 'FORGOT' && 'Enter your registered email to receive a password reset code.'}
        </p>
      </div>

      {/* Contextual Notice if redirected */}
      {message && (
        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs font-semibold text-blue-800 dark:text-blue-300 flex items-center gap-2">
          <Info className="h-4 w-4 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Main Authentication Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900 shadow-xl space-y-6">
        {/* Mode Selector Navigation Tabs */}
        {mode !== 'FORGOT' && (
          <div className="grid grid-cols-3 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-center">
            <button
              type="button"
              onClick={() => {
                setMode('OTP_LOGIN');
                setErrorMessage(null);
                setOtpSent(false);
              }}
              className={`py-2 rounded-lg transition-all ${
                mode === 'OTP_LOGIN'
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Email OTP
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('PASSWORD_LOGIN');
                setErrorMessage(null);
              }}
              className={`py-2 rounded-lg transition-all ${
                mode === 'PASSWORD_LOGIN'
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Password
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('SIGNUP');
                setErrorMessage(null);
                setOtpSent(false);
              }}
              className={`py-2 rounded-lg transition-all ${
                mode === 'SIGNUP'
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Register
            </button>
          </div>
        )}

        {/* Feedback Alerts */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-800 dark:text-red-300 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
            <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Sandbox Code Helper (when no external SMTP configured) */}
        {otpSandboxPreview && (
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-blue-600" />
              <span>Sandbox Test Code: <strong>{otpSandboxPreview}</strong></span>
            </div>
            <button
              type="button"
              onClick={() => {
                const chars = otpSandboxPreview.split('');
                setOtpDigits(chars);
              }}
              className="text-[11px] font-bold text-blue-600 underline hover:text-blue-700"
            >
              Autofill Code
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODE 1: PASSWORDLESS EMAIL OTP (LOGIN OR REGISTRATION) */}
        {/* ======================================================== */}
        {(mode === 'OTP_LOGIN' || mode === 'SIGNUP') && (
          <form onSubmit={handleVerifyOtpAndContinue} className="space-y-4">
            {mode === 'SIGNUP' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Student Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aman Yadav"
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Email Address with Send OTP inline button */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Address *
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleSendOtp(mode === 'SIGNUP' ? 'REGISTER' : 'LOGIN')}
                  disabled={otpSending || resendCountdown > 0 || !email}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
                    resendCountdown > 0
                      ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm active:scale-95'
                  }`}
                >
                  {otpSending ? 'Sending...' : otpSent ? 'Resend' : 'Send OTP'}
                </button>
              </div>
              {resendCountdown > 0 && (
                <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>Resend available in {resendCountdown}s</span>
                </p>
              )}
            </div>

            {/* 6-Digit OTP Box Interface */}
            {otpSent && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Enter 6-Digit Email Verification Code
                  </label>
                  <span className="text-[11px] text-emerald-600 font-semibold">
                    Valid for 10 Mins
                  </span>
                </div>

                <div className="flex justify-between gap-2 on-paste" onPaste={handleOtpPaste}>
                  {otpDigits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        otpInputsRef.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-11 sm:w-12 h-12 text-center text-lg sm:text-xl font-black rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Registration Optional Details */}
            {mode === 'SIGNUP' && (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full text-xs py-2 px-3 rounded-xl border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="General">General (OPEN)</option>
                    <option value="OBC-NCL">OBC-NCL</option>
                    <option value="EWS">GEN-EWS</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Target Branch / Institute
                  </label>
                  <input
                    type="text"
                    value={targetCollege}
                    onChange={(e) => setTargetCollege(e.target.value)}
                    placeholder="e.g. NIT Trichy CSE"
                    className="w-full text-xs py-2 px-3 rounded-xl border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            )}

            {/* Terms of Service & Privacy Agreement */}
            <div className="pt-2 text-[11px] text-slate-500 leading-relaxed">
              By continuing, you agree to our{' '}
              <button
                type="button"
                onClick={() => setShowLegalModal('TERMS')}
                className="text-blue-600 underline font-medium hover:text-blue-700"
              >
                Terms of Service
              </button>{' '}
              and{' '}
              <button
                type="button"
                onClick={() => setShowLegalModal('PRIVACY')}
                className="text-blue-600 underline font-medium hover:text-blue-700"
              >
                Privacy Policy
              </button>.
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !otpSent || otpDigits.join('').length !== 6}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] ${
                !otpSent || otpDigits.join('').length !== 6
                  ? 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/25'
              }`}
            >
              {loading ? (
                <span>Verifying Code...</span>
              ) : (
                <>
                  <span>Verify and Continue</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* ======================================================== */}
        {/* MODE 2: PASSWORD LOGIN */}
        {/* ======================================================== */}
        {mode === 'PASSWORD_LOGIN' && (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => { setMode('FORGOT'); setErrorMessage(null); }}
                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-700"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              {loading ? <span>Signing In...</span> : <span>Sign In to Dashboard</span>}
            </button>
          </form>
        )}

        {/* ======================================================== */}
        {/* MODE 3: FORGOT PASSWORD */}
        {/* ======================================================== */}
        {mode === 'FORGOT' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Enter Registered Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleSendOtp('RESET_PASSWORD')}
              disabled={otpSending || !email}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
            >
              {otpSending ? 'Sending Reset Code...' : 'Send Password Reset Code'}
            </button>

            <button
              type="button"
              onClick={() => { setMode('OTP_LOGIN'); setErrorMessage(null); }}
              className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-center"
            >
              ← Back to Sign In
            </button>
          </div>
        )}

        {/* Quick Testing Accounts */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Quick Testing Accounts
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickDemo('student@jeepyq.com', 'student123')}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 text-slate-700 dark:text-slate-300 transition-colors"
            >
              Demo Student (Aman Yadav)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin@jeepyq.com', 'admin123')}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-purple-50 text-slate-700 dark:text-slate-300 transition-colors"
            >
              Administrator (admin@jeepyq.com)
            </button>
          </div>
        </div>
      </div>

      {/* Security & Authentication Infrastructure Information */}
      <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/50 text-xs text-slate-500 space-y-2">
        <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Server-Side Authentication & Verification Security</span>
        </div>
        <p className="leading-relaxed">
          One-time codes (OTP) and test submissions are validated strictly on the server backend with rate limiting, 10-minute expiry windows, and replay prevention. Private test results and payment records are protected by JWT cryptographic sessions.
        </p>
      </div>

      {/* Legal Modal (Terms of Service / Privacy Policy) */}
      {showLegalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {showLegalModal === 'TERMS' ? 'Terms of Service' : 'Privacy Policy'}
              </h3>
              <button
                onClick={() => setShowLegalModal(null)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-400 space-y-3 leading-relaxed">
              {showLegalModal === 'TERMS' ? (
                <>
                  <p>
                    <strong>1. Platform Purpose:</strong> JEE PYQ 30 Test Series is an independent online preparation portal created to help engineering aspirants practice Joint Entrance Examination (Main) Paper 1 through authentic Computer-Based Test (CBT) simulations.
                  </p>
                  <p>
                    <strong>2. Student Account:</strong> Each student is responsible for safeguarding their login credentials and verified email address. One account per candidate is permitted.
                  </p>
                  <p>
                    <strong>3. Fair Exam Policy:</strong> Candidates agree to take mock examinations honestly without utilizing automated solvers during timed CBT sessions.
                  </p>
                  <p>
                    <strong>4. Membership Passes:</strong> Membership plans provide unrestricted access to mock tests, solutions, and analytics for the specified validity period.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <strong>1. Data Protection:</strong> We only collect candidate name, email address, test responses, and payment order receipts necessary to evaluate exams and dispatch scorecards.
                  </p>
                  <p>
                    <strong>2. Email Notifications:</strong> Your verified email is utilized strictly for system notifications: 6-digit authentication codes and automated test result summaries.
                  </p>
                  <p>
                    <strong>3. Security:</strong> Passwords are cryptographically hashed using salted bcrypt, and payment transactions are processed through RBI-compliant 256-bit SSL encrypted gateways.
                  </p>
                </>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowLegalModal(null)}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

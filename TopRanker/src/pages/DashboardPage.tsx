import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Award, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  RotateCcw, 
  FileText, 
  ArrowRight,
  Target,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Lock,
  Unlock,
  Calendar,
  LogOut,
  UserCheck,
  PlayCircle,
  Mail,
  Printer,
  ChevronRight,
  Layers,
  HelpCircle
} from 'lucide-react';
import { storage } from '../services/storage.ts';
import type { PaymentRecord, TestAttempt, StudentAnalyticsSummary } from '../types.ts';
import { ReceiptModal } from '../components/ReceiptModal.tsx';

interface DashboardPageProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const [user, setUser] = useState(storage.getAuthUser());
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentRecord | null>(null);
  const [attempts, setAttempts] = useState<TestAttempt[]>(storage.getAttemptHistory());
  const [analytics, setAnalytics] = useState<StudentAnalyticsSummary | null>(null);
  const [activeAttempt, setActiveAttempt] = useState<TestAttempt | null>(storage.getActiveAttempt());
  const [resendingEmailId, setResendingEmailId] = useState<string | null>(null);
  const [emailStatusMsg, setEmailStatusMsg] = useState<string | null>(null);

  const isPremium = storage.isPremiumMember();
  const isLoggedIn = storage.isLoggedIn();

  useEffect(() => {
    // 1. Sync session from server
    storage.syncSession().then(synced => {
      if (synced) setUser(synced);
    });

    // 2. Sync attempts from server
    storage.syncAttemptsWithServer().then(syncedAttempts => {
      setAttempts(syncedAttempts);
    });

    // 3. Fetch calculated real analytics from server
    storage.fetchStudentAnalytics().then(data => {
      if (data) setAnalytics(data);
    });

    // 4. Check active unfinished attempt
    setActiveAttempt(storage.getActiveAttempt());

    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    const token = storage.getAuthToken();
    if (!token) {
      setPayments(storage.getLocalPayments());
      return;
    }

    try {
      const res = await fetch('/api/payment/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.payments) {
          setPayments(data.payments);
        }
      } else {
        setPayments(storage.getLocalPayments());
      }
    } catch {
      setPayments(storage.getLocalPayments());
    }
  };

  const handleLogout = () => {
    storage.logout();
    onNavigate('home');
  };

  const handleResendEmail = async (attemptId: string) => {
    const token = storage.getAuthToken();
    if (!token) return;

    setResendingEmailId(attemptId);
    setEmailStatusMsg(null);

    try {
      const res = await fetch(`/api/student/resend-result-email/${attemptId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setEmailStatusMsg(`Result summary email sent to ${user.email}!`);
        // Refresh attempts
        const refreshed = await storage.syncAttemptsWithServer();
        setAttempts(refreshed);
      } else {
        setEmailStatusMsg(data.error || 'Could not send email.');
      }
    } catch {
      setEmailStatusMsg('Network error while requesting email resend.');
    } finally {
      setResendingEmailId(null);
    }
  };

  const membershipExpiryDate = user.membership?.validUntil
    ? new Date(user.membership.validUntil).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    : 'No Expiry';

  // Fallback metrics if server analytics are loading or computed locally
  const totalTests = attempts.length;
  const completedTests = attempts.filter(a => a.isSubmitted).length;
  const scores = attempts.map(a => a.scoreResult?.totalScore ?? 0);
  const avgScore = totalTests > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / totalTests) : 0;
  const maxScore = totalTests > 0 ? Math.max(...scores, 0) : 0;
  const latestAttempt = attempts[0];
  const currentPercentile = latestAttempt?.scoreResult?.percentileEstimate ?? 50.0;
  const predictedRank = latestAttempt?.scoreResult?.estimatedRank ?? 700000;

  // Question counts
  const totalQuestionsAttempted = analytics?.totalQuestionsAttempted ?? 
    attempts.reduce((sum, a) => sum + (a.scoreResult?.totalAttempted ?? 0), 0);
  const totalQuestionsCorrect = analytics?.totalQuestionsCorrect ??
    attempts.reduce((sum, a) => sum + (a.scoreResult?.totalCorrect ?? 0), 0);
  const totalQuestionsIncorrect = analytics?.totalQuestionsIncorrect ??
    attempts.reduce((sum, a) => sum + (a.scoreResult?.totalIncorrect ?? 0), 0);
  const totalQuestionsUnanswered = analytics?.totalQuestionsUnanswered ??
    attempts.reduce((sum, a) => sum + (a.scoreResult?.totalUnattempted ?? 0), 0);
  const overallAccuracy = totalQuestionsAttempted > 0 
    ? Math.round((totalQuestionsCorrect / totalQuestionsAttempted) * 100) 
    : 0;

  const avgTimePerQuestion = analytics?.avgTimePerQuestionSeconds ?? 
    (totalQuestionsAttempted > 0 ? 120 : 0);

  // Subject analytics from server or calculated
  const phyAvg = analytics?.physics.scoreAvg ?? 
    (totalTests > 0 ? Math.round(attempts.reduce((s, a) => s + (a.scoreResult?.physics.score ?? 0), 0) / totalTests) : 0);
  const chemAvg = analytics?.chemistry.scoreAvg ?? 
    (totalTests > 0 ? Math.round(attempts.reduce((s, a) => s + (a.scoreResult?.chemistry.score ?? 0), 0) / totalTests) : 0);
  const mathAvg = analytics?.mathematics.scoreAvg ?? 
    (totalTests > 0 ? Math.round(attempts.reduce((s, a) => s + (a.scoreResult?.mathematics.score ?? 0), 0) / totalTests) : 0);

  // Chapters
  const strongChapters = analytics?.strongChapters || [];
  const weakChapters = analytics?.weakChapters || [];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Candidate Profile & Membership Status Banner */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-blue-500/20">
            {user.name.charAt(0)}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {user.name}
              </h1>
              {user.isEmailVerified && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  <CheckCircle className="h-3 w-3" />
                  <span>Verified Email</span>
                </span>
              )}
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                {user.category}
              </span>
              {user.role === 'admin' && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                  Administrator
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {user.email} · Target: <strong className="text-blue-600 dark:text-blue-400">{user.targetPercentile}%ile</strong> ({user.targetCollege})
            </p>
          </div>
        </div>

        {/* Membership Status Box */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="p-3.5 rounded-2xl border text-xs space-y-1 min-w-[210px] bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Membership Status
              </span>
              <span className={`inline-flex items-center gap-1 font-extrabold text-[11px] px-2 py-0.5 rounded-full ${
                isPremium 
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              }`}>
                {isPremium ? <CheckCircle className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                <span>{isPremium ? 'PREMIUM ACTIVE' : 'FREE TIER'}</span>
              </span>
            </div>
            <p className="font-bold text-slate-800 dark:text-slate-200 text-xs">
              {user.membership?.planName || 'Diagnostic Free Tier'}
            </p>
            <p className="text-[10px] text-slate-500">
              {isPremium ? `Valid until: ${membershipExpiryDate}` : 'Access: Tests 01 & 02'}
            </p>
          </div>

          <div className="flex flex-col gap-2 w-full sm:w-auto">
            {!isPremium ? (
              <button
                onClick={() => onNavigate('pricing')}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all whitespace-nowrap active:scale-[0.98]"
              >
                <Unlock className="h-4 w-4" />
                <span>Unlock All 30 Tests</span>
              </button>
            ) : (
              <button
                onClick={() => onNavigate('tests')}
                className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all whitespace-nowrap"
              >
                <Award className="h-4 w-4" />
                <span>All Tests Unlocked</span>
              </button>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('auth')}
                className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-center"
              >
                Account Settings
              </button>
              <button
                onClick={handleLogout}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 text-center"
                title="Log out"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Unfinished Test Quick Resume Banner (if an attempt is in-progress) */}
      {activeAttempt && !activeAttempt.isSubmitted && activeAttempt.timeRemainingSeconds > 0 && (
        <div className="rounded-2xl border-2 border-emerald-500/80 bg-emerald-50/90 p-5 dark:border-emerald-900 dark:bg-emerald-950/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
              <PlayCircle className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200">
                  Unfinished Exam in Progress
                </span>
                <span className="text-xs text-slate-500">
                  Time Remaining: {Math.floor(activeAttempt.timeRemainingSeconds / 60)} mins
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                {activeAttempt.testTitle.replace(/\s*\(.*?\)/g, '')}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                You have {Object.keys(activeAttempt.responses || {}).length} saved responses. Continue right where you paused.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              const slotMatch = activeAttempt.testId.match(/(\d+)/);
              const slot = slotMatch ? parseInt(slotMatch[1], 10) : 1;
              onNavigate('live-test', { slotNumber: slot });
            }}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all whitespace-nowrap active:scale-95"
          >
            <span>Resume Test Now</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Notification status message */}
      {emailStatusMsg && (
        <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs font-semibold text-blue-800 dark:text-blue-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-blue-600" />
            <span>{emailStatusMsg}</span>
          </div>
          <button onClick={() => setEmailStatusMsg(null)} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>
      )}

      {/* Primary Analytics Metric Grid (Calculated from Real Stored Tests) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tests Completed</p>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{completedTests}</p>
          <p className="text-[11px] text-slate-400">Total Attempts: {totalTests}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average Score</p>
          <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">{avgScore}</p>
          <p className="text-[11px] text-slate-400">Best: {maxScore} / 300</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overall Accuracy</p>
          <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{overallAccuracy}%</p>
          <p className="text-[11px] text-slate-400">{totalQuestionsCorrect} Correct / {totalQuestionsAttempted} Attempted</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Estimated Percentile</p>
          <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">{currentPercentile}%</p>
          <p className="text-[11px] text-slate-400">AIR ~{predictedRank.toLocaleString()}</p>
        </div>
      </div>

      {/* Mind Map Revision Hub Progress Banner */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-black flex-shrink-0">
            <Sparkles className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Syllabus Preparation
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold font-mono">
                {storage.getRevisedChapters().length} / 55 Chapters Revised
              </span>
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
              Mind Map Revision Hub
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Revise chapter-wise visual mind maps, 1-minute formulas, and speed shortcuts before your next mock test.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('mind-maps')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-sm cursor-pointer whitespace-nowrap self-start sm:self-auto"
        >
          <span>Open Mind Map Revision</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Detailed Question Distribution & Time Efficiency */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Question Performance Breakdown */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Cumulative Question Analytics
          </h2>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">Correct (+4)</span>
              <p className="text-2xl font-black text-emerald-600 mt-1">+{totalQuestionsCorrect}</p>
              <p className="text-[10px] text-emerald-700">+{totalQuestionsCorrect * 4} Marks</p>
            </div>
            <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900">
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-800 dark:text-red-300">Incorrect (−1)</span>
              <p className="text-2xl font-black text-red-600 mt-1">−{totalQuestionsIncorrect}</p>
              <p className="text-[10px] text-red-700">−{totalQuestionsIncorrect} Marks</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Unanswered</span>
              <p className="text-2xl font-black text-slate-700 dark:text-slate-300 mt-1">{totalQuestionsUnanswered}</p>
              <p className="text-[10px] text-slate-400">0 Penalty</p>
            </div>
          </div>
          <div className="pt-2 text-xs text-slate-500 leading-relaxed">
            Attempt Rate: <strong className="text-slate-800 dark:text-slate-200">
              {totalTests > 0 ? Math.round((totalQuestionsAttempted / (totalTests * 75)) * 100) : 0}%
            </strong> of total available questions attempted across mock papers.
          </div>
        </div>

        {/* Time Management Analysis */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Time Management & Speed Analysis
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400">Average Pace per Question:</span>
              <span className="font-extrabold text-slate-900 dark:text-white">{avgTimePerQuestion} seconds</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all ${
                  avgTimePerQuestion <= 144 ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
                style={{ width: `${Math.min(100, (avgTimePerQuestion / 180) * 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Official Target: <strong>144 seconds per question</strong> (180 mins / 75 questions). {avgTimePerQuestion <= 144 ? 'Your pacing leaves buffer time for review!' : 'Work on pacing for complex numericals.'}
            </p>
          </div>
        </div>
      </div>

      {/* Subject-Wise Mastery Radar / Bars */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-6">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
          Subject-Wise Average Score Balance (out of 100)
        </h2>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-blue-700 dark:text-blue-400">Physics Section</span>
              <span className="text-slate-800 dark:text-slate-200">{phyAvg} / 100 Marks</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
              <div 
                className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, Math.max(0, phyAvg))}%` }} 
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-emerald-700 dark:text-emerald-400">Chemistry Section</span>
              <span className="text-slate-800 dark:text-slate-200">{chemAvg} / 100 Marks</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-600 h-full rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, Math.max(0, chemAvg))}%` }} 
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-indigo-700 dark:text-indigo-400">Mathematics Section</span>
              <span className="text-slate-800 dark:text-slate-200">{mathAvg} / 100 Marks</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, Math.max(0, mathAvg))}%` }} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Strong & Weak Chapters Section (Calculated from Real Stored Results) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strong Chapters */}
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50/40 p-6 dark:border-emerald-950 dark:bg-emerald-950/20 space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            <h3 className="font-bold text-sm text-emerald-950 dark:text-emerald-200">
              Mastered Strong Chapters (Accuracy &ge; 70%)
            </h3>
          </div>
          {strongChapters.length > 0 ? (
            <ul className="space-y-2 text-xs">
              {strongChapters.map((ch, idx) => (
                <li key={idx} className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{ch.chapter}</span>
                  <span className="font-bold text-emerald-600">{ch.accuracy}% Acc</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500 leading-relaxed">
              Complete mock tests to generate high-accuracy mastered chapter rankings.
            </p>
          )}
        </div>

        {/* Weak Chapters */}
        <div className="rounded-3xl border border-amber-200 bg-amber-50/40 p-6 dark:border-amber-950 dark:bg-amber-950/20 space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <h3 className="font-bold text-sm text-amber-950 dark:text-amber-200">
              Weak Chapters Needing Revision (Accuracy &lt; 60%)
            </h3>
          </div>
          {weakChapters.length > 0 ? (
            <ul className="space-y-2 text-xs">
              {weakChapters.map((ch, idx) => (
                <li key={idx} className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 border border-amber-100 dark:border-amber-900">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{ch.chapter}</span>
                  <button
                    onClick={() => onNavigate('chapter-practice', { chapter: ch.chapter })}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-700 underline"
                  >
                    Drill PYQs →
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500 leading-relaxed">
              No critical weaknesses detected yet. Take full papers to pinpoint priority revision topics.
            </p>
          )}
        </div>
      </div>

      {/* Test Attempt History Table with Email Notification Status & Solutions */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Stored Test History & Scorecards
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review answers, step-by-step mathematical solutions, and email notification logs.
            </p>
          </div>
          <button
            onClick={() => onNavigate('tests')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            Start Another Test →
          </button>
        </div>

        {attempts.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs space-y-3">
            <p>No test attempts recorded yet. Start Test 01 to generate score progression analytics.</p>
            <button
              onClick={() => onNavigate('instructions', { slotNumber: 1 })}
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
            >
              Start Free Test 01
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase">
                <tr>
                  <th className="py-2.5 px-3">Test Paper</th>
                  <th className="py-2.5 px-3">Score (/300)</th>
                  <th className="py-2.5 px-3">Accuracy</th>
                  <th className="py-2.5 px-3">Percentile</th>
                  <th className="py-2.5 px-3">Email Report</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {attempts.map((att) => {
                  const res = att.scoreResult;
                  const emailStatus = att.emailNotificationStatus || res?.emailNotificationStatus;

                  return (
                    <tr key={att.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                        {att.testTitle.replace(/\s*\(.*?\)/g, '')}
                      </td>
                      <td className="py-2.5 px-3 font-extrabold text-blue-600 dark:text-blue-400">
                        {res?.totalScore ?? 0}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-emerald-600">
                        {res?.overallAccuracy ?? 0}%
                      </td>
                      <td className="py-2.5 px-3 font-bold text-cyan-600">
                        {res?.percentileEstimate ?? 50}%ile
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1.5">
                          {emailStatus === 'SENT' ? (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded">
                              ✓ Dispatched
                            </span>
                          ) : emailStatus === 'SANDBOX_LOGGED' ? (
                            <span className="text-[10px] font-bold text-blue-700 bg-blue-100 dark:bg-blue-950 dark:text-blue-300 px-2 py-0.5 rounded">
                              ✓ Verified
                            </span>
                          ) : (
                            <button
                              onClick={() => handleResendEmail(att.id)}
                              disabled={resendingEmailId === att.id}
                              className="text-[10px] font-bold text-blue-600 hover:underline"
                            >
                              {resendingEmailId === att.id ? 'Sending...' : 'Send to Email'}
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-right space-x-2">
                        <button
                          onClick={() => onNavigate('results', { attemptId: att.id })}
                          className="text-blue-600 hover:text-blue-700 font-bold"
                        >
                          Scorecard
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                          onClick={() => onNavigate('solutions', { attemptId: att.id })}
                          className="text-slate-600 hover:text-slate-900 dark:text-slate-400 font-semibold"
                        >
                          Solutions
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Tax Receipt Modal */}
      <ReceiptModal
        payment={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />
    </div>
  );
};

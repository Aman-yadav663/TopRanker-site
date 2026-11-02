import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Award, 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  Clock, 
  TrendingUp, 
  BarChart3, 
  RotateCcw, 
  FileText, 
  ArrowRight, 
  AlertTriangle,
  Sparkles,
  BookOpen,
  Mail,
  Printer
} from 'lucide-react';
import { storage } from '../services/storage';
import { TestResult, SubjectScore } from '../types';

interface ResultsPageProps {
  attemptId: string;
  onNavigate: (page: string, params?: Record<string, any>) => void;
  isAutoSubmit?: boolean;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({
  attemptId,
  onNavigate,
  isAutoSubmit = false
}) => {
  const attempt = storage.getAttemptById(attemptId);
  const result: TestResult | undefined = attempt?.scoreResult;
  const user = storage.getAuthUser();

  const [resendingEmail, setResendingEmail] = useState(false);
  const [emailStatusMsg, setEmailStatusMsg] = useState<string | null>(null);

  // Trigger celebration confetti if score >= 120
  useEffect(() => {
    if (result && result.totalScore >= 120) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Safe fallback if confetti isn't supported
      }
    }
  }, [result]);

  const handleResendEmail = async () => {
    const token = storage.getAuthToken();
    if (!token) return;

    setResendingEmail(true);
    setEmailStatusMsg(null);

    try {
      const res = await fetch(`/api/student/resend-result-email/${attemptId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setEmailStatusMsg(`Result summary scorecard successfully emailed to ${user.email}!`);
      } else {
        setEmailStatusMsg(data.error || 'Could not send email.');
      }
    } catch {
      setEmailStatusMsg('Network error while requesting email.');
    } finally {
      setResendingEmail(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!attempt || !result) {
    return (
      <div className="py-16 text-center space-y-4">
        <p className="text-base text-slate-600 dark:text-slate-400">
          Result not found or test has not been submitted yet.
        </p>
        <button
          onClick={() => onNavigate('tests')}
          className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold"
        >
          View All Tests
        </button>
      </div>
    );
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const renderSubjectCard = (name: string, data: SubjectScore, color: string) => {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-bold text-sm text-slate-900 dark:text-white">{name}</span>
          <span className={`text-sm font-extrabold ${color}`}>
            {data.score} / 100
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
          <div>
            <span className="text-slate-500">Correct:</span>{' '}
            <span className="font-bold text-emerald-600">+{data.correct * 4}</span> ({data.correct})
          </div>
          <div>
            <span className="text-slate-500">Wrong:</span>{' '}
            <span className="font-bold text-red-600">−{data.incorrect}</span> ({data.incorrect})
          </div>
          <div>
            <span className="text-slate-500">Left:</span>{' '}
            <span className="font-bold text-slate-600 dark:text-slate-400">{data.unattempted}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500">
          <span>Accuracy: <strong className="text-slate-800 dark:text-slate-200">{data.accuracy}%</strong></span>
          <span>Time: <strong className="text-slate-800 dark:text-slate-200">{formatDuration(data.timeSpentSeconds)}</strong></span>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-8">
      {/* Auto Submit Notification if applicable */}
      {isAutoSubmit && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
          <Clock className="h-4 w-4 flex-shrink-0" />
          <span>The 180-minute exam time expired and your test was automatically submitted and scored.</span>
        </div>
      )}

      {/* Main Score Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 sm:p-10 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
              Exam Scorecard & Analysis
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {result.testTitle.replace(/\s*\(.*?\)/g, '')}
            </h1>
            <p className="text-xs text-slate-300">
              Official Marking Scheme (+4, −1, 0) · Time Taken: {formatDuration(result.timeTakenSeconds)}
            </p>
          </div>

          {/* Large Score Circle */}
          <div className="flex items-center gap-6">
            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur border border-white/20 text-center min-w-[140px]">
              <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Total Score</p>
              <p className="text-4xl sm:text-5xl font-black text-white mt-1">
                {result.totalScore}
              </p>
              <p className="text-[11px] text-blue-200 mt-0.5">out of 300</p>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">NTA Percentile</p>
                <p className="text-2xl font-black text-cyan-300">
                  {result.percentileEstimate}%ile
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Predicted Rank (AIR)</p>
                <p className="text-sm font-bold text-emerald-300">
                  AIR ~{result.estimatedRank.toLocaleString()}
                </p>
                <p className="text-[10px] text-blue-200 font-medium">
                  {result.percentileEstimate >= 93.2 ? '✓ Qualified for JEE Advanced' : 'Target Cutoff: ~93.2%ile'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stat Pill Bar */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <p className="text-slate-400">Overall Accuracy</p>
            <p className="text-lg font-bold text-white mt-0.5">{result.overallAccuracy}%</p>
          </div>
          <div>
            <p className="text-slate-400">Questions Attempted</p>
            <p className="text-lg font-bold text-white mt-0.5">{result.totalAttempted} / 75</p>
          </div>
          <div>
            <p className="text-slate-400">Correct Answers</p>
            <p className="text-lg font-bold text-emerald-400 mt-0.5">+{result.totalCorrect} (+{result.totalCorrect * 4} Marks)</p>
          </div>
          <div>
            <p className="text-slate-400">Incorrect Answers</p>
            <p className="text-lg font-bold text-red-400 mt-0.5">−{result.totalIncorrect} (−{result.totalIncorrect} Marks)</p>
          </div>
        </div>
      </div>

      {/* Automated Email Summary Notification Status Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 flex items-center justify-center font-bold">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Automated Test Result Email
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Dispatched
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Scorecard breakdown and verified solutions link sent to <strong className="text-slate-800 dark:text-slate-200">{user.email}</strong>.
            </p>
          </div>
        </div>

        <button
          onClick={handleResendEmail}
          disabled={resendingEmail}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors whitespace-nowrap"
        >
          <RotateCcw className={`h-3.5 w-3.5 ${resendingEmail ? 'animate-spin' : ''}`} />
          <span>{resendingEmail ? 'Sending...' : 'Resend Email Summary'}</span>
        </button>
      </div>

      {emailStatusMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
          <span>{emailStatusMsg}</span>
          <button onClick={() => setEmailStatusMsg(null)} className="text-emerald-500 hover:text-emerald-700">✕</button>
        </div>
      )}

      {/* Action CTA Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900">
        <p className="text-xs sm:text-sm font-semibold text-blue-950 dark:text-blue-200">
          Want to examine every question, your selected option, and step-by-step mathematical solutions?
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('solutions', { attemptId })}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all active:scale-[0.98]"
          >
            <FileText className="h-4 w-4" />
            <span>Review Detailed Solutions</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
            title="Print or Save PDF report"
          >
            <Printer className="h-4 w-4" />
            <span>Print Scorecard</span>
          </button>
          <button
            onClick={() => onNavigate('tests')}
            className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-white dark:border-slate-700 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
          >
            All 30 Tests
          </button>
        </div>
      </div>

      {/* Subject-Wise Score Breakdown Cards */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
          Subject-Wise Performance Breakdown
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {renderSubjectCard('Physics (25 Questions)', result.physics, 'text-blue-600 dark:text-blue-400')}
          {renderSubjectCard('Chemistry (25 Questions)', result.chemistry, 'text-emerald-600 dark:text-emerald-400')}
          {renderSubjectCard('Mathematics (25 Questions)', result.mathematics, 'text-indigo-600 dark:text-indigo-400')}
        </div>
      </div>

      {/* Weak & Strong Chapters Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weak Topics */}
        <div className="rounded-2xl border border-red-200 bg-red-50/50 p-6 dark:border-red-950 dark:bg-red-950/20 space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <h3 className="font-bold text-sm text-red-950 dark:text-red-200">
              Priority Revision Areas (Accuracy &lt; 50%)
            </h3>
          </div>
          {result.weakChapters.length > 0 ? (
            <ul className="space-y-1.5 text-xs text-red-900 dark:text-red-300">
              {result.weakChapters.map((ch, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  <span>{ch}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-red-700 dark:text-red-300">
              Great job! You maintained high accuracy across all attempted topics.
            </p>
          )}
          <button
            onClick={() => onNavigate('mistakes')}
            className="mt-2 text-xs font-bold text-red-700 hover:text-red-800 dark:text-red-300 inline-flex items-center gap-1"
          >
            <span>Review in Mistake Notebook</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* Strong Topics */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 dark:border-emerald-950 dark:bg-emerald-950/20 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-bold text-sm text-emerald-950 dark:text-emerald-200">
              Mastered Chapters (Accuracy &ge; 75%)
            </h3>
          </div>
          {result.strongChapters.length > 0 ? (
            <ul className="space-y-1.5 text-xs text-emerald-900 dark:text-emerald-300">
              {result.strongChapters.map((ch, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>{ch}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-emerald-700 dark:text-emerald-300">
              Continue practicing to elevate chapters into mastery range.
            </p>
          )}
          <button
            onClick={() => onNavigate('chapter-practice')}
            className="mt-2 text-xs font-bold text-emerald-700 hover:text-emerald-800 dark:text-emerald-300 inline-flex items-center gap-1"
          >
            <span>Practice Chapter-Wise PYQs</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Chapter-Wise Performance Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white">
          Detailed Chapter-Wise Analysis
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase">
              <tr>
                <th className="py-2.5 px-3">Subject</th>
                <th className="py-2.5 px-3">Chapter</th>
                <th className="py-2.5 px-3">Questions</th>
                <th className="py-2.5 px-3">Attempted</th>
                <th className="py-2.5 px-3 text-emerald-600">Correct</th>
                <th className="py-2.5 px-3 text-red-600">Wrong</th>
                <th className="py-2.5 px-3">Accuracy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {result.chapterWiseAnalysis.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-2.5 px-3 font-semibold text-slate-700 dark:text-slate-300">{row.subject}</td>
                  <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-white">{row.chapter}</td>
                  <td className="py-2.5 px-3">{row.total}</td>
                  <td className="py-2.5 px-3">{row.attempted}</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-600">+{row.correct}</td>
                  <td className="py-2.5 px-3 font-bold text-red-600">−{row.incorrect}</td>
                  <td className="py-2.5 px-3 font-bold">
                    <span className={`px-2 py-0.5 rounded text-[11px] ${
                      row.accuracy >= 75 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                      row.accuracy >= 50 ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                      row.attempted > 0 ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' :
                      'text-slate-400'
                    }`}>
                      {row.attempted > 0 ? `${row.accuracy}%` : '—'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

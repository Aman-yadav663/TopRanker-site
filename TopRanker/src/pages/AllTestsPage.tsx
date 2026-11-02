import React, { useState } from 'react';
import { 
  Play, 
  Search, 
  CheckCircle, 
  Clock, 
  Award, 
  ShieldCheck, 
  RotateCcw, 
  FileCheck2,
  Layers,
  ArrowRight,
  Filter,
  Lock,
  Unlock,
  CreditCard,
  Sparkles
} from 'lucide-react';
import { TEST_CATALOG_METADATA } from '../data/mockTestsCatalog.ts';
import { storage } from '../services/storage.ts';

interface AllTestsPageProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const AllTestsPage: React.FC<AllTestsPageProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [premiumModalSlot, setPremiumModalSlot] = useState<number | null>(null);

  const attempts = storage.getAttemptHistory();
  const isPremium = storage.isPremiumMember();
  const isLoggedIn = storage.isLoggedIn();

  // Map of completed tests
  const completedMap: Record<number, { score: number; percentile: number; attemptId: string }> = {};
  for (const att of attempts) {
    const slot = parseInt(att.testId.replace('test-slot-', ''), 10);
    if (!isNaN(slot) && att.scoreResult) {
      completedMap[slot] = {
        score: att.scoreResult.totalScore,
        percentile: att.scoreResult.percentileEstimate,
        attemptId: att.id
      };
    }
  }

  const filteredTests = TEST_CATALOG_METADATA.filter(t => {
    const matchesCategory = 
      selectedCategory === 'ALL' || 
      t.category === selectedCategory;

    const matchesSearch = 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.shift.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.session.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `test ${t.slotNumber}`.includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleTestClick = (slotNumber: number) => {
    // Tests 1 & 2 are free trial
    if (slotNumber <= 2) {
      onNavigate('instructions', { slotNumber });
      return;
    }

    // Tests 3–30 require verified paid membership
    if (!isPremium) {
      setPremiumModalSlot(slotNumber);
      return;
    }

    onNavigate('instructions', { slotNumber });
  };

  return (
    <div className="space-y-8 py-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              JEE Main Paper 1 (B.E./B.Tech)
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-xs text-slate-500 font-medium">30 Full-Length Mock Papers</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            All 30 Full-Length PYQ Tests
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Each full-length test features 75 verified questions (25 Physics + 25 Chemistry + 25 Mathematics) with 20 MCQs and 5 Numerical questions, authentic marking (+4/−1), and an official 180-minute countdown timer.
          </p>
        </div>

        {/* Membership Status Badge & Upgrade CTA */}
        <div className="flex items-center gap-3">
          {!isPremium ? (
            <button
              onClick={() => onNavigate('pricing')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-md shadow-blue-500/20 hover:from-blue-500 hover:to-indigo-500 transition-all active:scale-95"
            >
              <Unlock className="h-4 w-4" />
              <span>Unlock All 30 Tests (₹499)</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 p-3 rounded-2xl text-xs font-bold text-emerald-800 dark:text-emerald-300">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              <span>Premium Pass Active · All 30 Tests Unlocked</span>
            </div>
          )}
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 max-w-fit overflow-x-auto">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === 'ALL'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            All 30 Tests
          </button>
          <button
            onClick={() => setSelectedCategory('CATEGORY_A_2025')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === 'CATEGORY_A_2025'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Category A (Tests 01–10)
          </button>
          <button
            onClick={() => setSelectedCategory('CATEGORY_B_2026')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === 'CATEGORY_B_2026'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Category B (Tests 11–20)
          </button>
          <button
            onClick={() => setSelectedCategory('CATEGORY_C_MIXED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === 'CATEGORY_C_MIXED'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Category C (Tests 21–30)
          </button>
        </div>

        {/* Search input */}
        <div className="relative min-w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search test number, session, or shift..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTests.map((test) => {
          const attempt = completedMap[test.slotNumber];
          const isCategoryA = test.category === 'CATEGORY_A_2025';
          const isCategoryB = test.category === 'CATEGORY_B_2026';
          const isFreeTest = test.slotNumber <= 2;
          const isLocked = !isFreeTest && !isPremium;

          return (
            <div
              key={test.slotNumber}
              className={`flex flex-col justify-between rounded-2xl border bg-white p-5 dark:bg-slate-900 shadow-sm transition-all group ${
                isLocked 
                  ? 'border-slate-200 dark:border-slate-800 hover:border-amber-300' 
                  : 'border-slate-200 dark:border-slate-800 hover:border-blue-400 hover:shadow-md'
              }`}
            >
              <div>
                {/* Header row: slot tag & status */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-slate-800 text-xs font-extrabold">
                      #{test.slotNumber < 10 ? `0${test.slotNumber}` : test.slotNumber}
                    </span>
                    <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      isCategoryA 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        : isCategoryB
                        ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                        : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                    }`}>
                      {isCategoryA ? 'Category A' : isCategoryB ? 'Category B' : 'Category C'}
                    </span>
                  </div>

                  {/* Free vs Premium Tag */}
                  {isFreeTest ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                      <span>Free Diagnostic</span>
                    </span>
                  ) : (
                    <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      isPremium 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {isPremium ? <Unlock className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                      <span>{isPremium ? 'Unlocked' : 'Premium Pass'}</span>
                    </span>
                  )}
                </div>

                {/* Title */}
                {/* Clean Title */}
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                  Full-Length Mock Test {test.slotNumber < 10 ? `0${test.slotNumber}` : test.slotNumber}
                </h3>

                {/* Exam Metadata */}
                <div className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                    <span>180 Minutes CBT · 300 Maximum Marks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Layers className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                    <span>25 Physics · 25 Chemistry · 25 Mathematics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                    <span>Section A (20 MCQs) + Section B (5 Numericals)</span>
                  </div>
                </div>

                {/* Exam Standards Notice */}
                <div className="mt-4 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-2">
                  <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-sky-400 flex-shrink-0 mt-0.5" />
                  <p className="line-clamp-2 leading-relaxed">
                    Official NTA Paper 1 marking format (+4 correct, −1 incorrect) with detailed step-by-step derivations.
                  </p>
                </div>

                {/* Attempt score box if attempted */}
                {attempt && (
                  <div className="mt-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-600 dark:text-slate-400">Latest Score:</span>{' '}
                      <span className="font-extrabold text-emerald-700 dark:text-emerald-400">{attempt.score} / 300</span>
                    </div>
                    <div>
                      <span className="text-slate-600 dark:text-slate-400">Percentile:</span>{' '}
                      <span className="font-bold text-blue-600 dark:text-blue-400">{attempt.percentile}%ile</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <button
                  onClick={() => handleTestClick(test.slotNumber)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold shadow-sm transition-all active:scale-[0.98] ${
                    isLocked 
                      ? 'bg-amber-600 hover:bg-amber-500 text-white'
                      : 'bg-blue-600 hover:bg-blue-500 text-white'
                  }`}
                >
                  {isLocked ? (
                    <>
                      <Lock className="h-3.5 w-3.5" />
                      <span>Unlock with Pass</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5 fill-current" />
                      <span>{attempt ? 'Retake Test' : 'Start Test'}</span>
                    </>
                  )}
                </button>

                {attempt && (
                  <button
                    onClick={() => onNavigate('solutions', { attemptId: attempt.attemptId, slotNumber: test.slotNumber })}
                    className="py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
                    title="View step-by-step solutions"
                  >
                    Solutions
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Premium Membership Gate Modal */}
      {premiumModalSlot !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 text-center">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center font-bold shadow-lg shadow-orange-500/20">
              <Lock className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                Premium Membership Pass
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Unlock Full-Length Test #{premiumModalSlot}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                Tests 03 through 30 contain authentic PYQs with verified NTA keys. Activate your membership pass via Razorpay to take this test under authentic CBT conditions.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left text-xs space-y-2">
              <p className="font-bold text-slate-800 dark:text-slate-200">Pass Benefits:</p>
              <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                <li>• All 30 Full-Length CBT Mock Tests</li>
                <li>• Step-by-step KaTeX mathematical derivations</li>
                <li>• Instant NTA Percentile & AIR Estimator</li>
                <li>• Personal Mistake Notebook & Re-attempt Engine</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setPremiumModalSlot(null);
                  onNavigate('pricing', { selectedPlanId: 'plan_crash_60d' });
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition-all active:scale-[0.98]"
              >
                <CreditCard className="h-4 w-4" />
                <span>View Plans & Purchase (from ₹499)</span>
              </button>
              <button
                onClick={() => setPremiumModalSlot(null)}
                className="py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
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

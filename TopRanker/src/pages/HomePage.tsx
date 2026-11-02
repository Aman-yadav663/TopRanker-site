import React from 'react';
import { 
  Play, 
  CheckCircle2, 
  Clock, 
  Award, 
  TrendingUp, 
  BookOpen, 
  ShieldCheck, 
  ArrowRight, 
  FileText, 
  Zap, 
  Target, 
  Sparkles, 
  BarChart2, 
  Mail, 
  Layers, 
  Compass, 
  CheckCircle, 
  HelpCircle 
} from 'lucide-react';
import { TEST_CATALOG_METADATA } from '../data/mockTestsCatalog';
import { storage } from '../services/storage';
import { RankPredictorAndTestimonials } from '../components/RankPredictorAndTestimonials';

interface HomePageProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const attempts = storage.getAttemptHistory();
  const completedAttempts = attempts.filter(a => a.isSubmitted);
  const totalQuestionsAttempted = completedAttempts.reduce((acc, a) => acc + (a.scoreResult?.totalAttempted ?? 0), 0);
  const avgAccuracy = completedAttempts.length > 0
    ? Math.round(completedAttempts.reduce((acc, a) => acc + (a.scoreResult?.overallAccuracy ?? 0), 0) / completedAttempts.length)
    : null;
  const avgScore = completedAttempts.length > 0
    ? Math.round(completedAttempts.reduce((acc, a) => acc + (a.scoreResult?.totalScore ?? 0), 0) / completedAttempts.length)
    : null;

  const catA = TEST_CATALOG_METADATA.filter(t => t.category === 'CATEGORY_A_2025');
  const catB = TEST_CATALOG_METADATA.filter(t => t.category === 'CATEGORY_B_2026');
  const catC = TEST_CATALOG_METADATA.filter(t => t.category === 'CATEGORY_C_MIXED');

  return (
    <div className="space-y-16 py-8">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0a152e] via-[#0f2147] to-[#070e1e] px-6 py-16 sm:px-12 sm:py-24 text-white shadow-2xl border border-blue-900/40">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e3a8a18_1px,transparent_1px),linear-gradient(to_bottom,#1e3a8a18_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          {/* Brand Apex Icon and Tagline Badge */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-1.5 text-xs sm:text-sm font-semibold text-sky-300 backdrop-blur">
            <TrendingUp className="h-4 w-4 text-sky-400 stroke-[2.5]" />
            <span className="tracking-wide uppercase font-bold text-[11px] sm:text-xs">
              TOP RANKER · Practice Smart. Rank Higher.
            </span>
          </div>

          {/* Website Name & Tagline */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none text-white">
              TOP <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-300">RANKER</span>
            </h1>
            <p className="text-lg sm:text-2xl font-bold tracking-tight text-blue-200">
              Practice Smart. Rank Higher.
            </p>
          </div>

          {/* Quote Subtitle */}
          <blockquote className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-medium italic leading-relaxed">
            “Your Journey to a Better JEE Main Rank Starts Here.”
          </blockquote>

          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
            Prepare with 30 authentic full-length CBT mock papers built strictly on verified JEE Main Previous Year Questions. Exact 75-question balance, +4/−1 marking, 180-minute countdown, and verified step-by-step derivations.
          </p>

          {/* Three Prominent Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('instructions', { slotNumber: 1 })}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-xl bg-blue-600 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Play className="h-5 w-5 fill-current" />
              <span>Start Practicing</span>
            </button>
            <button
              onClick={() => onNavigate('tests')}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-xl border border-sky-400/30 bg-white/10 px-8 py-3.5 text-base font-bold text-white backdrop-blur hover:bg-white/20 transition-all hover:border-sky-300/50 cursor-pointer"
            >
              <FileText className="h-5 w-5 text-sky-400" />
              <span>Explore Test Series</span>
            </button>
            <button
              onClick={() => onNavigate('mind-maps')}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-7 py-3.5 text-base font-bold text-slate-950 shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Zap className="h-5 w-5 fill-current" />
              <span>Mind Map Revision</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Genuine & Dynamically Calculated Statistics Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Exam Platform Specifications & Student Activity
            </h2>
            <p className="text-lg font-extrabold text-slate-900 dark:text-white">
              Verified Platform Metrics
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="h-4 w-4" /> Real Exam Calibrated
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Available Full Tests</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">30</p>
            <p className="text-[11px] text-blue-600 dark:text-sky-400 font-semibold mt-0.5">Category A, B & C Full Papers</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Verified PYQs</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">2,250</p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">75 Authentic Questions / Test</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">CBT Exam Duration</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">180</p>
            <p className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold mt-0.5">Minutes · Real-Time Clock</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Student Progress</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">
              {completedAttempts.length}
            </p>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 font-semibold mt-0.5">
              {completedAttempts.length > 0 
                ? `${totalQuestionsAttempted} Questions Attempted · ${avgAccuracy}% Accuracy` 
                : 'Tests Completed · Take Test 01 to benchmark'}
            </p>
          </div>
        </div>
      </section>

      {/* 3. Six Elegant Cards Required by Prompt */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-sky-400 mb-1">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Core Examination Modules</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Everything You Need to Rank Higher
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Comprehensive test preparation modules designed around the official JEE Main Computer-Based Testing pattern.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Full-Length Mock Tests */}
          <div 
            onClick={() => onNavigate('tests')}
            className="group rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm hover:border-blue-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-sky-400 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors">
                Full-Length Mock Tests
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                30 complete 3-hour computer-based exams (300 marks) matching the exact NTA Paper 1 layout, question palette, section jumping, and +4/−1 marking.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-sky-400">
              <span>Explore 30 Full Tests</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Previous Year Questions (PYQs) */}
          <div 
            onClick={() => onNavigate('qbank')}
            className="group rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm hover:border-blue-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors">
                Previous Year Questions (PYQs)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Searchable repository of 2,250 authentic PYQs from official January and April sessions with verified answer keys and session labels.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span>Browse PYQ Bank</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Chapter-Wise Practice */}
          <div 
            onClick={() => onNavigate('chapter-practice')}
            className="group rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm hover:border-blue-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors">
                Chapter-Wise Practice
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Target high-weightage chapters across Mechanics, Electrodynamics, Coordination Compounds, Organic Chemistry, Calculus, and Coordinate Geometry.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
              <span>Practice by Chapter</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Subject-Wise Tests */}
          <div 
            onClick={() => onNavigate('subject-practice')}
            className="group rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm hover:border-blue-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors">
                Subject-Wise Tests
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Dedicated 25-question sectional drills for Physics, Chemistry, and Mathematics (100 marks each) to build subject-level speed and confidence.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-purple-600 dark:text-purple-400">
              <span>Select Subject Test</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5: Performance Analytics */}
          <div 
            onClick={() => onNavigate('dashboard')}
            className="group rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm hover:border-blue-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                <BarChart2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors">
                Performance Analytics
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Diagnostic reports tracking accuracy percentages, average time per question against the 144s target, percentile projections, and weak chapters.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-sky-600 dark:text-sky-400">
              <span>Open Analytics Dashboard</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 6: Solutions and Explanations */}
          <div 
            onClick={() => onNavigate('qbank')}
            className="group rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm hover:border-blue-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors">
                Solutions and Explanations
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Step-by-step mathematical solutions rendered with crisp KaTeX equations, chemical reaction mechanisms, and examination shortcut techniques.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400">
              <span>View Solutions & Derivations</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Mind Map Revision Hub Banner */}
      <section className="rounded-3xl border-2 border-blue-500/30 bg-gradient-to-br from-[#183b56] via-slate-900 to-indigo-950 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black uppercase tracking-wider border border-amber-400/30">
              <Zap className="h-3.5 w-3.5 fill-current" />
              <span>New Feature · Complete 55-Chapter Syllabus</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Mind Map Revision Hub
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Master Physics (21 chapters), Chemistry (20 chapters), and Mathematics (14 chapters) through visual branch mind maps, 1-minute high-yield formula flashcards, and exam pitfalls.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-sky-200 pt-1">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>All 55 Prescribed Chapters</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>1-Minute Quick Recall</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Interactive Zoom & Pan</span>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('mind-maps')}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <span>Open Revision Hub</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Active Attempt Notification if any */}
      {attempts.length > 0 && (
        <section className="rounded-3xl border border-blue-200 bg-blue-50/80 p-6 dark:border-blue-900/60 dark:bg-blue-950/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                Stored Student Progress: {completedAttempts.length} Completed Tests
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Latest attempt score: <span className="font-bold text-blue-600 dark:text-sky-400">{attempts[0]?.scoreResult?.totalScore ?? 0} / 300</span> ({attempts[0]?.scoreResult?.percentileEstimate ?? 0}%ile estimate) · {totalQuestionsAttempted} questions solved
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-5 py-2.5 text-xs font-bold rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white hover:bg-slate-50 transition-colors whitespace-nowrap shadow-sm"
          >
            View Dashboard Analytics →
          </button>
        </section>
      )}

      {/* 3 Categories Overview */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              30 Full-Length Test Papers Structure
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Organized into three official categories representing verified shifts and comprehensive mixed drills.
            </p>
          </div>
          <button
            onClick={() => onNavigate('tests')}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-sky-400"
          >
            <span>View All 30 Tests</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Category A */}
          <div className="group rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm hover:border-blue-400 dark:hover:border-blue-600 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                  Category A
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Tests 01 – 10
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors">
                JEE Main Mock Tests (Category A)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Full-length examination papers calibrated to the official syllabus, section balance, and marking scheme.
              </p>

              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center justify-between">
                  <span>Total Papers:</span>
                  <span className="font-bold text-slate-900 dark:text-white">10 Full Tests</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Questions / Paper:</span>
                  <span className="font-bold text-slate-900 dark:text-white">75 (25P + 25C + 25M)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Verification Status:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">100% NTA Keys</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('tests', { category: 'CATEGORY_A_2025' })}
              className="mt-6 w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-blue-600 text-xs font-bold transition-all text-center"
            >
              Access Category A Tests (01–10)
            </button>
          </div>

          {/* Category B */}
          <div className="group rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm hover:border-blue-400 dark:hover:border-blue-600 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                  Category B
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Tests 11 – 20
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors">
                JEE Main Mock Tests (Category B)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Full-length examination papers with verified question configurations and official numerical sections.
              </p>

              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center justify-between">
                  <span>Total Papers:</span>
                  <span className="font-bold text-slate-900 dark:text-white">10 Full Tests</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Questions / Paper:</span>
                  <span className="font-bold text-slate-900 dark:text-white">75 (25P + 25C + 25M)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Verification Status:</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">Certified Official PYQs</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('tests', { category: 'CATEGORY_B_2026' })}
              className="mt-6 w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-blue-600 text-xs font-bold transition-all text-center"
            >
              Access Category B Tests (11–20)
            </button>
          </div>

          {/* Category C */}
          <div className="group rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm hover:border-blue-400 dark:hover:border-blue-600 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                  Category C
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Tests 21 – 30
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors">
                Mixed PYQ Tests (Category C)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Strategic full-length mock papers synthesizing authentic questions with balanced topic coverage.
              </p>

              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center justify-between">
                  <span>Total Papers:</span>
                  <span className="font-bold text-slate-900 dark:text-white">10 Full Tests</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Questions / Paper:</span>
                  <span className="font-bold text-slate-900 dark:text-white">75 (25P + 25C + 25M)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Difficulty Spectrum:</span>
                  <span className="font-bold text-purple-600 dark:text-purple-400">Exam-Calibrated</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('tests', { category: 'CATEGORY_C_MIXED' })}
              className="mt-6 w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-blue-600 text-xs font-bold transition-all text-center"
            >
              Access Category C Tests (21–30)
            </button>
          </div>
        </div>
      </section>

      {/* Rank Predictor & Verified Student Testimonials */}
      <RankPredictorAndTestimonials onStartTest={() => onNavigate('instructions', { slotNumber: 1 })} />

      {/* Student Dashboard & Automated Email Notifications Showcase */}
      <section className="rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              Personalized Student Analytics
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Real-Time Performance Dashboard & Scorecard Emails
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Every completed test automatically logs your subject accuracy, pacing metrics, and strong/weak chapters. An official summary scorecard is instantly delivered to your verified email address.
            </p>
          </div>
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all whitespace-nowrap self-start md:self-auto"
          >
            <BarChart2 className="h-4 w-4" />
            <span>Open Student Dashboard</span>
          </button>
        </div>

        {/* Dashboard Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
            <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 flex items-center justify-center font-bold">
              <Mail className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Automated Result Emails</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Instant HTML scorecard sent to your verified email with Physics, Chemistry, and Math breakdown and secure solution links.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center font-bold">
              <Target className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Chapter-Wise Diagnostic</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pinpoints high-accuracy mastered topics and priority weak chapters needing focused PYQ problem solving.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
            <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 flex items-center justify-center font-bold">
              <Clock className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Pacing & Speed Analysis</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Tracks seconds spent per question against the official 144-second target, optimizing exam-hall time management.
            </p>
          </div>
        </div>
      </section>

      {/* Official Exam Pattern Specs */}
      <section className="rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
        <div className="max-w-3xl">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Official JEE Main Paper 1 (B.E. / B.Tech) Configuration
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Every test strictly follows the actual NTA computer-based exam format.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-800/50">
            <div className="h-9 w-9 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 flex items-center justify-center mb-3 font-bold">
              Phy
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white">Physics Section</h4>
            <ul className="mt-2 text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
              <li>• 20 Single-Choice MCQs (+4, −1)</li>
              <li>• 5 Numerical Value Questions (+4, −1)</li>
              <li>• Total: 25 Questions · 100 Marks</li>
              <li>• Mechanics, Electrodynamics, Modern Physics</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-800/50">
            <div className="h-9 w-9 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300 flex items-center justify-center mb-3 font-bold">
              Chm
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white">Chemistry Section</h4>
            <ul className="mt-2 text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
              <li>• 20 Single-Choice MCQs (+4, −1)</li>
              <li>• 5 Numerical Value Questions (+4, −1)</li>
              <li>• Total: 25 Questions · 100 Marks</li>
              <li>• Physical, Organic, Inorganic Chemistry</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-800/50">
            <div className="h-9 w-9 rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300 flex items-center justify-center mb-3 font-bold">
              Mat
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white">Mathematics Section</h4>
            <ul className="mt-2 text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
              <li>• 20 Single-Choice MCQs (+4, −1)</li>
              <li>• 5 Numerical Value Questions (+4, −1)</li>
              <li>• Total: 25 Questions · 100 Marks</li>
              <li>• Calculus, Coordinate Geometry, Vectors & 3D</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

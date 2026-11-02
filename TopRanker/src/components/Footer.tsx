import React from 'react';
import { ShieldCheck, Award, BookCheck, HelpCircle } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-slate-200 bg-slate-100/70 text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                TOP <span className="text-blue-600 dark:text-sky-400">RANKER</span>
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 font-semibold">
                JEE Main CBT Platform
              </span>
            </div>
            <p className="text-xs text-blue-600 dark:text-sky-400 font-bold uppercase tracking-wider">
              Practice Smart · Rank Higher
            </p>
            <p className="text-sm leading-relaxed max-w-md">
              TOP RANKER is an elite examination platform engineered exclusively for JEE Main B.E./B.Tech candidates. Featuring 30 authentic full-length mock tests strictly based on verified Previous Year Questions with official NTA answer keys, step-by-step derivations, and real-time CBT simulation.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                <ShieldCheck className="h-4 w-4" /> 100% Authentic PYQs
              </span>
              <span className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold">
                <Award className="h-4 w-4" /> Official Marking Scheme (+4, -1)
              </span>
              <span className="inline-flex items-center gap-1.5 text-purple-600 dark:text-purple-400 font-semibold">
                <BookCheck className="h-4 w-4" /> 180 Minutes CBT Engine
              </span>
            </div>
          </div>

          {/* Test Categories */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Test Categories
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => onNavigate('tests')} 
                  className="hover:text-blue-600 dark:hover:text-blue-400 text-left transition-colors"
                >
                  Category A: Tests 01–10
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('tests')} 
                  className="hover:text-blue-600 dark:hover:text-blue-400 text-left transition-colors"
                >
                  Category B: Tests 11–20
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('tests')} 
                  className="hover:text-blue-600 dark:hover:text-blue-400 text-left transition-colors"
                >
                  Category C: Tests 21–30
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('qbank')} 
                  className="hover:text-blue-600 dark:hover:text-blue-400 text-left transition-colors"
                >
                  Session & Shift-Wise Question Bank
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Practice & Legal */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Resources & About
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => onNavigate('mind-maps')} 
                  className="font-bold text-blue-600 dark:text-sky-400 hover:underline text-left transition-colors"
                >
                  Mind Map Revision Hub (55 Ch)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('subject-practice')} 
                  className="hover:text-blue-600 dark:hover:text-blue-400 text-left transition-colors"
                >
                  Subject Practice (Phy, Chem, Math)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('mistakes')} 
                  className="hover:text-blue-600 dark:hover:text-blue-400 text-left transition-colors"
                >
                  Mistake Notebook & Analysis
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('admin')} 
                  className="hover:text-blue-600 dark:hover:text-blue-400 text-left transition-colors"
                >
                  Admin Verification Studio
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('about')} 
                  className="hover:text-blue-600 dark:hover:text-blue-400 text-left transition-colors"
                >
                  About Platform & Disclaimer
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer bar */}
        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 text-xs leading-relaxed text-slate-500 dark:text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>
            © TOP RANKER. Practice Smart. Rank Higher. Exclusively for JEE Main B.E./B.Tech aspirants.
          </p>
          <p className="text-center md:text-right max-w-xl">
            Disclaimer: TOP RANKER is an independent educational preparatory platform. It is not affiliated with or endorsed by the National Testing Agency (NTA) or Ministry of Education.
          </p>
        </div>
      </div>
    </footer>
  );
};

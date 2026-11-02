import React, { useState } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  BarChart3, 
  Bookmark, 
  AlertCircle, 
  ShieldCheck, 
  Moon, 
  Sun, 
  Menu, 
  X,
  PlayCircle,
  HelpCircle,
  Settings,
  Layers,
  FileCheck,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { storage } from '../services/storage';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string, params?: Record<string, any>) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  activeTestSlot?: number | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  darkMode,
  onToggleDarkMode,
  activeTestSlot
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = storage.getAuthUser();
  const isLoggedIn = storage.isLoggedIn();
  const bookmarksCount = storage.getBookmarks().length;
  const mistakesCount = storage.getMistakes().length;

  const navItems = [
    { id: 'tests', label: 'All 30 Tests', icon: FileCheck },
    { id: 'mind-maps', label: 'Mind Map Revision', icon: Sparkles },
    { id: 'dashboard', label: 'Dashboard & Analytics', icon: BarChart3 },
    { id: 'qbank', label: 'PYQ Bank', icon: BookOpen },
    { id: 'subject-practice', label: 'Subject Practice', icon: Layers },
    { id: 'chapter-practice', label: 'Chapter Wise', icon: BookOpen },
    { id: 'pricing', label: 'Pricing & Plans', icon: HelpCircle },
    { id: 'mistakes', label: `Mistakes (${mistakesCount})`, icon: AlertCircle },
    { id: 'bookmarks', label: `Bookmarks (${bookmarksCount})`, icon: Bookmark },
    { id: 'admin', label: 'Admin Studio', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo and Brand */}
        <div 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-500 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <TrendingUp className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                TOP <span className="text-blue-600 dark:text-sky-400">RANKER</span>
              </span>
            </div>
            <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
              Practice Smart · Rank Higher
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action Icons & Profile */}
        <div className="flex items-center gap-3">
          {activeTestSlot && (
            <button
              onClick={() => onNavigate('live-test', { slotNumber: activeTestSlot })}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold animate-pulse shadow-sm"
              title="Return to ongoing exam"
            >
              <PlayCircle className="h-4 w-4" />
              <span>Resume Test #{activeTestSlot}</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('about')}
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Pattern & Authenticity Info"
          >
            <HelpCircle className="h-5 w-5" />
          </button>

          <button
            onClick={onToggleDarkMode}
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* Student Profile & Sign In */}
          {isLoggedIn ? (
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800 hover:opacity-80 transition-opacity"
              title="View Student Dashboard"
            >
              <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold ring-2 ring-blue-500/20">
                {user.name.charAt(0)}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-slate-900 dark:text-white leading-none">
                  {user.name}
                </p>
                <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">
                  {user.membership?.status === 'PREMIUM_ACTIVE' ? 'Pass Active' : 'Free Tier'}
                </p>
              </div>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('auth')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm transition-all"
            >
              <span>Sign In / OTP</span>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            aria-label="Open navigation menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 dark:border-slate-800 dark:bg-slate-900 space-y-1">
          {activeTestSlot && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('live-test', { slotNumber: activeTestSlot });
              }}
              className="w-full flex items-center justify-center gap-2 p-3 mb-2 rounded-lg bg-emerald-600 text-white text-sm font-bold"
            >
              <PlayCircle className="h-4 w-4" />
              <span>Resume Active Test #{activeTestSlot}</span>
            </button>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate(item.id);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-left ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-bold'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};

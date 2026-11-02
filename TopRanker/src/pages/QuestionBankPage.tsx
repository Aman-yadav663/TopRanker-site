import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ShieldCheck, 
  Bookmark, 
  BookmarkCheck, 
  ChevronDown, 
  ChevronUp,
  Layers,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { AUTHENTIC_PYQS } from '../data/authenticPyqs';
import { MathRenderer } from '../components/MathRenderer';
import { storage } from '../services/storage';
import { Subject, Question } from '../types';

interface QuestionBankPageProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const QuestionBankPage: React.FC<QuestionBankPageProps> = ({ onNavigate }) => {
  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});

  const customQuestions = storage.getCustomQuestions();
  const allBankQuestions: Question[] = [...AUTHENTIC_PYQS, ...customQuestions];

  const filteredQuestions = allBankQuestions.filter(q => {
    if (selectedYear !== 'ALL' && q.year.toString() !== selectedYear) return false;
    if (selectedSubject !== 'ALL' && q.subject !== selectedSubject) return false;
    if (selectedType !== 'ALL' && q.type !== selectedType) return false;

    if (searchQuery.trim()) {
      const s = searchQuery.toLowerCase();
      const matchText = q.questionText.toLowerCase().includes(s);
      const matchChapter = q.chapter.toLowerCase().includes(s);
      const matchSource = q.sourceReference.toLowerCase().includes(s);
      if (!matchText && !matchChapter && !matchSource) return false;
    }

    return true;
  });

  const toggleSolution = (id: string) => {
    setRevealedSolutions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Verified JEE Main PYQ Question Bank
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Browse authentic questions by Year, Session, Shift, and Chapter.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-xl bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold">
            {filteredQuestions.length} Questions Found
          </span>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Paper Series Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Paper Series
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="ALL">All Series Papers</option>
              <option value="2025">Category A Shifts</option>
              <option value="2026">Category B Shifts</option>
            </select>
          </div>

          {/* Subject Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="ALL">All Subjects</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Mathematics">Mathematics</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Question Format
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="ALL">All Types (MCQ + Numerical)</option>
              <option value="MCQ">Single Choice MCQ</option>
              <option value="NUMERICAL">Numerical Value</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search questions by formula, keywords, shift or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Questions list */}
      <div className="space-y-6">
        {filteredQuestions.map((q, idx) => {
          const isRevealed = revealedSolutions[q.id];
          const isBookmarked = storage.isBookmarked(q.id);

          return (
            <div
              key={q.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4"
            >
              {/* Top metadata */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                    {q.subject}
                  </span>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {q.chapter}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="text-xs text-slate-500">
                    {q.type === 'MCQ' ? 'Section A: Single Choice' : 'Section B: Numerical'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                    +4, −1
                  </span>
                  <button
                    onClick={() => {
                      if (isBookmarked) storage.removeBookmark(q.id);
                      else {
                        storage.addBookmark({
                          id: `bm-${Date.now()}`,
                          questionId: q.id,
                          subject: q.subject,
                          chapter: q.chapter,
                          year: q.year,
                          shift: q.shift,
                          savedAt: Date.now()
                        });
                      }
                    }}
                    className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                    title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Question'}
                  >
                    {isBookmarked ? <BookmarkCheck className="h-4 w-4 text-amber-600" /> : <Bookmark className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Question text */}
              <div className="text-sm sm:text-base font-medium text-slate-900 dark:text-slate-100 leading-relaxed">
                <MathRenderer content={q.questionText} />
              </div>

              {/* Options if MCQ */}
              {q.type === 'MCQ' && q.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {q.options.map((opt, optIdx) => {
                    const letter = String.fromCharCode(65 + optIdx);
                    const isCorrect = isRevealed && q.correctAnswer.charAt(0).toUpperCase() === letter;

                    return (
                      <div
                        key={letter}
                        className={`p-3 rounded-xl border text-xs sm:text-sm flex items-start gap-2.5 transition-colors ${
                          isCorrect
                            ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 font-semibold'
                            : 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold flex-shrink-0 ${
                          isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}>
                          {letter}
                        </span>
                        <div className="flex-1">
                          <MathRenderer content={opt} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Reveal Solution Toggle */}
              <div className="pt-2">
                <button
                  onClick={() => toggleSolution(q.id)}
                  className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  <span>{isRevealed ? 'Hide Official Solution & Answer Key' : 'Reveal Official Solution & Answer Key'}</span>
                  {isRevealed ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                {isRevealed && (
                  <div className="mt-3 p-4 rounded-xl border border-blue-100 bg-blue-50/50 dark:border-blue-950 dark:bg-blue-950/20 space-y-2 animate-fade-in">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Correct Answer:{' '}
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                        {q.correctAnswer}
                      </span>
                    </p>
                    <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed pt-1 border-t border-blue-200/50 dark:border-blue-900/50">
                      <MathRenderer content={q.detailedSolution} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

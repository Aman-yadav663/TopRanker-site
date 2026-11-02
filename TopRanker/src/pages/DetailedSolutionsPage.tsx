import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  Bookmark, 
  BookmarkCheck, 
  ShieldCheck, 
  Search, 
  Filter,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { storage } from '../services/storage';
import { getTestPaperBySlot } from '../data/mockTestsCatalog';
import { MathRenderer } from '../components/MathRenderer';
import { Question, Subject, TestAttempt } from '../types';

interface DetailedSolutionsPageProps {
  attemptId?: string;
  slotNumber?: number;
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const DetailedSolutionsPage: React.FC<DetailedSolutionsPageProps> = ({
  attemptId,
  slotNumber = 1,
  onNavigate
}) => {
  // If attemptId is provided, get attempt; otherwise load default slot test
  const attempt = attemptId ? storage.getAttemptById(attemptId) : null;
  const activeSlot = attempt ? parseInt(attempt.testId.replace('test-slot-', ''), 10) || slotNumber : slotNumber;
  const testPaper = getTestPaperBySlot(activeSlot);

  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const allQuestions: Question[] = [
    ...testPaper.physicsQuestions,
    ...testPaper.chemistryQuestions,
    ...testPaper.mathsQuestions
  ];

  const responses = attempt?.responses || {};

  const filteredQuestions = allQuestions.filter(q => {
    const resp = responses[q.id];
    const isAnswered = resp && resp.userAnswer && resp.userAnswer.trim() !== '';
    const isCorrect = resp?.isCorrect === true;
    const isIncorrect = isAnswered && !isCorrect;
    const isUnattempted = !isAnswered;

    // Filter by Subject
    if (selectedSubject !== 'ALL' && q.subject !== selectedSubject) return false;

    // Filter by Status
    if (selectedStatus === 'CORRECT' && !isCorrect) return false;
    if (selectedStatus === 'INCORRECT' && !isIncorrect) return false;
    if (selectedStatus === 'UNATTEMPTED' && !isUnattempted) return false;

    // Search query
    if (searchQuery.trim()) {
      const qText = q.questionText.toLowerCase();
      const chText = q.chapter.toLowerCase();
      const search = searchQuery.toLowerCase();
      if (!qText.includes(search) && !chText.includes(search)) return false;
    }

    return true;
  });

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-800">
        <button
          onClick={() => {
            if (attemptId) onNavigate('results', { attemptId });
            else onNavigate('tests');
          }}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{attemptId ? 'Back to Scorecard' : 'Back to Tests'}</span>
        </button>

        <div className="text-right">
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">
            Detailed Solutions: Full-Length Mock Test {activeSlot < 10 ? `0${activeSlot}` : activeSlot}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Official Answer Keys & Step-by-Step Derivations
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Subject Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-x-auto">
            {['ALL', 'Physics', 'Chemistry', 'Mathematics'].map(sub => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  selectedSubject === sub
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {sub === 'ALL' ? 'All Subjects (75)' : sub}
              </button>
            ))}
          </div>

          {/* Status Tabs if attempt exists */}
          {attempt && (
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
              <button
                onClick={() => setSelectedStatus('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                  selectedStatus === 'ALL' ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white' : 'text-slate-600'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedStatus('CORRECT')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                  selectedStatus === 'CORRECT' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600'
                }`}
              >
                Correct (+{attempt.scoreResult?.totalCorrect})
              </button>
              <button
                onClick={() => setSelectedStatus('INCORRECT')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                  selectedStatus === 'INCORRECT' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-600'
                }`}
              >
                Incorrect ({attempt.scoreResult?.totalIncorrect})
              </button>
              <button
                onClick={() => setSelectedStatus('UNATTEMPTED')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                  selectedStatus === 'UNATTEMPTED' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-600'
                }`}
              >
                Left ({attempt.scoreResult?.totalUnattempted})
              </button>
            </div>
          )}
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search questions by formula, keywords, or chapter..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Questions Solution List */}
      <div className="space-y-6">
        {filteredQuestions.length === 0 ? (
          <div className="p-12 text-center text-slate-500 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            No questions found matching your filter criteria.
          </div>
        ) : (
          filteredQuestions.map((q, idx) => {
            const resp = responses[q.id];
            const isAnswered = resp && resp.userAnswer && resp.userAnswer.trim() !== '';
            const isCorrect = resp?.isCorrect === true;
            const isBookmarked = storage.isBookmarked(q.id);

            return (
              <div
                key={q.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4"
              >
                {/* Question metadata header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                      {q.subject}
                    </span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {q.chapter}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-xs text-slate-500">
                      {q.type === 'MCQ' ? 'Section A (MCQ)' : 'Section B (Numerical)'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Attempt status badge */}
                    {attempt && (
                      <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : isAnswered
                          ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {isCorrect ? <CheckCircle className="h-3.5 w-3.5" /> : isAnswered ? <XCircle className="h-3.5 w-3.5" /> : null}
                        <span>{isCorrect ? '+4 Marks' : isAnswered ? '−1 Mark' : '0 Marks (Unattempted)'}</span>
                      </span>
                    )}

                    {/* Bookmark button */}
                    <button
                      onClick={() => {
                        if (isBookmarked) {
                          storage.removeBookmark(q.id);
                        } else {
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
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 text-slate-500"
                      title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Question'}
                    >
                      {isBookmarked ? <BookmarkCheck className="h-4 w-4 text-amber-600" /> : <Bookmark className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Question Text */}
                <div className="text-sm sm:text-base font-medium text-slate-900 dark:text-slate-100 leading-relaxed">
                  <MathRenderer content={q.questionText} />
                </div>

                {/* Options if MCQ */}
                {q.type === 'MCQ' && q.options && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    {q.options.map((opt, optIdx) => {
                      const letter = String.fromCharCode(65 + optIdx);
                      const isCorrectOpt = q.correctAnswer.charAt(0).toUpperCase() === letter;
                      const isUserChosen = resp?.userAnswer === letter;

                      let borderClass = 'border-slate-200 dark:border-slate-800';
                      let bgClass = 'bg-slate-50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200';

                      if (isCorrectOpt) {
                        borderClass = 'border-emerald-500 dark:border-emerald-500';
                        bgClass = 'bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 font-semibold';
                      } else if (isUserChosen && !isCorrectOpt) {
                        borderClass = 'border-red-500 dark:border-red-500';
                        bgClass = 'bg-red-50/80 dark:bg-red-950/40 text-red-950 dark:text-red-100';
                      }

                      return (
                        <div
                          key={letter}
                          className={`p-3 rounded-xl border text-xs sm:text-sm flex items-start gap-2.5 ${borderClass} ${bgClass}`}
                        >
                          <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold flex-shrink-0 ${
                            isCorrectOpt ? 'bg-emerald-600 text-white' : isUserChosen ? 'bg-red-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                          }`}>
                            {letter}
                          </span>
                          <div className="flex-1">
                            <MathRenderer content={opt} />
                          </div>
                          {isCorrectOpt && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900">
                              Correct Key
                            </span>
                          )}
                          {isUserChosen && !isCorrectOpt && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 dark:text-red-300 px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900">
                              Your Answer
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Answers Comparison Box */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div>
                    <span className="text-slate-500">Official Correct Answer:</span>{' '}
                    <strong className="text-emerald-600 dark:text-emerald-400 text-sm font-mono">{q.correctAnswer}</strong>
                  </div>

                  {resp && (
                    <div>
                      <span className="text-slate-500">Your Submitted Answer:</span>{' '}
                      <strong className={`text-sm font-mono ${isCorrect ? 'text-emerald-600' : isAnswered ? 'text-red-600' : 'text-slate-400'}`}>
                        {isAnswered ? resp.userAnswer : 'Not Attempted'}
                      </strong>
                    </div>
                  )}

                  {resp?.timeSpentSeconds ? (
                    <div>
                      <span className="text-slate-500">Time Spent:</span>{' '}
                      <strong className="text-slate-800 dark:text-slate-200 font-mono">{resp.timeSpentSeconds} seconds</strong>
                    </div>
                  ) : null}
                </div>

                {/* Detailed Step-by-Step Solution */}
                <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 dark:border-blue-950 dark:bg-blue-950/20 space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-blue-600" />
                    <span>Verified Step-by-Step Solution & Derivation:</span>
                  </h4>
                  <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                    <MathRenderer content={q.detailedSolution} />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

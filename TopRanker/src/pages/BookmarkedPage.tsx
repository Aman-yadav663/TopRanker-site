import React, { useState } from 'react';
import { Bookmark, Trash2, ShieldCheck, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { storage } from '../services/storage';
import { AUTHENTIC_PYQS } from '../data/authenticPyqs';
import { MathRenderer } from '../components/MathRenderer';
import { BookmarkItem, Question } from '../types';

interface BookmarkedPageProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const BookmarkedPage: React.FC<BookmarkedPageProps> = ({ onNavigate }) => {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(storage.getBookmarks());
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});

  const allQuestionsMap: Record<string, Question> = {};
  AUTHENTIC_PYQS.forEach(q => { allQuestionsMap[q.id] = q; });

  const handleRemove = (qId: string) => {
    storage.removeBookmark(qId);
    setBookmarks(storage.getBookmarks());
  };

  const toggleSolution = (id: string) => {
    setRevealedSolutions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bookmark className="h-5 w-5 text-amber-500 fill-amber-500" />
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Bookmarked Questions
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Important, tricky, or conceptual questions you saved for rapid revision before the examination.
          </p>
        </div>

        <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
          {bookmarks.length} Saved Questions
        </span>
      </div>

      {bookmarks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center dark:border-slate-800 space-y-3">
          <Bookmark className="h-10 w-10 text-slate-300 dark:text-slate-700 mx-auto" />
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            No Bookmarks Saved Yet
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click the bookmark icon on any question during test attempts, solutions review, or in the PYQ bank to save it here.
          </p>
          <button
            onClick={() => onNavigate('qbank')}
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
          >
            Explore Question Bank
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {bookmarks.map((b) => {
            const q = allQuestionsMap[b.questionId];
            if (!q) return null;
            const isRevealed = revealedSolutions[q.id];

            return (
              <div
                key={b.questionId}
                className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                      {q.subject}
                    </span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {q.chapter}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500 text-xs">{q.type === 'MCQ' ? 'MCQ' : 'Numerical'}</span>
                  </div>

                  <button
                    onClick={() => handleRemove(b.questionId)}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Remove</span>
                  </button>
                </div>

                <div className="text-sm sm:text-base font-medium text-slate-900 dark:text-slate-100 leading-relaxed">
                  <MathRenderer content={q.questionText} />
                </div>

                {q.type === 'MCQ' && q.options && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    {q.options.map((opt, optIdx) => {
                      const letter = String.fromCharCode(65 + optIdx);
                      const isCorrect = isRevealed && q.correctAnswer.charAt(0).toUpperCase() === letter;

                      return (
                        <div
                          key={letter}
                          className={`p-3 rounded-xl border text-xs sm:text-sm flex items-start gap-2.5 ${
                            isCorrect
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold'
                              : 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-xs font-bold flex-shrink-0">
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

                <div className="pt-2">
                  <button
                    onClick={() => toggleSolution(q.id)}
                    className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
                  >
                    <span>{isRevealed ? 'Hide Solution' : 'View Correct Answer & Derivation'}</span>
                    {isRevealed ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>

                  {isRevealed && (
                    <div className="mt-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm space-y-1">
                      <p className="font-bold text-emerald-600">Correct Answer: {q.correctAnswer}</p>
                      <MathRenderer content={q.detailedSolution} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

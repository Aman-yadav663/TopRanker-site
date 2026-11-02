import React, { useState } from 'react';
import { 
  AlertCircle, 
  Trash2, 
  RotateCcw, 
  ShieldCheck, 
  CheckCircle, 
  HelpCircle,
  Tag,
  BookOpen
} from 'lucide-react';
import { storage } from '../services/storage';
import { AUTHENTIC_PYQS } from '../data/authenticPyqs';
import { MathRenderer } from '../components/MathRenderer';
import { MistakeItem, Question } from '../types';

interface IncorrectPageProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const IncorrectPage: React.FC<IncorrectPageProps> = ({ onNavigate }) => {
  const [mistakes, setMistakes] = useState<MistakeItem[]>(storage.getMistakes());
  const [reattempts, setReattempts] = useState<Record<string, string>>({});
  const [reattemptFeedback, setReattemptFeedback] = useState<Record<string, boolean>>({});

  const allQuestionsMap: Record<string, Question> = {};
  AUTHENTIC_PYQS.forEach(q => { allQuestionsMap[q.id] = q; });

  const handleRemove = (qId: string) => {
    storage.removeMistake(qId);
    setMistakes(storage.getMistakes());
  };

  const handleTagReason = (qId: string, reason: MistakeItem['mistakeReason']) => {
    const item = mistakes.find(m => m.questionId === qId);
    if (item) {
      item.mistakeReason = reason;
      storage.recordMistake(item);
      setMistakes([...storage.getMistakes()]);
    }
  };

  const handleTestReattempt = (q: Question, option: string) => {
    setReattempts(prev => ({ ...prev, [q.id]: option }));
    const isCorrect = option === q.correctAnswer.charAt(0).toUpperCase();
    setReattemptFeedback(prev => ({ ...prev, [q.id]: isCorrect }));

    if (isCorrect) {
      setTimeout(() => {
        handleRemove(q.id);
      }, 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Mistake Notebook & Error Log
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Questions you missed during full-length tests are automatically tracked here. Tag the mistake root cause and re-attempt to solidify learning.
          </p>
        </div>

        <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300">
          {mistakes.length} Active Errors
        </span>
      </div>

      {mistakes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center dark:border-slate-800 space-y-3">
          <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto" />
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Your Mistake Notebook is Clean!
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Take more full-length mock tests to challenge yourself. Any missed questions will automatically be cataloged here for revision.
          </p>
          <button
            onClick={() => onNavigate('tests')}
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
          >
            Take a Mock Test
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {mistakes.map((m) => {
            const q = allQuestionsMap[m.questionId];
            if (!q) return null;

            const userChoice = reattempts[q.id];
            const isResolved = reattemptFeedback[q.id];

            return (
              <div
                key={m.questionId}
                className="rounded-2xl border border-red-200 bg-white p-6 dark:border-red-950/80 dark:bg-slate-900 shadow-sm space-y-4"
              >
                {/* Meta Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                      {q.subject}
                    </span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {q.chapter}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500">{m.testTitle.replace(/\s*\(.*?\)/g, '')}</span>
                  </div>

                  <button
                    onClick={() => handleRemove(m.questionId)}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Clear from Notebook</span>
                  </button>
                </div>

                {/* Error comparison banner */}
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="text-slate-500">Your Exam Answer:</span>{' '}
                    <strong className="text-red-600 dark:text-red-400 font-mono text-sm">{m.userAnswer}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Official Correct Answer:</span>{' '}
                    <strong className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">{m.correctAnswer}</strong>
                  </div>
                </div>

                {/* Root Cause Tagging */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Tag className="h-3 w-3" /> Error Cause:
                  </span>
                  {(['Calculation Error', 'Conceptual Gap', 'Misread Question', 'Guess / Panic'] as MistakeItem['mistakeReason'][]).map(r => (
                    <button
                      key={r}
                      onClick={() => handleTagReason(m.questionId, r)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                        m.mistakeReason === r
                          ? 'bg-red-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>

                {/* Question Text */}
                <div className="text-sm sm:text-base font-medium text-slate-900 dark:text-slate-100 leading-relaxed">
                  <MathRenderer content={q.questionText} />
                </div>

                {/* Re-attempt Options */}
                {q.type === 'MCQ' && q.options && (
                  <div className="space-y-2 pt-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Re-attempt this question now:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, optIdx) => {
                        const letter = String.fromCharCode(65 + optIdx);
                        const isChosen = userChoice === letter;

                        return (
                          <button
                            key={letter}
                            onClick={() => handleTestReattempt(q, letter)}
                            className={`p-3 rounded-xl border text-left text-xs sm:text-sm flex items-start gap-2.5 transition-all ${
                              isChosen
                                ? isResolved
                                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 font-bold'
                                  : 'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-900'
                                : 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40 hover:bg-slate-100 text-slate-800 dark:text-slate-200'
                            }`}
                          >
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-xs font-bold flex-shrink-0">
                              {letter}
                            </span>
                            <div className="flex-1">
                              <MathRenderer content={opt} />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {isResolved && (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-xs text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-2 animate-fade-in">
                    <CheckCircle className="h-4 w-4" />
                    <span>Correct! Concept rectified. Removing from mistake notebook...</span>
                  </div>
                )}

                {/* Solution */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm space-y-1">
                  <p className="font-bold text-slate-900 dark:text-white">Explanation & Key Takeaway:</p>
                  <MathRenderer content={q.detailedSolution} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

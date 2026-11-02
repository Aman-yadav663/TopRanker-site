import React, { useState } from 'react';
import { BookOpen, ShieldCheck, ChevronDown, ChevronUp, Layers, CheckCircle, Sparkles } from 'lucide-react';
import { AUTHENTIC_PYQS } from '../data/authenticPyqs';
import { MathRenderer } from '../components/MathRenderer';
import { Subject, Question } from '../types';

interface ChapterPracticePageProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const ChapterPracticePage: React.FC<ChapterPracticePageProps> = ({ onNavigate }) => {
  const [activeSubject, setActiveSubject] = useState<Subject>('Physics');
  
  // Extract distinct chapters for the active subject
  const subjectQuestions = AUTHENTIC_PYQS.filter(q => q.subject === activeSubject);
  const chapters = Array.from(new Set(subjectQuestions.map(q => q.chapter)));
  const [selectedChapter, setSelectedChapter] = useState<string>(chapters[0] || '');
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});

  const chapterQuestions = subjectQuestions.filter(q => q.chapter === (selectedChapter || chapters[0]));

  const toggleSolution = (id: string) => {
    setRevealedSolutions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Chapter-Wise PYQ Mastery
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Select any syllabus chapter to drill verified questions with complete derivations.
          </p>
        </div>
        <button
          onClick={() => onNavigate('mind-maps')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-sm transition-all cursor-pointer self-start sm:self-auto"
        >
          <Sparkles className="h-4 w-4" />
          <span>Mind Map Revision Hub</span>
        </button>
      </div>

      {/* Subject & Chapter Selectors */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
        {/* Subject Pills */}
        <div className="flex items-center gap-2">
          {(['Physics', 'Chemistry', 'Mathematics'] as Subject[]).map((sub) => (
            <button
              key={sub}
              onClick={() => {
                setActiveSubject(sub);
                const subQs = AUTHENTIC_PYQS.filter(q => q.subject === sub);
                const subChs = Array.from(new Set(subQs.map(q => q.chapter)));
                setSelectedChapter(subChs[0] || '');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSubject === sub
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        {/* Chapter Buttons Grid */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            Select {activeSubject} Chapter:
          </label>
          <div className="flex flex-wrap gap-2">
            {chapters.map(ch => {
              const isSelected = selectedChapter === ch;
              const count = subjectQuestions.filter(q => q.chapter === ch).length;
              return (
                <button
                  key={ch}
                  onClick={() => setSelectedChapter(ch)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <span>{ch}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-white/20 text-white dark:bg-black/20 dark:text-black' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Chapter Question List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {selectedChapter || chapters[0]} ({chapterQuestions.length} Questions)
          </h2>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <ShieldCheck className="h-4 w-4" /> 100% Authentic PYQs
          </span>
        </div>

        {chapterQuestions.map((q, idx) => {
          const isRevealed = revealedSolutions[q.id];

          return (
            <div
              key={q.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                  Question #{idx + 1} ({q.type})
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {selectedChapter}
                </span>
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
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 font-bold'
                            : 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-[11px] font-bold flex-shrink-0">
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
                  className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  <span>{isRevealed ? 'Hide Solution' : 'Reveal Answer Key & Derivation'}</span>
                  {isRevealed ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                {isRevealed && (
                  <div className="mt-3 p-4 rounded-xl border border-blue-100 bg-blue-50/50 dark:border-blue-950 dark:bg-blue-950/20 space-y-2 animate-fade-in">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Correct Answer: <strong className="font-mono text-emerald-600 text-sm">{q.correctAnswer}</strong>
                    </p>
                    <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed pt-1 border-t border-blue-200/50">
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

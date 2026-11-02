import React, { useState } from 'react';
import { 
  Layers, 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  ArrowRight, 
  ShieldCheck, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { AUTHENTIC_PYQS } from '../data/authenticPyqs';
import { MathRenderer } from '../components/MathRenderer';
import { Subject, Question } from '../types';

interface SubjectPracticePageProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const SubjectPracticePage: React.FC<SubjectPracticePageProps> = ({ onNavigate }) => {
  const [activeSubject, setActiveSubject] = useState<Subject>('Physics');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isChecked, setIsChecked] = useState(false);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });

  const questions = AUTHENTIC_PYQS.filter(q => q.subject === activeSubject);
  const currentQ: Question | undefined = questions[currentIdx] || questions[0];

  const handleSelect = (letter: string) => {
    if (isChecked) return;
    setSelectedOption(letter);
  };

  const handleCheck = () => {
    if (!selectedOption || !currentQ) return;
    setIsChecked(true);

    const isCorrect = selectedOption === currentQ.correctAnswer.charAt(0).toUpperCase();
    if (isCorrect) {
      setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      setScore(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
    }
  };

  const handleNext = () => {
    setSelectedOption('');
    setIsChecked(false);
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setCurrentIdx(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Subject-Wise Instant Drill
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Practice authentic JEE Main PYQs with immediate answer evaluation and complete explanations.
          </p>
        </div>

        {/* Score pill */}
        <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 px-3.5 py-1.5 rounded-xl text-xs font-bold">
          <span className="text-emerald-600 dark:text-emerald-400">+{score.correct * 4} Marks ({score.correct} Correct)</span>
          <span className="text-slate-300">|</span>
          <span className="text-red-600 dark:text-red-400">−{score.incorrect} Marks ({score.incorrect} Wrong)</span>
        </div>
      </div>

      {/* Subject Tabs */}
      <div className="flex items-center gap-2">
        {(['Physics', 'Chemistry', 'Mathematics'] as Subject[]).map((sub) => (
          <button
            key={sub}
            onClick={() => {
              setActiveSubject(sub);
              setCurrentIdx(0);
              setSelectedOption('');
              setIsChecked(false);
            }}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              activeSubject === sub
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {sub}
          </button>
        ))}
      </div>

      {/* Practice Question Card */}
      {currentQ ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {activeSubject} · Question {currentIdx + 1} of {questions.length}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {currentQ.chapter}
            </span>
          </div>

          <div className="text-base font-medium text-slate-900 dark:text-slate-100 leading-relaxed">
            <MathRenderer content={currentQ.questionText} />
          </div>

          {/* Options */}
          {currentQ.type === 'MCQ' && currentQ.options && (
            <div className="grid grid-cols-1 gap-3 pt-2">
              {currentQ.options.map((opt, optIdx) => {
                const letter = String.fromCharCode(65 + optIdx);
                const isSelected = selectedOption === letter;
                const isCorrect = isChecked && currentQ.correctAnswer.charAt(0).toUpperCase() === letter;
                const isWrong = isChecked && isSelected && !isCorrect;

                let border = 'border-slate-200 dark:border-slate-800';
                let bg = 'hover:bg-slate-50 dark:hover:bg-slate-800/60 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200';

                if (isCorrect) {
                  border = 'border-emerald-500';
                  bg = 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 font-semibold';
                } else if (isWrong) {
                  border = 'border-red-500';
                  bg = 'bg-red-50 dark:bg-red-950/40 text-red-950 dark:text-red-100';
                } else if (isSelected) {
                  border = 'border-blue-600';
                  bg = 'bg-blue-50 dark:bg-blue-950/40 text-blue-950 dark:text-blue-100 ring-2 ring-blue-500/20';
                }

                return (
                  <button
                    key={letter}
                    onClick={() => handleSelect(letter)}
                    className={`w-full flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${border} ${bg}`}
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-xs font-bold flex-shrink-0 mt-0.5">
                      {letter}
                    </span>
                    <div className="flex-1 text-sm sm:text-base">
                      <MathRenderer content={opt} />
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            {!isChecked ? (
              <button
                onClick={handleCheck}
                disabled={!selectedOption}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm disabled:opacity-40 transition-all"
              >
                Check Answer
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold ${
                  selectedOption === currentQ.correctAnswer.charAt(0).toUpperCase()
                    ? 'text-emerald-600'
                    : 'text-red-600'
                }`}>
                  {selectedOption === currentQ.correctAnswer.charAt(0).toUpperCase() ? 'Correct! (+4 Marks)' : `Incorrect (−1 Mark). Correct was ${currentQ.correctAnswer}`}
                </span>
              </div>
            )}

            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-slate-800 dark:hover:bg-slate-700 font-bold text-xs sm:text-sm transition-all"
            >
              <span>Next Question</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Solution revealed after check */}
          {isChecked && (
            <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 text-xs sm:text-sm leading-relaxed space-y-2 animate-fade-in">
              <p className="font-bold text-blue-900 dark:text-blue-300">Detailed Official Solution:</p>
              <MathRenderer content={currentQ.detailedSolution} />
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

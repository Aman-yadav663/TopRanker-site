import React from 'react';
import { 
  BookOpen, 
  Lightbulb, 
  CheckCircle2, 
  HelpCircle, 
  Printer, 
  FileText,
  Sparkles
} from 'lucide-react';
import type { DetailedTopicNote } from '../types.ts';
import { MathRenderer } from './MathRenderer.tsx';

interface DetailedNotesViewerProps {
  chapterTitle: string;
  subject: string;
  notes: DetailedTopicNote[];
}

export const DetailedNotesViewer: React.FC<DetailedNotesViewerProps> = ({
  chapterTitle,
  subject,
  notes
}) => {
  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-sky-400/20 text-sky-300 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Deep Dive Academic Notes</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            {chapterTitle} — Complete Theory & Derivations
          </h3>
          <p className="text-xs text-sky-200">
            {notes.length} comprehensive conceptual modules designed for in-depth JEE Main revision.
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer shadow-sm"
        >
          <Printer className="h-4 w-4" />
          <span>Print Notes</span>
        </button>
      </div>

      {/* Modules List */}
      <div className="space-y-6">
        {notes.map((module, idx) => (
          <div 
            key={idx}
            className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="h-7 w-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-sky-400 flex items-center justify-center font-black text-xs">
                  {idx + 1}
                </span>
                <h4 className="text-lg font-black text-slate-900 dark:text-white">
                  {module.title}
                </h4>
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Core Module
              </span>
            </div>

            {/* Summary */}
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {module.summary}
            </p>

            {/* Derivation Snippet if available */}
            {module.derivationSnippet && (
              <div className="space-y-2 pt-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-blue-500" />
                  <span>Mathematical Derivation / Proof:</span>
                </span>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto text-slate-800 dark:text-slate-200">
                  <MathRenderer content={module.derivationSnippet} />
                </div>
              </div>
            )}

            {/* Key Bullet Points */}
            {module.keyPoints && module.keyPoints.length > 0 && (
              <div className="space-y-2 pt-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Key Properties & Results:</span>
                </span>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
                  {module.keyPoints.map((pt, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                      <span className="text-emerald-500 font-bold mt-0.5">•</span>
                      <span className="leading-relaxed">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Exam Tip */}
            {module.examTip && (
              <div className="mt-3 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong className="font-bold">JEE Exam Tip: </strong>
                  {module.examTip}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

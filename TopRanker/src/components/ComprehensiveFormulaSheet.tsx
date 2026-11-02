import React, { useState } from 'react';
import { 
  Bookmark, 
  BookmarkCheck, 
  AlertTriangle, 
  Sparkles, 
  Check, 
  Copy, 
  Search, 
  Printer, 
  Info,
  Scale
} from 'lucide-react';
import type { DetailedFormula } from '../types.ts';
import { MathRenderer } from './MathRenderer.tsx';

interface ComprehensiveFormulaSheetProps {
  chapterTitle: string;
  subject: string;
  formulas: DetailedFormula[];
  onBookmarkFormula?: (formulaName: string) => void;
  bookmarkedFormulas?: string[];
}

export const ComprehensiveFormulaSheet: React.FC<ComprehensiveFormulaSheetProps> = ({
  chapterTitle,
  subject,
  formulas,
  onBookmarkFormula,
  bookmarkedFormulas = []
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedFormula, setCopiedFormula] = useState<string | null>(null);

  const filteredFormulas = formulas.filter(f => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      f.name.toLowerCase().includes(q) ||
      f.formula.toLowerCase().includes(q) ||
      (f.conditions?.toLowerCase().includes(q) ?? false) ||
      (f.variables && f.variables.some(v => v.symbol.toLowerCase().includes(q) || v.meaning.toLowerCase().includes(q)))
    );
  });

  const handleCopy = (formulaText: string, name: string) => {
    navigator.clipboard.writeText(formulaText);
    setCopiedFormula(name);
    setTimeout(() => setCopiedFormula(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${formulas.length} formulas in ${chapterTitle}...`}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-slate-500 font-mono">
            {filteredFormulas.length} of {formulas.length} Formulas
          </span>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print Sheet</span>
          </button>
        </div>
      </div>

      {/* Formulas Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFormulas.map((item, idx) => {
          const isBm = bookmarkedFormulas.includes(item.name);

          return (
            <div 
              key={idx}
              className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:shadow-md transition-all space-y-3.5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header: Name, Unit/Dim, Actions */}
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-sky-400 uppercase tracking-wider">
                      Formula #{idx + 1}
                    </span>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {item.name}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleCopy(item.formula, item.name)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                      title="Copy LaTeX formula"
                    >
                      {copiedFormula === item.name ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                    {onBookmarkFormula && (
                      <button
                        type="button"
                        onClick={() => onBookmarkFormula(item.name)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 transition-colors"
                        title="Bookmark formula"
                      >
                        {isBm ? <BookmarkCheck className="h-3.5 w-3.5 text-amber-500" /> : <Bookmark className="h-3.5 w-3.5" />}
                      </button>
                    )}
                  </div>
                </div>

                {/* Formula LaTeX Presentation */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 overflow-x-auto text-sm sm:text-base font-semibold">
                  <MathRenderer content={`$$${item.formula}$$`} />
                </div>

                {/* SI Units & Dimensions */}
                {(item.siUnit || item.dimensions) && (
                  <div className="flex items-center gap-3 text-[11px] font-mono text-slate-600 dark:text-slate-400">
                    {item.siUnit && (
                      <span className="flex items-center gap-1">
                        <Scale className="h-3 w-3 text-blue-500" />
                        <span>SI: <strong>{item.siUnit}</strong></span>
                      </span>
                    )}
                    {item.dimensions && (
                      <span>Dim: <strong>[{item.dimensions}]</strong></span>
                    )}
                  </div>
                )}

                {/* Conditions of Validity */}
                {item.conditions && (
                  <div className="text-xs bg-blue-50/70 dark:bg-blue-950/30 p-2.5 rounded-xl border border-blue-100 dark:border-blue-900 text-blue-900 dark:text-blue-300 flex items-start gap-1.5">
                    <Info className="h-3.5 w-3.5 text-blue-600 dark:text-sky-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Valid when: </span>
                      <span>{item.conditions}</span>
                    </div>
                  </div>
                )}

                {/* Variables Meaning Table */}
                {item.variables && item.variables.length > 0 && (
                  <div className="pt-1 text-xs">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Variables:
                    </p>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-slate-600 dark:text-slate-300">
                      {item.variables.map((v, vIdx) => (
                        <span key={vIdx} className="inline-flex items-center gap-1">
                          <code className="text-blue-600 dark:text-sky-400 font-bold">{v.symbol}</code>
                          <span>=</span>
                          <span>{v.meaning}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Common Pitfall / Trap */}
              {item.commonMistake && (
                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[11px] text-rose-700 dark:text-rose-300 flex items-start gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-rose-500 flex-shrink-0 mt-0.5" />
                  <p className="leading-tight">
                    <strong className="font-bold">JEE Trap: </strong>
                    {item.commonMistake}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

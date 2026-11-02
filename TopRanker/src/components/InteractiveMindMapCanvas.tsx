import React, { useState, useRef } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Printer, 
  Info, 
  Lightbulb, 
  AlertTriangle, 
  CheckCircle2, 
  Zap,
  Bookmark,
  BookmarkCheck,
  X
} from 'lucide-react';
import type { ChapterMindMap, MindMapBranch, MindMapNode } from '../types.ts';
import { MathRenderer } from './MathRenderer.tsx';

interface InteractiveMindMapCanvasProps {
  mindMap: ChapterMindMap;
  isRevised: boolean;
  onToggleRevised: () => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  activeMode: 'quick' | 'interactive' | 'deep';
  onChangeMode: (mode: 'quick' | 'interactive' | 'deep') => void;
}

export const InteractiveMindMapCanvas: React.FC<InteractiveMindMapCanvasProps> = ({
  mindMap,
  isRevised,
  onToggleRevised,
  isBookmarked,
  onToggleBookmark,
  activeMode,
  onChangeMode
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [collapsedBranches, setCollapsedBranches] = useState<Record<string, boolean>>({});
  const [highlightFormulas, setHighlightFormulas] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<{ node: MindMapNode; branchTitle: string } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.15, 1.6));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.15, 0.7));
  const handleResetZoom = () => setZoomLevel(1);

  const toggleBranch = (branchId: string) => {
    setCollapsedBranches(prev => ({
      ...prev,
      [branchId]: !prev[branchId]
    }));
  };

  const expandAll = () => setCollapsedBranches({});
  const collapseAll = () => {
    const all: Record<string, boolean> = {};
    mindMap.branches.forEach(b => { all[b.id] = true; });
    setCollapsedBranches(all);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getBranchColorStyles = (color: string) => {
    switch (color) {
      case 'emerald':
        return {
          border: 'border-emerald-500/40 dark:border-emerald-500/30',
          bg: 'bg-emerald-50/60 dark:bg-emerald-950/20',
          badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
          line: 'stroke-emerald-500',
          accent: 'text-emerald-600 dark:text-emerald-400'
        };
      case 'purple':
        return {
          border: 'border-purple-500/40 dark:border-purple-500/30',
          bg: 'bg-purple-50/60 dark:bg-purple-950/20',
          badge: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
          line: 'stroke-purple-500',
          accent: 'text-purple-600 dark:text-purple-400'
        };
      case 'rose':
        return {
          border: 'border-rose-500/40 dark:border-rose-500/30',
          bg: 'bg-rose-50/60 dark:bg-rose-950/20',
          badge: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
          line: 'stroke-rose-500',
          accent: 'text-rose-600 dark:text-rose-400'
        };
      case 'amber':
        return {
          border: 'border-amber-500/40 dark:border-amber-500/30',
          bg: 'bg-amber-50/60 dark:bg-amber-950/20',
          badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
          line: 'stroke-amber-500',
          accent: 'text-amber-600 dark:text-amber-400'
        };
      case 'sky':
        return {
          border: 'border-sky-500/40 dark:border-sky-500/30',
          bg: 'bg-sky-50/60 dark:bg-sky-950/20',
          badge: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300',
          line: 'stroke-sky-500',
          accent: 'text-sky-600 dark:text-sky-400'
        };
      default:
        return {
          border: 'border-blue-500/40 dark:border-blue-500/30',
          bg: 'bg-blue-50/60 dark:bg-blue-950/20',
          badge: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
          line: 'stroke-blue-500',
          accent: 'text-blue-600 dark:text-blue-400'
        };
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative flex flex-col rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 overflow-hidden shadow-sm transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none bg-slate-950' : ''
      }`}
    >
      {/* Top Interactive Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 select-none">
        {/* Left: Mode Switcher Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
          <button
            type="button"
            onClick={() => onChangeMode('quick')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeMode === 'quick'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Zap className="h-3.5 w-3.5 fill-current" />
            <span>1-Min Quick Recall</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeMode('interactive')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeMode === 'interactive'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Interactive Mind Map</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeMode('deep')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeMode === 'deep'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Lightbulb className="h-3.5 w-3.5" />
            <span>Formula Sheet</span>
          </button>
        </div>

        {/* Right: Controls (Zoom, Highlight, Expand, Print, Fullscreen) */}
        <div className="flex items-center gap-2">
          {activeMode === 'interactive' && (
            <>
              {/* Formula Highlight Toggle */}
              <button
                type="button"
                onClick={() => setHighlightFormulas(!highlightFormulas)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  highlightFormulas
                    ? 'bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400 shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title="Highlight all formulas in visual mind map"
              >
                <Zap className="h-3.5 w-3.5 text-amber-500" />
                <span className="hidden sm:inline">Highlight Formulas</span>
              </button>

              {/* Expand / Collapse All */}
              <div className="hidden sm:flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden text-xs">
                <button
                  type="button"
                  onClick={expandAll}
                  className="px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                  title="Expand All Branches"
                >
                  Expand All
                </button>
                <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-700" />
                <button
                  type="button"
                  onClick={collapseAll}
                  className="px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                  title="Collapse All Branches"
                >
                  Collapse All
                </button>
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                  title="Zoom Out"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleResetZoom}
                  className="px-2 py-1 text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="Reset Zoom to 100%"
                >
                  {Math.round(zoomLevel * 100)}%
                </button>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                  title="Zoom In"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
              </div>
            </>
          )}

          {/* Print / Save PDF */}
          <button
            type="button"
            onClick={handlePrint}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            title="Print or Save Chapter Mind Map as PDF"
          >
            <Printer className="h-4 w-4" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Full Screen' : 'Fullscreen Mind Map View'}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 min-h-[560px] flex items-center justify-center relative">
        {activeMode === 'interactive' && (
          <div 
            style={{ 
              transform: `scale(${zoomLevel})`, 
              transformOrigin: 'top center',
              transition: 'transform 0.15s ease-out'
            }}
            className="w-full max-w-5xl space-y-8 select-none"
          >
            {/* 1. Center Topic Core Node */}
            <div className="relative mx-auto max-w-xl text-center group">
              <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#183b56] via-blue-900 to-indigo-950 text-white shadow-xl shadow-blue-900/20 border-2 border-sky-400/30">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-extrabold uppercase tracking-widest mb-2 border border-sky-400/20">
                  <Sparkles className="h-3 w-3" />
                  <span>Chapter {mindMap.chapterNumber} · {mindMap.subject}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
                  {mindMap.title}
                </h2>
                <p className="text-xs sm:text-sm text-sky-100 font-medium leading-relaxed max-w-md mx-auto">
                  {mindMap.centerConcept.coreDefinition}
                </p>

                {mindMap.centerConcept.keyLaw && (
                  <div className="mt-4 pt-3 border-t border-white/10 text-xs text-amber-300 font-semibold flex items-center justify-center gap-2">
                    <Zap className="h-4 w-4 text-amber-400 flex-shrink-0" />
                    <span>{mindMap.centerConcept.keyLaw}</span>
                  </div>
                )}
              </div>

              {/* Connecting Stems to Branches */}
              <div className="hidden sm:block absolute left-1/2 -bottom-6 w-0.5 h-6 bg-slate-300 dark:bg-slate-700" />
            </div>

            {/* 2. Connected Concept Branches Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {mindMap.branches.map((branch) => {
                const styles = getBranchColorStyles(branch.color);
                const isCollapsed = collapsedBranches[branch.id];

                return (
                  <div 
                    key={branch.id}
                    className={`rounded-2xl border ${styles.border} ${styles.bg} p-5 space-y-4 shadow-sm transition-all`}
                  >
                    {/* Branch Header with Collapse Toggle */}
                    <div 
                      onClick={() => toggleBranch(branch.id)}
                      className="flex items-center justify-between cursor-pointer select-none group"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider ${styles.badge}`}>
                          Branch
                        </span>
                        <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors">
                          {branch.title}
                        </h3>
                      </div>
                      <button
                        type="button"
                        className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {branch.summary}
                    </p>

                    {/* Branch Nodes (Collapsible) */}
                    {!isCollapsed && (
                      <div className="space-y-3 pt-1">
                        {branch.nodes.map((node) => (
                          <div 
                            key={node.id}
                            onClick={() => setSelectedNode({ node, branchTitle: branch.title })}
                            className={`p-3.5 rounded-xl border bg-white dark:bg-slate-900/90 hover:border-blue-500/60 dark:hover:border-sky-500/60 transition-all cursor-pointer shadow-xs hover:shadow-md group ${
                              highlightFormulas && node.formula 
                                ? 'ring-2 ring-amber-400/80 border-amber-400 dark:ring-amber-500/50' 
                                : 'border-slate-200/90 dark:border-slate-800'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors flex items-center gap-1.5">
                                <span>{node.title}</span>
                              </h4>
                              <span className="text-[10px] text-slate-400 font-medium group-hover:text-blue-500 flex items-center gap-0.5">
                                <span>Inspect</span>
                                <Info className="h-3 w-3" />
                              </span>
                            </div>

                            {/* Render Formula via KaTeX */}
                            {node.formula && (
                              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-100 dark:border-slate-800/80 text-xs sm:text-sm overflow-x-auto my-1.5">
                                <MathRenderer content={`$$${node.formula}$$`} />
                              </div>
                            )}

                            {node.details && (
                              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                                {node.details}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* MODE 1: 1-MINUTE QUICK REVISION VIEW */}
        {activeMode === 'quick' && (
          <div className="w-full max-w-4xl space-y-6">
            <div className="p-4 sm:p-6 rounded-3xl bg-amber-500/10 border-2 border-amber-500/30 space-y-2">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-extrabold text-sm uppercase tracking-wider">
                <Zap className="h-4 w-4 fill-current" />
                <span>1-Minute High-Yield Flash Revision · {mindMap.title}</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                Rapidly scan through the most frequently tested JEE Main formulas, critical memory points, and exam traps before entering the mock test.
              </p>
            </div>

            {/* Core Formula Grid */}
            <div className="space-y-3">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span>Must-Know JEE Main Formulas</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {mindMap.oneMinuteSummary.keyFormulas.map((item, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-blue-700 dark:text-sky-400">{item.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">F-{idx + 1}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 overflow-x-auto text-xs sm:text-sm">
                      <MathRenderer content={`$$${item.formula}$$`} />
                    </div>
                    {item.note && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                        {item.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* High-Retention Points & Traps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Must Remember Points */}
              <div className="p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-3">
                <h4 className="font-extrabold text-xs text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Golden Points for JEE Main</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                  {mindMap.oneMinuteSummary.mustRememberPoints.map((pt, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold mt-0.5">•</span>
                      <span className="leading-relaxed">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Traps & Speed Tricks */}
              <div className="space-y-4">
                {mindMap.oneMinuteSummary.commonPitfalls.length > 0 && (
                  <div className="p-4 rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 space-y-2">
                    <h4 className="font-extrabold text-xs text-rose-800 dark:text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4" />
                      <span>JEE Common Traps to Avoid</span>
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                      {mindMap.oneMinuteSummary.commonPitfalls.map((pf, pfIdx) => (
                        <li key={pfIdx} className="flex items-start gap-2">
                          <span className="text-rose-500 font-bold mt-0.5">⚠</span>
                          <span className="leading-relaxed">{pf}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {mindMap.oneMinuteSummary.speedTricks.length > 0 && (
                  <div className="p-4 rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 space-y-2">
                    <h4 className="font-extrabold text-xs text-amber-800 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Lightbulb className="h-4 w-4" />
                      <span>Speed Tricks & Shortcuts</span>
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                      {mindMap.oneMinuteSummary.speedTricks.map((tr, trIdx) => (
                        <li key={trIdx} className="flex items-start gap-2">
                          <span className="text-amber-500 font-bold mt-0.5">⚡</span>
                          <span className="leading-relaxed">{tr}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MODE 3: DEEP DIVE FORMULA SHEET */}
        {activeMode === 'deep' && (
          <div className="w-full max-w-4xl space-y-6">
            <div className="p-5 rounded-3xl bg-purple-500/10 border-2 border-purple-500/30 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-purple-950 dark:text-purple-200">
                  Comprehensive Formula Sheet — {mindMap.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Weightage: {mindMap.weightage} · Difficulty: {mindMap.difficulty}
                </p>
              </div>
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print Sheet</span>
              </button>
            </div>

            <div className="divide-y divide-slate-200 dark:divide-slate-800 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
              {mindMap.branches.map((b) => (
                <div key={b.id} className="p-5 space-y-4">
                  <h4 className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                    {b.title}
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    {b.nodes.map((n) => (
                      <div key={n.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
                        <div className="font-bold text-xs text-blue-700 dark:text-sky-300">
                          {n.title}
                        </div>
                        {n.formula && (
                          <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-x-auto text-xs">
                            <MathRenderer content={`$$${n.formula}$$`} />
                          </div>
                        )}
                        {n.details && (
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            {n.details}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Concept Detail Slide-over / Modal */}
      {selectedNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[11px] font-bold text-blue-600 dark:text-sky-400 uppercase tracking-wider">
                  {selectedNode.branchTitle}
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {selectedNode.node.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNode(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {selectedNode.node.formula && (
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Formula / Relation:</span>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-x-auto text-sm">
                  <MathRenderer content={`$$${selectedNode.node.formula}$$`} />
                </div>
              </div>
            )}

            {selectedNode.node.details && (
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Concept Explanation:</span>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedNode.node.details}
                </p>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedNode(null)}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all cursor-pointer shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

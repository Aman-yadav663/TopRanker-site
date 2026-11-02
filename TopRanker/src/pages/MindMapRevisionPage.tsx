import React, { useState, useEffect, useMemo } from 'react';
import { 
  Atom, 
  FlaskConical, 
  Calculator, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  Bookmark, 
  BookmarkCheck, 
  Zap, 
  ArrowRight, 
  ArrowLeft, 
  ChevronRight, 
  Clock, 
  Layers, 
  BookOpen, 
  Filter, 
  TrendingUp,
  Check,
  RotateCcw,
  Share2,
  Printer,
  FileText,
  Image as ImageIcon,
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import { ALL_CHAPTER_MIND_MAPS, getMindMapById } from '../data/mindMapsData.ts';
import { getEnrichmentForChapter } from '../data/chapterEnrichment.ts';
import type { ChapterMindMap, Subject, DetailedFormula } from '../types.ts';
import { storage } from '../services/storage.ts';
import { InteractiveMindMapCanvas } from '../components/InteractiveMindMapCanvas.tsx';
import { ChapterDiagramRenderer } from '../components/ChapterDiagramRenderer.tsx';
import { ComprehensiveFormulaSheet } from '../components/ComprehensiveFormulaSheet.tsx';
import { DetailedNotesViewer } from '../components/DetailedNotesViewer.tsx';

interface MindMapRevisionPageProps {
  initialChapterId?: string;
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export type RevisionViewMode = 'quick' | 'mindmap' | 'notes' | 'formulas' | 'diagrams';

export const MindMapRevisionPage: React.FC<MindMapRevisionPageProps> = ({
  initialChapterId,
  onNavigate
}) => {
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(initialChapterId || null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Physics' | 'Chemistry' | 'Physical' | 'Inorganic' | 'Organic' | 'Mathematics' | 'Bookmarked' | 'Revised'>('All');
  const [activeRevisionMode, setActiveRevisionMode] = useState<RevisionViewMode>('quick');

  // Persistence
  const [revisedChapters, setRevisedChapters] = useState<string[]>([]);
  const [bookmarkedChapters, setBookmarkedChapters] = useState<string[]>([]);
  const [recentChapterIds, setRecentChapterIds] = useState<string[]>([]);
  const [bookmarkedFormulaNames, setBookmarkedFormulaNames] = useState<string[]>([]);

  // Load persistence
  useEffect(() => {
    setRevisedChapters(storage.getRevisedChapters());
    setBookmarkedChapters(storage.getBookmarkedMindMaps());
    setRecentChapterIds(storage.getRecentMindMaps());
  }, []);

  // Sync initialChapterId
  useEffect(() => {
    if (initialChapterId) {
      setSelectedChapterId(initialChapterId);
      storage.recordRecentMindMap(initialChapterId);
      setRecentChapterIds(storage.getRecentMindMaps());
    }
  }, [initialChapterId]);

  const handleSelectChapter = (chapterId: string, preferredMode: RevisionViewMode = 'quick') => {
    setSelectedChapterId(chapterId);
    setActiveRevisionMode(preferredMode);
    storage.recordRecentMindMap(chapterId);
    setRecentChapterIds(storage.getRecentMindMaps());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleRevised = (chapterId: string) => {
    const isCurrently = revisedChapters.includes(chapterId);
    storage.setChapterRevised(chapterId, !isCurrently);
    setRevisedChapters(storage.getRevisedChapters());
  };

  const handleToggleBookmark = (chapterId: string) => {
    storage.toggleBookmarkMindMap(chapterId);
    setBookmarkedChapters(storage.getBookmarkedMindMaps());
  };

  const handleToggleFormulaBookmark = (formulaName: string) => {
    setBookmarkedFormulaNames(prev => 
      prev.includes(formulaName) ? prev.filter(f => f !== formulaName) : [...prev, formulaName]
    );
  };

  // Filtered chapters list
  const filteredChapters = useMemo(() => {
    return ALL_CHAPTER_MIND_MAPS.filter((ch) => {
      if (selectedFilter === 'Physics' && ch.subject !== 'Physics') return false;
      if (selectedFilter === 'Chemistry' && ch.subject !== 'Chemistry') return false;
      if (selectedFilter === 'Physical' && ch.category !== 'Physical Chemistry') return false;
      if (selectedFilter === 'Inorganic' && ch.category !== 'Inorganic Chemistry') return false;
      if (selectedFilter === 'Organic' && ch.category !== 'Organic Chemistry') return false;
      if (selectedFilter === 'Mathematics' && ch.subject !== 'Mathematics') return false;
      if (selectedFilter === 'Bookmarked' && !bookmarkedChapters.includes(ch.id)) return false;
      if (selectedFilter === 'Revised' && !revisedChapters.includes(ch.id)) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = ch.title.toLowerCase().includes(query);
        const matchesTagline = ch.tagline.toLowerCase().includes(query);
        const matchesSubject = ch.subject.toLowerCase().includes(query);
        const matchesFormulas = ch.oneMinuteSummary.keyFormulas.some(f => 
          f.name.toLowerCase().includes(query) || f.formula.toLowerCase().includes(query)
        );
        const matchesPoints = ch.oneMinuteSummary.mustRememberPoints.some(p => p.toLowerCase().includes(query));

        return matchesTitle || matchesTagline || matchesSubject || matchesFormulas || matchesPoints;
      }

      return true;
    });
  }, [selectedFilter, searchQuery, bookmarkedChapters, revisedChapters]);

  // Statistics
  const physicsTotal = ALL_CHAPTER_MIND_MAPS.filter(c => c.subject === 'Physics').length;
  const chemistryTotal = ALL_CHAPTER_MIND_MAPS.filter(c => c.subject === 'Chemistry').length;
  const mathsTotal = ALL_CHAPTER_MIND_MAPS.filter(c => c.subject === 'Mathematics').length;

  const physicsRevised = ALL_CHAPTER_MIND_MAPS.filter(c => c.subject === 'Physics' && revisedChapters.includes(c.id)).length;
  const chemistryRevised = ALL_CHAPTER_MIND_MAPS.filter(c => c.subject === 'Chemistry' && revisedChapters.includes(c.id)).length;
  const mathsRevised = ALL_CHAPTER_MIND_MAPS.filter(c => c.subject === 'Mathematics' && revisedChapters.includes(c.id)).length;

  const totalRevisedCount = revisedChapters.length;
  const overallPercentage = Math.round((totalRevisedCount / ALL_CHAPTER_MIND_MAPS.length) * 100);

  // Active selected chapter and its enrichment data
  const activeChapter = selectedChapterId ? getMindMapById(selectedChapterId) : null;
  const chapterEnrichment = selectedChapterId ? getEnrichmentForChapter(selectedChapterId) : undefined;

  // Next / Previous navigation within active chapter view
  const currentChapterIndex = activeChapter ? ALL_CHAPTER_MIND_MAPS.findIndex(c => c.id === activeChapter.id) : -1;
  const prevChapter = currentChapterIndex > 0 ? ALL_CHAPTER_MIND_MAPS[currentChapterIndex - 1] : null;
  const nextChapter = currentChapterIndex >= 0 && currentChapterIndex < ALL_CHAPTER_MIND_MAPS.length - 1 ? ALL_CHAPTER_MIND_MAPS[currentChapterIndex + 1] : null;

  // Recently viewed chapters objects
  const recentChapters = useMemo(() => {
    return recentChapterIds
      .map(id => getMindMapById(id))
      .filter((c): c is ChapterMindMap => c !== undefined)
      .slice(0, 6);
  }, [recentChapterIds]);

  // Construct comprehensive formulas for active chapter:
  const combinedFormulas: DetailedFormula[] = useMemo(() => {
    if (!activeChapter) return [];
    if (chapterEnrichment?.formulaSheet && chapterEnrichment.formulaSheet.length > 0) {
      return chapterEnrichment.formulaSheet;
    }
    // Fallback generated from chapter's oneMinuteSummary and branches
    return activeChapter.oneMinuteSummary.keyFormulas.map(f => ({
      name: f.name,
      formula: f.formula,
      conditions: f.note || 'Applicable under standard JEE conditions',
      variables: []
    }));
  }, [activeChapter, chapterEnrichment]);

  // Construct diagrams for active chapter:
  const chapterDiagrams = useMemo(() => {
    if (!activeChapter) return [];
    if (chapterEnrichment?.diagrams && chapterEnrichment.diagrams.length > 0) {
      return chapterEnrichment.diagrams;
    }
    // Default high-yield visual for chapter
    return [{
      id: `${activeChapter.id}-core-diag`,
      title: `${activeChapter.title} Core Conceptual Diagram`,
      category: activeChapter.subject,
      caption: `Core schematic showing primary interactions, field lines, and mathematical definitions for ${activeChapter.title}.`,
      svgType: activeChapter.subject === 'Physics' ? 'optics-diagram' : activeChapter.subject === 'Chemistry' ? 'atomic-radial' : 'conic-parabola',
      labels: [
        { label: 'Core Law', description: activeChapter.centerConcept.keyLaw || activeChapter.centerConcept.coreDefinition }
      ],
      formula: activeChapter.oneMinuteSummary.keyFormulas[0]?.formula
    }];
  }, [activeChapter, chapterEnrichment]);

  // Construct detailed notes for active chapter:
  const chapterDetailedNotes = useMemo(() => {
    if (!activeChapter) return [];
    if (chapterEnrichment?.detailedNotes && chapterEnrichment.detailedNotes.length > 0) {
      return chapterEnrichment.detailedNotes;
    }
    // Fallback from chapter branches
    return activeChapter.branches.map(b => ({
      title: b.title,
      summary: b.summary,
      keyPoints: b.nodes.map(n => n.details || n.title),
      examTip: activeChapter.oneMinuteSummary.commonPitfalls[0] || 'Pay strict attention to sign conventions and units.'
    }));
  }, [activeChapter, chapterEnrichment]);

  return (
    <div className="space-y-8 py-6 select-none">
      {/* ============================================================ */}
      {/* 1. TOP HEADER & BREADCRUMB */}
      {/* ============================================================ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-sky-400 uppercase tracking-widest mb-1">
            <Sparkles className="h-4 w-4" />
            <span>Complete JEE Main Preparation System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Complete Mind Map Revision Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Interactive chapter-wise concept mind maps, complete formula sheets, labelled diagrams, derivations, and exam shortcuts across all 55 official syllabus chapters.
          </p>
        </div>

        {/* Global Revision Progress Summary */}
        <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs self-start md:self-auto">
          <div className="flex flex-col text-right">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Chapters Revised</span>
            <div className="flex items-center gap-1.5 justify-end">
              <span className="text-xl font-black text-slate-900 dark:text-white">{totalRevisedCount} / 55</span>
              <span className="text-xs font-bold text-blue-600 dark:text-sky-400">({overallPercentage}%)</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center font-black text-sm text-blue-600 dark:text-sky-400">
            {overallPercentage}%
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. IF CHAPTER SELECTED -> DEDICATED CHAPTER VIEW */}
      {/* ============================================================ */}
      {activeChapter ? (
        <div className="space-y-6 animate-in fade-in">
          {/* Chapter Top Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedChapterId(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>All 55 Chapters</span>
              </button>

              {/* Jump to Any Chapter Dropdown */}
              <select
                value={activeChapter.id}
                onChange={(e) => handleSelectChapter(e.target.value, activeRevisionMode)}
                className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer max-w-xs truncate"
              >
                {ALL_CHAPTER_MIND_MAPS.map((ch) => (
                  <option key={ch.id} value={ch.id}>
                    Ch {ch.chapterNumber}: {ch.title} ({ch.subject})
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Actions (Revised, Bookmark, Practice, Print) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleToggleRevised(activeChapter.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  revisedChapters.includes(activeChapter.id)
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                    : 'border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>{revisedChapters.includes(activeChapter.id) ? 'Revised' : 'Mark as Revised'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleToggleBookmark(activeChapter.id)}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  bookmarkedChapters.includes(activeChapter.id)
                    ? 'bg-amber-100 border-amber-300 text-amber-700 dark:bg-amber-950/60 dark:border-amber-700 dark:text-amber-300 shadow-xs'
                    : 'border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500'
                }`}
                title={bookmarkedChapters.includes(activeChapter.id) ? 'Remove Bookmark' : 'Bookmark Mind Map'}
              >
                {bookmarkedChapters.includes(activeChapter.id) ? <BookmarkCheck className="h-4 w-4 text-amber-600" /> : <Bookmark className="h-4 w-4" />}
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                title="Print or Save PDF"
              >
                <Printer className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('chapter-practice')}
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>Practice PYQs</span>
              </button>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 bg-slate-200/70 dark:bg-slate-800/80 rounded-2xl overflow-x-auto scrollbar-none text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveRevisionMode('quick')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeRevisionMode === 'quick'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Zap className="h-4 w-4 fill-current" />
              <span>Mode 1: 1-Min Quick Revision</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveRevisionMode('mindmap')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeRevisionMode === 'mindmap'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="h-4 w-4" />
              <span>Mode 2: Complete Visual Mind Map</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveRevisionMode('notes')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeRevisionMode === 'notes'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Mode 3: Detailed Revision Notes</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveRevisionMode('formulas')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeRevisionMode === 'formulas'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Formula Sheet ({combinedFormulas.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveRevisionMode('diagrams')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeRevisionMode === 'diagrams'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ImageIcon className="h-4 w-4" />
              <span>Diagrams & Graphs ({chapterDiagrams.length})</span>
            </button>
          </div>

          {/* MODE 1: QUICK REVISION (Interactive Canvas in 'quick' mode) */}
          {activeRevisionMode === 'quick' && (
            <InteractiveMindMapCanvas
              mindMap={activeChapter}
              isRevised={revisedChapters.includes(activeChapter.id)}
              onToggleRevised={() => handleToggleRevised(activeChapter.id)}
              isBookmarked={bookmarkedChapters.includes(activeChapter.id)}
              onToggleBookmark={() => handleToggleBookmark(activeChapter.id)}
              activeMode="quick"
              onChangeMode={(m) => {
                if (m === 'interactive') setActiveRevisionMode('mindmap');
                else if (m === 'deep') setActiveRevisionMode('formulas');
              }}
            />
          )}

          {/* MODE 2: COMPLETE VISUAL MIND MAP (Interactive Canvas in 'interactive' mode) */}
          {activeRevisionMode === 'mindmap' && (
            <InteractiveMindMapCanvas
              mindMap={activeChapter}
              isRevised={revisedChapters.includes(activeChapter.id)}
              onToggleRevised={() => handleToggleRevised(activeChapter.id)}
              isBookmarked={bookmarkedChapters.includes(activeChapter.id)}
              onToggleBookmark={() => handleToggleBookmark(activeChapter.id)}
              activeMode="interactive"
              onChangeMode={(m) => {
                if (m === 'quick') setActiveRevisionMode('quick');
                else if (m === 'deep') setActiveRevisionMode('formulas');
              }}
            />
          )}

          {/* MODE 3: DETAILED REVISION NOTES */}
          {activeRevisionMode === 'notes' && (
            <DetailedNotesViewer
              chapterTitle={activeChapter.title}
              subject={activeChapter.subject}
              notes={chapterDetailedNotes}
            />
          )}

          {/* MODE 4: COMPREHENSIVE FORMULA SHEET */}
          {activeRevisionMode === 'formulas' && (
            <ComprehensiveFormulaSheet
              chapterTitle={activeChapter.title}
              subject={activeChapter.subject}
              formulas={combinedFormulas}
              onBookmarkFormula={handleToggleFormulaBookmark}
              bookmarkedFormulas={bookmarkedFormulaNames}
            />
          )}

          {/* MODE 5: DIAGRAMS & GRAPHS VIEW */}
          {activeRevisionMode === 'diagrams' && (
            <div className="space-y-6">
              <div className="p-5 rounded-3xl bg-sky-500/10 border-2 border-sky-500/30">
                <h3 className="font-extrabold text-base text-sky-950 dark:text-sky-200">
                  Labelled Diagrams, Graphs & Visual Schematics — {activeChapter.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Visual concepts with coordinate axes, ray paths, field lines, and mathematical relationships.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {chapterDiagrams.map((diag) => (
                  <ChapterDiagramRenderer key={diag.id} diagram={diag} />
                ))}
              </div>
            </div>
          )}

          {/* Bottom Next/Previous Chapter Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800">
            {prevChapter ? (
              <button
                type="button"
                onClick={() => handleSelectChapter(prevChapter.id, activeRevisionMode)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                <div className="text-left hidden sm:block">
                  <div className="text-[10px] text-slate-400 uppercase">Previous</div>
                  <div className="font-extrabold">{prevChapter.title}</div>
                </div>
                <span className="sm:hidden">Previous</span>
              </button>
            ) : <div />}

            <button
              type="button"
              onClick={() => setSelectedChapterId(null)}
              className="px-4 py-2 text-xs font-bold text-blue-600 dark:text-sky-400 hover:underline cursor-pointer"
            >
              Back to Dashboard (55 Chapters)
            </button>

            {nextChapter ? (
              <button
                type="button"
                onClick={() => handleSelectChapter(nextChapter.id, activeRevisionMode)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
              >
                <div className="text-right hidden sm:block">
                  <div className="text-[10px] text-slate-400 uppercase">Next</div>
                  <div className="font-extrabold">{nextChapter.title}</div>
                </div>
                <span className="sm:hidden">Next</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : <div />}
          </div>
        </div>
      ) : (
        /* ============================================================ */
        /* 3. COMPLETE REVISION LIBRARY DASHBOARD */
        /* ============================================================ */
        <div className="space-y-8 animate-in fade-in">
          {/* Three Subject Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* PHYSICS CARD */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-sky-400 flex items-center justify-center font-bold">
                    <Atom className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                    21 Chapters
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                    Physics
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Mechanics, Fluids, Thermodynamics, Oscillations, Electrodynamics & Modern Physics
                  </p>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-500">Revised:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{physicsRevised} of {physicsTotal}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full transition-all duration-300"
                      style={{ width: `${(physicsRevised / physicsTotal) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="button"
                  onClick={() => setSelectedFilter('Physics')}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer group-hover:scale-[1.01]"
                >
                  <span>Explore Physics (21 Chapters)</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* CHEMISTRY CARD */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center font-bold">
                    <FlaskConical className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                    20 Chapters
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                    Chemistry
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Physical (8), Inorganic (4), Organic (8) with Reaction Wheels & Named Reagents
                  </p>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-500">Revised:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{chemistryRevised} of {chemistryTotal}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                      style={{ width: `${(chemistryRevised / chemistryTotal) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="button"
                  onClick={() => setSelectedFilter('Chemistry')}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer group-hover:scale-[1.01]"
                >
                  <span>Explore Chemistry (20 Chapters)</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* MATHEMATICS CARD */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400 flex items-center justify-center font-bold">
                    <Calculator className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                    14 Chapters
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                    Mathematics
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Calculus, Coordinate Conics, Matrices, Vectors, 3D Geometry & Probability
                  </p>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-500">Revised:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{mathsRevised} of {mathsTotal}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full bg-purple-600 rounded-full transition-all duration-300"
                      style={{ width: `${(mathsRevised / mathsTotal) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="button"
                  onClick={() => setSelectedFilter('Mathematics')}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all cursor-pointer group-hover:scale-[1.01]"
                >
                  <span>Explore Mathematics (14 Chapters)</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* RECENTLY VIEWED CHAPTERS */}
          {recentChapters.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Recently Revised Mind Maps</span>
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {recentChapters.map((ch) => (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => handleSelectChapter(ch.id)}
                    className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-left hover:border-blue-500 hover:shadow-sm transition-all cursor-pointer group"
                  >
                    <span className="text-[10px] font-bold text-slate-400 font-mono">Ch {ch.chapterNumber}</span>
                    <p className="text-xs font-extrabold text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-sky-400 mt-0.5">
                      {ch.title}
                    </p>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {ch.subject}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SEARCH & FILTERS BAR */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 55 chapters, concepts, formulas, reactions..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
                {(['All', 'Physics', 'Chemistry', 'Physical', 'Inorganic', 'Organic', 'Mathematics', 'Bookmarked', 'Revised'] as const).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                      selectedFilter === filter
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {filter === 'Physical' ? 'Physical Chem' : filter === 'Inorganic' ? 'Inorganic Chem' : filter === 'Organic' ? 'Organic Chem' : filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Results count indicator */}
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
              <span>Showing {filteredChapters.length} of 55 Chapters</span>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-blue-600 dark:text-sky-400 hover:underline cursor-pointer"
                >
                  Clear search
                </button>
              )}
            </div>
          </div>

          {/* CHAPTERS GRID (All 55 Chapters with Complete Populated Material) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredChapters.map((ch) => {
              const isRev = revisedChapters.includes(ch.id);
              const isBm = bookmarkedChapters.includes(ch.id);

              return (
                <div 
                  key={ch.id}
                  className={`rounded-3xl border p-5 flex flex-col justify-between transition-all group shadow-xs hover:shadow-md ${
                    isRev 
                      ? 'bg-white dark:bg-slate-900 border-emerald-300 dark:border-emerald-900/60' 
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header: Subject tag, chapter number, bookmarks */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          Ch {ch.chapterNumber}
                        </span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${
                          ch.subject === 'Physics' ? 'text-blue-600 dark:text-sky-400' :
                          ch.subject === 'Chemistry' ? 'text-emerald-600 dark:text-emerald-400' :
                          'text-purple-600 dark:text-purple-400'
                        }`}>
                          {ch.category || ch.subject}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleToggleBookmark(ch.id)}
                          className="p-1 rounded-md text-slate-400 hover:text-amber-500 cursor-pointer"
                          title="Bookmark"
                        >
                          {isBm ? <BookmarkCheck className="h-4 w-4 text-amber-500" /> : <Bookmark className="h-4 w-4" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleRevised(ch.id)}
                          className={`p-1 rounded-md cursor-pointer ${
                            isRev ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-300 hover:text-emerald-500'
                          }`}
                          title="Mark Revised"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Chapter Title & Tagline */}
                    <div>
                      <h4 
                        onClick={() => handleSelectChapter(ch.id)}
                        className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors cursor-pointer line-clamp-1"
                      >
                        {ch.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {ch.tagline}
                      </p>
                    </div>

                    {/* Weightage & Duration meta */}
                    <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400 font-medium pt-1">
                      <span className="px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        {ch.weightage}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        {ch.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Actions: 1-Min Quick Revision vs Complete Mind Map */}
                  <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSelectChapter(ch.id, 'quick')}
                      className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/40 text-amber-900 dark:text-amber-300 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Zap className="h-3.5 w-3.5" />
                      <span>1-Min Flash</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectChapter(ch.id, 'mindmap')}
                      className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                    >
                      <span>Explore</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AllTestsPage } from './pages/AllTestsPage';
import { TestInstructionsPage } from './pages/TestInstructionsPage';
import { LiveTestPage } from './pages/LiveTestPage';
import { ResultsPage } from './pages/ResultsPage';
import { DetailedSolutionsPage } from './pages/DetailedSolutionsPage';
import { QuestionBankPage } from './pages/QuestionBankPage';
import { SubjectPracticePage } from './pages/SubjectPracticePage';
import { ChapterPracticePage } from './pages/ChapterPracticePage';
import { BookmarkedPage } from './pages/BookmarkedPage';
import { IncorrectPage } from './pages/IncorrectPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminPage } from './pages/AdminPage';
import { AboutContactPage } from './pages/AboutContactPage';
import { AuthPage } from './pages/AuthPage';
import { PricingPage } from './pages/PricingPage';
import { MindMapRevisionPage } from './pages/MindMapRevisionPage';
import { storage } from './services/storage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [navParams, setNavParams] = useState<Record<string, any>>({});
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Check if an ongoing active test exists
  const [activeTestSlot, setActiveTestSlot] = useState<number | null>(null);

  useEffect(() => {
    const active = storage.getActiveAttempt();
    if (active && !active.isSubmitted) {
      const slot = parseInt(active.testId.replace('test-slot-', ''), 10);
      if (!isNaN(slot)) {
        setActiveTestSlot(slot);
      }
    } else {
      setActiveTestSlot(null);
    }
  }, [currentPage]);

  // Synchronize dark mode class on document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleToggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const handleNavigate = (page: string, params: Record<string, any> = {}) => {
    setCurrentPage(page);
    setNavParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determine if we are in the distraction-free CBT Live Test interface
  const isCBTExamMode = currentPage === 'live-test';

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;

      case 'tests':
        return <AllTestsPage onNavigate={handleNavigate} />;

      case 'instructions':
        return (
          <TestInstructionsPage
            slotNumber={navParams.slotNumber || 1}
            onNavigate={handleNavigate}
          />
        );

      case 'live-test':
        return (
          <LiveTestPage
            slotNumber={navParams.slotNumber || 1}
            onNavigate={handleNavigate}
          />
        );

      case 'results':
        return (
          <ResultsPage
            attemptId={navParams.attemptId}
            onNavigate={handleNavigate}
            isAutoSubmit={navParams.isAutoSubmit}
          />
        );

      case 'solutions':
        return (
          <DetailedSolutionsPage
            attemptId={navParams.attemptId}
            slotNumber={navParams.slotNumber || 1}
            onNavigate={handleNavigate}
          />
        );

      case 'qbank':
        return <QuestionBankPage onNavigate={handleNavigate} />;

      case 'subject-practice':
        return <SubjectPracticePage onNavigate={handleNavigate} />;

      case 'chapter-practice':
        return <ChapterPracticePage onNavigate={handleNavigate} />;

      case 'bookmarks':
        return <BookmarkedPage onNavigate={handleNavigate} />;

      case 'mistakes':
        return <IncorrectPage onNavigate={handleNavigate} />;

      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigate} />;

      case 'admin':
        return <AdminPage onNavigate={handleNavigate} />;

      case 'about':
        return <AboutContactPage onNavigate={handleNavigate} />;

      case 'auth':
        return <AuthPage onNavigate={handleNavigate} />;

      case 'mind-maps':
        return (
          <MindMapRevisionPage
            initialChapterId={navParams.chapterId}
            onNavigate={handleNavigate}
          />
        );

      case 'pricing':
        return <PricingPage onNavigate={handleNavigate} />;

      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${isCBTExamMode ? 'h-screen overflow-hidden bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100' : 'bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100'}`}>
      {/* Show regular header when not in live exam mode */}
      {!isCBTExamMode && (
        <Navbar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          darkMode={darkMode}
          onToggleDarkMode={handleToggleDarkMode}
          activeTestSlot={activeTestSlot}
        />
      )}

      {/* Main Container */}
      <main className={`flex-1 ${isCBTExamMode ? 'p-0 h-full w-full overflow-hidden flex flex-col' : 'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8'}`}>
        {renderCurrentPage()}
      </main>

      {/* Show regular footer when not in live exam mode */}
      {!isCBTExamMode && <Footer onNavigate={handleNavigate} />}
    </div>
  );
}

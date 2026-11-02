import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
  FileText, 
  X, 
  Trash2, 
  BookmarkCheck, 
  Atom, 
  FlaskConical, 
  Calculator, 
  Menu, 
  HelpCircle,
  Maximize2,
  Minimize2,
  Globe,
  AlertTriangle,
  User,
  CheckCircle2,
  Info
} from 'lucide-react';
import type { TestPaper, Question, Subject, QuestionResponse, TestAttempt } from '../types.ts';
import { getTestPaperBySlot } from '../data/mockTestsCatalog.ts';
import { MathRenderer } from '../components/MathRenderer.tsx';
import { storage } from '../services/storage.ts';
import { calculateTestResult } from '../services/scoring.ts';

interface LiveTestPageProps {
  slotNumber: number;
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const LiveTestPage: React.FC<LiveTestPageProps> = ({
  slotNumber,
  onNavigate
}) => {
  const user = storage.getUserProfile();
  const testPaper: TestPaper = getTestPaperBySlot(slotNumber);
  const [accessDeniedMessage, setAccessDeniedMessage] = useState<string | null>(null);

  // Active section & question state
  const [currentSubject, setCurrentSubject] = useState<Subject>('Physics');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0); // 0 to 24 within subject
  const [lastVisitedIndexBySubject, setLastVisitedIndexBySubject] = useState<Record<Subject, number>>({
    Physics: 0,
    Chemistry: 0,
    Mathematics: 0
  });

  const [timeRemaining, setTimeRemaining] = useState<number>(180 * 60); // 180 mins in seconds
  const [responses, setResponses] = useState<Record<string, QuestionResponse>>({});
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isQuestionPaperModalOpen, setIsQuestionPaperModalOpen] = useState(false);
  const [isInstructionsModalOpen, setIsInstructionsModalOpen] = useState(false);
  const [isMobilePaletteOpen, setIsMobilePaletteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [numericalInput, setNumericalInput] = useState<string>('');
  const [isSubjectFading, setIsSubjectFading] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'English' | 'Hindi'>('English');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const attemptIdRef = useRef<string>(`attempt-${Date.now()}-${slotNumber}`);
  const startTimeRef = useRef<number>(Date.now());
  const questionStartTimeRef = useRef<number>(Date.now());

  // Questions for active subject
  const currentSubjectQuestions = 
    currentSubject === 'Physics'
      ? testPaper.physicsQuestions
      : currentSubject === 'Chemistry'
      ? testPaper.chemistryQuestions
      : testPaper.mathsQuestions;

  const currentQuestion: Question = currentSubjectQuestions[currentQuestionIndex] || currentSubjectQuestions[0];

  // Official NTA Exam Meta Details
  const cleanTestTitle = `Full-Length Mock Test ${slotNumber < 10 ? `0${slotNumber}` : slotNumber}`;
  const rollNumber = `260310${String(slotNumber).padStart(2, '0')}${String(user.id || '9421').slice(-4)}`;
  const systemName = `C00${(slotNumber % 9) + 1}`;

  // Verify server-side authorization for tests 3..30
  useEffect(() => {
    if (slotNumber > 2) {
      const token = storage.getAuthToken();
      fetch(`/api/tests/${slotNumber}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })
        .then(res => {
          if (res.status === 401) {
            setAccessDeniedMessage('Please sign in with your student account to access this Mock Test.');
          } else if (res.status === 403) {
            setAccessDeniedMessage(`Test #${slotNumber} is reserved for active Premium Membership subscribers. Please unlock the test series to proceed.`);
          }
        })
        .catch(() => {
          if (!storage.isPremiumMember()) {
            setAccessDeniedMessage(`Test #${slotNumber} requires an active Premium Membership Pass.`);
          }
        });
    }
  }, [slotNumber]);

  // Fullscreen event listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Initialize or restore attempt from local persistence
  useEffect(() => {
    const savedAttempt = storage.getActiveAttempt();
    if (savedAttempt && savedAttempt.testId === testPaper.id && !savedAttempt.isSubmitted) {
      setResponses(savedAttempt.responses || {});
      if (savedAttempt.timeRemainingSeconds > 0) {
        setTimeRemaining(savedAttempt.timeRemainingSeconds);
      }
      attemptIdRef.current = savedAttempt.id;
    } else {
      // Initialize fresh responses
      const initialResponses: Record<string, QuestionResponse> = {};
      const allQuestions = [
        ...testPaper.physicsQuestions,
        ...testPaper.chemistryQuestions,
        ...testPaper.mathsQuestions
      ];

      allQuestions.forEach((q, idx) => {
        initialResponses[q.id] = {
          questionId: q.id,
          subject: q.subject,
          userAnswer: '',
          status: idx === 0 ? 'NOT_ANSWERED' : 'NOT_VISITED',
          timeSpentSeconds: 0
        };
      });

      setResponses(initialResponses);
    }
  }, [slotNumber, testPaper.id]);

  // Update numerical input when current question changes
  useEffect(() => {
    if (currentQuestion) {
      const resp = responses[currentQuestion.id];
      setNumericalInput(resp?.userAnswer || '');
      
      // Update status to NOT_ANSWERED if it was NOT_VISITED
      if (resp && resp.status === 'NOT_VISITED') {
        setResponses(prev => ({
          ...prev,
          [currentQuestion.id]: {
            ...resp,
            status: 'NOT_ANSWERED'
          }
        }));
      }
      questionStartTimeRef.current = Date.now();
    }
  }, [currentQuestionIndex, currentSubject]);

  // Timer Countdown Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam(true); // Auto submit on timer expiry
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Autosave attempt progress to localStorage every 5 seconds
  useEffect(() => {
    const autoSaveTimer = setInterval(() => {
      if (Object.keys(responses).length > 0) {
        const attemptData: TestAttempt = {
          id: attemptIdRef.current,
          testId: testPaper.id,
          testTitle: cleanTestTitle,
          userId: user.id,
          userName: user.name,
          startedAt: startTimeRef.current,
          timeRemainingSeconds: timeRemaining,
          isSubmitted: false,
          responses
        };
        storage.saveActiveAttempt(attemptData);
      }
    }, 5000);

    return () => clearInterval(autoSaveTimer);
  }, [responses, timeRemaining, testPaper.id, user, cleanTestTitle]);

  // Warn before leaving window / reloading
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'Your examination is in progress. Are you sure you want to leave? Your responses are saved.';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Helper to record time spent on previous question
  const recordQuestionTime = () => {
    if (!currentQuestion) return;
    const now = Date.now();
    const elapsed = Math.round((now - questionStartTimeRef.current) / 1000);
    const existing = responses[currentQuestion.id];
    if (existing) {
      existing.timeSpentSeconds = (existing.timeSpentSeconds || 0) + elapsed;
    }
    questionStartTimeRef.current = now;
  };

  // Format timer HH:MM:SS
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Instant & Smooth Subject Switch
  const handleSwitchSubject = (newSubject: Subject) => {
    if (newSubject === currentSubject) return;
    recordQuestionTime();

    // Remember index in current subject
    setLastVisitedIndexBySubject(prev => ({
      ...prev,
      [currentSubject]: currentQuestionIndex
    }));

    setIsSubjectFading(true);
    setCurrentSubject(newSubject);
    
    // Restore last visited index in new subject or default to 0
    const targetIndex = lastVisitedIndexBySubject[newSubject] ?? 0;
    setCurrentQuestionIndex(targetIndex);

    setTimeout(() => {
      setIsSubjectFading(false);
    }, 120);
  };

  // Handle MCQ selection
  const handleSelectOption = (optionLetter: string) => {
    setResponses(prev => {
      const currentResp = prev[currentQuestion.id] || {
        questionId: currentQuestion.id,
        subject: currentQuestion.subject,
        status: 'NOT_ANSWERED',
        timeSpentSeconds: 0
      };
      return {
        ...prev,
        [currentQuestion.id]: {
          ...currentResp,
          userAnswer: optionLetter
        }
      };
    });
  };

  // Handle Numerical Input change
  const handleNumericalChange = (value: string) => {
    setNumericalInput(value);
    setResponses(prev => {
      const currentResp = prev[currentQuestion.id] || {
        questionId: currentQuestion.id,
        subject: currentQuestion.subject,
        status: 'NOT_ANSWERED',
        timeSpentSeconds: 0
      };
      return {
        ...prev,
        [currentQuestion.id]: {
          ...currentResp,
          userAnswer: value
        }
      };
    });
  };

  // Save & Next
  const handleSaveAndNext = () => {
    recordQuestionTime();
    const currResp = responses[currentQuestion.id];
    const hasAnswer = currResp?.userAnswer && currResp.userAnswer.trim() !== '';

    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: {
        ...(prev[currentQuestion.id] || { questionId: currentQuestion.id, subject: currentQuestion.subject, timeSpentSeconds: 0 }),
        status: hasAnswer ? 'ANSWERED' : 'NOT_ANSWERED'
      }
    }));

    if (currentQuestionIndex < 24) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      if (currentSubject === 'Physics') {
        handleSwitchSubject('Chemistry');
      } else if (currentSubject === 'Chemistry') {
        handleSwitchSubject('Mathematics');
      }
    }
  };

  // Save & Mark for Review / Mark for Review & Next
  const handleSaveAndMarkForReview = () => {
    recordQuestionTime();
    const currResp = responses[currentQuestion.id];
    const hasAnswer = currResp?.userAnswer && currResp.userAnswer.trim() !== '';

    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: {
        ...(prev[currentQuestion.id] || { questionId: currentQuestion.id, subject: currentQuestion.subject, timeSpentSeconds: 0 }),
        status: hasAnswer ? 'ANSWERED_AND_MARKED_FOR_REVIEW' : 'MARKED_FOR_REVIEW'
      }
    }));

    if (currentQuestionIndex < 24) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      if (currentSubject === 'Physics') {
        handleSwitchSubject('Chemistry');
      } else if (currentSubject === 'Chemistry') {
        handleSwitchSubject('Mathematics');
      }
    }
  };

  // Clear Response
  const handleClearResponse = () => {
    setNumericalInput('');
    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: {
        ...(prev[currentQuestion.id] || { questionId: currentQuestion.id, subject: currentQuestion.subject, timeSpentSeconds: 0 }),
        userAnswer: '',
        status: 'NOT_ANSWERED'
      }
    }));
  };

  // Previous
  const handlePrevious = () => {
    recordQuestionTime();
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      if (currentSubject === 'Mathematics') {
        handleSwitchSubject('Chemistry');
        setCurrentQuestionIndex(24);
      } else if (currentSubject === 'Chemistry') {
        handleSwitchSubject('Physics');
        setCurrentQuestionIndex(24);
      }
    }
  };

  const handleNext = () => {
    recordQuestionTime();
    if (currentQuestionIndex < 24) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      if (currentSubject === 'Physics') handleSwitchSubject('Chemistry');
      else if (currentSubject === 'Chemistry') handleSwitchSubject('Mathematics');
    }
  };

  const handleJumpToQuestion = (index: number) => {
    recordQuestionTime();
    setCurrentQuestionIndex(index);
    if (isMobilePaletteOpen) {
      setIsMobilePaletteOpen(false);
    }
  };

  // Submit Exam handler
  const handleSubmitExam = async (isAutoSubmit = false) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    recordQuestionTime();

    const timeTaken = 180 * 60 - timeRemaining;
    const finalResult = calculateTestResult(
      testPaper,
      attemptIdRef.current,
      user.id,
      responses,
      timeTaken
    );

    let emailStatus: 'SENT' | 'PENDING' | 'FAILED' | 'SKIPPED' = 'SKIPPED';
    let assignedAttemptId = attemptIdRef.current;

    try {
      const token = storage.getAuthToken();
      const res = await fetch(`/api/tests/${slotNumber}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          responses,
          timeTakenSeconds: timeTaken,
          userId: user.id,
          userEmail: user.email,
          userName: user.name
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.attemptId) {
          assignedAttemptId = data.attemptId;
        }
        if (data.emailNotificationStatus) {
          emailStatus = data.emailNotificationStatus;
        }
      }
    } catch (e) {
      console.warn('Could not post attempt to server backend, saving locally:', e);
    }

    const completedAttempt: TestAttempt = {
      id: assignedAttemptId,
      testId: testPaper.id,
      testTitle: cleanTestTitle,
      userId: user.id,
      userName: user.name,
      startedAt: startTimeRef.current,
      submittedAt: Date.now(),
      timeRemainingSeconds: timeRemaining,
      isSubmitted: true,
      responses,
      scoreResult: {
        ...finalResult,
        attemptId: assignedAttemptId,
        testTitle: cleanTestTitle,
        emailNotificationStatus: emailStatus
      },
      emailNotificationStatus: emailStatus
    };

    // Save to attempt history & clear active attempt
    storage.saveAttemptToHistory(completedAttempt);
    storage.clearActiveAttempt();

    // Record mistakes into mistake notebook
    const allQuestions = [
      ...testPaper.physicsQuestions,
      ...testPaper.chemistryQuestions,
      ...testPaper.mathsQuestions
    ];
    for (const q of allQuestions) {
      const resp = responses[q.id];
      if (resp && resp.userAnswer && !resp.isCorrect) {
        storage.recordMistake({
          questionId: q.id,
          testId: testPaper.id,
          testTitle: cleanTestTitle,
          userAnswer: resp.userAnswer,
          correctAnswer: q.correctAnswer,
          subject: q.subject,
          chapter: q.chapter,
          timestamp: Date.now()
        });
      }
    }

    setIsSubmitModalOpen(false);
    onNavigate('results', { attemptId: assignedAttemptId, isAutoSubmit });
  };

  // Palette status stats calculation for any subject
  const getSubjectStatusCounts = (sub: Subject) => {
    const questions = 
      sub === 'Physics' ? testPaper.physicsQuestions :
      sub === 'Chemistry' ? testPaper.chemistryQuestions :
      testPaper.mathsQuestions;

    let answered = 0;
    let notAnswered = 0;
    let notVisited = 0;
    let marked = 0;
    let answeredMarked = 0;

    questions.forEach(q => {
      const s = responses[q.id]?.status || 'NOT_VISITED';
      if (s === 'ANSWERED') answered++;
      else if (s === 'NOT_ANSWERED') notAnswered++;
      else if (s === 'MARKED_FOR_REVIEW') marked++;
      else if (s === 'ANSWERED_AND_MARKED_FOR_REVIEW') answeredMarked++;
      else notVisited++;
    });

    return { 
      answered, 
      notAnswered, 
      notVisited, 
      marked, 
      answeredMarked,
      totalAnswered: answered + answeredMarked,
      totalUnanswered: notAnswered + notVisited,
      totalMarked: marked + answeredMarked
    };
  };

  const currentStats = getSubjectStatusCounts(currentSubject);
  const isBookmarked = currentQuestion ? storage.isBookmarked(currentQuestion.id) : false;

  const toggleBookmark = () => {
    if (!currentQuestion) return;
    if (isBookmarked) {
      storage.removeBookmark(currentQuestion.id);
    } else {
      storage.addBookmark({
        id: `bm-${Date.now()}`,
        questionId: currentQuestion.id,
        subject: currentQuestion.subject,
        chapter: currentQuestion.chapter,
        year: currentQuestion.year,
        shift: currentQuestion.shift,
        savedAt: Date.now()
      });
    }
  };

  const isLowTime = timeRemaining <= 10 * 60; // 10 mins
  const isWarningTime = timeRemaining <= 30 * 60 && !isLowTime; // 30 mins

  // Access Denied Modal if not authorized
  if (accessDeniedMessage) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl p-8 text-center space-y-5 shadow-2xl border border-slate-700">
          <div className="h-16 w-16 rounded-2xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            Examination Access Required
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {accessDeniedMessage}
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => onNavigate('pricing')}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Unlock Full Test Series
            </button>
            <button
              onClick={() => onNavigate('tests')}
              className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Back to Available Tests
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-[#f0f4f8] text-slate-900 select-none overflow-hidden font-sans">
      {/* ============================================================ */}
      {/* 1. OFFICIAL JEE MAIN CBT TOP EXAMINATION HEADER */}
      {/* (Completely free of any Top Ranker branding, logos, or ads) */}
      {/* ============================================================ */}
      <header className="bg-[#183b56] text-white flex-shrink-0 border-b-2 border-[#0f283c] shadow-sm">
        {/* Upper Title Strip */}
        <div className="px-4 py-2 flex items-center justify-between border-b border-[#244b6b]">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-wide text-white uppercase">
                  Joint Entrance Examination (Main)
                </span>
                <span className="text-xs bg-[#0b253a] px-2 py-0.5 rounded text-sky-300 font-mono font-semibold hidden sm:inline">
                  CBT Mode
                </span>
              </div>
              <span className="text-[11px] text-sky-200 font-medium">
                Paper 1 (B.E. / B.Tech) · 75 Questions · 300 Marks
              </span>
            </div>
          </div>

          {/* Top Right Candidate Identity & System Info (NTA Style) */}
          <div className="flex items-center gap-4">
            {/* Candidate Details Card */}
            <div className="hidden md:flex items-center gap-3 bg-[#0d273d] px-3 py-1 rounded-md border border-[#274f72] text-[11px]">
              <div className="h-8 w-8 rounded bg-slate-200 text-[#183b56] flex items-center justify-center font-bold text-xs flex-shrink-0 overflow-hidden border border-white/40">
                <User className="h-5 w-5 text-slate-600" />
              </div>
              <div className="leading-tight">
                <div className="font-bold text-white line-clamp-1">{user.name}</div>
                <div className="text-slate-300 font-mono text-[10px]">
                  Roll No: <span className="text-amber-300 font-bold">{rollNumber}</span>
                </div>
                <div className="text-sky-300 text-[10px] font-mono">
                  System: {systemName}
                </div>
              </div>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-1.5 bg-[#0f2d47] px-2.5 py-1.5 rounded border border-[#274f72] text-xs">
              <Globe className="h-3.5 w-3.5 text-sky-300" />
              <label htmlFor="lang-select" className="text-[11px] text-slate-300 hidden sm:inline">View in:</label>
              <select
                id="lang-select"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as 'English' | 'Hindi')}
                className="bg-transparent text-white font-semibold text-xs focus:outline-none cursor-pointer"
              >
                <option value="English" className="text-slate-900 bg-white">English</option>
                <option value="Hindi" className="text-slate-900 bg-white">Hindi</option>
              </select>
            </div>

            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-1.5 rounded hover:bg-[#244b6b] text-sky-200 hover:text-white transition-colors"
              title={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Lower Controls & High-Visibility Countdown Timer Strip */}
        <div className="px-4 py-1.5 bg-[#0e273c] flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Question Paper Review button */}
            <button
              type="button"
              onClick={() => setIsQuestionPaperModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#183b56] hover:bg-[#224e73] text-white font-semibold text-xs border border-[#2b5982] transition-colors cursor-pointer"
            >
              <FileText className="h-3.5 w-3.5 text-sky-300" />
              <span>Question Paper</span>
            </button>

            {/* Instructions popup button */}
            <button
              type="button"
              onClick={() => setIsInstructionsModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#183b56] hover:bg-[#224e73] text-white font-semibold text-xs border border-[#2b5982] transition-colors cursor-pointer"
            >
              <HelpCircle className="h-3.5 w-3.5 text-sky-300" />
              <span>Instructions</span>
            </button>

            {/* Mobile Question Palette Toggle */}
            <button
              type="button"
              onClick={() => setIsMobilePaletteOpen(!isMobilePaletteOpen)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs"
            >
              <Menu className="h-3.5 w-3.5" />
              <span>Palette</span>
            </button>
          </div>

          {/* Official High-Contrast Countdown Clock */}
          <div className="flex items-center gap-2">
            <span className="text-slate-300 text-xs font-semibold hidden sm:inline">Time Left :</span>
            <div 
              className={`flex items-center gap-1.5 px-3.5 py-1 rounded font-mono font-black text-sm tracking-widest shadow-inner ${
                isLowTime 
                  ? 'bg-red-700 text-white animate-pulse'
                  : isWarningTime
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-white text-[#183b56]'
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              <span>{formatTime(timeRemaining)}</span>
            </div>
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 2. OFFICIAL SUBJECT NAVIGATION TABS */}
      {/* (Physics, Chemistry, Mathematics with real-time stats) */}
      {/* ============================================================ */}
      <nav 
        aria-label="CBT Subject Navigation"
        className="bg-[#e4ebf2] border-b border-[#c4d3e0] px-3 sm:px-6 py-1.5 flex-shrink-0"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          {/* Three clearly visible subject tabs */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none">
            {(['Physics', 'Chemistry', 'Mathematics'] as Subject[]).map((sub) => {
              const isActive = currentSubject === sub;
              const stats = getSubjectStatusCounts(sub);
              const SubIcon = sub === 'Physics' ? Atom : sub === 'Chemistry' ? FlaskConical : Calculator;

              return (
                <button
                  key={sub}
                  type="button"
                  onClick={() => handleSwitchSubject(sub)}
                  className={`flex items-center gap-2.5 px-4 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer select-none rounded-t-lg border-t-2 ${
                    isActive
                      ? 'bg-white text-[#183b56] border-[#183b56] shadow-sm -mb-2 pb-3.5 z-10'
                      : 'bg-[#d5e0ea] hover:bg-[#cad8e4] text-slate-700 border-transparent hover:text-slate-900'
                  }`}
                >
                  <SubIcon className={`h-4 w-4 ${isActive ? 'text-[#183b56]' : 'text-slate-500'}`} />
                  <span>{sub}</span>

                  {/* Subject status badge */}
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
                    isActive 
                      ? 'bg-emerald-100 text-emerald-800 font-bold' 
                      : 'bg-slate-300 text-slate-800'
                  }`}>
                    {stats.totalAnswered} / 25
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Info & Bookmark Toggle */}
          <div className="flex items-center gap-3 text-xs self-end sm:self-auto py-0.5">
            <span className="font-semibold text-slate-600 hidden md:inline">
              {currentSubject}: Question {currentQuestionIndex + 1} of 25
            </span>

            <button
              type="button"
              onClick={toggleBookmark}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold border transition-all cursor-pointer ${
                isBookmarked
                  ? 'bg-amber-100 border-amber-400 text-amber-800 shadow-xs'
                  : 'bg-white border-slate-300 hover:bg-slate-100 text-slate-700'
              }`}
              title={isBookmarked ? 'Question bookmarked for revision' : 'Bookmark this question'}
            >
              {isBookmarked ? <BookmarkCheck className="h-3.5 w-3.5 text-amber-700" /> : <Bookmark className="h-3.5 w-3.5 text-slate-500" />}
              <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ============================================================ */}
      {/* 3. MAIN EXAMINATION WORKSPACE: QUESTION + PALETTE */}
      {/* ============================================================ */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative bg-white">
        {/* LEFT COLUMN: ACTIVE QUESTION DISPLAY AREA */}
        <main className={`flex-1 flex flex-col justify-between overflow-y-auto p-4 sm:p-6 lg:p-7 border-r border-slate-300 transition-opacity duration-100 ${isSubjectFading ? 'opacity-30' : 'opacity-100'}`}>
          {currentQuestion ? (
            <div className="max-w-4xl w-full mx-auto space-y-5">
              {/* Official Question Header & Marking Scheme Banner */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b-2 border-slate-200">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-base sm:text-lg font-black text-[#183b56]">
                    Question No. {currentQuestionIndex + 1}
                  </span>
                  <span className="text-slate-400">|</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300">
                    {currentQuestion.type === 'MCQ' ? 'Section A: Single Choice Type' : 'Section B: Numerical Value Type'}
                  </span>
                </div>

                {/* Marking Scheme */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-slate-500">Marks for correct answer:</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    +4
                  </span>
                  <span className="font-semibold text-slate-500">Negative Marks:</span>
                  <span className="font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                    -1
                  </span>
                </div>
              </div>

              {/* Chapter Information Banner (Clean, NO year or source tags) */}
              <div className="text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-500">Subject: </span>
                  <span className="font-bold text-[#183b56]">{currentSubject}</span>
                  <span className="mx-2 text-slate-400">·</span>
                  <span className="font-semibold text-slate-500">Topic: </span>
                  <span className="font-medium text-slate-800">{currentQuestion.chapter}</span>
                </div>
                <span className="text-[11px] text-slate-500 italic">
                  {selectedLanguage === 'Hindi' ? '(English original view active)' : 'Language: English'}
                </span>
              </div>

              {/* Question Statement with KaTeX Formulas */}
              <div className="text-base sm:text-lg font-normal text-slate-900 leading-relaxed min-h-[70px] py-2">
                <MathRenderer content={currentQuestion.questionText} />
              </div>

              {/* Answers: MCQ Radio Options OR Numerical Virtual Pad */}
              {currentQuestion.type === 'MCQ' ? (
                <div className="space-y-3 pt-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Options:
                  </p>
                  <div className="grid grid-cols-1 gap-2.5">
                    {currentQuestion.options?.map((opt, optIdx) => {
                      const letter = String.fromCharCode(65 + optIdx); // A, B, C, D
                      const isSelected = responses[currentQuestion.id]?.userAnswer === letter;

                      return (
                        <button
                          key={letter}
                          type="button"
                          onClick={() => handleSelectOption(letter)}
                          className={`w-full flex items-start gap-3.5 p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#183b56] bg-blue-50/80 text-slate-900 ring-2 ring-[#183b56]/20 shadow-xs'
                              : 'border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50/90 text-slate-800'
                          }`}
                        >
                          {/* Radio Dot */}
                          <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 text-xs font-bold flex-shrink-0 mt-0.5 ${
                            isSelected
                              ? 'border-[#183b56] bg-[#183b56] text-white'
                              : 'border-slate-400 bg-white text-slate-700'
                          }`}>
                            {letter}
                          </div>
                          <div className="flex-1 text-sm sm:text-base leading-relaxed pt-0.5">
                            <MathRenderer content={opt} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* NUMERICAL VALUE INPUT WITH VIRTUAL KEYPAD */
                <div className="pt-2 space-y-4 max-w-md">
                  <div>
                    <label htmlFor="num-input" className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                      Enter Numerical Value:
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Use the on-screen virtual keypad or physical keyboard to enter decimal/integer values.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      id="num-input"
                      type="text"
                      inputMode="decimal"
                      value={numericalInput}
                      onChange={(e) => handleNumericalChange(e.target.value)}
                      placeholder="e.g. 15 or 3.14 or -2"
                      className="w-full text-xl font-mono font-bold px-4 py-2.5 rounded-lg border-2 border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-[#183b56]"
                    />
                    <button
                      type="button"
                      onClick={handleClearResponse}
                      className="p-2.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                      title="Clear value"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  {/* CBT Official Numeric Virtual Keypad */}
                  <div className="bg-slate-100 p-3 rounded-lg border border-slate-300">
                    <div className="grid grid-cols-4 gap-2">
                      {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.', '-'].map((key) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => handleNumericalChange(numericalInput + key)}
                          className="py-2.5 rounded bg-white hover:bg-slate-50 border border-slate-300 font-mono font-bold text-sm text-slate-800 shadow-xs active:scale-95 transition-all cursor-pointer"
                        >
                          {key}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleNumericalChange(numericalInput.slice(0, -1))}
                        className="col-span-2 py-2 rounded bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs active:scale-95 transition-all cursor-pointer"
                      >
                        Backspace
                      </button>
                      <button
                        type="button"
                        onClick={handleClearResponse}
                        className="col-span-2 py-2 rounded bg-slate-200 hover:bg-slate-300 border border-slate-300 text-slate-800 font-bold text-xs active:scale-95 transition-all cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {/* ============================================================ */}
          {/* 4. OFFICIAL CBT BOTTOM ACTION CONTROLS */}
          {/* ============================================================ */}
          <div className="mt-8 pt-4 border-t-2 border-slate-200 flex flex-wrap items-center justify-between gap-2 max-w-4xl w-full mx-auto">
            {/* Left Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleSaveAndNext}
                className="px-5 py-2 rounded bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                Save & Next
              </button>

              <button
                type="button"
                onClick={handleSaveAndMarkForReview}
                className="px-4 py-2 rounded bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                Save & Mark for Review
              </button>

              <button
                type="button"
                onClick={handleClearResponse}
                className="px-4 py-2 rounded border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                Clear Response
              </button>

              <button
                type="button"
                onClick={handleSaveAndMarkForReview}
                className="px-4 py-2 rounded bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                Mark for Review & Next
              </button>
            </div>

            {/* Right Action Navigation & Final Submit */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0 && currentSubject === 'Physics'}
                className="flex items-center gap-1 px-3.5 py-2 rounded border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs sm:text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={currentQuestionIndex === 24 && currentSubject === 'Mathematics'}
                className="flex items-center gap-1 px-3.5 py-2 rounded border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs sm:text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(true)}
                className="px-5 py-2 rounded bg-[#0284c7] hover:bg-[#0369a1] text-white font-extrabold text-xs sm:text-sm shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                Submit
              </button>
            </div>
          </div>
        </main>

        {/* ============================================================ */}
        {/* 5. OFFICIAL NTA RIGHT-HAND QUESTION PALETTE */}
        {/* ============================================================ */}
        <aside 
          className={`
            fixed lg:static inset-y-0 right-0 z-40 lg:z-auto
            w-80 bg-[#f4f7fa] border-l border-slate-300 p-3 sm:p-4
            flex flex-col justify-between overflow-y-auto space-y-4
            transition-transform duration-150 ease-in-out
            ${isMobilePaletteOpen ? 'translate-x-0 shadow-2xl' : 'translate-x-full lg:translate-x-0'}
          `}
        >
          <div className="space-y-4">
            {/* Mobile Header with close button */}
            <div className="flex items-center justify-between lg:hidden border-b border-slate-300 pb-2">
              <span className="font-extrabold text-sm text-[#183b56]">
                Question Palette
              </span>
              <button
                type="button"
                onClick={() => setIsMobilePaletteOpen(false)}
                className="p-1 rounded text-slate-500 hover:text-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Candidate Box */}
            <div className="p-3 bg-white rounded border border-slate-300 shadow-xs flex items-center gap-3">
              <div className="h-12 w-12 rounded bg-slate-200 text-[#183b56] flex items-center justify-center font-bold text-sm border border-slate-300 flex-shrink-0">
                <User className="h-7 w-7 text-slate-500" />
              </div>
              <div className="text-xs leading-tight">
                <p className="font-bold text-slate-900">{user.name}</p>
                <p className="text-slate-500 text-[11px] font-mono mt-0.5">Roll: {rollNumber}</p>
                <p className="text-[#0284c7] text-[10px] font-bold mt-0.5">Term: {systemName}</p>
              </div>
            </div>

            {/* Official NTA Status Badges Legend */}
            <div className="p-3 bg-white rounded border border-slate-300 space-y-2 text-xs shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                <p className="font-bold text-[#183b56] text-[11px] uppercase tracking-wider">
                  Legend
                </p>
                <span className="text-[10px] font-semibold text-slate-500">
                  {currentSubject}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div className="flex items-center gap-2">
                  <div className="palette-btn palette-answered">{currentStats.answered}</div>
                  <span className="text-slate-700 font-medium">Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="palette-btn palette-not-answered">{currentStats.notAnswered}</div>
                  <span className="text-slate-700 font-medium">Not Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="palette-btn palette-not-visited">{currentStats.notVisited}</div>
                  <span className="text-slate-700 font-medium">Not Visited</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="palette-btn palette-marked-review">{currentStats.marked}</div>
                  <span className="text-slate-700 font-medium">Marked for Review</span>
                </div>
                <div className="flex items-center gap-2 col-span-2 pt-1 border-t border-slate-100">
                  <div className="palette-btn palette-answered-marked">{currentStats.answeredMarked}</div>
                  <span className="text-slate-700 font-medium text-[10.5px]">
                    Ans & Marked for Review (Evaluated)
                  </span>
                </div>
              </div>
            </div>

            {/* Questions Grid with Sections */}
            <div className="p-3 bg-white rounded border border-slate-300 space-y-3.5 shadow-xs">
              {/* Section A: Q1-20 (MCQ) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-[#183b56] uppercase tracking-wider">
                    Section A · MCQs (1–20)
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">+4, −1</span>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {currentSubjectQuestions.slice(0, 20).map((q, idx) => {
                    const resp = responses[q.id];
                    const status = resp?.status || 'NOT_VISITED';
                    const isCurrent = idx === currentQuestionIndex;

                    let styleClass = 'palette-not-visited';
                    if (status === 'ANSWERED') styleClass = 'palette-answered';
                    else if (status === 'NOT_ANSWERED') styleClass = 'palette-not-answered';
                    else if (status === 'MARKED_FOR_REVIEW') styleClass = 'palette-marked-review';
                    else if (status === 'ANSWERED_AND_MARKED_FOR_REVIEW') styleClass = 'palette-answered-marked';

                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => handleJumpToQuestion(idx)}
                        className={`palette-btn ${styleClass} ${
                          isCurrent ? 'ring-2 ring-blue-600 ring-offset-1 scale-105 z-10' : ''
                        }`}
                        title={`Question ${idx + 1}: ${status}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section B: Q21-25 (Numerical) */}
              <div className="pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-[#183b56] uppercase tracking-wider">
                    Section B · Numerical (21–25)
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">+4, −1</span>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {currentSubjectQuestions.slice(20, 25).map((q, idx) => {
                    const actualIdx = idx + 20;
                    const resp = responses[q.id];
                    const status = resp?.status || 'NOT_VISITED';
                    const isCurrent = actualIdx === currentQuestionIndex;

                    let styleClass = 'palette-not-visited';
                    if (status === 'ANSWERED') styleClass = 'palette-answered';
                    else if (status === 'NOT_ANSWERED') styleClass = 'palette-not-answered';
                    else if (status === 'MARKED_FOR_REVIEW') styleClass = 'palette-marked-review';
                    else if (status === 'ANSWERED_AND_MARKED_FOR_REVIEW') styleClass = 'palette-answered-marked';

                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => handleJumpToQuestion(actualIdx)}
                        className={`palette-btn ${styleClass} ${
                          isCurrent ? 'ring-2 ring-blue-600 ring-offset-1 scale-105 z-10' : ''
                        }`}
                        title={`Question ${actualIdx + 1}: ${status}`}
                      >
                        {actualIdx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Full Test Submit Action in Palette */}
          <button
            type="button"
            onClick={() => setIsSubmitModalOpen(true)}
            className="w-full py-2.5 rounded bg-[#0284c7] hover:bg-[#0369a1] text-white font-extrabold text-xs uppercase tracking-wider shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            Submit Examination
          </button>
        </aside>

        {/* Mobile Backdrop for Palette */}
        {isMobilePaletteOpen && (
          <div 
            onClick={() => setIsMobilePaletteOpen(false)}
            className="lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-xs"
          />
        )}
      </div>

      {/* ============================================================ */}
      {/* 6. OFFICIAL NTA SUBMISSION CONFIRMATION MODAL */}
      {/* ============================================================ */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white rounded-lg border-2 border-[#183b56] shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-extrabold text-[#183b56] flex items-center gap-2">
                <Info className="h-5 w-5 text-[#0284c7]" />
                <span>Examination Summary</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Please review your question attempt summary across all three subjects before confirming final submission:
            </p>

            {/* Official NTA Summary Table */}
            <div className="overflow-x-auto rounded border border-slate-300">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#183b56] text-white font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Subject</th>
                    <th className="py-2.5 px-2 text-center">No. of Qs</th>
                    <th className="py-2.5 px-2 text-center text-emerald-300">Answered</th>
                    <th className="py-2.5 px-2 text-center text-rose-300">Not Answered</th>
                    <th className="py-2.5 px-2 text-center text-purple-300">Marked Review</th>
                    <th className="py-2.5 px-2 text-center text-amber-300">Ans & Marked</th>
                    <th className="py-2.5 px-2 text-center text-slate-300">Not Visited</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium">
                  {(['Physics', 'Chemistry', 'Mathematics'] as Subject[]).map((sub) => {
                    const stats = getSubjectStatusCounts(sub);
                    return (
                      <tr key={sub} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-bold text-[#183b56]">{sub}</td>
                        <td className="py-2.5 px-2 text-center font-bold">25</td>
                        <td className="py-2.5 px-2 text-center text-emerald-700 font-bold">{stats.answered}</td>
                        <td className="py-2.5 px-2 text-center text-rose-700 font-bold">{stats.notAnswered}</td>
                        <td className="py-2.5 px-2 text-center text-purple-700 font-bold">{stats.marked}</td>
                        <td className="py-2.5 px-2 text-center text-amber-700 font-bold">{stats.answeredMarked}</td>
                        <td className="py-2.5 px-2 text-center text-slate-600">{stats.notVisited}</td>
                      </tr>
                    );
                  })}
                  {/* Total Row */}
                  <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
                    <td className="py-2.5 px-3">Total</td>
                    <td className="py-2.5 px-2 text-center">75</td>
                    <td className="py-2.5 px-2 text-center text-emerald-700">
                      {getSubjectStatusCounts('Physics').answered + getSubjectStatusCounts('Chemistry').answered + getSubjectStatusCounts('Mathematics').answered}
                    </td>
                    <td className="py-2.5 px-2 text-center text-rose-700">
                      {getSubjectStatusCounts('Physics').notAnswered + getSubjectStatusCounts('Chemistry').notAnswered + getSubjectStatusCounts('Mathematics').notAnswered}
                    </td>
                    <td className="py-2.5 px-2 text-center text-purple-700">
                      {getSubjectStatusCounts('Physics').marked + getSubjectStatusCounts('Chemistry').marked + getSubjectStatusCounts('Mathematics').marked}
                    </td>
                    <td className="py-2.5 px-2 text-center text-amber-700">
                      {getSubjectStatusCounts('Physics').answeredMarked + getSubjectStatusCounts('Chemistry').answeredMarked + getSubjectStatusCounts('Mathematics').answeredMarked}
                    </td>
                    <td className="py-2.5 px-2 text-center text-slate-600">
                      {getSubjectStatusCounts('Physics').notVisited + getSubjectStatusCounts('Chemistry').notVisited + getSubjectStatusCounts('Mathematics').notVisited}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Warning Note */}
            <div className="p-3 bg-amber-50 border border-amber-300 rounded text-xs text-amber-900 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p>
                Are you sure you want to submit the examination? You will not be allowed to modify any answers after submission. Your responses will be scored immediately.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="px-4 py-2 rounded border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
              >
                No, Return to Examination
              </button>
              <button
                type="button"
                onClick={() => handleSubmitExam(false)}
                disabled={isSubmitting}
                className="px-5 py-2 rounded bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
              >
                {isSubmitting ? 'Evaluating Responses...' : 'Yes, Submit Examination'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 7. FULL QUESTION PAPER MODAL */}
      {/* ============================================================ */}
      {isQuestionPaperModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-4xl max-h-[85vh] bg-white rounded-lg border-2 border-[#183b56] shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 bg-[#183b56] text-white rounded-t-sm">
              <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                <FileText className="h-4 w-4 text-sky-300" />
                <span>Complete Question Paper — Paper 1 (B.E./B.Tech)</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsQuestionPaperModalOpen(false)}
                className="p-1 rounded hover:bg-white/10 text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
              {(['Physics', 'Chemistry', 'Mathematics'] as Subject[]).map((sub) => {
                const subQuestions = 
                  sub === 'Physics' ? testPaper.physicsQuestions :
                  sub === 'Chemistry' ? testPaper.chemistryQuestions :
                  testPaper.mathsQuestions;

                return (
                  <div key={sub} className="space-y-3">
                    <h4 className="text-sm font-extrabold text-[#183b56] border-b-2 border-[#183b56] pb-1">
                      {sub} (25 Questions)
                    </h4>
                    <div className="space-y-3">
                      {subQuestions.map((q, qIdx) => (
                        <div key={q.id} className="p-3 rounded border border-slate-200 bg-slate-50 space-y-1.5">
                          <div className="flex items-center justify-between font-bold text-xs text-slate-700">
                            <span>Q.{qIdx + 1} ({q.type === 'MCQ' ? 'Section A: Single Choice' : 'Section B: Numerical'})</span>
                            <span className="text-[11px] font-medium text-slate-500">{q.chapter}</span>
                          </div>
                          <div className="text-slate-900 leading-relaxed">
                            <MathRenderer content={q.questionText} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3 bg-slate-100 border-t border-slate-300 flex justify-end">
              <button
                type="button"
                onClick={() => setIsQuestionPaperModalOpen(false)}
                className="px-4 py-1.5 rounded bg-[#183b56] hover:bg-[#244b6b] text-white text-xs font-bold transition-all cursor-pointer"
              >
                Close & Return
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 8. OFFICIAL NTA TEST INSTRUCTIONS MODAL */}
      {/* ============================================================ */}
      {isInstructionsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-3xl max-h-[85vh] bg-white rounded-lg border-2 border-[#183b56] shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 bg-[#183b56] text-white rounded-t-sm">
              <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-sky-300" />
                <span>General Examination Instructions</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsInstructionsModalOpen(false)}
                className="p-1 rounded hover:bg-white/10 text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs sm:text-sm text-slate-800 leading-relaxed">
              <div>
                <h4 className="font-bold text-[#183b56] mb-1">1. General Instructions:</h4>
                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                  <li>Total duration of the examination is <strong>180 minutes</strong> (3 hours).</li>
                  <li>The clock will be set at the server. The countdown timer in the top right corner displays remaining time.</li>
                  <li>When the timer reaches zero, the examination will end automatically. You are not required to end or submit your examination.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-[#183b56] mb-1">2. Question Palette Symbols & Meanings:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                  <div className="flex items-center gap-2 p-2 rounded bg-slate-50 border border-slate-200">
                    <div className="palette-btn palette-not-visited">1</div>
                    <span>You have not visited the question yet.</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded bg-slate-50 border border-slate-200">
                    <div className="palette-btn palette-not-answered">2</div>
                    <span>You have not answered the question.</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded bg-slate-50 border border-slate-200">
                    <div className="palette-btn palette-answered">3</div>
                    <span>You have answered the question.</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded bg-slate-50 border border-slate-200">
                    <div className="palette-btn palette-marked-review">4</div>
                    <span>You have marked the question for review without answering.</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded bg-slate-50 border border-slate-200 col-span-1 sm:col-span-2">
                    <div className="palette-btn palette-answered-marked">5</div>
                    <span>The question has been answered and marked for review. <strong>It will be considered for evaluation.</strong></span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-[#183b56] mb-1">3. Navigating to a Question:</h4>
                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                  <li>Click on the question number in the Question Palette to go directly to that question.</li>
                  <li>Click on <strong>Save & Next</strong> to save your answer for the current question and go to the next question.</li>
                  <li>Click on <strong>Mark for Review & Next</strong> to save your answer and mark it for review, or mark without answering.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-[#183b56] mb-1">4. Answering Questions:</h4>
                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                  <li>For Multiple Choice Questions: Select one option (A, B, C, or D). To deselect, click <strong>Clear Response</strong>.</li>
                  <li>For Numerical Questions: Enter the numerical answer in the text box using the virtual keypad or keyboard.</li>
                  <li>Scoring Scheme: <strong>+4 marks</strong> for correct answer, <strong>-1 mark</strong> for incorrect answer, <strong>0 marks</strong> for unattempted.</li>
                </ul>
              </div>
            </div>

            <div className="p-3 bg-slate-100 border-t border-slate-300 flex justify-end">
              <button
                type="button"
                onClick={() => setIsInstructionsModalOpen(false)}
                className="px-4 py-1.5 rounded bg-[#183b56] hover:bg-[#244b6b] text-white text-xs font-bold transition-all cursor-pointer"
              >
                Close & Return to Exam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

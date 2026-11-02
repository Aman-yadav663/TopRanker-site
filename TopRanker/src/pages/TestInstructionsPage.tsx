import React, { useState } from 'react';
import { 
  Play, 
  ArrowLeft, 
  CheckSquare, 
  Square, 
  ShieldAlert, 
  Clock, 
  Award, 
  HelpCircle,
  AlertTriangle
} from 'lucide-react';
import { TEST_CATALOG_METADATA } from '../data/mockTestsCatalog';

interface TestInstructionsPageProps {
  slotNumber: number;
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const TestInstructionsPage: React.FC<TestInstructionsPageProps> = ({
  slotNumber,
  onNavigate
}) => {
  const [declared, setDeclared] = useState(false);
  const [showError, setShowError] = useState(false);
  const testMeta = TEST_CATALOG_METADATA.find(t => t.slotNumber === slotNumber) || TEST_CATALOG_METADATA[0];

  const handleStartExam = () => {
    if (!declared) {
      setShowError(true);
      return;
    }
    onNavigate('live-test', { slotNumber });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
        <button
          onClick={() => onNavigate('tests')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Tests</span>
        </button>

        <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
          Official CBT Exam Guidelines
        </span>
      </div>

      {/* Test Title Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Full-Length Mock Test {slotNumber < 10 ? `0${slotNumber}` : slotNumber}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              JEE Main Paper 1 (B.E./B.Tech.) · 75 Questions (Physics, Chemistry, Mathematics)
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-xl">
              <Clock className="h-4 w-4 text-blue-600" />
              <span>180 Minutes (3 Hours)</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-xl">
              <Award className="h-4 w-4 text-emerald-600" />
              <span>300 Maximum Marks</span>
            </div>
          </div>
        </div>
      </div>

      {/* General Instructions Content */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-6 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            1. General Examination Instructions
          </h2>
          <ol className="list-decimal pl-5 space-y-2 text-xs sm:text-sm">
            <li>
              The total duration of the examination is <strong>180 minutes</strong> (3 hours).
            </li>
            <li>
              The clock in the top-right corner of the exam screen will display the remaining time available for you to complete the test. When the timer reaches zero, the examination will automatically end and your answers will be submitted.
            </li>
            <li>
              The paper consists of <strong>75 questions</strong> divided into three subjects: <strong>Physics (25), Chemistry (25), and Mathematics (25)</strong>.
            </li>
            <li>
              Each subject contains two sections:
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li><strong>Section A:</strong> 20 Multiple Choice Questions (MCQs) with four options and a single correct answer.</li>
                <li><strong>Section B:</strong> 5 Numerical Value Questions where the answer is an integer or decimal number.</li>
              </ul>
            </li>
          </ol>
        </div>

        {/* Question Palette Color Legend */}
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-3">
            2. Question Status Palette Legend
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            The question palette on the right side of the screen will display the status of each question using the official color indicators:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40">
              <div className="palette-btn palette-not-visited">1</div>
              <div className="text-xs">
                <p className="font-bold text-slate-900 dark:text-white">Not Visited</p>
                <p className="text-slate-500 dark:text-slate-400">You have not visited the question yet.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40">
              <div className="palette-btn palette-not-answered">2</div>
              <div className="text-xs">
                <p className="font-bold text-red-600 dark:text-red-400">Not Answered</p>
                <p className="text-slate-500 dark:text-slate-400">You have visited but not answered the question.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40">
              <div className="palette-btn palette-answered">3</div>
              <div className="text-xs">
                <p className="font-bold text-emerald-600 dark:text-emerald-400">Answered</p>
                <p className="text-slate-500 dark:text-slate-400">You have saved an answer for this question.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40">
              <div className="palette-btn palette-marked-review">4</div>
              <div className="text-xs">
                <p className="font-bold text-purple-600 dark:text-purple-400">Marked for Review</p>
                <p className="text-slate-500 dark:text-slate-400">Marked for review without answering (NOT evaluated).</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40 sm:col-span-2">
              <div className="palette-btn palette-answered-marked">5</div>
              <div className="text-xs">
                <p className="font-bold text-purple-600 dark:text-purple-400">Answered & Marked for Review</p>
                <p className="text-slate-500 dark:text-slate-400">The question has been answered AND marked for review (WILL be evaluated in final score).</p>
              </div>
            </div>
          </div>
        </div>

        {/* Marking Scheme */}
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            3. Official Marking Scheme
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900">
              <p className="font-extrabold text-emerald-800 dark:text-emerald-300 text-sm">+4 Marks</p>
              <p className="text-emerald-700 dark:text-emerald-400 mt-0.5">Awarded for each correct answer</p>
            </div>
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900">
              <p className="font-extrabold text-red-800 dark:text-red-300 text-sm">−1 Mark</p>
              <p className="text-red-700 dark:text-red-400 mt-0.5">Deducted for each incorrect answer (Negative Marking)</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <p className="font-extrabold text-slate-800 dark:text-slate-200 text-sm">0 Marks</p>
              <p className="text-slate-600 dark:text-slate-400 mt-0.5">For unattempted or left blank questions</p>
            </div>
          </div>
        </div>

        {/* Navigating and Answering */}
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            4. Answering Procedure
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
            <li>To select an answer in MCQs, click on the corresponding option button (A, B, C, or D).</li>
            <li>For numerical value questions, enter the numerical value using your keyboard or the on-screen keypad.</li>
            <li>Click <strong>Save & Next</strong> to save your answer and move to the next question.</li>
            <li>Click <strong>Clear Response</strong> if you wish to deselect your selected option.</li>
            <li>Click <strong>Mark for Review & Next</strong> if you wish to review the question later.</li>
          </ul>
        </div>
      </div>

      {/* Candidate Declaration Box */}
      <div className="rounded-2xl border-2 border-blue-500/40 bg-blue-50/50 p-6 dark:bg-blue-950/20 space-y-4">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={declared}
            onChange={(e) => setDeclared(e.target.checked)}
            className="mt-1 h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-700"
          />
          <span className="text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200">
            <strong>Candidate Declaration:</strong> I have read and understood all the instructions mentioned above. I agree to abide by the rules of the examination and will attempt this test under authentic exam conditions without unfair means.
          </span>
        </label>

        {showError && !declared && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 font-medium">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            <span>Please check the declaration box above to confirm you have read the instructions before starting.</span>
          </div>
        )}

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Clicking below will start the 180-minute countdown timer immediately.
          </p>

          <button
            onClick={handleStartExam}
            disabled={!declared}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all ${
              declared
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/25 active:scale-[0.98]'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600'
            }`}
          >
            <Play className="h-4 w-4 fill-current" />
            <span>I Am Ready to Begin</span>
          </button>
        </div>
      </div>
    </div>
  );
};

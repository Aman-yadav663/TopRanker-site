export type Subject = 'Physics' | 'Chemistry' | 'Mathematics';

export type QuestionType = 'MCQ' | 'NUMERICAL';

export type VerificationStatus = 'VERIFIED_OFFICIAL' | 'VERIFIED_ANSWER_KEY' | 'UNDER_VERIFICATION';

export interface Question {
  id: string;
  subject: Subject;
  chapter: string;
  topic?: string;
  type: QuestionType;
  questionText: string;
  options?: string[]; // 4 options for MCQ
  correctAnswer: string; // e.g. "A", "B", "C", "D" or numeric string like "4", "25", "12.5"
  detailedSolution: string;
  year: number; // 2025 or 2026
  session: 'January' | 'April';
  examDate?: string; // e.g. "2025-01-24"
  shift: 'Shift 1' | 'Shift 2';
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  sourceReference: string; // e.g. "NTA JEE Main 2025 Jan 24 Shift 1 Q.14"
  verificationStatus: VerificationStatus;
  isOfficialPYQ: boolean;
  numericalTolerance?: number; // for numerical questions, default 0
}

export type TestCategory = 'CATEGORY_A_2025' | 'CATEGORY_B_2026' | 'CATEGORY_C_MIXED';

export type CompletenessStatus = 'COMPLETE_VERIFIED' | 'UNDER_VERIFICATION';

export interface TestPaper {
  id: string;
  slotNumber: number; // 1 to 30
  title: string;
  shortCode: string;
  category: TestCategory;
  year: 2025 | 2026 | 'Mixed';
  session: string;
  examDate?: string;
  shift: string;
  durationMinutes: number; // 180
  totalMarks: number; // 300
  totalQuestions: number; // 75
  physicsQuestions: Question[]; // 25 questions: 20 MCQ + 5 Numerical
  chemistryQuestions: Question[]; // 25 questions: 20 MCQ + 5 Numerical
  mathsQuestions: Question[]; // 25 questions: 20 MCQ + 5 Numerical
  isPublished: boolean;
  completenessStatus: CompletenessStatus;
  verifiedQuestionCount: number;
  verificationNote: string;
}

export type QuestionAttemptStatus =
  | 'NOT_VISITED'
  | 'NOT_ANSWERED'
  | 'ANSWERED'
  | 'MARKED_FOR_REVIEW'
  | 'ANSWERED_AND_MARKED_FOR_REVIEW';

export interface QuestionResponse {
  questionId: string;
  subject: Subject;
  userAnswer?: string;
  status: QuestionAttemptStatus;
  timeSpentSeconds: number;
  isCorrect?: boolean;
  marksAwarded?: number;
}

export interface TestAttempt {
  id: string;
  testId: string;
  testTitle: string;
  userId: string;
  userName: string;
  startedAt: number;
  submittedAt?: number;
  timeRemainingSeconds: number;
  isSubmitted: boolean;
  responses: Record<string, QuestionResponse>;
  scoreResult?: TestResult;
  emailNotificationStatus?: 'SENT' | 'PENDING' | 'FAILED' | 'SKIPPED' | 'SANDBOX_LOGGED';
  emailNotificationSentAt?: number;
  emailNotificationError?: string;
}

export interface SubjectScore {
  attempted: number;
  correct: number;
  incorrect: number;
  unattempted: number;
  score: number; // out of 100
  accuracy: number;
  timeSpentSeconds: number;
}

export interface ChapterAnalysis {
  chapter: string;
  subject: Subject;
  total: number;
  attempted: number;
  correct: number;
  incorrect: number;
  accuracy: number;
}

export interface TestResult {
  attemptId: string;
  testId: string;
  testTitle: string;
  userId: string;
  totalScore: number; // out of 300
  totalAttempted: number;
  totalCorrect: number;
  totalIncorrect: number;
  totalUnattempted: number;
  overallAccuracy: number;
  timeTakenSeconds: number;
  physics: SubjectScore;
  chemistry: SubjectScore;
  mathematics: SubjectScore;
  percentileEstimate: number;
  estimatedRank: number;
  chapterWiseAnalysis: ChapterAnalysis[];
  weakChapters: string[];
  strongChapters: string[];
  submittedAt: number;
  emailNotificationStatus?: 'SENT' | 'PENDING' | 'FAILED' | 'SKIPPED' | 'SANDBOX_LOGGED';
  emailNotificationSentAt?: number;
  emailNotificationError?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  targetYear: 2025 | 2026;
  targetPercentile: number;
  targetCollege: string;
  category: 'General' | 'OBC-NCL' | 'EWS' | 'SC' | 'ST';
  createdAt: number;
}

export interface BookmarkItem {
  id: string;
  questionId: string;
  subject: Subject;
  chapter: string;
  year: number;
  shift: string;
  note?: string;
  savedAt: number;
}

export interface MistakeItem {
  questionId: string;
  testId: string;
  testTitle: string;
  userAnswer: string;
  correctAnswer: string;
  subject: Subject;
  chapter: string;
  timestamp: number;
  mistakeReason?: 'Calculation Error' | 'Conceptual Gap' | 'Misread Question' | 'Guess / Panic';
}

export type UserRole = 'student' | 'admin';

export type MembershipStatus = 'FREE' | 'PREMIUM_ACTIVE' | 'EXPIRED';

export interface UserMembership {
  planId: string;
  planName: string;
  status: MembershipStatus;
  validUntil: number; // timestamp in ms
  paymentId?: string;
  orderId?: string;
  activatedAt?: number;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  targetYear: 2025 | 2026;
  targetPercentile: number;
  targetCollege: string;
  category: 'General' | 'OBC-NCL' | 'EWS' | 'SC' | 'ST';
  membership: UserMembership;
  token?: string;
  isEmailVerified?: boolean;
  createdAt: number;
}

export interface MembershipPlan {
  id: string;
  name: string;
  tagline: string;
  priceINR: number;
  originalPriceINR: number;
  durationDays: number;
  badge?: string;
  isPopular?: boolean;
  features: string[];
  allowedSlots: number[] | 'ALL';
}

export type PaymentStatus = 'SUCCESS' | 'FAILED' | 'PENDING';

export interface PaymentRecord {
  id: string;
  orderId: string;
  paymentId: string;
  receiptNumber: string;
  userId: string;
  userEmail: string;
  userName: string;
  planId: string;
  planName: string;
  amountINR: number;
  currency: 'INR';
  status: PaymentStatus;
  paymentMethod?: string;
  signature?: string;
  errorReason?: string;
  createdAt: number;
}

export interface OtpRecord {
  email: string;
  otp: string;
  purpose: 'LOGIN' | 'REGISTER' | 'RESET_PASSWORD';
  name?: string;
  expiresAt: number;
  attempts: number;
  maxAttempts: number;
  createdAt: number;
}

export interface EmailNotificationLog {
  id: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  type: 'OTP' | 'TEST_RESULT' | 'MEMBERSHIP_RECEIPT';
  status: 'SENT' | 'FAILED' | 'SANDBOX_LOGGED';
  previewUrl?: string;
  error?: string;
  metadata?: Record<string, any>;
  sentAt: number;
}

export interface StudentAnalyticsSummary {
  totalAttempted: number;
  totalCompleted: number;
  avgScore: number;
  highestScore: number;
  lowestScore: number;
  overallAccuracy: number;
  totalQuestionsAttempted: number;
  totalQuestionsCorrect: number;
  totalQuestionsIncorrect: number;
  totalQuestionsUnanswered: number;
  avgTimePerQuestionSeconds: number;
  totalTimeSpentSeconds: number;
  physics: {
    scoreAvg: number;
    accuracy: number;
    attempted: number;
    correct: number;
    incorrect: number;
    timeSpentAvg: number;
  };
  chemistry: {
    scoreAvg: number;
    accuracy: number;
    attempted: number;
    correct: number;
    incorrect: number;
    timeSpentAvg: number;
  };
  mathematics: {
    scoreAvg: number;
    accuracy: number;
    attempted: number;
    correct: number;
    incorrect: number;
    timeSpentAvg: number;
  };
  strongChapters: { chapter: string; subject: Subject; accuracy: number; questionsCount: number }[];
  weakChapters: { chapter: string; subject: Subject; accuracy: number; questionsCount: number }[];
  recentResults: TestResult[];
  trends: {
    attemptId: string;
    testTitle: string;
    score: number;
    accuracy: number;
    percentile: number;
    submittedAt: number;
  }[];
}

export interface MindMapNode {
  id: string;
  title: string;
  description?: string;
  type?: 'concept' | 'formula' | 'reaction' | 'theorem' | 'trick' | 'graph';
  formula?: string;
  details?: string;
  subNodes?: {
    label: string;
    detail: string;
    formula?: string;
  }[];
}

export interface MindMapBranch {
  id: string;
  title: string;
  iconName?: string;
  color: string;
  summary: string;
  nodes: MindMapNode[];
}

export interface ChapterDiagram {
  id: string;
  title: string;
  category: string;
  caption: string;
  svgType: string;
  labels: { label: string; description: string }[];
  formula?: string;
}

export interface DetailedFormula {
  name: string;
  formula: string;
  siUnit?: string;
  dimensions?: string;
  conditions?: string;
  variables?: { symbol: string; meaning: string }[];
  commonMistake?: string;
  specialCase?: string;
}

export interface DetailedTopicNote {
  title: string;
  summary: string;
  keyPoints: string[];
  derivationSnippet?: string;
  examTip?: string;
}

export interface ChapterMindMap {
  id: string;
  chapterNumber: number;
  subject: Subject;
  category?: 'Physical Chemistry' | 'Inorganic Chemistry' | 'Organic Chemistry';
  title: string;
  tagline: string;
  centerConcept: {
    title: string;
    coreDefinition: string;
    keyLaw?: string;
  };
  weightage: string;
  difficulty: 'Easy' | 'Moderate' | 'High-Yield' | 'Conceptual';
  estimatedRevisionTime: string;
  oneMinuteSummary: {
    keyFormulas: { name: string; formula: string; note: string }[];
    mustRememberPoints: string[];
    commonPitfalls: string[];
    speedTricks: string[];
  };
  branches: MindMapBranch[];
  graphsAndRelations?: {
    title: string;
    description: string;
    formulaRelation?: string;
  }[];
  formulaSheet?: DetailedFormula[];
  diagrams?: ChapterDiagram[];
  detailedNotes?: DetailedTopicNote[];
}


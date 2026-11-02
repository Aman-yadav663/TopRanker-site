import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { 
  AuthUser, 
  MembershipPlan, 
  PaymentRecord, 
  UserMembership,
  OtpRecord,
  TestAttempt,
  StudentAnalyticsSummary,
  Subject
} from '../types.ts';

const DATA_DIR = path.resolve(import.meta.dirname, '../../.data');
const DB_FILE = path.join(DATA_DIR, 'jee_database.json');

const JWT_SECRET = process.env.JWT_SECRET || 'jee_pyq_30_jwt_secure_key_prod';

interface DBState {
  users: Record<string, AuthUser & { passwordHash: string }>;
  plans: MembershipPlan[];
  payments: PaymentRecord[];
  processedWebhookEvents: string[];
  otps: Record<string, OtpRecord>;
  testAttempts: Record<string, TestAttempt>;
}

// Initial Default Membership Plans
const DEFAULT_PLANS: MembershipPlan[] = [
  {
    id: 'plan_free_trial',
    name: 'Diagnostic Free Tier',
    tagline: 'Start with authentic CBT exam simulation',
    priceINR: 0,
    originalPriceINR: 0,
    durationDays: 365,
    badge: 'Free Starter',
    isPopular: false,
    allowedSlots: [1, 2],
    features: [
      'Access to Tests 01 & 02 (Full 75 Questions)',
      'Authentic 180-min CBT Interface',
      'Step-by-step KaTeX mathematical solutions',
      'Instant Percentile & AIR estimation'
    ]
  },
  {
    id: 'plan_crash_60d',
    name: 'JEE Crash Booster',
    tagline: 'Targeted full test series for Session 1 & 2',
    priceINR: 499,
    originalPriceINR: 1299,
    durationDays: 60,
    badge: 'Most Popular',
    isPopular: true,
    allowedSlots: 'ALL',
    features: [
      'Unrestricted Access to ALL 30 Full-Length Tests',
      'All 30 Category A, B & C Full Mock Papers',
      '2,250 Verified Physics, Chemistry & Math PYQs',
      'Detailed Derivations & Official NTA Answer Keys',
      'Advanced Chapter-wise & Topic Weakness Analytics',
      'Personal Mistake Notebook & Re-attempt Engine'
    ]
  },
  {
    id: 'plan_pro_180d',
    name: 'Complete Aspirant Pass (180 Days)',
    tagline: 'Ultimate preparation pack with extended validity',
    priceINR: 899,
    originalPriceINR: 2499,
    durationDays: 180,
    badge: 'Best Value',
    isPopular: false,
    allowedSlots: 'ALL',
    features: [
      'All 30 Full-Length Mock Papers for 6 Months',
      'Unlimited Re-attempts & Fresh CBT Simulations',
      'Session & Shift-wise Authentic PYQ Question Bank',
      'Chapter-wise & Subject-wise Instant Practice Drills',
      'Priority Academic Query Support & Answer Verification',
      'Printable Question Paper & Solution PDF Downloads'
    ]
  }
];

class DatabaseManager {
  private state: DBState = {
    users: {},
    plans: DEFAULT_PLANS,
    payments: [],
    processedWebhookEvents: [],
    otps: {},
    testAttempts: {}
  };

  constructor() {
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        this.state = {
          users: parsed.users || {},
          plans: parsed.plans && parsed.plans.length > 0 ? parsed.plans : DEFAULT_PLANS,
          payments: parsed.payments || [],
          processedWebhookEvents: parsed.processedWebhookEvents || [],
          otps: parsed.otps || {},
          testAttempts: parsed.testAttempts || {}
        };
      } else {
        // Seed initial admin and demo student account
        this.seedInitialAccounts();
        this.save();
      }
    } catch (e) {
      console.error('Error initializing database:', e);
      this.seedInitialAccounts();
    }
  }

  private seedInitialAccounts() {
    const adminPasswordHash = bcrypt.hashSync('admin123', 10);
    const demoStudentHash = bcrypt.hashSync('student123', 10);

    const adminUser: AuthUser & { passwordHash: string } = {
      id: 'usr_admin_01',
      name: 'Academic Administrator',
      email: 'admin@jeepyq.com',
      role: 'admin',
      targetYear: 2026,
      targetPercentile: 99.9,
      targetCollege: 'IIT Bombay',
      category: 'General',
      membership: {
        planId: 'plan_pro_180d',
        planName: 'Administrator Unlimited',
        status: 'PREMIUM_ACTIVE',
        validUntil: Date.now() + 365 * 24 * 60 * 60 * 1000,
        activatedAt: Date.now()
      },
      createdAt: Date.now(),
      passwordHash: adminPasswordHash
    };

    const demoStudent: AuthUser & { passwordHash: string } = {
      id: 'usr_demo_student',
      name: 'Aman Yadav',
      email: 'student@jeepyq.com',
      role: 'student',
      targetYear: 2026,
      targetPercentile: 99.5,
      targetCollege: 'NIT Trichy CSE',
      category: 'General',
      membership: {
        planId: 'plan_free_trial',
        planName: 'Diagnostic Free Tier',
        status: 'FREE',
        validUntil: Date.now() + 365 * 24 * 60 * 60 * 1000,
        activatedAt: Date.now()
      },
      createdAt: Date.now(),
      passwordHash: demoStudentHash
    };

    this.state.users[adminUser.email.toLowerCase()] = adminUser;
    this.state.users[demoStudent.email.toLowerCase()] = demoStudent;
  }

  private save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.state, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to save database file:', e);
    }
  }

  // User Management
  public getUserByEmail(email: string): (AuthUser & { passwordHash: string }) | undefined {
    return this.state.users[email.toLowerCase().trim()];
  }

  public getUserById(id: string): (AuthUser & { passwordHash: string }) | undefined {
    return Object.values(this.state.users).find(u => u.id === id);
  }

  public createUser(params: {
    name: string;
    email: string;
    password: string;
    targetYear?: 2025 | 2026;
    category?: 'General' | 'OBC-NCL' | 'EWS' | 'SC' | 'ST';
    targetCollege?: string;
  }): AuthUser {
    const emailNorm = params.email.toLowerCase().trim();
    if (this.state.users[emailNorm]) {
      throw new Error('An account with this email address already exists.');
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(params.password, salt);
    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const user: AuthUser & { passwordHash: string } = {
      id: userId,
      name: params.name.trim(),
      email: emailNorm,
      role: emailNorm === 'admin@jeepyq.com' ? 'admin' : 'student',
      targetYear: params.targetYear || 2026,
      targetPercentile: 99.0,
      targetCollege: params.targetCollege || 'NIT Trichy / IIIT Allahabad',
      category: params.category || 'General',
      membership: {
        planId: 'plan_free_trial',
        planName: 'Diagnostic Free Tier',
        status: 'FREE',
        validUntil: Date.now() + 365 * 24 * 60 * 60 * 1000,
        activatedAt: Date.now()
      },
      createdAt: Date.now(),
      passwordHash
    };

    this.state.users[emailNorm] = user;
    this.save();
    return this.sanitizeUser(user);
  }

  public updateUserPassword(email: string, newPassword: string): boolean {
    const user = this.getUserByEmail(email);
    if (!user) return false;

    user.passwordHash = bcrypt.hashSync(newPassword, 10);
    this.save();
    return true;
  }

  public updateUserProfile(userId: string, updates: Partial<AuthUser>): AuthUser | null {
    const user = this.getUserById(userId);
    if (!user) return null;

    if (updates.name) user.name = updates.name.trim();
    if (updates.targetYear) user.targetYear = updates.targetYear;
    if (updates.targetPercentile) user.targetPercentile = updates.targetPercentile;
    if (updates.targetCollege) user.targetCollege = updates.targetCollege;
    if (updates.category) user.category = updates.category;

    this.save();
    return this.sanitizeUser(user);
  }

  public grantMembership(userId: string, plan: MembershipPlan, paymentId?: string, orderId?: string): UserMembership {
    const user = this.getUserById(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    const validUntil = Date.now() + plan.durationDays * 24 * 60 * 60 * 1000;
    const membership: UserMembership = {
      planId: plan.id,
      planName: plan.name,
      status: 'PREMIUM_ACTIVE',
      validUntil,
      paymentId,
      orderId,
      activatedAt: Date.now()
    };

    user.membership = membership;
    this.save();
    return membership;
  }

  public revokeMembership(userId: string): boolean {
    const user = this.getUserById(userId);
    if (!user) return false;

    user.membership = {
      planId: 'plan_free_trial',
      planName: 'Diagnostic Free Tier',
      status: 'FREE',
      validUntil: Date.now() + 365 * 24 * 60 * 60 * 1000,
      activatedAt: Date.now()
    };
    this.save();
    return true;
  }

  public getAllUsers(): AuthUser[] {
    return Object.values(this.state.users).map(u => this.sanitizeUser(u));
  }

  // Token Generation & Verification
  public generateToken(user: AuthUser): string {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    );
  }

  public verifyToken(token: string): { id: string; email: string; role: 'student' | 'admin' } | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      return decoded;
    } catch {
      return null;
    }
  }

  public sanitizeUser(user: AuthUser & { passwordHash?: string }): AuthUser {
    const { passwordHash, ...safe } = user;
    return safe;
  }

  // Membership Plans
  public getPlans(): MembershipPlan[] {
    return this.state.plans;
  }

  public getPlanById(planId: string): MembershipPlan | undefined {
    return this.state.plans.find(p => p.id === planId);
  }

  public updatePlan(plan: MembershipPlan): boolean {
    const idx = this.state.plans.findIndex(p => p.id === plan.id);
    if (idx >= 0) {
      this.state.plans[idx] = plan;
    } else {
      this.state.plans.push(plan);
    }
    this.save();
    return true;
  }

  // Payments Management
  public recordPayment(record: PaymentRecord) {
    this.state.payments.unshift(record);
    this.save();
  }

  public getPaymentById(id: string): PaymentRecord | undefined {
    return this.state.payments.find(p => p.id === id || p.orderId === id || p.paymentId === id);
  }

  public getPaymentsByUser(userId: string): PaymentRecord[] {
    return this.state.payments.filter(p => p.userId === userId);
  }

  public getAllPayments(): PaymentRecord[] {
    return this.state.payments;
  }

  // Webhook Deduplication
  public isEventProcessed(eventId: string): boolean {
    return this.state.processedWebhookEvents.includes(eventId);
  }

  public markEventProcessed(eventId: string) {
    if (!this.state.processedWebhookEvents.includes(eventId)) {
      this.state.processedWebhookEvents.push(eventId);
      if (this.state.processedWebhookEvents.length > 500) {
        this.state.processedWebhookEvents.shift();
      }
      this.save();
    }
  }

  // ==========================================
  // OTP AUTHENTICATION & EMAIL VERIFICATION
  // ==========================================
  public generateAndSaveOtp(
    email: string,
    purpose: 'LOGIN' | 'REGISTER' | 'RESET_PASSWORD',
    name?: string
  ): { otp: string; record: OtpRecord } {
    const emailNorm = email.toLowerCase().trim();
    // 6-digit secure numeric code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes validity

    const record: OtpRecord = {
      email: emailNorm,
      otp,
      purpose,
      name,
      expiresAt,
      attempts: 0,
      maxAttempts: 5,
      createdAt: Date.now()
    };

    const key = `${emailNorm}::${purpose}`;
    this.state.otps[key] = record;
    this.save();

    return { otp, record };
  }

  public verifyOtp(
    email: string,
    enteredOtp: string,
    purpose: 'LOGIN' | 'REGISTER' | 'RESET_PASSWORD'
  ): { valid: boolean; error?: string } {
    const emailNorm = email.toLowerCase().trim();
    const key = `${emailNorm}::${purpose}`;
    const record = this.state.otps[key];

    if (!record) {
      return {
        valid: false,
        error: 'No active OTP verification code found for this email. Please click Send OTP.'
      };
    }

    if (Date.now() > record.expiresAt) {
      delete this.state.otps[key];
      this.save();
      return {
        valid: false,
        error: 'This verification code has expired (10-minute limit). Please request a fresh OTP.'
      };
    }

    if (record.attempts >= record.maxAttempts) {
      delete this.state.otps[key];
      this.save();
      return {
        valid: false,
        error: 'Too many incorrect verification attempts. For your security, please request a new OTP.'
      };
    }

    if (record.otp !== enteredOtp.trim()) {
      record.attempts += 1;
      this.save();
      const remaining = record.maxAttempts - record.attempts;
      return {
        valid: false,
        error: `Incorrect verification code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`
      };
    }

    // Success! Invalidate OTP to prevent replay attacks
    delete this.state.otps[key];
    this.save();

    return { valid: true };
  }

  public markEmailVerified(email: string): boolean {
    const user = this.getUserByEmail(email);
    if (!user) return false;
    user.isEmailVerified = true;
    this.save();
    return true;
  }

  // ==========================================
  // TEST ATTEMPTS & ANALYTICS PERSISTENCE
  // ==========================================
  public saveTestAttempt(attempt: TestAttempt) {
    this.state.testAttempts[attempt.id] = attempt;
    this.save();
  }

  public getTestAttempt(attemptId: string): TestAttempt | undefined {
    return this.state.testAttempts[attemptId];
  }

  public getUserTestAttempts(userId: string): TestAttempt[] {
    return Object.values(this.state.testAttempts)
      .filter(a => a.userId === userId)
      .sort((a, b) => (b.submittedAt || b.startedAt) - (a.submittedAt || a.startedAt));
  }

  public updateAttemptNotificationStatus(
    attemptId: string,
    status: 'SENT' | 'PENDING' | 'FAILED' | 'SKIPPED',
    error?: string
  ) {
    const attempt = this.state.testAttempts[attemptId];
    if (attempt) {
      attempt.emailNotificationStatus = status;
      attempt.emailNotificationSentAt = Date.now();
      attempt.emailNotificationError = error;
      if (attempt.scoreResult) {
        attempt.scoreResult.emailNotificationStatus = status;
        attempt.scoreResult.emailNotificationSentAt = Date.now();
        attempt.scoreResult.emailNotificationError = error;
      }
      this.save();
    }
  }

  /**
   * Compute comprehensive, personalized analytics strictly from real stored test attempts
   */
  public getStudentAnalytics(userId: string): StudentAnalyticsSummary {
    const userAttempts = Object.values(this.state.testAttempts)
      .filter(a => a.userId === userId && a.isSubmitted && a.scoreResult)
      .sort((a, b) => (b.submittedAt || 0) - (a.submittedAt || 0));

    const totalAttempted = userAttempts.length;
    const totalCompleted = userAttempts.length;

    if (totalAttempted === 0) {
      return {
        totalAttempted: 0,
        totalCompleted: 0,
        avgScore: 0,
        highestScore: 0,
        lowestScore: 0,
        overallAccuracy: 0,
        totalQuestionsAttempted: 0,
        totalQuestionsCorrect: 0,
        totalQuestionsIncorrect: 0,
        totalQuestionsUnanswered: 0,
        avgTimePerQuestionSeconds: 0,
        totalTimeSpentSeconds: 0,
        physics: { scoreAvg: 0, accuracy: 0, attempted: 0, correct: 0, incorrect: 0, timeSpentAvg: 0 },
        chemistry: { scoreAvg: 0, accuracy: 0, attempted: 0, correct: 0, incorrect: 0, timeSpentAvg: 0 },
        mathematics: { scoreAvg: 0, accuracy: 0, attempted: 0, correct: 0, incorrect: 0, timeSpentAvg: 0 },
        strongChapters: [],
        weakChapters: [],
        recentResults: [],
        trends: []
      };
    }

    const scores = userAttempts.map(a => a.scoreResult!.totalScore);
    const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const highestScore = Math.max(...scores);
    const lowestScore = Math.min(...scores);

    let sumAttemptedQ = 0;
    let sumCorrectQ = 0;
    let sumIncorrectQ = 0;
    let sumUnansweredQ = 0;
    let totalTimeTaken = 0;

    // Subject totals
    let phyScoreSum = 0, phyAttSum = 0, phyCorrSum = 0, phyIncorrSum = 0, phyTimeSum = 0;
    let chemScoreSum = 0, chemAttSum = 0, chemCorrSum = 0, chemIncorrSum = 0, chemTimeSum = 0;
    let mathScoreSum = 0, mathAttSum = 0, mathCorrSum = 0, mathIncorrSum = 0, mathTimeSum = 0;

    // Chapter aggregates
    const chapterMap: Record<
      string,
      { chapter: string; subject: Subject; attempted: number; correct: number; total: number }
    > = {};

    userAttempts.forEach(att => {
      const res = att.scoreResult!;
      sumAttemptedQ += res.totalAttempted;
      sumCorrectQ += res.totalCorrect;
      sumIncorrectQ += res.totalIncorrect;
      sumUnansweredQ += res.totalUnattempted;
      totalTimeTaken += res.timeTakenSeconds || 0;

      // Physics
      phyScoreSum += res.physics.score;
      phyAttSum += res.physics.attempted;
      phyCorrSum += res.physics.correct;
      phyIncorrSum += res.physics.incorrect;
      phyTimeSum += res.physics.timeSpentSeconds || 0;

      // Chemistry
      chemScoreSum += res.chemistry.score;
      chemAttSum += res.chemistry.attempted;
      chemCorrSum += res.chemistry.correct;
      chemIncorrSum += res.chemistry.incorrect;
      chemTimeSum += res.chemistry.timeSpentSeconds || 0;

      // Mathematics
      mathScoreSum += res.mathematics.score;
      mathAttSum += res.mathematics.attempted;
      mathCorrSum += res.mathematics.correct;
      mathIncorrSum += res.mathematics.incorrect;
      mathTimeSum += res.mathematics.timeSpentSeconds || 0;

      // Chapters
      if (res.chapterWiseAnalysis) {
        res.chapterWiseAnalysis.forEach(c => {
          const key = `${c.subject}::${c.chapter}`;
          if (!chapterMap[key]) {
            chapterMap[key] = {
              chapter: c.chapter,
              subject: c.subject,
              attempted: 0,
              correct: 0,
              total: 0
            };
          }
          chapterMap[key].attempted += c.attempted;
          chapterMap[key].correct += c.correct;
          chapterMap[key].total += c.total;
        });
      }
    });

    const overallAccuracy = sumAttemptedQ > 0 ? Math.round((sumCorrectQ / sumAttemptedQ) * 100) : 0;
    const avgTimePerQuestionSeconds = sumAttemptedQ > 0 ? Math.round(totalTimeTaken / sumAttemptedQ) : 0;

    const count = userAttempts.length;

    // Calculate strong chapters (accuracy >= 70% with at least 2 questions)
    // and weak chapters (accuracy < 55% or highest incorrects)
    const chapterList = Object.values(chapterMap).map(c => {
      const accuracy = c.attempted > 0 ? Math.round((c.correct / c.attempted) * 100) : 0;
      return {
        chapter: c.chapter,
        subject: c.subject,
        accuracy,
        questionsCount: c.attempted
      };
    });

    const strongChapters = chapterList
      .filter(c => c.questionsCount >= 1 && c.accuracy >= 70)
      .sort((a, b) => b.accuracy - a.accuracy)
      .slice(0, 6);

    const weakChapters = chapterList
      .filter(c => c.questionsCount >= 1 && c.accuracy < 60)
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 6);

    const recentResults = userAttempts.slice(0, 10).map(a => a.scoreResult!);

    const trends = [...userAttempts]
      .reverse()
      .map(a => ({
        attemptId: a.id,
        testTitle: a.testTitle,
        score: a.scoreResult!.totalScore,
        accuracy: a.scoreResult!.overallAccuracy,
        percentile: a.scoreResult!.percentileEstimate,
        submittedAt: a.submittedAt || a.startedAt
      }));

    return {
      totalAttempted,
      totalCompleted,
      avgScore,
      highestScore,
      lowestScore,
      overallAccuracy,
      totalQuestionsAttempted: sumAttemptedQ,
      totalQuestionsCorrect: sumCorrectQ,
      totalQuestionsIncorrect: sumIncorrectQ,
      totalQuestionsUnanswered: sumUnansweredQ,
      avgTimePerQuestionSeconds,
      totalTimeSpentSeconds: totalTimeTaken,
      physics: {
        scoreAvg: Math.round(phyScoreSum / count),
        accuracy: phyAttSum > 0 ? Math.round((phyCorrSum / phyAttSum) * 100) : 0,
        attempted: phyAttSum,
        correct: phyCorrSum,
        incorrect: phyIncorrSum,
        timeSpentAvg: Math.round(phyTimeSum / count)
      },
      chemistry: {
        scoreAvg: Math.round(chemScoreSum / count),
        accuracy: chemAttSum > 0 ? Math.round((chemCorrSum / chemAttSum) * 100) : 0,
        attempted: chemAttSum,
        correct: chemCorrSum,
        incorrect: chemIncorrSum,
        timeSpentAvg: Math.round(chemTimeSum / count)
      },
      mathematics: {
        scoreAvg: Math.round(mathScoreSum / count),
        accuracy: mathAttSum > 0 ? Math.round((mathCorrSum / mathAttSum) * 100) : 0,
        attempted: mathAttSum,
        correct: mathCorrSum,
        incorrect: mathIncorrSum,
        timeSpentAvg: Math.round(mathTimeSum / count)
      },
      strongChapters,
      weakChapters,
      recentResults,
      trends
    };
  }
}

export const db = new DatabaseManager();


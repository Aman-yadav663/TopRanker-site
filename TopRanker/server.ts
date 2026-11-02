import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { TEST_CATALOG_METADATA, getTestPaperBySlot } from './src/data/mockTestsCatalog.ts';
import { AUTHENTIC_PYQS } from './src/data/authenticPyqs.ts';
import { calculateTestResult } from './src/services/scoring.ts';
import type { Question, AuthUser, PaymentRecord, MembershipPlan, TestAttempt } from './src/types.ts';
import { db } from './src/server/db.ts';
import { razorpayService } from './src/server/razorpayService.ts';
import { emailService } from './src/server/emailService.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// In-memory store for server-side persistence of imported questions
const customQuestionsStore: Question[] = [];

// ==========================================
// AUTHENTICATION MIDDLEWARES
// ==========================================
function getAuthenticatedUser(req: Request): AuthUser | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  const payload = db.verifyToken(token);
  if (!payload) return null;

  const user = db.getUserById(payload.id);
  if (!user) return null;

  return db.sanitizeUser(user);
}

function requireAuth(req: Request, res: Response, next: NextFunction) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'UNAUTHORIZED',
      message: 'Please log in to continue.'
    });
  }
  (req as any).user = user;
  next();
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = getAuthenticatedUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'FORBIDDEN',
      message: 'Access restricted to authorized administrators only.'
    });
  }
  (req as any).user = user;
  next();
}

// ==========================================
// AUTHENTICATION & USER ROUTES
// ==========================================

// Send 6-digit Email Verification OTP
app.post('/api/auth/send-otp', async (req: Request, res: Response) => {
  try {
    const { email, purpose = 'LOGIN', name } = req.body;
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid email address.'
      });
    }

    const normEmail = email.toLowerCase().trim();
    const validPurpose = ['LOGIN', 'REGISTER', 'RESET_PASSWORD'].includes(purpose)
      ? (purpose as 'LOGIN' | 'REGISTER' | 'RESET_PASSWORD')
      : 'LOGIN';

    // Rate limiting & expiry handled by db.generateAndSaveOtp
    const user = db.getUserByEmail(normEmail);
    const candidateName = name || (user ? user.name : 'Aspirant');

    const { otp } = db.generateAndSaveOtp(normEmail, validPurpose, candidateName);

    const emailRes = await emailService.sendOtpEmail({
      email: normEmail,
      name: candidateName,
      otp,
      purpose: validPurpose
    });

    res.json({
      success: true,
      message: `A 6-digit verification code has been dispatched to ${normEmail}.`,
      status: emailRes.status,
      previewCode: emailRes.previewCode, // Provided in sandbox mode
      isSmtpConfigured: emailService.isSmtpConfigured()
    });
  } catch (err: any) {
    console.error('Send OTP error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to send verification code. ' + (err.message || '')
    });
  }
});

// Verify 6-digit Email OTP & Continue
app.post('/api/auth/verify-otp', (req: Request, res: Response) => {
  try {
    const { 
      email, 
      otp, 
      purpose = 'LOGIN',
      name, 
      password,
      targetYear,
      category,
      targetCollege
    } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        error: 'Email and 6-digit verification code are required.'
      });
    }

    const normEmail = email.toLowerCase().trim();
    const validPurpose = ['LOGIN', 'REGISTER', 'RESET_PASSWORD'].includes(purpose)
      ? (purpose as 'LOGIN' | 'REGISTER' | 'RESET_PASSWORD')
      : 'LOGIN';

    const verification = db.verifyOtp(normEmail, otp.toString(), validPurpose);
    if (!verification.valid) {
      return res.status(400).json({
        success: false,
        error: verification.error || 'Invalid verification code.'
      });
    }

    // OTP is valid! Mark email verified
    let user = db.getUserByEmail(normEmail);

    if (validPurpose === 'REGISTER' || !user) {
      if (!user) {
        user = db.createUser({
          name: name || normEmail.split('@')[0],
          email: normEmail,
          password: password || 'Candidate@123',
          targetYear,
          category,
          targetCollege
        }) as any;
      }
      db.markEmailVerified(normEmail);
    } else {
      db.markEmailVerified(normEmail);
    }

    const freshUser = db.getUserByEmail(normEmail);
    if (!freshUser) {
      return res.status(500).json({ success: false, error: 'Could not resolve user record.' });
    }

    const safeUser = db.sanitizeUser(freshUser);
    const token = db.generateToken(safeUser);

    res.json({
      success: true,
      user: safeUser,
      token,
      message: 'Email successfully verified! Welcome to JEE PYQ 30.'
    });
  } catch (err: any) {
    console.error('Verify OTP error:', err);
    res.status(400).json({
      success: false,
      error: err.message || 'Verification failed.'
    });
  }
});

// Register student
app.post('/api/auth/register', (req: Request, res: Response) => {
  try {
    const { name, email, password, targetYear, category, targetCollege } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and password are required.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long.'
      });
    }

    const user = db.createUser({
      name,
      email,
      password,
      targetYear,
      category,
      targetCollege
    });

    const token = db.generateToken(user);
    res.json({
      success: true,
      user,
      token,
      message: 'Account created successfully! Welcome to JEE PYQ 30.'
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: err.message || 'Registration failed.'
    });
  }
});

// Student & Admin Login
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Email and password are required.'
    });
  }

  const user = db.getUserByEmail(email);
  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'Invalid email or password.'
    });
  }

  const isMatch = bcrypt.compareSync(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      error: 'Invalid email or password.'
    });
  }

  const safeUser = db.sanitizeUser(user);
  const token = db.generateToken(safeUser);

  res.json({
    success: true,
    user: safeUser,
    token,
    message: `Welcome back, ${safeUser.name}!`
  });
});

// Current User Profile
app.get('/api/auth/me', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ success: false, error: 'Not authenticated.' });
  }

  res.json({
    success: true,
    user
  });
});

// Update Profile
app.put('/api/auth/profile', requireAuth, (req: Request, res: Response) => {
  const current = (req as any).user as AuthUser;
  const updated = db.updateUserProfile(current.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'User not found.' });
  }

  res.json({
    success: true,
    user: updated,
    message: 'Profile updated successfully.'
  });
});

// Forgot Password
app.post('/api/auth/forgot-password', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, error: 'Email is required.' });
  }

  const user = db.getUserByEmail(email);
  if (!user) {
    // Return friendly generic message for privacy
    return res.json({
      success: true,
      message: 'If an account exists with this email, password reset instructions have been generated.'
    });
  }

  const tempToken = `reset_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  res.json({
    success: true,
    resetToken: tempToken,
    message: 'Password reset link sent to your email.'
  });
});

// Reset Password
app.post('/api/auth/reset-password', (req: Request, res: Response) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    return res.status(400).json({ success: false, error: 'Email and new password are required.' });
  }

  const success = db.updateUserPassword(email, newPassword);
  if (!success) {
    return res.status(404).json({ success: false, error: 'Account not found.' });
  }

  res.json({
    success: true,
    message: 'Password has been successfully updated. You may now log in.'
  });
});

// ==========================================
// MEMBERSHIP PLANS & CONFIGURATION
// ==========================================

// Get All Membership Plans
app.get('/api/plans', (_req: Request, res: Response) => {
  const plans = db.getPlans();
  res.json({
    success: true,
    plans,
    currency: 'INR'
  });
});

// ==========================================
// RAZORPAY PAYMENT GATEWAY ROUTES
// ==========================================

// Create Razorpay Order
app.post('/api/payment/create-order', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as AuthUser;
    const { planId } = req.body;

    const plan = db.getPlanById(planId);
    if (!plan) {
      return res.status(400).json({ success: false, error: 'Invalid membership plan selected.' });
    }

    if (plan.priceINR === 0) {
      // Free plan directly activates
      const membership = db.grantMembership(user.id, plan);
      return res.json({
        success: true,
        freePlanActivated: true,
        membership,
        message: 'Diagnostic Free Tier activated!'
      });
    }

    const receipt = `rcpt_${Date.now()}_${user.id.substring(4, 10)}`;
    const order = await razorpayService.createOrder({
      amountINR: plan.priceINR,
      receipt,
      notes: {
        userId: user.id,
        userEmail: user.email,
        planId: plan.id,
        planName: plan.name
      }
    });

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      amountINR: plan.priceINR,
      currency: order.currency,
      receipt: order.receipt,
      keyId: razorpayService.getKeyId(),
      isTestSandbox: order.isTestSandbox,
      isLiveConfigured: razorpayService.isLiveConfigured(),
      plan: {
        id: plan.id,
        name: plan.name,
        priceINR: plan.priceINR,
        durationDays: plan.durationDays
      },
      prefill: {
        name: user.name,
        email: user.email
      }
    });
  } catch (err: any) {
    console.error('Create order error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to create payment order. ' + (err.message || '')
    });
  }
});

// Server-side Payment Verification
app.post('/api/payment/verify', requireAuth, (req: Request, res: Response) => {
  try {
    const user = (req as any).user as AuthUser;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId, paymentMethod = 'UPI' } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: 'Missing required Razorpay verification credentials.'
      });
    }

    const plan = db.getPlanById(planId);
    if (!plan) {
      return res.status(400).json({ success: false, error: 'Plan not found.' });
    }

    // Server-side HMAC SHA-256 signature verification
    const isValid = razorpayService.verifyPaymentSignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature
    });

    if (!isValid) {
      // Record failed payment attempt
      db.recordPayment({
        id: `pmt_fail_${Date.now()}`,
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        receiptNumber: `FAIL-${Date.now()}`,
        userId: user.id,
        userEmail: user.email,
        userName: user.name,
        planId: plan.id,
        planName: plan.name,
        amountINR: plan.priceINR,
        currency: 'INR',
        status: 'FAILED',
        errorReason: 'Cryptographic signature mismatch.',
        createdAt: Date.now()
      });

      return res.status(400).json({
        success: false,
        error: 'Payment verification failed: Invalid cryptographic signature.'
      });
    }

    // Payment Verified! Grant membership and record transaction
    const membership = db.grantMembership(user.id, plan, razorpay_payment_id, razorpay_order_id);
    const receiptNumber = `RCPT-JEE-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const paymentRecord: PaymentRecord = {
      id: `pmt_${Date.now()}`,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      receiptNumber,
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      planId: plan.id,
      planName: plan.name,
      amountINR: plan.priceINR,
      currency: 'INR',
      status: 'SUCCESS',
      paymentMethod,
      signature: razorpay_signature,
      createdAt: Date.now()
    };

    db.recordPayment(paymentRecord);

    const refreshedUser = db.getUserById(user.id);

    res.json({
      success: true,
      membership,
      user: refreshedUser ? db.sanitizeUser(refreshedUser) : user,
      paymentRecord,
      message: `Payment successful! You are now subscribed to ${plan.name}. All 30 tests unlocked.`
    });
  } catch (err: any) {
    console.error('Payment verify exception:', err);
    res.status(500).json({
      success: false,
      error: 'An unexpected error occurred during payment verification.'
    });
  }
});

// Razorpay Webhook with Duplicate Event Protection
app.post('/api/payment/webhook', (req: Request, res: Response) => {
  const signature = req.headers['x-razorpay-signature'] as string;
  const rawBody = JSON.stringify(req.body);

  if (razorpayService.isLiveConfigured()) {
    const isValid = razorpayService.verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      return res.status(400).json({ status: 'Invalid signature' });
    }
  }

  const event = req.body;
  const eventId = event.event_id || event.id || `${event.event}_${Date.now()}`;

  // Duplicate event deduplication
  if (db.isEventProcessed(eventId)) {
    return res.status(200).json({ status: 'Event already processed' });
  }
  db.markEventProcessed(eventId);

  if (event.event === 'payment.captured' || event.event === 'order.paid') {
    const paymentEntity = event.payload?.payment?.entity;
    if (paymentEntity) {
      const notes = paymentEntity.notes || {};
      const userId = notes.userId;
      const planId = notes.planId;
      if (userId && planId) {
        const plan = db.getPlanById(planId);
        if (plan) {
          db.grantMembership(userId, plan, paymentEntity.id, paymentEntity.order_id);
        }
      }
    }
  }

  res.status(200).json({ status: 'ok' });
});

// User Payment & Receipt History
app.get('/api/payment/history', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user as AuthUser;
  const history = db.getPaymentsByUser(user.id);
  res.json({
    success: true,
    payments: history
  });
});

// Single Payment Receipt
app.get('/api/payment/receipt/:id', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user as AuthUser;
  const payment = db.getPaymentById(req.params.id);
  if (!payment) {
    return res.status(404).json({ success: false, error: 'Receipt not found.' });
  }

  // Allow student to see their own receipt, or admin to see any
  if (user.role !== 'admin' && payment.userId !== user.id) {
    return res.status(403).json({ success: false, error: 'Access denied.' });
  }

  res.json({
    success: true,
    payment
  });
});

// ==========================================
// PROTECTED TEST ACCESS & QUESTION BANK
// ==========================================

// Get all 30 tests metadata (publicly viewable catalog)
app.get('/api/tests', (_req: Request, res: Response) => {
  res.json({
    success: true,
    totalTests: TEST_CATALOG_METADATA.length,
    tests: TEST_CATALOG_METADATA
  });
});

// Get a specific test paper by slot number (1 to 30)
// SECURITY: Slots 1 & 2 are free trial; Slots 3–30 strictly require active paid membership
app.get('/api/tests/:slot', (req: Request, res: Response) => {
  const slot = parseInt(req.params.slot, 10);
  if (isNaN(slot) || slot < 1 || slot > 30) {
    return res.status(404).json({ success: false, error: 'Invalid test slot. Must be between 1 and 30.' });
  }

  const testPaper = getTestPaperBySlot(slot);

  // Slots 1 and 2 are free preview diagnostic tests
  if (slot <= 2) {
    return res.json({
      success: true,
      isPremiumRestricted: false,
      test: testPaper
    });
  }

  // Premium Access Enforcement on Server for Tests 3 to 30
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'AUTH_REQUIRED',
      message: `Test #${slot} is a Premium Full-Length Mock Paper. Please log in with an active membership to access the question paper.`,
      slotNumber: slot
    });
  }

  const isPremiumActive =
    user.role === 'admin' ||
    (user.membership.status === 'PREMIUM_ACTIVE' && user.membership.validUntil > Date.now());

  if (!isPremiumActive) {
    return res.status(403).json({
      success: false,
      error: 'MEMBERSHIP_REQUIRED',
      message: `Test #${slot} requires an active JEE PYQ 30 Premium Membership Pass. Unlock all 30 full papers to start this test.`,
      slotNumber: slot,
      membershipStatus: user.membership.status,
      upgradeUrl: '/pricing'
    });
  }

  // Authorized! Deliver paper
  res.json({
    success: true,
    isPremiumRestricted: true,
    userAccessVerified: true,
    test: testPaper
  });
});

// Server-side score validation, attempt persistence, and automated email notification
app.post('/api/tests/:slot/submit', async (req: Request, res: Response) => {
  try {
    const slot = parseInt(req.params.slot, 10);
    const { responses, userId = 'usr_demo_student', timeTakenSeconds = 0, userEmail, userName } = req.body;

    if (isNaN(slot) || slot < 1 || slot > 30) {
      return res.status(404).json({ success: false, error: 'Test not found' });
    }

    const authUser = getAuthenticatedUser(req);
    const effectiveUserId = authUser ? authUser.id : userId;
    const effectiveUserName = authUser ? authUser.name : (userName || 'Student Aspirant');
    const effectiveUserEmail = authUser ? authUser.email : (userEmail || '');

    const testPaper = getTestPaperBySlot(slot);
    const attemptId = `attempt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const result = calculateTestResult(testPaper, attemptId, effectiveUserId, responses || {}, timeTakenSeconds);

    // Save test attempt to server database
    const attempt: TestAttempt = {
      id: attemptId,
      testId: testPaper.id,
      testTitle: testPaper.title,
      userId: effectiveUserId,
      userName: effectiveUserName,
      startedAt: Date.now() - (timeTakenSeconds * 1000),
      submittedAt: Date.now(),
      timeRemainingSeconds: Math.max(0, 180 * 60 - timeTakenSeconds),
      isSubmitted: true,
      responses: responses || {},
      scoreResult: result,
      emailNotificationStatus: 'PENDING'
    };

    db.saveTestAttempt(attempt);

    // Automatically send result notification email if email address is present
    let emailStatus: 'SENT' | 'SANDBOX_LOGGED' | 'FAILED' | 'SKIPPED' = 'SKIPPED';
    let emailError: string | undefined;

    if (effectiveUserEmail) {
      try {
        const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
        const emailRes = await emailService.sendTestResultEmail({
          studentName: effectiveUserName,
          studentEmail: effectiveUserEmail,
          testTitle: testPaper.title,
          slotNumber: slot,
          result,
          attemptId,
          baseUrl
        });
        emailStatus = emailRes.status;
        emailError = emailRes.error;
      } catch (err: any) {
        console.error('Test result email dispatch failed:', err);
        emailStatus = 'FAILED';
        emailError = err.message;
      }
      db.updateAttemptNotificationStatus(attemptId, emailStatus as any, emailError);
    }

    res.json({
      success: true,
      result,
      attemptId,
      emailNotificationStatus: emailStatus,
      emailRecipient: effectiveUserEmail || null,
      message: effectiveUserEmail
        ? `Test evaluated! Result summary automatically dispatched to ${effectiveUserEmail}.`
        : 'Test evaluated and recorded successfully!'
    });
  } catch (err: any) {
    console.error('Submit test error:', err);
    res.status(500).json({ success: false, error: 'Failed to process test submission. ' + (err.message || '') });
  }
});

// ==========================================
// STUDENT ANALYTICS & ATTEMPTS
// ==========================================

// Real calculated analytics based on stored attempts
app.get('/api/student/analytics', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user as AuthUser;
  const analytics = db.getStudentAnalytics(user.id);
  res.json({
    success: true,
    analytics
  });
});

// Student's test attempts history
app.get('/api/student/attempts', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user as AuthUser;
  const attempts = db.getUserTestAttempts(user.id);
  res.json({
    success: true,
    attempts
  });
});

// Single test attempt details with responses and solutions
app.get('/api/student/attempts/:id', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user as AuthUser;
  const attempt = db.getTestAttempt(req.params.id);
  if (!attempt) {
    return res.status(404).json({ success: false, error: 'Test attempt not found.' });
  }

  if (user.role !== 'admin' && attempt.userId !== user.id) {
    return res.status(403).json({ success: false, error: 'Access denied.' });
  }

  res.json({
    success: true,
    attempt
  });
});

// Manually trigger or re-send result summary email
app.post('/api/student/resend-result-email/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as AuthUser;
    const attempt = db.getTestAttempt(req.params.id);
    if (!attempt || attempt.userId !== user.id) {
      return res.status(404).json({ success: false, error: 'Test attempt not found.' });
    }

    if (!attempt.scoreResult) {
      return res.status(400).json({ success: false, error: 'Result scorecard is not available for this attempt.' });
    }

    const slotMatch = attempt.testId.match(/(\d+)/);
    const slotNumber = slotMatch ? parseInt(slotMatch[1], 10) : 1;
    const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;

    const emailRes = await emailService.sendTestResultEmail({
      studentName: user.name,
      studentEmail: user.email,
      testTitle: attempt.testTitle,
      slotNumber,
      result: attempt.scoreResult,
      attemptId: attempt.id,
      baseUrl
    });

    db.updateAttemptNotificationStatus(attempt.id, emailRes.status as any, emailRes.error);

    res.json({
      success: true,
      status: emailRes.status,
      message: `Result email sent to ${user.email}.`
    });
  } catch (err: any) {
    console.error('Resend email error:', err);
    res.status(500).json({ success: false, error: 'Failed to send result email.' });
  }
});

// View recent email notification delivery logs
app.get('/api/admin/email-logs', requireAdmin, (_req: Request, res: Response) => {
  res.json({
    success: true,
    isSmtpConfigured: emailService.isSmtpConfigured(),
    logs: emailService.getRecentLogs()
  });
});

// Search and filter authentic PYQ question bank
app.get('/api/questions', (req: Request, res: Response) => {
  const { subject, year, chapter, type, search } = req.query;
  let allQuestions = [...AUTHENTIC_PYQS, ...customQuestionsStore];

  if (subject && typeof subject === 'string') {
    allQuestions = allQuestions.filter(q => q.subject.toLowerCase() === subject.toLowerCase());
  }
  if (year && typeof year === 'string') {
    const y = parseInt(year, 10);
    allQuestions = allQuestions.filter(q => q.year === y);
  }
  if (chapter && typeof chapter === 'string') {
    allQuestions = allQuestions.filter(q => q.chapter.toLowerCase().includes(chapter.toLowerCase()));
  }
  if (type && typeof type === 'string') {
    allQuestions = allQuestions.filter(q => q.type === type.toUpperCase());
  }
  if (search && typeof search === 'string') {
    const s = search.toLowerCase();
    allQuestions = allQuestions.filter(q =>
      q.questionText.toLowerCase().includes(s) ||
      q.chapter.toLowerCase().includes(s) ||
      q.sourceReference.toLowerCase().includes(s)
    );
  }

  res.json({
    success: true,
    total: allQuestions.length,
    questions: allQuestions
  });
});

// ==========================================
// ADMIN DASHBOARD & MANAGEMENT (REQUIRE ADMIN)
// ==========================================

// Get all registered users and membership details
app.get('/api/admin/users', requireAdmin, (_req: Request, res: Response) => {
  const users = db.getAllUsers();
  res.json({
    success: true,
    total: users.length,
    users
  });
});

// Admin manual membership grant or revoke
app.post('/api/admin/users/:id/membership', requireAdmin, (req: Request, res: Response) => {
  const { action, planId } = req.body;
  const targetUserId = req.params.id;

  if (action === 'grant') {
    const plan = db.getPlanById(planId || 'plan_pro_180d');
    if (!plan) return res.status(400).json({ success: false, error: 'Plan not found.' });

    const updatedMembership = db.grantMembership(targetUserId, plan, 'ADMIN_MANUAL_GRANT', 'ADMIN_ORDER');
    return res.json({
      success: true,
      membership: updatedMembership,
      message: `Granted ${plan.name} to user.`
    });
  } else if (action === 'revoke') {
    const success = db.revokeMembership(targetUserId);
    return res.json({
      success,
      message: 'Membership revoked. Reverted user to Free tier.'
    });
  }

  res.status(400).json({ success: false, error: 'Invalid action. Must be grant or revoke.' });
});

// Admin Payment Transactions
app.get('/api/admin/payments', requireAdmin, (_req: Request, res: Response) => {
  const payments = db.getAllPayments();
  res.json({
    success: true,
    total: payments.length,
    payments
  });
});

// Admin Update Membership Plan
app.post('/api/admin/plans', requireAdmin, (req: Request, res: Response) => {
  const plan: MembershipPlan = req.body;
  if (!plan || !plan.id || !plan.name || plan.priceINR === undefined) {
    return res.status(400).json({ success: false, error: 'Incomplete plan configuration.' });
  }

  db.updatePlan(plan);
  res.json({
    success: true,
    plan,
    message: `Plan "${plan.name}" updated successfully.`
  });
});

// Admin Analytics Overview
app.get('/api/admin/analytics', requireAdmin, (_req: Request, res: Response) => {
  const users = db.getAllUsers();
  const payments = db.getAllPayments();
  const successfulPayments = payments.filter(p => p.status === 'SUCCESS');
  const totalRevenueINR = successfulPayments.reduce((acc, p) => acc + p.amountINR, 0);

  const activeSubscribers = users.filter(
    u => u.membership.status === 'PREMIUM_ACTIVE' && u.membership.validUntil > Date.now()
  ).length;

  res.json({
    success: true,
    metrics: {
      totalStudents: users.length,
      activeSubscribers,
      totalRevenueINR,
      totalTransactions: payments.length,
      successfulTransactions: successfulPayments.length,
      razorpayLiveMode: razorpayService.isLiveConfigured(),
      razorpayKeyId: razorpayService.getKeyId()
    }
  });
});

// Admin Question Bank management
app.post('/api/questions', requireAdmin, (req: Request, res: Response) => {
  const question: Question = req.body;
  if (!question.subject || !question.questionText || !question.correctAnswer) {
    return res.status(400).json({ success: false, error: 'Missing required question fields' });
  }

  question.id = question.id || `PYQ-MANUAL-${Date.now()}`;
  question.verificationStatus = question.verificationStatus || 'VERIFIED_OFFICIAL';
  question.isOfficialPYQ = true;

  customQuestionsStore.push(question);
  res.json({ success: true, question });
});

// Admin bulk import
app.post('/api/admin/bulk-import', requireAdmin, (req: Request, res: Response) => {
  const { questions } = req.body;
  if (!Array.isArray(questions)) {
    return res.status(400).json({ success: false, error: 'questions must be an array' });
  }

  let importedCount = 0;
  for (const q of questions) {
    if (q.questionText && q.correctAnswer && q.subject) {
      customQuestionsStore.push({
        ...q,
        id: q.id || `IMPORT-PYQ-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        verificationStatus: q.verificationStatus || 'VERIFIED_OFFICIAL',
        isOfficialPYQ: true
      });
      importedCount++;
    }
  }

  res.json({
    success: true,
    importedCount,
    totalCustomQuestions: customQuestionsStore.length
  });
});

// Platform Statistics
app.get('/api/stats', (_req: Request, res: Response) => {
  res.json({
    success: true,
    totalTests: 30,
    categoryA2025: 10,
    categoryB2026: 10,
    categoryCMixed: 10,
    totalQuestionsPerTest: 75,
    totalMarksPerTest: 300,
    markingScheme: { correct: '+4', incorrect: '-1', unattempted: '0' },
    pattern: 'JEE Main Paper 1 (B.E./B.Tech) - 20 MCQs + 5 Numericals per subject'
  });
});

// ==========================================
// VITE DEV MIDDLEWARE OR PRODUCTION STATIC
// ==========================================
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`JEE PYQ 30 Test Series server running on http://localhost:${PORT}`);
  });
}

startServer();

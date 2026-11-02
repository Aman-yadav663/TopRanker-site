import nodemailer, { type Transporter } from 'nodemailer';
import type { TestResult, EmailNotificationLog } from '../types.ts';

interface SendOtpParams {
  email: string;
  name?: string;
  otp: string;
  purpose: 'LOGIN' | 'REGISTER' | 'RESET_PASSWORD';
}

interface SendTestResultParams {
  studentName: string;
  studentEmail: string;
  testTitle: string;
  slotNumber: number;
  result: TestResult;
  attemptId: string;
  baseUrl?: string;
}

class EmailService {
  private transporter: Transporter | null = null;
  private isConfigured: boolean = false;
  private sentNotificationCache: Set<string> = new Set();
  private emailLogs: EmailNotificationLog[] = [];

  constructor() {
    this.initTransporter();
  }

  private initTransporter() {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (host && user && pass) {
      try {
        this.transporter = nodemailer.createTransport({
          host,
          port,
          secure: port === 465,
          auth: { user, pass }
        });
        this.isConfigured = true;
        console.log('[EmailService] SMTP Transporter initialized successfully with', host);
      } catch (err) {
        console.error('[EmailService] Failed to initialize SMTP Transporter:', err);
        this.isConfigured = false;
      }
    } else {
      this.isConfigured = false;
      console.log('[EmailService] No SMTP credentials provided. Running in sandbox delivery mode (simulates and logs verified emails).');
    }
  }

  public isSmtpConfigured(): boolean {
    return this.isConfigured;
  }

  public getRecentLogs(): EmailNotificationLog[] {
    return [...this.emailLogs].reverse().slice(0, 50);
  }

  public getLogsForEmail(email: string): EmailNotificationLog[] {
    const norm = email.toLowerCase().trim();
    return this.emailLogs.filter(l => l.recipientEmail.toLowerCase() === norm);
  }

  /**
   * Send 6-digit OTP email for registration, login, or password reset
   */
  public async sendOtpEmail(params: SendOtpParams): Promise<{
    success: boolean;
    status: 'SENT' | 'SANDBOX_LOGGED' | 'FAILED';
    previewCode?: string;
    messageId?: string;
    error?: string;
  }> {
    const { email, name = 'Student', otp, purpose } = params;
    const fromAddress = process.env.SMTP_FROM || 'JEE PYQ 30 <notifications@jeepyq.com>';

    const purposeTitle =
      purpose === 'REGISTER'
        ? 'Confirm Your Email Address'
        : purpose === 'RESET_PASSWORD'
        ? 'Reset Your Account Password'
        : 'Sign In to Your Candidate Account';

    const purposeDesc =
      purpose === 'REGISTER'
        ? 'Welcome to JEE PYQ 30. Please verify your email to activate your account and start full-length test practice.'
        : purpose === 'RESET_PASSWORD'
        ? 'We received a request to reset your password. Use the verification code below to set a new password.'
        : 'Use the 6-digit verification code below to securely sign in to your JEE PYQ 30 candidate account.';

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${purposeTitle}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 580px; background-color: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); padding: 32px 24px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
                JEE PYQ <span style="color: #60a5fa;">30</span>
              </h1>
              <p style="margin: 6px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #94a3b8; font-weight: 600;">
                Official CBT Exam Preparation Platform
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 36px 32px;">
              <h2 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 700; color: #0f172a;">
                ${purposeTitle}
              </h2>
              <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #475569;">
                Hello <strong>${name}</strong>,<br><br>
                ${purposeDesc}
              </p>

              <!-- OTP Box -->
              <div style="background-color: #f1f5f9; border: 2px dashed #93c5fd; border-radius: 16px; padding: 24px; text-align: center; margin: 28px 0;">
                <p style="margin: 0 0 8px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #64748b; font-weight: 700;">
                  Your 6-Digit Verification Code
                </p>
                <div style="font-family: 'JetBrains Mono', Courier, monospace; font-size: 38px; font-weight: 800; letter-spacing: 8px; color: #1e40af; margin: 4px 0;">
                  ${otp}
                </div>
                <p style="margin: 8px 0 0 0; font-size: 12px; color: #64748b;">
                  Valid for <strong>10 minutes</strong>. Do not share this code with anyone.
                </p>
              </div>

              <p style="margin: 0 0 16px 0; font-size: 13px; line-height: 1.6; color: #64748b;">
                If you did not request this verification code, please disregard this email. Your account remains secure.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 32px; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #94a3b8; line-height: 1.5;">
                © JEE PYQ 30 Test Series · Joint Entrance Examination Practice Portal<br>
                This is an automated system notification. Please do not reply directly to this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const logEntry: EmailNotificationLog = {
      id: `email_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      recipientEmail: email,
      recipientName: name,
      subject: `[JEE PYQ 30] ${purposeTitle} — Code: ${otp}`,
      type: 'OTP',
      status: this.isConfigured ? 'SENT' : 'SANDBOX_LOGGED',
      sentAt: Date.now(),
      metadata: { purpose, otp }
    };

    if (this.isConfigured && this.transporter) {
      try {
        const info = await this.transporter.sendMail({
          from: fromAddress,
          to: email,
          subject: `[JEE PYQ 30] ${purposeTitle}: ${otp}`,
          text: `Your JEE PYQ 30 verification code is: ${otp}. It is valid for 10 minutes.`,
          html: htmlContent
        });

        logEntry.status = 'SENT';
        logEntry.previewUrl = nodemailer.getTestMessageUrl(info) || undefined;
        this.emailLogs.push(logEntry);

        return {
          success: true,
          status: 'SENT',
          messageId: info.messageId
        };
      } catch (err: any) {
        console.error('[EmailService] Failed to send real OTP email:', err);
        logEntry.status = 'FAILED';
        logEntry.error = err.message || 'SMTP Transport Error';
        this.emailLogs.push(logEntry);

        // Fallback to sandbox logging so candidate flow is not hard-blocked
        return {
          success: true,
          status: 'SANDBOX_LOGGED',
          previewCode: otp,
          error: `SMTP delivery failed (${err.message}). Code logged securely for verification.`
        };
      }
    } else {
      // Sandbox Mode: log code cleanly for local/development use
      console.log(`[EmailService] [SANDBOX OTP] To: ${email} | Code: ${otp} | Purpose: ${purpose}`);
      this.emailLogs.push(logEntry);

      return {
        success: true,
        status: 'SANDBOX_LOGGED',
        previewCode: otp
      };
    }
  }

  /**
   * Send Automated Test Result Summary Email to student upon test submission
   */
  public async sendTestResultEmail(params: SendTestResultParams): Promise<{
    success: boolean;
    status: 'SENT' | 'SANDBOX_LOGGED' | 'FAILED' | 'SKIPPED';
    messageId?: string;
    error?: string;
    duplicate?: boolean;
  }> {
    const { studentName, studentEmail, testTitle, slotNumber, result, attemptId, baseUrl = '' } = params;

    // Duplicate event protection: prevent duplicate result emails for the same attempt
    const dedupeKey = `result_email_${attemptId}`;
    if (this.sentNotificationCache.has(dedupeKey)) {
      console.log(`[EmailService] Duplicate result email skipped for attempt ${attemptId}`);
      return { success: true, status: 'SKIPPED', duplicate: true };
    }

    const fromAddress = process.env.SMTP_FROM || 'JEE PYQ 30 <results@jeepyq.com>';
    const formattedDate = new Date(result.submittedAt || Date.now()).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short'
    });

    const timeTakenMins = Math.round((result.timeTakenSeconds || 0) / 60);
    const scoreColor = result.totalScore >= 180 ? '#16a34a' : result.totalScore >= 120 ? '#2563eb' : '#dc2626';

    const resultLink = `${baseUrl}#results?attemptId=${attemptId}`;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Test Result: ${testTitle}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); padding: 32px 28px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
                JEE PYQ <span style="color: #60a5fa;">30</span>
              </h1>
              <p style="margin: 6px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #94a3b8; font-weight: 600;">
                Official CBT Exam Result Scorecard
              </p>
            </td>
          </tr>

          <!-- Summary Card -->
          <tr>
            <td style="padding: 32px 28px;">
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #64748b;">
                Candidate Name: <strong style="color: #0f172a;">${studentName}</strong>
              </p>
              <h2 style="margin: 0 0 6px 0; font-size: 20px; font-weight: 800; color: #0f172a;">
                ${testTitle}
              </h2>
              <p style="margin: 0 0 24px 0; font-size: 12px; color: #64748b;">
                Submitted on: <strong>${formattedDate}</strong> · Duration: <strong>${timeTakenMins} minutes</strong>
              </p>

              <!-- Overall Score Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; margin-bottom: 24px; padding: 20px;">
                <tr>
                  <td width="50%" align="center" style="border-right: 1px solid #e2e8f0; padding: 12px;">
                    <p style="margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; font-weight: 700;">
                      Total Score
                    </p>
                    <div style="font-size: 36px; font-weight: 900; color: ${scoreColor}; margin: 4px 0;">
                      ${result.totalScore} <span style="font-size: 16px; color: #94a3b8; font-weight: 500;">/ 300</span>
                    </div>
                    <p style="margin: 0; font-size: 12px; color: #16a34a; font-weight: 600;">
                      Accuracy: ${result.overallAccuracy}%
                    </p>
                  </td>
                  <td width="50%" align="center" style="padding: 12px;">
                    <p style="margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; font-weight: 700;">
                      Estimated Percentile
                    </p>
                    <div style="font-size: 32px; font-weight: 900; color: #2563eb; margin: 4px 0;">
                      ${result.percentileEstimate}%ile
                    </div>
                    <p style="margin: 0; font-size: 12px; color: #64748b;">
                      Est. AIR: ~${result.estimatedRank.toLocaleString()}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Question Statistics Grid -->
              <table width="100%" cellpadding="8" cellspacing="0" style="margin-bottom: 24px; font-size: 13px;">
                <tr style="background-color: #f1f5f9; text-align: center; font-weight: 700; color: #475569;">
                  <td style="border-radius: 8px 0 0 8px;">Attempted</td>
                  <td>Correct (+4)</td>
                  <td>Incorrect (−1)</td>
                  <td style="border-radius: 0 8px 8px 0;">Unanswered (0)</td>
                </tr>
                <tr style="text-align: center; font-weight: 800; font-size: 16px;">
                  <td style="color: #0f172a; padding: 12px 0;">${result.totalAttempted} / 75</td>
                  <td style="color: #16a34a; padding: 12px 0;">${result.totalCorrect}</td>
                  <td style="color: #dc2626; padding: 12px 0;">${result.totalIncorrect}</td>
                  <td style="color: #64748b; padding: 12px 0;">${result.totalUnattempted}</td>
                </tr>
              </table>

              <!-- Subject Breakdown Table -->
              <h3 style="margin: 0 0 12px 0; font-size: 15px; font-weight: 700; color: #0f172a;">
                Subject-Wise Score Breakdown
              </h3>
              <table width="100%" cellpadding="10" cellspacing="0" style="border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 28px; font-size: 13px; text-align: left; border-collapse: collapse;">
                <thead>
                  <tr style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0; color: #475569; font-weight: 700; font-size: 11px; text-transform: uppercase;">
                    <th style="padding: 10px 12px;">Subject</th>
                    <th style="padding: 10px 12px; text-align: center;">Attempted</th>
                    <th style="padding: 10px 12px; text-align: center;">Correct / Wrong</th>
                    <th style="padding: 10px 12px; text-align: center;">Marks (out of 100)</th>
                    <th style="padding: 10px 12px; text-align: right;">Accuracy</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 12px; font-weight: 700; color: #1e40af;">Physics</td>
                    <td style="padding: 12px; text-align: center;">${result.physics.attempted} / 25</td>
                    <td style="padding: 12px; text-align: center; color: #475569;">${result.physics.correct} / ${result.physics.incorrect}</td>
                    <td style="padding: 12px; text-align: center; font-weight: 800; color: #0f172a;">${result.physics.score}</td>
                    <td style="padding: 12px; text-align: right; font-weight: 700; color: #16a34a;">${result.physics.accuracy}%</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 12px; font-weight: 700; color: #059669;">Chemistry</td>
                    <td style="padding: 12px; text-align: center;">${result.chemistry.attempted} / 25</td>
                    <td style="padding: 12px; text-align: center; color: #475569;">${result.chemistry.correct} / ${result.chemistry.incorrect}</td>
                    <td style="padding: 12px; text-align: center; font-weight: 800; color: #0f172a;">${result.chemistry.score}</td>
                    <td style="padding: 12px; text-align: right; font-weight: 700; color: #16a34a;">${result.chemistry.accuracy}%</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px; font-weight: 700; color: #7c3aed;">Mathematics</td>
                    <td style="padding: 12px; text-align: center;">${result.mathematics.attempted} / 25</td>
                    <td style="padding: 12px; text-align: center; color: #475569;">${result.mathematics.correct} / ${result.mathematics.incorrect}</td>
                    <td style="padding: 12px; text-align: center; font-weight: 800; color: #0f172a;">${result.mathematics.score}</td>
                    <td style="padding: 12px; text-align: right; font-weight: 700; color: #16a34a;">${result.mathematics.accuracy}%</td>
                  </tr>
                </tbody>
              </table>

              <!-- Call to Action Button -->
              <div style="text-align: center; margin: 32px 0 16px 0;">
                <a href="${resultLink}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; padding: 14px 32px; border-radius: 12px; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);">
                  View Detailed Scorecard & Step-by-Step Solutions →
                </a>
              </div>

              <p style="margin: 20px 0 0 0; font-size: 12px; text-align: center; color: #94a3b8;">
                Log in to your student dashboard anytime to view mistake analytics, chapter strength ratings, and rank progression.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 28px; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #94a3b8; line-height: 1.5;">
                © JEE PYQ 30 Test Series · Joint Entrance Examination Practice Portal<br>
                This automated test notification was securely sent to ${studentEmail}.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const logEntry: EmailNotificationLog = {
      id: `email_res_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      recipientEmail: studentEmail,
      recipientName: studentName,
      subject: `[JEE PYQ 30 Result] ${testTitle}: Score ${result.totalScore}/300 (${result.overallAccuracy}% Accuracy)`,
      type: 'TEST_RESULT',
      status: this.isConfigured ? 'SENT' : 'SANDBOX_LOGGED',
      sentAt: Date.now(),
      metadata: {
        attemptId,
        testTitle,
        slotNumber,
        score: result.totalScore,
        accuracy: result.overallAccuracy
      }
    };

    if (this.isConfigured && this.transporter) {
      try {
        const info = await this.transporter.sendMail({
          from: fromAddress,
          to: studentEmail,
          subject: `[JEE PYQ 30 Result] ${testTitle}: Score ${result.totalScore}/300 (${result.overallAccuracy}% Accuracy)`,
          text: `Hello ${studentName},\nYour test "${testTitle}" has been evaluated.\nScore: ${result.totalScore}/300\nAccuracy: ${result.overallAccuracy}%\nPercentile Estimate: ${result.percentileEstimate}%ile\nView full solutions in your dashboard.`,
          html: htmlContent
        });

        this.sentNotificationCache.add(dedupeKey);
        logEntry.status = 'SENT';
        this.emailLogs.push(logEntry);

        return {
          success: true,
          status: 'SENT',
          messageId: info.messageId
        };
      } catch (err: any) {
        console.error('[EmailService] Failed to send real test result email:', err);
        logEntry.status = 'FAILED';
        logEntry.error = err.message || 'SMTP Transport Error';
        this.emailLogs.push(logEntry);

        return {
          success: false,
          status: 'FAILED',
          error: err.message
        };
      }
    } else {
      // Sandbox mode: register as sent in test environment
      console.log(`[EmailService] [SANDBOX RESULT EMAIL] To: ${studentEmail} | Test: ${testTitle} | Score: ${result.totalScore}/300 | Acc: ${result.overallAccuracy}%`);
      this.sentNotificationCache.add(dedupeKey);
      this.emailLogs.push(logEntry);

      return {
        success: true,
        status: 'SANDBOX_LOGGED'
      };
    }
  }
}

export const emailService = new EmailService();

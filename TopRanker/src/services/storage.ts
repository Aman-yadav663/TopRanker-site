import type { 
  TestAttempt, 
  TestResult, 
  BookmarkItem, 
  MistakeItem, 
  UserProfile, 
  Question,
  AuthUser,
  PaymentRecord
} from '../types.ts';

const STORAGE_KEYS = {
  ACTIVE_ATTEMPT: 'jee_active_attempt_v1',
  ATTEMPT_HISTORY: 'jee_attempt_history_v1',
  BOOKMARKS: 'jee_bookmarks_v1',
  MISTAKES: 'jee_mistakes_v1',
  USER_PROFILE: 'jee_user_profile_v1',
  AUTH_TOKEN: 'jee_auth_token_v1',
  AUTH_USER: 'jee_auth_user_v1',
  CUSTOM_QUESTIONS: 'jee_custom_questions_v1',
  PAYMENT_HISTORY: 'jee_payment_history_v1',
  REVISED_CHAPTERS: 'jee_revised_chapters_v1',
  MIND_MAP_BOOKMARKS: 'jee_mind_map_bookmarks_v1',
  RECENT_MIND_MAPS: 'jee_recent_mind_maps_v1'
};

const DEFAULT_AUTH_USER: AuthUser = {
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
  createdAt: Date.now()
};

export const storage = {
  // Authentication & Session
  getAuthToken(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch {
      return null;
    }
  },

  setAuthToken(token: string | null): void {
    try {
      if (token) {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      } else {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      }
    } catch (e) {
      console.error('Failed to set auth token:', e);
    }
  },

  getAuthUser(): AuthUser {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      if (data) {
        return JSON.parse(data);
      }
      return DEFAULT_AUTH_USER;
    } catch {
      return DEFAULT_AUTH_USER;
    }
  },

  setAuthUser(user: AuthUser | null): void {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
        // Sync legacy profile
        this.saveUserProfile({
          id: user.id,
          name: user.name,
          email: user.email,
          targetYear: user.targetYear,
          targetPercentile: user.targetPercentile,
          targetCollege: user.targetCollege,
          category: user.category,
          createdAt: user.createdAt
        });
      } else {
        localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
      }
    } catch (e) {
      console.error('Failed to set auth user:', e);
    }
  },

  isLoggedIn(): boolean {
    return Boolean(this.getAuthToken());
  },

  isPremiumMember(): boolean {
    const user = this.getAuthUser();
    if (user.role === 'admin') return true;
    return (
      user.membership.status === 'PREMIUM_ACTIVE' &&
      user.membership.validUntil > Date.now()
    );
  },

  logout(): void {
    this.setAuthToken(null);
    this.setAuthUser(null);
  },

  async syncSession(): Promise<AuthUser | null> {
    const token = this.getAuthToken();
    if (!token) return null;

    try {
      const res = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          this.setAuthUser(data.user);
          return data.user;
        }
      } else if (res.status === 401) {
        this.logout();
      }
    } catch (e) {
      console.warn('Could not sync session with server, keeping cached profile:', e);
    }
    return this.getAuthUser();
  },

  // Legacy User Profile interface compatibility
  getUserProfile(): UserProfile {
    const auth = this.getAuthUser();
    return {
      id: auth.id,
      name: auth.name,
      email: auth.email,
      targetYear: auth.targetYear,
      targetPercentile: auth.targetPercentile,
      targetCollege: auth.targetCollege,
      category: auth.category,
      createdAt: auth.createdAt
    };
  },

  saveUserProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save user profile', e);
    }
  },

  // Active CBT Attempt
  getActiveAttempt(): TestAttempt | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_ATTEMPT);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveActiveAttempt(attempt: TestAttempt): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_ATTEMPT, JSON.stringify(attempt));
    } catch (e) {
      console.error('Failed to save active attempt', e);
    }
  },

  clearActiveAttempt(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_ATTEMPT);
    } catch (e) {
      console.error('Failed to clear active attempt', e);
    }
  },

  // Attempt History
  getAttemptHistory(): TestAttempt[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ATTEMPT_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveAttemptToHistory(attempt: TestAttempt): void {
    try {
      const history = this.getAttemptHistory();
      const existingIdx = history.findIndex(a => a.id === attempt.id);
      if (existingIdx >= 0) {
        history[existingIdx] = attempt;
      } else {
        history.unshift(attempt);
      }
      localStorage.setItem(STORAGE_KEYS.ATTEMPT_HISTORY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save attempt history', e);
    }
  },

  getAttemptById(id: string): TestAttempt | undefined {
    const history = this.getAttemptHistory();
    return history.find(a => a.id === id);
  },

  // Bookmarks
  getBookmarks(): BookmarkItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addBookmark(item: BookmarkItem): void {
    try {
      const bookmarks = this.getBookmarks();
      if (!bookmarks.some(b => b.questionId === item.questionId)) {
        bookmarks.unshift(item);
        localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
      }
    } catch (e) {
      console.error('Failed to add bookmark', e);
    }
  },

  removeBookmark(questionId: string): void {
    try {
      const bookmarks = this.getBookmarks().filter(b => b.questionId !== questionId);
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
    } catch (e) {
      console.error('Failed to remove bookmark', e);
    }
  },

  isBookmarked(questionId: string): boolean {
    return this.getBookmarks().some(b => b.questionId === questionId);
  },

  // Mistakes
  getMistakes(): MistakeItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MISTAKES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  recordMistake(item: MistakeItem): void {
    try {
      const mistakes = this.getMistakes();
      const existingIdx = mistakes.findIndex(m => m.questionId === item.questionId);
      if (existingIdx >= 0) {
        mistakes[existingIdx] = item;
      } else {
        mistakes.unshift(item);
      }
      localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(mistakes));
    } catch (e) {
      console.error('Failed to record mistake', e);
    }
  },

  removeMistake(questionId: string): void {
    try {
      const mistakes = this.getMistakes().filter(m => m.questionId !== questionId);
      localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(mistakes));
    } catch (e) {
      console.error('Failed to remove mistake', e);
    }
  },

  // Custom Questions
  getCustomQuestions(): Question[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_QUESTIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addCustomQuestion(question: Question): void {
    try {
      const questions = this.getCustomQuestions();
      questions.push(question);
      localStorage.setItem(STORAGE_KEYS.CUSTOM_QUESTIONS, JSON.stringify(questions));
    } catch (e) {
      console.error('Failed to save custom question', e);
    }
  },

  // Local Payments Cache
  getLocalPayments(): PaymentRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PAYMENT_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveLocalPayment(payment: PaymentRecord): void {
    try {
      const history = this.getLocalPayments();
      history.unshift(payment);
      localStorage.setItem(STORAGE_KEYS.PAYMENT_HISTORY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save local payment:', e);
    }
  },

  // Server Synchronization for Test Attempts & Analytics
  async syncAttemptsWithServer(): Promise<TestAttempt[]> {
    const token = this.getAuthToken();
    if (!token) return this.getAttemptHistory();

    try {
      const res = await fetch('/api/student/attempts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.attempts && Array.isArray(data.attempts)) {
          const local = this.getAttemptHistory();
          const map = new Map<string, TestAttempt>();
          data.attempts.forEach((a: TestAttempt) => map.set(a.id, a));
          local.forEach((a: TestAttempt) => {
            if (!map.has(a.id)) map.set(a.id, a);
          });
          const merged = Array.from(map.values()).sort(
            (a, b) => (b.submittedAt || b.startedAt) - (a.submittedAt || a.startedAt)
          );
          localStorage.setItem(STORAGE_KEYS.ATTEMPT_HISTORY, JSON.stringify(merged));
          return merged;
        }
      }
    } catch (e) {
      console.warn('Could not sync attempts with server:', e);
    }
    return this.getAttemptHistory();
  },

  async fetchStudentAnalytics(): Promise<any | null> {
    const token = this.getAuthToken();
    if (!token) return null;

    try {
      const res = await fetch('/api/student/analytics', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        return data.analytics || null;
      }
    } catch (e) {
      console.error('Failed to fetch student analytics:', e);
    }
    return null;
  },

  // Mind Map Revision Hub Persistence
  getRevisedChapters(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REVISED_CHAPTERS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  setChapterRevised(chapterId: string, revised: boolean): void {
    try {
      const current = this.getRevisedChapters();
      let updated: string[];
      if (revised) {
        if (!current.includes(chapterId)) {
          updated = [...current, chapterId];
        } else {
          updated = current;
        }
      } else {
        updated = current.filter(id => id !== chapterId);
      }
      localStorage.setItem(STORAGE_KEYS.REVISED_CHAPTERS, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to set chapter revised state:', e);
    }
  },

  isChapterRevised(chapterId: string): boolean {
    return this.getRevisedChapters().includes(chapterId);
  },

  getBookmarkedMindMaps(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MIND_MAP_BOOKMARKS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  toggleBookmarkMindMap(chapterId: string): boolean {
    try {
      const current = this.getBookmarkedMindMaps();
      let isNowBookmarked = false;
      let updated: string[];
      if (current.includes(chapterId)) {
        updated = current.filter(id => id !== chapterId);
        isNowBookmarked = false;
      } else {
        updated = [...current, chapterId];
        isNowBookmarked = true;
      }
      localStorage.setItem(STORAGE_KEYS.MIND_MAP_BOOKMARKS, JSON.stringify(updated));
      return isNowBookmarked;
    } catch (e) {
      console.error('Failed to toggle mind map bookmark:', e);
      return false;
    }
  },

  isMindMapBookmarked(chapterId: string): boolean {
    return this.getBookmarkedMindMaps().includes(chapterId);
  },

  getRecentMindMaps(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RECENT_MIND_MAPS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  recordRecentMindMap(chapterId: string): void {
    try {
      const current = this.getRecentMindMaps();
      const filtered = current.filter(id => id !== chapterId);
      const updated = [chapterId, ...filtered].slice(0, 10);
      localStorage.setItem(STORAGE_KEYS.RECENT_MIND_MAPS, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to record recent mind map:', e);
    }
  }
};


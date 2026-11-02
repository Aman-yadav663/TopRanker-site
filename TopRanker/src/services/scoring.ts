import type { TestPaper, QuestionResponse, TestResult, SubjectScore, ChapterAnalysis, Subject } from '../types.ts';

export function calculateTestResult(
  testPaper: TestPaper,
  attemptId: string,
  userId: string,
  responses: Record<string, QuestionResponse>,
  timeTakenSeconds: number
): TestResult {
  const allQuestions = [
    ...testPaper.physicsQuestions,
    ...testPaper.chemistryQuestions,
    ...testPaper.mathsQuestions
  ];

  let totalCorrect = 0;
  let totalIncorrect = 0;
  let totalUnattempted = 0;
  let totalScore = 0;

  const subjectStats: Record<Subject, { correct: number; incorrect: number; unattempted: number; score: number; timeSpent: number; total: number }> = {
    Physics: { correct: 0, incorrect: 0, unattempted: 0, score: 0, timeSpent: 0, total: 25 },
    Chemistry: { correct: 0, incorrect: 0, unattempted: 0, score: 0, timeSpent: 0, total: 25 },
    Mathematics: { correct: 0, incorrect: 0, unattempted: 0, score: 0, timeSpent: 0, total: 25 },
  };

  const chapterMap: Record<string, { subject: Subject; total: number; attempted: number; correct: number; incorrect: number }> = {};

  for (const q of allQuestions) {
    const resp = responses[q.id];
    const isAnswered = resp && resp.userAnswer && resp.userAnswer.trim() !== '';
    const userAnswer = isAnswered ? resp.userAnswer!.trim() : '';

    // Chapter tracker init
    if (!chapterMap[q.chapter]) {
      chapterMap[q.chapter] = {
        subject: q.subject,
        total: 0,
        attempted: 0,
        correct: 0,
        incorrect: 0
      };
    }
    chapterMap[q.chapter].total += 1;

    let isCorrect = false;
    let marksAwarded = 0;

    if (isAnswered) {
      chapterMap[q.chapter].attempted += 1;
      
      // Verification logic:
      if (q.type === 'MCQ') {
        // Strip options label if user answered "A" vs "A) ..."
        const cleanedUserAns = userAnswer.charAt(0).toUpperCase();
        const cleanedCorrectAns = q.correctAnswer.trim().charAt(0).toUpperCase();
        isCorrect = cleanedUserAns === cleanedCorrectAns;
      } else {
        // Numerical value evaluation: allow exact or floating-point proximity
        const uNum = parseFloat(userAnswer);
        const cNum = parseFloat(q.correctAnswer);
        if (!isNaN(uNum) && !isNaN(cNum)) {
          const tol = q.numericalTolerance ?? 0.05;
          isCorrect = Math.abs(uNum - cNum) <= tol;
        } else {
          isCorrect = userAnswer.toLowerCase() === q.correctAnswer.trim().toLowerCase();
        }
      }

      if (isCorrect) {
        marksAwarded = 4;
        totalCorrect += 1;
        totalScore += 4;
        subjectStats[q.subject].correct += 1;
        subjectStats[q.subject].score += 4;
        chapterMap[q.chapter].correct += 1;
      } else {
        marksAwarded = -1;
        totalIncorrect += 1;
        totalScore -= 1;
        subjectStats[q.subject].incorrect += 1;
        subjectStats[q.subject].score -= 1;
        chapterMap[q.chapter].incorrect += 1;
      }

      if (resp) {
        resp.isCorrect = isCorrect;
        resp.marksAwarded = marksAwarded;
      }
    } else {
      totalUnattempted += 1;
      subjectStats[q.subject].unattempted += 1;
    }

    if (resp && resp.timeSpentSeconds) {
      subjectStats[q.subject].timeSpent += resp.timeSpentSeconds;
    }
  }

  const totalAttempted = totalCorrect + totalIncorrect;
  const overallAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

  const buildSubjectScore = (sub: Subject): SubjectScore => {
    const s = subjectStats[sub];
    const subAttempted = s.correct + s.incorrect;
    return {
      attempted: subAttempted,
      correct: s.correct,
      incorrect: s.incorrect,
      unattempted: s.unattempted,
      score: s.score,
      accuracy: subAttempted > 0 ? Math.round((s.correct / subAttempted) * 100) : 0,
      timeSpentSeconds: s.timeSpent
    };
  };

  const chapterWiseAnalysis: ChapterAnalysis[] = Object.entries(chapterMap).map(([chapter, data]) => ({
    chapter,
    subject: data.subject,
    total: data.total,
    attempted: data.attempted,
    correct: data.correct,
    incorrect: data.incorrect,
    accuracy: data.attempted > 0 ? Math.round((data.correct / data.attempted) * 100) : 0
  }));

  const weakChapters = chapterWiseAnalysis
    .filter(c => c.attempted > 0 && c.accuracy < 50)
    .map(c => c.chapter);

  const strongChapters = chapterWiseAnalysis
    .filter(c => c.attempted > 0 && c.accuracy >= 75)
    .map(c => c.chapter);

  // Percentile calculation estimation based on official JEE Main normalizations
  let percentileEstimate = 50.0;
  if (totalScore >= 270) percentileEstimate = 99.95;
  else if (totalScore >= 240) percentileEstimate = 99.5;
  else if (totalScore >= 210) percentileEstimate = 99.0;
  else if (totalScore >= 180) percentileEstimate = 98.2;
  else if (totalScore >= 150) percentileEstimate = 96.5;
  else if (totalScore >= 120) percentileEstimate = 93.0;
  else if (totalScore >= 90) percentileEstimate = 87.0;
  else if (totalScore >= 60) percentileEstimate = 75.0;
  else if (totalScore >= 30) percentileEstimate = 60.0;
  else percentileEstimate = Math.max(10, Math.round((totalScore / 30) * 30));

  // Estimated All India Rank (AIR) in ~1,400,000 JEE candidates
  const estimatedRank = Math.max(1, Math.round(((100 - percentileEstimate) / 100) * 1400000));

  return {
    attemptId,
    testId: testPaper.id,
    testTitle: testPaper.title,
    userId,
    totalScore,
    totalAttempted,
    totalCorrect,
    totalIncorrect,
    totalUnattempted,
    overallAccuracy,
    timeTakenSeconds,
    physics: buildSubjectScore('Physics'),
    chemistry: buildSubjectScore('Chemistry'),
    mathematics: buildSubjectScore('Mathematics'),
    percentileEstimate,
    estimatedRank,
    chapterWiseAnalysis,
    weakChapters,
    strongChapters,
    submittedAt: Date.now()
  };
}

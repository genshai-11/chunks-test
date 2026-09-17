import { BlueQuestionAttempt, PercentIMetrics, SevenColor } from '../../types/blue-test';
import { isColdColor, isHotColor } from './color-engine';

/**
 * Calculates %i and related completion statistics from finalized or corrected question attempts.
 * Rules:
 * - Pending questions are NOT classified as hot or cold, and do NOT affect the denominator.
 * - If finalizedCount === 0, provisionalPercentI is null (displayed as "—").
 * - If finalizedCount < 49, isProvisional is true.
 * - %i = (coldColorCount / finalizedCount) * 100
 */
export function calculatePercentIMetrics(attempts: BlueQuestionAttempt[]): PercentIMetrics {
  const totalQuestions = 49;

  // Filter only finalized/corrected attempts
  const finalizedAttempts = attempts.filter((a) => a.finalizedAt);
  const finalizedCount = finalizedAttempts.length;

  const colorCounts: Record<SevenColor, number> = {
    red: 0,
    orange: 0,
    yellow: 0,
    green: 0,
    blue: 0,
    indigo: 0,
    purple: 0,
  };

  let hotColorCount = 0;
  let coldColorCount = 0;

  for (const attempt of finalizedAttempts) {
    const color = attempt.effectiveColor;
    if (colorCounts[color] !== undefined) {
      colorCounts[color]++;
    }
    if (isHotColor(color)) {
      hotColorCount++;
    } else if (isColdColor(color)) {
      coldColorCount++;
    }
  }

  const completionPercent = (finalizedCount / totalQuestions) * 100;

  let provisionalPercentI: number | null = null;
  if (finalizedCount > 0) {
    provisionalPercentI = (coldColorCount / finalizedCount) * 100;
  }

  return {
    totalQuestions,
    finalizedCount,
    completionPercent,
    hotColorCount,
    coldColorCount,
    colorCounts,
    provisionalPercentI,
    isProvisional: finalizedCount < totalQuestions,
  };
}

/**
 * Calculates %i specifically for a given session (sessionNumber 1..7).
 */
export function calculateSessionPercentI(
  attempts: BlueQuestionAttempt[],
  sessionNumber: number
): { sessionNumber: number; finalizedCount: number; coldCount: number; percentI: number | null } {
  const sessionAttempts = attempts.filter((a) => a.sessionNumber === sessionNumber && a.finalizedAt);
  const finalizedCount = sessionAttempts.length;

  if (finalizedCount === 0) {
    return { sessionNumber, finalizedCount: 0, coldCount: 0, percentI: null };
  }

  const coldCount = sessionAttempts.filter((a) => isColdColor(a.effectiveColor)).length;
  const percentI = (coldCount / finalizedCount) * 100;

  return { sessionNumber, finalizedCount, coldCount, percentI };
}

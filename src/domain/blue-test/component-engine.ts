import {
  BlueQuestionAttempt,
  ComponentAssessmentChoice,
  ComponentAssessmentEvent,
  ComponentOutcome,
  ComponentRawSummary,
  ComponentExposureFact,
  PercentCPDResult,
} from '../../types/blue-test';

/**
 * Validates question global order q (1..49).
 */
export function validateQuestionOrder(q: number): void {
  if (typeof q !== 'number' || !Number.isInteger(q) || q < 1 || q > 49) {
    throw new Error(`Invalid question global order: ${q}. Must be an integer between 1 and 49.`);
  }
}

/**
 * Validates assessment choice and component index bounds for a given question Qq.
 */
export function validateAssessmentChoice(choice: ComponentAssessmentChoice, q: number): void {
  validateQuestionOrder(q);

  if (!choice || !choice.mode) {
    throw new Error('Assessment choice must contain a valid mode.');
  }

  if (choice.mode === 'stopped_at') {
    const k = choice.stoppedComponentIndex;
    if (typeof k !== 'number' || !Number.isInteger(k) || k < 1 || k > q) {
      throw new Error(
        `Invalid stopped component index ${k} for question Q${q}. Must be an integer between 1 and ${q}.`
      );
    }
  } else if (choice.mode !== 'pending_teacher_entry' && choice.mode !== 'completed_all') {
    throw new Error(`Unsupported assessment mode: ${(choice as any).mode}`);
  }
}

/**
 * Returns the ordered list of applicable components [1..q] for question Qq.
 */
export function getApplicableComponentsForQuestion(q: number): number[] {
  validateQuestionOrder(q);
  const components: number[] = [];
  for (let k = 1; k <= q; k++) {
    components.push(k);
  }
  return components;
}

/**
 * Derives the 49 matrix-cell outcomes for question Qq given an assessment choice.
 * For m > q: 'not_applicable'
 * For m <= q:
 *   - 'pending_teacher_entry' -> 'pending_teacher_entry'
 *   - 'completed_all' -> 'passed'
 *   - 'stopped_at' Ck -> C1..C(k-1): 'passed', Ck: 'failed', C(k+1)..Cq: 'not_attempted'
 */
export function deriveMatrixCellOutcomes(
  q: number,
  choice: ComponentAssessmentChoice
): Record<number, ComponentOutcome> {
  validateAssessmentChoice(choice, q);

  const outcomes: Record<number, ComponentOutcome> = {};

  for (let m = 1; m <= 49; m++) {
    if (m > q) {
      outcomes[m] = 'not_applicable';
    } else if (choice.mode === 'pending_teacher_entry') {
      outcomes[m] = 'pending_teacher_entry';
    } else if (choice.mode === 'completed_all') {
      outcomes[m] = 'passed';
    } else if (choice.mode === 'stopped_at') {
      const k = choice.stoppedComponentIndex!;
      if (m < k) {
        outcomes[m] = 'passed';
      } else if (m === k) {
        outcomes[m] = 'failed';
      } else {
        outcomes[m] = 'not_attempted';
      }
    }
  }

  return outcomes;
}

/**
 * Filters and retrieves the latest effective assessment event from an append-only event list.
 */
export function getLatestEffectiveAssessmentEvent(
  events: ComponentAssessmentEvent[]
): ComponentAssessmentEvent | null {
  if (!events || events.length === 0) return null;
  const sorted = [...events].sort((a, b) => a.sequence - b.sequence);
  return sorted[sorted.length - 1];
}

/**
 * Derives current effective choice for a question attempt based on its event history.
 * Legacy or un-assessed attempts safely default to 'pending_teacher_entry'.
 */
export function getEffectiveAssessmentChoice(
  events: ComponentAssessmentEvent[]
): ComponentAssessmentChoice {
  const latest = getLatestEffectiveAssessmentEvent(events);
  if (!latest) {
    return { mode: 'pending_teacher_entry' };
  }
  return latest.choice;
}

/**
 * Calculates Component Mastery and Percent CPD across all 49 components for an assignment.
 * Ck is mastered if at least one currently effective applicable outcome for Ck is 'passed'.
 */
export function calculateComponentMastery(
  events: ComponentAssessmentEvent[],
  attempts: BlueQuestionAttempt[]
): PercentCPDResult {
  const masteredMap: Record<number, boolean> = {};
  for (let k = 1; k <= 49; k++) {
    masteredMap[k] = false;
  }

  // Group events by globalQuestionOrder (or attemptId)
  const eventsByQuestion: Record<number, ComponentAssessmentEvent[]> = {};
  for (const event of events) {
    if (!eventsByQuestion[event.questionGlobalOrder]) {
      eventsByQuestion[event.questionGlobalOrder] = [];
    }
    eventsByQuestion[event.questionGlobalOrder].push(event);
  }

  // Evaluate each attempt/question
  for (const attempt of attempts) {
    const q = attempt.globalQuestionOrder;
    if (q < 1 || q > 49) continue;

    const qEvents = eventsByQuestion[q] || [];
    const choice = getEffectiveAssessmentChoice(qEvents);
    const outcomes = deriveMatrixCellOutcomes(q, choice);

    for (let k = 1; k <= q; k++) {
      if (outcomes[k] === 'passed') {
        masteredMap[k] = true;
      }
    }
  }

  let masteredCount = 0;
  for (let k = 1; k <= 49; k++) {
    if (masteredMap[k]) {
      masteredCount++;
    }
  }

  const percentage = (masteredCount / 49) * 100;

  return {
    masteredCount,
    percentage,
    masteredMap,
  };
}

/**
 * Calculates Percent CPD from mastered count or boolean map.
 */
export function calculatePercentCPD(
  input: number | Record<number, boolean> | boolean[]
): PercentCPDResult {
  let masteredCount = 0;
  const masteredMap: Record<number, boolean> = {};

  if (typeof input === 'number') {
    masteredCount = Math.max(0, Math.min(49, Math.round(input)));
    for (let k = 1; k <= 49; k++) {
      masteredMap[k] = k <= masteredCount;
    }
  } else if (Array.isArray(input)) {
    for (let k = 1; k <= 49; k++) {
      const isMastered = Boolean(input[k - 1] || input[k]);
      masteredMap[k] = isMastered;
      if (isMastered) masteredCount++;
    }
  } else if (typeof input === 'object' && input !== null) {
    for (let k = 1; k <= 49; k++) {
      const isMastered = Boolean(input[k]);
      masteredMap[k] = isMastered;
      if (isMastered) masteredCount++;
    }
  }

  return {
    masteredCount,
    percentage: (masteredCount / 49) * 100,
    masteredMap,
  };
}

/**
 * Derives raw component summaries for future ACCN computation without imposing an aggregate formula.
 */
export function deriveComponentRawSummaries(
  events: ComponentAssessmentEvent[],
  attempts: BlueQuestionAttempt[]
): ComponentRawSummary[] {
  const eventsByQuestion: Record<number, ComponentAssessmentEvent[]> = {};
  for (const event of events) {
    if (!eventsByQuestion[event.questionGlobalOrder]) {
      eventsByQuestion[event.questionGlobalOrder] = [];
    }
    eventsByQuestion[event.questionGlobalOrder].push(event);
  }

  const sortedAttempts = [...attempts].sort(
    (a, b) => a.globalQuestionOrder - b.globalQuestionOrder
  );

  const summaries: ComponentRawSummary[] = [];

  for (let k = 1; k <= 49; k++) {
    const exposures: ComponentExposureFact[] = [];
    let passedCount = 0;
    let failedCount = 0;
    let notAttemptedCount = 0;
    let firstClearedQuestionGlobalOrder: number | null = null;
    let firstClearedExposureIndex: number | null = null;

    let exposureIndex = 0;

    for (const attempt of sortedAttempts) {
      const q = attempt.globalQuestionOrder;
      if (q < k) continue; // Component k is not applicable for Qq where q < k

      exposureIndex++;
      const qEvents = eventsByQuestion[q] || [];
      const latestEvent = getLatestEffectiveAssessmentEvent(qEvents);
      const choice = getEffectiveAssessmentChoice(qEvents);
      const outcomes = deriveMatrixCellOutcomes(q, choice);
      const outcome = outcomes[k];

      if (outcome === 'passed') {
        passedCount++;
        if (firstClearedQuestionGlobalOrder === null) {
          firstClearedQuestionGlobalOrder = q;
          firstClearedExposureIndex = exposureIndex;
        }
      } else if (outcome === 'failed') {
        failedCount++;
      } else if (outcome === 'not_attempted') {
        notAttemptedCount++;
      }

      exposures.push({
        assignmentId: attempt.assignmentId,
        questionGlobalOrder: q,
        componentIndex: k,
        outcome,
        choiceMode: choice.mode,
        stoppedComponentIndex: choice.stoppedComponentIndex,
        timestamp: latestEvent ? latestEvent.timestamp : attempt.finalizedAt,
        actor: latestEvent ? latestEvent.actor : 'system',
      });
    }

    summaries.push({
      componentIndex: k,
      totalExposures: exposures.filter((e) => e.outcome !== 'pending_teacher_entry').length,
      passedCount,
      failedCount,
      notAttemptedCount,
      isMastered: passedCount > 0,
      firstClearedQuestionGlobalOrder,
      firstClearedExposureIndex,
      exposures,
    });
  }

  return summaries;
}

import {
  ComponentAssessmentChoice,
  ComponentOutcome,
  ComponentRawSummary,
  PercentCPDResult,
} from '../types/blue-metrics'

export function validateQuestionOrder(q: number): void {
  if (typeof q !== 'number' || !Number.isInteger(q) || q < 1 || q > 49) {
    throw new Error(`Invalid question global order: ${q}. Must be an integer between 1 and 49.`)
  }
}

export function validateAssessmentChoice(choice: ComponentAssessmentChoice, q: number): void {
  validateQuestionOrder(q)
  if (!choice || !choice.mode) {
    throw new Error('Assessment choice must contain a valid mode.')
  }
  if (choice.mode === 'stopped_at') {
    const k = choice.stoppedComponentIndex
    if (typeof k !== 'number' || !Number.isInteger(k) || k < 1 || k > q) {
      throw new Error(`Invalid stopped component index ${k} for question Q${q}. Must be 1 <= k <= ${q}.`)
    }
  }
}

export function deriveMatrixCellOutcomes(
  q: number,
  choice: ComponentAssessmentChoice,
): Record<number, ComponentOutcome> {
  validateAssessmentChoice(choice, q)
  const outcomes: Record<number, ComponentOutcome> = {}

  for (let m = 1; m <= 49; m++) {
    if (m > q) {
      outcomes[m] = 'not_applicable'
    } else if (choice.mode === 'pending_teacher_entry') {
      outcomes[m] = 'not_attempted'
    } else if (choice.mode === 'completed_all') {
      outcomes[m] = 'passed'
    } else if (choice.mode === 'stopped_at') {
      const k = choice.stoppedComponentIndex!
      if (m < k) {
        outcomes[m] = 'passed'
      } else if (m === k) {
        outcomes[m] = 'failed'
      } else {
        outcomes[m] = 'not_attempted'
      }
    }
  }

  return outcomes
}

/**
 * Calculates %CPD Component Mastery across all 49 components.
 * Component k is mastered if it was passed at least once and never failed after its first pass.
 */
export function calculateComponentMastery(
  recordedChoices: Record<number, ComponentAssessmentChoice>, // q -> choice
): PercentCPDResult {
  const masteredMap: Record<number, boolean> = {}
  let masteredCount = 0

  for (let k = 1; k <= 49; k++) {
    let hasPassed = false
    let hasFailedAfterPass = false

    for (let q = k; q <= 49; q++) {
      const choice = recordedChoices[q]
      if (!choice) continue

      if (choice.mode === 'completed_all') {
        hasPassed = true
      } else if (choice.mode === 'stopped_at') {
        const stopK = choice.stoppedComponentIndex!
        if (k < stopK) {
          hasPassed = true
        } else if (k === stopK) {
          if (hasPassed) {
            hasFailedAfterPass = true
          }
        }
      }
    }

    const isMastered = hasPassed && !hasFailedAfterPass
    masteredMap[k] = isMastered
    if (isMastered) masteredCount++
  }

  return {
    masteredCount,
    percentage: Math.round((masteredCount / 49) * 100),
    masteredMap,
  }
}

export function deriveComponentSummaries(
  recordedChoices: Record<number, ComponentAssessmentChoice>,
): ComponentRawSummary[] {
  const mastery = calculateComponentMastery(recordedChoices)
  const summaries: ComponentRawSummary[] = []

  for (let k = 1; k <= 49; k++) {
    let totalExposures = 0
    let passedCount = 0
    let failedCount = 0
    let notAttemptedCount = 0
    let firstCleared: number | null = null

    for (let q = 1; q <= 49; q++) {
      const choice = recordedChoices[q]
      if (!choice || q < k) continue

      totalExposures++
      if (choice.mode === 'completed_all') {
        passedCount++
        if (firstCleared === null) firstCleared = q
      } else if (choice.mode === 'stopped_at') {
        const stopK = choice.stoppedComponentIndex!
        if (k < stopK) {
          passedCount++
          if (firstCleared === null) firstCleared = q
        } else if (k === stopK) {
          failedCount++
        } else {
          notAttemptedCount++
        }
      }
    }

    summaries.push({
      componentIndex: k,
      totalExposures,
      passedCount,
      failedCount,
      notAttemptedCount,
      isMastered: mastery.masteredMap[k] ?? false,
      firstClearedQuestionGlobalOrder: firstCleared,
    })
  }

  return summaries
}

import { SevenColor } from './common'

export type CompletionMode = 'manual_end' | 'auto_max' | 'manual_red' | 'correction'

export type ComponentAssessmentMode = 'pending_teacher_entry' | 'stopped_at' | 'completed_all'

export type ComponentOutcome = 'passed' | 'failed' | 'not_attempted' | 'not_applicable'

export interface ComponentAssessmentChoice {
  mode: ComponentAssessmentMode
  stoppedComponentIndex?: number // 1 <= k <= q
}

export interface BlueAttemptResult {
  attemptId: string
  questionGlobalOrder: number // 1..49
  sessionNumber: number // 1..7
  questionInSession: number // 1..7
  maxTimeSecondsRaw: number
  elapsedSecondsRaw: number
  completionRatio: number
  completionMode: CompletionMode
  derivedColor: SevenColor
  effectiveColor: SevenColor
  timestamp: string
  componentChoice?: ComponentAssessmentChoice
}

export interface ComponentExposureFact {
  questionGlobalOrder: number
  componentIndex: number
  outcome: ComponentOutcome
  choiceMode: ComponentAssessmentMode
  stoppedComponentIndex?: number
  timestamp: string
}

export interface ComponentRawSummary {
  componentIndex: number // 1..49
  totalExposures: number
  passedCount: number
  failedCount: number
  notAttemptedCount: number
  isMastered: boolean
  firstClearedQuestionGlobalOrder: number | null
}

export interface PercentCPDResult {
  masteredCount: number // 0..49
  percentage: number // (masteredCount / 49) * 100
  masteredMap: Record<number, boolean>
}

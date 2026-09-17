export type SevenColor = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple';

export type CompletionMode = 'manual_end' | 'auto_max' | 'manual_red' | 'correction';

export type QuestionState = 'awaiting_start' | 'running' | 'finalizing' | 'result_review' | 'correction_open' | 'error';

export interface SevenColorDefinition {
  color: SevenColor;
  labelEn: string;
  labelVi: string;
  hex: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  isHot: boolean; // Red, Orange, Yellow are hot
}

export interface BlueQuestionDefinition {
  id: string;
  sessionNumber: number; // 1..7
  questionInSession: number; // 1..7
  globalOrder: number; // 1..49
  maxTimeSecondsRaw: number;
  maxTimeDisplay: string; // e.g. "1.9s"
  promptText: string;
}

export interface BlueSessionIntro {
  sessionNumber: number;
  title: string;
  narrationText: string;
}

export interface BlueTestPackage {
  id: string;
  name: string;
  version: string;
  packageIntroText: string;
  packageEndText: string;
  sessionIntros: BlueSessionIntro[];
  questions: BlueQuestionDefinition[];
}

export interface BlueAssignment {
  id: string;
  learnerId: string;
  packageVersionId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  assignedAt: string;
  assignedBy: string;
  completedAt?: string;
  currentGlobalOrder: number; // 1..49
  currentSessionNumber: number; // 1..7
}

export interface BlueSessionRun {
  id: string;
  assignmentId: string;
  sessionNumber: number;
  status: 'not_started' | 'in_progress' | 'completed';
  startedAt?: string;
  completedAt?: string;
}

export interface BlueQuestionAttempt {
  id: string;
  assignmentId: string;
  runId: string;
  questionId: string;
  globalQuestionOrder: number; // 1..49
  sessionNumber: number;
  questionInSession: number;
  maxTimeSecondsRaw: number;
  startedAt: string;
  endedAt: string;
  targetDeadlineTimestamp?: number;
  elapsedSecondsRaw: number;
  completionRatio: number; // clamp(elapsedSeconds / maxTimeSeconds, 0, 1)
  derivedColorAtStop: SevenColor;
  effectiveColor: SevenColor;
  effectiveElapsedSeconds?: number;
  effectiveCompletionRatio?: number;
  completionMode: CompletionMode;
  finalizedAt: string;
  correctedAt?: string;
  latestEventSequence: number;
  correctionReason?: string;
  correctedBy?: string;
}

export type AuditEventType =
  | 'attempt_started'
  | 'attempt_ended'
  | 'auto_max_reached'
  | 'manual_red_recorded'
  | 'result_finalized'
  | 'result_corrected';

export interface BlueAuditEvent {
  id: string;
  attemptId: string;
  assignmentId: string;
  eventType: AuditEventType;
  sequence: number;
  timestamp: string;
  actor: string;
  details: {
    elapsedSecondsRaw?: number;
    derivedColor?: SevenColor;
    effectiveColor?: SevenColor;
    previousColor?: SevenColor;
    reason?: string;
    mode?: CompletionMode;
    effectiveElapsedSeconds?: number;
    effectiveCompletionRatio?: number;
    observedElapsedSecondsRaw?: number;
    observedCompletionRatio?: number;
  };
}

export interface PercentIMetrics {
  totalQuestions: number; // 49
  finalizedCount: number;
  completionPercent: number;
  hotColorCount: number;
  coldColorCount: number;
  colorCounts: Record<SevenColor, number>;
  provisionalPercentI: number | null; // null if finalizedCount === 0
  isProvisional: boolean; // true if finalizedCount < 49
}

export interface AudioSettings {
  autoplayPackageIntro: boolean; // Mapped to Autoplay Test Intro
  autoplayTestIntro?: boolean;    // Alias for Autoplay Test Intro
  autoplaySessionIntro: boolean;
  autoplayQuestionNumber?: boolean;
  autoplayQuestionCue?: boolean;
  autoplayPackageEnd: boolean;
  enableBells: boolean;
  autoplayChallengeAudio?: boolean;
  timerSoundEnabled?: boolean;
  timerSoundVolume?: number;
}

export type NarrationLocationKey = string;

export interface BlueAudioVersion {
  id: string;
  locationKey: NarrationLocationKey;
  version: number;
  scriptText: string;
  voice: string; // 'Kore'
  model: string; // 'gemini-3.1-flash-tts-preview'
  audioUrl: string; // e.g. "/api/tts/audio/xxx" or data URL
  durationSeconds?: number;
  fileSizeBytes?: number;
  createdAt: string;
  isActive: boolean;
}

export interface BlueAudioLocationInfo {
  locationKey: NarrationLocationKey;
  label: string;
  description: string;
  defaultScript: string;
  activeVersionId: string | null;
  versions: BlueAudioVersion[];
}

// ==========================================
// CUMULATIVE COMPONENT TRACKING TYPES
// ==========================================

export type ComponentAssessmentMode = 'pending_teacher_entry' | 'stopped_at' | 'completed_all';

export interface ComponentAssessmentChoice {
  mode: ComponentAssessmentMode;
  stoppedComponentIndex?: number; // 1 <= k <= q, required when mode === 'stopped_at'
}

export type ComponentOutcome = 'passed' | 'failed' | 'not_attempted' | 'not_applicable' | 'pending_teacher_entry';

export interface ComponentAssessmentEvent {
  id: string;
  attemptId: string;
  assignmentId: string;
  questionGlobalOrder: number; // q (1..49)
  choice: ComponentAssessmentChoice;
  timestamp: string;
  actor: string;
  reason?: string;
  sequence: number;
}

export interface PercentCPDResult {
  masteredCount: number; // 0..49
  percentage: number;    // (masteredCount / 49) * 100
  masteredMap: Record<number, boolean>; // Component k (1..49) -> boolean
}

export interface ComponentExposureFact {
  assignmentId: string;
  questionGlobalOrder: number;
  componentIndex: number;
  outcome: ComponentOutcome;
  choiceMode: ComponentAssessmentMode;
  stoppedComponentIndex?: number;
  timestamp: string;
  actor: string;
}

export interface ComponentRawSummary {
  componentIndex: number; // 1..49
  totalExposures: number;
  passedCount: number;
  failedCount: number;
  notAttemptedCount: number;
  isMastered: boolean;
  firstClearedQuestionGlobalOrder: number | null;
  firstClearedExposureIndex: number | null;
  exposures: ComponentExposureFact[];
}



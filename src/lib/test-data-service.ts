import { Learner, SevenColor, TestMode } from '../types/common'
import { StandaloneRun, TestPackageSummary, TestSection } from '../types/test-catalog'
import { BlueAttemptResult, ComponentAssessmentChoice } from '../types/blue-metrics'
import {
  TEST_PACKAGES,
  generateBlueTestSections,
  generateGreenTestSections,
  generateRedTestSections,
} from './test-packages-data'
import { getSupabase } from './supabase'

export const DEFAULT_LEARNERS: Learner[] = [
  {
    id: 'learner-lucy',
    displayName: 'Lucy Nguyen',
    code: 'L-6446',
    grade: 'Primary Level 3',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=L-6446',
  },
  {
    id: 'learner-max',
    displayName: 'Max Tran',
    code: 'L-8821',
    grade: 'Primary Level 4',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=L-8821',
  },
  {
    id: 'learner-alex',
    displayName: 'Alex Pham',
    code: 'L-3104',
    grade: 'Junior Level 1',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=L-3104',
  },
]

export async function fetchLearners(): Promise<Learner[]> {
  const sb = getSupabase()
  if (!sb) return DEFAULT_LEARNERS

  try {
    const { data, error } = await sb
      .from('users')
      .select('id, display_name, username, organization_id')
      .limit(20)

    if (error || !data || data.length === 0) {
      return DEFAULT_LEARNERS
    }

    return data.map((u, i) => ({
      id: u.id,
      displayName: u.display_name || `Learner ${i + 1}`,
      code: u.username || `L-${1000 + i}`,
      organizationId: u.organization_id,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id}`,
    }))
  } catch (err) {
    console.warn('Error fetching learners from Supabase, using defaults:', err)
    return DEFAULT_LEARNERS
  }
}

export function getTestPackage(mode: TestMode): { summary: TestPackageSummary; sections: TestSection[] } {
  const summary = TEST_PACKAGES.find((p) => p.mode === mode) || TEST_PACKAGES[0]
  let sections: TestSection[] = []

  if (mode === 'blue') {
    sections = generateBlueTestSections()
  } else if (mode === 'green') {
    sections = generateGreenTestSections()
  } else {
    sections = generateRedTestSections()
  }

  return { summary, sections }
}

const STORAGE_KEY_RUNS = 'chunks_unified_test_runs'
const STORAGE_KEY_BLUE_ATTEMPTS = 'chunks_unified_blue_attempts'

export function loadSavedRuns(): StandaloneRun[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RUNS)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveRunRecord(run: StandaloneRun): void {
  try {
    const runs = loadSavedRuns()
    const idx = runs.findIndex((r) => r.id === run.id)
    if (idx >= 0) {
      runs[idx] = run
    } else {
      runs.unshift(run)
    }
    localStorage.setItem(STORAGE_KEY_RUNS, JSON.stringify(runs))

    // Asynchronously sync to Supabase if available
    syncRunToSupabase(run).catch((e) => console.warn('Supabase run sync warning:', e))
  } catch (err) {
    console.error('Failed to save run record:', err)
  }
}

async function syncRunToSupabase(run: StandaloneRun) {
  const sb = getSupabase()
  if (!sb) return
  // Save standalone run status snapshot
  try {
    await sb.from('standalone_test_runs').upsert({
      id: run.id,
      learner_user_id: run.learnerId,
      status: run.status,
      started_at: run.startedAt,
      completed_at: run.completedAt,
    })
  } catch {
    // ignore
  }
}

export function saveBlueAttemptRecord(attempt: BlueAttemptResult): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BLUE_ATTEMPTS)
    const list: BlueAttemptResult[] = raw ? JSON.parse(raw) : []
    list.push(attempt)
    localStorage.setItem(STORAGE_KEY_BLUE_ATTEMPTS, JSON.stringify(list))

    // Asynchronously sync to Supabase satellite tables
    const sb = getSupabase()
    if (sb) {
      sb.from('blue_test_attempt_metrics')
        .insert({
          attempt_id: attempt.attemptId,
          max_time_seconds_raw: attempt.maxTimeSecondsRaw,
          elapsed_seconds_raw: attempt.elapsedSecondsRaw,
          completion_ratio: attempt.completionRatio,
          completion_mode: attempt.completionMode,
          derived_color: attempt.derivedColor,
          effective_color: attempt.effectiveColor,
        })
        .then(
          () => {},
          () => {},
        )
    }
  } catch (err) {
    console.warn('Failed to save blue attempt:', err)
  }
}

export function loadBlueAttemptsForRun(runId: string): BlueAttemptResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BLUE_ATTEMPTS)
    const list: BlueAttemptResult[] = raw ? JSON.parse(raw) : []
    return list.filter((a) => a.attemptId.startsWith(runId))
  } catch {
    return []
  }
}

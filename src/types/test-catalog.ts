import { SevenColor, TestMode } from './common'

export interface TestPackageSummary {
  id: string
  title: string
  slug: string
  mode: TestMode
  version: string
  totalQuestions: number
  totalSessions: number
  description: string
  variableSummary: string
}

export interface TestItem {
  id: string
  sectionId: string
  itemOrder: number
  sessionNumber: number
  promptTextVi?: string
  promptTextEn?: string
  promptText: string
  audioUrl?: string
  cvrOhm?: number
  cciValue?: number
  cpdValue?: number
  maxConsciousTime?: number
}

export interface TestSection {
  id: string
  packageId: string
  sessionNumber: number
  title: string
  toolName?: string // e.g. Marker, Chair for Blue Test
  introNarration?: string
  introAudioUrl?: string
  items: TestItem[]
}

export interface StandaloneRun {
  id: string
  learnerId: string
  packageId: string
  mode: TestMode
  status: 'ready' | 'in_progress' | 'completed' | 'cancelled'
  currentQuestionIndex: number
  totalQuestions: number
  startedAt: string
  completedAt?: string
  scoreSummary?: {
    totalFinalized: number
    percentRFC?: number
    percentRAC?: number
    percentC?: number
    percentI?: number
    averageConsciousTime?: number
    componentMasteryPercent?: number
    colorDistribution: Record<SevenColor, number>
  }
}

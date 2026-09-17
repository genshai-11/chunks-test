/**
 * M.C.T (Max Conscious Time) Timing Engine for Blue Test (CHUNKS Test No. 3)
 * Formula:
 * Ln = 1.86^n, L0 = 0
 * T(n, j) = L(n-1) + ((Ln - L(n-1)) * j / 7)
 */

export function calculateMaxConsciousTimeRaw(sessionNumber: number, questionInSession: number): number {
  if (sessionNumber < 1 || sessionNumber > 7) {
    throw new Error(`Invalid sessionNumber ${sessionNumber}. Must be between 1 and 7.`)
  }
  if (questionInSession < 1 || questionInSession > 7) {
    throw new Error(`Invalid questionInSession ${questionInSession}. Must be between 1 and 7.`)
  }

  const prevL = sessionNumber === 1 ? 0 : Math.pow(1.86, sessionNumber - 1)
  const currentL = Math.pow(1.86, sessionNumber)

  return prevL + ((currentL - prevL) * questionInSession) / 7
}

export function formatTimeDisplay(timeSecondsRaw: number): string {
  return `${timeSecondsRaw.toFixed(1)}s`
}

export const BLUE_SESSION_TOOLS = [
  { sessionNumber: 1, toolName: 'Marker', mct: 1.86, label: 'Session 1: Marker (CHUNKS CONSTANT 1.86s)' },
  { sessionNumber: 2, toolName: 'Chair', mct: 3.5, label: 'Session 2: Chair (3.5s)' },
  { sessionNumber: 3, toolName: 'Magnet', mct: 6.4, label: 'Session 3: Magnet (6.4s)' },
  { sessionNumber: 4, toolName: 'Cup', mct: 12.0, label: 'Session 4: Cup (12.0s)' },
  { sessionNumber: 5, toolName: 'Photo', mct: 22.3, label: 'Session 5: Photo (22.3s)' },
  { sessionNumber: 6, toolName: 'Book', mct: 41.4, label: 'Session 6: Book (41.4s)' },
  { sessionNumber: 7, toolName: 'Person', mct: 77.0, label: 'Session 7: Person (CHUNKS GATE 77.0s)' },
]

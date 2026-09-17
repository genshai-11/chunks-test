import React, { useState, useEffect, useRef } from 'react'
import { Learner, SevenColor } from '../../types/common'
import { StandaloneRun, TestSection } from '../../types/test-catalog'
import { BlueAttemptResult, ComponentAssessmentChoice } from '../../types/blue-metrics'
import { calculateMaxConsciousTimeRaw, formatTimeDisplay } from '../../domain/timing-engine'
import { deriveColorFromRatio, SEVEN_COLORS, calculateColorDistribution } from '../../domain/color-engine'
import { calculateComponentMastery } from '../../domain/component-engine'
import {
  playCompletionBell,
  playRedAlertRing,
  playStartChime,
  playTick,
} from '../../lib/sound-effects'
import { saveBlueAttemptRecord } from '../../lib/test-data-service'
import { Play, Square, AlertTriangle, CheckCircle, X, Clock, Layers, Sparkles } from 'lucide-react'

interface BlueRoomProps {
  learner: Learner
  sections: TestSection[]
  onComplete: (run: StandaloneRun) => void
  onExit: () => void
}

type QuestionPhase = 'idle' | 'running' | 'component_entry' | 'finalized'

export const BlueRoom: React.FC<BlueRoomProps> = ({
  learner,
  sections,
  onComplete,
  onExit,
}) => {
  const allItems = sections.flatMap((s) => s.items)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [phase, setPhase] = useState<QuestionPhase>('idle')
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [recordedAttempts, setRecordedAttempts] = useState<BlueAttemptResult[]>([])
  const [recordedChoices, setRecordedChoices] = useState<Record<number, ComponentAssessmentChoice>>({})

  const timerRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)

  const currentItem = allItems[currentIndex] || allItems[0]
  const currentSection = sections.find((s) => s.sessionNumber === currentItem.sessionNumber) || sections[0]

  const globalOrder = currentIndex + 1
  const sessionNumber = currentItem.sessionNumber
  const questionInSession = ((currentIndex) % 7) + 1
  const maxTime = currentItem.maxConsciousTime || calculateMaxConsciousTimeRaw(sessionNumber, questionInSession)

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  // Start timer
  const handleStart = () => {
    playStartChime()
    setPhase('running')
    setElapsedSeconds(0)
    startTimeRef.current = performance.now()

    if (timerRef.current) clearInterval(timerRef.current)

    timerRef.current = window.setInterval(() => {
      const now = performance.now()
      const elapsed = (now - startTimeRef.current) / 1000
      setElapsedSeconds(elapsed)

      // Auto-max check
      if (elapsed >= maxTime) {
        clearInterval(timerRef.current!)
        playCompletionBell()
        finalizeCurrentStop('auto_max', maxTime)
      }
    }, 50)
  }

  // Stop manually (normal conscious stop)
  const handleStop = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    finalizeCurrentStop('manual_end', elapsedSeconds)
  }

  // Manual Red (broken rule / distraction)
  const handleManualRed = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    playRedAlertRing()
    finalizeCurrentStop('manual_red', elapsedSeconds, 'red')
  }

  const finalizeCurrentStop = (
    mode: 'manual_end' | 'auto_max' | 'manual_red',
    finalElapsed: number,
    forcedColor?: SevenColor,
  ) => {
    const ratio = Math.min(1, finalElapsed / maxTime)
    const color = forcedColor || (mode === 'auto_max' ? 'purple' : deriveColorFromRatio(ratio))

    const attempt: BlueAttemptResult = {
      attemptId: `blue-run-${Date.now()}-q${globalOrder}`,
      questionGlobalOrder: globalOrder,
      sessionNumber,
      questionInSession,
      maxTimeSecondsRaw: maxTime,
      elapsedSecondsRaw: finalElapsed,
      completionRatio: ratio,
      completionMode: mode,
      derivedColor: color,
      effectiveColor: color,
      timestamp: new Date().toISOString(),
    }

    // Move to component tracking
    setRecordedAttempts((prev) => [...prev, attempt])
    setPhase('component_entry')
  }

  const submitComponentChoice = (choice: ComponentAssessmentChoice) => {
    const updatedChoices = { ...recordedChoices, [globalOrder]: choice }
    setRecordedChoices(updatedChoices)

    // Save latest attempt to storage
    const latestAttempt = recordedAttempts[recordedAttempts.length - 1]
    if (latestAttempt) {
      latestAttempt.componentChoice = choice
      saveBlueAttemptRecord(latestAttempt)
    }

    if (currentIndex + 1 < allItems.length) {
      setCurrentIndex(currentIndex + 1)
      setPhase('idle')
      setElapsedSeconds(0)
    } else {
      // Completed all 49 items!
      playCompletionBell()
      const colorList = recordedAttempts.map((a) => a.effectiveColor)
      const dist = calculateColorDistribution(colorList)
      const mastery = calculateComponentMastery(updatedChoices)
      const avgTime =
        recordedAttempts.reduce((acc, a) => acc + a.elapsedSecondsRaw, 0) /
        (recordedAttempts.length || 1)

      const run: StandaloneRun = {
        id: `blue-run-${Date.now()}`,
        learnerId: learner.id,
        packageId: 'blue-test-49q',
        mode: 'blue',
        status: 'completed',
        currentQuestionIndex: allItems.length,
        totalQuestions: allItems.length,
        startedAt: new Date(Date.now() - 49 * 8000).toISOString(),
        completedAt: new Date().toISOString(),
        scoreSummary: {
          totalFinalized: allItems.length,
          percentRFC: dist.percentRFC,
          percentRAC: dist.percentRAC,
          percentI: dist.percentI,
          averageConsciousTime: Math.round(avgTime * 10) / 10,
          componentMasteryPercent: mastery.percentage,
          colorDistribution: dist.counts,
        },
      }
      onComplete(run)
    }
  }

  const ratio = Math.min(1, elapsedSeconds / maxTime)
  const currentColor = deriveColorFromRatio(ratio)
  const currentMeta = SEVEN_COLORS[currentColor]
  const progressPercent = Math.round(((currentIndex + 1) / allItems.length) * 100)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
            🔵
          </span>
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Blue Room (Test No. 3) • Challenge {globalOrder} of 49
            </h2>
            <p className="text-xs text-slate-400">
              Tool: <span className="font-semibold text-blue-400">{currentSection.toolName}</span> • Session {sessionNumber} • Learner: {learner.displayName}
            </p>
          </div>
        </div>

        <button
          onClick={onExit}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
        <div
          className="bg-blue-500 h-2 transition-all duration-300 shadow-sm shadow-blue-500/50"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Stopwatch Area */}
      {phase !== 'component_entry' ? (
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl space-y-8 text-center relative overflow-hidden">
          {/* Tool Banner */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold">
            <Layers className="w-3.5 h-3.5" />
            <span>Interactive Tool #{sessionNumber}: {currentSection.toolName}</span>
          </div>

          {/* Time & Radial Progress */}
          <div className="space-y-4">
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-6xl sm:text-7xl font-mono font-black tracking-tight text-white">
                {elapsedSeconds.toFixed(1)}
              </span>
              <span className="text-xl sm:text-2xl font-mono font-bold text-slate-500">
                / {formatTimeDisplay(maxTime)}
              </span>
            </div>

            {/* Conscious Time Progress Bar */}
            <div className="max-w-md mx-auto h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
              <div
                className="h-full rounded-full transition-all duration-75 shadow-lg"
                style={{
                  width: `${ratio * 100}%`,
                  backgroundColor: currentMeta.hex,
                }}
              />
            </div>

            {/* Live Color Spectrum Target */}
            <div className="flex items-center justify-center gap-2 text-xs font-semibold">
              <span className="text-slate-400">Current Conscious Flow:</span>
              <span
                className="px-3 py-1 rounded-full text-slate-950 font-bold uppercase tracking-wider"
                style={{ backgroundColor: currentMeta.hex }}
              >
                {currentMeta.labelEn} ({currentMeta.labelVi})
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            {phase === 'idle' ? (
              <button
                onClick={handleStart}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base flex items-center justify-center gap-3 shadow-xl shadow-blue-600/30 transition-all cursor-pointer"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>Start Conscious Flow</span>
              </button>
            ) : (
              <>
                <button
                  onClick={handleStop}
                  className="px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <Square className="w-5 h-5 fill-white" />
                  <span>Stop Flow (Complete)</span>
                </button>

                <button
                  onClick={handleManualRed}
                  className="px-6 py-4 rounded-2xl bg-red-600/90 hover:bg-red-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 transition-all cursor-pointer"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Manual Red (Ring Break)</span>
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        /* CUMULATIVE COMPONENT TRACKING MODAL */
        <div className="p-8 rounded-3xl bg-slate-900/90 border border-blue-500/40 shadow-2xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-400" />
              <span>Record Cumulative Component Exposure (Challenge #{globalOrder})</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Did the participant complete all components 1 through {globalOrder}, or stop at a specific component?
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Completed All 1..q */}
            <button
              onClick={() => submitComponentChoice({ mode: 'completed_all' })}
              className="p-5 rounded-2xl bg-slate-950 hover:bg-emerald-950/40 border-2 border-slate-800 hover:border-emerald-500/60 flex flex-col items-start gap-2 cursor-pointer transition text-left"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <CheckCircle className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-white">Completed All (1..{globalOrder})</span>
              <span className="text-xs text-slate-400">
                All cumulative components up to challenge {globalOrder} passed successfully.
              </span>
            </button>

            {/* Stopped At K */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-sm font-bold text-white block">
                Stopped at Component (1..{globalOrder})
              </span>
              <select
                defaultValue={Math.max(1, globalOrder - 1)}
                onChange={(e) =>
                  submitComponentChoice({
                    mode: 'stopped_at',
                    stoppedComponentIndex: Number(e.target.value),
                  })
                }
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white outline-none cursor-pointer"
              >
                {Array.from({ length: globalOrder }, (_, i) => i + 1).map((k) => (
                  <option key={k} value={k}>
                    Stopped at Component #{k}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500">
                Components 1 to k-1 will be marked passed; component k failed.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

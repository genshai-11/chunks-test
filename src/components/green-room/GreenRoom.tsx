import React, { useState, useEffect } from 'react'
import { Learner, SevenColor } from '../../types/common'
import { StandaloneRun, TestSection } from '../../types/test-catalog'
import { SEVEN_COLORS, calculateColorDistribution } from '../../domain/color-engine'
import { calculateCPD } from '../../domain/cpd-engine'
import { playCompletionBell, playStartChime } from '../../lib/sound-effects'
import { Volume2, ChevronRight, X, Sparkles, Check, HelpCircle, AlertCircle } from 'lucide-react'

interface GreenRoomProps {
  learner: Learner
  sections: TestSection[]
  onComplete: (run: StandaloneRun) => void
  onExit: () => void
}

export const GreenRoom: React.FC<GreenRoomProps> = ({
  learner,
  sections,
  onComplete,
  onExit,
}) => {
  const allItems = sections.flatMap((s) => s.items)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [recordedColors, setRecordedColors] = useState<Record<number, SevenColor>>({})
  const [probeOpen, setProbeOpen] = useState(false)
  const [probeDepth, setProbeDepth] = useState(0)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)

  const currentItem = allItems[currentIndex] || allItems[0]
  const currentSection = sections.find((s) => s.sessionNumber === currentItem.sessionNumber) || sections[0]

  useEffect(() => {
    setIsAudioPlaying(true)
    setProbeOpen(false)
    setProbeDepth(0)
    playStartChime()

    const timer = setTimeout(() => setIsAudioPlaying(false), 1600)
    return () => clearTimeout(timer)
  }, [currentIndex])

  const commitResult = (finalColor: SevenColor) => {
    const updated = { ...recordedColors, [currentIndex]: finalColor }
    setRecordedColors(updated)
    setProbeOpen(false)

    if (currentIndex + 1 < allItems.length) {
      setCurrentIndex(currentIndex + 1)
    } else {
      playCompletionBell()
      const colorList = Object.values(updated)
      const dist = calculateColorDistribution(colorList)

      const run: StandaloneRun = {
        id: `green-run-${Date.now()}`,
        learnerId: learner.id,
        packageId: 'green-test-49q',
        mode: 'green',
        status: 'completed',
        currentQuestionIndex: allItems.length,
        totalQuestions: allItems.length,
        startedAt: new Date(Date.now() - 49 * 5000).toISOString(),
        completedAt: new Date().toISOString(),
        scoreSummary: {
          totalFinalized: allItems.length,
          percentRFC: dist.percentRFC,
          percentRAC: dist.percentRAC,
          percentC: dist.percentRAC,
          colorDistribution: dist.counts,
        },
      }
      onComplete(run)
    }
  }

  const progressPercent = Math.round(((currentIndex + 1) / allItems.length) * 100)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
            🟢
          </span>
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Green Room • Question {currentIndex + 1} of {allItems.length}
            </h2>
            <p className="text-xs text-slate-400">
              {currentSection.title} • Learner: {learner.displayName}
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
          className="bg-emerald-500 h-2 transition-all duration-300 shadow-sm shadow-emerald-500/50"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Item Display Card */}
      <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl space-y-8 relative overflow-hidden">
        {/* Audio Prompt & Instructions */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                isAudioPlaying
                  ? 'bg-emerald-500 text-white animate-pulse'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              <Volume2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Spoken Bilingual Prompt</p>
              <p className="text-base font-semibold text-white mt-0.5">
                {currentItem.promptTextVi || currentItem.promptText}
              </p>
              <p className="text-xs text-slate-500 mt-0.5 italic">
                {currentItem.promptTextEn || currentItem.promptText}
              </p>
            </div>
          </div>

          <div className="text-right font-mono text-xs">
            <span className="text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              CPD: {currentItem.cpdValue || 35}
            </span>
          </div>
        </div>

        {/* PROBE WORKFLOW OR INITIAL OBSERVATION */}
        {!probeOpen ? (
          <div className="space-y-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              1. Record Initial Observation (Provisional Result):
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Fail -> Direct Red */}
              <button
                onClick={() => commitResult('red')}
                className="p-5 rounded-2xl bg-slate-950 hover:bg-red-950/30 border border-slate-800 hover:border-red-500/50 flex flex-col items-center gap-2 cursor-pointer transition"
              >
                <span className="w-4 h-4 rounded-full bg-red-500" />
                <span className="text-sm font-bold text-white">Direct Fail (Red)</span>
                <span className="text-xs text-slate-400 text-center">
                  Significant struggle or no response
                </span>
              </button>

              {/* Provisional Green -> Opens Probe Flow */}
              <button
                onClick={() => setProbeOpen(true)}
                className="p-5 rounded-2xl bg-slate-950 hover:bg-emerald-950/40 border-2 border-emerald-500/40 hover:border-emerald-500 flex flex-col items-center gap-2 cursor-pointer transition shadow-lg shadow-emerald-500/10"
              >
                <span className="w-4 h-4 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-sm font-bold text-emerald-400">
                  Pass Provisional Green
                </span>
                <span className="text-xs text-slate-400 text-center">
                  Correct initial answer. Opens Probe Flow
                </span>
              </button>

              {/* Direct Purple -> Exceptional Mastery */}
              <button
                onClick={() => commitResult('purple')}
                className="p-5 rounded-2xl bg-slate-950 hover:bg-purple-950/30 border border-slate-800 hover:border-purple-500/50 flex flex-col items-center gap-2 cursor-pointer transition"
              >
                <span className="w-4 h-4 rounded-full bg-purple-500" />
                <span className="text-sm font-bold text-purple-400">Mastery (Purple)</span>
                <span className="text-xs text-slate-400 text-center">
                  Immediate, effortless native fluency
                </span>
              </button>
            </div>
          </div>
        ) : (
          /* PROBE TRAY ACTIVE */
          <div className="p-6 rounded-2xl bg-emerald-950/20 border-2 border-emerald-500/50 space-y-6">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400 animate-spin" />
                <span className="text-sm font-bold text-emerald-300 uppercase tracking-wider">
                  Probe Protocol Active • Depth: {probeDepth}
                </span>
              </div>
              <button
                onClick={() => setProbeOpen(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Cancel Probe
              </button>
            </div>

            <p className="text-xs text-slate-300">
              The teacher probes deeper questions to verify resistance and autonomy. Choose the resolution:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Probe Fail -> Yellow */}
              <button
                onClick={() => commitResult('yellow')}
                className="p-4 rounded-xl bg-slate-950 hover:bg-yellow-950/30 border border-slate-800 hover:border-yellow-500/60 flex flex-col items-center gap-1 cursor-pointer transition"
              >
                <span className="text-xs font-bold text-yellow-400">Probe Fail ➔ Yellow</span>
                <span className="text-[11px] text-slate-400 text-center">
                  Broke down under probe depth
                </span>
              </button>

              {/* Probe Continue -> Depth+1 (Blue) */}
              <button
                onClick={() => setProbeDepth((d) => d + 1)}
                className="p-4 rounded-xl bg-slate-950 hover:bg-blue-950/40 border border-blue-500/40 hover:border-blue-500 flex flex-col items-center gap-1 cursor-pointer transition"
              >
                <span className="text-xs font-bold text-blue-400">
                  Continue Probe (+1 Step)
                </span>
                <span className="text-[11px] text-slate-400 text-center">
                  Survived probe, test deeper
                </span>
              </button>

              {/* Probe Done -> Indigo */}
              <button
                onClick={() => commitResult('indigo')}
                className="p-4 rounded-xl bg-slate-950 hover:bg-indigo-950/40 border border-indigo-500/40 hover:border-indigo-500 flex flex-col items-center gap-1 cursor-pointer transition"
              >
                <span className="text-xs font-bold text-indigo-400">Probe Done ➔ Indigo</span>
                <span className="text-[11px] text-slate-400 text-center">
                  Deep probe mastered fully
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

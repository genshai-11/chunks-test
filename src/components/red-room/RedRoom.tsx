import React, { useState, useEffect } from 'react'
import { Learner, SevenColor } from '../../types/common'
import { StandaloneRun, TestItem, TestSection } from '../../types/test-catalog'
import { SEVEN_COLORS, COLOR_ORDER, calculateColorDistribution } from '../../domain/color-engine'
import { calculateCPD, getCPDBand } from '../../domain/cpd-engine'
import { playCompletionBell, playStartChime } from '../../lib/sound-effects'
import { Volume2, CheckCircle, ArrowRight, X } from 'lucide-react'

interface RedRoomProps {
  learner: Learner
  sections: TestSection[]
  onComplete: (run: StandaloneRun) => void
  onExit: () => void
}

export const RedRoom: React.FC<RedRoomProps> = ({
  learner,
  sections,
  onComplete,
  onExit,
}) => {
  const allItems = sections.flatMap((s) => s.items)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [recordedColors, setRecordedColors] = useState<Record<number, SevenColor>>({})
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const [hasAudioPlayed, setHasAudioPlayed] = useState(false)

  const currentItem = allItems[currentIndex] || allItems[0]
  const currentSection = sections.find((s) => s.sessionNumber === currentItem.sessionNumber) || sections[0]

  const cvr = currentItem.cvrOhm || 24
  const cci = currentItem.cciValue || 1.15
  const cpd = calculateCPD(cvr, cci)
  const cpdBand = getCPDBand(cpd)

  // Trigger audio cue when question changes
  useEffect(() => {
    setIsAudioPlaying(true)
    setHasAudioPlayed(false)
    playStartChime()

    const timer = setTimeout(() => {
      setIsAudioPlaying(false)
      setHasAudioPlayed(true)
    }, 1800)

    return () => clearTimeout(timer)
  }, [currentIndex])

  const handleScoreColor = (color: SevenColor) => {
    const updated = { ...recordedColors, [currentIndex]: color }
    setRecordedColors(updated)

    if (currentIndex + 1 < allItems.length) {
      setCurrentIndex(currentIndex + 1)
    } else {
      // Completed!
      playCompletionBell()
      const colorList = Object.values(updated)
      const dist = calculateColorDistribution(colorList)

      const run: StandaloneRun = {
        id: `red-run-${Date.now()}`,
        learnerId: learner.id,
        packageId: 'red-test-56v',
        mode: 'red',
        status: 'completed',
        currentQuestionIndex: allItems.length,
        totalQuestions: allItems.length,
        startedAt: new Date(Date.now() - 56 * 4000).toISOString(),
        completedAt: new Date().toISOString(),
        scoreSummary: {
          totalFinalized: allItems.length,
          percentRFC: dist.percentRFC,
          percentRAC: dist.percentRAC,
          colorDistribution: dist.counts,
        },
      }
      onComplete(run)
    }
  }

  const progressPercent = Math.round(((currentIndex + 1) / allItems.length) * 100)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Top Bar: Progress & Exit */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 font-bold">
            🔴
          </span>
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Red Test Room • Question {currentIndex + 1} of {allItems.length}
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
          className="bg-red-500 h-2 transition-all duration-300 shadow-sm shadow-red-500/50"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Card: Current Test Item & CPD Demand */}
      <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl space-y-8 relative overflow-hidden">
        {/* Metric Pill Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 font-semibold tracking-wider uppercase">
              Complexity (CVR)
            </span>
            <p className="text-xl font-mono font-bold text-white mt-0.5">{cvr} Ω</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 font-semibold tracking-wider uppercase">
              Intensity (CCI)
            </span>
            <p className="text-xl font-mono font-bold text-white mt-0.5">{cci} A</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-red-500/30 text-center">
            <span className="text-[11px] text-red-400 font-semibold tracking-wider uppercase">
              Demand (CPD)
            </span>
            <p className="text-xl font-mono font-bold text-red-400 mt-0.5">
              {cpd} <span className="text-xs text-red-500 font-sans font-medium">({cpdBand})</span>
            </p>
          </div>
        </div>

        {/* Audio Prompt Player */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                isAudioPlaying
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              <Volume2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Spoken Sentence Prompt</p>
              <p className="text-base font-semibold text-white mt-0.5">
                {currentItem.promptTextVi || currentItem.promptText}
              </p>
              <p className="text-xs text-slate-500 mt-0.5 italic">
                {currentItem.promptTextEn || currentItem.promptText}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-mono font-semibold ${
                isAudioPlaying
                  ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              }`}
            >
              {isAudioPlaying ? 'Playing Audio...' : 'Audio Ready'}
            </span>
          </div>
        </div>

        {/* 7-Color Scoring Palette */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Record 7-Color Spectrum Result:
            </span>
            <span className="text-xs text-slate-500">
              Red/Orange/Yellow (Warm %RFC) • Green/Blue/Indigo/Purple (Cool %RAC)
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2 sm:gap-3">
            {COLOR_ORDER.map((colorKey) => {
              const meta = SEVEN_COLORS[colorKey]
              return (
                <button
                  key={colorKey}
                  onClick={() => handleScoreColor(colorKey)}
                  className={`py-4 px-2 rounded-2xl border transition-all duration-200 flex flex-col items-center justify-center gap-2 cursor-pointer shadow-lg hover:scale-105 active:scale-95 ${
                    meta.isHot
                      ? 'bg-slate-950 hover:bg-slate-900 border-slate-800 hover:border-red-500/60'
                      : 'bg-slate-950 hover:bg-slate-900 border-slate-800 hover:border-blue-500/60'
                  }`}
                >
                  <span
                    className="w-5 h-5 rounded-full shadow-md"
                    style={{ backgroundColor: meta.hex }}
                  />
                  <span className="text-[11px] font-bold text-slate-200">{meta.labelEn}</span>
                  <span className="text-[10px] text-slate-400">{meta.labelVi}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

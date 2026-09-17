import React from 'react'
import { Learner, SevenColor } from '../../types/common'
import { StandaloneRun } from '../../types/test-catalog'
import { SEVEN_COLORS, COLOR_ORDER } from '../../domain/color-engine'
import { Award, ArrowLeft, BarChart2, CheckCircle, Clock, Zap, Target } from 'lucide-react'

interface ScorecardViewProps {
  learner: Learner
  run: StandaloneRun
  onBackToLauncher: () => void
}

export const ScorecardView: React.FC<ScorecardViewProps> = ({
  learner,
  run,
  onBackToLauncher,
}) => {
  const summary = run.scoreSummary
  const dist = summary?.colorDistribution || {} as Record<SevenColor, number>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Top action */}
      <button
        onClick={onBackToLauncher}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Test Suite Launcher</span>
      </button>

      {/* Hero Score Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 border border-slate-800 shadow-2xl relative overflow-hidden space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">
              {run.mode === 'red' && '🔴'}
              {run.mode === 'green' && '🟢'}
              {run.mode === 'blue' && '🔵'}
            </span>
            <div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold uppercase tracking-wider font-mono">
                {run.mode} Test Official Scorecard
              </span>
              <h1 className="text-2xl font-black text-white tracking-tight mt-1">
                {learner.displayName} ({learner.code})
              </h1>
            </div>
          </div>

          <div className="text-sm text-slate-400 font-mono">
            {new Date(run.completedAt || run.startedAt).toLocaleString('vi-VN')}
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Metric 1 */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
            <span className="text-xs text-slate-400 font-medium">Questions Finalized</span>
            <p className="text-2xl font-mono font-bold text-white mt-1">
              {summary?.totalFinalized || run.totalQuestions} / {run.totalQuestions}
            </p>
          </div>

          {/* Metric 2 */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
            <span className="text-xs text-slate-400 font-medium">Warm Ratio (%RFC)</span>
            <p className="text-2xl font-mono font-bold text-red-400 mt-1">
              {summary?.percentRFC ?? 0}%
            </p>
          </div>

          {/* Metric 3 */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
            <span className="text-xs text-slate-400 font-medium">Cool Ratio (%RAC / %c)</span>
            <p className="text-2xl font-mono font-bold text-emerald-400 mt-1">
              {summary?.percentRAC ?? 0}%
            </p>
          </div>

          {/* Metric 4 (Specialized per mode) */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-indigo-500/30 text-center">
            <span className="text-xs text-indigo-300 font-medium">
              {run.mode === 'blue' ? 'Observation Level (%i)' : 'Responsiveness'}
            </span>
            <p className="text-2xl font-mono font-bold text-indigo-400 mt-1">
              {run.mode === 'blue' ? `${summary?.percentI ?? 0}%` : `${summary?.percentRAC ?? 0}%`}
            </p>
          </div>
        </div>

        {/* Blue Specific Additional Metrics */}
        {run.mode === 'blue' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-blue-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-xs text-slate-400 font-medium">Average Conscious Time (ACT)</p>
                  <p className="text-lg font-mono font-bold text-white">
                    {summary?.averageConsciousTime ?? 0}s per challenge
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-blue-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-xs text-slate-400 font-medium">%CPD Component Mastery</p>
                  <p className="text-lg font-mono font-bold text-white">
                    {summary?.componentMasteryPercent ?? 0}% (49 Components)
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 7-Color Spectrum Breakdown */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-indigo-400" />
          <span>7-Color Spectrum Measurement Distribution</span>
        </h3>

        <div className="grid grid-cols-7 gap-2">
          {COLOR_ORDER.map((colorKey) => {
            const meta = SEVEN_COLORS[colorKey]
            const count = dist[colorKey] || 0
            const pct = Math.round((count / (summary?.totalFinalized || 1)) * 100)

            return (
              <div
                key={colorKey}
                className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 text-center space-y-1.5"
              >
                <span
                  className="w-3.5 h-3.5 rounded-full inline-block"
                  style={{ backgroundColor: meta.hex }}
                />
                <p className="text-xs font-bold text-slate-200">{meta.labelEn}</p>
                <p className="text-lg font-mono font-black text-white">{count}</p>
                <p className="text-[10px] text-slate-500 font-mono">{pct}%</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

import React from 'react'
import { Learner, TestMode } from '../../types/common'
import { TEST_PACKAGES } from '../../lib/test-packages-data'
import { StandaloneRun } from '../../types/test-catalog'
import { Play, Activity, Clock, Layers, Sparkles, Award } from 'lucide-react'

interface TestLauncherProps {
  activeLearner: Learner
  onStartTest: (mode: TestMode) => void
  onViewReport: (run: StandaloneRun) => void
  runs: StandaloneRun[]
}

export const TestLauncher: React.FC<TestLauncherProps> = ({
  activeLearner,
  onStartTest,
  onViewReport,
  runs,
}) => {
  const learnerRuns = runs.filter((r) => r.learnerId === activeLearner.id)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Learner Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <img
              src={activeLearner.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=chunks'}
              alt={activeLearner.displayName}
              className="w-16 h-16 rounded-2xl bg-slate-800 border-2 border-indigo-500/40 p-1 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  {activeLearner.displayName}
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 font-semibold border border-indigo-500/20 font-mono">
                  {activeLearner.code}
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                {activeLearner.grade || 'Standard Learner Profile'} • Ready for Assessment
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 bg-slate-950/60 backdrop-blur px-5 py-3 rounded-2xl border border-slate-800/80">
            <div className="text-center">
              <span className="text-xs text-slate-400 font-medium">Completed Runs</span>
              <p className="text-xl font-bold text-white font-mono">{learnerRuns.length}</p>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div className="text-center">
              <span className="text-xs text-slate-400 font-medium">Active Suite</span>
              <p className="text-xl font-bold text-indigo-400 font-mono">3 / 3 Modes</p>
            </div>
          </div>
        </div>

        {/* Ambient background blur */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 3 Test Mode Cards */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Select Assessment Room</h2>
            <p className="text-sm text-slate-400">
              Each mode tracks specialized parameters and cognitive demand curves.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 🔴 RED TEST */}
          <div className="group relative rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-red-500/50 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-red-500/5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 font-black text-lg">
                  🔴
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-red-500/10 text-red-300 font-mono font-semibold border border-red-500/20">
                  56 Questions
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors">
                  Red Test (56V)
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  Linguistic resistance & CPD demand curve. 8 progressive sections with bilingual audio gating.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Demand Formula</span>
                  <span className="font-mono text-slate-200">CPD = CVR × CCI</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Measurement</span>
                  <span className="font-mono text-slate-200">7-Color Spectrum</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onStartTest('red')}
              className="mt-6 w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Enter Red Room</span>
            </button>
          </div>

          {/* 🟢 GREEN TEST */}
          <div className="group relative rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-lg">
                  🟢
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 font-mono font-semibold border border-emerald-500/20">
                  49 Questions (7x7)
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                  Green Test (49Q)
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  Active responsiveness with interactive probe steps. Provisional Green opens Fail/Continue/Done flow.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Evaluation Flow</span>
                  <span className="font-mono text-slate-200">Provisional ➔ Probe</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Output Metrics</span>
                  <span className="font-mono text-slate-200">%c (%RAC) & %RFC</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onStartTest('green')}
              className="mt-6 w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Enter Green Room</span>
            </button>
          </div>

          {/* 🔵 BLUE TEST */}
          <div className="group relative rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/50 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-black text-lg">
                  🔵
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-300 font-mono font-semibold border border-blue-500/20">
                  49 Challenges (7 Tools)
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                  Blue Test (No. 3)
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  Observation Test across 7 tools. Real-time conscious flow stopwatch, 1.86^n formula, and component matrix.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Time Formula</span>
                  <span className="font-mono text-slate-200">Ln = 1.86^n</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Output Indicators</span>
                  <span className="font-mono text-slate-200">ACT, %i, %CPD Mastery</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onStartTest('blue')}
              className="mt-6 w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Enter Blue Room</span>
            </button>
          </div>
        </div>
      </div>

      {/* Historical Runs for Active Learner */}
      {learnerRuns.length > 0 && (
        <div className="border-t border-slate-800/80 pt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-400" />
              <span>Recent Test Runs for {activeLearner.displayName}</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {learnerRuns.map((run) => (
              <div
                key={run.id}
                onClick={() => onViewReport(run)}
                className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 cursor-pointer flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">
                    {run.mode === 'red' && '🔴'}
                    {run.mode === 'green' && '🟢'}
                    {run.mode === 'blue' && '🔵'}
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
                      {run.mode} Test
                    </h4>
                    <p className="text-xs text-slate-400">
                      {new Date(run.startedAt).toLocaleString('vi-VN')} • {run.totalQuestions} Questions
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-indigo-300 border border-slate-700">
                    {run.scoreSummary?.percentI !== undefined
                      ? `%i: ${run.scoreSummary.percentI}%`
                      : `%RAC: ${run.scoreSummary?.percentRAC ?? 0}%`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

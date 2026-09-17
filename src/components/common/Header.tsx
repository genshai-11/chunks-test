import React from 'react'
import { Learner, TestMode } from '../../types/common'
import { isSupabaseConfigured } from '../../lib/supabase'
import { Database, UserCheck, Activity, ChevronRight, Home } from 'lucide-react'

interface HeaderProps {
  learners: Learner[]
  activeLearner: Learner | null
  onSelectLearner: (l: Learner) => void
  currentMode: TestMode | null
  onExitTest: () => void
}

export const Header: React.FC<HeaderProps> = ({
  learners,
  activeLearner,
  onSelectLearner,
  currentMode,
  onExitTest,
}) => {
  const isOnline = isSupabaseConfigured()

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Brand / Title */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onExitTest}>
          <div className="flex items-center gap-1.5 p-2 bg-slate-950 rounded-xl border border-slate-800 shadow-inner">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm shadow-red-500/50" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black tracking-tight text-white text-lg">CHUNKS</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                TEST SUITE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium leading-none">
              Unified Measurement (Red, Green, Blue)
            </p>
          </div>
        </div>

        {/* Center: Breadcrumb / Active Test Room */}
        {currentMode && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950 border border-slate-800">
            <button
              onClick={onExitTest}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Launcher</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  currentMode === 'red'
                    ? 'bg-red-500 animate-pulse'
                    : currentMode === 'green'
                    ? 'bg-emerald-500 animate-pulse'
                    : 'bg-blue-500 animate-pulse'
                }`}
              />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                {currentMode === 'red' && 'Red Room (56 Items)'}
                {currentMode === 'green' && 'Green Room (Probe Flow)'}
                {currentMode === 'blue' && 'Blue Room (Observation)'}
              </span>
            </div>
          </div>
        )}

        {/* Right: Learner Selector & DB Status */}
        <div className="flex items-center gap-4">
          {/* Learner Selector */}
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <UserCheck className="w-4 h-4 text-indigo-400" />
            <select
              value={activeLearner?.id || ''}
              onChange={(e) => {
                const found = learners.find((l) => l.id === e.target.value)
                if (found) onSelectLearner(found)
              }}
              className="bg-transparent text-xs font-medium text-slate-200 outline-none cursor-pointer pr-2"
            >
              {learners.map((l) => (
                <option key={l.id} value={l.id} className="bg-slate-900 text-slate-200">
                  {l.displayName} ({l.code})
                </option>
              ))}
            </select>
          </div>

          {/* Database indicator */}
          <div
            title={isOnline ? 'Connected to Supabase' : 'Running with local persistence'}
            className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline font-mono text-[11px] text-slate-300">
              Supabase Live
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}

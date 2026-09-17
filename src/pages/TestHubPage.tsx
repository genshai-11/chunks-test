import { Link } from 'react-router-dom'
import {
  Activity,
  ArrowRight,
  BarChart3,
  Clock,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react'

export function TestHubPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-10">
        {/* Hero Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3.5 py-1 text-xs font-bold text-white shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            Unified Calibrated Assessment Engine
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 font-display">
            CHUNKS Assessment System
          </h1>
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-600 font-medium">
            Standardized telemetric evaluation suite integrating sentence resistance calibration, multi-tier bilingual probing, and exponential tool observation.
          </p>
        </div>

        {/* 3 Core Test Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. RED TEST */}
          <div className="flex flex-col justify-between rounded-3xl border border-red-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 h-28 w-28 bg-red-500/5 rounded-full blur-2xl group-hover:bg-red-500/10 transition-colors" />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-red-100/80 px-2.5 py-1 text-xs font-black text-red-700">
                  <Zap className="h-3.5 w-3.5 text-red-600" />
                  RED-TEST-56V
                </span>
                <span className="text-xs font-bold text-slate-500 font-mono">56 Items</span>
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Red Test</h2>
                <p className="text-xs font-semibold text-red-600 mt-0.5">Sentence Resistance & Demand</p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Measures linguistic load and calibrated sentence resistance using electrical circuit models ($CPD = CVR \times CCI$). Calibrates cognitive resistance ($R$) across 8 progressive difficulty levels.
              </p>

              <div className="rounded-2xl bg-slate-50 p-3 text-[11px] text-slate-700 font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Metric Model:</span>
                  <span className="font-bold text-red-600">CPD = CVR × CCI</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Levels:</span>
                  <span className="font-bold">8 Levels · 7 Questions/Level</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Colors:</span>
                  <span className="font-bold">Red · Orange · Green · Purple</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <Link
                to="/teacher/tests"
                className="flex items-center justify-center gap-2 w-full rounded-2xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-red-700 transition"
              >
                Enter Red Test Suite
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* 2. GREEN TEST */}
          <div className="flex flex-col justify-between rounded-3xl border border-emerald-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 h-28 w-28 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-100/80 px-2.5 py-1 text-xs font-black text-emerald-700">
                  <Activity className="h-3.5 w-3.5 text-emerald-600" />
                  GREEN-TEST-49Q
                </span>
                <span className="text-xs font-bold text-slate-500 font-mono">49 Items</span>
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Green Test</h2>
                <p className="text-xs font-semibold text-emerald-600 mt-0.5">Bilingual Probe Flow</p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Evaluates bilingual sentence production across 7 sessions $\times$ 7 items. Dynamic multi-tier probe degradation (Provisional Green $\rightarrow$ Yellow, Blue, Indigo) based on real-time learner response.
              </p>

              <div className="rounded-2xl bg-slate-50 p-3 text-[11px] text-slate-700 font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Structure:</span>
                  <span className="font-bold">7 Sessions · 7 Qs (Alternating VI/EN)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Probe Actions:</span>
                  <span className="font-bold text-emerald-600">Split · Cue · Model · Echo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Spectrum:</span>
                  <span className="font-bold">7-Color Continuum</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <Link
                to="/teacher/tests"
                className="flex items-center justify-center gap-2 w-full rounded-2xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition"
              >
                Enter Green Test Suite
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* 3. BLUE TEST */}
          <div className="flex flex-col justify-between rounded-3xl border border-sky-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 h-28 w-28 bg-sky-500/5 rounded-full blur-2xl group-hover:bg-sky-500/10 transition-colors" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-sky-100/80 px-2.5 py-1 text-xs font-black text-sky-700">
                  <Clock className="h-3.5 w-3.5 text-sky-600" />
                  BLUE-TEST-49Q
                </span>
                <span className="text-xs font-bold text-slate-500 font-mono">49 Challenges</span>
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Blue Test</h2>
                <p className="text-xs font-semibold text-sky-600 mt-0.5">Observation Test No. 3</p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                49 physical tool challenges across 7 tools (Marker, Chair, Magnet, Cup, Photo, Book, Person). Features exponential conscious time limits ($L_n = 1.86^n$), $49 \times 49$ cumulative component exposure matrix, and ACT.
              </p>

              <div className="rounded-2xl bg-slate-50 p-3 text-[11px] text-slate-700 font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Conscious Time:</span>
                  <span className="font-bold text-sky-600">L_n = 1.86^n (M.C.T)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Components:</span>
                  <span className="font-bold">49×49 Cumulative Matrix (%i, ACT)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tools:</span>
                  <span className="font-bold">7 Objects · Audio Bells</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <Link
                to="/blue"
                className="flex items-center justify-center gap-2 w-full rounded-2xl bg-sky-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-sky-700 transition"
              >
                Launch Blue Test Suite
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Operations & Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-800">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Standalone Test Manager</h3>
                <p className="text-xs text-slate-500">Assign tests to learners, view progress, and resume open runs.</p>
              </div>
            </div>
            <Link
              to="/teacher/tests"
              className="inline-flex items-center gap-2 text-xs font-bold text-red-600 hover:text-red-700"
            >
              Open 1–1 Tests Manager & Assignments &rarr;
            </Link>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-800">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Longitudinal Analytics</h3>
                <p className="text-xs text-slate-500">Inspect tube charts, 7-color records, and CPD distributions.</p>
              </div>
            </div>
            <Link
              to="/teacher/tests"
              className="inline-flex items-center gap-2 text-xs font-bold text-sky-600 hover:text-sky-700"
            >
              Select assignment to view analytical reports &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

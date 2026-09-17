import { Link, NavLink, useLocation } from 'react-router-dom'
import { CheckCircle2, ClipboardCheck, Sparkles, Layers } from 'lucide-react'
import { isSupabaseConfigured } from '../lib/supabase'

export function UnifiedHeader() {
  const location = useLocation()
  const path = location.pathname
  const isSupabaseReady = isSupabaseConfigured()

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md sm:px-6">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5 focus:outline-none" aria-label="CHUNKS Test Suite">
            <div className="flex items-center justify-center rounded-xl border border-red-500/20 bg-red-600/10 px-2.5 py-1 text-xs font-black uppercase tracking-wider text-red-600 font-mono">
              CHUNKS
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-extrabold tracking-tight text-slate-900 leading-none">TEST SUITE</span>
              <span className="text-[10px] font-semibold text-slate-500 tracking-wider">Red · Green · Blue</span>
            </div>
          </Link>

          {/* Nav Tabs */}
          <nav className="hidden md:flex items-center gap-1.5" aria-label="Main Navigation">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <Layers className="h-3.5 w-3.5" />
              Hub
            </NavLink>

            <NavLink
              to="/blue"
              className={() =>
                `flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                  path.startsWith('/blue')
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-sky-700 bg-sky-50 hover:bg-sky-100'
                }`
              }
            >
              <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
              Blue Test (49Q)
            </NavLink>

            <NavLink
              to="/teacher/tests"
              className={() =>
                `flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                  path.startsWith('/teacher') || path.startsWith('/tests')
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`
              }
            >
              <ClipboardCheck className="h-3.5 w-3.5" />
              Red & Green Tests
            </NavLink>
          </nav>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          <div
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold border ${
              isSupabaseReady
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
            title={isSupabaseReady ? 'Connected to Supabase' : 'Offline / Local storage fallback'}
          >
            <CheckCircle2 className="h-3 w-3" />
            <span>{isSupabaseReady ? 'Supabase Live' : 'Local Storage'}</span>
          </div>

          <Link
            to="/blue"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:opacity-95 transition"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Launch Room
          </Link>
        </div>
      </div>
    </header>
  )
}

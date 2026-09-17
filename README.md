# CHUNKS Unified Test Suite

> Unified measurement and assessment platform for CHUNKS language acquisition and conscious flow testing.

Combines three distinct testing methodologies into a unified, high-performance web application:
- 🔴 **Red Test (`RED-TEST-56V`)**: 56 calibrated items measuring sentence resistance and cognitive load ($CPD = CVR \times CCI$).
- 🟢 **Green Test (`GREEN-TEST-49Q`)**: 49 bilingual questions across 7 sessions with interactive multi-tier Probe Flow (Provisional Green ➔ Yellow / Blue / Indigo).
- 🔵 **Blue Test (`BLUE-TEST-49Q`)**: CHUNKS Test No. 3 (Observation & Conscious Flow) across 7 tools (Marker, Chair, Magnet, Cup, Photo, Book, Person) using the M.C.T timing engine ($L_n = 1.86^n$), cumulative component exposure tracking ($k=1..49$), Average Conscious Time (ACT), and %i.

---

## Tech Stack
- **Framework:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS v4, Lucide Icons, Motion
- **Data & Auth:** Supabase (`@supabase/supabase-js`)
- **Audio Engine:** HTML5 Web Audio API Synthesizer (Zero external audio asset latency)
- **Deployment:** Vercel (`chunks-test.vercel.app`)

---

## Local Development
```bash
# 1. Install dependencies
npm install

# 2. Configure .env
cp .env.example .env
# Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

# 3. Start development server
npm run dev
```

---

## Database Migration
Execute `supabase/migrations/20260917_unified_blue_test.sql` against your Supabase project to provision the `BLUE-TEST-49Q` catalog package and satellite tables for Blue test attempt metrics and component tracking.

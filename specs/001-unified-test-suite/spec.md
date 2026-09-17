# SPEC-001: CHUNKS Unified Test Suite (Red, Green, Blue)

**Status:** Approved for Implementation  
**Date:** 2026-09-17  
**Parent Context:** [`docs/grill-decision-record.md`](../docs/grill-decision-record.md)  
**Target Repository:** `https://github.com/genshai-11/chunks-test`  
**Deploy Domain:** `chunks-test.vercel.app` (Vercel)

---

## 1. Tổng quan & Mục tiêu

Xây dựng hệ thống kiểm tra và khảo sát năng lực phản xạ ngôn ngữ **CHUNKS Unified Test Suite** độc lập, tích hợp đầy đủ 3 bài test:
1. 🔴 **Red Test (`RED-TEST-56V`)**: 56 câu hỏi đo độ khó CVR, cường độ CCI, tải CPD và dải màu Spectrum 7 màu.
2. 🟢 **Green Test (`GREEN-TEST-49Q`)**: 49 câu hỏi (7 sessions × 7 câu), song ngữ Anh/Việt, quy trình Probe đa tầng (Green ➔ Yellow / Blue / Indigo).
3. 🔵 **Blue Test (`BLUE-TEST-49Q`)**: 49 thử thách (7 sessions × 7 thử thách với 7 công cụ tương tác), đo thời gian duy trì dòng ý thức liên tục theo hàm lũy thừa $L_n = 1.86^n$, ma trận theo dõi thành phần lũy kế $49 \times 49$ (%CPD Component Mastery), chỉ số quan sát %i và Average Conscious Time (ACT).

---

## 2. Kiến trúc Hệ thống

### 2.1. Cấu trúc Source Code (`chunks-test`)
```text
chunks-test/
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vercel.json
├── CONTEXT.md
├── docs/
│   └── grill-decision-record.md
├── specs/
│   └── 001-unified-test-suite/
│       ├── spec.md
│       ├── plan.md
│       └── tasks.md
├── src/
│   ├── domain/
│   │   ├── timing-engine.ts       # M.C.T 1.86^n calculations
│   │   ├── color-engine.ts        # 7-color spectrum & rules
│   │   ├── component-engine.ts    # 49x49 cumulative component matrix
│   │   └── cpd-engine.ts          # CVR x CCI = CPD demand
│   ├── lib/
│   │   ├── supabase.ts            # Typed Supabase client
│   │   ├── sound-effects.ts       # Web Audio API Synthesizer
│   │   ├── test-packages-data.ts  # Package definitions
│   │   └── test-data-service.ts   # Unified storage & sync service
│   ├── types/
│   │   ├── common.ts              # Learner, Teacher, Colors
│   │   ├── test-catalog.ts        # Packages, sections, items
│   │   └── blue-metrics.ts        # MCT, modes, component tracking
│   ├── components/
│   │   ├── common/                # Header, navigation
│   │   ├── dashboard/             # Launcher & active learner hero
│   │   ├── red-room/              # Red Test Execution Room
│   │   ├── green-room/            # Green Test Execution Room
│   │   ├── blue-room/             # Blue Test Execution Room
│   │   └── analytics/             # Scorecards & Longitudinal cross-test charts
│   ├── App.tsx
│   └── main.tsx
```

---

## 3. Thiết kế Cơ sở Dữ liệu & Migration (Supabase)

Tái sử dụng các bảng `standalone_test_assignments`, `standalone_test_runs`, `standalone_test_attempts`, `standalone_test_events` trên Supabase instance `ekubetkxfcuxlyahesrl.supabase.co`.
Thêm 2 bảng vệ tinh:
- `blue_test_attempt_metrics`
- `blue_test_component_events`

Chi tiết file migration: `supabase/migrations/20260917_unified_blue_test.sql`.

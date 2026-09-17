# CONTEXT.md — CHUNKS Unified Test Suite

CHUNKS Unified Test Suite is a focused, high-precision measurement web application combining three assessment methodologies:
1. **Red Test** (Baseline Linguistic Resistance)
2. **Green Test** (Active Responsiveness & Probe Flow)
3. **Blue Test** (Conscious Flow & Observation Test No. 3)

---

## 1. Ubiquitous Domain Vocabulary

### Core Entities
- **Learner**: A stable domain subject evaluated across tests. Profile-only identity managed by Teachers.
- **Teacher**: Authorized assessor who conducts 1-on-1 test sessions, operates the stopwatch/prompts, and records observation results.
- **Organization**: Administrative boundary owning users, learners, and historical reports.
- **Standalone Run**: An isolated, immutable test occurrence for one Learner on one Test Package without class/enrollment dependencies.

### Measurement Variables (Red & Green Tests)
- **CVR (Complexity Value Rating)**: Semantic complexity rating of sentence prompt (measured in Ohm $\Omega$).
- **CCI (Current/Intensity)**: Physical intensity and challenge factor (measured in Ampe $A$).
- **CPD (Cumulative Performance Demand)**: Derived demand load:
  $$\text{CPD} = \text{CVR} \times \text{CCI}$$
- **Provisional Green**: Initial passing color before entering the probe flow in Green Test.
- **Probe Flow**: Interactive multi-tier probing sequence:
  - *Fail* $\rightarrow$ Resolves Yellow.
  - *Continue* $\rightarrow$ Records Blue probe depth (+1 step).
  - *Done* $\rightarrow$ Resolves Indigo.

### Measurement Variables (Blue Test)
- **Conscious Time (CT)**: The duration of uninterrupted presence and intuitive motion-sound-emotion response maintained by the participant.
- **M.C.T (Max Conscious Time)**: The theoretical upper bound for session $n$ (1..7) and challenge $j$ (1..7) calculated by the CHUNKS exponential formula:
  $$L_0 = 0, \quad L_n = 1.86^n$$
  $$T(n, j) = L_{n-1} + \frac{(L_n - L_{n-1}) \cdot j}{7}$$
- **Seven Interactive Tools**: Marker ($S_1$, $1.86\text{s}$), Chair ($S_2$, $3.5\text{s}$), Magnet ($S_3$, $6.4\text{s}$), Cup ($S_4$, $12\text{s}$), Photo ($S_5$, $22.3\text{s}$), Book ($S_6$, $41.4\text{s}$), Person ($S_7$, $77\text{s}$ / CHUNKS Gate).
- **Average Conscious Time (ACT)**: Mean elapsed conscious seconds across all 49 challenges.
- **Cumulative Component Exposure ($k=1..49$)**: The $49 \times 49$ evaluation matrix where challenge $q$ tests components $1 \dots q$.
- **%CPD Component Mastery**: Percentage of the 49 components mastered without subsequent failure.

### Output Metrics (Cross-Test)
- **%RFC (Rules Failure Coefficient)**: Share of warm spectrum results (Red, Orange, Yellow).
- **%RAC (Rules Awareness Coefficient)**: Share of cool spectrum results (Green, Blue, Indigo, Purple); also denoted as `%c` in Green Test.
- **%i (Observation Level)**: Blue Test specific indicator derived from cool color conscious flow ratio.
- **7-Color Spectrum**: Red (`0.00`), Orange (`0.17`), Yellow (`0.33`), Green (`0.50`), Blue (`0.67`), Indigo (`0.83`), Purple (`1.00`).

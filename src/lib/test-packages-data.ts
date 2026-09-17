import { TestPackageSummary, TestSection } from '../types/test-catalog'
import { calculateMaxConsciousTimeRaw, BLUE_SESSION_TOOLS } from '../domain/timing-engine'
import { calculateCPD } from '../domain/cpd-engine'

export const TEST_PACKAGES: TestPackageSummary[] = [
  {
    id: 'red-test-56v',
    title: 'RED-TEST-56V',
    slug: 'red-test',
    mode: 'red',
    version: '1.0.0',
    totalQuestions: 56,
    totalSessions: 8,
    description: 'CHUNKS Baseline Resistance Test. Measures linguistic resistance and cognitive demand across 56 calibrated items.',
    variableSummary: 'CPD = CVR (Ohm) × CCI (Ampe) | 7-Color Spectrum (%RFC, %RAC)',
  },
  {
    id: 'green-test-49q',
    title: 'GREEN-TEST-49Q',
    slug: 'green-test',
    mode: 'green',
    version: '1.0.0',
    totalQuestions: 49,
    totalSessions: 7,
    description: 'CHUNKS Active Probe Test. Assesses spontaneous responsiveness and deep probe resistance across 7 progressive sessions.',
    variableSummary: 'Provisional Green ➔ Probe Flow (Yellow / Blue / Indigo) | %c (%RAC)',
  },
  {
    id: 'blue-test-49q',
    title: 'BLUE-TEST-49Q',
    slug: 'blue-test',
    mode: 'blue',
    version: '1.0.0',
    totalQuestions: 49,
    totalSessions: 7,
    description: 'CHUNKS Observation & Conscious Flow Test (Test No. 3). Evaluates uninterrupted observation flow across 7 interactive tools.',
    variableSummary: 'M.C.T (1.86^n) | Average Conscious Time (ACT) | %i | %CPD Component Mastery',
  },
]

/**
 * Generates the full 49 items for Blue Test.
 */
export function generateBlueTestSections(): TestSection[] {
  return BLUE_SESSION_TOOLS.map((tool) => {
    const s = tool.sessionNumber
    const items = Array.from({ length: 7 }, (_, j) => {
      const qInSession = j + 1
      const globalOrder = (s - 1) * 7 + qInSession
      const mct = calculateMaxConsciousTimeRaw(s, qInSession)

      return {
        id: `blue-q-s${s}-q${qInSession}`,
        sectionId: `blue-sec-${s}`,
        itemOrder: globalOrder,
        sessionNumber: s,
        promptText: `Challenge #${globalOrder}: ${tool.toolName} interaction item ${qInSession}`,
        promptTextVi: `Thử thách #${globalOrder}: Tương tác đạo cụ ${tool.toolName} - Mục ${qInSession}`,
        promptTextEn: `Challenge #${globalOrder}: ${tool.toolName} Interaction Step ${qInSession}`,
        maxConsciousTime: mct,
      }
    })

    return {
      id: `blue-sec-${s}`,
      packageId: 'blue-test-49q',
      sessionNumber: s,
      title: tool.label,
      toolName: tool.toolName,
      introNarration: `Session ${s} introduces the tool: ${tool.toolName}. Max conscious time baseline: ${tool.mct}s.`,
      items,
    }
  })
}

/**
 * Generates the 49 items for Green Test (7x7).
 */
export function generateGreenTestSections(): TestSection[] {
  return Array.from({ length: 7 }, (_, i) => {
    const s = i + 1
    const lang = s <= 3 ? 'English' : s <= 6 ? 'Vietnamese' : 'Bilingual'
    const cvrBase = 20 + s * 8
    const cciBase = 0.8 + s * 0.15

    const items = Array.from({ length: 7 }, (_, j) => {
      const qInSession = j + 1
      const globalOrder = (s - 1) * 7 + qInSession
      const cvr = cvrBase + j * 2
      const cci = Math.round((cciBase + j * 0.05) * 100) / 100
      const cpd = calculateCPD(cvr, cci)

      return {
        id: `green-q-s${s}-q${qInSession}`,
        sectionId: `green-sec-${s}`,
        itemOrder: globalOrder,
        sessionNumber: s,
        promptText: `Green Section ${s} Prompt #${globalOrder} (${lang})`,
        promptTextVi: `Câu hỏi phần ${s} số #${globalOrder}: Nhận thức và phản xạ ngôn ngữ thực tế`,
        promptTextEn: `Section ${s} Prompt #${globalOrder}: Real-time comprehension and response`,
        cvrOhm: cvr,
        cciValue: cci,
        cpdValue: cpd,
      }
    })

    return {
      id: `green-sec-${s}`,
      packageId: 'green-test-49q',
      sessionNumber: s,
      title: `Session ${s}: Active Probe Block (${lang})`,
      introNarration: `Section ${s} active probe block. Please listen to the item audio prompts before evaluation.`,
      items,
    }
  })
}

/**
 * Generates the 56 items for Red Test (8x7).
 */
export function generateRedTestSections(): TestSection[] {
  return Array.from({ length: 8 }, (_, i) => {
    const s = i + 1
    const cvrBase = 15 + s * 10
    const cciBase = 0.6 + s * 0.12

    const items = Array.from({ length: 7 }, (_, j) => {
      const qInSession = j + 1
      const globalOrder = (s - 1) * 7 + qInSession
      const cvr = cvrBase + j * 3
      const cci = Math.round((cciBase + j * 0.04) * 100) / 100
      const cpd = calculateCPD(cvr, cci)

      return {
        id: `red-q-s${s}-q${qInSession}`,
        sectionId: `red-sec-${s}`,
        itemOrder: globalOrder,
        sessionNumber: s,
        promptText: `Red Test Prompt #${globalOrder}: Standard sentence resistance`,
        promptTextVi: `Mẫu câu #${globalOrder}: Đo sức cản ngôn ngữ và cấu trúc`,
        promptTextEn: `Sentence #${globalOrder}: Core grammatical & acoustic challenge`,
        cvrOhm: cvr,
        cciValue: cci,
        cpdValue: cpd,
      }
    })

    return {
      id: `red-sec-${s}`,
      packageId: 'red-test-56v',
      sessionNumber: s,
      title: `Section ${s}: Resistance Baseline Section ${s}`,
      introNarration: `Section ${s} baseline resistance assessment.`,
      items,
    }
  })
}

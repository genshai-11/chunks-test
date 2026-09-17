import { ColorMeta, SevenColor } from '../types/common'

export const SEVEN_COLORS: Record<SevenColor, ColorMeta> = {
  red: {
    color: 'red',
    labelEn: 'Red',
    labelVi: 'Đỏ',
    hex: '#ef4444',
    bgClass: 'bg-red-500',
    textClass: 'text-red-400',
    borderClass: 'border-red-500',
    isHot: true,
  },
  orange: {
    color: 'orange',
    labelEn: 'Orange',
    labelVi: 'Cam',
    hex: '#f97316',
    bgClass: 'bg-orange-500',
    textClass: 'text-orange-400',
    borderClass: 'border-orange-500',
    isHot: true,
  },
  yellow: {
    color: 'yellow',
    labelEn: 'Yellow',
    labelVi: 'Vàng',
    hex: '#eab308',
    bgClass: 'bg-yellow-500',
    textClass: 'text-yellow-400',
    borderClass: 'border-yellow-500',
    isHot: true,
  },
  green: {
    color: 'green',
    labelEn: 'Green',
    labelVi: 'Lục',
    hex: '#22c55e',
    bgClass: 'bg-emerald-500',
    textClass: 'text-emerald-400',
    borderClass: 'border-emerald-500',
    isHot: false,
  },
  blue: {
    color: 'blue',
    labelEn: 'Blue',
    labelVi: 'Lam',
    hex: '#3b82f6',
    bgClass: 'bg-blue-500',
    textClass: 'text-blue-400',
    borderClass: 'border-blue-500',
    isHot: false,
  },
  indigo: {
    color: 'indigo',
    labelEn: 'Indigo',
    labelVi: 'Chàm',
    hex: '#6366f1',
    bgClass: 'bg-indigo-500',
    textClass: 'text-indigo-400',
    borderClass: 'border-indigo-500',
    isHot: false,
  },
  purple: {
    color: 'purple',
    labelEn: 'Purple',
    labelVi: 'Tím',
    hex: '#a855f7',
    bgClass: 'bg-purple-500',
    textClass: 'text-purple-400',
    borderClass: 'border-purple-500',
    isHot: false,
  },
}

export const COLOR_ORDER: SevenColor[] = [
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'indigo',
  'purple',
]

/**
 * Maps ratio (elapsedSeconds / maxTimeSeconds) to one of the 7 Spectrum Colors.
 */
export function deriveColorFromRatio(ratio: number): SevenColor {
  const r = Math.max(0, Math.min(1, ratio))
  if (r < 1 / 7) return 'red'
  if (r < 2 / 7) return 'orange'
  if (r < 3 / 7) return 'yellow'
  if (r < 4 / 7) return 'green'
  if (r < 5 / 7) return 'blue'
  if (r < 6 / 7) return 'indigo'
  return 'purple'
}

/**
 * Calculates percentage of Warm (%RFC) and Cool (%RAC / %c / %i) colors.
 */
export function calculateColorDistribution(colors: SevenColor[]) {
  const counts: Record<SevenColor, number> = {
    red: 0,
    orange: 0,
    yellow: 0,
    green: 0,
    blue: 0,
    indigo: 0,
    purple: 0,
  }

  for (const c of colors) {
    if (counts[c] !== undefined) counts[c]++
  }

  const total = colors.length
  if (total === 0) {
    return {
      total: 0,
      counts,
      percentRFC: 0,
      percentRAC: 0,
      percentI: 0,
    }
  }

  const hotCount = counts.red + counts.orange + counts.yellow
  const coolCount = counts.green + counts.blue + counts.indigo + counts.purple

  const percentRFC = Math.round((hotCount / total) * 100)
  const percentRAC = Math.round((coolCount / total) * 100)

  return {
    total,
    counts,
    percentRFC,
    percentRAC,
    percentI: percentRAC, // In Blue Test, %i represents Observation Level (cool color ratio)
  }
}

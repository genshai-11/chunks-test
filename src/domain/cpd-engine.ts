/**
 * CPD (Cumulative Performance Demand) calculation engine for Red & Green tests.
 * Formula: CPD = CVR (Ohm) x CCI (Ampe)
 */

export function calculateCPD(cvrOhm: number, cciValue: number): number {
  return Math.round(cvrOhm * cciValue * 100) / 100
}

export function getCPDBand(cpd: number): 'Low' | 'Moderate' | 'High' | 'Extreme' {
  if (cpd < 20) return 'Low'
  if (cpd < 50) return 'Moderate'
  if (cpd < 100) return 'High'
  return 'Extreme'
}

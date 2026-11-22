// Score rules for the English exam courses, as plain functions (no page code) so tests/english.mjs can check them.
// Checked 2026-11-22. Rules change: always confirm on the official pages listed in the lessons.

/** CELPIP levels match Canadian Language Benchmark (CLB) levels one to one from 4 to 10; 10, 11 and 12 all count as CLB 10+. */
export function celpipToClb(level) {
  if (level >= 10) return 10;
  if (level >= 4) return level;
  return 0; // below CLB 4 (CELPIP M, 1, 2, 3): not enough for most immigration programmes
}

/**
 * Express Entry Comprehensive Ranking System, first official language, points per ability (IRCC, CRS criteria).
 * withSpouse: the principal applicant has a spouse or partner coming along.
 */
const CRS_SINGLE = { 4: 6, 5: 6, 6: 9, 7: 17, 8: 23, 9: 31, 10: 34 };
const CRS_SPOUSE = { 4: 6, 5: 6, 6: 8, 7: 16, 8: 22, 9: 29, 10: 32 };
export function crsFirstLanguage(clb, withSpouse = false) {
  if (clb < 4) return 0;
  return (withSpouse ? CRS_SPOUSE : CRS_SINGLE)[Math.min(10, clb)];
}
export const crsTotal = (clbs, withSpouse = false) => clbs.reduce((s, c) => s + crsFirstLanguage(c, withSpouse), 0);

/** Common thresholds people aim for, with the abilities they need. */
export const CELPIP_GOALS = [
  { id: 'citizenship', name: 'Canadian citizenship', need: { listening: 4, speaking: 4 }, test: 'CELPIP-General LS (or General)' },
  { id: 'cec-b', name: 'Express Entry, Canadian Experience Class (TEER 2 or 3 job)', need: { listening: 5, reading: 5, writing: 5, speaking: 5 }, test: 'CELPIP-General' },
  { id: 'fsw', name: 'Express Entry, Federal Skilled Worker or CEC (TEER 0 or 1 job)', need: { listening: 7, reading: 7, writing: 7, speaking: 7 }, test: 'CELPIP-General' },
  { id: 'crs9', name: 'Strong CRS score (CLB 9 in every ability)', need: { listening: 9, reading: 9, writing: 9, speaking: 9 }, test: 'CELPIP-General' },
];

/** TOEFL iBT from January 2026: each section 1 to 6; overall = average of the four, rounded to the nearest half band. */
export function toeflOverall(sections) {
  const avg = sections.reduce((a, b) => a + b, 0) / sections.length;
  return Math.round(avg * 2) / 2;
}

/** Rough CEFR level for a TOEFL band (the 1-6 scale was built to line up with CEFR A1 to C2). */
export function toeflCefr(band) {
  const lv = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  return lv[Math.max(0, Math.min(5, Math.floor(band) - 1))];
}

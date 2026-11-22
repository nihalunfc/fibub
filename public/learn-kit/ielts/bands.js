// IELTS band arithmetic, shared by the lesson figures, the live problems and tests/ielts.mjs.
// Raw-score tables are the commonly published approximate conversions; the exact cut-offs move a little
// from one test version to the next, so every page that uses them says "about".

/** Overall band: the mean of the four skill bands, rounded to the nearest half band (x.25 goes up to x.5, x.75 up to x+1). */
export function overall(l, r, w, s) {
  const mean = (l + r + w + s) / 4;
  return Math.floor(mean * 2 + 0.5 + 1e-9) / 2;
}

// [lowest raw score out of 40, band]
const LISTENING = [[39, 9], [37, 8.5], [35, 8], [32, 7.5], [30, 7], [26, 6.5], [23, 6], [18, 5.5], [16, 5], [13, 4.5], [10, 4], [8, 3.5], [6, 3], [4, 2.5]];
const READING_AC = [[39, 9], [37, 8.5], [35, 8], [33, 7.5], [30, 7], [27, 6.5], [23, 6], [19, 5.5], [15, 5], [13, 4.5], [10, 4], [8, 3.5], [6, 3], [4, 2.5]];
const READING_GT = [[40, 9], [39, 8.5], [37, 8], [36, 7.5], [34, 7], [32, 6.5], [30, 6], [27, 5.5], [23, 5], [19, 4.5], [15, 4], [12, 3.5], [9, 3], [6, 2.5]];
export const TABLES = { listening: LISTENING, academic: READING_AC, general: READING_GT };

/** About which band a raw score out of 40 gives. paper: 'listening' | 'academic' | 'general' (reading). */
export function rawToBand(raw, paper = 'listening') {
  for (const [min, band] of TABLES[paper]) if (raw >= min) return band;
  return raw > 0 ? 2 : 0;
}

/** The lowest raw score that reaches a band (about). */
export function rawFor(band, paper = 'listening') {
  const row = [...TABLES[paper]].reverse().find(([, b]) => b >= band);
  return row ? row[0] : 40;
}

// Canadian Language Benchmark from IELTS General Training bands (IRCC equivalency chart, checked 2026-11-22).
// Each row: [CLB, listening, reading, writing, speaking] minimum bands.
export const CLB = [[10, 8.5, 8, 7.5, 7.5], [9, 8, 7, 7, 7], [8, 7.5, 6.5, 6.5, 6.5], [7, 6, 6, 6, 6], [6, 5.5, 5, 5.5, 5.5], [5, 5, 4, 5, 5], [4, 4.5, 3.5, 4, 4]];
const SKILL = { listening: 1, reading: 2, writing: 3, speaking: 4 };

/** CLB level for one skill band (0 if below CLB 4). */
export function clbFor(skill, band) {
  for (const row of CLB) if (band >= row[SKILL[skill]]) return row[0];
  return 0;
}

/** Format a band: 7 -> "7.0", 6.5 -> "6.5". */
export const fmtBand = (b) => b.toFixed(1);

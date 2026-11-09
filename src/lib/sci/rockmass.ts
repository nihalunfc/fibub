// Rock mass classification arithmetic: RQD from core piece lengths (Deere), Barton's Q = (RQD/Jn)(Jr/Ja)(Jw/SRF),
// Bieniawski's RMR as a sum of ratings the user reads from the published tables, an editable RMR–Q correlation
// RMR = A ln Q + B, and GSI estimates. No rating tables are included: the user supplies every rating.
// Plain TypeScript, no DOM.

/** RQD (%) = 100 × (sum of sound core pieces at least `min` long) ÷ run length. Lengths in any one unit. */
export function rqd(pieces: number[], run: number, min = 10) {
  const counted = pieces.filter((p) => p >= min), sum = counted.reduce((s, p) => s + p, 0), total = pieces.reduce((s, p) => s + p, 0);
  return { rqd: run > 0 ? Math.min(100, (100 * sum) / run) : NaN, counted: counted.length, sum, recovery: run > 0 ? (100 * total) / run : NaN, total };
}

export type QIn = { rqd: number; jn: number; jr: number; ja: number; jw: number; srf: number };
/** Q and its three quotients. With `floor10`, an RQD under 10 is taken as 10 (Barton's convention). */
export function qValue(p: QIn, floor10 = true) {
  const r = floor10 ? Math.max(10, p.rqd) : p.rqd;
  const block = r / p.jn, shear = p.jr / p.ja, stress = p.jw / p.srf;
  return { q: block * shear * stress, qPrime: block * shear, block, shear, stress, rqdUsed: r };
}

/** RMR = sum of the five ratings + the orientation adjustment (zero or negative). */
export function rmr(ratings: number[], adjust = 0) {
  const basic = ratings.reduce((s, x) => s + x, 0);
  return { basic, total: basic + adjust };
}

/** The correlation RMR = A ln Q + B and its inverse. */
export const rmrFromQ = (q: number, A: number, B: number) => A * Math.log(q) + B;
export const qFromRmr = (r: number, A: number, B: number) => Math.exp((r - B) / A);

/** GSI from RMR89 with the groundwater rating set to dry and no orientation adjustment: GSI = RMR89′ − 5
 *  (Hoek, Kaiser and Bawden 1995; meant for RMR89′ above 23). */
export function gsiFromRmr(ratings: number[], dryRating: number) {
  const r = ratings.slice(0, 4).reduce((s, x) => s + x, 0) + dryRating;
  return { rmrDry: r, gsi: r - 5, valid: r > 23 };
}

/** Parse a list of lengths: numbers separated by commas, spaces, semicolons or new lines. */
export function parseLengths(text: string): { values: number[]; bad: string[] } {
  const values: number[] = [], bad: string[] = [];
  for (const t of text.split(/[\s,;]+/).filter(Boolean)) { const v = Number(t.replace(/^\+/, '')); if (Number.isFinite(v) && v >= 0) values.push(v); else bad.push(t); }
  return { values, bad };
}

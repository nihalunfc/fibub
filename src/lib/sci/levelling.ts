// Level book reduction: height of collimation and rise-and-fall, arithmetic checks, closure and adjustment. No DOM.

export type Reading = { name: string; bs?: number; is?: number; fs?: number; dist?: number; note?: string };
export type Reduced = {
  name: string; bs?: number; is?: number; fs?: number; note?: string;
  hi?: number; rise?: number; fall?: number; rlHoc: number; rlRf: number; setup: number; chain: number;
};

const has = (x: number | undefined): x is number => typeof x === 'number' && Number.isFinite(x);

/** Problems that stop a book being reduced, each as row number (1-based) and message. */
export function bookErrors(rows: Reading[]) {
  const e: { row: number; msg: string }[] = [];
  if (!rows.length) return [{ row: 0, msg: 'The book is empty.' }];
  if (!has(rows[0].bs)) e.push({ row: 1, msg: 'The first reading must be a back sight on a known level.' });
  rows.forEach((r, i) => {
    const n = [r.bs, r.is, r.fs].filter(has).length;
    if (!n) e.push({ row: i + 1, msg: 'has no reading' });
    if (has(r.is) && (has(r.bs) || has(r.fs))) e.push({ row: i + 1, msg: 'has an intermediate sight together with a back or fore sight' });
    if (i > 0 && has(r.bs) && !has(r.fs)) e.push({ row: i + 1, msg: 'has a back sight but no fore sight (a change point needs both)' });
  });
  const last = rows[rows.length - 1];
  if (rows.length > 1 && !has(last.fs)) e.push({ row: rows.length, msg: 'The last reading must be a fore sight.' });
  return e;
}

/**
 * Reduces a level book from the reduced level (RL) of the first point by both methods. distMode 'chainage' reads
 * dist as a running chainage; 'step' as the distance from the previous point. Rows without a distance get none (0).
 */
export function reduce(rows: Reading[], rl0: number, distMode: 'chainage' | 'step' = 'step'): Reduced[] {
  const out: Reduced[] = [];
  let hi = rl0 + (rows[0].bs ?? 0), prev = rows[0].bs ?? 0, rlRf = rl0, setup = 1, chain = 0;
  rows.forEach((r, i) => {
    if (i > 0 && has(r.dist)) chain = distMode === 'chainage' ? r.dist : chain + r.dist;
    else if (i === 0 && has(r.dist) && distMode === 'chainage') chain = r.dist;
    if (i === 0) { out.push({ ...r, hi, rlHoc: rl0, rlRf: rl0, setup, chain }); return; }
    const read = has(r.is) ? r.is : r.fs!;
    const diff = prev - read;
    rlRf += diff;
    const rec: Reduced = { ...r, rlHoc: hi - read, rlRf, setup, chain, rise: diff >= 0 ? diff : undefined, fall: diff < 0 ? -diff : undefined };
    if (has(r.bs)) { hi = rec.rlHoc + r.bs; rec.hi = hi; prev = r.bs; setup++; } else prev = read;
    out.push(rec);
  });
  return out;
}

/** The arithmetic checks of a reduced book. All differences should be zero (to rounding). */
export function checks(red: Reduced[]) {
  const sum = (f: (r: Reduced) => number | undefined) => red.reduce((s, r) => s + (f(r) ?? 0), 0);
  const sBS = sum((r) => r.bs), sFS = sum((r) => r.fs), sIS = sum((r) => r.is), sR = sum((r) => r.rise), sF = sum((r) => r.fall);
  const first = red[0].rlHoc, lastH = red[red.length - 1].rlHoc, lastR = red[red.length - 1].rlRf;
  // Full height-of-collimation check: Σ(RLs except the first) = Σ(each HI × readings taken from it) − ΣIS − ΣFS.
  let hiSum = 0, his: number[] = [];
  red.forEach((r) => { if (has(r.hi)) his.push(r.hi); });
  red.slice(1).forEach((r) => { hiSum += his[r.setup - 1]; });
  const rlSum = red.slice(1).reduce((s, r) => s + r.rlHoc, 0);
  return { sBS, sFS, sIS, sRise: sR, sFall: sF, bsFs: sBS - sFS, hocDiff: sBS - sFS - (lastH - first), rfDiff: sR - sF - (sBS - sFS), rlDiff: sR - sF - (lastR - first), fullHoc: hiSum - sIS - sFS - rlSum, setups: his.length };
}

/**
 * Closing error and its distribution. error = computed closing RL − known closing RL. Correction by setup: every
 * point read from setup s gets −error × s ÷ setups (fore and intermediate sights of that setup alike). By distance:
 * −error × chainage ÷ total chainage. The first point (fixed) gets none.
 */
export function adjust(red: Reduced[], known: number, by: 'setup' | 'distance') {
  const last = red[red.length - 1], error = last.rlHoc - known, n = red.filter((r) => has(r.hi)).length, L = last.chain - red[0].chain;
  const corr = red.map((r, i) => (i === 0 ? 0 : by === 'setup' ? (-error * r.setup) / n : L > 0 ? (-error * (r.chain - red[0].chain)) / L : NaN));
  return { error, corr, adj: red.map((r, i) => r.rlHoc + corr[i]), length: L, setups: n };
}

/** Allowable misclosure k√K in mm: K is the route length in km (k in mm/√km) or the number of setups (k in mm/√setup). */
export const allowable = (k: number, K: number) => k * Math.sqrt(K);

// Shared pieces for the "Check yourself" questions of the electricity and magnetism Learn tools. No DOM.
export type Question = { text: string; answer: number; unit: string; tol: number; steps: string[] };

/** A small seeded random number generator (mulberry32), so tests can repeat a set of questions. */
export function seeded(seed: number) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
export const pick = <T,>(rng: () => number, a: T[]) => a[Math.floor(rng() * a.length)];
/** Three significant figures, as a plain number. */
export const r3 = (x: number) => Number(x.toPrecision(3));

/** Checks a typed answer: true, false, or null when nothing usable was typed. Relative tolerance q.tol. */
export function isRight(typed: string, q: Question) {
  const t = typed.replace(/,/g, '').replace(/[−–]/g, '-').trim();
  const x = Number(t);
  if (!t || !Number.isFinite(x)) return null;
  return Math.abs(x - q.answer) <= q.tol * Math.abs(q.answer) + 1e-12;
}

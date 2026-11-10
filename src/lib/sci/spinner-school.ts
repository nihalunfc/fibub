// School maths: a spinner with sectors you design (Class 9 probability, Class 10, Class 12 expected value).
// P(sector) = its angle ÷ 360°. Spinning many times, the share of landings settles near that. No DOM.

export type Sector = { name: string; deg: number; points: number };

/** Probabilities of each sector (angle ÷ total angle). */
export function probs(s: Sector[]): number[] {
  const tot = s.reduce((t, x) => t + Math.max(0, x.deg), 0);
  return s.map((x) => (tot > 0 ? Math.max(0, x.deg) / tot : 0));
}

/** Which sector a pointer angle (degrees clockwise from the top, any value) lands in. */
export function sectorAt(s: Sector[], angle: number): number {
  const tot = s.reduce((t, x) => t + Math.max(0, x.deg), 0);
  let a = ((angle % tot) + tot) % tot, i = 0;
  for (; i < s.length; i++) { a -= Math.max(0, s[i].deg); if (a < 0) return i; }
  return s.length - 1;
}

/** Expected points per spin: Σ P(sector) × points. */
export const expected = (s: Sector[]) => probs(s).reduce((t, p, i) => t + p * s[i].points, 0);

/** Fit angles to a total of 360: scale them, round to whole degrees, fix the last so they add to 360. */
export function normalise(degs: number[]): number[] {
  const tot = degs.reduce((t, x) => t + Math.max(0, x), 0);
  if (tot <= 0) return degs.map(() => 360 / degs.length);
  const out = degs.map((x) => Math.round((Math.max(0, x) / tot) * 360));
  const diff = 360 - out.reduce((t, x) => t + x, 0);
  const big = out.indexOf(Math.max(...out)); out[big] += diff;
  return out;
}

/** A small seeded random generator (mulberry32). */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

/** Spin n times; returns counts per sector. */
export function spin(s: Sector[], n: number, r: () => number): number[] {
  const tot = s.reduce((t, x) => t + Math.max(0, x.deg), 0), c = s.map(() => 0);
  for (let i = 0; i < n; i++) c[sectorAt(s, r() * tot)]++;
  return c;
}

/** Degrees for a probability written as p/q: 1/3 → 120. */
export const degFor = (p: number) => p * 360;

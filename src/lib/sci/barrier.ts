// Noise barrier insertion loss for a point source behind a long thin barrier (2-D section): path difference over the
// top, Fresnel number N = 2δ/λ for each octave band, and the barrier attenuation by the Kurze–Anderson closed form of
// Maekawa's chart, or by the simpler 10·lg(3 + 20·δ/λ) form. A-weighted totals from octave band levels. No DOM.

export const BANDS = [63, 125, 250, 500, 1000, 2000, 4000, 8000];
/** A-weighting at the octave band centres (dB), rounded to 0.1 dB as usually tabulated. */
export const AWEIGHT = [-26.2, -16.1, -8.6, -3.2, 0, 1.2, 1.0, -1.1];

/** Speed of sound in air (m/s) at a temperature in °C. */
export const soundSpeed = (tC: number) => 331.3 * Math.sqrt(1 + tC / 273.15);

export type Section = { hs: number; ds: number; hb: number; dr: number; hr: number }; // heights and horizontal distances, m

/** Path difference δ (m): over the barrier top minus straight through. Negative when the line of sight is clear. */
export function pathDiff(g: Section) {
  const A = Math.hypot(g.ds, g.hb - g.hs), B = Math.hypot(g.dr, g.hb - g.hr), d = Math.hypot(g.ds + g.dr, g.hr - g.hs);
  const yLine = g.hs + ((g.hr - g.hs) * g.ds) / (g.ds + g.dr);
  return { delta: g.hb >= yLine ? A + B - d : -(A + B - d), A, B, d, blocked: g.hb > yLine, clearance: g.hb - yLine };
}

/** Kurze–Anderson: 5 + 20·lg(√(2πN)/tanh√(2πN)); for slightly negative N (−0.2 to 0) the tan form; 0 below. */
export function kurzeAnderson(N: number) {
  if (N <= -0.2) return 0;
  if (Math.abs(N) < 1e-12) return 5;
  const x = Math.sqrt(2 * Math.PI * Math.abs(N));
  return N > 0 ? 5 + 20 * Math.log10(x / Math.tanh(x)) : 5 + 20 * Math.log10(x / Math.tan(x));
}

/** Simple form 10·lg(3 + 10N) (= 10·lg(3 + 20δ/λ)), 0 when the line of sight is clear. */
export const simpleIL = (N: number) => (N > 0 ? 10 * Math.log10(3 + 10 * N) : 0);

/** Energy sum of levels in dB. */
export const dbSum = (L: number[]) => 10 * Math.log10(L.reduce((s, x) => s + 10 ** (x / 10), 0));

/** Insertion loss in each band and the A-weighted totals before and after. */
export function barrier(g: Section, levels: number[], opts: { c: number; cap: number; method: 'ka' | 'simple' }) {
  const p = pathDiff(g);
  const bands = BANDS.map((f, i) => {
    const lam = opts.c / f, N = (2 * p.delta) / lam;
    const raw = opts.method === 'ka' ? kurzeAnderson(N) : simpleIL(N), il = Math.min(opts.cap, Math.max(0, raw));
    return { f, lam, N, il, before: levels[i], after: levels[i] - il, aBefore: levels[i] + AWEIGHT[i], aAfter: levels[i] - il + AWEIGHT[i] };
  });
  const LA0 = dbSum(bands.map((b) => b.aBefore)), LA1 = dbSum(bands.map((b) => b.aAfter));
  return { ...p, bands, LA0, LA1, reduction: LA0 - LA1 };
}

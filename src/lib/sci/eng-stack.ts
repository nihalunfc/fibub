// One-dimensional tolerance stack-up: worst case, root sum of squares (RSS) and a seeded Monte Carlo
// simulation, with a normal-model fallout and Cp/Cpk for the result against its limits.
import { normCdf } from './stats.ts';

export type Dist = 'normal' | 'uniform' | 'triangular';
/** plus and minus are the tolerance sizes (minus as a positive number), dir +1 adds to the gap, −1 subtracts.
 * For a normal part, the tolerance band is ±k σ (k = 3 by default). */
export type Dim = { name: string; nominal: number; plus: number; minus: number; dir: 1 | -1; dist: Dist };

/** Middle of the tolerance band and half its width. */
export const centred = (d: Dim) => ({ mid: d.nominal + (d.plus - d.minus) / 2, half: (d.plus + d.minus) / 2 });
/** Standard deviation of a part filling its band: normal ±kσ, uniform (flat) or triangular. */
export function sigmaOf(d: Dim, k = 3) {
  const { half } = centred(d);
  return d.dist === 'normal' ? half / k : d.dist === 'uniform' ? half / Math.sqrt(3) : half / Math.sqrt(6);
}

/** Parse rows "name, nominal, plus, minus, direction, distribution". A single tolerance means ±. Direction is
 * + or − (also add/subtract); distribution defaults to normal. */
export function parseDims(rows: string[][]): Dim[] {
  const out: Dim[] = [];
  rows.forEach((r, i) => {
    const c = r.map((s) => s.trim());
    if (!c.length || c.every((s) => s === '')) return;
    const n = (s: string | undefined) => (s === undefined || s === '' ? NaN : Number(s.replace(/^\+/, '').replace('−', '-').replace('±', '')));
    const nominal = n(c[1]);
    if (!Number.isFinite(nominal)) { if (i === 0) return; throw new Error(`Row ${i + 1}: give a nominal size in the second column.`); }
    let plus = n(c[2]), minus = n(c[3]);
    if (!Number.isFinite(plus)) throw new Error(`Row ${i + 1}: give the tolerance.`);
    if (!Number.isFinite(minus)) minus = Math.abs(plus);
    minus = Math.abs(minus);
    if (plus + minus < 0) throw new Error(`Row ${i + 1}: the upper limit is below the lower limit.`);
    const ds = (c[4] ?? '+').toLowerCase();
    const dir = ds === '' || ds === '+' || ds.startsWith('add') || ds === '1' || ds === '+1' ? 1 : ds === '-' || ds === '−' || ds.startsWith('sub') || ds === '-1' ? -1 : NaN;
    if (!Number.isFinite(dir)) throw new Error(`Row ${i + 1}: the direction must be + or −.`);
    const dd = (c[5] ?? 'normal').toLowerCase();
    const dist: Dist = dd === '' || dd.startsWith('norm') ? 'normal' : dd.startsWith('uni') || dd.startsWith('flat') ? 'uniform' : dd.startsWith('tri') ? 'triangular' : (() => { throw new Error(`Row ${i + 1}: distribution must be normal, uniform or triangular.`); })();
    out.push({ name: c[0] || `Part ${out.length + 1}`, nominal, plus, minus, dir: dir as 1 | -1, dist });
  });
  if (!out.length) throw new Error('Add at least one dimension.');
  return out;
}

export function stack(dims: Dim[], k = 3) {
  const nominal = dims.reduce((s, d) => s + d.dir * d.nominal, 0);
  const mean = dims.reduce((s, d) => s + d.dir * centred(d).mid, 0);
  const wc = dims.reduce((s, d) => s + centred(d).half, 0);
  const sigma = Math.sqrt(dims.reduce((s, d) => s + sigmaOf(d, k) ** 2, 0));
  // Each part's share of the variance (what to tighten first).
  const share = dims.map((d) => sigmaOf(d, k) ** 2 / (sigma * sigma || 1));
  return { nominal, mean, wcMin: mean - wc, wcMax: mean + wc, wcHalf: wc, sigma, rssHalf: k * sigma, rssMin: mean - k * sigma, rssMax: mean + k * sigma, share };
}

/** Fraction outside [lsl, usl] if the gap is normal with this mean and sigma, plus Cp and Cpk. */
export function fallout(mean: number, sigma: number, lsl: number, usl: number) {
  const below = Number.isFinite(lsl) ? normCdf((lsl - mean) / sigma) : 0, above = Number.isFinite(usl) ? 1 - normCdf((usl - mean) / sigma) : 0;
  const Cp = Number.isFinite(lsl) && Number.isFinite(usl) ? (usl - lsl) / (6 * sigma) : NaN;
  const Cpk = Math.min(Number.isFinite(usl) ? (usl - mean) / (3 * sigma) : Infinity, Number.isFinite(lsl) ? (mean - lsl) / (3 * sigma) : Infinity);
  return { below, above, total: below + above, Cp, Cpk };
}

/** mulberry32, a small seeded generator so the same seed always gives the same simulation. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

/** Monte Carlo: draw each part from its distribution (normal parts are not truncated) and add up the gap. */
export function monteCarlo(dims: Dim[], n: number, seed: number, k = 3): Float64Array {
  const r = rng(seed), out = new Float64Array(n);
  const p = dims.map((d) => ({ ...centred(d), s: sigmaOf(d, k), dir: d.dir, dist: d.dist }));
  let spare = NaN;
  const gauss = () => {
    if (!Number.isNaN(spare)) { const v = spare; spare = NaN; return v; }
    let u = 0; while (u === 0) u = r();
    const v = r(), m = Math.sqrt(-2 * Math.log(u));
    spare = m * Math.sin(2 * Math.PI * v); return m * Math.cos(2 * Math.PI * v);
  };
  for (let i = 0; i < n; i++) {
    let g = 0;
    for (const d of p) {
      const x = d.dist === 'normal' ? d.mid + d.s * gauss() : d.dist === 'uniform' ? d.mid + d.half * (2 * r() - 1) : d.mid + d.half * (r() + r() - 1);
      g += d.dir * x;
    }
    out[i] = g;
  }
  return out;
}

export function summarise(x: Float64Array, lsl: number, usl: number) {
  const s = Float64Array.from(x).sort(), n = s.length;
  let m = 0; for (const v of s) m += v; m /= n;
  let v2 = 0; for (const v of s) v2 += (v - m) ** 2;
  const sd = Math.sqrt(v2 / (n - 1));
  const q = (p: number) => { const h = (n - 1) * p, lo = Math.floor(h); return s[lo] + (h - lo) * ((s[Math.min(n - 1, lo + 1)] ?? s[lo]) - s[lo]); };
  let below = 0, above = 0; for (const v of s) { if (v < lsl) below++; else if (v > usl) above++; }
  return { mean: m, sd, min: s[0], max: s[n - 1], p00135: q(0.00135), p99865: q(0.99865), below: below / n, above: above / n, sorted: s };
}

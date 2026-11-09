// Stochastic simulation of small reaction networks with Gillespie's direct method (exact SSA), using the same
// reaction language as the pathway ODE builder. Amounts are molecule counts. No DOM.
import { type Model, rates } from './sbode.ts';
import { rng } from './sbnet.ts';

/** One reaction channel: the reversible reactions are split in two. */
export type Channel = { change: number[]; prop: (x: number[], p: Record<string, number>) => number; label: string };

const val = (a: string, p: Record<string, number>) => (a in p ? p[a] : Number(a));
/** n (n − 1) … (n − s + 1): the number of ordered ways to pick s molecules, so that k·this ≈ k·nˢ for large n. */
const falling = (n: number, s: number) => { let r = 1; for (let i = 0; i < s; i++) r *= Math.max(0, n - i); return r; };

/**
 * Propensities in counts: mass action k·∏ n(n−1)…(n−s+1) (so for large counts it matches the ODE rate k·∏ nˢ),
 * and Michaelis–Menten or Hill laws evaluated on the counts, the usual approximation for enzyme steps.
 */
export function channels(m: Model): Channel[] {
  const idx = new Map(m.species.map((s, i) => [s, i])), N = m.species.length;
  const vec = (minus: [string, number][], plus: [string, number][]) => { const v = new Array(N).fill(0); for (const [n, s] of minus) v[idx.get(n)!] -= s; for (const [n, s] of plus) v[idx.get(n)!] += s; return v; };
  const ma = (side: [string, number][]) => (x: number[]) => side.reduce((acc, [n, s]) => acc * falling(x[idx.get(n)!], s), 1);
  const out: Channel[] = [];
  m.reactions.forEach((r, j) => {
    const L = r.law;
    if (L.kind === 'ma') { const f = ma(r.reactants); out.push({ change: vec(r.reactants, r.products), prop: (x, p) => val(L.k, p) * f(x), label: r.text }); }
    else if (L.kind === 'rev') {
      const f = ma(r.reactants), b = ma(r.products);
      out.push({ change: vec(r.reactants, r.products), prop: (x, p) => val(L.kf, p) * f(x), label: r.text + ' (forward)' });
      out.push({ change: vec(r.products, r.reactants), prop: (x, p) => val(L.kr, p) * b(x), label: r.text + ' (back)' });
    } else {
      const one = { ...m, reactions: [r] };
      out.push({ change: vec(r.reactants, r.products), prop: (x, p) => Math.max(0, rates(one, x, p)[0]), label: r.text });
    }
    void j;
  });
  return out;
}

/** Starting counts: whole numbers of 0 or more, or an error message. */
export function startCounts(m: Model): number[] | string {
  for (const s of m.species) if (!Number.isInteger(m.init[s])) return `The starting amount of ${s} must be a whole number of molecules (it is ${m.init[s]}).`;
  return m.species.map((s) => m.init[s]);
}

/**
 * One exact trajectory (Gillespie's direct method) from x0, recording the state at each of `times` (increasing,
 * starting at 0). Returns the samples and the number of reactions fired.
 */
export function ssa(ch: Channel[], p: Record<string, number>, x0: number[], times: number[], R: () => number, maxEvents = 1e7) {
  const x = x0.slice(), out: number[][] = [], a = new Array(ch.length).fill(0);
  let t = 0, k = 0, events = 0;
  while (k < times.length && times[k] <= 0) { out.push(x.slice()); k++; }
  while (k < times.length) {
    let a0 = 0;
    for (let i = 0; i < ch.length; i++) { a[i] = ch[i].prop(x, p); a0 += a[i]; }
    const dt = a0 > 0 ? -Math.log(1 - R()) / a0 : Infinity;
    while (k < times.length && times[k] < t + dt) { out.push(x.slice()); k++; }
    if (k >= times.length) break;
    t += dt;
    let r = R() * a0, i = 0;
    while (i < ch.length - 1 && r >= a[i]) { r -= a[i]; i++; }
    const c = ch[i].change;
    for (let j = 0; j < x.length; j++) x[j] += c[j];
    if (++events > maxEvents) throw new Error(`More than ${maxEvents.toLocaleString('en')} reactions fired; use smaller amounts, a shorter time or fewer runs.`);
  }
  return { samples: out, events };
}

export type Ensemble = { times: number[]; mean: number[][]; sd: number[][]; lo: number[][]; hi: number[][]; final: number[][]; traces: number[][][]; events: number };

/**
 * Many independent runs from a seed: mean, standard deviation and the 5 to 95 % range of each species at each time
 * (times × species), the final counts of every run (runs × species) and the first `keep` trajectories.
 */
export function ensemble(m: Model, p: Record<string, number>, times: number[], runs: number, seed = 1, keep = 5, maxEvents = 2e7): Ensemble {
  const x0 = startCounts(m); if (typeof x0 === 'string') throw new Error(x0);
  const ch = channels(m), R = rng(seed), T = times.length, S = m.species.length;
  const all: number[][][] = [];
  let events = 0;
  for (let r = 0; r < runs; r++) { const res = ssa(ch, p, x0, times, R, maxEvents - events); events += res.events; all.push(res.samples); }
  const mean: number[][] = [], sd: number[][] = [], lo: number[][] = [], hi: number[][] = [];
  for (let k = 0; k < T; k++) {
    mean.push([]); sd.push([]); lo.push([]); hi.push([]);
    for (let j = 0; j < S; j++) {
      const v = all.map((tr) => tr[k][j]), mu = v.reduce((s, x) => s + x, 0) / runs;
      mean[k].push(mu); sd[k].push(runs > 1 ? Math.sqrt(v.reduce((s, x) => s + (x - mu) ** 2, 0) / (runs - 1)) : 0);
      v.sort((a, b) => a - b); lo[k].push(quant(v, 0.05)); hi[k].push(quant(v, 0.95));
    }
  }
  return { times, mean, sd, lo, hi, final: all.map((tr) => tr[T - 1]), traces: all.slice(0, keep), events };
}

const quant = (s: number[], q: number) => { const h = (s.length - 1) * q, i = Math.floor(h); return s[i] + (h - i) * ((s[i + 1] ?? s[i]) - s[i]); };

/** Poisson probability of n with mean λ. */
export function poisson(n: number, lam: number) {
  if (lam <= 0) return n === 0 ? 1 : 0;
  let lg = 0; for (let i = 2; i <= n; i++) lg += Math.log(i);
  return Math.exp(n * Math.log(lam) - lam - lg);
}

/** Sample mean, variance (n − 1) and Fano factor (variance ÷ mean) of a list of counts. */
export function moments(v: number[]) {
  const n = v.length, mu = v.reduce((s, x) => s + x, 0) / n, va = n > 1 ? v.reduce((s, x) => s + (x - mu) ** 2, 0) / (n - 1) : 0;
  return { mean: mu, variance: va, fano: mu > 0 ? va / mu : NaN };
}

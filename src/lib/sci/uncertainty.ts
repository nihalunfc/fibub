// Uncertainty propagation following the GUM (JCGM 100:2008): first-order sensitivity coefficients,
// combined standard uncertainty, Welch-Satterthwaite effective degrees of freedom and an expanded
// uncertainty, checked by a Monte Carlo run as in GUM Supplement 1 (JCGM 101:2008).
import { tInv, quantileSorted } from './stats.ts';

export type Dist = 'normal' | 'rect' | 'tri' | 'readings';
export type Input = {
  name: string;
  /** Best estimate. For 'readings' it is the mean of the readings. */
  value: number;
  /** normal: standard uncertainty; rect/tri: half-width a; readings: ignored. */
  spread: number;
  dist: Dist;
  readings?: number[];
};
export type InputRow = Input & { u: number; dof: number; c: number; contrib: number; share: number };
export type Result = {
  y: number; uc: number; dof: number; k: number; U: number; rows: InputRow[];
  mc?: { mean: number; sd: number; lo: number; hi: number; n: number; samples: Float64Array };
};

/** Standard uncertainty and degrees of freedom of one input (Type B inputs count as exactly known: infinite dof). */
export function standardU(i: Input): { value: number; u: number; dof: number } {
  if (i.dist === 'readings') {
    const r = i.readings ?? [];
    if (r.length < 2) throw new Error(`${i.name}: type at least two readings`);
    const m = r.reduce((s, x) => s + x, 0) / r.length;
    const s = Math.sqrt(r.reduce((t, x) => t + (x - m) ** 2, 0) / (r.length - 1));
    return { value: m, u: s / Math.sqrt(r.length), dof: r.length - 1 };
  }
  const a = Math.abs(i.spread);
  const u = i.dist === 'rect' ? a / Math.sqrt(3) : i.dist === 'tri' ? a / Math.sqrt(6) : a;
  return { value: i.value, u, dof: Infinity };
}

/** GUM first-order propagation for y = f(x1..xn). f takes the inputs in the order given. */
export function propagate(f: (v: ArrayLike<number>) => number, inputs: Input[], coverage = 0.9545): Result {
  const base = inputs.map(standardU);
  const x = base.map((b) => b.value);
  const y = f(x);
  if (!Number.isFinite(y)) throw new Error('The formula gives no finite value for these inputs (check for division by zero, or a square root or log of a negative number)');
  const rows: InputRow[] = inputs.map((inp, i) => {
    const { u, dof } = base[i];
    let c = 0;
    if (u > 0) {
      // Central difference over a step tied to the input's own uncertainty, as GUM 5.1.3 allows.
      const h = Math.max(u * 1e-3, Math.abs(x[i]) * 1e-10, 1e-300);
      const xp = x.slice(), xm = x.slice(); xp[i] += h; xm[i] -= h;
      const fp = f(xp), fm = f(xm);
      c = Number.isFinite(fp) && Number.isFinite(fm) ? (fp - fm) / (2 * h) : Number.isFinite(fp) ? (fp - y) / h : (y - fm) / h;
    }
    return { ...inp, value: x[i], u, dof, c, contrib: Math.abs(c) * u, share: 0 };
  });
  const uc2 = rows.reduce((s, r) => s + r.contrib ** 2, 0), uc = Math.sqrt(uc2);
  rows.forEach((r) => (r.share = uc2 > 0 ? r.contrib ** 2 / uc2 : 0));
  // Welch-Satterthwaite (GUM G.4.1).
  const denom = rows.reduce((s, r) => s + (Number.isFinite(r.dof) && r.contrib > 0 ? r.contrib ** 4 / r.dof : 0), 0);
  const dof = denom > 0 ? uc ** 4 / denom : Infinity;
  const k = tInv(1 - (1 - coverage) / 2, Number.isFinite(dof) ? Math.max(1, dof) : 1e9);
  return { y, uc, dof, k, U: k * uc, rows };
}

/** A small, fast random generator (so a run can be repeated with the same seed in tests). */
export function rng(seed = 12345) {
  let s = seed >>> 0 || 1;
  const u = () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return (s + 0.5) / 4294967296; };
  let spare: number | null = null;
  const z = () => {
    if (spare != null) { const v = spare; spare = null; return v; }
    let a, b, r;
    do { a = 2 * u() - 1; b = 2 * u() - 1; r = a * a + b * b; } while (r >= 1 || r === 0);
    const m = Math.sqrt((-2 * Math.log(r)) / r);
    spare = b * m; return a * m;
  };
  return { u, z };
}

/** Monte Carlo propagation (GUM Supplement 1). Returns the mean, standard deviation and the shortest-free probabilistically symmetric interval. */
export function monteCarlo(f: (v: ArrayLike<number>) => number, inputs: Input[], n = 200000, coverage = 0.9545, seed = 2026) {
  const R = rng(seed);
  const base = inputs.map(standardU);
  const out = new Float64Array(n);
  const v = new Float64Array(inputs.length);
  let bad = 0;
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < inputs.length; i++) {
      const inp = inputs[i], b = base[i];
      if (inp.dist === 'rect') v[i] = b.value + Math.abs(inp.spread) * (2 * R.u() - 1);
      else if (inp.dist === 'tri') v[i] = b.value + Math.abs(inp.spread) * (R.u() + R.u() - 1);
      else if (inp.dist === 'readings') {
        // Scaled and shifted t with n-1 degrees of freedom (Supplement 1, 6.4.9).
        const nu = b.dof; let chi = 0;
        for (let q = 0; q < nu; q++) { const zz = R.z(); chi += zz * zz; }
        v[i] = b.value + b.u * (R.z() / Math.sqrt(chi / nu));
      } else v[i] = b.value + b.u * R.z();
    }
    const y = f(v);
    if (Number.isFinite(y)) out[j - bad] = y; else bad++;
  }
  const samples = out.subarray(0, n - bad);
  if (samples.length < n * 0.99) throw new Error(`The formula failed for ${Math.round((bad / n) * 100)}% of the random draws (for example a square root or log of a negative number near your values). The Monte Carlo check is not reliable here.`);
  let m = 0; for (const y of samples) m += y; m /= samples.length;
  let ss = 0; for (const y of samples) ss += (y - m) ** 2;
  const sorted = Float64Array.from(samples).sort();
  const p = (1 - coverage) / 2;
  return { mean: m, sd: Math.sqrt(ss / (samples.length - 1)), lo: quantileSorted(sorted, p), hi: quantileSorted(sorted, 1 - p), n: samples.length, samples: sorted };
}

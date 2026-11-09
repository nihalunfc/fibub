// Harmonic tide prediction and analysis.
// Water level h(t) = Z0 + Σ f·H·cos(V + u − G): H and G (Greenwich phase lag, degrees, times in UTC) are the
// constituent amplitude and phase; V is the astronomical argument from the Doodson numbers of each constituent
// applied to the mean longitudes (τ lunar time, s Moon, h Sun, p lunar perigee, N' = −N lunar node, p1 solar
// perigee); f and u are the nodal factor and angle from the 18.6-year cycle of the lunar node, by Schureman's
// formulas (Manual of Harmonic Analysis and Prediction of Tides, 1958; equations 73–78, 149, 204–235). The phase
// constants follow Schureman, which matches the Doodson/IHO convention used by t_tide and UTide except for Sa,
// whose argument here is h alone (Schureman), not h − p1.

const D2R = Math.PI / 180;
const mod360 = (x: number) => ((x % 360) + 360) % 360;

/** Mean longitudes (degrees) at a time given in ms since 1970 UTC. Meeus, Astronomical Algorithms (1998), ch. 22 and 47. */
export function astro(ms: number) {
  const jd = ms / 86400000 + 2440587.5, T = (jd - 2451545) / 36525;
  const s = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T;
  const h = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const p = 83.3532465 + 4069.0137287 * T - 0.01032 * T * T;
  const N = 125.0445479 - 1934.1362891 * T + 0.0020754 * T * T;
  const p1 = 282.93735 + 1.71946 * T + 0.00046 * T * T;
  const hourUT = (((ms / 3600000) % 24) + 24) % 24;
  const tau = 15 * hourUT + h - s; // lunar time, from midnight UT (Doodson)
  return { tau, s, h, p, N, Np: -N, p1, T };
}
/** Rates of the six arguments in degrees per hour (from the same polynomials). */
export const RATES = (() => { const c = 36525 * 24; const s = 481267.88123421 / c, h = 36000.76983 / c, p = 4069.0137287 / c, N = 1934.1362891 / c, p1 = 1.71946 / c; return [15 + h - s, s, h, p, N, p1]; })();

// Obliquity of the ecliptic and inclination of the Moon's orbit, as Schureman uses them.
export const OMEGA = 23.452, INCL = 5.145;

/**
 * I (inclination of the Moon's orbit to the equator), ν (right ascension of the lunar intersection) and ξ
 * (longitude in the Moon's orbit of the lunar intersection), degrees, from the node N, worked out with vectors.
 */
export function lunarIntersection(Ndeg: number) {
  const w = OMEGA * D2R, i = INCL * D2R, N = Ndeg * D2R;
  const e = [0, -Math.sin(w), Math.cos(w)]; // ecliptic pole
  const n = [Math.cos(N), Math.sin(N) * Math.cos(w), Math.sin(N) * Math.sin(w)]; // ascending node on the ecliptic
  const cross = (a: number[], b: number[]) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const dot = (a: number[], b: number[]) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const exn = cross(e, n), m = e.map((v, k) => v * Math.cos(i) - exn[k] * Math.sin(i)); // orbit pole
  const I = Math.acos(m[2]);
  const a0 = cross([0, 0, 1], m), al = Math.hypot(...a0), a = a0.map((v) => v / al); // ascending node on the equator
  const nu = Math.atan2(a[1], a[0]);
  const theta = Math.atan2(dot(cross(a, n), m), dot(a, n));
  let xi = N - theta;
  xi = Math.atan2(Math.sin(xi), Math.cos(xi));
  return { I: I / D2R, nu: nu / D2R, xi: xi / D2R };
}

type Nodal = { f: number; u: number };
/** Schureman's nodal factors and angles (degrees) for the basic formulas, from I, ν, ξ and P = p − ξ. */
export function nodalSet(N: number, p: number) {
  const { I, nu, xi } = lunarIntersection(N);
  const Ir = I * D2R, w = OMEGA * D2R, i = INCL * D2R, nur = nu * D2R, sI = Math.sin(Ir);
  // Means over the node cycle (Schureman eqs 65–71), so f averages to 1.
  const k = 1 - 1.5 * Math.sin(i) ** 2, c4i = Math.cos(i / 2) ** 4;
  const mM2 = Math.cos(w / 2) ** 4 * c4i, mO1 = Math.sin(w) * Math.cos(w / 2) ** 2 * c4i, mMf = Math.sin(w) ** 2 * c4i;
  const mMm = (2 / 3 - Math.sin(w) ** 2) * k, mJ1 = Math.sin(2 * w) * k, mOO1 = Math.sin(w) * Math.sin(w / 2) ** 2 * c4i;
  const M2 = { f: Math.cos(Ir / 2) ** 4 / mM2, u: 2 * xi - 2 * nu };
  const O1 = { f: (sI * Math.cos(Ir / 2) ** 2) / mO1, u: 2 * xi - nu };
  const Mf = { f: sI ** 2 / mMf, u: -2 * xi };
  const Mm = { f: (2 / 3 - sI ** 2) / mMm, u: 0 };
  const J1 = { f: Math.sin(2 * Ir) / mJ1, u: -nu };
  const OO1 = { f: (sI * Math.sin(Ir / 2) ** 2) / mOO1, u: -2 * xi - nu };
  // K1 and K2 combine lunar and solar parts (Schureman 227, 235; ν', 2ν'' from 224, 232).
  const nup = Math.atan2(Math.sin(2 * Ir) * Math.sin(nur), Math.sin(2 * Ir) * Math.cos(nur) + 0.3347) / D2R;
  const nupp2 = Math.atan2(sI ** 2 * Math.sin(2 * nur), sI ** 2 * Math.cos(2 * nur) + 0.0727) / D2R;
  const K1 = { f: Math.sqrt(0.2523 * Math.sin(2 * Ir) ** 2 + 0.1689 * Math.sin(2 * Ir) * Math.cos(nur) + 0.0283) / (0.5023 * mJ1 + 0.1681), u: -nup };
  const K2 = { f: Math.sqrt(0.2533 * sI ** 4 + 0.0367 * sI ** 2 * Math.cos(2 * nur) + 0.0013) / (0.5023 * Math.sin(w) ** 2 * k + 0.0365), u: -nupp2 };
  // L2 (Schureman 213–215), with P = p − ξ.
  const P = (p - xi) * D2R, t2 = Math.tan(Ir / 2) ** 2;
  const L2 = { f: M2.f * Math.sqrt(1 - 12 * t2 * Math.cos(2 * P) + 36 * t2 * t2), u: M2.u - Math.atan2(Math.sin(2 * P), 1 / (6 * t2) - Math.cos(2 * P)) / D2R };
  const M3 = { f: M2.f ** 1.5, u: 1.5 * M2.u };
  return { I, nu, xi, M2, O1, Mf, Mm, J1, OO1, K1, K2, L2, M3, one: { f: 1, u: 0 } as Nodal };
}
type NodalKey = 'M2' | 'O1' | 'Mf' | 'Mm' | 'J1' | 'OO1' | 'K1' | 'K2' | 'L2' | 'M3' | 'one';

/** A basic constituent: Doodson numbers on (τ, s, h, p, N', p1), phase constant (degrees) and nodal formula. */
type Basic = { d: number[]; c: number; n: NodalKey };
const BASIC: Record<string, Basic> = {
  SA: { d: [0, 0, 1, 0, 0, 0], c: 0, n: 'one' },
  SSA: { d: [0, 0, 2, 0, 0, 0], c: 0, n: 'one' },
  MM: { d: [0, 1, 0, -1, 0, 0], c: 0, n: 'Mm' },
  MSF: { d: [0, 2, -2, 0, 0, 0], c: 0, n: 'M2' }, // f, u of M2 with the sign of u flipped (below)
  MF: { d: [0, 2, 0, 0, 0, 0], c: 0, n: 'Mf' },
  '2Q1': { d: [1, -3, 0, 2, 0, 0], c: -90, n: 'O1' },
  SIG1: { d: [1, -3, 2, 0, 0, 0], c: -90, n: 'O1' },
  Q1: { d: [1, -2, 0, 1, 0, 0], c: -90, n: 'O1' },
  RHO1: { d: [1, -2, 2, -1, 0, 0], c: -90, n: 'O1' },
  O1: { d: [1, -1, 0, 0, 0, 0], c: -90, n: 'O1' },
  P1: { d: [1, 1, -2, 0, 0, 0], c: -90, n: 'one' },
  K1: { d: [1, 1, 0, 0, 0, 0], c: 90, n: 'K1' },
  J1: { d: [1, 2, 0, -1, 0, 0], c: 90, n: 'J1' },
  OO1: { d: [1, 3, 0, 0, 0, 0], c: 90, n: 'OO1' },
  '2N2': { d: [2, -2, 0, 2, 0, 0], c: 0, n: 'M2' },
  MU2: { d: [2, -2, 2, 0, 0, 0], c: 0, n: 'M2' },
  N2: { d: [2, -1, 0, 1, 0, 0], c: 0, n: 'M2' },
  NU2: { d: [2, -1, 2, -1, 0, 0], c: 0, n: 'M2' },
  M2: { d: [2, 0, 0, 0, 0, 0], c: 0, n: 'M2' },
  LDA2: { d: [2, 1, -2, 1, 0, 0], c: 180, n: 'M2' },
  L2: { d: [2, 1, 0, -1, 0, 0], c: 180, n: 'L2' },
  T2: { d: [2, 2, -3, 0, 0, 1], c: 0, n: 'one' },
  S2: { d: [2, 2, -2, 0, 0, 0], c: 0, n: 'one' },
  K2: { d: [2, 2, 0, 0, 0, 0], c: 0, n: 'K2' },
  M3: { d: [3, 0, 0, 0, 0, 0], c: 180, n: 'M3' },
};
/** Shallow-water and compound tides as sums of basic ones (name → [coefficient, basic name][]). */
const COMPOUND: Record<string, [number, string][]> = {
  MK3: [[1, 'M2'], [1, 'K1']], MO3: [[1, 'M2'], [1, 'O1']],
  MN4: [[1, 'M2'], [1, 'N2']], M4: [[2, 'M2']], MS4: [[1, 'M2'], [1, 'S2']], S4: [[2, 'S2']],
  M6: [[3, 'M2']], '2MS6': [[2, 'M2'], [1, 'S2']], M8: [[4, 'M2']],
};
/** Every constituent the tool knows, in the order used to choose them for an analysis (most important first). */
export const PRIORITY = ['M2', 'S2', 'K1', 'O1', 'N2', 'K2', 'P1', 'Q1', 'M4', 'MS4', 'MN4', 'M6', 'SA', 'SSA', 'MM', 'MF', 'MSF', '2N2', 'MU2', 'NU2', 'L2', 'T2', 'J1', 'OO1', 'M3', '2Q1', 'RHO1', 'SIG1', 'LDA2', 'MK3', 'MO3', 'S4', '2MS6', 'M8'];
export const ALIASES: Record<string, string> = { LAM2: 'LDA2', LAMBDA2: 'LDA2', 'λ2': 'LDA2', 'Μ2': 'MU2', 'Ν2': 'NU2', 'Ρ1': 'RHO1', 'Σ1': 'SIG1', RHO: 'RHO1', SIGMA1: 'SIG1', MSf: 'MSF', '2MK3': 'MO3' };
export const known = (name: string) => { const k = name.trim().toUpperCase(); const a = ALIASES[k] ?? ALIASES[name.trim()] ?? k; return a in BASIC || a in COMPOUND ? a : null; };

const parts = (name: string): [number, string][] => (name in COMPOUND ? COMPOUND[name] : [[1, name]]);
/** Speed in degrees per hour. */
export function speed(name: string): number {
  return parts(name).reduce((t, [k, b]) => t + k * BASIC[b].d.reduce((s, d, i) => s + d * RATES[i], 0), 0);
}
/** Equilibrium argument V (degrees, 0–360) at a time, plus nodal f and u (if `nodal`). */
export function argument(name: string, ms: number, nodal = true) {
  const a = astro(ms), args = [a.tau, a.s, a.h, a.p, a.Np, a.p1];
  const ns = nodal ? nodalSet(a.N, a.p) : null;
  let V = 0, f = 1, u = 0;
  for (const [k, b] of parts(name)) {
    const B = BASIC[b];
    V += k * (B.d.reduce((s, d, i) => s + d * args[i], 0) + B.c);
    if (ns) { const nf = ns[B.n]; const sign = b === 'MSF' ? -1 : 1; f *= nf.f ** Math.abs(k); u += k * sign * nf.u; }
  }
  return { V: mod360(V), f, u };
}

export type Constituent = { name: string; H: number; G: number };
export type Series = { t: number[]; h: number[] };

/** Predicted level at the given times (ms since 1970 UTC). Nodal f, u are worked out for each hour and held within it. */
export function predict(cons: Constituent[], Z0: number, times: number[], nodal = true): number[] {
  const om = cons.map((c) => speed(c.name) * D2R / 3600000);
  const cache = new Map<number, { V: number; f: number; u: number }[]>();
  return times.map((t) => {
    // Arguments at the start of the hour, then advance V at the constituent's speed (exact for a linear V).
    const t0 = Math.floor(t / 3600000) * 3600000;
    let args = cache.get(t0);
    if (!args) { args = cons.map((c) => argument(c.name, t0, nodal)); if (cache.size > 4000) cache.clear(); cache.set(t0, args); }
    let h = Z0;
    cons.forEach((c, i) => { const A = args![i]; h += A.f * c.H * Math.cos((A.V + A.u - c.G) * D2R + om[i] * (t - t0)); });
    return h;
  });
}
/** Rate of change of the level (units per hour) at time t. */
function rate(cons: Constituent[], t: number, nodal: boolean, om: number[]) {
  let r = 0;
  cons.forEach((c, i) => { const A = argument(c.name, t, nodal); r -= A.f * c.H * om[i] * Math.sin((A.V + A.u - c.G) * D2R); });
  return r;
}

export type Extreme = { t: number; h: number; kind: 'high' | 'low' };
/** High and low waters between t0 and t1 (ms): where the rate changes sign, refined by bisection to under a second. */
export function extremes(cons: Constituent[], Z0: number, t0: number, t1: number, nodal = true): Extreme[] {
  const om = cons.map((c) => speed(c.name) * D2R); // rad per hour
  const step = 10 * 60000, out: Extreme[] = [];
  let ta = t0, ra = rate(cons, ta, nodal, om);
  for (let tb = t0 + step; tb <= t1 + 1; tb += step) {
    const rb = rate(cons, tb, nodal, om);
    if (ra > 0 !== rb > 0 && ra !== 0) {
      let a = ta, b = tb, fa = ra;
      for (let it = 0; it < 40 && b - a > 200; it++) { const m = (a + b) / 2, fm = rate(cons, m, nodal, om); if (fm > 0 === fa > 0) { a = m; fa = fm; } else b = m; }
      const t = (a + b) / 2;
      out.push({ t, h: predict(cons, Z0, [t], nodal)[0], kind: ra > 0 ? 'high' : 'low' });
    }
    ta = tb; ra = rb;
  }
  return out;
}

/** Spans of time (ms) when the level is at or above `level`, found on the given series and refined linearly. */
export function windows(s: Series, level: number): [number, number][] {
  const out: [number, number][] = [];
  let start: number | null = s.h[0] >= level ? s.t[0] : null;
  for (let i = 1; i < s.t.length; i++) {
    const a = s.h[i - 1], b = s.h[i];
    if (a < level && b >= level) start = s.t[i - 1] + ((level - a) / (b - a)) * (s.t[i] - s.t[i - 1]);
    if (a >= level && b < level && start !== null) { out.push([start, s.t[i - 1] + ((a - level) / (a - b)) * (s.t[i] - s.t[i - 1])]); start = null; }
  }
  if (start !== null) out.push([start, s.t[s.t.length - 1]]);
  return out;
}

/** Constituents that can be told apart in a record of `hours` (Rayleigh criterion, factor R), chosen in priority order. */
export function rayleighSelect(hours: number, R = 1, from = PRIORITY): string[] {
  const out: string[] = [];
  for (const n of from) { const w = speed(n); if (out.every((m) => Math.abs(speed(m) - w) * hours / 360 >= R)) out.push(n); }
  // Never fit a period longer than the record.
  return out.filter((n) => (360 / speed(n)) <= hours * 1.0001 || false);
}

export type Analysis = { Z0: number; cons: (Constituent & { speed: number })[]; rms: number; n: number; hours: number; residual: number[]; fit: number[] };
/**
 * Least-squares harmonic analysis: h = Z0 + Σ f (a cos(V+u) + b sin(V+u)), solved by Householder QR; then
 * H = √(a² + b²) and G = atan2(b, a).
 */
export function analyse(times: number[], h: number[], names: string[], nodal = true): Analysis {
  const n = times.length, m = 1 + 2 * names.length;
  if (n < m + 2) throw new Error(`Too few readings for ${names.length} constituents: need at least ${m + 2}.`);
  const A: Float64Array[] = times.map((t) => {
    const r = new Float64Array(m); r[0] = 1;
    names.forEach((nm, j) => { const g = argument(nm, t, nodal), ph = (g.V + g.u) * D2R; r[1 + 2 * j] = g.f * Math.cos(ph); r[2 + 2 * j] = g.f * Math.sin(ph); });
    return r;
  });
  const x = lstsq(A, h);
  const fit = A.map((r) => r.reduce((s, v, j) => s + v * x[j], 0)), residual = h.map((v, i) => v - fit[i]);
  const rms = Math.sqrt(residual.reduce((s, v) => s + v * v, 0) / n);
  const cons = names.map((nm, j) => { const a = x[1 + 2 * j], b = x[2 + 2 * j]; return { name: nm, H: Math.hypot(a, b), G: mod360(Math.atan2(b, a) / D2R), speed: speed(nm) }; });
  return { Z0: x[0], cons, rms, n, hours: (times[n - 1] - times[0]) / 3600000, residual, fit };
}

/** Least squares by Householder QR (columns scaled first). */
export function lstsq(A: Float64Array[], y: number[]): number[] {
  const n = A.length, m = A[0].length, R = A.map((r) => Float64Array.from(r)), b = Float64Array.from(y);
  const sc = new Float64Array(m);
  for (let j = 0; j < m; j++) { let s = 0; for (let i = 0; i < n; i++) s += R[i][j] ** 2; sc[j] = Math.sqrt(s) || 1; for (let i = 0; i < n; i++) R[i][j] /= sc[j]; }
  for (let k = 0; k < m; k++) {
    let nr = 0; for (let i = k; i < n; i++) nr += R[i][k] ** 2; nr = Math.sqrt(nr);
    if (nr < 1e-12) throw new Error('Two constituents cannot be told apart in this record; make it longer or fit fewer.');
    const alpha = R[k][k] > 0 ? -nr : nr, v = new Float64Array(n - k);
    for (let i = k; i < n; i++) v[i - k] = R[i][k]; v[0] -= alpha;
    const vn = v.reduce((s, x) => s + x * x, 0);
    if (vn === 0) continue;
    for (let j = k; j < m; j++) { let s = 0; for (let i = k; i < n; i++) s += v[i - k] * R[i][j]; s = (2 * s) / vn; for (let i = k; i < n; i++) R[i][j] -= s * v[i - k]; }
    let s = 0; for (let i = k; i < n; i++) s += v[i - k] * b[i]; s = (2 * s) / vn; for (let i = k; i < n; i++) b[i] -= s * v[i - k];
  }
  // Condition check on the diagonal of R.
  const diag = Array.from({ length: m }, (_, k) => Math.abs(R[k][k])), dmax = Math.max(...diag);
  if (Math.min(...diag) < 1e-9 * dmax) throw new Error('Two constituents cannot be told apart in this record; make it longer or fit fewer.');
  const x = new Array(m).fill(0);
  for (let k = m - 1; k >= 0; k--) { let s = b[k]; for (let j = k + 1; j < m; j++) s -= R[k][j] * x[j]; x[k] = s / R[k][k]; }
  return x.map((v, j) => v / sc[j]);
}

/** Parse "YYYY-MM-DD HH:MM[:SS]" (or with T, or a date only) as a time at the given UTC offset (hours); ms since 1970 UTC. */
export function parseTime(s: string, offsetH = 0): number {
  const m = s.trim().match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T\s]+(\d{1,2}):(\d{2})(?::(\d{2}(?:\.\d+)?))?)?\s*(Z|UTC)?$/i);
  if (!m) return NaN;
  const [, Y, Mo, D, hh = '0', mi = '0', ss = '0'] = m;
  if (+Mo < 1 || +Mo > 12 || +D < 1 || +D > 31 || +hh > 24 || +mi > 59 || +ss >= 61) return NaN;
  return Date.UTC(+Y, +Mo - 1, +D, +hh, +mi, 0) + Number(ss) * 1000 - offsetH * 3600000;
}

/** A made-up semidiurnal-dominated tide (rounded numbers, no real station). */
export const EXAMPLE: Constituent[] = [
  { name: 'M2', H: 1.2, G: 110 }, { name: 'S2', H: 0.4, G: 140 }, { name: 'N2', H: 0.25, G: 95 }, { name: 'K2', H: 0.11, G: 138 },
  { name: 'K1', H: 0.35, G: 200 }, { name: 'O1', H: 0.25, G: 185 }, { name: 'P1', H: 0.11, G: 198 }, { name: 'Q1', H: 0.05, G: 175 },
  { name: 'M4', H: 0.05, G: 30 },
];

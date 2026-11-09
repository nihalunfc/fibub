// PID loop maths: a plant (first or second order, or any proper transfer function) with dead time, a PID
// controller with a filtered derivative, the closed-loop step response (with an optional load disturbance),
// step-response numbers, the open-loop Bode plot with gain and phase margins, and Ziegler-Nichols starting
// gains. Plain TypeScript, no DOM. Polynomials are highest power first.
import { type Mat, type Cx, zeros, eig, roots, inv, mul, c2d } from './ctl-linalg.ts';

export type TF = { num: number[]; den: number[] };
export type PID = { kp: number; ki: number; kd: number; tf: number; dOnMeasurement?: boolean };
export type Plant = { tf: TF; delay: number };

const trim = (p: number[]) => { const q = p.slice(); while (q.length > 1 && q[0] === 0) q.shift(); return q; };
export const polyMul = (a: number[], b: number[]) => { const r = new Array(a.length + b.length - 1).fill(0); a.forEach((x, i) => b.forEach((y, j) => { r[i + j] += x * y; })); return r; };
export const polyAdd = (a: number[], b: number[]) => { const n = Math.max(a.length, b.length), r = new Array(n).fill(0); a.forEach((x, i) => { r[n - a.length + i] += x; }); b.forEach((x, i) => { r[n - b.length + i] += x; }); return r; };
export const polyVal = (p: number[], s: Cx): Cx => { let re = 0, im = 0; for (const c of p) { const nr = re * s.re - im * s.im + c, ni = re * s.im + im * s.re; re = nr; im = ni; } return { re, im }; };

export const firstOrder = (K: number, tau: number): TF => ({ num: [K], den: [tau, 1] });
export const secondOrder = (K: number, wn: number, zeta: number): TF => ({ num: [K * wn * wn], den: [1, 2 * zeta * wn, wn * wn] });

/** Controllable canonical state-space form of a proper transfer function. */
export function tfToSs(tf: TF): { A: Mat; B: Mat; C: Mat; D: number } {
  const den = trim(tf.den), num = trim(tf.num);
  if (den.every((x) => x === 0)) throw new Error('The denominator is zero.');
  const n = den.length - 1;
  if (num.length - 1 > n) throw new Error('The transfer function has more zeros than poles (improper); add poles or remove zeros.');
  const a = den.map((x) => x / den[0]), b = [...new Array(n + 1 - num.length).fill(0), ...num.map((x) => x / den[0])];
  const A = zeros(n, n), B = zeros(n, 1), C = zeros(1, n);
  for (let j = 0; j < n; j++) A[0][j] = -a[j + 1];
  for (let i = 1; i < n; i++) A[i][i - 1] = 1;
  if (n) B[0][0] = 1;
  for (let j = 0; j < n; j++) C[0][j] = b[j + 1] - a[j + 1] * b[0];
  return { A, B, C, D: b[0] };
}

/** Controller transfer function C(s) = Kp + Ki/s + Kd s/(Tf s + 1) as numerator and denominator. */
export function pidTf(c: PID): TF {
  const hasD = c.kd !== 0, hasI = c.ki !== 0;
  const f = hasD ? [c.tf, 1] : [1];
  let num = polyMul([c.kp], f);
  let den = [1];
  if (hasI) { num = polyAdd(polyMul(num, [1, 0]), polyMul([c.ki], f)); den = [1, 0]; }
  if (hasD) num = polyAdd(num, polyMul([c.kd], hasI ? [1, 0, 0] : [1, 0]));
  den = polyMul(den, f);
  return { num: trim(num), den };
}

/** Padé approximation of e^(−sL) of order m. */
export function pade(L: number, m: number): TF {
  const fact = (k: number) => { let r = 1; for (let i = 2; i <= k; i++) r *= i; return r; };
  const num: number[] = [], den: number[] = [];
  for (let k = m; k >= 0; k--) {
    const c = (fact(2 * m - k) * fact(m)) / (fact(2 * m) * fact(k) * fact(m - k)) * L ** k;
    num.push(c * (k % 2 ? -1 : 1)); den.push(c);
  }
  return { num, den };
}

// ---------- closed loop ----------
type Loop = {
  n: number; nz: number; Ap: Mat; Bp: Mat; Cp: Mat; Dp: number; useI: boolean; useD: boolean; kD: number;
  rTerm: number; g: number; c: PID;
};
function loopParts(plant: TF, c: PID): Loop {
  const { A, B, C, D } = tfToSs(plant);
  const useI = c.ki !== 0, useD = c.kd !== 0;
  if (useD && !(c.tf > 0)) throw new Error('The derivative filter time Tf must be more than 0.');
  const kD = useD ? c.kd / c.tf : 0;
  return { n: A.length, nz: A.length + (useI ? 1 : 0) + (useD ? 1 : 0), Ap: A, Bp: B, Cp: C, Dp: D, useI, useD, kD, rTerm: c.kp + (useD && !c.dOnMeasurement ? kD : 0), g: c.kp + kD, c };
}
/** The loop's derivatives and outputs, given state z, reference r, disturbance d, and the plant's controller input w (u delayed, or u itself when there is no delay: pass null). */
function loopEval(P: Loop, z: number[], r: number, d: number, w: number | null): { dz: number[]; y: number; u: number } {
  const x = z.slice(0, P.n), xi = P.useI ? z[P.n] : 0, xf = P.useD ? z[P.n + (P.useI ? 1 : 0)] : 0;
  const cx = P.Cp[0]?.reduce((s, cc, j) => s + cc * x[j], 0) ?? 0;
  const free = P.rTerm * r + P.c.ki * xi - P.kD * xf; // u = free − g·y
  let y: number, u: number;
  if (w === null) {
    const den = 1 + P.Dp * P.g;
    if (Math.abs(den) < 1e-12) throw new Error('The loop has no solution (1 + D·(Kp + Kd/Tf) = 0).');
    y = (cx + P.Dp * (free + d)) / den; u = free - P.g * y;
  } else { y = cx + P.Dp * (w + d); u = free - P.g * y; }
  const pin = (w === null ? u : w) + d, e = r - y, sD = P.c.dOnMeasurement ? -y : e;
  const dz: number[] = P.Ap.map((row, i) => row.reduce((s, a, j) => s + a * x[j], 0) + P.Bp[i][0] * pin);
  if (P.useI) dz.push(e);
  if (P.useD) dz.push((sD - xf) / P.c.tf);
  return { dz, y, u };
}
/** Closed-loop matrices without dead time: z' = A z + B [r d], y = Cy z + Dy [r d], u = Cu z + Du [r d]. */
export function closedLoop(plant: TF, c: PID) {
  const P = loopParts(plant, c), N = P.nz;
  const base = (z: number[], r: number, d: number) => loopEval(P, z, r, d, null);
  const A = zeros(N, N), B = zeros(N, 2), Cy = zeros(1, N), Cu = zeros(1, N), Dy = zeros(1, 2), Du = zeros(1, 2);
  for (let j = 0; j < N; j++) { const z = new Array(N).fill(0); z[j] = 1; const o = base(z, 0, 0); for (let i = 0; i < N; i++) A[i][j] = o.dz[i]; Cy[0][j] = o.y; Cu[0][j] = o.u; }
  for (let k = 0; k < 2; k++) { const o = base(new Array(N).fill(0), k === 0 ? 1 : 0, k === 1 ? 1 : 0); for (let i = 0; i < N; i++) B[i][k] = o.dz[i]; Dy[0][k] = o.y; Du[0][k] = o.u; }
  return { A, B, Cy, Dy, Cu, Du, P };
}

export type Sim = { t: number[]; y: number[]; u: number[]; r: number[]; h: number; dAt: number };
/**
 * Closed-loop response to a reference step of size `R` at t = 0 and a load disturbance step of size `dist`
 * (added to the plant input) at time `dAt`. Without dead time the loop is discretised exactly (matrix
 * exponential); with dead time it is integrated with RK4 and the delayed controller output is interpolated.
 */
export function simulate(plant: Plant, c: PID, tEnd: number, opts: { R?: number; dist?: number; dAt?: number; steps?: number } = {}): Sim {
  const R = opts.R ?? 1, dist = opts.dist ?? 0, L = Math.max(0, plant.delay);
  let N = opts.steps ?? 2000, h = tEnd / N;
  if (L > 0) {
    // A whole number of steps per dead time, so the delayed jumps land on step boundaries.
    // Also resolve the derivative filter, whose fast transient the dead time passes on to the plant.
    if (c.kd && c.tf > 0) h = Math.min(h, c.tf / 10);
    const m = Math.max(4, Math.ceil(L / h - 1e-9));
    h = L / m; N = Math.min(400000, Math.ceil(tEnd / h - 1e-9));
  }
  const kd = dist && opts.dAt !== undefined ? Math.round(opts.dAt / h) : Infinity;
  const dAt = Number.isFinite(kd) ? kd * h : Infinity;
  const t: number[] = [], y: number[] = [], u: number[] = [], r: number[] = [];
  const dOf = (k: number) => (k >= kd ? dist : 0);
  if (L === 0) {
    const cl = closedLoop(plant.tf, c), Nz = cl.A.length;
    const [Ad, Bd] = Nz ? c2d(cl.A, cl.B, h) : [[], []] as [Mat, Mat];
    let z = new Array(Nz).fill(0);
    for (let k = 0; k <= N; k++) {
      const d = dOf(k);
      t.push(k * h); r.push(R);
      y.push(cl.Cy[0].reduce((s, a, j) => s + a * z[j], 0) + cl.Dy[0][0] * R + cl.Dy[0][1] * d);
      u.push(cl.Cu[0].reduce((s, a, j) => s + a * z[j], 0) + cl.Du[0][0] * R + cl.Du[0][1] * d);
      z = Ad.map((row, i) => row.reduce((s, a, j) => s + a * z[j], 0) + Bd[i][0] * R + Bd[i][1] * d);
    }
    return { t, y, u, r, h, dAt };
  }
  const P = loopParts(plant.tf, c);
  const hist: number[] = [];
  const uAt = (tau: number): number => {
    if (tau < -1e-12 * h) return 0;
    const x = Math.max(0, tau / h), k = Math.floor(x + 1e-9), last = hist.length - 1;
    if (k >= last) return hist[last];
    // Cubic Lagrange through four stored points, kept to t ≥ 0 and to what is already known.
    let k0 = Math.max(0, k - 1); if (k0 + 3 > last) k0 = Math.max(0, last - 3);
    const pts = [k0, k0 + 1, k0 + 2, k0 + 3].filter((i) => i <= last);
    let s = 0;
    for (const i of pts) { let w = 1; for (const j of pts) if (j !== i) w *= (x - j) / (i - j); s += w * hist[i]; }
    return s;
  };
  let z = new Array(P.nz).fill(0);
  // The controller output jumps at t = 0, so the plant input jumps at t = L, a step boundary: a step that
  // ends there must see the value before the jump (0) at all its stages.
  let before = false;
  const f = (zz: number[], tt: number, d: number) => loopEval(P, zz, R, d, before ? 0 : uAt(tt - L)).dz;
  for (let k = 0; k <= N; k++) {
    const tk = k * h, d = dOf(k);
    const o = loopEval(P, z, R, d, uAt(tk - L));
    hist.push(o.u); t.push(tk); y.push(o.y); u.push(o.u); r.push(R);
    if (k === N) break;
    before = tk - L < -1e-6 * h;
    const k1 = f(z, tk, d), z2 = z.map((v, i) => v + (h / 2) * k1[i]);
    const k2 = f(z2, tk + h / 2, d), z3 = z.map((v, i) => v + (h / 2) * k2[i]);
    const k3 = f(z3, tk + h / 2, d), z4 = z.map((v, i) => v + h * k3[i]);
    const k4 = f(z4, tk + h, d);
    z = z.map((v, i) => v + (h / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
  }
  return { t, y, u, r, h, dAt };
}

/** Closed-loop poles (dead time replaced by a Padé approximation of order `padeOrder`) and stability. */
export function closedLoopPoles(plant: Plant, c: PID, padeOrder = 6): { poles: Cx[]; stable: boolean; approx: boolean } {
  const tf = plant.delay > 0 ? (() => { const p = pade(plant.delay, padeOrder); return { num: polyMul(plant.tf.num, p.num), den: polyMul(plant.tf.den, p.den) }; })() : plant.tf;
  const C = pidTf(c);
  const ch = polyAdd(polyMul(C.den, tf.den), polyMul(C.num, tf.num));
  const poles = roots(ch);
  return { poles, stable: poles.every((p) => p.re < -1e-9 * (1 + Math.abs(p.im))), approx: plant.delay > 0 };
}
/** Steady-state output for a unit reference and for a unit load disturbance (dead time does not change these). */
export function dcGains(plant: TF, c: PID): { r: number; d: number } {
  const cl = closedLoop(plant, c);
  if (!cl.A.length) return { r: cl.Dy[0][0], d: cl.Dy[0][1] };
  try {
    const X = mul(inv(cl.A), cl.B); // −A⁻¹B gives the steady state per unit input
    const g = (k: number) => cl.Dy[0][k] - cl.Cy[0].reduce((s, a, j) => s + a * X[j][k], 0);
    return { r: g(0), d: g(1) };
  } catch { return { r: NaN, d: NaN }; }
}

export type StepInfo = { rise: number; settle: number; overshoot: number; peak: number; peakTime: number; final: number; sse: number; undershoot: number };
/**
 * Step-response numbers for a response y(t) to a step of size R, with final value `final`: rise time 10 to
 * 90 %, settling time into ±band (2 % default) of the final value, overshoot and undershoot in % of the final
 * value, peak, and steady-state error R − final. Crossing times are interpolated linearly between samples.
 * Only samples before `until` are used.
 */
export function stepInfo(t: number[], y: number[], final: number, R = 1, band = 0.02, until = Infinity): StepInfo {
  let n = t.findIndex((x) => x >= until); if (n < 0) n = t.length; else n = Math.max(2, n);
  const sg = Math.sign(final) || 1;
  const cross = (level: number) => {
    for (let i = 0; i < n; i++) if (sg * (y[i] - level) >= 0) { if (i === 0) return t[0]; const f = (level - y[i - 1]) / (y[i] - y[i - 1]); return t[i - 1] + f * (t[i] - t[i - 1]); }
    return NaN;
  };
  const rise = cross(0.9 * final) - cross(0.1 * final);
  let settle = NaN;
  if (final !== 0 && Number.isFinite(final)) {
    let last = -1;
    for (let i = 0; i < n; i++) if (Math.abs(y[i] / final - 1) >= band) last = i;
    if (last < 0) settle = t[0];
    else if (last < n - 1) { const lv = final * (1 + band * Math.sign(y[last] / final - 1)); const f = (lv - y[last]) / (y[last + 1] - y[last]); settle = t[last] + Math.max(0, Math.min(1, f)) * (t[last + 1] - t[last]); }
  }
  let pk = 0, pi = 0, mn = 0;
  for (let i = 0; i < n; i++) { if (sg * y[i] > sg * y[pi]) pi = i; if (sg * y[i] < mn) mn = sg * y[i]; }
  pk = y[pi];
  const os = Math.abs(pk) > Math.abs(final) ? (100 * (Math.abs(pk) - Math.abs(final))) / Math.abs(final) : 0;
  return { rise, settle, overshoot: os, peak: pk, peakTime: t[pi], final, sse: R - final * R, undershoot: mn < 0 ? (-100 * mn) / Math.abs(final) : 0 };
}

// ---------- frequency response ----------
export type Freq = { w: number[]; mag: number[]; db: number[]; phase: number[] };
/** Open-loop C(jω)G(jω)e^(−jωL): magnitude and continuous (unwrapped) phase in degrees, from the roots. */
export function openLoopTf(plant: TF, c: PID): TF { const C = pidTf(c); return { num: trim(polyMul(C.num, plant.num)), den: trim(polyMul(C.den, plant.den)) }; }
export function freqResp(tf: TF, delay: number, w: number[]): Freq {
  const num = trim(tf.num), den = trim(tf.den), zs = roots(num), ps = roots(den);
  const lead = num[0] / den[0];
  const arg = (om: number, z: Cx) => (z.re > 0 ? Math.PI - Math.atan2(om - z.im, z.re) : z.re < 0 ? Math.atan2(om - z.im, -z.re) : om > z.im ? Math.PI / 2 : om < z.im ? -Math.PI / 2 : 0);
  const mag: number[] = [], db: number[] = [], phase: number[] = [];
  for (const om of w) {
    const s = { re: 0, im: om }, a = polyVal(num, s), b = polyVal(den, s);
    const m = Math.hypot(a.re, a.im) / Math.hypot(b.re, b.im);
    let ph = lead < 0 ? -Math.PI : 0;
    for (const z of zs) ph += arg(om, z);
    for (const p of ps) ph -= arg(om, p);
    ph -= om * delay;
    mag.push(m); db.push(20 * Math.log10(m)); phase.push((ph * 180) / Math.PI);
  }
  return { w, mag, db, phase };
}
export const logspace = (a: number, b: number, n: number) => Array.from({ length: n }, (_, i) => 10 ** (a + ((b - a) * i) / (n - 1)));
/** A frequency range (rad/s) that covers the corners of the poles, zeros, controller and dead time. */
export function freqRange(tf: TF, delay: number): [number, number] {
  const ms = [...roots(tf.num), ...roots(tf.den)].map((z) => Math.hypot(z.re, z.im)).filter((m) => m > 0);
  if (delay > 0) ms.push(1 / delay);
  if (!ms.length) ms.push(1);
  return [Math.floor(Math.log10(Math.min(...ms))) - 2, Math.ceil(Math.log10(Math.max(...ms))) + 2];
}
export type Margins = { gm: number; gmDb: number; wpc: number; pm: number; wgc: number; gms: { w: number; gm: number }[]; pms: { w: number; pm: number }[] };
/**
 * Gain and phase margins of the open loop, chosen as python-control does: of all phase crossings of −180°
 * (mod 360°) the gain margin closest to 1 (0 dB), and of all gain crossings the smallest |phase margin|.
 * Infinity when there is no crossing.
 */
export function margins(tf: TF, delay: number, range?: [number, number]): Margins {
  const [a, b] = range ?? freqRange(tf, delay);
  const W = logspace(a, b, 6000), F = freqResp(tf, delay, W);
  const one = (w: number) => freqResp(tf, delay, [w]);
  const bisect = (g: (w: number) => number, lo: number, hi: number) => { let glo = g(lo); for (let i = 0; i < 80; i++) { const m = Math.sqrt(lo * hi), gm = g(m); if (Math.sign(gm) === Math.sign(glo)) { lo = m; glo = gm; } else hi = m; } return Math.sqrt(lo * hi); };
  const pms: { w: number; pm: number }[] = [], gms: { w: number; gm: number }[] = [];
  for (let i = 1; i < W.length; i++) {
    if (Math.sign(F.db[i - 1]) !== Math.sign(F.db[i]) && F.db[i - 1] !== 0) {
      const w = bisect((x) => one(x).db[0], W[i - 1], W[i]), ph = one(w).phase[0];
      pms.push({ w, pm: ((((ph % 360) + 360) % 360) - 180) });
    }
    // phase crossing of −180 + k·360: track (phase + 180)/360 crossing an integer
    const p0 = (F.phase[i - 1] + 180) / 360, p1 = (F.phase[i] + 180) / 360;
    if (Math.floor(p0) !== Math.floor(p1) && Math.abs(p1 - p0) < 0.5) {
      const k = Math.max(Math.floor(p0), Math.floor(p1));
      const w = bisect((x) => (one(x).phase[0] + 180) / 360 - k, W[i - 1], W[i]);
      gms.push({ w, gm: 1 / one(w).mag[0] });
    }
  }
  let gm = Infinity, wpc = NaN, pm = Infinity, wgc = NaN;
  for (const g of gms) if (!Number.isFinite(gm) || Math.abs(Math.log(g.gm)) < Math.abs(Math.log(gm))) { gm = g.gm; wpc = g.w; }
  for (const p of pms) if (Math.abs(p.pm) < Math.abs(pm)) { pm = p.pm; wgc = p.w; }
  return { gm, gmDb: 20 * Math.log10(gm), wpc, pm, wgc, gms, pms };
}

// ---------- Ziegler-Nichols ----------
export type ZN = { kind: 'P' | 'PI' | 'PID'; kp: number; ti: number; td: number; ki: number; kd: number };
const zn = (kind: ZN['kind'], kp: number, ti: number, td: number): ZN => ({ kind, kp, ti, td, ki: Number.isFinite(ti) && ti > 0 ? kp / ti : 0, kd: kp * td });
/** Ultimate gain Ku and period Pu: where the plant's phase (with dead time) first reaches −180°. */
export function ultimate(plant: Plant): { ku: number; pu: number; wu: number } | null {
  const [a, b] = freqRange(plant.tf, plant.delay);
  const W = logspace(a, b + 1, 6000), F = freqResp(plant.tf, plant.delay, W);
  for (let i = 1; i < W.length; i++) if (F.phase[i - 1] > -180 && F.phase[i] <= -180) {
    let lo = W[i - 1], hi = W[i];
    for (let k = 0; k < 80; k++) { const m = Math.sqrt(lo * hi); if (freqResp(plant.tf, plant.delay, [m]).phase[0] > -180) lo = m; else hi = m; }
    const wu = Math.sqrt(lo * hi), m = freqResp(plant.tf, plant.delay, [wu]).mag[0];
    return { ku: 1 / m, pu: (2 * Math.PI) / wu, wu };
  }
  return null;
}
/** Ziegler-Nichols closed-loop (ultimate sensitivity) rules. */
export const znUltimate = (ku: number, pu: number): ZN[] => [zn('P', 0.5 * ku, Infinity, 0), zn('PI', 0.45 * ku, pu / 1.2, 0), zn('PID', 0.6 * ku, pu / 2, pu / 8)];
/** Ziegler-Nichols open-loop (reaction curve) rules from a process gain K, lag T and apparent dead time L. */
export const znReaction = (K: number, T: number, L: number): ZN[] => [zn('P', T / (K * L), Infinity, 0), zn('PI', (0.9 * T) / (K * L), L / 0.3, 0), zn('PID', (1.2 * T) / (K * L), 2 * L, 0.5 * L)];
/**
 * Reaction-curve model from the plant's own open-loop step response: the tangent at the steepest point meets
 * 0 at the apparent dead time L and the final value K at L + T. Null when the plant does not settle.
 */
export function reactionCurve(plant: Plant): { K: number; T: number; L: number } | null {
  const K = dcPlant(plant.tf);
  if (!Number.isFinite(K) || K === 0) return null;
  const ps = roots(plant.tf.den);
  if (!ps.every((p) => p.re < 0)) return null;
  const slow = Math.min(...ps.map((p) => -p.re));
  const tEnd = 12 / slow + plant.delay;
  const { A, B, C, D } = tfToSs(plant.tf), N = 6000, h = tEnd / N;
  const [Ad, Bd] = A.length ? c2d(A, B, h) : [[], []] as [Mat, Mat];
  let x = new Array(A.length).fill(0);
  // Output and its exact slope y' = C(Ax + B) at each step (from t = 0+).
  const ys: number[] = [], dys: number[] = [];
  for (let k = 0; k <= N; k++) {
    ys.push((C[0]?.reduce((s, c, j) => s + c * x[j], 0) ?? 0) + D);
    dys.push(C[0]?.reduce((s, c, j) => s + c * (A[j].reduce((t, a, i) => t + a * x[i], 0) + B[j][0]), 0) ?? 0);
    x = Ad.map((row, i) => row.reduce((s, a, j) => s + a * x[j], 0) + Bd[i][0]);
  }
  let best = 0, bi = 0;
  for (let k = 0; k <= N; k++) { const sl = Math.sign(K) * dys[k]; if (sl > best) { best = sl; bi = k; } }
  if (!(best > 0)) return null;
  const slope = Math.sign(K) * best, tm = bi * h + plant.delay, ym = ys[bi];
  const L = tm - ym / slope, T = K / slope;
  if (!(L > 0) || !(T > 0)) return null;
  return { K, T, L };
}
export function dcPlant(tf: TF): number { const n = trim(tf.num), d = trim(tf.den); return n[n.length - 1] / d[d.length - 1]; }

// Reactor point kinetics with six delayed-neutron groups, for study. Solved with a 3-stage Radau IIA implicit
// Runge-Kutta method (order 5, L-stable, suited to the stiff prompt-neutron term) with step-doubling error control.
// Also the prompt-jump approximation and the inhour equation. Plain TypeScript, no DOM.
//
// dn/dt  = (ρ(t) − β)/Λ · n + Σ λᵢ Cᵢ
// dCᵢ/dt = βᵢ/Λ · n − λᵢ Cᵢ

/** Rounded six-group delayed-neutron data for thermal fission of U-235 (common textbook values, rounded; editable). */
export const U235_GROUPS = {
  beta: 0.0065,
  // Relative group abundances βᵢ/β and decay constants λᵢ (1/s).
  a: [0.033, 0.219, 0.196, 0.395, 0.115, 0.042],
  lambda: [0.0124, 0.0305, 0.111, 0.301, 1.14, 3.01],
};

export type Kinetics = { betas: number[]; lambdas: number[]; Lambda: number };
export const betaTotal = (k: Kinetics) => k.betas.reduce((s, b) => s + b, 0);

export type Reactivity =
  | { kind: 'step'; rho: number; scramAt?: number; scramRho?: number }
  | { kind: 'ramp'; rate: number; max: number; scramAt?: number; scramRho?: number };
/** Reactivity (absolute, Δk/k) at time t ≥ 0. Scram adds scramRho (negative) as a step at scramAt. */
export function rhoAt(r: Reactivity, t: number): number {
  let v = r.kind === 'step' ? r.rho : Math.sign(r.max) * Math.min(Math.abs(r.rate * t), Math.abs(r.max));
  if (r.scramAt != null && r.scramRho && t >= r.scramAt) v += r.scramRho;
  return v;
}
/** Times where ρ(t) has a kink or jump, so the solver lands on them exactly. */
export function breaks(r: Reactivity): number[] {
  const out: number[] = [];
  if (r.kind === 'ramp' && r.rate) out.push(Math.abs(r.max / r.rate));
  if (r.scramAt != null && r.scramRho) out.push(r.scramAt);
  return out.filter((x) => x > 0 && Number.isFinite(x));
}

/** Equilibrium state for power n0: Cᵢ = βᵢ n0 / (λᵢ Λ). */
export function equilibrium(k: Kinetics, n0 = 1): number[] {
  return [n0, ...k.betas.map((b, i) => (b * n0) / (k.lambdas[i] * k.Lambda))];
}

function jac(k: Kinetics, rho: number): number[][] {
  const m = k.betas.length + 1, A = Array.from({ length: m }, () => new Array(m).fill(0)), beta = betaTotal(k);
  A[0][0] = (rho - beta) / k.Lambda;
  k.betas.forEach((b, i) => { A[0][i + 1] = k.lambdas[i]; A[i + 1][0] = b / k.Lambda; A[i + 1][i + 1] = -k.lambdas[i]; });
  return A;
}
function solveLin(M: number[][], b: number[]): number[] {
  const n = b.length, A = M.map((r, i) => [...r, b[i]]);
  for (let c = 0; c < n; c++) {
    let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
    [A[c], A[p]] = [A[p], A[c]];
    const d = A[c][c];
    for (let r = c + 1; r < n; r++) { const f = A[r][c] / d; if (f) for (let j = c; j <= n; j++) A[r][j] -= f * A[c][j]; }
  }
  const x = new Array(n).fill(0);
  for (let r = n - 1; r >= 0; r--) { let s = A[r][n]; for (let j = r + 1; j < n; j++) s -= A[r][j] * x[j]; x[r] = s / A[r][r]; }
  return x;
}

// Radau IIA, 3 stages.
const S6 = Math.sqrt(6);
const RC = [(4 - S6) / 10, (4 + S6) / 10, 1];
const RA = [
  [(88 - 7 * S6) / 360, (296 - 169 * S6) / 1800, (-2 + 3 * S6) / 225],
  [(296 + 169 * S6) / 1800, (88 + 7 * S6) / 360, (-2 - 3 * S6) / 225],
  [(16 - S6) / 36, (16 + S6) / 36, 1 / 9],
];
/** One Radau IIA step of the linear system y' = A(t) y. */
export function radauStep(k: Kinetics, r: Reactivity, t: number, y: number[], h: number): number[] {
  const m = y.length, Js = RC.map((c) => jac(k, rhoAt(r, t + c * h)));
  // Unknowns: stage slopes K_1..K_3 (each m long). K_i = J_i (y + h Σ_j a_ij K_j).
  const N = 3 * m, M = Array.from({ length: N }, () => new Array(N).fill(0)), rhs = new Array(N).fill(0);
  for (let i = 0; i < 3; i++) for (let p = 0; p < m; p++) {
    const row = i * m + p;
    M[row][row] += 1;
    for (let q = 0; q < m; q++) {
      const Jpq = Js[i][p][q]; if (!Jpq) continue;
      rhs[row] += Jpq * y[q];
      for (let j = 0; j < 3; j++) M[row][j * m + q] -= h * RA[i][j] * Jpq;
    }
  }
  const K = solveLin(M, rhs);
  // Radau IIA is stiffly accurate: y_{n+1} = y_n + h Σ b_j K_j with b = last row of A.
  return y.map((v, p) => v + h * (RA[2][0] * K[p] + RA[2][1] * K[m + p] + RA[2][2] * K[2 * m + p]));
}

export type Sim = { t: number[]; n: number[]; rho: number[]; C: number[][]; steps: number; stopped?: number };
/**
 * Integrate from 0 to tEnd and report at `out` evenly spaced times (plus the start). Step-doubling keeps the
 * estimated relative error of every step below tol.
 */
export function simulate(k: Kinetics, r: Reactivity, tEnd: number, opts: { out?: number; tol?: number; n0?: number; log?: boolean; at?: number[] } = {}): Sim {
  const outN = opts.out ?? 400, tol = opts.tol ?? 1e-8;
  let y = equilibrium(k, opts.n0 ?? 1), t = 0, h = Math.min(1e-4, tEnd / 100), steps = 0;
  const marks = opts.log ? Array.from({ length: outN }, (_, i) => tEnd * 10 ** (-4 + (4 * (i + 1)) / outN)) : Array.from({ length: outN }, (_, i) => (tEnd * (i + 1)) / outN);
  marks.push(...(opts.at ?? []).filter((x) => x > 0 && x <= tEnd));
  const stops = [...new Set([...marks, ...breaks(r).filter((b) => b < tEnd)])].sort((a, b) => a - b);
  const res: Sim = { t: [0], n: [y[0]], rho: [rhoAt(r, 0)], C: [y.slice(1)], steps: 0 };
  const isMark = new Set(marks);
  for (const stop of stops) {
    while (t < stop - 1e-15 * Math.max(1, stop)) {
      const hh = Math.min(h, stop - t);
      const big = radauStep(k, r, t, y, hh), half = radauStep(k, r, t + hh / 2, radauStep(k, r, t, y, hh / 2), hh / 2);
      let err = 0;
      for (let p = 0; p < y.length; p++) err = Math.max(err, Math.abs(big[p] - half[p]) / (Math.abs(half[p]) + 1e-30 + 1e-12 * Math.abs(y[0])));
      err /= 31; // order 5: the half-step result's error is about (big − half)/(2^5 − 1)
      steps++;
      if (err <= tol || hh < 1e-12) {
        // Richardson extrapolation of the two results.
        y = half.map((v, p) => v + (v - big[p]) / 31); t += hh;
        h = hh * Math.min(4, Math.max(0.2, 0.9 * (tol / Math.max(err, 1e-300)) ** (1 / 6)));
        if (steps > 2e6) throw new Error('too many steps');
      } else h = hh * Math.max(0.1, 0.9 * (tol / err) ** (1 / 6));
    }
    t = stop;
    if (!(Math.abs(y[0]) < 1e60)) { res.stopped = t; break; } // runaway: stop before the numbers overflow
    if (isMark.has(stop)) { res.t.push(t); res.n.push(y[0]); res.rho.push(rhoAt(r, t)); res.C.push(y.slice(1)); }
  }
  res.steps = steps;
  return res;
}

/** Prompt-jump approximation: just after a step from critical to ρ (< β), n jumps to β/(β − ρ) of its value. */
export const promptJump = (beta: number, rho: number) => (rho < beta ? beta / (beta - rho) : Infinity);

/** The inhour equation's right side: ρ(ω) = ωΛ + Σ βᵢ ω / (ω + λᵢ). */
export const inhour = (k: Kinetics, w: number) => w * k.Lambda + k.betas.reduce((s, b, i) => s + (b * w) / (w + k.lambdas[i]), 0);

/**
 * All roots ω of ρ = ωΛ + Σ βᵢ ω/(ω + λᵢ), largest first. The largest gives the stable period T = 1/ω.
 * ρ(ω) rises on every branch between the poles −λᵢ, so each branch holds exactly one root.
 */
export function inhourRoots(k: Kinetics, rho: number): number[] {
  const lam = [...k.lambdas].sort((a, b) => b - a), eps = 1e-12;
  const f = (w: number) => inhour(k, w) - rho;
  const bis = (a: number, b: number) => { // f(a) < 0 < f(b)
    for (let i = 0; i < 300; i++) { const m = (a + b) / 2; if (f(m) < 0) a = m; else b = m; if (b - a <= 1e-15 * Math.max(1, Math.abs(m))) break; }
    return (a + b) / 2;
  };
  const roots: number[] = [];
  // Rightmost branch (−λ_min, ∞).
  const lmin = lam[lam.length - 1];
  let hi = 1; while (f(hi) < 0) hi *= 2;
  roots.push(bis(-lmin + eps * lmin, hi));
  // Branches between consecutive poles, and the leftmost (−∞, −λ_max).
  const poles = [...lam].sort((a, b) => a - b); // ascending λ: poles at −λ descending
  for (let i = 0; i < poles.length - 1; i++) { const a = -poles[i + 1], b = -poles[i]; roots.push(bis(a + eps * Math.abs(a), b - eps * Math.abs(b))); }
  let lo = -poles[poles.length - 1] - 1; while (f(lo) > 0) lo = -poles[poles.length - 1] - 2 * (Math.abs(lo) - poles[poles.length - 1]) - 1;
  roots.push(bis(lo, -poles[poles.length - 1] - eps * poles[poles.length - 1]));
  return roots.sort((a, b) => b - a);
}

/** Reactivity in absolute units from dollars, cents or pcm. */
export function toRho(v: number, unit: 'dollar' | 'cent' | 'pcm' | 'dk', beta: number) {
  return unit === 'dollar' ? v * beta : unit === 'cent' ? (v / 100) * beta : unit === 'pcm' ? v * 1e-5 : v;
}

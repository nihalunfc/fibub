// Ordinary differential equations typed as text, solved in the browser: RK4 with a fixed step and the adaptive
// Dormand-Prince 5(4) pair (the same steps, error control and dense output as SciPy's solve_ivp "RK45"),
// equilibria with their Jacobian eigenvalues, nullclines, a parameter sweep (bifurcation diagram), and explicit
// finite-difference solvers for the 1D heat and wave equations. Plain TypeScript, no DOM.
import { parse, compile, variables, ExprError } from './expr.ts';

export type Fn = (t: number, y: ArrayLike<number>) => number[];
export type Sys = {
  vars: string[];
  params: { name: string; value: number; text: string }[];
  rhs: string[];
  /** Right-hand side with the parameter values given (default: the typed ones). */
  make: (values?: Record<string, number>) => Fn;
};

const ID = '[A-Za-z_Ͱ-Ͽ][A-Za-z0-9_Ͱ-Ͽ]*';
const RE_PRIME = new RegExp(`^(${ID})\\s*['’′]\\s*=(.*)$`);
const RE_DDT = new RegExp(`^d\\s*(${ID})\\s*/\\s*dt\\s*=(.*)$`);
const RE_PAR = new RegExp(`^(${ID})\\s*=(.*)$`);

/** Read a system: lines like "x' = y" or "dx/dt = y" are equations; "a = 0.5" lines are parameters. */
export function parseSystem(text: string): Sys {
  const eqs: { v: string; src: string; line: number }[] = [], pars: { name: string; src: string; line: number }[] = [];
  text.split(/\r?\n/).forEach((raw, i) => {
    const s = raw.replace(/(#|\/\/).*$/, '').trim();
    if (!s) return;
    let m = RE_PRIME.exec(s) || RE_DDT.exec(s);
    if (m) { eqs.push({ v: m[1], src: m[2], line: i + 1 }); return; }
    m = RE_PAR.exec(s);
    if (m) { pars.push({ name: m[1], src: m[2], line: i + 1 }); return; }
    throw new Error(`Line ${i + 1} is not an equation. Write it as x' = ... (or dx/dt = ...), or a parameter as a = 0.5.`);
  });
  if (!eqs.length) throw new Error("Type at least one equation, such as x' = -x.");
  if (eqs.length > 12) throw new Error('This tool takes up to 12 equations.');
  const vars = eqs.map((e) => e.v);
  for (const v of vars) if (vars.indexOf(v) !== vars.lastIndexOf(v)) throw new Error(`${v}' is given twice.`);
  if (vars.includes('t')) throw new Error('t is the time, so it cannot be a variable name.');
  const params: Sys['params'] = [];
  for (const p of pars) {
    if (vars.includes(p.name)) throw new Error(`Line ${p.line}: ${p.name} is a variable; its start value is set below the equations.`);
    if (p.name === 't') throw new Error(`Line ${p.line}: t is the time, so it cannot be a parameter.`);
    if (params.some((q) => q.name === p.name)) throw new Error(`Line ${p.line}: the parameter ${p.name} is given twice.`);
    let node;
    try { node = parse(p.src); } catch (e) { throw new Error(`Line ${p.line} (${p.name}): ${(e as Error).message}.`); }
    const used = variables(node), names = params.map((q) => q.name);
    const bad = used.find((u) => !names.includes(u));
    if (bad) throw new Error(`Line ${p.line}: ${p.name} uses ${bad}, which is not a parameter given above it.`);
    const value = compile(node, names)(params.map((q) => q.value));
    if (!Number.isFinite(value)) throw new Error(`Line ${p.line}: ${p.name} is not a finite number.`);
    params.push({ name: p.name, value, text: p.src.trim() });
  }
  const names = ['t', ...vars, ...params.map((p) => p.name)];
  const fns = eqs.map((e) => {
    let node;
    try { node = parse(e.src); } catch (err) { throw new Error(`Line ${e.line} (${e.v}'): ${(err as ExprError).message}.`); }
    const bad = variables(node).find((u) => !names.includes(u));
    if (bad) throw new Error(`Line ${e.line}: ${e.v}' uses ${bad}, which is not a variable, t, or a parameter. Add a line like ${bad} = 1.`);
    return compile(node, names);
  });
  const n = vars.length, m = params.length;
  const make = (values: Record<string, number> = {}): Fn => {
    const v = new Float64Array(1 + n + m);
    params.forEach((p, i) => { v[1 + n + i] = values[p.name] ?? p.value; });
    return (t, y) => {
      v[0] = t;
      for (let i = 0; i < n; i++) v[1 + i] = y[i];
      const out = new Array<number>(n);
      for (let i = 0; i < n; i++) out[i] = fns[i](v);
      return out;
    };
  };
  return { vars, params, rhs: eqs.map((e) => e.src.trim()), make };
}

export type Solution = {
  t: number[]; y: number[][]; steps: number; rejected: number; evals: number;
  /** Set when the solution stopped early (blew up or the step became too small). */
  stopped?: string;
  minStep: number; maxStep: number;
};

const finiteAll = (y: ArrayLike<number>) => { for (let i = 0; i < y.length; i++) if (!Number.isFinite(y[i])) return false; return true; };
const BIG = 1e12;
const tooBig = (y: ArrayLike<number>) => { for (let i = 0; i < y.length; i++) if (Math.abs(y[i]) > BIG) return true; return false; };

/** Classic fourth-order Runge-Kutta with `steps` equal steps. */
export function rk4(f: Fn, t0: number, y0: number[], t1: number, steps: number): Solution {
  const h = (t1 - t0) / steps, n = y0.length;
  const T = [t0], Y = [y0.slice()];
  let y = y0.slice(), stopped: string | undefined;
  for (let k = 0; k < steps; k++) {
    const t = t0 + k * h;
    const k1 = f(t, y);
    const k2 = f(t + h / 2, y.map((v, i) => v + (h / 2) * k1[i]));
    const k3 = f(t + h / 2, y.map((v, i) => v + (h / 2) * k2[i]));
    const k4 = f(t + h, y.map((v, i) => v + h * k3[i]));
    const yn = new Array<number>(n);
    for (let i = 0; i < n; i++) yn[i] = y[i] + (h / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]);
    if (!finiteAll(yn) || tooBig(yn)) { stopped = `The solution blew up (grew past 10¹² or became undefined) near t = ${+(t + h).toPrecision(4)}.`; break; }
    y = yn; T.push(k === steps - 1 ? t1 : t0 + (k + 1) * h); Y.push(y);
  }
  return { t: T, y: Y, steps: T.length - 1, rejected: 0, evals: 4 * (T.length - 1), stopped, minStep: Math.abs(h), maxStep: Math.abs(h) };
}

// Dormand-Prince 5(4) coefficients, with Shampine's dense output (as SciPy's RK45).
const DP_C = [0, 1 / 5, 3 / 10, 4 / 5, 8 / 9, 1];
const DP_A = [[], [1 / 5], [3 / 40, 9 / 40], [44 / 45, -56 / 15, 32 / 9], [19372 / 6561, -25360 / 2187, 64448 / 6561, -212 / 729], [9017 / 3168, -355 / 33, 46732 / 5247, 49 / 176, -5103 / 18656]];
const DP_B = [35 / 384, 0, 500 / 1113, 125 / 192, -2187 / 6784, 11 / 84];
const DP_E = [-71 / 57600, 0, 71 / 16695, -71 / 1920, 17253 / 339200, -22 / 525, 1 / 40];
const DP_P = [
  [1, -8048581381 / 2820520608, 8663915743 / 2820520608, -12715105075 / 11282082432],
  [0, 0, 0, 0],
  [0, 131558114200 / 32700410799, -68118460800 / 10900136933, 87487479700 / 32700410799],
  [0, -1754552775 / 470086768, 14199869525 / 1410260304, -10690763975 / 1880347072],
  [0, 127303824393 / 49829197408, -318862633887 / 49829197408, 701980252875 / 199316789632],
  [0, -282668133 / 205662961, 2019193451 / 616988883, -1453857185 / 822651844],
  [0, 40617522 / 29380423, -110615467 / 29380423, 69997945 / 29380423],
];
const rms = (v: number[]) => Math.sqrt(v.reduce((s, x) => s + x * x, 0) / v.length);

export type Rk45Opts = { rtol?: number; atol?: number; maxStep?: number; maxSteps?: number; tEval?: number[] };

/**
 * Adaptive Dormand-Prince 5(4), step for step the algorithm of SciPy's solve_ivp(method="RK45"): same first-step
 * choice, error norm and step-size controller. `t`/`y` are the accepted steps, or the solution at `tEval`
 * (from the dense output) when that is given.
 */
export function rk45(f: Fn, t0: number, y0: number[], t1: number, o: Rk45Opts = {}): Solution {
  const rtol = Math.max(o.rtol ?? 1e-3, 100 * Number.EPSILON), atol = o.atol ?? 1e-6, maxStep = o.maxStep ?? Infinity, maxSteps = o.maxSteps ?? 200000;
  const n = y0.length, dir = t1 >= t0 ? 1 : -1, len = Math.abs(t1 - t0);
  let t = t0, y = y0.slice(), fy = f(t, y), evals = 1;
  // First step (Hairer, Norsett and Wanner, II.4), as scipy select_initial_step with order 4.
  let hAbs: number;
  {
    const scale = y.map((v) => atol + Math.abs(v) * rtol);
    const d0 = rms(y.map((v, i) => v / scale[i])), d1 = rms(fy.map((v, i) => v / scale[i]));
    let h0 = d0 < 1e-5 || d1 < 1e-5 ? 1e-6 : 0.01 * d0 / d1;
    h0 = Math.min(h0, len);
    const f1 = f(t + h0 * dir, y.map((v, i) => v + h0 * dir * fy[i])); evals++;
    const d2 = rms(f1.map((v, i) => (v - fy[i]) / scale[i])) / h0;
    const h1 = d1 <= 1e-15 && d2 <= 1e-15 ? Math.max(1e-6, h0 * 1e-3) : (0.01 / Math.max(d1, d2)) ** (1 / 5);
    hAbs = Math.min(100 * h0, h1, len, maxStep);
  }
  const T = [t], Y = [y.slice()];
  const ev = o.tEval ? o.tEval.slice() : null;
  let ei = 0;
  const outT: number[] = [], outY: number[][] = [];
  if (ev) while (ei < ev.length && (ev[ei] - t0) * dir <= 0) { if (ev[ei] === t0) { outT.push(t0); outY.push(y.slice()); } ei++; }
  let steps = 0, rejected = 0, stopped: string | undefined, minH = Infinity, maxH = 0;
  const K: number[][] = Array.from({ length: 7 }, () => new Array<number>(n).fill(0));
  while ((t - t1) * dir < 0) {
    if (steps >= maxSteps) { stopped = `Stopped after ${maxSteps.toLocaleString('en')} steps at t = ${+t.toPrecision(4)}. The equations may be stiff, or the time span too long.`; break; }
    const tiny = 10 * Math.abs(nextAfter(t, dir) - t);
    let h = 0, yNew: number[] = [], fNew: number[] = [], accepted = false, wasRejected = false;
    if (hAbs > maxStep) hAbs = maxStep; else if (hAbs < tiny) hAbs = tiny;
    while (!accepted) {
      if (hAbs < tiny) { stopped = `The step size became too small at t = ${+t.toPrecision(6)}: the solution may blow up there.`; break; }
      let tNew = t + hAbs * dir;
      if ((tNew - t1) * dir > 0) tNew = t1;
      h = tNew - t; hAbs = Math.abs(h);
      K[0] = fy;
      for (let s = 1; s < 6; s++) {
        const a = DP_A[s], ys = new Array<number>(n);
        for (let i = 0; i < n; i++) { let d = 0; for (let j = 0; j < s; j++) d += a[j] * K[j][i]; ys[i] = y[i] + h * d; }
        K[s] = f(t + DP_C[s] * h, ys);
      }
      yNew = new Array<number>(n);
      for (let i = 0; i < n; i++) { let d = 0; for (let j = 0; j < 6; j++) d += DP_B[j] * K[j][i]; yNew[i] = y[i] + h * d; }
      fNew = f(t + h, yNew); K[6] = fNew; evals += 6;
      const errv = new Array<number>(n);
      for (let i = 0; i < n; i++) { let e = 0; for (let j = 0; j < 7; j++) e += DP_E[j] * K[j][i]; errv[i] = (e * h) / (atol + Math.max(Math.abs(y[i]), Math.abs(yNew[i])) * rtol); }
      const en = rms(errv);
      if (en < 1) {
        let factor = en === 0 ? 10 : Math.min(10, 0.9 * en ** (-1 / 5));
        if (wasRejected) factor = Math.min(1, factor);
        hAbs *= factor; accepted = true;
      } else if (Number.isFinite(en)) {
        hAbs *= Math.max(0.2, 0.9 * en ** (-1 / 5)); wasRejected = true; rejected++;
      } else { hAbs *= 0.2; wasRejected = true; rejected++; }
    }
    if (!accepted) break;
    if (!finiteAll(yNew) || tooBig(yNew)) { stopped = `The solution blew up (grew past 10¹² or became undefined) near t = ${+(t + h).toPrecision(4)}.`; break; }
    if (ev) {
      // Shampine's quartic interpolant on this step.
      const tOld = t, Q = Array.from({ length: n }, (_, i) => [0, 1, 2, 3].map((k) => { let s = 0; for (let j = 0; j < 7; j++) s += K[j][i] * DP_P[j][k]; return s; }));
      while (ei < ev.length && (ev[ei] - (t + h)) * dir <= 0) {
        const x = (ev[ei] - tOld) / h, p = [x, x * x, x * x * x, x * x * x * x];
        outT.push(ev[ei]); outY.push(y.map((v, i) => v + h * (Q[i][0] * p[0] + Q[i][1] * p[1] + Q[i][2] * p[2] + Q[i][3] * p[3])));
        ei++;
      }
    }
    minH = Math.min(minH, Math.abs(h)); maxH = Math.max(maxH, Math.abs(h));
    t = t + h; y = yNew; fy = fNew; steps++;
    if (!ev) { T.push(t); Y.push(y); }
  }
  return { t: ev ? outT : T, y: ev ? outY : Y, steps, rejected, evals, stopped, minStep: minH, maxStep: maxH };
}

function nextAfter(x: number, dir: number): number {
  if (x === 0) return dir * Number.MIN_VALUE;
  const b = new Float64Array([x]), u = new BigInt64Array(b.buffer);
  u[0] += (x > 0) === (dir > 0) ? 1n : -1n;
  return b[0];
}

// ---------- Linear algebra ----------

/** Jacobian by central differences. */
export function jacobian(f: Fn, t: number, x: number[]): number[][] {
  const n = x.length, J = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  for (let j = 0; j < n; j++) {
    const h = 1e-6 * Math.max(1, Math.abs(x[j]));
    const xp = x.slice(), xm = x.slice(); xp[j] += h; xm[j] -= h;
    const fp = f(t, xp), fm = f(t, xm);
    for (let i = 0; i < n; i++) J[i][j] = (fp[i] - fm[i]) / (2 * h);
  }
  return J;
}

function solveLinear(A: number[][], b: number[]): number[] | null {
  const n = b.length, M = A.map((r, i) => [...r, b[i]]);
  for (let c = 0; c < n; c++) {
    let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    if (!(Math.abs(M[p][c]) > 1e-300)) return null;
    [M[c], M[p]] = [M[p], M[c]];
    for (let r = c + 1; r < n; r++) { const k = M[r][c] / M[c][c]; for (let j = c; j <= n; j++) M[r][j] -= k * M[c][j]; }
  }
  const x = new Array<number>(n).fill(0);
  for (let r = n - 1; r >= 0; r--) { let s = M[r][n]; for (let j = r + 1; j < n; j++) s -= M[r][j] * x[j]; x[r] = s / M[r][r]; }
  return x;
}

export type C = [number, number];
/** Eigenvalues of a real square matrix: characteristic polynomial (Faddeev-LeVerrier), roots by Aberth's method, then polished. */
export function eigenvalues(A: number[][]): C[] {
  const n = A.length;
  if (n === 1) return [[A[0][0], 0]];
  if (n === 2) {
    const tr = A[0][0] + A[1][1], det = A[0][0] * A[1][1] - A[0][1] * A[1][0], disc = tr * tr / 4 - det;
    if (disc >= 0) { const s = Math.sqrt(disc), r1 = tr / 2 + Math.sign(tr || 1) * s, r2 = r1 !== 0 ? det / r1 : tr / 2 - s; return [[r1, 0], [r2, 0]].sort((a, b) => b[0] - a[0]) as C[]; }
    const s = Math.sqrt(-disc); return [[tr / 2, s], [tr / 2, -s]];
  }
  // Faddeev-LeVerrier: p(λ) = λⁿ + c1 λⁿ⁻¹ + ... + cn.
  const c = [1]; let M = A.map((r) => r.map(() => 0));
  for (let k = 1; k <= n; k++) {
    const AM = A.map((r, i) => r.map((_, j) => { let s = 0; for (let l = 0; l < n; l++) s += A[i][l] * M[l][j]; return s; }));
    for (let i = 0; i < n; i++) AM[i][i] += c[k - 1];
    M = AM;
    const AMk = A.map((r, i) => r.map((_, j) => { let s = 0; for (let l = 0; l < n; l++) s += A[i][l] * M[l][j]; return s; }));
    let tr = 0; for (let i = 0; i < n; i++) tr += AMk[i][i];
    c.push(-tr / k);
  }
  return polyRoots(c);
}

const cm = (a: C, b: C): C => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const cd = (a: C, b: C): C => { const d = b[0] * b[0] + b[1] * b[1]; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; };
/** All roots of a monic-or-not real polynomial c0 xⁿ + c1 xⁿ⁻¹ + ... (Aberth-Ehrlich). */
export function polyRoots(c: number[]): C[] {
  const n = c.length - 1, a = c.map((v) => v / c[0]);
  const ev = (z: C): [C, C] => { let p: C = [1, 0], d: C = [0, 0]; for (let i = 1; i <= n; i++) { d = [d[0] * z[0] - d[1] * z[1] + p[0], d[0] * z[1] + d[1] * z[0] + p[1]]; p = cm(p, z); p[0] += a[i]; } return [p, d]; };
  const R = 1 + Math.max(...a.slice(1).map(Math.abs));
  let z: C[] = Array.from({ length: n }, (_, k) => [R * 0.9 * Math.cos(2 * Math.PI * k / n + 0.4), R * 0.9 * Math.sin(2 * Math.PI * k / n + 0.4)]);
  for (let it = 0; it < 800; it++) {
    let move = 0;
    z = z.map((zk, k) => {
      const [p, d] = ev(zk);
      if (p[0] === 0 && p[1] === 0) return zk;
      const r = cd(p, d);
      let s: C = [0, 0];
      for (let j = 0; j < n; j++) if (j !== k) { const q = cd([1, 0], [zk[0] - z[j][0], zk[1] - z[j][1]]); s = [s[0] + q[0], s[1] + q[1]]; }
      const w = cd(r, [1 - (r[0] * s[0] - r[1] * s[1]), -(r[0] * s[1] + r[1] * s[0])]);
      move = Math.max(move, Math.hypot(w[0], w[1]) / Math.max(1, Math.hypot(zk[0], zk[1])));
      return [zk[0] - w[0], zk[1] - w[1]];
    });
    if (move < 1e-15) break;
  }
  // Real coefficients: tidy tiny imaginary parts.
  return z.map((r) => [r[0], Math.abs(r[1]) < 1e-9 * Math.max(1, Math.abs(r[0])) ? 0 : r[1]] as C).sort((p, q) => q[0] - p[0] || q[1] - p[1]);
}

export type Eq = { x: number[]; eig: C[]; kind: string; stable: boolean | null };

/** What an equilibrium is, from the eigenvalues of its Jacobian. */
export function classify(eig: C[]): { kind: string; stable: boolean | null } {
  const scale = Math.max(1, ...eig.map((e) => Math.hypot(e[0], e[1])));
  const tol = 1e-7 * scale;
  const pos = eig.filter((e) => e[0] > tol).length, neg = eig.filter((e) => e[0] < -tol).length, zero = eig.length - pos - neg;
  const cplx = eig.some((e) => Math.abs(e[1]) > tol);
  if (zero) {
    if (eig.length === 2 && cplx && zero === 2) return { kind: 'centre (linear test only: the nonlinear terms decide)', stable: null };
    return { kind: pos ? 'unstable, not hyperbolic (an eigenvalue is 0)' : 'not hyperbolic (an eigenvalue is 0): the linear test cannot decide', stable: pos ? false : null };
  }
  if (eig.length === 1) return pos ? { kind: 'unstable (repelling)', stable: false } : { kind: 'stable (attracting)', stable: true };
  if (!pos) return { kind: cplx ? 'stable spiral (focus)' : 'stable node', stable: true };
  if (!neg) return { kind: cplx ? 'unstable spiral (focus)' : 'unstable node', stable: false };
  return { kind: cplx ? 'saddle-focus (unstable)' : 'saddle (unstable)', stable: false };
}

/** Newton's method with a simple backtracking line search. */
export function newton(f: Fn, t: number, x0: number[], iters = 60): number[] | null {
  let x = x0.slice(), F = f(t, x), nF = Math.hypot(...F);
  for (let k = 0; k < iters; k++) {
    if (!Number.isFinite(nF)) return null;
    if (nF < 1e-12 * Math.max(1, Math.hypot(...x))) break;
    const dx = solveLinear(jacobian(f, t, x), F.map((v) => -v));
    if (!dx || !finiteAll(dx)) return null;
    let lam = 1, xn = x, Fn = F, nn = Infinity;
    for (let b = 0; b < 30; b++) { xn = x.map((v, i) => v + lam * dx[i]); Fn = f(t, xn); nn = Math.hypot(...Fn); if (nn < nF || !Number.isFinite(nF)) break; lam /= 2; }
    if (!(nn < nF)) break;
    x = xn; F = Fn; nF = nn;
  }
  return nF < 1e-8 * Math.max(1, Math.hypot(...x)) && finiteAll(x) ? x : null;
}

/** Equilibria found by Newton from many starting points, without duplicates, each with its eigenvalues. */
export function equilibria(f: Fn, starts: number[][], t = 0, limit = 30): Eq[] {
  const out: Eq[] = [];
  for (const s of starts) {
    const x = newton(f, t, s);
    if (!x) continue;
    const xr = x.map((v) => (Math.abs(v) < 1e-11 ? 0 : v));
    if (out.some((e) => e.x.every((v, i) => Math.abs(v - xr[i]) <= 1e-6 * Math.max(1, Math.abs(v))))) continue;
    const eig = eigenvalues(jacobian(f, t, xr));
    out.push({ x: xr, eig, ...classify(eig) });
    if (out.length >= limit) break;
  }
  return out.sort((a, b) => a.x[0] - b.x[0] || (a.x[1] ?? 0) - (b.x[1] ?? 0));
}

/** Starting points: a grid over the two plotted variables, others held at `base`. */
export function gridStarts(base: number[], ix: number, iy: number, x0: number, x1: number, y0: number, y1: number, k = 9): number[][] {
  const out: number[][] = [];
  for (let a = 0; a < k; a++) for (let b = 0; b < k; b++) {
    const s = base.slice();
    s[ix] = x0 + ((a + 0.5) / k) * (x1 - x0);
    if (iy >= 0) s[iy] = y0 + ((b + 0.5) / k) * (y1 - y0); else if (b) continue;
    out.push(s);
  }
  return out;
}

/** Zero contour of g on a grid (marching squares). Segments as [x1, y1, x2, y2]. */
export function zeroContour(g: (x: number, y: number) => number, x0: number, x1: number, y0: number, y1: number, nx = 120, ny = 120): number[][] {
  const v: number[][] = [];
  for (let j = 0; j <= ny; j++) { const row: number[] = []; for (let i = 0; i <= nx; i++) row.push(g(x0 + (i / nx) * (x1 - x0), y0 + (j / ny) * (y1 - y0))); v.push(row); }
  const X = (i: number) => x0 + (i / nx) * (x1 - x0), Y = (j: number) => y0 + (j / ny) * (y1 - y0);
  const segs: number[][] = [];
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const a = v[j][i], b = v[j][i + 1], c = v[j + 1][i + 1], d = v[j + 1][i];
    if (![a, b, c, d].every(Number.isFinite)) continue;
    // Points where the sign changes along each edge.
    const pts: [number, number][] = [];
    const edge = (p: number, q: number, xa: number, ya: number, xb: number, yb: number) => {
      if ((p < 0) !== (q < 0)) { const s = p / (p - q); pts.push([xa + s * (xb - xa), ya + s * (yb - ya)]); }
    };
    edge(a, b, X(i), Y(j), X(i + 1), Y(j));
    edge(b, c, X(i + 1), Y(j), X(i + 1), Y(j + 1));
    edge(c, d, X(i + 1), Y(j + 1), X(i), Y(j + 1));
    edge(d, a, X(i), Y(j + 1), X(i), Y(j));
    // Skip a jump through infinity (like 1/x), not a zero: the values on both sides are large.
    const big = Math.max(Math.abs(a), Math.abs(b), Math.abs(c), Math.abs(d)), med = [a, b, c, d].map(Math.abs).sort((p, q) => p - q)[1];
    if (pts.length && big > 1e6 && med > 1e5) continue;
    if (pts.length === 2) segs.push([...pts[0], ...pts[1]]);
    else if (pts.length === 4) {
      const m = (a + b + c + d) / 4;
      if ((m < 0) === (a < 0)) { segs.push([...pts[0], ...pts[1]], [...pts[2], ...pts[3]]); } else { segs.push([...pts[0], ...pts[3]], [...pts[1], ...pts[2]]); }
    }
  }
  return segs;
}

/** Local maxima of a sampled series, refined by a parabola through each peak and its neighbours. */
export function localMaxima(y: number[]): number[] {
  const out: number[] = [];
  for (let i = 1; i < y.length - 1; i++) if (y[i] > y[i - 1] && y[i] >= y[i + 1]) {
    const a = y[i - 1], b = y[i], c = y[i + 1], den = a - 2 * b + c;
    out.push(den < 0 ? b - ((a - c) * (a - c)) / (8 * den) : b);
  }
  return out;
}

export type BifPoint = { p: number; v: number; kind: 'max' | 'min' | 'end' | 'stable' | 'unstable' };
/**
 * Sweep a parameter. For each value: solve from the previous end state (a slow sweep), drop the transient, and
 * record the peaks and troughs of variable `iv` (or its final value when it settles); also the equilibria,
 * marked stable or unstable.
 */
export function bifurcation(sys: Sys, param: string, values: number[], iv: number, y0: number[], o: { tTransient: number; tRecord: number; rtol?: number; starts?: number[][]; carry?: boolean }): { points: BifPoint[]; failed: number } {
  const points: BifPoint[] = [];
  let y = y0.slice(), failed = 0;
  const nS = 2000;
  for (const p of values) {
    const f = sys.make({ [param]: p });
    const span = o.tTransient + o.tRecord;
    const tEval = Array.from({ length: nS + 1 }, (_, k) => o.tTransient + (k / nS) * o.tRecord);
    const sol = rk45(f, 0, o.carry === false ? y0 : y, span, { rtol: o.rtol ?? 1e-8, atol: 1e-10, tEval, maxSteps: 50000 });
    if (sol.stopped || sol.y.length < nS + 1) { failed++; y = y0.slice(); }
    else {
      const s = sol.y.map((r) => r[iv]);
      const lo = Math.min(...s), hi = Math.max(...s);
      const amp = hi - lo, tol = 1e-4 * Math.max(1, Math.abs(hi), Math.abs(lo));
      if (amp <= tol) points.push({ p, v: s[s.length - 1], kind: 'end' });
      else {
        const mx = localMaxima(s), mn = localMaxima(s.map((v) => -v)).map((v) => -v);
        for (const v of mx) points.push({ p, v, kind: 'max' });
        for (const v of mn) points.push({ p, v, kind: 'min' });
        if (!mx.length) points.push({ p, v: s[s.length - 1], kind: 'end' });
      }
      y = sol.y[sol.y.length - 1].slice();
    }
    if (o.starts) for (const e of equilibria(f, o.starts, 0, 12)) points.push({ p, v: e.x[iv], kind: e.stable ? 'stable' : 'unstable' });
  }
  return { points, failed };
}

// ---------- 1D heat and wave equations ----------

export type PdeOpts = {
  kind: 'heat' | 'wave'; L: number; /** Diffusivity D (heat) or wave speed c. */ k: number; nx: number; dt: number; tEnd: number;
  u0: (x: number) => number; v0?: (x: number) => number; bc: 'fixed' | 'free'; left?: number; right?: number; snapshots?: number; rows?: number;
};
export type PdeResult = {
  x: number[]; dx: number; steps: number; /** r = D dt/dx² (heat) or the Courant number c dt/dx (wave). */ number: number; limit: number; stable: boolean;
  snapT: number[]; snapU: number[][]; /** A coarse space-time grid for a picture. */ gridT: number[]; grid: number[][]; blewUp?: number;
};

/** Explicit finite differences: FTCS for u_t = D u_xx, leapfrog for u_tt = c² u_xx. */
export function pde(o: PdeOpts): PdeResult {
  const nx = Math.round(o.nx), dx = o.L / (nx - 1), x = Array.from({ length: nx }, (_, i) => i * dx);
  const steps = Math.max(1, Math.round(o.tEnd / o.dt)), dt = o.dt;
  const lam = o.kind === 'heat' ? (o.k * dt) / (dx * dx) : (o.k * dt) / dx;
  const limit = o.kind === 'heat' ? 0.5 : 1;
  const fixed = o.bc === 'fixed', uL = o.left ?? 0, uR = o.right ?? 0;
  let u = x.map(o.u0);
  if (fixed) { u[0] = uL; u[nx - 1] = uR; }
  const scale = Math.max(1, ...u.map(Math.abs));
  const nSnap = o.snapshots ?? 6, nRows = Math.min(o.rows ?? 150, steps + 1);
  const snapAt = new Set(Array.from({ length: nSnap }, (_, k) => Math.round((k / (nSnap - 1)) * steps)));
  const rowAt = new Set(Array.from({ length: nRows }, (_, k) => Math.round((k / (nRows - 1)) * steps)));
  const snapT: number[] = [], snapU: number[][] = [], gridT: number[] = [], grid: number[][] = [];
  const keep = (n: number, v: number[]) => { if (snapAt.has(n)) { snapT.push(n * dt); snapU.push(v.slice()); } if (rowAt.has(n)) { gridT.push(n * dt); grid.push(v.slice()); } };
  keep(0, u);
  let blewUp: number | undefined;
  const lap = (v: number[], i: number) => {
    if (i === 0) return 2 * (v[1] - v[0]);
    if (i === nx - 1) return 2 * (v[nx - 2] - v[nx - 1]);
    return v[i + 1] - 2 * v[i] + v[i - 1];
  };
  if (o.kind === 'heat') {
    for (let n = 1; n <= steps; n++) {
      const un = new Array<number>(nx);
      for (let i = 0; i < nx; i++) un[i] = u[i] + lam * lap(u, i);
      if (fixed) { un[0] = uL; un[nx - 1] = uR; }
      u = un;
      if (blewUp == null && !u.every((v) => Number.isFinite(v) && Math.abs(v) < 1e6 * scale)) { blewUp = n * dt; keep(n, u); break; }
      keep(n, u);
    }
  } else {
    const C2 = lam * lam, v0 = o.v0 ?? (() => 0);
    let prev = u;
    // First step from u(x,0) and u_t(x,0) (second-order Taylor start).
    let cur = u.map((v, i) => v + dt * v0(x[i]) + (C2 / 2) * lap(u, i));
    if (fixed) { cur[0] = uL; cur[nx - 1] = uR; }
    keep(1, cur);
    for (let n = 2; n <= steps; n++) {
      const nxt = new Array<number>(nx);
      for (let i = 0; i < nx; i++) nxt[i] = 2 * cur[i] - prev[i] + C2 * lap(cur, i);
      if (fixed) { nxt[0] = uL; nxt[nx - 1] = uR; }
      prev = cur; cur = nxt;
      if (!cur.every((v) => Number.isFinite(v) && Math.abs(v) < 1e6 * scale)) { blewUp = n * dt; keep(n, cur); break; }
      keep(n, cur);
    }
  }
  return { x, dx, steps, number: lam, limit, stable: lam <= limit + 1e-12, snapT, snapU, gridT, grid, blewUp };
}

// Numerical methods for teaching: root finding (bisection, Newton, secant, false position) with iteration tables,
// quadrature (trapezoid, Simpson, Gauss-Legendre, Romberg) and interpolation (Lagrange, Newton divided differences,
// natural cubic spline). Plain TypeScript, no DOM. Checked against scipy in tests/sci-tools/numerical-methods.mjs.

export type F = (x: number) => number;
export type RootRow = { n: number; a?: number; b?: number; x: number; fx: number; dfx?: number; err: number };
export type RootResult = { method: string; rows: RootRow[]; root: number; converged: boolean; reason: string };

const done = (method: string, rows: RootRow[], converged: boolean, reason: string): RootResult => ({ method, rows, root: rows.length ? rows[rows.length - 1].x : NaN, converged, reason });
const bad = (v: number) => !Number.isFinite(v);

/** Bisection on [a, b] (f(a) and f(b) of opposite signs). err is half the bracket width. */
export function bisection(f: F, a: number, b: number, tol = 1e-10, maxIt = 100): RootResult {
  let fa = f(a), fb = f(b);
  if (bad(fa) || bad(fb)) return done('Bisection', [], false, 'f is undefined at an end of the interval.');
  if (fa === 0) return done('Bisection', [{ n: 0, a, b, x: a, fx: 0, err: 0 }], true, 'f(a) is exactly 0.');
  if (fb === 0) return done('Bisection', [{ n: 0, a, b, x: b, fx: 0, err: 0 }], true, 'f(b) is exactly 0.');
  if (Math.sign(fa) === Math.sign(fb)) return done('Bisection', [], false, 'f(a) and f(b) have the same sign, so the interval may not contain a root. Choose a and b where f changes sign.');
  const rows: RootRow[] = [];
  for (let n = 1; n <= maxIt; n++) {
    const m = a + (b - a) / 2, fm = f(m), err = (b - a) / 2;
    rows.push({ n, a, b, x: m, fx: fm, err });
    if (bad(fm)) return done('Bisection', rows, false, 'f is undefined at a midpoint.');
    if (fm === 0 || err < tol) return done('Bisection', rows, true, fm === 0 ? 'f(x) is exactly 0.' : 'The bracket is narrower than the tolerance.');
    if (Math.sign(fm) === Math.sign(fa)) { a = m; fa = fm; } else { b = m; fb = fm; }
  }
  return done('Bisection', rows, false, `Stopped after ${maxIt} iterations.`);
}

/** False position (regula falsi). err is the change in x from the previous step. */
export function falsePosition(f: F, a: number, b: number, tol = 1e-10, maxIt = 100): RootResult {
  let fa = f(a), fb = f(b);
  if (bad(fa) || bad(fb)) return done('False position', [], false, 'f is undefined at an end of the interval.');
  if (Math.sign(fa) === Math.sign(fb) && fa !== 0 && fb !== 0) return done('False position', [], false, 'f(a) and f(b) have the same sign, so the interval may not contain a root. Choose a and b where f changes sign.');
  const rows: RootRow[] = [];
  let prev = NaN;
  for (let n = 1; n <= maxIt; n++) {
    const x = b - (fb * (b - a)) / (fb - fa), fx = f(x), err = Number.isNaN(prev) ? Math.abs(b - a) : Math.abs(x - prev);
    rows.push({ n, a, b, x, fx, err });
    if (bad(fx)) return done('False position', rows, false, 'f is undefined at a new point.');
    if (fx === 0 || err < tol) return done('False position', rows, true, fx === 0 ? 'f(x) is exactly 0.' : 'The change in x is below the tolerance.');
    if (Math.sign(fx) === Math.sign(fa)) { a = x; fa = fx; } else { b = x; fb = fx; }
    prev = x;
  }
  return done('False position', rows, false, `Stopped after ${maxIt} iterations.`);
}

/** Newton's method: x ← x − f(x)/f′(x). */
export function newton(f: F, df: F, x0: number, tol = 1e-10, maxIt = 100): RootResult {
  const rows: RootRow[] = [];
  let x = x0;
  for (let n = 1; n <= maxIt; n++) {
    const fx = f(x), d = df(x);
    if (bad(fx) || bad(d)) return done('Newton', rows, false, 'f or f′ is undefined at the current point.');
    if (d === 0) return done('Newton', rows, false, `f′(x) = 0 at x = ${x}, so the tangent never meets the axis. Try another starting point.`);
    const xn = x - fx / d, err = Math.abs(xn - x);
    rows.push({ n, x: xn, fx: f(xn), dfx: d, err });
    if (bad(xn) || Math.abs(xn) > 1e15) return done('Newton', rows, false, 'The iterates ran away. Try a starting point nearer the root.');
    if (err < tol || f(xn) === 0) return done('Newton', rows, true, 'The change in x is below the tolerance.');
    x = xn;
  }
  return done('Newton', rows, false, `Stopped after ${maxIt} iterations without settling.`);
}

/** Secant method from two starting points. */
export function secant(f: F, x0: number, x1: number, tol = 1e-10, maxIt = 100): RootResult {
  const rows: RootRow[] = [];
  let f0 = f(x0), f1 = f(x1);
  for (let n = 1; n <= maxIt; n++) {
    if (bad(f0) || bad(f1)) return done('Secant', rows, false, 'f is undefined at a point.');
    if (f1 === f0) return done('Secant', rows, false, 'f(xₙ) = f(xₙ₋₁), so the secant line is flat. Try other starting points.');
    const x2 = x1 - (f1 * (x1 - x0)) / (f1 - f0), f2 = f(x2), err = Math.abs(x2 - x1);
    rows.push({ n, x: x2, fx: f2, err });
    if (bad(x2) || Math.abs(x2) > 1e15) return done('Secant', rows, false, 'The iterates ran away. Try starting points nearer the root.');
    if (err < tol || f2 === 0) return done('Secant', rows, true, 'The change in x is below the tolerance.');
    x0 = x1; f0 = f1; x1 = x2; f1 = f2;
  }
  return done('Secant', rows, false, `Stopped after ${maxIt} iterations without settling.`);
}

/** Estimated order of convergence from the last steps (≈1 linear, ≈1.618 secant, ≈2 Newton). */
export function convergenceOrder(rows: RootRow[], root: number): number {
  const e = rows.map((r) => Math.abs(r.x - root)).filter((v) => v > 1e-14 * (1 + Math.abs(root)));
  const ps: number[] = [];
  for (let i = 2; i < e.length; i++) {
    const p = Math.log(e[i] / e[i - 1]) / Math.log(e[i - 1] / e[i - 2]);
    if (Number.isFinite(p)) ps.push(p);
  }
  return ps.length ? ps[ps.length - 1] : NaN;
}

// ---------- Quadrature ----------
export function trapezoid(f: F, a: number, b: number, n: number): number {
  const h = (b - a) / n;
  let s = (f(a) + f(b)) / 2;
  for (let i = 1; i < n; i++) s += f(a + i * h);
  return s * h;
}
/** Composite Simpson's 1/3 rule; n must be even. */
export function simpson(f: F, a: number, b: number, n: number): number {
  if (n % 2) throw new Error("Simpson's rule needs an even number of intervals.");
  const h = (b - a) / n;
  let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * f(a + i * h);
  return (s * h) / 3;
}
/** Midpoint rule (used for comparison). */
export function midpoint(f: F, a: number, b: number, n: number): number {
  const h = (b - a) / n;
  let s = 0;
  for (let i = 0; i < n; i++) s += f(a + (i + 0.5) * h);
  return s * h;
}
/** Gauss-Legendre nodes and weights on [−1, 1] (Newton's method on Legendre polynomials). */
export function legendre(n: number): { x: number[]; w: number[] } {
  const x: number[] = Array(n), w: number[] = Array(n);
  for (let i = 0; i < Math.ceil(n / 2); i++) {
    let z = Math.cos((Math.PI * (i + 0.75)) / (n + 0.5)), pp = 0;
    for (let it = 0; it < 100; it++) {
      let p1 = 1, p2 = 0;
      for (let j = 1; j <= n; j++) { const p3 = p2; p2 = p1; p1 = ((2 * j - 1) * z * p2 - (j - 1) * p3) / j; }
      pp = (n * (z * p1 - p2)) / (z * z - 1);
      const z1 = z; z = z1 - p1 / pp;
      if (Math.abs(z - z1) < 1e-15) break;
    }
    // Recompute the derivative at the final z for the weight.
    let p1 = 1, p2 = 0;
    for (let j = 1; j <= n; j++) { const p3 = p2; p2 = p1; p1 = ((2 * j - 1) * z * p2 - (j - 1) * p3) / j; }
    pp = (n * (z * p1 - p2)) / (z * z - 1);
    x[i] = -z; x[n - 1 - i] = z;
    w[i] = w[n - 1 - i] = 2 / ((1 - z * z) * pp * pp);
  }
  if (n % 2) x[(n - 1) / 2] = 0;
  return { x, w };
}
export function gauss(f: F, a: number, b: number, n: number): number {
  const { x, w } = legendre(n), m = (a + b) / 2, r = (b - a) / 2;
  return r * x.reduce((s, xi, i) => s + w[i] * f(m + r * xi), 0);
}
/** Romberg table R[i][j]: R[i][0] is the trapezoid rule with 2^i intervals, then Richardson extrapolation. */
export function romberg(f: F, a: number, b: number, levels: number): number[][] {
  const R: number[][] = [];
  for (let i = 0; i < levels; i++) {
    R.push([trapezoid(f, a, b, 2 ** i)]);
    for (let j = 1; j <= i; j++) R[i].push(R[i][j - 1] + (R[i][j - 1] - R[i - 1][j - 1]) / (4 ** j - 1));
  }
  return R;
}
/** A high-accuracy reference: 20-point Gauss on 64 panels. */
export function reference(f: F, a: number, b: number): number {
  const panels = 64, h = (b - a) / panels;
  let s = 0;
  for (let i = 0; i < panels; i++) s += gauss(f, a + i * h, a + (i + 1) * h, 20);
  return s;
}

// ---------- Interpolation ----------
/** Newton divided-difference table: table[k][i] = f[x_i, …, x_{i+k}]. */
export function dividedDifferences(xs: number[], ys: number[]): number[][] {
  const n = xs.length, T: number[][] = [ys.slice()];
  for (let k = 1; k < n; k++) {
    const prev = T[k - 1], row: number[] = [];
    for (let i = 0; i < n - k; i++) row.push((prev[i + 1] - prev[i]) / (xs[i + k] - xs[i]));
    T.push(row);
  }
  return T;
}
/** Evaluate the Newton form with coefficients c (c_k = f[x_0..x_k]). */
export function newtonEval(xs: number[], c: number[], x: number): number {
  let s = c[c.length - 1];
  for (let k = c.length - 2; k >= 0; k--) s = s * (x - xs[k]) + c[k];
  return s;
}
/** Power-basis coefficients (constant first) of the interpolating polynomial, from the Newton form. */
export function polyCoefficients(xs: number[], ys: number[]): number[] {
  const c = dividedDifferences(xs, ys).map((r) => r[0]);
  let p = [c[c.length - 1]];
  for (let k = c.length - 2; k >= 0; k--) {
    // p ← p·(x − x_k) + c_k
    const q = Array(p.length + 1).fill(0);
    p.forEach((v, i) => { q[i + 1] += v; q[i] -= v * xs[k]; });
    q[0] += c[k];
    p = q;
  }
  return p;
}
/** Lagrange interpolation in barycentric form (stable). */
export function lagrange(xs: number[], ys: number[]): F {
  const n = xs.length, w = xs.map((xi, i) => 1 / xs.reduce((s, xj, j) => (j === i ? s : s * (xi - xj)), 1));
  return (x) => {
    let num = 0, den = 0;
    for (let i = 0; i < n; i++) {
      if (x === xs[i]) return ys[i];
      const t = w[i] / (x - xs[i]);
      num += t * ys[i]; den += t;
    }
    return num / den;
  };
}
/** The Lagrange basis polynomial values L_i(x) (to show the method). */
export const lagrangeBasis = (xs: number[], i: number, x: number) => xs.reduce((s, xj, j) => (j === i ? s : (s * (x - xj)) / (xs[i] - xj)), 1);

export type Spline = { xs: number[]; a: number[]; b: number[]; c: number[]; d: number[] };
/** Natural cubic spline: S_i(x) = a_i + b_i t + c_i t² + d_i t³ with t = x − x_i, S″ = 0 at both ends. */
export function naturalSpline(xs: number[], ys: number[]): Spline {
  const n = xs.length - 1, h = xs.slice(0, n).map((x, i) => xs[i + 1] - x);
  const alpha = Array(n + 1).fill(0);
  for (let i = 1; i < n; i++) alpha[i] = (3 / h[i]) * (ys[i + 1] - ys[i]) - (3 / h[i - 1]) * (ys[i] - ys[i - 1]);
  const l = Array(n + 1).fill(1), mu = Array(n + 1).fill(0), z = Array(n + 1).fill(0), c = Array(n + 1).fill(0), b = Array(n).fill(0), d = Array(n).fill(0);
  for (let i = 1; i < n; i++) {
    l[i] = 2 * (xs[i + 1] - xs[i - 1]) - h[i - 1] * mu[i - 1];
    mu[i] = h[i] / l[i];
    z[i] = (alpha[i] - h[i - 1] * z[i - 1]) / l[i];
  }
  for (let j = n - 1; j >= 0; j--) {
    c[j] = z[j] - mu[j] * c[j + 1];
    b[j] = (ys[j + 1] - ys[j]) / h[j] - (h[j] * (c[j + 1] + 2 * c[j])) / 3;
    d[j] = (c[j + 1] - c[j]) / (3 * h[j]);
  }
  return { xs, a: ys.slice(0, n), b, c: c.slice(0, n), d };
}
export function splineEval(s: Spline, x: number): number {
  const n = s.a.length;
  let i = 0;
  if (x >= s.xs[n]) i = n - 1;
  else while (i < n - 1 && x >= s.xs[i + 1]) i++;
  const t = x - s.xs[i];
  return s.a[i] + t * (s.b[i] + t * (s.c[i] + t * s.d[i]));
}
export const equalNodes = (a: number, b: number, n: number) => Array.from({ length: n }, (_, i) => (n === 1 ? (a + b) / 2 : a + ((b - a) * i) / (n - 1)));
/** Chebyshev points (of the first kind) on [a, b], in increasing order. */
export const chebyshevNodes = (a: number, b: number, n: number) => Array.from({ length: n }, (_, i) => (a + b) / 2 - ((b - a) / 2) * Math.cos(((2 * i + 1) * Math.PI) / (2 * n)));

/** Check data points: numbers, at least 2, x values distinct. Sorted by x. */
export function checkPoints(xs: number[], ys: number[]): { xs: number[]; ys: number[] } {
  if (xs.length < 2) throw new Error('Give at least 2 points.');
  const idx = xs.map((_, i) => i).sort((p, q) => xs[p] - xs[q]);
  const sx = idx.map((i) => xs[i]), sy = idx.map((i) => ys[i]);
  for (let i = 1; i < sx.length; i++) if (sx[i] === sx[i - 1]) throw new Error(`Two points have the same x (${sx[i]}). Each x may appear only once.`);
  return { xs: sx, ys: sy };
}

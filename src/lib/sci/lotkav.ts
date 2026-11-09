// Lotka-Volterra predator-prey and two-species competition models: RK4 integration, equilibria and
// their stability from the Jacobian.

export type PredPrey = { alpha: number; beta: number; delta: number; gamma: number; /** Prey carrying capacity; Infinity for the classic model. */ K: number };
export type Compete = { r1: number; r2: number; K1: number; K2: number; a12: number; a21: number };
export type Deriv = (x: number, y: number) => [number, number];

export const predPrey = (p: PredPrey): Deriv => (x, y) => [p.alpha * x * (1 - x / p.K) - p.beta * x * y, p.delta * x * y - p.gamma * y];
export const compete = (p: Compete): Deriv => (x, y) => [(p.r1 * x * (p.K1 - x - p.a12 * y)) / p.K1, (p.r2 * y * (p.K2 - y - p.a21 * x)) / p.K2];

/** Classic fourth-order Runge-Kutta with a fixed step; returns times and both populations at every step. */
export function rk4(f: Deriv, x0: number, y0: number, T: number, steps: number): { t: Float64Array; x: Float64Array; y: Float64Array } {
  const h = T / steps, t = new Float64Array(steps + 1), X = new Float64Array(steps + 1), Y = new Float64Array(steps + 1);
  let x = x0, y = y0; X[0] = x; Y[0] = y;
  for (let i = 1; i <= steps; i++) {
    const [a1, b1] = f(x, y), [a2, b2] = f(x + (h / 2) * a1, y + (h / 2) * b1), [a3, b3] = f(x + (h / 2) * a2, y + (h / 2) * b2), [a4, b4] = f(x + h * a3, y + h * b3);
    x += (h / 6) * (a1 + 2 * a2 + 2 * a3 + a4); y += (h / 6) * (b1 + 2 * b2 + 2 * b3 + b4);
    if (x < 0) x = 0; if (y < 0) y = 0;
    t[i] = i * h; X[i] = x; Y[i] = y;
  }
  return { t, x: X, y: Y };
}

export type Kind = 'stable node' | 'stable spiral' | 'unstable node' | 'unstable spiral' | 'saddle' | 'centre' | 'neutral';
export type Equilibrium = { name: string; x: number; y: number; eig: { re: number; im: number }[]; kind: Kind };

function classify(J: number[][]): { eig: { re: number; im: number }[]; kind: Kind } {
  const tr = J[0][0] + J[1][1], det = J[0][0] * J[1][1] - J[0][1] * J[1][0], disc = tr * tr - 4 * det, eps = 1e-12 * (1 + Math.abs(tr) + Math.abs(det));
  if (disc < 0) {
    const re = tr / 2, im = Math.sqrt(-disc) / 2, eig = [{ re, im }, { re, im: -im }];
    return { eig, kind: Math.abs(re) <= eps ? 'centre' : re < 0 ? 'stable spiral' : 'unstable spiral' };
  }
  const s = Math.sqrt(disc), l1 = (tr + s) / 2, l2 = (tr - s) / 2, eig = [{ re: l1, im: 0 }, { re: l2, im: 0 }];
  if (Math.abs(l1) <= eps || Math.abs(l2) <= eps) return { eig, kind: 'neutral' };
  return { eig, kind: l1 > 0 && l2 > 0 ? 'unstable node' : l1 < 0 && l2 < 0 ? 'stable node' : 'saddle' };
}

export function predPreyEquilibria(p: PredPrey): Equilibrium[] {
  const J = (x: number, y: number) => [[p.alpha * (1 - (2 * x) / p.K) - p.beta * y, -p.beta * x], [p.delta * y, p.delta * x - p.gamma]];
  const out: Equilibrium[] = [{ name: 'Both extinct', x: 0, y: 0, ...classify(J(0, 0)) }];
  if (Number.isFinite(p.K)) out.push({ name: 'Prey only', x: p.K, y: 0, ...classify(J(p.K, 0)) });
  const xs = p.gamma / p.delta;
  if (xs < p.K) { const ys = (p.alpha / p.beta) * (1 - xs / p.K); out.push({ name: 'Coexistence', x: xs, y: ys, ...classify(J(xs, ys)) }); }
  return out;
}

export function competeEquilibria(p: Compete): Equilibrium[] {
  const J = (x: number, y: number) => [[p.r1 * (1 - (2 * x + p.a12 * y) / p.K1), (-p.r1 * p.a12 * x) / p.K1], [(-p.r2 * p.a21 * y) / p.K2, p.r2 * (1 - (2 * y + p.a21 * x) / p.K2)]];
  const out: Equilibrium[] = [
    { name: 'Both extinct', x: 0, y: 0, ...classify(J(0, 0)) },
    { name: 'Species 1 only', x: p.K1, y: 0, ...classify(J(p.K1, 0)) },
    { name: 'Species 2 only', x: 0, y: p.K2, ...classify(J(0, p.K2)) },
  ];
  const den = 1 - p.a12 * p.a21;
  if (Math.abs(den) > 1e-12) {
    const x = (p.K1 - p.a12 * p.K2) / den, y = (p.K2 - p.a21 * p.K1) / den;
    if (x > 0 && y > 0) out.push({ name: 'Coexistence', x, y, ...classify(J(x, y)) });
  }
  return out;
}

/** Textbook outcome of competition from the four isocline intercepts. */
export function competeOutcome(p: Compete): 'coexist' | 'one' | 'two' | 'either' | 'borderline' {
  const s1 = p.K1 - p.a12 * p.K2, s2 = p.K2 - p.a21 * p.K1;
  if (s1 > 0 && s2 > 0) return 'coexist';
  if (s1 > 0 && s2 < 0) return 'one';
  if (s1 < 0 && s2 > 0) return 'two';
  if (s1 < 0 && s2 < 0) return 'either';
  return 'borderline';
}

/** The quantity conserved along classic (K = ∞) predator-prey orbits. */
export const ppInvariant = (p: PredPrey, x: number, y: number) => p.delta * x - p.gamma * Math.log(x) + p.beta * y - p.alpha * Math.log(y);

/** Mean time between successive peaks of a series (NaN with fewer than two peaks). */
export function meanPeriod(t: ArrayLike<number>, v: ArrayLike<number>): { period: number; peaks: number } {
  const pk: number[] = [];
  for (let i = 1; i < v.length - 1; i++) if (v[i] > v[i - 1] && v[i] >= v[i + 1]) {
    // Parabolic interpolation of the peak time.
    const d = v[i - 1] - 2 * v[i] + v[i + 1], h = t[i + 1] - t[i];
    pk.push(t[i] + (d ? (0.5 * (v[i - 1] - v[i + 1]) / d) * h : 0));
  }
  return { period: pk.length > 1 ? (pk[pk.length - 1] - pk[0]) / (pk.length - 1) : NaN, peaks: pk.length };
}

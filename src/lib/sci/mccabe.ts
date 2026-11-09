// McCabe-Thiele stage stepping for a binary distillation column with constant molar overflow: equilibrium from a
// constant relative volatility or from x-y data (monotone cubic), q-line, operating lines, minimum reflux (including a
// tangent pinch), Fenske minimum stages, Gilliland check and flows. Plain maths; no DOM.

export type Eq = { y: (x: number) => number; x: (y: number) => number; label: string };

/** Equilibrium with a constant relative volatility alpha. */
export function alphaEq(a: number): Eq {
  if (!(a > 1)) throw new Error('The relative volatility must be above 1 (the light component is the more volatile one)');
  return { y: (x) => (a * x) / (1 + (a - 1) * x), x: (y) => y / (a - (a - 1) * y), label: `α = ${a}` };
}

/** Equilibrium from measured x-y points (light-component mole fractions), with (0,0) and (1,1) added. */
export function dataEq(xs: number[], ys: number[]): Eq {
  const pts = xs.map((x, i) => [x, ys[i]] as [number, number]).filter(([x, y]) => Number.isFinite(x) && Number.isFinite(y));
  if (pts.length < 2) throw new Error('Give at least two x-y points');
  for (const [x, y] of pts) if (x < 0 || x > 1 || y < 0 || y > 1) throw new Error('Mole fractions must be between 0 and 1');
  pts.push([0, 0], [1, 1]);
  pts.sort((a, b) => a[0] - b[0]);
  const P: [number, number][] = [];
  for (const p of pts) { if (P.length && Math.abs(p[0] - P[P.length - 1][0]) < 1e-12) { if (p[0] === 0 || p[0] === 1) P[P.length - 1] = p; continue; } P.push(p); }
  for (let i = 1; i < P.length; i++) if (!(P[i][1] > P[i - 1][1])) throw new Error('y must rise as x rises; check the data for typing errors');
  const n = P.length, X = P.map((p) => p[0]), Y = P.map((p) => p[1]);
  // Fritsch-Carlson monotone cubic slopes.
  const d = X.slice(1).map((_, i) => (Y[i + 1] - Y[i]) / (X[i + 1] - X[i]));
  const m = X.map((_, i) => (i === 0 ? d[0] : i === n - 1 ? d[n - 2] : d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2));
  for (let i = 0; i < n - 1; i++) {
    const a = m[i] / d[i], b = m[i + 1] / d[i], s = a * a + b * b;
    if (s > 9) { const t = 3 / Math.sqrt(s); m[i] = t * a * d[i]; m[i + 1] = t * b * d[i]; }
  }
  const y = (x: number) => {
    if (x <= 0) return 0; if (x >= 1) return 1;
    let i = 0; while (i < n - 2 && x > X[i + 1]) i++;
    const h = X[i + 1] - X[i], t = (x - X[i]) / h, t2 = t * t, t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * Y[i] + (t3 - 2 * t2 + t) * h * m[i] + (-2 * t3 + 3 * t2) * Y[i + 1] + (t3 - t2) * h * m[i + 1];
  };
  const x = (yy: number) => { let lo = 0, hi = 1; for (let k = 0; k < 60; k++) { const mid = (lo + hi) / 2; if (y(mid) < yy) lo = mid; else hi = mid; } return (lo + hi) / 2; };
  return { y, x, label: `${pts.length - 2} data points` };
}

/** Where the q-line meets the line y = s x + c (q = 1 gives a vertical q-line at xF). */
function qMeet(xF: number, q: number, s: number, c: number): [number, number] {
  if (Math.abs(q - 1) < 1e-9) return [xF, s * xF + c];
  const qs = q / (q - 1), qc = -xF / (q - 1);
  const x = (c - qc) / (qs - s);
  return [x, s * x + c];
}

/** Where the q-line meets the equilibrium curve. */
export function qPinch(eq: Eq, xF: number, q: number): [number, number] {
  if (Math.abs(q - 1) < 1e-9) return [xF, eq.y(xF)];
  if (Math.abs(q) < 1e-9) return [eq.x(xF), xF];
  // f(x) = eq.y(x) - qline(x) changes sign between 0 and 1 on the right branch.
  const ql = (x: number) => (q / (q - 1)) * x - xF / (q - 1);
  const f = (x: number) => eq.y(x) - ql(x);
  let lo: number, hi: number;
  if (q > 1) { lo = xF; hi = 1; } else if (q > 0) { lo = 0; hi = xF; } else { lo = 0; hi = xF; }
  if (f(lo) * f(hi) > 0) { lo = 0; hi = 1; }
  for (let k = 0; k < 100; k++) { const mid = (lo + hi) / 2; if (f(lo) * f(mid) <= 0) hi = mid; else lo = mid; }
  const x = (lo + hi) / 2;
  return [x, eq.y(x)];
}

/**
 * Minimum reflux. The rectifying line from (xD, xD) must stay on or below the equilibrium curve from the feed
 * intersection to xD, so Rmin/(Rmin + 1) is the largest (xD − y_eq(x)) / (xD − x) there. A tangent pinch shows up
 * as a maximum away from the q-line point.
 */
export function minReflux(eq: Eq, xF: number, xD: number, q: number) {
  const [xp, yp] = qPinch(eq, xF, q);
  let best = (xD - yp) / (xD - xp), at: [number, number] = [xp, yp], tangent = false;
  const N = 2000, slope = (x: number) => (xD - eq.y(x)) / (xD - x);
  let bi = -1;
  for (let i = 1; i < N; i++) {
    const x = xp + ((xD - xp) * i) / N, s = slope(x);
    if (s > best + 1e-9) { best = s; bi = i; tangent = true; }
  }
  if (tangent) {
    let lo = xp + ((xD - xp) * (bi - 1)) / N, hi = xp + ((xD - xp) * (bi + 1)) / N;
    for (let k = 0; k < 80; k++) { const m1 = lo + (hi - lo) / 3, m2 = hi - (hi - lo) / 3; if (slope(m1) < slope(m2)) lo = m1; else hi = m2; }
    const x = (lo + hi) / 2; best = Math.max(best, slope(x)); at = [x, eq.y(x)];
  }
  const Rmin = best / (1 - best);
  return { Rmin, pinch: at, qPoint: [xp, yp] as [number, number], tangent };
}

/** Fenske minimum number of stages (total reflux) for a constant alpha. */
export const fenske = (xD: number, xB: number, a: number) => Math.log(((xD / (1 - xD)) * (1 - xB)) / xB) / Math.log(a);

/** Gilliland correlation (Eduljee's fit): estimated stages from R, Rmin and Nmin. */
export function gilliland(R: number, Rmin: number, Nmin: number) {
  const X = (R - Rmin) / (R + 1), Y = 0.75 * (1 - Math.pow(X, 0.5668));
  return (Nmin + Y) / (1 - Y);
}

export type Spec = { xF: number; xD: number; xB: number; q: number; R: number };
export type Stage = { n: number; x: number; y: number; section: 'rect' | 'strip' };

/**
 * Step off stages from the top (total condenser) down to xB. R = Infinity steps against y = x (total reflux).
 * Returns the stages (the last one is the reboiler), the fractional count, the best feed stage, and the path for drawing.
 */
export function stepStages(eq: Eq, s: Spec, maxStages = 300) {
  const { xF, xD, xB, q, R } = s;
  if (!(xB < xF && xF < xD)) throw new Error('Need bottoms < feed < distillate (light-component mole fractions)');
  if (!(xB > 0 && xD < 1)) throw new Error('The distillate must be below 1 and the bottoms above 0; a perfect split needs infinite stages');
  const total = !Number.isFinite(R);
  const rs = total ? 1 : R / (R + 1), rc = total ? 0 : xD / (R + 1);
  const [xi, yi] = total ? [xF, xF] : qMeet(xF, q, rs, rc);
  if (!total && !(xi > xB && xi < xD)) throw new Error('The q-line meets the rectifying line outside the column range; check q and the reflux ratio');
  if (!total && eq.y(xi) < yi - 1e-12) throw new Error('The operating lines cross the equilibrium curve: the reflux ratio is at or below the minimum');
  const ss = total ? 1 : (yi - xB) / (xi - xB), sc = total ? 0 : xB - ss * xB;
  const stages: Stage[] = [], path: [number, number][] = [[xD, xD]];
  let x = xD, y = xD, feed = 0, frac = 0;
  for (let n = 1; n <= maxStages; n++) {
    const xn = eq.x(y);
    path.push([xn, y]);
    const section: Stage['section'] = feed ? 'strip' : 'rect';
    stages.push({ n, x: xn, y, section });
    if (xn <= xB + 1e-12) { frac = n - 1 + (x - xB) / (x - xn); break; }
    if (!feed && xn < xi) feed = n;
    const yn = feed ? ss * xn + sc : rs * xn + rc;
    if (!(yn < y - 1e-12)) throw new Error('The steps stopped moving: the reflux is too close to the minimum or the curve touches the operating line');
    path.push([xn, yn]);
    x = xn; y = yn;
    if (n === maxStages) throw new Error(`More than ${maxStages} stages: raise the reflux ratio or relax the purities`);
  }
  if (!feed) feed = stages.length;
  return { stages, N: stages.length, frac, feed, path, intersect: [xi, yi] as [number, number], rect: { s: rs, c: rc }, strip: { s: ss, c: sc } };
}

/** Distillate, bottoms and internal flows for feed rate F (any molar unit per time). */
export function flows(F: number, s: Spec) {
  const D = (F * (s.xF - s.xB)) / (s.xD - s.xB), B = F - D, L = s.R * D, V = (s.R + 1) * D;
  return { D, B, L, V, Ls: L + s.q * F, Vs: V - (1 - s.q) * F };
}

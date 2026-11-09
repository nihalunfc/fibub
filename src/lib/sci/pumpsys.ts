// Pump and system curves: least-squares polynomial fits of a pump's head (and efficiency, NPSH required) from
// points read off its curve, a system curve of static head plus friction, the operating point where they cross,
// pumps in parallel or series, the affinity laws for a change of speed or impeller diameter, and NPSH available.
// SI units: flow in m³/s, head in m, pressure in Pa.

export const G = 9.80665;

/** Least-squares polynomial coefficients [c0, c1, ...] of the given degree (normal equations, scaled x). */
export function polyfit(x: number[], y: number[], deg: number): number[] {
  const n = deg + 1, sx = Math.max(...x.map(Math.abs)) || 1;
  const A = Array.from({ length: n }, () => new Array(n).fill(0)), b = new Array(n).fill(0);
  for (let i = 0; i < x.length; i++) {
    const t = x[i] / sx, pw = Array.from({ length: n }, (_, k) => t ** k);
    for (let r = 0; r < n; r++) { b[r] += pw[r] * y[i]; for (let c = 0; c < n; c++) A[r][c] += pw[r] * pw[c]; }
  }
  // Gaussian elimination with partial pivoting.
  for (let c = 0; c < n; c++) {
    let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
    [A[c], A[p]] = [A[p], A[c]]; [b[c], b[p]] = [b[p], b[c]];
    for (let r = c + 1; r < n; r++) { const k = A[r][c] / A[c][c]; for (let j = c; j < n; j++) A[r][j] -= k * A[c][j]; b[r] -= k * b[c]; }
  }
  const z = new Array(n).fill(0);
  for (let r = n - 1; r >= 0; r--) { let s = b[r]; for (let j = r + 1; j < n; j++) s -= A[r][j] * z[j]; z[r] = s / A[r][r]; }
  return z.map((v, k) => v / sx ** k);
}
export const polyval = (c: number[], x: number) => c.reduceRight((acc, v) => acc * x + v, 0);
/** Coefficient of determination of a fit. */
export function r2(c: number[], x: number[], y: number[]) {
  const m = y.reduce((a, b) => a + b, 0) / y.length;
  let ss = 0, st = 0; x.forEach((xi, i) => { ss += (y[i] - polyval(c, xi)) ** 2; st += (y[i] - m) ** 2; });
  return st ? 1 - ss / st : 1;
}

export type PumpFit = { head: number[]; eff?: number[]; npsh?: number[]; qMax: number };
/** Fit head with a quadratic; efficiency with a quadratic (3 or 4 points) or cubic (5 or more); NPSHr with a quadratic. */
export function fitPump(Q: number[], H: number[], E?: (number | undefined)[], N?: (number | undefined)[]): PumpFit {
  const out: PumpFit = { head: polyfit(Q, H, 2), qMax: Math.max(...Q) };
  const pick = (v?: (number | undefined)[]) => { const x: number[] = [], y: number[] = []; v?.forEach((e, i) => { if (e !== undefined && Number.isFinite(e)) { x.push(Q[i]); y.push(e); } }); return { x, y }; };
  const e = pick(E); if (e.x.length >= 3) out.eff = polyfit(e.x, e.y, e.x.length >= 5 ? 3 : 2);
  const n = pick(N); if (n.x.length >= 3) out.npsh = polyfit(n.x, n.y, 2); else if (n.x.length === 2) out.npsh = polyfit(n.x, n.y, 1);
  return out;
}

export type Arrangement = { n: number; mode: 'single' | 'parallel' | 'series' };
/** Speed or diameter ratio r: Q scales with r, head with r², power with r³ (affinity laws). */
export type Modified = { fit: PumpFit; r: number; arr: Arrangement };
/** Head of the whole pump set at total flow Q. */
export function setHead(m: Modified, Q: number): number {
  const { fit, r, arr } = m, n = arr.mode === 'single' ? 1 : arr.n;
  const qEach = arr.mode === 'parallel' ? Q / n : Q;
  const h = r * r * polyval(fit.head, qEach / r);
  return arr.mode === 'series' ? n * h : h;
}
/** Efficiency (fraction) of each pump at total flow Q (unchanged at corresponding points under the affinity laws). */
export function setEff(m: Modified, Q: number): number {
  if (!m.fit.eff) return NaN;
  const qEach = m.arr.mode === 'parallel' ? Q / m.arr.n : Q;
  return polyval(m.fit.eff, qEach / m.r) / 100;
}
/** NPSH required by each pump at total flow Q (scales with r²). */
export function setNpshr(m: Modified, Q: number): number {
  if (!m.fit.npsh) return NaN;
  const qEach = m.arr.mode === 'parallel' ? Q / m.arr.n : Q;
  return m.r * m.r * polyval(m.fit.npsh, qEach / m.r);
}
/** Largest flow at which the pump set still gives positive head (shut-off side to run-out). */
export function maxFlow(m: Modified): number {
  const n = m.arr.mode === 'parallel' ? m.arr.n : 1;
  const [a, b, c] = m.fit.head;
  // roots of a + b q + c q² = 0 for one pump, q > 0
  let q1: number;
  if (Math.abs(c) < 1e-300) q1 = b < 0 ? -a / b : Infinity;
  else { const d = b * b - 4 * a * c; q1 = d < 0 ? Infinity : Math.max((-b - Math.sqrt(d)) / (2 * c), (-b + Math.sqrt(d)) / (2 * c)); }
  return q1 * m.r * n;
}

/** Operating point: the flow where the pump set's head equals the system head (bisection). */
export function operatingPoint(m: Modified, sys: (Q: number) => number): { Q: number; H: number } | null {
  const f = (Q: number) => setHead(m, Q) - sys(Q);
  if (f(0) <= 0) return null; // pump cannot beat the static head
  let hi = Math.min(maxFlow(m), 1e6);
  if (!Number.isFinite(hi) || hi <= 0) hi = 1;
  let k = 0; while (f(hi) > 0 && k++ < 60) hi *= 2;
  if (f(hi) > 0) return null;
  let lo = 0;
  for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if (f(mid) > 0) lo = mid; else hi = mid; if (hi - lo < 1e-15 * hi) break; }
  const Q = (lo + hi) / 2;
  return { Q, H: sys(Q) };
}

/** Simple system curve: static head plus k Q², with k from a known friction loss hRef at flow qRef. */
export const quadSystem = (hStatic: number, hRef: number, qRef: number) => (Q: number) => hStatic + (hRef / (qRef * qRef)) * Q * Q;

/** Hydraulic power ρ g Q H (W) and shaft power (W) at efficiency eta. */
export const power = (rho: number, Q: number, H: number, eta: number) => ({ hyd: rho * G * Q * H, shaft: (rho * G * Q * H) / eta });

/** NPSH available (m): surface pressure head minus vapour pressure head plus static suction head minus suction losses. */
export function npsha(pSurf: number, pVap: number, rho: number, zSuction: number, hLoss: number): number {
  return (pSurf - pVap) / (rho * G) + zSuction - hLoss;
}

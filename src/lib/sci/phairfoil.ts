// NACA 4-digit airfoils: geometry, thin airfoil theory and a linear-strength vortex panel method.
// Geometry: Jacobs, Ward and Pinkerton (1933), NACA Report 460. Thin airfoil theory: Abbott and von Doenhoff,
// Theory of Wing Sections (1959). Panel method: Kuethe and Chow, Foundations of Aerodynamics (linear vortex panels,
// Kutta condition γ(TE lower) + γ(TE upper) = 0).

export type Naca = { m: number; p: number; t: number };
export function parseNaca(code: string): Naca | null {
  const s = code.replace(/^\s*naca\s*/i, '').trim();
  if (!/^\d{4}$/.test(s)) return null;
  const m = +s[0] / 100, p = +s[1] / 10, t = +s.slice(2) / 100;
  if (t <= 0 || (m > 0 && p === 0)) return null;
  return { m, p, t };
}
export function camber(a: Naca, x: number): { z: number; dz: number } {
  const { m, p } = a;
  if (m === 0) return { z: 0, dz: 0 };
  if (x < p) return { z: (m / (p * p)) * (2 * p * x - x * x), dz: ((2 * m) / (p * p)) * (p - x) };
  return { z: (m / ((1 - p) ** 2)) * (1 - 2 * p + 2 * p * x - x * x), dz: ((2 * m) / ((1 - p) ** 2)) * (p - x) };
}
/** Half-thickness; closed trailing edge uses −0.1036 for the last coefficient. */
export const thickness = (t: number, x: number, closed = true) => 5 * t * (0.2969 * Math.sqrt(x) - 0.126 * x - 0.3516 * x * x + 0.2843 * x ** 3 - (closed ? 0.1036 : 0.1015) * x ** 4);

/** Boundary points, clockwise from the trailing edge along the lower surface to the leading edge and back along the upper. n panels (even). */
export function nacaPoints(a: Naca, n: number): { X: number[]; Y: number[] } {
  const h = n / 2, X: number[] = [], Y: number[] = [];
  const pt = (x: number, upper: boolean) => { const { z, dz } = camber(a, x), yt = thickness(a.t, x), ph = Math.atan(dz); return upper ? [x - yt * Math.sin(ph), z + yt * Math.cos(ph)] : [x + yt * Math.sin(ph), z - yt * Math.cos(ph)]; };
  for (let i = h; i >= 0; i--) { const x = 0.5 * (1 - Math.cos((Math.PI * i) / h)); const [px, py] = pt(x, false); X.push(px); Y.push(py); }
  for (let i = 1; i <= h; i++) { const x = 0.5 * (1 - Math.cos((Math.PI * i) / h)); const [px, py] = pt(x, true); X.push(px); Y.push(py); }
  return { X, Y };
}

/** Thin airfoil theory for the NACA mean line: zero-lift angle, lift slope 2π, quarter-chord moment. */
export function thinAirfoil(a: Naca) {
  const K = 4000, f = (th: number) => camber(a, 0.5 * (1 - Math.cos(th))).dz;
  // Simpson's rule on [0, π].
  const simp = (g: (th: number) => number) => { const h = Math.PI / K; let s = g(0) + g(Math.PI); for (let k = 1; k < K; k++) s += (k % 2 ? 4 : 2) * g(k * h); return (s * h) / 3; };
  const aL0 = -(1 / Math.PI) * simp((th) => f(th) * (Math.cos(th) - 1));
  const A1 = (2 / Math.PI) * simp((th) => f(th) * Math.cos(th)), A2 = (2 / Math.PI) * simp((th) => f(th) * Math.cos(2 * th));
  return { aL0, A1, A2, cmc4: (Math.PI / 4) * (A2 - A1), cl: (alpha: number) => 2 * Math.PI * (alpha - aL0) };
}

function solve(A: number[][], b: number[]): number[] {
  const n = b.length, M = A.map((r, i) => [...r, b[i]]);
  for (let c = 0; c < n; c++) {
    let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    [M[c], M[p]] = [M[p], M[c]];
    for (let r = c + 1; r < n; r++) { const k = M[r][c] / M[c][c]; if (k) for (let j = c; j <= n; j++) M[r][j] -= k * M[c][j]; }
  }
  const x = new Array(n).fill(0);
  for (let r = n - 1; r >= 0; r--) { let s = M[r][n]; for (let j = r + 1; j < n; j++) s -= M[r][j] * x[j]; x[r] = s / M[r][r]; }
  return x;
}

/** Linear-strength vortex panel method at angle of attack alpha (radians). Chord 1, unit free stream. */
export function vortexPanel(X: number[], Y: number[], alpha: number) {
  const N = X.length - 1, xc: number[] = [], yc: number[] = [], th: number[] = [], S: number[] = [];
  for (let i = 0; i < N; i++) { xc.push((X[i] + X[i + 1]) / 2); yc.push((Y[i] + Y[i + 1]) / 2); S.push(Math.hypot(X[i + 1] - X[i], Y[i + 1] - Y[i])); th.push(Math.atan2(Y[i + 1] - Y[i], X[i + 1] - X[i])); }
  const CN1 = [...Array(N)].map(() => new Array(N).fill(0)), CN2 = CN1.map((r) => [...r]), CT1 = CN1.map((r) => [...r]), CT2 = CN1.map((r) => [...r]);
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
    if (i === j) { CN1[i][j] = -1; CN2[i][j] = 1; CT1[i][j] = Math.PI / 2; CT2[i][j] = Math.PI / 2; continue; }
    const dx = xc[i] - X[j], dy = yc[i] - Y[j];
    const A = -dx * Math.cos(th[j]) - dy * Math.sin(th[j]), B = dx * dx + dy * dy;
    const C = Math.sin(th[i] - th[j]), D = Math.cos(th[i] - th[j]), E = dx * Math.sin(th[j]) - dy * Math.cos(th[j]);
    const F = Math.log(1 + (S[j] * (S[j] + 2 * A)) / B), G = Math.atan2(E * S[j], B + A * S[j]);
    const P = dx * Math.sin(th[i] - 2 * th[j]) + dy * Math.cos(th[i] - 2 * th[j]), Q = dx * Math.cos(th[i] - 2 * th[j]) - dy * Math.sin(th[i] - 2 * th[j]);
    CN2[i][j] = D + (0.5 * Q * F) / S[j] - ((A * C + D * E) * G) / S[j];
    CN1[i][j] = 0.5 * D * F + C * G - CN2[i][j];
    CT2[i][j] = C + (0.5 * P * F) / S[j] + ((A * D - C * E) * G) / S[j];
    CT1[i][j] = 0.5 * C * F - D * G - CT2[i][j];
  }
  const AN = [...Array(N + 1)].map(() => new Array(N + 1).fill(0)), AT = [...Array(N)].map(() => new Array(N + 1).fill(0)), rhs = new Array(N + 1).fill(0);
  for (let i = 0; i < N; i++) {
    AN[i][0] = CN1[i][0]; AN[i][N] = CN2[i][N - 1]; AT[i][0] = CT1[i][0]; AT[i][N] = CT2[i][N - 1];
    for (let j = 1; j < N; j++) { AN[i][j] = CN1[i][j] + CN2[i][j - 1]; AT[i][j] = CT1[i][j] + CT2[i][j - 1]; }
    rhs[i] = Math.sin(th[i] - alpha);
  }
  AN[N][0] = 1; AN[N][N] = 1;
  const g = solve(AN, rhs);
  const vt: number[] = [], cp: number[] = [];
  for (let i = 0; i < N; i++) { let v = Math.cos(th[i] - alpha); for (let j = 0; j <= N; j++) v += AT[i][j] * g[j]; vt.push(v); cp.push(1 - v * v); }
  // Lift from circulation (Kutta-Joukowski); moment about the quarter chord from the pressure.
  let gam = 0; for (let j = 0; j < N; j++) gam += ((g[j] + g[j + 1]) / 2) * S[j] * 2 * Math.PI;
  let fx = 0, fy = 0, mz = 0;
  for (let i = 0; i < N; i++) { const nx = -Math.sin(th[i]), ny = Math.cos(th[i]), dFx = -cp[i] * nx * S[i], dFy = -cp[i] * ny * S[i]; fx += dFx; fy += dFy; mz += (xc[i] - 0.25) * dFy - yc[i] * dFx; }
  const clP = fy * Math.cos(alpha) - fx * Math.sin(alpha);
  return { cl: 2 * gam, clPressure: clP, cm: -mz, cp, xc, yc, vt, gamma: g };
}

/** Rough zero-lift profile drag: 2 Cf (1 + 0.6/0.3 t + 100 t⁴), Cf from Blasius (laminar) or Prandtl-Schlichting (turbulent). */
export function profileDrag(t: number, Re: number, flow: 'laminar' | 'turbulent' | 'auto' = 'auto') {
  const lam = flow === 'laminar' || (flow === 'auto' && Re < 5e5);
  const cf = lam ? 1.328 / Math.sqrt(Re) : 0.455 / Math.log10(Re) ** 2.58;
  const ff = 1 + (0.6 / 0.3) * t + 100 * t ** 4;
  return { cd: 2 * cf * ff, cf, ff, laminar: lam };
}

/** Finite wing by lifting-line with an efficiency factor: CL slope a0/(1 + a0/(π e AR)), induced drag CL²/(π e AR). */
export function finiteWing(a0: number, aL0: number, alpha: number, AR: number, e: number) {
  const a = a0 / (1 + a0 / (Math.PI * e * AR)), CL = a * (alpha - aL0);
  return { a, CL, CDi: (CL * CL) / (Math.PI * e * AR) };
}

// Dynamic light scattering (DLS): from an intensity autocorrelation g2(τ) to sizes.
// - Cumulant analysis (ISO 22412 style, 2nd or 3rd order): ln(g2 − B) = ln β − 2Γτ + μ2τ² − (μ3/3)τ³, a weighted
//   linear least-squares fit. Z-average diameter from Γ by Stokes–Einstein, PDI = μ2/Γ².
// - A regularised non-negative distribution fit (CONTIN-like): g1(τ) = Σ c_j exp(−Γ_j τ) on a log-spaced grid of
//   diameters, solved by Lawson–Hanson NNLS with a second-difference (Tikhonov) penalty.
// - Intensity to volume and number with Rayleigh weighting (intensity ∝ N d⁶), so no Mie theory: only right
//   for particles much smaller than the wavelength (roughly d < λ/10, about 60 nm for red light).
// No DOM; checked against NumPy and scipy.optimize.nnls in tests/sci-tools/dls-analyser.mjs.

export const KB = 1.380649e-23; // J/K, exact (SI 2019)

/** Viscosity of liquid water at 1 atm in mPa·s, from the Kestin, Sokolov and Wakeham (1978) correlation
 *  (J. Phys. Chem. Ref. Data 7, 941), referred to 1.002 mPa·s at 20 °C. Good to about 0.2 % from 0 to 100 °C. */
export function waterViscosity(tC: number): number {
  const d = 20 - tC;
  return 1.002 * 10 ** ((d / (tC + 96)) * (1.2378 - 1.303e-3 * d + 3.06e-6 * d * d + 2.55e-8 * d * d * d));
}

/** Scattering vector q = 4πn sin(θ/2) / λ in 1/m, from λ in nm and θ in degrees. */
export const scatteringVector = (n: number, lambdaNm: number, thetaDeg: number) => (4 * Math.PI * n * Math.sin((thetaDeg * Math.PI) / 360)) / (lambdaNm * 1e-9);

export type Setup = { q: number; T: number; eta: number }; // 1/m, K, Pa·s
/** Decay rate Γ (1/s) of g1 for a sphere of hydrodynamic diameter d (m): Γ = D q², D = kT/(3πηd). */
export const gammaOf = (d: number, s: Setup) => (KB * s.T * s.q * s.q) / (3 * Math.PI * s.eta * d);
/** Diameter (m) from a decay rate (1/s), the same relation turned round. */
export const diameterOf = (G: number, s: Setup) => (KB * s.T * s.q * s.q) / (3 * Math.PI * s.eta * G);

/** Solve a small dense system by Gaussian elimination with partial pivoting. */
export function solve(A: number[][], b: number[]): number[] {
  const n = b.length, M = A.map((r, i) => [...r, b[i]]);
  for (let c = 0; c < n; c++) {
    let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    [M[c], M[p]] = [M[p], M[c]];
    if (M[c][c] === 0) throw new Error('singular');
    for (let r = c + 1; r < n; r++) { const f = M[r][c] / M[c][c]; for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k]; }
  }
  const x = new Array(n).fill(0);
  for (let r = n - 1; r >= 0; r--) { let s = M[r][n]; for (let k = r + 1; k < n; k++) s -= M[r][k] * x[k]; x[r] = s / M[r][r]; }
  return x;
}

export type Cumulants = { order: 2 | 3; n: number; beta: number; Gamma: number; mu2: number; mu3: number; pdi: number; zAvg: number; fit: number[]; rms: number; tauMax: number };

/** Cumulant fit of y = g2 − B against τ (s). Uses the points from the start until y first falls below
 *  `cut` × the intercept estimate (mean of the first three y), weighted by y² (constant relative noise on y). */
export function cumulants(tau: number[], y: number[], s: Setup, order: 2 | 3 = 2, cut = 0.1): Cumulants {
  const y0 = (y[0] + y[1] + y[2]) / 3;
  if (!(y0 > 0)) throw new Error('The correlation does not start above the baseline: check the baseline and that the second column is g2 (or g2 − 1).');
  let n = 0; while (n < y.length && y[n] > cut * y0) n++;
  const k = order + 1;
  if (n < k + 3) throw new Error(`Only ${n} points lie above ${+(cut * 100).toPrecision(3)} % of the intercept: lower the cut-off or add points at short delay times.`);
  const ts = tau[n - 1]; // scale τ for a well-conditioned fit
  const A = Array.from({ length: k }, () => new Array(k).fill(0)), b = new Array(k).fill(0);
  for (let i = 0; i < n; i++) {
    const w = y[i] * y[i], t = tau[i] / ts, row = Array.from({ length: k }, (_, j) => t ** j), ly = Math.log(y[i]);
    for (let r = 0; r < k; r++) { b[r] += w * row[r] * ly; for (let c = 0; c < k; c++) A[r][c] += w * row[r] * row[c]; }
  }
  const p = solve(A, b);
  const Gamma = -p[1] / 2 / ts, mu2 = p[2] / ts ** 2, mu3 = order === 3 ? (-3 * p[3]) / ts ** 3 : 0;
  const beta = Math.exp(p[0]);
  const fit = tau.map((t) => Math.exp(p[0] - 2 * Gamma * t + mu2 * t * t - (mu3 / 3) * t ** 3));
  let ss = 0; for (let i = 0; i < n; i++) ss += (y[i] - fit[i]) ** 2;
  return { order, n, beta, Gamma, mu2, mu3, pdi: mu2 / (Gamma * Gamma), zAvg: diameterOf(Gamma, s), fit, rms: Math.sqrt(ss / n), tauMax: tau[n - 1] };
}

/** Lawson–Hanson NNLS on the normal equations: min ½xᵀGx − hᵀx with x ≥ 0, where G = AᵀA, h = Aᵀb. */
export function nnlsGram(G: number[][], h: number[], maxIter = 2000): number[] {
  const n = h.length, x = new Array(n).fill(0), P = new Array(n).fill(false);
  const tol = 1e-12 * Math.max(1e-300, ...h.map(Math.abs)) * n;
  const sub = (idx: number[]) => solve(idx.map((i) => idx.map((j) => G[i][j])), idx.map((i) => h[i]));
  for (let it = 0; it < maxIter; it++) {
    const w = h.map((hi, i) => hi - G[i].reduce((s, g, j) => s + g * x[j], 0));
    let j = -1, best = tol;
    for (let t = 0; t < n; t++) if (!P[t] && w[t] > best) { best = w[t]; j = t; }
    if (j < 0) break;
    P[j] = true;
    for (let inner = 0; inner < 3 * n; inner++) {
      const idx = P.map((p, t) => (p ? t : -1)).filter((t) => t >= 0), z = sub(idx);
      if (z.every((v) => v > 0)) { idx.forEach((t, i) => { x[t] = z[i]; }); break; }
      let a = Infinity;
      idx.forEach((t, i) => { if (z[i] <= 0) a = Math.min(a, x[t] / (x[t] - z[i])); });
      idx.forEach((t, i) => { x[t] += a * (z[i] - x[t]); if (x[t] <= 1e-15 * Math.max(1, ...x)) { x[t] = 0; P[t] = false; } });
    }
  }
  return x;
}

export type Peak = { lo: number; hi: number; mean: number; mode: number; sd: number; area: number };
export type Dist = {
  d: number[]; intensity: number[]; volume: number[]; number: number[]; // diameters in nm, each distribution in % (sums to 100)
  c: number[]; nPts: number; fit: number[]; rms: number; alphaEff: number; harmonic: number;
  peaks: { intensity: Peak[]; volume: Peak[]; number: Peak[] };
};

/** Log-spaced diameters (nm) from dMin to dMax. */
export const grid = (dMin: number, dMax: number, bins: number) => Array.from({ length: bins }, (_, i) => dMin * (dMax / dMin) ** (i / (bins - 1)));

/** Points used in the distribution fit: from the start to the last point where y is above `floor` × the intercept. */
export function distPoints(y: number[], floor = 0.002) {
  const y0 = (y[0] + y[1] + y[2]) / 3;
  let last = 0; for (let i = 0; i < y.length; i++) if (y[i] > floor * y0) last = i;
  return last + 1;
}

/** The regularised problem as normal equations, so the same G and h can be handed to any NNLS solver.
 *  b = signed √y (g1 times √β), K_ij = exp(−Γ_j τ_i), penalty α_eff‖Lc‖² with L the second difference and
 *  α_eff = α √(tr KᵀK / tr LᵀL), so α means the same whatever the number of points or bins. */
export function system(tau: number[], y: number[], dNm: number[], s: Setup, alpha: number) {
  const m = distPoints(y), n = dNm.length;
  const G0 = dNm.map((d) => gammaOf(d * 1e-9, s));
  const K = Array.from({ length: m }, (_, i) => G0.map((g) => Math.exp(-g * tau[i])));
  const b = y.slice(0, m).map((v) => Math.sign(v) * Math.sqrt(Math.abs(v)));
  // Row weights √|y| (floored at 5 % of √intercept) turn the fit of √y into a fit of y itself to first order,
  // so the noisy tail, where √ magnifies the noise, does not dominate.
  const fl = 0.05 * Math.abs(b[0]), wt = b.map((v) => Math.max(Math.abs(v), fl));
  K.forEach((r, i) => { for (let j = 0; j < n; j++) r[j] *= wt[i]; b[i] *= wt[i]; });
  const L: number[][] = [];
  for (let i = 0; i + 2 < n; i++) { const r = new Array(n).fill(0); r[i] = 1; r[i + 1] = -2; r[i + 2] = 1; L.push(r); }
  let tk = 0; for (const r of K) for (const v of r) tk += v * v;
  const tl = 6 * (n - 2); // tr LᵀL: each row of L is 1, −2, 1
  const a = alpha * Math.sqrt(tk / tl);
  const G = Array.from({ length: n }, () => new Array(n).fill(0)), h = new Array(n).fill(0);
  for (let i = 0; i < m; i++) { const r = K[i]; for (let p = 0; p < n; p++) { if (r[p] === 0) continue; h[p] += r[p] * b[i]; for (let q = 0; q < n; q++) G[p][q] += r[p] * r[q]; } }
  for (const r of L) for (let p = 0; p < n; p++) { if (!r[p]) continue; for (let q = 0; q < n; q++) G[p][q] += a * a * r[p] * r[q]; }
  return { K, b, L, G, h, m, alphaEff: a };
}

function peaks(d: number[], v: number[], rel = 0.01): Peak[] {
  const mx = Math.max(...v), out: Peak[] = [];
  let i = 0;
  while (i < v.length) {
    if (v[i] <= rel * mx) { i++; continue; }
    let j = i; while (j + 1 < v.length && v[j + 1] > rel * mx) j++;
    let a = 0, m1 = 0, m2 = 0, mode = i;
    for (let k = i; k <= j; k++) { a += v[k]; m1 += v[k] * d[k]; if (v[k] > v[mode]) mode = k; }
    const mean = m1 / a;
    for (let k = i; k <= j; k++) m2 += v[k] * (d[k] - mean) ** 2;
    out.push({ lo: d[i], hi: d[j], mean, mode: d[mode], sd: Math.sqrt(m2 / a), area: a });
    i = j + 1;
  }
  const tot = out.reduce((s, p) => s + p.area, 0);
  out.forEach((p) => (p.area = (100 * p.area) / tot));
  return out.sort((p, q) => q.area - p.area);
}

const pct = (v: number[]) => { const t = v.reduce((s, x) => s + x, 0); return v.map((x) => (t > 0 ? (100 * x) / t : 0)); };

/** Regularised size distribution from y = g2 − B. */
export function distribution(tau: number[], y: number[], s: Setup, o: { dMin: number; dMax: number; bins: number; alpha: number }): Dist {
  const d = grid(o.dMin, o.dMax, o.bins);
  const { G, h, m, alphaEff } = system(tau, y, d, s, o.alpha);
  const c = nnlsGram(G, h), G0 = d.map((dd) => gammaOf(dd * 1e-9, s));
  const g = tau.map((t) => G0.reduce((acc, gg, j) => acc + c[j] * Math.exp(-gg * t), 0));
  const fit = g.map((v) => v * v);
  let ss = 0; for (let i = 0; i < m; i++) ss += (y[i] - fit[i]) ** 2;
  const intensity = pct(c), volume = pct(c.map((x, j) => x / d[j] ** 3)), number = pct(c.map((x, j) => x / d[j] ** 6));
  const harmonic = 100 / intensity.reduce((acc, x, j) => acc + x / d[j], 0);
  return { d, intensity, volume, number, c, nPts: m, fit, rms: Math.sqrt(ss / m), alphaEff, harmonic, peaks: { intensity: peaks(d, intensity), volume: peaks(d, volume), number: peaks(d, number) } };
}

/** Baseline B: 1 for a normalised g2, the mean of the last `frac` of points, or a typed value. */
export function baseline(g2: number[], mode: 'one' | 'tail' | 'none', frac = 0.05): number {
  if (mode === 'none') return 0;
  if (mode === 'one') return 1;
  const k = Math.max(3, Math.round(g2.length * frac)), t = g2.slice(-k);
  return t.reduce((a, b) => a + b, 0) / t.length;
}

/** Made-up example: 25 °C water, 633 nm, 173°, two populations given as intensity weights on a lognormal
 *  (centred 60 nm, σ_ln 0.15, 85 % of the light; 400 nm, σ_ln 0.1, 15 %), β = 0.92, small seeded noise. */
export function exampleData() {
  const s: Setup = { q: scatteringVector(1.33, 633, 173), T: 298.15, eta: waterViscosity(25) * 1e-3 };
  const pops = [{ d: 60, sl: 0.15, w: 0.85 }, { d: 400, sl: 0.1, w: 0.15 }];
  const comp: { G: number; w: number }[] = [];
  for (const p of pops) {
    let tot = 0; const part: { G: number; w: number }[] = [];
    for (let k = -40; k <= 40; k++) { const z = k / 10, w = Math.exp(-z * z / 2); tot += w; part.push({ G: gammaOf(p.d * Math.exp(z * p.sl) * 1e-9, s), w }); }
    part.forEach((c) => comp.push({ G: c.G, w: (c.w / tot) * p.w }));
  }
  let seed = 12345;
  const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  const gauss = () => { let a = 0; for (let i = 0; i < 12; i++) a += rnd(); return a - 6; };
  const tau: number[] = [], g2: number[] = [];
  for (let i = 0; i < 140; i++) {
    const t = 0.5e-6 * (1e-1 / 0.5e-6) ** (i / 139);
    const g1 = comp.reduce((a, c) => a + c.w * Math.exp(-c.G * t), 0);
    tau.push(+(t * 1e6).toPrecision(5)); g2.push(+(1 + 0.92 * g1 * g1 + 0.0015 * gauss()).toFixed(6));
  }
  return { tauUs: tau, g2 };
}

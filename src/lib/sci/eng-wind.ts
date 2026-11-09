// Wind turbine energy yield: a Weibull fit to wind speeds (maximum likelihood), hub-height shear (power or log law),
// an air-density adjustment of the power curve, annual energy production and capacity factor. Plain TypeScript,
// no DOM.

/** Natural log of the gamma function (Lanczos, g = 7). */
export function lnGamma(x: number): number {
  const c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  if (x < 0.5) return Math.log(Math.PI / Math.abs(Math.sin(Math.PI * x))) - lnGamma(1 - x);
  x -= 1; let a = c[0]; const t = x + 7.5;
  for (let i = 1; i < 9; i++) a += c[i] / (x + i);
  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
}
export const gamma = (x: number) => Math.exp(lnGamma(x));

export const weibullPdf = (v: number, k: number, c: number) => (v < 0 ? 0 : (k / c) * (v / c) ** (k - 1) * Math.exp(-((v / c) ** k)));
export const weibullCdf = (v: number, k: number, c: number) => (v <= 0 ? 0 : 1 - Math.exp(-((v / c) ** k)));
export const weibullMean = (k: number, c: number) => c * gamma(1 + 1 / k);
export const cFromMean = (mean: number, k: number) => mean / gamma(1 + 1 / k);

/**
 * Maximum-likelihood Weibull fit (location fixed at 0) to the speeds above 0. Calms (0 m/s) cannot enter the
 * likelihood and are counted separately.
 */
export function fitWeibull(speeds: number[]) {
  const v = speeds.filter((x) => x > 0), calm = speeds.length - v.length;
  if (v.length < 3) return { k: NaN, c: NaN, n: v.length, calm, iterations: 0 };
  const lnv = v.map(Math.log), meanLn = lnv.reduce((a, b) => a + b, 0) / v.length;
  // Solve g(k) = Σ v^k ln v / Σ v^k − 1/k − mean(ln v) = 0 by Newton's method with bisection safeguard.
  const vmax = Math.max(...v);
  const g = (k: number) => {
    let s0 = 0, s1 = 0, s2 = 0;
    for (let i = 0; i < v.length; i++) { const w = (v[i] / vmax) ** k, l = lnv[i]; s0 += w; s1 += w * l; s2 += w * l * l; }
    return { f: s1 / s0 - 1 / k - meanLn, df: (s2 * s0 - s1 * s1) / (s0 * s0) + 1 / (k * k) };
  };
  let lo = 0.05, hi = 50, k = 2, it = 0;
  for (; it < 200; it++) {
    const { f, df } = g(k);
    if (f > 0) hi = k; else lo = k;
    let nk = k - f / df;
    if (!(nk > lo && nk < hi)) nk = (lo + hi) / 2;
    if (Math.abs(nk - k) < 1e-12 * k) { k = nk; break; }
    k = nk;
  }
  const c = vmax * (v.reduce((a, x) => a + (x / vmax) ** k, 0) / v.length) ** (1 / k);
  return { k, c, n: v.length, calm, iterations: it };
}

/** Speed at hub height from a measurement height: power law (alpha) or log law (roughness z0, m). */
export function shear(v: number, h0: number, h: number, law: 'power' | 'log', p: number) {
  return law === 'power' ? v * (h / h0) ** p : v * (Math.log(h / p) / Math.log(h0 / p));
}

export type Curve = { v: number[]; P: number[] };
/** Read "speed power" pairs (m/s, kW). Lines that do not start with two numbers are skipped. */
export function readPowerCurve(text: string): { curve: Curve; skipped: number; error?: string } {
  const v: number[] = [], P: number[] = []; let skipped = 0;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim(); if (!line) continue;
    const f = line.split(/[\s,;\t]+/).map(Number);
    if (f.length < 2 || !Number.isFinite(f[0]) || !Number.isFinite(f[1])) { skipped++; continue; }
    v.push(f[0]); P.push(f[1]);
  }
  if (v.length < 3) return { curve: { v, P }, skipped, error: 'Give at least three wind speed and power pairs.' };
  for (let i = 1; i < v.length; i++) if (!(v[i] > v[i - 1])) return { curve: { v, P }, skipped, error: `The wind speeds must go up line by line (check ${v[i]} m/s).` };
  if (v[0] < 0 || P.some((x) => x < 0)) return { curve: { v, P }, skipped, error: 'Speeds and powers cannot be negative.' };
  return { curve: { v, P }, skipped };
}

/** A generic, made-up power curve: ½ρAv³Cp up to the rated power, between cut-in and cut-out, every 0.5 m/s. */
export function genericCurve(ratedKW: number, diameter: number, cp: number, cutIn: number, cutOut: number, rho = 1.225): Curve {
  const A = (Math.PI * diameter * diameter) / 4, v: number[] = [], P: number[] = [];
  for (let s = 0; s <= cutOut + 1e-9; s += 0.5) {
    v.push(s); P.push(s < cutIn ? 0 : Math.min(ratedKW, (0.5 * rho * A * s ** 3 * cp) / 1000));
  }
  return { v, P };
}

/** Power (kW) from the curve at speed s, straight lines between points, 0 outside the curve. */
export function powerAt(c: Curve, s: number) {
  const n = c.v.length;
  if (s < c.v[0] || s > c.v[n - 1]) return 0;
  let i = 1; while (i < n - 1 && c.v[i] < s) i++;
  const t = (s - c.v[i - 1]) / (c.v[i] - c.v[i - 1]);
  return c.P[i - 1] + t * (c.P[i] - c.P[i - 1]);
}

/**
 * Annual energy (kWh) from a Weibull distribution and a power curve, with the curve adjusted to the site's air
 * density by the equivalent-speed method for pitch-regulated turbines: P_site(v) = P_curve(v (ρ/ρ0)^(1/3)).
 * Simpson's rule on 0.01 m/s steps. The share of calm hours (if any) produces nothing.
 */
export function aep(curve: Curve, k: number, c: number, rho = 1.225, rho0 = 1.225, calmShare = 0) {
  const vmax = curve.v[curve.v.length - 1] / Math.cbrt(rho / rho0) + 0.5, n = Math.ceil(vmax / 0.01 / 2) * 2, h = vmax / n;
  const f = (s: number) => powerAt(curve, s * Math.cbrt(rho / rho0)) * weibullPdf(s, k, c);
  let sum = f(0) + f(vmax);
  for (let i = 1; i < n; i++) sum += (i % 2 ? 4 : 2) * f(i * h);
  const meanKW = ((sum * h) / 3) * (1 - calmShare);
  return { meanKW, kWh: meanKW * 8760 };
}

/** Energy from the measured speeds directly (each value stands for an equal share of the year). */
export function aepFromData(curve: Curve, speeds: number[], rho = 1.225, rho0 = 1.225) {
  const k = Math.cbrt(rho / rho0), m = speeds.reduce((a, s) => a + powerAt(curve, s * k), 0) / speeds.length;
  return { meanKW: m, kWh: m * 8760 };
}

/** Mean wind power density (W/m²) of a Weibull distribution: ½ ρ c³ Γ(1 + 3/k). */
export const powerDensity = (k: number, c: number, rho = 1.225) => 0.5 * rho * c ** 3 * gamma(1 + 3 / k);

/** A made-up year of hourly wind speeds drawn from a Weibull distribution with a fixed seed (rounded to 0.1 m/s). */
export function exampleSpeeds(n = 8760, k = 2.1, c = 7.2, seed = 12345) {
  let s = seed >>> 0; const out: number[] = [];
  for (let i = 0; i < n; i++) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    const u = (s + 0.5) / 4294967296;
    out.push(Math.round(c * (-Math.log(1 - u)) ** (1 / k) * 10) / 10);
  }
  return out;
}

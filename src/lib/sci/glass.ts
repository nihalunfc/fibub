// Glass transition of random copolymers, blends and plasticised systems: Fox, Gordon–Taylor (with the Simha–Boyer
// rule for k) and Kwei; the composition that gives a target Tg; and the Flory–Fox molar mass effect.

export const K0 = 273.15;

/** Typical homopolymer Tg (°C, DSC midpoint) and amorphous density (g/cm³), with repeat unit molar mass (g/mol).
 *  Values vary with tacticity, molar mass, moisture and method by 5 to 20 °C; they are starting points to edit. */
export const MATERIALS = [
  { id: 'MMA', name: 'Methyl methacrylate (PMMA)', tg: 105, rho: 1.18, M: 100.12 },
  { id: 'S', name: 'Styrene (PS)', tg: 100, rho: 1.05, M: 104.15 },
  { id: 'BA', name: 'n-Butyl acrylate (PBA)', tg: -54, rho: 1.08, M: 128.17 },
  { id: 'EHA', name: '2-Ethylhexyl acrylate', tg: -50, rho: 0.99, M: 184.28 },
  { id: 'EA', name: 'Ethyl acrylate (PEA)', tg: -24, rho: 1.12, M: 100.12 },
  { id: 'MA', name: 'Methyl acrylate (PMA)', tg: 10, rho: 1.22, M: 86.09 },
  { id: 'BMA', name: 'n-Butyl methacrylate', tg: 20, rho: 1.05, M: 142.2 },
  { id: 'EMA', name: 'Ethyl methacrylate', tg: 65, rho: 1.11, M: 114.14 },
  { id: 'VAc', name: 'Vinyl acetate (PVAc)', tg: 30, rho: 1.19, M: 86.09 },
  { id: 'AA', name: 'Acrylic acid (PAA)', tg: 106, rho: 1.41, M: 72.06 },
  { id: 'VC', name: 'Vinyl chloride (PVC)', tg: 81, rho: 1.39, M: 62.5 },
  { id: 'PC', name: 'Bisphenol A polycarbonate', tg: 147, rho: 1.2, M: 254.28 },
  { id: 'PET', name: 'PET (amorphous)', tg: 75, rho: 1.33, M: 192.17 },
  { id: 'PLA', name: 'PLA (amorphous PDLLA)', tg: 55, rho: 1.25, M: 72.06 },
  { id: 'PEO', name: 'Poly(ethylene oxide)', tg: -67, rho: 1.13, M: 44.05 },
  { id: 'PDMS', name: 'Polydimethylsiloxane', tg: -125, rho: 0.97, M: 74.15 },
  { id: 'PVP', name: 'PVP (K30)', tg: 163, rho: 1.25, M: 111.14 },
  { id: 'SUC', name: 'Sucrose (amorphous)', tg: 62, rho: 1.58, M: 342.3 },
  { id: 'H2O', name: 'Water', tg: -137, rho: 1.0, M: 18.015 },
];
export const material = (id: string) => MATERIALS.find((m) => m.id === id);

/** Fox: 1/Tg = Σ wᵢ/Tgᵢ (weight fractions, temperatures in kelvin). Weights are normalised. */
export function fox(w: number[], TgK: number[]) {
  const s = w.reduce((a, b) => a + b, 0);
  return 1 / w.reduce((a, wi, i) => a + wi / s / TgK[i], 0);
}
/** Weight-average (linear) mixing rule, for comparison. */
export const linear = (w: number[], TgK: number[]) => { const s = w.reduce((a, b) => a + b, 0); return w.reduce((a, wi, i) => a + (wi / s) * TgK[i], 0); };

/** Gordon–Taylor (+ Kwei q): Tg = (w1·Tg1 + k·w2·Tg2)/(w1 + k·w2) + q·w1·w2, with w2 the weight fraction of component 2. */
export const gordonTaylor = (w2: number, Tg1: number, Tg2: number, k: number, q = 0) => { const w1 = 1 - w2; return (w1 * Tg1 + k * w2 * Tg2) / (w1 + k * w2) + q * w1 * w2; };
/** Simha–Boyer estimate k = ρ1·Tg1/(ρ2·Tg2) (temperatures in kelvin). */
export const simhaBoyer = (rho1: number, Tg1: number, rho2: number, Tg2: number) => (rho1 * Tg1) / (rho2 * Tg2);

/** Weight fraction w2 giving Tg = target, by bisection on [0, 1]; null if the target is out of reach. */
export function solveGT(target: number, Tg1: number, Tg2: number, k: number, q = 0) {
  const g = (w: number) => gordonTaylor(w, Tg1, Tg2, k, q) - target;
  let a = 0, b = 1, ga = g(a), gb = g(b);
  if (Math.abs(ga) < 1e-12) return 0; if (Math.abs(gb) < 1e-12) return 1;
  if (ga * gb > 0) { // a Kwei curve can bend; scan for a sign change
    let prev = 0, gp = ga; for (let i = 1; i <= 400; i++) { const w = i / 400, gw = g(w); if (gp * gw <= 0) { a = prev; b = w; ga = gp; break; } prev = w; gp = gw; if (i === 400) return null; }
  }
  for (let i = 0; i < 100; i++) { const m = (a + b) / 2, gm = g(m); if (ga * gm <= 0) b = m; else { a = m; ga = gm; } }
  return (a + b) / 2;
}

/** Fox with two components traded and the rest fixed: weight fraction of A (out of all) that gives the target.
 *  fixed = [{w, Tg}] for the other components (weight fractions of the total); A and B share what is left. */
export function foxTrade(targetK: number, TgA: number, TgB: number, fixed: { w: number; Tg: number }[]) {
  const S = fixed.reduce((s, c) => s + c.w / c.Tg, 0), R = 1 - fixed.reduce((s, c) => s + c.w, 0);
  if (!(R > 0) || TgA === TgB) return null;
  const wA = (1 / targetK - S - R / TgB) / (1 / TgA - 1 / TgB);
  return wA >= -1e-12 && wA <= R + 1e-12 ? { wA: Math.min(Math.max(wA, 0), R), wB: R - Math.min(Math.max(wA, 0), R), R } : null;
}

/** Weight fractions to mole fractions with repeat unit molar masses. */
export const moleFractions = (w: number[], M: number[]) => { const n = w.map((wi, i) => wi / M[i]), s = n.reduce((a, b) => a + b, 0); return n.map((x) => x / s); };

/** Flory–Fox: Tg = Tg∞ − K/Mn (K in K·g/mol). */
export const floryFox = (TgInf: number, K: number, Mn: number) => TgInf - K / Mn;
/** Mn below which Tg is more than d degrees under Tg∞. */
export const floryFoxMn = (K: number, d: number) => K / d;

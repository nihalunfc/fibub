// Linear elastic fracture mechanics: stress intensity K = Y σ √(πa) for common crack geometries, critical crack size
// and critical stress against a fracture toughness, the ASTM E399 plane-strain size check 2.5 (K/σy)², Irwin's
// plastic zone, and fatigue crack growth life from Paris' law by numerical integration.
// Geometry factors are the textbook forms: Feddersen's secant and Tada's fits for finite width (Tada, Paris and
// Irwin, The Stress Analysis of Cracks Handbook; as quoted in Anderson, Fracture Mechanics, ch. 2, and Dowling,
// Mechanical Behavior of Materials, ch. 8). a is the half length of a centre crack or the depth of an edge crack;
// W is the full plate width. Units: σ in MPa, a in m, K in MPa√m.

export type Geometry = 'centre-inf' | 'centre-secant' | 'centre-tada' | 'edge-inf' | 'edge-finite' | 'double-edge' | 'penny' | 'custom';

export const GEOMETRY: Record<Geometry, { name: string; width: boolean; formula: string; maxRatio?: number }> = {
  'centre-inf': { name: 'Centre crack, wide plate', width: false, formula: 'Y = 1' },
  'centre-secant': { name: 'Centre crack, finite width (secant)', width: true, formula: 'Y = √sec(πa/W) (Feddersen)', maxRatio: 0.5 },
  'centre-tada': { name: 'Centre crack, finite width (Tada)', width: true, formula: 'Y = (1 − 0.025α² + 0.06α⁴) √sec(πα/2), α = 2a/W', maxRatio: 0.5 },
  'edge-inf': { name: 'Edge crack, wide plate', width: false, formula: 'Y = 1.12 (1.1215)' },
  'edge-finite': { name: 'Single edge crack, finite width', width: true, formula: 'Y = 1.12 − 0.231(a/W) + 10.55(a/W)² − 21.72(a/W)³ + 30.39(a/W)⁴, a/W ≤ 0.6', maxRatio: 0.6 },
  'double-edge': { name: 'Two edge cracks, finite width', width: true, formula: 'Y = (1.122 − 0.561α − 0.205α² + 0.471α³ − 0.190α⁴) ÷ √(1 − α), α = 2a/W', maxRatio: 0.5 },
  penny: { name: 'Buried round (penny) crack, radius a', width: false, formula: 'Y = 2/π' },
  custom: { name: 'Your own Y', width: false, formula: 'Y constant' },
};

/** Geometry factor Y at crack size a (m) in a plate of full width W (m). */
export function geometryFactor(g: Geometry, a: number, W = Infinity, custom = 1): number {
  switch (g) {
    case 'centre-inf': return 1;
    case 'centre-secant': return Math.sqrt(1 / Math.cos((Math.PI * a) / W));
    case 'centre-tada': { const x = (2 * a) / W; return (1 - 0.025 * x * x + 0.06 * x ** 4) * Math.sqrt(1 / Math.cos((Math.PI * x) / 2)); }
    case 'edge-inf': return 1.1215;
    case 'edge-finite': { const r = a / W; return 1.12 - 0.231 * r + 10.55 * r * r - 21.72 * r ** 3 + 30.39 * r ** 4; }
    case 'double-edge': { const x = (2 * a) / W; return (1.122 - 0.561 * x - 0.205 * x * x + 0.471 * x ** 3 - 0.19 * x ** 4) / Math.sqrt(1 - x); }
    case 'penny': return 2 / Math.PI;
    case 'custom': return custom;
  }
}

/** Largest crack size (m) the formula allows, or Infinity. */
export function maxCrack(g: Geometry, W: number): number {
  const r = GEOMETRY[g].maxRatio;
  if (!GEOMETRY[g].width) return Infinity;
  // Beyond these the formula is outside its stated range (centre and double-edge: crack(s) reach the edge at a = W/2).
  return g === 'edge-finite' ? (r as number) * W : 0.5 * W * 0.999;
}

export const stressIntensity = (g: Geometry, sigma: number, a: number, W = Infinity, custom = 1) => geometryFactor(g, a, W, custom) * sigma * Math.sqrt(Math.PI * a);

/** Stress at which a crack of size a reaches K_IC. */
export const criticalStress = (g: Geometry, KIc: number, a: number, W = Infinity, custom = 1) => KIc / (geometryFactor(g, a, W, custom) * Math.sqrt(Math.PI * a));

/** Crack size at which K reaches K_IC under stress σ (bisection); null if it never does within the formula's range. */
export function criticalCrack(g: Geometry, KIc: number, sigma: number, W = Infinity, custom = 1): number | null {
  const amax = maxCrack(g, W);
  const f = (a: number) => stressIntensity(g, sigma, a, W, custom) - KIc;
  if (!Number.isFinite(amax)) {
    // Constant Y: closed form.
    const Y = geometryFactor(g, 0, W, custom);
    return (KIc / (Y * sigma)) ** 2 / Math.PI;
  }
  let lo = 1e-12, hi = amax;
  if (f(hi) < 0) return null;
  for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if (f(mid) > 0) hi = mid; else lo = mid; }
  return (lo + hi) / 2;
}

/** ASTM E399 plane-strain size: B, a and (W − a) should each be at least 2.5 (K/σy)². */
export const planeStrainSize = (K: number, sy: number) => 2.5 * (K / sy) ** 2;
/** Irwin plastic zone diameter-type size r_p = (1/2π)(K/σy)² in plane stress, a third of that in plane strain. */
export const plasticZone = (K: number, sy: number, planeStrain: boolean) => ((K / sy) ** 2 / (2 * Math.PI)) / (planeStrain ? 3 : 1);

/**
 * Paris law life N = ∫ da / (C ΔKᵐ) from a0 to af, ΔK = Y(a) Δσ √(πa). Integrated by Simpson's rule in ln a with
 * `steps` intervals (even). Returns the life and the a-N curve. C in m/cycle per (MPa√m)ᵐ.
 */
export function parisLife(g: Geometry, o: { a0: number; af: number; dSigma: number; C: number; m: number; W?: number; custom?: number }, steps = 2000) {
  const { a0, af, dSigma, C, m } = o, W = o.W ?? Infinity, cu = o.custom ?? 1;
  if (!(af > a0 && a0 > 0)) throw new Error('The final crack must be larger than the starting crack.');
  const n = steps % 2 ? steps + 1 : steps, u0 = Math.log(a0), h = (Math.log(af) - u0) / n;
  // dN/du = a / (C ΔK^m)
  const g_ = (u: number) => { const a = Math.exp(u); return a / (C * (geometryFactor(g, a, W, cu) * dSigma * Math.sqrt(Math.PI * a)) ** m); };
  const a: number[] = [a0], N: number[] = [0];
  let total = 0;
  for (let i = 0; i < n; i += 2) {
    const f0 = g_(u0 + i * h), f1 = g_(u0 + (i + 1) * h), f2 = g_(u0 + (i + 2) * h);
    total += (h / 3) * (f0 + 4 * f1 + f2);
    a.push(Math.exp(u0 + (i + 2) * h)); N.push(total);
  }
  return { N: total, curve: { a, N } };
}

/** Closed-form Paris life for constant Y (m ≠ 2), used as a check. */
export function parisClosed(Y: number, o: { a0: number; af: number; dSigma: number; C: number; m: number }) {
  const { a0, af, dSigma, C, m } = o, k = C * (Y * dSigma * Math.sqrt(Math.PI)) ** m;
  if (Math.abs(m - 2) < 1e-12) return Math.log(af / a0) / k;
  const p = 1 - m / 2;
  return (af ** p - a0 ** p) / (p * k);
}

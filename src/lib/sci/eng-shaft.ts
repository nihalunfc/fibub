// Rolling bearing life (basic and adjusted) and solid round shaft sizing for combined bending and torsion,
// statically (maximum shear stress or von Mises) and in fatigue (DE-Goodman with an endurance limit you give).
// Units: loads in any one unit for bearings; shafts in N·m and MPa, diameters in mm.

/** Equivalent dynamic load: P = fa (X Fr + Y Fa) when Fa/Fr > e, otherwise fa Fr. */
export function equivalentLoad(Fr: number, Fa: number, X: number, Y: number, e: number, fa = 1) {
  const useXY = Fr > 0 ? Fa / Fr > e : Fa > 0;
  return { P: fa * (useXY ? X * Fr + Y * Fa : Fr), useXY };
}
/** Basic rating life L10 in millions of revolutions: (C/P)^p, p = 3 for ball and 10/3 for roller bearings. */
export const L10 = (C: number, P: number, p: number) => (C / P) ** p;
/** Millions of revolutions to hours at n rpm. */
export const hours = (Lmrev: number, rpm: number) => (Lmrev * 1e6) / (60 * rpm);
/** Reliability factor from a two-parameter Weibull life distribution through L10 at 90 %:
 * a1 = (ln(1/R) / ln(1/0.9))^(1/b), b the Weibull slope. */
export const reliabilityFactor = (R: number, b: number) => (Math.log(1 / R) / Math.log(1 / 0.9)) ** (1 / b);
/** Dynamic capacity needed for a life of L (millions of revolutions): C = P L^(1/p). */
export const requiredC = (P: number, Lmrev: number, p: number) => P * Lmrev ** (1 / p);
/** Duty cycle: the constant load giving the same life, P = (Σ ni Pi^p / Σ ni)^(1/p), ni the revolutions (or
 * time × speed) at each load. */
export const dutyLoad = (P: number[], n: number[], p: number) => (P.reduce((s, x, i) => s + n[i] * x ** p, 0) / n.reduce((s, x) => s + x, 0)) ** (1 / p);

export type ShaftLoads = { Ma: number; Mm: number; Ta: number; Tm: number; Kf: number; Kfs: number };
/** Alternating and mean von Mises stresses (MPa) in a solid round shaft of diameter d mm, loads in N·m. */
export function shaftStresses(d: number, s: ShaftLoads) {
  const b = 32e3 / (Math.PI * d ** 3), t = 16e3 / (Math.PI * d ** 3);
  const sa = Math.sqrt((s.Kf * s.Ma * b) ** 2 + 3 * (s.Kfs * s.Ta * t) ** 2);
  const sm = Math.sqrt((s.Kf * s.Mm * b) ** 2 + 3 * (s.Kfs * s.Tm * t) ** 2);
  const smax = Math.sqrt((s.Kf * (s.Ma + s.Mm) * b) ** 2 + 3 * (s.Kfs * (s.Ta + s.Tm) * t) ** 2);
  return { sa, sm, smax };
}
/** DE-Goodman safety factor: 1/n = σa'/Se + σm'/Sut. */
export const goodmanN = (d: number, s: ShaftLoads, Se: number, Sut: number) => { const r = shaftStresses(d, s); return 1 / (r.sa / Se + r.sm / Sut); };
/** DE-Goodman diameter (mm) for a safety factor n (Shigley's closed form). */
export function goodmanD(n: number, s: ShaftLoads, Se: number, Sut: number) {
  const A = Math.sqrt(4 * (s.Kf * s.Ma) ** 2 + 3 * (s.Kfs * s.Ta) ** 2), B = Math.sqrt(4 * (s.Kf * s.Mm) ** 2 + 3 * (s.Kfs * s.Tm) ** 2);
  return ((16e3 * n) / Math.PI * (A / Se + B / Sut)) ** (1 / 3);
}
/** Static diameters (mm) for peak M and T (N·m), yield Sy (MPa), safety factor n: maximum shear stress (Tresca),
 * d = (32 n √(M² + T²) / (π Sy))^⅓, and distortion energy (von Mises), d = (32 n √(M² + ¾T²) / (π Sy))^⅓. */
export const trescaD = (M: number, T: number, Sy: number, n: number) => ((32e3 * n * Math.sqrt(M * M + T * T)) / (Math.PI * Sy)) ** (1 / 3);
export const misesD = (M: number, T: number, Sy: number, n: number) => ((32e3 * n * Math.sqrt(M * M + 0.75 * T * T)) / (Math.PI * Sy)) ** (1 / 3);

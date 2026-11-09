// Bolted joints: tensile stress area from the thread, preload, tightening torque (nut factor or thread and
// bearing friction), bolt and clamped-member stiffness, joint constant, separation load and safety factors.
// SI units throughout (mm, N, MPa = N/mm², N·mm); the page converts inch sizes.

/** Tensile stress area (π/4)((d2 + d3)/2)², the mean of the pitch and minor diameters. ISO metric (ISO 898-1):
 * d3 = d − 1.2269 P gives (π/4)(d − 0.9382 P)². Unified inch (UNC/UNF, ASME B1.1) takes the minor diameter
 * d − 1.2990 P, giving (π/4)(d − 0.9743 P)², usually written 0.7854 (D − 0.9743/n)². d and P in one unit. */
export const stressArea = (d: number, P: number, system: 'iso' | 'un' = 'iso') =>
  (Math.PI / 4) * (d - (system === 'iso' ? (3 * Math.sqrt(3) / 8 + 17 * Math.sqrt(3) / 24) / 2 : (3 * Math.sqrt(3) / 8 + 3 * Math.sqrt(3) / 4) / 2) * P) ** 2;
/** Pitch diameter d2 = d − 0.6495 P and external minor diameter d3 = d − 1.2269 P (basic 60° profile). */
export const pitchDia = (d: number, P: number) => d - (3 * Math.sqrt(3) / 8) * P;
export const minorDia = (d: number, P: number) => d - (17 * Math.sqrt(3) / 24) * P;

/** Short-form torque T = K F d. */
export const torqueK = (K: number, F: number, d: number) => K * F * d;

/** Long-form torque (the split used in ISO 16047 and VDI 2230): pitch term + thread friction + bearing friction.
 * T = F (P/2π + μt d2 / (2 cos 30°) + μb Dm / 2), with Dm the mean bearing diameter (Dw + Dh)/2. */
export function torqueFriction(F: number, d: number, P: number, mut: number, mub: number, Dw: number, Dh: number) {
  const d2 = pitchDia(d, P), Dm = (Dw + Dh) / 2;
  const pitch = F * P / (2 * Math.PI), thread = F * mut * d2 / (2 * Math.cos(Math.PI / 6)), bearing = F * mub * Dm / 2;
  const T = pitch + thread + bearing;
  return { T, pitch, thread, bearing, K: T / (F * d) };
}

/** Bolt stiffness: the plain shank (area πd²/4, length ld) and the threaded part in the grip (stress area, length
 * lt) as springs in series. */
export const boltStiffness = (d: number, As: number, E: number, ld: number, lt: number) => {
  const Ad = (Math.PI * d * d) / 4;
  return (Ad * As * E) / (Ad * lt + As * ld);
};

/** One pressure-cone frustum (half-angle α, smaller face diameter D, thickness t, hole d) as a spring. */
export function frustumStiffness(E: number, d: number, D: number, t: number, alpha = Math.PI / 6) {
  const ta = Math.tan(alpha);
  return (Math.PI * E * d * ta) / Math.log(((2 * t * ta + D - d) * (D + d)) / ((2 * t * ta + D + d) * (D - d)));
}

/** Clamped members of one material, grip l, washer face 1.5 d, 30° cones from both ends meeting in the middle. */
export const memberStiffness = (E: number, d: number, l: number) => {
  const k1 = frustumStiffness(E, d, 1.5 * d, l / 2);
  return k1 / 2;
};

export type Joint = {
  d: number; P: number; system?: 'iso' | 'un'; Sp: number; frac: number; E: number; Em: number; grip: number; shank: number; load: number;
  /** Preload in N; if missing, frac × Sp × As. */
  Fi?: number;
};
export function joint(j: Joint) {
  if (!(j.d > 0 && j.P > 0 && j.P < j.d / 2)) throw new Error('Give the diameter and a pitch less than half of it.');
  if (!(j.grip > 0 && j.shank >= 0 && j.shank <= j.grip)) throw new Error('Give the grip length, and a plain shank no longer than the grip.');
  if (!(j.E > 0 && j.Em > 0)) throw new Error('Give both stiffnesses (E).');
  const As = stressArea(j.d, j.P, j.system ?? 'iso');
  const Fi = j.Fi ?? j.frac * j.Sp * As;
  const kb = boltStiffness(j.d, As, j.E, j.shank, j.grip - j.shank);
  const km = memberStiffness(j.Em, j.d, j.grip);
  const C = kb / (kb + km);
  const P = j.load;
  const P0 = Fi / (1 - C), sep = P > P0;
  // Past separation the members carry nothing and the bolt takes the whole load.
  const Fb = sep ? P : Fi + C * P, Fm = sep ? 0 : Fi - (1 - C) * P;
  return {
    As, Fi, kb, km, C, P0, Fb, Fm,
    preloadStress: Fi / As, boltStress: Fb / As,
    /** Load factor against separation, n0 = Fi / (P (1 − C)). */
    nSep: P > 0 ? Fi / (P * (1 - C)) : Infinity,
    /** Load factor against the bolt reaching proof, nL = (Sp As − Fi) / (C P). */
    nProof: P > 0 ? (j.Sp * As - Fi) / (C * P) : Infinity,
    /** Yield factor on the bolt stress, np = Sp As / (C P + Fi). */
    np: (j.Sp * As) / (Fb),
    separated: sep,
  };
}

/** Nominal strengths encoded in an ISO property class "a.b": tensile 100a MPa and yield 10ab MPa (the naming
 * rule; actual minimums depend on size and come from the bolt's standard). */
export function propertyClass(s: string): { Rm: number; Re: number } | null {
  const m = /^\s*(\d{1,2})\.(\d)\s*$/.exec(s);
  if (!m) return null;
  const a = +m[1], b = +m[2];
  return { Rm: 100 * a, Re: 10 * a * b };
}

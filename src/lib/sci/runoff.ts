// Rainfall-runoff: rational method peak flow, Kirpich time of concentration, SCS (NRCS) curve number runoff and the
// SCS triangular unit hydrograph peak. Everything in SI inside (mm, ha, m, h, m³/s) unless a function says otherwise. No DOM.

export type Part = { area: number; c?: number; cn?: number };

/** Area-weighted mean of a coefficient over the parts that have it (and an area above zero). */
export function weighted(parts: Part[], key: 'c' | 'cn') {
  let a = 0, s = 0;
  for (const p of parts) { const v = p[key]; if (p.area > 0 && v !== undefined && Number.isFinite(v)) { a += p.area; s += p.area * v; } }
  return a > 0 ? s / a : NaN;
}

/** Rational method peak: SI Q (m³/s) = C i A / 360 with i in mm/h and A in ha; US Q (ft³/s) = C i A with i in in/h and A in acres
 * (the US form leaves out its unit factor of 1.008, as it is normally written). */
export const rationalQ = (C: number, i: number, A: number, us = false) => (us ? C * i * A : (C * i * A) / 360);

/** Kirpich (1940) time of concentration in minutes: 0.0195 L^0.77 S^-0.385, with L the flow length in metres and S the slope in m/m. */
export const kirpich = (L: number, S: number) => 0.0195 * Math.pow(L, 0.77) * Math.pow(S, -0.385);

/** An intensity-duration curve of the form i = a / (t + b)^c, t in minutes; a, b and c are the user's own local constants. */
export const idf = (a: number, b: number, c: number, t: number) => a / Math.pow(t + b, c);

/** Antecedent moisture: curve number for dry (I) or wet (III) conditions from the average (II) one (Chow, Maidment and Mays 1988). */
export const cnDry = (cn: number) => (4.2 * cn) / (10 - 0.058 * cn);
export const cnWet = (cn: number) => (23 * cn) / (10 + 0.13 * cn);

/** Potential maximum retention S in mm for a curve number. */
export const retention = (cn: number) => 25400 / cn - 254;

/** SCS curve number runoff depth (mm) for rainfall P (mm). lambda = 0.2 is the standard initial abstraction ratio;
 * with lambda = 0.05 the retention is converted by S0.05 = 1.42 S0.2 (Hawkins and others, 2002). */
export function scsRunoff(P: number, cn: number, lambda = 0.2) {
  const S0 = retention(cn), S = lambda === 0.05 ? 1.42 * S0 : S0, Ia = lambda * S;
  const Q = P > Ia ? ((P - Ia) * (P - Ia)) / (P - Ia + S) : 0;
  return { S, Ia, Q };
}

/** SCS triangular unit hydrograph: time to peak Tp = D/2 + 0.6 tc (hours), base time 2.67 Tp, and the peak for runoff depth Q (mm)
 * over A (km²) from the triangle's area, qp = 2 A Q / (2.67 Tp × 3.6) m³/s (the familiar 0.208 A Q / Tp). */
export function triangularHydrograph(A: number, Q: number, D: number, tc: number) {
  const Tp = D / 2 + 0.6 * tc, Tb = 2.67 * Tp, qp = (2 * A * Q) / (Tb * 3.6);
  return { Tp, Tb, qp, lag: 0.6 * tc };
}

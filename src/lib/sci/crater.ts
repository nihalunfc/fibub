// Impact craters from pi-group scaling, following Collins, Melosh and Marcus (2005), "Earth Impact Effects Program".

export const BODIES = [
  { id: 'earth', name: 'Earth', g: 9.81, dc: 3200 },
  { id: 'moon', name: 'Moon', g: 1.62, dc: 18000 },
  { id: 'mars', name: 'Mars', g: 3.71, dc: 7000 },
];
export const MT_TNT = 4.184e15;

export type Impact = { L: number; rhoI: number; v: number; angle: number; rhoT: number; g: number; dc: number };

/** Transient crater diameter (m), Collins et al. (2005) eq. 21, for impact speed v (m/s) at the surface. */
export const transient = (p: Impact) => 1.161 * Math.cbrt(p.rhoI / p.rhoT) * p.L ** 0.78 * p.v ** 0.44 * p.g ** -0.22 * Math.cbrt(Math.sin((p.angle * Math.PI) / 180));

export function crater(p: Impact) {
  if (!(p.L > 0 && p.v > 0 && p.rhoI > 0 && p.rhoT > 0)) throw new Error('Size, speed and densities must be above zero');
  if (!(p.angle > 0 && p.angle <= 90)) throw new Error('The impact angle runs from just above 0 to 90 degrees');
  const mass = (Math.PI / 6) * p.rhoI * p.L ** 3, E = 0.5 * mass * p.v * p.v;
  const Dtc = transient(p), dtc = Dtc / (2 * Math.SQRT2);
  // Simple craters collapse to 1.25 times the transient size; above the transition diameter they become complex (eq. 22, 27).
  const simple = 1.25 * Dtc < p.dc;
  const D = simple ? 1.25 * Dtc : (1.17 * Dtc ** 1.13) / p.dc ** 0.13;
  return { mass, E, Mt: E / MT_TNT, Dtc, dtc, D, simple, recurrenceYears: 109 * (E / MT_TNT) ** 0.78 };
}

/** The impactor diameter (m) that makes a final crater of diameter D (m), other things fixed. */
export function impactorFor(D: number, p: Omit<Impact, 'L'>) {
  if (!(D > 0)) throw new Error('The crater diameter must be above zero');
  let lo = 1e-3, hi = 1e6;
  for (let i = 0; i < 200; i++) { const mid = Math.sqrt(lo * hi); if (crater({ ...p, L: mid }).D < D) lo = mid; else hi = mid; }
  return Math.sqrt(lo * hi);
}

/** Diameter (m) of a sphere of density rhoI (kg/m³) that carries energy E (joules) at speed v (m/s). */
export function diameterFromEnergy(E: number, v: number, rhoI: number) {
  if (!(E > 0 && v > 0 && rhoI > 0)) throw new Error('Energy, speed and density must be above zero');
  const mass = (2 * E) / (v * v);
  return Math.cbrt((6 * mass) / (Math.PI * rhoI));
}
/** Energy units, in joules: kilotons and megatons of TNT (1 ton = 4.184 × 10⁹ J, the standard convention). */
export const ENERGY_J: Record<string, number> = { kt: MT_TNT / 1000, Mt: MT_TNT, J: 1 };
export const M_PER_FT = 0.3048, KM_PER_MILE = 1.609344, MPH_PER_KMS = 1000 / 0.44704;

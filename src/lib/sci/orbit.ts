// Rocket equation with staging, and circular-orbit transfers (Hohmann and bi-elliptic).

export const G0 = 9.80665;

export type Stage = { name: string; dry: number; prop: number; isp: number };

/** Δv of each stage, bottom first, carrying everything above it and the payload (Tsiolkovsky). */
export function staging(stages: Stage[], payload: number) {
  if (!stages.length) throw new Error('Add at least one stage');
  for (const s of stages) {
    if (!(s.dry > 0) || !(s.prop >= 0) || !(s.isp > 0)) throw new Error(`${s.name}: dry mass, propellant and Isp must be positive numbers`);
  }
  if (!(payload >= 0)) throw new Error('Payload must be zero or more');
  const out = [];
  let above = payload;
  for (let i = stages.length - 1; i >= 0; i--) {
    const s = stages[i], m0 = above + s.dry + s.prop, mf = above + s.dry;
    out.unshift({ ...s, m0, mf, ratio: m0 / mf, ve: s.isp * G0, dv: s.isp * G0 * Math.log(m0 / mf) });
    above = m0;
  }
  return { stages: out, liftoff: above, dv: out.reduce((a, s) => a + s.dv, 0), payloadFraction: payload / above };
}

/** Propellant for one stage to give Δv: m_prop = m_final (e^(Δv/ve) − 1). */
export const propellantFor = (dv: number, isp: number, finalMass: number) => finalMass * (Math.exp(dv / (isp * G0)) - 1);

export type Body = { id: string; name: string; mu: number /* km³/s² */; radius: number /* km */ };
export const BODIES: Body[] = [
  { id: 'earth', name: 'Earth', mu: 398600.4418, radius: 6378.137 },
  { id: 'moon', name: 'Moon', mu: 4902.800, radius: 1737.4 },
  { id: 'mars', name: 'Mars', mu: 42828.37, radius: 3396.19 },
  { id: 'venus', name: 'Venus', mu: 324858.59, radius: 6051.8 },
  { id: 'jupiter', name: 'Jupiter', mu: 126686534, radius: 71492 },
  { id: 'sun', name: 'Sun', mu: 132712440018, radius: 695700 },
];
export const AU = 149597870.7;

const vc = (mu: number, r: number) => Math.sqrt(mu / r);
const period = (mu: number, a: number) => 2 * Math.PI * Math.sqrt(a ** 3 / mu);

/** Hohmann transfer between circular, coplanar orbits of radius r1 and r2 (km). Speeds in km/s, time in s. */
export function hohmann(mu: number, r1: number, r2: number) {
  if (!(r1 > 0 && r2 > 0)) throw new Error('Both orbits need a radius above zero');
  const a = (r1 + r2) / 2;
  const v1 = vc(mu, r1), v2 = vc(mu, r2);
  const vp = Math.sqrt(mu * (2 / r1 - 1 / a)), va = Math.sqrt(mu * (2 / r2 - 1 / a));
  const dv1 = Math.abs(vp - v1), dv2 = Math.abs(v2 - va);
  // Where the target must be at departure: it moves (π − lead) while the craft goes half way round.
  const tof = period(mu, a) / 2, lead = Math.PI - (2 * Math.PI * tof) / period(mu, r2);
  const T1 = period(mu, r1), T2 = period(mu, r2), synodic = 1 / Math.abs(1 / T1 - 1 / T2);
  return { a, e: Math.abs(r2 - r1) / (r2 + r1), v1, v2, dv1, dv2, dv: dv1 + dv2, tof, lead, T1, T2, synodic };
}

/** Bi-elliptic transfer through an intermediate apoapsis rb (rb ≥ both radii). */
export function biElliptic(mu: number, r1: number, r2: number, rb: number) {
  if (!(rb >= Math.max(r1, r2))) throw new Error('The intermediate radius must be at least as large as both orbits');
  const a1 = (r1 + rb) / 2, a2 = (r2 + rb) / 2;
  const dv1 = Math.sqrt(mu * (2 / r1 - 1 / a1)) - vc(mu, r1);
  const dv2 = Math.abs(Math.sqrt(mu * (2 / rb - 1 / a2)) - Math.sqrt(mu * (2 / rb - 1 / a1)));
  const dv3 = Math.abs(Math.sqrt(mu * (2 / r2 - 1 / a2)) - vc(mu, r2));
  return { dv1, dv2, dv3, dv: dv1 + dv2 + dv3, tof: period(mu, a1) / 2 + period(mu, a2) / 2 };
}

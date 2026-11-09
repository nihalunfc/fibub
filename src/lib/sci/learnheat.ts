// Heating curve of water and simple calorimetry for the school tool heating-curve: Q = mcΔT for warming, Q = mL for
// melting and boiling, the time each stage takes at a steady power, and the final temperature of a mixture (with
// melting ice). Rounded school values of the specific and latent heats. Plain maths, no DOM.
export const C_ICE = 2100; // J/(kg K), rounded
export const C_WATER = 4200; // J/(kg K), rounded school value (4186 more exactly)
export const C_STEAM = 2000; // J/(kg K), rounded
export const L_FUSION = 3.34e5; // J/kg
export const L_VAPOUR = 2.26e6; // J/kg

export type Stage = { name: string; kind: 'warm' | 'melt' | 'boil'; Q: number; t0: number; t1: number; T0: number; T1: number };
/** Stages of heating mass m (kg) of ice at T0 (°C, ≤ 0) up to Tend (°C) with steady power P (W). */
export function heatingStages(m: number, P: number, T0: number, Tend: number): Stage[] {
  const out: Stage[] = []; let t = 0;
  const add = (name: string, kind: Stage['kind'], Q: number, Ta: number, Tb: number) => { if (Q <= 0) return; out.push({ name, kind, Q, t0: t, t1: t + Q / P, T0: Ta, T1: Tb }); t += Q / P; };
  add('Ice warms up', 'warm', m * C_ICE * (Math.min(0, Tend) - T0), T0, Math.min(0, Tend));
  if (Tend > 0 || Tend === 0) add('Ice melts', 'melt', Tend >= 0 ? m * L_FUSION : 0, 0, 0);
  if (Tend > 0) add('Water warms up', 'warm', m * C_WATER * (Math.min(100, Tend) - 0), 0, Math.min(100, Tend));
  if (Tend >= 100) add('Water boils', 'boil', m * L_VAPOUR, 100, 100);
  if (Tend > 100) add('Steam warms up', 'warm', m * C_STEAM * (Tend - 100), 100, Tend);
  return out;
}
/** Temperature and stage at time t (s). */
export function tempAt(stages: Stage[], t: number) {
  if (!stages.length) return { T: NaN, i: -1, frac: 0 };
  for (let i = 0; i < stages.length; i++) {
    const s = stages[i];
    if (t <= s.t1) { const f = Math.max(0, (t - s.t0) / (s.t1 - s.t0)); return { T: s.T0 + (s.T1 - s.T0) * f, i, frac: f }; }
  }
  const s = stages[stages.length - 1]; return { T: s.T1, i: stages.length - 1, frac: 1 };
}

export type Body = { m: number; c: number; T: number };
/** Final temperature when bodies share heat with no losses and no change of state: Σ m c (T − Ti) = 0. */
export const mixTemp = (bs: Body[]) => bs.reduce((a, b) => a + b.m * b.c * b.T, 0) / bs.reduce((a, b) => a + b.m * b.c, 0);
/** Ice at 0 °C dropped into water: final temperature and how much ice melts. */
export function iceIntoWater(mIce: number, mWater: number, Tw: number) {
  const avail = mWater * C_WATER * Tw, need = mIce * L_FUSION;
  if (avail >= need) return { T: (avail - need) / ((mIce + mWater) * C_WATER), melted: mIce, allMelts: true };
  return { T: 0, melted: avail / L_FUSION, allMelts: false };
}

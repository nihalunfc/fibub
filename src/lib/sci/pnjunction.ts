// p-n junction (school level, Class 12 semiconductors): depletion layer width and barrier height with bias, the
// diode equation I = Is (e^(V/ηVT) − 1), Zener breakdown and a Zener voltage regulator. Pure functions, no DOM.

export const KB_Q = 8.617333262e-5; // k/e in V/K (CODATA)
export type Diode = { id: 'si' | 'ge' | 'zener'; name: string; v0: number; is: number; eta: number; vz?: number; rz?: number };
/** Teaching diodes: barrier ~0.7 V (Si) and ~0.3 V (Ge); Is chosen so a few mA flow at the knee; 5.1 V Zener. */
export const DIODES: Record<Diode['id'], Diode> = {
  si: { id: 'si', name: 'Silicon diode', v0: 0.7, is: 1e-14, eta: 1 },
  ge: { id: 'ge', name: 'Germanium diode', v0: 0.3, is: 1e-8, eta: 1 },
  zener: { id: 'zener', name: 'Zener diode (5.1 V)', v0: 0.7, is: 1e-14, eta: 1, vz: 5.1, rz: 5 },
};
/** Depletion width with no bias in this teaching picture (µm). */
export const W0 = 0.5;

export const thermalVoltage = (T = 300) => KB_Q * T;

/** Current (A) through the diode at voltage V (positive = forward bias). */
export function current(d: Diode, V: number, T = 300): number {
  if (!Number.isFinite(V)) throw new Error('Give a voltage.');
  const vt = d.eta * thermalVoltage(T);
  let i = d.is * Math.expm1(Math.min(V, 1.2) / vt);
  if (d.vz && V < -d.vz) i -= (-V - d.vz) / (d.rz ?? 5);
  return i;
}

/** Depletion width (µm): W = W0 √((V0 − V)/V0) below the barrier; it almost vanishes once V reaches V0. */
export function width(d: Diode, V: number): number {
  const r = (d.v0 - V) / d.v0;
  return r <= 0.02 ? W0 * Math.sqrt(0.02) : W0 * Math.sqrt(r);
}

/** Height of the potential barrier (V) the carriers must climb. */
export const barrier = (d: Diode, V: number) => Math.max(0, d.v0 - V);

/** Bias name for a voltage. */
export const bias = (V: number) => (V > 0 ? 'forward' : V < 0 ? 'reverse' : 'none');

/** Small-signal (dynamic) resistance ΔV/ΔI at V, in ohms. */
export function dynamicResistance(d: Diode, V: number, T = 300): number {
  const vt = d.eta * thermalVoltage(T);
  let g = (d.is / vt) * Math.exp(Math.min(V, 1.2) / vt); // dI/dV of the diode equation
  if (d.vz && V < -d.vz) g += 1 / (d.rz ?? 5);
  return 1 / g;
}

/** Zener regulator: Vin through series resistor R into a Zener (Vz) parallel with load RL. */
export function regulator(vin: number, vz: number, R: number, RL: number) {
  if (!(R > 0) || !(RL > 0) || !(vin >= 0) || !(vz > 0)) throw new Error('Vin, Vz, R and RL must be positive.');
  const open = (vin * RL) / (R + RL);
  if (open < vz) return { regulating: false, vout: open, iR: vin / (R + RL), iL: open / RL, iZ: 0 };
  const iR = (vin - vz) / R, iL = vz / RL;
  return { regulating: true, vout: vz, iR, iL, iZ: iR - iL };
}

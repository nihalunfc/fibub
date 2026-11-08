// Gas laws: ideal gas (solve for any of P, V, n, T), the combined law, van der Waals and the compressibility
// factor, gas density and molar mass, and Dalton partial pressures. SI internally (Pa, m³, mol, K).

export const R = 8.314462618; // J/(mol K)

export const P_UNITS: Record<string, number> = { Pa: 1, kPa: 1e3, bar: 1e5, atm: 101325, mmHg: 133.322387415, torr: 101325 / 760, psi: 6894.757293168 };
export const V_UNITS: Record<string, number> = { L: 1e-3, mL: 1e-6, 'm³': 1, 'cm³': 1e-6, 'ft³': 0.028316846592, 'US gal': 3.785411784e-3 };
export const T_UNITS = ['K', '°C', '°F'] as const;
export type TUnit = (typeof T_UNITS)[number];
export const toK = (t: number, u: TUnit) => (u === 'K' ? t : u === '°C' ? t + 273.15 : ((t - 32) * 5) / 9 + 273.15);
export const fromK = (k: number, u: TUnit) => (u === 'K' ? k : u === '°C' ? k - 273.15 : ((k - 273.15) * 9) / 5 + 32);

export type Ideal = { P?: number; V?: number; n?: number; T?: number };
/** Fill in the one missing quantity of PV = nRT (SI units). */
export function solveIdeal(x: Ideal): Required<Ideal> & { solved: keyof Ideal } {
  const miss = (['P', 'V', 'n', 'T'] as const).filter((k) => x[k] === undefined);
  if (miss.length !== 1) throw new Error('Leave exactly one of pressure, volume, amount and temperature empty to work it out.');
  const { P, V, n, T } = x, k = miss[0];
  const out = { P: P ?? (n! * R * T!) / V!, V: V ?? (n! * R * T!) / P!, n: n ?? (P! * V!) / (R * T!), T: T ?? (P! * V!) / (n! * R), solved: k };
  if (![out.P, out.V, out.n, out.T].every((v) => Number.isFinite(v) && v > 0)) throw new Error('Every quantity must be above zero (temperatures above absolute zero).');
  return out;
}

/** Combined gas law P1V1/T1 = P2V2/T2 (fixed amount): fill the one missing final-state value. */
export function combined(s1: { P: number; V: number; T: number }, s2: { P?: number; V?: number; T?: number }) {
  const c = (s1.P * s1.V) / s1.T, miss = (['P', 'V', 'T'] as const).filter((k) => s2[k] === undefined);
  if (miss.length !== 1) throw new Error('Leave exactly one final value empty.');
  const k = miss[0];
  const v = k === 'P' ? (c * s2.T!) / s2.V! : k === 'V' ? (c * s2.T!) / s2.P! : (s2.P! * s2.V!) / c;
  return { key: k, value: v };
}

/** van der Waals constants, a in L²·bar/mol², b in L/mol (CRC Handbook of Chemistry and Physics). */
export const VDW: { id: string; name: string; formula: string; a: number; b: number }[] = [
  { id: 'he', name: 'Helium', formula: 'He', a: 0.0346, b: 0.0238 },
  { id: 'ne', name: 'Neon', formula: 'Ne', a: 0.208, b: 0.01672 },
  { id: 'ar', name: 'Argon', formula: 'Ar', a: 1.355, b: 0.0320 },
  { id: 'h2', name: 'Hydrogen', formula: 'H2', a: 0.2476, b: 0.02661 },
  { id: 'n2', name: 'Nitrogen', formula: 'N2', a: 1.370, b: 0.0387 },
  { id: 'o2', name: 'Oxygen', formula: 'O2', a: 1.382, b: 0.03186 },
  { id: 'co', name: 'Carbon monoxide', formula: 'CO', a: 1.472, b: 0.03948 },
  { id: 'co2', name: 'Carbon dioxide', formula: 'CO2', a: 3.640, b: 0.04267 },
  { id: 'ch4', name: 'Methane', formula: 'CH4', a: 2.283, b: 0.04278 },
  { id: 'c3h8', name: 'Propane', formula: 'C3H8', a: 9.39, b: 0.0905 },
  { id: 'nh3', name: 'Ammonia', formula: 'NH3', a: 4.225, b: 0.0371 },
  { id: 'h2o', name: 'Water vapour', formula: 'H2O', a: 5.536, b: 0.03049 },
  { id: 'cl2', name: 'Chlorine', formula: 'Cl2', a: 6.579, b: 0.05622 },
];

/** van der Waals pressure (Pa) for n mol in V m³ at T K; a, b in the table's units. */
export function vdwPressure(n: number, V: number, T: number, a: number, b: number): number {
  const aSI = a * 0.1, bSI = b * 1e-3; // L²·bar/mol² → Pa·m⁶/mol²; L/mol → m³/mol
  return (n * R * T) / (V - n * bSI) - (aSI * n * n) / (V * V);
}

/** van der Waals volume (m³) for n mol at P Pa and T K: the gas-like root of the cubic, by Newton from the ideal volume. */
export function vdwVolume(n: number, P: number, T: number, a: number, b: number): number {
  const aSI = a * 0.1, bSI = b * 1e-3;
  let Vm = Math.max((R * T) / P, bSI * 1.5);
  for (let i = 0; i < 200; i++) {
    const f = (P + aSI / (Vm * Vm)) * (Vm - bSI) - R * T;
    const d = P + aSI / (Vm * Vm) - (2 * aSI * (Vm - bSI)) / (Vm ** 3);
    const next = Vm - f / d;
    if (!(next > bSI)) { Vm = (Vm + bSI) / 2; continue; }
    if (Math.abs(next - Vm) < 1e-14 * Vm) { Vm = next; break; }
    Vm = next;
  }
  return Vm * n;
}

/** Critical point of a van der Waals gas: Tc = 8a/27Rb, Pc = a/27b², Vc = 3b. */
export function vdwCritical(a: number, b: number) {
  const aSI = a * 0.1, bSI = b * 1e-3;
  return { Tc: (8 * aSI) / (27 * R * bSI), Pc: aSI / (27 * bSI * bSI), Vc: 3 * bSI };
}

/** Ideal-gas density (kg/m³) from molar mass (g/mol). */
export const density = (P: number, T: number, M: number) => (P * M * 1e-3) / (R * T);
/** Molar mass (g/mol) from a measured density (kg/m³). */
export const molarMassFromDensity = (rho: number, P: number, T: number) => (rho * R * T) / P * 1e3;

/** Molar volumes at the usual standard conditions. */
export const MOLAR_VOLUME = {
  stpIupac: (R * 273.15) / 1e5, // 0 °C, 1 bar: 22.711 L
  stpOld: (R * 273.15) / 101325, // 0 °C, 1 atm: 22.414 L
  satp: (R * 298.15) / 1e5, // 25 °C, 1 bar: 24.790 L
};

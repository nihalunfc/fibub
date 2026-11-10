// Henry's law (school level, Class 12 solutions): p = KH x for a gas over water, how KH grows with temperature,
// what dissolves in a soda bottle and what escapes when it is opened, and gas dissolved in body water for a diver
// or a climber. Teaching model; not for dive planning. Pure functions, no DOM.

export type Gas = { id: 'CO2' | 'O2' | 'N2'; name: string; kh298: number; C: number; M: number };
/** KH at 298 K in bar (rounded typical values), temperature coefficient C in K (rounded), molar mass g/mol. */
export const GASES: Record<Gas['id'], Gas> = {
  CO2: { id: 'CO2', name: 'carbon dioxide', kh298: 1700, C: 2400, M: 44.01 },
  O2: { id: 'O2', name: 'oxygen', kh298: 35000, C: 1700, M: 32.0 },
  N2: { id: 'N2', name: 'nitrogen', kh298: 76000, C: 1300, M: 28.01 },
};
export const WATER_MOL_PER_L = 55.51; // mol of H₂O in 1 L of water
export const R = 0.0831446; // L bar / (mol K)

/** KH (bar) at temperature T (K): KH(T) = KH(298) exp(C (1/298.15 − 1/T)). It rises with T, so less gas dissolves. */
export function kh(g: Gas, T: number): number {
  if (!(T > 0)) throw new Error('The temperature must be above 0 K.');
  return g.kh298 * Math.exp(g.C * (1 / 298.15 - 1 / T));
}

/** Mole fraction of gas dissolved when its partial pressure is p bar: x = p / KH. */
export function moleFraction(g: Gas, p: number, T: number): number {
  if (!(p >= 0)) throw new Error('The pressure cannot be negative.');
  return p / kh(g, T);
}

/** Dissolved gas in mol per litre of water (dilute: n = x / (1 − x) × 55.51) and in g/L. */
export function dissolved(g: Gas, p: number, T: number) {
  const x = moleFraction(g, p, T), mol = (x / (1 - x)) * WATER_MOL_PER_L;
  return { x, mol, grams: mol * g.M };
}

/** Volume (L) of gas that moles n occupy at pressure p (bar) and T (K), ideal gas. */
export const gasVolume = (n: number, T: number, p = 1) => (n * R * T) / p;

/** Total pressure (bar) under water: 1 bar of air plus about 1 bar for each 10 m of sea water. */
export const depthPressure = (m: number) => 1 + m / 10;
/** Air pressure (bar) at an altitude in metres, simple exponential atmosphere with an 8 km scale height. */
export const altitudePressure = (m: number) => 1.013 * Math.exp(-m / 8000);
/** Share of the gas in dry air. */
export const AIR = { N2: 0.78, O2: 0.21, CO2: 0.00042 } as const;

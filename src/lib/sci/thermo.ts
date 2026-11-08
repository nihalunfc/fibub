// Thermochemistry from standard formation values at 298.15 K: ΔrH°, ΔrS°, ΔrG°, K, the temperature where ΔG changes
// sign (ΔH and ΔS taken as constant), and Hess's law sums. Bundled values: CRC Handbook / NIST (common substances).

export type Thermo = { f: string; phase: 's' | 'l' | 'g' | 'aq'; name: string; H: number; S: number; G: number };
/** ΔfH° (kJ/mol), S° (J/(mol·K)), ΔfG° (kJ/mol) at 298.15 K and 1 bar. */
export const TABLE: Thermo[] = [
  { f: 'H2', phase: 'g', name: 'hydrogen', H: 0, S: 130.68, G: 0 },
  { f: 'O2', phase: 'g', name: 'oxygen', H: 0, S: 205.15, G: 0 },
  { f: 'N2', phase: 'g', name: 'nitrogen', H: 0, S: 191.61, G: 0 },
  { f: 'Cl2', phase: 'g', name: 'chlorine', H: 0, S: 223.08, G: 0 },
  { f: 'C', phase: 's', name: 'graphite', H: 0, S: 5.74, G: 0 },
  { f: 'S', phase: 's', name: 'sulfur (rhombic)', H: 0, S: 32.1, G: 0 },
  { f: 'Ca', phase: 's', name: 'calcium', H: 0, S: 41.6, G: 0 },
  { f: 'Na', phase: 's', name: 'sodium', H: 0, S: 51.3, G: 0 },
  { f: 'Fe', phase: 's', name: 'iron', H: 0, S: 27.3, G: 0 },
  { f: 'Al', phase: 's', name: 'aluminium', H: 0, S: 28.3, G: 0 },
  { f: 'H2O', phase: 'l', name: 'water', H: -285.83, S: 69.95, G: -237.14 },
  { f: 'H2O', phase: 'g', name: 'water vapour', H: -241.83, S: 188.84, G: -228.59 },
  { f: 'H2O2', phase: 'l', name: 'hydrogen peroxide', H: -187.8, S: 109.6, G: -120.4 },
  { f: 'O3', phase: 'g', name: 'ozone', H: 142.7, S: 238.9, G: 163.2 },
  { f: 'CO', phase: 'g', name: 'carbon monoxide', H: -110.53, S: 197.66, G: -137.17 },
  { f: 'CO2', phase: 'g', name: 'carbon dioxide', H: -393.51, S: 213.79, G: -394.37 },
  { f: 'CH4', phase: 'g', name: 'methane', H: -74.6, S: 186.3, G: -50.5 },
  { f: 'C2H6', phase: 'g', name: 'ethane', H: -84.0, S: 229.2, G: -32.0 },
  { f: 'C2H4', phase: 'g', name: 'ethylene', H: 52.4, S: 219.3, G: 68.4 },
  { f: 'C2H2', phase: 'g', name: 'acetylene', H: 227.4, S: 200.9, G: 209.9 },
  { f: 'C3H8', phase: 'g', name: 'propane', H: -103.8, S: 270.3, G: -23.4 },
  { f: 'C6H6', phase: 'l', name: 'benzene', H: 49.1, S: 173.4, G: 124.5 },
  { f: 'CH3OH', phase: 'l', name: 'methanol', H: -239.2, S: 126.8, G: -166.6 },
  { f: 'C2H5OH', phase: 'l', name: 'ethanol', H: -277.6, S: 160.7, G: -174.8 },
  { f: 'CH3COOH', phase: 'l', name: 'acetic acid', H: -484.3, S: 159.8, G: -389.9 },
  { f: 'C6H12O6', phase: 's', name: 'glucose', H: -1273.3, S: 212.1, G: -910.4 },
  { f: 'NH3', phase: 'g', name: 'ammonia', H: -45.9, S: 192.8, G: -16.4 },
  { f: 'NO', phase: 'g', name: 'nitric oxide', H: 91.3, S: 210.8, G: 87.6 },
  { f: 'NO2', phase: 'g', name: 'nitrogen dioxide', H: 33.2, S: 240.1, G: 51.3 },
  { f: 'N2O4', phase: 'g', name: 'dinitrogen tetroxide', H: 11.1, S: 304.4, G: 99.8 },
  { f: 'HCl', phase: 'g', name: 'hydrogen chloride', H: -92.3, S: 186.9, G: -95.3 },
  { f: 'SO2', phase: 'g', name: 'sulfur dioxide', H: -296.8, S: 248.2, G: -300.1 },
  { f: 'SO3', phase: 'g', name: 'sulfur trioxide', H: -395.7, S: 256.8, G: -371.1 },
  { f: 'CaCO3', phase: 's', name: 'calcite', H: -1207.6, S: 91.7, G: -1129.1 },
  { f: 'CaO', phase: 's', name: 'lime', H: -634.9, S: 38.1, G: -603.3 },
  { f: 'NaCl', phase: 's', name: 'sodium chloride', H: -411.2, S: 72.1, G: -384.1 },
  { f: 'Fe2O3', phase: 's', name: 'haematite', H: -824.2, S: 87.4, G: -742.2 },
  { f: 'Al2O3', phase: 's', name: 'corundum', H: -1675.7, S: 50.9, G: -1582.3 },
];

/** Formation entropy of the elements in their standard states (for checking ΔfG = ΔfH − TΔfS). */
export const ELEMENT_S: Record<string, number> = { H: 130.68 / 2, O: 205.15 / 2, N: 191.61 / 2, Cl: 223.08 / 2, C: 5.74, S: 32.1, Ca: 41.6, Na: 51.3, Fe: 27.3, Al: 28.3 };

export const lookup = (f: string, phase?: string) => {
  const hits = TABLE.filter((t) => t.f === f);
  return (phase ? hits.find((t) => t.phase === phase) : undefined) ?? (hits.length === 1 || !phase ? hits[0] : undefined);
};

export type Species = { nu: number; H: number; S: number; G?: number };
export const R = 8.314462618;
/** Reaction values from species (ν < 0 for reactants). ΔG at 298.15 K from ΔfG when all are known, else ΔH − TΔS. */
export function reaction(sp: Species[]) {
  const dH = sp.reduce((s, x) => s + x.nu * x.H, 0), dS = sp.reduce((s, x) => s + x.nu * x.S, 0);
  const allG = sp.every((x) => x.G !== undefined);
  const dG = allG ? sp.reduce((s, x) => s + x.nu * x.G!, 0) : dH - (298.15 * dS) / 1000;
  return { dH, dS, dG, fromG: allG, K: Math.exp((-dG * 1000) / (R * 298.15)) };
}
/** ΔG (kJ/mol) at T with ΔH (kJ/mol) and ΔS (J/(mol·K)) constant. */
export const dGat = (dH: number, dS: number, T: number) => dH - (T * dS) / 1000;
/** Temperature (K) where ΔG = 0, or null if ΔH and ΔS have opposite signs (never changes sign). */
export const crossover = (dH: number, dS: number) => (dS !== 0 && dH / dS > 0 ? (1000 * dH) / dS : null);
/** ln K at T from ΔG. */
export const lnK = (dG: number, T: number) => (-dG * 1000) / (R * T);

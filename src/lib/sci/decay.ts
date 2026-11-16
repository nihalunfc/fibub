// Radioactive decay correction and specific activity. Half-lives: NNDC (ENSDF) / DDEP recommended values.
export const NA = 6.02214076e23;
export const CI = 3.7e10; // Bq per curie
export const UNIT_S: Record<string, number> = { s: 1, min: 60, h: 3600, d: 86400, y: 365.25 * 86400 };

/** id like "F-18", A = mass number, half-life value and unit, and a short use note. */
export type Nuclide = { id: string; A: number; t: number; u: keyof typeof UNIT_S; use: string };
export const NUCLIDES: Nuclide[] = [
  { id: 'H-3', A: 3, t: 12.32, u: 'y', use: 'tritium labelling' },
  { id: 'C-11', A: 11, t: 20.364, u: 'min', use: 'PET' },
  { id: 'C-14', A: 14, t: 5700, u: 'y', use: 'labelling, dating' },
  { id: 'N-13', A: 13, t: 9.965, u: 'min', use: 'PET' },
  { id: 'O-15', A: 15, t: 122.24, u: 's', use: 'PET' },
  { id: 'F-18', A: 18, t: 109.77, u: 'min', use: 'PET (FDG)' },
  { id: 'P-32', A: 32, t: 14.268, u: 'd', use: 'molecular biology' },
  { id: 'S-35', A: 35, t: 87.37, u: 'd', use: 'protein labelling' },
  { id: 'K-40', A: 40, t: 1.248e9, u: 'y', use: 'natural potassium' },
  { id: 'Cr-51', A: 51, t: 27.704, u: 'd', use: 'cell labelling' },
  { id: 'Co-60', A: 60, t: 5.2713, u: 'y', use: 'sealed sources' },
  { id: 'Cu-64', A: 64, t: 12.701, u: 'h', use: 'PET' },
  { id: 'Ga-68', A: 68, t: 67.71, u: 'min', use: 'PET' },
  { id: 'Rb-82', A: 82, t: 75.45, u: 's', use: 'PET' },
  { id: 'Y-90', A: 90, t: 64.05, u: 'h', use: 'β⁻ therapy research' },
  { id: 'Zr-89', A: 89, t: 78.41, u: 'h', use: 'immuno-PET' },
  { id: 'Tc-99m', A: 99, t: 6.0067, u: 'h', use: 'SPECT' },
  { id: 'In-111', A: 111, t: 2.8047, u: 'd', use: 'SPECT' },
  { id: 'I-123', A: 123, t: 13.2234, u: 'h', use: 'SPECT' },
  { id: 'I-125', A: 125, t: 59.388, u: 'd', use: 'assays, labelling' },
  { id: 'I-131', A: 131, t: 8.0252, u: 'd', use: 'labelling' },
  { id: 'Cs-137', A: 137, t: 30.08, u: 'y', use: 'check sources' },
  { id: 'Lu-177', A: 177, t: 6.647, u: 'd', use: 'radioligand research' },
  { id: 'Tl-201', A: 201, t: 3.0421, u: 'd', use: 'SPECT' },
  { id: 'Po-210', A: 210, t: 138.376, u: 'd', use: 'α source' },
  { id: 'Rn-222', A: 222, t: 3.8235, u: 'd', use: 'radon in homes' },
  { id: 'Ra-223', A: 223, t: 11.43, u: 'd', use: 'α research' },
  { id: 'Ra-226', A: 226, t: 1600, u: 'y', use: 'historic sources' },
  { id: 'Th-232', A: 232, t: 1.4e10, u: 'y', use: 'natural thorium' },
  { id: 'U-235', A: 235, t: 7.04e8, u: 'y', use: 'natural uranium' },
  { id: 'U-238', A: 238, t: 4.468e9, u: 'y', use: 'natural uranium' },
  { id: 'Pu-239', A: 239, t: 24110, u: 'y', use: 'reference sources' },
  { id: 'Am-241', A: 241, t: 432.6, u: 'y', use: 'smoke detectors, sources' },
];
export const nuclide = (id: string) => NUCLIDES.find((n) => n.id === id);
export const halfLifeS = (t: number, u: string) => t * UNIT_S[u];

/** Activity after time dt (s, negative = before) from A0, half-life T½ (s). */
export const decay = (A0: number, dt: number, half: number) => A0 * Math.pow(2, -dt / half);
/** Time (s) for activity to fall from A0 to A. */
export const timeTo = (A0: number, A: number, half: number) => (half * Math.log(A0 / A)) / Math.LN2;
/** Fraction of a half-life count that decays during a counting interval of length c (s); average-activity factor. */
export const countFactor = (c: number, half: number) => { const l = Math.LN2 / half; return c > 0 ? (1 - Math.exp(-l * c)) / (l * c) : 1; };
/** Carrier-free specific activity (Bq/g) and molar activity (Bq/mol); molar mass taken as the mass number. */
export function specific(half: number, A: number) {
  const lambda = Math.LN2 / half;
  return { lambda, perMol: lambda * NA, perGram: (lambda * NA) / A, meanLife: 1 / lambda };
}
/** Units of activity in Bq. */
export const ACT_UNITS: Record<string, number> = { Bq: 1, kBq: 1e3, MBq: 1e6, GBq: 1e9, TBq: 1e12, µCi: CI * 1e-6, mCi: CI * 1e-3, Ci: CI };

export type HalfLifeInput = { n0: number | null; nt: number | null; t: number | null; T: number | null };
export type HalfLifeResult = { missing: 'n0' | 'nt' | 't' | 'T'; value: number; halves: number; fraction: number; steps: string[] };

/**
 * Solve N(t) = N0 × 2^(−t/T½) for whichever of N0, N(t), t or T½ is left empty (null). t and T½ must be in the same unit.
 * Throws an Error with a plain message when the numbers cannot work.
 */
export function halfLifeSolve(v: HalfLifeInput): HalfLifeResult {
  const keys = ['n0', 'nt', 't', 'T'] as const, empty = keys.filter((k) => v[k] === null);
  if (empty.length !== 1) throw new Error(empty.length === 0 ? 'Leave one box empty: the one you want to find.' : 'Fill in three boxes and leave only the one you want to find empty.');
  const missing = empty[0];
  for (const k of keys) if (v[k] !== null && !Number.isFinite(v[k] as number)) throw new Error('Type plain numbers.');
  if (missing !== 'n0' && !((v.n0 as number) > 0)) throw new Error('The starting amount must be above zero.');
  if (missing !== 'nt' && !((v.nt as number) > 0)) throw new Error(v.nt === 0 ? 'The amount left never reaches exactly zero; type a small amount above zero.' : 'The amount left must be above zero.');
  if (missing !== 'T' && !((v.T as number) > 0)) throw new Error('The half-life must be above zero.');
  if (missing !== 't' && (v.t as number) < 0) throw new Error('The time cannot be negative.');
  const { n0, nt, t, T } = v as Record<string, number>;
  let value = 0; const steps: string[] = [];
  if (missing === 'nt') { value = n0 * Math.pow(2, -t / T); steps.push('N = N₀ × 2^(−t / T½)', `t / T½ = ${t} / ${T} = ${t / T} half-lives`, `N = ${n0} × 2^(−${t / T}) = ${value}`); }
  else if (missing === 'n0') { value = nt * Math.pow(2, t / T); steps.push('N₀ = N × 2^(t / T½)', `t / T½ = ${t} / ${T} = ${t / T} half-lives`, `N₀ = ${nt} × 2^(${t / T}) = ${value}`); }
  else {
    if (nt > n0) throw new Error('The amount left cannot be more than the starting amount.');
    const r = Math.log2(n0 / nt);
    if (missing === 't') { value = T * r; steps.push('t = T½ × log₂(N₀ / N)', `log₂(${n0} / ${nt}) = ${r} half-lives`, `t = ${T} × ${r} = ${value}`); }
    else {
      if (r === 0) throw new Error('Nothing has decayed (the amount left equals the starting amount), so the half-life cannot be found.');
      if (t === 0) throw new Error('With a time of zero nothing can have decayed, so the half-life cannot be found.');
      value = t / r; steps.push('T½ = t / log₂(N₀ / N)', `log₂(${n0} / ${nt}) = ${r}`, `T½ = ${t} / ${r} = ${value}`);
    }
  }
  const n0v = missing === 'n0' ? value : n0, ntv = missing === 'nt' ? value : nt, tv = missing === 't' ? value : t, Tv = missing === 'T' ? value : T;
  if (!Number.isFinite(value)) throw new Error('That number is too large or too small to work out.');
  return { missing, value, halves: tv / Tv, fraction: ntv / n0v, steps };
}

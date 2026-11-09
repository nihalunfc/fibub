// Paschen's law for DC breakdown of a uniform gap: V = B p d / (ln(A p d) − ln(ln(1 + 1/γ))).
// A in 1/(Torr cm), B in V/(Torr cm), p d in Torr cm. Townsend theory; see Raizer, Gas Discharge Physics, ch. 7.

export type Gas = { id: string; name: string; A: number; B: number };
/** Rounded textbook A and B constants (Townsend fits, each valid only over a limited E/p range). Editable on the page. */
export const GASES: Gas[] = [
  { id: 'air', name: 'Air', A: 15, B: 365 },
  { id: 'n2', name: 'Nitrogen', A: 12, B: 342 },
  { id: 'ar', name: 'Argon', A: 12, B: 180 },
  { id: 'he', name: 'Helium', A: 3, B: 34 },
  { id: 'ne', name: 'Neon', A: 4, B: 100 },
  { id: 'h2', name: 'Hydrogen', A: 5, B: 130 },
  { id: 'co2', name: 'Carbon dioxide', A: 20, B: 466 },
];

/** ln(ln(1 + 1/γ)), the secondary emission term. */
export const kGamma = (gamma: number) => Math.log(Math.log(1 + 1 / gamma));

/** Breakdown voltage (V) at p·d (Torr cm); NaN where the gap cannot break down (left of the asymptote). */
export function paschenV(pd: number, A: number, B: number, gamma: number): number {
  const den = Math.log(A * pd) - kGamma(gamma);
  return den > 0 ? (B * pd) / den : NaN;
}

/** The Paschen minimum: (pd)min = e ln(1 + 1/γ) / A, Vmin = e B ln(1 + 1/γ) / A. */
export function paschenMin(A: number, B: number, gamma: number) {
  const L = Math.log(1 + 1 / gamma);
  return { pd: (Math.E * L) / A, V: (Math.E * B * L) / A, Ep: B }; // at the minimum E/p = B exactly
}

/** The left asymptote: no breakdown for pd at or below exp(k)/A. */
export const pdAsymptote = (A: number, gamma: number) => Math.exp(kGamma(gamma)) / A;

/** The p·d values (Torr cm) where the breakdown voltage equals V: [left branch, right branch], or [] below the minimum. */
export function pdForVoltage(V: number, A: number, B: number, gamma: number): number[] {
  const m = paschenMin(A, B, gamma);
  if (!(V >= m.V)) return [];
  const f = (x: number) => paschenV(x, A, B, gamma) - V;
  const bis = (lo: number, hi: number) => { for (let i = 0; i < 200; i++) { const mid = Math.sqrt(lo * hi); (f(mid) > 0) === (f(lo) > 0) ? (lo = mid) : (hi = mid); } return Math.sqrt(lo * hi); };
  const a = pdAsymptote(A, gamma) * (1 + 1e-12);
  let hi = m.pd * 10; while (f(hi) < 0) hi *= 10;
  return [bis(a, m.pd), bis(m.pd, hi)];
}

export const PRESSURE: Record<string, number> = { torr: 1, pa: 1 / 133.322368, mbar: 100 / 133.322368, kpa: 1000 / 133.322368, atm: 760, psi: 51.714932 };
export const GAP: Record<string, number> = { um: 1e-4, mm: 0.1, cm: 1, m: 100, in: 2.54 };

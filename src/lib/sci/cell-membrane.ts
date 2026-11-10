// Fluid mosaic membrane (Learn #1391): how fast things cross a cell membrane. Teaching model with made-up round
// numbers, no DOM. Simple diffusion through the lipids goes up in a straight line with the concentration
// difference (Fick's first law, rate = P × A × ΔC); facilitated diffusion through carrier proteins levels off
// when every carrier is busy (rate = Vmax × C / (K + C), the same shape as Michaelis-Menten); the sodium-potassium
// pump moves 3 Na⁺ out and 2 K⁺ in for every ATP it splits, even against the gradient.

export type Mode = 'simple' | 'facilitated' | 'active';
export type Substance = { id: string; name: string; mode: Mode; route: string; note: string };

export const SUBSTANCES: Substance[] = [
  { id: 'o2', name: 'Oxygen (O₂)', mode: 'simple', route: 'straight through the lipid bilayer', note: 'Small and uncharged, so it slips between the lipid tails.' },
  { id: 'water', name: 'Water', mode: 'simple', route: 'through the lipids slowly and through water channels (aquaporins) quickly', note: 'This is osmosis: water moving across a membrane that lets water through but not the dissolved solute.' },
  { id: 'glucose', name: 'Glucose', mode: 'facilitated', route: 'only through carrier proteins', note: 'Too big and too polar for the lipid tails, so it needs a carrier. No ATP is used: it still only goes downhill.' },
  { id: 'na', name: 'Sodium ions (Na⁺)', mode: 'active', route: 'through ion channels (downhill) and the Na⁺/K⁺ pump (uphill, using ATP)', note: 'Charged ions cannot cross the lipids at all. The pump keeps Na⁺ low inside the cell.' },
];

/** Simple diffusion (Fick): net rate = P × (C_out − C_in). Positive means into the cell. */
export const simpleRate = (cOut: number, cIn: number, P = 0.5) => P * (cOut - cIn);

/** One-way carrier flux, saturating: Vmax × C / (K + C). */
export const carrierFlux = (c: number, Vmax = 10, K = 8) => (c <= 0 ? 0 : (Vmax * c) / (K + c));

/** Facilitated diffusion: the carriers work both ways, so the net rate is the difference. Positive is inward. */
export const facilitatedRate = (cOut: number, cIn: number, Vmax = 10, K = 8) => carrierFlux(cOut, Vmax, K) - carrierFlux(cIn, Vmax, K);

/** The Na⁺/K⁺ pump: ATP used and K⁺ brought in for a number of Na⁺ pumped out (3 Na⁺ : 2 K⁺ : 1 ATP). */
export const pump = (naOut: number) => ({ atp: naOut / 3, kIn: (naOut * 2) / 3 });

/** Which way the net movement goes, in words. */
export function direction(cOut: number, cIn: number, mode: Mode, pumpOn = false) {
  if (mode === 'active' && pumpOn) return 'out of the cell (pumped, against the gradient)';
  if (Math.abs(cOut - cIn) < 1e-9) return 'none: equal on both sides';
  return cOut > cIn ? 'into the cell (down the gradient)' : 'out of the cell (down the gradient)';
}

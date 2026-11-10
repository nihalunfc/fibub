// Z-scheme of the light reactions (Learn #1393). No DOM. The carriers and their rounded midpoint redox potentials
// (volts, at pH 7) are general textbook values, rounded to 0.05 V or so; they are drawn as a guide to the shape of
// the Z, not as precise data. The bookkeeping uses the usual counts: two photons per electron in the non-cyclic path
// (one at PS II, one at PS I), 4 electrons per O₂ from 2 H₂O, 2 electrons per NADPH, 1 H⁺ into the lumen per electron
// from water and 2 per electron from the cytochrome b6f complex (Q cycle), and about 14 H⁺ through ATP synthase for
// every 3 ATP (a commonly used figure for the chloroplast enzyme; it is not exact).

export type Carrier = { id: string; name: string; short: string; E: number; x: number; ps?: 'II' | 'I' };
export const CARRIERS: Carrier[] = [
  { id: 'h2o', name: 'Water (H₂O / O₂)', short: 'H₂O', E: 0.82, x: 0.05 },
  { id: 'p680', name: 'P680, reaction centre of photosystem II', short: 'P680', E: 1.2, x: 0.15, ps: 'II' },
  { id: 'p680x', name: 'P680* (excited by light)', short: 'P680*', E: -0.8, x: 0.15, ps: 'II' },
  { id: 'pheo', name: 'Pheophytin', short: 'Pheo', E: -0.5, x: 0.25 },
  { id: 'pq', name: 'Plastoquinone (PQ)', short: 'PQ', E: 0.0, x: 0.35 },
  { id: 'b6f', name: 'Cytochrome b6f complex', short: 'Cyt b6f', E: 0.3, x: 0.46 },
  { id: 'pc', name: 'Plastocyanin (PC)', short: 'PC', E: 0.37, x: 0.56 },
  { id: 'p700', name: 'P700, reaction centre of photosystem I', short: 'P700', E: 0.45, x: 0.65, ps: 'I' },
  { id: 'p700x', name: 'P700* (excited by light)', short: 'P700*', E: -1.3, x: 0.65, ps: 'I' },
  { id: 'fd', name: 'Ferredoxin (Fd)', short: 'Fd', E: -0.42, x: 0.78 },
  { id: 'nadp', name: 'NADP⁺ reductase: NADP⁺ → NADPH', short: 'NADPH', E: -0.32, x: 0.91 },
];
export const carrier = (id: string) => CARRIERS.find((c) => c.id === id)!;

export type Step = { at: string; light?: boolean; text: string };
export const NONCYCLIC: Step[] = [
  { at: 'p680', text: 'Start at P680, the special chlorophyll a pair in the middle of photosystem II.' },
  { at: 'p680x', light: true, text: 'Light (absorbed by the antenna and passed in, best near 680 nm) lifts an electron of P680 to a high energy: P680*. The hole left in P680 is filled from water: 2 H₂O → 4 H⁺ + O₂ + 4 e⁻. The O₂ is released and the H⁺ stay in the lumen.' },
  { at: 'pheo', text: 'The excited electron jumps to pheophytin, the first acceptor. Downhill from here: each step releases a little energy.' },
  { at: 'pq', text: 'Plastoquinone picks up the electron, and with it H⁺ from the stroma, and carries them across the membrane.' },
  { at: 'b6f', text: 'The cytochrome b6f complex passes the electron on and releases H⁺ into the lumen. This H⁺ build-up will make ATP.' },
  { at: 'pc', text: 'Plastocyanin, a small copper protein, carries the electron along the lumen side to photosystem I.' },
  { at: 'p700', text: 'The electron fills the hole in P700, the reaction centre of photosystem I.' },
  { at: 'p700x', light: true, text: 'A second photon (best near 700 nm) lifts the electron again, even higher: P700*.' },
  { at: 'fd', text: 'Ferredoxin, an iron-sulphur protein on the stroma side, takes the electron.' },
  { at: 'nadp', text: 'NADP⁺ reductase uses 2 electrons and H⁺ from the stroma: NADP⁺ + 2 e⁻ + H⁺ → NADPH. Meanwhile H⁺ flows back out of the lumen through ATP synthase, making ATP.' },
];
export const CYCLIC: Step[] = [
  { at: 'p700', text: 'Cyclic path: only photosystem I is used. Start at P700.' },
  { at: 'p700x', light: true, text: 'Light lifts an electron of P700 to P700*.' },
  { at: 'fd', text: 'Ferredoxin takes the electron, but instead of going on to NADP⁺ …' },
  { at: 'pq', text: '… it is passed back to plastoquinone and the cytochrome b6f complex, which pump H⁺ into the lumen.' },
  { at: 'b6f', text: 'H⁺ pumped into the lumen drives ATP synthase: ATP is made, but no NADPH and no O₂.' },
  { at: 'pc', text: 'Plastocyanin carries the electron back towards P700.' },
  { at: 'p700', text: 'Back where it started. The electron has gone round in a circle, so water is not split.' },
];

/** Totals for n electrons sent through the chain. */
export function ledger(n: number, cyclic = false) {
  const hPerAtp = 14 / 3;
  if (cyclic) { const H = 2 * n; return { photons: n, water: 0, o2: 0, nadph: 0, hLumen: H, atp: H / hPerAtp }; }
  const H = 3 * n;
  return { photons: 2 * n, water: n / 2, o2: n / 4, nadph: n / 2, hLumen: H, atp: H / hPerAtp };
}
/** Energy of a photon (eV) of wavelength nm: E = hc/λ. */
export const photonEV = (nm: number) => (6.62607015e-34 * 299792458) / (nm * 1e-9) / 1.602176634e-19;

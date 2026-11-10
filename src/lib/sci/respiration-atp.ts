// Respiration ATP ledger and respiratory quotient (Learn #1398). No DOM.
// Per glucose (standard textbook bookkeeping): glycolysis gives 2 ATP (net) + 2 NADH; the link reaction gives 2 NADH +
// 2 CO₂; two turns of the Krebs cycle give 2 ATP (as GTP) + 6 NADH + 2 FADH₂ + 4 CO₂. In the electron transport
// system each NADH is worth 3 ATP and each FADH₂ 2 ATP in the older textbook count (38 ATP in all), or about 2.5 and
// 1.5 in the newer count (about 32). Fermentation gives only the 2 ATP of glycolysis.
// RQ = CO₂ given out / O₂ taken in. For complete oxidation of CₓHᵧO_z: O₂ = x + y/4 − z/2 and CO₂ = x.

export type Count = 'old' | 'new';
export const RATE = { old: { nadh: 3, fadh: 2 }, new: { nadh: 2.5, fadh: 1.5 } } as const;

export type Stage = { id: string; name: string; where: string; atp: number; nadh: number; fadh: number; co2: number; o2: number };
export const STAGES: Stage[] = [
  { id: 'gly', name: 'Glycolysis', where: 'cytoplasm', atp: 2, nadh: 2, fadh: 0, co2: 0, o2: 0 },
  { id: 'link', name: 'Link reaction (pyruvate → acetyl CoA)', where: 'mitochondrial matrix', atp: 0, nadh: 2, fadh: 0, co2: 2, o2: 0 },
  { id: 'krebs', name: 'Krebs cycle (two turns)', where: 'mitochondrial matrix', atp: 2, nadh: 6, fadh: 2, co2: 4, o2: 0 },
  { id: 'ets', name: 'Electron transport system and oxidative phosphorylation', where: 'inner mitochondrial membrane', atp: 0, nadh: 0, fadh: 0, co2: 0, o2: 6 },
];

/** Running totals after stage index k (0..3), for `glucose` molecules. */
export function ledger(k: number, count: Count, glucose = 1) {
  let atp = 0, nadh = 0, fadh = 0, co2 = 0, o2 = 0, etsAtp = 0;
  for (let i = 0; i <= k; i++) { const s = STAGES[i]; atp += s.atp; nadh += s.nadh; fadh += s.fadh; co2 += s.co2; o2 += s.o2; }
  if (k >= 3) { etsAtp = nadh * RATE[count].nadh + fadh * RATE[count].fadh; }
  const g = glucose;
  return { substrateAtp: atp * g, nadh: nadh * g, fadh: fadh * g, co2: co2 * g, o2: o2 * g, etsAtp: etsAtp * g, total: (atp + etsAtp) * g };
}
export const aerobicTotal = (count: Count) => ledger(3, count).total;

/** Read a CₓHᵧO_z formula such as C6H12O6 or C51H98O6. Null if it has other elements or no carbon. */
export function parseCHO(f: string) {
  const s = f.replace(/\s/g, '');
  if (!/^([CHO]\d*)+$/.test(s)) return null;
  const n = { C: 0, H: 0, O: 0 } as Record<'C' | 'H' | 'O', number>;
  for (const m of s.matchAll(/([CHO])(\d*)/g)) n[m[1] as 'C'] += m[2] ? +m[2] : 1;
  return n.C > 0 ? n : null;
}
export function rq(f: { C: number; H: number; O: number }) {
  const o2 = f.C + f.H / 4 - f.O / 2, co2 = f.C;
  return { o2, co2, h2o: f.H / 2, rq: o2 > 0 ? co2 / o2 : Infinity };
}
export const SUBSTRATES = [
  { id: 'glucose', name: 'Glucose (carbohydrate)', f: 'C6H12O6' },
  { id: 'tripalmitin', name: 'Tripalmitin (a fat)', f: 'C51H98O6' },
  { id: 'oleic', name: 'Oleic acid (a fatty acid)', f: 'C18H34O2' },
  { id: 'malic', name: 'Malic acid (an organic acid)', f: 'C4H6O5' },
  { id: 'oxalic', name: 'Oxalic acid (an organic acid)', f: 'C2H2O4' },
];

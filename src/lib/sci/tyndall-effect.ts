// Solutions, colloids and suspensions for the school tyndall-effect tool: classify a mixture by the size of its
// particles (below 1 nm, 1 to 1000 nm, above 1000 nm, the usual school boundaries) and list what that means for
// the Tyndall effect, settling and filtering; plus mass and volume percentages of a solution. Plain TypeScript, no DOM.
import type { QuizQuestion } from '../school-quiz-b';

export type Kind = 'solution' | 'colloid' | 'suspension';
export const COLLOID_MIN = 1, COLLOID_MAX = 1000; // nm

export function classify(nm: number): Kind {
  return nm < COLLOID_MIN ? 'solution' : nm <= COLLOID_MAX ? 'colloid' : 'suspension';
}

export type Props = { kind: Kind; homogeneous: boolean; beam: boolean; settles: boolean; filters: boolean; seen: boolean; clear: string };
export function properties(nm: number): Props {
  const kind = classify(nm);
  return {
    kind,
    homogeneous: kind === 'solution',
    beam: kind === 'colloid',
    settles: kind === 'suspension',
    filters: kind === 'suspension', // filter paper holes are roughly a micrometre or more
    seen: kind === 'suspension',
    clear: kind === 'solution' ? 'clear (transparent)' : kind === 'colloid' ? 'looks clear or milky, but a beam shows up' : 'cloudy (opaque)',
  };
}

/** How brightly the beam's path glows (0 to 1, a picture, not a measurement): nothing for a solution, rising with size through the colloid range. */
export function beamGlow(nm: number) {
  const k = classify(nm);
  if (k === 'solution') return 0;
  if (k === 'colloid') return Math.min(1, 0.25 + 0.75 * (Math.log10(nm) / 3));
  return 0.35; // a suspension scatters so much that the liquid is cloudy and the beam fades quickly
}

export type Sample = { id: string; name: string; nm: number; phase: string; medium: string; type: string };
// Typical, rounded particle sizes for teaching (they vary a lot in real samples).
export const SAMPLES: Sample[] = [
  { id: 'salt', name: 'Salt in water', nm: 0.3, phase: 'solid', medium: 'liquid', type: 'solution' },
  { id: 'sugar', name: 'Sugar in water', nm: 0.9, phase: 'solid', medium: 'liquid', type: 'solution' },
  { id: 'cuso4', name: 'Copper sulphate in water', nm: 0.5, phase: 'solid', medium: 'liquid', type: 'solution' },
  { id: 'starch', name: 'Starch in hot water', nm: 50, phase: 'solid', medium: 'liquid', type: 'sol' },
  { id: 'milk', name: 'Milk with water', nm: 400, phase: 'liquid', medium: 'liquid', type: 'emulsion' },
  { id: 'soap', name: 'Soapy water', nm: 20, phase: 'solid', medium: 'liquid', type: 'sol' },
  { id: 'fog', name: 'Fog or mist', nm: 800, phase: 'liquid', medium: 'gas', type: 'aerosol' },
  { id: 'chalk', name: 'Chalk powder in water', nm: 5000, phase: 'solid', medium: 'liquid', type: 'suspension' },
  { id: 'mud', name: 'Muddy water', nm: 20000, phase: 'solid', medium: 'liquid', type: 'suspension' },
];

/** Mass by mass percentage of a solution: solute ÷ (solute + solvent) × 100. */
export const massPercent = (solute: number, solvent: number) => (solute / (solute + solvent)) * 100;
/** Mass by volume percentage: grams of solute in 100 mL of solution. */
export const massVolPercent = (soluteG: number, solutionMl: number) => (soluteG / solutionMl) * 100;

const pick = (r: () => number, a: number, b: number) => a + Math.floor(r() * (b - a + 1));
const n = (x: number, d = 2) => String(Math.round(x * 10 ** d) / 10 ** d);
export function questions(r: () => number = Math.random): QuizQuestion[] {
  const qs: QuizQuestion[] = [];
  { const s = pick(r, 2, 12) * 5, w = pick(r, 4, 20) * 10, p = massPercent(s, w);
    qs.push({ text: `${s} g of salt is dissolved in ${w} g of water. What is the mass by mass percentage of the solution?`, ans: p, unit: '%', work: `Mass of solution = ${s} + ${w} = ${s + w} g. Mass % = ${s} ÷ ${s + w} × 100 = ${n(p)} %.` }); }
  { const M = pick(r, 2, 10) * 50, p = pick(r, 1, 4) * 5, s = (M * p) / 100;
    qs.push({ text: `You want ${M} g of a ${p} % (by mass) sugar solution. How many grams of sugar do you need?`, ans: s, unit: 'g', work: `Sugar = ${p} % of ${M} g = ${p} ÷ 100 × ${M} = ${n(s)} g, topped up with ${n(M - s)} g of water.` }); }
  { const g = pick(r, 2, 20), v = pick(r, 2, 10) * 50, p = massVolPercent(g, v);
    qs.push({ text: `${g} g of glucose is dissolved to make ${v} mL of solution. What is the mass by volume percentage?`, ans: p, unit: '%', work: `Mass by volume % = grams of solute ÷ mL of solution × 100 = ${g} ÷ ${v} × 100 = ${n(p)} %.` }); }
  { const nm = pick(r, 2, 9) * 100;
    qs.push({ text: `A particle is ${nm} nm across. How many micrometres (µm) is that? (1 µm = 1000 nm)`, ans: nm / 1000, unit: 'µm', tol: 0.001, work: `${nm} ÷ 1000 = ${n(nm / 1000, 3)} µm. Between 1 nm and 1000 nm (1 µm), so a mixture of such particles is a colloid.` }); }
  return qs;
}

// Polarity of small molecules: each bond dipole points to the more electronegative atom with a size set by the
// Pauling electronegativity difference; their vector sum over the VSEPR shape says whether the molecule is polar.
// A relative teaching model (not debye values). Plain maths, no DOM. Used by the #1109 dipole and polarity tool.
import { shapeOf, countPairs, formulaText, type Vec } from './vsepr.ts';
import { EN } from './lewis.ts';

export type Bond = { el: string; dir: Vec; dEN: number; vec: Vec };
export type Polarity = { name: string; shape: string; bonds: Bond[]; lone: number; lonePos: Vec[]; net: Vec; size: number; polar: boolean; why: string; lp: 'adds' | 'opposes' | null };

/** Measured dipole moments in debye (gas phase, standard data-book values), for comparison with the model. */
export const MEASURED: Record<string, number> = { co2: 0, h2o: 1.85, nh3: 1.47, nf3: 0.23, ch4: 0, ccl4: 0, ch3cl: 1.87, ch2cl2: 1.6, chcl3: 1.04, bf3: 0, so2: 1.63, h2s: 0.97, becl2: 0, pcl5: 0, sf4: 0.63, clf3: 0.6, xef4: 0, sf6: 0, hcl: 1.11 };

const SUB = (n: number) => (n > 1 ? String(n).replace(/\d/g, (d) => '₀₁₂₃₄₅₆₇₈₉'[+d]) : '');
/** Formula as chemists write these: CH₃Cl, CHCl₃, HCl; otherwise central atom first. */
export function nameOf(central: string, outer: string[], charge = 0): string {
  const counts = new Map<string, number>(); for (const o of outer) counts.set(o, (counts.get(o) || 0) + 1);
  if (outer.length === 1 && outer[0] === 'H') return 'H' + central;
  if (central === 'C' && counts.has('H')) return 'C' + 'H' + SUB(counts.get('H')!) + [...counts].filter(([e]) => e !== 'H').map(([e, n]) => e + SUB(n)).join('');
  return formulaText(central, [...counts].map(([el, n]) => ({ el, n })), charge);
}

export const PRESETS: { id: string; central: string; outer: string[]; charge?: number }[] = [
  { id: 'co2', central: 'C', outer: ['O', 'O'] }, { id: 'h2o', central: 'O', outer: ['H', 'H'] }, { id: 'nh3', central: 'N', outer: ['H', 'H', 'H'] },
  { id: 'nf3', central: 'N', outer: ['F', 'F', 'F'] }, { id: 'ch4', central: 'C', outer: ['H', 'H', 'H', 'H'] }, { id: 'ccl4', central: 'C', outer: ['Cl', 'Cl', 'Cl', 'Cl'] },
  { id: 'ch3cl', central: 'C', outer: ['Cl', 'H', 'H', 'H'] }, { id: 'ch2cl2', central: 'C', outer: ['Cl', 'Cl', 'H', 'H'] }, { id: 'chcl3', central: 'C', outer: ['Cl', 'Cl', 'Cl', 'H'] },
  { id: 'bf3', central: 'B', outer: ['F', 'F', 'F'] }, { id: 'so2', central: 'S', outer: ['O', 'O'] }, { id: 'h2s', central: 'S', outer: ['H', 'H'] },
  { id: 'becl2', central: 'Be', outer: ['Cl', 'Cl'] }, { id: 'pcl5', central: 'P', outer: ['Cl', 'Cl', 'Cl', 'Cl', 'Cl'] }, { id: 'sf4', central: 'S', outer: ['F', 'F', 'F', 'F'] },
  { id: 'clf3', central: 'Cl', outer: ['F', 'F', 'F'] }, { id: 'xef4', central: 'Xe', outer: ['F', 'F', 'F', 'F'] }, { id: 'sf6', central: 'S', outer: ['F', 'F', 'F', 'F', 'F', 'F'] },
  { id: 'hcl', central: 'Cl', outer: ['H'] },
];

/** Polarity of a central atom with outer atoms (listed in the order they fill the VSEPR bond sites). */
export function polarity(central: string, outer: string[], charge = 0): Polarity | string {
  const counts = new Map<string, number>(); for (const o of outer) counts.set(o, (counts.get(o) || 0) + 1);
  const list = [...counts].map(([el, n]) => ({ el, n }));
  const c = countPairs(central, list, charge);
  if (typeof c === 'string') return c;
  const sh = shapeOf(c.bonds, c.lone);
  if (typeof sh === 'string') return sh;
  if (!(central in EN) || outer.some((o) => !(o in EN))) return 'No electronegativity for one of these atoms.';
  const bonds: Bond[] = outer.map((el, i) => {
    const dir = sh.positions[i], d = Math.round((EN[el] - EN[central]) * 100) / 100;
    return { el, dir, dEN: d, vec: [dir[0] * d, dir[1] * d, dir[2] * d] as Vec };
  });
  const net: Vec = [0, 1, 2].map((k) => bonds.reduce((s, b) => s + b.vec[k], 0)) as Vec;
  const size = Math.hypot(...net), polar = size > 0.02;
  const same = counts.size === 1, symmetric = Math.hypot(...[0, 1, 2].map((k) => sh.positions.slice(0, c.bonds).reduce((s, p) => s + p[k], 0))) < 1e-9;
  let why: string;
  if (bonds.length === 1) why = Math.abs(bonds[0].dEN) < 0.02 ? 'One non-polar bond: no dipole.' : 'Only one bond, so there is nothing to cancel its dipole.';
  else if (bonds.every((b) => Math.abs(b.dEN) < 0.02)) why = 'The bonds are (nearly) non-polar: the atoms have about the same electronegativity.';
  else if (!polar && same && symmetric) why = `The ${sh.shape} shape is symmetric: the equal bond dipoles point evenly in all directions and cancel.`;
  else if (!polar) why = 'The bond dipoles happen to cancel.';
  else if (same) why = `The ${sh.shape} shape is not symmetric${c.lone ? ' (lone pairs push the bonds to one side)' : ''}, so the bond dipoles do not cancel.`;
  else why = 'The outer atoms differ, so the bond dipoles are not equal and do not cancel.';
  const lonePos = sh.positions.slice(c.bonds);
  const name = nameOf(central, outer, charge);
  // A lone pair is a dipole of its own pointing away from the central atom; it adds to or works against the bonds.
  const L = [0, 1, 2].map((k) => lonePos.reduce((s, p) => s + p[k], 0));
  const dot = L[0] * net[0] + L[1] * net[1] + L[2] * net[2];
  const lp = c.lone && Math.hypot(...L) > 1e-6 && polar ? (dot > 0 ? 'adds' : 'opposes') : null;
  return { name, shape: sh.shape, bonds, lone: c.lone, lonePos, net, size: Math.round(size * 100) / 100, polar, why, lp };
}

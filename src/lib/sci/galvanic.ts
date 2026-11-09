// Galvanic cell builder (school level): two metal | metal-ion half-cells (or the hydrogen electrode); the one with the
// lower standard reduction potential is the anode. E°cell, the cell reaction and notation, ΔG° = −nFE°, K, and the
// Nernst equation at other concentrations. Potentials and cell maths come from nernst.ts. Pure functions, no DOM.
import { half, cellReaction, cellStandard, cellNotation, halfText, thermalV, F, R, type Half } from './nernst.ts';

/** Half-cells offered here: a metal in a solution of its own ions, plus the standard hydrogen electrode. */
export const CELL_IDS = ['Mg', 'Al', 'Zn', 'Fe', 'Ni', 'Sn', 'Pb', 'H2', 'Cu2', 'Ag'];
export const halfCell = (id: string) => { const h = half(id); if (!h || !CELL_IDS.includes(id)) throw new Error('Pick a half-cell from the list.'); return h; };
/** The ion in solution for a half-cell (Zn²⁺, H⁺ …). */
export const ionOf = (h: Half) => h.ox.find(([, , st]) => st === 'aq')![1];
/** The electrode: the metal, or platinum for the hydrogen electrode. */
export const electrodeOf = (h: Half) => h.red.find(([, , st]) => st === 's')?.[1] ?? 'Pt';

export type Cell = {
  anode: Half; cathode: Half; E0: number; n: number; dG0: number; lnK: number;
  lnQ: number; E: number; dG: number; reactants: { f: string; st: string; nu: number }[]; products: { f: string; st: string; nu: number }[];
};

/** Build the cell from two half-cells and the ion concentrations in each (mol/L; H₂ at 1 bar). */
export function build(aId: string, bId: string, cA: number, cB: number, T = 298.15): Cell {
  if (aId === bId) throw new Error('Pick two different half-cells.');
  if (!(cA > 0) || !(cB > 0)) throw new Error('Concentrations must be above zero.');
  const a = halfCell(aId), b = halfCell(bId);
  const [anode, cathode, cAn, cCat] = a.E < b.E ? [a, b, cA, cB] : [b, a, cB, cA];
  const r = cellReaction(cathode, anode);
  const st = cellStandard(cathode.E, anode.E, r.n, T);
  const act = (f: string, s: string) => (s !== 'aq' ? 1 : f === ionOf(anode) ? cAn : f === ionOf(cathode) ? cCat : 1);
  const lnQ = r.products.reduce((x, p) => x + p.nu * Math.log(act(p.f, p.st)), 0) - r.reactants.reduce((x, p) => x + p.nu * Math.log(act(p.f, p.st)), 0);
  const E = st.E0 - (thermalV(T) / r.n) * lnQ;
  return { anode, cathode, E0: st.E0, n: r.n, dG0: st.dG0, lnK: st.lnK, lnQ, E, dG: (-r.n * F * E) / 1000, reactants: r.reactants, products: r.products };
}

export { cellNotation, halfText, F, R };

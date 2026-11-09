// Le Chatelier sandbox (school level): gas-phase equilibria in a box. Add or remove a gas, squeeze or expand the box,
// heat or cool it, and find the new equilibrium (Kc, concentrations in mol/L) with Q against K and an ICE table.
// K values are illustrative (chosen so the shifts are easy to see); K changes with temperature by the van 't Hoff
// equation with the reaction's ΔH. Pure functions, no DOM.

export const R = 8.314462618; // J/(mol K)

export type Sp = { f: string; nu: number }; // nu < 0 for reactants
export type Reaction = { id: string; text: string; species: Sp[]; dH: number; K0: number; T0: number; start: number[]; V0: number; note: string };

export const REACTIONS: Reaction[] = [
  { id: 'haber', text: 'N₂ + 3H₂ ⇌ 2NH₃', species: [{ f: 'N2', nu: -1 }, { f: 'H2', nu: -3 }, { f: 'NH3', nu: 2 }], dH: -92, K0: 0.5, T0: 700, start: [1, 3, 0], V0: 1, note: 'Making ammonia (the Haber process): exothermic, fewer gas molecules on the right.' },
  { id: 'contact', text: '2SO₂ + O₂ ⇌ 2SO₃', species: [{ f: 'SO2', nu: -2 }, { f: 'O2', nu: -1 }, { f: 'SO3', nu: 2 }], dH: -197, K0: 10, T0: 900, start: [2, 1, 0], V0: 1, note: 'A step in making sulfuric acid (the contact process): exothermic, fewer gas molecules on the right.' },
  { id: 'n2o4', text: 'N₂O₄ ⇌ 2NO₂', species: [{ f: 'N2O4', nu: -1 }, { f: 'NO2', nu: 2 }], dH: 57, K0: 0.1, T0: 330, start: [1, 0], V0: 1, note: 'Colourless N₂O₄ and brown NO₂: endothermic, more gas molecules on the right.' },
  { id: 'hi', text: 'H₂ + I₂ ⇌ 2HI', species: [{ f: 'H2', nu: -1 }, { f: 'I2', nu: -1 }, { f: 'HI', nu: 2 }], dH: -10, K0: 50, T0: 700, start: [1, 1, 0], V0: 1, note: 'Same number of gas molecules on both sides, so squeezing does not shift it; slightly exothermic.' },
];

/** Kc at temperature T by the van 't Hoff equation (ΔH in kJ/mol, taken as constant). */
export const Kat = (r: Reaction, T: number) => r.K0 * Math.exp((-r.dH * 1000 / R) * (1 / T - 1 / r.T0));

/** Reaction quotient Qc for moles n in volume V (litres). Infinity if a reactant is 0 and products are not. */
export function Q(r: Reaction, n: number[], V: number): number {
  let lq = 0;
  for (let i = 0; i < n.length; i++) {
    const c = n[i] / V, nu = r.species[i].nu;
    if (c === 0) { if (nu > 0) return 0; return Infinity; }
    lq += nu * Math.log(c);
  }
  return Math.exp(lq);
}

/** Change in the number of gas molecules from left to right. */
export const dn = (r: Reaction) => r.species.reduce((a, s) => a + s.nu, 0);

/** Equilibrium from moles n in volume V at temperature T: the extent ξ (mol, + = to the right) with Qc = Kc. */
export function equilibrate(r: Reaction, n: number[], V: number, T: number): { xi: number; n: number[]; K: number } {
  if (!(V > 0) || !(T > 0)) throw new Error('Volume and temperature must be above zero.');
  if (n.some((x) => !(x >= 0))) throw new Error('Amounts must be zero or more.');
  const K = Kat(r, T);
  let lo = -Infinity, hi = Infinity;
  r.species.forEach((s, i) => { const lim = -n[i] / s.nu; if (s.nu < 0) hi = Math.min(hi, lim); else lo = Math.max(lo, lim); });
  if (!Number.isFinite(lo) || !Number.isFinite(hi) || hi - lo <= 0) return { xi: 0, n: [...n], K };
  const f = (xi: number) => r.species.reduce((a, s, i) => a + s.nu * Math.log((n[i] + s.nu * xi) / V), 0) - Math.log(K);
  let a = lo, b = hi;
  for (let k = 0; k < 200; k++) {
    const m = (a + b) / 2;
    if (m === a || m === b) break;
    if (f(m) > 0) b = m; else a = m;
  }
  const xi = (a + b) / 2;
  return { xi, n: n.map((x, i) => Math.max(0, x + r.species[i].nu * xi)), K };
}

export type Change = 'add' | 'remove' | 'squeeze' | 'expand' | 'heat' | 'cool' | 'catalyst';

/** Which way Le Chatelier's principle says the equilibrium moves. */
export function predict(r: Reaction, change: Change, species = 0): 'right' | 'left' | 'none' {
  const nu = r.species[species]?.nu ?? 0, d = dn(r);
  switch (change) {
    case 'add': return nu < 0 ? 'right' : 'left';
    case 'remove': return nu < 0 ? 'left' : 'right';
    case 'squeeze': return d < 0 ? 'right' : d > 0 ? 'left' : 'none';
    case 'expand': return d < 0 ? 'left' : d > 0 ? 'right' : 'none';
    case 'heat': return r.dH > 0 ? 'right' : 'left';
    case 'cool': return r.dH > 0 ? 'left' : 'right';
    default: return 'none';
  }
}

/** Kc expression as text, e.g. "[NH₃]² / ([N₂][H₂]³)". */
export function kExpr(r: Reaction, sub = (f: string) => f): string {
  const part = (ss: Sp[]) => ss.map((s) => `[${sub(s.f)}]${Math.abs(s.nu) === 1 ? '' : '⁰¹²³⁴⁵⁶⁷⁸⁹'[Math.abs(s.nu)]}`).join('');
  const top = part(r.species.filter((s) => s.nu > 0)), bot = r.species.filter((s) => s.nu < 0);
  return `${top} / ${bot.length > 1 ? `(${part(bot)})` : part(bot)}`;
}

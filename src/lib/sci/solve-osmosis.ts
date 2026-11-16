// "Solve my numbers" for the osmosis lab: osmotic pressure π = iCRT, the concentration for a given π, water potential
// ψ = ψs + ψp (with ψs = −iCRT), which way water moves between two cells or solutions, the % change in mass of a potato
// piece, and the isotonic concentration from two readings of a practical. Plain maths, no DOM. Engine: solvecore-b.ts.
import { sf, type SSpec, type SIn, type SOut } from '../learn/solvecore-b.ts';
import { RT } from './osmosis.ts';

type Ctx = { find: string; ch: Record<string, string> };
const PU: [string, number][] = [['MPa', 1], ['kPa', 1e-3], ['Pa', 1e-6], ['bar', 0.1], ['atm', 0.101325]];
const IVAL: Record<string, [number, string]> = { glucose: [1, 'glucose'], sucrose: [1, 'sucrose'], nacl: [2, 'NaCl'], cacl2: [3, 'CaCl₂'] };
const TIP = 'Common mistakes: using °C instead of kelvin inside RT (the card converts for you), forgetting the van \'t Hoff factor i (2 for NaCl), and giving a negative sign to osmotic pressure (π is positive, but ψs is negative).';

function ifac(i: Record<string, SIn>, c: Ctx): { i: number; name: string } | SOut {
  if (c.ch.sol === 'custom') { const v = i.iv?.v; if (!(v >= 1)) return { error: 'The van \'t Hoff factor i is at least 1 (the number of particles per formula unit).' }; return { i: v, name: 'solute' }; }
  const [v, n] = IVAL[c.ch.sol ?? 'sucrose']; return { i: v, name: n };
}
function temp(i: Record<string, SIn>, c: Ctx): { tC: number; tK: number } | SOut {
  const t = i.T.typed, tC = c.ch.tk === 'k' ? t - 273.15 : t;
  if (!(tC > -273.15)) return { error: 'The temperature must be above absolute zero.' };
  return { tC, tK: tC + 273.15 };
}
const bad = (x: unknown): x is SOut => typeof x === 'object' && x !== null && 'error' in x;
const MPa = (x: number) => `${sf(x)} MPa`;
const alt = (mpa: number) => `${sf(mpa * 10)} bar = ${sf(mpa / 0.101325)} atm = ${sf(mpa * 1000)} kPa`;

export function osm(i: Record<string, SIn>, c: Ctx): SOut {
  const f = c.find;
  if (f === 'pi' || f === 'C' || f === 'psi') {
    const iv = ifac(i, c); if (bad(iv)) return iv;
    const t = temp(i, c); if (bad(t)) return t;
    const rt = RT(t.tC), tl = `RT = 0.008314 MPa·L/(mol·K) × ${sf(t.tK, 5)} K = ${sf(rt, 4)} MPa·L/mol`;
    if (f === 'pi') {
      const C = i.C.v; if (!(C >= 0)) return { error: 'The concentration cannot be negative.' };
      const p = iv.i * C * rt;
      return { answer: `The osmotic pressure is ${MPa(p)} (${alt(p)}).`, lines: ['Formula: π = i C R T', tl, `π = ${sf(iv.i)} × ${sf(C)} mol/L × ${sf(rt, 4)} MPa·L/mol = ${MPa(p)}`, `ψs = −π = −${MPa(p)}`], tip: TIP };
    }
    if (f === 'C') {
      const p = i.pi.v; if (!(p > 0)) return { error: 'The osmotic pressure must be more than 0.' };
      const C = p / (iv.i * rt);
      return { answer: `The ${iv.name} concentration is ${sf(C)} mol/L.`, lines: ['Formula: π = i C R T, so C = π ÷ (i R T)', tl, ...(i.pi.u === 'MPa' ? [] : [`π = ${sf(i.pi.typed)} ${i.pi.u} = ${MPa(p)}`]), `C = ${sf(p)} ÷ (${sf(iv.i)} × ${sf(rt, 4)}) = ${sf(C)} mol/L`], tip: TIP };
    }
    const C = i.C.v, pp = i.pp && !i.pp.blank ? i.pp.v : 0;
    if (!(C >= 0)) return { error: 'The concentration cannot be negative.' };
    if (pp < 0) return { error: 'Pressure potential ψp is zero or positive (the wall pushes back; it never pulls).' };
    const ps = -iv.i * C * rt, psi = ps + pp;
    return { answer: `The water potential is ψ = ${MPa(psi)} (${psi < 0 ? 'water tends to move in' : psi === 0 ? 'the same as pure water' : 'water tends to move out'}).`, lines: ['Formulas: ψs = −i C R T and ψ = ψs + ψp', tl, `ψs = −${sf(iv.i)} × ${sf(C)} × ${sf(rt, 4)} = ${MPa(ps)}`, `ψ = ${sf(ps)} + ${sf(pp)} = ${MPa(psi)}`, 'Pure water in an open dish has ψ = 0; every solution has a lower (more negative) ψ.'], tip: TIP };
  }
  if (f === 'flow') {
    const a = i.psiA.v, b = i.psiB.v;
    const lines = [`ψ(A) = ${MPa(a)}, ψ(B) = ${MPa(b)}`, 'Water always moves from the higher water potential (less negative) to the lower (more negative).'];
    if (Math.abs(a - b) < 1e-12) return { answer: 'The water potentials are equal, so there is no net movement of water (equilibrium).', lines, tip: 'Water moves down a water potential gradient, not "from low concentration to high" by magic: more negative ψ means more solute or less pressure.' };
    const from = a > b ? 'A' : 'B', to = a > b ? 'B' : 'A';
    lines.push(`${from} has the higher ψ, so water moves from ${from} into ${to}.`);
    return { answer: `Water moves from ${from} into ${to} (ψ = ${MPa(Math.max(a, b))} to ${MPa(Math.min(a, b))}).`, lines, tip: 'Water moves down a water potential gradient. Compare the numbers with their signs: −0.3 MPa is higher than −0.9 MPa.' };
  }
  if (f === 'pct') {
    const m0 = i.m0.v, m1 = i.m1.v;
    if (!(m0 > 0) || !(m1 >= 0)) return { error: 'The starting mass must be more than 0 and the final mass 0 or more.' };
    const pct = ((m1 - m0) / m0) * 100;
    const lines = ['Percentage change = (final − initial) ÷ initial × 100', `= (${sf(i.m1.typed)} − ${sf(i.m0.typed)}) ÷ ${sf(i.m0.typed)} × 100 = ${sf(pct)}%`];
    const verdict = Math.abs(pct) < 0.05 ? 'No change in mass: the solution is about isotonic with the cells.' : pct > 0 ? 'The piece gained mass: water moved in, so the solution was hypotonic to the cells (weaker than the cell sap).' : 'The piece lost mass: water moved out, so the solution was hypertonic to the cells (stronger than the cell sap).';
    lines.push(verdict);
    return { answer: `The mass changed by ${pct > 0 ? '+' : ''}${sf(pct)}%. ${verdict}`, lines, tip: 'Divide by the starting mass, not the final mass. Blot the piece dry before weighing, or the surface water adds to the final mass.' };
  }
  // iso: two readings either side of zero
  const c1 = i.c1.v, c2 = i.c2.v, p1 = i.p1.typed, p2 = i.p2.typed;
  if (!(c1 >= 0 && c2 >= 0) || c1 === c2) return { error: 'Type two different concentrations (0 or more).' };
  if (p1 === 0) return { answer: `The % change is 0 at ${sf(c1)} mol/L, so that is the isotonic concentration.`, lines: ['A reading of 0% change means the solution matches the cell sap.'], tip: 'The isotonic concentration is where the graph of % change against concentration crosses 0.' };
  if (p2 === 0) return { answer: `The % change is 0 at ${sf(c2)} mol/L, so that is the isotonic concentration.`, lines: ['A reading of 0% change means the solution matches the cell sap.'], tip: 'The isotonic concentration is where the graph of % change against concentration crosses 0.' };
  if (p1 * p2 > 0) return { error: 'Both readings are gains or both are losses, so the line does not cross zero between them. Use one reading above zero and one below.' };
  const c0 = c1 + ((c2 - c1) * p1) / (p1 - p2);
  return { answer: `The isotonic concentration is about ${sf(c0)} mol/L (where the % change is 0).`, lines: ['Draw a straight line between the two points (concentration, % change) and read where it crosses 0.', `c₀ = c₁ + (c₂ − c₁) × p₁ ÷ (p₁ − p₂) = ${sf(c1)} + (${sf(c2)} − ${sf(c1)}) × ${sf(p1)} ÷ (${sf(p1)} − ${p2 < 0 ? `(${sf(p2)})` : sf(p2)}) = ${sf(c0)} mol/L`], tip: 'Use readings close to the crossing point, and a graph of all your pieces for a better estimate. The line between two points is only an approximation.' };
}

const showSol = (c: Ctx) => ['pi', 'C', 'psi'].includes(c.find);
export const OSMOSIS_SPEC: SSpec = {
  id: 'osmosis',
  finds: [['pi', 'Osmotic pressure π'], ['C', 'Concentration from π'], ['psi', 'Water potential ψ'], ['flow', 'Which way does water move?'], ['pct', '% change in mass'], ['iso', 'Isotonic concentration from 2 readings']],
  fields: [
    { k: 'sol', kind: 'choice', label: 'Solute', def: 'sucrose', show: showSol, options: [['sucrose', 'Sugar (sucrose), i = 1'], ['glucose', 'Glucose, i = 1'], ['nacl', 'Salt (NaCl), i = 2'], ['cacl2', 'CaCl₂, i = 3'], ['custom', 'Other (type i)']] },
    { k: 'iv', label: 'Van \'t Hoff factor i', show: (c) => showSol(c) && c.ch.sol === 'custom', ph: 'e.g. 2' },
    { k: 'C', label: 'Concentration', units: [['mol/L', 1], ['mmol/L', 1e-3]], show: (c) => c.find === 'pi' || c.find === 'psi', ph: 'e.g. 0.5' },
    { k: 'pi', label: 'Osmotic pressure π', units: PU, show: (c) => c.find === 'C', ph: 'e.g. 0.7' },
    { k: 'tk', kind: 'choice', label: 'Temperature given in', def: 'c', show: showSol, options: [['c', '°C'], ['k', 'kelvin (K)']] },
    { k: 'T', label: 'Temperature', neg: true, show: showSol, ph: 'e.g. 25' },
    { k: 'pp', label: 'Pressure potential ψp (blank for 0)', units: PU, optional: true, show: (c) => c.find === 'psi', ph: 'e.g. 0.3' },
    { k: 'psiA', label: 'Water potential of A (negative)', units: PU, neg: true, show: (c) => c.find === 'flow', ph: 'e.g. -0.9' },
    { k: 'psiB', label: 'Water potential of B (negative)', units: PU, neg: true, show: (c) => c.find === 'flow', ph: 'e.g. -5' },
    { k: 'm0', label: 'Mass before', units: [['g', 1], ['mg', 1e-3]], show: (c) => c.find === 'pct', ph: 'e.g. 5.0' },
    { k: 'm1', label: 'Mass after', units: [['g', 1], ['mg', 1e-3]], show: (c) => c.find === 'pct', ph: 'e.g. 5.6' },
    { k: 'c1', label: 'Solution 1: concentration (mol/L)', show: (c) => c.find === 'iso', ph: 'e.g. 0.2' },
    { k: 'p1', label: 'Solution 1: % change in mass', neg: true, show: (c) => c.find === 'iso', ph: 'e.g. 8' },
    { k: 'c2', label: 'Solution 2: concentration (mol/L)', show: (c) => c.find === 'iso', ph: 'e.g. 0.4' },
    { k: 'p2', label: 'Solution 2: % change in mass', neg: true, show: (c) => c.find === 'iso', ph: 'e.g. -10' },
  ],
  presets: [
    { name: '0.5 mol/L sugar at 25 °C: osmotic pressure', find: 'pi', vals: { C: '0.5', T: '25' }, ch: { sol: 'sucrose', tk: 'c' } },
    { name: '0.15 mol/L salt solution at 37 °C: osmotic pressure', find: 'pi', vals: { C: '0.15', T: '37' }, ch: { sol: 'nacl', tk: 'c' } },
    { name: 'Sugar solution with π = 0.7 MPa at 27 °C: concentration', find: 'C', vals: { pi: '0.7', T: '27' }, ch: { sol: 'sucrose', tk: 'c' } },
    { name: '0.2 mol/L salt at 25 °C with ψp = 0.3 MPa: ψ', find: 'psi', vals: { C: '0.2', T: '25', pp: '0.3' }, ch: { sol: 'nacl', tk: 'c' } },
    { name: 'ψ(A) = −0.9 MPa, ψ(B) = −5 bar: which way?', find: 'flow', vals: { psiA: ['-0.9', 'MPa'], psiB: ['-5', 'bar'] } },
    { name: 'Potato piece 5.0 g becomes 5.6 g', find: 'pct', vals: { m0: '5.0', m1: '5.6' } },
    { name: '+8% at 0.2 mol/L and −10% at 0.4 mol/L: isotonic point', find: 'iso', vals: { c1: '0.2', p1: '8', c2: '0.4', p2: '-10' } },
  ],
  solve: (i, c) => osm(i, c),
};

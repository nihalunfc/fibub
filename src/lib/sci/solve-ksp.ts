// "Solve my numbers" for the Ksp predictor: will a solid form when two solutions are mixed (Q against Ksp), the molar
// solubility from Ksp (with an optional common ion), Ksp from a measured solubility, and the ion concentration at which
// a solid starts to form. Salt AₐBᵦ ⇌ a A + b B, Ksp = [A]^a [B]^b. Plain maths, no DOM. Engine: src/lib/learn/solvecore-b.ts.
import { sf, type SSpec, type SIn, type SOut } from '../learn/solvecore-b.ts';
import { ionicProduct, mix, precipitate, solubility } from './ksp-precipitation.ts';

const SUPD = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const pw = (s: string, n: number) => (n > 1 ? `[${s}]${SUPD[n]}` : `[${s}]`);
const ab = (t: string): [number, number] => { const [a, b] = t.split(':').map(Number); return [a, b]; };
const kspOk = (k: number) => (k > 0 && k < 1 ? '' : 'Ksp must be a small positive number such as 1.8e-10 (it is always less than 1 for these salts).');

export function ksp(i: Record<string, SIn>, c: { find: string; ch: Record<string, string> }): SOut {
  const [a, b] = ab(c.ch.type ?? '1:1'), K = i.ksp?.v;
  const expr = `Ksp = ${pw('A', a)}${pw('B', b)}`;
  const tip = 'Common mistakes: forgetting that mixing dilutes both solutions (use c × V₁/(V₁ + V₂)), and forgetting that [B] is squared when the salt is AB₂. Compare Q with Ksp, never with a concentration.';
  if (c.find !== 'ksp') { const e = kspOk(K); if (e) return { error: e }; }
  if (c.find === 'mix') {
    for (const k of ['c1', 'c2']) if (i[k].v < 0) return { error: 'A concentration cannot be negative.' };
    for (const k of ['v1', 'v2']) if (!(i[k].v > 0)) return { error: 'Each volume must be more than 0 mL.' };
    const m = mix(i.c1.v, i.v1.v, i.c2.v, i.v2.v), Q = ionicProduct(m.M, m.X, a, b);
    const lines = [
      `Total volume = ${sf(i.v1.v)} + ${sf(i.v2.v)} = ${sf(m.V)} mL, so each ion is diluted.`,
      `[A] = ${sf(i.c1.v)} × ${sf(i.v1.v)} ÷ ${sf(m.V)} = ${sf(m.M)} mol/L`,
      `[B] = ${sf(i.c2.v)} × ${sf(i.v2.v)} ÷ ${sf(m.V)} = ${sf(m.X)} mol/L`,
      `Q = ${pw('A', a)}${pw('B', b)} = ${sf(m.M)}${a > 1 ? SUPD[a] : ''} × ${sf(m.X)}${b > 1 ? SUPD[b] : ''} = ${sf(Q)}`,
      `Compare with ${expr} = ${sf(K)}`,
    ];
    if (Q === 0) return { answer: 'Q is 0, so no solid forms (one of the ions is missing).', lines, tip };
    if (Q > K) {
      const p = precipitate(m.M, m.X, a, b, K);
      lines.push(`Q > Ksp, so a solid forms until Q falls back to Ksp. About ${sf(p.x)} mol/L of the salt comes out, leaving [A] = ${sf(p.M)} and [B] = ${sf(p.X)} mol/L.`);
      return { answer: `Q = ${sf(Q)} is bigger than Ksp = ${sf(K)}, so a solid (precipitate) forms.`, lines, tip };
    }
    lines.push(Q === K ? 'Q = Ksp: the solution is exactly saturated, so no solid.' : 'Q < Ksp, so the ions stay dissolved.');
    return { answer: `Q = ${sf(Q)} is ${Q === K ? 'equal to' : 'smaller than'} Ksp = ${sf(K)}, so no solid forms.`, lines, tip };
  }
  if (c.find === 's') {
    const ci = c.ch.ci ?? 'none', cc = ci === 'none' ? 0 : (i.cc?.v ?? 0);
    if (ci !== 'none' && !(cc > 0)) return { error: 'Type the concentration of the common ion, more than 0.' };
    const s0 = solubility(a, b, K), ab_ = a ** a * b ** b, n = a + b;
    const lines = [`Salt AₐBᵦ ⇌ ${a > 1 ? a : ''}A + ${b > 1 ? b : ''}B`, `${expr} = (${a > 1 ? a : ''}s)${a > 1 ? SUPD[a] : ''}(${b > 1 ? b : ''}s)${b > 1 ? SUPD[b] : ''} = ${ab_ > 1 ? ab_ : ''}s${n > 1 ? SUPD[n] : ''}`, `s = (${sf(K)} ÷ ${ab_})^(1/${n}) = ${sf(s0)} mol/L`];
    if (ci === 'none') return { answer: `The molar solubility is ${sf(s0)} mol/L.`, lines, tip: 'Common mistake: writing Ksp = s² for every salt. That is only for AB. For AB₂ it is 4s³ and for A₂B₃ it is 108s⁵.' };
    const s1 = solubility(a, b, K, ci === 'cation' ? cc : 0, ci === 'anion' ? cc : 0);
    lines.push(`With ${sf(cc)} mol/L of extra ${ci === 'cation' ? 'A' : 'B'} already in the water, solve ${expr} using the total concentration of that ion: s = ${sf(s1)} mol/L.`);
    return { answer: `In pure water s = ${sf(s0)} mol/L; with the common ion it falls to ${sf(s1)} mol/L (${sf(s0 / s1, 3)} times less).`, lines, tip: 'The extra ion is not "used up": its concentration is the extra amount plus the little that dissolves from the salt, which is usually negligible when s is tiny.' };
  }
  if (c.find === 'ksp') {
    let s = i.s.v;
    const lines: string[] = [];
    if (i.s.u === 'g/L') {
      if (i.mm.blank || !(i.mm.v > 0)) return { idle: 'To use g/L, type the molar mass of the salt in g/mol (or pick mol/L).' };
      lines.push(`Convert: s = ${sf(i.s.typed)} g/L ÷ ${sf(i.mm.v, 4)} g/mol = ${sf(i.s.typed / i.mm.v)} mol/L`); s = i.s.typed / i.mm.v;
    } else if (i.s.u !== 'mol/L') lines.push(`Convert: ${sf(i.s.typed)} ${i.s.u} = ${sf(s)} mol/L`);
    if (!(s > 0)) return { error: 'The solubility must be more than 0.' };
    const k = (a * s) ** a * (b * s) ** b;
    lines.push(`[A] = ${a > 1 ? a + ' × ' + sf(s) + ' = ' : ''}${sf(a * s)} mol/L, [B] = ${b > 1 ? b + ' × ' + sf(s) + ' = ' : ''}${sf(b * s)} mol/L`, `${expr} = ${sf(a * s)}${a > 1 ? SUPD[a] : ''} × ${sf(b * s)}${b > 1 ? SUPD[b] : ''} = ${sf(k)}`);
    return { answer: `Ksp = ${sf(k)}.`, lines, tip: 'Common mistake: using s for the ion concentrations. For AB₂, [A] = s but [B] = 2s, and the 2s is squared as well.' };
  }
  // cmin: the known ion's concentration, find how much of the other ion makes Q reach Ksp
  const known = c.ch.known ?? 'cation', cK = i.cK.v;
  if (!(cK > 0)) return { error: 'The known ion concentration must be more than 0.' };
  const need = known === 'cation' ? (K / cK ** a) ** (1 / b) : (K / cK ** b) ** (1 / a);
  const other = known === 'cation' ? 'B' : 'A', ex = known === 'cation' ? b : a, ek = known === 'cation' ? a : b;
  const lines = [`At the start of precipitation Q = Ksp, so ${pw(known === 'cation' ? 'A' : 'B', ek)}${pw(other, ex)} = ${sf(K)}`, `[${other}] = (${sf(K)} ÷ ${sf(cK)}${ek > 1 ? SUPD[ek] : ''})^(1/${ex}) = ${sf(need)} mol/L`];
  return { answer: `A solid just starts to form when [${other}] reaches ${sf(need)} mol/L (after mixing, so allow for dilution).`, lines, tip: 'This is the concentration after mixing. If you add a small volume of the other solution, work back with c₁V₁ = c₂V₂.' };
}

const TYPES: [string, string][] = [['1:1', 'AB (AgCl, BaSO₄)'], ['1:2', 'AB₂ (PbI₂, CaF₂)'], ['2:1', 'A₂B (Ag₂CrO₄)'], ['1:3', 'AB₃ (Al(OH)₃)'], ['3:1', 'A₃B (Ag₃PO₄)'], ['3:2', 'A₃B₂ (Ca₃(PO₄)₂)'], ['2:3', 'A₂B₃']];
export const KSP_SPEC: SSpec = {
  id: 'ksp',
  finds: [['mix', 'Will a solid form? (mixing)'], ['s', 'Solubility from Ksp'], ['ksp', 'Ksp from solubility'], ['cmin', 'Ion level that starts a solid']],
  fields: [
    { k: 'type', kind: 'choice', label: 'Type of salt (cation A, anion B)', def: '1:1', options: TYPES },
    { k: 'ksp', label: 'Ksp', show: (c) => c.find !== 'ksp', ph: 'e.g. 1.8e-10' },
    { k: 'c1', label: 'Cation solution, mol/L of the cation', units: [['mol/L', 1], ['mmol/L', 1e-3]], show: (c) => c.find === 'mix', ph: 'e.g. 1e-4' },
    { k: 'v1', label: 'Its volume', units: [['mL', 1], ['L', 1000]], show: (c) => c.find === 'mix', ph: 'e.g. 10' },
    { k: 'c2', label: 'Anion solution, mol/L of the anion', units: [['mol/L', 1], ['mmol/L', 1e-3]], show: (c) => c.find === 'mix', ph: 'e.g. 1e-4' },
    { k: 'v2', label: 'Its volume', units: [['mL', 1], ['L', 1000]], show: (c) => c.find === 'mix', ph: 'e.g. 10' },
    { k: 'ci', kind: 'choice', label: 'Common ion already in the water', def: 'none', show: (c) => c.find === 's', options: [['none', 'None (pure water)'], ['cation', 'Extra cation A'], ['anion', 'Extra anion B']] },
    { k: 'cc', label: 'Its concentration', units: [['mol/L', 1], ['mmol/L', 1e-3]], show: (c) => c.find === 's' && c.ch.ci !== 'none', ph: 'e.g. 0.1' },
    { k: 's', label: 'Molar solubility s', units: [['mol/L', 1], ['mmol/L', 1e-3], ['g/L', 1]], show: (c) => c.find === 'ksp', ph: 'e.g. 1.34e-5' },
    { k: 'mm', label: 'Molar mass (only if s is in g/L)', units: [['g/mol', 1]], optional: true, show: (c) => c.find === 'ksp', ph: 'e.g. 143.5' },
    { k: 'known', kind: 'choice', label: 'Which ion do you know?', def: 'cation', show: (c) => c.find === 'cmin', options: [['cation', 'The cation A'], ['anion', 'The anion B']] },
    { k: 'cK', label: 'Its concentration', units: [['mol/L', 1], ['mmol/L', 1e-3]], show: (c) => c.find === 'cmin', ph: 'e.g. 0.01' },
  ],
  presets: [
    { name: 'AgCl: 10 mL of 1e-4 Ag⁺ + 10 mL of 1e-4 Cl⁻', find: 'mix', vals: { ksp: '1.8e-10', c1: '1e-4', v1: '10', c2: '1e-4', v2: '10' }, ch: { type: '1:1' } },
    { name: 'AgCl: same, but the chloride is 1e-6 mol/L', find: 'mix', vals: { ksp: '1.8e-10', c1: '1e-4', v1: '10', c2: '1e-6', v2: '10' }, ch: { type: '1:1' } },
    { name: 'PbI₂: 50 mL of 0.01 Pb²⁺ + 50 mL of 0.02 I⁻', find: 'mix', vals: { ksp: '7.1e-9', c1: '0.01', v1: '50', c2: '0.02', v2: '50' }, ch: { type: '1:2' } },
    { name: 'CaF₂: solubility in pure water (Ksp 3.9e-11)', find: 's', vals: { ksp: '3.9e-11' }, ch: { type: '1:2', ci: 'none' } },
    { name: 'AgCl in 0.01 mol/L chloride', find: 's', vals: { ksp: '1.8e-10', cc: '0.01' }, ch: { type: '1:1', ci: 'anion' } },
    { name: 'AgCl dissolves 1.9 mg/L (143.5 g/mol): Ksp', find: 'ksp', vals: { s: ['1.9e-3', 'g/L'], mm: '143.5' }, ch: { type: '1:1' } },
    { name: 'AgCl: Cl⁻ needed to start a solid in 0.01 mol/L Ag⁺', find: 'cmin', vals: { ksp: '1.8e-10', cK: '0.01' }, ch: { type: '1:1', known: 'cation' } },
  ],
  solve: (i, c) => ksp(i, c),
};

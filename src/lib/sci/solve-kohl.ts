// "Solve my numbers" for Kohlrausch's law page: molar conductivity Λm = 1000 κ / c, conductivity κ from Λm and c or from
// a cell constant and a measured resistance, the degree of dissociation α = Λm / Λ°m (with Ka = c α² / (1 − α)),
// Λ°m from ion values, and Λ° of a weak acid from three strong electrolytes. Plain maths, no DOM.
// Engine: src/lib/learn/solvecore-b.ts.
import { sf, type SSpec, type SIn, type SOut } from '../learn/solvecore-b.ts';

const KU: [string, number][] = [['S cm⁻¹', 1], ['S m⁻¹', 0.01], ['mS cm⁻¹', 1e-3]];
const CU: [string, number][] = [['mol/L', 1], ['mmol/L', 1e-3], ['mol/m³', 1e-3]];
const LU: [string, number][] = [['S cm² mol⁻¹', 1], ['S m² mol⁻¹', 1e4]];
const GU: [string, number][] = [['cm⁻¹', 1], ['m⁻¹', 0.01]];
const RU: [string, number][] = [['Ω', 1], ['kΩ', 1e3]];
const TIP_UNITS = 'Common mistake: units. Λm = 1000 κ ÷ c needs κ in S cm⁻¹ and c in mol/L, which gives Λm in S cm² mol⁻¹. If your book uses S m⁻¹ and mol/m³, then Λm = κ ÷ c in S m² mol⁻¹ (1 S m² mol⁻¹ = 10⁴ S cm² mol⁻¹). This page converts for you.';
const TIP_ALPHA = 'Common mistake: using this for a strong electrolyte. α = Λm ÷ Λ°m is for weak electrolytes; and Λ°m of a weak electrolyte cannot be found by extending its graph, only from Kohlrausch\'s law of independent migration.';
const bad = (x: unknown): x is SOut => typeof x === 'object' && x !== null && 'error' in x;

export function kohlSolve(i: Record<string, SIn>, c: { find: string }): SOut {
  const f = c.find;
  const conv = (x: SIn, base: string, what: string) => (x.u !== base ? [`Convert ${what}: ${sf(x.typed)} ${x.u} = ${sf(x.v, 4)} ${base}`] : []);
  const pos = (x: SIn, name: string): SOut | null => (!(x.v > 0) ? { error: `${name} must be more than 0.` } : null);
  if (f === 'lm') {
    const e = pos(i.k, 'The conductivity κ') ?? pos(i.c, 'The concentration c'); if (e) return e;
    const L = (1000 * i.k.v) / i.c.v;
    return { answer: `The molar conductivity is Λm = ${sf(L)} S cm² mol⁻¹ (= ${sf(L / 1e4)} S m² mol⁻¹).`, lines: [...conv(i.k, 'S cm⁻¹', 'κ'), ...conv(i.c, 'mol/L', 'c'), 'Formula: Λm = 1000 κ ÷ c   (κ in S cm⁻¹, c in mol/L)', `Λm = 1000 × ${sf(i.k.v)} ÷ ${sf(i.c.v)} = ${sf(L)} S cm² mol⁻¹`], tip: TIP_UNITS };
  }
  if (f === 'k') {
    const e = pos(i.L, 'The molar conductivity Λm') ?? pos(i.c, 'The concentration c'); if (e) return e;
    const k = (i.L.v * i.c.v) / 1000;
    return { answer: `The conductivity is κ = ${sf(k)} S cm⁻¹ (= ${sf(k * 100)} S m⁻¹).`, lines: [...conv(i.L, 'S cm² mol⁻¹', 'Λm'), ...conv(i.c, 'mol/L', 'c'), 'Formula: κ = Λm c ÷ 1000   (c in mol/L)', `κ = ${sf(i.L.v)} × ${sf(i.c.v)} ÷ 1000 = ${sf(k)} S cm⁻¹`], tip: TIP_UNITS };
  }
  if (f === 'cell') {
    const e = pos(i.G, 'The cell constant') ?? pos(i.R, 'The resistance R'); if (e) return e;
    const k = i.G.v / i.R.v;
    return { answer: `The conductivity is κ = ${sf(k)} S cm⁻¹ (= ${sf(k * 100)} S m⁻¹).`, lines: [...conv(i.G, 'cm⁻¹', 'the cell constant'), ...conv(i.R, 'Ω', 'R'), 'Formula: κ = G* ÷ R, where G* = l ÷ A is the cell constant', `κ = ${sf(i.G.v)} cm⁻¹ ÷ ${sf(i.R.v)} Ω = ${sf(k)} S cm⁻¹`, 'A solution of lower resistance conducts better, so κ is the cell constant divided by R.'], tip: 'Common mistake: multiplying by R instead of dividing. Conductance is 1 ÷ R, and κ = G* × (1 ÷ R). The cell constant is the same for every solution in the same cell.' };
  }
  if (f === 'alpha') {
    const e = pos(i.L, 'The molar conductivity Λm') ?? pos(i.L0, 'The limiting molar conductivity Λ°m'); if (e) return e;
    const a = i.L.v / i.L0.v;
    if (a > 1.0005) return { error: `Λm (${sf(i.L.v)}) is bigger than Λ°m (${sf(i.L0.v)}), which would make α more than 1. For a weak electrolyte Λm is always below Λ°m. Check the two numbers.` };
    const lines = [...conv(i.L, 'S cm² mol⁻¹', 'Λm'), ...conv(i.L0, 'S cm² mol⁻¹', 'Λ°m'), 'Formula: α = Λm ÷ Λ°m', `α = ${sf(i.L.v)} ÷ ${sf(i.L0.v)} = ${sf(a, 4)} (${sf(a * 100, 3)}% ionised)`];
    let ans = `The degree of dissociation is α = ${sf(a, 4)} (${sf(a * 100, 3)}% ionised).`;
    if (i.ca && !i.ca.blank) {
      if (!(i.ca.v > 0)) return { error: 'The concentration c must be more than 0.' };
      if (a >= 1) return { answer: ans + ' With α = 1 the electrolyte is fully ionised, so no Ka can be found.', lines, tip: TIP_ALPHA };
      const Ka = (i.ca.v * a * a) / (1 - a);
      lines.push(...conv(i.ca, 'mol/L', 'c'), `Ostwald's dilution law: Ka = c α² ÷ (1 − α) = ${sf(i.ca.v)} × ${sf(a, 4)}² ÷ (1 − ${sf(a, 4)}) = ${sf(Ka)}`);
      ans += ` Ka = ${sf(Ka)}.`;
    }
    return { answer: ans, lines, tip: TIP_ALPHA };
  }
  if (f === 'lam0') {
    const e = pos(i.lp, 'The cation value λ°+') ?? pos(i.lm, 'The anion value λ°−'); if (e) return e;
    const np = i.np.v, nm = i.nm.v;
    if (!Number.isInteger(np) || np < 1 || !Number.isInteger(nm) || nm < 1) return { error: 'The number of cations and anions per formula unit must be whole numbers of 1 or more (for MgCl₂ that is 1 and 2).' };
    const L = np * i.lp.v + nm * i.lm.v;
    return { answer: `Λ°m = ${sf(L)} S cm² mol⁻¹ (= ${sf(L / 1e4)} S m² mol⁻¹).`, lines: [...conv(i.lp, 'S cm² mol⁻¹', 'λ°+'), ...conv(i.lm, 'S cm² mol⁻¹', 'λ°−'), "Kohlrausch's law: Λ°m = ν₊ λ°₊ + ν₋ λ°₋", `Λ°m = ${np} × ${sf(i.lp.v)} + ${nm} × ${sf(i.lm.v)} = ${sf(L)} S cm² mol⁻¹`], tip: 'Common mistake: forgetting the numbers of ions. One formula unit of MgCl₂ gives 1 Mg²⁺ and 2 Cl⁻, so Λ°m = λ°(Mg²⁺) + 2 λ°(Cl⁻). Use the ion values at infinite dilution, not at a given concentration.' };
  }
  // weak: Λ°(HA) = Λ°(HCl) + Λ°(NaA) − Λ°(NaCl)
  const e = pos(i.a, 'Λ°m of HCl') ?? pos(i.b, 'Λ°m of the sodium salt') ?? pos(i.d, 'Λ°m of NaCl'); if (e) return e;
  const L = i.a.v + i.b.v - i.d.v;
  if (!(L > 0)) return { error: 'That gives a Λ°m of zero or less, which cannot be right. Check which value goes where (the sodium salt of the weak acid is the second one).' };
  return { answer: `Λ°m of the weak acid is ${sf(L)} S cm² mol⁻¹ (= ${sf(L / 1e4)} S m² mol⁻¹).`, lines: [...conv(i.a, 'S cm² mol⁻¹', 'Λ°(HCl)'), ...conv(i.b, 'S cm² mol⁻¹', 'Λ°(NaA)'), ...conv(i.d, 'S cm² mol⁻¹', 'Λ°(NaCl)'), 'Add the ions you want and cancel the ones you do not: HCl (H⁺ + Cl⁻) + NaA (Na⁺ + A⁻) − NaCl (Na⁺ + Cl⁻) = HA (H⁺ + A⁻)', `Λ°(HA) = ${sf(i.a.v)} + ${sf(i.b.v)} − ${sf(i.d.v)} = ${sf(L)} S cm² mol⁻¹`], tip: 'Common mistake: trying to find Λ°m of a weak acid by extending its Λm against √c graph. The graph shoots up near zero and cannot be extended; use Kohlrausch\'s law with three strong electrolytes instead.' };
}

export const KOHL_SPEC: SSpec = {
  id: 'kohl',
  finds: [['lm', 'Molar conductivity Λm from κ and c'], ['k', 'Conductivity κ from Λm and c'], ['cell', 'Conductivity κ from cell constant and R'], ['alpha', 'Degree of dissociation α (and Ka)'], ['lam0', 'Λ°m from ion values'], ['weak', 'Λ° of a weak acid from three strong ones']],
  fields: [
    { k: 'k', label: 'Conductivity κ', units: KU, ph: 'e.g. 0.0028', show: (c) => c.find === 'lm' },
    { k: 'L', label: 'Molar conductivity Λm', units: LU, ph: 'e.g. 140', show: (c) => c.find === 'k' || c.find === 'alpha' },
    { k: 'c', label: 'Concentration c', units: CU, ph: 'e.g. 0.02', show: (c) => c.find === 'lm' || c.find === 'k' },
    { k: 'ca', label: 'Concentration c (optional, for Ka)', units: CU, ph: 'e.g. 0.01', optional: true, show: (c) => c.find === 'alpha' },
    { k: 'G', label: 'Cell constant G* (= l ÷ A)', units: GU, ph: 'e.g. 0.5', show: (c) => c.find === 'cell' },
    { k: 'R', label: 'Measured resistance R', units: RU, ph: 'e.g. 250', show: (c) => c.find === 'cell' },
    { k: 'L0', label: 'Limiting molar conductivity Λ°m', units: LU, ph: 'e.g. 391', show: (c) => c.find === 'alpha' },
    { k: 'lp', label: 'Cation value λ°₊', units: LU, ph: 'e.g. 106', show: (c) => c.find === 'lam0' },
    { k: 'np', label: 'Cations per formula unit ν₊', ph: 'e.g. 1', show: (c) => c.find === 'lam0' },
    { k: 'lm', label: 'Anion value λ°₋', units: LU, ph: 'e.g. 76', show: (c) => c.find === 'lam0' },
    { k: 'nm', label: 'Anions per formula unit ν₋', ph: 'e.g. 2', show: (c) => c.find === 'lam0' },
    { k: 'a', label: 'Λ°m of HCl', units: LU, ph: 'e.g. 426', show: (c) => c.find === 'weak' },
    { k: 'b', label: 'Λ°m of the sodium salt (NaA)', units: LU, ph: 'e.g. 91', show: (c) => c.find === 'weak' },
    { k: 'd', label: 'Λ°m of NaCl', units: LU, ph: 'e.g. 126', show: (c) => c.find === 'weak' },
  ],
  presets: [
    { name: 'κ = 2.8 × 10⁻³ S cm⁻¹ at 0.02 mol/L: find Λm', find: 'lm', vals: { k: '2.8e-3', c: '0.02' } },
    { name: 'Λm = 140 at 0.01 mol/L: find κ', find: 'k', vals: { L: '140', c: '0.01' } },
    { name: 'Cell constant 0.5 cm⁻¹, resistance 250 Ω: find κ', find: 'cell', vals: { G: '0.5', R: '250' } },
    { name: 'Weak acid: Λm = 16.2, Λ°m = 391, c = 0.01', find: 'alpha', vals: { L: '16.2', L0: '391', ca: '0.01' } },
    { name: 'Λ°m of MgCl₂ from ion values (106 and 76)', find: 'lam0', vals: { lp: '106', np: '1', lm: '76', nm: '2' } },
    { name: 'Λ° of ethanoic acid from HCl, CH₃COONa and NaCl', find: 'weak', vals: { a: '426', b: '91', d: '126' } },
  ],
  solve: (i, c) => kohlSolve(i, c),
};

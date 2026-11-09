// #1084 Formula writer. Formulas checked against a hand-written list of standard school compounds; masses against
// the textbook sums with rounded masses and against published molar masses (PubChem and CRC Handbook values, 0.01 g/mol).
import * as F from '../../src/lib/sci/formulawriter.ts';
const C = (a, b) => F.crissCross(F.CATIONS.find((x) => x.id === a), F.ANIONS.find((x) => x.id === b));
const LIST = [['Na', 'Cl', 'NaCl', 'sodium chloride'], ['Mg', 'O', 'MgO', 'magnesium oxide'], ['Al', 'SO4', 'Al2(SO4)3', 'aluminium sulfate'], ['Ca', 'OH', 'Ca(OH)2', 'calcium hydroxide'],
  ['NH4', 'SO4', '(NH4)2SO4', 'ammonium sulfate'], ['Ca', 'PO4', 'Ca3(PO4)2', 'calcium phosphate'], ['Fe3', 'O', 'Fe2O3', 'iron(III) oxide'], ['Fe2', 'O', 'FeO', 'iron(II) oxide'], ['Cu2', 'NO3', 'Cu(NO3)2', 'copper(II) nitrate'],
  ['Al', 'PO4', 'AlPO4', 'aluminium phosphate'], ['Mg', 'N', 'Mg3N2', 'magnesium nitride'], ['Na', 'CO3', 'Na2CO3', 'sodium carbonate'], ['K', 'O', 'K2O', 'potassium oxide'], ['Ca', 'Cl', 'CaCl2', 'calcium chloride'], ['H', 'OH', 'H2O', 'water'], ['Zn', 'S', 'ZnS', 'zinc sulfide']];
const SCHOOL = { NaCl: 58.5, CaCO3: 100, 'Al2(SO4)3': 342, 'Ca(OH)2': 74, 'Na2CO3': 106, 'CuSO4': 159.5, H2O: 18, '(NH4)2SO4': 132, 'Ca3(PO4)2': 310 };
const PUBCHEM = { NaCl: 58.44, CaCO3: 100.09, 'Al2(SO4)3': 342.15, 'Ca(OH)2': 74.09, 'Na2CO3': 105.99, 'Fe2O3': 159.69, 'Ca3(PO4)2': 310.18 };
export default async (check) => {
  check('formula: criss-cross formulas and names match the school list', LIST.every(([a, b, f, n]) => { const c = C(a, b); return c.formula === f && c.name === n; }));
  check('formula: Mg + O is reduced from 2:2', C('Mg', 'O').reduced && C('Mg', 'O').swapped.join() === '2,2' && !C('Al', 'SO4').reduced);
  check('formula: charges always balance', F.CATIONS.every((a) => F.ANIONS.every((b) => { const c = F.crissCross(a, b); return c.x * a.v === c.y * b.v && Math.min(c.x, c.y) >= 1; })));
  check('formula: school masses', Object.entries(SCHOOL).every(([f, m]) => Math.abs(F.formulaMass(f, true).total - m) < 1e-9));
  check('formula: IUPAC masses match PubChem molar masses to 0.02', Object.entries(PUBCHEM).every(([f, m]) => Math.abs(F.formulaMass(f, false).total - m) < 0.02));
  { const r = F.formulaMass('Al2(SO4)3', true).rows.map((x) => `${x.symbol}${x.count}:${x.subtotal}`).join(); check('formula: Al2(SO4)3 rows 54 + 96 + 192', r === 'Al2:54,S3:96,O12:192'); }
  check('formula: atoms in Ca3(PO4)2 are Ca 3, P 2, O 8', [...F.atomsIn('Ca3(PO4)2')].join(';') === 'Ca,3;P,2;O,8');
  check('formula: every ion element has a school mass', F.CATIONS.concat(F.ANIONS).every((i) => [...F.atomsIn(i.f).keys()].every((s) => s in F.SCHOOL_MASS)));
};

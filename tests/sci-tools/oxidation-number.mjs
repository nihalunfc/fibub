// #1088 Oxidation number finder. Oxidation numbers checked against a hand-written list of standard textbook values;
// redox equations against standard balanced equations, and every combination checked for atom and charge balance.
import * as O from '../../src/lib/sci/oxidation.ts';
const ON = { K2Cr2O7: 'K+1 Cr+6 O−2', 'MnO4-': 'Mn+7 O−2', H2SO4: 'H+1 S+6 O−2', 'NH4+': 'N−3 H+1', Fe3O4: 'Fe+8/3 O−2', H2O2: 'H+1 O−1', NaH: 'Na+1 H−1', OF2: 'O+2 F−1', KO2: 'K+1 O−½', CH4: 'C−4 H+1', C6H12O6: 'C0 H+1 O−2', 'S2O3^2-': 'S+2 O−2', HNO3: 'H+1 N+5 O−2', CaH2: 'Ca+2 H−1', Na2O2: 'Na+1 O−1', Cl2O7: 'Cl+7 O−2', 'Fe3+': 'Fe+3', O2: 'O0', P4: 'P0', 'K4[Fe(CN)6]': 'K+1 Fe+2 C+2 N−3', 'CrO4^2-': 'Cr+6 O−2', 'S4O6^2-': 'S+5/2 O−2', NaCl: 'Na+1 Cl−1', 'Cr2O7^2-': 'Cr+6 O−2' };
const EQ = [
  [['Fe^2+', 'Fe^3+'], ['MnO4-', 'Mn^2+'], 'acid', '5Fe²⁺ + MnO₄⁻ + 8H⁺ → 5Fe³⁺ + Mn²⁺ + 4H₂O'],
  [['I-', 'I2'], ['Cr2O7^2-', 'Cr^3+'], 'acid', '6I⁻ + Cr₂O₇²⁻ + 14H⁺ → 3I₂ + 2Cr³⁺ + 7H₂O'],
  [['C2O4^2-', 'CO2'], ['MnO4-', 'Mn^2+'], 'acid', '5C₂O₄²⁻ + 2MnO₄⁻ + 16H⁺ → 10CO₂ + 2Mn²⁺ + 8H₂O'],
  [['I-', 'IO3-'], ['MnO4-', 'MnO2'], 'base', 'I⁻ + 2MnO₄⁻ + H₂O → IO₃⁻ + 2MnO₂ + 2OH⁻'],
  [['H2O2', 'O2'], ['MnO4-', 'Mn^2+'], 'acid', '5H₂O₂ + 2MnO₄⁻ + 6H⁺ → 5O₂ + 2Mn²⁺ + 8H₂O'],
  [['Zn', 'Zn^2+'], ['NO3-', 'NO'], 'acid', '3Zn + 2NO₃⁻ + 8H⁺ → 3Zn²⁺ + 2NO + 4H₂O'],
];
export default async (check) => {
  const txt = (f) => O.oxidationNumbers(f).rows.map((r) => r.symbol + O.onText(r.on).replace(/^0$/, '0')).join(' ');
  const bad = Object.entries(ON).filter(([f, w]) => txt(f) !== w);
  check('oxidation: textbook oxidation numbers (' + (bad.map(([f]) => f + '=' + txt(f)).join('; ') || 'all') + ')', bad.length === 0);
  check('oxidation: ICl and PCl5 are flagged as estimates; K2Cr2O7 is not', O.oxidationNumbers('ICl').estimated && O.oxidationNumbers('PCl5').estimated && !O.oxidationNumbers('K2Cr2O7').estimated);
  check('oxidation: Fe3O4 has an average note', O.oxidationNumbers('Fe3O4').note.includes('average'));
  check('oxidation: onText', O.onText(6) === '+6' && O.onText(-2) === '−2' && O.onText(8 / 3) === '+8/3' && O.onText(-0.5) === '−½' && O.onText(0) === '0');
  check('oxidation: pretty', O.pretty('Cr2O7^2-') === 'Cr₂O₇²⁻' && O.pretty('MnO4-') === 'MnO₄⁻' && O.pretty('Fe^3+') === 'Fe³⁺' && O.pretty('NH4+') === 'NH₄⁺' && O.pretty('e-') === 'e⁻');
  check('oxidation: standard redox equations', EQ.every(([o, r, m, want]) => { const c = O.combine(O.halfReaction(o[0], o[1], m), O.halfReaction(r[0], r[1], m)); const got = O.eqText(c.left, c.right); if (got !== want) console.log('  got', got); return got === want; }));
  { const h = O.halfReaction('MnO4-', 'Mn^2+', 'acid'); check('oxidation: MnO4- half: 5 electrons, reduction, +7 to +2', h.electrons === 5 && h.kind === 'reduction' && h.from === 7 && h.to === 2); }
  { const h = O.halfReaction('MnO4-', 'MnO2', 'base'); check('oxidation: MnO4- → MnO2 in base: MnO₄⁻ + 3e⁻ + 2H₂O → MnO₂ + 4OH⁻', O.eqText(h.left, h.right) === 'MnO₄⁻ + 3e⁻ + 2H₂O → MnO₂ + 4OH⁻'); }
  let ok = true, n = 0;
  for (const m of ['acid', 'base']) for (const a of O.COUPLES) for (const b of O.COUPLES) {
    const ha = O.halfReaction(a.from, a.to, m), hb = O.halfReaction(b.from, b.to, m);
    if (ha.kind !== 'oxidation' || hb.kind !== 'reduction') continue;
    const c = O.combine(ha, hb), L = O.tally(c.left), R = O.tally(c.right); n++;
    if (L.charge !== R.charge || L.atoms.size !== R.atoms.size || [...L.atoms].some(([e, k]) => R.atoms.get(e) !== k) || c.left.has('e-') || c.right.has('e-')) { ok = false; console.log('  unbalanced', a.id, b.id, m); }
    // electrons lost = gained, from oxidation numbers
    const lost = (ha.to - ha.from) * (ha.left.get(a.from) ?? 0) * (O.readFormula(a.from).counts.get(ha.key) ?? 1), gained = (hb.from - hb.to) * (hb.left.get(b.from) ?? 0) * (O.readFormula(b.from).counts.get(hb.key) ?? 1);
    if (Math.abs(lost - ha.electrons) > 1e-9 || Math.abs(gained - hb.electrons) > 1e-9) { ok = false; console.log('  electron count differs from oxidation numbers', a.id, b.id); }
  }
  check(`oxidation: every pair of couples balances atoms and charge, electrons match oxidation numbers (${n} equations)`, ok && n > 40);
};

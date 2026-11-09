// #1086 Reactivity series lab. Displacement outcomes checked against the school series order written out by hand
// (K Na Ca Mg Al Zn Fe Pb H Cu Hg Ag Au); equations against hand-balanced ones.
import * as R from '../../src/lib/sci/reactivity.ts';
const ORDER = 'K Na Ca Mg Al Zn Fe Pb H Cu Hg Ag Au'.split(' ');
export default async (check) => {
  check('reactivity: series order', R.SERIES.map((m) => m.sym).join(' ') === ORDER.join(' '));
  let ok = true;
  for (const m of R.STRIPS) for (const s of R.SOLUTIONS) {
    const r = R.test(m, s.id), expect = ORDER.indexOf(m) > 2 && ORDER.indexOf(m) < ORDER.indexOf(s.metal);
    if (r.reacts !== expect || r.waterFirst !== (ORDER.indexOf(m) <= 2)) { ok = false; console.log('reactivity mismatch', m, s.id); }
  }
  check('reactivity: every metal × solution matches the series (88 pairs)', ok);
  const EQ = { 'Fe|CuSO4': 'Fe + CuSO4 → FeSO4 + Cu', 'Al|CuSO4': '2Al + 3CuSO4 → Al2(SO4)3 + 3Cu', 'Cu|AgNO3': 'Cu + 2AgNO3 → Cu(NO3)2 + 2Ag', 'Zn|HCl': 'Zn + 2HCl → ZnCl2 + H2', 'Al|HCl': '2Al + 6HCl → 2AlCl3 + 3H2', 'Mg|Al2(SO4)3': '3Mg + Al2(SO4)3 → 3MgSO4 + 2Al', 'Zn|Pb(NO3)2': 'Zn + Pb(NO3)2 → Zn(NO3)2 + Pb', 'Mg|AgNO3': 'Mg + 2AgNO3 → Mg(NO3)2 + 2Ag' };
  check('reactivity: balanced equations', Object.entries(EQ).every(([k, e]) => { const [m, s] = k.split('|'); return R.test(m, s).equation === e; }));
  { const r = R.test('Fe', 'CuSO4'); check('reactivity: iron in copper sulfate: blue to pale green, copper coat', r.after.colourName === 'pale green' && r.seen.join().includes('copper forms on the iron')); }
  { const r = R.test('Cu', 'AgNO3'); check('reactivity: copper in silver nitrate turns blue', r.after.colourName === 'blue'); }
  check('reactivity: copper in acid: no hydrogen; same metal: nothing', !R.test('Cu', 'HCl').reacts && !R.test('Zn', 'ZnSO4').reacts && R.test('Zn', 'ZnSO4').seen[0].includes('itself'));
  check('reactivity: salts', R.salt('Al', 3, 'SO4') === 'Al2(SO4)3' && R.salt('Fe', 2, 'Cl') === 'FeCl2' && R.salt('Ag', 1, 'NO3') === 'AgNO3' && R.salt('Al', 3, 'Cl') === 'AlCl3');
  check('reactivity: extraction by position', R.SERIES.filter((m) => m.ext === 'electrolysis').map((m) => m.sym).join() === 'K,Na,Ca,Mg,Al' && R.METAL('Zn').ext === 'carbon' && R.METAL('Fe').ext === 'carbon' && R.METAL('Cu').ext === 'heat' && R.METAL('Au').ext === 'native');
  { const s = R.seriesFrom([{ metal: 'Zn', solMetal: 'Cu', reacts: true }, { metal: 'Cu', solMetal: 'Ag', reacts: true }, { metal: 'Cu', solMetal: 'Zn', reacts: false }]);
    check('reactivity: series from results uses transitivity (Zn > Cu > Ag)', s.map((x) => x.sym).join() === 'Zn,Cu,Ag' && s[0].wins === 2); }
  { const s = R.seriesFrom([{ metal: 'Zn', solMetal: 'Mg', reacts: false }, { metal: 'Zn', solMetal: 'Cu', reacts: true }]); check('reactivity: a failed test puts the salt metal above (Mg > Zn > Cu)', s.map((x) => x.sym).join() === 'Mg,Zn,Cu'); }
  let bad = 0; try { R.test('H', 'CuSO4'); } catch { bad++; } try { R.test('Fe', 'XYZ'); } catch { bad++; } check('reactivity: bad picks refused', bad === 2);
};

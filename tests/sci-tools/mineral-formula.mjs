// #872 mineral formula: cations on an oxygen basis checked against pyrolite (recalc_cations, oxygen-constrained,
// its own periodictable masses: agreement to 1e-6) and an independent NumPy script (same masses: 1e-14), Droop's
// Fe³⁺ against the NumPy script and against stoichiometric aegirine and magnetite, end-members against NumPy.
import { formula, readAnalyses, oxideKey, molarMass, BY_KEY, EXAMPLES, PRESETS } from '../../src/lib/sci/mineral.ts';
import { parseTable, num } from '../../src/lib/sci/num.ts';

export default async (check) => {
  const near = (a, b, tol) => Math.abs(a - b) <= tol;
  const ex = (id) => readAnalyses(parseTable(EXAMPLES[id]), num);
  const P = Object.fromEntries(PRESETS.map((p) => [p.id, p]));
  // Pyroxene Cpx-1, 6 O, Droop with 4 cations.
  const cpx = ex('pyroxene').wt[0], r = formula(cpx, 6, { fe: 'droop', T: 4, mineral: 'pyroxene' });
  const want = { Si: 1.8971415839, Ti: 0.0166279564, Al: 0.1389280729, Cr: 0.0145623668, Fe3: 0.0546812778, Fe2: 0.1301625144, Mn: 0.0046801801, Mg: 0.8786500868, Ca: 0.8288551624, Na: 0.0357107983 };
  check('mineral: Cpx-1 cations after Droop match numpy', Object.entries(want).every(([k, v]) => near(r.apfu[k], v, 1e-9)) && near(r.sumCat, 4, 1e-12) && near(r.charge, 12, 1e-12) && near(r.sumO, 6, 1e-12));
  // pyrolite recalc_cations(oxygen_constrained=True, ideal_oxygens=6), all Fe as FeO.
  const r0 = formula(cpx, 6, { fe: 'fe2', mineral: 'pyroxene' });
  const py = { Si: 1.905825, Ti: 0.016704, Al: 0.139565, Cr: 0.014629, Fe2: 0.18569, Mn: 0.004702, Mg: 0.882672, Ca: 0.832649, Na: 0.035875 };
  check('mineral: Cpx-1 on 6 oxygens matches pyrolite', Object.entries(py).every(([k, v]) => near(r0.apfu[k], v, 2e-6)) && near(r0.sumCat, 4.01831, 1e-5));
  check('mineral: Cpx-1 Wo-En-Fs matches numpy', near(r.endMembers[0].value, 43.692271736, 1e-7) && near(r.endMembers[1].value, 46.317161423, 1e-7) && near(r.endMembers[2].value, 9.990566841, 1e-7));
  check('mineral: recalculated FeO and Fe2O3 wt%', near(r.feO, 4.2250544471, 1e-8) && near(r.fe2o3, 1.9725776022, 1e-8) && near(r.totalAfter, 99.45 - 6 + r.feO + r.fe2o3, 1e-9));
  check('mineral: Droop F for every example pyroxene (numpy)', (() => { const a = ex('pyroxene').wt.map((w) => formula(w, 6, { fe: 'droop', T: 4 }).fe3); return near(a[1], 0.0235, 1e-4) && near(a[2], 0.0319, 1e-4); })());
  // Stoichiometric truths.
  const M = (k) => molarMass(BY_KEY.get(k));
  { const tot = M('Na2O') / 2 + M('FeO') + 2 * M('SiO2'), w = { Na2O: (100 * M('Na2O')) / 2 / tot, FeO: (100 * M('FeO')) / tot, SiO2: (100 * 2 * M('SiO2')) / tot };
    // aegirine NaFe³⁺Si2O6 written with all iron as FeO: Droop must give Fe³⁺ = 1.
    const a = formula(w, 6, { fe: 'droop', T: 4, mineral: 'pyroxene' }); check('mineral: aegirine gives Fe³⁺ = 1.000, Fe²⁺ = 0', near(a.fe3, 1, 1e-12) && near(a.fe2, 0, 1e-12) && near(a.apfu.Na, 1, 1e-12) && near(a.apfu.Si, 2, 1e-12)); }
  { const w = { FeO: (100 * 3 * M('FeO')) / (3 * M('FeO')) };
    const m = formula(w, 4, { fe: 'droop', T: 3, mineral: 'spinel' }); check('mineral: magnetite gives Fe³⁺ 2, Fe²⁺ 1', near(m.fe3, 2, 1e-12) && near(m.fe2, 1, 1e-12)); }
  { const w = { MgO: 100 * (2 * M('MgO')) / (2 * M('MgO') + M('SiO2')), SiO2: (100 * M('SiO2')) / (2 * M('MgO') + M('SiO2')) };
    const f = formula(w, 4, { fe: 'fe2', mineral: 'olivine' }); check('mineral: forsterite Mg2SiO4 exact', near(f.apfu.Mg, 2, 1e-12) && near(f.apfu.Si, 1, 1e-12) && near(f.endMembers[0].value, 100, 1e-12)); }
  // Other minerals against numpy.
  check('mineral: olivine Fo matches numpy', near(formula(ex('olivine').wt[0], 4, { fe: 'fe2', mineral: 'olivine' }).endMembers[0].value, 88.46923211627, 1e-9));
  check('mineral: plagioclase An matches numpy', near(formula(ex('feldspar').wt[0], 8, { fe: 'fe2', mineral: 'feldspar' }).endMembers[0].value, 50.89981507793, 1e-9));
  { const g = formula(ex('garnet').wt[0], 12, { fe: 'droop', T: 8, mineral: 'garnet' }); check('mineral: garnet (no Fe³⁺ needed: S < T) Alm matches numpy', g.droopF < 0 && g.fe3 === 0 && near(g.sumCat, 7.96583670827, 1e-9) && near(g.endMembers[0].value, 67.376965878, 1e-8)); }
  { const s = formula(ex('spinel').wt[0], 4, { fe: 'droop', T: 3, mineral: 'spinel' }); check('mineral: spinel Cr# and Fe³⁺', near(s.endMembers[0].value, 31.1683534471, 1e-8) && near(s.fe3, 0.0591511683, 1e-9)); }
  { const pl = formula(ex('feldspar').wt[0], 8, { fe: 'droop', T: 5 }); check('mineral: Droop capped when there is too little iron', pl.capped && near(pl.fe2, 0, 1e-15)); }
  // Analysed Fe2O3 used as given.
  { const a = formula({ SiO2: 50, Fe2O3: 10, FeO: 5 }, 6, { fe: 'analysed' }), b = formula({ SiO2: 50, Fe2O3: 10, FeO: 5 }, 6, { fe: 'fe2' });
    check('mineral: Fe2O3 as analysed vs all Fe²⁺', a.fe3 > 0 && b.fe3 === 0 && a.fe2 > 0 && near(b.total, 65, 1e-12)); }
  // Readers.
  check('mineral: oxide names and total-iron aliases', oxideKey('feo*').key === 'FeO' && oxideKey('FeOt').total && oxideKey('Fe2O3T').key === 'Fe2O3' && oxideKey('al2o3').key === 'Al2O3' && oxideKey('Total') === null);
  { const t = readAnalyses(parseTable('Oxide\tA\tB\nSiO2\t50\t51\nMgO\t20\t21\nTotal\t70\t72'), num); check('mineral: oxides down the first column (transposed)', t.wt.length === 2 && t.wt[1].MgO === 21 && t.names.join() === 'A,B' && t.ignored.includes('Total')); }
  { const t = readAnalyses(parseTable('SiO2,MgO,FeOt\n40,48,n.d.\n41,47,<0.01'), num); check('mineral: n.d. and below-detection read as 0, names made up', t.wt[0].FeO === 0 && t.wt[1].FeO === 0 && t.names[0] === 'Analysis 1' && t.feTotal[0] === 'FeOt'); }
  let msg = ''; try { readAnalyses(parseTable('Name,SiO2,MgO\nA,40,x'), num); } catch (e) { msg = e.message; }
  check('mineral: bad value message', msg.includes('"x" under MgO'));
  check('mineral: presets', P.pyroxene.O === 6 && P.pyroxene.cat === 4 && P.garnet.O === 12 && P.garnet.cat === 8 && P.amphibole.O === 23 && P.olivine.O === 4);
};

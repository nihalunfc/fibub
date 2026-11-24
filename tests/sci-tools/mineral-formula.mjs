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

  // New with src/blog/discoveries/guinadji-websterite-pyroxene-end-members-mg-number.md: three stoichiometric
  // analyses written by fibub to the mid-range end-members of Kagarabi et al. (2025), Mineralogia 56 (CC BY),
  // for the Guinadji websterite. Not the paper's microprobe data.
  {
    const near2 = (a, b, tol) => Math.abs(a - b) <= tol;
    const di = { SiO2: 52.48, TiO2: 0.72, Al2O3: 2.54, Cr2O3: 0.34, FeO: 5.33, MnO: 0.32, MgO: 15.50, CaO: 22.49, Na2O: 0.28 };
    const en = { SiO2: 54.61, TiO2: 0.37, Al2O3: 1.42, Cr2O3: 0.18, FeO: 14.17, MnO: 0.40, MgO: 28.09, CaO: 0.77 };
    const pl = { SiO2: 53.02, Al2O3: 29.99, CaO: 12.35, Na2O: 4.44, K2O: 0.19 };
    const fd = formula(di, 6, { fe: 'droop', T: 4, mineral: 'pyroxene' });
    const fe = formula(en, 6, { fe: 'droop', T: 4, mineral: 'pyroxene' });
    const fp = formula(pl, 8, { fe: 'fe2', T: 5, mineral: 'feldspar' });
    const em = (f) => Object.fromEntries(f.endMembers.map((e) => [e.name, e.value]));
    check(`mineral: Guinadji diopside gives 4.000 cations on 6 O with no Fe³⁺ (${fd.sumCat.toFixed(4)})`, near2(fd.sumCat, 4, 5e-4) && near2(fd.fe3, 0, 1e-12) && near2(fd.sumO, 6, 1e-9));
    check(`mineral: Guinadji diopside gives Wo 46.4 En 44.5 Fs 9.1 and Mg# 83.83 (${fd.mgNum.toFixed(2)})`, near2(em(fd).Wo, 46.40, 0.05) && near2(em(fd).En, 44.49, 0.05) && near2(em(fd).Fs, 9.11, 0.05) && near2(fd.mgNum, 83.83, 0.01));
    check(`mineral: Guinadji enstatite gives Wo 1.5 En 76.3 Fs 22.2 and Mg# 77.94 (${fe.mgNum.toFixed(2)})`, near2(fe.sumCat, 4, 5e-4) && near2(fe.fe3, 0, 1e-4) && near2(em(fe).Wo, 1.50, 0.05) && near2(em(fe).En, 76.29, 0.05) && near2(em(fe).Fs, 22.21, 0.05) && near2(fe.mgNum, 77.94, 0.01));
    check(`mineral: Guinadji labradorite gives 5.000 cations on 8 O and An 59.9 (${em(fp).An.toFixed(2)})`, near2(fp.sumCat, 5, 5e-4) && near2(fp.charge, 16, 0.01) && near2(em(fp).An, 59.92, 0.05) && near2(em(fp).Or, 1.10, 0.05));
    // Both pyroxenes' En/(En + Fs) sits at the bottom of the paper's Mg# range, as it must when Fe³⁺ is near zero.
    check('mineral: En/(En + Fs) is 83.0 and 77.6, just below the paper\'s Mg# ranges', near2((100 * em(fd).En) / (em(fd).En + em(fd).Fs), 83.0, 0.2) && near2((100 * em(fe).En) / (em(fe).En + em(fe).Fs), 77.5, 0.2));
    // The ferric-iron trap: one wt% less SiO2 and nothing else changed.
    const bad = formula({ ...di, SiO2: 51.50 }, 6, { fe: 'droop', T: 4, mineral: 'pyroxene' });
    const badFe2 = formula({ ...di, SiO2: 51.50 }, 6, { fe: 'fe2', T: 4, mineral: 'pyroxene' });
    check(`mineral: 1 wt% less SiO2 makes charge balance call 21.9 % of the iron ferric (${(100 * bad.fe3 / (bad.fe3 + bad.fe2)).toFixed(1)} %)`, near2((100 * bad.fe3) / (bad.fe3 + bad.fe2), 21.9, 0.1) && near2(badFe2.sumCat, 4.0121, 5e-4));
    check(`mineral: that raises Mg# to 86.91 while Fs stays at 9.11 (${bad.mgNum.toFixed(2)}, ${em(bad).Fs.toFixed(2)})`, near2(bad.mgNum, 86.91, 0.01) && near2(em(bad).Fs, 9.11, 0.02) && near2(badFe2.mgNum, 83.83, 0.01));
  }
};

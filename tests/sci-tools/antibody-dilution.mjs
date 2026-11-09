// #200 Antibody dilution and titre calculator. The endpoint titres (highest dilution above the cutoff, interpolated
// on log10 dilution) were checked against an independent NumPy script (np.interp on log dilution, ddof=1 SD) on the
// made-up example with four cutoffs and on five random ELISA-style series; the serial dilution factors against a
// mass-balance simulation in the same script; the working-dilution and amount sums against hand working.
import { working, serial, cutoff, titre, readSeries, readDil, needed, factorFor, fmtUl, fmtConc, EXAMPLE_SERIES, EXAMPLE_BLANKS } from '../../src/lib/sci/antibody.ts';

const RAND = [{"d":[100.0,400.0,1600.0,6400.0,25600.0,102400.0,409600.0,1638400.0,6553600.0],"ods":[[2.757],[2.675],[2.196],[1.096],[0.382],[0.137],[0.07],[0.055],[0.05]],"cut":0.24145544286654508,"ep":["ok",25600.0,56703.83525392166,4.753612434083116]},{"d":[100.0,400.0,1600.0,6400.0,25600.0,102400.0],"ods":[[2.916,2.866],[2.94,2.849],[2.484,2.475],[1.026,0.954],[0.209,0.212],[0.07,0.067]],"cut":0.15920477504874586,"ep":["ok",25600.0,42240.05658341117,4.625724491292962]},{"d":[100.0,200.0,400.0,800.0,1600.0,3200.0,6400.0,12800.0,25600.0],"ods":[[1.794,1.844,1.765],[1.747,1.759,1.757],[1.61,1.675,1.74],[1.455,1.565,1.531],[1.271,1.373,1.325],[0.957,0.995,1.01],[0.675,0.693,0.677],[0.431,0.441,0.414],[0.255,0.25,0.254]],"cut":0.22090030950022,"ep":["above",25600.0]},{"d":[100.0,300.0,900.0,2700.0,8100.0,24300.0],"ods":[[2.031],[1.813],[0.94],[0.197],[0.069],[0.052]],"cut":0.35042378267985697,"ep":["ok",900.0,2151.99816397129,3.332841896465784]},{"d":[100.0,1000.0,10000.0,100000.0,1000000.0,10000000.0,100000000.0],"ods":[[2.769,2.779],[2.196,2.165],[0.717,0.697],[0.14,0.138],[0.062,0.061],[0.051,0.052],[0.05,0.052]],"cut":0.32042397435357695,"ep":["ok",10000.0,47928.25248562162,4.680591594447928]}];

export default async (check) => {
  const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  const thrown = (f) => { try { f(); return ''; } catch (e) { return e.message; } };
  // Working dilutions by hand: 0.8 mg/mL at 1:2000 in 10 mL is 5 µL + 9995 µL, 0.4 µg/mL, 4 µg.
  const w = working({ mode: 'ratio', ratio: 2000, finalUl: 10000, stockMgMl: 0.8 });
  check('antibody: 1:2000 in 10 mL is 5 µL stock + 9995 µL, 0.4 µg/mL', near(w.stockUl, 5) && near(w.diluentUl, 9995) && near(w.ugMl, 0.4) && near(w.ug, 4) && !w.inter && !w.warn.length);
  const w2 = working({ mode: 'conc', targetUgMl: 0.5, finalUl: 5000, stockMgMl: 2 });
  check('antibody: 2 mg/mL to 0.5 µg/mL in 5 mL is 1:4000, 1.25 µL', near(w2.factor, 4000) && near(w2.stockUl, 1.25) && near(w2.diluentUl, 4998.75) && near(factorFor(2, 0.5), 4000));
  const w3 = working({ mode: 'ratio', ratio: 5000, finalUl: 1000 });
  check('antibody: 1:5000 in 1 mL suggests a 1:10 intermediate (2 µL in 20 µL, then 2 µL of it)', near(w3.stockUl, 0.2) && Number.isNaN(w3.ugMl) && w3.inter && w3.inter.factor === 10 && near(w3.inter.useUl, 2) && near(w3.inter.diluentUl, 998) && near(w3.inter.totalUl, 20) && /too little/.test(w3.warn[0]));
  const w4 = working({ mode: 'ratio', ratio: 50000, finalUl: 1000 });
  check('antibody: 1:50000 in 1 mL suggests a 1:100 intermediate', w4.inter && w4.inter.factor === 100 && near(w4.inter.useUl, 2));
  check('antibody: working errors', /stronger than the stock/.test(thrown(() => working({ mode: 'conc', targetUgMl: 5000, finalUl: 10, stockMgMl: 1 }))) && /stock concentration/.test(thrown(() => working({ mode: 'conc', targetUgMl: 1, finalUl: 10 }))) && /final volume/.test(thrown(() => working({ mode: 'ratio', ratio: 10, finalUl: 0 }))) && /N of 1 or more/.test(thrown(() => working({ mode: 'ratio', ratio: 0.5, finalUl: 10 }))));
  // Serial dilutions against the NumPy mass-balance simulation.
  const s2 = serial({ start: 100, fold: 2, tubes: 8, volUl: 100, stockMgMl: 1 });
  check('antibody: 2-fold from 1:100, 100 µL: 2 µL stock + 198 µL, transfer 100 µL, 1:12800 last', near(s2.transferUl, 100) && near(s2.rows[0].fromUl, 2) && near(s2.rows[0].diluentUl, 198) && near(s2.rows[7].factor, 12800) && near(s2.rows[7].ugMl, 1000 / 12800) && s2.rows[3].from === 'tube 3' && !s2.warn.length);
  const s3 = serial({ start: 100, fold: 3, tubes: 8, volUl: 100 });
  check('antibody: 3-fold: transfer 50 µL, tube 1 is 1.5 µL + 148.5 µL, 1:218700 last', near(s3.transferUl, 50) && near(s3.rows[0].fromUl, 1.5) && near(s3.rows[0].diluentUl, 148.5) && near(s3.rows[7].factor, 218700) && Number.isNaN(s3.rows[0].ugMl));
  const s15 = serial({ start: 100, fold: 1.5, tubes: 8, volUl: 100 }), s10 = serial({ start: 100, fold: 10, tubes: 8, volUl: 100 });
  check('antibody: 1.5-fold and 10-fold match the mass balance', near(s15.transferUl, 200) && near(s15.rows[0].fromUl, 3) && near(s15.rows[7].factor, 1708.59375) && near(s10.transferUl, 100 / 9) && near(s10.rows[0].fromUl, 10 / 9) && near(s10.rows[7].factor, 1e9));
  check('antibody: serial warnings and errors', serial({ start: 1000, fold: 2, tubes: 4, volUl: 50 }).warn.some((x) => /intermediate/.test(x)) && serial({ start: 10, fold: 1000, tubes: 3, volUl: 100 }).warn.some((x) => /Each transfer/.test(x)) && /more than 1-fold/.test(thrown(() => serial({ start: 10, fold: 1, tubes: 3, volUl: 10 }))) && /between 2 and 48/.test(thrown(() => serial({ start: 10, fold: 2, tubes: 1, volUl: 10 }))));
  // Cutoffs and the example titre against NumPy.
  const ex = readSeries(EXAMPLE_SERIES), blanks = EXAMPLE_BLANKS.split(' ').map(Number);
  const c3 = cutoff(blanks, { kind: 'sd', k: 3 });
  check('antibody: example blanks: mean 0.05333, SD 0.005785, cutoff 0.07069 (NumPy)', ex.length === 8 && ex[0].ods.length === 2 && near(c3.mean, 0.05333333333333334) && near(c3.sd, 0.005785038173311103) && near(c3.value, 0.07068844785326664) && c3.n === 6);
  const t3 = titre(ex, c3.value);
  check('antibody: example titre 1:68,382 (log 4.8349), last above 1:24300 (NumPy)', t3.status === 'ok' && t3.last === 24300 && near(t3.titre, 68381.59534125336) && near(t3.log10, 4.834939228660356) && !t3.warn.length && near(t3.points[0].mean, 2.384));
  const c2 = cutoff(blanks, { kind: 'times', k: 2 });
  check('antibody: 2 × blank mean: titre 41,850 (NumPy)', near(c2.value, 0.10666666666666667) && near(titre(ex, c2.value).titre, 41850.17990246335));
  check('antibody: fixed OD 0.1 and 0.5: 45,836 and 7,895 (NumPy)', near(titre(ex, cutoff([], { kind: 'fixed', od: 0.1 }).value).titre, 45836.3974576605) && titre(ex, 0.5).last === 2700 && near(titre(ex, 0.5).titre, 7895.070171851442));
  RAND.forEach((r, i) => {
    const t = titre(r.d.map((d, j) => ({ dil: d, ods: r.ods[j] })), r.cut);
    check(`antibody: random series ${i + 1} (${r.d.length} dilutions, ${r.ods[0].length} replicates) matches NumPy`, r.ep[0] === 'ok' ? t.status === 'ok' && t.last === r.ep[1] && near(t.titre, r.ep[2], 1e-9) : t.status === 'above' && t.last === r.ep[1] && Number.isNaN(t.titre));
  });
  check('antibody: none above the cutoff, unsorted input', titre(ex, 3).status === 'below' && near(titre([...ex].reverse(), c3.value).titre, t3.titre));
  check('antibody: titre warnings (dip and rise) and errors', titre([{ dil: 100, ods: [1] }, { dil: 200, ods: [0.05] }, { dil: 400, ods: [0.5] }, { dil: 800, ods: [0.04] }], 0.1).warn.length === 2 && /listed twice/.test(thrown(() => titre([{ dil: 100, ods: [1] }, { dil: 100, ods: [2] }], 0.1))) && /at least two dilutions/.test(thrown(() => titre([{ dil: 100, ods: [1] }], 0.1))) && /two blank/.test(thrown(() => cutoff([0.05], { kind: 'sd', k: 3 }))));
  check('antibody: reading dilutions', readDil('1:100') === 100 && readDil('1/250') === 250 && readDil('1e3') === 1000 && readDil(' 400 ') === 400 && Number.isNaN(readDil('blank')) && readSeries('dilution,OD\n1:100,1.2,1.1\n\n200;0.6').length === 2);
  // Antibody needed: 6 blots × 10 mL at 1:2000 with 10 % spare = 66 mL, 33 µL of stock, 26.4 µg at 0.8 mg/mL; a 100 µL vial covers 18.
  const n = needed({ units: 6, perUnitUl: 10000, factor: 2000, sparePct: 10, stockMgMl: 0.8, vialUl: 100 });
  check('antibody: 6 blots: 66 mL, 33 µL stock, 26.4 µg, vial covers 18', near(n.workingUl, 66000) && near(n.stockUl, 33) && near(n.ug, 26.4) && n.unitsPerVial === 18 && near(n.vialLeftUl, 67) && n.enough);
  const p = needed({ units: 4, perUnitUl: 96 * 100, factor: 1000, sparePct: 0, vialUl: 20 });
  check('antibody: 4 plates of 96 × 100 µL at 1:1000: 38.4 µL, vial of 20 µL is short', near(p.stockUl, 38.4) && Number.isNaN(p.ug) && p.unitsPerVial === 2 && !p.enough);
  check('antibody: friendly numbers', fmtUl(0.25) === '0.25 µL' && fmtUl(9995) === '9.995 mL' && fmtUl(148.5) === '148.5 µL' && fmtUl(2) === '2 µL' && fmtConc(0.4) === '400 ng/mL' && fmtConc(2.5) === '2.5 µg/mL' && fmtConc(1000) === '1 mg/mL');
};

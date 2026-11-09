// #181 protein assay standard curve. Reference values from NumPy (numpy.polyfit, numpy.roots, numpy.interp,
// numpy.std with ddof=1) on the page's made-up example, plus exact curves worked by hand.
import { parseStandards, parseUnknowns, assay, fitCurve, polyfit, volumeFor, dilution, meanSd, blankOf, EXAMPLE_STANDARDS, EXAMPLE_SAMPLES } from '../../src/lib/sci/protassay.ts';

export default async (check) => {
  const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  const S = parseStandards(EXAMPLE_STANDARDS), U = parseUnknowns(EXAMPLE_SAMPLES);
  check('protein assay: example parses (8 standards, 4 samples, header lines skipped)', S.rows.length === 8 && U.rows.length === 4 && !S.errors.length && !U.errors.length && U.rows[0].dil === 10);
  const o = { blank: 'zero', amount: 20, finalVol: 25 };
  const L = assay(S.rows, U.rows, { ...o, fit: 'linear' }), Q = assay(S.rows, U.rows, { ...o, fit: 'quadratic' }), P = assay(S.rows, U.rows, { ...o, fit: 'p2p' });
  check('protein assay: blank = mean of the 0 standard (NumPy 0.451667)', near(L.blank, 0.45166666666666666));
  check('protein assay: straight line matches numpy.polyfit (a 0.0599504, b 0.000534163, R² 0.982638)', near(L.curve.coef[0], 0.059950424590360075) && near(L.curve.coef[1], 0.0005341633775864131) && near(L.curve.r2, 0.9826380089761035));
  check('protein assay: quadratic matches numpy.polyfit (R² 0.999559)', near(Q.curve.coef[0], 0.0041625449751601165, 1e-8) && near(Q.curve.coef[1], 0.0007699985103470649) && near(Q.curve.coef[2], -1.219780298608943e-07) && near(Q.curve.r2, 0.9995590303006123));
  const want = {
    linear: [[666.5555714778307, 121.80556308533407, 3.000500011673099], [1437.8551724755605, 1398.7609456096359], [2133.02325945895, 19.723654213168945]],
    quadratic: [[589.9982208141804, 103.91023930026482, 3.3898407307738285], [1365.1418896082912, 1844.983426133044], [2751.351487141688, 108.89425097650867], [31.98566619282492, 24.7522740635399, 625.2800826292133]],
    p2p: [[586.8131868131867, 107.24846865902842, 3.4082397003745326], [1394.578313253012, 1841.6316098615487], [2371.1985688729874, 28.27098502554415], [36.440677966101674, 23.928487972026257, 548.8372093023258]],
  };
  for (const [k, r] of [['linear', L], ['quadratic', Q], ['p2p', P]]) {
    const ok = want[k].every((w, i) => near(r.unks[i].inAssay, w[0], 1e-7) && near(r.unks[i].concSd, w[1], 1e-6) && (w[2] === undefined || near(r.unks[i].volume, w[2], 1e-7)));
    check(`protein assay: ${k} unknowns, SD of replicate concentrations and 20 µg volumes match NumPy`, ok);
  }
  check('protein assay: replicate mean, SD and CV match numpy (tissue extract CV 11.6775 %)', near(Q.unks[1].mean, 1.2796666666666667) && near(Q.unks[1].sd, 0.14943337422856157) && near(Q.unks[1].cv, 11.677523383320779));
  check('protein assay: sample concentration = curve × dilution (cell lysate 5900.0 µg/mL)', near(Q.unks[0].conc, 5899.982208141804, 1e-7));
  check('protein assay: standards read back (quadratic 100 → 98.29, 2000 → 2016.97; point to point exact)', near(Q.stds[1].back, 98.28918044822655, 1e-7) && near(Q.stds[7].back, 2016.9724287562528, 1e-7) && P.stds.slice(1).every((s) => near(s.recovery, 100, 1e-9)));
  check('protein assay: flags (lysate ok, extract CV, purified above, wash below)', Q.unks.map((u) => u.flags.join('+')).join(',') === 'ok,cv,above,below');
  check('protein assay: a straight line that reads below zero is flagged, with no concentration', L.unks[3].flags[0] === 'blank' && Number.isNaN(L.unks[3].conc));
  check('protein assay: buffer to a final volume (25 − 3.39 = 21.61 µL)', near(Q.unks[0].buffer, 25 - 3.3898407307738285, 1e-7) && Q.unks[3].buffer < 0);
  // Exact curves worked by hand.
  const xs = [0, 0, 200, 200, 600, 1000], line = fitCurve(xs, xs.map((x) => 0.05 + 0.001 * x), 'linear');
  check('protein assay: exact line y = 0.05 + 0.001x: 0.55 reads 500, R² 1', near(line.inverse(0.55).x, 500) && near(line.r2, 1));
  const quad = fitCurve(xs, xs.map((x) => 0.8e-3 * x - 2e-7 * x * x), 'quadratic');
  // 0.8e-3 x − 2e-7 x² = 0.3 → x² − 4000 x + 1.5e6 = 0 → x = 2000 − √2.5e6 = 418.861...
  check('protein assay: exact quadratic, rising root by hand (0.3 → 418.861)', near(quad.inverse(0.3).x, 2000 - Math.sqrt(2.5e6), 1e-8) && near(quad.peak.x, 2000, 1e-8) && near(quad.peak.y, 0.8, 1e-8));
  check('protein assay: quadratic past its top reads nothing', quad.inverse(0.85).top && Number.isNaN(quad.inverse(0.85).x));
  const p2 = fitCurve([0, 100, 300], [0, 0.2, 0.5], 'p2p');
  check('protein assay: point to point by hand (0.35 → 200, 0.1 → 50, 0.65 → 400 extrapolated)', near(p2.inverse(0.35).x, 200) && near(p2.inverse(0.1).x, 50) && near(p2.inverse(0.65).x, 400) && near(p2.predict(200), 0.35));
  check('protein assay: polyfit of exact cubic data, degree 2 on a parabola', polyfit([1, 2, 3, 4], [6, 11, 18, 27], 2).every((c, i) => near(c, [3, 2, 1][i], 1e-9)));
  check('protein assay: loading volume (20 µg at 2 mg/mL = 10 µL; at 500 µg/mL = 40 µL)', near(volumeFor(20, 2, 'mg/mL'), 10) && near(volumeFor(20, 500, 'ug/mL'), 40) && Number.isNaN(volumeFor(20, 0)));
  check('protein assay: dilution as 5, 1:5 or 1/5', dilution('5') === 5 && dilution('1:5') === 5 && dilution('1/5') === 5 && Number.isNaN(dilution('x')));
  check('protein assay: mean / SD / CV of 2, 4, 6 (4, 2, 50 %)', (() => { const m = meanSd([2, 4, 6]); return m.mean === 4 && m.sd === 2 && m.cv === 50; })());
  check('protein assay: blank options', blankOf(S.rows, 'value', 0.4) === 0.4 && blankOf(S.rows, 'none') === 0);
  // Bad input.
  const thr = (f) => { try { f(); return ''; } catch (e) { return e.message; } };
  check('protein assay: no 0 standard for the blank', thr(() => blankOf([{ conc: 100, reps: [0.5] }], 'zero')).includes('no 0 standard'));
  check('protein assay: quadratic needs 3 concentrations', thr(() => fitCurve([0, 100], [0, 0.1], 'quadratic')).includes('3 or more'));
  check('protein assay: point to point needs rising readings', thr(() => fitCurve([0, 100, 200], [0, 0.3, 0.2], 'p2p')).includes('higher than the one below'));
  check('protein assay: falling line refused', thr(() => fitCurve([0, 100, 200], [0.3, 0.2, 0.1], 'linear')).includes('does not rise'));
  check('protein assay: quadratic that turns over inside the standards refused', thr(() => fitCurve([0, 1000, 2000, 3000], [0, 0.6, 0.8, 0.6], 'quadratic')).includes('turns over'));
  const bad = parseStandards('0, 0.1\nabc, 0.2\n100, x\n200');
  check('protein assay: bad standards lines named', bad.rows.length === 1 && bad.errors.length === 3 && bad.errors[0].includes('line 2'));
  const badU = parseUnknowns('A, 0.5, 0.3\nB, 2');
  check('protein assay: bad samples lines named', badU.rows.length === 0 && badU.errors.length === 2 && badU.errors[0].includes('1 or more'));
};

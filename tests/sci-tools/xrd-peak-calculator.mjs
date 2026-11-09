// #842 XRD peak calculator: Bragg, Scherrer, Williamson-Hall, cubic indexing and peak picking. Reference numbers
// from NumPy/SciPy (scipy.signal.find_peaks + curve_fit Gaussian + linear on the same scan; numpy.polyfit for the
// Williamson-Hall line; brute-force allowed h²+k²+l² over all signed hkl).
import * as X from '../../src/lib/sci/xrd.ts';

export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t;
  check('xrd: Bragg d at 2θ 38.97°, Cu Kα1 = 2.30933 Å (NumPy)', near(X.dFromTwoTheta(38.97, 1.5406), 2.3093292069844606, 1e-12));
  check('xrd: 2θ for d = 2 Å, Cu Kα1 = 45.30611° (NumPy); unreachable d gives NaN', near(X.twoThetaFromD(2, 1.5406), 45.3061055208931, 1e-10) && Number.isNaN(X.twoThetaFromD(0.7, 1.5406)));
  check('xrd: second order halves the angle sense (d doubles at the same 2θ)', near(X.dFromTwoTheta(30, 1.5406, 2), 2 * X.dFromTwoTheta(30, 1.5406), 1e-12));
  check('xrd: Scherrer, 0.5° observed, 0.1° instrument (Gaussian), 2θ 40° = 172.569 Å (NumPy)', near(X.scherrer(40, X.sampleBreadth(0.5, 0.1, 'gauss'), 1.5406, 0.9), 172.56932408573937, 1e-8));
  check('xrd: Scherrer with Lorentzian (straight) subtraction 0.5 − 0.1 = 0.4° gives 211.353 Å', near(X.scherrer(40, X.sampleBreadth(0.5, 0.1, 'lorentz'), 1.5406, 0.9), 211.3533946335223, 1e-8));
  check('xrd: peak no wider than the instrument gives NaN', Number.isNaN(X.sampleBreadth(0.1, 0.1)) && Number.isNaN(X.sampleBreadth(0.05, 0.1, 'lorentz')) && X.sampleBreadth(0.3, 0) === 0.3);

  // Williamson-Hall on exact data: D = 300 Å, ε = 0.0015 come straight back.
  const exact = [30, 45, 60, 80, 100].map((tt) => { const th = (tt / 2) * Math.PI / 180; return { tt, beta: ((0.9 * 1.5406) / (300 * Math.cos(th)) + 4 * 0.0015 * Math.tan(th)) * 180 / Math.PI }; });
  const w0 = X.williamsonHall(exact, 1.5406, 0.9);
  check('xrd: Williamson-Hall on exact data returns D = 300 Å and ε = 0.0015', near(w0.size, 300, 1e-6) && near(w0.strain, 0.0015, 1e-12) && near(w0.r2, 1, 1e-12));
  check('xrd: Williamson-Hall needs two peaks; strain-only data gives no size', X.williamsonHall([{ tt: 40, beta: 0.3 }], 1.5406) === null && Number.isNaN(X.williamsonHall([30, 60, 90].map((tt) => ({ tt, beta: (4 * 0.002 * Math.tan((tt / 2) * Math.PI / 180) - 1e-4) * 180 / Math.PI })), 1.5406).size));

  // Allowed reflections, checked against a brute-force NumPy list.
  check('xrd: SC lines skip 7, 15, 23, 28 (not sums of three squares)', X.cubicLines('sc', 30).map((l) => l.N).join() === '1,2,3,4,5,6,8,9,10,11,12,13,14,16,17,18,19,20,21,22,24,25,26,27,29,30');
  check('xrd: BCC lines are the even N', X.cubicLines('bcc', 30).map((l) => l.N).join() === '2,4,6,8,10,12,14,16,18,20,22,24,26,30');
  check('xrd: FCC lines 3, 4, 8, 11, 12, 16, 19, 20, 24, 27', X.cubicLines('fcc', 27).map((l) => l.N).join() === '3,4,8,11,12,16,19,20,24,27');
  check('xrd: diamond lines 3, 8, 11, 16, 19, 24, 27, 32 and 222 forbidden', X.cubicLines('diamond', 32).map((l) => l.N).join() === '3,8,11,16,19,24,27,32' && !X.cubicAllowed(2, 2, 2, 'diamond') && X.cubicAllowed(4, 0, 0, 'diamond'));
  check('xrd: N = 9 is both 300 and 221 in SC', X.cubicLines('sc', 9).at(-1).hkl.join() === '300,221');

  const sOf = (a, Ns) => Ns.map((N) => N / (a * a));
  { const r = X.rankCubic(sOf(3.3, [2, 4, 6, 8, 10, 12, 14]), 0.005);
    check('xrd: seven BCC lines index as BCC, a = 3.3 Å; SC either leaves a line unindexed or misses lines', r[0].lattice === 'bcc' && near(r[0].a, 3.3, 1e-9) && (() => { const f = r.find((f) => f.lattice === 'sc'); return f.unindexed + f.missing.length > 0; })()); }
  { const r = X.rankCubic(sOf(3.3, [2, 4, 6, 8, 10, 12]), 0.005);
    check('xrd: six BCC lines: BCC and SC both fit; BCC (the more restrictive) is listed first', r[0].lattice === 'bcc' && r[1].lattice === 'sc' && r[1].unindexed === 0 && r[1].missing.length === 0 && near(r[1].a, 3.3 / Math.SQRT2, 1e-9)); }
  { const r = X.rankCubic(sOf(5.43, [3, 8, 11, 16, 19, 24]), 0.005);
    check('xrd: diamond lines index as diamond (FCC would be missing 200 and 222)', r[0].lattice === 'diamond' && near(r[0].a, 5.43, 1e-9) && r.find((f) => f.lattice === 'fcc').missing.join() === '4,12,20'); }
  { const r = X.rankCubic(sOf(4.05, [3, 4, 8, 11, 12]), 0.005);
    check('xrd: FCC lines index as FCC with hkl 111, 200, 220, 311, 222', r[0].lattice === 'fcc' && r[0].lines.map((l) => l.hkl).join('|') === '111|200|220|311|222'); }
  { const r = X.rankCubic(sOf(3.0, [1, 2, 3, 4, 5, 6, 8]), 0.005);
    check('xrd: SC lines index as SC', r[0].lattice === 'sc' && near(r[0].a, 3, 1e-9) && r[0].unindexed === 0); }
  { const r = X.rankCubic(sOf(4.05, [3, 4, 8, 11]).map((v, i) => v * (1 + [0.003, -0.002, 0.002, -0.001][i])), 0.005);
    check('xrd: small errors still index; a within 0.2 %', r[0].lattice === 'fcc' && near(r[0].a, 4.05, 0.008) && r[0].rms > 0); }
  { const s = sOf(4.05, [3, 4, 8]); s.push(1 / 1.7 ** 2);
    const f = X.indexCubic(s, 'fcc', 0.005);
    check('xrd: a stray line is reported as unindexed', f.unindexed === 1 && f.lines.some((l) => l.N === null)); }
  { const s = sOf(4.05, [4, 8, 11, 12]);
    const f1 = X.indexCubic(s, 'fcc', 0.005, 1 / 4.05 ** 2 * 3.5), f0 = X.indexCubic(s, 'fcc', 0.005, 0);
    check('xrd: a missing 111 counts only if the scan reached it', f1.missing.length === 0 && f0.missing.join() === '3'); }

  // The made-up example scan: peaks found and fitted match SciPy, and the known structure comes back.
  const e = X.examplePattern(), { peaks } = X.findPeaks(e.x, e.y, {});
  check('xrd: example scan has 6 peaks (SciPy find_peaks also finds 6)', peaks.length === 6 && peaks.every((p) => p.fitted));
  const sp = [[38.96866, 0.50571], [45.30563, 0.53938], [66.00658, 0.67987], [79.38710, 0.79690], [83.69452, 0.83286], [100.75457, 1.09584]];
  check('xrd: fitted positions and widths match SciPy curve_fit (0.002° and 0.1 %)', peaks.every((p, i) => near(p.tt, sp[i][0], 0.002) && near(p.fwhm / sp[i][1], 1, 0.001)));
  check('xrd: fitted positions within 0.01° of the made-up truth', peaks.every((p, i) => near(p.tt, e.truth[i].tt, 0.01)));
  const wh = X.williamsonHall(peaks.map((p) => ({ tt: p.tt, beta: X.sampleBreadth(p.fwhm, 0.06) })), 1.5406);
  check('xrd: example Williamson-Hall matches numpy.polyfit (D 261.238 Å, ε 0.0021428, SEs, R²)', near(wh.size, 261.23810955295204, 1e-6) && near(wh.strain, 0.002142766535795418, 1e-12) && near(wh.seSlope, 0.00012676080174567962, 1e-12) && near(wh.seIntercept, 0.00029293072352686033, 1e-12) && near(wh.r2, 0.9861947924425545, 1e-9));
  check('xrd: example size and strain within 5 % and 8 % of the made-up 250 Å and 0.002', near(wh.size / 250, 1, 0.05) && near(wh.strain / 0.002, 1, 0.08));
  const r = X.rankCubic(peaks.map((p) => 1 / X.dFromTwoTheta(p.tt, 1.5406) ** 2), 0.005, 1 / X.dFromTwoTheta(20, 1.5406) ** 2);
  check('xrd: example indexes as FCC, a = 4.0000 Å', r[0].lattice === 'fcc' && near(r[0].a, 4, 0.0005) && r[0].unindexed === 0 && r[0].missing.length === 0);
  check('xrd: Gaussian and Lorentzian areas', near(X.peakArea('gauss', 1, 1), 1.0644670194312262, 1e-12) && near(X.peakArea('lorentz', 1, 1), Math.PI / 2, 1e-12));
  check('xrd: flat scan finds no peaks', X.findPeaks([0, 1, 2, 3, 4, 5, 6, 7, 8], [5, 5, 5, 5, 5, 5, 5, 5, 5]).peaks.length === 0);
};

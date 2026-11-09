// #865 Thin-film thickness: exact transmittance, fringe extrema, Swanepoel envelope, whole orders, fringe count.
// Reference numbers from Python: an independent transfer-matrix calculation (coherent film, incoherent substrate
// back face) for the transmittance, scipy.signal.find_peaks + numpy.polyfit for the extrema, and
// scipy.interpolate.CubicSpline (natural) with the same envelope formulas in NumPy for n, d1, d2 and x.
import * as F from '../../src/lib/sci/thinfilm.ts';

export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t;
  check('thin film: Swanepoel T equals the transfer-matrix result for non-absorbing films (to 1e-15)', near(F.swanepoelT(600, 2.3, 1.5, 1000), 0.7186491027074993, 1e-15) && near(F.swanepoelT(733.3, 2.0, 1.52, 640), 0.7708885683676224, 1e-15));
  check('thin film: with absorption the formula stays within 0.1 % of the transfer matrix at α = 10⁻⁴ nm⁻¹', Math.abs(F.swanepoelT(600, 2.3, 1.5, 1000, 1e-4) / 0.6554956938184742 - 1) < 1e-3);
  check('thin film: substrate index from Ts = 0.92 is 1.512955 (both faces)', near(F.substrateIndex(0.92), 1.5129547378753352, 1e-12));
  check('thin film: 10 fringes between 600 and 900 nm at n = 2 give 4500 nm; at 30° 4647.58 nm', near(F.fromCount(10, 600, 900, 2), 4500, 1e-9) && near(F.fromCount(10, 900, 600, 2, 30), 4647.5800154489, 1e-8));
  check('thin film: natural cubic spline reproduces a straight line and its knots', (() => { const s = F.spline([1, 2, 4, 7], [3, 5, 9, 15]); return near(s(3), 7, 1e-12) && near(s(4), 9, 1e-12) && Number.isNaN(s(8)); })());

  const ex = F.exampleSpectrum(), T = ex.T.map((t) => t / 100);
  const e = F.findExtrema(ex.nm, T, 3, 0.02, 1);
  const ref = [514.2, 541.49, 572.9, 608.02, 649.0, 695.8, 750.9, 815.8, 894.9, 990.3, 1113.1, 1266.2, 1475.9];
  check('thin film: example has 13 alternating extrema at the SciPy find_peaks positions (to 0.06 nm)', e.length === 13 && e.every((x, i) => near(x.lambda, ref[i], 0.06) && x.kind === (i % 2 ? 'min' : 'max')));
  const env = F.envelope(e, 1.5).res;
  check('thin film: envelope d1 = 1000.924 ± 10.142 nm and d2 = 999.482 ± 0.606 nm (SciPy CubicSpline + NumPy)', near(env.d1, 1000.9240485543551, 1e-8) && near(env.d1sd, 10.14240196105477, 1e-8) && near(env.d2, 999.4821895958081, 1e-8) && near(env.d2sd, 0.605695159967117, 1e-8));
  check('thin film: envelope orders 8.5, 8, … 3.5 and n within 0.005 of the made-up Cauchy index', env.rows.map((r) => r.m).join() === '8.5,8,7.5,7,6.5,6,5.5,5,4.5,4,3.5' && env.rows.every((r) => Math.abs(r.n2 - (2.2 + 3e4 / r.lambda ** 2)) < 0.005));
  check('thin film: envelope x at the first three extrema 0.987747, 0.992023, 0.995143 (NumPy)', near(env.rows[0].x, 0.9877471314473175, 1e-12) && near(env.rows[1].x, 0.9920231993838058, 1e-12) && near(env.rows[2].x, 0.9951431264889703, 1e-12));
  check('thin film: the made-up thickness (1000 nm) is inside d2 ± 1 nm', Math.abs(env.d2 - 1000) < 1);
  const k = F.fromExtrema(e, (x) => 2.2 + 3e4 / x.lambda ** 2, 'max');
  check('thin film: with the known Cauchy index, d2 = 999.76 nm from all 13 extrema', k.rows.length === 13 && near(k.d2, 999.7591326537487, 1e-6));
  check('thin film: order shift of +1 changes d2 by λ/2n per extremum', (() => { const k1 = F.fromExtrema(e, (x) => 2.2 + 3e4 / x.lambda ** 2, 'max', 1); return k1.d2 > k.d2 + 100 && k1.rows.every((r, i) => near(r.m, k.rows[i].m + 1, 1e-12)); })());
  { // Exact synthetic spectrum without noise, constant n = 1.8, d = 2500 nm: whole orders give d exactly.
    const nm = Array.from({ length: 1201 }, (_, i) => 600 + i * 0.5), Tt = nm.map((l) => F.swanepoelT(l, 1.8, 1.5, 2500));
    const ee = F.findExtrema(nm, Tt, 3, 0.02, 0), r = F.fromExtrema(ee, () => 1.8, 'max');
    check('thin film: noise-free 2500 nm film (n = 1.8) comes back to 0.05 nm', near(r.d2, 2500, 0.05) && r.rows.every((x) => Number.isInteger(x.m * 2)));
  }
  { const nm = Array.from({ length: 1201 }, (_, i) => 600 + i * 0.5), Tt = nm.map((l) => F.swanepoelT(l, 1.8, 1.5, 2500, 0));
    const ee = F.findExtrema(nm, Tt.map((t) => 1 - t), 3, 0.02, 0), r = F.fromExtrema(ee, () => 1.8, 'min');
    check('thin film: the same film read as reflectance (1 − T, minima whole) gives the same 2500 nm', near(r.d2, 2500, 0.05)); }
  check('thin film: envelope needs two maxima and two minima', F.envelope(e.slice(0, 3), 1.5) === null);
};

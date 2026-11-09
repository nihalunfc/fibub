// #324 Classical plant growth analysis. References from an independent Python script (NumPy 2, SciPy):
// (1) exactness of Hunt's mean-ULR formula when leaf area is linear in dry mass, against the true mean
//     (1/Δt)∫(dW/dt)/LA dt by scipy.integrate.quad; (2) the made-up example, with t quantiles from scipy.stats.
import { analyse, interval, harvests } from '../../src/lib/sci/plantgrowth.ts';
const rel = (a, b, tol) => Math.abs(a / b - 1) < tol;
export default async (check) => {
  const W = (t) => 0.1 * Math.exp(0.12 * t), LA = (t) => 180 * W(t) + 6;
  const h = (t) => ({ t, n: 1, w: W(t), la: LA(t), lw: NaN, lnW: Math.log(W(t)), sdLnW: NaN, lar: LA(t) / W(t), sla: NaN, lwr: NaN });
  const iv = interval(h(10), h(24));
  check('plant growth: Hunt ULR equals the integrated true mean (scipy quad 6.360582074e-4)', rel(iv.ulr, 6.360582074252396e-4, 1e-9));
  check('plant growth: RGR of pure exponential growth is r', rel(iv.rgr, 0.12, 1e-12));
  const d = [[14, 0.118, 31.2, 0.061], [14, 0.131, 33.5, 0.066], [14, 0.109, 28.4, 0.057], [14, 0.125, 30.9, 0.063],
    [21, 0.341, 76.0, 0.162], [21, 0.372, 81.5, 0.170], [21, 0.318, 70.2, 0.151], [21, 0.356, 77.9, 0.166],
    [28, 0.86, 158.0, 0.35], [28, 0.95, 171.0, 0.38], [28, 0.79, 149.0, 0.33], [28, 0.91, 166.0, 0.37]].map(([t, w, la, lw]) => ({ t, w, la, lw }));
  const a = analyse(d);
  const ref = [[0.1507933885, 0.007402175186, 0.1326809183, 0.1689058587, 0.0006414442452, 238.5302148, 486.4512829, 0.4896517649],
    [0.1325397669, 0.007427200123, 0.1143660629, 0.1507134709, 0.0006680725274, 201.9037173, 460.6139623, 0.4376618868],
    [0.1416665777, 0.004012445802, 0.1318484765, 0.1514846789, 0.0006849906243, 220.102281, 476.1869709, 0.4593972855]];
  const got = [...a.intervals, a.whole].map((x) => [x.rgr, x.rgrSe, x.rgrLo, x.rgrHi, x.ulr, x.lar, x.sla, x.lwr]);
  check('plant growth: example RGR, SE, 95 % CI, ULR, LAR, SLA, LWR for 14-21, 21-28 and 14-28 d match Python', got.every((r, i) => r.every((v, j) => rel(v, ref[i][j], 1e-8))));
  const c = analyse(d, 'mean');
  check('plant growth: classical RGR from ln of mean W', rel(c.intervals[0].rgr, 0.1506973952, 1e-8) && rel(c.whole.rgr, 0.1416681902, 1e-8) && Number.isNaN(c.intervals[0].rgrSe));
  check('plant growth: harvest means', harvests(d)[1].n === 4 && rel(harvests(d)[1].w, 0.34675, 1e-12));
};

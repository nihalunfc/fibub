// #305 distance sampling: reference values from an independent Python fit (SciPy 1.x optimize.minimize L-BFGS-B then
// Nelder-Mead, integrate.quad for the detection integrals, finite-difference Hessian, stats.t) on the same made-up data.
import { fitDetection, density } from '../../src/lib/sci/distsamp.ts';
const LINES = `L1	10.0
L1	21.8
L1	1.3
L1	29.5
L1	10.8
L1	13.7
L1	10.8
L1	7.9
L1	2.3
L1	20.5
L1	0.6
L1	15.3
L1	29.6
L2	3.4
L2	4.1
L2	55.4
L2	11.9
L2	1.1
L2	2.5
L3	3.2
L3	21.5
L3	17.8
L3	23.3
L3	17.8
L3	0.7
L3	19.5
L3	12.8
L3	2.5
L3	2.4
L3	1.4
L3	27.0
L4	12.7
L4	4.2
L4	15.0
L4	1.5
L4	14.7
L4	31.6
L4	14.9
L4	4.5
L4	10.2
L5	12.7
L5	4.3
L5	19.8
L5	25.2
L5	29.1
L5	17.5
L5	14.2
L6	2.1
L6	27.7
L6	15.2
L6	7.2
L6	8.1
L6	5.5
L6	33.5
L6	9.4
L6	6.7
L6	7.8
L6	2.7
L6	4.3
L6	24.5
L6	0.3`;
const POINTS = `P1	9.1
P1	14.5
P2	22.9
P2	35.6
P3	51.4
P3	49.4
P3	70.1
P4	40.5
P4	65.1
P4	39.3
P4	48.7
P4	84.4
P5	24.4
P5	74.3
P6	20.4
P6	32.9
P7	24.6
P8	2.4
P8	23.8
P8	21.9
P8	10.4
P10	20.5
P10	17.7
P10	10.1
P11	47.1
P11	12.7
P12	58.8`;
const rows = (t) => t.split('\n').map((l) => l.split('\t')).map(([k, d]) => ({ k, d: Number(d) }));

export default async (check) => {
  const close = (a, b, rel = 1e-4) => Math.abs(a - b) <= rel * Math.max(1, Math.abs(b));
  const L = rows(LINES), eff = { L1: 2.0, L2: 1.5, L3: 2.5, L4: 1.8, L5: 2.2, L6: 2.0 }, ids = Object.keys(eff);
  const cnt = (data, keys, w) => keys.map((k) => data.filter((r) => r.k === k && r.d <= w).length);
  const hn = fitDetection(L.map((r) => r.d), 50, 'hn', 'line');
  check('distance: line half-normal σ 15.4951, n 60 within 50 m, AIC 416.960', hn.n === 60 && close(hn.par[0], 15.495135365237795) && close(hn.aic, 416.9597979673423, 1e-7));
  check('distance: ESW 19.3960 m, SE 1.8206', close(hn.mu, 19.395962977261984) && close(hn.seMu, 1.8206286783893804, 2e-3));
  const dh = density(hn, Object.values(eff), cnt(L, ids, 50));
  check('distance: line density 128.893 /km², cv 0.15760, df 11.71', close(dh.D, 128.89280119428804) && close(dh.cv, 0.1575980914879741, 2e-3) && close(dh.cvN, 0.1265948759873899, 1e-9) && close(dh.df, 11.70913906170608, 1e-2));
  check('distance: line density 95 % CI 91.54 to 181.49', close(dh.lo, 91.53904774546908, 2e-3) && close(dh.hi, 181.48926178372415, 2e-3));
  const hr = fitDetection(L.map((r) => r.d), 50, 'hr', 'line');
  check('distance: line hazard-rate σ 19.7432, b 4.0460, AIC 422.468', close(hr.par[0], 19.743225634624245, 1e-3) && close(hr.par[1], 4.046002078546421, 1e-3) && close(hr.aic, 422.46849578657253, 1e-7));
  const dr = density(hr, Object.values(eff), cnt(L, ids, 50));
  check('distance: hazard-rate ESW 23.739, density 105.31 (72.70 to 152.56)', close(hr.mu, 23.738914210885778, 1e-4) && close(dr.D, 105.31231453094824, 1e-4) && close(dr.lo, 72.69928127315637, 5e-3) && close(dr.hi, 152.55561537388292, 5e-3));
  const P = rows(POINTS), pts = Array.from({ length: 12 }, (_, i) => `P${i + 1}`);
  const ph = fitDetection(P.map((r) => r.d), 80, 'hn', 'point');
  check('distance: point half-normal σ 28.0082, ν 4845.50 m², EDR 39.273 m', ph.n === 26 && close(ph.par[0], 28.008175932428752) && close(ph.mu, 4845.49683597336) && close(ph.edr, 39.27301295244099));
  const dp = density(ph, new Array(12).fill(1), cnt(P, pts, 80));
  check('distance: point density 447.15 /km² (261.71 to 763.99)', close(dp.D, 447.1505688707004) && close(dp.lo, 261.70905105122404, 2e-3) && close(dp.hi, 763.9920378690158, 2e-3));
  const pr = fitDetection(P.map((r) => r.d), 80, 'hr', 'point');
  check('distance: point hazard-rate AIC 490.552 beats half-normal, EDR 31.303', pr.aic < ph.aic && close(pr.aic, 490.55211258175643, 1e-6) && close(pr.edr, 31.303180266830957, 1e-3));
  // Untruncated half-normal has a closed-form MLE: σ² = mean of x².
  const all = L.map((r) => r.d), big = fitDetection(all, 300, 'hn', 'line');
  check('distance: half-normal with no effective truncation gives σ = √(mean x²) = 16.8267', close(big.par[0], 16.826749781128896, 1e-5));
  const pois = density(hn, [12], null);
  check('distance: one total length uses Poisson variance for n', pois.varMethod === 'poisson' && close(pois.cvN, 1 / Math.sqrt(60), 1e-9) && close(pois.D, dh.D, 1e-12));
};

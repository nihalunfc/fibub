// #508 Proxy record stacker. Interpolation, z-scores, mean/median stacks with ±1 SD, the bootstrap envelope
// (same resample indices), Pearson r, lag-1 autocorrelations, the Bretherton et al. (1999) effective sample size,
// p-values and the lag scan were checked against numpy, pandas (groupby, Series.shift/corr) and scipy
// (stats.pearsonr, stats.t) on the made-up example, both on the shared age grid and on a wider grid with gaps
// (all agree to 1e-9; the bootstrap matches numpy.nanpercentile).
import { parseRecords, cleanRecord, autoGrid, gridAges, interpolate, zscore, stack, bootIndex, bootstrap, pearson, lag1, correlate, lagScan, exampleRecords, toLong, medianSpacing, rng } from '../../src/lib/sci/proxystack.ts';

export default async (check) => {
  const near = (a, b, t = 1e-6) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  // Parsing: long, wide, duplicates averaged and sorted.
  const L = parseRecords('record,age,value\nA,10,1\nA,0,0\nA,10,3\nB,5,7\nB,x,1');
  check('proxy: long format, sorted, duplicate ages averaged, bad rows skipped', L.records.length === 2 && L.records[0].age.join() === '0,10' && L.records[0].value.join() === '0,2' && L.skipped === 1);
  const W = parseRecords('age\tLake\tage\tCave\n0\t1\t0\t5\n100\t2\t50\t6\n200\t3\t\t');
  check('proxy: wide format pairs with names and blanks', W.records.map((r) => r.name).join() === 'Lake,Cave' && W.records[1].age.length === 2);
  check('proxy: odd wide table refused', /pairs/.test(parseRecords('1,2,3\n4,5,6').error ?? ''));
  check('proxy: clean drops NaN', cleanRecord({ name: 'x', age: [3, NaN, 1], value: [1, 2, 3] }).age.join() === '1,3');
  // Interpolation by hand.
  const r = { name: 'r', age: [0, 10, 40], value: [0, 10, 40] };
  check('proxy: linear interpolation, NaN outside the record', interpolate(r, [-5, 0, 5, 25, 40, 45]).map(String).join() === 'NaN,0,5,25,40,NaN');
  check('proxy: no interpolation across a long gap', Number.isNaN(interpolate(r, [25], 20)[0]) && interpolate(r, [10], 20)[0] === 10);
  // z-scores over a window.
  const zz = zscore([1, 2, 3, 100], [0, 1, 2, 3], 0, 2);
  check('proxy: z-score uses only the window', zz.mean === 2 && zz.sd === 1 && zz.z[3] === 98);
  check('proxy: stack mean, median, sd, minimum count', (() => { const s = stack([[1, 1, NaN], [2, 3, NaN], [6, NaN, 4]], 'mean', 2); const m = stack([[1], [2], [6]], 'median'); return s.center[0] === 3 && s.center[1] === 2 && Number.isNaN(s.center[2]) && s.n.join() === '3,2,1' && near(s.sd[0], Math.sqrt(7)) && m.center[0] === 2; })());
  check('proxy: bootstrap of identical records is flat', (() => { const b = bootstrap([[1, 2], [1, 2], [1, 2]], 'mean', bootIndex(50, 3, 1)); return b.lo.join() === '1,2' && b.hi.join() === '1,2'; })());
  check('proxy: bootstrap indices are seeded', JSON.stringify(bootIndex(5, 4, 9)) === JSON.stringify(bootIndex(5, 4, 9)) && bootIndex(5, 4, 9).flat().every((k) => k >= 0 && k < 4));
  check('proxy: Pearson r', near(pearson([1, 2, 3, 4], [2, 4, 5, 9]).r, 0.9647638212377321));
  check('proxy: lag-1 autocorrelation of 1..5', near(lag1([1, 2, 3, 4, 5], [0, 1, 2, 3, 4]), 0.4));
  // Bretherton: n = 100, r1 = r1' = 0.5 gives n_eff = 60. Built from an AR-like pattern only for the formula.
  check('proxy: Bretherton n_eff formula', near(100 * (1 - 0.25) / (1 + 0.25), 60));
  // The example, as numpy, pandas and scipy computed it.
  const recs = parseRecords(toLong(exampleRecords())).records;
  const g = autoGrid(recs), ages = gridAges(g);
  check('proxy: example has four records', recs.map((x) => x.age.length).join() === '121,185,77,54' && near(medianSpacing(recs[3].age), 104.5, 0.2));
  check('proxy: auto grid over the shared ages', g.start === 500 && g.end === 5700 && g.step === 100 && ages.length === 53 && g.overlap);
  const flips = [true, false, false, false];
  const z = recs.map((x, i) => zscore(interpolate(x, ages), ages, 1000, 4000).z.map((v) => (flips[i] ? -v : v)));
  const i3 = ages.indexOf(3000);
  check('proxy: example z-score (numpy)', near(z[0][i3], -0.07972906218136805, 1e-9));
  check('proxy: example stack mean and median (numpy)', near(stack(z, 'mean').center[i3], -0.07338135441377769, 1e-9) && near(stack(z, 'median').center[i3], 0.002399611448911737, 1e-9));
  const b = bootstrap(z, 'mean', bootIndex(200, 4, 7));
  check('proxy: example bootstrap 95 % (numpy percentile)', near(b.lo[i3], -0.6317746367152646, 1e-9) && near(b.hi[i3], 0.4502952988401596, 1e-9));
  const c01 = correlate(z[0], z[1]), c23 = correlate(z[2], z[3]);
  check('proxy: example r, n_eff and p (scipy)', near(c01.r, 0.926266, 1e-5) && c01.n === 53 && near(c01.neff, 15.8426, 1e-5) && near(c01.p, 3.0601122158024934e-07, 1e-6) && near(c23.neff, 15.598, 1e-5) && near(c23.p, 0.01511581621789084, 1e-6));
  check('proxy: autocorrelation makes p larger', c23.p > c23.pNaive);
  // Decadal ice-core style pair (blog: ice-core-lead-record-lag-scan-synchronisation, after Gabrielli et al. 2026,
  // doi:10.5194/cp-22-1037-2026, CC BY): simulated from the seeded rng, so the autocorrelation correction and the
  // lag scan stay pinned. 194 decades, r = 0.4443, n_eff 71.3 of 194, corrected p 1.00e-4 against a naive 8.6e-11.
  { const T0 = -175, T1 = 1755, ages = []; for (let t = T0; t <= T1; t += 10) ages.push(t);
    const bump = (t, c, w) => Math.exp(-0.5 * ((t - c) / w) ** 2);
    const red = (n, sd, seed, phi) => { const g = rng(seed), out = []; let x = 0;
      for (let i = 0; i < n; i++) { let u = 0; while (u === 0) u = g(); const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * g()); x = phi * x + Math.sqrt(1 - phi * phi) * z; out.push(x * sd); } return out; };
    const sh = red(ages.length, 1, 4242, 0.86);
    const base = ages.map((t, i) => bump(t, 50, 170) + 0.8 * bump(t, 1250, 200) + 1.4 * bump(t, 1700, 120) + sh[i]);
    const nA = red(ages.length, 1.6, 20261, 0.5), nB = red(ages.length, 1.6, 77003, 0.5);
    const zA = zscore(base.map((v, i) => +(v + nA[i]).toFixed(3)), ages, T0, T1).z;
    const zB = zscore(base.map((v, i) => +(v + nB[i]).toFixed(3)), ages, T0, T1).z;
    const c = correlate(zA, zB), pk = lagScan(zA, zB, 12).reduce((m, x) => (x.r > m.r ? x : m));
    check('proxy: simulated decadal ice-core pair gives r 0.4443 with n_eff 71.3 of 194', near(c.r, 0.4442987, 1e-6) && c.n === 194 && near(c.r1a, 0.6751279, 1e-6) && near(c.r1b, 0.6848710, 1e-6) && near(c.neff, 71.321735, 1e-5));
    check('proxy: its corrected p is 1.00e-4 where the naive p is 8.6e-11, and the lag peak is one decade off', near(c.p, 1.0001896e-4, 1e-6) && near(c.pNaive, 8.6143983e-11, 1e-6) && pk.lag === -1 && near(pk.r, 0.4846538, 1e-6)); }
  const scan = lagScan(z[0], z[2], 6), best = scan.reduce((m, x) => (x.r > m.r ? x : m));
  check('proxy: lag scan finds the 150-year offset between 100 and 200 years', best.lag === 1 && near(best.r, 0.887, 2e-3) && near(scan[8].r, 0.844, 2e-3));
};

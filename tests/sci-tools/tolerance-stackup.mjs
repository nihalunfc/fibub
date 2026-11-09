// #646 tolerance stack-up: worst case and RSS by hand, the normal fallout against scipy.stats.norm, and the seeded
// Monte Carlo against an independent NumPy simulation (2 million draws, numpy.random default_rng: mean 0.26000,
// sd 0.06078, 0.0088 % below 0.05 and 0.93 % above 0.40).
import * as T from '../../src/lib/sci/eng-stack.ts';
export default async (check) => {
  const near = (a, b, rel = 1e-9) => Math.abs(a - b) <= rel * Math.max(1e-12, Math.abs(b));
  const rows = [['Part', 'Nominal', 'Plus', 'Minus', 'Direction', 'Distribution'], ['Housing', '60', '0.1', '0.1', '+', 'normal'], ['Spacer', '20', '±0.05', '', '-', ''], ['Bearing', '15', '0', '-0.12', '−', 'uniform'], ['Gear hub', '24.5', '0.08', '', 'subtract', 'triangular'], ['Clip', '0.3', '+0.02', '0.02', '-1', 'Normal']];
  const d = T.parseDims(rows);
  check('stack: parses header, ±, −, words and default distribution', d.length === 5 && d[1].plus === 0.05 && d[1].minus === 0.05 && d[1].dist === 'normal' && d[2].minus === 0.12 && d[2].dir === -1 && d[3].dir === -1 && d[3].minus === 0.08 && d[4].dist === 'normal');
  const s = T.stack(d);
  check('stack: nominal and mean gap (asymmetric bearing shifts the mean)', near(s.nominal, 0.2, 1e-12) && near(s.mean, 0.26, 1e-12));
  check('stack: worst case ±0.31', near(s.wcHalf, 0.31, 1e-12) && near(s.wcMin, -0.05, 1e-9) && near(s.wcMax, 0.57, 1e-12));
  check('stack: RSS sigma from normal ±3σ, uniform h/√3, triangular h/√6 (NumPy 0.0608276)', near(s.sigma, 0.060827625302982205, 1e-12) && near(s.rssHalf, 3 * s.sigma));
  check('stack: variance shares add to 1', near(s.share.reduce((a, b) => a + b, 0), 1, 1e-12) && near(s.share[2], 0.0012 / 0.0037, 1e-9));
  { const f = T.fallout(0.26, s.sigma, 0.05, 0.40); check('stack: normal fallout (scipy 2.7783e-4 below, 1.06793e-2 above), Cp, Cpk', near(f.below, 0.0002778335914001186, 1e-6) && near(f.above, 0.010679270216917326, 1e-6) && near(f.Cp, 0.35 / (6 * s.sigma)) && near(f.Cpk, 0.14 / (3 * s.sigma))); }
  check('stack: all-normal RSS equals root-sum-square of tolerances', near(T.stack(T.parseDims([['a', '10', '0.3'], ['b', '5', '0.4', '', '-']])).rssHalf, 0.5, 1e-12));
  const x = T.monteCarlo(d, 100000, 1), m = T.summarise(x, 0.05, 0.40);
  check('stack: Monte Carlo mean and sd match NumPy within sampling error', Math.abs(m.mean - 0.26) < 4 * 0.0608 / Math.sqrt(1e5) && Math.abs(m.sd / 0.06078 - 1) < 0.01);
  check('stack: Monte Carlo fallout matches NumPy (0.0088 %, 0.932 %)', Math.abs(m.above - 0.0093175) < 0.0012 && m.below < 0.0004);
  check('stack: same seed, same result; other seed differs', T.monteCarlo(d, 1000, 7)[999] === T.monteCarlo(d, 1000, 7)[999] && T.monteCarlo(d, 1000, 8)[999] !== T.monteCarlo(d, 1000, 7)[999]);
  { const u = T.monteCarlo([{ name: 'u', nominal: 0, plus: 1, minus: 1, dir: 1, dist: 'uniform' }], 50000, 3); check('stack: uniform parts stay inside their band', u.every((v) => v >= -1 && v <= 1)); }
  let threw = 0; try { T.parseDims([['a', '10', 'x']]); } catch { threw++; } try { T.parseDims([['a', '10', '0.1', '0.1', '?']]); } catch { threw++; } try { T.parseDims([]); } catch { threw++; }
  check('stack: bad rows rejected', threw === 3);
};

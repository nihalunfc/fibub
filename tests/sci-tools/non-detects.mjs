// #153 Non-detect statistics, blog checks: /blog/discoveries/hair-trace-metals-below-detection-limit/
// (Peña-Fernández et al. 2026, Toxics 14: 268). The core methods are pinned against statsmodels and SciPy in
// tests/sci.mjs; these pin the worked numbers the article tells readers they will see.
import { parseObs, kaplanMeier, ros, mleLognormal, substitute, percentile } from '../../src/lib/sci/censored.ts';
import { normInv, normCdf } from '../../src/lib/sci/stats.ts';
export default async (check) => {
  const near = (a, b, tol = 1e-9) => Number.isFinite(a) && Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  // The 24 made-up results in the article's "Check it yourself" (9 non-detects at 0.124 µg/g).
  const txt = '0.366 0.626 <0.124 <0.124 0.283 0.489 0.3 0.561 <0.124 1.837 0.202 0.164 <0.124 0.177 0.156 <0.124 0.156 0.243 0.327 <0.124 <0.124 <0.124 <0.124 0.484';
  const obs = txt.split(' ').map((c) => parseObs(c));
  const km = kaplanMeier(obs);
  check('non-detects: 24 hair results, 9 below the limit', obs.length === 24 && obs.filter((o) => o.nd).length === 9);
  check(`non-detects: Kaplan-Meier mean 0.3120 and se 0.0719 (${km.mean.toFixed(4)}, ${km.se.toFixed(4)})`, near(km.mean, 0.3120, 1e-3) && near(km.se, 0.0719, 1e-3) && km.q(0.5) === 0.164 && km.q(0.95) === 0.626);
  check('non-detects: ROS and MLE means 0.2897 and 0.2932', near(ros(obs).mean, 0.2897, 1e-3) && near(mleLognormal(obs).mean, 0.2932, 1e-3));
  check('non-detects: half-limit 0.2887 and zero 0.2655 substitutions', near(substitute(obs, 0.5).mean, 0.2887, 1e-3) && near(substitute(obs, 0).mean, 0.2655, 1e-3));
  check('non-detects: ROS 95th percentile stretches well past the largest detect', near(percentile(ros(obs).values, 0.95), 1.5342, 1e-3));
  // Vanadium: 85 of 120 below the limit, so Kaplan-Meier must refuse a median instead of inventing one.
  const lod = 0.02;
  const v = [...Array(85).fill(null).map(() => ({ v: lod, nd: true })), ...Array(35).fill(null).map((_, i) => ({ v: lod * (1.2 + i * 0.4), nd: false }))];
  const kv = kaplanMeier(v);
  check('non-detects: no Kaplan-Meier median when 71 % of the mass is below the limit', Number.isNaN(kv.q(0.5)) && near(kv.leftover, 85 / 120, 1e-9));
  // The log-normal consistency check of step 1: the paper's barium median and 95th percentile put 26.9 % below 0.124.
  const mu = Math.log(0.193), s = Math.log(0.629 / 0.193) / normInv(0.95);
  check('non-detects: barium median and 95th percentile imply 26.9 % censored', near(s, 0.7182652, 1e-6) && Math.abs(100 * normCdf((Math.log(0.124) - mu) / s) - 26.89) < 0.05);
};

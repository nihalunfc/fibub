// #471 Bland-Altman: every number checked against numpy/scipy (scipy.stats.nct for the exact limits,
// linregress for proportional bias) and Lin's CCC by the epiR/DescTools formula, in tests/sci-tools/bland-altman.ref.json
// (made by /tmp/claude-0/a4/ba_ref.py; the example data are the made-up pairs the page shows).
import { readFileSync } from 'node:fs';
import { blandAltman, lin } from '../../src/lib/sci/blandaltman.ts';
import { nctCdf, nctInv } from '../../src/lib/sci/nct.ts';

export default async (check) => {
  const R = JSON.parse(readFileSync(new URL('./bland-altman.ref.json', import.meta.url), 'utf8'));
  const near = (a, b, tol) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  const EX = `9.5 10.3 4.2 4.4 5.7 6.0 17.8 16.9 13.8 14.3 8.4 7.9 14.0 13.9 16.2 15.3 13.9 12.7 9.3 8.3 16.0 15.1 16.4 16.9 10.6 10.2 13.5 12.1 13.3 12.6 6.8 6.0 15.2 14.5 6.2 5.7 13.2 12.3 8.3 8.4 12.5 13.1 12.0 11.3 18.3 16.7 8.2 8.1 8.2 8.8 18.0 16.9 6.3 5.7 15.6 15.0 18.0 17.5 17.7 16.9`.split(' ').map(Number);
  const a = EX.filter((_, i) => i % 2 === 0), b = EX.filter((_, i) => i % 2 === 1);
  const same = (name, got, ref, tol = 1e-6) => {
    const keys = ['bias', 'sd', 'lower', 'upper', 'slope', 'intercept', 'slopeSe', 'slopeP', 'r2'];
    const bad = keys.filter((k) => !near(got[k], ref[k], tol));
    for (const k of ['biasCi', 'lowerCi', 'upperCi', 'slopeCi']) for (const i of [0, 1]) if (!near(got[k][i], ref[k][i], tol)) bad.push(`${k}[${i}] ${got[k][i]} vs ${ref[k][i]}`);
    check(`${name} ${bad.join(', ')}`, bad.length === 0);
  };
  for (const scale of ['diff', 'percent', 'ratio']) for (const ci of ['exact', 'approx']) same(`bland-altman: example ${scale} ${ci} = scipy`, blandAltman(a, b, { scale, ci }), R[`${scale}-${ci}`]);
  same('bland-altman: x = method B, 90 % CIs = scipy', blandAltman(a, b, { x: 'b', conf: 0.9 }), R['b-x']);
  const ex = blandAltman(a, b);
  check('bland-altman: example bias 0.443, limits −0.813 to 1.700', ex.bias.toFixed(3) === '0.443' && ex.lower.toFixed(3) === '-0.813' && ex.upper.toFixed(3) === '1.700');
  check('bland-altman: example proportional bias p = 0.054', ex.slopeP.toFixed(3) === '0.054');
  check('bland-altman: no pair outside the limits in the example (numpy)', ex.outside === 0);
  const c = lin(a, b);
  check('bland-altman: Lin CCC 0.9825 (0.9656 to 0.9911) = epiR formula', near(c.ccc, R.ccc.ccc, 1e-9) && near(c.ci[0], R.ccc.ci[0], 1e-9) && near(c.ci[1], R.ccc.ci[1], 1e-9) && near(c.r, R.ccc.r, 1e-9) && near(c.cb, R.ccc.cb, 1e-9));
  R.cases.forEach((k, i) => {
    same(`bland-altman: random case ${i + 1} (n ${k.a.length}) differences exact`, blandAltman(k.a, k.b, { conf: k.conf, loa: k.loa }), k.ex);
    same(`bland-altman: random case ${i + 1} percent approx`, blandAltman(k.a, k.b, { scale: 'percent', ci: 'approx', conf: k.conf, loa: k.loa }), k.ap);
    same(`bland-altman: random case ${i + 1} ratio exact`, blandAltman(k.a, k.b, { scale: 'ratio', conf: k.conf, loa: k.loa }), k.rt);
    const cc = lin(k.a, k.b, k.conf);
    check(`bland-altman: random case ${i + 1} CCC`, near(cc.ccc, k.ccc.ccc, 1e-9) && near(cc.ci[0], k.ccc.ci[0], 1e-9) && near(cc.ci[1], k.ccc.ci[1], 1e-9));
  });
  // Noncentral t against scipy.stats.nct (values from scipy 1.x).
  check('nct: cdf(2, 5, 1) = 0.778075 (scipy)', near(nctCdf(2, 5, 1), 0.7780746626, 1e-7));
  check('nct: cdf(-1, 1, 0.5) = scipy', near(nctCdf(-1, 1, 0.5), 0.13092587339173373, 1e-7));
  check('nct: ppf(0.95, 29, 10.735) = scipy', near(nctInv(0.95, 29, 1.959963984540054 * Math.sqrt(30)), 14.28648789819735, 1e-7));
  { const r = blandAltman([10.2, 11.5, 9.1], [10.0, 11.9, 8.6]); check('bland-altman: n = 3 (2 df) exact limit CIs = scipy', near(r.lowerCi[0], -5.773119412440561, 1e-6) && near(r.lowerCi[1], -0.22657590327425375, 1e-6) && near(r.upperCi[0], 0.42657590327425304, 1e-6) && near(r.upperCi[1], 5.97311941244056, 1e-6)); }
  check('bland-altman: perfect agreement gives zero limits', blandAltman([1, 2, 3, 4], [1, 2, 3, 4]).upper === 0);
  let msg = ''; try { blandAltman([1, 2], [1, 2]); } catch (e) { msg = e.message; } check('bland-altman: too few pairs message', msg.includes('at least 3'));
  msg = ''; try { blandAltman([1, -2, 3], [1, 2, 3], { scale: 'ratio' }); } catch (e) { msg = e.message; } check('bland-altman: ratio needs positive values', msg.includes('above zero'));
};

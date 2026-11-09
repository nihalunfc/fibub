// #622 resistor colour code. Band meanings from IEC 60062; E-series from the E24 list and 10^(i/n) to 3 figures
// (IEC 60063, E192 with 9.20). Divider pairs checked against a brute-force NumPy/itertools search of every E24 pair.
import * as R from '../../src/lib/sci/eng-resistor.ts';
export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t;
  { const d = R.decode(['yellow', 'violet', 'red', 'gold']); check('resistor: yellow violet red gold = 4.7 kΩ ±5 %', d.ohms === 4700 && d.tol === 5); }
  { const d = R.decode(['brown', 'black', 'black', 'orange', 'brown', 'red']); check('resistor: 6-band 100 kΩ ±1 % 50 ppm/K', d.ohms === 100000 && d.tol === 1 && d.tc === 50); }
  { const d = R.decode(['red', 'red', 'black', 'silver', 'green']); check('resistor: 5-band with silver multiplier = 2.2 Ω ±0.5 %', d.ohms === 2.2 && d.tol === 0.5); }
  check('resistor: 3-band means ±20 %', R.decode(['brown', 'black', 'red']).tol === 20 && R.decode(['brown', 'black', 'red']).ohms === 1000);
  { let m = ''; try { R.decode(['gold', 'black', 'red', 'gold']); } catch (e) { m = e.message; } check('resistor: gold is not a digit', m.includes('gold')); }
  { const e = R.encode(4700, 2); check('resistor: 4.7 kΩ to bands', e.digits.join() === 'yellow,violet' && e.mult === 'red' && e.exact); }
  { const e = R.encode(0.47, 2); check('resistor: 0.47 Ω uses silver', e.mult === 'silver' && e.exact); }
  { const e = R.encode(12345, 3); check('resistor: 12345 Ω rounds to 12.3 kΩ in 3 digits', e.value === 12300 && !e.exact && e.mult === 'red'); }
  { const e = R.encode(1e6, 3); check('resistor: 1 MΩ 5-band', e.digits.join() === 'brown,black,black' && e.mult === 'yellow'); }
  for (const v of [1, 10, 33, 470, 1500, 22000, 680000, 4.7e6, 0.1, 0.022]) { const e = R.encode(v, 2); const d = R.decode([...e.digits, e.mult, 'gold']); check(`resistor: ${v} Ω round trip`, near(d.ohms, v, v * 1e-9)); }
  check('resistor: series lengths', [3, 6, 12, 24, 48, 96, 192].every((n) => R.series(n).length === n));
  check('resistor: E12 list', R.series(12).join(' ') === '1 1.2 1.5 1.8 2.2 2.7 3.3 3.9 4.7 5.6 6.8 8.2');
  check('resistor: E96 starts and ends', R.series(96).slice(0, 5).join(' ') === '1 1.02 1.05 1.07 1.1' && R.series(96).slice(-3).join(' ') === '9.31 9.53 9.76');
  check('resistor: E192 sum vs NumPy (with 9.20)', near(R.series(192).reduce((a, b) => a + b, 0), 745.99, 1e-6) && R.series(192).includes(9.2) && !R.series(192).includes(9.19));
  { const n = R.nearest(5000, 24); check('resistor: nearest E24 to 5 kΩ', n.below === 4700 && n.above === 5100 && n.best === 5100 && near(n.err, 2, 1e-9)); }
  { const n = R.nearest(5000, 96); check('resistor: nearest E96 to 5 kΩ', n.best === 4990); }
  check('resistor: in series', R.inSeries(4700, 12) && !R.inSeries(5100, 12) && R.inSeries(5100, 24) && R.inSeries(49.9, 96));
  { const p = R.divider(12, 3.3, 24, 1e3, 1e5); check('resistor: best E24 divider 12 → 3.3 V vs brute force', p[0].r2 === 910 && (p[0].r1 === 2400 || p[0].r1 === 24000) && near(p[0].vout, 3.299093655589124, 1e-12) && p[1].r1 % 18 === 0 && near(p[1].vout, 3.2903225806451615, 1e-12)); }
  { const p = R.divider(12, 3.3, 24, 1e3, 1e5, 10e3); check('resistor: divider with a 10 kΩ load vs brute force', p[0].r1 === 2200 && p[0].r2 === 910 && near(p[0].vout, 3.2988943266267903, 1e-12) && p[1].r1 === 5100 && p[1].r2 === 2400); }
  { const p = R.divider(10, 5, 24, 1e3, 1e5)[0]; check('resistor: 2:1 divider exact, power and worst case', p.r1 === p.r2 && p.err === 0 && near(p.p1, p.i * p.i * p.r1, 1e-15) && p.lo < 5 && p.hi > 5 && near(p.lo, 10 * 0.95 / (0.95 + 1.05), 1e-12)); }
  check('resistor: ohm text', R.ohmText(4700) === '4.7 kΩ' && R.ohmText(1e6) === '1 MΩ' && R.ohmText(0.47) === '0.47 Ω');
};

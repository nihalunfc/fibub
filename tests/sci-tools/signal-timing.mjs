// #684 Signal timing (Webster's method). Built from eng-i's tested draft, reviewed and re-checked by e1 against
// its own NumPy script (same delays to 1e-8, plus queues). Checked against a hand-worked made-up example (Y = 1/3 + 9/32, L = 8 s,
// C0 = 17 / (1 − Y) = 44.108 s) and an independent NumPy evaluation of Webster's delay formula for every approach.
import * as W from '../../src/lib/sci/eng-webster.ts';

export default async (check) => {
  const near = (a, b, tol = 1e-9) => Number.isFinite(a) && Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  const apps = [{ name: 'North', phase: 1, q: 600, s: 1800 }, { name: 'South', phase: 1, q: 500, s: 1800 }, { name: 'East', phase: 2, q: 450, s: 1600 }, { name: 'West', phase: 2, q: 400, s: 1600 }];
  const lost = { 1: 4, 2: 4 }, inter = { 1: 4, 2: 4 };
  const r = W.webster(apps, lost, inter, {});
  check('signal: Y and the critical approaches by hand', near(r.Y, 1 / 3 + 9 / 32) && r.P[0].crit === 'North' && r.P[1].crit === 'East' && r.L === 8);
  check('signal: optimum cycle C0 = (1.5L + 5)/(1 − Y) by hand', near(r.C0, 17 / (1 - (1 / 3 + 9 / 32))) && near(r.C0, 44.1081081081081));
  check('signal: minimum cycle L/(1 − Y)', near(r.cMinX, 8 / (1 - (1 / 3 + 9 / 32))));
  check('signal: green split in proportion to y', near(r.P[0].g, 19.584058634906086) && near(r.P[1].g, 16.524049473202012) && near(r.P[0].g + r.P[1].g + r.L, r.C));
  check('signal: degree of saturation of the critical approaches = YC/(C − L)', near(r.A[0].x, r.X) && near(r.A[2].x, r.X) && near(r.X, 0.7507485029940119));
  check('signal: Webster delay per approach (NumPy)', [14.74857114, 12.02033521, 18.01894144, 15.44979723].every((d, i) => near(r.A[i].d, d, 1e-8)) && near(r.dAvg, 14.947565552932014));
  const r5 = W.webster(apps, lost, inter, { round: 5 });
  check('signal: cycle rounded up to 45 s', r5.C === 45 && near(r5.P[0].g, 20.06779661016949) && [14.76862621, 12.10317493, 18.03998035, 15.54436339].every((d, i) => near(r5.A[i].d, d, 1e-8)) && near(r5.dAvg, 14.99923061715215));
  check('signal: queue at the end of red q·r and back of queue q·r/(1 − y) (NumPy)', [[4.087341578867002, 6.131012368300502], [3.4061179823891687, 4.716163360231157], [3.4480073293632607, 4.797227588679319], [3.0648954038784537, 4.086527205171271]].every(([a, b], i) => near(r.A[i].qRed, a) && near(r.A[i].qMax, b)));
  check('signal: capacity s·g/C', near(r.A[0].cap, 1800 * r.P[0].g / r.C));
  { const rc = W.webster(apps, lost, inter, { cMin: 60 }); check('signal: shortest cycle limit', rc.C === 60 && rc.note.includes('shortest')); }
  { const rc = W.webster(apps, lost, { 1: 5, 2: 3 }, { cycle: 60 }); check('signal: displayed green G = g + l − intergreen', near(rc.P[0].G, rc.P[0].g - 1) && near(rc.P[1].G, rc.P[1].g + 1) && rc.C === 60); }
  // Webster's C0 is close to the true minimum of his delay formula (within about 3 %).
  { const Cs = Array.from({ length: 200 }, (_, i) => 22 + i * 0.5), d = W.delayCurve(apps, lost, inter, Cs), m = Math.min(...d.filter(Number.isFinite));
    check('signal: delay at C0 within 3 % of the minimum over cycle length', r.dAvg <= m * 1.03); }
  { const over = W.webster([{ name: 'A', phase: 1, q: 1200, s: 1800 }, { name: 'B', phase: 2, q: 700, s: 1800 }], lost, inter, {}); check('signal: Y ≥ 1 gives no cycle', !Number.isFinite(over.C0)); }
  check('signal: oversaturated approach has infinite delay', !Number.isFinite(W.websterDelay(60, 20, 700, 1800).d));
  let threw = false; try { W.webster([{ name: 'A', phase: 1, q: 100, s: 1800 }], lost, inter); } catch { threw = true; }
  check('signal: one phase throws', threw);
};

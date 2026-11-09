// #350 Calcium imaging ΔF/F: checked against an independent NumPy 2.5 calculation (np.percentile over each clipped
// window, np.median, np.std(ddof=1), run finding with np.argmax).
import * as D from '../../src/lib/sci/dff.ts';
export default async (check) => {
  const rel = (a, b, t = 1e-12) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  const ex = D.exampleCalcium();
  const fc = D.subtractNeuropil(ex.F[2], ex.N[2], 0.7), b = D.slidingPercentile(fc, 600, 8), d = D.deltaF(fc, b);
  check('dff: sliding 8th percentile, 600-frame window = numpy (ends and middle)', [[0, 188.20388436492402], [1, 188.22273626071774], [299, 183.0070516006246], [300, 182.9838588121391], [600, 172.25625650210037], [1199, 163.30959669468285]].every(([i, v]) => rel(b[i], v)));
  check('dff: ΔF/F = numpy', [[10, 0.10337050851450806], [500, 0.4685346180890174], [1100, 0.10447126989112948]].every(([i, v]) => rel(d[i], v)));
  check('dff: first-100-frame mean and whole-trace 10th percentile = numpy', rel(D.baseline(fc, { method: 'first', n: 100 })[5], 226.4387364205113) && rel(D.baseline(fc, { method: 'whole', p: 10 })[5], 168.53761897164478));
  const nr = D.noise(d, true), ns = D.noise(d, false);
  check('dff: robust noise (1.4826 MAD) and sample SD = numpy', rel(nr.centre, 0.05378227043131216) && rel(nr.sigma, 0.038197323351023785) && rel(ns.centre, 0.11316944733706161) && rel(ns.sigma, 0.17624956849320098));
  const ev = D.detectEvents(d, 3, 3, true);
  check('dff: 8 events (onset, peak, end) = numpy run finding', ev.events.length === 8 && JSON.stringify(ev.events.slice(0, 3).map((e) => [e.onset, e.peak, e.end])) === '[[71,78,101],[290,290,300],[328,328,355]]');
  check('dff: every detected onset within 2 frames of a true (made-up) transient', ev.events.every((e) => ex.truth[2].some((t) => Math.abs(t - e.onset) <= 2)));
  check('dff: small windows = numpy (median of 3, 25th percentile of 4)', D.slidingPercentile([5, 1, 4, 2, 3, 9, 0], 3, 50).join() === '3,4,2,3,3,3,4.5' && D.slidingPercentile([5, 1, 4, 2, 3, 9, 0], 4, 25).join() === '2.5,1.75,2,2,2,1.5,1.5');
  // A constant trace has ΔF/F 0; a step to 1.5 F0 gives 0.5.
  { const x = Array.from({ length: 50 }, (_, i) => (i < 40 ? 100 : 150)); const dd = D.deltaF(x, D.baseline(x, { method: 'first', n: 20 })); check('dff: step to 1.5 × F0 gives ΔF/F 0.5', dd[0] === 0 && dd[45] === 0.5); }
  check('dff: neuropil subtraction F − 0.7 Fneu', D.subtractNeuropil([100], [50], 0.7)[0] === 65);
  check('dff: events shorter than the minimum are dropped', D.detectEvents([0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0.1, -0.1], 3, 2, false).events.length === 0 && D.detectEvents([0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0.1, -0.1], 3, 1, false).events.length === 1 && D.detectEvents([0, 0.01, -0.01, 0, 5, 0, 0.01, 0, -0.01, 0, 0.01, -0.01], 3, 1, true).events.length === 1);
};

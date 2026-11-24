// #129 well field drawdown: the Theis superposition behind the tool, pinned to the worked numbers of the blog article
// tuoshan-karst-mine-drawdown-funnel-theis-recheck (a mine pumping 4800 m³/day in karstified dolomite).
// The broader checks on wellfield.ts (superposition, image wells, contours, capture zone) live in tests/sci.mjs.
import { drawdown } from '../../src/lib/sci/wellfield.ts';

const near = (a, b, tol) => Math.abs(a - b) <= tol;

export default async (check) => {
  const WELLS = [{ name: 'mine', x: 0, y: 0, Q: 4800, t0: 0 }], RW = 10;
  const s = (r, t, T, S) => drawdown(r, 0, t, WELLS, T, S, RW);

  check('well field: Tuoshan article, 745 m²/day and S = 1 give 4.47 m at 10 m and 0.428 m at 600 m after a year',
    near(s(RW, 365, 745, 1), 4.47, 0.005) && near(s(600, 365, 745, 1), 0.428, 0.0005));
  check('well field: Tuoshan article, one week is 2.44 m and five years 5.29 m',
    near(s(RW, 7, 745, 1), 2.44, 0.005) && near(s(RW, 1825, 745, 1), 5.29, 0.005));
  // The drawdown difference between two radii tends to Q/(2πT)·ln(r2/r1) as u gets small, with no storage in it.
  { const lim = (4800 * Math.log(60)) / (2 * Math.PI * 744.7), diff = (S) => s(RW, 365, 744.7, S) - s(600, 365, 744.7, S);
    check('well field: Tuoshan article, the funnel shape fixes T with no storage left in it', near(lim, 4.2001, 1e-3)
      && near(diff(0.002), lim, 1e-3) && near(diff(0.02), lim, 5e-3) && near(diff(1), lim, 0.17) && diff(1) < diff(0.2) && diff(0.2) < diff(0.02)); }
  // The paper's own conductivity (0.042 m/s over 50 m) gives centimetres, not metres.
  check('well field: Tuoshan article, 1.814e5 m²/day gives only 0.038 m at the mine after a year',
    near(s(RW, 365, 0.042 * 50 * 86400, 0.02), 0.0382, 0.0002));
  // The one-week share of the one-year drawdown grows as storage falls, so S = 1 is the slowest Theis can be.
  { const share = (S) => s(RW, 7, 744.7, S) / s(RW, 365, 744.7, S);
    check('well field: Tuoshan article, the first week takes a bigger share as storage falls',
      near(share(1), 0.547, 0.001) && near(share(0.02), 0.687, 0.001) && share(1) < share(0.2) && share(0.2) < share(0.02) && share(0.02) < share(0.002)); }
};

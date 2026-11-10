// #1253 Area of a circle by slicing. Row width × height checked against the inscribed n-gon area (n/2)·r²·sin(2π/n)
// (Python: n = 8 → 138.5929 for r = 7, n = 64 → 153.6909, n = 200 → 153.9127), the limit πr², and the row layout:
// the slices' chord ends meet with no gaps.
import { chord, rowWidth, rowHeight, rowArea, circleArea, pose } from '../../src/lib/sci/circle-slices.ts';

export default async (check) => {
  const near = (x, y, t = 1e-9) => Math.abs(x - y) <= t * Math.max(1, Math.abs(y));
  check('n = 8, r = 7: 138.5929 (Python)', near(rowArea(8, 7), 138.5929291125633));
  check('n = 64, r = 7: 153.6909 (Python)', near(rowArea(64, 7), 153.69087603675104));
  check('n = 200 within 0.02% of πr²', Math.abs(rowArea(200, 7) / circleArea(7) - 1) < 2e-4);
  check('area = (n/2)·r²·sin(2π/n) for n = 4 … 200', Array.from({ length: 99 }, (_, k) => 4 + 2 * k).every((n) => near(rowArea(n, 3.3), (n / 2) * 3.3 * 3.3 * Math.sin((2 * Math.PI) / n))));
  check('width tends to πr, height to r', near(rowWidth(2000, 5), Math.PI * 5, 1e-5) && near(rowHeight(2000, 5), 5, 1e-5));
  // Layout: in the row (t = 1) the up slices' tips sit where the down slices' chord ends meet.
  let ok = true;
  for (const n of [4, 8, 16, 30]) {
    const r = 50, a = (2 * Math.PI) / n, ends = (p) => [p.dir - a / 2, p.dir + a / 2].map((d) => [p.x + r * Math.cos(d), p.y + r * Math.sin(d)]);
    for (let i = n / 2; i < n; i++) {
      const p = pose(i, n, r, 1, 0, 0, 0, 0), [e1, e2] = ends(p), u1 = pose(i - n / 2, n, r, 1, 0, 0, 0, 0);
      if (!near(e1[1], 0, 1e-9) && !near(e2[1], 0, 1e-9)) ok = false;
      if (!(near(Math.min(e1[0], e2[0]), u1.x, 1e-9))) ok = false;
    }
    const p0 = pose(0, n, r, 0, 10, 20, 0, 0);
    if (p0.x !== 10 || p0.y !== 20 || !near(p0.dir, -a / 2)) ok = false;
  }
  check('row layout: chord ends of down slices meet the up slices\' tips; t = 0 is the circle', ok);
  check('chord(8, 7) ≈ 5.3576', near(chord(8, 7), 5.357568053111257));
};

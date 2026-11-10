// #1251 Shear and area. Formula areas checked against the shoelace area of the drawn corners for 2 000 random
// shapes (also done in Python with the same corner formulas), and the cut-and-slide pieces checked to add up.
import { corners, polyArea, formulaArea, cutSlide, copyFor } from '../../src/lib/sci/area-shear.ts';

export default async (check) => {
  const near = (x, y) => Math.abs(x - y) < 1e-9 * Math.max(1, Math.abs(y));
  let ok = true, cut = true, cp = true;
  for (let i = 0; i < 2000; i++) {
    const b = 0.5 + Math.random() * 10, h = 0.5 + Math.random() * 7, s = Math.random() * 16 - 6, a = 0.5 + Math.random() * 10;
    for (const sh of ['para', 'tri', 'trap']) {
      if (!near(polyArea(corners(sh, b, h, s, a)), formulaArea(sh, b, h, a))) ok = false;
      if (sh !== 'para' && !near(polyArea(copyFor(sh, b, h, s, a)), formulaArea(sh, b, h, a))) cp = false;
    }
    const c = cutSlide(b, h, s, 1);
    if (Math.abs(s) <= b) {
      const total = polyArea(c.rest) + polyArea(c.piece);
      const xs = [...c.rest, ...c.piece].map((p) => p[0]);
      if (!near(total, b * h) || !near(Math.max(...xs) - Math.min(...xs), b)) cut = false;
    } else if (c !== null) cut = false;
  }
  check('2000 shapes: formula = shoelace area of the corners', ok);
  check('turned copies have the same area', cp);
  check('cut and slide: pieces fill a b × h rectangle (or null when the top slides past b)', cut);
  check('example 6 × 4 → 24; trapezium 3, 6, 4 → 18; triangle ½ × 6 × 4 → 12', formulaArea('para', 6, 4) === 24 && formulaArea('trap', 6, 4, 3) === 18 && formulaArea('tri', 6, 4) === 12);
};

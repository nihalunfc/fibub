// #1248 Fractal builder. Checked by measuring the drawn shapes directly (shoelace area and summed side lengths)
// against the formulas, and against the known limit (snowflake area 8/5 of the first triangle).
import { koch, kochStats, sierpinski, sierpinskiStats, polygonMeasure, triArea } from '../../src/lib/sci/fractal-builder.ts';

const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
export default async (check) => {
  let ok = true;
  for (let n = 0; n <= 5; n++) {
    const pts = koch(n, 3), m = polygonMeasure(pts), s = kochStats(n, 3);
    if (pts.length !== s.sides || !near(m.perimeter, s.perimeter) || !near(m.area, s.area)) ok = false;
  }
  check('Koch levels 0–5: drawn corners, perimeter and area match the formulas', ok);
  check('Koch step 1 is a star of David outline: 12 sides, perimeter 4, area 4/3 of the triangle', kochStats(1).sides === 12 && near(kochStats(1).perimeter, 4) && near(kochStats(1).area / triArea(1), 4 / 3));
  check('Koch perimeter × 4/3 each step; area stays below 8/5', near(kochStats(6).perimeter, 3 * (4 / 3) ** 6) && kochStats(30).area < kochStats(30).limitArea && near(kochStats(60).area, kochStats(60).limitArea, 1e-12));
  let ok2 = true;
  for (let n = 0; n <= 6; n++) {
    const t = sierpinski(n, 2), s = sierpinskiStats(n, 2);
    const area = t.reduce((a, x) => a + triArea(x.s), 0), per = t.reduce((a, x) => a + 3 * x.s, 0);
    if (t.length !== s.count || !near(area, s.area) || !near(per, s.perimeter)) ok2 = false;
  }
  check('Sierpinski levels 0–6: triangle count, area and perimeter of the drawn triangles match', ok2);
  check('Sierpinski: 27 triangles at step 3, area (3/4)³ = 0.421875 of the start', sierpinskiStats(3).count === 27 && near(sierpinskiStats(3).area / triArea(1), 0.421875));
};

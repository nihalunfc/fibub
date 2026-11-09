// #1164 Heron's formula. Checked against Python math.sqrt(s(s−a)(s−b)(s−c)) for ten triangles with whole-number
// areas (13-14-15 → 84, 5-12-13 → 30, 9-10-17 → 36, ...), against ½ × base × height from the placed corners, and
// for a very thin triangle where the plain formula loses digits.
import { heron, valid, kind, place, heightOn } from '../../src/lib/sci/heron-school.ts';

export default async (check) => {
  const near = (x, y, t = 1e-9) => Math.abs(x - y) <= t * Math.max(1, Math.abs(y));
  const PY = [[13, 14, 15, 84], [5, 12, 13, 30], [9, 10, 17, 36], [7, 15, 20, 42], [10, 17, 21, 84], [6, 25, 29, 60], [3, 4, 5, 6], [5, 5, 6, 12], [5, 5, 8, 12], [4, 13, 15, 24]];
  check('ten triangles match Python', PY.every(([a, b, c, A]) => near(heron(a, b, c).area, A)));
  check('s for 13-14-15 is 21; product 7056', heron(13, 14, 15).s === 21 && heron(13, 14, 15).product === 7056);
  check('equilateral side 6: 9√3', near(heron(6, 6, 6).area, 9 * Math.sqrt(3)));
  check('not a triangle: 2, 3, 6 and 1, 2, 3', !valid(2, 3, 6) && !valid(1, 2, 3) && Number.isNaN(heron(2, 3, 6).area) && valid(2, 3, 4));
  check('kinds', kind(5, 5, 5).bySides === 'equilateral' && kind(5, 5, 8).bySides === 'isosceles' && kind(5, 5, 8).byAngles === 'obtuse' && kind(3, 4, 5).byAngles === 'right' && kind(13, 14, 15).byAngles === 'acute' && kind(13, 14, 15).bySides === 'scalene');
  // Thin triangle: 1e6, 1e6, 1e-3 has area ≈ 0.5 × 1e-3 × 1e6 = 500 (height ≈ 1e6).
  check('thin triangle stays accurate', near(heron(1e6, 1e6, 1e-3).area, 500, 1e-6));
  let ok = true;
  for (let i = 0; i < 300; i++) {
    const a = 1 + Math.random() * 20, b = 1 + Math.random() * 20, c = Math.abs(a - b) + 0.01 + Math.random() * (a + b - Math.abs(a - b) - 0.02);
    const H = heron(a, b, c), [A, B, C] = place(a, b, c);
    if (!near(Math.hypot(C[0] - B[0], C[1] - B[1]), a, 1e-7) || !near(Math.hypot(C[0], C[1]), b, 1e-7) || !near(0.5 * c * C[1], H.area, 1e-7) || !near(heightOn(c, H.area), C[1], 1e-7)) ok = false;
  }
  check('300 random triangles: placed corners have the right sides, and ½ × base × height = Heron', ok);
};

// #1238 Polygon angle sum. Checked against hand-worked shapes (square 4 × 90°; the arrowhead (0,0) (4,0) (4,4)
// (2,1) (0,4) has angles 90, 90, 33.69, 292.62, 33.69 = 540°, matching atan2 by hand: 2·atan(2/3) = 67.38°, so the
// reflex corner is 360 − 67.38 = 292.62°), and on 500 random star-shaped polygons: angles add to (n − 2) × 180,
// exterior angles to 360, and the n − 2 triangles cover exactly the polygon's area (shoelace).
import { isSimple, interiorAngles, exteriorAngles, triangulate, regular, angleSum, signedArea } from '../../src/lib/sci/polygon-j4.ts';

export default async (check) => {
  const sq = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }];
  check('polygon: square has four 90° angles and 2 triangles', interiorAngles(sq).every((a) => Math.abs(a - 90) < 1e-9) && triangulate(sq).length === 2);
  const arrow = [{ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 4, y: 4 }, { x: 2, y: 1 }, { x: 0, y: 4 }];
  const aa = interiorAngles(arrow);
  check('polygon: arrowhead angles 90, 90, 33.69, 292.62, 33.69', [90, 90, 33.690, 292.620, 33.690].every((v, i) => Math.abs(aa[i] - v) < 0.001));
  check('polygon: arrowhead the other way round gives the same angles', interiorAngles([...arrow].reverse()).reverse().every((a, i) => Math.abs(a - aa[i]) < 1e-9));
  check('polygon: bow-tie and flat shapes are not simple', !isSimple([{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 0 }, { x: 0, y: 1 }]) && !isSimple([{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }]) && isSimple(arrow));
  check('polygon: regular heptagon angles 128.571°', interiorAngles(regular(7, 0, 0, 1)).every((a) => Math.abs(a - 900 / 7) < 1e-9) && angleSum(7) === 900);
  let ok = true, seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let k = 0; k < 500; k++) {
    const n = 3 + (k % 8), cuts = Array.from({ length: n }, () => rnd()).sort((a, b) => a - b);
    const p = cuts.map((c, i) => { const t = 2 * Math.PI * ((i + c) / n), r = 20 + rnd() * 100; return { x: r * Math.sin(t), y: r * Math.cos(t) }; });
    if (!isSimple(p)) continue;
    const s = interiorAngles(p).reduce((a, b) => a + b, 0), e = exteriorAngles(p).reduce((a, b) => a + b, 0), T = triangulate(p);
    const area = T.reduce((a, t) => a + Math.abs(signedArea(t.map((i) => p[i]))), 0);
    if (Math.abs(s - angleSum(n)) > 1e-6 || Math.abs(e - 360) > 1e-6 || T.length !== n - 2 || Math.abs(area - Math.abs(signedArea(p))) > 1e-6 * Math.abs(signedArea(p))) ok = false;
  }
  check('polygon: 500 random shapes: sums, n − 2 triangles, triangles cover the area', ok);
};

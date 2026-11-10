// #1284 Field area by triangles. The triangle split is checked to cover the shape exactly (sum of triangle areas =
// shoelace area, n − 2 triangles) for the presets and 300 random star-shaped (often non-convex) polygons; Heron and
// the coordinate formula agree; areas checked by hand (L-shape 30×8 + 12×14 = 408 m², trapezium ½(32 + 18) × 16 =
// 400 m²) and against an independent Python shoelace sum for the five-sided field (569 m²).
import { shoelace, perimeter, isSimple, triangulate, heron, coordArea, PRESETS } from '../../src/lib/sci/field-school.ts';

export default async (check) => {
  const near = (x, y, t = 1e-9) => Math.abs(x - y) <= t * Math.max(1, Math.abs(y));
  const byId = Object.fromEntries(PRESETS.map((p) => [p.id, p.p]));
  check('L-shape 408 m²', near(Math.abs(shoelace(byId.L)), 408));
  check('trapezium 400 m²', near(Math.abs(shoelace(byId.trap)), 400));
  check('five-sided field 569 m² (Python)', near(Math.abs(shoelace(byId.pent)), 569));
  check('L-shape perimeter 30+8+18+14+12+22 = 104', near(perimeter(byId.L), 104));
  const sumTri = (p) => triangulate(p).reduce((t, [a, b, c]) => t + heron(p[a], p[b], p[c]).area, 0);
  check('presets: triangles add up to the shoelace area', PRESETS.every(({ p }) => triangulate(p).length === p.length - 2 && near(sumTri(p), Math.abs(shoelace(p)), 1e-9)));
  check('heron = coordinate formula; 3-4-5 has area 6', near(heron([0, 0], [4, 0], [4, 3]).area, 6) && near(coordArea([0, 0], [4, 0], [4, 3]), 6) && PRESETS.every(({ p }) => triangulate(p).every(([a, b, c]) => near(heron(p[a], p[b], p[c]).area, coordArea(p[a], p[b], p[c]), 1e-9))));
  check('clockwise corners work too', near(sumTri([...byId.L].reverse()), 408));
  check('crossing sides are not simple', !isSimple([[0, 0], [10, 10], [10, 0], [0, 10]]) && isSimple(byId.L) && !isSimple([[0, 0], [1, 1]]) && !isSimple([[0, 0], [5, 0], [10, 0]]) && !isSimple([[0, 0], [5, 0], [5, 0], [0, 5]]));
  let ok = true, simple = 0;
  for (let k = 0; k < 300; k++) {
    const n = 4 + Math.floor(Math.random() * 6), p = [];
    for (let i = 0; i < n; i++) { const t = (2 * Math.PI * (i + 0.2 + 0.6 * Math.random())) / n, r = 3 + Math.random() * 12; p.push([Math.round(20 + r * Math.cos(t)), Math.round(15 + r * Math.sin(t))]); }
    if (!isSimple(p)) continue;
    simple++;
    const tr = triangulate(p);
    if (tr.length !== n - 2 || !near(sumTri(p), Math.abs(shoelace(p)), 1e-7)) ok = false;
  }
  check(`random polygons split correctly (${simple} simple ones tried)`, ok && simple > 100);
};

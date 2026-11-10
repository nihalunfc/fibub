// #1283 Field area. Checked against sympy Polygon.area: (0,0), (6,0), (8,4), (4,7), (1,5) → 77/2 = 38.5, perimeter
// 24.1767; a dented (non-convex) plot (0,0), (6,0), (6,6), (3,2), (0,6) → 24. Heron triangles add up to the same.
import { shoelace, perimeter, isSimple, triangulate, triangleAreas } from '../../src/lib/sci/fieldarea-school.ts';
export default async (check) => {
  const P = [[0, 0], [6, 0], [8, 4], [4, 7], [1, 5]], D = [[0, 0], [6, 0], [6, 6], [3, 2], [0, 6]];
  check('field: pentagon area 38.5, perimeter 24.1767 (sympy)', Math.abs(shoelace(P) - 38.5) < 1e-12 && Math.abs(perimeter(P) - 24.176706744056354) < 1e-9);
  const tP = triangleAreas(P);
  check('field: 3 Heron triangles add to 38.5', tP.length === 3 && Math.abs(tP.reduce((t, x) => t + x.area, 0) - 38.5) < 1e-9);
  const tD = triangleAreas(D);
  check('field: dented plot area 24 by shoelace and by 3 Heron triangles', Math.abs(shoelace(D) - 24) < 1e-12 && tD.length === 3 && Math.abs(tD.reduce((t, x) => t + x.area, 0) - 24) < 1e-9);
  check('field: a bow-tie is not a simple plot; a square is', !isSimple([[0, 0], [4, 4], [4, 0], [0, 4]]) && isSimple([[0, 0], [4, 0], [4, 4], [0, 4]]));
  check('field: clockwise or anticlockwise gives the same area', Math.abs(shoelace([...P].reverse()) - 38.5) < 1e-12 && triangulate([...D].reverse()).length === 3);
  let ok = true;
  for (let i = 0; i < 300; i++) {
    // Random star-shaped polygon (simple) with 4 to 8 corners.
    const n = 4 + Math.floor(Math.random() * 5), pts = [];
    for (let k = 0; k < n; k++) { const a = (2 * Math.PI * (k + 0.2 + 0.6 * Math.random())) / n, r = 2 + 6 * Math.random(); pts.push([r * Math.cos(a), r * Math.sin(a)]); }
    const tri = triangleAreas(pts);
    if (tri.length !== n - 2 || Math.abs(tri.reduce((t, x) => t + x.area, 0) - shoelace(pts)) > 1e-7 * Math.max(1, shoelace(pts))) ok = false;
  }
  check('field: 300 random plots (with dents): n − 2 triangles whose Heron areas add to the shoelace area', ok);
};

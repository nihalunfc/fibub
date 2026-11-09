// #555 Hyperbolic geometry drawer. Reference values from Python mpmath (30 digits, /home/user/pyenv):
// distances from arcosh(1 + 2|z−w|²/((1−|z|²)(1−|w|²))), triangle angles from the hyperbolic law of
// cosines (an independent route from the tool's, which uses isometries), circle centre and radius checked
// by sampling distances, tile measures from the closed forms for the right triangle of a regular polygon.
import { dist, segment, idealPoints, line, geodesicCircle, midpoint, angleAt, triangle, circle, reflect, mobius, hyperbolicPQ, tileMeasures, centralTile, tiling, moveTile, abs } from '../../src/lib/sci/hyperbolic.ts';

export default async (check) => {
  const near = (a, b, tol = 1e-12) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  const A = [-0.5, -0.2], B = [0.6, 0.1], C = [0.1, 0.6];
  check('hyperbolic: distance from the centre is 2 artanh r', near(dist([0, 0], [0.5, 0]), 1.0986122886681098));
  check('hyperbolic: distances match mpmath', near(dist(B, C), 1.93065131818125) && near(dist(C, A), 2.3842002402638073) && near(dist(A, B), 2.606498342705026));
  check('hyperbolic: nearby points near the edge stay accurate', near(dist([0.9, 0], [0.9000001, 0]), 1.0526170141964284e-6, 1e-8));
  { const t = triangle(A, B, C);
    check('hyperbolic: triangle angles match the law of cosines (mpmath)', near(t.angles[0], 0.37316413353876724) && near(t.angles[1], 0.6201239413327773) && near(t.angles[2], 0.8154553174714232));
    check('hyperbolic: triangle area π − angle sum', near(t.area, 1.3328492612468255)); }
  { const m = midpoint(A, B); check('hyperbolic: midpoint is halfway', near(dist(A, m), dist(A, B) / 2) && near(dist(m, B), dist(A, B) / 2)); }
  { const s = segment(A, B, 10); check('hyperbolic: segment points evenly spaced and on one geodesic', s.every((p, i) => i === 0 || near(dist(s[i - 1], p), dist(A, B) / 10, 1e-10)) && near(s[10][0], B[0])); }
  { const g = geodesicCircle(A, B), [p, q] = idealPoints(A, B);
    check('hyperbolic: geodesic circle meets the rim at right angles and passes through both points', near(abs(p), 1) && near(abs(q), 1) && near(g.r ** 2 + 1, g.c[0] ** 2 + g.c[1] ** 2) && near(Math.hypot(A[0] - g.c[0], A[1] - g.c[1]), g.r) && near(Math.hypot(B[0] - g.c[0], B[1] - g.c[1]), g.r)); }
  check('hyperbolic: geodesics through the centre are diameters', geodesicCircle([0, 0], [0.3, 0.4]) === null && geodesicCircle([-0.3, -0.4], [0.3, 0.4]) === null);
  { const L = line(A, C); check('hyperbolic: a whole line reaches the rim', abs(L[0]) > 0.999999 && abs(L[L.length - 1]) > 0.999999); }
  { const c = circle(C, 1);
    check('hyperbolic: circle centre and radius (mpmath)', near(c.centre[0], 0.08539196277425752) && near(c.centre[1], 0.5123517766455451) && near(c.r, 0.3161111202266677));
    const pts = Array.from({ length: 12 }, (_, k) => [c.centre[0] + c.r * Math.cos(k), c.centre[1] + c.r * Math.sin(k)]);
    check('hyperbolic: every point of the drawn circle is at distance 1', pts.every((p) => near(dist(C, p), 1, 1e-10)));
    check('hyperbolic: circumference 2π sinh ρ and area 4π sinh²(ρ/2)', near(c.circumference, 7.384006872882645) && near(c.area, 3.4122762652849023)); }
  check('hyperbolic: right angle where a diameter meets a geodesic', near(angleAt([0, 0], [0.5, 0], [0, 0.5]), Math.PI / 2));
  { const z = [0.2, 0.3], r1 = reflect(z, A, B), r2 = reflect(r1, A, B); check('hyperbolic: reflection is an isometry and an involution', near(r2[0], z[0], 1e-10) && near(r2[1], z[1], 1e-10) && near(dist(r1, A), dist(z, A), 1e-10) && near(reflect(A, A, B)[0], A[0])); }
  { const a = [0.3, -0.2]; check('hyperbolic: the disk isometry keeps distances', near(dist(mobius(a, A), mobius(a, B)), dist(A, B), 1e-11)); }
  // Tilings.
  check('hyperbolic: which {p,q} are hyperbolic', hyperbolicPQ(7, 3) && hyperbolicPQ(4, 5) && !hyperbolicPQ(4, 4) && !hyperbolicPQ(6, 3) && !hyperbolicPQ(3, 5));
  { const m = tileMeasures(7, 3); check('hyperbolic: {7,3} measures (mpmath)', near(m.circumradius, 0.6206717375563859) && near(m.side, 0.5662563067353148) && near(m.inradius, 0.5452748317535431) && near(m.area, Math.PI / 3)); }
  { const m = tileMeasures(4, 5); check('hyperbolic: {4,5} measures (mpmath)', near(m.circumradius, 0.8424820814620075) && near(m.side, 1.2537393258123556) && near(m.inradius, 0.5306375309525178) && near(m.area, 1.2566370614359173)); }
  for (const [p, q] of [[7, 3], [4, 5], [3, 7], [5, 4], [8, 3]]) {
    const t = centralTile(p, q), m = tileMeasures(p, q), all = tiling(t, 0.02, 600);
    const sideOk = all.every((T) => T.v.every((z, i) => near(dist(z, T.v[(i + 1) % p]), m.side, 1e-7)));
    const angOk = all.slice(0, 60).every((T) => T.v.every((z, i) => near(angleAt(z, T.v[(i + 1) % p], T.v[(i + p - 1) % p]), m.angle, 1e-7)));
    const first = all.filter((T) => T.gen === 1).length;
    const cs = new Set(all.map((T) => `${T.c[0].toFixed(5)},${T.c[1].toFixed(5)}`)).size;
    check(`hyperbolic: {${p},${q}} tiling: ${all.length} congruent tiles, ${p} neighbours, angles 2π/${q}, no repeats`, sideOk && angOk && first === p && cs === all.length && near(dist([0, 0], t.v[0]), m.circumradius));
  }
  { // Around each vertex of {7,3} exactly 3 tiles meet.
    const all = tiling(centralTile(7, 3), 0.02, 400), v = all[0].v[0];
    const meet = all.filter((T) => T.v.some((z) => Math.hypot(z[0] - v[0], z[1] - v[1]) < 1e-9)).length;
    check('hyperbolic: q = 3 tiles meet at each vertex', meet === 3); }
  { const t = moveTile(centralTile(5, 4), [0.3, 0.1]); check('hyperbolic: a moved tile keeps its size', near(dist(t.v[0], t.v[1]), tileMeasures(5, 4).side, 1e-10) && near(t.c[0], 0.3)); }
};

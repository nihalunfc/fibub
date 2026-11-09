// #554 Polyhedron and tiling viewer. Reference values: closed-form volumes of the Platonic and Archimedean
// solids for edge 1 (standard formulas, e.g. (125 + 43√5)/4 for the truncated icosahedron), and Python
// scipy.spatial.ConvexHull (/home/user/pyenv) on the tool's own vertices for every volume, surface area and
// face count, including the snub cube (7.8894774) and snub dodecahedron (37.61664996), which have no short closed form.
import { SOLIDS, build, measure, faceCounts, vertexConfig, dual, TILINGS, patch, polygonArea, interiorAngle, canonicalCycle } from '../../src/lib/sci/polyhedra.ts';

export default async (check) => {
  const near = (a, b, tol = 1e-8) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  const s2 = Math.SQRT2, s5 = Math.sqrt(5);
  const want = {
    tetrahedron: [4, 6, 4, '3.3.3', s2 / 12, 1.732050808], cube: [8, 12, 6, '4.4.4', 1, 6], octahedron: [6, 12, 8, '3.3.3.3', s2 / 3, 3.464101615],
    dodecahedron: [20, 30, 12, '5.5.5', (15 + 7 * s5) / 4, 20.645728807], icosahedron: [12, 30, 20, '3.3.3.3.3', (5 * (3 + s5)) / 12, 8.660254038],
    'truncated-tetrahedron': [12, 18, 8, '3.6.6', (23 * s2) / 12, 12.124355653], cuboctahedron: [12, 24, 14, '3.4.3.4', (5 * s2) / 3, 9.464101615],
    'truncated-cube': [24, 36, 14, '3.8.8', (21 + 14 * s2) / 3, 32.434664364], 'truncated-octahedron': [24, 36, 14, '4.6.6', 8 * s2, 26.784609691],
    rhombicuboctahedron: [24, 48, 26, '3.4.4.4', (12 + 10 * s2) / 3, 21.464101615], 'truncated-cuboctahedron': [48, 72, 26, '4.6.8', 22 + 14 * s2, 61.755172439],
    'snub-cube': [24, 60, 38, '3.3.3.3.4', 7.8894774, 19.856406461], icosidodecahedron: [30, 60, 32, '3.5.3.5', (45 + 17 * s5) / 6, 29.305982845],
    'truncated-dodecahedron': [60, 90, 32, '3.10.10', (5 * (99 + 47 * s5)) / 12, 100.990760153], 'truncated-icosahedron': [60, 90, 32, '5.6.6', (125 + 43 * s5) / 4, 72.607253034],
    rhombicosidodecahedron: [60, 120, 62, '3.4.5.4', (60 + 29 * s5) / 3, 59.305982845], 'truncated-icosidodecahedron': [120, 180, 62, '4.6.10', 5 * (19 + 10 * s5), 174.292030342],
    'snub-dodecahedron': [60, 150, 92, '3.3.3.3.5', 37.616649963, 55.286744958],
  };
  check('polyhedra: 5 Platonic and 13 Archimedean solids', SOLIDS.length === 18 && SOLIDS.filter((s) => s.family === 'Platonic').length === 5);
  for (const s of SOLIDS) {
    const p = build(s.id), m = measure(p), [V, E, F, cfg, vol, area] = want[s.id];
    const edgesOk = p.edges.every(([a, b]) => near(Math.hypot(...p.v[a].map((x, k) => x - p.v[b][k])), 1, 1e-9));
    const cfgs = new Set(p.v.map((_, i) => vertexConfig(p, i)));
    check(`polyhedra: ${s.name}: V ${V}, E ${E}, F ${F}, V − E + F = 2, every vertex ${cfg}, unit edges`, p.v.length === V && p.edges.length === E && p.f.length === F && V - E + F === 2 && cfgs.size === 1 && cfgs.has(cfg) && edgesOk);
    check(`polyhedra: ${s.name}: volume ${vol.toFixed(6)} and surface area (closed form / scipy ConvexHull)`, near(m.volume, vol, 1e-7) && near(m.area, area, 1e-8));
    const d = dual(p);
    check(`polyhedra: ${s.name}: dual has V ${F}, E ${E}, F ${V}`, d.v.length === F && d.edges.length === E && d.f.length === V);
  }
  { const d = dual(build('cube')), dc = faceCounts(d); check('polyhedra: the dual of the cube is an octahedron (8 triangles, 6 vertices of 4)', dc[3] === 8 && d.v.every((_, i) => vertexConfig(d, i) === '3.3.3.3')); }
  { const d = dual(build('cuboctahedron')); check('polyhedra: the dual of the cuboctahedron has 12 rhombic faces', faceCounts(d)[4] === 12); }
  { const p = build('cuboctahedron'), m = measure(p); check('polyhedra: cuboctahedron circumradius equals its edge', near(m.circumradius, 1, 1e-12) && near(m.midradius, Math.sqrt(3) / 2, 1e-12)); }
  { const fc = faceCounts(build('truncated-icosahedron')); check('polyhedra: truncated icosahedron (football) has 12 pentagons and 20 hexagons', fc[5] === 12 && fc[6] === 20); }
  check('polyhedra: cyclic configurations are written the smallest way', canonicalCycle([4, 3, 4, 3]) === '3.4.3.4' && canonicalCycle([12, 12, 3]) === '3.12.12' && canonicalCycle([4, 3, 3, 4, 3]) === '3.3.4.3.4');
  // Tilings: every vertex has the stated configuration, angles add to 360°, and the motif fills the cell exactly.
  check('polyhedra: 3 regular and 8 semi-regular tilings', TILINGS.length === 11 && TILINGS.filter((t) => t.kind === 'regular').length === 3);
  for (const t of TILINGS) {
    const polys = patch(t, -10, 10, -10, 10), key = (p) => `${Math.round(p[0] * 1e5)},${Math.round(p[1] * 1e5)}`, at = new Map();
    for (const P of polys) for (const v of P.p) { const k = key(v); if (!at.has(k)) at.set(k, { v, list: [] }); at.get(k).list.push(P); }
    let bad = 0, n = 0;
    for (const { v, list } of at.values()) {
      if (Math.hypot(v[0], v[1]) > 5) continue; n++;
      const ring = list.map((P) => { const c = P.p.reduce((s, q) => [s[0] + q[0] / P.n, s[1] + q[1] / P.n], [0, 0]); return [Math.atan2(c[1] - v[1], c[0] - v[0]), P.n]; }).sort((a, b) => a[0] - b[0]).map((r) => r[1]);
      if (canonicalCycle(ring) !== t.config || Math.abs(list.reduce((s, P) => s + interiorAngle(P.n), 0) - 360) > 1e-9) bad++;
    }
    const cell = Math.abs(t.a1[0] * t.a2[1] - t.a1[1] * t.a2[0]), filled = t.motif.reduce((s, m) => s + polygonArea(m.n), 0);
    check(`polyhedra: tiling ${t.config}: ${n} vertices all ${t.config}, motif fills the cell`, n > 20 && bad === 0 && near(cell, filled, 1e-12));
  }
};

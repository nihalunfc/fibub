// Checks for src/lib/learn/curr-geo.ts (plate boundaries, magnification, circle theorems, triangle congruence). node tests/curr-geo.mjs
import * as G from '../src/lib/learn/curr-geo.ts';
let n = 0, bad = 0;
const ok = (c, m) => { n++; if (!c) { bad++; console.error('FAIL: ' + m); } };
const near = (a, b, t, m) => ok(Math.abs(a - b) <= t, `${m}: got ${a}, want ${b}`);

// Plates: 2.5 cm/yr for 100 Myr = 2500 km; the Atlantic, 4500 km at 2.5 cm/yr, took 180 Myr
near(G.kmMoved(2.5, 100), 2500, 1e-9, 'distance');
near(G.myrToMove(4500, 2.5), 180, 1e-9, 'time');
near(G.rateFromMove(3000, 60), 5, 1e-9, 'rate');
near(G.slabDepthKm(100, 45), 100, 1e-9, 'slab depth 45');
near(G.slabDepthKm(100, 30), 57.735, 0.01, 'slab depth 30');
near(G.slabDepthKm(5000, 45), 700, 1e-9, 'slab depth cap');
near(G.volcanoOffsetKm(45), 100, 1e-9, 'volcano offset 45');
near(G.volcanoOffsetKm(30), 173.2, 0.1, 'volcano offset 30');
ok([0.5, 0.9, 1.0, 1.5, 1.8, 2.0, 2.6, 3.0].map(G.polarity).join() === '1,-1,1,-1,1,-1,1,1', 'polarity of known chrons');
near(G.floorAge(12.5, 2.5), 1, 1e-9, 'floor age');
ok(G.boundary('ridge').depth[1] < 20 && G.boundary('subduction').depth[1] === 700, 'depth bands');
ok(G.BOUNDARIES.length === 6, 'six boundary types');

// Microscope
ok(G.totalMag(40) === 400 && G.totalMag(100) === 1000, 'total magnification');
near(G.fieldOfViewMm(4), 4.5, 1e-9, 'fov x4'); near(G.fieldOfViewMm(100), 0.18, 1e-9, 'fov x100');
near(G.imageFieldMm(40), 180, 1e-9, 'image field 180 mm');
near(G.actualSize(25, 100), 0.25, 1e-9, 'actual size mm');
near(G.convert(250, 'um', 'mm'), 0.25, 1e-12, 'um to mm'); near(G.convert(0.2, 'um', 'nm'), 200, 1e-9, 'um to nm'); near(G.convert(1.5, 'mm', 'um'), 1500, 1e-9, 'mm to um');
near(G.calibrate(40, 10), 2.5, 1e-9, 'calibration 40 graticule = 10 stage divs'); // 100 um / 40
near(G.resolutionNm(550, 1.25), 268.4, 0.1, 'Abbe limit');
ok(G.isResolved(2) && !G.isResolved(0.1), 'resolved by light');
near(G.LIGHT_LIMIT_NM / G.ELECTRON_LIMIT_NM, 1000, 1e-9, 'electron 1000x better');

// Circle theorems
const P = G.onCircle(100), A = G.onCircle(200), B = G.onCircle(340);
{ const t = G.centreVsCircumference(A, B, P); near(t.centre, 2 * t.inscribed, 1e-9, 'centre = 2 x circumference'); near(t.inscribed, 70, 1e-9, 'inscribed 140/2'); }
{ const t = G.centreVsCircumference(A, B, G.onCircle(270)); near(t.centre, 2 * t.inscribed, 1e-9, 'centre theorem, minor arc'); near(t.centre, 220, 1e-9, 'reflex centre angle 220'); }
{ const a = G.angleAt(G.onCircle(100), A, B), b = G.angleAt(G.onCircle(30), A, B); near(a, b, 1e-9, 'same segment'); }
near(G.angleAt(G.onCircle(77), G.onCircle(0), G.onCircle(180)), 90, 1e-9, 'semicircle');
{ const q = G.cyclicQuad([10, 100, 190, 300]); near(q.sumAC, 180, 1e-9, 'cyclic quad AC'); near(q.sumBD, 180, 1e-9, 'cyclic quad BD'); near(q.angles.reduce((x, y) => x + y), 360, 1e-9, 'quad sum 360'); }
{ const T = G.onCircle(30); const X = G.tangentPoint(T, 1.7); near(G.angleAt(T, { x: 0, y: 0 }, X), 90, 1e-9, 'tangent perpendicular to radius'); }
{ const t = G.tangentsFrom({ x: 5, y: 0 }, 3); near(t.len1, 4, 1e-9, '3-4-5 tangent'); near(t.len2, 4, 1e-9, 'equal tangents'); near(t.length, 4, 1e-9, 'tangent length'); }
{ const s = G.alternateSegment(G.onCircle(0), G.onCircle(110), G.onCircle(250)); near(s.tangentChord, s.inscribed, 1e-9, 'alternate segment'); near(s.inscribed, 55, 1e-9, 'alternate 110/2'); const s2 = G.alternateSegment(G.onCircle(0), G.onCircle(110), G.onCircle(60)); near(s2.tangentChord, s2.inscribed, 1e-9, 'alternate segment other side'); }
{ const c = G.chordFoot(G.onCircle(30), G.onCircle(150)); near(c.foot.x, c.mid.x, 1e-9, 'foot is midpoint x'); near(c.foot.y, c.mid.y, 1e-9, 'foot is midpoint y'); }
near(G.halfChord(5, 3), 4, 1e-9, 'half chord 3-4-5');

// Triangle congruence
{ const b = G.construct('SSS', 3, 4, 5); ok(b.count === 1 && Math.abs(b.tris[0].C - 90) < 1e-6, 'SSS 3-4-5 is right-angled'); }
{ const b = G.construct('SSS', 2, 3, 9); ok(b.count === 0 && b.error, 'SSS impossible'); }
{ const b = G.construct('SAS', 3, 4, 90); near(b.tris[0].a, 5, 1e-9, 'SAS hypotenuse'); }
{ const b = G.construct('ASA', 40, 6, 60); const t = b.tris[0]; near(t.c, 6, 1e-6, 'ASA keeps the side between'); near(t.C, 80, 1e-9, 'ASA third angle'); }
{ const b = G.construct('AAS', 40, 60, 5); near(b.tris[0].C, 80, 1e-9, 'AAS third angle'); near(b.tris[0].a, 5, 1e-9, 'AAS side a'); }
{ const b = G.construct('RHS', 5, 3, 90); near(b.tris[0].b, 4, 1e-9, 'RHS 3-4-5'); ok(b.count === 1, 'RHS one triangle'); }
{ const b = G.construct('AAA', 50, 60, 5); ok(b.infinite && b.tris.length === 3 && b.count === Infinity, 'AAA infinite'); near(b.tris[1].A, b.tris[0].A, 1e-9, 'AAA same angles'); ok(b.tris[1].a > b.tris[0].a, 'AAA bigger copy'); }
ok(G.construct('SSA', 4, 6, 30).count === 2, 'SSA a=4 b=6 A=30: two triangles');   // h = 3 < 4 < 6
ok(G.construct('SSA', 3, 6, 30).count === 1, 'SSA a=h: one right triangle');
ok(G.construct('SSA', 2, 6, 30).count === 0, 'SSA too short: none');
ok(G.construct('SSA', 7, 6, 30).count === 1, 'SSA a>b: one');
{ const b = G.construct('SSA', 4, 6, 30); near(b.tris[0].B + b.tris[1].B, 180, 1e-9, 'SSA the two B angles are supplementary'); }
near(G.swingHeight(6, 30), 3, 1e-9, 'swing height');
{ const [a, b, c] = G.corners(G.construct('SSS', 3, 4, 5).tris[0]); near(Math.hypot(b.x - c.x, b.y - c.y), 3, 1e-9, 'corner distances'); ok(a.x === 0 && a.y === 0, 'A at origin'); }
for (const k of ['SSS', 'SAS', 'ASA', 'AAS', 'RHS', 'AAA', 'SSA']) ok(G.proveCase(k, { s1: 5, s2: 6, s3: 7, a1: 40, a2: 60 }).marks.length === 3, 'proveCase marks ' + k);
ok(G.proveCase('SSA', { s1: 5, s2: 6, s3: 7, a1: 40, a2: 60 }).answer === 'Cannot tell' && G.proveCase('RHS', { s1: 5, s2: 3, s3: 0, a1: 0, a2: 0 }).answer === 'RHS', 'proveCase answers');

console.log(bad ? `${bad} of ${n} checks FAILED` : `${n} checks passed`);
process.exit(bad ? 1 : 0);

// Pure maths for four Learn tools: plate boundaries (#L350), microscope magnification (#L351), circle theorems (#L352)
// and triangle congruence (#L353). No DOM. Checked in tests/curr-geo.mjs. Angles in degrees.
import { solveTriangle, type Tri } from './triangle.ts';

const D = Math.PI / 180;

/* ---------- Plate boundaries ---------- */
export type BoundaryId = 'ridge' | 'rift' | 'subduction' | 'arc' | 'collision' | 'transform';
export type Boundary = { id: BoundaryId; name: string; family: 'Divergent' | 'Convergent' | 'Transform'; rate: number; dip: number; depth: [number, number]; example: string; note: string };
/** Typical rates are rounded published values (relative speed of the two plates), shown as "about". */
export const BOUNDARIES: Boundary[] = [
  { id: 'ridge', name: 'Ocean ridge', family: 'Divergent', rate: 2.5, dip: 0, depth: [0, 15], example: 'Mid-Atlantic Ridge: the Americas and Europe/Africa move apart at about 2.5 cm/year.', note: 'Magma rises, cools and makes new ocean floor. Quakes are shallow.' },
  { id: 'rift', name: 'Rift valley', family: 'Divergent', rate: 0.7, dip: 0, depth: [0, 30], example: 'East African Rift: Africa is slowly splitting, at under 1 cm/year.', note: 'Land stretches and a block drops down into a valley. Quakes are shallow.' },
  { id: 'subduction', name: 'Ocean-continent', family: 'Convergent', rate: 7, dip: 45, depth: [0, 700], example: 'Andes: the Nazca plate dives under South America at about 7 cm/year.', note: 'Dense ocean plate sinks into a trench. Volcanoes form on the land; quakes get deeper inland.' },
  { id: 'arc', name: 'Ocean-ocean', family: 'Convergent', rate: 8, dip: 50, depth: [0, 700], example: 'Japan: the Pacific plate sinks under the Philippine and Okhotsk plates at about 8 cm/year.', note: 'One ocean plate sinks, and a curved chain of volcanic islands (an island arc) grows.' },
  { id: 'collision', name: 'Continent-continent', family: 'Convergent', rate: 4.5, dip: 0, depth: [0, 100], example: 'Himalaya: India pushes into Asia at about 4 to 5 cm/year.', note: 'Neither plate is dense enough to sink, so the crust crumples into fold mountains.' },
  { id: 'transform', name: 'Transform', family: 'Transform', rate: 3.5, dip: 0, depth: [0, 15], example: 'San Andreas Fault: the Pacific and North American plates slide past at about 3.5 cm/year.', note: 'Plates grind sideways. No crust is made or lost; shallow, often large quakes.' },
];
export const boundary = (id: string) => BOUNDARIES.find((b) => b.id === id) ?? BOUNDARIES[0];
/** 1 cm/year is 10 km per million years. */
export const kmMoved = (cmPerYr: number, myr: number) => cmPerYr * myr * 10;
export const myrToMove = (km: number, cmPerYr: number) => km / (cmPerYr * 10);
export const rateFromMove = (km: number, myr: number) => km / (myr * 10);
/** Depth (km) of the quakes at a horizontal distance x km from the trench, on a slab dipping at dipDeg. */
export const slabDepthKm = (xKm: number, dipDeg: number) => Math.min(700, Math.max(0, xKm) * Math.tan(dipDeg * D));
/** Horizontal distance from the trench to where the slab is 100 km deep (where volcanoes sit). */
export const volcanoOffsetKm = (dipDeg: number) => 100 / Math.tan(dipDeg * D);
/** Reversal ages (millions of years) of Earth's magnetic field, rounded: Brunhes normal to 0.78, Matuyama reversed, and so on. */
export const REVERSALS = [0.78, 0.99, 1.07, 1.77, 1.95, 2.58, 3.33, 3.58, 4.18, 4.29, 4.48, 4.62, 4.8, 4.89, 4.98, 5.24];
/** +1 normal (like today), -1 reversed, for rock made `age` million years ago. */
export function polarity(age: number): 1 | -1 {
  let n = REVERSALS.filter((t) => age >= t).length;
  if (age >= REVERSALS[REVERSALS.length - 1]) n += Math.floor((age - REVERSALS[REVERSALS.length - 1]) / 0.6);
  return n % 2 === 0 ? 1 : -1;
}
/** Age of ocean floor (Myr) a distance km from the ridge, for a full opening rate of cm/yr (each side moves half). */
export const floorAge = (distKm: number, fullRateCmYr: number) => distKm / ((fullRateCmYr / 2) * 10);

/* ---------- Microscope ---------- */
export type Specimen = { id: string; name: string; sizeUm: number; what: string; minTotal: number };
/** Typical sizes (length or width, micrometres). minTotal: total magnification below which it is too small to see. */
export const SPECIMENS: Specimen[] = [
  { id: 'onion', name: 'Onion cell', sizeUm: 250, what: 'length of a rectangular epidermis cell', minTotal: 40 },
  { id: 'cheek', name: 'Cheek cell', sizeUm: 60, what: 'width of a flat cheek cell', minTotal: 40 },
  { id: 'stoma', name: 'Plant stoma', sizeUm: 30, what: 'length of a pair of guard cells', minTotal: 100 },
  { id: 'rbc', name: 'Red blood cell', sizeUm: 7, what: 'diameter of a disc', minTotal: 400 },
  { id: 'bacterium', name: 'Bacterium', sizeUm: 2, what: 'length of a rod-shaped cell', minTotal: 1000 },
];
export const OBJECTIVES = [4, 10, 40, 100];
export const EYEPIECE = 10;
/** Field number of the eyepiece in mm; the field of view is FN / objective. */
export const FIELD_NUMBER = 18;
export const totalMag = (objective: number, eyepiece = EYEPIECE) => objective * eyepiece;
export const fieldOfViewMm = (objective: number, fn = FIELD_NUMBER) => fn / objective;
/** Width of the whole image in mm, whatever the lens: field of view x total magnification. */
export const imageFieldMm = (objective: number, eyepiece = EYEPIECE, fn = FIELD_NUMBER) => fieldOfViewMm(objective, fn) * totalMag(objective, eyepiece);
export const imageSize = (actual: number, mag: number) => actual * mag;
export const actualSize = (image: number, mag: number) => image / mag;
const TO_M: Record<string, number> = { m: 1, mm: 1e-3, um: 1e-6, nm: 1e-9 };
export const UNITS = ['mm', 'um', 'nm'] as const;
export const unitLabel = (u: string) => (u === 'um' ? 'µm' : u);
export function convert(v: number, from: string, to: string) { return (v * TO_M[from]) / TO_M[to]; }
/** Graticule calibration: n eyepiece divisions line up with m stage-micrometer divisions (each 10 µm): one division = ? µm. */
export const calibrate = (graticuleDivs: number, stageDivs: number, stageDivUm = 10) => (stageDivs * stageDivUm) / graticuleDivs;
/** Abbe limit: smallest distance resolved, d = 0.61 x wavelength / NA (nm). */
export const resolutionNm = (wavelengthNm: number, na: number) => (0.61 * wavelengthNm) / na;
export const LIGHT_LIMIT_NM = 200;
export const ELECTRON_LIMIT_NM = 0.2;
/** Smallest cell width (as a fraction of a pixel-free picture) a specimen is seen at: true if resolved. */
export const isResolved = (sizeUm: number, limitNm = LIGHT_LIMIT_NM) => sizeUm * 1000 > limitNm;

/* ---------- Circle theorems ---------- */
export type Pt = { x: number; y: number };
export const onCircle = (deg: number, r = 1, c: Pt = { x: 0, y: 0 }): Pt => ({ x: c.x + r * Math.cos(deg * D), y: c.y + r * Math.sin(deg * D) });
export const dist = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y);
/** Angle at v between the lines to a and to b, 0 to 180. */
export function angleAt(v: Pt, a: Pt, b: Pt) {
  const ux = a.x - v.x, uy = a.y - v.y, wx = b.x - v.x, wy = b.y - v.y;
  const c = (ux * wx + uy * wy) / (Math.hypot(ux, uy) * Math.hypot(wx, wy));
  return Math.acos(Math.max(-1, Math.min(1, c))) / D;
}
const side = (a: Pt, b: Pt, p: Pt) => Math.sign((b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x));
export const sameSide = (a: Pt, b: Pt, p: Pt, q: Pt) => side(a, b, p) === side(a, b, q);
const O: Pt = { x: 0, y: 0 };
/** Theorem 1: the angle P makes on the circle and the angle the same chord AB makes at the centre (on P's arc). */
export function centreVsCircumference(A: Pt, B: Pt, P: Pt, c: Pt = O) {
  const inscribed = angleAt(P, A, B), aob = angleAt(c, A, B);
  const centre = side(A, B, c) === 0 || sameSide(A, B, P, c) ? aob : 360 - aob;
  return { inscribed, centre };
}
/** Theorem 4: interior angles of the cyclic quadrilateral through the points at the given angles (sorted round the circle). */
export function cyclicQuad(thetas: number[]) {
  const t = [...thetas].map((x) => ((x % 360) + 360) % 360).sort((a, b) => a - b), p = t.map((x) => onCircle(x));
  const ang = p.map((v, i) => angleAt(v, p[(i + 3) % 4], p[(i + 1) % 4]));
  return { angles: ang, sumAC: ang[0] + ang[2], sumBD: ang[1] + ang[3] };
}
/** Theorem 6: the two points where tangents from external point P touch the circle (centre c, radius r), and the tangent length. */
export function tangentsFrom(P: Pt, r = 1, c: Pt = O) {
  const d = dist(P, c), base = Math.atan2(P.y - c.y, P.x - c.x), da = Math.acos(r / d);
  const T1 = { x: c.x + r * Math.cos(base + da), y: c.y + r * Math.sin(base + da) }, T2 = { x: c.x + r * Math.cos(base - da), y: c.y + r * Math.sin(base - da) };
  return { T1, T2, len1: dist(P, T1), len2: dist(P, T2), length: Math.sqrt(d * d - r * r) };
}
/** Theorem 5: a point on the tangent at T, a distance s along it (either direction by sign). */
export const tangentPoint = (T: Pt, s: number, c: Pt = O): Pt => { const L = Math.hypot(T.x - c.x, T.y - c.y); return { x: T.x - ((T.y - c.y) / L) * s, y: T.y + ((T.x - c.x) / L) * s }; };
/** Theorem 7: angle between tangent at A and chord AB (on the side away from P) and the angle in the alternate segment at P. */
export function alternateSegment(A: Pt, B: Pt, P: Pt, c: Pt = O) {
  let X = tangentPoint(A, 1, c);
  if (sameSide(A, B, X, P)) X = tangentPoint(A, -1, c);
  return { tangentChord: angleAt(A, B, X), inscribed: angleAt(P, A, B) };
}
/** Theorem 8: the foot of the perpendicular from the centre to chord AB and the chord's midpoint. */
export function chordFoot(A: Pt, B: Pt, c: Pt = O) {
  const dx = B.x - A.x, dy = B.y - A.y, t = ((c.x - A.x) * dx + (c.y - A.y) * dy) / (dx * dx + dy * dy);
  return { foot: { x: A.x + t * dx, y: A.y + t * dy } as Pt, mid: { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 } as Pt };
}
/** Half-chord from radius and the centre's distance to the chord (Pythagoras). */
export const halfChord = (r: number, d: number) => Math.sqrt(r * r - d * d);

/* ---------- Triangle congruence ---------- */
export type Cond = 'SSS' | 'SAS' | 'ASA' | 'AAS' | 'RHS' | 'AAA' | 'SSA';
export const CONDS: { id: Cond; name: string; works: boolean; labels: [string, string, string]; ranges: [[number, number], [number, number], [number, number]]; start: [number, number, number] }[] = [
  { id: 'SSS', name: 'SSS', works: true, labels: ['side a (cm)', 'side b (cm)', 'side c (cm)'], ranges: [[2, 10], [2, 10], [2, 10]], start: [5, 6, 7] },
  { id: 'SAS', name: 'SAS', works: true, labels: ['side b (cm)', 'side c (cm)', 'angle A between them (°)'], ranges: [[2, 10], [2, 10], [10, 170]], start: [6, 7, 50] },
  { id: 'ASA', name: 'ASA', works: true, labels: ['angle A (°)', 'side c between (cm)', 'angle B (°)'], ranges: [[10, 160], [2, 10], [10, 160]], start: [50, 7, 60] },
  { id: 'AAS', name: 'AAS', works: true, labels: ['angle A (°)', 'angle B (°)', 'side a, opposite A (cm)'], ranges: [[10, 160], [10, 160], [2, 10]], start: [50, 60, 6] },
  { id: 'RHS', name: 'RHS', works: true, labels: ['hypotenuse c (cm)', 'other side a (cm)', 'right angle C (°)'], ranges: [[3, 10], [1, 9.5], [90, 90]], start: [8, 5, 90] },
  { id: 'AAA', name: 'AAA (trap)', works: false, labels: ['angle A (°)', 'angle B (°)', 'size of the first triangle (cm)'], ranges: [[10, 160], [10, 160], [3, 8]], start: [50, 60, 5] },
  { id: 'SSA', name: 'SSA (trap)', works: false, labels: ['side a, the swinging side (cm)', 'side b (cm)', 'angle A (°)'], ranges: [[1, 10], [3, 10], [15, 80]], start: [4, 6, 30] },
];
export const cond = (id: string) => CONDS.find((c) => c.id === id) ?? CONDS[0];
/** Corners with A at the origin and B on the x axis. */
export const corners = (t: Tri): [Pt, Pt, Pt] => [{ x: 0, y: 0 }, { x: t.c, y: 0 }, { x: t.b * Math.cos(t.A * D), y: t.b * Math.sin(t.A * D) }];
export type Built = { tris: Tri[]; count: number; verdict: string; error?: string; infinite?: boolean };
/** Every triangle that fits the given parts. count is Infinity for AAA. */
export function construct(kind: Cond, p: number, q: number, s: number): Built {
  const wrap = (res: { tris: Tri[]; error?: string }, ok: string): Built => ({ tris: res.tris, count: res.tris.length, error: res.error, verdict: res.error ? res.error : res.tris.length === 1 ? ok : '' });
  if (kind === 'SSS') return wrap(solveTriangle('SSS', p, q, s), 'Only one triangle fits, so any two triangles with these three sides are congruent.');
  if (kind === 'SAS') return wrap(solveTriangle('SAS', p, q, s), 'Only one triangle fits, so any two triangles with these two sides and the angle between them are congruent.');
  if (kind === 'AAS') return wrap(solveTriangle('AAS', p, q, s), 'Only one triangle fits, so any two triangles with these angles and this side are congruent.');
  if (kind === 'ASA') {
    const C = 180 - p - s;
    if (C <= 0) return { tris: [], count: 0, verdict: 'No triangle: the two angles must add up to less than 180°.', error: 'The two angles must add up to less than 180°.' };
    return wrap(solveTriangle('AAS', p, s, (q * Math.sin(p * D)) / Math.sin(C * D)), 'Only one triangle fits, so any two triangles with these two angles and the side between them are congruent.');
  }
  if (kind === 'RHS') {
    if (q >= p) return { tris: [], count: 0, verdict: 'No triangle: the hypotenuse must be the longest side.', error: 'The hypotenuse must be longer than the other side.' };
    const b = Math.sqrt(p * p - q * q), A = Math.asin(q / p) / D;
    return { tris: [{ A, B: 90 - A, C: 90, a: q, b, c: p }], count: 1, verdict: 'In a right-angled triangle the hypotenuse and one other side fix the third (Pythagoras), so only one triangle fits.' };
  }
  if (kind === 'AAA') {
    if (p + q >= 180) return { tris: [], count: 0, verdict: 'No triangle: the two angles must add up to less than 180°.', error: 'The two angles must add up to less than 180°.' };
    const out: Tri[] = [];
    for (const k of [1, 1.6, 2.4]) { const t = solveTriangle('AAS', p, q, s * k).tris[0]; out.push(t); }
    return { tris: out, count: Infinity, infinite: true, verdict: 'Infinitely many triangles fit: same angles, any size. They are similar, not congruent.' };
  }
  const res = solveTriangle('SSA', p, q, s);
  const v = res.error ? res.error : res.tris.length === 2 ? 'Two different triangles fit, so SSA does not prove congruence (the ambiguous case).' : 'Only one triangle fits here, but it is luck: with other lengths two would fit.';
  return { tris: res.tris, count: res.tris.length, error: res.error, verdict: v };
}
/** Height the swinging side must reach: b sin A. */
export const swingHeight = (b: number, A: number) => b * Math.sin(A * D);
export const TESTS = ['SSS', 'SAS', 'ASA', 'AAS', 'RHS', 'Cannot tell'] as const;
/** A "prove it" item: the marks as text for triangles ABC and PQR, and the right answer. */
export function proveCase(kind: Cond, v: { s1: number; s2: number; s3: number; a1: number; a2: number }) {
  const { s1, s2, s3, a1, a2 } = v;
  const S = (x: string, y: string, n: number) => `${x} = ${y} = ${n} cm`, A = (x: string, y: string, n: number) => `angle ${x} = angle ${y} = ${n}°`;
  const marks: Record<Cond, [string[], (typeof TESTS)[number]]> = {
    SSS: [[S('AB', 'PQ', s1), S('BC', 'QR', s2), S('CA', 'RP', s3)], 'SSS'],
    SAS: [[S('AB', 'PQ', s1), A('B', 'Q', a1), S('BC', 'QR', s2)], 'SAS'],
    ASA: [[A('A', 'P', a1), S('AB', 'PQ', s1), A('B', 'Q', a2)], 'ASA'],
    AAS: [[A('A', 'P', a1), A('B', 'Q', a2), S('BC', 'QR', s2)], 'AAS'],
    RHS: [[A('C', 'R', 90), S('AB', 'PQ', s1), S('AC', 'PR', s2)], 'RHS'],
    AAA: [[A('A', 'P', a1), A('B', 'Q', a2), A('C', 'R', 180 - a1 - a2)], 'Cannot tell'],
    SSA: [[S('AB', 'PQ', s1), S('BC', 'QR', s2), A('A', 'P', a1)], 'Cannot tell'],
  };
  return { marks: marks[kind][0], answer: marks[kind][1] };
}

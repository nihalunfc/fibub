// "Solve my numbers" for adding vectors: resultant of two vectors from size and direction, from two sizes and the
// angle between them, resolving a vector into components, size and direction from components, and the two string
// tensions of a hanging weight (Lami's theorem). Directions are measured anticlockwise from the +x axis. No DOM.
import { type SSpec, type SIn, type SOut, sf } from '../learn/solvecore-b.ts';

const R = Math.PI / 180;
const deg = (x: number, n = 4) => `${sf(x, n)}°`;
const p = (x: number) => (x < 0 ? `(${sf(x, 6)})` : sf(x, 6));
const p4 = (x: number) => (x < 0 ? `(${sf(x, 4)})` : sf(x, 4));
const z0 = (x: number) => (Math.abs(x) < 1e-10 ? 0 : x);
/** Direction in degrees, 0 up to (not including) 360, anticlockwise from +x. */
const dir = (x: number, y: number) => { const a = Math.atan2(y, x) / R; return a < 0 ? a + 360 : a; };
const quad = (x: number, y: number) => (x === 0 || y === 0 ? 'on an axis' : x > 0 && y > 0 ? 'in the first quadrant' : x < 0 && y > 0 ? 'in the second quadrant' : x < 0 ? 'in the third quadrant' : 'in the fourth quadrant');

export function twoVectors(A: number, ta: number, B: number, tb: number, unit: string): SOut {
  if (A < 0 || B < 0) return { error: 'A size (magnitude) cannot be negative. Use a positive size and change the direction instead.' };
  const ax = z0(A * Math.cos(ta * R)), ay = z0(A * Math.sin(ta * R)), bx = z0(B * Math.cos(tb * R)), by = z0(B * Math.sin(tb * R));
  const rx = ax + bx, ry = ay + by, M = Math.hypot(rx, ry), u = unit ? ` ${unit}` : '';
  if (M < 1e-9) return { answer: `The resultant is zero: A and B cancel each other.`, lines: [`Ax = ${sf(ax, 4)}, Ay = ${sf(ay, 4)}, Bx = ${sf(bx, 4)}, By = ${sf(by, 4)}`, `Rx = ${sf(ax, 4)} + ${p4(bx)} = 0 and Ry = ${sf(ay, 4)} + ${p4(by)} = 0`], tip: 'Equal sizes pointing in opposite directions add to zero. This is what equilibrium of two forces means.' };
  const th = dir(rx, ry);
  return { answer: `The resultant R = ${sf(M, 4)}${u} at ${deg(th)} to the +x axis.`, lines: [
    `Ax = A cos θA = ${sf(A, 6)} cos ${deg(ta, 6)} = ${sf(ax, 4)}`, `Ay = A sin θA = ${sf(A, 6)} sin ${deg(ta, 6)} = ${sf(ay, 4)}`,
    `Bx = B cos θB = ${sf(B, 6)} cos ${deg(tb, 6)} = ${sf(bx, 4)}`, `By = B sin θB = ${sf(B, 6)} sin ${deg(tb, 6)} = ${sf(by, 4)}`,
    `Rx = Ax + Bx = ${sf(ax, 4)} + ${p4(bx)} = ${sf(rx, 4)}`, `Ry = Ay + By = ${sf(ay, 4)} + ${p4(by)} = ${sf(ry, 4)}`,
    `R = √(Rx² + Ry²) = √(${sf(rx * rx, 4)} + ${sf(ry * ry, 4)}) = ${sf(M, 4)}${u}`,
    `Direction: tan θ = Ry / Rx = ${sf(ry, 4)} / ${sf(rx, 4)}, and R is ${quad(rx, ry)}, so θ = ${deg(th)} anticlockwise from +x`] , tip: 'Common mistake: adding the sizes (A + B). Sizes add only when the vectors point the same way. Always add the x parts and the y parts separately.' };
}

export function lawOfCosines(A: number, B: number, th: number): SOut {
  if (A < 0 || B < 0) return { error: 'A size (magnitude) cannot be negative.' };
  if (th < 0 || th > 180) return { error: 'The angle between two vectors is between 0° and 180°.' };
  if (A === 0 && B === 0) return { error: 'Both sizes are 0, so the resultant is 0.' };
  const c = Math.cos(th * R), s = Math.sin(th * R), M = Math.sqrt(Math.max(0, A * A + B * B + 2 * A * B * c));
  const lines = [`R² = A² + B² + 2AB cos θ = ${sf(A * A, 5)} + ${sf(B * B, 5)} + 2 × ${sf(A, 6)} × ${sf(B, 6)} × cos ${deg(th, 6)}`, `R² = ${sf(A * A + B * B + 2 * A * B * c, 5)}, so R = ${sf(M, 4)}`];
  if (M < 1e-9) return { answer: 'The resultant is zero: the vectors are equal and opposite.', lines, tip: 'At 180° with equal sizes the two vectors cancel.' };
  const al = Math.atan2(B * s, A + B * c) / R;
  lines.push(`tan α = B sin θ / (A + B cos θ) = ${sf(B * s, 5)} / ${sf(A + B * c, 5)}, so α = ${deg(al)} from A towards B`);
  return { answer: `R = ${sf(M, 4)}, at ${deg(al)} to A (towards B).`, lines, tip: 'Common mistake: using a minus sign in the formula. For two vectors drawn from the same point, with θ between them, it is +2AB cos θ. The minus version belongs to the third side of a triangle with an interior angle.' };
}

export function resolve(F: number, th: number, unit: string): SOut {
  if (F < 0) return { error: 'A size (magnitude) cannot be negative.' };
  const x = z0(F * Math.cos(th * R)), y = z0(F * Math.sin(th * R)), u = unit ? ` ${unit}` : '';
  return { answer: `Horizontal part ${sf(x, 4)}${u}, vertical part ${sf(y, 4)}${u}.`, lines: [`Fx = F cos θ = ${sf(F, 6)} × cos ${deg(th, 6)} = ${sf(x, 4)}${u}`, `Fy = F sin θ = ${sf(F, 6)} × sin ${deg(th, 6)} = ${sf(y, 4)}${u}`, `Check: √(Fx² + Fy²) = ${sf(Math.hypot(x, y), 4)}${u} = F`], tip: 'Common mistake: swapping sin and cos. With θ measured from the horizontal, the horizontal part uses cos. If the angle is given from the vertical or from a slope, draw the right triangle first.' };
}

export function fromParts(x: number, y: number, unit: string): SOut {
  const M = Math.hypot(x, y), u = unit ? ` ${unit}` : '';
  if (M === 0) return { error: 'Both parts are 0, so the vector has no size and no direction.' };
  const th = dir(x, y), ref = Math.atan(Math.abs(y) / Math.abs(x || 1e-300)) / R;
  return { answer: `Size ${sf(M, 4)}${u}, direction ${deg(th)} anticlockwise from +x.`, lines: [`R = √(x² + y²) = √(${p(x)}² + ${p(y)}²) = √${sf(x * x + y * y, 6)} = ${sf(M, 4)}${u}`, x === 0 || y === 0 ? `The vector lies along an axis, so θ = ${deg(th)}.` : `Reference angle = tan⁻¹(|y| / |x|) = tan⁻¹(${sf(Math.abs(y), 5)} / ${sf(Math.abs(x), 5)}) = ${deg(ref)}`, `The vector is ${quad(x, y)}, so θ = ${deg(th)}${x !== 0 && y !== 0 && th > 180 ? ` (that is ${deg(th - 360)} measured the other way)` : ''}`], tip: 'Common mistake: giving tan⁻¹(y/x) without checking the quadrant. If x is negative the calculator answer is off by 180°.' };
}

export function lami(W: number, t1: number, t2: number): SOut {
  if (W <= 0) return { error: 'The weight must be more than 0.' };
  if (t1 <= 0 || t2 <= 0 || t1 > 90 || t2 > 90) return { error: 'Each string angle (to the ceiling) is more than 0° and at most 90°.' };
  if (t1 + t2 >= 180 - 1e-9) return { error: 'Two vertical strings cannot hold a weight from a single point in this setup. Make one angle smaller than 90°.' };
  const sn = Math.sin((t1 + t2) * R), T1 = (W * Math.cos(t2 * R)) / sn, T2 = (W * Math.cos(t1 * R)) / sn;
  return { answer: `Left string T₁ = ${sf(T1, 4)} N and right string T₂ = ${sf(T2, 4)} N.`, lines: [
    'Three forces meet at the knot: T₁ and T₂ along the strings, and the weight W straight down. In equilibrium Lami’s theorem applies: each force ÷ sine of the angle opposite it is the same.',
    `Angle between T₂ and W = 90° + ${deg(t2, 6)} = ${deg(90 + t2, 6)}; between T₁ and W = ${deg(90 + t1, 6)}; between T₁ and T₂ = 180° − ${deg(t1, 6)} − ${deg(t2, 6)} = ${deg(180 - t1 - t2, 6)}`,
    `T₁ / sin ${deg(90 + t2, 6)} = W / sin ${deg(180 - t1 - t2, 6)}, so T₁ = ${sf(W, 6)} × cos ${deg(t2, 6)} / sin ${deg(t1 + t2, 6)} = ${sf(T1, 4)} N`,
    `T₂ = ${sf(W, 6)} × cos ${deg(t1, 6)} / sin ${deg(t1 + t2, 6)} = ${sf(T2, 4)} N`,
    `Check, vertical: T₁ sin ${deg(t1, 6)} + T₂ sin ${deg(t2, 6)} = ${sf(T1 * Math.sin(t1 * R) + T2 * Math.sin(t2 * R), 4)} N = W; horizontal: T₁ cos ${deg(t1, 6)} = ${sf(T1 * Math.cos(t1 * R), 4)} N = T₂ cos ${deg(t2, 6)} = ${sf(T2 * Math.cos(t2 * R), 4)} N`], tip: 'Common mistake: using the angle from the vertical in place of the angle to the ceiling. Here both angles are measured from the ceiling (the horizontal). If the weight is in kg, multiply by 9.8 to get newtons.' };
}

const UL: [string, string][] = [['N', 'newtons (N)'], ['m', 'metres (m)'], ['m/s', 'metres per second (m/s)'], ['', 'no unit']];
export const VECTOR_SPEC: SSpec = {
  id: 'vector',
  finds: [['two', 'Resultant of two vectors (size and direction)'], ['cos', 'Resultant from the angle between them'], ['res', 'Components of one vector'], ['mag', 'Size and direction from components'], ['lami', 'Tensions of two strings holding a weight']],
  fields: [
    { k: 'ul', label: 'Unit shown', kind: 'choice', options: UL, def: 'N', show: (c) => c.find !== 'lami' },
    { k: 'A', label: 'A: size', ph: 'e.g. 6', show: (c) => c.find === 'two' || c.find === 'cos' },
    { k: 'ta', label: 'A: direction from +x', neg: true, units: [['degrees', 1], ['radians', 1 / R]], ph: 'e.g. 0', show: (c) => c.find === 'two' },
    { k: 'B', label: 'B: size', ph: 'e.g. 4', show: (c) => c.find === 'two' || c.find === 'cos' },
    { k: 'tb', label: 'B: direction from +x', neg: true, units: [['degrees', 1], ['radians', 1 / R]], ph: 'e.g. 60', show: (c) => c.find === 'two' },
    { k: 'th', label: 'Angle between A and B', units: [['degrees', 1], ['radians', 1 / R]], ph: 'e.g. 60', show: (c) => c.find === 'cos' },
    { k: 'F', label: 'Size of the vector', ph: 'e.g. 50', show: (c) => c.find === 'res' },
    { k: 'tf', label: 'Angle above the horizontal', neg: true, units: [['degrees', 1], ['radians', 1 / R]], ph: 'e.g. 37', show: (c) => c.find === 'res' },
    { k: 'x', label: 'x part (horizontal)', neg: true, ph: 'e.g. 3', show: (c) => c.find === 'mag' },
    { k: 'y', label: 'y part (vertical)', neg: true, ph: 'e.g. 4', show: (c) => c.find === 'mag' },
    { k: 'W', label: 'Weight', units: [['N', 1], ['kg (× 9.8)', 9.8]], ph: 'e.g. 100', show: (c) => c.find === 'lami' },
    { k: 't1', label: 'Left string: angle to the ceiling', units: [['degrees', 1], ['radians', 1 / R]], ph: 'e.g. 30', show: (c) => c.find === 'lami' },
    { k: 't2', label: 'Right string: angle to the ceiling', units: [['degrees', 1], ['radians', 1 / R]], ph: 'e.g. 60', show: (c) => c.find === 'lami' },
  ],
  presets: [
    { name: '6 at 0° plus 4 at 60°', find: 'two', ch: { ul: 'N' }, vals: { A: '6', ta: ['0', 'degrees'], B: '4', tb: ['60', 'degrees'] } },
    { name: '3 N and 4 N at 90° to each other', find: 'cos', ch: { ul: 'N' }, vals: { A: '3', B: '4', th: ['90', 'degrees'] } },
    { name: '50 N force at 37° above horizontal', find: 'res', ch: { ul: 'N' }, vals: { F: '50', tf: ['37', 'degrees'] } },
    { name: 'Parts −3 and 4: size and direction', find: 'mag', ch: { ul: 'm' }, vals: { x: '-3', y: '4' } },
    { name: '100 N weight, strings at 30° and 60°', find: 'lami', vals: { W: '100', t1: ['30', 'degrees'], t2: ['60', 'degrees'] } },
  ],
  solve: (i: Record<string, SIn>, c) => {
    const u = c.ch.ul ?? 'N';
    if (c.find === 'two') return twoVectors(i.A.v, i.ta.v, i.B.v, i.tb.v, u);
    if (c.find === 'cos') return lawOfCosines(i.A.v, i.B.v, i.th.v);
    if (c.find === 'res') return resolve(i.F.v, i.tf.v, u);
    if (c.find === 'mag') return fromParts(i.x.v, i.y.v, u);
    return lami(i.W.v, i.t1.v, i.t2.v);
  },
};

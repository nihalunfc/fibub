// "Solve my numbers" for polygon angles (Class 8 to 10): angle sum, each angle of a regular polygon, the number of
// sides from an interior angle, an exterior angle or an angle sum, diagonals, and a missing angle. No DOM.
import { sf as sf3, type SSpec, type SIn, type SOut } from '../learn/solvecore-b.ts';

const sf = (x: number, n = 6) => sf3(x, n);
const DEG: [string, number][] = [['degrees', 1], ['radians', 180 / Math.PI]];
const back = (x: SIn) => (x.u === 'radians' ? `${sf(x.typed, 4)} rad × 180 ÷ π = ${sf(x.v, 5)}°` : '');
const ints = (v: number) => Math.abs(v - Math.round(v)) < 1e-3;
const names: Record<number, string> = { 3: 'triangle', 4: 'quadrilateral', 5: 'pentagon', 6: 'hexagon', 7: 'heptagon', 8: 'octagon', 9: 'nonagon', 10: 'decagon', 12: 'dodecagon' };
const nm = (n: number) => (names[n] ? `${names[n]} (${n} sides)` : `${n}-sided polygon`);
const nameOnly = (n: number) => (names[n] ? ` (${names[n]})` : '');
const art = (w: string) => (/^[aeiou]/i.test(w) ? 'an' : 'a');

export function solvePolygon(i: Record<string, SIn>, c: { find: string }): SOut {
  const f = c.find;
  if (f === 'sum') {
    const x = i.n; if (!Number.isInteger(x.v) || x.v < 3) return { error: 'A polygon has at least 3 sides, and the number of sides is a whole number.' };
    if (x.v > 1000) return { error: 'Keep the number of sides at 1000 or fewer.' };
    const n = x.v, S = (n - 2) * 180, each = S / n, ext = 360 / n, dg = (n * (n - 3)) / 2;
    return { answer: `The ${nm(n)} has an angle sum of ${sf(S)}°. If it is regular, each angle is ${sf(each, 5)}°.`, lines: [`${art(names[n] ?? 'n')[0].toUpperCase()}${art(names[n] ?? 'n').slice(1)} ${nm(n)} splits into n − 2 = ${n - 2} triangles from one corner.`, `Sum of interior angles = (n − 2) × 180° = ${n - 2} × 180° = ${sf(S)}°`, `Each interior angle if regular = ${sf(S)}° ÷ ${n} = ${sf(each, 5)}°`, `Each exterior angle if regular = 360° ÷ ${n} = ${sf(ext, 5)}° (check: ${sf(each, 5)}° + ${sf(ext, 5)}° = 180°)`, `Number of diagonals = n(n − 3) ÷ 2 = ${n} × ${n - 3} ÷ 2 = ${dg}`], tip: 'Common mistake: using n × 180° instead of (n − 2) × 180°. Also, the "each angle" answer is only for a regular polygon (all angles equal).' };
  }
  if (f === 'sidesInt') {
    const a = i.a; if (!(a.v > 0 && a.v < 180)) return { error: 'An interior angle of a regular polygon is more than 0° and less than 180°. Check the units too.' };
    if (a.v < 60 - 1e-9) return { error: `A regular polygon has interior angles of at least 60° (the equilateral triangle), so ${sf(a.v, 5)}° is too small.` };
    const n = 360 / (180 - a.v), r = Math.round(n);
    const pre = back(a) ? [back(a)] : [];
    const lines = [...pre, `Exterior angle = 180° − interior = 180° − ${sf(a.v, 5)}° = ${sf(180 - a.v, 5)}°`, `Number of sides n = 360° ÷ exterior = 360° ÷ ${sf(180 - a.v, 5)}° = ${sf(n, 5)}`];
    if (!ints(n) || r < 3) return { error: `That gives ${sf(n, 5)} sides, which is not a whole number, so no regular polygon has an interior angle of ${sf(a.v, 5)}°.` };
    return { answer: `The polygon has ${r} sides${nameOnly(r)}.`, lines: [...lines, `Check: (${r} − 2) × 180° ÷ ${r} = ${sf(((r - 2) * 180) / r, 5)}°`], tip: 'Quickest route: turn the interior angle into the exterior angle (180° minus it), then n = 360° ÷ exterior.' };
  }
  if (f === 'sidesExt') {
    const a = i.a; if (!(a.v > 0 && a.v <= 120)) return { error: 'An exterior angle of a regular polygon is more than 0° and at most 120°. Check the units too.' };
    const n = 360 / a.v, r = Math.round(n);
    if (!ints(n)) return { error: `360° ÷ ${sf(a.v, 5)}° = ${sf(n, 5)}, not a whole number, so no regular polygon has that exterior angle.` };
    return { answer: `The polygon has ${r} sides${nameOnly(r)}.`, lines: [...(back(a) ? [back(a)] : []), `The exterior angles of any polygon add up to 360°, and a regular polygon has n equal ones.`, `n = 360° ÷ ${sf(a.v, 5)}° = ${r}`, `Interior angle = 180° − ${sf(a.v, 5)}° = ${sf(180 - a.v, 5)}°`], tip: 'The exterior angles add to 360° for every convex polygon, whatever the number of sides.' };
  }
  if (f === 'sidesSum') {
    const a = i.a; if (!(a.v >= 180)) return { error: 'The smallest angle sum is 180° (a triangle). Check the units.' };
    const t = a.v / 180, n = t + 2;
    if (!ints(t)) return { error: `${sf(a.v, 6)}° ÷ 180° = ${sf(t, 5)} is not a whole number, so no polygon has that angle sum. It must be a multiple of 180°.` };
    const r = Math.round(n);
    return { answer: `The polygon has ${r} sides${nameOnly(r)}.`, lines: [...(back(a) ? [back(a)] : []), `Angle sum = (n − 2) × 180°, so n − 2 = ${sf(a.v, 6)}° ÷ 180° = ${Math.round(t)}`, `n = ${Math.round(t)} + 2 = ${r}`], tip: 'Common mistake: stopping at the number of triangles (n − 2). Add 2 to get the sides.' };
  }
  if (f === 'missing') {
    const x = i.n; if (!Number.isInteger(x.v) || x.v < 3 || x.v > 1000) return { error: 'The number of sides is a whole number from 3 to 1000.' };
    const n = x.v, g = i.known.list, k = g.length;
    if (!k) return { error: 'Type the angles you know, separated by spaces or commas.' };
    if (g.some((a) => !(a > 0))) return { error: 'Every angle must be more than 0.' };
    if (k >= n) return { error: `A ${n}-sided polygon has ${n} angles, so give fewer than ${n} known angles.` };
    const S = (n - 2) * 180, sum = g.reduce((s, a) => s + a, 0), rest = S - sum;
    if (rest <= 0) return { error: `The angles you gave add up to ${sf(sum)}°, which is already ${rest === 0 ? 'the whole sum' : 'more than the sum'} of ${sf(S)}° for ${n} sides. Check them.` };
    const m = n - k, each = rest / m;
    const l = [...(i.known.u === 'radians' ? [`Convert each angle: × 180 ÷ π (given angles total ${sf(sum, 6)}°)`] : []), `Angle sum = (${n} − 2) × 180° = ${sf(S)}°`, `Known angles: ${g.map((a) => sf(a, 5)).join(' + ')} = ${sf(sum)}°`, `Remaining = ${sf(S)}° − ${sf(sum)}° = ${sf(rest)}°`];
    if (m > 1) l.push(`The other ${m} angles are equal: ${sf(rest)}° ÷ ${m} = ${sf(each, 5)}° each`);
    return { answer: m === 1 ? `The missing angle is ${sf(rest, 5)}°.` : `Each of the other ${m} angles is ${sf(each, 5)}°.`, lines: l, tip: each > 180 ? 'This angle is more than 180°, so that corner points inwards (a concave polygon).' : 'Check your answer: all the angles together must make (n − 2) × 180°.' };
  }
  const x = i.n; if (!Number.isInteger(x.v) || x.v < 3 || x.v > 1000) return { error: 'The number of sides is a whole number from 3 to 1000.' };
  const n = x.v, d = (n * (n - 3)) / 2;
  return { answer: `${art(names[n] ?? 'n')[0].toUpperCase()}${art(names[n] ?? 'n').slice(1)} ${nm(n)} has ${d} diagonals.`, lines: ['Each corner joins to n − 3 others by a diagonal (not itself, and not its two neighbours).', `That counts every diagonal twice (once from each end), so diagonals = n(n − 3) ÷ 2`, `= ${n} × ${n - 3} ÷ 2 = ${d}`], tip: 'Common mistake: forgetting to halve, which counts every diagonal twice.' };
}

export const POLYGON_SPEC: SSpec = {
  id: 'polygon',
  finds: [['sum', 'Angle sum and each angle (from sides)'], ['sidesInt', 'Sides from a regular interior angle'], ['sidesExt', 'Sides from a regular exterior angle'], ['sidesSum', 'Sides from an angle sum'], ['missing', 'Missing angle'], ['diag', 'Diagonals']],
  fields: [
    { k: 'n', label: 'Number of sides n', ph: 'e.g. 8', show: (c) => ['sum', 'missing', 'diag'].includes(c.find) },
    { k: 'a', label: 'Angle', units: DEG, ph: 'e.g. 156', show: (c) => ['sidesInt', 'sidesExt', 'sidesSum'].includes(c.find) },
    { k: 'known', label: 'Angles you know', kind: 'list', units: DEG, ph: 'e.g. 120 130 100 140 125', show: (c) => c.find === 'missing' },
  ],
  presets: [
    { name: 'Octagon: angle sum and each angle', find: 'sum', vals: { n: '8' } },
    { name: 'Regular polygon with interior angle 156 degrees', find: 'sidesInt', vals: { a: '156' } },
    { name: 'Regular polygon with exterior angle 24 degrees', find: 'sidesExt', vals: { a: '24' } },
    { name: 'Polygon with angle sum 1620 degrees', find: 'sidesSum', vals: { a: '1620' } },
    { name: 'Hexagon with five angles known', find: 'missing', vals: { n: '6', known: '120 130 100 140 125' } },
    { name: 'Diagonals of a decagon', find: 'diag', vals: { n: '10' } },
  ],
  solve: (i, c) => solvePolygon(i, c),
};

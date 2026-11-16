// "Solve my numbers" for similar triangles: a missing side from the scale factor, the basic proportionality theorem
// (AD/DB = AE/EC), areas of similar triangles, heights from shadows, and the SSS and AA similarity tests. No DOM.
import { sf, type SSpec, type SIn, type SOut } from '../learn/solvecore-b.ts';
import { sss, aa } from './similar-school.ts';

const LEN: [string, number][] = [['cm', 1], ['m', 100], ['mm', 0.1]];
const LEN2: [string, number][] = [['m', 1], ['cm', 0.01], ['ft', 0.3048]];
const AREA: [string, number][] = [['cm²', 1], ['m²', 1e4], ['mm²', 0.01]];
const back = (x: SIn) => (x.typed === 0 ? 1 : x.v / x.typed);
const pos = (xs: SIn[], what = 'lengths') => (xs.some((x) => !(x.v > 0)) ? `All ${what} must be more than 0.` : '');
const isTri = (s: number[]) => s[0] + s[1] > s[2] && s[0] + s[2] > s[1] && s[1] + s[2] > s[0];
const u = (x: SIn) => x.u;

export function solveSimilar(i: Record<string, SIn>, find: string): SOut {
  if (find === 'side') {
    const e = pos([i.s1, i.s2, i.t1]); if (e) return { error: e };
    const k = i.s2.v / i.s1.v, t2 = i.t1.v * k, out = t2 / back(i.s2);
    return { answer: `The matching side in the second triangle is ${sf(out)} ${u(i.s2)}.`, lines: ['Similar triangles have all matching sides in the same ratio.', `Scale factor k = ${sf(i.s2.typed)} ${u(i.s2)} ÷ ${sf(i.s1.typed)} ${u(i.s1)} = ${sf(k, 4)}`, `Unknown side = ${sf(i.t1.typed)} ${u(i.t1)} × ${sf(k, 4)} = ${sf(out)} ${u(i.s2)}`], tip: 'Common mistake: matching the wrong sides. Match the side opposite the same angle: shortest with shortest, longest with longest.' };
  }
  if (['AD', 'DB', 'AE', 'EC'].includes(find)) {
    const given = (['AD', 'DB', 'AE', 'EC'] as const).filter((k) => k !== find).map((k) => i[k]);
    const e = pos(given); if (e) return { error: e };
    const [AD, DB, AE, EC] = ['AD', 'DB', 'AE', 'EC'].map((k) => i[k]?.v);
    const ref = given[0], unit = ref.u, f = back(ref);
    let x: number, work: string;
    if (find === 'EC') { x = (DB * AE) / AD; work = `EC = DB × AE ÷ AD = ${sf(i.DB.typed)} × ${sf(i.AE.typed)} ÷ ${sf(i.AD.typed)}`; }
    else if (find === 'AE') { x = (AD * EC) / DB; work = `AE = AD × EC ÷ DB = ${sf(i.AD.typed)} × ${sf(i.EC.typed)} ÷ ${sf(i.DB.typed)}`; }
    else if (find === 'AD') { x = (DB * AE) / EC; work = `AD = DB × AE ÷ EC = ${sf(i.DB.typed)} × ${sf(i.AE.typed)} ÷ ${sf(i.EC.typed)}`; }
    else { x = (AD * EC) / AE; work = `DB = AD × EC ÷ AE = ${sf(i.AD.typed)} × ${sf(i.EC.typed)} ÷ ${sf(i.AE.typed)}`; }
    const mixed = given.some((g) => g.u !== unit);
    return { answer: `${find} = ${sf(x / f)} ${unit}.`, lines: ['DE is parallel to BC, so by the basic proportionality theorem AD ÷ DB = AE ÷ EC.', ...(mixed ? [`Lengths in different units are converted first; the answer is in ${unit}.`] : []), `${work} = ${sf(x / f)} ${unit}`], tip: 'Common mistake: using AD ÷ AB. The theorem compares AD with DB (the two parts of the same side), and AE with EC.' };
  }
  if (find === 'area') {
    const e = pos([i.s1, i.s2, i.ar1], 'sides and areas'); if (e) return { error: e };
    const k = i.s2.v / i.s1.v, a2 = i.ar1.v * k * k, out = a2 / back(i.ar1);
    return { answer: `The area of the second triangle is ${sf(out)} ${u(i.ar1)}; the areas are in the ratio ${sf(k * k, 4)} : 1.`, lines: ['The ratio of the areas of similar triangles equals the square of the ratio of matching sides.', `Side ratio k = ${sf(i.s2.typed)} ÷ ${sf(i.s1.typed)} = ${sf(k, 4)} (after converting to the same unit)`, `Area ratio = k² = ${sf(k * k, 4)}`, `Area 2 = ${sf(i.ar1.typed)} × ${sf(k * k, 4)} = ${sf(out)} ${u(i.ar1)}`], tip: 'Common mistake: using the side ratio for areas. Double the sides means four times the area.' };
  }
  if (find === 'shadow') {
    const e = pos([i.h1, i.sh1, i.sh2], 'heights and shadows'); if (e) return { error: e };
    const h2 = (i.h1.v * i.sh2.v) / i.sh1.v, out = h2 / back(i.h1);
    return { answer: `The height is ${sf(out)} ${u(i.h1)}.`, lines: ['At the same moment the sun makes the same angle, so the two triangles (object + shadow) are similar.', 'height ÷ shadow is the same for both.', `h = ${sf(i.h1.typed)} ${u(i.h1)} × (${sf(i.sh2.typed)} ${u(i.sh2)} ÷ ${sf(i.sh1.typed)} ${u(i.sh1)}) = ${sf(out)} ${u(i.h1)}`], tip: 'Common mistake: measuring the two shadows at different times of day. The sun angle changes, so the triangles are no longer similar. Units can differ: they are converted for you.' };
  }
  if (find === 'sss') {
    const a = i.l1.list, b = i.l2.list;
    if (a.length !== 3 || b.length !== 3) return { error: 'Type exactly three sides for each triangle, for example 3 4 5.' };
    if (a.some((x) => !(x > 0)) || b.some((x) => !(x > 0))) return { error: 'Sides must be more than 0.' };
    if (!isTri(a) || !isTri(b)) return { error: 'Those three lengths cannot make a triangle: the two shorter sides must add up to more than the longest.' };
    const r = sss(a, b), sa = [...a].sort((x, y) => x - y), sb = [...b].sort((x, y) => x - y);
    const lines = ['SSS similarity: the three pairs of matching sides must be in the same ratio. Put each triangle\'s sides in order, shortest to longest.', `Triangle 1: ${sa.map((x) => sf(x, 5)).join(', ')}   Triangle 2: ${sb.map((x) => sf(x, 5)).join(', ')}`, ...sa.map((x, k) => `${sf(x, 5)} ÷ ${sf(sb[k], 5)} = ${sf(r.ratios[k], 4)}`)];
    return { answer: r.similar ? `Yes, the triangles are similar (SSS), with scale factor ${sf(r.k, 4)} from triangle 2 to triangle 1.` : 'No, the triangles are not similar: the side ratios are not all equal.', lines, tip: 'Common mistake: dividing sides in the order typed. Sort each triangle\'s sides first, then compare shortest with shortest.' };
  }
  // aa
  const a = i.q1.list, b = i.q2.list;
  if (a.length !== 2 || b.length !== 2) return { error: 'Type two angles (in degrees) for each triangle, for example 50 60.' };
  const r = aa([a[0], a[1]], [b[0], b[1]]);
  if (!r.valid) return { error: 'Two angles of a triangle must add up to less than 180° and each be more than 0.' };
  return { answer: r.similar ? 'Yes, the triangles are similar (AA).' : 'No, the triangles are not similar: their angles do not match.', lines: ['Angles of a triangle add up to 180°, so the third angle is 180° − the other two.', `Triangle 1: ${sf(a[0], 5)}°, ${sf(a[1], 5)}° and ${sf(r.third[0], 5)}°`, `Triangle 2: ${sf(b[0], 5)}°, ${sf(b[1], 5)}° and ${sf(r.third[1], 5)}°`, r.similar ? 'The three angles match in some order, so the triangles are similar.' : 'The sets of three angles are different.'], tip: 'Two equal angles are enough (AA): the third must then be equal too, so you never need to check it.' };
}

export const SIMILAR_SPEC: SSpec = {
  id: 'sim',
  finds: [['side', 'A missing side'], ['EC', 'Parallel line: find EC'], ['AE', 'Parallel line: find AE'], ['AD', 'Parallel line: find AD'], ['DB', 'Parallel line: find DB'], ['area', 'Area of a similar triangle'], ['shadow', 'Height from a shadow'], ['sss', 'Are they similar? (3 sides)'], ['aa', 'Are they similar? (2 angles)']],
  fields: [
    { k: 's1', label: 'A side of triangle 1', units: LEN, ph: 'e.g. 6', show: (c) => c.find === 'side' || c.find === 'area' },
    { k: 's2', label: 'Its matching side in triangle 2', units: LEN, ph: 'e.g. 9', show: (c) => c.find === 'side' || c.find === 'area' },
    { k: 't1', label: 'Another side of triangle 1', units: LEN, ph: 'e.g. 8', show: (c) => c.find === 'side' },
    { k: 'ar1', label: 'Area of triangle 1', units: AREA, ph: 'e.g. 24', show: (c) => c.find === 'area' },
    { k: 'AD', label: 'AD', units: LEN, ph: 'e.g. 3', show: (c) => ['EC', 'AE', 'DB'].includes(c.find) },
    { k: 'DB', label: 'DB', units: LEN, ph: 'e.g. 5', show: (c) => ['EC', 'AE', 'AD'].includes(c.find) },
    { k: 'AE', label: 'AE', units: LEN, ph: 'e.g. 4.5', show: (c) => ['EC', 'AD', 'DB'].includes(c.find) },
    { k: 'EC', label: 'EC', units: LEN, ph: 'e.g. 7.5', show: (c) => ['AE', 'AD', 'DB'].includes(c.find) },
    { k: 'h1', label: 'Height of the object you know', units: LEN2, ph: 'e.g. 1.5', show: (c) => c.find === 'shadow' },
    { k: 'sh1', label: 'Its shadow', units: LEN2, ph: 'e.g. 2', show: (c) => c.find === 'shadow' },
    { k: 'sh2', label: 'Shadow of the one to find', units: LEN2, ph: 'e.g. 12', show: (c) => c.find === 'shadow' },
    { k: 'l1', label: 'Sides of triangle 1', kind: 'list', ph: 'e.g. 3 4 5', show: (c) => c.find === 'sss' },
    { k: 'l2', label: 'Sides of triangle 2', kind: 'list', ph: 'e.g. 6 8 10', show: (c) => c.find === 'sss' },
    { k: 'q1', label: 'Two angles of triangle 1 (degrees)', kind: 'list', ph: 'e.g. 50 60', show: (c) => c.find === 'aa' },
    { k: 'q2', label: 'Two angles of triangle 2 (degrees)', kind: 'list', ph: 'e.g. 60 70', show: (c) => c.find === 'aa' },
  ],
  presets: [
    { name: 'Sides 6 and 8 in one, 9 in the other: find the matching side', find: 'side', vals: { s1: '6', s2: '9', t1: '8' } },
    { name: 'DE ∥ BC: AD = 3, DB = 5, AE = 4.5: find EC', find: 'EC', vals: { AD: '3', DB: '5', AE: '4.5' } },
    { name: 'Triangle of area 24 cm², sides 6 and 9: other area', find: 'area', vals: { s1: '6', s2: '9', ar1: '24' } },
    { name: 'Pole 1.5 m casts 2 m shadow; tree casts 12 m', find: 'shadow', vals: { h1: '1.5', sh1: '2', sh2: '12' } },
    { name: 'Sides 3 4 5 and 12 9 15: similar?', find: 'sss', vals: { l1: '3 4 5', l2: '12 9 15' } },
    { name: 'Angles 50, 60 and 60, 70: similar?', find: 'aa', vals: { q1: '50 60', q2: '60 70' } },
  ],
  solve: (i, c) => solveSimilar(i, c.find),
};

// "Solve my numbers" for coordinate geometry (Class 10 and 11): the type, sides, area and angles of a triangle from
// its corners, distance, midpoint, slope and line equation for two points, the section formula (internal or
// external), and where a line cuts the axes. Points are typed as "x, y". No DOM.
import { type SSpec, type SIn, type SOut, sf } from '../learn/solvecore-b.ts';
import { type Pt, classify, angles, surd, d2, area2, slope } from './coord-triangle.ts';
import { section, midpoint, centroid, axisCut } from './coord-school.ts';
import { rat } from './smath.ts';

const z0 = (x: number) => (Math.abs(x) < 1e-10 ? 0 : x);
const n5 = (x: number) => sf(z0(x), 5);
const pt = (P: Pt) => `(${n5(P[0])}, ${n5(P[1])})`;
const par = (x: number) => (x < 0 ? `(${sf(x, 6)})` : sf(x, 6));
const fr = (x: number) => { const r = rat(x, 1000); return r && r[1] > 1 ? `${String(r[0]).replace('-', '−')}/${r[1]}` : n5(x); };
const getPt = (l: number[], name: string): Pt | string => (l.length === 2 ? [l[0], l[1]] : `${name} needs two numbers: x, y (for example 3, -2). You gave ${l.length}.`);
const dist = (P: Pt, Q: Pt) => `√((${par(Q[0])} − ${par(P[0])})² + (${par(Q[1])} − ${par(P[1])})²)`;
/** √n in simplest form with its decimal value, when n is a whole number. */
const root = (n: number) => { const s = surd(n); return s && !/^\d+$/.test(s) && s !== `√${n}` ? `√${sf(n, 6)} = ${s} ≈ ${sf(Math.sqrt(n), 5)}` : `√${sf(n, 6)} = ${sf(Math.sqrt(n), 5)}`; };

export function triangle(A: Pt, B: Pt, C: Pt): SOut {
  const k = classify(A, B, C);
  if (k.same === 3) return { error: 'All three points are the same point, so there is no triangle. Change at least two of them.' };
  const [ab, bc, ca] = k.sides, lines = [`AB = ${dist(A, B)} = ${root(ab)}`, `BC = ${dist(B, C)} = ${root(bc)}`, `CA = ${dist(C, A)} = ${root(ca)}`];
  const a2 = area2(A, B, C);
  lines.push(`Area = ½|x₁(y₂ − y₃) + x₂(y₃ − y₁) + x₃(y₁ − y₂)| = ½|${par(A[0])}(${par(B[1])} − ${par(C[1])}) + ${par(B[0])}(${par(C[1])} − ${par(A[1])}) + ${par(C[0])}(${par(A[1])} − ${par(B[1])})| = ½ × ${n5(Math.abs(a2))} = ${n5(k.area)}`);
  if (k.collinear) {
    const which = k.middle ? ` ${k.middle} lies between the other two points, because the two shorter distances add to the longest.` : ' Two of the points are the same.';
    return { answer: `The three points are collinear: they lie on one straight line (area 0).${which}`, lines, tip: 'Common mistake: calling points collinear when the area is only close to 0. Work with exact numbers. Three points are collinear exactly when the area is 0, or when the slopes AB and BC are equal.' };
  }
  const peri = Math.sqrt(ab) + Math.sqrt(bc) + Math.sqrt(ca), ang = angles(A, B, C), G = centroid(A, B, C);
  const sides = k.bySides === 'equilateral' ? 'equilateral (all three sides equal)' : k.bySides === 'isosceles' ? `isosceles (${k.equalPairs.join(' and ')} are equal)` : 'scalene (no two sides equal)';
  const big = Math.max(ab, bc, ca), rest = ab + bc + ca - big;
  lines.push(`By sides: ${sides}`, `By angles: the longest side squared is ${sf(big, 6)} and the other two squared add to ${sf(rest, 6)}, so the triangle is ${k.byAngles === 'right' ? `right-angled at ${k.at} (Pythagoras holds)` : k.byAngles === 'obtuse' ? `obtuse (the angle at ${k.at} is more than 90°)` : 'acute (all angles less than 90°)'}`, `Angles: A = ${sf(ang[0], 4)}°, B = ${sf(ang[1], 4)}°, C = ${sf(ang[2], 4)}°`, `Perimeter = ${sf(peri, 5)}`, `Centroid = ((x₁ + x₂ + x₃)/3, (y₁ + y₂ + y₃)/3) = ${pt(G)}`);
  const by = k.bySides === 'equilateral' ? 'equilateral' : k.bySides === 'isosceles' ? 'isosceles' : 'scalene';
  return { answer: `ABC is ${by === 'isosceles' ? 'an' : 'a'} ${by}${k.byAngles === 'right' ? `, right-angled triangle (right angle at ${k.at})` : k.byAngles === 'obtuse' ? `, obtuse triangle` : ', acute triangle'}, with area ${n5(k.area)} square units and perimeter ${sf(peri, 4)}.`, lines, tip: 'Common mistake: comparing the distances before squaring but adding them. For the right angle test compare squares: AB² + BC² = CA². Do not add the square roots.' };
}

export function twoPoints(A: Pt, B: Pt): SOut {
  const s = d2(A, B);
  if (s === 0) return { error: 'The two points are the same point, so the distance is 0 and there is no line through them. Change one point.' };
  const M = midpoint(A, B), m = slope(A, B), lines = [`Distance AB = ${dist(A, B)} = ${root(s)}`, `Midpoint = ((x₁ + x₂)/2, (y₁ + y₂)/2) = ((${par(A[0])} + ${par(B[0])})/2, (${par(A[1])} + ${par(B[1])})/2) = ${pt(M)}`];
  if (!Number.isFinite(m)) lines.push(`Slope: x₂ = x₁, so the line is vertical and its slope is not defined. Equation: x = ${n5(A[0])}`);
  else { const c = A[1] - m * A[0]; lines.push(`Slope m = (y₂ − y₁)/(x₂ − x₁) = (${par(B[1])} − ${par(A[1])})/(${par(B[0])} − ${par(A[0])}) = ${fr(m)}`, `Line: y − y₁ = m(x − x₁), which gives y = ${m === 0 ? '' : `${/\//.test(fr(m)) ? `(${fr(m)})` : fr(m)}x`}${m === 0 ? fr(c) : c === 0 ? '' : ` ${c < 0 ? '−' : '+'} ${fr(Math.abs(c))}`}`); }
  return { answer: `AB = ${sf(Math.sqrt(s), 5)}${surd(s) && !/^\d+$/.test(surd(s)!) ? ` (${surd(s)})` : ''} and the midpoint is ${pt(M)}.`, lines, tip: 'Common mistake: the distance formula needs a square root at the end, and the midpoint formula adds the coordinates then divides by 2 (it is not the distance divided by 2).' };
}

export function sectionPoint(A: Pt, B: Pt, m: number, n: number, external: boolean): SOut {
  if (!(m > 0) || !(n > 0)) return { error: 'The ratio m : n needs two positive numbers, such as 2 and 3.' };
  if (external && m === n) return { error: 'A point cannot divide a segment externally in the ratio 1 : 1 (it would be at infinity). Use a different ratio.' };
  const P = section(A, B, m, n, external), d = external ? m - n : m + n, s = external ? '−' : '+';
  return { answer: `The point dividing AB ${external ? 'externally' : 'internally'} in the ratio ${sf(m, 4)} : ${sf(n, 4)} is ${pt(P)}.`, lines: [`Section formula (${external ? 'external' : 'internal'}): P = ((m x₂ ${s} n x₁)/(m ${s} n), (m y₂ ${s} n y₁)/(m ${s} n))`, `x = (${sf(m, 5)} × ${par(B[0])} ${s} ${sf(n, 5)} × ${par(A[0])}) / ${sf(d, 5)} = ${n5(P[0])}`, `y = (${sf(m, 5)} × ${par(B[1])} ${s} ${sf(n, 5)} × ${par(A[1])}) / ${sf(d, 5)} = ${n5(P[1])}`], tip: 'Common mistake: swapping m and n. The ratio m : n is AP : PB, so the x₂ (the end B) is multiplied by m, and x₁ (the start A) by n.' };
}

export function axisCuts(A: Pt, B: Pt, axis: string): SOut {
  const r = axisCut(A, B, axis === 'y' ? 'y' : 'x'), i = axis === 'y' ? 0 : 1, nm = axis === 'y' ? 'y-axis' : 'x-axis';
  if (d2(A, B) === 0) return { error: 'A and B are the same point. Give two different points.' };
  if (!r) return { error: A[i] === 0 ? `The line AB lies along the ${nm}.` : `The line AB is parallel to the ${nm}, so it never crosses it.` };
  if (!Number.isFinite(r.k)) return { answer: `B itself lies on the ${nm}, so the ${nm} meets AB at B ${pt(B)}.`, lines: [`The coordinate of B along that axis is 0, so B is on the ${nm}.`] };
  const k = r.k, ext = k < 0, rr = rat(Math.abs(k), 1000), ratio = rr ? `${rr[0]} : ${rr[1]}` : `${sf(Math.abs(k), 4)} : 1`;
  const lines = [`Let the ${nm} cut AB at P in the ratio k : 1. The ${axis === 'y' ? 'x' : 'y'}-coordinate of P is 0 on the ${nm}.`, axis === 'y' ? `x = (k × ${par(B[0])} + ${par(A[0])}) / (k + 1) = 0, so k = −${par(A[0])} / ${par(B[0])} = ${fr(k)}` : `y = (k × ${par(B[1])} + ${par(A[1])}) / (k + 1) = 0, so k = −${par(A[1])} / ${par(B[1])} = ${fr(k)}`, `P = ${pt(r.P)}`];
  lines.push(ext ? 'k is negative, so P is outside the segment AB: it divides AB externally.' : 'k is positive, so P is between A and B: it divides AB internally.');
  return { answer: `The ${nm} cuts AB at ${pt(r.P)}, dividing it ${ext ? 'externally' : 'internally'} in the ratio ${ratio}.`, lines, tip: 'Common mistake: forgetting the minus sign in k = −y₁/y₂. A negative k does not mean a mistake: it means the point lies outside AB.' };
}

export const COORD_SPEC: SSpec = {
  id: 'coord',
  finds: [['tri', 'Type, sides and area of a triangle'], ['two', 'Distance, midpoint and line through two points'], ['sec', 'Section formula (point dividing AB)'], ['axis', 'Where line AB cuts an axis']],
  fields: [
    { k: 'A', label: 'Point A: x, y', kind: 'list', neg: true, ph: 'e.g. 1, 1' },
    { k: 'B', label: 'Point B: x, y', kind: 'list', neg: true, ph: 'e.g. 5, 1' },
    { k: 'C', label: 'Point C: x, y', kind: 'list', neg: true, ph: 'e.g. 1, 4', show: (c) => c.find === 'tri' },
    { k: 'm', label: 'Ratio m (AP : PB)', ph: 'e.g. 2', show: (c) => c.find === 'sec' },
    { k: 'n', label: 'Ratio n', ph: 'e.g. 3', show: (c) => c.find === 'sec' },
    { k: 'kind', label: 'Divides', kind: 'choice', options: [['in', 'Internally'], ['ex', 'Externally']], def: 'in', show: (c) => c.find === 'sec' },
    { k: 'which', label: 'Which axis', kind: 'choice', options: [['x', 'x-axis (y = 0)'], ['y', 'y-axis (x = 0)']], def: 'x', show: (c) => c.find === 'axis' },
  ],
  presets: [
    { name: 'A(1, 1), B(5, 1), C(1, 4)', find: 'tri', vals: { A: '1, 1', B: '5, 1', C: '1, 4' } },
    { name: 'A(0, 0), B(4, 0), C(2, 3)', find: 'tri', vals: { A: '0, 0', B: '4, 0', C: '2, 3' } },
    { name: 'Distance and line through (2, 3) and (−4, 1)', find: 'two', vals: { A: '2, 3', B: '-4, 1' } },
    { name: 'Divide (−1, 7) and (4, −3) in the ratio 2 : 3', find: 'sec', ch: { kind: 'in' }, vals: { A: '-1, 7', B: '4, -3', m: '2', n: '3' } },
    { name: 'Ratio in which the x-axis cuts (2, −3) and (5, 6)', find: 'axis', ch: { which: 'x' }, vals: { A: '2, -3', B: '5, 6' } },
  ],
  solve: (i: Record<string, SIn>, c) => {
    const names: [string, string][] = [['A', 'Point A'], ['B', 'Point B'], ...(c.find === 'tri' ? [['C', 'Point C'] as [string, string]] : [])];
    const P = names.map(([k, n]) => getPt(i[k].list, n));
    const bad = P.find((x) => typeof x === 'string'); if (bad) return { error: bad as string };
    const [A, B, C] = P as Pt[];
    if (c.find === 'tri') return triangle(A, B, C);
    if (c.find === 'two') return twoPoints(A, B);
    if (c.find === 'sec') return sectionPoint(A, B, i.m.v, i.n.v, c.ch.kind === 'ex');
    return axisCuts(A, B, c.ch.which ?? 'x');
  },
};

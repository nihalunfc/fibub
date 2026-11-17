// "Solve my numbers" for maxima and minima (Class 12): the turning points of a polynomial by the second derivative
// test (first derivative test when f″ = 0), absolute extremes on an interval, and the open box, fence and can stories.
import { type SSpec, type SIn, type SOut, sf } from '../learn/solvecore-b.ts';
import { type Poly, evalP, derivP, trimP, realRoots, polyText } from './solve-poly.ts';

const z0 = (x: number) => (Math.abs(x) < 1e-9 ? 0 : x);
const v5 = (x: number) => sf(z0(x), 5);
const at = (x: number) => (x < 0 ? `(${sf(x, 5)})` : sf(x, 5));

export function turning(co: number[], lo?: number, hi?: number): SOut {
  const f = trimP(co), deg = f.length - 1;
  if (co.length < 2 || deg < 1) return { error: 'Give the coefficients of a polynomial, highest power first, for example 1 0 -3 0 for x³ − 3x.' };
  if (deg > 4) return { error: 'This card handles polynomials up to degree 4 (five numbers). For other functions use the grapher further down the page.' };
  if (deg === 1) return { answer: 'A straight line has no turning points.', lines: [`f(x) = ${polyText(f)}`, `f′(x) = ${sf(f[0], 5)}, which is never 0, so f never turns round.`], tip: 'A straight line keeps rising or falling. On a closed interval its largest and smallest values are at the two ends.' };
  const d1 = derivP(f), d2 = derivP(d1), crit = realRoots(d1).map((x) => (Math.abs(x) < 1e-12 ? 0 : x));
  const lines = [`f(x) = ${polyText(f)}`, `f′(x) = ${polyText(d1)}`, `f″(x) = ${polyText(d2)}`];
  const found: { x: number; y: number; kind: 'max' | 'min' | 'none' }[] = [];
  if (!crit.length) lines.push('f′(x) = 0 has no real solution, so f has no turning points.');
  else lines.push(`Set f′(x) = 0: x = ${crit.map((x) => v5(x)).join(' or x = ')}`);
  crit.forEach((x, k) => {
    const y = evalP(f, x), s = evalP(d2, x), scale = Math.max(1, ...f.map(Math.abs)) * Math.max(1, Math.abs(x)) ** deg;
    let kind: 'max' | 'min' | 'none';
    let why: string;
    if (Math.abs(s) > 1e-9 * scale) { kind = s < 0 ? 'max' : 'min'; why = `f″(${v5(x)}) = ${v5(s)} ${s < 0 ? '< 0, so a local maximum' : '> 0, so a local minimum'}`; }
    else {
      const gap = Math.min(...crit.filter((_, j) => j !== k).map((c) => Math.abs(c - x)), 1), h = Math.min(1e-3, gap / 3), l = evalP(d1, x - h), r = evalP(d1, x + h);
      kind = l > 0 && r < 0 ? 'max' : l < 0 && r > 0 ? 'min' : 'none';
      why = `f″(${v5(x)}) = 0, so the second derivative test fails. First derivative test: f′ goes ${l > 0 ? '+' : '−'} to ${r > 0 ? '+' : '−'} across x = ${v5(x)}, so ${kind === 'max' ? 'a local maximum' : kind === 'min' ? 'a local minimum' : 'it is neither a maximum nor a minimum (a point of inflexion)'}`;
    }
    lines.push(`At x = ${v5(x)}: ${why}; f(${v5(x)}) = ${v5(y)}`);
    found.push({ x, y, kind });
  });
  const parts = found.filter((c) => c.kind !== 'none').map((c) => `a local ${c.kind === 'max' ? 'maximum' : 'minimum'} of ${v5(c.y)} at x = ${v5(c.x)}`);
  let answer = parts.length ? `f has ${parts.length > 1 ? `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}` : parts[0]}.` : crit.length ? 'f has no maximum or minimum: it flattens at that point but keeps going the same way.' : 'f has no turning points.';
  let tip = 'Common mistake: calling every point where f′ = 0 a maximum or minimum. Check the sign of f″ (or of f′ either side). Also, “local” means only near that point, and the value at a local maximum can be lower than at a local minimum elsewhere.';
  if (lo !== undefined && hi !== undefined) {
    if (!(lo < hi)) return { error: 'The start a must be smaller than the end b of the interval.' };
    const cand = [{ x: lo, y: evalP(f, lo), n: 'end' }, { x: hi, y: evalP(f, hi), n: 'end' }, ...found.filter((c) => c.x > lo && c.x < hi).map((c) => ({ x: c.x, y: c.y, n: 'turn' }))];
    const mx = cand.reduce((m, c) => (c.y > m.y ? c : m)), mn = cand.reduce((m, c) => (c.y < m.y ? c : m));
    lines.push(`On [${sf(lo, 5)}, ${sf(hi, 5)}] compare f at the ends and at the turning points inside: ${cand.map((c) => `f(${v5(c.x)}) = ${v5(c.y)}`).join(', ')}`);
    answer += ` On [${sf(lo, 5)}, ${sf(hi, 5)}]: absolute maximum ${v5(mx.y)} at x = ${v5(mx.x)}, absolute minimum ${v5(mn.y)} at x = ${v5(mn.x)}.`;
    tip += ' For an interval [a, b], always check the end points too: the absolute largest or smallest value can sit there.';
  }
  return { answer, lines, tip };
}

export function box(s: number, u: string): SOut {
  if (!(s > 0)) return { error: 'The side of the sheet must be more than 0.' };
  const x = s / 6, base = s - 2 * x, V = 2 * s ** 3 / 27;
  return { answer: `Cut ${sf(x, 4)} ${u} squares from each corner: the biggest box holds ${sf(V, 4)} ${u}³.`, lines: [`Cut a square of side x from each corner of a sheet of side s = ${sf(s, 5)} ${u}. The box has base (s − 2x) by (s − 2x) and height x.`, 'V = x(s − 2x)² = s²x − 4sx² + 4x³', 'dV/dx = s² − 8sx + 12x² = (s − 2x)(s − 6x) = 0, so x = s/2 (no box left, V = 0) or x = s/6', `d²V/dx² = 24x − 8s = −4s < 0 at x = s/6, so x = s/6 gives the maximum`, `x = ${sf(s, 5)} / 6 = ${sf(x, 4)} ${u}; base = ${sf(s, 5)} − 2 × ${sf(x, 4)} = ${sf(base, 4)} ${u}`, `V = x(s − 2x)² = ${sf(x, 4)} × ${sf(base, 4)}² = ${sf(V, 4)} ${u}³ (check: 2s³/27 = ${sf(V, 4)})`], tip: 'Common mistake: giving x = s/2. That cut leaves no base at all (V = 0), so it is the minimum, not the maximum.' };
}

export function fence(L: number, u: string): SOut {
  if (!(L > 0)) return { error: 'The length of fencing must be more than 0.' };
  const x = L / 4, A = L * L / 8;
  return { answer: `Make the two sides ${sf(x, 4)} ${u} and the side along the river ${sf(L / 2, 4)} ${u}: the biggest area is ${sf(A, 4)} ${u}².`, lines: [`Fence ${sf(L, 5)} ${u} on three sides (the river is the fourth). Two sides of length x and one of length L − 2x.`, 'A = x(L − 2x) = Lx − 2x²', 'dA/dx = L − 4x = 0, so x = L/4', 'd²A/dx² = −4 < 0, so this is a maximum', `x = ${sf(L, 5)} / 4 = ${sf(x, 4)} ${u}; the long side = L − 2x = ${sf(L / 2, 4)} ${u}`, `A = ${sf(x, 4)} × ${sf(L / 2, 4)} = ${sf(A, 4)} ${u}²`], tip: 'Common mistake: fencing all four sides. If a river or wall forms one side, only three sides need fence, and the long side is twice the short sides.' };
}

export function can(V: number): SOut {
  if (!(V > 0)) return { error: 'The volume must be more than 0.' };
  const r = Math.cbrt(V / (2 * Math.PI)), h = V / (Math.PI * r * r), S = 2 * Math.PI * r * r + 2 * V / r;
  return { answer: `Radius ${sf(r, 4)} cm and height ${sf(h, 4)} cm (h = 2r) use the least metal: ${sf(S, 4)} cm².`, lines: [`Volume V = πr²h = ${sf(V, 5)} cm³, so h = V / (πr²)`, 'Surface area S = 2πr² + 2πrh = 2πr² + 2V / r', 'dS/dr = 4πr − 2V/r² = 0, so r³ = V / 2π', 'd²S/dr² = 4π + 4V/r³ > 0, so this is a minimum', `r = (V / 2π)^(1/3) = (${sf(V, 5)} / ${sf(2 * Math.PI, 5)})^(1/3) = ${sf(r, 4)} cm`, `h = V / (πr²) = ${sf(h, 4)} cm, which is 2r = ${sf(2 * r, 4)} cm`, `S = 2π(${sf(r, 4)})² + 2π(${sf(r, 4)})(${sf(h, 4)}) = ${sf(S, 4)} cm²`], tip: 'Common mistake: forgetting that h = V/(πr²) must be put into S before differentiating. The least-metal can is as tall as it is wide (h = 2r).' };
}

const LEN: [string, number][] = [['cm', 1], ['m', 1], ['in', 1]];
export const MAXMIN_SPEC: SSpec = {
  id: 'maxmin',
  finds: [['poly', 'Turning points of a polynomial'], ['box', 'Biggest open box from a square sheet'], ['fence', 'Biggest fenced area by a river'], ['can', 'Closed can with least metal']],
  fields: [
    { k: 'co', label: 'Coefficients of f(x), highest power first', kind: 'list', neg: true, ph: 'e.g. 1 0 -3 0 for x³ − 3x', show: (c) => c.find === 'poly' },
    { k: 'a', label: 'Interval from a (optional)', neg: true, optional: true, ph: 'e.g. 0', show: (c) => c.find === 'poly' },
    { k: 'b', label: 'Interval to b (optional)', neg: true, optional: true, ph: 'e.g. 3', show: (c) => c.find === 'poly' },
    { k: 's', label: 'Side of the square sheet', units: LEN, ph: 'e.g. 30', show: (c) => c.find === 'box' },
    { k: 'L', label: 'Length of fencing', units: [['m', 1], ['ft', 1], ['cm', 1]], ph: 'e.g. 100', show: (c) => c.find === 'fence' },
    { k: 'V', label: 'Volume of the can', units: [['cm³', 1], ['litres', 1000], ['m³', 1e6]], ph: 'e.g. 1', show: (c) => c.find === 'can' },
  ],
  presets: [
    { name: 'f(x) = x³ − 3x', find: 'poly', vals: { co: '1 0 -3 0' } },
    { name: 'f(x) = 2x³ − 9x² + 12x + 5 on [0, 3]', find: 'poly', vals: { co: '2 -9 12 5', a: '0', b: '3' } },
    { name: 'Open box from a 30 cm sheet', find: 'box', vals: { s: ['30', 'cm'] } },
    { name: '100 m of fence beside a river', find: 'fence', vals: { L: ['100', 'm'] } },
    { name: 'Closed can of 1 litre', find: 'can', vals: { V: ['1', 'litres'] } },
  ],
  solve: (i: Record<string, SIn>, c) => {
    if (c.find === 'poly') {
      const a = i.a, b = i.b;
      if (a.blank !== b.blank) return { error: 'For an interval give both a and b, or leave both blank.' };
      return turning(i.co.list, a.blank ? undefined : a.v, b.blank ? undefined : b.v);
    }
    if (c.find === 'box') return box(i.s.typed, i.s.u);
    if (c.find === 'fence') return fence(i.L.typed, i.L.u);
    return can(i.V.v);
  },
};

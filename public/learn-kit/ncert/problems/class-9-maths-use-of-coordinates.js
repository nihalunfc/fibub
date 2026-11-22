// Class 9 Maths, Orienting Yourself: The Use of Coordinates: live problems (original fibub questions). Ids start with c9m-coord-.
import { pick, choose, n, steps } from './_util.js';

const pt = (x, y) => `(${x}, ${y})`.replace(/-/g, '−');
const nz = (r, a, b) => { const v = pick(r, a, b); return v || b; };
export default {
  'c9m-coord-quad': {
    title: 'which quadrant',
    make(r) {
      const x = nz(r, -9, 9), y = nz(r, -9, 9), answer = x > 0 && y > 0 ? 1 : x < 0 && y > 0 ? 2 : x < 0 && y < 0 ? 3 : 4;
      return { x, y, q: `<p>In which quadrant does the point ${pt(x, y)} lie? Answer with the number 1, 2, 3 or 4 (I, II, III, IV).</p>`, answer, abs: 0.01, tol: 0, unit: '',
        hint: 'Quadrant I is (+, +), II is (−, +), III is (−, −), IV is (+, −). Go anticlockwise from the top right.',
        solution: steps(`x = ${x} is ${x > 0 ? 'positive' : 'negative'} and y = ${y} is ${y > 0 ? 'positive' : 'negative'}.`, `The signs (${x > 0 ? '+' : '−'}, ${y > 0 ? '+' : '−'}) mean quadrant <b>${answer}</b>.`) };
    },
    verify: (p) => { const a = (Math.atan2(p.y, p.x) * 180) / Math.PI; return a > 0 && a < 90 ? 1 : a >= 90 ? 2 : a < -90 ? 3 : 4; },
  },
  'c9m-coord-parallel': {
    title: 'distance on a line parallel to an axis',
    make(r) {
      const k = pick(r, -8, 8), x1 = pick(r, -9, 4), x2 = x1 + pick(r, 3, 12), flip = r() < 0.5, answer = x2 - x1;
      return { k, x1, x2, flip, q: flip ? `<p>Find the distance between ${pt(k, x1)} and ${pt(k, x2)}.</p>` : `<p>Find the distance between ${pt(x1, k)} and ${pt(x2, k)}.</p>`, answer, abs: 0.01, tol: 0, unit: 'units',
        hint: 'One coordinate is the same, so the points lie on a line parallel to an axis. Subtract the coordinate that changes.',
        solution: steps(`The ${flip ? 'x' : 'y'}-coordinates are equal (${k}), so only the ${flip ? 'y' : 'x'}-coordinate changes.`, `Distance = |${x2} − (${x1})| = <b>${n(answer)}</b> units.`.replace(/-/g, '−')) };
    },
    verify: (p) => Math.hypot(p.flip ? 0 : p.x2 - p.x1, p.flip ? p.x2 - p.x1 : 0),
  },
  'c9m-coord-dist': {
    title: 'distance between two points',
    make(r) {
      const [a, b, c] = choose(r, [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15]]), sx = choose(r, [-1, 1]), sy = choose(r, [-1, 1]), x1 = pick(r, -6, 4), y1 = pick(r, -6, 4);
      const x2 = x1 + sx * a, y2 = y1 + sy * b;
      return { x1, y1, x2, y2, q: `<p>Find the distance between A${pt(x1, y1)} and B${pt(x2, y2)}.</p>`, answer: c, abs: 0.01, tol: 0, unit: 'units',
        hint: 'Draw the right triangle: one leg is the difference of the x-coordinates, the other is the difference of the y-coordinates. Then use Pythagoras.',
        solution: steps(`Across: |${x2} − (${x1})| = ${a}. Up or down: |${y2} − (${y1})| = ${b}.`.replace(/-/g, '−'), `d² = ${a}² + ${b}² = ${a * a + b * b}.`, `d = <b>${c}</b> units.`) };
    },
    verify: (p) => Math.sqrt((p.x2 - p.x1) ** 2 + (p.y2 - p.y1) ** 2),
  },
  'c9m-coord-taxi': {
    title: 'blocks to walk along the streets',
    make(r) {
      const x1 = pick(r, 0, 4), y1 = pick(r, 0, 4), dx = pick(r, 1, 6), dy = pick(r, 1, 6), x2 = x1 + dx * choose(r, [1, 1, -1]) , y2 = y1 + dy, answer = Math.abs(x2 - x1) + Math.abs(y2 - y1);
      return { x1, y1, x2, y2, q: `<p>A town has streets along every whole-number x and y line. You walk from the school at ${pt(x1, y1)} to the market at ${pt(x2, y2)} along the streets, never cutting across a block. How many blocks do you walk (the shortest street route)?</p>`, answer, abs: 0.01, tol: 0, unit: 'blocks',
        hint: 'Walking only along the grid, you must cover the whole x-difference and the whole y-difference.',
        solution: steps(`Across: |${x2} − ${x1}| = ${Math.abs(x2 - x1)} blocks.`, `Up: |${y2} − ${y1}| = ${Math.abs(y2 - y1)} blocks.`, `Total = <b>${answer}</b> blocks (the straight-line distance would be shorter).`) };
    },
    verify: (p) => { let x = p.x1, y = p.y1, c = 0; while (x !== p.x2) { x += Math.sign(p.x2 - x); c++; } while (y !== p.y2) { y += Math.sign(p.y2 - y); c++; } return c; },
  },
  'c9m-coord-fourth': {
    title: 'the fourth vertex of a parallelogram',
    make(r) {
      const A = [pick(r, -6, 0), pick(r, -6, 0)], B = [A[0] + pick(r, 3, 7), A[1] + pick(r, -2, 2)], C = [B[0] + pick(r, -2, 3), B[1] + pick(r, 3, 7)], ask = choose(r, ['x', 'y']);
      const M = [(A[0] + C[0]) / 2, (A[1] + C[1]) / 2], D = [2 * M[0] - B[0], 2 * M[1] - B[1]];
      return { A, B, C, ask, q: `<p>A(${pt(A[0], A[1]).slice(1, -1)}), B(${pt(B[0], B[1]).slice(1, -1)}) and C(${pt(C[0], C[1]).slice(1, -1)}) are three vertices of a parallelogram ABCD, taken in order. Find the ${ask}-coordinate of D.</p>`, answer: ask === 'x' ? D[0] : D[1], abs: 0.01, tol: 0, unit: '',
        hint: 'The diagonals AC and BD of a parallelogram share a mid-point. Find the mid-point of AC, then D = 2 × (mid-point) − B.',
        solution: steps(`Mid-point of AC = (${n(M[0])}, ${n(M[1])}).`, `The mid-point of BD is the same, so D = 2(${n(M[0])}, ${n(M[1])}) − (${B[0]}, ${B[1]}) = (${D[0]}, ${D[1]}).`.replace(/-/g, '−'), `The ${ask}-coordinate is <b>${ask === 'x' ? D[0] : D[1]}</b>.`.replace(/-/g, '−')) };
    },
    verify: (p) => (p.ask === 'x' ? p.C[0] - (p.B[0] - p.A[0]) : p.C[1] - (p.B[1] - p.A[1])),
  },
  'c9m-coord-perim': {
    title: 'perimeter of a rectangle from two corners',
    make(r) {
      const x1 = pick(r, -8, 0), y1 = pick(r, -8, 0), w = pick(r, 2, 9), h = pick(r, 2, 9), x2 = x1 + w, y2 = y1 + h;
      return { x1, y1, x2, y2, q: `<p>A rectangle has sides parallel to the axes. Two opposite corners are ${pt(x1, y1)} and ${pt(x2, y2)}. Find its perimeter.</p>`, answer: 2 * (w + h), abs: 0.01, tol: 0, unit: 'units',
        hint: 'The other two corners are (x₁, y₂) and (x₂, y₁). The sides are the differences of the coordinates.',
        solution: steps(`Width = |${x2} − (${x1})| = ${w}, height = |${y2} − (${y1})| = ${h}.`.replace(/-/g, '−'), `Perimeter = 2(${w} + ${h}) = <b>${2 * (w + h)}</b> units.`) };
    },
    verify: (p) => { const c = [[p.x1, p.y1], [p.x2, p.y1], [p.x2, p.y2], [p.x1, p.y2]]; let s = 0; for (let i = 0; i < 4; i++) s += Math.hypot(c[i][0] - c[(i + 1) % 4][0], c[i][1] - c[(i + 1) % 4][1]); return s; },
  },
  'c9m-coord-mirror': {
    title: 'reflect a point',
    make(r) {
      const x = nz(r, -8, 8), y = nz(r, -8, 8), m = choose(r, ['x-axis', 'y-axis', 'origin']), ask = choose(r, ['x', 'y']);
      const I = m === 'x-axis' ? [x, -y] : m === 'y-axis' ? [-x, y] : [-x, -y];
      return { x, y, m, ask, q: `<p>The point ${pt(x, y)} is reflected in the ${m}. Find the ${ask}-coordinate of its image.</p>`, answer: ask === 'x' ? I[0] : I[1], abs: 0.01, tol: 0, unit: '',
        hint: 'A mirror in the x-axis flips y; a mirror in the y-axis flips x; the origin flips both.',
        solution: steps(`Reflection in the ${m}: ${m === 'x-axis' ? 'x stays, y changes sign' : m === 'y-axis' ? 'y stays, x changes sign' : 'both signs change'}.`, `Image = ${pt(I[0], I[1])}, so the ${ask}-coordinate is <b>${n(ask === 'x' ? I[0] : I[1])}</b>.`) };
    },
    verify: (p) => (p.ask === 'x' ? (p.m === 'x-axis' ? p.x : -p.x) : (p.m === 'y-axis' ? p.y : -p.y)),
  },
};

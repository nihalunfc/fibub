// Class 10 Maths, Coordinate Geometry: live problems (original fibub questions). Ids start with c10m-coord-.
import { pick, choose, n, steps } from './_util.js';

const pt = (x, y) => `(${x}, ${y})`;
export default {
  'c10m-coord-dist': {
    title: 'distance between two points',
    make(r) {
      const t = choose(r, [[3, 4], [6, 8], [5, 12], [8, 15], [1, 1], [2, 3], [4, 7], [2, 5]]), sx = choose(r, [1, -1]), sy = choose(r, [1, -1]);
      const x1 = pick(r, -6, 6), y1 = pick(r, -6, 6), x2 = x1 + sx * t[0], y2 = y1 + sy * t[1], s = t[0] ** 2 + t[1] ** 2, d = Math.sqrt(s);
      return { x1, y1, x2, y2, q: `<p>Find the distance between the points A${pt(x1, y1)} and B${pt(x2, y2)}. Give the answer correct to 2 decimal places.</p>`, answer: d, unit: 'units', tol: 0.005,
        hint: 'Use d = √[(x₂ − x₁)² + (y₂ − y₁)²].', solution: steps(`x₂ − x₁ = ${x2} − (${x1}) = ${x2 - x1} and y₂ − y₁ = ${y2} − (${y1}) = ${y2 - y1}.`, `d² = ${(x2 - x1) ** 2} + ${(y2 - y1) ** 2} = ${s}.`, `d = √${s} = <b>${n(d, 4)}</b> units.`) };
    },
    verify: (x) => Math.hypot(x.x2 - x.x1, x.y2 - x.y1),
  },
  'c10m-coord-origin': {
    title: 'distance of a point from the origin',
    make(r) {
      const t = choose(r, [[3, 4], [5, 12], [8, 6], [7, 24], [9, 12], [15, 8]]), a = t[0] * choose(r, [1, -1]), b = t[1] * choose(r, [1, -1]), d = Math.hypot(a, b);
      return { a, b, q: `<p>How far is the point P${pt(a, b)} from the origin?</p>`, answer: d, unit: 'units', tol: 0.001,
        hint: 'The origin is (0, 0), so d = √(x² + y²).', solution: steps(`d² = (${a})² + (${b})² = ${a * a} + ${b * b} = ${a * a + b * b}.`, `d = <b>${n(d)}</b> units.`) };
    },
    verify: (x) => { for (let d = 1; d < 100; d++) if (d * d === x.a * x.a + x.b * x.b) return d; return NaN; },
  },
  'c10m-coord-circle': {
    title: 'radius of a circle from its centre and a point on it',
    make(r) {
      const t = choose(r, [[3, 4], [6, 8], [5, 12], [8, 15]]), cx = pick(r, -4, 5), cy = pick(r, -4, 5), px = cx + t[0] * choose(r, [1, -1]), py = cy + t[1] * choose(r, [1, -1]), rad = Math.hypot(t[0], t[1]);
      return { cx, cy, px, py, q: `<p>A circle has its centre at C${pt(cx, cy)} and passes through P${pt(px, py)}. Find its <b>diameter</b>.</p>`, answer: 2 * rad, unit: 'units', tol: 0.001,
        hint: 'The radius is the distance from the centre to any point on the circle.', solution: steps(`Radius CP = √[(${px} − (${cx}))² + (${py} − (${cy}))²] = √${t[0] ** 2 + t[1] ** 2} = ${rad}.`, `Diameter = 2 × ${rad} = <b>${2 * rad}</b> units.`) };
    },
    verify: (x) => 2 * Math.sqrt((x.px - x.cx) ** 2 + (x.py - x.cy) ** 2),
  },
  'c10m-coord-section': {
    title: 'section formula: find the dividing point',
    make(r) {
      const m = pick(r, 1, 4), k = choose(r, [1, 2, 3, 4].filter((v) => v !== m)), N = m + k, x1 = pick(r, -4, 4) , y1 = pick(r, -4, 4), x2 = x1 + N * pick(r, 1, 3) * choose(r, [1, -1]), y2 = y1 + N * pick(r, 1, 3) * choose(r, [1, -1]), ask = choose(r, ['x', 'y']);
      const px = (m * x2 + k * x1) / N, py = (m * y2 + k * y1) / N;
      return { x1, y1, x2, y2, m, k, ask, q: `<p>The point P divides the line segment joining A${pt(x1, y1)} and B${pt(x2, y2)} internally in the ratio ${m} : ${k}. Find the <b>${ask}-coordinate</b> of P.</p>`, answer: ask === 'x' ? px : py, unit: '', abs: 0.001, tol: 0.001,
        hint: 'x = (m·x₂ + n·x₁)/(m + n) and y = (m·y₂ + n·y₁)/(m + n).', solution: steps(`Here m = ${m}, n = ${k}, so m + n = ${N}.`, ask === 'x' ? `x = (${m}×${x2} + ${k}×(${x1})) / ${N} = ${m * x2 + k * x1} / ${N} = <b>${n(px)}</b>.` : `y = (${m}×${y2} + ${k}×(${y1})) / ${N} = ${m * y2 + k * y1} / ${N} = <b>${n(py)}</b>.`) };
    },
    verify: (x) => { const t = x.m / (x.m + x.k), a = x.ask === 'x' ? [x.x1, x.x2] : [x.y1, x.y2]; return a[0] + t * (a[1] - a[0]); },
  },
  'c10m-coord-mid': {
    title: 'midpoint: find the other end of a segment',
    make(r) {
      const x1 = pick(r, -8, 8), y1 = pick(r, -8, 8), mx = pick(r, -6, 6), my = pick(r, -6, 6), ask = choose(r, ['x', 'y']);
      const x2 = 2 * mx - x1, y2 = 2 * my - y1;
      return { x1, y1, mx, my, ask, x2, y2, q: `<p>M${pt(mx, my)} is the midpoint of the segment AB, and A is ${pt(x1, y1)}. Find the <b>${ask}-coordinate</b> of B.</p>`, answer: ask === 'x' ? x2 : y2, unit: '', abs: 0.001, tol: 0.001,
        hint: 'The midpoint is the average: mx = (x₁ + x₂)/2, so x₂ = 2mx − x₁.', solution: steps(ask === 'x' ? `${mx} = (${x1} + x₂)/2, so x₂ = 2×${mx} − (${x1}) = <b>${x2}</b>.` : `${my} = (${y1} + y₂)/2, so y₂ = 2×${my} − (${y1}) = <b>${y2}</b>.`) };
    },
    verify: (x) => (x.ask === 'x' ? (x.x1 + x.answer) / 2 === x.mx : (x.y1 + x.answer) / 2 === x.my) ? x.answer : NaN,
  },
  'c10m-coord-equi': {
    title: 'a point on the x-axis equidistant from two points',
    make(r) {
      const k = pick(r, -4, 6), t = choose(r, [[1, 7, 5, 5], [1, 8, 4, 7], [2, 9, 6, 7], [2, 6, 6, 2], [5, 5, 1, 7]]), sa = choose(r, [1, -1]), sb = choose(r, [1, -1]);
      const x1 = k - sa * t[0], y1 = t[1] * choose(r, [1, -1]), x2 = k + sb * t[2], y2 = t[3] * choose(r, [1, -1]);
      return { x1, y1, x2, y2, k, q: `<p>Find the point on the x-axis that is equidistant from A${pt(x1, y1)} and B${pt(x2, y2)}. Enter its x-coordinate.</p>`, answer: k, unit: '', abs: 0.001, tol: 0.001,
        hint: 'Let the point be (x, 0) and put PA² = PB². The x² terms cancel.', solution: steps(`PA² = (x − (${x1}))² + ${y1 * y1} and PB² = (x − (${x2}))² + ${y2 * y2}.`, `Setting them equal and simplifying gives x = <b>${k}</b>.`) };
    },
    verify: (x) => { let lo = Math.min(x.x1, x.x2) - 20, hi = Math.max(x.x1, x.x2) + 20; const f = (t) => Math.hypot(t - x.x1, x.y1) - Math.hypot(t - x.x2, x.y2); for (let i = 0; i < 80; i++) { const mid = (lo + hi) / 2; if (f(lo) * f(mid) <= 0) hi = mid; else lo = mid; } return (lo + hi) / 2; },
  },
  'c10m-coord-axis': {
    title: 'in what ratio does the x-axis divide AB',
    make(r) {
      const p = pick(r, 1, 5), q = choose(r, [1, 2, 3, 4, 6].filter((v) => v !== p)), x1 = pick(r, -5, 3), x2 = x1 + pick(r, 2, 8);
      return { p, qq: q, x1, x2, q: `<p>The points A(${x1}, ${p * 2}) and B(${x2}, −${q * 2}) are joined by a line. The x-axis cuts AB at a point P. Find the ratio AP : PB as a single number AP/PB.</p>`, answer: p / q, unit: '', tol: 0.001,
        hint: 'At P, y = 0. By the section formula, 0 = (k·y₂ + y₁)/(k + 1), so k = −y₁/y₂.', solution: steps(`Let AP : PB = k : 1. Then 0 = (k·(−${q * 2}) + ${p * 2})/(k + 1).`, `So k = ${p * 2} / ${q * 2} = <b>${n(p / q)}</b>. (The ratio of the heights above and below the axis.)`) };
    },
    verify: (x) => { const y1 = x.p * 2, y2 = -x.qq * 2; return Math.abs(y1) / Math.abs(y2); },
  },
  'c10m-coord-para': {
    title: 'fourth vertex of a parallelogram',
    make(r) {
      const A = [pick(r, -3, 3), pick(r, -3, 3)], B = [A[0] + pick(r, 2, 6), A[1] + pick(r, -2, 2)], C = [B[0] + pick(r, -2, 4), B[1] + pick(r, 2, 5)], ask = choose(r, ['x', 'y']);
      const D = [A[0] + C[0] - B[0], A[1] + C[1] - B[1]];
      return { A, B, C, D, ask, q: `<p>A, B, C are three vertices of the parallelogram ABCD taken in order: A${pt(A[0], A[1])}, B${pt(B[0], B[1])}, C${pt(C[0], C[1])}. Find the <b>${ask}-coordinate</b> of D.</p>`, answer: ask === 'x' ? D[0] : D[1], unit: '', abs: 0.001, tol: 0.001,
        hint: 'The diagonals AC and BD bisect each other, so the midpoints of AC and BD are the same.', solution: steps(`Midpoint of AC = ((${A[0]} + ${C[0]})/2, (${A[1]} + ${C[1]})/2).`, `This is also the midpoint of BD, so D = A + C − B = ${pt(D[0], D[1])}.`, `The ${ask}-coordinate is <b>${ask === 'x' ? D[0] : D[1]}</b>.`) };
    },
    verify: (x) => { const M = [(x.A[0] + x.C[0]) / 2, (x.A[1] + x.C[1]) / 2]; return x.ask === 'x' ? 2 * M[0] - x.B[0] : 2 * M[1] - x.B[1]; },
  },
};

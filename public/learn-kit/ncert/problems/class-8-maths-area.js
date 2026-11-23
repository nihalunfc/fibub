// Class 8 Maths, Area: live problems (original fibub questions). Ids start with c8m-area-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c8m-area-para': {
    title: 'area of a parallelogram',
    make(r) {
      const b = pick(r, 6, 30), h = pick(r, 4, 20), sl = h + pick(r, 1, 8), answer = b * h;
      return { b, h, sl, q: `<p>A parallelogram-shaped field has a base of <b>${b} m</b>. The straight (perpendicular) distance between the base and the opposite side is <b>${h} m</b>, and the slanting side is <b>${sl} m</b>. Find its area.</p>`, answer, unit: 'm²', tol: 0.002,
        hint: 'Area = base × height. The height is the straight distance, not the slanting side.',
        solution: steps('Area = base × height (not the slanting side).', `= ${b} × ${h}.`, `= <b>${answer} m²</b>.`) };
    },
    verify(o) { const s = Math.sqrt(o.sl * o.sl - o.h * o.h), P = [[0, 0], [o.b, 0], [o.b + s, o.h], [s, o.h]]; let a = 0; for (let i = 0; i < 4; i++) { const [x1, y1] = P[i], [x2, y2] = P[(i + 1) % 4]; a += x1 * y2 - x2 * y1; } return Math.abs(a) / 2; },
  },
  'c8m-area-trap': {
    title: 'area of a trapezium',
    make(r) {
      const a = pick(r, 5, 20), b = pick(r, 6, 24), h = pick(r, 4, 16), answer = ((a + b) * h) / 2;
      return { a, b, h, q: `<p>A trapezium-shaped plot has parallel sides of <b>${a} m</b> and <b>${b} m</b>, and the distance between them is <b>${h} m</b>. Find its area.</p>`, answer, unit: 'm²', tol: 0.002,
        hint: 'Area = ½ × (sum of the parallel sides) × height.',
        solution: steps(`Sum of parallel sides = ${a} + ${b} = ${a + b}.`, `Area = ½ × ${a + b} × ${h}.`, `= <b>${n(answer, 5)} m²</b>.`) };
    },
    verify(o) { return 0.5 * o.a * o.h + 0.5 * o.b * o.h; },
  },
  'c8m-area-circle': {
    title: 'area of a circle (π = 22/7)',
    make(r) {
      const rad = choose(r, [7, 14, 21, 28, 35]), answer = (22 / 7) * rad * rad;
      return { rad, q: `<p>A circular pond has radius <b>${rad} m</b>. Find its area, using π = 22/7.</p>`, answer, unit: 'm²', tol: 0.002,
        hint: 'Area of a circle = π × r × r.',
        solution: steps(`Area = π r² = 22/7 × ${rad} × ${rad}.`, `= 22 × ${rad / 7} × ${rad} = <b>${n(answer, 6)} m²</b>.`) };
    },
    verify(o) { const C = 2 * (22 / 7) * o.rad; return (C / 2) * o.rad; },
  },
  'c8m-area-path': {
    title: 'area of a path round a garden',
    make(r) {
      const l = pick(r, 8, 30), b = pick(r, 5, 20), w = pick(r, 1, 3), answer = (l + 2 * w) * (b + 2 * w) - l * b;
      return { l, b, w, q: `<p>A rectangular garden is <b>${l} m</b> long and <b>${b} m</b> wide. A path <b>${w} m</b> wide runs all round the outside of it. Find the area of the path.</p>`, answer, unit: 'm²', tol: 0.002,
        hint: 'Area of the bigger rectangle (garden plus path) minus the area of the garden.',
        solution: steps(`Bigger rectangle: (${l} + ${2 * w}) × (${b} + ${2 * w}) = ${l + 2 * w} × ${b + 2 * w} = ${(l + 2 * w) * (b + 2 * w)} m².`, `Garden: ${l} × ${b} = ${l * b} m².`, `Path = ${(l + 2 * w) * (b + 2 * w)} − ${l * b} = <b>${answer} m²</b>.`) };
    },
    verify(o) { return 2 * o.w * (o.l + o.b) + 4 * o.w * o.w; },
  },
  'c8m-area-pick': {
    title: 'Pick’s theorem on a dot grid',
    make(r) {
      const p = pick(r, 3, 9), g = pick(r, 2, 7), I = (p - 1) * (g - 1), B = 2 * (p + g);
      return { p, g, I, B, q: `<p>A shape drawn on a dot grid has <b>${I}</b> dots strictly inside it and <b>${B}</b> dots on its boundary. Use Pick’s theorem (area = I + B/2 − 1) to find its area in square units.</p>`, answer: I + B / 2 - 1, unit: 'square units', tol: 0.002,
        hint: 'Put I and B into area = I + B ÷ 2 − 1.',
        solution: steps(`I = ${I}, B = ${B}.`, `Area = ${I} + ${B}/2 − 1 = ${I} + ${B / 2} − 1.`, `= <b>${I + B / 2 - 1} square units</b>.`) };
    },
    verify(o) { return o.p * o.g; },
  },
};

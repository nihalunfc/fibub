// Class 9 Maths, Measuring Space: Perimeter and Area: live problems (original fibub questions). Ids start with c9m-area-.
import { pick, choose, n, steps } from './_util.js';

// Triangles with whole-number sides and a whole-number area (so Heron's formula comes out clean).
const TRI = [[13, 14, 15], [5, 12, 13], [8, 15, 17], [9, 10, 17], [10, 17, 21], [7, 24, 25], [6, 25, 29], [15, 20, 25], [9, 12, 15], [17, 25, 26]];
const heron = (a, b, c) => { const s = (a + b + c) / 2; return Math.sqrt(s * (s - a) * (s - b) * (s - c)); };
// area from the longest side and the height found with the cosine rule: a different route from Heron
const viaHeight = (a, b, c) => { const [x, y, z] = [a, b, c].sort((p, q) => p - q), px = (z * z + x * x - y * y) / (2 * z), h = Math.sqrt(x * x - px * px); return 0.5 * z * h; };
const PAIRS = [[[13, 14, 15], [8, 15, 17]], [[5, 12, 13], [13, 14, 15]], [[9, 12, 15], [8, 15, 17]]];
export default {
  'c9m-area-fence': {
    title: 'area from a fence length',
    make(r) {
      const P = pick(r, 24, 80, 4), l = pick(r, 3, P / 2 - 2);
      const answer = l * (P / 2 - l);
      return { P, l, q: `<p>A farmer has <b>${P} m</b> of fencing to go all round a rectangular plot. The plot is <b>${l} m</b> long. Find its area.</p>`, answer, unit: 'm²', tol: 0.002,
        hint: 'Perimeter = 2 × (length + breadth), so find the breadth first.',
        solution: steps(`${P} = 2 × (${l} + breadth), so breadth = ${P / 2} − ${l} = ${P / 2 - l} m.`, `Area = ${l} × ${P / 2 - l}.`, `Area = <b>${n(answer, 5)} m²</b>.`) };
    },
    verify(x) { const b = (x.P - 2 * x.l) / 2; return x.l * b; },
  },
  'c9m-area-tri': {
    title: 'area of a triangle from base and height',
    make(r) {
      const b = pick(r, 6, 30), h = pick(r, 4, 24), answer = 0.5 * b * h;
      return { b, h, q: `<p>A triangular flower bed has a base of <b>${b} m</b> and a height of <b>${h} m</b> (the straight-up distance from the base to the top corner). Find its area.</p>`, answer, unit: 'm²', tol: 0.002,
        hint: 'Area of a triangle = ½ × base × height.',
        solution: steps('Area = ½ × base × height.', `= ½ × ${b} × ${h}.`, `= <b>${n(answer, 5)} m²</b>.`) };
    },
    verify(x) { return (x.b * x.h) / 2; },
  },
  'c9m-area-heron': {
    title: 'Heron’s formula',
    make(r) {
      const t = choose(r, TRI), k = choose(r, [1, 1, 2]), [a, b, c] = t.map((v) => v * k), s = (a + b + c) / 2, answer = heron(a, b, c);
      return { a, b, c, q: `<p>A triangular park has sides <b>${a} m</b>, <b>${b} m</b> and <b>${c} m</b>. Use Heron’s formula to find its area.</p>`, answer, unit: 'm²', tol: 0.002,
        hint: 's = (a + b + c) ÷ 2, then area = √(s(s − a)(s − b)(s − c)).',
        solution: steps(`s = (${a} + ${b} + ${c}) ÷ 2 = ${s}.`, `s − a = ${s - a}, s − b = ${s - b}, s − c = ${s - c}.`, `Area = √(${s} × ${s - a} × ${s - b} × ${s - c}) = √${s * (s - a) * (s - b) * (s - c)} = <b>${n(answer, 5)} m²</b>.`) };
    },
    verify(x) { return viaHeight(x.a, x.b, x.c); },
  },
  'c9m-area-quad': {
    title: 'area of a quadrilateral by a diagonal',
    make(r) {
      const d = pick(r, 8, 30), h1 = pick(r, 3, 15), h2 = pick(r, 3, 15), answer = 0.5 * d * (h1 + h2);
      return { d, h1, h2, q: `<p>In the field ABCD the diagonal AC is <b>${d} m</b>. The perpendiculars from B and D to AC are <b>${h1} m</b> and <b>${h2} m</b> long. Find the area of the field.</p>`, answer, unit: 'm²', tol: 0.002,
        hint: 'Split along AC into triangles ABC and ACD, each with base AC.',
        solution: steps(`Triangle ABC = ½ × ${d} × ${h1} = ${0.5 * d * h1}.`, `Triangle ACD = ½ × ${d} × ${h2} = ${0.5 * d * h2}.`, `Field = ${0.5 * d * h1} + ${0.5 * d * h2} = <b>${n(answer, 5)} m²</b>.`) };
    },
    verify(x) { return 0.5 * x.d * x.h1 + 0.5 * x.d * x.h2; },
  },
  'c9m-area-field': {
    title: 'cost of levelling a field',
    make(r) {
      const [t1, t2] = choose(r, PAIRS), k = choose(r, [1, 2]), rate = pick(r, 20, 90, 10);
      const A1 = heron(...t1.map((v) => v * k)), A2 = heron(...t2.map((v) => v * k)), answer = (A1 + A2) * rate;
      return { t1, t2, k, rate, q: `<p>A field ABCD is split by the diagonal AC into two triangles with sides <b>${t1.map((v) => v * k).join(' m, ')} m</b> and <b>${t2.map((v) => v * k).join(' m, ')} m</b> (the diagonal is the side they share). Levelling costs <b>₹ ${rate}</b> per square metre. Find the total cost in rupees.</p>`, answer, unit: '₹', tol: 0.002,
        hint: 'Find each triangle’s area by Heron’s formula, add them, then multiply by the rate.',
        solution: steps(`Triangle 1 (${t1.map((v) => v * k).join(', ')}): area = ${n(A1, 6)} m².`, `Triangle 2 (${t2.map((v) => v * k).join(', ')}): area = ${n(A2, 6)} m².`, `Field = ${n(A1 + A2, 6)} m², cost = ${n(A1 + A2, 6)} × ${rate} = <b>₹ ${n(answer, 6)}</b>.`) };
    },
    verify(x) { return (viaHeight(...x.t1.map((v) => v * x.k)) + viaHeight(...x.t2.map((v) => v * x.k))) * x.rate; },
  },
  'c9m-area-equi': {
    title: 'area of an equilateral triangle',
    make(r) {
      const a = pick(r, 4, 40, 2), answer = (Math.sqrt(3) / 4) * a * a;
      return { a, q: `<p>Find the area of an equilateral triangle of side <b>${a} m</b>. (Use √3 = 1.732.)</p>`, answer: (1.732 / 4) * a * a, unit: 'm²', tol: 0.003,
        hint: 'With all three sides equal to a, Heron’s formula gives area = (√3 ÷ 4) × a².',
        solution: steps(`s = 3a ÷ 2 = ${(3 * a) / 2}, and s − a = ${a / 2} for each side.`, `Area = √(${(3 * a) / 2} × ${a / 2} × ${a / 2} × ${a / 2}) = (√3 ÷ 4) × ${a}².`, `= 0.433 × ${a * a} = <b>${n((1.732 / 4) * a * a, 5)} m²</b>.`) };
    },
    verify(x) { return heron(x.a, x.a, x.a); },
  },
  'c9m-area-rhombus': {
    title: 'area of a rhombus from a side and a diagonal',
    make(r) {
      const [s, d1, d2] = choose(r, [[13, 24, 10], [5, 6, 8], [10, 16, 12], [17, 30, 16], [25, 48, 14], [15, 24, 18]]), k = choose(r, [1, 2]);
      const S = s * k, D1 = d1 * k;
      return { S, D1, q: `<p>A rhombus-shaped kite has each side <b>${S} cm</b> and one diagonal <b>${D1} cm</b>. Find its area. (Its diagonals cut each other at right angles.)</p>`, answer: 0.5 * D1 * d2 * k, unit: 'cm²', tol: 0.002,
        hint: 'Half of the first diagonal and a side make a right triangle; use Pythagoras to find half of the other diagonal. Area = ½ × d₁ × d₂.',
        solution: steps(`Half the first diagonal = ${D1 / 2}. The other half = √(${S}² − ${D1 / 2}²) = ${d2 * k / 2}.`, `d₂ = ${d2 * k} cm.`, `Area = ½ × ${D1} × ${d2 * k} = <b>${n(0.5 * D1 * d2 * k, 5)} cm²</b>.`) };
    },
    verify(x) { return 2 * heron(x.S, x.S, x.D1); },
  },
};

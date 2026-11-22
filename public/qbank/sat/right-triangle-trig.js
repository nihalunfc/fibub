// SAT Math · Geometry and trigonometry · sine, cosine, tangent, special right triangles and radians. Original (fibub).
import { int, choose, shuffleOpts, fmt, frac, steps } from './_util.js';
const F = { section: 'math', domain: 'geometry' };
const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41], [12, 35, 37], [11, 60, 61], [28, 45, 53], [33, 56, 65], [16, 63, 65]];

export default {
  topic: 'right-triangle-trig',
  gens: [
    { id: 'sat-rt-g01', type: 'mcq', marks: 1, level: 2, exams: ['sat'], sub: 'SOH CAH TOA', facets: F, format: 'single',
      make(r) {
        const [a, b, c] = choose(r, TRIPLES), fn = choose(r, ['sin', 'cos', 'tan']);
        const right = { sin: frac(a, c), cos: frac(b, c), tan: frac(a, b) }[fn];
        const o = shuffleOpts(r, right, [frac(a, c), frac(b, c), frac(a, b), frac(b, a), frac(c, a)]);
        return { q: `<p>In right triangle <i>PQR</i>, angle <i>R</i> is the right angle. The side opposite angle <i>P</i> has length ${a}, the side adjacent to angle <i>P</i> has length ${b}, and the hypotenuse has length ${c}. What is ${fn}(<i>P</i>)?</p>`, ...o,
          sol: `<p>SOH CAH TOA: sine = opposite/hypotenuse, cosine = adjacent/hypotenuse, tangent = opposite/adjacent. ${fn}(<i>P</i>) = <b>${right}</b>.</p>` };
      } },
    { id: 'sat-rt-g02', type: 'nat', marks: 1, level: 3, exams: ['sat'], sub: 'complementary angles', facets: F, format: 'numeric',
      make(r) {
        const t = choose(r, TRIPLES), a = r() < 0.5 ? t[0] : t[1], c = t[2];
        return { q: `<p>In a right triangle with acute angles <i>A</i> and <i>B</i>, sin(<i>A</i>) = ${a}/${c}. What is the value of cos(<i>B</i>)? Give a decimal or fraction.</p>`, answer: a / c, tol: 0.001, a, c,
          sol: steps(`<i>A</i> and <i>B</i> add to 90°. The side opposite <i>A</i> is the side adjacent to <i>B</i>.`, `So cos(<i>B</i>) = sin(<i>A</i>) = <b>${a}/${c}</b>.`) };
      },
      verify: (p) => p.a / p.c },
    { id: 'sat-rt-g03', type: 'nat', marks: 1, level: 3, exams: ['sat'], sub: 'special triangles', facets: F, format: 'numeric',
      make(r) {
        const s = int(r, 2, 15), kind = choose(r, ['30-60-90', '45-45-90']);
        const ans = kind === '30-60-90' ? 2 * s : s;
        return { q: kind === '30-60-90' ? `<p>In a 30°-60°-90° triangle, the side opposite the 30° angle has length ${s}. What is the length of the hypotenuse?</p>` : `<p>In a 45°-45°-90° triangle, the hypotenuse has length ${s}√2. What is the length of each leg?</p>`, answer: ans, tol: 0, s, kind,
          sol: kind === '30-60-90' ? steps(`The sides of a 30-60-90 triangle are in the ratio 1 : √3 : 2.`, `The short side is ${s}, so the hypotenuse is 2 × ${s} = <b>${2 * s}</b>.`) : steps(`The sides of a 45-45-90 triangle are in the ratio 1 : 1 : √2.`, `Hypotenuse ${s}√2 means each leg is <b>${s}</b>.`) };
      },
      verify: (p) => (p.kind === '30-60-90' ? 2 * p.s : p.s) },
    { id: 'sat-rt-g04', type: 'nat', marks: 1, level: 3, exams: ['sat'], sub: 'degrees to radians', facets: F, format: 'numeric',
      make(r) {
        const d = choose(r, [30, 45, 60, 90, 120, 135, 150, 180, 210, 240, 270, 300, 315, 360]);
        return { q: `<p>An angle measures ${d}°. Its measure in radians is <i>k</i>π. What is the value of <i>k</i>? Give a decimal or fraction.</p>`, answer: d / 180, tol: 0.001, d,
          sol: steps(`180° = π radians, so multiply by π/180.`, `${d} × π/180 = ${frac(d, 180)}π, so <i>k</i> = <b>${frac(d, 180)}</b>.`) };
      },
      verify: (p) => p.d / 180 },
    { id: 'sat-rt-g05', type: 'nat', marks: 1, level: 4, exams: ['sat'], sub: 'find a side', facets: F, format: 'numeric',
      make(r) {
        const [a, b, c] = choose(r, TRIPLES), k = choose(r, [1, 2, 3]);
        return { q: `<p>In right triangle <i>ABC</i> with the right angle at <i>C</i>, tan(<i>A</i>) = ${a}/${b} and <i>AC</i> = ${b * k}. What is the length of <i>AB</i>?</p>`, answer: c * k, tol: 0, a, b, c, k,
          sol: steps(`tan(<i>A</i>) = opposite/adjacent = <i>BC</i>/<i>AC</i> = ${a}/${b}. With <i>AC</i> = ${b * k}, <i>BC</i> = ${a * k}.`, `<i>AB</i> is the hypotenuse: √(${a * k}<sup>2</sup> + ${b * k}<sup>2</sup>) = <b>${c * k}</b>.`) };
      },
      verify: (p) => Math.hypot(p.a * p.k, p.b * p.k) },
  ],
  items: [
    { id: 'sat-rt-001', type: 'mcq', marks: 1, level: 3, exams: ['sat'], sub: 'ladder', facets: F,
      q: '<p>A 10-foot ladder leans against a wall and makes a 60° angle with the ground. How high up the wall does the ladder reach?</p>',
      options: ['5√3 feet', '5 feet', '10√3 feet', '20 feet'], answer: 0,
      sol: '<p>The height is opposite the 60° angle: sin 60° = height/10, so height = 10 × (√3/2) = <b>5√3</b> feet (about 8.7 feet). In a 30-60-90 triangle the side opposite 60° is √3 times the shortest side (5).</p>' },
  ],
};

// GRE geometry: angles, triangles, circles, coordinates and solids. All figures are described in words.
import { int, choose, numOpts, fmt, steps } from '../grad-quant/_q.js';
import { tidyGens } from '../_util.js';
const E = ['gre'];
const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]];
const r1 = (x) => Math.round(x * 10) / 10;
// Sign display tidied ("+ -3" reads "- 3", "1x" reads "x"): signs() in ../_util.js.
export default tidyGens({
  topic: 'geometry',
  gens: [
    { id: 'geo-g01', type: 'nat', level: 2, exams: E, format: 'numeric', sub: 'triangles',
      make(r) {
        const [a, b, c] = choose(r, TRIPLES), k = int(r, 1, 4), ask = int(r, 0, 1);
        const A = a * k, B = b * k, C = c * k;
        return ask === 0
          ? { q: `<p>A right triangle has legs of length ${A} and ${B}. What is the length of the hypotenuse?</p>`, answer: C, tol: 0, A, B, C, ask,
            sol: steps(`Pythagoras: c² = ${A}² + ${B}² = ${A * A} + ${B * B} = ${C * C}.`, `c = √${C * C} = <b>${C}</b>. (It is the ${a}-${b}-${c} triangle scaled by ${k}.)`), trap: 'Adding the legs instead of their squares.' }
          : { q: `<p>A right triangle has a hypotenuse of ${C} and one leg of ${A}. What is the length of the other leg?</p>`, answer: B, tol: 0, A, B, C, ask,
            sol: steps(`b² = ${C}² − ${A}² = ${C * C} − ${A * A} = ${B * B}.`, `b = <b>${B}</b>. Knowing the triples ${a}-${b}-${c} saves the arithmetic.`), trap: 'Adding the squares when you need to subtract (the hypotenuse is the longest side).' };
      },
      verify: (p) => (p.ask === 0 ? Math.hypot(p.A, p.B) : Math.sqrt(p.C * p.C - p.A * p.A)) },
    { id: 'geo-g02', type: 'mcq', level: 2, exams: E, sub: 'angles',
      make(r) {
        const top = choose(r, [20, 30, 36, 40, 50, 70, 80, 100]), base = (180 - top) / 2, ask = int(r, 0, 1);
        const value = ask === 0 ? base : 180 - base, o = numOpts(r, value, [top, 180 - top, base, 180 - base, 90 - top / 2].filter((v) => v !== value), (v) => fmt(v) + '°');
        return { q: ask === 0 ? `<p>In an isosceles triangle, the angle between the two equal sides is ${top}°. What is each of the other two angles?</p>` : `<p>In an isosceles triangle, the angle between the two equal sides is ${top}°. One of the equal sides is extended past the base. What is the exterior angle formed at that base corner?</p>`,
          options: o.options, answer: o.answer, value, top,
          sol: steps(`Angles in a triangle add to 180°. The two base angles are equal: (180 − ${top}) ÷ 2 = ${base}°.`, ask === 1 ? `An exterior angle and its interior angle make a straight line: 180 − ${base} = <b>${180 - base}°</b>.` : `Each is <b>${base}°</b>.`), trap: 'Forgetting that the two base angles share what is left of 180°.' };
      },
      check: (p) => p.value },
    { id: 'geo-g03', type: 'nat', level: 3, exams: E, format: 'numeric', sub: 'circles',
      make(r) {
        const rad = int(r, 2, 12), ask = int(r, 0, 2), PI = Math.PI;
        const v = ask === 0 ? PI * rad * rad : ask === 1 ? 2 * PI * rad : (PI * rad * rad) / 4;
        const what = ['area of the circle', 'circumference of the circle', 'area of a quarter of the circle'][ask];
        return { q: `<p>A circle has a radius of ${rad} cm. What is the ${what}, in ${ask === 1 ? 'centimetres' : 'square centimetres'}, to the nearest tenth? Use the calculator.</p>`, answer: r1(v), tol: 0.06, rad, ask,
          sol: steps(ask === 1 ? `Circumference = 2πr = 2 × π × ${rad} ≈ ${fmt(v, 3)}.` : `Area = πr² = π × ${rad}² = ${rad * rad}π ≈ ${fmt(PI * rad * rad, 3)}${ask === 2 ? `; a quarter is ${fmt(v, 3)}` : ''}.`, `To the nearest tenth: <b>${r1(v)}</b>.`), trap: 'Mixing up πr² (area) and 2πr (circumference), or using the diameter as the radius.' };
      },
      verify: (p) => r1(p.ask === 0 ? Math.PI * p.rad ** 2 : p.ask === 1 ? 2 * Math.PI * p.rad : (Math.PI * p.rad ** 2) / 4) },
    { id: 'geo-g04', type: 'nat', level: 3, exams: E, format: 'numeric', sub: 'coordinate geometry',
      make(r) {
        const x1 = int(r, -6, 6), y1 = int(r, -6, 6), [a, b] = choose(r, TRIPLES), sx = choose(r, [1, -1]), sy = choose(r, [1, -1]), x2 = x1 + sx * a, y2 = y1 + sy * b, ask = int(r, 0, 1);
        const n = (v) => String(v).replace('-', '−');
        if (ask === 0) return { q: `<p>What is the distance between the points (${n(x1)}, ${n(y1)}) and (${n(x2)}, ${n(y2)})?</p>`, answer: Math.hypot(a, b), tol: 0, x1, y1, x2, y2, ask,
          sol: steps(`Across: ${n(x2)} − ${n(x1)} = ${n(x2 - x1)}. Up: ${n(y2)} − ${n(y1)} = ${n(y2 - y1)}.`, `Distance = √(${a}² + ${b}²) = √${a * a + b * b} = <b>${Math.hypot(a, b)}</b>. The distance formula is Pythagoras on the grid.`), trap: 'Subtracting a negative coordinate wrongly: x2 − (−3) is x2 + 3.' };
        return { q: `<p>A line passes through (${n(x1)}, ${n(y1)}) and (${n(x2)}, ${n(y2)}). What is its slope? Give your answer as a decimal.</p>`, answer: (y2 - y1) / (x2 - x1), tol: 0.005, x1, y1, x2, y2, ask,
          sol: steps(`Slope = rise ÷ run = (${n(y2)} − ${n(y1)}) ÷ (${n(x2)} − ${n(x1)}) = ${n(y2 - y1)} ÷ ${n(x2 - x1)}.`, `= <b>${fmt((y2 - y1) / (x2 - x1), 4).replace('-', '−')}</b>.`), trap: 'Putting run over rise, or subtracting the points in different orders on top and bottom.' };
      },
      verify: (p) => (p.ask === 0 ? Math.hypot(p.x2 - p.x1, p.y2 - p.y1) : (p.y2 - p.y1) / (p.x2 - p.x1)) },
    { id: 'geo-g05', type: 'nat', level: 3, exams: E, format: 'numeric', sub: 'solids',
      make(r) {
        const l = int(r, 2, 12), w = int(r, 2, 10), h = int(r, 2, 9), ask = int(r, 0, 1);
        return ask === 0
          ? { q: `<p>A box measures ${l} cm by ${w} cm by ${h} cm. What is its total surface area, in square centimetres?</p>`, answer: 2 * (l * w + l * h + w * h), tol: 0, l, w, h, ask,
            sol: steps(`Six faces in three equal pairs: ${l} × ${w} = ${l * w}, ${l} × ${h} = ${l * h}, ${w} × ${h} = ${w * h}.`, `Total = 2 × (${l * w} + ${l * h} + ${w * h}) = <b>${2 * (l * w + l * h + w * h)}</b>.`), trap: 'Counting each pair of faces once instead of twice.' }
          : { q: `<p>A box measures ${l} cm by ${w} cm by ${h} cm. A second box has every edge twice as long. How many times the volume of the first box is the volume of the second?</p>`, answer: 8, tol: 0, l, w, h, ask,
            sol: steps('Doubling each of three edges multiplies the volume by 2 × 2 × 2.', `So the second box holds <b>8</b> times as much (${l * w * h} cm³ against ${8 * l * w * h} cm³).`), trap: 'Answering 2: volume grows with the cube of the scale.' };
      },
      verify: (p) => (p.ask === 0 ? 2 * (p.l * p.w + p.l * p.h + p.w * p.h) : 8) },
  ],
}, ['geo-g04']);

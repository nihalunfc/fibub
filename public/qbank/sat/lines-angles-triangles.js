// SAT Math · Geometry and trigonometry · lines, angles, triangles and similarity. Original (fibub).
import { int, choose, shuffleOpts, fmt, steps } from './_util.js';
const F = { section: 'math', domain: 'geometry' };

export default {
  topic: 'lines-angles-triangles',
  gens: [
    { id: 'sat-lt-g01', type: 'nat', marks: 1, level: 1, exams: ['sat'], sub: 'angle sum', facets: F, format: 'numeric',
      make(r) {
        const a = int(r, 20, 90), b = int(r, 20, 160 - a);
        return { q: `<p>Two angles of a triangle measure ${a}° and ${b}°. What is the measure, in degrees, of the third angle?</p>`, answer: 180 - a - b, tol: 0, a, b,
          sol: steps(`The angles of a triangle add to 180°.`, `180 − ${a} − ${b} = <b>${180 - a - b}</b>°.`) };
      },
      verify: (p) => 180 - p.a - p.b },
    { id: 'sat-lt-g02', type: 'nat', marks: 1, level: 2, exams: ['sat'], sub: 'parallel lines', facets: F, format: 'numeric',
      make(r) {
        const x = int(r, 25, 155), kind = choose(r, ['alternate', 'same-side']);
        const ans = kind === 'alternate' ? x : 180 - x;
        return { q: `<p>Two parallel lines are cut by a transversal. One of the angles formed measures ${x}°. ${kind === 'alternate' ? 'What is the measure of the alternate interior angle on the other parallel line?' : 'What is the measure of the interior angle on the same side of the transversal, on the other parallel line?'}</p>`, answer: ans, tol: 0, x, kind,
          sol: steps(kind === 'alternate' ? `Alternate interior angles are equal when the lines are parallel: <b>${x}</b>°.` : `Same-side interior angles add to 180° when the lines are parallel: 180 − ${x} = <b>${180 - x}</b>°.`) };
      },
      verify: (p) => (p.kind === 'alternate' ? p.x : 180 - p.x) },
    { id: 'sat-lt-g03', type: 'nat', marks: 1, level: 3, exams: ['sat'], sub: 'similar triangles', facets: F, format: 'numeric',
      make(r) {
        const a = int(r, 2, 12), b = int(r, 3, 15), k = choose(r, [1.5, 2, 2.5, 3, 4]);
        return { q: `<p>Triangle <i>ABC</i> is similar to triangle <i>DEF</i>, with <i>A</i> matching <i>D</i>, <i>B</i> matching <i>E</i> and <i>C</i> matching <i>F</i>. <i>AB</i> = ${a}, <i>BC</i> = ${b} and <i>DE</i> = ${fmt(a * k)}. What is <i>EF</i>?</p>`, answer: b * k, tol: 0.001, a, b, de: a * k,
          sol: steps(`Similar triangles have sides in the same ratio. Scale factor: <i>DE</i>/<i>AB</i> = ${fmt(a * k)}/${a} = ${fmt(k)}.`, `<i>EF</i> = ${fmt(k)} × <i>BC</i> = ${fmt(k)} × ${b} = <b>${fmt(b * k)}</b>.`) };
      },
      verify: (p) => (p.b * p.de) / p.a },
    { id: 'sat-lt-g04', type: 'nat', marks: 1, level: 2, exams: ['sat'], sub: 'Pythagoras', facets: F, format: 'numeric',
      make(r) {
        const m = choose(r, [1, 1, 2, 3]), [a, b, c] = choose(r, [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10], [9, 12, 15], [20, 21, 29]]).map((x) => x * m);
        const ask = choose(r, ['c', 'b']);
        return { q: ask === 'c' ? `<p>A right triangle has legs of length ${a} and ${b}. What is the length of the hypotenuse?</p>` : `<p>A right triangle has a hypotenuse of length ${c} and one leg of length ${a}. What is the length of the other leg?</p>`, answer: ask === 'c' ? c : b, tol: 0, a, b, c, ask,
          sol: ask === 'c' ? steps(`<i>c</i><sup>2</sup> = ${a}<sup>2</sup> + ${b}<sup>2</sup> = ${a * a} + ${b * b} = ${c * c}.`, `<i>c</i> = √${c * c} = <b>${c}</b>.`) : steps(`${a}<sup>2</sup> + <i>b</i><sup>2</sup> = ${c}<sup>2</sup>, so <i>b</i><sup>2</sup> = ${c * c} − ${a * a} = ${b * b}.`, `<i>b</i> = <b>${b}</b>.`) };
      },
      verify: (p) => (p.ask === 'c' ? Math.hypot(p.a, p.b) : Math.sqrt(p.c ** 2 - p.a ** 2)) },
    { id: 'sat-lt-g05', type: 'mcq', marks: 1, level: 3, exams: ['sat'], sub: 'isosceles', facets: F, format: 'single',
      make(r) {
        const top = int(r, 10, 80) * 2;
        const base = (180 - top) / 2;
        const o = shuffleOpts(r, `${base}°`, [`${top}°`, `${180 - top}°`, `${base + 10}°`]);
        return { q: `<p>In an isosceles triangle, the angle between the two equal sides measures ${top}°. What is the measure of each of the other two angles?</p>`, ...o,
          sol: steps(`The two base angles are equal and the three angles add to 180°.`, `Each base angle: (180 − ${top}) ÷ 2 = <b>${base}°</b>.`), trap: `Giving 180 − ${top} = ${180 - top}, the total of the two base angles.` };
      } },
  ],
  items: [
    { id: 'sat-lt-001', type: 'mcq', marks: 1, level: 3, exams: ['sat'], sub: 'vertical angles', facets: F,
      q: '<p>Two lines intersect. One of the four angles formed measures (3<i>x</i> + 10)° and the angle directly opposite it measures (5<i>x</i> − 30)°. What is the value of <i>x</i>?</p>',
      options: ['20', '25', '10', '40'], answer: 0,
      sol: '<p>Vertical (opposite) angles are equal: 3<i>x</i> + 10 = 5<i>x</i> − 30, so 40 = 2<i>x</i> and <i>x</i> = <b>20</b>. Each angle is 70°.</p>' },
  ],
};

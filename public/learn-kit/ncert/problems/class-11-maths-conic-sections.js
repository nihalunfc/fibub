// Class 11 Maths, Conic Sections: live problems (original fibub questions). Ids start with c11m-conic-.
import { pick, choose, n, steps } from './_util.js';

const AB = [[5, 3], [5, 4], [10, 6], [10, 8], [13, 5], [13, 12], [17, 8], [17, 15], [25, 7], [25, 24]];
const HB = [[3, 4], [4, 3], [6, 8], [8, 6], [5, 12], [12, 5], [8, 15], [15, 8]];
export default {
  'c11m-conic-focal': {
    title: 'distance of a point of a parabola from the focus',
    make(r) {
      const a = pick(r, 1, 6), x0 = pick(r, 1, 9);
      return { a, x0, q: `<p>The parabola y² = ${4 * a}x has a point P whose x-coordinate is ${x0}. Find the distance of P from the focus.</p>`, answer: x0 + a, unit: 'units', tol: 0.01,
        hint: 'The distance from the focus equals the distance from the directrix x = −a, which is x + a.',
        solution: steps(`y² = 4ax with 4a = ${4 * a}, so a = ${a}. The focus is (${a}, 0) and the directrix is x = −${a}.`, `For a point on the parabola, PF = PD = x + a = ${x0} + ${a} = <b>${x0 + a}</b>.`) };
    },
    // find y of P, then use the distance formula to the focus
    verify: (p) => Math.hypot(p.x0 - p.a, Math.sqrt(4 * p.a * p.x0)),
  },
  'c11m-conic-ellipse': {
    title: 'eccentricity of an ellipse',
    make(r) {
      const [a, b] = choose(r, AB), c = Math.sqrt(a * a - b * b);
      return { a, b, q: `<p>Find the eccentricity of the ellipse x²/${a * a} + y²/${b * b} = 1 (give a decimal).</p>`, answer: c / a, unit: '', tol: 0.01,
        hint: 'a² is the larger denominator. c² = a² − b² and e = c/a.',
        solution: steps(`a² = ${a * a}, b² = ${b * b}.`, `c² = ${a * a} − ${b * b} = ${a * a - b * b}, so c = ${n(c, 4)}.`, `e = c/a = ${n(c, 4)}/${a} = <b>${n(c / a, 4)}</b>.`) };
    },
    // e² = 1 - (b/a)²
    verify: (p) => Math.sqrt(1 - (p.b / p.a) ** 2),
  },
  'c11m-conic-hyper': {
    title: 'distance between the foci of a hyperbola',
    make(r) {
      const [a, b] = choose(r, HB), c = Math.hypot(a, b);
      return { a, b, q: `<p>Find the distance between the two foci of the hyperbola x²/${a * a} − y²/${b * b} = 1.</p>`, answer: 2 * c, unit: 'units', tol: 0.01,
        hint: 'For a hyperbola c² = a² + b² (plus, not minus). The foci are (±c, 0).',
        solution: steps(`a² = ${a * a}, b² = ${b * b}.`, `c² = ${a * a} + ${b * b} = ${a * a + b * b}, so c = ${n(c, 4)}.`, `Distance between the foci = 2c = <b>${n(2 * c, 4)}</b>.`) };
    },
    // the asymptote makes angle t with the x-axis, tan t = b/a, and c = a / cos t
    verify: (p) => (2 * p.a) / Math.cos(Math.atan(p.b / p.a)),
  },
  'c11m-conic-circle': {
    title: 'radius from the general equation of a circle',
    make(r) {
      const h = pick(r, -6, 6), k = pick(r, -6, 6), R = pick(r, 2, 9), g = -h, f = -k, c = h * h + k * k - R * R;
      const sg = (v, s) => (v === 0 ? '' : (v > 0 ? ' + ' : ' − ') + (Math.abs(v) === 1 ? '' : Math.abs(v)) + s);
      return { g, f, c, q: `<p>The circle is x² + y²${sg(2 * g, 'x')}${sg(2 * f, 'y')}${c === 0 ? '' : (c > 0 ? ' + ' : ' − ') + Math.abs(c)} = 0. Find its radius.</p>`, answer: R, unit: 'units', tol: 0.01,
        hint: 'Compare with x² + y² + 2gx + 2fy + c = 0: the centre is (−g, −f) and r² = g² + f² − c.',
        solution: steps(`Here 2g = ${2 * g}, 2f = ${2 * f}, so g = ${g}, f = ${f}, c = ${c}.`, `r² = ${g * g} + ${f * f} − (${c}) = ${g * g + f * f - c}.`, `r = <b>${R}</b>.`) };
    },
    // on the vertical line through the centre the equation becomes y² + 2f y + (c - g²) = 0 with roots k ± r, so r = half the root gap
    verify: (p) => Math.sqrt((2 * p.f) ** 2 - 4 * (p.c - p.g * p.g)) / 2,
  },
  'c11m-conic-parabolalr': {
    title: 'latus rectum of a parabola',
    make(r) {
      const a = pick(r, 1, 9) / 2;
      return { a, q: `<p>The parabola x² = ${4 * a}y has its focus on the y-axis. Find the length of its latus rectum.</p>`, answer: 4 * a, unit: 'units', tol: 0.01,
        hint: 'Compare x² = 4ay. The latus rectum is the chord through the focus, parallel to the directrix.',
        solution: steps(`4a = ${4 * a}, so a = ${a}. The focus is (0, ${a}).`, `Put y = a: x² = 4a·a = 4a², so x = ±2a.`, `The chord runs from −2a to 2a, so its length is 4a = <b>${4 * a}</b>.`) };
    },
    // find the two ends (±x, a) from the equation and subtract
    verify: (p) => 2 * Math.sqrt(4 * p.a * p.a),
  },
};

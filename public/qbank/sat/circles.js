// SAT Math · Geometry and trigonometry · circles: area, circumference, arcs, sectors and equations. Original (fibub).
import { int, choose, shuffleOpts, fmt, frac, steps } from './_util.js';
const F = { section: 'math', domain: 'geometry' };
const sg = (n) => (n < 0 ? ` + ${-n}` : ` − ${n}`);

export default {
  topic: 'circles',
  gens: [
    { id: 'sat-ci-g01', type: 'nat', marks: 1, level: 1, exams: ['sat'], sub: 'area and circumference', facets: F, format: 'numeric',
      make(r) {
        const rad = int(r, 2, 15), what = choose(r, ['area', 'circumference']);
        return { q: `<p>A circle has a radius of ${rad}. Its ${what} is <i>k</i>π. What is <i>k</i>?</p>`, answer: what === 'area' ? rad * rad : 2 * rad, tol: 0, rad, what,
          sol: steps(what === 'area' ? `Area = π<i>r</i><sup>2</sup> = π × ${rad}<sup>2</sup> = ${rad * rad}π, so <i>k</i> = <b>${rad * rad}</b>.` : `Circumference = 2π<i>r</i> = 2π × ${rad} = ${2 * rad}π, so <i>k</i> = <b>${2 * rad}</b>.`) };
      },
      verify: (p) => (p.what === 'area' ? p.rad ** 2 : 2 * p.rad) },
    { id: 'sat-ci-g02', type: 'nat', marks: 1, level: 3, exams: ['sat'], sub: 'arc length', facets: F, format: 'numeric',
      make(r) {
        const rad = int(r, 2, 18), ang = choose(r, [30, 45, 60, 72, 90, 120, 135, 150, 180, 240, 270]);
        const k = (2 * rad * ang) / 360;
        return { q: `<p>In a circle with radius ${rad}, a central angle of ${ang}° cuts off an arc. The arc's length is <i>k</i>π. What is <i>k</i>? Give a decimal or fraction.</p>`, answer: k, tol: 0.001, rad, ang,
          sol: steps(`The arc is ${ang}/360 = ${frac(ang, 360)} of the whole circle.`, `Whole circumference: 2π(${rad}) = ${2 * rad}π.`, `Arc: ${frac(ang, 360)} × ${2 * rad}π = <b>${frac(2 * rad * ang, 360)}</b>π.`) };
      },
      verify: (p) => (2 * p.rad * p.ang) / 360 },
    { id: 'sat-ci-g03', type: 'nat', marks: 1, level: 3, exams: ['sat'], sub: 'sector area', facets: F, format: 'numeric',
      make(r) {
        const rad = int(r, 2, 12), ang = choose(r, [30, 40, 45, 60, 90, 120, 180, 270]);
        return { q: `<p>A sector of a circle with radius ${rad} has a central angle of ${ang}°. Its area is <i>k</i>π. What is <i>k</i>? Give a decimal or fraction.</p>`, answer: (rad * rad * ang) / 360, tol: 0.001, rad, ang,
          sol: steps(`Fraction of the circle: ${frac(ang, 360)}.`, `Area: ${frac(ang, 360)} × π × ${rad}<sup>2</sup> = <b>${frac(rad * rad * ang, 360)}</b>π.`) };
      },
      verify: (p) => (p.rad ** 2 * p.ang) / 360 },
    { id: 'sat-ci-g04', type: 'nat', marks: 1, level: 4, exams: ['sat'], sub: 'complete the square', facets: F, format: 'numeric',
      make(r) {
        const h = int(r, -8, 8), k = int(r, -8, 8), rad = int(r, 1, 9);
        const D = -2 * h, E = -2 * k, Fc = h * h + k * k - rad * rad;
        const t = (c, s) => (c === 0 ? '' : `${c < 0 ? ' − ' : ' + '}${Math.abs(c)}${s}`);
        return { q: `<p>The equation <i>x</i><sup>2</sup> + <i>y</i><sup>2</sup>${t(D, '<i>x</i>')}${t(E, '<i>y</i>')}${t(Fc, '')} = 0 defines a circle in the <i>xy</i>-plane. What is the radius of the circle?</p>`, answer: rad, tol: 0, D, E, Fc,
          sol: steps(`Complete the square in <i>x</i> and in <i>y</i>: add (half the <i>x</i>-coefficient)<sup>2</sup> = ${h * h} and (half the <i>y</i>-coefficient)<sup>2</sup> = ${k * k} to both sides.`, `(<i>x</i>${sg(h)})<sup>2</sup> + (<i>y</i>${sg(k)})<sup>2</sup> = ${h * h} + ${k * k} − (${Fc}) = ${rad * rad}.`.replace(/x − 0/g, 'x').replace(/y − 0/g, 'y'), `Radius = √${rad * rad} = <b>${rad}</b>.`),
          trap: `Taking ${rad * rad} as the radius: the right side is <i>r</i><sup>2</sup>.` };
      },
      verify: (p) => Math.sqrt((p.D / 2) ** 2 + (p.E / 2) ** 2 - p.Fc) },
    { id: 'sat-ci-g05', type: 'mcq', marks: 1, level: 3, exams: ['sat'], sub: 'equation from centre', facets: F, format: 'single',
      make(r) {
        const h = int(r, -9, 9), k = int(r, -9, 9), rad = int(r, 2, 9);
        const f = (a, b, c) => `(<i>x</i>${sg(a)})<sup>2</sup> + (<i>y</i>${sg(b)})<sup>2</sup> = ${c}`;
        const o = shuffleOpts(r, f(h, k, rad * rad), [f(-h, -k, rad * rad), f(h, k, rad), f(k, h, rad * rad), f(-h, -k, rad)]);
        return { q: `<p>Which equation describes the circle in the <i>xy</i>-plane with centre (${h}, ${k}) and radius ${rad}?</p>`, ...o,
          sol: `<p>A circle with centre (<i>h</i>, <i>k</i>) and radius <i>r</i> is (<i>x</i> − <i>h</i>)<sup>2</sup> + (<i>y</i> − <i>k</i>)<sup>2</sup> = <i>r</i><sup>2</sup>. Here: <b>${f(h, k, rad * rad)}</b>. Watch the signs: the centre's coordinates are subtracted.</p>` };
      } },
  ],
  items: [
    { id: 'sat-ci-001', type: 'mcq', marks: 1, level: 3, exams: ['sat'], sub: 'tangent', facets: F,
      q: '<p>A line is tangent to a circle at point <i>T</i>. What is the measure of the angle between the line and the radius drawn to <i>T</i>?</p>',
      options: ['90°', '45°', '180°', 'It depends on the radius'], answer: 0,
      sol: '<p>A tangent line touches the circle at one point and is always perpendicular to the radius there: <b>90°</b>.</p>' },
  ],
};

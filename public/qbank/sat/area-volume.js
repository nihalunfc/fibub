// SAT Math · Geometry and trigonometry · area, volume and scale. Original (fibub).
import { int, choose, shuffleOpts, fmt, steps } from './_util.js';
const F = { section: 'math', domain: 'geometry' };

export default {
  topic: 'area-volume',
  gens: [
    { id: 'sat-av-g01', type: 'nat', marks: 1, level: 1, exams: ['sat'], sub: 'rectangle and triangle', facets: F, format: 'numeric',
      make(r) {
        const b = int(r, 3, 20), h = int(r, 2, 16), tri = r() < 0.5;
        return { q: `<p>A ${tri ? 'triangle' : 'rectangle'} has a base of ${b} centimetres and a height of ${h} centimetres. What is its area, in square centimetres?</p>`, answer: tri ? (b * h) / 2 : b * h, tol: 0, b, h, tri,
          sol: steps(tri ? `Triangle: half of base × height = ½ × ${b} × ${h} = <b>${fmt((b * h) / 2)}</b>.` : `Rectangle: base × height = ${b} × ${h} = <b>${b * h}</b>.`) };
      },
      verify: (p) => (p.tri ? (p.b * p.h) / 2 : p.b * p.h) },
    { id: 'sat-av-g02', type: 'nat', marks: 1, level: 2, exams: ['sat'], sub: 'box volume', facets: F, format: 'numeric',
      make(r) {
        const l = int(r, 2, 15), w = int(r, 2, 12), h = int(r, 2, 10), V = l * w * h, ask = choose(r, ['V', 'h']);
        return { q: ask === 'V' ? `<p>A box is ${l} inches long, ${w} inches wide and ${h} inches tall. What is its volume, in cubic inches?</p>` : `<p>A box with a volume of ${V} cubic inches is ${l} inches long and ${w} inches wide. How tall is it, in inches?</p>`, answer: ask === 'V' ? V : h, tol: 0, l, w, h, ask, V,
          sol: ask === 'V' ? steps(`Volume = length × width × height = ${l} × ${w} × ${h} = <b>${V}</b>.`) : steps(`${l} × ${w} × <i>h</i> = ${V}, so ${l * w}<i>h</i> = ${V}.`, `<i>h</i> = ${V} ÷ ${l * w} = <b>${h}</b>.`) };
      },
      verify: (p) => (p.ask === 'V' ? p.l * p.w * p.h : p.V / (p.l * p.w)) },
    { id: 'sat-av-g03', type: 'nat', marks: 1, level: 3, exams: ['sat'], sub: 'cylinder in terms of pi', facets: F, format: 'numeric',
      make(r) {
        const rad = int(r, 2, 9), h = int(r, 2, 12);
        return { q: `<p>A cylinder has a radius of ${rad} and a height of ${h}. Its volume is <i>k</i>π. What is the value of <i>k</i>?</p>`, answer: rad * rad * h, tol: 0, rad, h,
          sol: steps(`Volume of a cylinder: π<i>r</i><sup>2</sup><i>h</i> (the area of the circle times the height).`, `π × ${rad}<sup>2</sup> × ${h} = ${rad * rad * h}π, so <i>k</i> = <b>${rad * rad * h}</b>.`), trap: `Using the diameter, or forgetting to square the radius (${rad * h}).` };
      },
      verify: (p) => p.rad ** 2 * p.h },
    { id: 'sat-av-g04', type: 'mcq', marks: 1, level: 4, exams: ['sat'], sub: 'scale factor', facets: F, format: 'single',
      make(r) {
        const k = choose(r, [2, 3, 4, 5]), what = choose(r, ['area', 'volume']);
        const f = what === 'area' ? k * k : k ** 3;
        const o = shuffleOpts(r, `${f} times`, [`${k} times`, `${what === 'area' ? k ** 3 : k * k} times`, `${2 * k} times`, `${k + 1} times`, `${k ** 4} times`]);
        return { q: `<p>Every length of a ${what === 'area' ? 'rectangle' : 'cube'} is multiplied by ${k}. The ${what} of the new shape is how many times the ${what} of the original?</p>`, ...o,
          sol: `<p>Lengths scale by ${k}. Area has two lengths multiplied, so it scales by ${k}<sup>2</sup>; volume has three, so ${k}<sup>3</sup>. Here: <b>${f} times</b>.</p>`, trap: `Answering ${k}: only lengths scale by ${k}.` };
      } },
    { id: 'sat-av-g05', type: 'nat', marks: 1, level: 3, exams: ['sat'], sub: 'sphere and cone', facets: F, format: 'numeric',
      make(r) {
        const rad = choose(r, [3, 6, 9, 12]), h = choose(r, [2, 4, 5, 7, 10]), cone = r() < 0.5;
        const k = cone ? (rad * rad * h) / 3 : (4 * rad ** 3) / 3;
        return { q: `<p>${cone ? `A cone has a base radius of ${rad} and a height of ${h}` : `A sphere has a radius of ${rad}`}. Its volume is <i>k</i>π. What is <i>k</i>? (Volume of a ${cone ? 'cone = ⅓π<i>r</i><sup>2</sup><i>h</i>' : 'sphere = (4/3)π<i>r</i><sup>3</sup>'}; the SAT gives these formulas.)</p>`, answer: k, tol: 0, rad, h, cone,
          sol: cone ? steps(`⅓ × ${rad}<sup>2</sup> × ${h} = ⅓ × ${rad * rad * h} = <b>${fmt(k)}</b>.`) : steps(`(4/3) × ${rad}<sup>3</sup> = (4/3) × ${rad ** 3} = <b>${fmt(k)}</b>.`) };
      },
      verify: (p) => (p.cone ? (p.rad ** 2 * p.h) / 3 : (4 * p.rad ** 3) / 3) },
  ],
  items: [
    { id: 'sat-av-001', type: 'nat', marks: 1, level: 3, exams: ['sat'], sub: 'composite area', facets: F,
      q: '<p>A rectangular garden is 20 metres by 12 metres. A square patio 5 metres on each side is built inside it. What area of the garden, in square metres, is not covered by the patio?</p>', answer: 215, tol: 0,
      sol: '<p>Whole garden: 20 × 12 = 240. Patio: 5 × 5 = 25. Left: 240 − 25 = <b>215</b> m<sup>2</sup>.</p>' },
  ],
};

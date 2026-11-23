// Class 8 Maths, Exploring Some Geometric Themes: live problems (original fibub questions). Ids start with c8m-geo-.
import { choose, n, steps } from './_util.js';

const NS = [3, 5, 6, 8, 9, 10, 12];
const PYR = [4, 5, 6, 7, 8, 9];
const GAP = [[5, 3], [7, 2], [8, 2], [9, 2], [10, 2], [12, 2]];
const LEN = [[9, 2], [12, 3], [6, 2], [27, 3], [18, 4], [8, 3]];
export default {
  'c8m-geo-turn': {
    title: 'smallest turn of a regular polygon',
    make(r) {
      const k = choose(r, NS), answer = 360 / k;
      return { k, q: `<p>A regular polygon has <b>${k}</b> sides. Through what smallest angle (in degrees) can you turn it about its centre so that it looks exactly the same?</p>`, answer, unit: '°', tol: 0.002,
        hint: 'A regular polygon has rotational symmetry of order equal to its number of sides. A full turn is 360°.',
        solution: steps(`The order of rotational symmetry is ${k}.`, `Smallest angle = 360° ÷ ${k} = <b>${n(answer, 5)}°</b>.`) };
    },
    verify(x) { return 180 - ((x.k - 2) * 180) / x.k; },
  },
  'c8m-geo-euler': {
    title: 'faces of a pyramid with Euler’s rule',
    make(r) {
      const k = choose(r, PYR), V = k + 1, E = 2 * k, answer = 2 - V + E;
      return { k, V, E, q: `<p>A solid has <b>${V}</b> vertices and <b>${E}</b> edges. Use Euler’s rule V − E + F = 2 to find how many faces it has.</p>`, answer, unit: 'faces', tol: 0.002,
        hint: 'Rearrange: F = 2 − V + E.',
        solution: steps(`V − E + F = 2, so F = 2 − V + E.`, `F = 2 − ${V} + ${E}.`, `= <b>${answer} faces</b> (it is a pyramid on a ${k}-sided base).`) };
    },
    verify(x) { return x.k + 1; },
  },
  'c8m-geo-koch': {
    title: 'length of a Koch curve',
    make(r) {
      const [L, k] = choose(r, LEN), answer = L * (4 / 3) ** k;
      return { L, k, q: `<p>A Koch curve starts as a line of <b>${L} cm</b>. After <b>${k}</b> steps of “cut in three, add a tent on the middle third”, how long is the curve, in cm?</p>`, answer, unit: 'cm', tol: 0.005,
        hint: 'Every step makes the length 4/3 times as long.',
        solution: steps(`Length after k steps = ${L} × (4/3)<sup>${k}</sup>.`, `(4/3)<sup>${k}</sup> = ${n((4 / 3) ** k, 5)}.`, `Length = <b>${n(answer, 5)} cm</b>.`) };
    },
    verify(x) { return 4 ** x.k * (x.L / 3 ** x.k); },
  },
  'c8m-geo-sier': {
    title: 'what is left of a Sierpinski triangle',
    make(r) {
      const k = choose(r, [2, 3, 4, 5]), answer = 0.75 ** k * 100;
      return { k, q: `<p>In a Sierpinski triangle, at each step the middle quarter of every filled triangle is removed. After <b>${k}</b> steps, what percentage of the original area is still filled?</p>`, answer, unit: '%', tol: 0.005,
        hint: 'Each step keeps 3 of every 4 equal parts, so the filled area is multiplied by 3/4.',
        solution: steps(`Each step multiplies the filled area by 3/4.`, `(3/4)<sup>${k}</sup> = ${n(0.75 ** k, 5)}.`, `As a percentage: <b>${n(answer, 5)}%</b>.`) };
    },
    verify(x) { return (3 ** x.k / 4 ** x.k) * 100; },
  },
  'c8m-geo-tess': {
    title: 'the gap round a point',
    make(r) {
      const [s, k] = choose(r, GAP), answer = 360 - k * (180 - 360 / s);
      return { s, k, q: `<p>${k} regular polygons, each with <b>${s}</b> sides, are placed side by side round one point. How many degrees of gap are left (the corners add up to less than 360°)?</p>`, answer, unit: '°', tol: 0.005,
        hint: 'Corner angle of a regular s-sided polygon = 180 − 360 ÷ s. Multiply by the number of polygons and subtract from 360.',
        solution: steps(`Corner angle = 180° − 360° ÷ ${s} = ${n(180 - 360 / s, 5)}°.`, `${k} corners use ${n(k * (180 - 360 / s), 5)}°.`, `Gap = 360° − ${n(k * (180 - 360 / s), 5)}° = <b>${n(answer, 5)}°</b>.`) };
    },
    verify(x) { return 360 - (x.k * (x.s - 2) * 180) / x.s; },
  },
};

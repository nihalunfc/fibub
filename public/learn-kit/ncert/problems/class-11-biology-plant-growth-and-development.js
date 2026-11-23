// Class 11 Biology, Plant Growth and Development: live problems (original fibub questions). Ids start with c11b-growth-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c11b-growth-rgr': {
    title: 'relative growth rate of a seedling',
    make(r) {
      const a = choose(r, [2, 4, 5, 8, 10]), inc = choose(r, [1, 2, 3, 4]);
      return { a, inc, q: `<p>A seedling is ${a} cm tall on Monday and ${a + inc} cm tall on Tuesday. What is its relative growth rate for the day, as a percentage of its starting height?</p>`, answer: inc / a * 100, unit: '%', tol: 0.01,
        hint: 'Relative rate = increase ÷ starting size.',
        solution: steps(`Increase = ${a + inc} − ${a} = ${inc} cm.`, `RGR = ${inc} ÷ ${a} × 100 = <b>${n(inc / a * 100)} %</b>.`) };
    },
    verify: (x) => ((x.a + x.inc) / x.a - 1) * 100,
  },
  'c11b-growth-agr': {
    title: 'absolute growth rate from a graph',
    make(r) {
      const l0 = pick(r, 5, 25, 5), d = pick(r, 4, 12, 2), inc = pick(r, 12, 48, 6);
      return { l0, d, inc, q: `<p>A bamboo shoot is ${l0} cm long. After ${d} days it is ${l0 + inc} cm long. What is its average absolute growth rate in cm per day?</p>`, answer: inc / d, unit: 'cm/day', tol: 0.01,
        hint: 'Absolute rate = increase in length ÷ time.',
        solution: steps(`Increase = ${l0 + inc} − ${l0} = ${inc} cm.`, `Rate = ${inc} ÷ ${d} = <b>${n(inc / d)} cm per day</b>.`) };
    },
    verify: (x) => ((x.l0 + x.inc) - x.l0) / x.d,
  },
  'c11b-growth-doubling': {
    title: 'geometric growth by doubling',
    make(r) {
      const w0 = choose(r, [1, 2, 5, 10]), k = pick(r, 3, 8);
      return { w0, k, q: `<p>A group of ${w0} cell${w0 > 1 ? 's' : ''} is growing geometrically and the number doubles every day. How many cells are there after ${k} days?</p>`, answer: w0 * 2 ** k, unit: 'cells', tol: 0.01,
        hint: 'Each day multiplies the number by 2: N = N₀ × 2^days.',
        solution: steps(`Doubling ${k} times gives a factor 2^${k} = ${2 ** k}.`, `N = ${w0} × ${2 ** k} = <b>${n(w0 * 2 ** k)}</b>.`) };
    },
    verify: (x) => { let v = x.w0; for (let i = 0; i < x.k; i++) v *= 2; return v; },
  },
  'c11b-growth-auxano': {
    title: 'growth from an auxanometer',
    make(r) {
      const ratio = choose(r, [10, 20, 50, 100]), mv = choose(r, [10, 20, 40, 60]);
      return { ratio, mv, q: `<p>An auxanometer has a lever that magnifies the growth ${ratio} times. In a day the pointer moves ${mv} mm along the scale. By how many mm did the stem actually grow?</p>`, answer: mv / ratio, unit: 'mm', tol: 0.01,
        hint: 'True growth = pointer movement ÷ magnification.',
        solution: steps(`Magnification = ${ratio}.`, `Growth = ${mv} ÷ ${ratio} = <b>${n(mv / ratio)} mm</b>.`) };
    },
    verify: (x) => x.mv * (1 / x.ratio),
  },
};

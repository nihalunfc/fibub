// Class 8 Maths, Power Play: live problems (original fibub questions). Ids start with c8m-pow-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c8m-pow-combine': {
    title: 'combining powers of one base',
    make(r) {
      const b = choose(r, [2, 3, 5, 7]), m = pick(r, 5, 12), k = pick(r, 2, 9), p = pick(r, 1, 6);
      return { b, m, k, p, q: `<p>Write ${b}<sup>${m}</sup> × ${b}<sup>${k}</sup> ÷ ${b}<sup>${p}</sup> as a single power of ${b}. What is the new power (exponent)?</p>`, answer: m + k - p, unit: '', tol: 0.002,
        hint: 'Add the powers when you multiply, subtract when you divide.',
        solution: steps(`${b}<sup>${m}</sup> × ${b}<sup>${k}</sup> = ${b}<sup>${m} + ${k}</sup> = ${b}<sup>${m + k}</sup>.`, `Now divide: ${b}<sup>${m + k}</sup> ÷ ${b}<sup>${p}</sup> = ${b}<sup>${m + k} − ${p}</sup>.`, `The power is <b>${m + k - p}</b>.`) };
    },
    verify(x) { return Math.round(Math.log(x.b ** x.m * x.b ** x.k / x.b ** x.p) / Math.log(x.b)); },
  },
  'c8m-pow-tens': {
    title: 'multiplying powers with the same exponent',
    make(r) {
      const a = pick(r, 2, 6);
      return { a, q: `<p>Find the value of 2<sup>${a}</sup> × 5<sup>${a}</sup>.</p>`, answer: 10 ** a, unit: '', tol: 0.002,
        hint: 'When two powers have the same exponent, you can multiply the bases first: aⁿ × bⁿ = (a × b)ⁿ.',
        solution: steps(`2<sup>${a}</sup> × 5<sup>${a}</sup> = (2 × 5)<sup>${a}</sup> = 10<sup>${a}</sup>.`, `10<sup>${a}</sup> is 1 followed by ${a} zeros: <b>${n(10 ** a, 8)}</b>.`) };
    },
    verify(x) { return 2 ** x.a * 5 ** x.a; },
  },
  'c8m-pow-big': {
    title: 'a big number in standard form',
    make(r) {
      const k = pick(r, 4, 12), d = pick(r, 11, 98) / 10, v = d * 10 ** k;
      return { k, d, v, q: `<p>The distance covered by a spacecraft is <b>${n(v, 6)}</b> metres (a ${d} followed by zeros). Written in standard form as d × 10<sup>k</sup> with 1 ≤ d &lt; 10, what is k?</p>`, answer: k, unit: '', tol: 0.002,
        hint: 'Count how many places the decimal point must move to the left so that only one non-zero digit stays in front of it.',
        solution: steps(`${n(v, 6)} has ${k + 1} digits before the point.`, `Move the point ${k} places left to get ${d}.`, `So the number is ${d} × 10<sup>${k}</sup> and k = <b>${k}</b>.`) };
    },
    verify(x) { return Math.floor(Math.log10(x.v + 0.5)); },
  },
  'c8m-pow-small': {
    title: 'a tiny number in standard form',
    make(r) {
      const k = pick(r, 3, 9), d = pick(r, 2, 9);
      return { k, d, q: `<p>The width of a thin film is <b>${d} × 10<sup>−${k}</sup> m</b>. Written as a decimal, how many zeros come between the decimal point and the digit ${d}?</p>`, answer: k - 1, unit: '', tol: 0.002, abs: 0.01,
        hint: '10 to the power −k means a 1 in the k-th place after the decimal point.',
        solution: steps(`10<sup>−${k}</sup> = 0.${'0'.repeat(k - 1)}1, with the 1 in the ${k}th place after the point.`, `So ${d} × 10<sup>−${k}</sup> = 0.${'0'.repeat(k - 1)}${d}.`, `Zeros between the point and ${d}: <b>${k - 1}</b>.`) };
    },
    verify(x) { return Math.floor(-Math.log10(x.d * 10 ** -x.k)); },
  },
  'c8m-pow-negexp': {
    title: 'a negative power of a fraction',
    make(r) {
      const [a, b] = choose(r, [[2, 3], [3, 4], [2, 5], [1, 2], [3, 2]]), k = pick(r, 2, 4);
      return { a, b, k, q: `<p>Find the value of (${a}/${b})<sup>−${k}</sup>. Give it as a decimal (up to 3 decimal places).</p>`, answer: +((b / a) ** k).toFixed(4), unit: '', tol: 0.005,
        hint: 'A negative power turns the fraction upside down: (a/b)<sup>−k</sup> = (b/a)<sup>k</sup>.',
        solution: steps(`(${a}/${b})<sup>−${k}</sup> = (${b}/${a})<sup>${k}</sup>.`, `= ${b ** k}/${a ** k}.`, `As a decimal this is <b>${((b / a) ** k).toFixed(3)}</b>.`) };
    },
    verify(x) { return Math.pow(x.a / x.b, -x.k); },
  },
  'c8m-pow-grow': {
    title: 'doubling growth',
    make(r) {
      const c = pick(r, 2, 9), h = pick(r, 5, 12);
      return { c, h, q: `<p>A culture of bacteria starts with <b>${c}</b> cells and doubles every hour. How many cells are there after <b>${h} hours</b>?</p>`, answer: c * 2 ** h, unit: 'cells', tol: 0.002,
        hint: 'Doubling h times multiplies by 2<sup>h</sup>.',
        solution: steps(`After ${h} doublings the count is multiplied by 2<sup>${h}</sup> = ${2 ** h}.`, `${c} × ${2 ** h} = <b>${n(c * 2 ** h, 8)}</b> cells.`) };
    },
    verify(x) { let v = x.c; for (let i = 0; i < x.h; i++) v *= 2; return v; },
  },
};

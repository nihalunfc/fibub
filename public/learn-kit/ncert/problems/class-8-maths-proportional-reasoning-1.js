// Class 8 Maths, Chapter 7 Proportional Reasoning 1: live problems (original fibub questions). Ids start with c8m-prop1-.
import { pick, choose, n, steps } from './_util.js';

const gcd = (a, b) => (b ? gcd(b, a % b) : a);
export default {
  'c8m-prop1-simplify': {
    title: 'simplest form of a ratio',
    make(r) {
      const [p, q] = choose(r, [[2, 3], [3, 5], [4, 7], [5, 6], [3, 7], [5, 9], [7, 8], [2, 5]]), k = pick(r, 3, 12);
      return { p, q2: q, k, q: `<p>Write the ratio ${p * k} : ${q * k} in its simplest form. What is the first number?</p>`, answer: p, abs: 0.01, tol: 0, unit: '',
        hint: 'Divide both parts by their highest common factor.',
        solution: steps(`The HCF of ${p * k} and ${q * k} is ${k}.`, `${p * k} ÷ ${k} : ${q * k} ÷ ${k} = <b>${p}</b> : ${q}.`) };
    },
    verify: (x) => { const a = x.p * x.k, b = x.q2 * x.k; return a / gcd(a, b); },
  },
  'c8m-prop1-unitary': {
    title: 'the unitary method',
    make(r) {
      const u = pick(r, 4, 40), n1 = pick(r, 3, 9), n2 = pick(r, 10, 24), item = choose(r, ['notebooks', 'bananas', 'pens', 'laddoos']);
      return { u, n1, n2, q: `<p>${n1} ${item} cost ₹${u * n1}. How many rupees do ${n2} ${item} cost?</p>`, answer: u * n2, abs: 0.01, tol: 0, unit: '₹',
        hint: 'First find the cost of one, then multiply.',
        solution: steps(`One costs ${u * n1} ÷ ${n1} = ₹${u}.`, `${n2} cost ${u} × ${n2} = <b>₹${u * n2}</b>.`) };
    },
    verify: (p) => (p.u * p.n1 / p.n1) * p.n2,
  },
  'c8m-prop1-share': {
    title: 'sharing in a ratio',
    make(r) {
      const [a, b] = choose(r, [[2, 3], [3, 4], [1, 4], [3, 5], [2, 5], [4, 5]]), k = pick(r, 20, 120, 10), T = (a + b) * k;
      return { a, b, T, k, q: `<p>Meena and Karthik share ₹${T} in the ratio ${a} : ${b}. How many rupees does Meena (the ${a}) get?</p>`, answer: a * k, abs: 0.01, tol: 0, unit: '₹',
        hint: 'Add the parts, divide the total by that to get one part, then multiply by Meena\'s number of parts.',
        solution: steps(`Parts: ${a} + ${b} = ${a + b}. One part = ${T} ÷ ${a + b} = ₹${k}.`, `Meena: ${a} × ${k} = <b>₹${a * k}</b>.`) };
    },
    verify: (p) => p.T * p.a / (p.a + p.b),
  },
  'c8m-prop1-map': {
    title: 'distance from a map scale',
    make(r) {
      const N = choose(r, [50000, 100000, 200000, 500000]), L = pick(r, 2, 12);
      return { N, L, q: `<p>On a map with scale 1 : ${N.toLocaleString('en-IN')}, two towns are ${L} cm apart. How many kilometres apart are they in reality?</p>`, answer: L * N / 100000, tol: 0.001, abs: 0.001, unit: 'km',
        hint: 'Real distance in cm = map cm × ' + N + '. Then divide by 100 000 to get km.',
        solution: steps(`${L} × ${N} = ${L * N} cm.`, `${L * N} ÷ 100 000 = <b>${L * N / 100000} km</b>.`) };
    },
    verify: (p) => (p.L * (p.N / 1000)) / 100,
  },
  'c8m-prop1-miss': {
    title: 'the missing term of a proportion',
    make(r) {
      const [p, q] = choose(r, [[2, 3], [3, 4], [4, 5], [5, 7], [3, 8], [2, 7]]), k1 = pick(r, 2, 6), k2 = pick(r, 7, 12);
      return { a: p * k1, b: q * k1, c: p * k2, x: q * k2, q: `<p>Find x if ${p * k1} : ${q * k1} = ${p * k2} : x.</p>`, answer: q * k2, abs: 0.01, tol: 0, unit: '',
        hint: 'In a proportion the product of the extremes equals the product of the means: a × x = b × c.',
        solution: steps(`${p * k1} × x = ${q * k1} × ${p * k2}.`, `x = ${q * k1 * p * k2} ÷ ${p * k1} = <b>${q * k2}</b>.`) };
    },
    verify: (p) => { for (let x = 1; x < 500; x++) if (p.a * x === p.b * p.c) return x; },
  },
  'c8m-prop1-speed': {
    title: 'direct proportion at steady speed',
    make(r) {
      const v = pick(r, 40, 90, 10), h1 = pick(r, 2, 5), h2 = pick(r, 6, 11);
      return { v, h1, h2, q: `<p>A bus on a highway covers ${v * h1} km in ${h1} hours at a steady speed. How many km does it cover in ${h2} hours?</p>`, answer: v * h2, abs: 0.01, tol: 0, unit: 'km',
        hint: 'Distance and time are in direct proportion. Find the km in one hour first.',
        solution: steps(`In 1 hour: ${v * h1} ÷ ${h1} = ${v} km.`, `In ${h2} hours: ${v} × ${h2} = <b>${v * h2} km</b>.`) };
    },
    verify: (p) => (p.v * p.h1 * p.h2) / p.h1,
  },
  'c8m-prop1-recipe': {
    title: 'scaling a recipe',
    make(r) {
      const s1 = choose(r, [2, 4, 5]), per = choose(r, [2, 3, 5]), s2 = pick(r, 8, 30, 2);
      return { s1, per, s2, q: `<p>A chai recipe for ${s1} cups uses ${s1 * per * 25} ml of milk. How many ml of milk are needed for ${s2} cups?</p>`, answer: s2 * per * 25, abs: 0.01, tol: 0, unit: 'ml',
        hint: 'Milk per cup, times the number of cups.',
        solution: steps(`Milk per cup: ${s1 * per * 25} ÷ ${s1} = ${per * 25} ml.`, `${s2} cups: ${per * 25} × ${s2} = <b>${s2 * per * 25} ml</b>.`) };
    },
    verify: (p) => (p.s1 * p.per * 25 * p.s2) / p.s1,
  },
};

// Class 8 Science, Chapter 12 How Nature Works in Harmony: live problems (original fibub questions). Ids start with c8s-eco-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c8s-eco-energy': {
    title: 'energy at a higher trophic level',
    make(r) {
      const E = choose(r, [10000, 50000, 100000, 200000]), k = choose(r, [2, 3, 4]), answer = E / Math.pow(10, k);
      return { E, k, q: `<p>Green plants in a field capture ${n(E, 6)} units of energy. Using the 10 per cent rule, how much energy reaches the animals at trophic level ${k + 1}? (Plants are level 1.)</p>`, answer, unit: 'units', tol: 0.01,
        hint: 'Each step passes on one tenth. From level 1 to level ' + (k + 1) + ' there are ' + k + ' steps.', solution: steps(`Each step keeps 10%, so multiply by 0.1 ${k} times.`, `${n(E, 6)} × 0.1^${k} = <b>${n(answer, 4)} units</b>.`) };
    },
    verify: (x) => { let e = x.E; for (let i = 0; i < x.k; i++) e = e / 10; return e; },
  },
  'c8s-eco-back': {
    title: 'working back to the plants',
    make(r) {
      const top = choose(r, [10, 20, 50, 100]), k = choose(r, [2, 3, 4]), answer = top * Math.pow(10, k);
      return { top, k, q: `<p>A hawk at trophic level ${k + 1} receives ${top} units of energy from its food. How much energy did the plants (level 1) have to capture, by the 10 per cent rule?</p>`, answer, unit: 'units', tol: 0.01,
        hint: 'Go backwards: each level below has 10 times as much.', solution: steps(`Going down one level multiplies by 10, ${k} times.`, `${top} × 10^${k} = <b>${n(answer, 6)} units</b>.`) };
    },
    verify: (x) => Number(x.top + '0'.repeat(x.k)),
  },
  'c8s-eco-leaf': {
    title: 'leaf mass left after decomposition',
    make(r) {
      const m0 = choose(r, [20, 40, 80]), hl = choose(r, [10, 15, 20]), k = choose(r, [1, 2, 3]), answer = m0 / Math.pow(2, k);
      return { m0, hl, k, q: `<p>Decomposers halve the mass of a fallen leaf every ${hl} days. A leaf has a mass of ${m0} g when it falls. What mass is left after ${hl * k} days?</p>`, answer, unit: 'g', tol: 0.01,
        hint: 'Count how many times the mass halves: days ÷ ' + hl + '.', solution: steps(`${hl * k} ÷ ${hl} = ${k} halvings.`, `${m0} ÷ 2^${k} = <b>${n(answer, 4)} g</b>.`) };
    },
    verify: (x) => { let m = x.m0; for (let i = 0; i < x.k; i++) m *= 0.5; return m; },
  },
  'c8s-eco-common': {
    title: 'share of the commonest species',
    make(r) {
      const a = pick(r, 20, 60, 5), b = pick(r, 10, 40, 5), c = pick(r, 5, 30, 5), answer = Math.max(a, b, c) / (a + b + c) * 100;
      return { a, b, c, q: `<p>In a small field, students counted ${a} ants, ${b} beetles and ${c} spiders. What per cent of all the animals counted belong to the commonest group?</p>`, answer, unit: '%', tol: 0.01,
        hint: 'Find the biggest count and divide by the total.', solution: steps(`Total = ${a} + ${b} + ${c} = ${a + b + c}.`, `Biggest count = ${Math.max(a, b, c)}.`, `${Math.max(a, b, c)} ÷ ${a + b + c} × 100 = <b>${n(answer, 4)}%</b>.`) };
    },
    verify: (x) => 100 / (1 + (x.a + x.b + x.c - Math.max(x.a, x.b, x.c)) / Math.max(x.a, x.b, x.c)),
  },
};

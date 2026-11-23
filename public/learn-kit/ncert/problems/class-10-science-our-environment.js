// Class 10 Science, Our Environment: live problems (original fibub questions). Ids start with c10s-env-.
import { pick, choose, n, steps } from './_util.js';
const ord = (n) => n + ((n % 100 >= 11 && n % 100 <= 13) ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' }[n % 10] || 'th'));

export default {
  'c10s-env-energy': {
    title: 'energy at a trophic level (10 per cent law)',
    make(r) {
      const E = choose(r, [1000, 5000, 10000, 20000, 50000]), L = pick(r, 2, 4), names = ['', 'herbivores (2nd level)', 'first carnivores (3rd level)', 'second carnivores (4th level)'];
      return { E, L, q: `<p>Producers in a field fix ${n(E)} J of energy. Using the 10 per cent law, how much energy reaches the ${names[L - 1]}? (Answer in joules.)</p>`, answer: E * Math.pow(0.1, L - 1), unit: 'J', tol: 0.01,
        hint: 'Only 10% of the energy passes on at each step. Count the steps from the producers.',
        solution: steps(`From the 1st level to the ${ord(L)} level there are ${L - 1} steps, each keeping 10%.`, `${n(E)} × (0.1)<sup>${L - 1}</sup> = <b>${n(E * Math.pow(0.1, L - 1))} J</b>.`) };
    },
    verify: (x) => { let e = x.E; for (let i = 1; i < x.L; i++) e = e / 10; return e; },
  },
  'c10s-env-lost': {
    title: 'energy lost along a food chain',
    make(r) {
      const E = choose(r, [2000, 10000, 40000]), k = pick(r, 2, 4);
      return { E, k, q: `<p>A food chain has ${k} steps after the producers. The producers hold ${n(E)} J. How much energy has been lost as heat and used up on the way, by the time the last step is reached?</p>`, answer: E - E * Math.pow(0.1, k), unit: 'J', tol: 0.01,
        hint: 'Energy that reaches the last level = E × 0.1<sup>k</sup>. The rest is lost.',
        solution: steps(`Energy at the last level = ${n(E)} × 0.1<sup>${k}</sup> = ${n(E * Math.pow(0.1, k))} J.`, `Lost = ${n(E)} − ${n(E * Math.pow(0.1, k))} = <b>${n(E - E * Math.pow(0.1, k))} J</b>.`) };
    },
    verify: (x) => { let e = x.E, lost = 0; for (let i = 0; i < x.k; i++) { lost += e * 0.9; e *= 0.1; } return lost; },
  },
  'c10s-env-levels': {
    title: 'how long can a food chain be?',
    make(r) {
      const E = choose(r, [10000, 100000, 1000000]), need = choose(r, [1, 10]);
      return { E, need, q: `<p>The producers of an ecosystem fix ${n(E)} J. A top carnivore needs at least ${need} J to survive. By the 10 per cent law, what is the largest number of trophic levels (counting the producers as level 1) that the ecosystem can support?</p>`, answer: Math.floor(Math.log10(E / need) + 1e-9) + 1, unit: 'levels', tol: 0,
        hint: 'Level 1 has E, level 2 has E/10 and so on. Keep dividing by 10 while the energy is still at least the amount needed.',
        solution: steps('Divide by 10 for every step up the chain.', `Levels: ${[0, 1, 2, 3, 4, 5, 6].filter((i) => E / Math.pow(10, i) >= need).map((i) => n(E / Math.pow(10, i))).join(' → ')} J. So <b>${Math.floor(Math.log10(E / need) + 1e-9) + 1}</b> levels.`) };
    },
    verify: (x) => { let e = x.E, c = 1; while (e / 10 >= x.need - 1e-9) { e /= 10; c++; } return c; },
  },
  'c10s-env-magnif': {
    title: 'biological magnification',
    make(r) {
      const c0 = choose(r, [0.002, 0.005, 0.01, 0.02]), f = choose(r, [5, 8, 10]), L = pick(r, 2, 4);
      return { c0, f, L, q: `<p>A pesticide is present in lake water at ${c0} ppm. At each step up the food chain its concentration in the bodies becomes ${f} times greater (it is not broken down). What is the concentration, in ppm, in organisms ${L} steps above the water?</p>`, answer: c0 * Math.pow(f, L), unit: 'ppm', tol: 0.01,
        hint: 'Multiply by the factor once for every step.',
        solution: steps(`Concentration = ${c0} × ${f}<sup>${L}</sup>.`, `= ${c0} × ${n(Math.pow(f, L))} = <b>${n(c0 * Math.pow(f, L))} ppm</b>.`) };
    },
    verify: (x) => { let c = x.c0; for (let i = 0; i < x.L; i++) c *= x.f; return c; },
  },
  'c10s-env-compost': {
    title: 'kitchen waste for compost',
    make(r) {
      const kg = choose(r, [0.4, 0.5, 0.6, 0.8]), b = choose(r, [50, 60, 70, 80]), d = choose(r, [30, 60, 90]);
      return { kg, b, d, q: `<p>A family makes ${kg} kg of household waste every day. ${b}% of it is biodegradable (peels, leaves, leftovers) and can be composted. How many kg can they compost in ${d} days?</p>`, answer: kg * (b / 100) * d, unit: 'kg', tol: 0.01,
        hint: 'Daily biodegradable waste = total × percentage. Multiply by the number of days.',
        solution: steps(`Biodegradable per day = ${kg} × ${b}/100 = ${n(kg * b / 100)} kg.`, `In ${d} days: ${n(kg * b / 100)} × ${d} = <b>${n(kg * b / 100 * d)} kg</b>.`) };
    },
    verify: (x) => { let t = 0; for (let i = 0; i < x.d; i++) t += x.kg * x.b / 100; return t; },
  },
  'c10s-env-halflife': {
    title: 'how fast a compostable item rots',
    make(r) {
      const T = choose(r, [2, 3, 4]), k = pick(r, 2, 5), m = choose(r, [80, 160, 320, 640]);
      return { T, k, m, q: `<p>A plant-based plate loses half of its mass every ${T} months in a compost pit. Starting with ${m} g, how many grams are left after ${T * k} months?</p>`, answer: m / Math.pow(2, k), unit: 'g', tol: 0.01,
        hint: 'Count how many halvings fit in the time.',
        solution: steps(`${T * k} months ÷ ${T} months = ${k} halvings.`, `${m} ÷ 2<sup>${k}</sup> = <b>${n(m / Math.pow(2, k))} g</b>.`) };
    },
    verify: (x) => { let g = x.m; for (let mo = x.T; mo <= x.T * x.k; mo += x.T) g /= 2; return g; },
  },
};

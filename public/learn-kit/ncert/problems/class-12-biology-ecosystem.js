// Class 12 Biology, Chapter 12 Ecosystem: live problems (original fibub questions). Ids start with c12b-eco-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c12b-eco-tenpct': {
    title: 'energy at a trophic level (10 per cent law)',
    make(r) {
      const E = choose(r, [1000, 2000, 5000, 10000, 20000, 50000]), lv = pick(r, 2, 5, 1), names = ['', 'producers', 'herbivores', 'small carnivores', 'large carnivores', 'top carnivores'];
      const ans = E * Math.pow(0.1, lv - 1);
      return { E, lv, q: `<p>The producers in a grassland trap ${n(E)} kJ of energy per square metre per year. Using the 10 per cent law, how much energy reaches trophic level ${lv} (${names[lv]})? (Level 1 is the producers.)</p>`, answer: ans, unit: 'kJ', tol: 0.01,
        hint: 'Each step passes on only 10 % (one tenth) of the energy it receives. Level 2 gets 1/10, level 3 gets 1/100 of the producers’ energy.',
        solution: steps(`Number of transfers = ${lv} − 1 = ${lv - 1}.`, `Energy = ${n(E)} × (1/10)^${lv - 1} = <b>${n(ans)} kJ</b>.`) };
    },
    verify: (x) => { let e = x.E; for (let i = 1; i < x.lv; i++) e = e / 10; return e; },
  },
  'c12b-eco-npp': {
    title: 'net primary productivity',
    make(r) {
      const G = pick(r, 1000, 6000, 250), Rr = pick(r, 200, 900, 50) * Math.floor(1 + (G / 3000));
      const ans = G - Rr;
      return { G, Rr, q: `<p>A forest makes ${n(G)} kcal/m²/yr of organic matter in photosynthesis (gross primary productivity). The plants use ${n(Rr)} kcal/m²/yr in their own respiration. What is the net primary productivity in kcal/m²/yr?</p>`, answer: ans, unit: 'kcal/m²/yr', tol: 0.01,
        hint: 'NPP is what is left after the producers pay their own energy bill: NPP = GPP − R.',
        solution: steps('NPP = GPP − R.', `= ${n(G)} − ${n(Rr)} = <b>${n(ans)}</b> kcal/m²/yr.`, 'This is the food available to herbivores and decomposers.') };
    },
    verify: (x) => { const left = x.G; return left - x.Rr; },
  },
  'c12b-eco-eff': {
    title: 'trophic transfer efficiency',
    make(r) {
      const E1 = choose(r, [8000, 10000, 12000, 20000, 40000]), E2 = choose(r, [400, 600, 800, 1000, 1200, 2000, 4000]);
      const ans = (E2 / E1) * 100;
      return { E1, E2, q: `<p>The primary producers of a pond have ${n(E1)} J of energy; the herbivores that eat them have ${n(E2)} J. What is the percentage of energy transferred from producers to herbivores?</p>`, answer: ans, unit: '%', tol: 0.01,
        hint: 'Transfer efficiency = (energy at the next level ÷ energy at this level) × 100.',
        solution: steps(`${n(E2)} ÷ ${n(E1)} = ${n(E2 / E1, 4)}.`, `× 100 = <b>${n(ans)} %</b>.`, 'The rest was used in respiration, lost as heat or went to decomposers.') };
    },
    verify: (x) => 100 * x.E2 / x.E1,
  },
  'c12b-eco-levels': {
    title: 'how long can the food chain be?',
    make(r) {
      const E = choose(r, [1e4, 1e5, 1e6, 1e7]), minE = choose(r, [1, 10, 100]);
      let lv = 1, e = E; while (e / 10 >= minE) { e /= 10; lv++; }
      return { E, minE, lv, q: `<p>Producers capture ${n(E)} kJ. Each step passes on 10 % of the energy. A top predator needs at least ${n(minE)} kJ to support a population. What is the largest number of trophic levels (counting the producers as level 1) the chain can have?</p>`, answer: lv, unit: 'levels', tol: 0, abs: 0.01,
        hint: 'Divide by 10 for every new level until the next level would fall below the minimum.',
        solution: steps(`Level 1 = ${n(E)} kJ, level 2 = ${n(E / 10)}, level 3 = ${n(E / 100)}, and so on.`, `The last level with at least ${n(minE)} kJ is level <b>${lv}</b>.`, 'Because so much energy is lost at each step, chains rarely have more than four or five links.') };
    },
    verify: (x) => Math.floor(Math.log10(x.E / x.minE) + 1e-9) + 1,
  },
  'c12b-eco-decay': {
    title: 'litter left after some years',
    make(r) {
      const m0 = choose(r, [200, 400, 500, 800, 1000]), k = choose(r, [0.1, 0.2, 0.3, 0.5, 0.8]), t = choose(r, [1, 2, 3, 4, 5]);
      const ans = m0 * Math.exp(-k * t);
      return { m0, k, t, q: `<p>${n(m0)} g of leaf litter on a forest floor decays with decay constant k = ${k} per year (mass = m₀e^(−kt)). How many grams remain after ${t} year${t > 1 ? 's' : ''}?</p>`, answer: ans, unit: 'g', tol: 0.02,
        hint: 'Work out k × t, then e to the minus that number, then multiply by the starting mass.',
        solution: steps(`k × t = ${k} × ${t} = ${n(k * t)}.`, `e^(−${n(k * t)}) = ${n(Math.exp(-k * t))}.`, `Mass = ${n(m0)} × ${n(Math.exp(-k * t))} = <b>${n(ans)} g</b>.`) };
    },
    verify: (x) => { let term = 1, sum = 1; const a = -x.k * x.t; for (let i = 1; i < 60; i++) { term *= a / i; sum += term; } return x.m0 * sum; },
  },
};

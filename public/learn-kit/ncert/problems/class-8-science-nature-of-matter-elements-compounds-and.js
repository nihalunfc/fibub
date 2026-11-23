// Class 8 Science (Curiosity), Chapter 8 Nature of Matter: Elements, Compounds, and Mixtures: live problems (original fibub questions). Ids start with c8s-matter-.
import { pick, choose, n, steps } from './_util.js';

const MOL = [['water, H₂O', 3], ['carbon dioxide, CO₂', 3], ['ammonia, NH₃', 4], ['methane, CH₄', 5], ['sulfuric acid, H₂SO₄', 7], ['glucose, C₆H₁₂O₆', 24]];
export default {
  'c8s-matter-atoms': {
    title: 'atoms in a number of molecules',
    make(r) {
      const mo = choose(r, MOL), k = pick(r, 2, 12, 1), answer = mo[1] * k;
      return { k, a: mo[1], q: `<p>One molecule of ${mo[0]} contains ${mo[1]} atoms in all. How many atoms are there in ${k} molecules of it?</p>`, answer, unit: 'atoms', tol: 0.01,
        hint: 'Multiply the atoms in one molecule by the number of molecules.', solution: steps(`Atoms = ${mo[1]} × ${k}.`, `= <b>${answer} atoms</b>.`) };
    },
    verify: (x) => x.k * x.a,
  },
  'c8s-matter-oxygen': {
    title: 'oxygen in water by mass',
    make(r) {
      const M = choose(r, [9, 18, 27, 36, 45, 90]), answer = M * 8 / 9;
      return { M, q: `<p>In water, hydrogen and oxygen are joined in the fixed mass ratio 1 : 8. How many grams of oxygen are there in ${M} g of water?</p>`, answer, unit: 'g', tol: 0.01,
        hint: 'The total ratio is 1 + 8 = 9 parts. Oxygen is 8 of them.', solution: steps(`Total parts = 1 + 8 = 9, so one part = ${M} ÷ 9 = ${n(M / 9, 4)} g.`, `Oxygen = 8 × ${n(M / 9, 4)} = <b>${n(answer, 4)} g</b>.`) };
    },
    verify: (x) => x.M - x.M / 9,
  },
  'c8s-matter-percent': {
    title: 'percentage of a mixture',
    make(r) {
      const a = pick(r, 10, 40, 5), b = pick(r, 60, 160, 10), answer = a / (a + b) * 100;
      return { a, b, q: `<p>A mixture is made of ${a} g of salt and ${b} g of sand. What percentage of the mixture is salt, by mass?</p>`, answer, unit: '%', tol: 0.01,
        hint: 'Percentage = (mass of salt ÷ total mass) × 100.', solution: steps(`Total mass = ${a} + ${b} = ${a + b} g.`, `Salt % = ${a} ÷ ${a + b} × 100 = <b>${n(answer, 4)} %</b>.`) };
    },
    verify: (x) => 100 - 100 * x.b / (x.a + x.b),
  },
  'c8s-matter-recover': {
    title: 'salt recovered by evaporation',
    make(r) {
      const m = pick(r, 100, 400, 50), p = choose(r, [2, 4, 5, 10, 20]), answer = m * p / 100;
      return { m, p, q: `<p>${m} g of a salt solution contains ${p}% salt by mass. If all the water is evaporated, what mass of salt is left?</p>`, answer, unit: 'g', tol: 0.01,
        hint: 'Salt mass = percentage × total mass ÷ 100.', solution: steps(`Salt = ${p}% of ${m} g = ${p} ÷ 100 × ${m}.`, `= <b>${n(answer, 4)} g</b>. The rest, ${n(m - answer, 4)} g, is water that evaporates.`) };
    },
    verify: (x) => x.m * x.p * 0.01,
  },
};

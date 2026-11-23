// Class 8 Science, Chapter 9 Solutes, Solvents and Solutions: live problems (original fibub questions). Ids start with c8s-sol-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c8s-sol-pct': {
    title: 'concentration as mass per cent',
    make(r) {
      const m = pick(r, 10, 60, 5), w = pick(r, 100, 400, 50), answer = m / (m + w) * 100;
      return { m, w, q: `<p>${m} g of sugar is dissolved completely in ${w} g of water. What is the concentration of the solution as a mass per cent (mass of solute ÷ mass of solution × 100)?</p>`, answer, unit: '%', tol: 0.01,
        hint: 'The mass of the solution is solute plus solvent, not just the solvent.', solution: steps(`Mass of solution = ${m} + ${w} = ${m + w} g.`, `Per cent = ${m} ÷ ${m + w} × 100 = <b>${n(answer, 4)}%</b>.`) };
    },
    verify: (x) => 100 / (1 + x.w / x.m),
  },
  'c8s-sol-dilute': {
    title: 'water to add when diluting',
    make(r) {
      const v1 = pick(r, 100, 500, 100), c1 = choose(r, [20, 30, 40, 60]), c2 = choose(r, [5, 10]), answer = v1 * (c1 / c2 - 1);
      return { v1, c1, c2, q: `<p>You have ${v1} mL of juice concentrate that is ${c1}% juice. How many mL of water must you add to make it ${c2}% juice?</p>`, answer, unit: 'mL', tol: 0.01,
        hint: 'The amount of juice stays the same. Concentration times volume before = concentration times volume after.', solution: steps(`Juice present = ${c1}% of ${v1} mL = ${n(c1 * v1 / 100, 4)} mL.`, `Final volume = juice ÷ ${c2}% = ${n(c1 * v1 / c2, 4)} mL.`, `Water to add = ${n(c1 * v1 / c2, 4)} − ${v1} = <b>${n(answer, 4)} mL</b>.`) };
    },
    verify: (x) => ((x.c1 - x.c2) / x.c2) * x.v1,
  },
  'c8s-sol-undissolved': {
    title: 'how much stays undissolved',
    make(r) {
      const sol = choose(r, [36, 32, 64, 110]), w = choose(r, [50, 100, 150, 200]), extra = pick(r, 10, 60, 10), cap = sol * w / 100, m = cap + extra;
      return { sol, w, m, q: `<p>At a certain temperature, ${sol} g of a salt dissolves in 100 g of water to make a saturated solution. You stir ${n(m, 5)} g of the salt into ${w} g of water at that temperature. How many grams stay undissolved at the bottom?</p>`, answer: extra, unit: 'g', tol: 0.01,
        hint: 'First work out the most that can dissolve in this amount of water.', solution: steps(`${w} g of water can hold ${sol} × ${w} ÷ 100 = ${n(cap, 4)} g.`, `Undissolved = ${n(m, 5)} − ${n(cap, 4)} = <b>${n(extra, 4)} g</b>.`) };
    },
    verify: (x) => x.m - (x.sol / 100) * x.w,
  },
  'c8s-sol-saline': {
    title: 'making a solution of a given strength',
    make(r) {
      const v = choose(r, [100, 250, 500, 1000]), c = choose(r, [0.9, 2, 5, 10]), answer = v * c / 100;
      return { v, c, q: `<p>How many grams of solute are needed to make ${v} mL of a ${c}% (mass per volume, g per 100 mL) solution?</p>`, answer, unit: 'g', tol: 0.01,
        hint: 'A c% (g per 100 mL) solution has c g of solute in every 100 mL.', solution: steps(`${c} g in every 100 mL, and you want ${v} mL, which is ${v / 100} lots of 100 mL.`, `Solute = ${c} × ${v / 100} = <b>${n(answer, 4)} g</b>.`) };
    },
    verify: (x) => (x.v / 100) * x.c,
  },
};

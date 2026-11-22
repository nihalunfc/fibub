// Class 9 Science (Exploration), Chapter 5 Exploring Mixtures and their Separation: live problems (original fibub questions). Ids start with c9s-mix-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c9s-mix-masspct': {
    title: 'concentration as mass percent',
    make(r) {
      const s = pick(r, 5, 40, 5), v = pick(r, 100, 400, 50), answer = (s / (s + v)) * 100;
      return { s, v, q: `<p>${s} g of salt is dissolved in ${v} g of water. What is the concentration of the solution in mass percent?</p>`, answer: +answer.toFixed(4), unit: '%', tol: 0.01,
        hint: 'Mass percent = mass of solute ÷ mass of solution × 100, and the mass of the solution is solute + solvent.',
        solution: steps(`Mass of solution = ${s} + ${v} = ${s + v} g.`, `Mass percent = ${s} ÷ ${s + v} × 100 = <b>${n(answer, 4)}%</b>.`) };
    },
    verify: (x) => 100 - (100 * x.v) / (x.s + x.v),
  },
  'c9s-mix-solute': {
    title: 'mass of solute needed for a given concentration',
    make(r) {
      const p = choose(r, [2, 5, 8, 10, 12, 15, 20, 25]), M = pick(r, 100, 500, 50), answer = (p * M) / 100;
      return { p, M, q: `<p>How many grams of sugar are needed to make ${M} g of a ${p}% (by mass) sugar solution?</p>`, answer, unit: 'g', tol: 0.01,
        hint: 'Mass of solute = (percent ÷ 100) × mass of solution.',
        solution: steps(`Solute = ${p}% of ${M} g = ${p} ÷ 100 × ${M}.`, `= <b>${n(answer, 4)} g</b>. The rest, ${M - answer} g, is water.`) };
    },
    verify: (x) => x.M * (x.p / 100),
  },
  'c9s-mix-massvol': {
    title: 'concentration as mass by volume',
    make(r) {
      const m = pick(r, 2, 30, 1), V = choose(r, [100, 200, 250, 500]), answer = (m / V) * 100;
      return { m, V, q: `<p>${m} g of glucose is dissolved in water to make ${V} mL of solution. What is its concentration in mass by volume (g per 100 mL)?</p>`, answer: +answer.toFixed(4), unit: 'g per 100 mL', tol: 0.01,
        hint: 'Mass by volume (g per 100 mL) = mass of solute ÷ volume of solution in mL × 100.',
        solution: steps(`Concentration = ${m} ÷ ${V} × 100.`, `= <b>${n(answer, 4)} g per 100 mL</b>, that is ${n(answer, 4)}% (w/v).`) };
    },
    verify: (x) => x.m / (x.V / 100),
  },
  'c9s-mix-rf': {
    title: 'Rf value in paper chromatography',
    make(r) {
      const sf = choose(r, [8, 9, 10, 12]), d = pick(r, 10, 90, 5) / 100 * sf, answer = +(d / sf).toFixed(4);
      const dd = +d.toFixed(2);
      return { sf, dd, q: `<p>In paper chromatography the solvent front moved ${sf} cm and a dye spot moved ${n(dd, 3)} cm from the starting line. Find the Rf value of the dye.</p>`, answer: +(dd / sf).toFixed(4), unit: '', tol: 0.02,
        hint: 'Rf = distance moved by the spot ÷ distance moved by the solvent front.',
        solution: steps(`Rf = ${n(dd, 3)} ÷ ${sf}.`, `= <b>${n(dd / sf, 3)}</b>. It has no unit and is always between 0 and 1.`) };
    },
    verify: (x) => x.dd / x.sf,
  },
  'c9s-mix-crystals': {
    title: 'crystals formed on cooling a saturated solution',
    make(r) {
      const w = choose(r, [100, 200, 250]), hot = pick(r, 80, 160, 10), cold = pick(r, 20, 60, 5), s1 = hot, s2 = cold;
      const answer = ((s1 - s2) * w) / 100;
      return { w, s1, s2, q: `<p>A hot saturated solution holds ${s1} g of a salt per 100 g of water. When cooled it can hold only ${s2} g per 100 g of water. If ${w} g of water is used, how many grams of crystals form on cooling?</p>`, answer, unit: 'g', tol: 0.01,
        hint: 'The difference in solubility (per 100 g of water), scaled to the mass of water.',
        solution: steps(`Salt lost per 100 g of water = ${s1} − ${s2} = ${s1 - s2} g.`, `For ${w} g of water: ${s1 - s2} × ${w} ÷ 100 = <b>${n(answer, 4)} g</b> of crystals.`) };
    },
    verify: (x) => x.s1 * (x.w / 100) - x.s2 * (x.w / 100),
  },
};

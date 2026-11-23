// Class 11 Biology, Chemical Coordination and Integration: live problems (original fibub questions). Ids start with c11b-chem-.
import { choose, n, steps } from './_util.js';

export default {
  'c11b-chem-glucose': {
    title: 'blood glucose in mg/dL',
    make(r) {
      const mm = choose(r, [4.5, 5.0, 5.6, 6.1, 7.0, 8.5, 11.1]);
      return { mm, q: `<p>A lab report gives a fasting blood glucose of ${mm} mmol/L. Convert it to mg/dL. (Glucose: 180 g per mole, so 1 mmol/L = 18 mg/dL.)</p>`, answer: mm * 18, unit: 'mg/dL', tol: 0.02,
        hint: 'Multiply by 18 (180 mg per mmol, and 1 L = 10 dL).',
        solution: steps(`1 mmol/L of glucose = 180 mg per litre = 18 mg per dL.`, `${mm} × 18 = <b>${n(mm * 18)} mg/dL</b>.`, mm * 18 >= 126 ? 'This is at or above 126 mg/dL, the fasting level that points to diabetes.' : 'This is below 126 mg/dL, the fasting level used for diagnosing diabetes.') };
    },
    verify: (x) => x.mm * 180 / 10,
  },
  'c11b-chem-iodine': {
    title: 'iodised salt for the daily iodine need',
    make(r) {
      const need = choose(r, [150, 200, 250]), per = choose(r, [15, 20, 25, 30]);
      return { need, per, q: `<p>A person needs ${need} µg of iodine a day. Iodised salt supplies ${per} µg of iodine in every gram. How many grams of this salt would give the whole daily need?</p>`, answer: need / per, unit: 'g', tol: 0.01,
        hint: 'Number of grams = amount needed ÷ amount in each gram.',
        solution: steps(`Grams = ${need} ÷ ${per} = <b>${n(need / per)} g</b>.`, 'That is about a teaspoon or less, so there is no need to eat extra salt: the daily limit for salt is about 5 g.') };
    },
    verify: (x) => 1 / (x.per / x.need),
  },
  'c11b-chem-halflife': {
    title: 'how much of a hormone is left',
    make(r) {
      const h = choose(r, [7, 5, 10]), d = choose(r, [7, 14, 21, 28]);
      return { h, d, q: `<p>Thyroxine in the blood has a half-life of about ${h} days. If the gland stops making it, what percentage is left after ${d} days?</p>`, answer: Math.pow(0.5, d / h) * 100, unit: '%', tol: 0.02,
        hint: 'Count how many half-lives pass (days ÷ half-life), then halve that many times.',
        solution: steps(`Number of half-lives = ${d} ÷ ${h} = ${n(d / h)}.`, `Fraction left = (1/2)^${n(d / h)} = ${n(Math.pow(0.5, d / h), 3)}.`, `Percentage = <b>${n(Math.pow(0.5, d / h) * 100)} %</b>.`) };
    },
    verify: (x) => Math.exp(-Math.LN2 * x.d / x.h) * 100,
  },
  'c11b-chem-dose': {
    title: 'volume of insulin to inject',
    make(r) {
      const conc = choose(r, [40, 100]), dose = choose(r, [10, 16, 20, 30, 40]);
      return { conc, dose, q: `<p>A vial of insulin contains ${conc} units in every mL. A patient needs ${dose} units. How many millilitres should be drawn into the syringe?</p>`, answer: dose / conc, unit: 'mL', tol: 0.01,
        hint: 'Volume = units needed ÷ units per mL.',
        solution: steps(`Volume = ${dose} ÷ ${conc} = <b>${n(dose / conc)} mL</b>.`) };
    },
    verify: (x) => x.dose * (1 / x.conc),
  },
};

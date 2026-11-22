// Class 12 Biology, Human Health and Disease: live problems (original fibub questions). Ids start with c12b-health-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c12b-health-herd': {
    title: 'vaccination needed for herd immunity',
    make(r) {
      const R0 = choose(r, [2, 2.5, 4, 5, 8, 12]);
      return { R0, q: `<p>A disease has a basic reproduction number R<sub>0</sub> = ${R0} (each case infects ${R0} others in a fully susceptible population). What percentage of the population must be immune, at least, so that the disease cannot keep spreading (the herd-immunity threshold)?</p>`, answer: 100 * (1 - 1 / R0), unit: '%', tol: 0.02,
        hint: 'Spread stops when each case infects fewer than one other: R<sub>0</sub> × (fraction still susceptible) < 1.',
        solution: steps(`Susceptible fraction must be below 1/R<sub>0</sub> = 1/${R0} = ${n(1 / R0, 3)}.`, `Immune fraction = 1 − ${n(1 / R0, 3)} = ${n(1 - 1 / R0, 3)}.`, `Threshold = <b>${n(100 * (1 - 1 / R0))} %</b>. Measles (R<sub>0</sub> about 12) needs over 90 %.`) };
    },
    verify: (x) => (x.R0 - 1) / x.R0 * 100,
  },
  'c12b-health-growth': {
    title: 'cases growing in an outbreak',
    make(r) {
      const c0 = pick(r, 2, 20, 2), R = choose(r, [2, 3]), g = pick(r, 2, 5, 1);
      return { c0, R, g, q: `<p>An outbreak starts with ${c0} cases. In every round of infection each case infects ${R} new people (and ignore recoveries). How many new cases appear in round ${g}?</p>`, answer: c0 * R ** g, unit: 'cases', tol: 0.01,
        hint: 'Each round multiplies the number of new cases by R. Round 1 has c₀ × R.',
        solution: steps(`Round 1: ${c0} × ${R} = ${c0 * R}.`, `Each round multiplies by ${R}, so round ${g}: ${c0} × ${R}<sup>${g}</sup> = <b>${n(c0 * R ** g)}</b>.`, 'This is why a few cases can become thousands in a few weeks, and why early control matters.') };
    },
    verify: (x) => { let c = x.c0; for (let i = 0; i < x.g; i++) c *= x.R; return c; },
  },
  'c12b-health-booster': {
    title: 'booster antibody level',
    make(r) {
      const a0 = pick(r, 10, 40, 10), fold = choose(r, [20, 50, 100]);
      return { a0, fold, q: `<p>After a first vaccine dose a child's antibody level peaks at ${a0} units. A booster dose, given weeks later, makes the antibody level peak ${fold} times higher than the first peak. What is the peak after the booster?</p>`, answer: a0 * fold, unit: 'units', tol: 0.01,
        hint: 'Multiply the first peak by the fold increase.', solution: steps(`Second peak = ${a0} × ${fold} = <b>${n(a0 * fold)} units</b>.`, 'Memory B cells respond faster and in larger numbers on the second meeting with an antigen: this is the secondary response.') };
    },
    verify: (x) => x.fold * x.a0,
  },
  'c12b-health-cd4pct': {
    title: 'percentage of cells infected',
    make(r) {
      const tot = choose(r, [800, 1000]), now = pick(r, 100, 700, 100);
      return { tot, now, q: `<p>A healthy person has ${tot} helper T cells per microlitre of blood. A patient with HIV has ${now} per microlitre. By what percentage has the helper T cell count fallen? (AIDS is diagnosed below 200.)</p>`, answer: 100 * (tot - now) / tot, unit: '%', tol: 0.02,
        hint: 'Fall in count ÷ original count × 100.', solution: steps(`Fall = ${tot} − ${now} = ${tot - now}.`, `Percentage = ${tot - now} ÷ ${tot} × 100 = <b>${n(100 * (tot - now) / tot)} %</b>.`, now < 200 ? 'Below 200 per µL: this is in the AIDS range.' : 'Above 200 per µL: not yet in the AIDS range, but the immune system is weakening.') };
    },
    verify: (x) => (1 - x.now / x.tot) * 100,
  },
  'c12b-health-malaria': {
    title: 'the malaria fever cycle',
    make(r) {
      const sp = choose(r, [['Plasmodium vivax', 48], ['Plasmodium malariae', 72], ['Plasmodium ovale', 48]]), k = pick(r, 2, 6, 1);
      return { name: sp[0], hrs: sp[1], k, q: `<p>The parasites in the red blood cells of a patient with ${sp[0]} burst out all together every ${sp[1]} hours, each time causing a bout of fever. How many hours after the first bout does bout number ${k} begin?</p>`, answer: sp[1] * (k - 1), unit: 'h', tol: 0, abs: 0.01,
        hint: 'The first bout is at 0 hours. Between bout 1 and bout k there are k − 1 gaps.', solution: steps(`Gaps between bouts = ${k} − 1 = ${k - 1}.`, `Time = ${k - 1} × ${sp[1]} = <b>${sp[1] * (k - 1)} h</b>, about ${n(sp[1] * (k - 1) / 24, 3)} days.`, 'The fever comes when the haemozoin and parasite debris are released as the red cells burst.') };
    },
    verify: (x) => { let t = 0; for (let i = 1; i < x.k; i++) t += x.hrs; return t; },
  },
};

// Class 9 Science, Chapter 12 Patterns in Life: Diversity and Classification: live problems (original fibub questions). Ids start with c9s-div-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c9s-div-keymax': {
    title: 'how many organisms a key can separate',
    make(r) {
      const q = pick(r, 2, 8), answer = 2 ** q;
      return { q_: q, k: q, q: `<p>A dichotomous key has ${q} yes/no questions along every path. What is the greatest number of different organisms it can tell apart?</p>`, answer, unit: 'organisms', tol: 0, abs: 0.01,
        hint: 'Each yes/no question splits the group into two. Two choices at every step multiply.', solution: steps(`${q} questions, each with 2 outcomes: 2 × 2 × ... (${q} times).`, `2<sup>${q}</sup> = <b>${answer}</b> organisms.`) };
    },
    verify: (x) => { let c = 1; for (let i = 0; i < x.k; i++) c *= 2; return c; },
  },
  'c9s-div-keyneed': {
    title: 'least questions needed for a key',
    make(r) {
      const N = pick(r, 5, 60, 5), answer = Math.ceil(Math.log2(N));
      return { N, q: `<p>You must build a dichotomous key to identify ${N} different organisms. What is the smallest number of yes/no questions that could be needed on the longest path?</p>`, answer, unit: 'questions', tol: 0, abs: 0.01,
        hint: 'With q questions you can separate at most 2<sup>q</sup> organisms. Find the smallest q with 2<sup>q</sup> at least N.', solution: steps(`We need 2<sup>q</sup> ≥ ${N}.`, `2<sup>${answer - 1}</sup> = ${2 ** (answer - 1)} is too small and 2<sup>${answer}</sup> = ${2 ** answer} is enough, so q = <b>${answer}</b>.`) };
    },
    verify: (x) => { let q = 0, c = 1; while (c < x.N) { c *= 2; q++; } return q; },
  },
  'c9s-div-count': {
    title: 'species in a family',
    make(r) {
      const g = pick(r, 2, 6), s = pick(r, 2, 7), answer = g * s;
      return { g, s, q: `<p>A family of plants has ${g} genera and each genus has ${s} species. How many species are in the family?</p>`, answer, unit: 'species', tol: 0, abs: 0.01,
        hint: 'Genera are groups of species. Multiply the number of genera by the species in each.', solution: steps(`Species = genera × species per genus = ${g} × ${s}.`, `= <b>${answer}</b>.`) };
    },
    verify: (x) => Array.from({ length: x.g }).reduce((c) => c + x.s, 0),
  },
  'c9s-div-survey': {
    title: 'percentage in a group of a survey',
    make(r) {
      const tot = choose(r, [40, 50, 80, 100]), part = pick(r, 5, tot - 5, 5), answer = part / tot * 100;
      return { tot, part, q: `<p>A school-garden survey finds ${tot} different plant species, of which ${part} are flowering plants (angiosperms). What percentage of the species are angiosperms?</p>`, answer, unit: '%', tol: 0.01,
        hint: 'Percentage = part ÷ whole × 100.', solution: steps(`${part} ÷ ${tot} × 100.`, `= <b>${n(answer, 4)}%</b>.`) };
    },
    verify: (x) => (x.part * 100) / x.tot,
  },
};

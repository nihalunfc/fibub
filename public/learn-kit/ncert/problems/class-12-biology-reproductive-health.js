// Class 12 Biology, Reproductive Health: live problems (original fibub questions). Ids start with c12b-rhealth-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c12b-rhealth-growth': {
    title: 'population after some years of steady growth',
    make(r) {
      const P0 = choose(r, [50, 120, 250, 361, 500, 1000]), g = pick(r, 1, 3, 0.5), t = choose(r, [10, 20, 30, 40]), P = P0 * (1 + g / 100) ** t;
      return { P0, g, t, q: `<p>A town’s population is ${P0} thousand and it grows by ${g} % every year. What will the population be after ${t} years, in thousands? (Compound growth.)</p>`, answer: P, unit: 'thousand', tol: 0.02,
        hint: 'Each year the population is multiplied by (1 + g/100). After t years: P = P₀ (1 + g/100)^t.',
        solution: steps(`Yearly factor = 1 + ${g}/100 = ${1 + g / 100}.`, `P = ${P0} × ${1 + g / 100}<sup>${t}</sup> = ${P0} × ${n((1 + g / 100) ** t, 4)}.`, `<b>${n(P)} thousand</b>.`) };
    },
    verify: (x) => { let p = x.P0; for (let i = 0; i < x.t; i++) p *= 1 + x.g / 100; return p; },
  },
  'c12b-rhealth-doubling': {
    title: 'doubling time of a population',
    make(r) {
      const g = choose(r, [1, 1.5, 2, 2.5, 3]), t = Math.log(2) / Math.log(1 + g / 100);
      return { g, q: `<p>A population grows by ${g} % a year. After how many years will it double? (Use compound growth and give the answer to the nearest year or closer.)</p>`, answer: t, unit: 'years', tol: 0.03,
        hint: 'Solve (1 + g/100)^t = 2 with logarithms. The "rule of 70" gives about 70 ÷ g.',
        solution: steps(`(1 + ${g}/100)<sup>t</sup> = 2, so t = ln 2 ÷ ln ${1 + g / 100}.`, `t = 0.693 ÷ ${n(Math.log(1 + g / 100), 4)} = <b>${n(t)} years</b>.`, `Rule of 70: 70 ÷ ${g} = ${n(70 / g)} years, a quick check.`) };
    },
    verify: (x) => Math.log10(2) / Math.log10(1 + x.g / 100),
  },
  'c12b-rhealth-sexratio': {
    title: 'females from a sex ratio',
    make(r) {
      const M = choose(r, [4500, 12000, 25000, 60000, 120000]), R = pick(r, 900, 960, 10), F = M * R / 1000;
      return { M, R, q: `<p>In a district there are ${n(M, 6)} males and the sex ratio is ${R} (females per 1000 males). How many females live in the district?</p>`, answer: F, unit: 'females', tol: 0.01,
        hint: 'Sex ratio is females per 1000 males. Females = males × ratio ÷ 1000.',
        solution: steps(`Females per male = ${R}/1000 = ${R / 1000}.`, `Females = ${n(M, 6)} × ${R / 1000} = <b>${n(F, 6)}</b>.`) };
    },
    verify: (x) => x.M / 1000 * x.R,
  },
  'c12b-rhealth-pearl': {
    title: 'failure rate of a contraceptive (Pearl index)',
    make(r) {
      const N = choose(r, [200, 250, 400, 500, 1000]), m = choose(r, [6, 12]), k = pick(r, 2, 15, 1), PI = k * 1200 / (N * m);
      return { N, m, k, q: `<p>In a trial of a contraceptive method, ${N} women use it for ${m} months each, and ${k} of them become pregnant. How many pregnancies occur per 100 woman-years of use (the Pearl index)?</p>`, answer: PI, unit: 'per 100 woman-years', tol: 0.02,
        hint: 'Woman-years of use = number of women × months ÷ 12. Then pregnancies ÷ woman-years × 100.',
        solution: steps(`Woman-years = ${N} × ${m} ÷ 12 = ${n(N * m / 12)}.`, `Pearl index = ${k} ÷ ${n(N * m / 12)} × 100 = <b>${n(PI)}</b>.`, 'A smaller number means a more reliable method.') };
    },
    verify: (x) => (x.k / (x.N * (x.m / 12))) * 100,
  },
  'c12b-rhealth-tfr': {
    title: 'size of a generation from the fertility rate',
    make(r) {
      const f = choose(r, [1.5, 1.8, 2.1, 2.6, 3.0, 3.5]), g = choose(r, [2, 3, 4]), ans = 1000 * (f / 2.1) ** g;
      return { f, g, q: `<p>Women in a country have on average ${f} children each. Replacement level is 2.1. Ignoring other changes, if a generation has 1000 thousand people, how many thousand are there in the generation ${g} steps later?</p>`, answer: ans, unit: 'thousand', tol: 0.02,
        hint: 'Each generation is f ÷ 2.1 times the one before.',
        solution: steps(`Ratio per generation = ${f} ÷ 2.1 = ${n(f / 2.1, 4)}.`, `After ${g} generations: 1000 × ${n(f / 2.1, 4)}<sup>${g}</sup> = <b>${n(ans)} thousand</b>.`) };
    },
    verify: (x) => { let p = 1000; for (let i = 0; i < x.g; i++) p = p * x.f / 2.1; return p; },
  },
};

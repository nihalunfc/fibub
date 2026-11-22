// Class 12 Biology, Chapter 11 Organisms and Populations: live problems (original fibub questions). Ids start with c12b-pop-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c12b-pop-change': {
    title: 'population size after births, deaths and migration',
    make(r) {
      const N = pick(r, 200, 2000, 50), B = pick(r, 20, 300, 10), D = pick(r, 10, 200, 10), I = pick(r, 0, 100, 5), E = pick(r, 0, 100, 5);
      const ans = N + B + I - D - E;
      return { N, B, D, I, E, q: `<p>A pond has ${N} frogs. In a season ${B} are born, ${D} die, ${I} come in from nearby ponds and ${E} leave. How many frogs are in the pond at the end of the season?</p>`, answer: ans, unit: 'frogs', tol: 0, abs: 0.01,
        hint: 'Births and immigration add to the population; deaths and emigration take away.',
        solution: steps('N(t+1) = N(t) + [B + I] − [D + E].', `= ${N} + (${B} + ${I}) − (${D} + ${E}) = <b>${ans}</b> frogs.`) };
    },
    verify: (x) => { let c = x.N; c += x.B; c += x.I; c -= x.D; c -= x.E; return c; },
  },
  'c12b-pop-density': {
    title: 'population density',
    make(r) {
      const N = pick(r, 120, 1500, 30), A = choose(r, [2, 3, 4, 5, 6, 10, 12, 15, 20]);
      return { N, A, q: `<p>A sanctuary of ${A} km² has ${N} chital (spotted deer). What is the population density in deer per km²?</p>`, answer: N / A, unit: 'per km²', tol: 0.01,
        hint: 'Population density is the number of individuals per unit area.',
        solution: steps('Density = N ÷ area.', `${N} ÷ ${A} = <b>${n(N / A)}</b> per km².`) };
    },
    verify: (x) => { let per = 0; const step = x.N / x.A; for (let i = 0; i < x.A; i++) per += step; return per / x.A; },
  },
  'c12b-pop-exp': {
    title: 'exponential growth',
    make(r) {
      const N0 = choose(r, [10, 20, 50, 100, 200]), rr = choose(r, [0.02, 0.05, 0.1, 0.2, 0.3]), t = choose(r, [4, 5, 8, 10, 12]);
      const ans = N0 * Math.exp(rr * t);
      return { N0, rr, t, q: `<p>A bacterial culture of ${N0} cells has a growth rate r = ${rr} per hour (exponential growth, no limit). How many cells are there after ${t} hours? (Use N = N₀e^(rt).)</p>`, answer: ans, unit: 'cells', tol: 0.02,
        hint: 'Work out r × t first, then e raised to that power, then multiply by N₀.',
        solution: steps(`r × t = ${rr} × ${t} = ${n(rr * t)}.`, `e^${n(rr * t)} = ${n(Math.exp(rr * t))}.`, `N = ${N0} × ${n(Math.exp(rr * t))} = <b>${n(ans)}</b> cells.`) };
    },
    verify: (x) => { let c = x.N0; const steps2 = 20000, dt = x.t / steps2; for (let i = 0; i < steps2; i++) c += x.rr * c * dt; return c; },
  },
  'c12b-pop-lograte': {
    title: 'logistic growth rate',
    make(r) {
      const K = choose(r, [200, 400, 500, 800, 1000]), rr = choose(r, [0.1, 0.2, 0.25, 0.4, 0.5]), frac = choose(r, [0.1, 0.25, 0.5, 0.75, 0.9]);
      const N = K * frac, ans = rr * N * (K - N) / K;
      return { K, rr, N, q: `<p>A population has carrying capacity K = ${K} and r = ${rr}. When its size is N = ${N}, how many new individuals are added per unit time? (dN/dt = rN(K − N)/K.)</p>`, answer: ans, unit: 'per unit time', tol: 0.02,
        hint: 'Put the numbers into dN/dt = rN(K − N)/K. The (K − N)/K part is the share of resources still free.',
        solution: steps(`(K − N)/K = (${K} − ${N}) / ${K} = ${n((K - N) / K)}.`, `dN/dt = ${rr} × ${N} × ${n((K - N) / K)} = <b>${n(ans)}</b>.`, `(The largest value, rK/4 = ${n(rr * K / 4)}, is at N = K/2.)`) };
    },
    verify: (x) => x.rr * x.N - (x.rr * x.N * x.N) / x.K,
  },
  'c12b-pop-double': {
    title: 'doubling time',
    make(r) {
      const rr = choose(r, [0.02, 0.05, 0.1, 0.2, 0.35, 0.7]);
      const ans = Math.LN2 / rr;
      return { rr, q: `<p>A population grows exponentially with r = ${rr} per year. How many years does it take to double? (Doubling time = ln 2 ÷ r, with ln 2 = 0.693.)</p>`, answer: ans, unit: 'years', tol: 0.02,
        hint: 'Set N = 2N₀ in N = N₀e^(rt): then e^(rt) = 2, so rt = ln 2.',
        solution: steps('2 = e^(rt), so rt = ln 2 = 0.693.', `t = 0.693 ÷ ${rr} = <b>${n(ans)}</b> years.`) };
    },
    verify: (x) => { let c = 1, t = 0; const dt = 0.0005; while (c < 2 && t < 1e5) { c += x.rr * c * dt; t += dt; } return t; },
  },
};

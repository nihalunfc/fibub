// Class 9 Science, Chapter 11 Reproduction: How Life Continues: live problems (original fibub questions). Ids start with c9s-rep-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c9s-rep-fission': {
    title: 'cells after repeated binary fission',
    make(r) {
      const k = pick(r, 3, 9), answer = 2 ** k;
      return { k, q: `<p>One bacterium divides by binary fission. If every cell divides once in each round, how many bacteria are there after ${k} rounds of division?</p>`, answer, unit: 'cells', tol: 0, abs: 0.01,
        hint: 'Each round doubles the number: 1, 2, 4, 8, ...', solution: steps(`Each division doubles the count, so after ${k} rounds there are 2<sup>${k}</sup> cells.`, `2<sup>${k}</sup> = <b>${answer}</b>.`) };
    },
    verify: (x) => { let c = 1; for (let i = 0; i < x.k; i++) c *= 2; return c; },
  },
  'c9s-rep-gen': {
    title: 'population growth with a fixed doubling time',
    make(r) {
      const g = choose(r, [20, 30, 40]), rounds = pick(r, 3, 8), T = g * rounds, answer = 2 ** rounds;
      return { g, T, q: `<p>A bacterium divides once every ${g} minutes. Starting from one cell, how many cells are there after ${T} minutes (if none die)?</p>`, answer, unit: 'cells', tol: 0, abs: 0.01,
        hint: 'Find how many division rounds fit in the time, then double that many times.', solution: steps(`Rounds = ${T} ÷ ${g} = ${rounds}.`, `Cells = 2<sup>${rounds}</sup> = <b>${answer}</b>.`) };
    },
    verify: (x) => 2 ** (x.T / x.g),
  },
  'c9s-rep-seeds': {
    title: 'seeds from fertilised ovules',
    make(r) {
      const ov = pick(r, 10, 50, 10), pc = pick(r, 20, 90, 10), answer = ov * pc / 100;
      return { ov, pc, q: `<p>The ovary of a flower has ${ov} ovules and ${pc}% of them are fertilised. Each fertilised ovule becomes one seed. How many seeds does the fruit contain?</p>`, answer, unit: 'seeds', tol: 0, abs: 0.01,
        hint: 'Only fertilised ovules become seeds. Find the percentage of the ovules.', solution: steps(`Seeds = ${pc}% of ${ov} = ${pc} ÷ 100 × ${ov}.`, `= <b>${answer}</b> seeds.`) };
    },
    verify: (x) => (x.pc / 10) * (x.ov / 10),
  },
  'c9s-rep-survive': {
    title: 'young surviving from many eggs',
    make(r) {
      const eggs = pick(r, 1000, 5000, 500), pc = choose(r, [1, 2, 5]), answer = eggs * pc / 100;
      return { eggs, pc, q: `<p>A frog lays ${eggs} eggs in a pond and only ${pc}% of them grow into adult frogs. How many adults is that?</p>`, answer, unit: 'frogs', tol: 0.01,
        hint: 'Find the percentage of the eggs.', solution: steps(`Adults = ${pc}% of ${eggs} = ${pc} ÷ 100 × ${eggs}.`, `= <b>${n(answer, 4)}</b> frogs.`) };
    },
    verify: (x) => x.eggs / (100 / x.pc),
  },
  'c9s-rep-embryo': {
    title: 'cell number during early development',
    make(r) {
      const k = pick(r, 2, 8), answer = 2 ** k;
      return { k, q: `<p>A zygote divides and every cell keeps dividing at the same rate. How many cells does the embryo have after ${k} rounds of division?</p>`, answer, unit: 'cells', tol: 0, abs: 0.01,
        hint: 'The zygote is 1 cell. Each round makes twice as many.', solution: steps(`Start with 1 cell; each round doubles the number.`, `After ${k} rounds: 2<sup>${k}</sup> = <b>${answer}</b> cells.`) };
    },
    verify: (x) => Array.from({ length: x.k }).reduce((c) => c + c, 1),
  },
};

// Class 10 Science, Heredity: live problems (original fibub questions). Ids start with c10s-her-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c10s-her-f2': {
    title: 'tall plants in the F2 generation',
    make(r) {
      const N = pick(r, 80, 2000, 40);
      return { N, q: `<p>In a cross of two hybrid tall pea plants (Tt × Tt), ${N} seeds are grown. How many tall plants do you expect (Mendel's 3 : 1 ratio)?</p>`, answer: (N * 3) / 4, unit: 'plants', tol: 0.01,
        hint: 'Out of every 4 offspring, 3 are tall (TT, Tt, Tt) and 1 is short (tt).',
        solution: steps('The probability of a tall plant is 3 out of 4 boxes in the Punnett square.', `${N} × 3/4 = <b>${n((N * 3) / 4)}</b> tall plants (and ${n(N / 4)} short).`) };
    },
    verify: (x) => x.N - x.N / 4,
  },
  'c10s-her-testcross': {
    title: 'a test cross',
    make(r) {
      const N = pick(r, 40, 400, 20);
      return { N, q: `<p>A tall plant of genotype Tt is crossed with a short plant (tt). Out of ${N} offspring, how many are expected to be short?</p>`, answer: N / 2, unit: 'plants', tol: 0.01,
        hint: 'Write the Punnett square: the Tt parent gives T or t, the tt parent always gives t.',
        solution: steps('T with t gives Tt (tall) and t with t gives tt (short), in equal numbers: 1 tall : 1 short.', `Short plants = ${N} ÷ 2 = <b>${N / 2}</b>. This test cross shows that half short offspring means the tall parent is a hybrid, Tt; a pure TT parent would give no short offspring.`) };
    },
    verify: (x) => { let s = 0; for (const a of ['T', 't']) for (const b of ['t', 't']) if (a === 't' && b === 't') s++; return (x.N * s) / 4; },
  },
  'c10s-her-dihybrid': {
    title: 'dihybrid cross counts',
    make(r) {
      const k = pick(r, 2, 40), cls = choose(r, [['round yellow', 9], ['round green', 3], ['wrinkled yellow', 3], ['wrinkled green', 1]]), N = 16 * k;
      return { N, cls: cls[0], q: `<p>Pea plants heterozygous for seed shape (round R dominant) and colour (yellow Y dominant) are crossed (RrYy × RrYy). Out of ${N} seeds, how many are expected to be <b>${cls[0]}</b>?</p>`, answer: k * cls[1], unit: 'seeds', tol: 0.01,
        hint: 'The ratio of round yellow : round green : wrinkled yellow : wrinkled green is 9 : 3 : 3 : 1, out of 16 boxes.',
        solution: steps(`The 16 boxes give 9 round yellow, 3 round green, 3 wrinkled yellow and 1 wrinkled green.`, `${cls[0]} is ${cls[1]}/16 of the seeds: ${N} × ${cls[1]}/16 = <b>${k * cls[1]}</b>.`) };
    },
    verify: (x) => { const G = ['RY', 'Ry', 'rY', 'ry']; let c = 0; for (const a of G) for (const b of G) { const sh = a[0] === 'R' || b[0] === 'R' ? 'round' : 'wrinkled', co = a[1] === 'Y' || b[1] === 'Y' ? 'yellow' : 'green'; if (`${sh} ${co}` === x.cls) c++; } return (x.N / 16) * c; },
  },
  'c10s-her-girls': {
    title: 'probability of children of one sex',
    make(r) {
      const k = pick(r, 2, 5), F = Math.pow(2, k) * pick(r, 5, 50, 5);
      return { k, F, q: `<p>The chance of a girl at each birth is 1/2, independent of earlier births. Out of ${n(F)} families that each have ${k} children, how many families are expected to have <b>all girls</b>?</p>`, answer: F / Math.pow(2, k), unit: 'families', tol: 0.01,
        hint: 'Multiply the probabilities: (1/2) for each child.',
        solution: steps(`P(all ${k} girls) = (1/2)<sup>${k}</sup> = 1/${Math.pow(2, k)}.`, `Expected families = ${n(F)} ÷ ${Math.pow(2, k)} = <b>${n(F / Math.pow(2, k))}</b>.`) };
    },
    verify: (x) => { let p = 1; for (let i = 0; i < x.k; i++) p *= 0.5; return x.F * p; },
  },
  'c10s-her-gametes': {
    title: 'kinds of gametes from chromosome pairs',
    make(r) {
      const p = pick(r, 3, 10);
      return { p, q: `<p>An organism has ${p} pairs of chromosomes. Each gamete gets one chromosome from every pair, chosen at random (ignoring crossing over). How many different kinds of gametes can it make?</p>`, answer: Math.pow(2, p), unit: 'kinds', tol: 0.01,
        hint: 'Each pair gives a choice of 2, and the choices multiply.',
        solution: steps(`Each of the ${p} pairs can give either of 2 chromosomes.`, `2<sup>${p}</sup> = <b>${n(Math.pow(2, p))}</b> kinds of gametes. (Humans have 23 pairs: 2²³ = 8,388,608.)`) };
    },
    verify: (x) => { let c = 1; for (let i = 0; i < x.p; i++) c = c + c; return c; },
  },
};

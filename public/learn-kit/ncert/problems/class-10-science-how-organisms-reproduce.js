// Class 10 Science, How do Organisms Reproduce?: live problems (original fibub questions). Ids start with c10s-repr-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c10s-repr-fission': {
    title: 'bacteria dividing by binary fission',
    make(r) {
      const T = choose(r, [20, 30, 40, 60]), H = choose(r, [2, 3, 4, 5]), k = (H * 60) / T;
      return { T, H, k, q: `<p>A bacterium divides by binary fission once every ${T} minutes and every daughter keeps dividing at the same rate. Starting from one bacterium, how many bacteria are there after ${H} hours?</p>`, answer: Math.pow(2, k), unit: 'bacteria', tol: 0.01,
        hint: 'Each division doubles the number. Count how many divisions fit in the time.',
        solution: steps(`Number of divisions = ${H} × 60 ÷ ${T} = ${k}.`, `Each division doubles the count, so after ${k} divisions: 2<sup>${k}</sup> = <b>${n(Math.pow(2, k))}</b> bacteria.`) };
    },
    verify: (x) => { let c = 1; for (let m = x.T; m <= x.H * 60; m += x.T) c *= 2; return c; },
  },
  'c10s-repr-divisions': {
    title: 'how many divisions',
    make(r) {
      const d = pick(r, 4, 12), N = Math.pow(2, d);
      return { d, N, q: `<p>One cell divides by binary fission, and all its descendants keep dividing together, until there are ${n(N)} cells. How many rounds of division were needed?</p>`, answer: d, unit: 'divisions', tol: 0,
        hint: 'After d rounds there are 2<sup>d</sup> cells. Find d so that 2<sup>d</sup> equals the number you were given.',
        solution: steps(`${n(N)} = 2<sup>d</sup>.`, `Halve repeatedly: ${n(N)} → ... → 1 takes <b>${d}</b> halvings, so d = ${d}.`) };
    },
    verify: (x) => { let c = 1, k = 0; while (c < x.N) { c *= 2; k++; } return k; },
  },
  'c10s-repr-planaria': {
    title: 'regeneration: worms from cutting',
    make(r) {
      const k = pick(r, 2, 4), w = pick(r, 2, 5);
      return { k, w, q: `<p>In a lab, every planarian worm is cut into ${k} pieces once a week, and every piece regrows into a complete worm within the week. Starting with one worm, how many worms are there after ${w} weeks of cutting?</p>`, answer: Math.pow(k, w), unit: 'worms', tol: 0.01,
        hint: 'Each week the number of worms is multiplied by the number of pieces.',
        solution: steps(`Each cutting multiplies the number of worms by ${k}.`, `After ${w} weeks: ${k}<sup>${w}</sup> = <b>${n(Math.pow(k, w))}</b> worms, all clones of the first.`) };
    },
    verify: (x) => { let c = 1; for (let i = 0; i < x.w; i++) c = c * x.k; return c; },
  },
  'c10s-repr-chromo': {
    title: 'chromosome number in gametes',
    make(r) {
      const sp = choose(r, [['a human', 46], ['a pea plant', 14], ['a fruit fly', 8], ['a cat', 38], ['a dog', 78], ['a mosquito', 6]]);
      return { body: sp[1], q: `<p>A body cell of ${sp[0]} has ${sp[1]} chromosomes. How many chromosomes does one egg cell (or one sperm or pollen gamete) of this species carry, so that the zygote has the normal number again?</p>`, answer: sp[1] / 2, unit: 'chromosomes', tol: 0,
        hint: 'Two gametes fuse to give the zygote, and the zygote must have the same number as a body cell.',
        solution: steps(`Zygote = egg + sperm = ${sp[1]} chromosomes.`, `Each gamete carries half: ${sp[1]} ÷ 2 = <b>${sp[1] / 2}</b>. Gametes are made by a special division that halves the number.`) };
    },
    verify: (x) => { let g = 0; while (g + g < x.body) g++; return g; },
  },
  'c10s-repr-ovulation': {
    title: 'the day of ovulation',
    make(r) {
      const C = pick(r, 26, 34);
      return { C, q: `<p>Ovulation usually happens about 14 days before the end of the cycle (the last day of the cycle is the day before the next period starts). A girl has a regular cycle of ${C} days, counting the first day of her period as day 1. On which day of the cycle is the egg usually released?</p>`, answer: C - 14, unit: 'day', tol: 0,
        hint: 'The last day of the cycle is day C. Count back 14 days from it.',
        solution: steps(`The cycle ends on day ${C}.`, `Ovulation is about 14 days before that: ${C} − 14 = <b>day ${C - 14}</b>. (A 28-day cycle gives day 14, as in the figure. Real cycles vary by a few days.)`) };
    },
    verify: (x) => (x.C + 1) - 15,
  },
  'c10s-repr-pollen': {
    title: 'pollen grains needed to fill an ovary',
    make(r) {
      const p = choose(r, [0.25, 0.4, 0.5, 0.8]), N = choose(r, [4, 8, 12, 20, 40]), nn = N * 5;
      return { p, nn, q: `<p>An ovary has ${nn} ovules (a pod with ${nn} seeds). Each ovule is fertilised by exactly one pollen tube. Only ${Math.round(p * 100)}% of the pollen grains that land on the stigma germinate. How many pollen grains must land to fertilise every ovule?</p>`, answer: nn / p, unit: 'grains', tol: 0.01,
        hint: 'Grains that germinate = fraction × grains landed. This must equal the number of ovules.',
        solution: steps(`p × grains = ${nn}, with p = ${p}.`, `grains = ${nn} ÷ ${p} = <b>${n(nn / p)}</b>.`) };
    },
    verify: (x) => { let g = x.nn; while (g * x.p < x.nn - 1e-9) g++; return g; },
  },
};

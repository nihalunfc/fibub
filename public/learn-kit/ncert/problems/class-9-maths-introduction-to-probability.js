// Class 9 Maths, The Mathematics of Maybe: Introduction to Probability: live problems (original fibub questions).
// Ids start with c9m-prob-. Probabilities are asked as decimals so the answer box takes one number.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c9m-prob-die': {
    title: 'probability on one die',
    make(r) {
      const kind = choose(r, ['gt', 'mult', 'lt']), k = kind === 'gt' ? pick(r, 1, 5) : kind === 'lt' ? pick(r, 2, 6) : pick(r, 2, 3);
      const fav = kind === 'gt' ? 6 - k : kind === 'lt' ? k - 1 : Math.floor(6 / k), words = kind === 'gt' ? `a number greater than ${k}` : kind === 'lt' ? `a number less than ${k}` : `a multiple of ${k}`;
      return { kind, k, q: `<p>A fair die is rolled once. Find the probability of getting <b>${words}</b>. Give your answer as a decimal.</p>`, answer: fav / 6, unit: '', tol: 0.005, abs: 0.002,
        hint: 'List the favourable outcomes among 1 to 6, then divide their number by 6.',
        solution: steps(`All outcomes: 1, 2, 3, 4, 5, 6 (6 equally likely).`, `Favourable outcomes: ${fav}.`, `P = ${fav}/6 = <b>${n(fav / 6, 4)}</b>.`) };
    },
    verify(x) { let c = 0; for (let v = 1; v <= 6; v++) if (x.kind === 'gt' ? v > x.k : x.kind === 'lt' ? v < x.k : v % x.k === 0) c++; return c / 6; },
  },
  'c9m-prob-bag': {
    title: 'probability of not drawing a colour',
    make(r) {
      const a = pick(r, 2, 12), b = pick(r, 2, 12), c = pick(r, 2, 12), T = a + b + c;
      return { a, b, c, q: `<p>A bag holds <b>${a} orange</b>, <b>${b} green</b> and <b>${c} blue</b> marbles. One marble is drawn without looking. Find the probability that it is <b>not orange</b>. Give a decimal.</p>`, answer: (b + c) / T, unit: '', tol: 0.005, abs: 0.002,
        hint: 'Not orange means green or blue. Or work out P(orange) and subtract from 1.',
        solution: steps(`Total marbles = ${a} + ${b} + ${c} = ${T}.`, `Not orange = ${b} + ${c} = ${b + c} marbles.`, `P = ${b + c}/${T} = <b>${n((b + c) / T, 4)}</b>.`) };
    },
    verify(x) { return 1 - x.a / (x.a + x.b + x.c); },
  },
  'c9m-prob-freq': {
    title: 'experimental probability from a table',
    make(r) {
      const f = [pick(r, 5, 30), pick(r, 5, 30), pick(r, 5, 30), pick(r, 5, 30)], N = f.reduce((s, v) => s + v, 0), i = pick(r, 0, 3), j = (i + pick(r, 1, 3)) % 4, nm = ['Sunny', 'Cloudy', 'Rainy', 'Foggy'];
      return { f, i, j, q: `<p>Over ${N} days in a hill town the weather was: Sunny ${f[0]} days, Cloudy ${f[1]} days, Rainy ${f[2]} days, Foggy ${f[3]} days. Find the experimental probability that a day is <b>${nm[i]} or ${nm[j]}</b>. Give a decimal.</p>`, answer: (f[i] + f[j]) / N, unit: '', tol: 0.005, abs: 0.002,
        hint: 'Add the two frequencies and divide by the total number of days.',
        solution: steps(`Total days = ${N}.`, `${nm[i]} + ${nm[j]} = ${f[i]} + ${f[j]} = ${f[i] + f[j]} days.`, `P = ${f[i] + f[j]}/${N} = <b>${n((f[i] + f[j]) / N, 4)}</b>.`) };
    },
    verify(x) { const N = x.f.reduce((s, v) => s + v, 0), others = x.f.reduce((s, v, k) => (k !== x.i && k !== x.j ? s + v : s), 0); return 1 - others / N; },
  },
  'c9m-prob-cards': {
    title: 'probability with a pack of cards',
    make(r) {
      const E = choose(r, [['a king', 'rank', 12], ['a heart', 'suit', 0], ['a red card', 'red', 0], ['a face card (jack, queen or king)', 'face', 0], ['the ace of spades', 'one', 0], ['a red king', 'redking', 0]]);
      const cnt = { rank: 4, suit: 13, red: 26, face: 12, one: 1, redking: 2 }[E[1]];
      return { key: E[1], q: `<p>One card is drawn from a well-shuffled pack of 52 cards. Find the probability of drawing <b>${E[0]}</b>. Give a decimal.</p>`, answer: cnt / 52, unit: '', tol: 0.005, abs: 0.002,
        hint: 'A pack has 4 suits of 13 cards: 2 red suits (hearts, diamonds) and 2 black suits. Count the favourable cards.',
        solution: steps('There are 52 equally likely cards.', `Favourable cards: ${cnt}.`, `P = ${cnt}/52 = <b>${n(cnt / 52, 4)}</b>.`) };
    },
    verify(x) { let c = 0; for (let s = 0; s < 4; s++) for (let k = 1; k <= 13; k++) { const red = s < 2; if (x.key === 'rank' ? k === 13 : x.key === 'suit' ? s === 0 : x.key === 'red' ? red : x.key === 'face' ? k >= 11 : x.key === 'one' ? s === 3 && k === 1 : red && k === 13) c++; } return c / 52; },
  },
  'c9m-prob-twodice': {
    title: 'probability of a sum with two dice',
    make(r) {
      const s = pick(r, 2, 12), fav = 6 - Math.abs(s - 7);
      return { s, q: `<p>Two fair dice are rolled together. Find the probability that the <b>sum of the two numbers is ${s}</b>. Give a decimal.</p>`, answer: fav / 36, unit: '', tol: 0.005, abs: 0.002,
        hint: 'There are 36 equally likely pairs. List the pairs that add up to the sum.',
        solution: steps('The sample space has 6 × 6 = 36 pairs.', `Pairs with sum ${s}: ${fav}.`, `P = ${fav}/36 = <b>${n(fav / 36, 4)}</b>.`) };
    },
    verify(x) { let c = 0; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (a + b === x.s) c++; return c / 36; },
  },
  'c9m-prob-expect': {
    title: 'predicting from experimental probability',
    make(r) {
      const N = pick(r, 20, 100, 10), h = pick(r, 4, N / 2, 2), M = pick(r, 200, 1000, 100);
      return { N, h, M, q: `<p>A bowler took a wicket with <b>${h}</b> of the <b>${N}</b> deliveries in a practice session. Using this experimental probability, about how many wickets would you expect in <b>${M}</b> deliveries?</p>`, answer: (M * h) / N, unit: 'wickets', tol: 0.005,
        hint: 'Experimental probability = h/N. Expected number = probability × number of trials.',
        solution: steps(`Experimental probability = ${h}/${N} = ${n(h / N, 4)}.`, `Expected wickets = ${n(h / N, 4)} × ${M}.`, `About <b>${n((M * h) / N, 5)}</b> wickets.`) };
    },
    verify(x) { return x.M / (x.N / x.h); },
  },
  'c9m-prob-rain': {
    title: 'probability of the opposite event',
    make(r) {
      const p = pick(r, 5, 95, 5);
      return { p, q: `<p>The weather office says the probability of rain tomorrow is <b>${p / 100}</b>. What is the probability that it does <b>not</b> rain? Give a decimal.</p>`, answer: 1 - p / 100, unit: '', tol: 0.005, abs: 0.002,
        hint: 'Rain and no rain are the only two outcomes, so their probabilities add up to 1.',
        solution: steps('P(rain) + P(no rain) = 1.', `P(no rain) = 1 − ${p / 100}.`, `P(no rain) = <b>${n(1 - p / 100, 3)}</b>.`) };
    },
    verify(x) { return (100 - x.p) / 100; },
  },
};

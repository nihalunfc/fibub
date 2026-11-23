// Class 11 Maths, Probability: live problems (original fibub questions). Ids start with c11m-prob-.
import { pick, choose, n, steps } from './_util.js';

const CARDS = [
  { t: 'a king or a heart', n1: 4, n2: 13, o: 1, f: (rk, s) => rk === 12 || s === 0 },
  { t: 'an ace or a black card', n1: 4, n2: 26, o: 2, f: (rk, s) => rk === 0 || s >= 2 },
  { t: 'a face card (J, Q, K) or a spade', n1: 12, n2: 13, o: 3, f: (rk, s) => rk >= 10 || s === 3 },
  { t: 'a queen or a red card', n1: 4, n2: 26, o: 2, f: (rk, s) => rk === 11 || s < 2 },
  { t: 'a number 2 to 5 or a club', n1: 16, n2: 13, o: 4, f: (rk, s) => (rk >= 1 && rk <= 4) || s === 2 },
];
export default {
  'c11m-prob-dice': {
    title: 'a sum of two dice',
    make(r) {
      const s = pick(r, 3, 11), ways = (t) => (t <= 7 ? t - 1 : 13 - t), atLeast = [...Array(11)].map((_, i) => i + 2).filter((t) => t >= s).reduce((a, t) => a + ways(t), 0);
      return { s, q: `<p>Two fair dice are thrown. Find the probability that the sum is at least ${s} (a decimal to 3 places).</p>`, answer: atLeast / 36, unit: '', tol: 0.01,
        hint: 'Count the outcomes (a, b) out of 36 with a + b ≥ ' + s + '. A sum t can happen in t − 1 ways up to 7 and 13 − t ways after that.',
        solution: steps(`Ways for each sum from ${s} to 12: ${[...Array(13 - s)].map((_, i) => ways(s + i)).join(' + ')} = ${atLeast}.`, `P = ${atLeast}/36 = <b>${n(atLeast / 36, 4)}</b>.`) };
    },
    // complement: 1 - P(sum <= s - 1), counted by listing every pair
    verify: (p) => { let low = 0; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (a + b < p.s) low++; return 1 - low / 36; },
  },
  'c11m-prob-cards': {
    title: 'addition rule with a pack of cards',
    make(r) {
      const i = pick(r, 0, CARDS.length - 1), c = CARDS[i];
      return { i, q: `<p>One card is drawn from a well-shuffled pack of 52. Find the probability of getting ${c.t} (a decimal to 3 places).</p>`, answer: (c.n1 + c.n2 - c.o) / 52, unit: '', tol: 0.01,
        hint: 'P(A ∪ B) = P(A) + P(B) − P(A ∩ B). Subtract the cards that are in both.',
        solution: steps(`P(A) = ${c.n1}/52, P(B) = ${c.n2}/52, P(A and B) = ${c.o}/52.`, `P = (${c.n1} + ${c.n2} − ${c.o})/52 = ${c.n1 + c.n2 - c.o}/52 = <b>${n((c.n1 + c.n2 - c.o) / 52, 4)}</b>.`) };
    },
    // build the whole pack and count
    verify: (p) => { let k = 0; for (let rk = 0; rk < 13; rk++) for (let s = 0; s < 4; s++) if (CARDS[p.i].f(rk, s)) k++; return k / 52; },
  },
  'c11m-prob-atleast': {
    title: 'at least one head',
    make(r) {
      const k = pick(r, 2, 8);
      return { k, q: `<p>A fair coin is tossed ${k} times. Find the probability of getting at least one head (a decimal to 4 places).</p>`, answer: 1 - 1 / 2 ** k, unit: '', tol: 0.001,
        hint: 'Use the complement: the only outcome with no head is all tails.',
        solution: steps(`The sample space has 2^${k} = ${2 ** k} equally likely outcomes.`, `P(no head) = 1/${2 ** k}.`, `P(at least one head) = 1 − 1/${2 ** k} = <b>${n(1 - 1 / 2 ** k, 5)}</b>.`) };
    },
    // count the sequences that contain at least one head
    verify: (p) => { let c = 0; for (let b = 0; b < 2 ** p.k; b++) if (b !== 0) c++; return c / 2 ** p.k; },
  },
  'c11m-prob-bag': {
    title: 'a bag of coloured balls',
    make(r) {
      const R = pick(r, 2, 9), B = pick(r, 2, 9), G = pick(r, 1, 9), N = R + B + G;
      return { R, B, G, q: `<p>A bag has ${R} red, ${B} blue and ${G} green balls. One ball is drawn at random. Find the probability that it is red or blue (a decimal to 3 places).</p>`, answer: (R + B) / N, unit: '', tol: 0.01,
        hint: 'Red and blue cannot both happen, so the events are mutually exclusive: add the probabilities.',
        solution: steps(`P(red) = ${R}/${N}, P(blue) = ${B}/${N}.`, `P(red or blue) = ${R + B}/${N} = <b>${n((R + B) / N, 4)}</b>.`) };
    },
    // complement: not green
    verify: (p) => 1 - p.G / (p.R + p.B + p.G),
  },
  'c11m-prob-neither': {
    title: 'neither event happens',
    make(r) {
      const a = pick(r, 20, 60, 5) / 100, b = pick(r, 20, 60, 5) / 100, c = pick(r, 5, Math.min(a, b) * 100 - 5, 5) / 100;
      return { a, b, c, q: `<p>For events A and B, P(A) = ${a}, P(B) = ${b} and P(A and B) = ${c}. Find the probability that neither A nor B happens (a decimal to 2 places).</p>`, answer: 1 - (a + b - c), unit: '', tol: 0.01, abs: 0.001,
        hint: 'P(neither) = 1 − P(A ∪ B), and P(A ∪ B) = P(A) + P(B) − P(A ∩ B).',
        solution: steps(`P(A ∪ B) = ${a} + ${b} − ${c} = ${n(a + b - c, 4)}.`, `P(neither) = 1 − ${n(a + b - c, 4)} = <b>${n(1 - (a + b - c), 4)}</b>.`) };
    },
    // split the plane into A only, B only, both and the rest
    verify: (p) => 1 - ((p.a - p.c) + (p.b - p.c) + p.c),
  },
  'c11m-prob-space': {
    title: 'size of a sample space',
    make(r) {
      const k = pick(r, 1, 5), d = pick(r, 1, 3);
      return { k, d, q: `<p>${k} coin${k > 1 ? 's' : ''} and ${d} ${d > 1 ? 'dice' : 'die'} are thrown together. How many outcomes does the sample space have?</p>`, answer: 2 ** k * 6 ** d, unit: '', tol: 0,
        hint: 'Each coin has 2 faces and each die has 6; independent choices multiply.',
        solution: steps(`Coins: 2^${k} = ${2 ** k}. Dice: 6^${d} = ${6 ** d}.`, `Total = ${2 ** k} × ${6 ** d} = <b>${2 ** k * 6 ** d}</b>.`) };
    },
    // build the list of outcomes by nested loops
    verify: (p) => { let c = 0; for (let a = 0; a < 2 ** p.k; a++) for (let b = 0; b < 6 ** p.d; b++) c++; return c; },
  },
};

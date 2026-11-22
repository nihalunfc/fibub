// Class 10 Maths, Probability: live problems (original fibub questions). Ids start with c10m-prob-.
import { pick, choose, n, steps } from './_util.js';

const D3 = (v) => (+v).toFixed(3);

export default {
  'c10m-prob-bag': {
    title: 'a marble from a bag',
    make(r) {
      const red = pick(r, 2, 9), blue = pick(r, 2, 9), green = pick(r, 1, 8), N = red + blue + green, which = choose(r, ['red', 'blue', 'green']), k = { red, blue, green }[which];
      return { red, blue, green, which, q: `<p>A bag holds ${red} red, ${blue} blue and ${green} green marbles. One marble is picked at random. Find the probability that it is ${which}, as a decimal correct to 3 places.</p>`, answer: k / N, unit: '', tol: 0.004, abs: 0.0006,
        hint: 'Probability = number of favourable outcomes ÷ total number of outcomes.',
        solution: steps(`Total marbles = ${red} + ${blue} + ${green} = ${N}.`, `Favourable (${which}) = ${k}.`, `P(${which}) = ${k}/${N} = <b>${D3(k / N)}</b>.`) };
    },
    verify: (p) => 1 - (p.red + p.blue + p.green - { red: p.red, blue: p.blue, green: p.green }[p.which]) / (p.red + p.blue + p.green),
  },
  'c10m-prob-dice': {
    title: 'the sum of two dice',
    make(r) {
      const s = pick(r, 2, 12); let k = 0; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (a + b === s) k++;
      return { s, q: `<p>Two fair dice are thrown together. Find the probability that the sum of the numbers is ${s}, as a decimal correct to 3 places.</p>`, answer: k / 36, unit: '', tol: 0.004, abs: 0.0006,
        hint: 'List the pairs (a, b) with a + b equal to the sum. There are 36 equally likely pairs.',
        solution: steps(`The sample space has 6 × 6 = 36 equally likely outcomes.`, `Pairs with sum ${s}: ${k} of them.`, `P = ${k}/36 = <b>${D3(k / 36)}</b>.`) };
    },
    verify: (p) => (6 - Math.abs(p.s - 7)) / 36,
  },
  'c10m-prob-comp': {
    title: 'use the complement',
    make(r) {
      const N = pick(r, 20, 80, 5), d = pick(r, 2, 9), ev = choose(r, ['bulb', 'pen', 'phone cover']);
      return { N, d, q: `<p>A box has ${N} ${ev}s and ${d} of them are faulty. One is taken out at random. Find the probability that it is <b>not</b> faulty, as a decimal correct to 3 places.</p>`, answer: (N - d) / N, unit: '', tol: 0.004, abs: 0.0006,
        hint: 'P(not faulty) = 1 − P(faulty).',
        solution: steps(`P(faulty) = ${d}/${N} = ${D3(d / N)}.`, `P(not faulty) = 1 − ${D3(d / N)}.`, `= <b>${D3((N - d) / N)}</b>.`) };
    },
    verify: (p) => 1 - p.d / p.N,
  },
  'c10m-prob-cards': {
    title: 'a card from a deck',
    make(r) {
      const opts = [['a king or a queen', 8], ['a red face card (jack, queen or king)', 6], ['a black card that is not a face card', 20], ['a card with a number from 2 to 10', 36], ['a heart or an ace', 16]], [nm, k] = choose(r, opts);
      return { nm, q: `<p>A card is drawn at random from a well-shuffled pack of 52 cards. Find the probability that it is ${nm}, as a decimal correct to 3 places.</p>`, answer: k / 52, unit: '', tol: 0.004, abs: 0.0006,
        hint: 'Count the favourable cards using 4 suits of 13 ranks (A, 2 to 10, J, Q, K). Then divide by 52.',
        solution: steps('A pack has 52 cards: 26 red and 26 black, 12 face cards, 4 aces and 4 kings.', `Favourable cards: ${k}.`, `P = ${k}/52 = <b>${D3(k / 52)}</b>.`) };
    },
    verify(p) { // count by looking at every card
      let k = 0; for (let s = 0; s < 4; s++) for (let rk = 1; rk <= 13; rk++) { const red = s === 1 || s === 2, face = rk >= 11, ok = { 'a king or a queen': rk === 13 || rk === 12, 'a red face card (jack, queen or king)': red && face, 'a black card that is not a face card': !red && !face, 'a card with a number from 2 to 10': rk >= 2 && rk <= 10, 'a heart or an ace': s === 1 || rk === 1 }[p.nm]; if (ok) k++; }
      return k / 52;
    },
  },
  'c10m-prob-unknown': {
    title: 'find the number of marbles',
    make(r) {
      const red = pick(r, 3, 10), mult = pick(r, 2, 6), blue = red * (mult - 1), pr = 1 / mult;
      return { red, mult, blue, q: `<p>A bag has ${red} red marbles and some blue marbles. The probability of picking a red marble is 1/${mult}. How many blue marbles are there?</p>`, answer: blue, unit: '', tol: 0.001, abs: 0.001,
        hint: 'Let the number of blue marbles be b. Then red ÷ total = 1/' + mult + ', where total = red + b.',
        solution: steps(`Let there be b blue marbles. P(red) = ${red}/(${red} + b) = 1/${mult}.`, `So ${red + ' × ' + mult} = ${red} + b, i.e. ${red * mult} = ${red} + b.`, `b = <b>${blue}</b>.`) };
    },
    verify: (p) => p.red / (1 / p.mult) - p.red,
  },
  'c10m-prob-spinner': {
    title: 'design a spinner',
    make(r) {
      const pr = pick(r, 5, 60, 5) / 100;
      return { pr, q: `<p>A spinner is to land on red with probability ${pr}. What angle (in degrees) must the red sector have?</p>`, answer: pr * 360, unit: '°', tol: 0.001,
        hint: 'P(red) = angle of the red sector ÷ 360°.',
        solution: steps('The whole circle is 360°, and the chance of landing in a sector is its fraction of the circle.', `Angle = ${pr} × 360°.`, `= <b>${n(pr * 360)}°</b>.`) };
    },
    verify: (p) => (p.pr * 100 * 3.6),
  },
  'c10m-prob-coins': {
    title: 'three coins',
    make(r) {
      const k = pick(r, 1, 3); let fav = 0; for (let m = 0; m < 8; m++) { const h = (m & 1) + ((m >> 1) & 1) + ((m >> 2) & 1); if (h >= k) fav++; }
      return { k, q: `<p>Three fair coins are tossed together. Find the probability of getting at least ${k} head${k > 1 ? 's' : ''}, as a decimal.</p>`, answer: fav / 8, unit: '', tol: 0.004, abs: 0.0006,
        hint: 'List the 8 outcomes HHH, HHT, ... TTT, or use the complement: P(fewer than k heads).',
        solution: steps('The sample space has 2 × 2 × 2 = 8 equally likely outcomes.', `Outcomes with at least ${k} head${k > 1 ? 's' : ''}: ${fav}.`, `P = ${fav}/8 = <b>${n(fav / 8)}</b>.`) };
    },
    verify: (p) => { const ways = [1, 3, 3, 1]; let less = 0; for (let h = 0; h < p.k; h++) less += ways[h]; return 1 - less / 8; },
  },
};

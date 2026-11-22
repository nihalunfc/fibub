// Class 10 Maths, Chapter 14 Probability: practice questions for the NCERT study course (original fibub questions).
import { maker } from './_make.js';
import { pick, choose } from '../_util.js';
const m = maker('pb');
const R = String.raw;
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const frac = (k, t) => { const g = gcd(k, t); return k === 0 ? '0' : `${k / g}/${t / g}`; };

export default {
  topic: 'probability', name: 'Probability', n: 14,
  items: [
    m.mcq(1, 'basic', R`<p>A fair die is thrown once. The probability of getting an even number is:</p>`, R`$\dfrac12$`, [R`$\dfrac13$`, R`$\dfrac16$`, R`$\dfrac23$`], R`<p>The even numbers are 2, 4, 6: $\dfrac36 = \dfrac12$.</p>`),
    m.mcq(1, 'basic', R`<p>The probability of an impossible event is:</p>`, R`0`, [R`1`, R`$\dfrac12$`, R`$-1$`], R`<p>An impossible event has no favourable outcomes, so $P = 0$.</p>`),
    m.mcq(1, 'basic', R`<p>Which cannot be the probability of an event?</p>`, R`$1.5$`, [R`$0.7$`, R`$\dfrac{2}{3}$`, R`$0$`], R`<p>A probability is between 0 and 1, so 1.5 is impossible.</p>`),
    m.mcq(1, 'sample', R`<p>The number of possible outcomes when two coins are tossed together is:</p>`, R`4`, [R`2`, R`3`, R`6`], R`<p>$2 \times 2 = 4$: HH, HT, TH, TT.</p>`, { trap: 'Writing 3 by treating HT and TH as the same.' }),
    m.mcq(1, 'complement', R`<p>If $P(E) = 0.62$, then $P(\text{not } E)$ is:</p>`, R`$0.38$`, [R`$0.62$`, R`$1.62$`, R`$0.48$`], R`<p>$1 - 0.62 = 0.38$.</p>`),
    m.mcq(2, 'bag', R`<p>A bag holds 3 red and 7 blue marbles. The probability of drawing a blue one is:</p>`, R`$\dfrac{7}{10}$`, [R`$\dfrac{3}{10}$`, R`$\dfrac{7}{3}$`, R`$\dfrac12$`], R`<p>7 favourable out of 10 equally likely marbles.</p>`, { trap: 'Using 1/2 because there are two colours.' }),
    m.mcq(2, 'cards', R`<p>A card is drawn from a pack of 52 cards. The probability that it is a black queen is:</p>`, R`$\dfrac{1}{26}$`, [R`$\dfrac{1}{13}$`, R`$\dfrac{1}{52}$`, R`$\dfrac{2}{13}$`], R`<p>Black queens: spades and clubs, 2 cards: $\dfrac{2}{52} = \dfrac1{26}$.</p>`),
    m.mcq(2, 'dice', R`<p>Two dice are thrown. The probability that the sum is 7 is:</p>`, R`$\dfrac16$`, [R`$\dfrac{1}{12}$`, R`$\dfrac{7}{36}$`, R`$\dfrac{1}{36}$`], R`<p>Sum 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1): 6 outcomes, $\dfrac{6}{36} = \dfrac16$.</p>`),
    m.mcq(2, 'coins', R`<p>Three coins are tossed. The probability of exactly one head is:</p>`, R`$\dfrac38$`, [R`$\dfrac18$`, R`$\dfrac12$`, R`$\dfrac13$`], R`<p>HTT, THT, TTH: 3 of the 8 outcomes.</p>`),
    m.mcq(2, 'spinner', R`<p>A spinner has a red sector of 90°. The probability that it lands on red is:</p>`, R`$\dfrac14$`, [R`$\dfrac13$`, R`$\dfrac{1}{90}$`, R`$\dfrac12$`], R`<p>$\dfrac{90°}{360°} = \dfrac14$.</p>`),
    m.mcq(3, 'complement', R`<p>Three coins are tossed. The probability of getting at least one tail is:</p>`, R`$\dfrac78$`, [R`$\dfrac18$`, R`$\dfrac12$`, R`$\dfrac34$`], R`<p>Only HHH has no tail, so $P = 1 - \dfrac18 = \dfrac78$.</p>`),
    m.mcq(3, 'bag', R`<p>A bag has 6 red marbles and some blue ones. The probability of red is $\dfrac13$. The number of blue marbles is:</p>`, R`12`, [R`6`, R`18`, R`9`], R`<p>$\dfrac{6}{6 + b} = \dfrac13$ gives $6 + b = 18$, so $b = 12$.</p>`),
    m.mcq(3, 'cards', R`<p>A card is drawn from a pack. The probability that it is a king or a heart is:</p>`, R`$\dfrac{4}{13}$`, [R`$\dfrac{17}{52}$`, R`$\dfrac{1}{2}$`, R`$\dfrac{5}{13}$`], R`<p>4 kings + 13 hearts − 1 king of hearts (counted twice) = 16 cards, so $\dfrac{16}{52} = \dfrac{4}{13}$.</p>`, { trap: 'Counting the king of hearts twice.' }),
    m.ar(2, 'dice', R`The probability of getting a sum of 1 with two dice is 0.`, R`The smallest sum of two dice is 2.`, 0, R`<p>Both true, and R explains why the event is impossible.</p>`),
    m.ar(2, 'basic', R`After three heads in a row, tails is more likely on the next toss of a fair coin.`, R`Each toss of a fair coin is independent of the earlier ones.`, 3, R`<p>A is false: the next toss is still 1/2 each way. R is true and shows why.</p>`),
    m.ar(2, 'complement', R`$P(E) + P(\text{not } E) = 1$ for any event $E$.`, R`$E$ and not $E$ together contain every outcome, with none in common.`, 0, R`<p>Both true and R explains A.</p>`),
    m.ar(3, 'basic', R`For a fair coin $P(\text{head}) = \tfrac12$.`, R`The sun rises in the east.`, 1, R`<p>Both statements are true but unrelated, so R does not explain A.</p>`),
    m.nat(1, 'dice', R`<p>Two dice are thrown. Find the number of outcomes in which both dice show the same number.</p>`, () => 6, 0, R`<p>(1,1), (2,2), ..., (6,6): 6 outcomes.</p>`),
    m.nat(2, 'dice', R`<p>Two dice are thrown. Find the probability that the sum is 9, as a decimal correct to 3 places.</p>`, () => 4 / 36, 0.001, R`<p>Sum 9: (3,6), (4,5), (5,4), (6,3), so $P = \dfrac{4}{36} = 0.111$.</p>`),
    m.nat(2, 'cards', R`<p>A card is drawn from a pack of 52. Find the probability of drawing a red face card, as a decimal correct to 3 places.</p>`, () => 6 / 52, 0.001, R`<p>The red face cards are J, Q, K of hearts and of diamonds: 6. $\dfrac{6}{52} = 0.115$.</p>`),
    m.nat(2, 'bag', R`<p>A bag has 5 red, 8 blue and 7 green marbles. Find the probability that a marble drawn is <b>not</b> blue, as a decimal.</p>`, () => 12 / 20, 0.001, R`<p>Total 20. Not blue = 5 + 7 = 12. $P = \dfrac{12}{20} = 0.6$.</p>`),
    m.nat(3, 'bag', R`<p>A bag has 4 red marbles and some blue marbles. The probability of red is $\dfrac15$. How many blue marbles are there?</p>`, () => 16, 0, R`<p>$\dfrac{4}{4 + b} = \dfrac15$ gives $4 + b = 20$, so $b = 16$.</p>`),
    m.nat(3, 'spinner', R`<p>A spinner is to land on green with probability 0.35. What angle in degrees must the green sector have?</p>`, () => 0.35 * 360, 0, R`<p>Angle $= 0.35 \times 360° = 126°$.</p>`, { unit: '°' }),
    m.msq(2, 'basic', R`<p>Which of these are possible values of a probability? (Choose all that apply.)</p>`, [R`$0$`, R`$\dfrac{3}{7}$`, R`$1.2$`, R`$1$`], [0, 1, 3], R`<p>A probability lies from 0 to 1 inclusive, so 1.2 is not possible.</p>`),
    m.msq(2, 'dice', R`<p>A die is thrown once. Which events have probability $\dfrac12$? (Choose all that apply.)</p>`, [R`an even number`, R`a number greater than 3`, R`a prime number`, R`a number less than 2`], [0, 1, 2], R`<p>Even: {2,4,6}; greater than 3: {4,5,6}; prime: {2,3,5}; each has 3 of 6 outcomes. Less than 2 is just {1}: 1/6.</p>`),
  ],
  gens: [
    { id: 'pb-g01', type: 'nat', level: 1, exams: ['board'], sub: 'bag',
      make(rng) { const a = pick(rng, 2, 9), b = pick(rng, 2, 9), c = pick(rng, 1, 8), col = choose(rng, ['red', 'blue', 'green']), k = { red: a, blue: b, green: c }[col]; return { a, b, c, col, q: `<p>A bag has ${a} red, ${b} blue and ${c} green marbles. Find the probability of drawing a ${col} marble, as a decimal correct to 3 places.</p>`, answer: k / (a + b + c), tol: 0.001, sol: `<p>Total ${a + b + c}; favourable ${k}. $P = \\dfrac{${k}}{${a + b + c}} = ${(k / (a + b + c)).toFixed(3)}$.</p>` }; },
      verify: (p) => 1 - (p.a + p.b + p.c - { red: p.a, blue: p.b, green: p.c }[p.col]) / (p.a + p.b + p.c) },
    { id: 'pb-g02', type: 'nat', level: 2, exams: ['board'], sub: 'dice',
      make(rng) { const s = pick(rng, 2, 12); let k = 0; for (let x = 1; x <= 6; x++) for (let y = 1; y <= 6; y++) if (x + y === s) k++; return { s, q: `<p>Two dice are thrown. Find the probability that the sum is ${s}, as a decimal correct to 3 places.</p>`, answer: k / 36, tol: 0.001, sol: `<p>There are ${k} pairs with sum ${s} out of 36, so $P = \\dfrac{${k}}{36} = ${(k / 36).toFixed(3)}$.</p>` }; },
      verify: (p) => (6 - Math.abs(p.s - 7)) / 36 },
    { id: 'pb-g03', type: 'nat', level: 2, exams: ['board'], sub: 'complement',
      make(rng) { const N = pick(rng, 20, 100, 5), d = pick(rng, 2, 12); return { N, d, q: `<p>The probability that a bulb from a batch of ${N} is faulty is ${d}/${N}. Find the probability that a bulb picked at random is <b>not</b> faulty, as a decimal.</p>`, answer: (N - d) / N, tol: 0.001, sol: `<p>$P(\\text{not faulty}) = 1 - \\dfrac{${d}}{${N}} = \\dfrac{${N - d}}{${N}} = ${((N - d) / N).toFixed(3)}$.</p>` }; },
      verify: (p) => (p.N - p.d) / p.N },
    { id: 'pb-g04', type: 'nat', level: 2, exams: ['board'], sub: 'basic',
      make(rng) { const N = pick(rng, 20, 100, 5), k = pick(rng, 2, 9); const mult = Math.floor(N / k); return { N, k, q: `<p>A ticket is drawn from tickets numbered 1 to ${N}. Find the probability that the number is a multiple of ${k}, as a decimal correct to 3 places.</p>`, answer: mult / N, tol: 0.001, sol: `<p>Multiples of ${k} up to ${N}: ${mult}. $P = \\dfrac{${mult}}{${N}} = ${(mult / N).toFixed(3)}$.</p>` }; },
      verify: (p) => { let c = 0; for (let i = p.k; i <= p.N; i += p.k) c++; return c / p.N; } },
    { id: 'pb-g05', type: 'nat', level: 3, exams: ['board'], sub: 'bag',
      make(rng) { const red = pick(rng, 3, 10), t = pick(rng, 2, 6), blue = red * (t - 1); return { red, t, q: `<p>A bag has ${red} red marbles and some blue marbles. The probability of drawing a red marble is 1/${t}. How many blue marbles are there?</p>`, answer: blue, tol: 0, sol: `<p>$\\dfrac{${red}}{${red} + b} = \\dfrac1{${t}}$ gives $${red + ' + b = ' + red * t}$, so $b = ${blue}$.</p>` }; },
      verify: (p) => p.red * p.t - p.red },
    { id: 'pb-g06', type: 'nat', level: 2, exams: ['board'], sub: 'spinner',
      make(rng) { const pr = pick(rng, 5, 60, 5); return { pr, q: `<p>A spinner lands on red with probability ${pr / 100}. What angle in degrees must the red sector have?</p>`, answer: pr * 3.6, tol: 0.001, unit: '°', sol: `<p>Angle $= ${pr / 100} \\times 360° = ${pr * 3.6}°$.</p>` }; },
      verify: (p) => (p.pr / 100) * 360 },
    { id: 'pb-g07', type: 'nat', level: 3, exams: ['board'], sub: 'coins',
      make(rng) { const k = pick(rng, 1, 3); let fav = 0; for (let b = 0; b < 8; b++) { const h = (b & 1) + ((b >> 1) & 1) + ((b >> 2) & 1); if (h >= k) fav++; } return { k, q: `<p>Three coins are tossed. Find the probability of at least ${k} head${k > 1 ? 's' : ''}, as a decimal.</p>`, answer: fav / 8, tol: 0.001, sol: `<p>Of the 8 outcomes, ${fav} have at least ${k} head${k > 1 ? 's' : ''}: $P = \\dfrac{${fav}}{8} = ${fav / 8}$.</p>` }; },
      verify: (p) => { const w = [1, 3, 3, 1]; let less = 0; for (let h = 0; h < p.k; h++) less += w[h]; return 1 - less / 8; } },
    { id: 'pb-g08', type: 'nat', level: 2, exams: ['board'], sub: 'cards',
      make(rng) { const opts = [['a king or a queen', 8], ['a red face card', 6], ['a black card that is not a face card', 20], ['a card numbered 2 to 10', 36], ['a heart or an ace', 16]], [nm, k] = choose(rng, opts); return { nm, q: `<p>A card is drawn from a pack of 52. Find the probability that it is ${nm}, as a decimal correct to 3 places.</p>`, answer: k / 52, tol: 0.001, sol: `<p>There are ${k} favourable cards out of 52: $P = \\dfrac{${k}}{52} = ${(k / 52).toFixed(3)}$.</p>` }; },
      verify(p) { let c = 0; for (let s = 0; s < 4; s++) for (let r = 1; r <= 13; r++) { const red = s === 1 || s === 2, ok = { 'a king or a queen': r >= 12, 'a red face card': red && r >= 11, 'a black card that is not a face card': !red && r < 11, 'a card numbered 2 to 10': r >= 2 && r <= 10, 'a heart or an ace': s === 1 || r === 1 }[p.nm]; if (ok) c++; } return c / 52; } },
  ],
};

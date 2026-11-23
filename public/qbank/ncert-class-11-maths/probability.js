// Class 11 Maths, Chapter 14 Probability: practice questions for the NCERT study course (original fibub questions).
import { maker } from './_make.js';
import { pick } from '../_util.js';
const m = maker('pb');
const R = String.raw;
const CARDS = [
  { t: 'a king or a heart', n1: 4, n2: 13, o: 1, f: (rk, s) => rk === 12 || s === 0 },
  { t: 'an ace or a black card', n1: 4, n2: 26, o: 2, f: (rk, s) => rk === 0 || s >= 2 },
  { t: 'a face card (J, Q, K) or a spade', n1: 12, n2: 13, o: 3, f: (rk, s) => rk >= 10 || s === 3 },
  { t: 'a queen or a red card', n1: 4, n2: 26, o: 2, f: (rk, s) => rk === 11 || s < 2 },
];
const ways = (t) => (t <= 7 ? t - 1 : 13 - t);

export default {
  topic: 'probability', name: 'Probability', n: 14,
  items: [
    m.mcq(1, 'space', R`<p>A coin is tossed twice. The sample space is:</p>`, R`$\{HH, HT, TH, TT\}$`, [R`$\{HH, HT, TT\}$`, R`$\{H, T\}$`, R`$\{HH, TT\}$`], R`<p>Order matters, so HT and TH are different outcomes. Four equally likely outcomes.</p>`, { trap: 'Treating HT and TH as one outcome.' }),
    m.mcq(1, 'basic', R`<p>The probability of a sure event is:</p>`, R`$1$`, [R`$0$`, R`$\dfrac12$`, R`any number above 1`], R`<p>$P(S) = 1$ by the axioms.</p>`),
    m.mcq(1, 'basic', R`<p>The probability of an impossible event is:</p>`, R`$0$`, [R`$1$`, R`$-1$`, R`$\dfrac12$`], R`<p>$P(\varnothing) = 0$.</p>`),
    m.mcq(2, 'events', R`<p>Two dice are thrown. The probability that the sum is 8 is:</p>`, R`$\dfrac{5}{36}$`, [R`$\dfrac{1}{6}$`, R`$\dfrac{4}{36}$`, R`$\dfrac{6}{36}$`], R`<p>Pairs: (2,6), (3,5), (4,4), (5,3), (6,2): 5 of 36.</p>`),
    m.mcq(2, 'events', R`<p>One card is drawn from a pack of 52. The probability that it is a heart is:</p>`, R`$\dfrac14$`, [R`$\dfrac{1}{13}$`, R`$\dfrac{1}{52}$`, R`$\dfrac{1}{2}$`], R`<p>13 hearts in 52 cards.</p>`),
    m.mcq(2, 'addition', R`<p>$P(A) = 0.4$, $P(B) = 0.3$ and $P(A \cap B) = 0.1$. Then $P(A \cup B)$ is:</p>`, R`$0.6$`, [R`$0.7$`, R`$0.12$`, R`$0.5$`], R`<p>$0.4 + 0.3 - 0.1 = 0.6$.</p>`, { trap: 'Forgetting to subtract the overlap.' }),
    m.mcq(2, 'complement', R`<p>If $P(A) = 0.35$, then $P(\text{not } A)$ is:</p>`, R`$0.65$`, [R`$0.35$`, R`$-0.35$`, R`$1.35$`], R`<p>$1 - 0.35 = 0.65$.</p>`),
    m.mcq(2, 'exclusive', R`<p>A and B are mutually exclusive with $P(A) = 0.3$ and $P(B) = 0.5$. Then $P(A \text{ or } B)$ is:</p>`, R`$0.8$`, [R`$0.15$`, R`$0.2$`, R`$0.65$`], R`<p>No overlap, so just add.</p>`),
    m.mcq(3, 'events', R`<p>Two coins are tossed. The probability of at least one head is:</p>`, R`$\dfrac34$`, [R`$\dfrac12$`, R`$\dfrac14$`, R`$\dfrac23$`], R`<p>Only TT has no head: $1 - \tfrac14$.</p>`, { trap: 'Counting the outcomes as just 0, 1 or 2 heads (three outcomes, not equally likely).' }),
    m.mcq(3, 'addition', R`<p>A die is thrown once. $P(\text{even or prime})$ is:</p>`, R`$\dfrac56$`, [R`$\dfrac12$`, R`$\dfrac23$`, R`$\dfrac{1}{6}$`], R`<p>Even $\{2,4,6\}$, prime $\{2,3,5\}$; union $\{2,3,4,5,6\}$ has 5 outcomes.</p>`),
    m.mcq(3, 'axioms', R`<p>Which assignment cannot be a probability distribution on $\{a, b, c\}$?</p>`, R`$0.5,\ 0.4,\ 0.3$`, [R`$0.5,\ 0.3,\ 0.2$`, R`$\dfrac13,\ \dfrac13,\ \dfrac13$`, R`$1,\ 0,\ 0$`], R`<p>The total must be 1; $0.5 + 0.4 + 0.3 = 1.2$.</p>`),
    m.mcq(3, 'events', R`<p>Three coins are tossed. The probability of exactly two heads is:</p>`, R`$\dfrac38$`, [R`$\dfrac13$`, R`$\dfrac14$`, R`$\dfrac12$`], R`<p>HHT, HTH, THH: 3 of 8.</p>`),
    m.mcq(2, 'events', R`<p>A bag has 3 red and 5 blue balls. The probability that a ball drawn is red is:</p>`, R`$\dfrac38$`, [R`$\dfrac35$`, R`$\dfrac58$`, R`$\dfrac12$`], R`<p>3 red out of 8 balls.</p>`),
    m.ar(2, 'complement', R`$P(E) + P(E') = 1$ for every event $E$.`, R`$E$ and $E'$ are mutually exclusive and together make up the whole sample space.`, 0, R`<p>Both true; R explains A through the addition rule and $P(S) = 1$.</p>`),
    m.ar(2, 'exclusive', R`If $A$ and $B$ are mutually exclusive, $P(A \cup B) = P(A) + P(B)$.`, R`For mutually exclusive events $A \cap B$ is empty, so $P(A \cap B) = 0$.`, 0, R`<p>Both true: the addition rule loses its subtraction term.</p>`),
    m.ar(2, 'axioms', R`The probability of an event can be 1.2.`, R`Every probability lies between 0 and 1.`, 3, R`<p>A is false and R is true.</p>`),
    m.ar(3, 'basic', R`A fair die thrown 600 times shows a six exactly 100 times.`, R`The relative frequency of an event settles near its probability in the long run.`, 3, R`<p>A is false: the count will be near 100, not exactly 100. R is true.</p>`),
    m.nat(2, 'events', R`<p>Two dice are thrown. Find the probability that the sum is 9 (4 decimal places).</p>`, () => 4 / 36, 0.001, R`<p>(3,6), (4,5), (5,4), (6,3): $4/36 = 0.1111$.</p>`),
    m.nat(2, 'space', R`<p>3 coins and one die are thrown together. How many outcomes are in the sample space?</p>`, () => 48, 0, R`<p>$2^3 \times 6 = 48$.</p>`),
    m.nat(2, 'addition', R`<p>One card is drawn from 52. Find the probability that it is a king or a queen (4 decimal places).</p>`, () => 8 / 52, 0.001, R`<p>Exclusive events: $\dfrac{4 + 4}{52} = 0.1538$.</p>`),
    m.nat(3, 'complement', R`<p>$P(A) = 0.5$, $P(B) = 0.3$ and $P(A \cap B) = 0.1$. Find the probability that neither $A$ nor $B$ happens.</p>`, () => 0.3, 0.001, R`<p>$P(A \cup B) = 0.7$, so $1 - 0.7 = 0.3$.</p>`),
    m.nat(1, 'events', R`<p>In how many of the 36 outcomes of two dice is the sum 7?</p>`, () => 6, 0, R`<p>(1,6), (2,5), (3,4), (4,3), (5,2), (6,1).</p>`),
    m.msq(3, 'exclusive', R`<p>A die is thrown once. Which pairs of events are mutually exclusive? (Choose all that apply.)</p>`, [R`even number and odd number`, R`prime number and even number`, R`$\{1, 2\}$ and $\{5, 6\}$`, R`more than 3 and less than 3`], [0, 2, 3], R`<p>Prime and even share 2, so they are not exclusive. The others have no common outcome.</p>`),
    m.msq(2, 'axioms', R`<p>Which numbers could be the probability of an event? (Choose all that apply.)</p>`, [R`$0$`, R`$1$`, R`$0.75$`, R`$1.2$`, R`$-0.1$`], [0, 1, 2], R`<p>Probabilities lie from 0 to 1 inclusive.</p>`),
  ],
  gens: [
    { id: 'pb-g01', type: 'nat', level: 2, exams: ['board'], sub: 'events',
      make(rng) { const s = pick(rng, 3, 11), k = [...Array(11)].map((_, i) => i + 2).filter((t) => t >= s).reduce((a, t) => a + ways(t), 0); return { s, q: `<p>Two dice are thrown. Find the probability that the sum is at least ${s} (3 decimal places).</p>`, answer: k / 36, tol: 0.002, sol: `<p>${k} of the 36 outcomes qualify: $${k}/36 = ${(k / 36).toFixed(3)}$.</p>` }; },
      verify: (p) => { let low = 0; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (a + b < p.s) low++; return 1 - low / 36; } },
    { id: 'pb-g02', type: 'nat', level: 2, exams: ['board'], sub: 'addition',
      make(rng) { const i = pick(rng, 0, CARDS.length - 1), c = CARDS[i]; return { i, q: `<p>A card is drawn from a pack of 52. Find the probability of getting ${c.t} (3 decimal places).</p>`, answer: (c.n1 + c.n2 - c.o) / 52, tol: 0.002, sol: `<p>$(${c.n1} + ${c.n2} - ${c.o})/52 = ${((c.n1 + c.n2 - c.o) / 52).toFixed(3)}$.</p>` }; },
      verify: (p) => { let k = 0; for (let rk = 0; rk < 13; rk++) for (let s = 0; s < 4; s++) if (CARDS[p.i].f(rk, s)) k++; return k / 52; } },
    { id: 'pb-g03', type: 'nat', level: 2, exams: ['board'], sub: 'complement',
      make(rng) { const k = pick(rng, 2, 8); return { k, q: `<p>A fair coin is tossed ${k} times. Find the probability of at least one head (4 decimal places).</p>`, answer: 1 - 1 / 2 ** k, tol: 0.0005, sol: `<p>$1 - 1/${2 ** k} = ${(1 - 1 / 2 ** k).toFixed(4)}$.</p>` }; },
      verify: (p) => { let c = 0; for (let b = 1; b < 2 ** p.k; b++) c++; return c / 2 ** p.k; } },
    { id: 'pb-g04', type: 'nat', level: 2, exams: ['board'], sub: 'exclusive',
      make(rng) { const R_ = pick(rng, 2, 9), B = pick(rng, 2, 9), G = pick(rng, 1, 9); return { R_, B, G, q: `<p>A bag has ${R_} red, ${B} blue and ${G} green balls. Find the probability that a ball drawn is red or blue (3 decimal places).</p>`, answer: (R_ + B) / (R_ + B + G), tol: 0.002, sol: `<p>$(${R_} + ${B})/${R_ + B + G} = ${((R_ + B) / (R_ + B + G)).toFixed(3)}$.</p>` }; },
      verify: (p) => 1 - p.G / (p.R_ + p.B + p.G) },
    { id: 'pb-g05', type: 'nat', level: 3, exams: ['board'], sub: 'complement',
      make(rng) { const a = pick(rng, 20, 60, 5) / 100, b = pick(rng, 20, 60, 5) / 100, c = pick(rng, 5, Math.min(a, b) * 100 - 5, 5) / 100; return { a, b, c, q: `<p>$P(A) = ${a}$, $P(B) = ${b}$ and $P(A \\cap B) = ${c}$. Find the probability that neither $A$ nor $B$ happens (2 decimal places).</p>`, answer: 1 - (a + b - c), tol: 0.006, sol: `<p>$1 - (${a} + ${b} - ${c}) = ${(1 - (a + b - c)).toFixed(2)}$.</p>` }; },
      verify: (p) => 1 - ((p.a - p.c) + (p.b - p.c) + p.c) },
    { id: 'pb-g06', type: 'nat', level: 2, exams: ['board'], sub: 'space',
      make(rng) { const k = pick(rng, 1, 5), d = pick(rng, 1, 3); return { k, d, q: `<p>${k} coin${k > 1 ? 's' : ''} and ${d} ${d > 1 ? 'dice' : 'die'} are thrown together. How many outcomes are in the sample space?</p>`, answer: 2 ** k * 6 ** d, tol: 0, sol: `<p>$2^${k} \\times 6^${d} = ${2 ** k * 6 ** d}$.</p>` }; },
      verify: (p) => { let c = 0; for (let a = 0; a < 2 ** p.k; a++) for (let b = 0; b < 6 ** p.d; b++) c++; return c; } },
  ],
};

// Extra question shapes for part-a-aptitude (templates apt-m31..m35, CSIR NET Part A, everyday reasoning).
// Imported by part-a-aptitude.js.
import { int, choose, shuffle, mcqOptions } from '../_util.js';
import { oddOne } from './_odd.js';
import { gcd } from './_more.js';

const NOUNS = ['poets', 'pilots', 'runners', 'teachers', 'engineers', 'cooks', 'dancers', 'farmers', 'swimmers', 'painters', 'singers', 'chess players'];
const NAMES = ['Asha', 'Bilal', 'Chen', 'Divya', 'Esha', 'Farid', 'Gita', 'Hari'];

export default [
  { id: 'apt-m31', type: 'mcq', level: 2, exams: ['net'], sub: 'logical reasoning', format: 'single',
    make(r) {
      const [A, B, C] = shuffle(r, NOUNS);
      const S = choose(r, [
        [`All ${A} are ${B}. All ${B} are ${C}.`, `All ${A} are ${C}`, [`All ${C} are ${A}`, `Some ${C} are not ${A}`, `No ${A} are ${C}`], `Every ${A.slice(0, -1)} is inside the ${B} circle, which is inside the ${C} circle.`],
        [`All ${A} are ${B}. No ${B} are ${C}.`, `No ${A} are ${C}`, [`Some ${A} are ${C}`, `All ${C} are ${B}`, `Some ${C} are ${A}`], `The ${A} circle lies inside the ${B} circle, which does not touch the ${C} circle.`],
        [`Some ${A} are ${B}. All ${B} are ${C}.`, `Some ${A} are ${C}`, [`All ${A} are ${C}`, `No ${A} are ${C}`, `All ${C} are ${A}`], `The ${A} who are ${B} are also ${C}, because the whole ${B} circle lies inside ${C}.`],
        [`No ${A} are ${B}. All ${C} are ${B}.`, `No ${C} are ${A}`, [`Some ${C} are ${A}`, `All ${A} are ${C}`, `All ${B} are ${C}`], `The ${C} circle lies inside ${B}, and ${B} shares nothing with ${A}.`],
        [`All ${A} are ${B}. Some ${C} are not ${B}.`, `Some ${C} are not ${A}`, [`Some ${A} are not ${C}`, `No ${C} are ${A}`, `All ${A} are ${C}`], `The ${C} lying outside ${B} must also lie outside ${A}, since ${A} is inside ${B}.`],
      ]);
      const o = mcqOptions(r, S[1], S[2]);
      return { q: `Statements: "${S[0]}" Which conclusion follows for certain?`, ...o,
        sol: `Draw the circles. ${S[3]} So "${S[1]}" must hold. Each of the others can be broken by some drawing that still obeys both statements.`,
        trap: 'A conclusion must hold in every possible drawing, not just the obvious one.' };
    } },
  { id: 'apt-m32', type: 'mcq', level: 1, exams: ['net'], sub: 'odd one out', format: 'single',
    make(r) {
      const kind = int(r, 0, 3);
      let odd, rest, lead;
      if (kind === 0) {
        const ks = shuffle(r, [4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15]).slice(0, 4);
        rest = ks.slice(0, 3).map((k) => [`${k * k}`, `$${k}^2$`]);
        odd = [`${ks[3] * (ks[3] + 1)}`, `$${ks[3]}\\times${ks[3] + 1}$, not a perfect square`];
        lead = 'All but one are perfect squares.';
      } else if (kind === 1) {
        rest = shuffle(r, [23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]).slice(0, 3).map((p) => [`${p}`, 'prime']);
        const c = choose(r, [[51, '3 × 17'], [57, '3 × 19'], [69, '3 × 23'], [77, '7 × 11'], [87, '3 × 29'], [91, '7 × 13'], [93, '3 × 31']]);
        odd = [`${c[0]}`, `composite: ${c[1]}`];
        lead = 'All but one are prime numbers.';
      } else if (kind === 2) {
        const m = choose(r, [7, 9, 11, 13]), ks = shuffle(r, [3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).slice(0, 4);
        rest = ks.slice(0, 3).map((k) => [`${m * k}`, `$${m}\\times${k}$`]);
        odd = [`${m * ks[3] + 2}`, `leaves remainder 2 when divided by ${m}`];
        lead = `All but one are multiples of ${m}.`;
      } else {
        const ks = shuffle(r, [2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4);
        rest = ks.slice(0, 3).map((k) => [`${k ** 3}`, `$${k}^3$`]);
        odd = [`${ks[3] ** 3 + 1}`, `one more than $${ks[3]}^3$, not a cube`];
        lead = 'All but one are perfect cubes.';
      }
      const o = oddOne(r, odd, rest, { lead });
      return { q: 'Which number does not belong with the others?', ...o,
        trap: 'Look for the shared property first (squares, cubes, primes, multiples), then test each number.' };
    } },
  { id: 'apt-m33', type: 'mcq', level: 2, exams: ['net'], sub: 'ordering', format: 'single',
    make(r) {
      const n = int(r, 4, 5), ppl = shuffle(r, NAMES).slice(0, n);
      const [adj, top, bot] = choose(r, [['taller', 'tallest', 'shortest'], ['older', 'oldest', 'youngest'], ['heavier', 'heaviest', 'lightest'], ['faster', 'fastest', 'slowest']]);
      const clues = shuffle(r, ppl.slice(0, -1).map((p, i) => `${p} is ${adj} than ${ppl[i + 1]}`));
      const k = int(r, 1, n);
      const word = k === 1 ? `the ${top}` : k === n ? `the ${bot}` : `${['', 'second', 'third', 'fourth'][k - 1]} ${top}`;
      const o = mcqOptions(r, ppl[k - 1], shuffle(r, ppl.filter((_, i) => i !== k - 1)));
      return { q: `${clues.join('. ')}. Who is ${k === 1 || k === n ? word : `the ${word}`}?`, ...o,
        sol: `Chain the comparisons: ${ppl.join(' > ')} (from ${top} to ${bot}). Position ${k} from the top is ${ppl[k - 1]}.`,
        trap: 'Build the full chain before answering; the clues are given out of order.' };
    } },
  { id: 'apt-m34', type: 'mcq', level: 2, exams: ['net'], sub: 'mixtures', format: 'single',
    make(r) {
      const a = choose(r, [10, 15, 20, 25, 30]), b = choose(r, [50, 60, 70, 80]), c = a + 5 * int(r, 1, (b - a) / 5 - 1);
      const red = (x, y) => { const g = gcd(x, y); return `${x / g} : ${y / g}`; };
      const ans = red(b - c, c - a);
      const o = mcqOptions(r, ans, [red(c - a, b - c), red(c - a, b - a), red(b - c, b - a), '1 : 1', '2 : 1', '1 : 3']);
      return { q: `A ${a}% salt solution is mixed with a ${b}% salt solution to make a ${c}% solution. In what ratio (${a}% solution : ${b}% solution) must they be mixed?`, ...o,
        sol: `Rule of alligation: the amounts are in the inverse ratio of the distances from the target. $(${b} - ${c}) : (${c} - ${a}) = ${b - c} : ${c - a} = ${ans}$. Check: $\\dfrac{${a}(${b - c}) + ${b}(${c - a})}{${b - a}} = ${c}$%.`,
        trap: 'The weaker solution gets the share proportional to the gap between the stronger one and the target, not its own gap.' };
    } },
  { id: 'apt-m35', type: 'mcq', level: 2, exams: ['net'], sub: 'counting', format: 'single',
    make(r) {
      const n = int(r, 3, 8), k = int(r, 0, 3), m = n - 2;
      const cnt = [m ** 3, 6 * m * m, 12 * m, 8];
      const o = mcqOptions(r, cnt[k], [...cnt.filter((_, i) => i !== k), 6 * (n - 1) ** 2, 12 * (n - 1), n ** 3 - m ** 3, 6 * n * n]);
      const kt = ['no face', 'exactly one face', 'exactly two faces', 'exactly three faces'][k];
      return { q: `A wooden cube of edge ${n} cm is painted on all six faces and then cut into 1 cm cubes. How many of the small cubes have ${kt} painted?`, ...o,
        sol: `With $m = n - 2 = ${m}$: three painted faces are the 8 corners; two faces are edge cubes, $12m = ${12 * m}$; one face are face-centre cubes, $6m^2 = ${6 * m * m}$; none are the hidden inner cube, $m^3 = ${m ** 3}$. Check: $8 + ${12 * m} + ${6 * m * m} + ${m ** 3} = ${n ** 3}$. Answer: ${cnt[k]}.`,
        trap: 'Remove the outer layer on each side: the inner block has edge $n - 2$, not $n - 1$.' };
    } },
];

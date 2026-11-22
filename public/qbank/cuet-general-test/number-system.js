// CUET General Test: numbers, HCF and LCM. Original questions for fibub. Items are fixed; gens make fresh numbers.
import { pick, int, choose, fmt, rs, shuffleOpts, steps } from './_cuet.js';

const T = { exams: ['cuet'], format: 'single' };
const mcq = (id, level, sub, q, options, answer, sol, trap) => ({ id, type: 'mcq', level, sub, q, options, answer, sol, ...(trap ? { trap } : {}), ...T });
// Puts the right answer at a position that varies with the id number, so it is not always first.
const mk = (id, level, sub, q, right, wrongs, sol, trap) => {
  const k = parseInt(id.slice(-3), 10) % 4, o = [...wrongs]; o.splice(k, 0, right);
  return mcq(id, level, sub, q, o, k, sol, trap);
};
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const lcm = (a, b) => (a / gcd(a, b)) * b;

export default {
  topic: 'number-system',
  items: [
    mk('ns-001', 1, 'hcf', 'What is the HCF of 36 and 48?', '12', ['6', '24', '144'],
      '36 = 2² × 3² and 48 = 2⁴ × 3. Take the lowest power of each common prime: 2² × 3 = <b>12</b>. Quick check: 48 − 36 = 12 and 12 divides both.'),
    mk('ns-002', 1, 'lcm', 'What is the LCM of 12, 15 and 20?', '60', ['30', '120', '180'],
      '12 = 2² × 3, 15 = 3 × 5, 20 = 2² × 5. Take the highest power of each prime: 2² × 3 × 5 = <b>60</b>.',
      'Multiplying all three (3,600) gives a common multiple, not the least one.'),
    mk('ns-003', 1, 'lcm', 'What is the smallest number divisible by 6, 8 and 12?', '24', ['48', '12', '72'],
      'LCM: 6 = 2 × 3, 8 = 2³, 12 = 2² × 3. Highest powers: 2³ × 3 = <b>24</b>. 24 ÷ 6 = 4, 24 ÷ 8 = 3, 24 ÷ 12 = 2.'),
    mk('ns-004', 2, 'hcf', 'What is the largest number that divides both 60 and 84 exactly?', '12', ['6', '24', '420'],
      'That is the HCF. 84 − 60 = 24, and HCF(60, 24): 60 = 2 × 24 + 12, 24 = 2 × 12. So the HCF is <b>12</b>. Euclid\'s method is the topper\'s shortcut.'),
    mk('ns-005', 2, 'hcf-lcm', 'The product of two numbers is 2,160 and their HCF is 12. What is their LCM?', '180', ['144', '240', '360'],
      'HCF × LCM = product of the two numbers. LCM = 2,160 ÷ 12 = <b>180</b>.'),
    mk('ns-006', 1, 'divisibility', 'Which of these numbers is divisible by 11?', '2,849', ['3,254', '4,127', '5,162'],
      'Rule: (sum of digits in odd places) − (sum in even places) must be 0 or a multiple of 11. For 2,849: (9 + 8) − (4 + 2) = 11. So <b>2,849</b> works (2,849 = 11 × 259). The others give 2, 2 and 8 in the same test.'),
    mk('ns-007', 1, 'basics', 'What is the smallest 3-digit number divisible by 7?', '105', ['100', '104', '112'],
      '100 ÷ 7 leaves remainder 2, so add 7 − 2 = 5: 100 + 5 = <b>105</b> = 7 × 15.'),
    mk('ns-008', 2, 'basics', 'What is the largest 4-digit number divisible by 12?', '9,996', ['9,999', '9,992', '9,984'],
      '9,999 ÷ 12 leaves remainder 3 (12 × 833 = 9,996). Subtract the remainder: 9,999 − 3 = <b>9,996</b>.',
      'Take the remainder away from the largest number; do not add to it.'),
    mk('ns-009', 3, 'remainders', 'What is the remainder when 2¹⁰ is divided by 7?', '2', ['1', '3', '4'],
      '2³ = 8 leaves remainder 1 on division by 7. So 2⁹ = (2³)³ leaves 1, and 2¹⁰ = 2⁹ × 2 leaves <b>2</b>. (Check: 1,024 = 7 × 146 + 2.)'),
    mk('ns-010', 2, 'unit digit', 'What is the unit digit of 7²³?', '3', ['7', '9', '1'],
      'Unit digits of powers of 7 repeat in a cycle of 4: 7, 9, 3, 1. Now 23 ÷ 4 leaves remainder 3, so take the 3rd digit of the cycle: <b>3</b>.',
      'If the remainder is 0, take the last digit of the cycle (1 here), not the first.'),
    mk('ns-011', 2, 'factors', 'How many factors does 36 have?', '9', ['8', '6', '12'],
      '36 = 2² × 3². Number of factors = (2 + 1)(2 + 1) = <b>9</b>: 1, 2, 3, 4, 6, 9, 12, 18, 36.'),
    mk('ns-012', 1, 'primes', 'How many prime numbers are there between 1 and 20?', '8', ['7', '9', '10'],
      'They are 2, 3, 5, 7, 11, 13, 17, 19: <b>8</b> primes. Remember that 1 is not prime and 2 is the only even prime.',
      '1 is not a prime; 9 and 15 are not primes either.'),
    mk('ns-013', 1, 'series', 'What is the sum of the first 20 natural numbers?', '210', ['200', '220', '420'],
      'n(n + 1)/2 = 20 × 21/2 = <b>210</b>.',
      '420 is 20 × 21 before halving.'),
    mk('ns-014', 1, 'series', 'What is the sum of the first 10 odd numbers (1 + 3 + 5 + ... + 19)?', '100', ['110', '55', '90'],
      'The sum of the first n odd numbers is n². So 10² = <b>100</b>.'),
    mk('ns-015', 2, 'remainders', 'What is the smallest number that leaves remainder 5 when divided by 8, 12 or 15?', '125', ['120', '115', '245'],
      'The number is a multiple of LCM(8, 12, 15) plus 5. LCM = 2³ × 3 × 5 = 120. Smallest number = 120 + 5 = <b>125</b>.',
      '245 (= 240 + 5) also works but is not the smallest.'),
    mk('ns-016', 3, 'hcf', 'What is the greatest number that divides 70 and 125, leaving remainders 5 and 8 respectively?', '13', ['5', '15', '39'],
      'The number divides 70 − 5 = 65 and 125 − 8 = 117 exactly. HCF(65, 117): 65 = 5 × 13 and 117 = 9 × 13, so the HCF is <b>13</b>. Check: 70 = 13 × 5 + 5 and 125 = 13 × 9 + 8.',
      'Do not take the HCF of 70 and 125 directly. First remove the remainders.'),
    mk('ns-017', 1, 'comparison', 'Which of these fractions is the greatest?', '3/4', ['2/3', '5/8', '7/12'],
      'As decimals: 2/3 ≈ 0.667, 3/4 = 0.75, 5/8 = 0.625, 7/12 ≈ 0.583. The greatest is <b>3/4</b>.'),
    mk('ns-018', 2, 'fractions', 'What is the value of (7/8) ÷ (7/16)?', '2', ['1/2', '49/128', '4'],
      'Dividing by a fraction means multiplying by its reverse: 7/8 × 16/7 = 16/8 = <b>2</b>. Cancel the 7s first.',
      'Flipping the wrong fraction gives 1/2.'),
    mk('ns-019', 1, 'roots', 'What is the square root of 1,764?', '42', ['44', '36', '48'],
      'The unit digit 4 means the root ends in 2 or 8. 40² = 1,600 and 50² = 2,500, so the root is between 40 and 50 and ends in 2 or 8: 42 or 48. Since 45² = 2,025 &gt; 1,764, it must be <b>42</b>. (42² = 1,764.)'),
    mk('ns-020', 1, 'roots', 'What is the cube root of 3,375?', '15', ['25', '13', '35'],
      'Last digit 5 means the root ends in 5. 10³ = 1,000 and 20³ = 8,000, so the root is between 10 and 20: <b>15</b>. Check: 15³ = 225 × 15 = 3,375.'),
    mk('ns-021', 2, 'shortcuts', 'Find 98 × 102.', '9,996', ['9,998', '9,896', '10,004'],
      'Write as (100 − 2)(100 + 2) = 100² − 2² = 10,000 − 4 = <b>9,996</b>.'),
    mk('ns-022', 2, 'bodmas', 'Simplify: 15 + 3 × 8 ÷ 4 − 2.', '19', ['16', '34', '7'],
      'BODMAS: multiplication and division first, left to right. 3 × 8 = 24, 24 ÷ 4 = 6. Then 15 + 6 − 2 = <b>19</b>.',
      'Working strictly left to right (18 × 8 ÷ 4 − 2 = 34) ignores the order of operations.'),
    mk('ns-023', 3, 'hcf-lcm', 'What is the HCF of the fractions 2/3 and 4/9?', '2/9', ['1/3', '4/9', '8/27'],
      'HCF of fractions = HCF of numerators ÷ LCM of denominators = HCF(2, 4) ÷ LCM(3, 9) = <b>2/9</b>. Check: 2/3 = 3 × 2/9 and 4/9 = 2 × 2/9.'),
    mk('ns-024', 2, 'lcm', 'Three bells ring every 12, 15 and 20 minutes. They ring together at 8:00 a.m. When will they next ring together?', '9:00 a.m.', ['8:30 a.m.', '10:00 a.m.', '8:45 a.m.'],
      'LCM(12, 15, 20) = 60 minutes. So they ring together again 60 minutes later, at <b>9:00 a.m.</b>'),
    mk('ns-025', 2, 'remainders', 'What is the least number that must be added to 1,000 to make it divisible by 18?', '8', ['10', '18', '6'],
      '1,000 ÷ 18 = 55 remainder 10 (18 × 55 = 990). To reach the next multiple add 18 − 10 = <b>8</b>. (1,008 = 18 × 56.)',
      '10 is the remainder, which you would <i>subtract</i> to get the multiple below.'),
    mk('ns-026', 2, 'remainders', 'What is the least number that must be subtracted from 2,000 to make it divisible by 13?', '11', ['2', '13', '9'],
      '13 × 153 = 1,989 and 2,000 − 1,989 = 11. So subtract the remainder, <b>11</b>.'),
    mk('ns-027', 1, 'algebra', 'The sum of two numbers is 45 and their difference is 13. What is the larger number?', '29', ['32', '16', '26'],
      'Larger = (sum + difference) ÷ 2 = (45 + 13) ÷ 2 = <b>29</b>. The smaller is 16, and 29 + 16 = 45.'),
    mk('ns-028', 1, 'counting', 'How many numbers from 1 to 50 are divisible by 7?', '7', ['6', '8', '5'],
      '50 ÷ 7 = 7.14, so the multiples are 7 × 1 up to 7 × 7 = 49: <b>7</b> numbers.'),
    mk('ns-029', 2, 'types', 'Which of these is an irrational number?', '√7', ['√16', '√0.25', '√(49/9)'],
      '√16 = 4, √0.25 = 0.5 and √(49/9) = 7/3 are all rational. 7 is not a perfect square, so <b>√7</b> cannot be written as a fraction.'),
    mk('ns-030', 3, 'remainders', 'A number leaves remainder 3 when divided by 7. What remainder does twice the number leave when divided by 7?', '6', ['3', '0', '1'],
      'Write the number as 7k + 3. Twice it is 14k + 6, so the remainder is <b>6</b> (and 6 &lt; 7, so no further reduction).',
      'If the remainder had been 5, twice it (10) would need reducing to 3.'),
    mk('ns-031', 3, 'digits', 'The digits of a two-digit number add up to 11. If the digits are reversed, the number becomes 27 more. What is the original number?', '47', ['74', '56', '38'],
      'Let the number be 10a + b. Reversed minus original = 9(b − a) = 27, so b − a = 3. With a + b = 11: b = 7 and a = 4. The number is <b>47</b> (reverse 74, and 74 − 47 = 27).',
      '74 has the right digit sum but reversing it makes the number smaller.'),
    mk('ns-032', 2, 'divisibility', 'Which of these numbers is divisible by 8?', '3,824', ['5,612', '9,148', '2,306'],
      'A number is divisible by 8 if its last three digits are. 824 ÷ 8 = 103, so <b>3,824</b> works. 612 ÷ 8 = 76.5 and 148 ÷ 8 = 18.5 do not; 2,306 is odd.'),
  ],
  gens: [
    { id: 'ns-g01', type: 'mcq', level: 1, sub: 'hcf', ...T,
      make(rng) {
        const [a, b] = choose(rng, [[3, 4], [4, 5], [5, 7], [2, 3], [5, 6], [7, 8], [3, 8]]), k = int(rng, 4, 15);
        const { options, answer } = shuffleOpts(rng, k, [a * b * k, k * 2, a * k]);
        return { q: `What is the HCF of ${a * k} and ${b * k}?`, options, answer,
          sol: steps(`${a * k} = ${k} × ${a} and ${b * k} = ${k} × ${b}.`, `${a} and ${b} have no common factor, so the HCF is <b>${k}</b>.`),
          trap: `${a * b * k} is the LCM, not the HCF.` };
      } },
    { id: 'ns-g02', type: 'mcq', level: 2, sub: 'lcm', ...T,
      make(rng) {
        const [a, b] = choose(rng, [[3, 4], [4, 5], [5, 7], [2, 3], [5, 6], [7, 8], [3, 8]]), k = int(rng, 3, 12), l = a * b * k;
        const { options, answer } = shuffleOpts(rng, l, [k, l * 2, a * k + b * k]);
        return { q: `What is the LCM of ${a * k} and ${b * k}?`, options, answer,
          sol: steps(`HCF = ${k}, because ${a} and ${b} share no factor.`, `LCM = ${a * k} × ${b * k} ÷ ${k} = <b>${l}</b>.`),
          trap: `${a * k * b * k} is the product, which is larger than the LCM by a factor of the HCF.` };
      } },
    { id: 'ns-g03', type: 'mcq', level: 2, sub: 'hcf-lcm', ...T,
      make(rng) {
        const h = choose(rng, [4, 6, 8, 12, 15]), m = int(rng, 3, 9), l = h * m, prod = h * l;
        const { options, answer } = shuffleOpts(rng, l, [prod, h, l + h]);
        return { q: `The product of two numbers is ${fmt(prod, 0)} and their HCF is ${h}. What is their LCM?`, options, answer,
          sol: steps('HCF × LCM = product of the numbers.', `LCM = ${fmt(prod, 0)} ÷ ${h} = <b>${l}</b>.`),
          trap: 'The LCM is a multiple of the HCF, so it cannot be smaller than it.' };
      } },
    { id: 'ns-g04', type: 'mcq', level: 2, sub: 'remainders', ...T,
      make(rng) {
        const d = int(rng, 11, 29), q = int(rng, 20, 60), r = int(rng, 1, d - 1), N = d * q + r, add = d - r;
        const { options, answer } = shuffleOpts(rng, add, [r, d, add + 1]);
        return { q: `What is the least number that must be added to ${fmt(N, 0)} to make it exactly divisible by ${d}?`, options, answer,
          sol: steps(`${fmt(N, 0)} ÷ ${d} = ${q} remainder ${r}.`, `Add ${d} − ${r} = <b>${add}</b> to reach ${fmt(N + add, 0)} = ${d} × ${q + 1}.`),
          trap: `${r} is the remainder; that is what you would subtract.` };
      } },
    { id: 'ns-g05', type: 'mcq', level: 3, sub: 'unit digit', ...T,
      make(rng) {
        const a = choose(rng, [2, 3, 7, 8]), n = int(rng, 20, 99);
        const cyc = []; let x = 1; for (let i = 0; i < 4; i++) { x = (x * a) % 10; cyc.push(x); }
        const ans = cyc[(n - 1) % 4];
        const { options, answer } = shuffleOpts(rng, ans, [cyc[0], cyc[1], cyc[2], cyc[3]], (v) => String(v));
        return { q: `What is the unit digit of ${a}<sup>${n}</sup>?`, options, answer,
          sol: steps(`Unit digits of powers of ${a} repeat every 4 steps: ${cyc.join(', ')}.`, `${n} ÷ 4 leaves remainder ${n % 4}, so take position ${n % 4 === 0 ? 4 : n % 4} of the cycle: <b>${ans}</b>.`),
          trap: 'When the remainder is 0, use the 4th digit of the cycle.' };
      } },
    { id: 'ns-g06', type: 'mcq', level: 2, sub: 'lcm', ...T,
      make(rng) {
        const [a, b, c] = choose(rng, [[6, 8, 12], [10, 15, 20], [12, 18, 24], [9, 12, 18], [8, 10, 12], [15, 20, 25]]), l = lcm(lcm(a, b), c);
        const { options, answer } = shuffleOpts(rng, l, [a * b * c, l * 2, l / 2], (v) => `${fmt(v, 0)} minutes`);
        return { q: `Three signals at a crossing change every ${a}, ${b} and ${c} minutes. If they change together now, after how many minutes will they next change together?`, options, answer,
          sol: steps(`The answer is LCM(${a}, ${b}, ${c}).`, `Break into primes and take the highest powers: LCM = <b>${l}</b> minutes.`),
          trap: 'The product of the three numbers is a common multiple, but usually not the least.' };
      } },
    { id: 'ns-g07', type: 'mcq', level: 3, sub: 'remainders', ...T,
      make(rng) {
        const [a, b, c] = choose(rng, [[6, 8, 12], [4, 6, 10], [5, 6, 8], [9, 12, 18], [6, 9, 15]]), r = int(rng, 1, 3), l = lcm(lcm(a, b), c);
        const { options, answer } = shuffleOpts(rng, l + r, [l, l - r, 2 * l + r]);
        return { q: `What is the smallest number which leaves a remainder of ${r} when divided by ${a}, ${b} or ${c}?`, options, answer,
          sol: steps(`LCM(${a}, ${b}, ${c}) = ${l}.`, `Number = LCM + remainder = ${l} + ${r} = <b>${l + r}</b>.`),
          trap: `${l} leaves remainder 0, not ${r}.` };
      } },
  ],
};

// CUET General Test: ratio and proportion. Original questions for fibub. Items are fixed; gens make fresh numbers.
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
  topic: 'ratio-proportion',
  items: [
    mk('rp-001', 1, 'sharing', 'Ravi and Meena share ₹720 in the ratio 5 : 4. What is Meena\'s share?', '₹320', ['₹360', '₹400', '₹288'],
      'Total parts = 5 + 4 = 9, so one part = 720 ÷ 9 = ₹80. Meena has 4 parts = 4 × 80 = <b>₹320</b>. (Ravi gets ₹400.)',
      'Meena is the second (smaller) term: she gets 4 parts, not 5.'),
    mk('rp-002', 1, 'simplify', 'What is 15 : 25 in its simplest form?', '3 : 5', ['5 : 3', '15 : 5', '1 : 2'],
      'Divide both terms by their HCF, 5: 15 ÷ 5 = 3 and 25 ÷ 5 = 5. So <b>3 : 5</b>.'),
    mk('rp-003', 1, 'proportion', 'If 4 : 6 = 10 : x, what is x?', '15', ['12', '20', '25'],
      'In a proportion, product of extremes = product of means: 4 × x = 6 × 10, so x = 60 ÷ 4 = <b>15</b>. Shortcut: 4 → 10 is × 2.5, so 6 × 2.5 = 15.'),
    mk('rp-004', 2, 'mean proportional', 'What is the mean proportional between 4 and 36?', '12', ['20', '16', '144'],
      'Mean proportional of a and b is √(ab) = √(4 × 36) = √144 = <b>12</b>. (4 : 12 = 12 : 36, both equal 1 : 3.)',
      'The average (20) is not the mean proportional; that is the geometric, not arithmetic, mean.'),
    mk('rp-005', 2, 'compound', 'If A : B = 2 : 3 and B : C = 4 : 5, what is A : C?', '8 : 15', ['2 : 5', '10 : 12', '4 : 15'],
      'Make B the same in both: A : B = 8 : 12 and B : C = 12 : 15. So A : B : C = 8 : 12 : 15, and A : C = <b>8 : 15</b>. Or multiply: (2/3) × (4/5) = 8/15.'),
    mk('rp-006', 1, 'sharing', 'Two numbers are in the ratio 3 : 4 and their sum is 56. What is the smaller number?', '24', ['32', '21', '28'],
      'One part = 56 ÷ 7 = 8. Smaller = 3 × 8 = <b>24</b> and larger = 32. Check: 24 + 32 = 56.'),
    mk('rp-007', 1, 'ages', 'The ages of a father and his son are in the ratio 7 : 2. If their ages add up to 63, how old is the son?', '14', ['18', '7', '21'],
      'Parts = 7 + 2 = 9, one part = 63 ÷ 9 = 7. Son = 2 × 7 = <b>14</b> and father = 49.'),
    mk('rp-008', 1, 'sharing', 'In a school of 640 students the ratio of boys to girls is 5 : 3. How many girls are there?', '240', ['400', '120', '192'],
      'One part = 640 ÷ 8 = 80. Girls = 3 × 80 = <b>240</b> (boys = 400).',
      '400 is the number of boys.'),
    mk('rp-009', 3, 'equations', 'Two numbers are in the ratio 3 : 5. When 10 is added to each, the ratio becomes 2 : 3. What is the larger number?', '50', ['30', '40', '60'],
      'Let the numbers be 3x and 5x. (3x + 10)/(5x + 10) = 2/3, so 9x + 30 = 10x + 20 and x = 10. Larger = 5x = <b>50</b>. Check: 40 : 60 = 2 : 3.',
      '30 is the smaller number.'),
    mk('rp-010', 1, 'direct', '8 pens cost ₹96. What do 15 pens cost at the same rate?', '₹180', ['₹150', '₹192', '₹168'],
      'One pen = 96 ÷ 8 = ₹12. 15 pens = 15 × 12 = <b>₹180</b>.'),
    mk('rp-011', 2, 'inverse', '12 workers finish a job in 15 days. How many days will 20 workers need, working at the same speed?', '9', ['25', '12', '10'],
      'Workers × days stays constant: 12 × 15 = 180 worker-days. 180 ÷ 20 = <b>9 days</b>. More workers, fewer days.',
      '25 comes from treating it as direct proportion (more workers, more days).'),
    mk('rp-012', 2, 'inverse', '6 men build a wall in 20 days. In how many days can 8 men build it?', '15', ['12', '27', '18'],
      '6 × 20 = 120 man-days of work. 120 ÷ 8 = <b>15 days</b>.'),
    mk('rp-013', 2, 'scale', 'On a map the scale is 1 : 50,000. A road is 4 cm long on the map. What is its real length?', '2 km', ['20 km', '0.2 km', '5 km'],
      '4 × 50,000 = 200,000 cm. 100 cm = 1 m, so 2,000 m = <b>2 km</b>.',
      'Converting cm to km: divide by 1,00,000 (100 cm × 1,000 m).'),
    mk('rp-014', 1, 'percent', 'If two numbers are in the ratio 2 : 3, the first is what percent of the total?', '40%', ['60%', '50%', '20%'],
      'Total parts = 5, so the first is 2/5 = <b>40%</b>.'),
    mk('rp-015', 2, 'third proportional', 'What is the third proportional to 4 and 6?', '9', ['12', '8', '10'],
      'Third proportional x makes 4 : 6 = 6 : x. So x = 6 × 6 ÷ 4 = <b>9</b>.'),
    mk('rp-016', 3, 'equations', 'The incomes of A and B are in the ratio 5 : 4 and their expenses in the ratio 3 : 2. Each saves ₹1,200. What is A\'s income?', '₹3,000', ['₹2,400', '₹3,600', '₹2,700'],
      'Let incomes be 5x and 4x, expenses 3y and 2y. 5x − 3y = 1,200 and 4x − 2y = 1,200. From the second, y = 2x − 600. Put in the first: 5x − 6x + 1,800 = 1,200, so x = 600. A\'s income = 5 × 600 = <b>₹3,000</b>. Check: expenses 1,800 and 1,200; savings 1,200 each.',
      '₹2,400 is B\'s income.'),
    mk('rp-017', 2, 'compound', 'What is the compounded ratio of 2 : 3 and 4 : 5?', '8 : 15', ['6 : 8', '2 : 5', '9 : 10'],
      'Compounded ratio multiplies the first terms and the second terms: (2 × 4) : (3 × 5) = <b>8 : 15</b>.'),
    mk('rp-018', 2, 'duplicate', 'What is the duplicate ratio of 3 : 4?', '9 : 16', ['6 : 8', '3 : 16', '4 : 3'],
      'Duplicate ratio is the ratio of the squares: 3² : 4² = <b>9 : 16</b>.',
      'Do not double the terms (6 : 8 is the same ratio as 3 : 4).'),
    mk('rp-019', 1, 'sharing', 'A sum of ₹200 is divided among three friends in the ratio 2 : 3 : 5. What does the one with the smallest share get?', '₹40', ['₹60', '₹100', '₹20'],
      'Parts = 2 + 3 + 5 = 10, one part = ₹20. The smallest share is 2 parts = <b>₹40</b>. (Shares: 40, 60, 100.)'),
    mk('rp-020', 3, 'coins', 'A bag holds ₹1, ₹2 and ₹5 coins in the ratio 5 : 3 : 2 and its total value is ₹210. How many ₹5 coins are there?', '20', ['10', '30', '50'],
      'For every 10 coins (5 + 3 + 2) the value is 5 × 1 + 3 × 2 + 2 × 5 = 5 + 6 + 10 = ₹21. So there are 210 ÷ 21 = 10 such groups. ₹5 coins = 2 × 10 = <b>20</b>.',
      'The ratio is of the number of coins, not of the money in each kind.'),
    mk('rp-021', 3, 'compound', 'If A : B = 3 : 4 and B : C = 6 : 7, what is A : B : C?', '9 : 12 : 14', ['3 : 4 : 7', '9 : 12 : 7', '9 : 8 : 14'],
      'Make B equal. LCM of 4 and 6 is 12. A : B = 3 : 4 = 9 : 12 and B : C = 6 : 7 = 12 : 14. So A : B : C = <b>9 : 12 : 14</b>.',
      'Writing 3 : 4 : 7 just glues the numbers together and ignores that B is different in the two ratios.'),
    mk('rp-022', 2, 'units', 'What is the ratio of 2 metres to 50 centimetres?', '4 : 1', ['1 : 4', '2 : 50', '40 : 1'],
      'Bring both to the same unit: 2 m = 200 cm. 200 : 50 = <b>4 : 1</b>.',
      'A ratio only makes sense in the same unit; 2 : 50 ignores the unit change.'),
    mk('rp-023', 3, 'expressions', 'If x : y = 3 : 4, what is (2x + y) : (x + 2y)?', '10 : 11', ['11 : 10', '6 : 5', '5 : 6'],
      'Take x = 3 and y = 4. 2x + y = 6 + 4 = 10 and x + 2y = 3 + 8 = 11. So <b>10 : 11</b>.'),
    mk('rp-024', 3, 'fractions', 'If 3/4 of A equals 2/3 of B, what is A : B?', '8 : 9', ['9 : 8', '1 : 2', '3 : 2'],
      '3A/4 = 2B/3, so A/B = (2/3) × (4/3) = 8/9. Hence A : B = <b>8 : 9</b>. Check: A = 8, B = 9 gives 6 and 6.',
      'Cross-multiplying the wrong way gives 9 : 8.'),
    mk('rp-025', 1, 'mixtures', 'A 35-litre mixture has milk and water in the ratio 4 : 3. How much water is in it?', '15 L', ['20 L', '12 L', '21 L'],
      'One part = 35 ÷ 7 = 5 L. Water = 3 × 5 = <b>15 L</b> (milk is 20 L).'),
    mk('rp-026', 2, 'speed', 'Two trains have speeds in the ratio 3 : 4. What is the ratio of the times they take to cover the same distance?', '4 : 3', ['3 : 4', '9 : 16', '1 : 1'],
      'For a fixed distance, time is inversely proportional to speed, so the times are in the ratio <b>4 : 3</b>. The faster train takes less time.'),
    mk('rp-027', 3, 'ages', 'The present ages of two friends are in the ratio 4 : 5. After 6 years the ratio will be 5 : 6. What is the present age of the elder?', '30', ['24', '25', '36'],
      'Ages 4x and 5x: (4x + 6)/(5x + 6) = 5/6 gives 24x + 36 = 25x + 30, so x = 6. Elder = 5 × 6 = <b>30</b> (younger 24). In 6 years: 30 and 36, ratio 5 : 6.',
      '24 is the younger one\'s age.'),
    mk('rp-028', 1, 'sharing', 'A 91 m rope is cut into two pieces in the ratio 3 : 4. How long is the longer piece?', '52 m', ['39 m', '48 m', '56 m'],
      'One part = 91 ÷ 7 = 13 m. Longer = 4 × 13 = <b>52 m</b>. The other is 39 m.'),
    mk('rp-029', 2, 'sharing', 'Three batters score 225 runs in the ratio 4 : 5 : 6. How many runs did the second batter score?', '75', ['60', '90', '45'],
      'Parts = 15, one part = 225 ÷ 15 = 15 runs. Second batter = 5 × 15 = <b>75</b>. (Others: 60 and 90.)'),
    mk('rp-030', 1, 'proportion', 'If 12 : x = 18 : 27, what is x?', '18', ['12', '24', '20'],
      '18 : 27 simplifies to 2 : 3. So 12 : x = 2 : 3, giving x = 12 × 3 ÷ 2 = <b>18</b>.'),
    mk('rp-031', 2, 'direct', 'A car uses 8 litres of petrol for 120 km. How many litres does it need for 330 km at the same rate?', '22 L', ['20 L', '24 L', '26 L'],
      'Petrol per km = 8 ÷ 120 = 1/15 L. For 330 km: 330 ÷ 15 = <b>22 L</b>.'),
    mk('rp-032', 3, 'sharing', '₹1,750 is shared among A, B and C so that A : B = 2 : 3 and B : C = 4 : 5. What is C\'s share?', '₹750', ['₹600', '₹650', '₹800'],
      'Make B equal: A : B = 8 : 12 and B : C = 12 : 15, so A : B : C = 8 : 12 : 15. Total = 35 parts, one part = 1,750 ÷ 35 = ₹50. C = 15 × 50 = <b>₹750</b> (A gets ₹400, B ₹600).',
      'Using 2 : 3 : 5 (just gluing the ratios) would give C ₹875.'),
  ],
  gens: [
    { id: 'rp-g01', type: 'mcq', level: 1, sub: 'sharing', ...T,
      make(rng) {
        const [a, b] = choose(rng, [[2, 3], [3, 4], [5, 3], [4, 5], [7, 3], [5, 2], [3, 5]]), u = pick(rng, 40, 200, 10), tot = (a + b) * u;
        const small = Math.min(a, b) * u;
        const { options, answer } = shuffleOpts(rng, small, [Math.max(a, b) * u, tot / 2, small + u], (v) => rs(v, 0));
        return { q: `Two friends share ${rs(tot, 0)} in the ratio ${a} : ${b}. What is the smaller share?`, options, answer,
          sol: steps(`Parts = ${a} + ${b} = ${a + b}; one part = ${fmt(tot, 0)} ÷ ${a + b} = ${rs(u, 0)}.`, `Smaller share = ${Math.min(a, b)} × ${u} = <b>${rs(small, 0)}</b>.`),
          trap: `${rs(Math.max(a, b) * u, 0)} is the bigger share.` };
      } },
    { id: 'rp-g02', type: 'mcq', level: 1, sub: 'ages', ...T,
      make(rng) {
        const [a, b] = choose(rng, [[2, 5], [3, 5], [1, 4], [2, 7], [3, 7], [4, 9]]), k = int(rng, 3, 9), S = (a + b) * k;
        const { options, answer } = shuffleOpts(rng, a * k, [b * k, k, a * k + k]);
        return { q: `The ages of a son and his mother are in the ratio ${a} : ${b}. Together they are ${S} years old. How old is the son?`, options, answer,
          sol: steps(`Parts = ${a + b}, one part = ${S} ÷ ${a + b} = ${k} years.`, `Son = ${a} × ${k} = <b>${a * k}</b> years.`),
          trap: `${b * k} is the mother's age.` };
      } },
    { id: 'rp-g03', type: 'mcq', level: 1, sub: 'direct', ...T,
      make(rng) {
        const n1 = choose(rng, [6, 8, 12, 15, 20]), c = choose(rng, [7, 9, 12, 15, 18, 25]), n2 = n1 + choose(rng, [4, 5, 10, 15]);
        const { options, answer } = shuffleOpts(rng, n2 * c, [n2 * c + c, n1 * c + n2, (n2 - 1) * c], (v) => rs(v, 0));
        return { q: `${n1} notebooks cost ${rs(n1 * c, 0)}. What do ${n2} notebooks cost at the same rate?`, options, answer,
          sol: steps(`One notebook = ${fmt(n1 * c, 0)} ÷ ${n1} = ${rs(c, 0)}.`, `${n2} notebooks = ${n2} × ${c} = <b>${rs(n2 * c, 0)}</b>.`) };
      } },
    { id: 'rp-g04', type: 'mcq', level: 2, sub: 'inverse', ...T,
      make(rng) {
        let m1, d, m2;
        do { m1 = choose(rng, [6, 8, 10, 12, 15, 20]); d = choose(rng, [9, 10, 12, 15, 18, 24]); m2 = choose(rng, [4, 5, 6, 9, 10, 12, 15, 18, 20, 30]); } while (m1 === m2 || (m1 * d) % m2);
        const ans = (m1 * d) / m2;
        const { options, answer } = shuffleOpts(rng, ans, [(m2 * d) / m1 + d, m2 * d / 2 + 1, ans + 3], (v) => `${fmt(v, 2)} days`);
        return { q: `${m1} workers can paint a stadium wall in ${d} days. How many days will ${m2} workers take at the same speed?`, options, answer,
          sol: steps(`Total work = ${m1} × ${d} = ${m1 * d} worker-days.`, `Days = ${m1 * d} ÷ ${m2} = <b>${fmt(ans, 2)}</b>.`),
          trap: m2 > m1 ? 'More workers means fewer days, so the answer must be smaller than the original.' : 'Fewer workers means more days, so the answer must be larger than the original.' };
      } },
    { id: 'rp-g05', type: 'mcq', level: 3, sub: 'compound', ...T,
      make(rng) {
        const [p, q] = choose(rng, [[2, 3], [3, 4], [1, 2], [2, 5], [3, 5]]), [r, s] = choose(rng, [[4, 5], [3, 7], [5, 6], [2, 7], [6, 7]]);
        const L = lcm(q, r), A = p * (L / q), B = L, C = s * (L / r), g = gcd(gcd(A, B), C);
        const R = (x, y, z) => `${x} : ${y} : ${z}`;
        const { options, answer } = shuffleOpts(rng, R(A / g, B / g, C / g), [R(p, q, s), R(p, r, s), R(A / g, B / g, C / g + 1), R(A / g + 1, B / g, C / g), R(C / g, B / g, A / g)]);
        return { q: `If A : B = ${p} : ${q} and B : C = ${r} : ${s}, what is A : B : C?`, options, answer,
          sol: steps(`Make B the same: LCM of ${q} and ${r} is ${L}.`, `A : B = ${A} : ${B} and B : C = ${B} : ${C}.`, `So A : B : C = <b>${R(A / g, B / g, C / g)}</b>.`),
          trap: 'The middle term B must be the same number in both ratios before they are joined.' };
      } },
    { id: 'rp-g06', type: 'mcq', level: 2, sub: 'sharing', ...T,
      make(rng) {
        const [a, b, c] = choose(rng, [[2, 3, 5], [1, 2, 3], [3, 4, 5], [2, 3, 4], [1, 3, 6]]), u = int(rng, 6, 30), S = (a + b + c) * u;
        const { options, answer } = shuffleOpts(rng, c * u, [b * u, S / 2, c * u + u], (v) => rs(v, 0));
        return { q: `A prize of ${rs(S, 0)} is divided among three players in the ratio ${a} : ${b} : ${c}. What does the top player get?`, options, answer,
          sol: steps(`Parts = ${a + b + c}, one part = ${fmt(S, 0)} ÷ ${a + b + c} = ${rs(u, 0)}.`, `Top share = ${c} × ${u} = <b>${rs(c * u, 0)}</b>.`) };
      } },
    { id: 'rp-g07', type: 'mcq', level: 2, sub: 'mean proportional', ...T,
      make(rng) {
        const k = choose(rng, [1, 2, 3, 5]), m = int(rng, 1, 4), n = int(rng, m + 1, 8), a = k * m * m, b = k * n * n, mp = k * m * n;
        const { options, answer } = shuffleOpts(rng, mp, [(a + b) / 2, a * b / 10, mp + 2]);
        return { q: `What is the mean proportional between ${a} and ${b}?`, options, answer,
          sol: steps(`Mean proportional = √(a × b) = √(${a} × ${b}) = √${a * b}.`, `√${a * b} = <b>${mp}</b>.`),
          trap: `The average ${(a + b) / 2} is the arithmetic mean, not the mean proportional.` };
      } },
  ],
};

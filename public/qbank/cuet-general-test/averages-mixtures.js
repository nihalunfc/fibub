// CUET General Test: averages, mixtures and alligation. Original questions for fibub. Items are fixed; gens make fresh numbers.
import { pick, int, choose, fmt, rs, shuffleOpts, steps } from './_cuet.js';

const T = { exams: ['cuet'], format: 'single' };
const mcq = (id, level, sub, q, options, answer, sol, trap) => ({ id, type: 'mcq', level, sub, q, options, answer, sol, ...(trap ? { trap } : {}), ...T });
// Puts the right answer at a position that varies with the id number, so it is not always first.
const mk = (id, level, sub, q, right, wrongs, sol, trap) => {
  const k = parseInt(id.slice(-3), 10) % 4, o = [...wrongs]; o.splice(k, 0, right);
  return mcq(id, level, sub, q, o, k, sol, trap);
};

export default {
  topic: 'averages-mixtures',
  items: [
    mk('av-001', 1, 'basics', 'What is the average of 12, 15, 18 and 25?', '17.5', ['17', '18', '16.5'],
      'Sum = 12 + 15 + 18 + 25 = 70. Average = 70 ÷ 4 = <b>17.5</b>.'),
    mk('av-002', 1, 'basics', 'The average of 5 numbers is 24. What is their sum?', '120', ['29', '100', '125'],
      'Sum = average × count = 24 × 5 = <b>120</b>. Always turn an average into a total first.'),
    mk('av-003', 2, 'target', 'A student scored 60, 72 and 68 in three tests. What must she score in the fourth test to have an average of 70?', '80', ['70', '75', '85'],
      'Needed total = 70 × 4 = 280. Scored so far = 60 + 72 + 68 = 200. Fourth test = 280 − 200 = <b>80</b>.',
      'Scoring 70 again does not work: her first three average only 66⅔.'),
    mk('av-004', 2, 'replace', 'The average of 10 numbers is 15. If one number, 25, is replaced by 5, what is the new average?', '13', ['14', '12', '10'],
      'Total = 150. After replacing, total = 150 − 25 + 5 = 130. New average = 130 ÷ 10 = <b>13</b>. Shortcut: the total drops by 20, so the average drops by 20 ÷ 10 = 2.'),
    mk('av-005', 2, 'remove', 'The average age of 5 cricketers is 28 years. When one leaves, the average of the remaining four is 27. How old was the player who left?', '32 years', ['30 years', '28 years', '35 years'],
      'Total of 5 = 28 × 5 = 140. Total of 4 = 27 × 4 = 108. Player who left = 140 − 108 = <b>32 years</b>.'),
    mk('av-006', 2, 'weighted', 'Class A has 30 students with an average mark of 40 and class B has 20 students with an average of 50. What is the combined average?', '44', ['45', '46', '43'],
      'Total marks = 30 × 40 + 20 × 50 = 1,200 + 1,000 = 2,200. Students = 50. Average = <b>44</b>.',
      'The simple average of 40 and 50 (45) ignores that class A is bigger.'),
    mk('av-007', 1, 'basics', 'What is the average of the first 10 natural numbers?', '5.5', ['5', '6', '10'],
      'For 1 to n the average is (n + 1) ÷ 2 = 11 ÷ 2 = <b>5.5</b>.'),
    mk('av-008', 2, 'basics', 'What is the average of the first 10 even natural numbers (2, 4, ..., 20)?', '11', ['10', '12', '10.5'],
      'Average of first n even numbers = n + 1 = <b>11</b>. Or: (2 + 20) ÷ 2 = 11 (average of the first and last in an evenly spaced list).'),
    mk('av-009', 2, 'speed', 'A cyclist rides to a village at 60 km/h and returns along the same road at 40 km/h. What is his average speed for the whole trip?', '48 km/h', ['50 km/h', '52 km/h', '45 km/h'],
      'For equal distances, average speed = 2ab ÷ (a + b) = 2 × 60 × 40 ÷ 100 = <b>48 km/h</b>.',
      'The simple average (50) is wrong because he spends more time at the slower speed.'),
    mk('av-010', 2, 'innings', 'A batter\'s average after 10 innings is 40. He scores 62 in the 11th innings. What is his new average?', '42', ['41', '43', '51'],
      'Total runs so far = 400. New total = 462 in 11 innings. 462 ÷ 11 = <b>42</b>.'),
    mk('av-011', 3, 'innings', 'A batter\'s average after 11 innings was x. His score of 75 in the 12th innings raised the average by 3. What is the new average?', '42', ['39', '45', '36'],
      '12 × (x + 3) = 11x + 75, so x + 36 = 75 and x = 39. New average = 39 + 3 = <b>42</b>. Check: 11 × 39 = 429, plus 75 = 504, and 504 ÷ 12 = 42.',
      '39 is the old average.'),
    mk('av-012', 1, 'weighted', 'A shopkeeper mixes 20 kg of rice at ₹40/kg with 30 kg at ₹50/kg. What is the cost of the mixture per kg?', '₹46', ['₹45', '₹44', '₹47'],
      'Total cost = 20 × 40 + 30 × 50 = 800 + 1,500 = ₹2,300 for 50 kg. Per kg = 2,300 ÷ 50 = <b>₹46</b>.'),
    mk('av-013', 3, 'alligation', 'In what ratio should tea at ₹30/kg and tea at ₹50/kg be mixed to get a mixture worth ₹35/kg?', '3 : 1', ['1 : 3', '2 : 1', '3 : 2'],
      'Alligation: cheaper : dearer = (dearer − mean) : (mean − cheaper) = (50 − 35) : (35 − 30) = 15 : 5 = <b>3 : 1</b>. The mean ₹35 is closer to ₹30, so there is more of the cheaper tea.',
      'Writing the ratio the other way round (1 : 3) is the usual error.'),
    mk('av-014', 3, 'dilution', 'A 50-litre mixture contains 20% water. If 10 litres of water are added, what percent of the new mixture is water?', '33⅓%', ['30%', '25%', '40%'],
      'Water = 20% of 50 = 10 L. After adding 10 L: water = 20 L in 60 L. 20 ÷ 60 = <b>33⅓%</b>.',
      '30% adds 20% + 10 and forgets that the total also grows.'),
    mk('av-015', 3, 'replacement', 'A can holds 40 litres of pure milk. 8 litres are drawn out and replaced with water. What is the ratio of milk to water now?', '4 : 1', ['3 : 1', '5 : 1', '4 : 5'],
      'Milk left = 40 − 8 = 32 L and water = 8 L. Ratio = 32 : 8 = <b>4 : 1</b>.'),
    mk('av-016', 2, 'consecutive', 'The average of five consecutive odd numbers is 17. What is the largest of them?', '21', ['19', '23', '25'],
      'The middle number is the average, 17. The numbers are 13, 15, 17, 19, 21, so the largest is <b>21</b>.'),
    mk('av-017', 2, 'ratio', 'Three numbers are in the ratio 2 : 3 : 4 and their average is 18. What is the largest number?', '24', ['27', '20', '18'],
      'Sum = 18 × 3 = 54. One part = 54 ÷ 9 = 6. Largest = 4 × 6 = <b>24</b>. The numbers are 12, 18, 24.'),
    mk('av-018', 2, 'add', 'The average weight of 8 boys is 50 kg. When a new boy joins, the average rises to 51 kg. What is the new boy\'s weight?', '59 kg', ['51 kg', '56 kg', '60 kg'],
      'New total = 51 × 9 = 459. Old total = 50 × 8 = 400. New boy = 459 − 400 = <b>59 kg</b>. Shortcut: 51 + 8 × 1 = 59.'),
    mk('av-019', 3, 'subsets', 'The average temperature from Monday to Friday was 32 °C and from Monday to Wednesday it was 30 °C. What was the average on Thursday and Friday?', '35 °C', ['34 °C', '36 °C', '33 °C'],
      'Total for 5 days = 160. Total for 3 days = 90. Thursday + Friday = 70, so the average = 70 ÷ 2 = <b>35 °C</b>.'),
    mk('av-020', 3, 'errors', 'The average mark of 30 students was found to be 55. Later it was found that a mark of 85 had been entered as 100. What is the correct average?', '54.5', ['55.5', '54', '53'],
      'The total was too high by 100 − 85 = 15. Correct total = 55 × 30 − 15 = 1,635. 1,635 ÷ 30 = <b>54.5</b>. Shortcut: 15 ÷ 30 = 0.5 less.',
      'Adding the error instead of subtracting it gives 55.5.'),
    mk('av-021', 1, 'missing', 'The average of 4, 7, 9, x and 15 is 9. What is x?', '10', ['8', '9', '12'],
      'Total = 9 × 5 = 45. Known numbers add to 4 + 7 + 9 + 15 = 35. So x = 45 − 35 = <b>10</b>.'),
    mk('av-022', 2, 'median', 'What is the median of 3, 9, 4, 15 and 7?', '7', ['4', '9', '7.6'],
      'Arrange in order: 3, 4, 7, 9, 15. The middle (3rd) number is <b>7</b>. The mean is 38 ÷ 5 = 7.6, which is a different thing.',
      'Median needs the numbers sorted first; 4 is the middle one in the given order.'),
    mk('av-023', 3, 'alligation', 'In what ratio must water be added to milk costing ₹60 per litre so that the mixture is worth ₹48 per litre?', '1 : 4', ['4 : 1', '1 : 5', '1 : 3'],
      'Water costs 0. Alligation: water : milk = (60 − 48) : (48 − 0) = 12 : 48 = <b>1 : 4</b>. Check: 1 L water + 4 L milk costs 240 for 5 L = ₹48/L.'),
    mk('av-024', 2, 'weighted', 'Two kinds of tea, ₹200 per kg and ₹300 per kg, are mixed in the ratio 3 : 2. What is the price of the mixture per kg?', '₹240', ['₹250', '₹260', '₹230'],
      'Cost of 5 kg = 3 × 200 + 2 × 300 = 600 + 600 = ₹1,200. Per kg = 1,200 ÷ 5 = <b>₹240</b>.',
      '₹250 is the simple average and ignores the 3 : 2 weights.'),
    mk('av-025', 3, 'dilution', 'How much water must be added to 20 litres of a 40% acid solution to make it a 25% solution?', '12 L', ['8 L', '10 L', '16 L'],
      'Acid = 40% of 20 = 8 L, which stays the same. For 25%: total = 8 ÷ 0.25 = 32 L. Water to add = 32 − 20 = <b>12 L</b>.',
      '8 L is the amount of acid, not water.'),
    mk('av-026', 2, 'combine', 'The average of 6 numbers is 8, and the average of 2 other numbers is 14. What is the average of all 8 numbers?', '9.5', ['11', '10', '9'],
      'Total = 6 × 8 + 2 × 14 = 48 + 28 = 76. Average = 76 ÷ 8 = <b>9.5</b>.',
      'Averaging 8 and 14 (= 11) forgets there are 6 numbers in one group and only 2 in the other.'),
    mk('av-027', 1, 'basics', 'What is the average of the first 50 natural numbers?', '25.5', ['25', '26', '24.5'],
      '(1 + 50) ÷ 2 = <b>25.5</b>. The average of an evenly spaced list is the average of its first and last terms.'),
    mk('av-028', 2, 'innings', 'A cricketer\'s average after 8 innings is 45. How many runs must he score in the 9th innings to make his average 50?', '90', ['95', '80', '100'],
      'Needed total = 50 × 9 = 450. Total so far = 45 × 8 = 360. So he needs 450 − 360 = <b>90</b>. Shortcut: 50 + 8 × 5 = 90.'),
    mk('av-029', 1, 'consecutive', 'The average of three consecutive even numbers is 14. What is the largest?', '16', ['14', '18', '12'],
      'The middle number is the average, 14. The numbers are 12, 14, 16, so the largest is <b>16</b>.'),
    mk('av-030', 3, 'transform', 'The mean of 20 numbers is 15. Each number is multiplied by 3 and then 2 is added. What is the new mean?', '47', ['45', '50', '17'],
      'The mean undergoes the same operations: 15 × 3 + 2 = <b>47</b>.',
      'Adding 2 first and then multiplying (51) changes the order of the operations.'),
    mk('av-031', 2, 'weighted', 'Maths has weight 3 and English weight 2 in a final score. Meena gets 80 in Maths and 70 in English. What is her weighted average?', '76', ['75', '77', '78'],
      'Weighted average = (3 × 80 + 2 × 70) ÷ 5 = (240 + 140) ÷ 5 = 380 ÷ 5 = <b>76</b>.',
      'The simple average, 75, ignores the weights.'),
    mk('av-032', 3, 'mixtures', 'Vessel A holds 8 L of milk and water in the ratio 3 : 1. Vessel B holds 12 L in the ratio 1 : 1. Both are poured into one jar. What is the ratio of milk to water?', '3 : 2', ['2 : 3', '4 : 3', '5 : 3'],
      'A: milk 6 L, water 2 L. B: milk 6 L, water 6 L. Together: milk 12 L, water 8 L. Ratio 12 : 8 = <b>3 : 2</b>.'),
  ],
  gens: [
    { id: 'av-g01', type: 'mcq', level: 2, sub: 'target', ...T,
      make(rng) {
        const n = int(rng, 3, 5), tgt = int(rng, 60, 85);
        const scores = Array.from({ length: n }, () => tgt + int(rng, -10, 10));
        const need = tgt * (n + 1) - scores.reduce((a, b) => a + b, 0);
        const { options, answer } = shuffleOpts(rng, need, [tgt, need + 5, need - 5]);
        return { q: `A batter scored ${scores.join(', ')} in ${n} matches. How many must he score in the next match to have an average of ${tgt}?`, options, answer,
          sol: steps(`Needed total for ${n + 1} matches = ${tgt} × ${n + 1} = ${tgt * (n + 1)}.`, `Scored so far = ${scores.reduce((a, b) => a + b, 0)}.`, `Next score = <b>${need}</b>.`),
          trap: `Scoring exactly ${tgt} only works if the earlier scores already average ${tgt}.` };
      } },
    { id: 'av-g02', type: 'mcq', level: 2, sub: 'weighted', ...T,
      make(rng) {
        let n1, n2, a1, a2, avg;
        do { n1 = int(rng, 10, 40); n2 = int(rng, 10, 40); a1 = int(rng, 30, 70); a2 = int(rng, 30, 70); avg = (n1 * a1 + n2 * a2) / (n1 + n2); } while (!Number.isInteger(avg) || a1 === a2);
        const { options, answer } = shuffleOpts(rng, avg, [(a1 + a2) / 2, avg + 1, avg - 1]);
        return { q: `Section A has ${n1} students with an average of ${a1} marks. Section B has ${n2} students with an average of ${a2}. What is the combined average?`, options, answer,
          sol: steps(`Total marks = ${n1} × ${a1} + ${n2} × ${a2} = ${n1 * a1 + n2 * a2}.`, `Students = ${n1 + n2}. Average = <b>${avg}</b>.`),
          trap: `Averaging ${a1} and ${a2} directly ignores the different class sizes.` };
      } },
    { id: 'av-g03', type: 'mcq', level: 2, sub: 'replace', ...T,
      make(rng) {
        const n = choose(rng, [5, 8, 10, 12, 20]), avg = int(rng, 20, 60), d = int(rng, 1, 3), out = n * d + int(rng, 5, 20), inn = out - n * d;
        const nu = avg + (inn - out) / n;
        const { options, answer } = shuffleOpts(rng, nu, [avg, nu + 1, avg + (out - inn) / n], (v) => fmt(v, 2));
        return { q: `The average of ${n} numbers is ${avg}. If the number ${out} is replaced by ${inn}, what is the new average?`, options, answer,
          sol: steps(`Old total = ${avg} × ${n} = ${avg * n}.`, `New total = ${avg * n} − ${out} + ${inn} = ${avg * n - out + inn}.`, `New average = ${avg * n - out + inn} ÷ ${n} = <b>${fmt(nu, 2)}</b>.`),
          trap: 'When the replacement is smaller the average must go down.' };
      } },
    { id: 'av-g04', type: 'mcq', level: 3, sub: 'alligation', ...T,
      make(rng) {
        let c1, c2, p, q, m;
        do { c1 = int(rng, 2, 6) * 10; c2 = c1 + choose(rng, [20, 30, 40]); [p, q] = choose(rng, [[1, 2], [2, 1], [1, 3], [3, 1], [2, 3], [3, 2]]); m = (p * c1 + q * c2) / (p + q); } while (!Number.isInteger(m));
        const R = (a, b) => `${a} : ${b}`;
        const { options, answer } = shuffleOpts(rng, R(p, q), [R(q, p), R(p + 1, q), R(p, q + 1)]);
        return { q: `In what ratio must rice at ${rs(c1, 0)}/kg be mixed with rice at ${rs(c2, 0)}/kg to get a mixture worth ${rs(m, 0)}/kg?`, options, answer,
          sol: steps(`Cheaper : dearer = (${c2} − ${m}) : (${m} − ${c1}) = ${c2 - m} : ${m - c1}.`, `Simplified: <b>${R(p, q)}</b>.`),
          trap: 'The cheaper quantity goes with the gap on the dearer side (cross subtraction).' };
      } },
    { id: 'av-g05', type: 'mcq', level: 2, sub: 'innings', ...T,
      make(rng) {
        const n = int(rng, 6, 15), a = int(rng, 30, 55), d = int(rng, 1, 4), s = a + (n + 1) * d, nu = a + d;
        const { options, answer } = shuffleOpts(rng, nu, [a, nu + 1, (a + s) / 2], (v) => fmt(v, 2));
        return { q: `A batter has an average of ${a} after ${n} innings. He scores ${s} in his next innings. What is his new average?`, options, answer,
          sol: steps(`Runs so far = ${a} × ${n} = ${a * n}.`, `New total = ${a * n} + ${s} = ${a * n + s} in ${n + 1} innings.`, `New average = <b>${nu}</b>.`),
          trap: `Averaging ${a} and ${s} ignores the ${n} earlier innings.` };
      } },
    { id: 'av-g06', type: 'mcq', level: 3, sub: 'dilution', ...T,
      make(rng) {
        const [V, c, c2] = choose(rng, [[20, 40, 25], [30, 20, 15], [40, 30, 20], [24, 50, 40], [50, 36, 30]]), tot = (V * c) / c2, w = tot - V;
        const { options, answer } = shuffleOpts(rng, w, [(V * c) / 100, tot, w + 2], (v) => `${fmt(v, 2)} L`);
        return { q: `How much water must be added to ${V} litres of a ${c}% salt solution to make it a ${c2}% solution?`, options, answer,
          sol: steps(`Salt = ${c}% of ${V} = ${fmt((V * c) / 100, 2)} L and stays the same.`, `New total = ${fmt((V * c) / 100, 2)} ÷ ${c2 / 100} = ${fmt(tot, 2)} L.`, `Water added = ${fmt(tot, 2)} − ${V} = <b>${fmt(w, 2)} L</b>.`),
          trap: 'The new total volume (not the amount of salt) is the answer to a different question.' };
      } },
    { id: 'av-g07', type: 'mcq', level: 1, sub: 'consecutive', ...T,
      make(rng) {
        const n = choose(rng, [5, 7]), m = int(rng, 6, 30) * 2, big = m + (n - 1);
        const { options, answer } = shuffleOpts(rng, big, [m, big + 2, m + n]);
        return { q: `The average of ${n} consecutive even numbers is ${m}. What is the largest of them?`, options, answer,
          sol: steps(`The middle number is the average, ${m}.`, `Going up ${(n - 1) / 2} steps of 2 gives ${m} + ${n - 1} = <b>${big}</b>.`) };
      } },
  ],
};

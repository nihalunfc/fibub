// CUET General Test: data interpretation (tables). Original questions and made-up data for fibub. Items are fixed; gens make fresh numbers.
import { pick, int, choose, fmt, rs, shuffleOpts, steps } from './_cuet.js';

const T = { exams: ['cuet'], format: 'single' };
const mcq = (id, level, sub, q, options, answer, sol, trap) => ({ id, type: 'mcq', level, sub, q, options, answer, sol, ...(trap ? { trap } : {}), ...T });
// Puts the right answer at a position that varies with the id number, so it is not always first.
const mk = (id, level, sub, q, right, wrongs, sol, trap) => {
  const k = parseInt(id.slice(-3), 10) % 4, o = [...wrongs]; o.splice(k, 0, right);
  return mcq(id, level, sub, q, o, k, sol, trap);
};
// A question that belongs to a table (group).
const dq = (group, ...a) => ({ ...mk(...a), group, format: 'passage' });
const table = (head, rows) => '<table><thead><tr>' + head.map((h) => `<th>${h}</th>`).join('') + '</tr></thead><tbody>'
  + rows.map((r) => '<tr>' + r.map((c, i) => (i ? `<td>${c}</td>` : `<th scope="row">${c}</th>`)).join('') + '</tr>').join('') + '</tbody></table>';

export default {
  topic: 'data-interpretation',
  groups: {
    g1: { title: 'Mobile phones sold by a shop', passage: '<p>The table shows the number of phones of three brands sold by a shop in six months.</p>'
      + table(['Brand', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], [['A', 40, 55, 45, 60, 50, 70], ['B', 30, 35, 50, 40, 45, 60], ['C', 20, 25, 30, 35, 40, 50]]) },
    g2: { title: 'Marks of five students', passage: '<p>Marks (out of 100) of five students in four subjects.</p>'
      + table(['Student', 'Maths', 'Science', 'English', 'Hindi'], [['Anil', 80, 70, 60, 90], ['Bina', 75, 85, 70, 80], ['Chetan', 90, 60, 65, 85], ['Divya', 60, 95, 80, 75], ['Eka', 70, 80, 75, 95]]) },
    g3: { title: 'Crop production in a state', passage: '<p>Production of wheat and rice (in lakh tonnes) in a state over five years.</p>'
      + table(['Crop', '2019', '2020', '2021', '2022', '2023'], [['Wheat', 120, 135, 150, 144, 168], ['Rice', 90, 100, 110, 132, 118]]) },
    g4: { title: 'A family\'s monthly budget', passage: '<p>A family earns ₹60,000 a month and spends it as shown.</p>'
      + table(['Item', 'Share of income'], [['Rent', '25%'], ['Food', '30%'], ['Education', '15%'], ['Transport', '10%'], ['Savings', '20%']]) },
    g5: { title: 'Runs scored in three matches', passage: '<p>Runs scored by five batters in three matches of a series.</p>'
      + table(['Batter', 'Match 1', 'Match 2', 'Match 3'], [['Rohan', 45, 60, 75], ['Sunil', 30, 90, 45], ['Tarun', 50, 40, 80], ['Umesh', 25, 35, 40], ['Vijay', 70, 55, 35]]) },
    g6: { title: 'Students in a school', passage: '<p>Number of boys and girls in classes 6 to 10 of a school.</p>'
      + table(['', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'], [['Boys', 60, 72, 80, 90, 100], ['Girls', 40, 48, 60, 70, 80]]) },
    g7: { title: 'Monsoon rainfall', passage: '<p>Rainfall (in mm) recorded in a city in five months of one monsoon.</p>'
      + table(['Month', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'], [['Rainfall (mm)', 200, 320, 280, 160, 40]]) },
  },
  items: [
    dq('g1', 'di-001', 1, 'totals', 'What was the total number of Brand A phones sold in the six months?', '320', ['300', '310', '260'],
      '40 + 55 + 45 + 60 + 50 + 70 = <b>320</b>. Add in pairs: (40 + 60) + (55 + 45) + (50 + 70) = 100 + 100 + 120.'),
    dq('g1', 'di-002', 1, 'reading', 'In which month was the total number of phones sold (all brands) the highest?', 'June', ['April', 'May', 'March'],
      'Monthly totals: Jan 90, Feb 115, Mar 125, Apr 135, May 135, Jun 180. The highest is <b>June</b> (180).',
      'April and May tie, but both are lower than June.'),
    dq('g1', 'di-003', 2, 'percent change', 'By what percent did the sales of Brand C increase from January to June?', '150%', ['60%', '30%', '250%'],
      'Increase = 50 − 20 = 30. Percent = 30 ÷ 20 × 100 = <b>150%</b> (divide by the January value).',
      '60% comes from dividing by the June value (30 ÷ 50).'),
    dq('g1', 'di-004', 2, 'ratio', 'What is the ratio of Brand A to Brand C sales in April?', '12 : 7', ['7 : 12', '60 : 40', '3 : 2'],
      'April: A = 60 and C = 35. 60 : 35 = 12 : 7 (divide by 5). So <b>12 : 7</b>.'),
    dq('g1', 'di-005', 2, 'share', 'What percent of all phones sold in March were Brand A?', '36%', ['40%', '45%', '30%'],
      'March total = 45 + 50 + 30 = 125. Brand A share = 45 ÷ 125 × 100 = <b>36%</b>. (45 ÷ 125 = 0.36, since 125 × 8 = 1,000.)'),
    dq('g2', 'di-006', 1, 'totals', 'Who scored the highest total marks in the four subjects?', 'Eka', ['Bina', 'Divya', 'Anil'],
      'Totals: Anil 300, Bina 310, Chetan 300, Divya 310, Eka 320. The highest is <b>Eka</b>.',
      'Bina and Divya tie at 310, but Eka is higher.'),
    dq('g2', 'di-007', 1, 'average', 'What is the class average in Maths?', '75', ['70', '78', '80'],
      'Maths marks: 80 + 75 + 90 + 60 + 70 = 375. Average = 375 ÷ 5 = <b>75</b>.'),
    dq('g2', 'di-008', 2, 'percent', 'What percentage of the total possible marks did Bina get?', '77.5%', ['75%', '78%', '80%'],
      'Bina\'s total = 75 + 85 + 70 + 80 = 310 out of 400. 310 ÷ 400 × 100 = <b>77.5%</b>.',
      'The total possible is 4 × 100 = 400, not 500.'),
    dq('g2', 'di-009', 2, 'average', 'In which subject is the class average the highest, and what is it?', 'Hindi, 85', ['Science, 78', 'Maths, 75', 'English, 70'],
      'Averages: Maths 375 ÷ 5 = 75; Science 390 ÷ 5 = 78; English 350 ÷ 5 = 70; Hindi 425 ÷ 5 = 85. Highest: <b>Hindi, 85</b>.'),
    dq('g2', 'di-010', 2, 'counting', 'How many students scored more than 75 in Science?', '3', ['2', '4', '5'],
      'Science marks: Anil 70, Bina 85, Chetan 60, Divya 95, Eka 80. More than 75: Bina, Divya, Eka = <b>3</b> students.',
      'Anil with 70 is not above 75.'),
    dq('g3', 'di-011', 2, 'percent change', 'By what percent did wheat production grow from 2019 to 2021?', '25%', ['30%', '20%', '15%'],
      'Increase = 150 − 120 = 30. 30 ÷ 120 × 100 = <b>25%</b>.'),
    dq('g3', 'di-012', 1, 'totals', 'In which year was the total production of wheat and rice the highest?', '2023', ['2022', '2021', '2020'],
      'Totals: 2019 = 210, 2020 = 235, 2021 = 260, 2022 = 276, 2023 = 286. The highest is <b>2023</b>.'),
    dq('g3', 'di-013', 2, 'percent change', 'By what percent did wheat production fall from 2021 to 2022?', '4%', ['6%', '4.17%', '2%'],
      'Fall = 150 − 144 = 6. 6 ÷ 150 × 100 = <b>4%</b>.',
      '6% is the fall in lakh tonnes, not a percent. 4.17% divides by the new value (6 ÷ 144).'),
    dq('g3', 'di-014', 2, 'ratio', 'What is the ratio of rice production in 2022 to rice production in 2019?', '22 : 15', ['15 : 22', '132 : 100', '11 : 5'],
      '132 : 90. The HCF is 6, so 22 : 15. The answer is <b>22 : 15</b>.'),
    dq('g3', 'di-015', 2, 'average', 'What is the average yearly production of rice over the five years?', '110 lakh tonnes', ['108 lakh tonnes', '112 lakh tonnes', '115 lakh tonnes'],
      'Sum = 90 + 100 + 110 + 132 + 118 = 550. Average = 550 ÷ 5 = <b>110 lakh tonnes</b>.'),
    dq('g4', 'di-016', 1, 'amount', 'How much does the family spend on food each month?', '₹18,000', ['₹15,000', '₹12,000', '₹30,000'],
      '30% of 60,000 = 0.3 × 60,000 = <b>₹18,000</b>. (10% is ₹6,000, so 30% is 3 × 6,000.)'),
    dq('g4', 'di-017', 2, 'difference', 'How much more does the family spend on rent than on education?', '₹6,000', ['₹10,000', '₹9,000', '₹15,000'],
      'Difference = 25% − 15% = 10% of 60,000 = <b>₹6,000</b>.',
      '10 is the difference in percent points, not in rupees.'),
    dq('g4', 'di-018', 2, 'amount', 'How much does the family save in 6 months?', '₹72,000', ['₹12,000', '₹60,000', '₹7,200'],
      'Monthly savings = 20% of 60,000 = ₹12,000. In 6 months: 12,000 × 6 = <b>₹72,000</b>.'),
    dq('g4', 'di-019', 2, 'ratio', 'What is the ratio of the money spent on education to the money spent on transport?', '3 : 2', ['2 : 3', '5 : 3', '15 : 100'],
      'Education 15% and transport 10%, so 15 : 10 = <b>3 : 2</b>. The income cancels out.'),
    dq('g4', 'di-020', 3, 'what if', 'Next year the family\'s income rises by 10% and the percentages stay the same. How much will it save each month?', '₹13,200', ['₹12,000', '₹12,200', '₹14,400'],
      'New income = 60,000 × 1.1 = ₹66,000. Savings = 20% of 66,000 = <b>₹13,200</b>. (Or savings also rise by 10%: 12,000 × 1.1.)',
      'Forgetting the income increase leaves the savings at ₹12,000.'),
    dq('g5', 'di-021', 1, 'totals', 'Which batter scored the most runs in the three matches together?', 'Rohan', ['Sunil', 'Tarun', 'Vijay'],
      'Totals: Rohan 180, Sunil 165, Tarun 170, Umesh 100, Vijay 160. The most is <b>Rohan</b> (180).'),
    dq('g5', 'di-022', 1, 'totals', 'What was the total number of runs scored by these five batters in Match 2?', '280', ['275', '220', '290'],
      '60 + 90 + 40 + 35 + 55 = <b>280</b>.',
      '220 is the Match 1 total and 275 is the Match 3 total.'),
    dq('g5', 'di-023', 2, 'percent change', 'By what percent did Rohan\'s score rise from Match 1 to Match 3?', '66⅔%', ['30%', '40%', '60%'],
      'Rise = 75 − 45 = 30. 30 ÷ 45 × 100 = <b>66⅔%</b>.',
      '30 is the rise in runs; a percent needs dividing by the old score (45).'),
    dq('g5', 'di-024', 2, 'average', 'What was Rohan\'s average score per match?', '60', ['55', '65', '75'],
      '(45 + 60 + 75) ÷ 3 = 180 ÷ 3 = <b>60</b>.'),
    dq('g5', 'di-025', 2, 'comparison', 'In how many of the three matches did Vijay score more than Tarun?', '2', ['1', '3', '0'],
      'Match 1: 70 &gt; 50 yes. Match 2: 55 &gt; 40 yes. Match 3: 35 &lt; 80 no. So <b>2</b> matches.'),
    dq('g6', 'di-026', 1, 'totals', 'How many students are there in Class 8?', '140', ['120', '160', '80'],
      '80 boys + 60 girls = <b>140</b>.'),
    dq('g6', 'di-027', 1, 'ratio', 'What is the ratio of boys to girls in Class 7?', '3 : 2', ['2 : 3', '5 : 3', '72 : 120'],
      '72 : 48. Divide by 24: <b>3 : 2</b>.'),
    dq('g6', 'di-028', 2, 'percent', 'What percent of the students in Class 7 are girls?', '40%', ['48%', '60%', '33⅓%'],
      'Class 7 total = 72 + 48 = 120. Girls = 48 ÷ 120 × 100 = <b>40%</b>.',
      '60% is the share of boys.'),
    dq('g6', 'di-029', 3, 'difference', 'In all five classes together, how many more boys than girls are there?', '104', ['402', '298', '100'],
      'Boys = 60 + 72 + 80 + 90 + 100 = 402. Girls = 40 + 48 + 60 + 70 + 80 = 298. Difference = 402 − 298 = <b>104</b>.',
      '402 and 298 are the individual totals; the question asks for the difference.'),
    dq('g6', 'di-030', 2, 'percent change', 'By what percent did the total strength increase from Class 6 to Class 10?', '80%', ['44%', '100%', '180%'],
      'Class 6 total = 100 and Class 10 total = 180. Increase = 80, so 80 ÷ 100 × 100 = <b>80%</b>.'),
    dq('g7', 'di-031', 1, 'average', 'What is the average monthly rainfall over the five months?', '200 mm', ['180 mm', '320 mm', '250 mm'],
      'Total = 200 + 320 + 280 + 160 + 40 = 1,000 mm. Average = 1,000 ÷ 5 = <b>200 mm</b>.'),
    dq('g7', 'di-032', 2, 'percent', 'What percent of the total rainfall fell in July?', '32%', ['30%', '35%', '40%'],
      '320 ÷ 1,000 × 100 = <b>32%</b>.'),
    dq('g7', 'di-033', 2, 'counting', 'In how many months was the rainfall above the five-month average?', '2', ['1', '3', '4'],
      'The average is 200 mm. Above it: July (320) and August (280). June is exactly 200, not above. So <b>2</b> months.',
      'June equals the average; it is not above it.'),
    dq('g7', 'di-034', 2, 'percent change', 'By what percent did the rainfall fall from September to October?', '75%', ['25%', '120%', '80%'],
      'Fall = 160 − 40 = 120. 120 ÷ 160 × 100 = <b>75%</b>.',
      '25% is October as a share of September (40 ÷ 160), not the fall.'),
    dq('g7', 'di-035', 3, 'percent', 'The rainfall in July and August together is what percent of the rainfall in June to October?', '60%', ['50%', '56%', '64%'],
      'July + August = 320 + 280 = 600 mm. The total for the five months is 1,000 mm. 600 ÷ 1,000 × 100 = <b>60%</b>.'),
  ],
  gens: [
    { id: 'di-g01', type: 'mcq', level: 2, sub: 'percent change', ...T,
      make(rng) {
        const a = pick(rng, 200, 800, 100), p = choose(rng, [10, 20, 25, 30, 40, 50]), b = a * (1 + p / 100);
        const { options, answer } = shuffleOpts(rng, p, [+(((b - a) / b) * 100).toFixed(2), p + 5, p - 5], (v) => `${fmt(v, 2)}%`);
        return { q: `The table shows a factory's output.${table(['Year', '2022', '2023'], [['Output (units)', fmt(a, 0), fmt(b, 0)]])}By what percent did the output grow from 2022 to 2023?`, options, answer,
          sol: steps(`Growth = ${fmt(b, 0)} − ${fmt(a, 0)} = ${fmt(b - a, 0)}.`, `Percent = ${fmt(b - a, 0)} ÷ ${fmt(a, 0)} × 100 = <b>${p}%</b>.`),
          trap: `Dividing by the new value gives ${fmt(((b - a) / b) * 100, 2)}%.` };
      } },
    { id: 'di-g02', type: 'mcq', level: 1, sub: 'average', ...T,
      make(rng) {
        const vals = Array.from({ length: 5 }, () => int(rng, 20, 90)), s = vals.reduce((x, y) => x + y, 0), pad = (5 - (s % 5)) % 5;
        vals[4] += pad;
        const tot = vals.reduce((x, y) => x + y, 0), avg = tot / 5;
        const { options, answer } = shuffleOpts(rng, avg, [avg + 2, avg - 3, Math.max(...vals)]);
        return { q: `Runs scored by a batter in five matches.${table(['Match', '1', '2', '3', '4', '5'], [['Runs', ...vals]])}What is the average score per match?`, options, answer,
          sol: steps(`Total = ${vals.join(' + ')} = ${tot}.`, `Average = ${tot} ÷ 5 = <b>${avg}</b>.`),
          trap: 'Divide the total by the number of matches (5), not by the highest score.' };
      } },
    { id: 'di-g03', type: 'mcq', level: 2, sub: 'share', ...T,
      make(rng) {
        const p = choose(rng, [10, 20, 25, 40, 50]), tot = choose(rng, [200, 400, 500, 800, 1000]), a = tot * p / 100, b = tot - a;
        const { options, answer } = shuffleOpts(rng, p, [100 - p, p + 5, +(a / b * 100).toFixed(2)], (v) => `${fmt(v, 2)}%`);
        return { q: `A school has ${fmt(tot, 0)} students.${table(['Group', 'Students'], [['Takes the bus', fmt(a, 0)], ['Walks or cycles', fmt(b, 0)]])}What percent of the students take the bus?`, options, answer,
          sol: steps(`Total students = ${fmt(tot, 0)}.`, `Share = ${fmt(a, 0)} ÷ ${fmt(tot, 0)} × 100 = <b>${p}%</b>.`),
          trap: `Comparing the bus group with the other group (${fmt((a / b) * 100, 2)}%) is not the share of all students.` };
      } },
    { id: 'di-g04', type: 'mcq', level: 2, sub: 'amount', ...T,
      make(rng) {
        const inc = pick(rng, 40000, 100000, 10000), p = choose(rng, [10, 15, 20, 25, 30]), amt = inc * p / 100, q2 = choose(rng, [5, 10, 15]);
        const amt2 = inc * q2 / 100;
        const { options, answer } = shuffleOpts(rng, amt - amt2, [amt + amt2, amt, inc * (p - q2)], (v) => rs(v, 0));
        return { q: `A family with a monthly income of ${rs(inc, 0)} spends its money as shown.${table(['Item', 'Share'], [['Rent', `${p}%`], ['Travel', `${q2}%`], ['Other', `${100 - p - q2}%`]])}How much more is spent on rent than on travel?`, options, answer,
          sol: steps(`Difference in share = ${p}% − ${q2}% = ${p - q2}%.`, `${p - q2}% of ${fmt(inc, 0)} = <b>${rs(amt - amt2, 0)}</b>.`),
          trap: 'Multiply the percent difference by the income; the percent itself is not an amount.' };
      } },
    { id: 'di-g05', type: 'mcq', level: 2, sub: 'ratio', ...T,
      make(rng) {
        const [a, b] = choose(rng, [[2, 3], [3, 4], [4, 5], [2, 5], [3, 7], [5, 6]]), k = int(rng, 20, 60) * 2;
        const R = (x, y) => `${x} : ${y}`;
        const { options, answer } = shuffleOpts(rng, R(a, b), [R(b, a), R(a, a + b), R(a + 1, b)]);
        return { q: `Wheat and rice sold by a store (tonnes).${table(['Grain', 'Tonnes'], [['Wheat', a * k], ['Rice', b * k]])}What is the ratio of wheat to rice sold, in its simplest form?`, options, answer,
          sol: steps(`Ratio = ${a * k} : ${b * k}.`, `Divide both by ${k}: <b>${R(a, b)}</b>.`),
          trap: 'Keep the order asked for: wheat first, then rice.' };
      } },
    { id: 'di-g06', type: 'mcq', level: 3, sub: 'angle', ...T,
      make(rng) {
        const p = choose(rng, [5, 10, 15, 20, 25, 30, 40]), ang = 3.6 * p;
        const { options, answer } = shuffleOpts(rng, ang, [p, 360 - ang, 3 * p], (v) => `${fmt(v, 1)}°`);
        return { q: `In a pie chart of a state's budget, the share for education is ${p}%. What is the central angle of its sector?`, options, answer,
          sol: steps('The whole circle is 360° and stands for 100%, so 1% = 3.6°.', `${p}% = ${p} × 3.6 = <b>${fmt(ang, 1)}°</b>.`),
          trap: 'Do not read the percent as degrees; 100% is 360°.' };
      } },
    { id: 'di-g07', type: 'mcq', level: 3, sub: 'percent more', ...T,
      make(rng) {
        const [a, b] = choose(rng, [[60, 50], [90, 75], [120, 100], [75, 60], [45, 36], [150, 120], [72, 60]]), more = +(((a - b) / b) * 100).toFixed(2), less = +(((a - b) / a) * 100).toFixed(2);
        const { options, answer } = shuffleOpts(rng, more, [less, a - b, more + 5], (v) => `${fmt(v, 2)}%`);
        return { q: `Sales in March were ${a} units and in February ${b} units.${table(['Month', 'Feb', 'Mar'], [['Units sold', b, a]])}March sales were what percent more than February sales?`, options, answer,
          sol: steps(`Difference = ${a} − ${b} = ${a - b}.`, `"More than February" means dividing by February: ${a - b} ÷ ${b} × 100 = <b>${fmt(more, 2)}%</b>.`),
          trap: `${fmt(less, 2)}% divides by March and answers a different question (February is that much less than March).` };
      } },
  ],
};

import { int, choose, fmt, numOpts, steps } from './_q.js';
const E = ['gmat', 'gre'];
export default {
  topic: 'averages',
  items: [
    { id: 'av-001', type: 'mcq', level: 1, exams: E, sub: 'missing value',
      q: '<p>The average of four numbers is 15. Three of them are 10, 12 and 20. What is the fourth?</p>', options: ['13', '15', '18', '20', '42'], answer: 2,
      sol: '<p>The four numbers add to 4 × 15 = 60. The three known ones add to 42, so the fourth is 60 − 42 = 18.</p>' },
    { id: 'av-002', type: 'mcq', level: 2, exams: E, sub: 'weighted',
      q: '<p>A class of 20 students averaged 70 on a test and another class of 30 students averaged 80. What was the average of all 50 students?</p>', options: ['74', '75', '76', '77', '78'], answer: 2,
      sol: '<p>Total points: 20 × 70 + 30 × 80 = 1,400 + 2,400 = 3,800. 3,800 ÷ 50 = 76. The bigger class pulls the average toward 80.</p>', trap: 'The plain average of 70 and 80 (75) ignores the class sizes.' },
    { id: 'av-003', type: 'mcq', level: 3, exams: E, sub: 'evenly spaced',
      q: '<p>What is the average of all the multiples of 7 from 14 to 140, inclusive?</p>', options: ['70', '73.5', '77', '80.5', '84'], answer: 2,
      sol: '<p>For evenly spaced numbers the average is the average of the first and last: (14 + 140) ÷ 2 = 77.</p>' },
  ],
  gens: [
    { id: 'av-g01', type: 'mcq', level: 1, exams: E, sub: 'missing value', title: 'score needed on the last test',
      make(r) {
        const n = int(r, 3, 6), scores = Array.from({ length: n }, () => int(r, 62, 95)), target = int(r, 75, 88), sum = scores.reduce((a, b) => a + b, 0), value = target * (n + 1) - sum;
        if (value > 100 || value < 40) return this.make(r);
        return { q: `<p>A student's first ${n} test scores are ${scores.join(', ')}. What must she score on the next test to make her average for all ${n + 1} tests exactly ${target}?</p>`, ...numOpts(r, value, [target * n - sum + target, Math.round(sum / n), target]), value, scores, target,
          hint: `An average of ${target} over ${n + 1} tests means a total of ${target} × ${n + 1}.`,
          sol: steps(`Total needed: ${target} × ${n + 1} = ${target * (n + 1)}.`, `Total so far: ${scores.join(' + ')} = ${sum}.`, `Needed: ${target * (n + 1)} − ${sum} = <b>${value}</b>.`) };
      }, check: (p) => p.target * (p.scores.length + 1) - p.scores.reduce((a, b) => a + b, 0) },
    { id: 'av-g02', type: 'mcq', level: 2, exams: E, sub: 'weighted', title: 'weighted average of two groups',
      make(r) {
        const n1 = int(r, 2, 12) * 5, n2 = int(r, 2, 12) * 5, a1 = int(r, 50, 75), a2 = a1 + int(r, 5, 25), value = (n1 * a1 + n2 * a2) / (n1 + n2);
        return { q: `<p>A company has ${n1} part-time staff earning an average of &#36;${a1} a day and ${n2} full-time staff earning an average of &#36;${a2} a day. What is the average daily pay of all the staff, in dollars?</p>`, ...numOpts(r, value, [(a1 + a2) / 2, (n1 * a2 + n2 * a1) / (n1 + n2), a2 - a1].map((x) => +x.toFixed(2))), value, n1, n2, a1, a2,
          hint: 'Find the total pay of each group, add, and divide by the total number of people.',
          sol: steps(`Totals: ${n1} × ${a1} = ${n1 * a1} and ${n2} × ${a2} = ${n2 * a2}.`, `All staff: ${n1 * a1 + n2 * a2} ÷ ${n1 + n2}.`, `= <b>&#36;${fmt(value, 2)}</b>.`), trap: 'Averaging the two averages ignores the group sizes.' };
      }, check: (p) => (p.n1 * p.a1 + p.n2 * p.a2) / (p.n1 + p.n2) },
    { id: 'av-g03', type: 'mcq', level: 2, exams: E, sub: 'change', title: 'average after one leaves',
      make(r) {
        const n = int(r, 6, 15), avg = int(r, 20, 60), leave = avg + int(r, -15, 25), value = (n * avg - leave) / (n - 1);
        if (leave === avg) return this.make(r);
        return { q: `<p>The average age of ${n} people in a room is ${avg}. One person, aged ${leave}, leaves. What is the average age of the people who remain?</p>`, ...numOpts(r, value, [avg - (leave - avg) / n, (n * avg - leave) / n, avg].map((x) => +x.toFixed(3))), value, n, avg, leave, tol: 0.003,
          hint: 'Work with totals: the total age goes down by the age of the person who leaves.',
          sol: steps(`Total age: ${n} × ${avg} = ${n * avg}.`, `After one leaves: ${n * avg} − ${leave} = ${n * avg - leave}, shared by ${n - 1} people.`, `${n * avg - leave} ÷ ${n - 1} = <b>${fmt(value, 2)}</b>.`), trap: `Dividing by ${n} instead of ${n - 1}.` };
      }, check: (p) => (p.n * p.avg - p.leave) / (p.n - 1) },
  ],
};

import { int, choose, fmt, numOpts, textOpts, steps } from './_q.js';
const E = ['gmat', 'gre'];
const median = (a) => { const s = [...a].sort((x, y) => x - y), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
export default {
  topic: 'spread',
  items: [
    { id: 'sp-001', type: 'mcq', level: 2, exams: E, sub: 'standard deviation',
      q: '<p>Each number in a list is increased by 10. What happens to the standard deviation?</p>', options: ['It increases by 10.', 'It increases by 100.', 'It is multiplied by 10.', 'It stays the same.', 'It cannot be determined.'], answer: 3,
      sol: '<p>Standard deviation measures how far values are from their mean. Adding 10 to every value moves the mean by 10 too, so every distance from the mean is unchanged.</p>' },
    { id: 'sp-002', type: 'mcq', level: 2, exams: E, sub: 'standard deviation',
      q: '<p>Which list has the largest standard deviation?</p>', options: ['5, 5, 5, 5', '4, 5, 5, 6', '1, 5, 5, 9', '3, 4, 6, 7', '2, 5, 5, 8'], answer: 2,
      sol: '<p>All five lists have mean 5, so compare distances from 5. In 1, 5, 5, 9 two values are 4 away, more than in any other list (2, 5, 5, 8 has two values 3 away; 3, 4, 6, 7 has distances 2, 1, 1, 2).</p>' },
    { id: 'sp-003', type: 'mcq', level: 3, exams: E, sub: 'median',
      q: '<p>The list 3, 8, <i>x</i>, 12, 15 is in increasing order, and its mean equals its median. What is <i>x</i>?</p>', options: ['9', '9.5', '10', '10.5', '11'], answer: 1,
      sol: '<p>The median is the middle value, <i>x</i>. The mean is (38 + <i>x</i>) ÷ 5. Setting them equal: 38 + <i>x</i> = 5<i>x</i>, so <i>x</i> = 9.5, which does sit between 8 and 12.</p>' },
  ],
  gens: [
    { id: 'sp-g01', type: 'mcq', level: 1, exams: E, sub: 'median', title: 'median of a list',
      make(r) {
        const n = choose(r, [6, 7, 8, 9]), a = Array.from({ length: n }, () => int(r, 1, 60)), value = median(a), s = [...a].sort((x, y) => x - y);
        const mean = a.reduce((x, y) => x + y, 0) / n;
        return { q: `<p>What is the median of these numbers: ${a.join(', ')}?</p>`, ...numOpts(r, value, [a[n >> 1], +mean.toFixed(2), s[(n >> 1) - 1]]), value, a,
          hint: 'Put the numbers in order first; the median is the middle one (or the average of the two middle ones).',
          sol: steps(`In order: ${s.join(', ')}.`, n % 2 ? `With ${n} numbers the middle is number ${(n + 1) / 2}.` : `With ${n} numbers, average numbers ${n / 2} and ${n / 2 + 1}: (${s[n / 2 - 1]} + ${s[n / 2]}) ÷ 2.`, `Median = <b>${fmt(value)}</b>.`), trap: 'Taking the middle of the list without sorting it.' };
      }, check: (p) => median(p.a) },
    { id: 'sp-g02', type: 'mcq', level: 2, exams: E, sub: 'range', title: 'range after a change',
      make(r) {
        const n = int(r, 5, 8), a = Array.from({ length: n }, () => int(r, 10, 80)), k = choose(r, [2, 3, 0.5]), add = int(r, -10, 15);
        const lo = Math.min(...a), hi = Math.max(...a), value = Math.abs(k) * (hi - lo);
        return { q: `<p>The numbers ${a.join(', ')} are each multiplied by ${fmt(k)} and then ${add >= 0 ? 'increased' : 'decreased'} by ${Math.abs(add)}. What is the range of the new list?</p>`, ...numOpts(r, value, [hi - lo, value + add, k * (hi - lo) + 2 * add].map((x) => +x.toFixed(2)).filter((x) => x > 0)), value, a, k,
          hint: 'Adding the same number to every value does not change the range; multiplying does.',
          sol: steps(`Old range: ${hi} − ${lo} = ${hi - lo}.`, `Adding or subtracting ${Math.abs(add)} shifts everything equally: no effect on the range.`, `Multiplying by ${fmt(k)} scales it: ${fmt(k)} × ${hi - lo} = <b>${fmt(value)}</b>.`) };
      }, check: (p) => p.k * (Math.max(...p.a) - Math.min(...p.a)) },
    { id: 'sp-g03', type: 'mcq', level: 3, exams: E, sub: 'standard deviation', title: 'standard deviation of a small list',
      make(r) {
        const m = int(r, 5, 30), d = choose(r, [1, 2, 3, 4, 5]), n = choose(r, [2, 4]), a = []; for (let i = 0; i < n / 2; i++) a.push(m - d, m + d);
        const value = d; // every value is d from the mean
        return { q: `<p>What is the standard deviation of the list ${a.sort((x, y) => x - y).join(', ')}? (Use the population standard deviation: divide by the number of values.)</p>`, ...numOpts(r, value, [2 * d, d * d, d / 2]), value, a,
          hint: 'Find the mean, then how far each value is from it.',
          sol: steps(`Mean: ${m}. Every value is ${d} away from it.`, `Squared distances are all ${d * d}, so their average (the variance) is ${d * d}.`, `Standard deviation = √${d * d} = <b>${d}</b>.`), trap: `Answering the variance (${d * d}).` };
      }, check: (p) => { const m = p.a.reduce((x, y) => x + y, 0) / p.a.length; return Math.sqrt(p.a.reduce((s, x) => s + (x - m) ** 2, 0) / p.a.length); } },
  ],
};

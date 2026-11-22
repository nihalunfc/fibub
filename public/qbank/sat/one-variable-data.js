// SAT Math · Problem-solving and data analysis · mean, median, range, spread and outliers. Original (fibub).
import { int, choose, shuffleOpts, fmt, steps } from './_util.js';
const F = { section: 'math', domain: 'data' };
const sum = (a) => a.reduce((s, x) => s + x, 0);
const median = (a) => { const b = [...a].sort((x, y) => x - y), n = b.length; return n % 2 ? b[(n - 1) / 2] : (b[n / 2 - 1] + b[n / 2]) / 2; };

export default {
  topic: 'one-variable-data',
  gens: [
    { id: 'sat-ov-g01', type: 'nat', marks: 1, level: 1, exams: ['sat'], sub: 'mean', facets: F, format: 'numeric',
      make(r) {
        const n = int(r, 4, 7), m = int(r, 10, 90), a = Array.from({ length: n - 1 }, () => m + int(r, -9, 9));
        a.push(m * n - sum(a));
        return { q: `<p>What is the mean of these numbers?</p><p>${a.join(', ')}</p>`, answer: m, tol: 0, a,
          sol: steps(`Add them: ${a.join(' + ')} = ${sum(a)}.`, `Divide by how many there are (${n}): ${sum(a)} ÷ ${n} = <b>${m}</b>.`) };
      },
      verify: (p) => sum(p.a) / p.a.length },
    { id: 'sat-ov-g02', type: 'nat', marks: 1, level: 2, exams: ['sat'], sub: 'median', facets: F, format: 'numeric',
      make(r) {
        const n = choose(r, [5, 6, 7, 8]), a = Array.from({ length: n }, () => int(r, 1, 60));
        return { q: `<p>What is the median of these values?</p><p>${a.join(', ')}</p>`, answer: median(a), tol: 0, a,
          sol: steps(`Sort them: ${[...a].sort((x, y) => x - y).join(', ')}.`, n % 2 ? `With ${n} values the middle one is number ${(n + 1) / 2}: <b>${fmt(median(a))}</b>.` : `With ${n} values there are two middle ones; the median is their mean: <b>${fmt(median(a))}</b>.`),
          trap: 'Taking the middle value before sorting.' };
      },
      verify: (p) => median(p.a) },
    { id: 'sat-ov-g03', type: 'nat', marks: 1, level: 3, exams: ['sat'], sub: 'missing value', facets: F, format: 'numeric',
      make(r) {
        const n = int(r, 4, 6), m = int(r, 70, 90), a = Array.from({ length: n - 1 }, () => m + int(r, -12, 8));
        const need = m * n - sum(a);
        return { q: `<p>Ana's first ${n - 1} test scores are ${a.join(', ')}. What score does she need on test ${n} so that the mean of all ${n} scores is ${m}?</p>`, answer: need, tol: 0, a, m,
          sol: steps(`A mean of ${m} over ${n} tests needs a total of ${m} × ${n} = ${m * n}.`, `She has ${sum(a)} so far.`, `She needs ${m * n} − ${sum(a)} = <b>${need}</b>.`) };
      },
      verify: (p) => p.m * (p.a.length + 1) - sum(p.a) },
    { id: 'sat-ov-g04', type: 'mcq', marks: 1, level: 3, exams: ['sat'], sub: 'outlier effect', facets: F, format: 'single',
      make(r) {
        const a = Array.from({ length: 6 }, () => int(r, 20, 40)), big = int(r, 90, 150), dir = choose(r, ['added', 'removed']);
        const right = dir === 'added' ? 'The mean increases more than the median.' : 'The mean decreases more than the median.';
        const o = shuffleOpts(r, right, [dir === 'added' ? 'The median increases more than the mean.' : 'The median decreases more than the mean.', 'Both stay exactly the same.', 'The mean and median change by the same amount.']);
        const list = dir === 'added' ? a : [...a, big];
        return { q: `<p>A data set is ${list.join(', ')}. If the value ${big} is ${dir} ${dir === 'added' ? 'to' : 'from'} the data set, which statement is true?</p>`, ...o,
          sol: `<p>${big} is far from the rest, an outlier. The mean uses every value, so one far-off value pulls it a long way. The median only depends on the middle position, which moves by at most half a step. So <b>${right.toLowerCase()}</b></p>` };
      } },
    { id: 'sat-ov-g05', type: 'mcq', marks: 1, level: 4, exams: ['sat'], sub: 'spread', facets: F, format: 'single',
      make(r) {
        const c = int(r, 30, 70), k = int(r, 1, 3), w = int(r, 6, 12);
        const A = [c - k, c, c, c + k, c - k, c + k], B = [c - w, c - w / 2 | 0, c, c, c + (w / 2 | 0), c + w];
        const right = 'Data set B has the larger standard deviation.';
        const o = shuffleOpts(r, right, ['Data set A has the larger standard deviation.', 'The two data sets have the same standard deviation.', 'There is not enough information to compare them.']);
        return { q: `<p>Data set A: ${A.join(', ')}<br>Data set B: ${B.join(', ')}</p><p>Which statement about the two data sets is true?</p>`, ...o,
          sol: `<p>Standard deviation measures how far values typically are from the mean. Both sets centre on ${c}, but B\'s values are spread up to ${w} away while A\'s are within ${k}. So <b>B has the larger standard deviation</b>. You do not need to calculate it on the SAT.</p>` };
      } },
  ],
  items: [
    { id: 'sat-ov-001', type: 'mcq', marks: 1, level: 3, exams: ['sat'], sub: 'frequency table', facets: F,
      q: '<table class="qb-table"><tr><th>Pets owned</th><td>0</td><td>1</td><td>2</td><td>3</td></tr><tr><th>Number of students</th><td>6</td><td>9</td><td>4</td><td>1</td></tr></table><p>The table shows how many pets each of 20 students owns. What is the median number of pets?</p>',
      options: ['1', '1.5', '2', '0.5'], answer: 0,
      sol: '<p>20 values, so the median is the mean of the 10th and 11th. The first 6 values are 0; values 7 to 15 are 1. Both the 10th and 11th are 1, so the median is <b>1</b>.</p>' },
  ],
};

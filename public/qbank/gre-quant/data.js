// GRE data analysis: quartiles and box plots, the normal curve (68-95-99.7), and percentiles.
import { int, choose, numOpts, fmt, steps } from '../grad-quant/_q.js';
const E = ['gre'];
const med = (a) => { const s = a.slice().sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
// Quartiles as the medians of the lower and upper halves (the method most US courses and the GRE use).
const quart = (a) => { const s = a.slice().sort((x, y) => x - y), n = s.length, h = Math.floor(n / 2); return [med(s.slice(0, h)), med(s), med(s.slice(n % 2 ? h + 1 : h))]; };
export default {
  topic: 'data',
  gens: [
    { id: 'dat-g01', type: 'nat', level: 3, exams: E, format: 'numeric', sub: 'quartiles',
      make(r) {
        const n = choose(r, [8, 9, 10, 11]), xs = Array.from({ length: n }, () => int(r, 2, 60)), ask = int(r, 0, 1), [q1, m, q3] = quart(xs), s = xs.slice().sort((a, b) => a - b);
        const ans = ask === 0 ? q3 - q1 : Math.max(...xs) - Math.min(...xs);
        return { q: `<p>The data set is: ${xs.join(', ')}.</p><p>What is the ${ask === 0 ? 'interquartile range (Q3 − Q1)' : 'range'}?</p>`, answer: ans, tol: 0, xs, ask,
          sol: steps(`Sort: ${s.join(', ')}.`, ask === 0 ? `Median = ${fmt(m)}. Lower half ${s.slice(0, Math.floor(n / 2)).join(', ')} → Q1 = ${fmt(q1)}. Upper half ${s.slice(n % 2 ? Math.floor(n / 2) + 1 : n / 2).join(', ')} → Q3 = ${fmt(q3)}.` : `Largest ${s[n - 1]}, smallest ${s[0]}.`,
            `${ask === 0 ? 'IQR = ' + fmt(q3) + ' − ' + fmt(q1) : 'Range = ' + s[n - 1] + ' − ' + s[0]} = <b>${fmt(ans)}</b>.`), trap: 'Forgetting to sort first, or including the median in both halves when the count is odd.' };
      },
      verify(p) { const [a, , b] = quart(p.xs); return p.ask === 0 ? b - a : Math.max(...p.xs) - Math.min(...p.xs); } },
    { id: 'dat-g02', type: 'mcq', level: 3, exams: E, sub: 'normal distribution',
      make(r) {
        const mu = choose(r, [50, 60, 70, 100, 500]), sd = choose(r, [5, 8, 10, 15, 20]), N = choose(r, [200, 400, 1000, 2000]), k = int(r, 0, 2);
        const [lo, hi, share, txt] = [[mu - sd, mu + sd, 0.68, 'within 1 standard deviation'], [mu, mu + 2 * sd, 0.475, 'from the mean to 2 standard deviations above'], [mu + sd, Infinity, 0.16, 'exactly 1 standard deviation above the mean, so the question asks for the upper tail beyond 1 SD']][k];
        const value = Math.round(share * N), o = numOpts(r, value, [Math.round(0.34 * N), Math.round(0.95 * N), Math.round(0.5 * N), Math.round(0.025 * N)].filter((v) => v !== value), (v) => String(Math.round(v)));
        return { q: `<p>The scores of ${N} people are approximately normally distributed with mean ${mu} and standard deviation ${sd}. About how many scored ${hi === Infinity ? 'above ' + lo : 'between ' + lo + ' and ' + hi}?</p>`, options: o.options, answer: o.answer, value,
          sol: steps(`${hi === Infinity ? lo + ' is' : lo + ' to ' + hi + ' is'} ${txt}.`, `The 68-95-99.7 rule: about 68% lie within 1 SD, 95% within 2 SD; so this region holds about ${share * 100}%.`, `${share * 100}% of ${N} ≈ <b>${value}</b>.`), trap: 'Using 68% or 95% for a region that is only one side of the mean: halve it.' };
      },
      check: (p) => p.value },
  ],
};

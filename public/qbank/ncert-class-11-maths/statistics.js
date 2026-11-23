// Class 11 Maths, Chapter 13 Statistics: practice questions for the NCERT study course (original fibub questions).
import { maker } from './_make.js';
import { pick, choose } from '../_util.js';
const m = maker('sd');
const R = String.raw;
const SETS = [[4, 7, 9, 12, 13, 17], [3, 5, 8, 8, 11, 15], [10, 12, 15, 18, 20, 25], [2, 6, 7, 9, 14, 18], [5, 9, 9, 13, 16, 20], [6, 8, 11, 12, 15, 24], [1, 4, 6, 10, 12, 17]];
const mean = (d) => d.reduce((a, b) => a + b, 0) / d.length;
const MID = [15, 25, 35, 45, 55], FREQS = [[4, 6, 10, 8, 2], [3, 7, 9, 6, 5], [2, 5, 12, 7, 4], [6, 8, 8, 5, 3], [1, 4, 9, 10, 6]];

export default {
  topic: 'statistics', name: 'Statistics', n: 13,
  items: [
    m.mcq(1, 'range', R`<p>The range of $3, 8, 12, 20$ is:</p>`, R`$17$`, [R`$20$`, R`$10.75$`, R`$9$`], R`<p>Largest minus smallest: $20 - 3 = 17$.</p>`),
    m.mcq(1, 'meandev', R`<p>The sum of the deviations of the values from their mean is always:</p>`, R`$0$`, [R`positive`, R`the mean deviation`, R`the variance`], R`<p>Values above the mean and below it balance exactly. That is why the mean deviation uses absolute values.</p>`),
    m.mcq(2, 'meandev', R`<p>The mean deviation about the mean of $2, 4, 6, 8$ is:</p>`, R`$2$`, [R`$0$`, R`$5$`, R`$4$`], R`<p>Mean 5; absolute deviations $3, 1, 1, 3$; average $8/4 = 2$.</p>`),
    m.mcq(2, 'variance', R`<p>The standard deviation of $5, 5, 5, 5$ is:</p>`, R`$0$`, [R`$5$`, R`$1$`, R`$\sqrt5$`], R`<p>Every deviation is 0.</p>`),
    m.mcq(2, 'variance', R`<p>The variance of $2, 4, 6$ (dividing by $n$) is:</p>`, R`$\dfrac83$`, [R`$2$`, R`$4$`, R`$\dfrac{8}{2}$`], R`<p>Mean 4; squared deviations $4, 0, 4$; $8/3$.</p>`, { trap: 'Dividing by n − 1 (a university convention not used here).' }),
    m.mcq(2, 'shift', R`<p>If 10 is added to every observation, the standard deviation:</p>`, R`stays the same`, [R`increases by 10`, R`becomes 10 times larger`, R`decreases by 10`], R`<p>All values slide together, so the gaps between them (and from the mean) do not change.</p>`),
    m.mcq(2, 'shift', R`<p>If every observation is multiplied by 3, the variance is multiplied by:</p>`, R`$9$`, [R`$3$`, R`$6$`, R`$\sqrt3$`], R`<p>The SD is multiplied by 3, and the variance is its square.</p>`, { trap: 'Saying 3: that is the factor for the SD.' }),
    m.mcq(3, 'cv', R`<p>Series A has mean 40 and SD 8; series B has mean 25 and SD 6. Which is more consistent?</p>`, R`A, since its CV is 20% against 24%`, [R`B, since its SD is smaller`, R`A, since its mean is larger`, R`Both are equally consistent`], R`<p>CV of A $= 8/40 \times 100 = 20\%$; CV of B $= 6/25 \times 100 = 24\%$. The smaller CV is more consistent.</p>`, { trap: 'Comparing SDs when the means are different.' }),
    m.mcq(2, 'variance', R`<p>Which formula gives the variance?</p>`, R`$\dfrac{\sum x^2}{n} - \bar x^2$`, [R`$\dfrac{\sum x}{n} - \bar x^2$`, R`$\sqrt{\dfrac{\sum x^2}{n}} - \bar x$`, R`$\dfrac{\sum x^2}{n} + \bar x^2$`], R`<p>Mean of the squares minus the square of the mean.</p>`),
    m.mcq(3, 'variance', R`<p>For 10 observations, $\sum x = 60$ and $\sum x^2 = 480$. The variance is:</p>`, R`$12$`, [R`$48$`, R`$36$`, R`$24$`], R`<p>$480/10 - (60/10)^2 = 48 - 36 = 12$.</p>`),
    m.mcq(2, 'grouped', R`<p>The class mark of the class $20$–$30$ is:</p>`, R`$25$`, [R`$20$`, R`$10$`, R`$30$`], R`<p>The class mark is the midpoint $(20 + 30)/2$.</p>`),
    m.mcq(3, 'grouped', R`<p>Classes $0$–$10$, $10$–$20$, $20$–$30$ have frequencies $2, 5, 3$. The mean (using class marks) is:</p>`, R`$16$`, [R`$15$`, R`$20$`, R`$10$`], R`<p>$\dfrac{2\cdot5 + 5\cdot15 + 3\cdot25}{10} = \dfrac{160}{10} = 16$.</p>`),
    m.mcq(3, 'meandev', R`<p>Compared with the mean deviation about the mean, the mean deviation about the median is:</p>`, R`never larger`, [R`always larger`, R`always equal`, R`always zero`], R`<p>The sum of $|x - c|$ is smallest when $c$ is the median.</p>`),
    m.ar(1, 'variance', R`The standard deviation can never be negative.`, R`It is defined as the positive square root of the variance.`, 0, R`<p>Both true; R explains A.</p>`),
    m.ar(2, 'meandev', R`Mean deviation can be found about any point, such as the mean or the median.`, R`Its value is smallest when taken about the median.`, 1, R`<p>Both statements are true, but the second does not explain why the first is possible.</p>`),
    m.ar(2, 'variance', R`Two data sets with the same mean must have the same standard deviation.`, R`The mean measures the centre of the data, not its spread.`, 3, R`<p>A is false (for example 4, 6 and 0, 10 both have mean 5). R is true.</p>`),
    m.ar(1, 'variance', R`The variance of $5, 5, 5, 5$ is 0.`, R`Every deviation from the mean is 0.`, 0, R`<p>Both true; R explains A.</p>`),
    m.nat(1, 'range', R`<p>Find the range of $11, 4, 19, 8$.</p>`, () => 15, 0, R`<p>$19 - 4 = 15$.</p>`),
    m.nat(2, 'variance', R`<p>Find the variance of $1, 2, 3, 4, 5$.</p>`, () => 2, 0, R`<p>Mean 3; squared deviations $4, 1, 0, 1, 4$; $10/5 = 2$.</p>`),
    m.nat(2, 'variance', R`<p>Find the standard deviation of $2, 4, 4, 4, 5, 5, 7, 9$.</p>`, () => 2, 0, R`<p>Mean 5; squared deviations $9, 1, 1, 1, 0, 0, 4, 16$ sum to 32; variance 4; SD 2.</p>`),
    m.nat(2, 'meandev', R`<p>Find the mean deviation about the mean of $5, 7, 9, 11, 13$.</p>`, () => 2.4, 0.001, R`<p>Mean 9; absolute deviations $4, 2, 0, 2, 4$ sum to 12; $12/5 = 2.4$.</p>`),
    m.nat(3, 'cv', R`<p>A data set has mean 50 and standard deviation 7.5. Find the coefficient of variation (in %).</p>`, () => 15, 0, R`<p>$7.5/50 \times 100 = 15$.</p>`),
    m.msq(1, 'range', R`<p>Which of these are measures of dispersion? (Choose all that apply.)</p>`, [R`range`, R`mean deviation`, R`standard deviation`, R`median`], [0, 1, 2], R`<p>The median is a measure of central tendency.</p>`),
    m.msq(3, 'shift', R`<p>Which quantities do not change when 5 is added to every observation? (Choose all that apply.)</p>`, [R`range`, R`standard deviation`, R`variance`, R`mean`], [0, 1, 2], R`<p>Spread measures ignore a common shift; the mean moves by 5.</p>`),
  ],
  gens: [
    { id: 'sd-g01', type: 'nat', level: 2, exams: ['board'], sub: 'meandev',
      make(rng) { const D = choose(rng, SETS), mu = mean(D), md = D.reduce((a, b) => a + Math.abs(b - mu), 0) / D.length; return { D, q: `<p>Find the mean deviation about the mean of ${D.join(', ')} (3 decimal places).</p>`, answer: md, tol: 0.002, sol: `<p>Mean ${+mu.toFixed(3)}; sum of |x − mean| = ${+(md * D.length).toFixed(3)}; divide by ${D.length}: ${md.toFixed(3)}.</p>` }; },
      verify: (p) => { const mu = mean(p.D); return (2 * p.D.filter((x) => x > mu).reduce((a, x) => a + (x - mu), 0)) / p.D.length; } },
    { id: 'sd-g02', type: 'nat', level: 2, exams: ['board'], sub: 'variance',
      make(rng) { const D = choose(rng, SETS), mu = mean(D), v = D.reduce((a, x) => a + (x - mu) ** 2, 0) / D.length; return { D, q: `<p>Find the variance of ${D.join(', ')} (3 decimal places).</p>`, answer: v, tol: 0.003, sol: `<p>Mean ${+mu.toFixed(3)}; the sum of squared deviations divided by ${D.length} is ${v.toFixed(3)}.</p>` }; },
      verify: (p) => p.D.reduce((a, x) => a + x * x, 0) / p.D.length - mean(p.D) ** 2 },
    { id: 'sd-g03', type: 'nat', level: 2, exams: ['board'], sub: 'variance',
      make(rng) { const D = choose(rng, SETS), mu = mean(D), v = D.reduce((a, x) => a + (x - mu) ** 2, 0) / D.length; return { D, q: `<p>Find the standard deviation of ${D.join(', ')} (2 decimal places).</p>`, answer: Math.sqrt(v), tol: 0.01, sol: `<p>Variance ${v.toFixed(3)}, so SD = ${Math.sqrt(v).toFixed(2)}.</p>` }; },
      verify: (p) => { let s = 0; for (const a of p.D) for (const b of p.D) s += (a - b) ** 2; return Math.sqrt(s / (2 * p.D.length ** 2)); } },
    { id: 'sd-g04', type: 'nat', level: 3, exams: ['board'], sub: 'grouped',
      make(rng) { const F = choose(rng, FREQS), N = F.reduce((a, b) => a + b, 0), mu = F.reduce((a, f, i) => a + f * MID[i], 0) / N; return { F, q: `<p>Marks 10–20, 20–30, 30–40, 40–50, 50–60 have frequencies ${F.join(', ')}. Find the mean using class marks (2 decimal places).</p>`, answer: mu, tol: 0.01, sol: `<p>$\\sum fx / n = ${F.reduce((a, f, i) => a + f * MID[i], 0)}/${N} = ${mu.toFixed(2)}$.</p>` }; },
      verify: (p) => { const N = p.F.reduce((a, b) => a + b, 0); return 35 + (10 * p.F.reduce((a, f, i) => a + f * (i - 2), 0)) / N; } },
    { id: 'sd-g05', type: 'nat', level: 3, exams: ['board'], sub: 'shift',
      make(rng) { const D = choose(rng, SETS), k = pick(rng, 2, 5), s = pick(rng, 1, 20), mu = mean(D), sd = Math.sqrt(D.reduce((a, x) => a + (x - mu) ** 2, 0) / D.length); return { D, k, s, q: `<p>Each of ${D.join(', ')} is multiplied by ${k} and then ${s} is added. Find the standard deviation of the new values (2 decimal places).</p>`, answer: k * sd, tol: 0.01, sol: `<p>Adding ${s} changes nothing; multiplying by ${k} multiplies the SD: ${k} × ${sd.toFixed(3)}.</p>` }; },
      verify: (p) => { const T = p.D.map((x) => x * p.k + p.s), t = mean(T); return Math.sqrt(T.reduce((a, x) => a + (x - t) ** 2, 0) / T.length); } },
    { id: 'sd-g06', type: 'nat', level: 2, exams: ['board'], sub: 'cv',
      make(rng) { const mu = pick(rng, 20, 90, 5), sd = pick(rng, 2, 12); return { mu, sd, q: `<p>A data set has mean ${mu} and standard deviation ${sd}. Find the coefficient of variation in percent (1 decimal place).</p>`, answer: (sd / mu) * 100, tol: 0.06, sol: `<p>$${sd}/${mu} \\times 100 = ${((sd / mu) * 100).toFixed(1)}\\%$.</p>` }; },
      verify: (p) => (100 * p.sd) / p.mu },
  ],
};

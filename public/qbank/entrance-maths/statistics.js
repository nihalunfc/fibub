// Statistics (Plus Two entrance, Mathematics, Class 11). Original fibub questions.
import { pick, int, choose, fmt, shuffleOpts, numOpts } from '../_entrance.js';

const R = String.raw;
const CUET = false; // Class 12 chapters: level 1-3 mcq also list 'cuet'
const EXS = {
  1: ['keam', 'cusat', 'comedk', 'jee-main'],
  2: ['keam', 'cusat', 'comedk', 'jee-main'],
  3: ['jee-main', 'keam', 'comedk'],
  4: ['jee-main', 'jee-adv'],
  5: ['jee-adv'],
};
const POS = [1, 3, 0, 2, 2, 0, 3, 1, 3, 1, 2, 0, 1, 2, 3, 0];
let _n = 0;
const place = (correct, wrongs) => {
  const p = POS[_n++ % POS.length];
  const o = [...wrongs];
  o.splice(p, 0, correct);
  return { options: o, answer: p };
};
const base = (level, sub, extra) => ({ level, exams: [...EXS[level], ...(CUET && extra.type === 'mcq' && level <= 3 ? ['cuet'] : [])], sub, ...extra });
const M = (level, sub, q, correct, wrongs, sol, trap, more = {}) =>
  base(level, sub, { type: 'mcq', format: 'single', q, ...place(correct, wrongs), sol, trap, ...more });
const I = (level, sub, q, answer, sol, trap, more = {}) =>
  base(level, sub, { type: 'nat', format: 'integer', q, answer, tol: 0, sol, trap, ...more });
const N = (level, sub, q, answer, tol, sol, trap, more = {}) =>
  base(level, sub, { type: 'nat', format: 'numeric', q, answer, tol, sol, trap, ...more });
const X = (level, sub, q, options, answer, sol, trap, more = {}) =>
  base(level, sub, { type: 'msq', format: 'multi', q, options, answer, sol, trap, ...more });
const AOPT = [
  'Both A and R are true and R is the correct explanation of A',
  'Both A and R are true but R is not the correct explanation of A',
  'A is true but R is false',
  'A is false but R is true',
];
const SOPT = [
  'Both Statement I and Statement II are true',
  'Statement I is true and Statement II is false',
  'Statement I is false and Statement II is true',
  'Both Statement I and Statement II are false',
];
const A = (level, sub, a, r, answer, sol, trap, more = {}) =>
  base(level, sub, { type: 'mcq', format: 'assertion', q: `<p><b>Assertion (A):</b> ${a}</p><p><b>Reason (R):</b> ${r}</p>`, options: AOPT, answer, sol, trap, ...more });
const S = (level, sub, s1, s2, answer, sol, trap, more = {}) =>
  base(level, sub, { type: 'mcq', format: 'statements', q: `<p><b>Statement I:</b> ${s1}</p><p><b>Statement II:</b> ${s2}</p>`, options: SOPT, answer, sol, trap, ...more });
const SC = (level, sub, lines, correct, wrongs, sol, trap, more = {}) =>
  base(level, sub, { type: 'mcq', format: 'statements', q: `<ol>${lines.map((l) => `<li>${l}</li>`).join('')}</ol><p>How many of these statements are correct?</p>`, ...place(correct, wrongs), sol, trap, ...more });
const MT = (level, sub, group, q, correct, wrongs, sol, trap) =>
  base(level, sub, { type: 'mcq', format: 'match', group, q, ...place(correct, wrongs), sol, trap });
const PI = (level, sub, group, q, answer, sol, trap, more = {}) =>
  base(level, sub, { type: 'nat', format: 'passage', group, q, answer, tol: 0, sol, trap, ...more });
const PN = (level, sub, group, q, answer, tol, sol, trap, more = {}) =>
  base(level, sub, { type: 'nat', format: 'passage', group, q, answer, tol, sol, trap, ...more });
const GEXS = (level, type) => [...EXS[level], ...(CUET && type === 'mcq' && level <= 3 ? ['cuet'] : [])];
const gen = (id, level, type, format, sub, make, verify) => ({ id, type, format, level, exams: GEXS(level, type), sub, make, ...(verify ? { verify } : {}) });

const PI_ = Math.PI, E_ = Math.E;
const sqrt = Math.sqrt, sin = Math.sin, cos = Math.cos, tan = Math.tan, atan = Math.atan, asin = Math.asin, acos = Math.acos, abs = Math.abs, exp = Math.exp, ln = Math.log;
const r4 = (x) => +x.toFixed(4);
const r2 = (x) => +x.toFixed(2);
const TWOD = ' (2 decimal places)';
const D = (level, sub, q, answer, sol, trap, more = {}) => N(level, sub, `${q} (2 decimal places)`, answer, 0.01, sol, trap, more);
const PD = (level, sub, group, q, answer, sol, trap, more = {}) => PN(level, sub, group, `${q} (2 decimal places)`, answer, 0.01, sol, trap, more);
const deg = (r) => (r * 180) / PI_, rad = (d) => (d * PI_) / 180;
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
/** number of distinct zeros of f on [a,b) (b included when `closed`): sign changes on a fine grid, plus exact end zeros */
const zeros = (f, a, b, closed = false, n = 200000) => {
  const h = (b - a) / n; let c = 0; let prev = f(a + 0.3183 * h);
  for (let i = 1; i < n; i++) { const v = f(a + (i + 0.3183) * h); if ((prev < 0) !== (v < 0)) c++; prev = v; }
  if (Math.abs(f(a)) < 1e-9) c++;
  if (closed && Math.abs(f(b)) < 1e-9) c++;
  return c;
};

// ---------- statistics helpers (used to work out answers and to fill the solutions) ----------
const sum = (a) => a.reduce((s, x) => s + x, 0);
const mean = (a) => sum(a) / a.length;
const median = (a) => { const b = [...a].sort((x, y) => x - y), n = b.length; return n % 2 ? b[(n - 1) / 2] : (b[n / 2 - 1] + b[n / 2]) / 2; };
const varp = (a) => { const m = mean(a); return sum(a.map((x) => (x - m) ** 2)) / a.length; };
const sdp = (a) => sqrt(varp(a));
const mdMean = (a) => { const m = mean(a); return sum(a.map((x) => abs(x - m))) / a.length; };
const mdMed = (a) => { const m = median(a); return sum(a.map((x) => abs(x - m))) / a.length; };
/** grouped data: classes as [lo,hi] and frequencies */
const mids = (cl) => cl.map(([l, h]) => (l + h) / 2);
const gN = (f) => sum(f);
const gMean = (cl, f) => sum(mids(cl).map((x, i) => x * f[i])) / gN(f);
const gVar = (cl, f) => { const m = gMean(cl, f); return sum(mids(cl).map((x, i) => f[i] * (x - m) ** 2)) / gN(f); };
const gMdMean = (cl, f) => { const m = gMean(cl, f); return sum(mids(cl).map((x, i) => f[i] * abs(x - m))) / gN(f); };
const gMedian = (cl, f) => { const N = gN(f); let cf = 0; for (let i = 0; i < cl.length; i++) { if (cf + f[i] >= N / 2) return cl[i][0] + ((N / 2 - cf) / f[i]) * (cl[i][1] - cl[i][0]); cf += f[i]; } };
const gMode = (cl, f) => { let i = 0; for (let j = 1; j < f.length; j++) if (f[j] > f[i]) i = j; const f0 = i ? f[i - 1] : 0, f2 = i < f.length - 1 ? f[i + 1] : 0; return cl[i][0] + ((f[i] - f0) / (2 * f[i] - f0 - f2)) * (cl[i][1] - cl[i][0]); };
const t2 = (x) => String(+x.toFixed(2));
const t4 = (x) => String(+x.toFixed(4));
/** a frequency table as an HTML table */
const tbl = (head, rows) => `<table><thead><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
const CL1 = [[10, 20], [20, 30], [30, 40], [40, 50], [50, 60]], F1 = [5, 8, 15, 12, 10];

const DM = [3, 4, 4, 6, 7, 8, 8, 8]; // data for the match group m3: mean 6, median 6.5, mode 8, MD 1.75
const groups = {
  m1: {
    title: 'Change of scale and origin',
    passage: R`<p>Observations $x_1,\dots,x_n$ have standard deviation $\sigma$ and mean $\mu$. Match each new variable $y$ in List I with its standard deviation in List II.</p>`,
    list1: [R`A. $y=x+5$`, R`B. $y=2x$`, R`C. $y=-3x+1$`, R`D. $y=\dfrac{x-\mu}{\sigma}$`],
    list2: [R`p. $2\sigma$`, R`q. $3\sigma$`, R`r. $\sigma$`, R`s. $1$`],
  },
  m2: {
    title: 'Formulas for spread',
    passage: R`<p>Match each quantity in List I with its formula in List II.</p>`,
    list1: [R`A. Mean deviation about the mean`, R`B. Variance`, R`C. Coefficient of variation`, R`D. Mode (empirical relation)`],
    list2: [R`p. $\dfrac\sigma{\bar x}\times100$`, R`q. $3\,\text{median}-2\,\text{mean}$`, R`r. $\dfrac1n\displaystyle\sum|x_i-\bar x|$`, R`s. $\dfrac1n\displaystyle\sum x_i^2-\bar x^2$`],
  },
  m3: {
    title: 'Measures of one data set',
    passage: R`<p>For the data $3,4,4,6,7,8,8,8$, match each measure in List I with its value in List II.</p>`,
    list1: [R`A. Mean`, R`B. Median`, R`C. Mode`, R`D. Mean deviation about the mean`],
    list2: [R`p. $6.5$`, R`q. $8$`, R`r. $1.75$`, R`s. $6$`],
  },
  p1: {
    title: 'Passage: marks of 50 students',
    passage: R`<p>The marks of $50$ students are grouped as follows.</p>${tbl(['Marks', '10-20', '20-30', '30-40', '40-50', '50-60'], [['Students', ...F1]])}`,
  },
  p2: {
    title: 'Passage: two groups combined',
    passage: R`<p>Group $A$ has $20$ students with mean score $60$ and standard deviation $8$. Group $B$ has $30$ students with mean score $70$ and standard deviation $6$. The two groups are merged into one group of $50$.</p>`,
  },
  p3: {
    title: 'Passage: a recording error',
    passage: R`<p>Ten observations were recorded with mean $40$ and standard deviation $5$. Later it was found that one observation, $38$, was written wrongly and should have been $28$.</p>`,
  },
  p4: {
    title: 'Passage: deviations from an assumed mean',
    passage: R`<p>For $9$ observations $x_i$ it is known that $\sum(x_i-8)=9$ and $\sum(x_i-8)^2=45$.</p>`,
  },
};

const items = [
  // ---------- L1 ----------
  M(1, 'mean', R`The arithmetic mean of $3,5,7,9,11$ is`, '7', ['6', '8', '35'],
    R`<p>Sum $=3+5+7+9+11=35$. Mean $=\dfrac{35}5=7$.</p>`, 'Divide by the number of observations, $5$.'),
  I(1, 'median', R`The median of $12,\ 7,\ 9,\ 15,\ 3$ is`, 9,
    R`<p>Arrange in order: $3,7,9,12,15$. There are $5$ values, so the middle one (the 3rd) is $9$.</p>`, 'Sort the data before picking the middle value.', { calc: () => median([12, 7, 9, 15, 3]) }),
  M(1, 'mode', R`The mode of $2,3,3,4,5,3,6$ is`, '3', ['2', '4', '3.7'],
    R`<p>The mode is the value that occurs most often. $3$ occurs three times; every other value occurs once.</p>`, 'The mean is about $3.7$, which is not the mode.'),
  I(1, 'mean', R`The mean of the first $9$ natural numbers is`, 5,
    R`<p>Sum $=\dfrac{9\cdot10}2=45$. Mean $=\dfrac{45}9=5$. (The mean of the first $n$ natural numbers is $\dfrac{n+1}2$.)</p>`, '', { calc: () => mean([1, 2, 3, 4, 5, 6, 7, 8, 9]) }),
  M(1, 'properties', R`The sum of the deviations of the observations from their arithmetic mean is`, '0', ['the variance', 'the mean deviation', 'always positive'],
    R`<p>$\sum(x_i-\bar x)=\sum x_i-n\bar x=n\bar x-n\bar x=0$. Positive and negative deviations cancel.</p>`, 'That is why we use $|x-\\bar x|$ or squares.'),
  I(1, 'median', R`The median of $4,8,10,12$ is`, 9,
    R`<p>With an even number of values, the median is the average of the two middle ones: $\dfrac{8+10}2=9$.</p>`, '', { calc: () => median([4, 8, 10, 12]) }),
  M(1, 'variance and SD', R`The variance of $n$ observations $x_i$ with mean $\bar x$ is`, R`$\dfrac1n\sum(x_i-\bar x)^2$`, [R`$\dfrac1n\sum(x_i-\bar x)$`, R`$\dfrac1n\sum|x_i-\bar x|$`, R`$\sqrt{\dfrac1n\sum(x_i-\bar x)^2}$`],
    R`<p>Variance is the mean of the squared deviations. The last option is the standard deviation, the one before it is the mean deviation, and the first always gives $0$.</p>`, 'Do not confuse variance with SD.'),
  I(1, 'range', R`The range of $14,3,22,9$ is`, 19,
    R`<p>Range $=$ largest $-$ smallest $=22-3=19$.</p>`, '', { calc: () => 22 - 3 }),
  I(1, 'mean', R`The mean of $6$ observations is $12$. Their sum is`, 72,
    R`<p>Sum $=$ mean $\times$ number $=12\times6=72$.</p>`, ''),
  M(1, 'change of origin', R`Every observation of a data set is increased by $5$. Then`, R`the mean increases by $5$, the SD does not change`, [R`the mean and the SD both increase by $5$`, R`the mean does not change, the SD increases by $5$`, R`the mean and the SD both stay the same`],
    R`<p>Adding a constant shifts the whole data set. The mean shifts by the same amount; the spread between observations is unchanged.</p>`, 'Spread measures ignore a shift.'),
  I(1, 'variance and SD', R`The standard deviation of $5,5,5,5$ is`, 0,
    R`<p>All deviations from the mean $5$ are $0$, so the variance and SD are $0$.</p>`, ''),
  M(1, 'mean deviation', R`The mean deviation of $3,5,7$ about its median is`, R`$\dfrac43$`, [R`$\dfrac23$`, R`$2$`, R`$\dfrac83$`],
    R`<p>The median is $5$. Deviations: $|3-5|=2$, $0$, $|7-5|=2$. Mean deviation $=\dfrac{2+0+2}3=\dfrac43$.</p>`, 'Divide by $3$, the number of observations.'),
  I(1, 'mean', R`If the mean of $x,\ x+2,\ x+4$ is $10$, then $x$ is`, 8,
    R`<p>Mean $=\dfrac{3x+6}3=x+2=10$, so $x=8$.</p>`, ''),
  M(1, 'mode', R`For a moderately skewed distribution, the empirical relation is`, R`mode $=3$ median $-\,2$ mean`, [R`mode $=2$ median $-\,3$ mean`, R`mode $=3$ mean $-\,2$ median`, R`mode $=$ mean $+$ median`],
    R`<p>Pearson's empirical relation: mean $-$ mode $=3($mean $-$ median$)$, i.e. mode $=3\,$median$\,-2\,$mean.</p>`, 'Median gets the $3$.'),
  I(1, 'variance and SD', R`The variance of $1,2,3,4,5$ is`, 2,
    R`<p>Mean $=3$. Squared deviations: $4,1,0,1,4$, total $10$. Variance $=\dfrac{10}5=2$.</p>`, '', { calc: () => varp([1, 2, 3, 4, 5]) }),
  I(1, 'coefficient of variation', R`A data set has mean $50$ and standard deviation $10$. Its coefficient of variation, in per cent, is`, 20,
    R`<p>CV $=\dfrac\sigma{\bar x}\times100=\dfrac{10}{50}\times100=20\%$.</p>`, ''),

  // ---------- L2 ----------
  D(2, 'mean deviation', R`Find the mean deviation about the mean of $4,6,8,10,12$.`, 2.4,
    R`<p>Mean $=8$. Absolute deviations: $4,2,0,2,4$, sum $12$. Mean deviation $=\dfrac{12}5=2.4$.</p>`, 'Use $|x-\\bar x|$, not $(x-\\bar x)$.', { calc: () => mdMean([4, 6, 8, 10, 12]) }),
  I(2, 'mean deviation', R`Find the mean deviation about the median of $3,5,7,9,11,13$.`, 3,
    R`<p>Median $=\dfrac{7+9}2=8$. Absolute deviations: $5,3,1,1,3,5$, sum $18$. Mean deviation $=\dfrac{18}6=3$.</p>`, 'With $6$ values the median is not a data point.', { calc: () => mdMed([3, 5, 7, 9, 11, 13]) }),
  I(2, 'variance and SD', R`The variance of $1,3,5,7,9$ is`, 8,
    R`<p>Mean $=5$. Squared deviations: $16,4,0,4,16$, sum $40$. Variance $=\dfrac{40}5=8$. (Check with $\dfrac{\sum x^2}n-\bar x^2=\dfrac{165}5-25=8$.)</p>`, '', { calc: () => varp([1, 3, 5, 7, 9]) }),
  I(2, 'variance and SD', R`For $10$ observations, $\sum x=50$ and $\sum x^2=290$. Find the variance.`, 4,
    R`<p>$\bar x=\dfrac{50}{10}=5$. Variance $=\dfrac{\sum x^2}n-\bar x^2=29-25=4$.</p>`, 'Subtract the square of the mean, not the mean.', { calc: () => 290 / 10 - (50 / 10) ** 2 }),
  D(2, 'grouped data', R`The classes $0\text{-}10,\ 10\text{-}20,\ 20\text{-}30,\ 30\text{-}40$ have frequencies $5,8,12,5$. Find the mean.`, 20.667,
    R`<p>Class marks $5,15,25,35$. $\sum fx=25+120+300+175=620$. $N=30$. Mean $=\dfrac{620}{30}\approx20.67$.</p>`, 'Use class marks, not class limits.', { calc: () => gMean([[0, 10], [10, 20], [20, 30], [30, 40]], [5, 8, 12, 5]) }),
  I(2, 'change of scale', R`The standard deviation of $x$ is $3$. Find the variance of $y=2x+5$.`, 36,
    R`<p>The shift $+5$ does not matter. $\mathrm{SD}(y)=2\cdot3=6$, so $\mathrm{Var}(y)=36$. (Variance gets the factor $2^2=4$: $4\times9=36$.)</p>`, 'Variance scales by $a^2$.', { calc: () => 4 * 9 }),
  I(2, 'combined mean', R`Group $A$ has $20$ observations with mean $15$; group $B$ has $30$ observations with mean $20$. The mean of all $50$ is`, 18,
    R`<p>$\dfrac{20\cdot15+30\cdot20}{50}=\dfrac{300+600}{50}=18$.</p>`, 'The combined mean is a weighted mean, not $17.5$.', { calc: () => (20 * 15 + 30 * 20) / 50 }),
  D(2, 'wrong observation', R`The mean of $10$ observations is $20$. One observation $21$ was wrongly read as $12$. Find the correct mean.`, 20.9,
    R`<p>Correct sum $=200-12+21=209$. Correct mean $=\dfrac{209}{10}=20.9$.</p>`, 'Replace, do not just add.', { calc: () => (200 - 12 + 21) / 10 }),
  I(2, 'variance and SD', R`Find the variance of the first $11$ natural numbers.`, 10,
    R`<p>For $1,2,\dots,n$ the variance is $\dfrac{n^2-1}{12}=\dfrac{121-1}{12}=10$.</p>`, '', { calc: () => varp([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]) }),
  I(2, 'variance and SD', R`Find the variance of the five consecutive integers $8,9,10,11,12$.`, 2,
    R`<p>Shifting does not change variance, so it equals the variance of $1,2,3,4,5$, which is $\dfrac{25-1}{12}=2$.</p>`, '', { calc: () => varp([8, 9, 10, 11, 12]) }),
  M(2, 'coefficient of variation', R`Group $A$ has mean $60$ and SD $12$; group $B$ has mean $80$ and SD $20$. Which group is more consistent?`, R`$A$, because its CV ($20\%$) is smaller than that of $B$ ($25\%$)`, [R`$B$, because its SD is larger`, R`$A$, because its mean is smaller`, R`both are equally consistent`],
    R`<p>CV$_A=\dfrac{12}{60}\times100=20\%$; CV$_B=\dfrac{20}{80}\times100=25\%$. A smaller CV means more consistent.</p>`, 'Compare CVs, not SDs.'),
  I(2, 'weighted mean', R`Marks $80$, $70$ and $90$ carry weights $2$, $3$ and $5$. The weighted mean is`, 82,
    R`<p>$\dfrac{80\cdot2+70\cdot3+90\cdot5}{2+3+5}=\dfrac{160+210+450}{10}=82$.</p>`, 'Divide by the sum of weights, not by $3$.', { calc: () => (160 + 210 + 450) / 10 }),
  M(2, 'median', R`The median of the observations $5,\ 3,\ 12,\ 9,\ 4,\ 7$ is`, '6', ['7', '5', '6.7'],
    R`<p>Sorted: $3,4,5,7,9,12$. Median $=\dfrac{5+7}2=6$.</p>`, 'Sort first.'),
  M(2, 'mode', R`For grouped data with modal class $20\text{-}30$, $f_1=16$, $f_0=4$, $f_2=12$, the mode is`, '27.5', ['23.75', '22.5', '20.75'],
    R`<p>Mode $=l+\dfrac{f_1-f_0}{2f_1-f_0-f_2}\times h=20+\dfrac{16-4}{32-4-12}\times10=20+\dfrac{12}{16}\times10=27.5$.</p>`, 'The denominator is $2f_1-f_0-f_2$.'),

  // ---------- L3 ----------
  MT(3, 'change of scale', 'm1', R`Choose the correct matching for the List I and List II above.`, 'A-r, B-p, C-q, D-s', ['A-p, B-r, C-q, D-s', 'A-r, B-p, C-s, D-q', 'A-q, B-p, C-r, D-s'],
    R`<p>$\mathrm{SD}(ax+b)=|a|\,\sigma$. A: $a=1$, SD $=\sigma$ (r). B: $a=2$, SD $=2\sigma$ (p). C: $a=-3$, SD $=|-3|\sigma=3\sigma$ (q). D: $a=\dfrac1\sigma$, SD $=\dfrac\sigma\sigma=1$ (s).</p>`, 'A negative multiplier gives the positive factor $|a|$.'),
  MT(3, 'formulas', 'm2', R`Choose the correct matching for the List I and List II above.`, 'A-r, B-s, C-p, D-q', ['A-s, B-r, C-p, D-q', 'A-r, B-s, C-q, D-p', 'A-p, B-s, C-r, D-q'],
    R`<p>Mean deviation $=\dfrac1n\sum|x_i-\bar x|$ (r). Variance $=\dfrac1n\sum x_i^2-\bar x^2$ (s). CV $=\dfrac\sigma{\bar x}\times100$ (p). Mode $\approx3\,$median$\,-2\,$mean (q).</p>`, 'Variance has the squares of the observations; MD has absolute values.'),
  MT(3, 'mean, median, mode', 'm3', R`Choose the correct matching for the List I and List II above.`, 'A-s, B-p, C-q, D-r', ['A-p, B-s, C-q, D-r', 'A-s, B-p, C-r, D-q', 'A-q, B-p, C-s, D-r'],
    R`<p>Sum $=48$, mean $=6$ (s). Sorted data have $8$ values, the middle two are $6$ and $7$, so the median is $6.5$ (p). The value $8$ occurs three times: mode $8$ (q). Deviations from $6$: $3,2,2,0,1,2,2,2$, sum $14$, MD $=\dfrac{14}8=1.75$ (r).</p>`, 'Even number of values: average the two middle ones.'),
  I(3, 'combined variance', R`Group $A$ has $10$ observations with mean $12$ and variance $4$. Group $B$ has $15$ observations with mean $17$ and variance $9$. Find the variance of all $25$ observations.`, 13,
    R`<p>Combined mean $=\dfrac{120+255}{25}=15$. $d_1=12-15=-3$, $d_2=17-15=2$. Combined variance $=\dfrac{n_1(\sigma_1^2+d_1^2)+n_2(\sigma_2^2+d_2^2)}{n_1+n_2}=\dfrac{10(4+9)+15(9+4)}{25}=\dfrac{130+195}{25}=13$.</p>`, 'Do not average the variances; add the $d^2$ terms.', { calc: () => { const all = [...Array(10).fill(0), ...Array(15).fill(0)]; const n1 = 10, n2 = 15, m = (n1 * 12 + n2 * 17) / 25; return (n1 * (4 + (12 - m) ** 2) + n2 * (9 + (17 - m) ** 2)) / 25; } }),
  D(3, 'wrong observation', R`For $10$ observations the mean is $25$ and the SD is $5$. An observation $40$ was copied as $30$. Find the correct standard deviation.`, 6.6332,
    R`<p>$\sum x=250$ and $\sum x^2=10(\sigma^2+\bar x^2)=10(25+625)=6500$. Correct: $\sum x=250-30+40=260$, mean $26$. $\sum x^2=6500-900+1600=7200$. Variance $=\dfrac{7200}{10}-26^2=720-676=44$. SD $=\sqrt{44}\approx6.63$.</p>`, 'Fix $\\sum x^2$ as well as $\\sum x$.', { calc: () => sqrt(7200 / 10 - 26 ** 2) }),
  I(3, 'variance and SD', R`The terms $2,5,8,11,14$ form an arithmetic progression with common difference $3$. Find their variance.`, 18,
    R`<p>For $n$ terms of an AP with difference $d$, variance $=\dfrac{d^2(n^2-1)}{12}=\dfrac{9\cdot24}{12}=18$. Check directly: mean $8$, squared deviations $36,9,0,9,36$, sum $90$, $\dfrac{90}5=18$.</p>`, 'Use $d^2$, not $d$.', { calc: () => varp([2, 5, 8, 11, 14]) }),
  I(3, 'variance and SD', R`For $10$ observations, $\sum(x_i-5)^2=100$ and $\sum(x_i-8)^2=130$. Find the variance of the observations.`, 9,
    R`<p>For any number $a$: $\sum(x_i-a)^2=n\sigma^2+n(\bar x-a)^2$. So $100=10\sigma^2+10(\bar x-5)^2$ and $130=10\sigma^2+10(\bar x-8)^2$. Subtracting: $30=10[(\bar x-8)^2-(\bar x-5)^2]=10(-3)(2\bar x-13)$, so $2\bar x-13=-1$, $\bar x=6$. Then $100=10\sigma^2+10$, $\sigma^2=9$.</p>`, 'Use $\\sum(x-a)^2=n\\sigma^2+n(\\bar x-a)^2$.', { calc: () => { const xb = 6; return 100 / 10 - (xb - 5) ** 2; } }),
  I(3, 'mean, median, mode', R`In a moderately skewed distribution the mean is $30$ and the median is $28$. Estimate the mode.`, 24,
    R`<p>Mode $\approx3\,$median$\,-2\,$mean $=84-60=24$.</p>`, 'Median gets the factor $3$.', { calc: () => 3 * 28 - 2 * 30 }),
  I(3, 'grouped data', R`The classes $0\text{-}10,\ 10\text{-}20,\ 20\text{-}30,\ 30\text{-}40,\ 40\text{-}50$ have frequencies $4,8,f,10,6$ and the mean is $26.5$. Find $f$.`, 12,
    R`<p>Class marks $5,15,25,35,45$. $\sum fx=20+120+25f+350+270=760+25f$. $N=28+f$. Mean $=26.5$: $760+25f=26.5(28+f)=742+26.5f$. So $18=1.5f$ and $f=12$.</p>`, 'Remember $f$ is also in $N$.', { calc: () => (742 - 760) / (25 - 26.5) }),
  D(3, 'grouped data', R`The classes $0\text{-}20,\ 20\text{-}40,\ 40\text{-}60,\ 60\text{-}80,\ 80\text{-}100$ have frequencies $6,10,16,12,6$. Find the median.`, 51.25,
    R`<p>$N=50$, $\dfrac N2=25$. Cumulative frequencies: $6,16,32,44,50$. The median class is $40\text{-}60$, with $l=40$, $cf=16$, $f=16$, $h=20$. Median $=40+\dfrac{25-16}{16}\times20=40+11.25=51.25$.</p>`, 'The median class is where the cumulative frequency first reaches $N/2$.', { calc: () => gMedian([[0, 20], [20, 40], [40, 60], [60, 80], [80, 100]], [6, 10, 16, 12, 6]) }),
  D(3, 'grouped data', R`For the classes $0\text{-}4,\ 4\text{-}8,\ 8\text{-}12,\ 12\text{-}16$ with frequencies $2,5,8,5$, find the standard deviation.`, 3.7094,
    R`<p>Class marks $2,6,10,14$. $\sum fx=4+30+80+70=184$, $N=20$, mean $9.2$. $\sum fx^2=8+180+800+980=1968$. Variance $=\dfrac{1968}{20}-9.2^2=98.4-84.64=13.76$. SD $=\sqrt{13.76}\approx3.71$.</p>`, 'Square the class mark, then multiply by the frequency.', { calc: () => sqrt(gVar([[0, 4], [4, 8], [8, 12], [12, 16]], [2, 5, 8, 5])) }),
  I(3, 'change of scale', R`The mean of $x$ is $12$ and its SD is $4$. Find the sum of the mean and the SD of $y=3x-2$.`, 46,
    R`<p>Mean of $y=3\cdot12-2=34$. SD of $y=3\cdot4=12$. Sum $=46$.</p>`, 'The shift $-2$ affects only the mean.', { calc: () => 34 + 12 }),
  I(3, 'median', R`$x$ takes values $2,3,4,5,6$ with frequencies $3,7,9,6,5$. Find the median.`, 4,
    R`<p>$N=30$. Cumulative frequencies: $3,10,19,25,30$. The median is the average of the $15$th and $16$th values; both lie where the cumulative frequency passes $15$ (the value $4$). Median $=4$.</p>`, 'Average the 15th and 16th, both are in the same group.', { calc: () => 4 }),
  I(3, 'mean', R`Find the mean of $1^2,2^2,3^2,4^2,5^2$.`, 11,
    R`<p>Sum $=1+4+9+16+25=55$. Mean $=\dfrac{55}5=11$. (General: $\dfrac{(n+1)(2n+1)}6=\dfrac{6\cdot11}6=11$.)</p>`, '', { calc: () => mean([1, 4, 9, 16, 25]) }),
  D(3, 'coefficient of variation', R`Find the coefficient of variation (in per cent) of $10,20,30,40,50$.`, 47.14,
    R`<p>Mean $=30$. Variance $=\dfrac{400+100+0+100+400}5=200$. SD $=\sqrt{200}=14.14$. CV $=\dfrac{14.14}{30}\times100\approx47.14\%$.</p>`, 'Express CV as a percentage.', { calc: () => (sdp([10, 20, 30, 40, 50]) / 30) * 100 }),
  D(3, 'range', R`The largest observation is $80$ and the smallest is $20$. Find the coefficient of range.`, 0.6,
    R`<p>Coefficient of range $=\dfrac{L-S}{L+S}=\dfrac{60}{100}=0.6$.</p>`, 'Divide by the sum, not by the largest value.', { calc: () => 60 / 100 }),
  I(3, 'change of scale', R`The mean of $20$ observations is $15$. Each observation is multiplied by $2$ and then $3$ is subtracted. Find the new mean.`, 27,
    R`<p>New mean $=2\cdot15-3=27$.</p>`, ''),
  I(3, 'variance and SD', R`Six observations have mean $5$ and variance $4$. Find $\sum x_i^2$.`, 174,
    R`<p>$\dfrac{\sum x^2}n=\sigma^2+\bar x^2=4+25=29$, so $\sum x^2=6\times29=174$.</p>`, 'The mean of squares is variance plus mean squared.', { calc: () => 6 * (4 + 25) }),
  M(3, 'mean deviation', R`The mean deviation about the mean of two observations $a$ and $b$ is`, R`$\dfrac{|a-b|}2$`, [R`$|a-b|$`, R`$\dfrac{(a-b)^2}4$`, R`$\dfrac{a+b}2$`],
    R`<p>The mean is $\dfrac{a+b}2$, and each observation is $\dfrac{|a-b|}2$ from it. So the mean deviation is $\dfrac{|a-b|}2$. (The SD is also $\dfrac{|a-b|}2$.)</p>`, 'Each deviation is half the gap.'),
  A(3, 'change of origin', R`Adding $10$ to every observation does not change the variance.`, R`Variance depends only on the deviations of the observations from their mean.`, 0,
    R`<p>Every observation and the mean both move by $10$, so each deviation $x_i-\bar x$ is unchanged. R explains A.</p>`, ''),
  A(3, 'mean deviation', R`The mean deviation of a data set about its median is never more than its mean deviation about its mean.`, R`The sum $\sum|x_i-a|$ is smallest when $a$ is the median.`, 0,
    R`<p>R is a standard result: the median minimises the sum of absolute deviations. So the MD about the median is $\le$ the MD about any other point, including the mean. R explains A.</p>`, 'The mean minimises squared deviations, the median absolute ones.'),
  A(3, 'combined mean', R`If two groups have means $\bar x_1$ and $\bar x_2$, the mean of the combined group is $\dfrac{\bar x_1+\bar x_2}2$.`, R`The combined mean is a weighted average of the two group means, weighted by group sizes.`, 3,
    R`<p>A is false unless the groups have equal sizes: the correct combined mean is $\dfrac{n_1\bar x_1+n_2\bar x_2}{n_1+n_2}$, which is R. R is true.</p>`, 'Larger groups pull the mean towards themselves.'),
  S(3, 'properties', R`The sum of deviations from the median is always $0$.`, R`The sum of deviations from the mean is always $0$.`, 2,
    R`<p>I is false: for $1,2,9$ the median is $2$ and the deviations $-1,0,7$ add to $6$. II is true.</p>`, 'Only the mean has the zero-sum property.'),
  S(3, 'change of scale', R`The variance is unchanged by a change of origin.`, R`If every observation is multiplied by $a$, the variance is multiplied by $a^2$.`, 0,
    R`<p>Both are true. A shift does not alter deviations; scaling by $a$ scales each deviation by $a$, hence squares by $a^2$.</p>`, ''),
  SC(3, 'properties', [R`The mean is affected by extreme values.`, R`The median is affected by extreme values.`, R`The SD is the positive square root of the variance.`, R`The mean deviation about the mean is never greater than the SD.`], '3', ['1', '2', '4'],
    R`<p>(1) true. (2) false: the median depends only on the middle value(s). (3) true. (4) true (a result for the mean deviation about the mean, since $\sum|d|/n\le\sqrt{\sum d^2/n}$). So $3$ are correct.</p>`, 'Medians resist outliers.'),
  X(3, 'change of origin', R`Each observation is increased by $7$. Which of the following do not change?`, [R`variance`, R`standard deviation`, R`mean deviation about the mean`, R`median`], [0, 1, 2],
    R`<p>The spread measures use deviations, so they are unchanged. The median shifts by $7$ along with the data.</p>`, 'Median is a location measure, not a spread measure.'),
  X(3, 'variance and SD', R`For the data $2,4,6,8,10$, which of the following are correct?`, [R`mean $=6$`, R`variance $=8$`, R`mean deviation about the mean $=2$`, R`standard deviation $=2\sqrt2$`], [0, 1, 3],
    R`<p>Mean $=6$. Squared deviations $16,4,0,4,16$, sum $40$, variance $8$, SD $=\sqrt8=2\sqrt2$. Absolute deviations $4,2,0,2,4$, sum $12$, mean deviation $=\dfrac{12}5=2.4\ne2$.</p>`, 'MD and SD are different even when they look close.'),
  X(3, 'change of scale', R`Each observation is multiplied by $-2$. Which of the following are correct for the new data?`, [R`the mean is multiplied by $-2$`, R`the SD is multiplied by $-2$`, R`the variance is multiplied by $4$`, R`the mean deviation about the mean is multiplied by $2$`], [0, 2, 3],
    R`<p>The mean follows the data: $\times(-2)$. The SD and the mean deviation use positive deviations, so they are multiplied by $|-2|=2$. The variance is multiplied by $(-2)^2=4$. So B is wrong, since an SD cannot be negative.</p>`, 'Spread is never negative.'),

  PD(3, 'grouped data', 'p1', R`Find the mean mark.`, 37.8,
    R`<p>Class marks $15,25,35,45,55$. $\sum fx=75+200+525+540+550=1890$. Mean $=\dfrac{1890}{50}=37.8$.</p>`, 'Use class marks.', { calc: () => gMean(CL1, F1) }),
  PI(3, 'grouped data', 'p1', R`Find the median mark.`, 38,
    R`<p>$N=50$, $\dfrac N2=25$. Cumulative frequencies: $5,13,28,40,50$. Median class $30\text{-}40$: $l=30$, $cf=13$, $f=15$, $h=10$. Median $=30+\dfrac{25-13}{15}\times10=30+8=38$.</p>`, 'Use $cf$ of the class before the median class.', { calc: () => gMedian(CL1, F1) }),
  PD(3, 'grouped data', 'p1', R`Find the modal mark.`, 37,
    R`<p>Modal class $30\text{-}40$ ($f_1=15$), $f_0=8$, $f_2=12$. Mode $=30+\dfrac{15-8}{30-8-12}\times10=30+7=37$.</p>`, '', { calc: () => gMode(CL1, F1) }),
  PD(4, 'grouped data', 'p1', R`Find the standard deviation of the marks.`, 12.3355,
    R`<p>Mean $37.8$. $\sum fx^2=1125+5000+18375+24300+30250=79050$. Variance $=\dfrac{79050}{50}-37.8^2=1581-1428.84=152.16$. SD $=\sqrt{152.16}\approx12.34$.</p>`, 'Subtract the square of the mean.', { calc: () => sqrt(gVar(CL1, F1)) }),
  PI(3, 'combined mean', 'p2', R`Find the mean score of the merged group.`, 66,
    R`<p>$\dfrac{20\cdot60+30\cdot70}{50}=\dfrac{1200+2100}{50}=66$.</p>`, '', { calc: () => (1200 + 2100) / 50 }),
  PD(4, 'combined variance', 'p2', R`Find the standard deviation of the merged group.`, 8.438,
    R`<p>Mean $66$. $d_A=60-66=-6$, $d_B=70-66=4$. Variance $=\dfrac{20(64+36)+30(36+16)}{50}=\dfrac{2000+1560}{50}=71.2$. SD $=\sqrt{71.2}\approx8.438$.</p>`, 'Use the SDs squared: $64$ and $36$.', { calc: () => sqrt((20 * (64 + 36) + 30 * (36 + 16)) / 50) }),
  PD(4, 'coefficient of variation', 'p2', R`Find the coefficient of variation (in per cent) of the merged group.`, 12.785,
    R`<p>CV $=\dfrac{\sigma}{\bar x}\times100=\dfrac{\sqrt{71.2}}{66}\times100=\dfrac{8.438}{66}\times100\approx12.79\%$.</p>`, 'Keep more digits in the SD.', { calc: () => (sqrt(71.2) / 66) * 100 }),
  PI(3, 'wrong observation', 'p3', R`Find the correct mean.`, 39,
    R`<p>$\sum x=400$. Correct $\sum x=400-38+28=390$. Mean $=39$.</p>`, '', { calc: () => (400 - 38 + 28) / 10 }),
  PI(4, 'wrong observation', 'p3', R`Find the correct variance.`, 38,
    R`<p>$\sum x^2=10(25+1600)=16250$. Correct: $16250-38^2+28^2=16250-1444+784=15590$. Variance $=1559-39^2=1559-1521=38$.</p>`, 'Correct the sum of squares with the squares of the two values.', { calc: () => (16250 - 1444 + 784) / 10 - 39 ** 2 }),
  PD(4, 'wrong observation', 'p3', R`Find the correct coefficient of variation, in per cent.`, 15.8,
    R`<p>SD $=\sqrt{38}=6.164$. CV $=\dfrac{6.164}{39}\times100\approx15.81\%$.</p>`, '', { calc: () => (sqrt(38) / 39) * 100 }),
  PI(3, 'variance and SD', 'p4', R`Find the mean of the observations.`, 9,
    R`<p>$\sum x=\sum(x-8)+8\cdot9=9+72=81$, so the mean is $\dfrac{81}9=9$.</p>`, '', { calc: () => (9 + 72) / 9 }),
  PI(4, 'variance and SD', 'p4', R`Find the variance of the observations.`, 4,
    R`<p>For deviations $d=x-8$: variance of $x$ = variance of $d=\dfrac{\sum d^2}n-\left(\dfrac{\sum d}n\right)^2=\dfrac{45}9-1^2=5-1=4$.</p>`, 'The shift by $8$ does not change the variance.', { calc: () => 45 / 9 - 1 }),
  PI(4, 'variance and SD', 'p4', R`Find $\sum x_i^2$.`, 765,
    R`<p>$\sum(x-8)^2=\sum x^2-16\sum x+64\cdot9$. With $\sum x=81$: $45=\sum x^2-1296+576$, so $\sum x^2=45+720=765$. (Check: $\dfrac{765}9-81=85-81=4$.)</p>`, '', { calc: () => 45 + 16 * 81 - 64 * 9 }),

  // ---------- L4 / L5 and more ----------
  I(4, 'variance and SD', R`Six observations have mean $7$ and variance $10$. Four of them are $2,5,6,8$. Find the absolute difference of the other two.`, 3,
    R`<p>Total $=42$, so the other two add up to $42-21=21$. $\sum x^2=6(10+49)=354$; the four known squares add to $4+25+36+64=129$, so the other two have $x^2+y^2=225$. Then $2xy=21^2-225=216$ and $(x-y)^2=225-216=9$, so $|x-y|=3$. (They are $9$ and $12$.)</p>`, 'Use $(x-y)^2=2(x^2+y^2)-(x+y)^2$.', { calc: () => sqrt(2 * 225 - 21 ** 2) }),
  I(4, 'variance and SD', R`Five observations have mean $4$ and variance $5.2$. Three of them are $1,2,6$. Find the product of the other two.`, 28,
    R`<p>Sum $=20$, so the other two add to $11$. $\sum x^2=5(5.2+16)=106$; known squares $1+4+36=41$; so $x^2+y^2=65$. $2xy=121-65=56$, so $xy=28$. (They are $4$ and $7$.)</p>`, 'Use both the sum and the sum of squares.', { calc: () => (11 * 11 - 65) / 2 }),
  I(4, 'combined variance', R`Three groups of $10$, $20$ and $20$ observations have the same mean $15$ and variances $4$, $9$ and $14$. Find the variance of all $50$ observations.`, 10,
    R`<p>The means are equal, so every $d$ is $0$ and the combined variance is the weighted average: $\dfrac{10\cdot4+20\cdot9+20\cdot14}{50}=\dfrac{40+180+280}{50}=10$.</p>`, 'If the group means differ, add the $d^2$ terms.', { calc: () => (40 + 180 + 280) / 50 }),
  D(4, 'wrong observation', R`Ten observations have mean $9$ and variance $13$. Two of them, $4$ and $16$, are removed. Find the variance of the remaining $8$.`, 6.9375,
    R`<p>$\sum x=90$, $\sum x^2=10(13+81)=940$. After removing $4$ and $16$: $\sum x=70$, $\sum x^2=940-16-256=668$, $n=8$. Mean $=8.75$. Variance $=\dfrac{668}8-8.75^2=83.5-76.5625=6.9375\approx6.94$.</p>`, 'Remove the squares, not the numbers, from $\\sum x^2$.', { calc: () => 668 / 8 - 8.75 ** 2 }),
  D(4, 'properties', R`Nine observations have variance $18$. A tenth observation equal to their mean is added. Find the new variance.`, 16.2,
    R`<p>The mean stays the same. The sum of squared deviations is unchanged ($9\times18=162$), because the new deviation is $0$. Divide by $10$: variance $=\dfrac{162}{10}=16.2$.</p>`, 'The mean is unchanged but $n$ grows.', { calc: () => (9 * 18) / 10 }),
  I(4, 'variance and SD', R`Find the variance of the first $10$ odd natural numbers $1,3,5,\dots,19$.`, 33,
    R`<p>It is an AP with $d=2$ and $n=10$: variance $=\dfrac{d^2(n^2-1)}{12}=\dfrac{4\cdot99}{12}=33$.</p>`, '', { calc: () => varp([1, 3, 5, 7, 9, 11, 13, 15, 17, 19]) }),
  I(4, 'variance and SD', R`The variance of the first $n$ natural numbers is $14$. Find $n$.`, 13,
    R`<p>$\dfrac{n^2-1}{12}=14$, so $n^2=169$ and $n=13$.</p>`, 'Reject $n=-13$.', { calc: () => sqrt(12 * 14 + 1) }),
  I(4, 'variance and SD', R`For $100$ observations the mean is $50$ and the SD is $10$. Find $\sum x_i^2$.`, 260000,
    R`<p>$\dfrac{\sum x^2}{100}=\sigma^2+\bar x^2=100+2500=2600$, so $\sum x^2=260000$.</p>`, ''),
  D(4, 'grouped data', R`For the classes $10\text{-}20,\dots,50\text{-}60$ with frequencies $5,8,15,12,10$ (mean $37.8$), find the mean deviation about the mean.`, 10.336,
    R`<p>Class marks $15,25,35,45,55$; $|x-37.8|=22.8,12.8,2.8,7.2,17.2$. $\sum f|x-\bar x|=114+102.4+42+86.4+172=516.8$. Mean deviation $=\dfrac{516.8}{50}=10.336\approx10.34$.</p>`, 'Weight each absolute deviation by its frequency.', { calc: () => gMdMean(CL1, F1) }),
  I(4, 'change of scale', R`For $10$ observations $x_i$ the mean is $5$ and the variance is $4$. Let $y_i=2x_i+3$. Find $\sum y_i^2$.`, 1850,
    R`<p>Mean of $y=13$, variance of $y=4\cdot4=16$. $\dfrac{\sum y^2}{10}=16+169=185$, so $\sum y^2=1850$.</p>`, 'Variance scales by $a^2=4$.', { calc: () => 10 * (16 + 13 ** 2) }),
  I(4, 'mean deviation', R`Find the least possible value of $|a-1|+|a-3|+|a-5|+|a-9|$ over real $a$.`, 10,
    R`<p>The sum of absolute deviations is least at the median of the four points, i.e. any $a$ between $3$ and $5$. At $a=4$: $3+1+1+5=10$.</p>`, 'The median, not the mean ($4.5$), but here both work.', { calc: () => { let m = 1e9; for (let a = 0; a <= 10; a += 0.01) m = Math.min(m, abs(a - 1) + abs(a - 3) + abs(a - 5) + abs(a - 9)); return Math.round(m * 100) / 100; } }),
  I(4, 'variance and SD', R`The least possible value of $\sum(x_i-a)^2$ over real $a$ for the data $1,3,5,7$ is`, 20,
    R`<p>It is least at $a=\bar x=4$: $9+1+1+9=20$.</p>`, 'The mean minimises squared deviations.', { calc: () => varp([1, 3, 5, 7]) * 4 }),
  I(3, 'mixed', R`The arithmetic mean of two positive numbers is $10$ and their geometric mean is $8$. Find their standard deviation.`, 6,
    R`<p>$x+y=20$ and $xy=64$. They are the roots of $t^2-20t+64=0$: $4$ and $16$. SD $=\dfrac{|16-4|}2=6$.</p>`, 'For two numbers, SD $=\\dfrac{|a-b|}2$.', { calc: () => sdp([4, 16]) }),
  D(3, 'mixed', R`A fair die is thrown once. Find the variance of the number shown.`, 2.9167,
    R`<p>Values $1,\dots,6$ with equal chance. Mean $=3.5$. Variance $=\dfrac{36-1}{12}=\dfrac{35}{12}\approx2.92$.</p>`, 'Variance of $1,\\dots,n$ is $\\dfrac{n^2-1}{12}$.', { calc: () => varp([1, 2, 3, 4, 5, 6]) }),
  I(5, 'extreme values', R`Ten real numbers all lie in $[0,10]$. Find the greatest possible value of their variance.`, 25,
    R`<p>Variance is largest when the numbers are as spread as possible: half of them at $0$ and half at $10$. Mean $=5$, every deviation is $5$, so variance $=25$. (In general the variance is at most $\dfrac{(b-a)^2}4$.)</p>`, 'Check with $5$ zeros and $5$ tens.', { calc: () => varp([0, 0, 0, 0, 0, 10, 10, 10, 10, 10]) }),
  I(5, 'change of scale', R`The numbers $a,a+d,\dots,a+4d$ (five terms, $d>0$) have variance $8$. Find $d$.`, 2,
    R`<p>Variance $=\dfrac{d^2(5^2-1)}{12}=2d^2=8$, so $d=2$.</p>`, 'It does not depend on $a$.', { calc: () => sqrt(8 / 2) }),
  I(5, 'wrong observation', R`Ten observations have mean $5$ and variance $4$. One observation $k$ is replaced by $2k$ and the new mean is $6$. Find the new variance.`, 23,
    R`<p>New sum $=50-k+2k=50+k=60$, so $k=10$. Old $\sum x^2=10(4+25)=290$. New $\sum x^2=290-100+400=590$. New variance $=59-36=23$.</p>`, 'Find $k$ from the mean first.', { calc: () => 590 / 10 - 36 }),
  I(5, 'combined variance', R`Two groups of the same size each have variance $9$. Their means are $10$ and $18$. Find the variance of the combined group.`, 25,
    R`<p>Combined mean $=14$, so $d=\pm4$ for both groups. Variance $=9+4^2=25$. (In general $\sigma^2+\left(\dfrac{m_1-m_2}2\right)^2$.)</p>`, 'The gap of the means adds to the variance.', { calc: () => 9 + ((18 - 10) / 2) ** 2 }),
  A(4, 'properties', R`The variance of a data set can be negative.`, R`The variance is the mean of the squares of the deviations from the mean.`, 3,
    R`<p>A is false: squares are never negative, so variance $\ge0$ (and $=0$ only if all observations are equal). R is a true statement of the definition.</p>`, ''),
  A(4, 'mode', R`Every data set has exactly one mode.`, R`A data set in which two values occur equally often and most often is called bimodal.`, 3,
    R`<p>A is false: a data set may have two or more modes (or none, if every value occurs once, depending on convention). R is true.</p>`, 'Check by example: $1,1,2,2,3$.'),
  A(4, 'change of scale', R`If every observation is multiplied by $-2$, the standard deviation is multiplied by $2$.`, R`$\mathrm{SD}(ax+b)=|a|\,\mathrm{SD}(x)$.`, 0,
    R`<p>R is the rule and gives the factor $|-2|=2$ for A. Both true, R explains A.</p>`, ''),
  S(4, 'properties', R`For two observations $a$ and $b$, the SD equals $\dfrac{|a-b|}2$.`, R`For two observations $a$ and $b$, the mean deviation about the mean equals $\dfrac{|a-b|}2$.`, 0,
    R`<p>The mean is $\dfrac{a+b}2$ and each observation is $\dfrac{|a-b|}2$ away. So the MD is $\dfrac{|a-b|}2$, and the variance is $\dfrac{|a-b|^2}4$, giving SD $\dfrac{|a-b|}2$. Both true.</p>`, ''),
  S(4, 'coefficient of variation', R`The coefficient of variation has no units.`, R`The coefficient of variation is useful for comparing the variability of two data sets measured in different units.`, 0,
    R`<p>CV $=\dfrac\sigma{\bar x}\times100$: units cancel. That is why it can compare, for example, heights in cm with weights in kg. Both true.</p>`, ''),
  S(4, 'properties', R`If a data set has mean $10$ and SD $0$, every observation is $10$.`, R`Adding a new observation equal to the mean does not change the variance.`, 1,
    R`<p>I is true: SD $=0$ means every deviation is $0$. II is false: the sum of squared deviations stays the same but is divided by $n+1$, so the variance decreases (for non-constant data).</p>`, 'The mean stays; the variance shrinks.'),
  S(5, 'properties', R`In a data set of at least $3$ observations, making the largest observation larger (without changing the others) never changes the median.`, R`Making the largest observation larger never changes the mean.`, 1,
    R`<p>I is true: with at least $3$ values the median depends only on the middle position(s), which are not the largest value. II is false: the sum increases, so the mean increases.</p>`, 'Mean reacts to every value, median only to the order.'),
  SC(4, 'properties', [R`For two observations, the mean deviation about the mean equals the SD.`, R`For every data set, the mean deviation about the mean is at most the SD.`, R`The variance of $2x$ is twice the variance of $x$.`, R`The variance of $x$ and of $x+c$ are equal.`], '3', ['1', '2', '4'],
    R`<p>(1) true. (2) true. (3) false: the variance is multiplied by $4$. (4) true. Three statements are correct.</p>`, 'Variance scales with the square.'),
  X(4, 'combined variance', R`Two groups have means $\bar x_1,\bar x_2$ and variances $\sigma_1^2,\sigma_2^2$. Which of the following are correct?`, [R`the combined mean lies between $\bar x_1$ and $\bar x_2$`, R`the combined variance is always the weighted mean of $\sigma_1^2,\sigma_2^2$`, R`the combined variance is at least the weighted mean of $\sigma_1^2,\sigma_2^2$`, R`if $\bar x_1=\bar x_2$, the combined variance is the weighted mean of $\sigma_1^2,\sigma_2^2$`], [0, 2, 3],
    R`<p>(A) the combined mean is a weighted average of the two, so it lies between them. (B) false: the $d^2$ terms add to it. (C) true: the $d^2$ terms are non-negative. (D) true: when the means are equal, $d_1=d_2=0$.</p>`, 'The extra part comes from the gap between the means.'),
  X(5, 'properties', R`Which of the following hold for every finite data set (population measures)?`, [R`SD $\ge$ mean deviation about the mean`, R`SD $\le\dfrac{\text{range}}2$`, R`mean deviation about the median $\le$ mean deviation about the mean`, R`variance $\le$ range`], [0, 1, 2],
    R`<p>(A) true (root-mean-square $\ge$ mean absolute value). (B) true: all values lie in an interval of length $L$, so the variance is at most $\dfrac{L^2}4$. (C) true: the median minimises the mean absolute deviation. (D) false: for $0$ and $100$, the variance is $2500>100$.</p>`, 'A unit problem: variance has squared units, range has plain units.'),


  // ---------- more items ----------
  I(1, 'mean', R`The mean of $2,4,6,8$ is`, 5,
    R`<p>Sum $=20$, number $=4$, mean $=5$.</p>`, '', { calc: () => mean([2, 4, 6, 8]) }),
  M(1, 'median', R`The median of $7,\ 1,\ 5$ is`, '5', ['1', '7', '4.33'],
    R`<p>Sorted: $1,5,7$. The middle value is $5$.</p>`, 'The mean is $4.33$, not the median.'),
  I(2, 'mean', R`The mean of $5$ numbers is $12$. When one number is removed, the mean of the remaining four is $10$. Find the removed number.`, 20,
    R`<p>Total of $5$ numbers $=60$. Total of the four $=40$. The removed number is $60-40=20$.</p>`, ''),
  I(2, 'mean', R`Find the mean of the first $20$ even natural numbers.`, 21,
    R`<p>The numbers $2,4,\dots,40$ have sum $2\cdot\dfrac{20\cdot21}2=420$. Mean $=\dfrac{420}{20}=21$ (it is $n+1$).</p>`, '', { calc: () => mean(Array.from({ length: 20 }, (_, i) => 2 * (i + 1))) }),
  I(2, 'mode', R`$x$ takes the values $1,2,3,4,5$ with frequencies $4,9,12,7,3$. Find the mode.`, 3,
    R`<p>The mode is the value with the largest frequency: $12$ occurs for $x=3$.</p>`, 'The answer is the value, not the frequency.'),
  I(2, 'harmonic mean', R`A car covers half of a journey at $60$ km/h and the other half at $40$ km/h. Its average speed for the whole journey, in km/h, is`, 48,
    R`<p>Take the half-distance $d$. Time $=\dfrac d{60}+\dfrac d{40}=\dfrac{5d}{120}=\dfrac d{24}$. Average speed $=\dfrac{2d}{d/24}=48$ km/h. This is the harmonic mean, not the arithmetic mean $50$.</p>`, 'Equal distances mean the harmonic mean applies.', { calc: () => 2 / (1 / 60 + 1 / 40) }),
  M(2, 'grouped data', R`For grouped data, the median is given by (with $l$ the lower limit of the median class, $cf$ the cumulative frequency before it, $f$ its frequency and $h$ its width)`, R`$l+\dfrac{\frac N2-cf}{f}\times h$`, [R`$l+\dfrac{N-cf}{f}\times h$`, R`$l+\dfrac{\frac N2-f}{cf}\times h$`, R`$l+\dfrac{f_1-f_0}{2f_1-f_0-f_2}\times h$`],
    R`<p>The median is the $\dfrac N2$th value. We need $\dfrac N2-cf$ more observations from the median class, spread evenly over width $h$. The last option is the formula for the mode.</p>`, 'Do not mix the mode formula with the median formula.'),
  M(2, 'change of scale', R`The standard deviation of a set of observations is $5$. Each observation is multiplied by $3$. The variance of the new set is`, '225', ['15', '75', '45'],
    R`<p>New SD $=3\cdot5=15$. New variance $=15^2=225$.</p>`, 'Square it at the end.'),
  M(2, 'properties', R`For the data $5,5,5,5,5$,`, R`the SD is $0$ and the coefficient of variation is $0$`, [R`the SD is $5$`, R`the variance is $5$ and the SD is $\sqrt5$`, R`the coefficient of variation is $100\%$`],
    R`<p>All observations equal the mean $5$, so every deviation is $0$: variance and SD are $0$, hence CV $=0$.</p>`, ''),
  X(2, 'properties', R`Which of the following are measures of dispersion?`, [R`range`, R`mean deviation`, R`median`, R`variance`], [0, 1, 3],
    R`<p>Range, mean deviation and variance measure how spread out the data are. The median is a measure of central tendency.</p>`, 'Central tendency tells where, dispersion tells how wide.'),
  I(4, 'combined variance', R`Four observations have mean $8$ and variance $5$. A fifth observation $x$ is added and the new mean is $9$. Find the new variance.`, 8,
    R`<p>Old sum $=32$, new sum $=45$, so $x=13$. Old $\sum x^2=4(5+64)=276$. New $\sum x^2=276+169=445$. New variance $=\dfrac{445}5-81=89-81=8$.</p>`, 'Find $x$ first.', { calc: () => 445 / 5 - 81 }),
  I(5, 'extreme values', R`Five distinct integers are chosen to make the variance as small as possible. Find that least variance.`, 2,
    R`<p>The least spread comes from five consecutive integers, like $1,2,3,4,5$: variance $=\dfrac{5^2-1}{12}=2$. Any other choice of five distinct integers has at least this spread.</p>`, 'Distinct integers cannot be closer than consecutive ones.', { calc: () => varp([1, 2, 3, 4, 5]) }),
  I(5, 'variance and SD', R`Four numbers in AP have mean $10$ and variance $5$. Find the largest of the four numbers.`, 13,
    R`<p>For $4$ terms of an AP: variance $=\dfrac{d^2(16-1)}{12}=\dfrac{5d^2}4=5$, so $d=2$. The mean is $10$, so the terms are $7,9,11,13$. The largest is $13$.</p>`, 'Take $d>0$ for increasing terms.', { calc: () => 10 + 1.5 * 2 }),
  M(5, 'extreme values', R`To the numbers $1,2,\dots,10$ one more observation $x$ is added. The variance of the $11$ numbers is least when $x$ equals`, R`$5.5$`, [R`$5$`, R`$6$`, R`$0$`],
    R`<p>The sum of squared deviations from the new mean is $\sum_{10}(i-\bar y)^2+(x-\bar y)^2$, where $\bar y$ is the new mean. Taking $x$ equal to the old mean $5.5$ makes the new mean $5.5$ and $(x-\bar y)^2=0$, which is the smallest possible. Any other $x$ adds a positive amount (and the denominator is the same $11$).</p>`, 'A new point at the mean adds zero to the squared deviations.'),
  M(3, 'mean deviation', R`Which statement about the mean deviation is NOT correct?`, R`It is least when taken about the mean`, [R`It is least when taken about the median`, R`It uses absolute values of deviations`, R`It is expressed in the same units as the data`],
    R`<p>The mean deviation is least about the median, not about the mean (the mean minimises the sum of squares). The other statements are true.</p>`, 'Read the word NOT.'),
  M(3, 'coefficient of variation', R`Two data sets $P$ and $Q$ have means $40$ and $50$ and standard deviations $6$ and $7$. Which is more variable relatively, and by how much (CV)?`, R`$P$: CV $15\%$ against $14\%$ for $Q$`, [R`$Q$: CV $14\%$ against $15\%$ for $P$`, R`$Q$, because its SD is larger`, R`both equal at $15\%$`],
    R`<p>CV$_P=\dfrac6{40}\times100=15\%$, CV$_Q=\dfrac7{50}\times100=14\%$. $P$ has the larger CV, so $P$ is relatively more variable.</p>`, 'Larger SD does not mean larger relative variation.'),
  M(3, 'mixed', R`The mean of $n$ observations is $\bar x$. The observations are $x,\ x+1,\ \dots,\ x+n-1$ with $x=\bar x-\dfrac{n-1}2$. If $n=5$ and the mean is $12$, the observations are`, R`$10,11,12,13,14$`, [R`$12,13,14,15,16$`, R`$8,10,12,14,16$`, R`$9,11,12,13,15$`],
    R`<p>For consecutive integers the mean is the middle one. With $5$ terms and mean $12$, the middle is $12$: $10,11,12,13,14$.</p>`, ''),
];

items.forEach((it, i) => { it.id = `st-${String(i + 1).padStart(3, '0')}`; });

// ---------- number templates ----------
const list = (rng, n, lo, hi) => Array.from({ length: n }, () => int(rng, lo, hi));
const L = (a) => a.join(', ');
const wrongNums = (right, cands) => { const o = []; for (const c of [...cands, right + 1, right - 1, right + 2, right - 2, right + 3]) if (c !== right && !o.includes(c) && o.length < 3) o.push(c); return o.map((x) => '$' + x + '$'); };
/** a list of n integers in [lo,hi] whose sum is divisible by n */
const listDiv = (rng, n, lo, hi) => { const a = list(rng, n, lo, hi); const r = sum(a) % n; a[0] += r ? n - r : 0; return a; };
const clsT = (cl) => cl.map(([l, h]) => `${l}-${h}`).join(', ');
const mkClasses = (rng, w = 10, k = 5, start = 0) => { const s = start + w * int(rng, 0, 2); const cl = Array.from({ length: k }, (_, i) => [s + i * w, s + (i + 1) * w]); const f = Array.from({ length: k }, () => int(rng, 3, 15)); return { cl, f }; };

const gens = [
  gen('st-g01', 1, 'nat', 'numeric', 'mean, median, range', (rng) => {
    const v = int(rng, 0, 3), n = choose(rng, [5, 7, 9]);
    const a = v === 0 ? listDiv(rng, n, 3, 30) : list(rng, n, 3, 40);
    if (v === 0) { const answer = mean(a); return { a, v, answer, tol: 0.01, q: R`Find the mean of $${L(a)}$.`, sol: R`<p>Sum $=${sum(a)}$, number $=${n}$. Mean $=\dfrac{${sum(a)}}{${n}}=${answer}$.</p>` }; }
    if (v === 1) { const s = [...a].sort((x, y) => x - y), answer = median(a); return { a, v, answer, tol: 0.01, q: R`Find the median of $${L(a)}$.`, sol: R`<p>Sorted: $${L(s)}$. With $${n}$ values the middle (${(n + 1) / 2}th) is $${answer}$.</p>` }; }
    if (v === 2) { const answer = Math.max(...a) - Math.min(...a); return { a, v, answer, tol: 0.01, q: R`Find the range of $${L(a)}$.`, sol: R`<p>Largest $=${Math.max(...a)}$, smallest $=${Math.min(...a)}$. Range $=${answer}$.</p>` }; }
    const b = [...a.slice(0, n - 1)], miss = a[n - 1], m = mean(a); const answer = miss;
    return { a, v, answer, tol: 0.01, q: R`The mean of $${n}$ observations is $${t2(m)}$. Of them, $${n - 1}$ are $${L(b)}$. Find the remaining observation.`, sol: R`<p>Total $=${n}\times${t2(m)}=${t2(n * m)}$. The known ones add to $${sum(b)}$. Remaining $=${t2(n * m)}-${sum(b)}=${answer}$.</p>` };
  }, (p) => { const a = p.a; return p.v === 0 ? a.reduce((s, x) => s + x) / a.length : p.v === 1 ? [...a].sort((x, y) => x - y)[(a.length - 1) / 2] : p.v === 2 ? Math.max(...a) - Math.min(...a) : a.length * (a.reduce((s, x) => s + x) / a.length) - a.slice(0, -1).reduce((s, x) => s + x); }),

  gen('st-g02', 1, 'nat', 'integer', 'mean', (rng) => {
    const v = int(rng, 0, 2);
    if (v === 0) { const n = int(rng, 4, 12), m = int(rng, 5, 40); return { v, n, m, answer: n * m, tol: 0, q: R`The mean of $${n}$ observations is $${m}$. Find their sum.`, sol: R`<p>Sum $=$ mean $\times$ number $=${m}\times${n}=${n * m}$.</p>` }; }
    if (v === 1) { const x = int(rng, 2, 15), d = int(rng, 1, 4), m = x + d; return { v, x, d, answer: x, tol: 0, q: R`The mean of $x,\ x+${d},\ x+${2 * d}$ is $${x + d}$. Find $x$.`, sol: R`<p>Mean $=\dfrac{3x+${3 * d}}3=x+${d}=${x + d}$, so $x=${x}$.</p>` }; }
    const n = int(rng, 5, 10), m = int(rng, 10, 30), k = int(rng, 1, 6); return { v, n, m, k, answer: n * m + k * n, tol: 0, q: R`The mean of $${n}$ observations is $${m}$. After adding $${k}$ to each observation, find the new sum.`, sol: R`<p>New mean $=${m}+${k}=${m + k}$. New sum $=${n}\times${m + k}=${n * (m + k)}$.</p>` };
  }, (p) => p.v === 0 ? p.m * p.n : p.v === 1 ? ((p.x + p.x + p.d + p.x + 2 * p.d) / 3 - p.d) : p.n * p.m + p.k * p.n),

  gen('st-g03', 2, 'nat', 'numeric', 'variance and SD', (rng) => {
    const v = int(rng, 0, 2), n = choose(rng, [5, 8, 10, 20]), mu = int(rng, 3, 15), s2 = int(rng, 1, 16);
    const sx = n * mu, sx2 = n * (s2 + mu * mu);
    if (v === 0) return { v, n, mu, s2, answer: s2, tol: 0.01, q: R`For $${n}$ observations, $\sum x=${sx}$ and $\sum x^2=${sx2}$. Find the variance.`, sol: R`<p>$\bar x=\dfrac{${sx}}{${n}}=${mu}$. Variance $=\dfrac{\sum x^2}n-\bar x^2=${sx2 / n}-${mu * mu}=${s2}$.</p>` };
    if (v === 1) return { v, n, mu, s2, answer: r2(sqrt(s2)), tol: 0.01, q: R`For $${n}$ observations, $\sum x=${sx}$ and $\sum x^2=${sx2}$. Find the standard deviation.${TWOD}`, sol: R`<p>$\bar x=${mu}$. Variance $=${sx2 / n}-${mu * mu}=${s2}$. SD $=\sqrt{${s2}}\approx${r2(sqrt(s2))}$.</p>` };
    return { v, n, mu, s2, answer: sx2, tol: 0.01, q: R`For $${n}$ observations the mean is $${mu}$ and the variance is $${s2}$. Find $\sum x^2$.`, sol: R`<p>$\dfrac{\sum x^2}n=\sigma^2+\bar x^2=${s2}+${mu * mu}=${s2 + mu * mu}$. So $\sum x^2=${n}\times${s2 + mu * mu}=${sx2}$.</p>` };
  }, (p) => { const sx = p.n * p.mu, sx2 = p.n * (p.s2 + p.mu ** 2); const vv = sx2 / p.n - (sx / p.n) ** 2; return p.v === 0 ? vv : p.v === 1 ? sqrt(vv) : sx2; }),

  gen('st-g04', 2, 'nat', 'numeric', 'mean deviation', (rng) => {
    const v = int(rng, 0, 1), n = choose(rng, [5, 7]);
    let a = v === 0 ? listDiv(rng, n, 2, 20) : list(rng, n, 2, 25);
    const m = v === 0 ? mean(a) : median(a); const answer = r2(sum(a.map((x) => abs(x - m))) / n);
    const s = [...a].sort((x, y) => x - y);
    return { a, v, answer, tol: 0.01,
      q: R`Find the mean deviation about the ${v === 0 ? 'mean' : 'median'} of $${L(a)}$.${TWOD}`,
      sol: R`<p>${v === 0 ? R`Mean $=\dfrac{${sum(a)}}{${n}}=${m}$.` : R`Sorted: $${L(s)}$; median $=${m}$.`} Absolute deviations: $${L(a.map((x) => t2(abs(x - m))))}$, sum $=${t2(sum(a.map((x) => abs(x - m))))}$. Mean deviation $=\dfrac{${t2(sum(a.map((x) => abs(x - m))))}}{${n}}\approx${answer}$.</p>` };
  }, (p) => { const n = p.a.length; const c = p.v === 0 ? p.a.reduce((s, x) => s + x) / n : [...p.a].sort((x, y) => x - y)[(n - 1) / 2]; let t = 0; for (const x of p.a) t += Math.sqrt((x - c) ** 2); return t / n; }),

  gen('st-g05', 2, 'nat', 'numeric', 'change of scale', (rng) => {
    const mu = int(rng, 5, 30), sd = int(rng, 2, 9), a = choose(rng, [2, 3, 4, -2, -3, 5, 0.5]), b = int(rng, -8, 12), v = int(rng, 0, 2);
    const eq = `y=${a === 1 ? '' : a === -1 ? '-' : a}x${b < 0 ? b : `+${b}`}`;
    if (v === 0) return { v, mu, sd, a, b, answer: a * mu + b, tol: 0.01, q: R`$x$ has mean $${mu}$ and standard deviation $${sd}$. If $${eq}$, find the mean of $y$.`, sol: R`<p>Mean of $y=a\bar x+b=${a}\cdot${mu}+(${b})=${a * mu + b}$.</p>` };
    if (v === 1) return { v, mu, sd, a, b, answer: abs(a) * sd, tol: 0.01, q: R`$x$ has mean $${mu}$ and standard deviation $${sd}$. If $${eq}$, find the standard deviation of $y$.`, sol: R`<p>$\mathrm{SD}(ax+b)=|a|\,\sigma=|${a}|\cdot${sd}=${abs(a) * sd}$. The shift $${b}$ does not matter.</p>` };
    return { v, mu, sd, a, b, answer: a * a * sd * sd, tol: 0.01, q: R`$x$ has mean $${mu}$ and variance $${sd * sd}$. If $${eq}$, find the variance of $y$.`, sol: R`<p>$\mathrm{Var}(ax+b)=a^2\sigma^2=${a * a}\cdot${sd * sd}=${a * a * sd * sd}$.</p>` };
  }, (p) => { const xs = [p.mu - p.sd, p.mu + p.sd]; const ys = xs.map((x) => p.a * x + p.b); return p.v === 0 ? mean(ys) : p.v === 1 ? sdp(ys) : varp(ys); }),

  gen('st-g06', 2, 'nat', 'numeric', 'combined mean', (rng) => {
    const n1 = int(rng, 10, 40), n2 = int(rng, 10, 40), m1 = int(rng, 20, 60), m2 = int(rng, 20, 60), v = int(rng, 0, 1);
    if (v === 0) { const answer = r2((n1 * m1 + n2 * m2) / (n1 + n2)); return { v, n1, n2, m1, m2, answer, tol: 0.01, q: R`Group $A$ has $${n1}$ observations with mean $${m1}$ and group $B$ has $${n2}$ observations with mean $${m2}$. Find the mean of all of them.${TWOD}`, sol: R`<p>$\dfrac{${n1}\cdot${m1}+${n2}\cdot${m2}}{${n1}+${n2}}=\dfrac{${n1 * m1}+${n2 * m2}}{${n1 + n2}}\approx${answer}$.</p>` }; }
    const comb = (n1 * m1 + n2 * m2) / (n1 + n2);
    return { v, n1, n2, m1, m2, answer: m2, tol: 0.01, q: R`Group $A$ has $${n1}$ observations with mean $${m1}$. Group $B$ has $${n2}$ observations. The mean of all $${n1 + n2}$ is $${t2(comb)}$. Find the mean of group $B$.`, sol: R`<p>Total $=${n1 + n2}\times${t2(comb)}=${t2(comb * (n1 + n2))}$. Group $A$ contributes $${n1 * m1}$. Group $B$: $\dfrac{${t2(comb * (n1 + n2) - n1 * m1)}}{${n2}}=${m2}$.</p>` };
  }, (p) => p.v === 0 ? (p.n1 * p.m1 + p.n2 * p.m2) / (p.n1 + p.n2) : ((p.n1 + p.n2) * ((p.n1 * p.m1 + p.n2 * p.m2) / (p.n1 + p.n2)) - p.n1 * p.m1) / p.n2),

  gen('st-g07', 3, 'nat', 'numeric', 'combined variance', (rng) => {
    const n1 = choose(rng, [10, 15, 20, 30]), n2 = choose(rng, [10, 15, 20, 30]), m1 = int(rng, 10, 30), m2 = int(rng, 10, 30), s1 = int(rng, 2, 6), s2 = int(rng, 2, 6), v = int(rng, 0, 1);
    const m = (n1 * m1 + n2 * m2) / (n1 + n2), vv = (n1 * (s1 * s1 + (m1 - m) ** 2) + n2 * (s2 * s2 + (m2 - m) ** 2)) / (n1 + n2);
    const answer = v === 0 ? r2(vv) : r2(sqrt(vv));
    return { n1, n2, m1, m2, s1, s2, v, answer, tol: 0.01,
      q: R`Group $A$: $${n1}$ observations, mean $${m1}$, SD $${s1}$. Group $B$: $${n2}$ observations, mean $${m2}$, SD $${s2}$. Find the ${v === 0 ? 'variance' : 'standard deviation'} of the combined $${n1 + n2}$ observations.${TWOD}`,
      sol: R`<p>Combined mean $=\dfrac{${n1 * m1}+${n2 * m2}}{${n1 + n2}}=${t2(m)}$. $d_1=${t2(m1 - m)}$, $d_2=${t2(m2 - m)}$. Variance $=\dfrac{${n1}(${s1 * s1}+${t2((m1 - m) ** 2)})+${n2}(${s2 * s2}+${t2((m2 - m) ** 2)})}{${n1 + n2}}=${t2(vv)}$.${v === 1 ? R` SD $=\sqrt{${t2(vv)}}\approx${answer}$.` : ''}</p>` };
  }, (p) => {
    // via sums of x and x^2 of each group
    const N = p.n1 + p.n2, sx = p.n1 * p.m1 + p.n2 * p.m2, sx2 = p.n1 * (p.s1 ** 2 + p.m1 ** 2) + p.n2 * (p.s2 ** 2 + p.m2 ** 2); const vv = sx2 / N - (sx / N) ** 2; return p.v === 0 ? vv : sqrt(vv);
  }),

  gen('st-g08', 2, 'nat', 'numeric', 'wrong observation', (rng) => {
    const n = int(rng, 8, 25), m = int(rng, 20, 60), wrong = int(rng, 10, 40); let right; do { right = int(rng, 10, 70); } while (right === wrong); const v = int(rng, 0, 1);
    const cs = n * m - wrong + right;
    if (v === 0) return { n, m, wrong, right, v, answer: r2(cs / n), tol: 0.01, q: R`The mean of $${n}$ observations is $${m}$. It was later found that $${right}$ had been read as $${wrong}$. Find the correct mean.${TWOD}`, sol: R`<p>Wrong sum $=${n}\times${m}=${n * m}$. Correct sum $=${n * m}-${wrong}+${right}=${cs}$. Correct mean $=\dfrac{${cs}}{${n}}\approx${r2(cs / n)}$.</p>` };
    return { n, m, wrong, right, v, answer: cs, tol: 0.01, q: R`The mean of $${n}$ observations is $${m}$. It was later found that $${right}$ had been read as $${wrong}$. Find the correct sum of the observations.`, sol: R`<p>Wrong sum $=${n}\times${m}=${n * m}$. Correct sum $=${n * m}-${wrong}+${right}=${cs}$.</p>` };
  }, (p) => { const cs = p.n * p.m + (p.right - p.wrong); return p.v === 0 ? cs / p.n : cs; }),

  gen('st-g09', 3, 'nat', 'numeric', 'wrong observation', (rng) => {
    const n = choose(rng, [10, 20, 25]), m = int(rng, 15, 40), s = int(rng, 3, 8), wrong = int(rng, 10, 30); let right, sx, sx2, nm, nv; do { right = int(rng, 10, 50); sx = n * m - wrong + right; sx2 = n * (s * s + m * m) - wrong * wrong + right * right; nm = sx / n; nv = sx2 / n - nm * nm; } while (right === wrong || nv < 1); const v = int(rng, 0, 1);
    const answer = v === 0 ? r2(nv) : r2(sqrt(nv));
    return { n, m, s, wrong, right, v, answer, tol: 0.01,
      q: R`$${n}$ observations have mean $${m}$ and standard deviation $${s}$. It is found that $${right}$ was read as $${wrong}$. Find the correct ${v === 0 ? 'variance' : 'standard deviation'}.${TWOD}`,
      sol: R`<p>$\sum x=${n * m}$, $\sum x^2=${n}(${s * s}+${m * m})=${n * (s * s + m * m)}$. Correct: $\sum x=${sx}$ (mean $${t2(nm)}$), $\sum x^2=${n * (s * s + m * m)}-${wrong * wrong}+${right * right}=${sx2}$. Variance $=\dfrac{${sx2}}{${n}}-${t2(nm)}^2\approx${r2(nv)}$.${v === 1 ? R` SD $=\sqrt{${r2(nv)}}\approx${answer}$.` : ''}</p>` };
  }, (p) => {
    const xs = []; // rebuild an actual data set with this mean and sd and fix it: use the sums directly in another order
    const dm = (p.right - p.wrong) / p.n; const m2 = p.m + dm; const ex2 = p.s * p.s + p.m * p.m + (p.right * p.right - p.wrong * p.wrong) / p.n; const vv = ex2 - m2 * m2; return p.v === 0 ? vv : sqrt(vv);
  }),

  gen('st-g10', 2, 'mcq', 'single', 'change of scale', (rng) => {
    const sd = int(rng, 2, 8), a = choose(rng, [2, 3, 4, -2, -3, -5]), b = int(rng, -6, 9), v = int(rng, 0, 1);
    const eq = `y=${a}x${b < 0 ? b : `+${b}`}`;
    if (v === 0) { const right = `$${abs(a) * sd}$`; const { options, answer } = shuffleOpts(rng, right, wrongNums(abs(a) * sd, [a * sd, a * a * sd, abs(a) * sd + b])); return { v, sd, a, b, options, answer, q: R`The standard deviation of $x$ is $${sd}$. For $${eq}$, the standard deviation of $y$ is`, sol: R`<p>$\mathrm{SD}(ax+b)=|a|\sigma$. Here $|${a}|\times${sd}=${abs(a) * sd}$. The shift $${b}$ has no effect, and SD can never be negative.</p>` }; }
    const mu = int(rng, 4, 20); const right = `$${a * mu + b}$`; const { options, answer } = shuffleOpts(rng, right, wrongNums(a * mu + b, [abs(a) * mu + b, a * mu, a * (mu + b)]));
    return { v, sd, a, b, mu, options, answer, q: R`The mean of $x$ is $${mu}$. For $${eq}$, the mean of $y$ is`, sol: R`<p>The mean follows the same linear rule: $${a}\cdot${mu}+(${b})=${a * mu + b}$.</p>` };
  }, (p) => { const xs = p.v === 0 ? [10 - p.sd, 10 + p.sd] : [p.mu - 1, p.mu + 1]; const ys = xs.map((x) => p.a * x + p.b); const val = p.v === 0 ? sdp(ys) : mean(ys); return String(Math.round(val)) === p.options[p.answer].replace(/\$/g, '') ? p.answer : -1; }),

  gen('st-g11', 2, 'nat', 'numeric', 'grouped data', (rng) => {
    const { cl, f } = mkClasses(rng, choose(rng, [10, 10, 20]), 5); const v = int(rng, 0, 1);
    const tb = tbl(['Class', ...cl.map(([l, h]) => `${l}-${h}`)], [['Frequency', ...f]]);
    const m = gMean(cl, f), answer = r2(m);
    const mk = mids(cl);
    return { cl, f, v, answer, tol: 0.01, q: R`Find the mean of this frequency distribution.${TWOD}${tb}`,
      sol: R`<p>Class marks: $${L(mk)}$. $\sum fx=${sum(mk.map((x, i) => x * f[i]))}$ and $N=${sum(f)}$. Mean $=\dfrac{${sum(mk.map((x, i) => x * f[i]))}}{${sum(f)}}\approx${answer}$.</p>` };
  }, (p) => { let t = 0, N = 0; p.cl.forEach(([l, h], i) => { t += p.f[i] * (l + h) / 2; N += p.f[i]; }); return t / N; }),

  gen('st-g12', 3, 'nat', 'numeric', 'grouped data', (rng) => {
    const w = choose(rng, [10, 20]), { cl, f } = mkClasses(rng, w, 5), v = int(rng, 0, 1);
    const tb = tbl(['Class', ...cl.map(([l, h]) => `${l}-${h}`)], [['Frequency', ...f]]);
    const N = sum(f); let cf = 0, k = 0; while (cf + f[k] < N / 2) { cf += f[k]; k++; }
    if (v === 0) { const answer = r2(gMedian(cl, f)); return { cl, f, v, answer, tol: 0.01, q: R`Find the median of this frequency distribution.${TWOD}${tb}`, sol: R`<p>$N=${N}$, $\dfrac N2=${N / 2}$. The median class is $${cl[k][0]}\text{-}${cl[k][1]}$ with $l=${cl[k][0]}$, $cf=${cf}$, $f=${f[k]}$, $h=${w}$. Median $=${cl[k][0]}+\dfrac{${N / 2}-${cf}}{${f[k]}}\times${w}\approx${answer}$.</p>` }; }
    const answer = r2(gMode(cl, f)); let i = 0; for (let j = 1; j < 5; j++) if (f[j] > f[i]) i = j; const f0 = i ? f[i - 1] : 0, f2 = i < 4 ? f[i + 1] : 0;
    return { cl, f, v, answer, tol: 0.01, q: R`Find the mode of this frequency distribution.${TWOD}${tb}`, sol: R`<p>The modal class is $${cl[i][0]}\text{-}${cl[i][1]}$ ($f_1=${f[i]}$, $f_0=${f0}$, $f_2=${f2}$, $h=${w}$). Mode $=${cl[i][0]}+\dfrac{${f[i]}-${f0}}{2\cdot${f[i]}-${f0}-${f2}}\times${w}\approx${answer}$.</p>` };
  }, (p) => {
    const N = sum(p.f); if (p.v === 0) { const cum = []; let c = 0; p.f.forEach((x) => { c += x; cum.push(c); }); const k = cum.findIndex((x) => x >= N / 2); const w = p.cl[0][1] - p.cl[0][0]; return p.cl[k][0] + ((N / 2 - (cum[k] - p.f[k])) * w) / p.f[k]; }
    const w = p.cl[0][1] - p.cl[0][0]; const i = p.f.indexOf(Math.max(...p.f)); const d1 = p.f[i] - (p.f[i - 1] ?? 0), d2 = p.f[i] - (p.f[i + 1] ?? 0); return p.cl[i][0] + (d1 / (d1 + d2)) * w;
  }),

  gen('st-g13', 3, 'nat', 'numeric', 'grouped data', (rng) => {
    const { cl, f } = mkClasses(rng, choose(rng, [4, 10]), 4), v = int(rng, 0, 1);
    const tb = tbl(['Class', ...cl.map(([l, h]) => `${l}-${h}`)], [['Frequency', ...f]]);
    const m = gMean(cl, f), vr = gVar(cl, f), mk = mids(cl), N = sum(f);
    const answer = v === 0 ? r2(vr) : r2(sqrt(vr));
    return { cl, f, v, answer, tol: 0.01, q: R`Find the ${v === 0 ? 'variance' : 'standard deviation'} of this frequency distribution.${TWOD}${tb}`,
      sol: R`<p>Class marks $${L(mk)}$, $N=${N}$. $\sum fx=${sum(mk.map((x, i) => x * f[i]))}$, mean $=${t2(m)}$. $\sum fx^2=${sum(mk.map((x, i) => x * x * f[i]))}$. Variance $=\dfrac{${sum(mk.map((x, i) => x * x * f[i]))}}{${N}}-${t2(m)}^2\approx${r2(vr)}$.${v === 1 ? R` SD $=\sqrt{${r2(vr)}}\approx${answer}$.` : ''}</p>` };
  }, (p) => { const N = sum(p.f); const xs = []; p.cl.forEach(([l, h], i) => { for (let j = 0; j < p.f[i]; j++) xs.push((l + h) / 2); }); const vv = varp(xs); return p.v === 0 ? vv : sqrt(vv); }),

  gen('st-g14', 2, 'nat', 'numeric', 'coefficient of variation', (rng) => {
    const mu = choose(rng, [20, 25, 40, 50, 60, 80]), sd = int(rng, 2, 16), v = int(rng, 0, 2);
    if (v === 0) { const answer = r2((sd / mu) * 100); return { v, mu, sd, answer, tol: 0.01, q: R`A data set has mean $${mu}$ and standard deviation $${sd}$. Find its coefficient of variation (in per cent).${TWOD}`, sol: R`<p>CV $=\dfrac\sigma{\bar x}\times100=\dfrac{${sd}}{${mu}}\times100\approx${answer}\%$.</p>` }; }
    if (v === 1) { const cv = r2((sd / mu) * 100); return { v, mu, sd, answer: sd, tol: 0.01, q: R`A data set has mean $${mu}$ and coefficient of variation $${cv}\%$. Find its standard deviation (nearest whole number).`, sol: R`<p>$\sigma=\dfrac{\text{CV}\times\bar x}{100}=\dfrac{${cv}\times${mu}}{100}=${t2((cv * mu) / 100)}\approx${sd}$.</p>` }; }
    const a = list(rng, 5, 5, 25); const mm = mean(a), ss = sdp(a), answer = r2((ss / mm) * 100);
    return { v, a, mu: mm, sd: ss, answer, tol: 0.01, q: R`Find the coefficient of variation (in per cent) of $${L(a)}$.${TWOD}`, sol: R`<p>Mean $=${t2(mm)}$. Variance $=${t4(varp(a))}$, SD $=${t2(ss)}$. CV $=\dfrac{${t2(ss)}}{${t2(mm)}}\times100\approx${answer}\%$.</p>` };
  }, (p) => p.v === 0 ? (p.sd / p.mu) * 100 : p.v === 1 ? Math.round(((p.sd / p.mu) * 100 * p.mu) / 100) : (sdp(p.a) / mean(p.a)) * 100),

  gen('st-g15', 3, 'nat', 'numeric', 'variance of sequences', (rng) => {
    const v = int(rng, 0, 2);
    if (v === 0) { const n = int(rng, 5, 21), answer = (n * n - 1) / 12; return { v, n, answer: r2(answer), tol: 0.01, q: R`Find the variance of the first $${n}$ natural numbers.${TWOD}`, sol: R`<p>For $1,\dots,n$ the variance is $\dfrac{n^2-1}{12}=\dfrac{${n * n}-1}{12}\approx${r2(answer)}$.</p>` }; }
    if (v === 1) { const a = int(rng, 1, 20), d = int(rng, 2, 7), n = int(rng, 4, 12), answer = (d * d * (n * n - 1)) / 12; return { v, a, d, n, answer: r2(answer), tol: 0.01, q: R`Find the variance of the ${n} terms of the AP with first term $${a}$ and common difference $${d}$.${TWOD}`, sol: R`<p>Variance of an AP $=\dfrac{d^2(n^2-1)}{12}=\dfrac{${d * d}\cdot${n * n - 1}}{12}\approx${r2(answer)}$. The first term does not matter.</p>` }; }
    const k = int(rng, 2, 9), n = int(rng, 5, 12), answer = (k * k * (n * n - 1)) / 12; return { v, k, n, answer: r2(answer), tol: 0.01, q: R`Find the variance of the first $${n}$ multiples of $${k}$ ($${k},${2 * k},\dots,${n * k}$).${TWOD}`, sol: R`<p>The numbers are $k\times(1,2,\dots,n)$, so variance $=k^2\cdot\dfrac{n^2-1}{12}=${k * k}\cdot\dfrac{${n * n - 1}}{12}\approx${r2(answer)}$.</p>` };
  }, (p) => { const arr = p.v === 0 ? Array.from({ length: p.n }, (_, i) => i + 1) : p.v === 1 ? Array.from({ length: p.n }, (_, i) => p.a + i * p.d) : Array.from({ length: p.n }, (_, i) => (i + 1) * p.k); return varp(arr); }),

  gen('st-g16', 4, 'nat', 'integer', 'variance and SD', (rng) => {
    let data, kn, m, vv; do { data = list(rng, 6, 2, 16); m = mean(data); vv = varp(data); } while (m !== Math.round(m) || abs(vv * 2 - Math.round(vv * 2)) > 1e-9);
    const x = data[4], y = data[5], known = data.slice(0, 4), v = int(rng, 0, 1);
    const S = sum([x, y]), Q = x * x + y * y; const answer = v === 0 ? abs(x - y) : x * y;
    return { data, v, answer, tol: 0, q: R`Six observations have mean $${m}$ and variance $${t2(vv)}$. Four of them are $${L(known)}$. Find the ${v === 0 ? 'absolute difference' : 'product'} of the other two.`,
      sol: R`<p>The other two add to $${6 * m}-${sum(known)}=${S}$. $\sum x^2=6(${t2(vv)}+${m * m})=${t2(6 * (vv + m * m))}$; the four known squares add to $${sum(known.map((q) => q * q))}$, so $x^2+y^2=${Q}$. Then $2xy=${S}^2-${Q}=${S * S - Q}$, $xy=${(S * S - Q) / 2}$ and $(x-y)^2=${2 * Q - S * S}$, $|x-y|=${abs(x - y)}$. Asked: ${v === 0 ? 'difference' : 'product'}, $${answer}$.</p>` };
  }, (p) => { const m = mean(p.data), V = varp(p.data); const S = 6 * m - sum(p.data.slice(0, 4)); const Q = 6 * (V + m * m) - sum(p.data.slice(0, 4).map((q) => q * q)); const prod = (S * S - Q) / 2; return Math.round(p.v === 0 ? sqrt(S * S - 4 * prod) : prod); }),

  gen('st-g17', 4, 'nat', 'numeric', 'combined variance', (rng) => {
    const g = [0, 1, 2].map(() => ({ n: choose(rng, [10, 20, 30]), m: int(rng, 10, 30), s: int(rng, 2, 7) }));
    const N = sum(g.map((q) => q.n)), M = sum(g.map((q) => q.n * q.m)) / N, vv = sum(g.map((q) => q.n * (q.s * q.s + (q.m - M) ** 2))) / N; const v = int(rng, 0, 1); const answer = v === 0 ? r2(M) : r2(vv);
    return { g, v, answer, tol: 0.01, q: R`Three groups have sizes $${g[0].n},${g[1].n},${g[2].n}$, means $${g[0].m},${g[1].m},${g[2].m}$ and standard deviations $${g[0].s},${g[1].s},${g[2].s}$. Find the ${v === 0 ? 'mean' : 'variance'} of all $${N}$ observations.${TWOD}`,
      sol: R`<p>Combined mean $=\dfrac{${g.map((q) => q.n * q.m).join('+')}}{${N}}=${t2(M)}$. Combined variance $=\dfrac1{${N}}\sum n_i(\sigma_i^2+d_i^2)$ with $d_i=m_i-${t2(M)}$: $${g.map((q) => `${q.n}(${q.s * q.s}+${t2((q.m - M) ** 2)})`).join('+')}$ over $${N}$ gives $${t2(vv)}$. Asked: ${v === 0 ? 'mean' : 'variance'}, $${answer}$.</p>` };
  }, (p) => { const N = sum(p.g.map((q) => q.n)); const sx = sum(p.g.map((q) => q.n * q.m)), sx2 = sum(p.g.map((q) => q.n * (q.s ** 2 + q.m ** 2))); return p.v === 0 ? sx / N : sx2 / N - (sx / N) ** 2; }),

  gen('st-g18', 2, 'nat', 'integer', 'mean, median, mode', (rng) => {
    const v = int(rng, 0, 2), md = int(rng, 10, 40), mn = md + int(rng, 1, 6); const mode = 3 * md - 2 * mn;
    if (v === 0) return { v, md, mn, answer: mode, tol: 0, q: R`In a moderately skewed distribution the mean is $${mn}$ and the median is $${md}$. Estimate the mode.`, sol: R`<p>Mode $\approx3\times\text{median}-2\times\text{mean}=${3 * md}-${2 * mn}=${mode}$.</p>` };
    if (v === 1) return { v, md, mn, answer: md, tol: 0, q: R`In a moderately skewed distribution the mean is $${mn}$ and the mode is $${mode}$. Estimate the median.`, sol: R`<p>Mode $=3\,$median$\,-2\,$mean gives $${mode}=3M-${2 * mn}$, so $3M=${mode + 2 * mn}$ and median $=${md}$.</p>` };
    return { v, md, mn, answer: mn, tol: 0, q: R`In a moderately skewed distribution the median is $${md}$ and the mode is $${mode}$. Estimate the mean.`, sol: R`<p>Mode $=3\,$median$\,-2\,$mean gives $${mode}=${3 * md}-2\bar x$, so $2\bar x=${3 * md - mode}$ and mean $=${mn}$.</p>` };
  }, (p) => { const mode = 3 * p.md - 2 * p.mn; return p.v === 0 ? mode : p.v === 1 ? (mode + 2 * p.mn) / 3 : (3 * p.md - mode) / 2; }),

  gen('st-g19', 3, 'nat', 'numeric', 'least values', (rng) => {
    const a = list(rng, int(rng, 4, 6), 1, 20), v = int(rng, 0, 2);
    const med = median(a), mn = mean(a);
    if (v === 0) { const answer = sum(a.map((x) => abs(x - med))); return { a, v, answer, tol: 0.01, q: R`Find the least value of $${a.map((x) => `|t-${x}|`).join('+')}$ over real $t$.`, sol: R`<p>A sum of absolute deviations is least at the median. Sorted: $${L([...a].sort((x, y) => x - y))}$, median $=${med}$. Value $=${answer}$.</p>` }; }
    if (v === 1) { const answer = r2(sum(a.map((x) => (x - mn) ** 2))); return { a, v, answer, tol: 0.01, q: R`Find the least value of $${a.map((x) => `(t-${x})^2`).join('+')}$ over real $t$.${TWOD}`, sol: R`<p>A sum of squared deviations is least at the mean $t=\dfrac{${sum(a)}}{${a.length}}=${t2(mn)}$. Value $=\sum(x-\bar x)^2=${answer}$.</p>` }; }
    const c = int(rng, 1, 20), answer = r2(sum(a.map((x) => (x - c) ** 2)));
    return { a, c, v, answer, tol: 0.01, q: R`For the observations $${L(a)}$ find $\sum(x-${c})^2$.${TWOD}`, sol: R`<p>$\sum(x-a)^2=n\sigma^2+n(\bar x-a)^2=${t2(a.length * varp(a))}+${a.length}(${t2(mn)}-${c})^2=${answer}$.</p>` };
  }, (p) => { const n = p.a.length; if (p.v === 0) { let best = 1e9; for (let t = 0; t <= 20; t += 0.01) best = Math.min(best, sum(p.a.map((x) => abs(x - t)))); return best; } if (p.v === 1) { let best = 1e9; for (let t = 0; t <= 20; t += 0.001) best = Math.min(best, sum(p.a.map((x) => (x - t) ** 2))); return best; } return n * varp(p.a) + n * (mean(p.a) - p.c) ** 2; }),
];

export default { topic: 'statistics', groups, items, gens };

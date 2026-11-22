// Class 10 Maths, Chapter 13 Statistics: practice questions for the NCERT study course (original fibub questions).
import { maker } from './_make.js';
import { pick, choose } from '../_util.js';
const m = maker('st');
const R = String.raw;
// five classes of width h starting at lo, as text, and the class marks
const lst = (lo, h, f) => f.map((v, i) => `${lo + i * h}–${lo + (i + 1) * h}: ${v}`).join(', ');
const xs = (lo, h, k = 5) => Array.from({ length: k }, (_, i) => lo + h * (i + 0.5));
const sum = (a) => a.reduce((s, v) => s + v, 0);
const meanOf = (lo, h, f) => sum(f.map((v, i) => v * xs(lo, h)[i])) / sum(f);
const medianOf = (lo, h, f) => { const N = sum(f); let c = 0; for (let i = 0; i < f.length; i++) { if (c + f[i] >= N / 2) return lo + i * h + ((N / 2 - c) / f[i]) * h; c += f[i]; } };
const modeOf = (lo, h, f) => { const k = f.indexOf(Math.max(...f)); return lo + k * h + (h * (f[k] - f[k - 1])) / (2 * f[k] - f[k - 1] - f[k + 1]); };
const peaked = (rng) => { const f = Array.from({ length: 5 }, () => pick(rng, 3, 9)); const k = 1 + Math.floor(rng() * 3); f[k] = Math.max(...f) + pick(rng, 2, 5); return f; };

export default {
  topic: 'statistics', name: 'Statistics', n: 13,
  items: [
    m.mcq(1, 'table', R`<p>The class mark of the class 15–25 is:</p>`, R`20`, [R`10`, R`40`, R`25`], R`<p>Class mark $= \dfrac{15 + 25}{2} = 20$.</p>`),
    m.mcq(1, 'table', R`<p>The class width of the class 40–55 is:</p>`, R`15`, [R`47.5`, R`95`, R`40`], R`<p>Width $=$ upper limit $-$ lower limit $= 55 - 40 = 15$. The number 47.5 is the class mark.</p>`, { trap: 'Mixing up class width and class mark.' }),
    m.mcq(1, 'mean', R`<p>If $\sum f = 25$ and $\sum fx = 650$, the mean is:</p>`, R`26`, [R`625`, R`6.5`, R`675`], R`<p>$\bar{x} = \dfrac{650}{25} = 26$.</p>`),
    m.mcq(1, 'mode', R`<p>Frequencies of the classes 0–10, 10–20, 20–30, 30–40 are 4, 9, 16, 7. The modal class is:</p>`, R`20–30`, [R`10–20`, R`0–10`, R`30–40`], R`<p>The highest frequency is 16, in the class 20–30.</p>`),
    m.mcq(2, 'stepdev', R`<p>In the step-deviation method $a = 40$, $h = 10$, $\sum fu = -8$ and $\sum f = 40$. The mean is:</p>`, R`38`, [R`42`, R`32`, R`39.8`], R`<p>$\bar{x} = a + h\dfrac{\sum fu}{\sum f} = 40 + 10 \times \dfrac{-8}{40} = 38$.</p>`, { trap: 'Forgetting to multiply by h.' }),
    m.mcq(2, 'median', R`<p>For grouped data with $n = 80$, the median is the value of which observation?</p>`, R`the 40th`, [R`the 80th`, R`the 41st only`, R`the 20th`], R`<p>The median is the middle observation, number $n/2 = 40$.</p>`),
    m.mcq(2, 'mode', R`<p>The modal class is 30–40 with $f_1 = 12$, $f_0 = 8$, $f_2 = 10$. The mode is about:</p>`, R`36.67`, [R`35`, R`33.33`, R`38`], R`<p>Mode $= 30 + \dfrac{12 - 8}{24 - 8 - 10} \times 10 = 30 + \dfrac{40}{6} = 36.67$.</p>`),
    m.mcq(2, 'median', R`<p>For a median class with $l = 20$, $n/2 = 25$, $cf = 15$, $f = 10$ and $h = 10$, the median is:</p>`, R`30`, [R`25`, R`35`, R`20`], R`<p>Median $= 20 + \dfrac{25 - 15}{10} \times 10 = 30$.</p>`),
    m.mcq(2, 'median', R`<p>In the median formula, $cf$ means the cumulative frequency of:</p>`, R`the class just before the median class`, [R`the median class`, R`the class just after the median class`, R`the modal class`], R`<p>$cf$ counts the observations already passed before entering the median class.</p>`, { trap: 'Using the cumulative frequency of the median class itself.' }),
    m.mcq(3, 'empirical', R`<p>The mean of some data is 12.4 and its median is 12. The empirical estimate of the mode is:</p>`, R`11.2`, [R`12.8`, R`12.2`, R`11.8`], R`<p>Mode $\approx 3 \times 12 - 2 \times 12.4 = 36 - 24.8 = 11.2$.</p>`),
    m.mcq(3, 'mean', R`<p>The mean of 20 observations is 15. Each is multiplied by 2 and then increased by 1. The new mean is:</p>`, R`31`, [R`30`, R`16`, R`32`], R`<p>The mean follows the same operations: $2 \times 15 + 1 = 31$.</p>`),
    m.mcq(3, 'median', R`<p>For $n = 60$ the cumulative frequencies of five classes are 5, 17, 40, 55, 60. The median class is the:</p>`, R`third class`, [R`second class`, R`fourth class`, R`first class`], R`<p>$n/2 = 30$. The first cumulative frequency at least 30 is 40, the third class.</p>`),
    m.ar(2, 'mean', R`The mean found from grouped data is exactly the mean of the original observations.`, R`In grouped data every observation in a class is taken to be equal to the class mark.`, 3, R`<p>R is true, and it is why A is false: grouping makes the mean an estimate.</p>`),
    m.ar(2, 'median', R`The median class is the first class whose cumulative frequency is at least $n/2$.`, R`The $n/2$th observation lies in that class.`, 0, R`<p>Both true and R explains A: the middle observation is in the class where the running count first reaches $n/2$.</p>`),
    m.ar(3, 'empirical', R`For perfectly symmetric data with a single peak, the mean, median and mode coincide.`, R`The histogram of such data looks the same on both sides of its centre.`, 0, R`<p>Both true. The balance point, the middle observation and the peak are all at the centre of symmetry.</p>`),
    m.ar(3, 'mean', R`Adding one very large value to a data set changes the median more than the mean.`, R`The mean depends on every value in the data.`, 3, R`<p>A is false: the mean changes much more because it uses the size of every value; the median only depends on position. R is true.</p>`),
    m.nat(1, 'mean', R`<p>For a grouped table $\sum f = 45$ and $\sum fx = 1980$. Find the mean.</p>`, () => 1980 / 45, 0, R`<p>$\bar{x} = \dfrac{1980}{45} = 44$.</p>`),
    m.nat(2, 'mode', R`<p>Classes 0–10, 10–20, 20–30, 30–40, 40–50 have frequencies 3, 8, 15, 10, 4. Find the mode, correct to 2 decimal places.</p>`, () => 20 + (10 * 7) / 12, 0.005, R`<p>Modal class 20–30: $l = 20$, $f_1 = 15$, $f_0 = 8$, $f_2 = 10$, $h = 10$. Mode $= 20 + \dfrac{7}{12} \times 10 = 25.83$.</p>`),
    m.nat(2, 'median', R`<p>Classes 0–10, 10–20, 20–30, 30–40, 40–50 have frequencies 5, 12, 20, 10, 3. Find the median.</p>`, () => 20 + ((25 - 17) / 20) * 10, 0, R`<p>$n = 50$, $n/2 = 25$. Cumulative frequencies 5, 17, 37: the median class is 20–30 with $cf = 17$, $f = 20$. Median $= 20 + \dfrac{8}{20} \times 10 = 24$.</p>`),
    m.nat(3, 'assumed', R`<p>Classes 10–20, 20–30, 30–40, 40–50, 50–60 have frequencies 3, 7, 15, 10, 5. Using the assumed mean $a = 35$, find the mean.</p>`, () => 35 + 70 / 40, 0.005, R`<p>Class marks 15, 25, 35, 45, 55 give $d = -20, -10, 0, 10, 20$ and $fd = -60, -70, 0, 100, 100$, so $\sum fd = 70$ and $\sum f = 40$. Mean $= 35 + \dfrac{70}{40} = 36.75$.</p>`),
    m.nat(3, 'mean', R`<p>The mean of this data is 42. Find the missing frequency $p$: classes 0–20, 20–40, 40–60, 60–80, 80–100 with frequencies 8, 10, $p$, 6, 3.</p>`, () => 8, 0, R`<p>$\dfrac{1070 + 50p}{27 + p} = 42$ gives $8p = 64$, so $p = 8$.</p>`),
    m.nat(3, 'empirical', R`<p>The mean of a data set is 52 and its median is 50. Estimate the mode.</p>`, () => 3 * 50 - 2 * 52, 0, R`<p>Mode $\approx 3 \times 50 - 2 \times 52 = 46$.</p>`),
    m.msq(2, 'table', R`<p>Which statements are true? (Choose all that apply.)</p>`, [R`The class mark is the middle of a class.`, R`A data set can have only one mode.`, R`The mean uses every observation (every class mark with its frequency).`, R`The median class is found from cumulative frequencies.`], [0, 2, 3], R`<p>A data set can have more than one mode, so the second statement is false. The others are correct.</p>`),
    m.msq(2, 'mode', R`<p>Which of these appear in the formula for the mode of grouped data? (Choose all that apply.)</p>`, [R`the lower limit of the modal class`, R`the cumulative frequency $cf$`, R`the frequency of the class before the modal class`, R`the class width`], [0, 2, 3], R`<p>The mode formula uses $l$, $h$, $f_1$, $f_0$ and $f_2$. The cumulative frequency belongs to the median formula.</p>`),
  ],
  gens: [
    { id: 'st-g01', type: 'nat', level: 1, exams: ['board'], sub: 'table',
      make(rng) { const lo = pick(rng, 5, 60, 5), w = pick(rng, 4, 20, 2); return { lo, w, q: `<p>Find the class mark of the class ${lo}–${lo + w}.</p>`, answer: lo + w / 2, tol: 0, sol: `<p>Class mark $= \\dfrac{${lo} + ${lo + w}}{2} = ${lo + w / 2}$.</p>` }; },
      verify: (p) => (p.lo + (p.lo + p.w)) / 2 },
    { id: 'st-g02', type: 'nat', level: 2, exams: ['board'], sub: 'mean',
      make(rng) { const h = choose(rng, [10, 20]), lo = choose(rng, [0, 10, 20]), f = Array.from({ length: 5 }, () => pick(rng, 3, 14)), N = sum(f), S = sum(f.map((v, i) => v * xs(lo, h)[i])); return { h, lo, f, q: `<p>Find the mean of this data (class: frequency): ${lst(lo, h, f)}.</p>`, answer: S / N, tol: 0.005, sol: `<p>Class marks ${xs(lo, h).join(', ')}. $\\sum f = ${N}$, $\\sum fx = ${S}$. Mean $= \\dfrac{${S}}{${N}} = ${+(S / N).toFixed(3)}$.</p>` }; },
      verify: (p) => { const x = xs(p.lo, p.h), a = x[2]; return a + sum(p.f.map((v, i) => v * (x[i] - a))) / sum(p.f); } },
    { id: 'st-g03', type: 'nat', level: 2, exams: ['board'], sub: 'stepdev',
      make(rng) { const h = choose(rng, [5, 10, 20]), lo = choose(rng, [0, 20, 100]), f = Array.from({ length: 5 }, () => pick(rng, 3, 14)), x = xs(lo, h), a = x[2], su = sum(f.map((v, i) => v * (i - 2))), N = sum(f); return { h, lo, f, q: `<p>Use the step-deviation method with $a = ${a}$ to find the mean of this data (class: frequency): ${lst(lo, h, f)}.</p>`, answer: a + (h * su) / N, tol: 0.005, sol: `<p>$u = \\dfrac{x - ${a}}{${h}} = -2, -1, 0, 1, 2$. $\\sum fu = ${su}$, $\\sum f = ${N}$. Mean $= ${a} + ${h} \\times \\dfrac{${su}}{${N}} = ${+(a + (h * su) / N).toFixed(3)}$.</p>` }; },
      verify: (p) => meanOf(p.lo, p.h, p.f) },
    { id: 'st-g04', type: 'nat', level: 2, exams: ['board'], sub: 'mode',
      make(rng) { const h = choose(rng, [10, 20]), lo = choose(rng, [0, 10, 20]), f = peaked(rng), k = f.indexOf(Math.max(...f)), l = lo + k * h, ans = modeOf(lo, h, f); return { h, lo, f, q: `<p>Find the mode of this data (class: frequency): ${lst(lo, h, f)}.</p>`, answer: ans, tol: 0.005, sol: `<p>Modal class ${l}–${l + h}: $f_1 = ${f[k]}$, $f_0 = ${f[k - 1]}$, $f_2 = ${f[k + 1]}$, $h = ${h}$. Mode $= ${l} + \\dfrac{${f[k]} - ${f[k - 1]}}{${2 * f[k]} - ${f[k - 1]} - ${f[k + 1]}} \\times ${h} = ${+ans.toFixed(3)}$.</p>` }; },
      verify: (p) => { const k = p.f.indexOf(Math.max(...p.f)), l = p.lo + k * p.h, t = p.f; let a = l, b = l + p.h; for (let i = 0; i < 60; i++) { const c = (a + b) / 2; const A = t[k - 1] + ((t[k] - t[k - 1]) * (c - l)) / p.h, B = t[k] + ((t[k + 1] - t[k]) * (c - l)) / p.h; if (A < B) a = c; else b = c; } return (a + b) / 2; } },
    { id: 'st-g05', type: 'nat', level: 2, exams: ['board'], sub: 'median',
      make(rng) { const h = choose(rng, [5, 10, 20]), lo = choose(rng, [0, 10, 20]), f = Array.from({ length: 5 }, () => pick(rng, 3, 14)), ans = medianOf(lo, h, f); return { h, lo, f, q: `<p>Find the median of this data (class: frequency): ${lst(lo, h, f)}.</p>`, answer: ans, tol: 0.005, sol: `<p>$n = ${sum(f)}$, $n/2 = ${sum(f) / 2}$. Add up the frequencies until the running total reaches $n/2$: that class is the median class. Using $l + \\dfrac{n/2 - cf}{f} \\times h$ gives ${+ans.toFixed(3)}.</p>` }; },
      verify: (p) => { const N = sum(p.f); let c = 0; for (let i = 0; i < 5; i++) { const t = c + p.f[i]; if (t >= N / 2) return p.lo + p.h * (i + (N / 2 - c) / (t - c)); c = t; } } },
    { id: 'st-g06', type: 'nat', level: 3, exams: ['board'], sub: 'empirical',
      make(rng) { const mean = pick(rng, 20, 90, 0.5), med = mean - pick(rng, 1, 4, 0.5); return { mean, med, q: `<p>For a moderately skewed distribution the mean is ${mean} and the median is ${med}. Estimate the mode.</p>`, answer: 3 * med - 2 * mean, tol: 0.005, sol: `<p>Mode $\\approx 3 \\times ${med} - 2 \\times ${mean} = ${3 * med - 2 * mean}$.</p>` }; },
      verify: (p) => p.med + 2 * (p.med - p.mean) },
    { id: 'st-g07', type: 'nat', level: 3, exams: ['board'], sub: 'mean',
      make(rng) {
        const X = xs(0, 20);
        for (let t = 0; t < 80; t++) {
          const k = [pick(rng, 3, 9), pick(rng, 5, 12), 0, pick(rng, 4, 12), pick(rng, 2, 8)], p = pick(rng, 4, 14), f = k.slice(); f[2] = p;
          const N = sum(f), M = +(sum(f.map((v, i) => v * X[i])) / N).toFixed(2), S = sum(k), A = sum(k.map((v, i) => v * X[i]));
          if (Math.abs(M - 50) > 0.5 && Math.abs((M * S - A) / (50 - M) - p) < 0.02) return { sk: S, ax: A, mu: M, q: `<p>The mean of the data is ${M}. Find the missing frequency $p$. Classes (width 20, starting at 0) have frequencies ${k.slice(0, 2).join(', ')}, $p$, ${k.slice(3).join(', ')}.</p>`, answer: p, tol: 0, sol: `<p>Class marks 10, 30, 50, 70, 90. $\\sum fx = ${A} + 50p$ and $\\sum f = ${S} + p$. Setting $\\dfrac{${A} + 50p}{${S} + p} = ${M}$ gives $p = ${p}$.</p>` };
        }
        return { sk: 27, ax: 1070, mu: 42, q: `<p>The mean of the data is 42. Find the missing frequency $p$. Classes (width 20, starting at 0) have frequencies 8, 10, $p$, 6, 3.</p>`, answer: 8, tol: 0, sol: `<p>$\\dfrac{1070 + 50p}{27 + p} = 42$ gives $p = 8$.</p>` };
      },
      verify: (p) => Math.round((p.mu * p.sk - p.ax) / (50 - p.mu)) },
    { id: 'st-g08', type: 'nat', level: 3, exams: ['board'], sub: 'mean',
      make(rng) { const h = choose(rng, [10, 20]), n0 = pick(rng, 5, 25), f = Array.from({ length: 5 }, () => pick(rng, 3, 14)), a = pick(rng, 2, 8); return { h, f, a, q: `<p>Class marks of a table are ${xs(n0, h).join(', ')} with frequencies ${f.join(', ')}. A student uses an assumed mean of ${xs(n0, h)[a % 5]} and gets $\\sum fd = ${sum(f.map((v, i) => v * (xs(n0, h)[i] - xs(n0, h)[a % 5])))}$. Find the mean.</p>`, n0, answer: meanOf(n0, h, f), tol: 0.005, sol: `<p>Mean $= a + \\dfrac{\\sum fd}{\\sum f}$ with $a = ${xs(n0, h)[a % 5]}$ and $\\sum f = ${sum(f)}$, which gives ${+meanOf(n0, h, f).toFixed(3)}.</p>` }; },
      verify: (p) => { const x = xs(p.n0, p.h); return sum(p.f.map((v, i) => v * x[i])) / sum(p.f); } },
  ],
};

import { int, choose, fmt, numOpts, textOpts, steps } from './_q.js';
const E = ['gmat', 'gre'];
export default {
  topic: 'exponents',
  items: [
    { id: 'ex-001', type: 'mcq', level: 2, exams: E, sub: 'rules',
      q: '<p>Which of the following equals 4<sup>5</sup> × 8<sup>2</sup>?</p>', options: ['2<sup>10</sup>', '2<sup>13</sup>', '2<sup>16</sup>', '32<sup>7</sup>', '32<sup>10</sup>'], answer: 2,
      sol: '<p>Write both in base 2: 4<sup>5</sup> = (2<sup>2</sup>)<sup>5</sup> = 2<sup>10</sup> and 8<sup>2</sup> = (2<sup>3</sup>)<sup>2</sup> = 2<sup>6</sup>. Multiplying adds exponents: 2<sup>10 + 6</sup> = 2<sup>16</sup>.</p>', trap: 'Multiplying the bases (32) and adding the exponents (7) is not a rule.' },
    { id: 'ex-002', type: 'mcq', level: 2, exams: E, sub: 'roots',
      q: '<p>What is √50 + √18?</p>', options: ['√68', '8√2', '2√17', '10√2', '34'], answer: 1,
      sol: '<p>√50 = √(25 × 2) = 5√2 and √18 = √(9 × 2) = 3√2. Like terms add: 5√2 + 3√2 = 8√2.</p>', trap: '√a + √b is not √(a + b).' },
    { id: 'ex-003', type: 'mcq', level: 3, exams: E, sub: 'factor out',
      q: '<p>What is (3<sup>20</sup> − 3<sup>18</sup>) ÷ 3<sup>18</sup>?</p>', options: ['3<sup>2</sup>', '8', '9', '3<sup>18</sup>', '2'], answer: 1,
      sol: '<p>Factor out 3<sup>18</sup>: 3<sup>20</sup> − 3<sup>18</sup> = 3<sup>18</sup>(3<sup>2</sup> − 1) = 3<sup>18</sup> × 8. Dividing by 3<sup>18</sup> leaves 8.</p>', trap: 'Subtracting exponents (20 − 18 = 2) gives 9; that only works for division, not subtraction.' },
    { id: 'ex-004', type: 'mcq', level: 2, exams: E, sub: 'negative exponents',
      q: '<p>What is (1/2)<sup>−3</sup> + 4<sup>1/2</sup>?</p>', options: ['−6', '1/8', '6', '10', '16'], answer: 3,
      sol: '<p>A negative exponent flips the fraction: (1/2)<sup>−3</sup> = 2<sup>3</sup> = 8. A power of 1/2 is a square root: 4<sup>1/2</sup> = 2. Total 10.</p>' },
  ],
  gens: [
    { id: 'ex-g01', type: 'mcq', level: 2, exams: E, sub: 'same base', title: 'solve for the exponent',
      make(r) {
        const b = choose(r, [2, 3]), p = choose(r, [2, 3]), qq = choose(r, [2, 3, 4].filter((x) => x !== p)), m = int(r, 2, 6);
        let c = (p - ((qq * m) % p)) % p; if (c === 0) c = p;
        const A = b ** p, B = b ** qq, value = (qq * m + c) / p;
        return { q: `<p>If ${A}<sup><i>x</i></sup> = ${B}<sup>${m}</sup> × ${b}<sup>${c}</sup>, what is the value of <i>x</i>?</p>`, ...numOpts(r, value, [m + c, Math.round((qq * m) / p), value + 1]), value, p, qq, m, c,
          hint: `Write every number as a power of ${b}, then set the exponents equal.`,
          sol: steps(`${A} = ${b}<sup>${p}</sup> and ${B} = ${b}<sup>${qq}</sup>.`, `Left: ${b}<sup>${p}x</sup>. Right: ${b}<sup>${qq * m}</sup> × ${b}<sup>${c}</sup> = ${b}<sup>${qq * m + c}</sup>.`, `${p}x = ${qq * m + c}, so <b>x = ${value}</b>.`) };
      }, check: (p) => (p.qq * p.m + p.c) / p.p },
    { id: 'ex-g02', type: 'mcq', level: 2, exams: E, sub: 'roots', title: 'simplify a square root',
      make(r) {
        const s = choose(r, [2, 3, 4, 5, 6, 7, 8, 9, 10, 12]), f = choose(r, [2, 3, 5, 6, 7]), n = s * s * f, k = int(r, 2, 5);
        const value = k * s;
        return { q: `<p>If ${k}√${n} = <i>a</i>√${f}, where <i>a</i> is an integer, what is <i>a</i>?</p>`, ...numOpts(r, value, [s, k + s, k * s * s]), value, n, k, f,
          hint: `Find the largest perfect square that divides ${n}.`,
          sol: steps(`${n} = ${s * s} × ${f}, and ${s * s} is a perfect square.`, `√${n} = √${s * s} × √${f} = ${s}√${f}.`, `${k} × ${s}√${f} = ${value}√${f}, so <b>a = ${value}</b>.`) };
      }, check: (p) => p.k * Math.sqrt(p.n / p.f) },
    { id: 'ex-g03', type: 'mcq', level: 3, exams: E, sub: 'factor out', title: 'factor out the common power',
      make(r) {
        const b = choose(r, [2, 3, 5]), n = int(r, 10, 40), d = choose(r, [1, 2, 3]), sign = r() < 0.5 ? 1 : -1;
        const value = b ** d + sign;
        return { q: `<p>(${b}<sup>${n + d}</sup> ${sign > 0 ? '+' : '−'} ${b}<sup>${n}</sup>) ÷ ${b}<sup>${n}</sup> = ?</p>`, ...numOpts(r, value, [b ** d, d, b ** (d + 1)]), value, b, d, sign,
          hint: `Take ${b}<sup>${n}</sup> out of both terms.`,
          sol: steps(`${b}<sup>${n + d}</sup> = ${b}<sup>${n}</sup> × ${b}<sup>${d}</sup>.`, `So the top is ${b}<sup>${n}</sup>(${b ** d} ${sign > 0 ? '+' : '−'} 1).`, `Dividing by ${b}<sup>${n}</sup> leaves <b>${value}</b>.`), trap: 'Adding or subtracting exponents across a + or − sign.' };
      }, check: (p) => p.b ** p.d + p.sign },
    { id: 'ex-g04', type: 'mcq', level: 2, exams: E, sub: 'powers of ten', title: 'powers of ten',
      make(r) {
        const a = choose(r, [2, 4, 5, 8, 25, 125]), k = choose(r, [2, 4, 5, 8]), x = int(r, 3, 6), y = int(r, 1, x - 1);
        const value = a * k * 10 ** (x - y);
        return { q: `<p>What is (${a} × 10<sup>${x}</sup>) × (${k} × 10<sup>−${y}</sup>)?</p>`, ...numOpts(r, value, [value * 10, value / 10, a * k * 10 ** (x + y)]), value, a, k, x, y,
          hint: 'Multiply the plain numbers and add the powers of ten separately.',
          sol: steps(`${a} × ${k} = ${a * k}.`, `10<sup>${x}</sup> × 10<sup>−${y}</sup> = 10<sup>${x - y}</sup>.`, `${a * k} × 10<sup>${x - y}</sup> = <b>${fmt(value)}</b>.`) };
      }, check: (p) => p.a * p.k * 10 ** (p.x - p.y) },
  ],
};

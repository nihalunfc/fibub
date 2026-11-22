// Class 10 Maths, Real Numbers: live problems (original fibub questions). Ids start with c10m-real-.
import { pick, choose, n, steps } from './_util.js';

const sup = (p, e) => (e > 1 ? `${p}<sup>${e}</sup>` : `${p}`);
export default {
  'c10m-real-hcflcm': {
    title: 'HCF or LCM from prime factors',
    make(r) {
      const e = () => [pick(r, 0, 3), pick(r, 0, 2), pick(r, 0, 2)];
      let A = e(), B = e(); if (A.join() === B.join()) B[0] = (B[0] + 1) % 4; if (!A.some((v) => v)) A[0] = 1; if (!B.some((v) => v)) B[1] = 1;
      const val = (x) => 2 ** x[0] * 3 ** x[1] * 5 ** x[2], a = val(A), b = val(B), ask = choose(r, ['HCF', 'LCM']);
      const f = (x) => [[2, x[0]], [3, x[1]], [5, x[2]]].filter((t) => t[1]).map((t) => sup(t[0], t[1])).join(' × ') || '1';
      const hc = [0, 1, 2].map((i) => Math.min(A[i], B[i])), lc = [0, 1, 2].map((i) => Math.max(A[i], B[i]));
      const answer = ask === 'HCF' ? val(hc) : val(lc);
      return { a, b, ask, q: `<p>Find the ${ask} of ${a} and ${b} using prime factorisation.</p>`, answer, unit: '', tol: 0.001,
        hint: ask === 'HCF' ? 'Write both as products of primes. HCF = product of each common prime with its smallest power.' : 'Write both as products of primes. LCM = product of every prime with its greatest power.',
        solution: steps(`${a} = ${f(A)}, and ${b} = ${f(B)}.`, ask === 'HCF' ? `Smallest power of each common prime: ${f(hc)}.` : `Greatest power of every prime: ${f(lc)}.`, `${ask} = <b>${n(answer)}</b>.`) };
    },
    verify: (x) => { const g = (p, q) => (q ? g(q, p % q) : p); return x.ask === 'HCF' ? g(x.a, x.b) : (x.a / g(x.a, x.b)) * x.b; },
  },
  'c10m-real-product': {
    title: 'use HCF × LCM = product of the numbers',
    make(r) {
      const h = pick(r, 2, 15), p = choose(r, [2, 3, 5, 7]), q = choose(r, [1, 4, 9, 11, 13]), x = h * p, y = h * q * (p === 2 ? 3 : 1);
      const g = (u, v) => (v ? g(v, u % v) : u), H = g(x, y), L = (x * y) / H;
      return { x, y, H, q: `<p>The HCF of two numbers is ${H} and one of them is ${x}. The other number is ${y}. Find their LCM.</p>`, answer: L, unit: '', tol: 0.001,
        hint: 'HCF × LCM = product of the two numbers.', solution: steps(`HCF × LCM = ${x} × ${y}.`, `LCM = ${x} × ${y} ÷ ${H} = <b>${n(L)}</b>.`) };
    },
    verify: (x) => { for (let m = Math.max(x.x, x.y); ; m += Math.max(x.x, x.y)) if (m % x.x === 0 && m % x.y === 0) return m; },
  },
  'c10m-real-bells': {
    title: 'when will they meet again (LCM story)',
    make(r) {
      const t = choose(r, [[12, 18, 30], [8, 12, 20], [10, 15, 25], [6, 8, 14], [9, 12, 15], [16, 24, 36]]), who = choose(r, ['three temple bells ring', 'three buses leave the stand', 'three runners complete a lap']);
      const g = (u, v) => (v ? g(v, u % v) : u), l2 = (t[0] * t[1]) / g(t[0], t[1]), L = (l2 * t[2]) / g(l2, t[2]);
      return { t, q: `<p>At 6 a.m., ${who} together. After that they do so every ${t[0]}, ${t[1]} and ${t[2]} minutes respectively. After how many minutes will they next do it together?</p>`, answer: L, unit: 'minutes', tol: 0.001,
        hint: 'They coincide again at the least common multiple of the three gaps.', solution: steps(`Gaps: ${t.join(', ')} minutes. Find LCM(${t.join(', ')}).`, `LCM = <b>${L}</b> minutes.`) };
    },
    verify: (x) => { for (let m = 1; ; m++) if (m % x.t[0] === 0 && m % x.t[1] === 0 && m % x.t[2] === 0) return m; },
  },
  'c10m-real-tiles': {
    title: 'largest square tile for a floor (HCF story)',
    make(r) {
      const s = pick(r, 6, 30, 2), a = choose(r, [3, 4, 5, 7, 8]), b = choose(r, [9, 10, 11, 13, 14]), L = s * a, B = s * b, G = (u, v) => (v ? G(v, u % v) : u), ans = s * G(a, b);
      return { L, B, q: `<p>A rectangular floor is ${L} cm long and ${B} cm wide. It is to be covered with the largest possible square tiles with no cutting. What is the side of each tile, in cm?</p>`, answer: ans, unit: 'cm', tol: 0.001,
        hint: 'The side must divide both the length and the width: take the HCF.', solution: steps(`The tile side divides ${L} and ${B}; the largest such number is their HCF.`, `HCF(${L}, ${B}) = <b>${ans} cm</b>.`) };
    },
    verify: (x) => { for (let d = Math.min(x.L, x.B); d >= 1; d--) if (x.L % d === 0 && x.B % d === 0) return d; },
  },
  'c10m-real-decimal': {
    title: 'places before a decimal ends',
    make(r) {
      let m = pick(r, 0, 4), k = pick(r, 0, 4); if (m + k === 0) k = 1; const pp = choose(r, [1, 3, 7, 9, 11, 13]);
      const den = 2 ** m * 5 ** k, p = pp, answer = Math.max(m, k);
      return { p, den, m, k, q: `<p>The fraction ${p}/${den} has a terminating decimal expansion. After how many places of decimals does it end?</p>`, answer, abs: 0.01, tol: 0, unit: 'places',
        hint: 'Write the denominator as 2<sup>m</sup> × 5<sup>k</sup>. The decimal ends after the larger of m and k places.',
        solution: steps(`${den} = ${sup(2, m)} × ${sup(5, k)}, so m = ${m} and k = ${k}.`, `Multiply top and bottom by ${m > k ? '5<sup>' + (m - k) + '</sup>' : '2<sup>' + (k - m) + '</sup>'} to make the denominator a power of 10: it is 10<sup>${answer}</sup>.`, `So it ends after <b>${answer}</b> places.`) };
    },
    verify: (x) => { let rem = x.p % x.den, c = 0; while (rem !== 0 && c < 20) { rem = (rem * 10) % x.den; c++; } return c; },
  },
};

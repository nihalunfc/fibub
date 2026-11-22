// Live problems for Binomial theorem.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const C = (a, b) => { if (b < 0 || b > a) return 0; let c = 1; for (let i = 1; i <= b; i++) c = (c * (a - b + i)) / i; return Math.round(c); };
const big = (v) => v.toLocaleString('en-IN').replace('-', '−');
const sg = (v) => String(v).replace('-', '−');
const xk = (k) => (k === 1 ? 'x' : `x<sup>${k}</sup>`);

export default {
  'bin-coef': {
    title: 'coefficient of a power of x in (ax + b)ⁿ',
    make(r) {
      const a = pick(r, 1, 3), b = pick(r, -3, 3) || 2, N = pick(r, 4, 9), k = pick(r, 1, N - 1);
      const answer = C(N, k) * a ** k * b ** (N - k);
      return { a, b, N, k,
        q: `<p>Find the coefficient of ${xk(k)} in the expansion of (${a === 1 ? '' : a}x ${b < 0 ? '− ' + -b : '+ ' + b})<sup>${N}</sup>.</p>`,
        answer, unit: '', tol: 0, abs: 0.5,
        hint: 'The general term of (A + B)ⁿ is C(n, r) A^(n − r) B^r. Choose r so that the power of x comes out right, and keep the sign of B.',
        solution: steps(`Write it as (${sg(b)} + ${a === 1 ? '' : a}x)<sup>${N}</sup>: T<sub>r+1</sub> = C(${N}, r) (${sg(b)})<sup>${N} − r</sup> (${a}x)<sup>r</sup>.`, `${xk(k)} needs r = ${k}.`, `Coefficient = C(${N}, ${k}) × ${a}<sup>${k}</sup> × (${sg(b)})<sup>${N - k}</sup> = ${C(N, k)} × ${a ** k} × ${sg(b ** (N - k))} = <b>${big(answer)}</b>.`) };
    },
    verify: (x) => { let p = [1]; for (let i = 0; i < x.N; i++) { const q = new Array(p.length + 1).fill(0); p.forEach((c, j) => { q[j] += c * x.b; q[j + 1] += c * x.a; }); p = q; } return p[x.k]; },
  },
  'bin-indep': {
    title: 'term independent of x',
    make(r) {
      // (x^p + c/x^q)^N: exponent p(N − r) − q r = 0 needs r = pN/(p + q) to be a whole number
      const opts = [[1, 1, 6], [1, 1, 8], [2, 1, 6], [2, 1, 9], [1, 2, 6], [1, 2, 9], [3, 1, 8], [1, 3, 8], [2, 3, 10], [3, 2, 10]];
      const [p, qe, N] = opts[Math.floor(r() * opts.length)], c = [1, 2, 3, -1, -2][Math.floor(r() * 5)];
      const rr = (p * N) / (p + qe), answer = C(N, rr) * c ** rr;
      const xp = (e) => (e === 1 ? 'x' : `x<sup>${e}</sup>`);
      return { p, qe, N, c,
        q: `<p>Find the term independent of x in the expansion of (${xp(p)} ${c < 0 ? '−' : '+'} ${Math.abs(c) === 1 ? '' : Math.abs(c)}1/${xp(qe)})<sup>${N}</sup>.</p>`.replace(/ (\d+)1\//, ' $1/'),
        answer, unit: '', tol: 0, abs: 0.5,
        hint: 'Write the general term, collect the power of x, and set it to zero to find r.',
        solution: steps(`T<sub>r+1</sub> = C(${N}, r) (${xp(p)})<sup>${N} − r</sup> (${sg(c)}/${xp(qe)})<sup>r</sup> = C(${N}, r) (${sg(c)})<sup>r</sup> x<sup>${p}(${N} − r) − ${qe}r</sup>.`, `${p}(${N} − r) − ${qe}r = 0 ⇒ r = ${p * N}/${p + qe} = ${rr}.`, `Term = C(${N}, ${rr}) × (${sg(c)})<sup>${rr}</sup> = ${C(N, rr)} × ${sg(c ** rr)} = <b>${big(answer)}</b>.`) };
    },
    verify: (x) => { // expand with a map from exponent to coefficient
      let m = new Map([[0, 1]]);
      for (let i = 0; i < x.N; i++) { const nm = new Map(); for (const [e, v] of m) { nm.set(e + x.p, (nm.get(e + x.p) || 0) + v); nm.set(e - x.qe, (nm.get(e - x.qe) || 0) + v * x.c); } m = nm; }
      return m.get(0) || 0;
    },
  },
  'bin-rem': {
    title: 'remainder of a large power',
    make(r) {
      const opts = [[2, 3, 7], [3, 2, 8], [5, 2, 24], [7, 2, 48], [2, 5, 31], [9, 1, 8], [17, 1, 16], [3, 3, 26], [4, 3, 63], [2, 3, 9], [3, 3, 28], [5, 2, 26], [2, 4, 17], [10, 1, 11]];
      const [b, e, m] = opts[Math.floor(r() * opts.length)], k = pick(r, 10, 60);
      // b^(e k) = (b^e)^k = (m ± 1)^k
      const be = b ** e, s = be - m; // s = 1 or −1
      const answer = s === 1 ? 1 : k % 2 === 0 ? 1 : m - 1;
      return { b, e, m, k,
        q: `<p>Find the remainder when ${b}<sup>${e * k}</sup> is divided by ${m}.</p>`,
        answer, unit: '', tol: 0, abs: 0.1,
        hint: `${b}<sup>${e}</sup> = ${be} is one ${s === 1 ? 'more' : 'less'} than ${m}. Write ${b}<sup>${e * k}</sup> = (${m} ${s === 1 ? '+' : '−'} 1)<sup>${k}</sup> and expand: every term but the last has a factor ${m}.`,
        solution: steps(`${b}<sup>${e * k}</sup> = (${b}<sup>${e}</sup>)<sup>${k}</sup> = (${m} ${s === 1 ? '+' : '−'} 1)<sup>${k}</sup>.`, `Expanding, every term except the last contains ${m}. The last term is (${sg(s)})<sup>${k}</sup> = ${sg(s ** k)}.`, s ** k === 1 ? `So the remainder is <b>1</b>.` : `So ${b}<sup>${e * k}</sup> = (multiple of ${m}) − 1, and the remainder is ${m} − 1 = <b>${m - 1}</b>.`) };
    },
    verify: (x) => { let res = 1n; const B = BigInt(x.b), M = BigInt(x.m); for (let i = 0; i < x.e * x.k; i++) res = (res * B) % M; return Number(res); },
  },
};

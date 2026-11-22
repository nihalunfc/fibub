// Live problems for Sequences and series.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const sg = (v) => String(v).replace('-', '−');
const ord = (k) => k + (k % 100 >= 11 && k % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][k % 10] || 'th');
const br = (v) => (v < 0 ? `(${sg(v)})` : String(v));

export default {
  'seq-ap': {
    title: 'sum of an AP from two of its terms',
    make(r) {
      const a = pick(r, -10, 20), d = pick(r, -4, 6) || 3, p = pick(r, 2, 6), qi = pick(r, 8, 15), N = pick(r, 15, 40);
      const tp = a + (p - 1) * d, tq = a + (qi - 1) * d, answer = (N / 2) * (2 * a + (N - 1) * d);
      return { tp, tq, p, qi, N,
        q: `<p>In an arithmetic progression the ${ord(p)} term is ${sg(tp)} and the ${ord(qi)} term is ${sg(tq)}. Find the sum of the first ${N} terms.</p>`,
        answer, unit: '', tol: 0, abs: 0.5,
        hint: 'Subtract the two term equations to get d: (q − p)d = (qth term) − (pth term). Then find a, and use Sₙ = n/2 [2a + (n − 1)d].',
        solution: steps(`d = (${sg(tq)} − ${br(tp)})/(${qi} − ${p}) = ${sg(d)}.`, `a = ${sg(tp)} − (${p} − 1) × ${br(d)} = ${sg(a)}.`, `S<sub>${N}</sub> = ${N}/2 × [2 × ${br(a)} + ${N - 1} × ${br(d)}] = ${N / 2} × ${br(2 * a + (N - 1) * d)} = <b>${sg(answer)}</b>.`) };
    },
    verify: (x) => { const d = (x.tq - x.tp) / (x.qi - x.p), a = x.tp - (x.p - 1) * d; let s = 0; for (let k = 0; k < x.N; k++) s += a + k * d; return s; },
  },
  'seq-agp': {
    title: 'sum to infinity of an arithmetico-geometric series',
    make(r) {
      const a = pick(r, 1, 4), d = pick(r, 1, 4), den = [2, 3, 4, 5][Math.floor(r() * 4)], rr = 1 / den;
      const answer = a / (1 - rr) + (d * rr) / (1 - rr) ** 2;
      const term = (k) => `${a + k * d}${k === 0 ? '' : `/${den}${k > 1 ? `<sup>${k}</sup>` : ''}`}`;
      return { a, d, den,
        q: `<p>Find the sum to infinity: ${[0, 1, 2, 3].map(term).join(' + ')} + …</p>`,
        answer, unit: '', tol: 0.001,
        hint: 'Call the sum S. Multiply by r = 1/' + den + ' and subtract: S − rS leaves a geometric series. Or use S = a/(1 − r) + dr/(1 − r)².',
        solution: steps(`The numerators form an AP (a = ${a}, d = ${d}) and the factors a GP (r = 1/${den}).`, `S − S/${den} = ${a} + ${d}/${den} + ${d}/${den}² + … = ${a} + (${d}/${den})/(1 − 1/${den}) = ${n(a + (d * rr) / (1 - rr), 5)}.`, `So S = ${n(a + (d * rr) / (1 - rr), 5)} ÷ (1 − 1/${den}) = <b>${n(answer, 5)}</b>.`) };
    },
    verify: (x) => { let s = 0; for (let k = 0; k < 200; k++) s += (x.a + k * x.d) / x.den ** k; return s; },
  },
  'seq-amgm': {
    title: 'least value by AM ≥ GM',
    make(r) {
      const sq = [1, 4, 9, 16, 25, 36], p = sq[Math.floor(r() * sq.length)], c = sq[Math.floor(r() * sq.length)] * pick(r, 1, 2);
      const answer = 2 * Math.sqrt(p * c);
      return { p, c,
        q: `<p>For x > 0, find the least value of ${p === 1 ? '' : p}x + ${c}/x.</p>`,
        answer, unit: '', tol: 0.001,
        hint: 'For two positive numbers, (A + B)/2 ≥ √(AB), with equality when A = B. Here the product of the two parts does not depend on x.',
        solution: steps(`A = ${p}x and B = ${c}/x are positive, and AB = ${p * c}, a constant.`, `So ${p}x + ${c}/x ≥ 2√${p * c} = ${n(answer, 5)}.`, `Equality when ${p}x = ${c}/x, at x = √(${c}/${p}) = ${n(Math.sqrt(c / p), 4)}, so the least value is <b>${n(answer, 5)}</b>.`) };
    },
    verify: (x) => { let m = Infinity; for (let i = 1; i <= 400000; i++) { const t = i / 20000; m = Math.min(m, x.p * t + x.c / t); } return m; },
  },
};

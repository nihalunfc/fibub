// SAT Math · Advanced math · equivalent expressions: expanding, factoring, combining. Original (fibub).
import { int, nz, choose, shuffleOpts, fmt, lin, quad, term, v, steps } from './_util.js';
const F = { section: 'math', domain: 'advanced' };
const X = v('x');
const br = (a, b) => `(${lin(a, b)})`;

export default {
  topic: 'equivalent-expressions',
  gens: [
    { id: 'sat-ee-g01', type: 'nat', level: 2, exams: ['sat'], sub: 'expand', facets: F, format: 'numeric',
      make(r) {
        const a = nz(r, 1, 5), b = nz(r, -9, 9), c = nz(r, 1, 5), d = nz(r, -9, 9), ask = choose(r, ['b', 'c', 'a + b + c']);
        const A = a * c, B = a * d + b * c, C = b * d, ans = ask === 'b' ? B : ask === 'c' ? C : A + B + C;
        return { q: `<p>The expression ${br(a, b)}${br(c, d)} is equivalent to ${v('a')}${X}<sup>2</sup> + ${v('b')}${X} + ${v('c')}, where ${v('a')}, ${v('b')} and ${v('c')} are constants. What is the value of ${ask === 'a + b + c' ? `${v('a')} + ${v('b')} + ${v('c')}` : v(ask)}?</p>`, answer: ans, tol: 0, a, b, c, d, ask,
          sol: steps(`Multiply every term in the first bracket by every term in the second: ${fmt(a)}·${fmt(c)}${X}<sup>2</sup> + ${fmt(a)}·${fmt(d)}${X} + ${fmt(b)}·${fmt(c)}${X} + ${fmt(b)}·${fmt(d)}.`, `Collect: ${quad(A, B, C)}.`,
            ask === 'a + b + c' ? `${v('a')} + ${v('b')} + ${v('c')} = ${fmt(A)} + ${fmt(B)} + ${fmt(C)} = <b>${fmt(ans)}</b>. Shortcut: it is the value of the expression at ${X} = 1: ${fmt(a + b)} × ${fmt(c + d)} = ${fmt((a + b) * (c + d))}.` : `So ${v(ask)} = <b>${fmt(ans)}</b>.`),
          trap: 'Multiplying only the first terms and the last terms (forgetting the two middle products).' };
      },
      verify: (p) => { const A = p.a * p.c, B = p.a * p.d + p.b * p.c, C = p.b * p.d; return p.ask === 'b' ? B : p.ask === 'c' ? C : A + B + C; } },
    { id: 'sat-ee-g02', type: 'nat', level: 2, exams: ['sat'], sub: 'difference of squares', facets: F, format: 'numeric',
      make(r) {
        const s = int(r, 3, 15), d = int(r, 1, s - 1), ask = choose(r, ['diff', 'prod']);
        const prod = s * d;
        return ask === 'diff'
          ? { q: `<p>If ${v('a')}<sup>2</sup> − ${v('b')}<sup>2</sup> = ${prod} and ${v('a')} + ${v('b')} = ${s}, what is the value of ${v('a')} − ${v('b')}?</p>`, answer: d, tol: 0, s, prod, ask,
            sol: steps(`${v('a')}<sup>2</sup> − ${v('b')}<sup>2</sup> = (${v('a')} + ${v('b')})(${v('a')} − ${v('b')}).`, `So ${prod} = ${s}(${v('a')} − ${v('b')}).`, `${v('a')} − ${v('b')} = ${prod} ÷ ${s} = <b>${d}</b>.`) }
          : { q: `<p>If ${v('a')} + ${v('b')} = ${s} and ${v('a')} − ${v('b')} = ${d}, what is the value of ${v('a')}<sup>2</sup> − ${v('b')}<sup>2</sup>?</p>`, answer: prod, tol: 0, s, d, ask,
            sol: steps(`${v('a')}<sup>2</sup> − ${v('b')}<sup>2</sup> = (${v('a')} + ${v('b')})(${v('a')} − ${v('b')}).`, `= ${s} × ${d} = <b>${prod}</b>.`) };
      },
      verify: (p) => (p.ask === 'diff' ? p.prod / p.s : p.s * p.d) },
    { id: 'sat-ee-g03', type: 'nat', level: 2, exams: ['sat'], sub: 'combine', facets: F, format: 'numeric',
      make(r) {
        const a = int(r, 2, 6), b = nz(r, -9, 9), c = int(r, 2, 6), d = nz(r, -9, 9), ask = choose(r, ['p', 'q']);
        const P = a - c, Q = a * b - c * d;
        return { q: `<p>The expression ${a}${br(1, b)} − ${c}${br(1, d)} can be written as ${v('p')}${X} + ${v('q')}, where ${v('p')} and ${v('q')} are constants. What is the value of ${v(ask)}?</p>`, answer: ask === 'p' ? P : Q, tol: 0, a, b, c, d, ask,
          sol: steps(`Expand: ${lin(a, a * b)} − ${c}${X} ${term(-c * d)}. The minus sign multiplies both terms in the second bracket.`, `Collect: ${lin(P, Q)}.`, `So ${v(ask)} = <b>${fmt(ask === 'p' ? P : Q)}</b>.`),
          trap: 'Writing − c(x + d) as − cx + cd: the sign of the second term must change too.' };
      },
      verify: (p) => (p.ask === 'p' ? p.a - p.c : p.a * p.b - p.c * p.d) },
    { id: 'sat-ee-g04', type: 'mcq', level: 2, exams: ['sat'], sub: 'factor', facets: F, format: 'single',
      make(r) {
        const m = nz(r, -9, 9), n = nz(r, -9, 9), k = choose(r, [1, 1, 2, 3]);
        const right = `${k === 1 ? '' : k}${br(1, m)}${br(1, n)}`;
        const o = shuffleOpts(r, right, [`${k === 1 ? '' : k}${br(1, -m)}${br(1, -n)}`, `${k === 1 ? '' : k}${br(1, m)}${br(1, -n)}`, `${k === 1 ? '' : k}${br(1, m + n)}${br(1, m * n)}`, `${k === 1 ? '' : k}${br(1, -m)}${br(1, n)}`]);
        return { q: `<p>Which expression is equivalent to ${quad(k, k * (m + n), k * m * n)}?</p>`, ...o,
          sol: steps(k === 1 ? 'Look for two numbers that multiply to the constant and add to the coefficient of x.' : `Take out the common factor ${k} first: ${k}(${quad(1, m + n, m * n)}).`, `${fmt(m)} × ${fmt(n)} = ${fmt(m * n)} and ${fmt(m)} + ${fmt(n)} = ${fmt(m + n)}.`, `So the expression is <b>${right}</b>. Check by expanding.`),
          trap: 'Getting the signs of the two numbers the wrong way round. Expand your answer to check.' };
      } },
    { id: 'sat-ee-g05', type: 'nat', level: 3, exams: ['sat'], sub: 'perfect square', facets: F, format: 'numeric',
      make(r) {
        const a = int(r, 1, 6), b = nz(r, -9, 9), ask = choose(r, ['k', 'c']);
        return { q: ask === 'k' ? `<p>If (${lin(a, b)})<sup>2</sup> = ${fmt(a * a)}${X}<sup>2</sup> + ${v('k')}${X} + ${fmt(b * b)} for all values of ${X}, what is the value of ${v('k')}?</p>`
          : `<p>The expression ${quad(a * a, 2 * a * b, 0)} + ${v('c')} is a perfect square for all values of ${X}. If ${v('c')} is a positive constant, what is the value of ${v('c')}?</p>`,
          answer: ask === 'k' ? 2 * a * b : b * b, tol: 0, a, b, ask,
          sol: steps(`(${v('p')} + ${v('q')})<sup>2</sup> = ${v('p')}<sup>2</sup> + 2${v('p')}${v('q')} + ${v('q')}<sup>2</sup>, not just ${v('p')}<sup>2</sup> + ${v('q')}<sup>2</sup>.`, `Here ${v('p')} = ${fmt(a)}${X} and ${v('q')} = ${fmt(b)}, so (${lin(a, b)})<sup>2</sup> = ${quad(a * a, 2 * a * b, b * b)}.`, `So ${v(ask)} = <b>${fmt(ask === 'k' ? 2 * a * b : b * b)}</b>.`),
          trap: 'Squaring each term separately: (p + q)² is not p² + q².' };
      },
      verify: (p) => (p.ask === 'k' ? 2 * p.a * p.b : p.b * p.b) },
  ],
  items: [
    { id: 'sat-ee-001', type: 'mcq', level: 1, exams: ['sat'], sub: 'combine', facets: F,
      q: '<p>Which expression is equivalent to (4<i>x</i><sup>2</sup> − 3<i>x</i> + 7) − (<i>x</i><sup>2</sup> + 5<i>x</i> − 2)?</p>',
      options: ['3<i>x</i><sup>2</sup> − 8<i>x</i> + 9', '3<i>x</i><sup>2</sup> + 2<i>x</i> + 5', '3<i>x</i><sup>2</sup> − 8<i>x</i> + 5', '5<i>x</i><sup>2</sup> + 2<i>x</i> + 9'], answer: 0,
      sol: '<p>Subtracting a bracket changes every sign inside it: 4<i>x</i><sup>2</sup> − 3<i>x</i> + 7 − <i>x</i><sup>2</sup> − 5<i>x</i> + 2 = 3<i>x</i><sup>2</sup> − 8<i>x</i> + 9.</p>' },
    { id: 'sat-ee-002', type: 'mcq', level: 3, exams: ['sat'], sub: 'factor', facets: F,
      q: '<p>Which expression is a factor of 6<i>x</i><sup>2</sup> + 7<i>x</i> − 20?</p>',
      options: ['3<i>x</i> − 4', '3<i>x</i> + 4', '2<i>x</i> − 5', '6<i>x</i> + 5'], answer: 0,
      sol: '<p>6<i>x</i><sup>2</sup> + 7<i>x</i> − 20 = (3<i>x</i> − 4)(2<i>x</i> + 5). Check: 6<i>x</i><sup>2</sup> + 15<i>x</i> − 8<i>x</i> − 20. A quick test: a factor 3<i>x</i> − 4 means <i>x</i> = 4/3 makes the expression zero: 6(16/9) + 28/3 − 20 = 32/3 + 28/3 − 20 = 0. ✓</p>' },
  ],
};

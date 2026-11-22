// SAT Math · Algebra · systems of two linear equations. Original (fibub).
import { int, nz, other, choose, shuffleOpts, fmt, lin, term, v, usd, steps } from './_util.js';
const F = { section: 'math', domain: 'algebra' };
const X = v('x'), Y = v('y');
const eq = (a, b, c) => `${term(a, 'x', true)}${term(b, 'y')} = ${fmt(c)}`;

export default {
  topic: 'systems-of-equations',
  gens: [
    { id: 'sat-sy-g01', type: 'nat', level: 2, exams: ['sat'], sub: 'solve', facets: F, format: 'numeric',
      make(r) {
        const x = nz(r, -6, 8), y = nz(r, -6, 8), a = nz(r, -4, 5), b = nz(r, -4, 5);
        let c = nz(r, -4, 5), d = nz(r, -4, 5); if (a * d - b * c === 0) d += 1; if (d === 0) d = 2;
        const ask = choose(r, ['x', 'y', 'x + y']);
        const ans = ask === 'x' ? x : ask === 'y' ? y : x + y;
        return { q: `<p>${eq(a, b, a * x + b * y)}<br>${eq(c, d, c * x + d * y)}</p><p>The solution to the system of equations above is (${X}, ${Y}). What is the value of ${ask === 'x + y' ? X + ' + ' + Y : v(ask)}?</p>`, answer: ans, tol: 0, a, b, c, d, e: a * x + b * y, f: c * x + d * y, ask,
          sol: steps(`Eliminate one variable: multiply the equations so the ${Y} terms match, then subtract (or substitute).`, `Working it through gives ${X} = ${fmt(x)} and ${Y} = ${fmt(y)}.`, `Check in both equations: ${fmt(a * x + b * y)} and ${fmt(c * x + d * y)}. So the answer is <b>${fmt(ans)}</b>. On the test you can also graph both lines in Desmos and click the crossing point.`) };
      },
      verify: (p) => { const D = p.a * p.d - p.b * p.c, x = (p.e * p.d - p.b * p.f) / D, y = (p.a * p.f - p.e * p.c) / D; return p.ask === 'x' ? x : p.ask === 'y' ? y : x + y; } },
    { id: 'sat-sy-g02', type: 'mcq', level: 2, exams: ['sat'], sub: 'number of solutions', facets: F, format: 'single',
      make(r) {
        const a = nz(r, 1, 6), b = nz(r, -5, 5), c = int(r, 1, 12), k = int(r, 2, 4), kind = choose(r, ['none', 'many', 'one']);
        const second = kind === 'many' ? eq(k * a, k * b, k * c) : kind === 'none' ? eq(k * a, k * b, k * c + nz(r, 1, 6)) : eq(k * a, k * b + 1, k * c);
        const right = { none: 'Zero', many: 'Infinitely many', one: 'Exactly one' }[kind];
        const o = shuffleOpts(r, right, ['Zero', 'Exactly one', 'Exactly two', 'Infinitely many']);
        return { q: `<p>${eq(a, b, c)}<br>${second}</p><p>How many solutions does the system of equations above have?</p>`, ...o,
          sol: steps(`Multiply the first equation by ${k}: ${eq(k * a, k * b, k * c)}.`,
            kind === 'many' ? 'That is exactly the second equation: the same line twice, so <b>infinitely many</b> solutions.'
              : kind === 'none' ? 'Same left side, different right side: the lines are parallel and never meet, so <b>zero</b> solutions.'
                : 'The left sides differ, so the slopes differ and the lines cross once: <b>exactly one</b> solution.'),
          trap: 'Two straight lines can never meet exactly twice.' };
      } },
    { id: 'sat-sy-g03', type: 'nat', level: 3, exams: ['sat'], sub: 'constant for infinitely many', facets: F, format: 'numeric',
      make(r) {
        const a = int(r, 1, 6), b = nz(r, -5, 5), c = int(r, 1, 12), k = int(r, 2, 5), kind = choose(r, ['many', 'none']);
        const q = kind === 'many'
          ? `<p>${eq(a, b, c)}<br>${term(k * a, 'x', true)}${term(k * b, 'y')} = ${v('c')}</p><p>In the system above, ${v('c')} is a constant. If the system has infinitely many solutions, what is the value of ${v('c')}?</p>`
          : `<p>${eq(a, b, c)}<br>${v('k')}${X}${term(k * b, 'y')} = ${fmt(k * c + 1)}</p><p>In the system above, ${v('k')} is a constant. If the system has no solution, what is the value of ${v('k')}?</p>`;
        const ans = kind === 'many' ? k * c : k * a;
        return { q, answer: ans, tol: 0, a, b, c, k, kind,
          sol: kind === 'many' ? steps(`For infinitely many solutions, the second equation must be a multiple of the first.`, `Its ${Y} coefficient is ${fmt(k * b)} = ${k} × ${fmt(b)}, so it is ${k} times the first.`, `So ${v('c')} = ${k} × ${c} = <b>${k * c}</b>.`)
            : steps(`For no solution, the lines must be parallel: the left sides in the same ratio, but not the right sides.`, `The ${Y} coefficients are in the ratio ${k}, so ${v('k')} = ${k} × ${a} = <b>${k * a}</b>.`, `Then the right side would need to be ${k * c} for the same line, but it is ${k * c + 1}, so the lines are parallel and distinct.`) };
      },
      verify: (p) => (p.kind === 'many' ? p.k * p.c : p.k * p.a) },
    { id: 'sat-sy-g04', type: 'nat', level: 2, exams: ['sat'], sub: 'word problem', facets: F, format: 'numeric',
      make(r) {
        const s = choose(r, [['A theatre sold', 'adult tickets', 'student tickets', 'tickets'], ['A bakery sold', 'large cakes', 'small cakes', 'cakes'], ['A school bought', 'laptops', 'tablets', 'devices']]);
        const pa = int(r, 3, 12) * (s[3] === 'devices' ? 50 : 2), pb = pa - int(r, 1, 4) * (s[3] === 'devices' ? 50 : 1), na = int(r, 5, 60), nb = int(r, 5, 60);
        const N = na + nb, T = na * pa + nb * pb;
        return { q: `<p>${s[0]} ${N} ${s[3]} in total: ${s[1]} at ${usd(pa)} each and ${s[2]} at ${usd(pb)} each. The total was ${usd(T)}. How many ${s[1]} were sold?</p>`.replace('sold?', s[0].includes('bought') ? 'bought?' : 'sold?'), answer: na, tol: 0, pa, pb, N, T,
          sol: steps(`Let ${v('a')} be the number of ${s[1]} and ${v('b')} the number of ${s[2]}: ${v('a')} + ${v('b')} = ${N} and ${pa}${v('a')} + ${pb}${v('b')} = ${T}.`, `Substitute ${v('b')} = ${N} − ${v('a')}: ${pa}${v('a')} + ${pb}(${N} − ${v('a')}) = ${T}, so ${pa - pb}${v('a')} = ${T - pb * N}.`, `${v('a')} = <b>${na}</b> (and ${v('b')} = ${nb}).`) };
      },
      verify: (p) => (p.T - p.pb * p.N) / (p.pa - p.pb) },
    { id: 'sat-sy-g05', type: 'nat', level: 3, exams: ['sat'], sub: 'combine equations', facets: F, format: 'numeric',
      make(r) {
        const x = int(r, -5, 9), y = int(r, -5, 9), a = int(r, 2, 7), b = int(r, 1, 6);
        // (a)x + (b)y = e ; (b)x + (a)y = f  → x + y = (e+f)/(a+b), x − y = (e−f)/(a−b)
        const A = a === b ? a + 1 : a, e = A * x + b * y, f = b * x + A * y, ask = choose(r, ['sum', 'diff']);
        return { q: `<p>${eq(A, b, e)}<br>${eq(b, A, f)}</p><p>If (${X}, ${Y}) is the solution to the system above, what is the value of ${ask === 'sum' ? X + ' + ' + Y : X + ' − ' + Y}?</p>`, answer: ask === 'sum' ? x + y : x - y, tol: 0, A, b, e, f, ask,
          sol: steps(ask === 'sum' ? `Add the two equations: ${A + b}${X} + ${A + b}${Y} = ${fmt(e + f)}.` : `Subtract the second equation from the first: ${fmt(A - b)}${X} − ${fmt(A - b)}${Y} = ${fmt(e - f)}.`,
            ask === 'sum' ? `Divide by ${A + b}: ${X} + ${Y} = <b>${fmt(x + y)}</b>.` : `Divide by ${fmt(A - b)}: ${X} − ${Y} = <b>${fmt(x - y)}</b>.`, 'Adding or subtracting whole equations is much faster than finding x and y separately.') };
      },
      verify: (p) => (p.ask === 'sum' ? (p.e + p.f) / (p.A + p.b) : (p.e - p.f) / (p.A - p.b)) },
  ],
  items: [
    { id: 'sat-sy-001', type: 'mcq', level: 1, exams: ['sat'], sub: 'graphs', facets: F,
      q: '<p>The graphs of two linear equations in the <i>xy</i>-plane cross at the point (3, −2). Which statement must be true?</p>',
      options: ['<i>x</i> = 3 and <i>y</i> = −2 make both equations true.', 'Both lines have a slope of −2/3.', 'Both lines pass through the origin.', 'The system has no solution.'], answer: 0,
      sol: '<p>The crossing point is on both lines, so its coordinates satisfy both equations. That is what "the solution to a system" means.</p>' },
    { id: 'sat-sy-002', type: 'nat', level: 2, exams: ['sat'], sub: 'word problem', facets: F,
      q: '<p>A farm has only chickens and goats. The animals have 50 heads and 140 legs in total. How many goats are on the farm?</p>', answer: 20, tol: 0,
      sol: '<p><i>c</i> + <i>g</i> = 50 and 2<i>c</i> + 4<i>g</i> = 140. Double the first: 2<i>c</i> + 2<i>g</i> = 100. Subtract: 2<i>g</i> = 40, so <i>g</i> = <b>20</b> (and 30 chickens).</p>' },
    { id: 'sat-sy-003', type: 'mcq', level: 3, exams: ['sat'], sub: 'model', facets: F,
      q: '<p>A gym charges a $40 joining fee and $25 a month. A second gym charges no joining fee and $33 a month. Which system can be used to find the number of months <i>m</i> after which the total costs <i>C</i> are equal?</p>',
      options: ['<i>C</i> = 40 + 25<i>m</i> and <i>C</i> = 33<i>m</i>', '<i>C</i> = 25 + 40<i>m</i> and <i>C</i> = 33<i>m</i>', '<i>C</i> = 40<i>m</i> + 25 and <i>C</i> = 33 + <i>m</i>', '<i>C</i> = 65<i>m</i> and <i>C</i> = 33<i>m</i>'], answer: 0,
      sol: '<p>The fee is paid once (a constant), the monthly price is multiplied by <i>m</i>. Setting 40 + 25<i>m</i> = 33<i>m</i> gives <i>m</i> = 5 months.</p>' },
  ],
};

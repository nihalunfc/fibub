// SAT Math · Algebra · linear inequalities in one and two variables. Original (fibub).
import { int, nz, choose, shuffleOpts, fmt, lin, term, v, usd, steps } from './_util.js';
const F = { section: 'math', domain: 'algebra' };
const X = v('x'), Y = v('y');

export default {
  topic: 'linear-inequalities',
  gens: [
    { id: 'sat-li-g01', type: 'nat', level: 2, exams: ['sat'], sub: 'greatest integer', facets: F, format: 'numeric',
      make(r) {
        const a = nz(r, -6, 6), b = int(r, -12, 12), bound = int(r, -6, 9), strict = r() < 0.5;
        // a x + b  (<|<=)  a*bound + b   ... with negative a the direction flips; ask greatest or least accordingly
        const c = a * bound + b, sym = strict ? '&lt;' : '≤';
        const greatest = a > 0, ans = strict ? (greatest ? bound - 1 : bound + 1) : bound;
        return { q: `<p>${lin(a, b)} ${sym} ${fmt(c)}</p><p>What is the ${greatest ? 'greatest' : 'least'} integer value of ${X} that satisfies the inequality above?</p>`, answer: ans, tol: 0, a, b, c, strict,
          sol: steps(`Subtract ${fmt(b)}: ${lin(a, 0)} ${sym} ${fmt(c - b)}.`, a > 0 ? `Divide by ${a}: ${X} ${sym} ${fmt(bound)}.` : `Divide by ${fmt(a)}. Dividing by a negative number <b>flips</b> the sign: ${X} ${strict ? '&gt;' : '≥'} ${fmt(bound)}.`,
            `The ${greatest ? 'greatest' : 'least'} integer that fits is <b>${fmt(ans)}</b>.`),
          trap: 'Forgetting to flip the inequality when dividing by a negative number, or including the end point of a strict inequality.' };
      },
      verify: (p) => { const bnd = (p.c - p.b) / p.a; return p.strict ? (p.a > 0 ? Math.ceil(bnd) - 1 : Math.floor(bnd) + 1) : bnd; } },
    { id: 'sat-li-g02', type: 'nat', level: 2, exams: ['sat'], sub: 'budget', facets: F, format: 'numeric',
      make(r) {
        const s = choose(r, [['Maya has', 'to spend at a fair. Entry costs', 'each ride costs', 'rides'], ['A club has', 'for a trip. The bus costs', 'each student ticket costs', 'student tickets'], ['Dev has', 'to spend on a phone bill. The plan costs', 'each extra gigabyte costs', 'extra gigabytes']]);
        const B = int(r, 30, 200), fee = int(r, 5, Math.floor(B / 3)), price = choose(r, [1.5, 2, 2.5, 3, 4, 4.5, 6, 7.5]);
        const n = Math.floor((B - fee) / price + 1e-9);
        return { q: `<p>${s[0]} ${usd(B)} ${s[1]} ${usd(fee)} and ${s[2]} ${usd(price)}. What is the greatest number of ${s[3]} that fit within the ${usd(B)}?</p>`, answer: n, tol: 0, B, fee, price,
          sol: steps(`Write the inequality: ${fee} + ${price}${v('n')} ≤ ${B}.`, `${price}${v('n')} ≤ ${B - fee}, so ${v('n')} ≤ ${fmt((B - fee) / price, 4)}.`, `${v('n')} must be a whole number, so round <b>down</b>: <b>${n}</b>.`),
          trap: 'Rounding up: that would go over budget.' };
      },
      verify: (p) => Math.floor((p.B - p.fee) / p.price + 1e-9) },
    { id: 'sat-li-g03', type: 'mcq', level: 3, exams: ['sat'], sub: 'system of inequalities', facets: F, format: 'single',
      make(r) {
        const m1 = nz(r, -3, 3), b1 = int(r, -4, 4), m2 = nz(r, -3, 3), b2 = b1 + int(r, 4, 9);
        // region: y > m1 x + b1 and y < m2 x + b2. Find a point inside and three outside.
        const inside = (x, y) => y > m1 * x + b1 && y < m2 * x + b2;
        const pts = []; for (let x = -3; x <= 3; x++) for (let y = -8; y <= 14; y++) pts.push([x, y]);
        const ins = pts.filter(([x, y]) => inside(x, y)), outs = pts.filter(([x, y]) => !inside(x, y));
        const P = ins[Math.floor(r() * ins.length)];
        const W = [0, 1, 2].map(() => outs[Math.floor(r() * outs.length)]);
        const o = shuffleOpts(r, `(${fmt(P[0])}, ${fmt(P[1])})`, W.map(([x, y]) => `(${fmt(x)}, ${fmt(y)})`));
        return { q: `<p>${Y} &gt; ${lin(m1, b1)}<br>${Y} &lt; ${lin(m2, b2)}</p><p>Which point (${X}, ${Y}) is a solution to the system of inequalities above?</p>`, ...o,
          sol: steps('Test each point in <b>both</b> inequalities. A solution must make both true.', `For (${fmt(P[0])}, ${fmt(P[1])}): ${fmt(P[1])} &gt; ${fmt(m1 * P[0] + b1)} ✓ and ${fmt(P[1])} &lt; ${fmt(m2 * P[0] + b2)} ✓.`, 'Each other point breaks at least one of the inequalities.'),
          trap: 'Checking only the first inequality.' };
      } },
    { id: 'sat-li-g04', type: 'nat', level: 3, exams: ['sat'], sub: 'two variables', facets: F, format: 'numeric',
      make(r) {
        const pa = int(r, 2, 9), pb = int(r, 2, 9), need = int(r, 60, 240), xa = int(r, 1, Math.floor(need / pa / 2));
        const min = Math.ceil((need - pa * xa) / pb - 1e-9);
        return { q: `<p>A student earns ${pa} points for each short task and ${pb} points for each long task, and needs at least ${need} points. If the student completes ${xa} short tasks, what is the least number of long tasks needed?</p>`, answer: min, tol: 0, pa, pb, need, xa,
          sol: steps(`${pa}(${xa}) + ${pb}${v('L')} ≥ ${need}.`, `${pb}${v('L')} ≥ ${need - pa * xa}, so ${v('L')} ≥ ${fmt((need - pa * xa) / pb, 4)}.`, `Round <b>up</b> to a whole task: <b>${min}</b>.`) };
      },
      verify: (p) => Math.ceil((p.need - p.pa * p.xa) / p.pb - 1e-9) },
  ],
  items: [
    { id: 'sat-li-001', type: 'mcq', level: 1, exams: ['sat'], sub: 'translate', facets: F,
      q: '<p>An elevator can carry at most 1,200 kilograms. A worker who weighs 80 kilograms rides with <i>b</i> boxes that weigh 25 kilograms each. Which inequality describes the possible values of <i>b</i>?</p>',
      options: ['80 + 25<i>b</i> ≤ 1,200', '80 + 25<i>b</i> ≥ 1,200', '25 + 80<i>b</i> ≤ 1,200', '80<i>b</i> + 25<i>b</i> &lt; 1,200'], answer: 0,
      sol: '<p>The total weight is the worker (80) plus 25 for each box: 80 + 25<i>b</i>. "At most 1,200" means less than or equal to 1,200.</p>' },
    { id: 'sat-li-002', type: 'mcq', level: 2, exams: ['sat'], sub: 'graphs', facets: F,
      q: '<p>The graph of an inequality in the <i>xy</i>-plane is a dashed line through (0, 2) and (2, 0), with the region below the line shaded. Which inequality is it?</p>',
      options: ['<i>y</i> &lt; −<i>x</i> + 2', '<i>y</i> ≤ −<i>x</i> + 2', '<i>y</i> &gt; −<i>x</i> + 2', '<i>y</i> &lt; <i>x</i> + 2'], answer: 0,
      sol: '<p>The line has slope −1 and intercept 2: <i>y</i> = −<i>x</i> + 2. Dashed means the line itself is not included (strict: &lt; or &gt;). Shaded below means <i>y</i> is less than the line.</p>' },
  ],
};

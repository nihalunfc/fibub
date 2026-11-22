import { int, choose, fmt, money, D, numOpts, steps } from './_q.js';
const E = ['gmat', 'gre'];
const sg = (n) => (n < 0 ? `− ${-n}` : `+ ${n}`);
export default {
  topic: 'linear',
  items: [
    { id: 'li-001', type: 'mcq', level: 1, exams: E, sub: 'one variable',
      q: '<p>If 3(<i>x</i> − 4) = 2<i>x</i> + 5, what is <i>x</i>?</p>', options: ['1', '9', '12', '17', '19'], answer: 3,
      sol: '<p>Expand: 3<i>x</i> − 12 = 2<i>x</i> + 5. Subtract 2<i>x</i>: <i>x</i> − 12 = 5, so <i>x</i> = 17.</p>', trap: 'Forgetting to multiply the 4 by 3 gives 9.' },
    { id: 'li-002', type: 'mcq', level: 2, exams: E, sub: 'systems',
      q: '<p>If 2<i>x</i> + 3<i>y</i> = 17 and 3<i>x</i> + 2<i>y</i> = 13, what is <i>x</i> + <i>y</i>?</p>', options: ['4', '5', '6', '7', '30'], answer: 2,
      sol: '<p>Add the two equations: 5<i>x</i> + 5<i>y</i> = 30, so <i>x</i> + <i>y</i> = 6. There is no need to find <i>x</i> and <i>y</i> one by one (they are 1 and 5).</p>', trap: 'Stopping at 30, the value of 5x + 5y.' },
    { id: 'li-003', type: 'mcq', level: 3, exams: E, sub: 'systems',
      q: '<p>For which value of <i>k</i> does the system 2<i>x</i> + <i>ky</i> = 7 and 6<i>x</i> + 9<i>y</i> = 4 have no solution?</p>', options: ['1', '2', '3', '4.5', '9'], answer: 2,
      sol: '<p>Two lines have no common point when they are parallel but not the same line. Multiply the first equation by 3: 6<i>x</i> + 3<i>ky</i> = 21. The <i>x</i>-parts match, so the lines are parallel when 3<i>k</i> = 9, <i>k</i> = 3; then the right sides (21 and 4) differ, so there is no solution.</p>' },
  ],
  gens: [
    { id: 'li-g01', type: 'mcq', level: 1, exams: E, sub: 'one variable', title: 'solve a linear equation',
      make(r) {
        const a = int(r, 2, 9), b = int(r, -20, 20) || 3, c = int(r, 1, a - 1 || 1), x = int(r, -9, 15), d = a * x + b - c * x;
        const value = x;
        return { q: `<p>If ${a}<i>x</i> ${sg(b)} = ${c === 1 ? '' : c}<i>x</i> ${sg(d)}, what is the value of <i>x</i>?</p>`, ...numOpts(r, value, [(d + b) / (a - c), (d - b) / (a + c), -x]), value, a, b, c, d,
          hint: 'Collect the x terms on one side and the numbers on the other.',
          sol: steps(`Subtract ${c === 1 ? '' : c}x from both sides: ${a - c}x ${sg(b)} = ${d}.`, `${b < 0 ? 'Add' : 'Subtract'} ${Math.abs(b)}: ${a - c}x = ${d - b}.`, `Divide by ${a - c}: <b>x = ${value}</b>.`), trap: 'Moving a number across the = sign without changing its sign.' };
      }, check: (p) => (p.d - p.b) / (p.a - p.c) },
    { id: 'li-g02', type: 'mcq', level: 2, exams: E, sub: 'systems', title: 'two items, two prices',
      make(r) {
        const pa = choose(r, [1.5, 2, 2.5, 3, 4, 5]), pb = choose(r, [6, 7.5, 8, 9, 10, 12]), a = int(r, 20, 80), b = int(r, 10, 60), n = a + b, tot = a * pa + b * pb;
        const value = b;
        return { q: `<p>A museum sold ${n} tickets for a total of ${money(tot)}. Child tickets cost ${money(pa)} and adult tickets cost ${money(pb)}. How many adult tickets were sold?</p>`, ...numOpts(r, value, [a, Math.round(tot / pb), n - Math.round(tot / pb)].filter((x) => x > 0)), value, n, tot, pa, pb,
          hint: `If all ${n} were child tickets the total would be ${money(n * pa)}. Each adult ticket adds ${money(pb - pa)} more.`,
          sol: steps(`Let A be adult tickets: ${fmt(pa)}(${n} − A) + ${fmt(pb)}A = ${fmt(tot)}.`, `${fmt(n * pa)} + ${fmt(pb - pa)}A = ${fmt(tot)}, so ${fmt(pb - pa)}A = ${fmt(tot - n * pa)}.`, `A = <b>${value}</b> adult tickets (and ${a} child tickets).`), trap: `Answering the number of child tickets (${a}).` };
      }, check: (p) => (p.tot - p.n * p.pa) / (p.pb - p.pa) },
    { id: 'li-g03', type: 'mcq', level: 2, exams: E, sub: 'ages', title: 'age problem',
      make(r) {
        const kid = int(r, 4, 15), k = choose(r, [2, 3, 4]), parent = kid * k, y = int(r, 2, 12), value = kid + y;
        const m = (parent + y) / (kid + y);
        if (!Number.isInteger(m)) return this.make(() => r());
        return { q: `<p>A mother is ${k} times as old as her son. In ${y} years she will be ${m} times as old as he will be. How old will the son be in ${y} years?</p>`, ...numOpts(r, value, [kid, parent, parent + y]), value, kid, y, k, m,
          hint: 'Let the son be s now: then the mother is ' + k + 's. Write both ages in ' + y + ' years.',
          sol: steps(`Now: son s, mother ${k}s. In ${y} years: s + ${y} and ${k}s + ${y}.`, `${k}s + ${y} = ${m}(s + ${y}) gives ${k - m}s = ${m * y - y}, so s = ${kid}.`, `In ${y} years the son is ${kid} + ${y} = <b>${value}</b>.`), trap: `Answering his age now (${kid}).` };
      }, check: (p) => ((p.m - 1) * p.y) / (p.k - p.m) + p.y },
    { id: 'li-g04', type: 'mcq', level: 3, exams: E, sub: 'lines', title: 'slope and intercept',
      make(r) {
        const x1 = int(r, -5, 3), y1 = int(r, -6, 6), m = choose(r, [-3, -2, -1, 2, 3, 4, 0.5, -0.5]), dx = choose(r, [2, 4, 6]);
        const x2 = x1 + dx, y2 = y1 + m * dx, value = y1 - m * x1;
        return { q: `<p>A line passes through the points (${x1}, ${y1}) and (${x2}, ${fmt(y2)}). At what value of <i>y</i> does it cross the <i>y</i>-axis?</p>`, ...numOpts(r, value, [m, y1 + m * x1, -value]), value, x1, y1, x2, y2,
          hint: 'Find the slope (rise over run), then use y = mx + b with one of the points.',
          sol: steps(`Slope m = (${fmt(y2)} − ${y1}) ÷ (${x2} − ${x1}) = ${fmt(m * dx)} ÷ ${dx} = ${fmt(m)}.`, `Put (${x1}, ${y1}) into y = ${fmt(m)}x + b: ${y1} = ${fmt(m * x1)} + b.`, `b = <b>${fmt(value)}</b>.`) };
      }, check: (p) => p.y1 - ((p.y2 - p.y1) / (p.x2 - p.x1)) * p.x1 },
  ],
};

// SAT Math · Algebra · linear functions: slope, intercepts, graphs and equations of lines. Original (fibub).
import { int, nz, other, choose, shuffleOpts, fmt, frac, lin, term, v, steps } from './_util.js';
const F = { section: 'math', domain: 'algebra' };
const X = v('x'), Y = v('y');
const SLOPES = [-3, -2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2, 2.5, 3, 4];

export default {
  topic: 'linear-functions',
  gens: [
    { id: 'sat-lf-g01', type: 'nat', level: 1, exams: ['sat'], sub: 'slope from two points', facets: F, format: 'numeric',
      make(r) {
        const m = choose(r, SLOPES), x1 = int(r, -6, 4), dx = choose(r, [2, 4, 6]), y1 = int(r, -8, 8), x2 = x1 + dx, y2 = y1 + m * dx;
        return { q: `<p>A line in the ${v('xy')}-plane passes through the points (${fmt(x1)}, ${fmt(y1)}) and (${fmt(x2)}, ${fmt(y2)}). What is the slope of the line?</p>`, answer: m, tol: 0.001, x1, y1, x2, y2,
          sol: steps(`Slope = change in ${Y} ÷ change in ${X}.`, `Change in ${Y}: ${fmt(y2)} − ${fmt(y1)} = ${fmt(y2 - y1)}. Change in ${X}: ${fmt(x2)} − ${fmt(x1)} = ${fmt(dx)}.`, `Slope = ${fmt(y2 - y1)} ÷ ${fmt(dx)} = <b>${fmt(m)}</b>.`),
          trap: 'Dividing change in x by change in y (upside down), or subtracting in a different order on top and bottom.' };
      },
      verify: (p) => (p.y2 - p.y1) / (p.x2 - p.x1) },
    { id: 'sat-lf-g02', type: 'nat', level: 2, exams: ['sat'], sub: 'y-intercept', facets: F, format: 'numeric',
      make(r) {
        const m = nz(r, -5, 5), b = int(r, -12, 12), x0 = nz(r, -5, 6), y0 = m * x0 + b;
        return { q: `<p>A line has a slope of ${fmt(m)} and passes through the point (${fmt(x0)}, ${fmt(y0)}). What is the ${Y}-coordinate of the line's ${Y}-intercept?</p>`, answer: b, tol: 0, m, x0, y0,
          sol: steps(`Use ${Y} = ${v('m')}${X} + ${v('b')} with ${v('m')} = ${fmt(m)}: ${fmt(y0)} = ${fmt(m)}(${fmt(x0)}) + ${v('b')}.`, `${fmt(y0)} = ${fmt(m * x0)} + ${v('b')}.`, `${v('b')} = ${fmt(y0)} − ${fmt(m * x0)} = <b>${fmt(b)}</b>.`) };
      },
      verify: (p) => p.y0 - p.m * p.x0 },
    { id: 'sat-lf-g03', type: 'nat', level: 2, exams: ['sat'], sub: 'function values', facets: F, format: 'numeric',
      make(r) {
        const m = nz(r, -6, 6), b = int(r, -10, 10), p1 = int(r, -3, 2), p2 = p1 + int(r, 1, 4), t = int(r, -5, 9);
        const f = (x) => m * x + b;
        return { q: `<p>For the linear function ${v('f')}, ${v('f')}(${fmt(p1)}) = ${fmt(f(p1))} and ${v('f')}(${fmt(p2)}) = ${fmt(f(p2))}. What is the value of ${v('f')}(${fmt(t)})?</p>`, answer: f(t), tol: 0, p1, p2, f1: f(p1), f2: f(p2), t,
          sol: steps(`Slope: (${fmt(f(p2))} − ${fmt(f(p1))}) ÷ (${fmt(p2)} − ${fmt(p1)}) = ${fmt(m)}.`, `Intercept: ${fmt(f(p1))} = ${fmt(m)}(${fmt(p1)}) + ${v('b')}, so ${v('b')} = ${fmt(b)}. So ${v('f')}(${X}) = ${lin(m, b)}.`, `${v('f')}(${fmt(t)}) = ${fmt(m)}(${fmt(t)}) ${term(b)} = <b>${fmt(f(t))}</b>.`) };
      },
      verify: (p) => { const m = (p.f2 - p.f1) / (p.p2 - p.p1); return p.f1 + m * (p.t - p.p1); } },
    { id: 'sat-lf-g04', type: 'mcq', level: 2, exams: ['sat'], sub: 'equation of a line', facets: F, format: 'single',
      make(r) {
        const m = nz(r, -4, 4), b = int(r, -9, 9), x1 = int(r, 1, 4), y1 = m * x1 + b;
        const right = `${Y} = ${lin(m, b)}`;
        const o = shuffleOpts(r, right, [`${Y} = ${lin(-m, b)}`, `${Y} = ${lin(m, -b)}`, `${Y} = ${lin(b === 0 ? m + 1 : b, m)}`, `${Y} = ${lin(m, y1)}`]);
        return { q: `<p>A line passes through (0, ${fmt(b)}) and (${x1}, ${fmt(y1)}). Which equation defines the line?</p>`, ...o,
          sol: steps(`The point (0, ${fmt(b)}) is on the ${Y}-axis, so the ${Y}-intercept is ${fmt(b)}.`, `Slope = (${fmt(y1)} − ${fmt(b)}) ÷ (${x1} − 0) = ${fmt(m)}.`, `So the line is <b>${right}</b>.`),
          trap: 'Swapping slope and intercept, or getting the sign of the slope wrong.' };
      } },
    { id: 'sat-lf-g05', type: 'nat', level: 3, exams: ['sat'], sub: 'perpendicular', facets: F, format: 'numeric',
      make(r) {
        const pairs = [[1, 2], [2, 1], [1, 4], [4, 1], [2, 5], [5, 2], [1, 5], [4, 5], [5, 4], [2, 4], [4, 2]];
        const [a, b0] = choose(r, pairs), b = b0 * (r() < 0.5 ? 1 : -1), c = int(r, 2, 20), kind = choose(r, ['perpendicular', 'parallel']);
        const m = -a / b, ans = kind === 'parallel' ? m : -1 / m;
        return { q: `<p>Line ${v('k')} is defined by ${lin(a, 0)} ${term(b, 'y')} = ${c}. Line ${v('j')} is ${kind} to line ${v('k')} in the ${v('xy')}-plane. What is the slope of line ${v('j')}?</p>`, answer: +ans.toFixed(6), tol: 0.001, a, b, kind,
          sol: steps(`Solve for ${Y}: ${term(b, 'y', true)} = ${lin(-a, c)}, so ${Y} = ${frac(-a, b)}${X} + ${frac(c, b)}. Line ${v('k')} has slope ${frac(-a, b)}.`,
            kind === 'parallel' ? `Parallel lines have equal slopes, so line ${v('j')} has slope <b>${frac(-a, b)}</b> (${fmt(ans, 4)}).` : `Perpendicular slopes multiply to −1: flip the fraction and change the sign. Line ${v('j')} has slope <b>${frac(b, a)}</b> (${fmt(ans, 4)}).`),
          trap: 'Using the coefficient of x (not −a/b) as the slope, or forgetting to change the sign for a perpendicular line.' };
      },
      verify: (p) => { const m = -p.a / p.b; return p.kind === 'parallel' ? m : -1 / m; } },
    { id: 'sat-lf-g06', type: 'nat', level: 2, exams: ['sat'], sub: 'x-intercept', facets: F, format: 'numeric',
      make(r) {
        const m = nz(r, -5, 5), xi = int(r, -8, 8), b = -m * xi;
        return { q: `<p>The graph of ${Y} = ${lin(m, b)} crosses the ${X}-axis at the point (${v('a')}, 0). What is the value of ${v('a')}?</p>`, answer: xi, tol: 0, m, b,
          sol: steps(`On the ${X}-axis, ${Y} = 0.`, `0 = ${lin(m, b)}, so ${lin(m, 0)} = ${fmt(-b)}.`, `${X} = ${fmt(-b)} ÷ ${fmt(m)} = <b>${fmt(xi)}</b>.`) };
      },
      verify: (p) => -p.b / p.m },
    { id: 'sat-lf-g07', type: 'nat', level: 3, exams: ['sat'], sub: 'standard form slope', facets: F, format: 'numeric',
      make(r) {
        const a = nz(r, -6, 6), b = choose(r, [-4, -2, -1, 1, 2, 4, 5, 8]), c = int(r, -20, 20);
        return { q: `<p>What is the slope of the graph of ${lin(a, 0)} ${term(b, 'y')} = ${fmt(c)} in the ${v('xy')}-plane?</p>`, answer: +(-a / b).toFixed(6), tol: 0.001, a, b,
          sol: steps(`Get ${Y} alone: ${term(b, 'y', true)} = ${lin(-a, c)}.`, `Divide by ${fmt(b)}: ${Y} = ${frac(-a, b)}${X} + ${frac(c, b)}.`, `The slope is the number in front of ${X}: <b>${frac(-a, b)}</b>${Math.abs(b) === 1 ? '' : ` = ${fmt(-a / b, 4)}`}. Shortcut: for ${v('A')}${X} + ${v('B')}${Y} = ${v('C')} the slope is −${v('A')}/${v('B')}.`) };
      },
      verify: (p) => -p.a / p.b },
  ],
  items: [
    { id: 'sat-lf-001', type: 'mcq', level: 1, exams: ['sat'], sub: 'interpret slope', facets: F,
      q: '<p>The temperature <i>T</i>, in degrees Fahrenheit, inside an oven <i>m</i> minutes after it was switched on is modelled by <i>T</i> = 70 + 25<i>m</i>, for 0 ≤ <i>m</i> ≤ 12. What does 25 mean in this model?</p>',
      options: ['The temperature rises 25 degrees each minute.', 'The oven starts at 25 degrees.', 'The oven reaches its highest temperature after 25 minutes.', 'The temperature after 1 minute is 25 degrees.'], answer: 0,
      sol: '<p>25 is the slope: every extra minute adds 25 to <i>T</i>. The starting temperature is 70 (at <i>m</i> = 0), and after 1 minute it is 95, not 25.</p>' },
    { id: 'sat-lf-002', type: 'mcq', level: 2, exams: ['sat'], sub: 'graphs', facets: F,
      q: '<p>The graph of a line in the <i>xy</i>-plane goes down from left to right and crosses the <i>y</i>-axis above the origin. Which equation could define the line?</p>',
      options: ['<i>y</i> = −2<i>x</i> + 5', '<i>y</i> = 2<i>x</i> + 5', '<i>y</i> = −2<i>x</i> − 5', '<i>y</i> = 2<i>x</i> − 5'], answer: 0,
      sol: '<p>Going down from left to right means a negative slope. Crossing the <i>y</i>-axis above the origin means a positive <i>y</i>-intercept. Only <i>y</i> = −2<i>x</i> + 5 has both.</p>' },
    { id: 'sat-lf-003', type: 'mcq', level: 2, exams: ['sat'], sub: 'table', facets: F,
      q: '<table class="qb-table"><tr><th><i>x</i></th><td>1</td><td>3</td><td>5</td><td>7</td></tr><tr><th><i>f</i>(<i>x</i>)</th><td>11</td><td>5</td><td>−1</td><td>−7</td></tr></table><p>The table shows four values of the linear function <i>f</i>. Which equation defines <i>f</i>?</p>',
      options: ['<i>f</i>(<i>x</i>) = −3<i>x</i> + 14', '<i>f</i>(<i>x</i>) = −6<i>x</i> + 17', '<i>f</i>(<i>x</i>) = 3<i>x</i> + 8', '<i>f</i>(<i>x</i>) = −3<i>x</i> + 11'], answer: 0,
      sol: '<p>Each time <i>x</i> goes up by 2, <i>f</i>(<i>x</i>) goes down by 6, so the slope is −6 ÷ 2 = −3 (not −6). Then 11 = −3(1) + <i>b</i> gives <i>b</i> = 14. Check with <i>x</i> = 7: −21 + 14 = −7.</p>',
      trap: 'Reading the change per row (−6) as the slope when x goes up by 2 each row.' },
    { id: 'sat-lf-004', type: 'nat', level: 3, exams: ['sat'], sub: 'translate a line', facets: F,
      q: '<p>The graph of <i>y</i> = 4<i>x</i> − 3 is shifted up 7 units. At what <i>x</i>-value does the new graph cross the <i>x</i>-axis?</p>', answer: -1, tol: 0,
      sol: '<p>Shifting up 7 adds 7: <i>y</i> = 4<i>x</i> + 4. Set <i>y</i> = 0: 4<i>x</i> = −4, so <i>x</i> = <b>−1</b>.</p>' },
  ],
};

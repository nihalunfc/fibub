// Class 12 Maths, Linear Programming: live problems (original fibub questions). Ids start with c12m-lp-.
import { pick, choose, n, steps, tidyProblems } from './_util.js';

export default tidyProblems({
  'c12m-lp-corner': {
    title: 'best corner of a feasible region',
    make(r) {
      const S = pick(r, 8, 14), A = pick(r, 3, S - 3), B = pick(r, 3, S - 3), p = pick(r, 2, 9), q = pick(r, 2, 9), who = choose(r, [['plates of idli', 'plates of dosa'], ['kilograms of rice', 'kilograms of wheat'], ['notebooks', 'registers']]);
      // region: x + y <= S, x <= A, y <= B, x, y >= 0. Corners: (0,0), (A,0), (A,S-A), (S-B,B), (0,B)
      const C = [[0, 0], [A, 0], [A, S - A], [A, B], [S - B, B], [0, B]].filter(([x, y]) => x + y <= S && x >= 0 && y >= 0 && x <= A && y <= B), Z = C.map(([x, y]) => p * x + q * y), best = Math.max(...Z);
      return { S, A, B, p, qv: q, q: `<p>A small unit makes x ${who[0]} and y ${who[1]} in a day. The limits are: x + y ≤ ${S}, x ≤ ${A}, y ≤ ${B}, and x, y ≥ 0. The profit is Z = ${p}x + ${q}y rupees. Find the maximum profit.</p>`, answer: best, unit: '₹', tol: 0.005,
        hint: 'Draw the region, list its corner points, and work out Z at each one. The largest value is the answer.',
        solution: steps(`Corner points: ${C.map((c) => `(${c[0]}, ${c[1]})`).join(', ')}.`, `Z at these: ${Z.join(', ')}.`, `Maximum Z = <b>₹${best}</b> at (${C[Z.indexOf(best)][0]}, ${C[Z.indexOf(best)][1]}).`) };
    },
    // every whole-number point of the region (corners are whole numbers, so the best lattice point is the best corner)
    verify: (m) => { let b = 0; for (let x = 0; x <= m.A; x++) for (let y = 0; y <= m.B; y++) if (x + y <= m.S) b = Math.max(b, m.p * x + m.qv * y); return b; },
  },
  'c12m-lp-meet': {
    title: 'corner point where two boundaries meet',
    make(r) {
      const x0 = pick(r, 1, 8), y0 = pick(r, 1, 8), a = pick(r, 1, 4), b = pick(r, 1, 4), d = pick(r, 1, 4), e = pick(r, 1, 4);
      const det = a * e - b * d, ee = det === 0 ? e + 1 : e, c = a * x0 + b * y0, f = d * x0 + ee * y0, ax = pick(r, 0, 1);
      return { a, b, c, d, e: ee, f, ax, q: `<p>The boundary lines of two constraints are ${a}x + ${b}y = ${c} and ${d}x + ${ee}y = ${f}. They meet at a corner point of the feasible region. Find its ${['x', 'y'][ax]}-coordinate.</p>`, answer: ax === 0 ? x0 : y0, unit: '', tol: 0.005, abs: 0.01,
        hint: 'Solve the two equations together (substitution or elimination).',
        solution: steps(`Eliminate y: multiply the first by ${ee} and the second by ${b}, then subtract.`, `x = ${x0}, y = ${y0}.`, `The ${['x', 'y'][ax]}-coordinate is <b>${ax === 0 ? x0 : y0}</b>.`) };
    },
    verify: (p) => { const det = p.a * p.e - p.b * p.d; return p.ax === 0 ? (p.c * p.e - p.b * p.f) / det : (p.a * p.f - p.c * p.d) / det; },
  },
  'c12m-lp-diet': {
    title: 'a minimisation (diet) problem',
    make(r) {
      const a = pick(r, 1, 4), b = pick(r, 1, 4), c = pick(r, 12, 30, 2), d = pick(r, 1, 4), e = pick(r, 1, 4), f = pick(r, 12, 30, 2), p = pick(r, 2, 8), q = pick(r, 2, 8), det = a * e - b * d;
      const ee = det === 0 ? e + 1 : e;
      const pts = [[0, Math.max(c / b, f / ee)], [Math.max(c / a, f / d), 0]], dd = a * ee - b * d, xi = (c * ee - b * f) / dd, yi = (a * f - c * d) / dd;
      if (xi >= 0 && yi >= 0) pts.push([xi, yi]);
      const best = Math.min(...pts.map(([x, y]) => p * x + q * y));
      return { a, b, c, d, e: ee, f, pv: p, qv: q, q: `<p>A diet needs: ${a}x + ${b}y ≥ ${c} units of one nutrient and ${d}x + ${ee}y ≥ ${f} units of another, where x and y are the amounts of two foods (x, y ≥ 0). The cost is Z = ${p}x + ${q}y rupees. Find the minimum cost (2 decimal places).</p>`, answer: best, unit: '₹', tol: 0.01,
        hint: 'The region is open (it goes on for ever). Find the corner points, evaluate Z at each, take the smallest.',
        solution: steps(`Corner points: ${pts.map((c2) => `(${n(c2[0], 4)}, ${n(c2[1], 4)})`).join(', ')}.`, `Z values: ${pts.map(([x, y]) => n(p * x + q * y, 4)).join(', ')}.`, `Smallest: <b>₹${n(best, 4)}</b> (the region is unbounded, so also check that Z < ${n(best, 4)} has no point in it: it does not, because this is a ≥ region and the line Z = ${n(best, 4)} has all feasible points on or above it).`) };
    },
    // for every x, the smallest y that satisfies both inequalities; minimise Z along that lower edge
    verify: (m) => { let best = Infinity; const xmax = 40; for (let i = 0; i <= xmax * 2000; i++) { const x = i / 2000, y = Math.max(0, (m.c - m.a * x) / m.b, (m.f - m.d * x) / m.e); best = Math.min(best, m.pv * x + m.qv * y); } return best; },
  },
  'c12m-lp-profit': {
    title: 'maximum profit with two machines',
    make(r) {
      const x0 = pick(r, 2, 8), y0 = pick(r, 2, 8), a1 = pick(r, 1, 4), b1 = pick(r, 1, 4), a2 = pick(r, 1, 4), b2 = pick(r, 1, 4), det = a1 * b2 - b1 * a2, B2 = det === 0 ? b2 + 1 : b2;
      const c1 = a1 * x0 + b1 * y0, c2 = a2 * x0 + B2 * y0, p = pick(r, 20, 60, 10), q = pick(r, 20, 60, 10);
            const C = [[0, 0], [Math.min(c1 / a1, c2 / a2), 0], [0, Math.min(c1 / b1, c2 / B2)], [x0, y0]].filter(([x, y]) => a1 * x + b1 * y <= c1 + 1e-9 && a2 * x + B2 * y <= c2 + 1e-9);
      const best = Math.max(...C.map(([x, y]) => p * x + q * y));
      return { a1, b1, c1, a2, b2: B2, c2, pv: p, qv: q, q: `<p>A workshop makes tables (x) and chairs (y). Machine A allows ${a1}x + ${b1}y ≤ ${c1} hours and machine B allows ${a2}x + ${B2}y ≤ ${c2} hours. Profit is ₹${p} per table and ₹${q} per chair. Find the maximum profit.</p>`, answer: best, unit: '₹', tol: 0.01,
        hint: 'Corner points: the origin, the two axis intercepts that stay inside both limits, and where the two boundary lines meet.',
        solution: steps(`Corner points: ${C.map((c) => `(${n(c[0], 4)}, ${n(c[1], 4)})`).join(', ')}.`, `Z = ${p}x + ${q}y at these: ${C.map(([x, y]) => n(p * x + q * y, 4)).join(', ')}.`, `Maximum profit = <b>₹${n(best, 4)}</b>.`) };
    },
    // walk along x: the most y allowed by both machines, and take the best profit
    verify: (m) => { let best = 0; const xm = Math.min(m.c1 / m.a1, m.c2 / m.a2); for (let i = 0; i <= xm * 4000; i++) { const x = i / 4000, y = Math.min((m.c1 - m.a1 * x) / m.b1, (m.c2 - m.a2 * x) / m.b2); if (y >= 0) best = Math.max(best, m.pv * x + m.qv * y); } return best; },
  },
}, ['c12m-lp-meet', 'c12m-lp-diet', 'c12m-lp-profit']);

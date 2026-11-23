// Class 9 Maths, Two Variables, One Line: live problems (original fibub questions). Ids start with c9m-line-.
import { pick, choose, n, steps, tidyProblems } from './_util.js';

export default tidyProblems({
  'c9m-line-y': {
    title: 'find y for a given x',
    make(r) {
      const a = pick(r, 2, 6), b = pick(r, 2, 5), x = pick(r, -4, 6), y = pick(r, -5, 7), c = a * x + b * y;
      return { a, b, c, x, q: `<p>A point on the line <b>${a}x + ${b}y = ${c}</b> has x = <b>${x}</b>. Find its y-coordinate.</p>`, answer: y, unit: '', abs: 0.001, tol: 0.002,
        hint: 'Put the value of x into the equation and solve for y.',
        solution: steps(`${a}(${x}) + ${b}y = ${c}, so ${a * x} + ${b}y = ${c}.`, `${b}y = ${c} − (${a * x}) = ${c - a * x}.`, `y = <b>${y}</b>. The solution is (${x}, ${y}).`) };
    },
    verify(o) { return -(o.a / o.b) * o.x + o.c / o.b; },
  },
  'c9m-line-k': {
    title: 'find k so that a point lies on the line',
    make(r) {
      const k = pick(r, 2, 7), b = pick(r, 1, 5), p = pick(r, 2, 6), qy = pick(r, 1, 6), c = k * p + b * qy;
      return { b, p, qy, c, q: `<p>The point <b>(${p}, ${qy})</b> lies on the line <b>kx + ${b}y = ${c}</b>. Find the value of k.</p>`, answer: k, unit: '', tol: 0.002,
        hint: 'A point on the line satisfies its equation. Put x = ' + p + ' and y = ' + qy + ' into the equation.',
        solution: steps(`k(${p}) + ${b}(${qy}) = ${c}.`, `${p}k = ${c} − ${b * qy} = ${c - b * qy}.`, `k = ${c - b * qy} ÷ ${p} = <b>${k}</b>.`) };
    },
    verify(o) { return (o.c - o.b * o.qy) / o.p; },
  },
  'c9m-line-intercept': {
    title: 'triangle cut off by a line on the axes',
    make(r) {
      const a = pick(r, 1, 5), b = pick(r, 1, 5), m = pick(r, 2, 6), c = a * b * m, ix = c / a, iy = c / b;
      return { a, b, c, q: `<p>The line <b>${a}x + ${b}y = ${c}</b> cuts the x-axis at P and the y-axis at Q. Find the area of the triangle OPQ, where O is the origin.</p>`, answer: 0.5 * ix * iy, unit: 'square units', tol: 0.002,
        hint: 'Put y = 0 to find where it cuts the x-axis, and x = 0 for the y-axis. The triangle is right-angled at O.',
        solution: steps(`y = 0: ${a}x = ${c}, so x = ${ix}. P = (${ix}, 0).`, `x = 0: ${b}y = ${c}, so y = ${iy}. Q = (0, ${iy}).`, `Area = ½ × ${ix} × ${iy} = <b>${0.5 * ix * iy}</b> square units.`) };
    },
    verify(o) { const P = [o.c / o.a, 0], Q = [0, o.c / o.b]; return Math.abs(P[0] * Q[1] - Q[0] * P[1]) / 2; },
  },
  'c9m-line-fare': {
    title: 'auto fare as a linear equation',
    make(r) {
      const f = pick(r, 20, 40, 5), rate = pick(r, 10, 20, 2), d = pick(r, 3, 18), T = f + rate * d;
      return { f, rate, T, q: `<p>An auto-rickshaw charges a fixed <b>₹ ${f}</b> plus <b>₹ ${rate}</b> for every kilometre, so the fare is F = ${f} + ${rate}d. Kavya paid <b>₹ ${T}</b>. How many kilometres did she travel?</p>`, answer: d, unit: 'km', tol: 0.002,
        hint: 'Put F = ' + T + ' in the equation and solve for d.',
        solution: steps(`${T} = ${f} + ${rate}d.`, `${rate}d = ${T} − ${f} = ${T - f}.`, `d = ${T - f} ÷ ${rate} = <b>${d} km</b>.`) };
    },
    verify(o) { for (let d = 0; d <= 400; d += 0.5) if (Math.abs(o.f + o.rate * d - o.T) < 1e-9) return d; return NaN; },
  },
  'c9m-line-rect': {
    title: 'rectangle from lines parallel to the axes',
    make(r) {
      const p = pick(r, 2, 9), s = pick(r, 2, 8);
      return { p, s, q: `<p>The lines <b>x = ${p}</b> and <b>y = ${s}</b>, together with the x-axis and the y-axis, enclose a rectangle. Find its area.</p>`, answer: p * s, unit: 'square units', tol: 0.002,
        hint: 'The corners are (0, 0), (' + p + ', 0), (' + p + ', ' + s + ') and (0, ' + s + ').',
        solution: steps(`The line x = ${p} is vertical and y = ${s} is horizontal.`, `The rectangle is ${p} units wide and ${s} units tall.`, `Area = ${p} × ${s} = <b>${p * s}</b> square units.`) };
    },
    verify(o) { const V = [[0, 0], [o.p, 0], [o.p, o.s], [0, o.s]]; let a = 0; V.forEach((q, i) => { const w = V[(i + 1) % 4]; a += q[0] * w[1] - w[0] * q[1]; }); return Math.abs(a) / 2; },
  },
}, ['c9m-line-k', 'c9m-line-intercept']);

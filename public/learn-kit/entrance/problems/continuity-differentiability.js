// Live problems for Continuity and differentiability.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const sg = (v) => (v < 0 ? `− ${-v}` : `+ ${v}`);
const term = (v, x) => (v === 0 ? '' : ` ${v < 0 ? '−' : '+'} ${Math.abs(v) === 1 ? '' : Math.abs(v)}${x}`);

export default {
  'cd-constants': {
    title: 'constants that make a joined function differentiable',
    make(r) {
      const a = pick(r, -4, 4), c = pick(r, -3, 3) || 2;
      const b = 2 * c + a, d = -c * c, answer = b + d;
      return { a, c,
        q: `<p>f(x) = x²${term(a, 'x')} for x ≤ ${c}, and f(x) = bx + d for x > ${c}. If f is differentiable at x = ${c}, find b + d.</p>`,
        answer, unit: '', tol: 0, abs: 0.01,
        hint: 'Differentiable means continuous (the two pieces meet) and the left and right slopes agree at the join.',
        solution: steps(`Slopes: left 2x ${sg(a)} at x = ${c} gives ${b}; right slope is b. So b = ${b}.`, `Continuity: ${c}² ${sg(a)}(${c}) = ${c * c + a * c} must equal b(${c}) + d = ${b * c} + d, so d = ${d}.`, `b + d = ${b} ${sg(d)} = <b>${answer}</b>.`) };
    },
    // numerical slope of the left piece at c, then match values
    verify: (x) => { const L = (t) => t * t + x.a * t, e = 1e-5, b = (L(x.c + e) - L(x.c - e)) / (2 * e); return Math.round((b + L(x.c) - b * x.c) * 1e6) / 1e6; },
  },
  'cd-param': {
    title: 'dy/dx for a curve given by a parameter',
    make(r) {
      const p = pick(r, 1, 5), q = pick(r, -4, 4), t = pick(r, -3, 3) || 1;
      const answer = (2 * t + q) / (3 * t * t + p);
      return { p, qq: q, t,
        q: `<p>x = t³${term(p, 't')} and y = t²${term(q, 't')}. Find dy/dx at t = ${t}. (Give a decimal if needed.)</p>`,
        answer, unit: '', tol: 0.002, abs: 0.001,
        hint: 'dy/dx = (dy/dt) ÷ (dx/dt).',
        solution: steps(`dx/dt = 3t² + ${p} = ${3 * t * t + p} at t = ${t}.`, `dy/dt = 2t ${sg(q)} = ${2 * t + q}.`, `dy/dx = ${2 * t + q}/${3 * t * t + p} = <b>${n(answer, 4)}</b>.`) };
    },
    // slope of a tiny chord on the curve itself
    verify: (x) => { const X = (s) => s ** 3 + x.p * s, Y = (s) => s * s + x.qq * s, e = 1e-5; return (Y(x.t + e) - Y(x.t - e)) / (X(x.t + e) - X(x.t - e)); },
  },
  'cd-kinks': {
    title: 'count the points where a function is not differentiable',
    make(r) {
      const a = pick(r, 1, 4), b = pick(r, -5, 5);
      const pts = [...new Set([-a, a, b])].sort((u, v) => u - v), answer = pts.length;
      return { a, b,
        q: `<p>How many points are there where f(x) = |x² − ${a * a}| + ${b === 0 ? '|x|' : `|x ${sg(-b)}|`} is not differentiable?</p>`,
        answer, unit: 'points', tol: 0, abs: 0.4,
        hint: '|g(x)| has a corner where g(x) = 0 and g changes sign with a nonzero slope. Collect those points from both terms; a shared point counts once.',
        solution: steps(`|x² − ${a * a}| has corners at x = ±${a} (simple roots).`, `${b === 0 ? '|x|' : `|x ${sg(-b)}|`} has a corner at x = ${b}.`, `Distinct points: ${pts.join(', ')}, so <b>${answer}</b>. (If x = ${b} is also ±${a}, the slopes still jump there, since both terms turn the same way.)`) };
    },
    // check the slope jump numerically at every whole number in [−6, 6]
    verify: (x) => { const f = (t) => Math.abs(t * t - x.a * x.a) + Math.abs(t - x.b), e = 1e-6; let c = 0; for (let t = -6; t <= 6; t++) if (Math.abs((f(t + e) - f(t)) / e - (f(t) - f(t - e)) / e) > 1e-3) c++; return c; },
  },
};

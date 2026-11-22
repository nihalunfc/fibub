// Live problems for Applications of derivatives.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const P = (v) => (v < 0 ? `(${v})` : `${v}`);
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';

export default {
  'ad-box': {
    title: 'the open box of greatest volume',
    make(r) {
      const L = pick(r, 16, 40, 2), W = Math.min(pick(r, 10, 24, 2), L);
      const x = (L + W - Math.sqrt(L * L - L * W + W * W)) / 6, answer = (L - 2 * x) * (W - 2 * x) * x;
      return { L, W,
        q: `<p>Equal squares of side x cm are cut from the corners of a ${L} cm × ${W} cm sheet of tin, and the sides are folded up to make an open box. What is the greatest possible volume, in cm³? (Give 1 decimal place.)</p>`,
        answer, unit: 'cm³', tol: 0.002, abs: 0.1,
        hint: 'V(x) = x(L − 2x)(W − 2x). Set V′(x) = 0 and keep the root with 0 < x < W/2.',
        solution: steps(`V = x(${L} − 2x)(${W} − 2x) = 4x³ − ${2 * (L + W)}x² + ${L * W}x.`, `V′ = 12x² − ${4 * (L + W)}x + ${L * W} = 0 gives x = [${L + W} ± √(${L * L - L * W + W * W})]/6. The smaller root, x = ${n(x, 4)} cm, is inside (0, ${W / 2}); V″ < 0 there, so it is a maximum.`, `V = ${n(x, 4)} × ${n(L - 2 * x, 4)} × ${n(W - 2 * x, 4)} = <b>${n(answer, 5)} cm³</b>.`) };
    },
    // brute-force search over x
    verify: (p) => { let best = 0; const f = (x) => x * (p.L - 2 * x) * (p.W - 2 * x); for (let x = 0; x <= p.W / 2; x += 1e-4) best = Math.max(best, f(x)); return best; },
  },
  'ad-ladder': {
    title: 'how fast the top of a sliding ladder falls',
    make(r) {
      const [L, x] = [[5, 3], [5, 4], [10, 6], [10, 8], [13, 5], [13, 12], [17, 8], [25, 7]][Math.floor(r() * 8)], v = pick(r, 0.5, 3, 0.5);
      const y = Math.sqrt(L * L - x * x), answer = (x * v) / y;
      return { L, x, v,
        q: `<p>A ${L} m ladder leans against a wall. Its foot slides away from the wall at ${n(v)} m/s. How fast is the top sliding down when the foot is ${x} m from the wall? (m/s, 3 decimal places)</p>`,
        answer, unit: 'm/s', tol: 0.002, abs: 0.001,
        hint: 'x² + y² = L². Differentiate with respect to time: 2x dx/dt + 2y dy/dt = 0.',
        solution: steps(`When x = ${x}, y = √(${L}² − ${x}²) = ${y} m.`, `x dx/dt + y dy/dt = 0 ⇒ dy/dt = −x(dx/dt)/y = −${x} × ${n(v)}/${y}.`, `The top falls at <b>${n(answer, 4)} m/s</b> (the minus sign means y is decreasing).`) };
    },
    // follow the ladder for a tiny time step
    verify: (p) => { const dt = 1e-6, y0 = Math.sqrt(p.L ** 2 - p.x ** 2), y1 = Math.sqrt(p.L ** 2 - (p.x + p.v * dt) ** 2); return (y0 - y1) / dt; },
  },
  'ad-tangent': {
    title: 'where a tangent meets the y-axis',
    make(r) {
      const p = pick(r, -3, 3), q = pick(r, -5, 5), t = pick(r, -3, 3) || 2;
      const f = t ** 3 + p * t * t + q, m = 3 * t * t + 2 * p * t, answer = f - t * m;
      return { p, qq: q, t,
        q: `<p>The tangent to y = x³${p ? ` ${p < 0 ? '−' : '+'} ${Math.abs(p) === 1 ? '' : Math.abs(p)}x²` : ''}${q ? ` ${q < 0 ? '−' : '+'} ${Math.abs(q)}` : ''} at x = ${t} meets the y-axis at (0, k). Find k.</p>`,
        answer, unit: '', tol: 0, abs: 0.01,
        hint: 'Tangent: y − f(t) = f′(t)(x − t). Put x = 0.',
        solution: steps(`f(${t}) = ${f}, f′(x) = 3x²${p ? ` ${p < 0 ? '−' : '+'} ${Math.abs(2 * p)}x` : ''}, so f′(${t}) = ${m}.`, `Tangent: y − ${P(f)} = ${m}(x − ${P(t)}).`, `At x = 0: k = ${f} − ${P(t)} × ${P(m)} = <b>${answer}</b>.`) };
    },
    verify: (x) => { const f = (s) => s ** 3 + x.p * s * s + x.qq, e = 1e-5, m = (f(x.t + e) - f(x.t - e)) / (2 * e); return Math.round((f(x.t) - x.t * m) * 1e4) / 1e4; },
  },
};

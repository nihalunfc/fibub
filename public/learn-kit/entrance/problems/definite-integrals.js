// Live problems for Definite integrals and area.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const simpson = (f, a, b, N = 4000) => { const h = (b - a) / N; let s = f(a) + f(b); for (let i = 1; i < N; i++) s += f(a + i * h) * (i % 2 ? 4 : 2); return (s * h) / 3; };

export default {
  'di-area': {
    title: 'area between a parabola and a line',
    make(r) {
      const k = pick(r, 1, 6), c = pick(r, 1, 3);
      // y = c·x² and y = k·x meet at x = 0 and x = k/c
      const m = k / c, answer = (k * m * m) / 2 - (c * m ** 3) / 3;
      return { k, c,
        q: `<p>Find the area enclosed between y = ${c === 1 ? '' : c}x² and y = ${k === 1 ? '' : k}x. (3 decimal places)</p>`,
        answer, unit: 'square units', tol: 0.002, abs: 0.002,
        hint: 'Find where they meet, then integrate (upper curve − lower curve) between those x-values. Between the meeting points the line is above the parabola.',
        solution: steps(`${c}x² = ${k}x at x = 0 and x = ${n(m, 4)}.`, `Area = ∫₀<sup>${n(m, 4)}</sup> (${k}x − ${c}x²) dx = [${k}x²/2 − ${c}x³/3] = ${n((k * m * m) / 2, 5)} − ${n((c * m ** 3) / 3, 5)}.`, `= <b>${n(answer, 5)}</b> square units (the formula k³/(6c²) gives the same).`) };
    },
    verify: (x) => simpson((t) => x.k * t - x.c * t * t, 0, x.k / x.c),
  },
  'di-modulus': {
    title: 'a definite integral with a modulus',
    make(r) {
      const a = pick(r, 1, 5), b = a + pick(r, 1, 5);
      const answer = (a * a) / 2 + ((b - a) ** 2) / 2;
      return { a, b,
        q: `<p>Evaluate ∫₀<sup>${b}</sup> |x − ${a}| dx.</p>`,
        answer, unit: '', tol: 0.001, abs: 0.01,
        hint: `Split the interval where x − ${a} changes sign, at x = ${a}. On the left the modulus is ${a} − x, on the right x − ${a}.`,
        solution: steps(`∫₀<sup>${a}</sup> (${a} − x) dx = ${a}²/2 = ${n((a * a) / 2)}. (A triangle of base ${a} and height ${a}.)`, `∫<sub>${a}</sub><sup>${b}</sup> (x − ${a}) dx = ${b - a}²/2 = ${n(((b - a) ** 2) / 2)}.`, `Total = <b>${n(answer)}</b>.`) };
    },
    verify: (x) => simpson((t) => Math.abs(t - x.a), 0, x.a) + simpson((t) => Math.abs(t - x.a), x.a, x.b),
  },
  'di-leibniz': {
    title: 'differentiate an integral with variable limits',
    make(r) {
      const c = pick(r, -3, 4) || 2, x0 = pick(r, 1, 3, 0.5);
      const f = (t) => t * t + c, answer = f(x0 * x0) * 2 * x0 - f(x0);
      return { c, x0,
        q: `<p>F(x) = ∫ from x to x² of (t² ${c < 0 ? '−' : '+'} ${Math.abs(c)}) dt. Find F′(${x0}).</p>`,
        answer, unit: '', tol: 0.001, abs: 0.01,
        hint: 'Leibniz rule: d/dx ∫ from u(x) to v(x) of f(t) dt = f(v)·v′ − f(u)·u′.',
        solution: steps(`Upper limit v = x², v′ = 2x; lower limit u = x, u′ = 1.`, `F′(x) = (x⁴ ${c < 0 ? '−' : '+'} ${Math.abs(c)})·2x − (x² ${c < 0 ? '−' : '+'} ${Math.abs(c)}).`, `At x = ${x0}: ${n(f(x0 * x0), 5)} × ${n(2 * x0)} − ${n(f(x0), 5)} = <b>${n(answer, 6)}</b>.`) };
    },
    // integrate exactly as a polynomial, then take a numerical derivative
    verify: (x) => { const G = (t) => t ** 3 / 3 + x.c * t, F = (s) => G(s * s) - G(s), e = 1e-5; return (F(x.x0 + e) - F(x.x0 - e)) / (2 * e); },
  },
};

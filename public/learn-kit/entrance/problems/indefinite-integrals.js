// Live problems for Indefinite integrals.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const P = (v) => (v < 0 ? `(${v})` : `${v}`);
const simpson = (f, a, b, N = 2000) => { const h = (b - a) / N; let s = f(a) + f(b); for (let i = 1; i < N; i++) s += f(a + i * h) * (i % 2 ? 4 : 2); return (s * h) / 3; };
const lin = (a, b) => (b === 0 ? 'x' : `x ${b < 0 ? '+' : '−'} ${Math.abs(b)}`); // shows (x − b)

export default {
  'ii-partial': {
    title: 'a partial-fraction coefficient',
    make(r) {
      const a = pick(r, -4, 4), b = a - pick(r, 1, 5), p = pick(r, 1, 6); let q = pick(r, -9, 9) || 7; if (p * a + q === 0) q += 1;
      const A = (p * a + q) / (a - b), B = (p * b + q) / (b - a), answer = A;
      return { a, b, p, qq: q,
        q: `<p>∫ (${p}x ${q < 0 ? '−' : '+'} ${Math.abs(q)}) / ((${lin(0, a)})(${lin(0, b)})) dx = A log|${lin(0, a)}| + B log|${lin(0, b)}| + C. Find A.</p>`,
        answer, unit: '', tol: 0.001, abs: 0.001,
        hint: 'Write the fraction as A/(x − a) + B/(x − b). Cover-up rule: A is the rest of the fraction evaluated at x = a.',
        solution: steps(`Multiply by (${lin(0, a)}) and put x = ${a}: A = (${p} × ${P(a)} ${q < 0 ? '−' : '+'} ${Math.abs(q)})/(${a} − ${P(b)}) = ${p * a + q}/${a - b}.`, `So A = <b>${n(A, 4)}</b> (and B = ${n(B, 4)}; check A + B = ${p}).`) };
    },
    // the limit of (x − a)·f(x) as x → a, worked numerically
    verify: (x) => { const t = x.a + 1e-7; return ((t - x.a) * (x.p * t + x.qq)) / ((t - x.a) * (t - x.b)); },
  },
  'ii-find-f': {
    title: 'find f from f′ and one value',
    make(r) {
      const a = pick(r, 1, 4), b = pick(r, -4, 4), c = pick(r, -5, 5), x0 = pick(r, -1, 1), y0 = pick(r, -5, 5), x1 = pick(r, 2, 3);
      const F = (x) => a * x ** 3 + b * x * x + c * x;
      const C = y0 - F(x0), answer = F(x1) + C;
      return { a, b, c, x0, y0, x1,
        q: `<p>f′(x) = ${3 * a}x² ${2 * b < 0 ? '−' : '+'} ${Math.abs(2 * b)}x ${c < 0 ? '−' : '+'} ${Math.abs(c)} and f(${x0}) = ${y0}. Find f(${x1}).</p>`,
        answer, unit: '', tol: 0, abs: 0.01,
        hint: 'Integrate term by term (add 1 to each power, divide by the new power), then use the given value to find C.',
        solution: steps(`f(x) = ${a}x³ ${b < 0 ? '−' : '+'} ${Math.abs(b)}x² ${c < 0 ? '−' : '+'} ${Math.abs(c)}x + C.`, `f(${x0}) = ${F(x0)} + C = ${y0}, so C = ${C}.`, `f(${x1}) = ${F(x1)} ${C < 0 ? '−' : '+'} ${Math.abs(C)} = <b>${answer}</b>.`) };
    },
    // add the area under f′ from x₀ to x₁ to the starting value
    verify: (x) => x.y0 + simpson((t) => 3 * x.a * t * t + 2 * x.b * t + x.c, x.x0, x.x1),
  },
  'ii-parts': {
    title: 'integration by parts with a starting value',
    make(r) {
      const k = pick(r, 1, 3), t = pick(r, 0.5, 2, 0.5);
      const F = (x) => Math.exp(k * x) * (x / k - 1 / (k * k));
      const answer = F(t) - F(0);
      return { k, t,
        q: `<p>F(x) = ∫ x e<sup>${k === 1 ? '' : k}x</sup> dx and F(0) = 0. Find F(${t}) to 3 decimal places.</p>`,
        answer, unit: '', tol: 0.002, abs: 0.002,
        hint: 'By parts with u = x (it gets simpler when differentiated) and dv = e^(kx) dx.',
        solution: steps(`∫ x e<sup>kx</sup> dx = x·e<sup>kx</sup>/k − ∫ e<sup>kx</sup>/k dx = e<sup>kx</sup>(x/k − 1/k²) + C, with k = ${k}.`, `F(0) = −1/${k * k} + C = 0, so C = 1/${k * k}.`, `F(${t}) = e<sup>${n(k * t)}</sup>(${t}/${k} − 1/${k * k}) + 1/${k * k} = <b>${n(answer, 5)}</b>.`) };
    },
    verify: (x) => simpson((s) => s * Math.exp(x.k * s), 0, x.t),
  },
};

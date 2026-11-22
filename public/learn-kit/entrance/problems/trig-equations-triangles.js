// Live problems for Trigonometric equations and properties of triangles.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const R = Math.PI / 180;

export default {
  'tri-count': {
    title: 'count the solutions of sin x = k in an interval',
    make(r) {
      const k = pick(r, -0.9, 0.9, 0.1) || 0.3, m = pick(r, 2, 7);
      // solutions of sin x = k (0 < |k| < 1) in [0, mπ]: two per full turn; a half turn adds one if k has the right sign
      const full = Math.floor(m / 2), extra = m % 2 === 1 && k > 0 ? 2 : 0;
      const answer = 2 * full + extra;
      return { k, m,
        q: `<p>How many solutions does sin x = ${k} have in the interval [0, ${m}π]?</p>`,
        answer, unit: 'solutions', tol: 0, abs: 0.1,
        hint: 'Picture the sine graph and the line y = k. Each full turn of 2π meets the line twice. In a leftover half turn [2jπ, (2j + 1)π] sine is positive, so it meets a line y = k only when k > 0.',
        solution: steps(`[0, ${m}π] has ${full} full turn${full === 1 ? '' : 's'} of 2π${m % 2 ? ' and one extra half turn where sin x ≥ 0' : ''}.`, `Each full turn gives 2 solutions: ${2 * full}.`, m % 2 ? `The half turn gives ${extra} more, because k = ${k} is ${k > 0 ? 'positive, and the hump crosses y = k twice' : 'negative and sine stays above 0 there'}.` : 'No half turn is left over.', `Total = <b>${answer}</b>.`) };
    },
    verify: (x) => { let c = 0, prev = Math.sin(0) - x.k; const N = 200000; for (let i = 1; i <= N; i++) { const t = (i / N) * x.m * Math.PI, v = Math.sin(t) - x.k; if (prev === 0 || prev * v < 0) c++; prev = v; } return c; },
  },
  'tri-cosine': {
    title: 'third side by the cosine rule',
    make(r) {
      const b = pick(r, 4, 15), c = pick(r, 4, 15), A = [30, 45, 60, 90, 120, 135, 150][Math.floor(r() * 7)];
      const answer = Math.sqrt(b * b + c * c - 2 * b * c * Math.cos(A * R));
      return { b, c, A,
        q: `<p>In triangle ABC, b = ${b} cm, c = ${c} cm and the angle between them is A = ${A}°. Find side a in cm.</p>`,
        answer, unit: 'cm', tol: 0.005,
        hint: 'Two sides and the angle between them: use a² = b² + c² − 2bc cos A. For an obtuse angle cos A is negative, so a gets longer.',
        solution: steps(`cos ${A}° = ${n(Math.cos(A * R), 4)}.`, `a² = ${b * b} + ${c * c} − 2(${b})(${c})(${n(Math.cos(A * R), 4)}) = ${n(answer * answer, 5)}.`, `a = <b>${n(answer, 4)} cm</b>.`) };
    },
    verify: (x) => Math.hypot(x.c - x.b * Math.cos(x.A * R), x.b * Math.sin(x.A * R)),
  },
  'tri-inradius': {
    title: 'inradius and circumradius from three sides',
    make(r) {
      const sets = [[13, 14, 15], [5, 12, 13], [7, 8, 9], [6, 8, 10], [9, 10, 17], [8, 15, 17], [10, 13, 13], [4, 13, 15]];
      const [a, b, c] = sets[Math.floor(r() * sets.length)], want = r() < 0.5 ? 'r' : 'R';
      const s = (a + b + c) / 2, D = Math.sqrt(s * (s - a) * (s - b) * (s - c));
      const answer = want === 'r' ? D / s : (a * b * c) / (4 * D);
      return { a, b, c, want,
        q: `<p>A triangle has sides ${a}, ${b} and ${c} cm. Find its ${want === 'r' ? 'inradius r' : 'circumradius R'} in cm.</p>`,
        answer, unit: 'cm', tol: 0.005,
        hint: 'First the area by Heron: Δ = √(s(s − a)(s − b)(s − c)) with s = (a + b + c)/2. Then r = Δ/s and R = abc/(4Δ).',
        solution: steps(`s = ${s}.`, `Δ = √(${s} × ${s - a} × ${s - b} × ${s - c}) = ${n(D, 5)} cm².`, want === 'r' ? `r = Δ/s = ${n(D, 5)}/${s} = <b>${n(answer, 4)} cm</b>.` : `R = abc/(4Δ) = ${a * b * c}/(4 × ${n(D, 5)}) = <b>${n(answer, 4)} cm</b>.`) };
    },
    verify: (x) => {
      const A = Math.acos((x.b * x.b + x.c * x.c - x.a * x.a) / (2 * x.b * x.c));
      const s = (x.a + x.b + x.c) / 2;
      return x.want === 'r' ? (s - x.a) * Math.tan(A / 2) : x.a / (2 * Math.sin(A));
    },
  },
};

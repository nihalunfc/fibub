// Live problems for Trigonometric functions and identities.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29]];

export default {
  'trg-arc': {
    title: 'arc length from an angle in degrees',
    make(r) {
      const R = pick(r, 5, 40), deg = pick(r, 15, 330, 15);
      const answer = (R * deg * Math.PI) / 180;
      return { R, deg,
        q: `<p>A circle has radius ${R} cm. An arc subtends an angle of ${deg}° at the centre. How long is the arc, in cm?</p>`,
        answer, unit: 'cm', tol: 0.005,
        hint: 'Arc length s = rθ works only with θ in radians. Convert first: θ (rad) = θ (deg) × π/180.',
        solution: steps(`θ = ${deg} × π/180 = ${n(deg / 180, 4)}π = ${n((deg * Math.PI) / 180, 4)} rad.`, `s = rθ = ${R} × ${n((deg * Math.PI) / 180, 4)} = <b>${n(answer, 4)} cm</b>.`) };
    },
    verify: (x) => 2 * Math.PI * x.R * (x.deg / 360),
  },
  'trg-compound': {
    title: 'sin(A + B) from two ratios',
    make(r) {
      const [a, b, c] = TRIPLES[Math.floor(r() * TRIPLES.length)], [p, qq, s] = TRIPLES[(Math.floor(r() * TRIPLES.length) + 2) % TRIPLES.length];
      // A acute with sin A = a/c; B obtuse with cos B = −p/s (second quadrant)
      const sinA = a / c, cosA = b / c, cosB = -p / s, sinB = qq / s;
      const answer = sinA * cosB + cosA * sinB;
      return { a, b, c, p, qq, s,
        q: `<p>A is acute with sin A = ${a}/${c}. B lies in the second quadrant with cos B = −${p}/${s}. Find sin(A + B) as a decimal.</p>`,
        answer, unit: '', tol: 0.002, abs: 0.002,
        hint: 'sin(A + B) = sin A cos B + cos A sin B. Find cos A and sin B from Pythagoras, then fix their signs by the quadrant.',
        solution: steps(`cos A = +√(1 − ${a * a}/${c * c}) = ${b}/${c} (A acute).`, `sin B = +√(1 − ${p * p}/${s * s}) = ${qq}/${s} (sine is positive in the second quadrant).`, `sin(A + B) = (${a}/${c})(−${p}/${s}) + (${b}/${c})(${qq}/${s}) = (${b * qq - a * p})/${c * s} = <b>${n(answer, 4)}</b>.`) };
    },
    verify: (x) => Math.sin(Math.asin(x.a / x.c) + (Math.PI - Math.asin(x.qq / x.s))),
  },
  'trg-maxmin': {
    title: 'greatest value of a sin x + b cos x + c',
    make(r) {
      const [a0, b0] = TRIPLES[Math.floor(r() * 3)], k = pick(r, 1, 3), a = a0 * k * (r() < 0.5 ? 1 : -1), b = b0 * k, c = pick(r, 1, 12);
      const answer = c + Math.hypot(a, b);
      return { a, b, c,
        q: `<p>Find the greatest value of f(x) = ${a} sin x + ${b} cos x ${c < 0 ? '− ' + -c : '+ ' + c} over all real x.</p>`,
        answer, unit: '', tol: 0, abs: 0.001,
        hint: 'a sin x + b cos x = √(a² + b²) sin(x + α) for some angle α, so it swings between −√(a² + b²) and +√(a² + b²).',
        solution: steps(`√(a² + b²) = √(${a * a} + ${b * b}) = ${Math.hypot(a, b)}.`, `So ${a} sin x + ${b} cos x lies between −${Math.hypot(a, b)} and ${Math.hypot(a, b)}.`, `Greatest value of f = ${c} + ${Math.hypot(a, b)} = <b>${answer}</b>.`) };
    },
    verify: (x) => { let m = -Infinity; for (let i = 0; i < 200000; i++) { const t = (i / 200000) * 2 * Math.PI; m = Math.max(m, x.a * Math.sin(t) + x.b * Math.cos(t) + x.c); } return m; },
  },
};

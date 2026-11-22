// Live problems for Parabola, ellipse and hyperbola.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';

export default {
  'con-ecc': {
    title: 'eccentricity of an ellipse or a hyperbola',
    make(r) {
      const hyp = r() < 0.5, A = pick(r, 3, 10), B = pick(r, 2, 9);
      const [a, b] = hyp ? [A, B] : [Math.max(A, B + 1), Math.min(A, B)];
      const answer = hyp ? Math.sqrt(1 + (b * b) / (a * a)) : Math.sqrt(1 - (b * b) / (a * a));
      return { hyp, a, b,
        q: `<p>Find the eccentricity of the ${hyp ? 'hyperbola' : 'ellipse'} x²/${a * a} ${hyp ? '−' : '+'} y²/${b * b} = 1.</p>`,
        answer, unit: '', tol: 0.002,
        hint: hyp ? 'For x²/a² − y²/b² = 1, b² = a²(e² − 1), so e = √(1 + b²/a²). It is always more than 1.' : 'For x²/a² + y²/b² = 1 with a > b, b² = a²(1 − e²), so e = √(1 − b²/a²). It is always less than 1.',
        solution: steps(`a² = ${a * a}, b² = ${b * b}${hyp ? '' : ' (a > b, so the major axis is along x)'}.`, `e = √(1 ${hyp ? '+' : '−'} ${b * b}/${a * a}) = √(${hyp ? a * a + b * b : a * a - b * b}/${a * a}) = <b>${n(answer, 4)}</b>.`) };
    },
    verify: (x) => { // take a point on the curve and divide its focal distance by its distance to the directrix
      const c = x.hyp ? Math.sqrt(x.a * x.a + x.b * x.b) : Math.sqrt(x.a * x.a - x.b * x.b), e = c / x.a;
      const px = x.hyp ? x.a * 1.7 : x.a * 0.4, py = x.hyp ? x.b * Math.sqrt(1.7 * 1.7 - 1) : x.b * Math.sqrt(1 - 0.16);
      return Math.hypot(px - c, py) / Math.abs(px - x.a / e);
    },
  },
  'con-focal': {
    title: 'focal distance of a point on a parabola',
    make(r) {
      const a = pick(r, 1, 6), t = pick(r, 1, 5) * (r() < 0.5 ? 1 : -1);
      const x1 = a * t * t, y1 = 2 * a * t, answer = x1 + a;
      return { a, x1, y1,
        q: `<p>The point (${x1}, ${y1 < 0 ? '−' + -y1 : y1}) lies on the parabola y² = ${4 * a}x. How far is it from the focus?</p>`,
        answer, unit: '', tol: 0, abs: 0.001,
        hint: 'By the definition of a parabola, the distance to the focus equals the distance to the directrix x = −a. So it is x₁ + a.',
        solution: steps(`4a = ${4 * a}, so a = ${a}: focus (${a}, 0), directrix x = −${a}.`, `Focal distance = distance to the directrix = x₁ + a = ${x1} + ${a} = <b>${answer}</b>.`) };
    },
    verify: (x) => Math.hypot(x.x1 - x.a, x.y1),
  },
  'con-tangent': {
    title: 'tangent to an ellipse with a given slope',
    make(r) {
      const a = pick(r, 2, 7), b = pick(r, 1, a - 1), m = pick(r, -3, 3) || 1;
      const answer = Math.sqrt(a * a * m * m + b * b);
      return { a, b, m,
        q: `<p>The line y = ${m === 1 ? '' : m === -1 ? '−' : m < 0 ? '−' + -m : m}x + c touches the ellipse x²/${a * a} + y²/${b * b} = 1. Find the positive value of c.</p>`,
        answer, unit: '', tol: 0.002,
        hint: 'y = mx + c touches x²/a² + y²/b² = 1 exactly when c² = a²m² + b².',
        solution: steps(`a² = ${a * a}, b² = ${b * b}, m = ${String(m).replace("-", "−")}.`, `c² = a²m² + b² = ${a * a} × ${m * m} + ${b * b} = ${a * a * m * m + b * b}.`, `c = √${a * a * m * m + b * b} = <b>${n(answer, 4)}</b>.`) };
    },
    verify: (x) => { // the line meets the ellipse in a double point: discriminant of the x-quadratic is zero; solve for c
      // (b² + a²m²)x² + 2a²mc x + a²(c² − b²) = 0, D = 0 ⇒ c² = a²m² + b²; find c by bisection on D(c)
      const D = (c) => (2 * x.a * x.a * x.m * c) ** 2 - 4 * (x.b ** 2 + x.a ** 2 * x.m ** 2) * x.a ** 2 * (c * c - x.b ** 2);
      let lo = 0, hi = 100; for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; D(mid) > 0 ? (lo = mid) : (hi = mid); } return lo;
    },
  },
};

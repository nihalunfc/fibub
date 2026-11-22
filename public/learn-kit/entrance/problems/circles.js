// Live problems for Circles.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const sg = (v) => String(v).replace('-', '−');
const term = (k, s) => (k === 0 ? '' : ` ${k < 0 ? '−' : '+'} ${Math.abs(k) === 1 && s ? '' : Math.abs(k)}${s}`);
const circ = (G, F, c) => `x² + y²${term(2 * G, 'x')}${term(2 * F, 'y')}${term(c, '')} = 0`;

export default {
  'cir-radius': {
    title: 'centre and radius from the general equation',
    make(r) {
      const h = pick(r, -6, 6), k = pick(r, -6, 6), rad = pick(r, 2, 9), sc = [1, 1, 2, 3][Math.floor(r() * 4)];
      const G = -h, F = -k, c = h * h + k * k - rad * rad;
      const shown = sc === 1 ? circ(G, F, c) : `${sc}x² + ${sc}y²${term(2 * G * sc, 'x')}${term(2 * F * sc, 'y')}${term(c * sc, '')} = 0`;
      return { h, k, c, sc, coef: [2 * G * sc, 2 * F * sc, c * sc],
        q: `<p>Find the radius of the circle ${shown}.</p>`,
        answer: rad, unit: '', tol: 0, abs: 0.001,
        hint: 'Make the coefficients of x² and y² equal to 1 first. Then for x² + y² + 2gx + 2fy + c = 0 the centre is (−g, −f) and r = √(g² + f² − c).',
        solution: steps(sc === 1 ? 'The coefficients of x² and y² are already 1.' : `Divide by ${sc}: ${circ(G, F, c)}.`, `2g = ${sg(2 * G)}, 2f = ${sg(2 * F)}, so the centre is (${sg(h)}, ${sg(k)}); c = ${sg(c)}.`, `r = √(${h * h} + ${k * k} − (${sg(c)})) = √${rad * rad} = <b>${rad}</b>.`) };
    },
    verify: (x) => { // complete the square from the shown coefficients
      const [A, B, C] = x.coef.map((v) => v / x.sc);
      return Math.sqrt((A / 2) ** 2 + (B / 2) ** 2 - C);
    },
  },
  'cir-tangent': {
    title: 'length of the tangent from a point',
    make(r) {
      const h = pick(r, -4, 4), k = pick(r, -4, 4), rad = pick(r, 1, 5), ang = r() * 2 * Math.PI, dist = rad + pick(r, 1, 6);
      const x1 = Math.round(h + dist * Math.cos(ang)), y1 = Math.round(k + dist * Math.sin(ang));
      const c = h * h + k * k - rad * rad, S1 = x1 * x1 + y1 * y1 - 2 * h * x1 - 2 * k * y1 + c;
      const ok = S1 > 0 ? [x1, y1] : [h + rad + 3, k];
      const S = ok[0] ** 2 + ok[1] ** 2 - 2 * h * ok[0] - 2 * k * ok[1] + c;
      return { h, k, rad, x1: ok[0], y1: ok[1],
        q: `<p>Find the length of the tangent from the point (${sg(ok[0])}, ${sg(ok[1])}) to the circle ${circ(-h, -k, c)}.</p>`,
        answer: Math.sqrt(S), unit: '', tol: 0.002,
        hint: 'Put the point into the left side of the equation (with x² and y² having coefficient 1). That value S₁ is the square of the tangent length.',
        solution: steps(`S₁ = (${sg(ok[0])})² + (${sg(ok[1])})²${term(-2 * h * ok[0], '')}${term(-2 * k * ok[1], '')}${term(c, '')} = ${S}.`, `S₁ > 0, so the point is outside. Length = √S₁ = √${S} = <b>${n(Math.sqrt(S), 4)}</b>.`) };
    },
    verify: (x) => Math.sqrt((x.x1 - x.h) ** 2 + (x.y1 - x.k) ** 2 - x.rad ** 2), // Pythagoras with the radius
  },
  'cir-chord': {
    title: 'length of the chord cut by a line',
    make(r) {
      const [a, b, l] = [[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [1, 0, 1], [0, 1, 1]][Math.floor(r() * 6)];
      const rad = pick(r, 5, 13), d = pick(r, 0, rad - 1), sgn = r() < 0.5 ? 1 : -1;
      const c = -sgn * d * l; // line a x + b y + c = 0 at distance d from the origin
      const answer = 2 * Math.sqrt(rad * rad - d * d);
      const line_ = `${a ? (a === 1 ? '' : a) + 'x' : ''}${b ? (a ? ' + ' : '') + (b === 1 ? '' : b) + 'y' : ''}${term(c, '')} = 0`;
      return { a, b, c, rad,
        q: `<p>Find the length of the chord that the line ${line_} cuts off on the circle x² + y² = ${rad * rad}.</p>`,
        answer, unit: '', tol: 0.002,
        hint: 'Find the distance p from the centre to the line. Half the chord, p and the radius make a right triangle: chord = 2√(r² − p²).',
        solution: steps(`Centre (0, 0), r = ${rad}.`, `p = |c|/√(a² + b²) = ${Math.abs(c)}/${l} = ${d}.`, `Chord = 2√(${rad * rad} − ${d * d}) = 2√${rad * rad - d * d} = <b>${n(answer, 4)}</b>.`) };
    },
    verify: (x) => { // intersect the line with the circle and measure between the two points
      const { a, b, c, rad } = x;
      if (b !== 0) { const A = 1 + (a / b) ** 2, B = (2 * a * c) / (b * b), C = (c / b) ** 2 - rad * rad, D = Math.sqrt(B * B - 4 * A * C); const x1 = (-B + D) / (2 * A), x2 = (-B - D) / (2 * A); return Math.hypot(x1 - x2, (-a * x1 - c) / b - (-a * x2 - c) / b); }
      const xv = -c / a; return 2 * Math.sqrt(rad * rad - xv * xv);
    },
  },
};

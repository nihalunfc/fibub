// Live problems for Straight lines.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const sg = (v) => String(v).replace('-', '−');
// a x + b y + c written neatly
const eq = (a, b, c) => {
  const t = (k, s, first) => (k === 0 ? '' : `${k < 0 ? (first ? '−' : ' − ') : first ? '' : ' + '}${Math.abs(k) === 1 && s ? '' : Math.abs(k)}${s}`);
  const lhs = t(a, 'x', true) + t(b, 'y', a === 0) + t(c, '', false);
  return `${lhs} = 0`;
};
const TR = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [7, 24, 25]];

export default {
  'sl-dist': {
    title: 'distance from a point to a line',
    make(r) {
      const [p, s0] = TR[Math.floor(r() * TR.length)], a = p * (r() < 0.5 ? 1 : -1), b = s0, c = pick(r, -20, 20), x1 = pick(r, -6, 6), y1 = pick(r, -6, 6);
      const val = a * x1 + b * y1 + c, len = Math.hypot(a, b), answer = Math.abs(val) / len;
      return { a, b, c, x1, y1,
        q: `<p>Find the perpendicular distance of the point (${sg(x1)}, ${sg(y1)}) from the line ${eq(a, b, c)}.</p>`,
        answer, unit: '', tol: 0.002, abs: 0.001,
        hint: 'Distance = |ax₁ + by₁ + c| / √(a² + b²): put the point into the left side, take the size, and divide by the length of the normal (a, b).',
        solution: steps(`ax₁ + by₁ + c = ${sg(a)}(${sg(x1)}) + ${sg(b)}(${sg(y1)}) ${c < 0 ? '−' : '+'} ${Math.abs(c)} = ${sg(val)}.`, `√(a² + b²) = √(${a * a} + ${b * b}) = ${len}.`, `Distance = ${Math.abs(val)}/${len} = <b>${n(answer, 4)}</b>.`) };
    },
    verify: (x) => { // foot of the perpendicular by projection, then the length
      const t = -(x.a * x.x1 + x.b * x.y1 + x.c) / (x.a * x.a + x.b * x.b);
      return Math.hypot(t * x.a, t * x.b);
    },
  },
  'sl-angle': {
    title: 'acute angle between two lines',
    make(r) {
      const ms = [0, 1, -1, 2, -2, 3, -3, 0.5, -0.5, 1 / 3];
      let m1 = ms[Math.floor(r() * ms.length)], m2 = ms[Math.floor(r() * 0.999 * ms.length + 3) % ms.length];
      if (m1 * m2 === -1 || m1 === m2) m2 = m1 === 2 ? 3 : 2;
      const tn = Math.abs((m1 - m2) / (1 + m1 * m2)), answer = (Math.atan(tn) * 180) / Math.PI;
      const fm = (m) => (m === 0.5 ? '1/2' : m === -0.5 ? '−1/2' : Math.abs(m - 1 / 3) < 1e-12 ? '1/3' : sg(m));
      return { m1, m2,
        q: `<p>Find the acute angle, in degrees, between the line with slope ${fm(m1)} and the line with slope ${fm(m2)}.</p>`,
        answer, unit: '°', tol: 0.002,
        hint: 'tan θ = |(m₁ − m₂)/(1 + m₁m₂)| gives the acute angle. (If 1 + m₁m₂ = 0, the lines are perpendicular.)',
        solution: steps(`tan θ = |(${fm(m1)} − ${m2 < 0 ? '(' + fm(m2) + ')' : fm(m2)})/(1 + ${fm(m1)} × ${m2 < 0 ? '(' + fm(m2) + ')' : fm(m2)})| = ${n(tn, 4)}.`, `θ = tan⁻¹(${n(tn, 4)}) = <b>${n(answer, 4)}°</b>.`) };
    },
    verify: (x) => { // angle between direction vectors (1, m1) and (1, m2)
      const d = Math.abs(1 + x.m1 * x.m2) / (Math.hypot(1, x.m1) * Math.hypot(1, x.m2));
      return (Math.acos(Math.min(1, d)) * 180) / Math.PI;
    },
  },
  'sl-image': {
    title: 'image of a point in a line',
    make(r) {
      const a = pick(r, 1, 3), b = pick(r, -3, 3) || 1, c = pick(r, -8, 8), x1 = pick(r, -5, 5), y1 = pick(r, -5, 5);
      const k = (-2 * (a * x1 + b * y1 + c)) / (a * a + b * b), want = r() < 0.5 ? 'x' : 'y';
      const ix = x1 + k * a, iy = y1 + k * b, answer = want === 'x' ? ix : iy;
      return { a, b, c, x1, y1, want,
        q: `<p>Find the ${want}-coordinate of the image (mirror reflection) of the point (${sg(x1)}, ${sg(y1)}) in the line ${eq(a, b, c)}.</p>`,
        answer, unit: '', tol: 0.002, abs: 0.002,
        hint: 'The image (h, k) satisfies (h − x₁)/a = (k − y₁)/b = −2(ax₁ + by₁ + c)/(a² + b²).',
        solution: steps(`ax₁ + by₁ + c = ${sg(a * x1 + b * y1 + c)}, a² + b² = ${a * a + b * b}.`, `Common ratio = −2 × ${a * x1 + b * y1 + c < 0 ? '(' + sg(a * x1 + b * y1 + c) + ')' : a * x1 + b * y1 + c}/${a * a + b * b} = ${sg(n(k, 4))}.`, `h = ${sg(x1)} + ${a} × (${sg(n(k, 4))}) = ${sg(n(ix, 4))}; k = ${sg(y1)} + ${b < 0 ? '(' + sg(b) + ')' : b} × (${sg(n(k, 4))}) = ${sg(n(iy, 4))}.`, `The ${want}-coordinate is <b>${sg(n(answer, 4))}</b>.`) };
    },
    verify: (x) => { // reflect using a unit normal and check the midpoint lies on the line
      const L = Math.hypot(x.a, x.b), ux = x.a / L, uy = x.b / L, d = (x.a * x.x1 + x.b * x.y1 + x.c) / L;
      const ix = x.x1 - 2 * d * ux, iy = x.y1 - 2 * d * uy;
      return x.want === 'x' ? ix : iy;
    },
  },
};

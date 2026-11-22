// Live problems for Complex numbers.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const cs = (x, y) => {
  const im = `${Math.abs(y) === 1 ? '' : Math.abs(y)}i`, re = String(x).replace('-', '−');
  return y === 0 ? re : x === 0 ? (y < 0 ? '−' : '') + im : `${re}${y < 0 ? ' − ' : ' + '}${im}`;
};

export default {
  'cx-sqrt': {
    title: 'square root of a complex number',
    make(r) {
      const x = pick(r, 1, 7), y = pick(r, 1, 7) * (r() < 0.5 ? -1 : 1);
      const a = x * x - y * y, b = 2 * x * y, mod = x * x + y * y;
      return { a, b,
        q: `<p>Find the square root of z = ${cs(a, b)} that has a positive real part. Enter its real part.</p>`,
        answer: x, unit: '', tol: 0, abs: 0.001,
        hint: 'Let √z = p + iq. Then p² − q² = Re z and 2pq = Im z. Also p² + q² = |z|. Add the first and last.',
        solution: steps(`|z| = √(${a}² + ${b}²) = ${mod}.`, `p² + q² = ${mod} and p² − q² = ${a}, so p² = (${mod} + ${a})/2 = ${x * x} and q² = ${y * y}.`, `2pq = ${b} is ${b < 0 ? 'negative, so q has the opposite sign to p' : 'positive, so p and q have the same sign'}: √z = ±(${cs(x, y)}).`, `With a positive real part, the real part is <b>${x}</b>.`) };
    },
    verify: (x) => Math.sqrt((Math.hypot(x.a, x.b) + x.a) / 2),
  },
  'cx-power': {
    title: 'a power of a complex number by De Moivre',
    make(r) {
      const opts = [[1, 1, Math.SQRT2, 45], [1, -1, Math.SQRT2, -45], [Math.sqrt(3), 1, 2, 30], [1, Math.sqrt(3), 2, 60], [-1, Math.sqrt(3), 2, 120], [-Math.sqrt(3), 1, 2, 150]];
      const lab = ['1 + i', '1 − i', '√3 + i', '1 + √3 i', '−1 + √3 i', '−√3 + i'];
      const i = Math.floor(r() * opts.length), [, , m, deg] = opts[i], k = pick(r, 3, 10);
      const answer = Math.round(m ** k * Math.cos((k * deg * Math.PI) / 180) * 1e6) / 1e6;
      return { i, k,
        q: `<p>Find the real part of (${lab[i]})<sup>${k}</sup>.</p>`,
        answer, unit: '', tol: 0.001, abs: 0.01,
        hint: 'Write the number in polar form r(cos θ + i sin θ). Then zⁿ = rⁿ(cos nθ + i sin nθ).',
        solution: steps(`${lab[i]} has modulus ${m === 2 ? 2 : '√2'} and argument ${deg}°.`, `So (${lab[i]})<sup>${k}</sup> = ${m === 2 ? 2 : '(√2)'}<sup>${k}</sup>(cos ${k * deg}° + i sin ${k * deg}°).`, `Real part = ${n(m ** k, 6)} × cos ${k * deg}° = <b>${n(answer, 6)}</b>.`) };
    },
    verify: (x) => {
      const opts = [[1, 1], [1, -1], [Math.sqrt(3), 1], [1, Math.sqrt(3)], [-1, Math.sqrt(3)], [-Math.sqrt(3), 1]];
      const [a, b] = opts[x.i]; let re = 1, im = 0;
      for (let j = 0; j < x.k; j++) [re, im] = [re * a - im * b, re * b + im * a];
      return re;
    },
  },
  'cx-locus': {
    title: 'radius of the circle |z − z₁| = k|z − z₂|',
    make(r) {
      const x1 = pick(r, -4, 4), y1 = pick(r, -4, 4), x2 = x1 + pick(r, 1, 6), y2 = y1 + pick(r, -4, 4), k = [2, 3, 0.5, 4][Math.floor(r() * 4)];
      const d = Math.hypot(x2 - x1, y2 - y1), answer = (k * d) / Math.abs(1 - k * k);
      return { x1, y1, x2, y2, k,
        q: `<p>The points z with |z − (${cs(x1, y1)})| = ${k}·|z − (${cs(x2, y2)})| lie on a circle. Find its radius.</p>`,
        answer, unit: '', tol: 0.005,
        hint: 'For k ≠ 1 the locus is a circle (Apollonius). The two points on line z₁z₂ that divide it internally and externally in the ratio k : 1 are the ends of a diameter.',
        solution: steps(`|z₁ − z₂| = √(${(x2 - x1) ** 2} + ${(y2 - y1) ** 2}) = ${n(d, 5)}.`, `Internal point: distance ${n(d, 4)} × ${k}/(${k} + 1) from z₁; external point: ${n(d, 4)} × ${k}/|${k} − 1| from z₁ on the same line.`, `Diameter = ${n(d, 4)} × ${k} × |1/(${k} − 1) ${k > 1 ? '−' : '+'} 1/(${k} + 1)|, so radius = k|z₁ − z₂|/|1 − k²| = <b>${n(answer, 4)}</b>.`) };
    },
    verify: (x) => {
      // centre (z1 − k² z2)/(1 − k²), radius = distance from centre to the internal division point
      const k2 = x.k * x.k, cx = (x.x1 - k2 * x.x2) / (1 - k2), cy = (x.y1 - k2 * x.y2) / (1 - k2);
      const px = (x.x1 + x.k * x.x2) / (1 + x.k), py = (x.y1 + x.k * x.y2) / (1 + x.k);
      return Math.hypot(px - cx, py - cy);
    },
  },
};

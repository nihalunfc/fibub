// Live problems for Inverse trigonometric functions.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const D = Math.PI / 180;
const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41]];

export default {
  'itrig-sinsin': {
    title: 'sin⁻¹(sin θ) when θ is outside the principal range',
    make(r) {
      let th = pick(r, 95, 625, 5); if (th % 90 === 0) th += 25;
      // bring θ to the branch: sin θ = sin(180k + (−1)^k φ); choose k so that φ is in [−90, 90]
      const k = Math.round(th / 180), phi = (k % 2 === 0 ? 1 : -1) * (th - 180 * k);
      const answer = phi;
      return { th,
        q: `<p>Find sin⁻¹(sin ${th}°) in degrees.</p>`,
        answer, unit: '°', tol: 0, abs: 0.01,
        hint: 'The answer must lie in [−90°, 90°]. Find an angle φ in that range with sin φ = sin θ, using sin(180° − x) = sin x and sin(x − 360°) = sin x.',
        solution: steps(`The nearest multiple of 180° to ${th}° is ${180 * k}° (k = ${k}).`, `sin ${th}° = sin(${180 * k}° ${th - 180 * k >= 0 ? '+' : '−'} ${Math.abs(th - 180 * k)}°) = ${k % 2 === 0 ? '' : '−'}sin(${th - 180 * k}°) = sin(${phi}°).`, `${phi}° lies in [−90°, 90°], so sin⁻¹(sin ${th}°) = <b>${phi}°</b>.`) };
    },
    verify: (x) => Math.round(Math.asin(Math.sin(x.th * D)) / D * 1e6) / 1e6,
  },
  'itrig-tansum': {
    title: 'tan⁻¹a + tan⁻¹b when ab > 1',
    make(r) {
      const a = pick(r, 1, 6), b = pick(r, 2, 7);
      const base = Math.atan((a + b) / (1 - a * b)) / D;
      const answer = 180 + base;
      return { a, b,
        q: `<p>Find tan⁻¹${a} + tan⁻¹${b} in degrees (to 2 decimal places).</p>`,
        answer, unit: '°', tol: 0.0005, abs: 0.02,
        hint: 'tan⁻¹a + tan⁻¹b = tan⁻¹[(a + b)/(1 − ab)] only when ab < 1. When a, b > 0 and ab > 1, add 180° (π).',
        solution: steps(`ab = ${a * b} > 1 and both are positive, so the sum is more than 90°.`, `tan⁻¹[(a + b)/(1 − ab)] = tan⁻¹(${a + b}/${1 - a * b}) = ${n(base, 5)}°.`, `Add 180°: <b>${n(answer, 5)}°</b>.`) };
    },
    verify: (x) => (Math.atan(x.a) + Math.atan(x.b)) / D,
  },
  'itrig-compose': {
    title: 'tan(2 sin⁻¹x) with a right triangle',
    make(r) {
      const [p, b, h] = TRIPLES[Math.floor(r() * TRIPLES.length)], swap = r() < 0.5;
      const opp = swap ? b : p, adj = swap ? p : b, t = opp / adj;
      const answer = (2 * t) / (1 - t * t);
      return { opp, adj, h,
        q: `<p>Find tan(2 sin⁻¹(${opp}/${h})). Give a decimal to 3 places.</p>`,
        answer, unit: '', tol: 0.002, abs: 0.002,
        hint: `Let θ = sin⁻¹(${opp}/${h}). Draw a right triangle with opposite ${opp} and hypotenuse ${h}; find tan θ, then use tan 2θ = 2 tan θ/(1 − tan²θ).`,
        solution: steps(`Adjacent side = √(${h}² − ${opp}²) = ${adj}, so tan θ = ${opp}/${adj}.`, `tan 2θ = 2(${opp}/${adj}) ÷ (1 − ${opp * opp}/${adj * adj}) = ${2 * opp * adj}/${adj * adj - opp * opp}.`, `= <b>${n(answer, 4)}</b>.`) };
    },
    verify: (x) => Math.tan(2 * Math.asin(x.opp / x.h)),
  },
};

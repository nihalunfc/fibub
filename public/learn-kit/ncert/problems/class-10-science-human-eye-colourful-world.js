// Class 10 Science, The Human Eye and the Colourful World: live problems (original fibub questions). Ids start with c10s-eye-.
import { pick, choose, n, steps } from './_util.js';

const sg = (x) => (x > 0 ? '+' : '−') + n(Math.abs(x));

export default {
  'c10s-eye-myopia': {
    title: 'spectacle power for short-sight',
    make(r) {
      const d = choose(r, [40, 50, 80, 100, 125, 200]), answer = -100 / d;
      return { d, q: `<p>A short-sighted student can see clearly only up to ${d} cm. What is the power of the lens (with its sign) that lets her see distant objects clearly?</p>`, answer, unit: 'D', tol: 0.01,
        hint: 'The lens must make a distant object seem to be at her far point. So its focal length is −(far point), a concave lens. Then P = 1/f with f in metres.',
        solution: steps(`The image of a far object must form at the far point, ${d} cm in front of the lens: u = −∞, v = −${d} cm.`, `1/f = 1/v − 1/u = −1/${d} cm, so f = −${d} cm = −${n(d / 100)} m.`, `P = 1/f = <b>${sg(answer)} D</b> (a concave lens).`) };
    },
    verify: (x) => 1 / (-x.d / 100),
  },
  'c10s-eye-hyper': {
    title: 'spectacle power for long-sight',
    make(r) {
      const N = choose(r, [40, 50, 75, 100, 125]), answer = 100 * (1 / 25 - 1 / N);
      return { N, q: `<p>A long-sighted person has a near point at ${N} cm. What is the power of the lens (with sign) needed to read a book held at the normal near point, 25 cm?</p>`, answer, unit: 'D', tol: 0.01,
        hint: 'The lens must form a virtual image of the book (at 25 cm) at the person’s near point. Use 1/v − 1/u = 1/f with u = −25 cm and v = −near point.',
        solution: steps(`u = −25 cm (the book), v = −${N} cm (the image must be at the near point).`, `1/f = 1/v − 1/u = −1/${N} + 1/25 = ${n(1 / 25 - 1 / N, 4)} cm⁻¹, so f = ${n(1 / (1 / 25 - 1 / N))} cm.`, `P = 100/f = <b>${sg(answer)} D</b> (a convex lens).`) };
    },
    verify: (x) => 100 / (1 / (1 / 25 - 1 / x.N)),
  },
  'c10s-eye-accom': {
    title: 'lens power the eye needs to focus',
    make(r) {
      const d = choose(r, [25, 30, 50, 100, 200]), answer = 100 / 2.4 + 100 / d;
      return { d, q: `<p>In a simple model of the eye, the retina is 2.4 cm behind the eye lens. What power must the lens have to focus an object ${d} cm away on the retina?</p>`, answer, unit: 'D', tol: 0.01,
        hint: 'Lens formula: 1/v − 1/u = 1/f, with v = +2.4 cm and u = −' + d + ' cm. Then P = 100/f (f in cm).',
        solution: steps(`1/f = 1/v − 1/u = 1/2.4 + 1/${d} = ${n(1 / 2.4 + 1 / d, 4)} cm⁻¹.`, `P = 100/f = <b>${n(answer)} D</b>. (A very far object needs 41.7 D: the nearer the object, the more power the eye needs.)`) };
    },
    verify: (x) => 100 * (1 / 2.4 - 1 / -x.d),
  },
  'c10s-eye-deviation': {
    title: 'angle of deviation in a prism',
    make(r) {
      const A = choose(r, [60, 55, 50]), i = pick(r, 40, 65, 5), e = pick(r, 40, 70, 5), answer = i + e - A;
      return { A, i, e, q: `<p>A ray passes through a glass prism of angle ${A}°. The angle of incidence is ${i}° and the angle of emergence is ${e}°. Find the angle of deviation.</p>`, answer, unit: '°', tol: 0.005,
        hint: 'For a prism the angle of deviation is δ = i + e − A.',
        solution: steps(`δ = i + e − A = ${i}° + ${e}° − ${A}°.`, `δ = <b>${answer}°</b>.`) };
    },
    verify: (x) => x.i - x.A + x.e,
  },
  'c10s-eye-time': {
    title: 'extra daylight from atmospheric refraction',
    make(r) {
      const th = pick(r, 0.4, 0.8, 0.05), answer = th * 4;
      return { th, q: `<p>Atmospheric refraction lifts the apparent position of the Sun near the horizon by ${n(th)}°. The Earth turns through 15° every hour. By about how many minutes does the Sun appear to rise earlier than it truly does?</p>`, answer, unit: 'minutes', tol: 0.02,
        hint: '15° per hour means 15° in 60 minutes, so 1° takes 4 minutes.',
        solution: steps(`Time = angle ÷ rate = ${n(th)}° ÷ (15° per 60 min).`, `Time = ${n(th)} × 4 = <b>${n(answer)} minutes</b>.`) };
    },
    verify: (x) => (x.th / 15) * 60,
  },
  'c10s-eye-scatter': {
    title: 'how much more blue is scattered than red',
    make(r) {
      const b = choose(r, [400, 450, 475]), rd = choose(r, [600, 650, 700]), answer = Math.pow(rd / b, 4);
      return { b, rd, q: `<p>Scattering by air molecules is proportional to 1/λ⁴, where λ is the wavelength. By what factor is light of wavelength ${b} nm scattered more strongly than light of wavelength ${rd} nm?</p>`, answer, unit: 'times', tol: 0.01,
        hint: 'Ratio = (1/λ₁⁴) ÷ (1/λ₂⁴) = (λ₂/λ₁)⁴.',
        solution: steps(`Ratio = (${rd}/${b})⁴ = ${n(rd / b, 4)}⁴.`, `Ratio ≈ <b>${n(answer)} times</b>: that is why the sky looks blue.`) };
    },
    verify: (x) => Math.exp(4 * (Math.log(x.rd) - Math.log(x.b))),
  },
};

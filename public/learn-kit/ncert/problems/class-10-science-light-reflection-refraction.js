// Class 10 Science, Light: Reflection and Refraction: live problems (original fibub questions). Ids start with c10s-light-.
import { pick, choose, n, steps } from './_util.js';

const sg = (x) => (x > 0 ? '+' : '−') + n(Math.abs(x));

export default {
  'c10s-light-angle': {
    title: 'angle between the incident and the reflected ray',
    make(r) {
      const a = pick(r, 10, 80, 5), answer = 180 - 2 * a;
      return { a, q: `<p>A ray of light strikes a plane mirror so that it makes an angle of ${a}° with the <b>surface</b> of the mirror (not with the normal). What is the angle between the incident ray and the reflected ray?</p>`, answer, unit: '°', tol: 0.005,
        hint: 'The laws of reflection use the angle with the normal. The normal is 90° from the surface.',
        solution: steps(`Angle of incidence i = 90° − ${a}° = ${90 - a}°.`, `Angle of reflection r = i = ${90 - a}°.`, `The angle between the two rays = i + r = <b>${answer}°</b>.`) };
    },
    verify: (x) => 2 * (90 - x.a),
  },
  'c10s-light-focal': {
    title: 'focal length from the radius of curvature',
    make(r) {
      const R = pick(r, 10, 80, 2), answer = R / 2;
      return { R, q: `<p>The radius of curvature of a spherical mirror is ${R} cm. What is the magnitude of its focal length?</p>`, answer, unit: 'cm', tol: 0.005,
        hint: 'For a spherical mirror the focus is halfway between the pole and the centre of curvature: f = R/2.',
        solution: steps(`f = R/2 = ${R}/2.`, `f = <b>${n(answer)} cm</b>.`) };
    },
    verify: (x) => x.R * 0.5,
  },
  'c10s-light-mirror': {
    title: 'image distance for a concave mirror',
    make(r) {
      const F = choose(r, [10, 12, 15, 20, 24]), d = F * choose(r, [1.5, 2, 3, 4]), v = 1 / (1 / -F - 1 / -d);
      return { F, d, q: `<p>An object is placed ${n(d)} cm in front of a concave mirror of focal length ${F} cm. Using the New Cartesian sign convention, find the image distance <i>v</i> (give the sign: a negative value means the image is in front of the mirror).</p>`, answer: v, unit: 'cm', tol: 0.01,
        hint: 'Mirror formula: 1/v + 1/u = 1/f, with u = −' + n(d) + ' cm and f = −' + F + ' cm for a concave mirror.',
        solution: steps(`u = −${n(d)} cm, f = −${F} cm.`, `1/v = 1/f − 1/u = −1/${F} + 1/${n(d)} = ${n(1 / v, 4)} cm⁻¹.`, `v = <b>${n(v)} cm</b>. It is negative, so the image is real and in front of the mirror.`) };
    },
    verify: (x) => (-x.d * x.F) / (x.d - x.F),
  },
  'c10s-light-mag': {
    title: 'size of the image in a concave mirror',
    make(r) {
      const F = choose(r, [10, 12, 15, 20]), d = F * choose(r, [1.5, 2, 3]), h = pick(r, 2, 6, 1), v = d * F / (F - d), m = -v / -d, answer = m * h;
      return { F, d, h, q: `<p>A ${h} cm tall object stands ${n(d)} cm from a concave mirror of focal length ${F} cm. Find the height of the image. Give it with a sign: positive for erect, negative for inverted.</p>`, answer, unit: 'cm', tol: 0.01,
        hint: 'First find v from 1/v + 1/u = 1/f, then m = −v/u and h′ = m × h.',
        solution: steps(`u = −${n(d)} cm, f = −${F} cm, so v = ${n(v)} cm.`, `m = −v/u = −(${n(v)})/(−${n(d)}) = ${n(m, 3)}.`, `h′ = m × h = ${n(m, 3)} × ${h} = <b>${n(answer)} cm</b> (${answer < 0 ? 'inverted' : 'erect'}).`) };
    },
    verify: (x) => (x.h * x.F) / (x.d - x.F) * -1,
  },
  'c10s-light-index': {
    title: 'refractive index and the speed of light',
    make(r) {
      const c = 3.0, med = choose(r, [['water', 1.33], ['glass', 1.5], ['diamond', 2.42], ['a plastic', 1.6]]), ask = choose(r, ['n', 'v']);
      if (ask === 'v') return { ask, nn: med[1], q: `<p>The refractive index of ${med[0]} is ${med[1]}. Taking the speed of light in vacuum as 3.0 × 10<sup>8</sup> m/s, find the speed of light in it, in units of 10<sup>8</sup> m/s.</p>`, answer: c / med[1], unit: '× 10⁸ m/s', tol: 0.01,
        hint: 'n = c / v, so v = c / n.', solution: steps(`v = c/n = 3.0 ÷ ${med[1]} (in 10⁸ m/s).`, `v = <b>${n(c / med[1])} × 10⁸ m/s</b>.`) };
      const v = +(c / med[1]).toFixed(3);
      return { ask, v, q: `<p>Light travels at ${n(v)} × 10<sup>8</sup> m/s in a certain medium (speed in vacuum: 3.0 × 10<sup>8</sup> m/s). What is the refractive index of the medium?</p>`, answer: c / v, unit: '', tol: 0.01,
        hint: 'n = speed in vacuum ÷ speed in the medium.', solution: steps(`n = c/v = 3.0 ÷ ${n(v)}.`, `n = <b>${n(c / v)}</b>.`) };
    },
    verify: (x) => (x.ask === 'v' ? 3 / x.nn : 3 / x.v),
  },
  'c10s-light-snell': {
    title: 'angle of refraction from Snell’s law',
    make(r) {
      const i = pick(r, 20, 70, 5), med = choose(r, [['water', 1.33], ['glass', 1.5], ['diamond', 2.42]]), answer = Math.asin(Math.sin((i * Math.PI) / 180) / med[1]) * 180 / Math.PI;
      return { i, nn: med[1], q: `<p>A ray of light in air meets the surface of ${med[0]} (refractive index ${med[1]}) at an angle of incidence of ${i}°. What is the angle of refraction?</p>`, answer, unit: '°', tol: 0.01,
        hint: 'Snell’s law: sin i / sin r = n, so sin r = sin i / n. Then use the inverse sine on your calculator.',
        solution: steps(`sin r = sin ${i}° / ${med[1]} = ${n(Math.sin((i * Math.PI) / 180) / med[1], 4)}.`, `r = <b>${n(answer)}°</b>. It is smaller than i: the ray bends towards the normal.`) };
    },
    verify: (x) => { const s = Math.sin((x.i * Math.PI) / 180); return (Math.atan(s / Math.sqrt(x.nn * x.nn - s * s)) * 180) / Math.PI; },
  },
  'c10s-light-lens': {
    title: 'image distance for a convex lens',
    make(r) {
      const F = choose(r, [10, 12, 15, 20]), d = F * choose(r, [1.5, 2, 3, 4]), v = 1 / (1 / F - 1 / d);
      return { F, d, q: `<p>An object is placed ${n(d)} cm from a convex lens of focal length ${F} cm. Find the image distance <i>v</i> (positive means on the far side of the lens, where a screen can catch it).</p>`, answer: v, unit: 'cm', tol: 0.01,
        hint: 'Lens formula: 1/v − 1/u = 1/f, with u = −' + n(d) + ' cm and f = +' + F + ' cm.',
        solution: steps(`u = −${n(d)} cm, f = +${F} cm.`, `1/v = 1/f + 1/u = 1/${F} − 1/${n(d)} = ${n(1 / v, 4)} cm⁻¹.`, `v = <b>${sg(v)} cm</b>: a real image on the other side.`) };
    },
    verify: (x) => (x.d * x.F) / (x.d - x.F),
  },
  'c10s-light-power': {
    title: 'power of a lens in dioptres',
    make(r) {
      const f = choose(r, [10, 20, 25, 40, 50, 100]), sgn = choose(r, [1, -1]), ask = choose(r, ['P', 'f']), P = (100 / f) * sgn;
      if (ask === 'P') return { f, sgn, ask, q: `<p>A ${sgn > 0 ? 'convex' : 'concave'} lens has a focal length of ${f} cm. What is its power in dioptres (include the sign)?</p>`, answer: P, unit: 'D', tol: 0.005,
        hint: 'Power P = 1/f with f in metres. A convex lens has positive power and a concave lens negative.', solution: steps(`f = ${f} cm = ${n(f / 100)} m.`, `P = 1/f = <b>${sg(P)} D</b>.`) };
      return { f, sgn, ask, P, q: `<p>A lens has a power of ${sg(P)} D. What is its focal length in centimetres (include the sign)?</p>`, answer: sgn * f, unit: 'cm', tol: 0.005,
        hint: 'f = 1/P in metres, then change to centimetres.', solution: steps(`f = 1/P = 1/(${sg(P)}) m = ${n(sgn * f / 100)} m.`, `f = <b>${sg(sgn * f)} cm</b> (${sgn > 0 ? 'convex' : 'concave'} lens).`) };
    },
    verify: (x) => (x.ask === 'P' ? x.sgn * (100 / x.f) : 100 / x.P),
  },
  'c10s-light-plane': {
    title: 'distance between you and your image in a plane mirror',
    make(r) {
      const d = pick(r, 3, 10, 0.5), x = pick(r, 0.5, 2, 0.5), answer = 2 * (d - x);
      return { d, x, q: `<p>You stand ${n(d)} m in front of a large plane mirror and then walk ${n(x)} m towards it. How far are you from your image now?</p>`, answer, unit: 'm', tol: 0.005,
        hint: 'A plane mirror makes an image as far behind it as you are in front.',
        solution: steps(`Your distance from the mirror = ${n(d)} − ${n(x)} = ${n(d - x)} m.`, `Your image is the same distance behind the mirror, so the gap between you and it is 2 × ${n(d - x)} = <b>${n(answer)} m</b>.`) };
    },
    verify: (x) => 2 * x.d - 2 * x.x,
  },
};

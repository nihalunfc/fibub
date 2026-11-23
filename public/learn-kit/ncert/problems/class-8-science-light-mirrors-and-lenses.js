// Class 8 Science, Chapter 10 Light: Mirrors and Lenses: live problems (original fibub questions). Ids start with c8s-light-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c8s-light-reflect': {
    title: 'angle between incident and reflected ray',
    make(r) {
      const a = pick(r, 10, 80, 5), answer = 180 - 2 * a;
      return { a, q: `<p>A ray of light strikes a plane mirror so that it makes an angle of ${a}° with the surface of the mirror (not with the normal). What is the angle between the incident ray and the reflected ray?</p>`, answer, unit: '°', tol: 0.01,
        hint: 'The law of reflection uses the angle with the normal, which is 90° minus the angle with the mirror.', solution: steps(`Angle of incidence i = 90° − ${a}° = ${90 - a}°.`, `Angle of reflection r = i = ${90 - a}°.`, `Angle between the two rays = i + r = <b>${answer}°</b>.`) };
    },
    verify: (x) => 2 * (90 - x.a),
  },
  'c8s-light-plane': {
    title: 'distance between you and your image',
    make(r) {
      const d = pick(r, 2, 6, 0.5), k = choose(r, [0.5, 1, 1.5]), answer = 2 * (d - k);
      return { d, k, q: `<p>You stand ${n(d, 3)} m in front of a plane mirror and then walk ${k} m towards it. How far are you now from your image?</p>`, answer, unit: 'm', tol: 0.01,
        hint: 'The image is as far behind the mirror as you are in front of it.', solution: steps(`Distance from the mirror now = ${n(d, 3)} − ${k} = ${n(d - k, 3)} m.`, `The image is the same distance behind, so the gap is <b>${n(answer, 3)} m</b>.`) };
    },
    verify: (x) => (x.d - x.k) + (x.d - x.k),
  },
  'c8s-light-two': {
    title: 'images between two mirrors',
    make(r) {
      const th = choose(r, [30, 40, 45, 60, 72, 90, 120]), answer = 360 / th - 1;
      return { th, q: `<p>Two plane mirrors are placed at an angle of ${th}° to each other and a candle is put between them. How many images of the candle can you see?</p>`, answer, unit: 'images', tol: 0, abs: 0.01,
        hint: 'Number of images = 360 ÷ angle − 1.', solution: steps(`360 ÷ ${th} = ${360 / th}.`, `Images = ${360 / th} − 1 = <b>${answer}</b>.`) };
    },
    verify: (x) => (360 - x.th) / x.th,
  },
  'c8s-light-time': {
    title: 'time light takes to reach us',
    make(r) {
      const d = choose(r, [58, 108, 150, 228, 778]), answer = d * 1e6 / 3e5 / 60;
      return { d, q: `<p>The speed of light is about 300 000 km/s. A planet is ${d} million km from us. How many minutes does its light take to reach us?</p>`, answer, unit: 'min', tol: 0.01,
        hint: 'Time = distance ÷ speed. Remember that 1 million km = 1 000 000 km, and divide by 60 to turn seconds into minutes.', solution: steps(`Distance = ${d} × 1 000 000 km = ${n(d * 1e6, 5)} km.`, `Time = ${n(d * 1e6, 5)} ÷ 300 000 = ${n(d * 1e6 / 3e5, 4)} s.`, `In minutes: ÷ 60 = <b>${n(answer, 4)} min</b>.`) };
    },
    verify: (x) => x.d / 18,
  },
};

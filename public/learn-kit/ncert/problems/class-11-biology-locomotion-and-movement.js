// Class 11 Biology, Locomotion and Movement: live problems (original fibub questions). Ids start with c11b-loco-.
import { choose, n, steps } from './_util.js';

export default {
  'c11b-loco-sarcomere': {
    title: 'width of the H zone from the I band',
    make(r) {
      const L = choose(r, [2.2, 2.4, 2.6, 2.8, 3.0]);
      return { L, q: `<p>A relaxed muscle has an A band of 1.6 µm and thin filaments 1.0 µm long. When the sarcomere is ${L} µm from Z line to Z line, how wide is the H zone (the part of the A band with no actin)?</p>`, answer: L - 2.0, unit: 'µm', tol: 0.02, abs: 0.02,
        hint: 'Two thin filaments of 1.0 µm come in from the ends. The H zone is what is left of the sarcomere after both have reached in.',
        solution: steps(`The two thin filaments together reach ${n(2 * 1.0)} µm in from the Z lines.`, `The H zone = ${L} − 2.0 = <b>${n(L - 2.0)} µm</b>.`, 'At 2.0 µm the two thin filaments meet and the H zone disappears.') };
    },
    verify: (x) => 1.6 - 2 * (1.0 - (x.L - 1.6) / 2),
  },
  'c11b-loco-count': {
    title: 'number of sarcomeres in a myofibril',
    make(r) {
      const len = choose(r, [1, 2, 3, 5]), s = choose(r, [2.5, 2.8, 3.0]);
      return { len, s, q: `<p>A myofibril ${len} cm long is made of sarcomeres joined end to end, each ${s} µm long. About how many sarcomeres are in it? (1 cm = 10 000 µm)</p>`, answer: len * 10000 / s, unit: 'sarcomeres', tol: 0.02,
        hint: 'Length of the myofibril in µm divided by the length of one sarcomere.',
        solution: steps(`${len} cm = ${n(len * 10000)} µm.`, `Number = ${n(len * 10000)} ÷ ${s} = <b>${n(len * 10000 / s)}</b>.`) };
    },
    verify: (x) => (x.len / (x.s * 1e-4)),
  },
  'c11b-loco-shorten': {
    title: 'shortening of a muscle fibre',
    make(r) {
      const len = choose(r, [2, 4, 6, 8]), L0 = choose(r, [2.8, 3.0]), L1 = choose(r, [2.0, 2.2]);
      return { len, L0, L1, q: `<p>A muscle fibre ${len} cm long is made of sarcomeres that are ${L0} µm long at rest. In a contraction each sarcomere shortens to ${L1} µm. By how many millimetres does the fibre shorten?</p>`, answer: len * 10 * (1 - L1 / L0), unit: 'mm', tol: 0.02,
        hint: 'The fibre shortens by the same fraction as each sarcomere.',
        solution: steps(`Fraction shortened = (${L0} − ${L1}) ÷ ${L0} = ${n((L0 - L1) / L0)}.`, `Fibre length = ${len * 10} mm, so it shortens by ${n(len * 10)} × ${n((L0 - L1) / L0)} = <b>${n(len * 10 * (1 - L1 / L0))} mm</b>.`) };
    },
    verify: (x) => (x.len * 1e4 / x.L0) * (x.L0 - x.L1) / 1000,
  },
  'c11b-loco-bone': {
    title: 'age when bone mass falls below the danger line',
    make(r) {
      const rate = choose(r, [0.4, 0.5, 0.6, 0.75, 1.0]);
      return { rate, q: `<p>Bone mass peaks at 100 % at age 30 and then falls by ${rate} percentage points every year. At what age does it fall below 70 %, the level that is called osteoporosis?</p>`, answer: 30 + 30 / rate, unit: 'years', tol: 0.01,
        hint: 'How many percentage points must be lost (100 − 70), and in how many years at this rate?',
        solution: steps('Loss needed = 100 − 70 = 30 points.', `Years = 30 ÷ ${rate} = ${n(30 / rate)}.`, `Age = 30 + ${n(30 / rate)} = <b>${n(30 + 30 / rate)} years</b>.`) };
    },
    verify: (x) => 30 + (100 - 70) * (1 / x.rate),
  },
};

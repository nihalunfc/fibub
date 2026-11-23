// Class 8 Science (Curiosity), Chapter 7 Particulate Nature of Matter: live problems (original fibub questions). Ids start with c8s-part-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c8s-part-gap': {
    title: 'volume lost when particles fill gaps',
    make(r) {
      const V1 = choose(r, [50, 100, 200]), V2 = choose(r, [50, 100]), g = choose(r, [10, 12, 15, 18, 20]), V3 = V1 + V2 - g;
      return { V1, V2, g, q: `<p>${V1} mL of marbles and ${V2} mL of sand are poured into one measuring jar. The total volume reads ${V3} mL. By how many mL is the total less than ${V1 + V2} mL? (This is the volume of gaps the sand filled.)</p>`, answer: V1 + V2 - V3, unit: 'mL', tol: 0.01,
        hint: 'Subtract the final volume from the sum of the two separate volumes.', solution: steps(`Separate volumes added: ${V1} + ${V2} = ${V1 + V2} mL.`, `Volume lost = ${V1 + V2} − ${V3} = <b>${V1 + V2 - V3} mL</b>: the sand went into the spaces between the marbles.`) };
    },
    verify: (x) => x.g,
  },
  'c8s-part-dilute': {
    title: 'how many times a drop is diluted',
    make(r) {
      const k = choose(r, [2, 3, 4, 5, 6]), answer = Math.pow(10, k);
      return { k, q: `<p>A drop of ink is mixed into water and ${k} times in a row the mixture is diluted by taking 1 part and adding 9 parts of fresh water (each step makes it 10 times weaker). The ink is still faintly visible. By what factor is the original ink now diluted?</p>`, answer, unit: 'times', tol: 0.01,
        hint: 'Each step multiplies the dilution by 10.', solution: steps(`Each step: 10 times. After ${k} steps: 10 × 10 × ... (${k} times).`, `= 10<sup>${k}</sup> = <b>${n(answer, 8)} times</b>. Ink particles are so tiny that even this still has some.`) };
    },
    verify: (x) => +('1' + '0'.repeat(x.k)),
  },
  'c8s-part-scale': {
    title: 'how many particles fit along a line',
    make(r) {
      const d = choose(r, [0.2, 0.25, 0.4, 0.5]), answer = 1e-3 / (d * 1e-9);
      return { d, q: `<p>A water molecule is about ${d} nm wide (1 nm = 10⁻⁹ m). How many such molecules would fit side by side along a line 1 mm (10⁻³ m) long?</p>`, answer, unit: 'molecules', tol: 0.02,
        hint: 'Number = length of the line ÷ width of one molecule. Use the same unit for both.', solution: steps(`1 mm = 10⁻³ m; ${d} nm = ${d} × 10⁻⁹ m.`, `Number = 10⁻³ ÷ (${d} × 10⁻⁹) = <b>${n(answer, 3)}</b>.`) };
    },
    verify: (x) => 1e6 / x.d,
  },
  'c8s-part-smell': {
    title: 'speed of a spreading smell',
    make(r) {
      const d = pick(r, 2, 8, 1), t = choose(r, [10, 20, 25, 40]), answer = d / t;
      return { d, t, q: `<p>A strong smell of perfume spreads by diffusion and reaches a student ${d} m away after ${t} s. What is the average speed at which the smell spreads?</p>`, answer, unit: 'm/s', tol: 0.01,
        hint: 'Speed = distance ÷ time.', solution: steps(`v = d ÷ t = ${d} ÷ ${t}.`, `= <b>${n(answer, 3)} m/s</b>. (Gas particles actually move much faster, but keep bumping into air particles, so the smell spreads slowly.)`) };
    },
    verify: (x) => x.d * (1 / x.t),
  },
};

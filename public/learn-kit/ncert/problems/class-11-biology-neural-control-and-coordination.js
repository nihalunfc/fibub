// Class 11 Biology, Neural Control and Coordination: live problems (original fibub questions). Ids start with c11b-neural-.
import { choose, n, steps } from './_util.js';

export default {
  'c11b-neural-speed': {
    title: 'time for an impulse to travel along a nerve',
    make(r) {
      const v = choose(r, [50, 80, 100, 120]), L = choose(r, [0.5, 0.8, 1.0, 1.2, 1.5]);
      return { v, L, q: `<p>A myelinated motor neuron conducts impulses at ${v} m/s. How long, in milliseconds, does an impulse take to travel along a ${L} m long axon from the spinal cord toward the foot?</p>`, answer: L / v * 1000, unit: 'ms', tol: 0.02,
        hint: 'time = distance ÷ speed. Convert seconds to milliseconds at the end.',
        solution: steps(`t = ${L} m ÷ ${v} m/s = ${n(L / v, 4)} s.`, `In milliseconds: <b>${n(L / v * 1000)} ms</b>.`) };
    },
    verify: (x) => (x.L * 100) / (x.v * 100) * 1e3,
  },
  'c11b-neural-sum': {
    title: 'adding excitatory and inhibitory signals',
    make(r) {
      const e = choose(r, [3, 4, 5]), k = choose(r, [3, 4, 5, 6]), i = choose(r, [2, 3, 4]), j = choose(r, [1, 2]);
      return { e, k, i, j, q: `<p>A neuron rests at −70 mV. It receives ${k} excitatory signals of +${e} mV each and ${j} inhibitory signal${j > 1 ? 's' : ''} of −${i} mV each at the same moment. What is the membrane potential after adding them up? (The threshold is −55 mV.)</p>`, answer: -70 + k * e - j * i, unit: 'mV', tol: 0.01, abs: 0.5,
        hint: 'Add all the excitatory changes, subtract the inhibitory ones, and add the result to −70.',
        solution: steps(`Excitatory: ${k} × ${e} = ${k * e} mV. Inhibitory: ${j} × ${i} = ${j * i} mV.`, `Net change = ${k * e} − ${j * i} = ${k * e - j * i} mV.`, `Potential = −70 + ${k * e - j * i} = <b>${-70 + k * e - j * i} mV</b>. ${-70 + k * e - j * i >= -55 ? 'This reaches the threshold: an action potential fires.' : 'This is below the threshold: no action potential.'}`) };
    },
    verify: (x) => (x.k * x.e - x.j * x.i) - 70,
  },
  'c11b-neural-reaction': {
    title: 'reaction time from the ruler-drop test',
    make(r) {
      const d = choose(r, [10, 12, 15, 18, 20, 25]);
      return { d, q: `<p>In a ruler-drop test a friend drops a ruler and you catch it after it has fallen ${d} cm. Taking g = 9.8 m/s², what is your reaction time? (The ruler falls from rest: d = ½ g t².)</p>`, answer: Math.sqrt(2 * d / 100 / 9.8) * 1000, unit: 'ms', tol: 0.02,
        hint: 'Rearrange d = ½ g t² to t = √(2d/g), with d in metres.',
        solution: steps(`d = ${d / 100} m.`, `t = √(2 × ${d / 100} ÷ 9.8) = √${n(2 * d / 100 / 9.8, 4)} = ${n(Math.sqrt(2 * d / 100 / 9.8), 3)} s.`, `<b>${n(Math.sqrt(2 * d / 100 / 9.8) * 1000)} ms</b>. The brain, spinal cord and muscles together take roughly this long.`) };
    },
    verify: (x) => Math.sqrt(2 * 9.8 * x.d / 100) / 9.8 * 1000,
  },
  'c11b-neural-threshold': {
    title: 'stimulus needed to reach the threshold',
    make(r) {
      const rest = choose(r, [-72, -70, -68, -65]), thr = choose(r, [-55, -52, -50]);
      return { rest, thr, q: `<p>A neuron has a resting potential of ${rest} mV and a threshold of ${thr} mV. By how many millivolts must a stimulus depolarise the membrane to fire an action potential?</p>`, answer: thr - rest, unit: 'mV', tol: 0.01,
        hint: 'How far is the threshold above the resting value?',
        solution: steps(`Difference = ${thr} − (${rest}) = <b>${thr - rest} mV</b>.`) };
    },
    verify: (x) => Math.abs(x.rest) - Math.abs(x.thr),
  },
};

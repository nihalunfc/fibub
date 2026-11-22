// Class 10 Science, Magnetic Effects of Electric Current: live problems (original fibub questions). Ids start with c10s-mag-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c10s-mag-force': {
    title: 'force on a current-carrying conductor',
    make(r) {
      const B = choose(r, [0.1, 0.2, 0.25, 0.4, 0.5, 0.8]), I = pick(r, 1, 12), L = choose(r, [0.05, 0.1, 0.2, 0.25, 0.5]), answer = B * I * L;
      return { B, I, L, q: `<p>A straight wire ${n(L * 100)} cm long carries a current of ${I} A at right angles to a uniform magnetic field of ${n(B)} T. What is the force on the wire?</p>`, answer, unit: 'N', tol: 0.01,
        hint: 'The force on a conductor at right angles to the field is F = B I L, with L in metres.',
        solution: steps(`L = ${n(L * 100)} cm = ${n(L)} m.`, `F = B I L = ${n(B)} × ${I} × ${n(L)}.`, `F = <b>${n(answer)} N</b>. Fleming’s left-hand rule gives its direction.`) };
    },
    verify: (x) => x.I * x.L * x.B,
  },
  'c10s-mag-wire': {
    title: 'strength of the field near a straight wire',
    make(r) {
      const I = pick(r, 1, 20), rcm = choose(r, [1, 2, 4, 5, 10]), answer = (2e-7 * I) / (rcm / 100) * 1e6;
      return { I, rcm, q: `<p>A long straight wire carries a current of ${I} A. The magnetic field at a distance of ${rcm} cm from it is B = (2 × 10<sup>−7</sup> × I) / r (B in tesla, r in metres). Find B in microtesla (µT). For comparison, the Earth’s field is about 50 µT.</p>`, answer, unit: 'µT', tol: 0.01,
        hint: 'Change r to metres first. 1 T = 10<sup>6</sup> µT.',
        solution: steps(`r = ${rcm} cm = ${n(rcm / 100)} m.`, `B = 2 × 10<sup>−7</sup> × ${I} ÷ ${n(rcm / 100)} = ${n(answer / 1e6)} T.`, `B = <b>${n(answer)} µT</b>.`) };
    },
    verify: (x) => (0.2 * x.I) / (x.rcm / 100) / 1,
  },
  'c10s-mag-freq': {
    title: 'frequency of an alternating current from the turning speed',
    make(r) {
      const rpm = choose(r, [600, 900, 1200, 1500, 1800, 3000]), ask = choose(r, ['f', 'T']), f = rpm / 60;
      if (ask === 'f') return { rpm, ask, q: `<p>The coil of a simple AC generator turns ${rpm} times every minute. What is the frequency of the alternating current it produces (one cycle per turn)?</p>`, answer: f, unit: 'Hz', tol: 0.01,
        hint: 'Frequency is cycles per second. Change turns per minute to turns per second.', solution: steps(`${rpm} turns per minute = ${rpm} ÷ 60 turns per second.`, `f = <b>${n(f)} Hz</b>.`) };
      return { rpm, ask, q: `<p>The coil of a simple AC generator turns ${rpm} times every minute. How long does one complete cycle of the current take, in milliseconds?</p>`, answer: 1000 / f, unit: 'ms', tol: 0.01,
        hint: 'Time for one cycle (period) T = 1/f. First find f in hertz.', solution: steps(`f = ${rpm}/60 = ${n(f)} Hz.`, `T = 1/f = ${n(1 / f, 4)} s = <b>${n(1000 / f)} ms</b>.`) };
    },
    verify: (x) => (x.ask === 'f' ? x.rpm / 60 : (1000 * 60) / x.rpm),
  },
  'c10s-mag-current': {
    title: 'total current drawn by appliances at home',
    make(r) {
      const a = choose(r, [60, 75, 100, 150]), b = choose(r, [500, 800, 1000, 1200]), c = choose(r, [1500, 2000, 2500]), answer = (a + b + c) / 230;
      return { a, b, c, q: `<p>In a house with a 230 V supply a ${a} W fan, a ${b} W iron and a ${c} W geyser are all switched on together. What total current do they draw from the supply?</p>`, answer, unit: 'A', tol: 0.01,
        hint: 'They are in parallel, so the currents add. For each appliance I = P/V. Or add the powers first.',
        solution: steps(`Total power = ${a} + ${b} + ${c} = ${a + b + c} W.`, `I = P/V = ${a + b + c} ÷ 230 = <b>${n(answer)} A</b>.`) };
    },
    verify: (x) => x.a / 230 + x.b / 230 + x.c / 230,
  },
  'c10s-mag-fuse': {
    title: 'choosing a fuse rating',
    make(r) {
      const P = choose(r, [400, 750, 1000, 1500, 2000, 2800]), I = P / 230, ratings = [1, 2, 3, 5, 10, 13, 15, 16, 20, 32], answer = ratings.find((x) => x > I);
      return { P, I, q: `<p>An appliance rated ${P} W works on a 230 V supply. Which is the smallest standard fuse (1, 2, 3, 5, 10, 13, 15, 16, 20 or 32 A) that is safe to use with it?</p>`, answer, unit: 'A', tol: 0.001,
        hint: 'Find the working current I = P/V. The fuse must be rated just above it, so that it does not blow in normal use but does when the current is too high.',
        solution: steps(`I = P/V = ${P} ÷ 230 = ${n(I)} A.`, `The smallest standard rating above ${n(I)} A is <b>${answer} A</b>.`) };
    },
    verify: (x) => [1, 2, 3, 5, 10, 13, 15, 16, 20, 32].filter((f) => f > x.P / 230)[0],
  },
};

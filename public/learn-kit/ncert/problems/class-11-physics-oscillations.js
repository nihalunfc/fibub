// Class 11 Physics, Oscillations: live problems (original fibub questions). Ids start with c11p-osc-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c11p-osc-period': {
    title: 'time period of a spring-mass system',
    make(r) {
      const mass = choose(r, [0.1, 0.2, 0.25, 0.5, 1, 2]), k = choose(r, [20, 50, 80, 100, 200]), T = 2 * Math.PI * Math.sqrt(mass / k);
      return { mass, k, q: `<p>A ${mass} kg block is attached to a spring of stiffness ${k} N/m on a smooth table and set oscillating. Find the time period in seconds.</p>`, answer: T, unit: 's', tol: 0.01,
        hint: 'T = 2π√(m/k).',
        solution: steps(`T = 2π √(m/k) = 2π √(${mass}/${k}).`, `√(${mass / k}) = ${n(Math.sqrt(mass / k))}, so T = <b>${n(T)} s</b>.`) };
    },
    verify: (x) => { const w = Math.sqrt(x.k / x.mass); return 2 * Math.PI / w; },
  },
  'c11p-osc-series': {
    title: 'two springs in series or parallel',
    make(r) {
      const how = choose(r, ['series', 'parallel']), k = choose(r, [40, 60, 100, 120]), mass = choose(r, [0.2, 0.4, 0.5, 1]), ke = how === 'series' ? k / 2 : 2 * k, T = 2 * Math.PI * Math.sqrt(mass / ke);
      return { how, k, mass, q: `<p>Two identical springs, each of stiffness ${k} N/m, are joined in ${how} and carry a ${mass} kg block. Find the time period of its oscillation in seconds.</p>`, answer: T, unit: 's', tol: 0.01,
        hint: 'Series: 1/k_eff = 1/k + 1/k. Parallel: k_eff = k + k. Then T = 2π√(m/k_eff).',
        solution: steps(`k<sub>eff</sub> = ${how === 'series' ? `k/2 = ${k / 2}` : `2k = ${2 * k}`} N/m.`, `T = 2π √(${mass}/${ke}) = <b>${n(T)} s</b>.`) };
    },
    verify: (x) => { const ke = x.how === 'series' ? 1 / (1 / x.k + 1 / x.k) : x.k + x.k; return 2 * Math.PI / Math.sqrt(ke / x.mass); },
  },
  'c11p-osc-pendulum': {
    title: 'simple pendulum',
    make(r) {
      const L = choose(r, [0.25, 0.5, 1, 1.5, 2, 4]), g = 9.8, T = 2 * Math.PI * Math.sqrt(L / g);
      return { L, q: `<p>Find the time period of a simple pendulum of length ${L} m (small swings, g = 9.8 m/s²), in seconds.</p>`, answer: T, unit: 's', tol: 0.01,
        hint: 'T = 2π√(L/g). The mass of the bob does not matter.',
        solution: steps(`T = 2π √(${L}/9.8) = 2π × ${n(Math.sqrt(L / 9.8))}.`, `T = <b>${n(T)} s</b>.`) };
    },
    verify: (x) => 2 * Math.PI / Math.sqrt(9.8 / x.L),
  },
  'c11p-osc-g': {
    title: 'finding g from a pendulum',
    make(r) {
      const L = choose(r, [0.5, 0.8, 1, 1.2]), cnt = choose(r, [10, 20, 25]), time = +(cnt * 2 * Math.PI * Math.sqrt(L / 9.8)).toFixed(1);
      return { L, cnt, time, q: `<p>A student times ${cnt} complete swings of a ${L} m simple pendulum and gets ${time} s. Find g in m/s².</p>`, answer: 4 * Math.PI ** 2 * L / (time / cnt) ** 2, unit: 'm/s²', tol: 0.02,
        hint: 'T = time ÷ number of swings, and g = 4π²L/T².',
        solution: steps(`T = ${time}/${cnt} = ${n(time / cnt)} s.`, `g = 4π²L/T² = <b>${n(4 * Math.PI ** 2 * L / (time / cnt) ** 2)} m/s²</b>.`) };
    },
    verify: (x) => { const w = 2 * Math.PI * x.cnt / x.time; return w * w * x.L; },
  },
  'c11p-osc-vmax': {
    title: 'maximum speed and acceleration in SHM',
    make(r) {
      const A = choose(r, [2, 3, 4, 5, 10]), T = choose(r, [0.5, 1, 2, 4]), vm = 2 * Math.PI / T * A / 100, ask = choose(r, ['speed', 'acceleration']), am = (2 * Math.PI / T) ** 2 * A / 100;
      return { A, T, ask, q: `<p>A particle performs SHM with amplitude ${A} cm and time period ${T} s. Find its maximum ${ask} (${ask === 'speed' ? 'in m/s' : 'in m/s²'}).</p>`, answer: ask === 'speed' ? vm : am, unit: ask === 'speed' ? 'm/s' : 'm/s²', tol: 0.01,
        hint: `ω = 2π/T. Maximum speed = ωA at the middle; maximum acceleration = ω²A at the ends.`,
        solution: steps(`ω = 2π/${T} = ${n(2 * Math.PI / T)} rad/s, A = ${A / 100} m.`, ask === 'speed' ? `v<sub>max</sub> = ωA = <b>${n(vm)} m/s</b>.` : `a<sub>max</sub> = ω²A = <b>${n(am)} m/s²</b>.`) };
    },
    verify: (x) => { const f = 1 / x.T, A = x.A / 100; return x.ask === 'speed' ? 2 * Math.PI * f * A : (2 * Math.PI * f) ** 2 * A; },
  },
  'c11p-osc-ke': {
    title: 'kinetic energy at a given displacement',
    make(r) {
      const k = choose(r, [50, 100, 200, 400]), A = choose(r, [0.1, 0.2, 0.3]), f = choose(r, [0.5, 0.6, 0.8]), x = +(A * f).toFixed(3), K = 0.5 * k * (A * A - x * x);
      return { k, A, x, q: `<p>A block on a spring of stiffness ${k} N/m oscillates with amplitude ${A} m. Find its kinetic energy (in J) when it is ${x} m from the middle.</p>`, answer: K, unit: 'J', tol: 0.01,
        hint: 'Total energy E = ½kA² and potential energy ½kx², so K = ½k(A² − x²).',
        solution: steps(`E = ½ × ${k} × ${A}² = ${n(0.5 * k * A * A)} J, U = ½ × ${k} × ${x}² = ${n(0.5 * k * x * x)} J.`, `K = E − U = <b>${n(K)} J</b>.`) };
    },
    verify: (z) => 0.5 * z.k * z.A * z.A - 0.5 * z.k * z.x * z.x,
  },
  'c11p-osc-x': {
    title: 'position at a given time',
    make(r) {
      const A = choose(r, [4, 6, 8, 10]), T = choose(r, [2, 4, 6, 12]), t = choose(r, [0.5, 1, 1.5, 2]), x = A * Math.cos(2 * Math.PI * t / T);
      return { A, T, t, q: `<p>A particle in SHM starts from the positive extreme with amplitude ${A} cm and period ${T} s. Find its displacement (in cm, sign included) at t = ${t} s.</p>`, answer: x, abs: 0.02, unit: 'cm', tol: 0.01,
        hint: 'Starting at the extreme: x = A cos(ωt), with ω = 2π/T. Use radians.',
        solution: steps(`ω = 2π/${T} = ${n(2 * Math.PI / T)} rad/s, so ωt = ${n(2 * Math.PI * t / T)} rad.`, `x = ${A} cos(${n(2 * Math.PI * t / T)}) = <b>${n(x)} cm</b>.`) };
    },
    verify: (z) => z.A * Math.sin(Math.PI / 2 - (2 * Math.PI * z.t) / z.T),
  },
  'c11p-osc-damp': {
    title: 'amplitude of a damped oscillator',
    make(r) {
      const A0 = choose(r, [4, 5, 8, 10]), b = choose(r, [0.1, 0.2, 0.3]), mass = choose(r, [0.5, 1]), t = choose(r, [5, 10, 20]), A = A0 * Math.exp(-b * t / (2 * mass));
      return { A0, b, mass, t, q: `<p>A damped oscillator of mass ${mass} kg and damping constant ${b} kg/s starts with amplitude ${A0} cm. Find its amplitude after ${t} s (in cm). The amplitude falls as A₀e<sup>−bt/2m</sup>.</p>`, answer: A, unit: 'cm', tol: 0.01,
        hint: 'Put b, m, t into the exponent −bt/(2m).',
        solution: steps(`Exponent = −${b} × ${t} / (2 × ${mass}) = ${n(-b * t / (2 * mass))}.`, `A = ${A0} × e<sup>${n(-b * t / (2 * mass))}</sup> = <b>${n(A)} cm</b>.`) };
    },
    verify: (z) => z.A0 / Math.exp((z.b / (2 * z.mass)) * z.t),
  },
};

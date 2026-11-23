// Class 11 Maths, Trigonometric Functions: live problems (original fibub questions). Ids start with c11m-trig-.
import { pick, choose, n, steps } from './_util.js';

const TRI = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]];
export default {
  'c11m-trig-radians': {
    title: 'degrees to radians (multiples of π)',
    make(r) {
      const d = choose(r, [15, 20, 24, 30, 36, 40, 45, 50, 72, 75, 105, 120, 135, 150, 225, 240, 300]), answer = d / 180;
      return { d, q: `<p>Write <b>${d}°</b> in radians as a multiple of π. Enter the coefficient (for example, for 3π/4 enter 0.75).</p>`, answer, unit: '', tol: 0.005,
        hint: '180° = π radians, so multiply the degrees by π/180.',
        solution: steps(`${d}° = ${d} × π/180 = ${d}π/180.`, `As a decimal multiple of π: <b>${n(answer, 4)}</b>.`) };
    },
    verify(x) { return ((x.d * Math.PI) / 180) / Math.PI; },
  },
  'c11m-trig-arc': {
    title: 'arc length from an angle',
    make(r) {
      const rad = pick(r, 4, 30), d = choose(r, [30, 45, 60, 72, 90, 120, 150, 210]), answer = (rad * d * Math.PI) / 180;
      return { rad, d, q: `<p>A cricket boundary rope is a circle arc of radius <b>${rad} m</b>. A fielder runs along it through an angle of <b>${d}°</b> at the centre. How long (in metres) is the arc? (Give 2 decimals.)</p>`, answer, unit: 'm', tol: 0.005,
        hint: 'Change the angle to radians (× π/180), then use s = rθ.',
        solution: steps(`θ = ${d} × π/180 = ${n((d * Math.PI) / 180, 4)} rad.`, `s = rθ = ${rad} × ${n((d * Math.PI) / 180, 4)} = <b>${n(answer, 4)} m</b>.`) };
    },
    verify(x) { return (x.d / 360) * 2 * Math.PI * x.rad; },
  },
  'c11m-trig-value': {
    title: 'a trigonometric value in any quadrant',
    make(r) {
      const T = [[30, 'sin', 0.5, '1/2'], [45, 'sin', Math.SQRT1_2, '√2/2'], [60, 'sin', Math.sqrt(3) / 2, '√3/2'], [30, 'cos', Math.sqrt(3) / 2, '√3/2'], [60, 'cos', 0.5, '1/2'], [45, 'tan', 1, '1'], [60, 'tan', Math.sqrt(3), '√3']];
      const [ref, fn, , ] = choose(r, T), k = pick(r, 1, 5), ang = [ref + 0, 180 - ref, 180 + ref, 360 - ref, 360 + ref + 0][k - 1], answer = Math.round(Math[fn]((ang * Math.PI) / 180) * 1e6) / 1e6;
      return { fn, ang, q: `<p>Find the value of ${fn} <b>${ang}°</b> to 3 decimal places.</p>`, answer, unit: '', tol: 0.003, abs: 0.002,
        hint: 'Find the reference angle (the acute angle to the x-axis), take its value, then fix the sign with All-Silver-Tea-Cups.',
        solution: steps(`${ang}° lies in quadrant ${ang % 360 < 90 ? 'I' : ang % 360 < 180 ? 'II' : ang % 360 < 270 ? 'III' : 'IV'}, with reference angle ${ref}°.`, `${fn} ${ang}° = <b>${n(answer, 4)}</b>.`) };
    },
    verify(x) { return Math[x.fn]((x.ang * Math.PI) / 180); },
  },
  'c11m-trig-compound': {
    title: 'sin(A + B) from two right triangles',
    make(r) {
      const [a, b, c] = choose(r, TRI), [d, e, f] = choose(r, TRI), answer = (a / c) * (e / f) + (b / c) * (d / f);
      return { a, b, c, d, e, f, q: `<p>A and B are acute angles with sin A = ${a}/${c} and sin B = ${d}/${f}. Find sin(A + B) to 3 decimal places.</p>`, answer, unit: '', tol: 0.003,
        hint: 'Find cos A and cos B from the right triangles (Pythagoras), then use sin(A + B) = sin A cos B + cos A sin B.',
        solution: steps(`cos A = ${b}/${c}, cos B = ${e}/${f}.`, `sin(A + B) = (${a}/${c})(${e}/${f}) + (${b}/${c})(${d}/${f}) = <b>${n(answer, 4)}</b>.`) };
    },
    verify(x) { return Math.sin(Math.asin(x.a / x.c) + Math.asin(x.d / x.f)); },
  },
  'c11m-trig-double': {
    title: 'sin 2θ from tan θ',
    make(r) {
      const t = pick(r, 1, 9) / pick(r, 1, 4), answer = (2 * t) / (1 + t * t), tt = +t.toFixed(4);
      return { t, tt, q: `<p>If tan θ = ${n(tt, 4)} and θ is acute, find sin 2θ to 3 decimal places.</p>`, answer, unit: '', tol: 0.003,
        hint: 'sin 2θ = 2 sin θ cos θ = 2 tan θ / (1 + tan²θ).',
        solution: steps(`sin 2θ = 2t / (1 + t²) with t = ${n(tt, 4)}.`, `= ${n(2 * t, 4)} / ${n(1 + t * t, 4)} = <b>${n(answer, 4)}</b>.`) };
    },
    verify(x) { return Math.sin(2 * Math.atan(x.t)); },
  },
  'c11m-trig-smallest': {
    title: 'smallest positive solution in degrees',
    make(r) {
      const T = [['sin', 0.5, '1/2', 30], ['sin', Math.SQRT1_2, '√2/2', 45], ['sin', Math.sqrt(3) / 2, '√3/2', 60], ['cos', 0.5, '1/2', 60], ['cos', Math.SQRT1_2, '√2/2', 45], ['cos', Math.sqrt(3) / 2, '√3/2', 30], ['cos', -0.5, '−1/2', 120], ['sin', -0.5, '−1/2', 210]];
      const [fn, v, s, answer] = choose(r, T);
      return { fn, v, s, q: `<p>Find the smallest positive angle (in degrees) with ${fn} θ = ${s}.</p>`, answer, unit: '°', tol: 0, abs: 0.5,
        hint: 'Remember the exact values at 30°, 45°, 60°, and use the quadrant signs for negative values.',
        solution: steps(`${fn} θ = ${s}.`, `The smallest positive angle is <b>${answer}°</b>.`) };
    },
    verify(x) { for (let d = 1; d <= 360; d++) if (Math.abs(Math[x.fn]((d * Math.PI) / 180) - x.v) < 1e-9) return d; return NaN; },
  },
  'c11m-trig-wheel': {
    title: 'angular speed of a wheel',
    make(r) {
      const rpm = pick(r, 30, 300, 15), answer = (rpm * 2 * Math.PI) / 60;
      return { rpm, q: `<p>A ceiling fan turns at <b>${rpm} revolutions per minute</b>. What is its angular speed in radians per second? (2 decimals)</p>`, answer, unit: 'rad/s', tol: 0.005,
        hint: 'One revolution is 2π radians; one minute is 60 seconds.',
        solution: steps(`${rpm} rev/min = ${rpm} × 2π rad per 60 s.`, `= <b>${n(answer, 4)} rad/s</b>.`) };
    },
    verify(x) { return (x.rpm / 60) * Math.PI * 2; },
  },
};

// Class 11 Physics, System of Particles and Rotational Motion: live problems (original fibub questions). Ids start with c11p-rot-.
import { pick, choose, n, steps } from './_util.js';

const SH = [['ring', 1], ['solid disc', 1 / 2], ['solid sphere', 2 / 5], ['hollow sphere', 2 / 3]];

export default {
  'c11p-rot-com': {
    title: 'centre of mass of two masses',
    make(r) {
      const m1 = pick(r, 1, 6, 1), m2 = pick(r, 2, 9, 1), d = pick(r, 2, 10, 1), X = m2 * d / (m1 + m2);
      return { m1, m2, d, q: `<p>A ${m1} kg ball and a ${m2} kg ball are joined by a light rod ${d} m long. How far is the centre of mass from the ${m1} kg ball?</p>`, answer: X, unit: 'm', tol: 0.01,
        hint: 'Take the lighter ball as the origin: X = (m₁ × 0 + m₂ d)/(m₁ + m₂).',
        solution: steps(`With the ${m1} kg ball at x = 0 and the ${m2} kg ball at x = ${d} m: X = (${m1}×0 + ${m2}×${d})/(${m1} + ${m2}).`, `X = ${m2 * d}/${m1 + m2} = <b>${n(X)} m</b> from the ${m1} kg ball (closer to the heavier one).`) };
    },
    verify: (x) => x.d - x.m1 * x.d / (x.m1 + x.m2),
  },
  'c11p-rot-torque': {
    title: 'torque of a force on a spanner',
    make(r) {
      const F = pick(r, 20, 100, 10), L = choose(r, [0.15, 0.2, 0.25, 0.3, 0.4]), th = choose(r, [30, 45, 60, 90]), tau = F * L * Math.sin(th * Math.PI / 180);
      return { F, L, th, q: `<p>A force of ${F} N is applied at the end of a ${L * 100} cm spanner, at ${th}° to the spanner. Find the torque about the nut.</p>`, answer: tau, unit: 'N m', tol: 0.01,
        hint: 'τ = r F sin θ, with r in metres.',
        solution: steps(`τ = r F sin θ = ${L} × ${F} × sin ${th}°.`, `sin ${th}° = ${n(Math.sin(th * Math.PI / 180))}, so τ = <b>${n(tau)} N m</b>.`) };
    },
    verify: (x) => { const Fperp = x.F * Math.sin(x.th * Math.PI / 180); return Fperp * x.L; },
  },
  'c11p-rot-lever': {
    title: 'balancing a see-saw',
    make(r) {
      const m1 = pick(r, 20, 60, 10), d1 = pick(r, 1, 3, 0.5), m2 = choose(r, [15, 25, 30, 40]), d2 = m1 * d1 / m2;
      return { m1, d1, m2, q: `<p>A ${m1} kg child sits ${d1} m from the pivot of a light see-saw. Where must a ${m2} kg child sit on the other side, measured from the pivot, to balance it?</p>`, answer: d2, unit: 'm', tol: 0.01,
        hint: 'Principle of moments: m₁ d₁ = m₂ d₂.',
        solution: steps(`${m1} × ${d1} = ${m2} × d₂.`, `d₂ = ${n(m1 * d1)} / ${m2} = <b>${n(d2)} m</b>.`) };
    },
    verify: (x) => { const t = x.m1 * 9.8 * x.d1; return t / (x.m2 * 9.8); },
  },
  'c11p-rot-moi': {
    title: 'moment of inertia about a shifted axis',
    make(r) {
      const sh = choose(r, SH), M = pick(r, 1, 10, 1), R = choose(r, [0.2, 0.3, 0.5]), d = choose(r, [0.1, 0.2, 0.4]), I = sh[1] * M * R * R + M * d * d;
      return { M, R, d, c: sh[1], q: `<p>A ${sh[0]} of mass ${M} kg and radius ${R} m is made to turn about an axis parallel to its standard axis (for the discs and rings, perpendicular to the plane through the centre; for spheres, a diameter) but ${d} m away from the centre. Find the moment of inertia about this shifted axis.</p>`, answer: I, unit: 'kg m²', tol: 0.01,
        hint: 'Parallel-axis theorem: I = I_cm + M d².',
        solution: steps(`I_cm for a ${sh[0]} = ${n(sh[1])} M R² = ${n(sh[1] * M * R * R)} kg m².`, `I = I_cm + M d² = ${n(sh[1] * M * R * R)} + ${M} × ${d}² = <b>${n(I)} kg m²</b>.`) };
    },
    verify: (x) => x.M * (x.c * x.R * x.R + x.d * x.d),
  },
  'c11p-rot-alpha': {
    title: 'spinning up a flywheel',
    make(r) {
      const I = choose(r, [0.5, 1, 2, 4]), tau = pick(r, 2, 20, 2), t = pick(r, 2, 10, 1), w = tau / I * t;
      return { I, tau, t, q: `<p>A flywheel of moment of inertia ${I} kg m² starts from rest and is acted on by a constant torque of ${tau} N m. Find its angular speed after ${t} s.</p>`, answer: w, unit: 'rad/s', tol: 0.01,
        hint: 'α = τ/I, then ω = α t.',
        solution: steps(`α = τ/I = ${tau}/${I} = ${n(tau / I)} rad/s².`, `ω = α t = ${n(tau / I)} × ${t} = <b>${n(w)} rad/s</b>.`) };
    },
    verify: (x) => { const L = x.tau * x.t; return L / x.I; },
  },
  'c11p-rot-skater': {
    title: 'a spinning skater pulls her arms in',
    make(r) {
      const I1 = choose(r, [3, 4, 5, 6]), I2 = choose(r, [1, 1.5, 2]), w1 = pick(r, 2, 6, 1), w2 = I1 * w1 / I2;
      return { I1, I2, w1, q: `<p>A skater spinning at ${w1} rad/s with moment of inertia ${I1} kg m² pulls in her arms so that it becomes ${I2} kg m². What is her new angular speed?</p>`, answer: w2, unit: 'rad/s', tol: 0.01,
        hint: 'No external torque: I₁ω₁ = I₂ω₂.',
        solution: steps(`L = I₁ω₁ = ${I1} × ${w1} = ${n(I1 * w1)} kg m²/s stays constant.`, `ω₂ = L/I₂ = ${n(I1 * w1)}/${I2} = <b>${n(w2)} rad/s</b>.`) };
    },
    verify: (x) => (x.w1 * 2 * Math.PI) / (x.I2 / x.I1) / (2 * Math.PI),
  },
  'c11p-rot-roll': {
    title: 'acceleration of a rolling body on an incline',
    make(r) {
      const sh = choose(r, SH), th = choose(r, [20, 30, 37, 45]), a = 9.8 * Math.sin(th * Math.PI / 180) / (1 + sh[1]);
      return { th, c: sh[1], q: `<p>A ${sh[0]} rolls without slipping down a ${th}° incline. Find the acceleration of its centre (g = 9.8 m/s²).</p>`, answer: a, unit: 'm/s²', tol: 0.01,
        hint: 'a = g sin θ / (1 + I/MR²), with I/MR² = ' + n(sh[1]) + ' for a ' + sh[0] + '.',
        solution: steps(`I/MR² = ${n(sh[1])} for a ${sh[0]}.`, `a = 9.8 sin ${th}° / (1 + ${n(sh[1])}) = ${n(9.8 * Math.sin(th * Math.PI / 180))} / ${n(1 + sh[1])} = <b>${n(a)} m/s²</b>.`) };
    },
    verify: (x) => { const k = x.c, f = 9.8 * Math.sin(x.th * Math.PI / 180) * 1; const m = 1, I = k, F = f; return F / (m + I); },
  },
};

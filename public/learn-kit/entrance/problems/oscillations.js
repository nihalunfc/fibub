// Live problems for Oscillations and simple harmonic motion.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const G = 9.8;

export default {
  'osc-speed-at-x': {
    title: 'speed in SHM at a given displacement',
    make(r) {
      const A = pick(r, 5, 20, 1), T = pick(r, 0.5, 4, 0.5), f = [0.25, 0.4, 0.5, 0.6, 0.8][Math.floor(r() * 5)];
      const x = +(A * f).toFixed(2), w = (2 * Math.PI) / T, answer = w * Math.sqrt(A * A - x * x);
      return { A, T, x,
        q: `<p>A particle moves in simple harmonic motion with amplitude ${A} cm and period ${T} s. What is its speed when it is ${x} cm from the centre, in cm/s?</p>`,
        answer, unit: 'cm/s', tol: 0.01,
        hint: 'v = ω√(A² − x²), with ω = 2π/T.',
        solution: steps(`ω = 2π/${T} = ${n(w, 4)} rad/s.`, `√(A² − x²) = √(${A}² − ${x}²) = ${n(Math.sqrt(A * A - x * x), 4)} cm.`, `v = ${n(w, 4)} × ${n(Math.sqrt(A * A - x * x), 4)} = <b>${n(answer)} cm/s</b>.`) };
    },
    verify: (x) => { // energy: ½ m v² = ½ k (A² − x²) with k/m = ω²; or from x = A sin θ, v = Aω cos θ
      const th = Math.asin(x.x / x.A); return x.A * ((2 * Math.PI) / x.T) * Math.cos(th);
    },
  },
  'osc-springs': {
    title: 'period of a block on two springs',
    make(r) {
      const m = pick(r, 0.5, 4, 0.5), k1 = pick(r, 100, 600, 50), k2 = pick(r, 100, 600, 50), ser = r() < 0.5;
      const k = ser ? (k1 * k2) / (k1 + k2) : k1 + k2, answer = 2 * Math.PI * Math.sqrt(m / k);
      return { m, k1, k2, ser,
        q: `<p>A ${m} kg block on a smooth floor is attached to two light springs of spring constants ${k1} N/m and ${k2} N/m ${ser ? 'joined end to end (in series), with the far end fixed to a wall' : 'on either side of it, each fixed to a wall (both act on the block together, in parallel)'}. What is the period of small oscillations?</p>`,
        answer, unit: 's', tol: 0.01,
        hint: ser ? 'In series the same force stretches both springs: 1/k = 1/k₁ + 1/k₂.' : 'Moving the block x stretches one spring and squeezes the other; both forces point back: k = k₁ + k₂.',
        solution: steps(ser ? `k = k₁k₂/(k₁ + k₂) = ${k1} × ${k2}/${k1 + k2} = ${n(k, 4)} N/m.` : `k = k₁ + k₂ = ${k} N/m.`, `T = 2π√(m/k) = 2π√(${m}/${n(k, 4)}).`, `T = <b>${n(answer)} s</b>.`) };
    },
    verify: (x) => { // from the force for a small displacement
      const d = 1e-3; let F;
      if (x.ser) { F = d / (1 / x.k1 + 1 / x.k2); } else F = x.k1 * d + x.k2 * d;
      return 2 * Math.PI * Math.sqrt((x.m * d) / F);
    },
  },
  'osc-pendulum-lift': {
    title: 'pendulum in an accelerating lift',
    make(r) {
      const L = pick(r, 0.5, 2.5, 0.25), a = pick(r, 1, 4, 0.5), up = r() < 0.5;
      const g = up ? G + a : G - a, answer = 2 * Math.PI * Math.sqrt(L / g);
      return { L, a, up,
        q: `<p>A simple pendulum ${L} m long hangs in a lift that is accelerating ${up ? 'upwards' : 'downwards'} at ${a} m/s². What is its period? (g = 9.8 m/s²)</p>`,
        answer, unit: 's', tol: 0.01,
        hint: 'In the lift, the bob feels an effective gravity g_eff = g + a (accelerating up) or g − a (accelerating down). T = 2π√(L/g_eff).',
        solution: steps(`g_eff = 9.8 ${up ? '+' : '−'} ${a} = ${n(g, 4)} m/s².`, `T = 2π√(${L}/${n(g, 4)}).`, `T = <b>${n(answer)} s</b> (${up ? 'shorter' : 'longer'} than ${n(2 * Math.PI * Math.sqrt(L / G))} s at rest).`) };
    },
    verify: (x) => { // scale the period at rest by √(g/g_eff)
      const T0 = 2 * Math.PI * Math.sqrt(x.L / G); return T0 * Math.sqrt(G / (x.up ? G + x.a : G - x.a));
    },
  },
};

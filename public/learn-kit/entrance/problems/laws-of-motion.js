// Live problems for Laws of motion and friction.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const G = 9.8, rad = (d) => (d * Math.PI) / 180;

export default {
  'lom-atwood': {
    title: 'acceleration and tension in an Atwood machine',
    make(r) {
      const m1 = pick(r, 2, 8, 0.5), m2 = +(m1 + pick(r, 0.5, 4, 0.5)).toFixed(1);
      const a = ((m2 - m1) * G) / (m1 + m2), answer = (2 * m1 * m2 * G) / (m1 + m2);
      return { m1, m2,
        q: `<p>Blocks of ${m1} kg and ${m2} kg hang from the two ends of a light string over a smooth, light pulley. What is the tension in the string? (g = 9.8 m/s²)</p>`,
        answer, unit: 'N', tol: 0.01,
        hint: 'Write F = ma for each block with the heavier one going down: m₂g − T = m₂a and T − m₁g = m₁a. Add to get a, then put it back.',
        solution: steps(`Adding the two equations: (m₂ − m₁)g = (m₁ + m₂)a, so a = (${m2} − ${m1}) × 9.8 / ${n(m1 + m2)} = ${n(a)} m/s².`, `Lighter block: T = m₁(g + a) = ${m1} × (9.8 + ${n(a)}).`, `T = <b>${n(answer)} N</b> (the same as 2m₁m₂g/(m₁ + m₂)).`) };
    },
    verify: (x) => x.m2 * (G - ((x.m2 - x.m1) * G) / (x.m1 + x.m2)),
  },
  'lom-incline-friction': {
    title: 'acceleration down a rough incline',
    make(r) {
      const deg = [30, 37, 45, 53, 60][Math.floor(r() * 5)], mu = pick(r, 0.1, 0.4, 0.05);
      const answer = G * (Math.sin(rad(deg)) - mu * Math.cos(rad(deg)));
      return { deg, mu,
        q: `<p>A block is released on a slope inclined at ${deg}° to the horizontal. The coefficient of kinetic friction is ${mu}, and the block slides down. What is its acceleration? (g = 9.8 m/s²)</p>`,
        answer, unit: 'm/s²', tol: 0.01,
        hint: 'Along the slope: mg sin θ pulls down, kinetic friction μN = μ mg cos θ acts up the slope. The mass cancels.',
        solution: steps(`Normal force N = mg cos ${deg}°, so friction = ${mu} mg cos ${deg}°.`, `Net force down the slope = mg(sin ${deg}° − ${mu} cos ${deg}°).`, `a = 9.8 × (${n(Math.sin(rad(deg)))} − ${mu} × ${n(Math.cos(rad(deg)))}) = <b>${n(answer)} m/s²</b>.`) };
    },
    verify: (x) => { const m = 3, N = m * G * Math.cos(rad(x.deg)); return (m * G * Math.sin(rad(x.deg)) - x.mu * N) / m; },
  },
  'lom-banking': {
    title: 'safe speed on a banked road with friction',
    make(r) {
      const R = pick(r, 40, 200, 10), deg = [10, 15, 20, 25, 30][Math.floor(r() * 5)], mu = pick(r, 0.1, 0.4, 0.05);
      const t = Math.tan(rad(deg)), answer = Math.sqrt((R * G * (mu + t)) / (1 - mu * t));
      return { R, deg, mu,
        q: `<p>A curve of radius ${R} m is banked at ${deg}°. The coefficient of friction between the tyres and road is ${mu}. What is the greatest speed at which a car can take the curve without skidding outwards? (g = 9.8 m/s²)</p>`,
        answer, unit: 'm/s', tol: 0.01,
        hint: 'At the top speed, friction acts down the slope. Resolve vertically (balance) and horizontally (= mv²/R). The result is v² = Rg(μ + tan θ)/(1 − μ tan θ).',
        solution: steps(`tan ${deg}° = ${n(t)}.`, `v² = Rg(μ + tan θ)/(1 − μ tan θ) = ${R} × 9.8 × (${mu} + ${n(t)}) / (1 − ${mu} × ${n(t)}) = ${n(answer ** 2, 4)}.`, `v = <b>${n(answer)} m/s</b> (about ${n(answer * 3.6)} km/h).`) };
    },
    verify: (x) => {
      // solve the two force equations directly: N cos θ − f sin θ = mg, N sin θ + f cos θ = mv²/R with f = μN
      const c = Math.cos(rad(x.deg)), s = Math.sin(rad(x.deg)), N = G / (c - x.mu * s);
      return Math.sqrt(x.R * N * (s + x.mu * c));
    },
  },
};

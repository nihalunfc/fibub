// Live problems for Work, energy and power.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const G = 9.8, rad = (d) => (d * Math.PI) / 180;

export default {
  'wep-spring-compress': {
    title: 'how far a moving block squeezes a spring',
    make(r) {
      const m = pick(r, 0.5, 4, 0.5), v = pick(r, 1, 6, 0.5), k = pick(r, 100, 1000, 50);
      const answer = v * Math.sqrt(m / k) * 100;
      return { m, v, k,
        q: `<p>A ${m} kg block slides at ${v} m/s on a smooth floor into a light spring of spring constant ${k} N/m. What is the greatest compression of the spring, in centimetres?</p>`,
        answer, unit: 'cm', tol: 0.01,
        hint: 'All the kinetic energy turns into spring energy at the greatest compression: ½mv² = ½kx².',
        solution: steps(`Kinetic energy = ½ × ${m} × ${v}² = ${n(0.5 * m * v * v)} J.`, `½kx² = ${n(0.5 * m * v * v)}, so x² = ${n(m * v * v / k)} m².`, `x = ${n(answer / 100)} m = <b>${n(answer)} cm</b>.`) };
    },
    verify: (x) => { // a block under F = −kx is SHM with ω = √(k/m); the amplitude is v/ω
      const w = Math.sqrt(x.k / x.m); return (x.v / w) * 100;
    },
  },
  'wep-friction-stop': {
    title: 'stopping distance from the work-energy theorem',
    make(r) {
      const h = pick(r, 1, 5, 0.5), mu = pick(r, 0.1, 0.5, 0.05);
      const answer = h / mu;
      return { h, mu,
        q: `<p>A small block slides from rest down a smooth curved ramp of height ${h} m and then onto a rough horizontal floor with coefficient of kinetic friction ${mu}. How far does it slide on the floor before stopping?</p>`,
        answer, unit: 'm', tol: 0.01,
        hint: 'Work-energy theorem from start to stop: the change in kinetic energy is zero, so mgh − μmg d = 0.',
        solution: steps(`Gravity does work mgh on the ramp; the ramp is smooth, so no loss there.`, `Friction on the floor does work −μmg d.`, `Total work = 0 (it starts and ends at rest): mgh = μmg d, so d = h/μ = ${h}/${mu} = <b>${n(answer)} m</b>. The mass and g cancel.`) };
    },
    verify: (x) => { const v2 = 2 * G * x.h; return v2 / (2 * x.mu * G); },
  },
  'wep-power-incline': {
    title: 'engine power for a car climbing a slope',
    make(r) {
      const m = pick(r, 800, 1600, 100), v = pick(r, 10, 25, 1), sinT = pick(r, 0.02, 0.1, 0.01), f = pick(r, 200, 800, 50);
      const F = m * G * sinT + f, answer = (F * v) / 1000;
      return { m, v, sinT, f,
        q: `<p>A car of mass ${m} kg climbs a slope that rises 1 m for every ${n(1 / sinT)} m of road (sin θ = ${sinT}) at a steady ${v} m/s. Air and road resistance add up to ${f} N. What power must the engine deliver, in kW? (g = 9.8 m/s²)</p>`,
        answer, unit: 'kW', tol: 0.01,
        hint: 'At steady speed the driving force balances the downhill part of gravity plus resistance. Power = force × velocity.',
        solution: steps(`Downhill pull = mg sin θ = ${m} × 9.8 × ${sinT} = ${n(m * G * sinT, 4)} N.`, `Driving force = ${n(m * G * sinT, 4)} + ${f} = ${n(F, 4)} N.`, `P = Fv = ${n(F, 4)} × ${v} = ${n(answer * 1000, 4)} W = <b>${n(answer)} kW</b>.`) };
    },
    verify: (x) => { // energy per second: rise in PE per second + work against resistance per second
      const rise = x.v * x.sinT; return (x.m * G * rise + x.f * x.v) / 1000;
    },
  },
};

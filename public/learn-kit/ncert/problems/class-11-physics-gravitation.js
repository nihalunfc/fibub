// Class 11 Physics, Gravitation: live problems (original fibub questions). Ids start with c11p-grav-.
import { pick, choose, n, steps } from './_util.js';

const G = 6.674e-11, ME = 5.97e24, RE = 6.371e6;
const sci = (v, d = 3) => { const e = Math.floor(Math.log10(Math.abs(v))), m = v / 10 ** e; return `${(+m.toPrecision(d)).toString()} × 10<sup>${e < 0 ? '−' + -e : e}</sup>`; };

export default {
  'c11p-grav-kepler': {
    title: 'year of a planet from Kepler’s third law',
    make(r) {
      const a = choose(r, [0.5, 2, 4, 9, 16, 25]), T = Math.pow(a, 1.5);
      return { a, q: `<p>A planet orbits a Sun-like star at ${a} times the Earth–Sun distance. Using Kepler’s third law, how long is its year in Earth years?</p>`, answer: T, unit: 'years', tol: 0.01,
        hint: 'T² ∝ a³, and for Earth T = 1 year at a = 1 AU, so T = a^1.5.',
        solution: steps(`(T/1)² = (${a}/1)³ = ${n(a ** 3)}.`, `T = √${n(a ** 3)} = <b>${n(T)} years</b>.`) };
    },
    verify: (x) => Math.sqrt(x.a * x.a * x.a),
  },
  'c11p-grav-force': {
    title: 'gravitational force between two masses',
    make(r) {
      const m1 = choose(r, [50, 70, 100, 500, 1000]), m2 = choose(r, [60, 80, 200, 800]), d = choose(r, [0.5, 1, 2, 5]), F = G * m1 * m2 / (d * d);
      return { m1, m2, d, q: `<p>Two bodies of ${m1} kg and ${m2} kg have their centres ${d} m apart. Find the gravitational force between them (G = 6.67 × 10<sup>−11</sup> N m²/kg²). Give your answer in nanonewtons (1 nN = 10<sup>−9</sup> N).</p>`, answer: F * 1e9, unit: 'nN', tol: 0.02,
        hint: 'F = G m₁ m₂ / r².',
        solution: steps(`F = 6.674×10<sup>−11</sup> × ${m1} × ${m2} / ${d}² = ${sci(F)} N.`, `That is <b>${n(F * 1e9)} nN</b>: very small unless one of the bodies is as big as a planet.`) };
    },
    verify: (x) => 6.674e-11 * x.m1 * x.m2 / (x.d * x.d) * 1e9,
  },
  'c11p-grav-g': {
    title: 'g at a height above the Earth',
    make(r) {
      const h = choose(r, [100, 400, 1000, 3185, 6371, 12742]), g = 9.8 * (6371 / (6371 + h)) ** 2;
      return { h, q: `<p>Find the acceleration due to gravity at a height of ${h} km above the Earth’s surface. Take g = 9.8 m/s² and R = 6371 km.</p>`, answer: g, unit: 'm/s²', tol: 0.01,
        hint: 'g′ = g R²/(R + h)².',
        solution: steps(`R + h = ${6371 + h} km.`, `g′ = 9.8 × (6371/${6371 + h})² = <b>${n(g)} m/s²</b>.`) };
    },
    verify: (x) => { const k = 6371 / (6371 + x.h); return 9.8 * k * k; },
  },
  'c11p-grav-depth': {
    title: 'g down a mine shaft',
    make(r) {
      const d = choose(r, [10, 100, 637, 1274, 3185]), g = 9.8 * (1 - d / 6371);
      return { d, q: `<p>A mine shaft goes ${d} km below the ground. Treating the Earth as uniform, find g at the bottom (g = 9.8 m/s² and R = 6371 km at the surface).</p>`, answer: g, unit: 'm/s²', tol: 0.01,
        hint: 'g_d = g (1 − d/R): g falls linearly with depth.',
        solution: steps(`d/R = ${d}/6371 = ${n(d / 6371)}.`, `g_d = 9.8 × (1 − ${n(d / 6371)}) = <b>${n(g)} m/s²</b>.`) };
    },
    verify: (x) => 9.8 * (6371 - x.d) / 6371,
  },
  'c11p-grav-escape': {
    title: 'escape speed from another planet',
    make(r) {
      const f = choose(r, [0.5, 2, 4, 8]), rr = choose(r, [0.5, 1, 2, 4]), v = 11.2 * Math.sqrt(f / rr);
      return { f, rr, q: `<p>A planet has ${f} times the Earth’s mass and ${rr} times the Earth’s radius. The escape speed from the Earth is 11.2 km/s. Find the escape speed from this planet.</p>`, answer: v, unit: 'km/s', tol: 0.01,
        hint: 'v_esc = √(2GM/R) ∝ √(M/R).',
        solution: steps(`v ∝ √(M/R), so v/11.2 = √(${f}/${rr}) = ${n(Math.sqrt(f / rr))}.`, `v = 11.2 × ${n(Math.sqrt(f / rr))} = <b>${n(v)} km/s</b>.`) };
    },
    verify: (x) => Math.sqrt(2 * G * ME * x.f / (RE * x.rr)) / 1000,
  },
  'c11p-grav-orbit': {
    title: 'speed of a satellite',
    make(r) {
      const h = choose(r, [300, 400, 800, 2000, 20200, 35786]), v = Math.sqrt(G * ME / (RE + h * 1000)) / 1000;
      return { h, q: `<p>A satellite circles the Earth at a height of ${h} km. Find its orbital speed. (G M for the Earth = 3.986 × 10<sup>14</sup> m³/s², R = 6371 km)</p>`, answer: v, unit: 'km/s', tol: 0.02,
        hint: 'v = √(GM/r) with r = R + h in metres.',
        solution: steps(`r = ${6371 + h} km = ${n((6371 + h) * 1000)} m.`, `v = √(3.986×10<sup>14</sup> / ${n((6371 + h) * 1000)}) = <b>${n(v)} km/s</b>.`) };
    },
    verify: (x) => { const r = (6371 + x.h) * 1000, T = 2 * Math.PI * Math.sqrt(r ** 3 / 3.986e14); return 2 * Math.PI * r / T / 1000; },
  },
};

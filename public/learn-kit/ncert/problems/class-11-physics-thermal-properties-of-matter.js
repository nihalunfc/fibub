// Class 11 Physics, Thermal Properties of Matter: live problems (original fibub questions). Ids start with c11p-therm-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c11p-therm-scale': {
    title: 'temperature scales',
    make(r) {
      const F = pick(r, 14, 212, 6), K = (F - 32) * 5 / 9 + 273.15;
      return { F, q: `<p>The temperature of a day in Delhi is ${F} °F. Express it in kelvin.</p>`, answer: K, unit: 'K', tol: 0.005,
        hint: 'First °C = (°F − 32) × 5/9, then K = °C + 273.15.',
        solution: steps(`°C = (${F} − 32) × 5/9 = ${n((F - 32) * 5 / 9)}.`, `K = ${n((F - 32) * 5 / 9)} + 273.15 = <b>${n(K)} K</b>.`) };
    },
    verify: (x) => 273.15 + (x.F - 32) / 1.8,
  },
  'c11p-therm-expand': {
    title: 'linear expansion of a rail',
    make(r) {
      const [name, al] = choose(r, [['steel', 12], ['aluminium', 23], ['copper', 17], ['brass', 19]]), L = pick(r, 10, 60, 10), dT = pick(r, 20, 60, 5), dL = al * 1e-6 * L * dT * 1000;
      return { al, L, dT, q: `<p>A ${name} bar (α = ${al}×10<sup>−6</sup> per °C) is ${L} m long. How much longer does it get when the temperature rises by ${dT} °C? Give the answer in mm.</p>`, answer: dL, unit: 'mm', tol: 0.01,
        hint: 'ΔL = α L ΔT.',
        solution: steps(`ΔL = ${al}×10<sup>−6</sup> × ${L} × ${dT} m.`, `= ${n(dL / 1000)} m = <b>${n(dL)} mm</b>.`) };
    },
    verify: (x) => { const L2 = x.L * (1 + x.al * 1e-6 * x.dT); return (L2 - x.L) * 1000; },
  },
  'c11p-therm-calorimetry': {
    title: 'final temperature on mixing',
    make(r) {
      const m1 = choose(r, [0.1, 0.2, 0.3]), T1 = pick(r, 80, 150, 10), m2 = choose(r, [0.3, 0.4, 0.5]), T2 = pick(r, 15, 30, 5), c1 = choose(r, [390, 450, 900]), c2 = 4186, T = (m1 * c1 * T1 + m2 * c2 * T2) / (m1 * c1 + m2 * c2);
      return { m1, T1, m2, T2, c1, q: `<p>A metal piece of mass ${m1} kg and specific heat ${c1} J/(kg K) at ${T1} °C is dropped into ${m2} kg of water at ${T2} °C in an insulated calorimeter (specific heat of water 4186 J/(kg K); ignore the calorimeter). Find the final temperature in °C.</p>`, answer: T, unit: '°C', tol: 0.01,
        hint: 'Heat lost by the metal = heat gained by the water.',
        solution: steps(`${m1} × ${c1} × (${T1} − T) = ${m2} × 4186 × (T − ${T2}).`, `T = (${n(m1 * c1 * T1)} + ${n(m2 * c2 * T2)}) / (${n(m1 * c1)} + ${n(m2 * c2)}) = <b>${n(T)} °C</b>.`) };
    },
    verify: (x) => { const lost = (T) => x.m1 * x.c1 * (x.T1 - T), gained = (T) => x.m2 * 4186 * (T - x.T2); let lo = x.T2, hi = x.T1; for (let i = 0; i < 80; i++) { const mid = (lo + hi) / 2; lost(mid) > gained(mid) ? (lo = mid) : (hi = mid); } return (lo + hi) / 2; },
  },
  'c11p-therm-latent': {
    title: 'heat to turn ice into water',
    make(r) {
      const m = choose(r, [0.1, 0.2, 0.5, 1]), Ti = pick(r, -30, -5, 5), Tf = pick(r, 10, 40, 10), Q = m * (2100 * (0 - Ti) + 3.34e5 + 4186 * Tf) / 1000;
      return { m, Ti, Tf, q: `<p>How much heat is needed to turn ${m} kg of ice at ${Ti} °C into water at ${Tf} °C? (Specific heat of ice 2100 J/(kg K), of water 4186 J/(kg K); latent heat of fusion 3.34×10⁵ J/kg.) Give the answer in kJ.</p>`, answer: Q, unit: 'kJ', tol: 0.01,
        hint: 'Three parts: warm the ice to 0 °C, melt it, warm the water.',
        solution: steps(`Warm ice: ${m} × 2100 × ${-Ti} = ${n(m * 2100 * -Ti)} J.`, `Melt: ${m} × 3.34×10⁵ = ${n(m * 3.34e5)} J.`, `Warm water: ${m} × 4186 × ${Tf} = ${n(m * 4186 * Tf)} J.`, `Total = <b>${n(Q)} kJ</b>.`) };
    },
    verify: (x) => { const parts = [x.m * 2100 * Math.abs(x.Ti), x.m * 334000, x.m * 4186 * x.Tf]; return parts.reduce((a, b) => a + b, 0) / 1000; },
  },
  'c11p-therm-conduct': {
    title: 'heat through a wall',
    make(r) {
      const k = choose(r, [0.7, 0.8, 1.0]), A = pick(r, 4, 20, 2), d = choose(r, [0.1, 0.2, 0.3]), dT = pick(r, 10, 30, 5), H = k * A * dT / d;
      return { k, A, d, dT, q: `<p>A brick wall of area ${A} m² and thickness ${d * 100} cm (k = ${k} W/(m K)) has ${dT} °C more on the inside than the outside. At what rate does heat leave through the wall, in watts?</p>`, answer: H, unit: 'W', tol: 0.01,
        hint: 'H = k A ΔT / d.',
        solution: steps(`H = ${k} × ${A} × ${dT} / ${d}.`, `= <b>${n(H)} W</b>.`) };
    },
    verify: (x) => x.dT / (x.d / (x.k * x.A)),
  },
  'c11p-therm-stefan': {
    title: 'power radiated by a hot body',
    make(r) {
      const T = pick(r, 500, 1500, 100), A = choose(r, [0.01, 0.02, 0.05, 0.1]), P = 5.67e-8 * A * T ** 4;
      return { T, A, q: `<p>A black body of surface area ${A} m² is at ${T} K. How much power does it radiate, in watts? (σ = 5.67×10<sup>−8</sup> W/(m² K⁴).)</p>`, answer: P, unit: 'W', tol: 0.01,
        hint: 'P = σ A T⁴.',
        solution: steps(`T⁴ = ${n(T ** 4)} K⁴.`, `P = 5.67×10<sup>−8</sup> × ${A} × ${n(T ** 4)} = <b>${n(P)} W</b>.`) };
    },
    verify: (x) => 5.67e-8 * 300 ** 4 * x.A * (x.T / 300) ** 4,
  },
  'c11p-therm-cooling': {
    title: 'cooling of tea',
    make(r) {
      const Ts = choose(r, [20, 25, 30]), T0 = choose(r, [80, 85, 90]), k = choose(r, [0.03, 0.04, 0.05]), t = pick(r, 5, 30, 5), T = Ts + (T0 - Ts) * Math.exp(-k * t);
      return { Ts, T0, k, t, q: `<p>Tea at ${T0} °C stands in a ${Ts} °C room. Its cooling constant is ${k} per minute (Newton’s law). What is its temperature after ${t} minutes, in °C?</p>`, answer: T, unit: '°C', tol: 0.01,
        hint: 'T = Ts + (T₀ − Ts) e^(−kt).',
        solution: steps(`Excess at start = ${T0} − ${Ts} = ${T0 - Ts} °C.`, `Excess now = ${T0 - Ts} × e<sup>−${k}×${t}</sup> = ${n((T - Ts))} °C.`, `T = <b>${n(T)} °C</b>.`) };
    },
    verify: (x) => { let e = x.T0 - x.Ts; const steps2 = 1000, dt = x.t / steps2; for (let i = 0; i < steps2; i++) e -= x.k * e * dt; return x.Ts + e; },
  },
};

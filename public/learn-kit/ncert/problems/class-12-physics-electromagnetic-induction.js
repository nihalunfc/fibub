// Class 12 Physics, Electromagnetic Induction: live problems (original fibub questions). Ids start with c12p-emi-.
import { pick, choose, n, steps } from './_util.js';

const MU0 = 4e-7 * Math.PI;
const rd = (d) => (d * Math.PI) / 180;

export default {
  'c12p-emi-flux': {
    title: 'magnetic flux through a coil',
    make(r) {
      const B = pick(r, 0.1, 1, 0.1), A = pick(r, 20, 200, 10), th = choose(r, [0, 30, 45, 60]), answer = B * (A / 1e4) * Math.cos(rd(th)) * 1e3;
      return { B, A, th, q: `<p>A coil of area ${A} cm² is in a uniform field of ${n(B)} T. The normal to the coil makes an angle of ${th}° with the field. Find the flux through the coil, in milliweber.</p>`, answer, unit: 'mWb', tol: 0.01,
        hint: 'Φ = B A cos θ, with A in m² (1 cm² = 10⁻⁴ m²) and θ the angle between B and the normal.',
        solution: steps(`A = ${A}×10⁻⁴ m².`, `Φ = B A cos θ = ${n(B)} × ${A}×10⁻⁴ × cos ${th}°.`, `Φ = <b>${n(answer)} mWb</b>.`) };
    },
    verify: (x) => (x.B * Math.cos(rd(x.th))) * (x.A / 1e4) * 1e3,
  },
  'c12p-emi-faraday': {
    title: 'emf from a changing field',
    make(r) {
      const N = pick(r, 50, 500, 50), A = pick(r, 20, 100, 10), B1 = pick(r, 0, 0.2, 0.1), B2 = pick(r, 0.4, 1, 0.2), t = choose(r, [0.1, 0.2, 0.5, 2]);
      const answer = (N * (A / 1e4) * (B2 - B1)) / t * 1e3;
      return { N, A, B1, B2, t, q: `<p>A coil of ${N} turns and area ${A} cm² has its plane at right angles to a field that rises from ${n(B1)} T to ${n(B2)} T in ${t} s. Find the average induced emf, in millivolts.</p>`, answer, unit: 'mV', tol: 0.01,
        hint: 'ε = N ΔΦ/Δt, with Φ = B A when the field is perpendicular to the coil.',
        solution: steps(`Φ₁ = ${n(B1)} × ${A}×10⁻⁴, Φ₂ = ${n(B2)} × ${A}×10⁻⁴ Wb, so ΔΦ = ${n((A / 1e4) * (B2 - B1))} Wb.`, `ε = N ΔΦ/Δt = ${N} × ${n((A / 1e4) * (B2 - B1))} ÷ ${t}.`, `ε = <b>${n(answer)} mV</b>.`) };
    },
    verify: (x) => { const f1 = (x.A / 1e4) * x.B1, f2 = (x.A / 1e4) * x.B2; return (x.N * (f2 - f1)) / x.t * 1e3; },
  },
  'c12p-emi-motional': {
    title: 'motional emf of a moving rod',
    make(r) {
      const B = pick(r, 0.1, 1, 0.1), l = pick(r, 10, 80, 5), v = pick(r, 1, 20, 1), answer = B * (l / 100) * v * 1e3;
      return { B, l, v, q: `<p>A metal rod ${l} cm long moves at ${v} m/s at right angles to its length and to a uniform field of ${n(B)} T. What emf is induced between its ends, in millivolts?</p>`, answer, unit: 'mV', tol: 0.01,
        hint: 'ε = B l v (B, the rod and v mutually perpendicular).',
        solution: steps(`ε = B l v = ${n(B)} × ${l / 100} × ${v}.`, `ε = <b>${n(answer)} mV</b>.`) };
    },
    verify: (x) => { const dt = 0.01, dA = (x.l / 100) * x.v * dt; return (x.B * dA) / dt * 1e3; },
  },
  'c12p-emi-rails': {
    title: 'force needed to pull a rod on rails',
    make(r) {
      const B = pick(r, 0.2, 1, 0.2), l = pick(r, 20, 50, 10), v = pick(r, 2, 10, 2), R = pick(r, 1, 5, 1), answer = (B * B * (l / 100) ** 2 * v) / R * 1e3;
      return { B, l, v, R, q: `<p>A rod ${l} cm long slides at a steady ${v} m/s on rails joined by a ${R} Ω resistor, in a field of ${n(B)} T at right angles to the plane. Find the force needed to keep it moving, in millinewtons. (Ignore friction and the rails’ resistance.)</p>`, answer, unit: 'mN', tol: 0.01,
        hint: 'ε = B l v, I = ε/R, then F = B I l (it equals the magnetic braking force).',
        solution: steps(`ε = B l v = ${n(B * (l / 100) * v)} V.`, `I = ε/R = ${n((B * (l / 100) * v) / R)} A.`, `F = B I l = <b>${n(answer)} mN</b> (= B²l²v/R).`) };
    },
    verify: (x) => { const I = (x.B * (x.l / 100) * x.v) / x.R; return x.B * I * (x.l / 100) * 1e3; },
  },
  'c12p-emi-generator': {
    title: 'peak emf of a rotating coil',
    make(r) {
      const N = pick(r, 50, 500, 50), A = pick(r, 100, 500, 50), B = pick(r, 0.1, 0.5, 0.1), f = choose(r, [25, 50, 60]), answer = N * B * (A / 1e4) * 2 * Math.PI * f;
      return { N, A, B, f, q: `<p>A coil of ${N} turns and area ${A} cm² rotates at ${f} revolutions per second in a uniform field of ${n(B)} T about an axis perpendicular to the field. Find the peak emf, in volts.</p>`, answer, unit: 'V', tol: 0.01,
        hint: 'ε = N B A ω sin ωt, so the peak is N B A ω with ω = 2πf.',
        solution: steps(`ω = 2πf = ${n(2 * Math.PI * f)} rad/s.`, `ε₀ = N B A ω = ${N} × ${n(B)} × ${A}×10⁻⁴ × ${n(2 * Math.PI * f)}.`, `ε₀ = <b>${n(answer)} V</b>.`) };
    },
    verify: (x) => { const phimax = x.N * x.B * (x.A / 1e4); return phimax * (2 * Math.PI * x.f); },
  },
  'c12p-emi-inductance': {
    title: 'self-inductance of a solenoid',
    make(r) {
      const N = pick(r, 200, 1000, 100), l = pick(r, 10, 50, 5), A = pick(r, 2, 20, 2), answer = (MU0 * N * N * (A / 1e4)) / (l / 100) * 1e3;
      return { N, l, A, q: `<p>A long air-cored solenoid has ${N} turns, a length of ${l} cm and a cross-section of ${A} cm². Find its self-inductance, in millihenry.</p>`, answer, unit: 'mH', tol: 0.01,
        hint: 'L = μ0 N² A / l.',
        solution: steps(`L = μ0 N² A / l = 4π×10⁻⁷ × ${N}² × ${A}×10⁻⁴ ÷ ${l / 100}.`, `L = <b>${n(answer)} mH</b>.`) };
    },
    verify: (x) => { const nn = x.N / (x.l / 100); return MU0 * nn * nn * (x.A / 1e4) * (x.l / 100) * 1e3; },
  },
  'c12p-emi-energy': {
    title: 'energy stored in an inductor',
    make(r) {
      const L = pick(r, 50, 500, 50), I = pick(r, 1, 10, 1), answer = 0.5 * (L / 1000) * I * I;
      return { L, I, q: `<p>An inductor of ${L} mH carries a steady current of ${I} A. How much energy is stored in its magnetic field, in joules?</p>`, answer, unit: 'J', tol: 0.01,
        hint: 'U = ½ L I².', solution: steps(`U = ½ L I² = ½ × ${L / 1000} H × ${I}² A².`, `U = <b>${n(answer)} J</b>.`) };
    },
    verify: (x) => 0.5 * ((x.L / 1000) * x.I) * x.I,
  },
  'c12p-emi-rl': {
    title: 'current growing in an LR circuit',
    make(r) {
      const L = pick(r, 0.5, 4, 0.5), R = pick(r, 5, 20, 5), V = choose(r, [6, 12, 24]), k = choose(r, [0.5, 1, 2]), t = (L / R) * k, answer = (V / R) * (1 - Math.exp(-k));
      return { L, R, V, k, t, q: `<p>A ${L} H inductor and a ${R} Ω resistor are connected in series to a ${V} V battery. What is the current ${n(t)} s after the switch is closed, in amperes?</p>`, answer, unit: 'A', tol: 0.02,
        hint: 'I = (V/R)(1 − e^(−Rt/L)). Notice that t is a simple multiple of the time constant L/R.',
        solution: steps(`τ = L/R = ${n(L / R)} s, so t = ${k}τ.`, `I = (V/R)(1 − e^(−t/τ)) = ${n(V / R)} × (1 − e^(−${k})).`, `I = <b>${n(answer)} A</b>.`) };
    },
    verify: (x) => (x.V / x.R) * (1 - Math.exp((-x.R * x.t) / x.L)),
  },
};

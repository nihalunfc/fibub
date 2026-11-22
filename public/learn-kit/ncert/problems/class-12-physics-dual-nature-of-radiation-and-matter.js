// Class 12 Physics, Dual Nature of Radiation and Matter: live problems (original fibub questions). Ids start with c12p-dual-.
import { pick, choose, n, steps } from './_util.js';

const H = 6.626e-34, C = 3e8, E = 1.602e-19, M = 9.109e-31;
const sci = (v, d = 3) => { const e = Math.floor(Math.log10(Math.abs(v))), m = v / 10 ** e; return `${(+m.toPrecision(d)).toString()} × 10<sup>${e < 0 ? '−' + -e : e}</sup>`; };
export default {
  'c12p-dual-kmax': {
    title: 'maximum kinetic energy of photoelectrons',
    make(r) {
      const lam = choose(r, [200, 220, 250, 280]), phi = choose(r, [2.1, 2.3, 2.9, 3.2]), K = 1240 / lam - phi;
      return { lam, phi, q: `<p>Ultraviolet light of wavelength ${lam} nm falls on a metal of work function ${phi} eV. Find the maximum kinetic energy of the photoelectrons in eV. (Use E in eV = 1240 / λ in nm.)</p>`, answer: K, unit: 'eV', tol: 0.01,
        hint: 'Photon energy hν = 1240/λ eV. Then K_max = hν − φ₀.',
        solution: steps(`Photon energy = 1240 / ${lam} = ${n(1240 / lam)} eV.`, `K_max = hν − φ₀ = ${n(1240 / lam)} − ${phi} = <b>${n(K)} eV</b>.`) };
    },
    verify: (x) => (C / (x.lam * 1e-9)) * 4.13333e-15 - x.phi,
  },
  'c12p-dual-stop': {
    title: 'stopping potential from the frequency',
    make(r) {
      const f = choose(r, [9, 10, 11, 12, 14]), phi = choose(r, [1.9, 2.3, 2.8, 3.0]), V0 = ((H * f * 1e14) / E) - phi;
      return { f, phi, q: `<p>Light of frequency ${f} × 10<sup>14</sup> Hz falls on a metal with work function ${phi} eV. Find the stopping potential in volts. (h = 6.626 × 10<sup>−34</sup> J s, e = 1.602 × 10<sup>−19</sup> C)</p>`, answer: V0, unit: 'V', tol: 0.015,
        hint: 'eV₀ = hν − φ₀. Work in eV: hν (in eV) = h ν / e.',
        solution: steps(`hν = 6.626×10⁻³⁴ × ${f}×10¹⁴ = ${sci(H * f * 1e14)} J = ${n((H * f * 1e14) / E)} eV.`, `eV₀ = hν − φ₀ = ${n((H * f * 1e14) / E)} − ${phi} = ${n(V0)} eV, so <b>V₀ = ${n(V0)} V</b>.`) };
    },
    verify: (x) => 4.13567e-15 * x.f * 1e14 - x.phi,
  },
  'c12p-dual-threshold': {
    title: 'threshold wavelength',
    make(r) {
      const phi = choose(r, [1.9, 2.1, 2.3, 3.0, 4.3, 4.7]), lam = 1240 / phi;
      return { phi, q: `<p>The work function of a metal is ${phi} eV. What is the longest wavelength of light that can cause photoelectric emission from it? Give the answer in nm.</p>`, answer: lam, unit: 'nm', tol: 0.01,
        hint: 'At the threshold hν₀ = φ₀, so λ₀ = hc/φ₀ = 1240 eV nm ÷ φ₀.',
        solution: steps(`λ₀ = hc/φ₀ = 1240 / ${phi}.`, `λ₀ = <b>${n(lam)} nm</b>. Light of longer wavelength has photons with less than φ₀ and cannot free electrons.`) };
    },
    verify: (x) => { const nu0 = (x.phi * E) / H; return (C / nu0) * 1e9; },
  },
  'c12p-dual-photons': {
    title: 'photons emitted per second',
    make(r) {
      const P = choose(r, [1, 2, 5, 10, 20]), lam = choose(r, [400, 500, 550, 600, 650]), N = (P * lam * 1e-9) / (H * C);
      return { P, lam, q: `<p>A lamp gives out ${P} W of light of a single wavelength ${lam} nm. How many photons does it emit every second? Give the answer in units of 10<sup>18</sup>.</p>`, answer: N / 1e18, unit: '× 10¹⁸ per second', tol: 0.015,
        hint: 'Energy of one photon = hc/λ. Number per second = power ÷ energy of one photon.',
        solution: steps(`Energy of one photon = hc/λ = 6.63×10⁻³⁴ × 3×10⁸ ÷ ${lam}×10⁻⁹ = ${sci((H * C) / (lam * 1e-9))} J.`, `N = P/E = ${P} ÷ ${sci((H * C) / (lam * 1e-9))} = <b>${n(N / 1e18)} × 10¹⁸ per second</b>.`) };
    },
    verify: (x) => { const eV = 1240 / x.lam; return (x.P / (eV * E)) / 1e18; },
  },
  'c12p-dual-electron': {
    title: 'de Broglie wavelength of an accelerated electron',
    make(r) {
      const V = choose(r, [25, 50, 100, 150, 200, 400, 900]), lam = H / Math.sqrt(2 * M * E * V) * 1e9;
      return { V, q: `<p>An electron is accelerated from rest through a potential difference of ${V} V. Find its de Broglie wavelength in nanometres. (h = 6.63 × 10<sup>−34</sup> J s, m = 9.1 × 10<sup>−31</sup> kg, e = 1.6 × 10<sup>−19</sup> C)</p>`, answer: lam, unit: 'nm', tol: 0.015,
        hint: 'eV = ½mv², so p = √(2meV), and λ = h/p. (Shortcut: λ = 1.227/√V nm.)',
        solution: steps(`p = √(2meV) = √(2 × 9.1×10⁻³¹ × 1.6×10⁻¹⁹ × ${V}) = ${sci(Math.sqrt(2 * M * E * V))} kg m/s.`, `λ = h/p = 6.63×10⁻³⁴ ÷ ${sci(Math.sqrt(2 * M * E * V))} = <b>${n(lam)} nm</b>.`) };
    },
    verify: (x) => 1.2264 / Math.sqrt(x.V),
  },
  'c12p-dual-ball': {
    title: 'de Broglie wavelength of a moving object',
    make(r) {
      const m = choose(r, [0.05, 0.1, 0.16, 0.5]), v = choose(r, [10, 20, 30, 40]), lam = H / (m * v);
      return { m, v, q: `<p>Find the de Broglie wavelength of a ${m * 1000} g ball moving at ${v} m/s. Give the answer in units of 10<sup>−34</sup> m.</p>`, answer: lam / 1e-34, unit: '× 10⁻³⁴ m', tol: 0.015,
        hint: 'λ = h/(mv). Change grams to kilograms.',
        solution: steps(`p = mv = ${m} × ${v} = ${n(m * v)} kg m/s.`, `λ = h/p = 6.63×10⁻³⁴ ÷ ${n(m * v)} = <b>${n(lam / 1e-34)} × 10⁻³⁴ m</b>: far too small to detect.`) };
    },
    verify: (x) => { const K = 0.5 * x.m * x.v * x.v; return (H / Math.sqrt(2 * x.m * K)) / 1e-34; },
  },
};

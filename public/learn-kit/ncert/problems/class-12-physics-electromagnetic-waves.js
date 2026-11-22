// Class 12 Physics, Chapter 8 Electromagnetic Waves: live problems (original fibub questions). Ids start with c12p-emw-.
import { pick, choose, n, steps } from './_util.js';

const C = 3e8, EPS0 = 8.854e-12, MU0 = 4 * Math.PI * 1e-7, SUP = (e) => `10<sup>${e}</sup>`;
export default {
  'c12p-emw-wavelength': {
    title: 'wavelength from frequency',
    make(r) {
      const [name, fM] = choose(r, [['an FM station', 98.3], ['a 4G tower', 1800], ['a Wi-Fi router', 2400], ['a short-wave station', 15], ['a radar', 10000]]);
      const lam = C / (fM * 1e6);
      return { fM, q: `<p>${name[0].toUpperCase() + name.slice(1)} transmits at ${fM} MHz. What is the wavelength in vacuum? (c = 3 × 10<sup>8</sup> m/s)</p>`, answer: lam, unit: 'm', tol: 0.01, hint: 'λ = c/f, with f in hertz (1 MHz = 10<sup>6</sup> Hz).',
        solution: steps(`f = ${fM} × 10<sup>6</sup> Hz.`, `λ = c/f = 3 × 10<sup>8</sup> ÷ (${fM} × 10<sup>6</sup>) = <b>${n(lam)} m</b>.`) };
    },
    verify: (x) => 300 / x.fM,
  },
  'c12p-emw-bfield': {
    title: 'magnetic field amplitude of a wave',
    make(r) {
      const E0 = choose(r, [3, 6, 12, 30, 60, 120, 300]), B0 = E0 / C;
      return { E0, q: `<p>The electric field of a plane electromagnetic wave in vacuum has amplitude ${E0} V/m. Find the amplitude of its magnetic field in nanotesla.</p>`, answer: B0 * 1e9, unit: 'nT', tol: 0.01, hint: 'In vacuum B₀ = E₀/c, with c = 3 × 10<sup>8</sup> m/s.', solution: steps(`B₀ = E₀/c = ${E0} ÷ (3 × 10<sup>8</sup>) = ${n(B0)} T.`, `In nanotesla: <b>${n(B0 * 1e9)} nT</b>.`) };
    },
    verify: (x) => x.E0 * 1e9 / 3e8,
  },
  'c12p-emw-displ': {
    title: 'displacement current in a capacitor',
    make(r) {
      const Acm = choose(r, [50, 100, 200, 400]), dmm = choose(r, [1, 2, 4, 5]), dVdt = choose(r, [1e3, 2e3, 5e3, 1e4]);
      const A = Acm * 1e-4, d = dmm * 1e-3, dEdt = dVdt / d, Id = EPS0 * A * dEdt;
      return { Acm, dmm, dVdt, q: `<p>The plates of a parallel-plate capacitor each have area ${Acm} cm² and are ${dmm} mm apart (air between). The voltage across them is rising at ${n(dVdt)} V/s. Find the displacement current between the plates (ε₀ = 8.85 × 10<sup>−12</sup> F/m).</p>`, answer: Id * 1e9, unit: 'nA', tol: 0.01,
        hint: 'E = V/d, so dE/dt = (dV/dt)/d. Then I<sub>d</sub> = ε₀ A dE/dt.',
        solution: steps(`dE/dt = (dV/dt)/d = ${n(dVdt)} ÷ ${n(d)} = ${n(dEdt)} V/m per s.`, `I<sub>d</sub> = ε₀A dE/dt = 8.85 × 10<sup>−12</sup> × ${n(A)} × ${n(dEdt)} = ${n(Id)} A = <b>${n(Id * 1e9)} nA</b>.`) };
    },
    verify: (x) => { const Ccap = (EPS0 * x.Acm * 1e-4) / (x.dmm * 1e-3); return Ccap * x.dVdt * 1e9; },
  },
  'c12p-emw-intensity': {
    title: 'intensity from the electric field',
    make(r) {
      const E0 = choose(r, [10, 20, 50, 100, 200, 500, 1000]), I = 0.5 * EPS0 * C * E0 * E0;
      return { E0, q: `<p>A plane wave in air has an electric field amplitude of ${n(E0)} V/m. Find its intensity. (ε₀ = 8.85 × 10<sup>−12</sup> F/m, c = 3 × 10<sup>8</sup> m/s)</p>`, answer: I, unit: 'W/m²', tol: 0.01, hint: 'I = ½ ε₀ c E₀².',
        solution: steps(`I = ½ ε₀ c E₀² = 0.5 × 8.85 × 10<sup>−12</sup> × 3 × 10<sup>8</sup> × ${n(E0)}².`, `I = <b>${n(I)} W/m²</b>.`) };
    },
    verify: (x) => { const B0 = x.E0 / C; return (C * B0 * B0) / (2 * MU0); },
  },
  'c12p-emw-pressure': {
    title: 'radiation pressure and force',
    make(r) {
      const I = choose(r, [100, 500, 1000, 1360]), Acm = choose(r, [1, 10, 100, 1000]), p = I / C, F = p * Acm * 1e-4;
      return { I, Acm, q: `<p>Sunlight of intensity ${n(I)} W/m² falls normally on a perfectly absorbing surface of area ${n(Acm)} cm². What force does the light exert on it?</p>`, answer: F, unit: 'N', tol: 0.01, hint: 'Pressure on a perfect absorber is I/c; force = pressure × area.',
        solution: steps(`Pressure = I/c = ${n(I)} ÷ (3 × 10<sup>8</sup>) = ${n(p)} Pa.`, `Area = ${n(Acm * 1e-4)} m², so F = p × A = <b>${n(F)} N</b>.`) };
    },
    verify: (x) => (x.I * x.Acm * 1e-4) / 3e8,
  },
  'c12p-emw-photon': {
    title: 'photon energy from wavelength',
    make(r) {
      const lam = choose(r, [400, 450, 550, 650, 700, 10, 120]), E = (6.626e-34 * C) / (lam * 1e-9) / 1.602e-19;
      return { lam, q: `<p>Find the energy of a photon of wavelength ${lam} nm, in electronvolts. (h = 6.63 × 10<sup>−34</sup> J s, c = 3 × 10<sup>8</sup> m/s, 1 eV = 1.6 × 10<sup>−19</sup> J)</p>`, answer: E, unit: 'eV', tol: 0.015, hint: 'E = hc/λ, then divide by 1.6 × 10<sup>−19</sup> to change joules into eV.',
        solution: steps(`E = hc/λ = 6.63 × 10<sup>−34</sup> × 3 × 10<sup>8</sup> ÷ (${lam} × 10<sup>−9</sup>).`, `E = ${n((6.626e-34 * C) / (lam * 1e-9))} J = <b>${n(E)} eV</b>.`) };
    },
    verify: (x) => 1240 / x.lam,
  },
  'c12p-emw-speed': {
    title: 'speed of light from the two constants',
    make(r) {
      const k = choose(r, [1, 1.5, 2, 4]), eps = EPS0 * k, v = 1 / Math.sqrt(MU0 * eps);
      return { k, q: `<p>In a medium of relative permittivity ${k} (and relative permeability 1), what is the speed of an electromagnetic wave? Use ε₀ = 8.85 × 10<sup>−12</sup> F/m and μ₀ = 4π × 10<sup>−7</sup> H/m.</p>`, answer: v / 1e8, unit: '× 10⁸ m/s', tol: 0.01, hint: 'v = 1/√(με) = 1/√(μ₀ × kε₀) = c/√k.',
        solution: steps(`c = 1/√(μ₀ε₀) ≈ 3 × 10<sup>8</sup> m/s.`, `v = c/√${k} = <b>${n(v / 1e8)} × 10<sup>8</sup> m/s</b>.`) };
    },
    verify: (x) => 2.998 / Math.sqrt(x.k),
  },
};

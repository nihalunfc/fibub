// Class 12 Physics, Wave Optics: live problems (original fibub questions). Ids start with c12p-wave-.
import { pick, choose, n, steps } from './_util.js';

const C = 3e8;
export default {
  'c12p-wave-speed': {
    title: 'speed of light in a medium from the angles',
    make(r) {
      const i = choose(r, [30, 40, 45, 50, 60]), rr = choose(r, [18, 22, 25, 28, 32]), nn = Math.sin(i * Math.PI / 180) / Math.sin(rr * Math.PI / 180), v = C / nn;
      return { i, rr, q: `<p>A ray in air meets a liquid surface at an angle of incidence of ${i}° and is refracted at ${rr}°. Find the speed of light in the liquid. (c = 3 × 10<sup>8</sup> m/s) Give the answer in 10<sup>8</sup> m/s.</p>`, answer: v / 1e8, unit: '× 10⁸ m/s', tol: 0.01,
        hint: 'Huygens gives sin i / sin r = v₁/v₂ = n. The first medium is air, where v₁ = c.',
        solution: steps(`sin i / sin r = sin ${i}° / sin ${rr}° = ${n(nn)} = refractive index n.`, `v₂ = v₁ / n = 3 × 10⁸ ÷ ${n(nn)} = <b>${n(v / 1e8)} × 10⁸ m/s</b>.`) };
    },
    verify: (x) => 3 * Math.sin((x.rr * Math.PI) / 180) / Math.sin((x.i * Math.PI) / 180),
  },
  'c12p-wave-ratio': {
    title: 'maximum to minimum intensity',
    make(r) {
      const a = choose(r, [2, 3, 4, 5]), q = a * a, R = ((a + 1) / (a - 1)) ** 2;
      return { a, q: `<p>Two coherent sources have intensities in the ratio ${q} : 1. Find the ratio I<sub>max</sub> : I<sub>min</sub> of the interference pattern. Give I<sub>max</sub>/I<sub>min</sub>.</p>`, answer: R, unit: '', tol: 0.01,
        hint: 'Amplitude goes as the square root of intensity. I_max ∝ (a₁ + a₂)² and I_min ∝ (a₁ − a₂)².',
        solution: steps(`a₁ : a₂ = √${q} : √1 = ${a} : 1.`, `I_max/I_min = (${a} + 1)² / (${a} − 1)² = ${(a + 1) ** 2} / ${(a - 1) ** 2} = <b>${n(R)}</b>.`) };
    },
    verify: (x) => { const I1 = x.a * x.a, I2 = 1, s = 2 * Math.sqrt(I1 * I2); return (I1 + I2 + s) / (I1 + I2 - s); },
  },
  'c12p-wave-fringe': {
    title: 'fringe width in Young’s experiment',
    make(r) {
      const d = choose(r, [0.2, 0.25, 0.4, 0.5, 1]), D = choose(r, [0.8, 1, 1.5, 2]), lam = pick(r, 450, 700, 50), beta = (lam * 1e-9 * D) / (d * 1e-3) * 1e3;
      return { d, D, lam, q: `<p>In Young’s double-slit experiment the slits are ${d} mm apart and the screen is ${D} m away. The wavelength of the light is ${lam} nm. Find the fringe width in millimetres.</p>`, answer: beta, unit: 'mm', tol: 0.01,
        hint: 'β = λD/d. Change nm to m (× 10⁻⁹) and mm to m (× 10⁻³) before you divide.',
        solution: steps(`λ = ${lam} × 10⁻⁹ m, D = ${D} m, d = ${d} × 10⁻³ m.`, `β = λD/d = ${lam}×10⁻⁹ × ${D} ÷ ${d}×10⁻³ = ${n(beta / 1e3)} m = <b>${n(beta)} mm</b>.`) };
    },
    verify: (x) => { const dy = (x.lam * 1e-9 * x.D * 4) / (x.d * 1e-3) - (x.lam * 1e-9 * x.D * 3) / (x.d * 1e-3); return dy * 1e3; },
  },
  'c12p-wave-nth': {
    title: 'position of a bright fringe',
    make(r) {
      const d = choose(r, [0.3, 0.5, 0.6, 1]), D = choose(r, [1, 1.2, 1.5, 2]), lam = pick(r, 450, 650, 50), k = choose(r, [2, 3, 4, 5]), y = (k * lam * 1e-9 * D) / (d * 1e-3) * 1e3;
      return { d, D, lam, k, q: `<p>Slits ${d} mm apart are lit by light of wavelength ${lam} nm. A screen is ${D} m from the slits. How far from the central bright fringe is the ${k}th bright fringe? Give the answer in mm.</p>`, answer: y, unit: 'mm', tol: 0.01,
        hint: 'The n-th bright fringe is at y = nλD/d (the path difference dy/D equals nλ).',
        solution: steps(`Path difference needed: dy/D = ${k}λ.`, `y = ${k} × ${lam}×10⁻⁹ × ${D} ÷ ${d}×10⁻³ = ${n(y / 1e3)} m = <b>${n(y)} mm</b>.`) };
    },
    verify: (x) => { const dl = (x.k * x.lam * 1e-9); return ((dl * x.D) / (x.d * 1e-3)) * 1e3; },
  },
  'c12p-wave-water': {
    title: 'fringe width in water',
    make(r) {
      const beta = choose(r, [0.6, 0.8, 1.2, 1.5, 2.4]), mu = choose(r, [1.33, 1.5, 1.2, 1.4]);
      return { beta, mu, q: `<p>In air the fringes of a Young’s set-up are ${beta} mm wide. The whole set-up is now immersed in a liquid of refractive index ${mu}. Find the new fringe width in mm.</p>`, answer: beta / mu, unit: 'mm', tol: 0.01,
        hint: 'In the liquid the wavelength becomes λ/μ, and β is proportional to λ.',
        solution: steps(`λ in the liquid = λ/${mu}.`, `β' = λ'D/d = β/${mu} = ${beta} ÷ ${mu} = <b>${n(beta / mu)} mm</b>.`) };
    },
    verify: (x) => { const lam0 = 500e-9, D = 1, d = (lam0 * D) / (x.beta * 1e-3); return ((lam0 / x.mu) * D) / d * 1e3; },
  },
  'c12p-wave-slit': {
    title: 'width of the central maximum of a single slit',
    make(r) {
      const a = choose(r, [0.1, 0.2, 0.25, 0.4]), D = choose(r, [1, 1.5, 2, 2.5]), lam = pick(r, 450, 650, 50), w = (2 * lam * 1e-9 * D) / (a * 1e-3) * 1e3;
      return { a, D, lam, q: `<p>Light of wavelength ${lam} nm passes through a single slit of width ${a} mm. The screen is ${D} m away. Find the width of the central bright band, in mm.</p>`, answer: w, unit: 'mm', tol: 0.02,
        hint: 'The first minima are at a sin θ = λ. The central maximum is between the two first minima: width 2λD/a.',
        solution: steps(`First minimum: sin θ ≈ λ/a = ${lam}×10⁻⁹ ÷ ${a}×10⁻³ = ${n(lam * 1e-9 / (a * 1e-3))}.`, `Distance from the centre = D tan θ ≈ Dλ/a = ${n(w / 2)} mm.`, `Width = 2λD/a = <b>${n(w)} mm</b>.`) };
    },
    verify: (x) => 2 * x.D * Math.tan(Math.asin((x.lam * 1e-9) / (x.a * 1e-3))) * 1e3,
  },
  'c12p-wave-malus': {
    title: 'unpolarised light through two polaroids',
    make(r) {
      const I0 = choose(r, [40, 80, 120, 200]), th = choose(r, [30, 37, 45, 53, 60]), I = (I0 / 2) * Math.cos((th * Math.PI) / 180) ** 2;
      return { I0, th, q: `<p>Unpolarised light of intensity ${I0} W/m² falls on a polaroid. The light then passes through a second polaroid whose axis makes ${th}° with the first. What is the final intensity, in W/m²?</p>`, answer: I, unit: 'W/m²', tol: 0.01,
        hint: 'The first polaroid halves the intensity. Then use Malus’s law, I = I₁ cos²θ, for the second.',
        solution: steps(`After the first polaroid: ${I0} / 2 = ${I0 / 2} W/m².`, `After the second: ${I0 / 2} × cos²${th}° = <b>${n(I)} W/m²</b>.`) };
    },
    verify: (x) => (x.I0 / 4) * (1 + Math.cos((2 * x.th * Math.PI) / 180)),
  },
};

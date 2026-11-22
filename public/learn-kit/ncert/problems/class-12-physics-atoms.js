// Class 12 Physics, Atoms: live problems (original fibub questions). Ids start with c12p-atom-.
import { pick, choose, n, steps } from './_util.js';

const R = 1.097e7, K0 = 8.988e9, E = 1.602e-19, H = 6.626e-34, C = 3e8;
export default {
  'c12p-atom-closest': {
    title: 'distance of closest approach',
    make(r) {
      const Z = choose(r, [13, 29, 47, 79]), K = choose(r, [4, 5, 5.5, 6, 7.7]), r0 = (2 * 1.44 * Z) / K;
      return { Z, K, q: `<p>An alpha particle of kinetic energy ${K} MeV is fired directly at the nucleus of an atom with Z = ${Z}. How close does it get? Give the answer in femtometres (1 fm = 10<sup>−15</sup> m). (e²/4πε₀ = 1.44 MeV fm)</p>`, answer: r0, unit: 'fm', tol: 0.01,
        hint: 'At the closest point all the kinetic energy is potential energy: K = (1/4πε₀)(2e)(Ze)/r₀.',
        solution: steps(`K = (e²/4πε₀) × 2Z / r₀, so r₀ = 2Z × 1.44 / K.`, `r₀ = 2 × ${Z} × 1.44 ÷ ${K} = <b>${n(r0)} fm</b>.`, 'The nucleus itself is only about 7 fm across for gold, so the alpha particle is still well outside it.') };
    },
    verify: (x) => (K0 * (2 * E) * (x.Z * E)) / (x.K * 1e6 * E) * 1e15,
  },
  'c12p-atom-radius': {
    title: 'radius of a Bohr orbit',
    make(r) {
      const Z = choose(r, [1, 1, 2, 3]), nn = choose(r, [1, 2, 3, 4, 5]), rad = (0.0529 * nn * nn) / Z;
      const name = Z === 1 ? 'hydrogen atom' : Z === 2 ? 'He⁺ ion' : 'Li²⁺ ion';
      return { Z, nn, q: `<p>Find the radius of the n = ${nn} orbit of the electron in a ${name} (Z = ${Z}). Give the answer in nm. (Bohr radius a₀ = 0.0529 nm)</p>`, answer: rad, unit: 'nm', tol: 0.01,
        hint: 'The radius is r = a₀ n²/Z.',
        solution: steps(`r_n = a₀ n² / Z = 0.0529 × ${nn}² ÷ ${Z}.`, `r = <b>${n(rad)} nm</b>.`) };
    },
    verify: (x) => { const v = (x.Z * 2.19e6) / x.nn, m = 9.109e-31; return ((x.nn * H) / (2 * Math.PI * m * v)) * 1e9; },
  },
  'c12p-atom-wavelength': {
    title: 'wavelength of a hydrogen line',
    make(r) {
      const nf = choose(r, [1, 2, 3]), ni = nf + choose(r, [1, 2, 3, 4]), lam = 1e9 / (R * (1 / (nf * nf) - 1 / (ni * ni)));
      return { nf, ni, q: `<p>An electron in a hydrogen atom jumps from the level n = ${ni} to n = ${nf}. Find the wavelength of the light emitted, in nm. (R = 1.097 × 10<sup>7</sup> m<sup>−1</sup>)</p>`, answer: lam, unit: 'nm', tol: 0.01,
        hint: 'Rydberg’s formula: 1/λ = R(1/n_f² − 1/n_i²).',
        solution: steps(`1/λ = 1.097×10⁷ × (1/${nf}² − 1/${ni}²) = ${n(R * (1 / (nf * nf) - 1 / (ni * ni)))} m⁻¹.`, `λ = <b>${n(lam)} nm</b>.`) };
    },
    verify: (x) => { const dE = 13.6 * (1 / (x.nf * x.nf) - 1 / (x.ni * x.ni)); return 1240.8 / dE; },
  },
  'c12p-atom-limit': {
    title: 'series limit',
    make(r) {
      const nf = choose(r, [1, 2, 3, 4]), lam = (nf * nf * 1e9) / R;
      const name = ['Lyman', 'Balmer', 'Paschen', 'Brackett'][nf - 1];
      return { nf, q: `<p>Find the shortest wavelength (the series limit) of the ${name} series of hydrogen, which ends at n = ${nf}. Give the answer in nm. (R = 1.097 × 10<sup>7</sup> m<sup>−1</sup>)</p>`, answer: lam, unit: 'nm', tol: 0.01,
        hint: 'The shortest wavelength comes from n_i = ∞, so 1/λ = R/n_f².',
        solution: steps(`With n_i = ∞, 1/n_i² = 0, so 1/λ = R/${nf}².`, `λ = ${nf}²/R = <b>${n(lam)} nm</b>.`) };
    },
    verify: (x) => 1240.8 / (13.6 / (x.nf * x.nf)),
  },
  'c12p-atom-lines': {
    title: 'number of spectral lines',
    make(r) {
      const top = choose(r, [3, 4, 5, 6]);
      return { top, q: `<p>A sample of hydrogen atoms is excited so that electrons reach the level n = ${top}. How many different spectral lines can be emitted as the atoms return to the ground state?</p>`, answer: (top * (top - 1)) / 2, unit: '', abs: 0.01, tol: 0.001,
        hint: 'Each line comes from a jump between two different levels. Count the pairs (upper, lower).',
        solution: steps(`The levels are 1, 2, …, ${top}: ${top} levels.`, `Number of pairs = ${top}(${top} − 1)/2 = <b>${(top * (top - 1)) / 2}</b> lines.`) };
    },
    verify: (x) => { let c = 0; for (let a = 1; a <= x.top; a++) for (let b = a + 1; b <= x.top; b++) c++; return c; },
  },
};

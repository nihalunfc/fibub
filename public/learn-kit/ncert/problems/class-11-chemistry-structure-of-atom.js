// Class 11 Chemistry, Chapter 2 Structure of Atom: live problems (original fibub questions). Ids start with c11c-atom-.
import { pick, choose, n, steps } from './_util.js';

const H = 6.626e-34, C = 3.0e8, EV = 1.602e-19, ME = 9.109e-31;
// unpaired electrons from the aufbau list (with the Cr and Cu exceptions), worked out by filling boxes
const ORDER = [['1s', 2], ['2s', 2], ['2p', 6], ['3s', 2], ['3p', 6], ['4s', 2], ['3d', 10]];
const unpaired = (Z, over) => { let left = Z, un = 0; const cfg = {}; for (const [s, cap] of ORDER) { const k = Math.min(cap, left); cfg[s] = k; left -= k; } if (over) Object.assign(cfg, over); for (const [s, k] of Object.entries(cfg)) { const orb = s.endsWith('s') ? 1 : s.endsWith('p') ? 3 : 5; un += k <= orb ? k : 2 * orb - k; } return un; };
const EL = [['N', 7, null], ['O', 8, null], ['P', 15, null], ['Mn', 25, null], ['Fe', 26, null], ['Ni', 28, null], ['Zn', 30, null], ['Cr', 24, { '4s': 1, '3d': 5 }], ['Cu', 29, { '4s': 1, '3d': 10 }]];
export default {
  'c11c-atom-neutrons': {
    title: 'neutrons and electrons from the symbol',
    make(r) {
      const I = choose(r, [['Na', 11, 23, 1], ['Mg', 12, 24, 2], ['Al', 13, 27, 3], ['Cl', 17, 35, -1], ['S', 16, 32, -2], ['Ca', 20, 40, 2], ['K', 19, 39, 1], ['O', 8, 16, -2]]);
      return { I, q: `<p>An ion has symbol <sup>${I[2]}</sup><sub>${I[1]}</sub>${I[0]} with a charge of ${I[3] > 0 ? '+' : '−'}${Math.abs(I[3])}. How many <b>neutrons</b> plus <b>electrons</b> does it have in total?</p>`, answer: (I[2] - I[1]) + (I[1] - I[3]), unit: 'particles', tol: 0.001,
        hint: 'Neutrons = A − Z. Electrons = Z − charge (a positive ion has lost electrons).',
        solution: steps(`Neutrons = ${I[2]} − ${I[1]} = ${I[2] - I[1]}.`, `Electrons = ${I[1]} − (${I[3]}) = ${I[1] - I[3]}.`, `Total = <b>${I[2] - I[1] + I[1] - I[3]}</b>.`) };
    },
    verify: (x) => x.I[2] - x.I[3],
  },
  'c11c-atom-photon': {
    title: 'energy of one photon',
    make(r) {
      const l = choose(r, [200, 250, 300, 400, 500, 600, 700]), E = H * C / (l * 1e-9);
      return { l, q: `<p>Find the energy of one photon of light of wavelength ${l} nm. (h = 6.626 × 10⁻³⁴ J s, c = 3.0 × 10⁸ m/s.) Give the answer in units of 10⁻¹⁹ J.</p>`, answer: E * 1e19, unit: '× 10⁻¹⁹ J', tol: 0.01,
        hint: 'E = hc/λ with λ in metres (1 nm = 10⁻⁹ m).',
        solution: steps(`λ = ${l} × 10⁻⁹ m.`, `E = (6.626 × 10⁻³⁴ × 3.0 × 10⁸) / (${l} × 10⁻⁹) = <b>${n(E * 1e19)} × 10⁻¹⁹ J</b>.`) };
    },
    verify: (x) => (1.9878e-25 / (x.l * 1e-9)) * 1e19,
  },
  'c11c-atom-bohr': {
    title: 'wavelength of a hydrogen line',
    make(r) {
      const P = choose(r, [[3, 2], [4, 2], [5, 2], [2, 1], [3, 1], [4, 3]]), dE = 13.6 * (1 / (P[1] * P[1]) - 1 / (P[0] * P[0])), lam = 1239.84 / dE;
      return { P, q: `<p>An electron in a hydrogen atom drops from n = ${P[0]} to n = ${P[1]}. Find the wavelength of the photon emitted in nm. (E<sub>n</sub> = −13.6/n² eV, hc = 1240 eV nm.)</p>`, answer: lam, unit: 'nm', tol: 0.01,
        hint: 'ΔE = 13.6 (1/n₁² − 1/n₂²) eV, then λ = 1240/ΔE.',
        solution: steps(`ΔE = 13.6 (1/${P[1] ** 2} − 1/${P[0] ** 2}) = ${n(dE)} eV.`, `λ = 1240 / ${n(dE)} = <b>${n(lam)} nm</b>.`) };
    },
    verify: (x) => 1 / (1.0968e-2 * (1 / x.P[1] ** 2 - 1 / x.P[0] ** 2)),
  },
  'c11c-atom-photoelectric': {
    title: 'photoelectric effect: kinetic energy of electrons',
    make(r) {
      const W = choose(r, [1.9, 2.3, 2.7, 4.1]), l = choose(r, [150, 180, 200, 220]), K = 1239.84 / l - W;
      return { W, l, q: `<p>Light of wavelength ${l} nm falls on a metal whose work function is ${W} eV. Find the maximum kinetic energy of the emitted electrons in eV. (hc = 1240 eV nm.)</p>`, answer: K, unit: 'eV', tol: 0.02,
        hint: 'K = hν − φ = hc/λ − φ.',
        solution: steps(`Photon energy = 1240/${l} = ${n(1239.84 / l)} eV.`, `K = ${n(1239.84 / l)} − ${W} = <b>${n(K)} eV</b>.`) };
    },
    verify: (x) => (6.626e-34 * 2.998e8 / (x.l * 1e-9)) / 1.602e-19 - x.W,
  },
  'c11c-atom-debroglie': {
    title: 'de Broglie wavelength of an electron',
    make(r) {
      const v = choose(r, [1, 2, 3, 5, 10]), lam = H / (ME * v * 1e6) * 1e12;
      return { v, q: `<p>An electron moves at ${v} × 10⁶ m/s. Find its de Broglie wavelength in picometres. (m = 9.109 × 10⁻³¹ kg, h = 6.626 × 10⁻³⁴ J s, 1 pm = 10⁻¹² m.)</p>`, answer: lam, unit: 'pm', tol: 0.01,
        hint: 'λ = h/(mv).',
        solution: steps(`λ = 6.626 × 10⁻³⁴ / (9.109 × 10⁻³¹ × ${v} × 10⁶).`, `= ${n(lam / 1e12 * 1e10)} × 10⁻¹⁰ m = <b>${n(lam)} pm</b>.`) };
    },
    verify: (x) => 727.4 / x.v,
  },
  'c11c-atom-shell': {
    title: 'orbitals and electrons in a shell',
    make(r) {
      const N = pick(r, 2, 5);
      return { N, q: `<p>How many <b>electrons</b> can the shell with principal quantum number n = ${N} hold in total?</p>`, answer: 2 * N * N, unit: 'electrons', tol: 0.001,
        hint: 'Count the orbitals in each subshell (2l + 1 for l = 0 … n − 1) and put 2 electrons in each. Or use 2n².',
        solution: steps(`l runs from 0 to ${N - 1}: orbitals = ${Array.from({ length: N }, (_, l) => 2 * l + 1).join(' + ')} = ${N * N}.`, `Electrons = 2 × ${N * N} = <b>${2 * N * N}</b>.`) };
    },
    verify: (x) => { let o = 0; for (let l = 0; l < x.N; l++) o += 2 * l + 1; return 2 * o; },
  },
  'c11c-atom-unpaired': {
    title: 'unpaired electrons in an atom',
    make(r) {
      const e = choose(r, EL);
      return { e, q: `<p>How many <b>unpaired electrons</b> does a ground-state atom of ${e[0]} (Z = ${e[1]}) have? (Use the rules of filling, and remember the half-filled and filled d exceptions.)</p>`, answer: unpaired(e[1], e[2]), unit: 'electrons', tol: 0.001, abs: 0.01,
        hint: 'Write the configuration, then place electrons one per orbital first (Hund’s rule) before pairing.',
        solution: steps(`Fill 1s, 2s, 2p, 3s, 3p, 4s, 3d in order${e[2] ? ' (with the exception: half- or fully filled 3d takes one electron from 4s)' : ''}.`, `Count the orbitals of the outer subshells with a single electron.`, `Unpaired electrons = <b>${unpaired(e[1], e[2])}</b>.`) };
    },
    verify: (x) => ({ N: 3, O: 2, P: 3, Mn: 5, Fe: 4, Ni: 2, Zn: 0, Cr: 6, Cu: 1 })[x.e[0]],
  },
};

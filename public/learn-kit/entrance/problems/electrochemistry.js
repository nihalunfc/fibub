// Live problems for Electrochemistry.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const F = 96500;

export default {
  'ec-nernst': {
    title: 'emf of a Daniell cell away from standard conditions',
    make(r) {
      const C = [0.001, 0.01, 0.05, 0.1, 0.5, 1, 2], i = Math.floor(r() * 7), zn = C[i], cu = C[(i + 1 + Math.floor(r() * 5)) % 7];
      const answer = 1.10 - (0.0591 / 2) * Math.log10(zn / cu);
      return { zn, cu,
        q: `<p>Find the emf at 298 K of the cell Zn | Zn<sup>2+</sup>(${zn} M) || Cu<sup>2+</sup>(${cu} M) | Cu. E°<sub>cell</sub> = 1.10 V.</p>`,
        answer, unit: 'V', tol: 0.002, abs: 0.002,
        hint: 'Cell reaction Zn + Cu²⁺ → Zn²⁺ + Cu, n = 2. Q = [Zn²⁺]/[Cu²⁺] (solids are left out). E = E° − (0.0591/n) log Q.',
        solution: steps(`Q = ${zn}/${cu} = ${n(zn / cu)}; log Q = ${n(Math.log10(zn / cu), 3)}.`, `E = 1.10 − (0.0591/2) × ${n(Math.log10(zn / cu), 3)}.`, `E = <b>${n(answer, 4)} V</b>.`) };
    },
    verify: (x) => 1.10 + 0.02955 * Math.log10(x.cu / x.zn),
  },
  'ec-faraday': {
    title: 'mass deposited by electrolysis',
    make(r) {
      const metals = [['silver', 'Ag⁺', 108, 1], ['copper', 'Cu²⁺', 63.5, 2], ['zinc', 'Zn²⁺', 65, 2], ['aluminium', 'Al³⁺', 27, 3], ['nickel', 'Ni²⁺', 58.7, 2]];
      const [name, ion, M, z] = metals[Math.floor(r() * metals.length)];
      const I = pick(r, 0.5, 10, 0.5), t = pick(r, 10, 120, 5);
      const Q = I * t * 60, answer = (Q / F / z) * M;
      return { I, t, M, z,
        q: `<p>A current of ${I} A is passed for ${t} minutes through a solution of ${ion} ions, with 100% efficiency. What mass of ${name} is deposited at the cathode? (M = ${M} g/mol, F = 96 500 C/mol)</p>`,
        answer, unit: 'g', tol: 0.005,
        hint: `Charge Q = I t (t in seconds). Moles of electrons = Q/F. Each ${ion} needs ${z} electron${z > 1 ? 's' : ''}.`,
        solution: steps(`Q = ${I} × ${t} × 60 = ${n(Q, 5)} C.`, `Moles of e⁻ = ${n(Q, 5)}/96 500 = ${n(Q / F, 4)} mol.`, `Moles of metal = ${n(Q / F, 4)}/${z} = ${n(Q / F / z, 4)} mol.`, `Mass = ${n(Q / F / z, 4)} × ${M} = <b>${n(answer)} g</b>.`) };
    },
    // equivalent-mass route: m = (M/z) × Q / F
    verify: (x) => (x.M / x.z) * (x.I * x.t * 60) / F,
  },
  'ec-weak-ka': {
    title: 'Ka of a weak acid from molar conductivity',
    make(r) {
      const L0 = pick(r, 360, 400, 1), c = [0.001, 0.002, 0.005, 0.01, 0.02, 0.05][Math.floor(r() * 6)], a = pick(r, 2, 15, 0.5) / 100;
      const Lm = +(a * L0).toFixed(2), alpha = Lm / L0, answer = ((c * alpha * alpha) / (1 - alpha)) * 1e5;
      return { L0, c, Lm,
        q: `<p>The molar conductivity of ${c} M acetic acid at 298 K is ${Lm} S cm<sup>2</sup> mol<sup>−1</sup>. Its limiting molar conductivity (from Kohlrausch's law) is ${L0} S cm<sup>2</sup> mol<sup>−1</sup>. Find K<sub>a</sub>, in units of 10<sup>−5</sup>.</p>`,
        answer, unit: '× 10⁻⁵', tol: 0.01,
        hint: 'Degree of dissociation α = Λm / Λ°m. Then Ka = cα²/(1 − α).',
        solution: steps(`α = ${Lm}/${L0} = ${n(alpha, 4)}.`, `K<sub>a</sub> = cα²/(1 − α) = ${c} × ${n(alpha, 4)}² / (1 − ${n(alpha, 4)}).`, `K<sub>a</sub> = ${n(answer / 1e5, 3)} = <b>${n(answer)} × 10<sup>−5</sup></b>.`) };
    },
    verify: (x) => (x.c * x.Lm * x.Lm) / (x.L0 * (x.L0 - x.Lm)) * 1e5,
  },
};

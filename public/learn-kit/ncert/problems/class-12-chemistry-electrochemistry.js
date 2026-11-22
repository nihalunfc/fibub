// Class 12 Chemistry, Chapter 2 Electrochemistry: live problems (original fibub questions). Ids start with c12c-echem-.
import { pick, choose, n, steps } from './_util.js';

const HC = [['Zn²⁺/Zn', -0.76], ['Fe²⁺/Fe', -0.44], ['Cu²⁺/Cu', 0.34], ['Ag⁺/Ag', 0.80], ['Mg²⁺/Mg', -2.37], ['Ni²⁺/Ni', -0.25]];
const METALS = [['copper', 63.5, 2], ['silver', 107.9, 1], ['aluminium', 27, 3], ['zinc', 65.4, 2], ['nickel', 58.7, 2]];
export default {
  'c12c-echem-ecell': {
    title: 'standard cell voltage',
    make(r) {
      const pairs = [[0, 2], [1, 3], [4, 2], [5, 3], [0, 3], [4, 1]], [a, c] = choose(r, pairs), E = HC[c][1] - HC[a][1];
      return { a, c, q: `<p>A cell is made from ${HC[a][0]} (E° = ${HC[a][1]} V) and ${HC[c][0]} (E° = ${HC[c][1]} V). Find E°<sub>cell</sub> in volts.</p>`, answer: E, unit: 'V', tol: 0.01,
        hint: 'The half-cell with the higher E° is the cathode. E°cell = E°(cathode) − E°(anode).',
        solution: steps(`Cathode (reduction): ${HC[c][0]}; anode (oxidation): ${HC[a][0]}.`, `E°cell = ${HC[c][1]} − (${HC[a][1]}) = <b>${n(E)} V</b>.`) };
    },
    verify: (x) => Math.abs(HC[x.c][1] - HC[x.a][1]),
  },
  'c12c-echem-nernst': {
    title: 'Nernst equation for the Daniell cell',
    make(r) {
      const zn = choose(r, [0.001, 0.01, 0.1, 1]), cu = choose(r, [0.001, 0.01, 0.1, 1]), E = 1.10 - 0.0592 / 2 * Math.log10(zn / cu);
      return { zn, cu, q: `<p>The Daniell cell Zn | Zn²⁺ (${zn} M) || Cu²⁺ (${cu} M) | Cu has E° = 1.10 V at 298 K. Find its emf using the Nernst equation, E = E° − (0.0592/n) log Q.</p>`, answer: E, unit: 'V', tol: 0.005,
        hint: 'n = 2 and Q = [Zn²⁺]/[Cu²⁺].',
        solution: steps(`Q = ${zn}/${cu} = ${n(zn / cu)}; log Q = ${n(Math.log10(zn / cu))}.`, `E = 1.10 − (0.0592/2) × (${n(Math.log10(zn / cu))}) = <b>${n(E, 4)} V</b>.`) };
    },
    verify: (x) => 1.10 - (8.314 * 298.15 / (2 * 96485)) * Math.log(x.zn / x.cu),
  },
  'c12c-echem-gibbs': {
    title: 'Gibbs energy of a cell reaction',
    make(r) {
      const nn = choose(r, [1, 2, 3, 6]), E = choose(r, [0.46, 0.76, 1.10, 1.56, 2.00]), dG = -nn * 96500 * E / 1000;
      return { nn, E, q: `<p>A cell reaction transfers ${nn} electron${nn > 1 ? 's' : ''} and the cell has E° = ${E} V. Find ΔG° in kJ/mol (F = 96500 C/mol). Give the magnitude of ΔG° (positive number).</p>`, answer: -dG, unit: 'kJ/mol', tol: 0.01,
        hint: 'ΔG° = −nFE°. Divide by 1000 to get kJ.',
        solution: steps(`ΔG° = −${nn} × 96500 × ${E} = ${n(dG * 1000)} J/mol.`, `That is ${n(dG)} kJ/mol; magnitude <b>${n(-dG)} kJ/mol</b>. Negative ΔG° means the reaction is spontaneous.`) };
    },
    verify: (x) => { const K = Math.pow(10, x.nn * x.E / (8.314 * 298 * Math.LN10 / 96500)); return (8.314 * 298 * Math.log(K)) / 1000; },
  },
  'c12c-echem-faraday': {
    title: "Faraday's first law: mass deposited",
    make(r) {
      const m = choose(r, METALS), I = choose(r, [1, 2, 2.5, 4, 5]), t = choose(r, [10, 20, 30, 45, 60]), g = I * t * 60 * m[1] / (m[2] * 96500);
      return { m, I, t, q: `<p>A current of ${I} A is passed for ${t} minutes through a solution of a ${m[0]} salt, giving ${m[0]} (molar mass ${m[1]} g/mol) at the cathode with ${m[2]} electron${m[2] > 1 ? 's' : ''} per ion. Find the mass deposited (F = 96500 C/mol).</p>`, answer: g, unit: 'g', tol: 0.01,
        hint: 'Q = It; moles of electrons = Q/F; moles of metal = moles of e⁻ ÷ n.',
        solution: steps(`Q = ${I} × ${t * 60} = ${n(I * t * 60)} C.`, `Moles of e⁻ = ${n(I * t * 60 / 96500, 4)}; moles of metal = ${n(I * t * 60 / 96500 / m[2], 4)}.`, `Mass = ${n(I * t * 60 / 96500 / m[2], 4)} × ${m[1]} = <b>${n(g)} g</b>.`) };
    },
    verify: (x) => (x.I * x.t * 60 / 96500 / x.m[2]) * x.m[1],
  },
  'c12c-echem-time': {
    title: 'time needed to deposit a given mass',
    make(r) {
      const m = choose(r, METALS.slice(0, 3)), I = choose(r, [2, 3, 5, 10]), g = choose(r, [1, 2, 5, 10]), t = g * m[2] * 96500 / (m[1] * I) / 60;
      return { m, I, g, q: `<p>How many minutes does it take a current of ${I} A to deposit ${g} g of ${m[0]} (molar mass ${m[1]} g/mol, ${m[2]} electrons per ion)? F = 96500 C/mol.</p>`, answer: t, unit: 'min', tol: 0.01,
        hint: 'Moles of metal × n gives moles of electrons; times F gives charge; divide by I for seconds.',
        solution: steps(`Moles of metal = ${g}/${m[1]} = ${n(g / m[1], 4)} mol; moles of e⁻ = ${n(g / m[1] * m[2], 4)} mol.`, `Q = ${n(g / m[1] * m[2], 4)} × 96500 = ${n(g / m[1] * m[2] * 96500)} C.`, `t = Q/I = ${n(g / m[1] * m[2] * 96500 / I)} s = <b>${n(t)} min</b>.`) };
    },
    verify: (x) => { const sec = (x.g / x.m[1]) * (x.m[2] * 96500) / x.I; return sec / 60; },
  },
  'c12c-echem-molar': {
    title: 'molar conductivity from resistance',
    make(r) {
      const R = choose(r, [200, 250, 400, 500, 550]), kc = choose(r, [0.5, 0.88, 1.25, 1.5]), c = choose(r, [0.01, 0.02, 0.05, 0.1]), L = (kc / R) * 1000 / c;
      return { R, kc, c, q: `<p>A conductivity cell with cell constant ${kc} cm⁻¹ is filled with ${c} mol/L of an electrolyte and its resistance is ${R} Ω. Find the molar conductivity Λ<sub>m</sub> in S cm² mol⁻¹.</p>`, answer: L, unit: 'S cm² mol⁻¹', tol: 0.01,
        hint: 'κ = cell constant / R (in S/cm); Λm = κ × 1000 / c.',
        solution: steps(`κ = ${kc}/${R} = ${n(kc / R, 4)} S/cm.`, `Λm = κ × 1000 / c = ${n(kc / R, 4)} × 1000 / ${c} = <b>${n(L)} S cm² mol⁻¹</b>.`) };
    },
    verify: (x) => { const G = 1 / x.R, kappa_m = G * x.kc * 100, cm3 = x.c * 1000; return (kappa_m / cm3) * 1e4; },
  },
  'c12c-echem-ka': {
    title: 'degree of dissociation and Ka of a weak acid',
    make(r) {
      const c = choose(r, [0.01, 0.02, 0.05, 0.1]), L = choose(r, [20, 30, 40, 50]), L0 = 390.5, a = L / L0, Ka = c * a * a / (1 - a);
      return { c, L, L0, q: `<p>A ${c} mol/L solution of ethanoic acid has molar conductivity ${L} S cm² mol⁻¹. Its limiting molar conductivity is ${L0} S cm² mol⁻¹. Find K<sub>a</sub> (give your answer in units of 10<sup>−5</sup>).</p>`, answer: Ka * 1e5, unit: '× 10⁻⁵', tol: 0.02,
        hint: 'α = Λm/Λ°m. Then K<sub>a</sub> = cα²/(1 − α).',
        solution: steps(`α = ${L}/${L0} = ${n(a, 4)}.`, `K<sub>a</sub> = ${c} × ${n(a, 4)}² / (1 − ${n(a, 4)}) = ${n(Ka, 3)} = <b>${n(Ka * 1e5)} × 10⁻⁵</b>.`) };
    },
    verify: (x) => { const a = x.L / x.L0, ion = x.c * a, left = x.c - ion; return (ion * ion / left) * 1e5; },
  },
};

// Class 11 Biology, Biomolecules: live problems (original fibub questions). Ids start with c11b-biomol-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c11b-biomol-peptide': {
    title: 'mass of a polypeptide',
    make(r) {
      const N = pick(r, 20, 200, 10), aa = choose(r, [110, 120, 128]);
      const m = N * aa - (N - 1) * 18;
      return { N, aa, q: `<p>A polypeptide has ${N} amino acids with an average mass of ${aa} Da each when free. Each peptide bond formed releases one molecule of water (18 Da). What is the mass of the polypeptide in Da?</p>`, answer: m, unit: 'Da', tol: 0.01,
        hint: 'A chain of N amino acids has N − 1 peptide bonds, so N − 1 water molecules are lost.',
        solution: steps(`Total free mass = ${N} × ${aa} = ${n(N * aa)} Da.`, `Peptide bonds = ${N} − 1 = ${N - 1}, water lost = ${N - 1} × 18 = ${n((N - 1) * 18)} Da.`, `Mass = ${n(N * aa)} − ${n((N - 1) * 18)} = <b>${n(m)} Da</b>.`) };
    },
    verify: (x) => (x.aa - 18) * x.N + 18,
  },
  'c11b-biomol-km': {
    title: 'enzyme rate from Vmax and Km',
    make(r) {
      const Vm = choose(r, [40, 60, 80, 100, 120]), Km = choose(r, [1, 2, 4, 5]), S = choose(r, [0.5, 1, 2, 5, 10, 20]);
      const v = Vm * S / (Km + S);
      return { Vm, Km, S, q: `<p>An enzyme has Vmax = ${Vm} µmol per minute and Km = ${Km} mM. What is its rate when the substrate concentration is ${S} mM?</p>`, answer: v, unit: 'µmol/min', tol: 0.02,
        hint: 'Michaelis-Menten: v = Vmax × [S] ÷ (Km + [S]).',
        solution: steps(`v = ${Vm} × ${S} ÷ (${Km} + ${S}).`, `v = ${n(Vm * S)} ÷ ${n(Km + S)} = <b>${n(v)} µmol/min</b>.`, S === Km ? 'Note: at [S] = Km the rate is exactly half of Vmax.' : `It is ${n(100 * v / Vm, 3)} % of Vmax.`) };
    },
    verify: (x) => 1 / (x.Km / x.Vm / x.S + 1 / x.Vm),
  },
  'c11b-biomol-tm': {
    title: 'melting temperature of a short DNA',
    make(r) {
      const N = choose(r, [12, 16, 20, 24]), gc = pick(r, 3, N - 3), at = N - gc;
      return { N, gc, at, q: `<p>A short DNA strand has ${N} bases, of which ${gc} are G or C. A rough rule for the melting temperature of short DNA is Tm = 2 × (number of A and T) + 4 × (number of G and C), in °C. Find Tm.</p>`, answer: 2 * at + 4 * gc, unit: '°C', tol: 0.01,
        hint: `A and T number ${N} − ${gc}.`,
        solution: steps(`A + T = ${N} − ${gc} = ${at}.`, `Tm = 2 × ${at} + 4 × ${gc} = ${2 * at} + ${4 * gc} = <b>${2 * at + 4 * gc} °C</b>.`, 'G-C pairs have 3 hydrogen bonds, A-T pairs have 2, so G-C-rich DNA melts at a higher temperature.') };
    },
    verify: (x) => 2 * x.N + 2 * x.gc,
  },
  'c11b-biomol-q10': {
    title: 'enzyme rate and temperature',
    make(r) {
      const t1 = choose(r, [10, 15, 20, 25]), dt = choose(r, [10, 20, 30]), v1 = choose(r, [2, 5, 8, 10]);
      return { t1, dt, v1, q: `<p>An enzyme works at ${v1} units per minute at ${t1} °C. If its rate doubles for every 10 °C rise (below the temperature at which it denatures), what is its rate at ${t1 + dt} °C?</p>`, answer: v1 * 2 ** (dt / 10), unit: 'units/min', tol: 0.02,
        hint: `The rise is ${dt} °C, which is ${dt / 10} steps of 10 °C. Double it for each step.`,
        solution: steps(`Rise = ${dt} °C = ${dt / 10} steps of 10 °C.`, `Rate = ${v1} × 2^${dt / 10} = ${v1} × ${2 ** (dt / 10)} = <b>${v1 * 2 ** (dt / 10)} units/min</b>.`) };
    },
    verify: (x) => x.v1 * Math.exp(((x.dt / 10) * Math.LN2)),
  },
  'c11b-biomol-chargaff': {
    title: 'base percentages in DNA (Chargaff)',
    make(r) {
      const A = pick(r, 15, 35, 1);
      return { A, q: `<p>In a double-stranded DNA, adenine makes up ${A} % of the bases. What percentage is guanine?</p>`, answer: 50 - A, unit: '%', tol: 0.01,
        hint: 'A pairs with T, so T = A. G pairs with C, so G = C. The four add to 100 %.',
        solution: steps(`T = A = ${A} %, so A + T = ${2 * A} %.`, `G + C = ${100 - 2 * A} %, and G = C.`, `G = <b>${50 - A} %</b>.`) };
    },
    verify: (x) => (100 - x.A - x.A) / 2,
  },
};

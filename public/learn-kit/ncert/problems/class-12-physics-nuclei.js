// Class 12 Physics, Nuclei: live problems (original fibub questions). Ids start with c12p-nuc-.
import { pick, choose, n, steps } from './_util.js';

const MH = 1.007825, MN = 1.008665, U = 931.5;
const NUCL = [['He-4', 2, 4, 4.002603], ['C-12', 6, 12, 12.0], ['O-16', 8, 16, 15.994915], ['Ca-40', 20, 40, 39.962591], ['Fe-56', 26, 56, 55.934936]];
const ISO = [['cobalt-60', 5.27, 'years', 60], ['strontium-90', 28.8, 'years', 90], ['iodine-131', 8.02, 'days', 131], ['caesium-137', 30.1, 'years', 137]];
const sci = (v, d = 3) => { const e = Math.floor(Math.log10(Math.abs(v))), m = v / 10 ** e; return `${(+m.toPrecision(d)).toString()} × 10<sup>${e < 0 ? '−' + -e : e}</sup>`; };

export default {
  'c12p-nuc-radius': {
    title: 'radius of a nucleus',
    make(r) {
      const A = choose(r, [8, 27, 64, 125, 216, 343]), R = 1.2 * Math.cbrt(A);
      return { A, q: `<p>Using R = R₀A<sup>1/3</sup> with R₀ = 1.2 fm, find the radius of a nucleus of mass number ${A} (in fm).</p>`, answer: R, unit: 'fm', tol: 0.01,
        hint: 'The cube root of A is a whole number here.', solution: steps(`A<sup>1/3</sup> = ${n(Math.cbrt(A))}.`, `R = 1.2 × ${n(Math.cbrt(A))} = <b>${n(R)} fm</b>.`, 'Compared with a hydrogen nucleus (A = 1, R = 1.2 fm), the radius is that many times bigger, while the volume is A times bigger.') };
    },
    verify: (x) => 1.2 * Math.exp(Math.log(x.A) / 3),
  },
  'c12p-nuc-binding': {
    title: 'binding energy per nucleon from atomic masses',
    make(r) {
      const [name, Z, A, M] = choose(r, NUCL), dm = Z * MH + (A - Z) * MN - M, be = dm * U / A;
      return { name, Z, A, M, q: `<p>The atomic mass of ${name} is ${M} u. Taking the mass of a hydrogen atom as ${MH} u and of a neutron as ${MN} u, find its binding energy per nucleon in MeV (1 u = ${U} MeV/c²).</p>`, answer: be, unit: 'MeV', tol: 0.02,
        hint: 'Mass defect = Z m(H) + (A − Z) m(n) − M(atom). Multiply by 931.5 and divide by A.',
        solution: steps(`Z = ${Z}, N = ${A - Z}.`, `Δm = ${Z}×${MH} + ${A - Z}×${MN} − ${M} = ${n(dm, 4)} u.`, `E = ${n(dm, 4)} × ${U} = ${n(dm * U)} MeV.`, `Per nucleon: ${n(dm * U)} ÷ ${A} = <b>${n(be)} MeV</b>.`) };
    },
    verify: (x) => { const kg = 1.66054e-27, c = 2.99792458e8, eV = 1.602177e-13; const parts = x.Z * MH + (x.A - x.Z) * MN; return ((parts - x.M) * kg * c * c / eV) / x.A; },
  },
  'c12p-nuc-halflife': {
    title: 'fraction left after some half-lives',
    make(r) {
      const T = choose(r, [2, 3, 5, 8, 12]), k = pick(r, 2, 6, 1) * 0.5 + 0.5, t = T * k, left = 100 * 0.5 ** k;
      return { T, k, q: `<p>A radioactive sample has a half-life of ${T} days. What percentage of the original nuclei is left after ${n(t)} days?</p>`, answer: left, unit: '%', tol: 0.02,
        hint: 'Number of half-lives = t/T. Each one halves the sample: N/N₀ = (½)^(t/T).',
        solution: steps(`t/T = ${n(t)}/${T} = ${n(k)} half-lives.`, `N/N₀ = (½)<sup>${n(k)}</sup> = ${n(left / 100, 4)}.`, `So <b>${n(left)} %</b> is left.`) };
    },
    verify: (x) => 100 * Math.exp(-Math.LN2 / x.T * (x.T * x.k)),
  },
  'c12p-nuc-activity': {
    title: 'activity of a radioactive sample',
    make(r) {
      const [name, T, unit, M] = choose(r, ISO), ug = pick(r, 1, 10, 1), Ts = unit === 'years' ? T * 3.156e7 : T * 86400, N = ug * 1e-6 / M * 6.022e23, A = Math.LN2 / Ts * N / 1e6;
      return { name, T, tunit: unit, M, ug, q: `<p>A sample contains ${ug} µg of pure ${name} (mass number ${M}, half-life ${T} ${unit}). Find its activity in megabecquerel (MBq). Use N<sub>A</sub> = 6.022 × 10<sup>23</sup> per mole, 1 year = 3.156 × 10<sup>7</sup> s.</p>`, answer: A, unit: 'MBq', tol: 0.02,
        hint: 'Number of atoms N = (mass/M) N<sub>A</sub>; λ = 0.693/T in s⁻¹; activity = λN.',
        solution: steps(`N = ${ug}×10<sup>−6</sup>/${M} × 6.022×10<sup>23</sup> = ${sci(N)} atoms.`, `T = ${sci(Ts)} s, λ = 0.693/T = ${sci(Math.LN2 / Ts)} s⁻¹.`, `R = λN = ${sci(A * 1e6)} Bq = <b>${n(A)} MBq</b>.`) };
    },
    verify: (x) => { const Ts = x.tunit === 'years' ? x.T * 3.156e7 : x.T * 86400; const tau = Ts / Math.LN2; return (x.ug * 1e-6 / x.M * 6.022e23 / tau) / 1e6; },
  },
  'c12p-nuc-decay': {
    title: 'atomic number after alpha and beta decays',
    make(r) {
      const a = pick(r, 1, 4, 1), b = pick(r, 1, 4, 1), Z = 92, A = 238, Z2 = Z - 2 * a + b, A2 = A - 4 * a;
      return { a, b, q: `<p>A uranium nucleus ²³⁸₉₂U emits ${a} alpha particle${a > 1 ? 's' : ''} and ${b} beta-minus particle${b > 1 ? 's' : ''}. What is the atomic number of the nucleus that is left?</p>`, answer: Z2, unit: '', tol: 0, abs: 0.01,
        hint: 'Alpha: Z falls by 2, A by 4. Beta minus: Z rises by 1, A unchanged.',
        solution: steps(`After ${a} α: Z = 92 − 2×${a} = ${92 - 2 * a}, A = 238 − 4×${a} = ${A2}.`, `After ${b} β⁻: Z = ${92 - 2 * a} + ${b} = <b>${Z2}</b>.`) };
    },
    verify: (x) => { let z = 92; for (let i = 0; i < x.a; i++) z -= 2; for (let i = 0; i < x.b; i++) z += 1; return z; },
  },
  'c12p-nuc-reactor': {
    title: 'fissions per second in a reactor',
    make(r) {
      const MW = choose(r, [200, 500, 1000, 1500]), f = MW * 1e6 / (200 * 1.602e-13) / 1e19;
      return { MW, q: `<p>A nuclear reactor produces ${MW} MW of heat and each fission of U-235 releases 200 MeV (1 eV = 1.602 × 10<sup>−19</sup> J). How many fissions happen per second, in units of 10<sup>19</sup>?</p>`, answer: f, unit: '× 10¹⁹ per second', tol: 0.02,
        hint: 'Energy per fission in joules = 200 × 10⁶ × 1.602 × 10⁻¹⁹. Divide the power by it.',
        solution: steps(`Energy per fission = 200×10<sup>6</sup> × 1.602×10<sup>−19</sup> = 3.204×10<sup>−11</sup> J.`, `Fissions per second = ${MW}×10<sup>6</sup> ÷ 3.204×10<sup>−11</sup> = <b>${n(f)} × 10<sup>19</sup></b>.`) };
    },
    verify: (x) => { return (x.MW * 1e6 / (200e6 * 1.602e-19)) / 1e19; },
  },
};

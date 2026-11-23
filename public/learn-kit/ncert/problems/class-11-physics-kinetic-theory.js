// Class 11 Physics, Kinetic Theory: live problems (original fibub questions). Ids start with c11p-kin-.
import { pick, choose, n, steps } from './_util.js';

const R = 8.314, kB = 1.38e-23, NA = 6.022e23;
const sci = (v, d = 3) => { const e = Math.floor(Math.log10(Math.abs(v))), m = v / 10 ** e; return `${(+m.toPrecision(d)).toString()} × 10<sup>${e < 0 ? '−' + -e : e}</sup>`; };
const GAS = [['hydrogen', 2.016], ['helium', 4.003], ['nitrogen', 28.0], ['oxygen', 32.0], ['carbon dioxide', 44.0]];

export default {
  'c11p-kin-ideal': {
    title: 'pressure of a gas from PV = nRT',
    make(r) {
      const mol = choose(r, [0.5, 1, 2, 3]), T = pick(r, 250, 450, 25), V = choose(r, [10, 20, 25, 40]), P = mol * R * T / (V / 1000);
      return { mol, T, V, q: `<p>${mol} mol of an ideal gas is kept in a ${V} litre cylinder at ${T} K. Find its pressure in kPa. (R = 8.314 J/(mol K).)</p>`, answer: P / 1000, unit: 'kPa', tol: 0.01,
        hint: 'PV = nRT with V in m³ (1 litre = 10⁻³ m³).',
        solution: steps(`V = ${V} L = ${V / 1000} m³.`, `P = nRT/V = ${mol} × 8.314 × ${T} ÷ ${V / 1000} = ${n(P)} Pa = <b>${n(P / 1000)} kPa</b>.`) };
    },
    verify: (x) => (x.mol * 6.022e23 * 1.380649e-23 * x.T) / (x.V * 1e-3) / 1000,
  },
  'c11p-kin-boyle': {
    title: 'squeezing a gas at constant temperature',
    make(r) {
      const P1 = pick(r, 1, 3, 0.5), V1 = pick(r, 4, 12, 2), f = choose(r, [2, 4, 5]), V2 = V1 / f;
      return { P1, V1, f, q: `<p>A bicycle pump holds ${V1} cm³ of air at ${P1} atm. The air is compressed slowly (temperature constant) to 1/${f} of its volume. What is the new pressure in atm?</p>`, answer: P1 * f, unit: 'atm', tol: 0.01,
        hint: 'Boyle’s law: P₁V₁ = P₂V₂.',
        solution: steps(`P₂ = P₁V₁/V₂ = ${P1} × ${V1} ÷ ${V2}.`, `P₂ = <b>${n(P1 * f)} atm</b>: ${f} times the pressure, because the same molecules hit a wall ${f} times smaller more often.`) };
    },
    verify: (x) => x.P1 * x.V1 / (x.V1 / x.f),
  },
  'c11p-kin-rms': {
    title: 'rms speed of molecules',
    make(r) {
      const g = choose(r, GAS), T = pick(r, 200, 600, 50), v = Math.sqrt(3 * R * T / (g[1] * 1e-3));
      return { M: g[1], T, q: `<p>Find the rms speed of ${g[0]} molecules (molar mass ${g[1]} g/mol) at ${T} K. Use R = 8.314 J/(mol K). Answer in m/s.</p>`, answer: v, unit: 'm/s', tol: 0.01,
        hint: 'v_rms = √(3RT/M) with M in kg/mol.',
        solution: steps(`M = ${g[1]} g/mol = ${g[1] / 1000} kg/mol.`, `v_rms = √(3 × 8.314 × ${T} ÷ ${g[1] / 1000}) = <b>${n(v)} m/s</b>.`) };
    },
    verify: (x) => { const m = x.M * 1e-3 / 6.022e23; return Math.sqrt(3 * 1.380649e-23 * x.T / m); },
  },
  'c11p-kin-rmsratio': {
    title: 'comparing rms speeds of two gases',
    make(r) {
      const a = choose(r, [['hydrogen', 2.016], ['helium', 4.003]]), b = choose(r, [['oxygen', 32.0], ['nitrogen', 28.0], ['carbon dioxide', 44.0]]);
      return { Ma: a[1], Mb: b[1], q: `<p>At the same temperature, how many times faster (rms) are ${a[0]} molecules (M = ${a[1]}) than ${b[0]} molecules (M = ${b[1]})?</p>`, answer: Math.sqrt(b[1] / a[1]), unit: '×', tol: 0.01,
        hint: 'At one temperature v_rms ∝ 1/√M.',
        solution: steps(`v_rms = √(3kT/m), so the ratio is √(M<sub>b</sub>/M<sub>a</sub>).`, `√(${b[1]} ÷ ${a[1]}) = <b>${n(Math.sqrt(b[1] / a[1]))}</b>.`) };
    },
    verify: (x) => Math.exp(0.5 * (Math.log(x.Mb) - Math.log(x.Ma))),
  },
  'c11p-kin-ke': {
    title: 'average kinetic energy of a molecule',
    make(r) {
      const T = pick(r, 100, 900, 50), E = 1.5 * kB * T;
      return { T, q: `<p>Find the average translational kinetic energy of one gas molecule at ${T} K, in units of 10<sup>−21</sup> J. (k = 1.38 × 10<sup>−23</sup> J/K.)</p>`, answer: E * 1e21, unit: '× 10⁻²¹ J', tol: 0.01,
        hint: 'Mean translational KE = (3/2) k T, the same for every ideal gas.',
        solution: steps(`E = (3/2) k T = 1.5 × 1.38×10<sup>−23</sup> × ${T}.`, `E = ${sci(E)} J = <b>${n(E * 1e21)} × 10<sup>−21</sup> J</b>.`) };
    },
    verify: (x) => (3 / 2) * (8.314 / 6.022e23) * x.T * 1e21,
  },
  'c11p-kin-cv': {
    title: 'heat needed to warm a gas',
    make(r) {
      const g = choose(r, [['monatomic', 3], ['diatomic (rigid)', 5]]), mol = choose(r, [1, 2, 3, 4]), dT = pick(r, 10, 60, 10), Q = mol * (g[1] / 2) * R * dT;
      return { f: g[1], mol, dT, q: `<p>How much heat is needed to raise the temperature of ${mol} mol of a ${g[0]} ideal gas by ${dT} K at constant volume? (R = 8.314 J/(mol K).)</p>`, answer: Q, unit: 'J', tol: 0.01,
        hint: 'C_v = (f/2) R with f = 3 for a monatomic and 5 for a rigid diatomic gas. Q = n C_v ΔT.',
        solution: steps(`f = ${g[1]}, so C<sub>v</sub> = ${g[1]}/2 × 8.314 = ${n(g[1] / 2 * R)} J/(mol K).`, `Q = n C<sub>v</sub> ΔT = ${mol} × ${n(g[1] / 2 * R)} × ${dT} = <b>${n(Q)} J</b>.`) };
    },
    verify: (x) => (x.mol * x.dT * (x.f * 8.314)) / 2,
  },
  'c11p-kin-mfp': {
    title: 'mean free path',
    make(r) {
      const d = choose(r, [0.2, 0.25, 0.3, 0.4]), nn = choose(r, [1, 2, 2.7, 5]), lam = 1 / (Math.SQRT2 * Math.PI * (d * 1e-9) ** 2 * nn * 1e25);
      return { d, nn, q: `<p>Molecules of diameter ${d} nm are present at ${nn} × 10<sup>25</sup> per m³. Find the mean free path in nanometres.</p>`, answer: lam * 1e9, unit: 'nm', tol: 0.01,
        hint: 'λ = 1/(√2 π d² n). Convert d to metres.',
        solution: steps(`d = ${d}×10<sup>−9</sup> m, n = ${nn}×10<sup>25</sup> m<sup>−3</sup>.`, `λ = 1/(1.414 × 3.142 × (${d}×10<sup>−9</sup>)² × ${nn}×10<sup>25</sup>) = ${sci(lam)} m = <b>${n(lam * 1e9)} nm</b>.`) };
    },
    verify: (x) => { const nm = x.nn * 1e25, A = Math.PI * (x.d * 1e-9) ** 2; return 1e9 / (Math.sqrt(2) * A * nm); },
  },
  'c11p-kin-gamma': {
    title: 'ratio of specific heats',
    make(r) {
      const f = choose(r, [3, 5, 6, 7]), g = 1 + 2 / f;
      return { f, q: `<p>A gas molecule has ${f} degrees of freedom that are active. Find γ = C<sub>p</sub>/C<sub>v</sub> for this ideal gas.</p>`, answer: g, unit: '', tol: 0.01,
        hint: 'C_v = (f/2)R, C_p = C_v + R.',
        solution: steps(`C<sub>v</sub> = (${f}/2)R, C<sub>p</sub> = (${f}/2 + 1)R.`, `γ = (f + 2)/f = ${f + 2}/${f} = <b>${n(g)}</b>.`) };
    },
    verify: (x) => ((x.f / 2) * 8.314 + 8.314) / ((x.f / 2) * 8.314),
  },
};

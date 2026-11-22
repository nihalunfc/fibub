// Live problems for Nuclei and radioactivity.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const MH = 1.007825, MN = 1.008665, U = 931.5;
// atomic masses (u) from the AME2020 atomic mass evaluation, rounded
const NUC = [['helium-4', '⁴He', 2, 4, 4.002603], ['lithium-7', '⁷Li', 3, 7, 7.016003], ['carbon-12', '¹²C', 6, 12, 12], ['oxygen-16', '¹⁶O', 8, 16, 15.994915], ['iron-56', '⁵⁶Fe', 26, 56, 55.934936], ['nitrogen-14', '¹⁴N', 7, 14, 14.003074]];

export default {
  'nu-binding': {
    title: 'binding energy per nucleon from masses',
    make(r) {
      const i = Math.floor(r() * NUC.length), [name, sym, Z, A, M] = NUC[i];
      const dm = Z * MH + (A - Z) * MN - M, answer = (dm * U) / A;
      return { i,
        q: `<p>The atomic mass of ${name} (${sym}, Z = ${Z}) is ${M} u. Using m(¹H) = ${MH} u, m(n) = ${MN} u and 1 u = ${U} MeV/c², find its binding energy per nucleon, in MeV.</p>`,
        answer, unit: 'MeV', tol: 0.005,
        hint: 'Mass defect = Z m(¹H) + (A − Z) m(n) − M(atom). Using hydrogen atoms instead of bare protons makes the electron masses cancel. Then B = Δm × 931.5 MeV, and divide by A.',
        solution: steps(`Δm = ${Z} × ${MH} + ${A - Z} × ${MN} − ${M} = ${n(dm, 5)} u.`, `B = ${n(dm, 5)} × ${U} = ${n(dm * U, 4)} MeV.`, `B/A = ${n(dm * U, 4)}/${A} = <b>${n(answer)} MeV per nucleon</b>.`) };
    },
    verify: (x) => { // the same mass defect turned into energy with E = mc² in SI units
      const [, , Z, A, M] = NUC[x.i], dm = (Z * MH + (A - Z) * MN - M) * 1.66054e-27; return (dm * 2.99792e8 ** 2) / 1.602177e-13 / A;
    },
  },
  'nu-remaining': {
    title: 'mass of a radioactive sample left after some time',
    make(r) {
      const m0 = pick(r, 10, 200, 10), T = pick(r, 2, 30, 2), t = pick(r, 1, 100);
      const answer = m0 * Math.pow(0.5, t / T);
      return { m0, T, t,
        q: `<p>A sample contains ${m0} mg of a radioactive isotope with a half-life of ${T} days. How much of it is left after ${t} days, in mg?</p>`,
        answer, unit: 'mg', tol: 0.005,
        hint: 'After t, the amount is m₀ × (½)^(t/T). Count how many half-lives have passed (it need not be a whole number).',
        solution: steps(`Number of half-lives = ${t}/${T} = ${n(t / T, 4)}.`, `m = ${m0} × (½)^${n(t / T, 4)} = <b>${n(answer)} mg</b>.`) };
    },
    verify: (x) => x.m0 * Math.exp((-Math.LN2 / x.T) * x.t),
  },
  'nu-dating': {
    title: 'age from carbon-14 activity',
    make(r) {
      const ratio = pick(r, 0.05, 0.9, 0.05);
      const answer = (5730 * Math.log(1 / ratio)) / Math.LN2;
      return { ratio,
        q: `<p>Carbon in an old piece of wood shows ${n(ratio * 100)}% of the carbon-14 activity of fresh wood. How old is it, in years? (Half-life of carbon-14 = 5730 years.)</p>`,
        answer, unit: 'years', tol: 0.005,
        hint: 'A = A₀e^(−λt) with λ = ln 2/5730 per year. So t = (5730/ln 2) × ln(A₀/A).',
        solution: steps(`A₀/A = 1/${ratio} = ${n(1 / ratio, 4)}.`, `t = 5730 × ln(${n(1 / ratio, 4)})/0.693 = <b>${n(answer, 4)} years</b>.`) };
    },
    verify: (x) => { let lo = 0, hi = 1e6; for (let i = 0; i < 100; i++) { const mid = (lo + hi) / 2; Math.pow(0.5, mid / 5730) > x.ratio ? (lo = mid) : (hi = mid); } return lo; },
  },
};

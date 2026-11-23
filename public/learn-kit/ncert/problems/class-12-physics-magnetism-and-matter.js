// Class 12 Physics, Magnetism and Matter: live problems (original fibub questions). Ids start with c12p-matter-.
import { pick, choose, n, steps } from './_util.js';

const MU0 = 4e-7 * Math.PI;
const rd = (d) => (d * Math.PI) / 180;

export default {
  'c12p-matter-axial': {
    title: 'field of a short bar magnet on its axis',
    make(r) {
      const m = pick(r, 0.5, 8, 0.5), d = pick(r, 30, 80, 5), answer = (1e-7 * 2 * m) / Math.pow(d / 100, 3) * 1e6;
      return { m, d, q: `<p>A small bar magnet has a magnetic moment of ${m} A m². Find the magnetic field it produces at a point ${d} cm from its centre, on its axis, in microtesla. (The magnet is much shorter than ${d} cm.)</p>`, answer, unit: 'µT', tol: 0.01,
        hint: 'B(axial) = (μ0/4π) × 2m/r³, with μ0/4π = 10⁻⁷ in SI units.',
        solution: steps(`B = (μ0/4π)(2m/r³) = 10⁻⁷ × 2 × ${m} ÷ (${d / 100} m)³.`, `B = <b>${n(answer)} µT</b>, along the direction of m.`) };
    },
    verify: (x) => { const l = 0.005, qm = x.m / (2 * l), r = x.d / 100; return 1e-7 * qm * (1 / (r - l) ** 2 - 1 / (r + l) ** 2) * 1e6; },
  },
  'c12p-matter-equatorial': {
    title: 'field on the equatorial line',
    make(r) {
      const m = pick(r, 0.5, 8, 0.5), d = pick(r, 30, 80, 5), answer = (1e-7 * m) / Math.pow(d / 100, 3) * 1e6;
      return { m, d, q: `<p>The same sort of small magnet (m = ${m} A m²) is used again. Find the field at a point ${d} cm from its centre on the equatorial line (the line through the centre at right angles to the axis), in microtesla.</p>`, answer, unit: 'µT', tol: 0.01,
        hint: 'B(equatorial) = (μ0/4π) × m/r³: half the axial value at the same distance, and it points opposite to m.',
        solution: steps(`B = (μ0/4π)(m/r³) = 10⁻⁷ × ${m} ÷ (${d / 100} m)³.`, `B = <b>${n(answer)} µT</b>, opposite to m.`) };
    },
    verify: (x) => { const l = 0.005, qm = x.m / (2 * l), r = x.d / 100, rr = Math.sqrt(r * r + l * l); return 1e-7 * qm * 2 * l / (rr ** 3) * 1e6; },
  },
  'c12p-matter-torque': {
    title: 'torque on a magnet in a field',
    make(r) {
      const m = pick(r, 0.5, 5, 0.5), B = pick(r, 0.1, 1, 0.1), th = choose(r, [30, 37, 45, 53, 60, 90]), answer = m * B * Math.sin(rd(th));
      return { m, B, th, q: `<p>A bar magnet of moment ${m} A m² is held at ${th}° to a uniform magnetic field of ${n(B)} T. Find the torque on it, in newton metres.</p>`, answer, unit: 'N m', tol: 0.01,
        hint: 'τ = m B sin θ.', solution: steps(`τ = m B sin θ = ${m} × ${n(B)} × sin ${th}°.`, `τ = <b>${n(answer)} N m</b>.`) };
    },
    verify: (x) => Math.abs(x.m * Math.cos(rd(x.th)) * 0 - x.m * Math.sin(rd(x.th)) * x.B),
  },
  'c12p-matter-work': {
    title: 'work to turn a magnet',
    make(r) {
      const m = pick(r, 0.5, 5, 0.5), B = pick(r, 0.1, 1, 0.1), th = choose(r, [60, 90, 120, 180]), answer = m * B * (1 - Math.cos(rd(th)));
      return { m, B, th, q: `<p>A magnet of moment ${m} A m² lies along a uniform field of ${n(B)} T. How much work must you do to turn it through ${th}°, in joules?</p>`, answer, unit: 'J', tol: 0.01,
        hint: 'W = U(final) − U(initial), with U = −m B cos θ. It starts at θ = 0.',
        solution: steps(`U = −mB cos θ. Start: −${n(m * B)} J. End: −${n(m * B)} × cos ${th}° = ${n(-m * B * Math.cos(rd(th)))} J.`, `W = ΔU = <b>${n(answer)} J</b>.`) };
    },
    verify: (x) => -x.m * x.B * Math.cos(rd(x.th)) - -x.m * x.B * Math.cos(0),
  },
  'c12p-matter-chi': {
    title: 'B inside a magnetic material',
    make(r) {
      const H = pick(r, 200, 2000, 100), chi = choose(r, [2e-5, 5e-4, 99, 499, 1999]), answer = MU0 * (1 + chi) * H * 1e3, chiS = chi >= 1 ? String(chi) : chi.toExponential(0).replace(/e-(\d+)/, (_, d) => ' × 10⁻' + [...d].map((c) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[c]).join(''));
      return { H, chi, q: `<p>A material of susceptibility χ = ${chiS} fills a solenoid, where the magnetic intensity is H = ${H} A/m. Find B in the material, in millitesla. (μ0 = 4π×10⁻⁷ T m/A.)</p>`, answer, unit: 'mT', tol: 0.01,
        hint: 'B = μ0 (H + M) and M = χ H, so B = μ0 (1 + χ) H.',
        solution: steps(`M = χ H = ${chiS} × ${H} A/m.`, `B = μ0 (H + M) = μ0 (1 + χ) H = 4π×10⁻⁷ × ${n(1 + chi, 5)} × ${H}.`, `B = <b>${n(answer)} mT</b>.`) };
    },
    verify: (x) => MU0 * (x.H + x.chi * x.H) * 1e3,
  },
  'c12p-matter-curie': {
    title: 'Curie’s law for a paramagnet',
    make(r) {
      const T1 = choose(r, [100, 150, 200, 250, 300]), T2 = choose(r, [400, 450, 500, 600]), chi1 = pick(r, 2, 9, 1), answer = chi1 * T1 / T2;
      return { T1, T2, chi1, q: `<p>A paramagnetic salt has susceptibility ${chi1}×10⁻⁴ at ${T1} K. What is its susceptibility at ${T2} K, in units of 10⁻⁴?</p>`, answer, unit: '×10⁻⁴', tol: 0.01,
        hint: 'Curie’s law: χ = C/T, so χ × T stays the same.', solution: steps(`C = χ₁T₁ = ${chi1}×10⁻⁴ × ${T1}.`, `χ₂ = C/T₂ = ${chi1} × ${T1} ÷ ${T2} (×10⁻⁴) = <b>${n(answer)}×10⁻⁴</b>.`) };
    },
    verify: (x) => { const C = x.chi1 * x.T1; return C / x.T2; },
  },
  'c12p-matter-period': {
    title: 'period of a magnet swinging in a field',
    make(r) {
      const m = pick(r, 1, 4, 1), B = pick(r, 0.1, 0.5, 0.1), J = choose(r, [0.01, 0.02, 0.04, 0.08]), answer = 2 * Math.PI * Math.sqrt(J / (m * B));
      return { m, B, J, q: `<p>A bar magnet (m = ${m} A m², moment of inertia ${J} kg m²) is free to turn in a uniform field of ${n(B)} T. Find the period of its small oscillations, in seconds.</p>`, answer, unit: 's', tol: 0.01,
        hint: 'For small angles τ = −mBθ, like a spring: T = 2π√(J/mB).', solution: steps(`T = 2π√(J/(mB)) = 2π√(${J} ÷ (${m} × ${n(B)})).`, `T = <b>${n(answer)} s</b>.`) };
    },
    verify: (x) => 1 / ((1 / (2 * Math.PI)) * Math.sqrt((x.m * x.B) / x.J)),
  },
};

// Live problems for Magnetism and matter.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const MU0 = 4 * Math.PI * 1e-7;

export default {
  'mm-oscillation': {
    title: 'period of a magnet swinging in a field',
    make(r) {
      const I = pick(r, 1, 9), m = pick(r, 1, 10), B = pick(r, 0.1, 2, 0.1);
      const answer = 2 * Math.PI * Math.sqrt((I * 1e-5) / (m * B * 1e-3));
      return { I, m, B,
        q: `<p>A bar magnet of magnetic moment ${m} A m² and moment of inertia ${I} × 10⁻⁵ kg m² hangs so it can turn freely in a horizontal uniform field of ${B} mT. Find the period of its small oscillations, in s.</p>`,
        answer, unit: 's', tol: 0.005,
        hint: 'For a small twist θ the restoring torque is mB sin θ ≈ mBθ, like a torsion pendulum: T = 2π√(I/(mB)).',
        solution: steps(`mB = ${m} × ${B} × 10⁻³ = ${n(m * B * 1e-3)} N m.`, `T = 2π√(${I} × 10⁻⁵ / ${n(m * B * 1e-3)}) = <b>${n(answer)} s</b>.`, 'A stronger field or a stronger magnet makes it swing faster.') };
    },
    verify: (x) => { const w = Math.sqrt((x.m * x.B * 1e-3) / (x.I * 1e-5)); return (2 * Math.PI) / w; },
  },
  'mm-core': {
    title: 'field inside a solenoid with an iron core',
    make(r) {
      const N = pick(r, 200, 2000, 100), I = pick(r, 0.5, 5, 0.5), mr = pick(r, 100, 2000, 100);
      const answer = MU0 * mr * N * I;
      return { N, I, mr,
        q: `<p>A long solenoid has ${N} turns per metre and carries ${I} A. Its core has relative permeability ${mr}. What is the magnetic field B inside the core, in T? (μ₀ = 4π × 10⁻⁷ T m/A)</p>`,
        answer, unit: 'T', tol: 0.005,
        hint: 'H = nI is set by the current alone. B = μ₀μ<sub>r</sub>H.',
        solution: steps(`H = nI = ${N} × ${I} = ${n(N * I)} A/m.`, `B = μ₀μ<sub>r</sub>H = 4π × 10⁻⁷ × ${mr} × ${n(N * I)} = <b>${n(answer)} T</b>.`, `The magnetisation is M = (μ<sub>r</sub> − 1)H = ${n((mr - 1) * N * I)} A/m: nearly all the field comes from the iron's aligned atoms. (A real core saturates near 2 T.)`) };
    },
    verify: (x) => { const H = x.N * x.I, M = (x.mr - 1) * H; return MU0 * (H + M); },
  },
  'mm-neutral': {
    title: 'neutral point of a bar magnet in the Earth\'s field',
    make(r) {
      const m = pick(r, 1, 20), BH = pick(r, 30, 40);
      const answer = Math.cbrt((1e-7 * m) / (BH * 1e-6)) * 100;
      return { m, BH,
        q: `<p>A short bar magnet of moment ${m} A m² lies flat with its north pole pointing geographic north. The horizontal component of the Earth's field is ${BH} µT. How far from the magnet's centre are the neutral points, in cm?</p>`,
        answer, unit: 'cm', tol: 0.005,
        hint: 'With N pointing north, the magnet\'s field on its equatorial line points south, against the Earth\'s. Set μ₀m/(4πr³) = B<sub>H</sub>.',
        solution: steps(`The neutral points lie on the equatorial line (east and west of the magnet).`, `r³ = (μ₀/4π) m/B<sub>H</sub> = 10⁻⁷ × ${m} / (${BH} × 10⁻⁶) = ${n((1e-7 * m) / (BH * 1e-6))} m³.`, `r = <b>${n(answer)} cm</b>.`) };
    },
    verify: (x) => { // search outward for the distance where the equatorial field equals B_H
      let lo = 0.001, hi = 10; for (let i = 0; i < 80; i++) { const mid = (lo + hi) / 2; (1e-7 * x.m) / mid ** 3 > x.BH * 1e-6 ? (lo = mid) : (hi = mid); }
      return lo * 100;
    },
  },
};

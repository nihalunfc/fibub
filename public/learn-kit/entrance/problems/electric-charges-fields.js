// Live problems for Electric charges, fields and Gauss's law.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const sci = (v, d = 3) => { const e = Math.floor(Math.log10(Math.abs(v))); return `${+(v / 10 ** e).toPrecision(d)} × 10<sup>${e}</sup>`; };
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const K = 9e9;

export default {
  'ef-null-point': {
    title: 'where the field of two like charges is zero',
    make(r) {
      const sq = [[1, 4], [1, 9], [4, 9], [1, 16], [4, 1], [9, 4], [9, 1], [16, 9]][Math.floor(r() * 8)];
      const [q1, q2] = sq, d = pick(r, 10, 60, 5);
      const answer = (d * Math.sqrt(q1)) / (Math.sqrt(q1) + Math.sqrt(q2));
      return { q1, q2, d,
        q: `<p>Two positive point charges, +${q1} µC and +${q2} µC, are ${d} cm apart. How far from the ${q1} µC charge is the electric field zero?</p>`,
        answer, unit: 'cm', tol: 0.005,
        hint: 'For like charges the null point lies between them, nearer the smaller charge. Set kq₁/x² = kq₂/(d − x) and take square roots.',
        solution: steps(`Let the point be x from the ${q1} µC charge: ${q1}/x² = ${q2}/(${d} − x)².`, `Square roots: √${q1}/x = √${q2}/(${d} − x) ⇒ x = ${d} × √${q1}/(√${q1} + √${q2}).`, `x = ${d} × ${n(Math.sqrt(q1))}/${n(Math.sqrt(q1) + Math.sqrt(q2))} = <b>${n(answer)} cm</b>.`) };
    },
    verify: (x) => x.d / (1 + Math.sqrt(x.q2 / x.q1)),
  },
  'ef-dipole-torque': {
    title: 'torque on a dipole in a uniform field',
    make(r) {
      const q = pick(r, 1, 9), s = pick(r, 2, 20, 2), E = pick(r, 1, 9), th = [30, 45, 60, 90, 120, 150][Math.floor(r() * 6)];
      const p = q * 1e-6 * s * 1e-3, answer = p * E * 1e5 * Math.sin((th * Math.PI) / 180) * 1e3;
      return { qq: q, s, E, th,
        q: `<p>A dipole is made of charges ±${q} µC held ${s} mm apart. It sits in a uniform field of ${E} × 10⁵ N/C, with its axis at ${th}° to the field. What torque acts on it, in mN m (millinewton metre)?</p>`,
        answer, unit: 'mN m', tol: 0.005,
        hint: 'Dipole moment p = q × (separation). Torque τ = pE sin θ.',
        solution: steps(`p = ${q} × 10⁻⁶ × ${s} × 10⁻³ = ${sci(p)} C m.`, `τ = pE sin θ = ${sci(p)} × ${E} × 10⁵ × sin ${th}°.`, `τ = ${n(answer / 1e3)} N m = <b>${n(answer)} mN m</b>. (The net force is zero in a uniform field; only the turning effect remains.)`) };
    },
    verify: (x) => { // two forces qE, each at perpendicular distance (s/2) sin θ from the centre
      const F = x.qq * 1e-6 * x.E * 1e5, arm = (x.s * 1e-3) / 2 * Math.sin((x.th * Math.PI) / 180);
      return 2 * F * arm * 1e3;
    },
  },
  'ef-gauss-sphere': {
    title: 'field of a uniformly charged solid sphere',
    make(r) {
      const Q = pick(r, 1, 9), R = pick(r, 5, 20, 5), inside = r() < 0.5, rr = inside ? pick(r, 1, R - 1) : pick(r, R + 5, R + 40, 5);
      const Rm = R / 100, rm = rr / 100;
      const answer = (inside ? (K * Q * 1e-6 * rm) / Rm ** 3 : (K * Q * 1e-6) / rm ** 2) / 1e3;
      return { Q, R, rr,
        q: `<p>A non-conducting sphere of radius ${R} cm carries ${Q} µC spread evenly through its volume. What is the electric field ${rr} cm from its centre, in kN/C? (k = 9 × 10⁹ N m²/C²)</p>`,
        answer, unit: 'kN/C', tol: 0.005,
        hint: inside ? 'The point is inside. Draw a Gaussian sphere through it: only the charge inside that sphere counts, Q(r/R)³.' : 'The point is outside, so the sphere acts as if all its charge sat at the centre.',
        solution: inside
          ? steps(`Charge inside radius r: Q(r/R)³ = ${Q} × (${rr}/${R})³ µC.`, 'Gauss: E × 4πr² = q<sub>in</sub>/ε₀ ⇒ E = kQr/R³.', `E = 9 × 10⁹ × ${Q} × 10⁻⁶ × ${n(rm)} / ${n(Rm)}³ = <b>${n(answer)} kN/C</b>.`)
          : steps('Outside a spherically symmetric charge, E = kQ/r².', `E = 9 × 10⁹ × ${Q} × 10⁻⁶ / ${n(rm)}² = <b>${n(answer)} kN/C</b>.`) };
    },
    verify: (x) => { // Gauss's law with ε₀ = 1/(4πk) and the enclosed charge
      const e0 = 1 / (4 * Math.PI * K), rm = x.rr / 100, qin = x.Q * 1e-6 * Math.min(1, (x.rr / x.R) ** 3);
      return qin / (e0 * 4 * Math.PI * rm * rm) / 1e3;
    },
  },
};

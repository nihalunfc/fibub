// Class 12 Physics, Electric Charges and Fields: live problems (original fibub questions). Ids start with c12p-field-.
import { pick, choose, n, steps } from './_util.js';

const sci = (v, d = 3) => { const e = Math.floor(Math.log10(Math.abs(v))), m = v / 10 ** e; return `${(+m.toPrecision(d)).toString()} × 10<sup>${e < 0 ? '−' + -e : e}</sup>`; };
const K = 9e9, E0 = 8.854e-12;

export default {
  'c12p-field-coulomb': {
    title: 'force between two point charges',
    make(r) {
      const q1 = pick(r, 1, 9, 1), q2 = pick(r, 2, 10, 1), cm = choose(r, [5, 10, 15, 20, 30, 40]), F = (K * q1 * 1e-6 * q2 * 1e-6) / (cm / 100) ** 2;
      return { q1, q2, cm, q: `<p>Two small spheres carry ${q1} µC and ${q2} µC (both positive) and are ${cm} cm apart in air. Find the force between them.</p>`, answer: F, unit: 'N', tol: 0.01,
        hint: 'Coulomb’s law: F = k q₁q₂ / r², with k = 9 × 10⁹ N m²/C². Change µC to C (× 10⁻⁶) and cm to m (÷ 100).',
        solution: steps(`q₁ = ${q1} × 10<sup>−6</sup> C, q₂ = ${q2} × 10<sup>−6</sup> C, r = ${cm / 100} m.`, `F = (9 × 10⁹ × ${q1}×10<sup>−6</sup> × ${q2}×10<sup>−6</sup>) ÷ (${cm / 100})² = <b>${n(F)} N</b>`, 'Both charges are positive, so the force is repulsive.') };
    },
    verify: (x) => (x.q1 * 1e-6 * x.q2 * 1e-6) / (4 * Math.PI * E0 * (x.cm / 100) ** 2),
  },
  'c12p-field-scale': {
    title: 'how the force changes when the distance changes',
    make(r) {
      const F0 = pick(r, 2, 40, 2), r0 = pick(r, 10, 40, 10), f = choose(r, [2, 3, 4, 0.5]), r1 = r0 * f, F1 = F0 / (f * f);
      return { F0, r0, f, q: `<p>Two point charges ${r0} cm apart repel each other with a force of ${F0} N. The distance is changed to ${n(r1)} cm. What is the new force?</p>`, answer: F1, unit: 'N', tol: 0.01,
        hint: 'F ∝ 1/r². If the distance becomes f times larger, the force becomes 1/f² times.',
        solution: steps(`The distance is multiplied by ${f}.`, `The force is multiplied by 1/${f}² = ${n(1 / (f * f))}.`, `New force = ${F0} × ${n(1 / (f * f))} = <b>${n(F1)} N</b>.`) };
    },
    verify: (x) => x.F0 * (x.r0 / (x.r0 * x.f)) ** 2,
  },
  'c12p-field-efield': {
    title: 'electric field of a point charge',
    make(r) {
      const q = pick(r, 1, 20, 1), cm = choose(r, [10, 20, 25, 50, 80]), E = (K * q * 1e-9) / (cm / 100) ** 2;
      return { cm, q_: q, q: `<p>Find the electric field at a point ${cm} cm from a point charge of +${q} nC in air.</p>`, answer: E, unit: 'N/C', tol: 0.01,
        hint: 'E = kq/r². Convert nC to C (× 10⁻⁹) and cm to m.',
        solution: steps(`E = k q / r² = 9 × 10⁹ × ${q}×10<sup>−9</sup> ÷ (${cm / 100})².`, `E = <b>${n(E)} N/C</b>, pointing away from the charge.`) };
    },
    verify: (x) => (x.q_ * 1e-9) / (4 * Math.PI * E0 * (x.cm / 100) ** 2),
  },
  'c12p-field-electrons': {
    title: 'count the electrons in a charge',
    make(r) {
      const Q = pick(r, 2, 60, 2), N = (Q * 1e-9) / 1.6e-19;
      return { Q, q: `<p>A plastic comb gains a charge of −${Q} nC when rubbed. How many extra electrons are on it? (e = 1.6 × 10<sup>−19</sup> C)</p>`, answer: N, unit: 'electrons', tol: 0.01,
        hint: 'Charge is quantised: Q = n e, so n = Q/e. Convert nC to C first.',
        solution: steps(`Q = ${Q} × 10<sup>−9</sup> C.`, `n = Q/e = ${Q}×10<sup>−9</sup> ÷ 1.6×10<sup>−19</sup> = <b>${sci(N)}</b> electrons.`) };
    },
    verify: (x) => x.Q * 1e-9 * 6.25e18,
  },
  'c12p-field-axial': {
    title: 'field of a short dipole on its axis',
    make(r) {
      const q = pick(r, 1, 9, 1), d = choose(r, [2, 4, 6]), rr = choose(r, [60, 80, 100]), p = q * 1e-9 * d / 100, E = (2 * K * p) / (rr / 100) ** 3;
      return { q_: q, d, rr, q: `<p>An electric dipole has charges ±${q} nC separated by ${d} cm. Find the field on its axis at ${rr} cm from the centre (far compared with the dipole length). Give the answer in N/C.</p>`, answer: E, unit: 'N/C', tol: 0.01,
        hint: 'First the dipole moment p = q × (separation). Then E = 2kp/r³ on the axis.',
        solution: steps(`p = ${q}×10<sup>−9</sup> × ${d / 100} = ${sci(p)} C m.`, `E = 2kp/r³ = 2 × 9×10⁹ × ${sci(p)} ÷ (${rr / 100})³ = <b>${n(E)} N/C</b>, along the direction of p.`) };
    },
    verify: (x) => (2 * (x.q_ * 1e-9 * (x.d / 100))) / (4 * Math.PI * E0 * (x.rr / 100) ** 3),
  },
  'c12p-field-torque': {
    title: 'torque on a dipole in a field',
    make(r) {
      const q = pick(r, 1, 10, 1), d = choose(r, [1, 2, 4]), Ef = choose(r, [1000, 2000, 5000]), th = choose(r, [30, 45, 60, 90]), tau = q * 1e-6 * (d / 100) * Ef * Math.sin(th * Math.PI / 180);
      return { q_: q, d, Ef, th, q: `<p>A dipole of charges ±${q} µC, ${d} cm apart, is placed in a uniform field of ${Ef} N/C with its axis at ${th}° to the field. Find the torque on it.</p>`, answer: tau, unit: 'N m', tol: 0.01,
        hint: 'τ = pE sin θ, with p = q × separation.',
        solution: steps(`p = ${q}×10<sup>−6</sup> × ${d / 100} = ${sci(q * 1e-6 * d / 100)} C m.`, `τ = pE sin θ = ${sci(q * 1e-6 * d / 100)} × ${Ef} × sin ${th}° = <b>${sci(tau)} N m</b>.`) };
    },
    verify: (x) => { const F = x.q_ * 1e-6 * x.Ef; return F * (x.d / 100) * Math.cos((90 - x.th) * Math.PI / 180); },
  },
  'c12p-field-flux': {
    title: 'flux through a tilted surface',
    make(r) {
      const E = pick(r, 100, 900, 100), A = choose(r, [0.1, 0.2, 0.5, 2]), th = choose(r, [0, 30, 45, 60]), phi = E * A * Math.cos(th * Math.PI / 180);
      return { E, A, th, q: `<p>A uniform field of ${E} N/C passes through a flat square sheet of area ${A} m². The normal to the sheet makes ${th}° with the field. Find the electric flux.</p>`, answer: phi, unit: 'N m²/C', tol: 0.01,
        hint: 'Φ = E A cos θ, where θ is the angle between E and the normal to the surface.',
        solution: steps(`Φ = E A cos θ = ${E} × ${A} × cos ${th}°.`, `Φ = <b>${n(phi)} N m²/C</b>.`) };
    },
    verify: (x) => x.E * (x.A * Math.cos((x.th * Math.PI) / 180)),
  },
  'c12p-field-wire': {
    title: 'field near a long charged wire (Gauss)',
    make(r) {
      const lam = pick(r, 1, 9, 1), cm = choose(r, [10, 20, 50, 100]), E = lam * 1e-6 / (2 * Math.PI * E0 * (cm / 100));
      return { lam, cm, q: `<p>A very long straight wire carries a uniform charge of ${lam} µC per metre. Find the electric field ${cm} cm from the wire.</p>`, answer: E, unit: 'N/C', tol: 0.01,
        hint: 'Gauss’s law with a cylinder round the wire gives E = λ / (2π ε₀ r) (ε₀ = 8.854 × 10⁻¹² C²/N m²).',
        solution: steps(`E = λ / (2π ε₀ r) = ${lam}×10<sup>−6</sup> ÷ (2π × 8.854×10<sup>−12</sup> × ${cm / 100}).`, `E = <b>${n(E)} N/C</b>, pointing away from the wire.`) };
    },
    verify: (x) => (2 * K * x.lam * 1e-6) / (x.cm / 100),
  },
  'c12p-field-sheet': {
    title: 'field of a large charged sheet',
    make(r) {
      const sg = pick(r, 1, 20, 1), E = sg * 1e-6 / (2 * E0);
      return { sg, q: `<p>A large flat sheet carries a uniform charge of ${sg} µC per square metre. What is the electric field near it?</p>`, answer: E, unit: 'N/C', tol: 0.01,
        hint: 'For an infinite sheet E = σ/(2ε₀), the same at every distance.',
        solution: steps(`E = σ / 2ε₀ = ${sg}×10<sup>−6</sup> ÷ (2 × 8.854×10<sup>−12</sup>).`, `E = <b>${n(E)} N/C</b>.`) };
    },
    verify: (x) => 2 * Math.PI * K * x.sg * 1e-6,
  },
  'c12p-field-shell': {
    title: 'field outside a charged spherical shell',
    make(r) {
      const Q = pick(r, 1, 9, 1), R = choose(r, [10, 20, 30]), d = R * choose(r, [2, 3, 4]), E = (K * Q * 1e-6) / (d / 100) ** 2;
      return { Q, R, d, q: `<p>A thin spherical shell of radius ${R} cm carries a charge of ${Q} µC spread evenly over it. Find the electric field at a point ${d} cm from the centre.</p>`, answer: E, unit: 'N/C', tol: 0.01,
        hint: 'Outside a uniformly charged shell the field is the same as if all the charge sat at the centre: E = kQ/r².',
        solution: steps(`The point is outside the shell (${d} cm > ${R} cm), so use a point charge at the centre.`, `E = 9×10⁹ × ${Q}×10<sup>−6</sup> ÷ (${d / 100})² = <b>${n(E)} N/C</b>.`) };
    },
    verify: (x) => (x.Q * 1e-6) / (4 * Math.PI * E0 * (x.d / 100) ** 2),
  },
};

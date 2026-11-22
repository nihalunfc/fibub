// Class 12 Physics, Chapter 2 Electrostatic Potential and Capacitance: practice questions for the NCERT study course (original fibub questions).
import { maker } from './_make.js';
import { pick, choose } from '../_util.js';
const m = maker('ec');
const r3 = (x) => +x.toPrecision(3);
const K = 9e9, E0 = 8.854e-12;

export default {
  topic: 'electrostatic-potential-and-capacitance', name: 'Electrostatic Potential and Capacitance', n: 2,
  items: [
    m.mcq(1, 'potential', '<p>One volt is the same as:</p>', 'one joule per coulomb', ['one coulomb per joule', 'one newton per coulomb', 'one joule per second'], '<p>Potential difference is work per unit charge: V = W/q, so 1 V = 1 J/C. (N/C is the unit of field, J/s is the watt.)</p>'),
    m.mcq(2, 'potential', '<p>The potential at a distance r from a point charge Q is V. At distance 2r it is:</p>', 'V/2', ['V/4', '2V', '4V'], '<p>V = kQ/r falls as 1/r, not 1/r² (that is the field).</p>', { trap: 'Mixing up V ∝ 1/r with E ∝ 1/r².' }),
    m.mcq(2, 'potential', '<p>The work done in moving a charge q between two points of the same equipotential surface is:</p>', 'zero', ['qE d', 'q V', 'infinite'], '<p>W = q(V₂ − V₁) = 0 when V₁ = V₂, whatever the path.</p>'),
    m.mcq(2, 'potential', '<p>The electric field at a point is zero. The potential there:</p>', 'need not be zero', ['must be zero', 'must be positive', 'must be negative'], '<p>E is the slope of V. Midway between two equal positive charges E = 0 but V is large and positive.</p>', { trap: 'E = 0 does not imply V = 0, and V = 0 does not imply E = 0.' }),
    m.mcq(1, 'equipotential', '<p>Equipotential surfaces are always:</p>', 'perpendicular to the electric field lines', ['parallel to the field lines', 'at 45° to the field lines', 'closed loops'], '<p>If the field had a component along the surface, moving a charge along it would need work, so V would change. So E is normal to the surface.</p>'),
    m.mcq(2, 'equipotential', '<p>For a uniform field E the equipotential surfaces are:</p>', 'planes perpendicular to E, equally spaced for equal ΔV', ['concentric spheres', 'planes parallel to E', 'cylinders'], '<p>V = −Ex + const, constant on planes x = const.</p>'),
    m.mcq(2, 'energy', '<p>Two charges +q and +q are brought from infinity to a distance r apart. The work done by the external agent is:</p>', 'kq²/r', ['−kq²/r', '2kq²/r', 'zero'], '<p>The potential energy of the pair, U = kq²/r, is positive for like charges, so work must be done against repulsion.</p>'),
    m.mcq(3, 'energy', '<p>Three equal charges q are at the corners of an equilateral triangle of side a. The potential energy of the system is:</p>', '3kq²/a', ['kq²/a', '2kq²/a', '6kq²/a'], '<p>There are three pairs, each with energy kq²/a.</p>'),
    m.mcq(2, 'dipole', '<p>The potential at a point on the equatorial line of a dipole is:</p>', 'zero', ['kp/r²', '2kp/r²', 'kp/r³'], '<p>V = kp cos θ/r² and θ = 90° gives zero: the equatorial plane is at the same potential as infinity.</p>'),
    m.mcq(3, 'dipole', '<p>The potential energy of a dipole in a uniform field is minimum when the angle between p and E is:</p>', '0°', ['90°', '180°', '45°'], '<p>U = −pE cos θ is −pE at θ = 0 (minimum, stable) and +pE at 180°.</p>'),
    m.mcq(2, 'conductor', '<p>Inside a charged conductor in electrostatic equilibrium the electric field is:</p>', 'zero', ['equal to σ/ε₀', 'equal to the surface field', 'uniform but not zero'], '<p>If there were a field, free electrons would move. They stop only when E = 0 inside. The whole conductor is at one potential.</p>'),
    m.mcq(2, 'conductor', '<p>Just outside the surface of a charged conductor the field is:</p>', 'σ/ε₀, normal to the surface', ['σ/2ε₀, normal to the surface', 'zero', 'σ/ε₀, parallel to the surface'], '<p>A pillbox with one face inside (E = 0) and one just outside gives EA = σA/ε₀. A sheet alone gives σ/2ε₀ but on a conductor the charges on the rest of the conductor double that.</p>'),
    m.mcq(1, 'capacitor', '<p>The capacitance of a parallel-plate capacitor depends on:</p>', 'plate area, plate separation and the medium', ['the charge on it', 'the voltage across it', 'the battery used to charge it'], '<p>C = κε₀A/d is a property of the geometry and material. Q and V change together, their ratio does not.</p>'),
    m.mcq(2, 'capacitor', '<p>The plate separation of an isolated charged capacitor is doubled. The voltage across it:</p>', 'doubles', ['halves', 'stays the same', 'becomes four times'], '<p>Q is fixed; C = ε₀A/d halves; V = Q/C doubles.</p>'),
    m.mcq(2, 'dielectric', '<p>A dielectric slab is inserted into a capacitor connected to a battery. The charge on the plates:</p>', 'increases', ['decreases', 'stays the same', 'becomes zero'], '<p>V is fixed by the battery, C increases to κC, so Q = CV increases: extra charge flows in from the battery.</p>'),
    m.mcq(3, 'dielectric', '<p>A slab of constant κ fills the gap of an isolated charged capacitor. The energy stored becomes:</p>', 'U₀/κ', ['κU₀', 'U₀', 'κ²U₀'], '<p>Q fixed: U = Q²/2C and C → κC, so U → U₀/κ. The missing energy is the work the field does pulling the slab in.</p>'),
    m.mcq(2, 'combination', '<p>Capacitors of 3 µF and 6 µF are joined in series. The equivalent capacitance is:</p>', '2 µF', ['9 µF', '4.5 µF', '18 µF'], '<p>1/C = 1/3 + 1/6 = 1/2, so C = 2 µF. Series is always smaller than the smallest.</p>'),
    m.mcq(2, 'combination', '<p>Capacitors C₁ and C₂ are in series across a battery. Which is the same for both?</p>', 'the charge', ['the voltage', 'the capacitance', 'the energy'], '<p>In series one path carries the same charge Q onto each; voltages are Q/C₁ and Q/C₂, which add up to the battery voltage.</p>'),
    m.ar(2, 'conductor', 'The surface of a charged conductor is an equipotential.', 'The electric field inside a conductor is zero.', 0, '<p>Both true and R explains A: with no field inside, no work is needed to move a charge between two points of the conductor, so all points are at the same potential.</p>'),
    m.ar(2, 'dielectric', 'A dielectric reduces the field between capacitor plates.', 'The slab’s polarisation creates bound charges that produce a field opposing the original.', 0, '<p>Both true; R is the explanation: E = E₀ − E<sub>induced</sub> = E₀/κ.</p>'),
    m.ar(3, 'potential', 'The potential of a conductor in equilibrium is the same at every point of it.', 'The charge on a conductor is spread uniformly over its surface.', 2, '<p>A is true. R is false: the charge density is higher where the surface is more sharply curved (points), not uniform in general.</p>'),
    m.nat(2, 'potential', '<p>Find the potential in volts at 0.3 m from a point charge of +4 nC.</p>', () => (K * 4e-9) / 0.3, 0.5, '<p>V = kq/r = 9×10⁹ × 4×10<sup>−9</sup> ÷ 0.3 = 120 V.</p>', { unit: 'V' }),
    m.nat(2, 'capacitor', '<p>A 10 µF capacitor is charged to 12 V. Find the charge stored in µC.</p>', () => 10 * 12, 0, '<p>Q = CV = 10 × 12 = 120 µC.</p>', { unit: 'µC' }),
    m.nat(3, 'capacitor', '<p>Find the energy stored, in µJ, in a 4 µF capacitor charged to 10 V.</p>', () => 0.5 * 4 * 100, 0, '<p>U = ½CV² = 0.5 × 4 × 10² = 200 µJ.</p>', { unit: 'µJ' }),
    m.nat(3, 'combination', '<p>Three capacitors of 2 µF, 3 µF and 6 µF are in series across 12 V. Find the voltage across the 2 µF capacitor.</p>', () => { const C = 1 / (1 / 2 + 1 / 3 + 1 / 6), Q = C * 12; return Q / 2; }, 0.01, '<p>1/C = 1/2 + 1/3 + 1/6 = 1, so C = 1 µF and Q = 12 µC. V on the 2 µF = 12/2 = 6 V.</p>', { unit: 'V' }),
    m.nat(3, 'capacitor', '<p>A parallel-plate capacitor has plates of area 0.02 m² a distance 1 mm apart in air. Find its capacitance in pF (ε₀ = 8.85 × 10<sup>−12</sup>).</p>', () => 8.85e-12 * 0.02 / 1e-3 * 1e12, 0.5, '<p>C = ε₀A/d = 8.85×10<sup>−12</sup> × 0.02 ÷ 10<sup>−3</sup> = 1.77 × 10<sup>−10</sup> F = 177 pF.</p>', { unit: 'pF' }),
    m.msq(3, 'dielectric', '<p>A capacitor is charged and disconnected from the battery, then a dielectric slab is inserted. Which are true? (Choose all that apply.)</p>', ['The charge stays the same.', 'The voltage decreases.', 'The capacitance increases.', 'The stored energy increases.'], [0, 1, 2], '<p>Q fixed, C → κC, V → V/κ, energy U = Q²/2C decreases. (With the battery connected, energy would increase instead.)</p>'),
    m.msq(2, 'equipotential', '<p>Which statements about equipotential surfaces are true? (Choose all that apply.)</p>', ['No work is needed to move a charge along one.', 'The field is perpendicular to the surface.', 'Two different ones can cross.', 'The field points from higher to lower potential.'], [0, 1, 3], '<p>Two different equipotentials never cross (a point cannot have two potentials). E points toward decreasing V.</p>'),
  ],
  gens: [
    { id: 'ec-g01', type: 'nat', level: 2, exams: ['board'], sub: 'potential',
      make(rng) { const q = pick(rng, 1, 20), d = choose(rng, [10, 20, 30, 50]); const V = (K * q * 1e-9) / (d / 100); return { q_: q, d, q: `<p>Find the potential in volts at ${d} cm from a point charge of +${q} nC.</p>`, answer: r3(V), tol: Math.max(0.5, V * 0.01), unit: 'V', sol: `<p>V = kq/r = 9×10⁹ × ${q}×10<sup>−9</sup> ÷ ${d / 100} = ${r3(V)} V.</p>` }; },
      verify: (p) => (p.q_ * 1e-9) / (4 * Math.PI * E0 * (p.d / 100)) },
    { id: 'ec-g02', type: 'nat', level: 2, exams: ['board'], sub: 'combination',
      make(rng) { const a = pick(rng, 1, 9), b = pick(rng, 1, 9); const C = (a * b) / (a + b); return { a, b, q: `<p>Capacitors of ${a} µF and ${b} µF are joined in series. Find the equivalent capacitance in µF (2 decimal places).</p>`, answer: +C.toFixed(2), tol: 0.01, unit: 'µF', sol: `<p>1/C = 1/${a} + 1/${b}, so C = ${a}×${b}/${a + b} = ${C.toFixed(2)} µF.</p>` }; },
      verify: (p) => 1 / (1 / p.a + 1 / p.b) },
    { id: 'ec-g03', type: 'nat', level: 2, exams: ['board'], sub: 'capacitor',
      make(rng) { const C = pick(rng, 2, 40, 2), V = pick(rng, 3, 24, 3); const U = 0.5 * C * V * V; return { C, V, q: `<p>Find the energy stored, in µJ, in a ${C} µF capacitor charged to ${V} V.</p>`, answer: U, tol: 0.5, unit: 'µJ', sol: `<p>U = ½CV² = 0.5 × ${C} × ${V}² = ${U} µJ.</p>` }; },
      verify: (p) => { const Q = p.C * p.V; return (Q * Q) / (2 * p.C); } },
    { id: 'ec-g04', type: 'nat', level: 3, exams: ['board'], sub: 'dielectric',
      make(rng) { const V = pick(rng, 20, 200, 20), k = choose(rng, [2, 4, 5, 10]); return { V, k, q: `<p>An isolated capacitor charged to ${V} V is filled with a dielectric of constant ${k}. Find the new voltage in volts.</p>`, answer: V / k, tol: 0.01, unit: 'V', sol: `<p>Q is fixed and C becomes ${k}C, so V = ${V}/${k} = ${V / k} V.</p>` }; },
      verify: (p) => { const Q = 3 * p.V, C = 3 * p.k; return Q / C; } },
  ],
};

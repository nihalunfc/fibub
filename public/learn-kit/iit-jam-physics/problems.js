// Live problems for IIT JAM Physics lessons (lesson kit). Each make(rand) returns { q, answer, unit, tol (relative),
// abs?, hint, solution } as HTML; verify(p) works the answer out another way for tests/exam-physics.mjs.
// Placed in a lesson as <div class="problem" data-problem="id"></div>. Exam-style practice uses the question bank instead.
const int = (r, a, b) => a + Math.floor(r() * (b - a + 1));
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';

export default {
  'div-at-point': {
    title: 'divergence at a point',
    make(r) {
      const a = int(r, 1, 5), b = int(r, 1, 5), x = int(r, -3, 3), y = int(r, -3, 3), z = int(r, 1, 3);
      const answer = 2 * a * x + b * z;
      return {
        q: `<p>Find the divergence of <b>F</b> = ${a}x² <b>i</b> + ${b}yz <b>j</b> + 0 <b>k</b> at the point (${x}, ${y}, ${z}).</p>`,
        answer, unit: '', tol: 0, abs: 1e-9,
        hint: 'Differentiate each component by its own coordinate only: F<sub>x</sub> by x, F<sub>y</sub> by y, F<sub>z</sub> by z, then add.',
        solution: steps(`∂(${a}x²)/∂x = ${2 * a}x = ${2 * a * x}.`, `∂(${b}yz)/∂y = ${b}z = ${b * z}.`, `∂(0)/∂z = 0.`, `Divergence = ${2 * a * x} + ${b * z} = <b>${answer}</b>.`),
        a, b, x, z,
      };
    },
    verify: (p) => 2 * p.a * p.x + p.b * p.z,
  },
  // ---- 4.1 Electric fields and Gauss's law ----
  'gauss-sphere-field': {
    title: 'field of a charged sphere, inside or outside',
    make(r) {
      const Q = int(r, 1, 9), R = int(r, 5, 20), d = int(r, 1, 3 * R);
      const k = 8.9876e9, inside = d < R;
      const answer = inside ? k * Q * 1e-9 * (d / 100) / (R / 100) ** 3 : k * Q * 1e-9 / (d / 100) ** 2;
      const s3 = (x) => +x.toPrecision(3);
      return {
        q: `<p>A non-conducting sphere of radius ${R} cm carries ${Q} nC spread uniformly through its volume. Find the electric field ${d} cm from its centre, in N/C.</p>`,
        answer, unit: 'N/C', tol: 0.01,
        hint: 'Draw a Gaussian sphere through the point. Is the point inside the charged sphere (then only part of the charge is enclosed) or outside?',
        solution: inside
          ? steps(`The point is inside (${d} &lt; ${R} cm). The Gaussian sphere encloses the fraction (r/R)³ = (${d}/${R})³ of the charge.`, `Gauss: E · 4πr² = Q(r/R)³/ε₀, so E = kQr/R³.`, `E = (8.99×10⁹)(${Q}×10⁻⁹)(${d / 100}) / (${R / 100})³ = <b>${s3(answer)} N/C</b>.`)
          : steps(`The point is outside (${d} ≥ ${R} cm), so the whole charge is enclosed.`, `Gauss: E · 4πr² = Q/ε₀, so E = kQ/r², as if all the charge sat at the centre.`, `E = (8.99×10⁹)(${Q}×10⁻⁹) / (${d / 100})² = <b>${s3(answer)} N/C</b>.`),
        Q, R, d,
      };
    },
    verify: (p) => (p.d < p.R ? 8.9876e9 * p.Q * 1e-9 * (p.d / 100) / (p.R / 100) ** 3 : 8.9876e9 * p.Q * 1e-9 / (p.d / 100) ** 2),
  },
  // ---- 4.2 Potential and electrostatic energy ----
  'assemble-charges': {
    title: 'work to assemble three charges',
    make(r) {
      const q = [int(r, 1, 5), -int(r, 1, 5), int(r, 1, 5)].map((x, i) => (i === 2 && r() < 0.5 ? -x : x)), a = int(r, 5, 30);
      const k = 8.9876e9, A = a / 100;
      const pairs = q[0] * q[1] / A + q[1] * q[2] / A + q[0] * q[2] / (2 * A);
      const answer = k * pairs * 1e-12 * 1000; // mJ
      const s3 = (x) => +x.toPrecision(3);
      return {
        q: `<p>Charges of ${q[0]} μC, ${q[1]} μC and ${q[2]} μC are brought from far apart and placed in a straight line, ${a} cm apart (the first and the third are ${2 * a} cm apart). How much work, in mJ, does this take? (A negative answer means the field does the work.)</p>`,
        answer, unit: 'mJ', tol: 0.01, abs: 0.01,
        hint: 'Add kq<sub>i</sub>q<sub>j</sub>/r<sub>ij</sub> over the three pairs, keeping the signs. The outer pair is twice as far apart.',
        solution: steps(`Pairs: (1,2) at ${a} cm, (2,3) at ${a} cm, (1,3) at ${2 * a} cm.`, `W = k[q₁q₂/a + q₂q₃/a + q₁q₃/(2a)] = (8.99×10⁹)×10⁻¹²×[${q[0] * q[1]}/${A} + ${q[1] * q[2]}/${A} + ${q[0] * q[2]}/${2 * A}] J.`, `W = <b>${s3(answer)} mJ</b>.`),
        q1: q[0], q2: q[1], q3: q[2], a,
      };
    },
    verify: (p) => 8.9876e9 * (p.q1 * p.q2 / (p.a / 100) + p.q2 * p.q3 / (p.a / 100) + p.q1 * p.q3 / (2 * p.a / 100)) * 1e-12 * 1000,
  },
  // ---- 4.5 Magnetic fields ----
  'loop-axis-field': {
    title: 'field on the axis of a current loop',
    make(r) {
      const [R, z, h] = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 6, 10], [4, 3, 5], [12, 5, 13]][int(r, 0, 5)], I = int(r, 1, 20), N = [1, 10, 100][int(r, 0, 2)];
      const mu0 = 4e-7 * Math.PI;
      const answer = mu0 * N * I * (R / 100) ** 2 / (2 * (h / 100) ** 3) * 1e6; // microtesla
      const s3 = (x) => +x.toPrecision(3);
      return {
        q: `<p>A flat circular coil of ${N} turn${N > 1 ? 's' : ''} and radius ${R} cm carries ${I} A. Find the magnetic field on its axis ${z} cm from the centre, in μT.</p>`,
        answer, unit: 'μT', tol: 0.01,
        hint: 'B = μ₀NIR² / [2(R² + z²)^(3/2)]. Here √(R² + z²) is a whole number of centimetres.',
        solution: steps(`√(R² + z²) = √(${R * R} + ${z * z}) = ${h} cm = ${h / 100} m.`, `B = (4π×10⁻⁷)(${N})(${I})(${R / 100})² / [2(${h / 100})³].`, `B = <b>${s3(answer)} μT</b>. Check: at z = 0 this would be μ₀NI/2R.`),
        R, z, h, I, N,
      };
    },
    verify: (p) => 4e-7 * Math.PI * p.N * p.I * (p.R / 100) ** 2 / (2 * (p.h / 100) ** 3) * 1e6,
  },
  // ---- 4.7 Electromagnetic induction ----
  'rails-terminal': {
    title: 'terminal speed of a rod on rails',
    make(r) {
      const F = int(r, 1, 20) / 10, R = int(r, 1, 10), B = int(r, 2, 10) / 10, L = int(r, 20, 100) / 100;
      const answer = F * R / (B * B * L * L);
      const s3 = (x) => +x.toPrecision(3);
      return {
        q: `<p>A rod ${L} m long lies across frictionless rails joined by a ${R} Ω resistor, in a ${B} T field perpendicular to the plane of the rails. A steady ${F} N force pulls the rod along the rails. What is its terminal speed, in m/s?</p>`,
        answer, unit: 'm/s', tol: 0.01,
        hint: 'At terminal speed the magnetic force on the rod, BIL with I = BLv/R, balances the pull.',
        solution: steps(`EMF = BLv, current I = BLv/R, magnetic force BIL = B²L²v/R (it opposes the motion).`, `Balance: B²L²v/R = F, so v = FR/(B²L²).`, `v = (${F})(${R}) / [(${B})²(${L})²] = <b>${s3(answer)} m/s</b>.`),
        F, R, B, L,
      };
    },
    verify: (p) => p.F * p.R / (p.B * p.B * p.L * p.L),
  },
};

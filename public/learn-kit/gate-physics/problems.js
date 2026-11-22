// Live problems for GATE Physics lessons (lesson kit). Each make(rand) returns { q, answer, unit, tol (relative),
// abs?, hint, solution } as HTML; verify(p) works the answer out another way for tests/exam-physics.mjs.
// Placed in a lesson as <div class="problem" data-problem="id"></div>. Exam-style practice uses the question bank instead.
const int = (r, a, b) => a + Math.floor(r() * (b - a + 1));
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';

export default {
  // ---------- 3.1 Boundary value problems ----------
  'sphere-legendre': {
    title: 'potential from a Legendre expansion on a sphere',
    make(r) {
      const a = int(r, 0, 3) * 10, b = int(r, 1, 4) * 10, g = int(r, 1, 4) * 15, k = [1.5, 2, 3][int(r, 0, 2)];
      const A0 = a + g / 3, A1 = b, A2 = 2 * g / 3;
      const answer = A0 / k + A1 / k ** 2 + A2 / k ** 3;
      return {
        q: `<p>A thin spherical surface of radius R is held at V(θ) = ${a ? a + ' + ' : ''}${b} cos θ + ${g} cos²θ volts, with no other charges anywhere. Find the potential on the +z axis at r = ${k}R, in volts.</p>`,
        answer, unit: 'V', tol: 0.01,
        hint: 'Rewrite cos²θ as 1/3 + (2/3)P₂(cos θ). Outside, each Legendre term A<sub>l</sub>P<sub>l</sub> becomes A<sub>l</sub>(R/r)<sup>l+1</sup>P<sub>l</sub>, and on the axis every P<sub>l</sub> = 1.',
        solution: steps(`Legendre coefficients: A₀ = ${a} + ${g}/3 = ${+A0.toFixed(3)}, A₁ = ${b}, A₂ = 2×${g}/3 = ${+A2.toFixed(3)}.`, `Outside: V = A₀(R/r) + A₁(R/r)²cos θ + A₂(R/r)³P₂(cos θ).`, `At r = ${k}R on the axis: ${+A0.toFixed(3)}/${k} + ${b}/${k ** 2} + ${+A2.toFixed(3)}/${+(k ** 3).toFixed(3)} = <b>${answer.toFixed(3)} V</b>.`),
        A0, A1, A2, k,
      };
    },
    verify: (p) => p.A0 / p.k + p.A1 / p.k ** 2 + p.A2 / p.k ** 3,
  },
  'rect-mode': {
    title: 'one Fourier mode in a rectangle',
    make(r) {
      const V0 = [50, 100, 200][int(r, 0, 2)], ba = [0.5, 1, 2][int(r, 0, 2)], fx = [0.25, 0.5][int(r, 0, 1)], fy = [0.25, 0.5, 0.75][int(r, 0, 2)];
      const answer = V0 * Math.sin(Math.PI * fx) * Math.sinh(Math.PI * fy * ba) / Math.sinh(Math.PI * ba);
      return {
        q: `<p>A rectangle 0 ≤ x ≤ a, 0 ≤ y ≤ b with b = ${ba}a has V = 0 on three sides and V = ${V0} sin(πx/a) volts on the side y = b. There is no charge inside. Find V at x = ${fx}a, y = ${fy}b.</p>`,
        answer, unit: 'V', tol: 0.01,
        hint: 'Try V = C sin(πx/a) sinh(πy/a). It is harmonic, vanishes on x = 0, x = a and y = 0; fix C from the top edge.',
        solution: steps(`V = ${V0} sin(πx/a) sinh(πy/a)/sinh(πb/a). By uniqueness this is the answer.`, `πy/a = ${(Math.PI * fy * ba).toFixed(4)}, πb/a = ${(Math.PI * ba).toFixed(4)}, sin(πx/a) = ${Math.sin(Math.PI * fx).toFixed(4)}.`, `V = ${V0} × ${Math.sin(Math.PI * fx).toFixed(4)} × ${Math.sinh(Math.PI * fy * ba).toFixed(4)}/${Math.sinh(Math.PI * ba).toFixed(4)} = <b>${answer.toFixed(3)} V</b>.`),
        V0, ba, fx, fy,
      };
    },
    verify: (p) => p.V0 * Math.sin(Math.PI * p.fx) * Math.sinh(Math.PI * p.fy * p.ba) / Math.sinh(Math.PI * p.ba),
  },
  // ---------- 3.2 Method of images ----------
  'cavity-image-force': {
    title: 'force on a charge in a grounded spherical cavity',
    make(r) {
      const q = int(r, 1, 5), R = [5, 8, 10][int(r, 0, 2)], d = int(r, 1, 3);
      const k = 8.9875517923e9, Rm = R / 100, dm = d / 100;
      const answer = k * (q * 1e-9) ** 2 * Rm * dm / (Rm * Rm - dm * dm) ** 2 * 1e6;
      return {
        q: `<p>A charge of ${q} nC sits ${d} cm from the centre of a grounded spherical cavity of radius ${R} cm cut in a block of metal. Find the size of the force on it, in μN.</p>`,
        answer, unit: 'μN', tol: 0.01,
        hint: 'The image is q′ = −qR/d at R²/d from the centre, outside the cavity, on the same side as q.',
        solution: steps(`Image: q′ = −${q}×${R}/${d} = ${(-q * R / d).toFixed(3)} nC at ${(R * R / d).toFixed(3)} cm from the centre.`, `Separation: R²/d − d = ${(R * R / d - d).toFixed(3)} cm.`, `F = k q |q′| / sep² = kq²Rd/(R² − d²)² = <b>${answer.toFixed(3)} μN</b>, pulling q towards the nearest wall.`),
        qc: q, Rm, dm,
      };
    },
    verify: (p) => 8.9875517923e9 * (p.qc * 1e-9) ** 2 * p.Rm * p.dm / (p.Rm ** 2 - p.dm ** 2) ** 2 * 1e6,
  },
  'wire-plane-capacitance': {
    title: 'capacitance of a wire above a ground plane',
    make(r) {
      const a = [0.5, 1, 2][int(r, 0, 2)], x = [2, 5, 10, 50][int(r, 0, 3)];
      const answer = 2 * Math.PI * 8.8541878128e-12 / Math.acosh(x) * 1e12;
      return {
        q: `<p>A wire of radius ${a} mm runs parallel to a large grounded plane with its axis ${a * x} mm above it. Find the capacitance per metre between wire and plane, in pF/m.</p>`,
        answer, unit: 'pF/m', tol: 0.01,
        hint: 'Replace the wire and plane by line charges ±λ at ±c with c² = h² − a². The result is C′ = 2πε₀ / cosh⁻¹(h/a).',
        solution: steps(`h/a = ${x}, so cosh⁻¹(${x}) = ln(${x} + √(${x * x} − 1)) = ${Math.acosh(x).toFixed(4)}.`, `2πε₀ = 5.563 × 10⁻¹¹ F/m.`, `C′ = 5.563 × 10⁻¹¹ / ${Math.acosh(x).toFixed(4)} = <b>${answer.toFixed(3)} pF/m</b>.`),
        x,
      };
    },
    verify: (p) => 2 * Math.PI * 8.8541878128e-12 / Math.acosh(p.x) * 1e12,
  },
  // ---------- 3.3 Multipoles ----------
  'quadrupole-component': {
    title: 'a component of the quadrupole tensor',
    make(r) {
      const pool = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, 0, 1], [0, 0, -1], [1, 1, 0], [0, 1, 1]];
      const i1 = int(r, 0, 6), i2 = (i1 + 1 + int(r, 0, 5)) % 7;
      const P = [pool[i1], pool[i2], [0, 0, 0]], Q = [int(r, 1, 3), int(r, 1, 3)];
      Q.push(-(Q[0] + Q[1]));
      const comp = [[2, 2, 'zz'], [0, 0, 'xx'], [0, 1, 'xy']][int(r, 0, 2)];
      let answer = 0;
      const parts = P.map((v, n) => { const r2 = v[0] ** 2 + v[1] ** 2 + v[2] ** 2; const t = Q[n] * (3 * v[comp[0]] * v[comp[1]] - (comp[0] === comp[1] ? r2 : 0)); answer += t; return t; });
      return {
        q: `<p>Charges (in units of q) at positions in units of a: ${P.map((v, n) => `${Q[n] > 0 ? '+' : ''}${Q[n]} at (${v.join(', ')})`).join('; ')}. Find Q<sub>${comp[2]}</sub> = Σ q(3x<sub>i</sub>x<sub>j</sub> − r²δ<sub>ij</sub>) about the origin, in units of qa².</p>`,
        answer, unit: 'qa²', tol: 0, abs: 1e-9,
        hint: comp[0] === comp[1] ? 'Diagonal component: each charge contributes q(3x<sub>i</sub>² − r²).' : 'Off-diagonal component: each charge contributes 3q x<sub>i</sub>x<sub>j</sub>, with no r² term.',
        solution: steps(...parts.map((t, n) => `Charge ${Q[n]} at (${P[n].join(', ')}): ${t}.`), `Sum: <b>${answer}</b> qa². (The charge at the origin adds nothing.)`),
        P, Q, c0: comp[0], c1: comp[1],
      };
    },
    verify: (p) => p.P.reduce((s, v, n) => s + p.Q[n] * (3 * v[p.c0] * v[p.c1] - (p.c0 === p.c1 ? v[0] ** 2 + v[1] ** 2 + v[2] ** 2 : 0)), 0),
  },
  'dipole-field-angle': {
    title: 'field of a point dipole at an angle',
    make(r) {
      const p = int(r, 1, 5), rr = [1, 2, 5][int(r, 0, 2)], th = [0, 30, 45, 60, 90][int(r, 0, 4)];
      const c = Math.cos(th * Math.PI / 180);
      const answer = 8.9875517923e9 * p * 1e-12 * Math.sqrt(3 * c * c + 1) / (rr / 100) ** 3;
      return {
        q: `<p>A point dipole of moment ${p} × 10⁻¹² C m sits at the origin. Find the field strength ${rr} cm away, at ${th}° from the dipole axis, in V/m.</p>`,
        answer, unit: 'V/m', tol: 0.01,
        hint: 'E<sub>r</sub> = 2kp cos θ / r³ and E<sub>θ</sub> = kp sin θ / r³; combine them.',
        solution: steps(`kp/r³ = 8.99 × 10⁹ × ${p} × 10⁻¹² / (${rr / 100})³ = ${(8.9875517923e9 * p * 1e-12 / (rr / 100) ** 3).toFixed(2)} V/m.`, `|E| = (kp/r³)√(3cos²θ + 1), and √(3cos²${th}° + 1) = ${Math.sqrt(3 * c * c + 1).toFixed(4)}.`, `|E| = <b>${answer.toFixed(1)} V/m</b>.`),
        p, rr, th,
      };
    },
    verify: (q) => { const c = Math.cos(q.th * Math.PI / 180); return 8.9875517923e9 * q.p * 1e-12 * Math.sqrt(3 * c * c + 1) / (q.rr / 100) ** 3; },
  },
  // ---------- 3.4 Fields in matter ----------
  'dielectric-body-field': {
    title: 'field inside a dielectric sphere or cylinder',
    make(r) {
      const sph = r() < 0.5, er = [2, 3, 4, 6, 10][int(r, 0, 4)], E0 = [100, 300, 1000][int(r, 0, 2)];
      const answer = sph ? 3 * E0 / (er + 2) : 2 * E0 / (er + 1);
      return {
        q: `<p>A ${sph ? 'sphere' : 'long cylinder, axis across the field,'} of linear dielectric with ε<sub>r</sub> = ${er} is placed in a uniform field of ${E0} V/m. Find the field inside, in V/m.</p>`,
        answer, unit: 'V/m', tol: 0.01,
        hint: sph ? 'Separation in spherical coordinates with only the l = 1 term: E<sub>in</sub> = 3E₀/(ε<sub>r</sub> + 2).' : 'Separation in polar coordinates with only cos φ terms: E<sub>in</sub> = 2E₀/(ε<sub>r</sub> + 1).',
        solution: steps(`Match V and ε ∂V/∂n at the surface; inside the field is uniform.`, `E<sub>in</sub> = ${sph ? `3 × ${E0}/(${er} + 2)` : `2 × ${E0}/(${er} + 1)`} = <b>${answer.toFixed(2)} V/m</b>.`, `Polarisation P = ε₀(ε<sub>r</sub> − 1)E<sub>in</sub> = ${(8.854e-12 * (er - 1) * answer * 1e9).toFixed(2)} nC/m².`),
        sph, er, E0,
      };
    },
    verify: (p) => (p.sph ? 3 * p.E0 / (p.er + 2) : 2 * p.E0 / (p.er + 1)),
  },
  'dielectric-image': {
    title: 'force on a charge near a dielectric boundary',
    make(r) {
      const e1 = [1, 2, 4][int(r, 0, 2)], e2 = [3, 5, 80][int(r, 0, 2)], q = int(r, 1, 5), d = [0.5, 1, 2][int(r, 0, 2)];
      const qp = -(e2 - e1) / (e2 + e1);
      const answer = Math.abs(8.9875517923e9 / e1 * (q * 1e-9) ** 2 * qp / (2 * d / 100) ** 2 * 1e6);
      return {
        q: `<p>A charge of ${q} nC sits in a medium with ε<sub>r</sub> = ${e1}, ${d} cm from its flat boundary with a medium of ε<sub>r</sub> = ${e2}. Find the size of the force on it, in μN.</p>`,
        answer, unit: 'μN', tol: 0.01,
        hint: 'In the charge\'s own medium the field is that of q and an image q′ = −q(ε₂ − ε₁)/(ε₂ + ε₁), a distance d beyond the boundary. Use ε₁ in Coulomb\'s law.',
        solution: steps(`q′ = −q(${e2} − ${e1})/(${e2} + ${e1}) = ${qp.toFixed(4)} q.`, `F = q|q′| / (4π ε₁ (2d)²) = (8.99 × 10⁹/${e1}) × ${Math.abs(qp).toFixed(4)} × (${q} × 10⁻⁹)² / (${2 * d / 100})².`, `F = <b>${answer.toFixed(3)} μN</b>, ${e2 > e1 ? 'attracting the charge towards the denser medium' : 'pushing it away'}.`),
        e1, e2, qc: q, d,
      };
    },
    verify: (p) => Math.abs(8.9875517923e9 / p.e1 * (p.qc * 1e-9) ** 2 * (-(p.e2 - p.e1) / (p.e2 + p.e1)) / (2 * p.d / 100) ** 2 * 1e6),
  },
  // ---------- 3.5 Potentials and gauges ----------
  'solenoid-vector-potential': {
    title: 'vector potential outside a solenoid',
    make(r) {
      const n = [500, 1000, 2000][int(r, 0, 2)], I = int(r, 1, 5), R = int(r, 1, 3), s = R * [2, 3, 5][int(r, 0, 2)];
      const B = 1.25663706212e-6 * n * I;
      const answer = B * (R / 100) ** 2 / (2 * s / 100) * 1e6;
      return {
        q: `<p>A long solenoid of radius ${R} cm has ${n} turns per metre carrying ${I} A. Outside it the magnetic field is zero. Find the size of the vector potential ${s} cm from the axis, in μT m.</p>`,
        answer, unit: 'μT m', tol: 0.01,
        hint: 'Use ∮A·dl = Φ around a circle of radius s: A × 2πs equals the flux inside the solenoid.',
        solution: steps(`B inside = μ₀nI = ${(B * 1e3).toFixed(4)} mT.`, `Φ = BπR² = ${(B * Math.PI * (R / 100) ** 2).toExponential(3)} Wb.`, `A = Φ/(2πs) = BR²/(2s) = <b>${answer.toFixed(4)} μT m</b>, circling the axis, although B = 0 there.`),
        B, R, s,
      };
    },
    verify: (p) => p.B * (p.R / 100) ** 2 / (2 * p.s / 100) * 1e6,
  },
  'lienard-wiechert-factor': {
    title: 'the Liénard-Wiechert factor',
    make(r) {
      const b = [0.2, 0.5, 0.6, 0.8, 0.9][int(r, 0, 4)], a = [0, 30, 60, 90, 120, 180][int(r, 0, 5)];
      const answer = 1 / (1 - b * Math.cos(a * Math.PI / 180));
      return {
        q: `<p>At the retarded time, a charge moving at ${b}c has its velocity at ${a}° to the line from it towards the observer. By what factor does its Liénard-Wiechert potential exceed q/4πε₀𝓇, where 𝓇 is the retarded distance?</p>`,
        answer, unit: '', tol: 0.005,
        hint: 'V = q / [4πε₀ (𝓇 − 𝓇·v/c)]: divide by the Coulomb value.',
        solution: steps(`The factor is 1/(1 − (v/c) cos α).`, `(v/c) cos ${a}° = ${(b * Math.cos(a * Math.PI / 180)).toFixed(4)}.`, `Factor = 1/${(1 - b * Math.cos(a * Math.PI / 180)).toFixed(4)} = <b>${answer.toFixed(4)}</b>. ${a < 90 ? 'Approaching: stronger.' : a > 90 ? 'Receding: weaker.' : 'Sideways: no change.'}`),
        b, a,
      };
    },
    verify: (p) => 1 / (1 - p.b * Math.cos(p.a * Math.PI / 180)),
  },
};

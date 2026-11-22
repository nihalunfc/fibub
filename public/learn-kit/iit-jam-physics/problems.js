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
  'flux-box': {
    title: 'flux out of a box (divergence theorem)',
    make(r) {
      const a = int(r, 1, 4), b = int(r, 1, 4), c = int(r, -2, 3), L = int(r, 1, 3), M = int(r, 1, 3), N = int(r, 1, 3);
      // F = (a x^2, b y, c z): div = 2a x + b + c; integral over [0,L]x[0,M]x[0,N] = a L^2 M N + (b + c) L M N
      const answer = a * L * L * M * N + (b + c) * L * M * N;
      return {
        q: `<p>Find the outward flux of <b>F</b> = ${a}x² <b>i</b> + ${b}y <b>j</b> + ${c}z <b>k</b> through the closed surface of the box 0 ≤ x ≤ ${L}, 0 ≤ y ≤ ${M}, 0 ≤ z ≤ ${N}.</p>`,
        answer, unit: '', tol: 0, abs: 1e-9,
        hint: 'Do not integrate over six faces. Find ∇·F, then integrate it over the volume of the box.',
        solution: steps(`∇·F = ${2 * a}x + ${b} + (${c}) = ${2 * a}x + ${b + c}.`, `∫ ${2 * a}x dV = ${2 * a} × (${L}²/2) × ${M} × ${N} = ${a * L * L * M * N}.`, `∫ ${b + c} dV = ${b + c} × ${L * M * N} = ${(b + c) * L * M * N}.`, `Flux = <b>${answer}</b>.`),
        a, b, c, L, M, N,
      };
    },
    verify: (p) => (2 * p.a * (p.L ** 2 / 2) + (p.b + p.c) * p.L) * p.M * p.N,
  },
  'damped-frequency': {
    title: 'frequency of a damped oscillator',
    make(r) {
      const g = int(r, 1, 4), w0 = int(r, g + 1, 9);
      const answer = Math.sqrt(w0 * w0 - g * g);
      return {
        q: `<p>The motion of an oscillator obeys x'' + ${2 * g}x' + ${w0 * w0}x = 0 (time in seconds). Find the angular frequency of its oscillation in rad/s.</p>`,
        answer, unit: 'rad/s', tol: 0.005,
        hint: 'Try x = e<sup>mt</sup>. The imaginary part of m is the angular frequency; the real part is the decay rate.',
        solution: steps(`Auxiliary equation: m² + ${2 * g}m + ${w0 * w0} = 0.`, `m = −${g} ± √(${g * g} − ${w0 * w0}) = −${g} ± i√${w0 * w0 - g * g}.`, `So x = e<sup>−${g}t</sup>(A cos ωt + B sin ωt) with ω = √${w0 * w0 - g * g} = <b>${answer.toFixed(3)}</b> rad/s, a little below the undamped ${w0} rad/s.`),
        g, w0,
      };
    },
    verify: (p) => Math.sqrt(p.w0 ** 2 - p.g ** 2),
  },
  'eigen-2x2': {
    title: 'eigenvalues of a 2 × 2 matrix',
    make(r) {
      // built from integer eigenvalues l1 > l2 so the answer is exact: a + d = l1 + l2 and ad - bc = l1 l2, with b = 1.
      const l1 = int(r, 1, 6), l2 = int(r, -4, l1 - 1), a = int(r, -3, 6), d = l1 + l2 - a, b = 1, c = a * d - l1 * l2;
      return {
        q: `<p>Find the larger eigenvalue of the matrix A = [[${a}, ${b}], [${c}, ${d}]] (rows in brackets).</p>`,
        answer: l1, unit: '', tol: 0, abs: 1e-9,
        hint: 'You do not need eigenvectors. The eigenvalues add up to the trace and multiply to the determinant.',
        solution: steps(`Trace = ${a} + ${d} = ${a + d}; determinant = (${a})(${d}) − (${b})(${c}) = ${a * d - b * c}.`, `Characteristic equation: λ² − ${a + d}λ + ${a * d - b * c} = 0.`, `λ = [${a + d} ± √(${(a + d) ** 2} − ${4 * (a * d - b * c)})]/2 = ${l1} or ${l2}. Larger: <b>${l1}</b>.`),
        a, b, c, d,
      };
    },
    verify: (p) => { const t = p.a + p.d, D = p.a * p.d - p.b * p.c; return (t + Math.sqrt(t * t - 4 * D)) / 2; },
  },
  'complex-power': {
    title: 'a power of a complex number',
    make(r) {
      const [name, R, th] = [['1 + i', Math.SQRT2, 45], ['√3 + i', 2, 30], ['1 + i√3', 2, 60], ['1 − i', Math.SQRT2, -45]][int(r, 0, 3)];
      const n = int(r, 3, 8);
      const answer = R ** n * Math.cos((n * th * Math.PI) / 180);
      return {
        q: `<p>Find the real part of (${name})<sup>${n}</sup>.</p>`,
        answer, unit: '', tol: 0.001, abs: 1e-6,
        hint: 'Write the number as r e<sup>iθ</sup> first. Then raise r to the power and multiply the angle (De Moivre).',
        solution: steps(`${name} has modulus ${R === 2 ? '2' : '√2'} and argument ${th}°.`, `(${name})<sup>${n}</sup> = ${R === 2 ? '2' : '√2'}<sup>${n}</sup> e<sup>i·${n * th}°</sup>, of modulus ${+(R ** n).toFixed(4)}.`, `Real part = ${+(R ** n).toFixed(4)} × cos ${n * th}° = <b>${+answer.toFixed(4)}</b>.`),
        R, th, n,
      };
    },
    verify: (p) => p.R ** p.n * Math.cos((p.n * p.th * Math.PI) / 180),
  },
  'shm-speed': {
    title: 'speed in simple harmonic motion',
    make(r) {
      const A = int(r, 5, 15), x = int(r, 1, A - 1), w = int(r, 2, 8);
      const answer = w * Math.sqrt(A * A - x * x);
      return {
        q: `<p>A particle moves in SHM with amplitude ${A} cm and angular frequency ${w} rad/s. How fast is it moving (in cm/s) when it is ${x} cm from the mean position?</p>`,
        answer, unit: 'cm/s', tol: 0.01,
        hint: 'Energy: ½mω²A² = ½mv² + ½mω²x², so v = ω√(A² − x²).',
        solution: steps(`A² − x² = ${A * A} − ${x * x} = ${A * A - x * x} cm².`, `√${A * A - x * x} = ${(+Math.sqrt(A * A - x * x).toFixed(4))} cm.`, `v = ${w} × ${(+Math.sqrt(A * A - x * x).toFixed(4))} = <b>${(+answer.toFixed(2))} cm/s</b>.`),
        A, x, w,
      };
    },
    verify: (p) => p.w * Math.sqrt(p.A ** 2 - p.x ** 2),
  },
  'steady-amplitude': {
    title: 'steady-state amplitude of a driven oscillator',
    make(r) {
      const m = [0.5, 1, 2][int(r, 0, 2)], k = [50, 100, 200][int(r, 0, 2)], b = int(r, 1, 6), F = int(r, 1, 10);
      const w0 = Math.sqrt(k / m), w = +(w0 * (0.5 + 0.1 * int(r, 0, 10))).toFixed(1);
      const D = Math.hypot(w0 * w0 - w * w, (b / m) * w), answer = 100 * (F / m) / D;
      return {
        q: `<p>A ${m} kg mass on a spring (k = ${k} N/m) with damping constant b = ${b} kg/s is driven by F = ${F} cos(${w}t) N. Find the steady-state amplitude in cm.</p>`,
        answer, unit: 'cm', tol: 0.01,
        hint: 'A = (F₀/m) / √((ω₀² − ω²)² + (bω/m)²), with ω₀² = k/m.',
        solution: steps(`ω₀² = k/m = ${(+(w0 * w0).toFixed(3))} s⁻², ω² = ${(+(w * w).toFixed(3))} s⁻².`, `bω/m = ${(+(b * w / m).toFixed(3))} s⁻².`, `√((${(+(w0 * w0 - w * w).toFixed(3))})² + (${(+(b * w / m).toFixed(3))})²) = ${(+D.toFixed(3))}.`, `A = ${(+(F / m).toFixed(3))} / ${(+D.toFixed(3))} m = <b>${(+answer.toFixed(3))} cm</b>.`),
        m, k, b, F, w,
      };
    },
    verify: (p) => 100 * (p.F / p.m) / Math.hypot(p.k / p.m - p.w * p.w, (p.b / p.m) * p.w),
  },
  'fringe-width': {
    title: 'fringe width in Young\'s experiment',
    make(r) {
      const lam = [450, 500, 550, 600, 650][int(r, 0, 4)], d = [0.1, 0.2, 0.25, 0.4, 0.5][int(r, 0, 4)], D = 0.5 * int(r, 1, 6);
      const answer = lam * 1e-9 * D / (d * 1e-3) * 1e3;
      return {
        q: `<p>Light of wavelength ${lam} nm falls on two slits ${d} mm apart. Find the fringe width, in mm, on a screen ${D} m away.</p>`,
        answer, unit: 'mm', tol: 0.01,
        hint: 'β = λD/d. Put every length in metres first, then turn the answer into mm.',
        solution: steps(`λ = ${lam}×10⁻⁹ m, d = ${d}×10⁻³ m, D = ${D} m.`, `β = λD/d = (${lam}×10⁻⁹ × ${D}) / (${d}×10⁻³) = ${(+(answer / 1000).toPrecision(4))} m.`, `So β = <b>${(+answer.toFixed(3))} mm</b>.`),
        lam, d, D,
      };
    },
    verify: (p) => p.lam * 1e-9 * p.D / (p.d * 1e-3) * 1e3,
  },
  'grating-angle': {
    title: 'angle of a grating order',
    make(r) {
      const N = [2000, 3000, 4000, 5000, 6000][int(r, 0, 4)], lam = [400, 450, 500, 550, 600][int(r, 0, 4)], m = int(r, 1, 2);
      const dm = 1e-2 / N, s = m * lam * 1e-9 / dm, answer = Math.asin(s) * 180 / Math.PI;
      return {
        q: `<p>A grating has ${N} lines per cm. Light of wavelength ${lam} nm falls on it normally. At what angle (in degrees) from the normal is the order ${m} maximum?</p>`,
        answer, unit: '°', tol: 0.005,
        hint: 'd sin θ = mλ, where d is the spacing between lines: d = 1/(lines per metre).',
        solution: steps(`d = 1/${N} cm = ${(+(dm * 1e6).toFixed(4))} μm.`, `sin θ = mλ/d = ${m} × ${lam / 1000} / ${(+(dm * 1e6).toFixed(4))} = ${(+s.toFixed(4))}.`, `θ = sin⁻¹(${(+s.toFixed(4))}) = <b>${(+answer.toFixed(2))}°</b>.`),
        N, lam, m,
      };
    },
    verify: (p) => Math.asin(p.m * p.lam * 1e-9 * p.N / 1e-2) * 180 / Math.PI,
  },
  'atwood-machine': {
    title: 'an Atwood machine',
    make(r) {
      const m1 = int(r, 1, 6), m2 = m1 + int(r, 1, 5);
      const a = (m2 - m1) * 9.8 / (m1 + m2), T = 2 * m1 * m2 * 9.8 / (m1 + m2);
      return {
        q: `<p>Blocks of ${m1} kg and ${m2} kg hang at the ends of a light string over a smooth, light pulley. Find the tension in the string (g = 9.8 m/s²).</p>`,
        answer: T, unit: 'N', tol: 0.01,
        hint: 'Write F = ma for each block separately, with the same acceleration a and the same tension T, then solve the two equations.',
        solution: steps(`Heavier block (down): ${m2}g − T = ${m2}a. Lighter block (up): T − ${m1}g = ${m1}a.`, `Add them: (${m2} − ${m1})g = ${m1 + m2}a, so a = ${(+a.toFixed(3))} m/s².`, `T = ${m1}(g + a) = ${m1}(9.8 + ${(+a.toFixed(3))}) = <b>${(+T.toFixed(2))} N</b>. Check: 2m₁m₂g/(m₁ + m₂) gives the same.`),
        m1, m2,
      };
    },
    verify: (p) => 2 * p.m1 * p.m2 * 9.8 / (p.m1 + p.m2),
  },
  'elastic-collision': {
    title: 'a head-on elastic collision',
    make(r) {
      const m1 = int(r, 1, 6), m2 = int(r, 1, 6) + (r() < 0.5 ? 0 : 3), u = int(r, 2, 12);
      const v1 = (m1 - m2) * u / (m1 + m2), v2 = 2 * m1 * u / (m1 + m2);
      return {
        q: `<p>A ${m1} kg ball moving at ${u} m/s hits a ${m2} kg ball at rest, head-on and elastically. Find the velocity of the ${m1} kg ball afterwards (m/s, positive in the original direction).</p>`,
        answer: v1, unit: 'm/s', tol: 0.01, abs: 0.005,
        hint: 'Use v₁ = (m₁ − m₂)u/(m₁ + m₂). A negative answer means the ball bounces back.',
        solution: steps(`Momentum and kinetic energy are both kept. Solving the two equations gives v₁ = (m₁ − m₂)u/(m₁ + m₂) and v₂ = 2m₁u/(m₁ + m₂).`, `v₁ = (${m1} − ${m2})×${u}/${m1 + m2} = <b>${(+v1.toFixed(3))} m/s</b>.`, `Check: v₂ = ${(+v2.toFixed(3))} m/s, and v₂ − v₁ = ${(+(v2 - v1).toFixed(3))} = u, so the balls separate as fast as they met.`),
        m1, m2, u,
      };
    },
    verify: (p) => (p.m1 - p.m2) * p.u / (p.m1 + p.m2),
  },
  'orbit-period': {
    title: 'Kepler\'s third law',
    make(r) {
      const rp = +(0.3 + r() * 2).toFixed(1), ra = +(rp + 0.5 + r() * 20).toFixed(1), M = [0.5, 1, 2][int(r, 0, 2)];
      const a = (rp + ra) / 2, T = Math.sqrt(a ** 3 / M);
      return {
        q: `<p>A comet orbits a star of ${M} solar mass${M === 1 ? '' : 'es'}. Its closest distance is ${rp} AU and its farthest ${ra} AU. Find its period in years.</p>`,
        answer: T, unit: 'years', tol: 0.01,
        hint: 'The semi-major axis is half the sum of the closest and farthest distances. In years, AU and solar masses, T² = a³/M.',
        solution: steps(`a = (${rp} + ${ra})/2 = ${(+a.toFixed(3))} AU.`, `T² = a³/M = ${(+(a ** 3).toFixed(2))}/${M}.`, `T = <b>${(+T.toFixed(2))} years</b>.`),
        a, M,
      };
    },
    verify: (p) => Math.sqrt(p.a ** 3 / p.M),
  },
  'parallel-axis-disc': {
    title: 'the parallel axis theorem',
    make(r) {
      const M = int(r, 1, 12), R = +(0.1 + int(r, 1, 9) * 0.1).toFixed(1), f = [0.25, 0.5, 0.75, 1][int(r, 0, 3)];
      const d = +(f * R).toFixed(3), I = 0.5 * M * R * R + M * d * d;
      return {
        q: `<p>A uniform disc of mass ${M} kg and radius ${R} m turns about an axis perpendicular to the disc through a point ${d} m from its centre. Find its moment of inertia in kg m².</p>`,
        answer: I, unit: 'kg m²', tol: 0.005,
        hint: 'Start from the centre-of-mass value ½MR² and add Md².',
        solution: steps(`I<sub>cm</sub> = ½MR² = ½×${M}×${R}² = ${(+(0.5 * M * R * R).toFixed(4))} kg m².`, `Md² = ${M}×${d}² = ${(+(M * d * d).toFixed(4))} kg m².`, `I = <b>${(+I.toFixed(4))} kg m²</b>.`),
        M, R, d,
      };
    },
    verify: (p) => 0.5 * p.M * p.R ** 2 + p.M * p.d ** 2,
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
  // ---- module 5: kinetic theory and thermodynamics ----
  'gas-speeds': {
    title: 'molecular speeds in a gas',
    make(r) {
      const [gas, M] = [['helium', 4], ['nitrogen', 28], ['oxygen', 32], ['argon', 40], ['neon', 20]][int(r, 0, 4)];
      const T = int(r, 10, 60) * 10, [kind, k, f] = [['most probable', 2, '√(2RT/M)'], ['mean', 8 / Math.PI, '√(8RT/πM)'], ['rms', 3, '√(3RT/M)']][int(r, 0, 2)];
      const answer = Math.sqrt(k * 8.314 * T / (M / 1000));
      return {
        q: `<p>Find the ${kind} speed of ${gas} molecules (M = ${M} g/mol) at ${T} K, in m/s. Take R = 8.314 J mol⁻¹ K⁻¹.</p>`,
        answer, unit: 'm/s', tol: 0.01,
        hint: 'Three speeds, three numbers under the root: 2 for the most probable, 8/π for the mean, 3 for the rms. Put M in kg/mol.',
        solution: steps(`The ${kind} speed is ${f}.`, `M = ${M / 1000} kg/mol, so RT/M = 8.314 × ${T} / ${M / 1000} = ${(8.314 * T / (M / 1000)).toFixed(0)} m²/s².`, `Multiply by ${k === 3 ? '3' : k === 2 ? '2' : '8/π = 2.546'} and take the square root: <b>${answer.toFixed(1)}</b> m/s.`),
        k, M, T,
      };
    },
    verify: (p) => Math.sqrt(p.k * 8.314 * p.T / (p.M / 1000)),
  },
  'isothermal-adiabatic-work': {
    title: 'work in an isothermal or adiabatic expansion',
    make(r) {
      const n = int(r, 1, 3), T = int(r, 30, 50) * 10, k = [2, 3, 4][int(r, 0, 2)], adia = r() < 0.5;
      const g = 5 / 3, answer = adia ? n * 1.5 * 8.314 * T * (1 - Math.pow(k, 1 - g)) : n * 8.314 * T * Math.log(k);
      return {
        q: `<p>${n} mol of a monatomic ideal gas at ${T} K expands reversibly to ${k} times its volume, ${adia ? 'adiabatically' : 'at constant temperature'}. Find the work done by the gas in joules.</p>`,
        answer, unit: 'J', tol: 0.005,
        hint: adia ? 'No heat flows, so W = −ΔU = nC<sub>V</sub>(T₁ − T₂). Find T₂ from TV<sup>γ−1</sup> = constant with γ = 5/3.' : 'At constant T, P = nRT/V changes as the gas expands, so W = ∫P dV = nRT ln(V₂/V₁).',
        solution: adia
          ? steps(`T₂ = T₁(V₁/V₂)<sup>γ−1</sup> = ${T} × ${k}<sup>−2/3</sup> = ${(T * Math.pow(k, -2 / 3)).toFixed(1)} K.`, `W = nC<sub>V</sub>(T₁ − T₂) = ${n} × 1.5 × 8.314 × ${(T - T * Math.pow(k, -2 / 3)).toFixed(1)}.`, `W = <b>${answer.toFixed(0)}</b> J, less than the isothermal value ${(n * 8.314 * T * Math.log(k)).toFixed(0)} J because the gas cools as it expands.`)
          : steps(`W = nRT ln(V₂/V₁) = ${n} × 8.314 × ${T} × ln ${k}.`, `ln ${k} = ${Math.log(k).toFixed(4)}.`, `W = <b>${answer.toFixed(0)}</b> J. ΔU = 0, so the gas absorbs exactly this much heat.`),
        n, T, k, adia,
      };
    },
    verify: (p) => (p.adia ? p.n * 1.5 * 8.314 * p.T * (1 - Math.pow(p.k, -2 / 3)) : p.n * 8.314 * p.T * Math.log(p.k)),
  },
  'carnot-fridge': {
    title: 'power for an ideal refrigerator',
    make(r) {
      const Tc = int(r, 240, 280), Th = Tc + int(r, 20, 60), Qc = int(r, 2, 20) * 50;
      const answer = Qc * (Th - Tc) / Tc;
      return {
        q: `<p>A reversible refrigerator removes heat at ${Qc} W from a cold box at ${Tc} K and rejects heat to a room at ${Th} K. What electrical power does it need, in watts?</p>`,
        answer, unit: 'W', tol: 0.005,
        hint: 'For a reversible machine the entropy taken from the cold side equals the entropy given to the hot side: Q<sub>c</sub>/T<sub>c</sub> = Q<sub>h</sub>/T<sub>h</sub>. The work is the difference of the heats.',
        solution: steps(`COP = T<sub>c</sub>/(T<sub>h</sub> − T<sub>c</sub>) = ${Tc}/${Th - Tc} = ${(Tc / (Th - Tc)).toFixed(3)}.`, `Power = Q<sub>c</sub>/COP = ${Qc} × ${Th - Tc}/${Tc}.`, `Power = <b>${answer.toFixed(1)}</b> W, and the room receives ${(Qc + answer).toFixed(1)} W.`),
        Qc, Tc, Th,
      };
    },
    verify: (p) => p.Qc * p.Th / p.Tc - p.Qc,
  },
  'entropy-two-blocks': {
    title: 'entropy made when two blocks reach the same temperature',
    make(r) {
      const C = int(r, 2, 9) * 100, T1 = int(r, 35, 60) * 10, T2 = int(r, 15, 30) * 10, Tf = (T1 + T2) / 2;
      const answer = C * Math.log(Tf / T1) + C * Math.log(Tf / T2);
      return {
        q: `<p>Two blocks, each of heat capacity ${C} J/K, at ${T1} K and ${T2} K, touch inside an insulating box until they reach the same temperature. Find the total entropy change in J/K.</p>`,
        answer, unit: 'J/K', tol: 0.005,
        hint: 'Find the common final temperature from energy conservation first. Then add ∫C dT/T = C ln(T<sub>f</sub>/T<sub>i</sub>) for each block.',
        solution: steps(`Equal heat capacities, so T<sub>f</sub> = (${T1} + ${T2})/2 = ${Tf} K.`, `Hot block: ${C} ln(${Tf}/${T1}) = ${(C * Math.log(Tf / T1)).toFixed(2)} J/K. Cold block: ${C} ln(${Tf}/${T2}) = +${(C * Math.log(Tf / T2)).toFixed(2)} J/K.`, `Total = <b>${answer.toFixed(2)}</b> J/K, positive: heat flowing across a temperature difference always makes entropy.`),
        C, T1, T2,
      };
    },
    verify: (p) => p.C * Math.log(((p.T1 + p.T2) / 2) ** 2 / (p.T1 * p.T2)),
  },
  'vdw-free-expansion': {
    title: 'cooling of a van der Waals gas in a free expansion',
    make(r) {
      const a = int(r, 10, 50) / 100, V1 = int(r, 1, 4) / 2, k = [2, 3, 4][int(r, 0, 2)], cv = [1.5, 2.5][int(r, 0, 1)];
      const answer = (a / (cv * 8.314)) * (1 / (k * V1 * 1e-3) - 1 / (V1 * 1e-3));
      return {
        q: `<p>One mole of a van der Waals gas (a = ${a} Pa m⁶ mol⁻², C<sub>V</sub> = ${cv}R) expands freely into vacuum inside an insulated container, from ${V1} L to ${k * V1} L. Find its temperature change in kelvin.</p>`,
        answer, unit: 'K', tol: 0.005,
        hint: 'Nothing goes in or out, so U stays the same. For a van der Waals gas U = C<sub>V</sub>T − a/V per mole.',
        solution: steps(`U constant: C<sub>V</sub>ΔT = a(1/V₂ − 1/V₁).`, `1/V₂ − 1/V₁ = 1/${(k * V1 * 1e-3).toFixed(4)} − 1/${(V1 * 1e-3).toFixed(4)} = ${(1 / (k * V1 * 1e-3) - 1 / (V1 * 1e-3)).toFixed(1)} m⁻³.`, `ΔT = ${a} × that / ${(cv * 8.314).toFixed(3)} = <b>${answer.toFixed(3)}</b> K. The gas cools: separating attracting molecules costs kinetic energy.`),
        a, V1, k, cv,
      };
    },
    verify: (p) => -(p.a * (1 - 1 / p.k)) / (p.V1 * 1e-3 * p.cv * 8.314),
  },
  // ---- module 6: modern physics ----
  'stopping-potential': {
    title: 'stopping potential from wavelength and work function',
    make(r) {
      const lam = [200, 220, 250, 280, 300, 330, 360, 400][int(r, 0, 7)], phi = [1.9, 2.1, 2.3, 2.5, 2.8, 3.0][int(r, 0, 5)];
      const E = 1240 / lam, answer = E - phi;
      return {
        q: `<p>Light of wavelength ${lam} nm falls on a metal whose work function is ${phi} eV. Find the stopping potential in volts. Take hc = 1240 eV nm.</p>`,
        answer, unit: 'V', tol: 0.005,
        hint: 'Find the photon energy in eV with E = 1240/λ(nm). The fastest electron keeps what is left after paying the work function, and the stopping potential in volts equals that energy in eV.',
        solution: steps(`Photon energy E = 1240/${lam} = ${E.toFixed(3)} eV.`, `K<sub>max</sub> = E − φ = ${E.toFixed(3)} − ${phi} = ${answer.toFixed(3)} eV.`, `An electron with ${answer.toFixed(3)} eV is stopped by <b>${answer.toFixed(3)} V</b>.`),
        lam, phi,
      };
    },
    verify: (p) => 1240 / p.lam - p.phi,
  },
  'compton-scatter': {
    title: 'energy of a Compton-scattered photon',
    make(r) {
      const E = [60, 100, 140, 200, 300, 511, 662][int(r, 0, 6)], th = [30, 60, 90, 120, 150, 180][int(r, 0, 5)];
      const c = 1 - Math.cos(th * Math.PI / 180), answer = E / (1 + (E / 511) * c);
      return {
        q: `<p>A gamma photon of energy ${E} keV is scattered through ${th}° by a free electron at rest. Find the energy of the scattered photon in keV (m<sub>e</sub>c² = 511 keV).</p>`,
        answer, unit: 'keV', tol: 0.005,
        hint: 'In energy form the Compton formula reads 1/E′ = 1/E + (1 − cos θ)/(m<sub>e</sub>c²).',
        solution: steps(`1 − cos ${th}° = ${c.toFixed(4)}.`, `1/E′ = 1/${E} + ${c.toFixed(4)}/511 = ${(1 / E + c / 511).toFixed(6)} keV⁻¹.`, `E′ = <b>${answer.toFixed(1)} keV</b>; the electron carries off the other ${(E - answer).toFixed(1)} keV.`),
        E, th,
      };
    },
    verify: (p) => 1 / (1 / p.E + (1 - Math.cos(p.th * Math.PI / 180)) / 511),
  },
  'de-broglie-electron': {
    title: 'de Broglie wavelength of an accelerated electron',
    make(r) {
      const V = [25, 50, 81, 100, 150, 200, 400, 600, 1000][int(r, 0, 8)];
      const p = Math.sqrt(2 * 9.11e-31 * 1.6e-19 * V), answer = 6.63e-34 / p * 1e9;
      return {
        q: `<p>An electron starts from rest and is accelerated through ${V} V. Find its de Broglie wavelength in nm. Use h = 6.63×10⁻³⁴ J s, m<sub>e</sub> = 9.11×10⁻³¹ kg, e = 1.6×10⁻¹⁹ C.</p>`,
        answer, unit: 'nm', tol: 0.005,
        hint: 'The kinetic energy is eV, so the momentum is p = √(2m·eV); then λ = h/p.',
        solution: steps(`K = eV = 1.6×10⁻¹⁹ × ${V} J.`, `p = √(2 × 9.11×10⁻³¹ × 1.6×10⁻¹⁹ × ${V}) = ${p.toExponential(3)} kg m/s.`, `λ = h/p = <b>${answer.toFixed(4)} nm</b> (check: 1.23/√${V} = ${(1.226 / Math.sqrt(V)).toFixed(4)} nm).`),
        V,
      };
    },
    verify: (p) => 1.227 / Math.sqrt(p.V),
  },
  'uncertainty-speed': {
    title: 'smallest speed uncertainty of a confined electron',
    make(r) {
      const dx = [0.05, 0.1, 0.2, 0.5, 1, 2][int(r, 0, 5)];
      const answer = 1.055e-34 / (2 * 9.11e-31 * dx * 1e-9) / 1000;
      return {
        q: `<p>An electron's position is uncertain by Δx = ${dx} nm. Using Δx·Δp ≥ ħ/2 (ħ = 1.055×10⁻³⁴ J s, m<sub>e</sub> = 9.11×10⁻³¹ kg), find the smallest possible uncertainty in its speed, in km/s.</p>`,
        answer, unit: 'km/s', tol: 0.005,
        hint: 'Find the smallest Δp from ħ/(2Δx), then divide by the mass to get Δv.',
        solution: steps(`Δp = ħ/(2Δx) = 1.055×10⁻³⁴ / (2 × ${dx}×10⁻⁹) = ${(1.055e-34 / (2 * dx * 1e-9)).toExponential(3)} kg m/s.`, `Δv = Δp/m = ${(answer * 1000).toExponential(3)} m/s.`, `So Δv = <b>${answer.toFixed(1)} km/s</b>.`),
        dx,
      };
    },
    verify: (p) => 1.055e-34 / (2 * 9.11e-31 * p.dx * 1e-9) / 1000,
  },
  'box-photon': {
    title: 'photon from a particle in a box',
    make(r) {
      const L = [0.5, 0.8, 1, 1.2, 1.5, 2][int(r, 0, 5)], lo = int(r, 1, 2), hi = lo + int(r, 1, 2);
      const dE = (hi * hi - lo * lo) * 0.376 / (L * L), answer = 1240 / dE;
      return {
        q: `<p>An electron in a one-dimensional infinite well of width ${L} nm drops from n = ${hi} to n = ${lo}. Find the wavelength of the emitted photon in nm. Take h²/(8m<sub>e</sub>) = 0.376 eV nm² and hc = 1240 eV nm.</p>`,
        answer, unit: 'nm', tol: 0.005,
        hint: 'E<sub>n</sub> = n² × 0.376/L² eV with L in nm. Find the difference of the two levels, then λ = 1240/ΔE.',
        solution: steps(`E<sub>1</sub> = 0.376/${L}² = ${(0.376 / (L * L)).toFixed(4)} eV.`, `ΔE = (${hi * hi} − ${lo * lo}) × ${(0.376 / (L * L)).toFixed(4)} = ${dE.toFixed(4)} eV.`, `λ = 1240/${dE.toFixed(4)} = <b>${answer.toFixed(1)} nm</b>.`),
        L, lo, hi,
      };
    },
    verify: (p) => 1240 * p.L * p.L / ((p.hi ** 2 - p.lo ** 2) * 0.376),
  },
  'tunnel-estimate': {
    title: 'thick-barrier tunnelling estimate',
    make(r) {
      const E = [0.5, 1, 1.5, 2][int(r, 0, 3)], V = E + [1, 2, 3, 4][int(r, 0, 3)], a = [0.2, 0.3, 0.4, 0.5][int(r, 0, 3)];
      const k = Math.sqrt((V - E) / 0.0381), answer = 2 * k * a;
      return {
        q: `<p>An electron of energy ${E} eV meets a barrier ${V} eV high and ${a} nm wide. Using ħ²/(2m<sub>e</sub>) = 0.0381 eV nm², find the exponent 2κa in the estimate T ≈ e<sup>−2κa</sup>.</p>`,
        answer, unit: '', tol: 0.005,
        hint: 'κ = √((V₀ − E)/(ħ²/2m)) in nm⁻¹. Only the energy deficit V₀ − E counts.',
        solution: steps(`V₀ − E = ${V - E} eV.`, `κ = √(${V - E}/0.0381) = ${k.toFixed(3)} nm⁻¹.`, `2κa = 2 × ${k.toFixed(3)} × ${a} = <b>${answer.toFixed(3)}</b>, so T ≈ e<sup>−${answer.toFixed(2)}</sup> = ${Math.exp(-answer).toExponential(2)}.`),
        E, V, a,
      };
    },
    verify: (p) => 2 * p.a * Math.sqrt((p.V - p.E) / 0.0381),
  },
  'rydberg-line': {
    title: 'wavelength of a hydrogen line',
    make(r) {
      const nf = int(r, 1, 3), ni = nf + int(r, 1, 3);
      const inv = 1.097e7 * (1 / (nf * nf) - 1 / (ni * ni)), answer = 1e9 / inv;
      const series = ['Lyman', 'Balmer', 'Paschen'][nf - 1];
      return {
        q: `<p>Find the wavelength, in nm, of the hydrogen line emitted when the electron drops from n = ${ni} to n = ${nf}. Use R = 1.097×10⁷ m⁻¹.</p>`,
        answer, unit: 'nm', tol: 0.005,
        hint: '1/λ = R(1/n<sub>f</sub>² − 1/n<sub>i</sub>²), with the lower level first so the answer is positive.',
        solution: steps(`1/λ = 1.097×10⁷ × (1/${nf * nf} − 1/${ni * ni}) = ${inv.toExponential(4)} m⁻¹.`, `λ = ${(1 / inv).toExponential(4)} m = <b>${answer.toFixed(1)} nm</b>.`, `It ends on n = ${nf}, so it belongs to the ${series} series.`),
        ni, nf,
      };
    },
    verify: (p) => 1e9 / (1.097e7 * (1 / p.nf ** 2 - 1 / p.ni ** 2)),
  },
  'moseley-energy': {
    title: 'K-alpha energy from Moseley\'s law',
    make(r) {
      const Z = int(r, 20, 50), answer = 10.2 * (Z - 1) ** 2 / 1000;
      return {
        q: `<p>Use Moseley's law in the form E(Kα) ≈ 10.2 (Z − 1)² eV to find the Kα X-ray energy, in keV, of the element with Z = ${Z}. Then find its wavelength (hc = 1240 eV nm) as a check.</p>`,
        answer, unit: 'keV', tol: 0.005,
        hint: 'The 10.2 eV is the hydrogen 2 → 1 energy, 13.6 × 3/4; the nucleus is screened by the one K electron left, so use Z − 1.',
        solution: steps(`Z − 1 = ${Z - 1}, (Z − 1)² = ${(Z - 1) ** 2}.`, `E = 10.2 × ${(Z - 1) ** 2} = ${(answer * 1000).toFixed(0)} eV = <b>${answer.toFixed(2)} keV</b>.`, `λ = 1240/${(answer * 1000).toFixed(0)} = ${(1240 / (answer * 1000)).toFixed(4)} nm.`),
        Z,
      };
    },
    verify: (p) => 13.6 * 0.75 * (p.Z - 1) ** 2 / 1000,
  },
  // ---- Mathematical methods: calculus, partial derivatives, multiple integrals, vector algebra, Fourier series ----
  'taylor-sqrt': {
    title: 'square root by a first-order Taylor step',
    make(r) {
      const a = int(r, 3, 15), d = int(r, -4, 6) || 2, N = a * a + d;
      const answer = a + d / (2 * a);
      return {
        q: `<p>Estimate √${N} by writing it as √(${a * a} ${d < 0 ? '−' : '+'} ${Math.abs(d)}) and using the first-order Taylor step √(A² + δ) ≈ A + δ/(2A). Give the estimate to four decimal places.</p>`,
        answer, unit: '', tol: 0.0002,
        hint: `Take A = ${a}, the nearest whole square root, so that δ = ${d} is small compared with A² = ${a * a}.`,
        solution: steps(`f(x) = √x has f′(x) = 1/(2√x). Expand about x = ${a * a}: √(${a * a} + δ) ≈ ${a} + δ/(2 × ${a}).`, `δ = ${d}, so the step is ${d}/${2 * a} = ${(d / (2 * a)).toFixed(5)}.`, `Estimate: <b>${answer.toFixed(4)}</b>. (Exact: ${Math.sqrt(N).toFixed(4)}; the error is about δ²/(8A³) = ${((d * d) / (8 * a ** 3)).toFixed(5)}.)`),
        a, d,
      };
    },
    verify: (p) => { const h = 1e-6, A2 = p.a * p.a; return Math.sqrt(A2) + ((Math.sqrt(A2 + h) - Math.sqrt(A2 - h)) / (2 * h)) * p.d; },
  },
  'error-propagation': {
    title: 'maximum error in g from a pendulum',
    make(r) {
      const pL = int(r, 1, 10) / 10, pT = int(r, 1, 10) / 10;
      const answer = pL + 2 * pT;
      return {
        q: `<p>In a pendulum experiment g = 4π²L/T². The length is measured to within ${pL}% and the period to within ${pT}%. What is the largest possible percentage error in g?</p>`,
        answer, unit: '%', tol: 0.001,
        hint: 'Take logs: ln g = ln(4π²) + ln L − 2 ln T. Differentiate, then add the sizes of the terms for the worst case.',
        solution: steps('dg/g = dL/L − 2 dT/T.', `Worst case: the two parts add in size: ${pL}% + 2 × ${pT}%.`, `Maximum error = <b>${answer.toFixed(1)}%</b>. The period counts twice because it is squared.`),
        pL, pT,
      };
    },
    // worst-case linear error, from a tiny numerical step in the worst direction
    verify: (p) => { const g = (L, T) => (4 * Math.PI ** 2 * L) / (T * T), e = 1e-7; return (100 * (g(1 + (e * p.pL) / 100, 1 - (e * p.pT) / 100) / g(1, 1) - 1)) / e; },
  },
  'disc-mass-polar': {
    title: 'mass of a disc with varying density (polar integral)',
    make(r) {
      const k = int(r, 1, 6), n = int(r, 1, 3), R = int(r, 1, 4) / 2;
      const answer = (2 * Math.PI * k * R ** (n + 2)) / (n + 2);
      return {
        q: `<p>A thin disc of radius ${R} m has surface density σ = ${k}r${n === 1 ? '' : '<sup>' + n + '</sup>'} kg/m², where r is the distance from the centre in metres. Find its mass in kg.</p>`,
        answer, unit: 'kg', tol: 0.005,
        hint: 'Cut the disc into thin rings. A ring of radius r and width dr has area 2πr dr (that extra r is the polar Jacobian).',
        solution: steps(`dM = σ · 2πr dr = ${k}r${n === 1 ? '' : '<sup>' + n + '</sup>'} · 2πr dr.`, `M = 2π × ${k} ∫₀<sup>${R}</sup> r<sup>${n + 1}</sup> dr = 2π × ${k} × ${R}<sup>${n + 2}</sup>/${n + 2}.`, `M = <b>${answer.toFixed(3)} kg</b>.`),
        k, n, R,
      };
    },
    verify: (p) => { const N = 2000, h = p.R / N; let s = 0; for (let i = 0; i < N; i++) { const rr = (i + 0.5) * h; s += p.k * rr ** p.n * 2 * Math.PI * rr * h; } return s; },
  },
  'box-volume': {
    title: 'volume of a parallelepiped (scalar triple product)',
    make(r) {
      const D = (a, b, c) => a[0] * (b[1] * c[2] - b[2] * c[1]) - a[1] * (b[0] * c[2] - b[2] * c[0]) + a[2] * (b[0] * c[1] - b[1] * c[0]);
      let a = [int(r, -3, 3), int(r, -3, 3), int(r, -3, 3)], b = [int(r, -3, 3), int(r, -3, 3), int(r, -3, 3)], c = [int(r, -3, 3), int(r, -3, 3), int(r, -3, 3)];
      if (D(a, b, c) === 0) { a = [2, 1, 0]; b = [int(r, -2, 2), 3, 1]; c = [1, 0, int(r, 2, 4)]; }
      const det = D(a, b, c);
      const bc = [b[1] * c[2] - b[2] * c[1], b[2] * c[0] - b[0] * c[2], b[0] * c[1] - b[1] * c[0]];
      return {
        q: `<p>Find the volume of the parallelepiped with edges <b>a</b> = (${a.join(', ')}), <b>b</b> = (${b.join(', ')}) and <b>c</b> = (${c.join(', ')}).</p>`,
        answer: Math.abs(det), unit: '', tol: 0, abs: 1e-9,
        hint: 'Volume = |a · (b × c)|, the absolute value of the 3 × 3 determinant with a, b, c as rows.',
        solution: steps(`b × c = (${bc.join(', ')}).`, `a · (b × c) = ${a[0]}(${bc[0]}) + ${a[1]}(${bc[1]}) + ${a[2]}(${bc[2]}) = ${det}.`, `Volume = |${det}| = <b>${Math.abs(det)}</b>.${det < 0 ? ' (The negative sign only means a, b, c form a left-handed set.)' : ''}`),
        a, b, c,
      };
    },
    // expand along the third row instead of the first
    verify: (p) => { const { a, b, c } = p; return Math.abs(c[0] * (a[1] * b[2] - a[2] * b[1]) - c[1] * (a[0] * b[2] - a[2] * b[0]) + c[2] * (a[0] * b[1] - a[1] * b[0])); },
  },
  'square-wave-coeff': {
    title: 'Fourier coefficient of a square wave',
    make(r) {
      const h = int(r, 1, 9), n = [1, 3, 5, 7, 9][int(r, 0, 4)];
      const answer = (4 * h) / (n * Math.PI);
      return {
        q: `<p>A square wave equals +${h} for 0 &lt; x &lt; π and −${h} for −π &lt; x &lt; 0, repeating every 2π. Find the coefficient b<sub>${n}</sub> of sin ${n}x in its Fourier series.</p>`,
        answer, unit: '', tol: 0.002,
        hint: 'The wave is odd, so b<sub>n</sub> = (2/π) ∫₀<sup>π</sup> f(x) sin nx dx.',
        solution: steps(`b<sub>n</sub> = (2/π) ∫₀<sup>π</sup> ${h} sin nx dx = (${2 * h}/(nπ)) (1 − cos nπ).`, `For odd n, cos nπ = −1, so b<sub>n</sub> = ${4 * h}/(nπ).`, `With n = ${n}: b<sub>${n}</sub> = ${4 * h}/(${n}π) = <b>${answer.toFixed(4)}</b>.`),
        h, n,
      };
    },
    verify: (p) => { const N = 4000, dx = Math.PI / N; let s = 0; for (let i = 0; i < N; i++) s += p.h * Math.sin(p.n * (i + 0.5) * dx) * dx; return (2 / Math.PI) * s; },
  },
};

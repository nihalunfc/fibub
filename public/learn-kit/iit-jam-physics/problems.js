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
  // ---- 7.5 Transistors and amplifiers ----
  'divider-bias': {
    title: 'Q-point of a voltage-divider bias circuit',
    make(r) {
      const pickOf = (a) => a[int(r, 0, a.length - 1)];
      let VCC, R1, R2, RE, RC, VB, IE, VCE;
      let n = 0;
      do {
        VCC = pickOf([9, 10, 12, 15, 18]); R1 = pickOf([22, 33, 47, 56, 68, 82]); R2 = pickOf([4.7, 6.8, 8.2, 10, 12, 15]);
        RE = pickOf([0.47, 1, 1.2, 1.5, 2.2]); RC = pickOf([1, 2.2, 3.3, 4.7]);
        if (++n > 50) { VCC = 12; R1 = 47; R2 = 10; RE = 1; RC = 2.2; }
        VB = VCC * R2 / (R1 + R2); IE = (VB - 0.7) / RE; VCE = VCC - IE * (RC + RE);
      } while (VB < 1.2 || VCE < 1);
      const s3 = (x) => +x.toPrecision(3);
      return {
        q: `<p>A voltage-divider biased common-emitter stage has V<sub>CC</sub> = ${VCC} V, R<sub>1</sub> = ${R1} kΩ (top), R<sub>2</sub> = ${R2} kΩ (bottom), R<sub>E</sub> = ${RE} kΩ and R<sub>C</sub> = ${RC} kΩ. Take V<sub>BE</sub> = 0.7 V and β very large. Find V<sub>CE</sub>, in volts.</p>`,
        answer: VCE, unit: 'V', tol: 0.01,
        hint: 'With no base current the divider sets V<sub>B</sub>. Then V<sub>E</sub> = V<sub>B</sub> − 0.7, I<sub>E</sub> = V<sub>E</sub>/R<sub>E</sub> ≈ I<sub>C</sub>, and V<sub>CE</sub> = V<sub>CC</sub> − I<sub>C</sub>(R<sub>C</sub> + R<sub>E</sub>).',
        solution: steps(`V<sub>B</sub> = ${VCC} × ${R2}/(${R1} + ${R2}) = ${s3(VB)} V.`, `V<sub>E</sub> = ${s3(VB - 0.7)} V, so I<sub>E</sub> = ${s3(VB - 0.7)}/${RE} kΩ = ${s3(IE)} mA ≈ I<sub>C</sub>.`, `V<sub>CE</sub> = ${VCC} − ${s3(IE)} × (${RC} + ${RE}) = <b>${s3(VCE)} V</b>. It is above about 0.2 V, so the transistor is active.`),
        VCC, R1, R2, RE, RC,
      };
    },
    verify: (p) => { const IE = (p.VCC * p.R2 / (p.R1 + p.R2) - 0.7) / p.RE; return p.VCC - IE * (p.RC + p.RE); },
  },
  'ce-gain': {
    title: 'voltage gain of a common-emitter stage',
    make(r) {
      const IC = [0.5, 1, 2, 2.5][int(r, 0, 3)], RC = int(r, 2, 10), RL = [2, 5, 10, 20][int(r, 0, 3)], RE = [0, 0, 100, 220, 470][int(r, 0, 4)];
      const re = 25 / IC, Rac = RC * RL / (RC + RL);
      const answer = Rac * 1000 / (re + RE);
      const s3 = (x) => +x.toPrecision(3);
      return {
        q: `<p>A common-emitter stage runs at I<sub>C</sub> = ${IC} mA (V<sub>T</sub> = 25 mV, β large). R<sub>C</sub> = ${RC} kΩ and a ${RL} kΩ load is capacitively coupled. ${RE ? `An emitter resistor of ${RE} Ω is left unbypassed.` : 'The emitter resistor is fully bypassed.'} Find the magnitude of the mid-band voltage gain.</p>`,
        answer, unit: '', tol: 0.01,
        hint: 'r<sub>e</sub> = V<sub>T</sub>/I<sub>C</sub>. The gain magnitude is (R<sub>C</sub> ∥ R<sub>L</sub>) divided by the total unbypassed resistance in the emitter, r<sub>e</sub> + R<sub>E</sub>.',
        solution: steps(`r<sub>e</sub> = 25 mV / ${IC} mA = ${s3(re)} Ω.`, `R<sub>C</sub> ∥ R<sub>L</sub> = ${s3(Rac)} kΩ.`, `|A<sub>v</sub>| = ${s3(Rac * 1000)} / (${s3(re)}${RE ? ` + ${RE}` : ''}) = <b>${s3(answer)}</b>. The output is inverted.`),
        IC, RC, RL, RE,
      };
    },
    verify: (p) => (p.RC * p.RL / (p.RC + p.RL)) * 1000 / (25 / p.IC + p.RE),
  },
  // ---- 7.6 Operational amplifiers ----
  'opamp-output': {
    title: 'output of an op-amp amplifier, with saturation',
    make(r) {
      const inv = r() < 0.5, Rin = [1, 2.2, 4.7, 10][int(r, 0, 3)], Rf = [10, 22, 47, 100, 220][int(r, 0, 4)], Vin = int(r, -20, 20) / 10 || 0.3;
      const G = inv ? -Rf / Rin : 1 + Rf / Rin, ideal = G * Vin, answer = Math.max(-13, Math.min(13, ideal));
      const s3 = (x) => +x.toPrecision(3);
      return {
        q: `<p>An ${inv ? 'inverting' : 'non-inverting'} amplifier uses R<sub>f</sub> = ${Rf} kΩ and ${inv ? 'R<sub>in</sub>' : 'R<sub>1</sub>'} = ${Rin} kΩ, with ±15 V supplies; the output can swing only to ±13 V. Find the output for a DC input of ${Vin} V, in volts.</p>`,
        answer, unit: 'V', tol: 0.005, abs: 0.01,
        hint: `Gain = ${inv ? '−R<sub>f</sub>/R<sub>in</sub>' : '1 + R<sub>f</sub>/R<sub>1</sub>'}. If the result is beyond ±13 V, the output sticks at the limit.`,
        solution: steps(`Gain = ${inv ? `−${Rf}/${Rin}` : `1 + ${Rf}/${Rin}`} = ${s3(G)}.`, `Ideal output = ${s3(G)} × ${Vin} = ${s3(ideal)} V.`, Math.abs(ideal) > 13 ? `That is beyond the ±13 V swing, so the op-amp saturates: V<sub>out</sub> = <b>${answer} V</b>.` : `This is within ±13 V, so V<sub>out</sub> = <b>${s3(answer)} V</b>.`),
        inv, Rin, Rf, Vin,
      };
    },
    verify: (p) => Math.max(-13, Math.min(13, (p.inv ? -p.Rf / p.Rin : 1 + p.Rf / p.Rin) * p.Vin)),
  },
  'slew-limit': {
    title: 'largest undistorted frequency (slew rate and bandwidth)',
    make(r) {
      const SR = [0.5, 1, 2, 5, 13][int(r, 0, 4)], GBW = [1, 3, 4, 10][int(r, 0, 3)], G = [5, 10, 20, 50][int(r, 0, 3)], Vi = int(r, 1, 10) / 10;
      const Vp = G * Vi, fs = SR * 1e6 / (2 * Math.PI * Vp) / 1e3, fb = GBW * 1e3 / G, answer = Math.min(fs, fb);
      const s3 = (x) => +x.toPrecision(3);
      return {
        q: `<p>An op-amp with slew rate ${SR} V/μs and gain-bandwidth product ${GBW} MHz is used as a non-inverting amplifier of gain ${G}. The input is a sine wave of ${Vi} V peak. Find the highest input frequency, in kHz, for which the output is neither slew-limited nor beyond the −3 dB bandwidth.</p>`,
        answer, unit: 'kHz', tol: 0.01,
        hint: 'Work out both limits: f = SR/(2πV<sub>p</sub>) for the OUTPUT peak V<sub>p</sub>, and f = GBW/gain. The smaller one wins.',
        solution: steps(`Output peak V<sub>p</sub> = ${G} × ${Vi} = ${s3(Vp)} V.`, `Slew limit: ${SR}×10⁶ / (2π × ${s3(Vp)}) = ${s3(fs)} kHz. Bandwidth: ${GBW} MHz / ${G} = ${s3(fb)} kHz.`, `The answer is the smaller: <b>${s3(answer)} kHz</b> (${fs < fb ? 'slew rate' : 'bandwidth'} limited).`),
        SR, GBW, G, Vi,
      };
    },
    verify: (p) => Math.min(p.SR * 1e6 / (2 * Math.PI * p.G * p.Vi) / 1e3, p.GBW * 1e3 / p.G),
  },
  // ---- 7.7 Logic gates and Boolean algebra ----
  'twos-sum': {
    title: 'adding 8-bit two\'s complement numbers',
    make(r) {
      const a = int(r, -128, 127), b = int(r, -128, 127);
      const enc = (x) => ((x + 256) % 256).toString(2).padStart(8, '0');
      const s = (a + b + 512) % 256, answer = s >= 128 ? s - 256 : s;
      const over = a + b > 127 || a + b < -128;
      return {
        q: `<p>The 8-bit two's complement numbers ${enc(a)} and ${enc(b)} are added in an 8-bit adder and the carry out of the top bit is thrown away. What is the result, read as an 8-bit two's complement number, in decimal?</p>`,
        answer, unit: '', tol: 0, abs: 1e-9,
        hint: 'Turn each pattern into a signed number (a leading 1 means subtract 256), add them, and if the sum is outside −128 to 127, wrap it by 256.',
        solution: steps(`${enc(a)} is ${a} and ${enc(b)} is ${b}.`, `True sum: ${a + b}. ${over ? 'This is outside −128 to 127: OVERFLOW, so the 8 bits wrap round by 256.' : 'This is in range, so there is no overflow.'}`, `The adder shows ${enc(s)}, which reads as <b>${answer}</b>.`),
        a, b,
      };
    },
    verify: (p) => { const s = p.a + p.b; return ((s + 128) % 256 + 256) % 256 - 128; },
  },
  'minterm-count': {
    title: 'counting the minterms of a function',
    make(r) {
      const F = [
        ['AB + CD', (a, b, c, d) => (a && b) || (c && d)], ['A + BC', (a, b, c) => a || (b && c)], ['A ⊕ B ⊕ C', (a, b, c) => (a ^ b ^ c) === 1],
        ['(A + B)(C + D)', (a, b, c, d) => (a || b) && (c || d)], ['A·(not B) + C·(not D)', (a, b, c, d) => (a && !b) || (c && !d)], ['A + B + (not C)·D', (a, b, c, d) => a || b || (!c && d)],
      ];
      const k = int(r, 0, F.length - 1), [s, f] = F[k];
      let answer = 0; const rows = [];
      for (let m = 0; m < 16; m++) { if (f(m >> 3 & 1, m >> 2 & 1, m >> 1 & 1, m & 1)) { answer++; rows.push(m); } }
      return {
        q: `<p>Treat f = ${s} as a function of the four variables A, B, C, D (A is the most significant bit). How many rows of its 16-row truth table give f = 1?</p>`,
        answer, unit: '', tol: 0, abs: 1e-9,
        hint: 'A product term with j of the four variables is 1 in 2<sup>4−j</sup> rows. Add the terms, then subtract the rows counted twice (inclusion-exclusion).',
        solution: steps(`The rows with f = 1 are minterms ${rows.join(', ')}.`, `Count them: <b>${answer}</b>.`),
        k,
      };
    },
    // counted by hand with inclusion-exclusion: 4+4-1, 8+2, 8, 3x3, 4+4-1, 12+1
    verify: (p) => [7, 10, 8, 9, 7, 13][p.k],
  },
  // ---- 6.5 Nuclei, binding energy and radioactivity ----
  'binding-per-nucleon': {
    title: 'binding energy per nucleon from an atomic mass',
    make(r) {
      const L = [['²H', 1, 2, 2.014102], ['⁴He', 2, 4, 4.002603], ['⁷Li', 3, 7, 7.016003], ['¹²C', 6, 12, 12], ['¹⁶O', 8, 16, 15.994915], ['⁴⁰Ca', 20, 40, 39.962591], ['⁵⁶Fe', 26, 56, 55.934936], ['²⁰⁸Pb', 82, 208, 207.976652], ['²³⁸U', 92, 238, 238.050788]];
      const [s, Z, A, M] = L[int(r, 0, L.length - 1)];
      const dm = Z * 1.007825 + (A - Z) * 1.008665 - M, answer = dm * 931.494 / A;
      const s4 = (x) => +x.toPrecision(4);
      return {
        q: `<p>The atomic mass of ${s} (Z = ${Z}) is ${M} u. Using m(¹H) = 1.007825 u, m<sub>n</sub> = 1.008665 u and 1 u = 931.494 MeV/c², find its binding energy per nucleon, in MeV.</p>`,
        answer, unit: 'MeV', tol: 0.002,
        hint: 'Mass defect = Z × m(¹H) + (A − Z) × m<sub>n</sub> − M(atom). Hydrogen atoms (not bare protons) keep the electrons balanced. Multiply by 931.494 and divide by A.',
        solution: steps(`Δm = ${Z}(1.007825) + ${A - Z}(1.008665) − ${M} = ${dm.toFixed(6)} u.`, `B = ${dm.toFixed(6)} × 931.494 = ${s4(dm * 931.494)} MeV.`, `B/A = ${s4(dm * 931.494)} / ${A} = <b>${s4(answer)} MeV</b>.`),
        Z, A, M,
      };
    },
    verify: (p) => (p.Z * 1.007825 + (p.A - p.Z) * 1.008665 - p.M) * 931.494 / p.A,
  },
  'activity-left': {
    title: 'activity after a given time',
    make(r) {
      const A0 = int(r, 2, 50) * 100, T = [2, 6, 8, 12, 15, 24][int(r, 0, 5)], t = int(r, 1, 60);
      const answer = A0 * 2 ** (-t / T);
      const s3 = (x) => +x.toPrecision(3);
      return {
        q: `<p>A source has an activity of ${A0} Bq and a half-life of ${T} h. What is its activity ${t} h later, in Bq?</p>`,
        answer, unit: 'Bq', tol: 0.005,
        hint: 'A = A₀ × 2<sup>−t/T½</sup>. The number of half-lives need not be a whole number.',
        solution: steps(`t/T½ = ${t}/${T} = ${s3(t / T)} half-lives.`, `A = ${A0} × 2<sup>−${s3(t / T)}</sup> = ${A0} × ${(2 ** (-t / T)).toPrecision(4)}.`, `A = <b>${s3(answer)} Bq</b>.`),
        A0, T, t,
      };
    },
    verify: (p) => p.A0 * Math.exp(-Math.LN2 * p.t / p.T),
  },
  // ---- 7.1 Crystal structure ----
  'miller-spacing': {
    title: 'Miller indices and plane spacing',
    make(r) {
      const opts = [[1, 1, 0, '1', '1', '∞'], [1, 1, 1, '1', '1', '1'], [2, 1, 0, '1/2', '1', '∞'], [2, 2, 1, '1/2', '1/2', '1'], [3, 2, 0, '2', '3', '∞'], [1, 2, 3, '6', '3', '2'], [2, 0, 0, '1/2', '∞', '∞'], [3, 1, 1, '1', '3', '3']];
      const [h, k, l, p, q, s] = opts[int(r, 0, opts.length - 1)];
      const a = int(r, 28, 60) / 10, N = h * h + k * k + l * l, answer = a / Math.sqrt(N);
      return {
        q: `<p>A plane in a cubic crystal (lattice constant ${a} Å) cuts the axes at ${p}a, ${q}a and ${s}a (∞ means parallel). Find the spacing of this family of planes, in Å.</p>`,
        answer, unit: 'Å', tol: 0.005,
        hint: 'Take reciprocals of the intercepts and clear fractions to get (hkl). Then d = a/√(h² + k² + l²).',
        solution: steps(`Reciprocals of ${p}, ${q}, ${s} (with 1/∞ = 0), cleared of fractions: (${h}${k}${l}).`, `h² + k² + l² = ${N}.`, `d = ${a}/√${N} = <b>${answer.toFixed(3)} Å</b>.`),
        a, N,
      };
    },
    verify: (p) => p.a / Math.sqrt(p.N),
  },
  // ---- 7.2 X-ray diffraction ----
  'bragg-lattice': {
    title: 'lattice constant from a powder line',
    make(r) {
      const [name, list] = [['simple cubic', [[1, '100'], [2, '110'], [3, '111']]], ['bcc', [[2, '110'], [4, '200'], [6, '211']]], ['fcc', [[3, '111'], [4, '200'], [8, '220']]]][int(r, 0, 2)];
      const i = int(r, 0, 2), [N, idx] = list[i], lam = [1.54, 0.71, 1.79][int(r, 0, 2)];
      const a0 = int(r, 30, 55) / 10, th = Math.round(Math.asin(lam * Math.sqrt(N) / (2 * a0)) * 180 / Math.PI * 100) / 100;
      const answer = lam * Math.sqrt(N) / (2 * Math.sin(th * Math.PI / 180));
      const ord = ['first', 'second', 'third'][i];
      return {
        q: `<p>The ${ord} line in the powder pattern of a ${name} metal appears at a glancing angle θ = ${th}° with X-rays of wavelength ${lam} Å. Find the lattice constant in Å.</p>`,
        answer, unit: 'Å', tol: 0.005,
        hint: `List the allowed reflections of ${name} in order of h² + k² + l². Then use Bragg's law for d, and a = d√(h² + k² + l²).`,
        solution: steps(`The ${ord} allowed ${name} reflection is (${idx}), with h² + k² + l² = ${N}.`, `d = λ/(2 sin θ) = ${lam}/(2 × ${Math.sin(th * Math.PI / 180).toFixed(4)}) = ${(lam / (2 * Math.sin(th * Math.PI / 180))).toFixed(4)} Å.`, `a = d√${N} = <b>${answer.toFixed(3)} Å</b>.`),
        lam, N, th,
      };
    },
    verify: (p) => p.lam * Math.sqrt(p.N) / (2 * Math.sin(p.th * Math.PI / 180)),
  },
  // ---- 7.3 Semiconductors ----
  'fermi-shift': {
    title: 'where the Fermi level sits in doped silicon',
    make(r) {
      const m = int(r, 1, 9), e = int(r, 14, 18), N = m * 10 ** e, ni = 1e10, kT = 0.02585, n = r() < 0.5;
      const answer = kT * Math.log(N / ni);
      return {
        q: `<p>Silicon at 300 K (n<sub>i</sub> = 10¹⁰ cm⁻³, kT = 0.02585 eV) is doped with ${m}×10${'⁰¹²³⁴⁵⁶⁷⁸⁹'[Math.floor(e / 10)]}${'⁰¹²³⁴⁵⁶⁷⁸⁹'[e % 10]} ${n ? 'donors' : 'acceptors'} per cm³. How far ${n ? 'above' : 'below'} the intrinsic level E<sub>i</sub> is the Fermi level, in eV?</p>`,
        answer, unit: 'eV', tol: 0.005,
        hint: `The majority density equals the doping. Then use ${n ? 'n = n<sub>i</sub> e^((E<sub>F</sub> − E<sub>i</sub>)/kT)' : 'p = n<sub>i</sub> e^((E<sub>i</sub> − E<sub>F</sub>)/kT)'} and take the natural log.`,
        solution: steps(`Majority density ${n ? 'n' : 'p'} = ${m}×10^${e} cm⁻³; minority density = n<sub>i</sub>²/${n ? 'n' : 'p'} = ${(ni * ni / N).toPrecision(3)} cm⁻³.`, `|E<sub>F</sub> − E<sub>i</sub>| = kT ln(N/n<sub>i</sub>) = 0.02585 × ln(${(N / ni).toPrecision(3)}) = 0.02585 × ${Math.log(N / ni).toFixed(3)}.`, `= <b>${answer.toFixed(3)} eV</b> ${n ? 'above' : 'below'} E<sub>i</sub>.`),
        N, ni, kT,
      };
    },
    verify: (p) => p.kT * Math.log(p.N / p.ni),
  },
  // ---- 7.4 Diodes ----
  'zener-current': {
    title: 'current in a Zener regulator',
    make(r) {
      let Vin, Vz, R, RL, Iz;
      do {
        Vz = [3.3, 5.1, 6.2, 9.1, 12][int(r, 0, 4)]; Vin = Math.round((Vz + int(r, 4, 14)) * 10) / 10;
        R = [100, 150, 220, 330][int(r, 0, 3)]; RL = [470, 1000, 2200, 4700][int(r, 0, 3)];
        Iz = (Vin - Vz) / R - Vz / RL;
      } while (Iz < 0.002);
      const answer = Iz * 1000;
      return {
        q: `<p>A ${Vin} V supply feeds a ${Vz} V Zener diode through a ${R} Ω resistor, and a ${RL} Ω load is connected across the Zener. Find the current through the Zener, in mA.</p>`,
        answer, unit: 'mA', tol: 0.005,
        hint: 'The Zener holds the load at V<sub>Z</sub>. Find the series current from the voltage across R, then subtract the load current.',
        solution: steps(`Series current I<sub>S</sub> = (${Vin} − ${Vz})/${R} = ${((Vin - Vz) / R * 1000).toFixed(3)} mA.`, `Load current I<sub>L</sub> = ${Vz}/${RL} = ${(Vz / RL * 1000).toFixed(3)} mA.`, `I<sub>Z</sub> = I<sub>S</sub> − I<sub>L</sub> = <b>${answer.toFixed(2)} mA</b>.`),
        Vin, Vz, R, RL,
      };
    },
    verify: (p) => ((p.Vin - p.Vz) / p.R - p.Vz / p.RL) * 1000,
  },
  'rocket-delta-v': {
    title: 'speed gained by a rocket (Tsiolkovsky)',
    make(r) {
      const m0 = 100 * int(r, 5, 50), f = int(r, 30, 90) / 100, u = int(r, 15, 45) / 10;
      const fuel = Math.round(m0 * f), m = m0 - fuel, answer = u * Math.log(m0 / m);
      return {
        q: `<p>A probe of mass ${m0} kg, of which ${fuel} kg is fuel, fires its engine in deep space starting from rest. The exhaust leaves at ${u} km/s relative to the probe. Find its final speed in km/s.</p>`,
        answer, unit: 'km/s', tol: 0.01,
        hint: 'Δv = u ln(m₀/m), where m is the mass left when the fuel is gone (not the fuel mass). Use the natural log.',
        solution: steps(`Final mass m = ${m0} − ${fuel} = ${m} kg.`, `Mass ratio m₀/m = ${(m0 / m).toFixed(4)}.`, `Δv = ${u} × ln(${(m0 / m).toFixed(4)}) = ${u} × ${Math.log(m0 / m).toFixed(4)} = <b>${answer.toFixed(3)} km/s</b>.`),
        m0, fuel, u,
      };
    },
    verify: (p) => p.u * Math.log(p.m0 / (p.m0 - p.fuel)),
  },
  'chain-lift': {
    title: 'force to lift a chain from a heap',
    make(r) {
      const lam = int(r, 1, 8) / 2, v = int(r, 1, 8) / 2, y = int(r, 2, 12) / 4;
      const answer = lam * y * 9.8 + lam * v * v;
      return {
        q: `<p>A chain of ${lam} kg/m lies in a heap on the floor. One end is pulled straight up at a steady ${v} m/s. Find the pulling force, in N, when ${y} m of chain is off the floor (g = 9.8 m/s²).</p>`,
        answer, unit: 'N', tol: 0.01,
        hint: 'Two jobs: hold up the weight λyg of the lifted part, and give new links momentum at the rate d(λyv)/dt = λv².',
        solution: steps(`Weight of the lifted part: λyg = ${lam} × ${y} × 9.8 = ${(lam * y * 9.8).toFixed(3)} N.`, `Momentum per second given to new links: λv² = ${lam} × ${v}² = ${(lam * v * v).toFixed(3)} N.`, `Total F = <b>${answer.toFixed(3)} N</b>.`),
        lam, v, y,
      };
    },
    verify: (p) => p.lam * p.y * 9.8 + p.lam * p.v ** 2,
  },
  'rolling-incline-speed': {
    title: 'speed at the bottom of a slope when rolling',
    make(r) {
      const bodies = [['thin ring', 1, '1'], ['solid disc', 0.5, '1/2'], ['solid sphere', 0.4, '2/5'], ['hollow sphere', 2 / 3, '2/3']];
      const [name, k, kt] = bodies[int(r, 0, 3)], h = int(r, 2, 40) / 10;
      const answer = Math.sqrt(2 * 9.8 * h / (1 + k));
      return {
        q: `<p>A ${name} rolls without slipping, from rest, down a slope through a vertical drop of ${h} m. Find its speed at the bottom in m/s (g = 9.8 m/s²).</p>`,
        answer, unit: 'm/s', tol: 0.01,
        hint: `Energy: mgh = ½mv² + ½Iω² with ω = v/R and I = ${kt} mR² for this body. Static friction does no work.`,
        solution: steps(`mgh = ½mv²(1 + ${kt}).`, `v = √(2gh / (1 + ${kt})) = √(${(2 * 9.8 * h).toFixed(2)} / ${(1 + k).toFixed(4)}).`, `v = <b>${answer.toFixed(3)} m/s</b> (sliding without friction would give ${Math.sqrt(2 * 9.8 * h).toFixed(3)} m/s).`),
        h, k,
      };
    },
    verify: (p) => Math.sqrt(2 * 9.8 * p.h / (1 + p.k)),
  },
  'skid-to-roll': {
    title: 'a bowling ball stops skidding',
    make(r) {
      const v0 = int(r, 3, 12), mu = int(r, 5, 30) / 100;
      const answer = 2 * v0 / (7 * mu * 9.8);
      return {
        q: `<p>A bowling ball (uniform solid sphere) is released sliding at ${v0} m/s with no spin. The coefficient of kinetic friction with the lane is ${mu}. After how many seconds does it roll without slipping? (g = 9.8 m/s²)</p>`,
        answer, unit: 's', tol: 0.01,
        hint: 'Friction μmg slows the centre (v = v₀ − μgt) and spins the ball up (ωR = (5μg/2)t, using I = 2/5 mR²). Set v = ωR.',
        solution: steps(`v = ${v0} − ${(mu * 9.8).toFixed(3)} t and ωR = ${(2.5 * mu * 9.8).toFixed(3)} t.`, `Equal when ${v0} = ${(3.5 * mu * 9.8).toFixed(3)} t.`, `t = 2v₀/(7μg) = <b>${answer.toFixed(3)} s</b>; its speed is then 5v₀/7 = ${(5 * v0 / 7).toFixed(3)} m/s.`),
        v0, mu,
      };
    },
    verify: (p) => p.v0 / (3.5 * p.mu * 9.8),
  },
  'wire-extension': {
    title: 'stretch of a loaded wire',
    make(r) {
      const mats = [['steel', 200], ['copper', 120], ['brass', 100], ['aluminium', 70]];
      const [mat, Y] = mats[int(r, 0, 3)], L = int(r, 1, 8) / 2, d = int(r, 4, 20) / 10, m = int(r, 1, 20);
      const A = Math.PI * (d / 2 * 1e-3) ** 2, answer = m * 9.8 * L / (A * Y * 1e9) * 1000;
      return {
        q: `<p>A ${mat} wire (Y = ${Y} GPa), ${L} m long and ${d} mm in diameter, carries a ${m} kg mass. Find its extension in mm (g = 9.8 m/s²).</p>`,
        answer, unit: 'mm', tol: 0.01,
        hint: 'ΔL = FL/(AY) with A = πr², r = half the diameter, all in metres and newtons.',
        solution: steps(`F = ${m} × 9.8 = ${(m * 9.8).toFixed(2)} N.`, `A = π × (${(d / 2).toFixed(2)}×10⁻³)² = ${A.toExponential(4)} m².`, `ΔL = ${(m * 9.8).toFixed(2)} × ${L} / (${A.toExponential(4)} × ${Y}×10⁹) = <b>${answer.toFixed(4)} mm</b>.`),
        Y, L, d, m,
      };
    },
    verify: (p) => p.m * 9.8 * p.L / (Math.PI * (p.d / 2 * 1e-3) ** 2 * p.Y * 1e9) * 1000,
  },
  'moduli-relation': {
    title: 'shear and bulk moduli from Y and Poisson\'s ratio',
    make(r) {
      const Y = 10 * int(r, 5, 22), s = int(r, 20, 45) / 100, want = r() < 0.5 ? 'G' : 'K';
      const answer = want === 'G' ? Y / (2 * (1 + s)) : Y / (3 * (1 - 2 * s));
      return {
        q: `<p>A metal has Young's modulus ${Y} GPa and Poisson's ratio ${s}. Find its ${want === 'G' ? 'shear (rigidity)' : 'bulk'} modulus in GPa.</p>`,
        answer, unit: 'GPa', tol: 0.005,
        hint: 'Y = 2G(1 + σ) and Y = 3K(1 − 2σ).',
        solution: want === 'G' ? steps(`G = Y / (2(1 + σ)) = ${Y} / ${(2 * (1 + s)).toFixed(2)}.`, `G = <b>${answer.toFixed(2)} GPa</b>.`) : steps(`K = Y / (3(1 − 2σ)) = ${Y} / ${(3 * (1 - 2 * s)).toFixed(2)}.`, `K = <b>${answer.toFixed(2)} GPa</b>.`),
        Y, s, want,
      };
    },
    verify: (p) => (p.want === 'G' ? p.Y / (2 * (1 + p.s)) : p.Y / (3 * (1 - 2 * p.s))),
  },
  'capillary-height': {
    title: 'capillary rise in a glass tube',
    make(r) {
      const T = int(r, 20, 75) / 1000, rr = int(r, 1, 20) / 20, rho = [800, 1000, 1260][int(r, 0, 2)];
      const answer = 2 * T / (rho * 9.8 * rr * 1e-3) * 100;
      return {
        q: `<p>A liquid of density ${rho} kg/m³ and surface tension ${T} N/m wets glass completely (contact angle 0). How high, in cm, does it rise in a glass tube of radius ${rr} mm? (g = 9.8 m/s²)</p>`,
        answer, unit: 'cm', tol: 0.01,
        hint: 'Jurin\'s law: h = 2T cos θ / (ρgr). Put r in metres.',
        solution: steps(`h = 2 × ${T} / (${rho} × 9.8 × ${rr}×10⁻³).`, `h = ${(answer / 100).toFixed(5)} m = <b>${answer.toFixed(3)} cm</b>.`),
        T, rr, rho,
      };
    },
    verify: (p) => 2 * p.T / (p.rho * 9.8 * p.rr * 1e-3) * 100,
  },
  'stokes-terminal': {
    title: 'terminal speed of a falling ball (Stokes)',
    make(r) {
      const rr = int(r, 2, 20) / 10, rho = [2500, 7800, 11300][int(r, 0, 2)], eta = int(r, 2, 20) / 10;
      const sig = 1260, answer = 2 * (rr * 1e-3) ** 2 * (rho - sig) * 9.8 / (9 * eta) * 1000;
      return {
        q: `<p>A ball of radius ${rr} mm and density ${rho} kg/m³ is dropped into glycerine (density ${sig} kg/m³, viscosity ${eta} Pa s). Find its terminal speed in mm/s (g = 9.8 m/s²).</p>`,
        answer, unit: 'mm/s', tol: 0.01,
        hint: 'At terminal speed: weight − buoyancy = 6πηrv, so v = 2r²(ρ − σ)g / (9η).',
        solution: steps(`ρ − σ = ${rho - sig} kg/m³.`, `v = 2 × (${rr}×10⁻³)² × ${rho - sig} × 9.8 / (9 × ${eta}).`, `v = <b>${answer.toFixed(3)} mm/s</b>.`),
        rr, rho, eta,
      };
    },
    verify: (p) => 2 * (p.rr * 1e-3) ** 2 * (p.rho - 1260) * 9.8 / (9 * p.eta) * 1000,
  },
  'add-velocities': {
    title: 'relativistic velocity addition',
    make(r) {
      const v = int(r, 1, 18) / 20, u = int(r, 1, 18) / 20;
      const answer = (u + v) / (1 + u * v);
      return {
        q: `<p>A spaceship moves at ${v}c relative to a planet and fires a probe straight ahead at ${u}c relative to the ship. Find the probe's speed relative to the planet, in units of c.</p>`,
        answer, unit: 'c', tol: 0.002,
        hint: 'u = (u′ + v) / (1 + u′v/c²). The answer must stay below 1.',
        solution: steps(`Top: ${u} + ${v} = ${(u + v).toFixed(3)}.`, `Bottom: 1 + ${u} × ${v} = ${(1 + u * v).toFixed(4)}.`, `u = <b>${answer.toFixed(4)}c</b> (simply adding would give ${(u + v).toFixed(2)}c).`),
        u, v,
      };
    },
    verify: (p) => (p.u + p.v) / (1 + p.u * p.v),
  },
  'trip-proper-time': {
    title: 'crew time for a fast trip',
    make(r) {
      const d = int(r, 2, 40), b = int(r, 10, 99) / 100;
      const g = 1 / Math.sqrt(1 - b * b), answer = d / b / g;
      return {
        q: `<p>A ship travels at ${b}c to a star ${d} light-years away (distance in the Earth's frame). How many years does the trip take by the crew's own clocks?</p>`,
        answer, unit: 'years', tol: 0.005,
        hint: 'Earth time is distance ÷ speed. The crew\'s clocks run slow by γ = 1/√(1 − β²). (Or: in the crew\'s frame the distance is contracted by γ.)',
        solution: steps(`Earth time: ${d} / ${b} = ${(d / b).toFixed(3)} years.`, `γ = 1/√(1 − ${b}²) = ${g.toFixed(4)}.`, `Crew time = ${(d / b).toFixed(3)} / ${g.toFixed(4)} = <b>${answer.toFixed(3)} years</b>.`),
        d, b,
      };
    },
    verify: (p) => (p.d / p.b) * Math.sqrt(1 - p.b ** 2),
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
  // ---- 3.3 Superposition, Lissajous figures and coupled oscillators ----
  'shm-add': {
    title: 'amplitude of two added SHMs',
    make(r) {
      const A1 = int(r, 2, 9), A2 = int(r, 2, 9), ph = [30, 45, 60, 90, 120, 135, 150][int(r, 0, 6)];
      const answer = Math.sqrt(A1 * A1 + A2 * A2 + 2 * A1 * A2 * Math.cos(ph * Math.PI / 180));
      return {
        q: `<p>Two SHMs along the same line, x₁ = ${A1} sin ωt and x₂ = ${A2} sin(ωt + ${ph}°) (in cm), act on one particle. Find the amplitude of the resulting motion, in cm.</p>`,
        answer, unit: 'cm', tol: 0.005,
        hint: 'Draw each SHM as an arrow (phasor) of length A at its phase angle and add the arrows: A² = A₁² + A₂² + 2A₁A₂ cos φ.',
        solution: steps(`cos ${ph}° = ${(+Math.cos(ph * Math.PI / 180).toFixed(4))}.`, `A² = ${A1 * A1} + ${A2 * A2} + 2(${A1})(${A2})(${(+Math.cos(ph * Math.PI / 180).toFixed(4))}) = ${(answer * answer).toFixed(3)}.`, `A = <b>${answer.toFixed(3)} cm</b>.`),
        A1, A2, ph,
      };
    },
    verify: (p) => Math.hypot(p.A1 + p.A2 * Math.cos(p.ph * Math.PI / 180), p.A2 * Math.sin(p.ph * Math.PI / 180)),
  },
  'coupled-transfer': {
    title: 'energy transfer time for coupled pendulums',
    make(r) {
      const L = [0.5, 0.8, 1, 1.2, 1.5, 2][int(r, 0, 5)], km = [0.05, 0.1, 0.2, 0.3, 0.5][int(r, 0, 4)];
      const w1 = Math.sqrt(9.8 / L), w2 = Math.sqrt(9.8 / L + 2 * km), answer = Math.PI / (w2 - w1);
      return {
        q: `<p>Two identical pendulums of length ${L} m are joined at the bobs by a light spring with k/m = ${km} s⁻². One is pulled aside and released; the other starts at rest. How long (in s) until all the energy is in the second pendulum? Take g = 9.8 m/s².</p>`,
        answer, unit: 's', tol: 0.005,
        hint: 'Find the two normal-mode frequencies: ω₁ = √(g/L) (in step) and ω₂ = √(g/L + 2k/m) (opposite). The energy has crossed over when the beat envelope first reaches zero, at t = π/(ω₂ − ω₁).',
        solution: steps(`ω₁ = √(9.8/${L}) = ${w1.toFixed(4)} rad/s.`, `ω₂ = √(${(9.8 / L).toFixed(3)} + ${2 * km}) = ${w2.toFixed(4)} rad/s.`, `t = π/(ω₂ − ω₁) = π/${(w2 - w1).toFixed(5)} = <b>${answer.toFixed(1)} s</b>.`),
        L, km,
      };
    },
    verify: (p) => Math.PI / (Math.sqrt(9.8 / p.L + 2 * p.km) - Math.sqrt(9.8 / p.L)),
  },
  // ---- 3.4 Waves ----
  'string-harmonic': {
    title: 'frequency of a harmonic on a stretched string',
    make(r) {
      const L = int(r, 4, 20) / 10, T = int(r, 20, 300), mu = [0.001, 0.002, 0.005, 0.01, 0.02][int(r, 0, 4)], n = int(r, 1, 5);
      const v = Math.sqrt(T / mu), answer = n * v / (2 * L);
      return {
        q: `<p>A string ${L} m long is fixed at both ends, with tension ${T} N and mass per unit length ${mu} kg/m. Find the frequency of its harmonic number ${n}, in Hz.</p>`,
        answer, unit: 'Hz', tol: 0.005,
        hint: 'Wave speed v = √(T/μ). Harmonic n fits n half-wavelengths into the string: L = nλ/2, so f = nv/(2L).',
        solution: steps(`v = √(${T}/${mu}) = ${v.toFixed(2)} m/s.`, `λ = 2L/n = ${(2 * L / n).toFixed(3)} m.`, `f = v/λ = <b>${answer.toFixed(1)} Hz</b>.`),
        L, T, mu, n,
      };
    },
    verify: (p) => p.n * Math.sqrt(p.T / p.mu) / (2 * p.L),
  },
  'group-velocity': {
    title: 'group velocity from a dispersion relation',
    make(r) {
      const a = int(r, 1, 6), b = int(r, 1, 4), k = int(r, 1, 5);
      // omega = a k + b k^3
      const answer = a + 3 * b * k * k;
      return {
        q: `<p>Waves in a medium obey ω = ${a}k + ${b}k³ (consistent units). Find the group velocity at k = ${k}.</p>`,
        answer, unit: '', tol: 0, abs: 1e-9,
        hint: 'Group velocity is dω/dk, not ω/k (which is the phase velocity).',
        solution: steps(`dω/dk = ${a} + ${3 * b}k².`, `At k = ${k}: ${a} + ${3 * b}(${k * k}) = <b>${answer}</b>.`, `(The phase velocity is ω/k = ${a} + ${b}k² = ${a + b * k * k}.)`),
        a, b, k,
      };
    },
    verify: (p) => { const h = 1e-6, w = (k) => p.a * k + p.b * k ** 3; return (w(p.k + h) - w(p.k - h)) / (2 * h); },
  },
  // ---- 3.5 Sound and the Doppler effect ----
  'doppler-shift': {
    title: 'Doppler shift with a moving source and listener',
    make(r) {
      const f = [256, 300, 400, 500, 512, 600, 800][int(r, 0, 6)], us = int(r, 0, 40), uo = int(r, 0, 30), v = 340;
      const answer = f * (v + uo) / (v - us);
      return {
        q: `<p>A source of ${f} Hz moves at ${us} m/s towards a listener, who moves at ${uo} m/s towards the source, along one line in still air (speed of sound ${v} m/s). What frequency does the listener hear, in Hz?</p>`,
        answer, unit: 'Hz', tol: 0.002,
        hint: 'f′ = f (v + u<sub>o</sub>)/(v − u<sub>s</sub>) when they approach. The listener\'s speed goes on top, the source\'s underneath: they are not interchangeable.',
        solution: steps(`v + u<sub>o</sub> = ${v + uo} m/s and v − u<sub>s</sub> = ${v - us} m/s.`, `f′ = ${f} × ${v + uo}/${v - us} = <b>${answer.toFixed(1)} Hz</b>.`),
        f, us, uo, v,
      };
    },
    verify: (p) => p.f * (1 + p.uo / p.v) / (1 - p.us / p.v),
  },
  'pipe-resonance': {
    title: 'resonant frequency of an air column',
    make(r) {
      const L = int(r, 20, 150) / 100, closed = r() < 0.5, n = closed ? [1, 3, 5][int(r, 0, 2)] : int(r, 1, 4), v = 340;
      const answer = closed ? n * v / (4 * L) : n * v / (2 * L);
      return {
        q: `<p>A pipe ${L} m long is ${closed ? 'closed at one end' : 'open at both ends'}. Taking the speed of sound as ${v} m/s and ignoring end corrections, find the frequency of harmonic number ${n}, in Hz.</p>`,
        answer, unit: 'Hz', tol: 0.002,
        hint: closed ? 'A closed end is a displacement node and an open end an antinode, so the pipe holds an odd number of quarter wavelengths: f = nv/(4L) with n odd.' : 'Both ends are displacement antinodes, so the pipe holds a whole number of half wavelengths: f = nv/(2L).',
        solution: steps(closed ? `λ = 4L/n = ${(4 * L / n).toFixed(3)} m.` : `λ = 2L/n = ${(2 * L / n).toFixed(3)} m.`, `f = v/λ = <b>${answer.toFixed(1)} Hz</b>.`),
        L, closed, n, v,
      };
    },
    verify: (p) => p.v / ((p.closed ? 4 : 2) * p.L / p.n),
  },
  // ---- 3.6 Geometrical optics ----
  'thin-lens-image': {
    title: 'image distance for a thin lens',
    make(r) {
      const f = [10, 12, 15, 20, 25, 30, -10, -15, -20][int(r, 0, 8)], u0 = int(r, 5, 80), u = u0 === f ? u0 + 1 : u0;
      const answer = 1 / (1 / f - 1 / u); // Cartesian v with object at -u
      return {
        q: `<p>An object is ${u} cm in front of a thin ${f > 0 ? 'converging' : 'diverging'} lens of focal length ${Math.abs(f)} cm. Using the Cartesian convention (light travels in +x, distances from the lens), find the image distance v in cm (positive = real, behind the lens).</p>`,
        answer, unit: 'cm', tol: 0.002,
        hint: 'Use 1/v − 1/u = 1/f with u = −(object distance) and f negative for a diverging lens.',
        solution: steps(`u = −${u} cm, f = ${f} cm.`, `1/v = 1/f + 1/u = 1/${f} − 1/${u} = ${(1 / f - 1 / u).toFixed(5)}.`, `v = <b>${answer.toFixed(2)} cm</b> (${answer > 0 ? 'real, behind the lens' : 'virtual, on the object side'}); magnification v/u = ${(answer / -u).toFixed(3)}.`),
        f, u,
      };
    },
    verify: (p) => p.f * p.u / (p.u - p.f),
  },
  'two-lens-focal': {
    title: 'equivalent focal length of two separated lenses',
    make(r) {
      const f1 = [10, 15, 20, 25, 30, 40][int(r, 0, 5)], f2 = [10, 15, 20, 25, -10, -20][int(r, 0, 5)], d0 = int(r, 1, 15), d = f1 + f2 === d0 ? d0 + 1 : d0;
      const answer = f1 * f2 / (f1 + f2 - d);
      return {
        q: `<p>Thin lenses of focal lengths ${f1} cm and ${f2} cm are ${d} cm apart on one axis. Find the equivalent focal length of the pair, in cm (negative means diverging).</p>`,
        answer, unit: 'cm', tol: 0.002,
        hint: 'Powers add, with a correction for the gap: 1/F = 1/f₁ + 1/f₂ − d/(f₁f₂).',
        solution: steps(`1/F = 1/${f1} + 1/(${f2}) − ${d}/(${f1}×${f2}) = ${(1 / f1 + 1 / f2 - d / (f1 * f2)).toFixed(5)} cm⁻¹.`, `F = f₁f₂/(f₁ + f₂ − d) = ${f1 * f2}/${f1 + f2 - d} = <b>${answer.toFixed(2)} cm</b>.`),
        f1, f2, d,
      };
    },
    verify: (p) => 1 / (1 / p.f1 + 1 / p.f2 - p.d / (p.f1 * p.f2)),
  },
  // ---- 3.9 Polarisation ----
  'malus-chain': {
    title: 'intensity through three polarisers',
    make(r) {
      const I0 = int(r, 10, 100), a = int(r, 10, 80), b = a + int(r, 10, 80);
      const answer = I0 / 2 * Math.cos(a * Math.PI / 180) ** 2 * Math.cos((b - a) * Math.PI / 180) ** 2;
      return {
        q: `<p>Unpolarised light of intensity ${I0} W/m² passes through three ideal polarisers in turn, with axes at 0°, ${a}° and ${b}°. Find the emerging intensity in W/m².</p>`,
        answer, unit: 'W/m²', tol: 0.005,
        hint: 'The first polariser halves unpolarised light. After that, each polariser multiplies by cos² of the angle between it and the one before (not the angle from the first).',
        solution: steps(`After the first: ${I0}/2 = ${I0 / 2}.`, `After the second: × cos²${a}° = ${(I0 / 2 * Math.cos(a * Math.PI / 180) ** 2).toFixed(3)}.`, `After the third: × cos²${b - a}° = <b>${answer.toFixed(3)} W/m²</b>.`),
        I0, a, b,
      };
    },
    verify: (p) => p.I0 / 8 * (1 + Math.cos(2 * p.a * Math.PI / 180)) * (1 + Math.cos(2 * (p.b - p.a) * Math.PI / 180)),
  },
  'brewster-angle': {
    title: 'Brewster angle and the refracted ray',
    make(r) {
      const n1 = [1, 1, 1.33][int(r, 0, 2)], n2 = [1.45, 1.5, 1.6, 1.7, 2.0, 2.42][int(r, 0, 5)];
      const answer = Math.atan(n2 / n1) * 180 / Math.PI;
      return {
        q: `<p>Light travelling in a medium of index ${n1} reflects from a flat surface of a medium of index ${n2}. At what angle of incidence (in degrees) is the reflected light completely polarised?</p>`,
        answer, unit: '°', tol: 0.002,
        hint: 'Brewster: tan θ<sub>B</sub> = n₂/n₁. At this angle the reflected and refracted rays are at 90° to each other.',
        solution: steps(`tan θ<sub>B</sub> = ${n2}/${n1} = ${(n2 / n1).toFixed(4)}.`, `θ<sub>B</sub> = <b>${answer.toFixed(2)}°</b>; the refracted ray is at 90° − θ<sub>B</sub> = ${(90 - answer).toFixed(2)}°.`),
        n1, n2,
      };
    },
    verify: (p) => 90 - Math.atan(p.n1 / p.n2) * 180 / Math.PI,
  },
  // ---- 4.3 Conductors and images ----
  'image-force': {
    title: 'force from an image charge',
    make(r) {
      const q = int(r, 1, 9), d = int(r, 2, 20), k = 8.988e9;
      const answer = k * (q * 1e-9) ** 2 / (2 * d / 100) ** 2 * 1e6;
      return {
        q: `<p>A charge of ${q} nC is held ${d} cm above a very large grounded metal plate. Find the force on it, in μN.</p>`,
        answer, unit: 'μN', tol: 0.01,
        hint: 'Replace the plate by an image charge −q at the same distance below the surface. The force is the Coulomb pull between q and its image.',
        solution: steps(`Image: −${q} nC, ${d} cm below the plate; separation 2d = ${(2 * d / 100).toFixed(2)} m.`, `F = kq²/(2d)² = (8.99×10⁹)(${q}×10⁻⁹)²/(${(2 * d / 100).toFixed(2)})².`, `= <b>${answer.toPrecision(3)} μN</b>, towards the plate.`),
        qq: q, d,
      };
    },
    verify: (p) => 8.988e9 * (p.qq * 1e-9) ** 2 / (2 * p.d / 100) ** 2 * 1e6,
  },
  // ---- 4.4 Dielectrics and capacitors ----
  'slab-capacitance': {
    title: 'capacitor with a dielectric slab',
    make(r) {
      const d = int(r, 3, 10), t = int(r, 1, d - 1), k = [2, 3, 4, 5, 6][int(r, 0, 4)], A = int(r, 1, 10);
      const answer = 8.854e-12 * A * 1e-2 / ((d - t + t / k) * 1e-3) * 1e12;
      return {
        q: `<p>Plates of area ${A}×10⁻² m² are ${d} mm apart. A slab ${t} mm thick, of dielectric constant ${k}, lies flat in the gap. Find the capacitance in pF.</p>`,
        answer, unit: 'pF', tol: 0.01,
        hint: 'The slab and the remaining air gap are two capacitors in series. Equivalently, the slab counts as if its thickness were divided by κ.',
        solution: steps(`Effective gap = (d − t) + t/κ = ${d - t} + ${(t / k).toFixed(3)} = ${(d - t + t / k).toFixed(3)} mm.`, `C = ε₀A / (effective gap) = (8.854×10⁻¹²)(${A}×10⁻²)/(${(d - t + t / k).toFixed(3)}×10⁻³).`, `= <b>${answer.toPrecision(3)} pF</b>.`),
        A, d, t, k,
      };
    },
    verify: (p) => 8.854e-12 * p.A * 1e-2 / ((p.d - p.t + p.t / p.k) * 1e-3) * 1e12,
  },
  // ---- 4.6 Magnetic materials ----
  'gap-electromagnet': {
    title: 'field in an electromagnet gap',
    make(r) {
      const mur = [500, 1000, 2000, 5000][int(r, 0, 3)], l = int(r, 2, 10) / 10, g = int(r, 1, 6) / 2, N = int(r, 1, 10) * 100, I = int(r, 1, 6) / 2;
      const mu0 = 1.25663706e-6, answer = mu0 * N * I / (l / mur + g / 1000);
      return {
        q: `<p>An iron core (μ<sub>r</sub> = ${mur}) has a mean path of ${l} m and an air gap of ${g} mm. A ${N}-turn coil carries ${I} A. Ignoring fringing, find B in the gap, in tesla.</p>`,
        answer, unit: 'T', tol: 0.01,
        hint: 'Use Ampère\'s law for H round the core: H<sub>iron</sub> l + H<sub>gap</sub> g = NI, with the same B in iron and gap (B = μ₀μ<sub>r</sub>H in iron, μ₀H in the gap).',
        solution: steps(`(B/μ₀)(l/μ<sub>r</sub> + g) = NI = ${N * I} A-turns.`, `l/μ<sub>r</sub> = ${(l / mur).toExponential(3)} m, g = ${g / 1000} m: the gap dominates.`, `B = μ₀NI/(l/μ<sub>r</sub> + g) = <b>${answer.toPrecision(3)} T</b>.`),
        mur, l, g, N, I,
      };
    },
    verify: (p) => 1.25663706e-6 * p.N * p.I / (p.l / p.mur + p.g / 1000),
  },
  // ---- 4.8 DC transients and AC circuits ----
  'rc-charge-time': {
    title: 'time for a capacitor to charge',
    make(r) {
      const R = [1, 2.2, 4.7, 10, 22, 47][int(r, 0, 5)], Cu = [1, 2.2, 4.7, 10, 22, 47, 100][int(r, 0, 6)], pct = [50, 63, 75, 90, 95, 99][int(r, 0, 5)];
      const tau = R * Cu, answer = -tau * Math.log(1 - pct / 100); // ms
      return {
        q: `<p>A ${Cu} μF capacitor charges from zero through a ${R} kΩ resistor from a battery. How long, in ms, until its voltage reaches ${pct}% of the battery voltage?</p>`,
        answer, unit: 'ms', tol: 0.01,
        hint: 'V = V₀(1 − e<sup>−t/τ</sup>) with τ = RC. Set V/V₀ to the fraction and solve for t with a natural log.',
        solution: steps(`τ = RC = ${R} kΩ × ${Cu} μF = ${tau.toPrecision(4)} ms.`, `1 − e<sup>−t/τ</sup> = ${pct / 100} ⇒ t = τ ln(1/(1 − ${pct / 100})) = ${tau.toPrecision(4)} × ${(-Math.log(1 - pct / 100)).toFixed(4)}.`, `t = <b>${answer.toPrecision(3)} ms</b>.`),
        tau, pct,
      };
    },
    verify: (p) => -p.tau * Math.log(1 - p.pct / 100),
  },
  'lcr-current': {
    title: 'current in a series LCR circuit',
    make(r) {
      const R = int(r, 1, 10) * 10, L = [0.05, 0.1, 0.2, 0.5][int(r, 0, 3)], Cu = [10, 22, 47, 100][int(r, 0, 3)], f = [50, 60, 100, 200][int(r, 0, 3)], V = [100, 110, 200, 230][int(r, 0, 3)];
      const w = 2 * Math.PI * f, XL = w * L, XC = 1 / (w * Cu * 1e-6), Z = Math.hypot(R, XL - XC), answer = V / Z;
      return {
        q: `<p>A ${R} Ω resistor, a ${L} H inductor and a ${Cu} μF capacitor are in series across a ${V} V rms, ${f} Hz supply. Find the rms current, in A.</p>`,
        answer, unit: 'A', tol: 0.01,
        hint: 'Find X<sub>L</sub> = ωL and X<sub>C</sub> = 1/(ωC) with ω = 2πf, then Z = √(R² + (X<sub>L</sub> − X<sub>C</sub>)²) and I = V/Z.',
        solution: steps(`ω = 2π(${f}) = ${w.toFixed(1)} rad/s; X<sub>L</sub> = ${XL.toFixed(2)} Ω, X<sub>C</sub> = ${XC.toFixed(2)} Ω.`, `Z = √(${R}² + (${(XL - XC).toFixed(2)})²) = ${Z.toFixed(2)} Ω.`, `I = ${V}/${Z.toFixed(2)} = <b>${answer.toPrecision(3)} A</b>, ${XL > XC ? 'lagging' : 'leading'} the voltage by ${(Math.abs(Math.atan((XL - XC) / R)) * 180 / Math.PI).toFixed(1)}°.`),
        R, L, Cu, f, V,
      };
    },
    verify: (p) => { const w = 2 * Math.PI * p.f; return p.V / Math.hypot(p.R, w * p.L - 1 / (w * p.Cu * 1e-6)); },
  },
  // ---- 4.9 Maxwell's equations and EM waves ----
  'laser-field': {
    title: 'electric field in a laser beam',
    make(r) {
      const P = [0.5, 1, 2, 5, 10, 100][int(r, 0, 5)], d = [0.5, 1, 1.5, 2, 3][int(r, 0, 4)];
      const c = 2.99792458e8, e0 = 8.8541878128e-12, I = P * 1e-3 / (Math.PI * (d / 2e3) ** 2), answer = Math.sqrt(2 * I / (c * e0));
      return {
        q: `<p>A ${P} mW laser beam has a uniform circular cross-section ${d} mm across. Find the amplitude of its electric field, in V/m.</p>`,
        answer, unit: 'V/m', tol: 0.01,
        hint: 'Intensity I = P/(πr²) with r half the diameter. Then I = ½cε₀E₀², so E₀ = √(2I/(cε₀)).',
        solution: steps(`I = ${P}×10⁻³ / (π × (${d / 2}×10⁻³)²) = ${I.toPrecision(4)} W/m².`, `E₀ = √(2I/(cε₀)) = √(${(2 * I).toPrecision(4)} / ${(c * e0).toExponential(4)}).`, `E₀ = <b>${answer.toPrecision(3)} V/m</b>; B₀ = E₀/c = ${(answer / c * 1e6).toPrecision(3)} μT.`),
        I,
      };
    },
    verify: (p) => Math.sqrt(2 * p.I / (2.99792458e8 * 8.8541878128e-12)),
  },
  // ---- 5.5 phase changes, 5.6 blackbody radiation, 6.6 nuclear reactions, 8.1 exam pattern, 8.2 tricks ----
  'boiling-pressure': {
    title: 'boiling point at a different pressure',
    make(r) {
      const P = [0.3, 0.5, 0.6, 0.7, 0.8, 1.5, 2, 2.5, 3][int(r, 0, 8)], L = int(r, 30, 45), Tb = int(r, 320, 390);
      const inv = 1 / Tb - (8.314 / (L * 1000)) * Math.log(P), answer = 1 / inv;
      return {
        q: `<p>A liquid boils at ${Tb} K under 1 atm; its molar latent heat of vaporisation is ${L} kJ/mol. Treat the vapour as an ideal gas, neglect the liquid's volume and take L as constant. At what temperature does it boil under ${P} atm? (R = 8.314 J mol⁻¹ K⁻¹)</p>`,
        answer, unit: 'K', tol: 0.002,
        hint: 'Integrated Clausius–Clapeyron: ln(P₂/P₁) = −(L/R)(1/T₂ − 1/T₁). Solve for 1/T₂.',
        solution: steps(`ln(${P}/1) = ${Math.log(P).toFixed(4)}.`, `1/T₂ = 1/${Tb} − (8.314/${L * 1000}) × ${Math.log(P).toFixed(4)} = ${inv.toExponential(5)} K⁻¹.`, `T₂ = <b>${answer.toFixed(1)} K</b> (${P < 1 ? 'lower pressure, lower boiling point' : 'higher pressure, higher boiling point'}).`),
        P, L, Tb,
      };
    },
    verify: (p) => { const a = p.L * 1000 / 8.314; return a / (a / p.Tb - Math.log(p.P)); },
  },
  'ice-melt-pressure': {
    title: 'melting point of ice under a skate',
    make(r) {
      const m = int(r, 40, 100), A = int(r, 5, 40);   // kg, mm²
      const P = m * 9.8 / (A * 1e-6), dv = 1 / 1000 - 1 / 917, answer = Math.abs(273.15 * dv * P / 3.34e5);
      return {
        q: `<p>A ${m} kg skater stands on one blade touching the ice over ${A} mm². How far does the melting point of the ice under the blade drop? Use g = 9.8 m/s², L = 3.34 × 10⁵ J/kg, T = 273.15 K and densities 917 kg/m³ (ice) and 1000 kg/m³ (water).</p>`,
        answer, unit: 'K', tol: 0.01,
        hint: 'Find the pressure mg/A, then use ΔT = TΔv ΔP / L with Δv = 1/ρ<sub>water</sub> − 1/ρ<sub>ice</sub> per kilogram.',
        solution: steps(`Pressure: ${m} × 9.8 / (${A} × 10⁻⁶) = ${(P / 1e6).toFixed(2)} MPa.`, `Δv = 1/1000 − 1/917 = −9.05 × 10⁻⁵ m³/kg (water is denser, so melting shrinks the volume).`, `ΔT = 273.15 × (−9.05 × 10⁻⁵) × ${P.toExponential(3)} / 3.34 × 10⁵ = −${answer.toFixed(2)} K.`, `The melting point drops by <b>${answer.toFixed(2)} K</b>, ${answer < 15 ? 'not enough on its own to explain skating at −20 °C' : 'a big shift because the area is so small'}.`),
        m, A,
      };
    },
    verify: (p) => 273.15 * (1 / 917 - 1 / 1000) * (p.m * 9.8 / (p.A * 1e-6)) / 3.34e5,
  },
  'wien-star': {
    title: 'a star\'s temperature and power from its colour',
    make(r) {
      const lam = int(r, 12, 120) * 10;   // nm
      const T = 2.898e-3 / (lam * 1e-9), answer = 5.67e-8 * T ** 4 / 1e6;
      return {
        q: `<p>A star's spectrum peaks (per unit wavelength) at ${lam} nm. Treating it as a blackbody, find the power radiated by each square metre of its surface, in MW/m². (b = 2.898 × 10⁻³ m K, σ = 5.67 × 10⁻⁸ W m⁻² K⁻⁴)</p>`,
        answer, unit: 'MW/m²', tol: 0.005,
        hint: 'Wien first: T = b/λ<sub>max</sub>. Then Stefan–Boltzmann: σT⁴.',
        solution: steps(`T = 2.898 × 10⁻³ / (${lam} × 10⁻⁹) = ${T.toFixed(0)} K.`, `σT⁴ = 5.67 × 10⁻⁸ × ${T.toFixed(0)}⁴ = ${(answer * 1e6).toExponential(3)} W/m².`, `That is <b>${answer.toPrecision(3)} MW/m²</b> (the Sun: 63 MW/m²).`),
        lam,
      };
    },
    verify: (p) => 5.67e-8 * (2.898e-3 / (p.lam * 1e-9)) ** 4 / 1e6,
  },
  'star-luminosity': {
    title: 'luminosity from radius and temperature',
    make(r) {
      const R = [0.1, 0.3, 0.5, 0.8, 1.5, 2, 3, 5, 10, 50][int(r, 0, 9)], T = int(r, 30, 250) * 100;
      const answer = R * R * (T / 5772) ** 4;
      return {
        q: `<p>A star has ${R} times the Sun's radius and a surface temperature of ${T} K. Taking the Sun as a 5772 K blackbody, how many times the Sun's luminosity does it give out?</p>`,
        answer, unit: 'L☉', tol: 0.005,
        hint: 'L = 4πR²σT⁴, so in solar units L/L☉ = (R/R☉)² (T/T☉)⁴. The constants cancel.',
        solution: steps(`(R/R☉)² = ${R}² = ${(R * R).toFixed(3)}.`, `(T/T☉)⁴ = (${T}/5772)⁴ = ${((T / 5772) ** 4).toPrecision(4)}.`, `L/L☉ = <b>${answer.toPrecision(3)}</b>.`),
        R, T,
      };
    },
    verify: (p) => p.R ** 2 * (p.T / 5772) ** 4,
  },
  'reaction-q': {
    title: 'Q-value of a nuclear reaction',
    make(r) {
      const MS = { n: 1.008665, '¹H': 1.007825, '²H': 2.014102, '³H': 3.016049, '³He': 3.016029, '⁴He': 4.002603, '⁶Li': 6.015123, '⁷Li': 7.016003, '⁷Be': 7.016929, '⁹Be': 9.012183, '¹⁰B': 10.012937, '¹²C': 12, '¹⁴N': 14.003074, '¹⁷O': 16.999132 };
      const RX = [[['²H', '³H'], ['⁴He', 'n']], [['²H', '²H'], ['³He', 'n']], [['²H', '²H'], ['³H', '¹H']], [['¹H', '⁷Li'], ['⁴He', '⁴He']], [['⁶Li', 'n'], ['³H', '⁴He']], [['¹⁰B', 'n'], ['⁷Li', '⁴He']], [['⁹Be', '⁴He'], ['¹²C', 'n']], [['⁴He', '¹⁴N'], ['¹⁷O', '¹H']], [['¹H', '⁷Li'], ['⁷Be', 'n']]];
      const i = int(r, 0, RX.length - 1), [a, b] = RX[i];
      const mi = a.reduce((s, k) => s + MS[k], 0), mf = b.reduce((s, k) => s + MS[k], 0), answer = (mi - mf) * 931.5;
      const list = [...new Set([...a, ...b])].map((k) => `${k} ${MS[k].toFixed(6)} u`).join(', ');
      return {
        q: `<p>Find the Q-value of ${a.join(' + ')} → ${b.join(' + ')}, with its sign. Atomic masses: ${list}. Take 1 u = 931.5 MeV/c².</p>`,
        answer, unit: 'MeV', tol: 0.003, abs: 0.005,
        hint: 'Q = (total mass before − total mass after) × 931.5 MeV/u. Atomic masses are fine because the electrons balance.',
        solution: steps(`Before: ${mi.toFixed(6)} u. After: ${mf.toFixed(6)} u.`, `Δm = ${(mi - mf).toFixed(6)} u.`, `Q = Δm × 931.5 = <b>${answer.toFixed(2)} MeV</b>: ${answer > 0 ? 'exothermic, energy is released' : 'endothermic, the projectile must bring energy (above the threshold)'}.`),
        i, mi, mf,
      };
    },
    verify: (p) => (p.mi - p.mf) * 931.5,
  },
  'fission-fuel': {
    title: 'uranium burned by a reactor',
    make(r) {
      const P = [50, 100, 300, 500, 1000, 2000, 3000][int(r, 0, 6)], days = [1, 10, 30, 100, 365][int(r, 0, 4)];
      const N = P * 1e6 * days * 86400 / (200 * 1.602e-13), answer = N / 6.022e23 * 0.235;
      return {
        q: `<p>A reactor produces ${P} MW of heat for ${days} day${days > 1 ? 's' : ''}. Each uranium-235 fission gives 200 MeV (1 MeV = 1.602 × 10⁻¹³ J). What mass of uranium-235 is fissioned? (N<sub>A</sub> = 6.022 × 10²³ mol⁻¹)</p>`,
        answer, unit: 'kg', tol: 0.005,
        hint: 'Total energy = power × time. Divide by the energy per fission to count fissions, then convert to moles and kilograms.',
        solution: steps(`Energy: ${P} × 10⁶ W × ${days * 86400} s = ${(P * 1e6 * days * 86400).toExponential(3)} J.`, `Fissions: ÷ 3.204 × 10⁻¹¹ J = ${N.toExponential(3)}.`, `Moles: ÷ 6.022 × 10²³ = ${(N / 6.022e23).toPrecision(4)}; mass × 0.235 kg/mol = <b>${answer.toPrecision(3)} kg</b>.`),
        P, days,
      };
    },
    verify: (p) => p.P * 1e6 * p.days * 86400 / (200 * 1.602e-13) / 6.022e23 * 0.235,
  },
  'guess-expected': {
    title: 'expected marks from guessing under negative marking',
    make(r) {
      const n = int(r, 3, 15), e = int(r, 1, 2), m = int(r, 1, 2);
      const p = 1 / (4 - e), answer = n * (p * m - (1 - p) * m / 3);
      return {
        q: `<p>In JAM Section A a wrong ${m}-mark MCQ costs ${m === 1 ? '1/3' : '2/3'} mark. On ${n} such questions you can rule out ${e} of the four options with certainty, then guess at random among the rest. What is your expected total from these questions?</p>`,
        answer, unit: 'marks', tol: 0.005,
        hint: 'Chance of being right p = 1/(options left). Expected marks per question = p × m − (1 − p) × m/3. Multiply by the number of questions.',
        solution: steps(`Options left: ${4 - e}, so p = 1/${4 - e} = ${p.toFixed(3)}.`, `Per question: ${p.toFixed(3)} × ${m} − ${(1 - p).toFixed(3)} × ${m}/3 = ${(p * m - (1 - p) * m / 3).toFixed(3)} marks.`, `Over ${n} questions: <b>${answer.toFixed(2)} marks</b>. A blind guess (nothing ruled out) is worth exactly 0 on average.`),
        n, e, m,
      };
    },
    verify: (p) => { const q = 1 / (4 - p.e); return p.n * p.m * (q - (1 - q) / 3); },
  },
  'dimension-exponent': {
    title: 'find a power by dimensions',
    make(r) {
      const S = [
        ['The period T of small oscillations of a liquid drop held together by surface tension depends only on its density ρ, radius r and surface tension σ (units N/m). If T ∝ ρ<sup>a</sup> r<sup>b</sup> σ<sup>c</sup>, find b.', 1.5, 'σ has dimensions M T⁻². Matching M: a + c = 0. L: −3a + b = 0. T: −2c = 1, so c = −1/2, a = 1/2, b = 3a = <b>3/2</b>. So T ∝ √(ρr³/σ).'],
        ['The speed v of deep-water waves depends only on g and the wavelength λ. If v ∝ g<sup>a</sup> λ<sup>b</sup>, find b.', 0.5, 'L T⁻¹ = (L T⁻²)<sup>a</sup> L<sup>b</sup>. Time: −1 = −2a, so a = 1/2. Length: 1 = a + b, so b = <b>1/2</b>. So v ∝ √(gλ).'],
        ['The radius R of the fireball of a strong explosion releasing energy E into air of density ρ grows with time t as R ∝ E<sup>a</sup> t<sup>b</sup> ρ<sup>c</sup>. Find b.', 0.4, 'L = (M L² T⁻²)<sup>a</sup> T<sup>b</sup> (M L⁻³)<sup>c</sup>. M: a + c = 0. T: −2a + b = 0. L: 2a − 3c = 1, so 5a = 1, a = 1/5, b = <b>2/5</b>. (G. I. Taylor\'s famous estimate.)'],
        ['The energy density u of blackbody radiation depends only on kT, h and c. If u ∝ (kT)<sup>a</sup> h<sup>b</sup> c<sup>d</sup>, find a.', 4, 'u is energy per volume, E L⁻³; h is E T and c is L T⁻¹. Time appears only in h and c, so b = d and they enter as (hc)<sup>b</sup>, with hc = E L. Length: −3 = b, so b = −3. Energy: 1 = a + b, so a = <b>4</b>: u ∝ (kT)⁴/(hc)³, the T⁴ law.'],
        ['The frequency f of a stretched string depends on its tension F, length L and mass per unit length μ. If f ∝ F<sup>a</sup> L<sup>b</sup> μ<sup>c</sup>, find b.', -1, 'T⁻¹ = (M L T⁻²)<sup>a</sup> L<sup>b</sup> (M L⁻¹)<sup>c</sup>. T: a = 1/2. M: a + c = 0, c = −1/2. L: a + b − c = 0, b = −1/2 − 1/2 = <b>−1</b>. So f ∝ √(F/μ)/L.'],
      ];
      const i = int(r, 0, S.length - 1), [q, answer, sol] = S[i];
      return { q: `<p>${q}</p>`, answer, unit: '', tol: 0.001, hint: 'Write every quantity in powers of M, L and T, then match the powers of each on both sides: three equations for three unknowns.', solution: `<p>${sol}</p>`, i };
    },
    verify: (p) => [1.5, 0.5, 0.4, 4, -1][p.i],
  },
};

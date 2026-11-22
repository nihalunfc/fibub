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
};

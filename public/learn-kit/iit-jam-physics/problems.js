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
};

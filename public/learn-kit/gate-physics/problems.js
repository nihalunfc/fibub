// Live problems for GATE Physics lessons (lesson kit). Each make(rand) returns { q, answer, unit, tol (relative),
// abs?, hint, solution } as HTML; verify(p) works the answer out another way for tests/exam-physics.mjs.
// Placed in a lesson as <div class="problem" data-problem="id"></div>. Exam-style practice uses the question bank instead.
const int = (r, a, b) => a + Math.floor(r() * (b - a + 1));
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';

export default {
  // ---- Module 2: classical mechanics ----
  'hoop-equilibrium': {
    title: 'bead on a spinning hoop',
    make(r) {
      const R = [0.1, 0.15, 0.2, 0.25, 0.3][int(r, 0, 4)], w = int(r, 9, 16);
      const c = 9.8 / (w * w * R), answer = c < 1 ? Math.acos(c) * 180 / Math.PI : 0;
      return {
        q: `<p>A smooth vertical hoop of radius ${R} m spins at ${w} rad/s about its vertical diameter. A bead slides on it. At what angle from the bottom (in degrees) does the bead stay at rest relative to the hoop? (Enter 0 if only the bottom is possible; g = 9.8 m/s².)</p>`,
        answer, unit: '°', tol: 0.005, abs: 0.2,
        hint: 'Write L = ½mR²(θ̇² + ω²sin²θ) + mgR cos θ and look for θ with θ̈ = 0. Compare ω² with g/R.',
        solution: steps(`Euler-Lagrange: θ̈ = sin θ (ω² cos θ − g/R).`, `g/R = ${(9.8 / R).toFixed(2)} s⁻² and ω² = ${w * w} s⁻².`, c < 1 ? `Since ω² > g/R, cos θ₀ = g/(ω²R) = ${c.toFixed(4)}, so θ₀ = <b>${answer.toFixed(2)}°</b>.` : `Since ω² ≤ g/R, the bottom is the only equilibrium: <b>0</b>.`),
        R, w,
      };
    },
    verify: (p) => { const c = 9.8 / (p.w * p.w * p.R); return c < 1 ? Math.acos(c) * 180 / Math.PI : 0; },
  },
  'atwood-lagrange': {
    title: 'Atwood machine with a heavy pulley',
    make(r) {
      const m1 = int(r, 3, 9), m2 = int(r, 1, m1 - 1), Ir = int(r, 0, 6);
      const answer = (m1 - m2) * 9.8 / (m1 + m2 + Ir);
      return {
        q: `<p>Masses of ${m1} kg and ${m2} kg hang over a pulley whose moment of inertia is I = ${Ir} kg × R² (the string does not slip). Use the Lagrangian to find the acceleration of the masses in m/s² (g = 9.8 m/s²).</p>`,
        answer, unit: 'm/s²', tol: 0.005,
        hint: 'One coordinate x is enough. The pulley turns through x/R, so its kinetic energy is ½(I/R²)ẋ².',
        solution: steps(`T = ½(${m1} + ${m2} + ${Ir})ẋ², V = −(${m1} − ${m2})gx.`, `Euler-Lagrange: ${m1 + m2 + Ir} ẍ = ${m1 - m2} × 9.8.`, `ẍ = <b>${answer.toFixed(3)}</b> m/s².`),
        m1, m2, Ir,
      };
    },
    verify: (p) => (p.m1 - p.m2) * 9.8 / (p.m1 + p.m2 + p.Ir),
  },
  'adiabatic-oscillator': {
    title: 'slowly stiffened oscillator',
    make(r) {
      const w1 = int(r, 1, 5), f = [2, 3, 4, 9][int(r, 0, 3)], A1 = int(r, 2, 10);
      const answer = A1 / Math.sqrt(f);
      return {
        q: `<p>An oscillator swings with amplitude ${A1} cm at ${w1} rad/s. Its spring is stiffened very slowly until the angular frequency is ${w1 * f} rad/s. Find the new amplitude in cm.</p>`,
        answer, unit: 'cm', tol: 0.005,
        hint: 'For slow changes the action ∮p dx = 2πE/ω stays fixed. Write E = ½mω²A².',
        solution: steps('E/ω is an adiabatic invariant, so ½mω²A²/ω = ½mωA² is constant.', `A ∝ ω<sup>−1/2</sup>: A = ${A1}/√${f} = <b>${answer.toFixed(3)}</b> cm.`, `The energy grows by a factor ${f} even though the amplitude falls.`),
        A1, f,
      };
    },
    verify: (p) => p.A1 / Math.sqrt(p.f),
  },
  'pb-monomial': {
    title: 'Poisson bracket of two monomials',
    make(r) {
      const a = int(r, 1, 3), b = int(r, 0, 2), c = int(r, 0, 2), d = int(r, 1, 3), q = int(r, 1, 3), p = int(r, 1, 3);
      const answer = (a * d - b * c) * q ** (a + c - 1) * p ** (b + d - 1);
      const mono = (x, y) => `${x ? (x === 1 ? 'q' : `q<sup>${x}</sup>`) : ''}${y ? (y === 1 ? 'p' : `p<sup>${y}</sup>`) : ''}` || '1';
      return {
        q: `<p>With {f, g} = ∂f/∂q ∂g/∂p − ∂f/∂p ∂g/∂q, find {${mono(a, b)}, ${mono(c, d)}} at q = ${q}, p = ${p}.</p>`,
        answer, unit: '', tol: 0, abs: 1e-9,
        hint: 'Differentiate each monomial by q and by p, then form the two products and subtract.',
        solution: steps(`∂f/∂q · ∂g/∂p = ${a}q<sup>${a - 1}</sup>p<sup>${b}</sup> · ${d}q<sup>${c}</sup>p<sup>${d - 1}</sup>.`, `∂f/∂p · ∂g/∂q = ${b}q<sup>${a}</sup>p<sup>${b - 1}</sup> · ${c}q<sup>${c - 1}</sup>p<sup>${d}</sup>.`, `Difference = (${a * d} − ${b * c}) q<sup>${a + c - 1}</sup>p<sup>${b + d - 1}</sup> = <b>${answer}</b> at the given point.`),
        a, b, c, d, qv: q, pv: p,
      };
    },
    verify: (x) => (x.a * x.d - x.b * x.c) * x.qv ** (x.a + x.c - 1) * x.pv ** (x.b + x.d - 1),
  },
  'rutherford-impact': {
    title: 'Rutherford impact parameter',
    make(r) {
      const Z = [13, 29, 47, 79][int(r, 0, 3)], E = int(r, 3, 9), th = [30, 60, 90, 120][int(r, 0, 3)];
      const k = 2 * Z * 1.44, answer = k / (2 * E) / Math.tan(th * Math.PI / 360);
      return {
        q: `<p>An alpha particle (z = 2) of ${E} MeV is deflected through ${th}° by a fixed nucleus with Z = ${Z}. Using e²/4πε₀ = 1.44 MeV fm, find its impact parameter in fm.</p>`,
        answer, unit: 'fm', tol: 0.005,
        hint: 'For a repulsive k/r potential, cot(Θ/2) = 2Eb/k with k = zZe²/4πε₀.',
        solution: steps(`k = 2 × ${Z} × 1.44 = ${k.toFixed(2)} MeV fm.`, `b = (k/2E) cot(Θ/2) = (${k.toFixed(2)}/${2 * E}) × cot ${th / 2}°.`, `b = <b>${answer.toFixed(2)}</b> fm.`),
        Z, E, th,
      };
    },
    verify: (p) => 2 * p.Z * 1.44 / (2 * p.E) / Math.tan(p.th * Math.PI / 360),
  },
  'two-mass-modes': {
    title: 'normal modes of two coupled masses',
    make(r) {
      const m = int(r, 1, 4), k = int(r, 4, 30), kc = int(r, 1, 20), hi = r() < 0.5;
      const answer = Math.sqrt((hi ? k + 2 * kc : k) / m);
      return {
        q: `<p>Two ${m} kg masses between walls are each joined to their wall by a ${k} N/m spring and to each other by a ${kc} N/m spring. Find the ${hi ? 'higher' : 'lower'} normal-mode angular frequency in rad/s.</p>`,
        answer, unit: 'rad/s', tol: 0.005,
        hint: 'Write K = [[k + k<sub>c</sub>, −k<sub>c</sub>], [−k<sub>c</sub>, k + k<sub>c</sub>]] and solve det(K − ω²M) = 0, or guess the modes (1, 1) and (1, −1).',
        solution: steps('In step (1, 1): the middle spring never stretches, ω² = k/m.', 'Opposite (1, −1): the middle spring stretches by twice the displacement, ω² = (k + 2k<sub>c</sub>)/m.', `${hi ? 'Higher' : 'Lower'}: ω = <b>${answer.toFixed(3)}</b> rad/s.`),
        m, k, kc, hi,
      };
    },
    verify: (p) => Math.sqrt((p.hi ? p.k + 2 * p.kc : p.k) / p.m),
  },
  'top-precession': {
    title: 'precession of a fast top',
    make(r) {
      const M = int(r, 1, 5) / 10, l = int(r, 2, 8) / 100, I3 = int(r, 2, 8) * 1e-4, w = int(r, 10, 40) * 10;
      const answer = 2 * Math.PI * I3 * w / (M * 9.8 * l);
      return {
        q: `<p>A top of mass ${M} kg has its centre of mass ${l} m from its tip and I<sub>3</sub> = ${(I3 * 1e4).toFixed(0)} × 10⁻⁴ kg m². It spins at ${w} rad/s. Find the period of its slow precession in seconds (g = 9.8 m/s²).</p>`,
        answer, unit: 's', tol: 0.005,
        hint: 'For a fast top, the gravitational torque Mgl sin θ turns the horizontal part of I₃ω₃: Ω = Mgl/(I₃ω₃).',
        solution: steps(`Ω = Mgl/(I₃ω₃) = (${M} × 9.8 × ${l}) / (${I3.toExponential(1)} × ${w}) = ${(M * 9.8 * l / (I3 * w)).toFixed(4)} rad/s.`, `Period = 2π/Ω = <b>${answer.toFixed(3)}</b> s.`),
        M, l, I3, w,
      };
    },
    verify: (p) => 2 * Math.PI * p.I3 * p.w / (p.M * 9.8 * p.l),
  },
  'threshold-kinetic': {
    title: 'threshold energy of a reaction',
    make(r) {
      const rx = [
        ['p + p → p + p + π⁰', 938.27, 938.27, 938.27 * 2 + 134.98],
        ['π⁻ + p → K⁰ + Λ', 139.57, 938.27, 497.61 + 1115.68],
        ['γ + p → n + π⁺', 0, 938.27, 939.57 + 139.57],
        ['p + p → p + p + η', 938.27, 938.27, 938.27 * 2 + 547.86],
      ][int(r, 0, 3)];
      const [name, ma, mb, Mf] = rx;
      const answer = (Mf * Mf - ma * ma - mb * mb) / (2 * mb) - ma;
      return {
        q: `<p>Find the threshold kinetic energy (MeV) of the beam particle for ${name}, with the target proton at rest. Masses (MeV/c²): beam ${ma}, target ${mb}; total mass of the products ${Mf.toFixed(2)}.</p>`,
        answer, unit: 'MeV', tol: 0.003,
        hint: 'At threshold the products are at rest in the centre-of-mass frame, so √s equals the sum of their masses. Use s = m<sub>a</sub>² + m<sub>b</sub>² + 2E<sub>a</sub>m<sub>b</sub> (c = 1).',
        solution: steps(`√s = ${Mf.toFixed(2)} MeV at threshold.`, `E<sub>a</sub> = (${Mf.toFixed(2)}² − ${ma}² − ${mb}²)/(2 × ${mb}) = ${(answer + ma).toFixed(2)} MeV.`, `T<sub>a</sub> = E<sub>a</sub> − m<sub>a</sub> = <b>${answer.toFixed(2)}</b> MeV.`),
        ma, mb, Mf,
      };
    },
    verify: (p) => (p.Mf ** 2 - p.ma ** 2 - p.mb ** 2) / (2 * p.mb) - p.ma,
  },
};

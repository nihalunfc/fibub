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
};

// Live problems for CSIR NET Physics lessons (lesson kit). Each make(rand) returns { q, answer, unit, tol (relative),
// abs?, hint, solution } as HTML; verify(p) works the answer out another way for tests/exam-physics.mjs.
// Placed in a lesson as <div class="problem" data-problem="id"></div>. Exam-style practice uses the question bank instead.
const int = (r, a, b) => a + Math.floor(r() * (b - a + 1));
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';

export default {
  // ---- 1.1 to 1.3 and the unit roadmaps (start-here writer) ----
  'net-guess-value': {
    title: 'expected marks from guessing with a 25% penalty',
    make(r) {
      const part = int(r, 0, 2), m = [2, 3.5, 5][part], name = ['A', 'B', 'C'][part], n = int(r, 2, 8), e = int(r, 0, 2);
      const p = 1 / (4 - e), per = p * m - (1 - p) * m / 4, answer = n * per;
      return {
        q: `<p>In Part ${name} a right answer earns ${m} marks and a wrong one costs a quarter of that (${m / 4} marks). On ${n} questions you can rule out ${e} of the four options with certainty${e === 0 ? ' (that is, none)' : ''} and guess among the rest. What is your expected total from these ${n} questions?</p>`,
        answer, unit: 'marks', tol: 0.005,
        hint: 'p = 1/(options left). Expected marks per question = p·m − (1 − p)·m/4. Multiply by the number of questions.',
        solution: steps(`Options left: ${4 - e}, so p = 1/${4 - e} = ${p.toFixed(3)}.`, `Per question: ${p.toFixed(3)} × ${m} − ${(1 - p).toFixed(3)} × ${m / 4} = ${per.toFixed(4)} marks.`, `Over ${n} questions: <b>${answer.toFixed(3)} marks</b>. With a quarter penalty even a blind guess is worth m/16 on average, but each guess uses one of your limited answer slots.`),
        n, e, m,
      };
    },
    verify: (p) => { const q = 1 / (4 - p.e); return p.n * p.m * (5 * q - 1) / 4; },
  },
  'net-paper-score': {
    title: 'score a NET paper from right and wrong answers',
    make(r) {
      const aR = int(r, 6, 13), aW = int(r, 0, 15 - aR), bR = int(r, 6, 16), bW = int(r, 0, 20 - bR), cR = int(r, 3, 14), cW = int(r, 0, 20 - cR);
      const A = aR * 2 - aW * 0.5, B = bR * 3.5 - bW * 0.875, Cc = cR * 5 - cW * 1.25, answer = A + B + Cc;
      return {
        q: `<p>A candidate's answers: Part A ${aR} right, ${aW} wrong; Part B ${bR} right, ${bW} wrong; Part C ${cR} right, ${cW} wrong (the rest left blank, all within the answer limits). With 2, 3.5 and 5 marks a question and a quarter of those marks lost for a wrong answer, what is the total score out of 200?</p>`,
        answer, unit: 'marks', tol: 0.001,
        hint: 'Wrong answers cost 0.5 in Part A, 0.875 in Part B and 1.25 in Part C. Work out each part, then add.',
        solution: steps(`Part A: ${aR} × 2 − ${aW} × 0.5 = ${A}.`, `Part B: ${bR} × 3.5 − ${bW} × 0.875 = ${B}.`, `Part C: ${cR} × 5 − ${cW} × 1.25 = ${Cc}.`, `Total: <b>${answer} marks</b> (${(answer / 2).toFixed(1)}%).`),
        aR, aW, bR, bW, cR, cW,
      };
    },
    verify: (p) => 2 * (p.aR - p.aW / 4) + 3.5 * (p.bR - p.bW / 4) + 5 * (p.cR - p.cW / 4),
  },
  'apt-chain-percent': {
    title: 'three successive percentage changes',
    make(r) {
      const x = int(r, 1, 6) * 5, y = int(r, 1, 6) * 5, z = int(r, 1, 6) * 5, P = int(r, 2, 9) * 1000;
      const answer = P * (1 + x / 100) * (1 - y / 100) * (1 + z / 100);
      return {
        q: `<p>A price of ${P} rupees rises by ${x}%, then falls by ${y}%, then rises by ${z}%. What is the final price in rupees?</p>`,
        answer, unit: 'rupees', tol: 0.001,
        hint: 'Turn each change into a factor (a rise of x% is ×(1 + x/100), a fall of y% is ×(1 − y/100)) and multiply.',
        solution: steps(`Factors: ${1 + x / 100}, ${1 - y / 100}, ${1 + z / 100}.`, `Product: ${((1 + x / 100) * (1 - y / 100) * (1 + z / 100)).toFixed(5)}.`, `Final price: ${P} × that = <b>${answer.toFixed(2)} rupees</b>. Adding the percentages (${x - y + z}%) would give ${(P * (1 + (x - y + z) / 100)).toFixed(0)}, which is wrong.`),
        x, y, z, P,
      };
    },
    verify: (p) => p.P * (100 + p.x) * (100 - p.y) * (100 + p.z) / 1e6,
  },
  'apt-pipes': {
    title: 'two filling pipes and a leak',
    make(r) {
      const [a, b, c] = [[6, 8, 12], [4, 6, 12], [10, 15, 30], [3, 6, 4], [5, 10, 15], [8, 12, 24], [6, 9, 18], [12, 18, 36]][int(r, 0, 7)];
      const net = 1 / a + 1 / b - 1 / c, answer = 1 / net;
      return {
        q: `<p>Pipe P fills a tank in ${a} h and pipe Q in ${b} h. A leak would empty the full tank in ${c} h. With both pipes open and the leak running, how long does the empty tank take to fill?</p>`,
        answer, unit: 'h', tol: 0.005,
        hint: 'Rates add (tanks per hour): filling rates are positive, the leak is negative. Time = 1 / net rate.',
        solution: steps(`Net rate = 1/${a} + 1/${b} − 1/${c} = ${net.toFixed(4)} tank per hour.`, `Time = 1/${net.toFixed(4)} = <b>${answer.toFixed(2)} h</b>.`),
        a, b, c,
      };
    },
    verify: (p) => (p.a * p.b * p.c) / (p.b * p.c + p.a * p.c - p.a * p.b),
  },
  'net-sym-eigen': {
    title: 'largest eigenvalue of a real symmetric 2 × 2 matrix',
    make(r) {
      const a = int(r, -4, 6), b = int(r, 1, 5), d = int(r, -4, 6);
      const tr = a + d, det = a * d - b * b, answer = tr / 2 + Math.sqrt((a - d) ** 2 / 4 + b * b);
      return {
        q: `<p>Find the larger eigenvalue of the matrix M = [[${a}, ${b}], [${b}, ${d}]].</p>`,
        answer, unit: '', tol: 0.002, abs: 0.002,
        hint: 'For a 2 × 2 matrix, λ² − (trace)λ + det = 0. Trace = sum of diagonal, det = ad − b².',
        solution: steps(`Trace = ${tr}, det = ${a}·${d} − ${b}² = ${det}.`, `λ = [${tr} ± √(${tr}² − 4·(${det}))]/2 = [${tr} ± √${tr * tr - 4 * det}]/2.`, `Larger: <b>${answer.toFixed(3)}</b>. Check: the two roots add to ${tr} and multiply to ${det}.`),
        a, b, d,
      };
    },
    verify: (p) => { const t = p.a + p.d, D = p.a * p.d - p.b * p.b; return (t + Math.sqrt(t * t - 4 * D)) / 2; },
  },
  'net-double-well': {
    title: 'small oscillations in a double-well potential',
    make(r) {
      const m = int(r, 1, 4), a = int(r, 1, 5), b = int(r, 2, 12);
      const x0 = Math.sqrt(b / (2 * a)), k = 4 * b, answer = Math.sqrt(k / m);
      return {
        q: `<p>A particle of mass ${m} kg moves in V(x) = ${a}x⁴ − ${b}x² (SI units). Find the angular frequency of small oscillations about either minimum, in rad/s.</p>`,
        answer, unit: 'rad/s', tol: 0.003,
        hint: 'Find the minima from V′(x) = 0, then the curvature V″ there. ω = √(V″/m).',
        solution: steps(`V′ = ${4 * a}x³ − ${2 * b}x = 0 gives x₀² = ${b}/${2 * a}, so x₀ = ±${x0.toFixed(3)} m.`, `V″ = ${12 * a}x² − ${2 * b}; at x₀², V″ = ${12 * a} × ${(b / (2 * a)).toFixed(3)} − ${2 * b} = ${k} N/m (always 4b).`, `ω = √(${k}/${m}) = <b>${answer.toFixed(3)} rad/s</b>.`),
        m, a, b,
      };
    },
    verify: (p) => Math.sqrt((12 * p.a * (p.b / (2 * p.a)) - 2 * p.b) / p.m),
  },
  'net-skin-depth': {
    title: 'skin depth in a good conductor',
    make(r) {
      const [metal, rho] = [['copper', 1.68e-8], ['aluminium', 2.65e-8], ['silver', 1.59e-8], ['brass', 7e-8]][int(r, 0, 3)];
      const fk = [1, 10, 50, 100, 1000, 10000][int(r, 0, 5)], f = fk * 1e3, mu0 = 4e-7 * Math.PI;
      const answer = Math.sqrt(2 * rho / (2 * Math.PI * f * mu0)) * 1e6;
      return {
        q: `<p>Find the skin depth of ${metal} (resistivity ${rho.toExponential(2)} Ω m, μ ≈ μ₀) at ${fk >= 1000 ? fk / 1000 + ' MHz' : fk + ' kHz'}, in micrometres.</p>`,
        answer, unit: 'μm', tol: 0.005,
        hint: 'δ = √(2ρ/(ωμ₀)) with ω = 2πf and μ₀ = 4π × 10⁻⁷ H/m.',
        solution: steps(`ω = 2π × ${f.toExponential(2)} = ${(2 * Math.PI * f).toExponential(3)} rad/s.`, `δ = √(2 × ${rho.toExponential(2)} / (${(2 * Math.PI * f).toExponential(3)} × 1.2566 × 10⁻⁶)) = ${(answer * 1e-6).toExponential(3)} m.`, `<b>${answer.toFixed(1)} μm</b>. δ falls as 1/√f: ten times the frequency gives about a third of the depth.`),
        rho, f,
      };
    },
    verify: (p) => 1e6 / Math.sqrt(Math.PI * p.f * 4e-7 * Math.PI / p.rho),
  },
  'net-box-level': {
    title: 'energy levels of an electron in a box',
    make(r) {
      const L = [0.2, 0.3, 0.5, 0.8, 1, 1.5, 2][int(r, 0, 6)], n1 = int(r, 1, 3), n2 = n1 + int(r, 1, 3);
      const E1 = 6.62607015e-34 ** 2 / (8 * 9.1093837e-31 * (L * 1e-9) ** 2) / 1.602176634e-19, answer = (n2 * n2 - n1 * n1) * E1;
      return {
        q: `<p>An electron is confined to a one-dimensional infinite well of width ${L} nm. Find the energy of the photon emitted in the jump from n = ${n2} to n = ${n1}, in eV.</p>`,
        answer, unit: 'eV', tol: 0.005,
        hint: 'Eₙ = n²h²/(8mL²). For an electron, h²/(8m) = 0.376 eV nm², so E₁ = 0.376/L² eV with L in nm.',
        solution: steps(`E₁ = 0.376/${L}² = ${E1.toFixed(4)} eV.`, `ΔE = (${n2}² − ${n1}²) E₁ = ${n2 * n2 - n1 * n1} × ${E1.toFixed(4)} = <b>${answer.toFixed(3)} eV</b>.`),
        L, n1, n2,
      };
    },
    verify: (p) => (p.n2 ** 2 - p.n1 ** 2) * 0.37603 / p.L ** 2,
  },
  'net-two-level': {
    title: 'mean energy of a two-level system',
    make(r) {
      const eps = int(r, 2, 40), T = int(r, 2, 40) * 10, kT = 8.617333e-2 * T, x = eps / kT, answer = eps / (1 + Math.exp(x));
      return {
        q: `<p>A system has two non-degenerate levels at 0 and ε = ${eps} meV, in equilibrium at T = ${T} K. Find its mean energy in meV. (k = 0.08617 meV/K)</p>`,
        answer, unit: 'meV', tol: 0.005,
        hint: 'Z = 1 + e^(−ε/kT). ⟨E⟩ = ε e^(−ε/kT)/Z = ε/(1 + e^(ε/kT)).',
        solution: steps(`kT = 0.08617 × ${T} = ${kT.toFixed(3)} meV, so ε/kT = ${x.toFixed(4)}.`, `⟨E⟩ = ${eps}/(1 + e^${x.toFixed(4)}) = <b>${answer.toFixed(3)} meV</b>.`, 'At high T this tends to ε/2 (both levels equally filled), never above it.'),
        eps, T,
      };
    },
    verify: (p) => { const b = 1 / (8.617333e-2 * p.T); return p.eps * Math.exp(-b * p.eps) / (1 + Math.exp(-b * p.eps)); },
  },
  'net-summing-amp': {
    title: 'output of an inverting summing amplifier',
    make(r) {
      const Rf = [10, 20, 47, 100][int(r, 0, 3)], R1 = [10, 20, 47][int(r, 0, 2)], R2 = [5, 10, 22, 100][int(r, 0, 3)];
      const v1 = int(r, -10, 10) / 10, v2 = int(r, 1, 10) / 10, answer = -Rf * (v1 / R1 + v2 / R2);
      return {
        q: `<p>An ideal op-amp inverting summer has R_f = ${Rf} kΩ, input resistors R₁ = ${R1} kΩ and R₂ = ${R2} kΩ, and inputs V₁ = ${v1} V and V₂ = ${v2} V. Find V_out in volts (assume the op-amp does not saturate).</p>`,
        answer, unit: 'V', tol: 0.002, abs: 0.002,
        hint: 'The inverting input is a virtual ground, so the input currents V₁/R₁ and V₂/R₂ add and all flow through R_f: V_out = −R_f(V₁/R₁ + V₂/R₂).',
        solution: steps(`Currents: ${v1}/${R1} + ${v2}/${R2} = ${(v1 / R1 + v2 / R2).toFixed(4)} mA.`, `V_out = −${Rf} kΩ × ${(v1 / R1 + v2 / R2).toFixed(4)} mA = <b>${answer.toFixed(3)} V</b>.`),
        Rf, R1, R2, v1, v2,
      };
    },
    verify: (p) => -(p.Rf * p.v1 / p.R1 + p.Rf * p.v2 / p.R2),
  },
  'net-rot-spacing': {
    title: 'rotational line spacing from the bond length',
    make(r) {
      const mols = [['¹H³⁵Cl', 1.0078, 34.9689, 127.5], ['¹²C¹⁶O', 12, 15.9949, 112.8], ['¹H¹⁹F', 1.0078, 18.9984, 91.7], ['¹H⁷⁹Br', 1.0078, 78.9183, 141.4], ['¹⁴N¹⁶O', 14.0031, 15.9949, 115.1]];
      const [name, m1, m2, rpm] = mols[int(r, 0, mols.length - 1)];
      const mu = (m1 * m2) / (m1 + m2) * 1.66053906660e-27, I = mu * (rpm * 1e-12) ** 2;
      const B = 6.62607015e-34 / (8 * Math.PI ** 2 * 2.99792458e10 * I), answer = 2 * B;
      return {
        q: `<p>The bond length of ${name} is ${rpm} pm (atomic masses ${m1} u and ${m2} u). Treating it as a rigid rotor, find the spacing between neighbouring lines of its pure rotational spectrum, in cm⁻¹.</p>`,
        answer, unit: 'cm⁻¹', tol: 0.005,
        hint: 'μ = m₁m₂/(m₁ + m₂), I = μr², B = h/(8π²cI) with c in cm/s. Lines are spaced by 2B.',
        solution: steps(`μ = ${((m1 * m2) / (m1 + m2)).toFixed(4)} u = ${mu.toExponential(4)} kg.`, `I = μr² = ${I.toExponential(4)} kg m².`, `B = h/(8π²cI) = ${B.toFixed(3)} cm⁻¹, so the spacing is 2B = <b>${answer.toFixed(2)} cm⁻¹</b>.`),
        m1, m2, rpm,
      };
    },
    verify: (p) => { const mu = p.m1 * p.m2 / (p.m1 + p.m2) * 1.66053906660e-27; return 2 * 6.62607015e-34 / (8 * Math.PI ** 2 * 2.99792458e10 * mu * (p.rpm * 1e-12) ** 2); },
  },
  'net-fermi-energy': {
    title: 'Fermi energy of a free-electron metal',
    make(r) {
      const [metal, n] = [['sodium', 2.65e28], ['potassium', 1.40e28], ['copper', 8.47e28], ['silver', 5.86e28], ['aluminium', 18.1e28], ['gold', 5.90e28]][int(r, 0, 5)];
      const hbar = 1.054571817e-34, me = 9.1093837015e-31, kF = Math.cbrt(3 * Math.PI ** 2 * n), answer = hbar ** 2 * kF ** 2 / (2 * me) / 1.602176634e-19;
      return {
        q: `<p>${metal[0].toUpperCase() + metal.slice(1)} has ${n.toExponential(2)} conduction electrons per m³. In the free-electron model, find its Fermi energy in eV.</p>`,
        answer, unit: 'eV', tol: 0.005,
        hint: 'k_F = (3π²n)^(1/3) (two spin states per k), E_F = ħ²k_F²/(2m).',
        solution: steps(`k_F = (3π² × ${n.toExponential(2)})^(1/3) = ${kF.toExponential(4)} m⁻¹.`, `E_F = ħ²k_F²/(2m) = ${(answer * 1.602176634e-19).toExponential(4)} J = <b>${answer.toFixed(2)} eV</b>.`),
        n,
      };
    },
    verify: (p) => (1.054571817e-34 ** 2 / (2 * 9.1093837015e-31)) * Math.pow(3 * Math.PI ** 2 * p.n, 2 / 3) / 1.602176634e-19,
  },
  'net-alpha-ke': {
    title: 'kinetic energy of an alpha particle from the Q value',
    make(r) {
      const A = int(r, 200, 240), Q = int(r, 40, 90) / 10, answer = Q * (A - 4) / A;
      return {
        q: `<p>A nucleus of mass number A = ${A}, at rest, alpha-decays with Q = ${Q} MeV to the ground state of the daughter. Find the kinetic energy of the alpha particle in MeV (non-relativistic, masses ≈ mass numbers).</p>`,
        answer, unit: 'MeV', tol: 0.002,
        hint: 'Momentum conservation: the alpha and the daughter (mass number A − 4) have equal and opposite momenta, so they share Q in the inverse ratio of their masses: T_α = Q(A − 4)/A.',
        solution: steps(`p_α = p_D, so T = p²/2m gives T_α/T_D = (A − 4)/4 = ${(A - 4) / 4}.`, `T_α = Q × (A − 4)/A = ${Q} × ${A - 4}/${A} = <b>${answer.toFixed(3)} MeV</b>; the recoil takes the remaining ${(Q - answer).toFixed(3)} MeV.`),
        A, Q,
      };
    },
    verify: (p) => p.Q - 4 * p.Q / p.A,
  },
};

// Live problems for CSIR NET Physics lessons (lesson kit). Each make(rand) returns { q, answer, unit, tol (relative),
// abs?, hint, solution } as HTML; verify(p) works the answer out another way for tests/exam-physics.mjs.
// Placed in a lesson as <div class="problem" data-problem="id"></div>. Exam-style practice uses the question bank instead.
const int = (r, a, b) => a + Math.floor(r() * (b - a + 1));
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const ord = (k) => `${k + 1}${['st', 'nd', 'rd'][k] || 'th'}`;

const KB = 8.617333e-5, HPL = 6.62607015e-34, QE = 1.602176634e-19, EPS0 = 8.8541878128e-12, ME = 9.1093837e-31, HBAR = 1.054571817e-34, CL = 2.99792458e8;
const HC = 197.327, MUNP = 469.46;
// S-wave square-well depth that binds at -B (MeV) for range R (fm): solve k cot kR = -kappa on (pi/2R, pi/R)
const wellDepth = (R, B) => {
  const ka = Math.sqrt(2 * MUNP * B) / HC;
  let lo = Math.PI / (2 * R), hi = Math.PI / R - 1e-12;
  for (let i = 0; i < 100; i++) { const k = (lo + hi) / 2; if (k / Math.tan(k * R) + ka > 0) lo = k; else hi = k; }
  return { k: lo, ka, V0: (HC * lo) ** 2 / (2 * MUNP) + B };
};

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
  // ---- 2.2 to 2.4 group theory, probability, numerical methods; 3.2 to 3.4 Hamilton-Jacobi, phase space, chaos ----
  'c3v-reduce': {
    title: 'reduce a representation of C3v with the character table',
    make(r) {
      const a = int(r, 0, 3), b = int(r, 0, 2), c = int(r, 1, 3), w = ['A₁', 'A₂', 'E'][int(r, 0, 2)];
      const chi = [a + b + 2 * c, a + b - c, a - b], row = { 'A₁': [1, 1, 1], 'A₂': [1, 1, -1], E: [2, -1, 0] }[w];
      const sum = chi[0] * row[0] + 2 * chi[1] * row[1] + 3 * chi[2] * row[2], answer = sum / 6;
      return {
        q: `<p>The group C<sub>3v</sub> has classes E (1 element), 2C₃ (2 elements) and 3σ<sub>v</sub> (3 elements), and irreps A₁ = (1, 1, 1), A₂ = (1, 1, −1), E = (2, −1, 0). A representation has characters (${chi.join(', ')}). How many times does ${w} appear in it?</p>`,
        answer, unit: '', tol: 0.001, abs: 0.01,
        hint: 'Use n = (1/|G|) Σ over classes of (class size) × χ(class) × χ<sub>irrep</sub>(class), with |G| = 6.',
        solution: steps('Weights: class sizes 1, 2, 3 and |G| = 6.', `n = (1/6)[1·${chi[0]}·${row[0]} + 2·${chi[1]}·${row[1]} + 3·${chi[2]}·${row[2]}] = ${sum}/6 = <b>${answer}</b>.`, `Full decomposition: ${a}A₁ + ${b}A₂ + ${c}E; check the dimension ${a} + ${b} + 2·${c} = ${chi[0]}.`),
        chi, row,
      };
    },
    verify: (p) => (p.chi[0] * p.row[0] + 2 * p.chi[1] * p.row[1] + 3 * p.chi[2] * p.row[2]) / 6,
  },
  'su2-product': {
    title: 'dimension of a multiplet in a product of SU(2) representations',
    make(r) {
      const j1 = int(r, 1, 6) / 2, j2 = int(r, 1, 4) / 2, k = int(r, 0, Math.round(2 * Math.min(j1, j2)));
      const J = Math.abs(j1 - j2) + k, answer = 2 * J + 1;
      const s = (j) => (Number.isInteger(j) ? String(j) : `${2 * j}/2`);
      return {
        q: `<p>Angular momenta j₁ = ${s(j1)} and j₂ = ${s(j2)} are combined. List the total J values that appear, and give the number of states in the ${ord(k)} smallest multiplet.</p>`,
        answer, unit: '', tol: 0.001,
        hint: 'J runs from |j₁ − j₂| to j₁ + j₂ in steps of 1; a multiplet with total J has 2J + 1 states.',
        solution: steps(`J = ${s(Math.abs(j1 - j2))}, ..., ${s(j1 + j2)}: ${2 * Math.min(j1, j2) + 1} multiplets.`, `The ${ord(k)} smallest is J = ${s(J)}, with 2J + 1 = <b>${answer}</b> states.`, `Check: all the dimensions add up to (2j₁ + 1)(2j₂ + 1) = ${(2 * j1 + 1) * (2 * j2 + 1)}.`),
        j1, j2, k,
      };
    },
    verify: (p) => { const js = []; for (let j = Math.abs(p.j1 - p.j2); j <= p.j1 + p.j2 + 1e-9; j++) js.push(j); return 2 * js[p.k] + 1; },
  },
  'poisson-count': {
    title: 'Poisson probability of a number of counts',
    make(r) {
      const lam = [0.5, 1, 1.5, 2, 3, 4, 5][int(r, 0, 6)], k = int(r, 0, 5);
      let f = 1; for (let i = 2; i <= k; i++) f *= i;
      const answer = lam ** k * Math.exp(-lam) / f;
      return {
        q: `<p>A weak source gives on average ${lam} counts per second. Find the probability of exactly ${k} counts in a one-second window.</p>`,
        answer, unit: '', tol: 0.01,
        hint: 'Independent rare events: P(k) = λ<sup>k</sup> e<sup>−λ</sup> / k!.',
        solution: steps(`λ = ${lam}, k = ${k}.`, `P(${k}) = ${lam}<sup>${k}</sup> × e<sup>−${lam}</sup> / ${k}! = ${(lam ** k).toFixed(4)} × ${Math.exp(-lam).toFixed(5)} / ${f} = <b>${answer.toFixed(4)}</b>.`),
        lam, k,
      };
    },
    verify: (p) => { let t = Math.exp(-p.lam); for (let i = 1; i <= p.k; i++) t *= p.lam / i; return t; },
  },
  'gauss-window': {
    title: 'probability that a Gaussian measurement falls in a window',
    make(r) {
      const z = [0.5, 1, 1.5, 2, 2.5, 3][int(r, 0, 5)], mu = int(r, 10, 90), s = int(r, 1, 6);
      const x = z / Math.SQRT2, t = 1 / (1 + 0.3275911 * x);
      const answer = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
      return {
        q: `<p>A quantity is Gaussian with mean ${mu} and standard deviation ${s}. Find the probability that one measurement lies between ${mu - z * s} and ${mu + z * s}.</p>`,
        answer, unit: '', tol: 0.005,
        hint: `The window is ±${z}σ about the mean, so P = erf(${z}/√2). Remember 68%, 95% and 99.7% for 1σ, 2σ and 3σ.`,
        solution: steps(`Standardise: the limits are ${mu} ± ${z}×${s}, i.e. z = ±${z}.`, `P(|z| < ${z}) = erf(${z}/√2) = <b>${answer.toFixed(4)}</b>.`),
        z,
      };
    },
    verify: (p) => { const N = 2000, a = -p.z, h = 2 * p.z / N; let s = 0; for (let i = 0; i <= N; i++) s += Math.exp(-((a + i * h) ** 2) / 2) * (i === 0 || i === N ? 1 : i % 2 ? 4 : 2); return s * h / 3 / Math.sqrt(2 * Math.PI); },
  },
  'newton-root': {
    title: 'two Newton-Raphson steps for a square root',
    make(r) {
      const c = [2, 3, 5, 6, 7, 8, 10, 11, 13][int(r, 0, 8)], x0 = Math.max(1, Math.round(Math.sqrt(c)) + int(r, -1, 1));
      const x1 = (x0 + c / x0) / 2, x2 = (x1 + c / x1) / 2;
      return {
        q: `<p>Use Newton-Raphson on f(x) = x² − ${c}, starting from x₀ = ${x0}. Find x₂.</p>`,
        answer: x2, unit: '', tol: 0.0002,
        hint: 'x<sub>n+1</sub> = x<sub>n</sub> − f(x<sub>n</sub>)/f′(x<sub>n</sub>) = (x<sub>n</sub> + c/x<sub>n</sub>)/2 for f = x² − c.',
        solution: steps(`x₁ = (${x0} + ${c}/${x0})/2 = ${x1.toFixed(6)}.`, `x₂ = (${x1.toFixed(6)} + ${c}/${x1.toFixed(6)})/2 = <b>${x2.toFixed(6)}</b>.`, `Compare √${c} = ${Math.sqrt(c).toFixed(6)}: the error is roughly squared at each step.`),
        c, x0,
      };
    },
    verify: (p) => { let x = p.x0; for (let i = 0; i < 2; i++) x -= (x * x - p.c) / (2 * x); return x; },
  },
  'simpson-pi': {
    title: 'Simpson and trapezoid estimates of an integral',
    make(r) {
      const n = [2, 4, 6, 8][int(r, 0, 3)], rule = ['Simpson', 'trapezoid'][int(r, 0, 1)], f = (x) => 4 / (1 + x * x), h = 1 / n;
      let s;
      if (rule === 'Simpson') { s = f(0) + f(1); for (let i = 1; i < n; i++) s += f(i * h) * (i % 2 ? 4 : 2); s *= h / 3; } else { s = (f(0) + f(1)) / 2; for (let i = 1; i < n; i++) s += f(i * h); s *= h; }
      return {
        q: `<p>The integral of 4/(1 + x²) from 0 to 1 is π. Estimate it with the composite ${rule} rule and ${n} equal sub-intervals.</p>`,
        answer: s, unit: '', tol: 0.0001,
        hint: rule === 'Simpson' ? 'S = (h/3)[f₀ + 4f₁ + 2f₂ + 4f₃ + ... + f<sub>n</sub>] with h = 1/n.' : 'T = h[f₀/2 + f₁ + ... + f<sub>n−1</sub> + f<sub>n</sub>/2] with h = 1/n.',
        solution: steps(`h = ${h.toFixed(4)}; the values f(x<sub>i</sub>) are ${Array.from({ length: n + 1 }, (_, i) => f(i * h).toFixed(5)).join(', ')}.`, `${rule} sum: <b>${s.toFixed(6)}</b>.`, `Error: ${(s - Math.PI).toExponential(2)}; Simpson's error falls as h⁴, the trapezoid's as h².`),
        n, rule,
      };
    },
    verify: (p) => { const f = (x) => 4 / (1 + x * x), h = 1 / p.n; let s = 0; if (p.rule === 'Simpson') for (let i = 0; i < p.n; i += 2) s += h / 3 * (f(i * h) + 4 * f((i + 1) * h) + f((i + 2) * h)); else for (let i = 0; i < p.n; i++) s += (f(i * h) + f((i + 1) * h)) * h / 2; return s; },
  },
  'pendulum-adiabatic': {
    title: 'a pendulum whose string is changed slowly',
    make(r) {
      const l1 = [0.5, 1, 1.5, 2, 3][int(r, 0, 4)], f = [0.25, 0.5, 2, 4][int(r, 0, 3)], th = int(r, 2, 6), l2 = l1 * f;
      const answer = th * f ** -0.75;
      return {
        q: `<p>A pendulum of length ${l1} m swings with amplitude ${th}°. Its length is changed very slowly to ${l2} m. Find the new amplitude in degrees (small angles).</p>`,
        answer, unit: '°', tol: 0.005,
        hint: 'The action E/ν is an adiabatic invariant; ν ∝ l<sup>−1/2</sup> and E = ½ m g l θ₀².',
        solution: steps('E/ν constant with ν ∝ l<sup>−1/2</sup> gives E ∝ l<sup>−1/2</sup>.', 'θ₀² ∝ E/l ∝ l<sup>−3/2</sup>, so θ₀ ∝ l<sup>−3/4</sup>.', `θ₀ = ${th}° × (${l1}/${l2})<sup>3/4</sup> = <b>${answer.toFixed(3)}°</b>.`),
        th, f,
      };
    },
    verify: (p) => p.th * Math.sqrt(p.f ** -0.5 / p.f),
  },
  'action-oscillator': {
    title: 'action of an oscillator from J = ∮ p dq',
    make(r) {
      const m = [0.5, 1, 2, 4][int(r, 0, 3)], k = int(r, 1, 20), E = int(r, 1, 10);
      const w = Math.sqrt(k / m), answer = 2 * Math.PI * E / w;
      return {
        q: `<p>A mass of ${m} kg on a spring of constant ${k} N/m oscillates with energy ${E} J. Find its action J = ∮ p dq in J s.</p>`,
        answer, unit: 'J s', tol: 0.005,
        hint: 'The orbit is an ellipse with semi-axes √(2E/k) and √(2mE); its area is π times their product.',
        solution: steps(`Semi-axes: √(2E/k) = ${Math.sqrt(2 * E / k).toFixed(4)} m and √(2mE) = ${Math.sqrt(2 * m * E).toFixed(4)} kg m/s.`, `J = π × ${Math.sqrt(2 * E / k).toFixed(4)} × ${Math.sqrt(2 * m * E).toFixed(4)} = 2πE/ω = <b>${answer.toFixed(4)} J s</b>, with ω = ${w.toFixed(4)} rad/s.`),
        m, k, E,
      };
    },
    verify: (p) => Math.PI * Math.sqrt(2 * p.E / p.k) * Math.sqrt(2 * p.m * p.E),
  },
  'linear-eigen': {
    title: 'eigenvalues and type of a planar fixed point',
    make(r) {
      const a = int(r, -3, 3), b = int(r, 1, 4), c = -int(r, 1, 4), d = int(r, -3, 3) || 1;
      const t = a + d, D = a * d - b * c, disc = t * t - 4 * D;
      const answer = disc >= 0 ? (t + Math.sqrt(disc)) / 2 : t / 2;
      const kind = D < 0 ? 'saddle' : t === 0 ? 'centre' : disc >= 0 ? (t < 0 ? 'stable node' : 'unstable node') : (t < 0 ? 'stable spiral' : 'unstable spiral');
      return {
        q: `<p>For ẋ = ${a}x + ${b}y, ẏ = ${c}x + ${d}y, find the largest real part among the eigenvalues at the origin. What kind of fixed point is it?</p>`,
        answer, unit: '', tol: 0.001, abs: 0.001,
        hint: 'λ = ½[τ ± √(τ² − 4Δ)] with τ = a + d and Δ = ad − bc; if τ² < 4Δ the real part is τ/2.',
        solution: steps(`τ = ${t}, Δ = ${D}, τ² − 4Δ = ${disc}.`, disc >= 0 ? `Real eigenvalues ${((t + Math.sqrt(disc)) / 2).toFixed(4)} and ${((t - Math.sqrt(disc)) / 2).toFixed(4)}; the largest is <b>${answer.toFixed(4)}</b>.` : `Complex eigenvalues ${(t / 2).toFixed(3)} ± ${(Math.sqrt(-disc) / 2).toFixed(3)}i; real part <b>${(t / 2).toFixed(4)}</b>.`, `The origin is a <b>${kind}</b>.`),
        a, b, c, d,
      };
    },
    verify: (p) => { const t = p.a + p.d, D = p.a * p.d - p.b * p.c, disc = t * t - 4 * D; return disc >= 0 ? Math.max((t + Math.sqrt(disc)) / 2, (t - Math.sqrt(disc)) / 2) : t / 2; },
  },
  'separatrix-speed': {
    title: 'speed on the pendulum separatrix',
    make(r) {
      const l = [0.25, 0.5, 1, 2, 4][int(r, 0, 4)], th = [0, 30, 60, 90, 120, 150][int(r, 0, 5)];
      const w0 = Math.sqrt(9.8 / l), answer = 2 * w0 * Math.cos(th * Math.PI / 360);
      return {
        q: `<p>A pendulum of length ${l} m (g = 9.8 m/s²) moves on its separatrix: it just reaches the upright position. Find its angular speed in rad/s when it is ${th}° from the bottom.</p>`,
        answer, unit: 'rad/s', tol: 0.005,
        hint: 'On the separatrix the energy equals that of the pendulum at rest upright: ½θ̇² − ω₀² cos θ = ω₀².',
        solution: steps(`ω₀ = √(g/l) = ${w0.toFixed(4)} rad/s.`, '½θ̇² = ω₀²(1 + cos θ) = 2ω₀² cos²(θ/2), so θ̇ = 2ω₀ cos(θ/2).', `θ̇ = 2 × ${w0.toFixed(4)} × cos ${th / 2}° = <b>${answer.toFixed(4)} rad/s</b>.`),
        l, th,
      };
    },
    verify: (p) => Math.sqrt(2 * (9.8 / p.l) * (1 + Math.cos(p.th * Math.PI / 180))),
  },
  'logistic-cycle': {
    title: 'the stable 2-cycle of the logistic map',
    make(r) {
      const rr = 3.05 + 0.01 * int(r, 0, 39), up = int(r, 0, 1) === 1;
      const s = Math.sqrt((rr - 3) * (rr + 1)), answer = (rr + 1 + (up ? s : -s)) / (2 * rr);
      return {
        q: `<p>For the logistic map x → ${rr.toFixed(2)} x(1 − x) the attractor is a 2-cycle. Find its ${up ? 'larger' : 'smaller'} point.</p>`,
        answer, unit: '', tol: 0.001,
        hint: 'Solve f(f(x)) = x and divide out the fixed points x = 0 and 1 − 1/r: r²x² − r(r + 1)x + (r + 1) = 0.',
        solution: steps(`x = [(r + 1) ± √((r − 3)(r + 1))]/(2r) with r = ${rr.toFixed(2)}.`, `√(${(rr - 3).toFixed(2)} × ${(rr + 1).toFixed(2)}) = ${s.toFixed(4)}.`, `x = (${(rr + 1).toFixed(2)} ${up ? '+' : '−'} ${s.toFixed(4)})/${(2 * rr).toFixed(2)} = <b>${answer.toFixed(4)}</b>.`),
        rr, up,
      };
    },
    verify: (p) => { let x = 0.3; for (let i = 0; i < 8000; i++) x = p.rr * x * (1 - x); const y = p.rr * x * (1 - x); return p.up ? Math.max(x, y) : Math.min(x, y); },
  },
  'chaos-horizon': {
    title: 'how far ahead a chaotic system can be predicted',
    make(r) {
      const lam = [0.2, 0.5, 0.9, 1.2, 2][int(r, 0, 4)], e0 = int(r, 4, 12), e1 = int(r, 0, 2);
      const answer = (e0 - e1) * Math.LN10 / lam;
      return {
        q: `<p>A chaotic system has Lyapunov exponent ${lam} per second. The initial state is known to 10<sup>−${e0}</sup>, and predictions are useful while the error is below 10<sup>−${e1}</sup>. For how many seconds can it be predicted?</p>`,
        answer, unit: 's', tol: 0.005,
        hint: 'The error grows as δ₀ e<sup>λt</sup>.',
        solution: steps(`10<sup>−${e0}</sup> e<sup>${lam}t</sup> = 10<sup>−${e1}</sup>.`, `t = ${e0 - e1} ln 10 / ${lam} = <b>${answer.toFixed(3)} s</b>.`, 'A thousand times better initial data adds only ln(1000)/λ to this.'),
        lam, e0, e1,
      };
    },
    verify: (p) => Math.log(10 ** (p.e0 - p.e1)) / p.lam,
  },
  // ---- 7.2 to 7.4 experimental methods, 8.2 and 8.3 molecular spectroscopy ----
  'ls-slope-error': {
    title: 'least-squares slope and its standard error',
    make(r) {
      const N = int(r, 4, 7), dx = [0.5, 1, 2][int(r, 0, 2)], s = [0.1, 0.2, 0.3, 0.5][int(r, 0, 3)];
      const x = Array.from({ length: N }, (_, i) => (i + 1) * dx);
      const xm = x.reduce((a, b) => a + b, 0) / N, Sxx = x.reduce((a, b) => a + (b - xm) ** 2, 0);
      const answer = s / Math.sqrt(Sxx);
      return {
        q: `<p>A straight line is fitted by least squares to ${N} points at x = ${x.join(', ')}. Every y value has the same standard error σ = ${s}. Find the standard error of the fitted slope.</p>`,
        answer, unit: '', tol: 0.01,
        hint: 'The slope is a linear combination of the y values, b = Σ(xᵢ − x̄)yᵢ / Σ(xᵢ − x̄)². Propagate σ through it: σ_b = σ/√Σ(xᵢ − x̄)².',
        solution: steps(`x̄ = ${xm.toFixed(3)}.`, `Σ(xᵢ − x̄)² = ${Sxx.toFixed(4)}.`, `σ_b = ${s}/√${Sxx.toFixed(4)} = <b>${answer.toFixed(4)}</b>. The y values themselves never enter: only σ and the spread of x.`),
        x, s,
      };
    },
    verify(p) { const N = p.x.length, Sx = p.x.reduce((a, b) => a + b, 0), Sxx = p.x.reduce((a, b) => a + b * b, 0); return p.s * Math.sqrt(N / (N * Sxx - Sx * Sx)); },
  },
  'propagate-power': {
    title: 'relative uncertainty of a product of powers',
    make(r) {
      const a = int(r, 1, 3), b = int(r, 1, 2), px = int(r, 1, 5) / 2, py = int(r, 1, 6) / 2;
      const answer = Math.sqrt((a * px) ** 2 + (b * py) ** 2);
      return {
        q: `<p>A result is f = x<sup>${a}</sup>/y<sup>${b}</sup>, with independent relative uncertainties ${px}% in x and ${py}% in y. Find the relative uncertainty of f in percent.</p>`,
        answer, unit: '%', tol: 0.01,
        hint: 'For f = xᵃ yᵇ (b may be negative), (σ_f/f)² = (a σ_x/x)² + (b σ_y/y)². Dividing counts the same as multiplying.',
        solution: steps(`Power-weighted terms: ${a} × ${px}% = ${a * px}% and ${b} × ${py}% = ${b * py}%.`, `In quadrature: √(${(a * px) ** 2} + ${(b * py) ** 2}) = <b>${answer.toFixed(3)}%</b>.`),
        a, b, px, py,
      };
    },
    verify(p) { return Math.hypot(p.a * p.px, p.b * p.py); },
  },
  'gm-dead-time': {
    title: 'true count rate from a dead-time-limited counter',
    make(r) {
      const tau = [50, 100, 200, 300][int(r, 0, 3)], m = int(r, 2, 20) * 100;
      const answer = m / (1 - m * tau * 1e-6);
      return {
        q: `<p>A Geiger counter with a non-paralysable dead time of ${tau} μs records ${m} counts per second. Find the true rate in counts per second.</p>`,
        answer, unit: 's⁻¹', tol: 0.005,
        hint: 'After each count the tube is dead for τ, so it is live only for a fraction 1 − mτ of the time. The true rate n satisfies m = n(1 − mτ).',
        solution: steps(`Dead fraction mτ = ${m} × ${tau}×10⁻⁶ = ${(m * tau * 1e-6).toFixed(4)}.`, `n = m/(1 − mτ) = ${m}/${(1 - m * tau * 1e-6).toFixed(4)} = <b>${answer.toFixed(1)} s⁻¹</b>.`),
        tau, m,
      };
    },
    verify(p) { return p.m / (1 - p.m * p.tau * 1e-6); },
  },
  'bridge-output': {
    title: 'strain-gauge bridge output',
    make(r) {
      const arms = [1, 2, 4][int(r, 0, 2)], Vs = [2, 5, 10][int(r, 0, 2)], GF = [2, 2.1][int(r, 0, 1)], eps = int(r, 1, 10) * 100;
      const answer = Vs * GF * eps * 1e-6 * arms / 4 * 1000;
      return {
        q: `<p>A Wheatstone bridge with ${Vs} V supply has ${arms === 1 ? 'one active gauge' : arms === 2 ? 'two active gauges with opposite strains in adjacent arms' : 'four active gauges arranged so that their changes add'} (gauge factor ${GF}, strain magnitude ${eps} microstrain). Find the output voltage in mV (small-signal approximation).</p>`,
        answer, unit: 'mV', tol: 0.01,
        hint: 'Each active arm contributes V_s·GF·ε/4 when the strains are arranged to add.',
        solution: steps(`ΔR/R = GF·ε = ${GF} × ${eps}×10⁻⁶ = ${(GF * eps * 1e-6).toExponential(2)}.`, `V_out = ${arms}/4 × V_s × ΔR/R = ${arms}/4 × ${Vs} × ${(GF * eps * 1e-6).toExponential(2)} V = <b>${answer.toFixed(3)} mV</b>.`),
        arms, Vs, GF, eps,
      };
    },
    verify(p) { return p.arms * p.Vs * p.GF * p.eps * 1e-6 / 4 * 1000; },
  },
  'johnson-noise': {
    title: 'Johnson noise of a resistor',
    make(r) {
      const R = [1e3, 1e4, 1e5, 1e6][int(r, 0, 3)], T = [77, 300][int(r, 0, 1)], B = [100, 1e3, 1e4][int(r, 0, 2)];
      const answer = Math.sqrt(4 * 1.380649e-23 * T * R * B) * 1e6;
      return {
        q: `<p>Find the rms Johnson noise voltage, in μV, of a ${R >= 1e6 ? R / 1e6 + ' MΩ' : R / 1e3 + ' kΩ'} resistor at ${T} K measured in a ${B} Hz bandwidth. (k_B = 1.381×10⁻²³ J/K.)</p>`,
        answer, unit: 'μV', tol: 0.01,
        hint: 'v_rms = √(4 k_B T R B). Every factor enters under the square root.',
        solution: steps(`4 k_B T R B = 4 × 1.381×10⁻²³ × ${T} × ${R} × ${B} = ${(4 * 1.380649e-23 * T * R * B).toExponential(3)} V².`, `v_rms = <b>${answer.toFixed(3)} μV</b>.`),
        R, T, B,
      };
    },
    verify(p) { return Math.sqrt(4 * 1.380649e-23 * p.T * p.R * p.B) * 1e6; },
  },
  'lockin-snr': {
    title: 'signal-to-noise ratio after a lock-in',
    make(r) {
      const sig = int(r, 1, 10), dens = int(r, 1, 20) * 5, tau = [0.1, 0.3, 1, 3, 10][int(r, 0, 4)];
      const B = 1 / (4 * tau), noise = dens * Math.sqrt(B), answer = sig * 1000 / noise;
      return {
        q: `<p>A ${sig} μV signal at the reference frequency sits in white noise of ${dens} nV/√Hz. The lock-in has a single-pole output filter with time constant ${tau} s. Find the signal-to-noise ratio of the output.</p>`,
        answer, unit: '', tol: 0.01,
        hint: 'A single RC section of time constant τ has noise-equivalent bandwidth 1/(4τ). Output noise = density × √bandwidth.',
        solution: steps(`ENBW = 1/(4 × ${tau}) = ${B.toFixed(4)} Hz.`, `Noise = ${dens} nV/√Hz × √${B.toFixed(4)} = ${noise.toFixed(3)} nV.`, `SNR = ${sig * 1000} nV / ${noise.toFixed(3)} nV = <b>${answer.toFixed(1)}</b>.`),
        sig, dens, tau,
      };
    },
    verify(p) { return p.sig * 1000 / (p.dens * Math.sqrt(1 / (4 * p.tau))); },
  },
  'nmr-pulse': {
    title: 'length of a 90° or 180° pulse',
    make(r) {
      const nuc = [['¹H', 42.577], ['¹³C', 10.708], ['¹⁹F', 40.078], ['³¹P', 17.235]][int(r, 0, 3)], th = [90, 180][int(r, 0, 1)], B1 = [0.1, 0.2, 0.5, 1, 2][int(r, 0, 4)];
      const answer = (th / 360) / (nuc[1] * 1e6 * B1 * 1e-3) * 1e6;
      return {
        q: `<p>An on-resonance RF field of amplitude B₁ = ${B1} mT (rotating frame) acts on ${nuc[0]} nuclei (γ/2π = ${nuc[1]} MHz/T). How long, in μs, is a ${th}° pulse?</p>`,
        answer, unit: 'μs', tol: 0.01,
        hint: 'In the rotating frame the magnetisation turns about B₁ at frequency (γ/2π)B₁ turns per second. A 90° pulse is a quarter turn.',
        solution: steps(`Nutation frequency (γ/2π)B₁ = ${nuc[1]}×10⁶ × ${B1}×10⁻³ = ${(nuc[1] * B1 * 1e3).toFixed(1)} Hz.`, `One full turn takes ${(1e6 / (nuc[1] * B1 * 1e3)).toFixed(3)} μs; ${th}° is ${th / 360} of it: <b>${answer.toFixed(3)} μs</b>.`),
        g: nuc[1], th, B1,
      };
    },
    verify(p) { return (p.th * Math.PI / 180) / (2 * Math.PI * p.g * 1e6 * p.B1 * 1e-3) * 1e6; },
  },
  'esr-lines': {
    title: 'number of ESR hyperfine lines',
    make(r) {
      const n1 = int(r, 1, 4), n2 = int(r, 0, 2), I2 = [1, 0.5][int(r, 0, 1)];
      const answer = (n1 + 1) * (2 * n2 * I2 + 1);
      return {
        q: `<p>An unpaired electron couples to ${n1} equivalent proton${n1 > 1 ? 's' : ''}${n2 ? ` and to ${n2} equivalent ${I2 === 1 ? '¹⁴N (I = 1)' : '¹⁹F (I = 1/2)'} nucle${n2 > 1 ? 'i' : 'us'}, with a different coupling constant` : ''}. How many ESR lines appear (none overlapping)?</p>`,
        answer, unit: '', tol: 0, abs: 0.01,
        hint: 'A set of n equivalent nuclei of spin I splits each line into 2nI + 1. Different sets multiply.',
        solution: steps(`Protons: 2 × ${n1} × ½ + 1 = ${n1 + 1}.`, n2 ? `Second set: 2 × ${n2} × ${I2 === 1 ? 1 : '½'} + 1 = ${2 * n2 * I2 + 1}.` : 'No second set.', `Total <b>${answer}</b> lines.`),
        n1, n2, I2,
      };
    },
    verify(p) { return (2 * p.n1 * 0.5 + 1) * (2 * p.n2 * p.I2 + 1); },
  },
  'fc-poisson': {
    title: 'Franck-Condon factor for displaced oscillators',
    make(r) {
      const S = int(r, 2, 30) / 10, v = int(r, 0, 4);
      let f = 1; for (let k = 2; k <= v; k++) f *= k;
      const answer = Math.exp(-S) * S ** v / f;
      return {
        q: `<p>Two electronic states have harmonic potentials of equal frequency, displaced so that the Huang-Rhys factor is S = ${S}. What fraction of the absorption from v″ = 0 goes into the ${v} ← 0 band?</p>`,
        answer, unit: '', tol: 0.01,
        hint: "For equal frequencies, |⟨v′|0⟩|² = e^(−S) S^v′ / v′!: a Poisson distribution with mean S.",
        solution: steps(`e^(−${S}) = ${Math.exp(-S).toFixed(4)}.`, `S^${v}/${v}! = ${(S ** v).toFixed(4)}/${f} = ${(S ** v / f).toFixed(4)}.`, `Product: <b>${answer.toFixed(4)}</b>.`),
        S, v,
      };
    },
    verify(p) { let f = 1; for (let k = 2; k <= p.v; k++) f *= k; return Math.exp(-p.S) * p.S ** p.v / f; },
  },
  'vibronic-band': {
    title: 'position of a vibronic band',
    make(r) {
      const Te = int(r, 150, 300) * 100, w1 = int(r, 50, 150) * 10, x1 = int(r, 3, 15), w2 = int(r, 100, 250) * 10, x2 = int(r, 5, 20), v1 = int(r, 0, 3), v2 = int(r, 0, 1);
      const G = (w, x, v) => w * (v + 0.5) - x * (v + 0.5) ** 2;
      const answer = Te + G(w1, x1, v1) - G(w2, x2, v2);
      return {
        q: `<p>An upper state has T_e = ${Te} cm⁻¹, ω′ = ${w1} cm⁻¹, ω′x′ = ${x1} cm⁻¹; the ground state has ω″ = ${w2} cm⁻¹, ω″x″ = ${x2} cm⁻¹. Find the wavenumber of the ${v1} ← ${v2} band in cm⁻¹.</p>`,
        answer, unit: 'cm⁻¹', tol: 0.0001, abs: 0.5,
        hint: 'ν = T_e + G′(v′) − G″(v″), with G(v) = ω(v + ½) − ωx(v + ½)², each measured from its own potential minimum.',
        solution: steps(`G′(${v1}) = ${w1}×${v1 + 0.5} − ${x1}×${(v1 + 0.5) ** 2} = ${G(w1, x1, v1)}.`, `G″(${v2}) = ${w2}×${v2 + 0.5} − ${x2}×${(v2 + 0.5) ** 2} = ${G(w2, x2, v2)}.`, `ν = ${Te} + ${G(w1, x1, v1)} − ${G(w2, x2, v2)} = <b>${answer.toFixed(2)} cm⁻¹</b>.`),
        Te, w1, x1, w2, x2, v1, v2,
      };
    },
    verify(p) { const G = (w, x, v) => w * (v + 0.5) - x * (v + 0.5) ** 2; return p.Te + G(p.w1, p.x1, p.v1) - G(p.w2, p.x2, p.v2); },
  },
  // ---- 4.2, 4.3 electromagnetic theory ----
  'larmor-power': {
    title: 'Larmor power of an electron circling in a magnetic field',
    make(r) {
      const B = [0.5, 1, 1.5, 2, 3, 5][int(r, 0, 5)], v7 = int(r, 1, 3);
      const e = 1.602176634e-19, me = 9.1093837e-31, eps0 = 8.8541878128e-12, c = 2.99792458e8;
      const v = v7 * 1e7, a = e * B * v / me, P = e * e * a * a / (6 * Math.PI * eps0 * c ** 3), answer = P / e;
      return {
        q: `<p>An electron moves at ${v7} × 10⁷ m/s on a circle perpendicular to a uniform field B = ${B} T. Using the non-relativistic Larmor formula, find the power it radiates, in eV per second.</p>`,
        answer, unit: 'eV/s', tol: 0.01,
        hint: 'The acceleration is centripetal, a = v²/r with r = mv/eB, so a = eBv/m. Then P = e²a²/(6πε₀c³).',
        solution: steps(`a = eBv/m = 1.7588 × 10¹¹ × ${B} × ${v.toExponential(1)} = ${a.toExponential(3)} m/s².`, `P = e²a²/(6πε₀c³) = 5.71 × 10⁻⁵⁴ × a² = ${P.toExponential(3)} W.`, `Divide by e = 1.602 × 10⁻¹⁹ J/eV: P = <b>${answer.toFixed(1)} eV/s</b>. The kinetic energy is ${(0.5 * me * v * v / e).toFixed(0)} eV, so the energy decays on a time scale KE/P = ${(0.5 * me * v * v / P).toPrecision(2)} s (in general 3πε₀m³c³/e⁴B² ≈ 2.6/B² s, whatever the speed).`),
        B, v,
      };
    },
    verify(p) {
      const e = 1.602176634e-19, k = 8.9875517923e9, c = 2.99792458e8, a = (e / 9.1093837e-31) * p.B * p.v;
      return (2 / 3) * k * e * a * a / c ** 3;
    },
  },
  'plasma-cutoff': {
    title: 'cutoff and group velocity of a radio wave in a plasma',
    make(r) {
      const n11 = int(r, 2, 30), n = n11 * 1e11;
      const e = 1.602176634e-19, me = 9.1093837e-31, eps0 = 8.8541878128e-12;
      const fp = Math.sqrt(n * e * e / (eps0 * me)) / (2 * Math.PI) / 1e6;
      const f = Math.ceil(fp) + int(r, 1, 6), answer = Math.sqrt(1 - (fp / f) ** 2);
      return {
        q: `<p>A layer of the ionosphere has electron density ${n11} × 10¹¹ m⁻³. A pulse at ${f} MHz crosses it. Find the group velocity of the pulse in the layer, as a fraction of c (ignore collisions and the Earth's field).</p>`,
        answer, unit: 'c', tol: 0.005,
        hint: 'Plasma frequency f<sub>p</sub> = (1/2π)√(ne²/ε₀m), about 8.98√n Hz with n in m⁻³. From ω² = ω<sub>p</sub>² + c²k², v<sub>g</sub> = dω/dk = c√(1 − ω<sub>p</sub>²/ω²).',
        solution: steps(`f<sub>p</sub> = 8.98 × √(${n.toExponential(1)}) Hz = ${fp.toFixed(3)} MHz, below ${f} MHz, so the wave gets through.`, `(f<sub>p</sub>/f)² = ${((fp / f) ** 2).toFixed(4)}.`, `v<sub>g</sub>/c = √(1 − ${((fp / f) ** 2).toFixed(4)}) = <b>${answer.toFixed(4)}</b>. The phase velocity is c²/v<sub>g</sub>, faster than light, and v<sub>p</sub>v<sub>g</sub> = c².`),
        n, f,
      };
    },
    verify(p) {
      const wp2 = p.n * 3182.6, w = 2 * Math.PI * p.f * 1e6; // e²/(ε₀m) = 3182.6 m³ s⁻²
      return Math.sqrt(1 - wp2 / (w * w));
    },
  },
  // ---- 5.2, 5.3 quantum mechanics ----
  'partial-wave-sigma': {
    title: 'total cross-section from s- and p-wave phase shifts',
    make(r) {
      const k = [0.2, 0.3, 0.4, 0.5, 0.8][int(r, 0, 4)], d0 = int(r, 10, 80), d1 = int(r, 2, 30);
      const s0 = Math.sin(d0 * Math.PI / 180) ** 2, s1 = Math.sin(d1 * Math.PI / 180) ** 2;
      const answer = (4 * Math.PI / (k * k)) * (s0 + 3 * s1);
      return {
        q: `<p>Neutrons scatter off a nucleus at wave number k = ${k} fm⁻¹. Only two partial waves matter: δ₀ = ${d0}° and δ₁ = ${d1}°. Find the total elastic cross-section in fm² (1 fm² = 10 mb).</p>`,
        answer, unit: 'fm²', tol: 0.01,
        hint: 'σ = (4π/k²) Σ (2l + 1) sin²δ<sub>l</sub>. The p wave carries weight 3.',
        solution: steps(`4π/k² = ${(4 * Math.PI / (k * k)).toFixed(2)} fm².`, `sin²δ₀ = ${s0.toFixed(4)}, 3 sin²δ₁ = ${(3 * s1).toFixed(4)}.`, `σ = ${(4 * Math.PI / (k * k)).toFixed(2)} × ${(s0 + 3 * s1).toFixed(4)} = <b>${answer.toFixed(1)} fm²</b> = ${(answer / 100).toFixed(3)} b. Unitarity caps the s-wave part at 4π/k².`),
        k, d0, d1,
      };
    },
    verify(p) {
      const t = (x) => (1 - Math.cos(2 * x * Math.PI / 180)) / 2;
      return 4 * Math.PI / (p.k * p.k) * (t(p.d0) + 3 * t(p.d1));
    },
  },
  'dirac-binding': {
    title: 'exact Dirac fine-structure splitting of the n = 2 level',
    make(r) {
      const Z = [5, 10, 20, 26, 30, 40, 50, 60, 70, 80, 92][int(r, 0, 10)], a = 1 / 137.035999, mc2 = 510998.95;
      const E = (n, j) => { const k = j + 0.5, za = Z * a; return mc2 / Math.sqrt(1 + (za / (n - k + Math.sqrt(k * k - za * za))) ** 2); };
      const answer = E(2, 1.5) - E(2, 0.5), lead = mc2 * (Z * a) ** 4 / 32;
      return {
        q: `<p>For a hydrogen-like ion with Z = ${Z} (point nucleus, no Lamb shift, no recoil), use the exact Dirac energy formula to find the splitting E(2p<sub>3/2</sub>) − E(2p<sub>1/2</sub>) in eV.</p>`,
        answer, unit: 'eV', tol: 0.01,
        hint: 'E<sub>nj</sub> = mc² [1 + (Zα/(n − δ))²]<sup>−1/2</sup> with δ = j + ½ − √((j + ½)² − Z²α²). The leading term of the splitting is mc²(Zα)⁴/32, but at large Z the exact result is larger.',
        solution: steps(`Zα = ${(Z * a).toFixed(5)}. For j = 1/2: δ = 1 − √(1 − Z²α²) = ${(1 - Math.sqrt(1 - (Z * a) ** 2)).toFixed(6)}; for j = 3/2: δ = 2 − √(4 − Z²α²) = ${(2 - Math.sqrt(4 - (Z * a) ** 2)).toFixed(6)}.`, `E(2p<sub>1/2</sub>) = ${E(2, 0.5).toFixed(3)} eV and E(2p<sub>3/2</sub>) = ${E(2, 1.5).toFixed(3)} eV (rest energy included).`, `Splitting = <b>${answer.toPrecision(4)} eV</b>. The leading-order estimate mc²(Zα)⁴/32 gives ${lead.toPrecision(4)} eV.`),
        Z,
      };
    },
    verify(p) {
      const a = 1 / 137.035999, za = p.Z * a, mc2 = 510998.95;
      const E = (j) => { const d = j + 0.5 - Math.sqrt((j + 0.5) ** 2 - za * za); return mc2 * (1 + (za / (2 - d)) ** 2) ** -0.5; };
      return E(1.5) - E(0.5);
    },
  },
  // ---- 6.2 to 6.4 statistical physics ----
  'stokes-einstein-rms': {
    title: 'rms Brownian displacement from the Stokes-Einstein relation',
    make(r) {
      const a = [0.25, 0.5, 1, 2][int(r, 0, 3)], T = [293, 298, 310][int(r, 0, 2)], eta = { 293: 1.0, 298: 0.89, 310: 0.69 }[T], t = [1, 5, 10, 30, 60][int(r, 0, 4)];
      const kB = 1.380649e-23, D = kB * T / (6 * Math.PI * eta * 1e-3 * a * 1e-6), answer = Math.sqrt(2 * D * t) * 1e6;
      return {
        q: `<p>A sphere of radius ${a} μm drifts in water at ${T} K (viscosity ${eta} mPa s). Find the rms displacement along one axis after ${t} s, in μm.</p>`,
        answer, unit: 'μm', tol: 0.01,
        hint: 'D = k<sub>B</sub>T/(6πηa) (Stokes-Einstein), and along one axis ⟨x²⟩ = 2Dt.',
        solution: steps(`D = 1.381 × 10⁻²³ × ${T} / (6π × ${eta} × 10⁻³ × ${a} × 10⁻⁶) = ${D.toExponential(3)} m²/s.`, `⟨x²⟩ = 2Dt = ${(2 * D * t).toExponential(3)} m².`, `x<sub>rms</sub> = <b>${answer.toFixed(2)} μm</b>. In three dimensions the rms distance is √3 times larger.`),
        a, T, eta, t,
      };
    },
    verify(p) {
      const R = 8.314462618, NA = 6.02214076e23;
      return 1e6 * Math.sqrt(R * p.T * p.t / (3 * Math.PI * NA * p.eta * 1e-3 * p.a * 1e-6));
    },
  },
  'ising-ring': {
    title: 'nearest-neighbour correlation on a short Ising ring',
    make(r) {
      const N = int(r, 3, 8), K = [0.2, 0.4, 0.5, 0.75, 1, 1.5][int(r, 0, 5)], t = Math.tanh(K);
      const answer = (t + t ** (N - 1)) / (1 + t ** N);
      return {
        q: `<p>N = ${N} Ising spins sit on a ring (periodic boundary) with energy E = −J Σ s<sub>i</sub>s<sub>i+1</sub>, no field, and K = J/k<sub>B</sub>T = ${K}. Find the nearest-neighbour correlation ⟨s<sub>i</sub>s<sub>i+1</sub>⟩.</p>`,
        answer, unit: '', tol: 0.005,
        hint: 'The transfer matrix has eigenvalues 2cosh K and 2sinh K, so Z = (2cosh K)<sup>N</sup> + (2sinh K)<sup>N</sup>. Then ⟨s<sub>i</sub>s<sub>i+1</sub>⟩ = (1/N) ∂ ln Z/∂K.',
        solution: steps(`Z = (2cosh K)<sup>${N}</sup> + (2sinh K)<sup>${N}</sup>; with t = tanh K = ${t.toFixed(4)}, (1/N)∂ ln Z/∂K = (t + t<sup>N−1</sup>)/(1 + t<sup>N</sup>).`, `t<sup>${N - 1}</sup> = ${(t ** (N - 1)).toFixed(4)}, t<sup>${N}</sup> = ${(t ** N).toFixed(4)}.`, `⟨s<sub>i</sub>s<sub>i+1</sub>⟩ = <b>${answer.toFixed(4)}</b>, slightly above the infinite-chain value tanh K = ${t.toFixed(4)}: closing the ring gives a second path that correlates neighbours.`),
        N, K,
      };
    },
    verify(p) {
      let Z = 0, S = 0;
      for (let m = 0; m < 1 << p.N; m++) {
        const s = (i) => ((m >> (i % p.N)) & 1 ? 1 : -1);
        let b = 0; for (let i = 0; i < p.N; i++) b += s(i) * s(i + 1);
        const w = Math.exp(p.K * b); Z += w; S += w * b;
      }
      return S / Z / p.N;
    },
  },
  'gas-viscosity': {
    title: 'Chapman-Enskog viscosity of a hard-sphere gas',
    make(r) {
      const g = [['helium', 4.0026, 0.218], ['neon', 20.18, 0.259], ['argon', 39.95, 0.364], ['nitrogen', 28.01, 0.375], ['carbon dioxide', 44.01, 0.459]][int(r, 0, 4)];
      const T = [200, 250, 300, 400, 500, 600][int(r, 0, 5)], kB = 1.380649e-23, m = g[1] * 1.66053907e-27, d = g[2] * 1e-9;
      const answer = 1e6 * (5 / 16) * Math.sqrt(Math.PI * m * kB * T) / (Math.PI * d * d);
      return {
        q: `<p>Treat ${g[0]} (molar mass ${g[1]} g/mol) as hard spheres of diameter ${g[2]} nm. Using the Chapman-Enskog result for hard spheres, find its viscosity at ${T} K in μPa s.</p>`,
        answer, unit: 'μPa s', tol: 0.01,
        hint: 'η = (5/16) √(πmk<sub>B</sub>T) / (πd²). It does not depend on pressure, and grows as √T.',
        solution: steps(`m = ${g[1]} × 1.6605 × 10⁻²⁷ kg = ${m.toExponential(3)} kg; πd² = ${(Math.PI * d * d).toExponential(3)} m².`, `√(πmk<sub>B</sub>T) = ${Math.sqrt(Math.PI * m * kB * T).toExponential(3)} kg m/s.`, `η = (5/16) × that / πd² = <b>${answer.toFixed(1)} μPa s</b>. The elementary mean-free-path estimate ⅓nm v̄λ comes out about 1.5 times too small.`),
        M: g[1], d: g[2], T,
      };
    },
    verify(p) {
      const m = p.M * 1e-3 / 6.02214076e23, d = p.d * 1e-9;
      return 1e6 * (5 / 16) * Math.sqrt(m * 1.380649e-23 * p.T / Math.PI) / (d * d);
    },
  },
  // ---- 9.2 to 9.4 solid state (CSIR NET) ----
  'vacancy-ppm': {
    title: 'equilibrium vacancy fraction from the formation energy',
    make(r) {
      const E = int(r, 8, 14) / 10, T = int(r, 18, 26) * 50;
      const x = Math.exp(-E / (KB * T)), answer = 1e6 * x;
      return {
        q: `<p>The vacancy formation energy in a metal is E<sub>v</sub> = ${E} eV. Ignoring the formation entropy, find the equilibrium fraction of vacant lattice sites at T = ${T} K, in parts per million.</p>`,
        answer, unit: 'ppm', tol: 0.01,
        hint: 'Minimising F = nE<sub>v</sub> − TS with S = k ln[N!/(n!(N−n)!)] gives n/N ≈ exp(−E<sub>v</sub>/kT) when n ≪ N.',
        solution: steps(`kT = 8.617×10⁻⁵ × ${T} = ${(KB * T).toFixed(5)} eV.`, `E<sub>v</sub>/kT = ${(E / (KB * T)).toFixed(3)}.`, `n/N = exp(−${(E / (KB * T)).toFixed(3)}) = ${x.toExponential(3)} = <b>${answer.toPrecision(3)} ppm</b>.`),
        E, T,
      };
    },
    verify(p) { return 1e6 * 10 ** (-p.E / (KB * p.T) / Math.LN10); },
  },
  'taylor-density': {
    title: 'dislocation density from the Taylor hardening law',
    make(r) {
      const G = int(r, 25, 80), b = int(r, 25, 29) / 100, al = [0.2, 0.3, 0.4, 0.5][int(r, 0, 3)], tau = int(r, 10, 60);
      const rho = (tau * 1e6 / (al * G * 1e9 * b * 1e-9)) ** 2, answer = rho / 1e12;
      return {
        q: `<p>A cold-worked metal has shear modulus G = ${G} GPa and Burgers vector b = ${b} nm. Its flow stress follows Taylor's law τ = αGb√ρ with α = ${al}. If the measured shear flow stress is τ = ${tau} MPa, find the dislocation density ρ in units of 10¹² m⁻².</p>`,
        answer, unit: '10¹² m⁻²', tol: 0.01,
        hint: 'Invert the law: ρ = (τ/αGb)². Keep every quantity in SI units (Pa and m).',
        solution: steps(`αGb = ${al} × ${G}×10⁹ Pa × ${b}×10⁻⁹ m = ${(al * G * b).toFixed(3)} Pa·m.`, `√ρ = τ/(αGb) = ${tau}×10⁶ / ${(al * G * b).toFixed(3)} = ${(tau * 1e6 / (al * G * b)).toExponential(3)} m⁻¹.`, `ρ = ${rho.toExponential(3)} m⁻² = <b>${answer.toPrecision(3)} × 10¹² m⁻²</b>.`),
        G, b, al, tau,
      };
    },
    verify(p) { return Math.exp(2 * (Math.log(p.tau * 1e6) - Math.log(p.al * p.G * 1e9 * p.b * 1e-9))) / 1e12; },
  },
  'clausius-polarisability': {
    title: 'molecular polarisability from the Clausius-Mossotti relation',
    make(r) {
      const er = int(r, 105, 300) / 100, N = int(r, 15, 60) / 10;
      const ratio = (er - 1) / (er + 2), alpha = 3 * EPS0 * ratio / (N * 1e28), answer = alpha / 1e-40;
      return {
        q: `<p>A non-polar solid has N = ${N} × 10²⁸ molecules per m³ and relative permittivity ε<sub>r</sub> = ${er}. Using the Lorentz local field, find the molecular polarisability α in units of 10⁻⁴⁰ F m².</p>`,
        answer, unit: '10⁻⁴⁰ F m²', tol: 0.01,
        hint: 'Clausius-Mossotti: (ε<sub>r</sub> − 1)/(ε<sub>r</sub> + 2) = Nα/3ε₀.',
        solution: steps(`(ε<sub>r</sub> − 1)/(ε<sub>r</sub> + 2) = ${(er - 1).toFixed(2)}/${(er + 2).toFixed(2)} = ${ratio.toFixed(4)}.`, `α = 3ε₀ × ${ratio.toFixed(4)} / N = 3 × 8.854×10⁻¹² × ${ratio.toFixed(4)} / ${N}×10²⁸.`, `α = <b>${answer.toPrecision(3)} × 10⁻⁴⁰ F m²</b>.`),
        er, N,
      };
    },
    verify(p) { const x = p.N * 1e28 * 1e-40 / (3 * EPS0); /* x·a = (er-1)/(er+2) */ return (p.er - 1) / ((p.er + 2) * x); },
  },
  'drude-reflect': {
    title: 'plasma wavelength of a free-electron metal',
    make(r) {
      const n = int(r, 8, 60) / 10;
      const wp = Math.sqrt(n * 1e28 * QE * QE / (EPS0 * ME)), answer = 2 * Math.PI * CL / wp * 1e9;
      return {
        q: `<p>A metal has n = ${n} × 10²⁸ free electrons per m³ (take the free-electron mass and neglect damping and core polarisation). Below what wavelength, in nm, does it become transparent?</p>`,
        answer, unit: 'nm', tol: 0.01,
        hint: 'ε(ω) = 1 − ω<sub>p</sub>²/ω² with ω<sub>p</sub>² = ne²/ε₀m. Waves propagate when ε > 0, that is ω > ω<sub>p</sub>, so λ < λ<sub>p</sub> = 2πc/ω<sub>p</sub>.',
        solution: steps(`ω<sub>p</sub> = √(ne²/ε₀m) = ${wp.toExponential(3)} rad/s (ħω<sub>p</sub> = ${(HBAR * wp / QE).toFixed(2)} eV).`, `λ<sub>p</sub> = 2πc/ω<sub>p</sub> = <b>${answer.toPrecision(3)} nm</b>.`, 'Shorter wavelengths (higher frequencies) pass through: the ultraviolet transparency of the alkali metals.'),
        n,
      };
    },
    verify(p) { return 2 * Math.PI * CL * Math.sqrt(EPS0 * ME / (p.n * 1e28)) / QE * 1e9; },
  },
  'hall-plateau-field': {
    title: 'magnetic field at the centre of a quantum Hall plateau',
    make(r) {
      const n = int(r, 10, 60) / 10, nu = int(r, 1, 6);
      const answer = n * 1e15 * HPL / (QE * nu);
      return {
        q: `<p>A two-dimensional electron gas has sheet density n = ${n} × 10¹⁵ m⁻². At what magnetic field, in tesla, is the filling factor exactly ν = ${nu}? What is the Hall resistance there?</p>`,
        answer, unit: 'T', tol: 0.01,
        hint: 'Each (spin-resolved) Landau level holds eB/h states per unit area, so ν = nh/(eB).',
        solution: steps(`eB/h per level; ν = nh/(eB) gives B = nh/(eν).`, `B = ${n}×10¹⁵ × 6.626×10⁻³⁴ / (1.602×10⁻¹⁹ × ${nu}) = <b>${answer.toPrecision(3)} T</b>.`, `There R<sub>xy</sub> = h/(νe²) = 25 812.8/${nu} = ${(25812.807 / nu).toFixed(1)} Ω.`),
        n, nu,
      };
    },
    verify(p) { return (p.n * 1e15 / p.nu) / (QE / HPL); },
  },
  'well-subbands': {
    title: 'subband spacing in a quantum well',
    make(r) {
      const L = int(r, 5, 20), m = [0.067, 0.023, 0.19][int(r, 0, 2)], name = { 0.067: 'GaAs', 0.023: 'InAs', 0.19: 'Si (along the confinement)' }[m];
      const E1 = (Math.PI * HBAR / (L * 1e-9)) ** 2 / (2 * m * ME) / QE * 1000, answer = 3 * E1;
      return {
        q: `<p>Electrons in a ${L} nm wide ${name} quantum well have effective mass m* = ${m} m<sub>e</sub>. Treating the well as infinitely deep, find the energy gap between the first two subbands, E₂ − E₁, in meV.</p>`,
        answer, unit: 'meV', tol: 0.01,
        hint: 'E<sub>n</sub> = n²π²ħ²/(2m*L²), so E₂ − E₁ = 3E₁.',
        solution: steps(`E₁ = π²ħ²/(2m*L²) = ${E1.toFixed(2)} meV (π²ħ²/2m<sub>e</sub> = 0.376 eV nm², divided by ${m} × ${L}²).`, `E₂ − E₁ = 3E₁ = <b>${answer.toPrecision(3)} meV</b>.`, 'If this is much larger than kT, only the lowest subband is filled and the electrons move in two dimensions.'),
        L, m,
      };
    },
    verify(p) { return 3 * HPL * HPL / (8 * p.m * ME * (p.L * 1e-9) ** 2) / QE * 1000; },
  },
  // ---- 10.2 to 10.4 nuclear and particle (CSIR NET) ----
  'deuteron-depth': {
    title: 'square-well depth that binds the deuteron',
    make(r) {
      const R = int(r, 15, 28) / 10, B = [2.2246, 2.2246, 1.5, 3.0][int(r, 0, 3)];
      const s = wellDepth(R, B), answer = s.V0;
      return {
        q: `<p>Model the neutron-proton force as an attractive square well of range R = ${R} fm. What depth V₀, in MeV, gives a single S-wave bound state at E = −${B} MeV? (ħc = 197.33 MeV fm, reduced mass μc² = 469.46 MeV.)</p>`,
        answer, unit: 'MeV', tol: 0.01,
        hint: 'Inside u = sin kr with k = √(2μ(V₀ − B))/ħ; outside u ∝ e<sup>−κr</sup> with κ = √(2μB)/ħ. Matching u′/u at R gives k cot kR = −κ, with kR a little above π/2. Solve it numerically.',
        solution: steps(`κ = √(2 × 469.46 × ${B})/197.33 = ${s.ka.toFixed(4)} fm⁻¹.`, `Solve k cot(k × ${R}) = −${s.ka.toFixed(4)}: k = ${s.k.toFixed(4)} fm⁻¹, kR = ${(s.k * R).toFixed(4)} (just above π/2).`, `V₀ = (ħck)²/(2μc²) + B = ${((HC * s.k) ** 2 / (2 * MUNP)).toFixed(2)} + ${B} = <b>${answer.toFixed(2)} MeV</b>.`),
        R, B,
      };
    },
    verify(p) {
      // Newton on x = kR for x cot x = -kappa R, then depth
      const ka = Math.sqrt(2 * MUNP * p.B) / HC, c = ka * p.R; let x = Math.PI / 2 + 0.3;
      for (let i = 0; i < 60; i++) { const f = x / Math.tan(x) + c, d = 1 / Math.tan(x) - x / Math.sin(x) ** 2; x -= f / d; }
      return (HC * x / p.R) ** 2 / (2 * MUNP) + p.B;
    },
  },
  'np-scattering-length': {
    title: 'low-energy neutron-proton cross section from the scattering lengths',
    make(r) {
      const at = int(r, 530, 550) / 100, as = -int(r, 2300, 2400) / 100;
      const sig = Math.PI * (3 * at * at + as * as) / 100, answer = sig;
      return {
        q: `<p>The triplet and singlet neutron-proton scattering lengths are a<sub>t</sub> = ${at} fm and a<sub>s</sub> = ${as} fm. Find the zero-energy np cross section for unpolarised beams, in barns.</p>`,
        answer, unit: 'b', tol: 0.01,
        hint: 'At zero energy σ = 4πa² for each spin channel. Unpolarised: 3/4 of pairs are triplet, 1/4 singlet.',
        solution: steps(`σ = 4π[(3/4)a<sub>t</sub>² + (1/4)a<sub>s</sub>²] = π(3a<sub>t</sub>² + a<sub>s</sub>²).`, `= π(3 × ${(at * at).toFixed(3)} + ${(as * as).toFixed(2)}) fm² = ${(sig * 100).toFixed(1)} fm².`, `1 b = 100 fm², so σ = <b>${answer.toFixed(2)} b</b>: far above 4πa<sub>t</sub>² = ${(4 * Math.PI * at * at / 100).toFixed(2)} b, proof that the singlet state has a large (virtual) scattering length.`),
        at, as,
      };
    },
    verify(p) { return 4 * Math.PI * (0.75 * p.at ** 2 + 0.25 * p.as ** 2) / 100; },
  },
  'rotor-gamma-ladder': {
    title: 'gamma-ray energy in a ground-state rotational band',
    make(r) {
      const E2 = int(r, 40, 110), I = 2 * int(r, 2, 6);
      const A = E2 / 6, answer = A * (4 * I - 2);
      return {
        q: `<p>An even-even deformed nucleus has its first 2⁺ state at ${E2} keV. Treating its ground band as a rigid rotor, find the energy of the E2 gamma ray from the ${I}⁺ level to the ${I - 2}⁺ level, in keV.</p>`,
        answer, unit: 'keV', tol: 0.005,
        hint: 'E(I) = (ħ²/2𝓘) I(I+1), so E(2⁺) = 6ħ²/2𝓘. The I → I − 2 gamma ray has energy (ħ²/2𝓘)(4I − 2).',
        solution: steps(`ħ²/2𝓘 = ${E2}/6 = ${A.toFixed(3)} keV.`, `E(${I}) − E(${I - 2}) = ${A.toFixed(3)} × [${I * (I + 1)} − ${(I - 2) * (I - 1)}] = ${A.toFixed(3)} × ${4 * I - 2}.`, `E<sub>γ</sub> = <b>${answer.toFixed(1)} keV</b>.`),
        E2, I,
      };
    },
    verify(p) { const A = p.E2 / 6; return A * p.I * (p.I + 1) - A * (p.I - 2) * (p.I - 1); },
  },
  'spectroscopic-q': {
    title: 'spectroscopic quadrupole moment from the intrinsic moment',
    make(r) {
      const I = [1.5, 2.5, 3.5, 4.5][int(r, 0, 3)], Q0 = int(r, 20, 90) / 10;
      const answer = Q0 * (3 * I * I - I * (I + 1)) / ((I + 1) * (2 * I + 3));
      return {
        q: `<p>An odd-A deformed nucleus has intrinsic quadrupole moment Q₀ = ${Q0} b. Its ground state is the band head with I = K = ${I * 2}/2. Find the spectroscopic quadrupole moment Q measured in the lab, in barns.</p>`,
        answer, unit: 'b', tol: 0.005,
        hint: 'Q = Q₀ [3K² − I(I+1)] / [(I+1)(2I+3)]. With I = K this is Q₀ I(2I − 1)/[(I+1)(2I+3)].',
        solution: steps(`3K² − I(I+1) = ${(3 * I * I).toFixed(2)} − ${(I * (I + 1)).toFixed(2)} = ${(3 * I * I - I * (I + 1)).toFixed(2)}.`, `(I+1)(2I+3) = ${(I + 1).toFixed(1)} × ${2 * I + 3} = ${((I + 1) * (2 * I + 3)).toFixed(2)}.`, `Q = ${Q0} × ${(3 * I * I - I * (I + 1)).toFixed(2)}/${((I + 1) * (2 * I + 3)).toFixed(2)} = <b>${answer.toFixed(3)} b</b>, smaller than Q₀ because the rotation averages the shape.`),
        I, Q0,
      };
    },
    verify(p) { return p.Q0 * p.I * (2 * p.I - 1) / ((p.I + 1) * (2 * p.I + 3)); },
  },
  'gmo-predict': {
    title: 'Gell-Mann–Okubo prediction of the Λ mass',
    make(r) {
      const N = 939 + int(r, -3, 3), Xi = 1318 + int(r, -4, 4), Sig = 1193 + int(r, -4, 4);
      const answer = (2 * (N + Xi) - Sig) / 3;
      return {
        q: `<p>Take the baryon-octet masses as M<sub>N</sub> = ${N} MeV, M<sub>Ξ</sub> = ${Xi} MeV and M<sub>Σ</sub> = ${Sig} MeV. Use the Gell-Mann–Okubo formula to predict M<sub>Λ</sub> in MeV.</p>`,
        answer, unit: 'MeV', tol: 0.002,
        hint: 'For the octet the mass formula M = a + bY + c[I(I+1) − Y²/4] leads to 2(M<sub>N</sub> + M<sub>Ξ</sub>) = 3M<sub>Λ</sub> + M<sub>Σ</sub>.',
        solution: steps(`2(M<sub>N</sub> + M<sub>Ξ</sub>) = 2 × ${N + Xi} = ${2 * (N + Xi)} MeV.`, `3M<sub>Λ</sub> = ${2 * (N + Xi)} − ${Sig} = ${2 * (N + Xi) - Sig} MeV.`, `M<sub>Λ</sub> = <b>${answer.toFixed(1)} MeV</b> (measured 1115.7 MeV).`),
        N, Xi, Sig,
      };
    },
    verify(p) {
      // fit a, b, c from N (Y=1,I=1/2), Sig (Y=0,I=1), Xi (Y=-1,I=1/2), then evaluate Lambda (Y=0,I=0)
      const b = (p.N - p.Xi) / 2, c = (p.Sig - (p.N + p.Xi) / 2) / (2 - 0.5), a = p.Sig - 2 * c;
      return a + 0 * b; // b (the hypercharge term) drops out for Y = 0
    },
  },
  'kaon-threshold': {
    title: 'threshold pion energy for associated strangeness production',
    make(r) {
      const R = [['π⁻ p → K⁰ Λ', 139.57, 497.61, 1115.68], ['π⁻ p → K⁺ Σ⁻', 139.57, 493.68, 1197.45], ['π⁺ p → K⁺ Σ⁺', 139.57, 493.68, 1189.37], ['π⁻ p → K⁰ Σ⁰', 139.57, 497.61, 1192.64]][int(r, 0, 3)];
      const [rx, mpi, mK, mY] = R, mp = 938.27, M = mK + mY;
      const answer = (M * M - (mpi + mp) ** 2) / (2 * mp);
      return {
        q: `<p>A pion beam hits protons at rest and makes strange particles through ${rx}. Find the threshold kinetic energy of the pion, in MeV. (m<sub>π</sub> = ${mpi}, m<sub>p</sub> = ${mp}, m<sub>K</sub> = ${mK}, m<sub>Y</sub> = ${mY} MeV.) Check that strangeness is conserved.</p>`,
        answer, unit: 'MeV', tol: 0.005,
        hint: 'At threshold the products are at rest in the centre-of-mass frame: s = (m<sub>K</sub> + m<sub>Y</sub>)². In the lab s = m<sub>π</sub>² + m<sub>p</sub>² + 2E<sub>π</sub>m<sub>p</sub>.',
        solution: steps(`Strangeness: 0 + 0 → (+1) + (−1). The strong interaction conserves S, so the kaon and the hyperon are made together.`, `√s at threshold = ${M.toFixed(2)} MeV; initial rest masses add to ${(mpi + mp).toFixed(2)} MeV.`, `T<sub>π</sub> = [(${M.toFixed(2)})² − (${(mpi + mp).toFixed(2)})²]/(2 × ${mp}) = <b>${answer.toFixed(1)} MeV</b>.`),
        mpi, mK, mY, mp,
      };
    },
    verify(p) { const s = (p.mK + p.mY) ** 2, E = (s - p.mpi ** 2 - p.mp ** 2) / (2 * p.mp); return E - p.mpi; },
  },
};

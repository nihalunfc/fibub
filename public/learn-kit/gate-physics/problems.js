// Live problems for GATE Physics lessons (lesson kit). Each make(rand) returns { q, answer, unit, tol (relative),
// abs?, hint, solution } as HTML; verify(p) works the answer out another way for tests/exam-physics.mjs.
// Placed in a lesson as <div class="problem" data-problem="id"></div>. Exam-style practice uses the question bank instead.
const int = (r, a, b) => a + Math.floor(r() * (b - a + 1));
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';

export default {
  // ---- 4.1 to 4.5 quantum mechanics ----
  'energy-spread': {
    title: 'mean energy and energy spread of a superposition',
    make(r) {
      const a = int(r, 1, 3), b = int(r, 1, 3), c = int(r, 1, 2), E1 = int(r, 1, 3), E2 = E1 + int(r, 1, 3), E3 = E2 + int(r, 1, 4);
      const N = a * a + b * b + c * c, p = [a * a / N, b * b / N, c * c / N], E = [E1, E2, E3];
      const mean = p[0] * E1 + p[1] * E2 + p[2] * E3, mean2 = p[0] * E1 * E1 + p[1] * E2 * E2 + p[2] * E3 * E3;
      const answer = Math.sqrt(mean2 - mean * mean);
      return {
        q: `<p>Energy eigenstates |1⟩, |2⟩, |3⟩ have E₁ = ${E1} eV, E₂ = ${E2} eV, E₃ = ${E3} eV. A system is in the (unnormalised) state |ψ⟩ = ${a}|1⟩ + ${b}i|2⟩ − ${c}|3⟩. Find the energy spread ΔE in eV.</p>`,
        answer, unit: 'eV', tol: 0.01,
        hint: 'Normalise first: the probabilities are |cₙ|² divided by the sum of all |cₙ|². Then ΔE² = ⟨E²⟩ − ⟨E⟩². Phases such as i and the minus sign do not matter.',
        solution: steps(`⟨ψ|ψ⟩ = ${a * a} + ${b * b} + ${c * c} = ${N}, so the probabilities are ${a * a}/${N}, ${b * b}/${N}, ${c * c}/${N}.`, `⟨E⟩ = (${a * a}·${E1} + ${b * b}·${E2} + ${c * c}·${E3})/${N} = ${mean.toFixed(4)} eV.`, `⟨E²⟩ = (${a * a}·${E1 * E1} + ${b * b}·${E2 * E2} + ${c * c}·${E3 * E3})/${N} = ${mean2.toFixed(4)} eV².`, `ΔE = √(${mean2.toFixed(4)} − ${(mean * mean).toFixed(4)}) = <b>${answer.toFixed(3)} eV</b>.`),
        a, b, c, E,
      };
    },
    verify(p) {
      const w = [p.a ** 2, p.b ** 2, p.c ** 2], N = w[0] + w[1] + w[2];
      const m = w.reduce((s, x, i) => s + x * p.E[i], 0) / N;
      return Math.sqrt(w.reduce((s, x, i) => s + x * (p.E[i] - m) ** 2, 0) / N);
    },
  },
  'packet-momentum': {
    title: 'mean square momentum of a moving Gaussian packet',
    make(r) {
      const s = [0.1, 0.2, 0.25, 0.5][int(r, 0, 3)], k0 = int(r, 1, 8);
      const answer = k0 * k0 + 1 / (4 * s * s);
      return {
        q: `<p>A particle has ψ(x) ∝ exp(−x²/4σ²) e<sup>ik₀x</sup> with σ = ${s} nm and k₀ = ${k0} nm⁻¹. Find ⟨p²⟩/ħ² in nm⁻².</p>`,
        answer, unit: 'nm⁻²', tol: 0.005,
        hint: 'The phase e^(ik₀x) shifts the momentum by ħk₀; the real Gaussian is a minimum-uncertainty state with Δx = σ, so its Δp = ħ/2σ. Then ⟨p²⟩ = ⟨p⟩² + Δp².',
        solution: steps(`|ψ|² ∝ exp(−x²/2σ²), so Δx = σ = ${s} nm, and the Gaussian gives Δp = ħ/(2σ): Δp²/ħ² = 1/(4·${s}²) = ${(1 / (4 * s * s)).toFixed(3)} nm⁻².`, `⟨p⟩ = ħk₀, so ⟨p⟩²/ħ² = ${k0 * k0} nm⁻².`, `⟨p²⟩/ħ² = ${k0 * k0} + ${(1 / (4 * s * s)).toFixed(3)} = <b>${answer.toFixed(3)} nm⁻²</b>.`),
        s, k0,
      };
    },
    verify: (p) => p.k0 ** 2 + 0.25 / p.s ** 2,
  },
  'delta-binding': {
    title: 'bound state of a delta-function well',
    make(r) {
      const alpha = [0.05, 0.1, 0.15, 0.2, 0.3, 0.4][int(r, 0, 5)];
      const kappa = alpha / 0.0762, answer = 1000 * 0.0381 * kappa * kappa;
      return {
        q: `<p>An electron is bound by the potential V(x) = −α δ(x) with α = ${alpha} eV nm. Find its binding energy in meV. Use ħ²/2m<sub>e</sub> = 0.0381 eV nm².</p>`,
        answer, unit: 'meV', tol: 0.01,
        hint: 'Try ψ = A e^(−κ|x|). The slope must jump by −(2mα/ħ²)ψ(0) at the origin, which fixes κ = mα/ħ². The energy is −ħ²κ²/2m.',
        solution: steps(`Slope jump: −2κA = −(2mα/ħ²)A, so κ = mα/ħ² = α/(2 × 0.0381) = ${kappa.toFixed(4)} nm⁻¹.`, `E = −(ħ²/2m)κ² = −0.0381 × ${kappa.toFixed(4)}² eV = −${(answer / 1000).toFixed(5)} eV.`, `Binding energy = <b>${answer.toFixed(2)} meV</b>; the wavefunction spreads over about 1/κ = ${(1 / kappa).toFixed(3)} nm.`),
        alpha,
      };
    },
    verify: (p) => 1000 * p.alpha ** 2 / (4 * 0.0381),
  },
  'oscillator-matrix': {
    title: 'a position matrix element of the oscillator',
    make(r) {
      const hw = [0.1, 0.2, 0.5, 1.0][int(r, 0, 3)], n = int(r, 0, 6);
      const ell = Math.sqrt(0.0762 / (2 * hw)), answer = Math.sqrt(n + 1) * ell;
      return {
        q: `<p>An electron is in a harmonic well with ħω = ${hw} eV. Find the matrix element ⟨${n + 1}|x|${n}⟩ in nm. Use ħ²/m<sub>e</sub> = 0.0762 eV nm².</p>`,
        answer, unit: 'nm', tol: 0.01,
        hint: 'Write x = √(ħ/2mω)(a + a†). Only a† connects |n⟩ to |n+1⟩, with the factor √(n+1). And ħ/mω = (ħ²/m)/(ħω).',
        solution: steps(`√(ħ/2mω) = √(0.0762/(2 × ${hw})) nm = ${ell.toFixed(4)} nm.`, `a†|${n}⟩ = √${n + 1} |${n + 1}⟩, so ⟨${n + 1}|x|${n}⟩ = √${n + 1} × ${ell.toFixed(4)} nm.`, `= <b>${answer.toFixed(4)} nm</b>.`),
        hw, n,
      };
    },
    verify: (p) => Math.sqrt((p.n + 1) * 0.0762 / (2 * p.hw)),
  },
  'lx-spread': {
    title: 'spread of Lx in a state |l, m⟩',
    make(r) {
      const l = int(r, 1, 5), m = int(r, -l, l);
      const answer = Math.sqrt((l * (l + 1) - m * m) / 2);
      return {
        q: `<p>A particle is in the state |l = ${l}, m = ${m}⟩. Find the uncertainty ΔL<sub>x</sub> in units of ħ.</p>`,
        answer, unit: 'ħ', tol: 0.005,
        hint: '⟨Lx⟩ = 0 in any |l, m⟩. By symmetry ⟨Lx²⟩ = ⟨Ly²⟩, and Lx² + Ly² = L² − Lz².',
        solution: steps(`⟨L²⟩ = l(l+1)ħ² = ${l * (l + 1)}ħ² and ⟨Lz²⟩ = m²ħ² = ${m * m}ħ².`, `⟨Lx²⟩ = ½(${l * (l + 1)} − ${m * m})ħ² = ${((l * (l + 1) - m * m) / 2).toFixed(2)}ħ², and ⟨Lx⟩ = 0.`, `ΔLx = √${((l * (l + 1) - m * m) / 2).toFixed(2)} ħ = <b>${answer.toFixed(3)} ħ</b>.`),
        l, m,
      };
    },
    verify: (p) => Math.sqrt((p.l * (p.l + 1) - p.m ** 2) / 2),
  },
  // ---- 1.1 Linear vector spaces (gate-math writer) ----
  'lvs-expectation': {
    title: 'an expectation value in Dirac notation',
    make(r) {
      const l = [int(r, -2, 0), int(r, 1, 2), int(r, 3, 5)], c = [int(r, 1, 3), int(r, 1, 2), int(r, 1, 3)];
      const N2 = c[0] ** 2 + c[1] ** 2 + c[2] ** 2, num = l[0] * c[0] ** 2 + l[1] * c[1] ** 2 + l[2] * c[2] ** 2;
      return {
        q: `<p>An observable is Â = ${l[0]}|1⟩⟨1| + ${l[1]}|2⟩⟨2| + ${l[2]}|3⟩⟨3| in an orthonormal basis. A system is in the (unnormalised) state |ψ⟩ = ${c[0]}|1⟩ + ${c[1]}i|2⟩ − ${c[2]}|3⟩. Find the expectation value ⟨Â⟩ = ⟨ψ|Â|ψ⟩ / ⟨ψ|ψ⟩.</p>`,
        answer: num / N2, unit: '', tol: 0.01,
        hint: 'Â is diagonal in this basis, so ⟨Â⟩ is a weighted average of its eigenvalues with weights |cₙ|². Remember to divide by ⟨ψ|ψ⟩.',
        solution: steps(`⟨ψ|ψ⟩ = ${c[0]}² + ${c[1]}² + ${c[2]}² = ${N2} (the i and the minus sign drop out of |cₙ|²).`, `⟨ψ|Â|ψ⟩ = ${l[0]}·${c[0] ** 2} + ${l[1]}·${c[1] ** 2} + ${l[2]}·${c[2] ** 2} = ${num}.`, `⟨Â⟩ = ${num}/${N2} ≈ <b>${(num / N2).toFixed(3)}</b>.`),
        l, c,
      };
    },
    verify: (p) => { let n = 0, d = 0; p.l.forEach((x, i) => { n += x * p.c[i] ** 2; d += p.c[i] ** 2; }); return n / d; },
  },
  // ---- 1.2 Matrices ----
  'mev-hermitian': {
    title: 'eigenvalues of a 2 × 2 Hermitian matrix',
    make(r) {
      const p = int(r, -2, 4), s = int(r, -3, 3), q = int(r, 1, 3), w = int(r, 0, 3);
      const t = p + s, D = p * s - (q * q + w * w), big = (t + Math.sqrt(t * t - 4 * D)) / 2;
      const off = w === 0 ? `${q}` : `${q} − ${w === 1 ? '' : w}i`, offc = w === 0 ? `${q}` : `${q} + ${w === 1 ? '' : w}i`;
      return {
        q: `<p>Find the larger eigenvalue of the Hermitian matrix H = [[${p}, ${off}], [${offc}, ${s}]] (rows in brackets).</p>`,
        answer: big, unit: '', tol: 0.005,
        hint: 'Use trace and determinant. For the determinant, the off-diagonal entries multiply to |b|² = (real part)² + (imaginary part)², not b².',
        solution: steps(`Trace = ${p} + ${s} = ${t}. Determinant = (${p})(${s}) − |${off}|² = ${p * s} − ${q * q + w * w} = ${D}.`, `λ² − ${t}λ + ${D} = 0, so λ = [${t} ± √(${t * t} − 4·(${D}))]/2 = [${t} ± √${t * t - 4 * D}]/2.`, `Larger: <b>${big.toFixed(3)}</b>. Both roots are real, as they must be for a Hermitian matrix: the discriminant (p − s)² + 4|b|² can never be negative.`),
        p, s, re: q, w,
      };
    },
    verify: (p) => { const a0 = (p.p + p.s) / 2, az = (p.p - p.s) / 2; return a0 + Math.sqrt(az * az + p.re * p.re + p.w * p.w); },
  },
  // ---- 1.3 Complex analysis ----
  'cax-cauchy': {
    title: "Cauchy's integral formula with a derivative",
    make(r) {
      const a = int(r, 1, 3), b = int(r, -1, 1), n = int(r, 1, 3), R = Math.abs(b) + 2;
      let fct = 1; for (let i = 2; i <= n; i++) fct *= i;
      const k = (2 * a ** n * Math.exp(a * b)) / fct;
      const den = b === 0 ? 'z' : b > 0 ? `(z − ${b})` : `(z + ${-b})`;
      return {
        q: `<p>The integral ∮ e<sup>${a === 1 ? '' : a}z</sup> / ${den}<sup>${n + 1}</sup> dz, taken anticlockwise round the circle |z| = ${R}, equals kπi. Find k.</p>`,
        answer: k, unit: '', tol: 0.005,
        hint: `Use ∮ f(z)/(z − z₀)ⁿ⁺¹ dz = (2πi/n!) f⁽ⁿ⁾(z₀) with f(z) = e^(${a}z). Is z₀ = ${b} inside the circle?`,
        solution: steps(`z₀ = ${b} is inside |z| = ${R}, and f(z) = e^(${a}z) is entire.`, `f⁽${n}⁾(z) = ${a}${n > 1 ? '^' + n : ''} e^(${a}z), so f⁽${n}⁾(${b}) = ${a ** n} e^(${a * b}).`, `∮ = (2πi/${n}!) · ${a ** n} e^(${a * b}) = ${(2 * a ** n / fct).toFixed(4)} e^(${a * b}) πi, so k ≈ <b>${k.toFixed(4)}</b>.`),
        a, b, n,
      };
    },
    verify: (p) => { // numerical contour integral on |z - b| = 1 (same value by Cauchy), divided by pi i
      const N = 4000; let re = 0, im = 0;
      for (let j = 0; j < N; j++) {
        const t = ((j + 0.5) / N) * 2 * Math.PI, zr = p.b + Math.cos(t), zi = Math.sin(t);
        const er = Math.exp(p.a * zr) * Math.cos(p.a * zi), ei = Math.exp(p.a * zr) * Math.sin(p.a * zi);
        // (z - b)^{-(n+1)} = e^{-i(n+1)t}; dz = i e^{it} dt
        const ang = -(p.n + 1) * t + t + Math.PI / 2, cr = Math.cos(ang), ci = Math.sin(ang);
        re += (er * cr - ei * ci) * (2 * Math.PI / N); im += (er * ci + ei * cr) * (2 * Math.PI / N);
      }
      return im / Math.PI; // integral = k pi i, so k = Im / pi
    },
  },
  // ---- 1.4 Residues ----
  'res-two-poles': {
    title: 'a real integral by residues',
    make(r) {
      const a = int(r, 1, 3), b = a + int(r, 1, 3);
      const ans = Math.PI / (a * b * (a + b));
      return {
        q: `<p>Use the residue theorem to find ∫ dx / [(x² + ${a * a})(x² + ${b * b})] from −∞ to ∞.</p>`,
        answer: ans, unit: '', tol: 0.005,
        hint: `Close in the upper half-plane. Two simple poles are inside: z = ${a}i and z = ${b}i.`,
        solution: steps(`The integrand falls like 1/x⁴, so the big semicircle contributes nothing.`, `Res at ${a}i: 1/[(2·${a}i)(${b * b} − ${a * a})] = 1/(${2 * a * (b * b - a * a)}i). Res at ${b}i: 1/[(${a * a} − ${b * b})(2·${b}i)] = −1/(${2 * b * (b * b - a * a)}i).`, `2πi × (sum) = π[1/${a * (b * b - a * a)} − 1/${b * (b * b - a * a)}] = π/[${a}·${b}·(${a} + ${b})] = π/${a * b * (a + b)} ≈ <b>${ans.toFixed(4)}</b>.`),
        a, b,
      };
    },
    verify: (p) => { let s = 0; const N = 200000; for (let i = 0; i < N; i++) { const t = -Math.PI / 2 + (Math.PI * (i + 0.5)) / N, x = Math.tan(t); s += 1 / ((x * x + p.a * p.a) * (x * x + p.b * p.b)) / Math.cos(t) ** 2; } return (s * Math.PI) / N; },
  },
  // ---- 1.5 Fourier and Laplace ----
  'flt-damped': {
    title: 'a damped oscillator by Laplace transform',
    make(r) {
      const w = int(r, 1, 3), t0 = [0.5, 1, 1.5, 2][int(r, 0, 3)];
      const y = Math.exp(-t0) * (Math.cos(w * t0) + Math.sin(w * t0) / w);
      return {
        q: `<p>Solve y″ + 2y′ + ${1 + w * w}y = 0 with y(0) = 1 and y′(0) = 0 using the Laplace transform, and give y(${t0}).</p>`,
        answer: y, unit: '', tol: 0.01, abs: 0.002,
        hint: 'L{y″} = s²Y − s·y(0) − y′(0) and L{y′} = sY − y(0). Then complete the square in the denominator: s² + 2s + c = (s + 1)² + (c − 1).',
        solution: steps(`(s² + 2s + ${1 + w * w})Y = s + 2, so Y = (s + 2)/[(s + 1)² + ${w * w}] = (s + 1)/[(s + 1)² + ${w * w}] + 1/[(s + 1)² + ${w * w}].`, `The shift s → s + 1 means a factor e^(−t): y = e^(−t)[cos ${w}t + (1/${w}) sin ${w}t].`, `y(${t0}) = e^(−${t0})[cos ${w * t0} + sin ${w * t0}/${w}] ≈ <b>${y.toFixed(4)}</b> (angles in radians).`),
        w, t0,
      };
    },
    verify: (p) => { // RK4
      let y = 1, v = 0; const n = 4000, h = p.t0 / n, c = 1 + p.w * p.w, f = (y, v) => [v, -2 * v - c * y];
      for (let i = 0; i < n; i++) { const k1 = f(y, v), k2 = f(y + (h / 2) * k1[0], v + (h / 2) * k1[1]), k3 = f(y + (h / 2) * k2[0], v + (h / 2) * k2[1]), k4 = f(y + h * k3[0], v + h * k3[1]); y += (h / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]); v += (h / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]); }
      return y;
    },
  },
  // ---- 7.6 to 7.10 solid state (free electrons, bands, Hall, magnetism, superconductivity) ----
  'fem-fermi-gas': {
    title: 'Fermi energy, velocity and temperature of a metal',
    make(r) {
      const mets = [['sodium', 1, 2.54], ['potassium', 1, 1.40], ['copper', 1, 8.47], ['silver', 1, 5.86], ['magnesium', 2, 4.30], ['aluminium', 3, 6.02], ['zinc', 2, 6.57]];
      const [name, Z, na] = mets[int(r, 0, mets.length - 1)];
      const n = Z * na * 1e28, kF = Math.cbrt(3 * Math.PI ** 2 * n), vF = 1.054571817e-34 * kF / 9.1093837015e-31;
      const EF = 0.5 * 9.1093837015e-31 * vF * vF / 1.602176634e-19, answer = vF / 1e6;
      return {
        q: `<p>${name[0].toUpperCase() + name.slice(1)} has ${na} × 10²⁸ atoms per m³ and ${Z} conduction electron${Z > 1 ? 's' : ''} per atom. Treating them as a free electron gas, find the Fermi velocity in units of 10⁶ m/s.</p>`,
        answer, unit: '× 10⁶ m/s', tol: 0.01,
        hint: 'Multiply the atom density by the valence to get n. Then k_F = (3π²n)^(1/3) and v_F = ħk_F/m.',
        solution: steps(`n = ${Z} × ${na} × 10²⁸ = ${(n / 1e28).toFixed(2)} × 10²⁸ m⁻³.`, `k_F = (3π²n)^(1/3) = ${(kF / 1e10).toFixed(3)} Å⁻¹.`, `v_F = ħk_F/m = 1.0546 × 10⁻³⁴ × ${kF.toExponential(3)} / 9.109 × 10⁻³¹ = <b>${answer.toFixed(3)} × 10⁶ m/s</b>.`, `For comparison E_F = ½mv_F² = ${EF.toFixed(2)} eV and T_F = ${Math.round(EF / 8.617333e-5)} K.`),
        n,
      };
    },
    verify: (p) => Math.sqrt(2 * (1.054571817e-34 ** 2 / (2 * 9.1093837015e-31)) * (3 * Math.PI ** 2 * p.n) ** (2 / 3) / 9.1093837015e-31) / 1e6,
  },
  'bth-tight-binding': {
    title: 'effective mass along a tight-binding band',
    make(r) {
      const t = [0.25, 0.5, 0.75, 1, 1.5][int(r, 0, 4)], a = [0.2, 0.25, 0.3, 0.4][int(r, 0, 3)];
      const kas = [[0, '0'], [1 / 6, 'π/6'], [1 / 4, 'π/4'], [1 / 3, 'π/3'], [2 / 3, '2π/3'], [5 / 6, '5π/6']];
      const [f, lab] = kas[int(r, 0, kas.length - 1)];
      const c = Math.cos(Math.PI * f), answer = 0.0381 / (t * a * a * c);
      return {
        q: `<p>Electrons in a chain have the tight-binding band E(k) = E₀ − 2t cos ka with t = ${t} eV and a = ${a} nm. Find the effective mass m*/m<sub>e</sub> at ka = ${lab} (with its sign). Use ħ²/2m<sub>e</sub> = 0.0381 eV nm².</p>`,
        answer, unit: 'm_e', tol: 0.01,
        hint: '1/m* = (1/ħ²) d²E/dk². Here d²E/dk² = 2ta² cos ka, so m*/m_e = (ħ²/2m_e)/(ta² cos ka).',
        solution: steps(`d²E/dk² = 2ta² cos ka = 2 × ${t} × ${a}² × ${c.toFixed(4)} eV nm².`, `m*/m_e = (ħ²/2m_e) / (ta² cos ka) = 0.0381 / (${t} × ${(a * a).toFixed(4)} × ${c.toFixed(4)}) = <b>${answer.toFixed(3)}</b>.`, c < 0 ? 'Past ka = π/2 the band curves downward and the mass is negative: a force pushes the electron backwards.' : 'At ka = π/2 the curvature vanishes and |m*| becomes infinite; beyond it the mass turns negative.'),
        t, a, f,
      };
    },
    verify: (p) => 0.0381 / (p.t * p.a * p.a * Math.cos(Math.PI * p.f)),
  },
  'shl-two-carrier': {
    title: 'Hall coefficient with electrons and holes',
    make(r) {
      const n = int(r, 1, 9), p = int(r, 1, 9), me = [0.15, 0.2, 0.3, 0.4, 0.6][int(r, 0, 4)], mh = [0.05, 0.1, 0.15][int(r, 0, 2)];
      const num = p * mh * mh - n * me * me, den = (p * mh + n * me) ** 2;
      const answer = num / (1.602176634e-19 * den * 1e21) * 1e3;
      return {
        q: `<p>A sample holds n = ${n} × 10²¹ m⁻³ electrons (μ<sub>e</sub> = ${me} m²/V s) and p = ${p} × 10²¹ m⁻³ holes (μ<sub>h</sub> = ${mh} m²/V s). Find its weak-field Hall coefficient in units of 10⁻³ m³/C, with sign.</p>`,
        answer, unit: '× 10⁻³ m³/C', tol: 0.01, abs: 0.002,
        hint: 'R_H = (pμ_h² − nμ_e²) / [e(pμ_h + nμ_e)²]. Each carrier counts with its mobility squared on top.',
        solution: steps(`Numerator: pμ_h² − nμ_e² = (${p} × ${mh}² − ${n} × ${me}²) × 10²¹ = ${num.toFixed(4)} × 10²¹ m⁻³ (m²/V s)².`, `Denominator: e(pμ_h + nμ_e)² = 1.602 × 10⁻¹⁹ × (${(p * mh + n * me).toFixed(3)} × 10²¹)².`, `R_H = <b>${answer.toFixed(3)} × 10⁻³ m³/C</b>: ${answer < 0 ? 'negative, the electrons win' : 'positive, the holes win'}${(answer < 0) === (p > n) ? ' even though they are outnumbered' : ''}.`),
        n, p, me, mh,
      };
    },
    verify: (q) => (q.p * q.mh ** 2 - q.n * q.me ** 2) / (1.602176634e-19 * (q.p * q.mh + q.n * q.me) ** 2 * 1e21) * 1e3,
  },
  'mgx-curie-weiss': {
    title: 'Curie-Weiss temperature from two measurements',
    make(r) {
      const th = [-120, -60, -30, 20, 50, 90][int(r, 0, 5)], Cc = [0.5, 1, 1.5, 2.5][int(r, 0, 3)];
      const T1 = Math.max(0, th) + [40, 80][int(r, 0, 1)], T2 = T1 + [100, 200][int(r, 0, 1)];
      const c1 = +(1000 * Cc / (T1 - th)).toPrecision(4), c2 = +(1000 * Cc / (T2 - th)).toPrecision(4);
      const answer = (c1 * T1 - c2 * T2) / (c1 - c2);
      return {
        q: `<p>A magnetic salt obeys χ = C/(T − θ). Its susceptibility is ${c1} × 10⁻³ at ${T1} K and ${c2} × 10⁻³ at ${T2} K. Find θ in kelvin, with sign.</p>`,
        answer, unit: 'K', tol: 0.01, abs: 0.5,
        hint: 'C = χ(T − θ) is the same at both temperatures. Equivalently 1/χ is a straight line in T that crosses zero at T = θ.',
        solution: steps(`χ₁(T₁ − θ) = χ₂(T₂ − θ), so θ = (χ₁T₁ − χ₂T₂)/(χ₁ − χ₂).`, `θ = (${c1} × ${T1} − ${c2} × ${T2}) / (${c1} − ${c2}) = <b>${answer.toFixed(1)} K</b>.`, answer > 0 ? 'Positive θ: ferromagnetic interactions, ordering near T_C ≈ θ.' : 'Negative θ: antiferromagnetic interactions; the Néel temperature is usually below |θ|.'),
        c1, c2, T1, T2,
      };
    },
    verify: (p) => (p.c1 * p.T1 - p.c2 * p.T2) / (p.c1 - p.c2),
  },
  'scd-silsbee': {
    title: 'critical current of a superconducting wire at temperature T',
    make(r) {
      const els = [['tin', 3.72, 30.5], ['lead', 7.19, 80.3], ['indium', 3.41, 28.1], ['mercury', 4.15, 41.1]];
      const [name, Tc, B0] = els[int(r, 0, els.length - 1)];
      const t = [0.2, 0.4, 0.5, 0.6, 0.8][int(r, 0, 4)], T = +(t * Tc).toFixed(3), rad = [0.1, 0.25, 0.5, 1][int(r, 0, 3)];
      const Bc = B0 * (1 - (T / Tc) ** 2) / 1000, answer = 2 * Math.PI * rad * 1e-3 * Bc / 1.25663706212e-6;
      return {
        q: `<p>A ${name} wire of radius ${rad} mm (T<sub>c</sub> = ${Tc} K, B<sub>c</sub>(0) = ${B0} mT, B<sub>c</sub>(T) = B<sub>c</sub>(0)[1 − (T/T<sub>c</sub>)²]) is held at ${T} K. Using Silsbee's rule, find the largest current it can carry without resistance, in amperes.</p>`,
        answer, unit: 'A', tol: 0.01,
        hint: 'First find B_c at this temperature. The current destroys superconductivity when its own field at the surface, μ₀I/2πa, reaches B_c.',
        solution: steps(`B_c(${T} K) = ${B0} × [1 − (${T}/${Tc})²] = ${(Bc * 1000).toFixed(2)} mT.`, `I_c = 2πaB_c/μ₀ = 2π × ${rad} × 10⁻³ × ${Bc.toFixed(5)} / 1.2566 × 10⁻⁶ = <b>${answer.toFixed(2)} A</b>.`, 'Cooling further raises B_c and with it the critical current; a type-II wire with pinning carries far more.'),
        rad, Bc,
      };
    },
    verify: (p) => 2 * Math.PI * p.rad * 1e-3 * p.Bc / 1.25663706212e-6,
  },
};

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
  // ---- 1.6 to 1.10 special functions, PDEs, Green's functions, tensors, probability ----
  'sfn-legendre-coeff': {
    title: 'Legendre coefficients of a cubic',
    make(r) {
      const a = int(r, -3, 3), b = int(r, -3, 3), c = int(r, 1, 6), d = int(r, 1, 5), l = int(r, 0, 3);
      const cs = [a + c / 3, b + (3 * d) / 5, (2 * c) / 3, (2 * d) / 5], answer = cs[l];
      return {
        q: `<p>Expand f(x) = ${a} + ${b}x + ${c}x² + ${d}x³ on [−1, 1] as a Legendre series f = Σ c<sub>ℓ</sub>P<sub>ℓ</sub>(x). Find c<sub>${l}</sub>.</p>`,
        answer, unit: '', tol: 0.005, abs: 0.002,
        hint: 'Rewrite the powers: x² = (P₀ + 2P₂)/3 and x³ = (3P₁ + 2P₃)/5, then collect. (Or use c_ℓ = (2ℓ + 1)/2 ∫ f P_ℓ dx.)',
        solution: steps(`x² = ⅓P₀ + ⅔P₂ and x³ = ⅗P₁ + ⅖P₃ (from P₂ = (3x² − 1)/2 and P₃ = (5x³ − 3x)/2).`, `So f = (${a} + ${c}/3)P₀ + (${b} + 3·${d}/5)P₁ + (2·${c}/3)P₂ + (2·${d}/5)P₃.`, `c<sub>${l}</sub> = <b>${answer.toFixed(4)}</b>. Check: the four coefficients add to f(1) = ${a + b + c + d}, because every P_ℓ(1) = 1.`),
        a, b, c, d, l,
      };
    },
    verify(p) { // c_l = (2l+1)/2 * integral of f P_l, midpoint rule
      const P = [() => 1, (x) => x, (x) => (3 * x * x - 1) / 2, (x) => (5 * x ** 3 - 3 * x) / 2], N = 20000; let s = 0;
      for (let i = 0; i < N; i++) { const x = -1 + (2 * (i + 0.5)) / N; s += (p.a + p.b * x + p.c * x * x + p.d * x ** 3) * P[p.l](x); }
      return ((2 * p.l + 1) / 2) * s * (2 / N);
    },
  },
  'pde-rod-cooling': {
    title: 'midpoint temperature of a cooling rod',
    make(r) {
      const L = [0.2, 0.3, 0.5][int(r, 0, 2)], k = [1.2e-5, 2.3e-5, 9.7e-5][int(r, 0, 2)], T0 = [60, 80, 100, 150][int(r, 0, 3)], f = [0.04, 0.06, 0.1, 0.15][int(r, 0, 3)];
      const t = (f * L * L) / k, e1 = Math.exp(-(Math.PI ** 2) * f), e3 = Math.exp(-9 * Math.PI ** 2 * f);
      const answer = (4 * T0 / Math.PI) * (e1 - e3 / 3);
      return {
        q: `<p>A rod of length ${L} m (diffusivity κ = ${k} m²/s) is at a uniform ${T0} °C. At t = 0 both ends are put into ice at 0 °C. Find the temperature at its midpoint after ${t.toFixed(1)} s, in °C.</p>`,
        answer, unit: '°C', tol: 0.005,
        hint: 'u = Σ b_n sin(nπx/L) e^(−n²π²κt/L²) with b_n = 4T₀/(nπ) for odd n. At the midpoint sin(nπ/2) = 1, −1, 1, ... for n = 1, 3, 5. Work out κt/L² first; two terms are enough.',
        solution: steps(`κt/L² = ${k} × ${t.toFixed(1)} / ${L}² = ${f}.`, `n = 1: (4·${T0}/π) e^(−π²·${f}) = ${((4 * T0 / Math.PI) * e1).toFixed(3)} °C. n = 3: −(4·${T0}/3π) e^(−9π²·${f}) = ${(-(4 * T0 / (3 * Math.PI)) * e3).toFixed(3)} °C.`, `u(L/2) ≈ <b>${answer.toFixed(2)} °C</b> (the n = 5 term is smaller than ${(((4 * T0) / (5 * Math.PI)) * Math.exp(-25 * Math.PI ** 2 * f)).toFixed(3)} °C).`),
        T0, f,
      };
    },
    verify(p) { let s = 0; for (let n = 1; n < 400; n += 2) s += (4 * p.T0 / (n * Math.PI)) * Math.sin((n * Math.PI) / 2) * Math.exp(-n * n * Math.PI ** 2 * p.f); return s; },
  },
  'dgf-string-load': {
    title: 'deflection of a string under point and spread loads',
    make(r) {
      const L = [1, 1.5, 2][int(r, 0, 2)], T = [50, 100, 200][int(r, 0, 2)], F = [2, 5, 10][int(r, 0, 2)], w = [5, 10, 20][int(r, 0, 2)];
      const xs = L * [0.25, 0.4, 0.6][int(r, 0, 2)], x = L * [0.3, 0.5, 0.7][int(r, 0, 2)];
      const lo = Math.min(x, xs), hi = Math.max(x, xs), yP = (F * lo * (L - hi)) / (T * L), yU = (w * x * (L - x)) / (2 * T), answer = 1000 * (yP + yU);
      return {
        q: `<p>A string of length ${L} m under tension ${T} N is fixed at both ends. It carries its own uniform load of ${w} N/m and a point force of ${F} N at x′ = ${xs.toFixed(2)} m (both downwards, small deflections). Find the deflection at x = ${x.toFixed(2)} m, in mm.</p>`,
        answer, unit: 'mm', tol: 0.005,
        hint: 'The deflection obeys −T y″ = f(x). Its Green\'s function is G(x, x′) = x<(L − x>)/(T L). Add the point-force response F·G(x, x′) and the uniform-load response w x(L − x)/(2T).',
        solution: steps(`Point force: F·G = ${F} × ${lo.toFixed(2)} × (${L} − ${hi.toFixed(2)}) / (${T} × ${L}) = ${(1000 * yP).toFixed(3)} mm.`, `Uniform load: ∫G w dx′ = w x(L − x)/(2T) = ${w} × ${x.toFixed(2)} × ${(L - x).toFixed(2)} / ${2 * T} = ${(1000 * yU).toFixed(3)} mm.`, `Superposition: <b>${answer.toFixed(3)} mm</b>.`),
        L, T, F, w, xs, x,
      };
    },
    verify(p) { // finite differences: -T y'' = f with the point force as F/h at the nearest node
      const N = 600, h = p.L / N, f = Array(N + 1).fill(p.w); f[Math.round(p.xs / h)] += p.F / h;
      // Thomas algorithm for T(-y[i-1] + 2y[i] - y[i+1])/h^2 = f[i]
      const n = N - 1, cp = Array(n), dp = Array(n), a = -1, b = 2, c = -1;
      for (let i = 0; i < n; i++) { const rhs = (f[i + 1] * h * h) / p.T; if (i === 0) { cp[i] = c / b; dp[i] = rhs / b; } else { const m = b - a * cp[i - 1]; cp[i] = c / m; dp[i] = (rhs - a * dp[i - 1]) / m; } }
      const y = Array(n); y[n - 1] = dp[n - 1]; for (let i = n - 2; i >= 0; i--) y[i] = dp[i] - cp[i] * y[i + 1];
      return 1000 * y[Math.round(p.x / h) - 1];
    },
  },
  'tns-principal': {
    title: 'principal stresses of a 2D stress tensor',
    make(r) {
      const sx = int(r, -40, 80), sy = int(r, -40, 80), txy = int(r, -50, 50) || 15;
      const m = (sx + sy) / 2, R = Math.hypot((sx - sy) / 2, txy), answer = m + R, ang = (0.5 * Math.atan2(2 * txy, sx - sy) * 180) / Math.PI;
      return {
        q: `<p>A plane stress state has σ<sub>xx</sub> = ${sx} MPa, σ<sub>yy</sub> = ${sy} MPa and σ<sub>xy</sub> = ${txy} MPa. Find the larger principal stress in MPa.</p>`,
        answer, unit: 'MPa', tol: 0.005, abs: 0.05,
        hint: 'The principal stresses are the eigenvalues of the symmetric 2×2 tensor: (σxx + σyy)/2 ± √[((σxx − σyy)/2)² + σxy²].',
        solution: steps(`Mean: (${sx} + ${sy})/2 = ${m} MPa.`, `Radius (of Mohr\'s circle): √[(${(sx - sy) / 2})² + ${txy}²] = ${R.toFixed(3)} MPa.`, `σ₁ = ${m} + ${R.toFixed(3)} = <b>${answer.toFixed(2)} MPa</b>, along the axis rotated by ½ atan2(2σxy, σxx − σyy) = ${ang.toFixed(1)}° from x. The trace σ₁ + σ₂ = ${sx + sy} MPa is unchanged.`),
        sx, sy, txy,
      };
    },
    verify(p) { // maximise the normal stress n.sigma.n over directions
      let best = -Infinity; for (let i = 0; i < 200000; i++) { const t = (Math.PI * i) / 200000, c = Math.cos(t), s = Math.sin(t); best = Math.max(best, c * c * p.sx + 2 * s * c * p.txy + s * s * p.sy); } return best;
    },
  },
  'prb-net-rate': {
    title: 'net counting rate with background',
    make(r) {
      const tb = [100, 200, 300][int(r, 0, 2)], ts = [50, 100, 200][int(r, 0, 2)], B = [1.5, 2, 4][int(r, 0, 2)], S = [3, 5, 8, 12][int(r, 0, 3)];
      const Nb = Math.round(B * tb), Ns = Math.round((B + S) * ts), net = Ns / ts - Nb / tb, answer = Math.sqrt(Ns / ts ** 2 + Nb / tb ** 2);
      return {
        q: `<p>A background run records ${Nb} counts in ${tb} s. With the sample in place, ${Ns} counts are recorded in ${ts} s. Find the uncertainty (one standard deviation) of the net sample rate, in counts per second.</p>`,
        answer, unit: 's⁻¹', tol: 0.005,
        hint: 'Each count N has σ = √N, so a rate N/t has σ = √N/t. A difference of independent rates has σ² equal to the sum of their σ².',
        solution: steps(`Gross rate ${Ns}/${ts} = ${(Ns / ts).toFixed(3)} s⁻¹ with σ = √${Ns}/${ts} = ${(Math.sqrt(Ns) / ts).toFixed(4)} s⁻¹.`, `Background ${Nb}/${tb} = ${(Nb / tb).toFixed(3)} s⁻¹ with σ = √${Nb}/${tb} = ${(Math.sqrt(Nb) / tb).toFixed(4)} s⁻¹.`, `Net rate ${net.toFixed(3)} s⁻¹ ± √(${(Math.sqrt(Ns) / ts).toFixed(4)}² + ${(Math.sqrt(Nb) / tb).toFixed(4)}²) = ± <b>${answer.toFixed(4)} s⁻¹</b>. Variances add even though the rates are subtracted.`),
        Nb, Ns, tb, ts,
      };
    },
    verify: (p) => Math.hypot(Math.sqrt(p.Ns) / p.ts, Math.sqrt(p.Nb) / p.tb),
  },
};

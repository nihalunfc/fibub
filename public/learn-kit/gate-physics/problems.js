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
  // ---- 3.6 to 3.10 waves in matter, Fresnel, waveguides, radiation, covariant electrodynamics ----
  'emm-skin': {
    title: 'skin depth and surface resistance of a metal',
    make(r) {
      const M = [['copper', 5.8e7], ['aluminium', 3.5e7], ['silver', 6.3e7], ['brass', 1.5e7]][int(r, 0, 3)], f = [1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10][int(r, 0, 6)];
      const mu0 = 1.25663706212e-6, d = Math.sqrt(2 / (mu0 * M[1] * 2 * Math.PI * f)), answer = d * 1e6;
      return {
        q: `<p>Find the skin depth of ${M[0]} (σ = ${M[1].toExponential(1)} S/m, μ = μ₀) at f = ${f.toExponential(0)} Hz, in μm.</p>`,
        answer, unit: 'μm', tol: 0.01,
        hint: 'For a good conductor (σ ≫ ωε) δ = √(2/(μσω)) with ω = 2πf. Check the condition first: for any metal it holds far into the microwave range.',
        solution: steps(`ω = 2π × ${f.toExponential(0)} = ${(2 * Math.PI * f).toExponential(3)} rad/s.`, `δ = √(2/(μ₀σω)) = √(2/(1.2566×10⁻⁶ × ${M[1].toExponential(1)} × ${(2 * Math.PI * f).toExponential(3)})) = <b>${answer.toPrecision(3)} μm</b>.`, `The surface resistance is R<sub>s</sub> = 1/(σδ) = ${(1 / (M[1] * d)).toExponential(3)} Ω.`),
        s: M[1], f,
      };
    },
    verify: (p) => 1e6 / Math.sqrt(Math.PI * p.f * 1.25663706212e-6 * p.s),
  },
  'frs-reflect': {
    title: 'Fresnel reflectance at oblique incidence',
    make(r) {
      const n = [1.33, 1.5, 1.6, 1.8, 2.4][int(r, 0, 4)], th = [20, 30, 45, 60, 70, 80][int(r, 0, 5)], pol = int(r, 0, 1) ? 'p' : 's';
      const D = Math.PI / 180, ci = Math.cos(th * D), st = Math.sin(th * D) / n, ct = Math.sqrt(1 - st * st);
      const rr = pol === 's' ? (ci - n * ct) / (ci + n * ct) : (n * ci - ct) / (n * ci + ct), answer = 100 * rr * rr;
      return {
        q: `<p>Light polarised ${pol === 's' ? 'perpendicular to' : 'in'} the plane of incidence (${pol}) goes from air into glass of index ${n} at ${th}° incidence. Find the reflectance R<sub>${pol}</sub> in percent.</p>`,
        answer, unit: '%', tol: 0.01, abs: 0.01,
        hint: pol === 's' ? 'r_s = (n₁cosθᵢ − n₂cosθₜ)/(n₁cosθᵢ + n₂cosθₜ); find θₜ from Snell first. R = r².' : 'r_p = (n₂cosθᵢ − n₁cosθₜ)/(n₂cosθᵢ + n₁cosθₜ); find θₜ from Snell first. R = r², and it is zero at the Brewster angle.',
        solution: steps(`Snell: sin θₜ = sin ${th}°/${n} = ${st.toFixed(4)}, so cos θₜ = ${ct.toFixed(4)}; cos θᵢ = ${ci.toFixed(4)}.`, `r<sub>${pol}</sub> = ${rr.toFixed(4)}.`, `R<sub>${pol}</sub> = r² = <b>${answer.toFixed(2)}%</b>. (Brewster angle here: ${(Math.atan(n) / D).toFixed(1)}°.)`),
        n, th, pol,
      };
    },
    verify: (p) => { const D = Math.PI / 180, ti = p.th * D, tt = Math.asin(Math.sin(ti) / p.n); return 100 * (p.pol === 's' ? (Math.sin(ti - tt) / Math.sin(ti + tt)) ** 2 : (Math.tan(ti - tt) / Math.tan(ti + tt)) ** 2); },
  },
  'wvg-te10': {
    title: 'group velocity and guide wavelength of the TE10 mode',
    make(r) {
      const a = [1.5, 2.0, 2.29, 2.5, 3.5, 4.8][int(r, 0, 5)], fc = 15 / a, f = +(fc * (1.2 + 0.1 * int(r, 0, 6))).toFixed(2), ask = int(r, 0, 1) ? 'guide wavelength' : 'group velocity';
      const s = Math.sqrt(1 - (fc / f) ** 2), answer = ask === 'group velocity' ? s : 30 / f / s;
      return {
        q: `<p>An air-filled rectangular guide has broad side a = ${a} cm. A ${f} GHz signal travels in its TE₁₀ mode. Find the ${ask === 'group velocity' ? 'group velocity as a multiple of c' : 'guide wavelength in cm'} (take c = 3.0×10⁸ m/s).</p>`,
        answer, unit: ask === 'group velocity' ? '× c' : 'cm', tol: 0.01,
        hint: 'The TE₁₀ cutoff is f_c = c/2a. Then v_g = c√(1 − (f_c/f)²) and λ_g = λ/√(1 − (f_c/f)²), with λ = c/f.',
        solution: steps(`f<sub>c</sub> = c/2a = 3.0×10¹⁰ cm/s / (2 × ${a} cm) = ${fc.toFixed(3)} GHz.`, `√(1 − (f<sub>c</sub>/f)²) = √(1 − (${fc.toFixed(3)}/${f})²) = ${s.toFixed(4)}.`, ask === 'group velocity' ? `v<sub>g</sub> = <b>${s.toFixed(3)} c</b>; the phase velocity is ${(1 / s).toFixed(3)} c.` : `λ = 30/${f} = ${(30 / f).toFixed(3)} cm, so λ<sub>g</sub> = <b>${answer.toFixed(3)} cm</b>.`),
        a, f, ask,
      };
    },
    verify: (p) => { const kc = Math.PI / p.a, k = (2 * Math.PI * p.f) / 30, kz = Math.sqrt(k * k - kc * kc); return p.ask === 'group velocity' ? kz / k : (2 * Math.PI) / kz; },
  },
  'rdn-dipole': {
    title: 'power radiated by a short dipole antenna',
    make(r) {
      const frac = [10, 20, 25, 40, 50][int(r, 0, 4)], I0 = int(r, 1, 12), eta = 376.730313;
      const R = (2 * Math.PI / 3) * eta / (frac * frac), answer = 0.5 * I0 * I0 * R;
      return {
        q: `<p>A short dipole antenna of length λ/${frac} carries a uniform current of amplitude ${I0} A. Find the time-averaged power it radiates, in W.</p>`,
        answer, unit: 'W', tol: 0.01,
        hint: 'Radiation resistance of a short dipole: R = (2π/3)η₀(l/λ)² ≈ 790(l/λ)² Ω. For a current of amplitude I₀, ⟨P⟩ = ½I₀²R.',
        solution: steps(`R = 789.6 × (1/${frac})² = ${R.toFixed(4)} Ω.`, `⟨P⟩ = ½ × ${I0}² × ${R.toFixed(4)} = <b>${answer.toFixed(3)} W</b>.`, `The pattern is sin²θ, so the peak intensity is 1.5 times the average over all directions.`),
        frac, I0,
      };
    },
    verify: (p) => { const mu0 = 1.25663706212e-6, c = 2.99792458e8, l = 1 / p.frac, w = 2 * Math.PI * c, p0 = (p.I0 * l) / w; return (mu0 * p0 * p0 * w ** 4) / (12 * Math.PI * c); },
  },
  'ced-boost': {
    title: 'electric and magnetic fields seen from a moving frame',
    make(r) {
      const E = int(r, 1, 9) * 1e5, B = int(r, 1, 9) * 1e-3, b = [0.2, 0.5, 0.6, 0.8][int(r, 0, 3)], ask = int(r, 0, 1) ? 'E' : 'B', c = 2.99792458e8;
      const g = 1 / Math.sqrt(1 - b * b), v = b * c, Ep = g * (E - v * B), Bp = g * (B - (v * E) / (c * c)), answer = ask === 'E' ? Ep / 1e5 : Bp * 1e3;
      return {
        q: `<p>In frame S, E = ${E.toExponential(0)} V/m along +y and B = ${B * 1e3} mT along +z. Frame S′ moves at ${b}c along +x. Find ${ask === 'E' ? 'E′<sub>y</sub> in units of 10⁵ V/m' : 'B′<sub>z</sub> in mT'} (with sign).</p>`,
        answer, unit: ask === 'E' ? '×10⁵ V/m' : 'mT', tol: 0.01, abs: 0.002,
        hint: 'Perpendicular components mix: E′⊥ = γ(E + v × B)⊥ and B′⊥ = γ(B − v × E/c²)⊥. With v along x, (v × B)_y = −vB_z and (v × E)_z = vE_y.',
        solution: steps(`γ = 1/√(1 − ${b}²) = ${g.toFixed(4)}, v = ${v.toExponential(4)} m/s.`, ask === 'E' ? `E′<sub>y</sub> = γ(E<sub>y</sub> − vB<sub>z</sub>) = ${g.toFixed(4)} × (${E.toExponential(1)} − ${(v * B).toExponential(4)}) = <b>${(Ep / 1e5).toFixed(3)}×10⁵ V/m</b>.` : `B′<sub>z</sub> = γ(B<sub>z</sub> − vE<sub>y</sub>/c²) = ${g.toFixed(4)} × (${B.toExponential(1)} − ${((v * E) / (c * c)).toExponential(4)}) = <b>${(Bp * 1e3).toFixed(4)} mT</b>.`, `Check the invariant: E′² − c²B′² = E² − c²B² = ${(E * E - c * c * B * B).toExponential(3)} V²/m².`),
        E, B, b, ask,
      };
    },
    verify: (p) => { const c = 2.99792458e8, g = 1 / Math.sqrt((1 - p.b) * (1 + p.b)), F02 = -p.E / c, F12 = -p.B; return p.ask === 'E' ? (-g * (F02 - p.b * F12) * c) / 1e5 : -g * (F12 - p.b * F02) * 1e3; },
  },
};

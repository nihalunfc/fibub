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
  // ---- 7.1 to 7.5 Solid state: lattices, diffraction, bonding, phonons, heat capacity ----
  'bz-volume': {
    title: 'volume of the first Brillouin zone',
    make(r) {
      const [name, n] = [['simple cubic', 1], ['body-centred cubic', 2], ['face-centred cubic', 4]][int(r, 0, 2)];
      const a = int(r, 280, 620) / 100, Vc = a ** 3 / n, answer = (2 * Math.PI) ** 3 / Vc;
      return {
        q: `<p>A ${name} crystal has conventional cube edge ${a} Å. Find the volume of its first Brillouin zone, in Å⁻³.</p>`,
        answer, unit: 'Å⁻³', tol: 0.005,
        hint: 'The zone volume is (2π)³ divided by the volume of a primitive cell, not of the cube. How many lattice points does the cube hold?',
        solution: steps(`The cube holds ${n} lattice point${n > 1 ? 's' : ''}, so the primitive cell has volume a³/${n} = ${Vc.toFixed(3)} Å³.`, `V_BZ = (2π)³/V_c = 248.05/${Vc.toFixed(3)} = <b>${answer.toFixed(3)} Å⁻³</b>.`),
        a, n,
      };
    },
    verify: (p) => (2 * Math.PI) ** 3 * p.n / p.a ** 3,
  },
  'zone-boundary-energy': {
    title: 'free-electron energy at a zone boundary',
    make(r) {
      const a = int(r, 25, 55) / 10, [where, m] = [['the centre of a face (X)', 1], ['the midpoint of an edge (M)', 2], ['a corner (R)', 3]][int(r, 0, 2)];
      const answer = 3.80998 * m * (Math.PI / a) ** 2;
      return {
        q: `<p>A simple cubic lattice has a = ${a} Å. A free electron has its wave vector ending at ${where} of the first Brillouin zone. Find its kinetic energy in eV (ħ²/2m = 3.810 eV Å²).</p>`,
        answer, unit: 'eV', tol: 0.005,
        hint: 'The zone is the cube |kₓ|, |k_y|, |k_z| ≤ π/a. Write the point as (π/a)(1,0,0), (1,1,0) or (1,1,1).',
        solution: steps(`k² = ${m}(π/a)² = ${(m * (Math.PI / a) ** 2).toFixed(4)} Å⁻².`, `E = (ħ²/2m)k² = 3.810 × ${(m * (Math.PI / a) ** 2).toFixed(4)} = <b>${answer.toFixed(3)} eV</b>.`),
        a, m,
      };
    },
    verify: (p) => 3.80998 * p.m * (Math.PI / p.a) ** 2,
  },
  'structure-factor-ab': {
    title: 'structure factor of a two-ion crystal',
    make(r) {
      const st = int(r, 0, 2), fA = int(r, 10, 50), fB = int(r, 5, 40);
      const lists = [[[1, 1, 1], [2, 0, 0], [2, 2, 0], [3, 1, 1]], [[1, 0, 0], [1, 1, 0], [1, 1, 1], [2, 0, 0]], [[1, 1, 1], [2, 0, 0], [2, 2, 0], [3, 1, 1]]];
      const [h, k, l] = lists[st][int(r, 0, 3)], s = h + k + l;
      let F2;
      if (st === 0) F2 = 16 * (fA + (s % 2 ? -1 : 1) * fB) ** 2; // rock salt, unmixed indices
      else if (st === 1) F2 = (fA + (s % 2 ? -1 : 1) * fB) ** 2; // CsCl
      else { const m = s % 4; F2 = m === 0 ? 16 * (fA + fB) ** 2 : m === 2 ? 16 * (fA - fB) ** 2 : 16 * (fA * fA + fB * fB); } // zinc blende
      const name = ['rock-salt (A on the fcc sites, B shifted by (½,½,½)a)', 'CsCl (A at the corner, B at the body centre)', 'zinc blende (A on the fcc sites, B shifted by (¼,¼,¼)a)'][st];
      // second, independent route: the explicit sum over the atoms of the conventional cell
      const FCC = [[0, 0, 0], [0, 0.5, 0.5], [0.5, 0, 0.5], [0.5, 0.5, 0]];
      const sites = st === 1 ? [[fA, [0, 0, 0]], [fB, [0.5, 0.5, 0.5]]] : [...FCC.map((p) => [fA, p]), ...FCC.map((p) => [fB, p.map((x) => x + (st === 0 ? 0.5 : 0.25))])];
      return {
        q: `<p>A crystal has the ${name} structure, with form factors f<sub>A</sub> = ${fA} and f<sub>B</sub> = ${fB}. Find |F<sub>${h}${k}${l}</sub>|².</p>`,
        answer: F2, unit: '', tol: 0.001,
        hint: st === 1 ? 'Two atoms: F = f_A + f_B e^{iπ(h+k+l)}.' : 'The four fcc translations give a factor 4 for unmixed indices. Then add the second atom with its phase e^{2πi(hx+ky+lz)}.',
        solution: steps(st === 0 ? `F = 4[f_A + f_B e^{iπ(h+k+l)}]; h+k+l = ${s} is ${s % 2 ? 'odd' : 'even'}, so F = 4(${fA} ${s % 2 ? '−' : '+'} ${fB}).` : st === 1 ? `F = f_A + f_B(−1)^{h+k+l}; h+k+l = ${s}, so F = ${fA} ${s % 2 ? '−' : '+'} ${fB}.` : `F = 4[f_A + f_B e^{iπ(h+k+l)/2}]; h+k+l = ${s}, so the phase factor of B is ${s % 4 === 0 ? '+1' : s % 4 === 2 ? '−1' : s % 4 === 1 ? '+i' : '−i'}.`, `|F|² = <b>${F2}</b>.`),
        hkl: [h, k, l], sites,
      };
    },
    verify: (p) => { let re = 0, im = 0; for (const [f, x] of p.sites) { const ph = 2 * Math.PI * (p.hkl[0] * x[0] + p.hkl[1] * x[1] + p.hkl[2] * x[2]); re += f * Math.cos(ph); im += f * Math.sin(ph); } return re * re + im * im; },
  },
  'debye-waller-loss': {
    title: 'Debye-Waller attenuation',
    make(r) {
      const u2 = int(r, 4, 30) / 1000, d = int(r, 7, 25) / 10, G = 2 * Math.PI / d, answer = Math.exp(-G * G * u2 / 3);
      return {
        q: `<p>Atoms vibrate with ⟨u²⟩ = ${u2} Å² (all directions together). What fraction of the static intensity survives in the reflection from planes ${d} Å apart? Use I/I₀ = exp(−G²⟨u²⟩/3).</p>`,
        answer, unit: '', tol: 0.005,
        hint: 'G = 2π/d for the reflecting planes.',
        solution: steps(`G = 2π/${d} = ${G.toFixed(4)} Å⁻¹, G² = ${(G * G).toFixed(3)} Å⁻².`, `Exponent G²⟨u²⟩/3 = ${(G * G * u2 / 3).toFixed(4)}.`, `I/I₀ = <b>${answer.toFixed(4)}</b>.`),
        u2, d,
      };
    },
    verify: (p) => Math.exp(-((2 * Math.PI / p.d) ** 2) * p.u2 / 3),
  },
  'born-lande': {
    title: 'Born-Landé lattice energy',
    make(r) {
      const [name, al] = [['NaCl', 1.7476], ['CsCl', 1.7627], ['ZnS', 1.6381]][int(r, 0, 2)], r0 = int(r, 200, 360) / 100, n = int(r, 6, 12);
      const answer = 1389.35 * al / r0 * (1 - 1 / n);
      return {
        q: `<p>An ionic crystal with the ${name} structure (α = ${al}) has nearest-neighbour distance ${r0} Å and Born exponent n = ${n}. Find its lattice energy in kJ/mol (N<sub>A</sub>e²/4πε₀ = 1389.35 kJ Å/mol).</p>`,
        answer, unit: 'kJ/mol', tol: 0.005,
        hint: 'At the minimum the repulsion cancels a fraction 1/n of the Madelung energy.',
        solution: steps(`Madelung energy per mole: 1389.35 × ${al}/${r0} = ${(1389.35 * al / r0).toFixed(1)} kJ/mol.`, `Times (1 − 1/n) = ${(1 - 1 / n).toFixed(4)}: <b>${answer.toFixed(1)} kJ/mol</b>.`),
        al, r0, n,
      };
    },
    verify: (p) => { const B = p.al * p.r0 ** (p.n - 1) / p.n; return -1389.35 * (-p.al / p.r0 + B / p.r0 ** p.n); },
  },
  'lj-stiffness': {
    title: 'Lennard-Jones spacing and spring constant',
    make(r) {
      const eps = int(r, 30, 250) / 10, sig = int(r, 260, 420) / 100, ask = int(r, 0, 1);
      const r0 = 2 ** (1 / 6) * sig, k = 72 * eps * 1e-3 / (2 ** (1 / 3) * sig * sig) * 16.0218;
      const answer = ask ? k : r0;
      return {
        q: `<p>Two atoms interact through a Lennard-Jones potential with ε = ${eps} meV and σ = ${sig} Å. Find ${ask ? 'the force constant U″(r₀) at the minimum, in N/m' : 'the separation r₀ at the minimum, in Å'}.</p>`,
        answer, unit: ask ? 'N/m' : 'Å', tol: 0.005,
        hint: ask ? 'At r₀, (σ/r₀)⁶ = ½. Differentiate twice: U″(r₀) = 72ε/r₀². Then 1 eV/Å² = 16.02 N/m.' : 'Set dU/dr = 0: r⁶ = 2σ⁶.',
        solution: ask ? steps(`r₀ = 2^{1/6}σ = ${r0.toFixed(4)} Å.`, `U″(r₀) = 72ε/r₀² = 72 × ${eps}×10⁻³/${(r0 * r0).toFixed(4)} = ${(k / 16.0218).toFixed(5)} eV/Å².`, `× 16.02 = <b>${k.toFixed(4)} N/m</b>.`) : steps('dU/dr = 4ε(−12σ¹²/r¹³ + 6σ⁶/r⁷) = 0 gives r⁶ = 2σ⁶.', `r₀ = 1.1225 × ${sig} = <b>${r0.toFixed(4)} Å</b>.`),
        eps, sig, ask,
      };
    },
    // independent check: numerical second derivative / numerical minimum of 4ε[(σ/r)^12 − (σ/r)^6]
    verify: (p) => {
      const U = (x) => 4 * p.eps * 1e-3 * ((p.sig / x) ** 12 - (p.sig / x) ** 6);
      let lo = p.sig, hi = 2 * p.sig; for (let i = 0; i < 80; i++) { const m1 = lo + (hi - lo) / 3, m2 = hi - (hi - lo) / 3; U(m1) < U(m2) ? hi = m2 : lo = m1; }
      const r0 = (lo + hi) / 2, h = 1e-4; return p.ask ? (U(r0 + h) - 2 * U(r0) + U(r0 - h)) / (h * h) * 16.0218 : r0;
    },
  },
  'chain-mode': {
    title: 'frequency of a mode on a monatomic chain',
    make(r) {
      const M = int(r, 10, 200), K = int(r, 5, 60), f = int(r, 1, 10) / 10, mu = 1.66054e-27;
      const answer = 2 * Math.sqrt(K / (M * mu)) * Math.sin(f * Math.PI / 2) / (2 * Math.PI) / 1e12;
      return {
        q: `<p>A chain of atoms of mass ${M} u is joined by springs of ${K} N/m. Find the frequency ν (in THz) of the wave with k = ${f} π/a.</p>`,
        answer, unit: 'THz', tol: 0.005,
        hint: 'ω = 2√(K/m)|sin(ka/2)|, and ν = ω/2π. Convert u to kg (1 u = 1.6605×10⁻²⁷ kg).',
        solution: steps(`√(K/m) = ${(Math.sqrt(K / (M * mu)) / 1e12).toFixed(4)}×10¹² s⁻¹.`, `ka/2 = ${(f * 90).toFixed(1)}°, sin = ${Math.sin(f * Math.PI / 2).toFixed(4)}.`, `ω = ${(2 * Math.sqrt(K / (M * mu)) * Math.sin(f * Math.PI / 2) / 1e12).toFixed(4)}×10¹² rad/s, so ν = <b>${answer.toFixed(3)} THz</b>.`),
        M, K, f,
      };
    },
    verify: (p) => Math.sqrt(2 * p.K / (p.M * 1.66054e-27) * (1 - Math.cos(p.f * Math.PI))) / (2 * Math.PI) / 1e12,
  },
  'diatomic-branches': {
    title: 'diatomic chain: optical frequency and gap',
    make(r) {
      const M2 = int(r, 6, 40), M1 = M2 + int(r, 6, 100), K = int(r, 10, 80), ask = int(r, 0, 1), mu = 1.66054e-27;
      const w0 = Math.sqrt(2 * K * (1 / (M1 * mu) + 1 / (M2 * mu))), lo = Math.sqrt(2 * K / (M1 * mu)), hi = Math.sqrt(2 * K / (M2 * mu));
      const answer = (ask ? hi - lo : w0) / 1e13;
      return {
        q: `<p>A diatomic chain has atoms of ${M1} u and ${M2} u joined alternately by springs of ${K} N/m. Find ${ask ? 'the width of the frequency gap at the zone boundary' : 'the optical-branch frequency at k = 0'}, in units of 10¹³ rad/s.</p>`,
        answer, unit: '×10¹³ rad/s', tol: 0.005,
        hint: ask ? 'At k = π/a only one kind of atom moves in each branch: ω = √(2K/M₁) and √(2K/M₂).' : 'At k = 0 the two atoms of a cell move against each other: ω² = 2K(1/M₁ + 1/M₂).',
        solution: ask ? steps(`√(2K/M₁) = ${(lo / 1e13).toFixed(4)}, √(2K/M₂) = ${(hi / 1e13).toFixed(4)} (×10¹³ rad/s).`, `Gap = <b>${answer.toFixed(4)}×10¹³ rad/s</b>.`) : steps(`1/M₁ + 1/M₂ = ${(1 / (M1 * mu) + 1 / (M2 * mu)).toExponential(4)} kg⁻¹.`, `ω = √(2K × that) = <b>${answer.toFixed(4)}×10¹³ rad/s</b>.`),
        M1, M2, K, ask,
      };
    },
    // independent check: roots of the full diatomic dispersion relation at ka = 0 and ka = π
    verify: (p) => {
      const mu = 1.66054e-27, m1 = p.M1 * mu, m2 = p.M2 * mu, s = 1 / m1 + 1 / m2;
      const w = (ka, sg) => Math.sqrt(p.K * (s + sg * Math.sqrt(Math.max(0, s * s - 4 * Math.sin(ka / 2) ** 2 / (m1 * m2)))));
      return (p.ask ? w(Math.PI, 1) - w(Math.PI, -1) : w(0, 1)) / 1e13;
    },
  },
  'einstein-debye-c': {
    title: 'heat capacity: Einstein or Debye T³',
    make(r) {
      const model = int(r, 0, 1), th = int(r, 10, 60) * 10;
      const T = model ? int(r, 2, Math.max(3, Math.floor(th / 40))) : int(r, Math.floor(th / 6), th * 2);
      const R = 8.314462618, x = th / T;
      const answer = model ? 12 * Math.PI ** 4 / 5 * R * (T / th) ** 3 * 1000 : 3 * R * x * x * Math.exp(x) / Math.expm1(x) ** 2;
      return {
        q: model ? `<p>A monatomic insulator has θ<sub>D</sub> = ${th} K. Using the Debye T³ law, find its molar heat capacity at ${T} K in mJ mol⁻¹ K⁻¹.</p>` : `<p>A monatomic solid has Einstein temperature θ<sub>E</sub> = ${th} K. Find its molar heat capacity at ${T} K in J mol⁻¹ K⁻¹ (Einstein model).</p>`,
        answer, unit: model ? 'mJ/(mol K)' : 'J/(mol K)', tol: 0.005,
        hint: model ? 'C = (12π⁴/5) R (T/θ_D)³, and 12π⁴R/5 = 1944 J mol⁻¹ K⁻¹.' : 'C = 3R x²eˣ/(eˣ − 1)² with x = θ_E/T.',
        solution: model ? steps(`(T/θ_D)³ = (${T}/${th})³ = ${((T / th) ** 3).toExponential(4)}.`, `C = 1944 × that = <b>${answer.toFixed(4)} mJ mol⁻¹ K⁻¹</b>.`) : steps(`x = ${th}/${T} = ${x.toFixed(4)}.`, `x²eˣ/(eˣ − 1)² = ${(x * x * Math.exp(x) / Math.expm1(x) ** 2).toFixed(4)}.`, `C = 24.94 × that = <b>${answer.toFixed(3)} J mol⁻¹ K⁻¹</b>.`),
        model, th, T,
      };
    },
    // independent check: Einstein as the temperature derivative of the mean energy; Debye T³ from 234 N k (T/θ)³
    verify: (p) => {
      const R = 8.314462618;
      if (p.model) return 233.78 * R * (p.T / p.th) ** 3 * 1000;
      const E = (T) => 3 * R * p.th / Math.expm1(p.th / T), h = 1e-3 * p.T; return (E(p.T + h) - E(p.T - h)) / (2 * h);
    },
  },
  // ---- 8.1 to 8.7 Nuclear and particle physics ----
  'charge-radius-mirror': {
    title: 'nuclear radius from a mirror-nucleus beta+ decay',
    make(r) {
      const L = [['¹¹C', '¹¹B', 11, 0.960], ['¹³N', '¹³C', 13, 1.199], ['¹⁵O', '¹⁵N', 15, 1.732], ['¹⁷F', '¹⁷O', 17, 1.738], ['¹⁹Ne', '¹⁹F', 19, 2.216], ['⁴¹Sc', '⁴¹Ca', 41, 5.474]];
      const [par, dau, A, Em] = L[int(r, 0, L.length - 1)], Z = (A - 1) / 2, dEC = Em + 1.804, answer = 1.2 * Z * 1.44 / dEC;
      return {
        q: `<p>The mirror pair ${par} → ${dau} decays by β⁺ emission with end-point energy ${Em} MeV. Treat each nucleus as a uniformly charged sphere of the same radius R, with Coulomb energy (3/5)Z(Z − 1)e²/(4πε₀R). Find R in fm, and r₀ = R/A<sup>1/3</sup>. (Use e²/4πε₀ = 1.44 MeV fm, (m_n − m_H)c² = 0.782 MeV and 2m_ec² = 1.022 MeV.)</p>`,
        answer, unit: 'fm', tol: 0.005,
        hint: 'Mirror nuclei have the same strong binding, so their mass difference is the Coulomb difference minus (m_n − m_H)c². The β⁺ end point is that mass difference minus 2m_ec².',
        solution: steps(`ΔE_C = E_max + 0.782 + 1.022 = ${dEC.toFixed(3)} MeV.`, `ΔE_C = (3/5)(e²/R)[(Z+1)Z − Z(Z−1)] = (6/5)Z e²/R with Z = ${Z}.`, `R = 1.2 × ${Z} × 1.44 / ${dEC.toFixed(3)} = <b>${answer.toFixed(3)} fm</b>, so r₀ = ${(answer / Math.cbrt(A)).toFixed(3)} fm.`),
        A, Z, Em,
      };
    },
    // independent check: Coulomb energies of the two members computed separately
    verify: (p) => { const EC = (z, R) => 0.6 * z * (z - 1) * 1.44 / R; const dE = p.Em + 1.804; return (EC(p.Z + 1, 1) - EC(p.Z, 1)) / dE; },
  },
  'semf-most-stable': {
    title: 'most stable isobar from the mass formula',
    make(r) {
      const A = int(r, 20, 240), ac = 0.714, aa = 23.2, answer = A / (2 + ac / (2 * aa) * A ** (2 / 3));
      return {
        q: `<p>Using the asymmetry and Coulomb terms of the semi-empirical mass formula (a_A = 23.2 MeV, a_C = 0.714 MeV, Coulomb term a_C Z²/A<sup>1/3</sup>), find the proton number Z₀ of the most strongly bound isobar with A = ${A}. Ignore the neutron-proton mass difference.</p>`,
        answer, unit: '', tol: 0.005,
        hint: 'Only the Coulomb and asymmetry terms depend on Z at fixed A. Set ∂B/∂Z = 0.',
        solution: steps('∂/∂Z [a_C Z²/A<sup>1/3</sup> + a_A(A − 2Z)²/A] = 0 gives 2a_C Z/A<sup>1/3</sup> = 4a_A(A − 2Z)/A.', `Z₀ = A/(2 + (a_C/2a_A)A<sup>2/3</sup>) = ${A}/(2 + ${(ac / (2 * aa)).toFixed(5)} × ${(A ** (2 / 3)).toFixed(3)}).`, `Z₀ = <b>${answer.toFixed(2)}</b>, so the stable isobar has Z = ${Math.round(answer)} (N/Z = ${((A - answer) / answer).toFixed(3)}).`),
        A,
      };
    },
    // independent check: minimise the Z-dependent energy numerically (golden-section search)
    verify: (p) => { const f = (Z) => 0.714 * Z * Z / Math.cbrt(p.A) + 23.2 * (p.A - 2 * Z) ** 2 / p.A; let a = 1, b = p.A / 2; for (let i = 0; i < 200; i++) { const c = b - (b - a) * 0.618, d = a + (b - a) * 0.618; if (f(c) < f(d)) b = d; else a = c; } return (a + b) / 2; },
  },
  'schmidt-moment': {
    title: 'Schmidt magnetic moment of an odd-A nucleus',
    make(r) {
      const L = 'spdfgh', l = int(r, 1, 5), up = int(r, 0, 1), pr = int(r, 0, 1), j = up ? l + 0.5 : l - 0.5;
      const gl = pr ? 1 : 0, gs = pr ? 5.586 : -3.826;
      const answer = up ? (j - 0.5) * gl + gs / 2 : j / (j + 1) * ((j + 1.5) * gl - gs / 2);
      return {
        q: `<p>The odd ${pr ? 'proton' : 'neutron'} of an odd-A nucleus sits in a ${L[l]}<sub>${2 * j}/2</sub> orbit. Find the Schmidt (single-particle) magnetic moment in nuclear magnetons. Use g_s = ${gs} and g_l = ${gl}.</p>`,
        answer, unit: 'μ_N', tol: 0.005,
        hint: up ? 'For j = l + ½: μ = (j − ½)g_l + g_s/2.' : 'For j = l − ½: μ = [j/(j + 1)][(j + 3/2)g_l − g_s/2].',
        solution: steps(`l = ${l}, j = ${2 * j}/2 = l ${up ? '+' : '−'} ½.`, up ? `μ = (${j} − 0.5)(${gl}) + ${gs}/2.` : `μ = (${j}/${j + 1})[(${j} + 1.5)(${gl}) − ${gs}/2].`, `μ = <b>${answer.toFixed(3)} μ_N</b>.`),
        l, j, pr,
      };
    },
    // independent check: Lande formula for g_j, then mu = g_j j
    verify: (p) => { const gl = p.pr ? 1 : 0, gs = p.pr ? 5.586 : -3.826, J = p.j * (p.j + 1), Lq = p.l * (p.l + 1), S = 0.75; return p.j * (gl * (J + Lq - S) + gs * (J - Lq + S)) / (2 * J); },
  },
  'alpha-gamow': {
    title: 'Gamow factor for alpha decay',
    make(r) {
      const Zd = int(r, 78, 92), A = 2 * Zd + int(r, 42, 56), T = int(r, 40, 90) / 10, R = +(1.2 * (Math.cbrt(A - 4) + Math.cbrt(4))).toFixed(2);
      const B = 2 * Zd * 1.44 / R, x = T / B, k = Math.sqrt(2 * 3727.379 * T) / 197.327;
      const answer = 2 * k * (2 * Zd * 1.44 / T) * (Math.acos(Math.sqrt(x)) - Math.sqrt(x * (1 - x)));
      return {
        q: `<p>An alpha particle of kinetic energy ${T} MeV leaves a daughter nucleus of charge Z = ${Zd}. The nuclear radius is R = ${R} fm. Find the Gamow exponent 2G in the tunnelling probability e<sup>−2G</sup>. (m_αc² = 3727.4 MeV, ħc = 197.33 MeV fm, e²/4πε₀ = 1.44 MeV fm.)</p>`,
        answer, unit: '', tol: 0.005,
        hint: '2G = (2/ħ)∫√(2m(V − T)) dr from R to the turning point b = 2Ze²/(4πε₀T). The integral has the closed form 2G = 2kb[arccos√x − √(x(1 − x))], with x = R/b and k = √(2mT)/ħ.',
        solution: steps(`b = 2 × ${Zd} × 1.44 / ${T} = ${(2 * Zd * 1.44 / T).toFixed(2)} fm, so x = R/b = ${x.toFixed(4)} (barrier height ${B.toFixed(2)} MeV).`, `k = √(2 × 3727.4 × ${T})/197.33 = ${k.toFixed(4)} fm⁻¹.`, `2G = 2kb[arccos√x − √(x(1 − x))] = <b>${answer.toFixed(2)}</b>, so e<sup>−2G</sup> = ${Math.exp(-answer).toExponential(2)}.`),
        Zd, T, R,
      };
    },
    // independent check: numerical integral of the WKB exponent (midpoint rule with a substitution near the turning point)
    verify: (p) => { const b = 2 * p.Zd * 1.44 / p.T, n = 20000; let s = 0; for (let i = 0; i < n; i++) { const u = (i + 0.5) / n, rr = b - (b - p.R) * u * u, V = 2 * p.Zd * 1.44 / rr; s += Math.sqrt(Math.max(0, 2 * 3727.379 * (V - p.T))) / 197.327 * 2 * u * (b - p.R) / n; } return 2 * s; },
  },
  'reaction-threshold-rel': {
    title: 'relativistic threshold of a fixed-target reaction',
    make(r) {
      const L = [['p + p → p + p + π⁰', 938.272, 938.272, [938.272, 938.272, 134.977]], ['p + p → p + p + p + p̄', 938.272, 938.272, [938.272, 938.272, 938.272, 938.272]], ['γ + p → p + π⁰', 0, 938.272, [938.272, 134.977]], ['π⁻ + p → K⁰ + Λ⁰', 139.570, 938.272, [497.611, 1115.683]], ['γ + p → K⁺ + Λ⁰', 0, 938.272, [493.677, 1115.683]], ['p + p → p + Λ⁰ + K⁺', 938.272, 938.272, [938.272, 1115.683, 493.677]], ['π⁻ + p → η + n', 139.570, 938.272, [547.862, 939.565]]];
      const [rx, ma, mX, mf] = L[int(r, 0, L.length - 1)], M = mf.reduce((s, x) => s + x, 0), answer = (M * M - (ma + mX) ** 2) / (2 * mX);
      return {
        q: `<p>Find the threshold kinetic energy of the beam particle (in MeV) for ${rx} on a target at rest. Masses (MeV/c²): ${[...new Set([ma, mX, ...mf])].filter((x) => x > 0).join(', ')}.</p>`,
        answer, unit: 'MeV', tol: 0.005,
        hint: 'At threshold the products are at rest in the centre-of-mass frame, so √s = Σm_f. With the target at rest, s = m_a² + m_X² + 2m_X E_a.',
        solution: steps(`Σm_f = ${M.toFixed(3)} MeV.`, `T_th = [(Σm_f)² − (m_a + m_X)²]/(2m_X) = (${(M * M).toFixed(0)} − ${((ma + mX) ** 2).toFixed(0)})/${(2 * mX).toFixed(3)}.`, `T_th = <b>${answer.toFixed(1)} MeV</b>, far more than the mass gained (${(M - ma - mX).toFixed(1)} MeV), because the centre of mass keeps moving.`),
        ma, mX, M,
      };
    },
    // independent check: solve for the beam energy that makes the CM energy equal the final masses (bisection on E_a)
    verify: (p) => { let lo = p.ma, hi = p.ma + 1e6; for (let i = 0; i < 200; i++) { const E = (lo + hi) / 2, pa = Math.sqrt(Math.max(0, E * E - p.ma * p.ma)), s = (E + p.mX) ** 2 - pa * pa; if (Math.sqrt(s) < p.M) lo = E; else hi = E; } return (lo + hi) / 2 - p.ma; },
  },
  'breit-wigner': {
    title: 'Breit-Wigner resonance: cross-section away from the peak',
    make(r) {
      const L = [['Δ(1232)', 1232, 117], ['ρ(770)', 775.3, 149], ['K*(892)', 891.7, 51.4], ['Σ(1385)', 1383.7, 36], ['Z⁰', 91188, 2495]];
      const [n, M, G] = L[int(r, 0, L.length - 1)], f = int(r, 1, 30) / 10 * (int(r, 0, 1) ? 1 : -1), E = +(M + f * G / 2).toFixed(1);
      const answer = 100 * (G * G / 4) / ((E - M) ** 2 + G * G / 4);
      return {
        q: `<p>The ${n} has mass ${M} MeV/c² and width Γ = ${G} MeV. Using the Breit-Wigner shape, what percentage of the peak cross-section is reached at E = ${E} MeV? Also find its mean life.</p>`,
        answer, unit: '%', tol: 0.005,
        hint: 'σ(E)/σ_peak = (Γ/2)² / [(E − M)² + (Γ/2)²]. At E = M ± Γ/2 it is exactly one half. The mean life is ħ/Γ.',
        solution: steps(`E − M = ${(E - M).toFixed(1)} MeV, Γ/2 = ${(G / 2).toFixed(2)} MeV.`, `σ/σ_peak = ${(G * G / 4).toFixed(1)}/(${((E - M) ** 2).toFixed(1)} + ${(G * G / 4).toFixed(1)}) = <b>${answer.toFixed(2)}%</b>.`, `τ = ħ/Γ = 6.582×10⁻²² MeV s / ${G} MeV = ${(6.582e-22 / G).toExponential(2)} s.`),
        M, G, E,
      };
    },
    // independent check: the same shape written as 1/(1 + x^2), x = 2(E - M)/Gamma
    verify: (p) => 100 / (1 + (2 * (p.E - p.M) / p.G) ** 2),
  },
  'invariant-mass': {
    title: 'invariant mass of a decay pair',
    make(r) {
      const L = [['π⁺', 'π⁻', 139.570, 139.570], ['p', 'π⁻', 938.272, 139.570], ['K⁺', 'K⁻', 493.677, 493.677], ['μ⁺', 'μ⁻', 105.658, 105.658], ['γ', 'γ', 0, 0]];
      const [a, b, m1, m2] = L[int(r, 0, L.length - 1)], p1 = int(r, 2, 40) * 50, p2 = int(r, 2, 40) * 50, th = int(r, 3, 60);
      const E1 = Math.hypot(p1, m1), E2 = Math.hypot(p2, m2), c = Math.cos(th * Math.PI / 180), answer = Math.sqrt(m1 * m1 + m2 * m2 + 2 * (E1 * E2 - p1 * p2 * c));
      return {
        q: `<p>A neutral particle decays in flight to ${a} and ${b}. They are measured with momenta ${p1} MeV/c and ${p2} MeV/c and an opening angle of ${th}°. Find the invariant mass of the pair in MeV/c². (Masses: ${a} ${m1}, ${b} ${m2} MeV/c².)</p>`,
        answer, unit: 'MeV/c²', tol: 0.005,
        hint: 'M²c⁴ = (E₁ + E₂)² − |p⃗₁ + p⃗₂|²c² = m₁² + m₂² + 2(E₁E₂ − p₁p₂ cos θ) in MeV units.',
        solution: steps(`E₁ = √(${p1}² + ${m1}²) = ${E1.toFixed(2)} MeV, E₂ = ${E2.toFixed(2)} MeV.`, `M² = ${m1}² + ${m2}² + 2(${E1.toFixed(2)} × ${E2.toFixed(2)} − ${p1} × ${p2} × cos ${th}°) = ${(answer * answer).toFixed(0)} MeV².`, `M = <b>${answer.toFixed(1)} MeV/c²</b>.`),
        m1, m2, p1, p2, th,
      };
    },
    // independent check: build the two four-vectors and take the length of their sum
    verify: (p) => { const t = p.th * Math.PI / 180, E = Math.hypot(p.p1, p.m1) + Math.hypot(p.p2, p.m2), px = p.p1 + p.p2 * Math.cos(t), py = p.p2 * Math.sin(t); return Math.sqrt(E * E - px * px - py * py); },
  },
  'survival-flight': {
    title: 'fraction of unstable particles surviving a flight path',
    make(r) {
      const L = [['K⁰_S', 497.611, 8.954e-11], ['Λ⁰', 1115.683, 2.632e-10], ['π⁺', 139.570, 2.6033e-8], ['K⁺', 493.677, 1.238e-8], ['μ⁺', 105.658, 2.1970e-6], ['Ξ⁻', 1321.71, 1.639e-10]];
      const [n, m, tau] = L[int(r, 0, L.length - 1)], p = int(r, 1, 30) * 100, ctau = 2.99792458e8 * tau, Ld = p / m * ctau, d = +(Ld * int(r, 2, 25) / 10).toPrecision(2);
      const answer = 100 * Math.exp(-d / Ld);
      return {
        q: `<p>A beam of ${n} (mc² = ${m} MeV, mean life ${tau.toExponential(3)} s) has momentum ${p} MeV/c. What percentage of the particles survive a flight of ${d} m?</p>`,
        answer, unit: '%', tol: 0.005,
        hint: 'The mean decay length is βγcτ = (p/mc)cτ. Survival follows exp(−d/βγcτ).',
        solution: steps(`cτ = ${ctau.toPrecision(4)} m and βγ = p/mc = ${(p / m).toFixed(4)}.`, `Mean decay length = ${Ld.toPrecision(4)} m.`, `Survival = exp(−${d}/${Ld.toPrecision(4)}) = <b>${answer.toFixed(2)}%</b>.`),
        m, tau, p, d,
      };
    },
    // independent check: lab flight time against the dilated lifetime
    verify: (p) => { const E = Math.hypot(p.p, p.m), beta = p.p / E, gamma = E / p.m, t = p.d / (beta * 2.99792458e8); return 100 * Math.exp(-t / (gamma * p.tau)); },
  },
};

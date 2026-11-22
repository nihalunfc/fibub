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
  // ---- module 5: statistical physics ----
  'stat-boltzmann-ratio': {
    title: 'population ratio of two degenerate levels',
    make(r) {
      const g1 = int(r, 1, 3), g2 = int(r, 1, 5), dE = int(r, 5, 60), T = [100, 200, 300, 500][int(r, 0, 3)];
      const kT = 8.617333e-5 * T * 1000, answer = (g2 / g1) * Math.exp(-dE / kT);
      return {
        q: `<p>A lower level (degeneracy ${g1}) and an upper level (degeneracy ${g2}) are ${dE} meV apart. Find N<sub>upper</sub>/N<sub>lower</sub> in equilibrium at ${T} K.</p>`,
        answer, unit: '', tol: 0.01,
        hint: 'Canonical ensemble: each microstate has weight e<sup>−E/kT</sup>, and a level contains g microstates.',
        solution: steps(`kT = 8.617×10⁻⁵ × ${T} eV = ${kT.toFixed(3)} meV.`, `Boltzmann factor e<sup>−${dE}/${kT.toFixed(3)}</sup> = ${Math.exp(-dE / kT).toFixed(5)}.`, `Multiply by g₂/g₁ = ${g2}/${g1}: ratio = <b>${answer.toFixed(5)}</b>.`),
        g1, g2, dE, T,
      };
    },
    verify: (p) => (p.g2 / p.g1) * Math.exp(-p.dE / (8.617333e-5 * p.T * 1000)),
  },
  'stat-schottky': {
    title: 'heat capacity of a two-level system',
    make(r) {
      const eps = int(r, 2, 40), T = int(r, 5, 200);
      const x = eps / (8.617333e-5 * T * 1000), answer = (x * x * Math.exp(x)) / (1 + Math.exp(x)) ** 2;
      return {
        q: `<p>Paramagnetic ions have two non-degenerate levels ${eps} meV apart. Find the heat capacity per ion, in units of k, at ${T} K.</p>`,
        answer, unit: 'k', tol: 0.01, abs: 1e-4,
        hint: 'Z = 1 + e<sup>−x</sup> with x = ε/kT. Find U = ε/(e<sup>x</sup> + 1), then C = dU/dT.',
        solution: steps(`x = ε/kT = ${eps}/${(8.617333e-5 * T * 1000).toFixed(3)} = ${x.toFixed(4)}.`, `C/k = x²eˣ/(1 + eˣ)² = ${(x * x).toFixed(4)} × ${Math.exp(x).toFixed(4)} / ${((1 + Math.exp(x)) ** 2).toFixed(4)}.`, `C/k = <b>${answer.toFixed(4)}</b>. The largest possible value is 0.439, at x = 2.40.`),
        eps, T,
      };
    },
    verify: (p) => { const x = p.eps / (8.617333e-5 * p.T * 1000); return (x * x * Math.exp(x)) / (1 + Math.exp(x)) ** 2; },
  },
  'stat-sackur-tetrode': {
    title: 'Sackur-Tetrode entropy of a noble gas',
    make(r) {
      const [name, M] = [['helium', 4.0026], ['neon', 20.18], ['argon', 39.948], ['krypton', 83.798], ['xenon', 131.29]][int(r, 0, 4)];
      const T = [100, 200, 300, 500, 1000][int(r, 0, 4)], P = [0.1, 1, 10][int(r, 0, 2)];
      const k = 1.380649e-23, h = 6.62607015e-34, m = M * 1.66053906660e-27;
      const lam = h / Math.sqrt(2 * Math.PI * m * k * T), vN = k * T / (P * 1e5), answer = 8.314462618 * (Math.log(vN / lam ** 3) + 2.5);
      return {
        q: `<p>Find the molar entropy of ${name} (m = ${M} u) at ${T} K and ${P} bar, treating it as a classical ideal gas.</p>`,
        answer, unit: 'J mol⁻¹ K⁻¹', tol: 0.005,
        hint: 'S = Nk[ln(V/Nλ³) + 5/2] with λ = h/√(2πmkT) and V/N = kT/P.',
        solution: steps(`λ = h/√(2πmkT) = ${lam.toExponential(4)} m.`, `V/N = kT/P = ${vN.toExponential(4)} m³.`, `ln(V/Nλ³) = ${Math.log(vN / lam ** 3).toFixed(4)}; add 2.5 and multiply by R: S = <b>${answer.toFixed(2)}</b> J mol⁻¹ K⁻¹.`),
        M, T, P,
      };
    },
    verify: (p) => { const k = 1.380649e-23, lam = 6.62607015e-34 / Math.sqrt(2 * Math.PI * p.M * 1.66053906660e-27 * k * p.T); return 8.314462618 * (Math.log((k * p.T / (p.P * 1e5)) / lam ** 3) + 2.5); },
  },
  'stat-occupation': {
    title: 'Fermi-Dirac and Bose-Einstein occupations',
    make(r) {
      const fd = r() < 0.5, x = [0.25, 0.5, 1, 1.5, 2, 3][int(r, 0, 5)] * (fd && r() < 0.4 ? -1 : 1);
      const answer = fd ? 1 / (Math.exp(x) + 1) : 1 / (Math.exp(Math.abs(x)) - 1);
      const xx = fd ? x : Math.abs(x);
      return {
        q: `<p>A single-particle state lies ${xx < 0 ? `${-xx} kT below` : `${xx} kT above`} the chemical potential of an ideal ${fd ? 'Fermi' : 'Bose'} gas. Find its mean occupation.</p>`,
        answer, unit: '', tol: 0.005, abs: 1e-4,
        hint: fd ? 'Fermi-Dirac: 1/(e<sup>(ε−μ)/kT</sup> + 1); it is 1/2 at ε = μ.' : 'Bose-Einstein: 1/(e<sup>(ε−μ)/kT</sup> − 1); it can exceed 1.',
        solution: steps(`(ε − μ)/kT = ${xx}, e<sup>${xx}</sup> = ${Math.exp(xx).toFixed(4)}.`, `⟨n⟩ = 1/(${Math.exp(xx).toFixed(4)} ${fd ? '+' : '−'} 1) = <b>${answer.toFixed(4)}</b>.`, `Maxwell-Boltzmann would give e<sup>${-xx}</sup> = ${Math.exp(-xx).toFixed(4)}.`),
        fd, xx,
      };
    },
    verify: (p) => (p.fd ? 1 / (Math.exp(p.xx) + 1) : 1 / (Math.exp(p.xx) - 1)),
  },
  'stat-photon-gas': {
    title: 'photon number and energy in a cavity',
    make(r) {
      const T = [3, 300, 1000, 3000, 6000][int(r, 0, 4)], what = r() < 0.5 ? 'n' : 'E';
      const k = 1.380649e-23, hb = 1.054571817e-34, c = 2.99792458e8;
      const n = (2 * 1.2020569 / Math.PI ** 2) * (k * T / (hb * c)) ** 3, answer = what === 'n' ? n : 2.701 * k * T / 1.602176634e-19;
      return {
        q: what === 'n' ? `<p>How many photons per cubic metre are there in blackbody radiation at ${T} K?</p>` : `<p>What is the mean energy, in eV, of a photon in blackbody radiation at ${T} K?</p>`,
        answer, unit: what === 'n' ? 'm⁻³' : 'eV', tol: 0.01,
        hint: what === 'n' ? 'n = (2ζ(3)/π²)(kT/ħc)³ with ζ(3) = 1.202.' : 'Divide u = aT⁴ by n: the mean is π⁴kT/(30ζ(3)) = 2.70 kT.',
        solution: what === 'n' ? steps(`kT/ħc = ${(k * T / (hb * c)).toFixed(2)} m⁻¹.`, `Cube it and multiply by 2×1.202/π² = 0.2436: n = <b>${n.toExponential(3)}</b> m⁻³.`) : steps(`kT = ${(k * T / 1.602176634e-19).toExponential(4)} eV.`, `Mean energy = 2.701 kT = <b>${answer.toExponential(4)}</b> eV.`),
        T, what,
      };
    },
    verify: (p) => { const k = 1.380649e-23; return p.what === 'n' ? (2 * 1.2020569 / Math.PI ** 2) * (k * p.T / (1.054571817e-34 * 2.99792458e8)) ** 3 : 2.701 * k * p.T / 1.602176634e-19; },
  },
  'stat-bec': {
    title: 'Bose-Einstein condensation temperature',
    make(r) {
      const [name, M] = [['⁸⁷Rb', 86.909], ['²³Na', 22.99], ['⁷Li', 7.016], ['¹³³Cs', 132.905]][int(r, 0, 3)], e = int(r, 18, 20), a = [1, 2, 5][int(r, 0, 2)];
      const n = a * 10 ** e, m = M * 1.66053906660e-27, hb = 1.054571817e-34, k = 1.380649e-23;
      const answer = (2 * Math.PI * hb * hb / (m * k)) * (n / 2.612) ** (2 / 3) * 1e9;
      return {
        q: `<p>A uniform gas of ${name} atoms (m = ${M} u) has density ${a}×10<sup>${e}</sup> m⁻³. At what temperature (in nK) would it Bose-condense if ideal?</p>`,
        answer, unit: 'nK', tol: 0.01,
        hint: 'Condensation starts when nλ³ = ζ(3/2) = 2.612, with λ = h/√(2πmkT).',
        solution: steps(`Solve n(h²/2πmkT)<sup>3/2</sup> = 2.612 for T: T<sub>c</sub> = (2πħ²/mk)(n/2.612)<sup>2/3</sup>.`, `2πħ²/mk = ${(2 * Math.PI * hb * hb / (m * k)).toExponential(4)} m² K; (n/2.612)<sup>2/3</sup> = ${((n / 2.612) ** (2 / 3)).toExponential(4)} m⁻².`, `T<sub>c</sub> = <b>${answer.toFixed(1)}</b> nK.`),
        M, n,
      };
    },
    verify: (p) => (2 * Math.PI * 1.054571817e-34 ** 2 / (p.M * 1.66053906660e-27 * 1.380649e-23)) * (p.n / 2.612) ** (2 / 3) * 1e9,
  },
  'stat-fermi-energy': {
    title: 'Fermi energy and electronic heat capacity of a metal',
    make(r) {
      const [name, n] = [['sodium', 2.65e28], ['potassium', 1.40e28], ['copper', 8.47e28], ['silver', 5.86e28], ['aluminium', 18.1e28]][int(r, 0, 4)], T = [10, 77, 300][int(r, 0, 2)];
      const hb = 1.054571817e-34, me = 9.1093837015e-31, kF = (3 * Math.PI ** 2 * n) ** (1 / 3), EF = (hb * kF) ** 2 / (2 * me), TF = EF / 1.380649e-23;
      const answer = (Math.PI ** 2 / 2) * T / TF;
      return {
        q: `<p>${name[0].toUpperCase() + name.slice(1)} has ${(n / 1e28).toFixed(2)}×10²⁸ free electrons per m³. Find its electronic heat capacity per electron, in units of k, at ${T} K.</p>`,
        answer, unit: 'k', tol: 0.01, abs: 1e-6,
        hint: 'First E<sub>F</sub> = ħ²(3π²n)<sup>2/3</sup>/2m and T<sub>F</sub> = E<sub>F</sub>/k; then C/Nk = (π²/2)(T/T<sub>F</sub>).',
        solution: steps(`k<sub>F</sub> = (3π²n)<sup>1/3</sup> = ${kF.toExponential(4)} m⁻¹; E<sub>F</sub> = ${(EF / 1.602176634e-19).toFixed(3)} eV; T<sub>F</sub> = ${TF.toExponential(4)} K.`, `C/Nk = 4.935 × ${T}/${TF.toExponential(4)} = <b>${answer.toExponential(4)}</b>.`, 'Tiny: only electrons within about kT of the Fermi level can take up heat.'),
        n, T,
      };
    },
    verify: (p) => { const kF = (3 * Math.PI ** 2 * p.n) ** (1 / 3), EF = (1.054571817e-34 * kF) ** 2 / (2 * 9.1093837015e-31); return (Math.PI ** 2 / 2) * p.T / (EF / 1.380649e-23); },
  },
  'stat-mean-field': {
    title: 'mean-field magnetisation',
    make(r) {
      const z = [4, 6, 8][int(r, 0, 2)], J = [1, 2, 3][int(r, 0, 2)], t = [0.3, 0.5, 0.7, 0.8, 0.9][int(r, 0, 4)];
      const Tc = z * J * 1e-3 / 8.617333e-5, T = t * Tc;
      let m = 1; for (let i = 0; i < 3000; i++) m = Math.tanh(m / t);
      return {
        q: `<p>An Ising ferromagnet has z = ${z} neighbours per spin and J = ${J} meV. In mean-field theory, find the spontaneous magnetisation per spin (between 0 and 1) at T = ${T.toFixed(1)} K.</p>`,
        answer: m, unit: '', tol: 0.005,
        hint: 'kT<sub>c</sub> = zJ. Then solve m = tanh(m T<sub>c</sub>/T) by iteration, starting from m = 1.',
        solution: steps(`T<sub>c</sub> = zJ/k = ${(z * J)} meV / k = ${Tc.toFixed(1)} K, so T/T<sub>c</sub> = ${t}.`, `Iterate m → tanh(m/${t}): 1 → ${Math.tanh(1 / t).toFixed(4)} → ${Math.tanh(Math.tanh(1 / t) / t).toFixed(4)} → …`, `It settles at m = <b>${m.toFixed(4)}</b>.`),
        t,
      };
    },
    verify: (p) => { let m = 1; for (let i = 0; i < 3000; i++) m = Math.tanh(m / p.t); return m; },
  },
  'stat-clapeyron': {
    title: 'vapour pressure from the Clausius-Clapeyron equation',
    make(r) {
      const [liq, L, Tb] = [['water', 40.7, 373.15], ['ethanol', 38.6, 351.4], ['benzene', 30.7, 353.2], ['nitrogen', 5.57, 77.36]][int(r, 0, 3)], dT = [-15, -10, -5, 5, 10][int(r, 0, 4)];
      const T2 = Tb + dT, answer = Math.exp(-(L * 1000 / 8.314462618) * (1 / T2 - 1 / Tb));
      return {
        q: `<p>${liq[0].toUpperCase() + liq.slice(1)} boils at ${Tb} K at 1 atm, with molar latent heat ${L} kJ/mol. Estimate its vapour pressure (in atm) at ${T2.toFixed(2)} K.</p>`,
        answer, unit: 'atm', tol: 0.005,
        hint: 'With an ideal vapour and v<sub>liquid</sub> ≪ v<sub>vapour</sub>, d ln P/dT = L/RT².',
        solution: steps(`Integrate: ln(P₂/P₁) = −(L/R)(1/T₂ − 1/T₁).`, `= −(${L * 1000}/8.314)(1/${T2.toFixed(2)} − 1/${Tb}) = ${Math.log(answer).toFixed(4)}.`, `P₂ = e<sup>${Math.log(answer).toFixed(4)}</sup> atm = <b>${answer.toFixed(4)}</b> atm.`),
        L, Tb, T2,
      };
    },
    verify: (p) => Math.exp(-(p.L * 1000 / 8.314462618) * (1 / p.T2 - 1 / p.Tb)),
  },
};

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
};

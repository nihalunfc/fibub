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
  // ---- 4.6 to 4.11 quantum mechanics (hydrogen atom to identical particles) ----
  'hyd-inside': {
    title: 'probability of finding the 1s electron inside a sphere',
    make(r) {
      const R = [0.25, 0.5, 0.75, 1, 1.5, 2, 3][int(r, 0, 6)];
      const x = 2 * R, answer = 1 - Math.exp(-x) * (1 + x + x * x / 2);
      return {
        q: `<p>A hydrogen atom is in its ground state, ψ = (πa₀³)<sup>−1/2</sup> e<sup>−r/a₀</sup>. Find the probability that the electron is closer to the nucleus than ${R} a₀.</p>`,
        answer, unit: '', tol: 0.005,
        hint: 'The probability in a shell is |ψ|² 4πr² dr = (4r²/a₀³) e^(−2r/a₀) dr. Substitute x = 2r/a₀ and use ∫₀ˣ t² e^(−t) dt = 2 − e^(−x)(x² + 2x + 2).',
        solution: steps(`P = ∫₀^R (4r²/a₀³) e^(−2r/a₀) dr = ½ ∫₀^${x} t² e^(−t) dt with t = 2r/a₀.`, `½[2 − e^(−${x})(${x * x} + ${2 * x} + 2)] = 1 − e^(−${x})(1 + ${x} + ${x * x / 2}).`, `P = <b>${answer.toFixed(4)}</b>${R === 1 ? ': less than a third, although a₀ is the most probable radius' : ''}.`),
        R,
      };
    },
    verify(p) { let s = 0; const N = 20000, h = p.R / N; for (let i = 0; i < N; i++) { const r = (i + 0.5) * h; s += 4 * r * r * Math.exp(-2 * r) * h; } return s; },
  },
  'cg-spin-up': {
    title: 'a Clebsch-Gordan probability for l plus spin ½',
    make(r) {
      const l = int(r, 1, 3), up = r() < 0.5, j = up ? l + 0.5 : l - 0.5, m = int(r, 0, 2 * j) - j;
      const answer = (up ? l + m + 0.5 : l - m + 0.5) / (2 * l + 1);
      const h = (x) => (Number.isInteger(x) ? String(x) : `${Math.round(2 * x)}/2`);
      return {
        q: `<p>An electron with l = ${l} is in the coupled state |j = ${h(j)}, m = ${h(m)}⟩. Find the probability that a measurement of S<sub>z</sub> gives +ħ/2.</p>`,
        answer, unit: '', tol: 0.005, abs: 0.002,
        hint: 'For j = l + ½: |j, m⟩ = √[(l + m + ½)/(2l + 1)] |m − ½, ↑⟩ + √[(l − m + ½)/(2l + 1)] |m + ½, ↓⟩. For j = l − ½ the two weights swap. Or use the projection theorem: ⟨S_z⟩ = m⟨S·J⟩/j(j+1), and P(↑) = ½ + ⟨S_z⟩/ħ.',
        solution: steps(`j = l ${up ? '+' : '−'} ½, so P(↑) = (l ${up ? '+' : '−'} m + ½)/(2l + 1) = ${(up ? l + m + 0.5 : l - m + 0.5)}/${2 * l + 1}.`, `Check: S·J = ½[j(j+1) + ¾ − l(l+1)]ħ² = ${((j * (j + 1) + 0.75 - l * (l + 1)) / 2).toFixed(3)}ħ², so ⟨S_z⟩ = m·${((j * (j + 1) + 0.75 - l * (l + 1)) / 2).toFixed(3)}/${(j * (j + 1)).toFixed(3)} ħ = ${(answer - 0.5).toFixed(4)}ħ.`, `P(↑) = ½ + ⟨S_z⟩/ħ = <b>${answer.toFixed(4)}</b>.`),
        l, j, m,
      };
    },
    verify: (p) => 0.5 + p.m * (p.j * (p.j + 1) + 0.75 - p.l * (p.l + 1)) / (2 * p.j * (p.j + 1)),
  },
  'pt-three-level': {
    title: 'second-order shift against the exact answer',
    make(r) {
      const e2 = int(r, 2, 5), e3 = e2 + int(r, 2, 5), v2 = [0.2, 0.3, 0.4, 0.5][int(r, 0, 3)], v3 = [0.3, 0.5, 0.8][int(r, 0, 2)];
      const answer = -(v2 * v2 / e2 + v3 * v3 / e3);
      return {
        q: `<p>H₀ = diag(0, ${e2}, ${e3}) meV. A perturbation has zero diagonal elements, H′₁₂ = ${v2} meV, H′₁₃ = ${v3} meV and H′₂₃ = 0. Find the second-order shift of the lowest level in meV.</p>`,
        answer, unit: 'meV', tol: 0.005,
        hint: 'E₁⁽²⁾ = Σ |H′ₘ₁|² / (E₁ − Eₘ) over m ≠ 1. For the ground state every denominator is negative.',
        solution: steps(`E₁⁽²⁾ = ${v2}²/(0 − ${e2}) + ${v3}²/(0 − ${e3}).`, `= −${(v2 * v2 / e2).toFixed(4)} − ${(v3 * v3 / e3).toFixed(4)} = <b>${answer.toFixed(4)} meV</b>.`, 'The exact lowest eigenvalue of the 3×3 matrix agrees to within the fourth-order terms, which are small (here a per cent or two) when H′ is much smaller than the level spacings.'),
        e2, e3, v2, v3,
      };
    },
    verify(p) { // exact lowest eigenvalue with the perturbation scaled by λ = 0.001, divided by λ²: the second-order coefficient
      const lam = 1e-3, a = (lam * p.v2) ** 2, b = (lam * p.v3) ** 2;
      let E = 0; for (let k = 0; k < 50; k++) { const f = E - a / (E - p.e2) - b / (E - p.e3), d = 1 + a / (E - p.e2) ** 2 + b / (E - p.e3) ** 2; E -= f / d; }
      return E / (lam * lam);
    },
  },
  'wkb-barrier': {
    title: 'WKB tunnelling through a triangular barrier',
    make(r) {
      const V0 = [1, 2, 3, 4][int(r, 0, 3)], L = [0.5, 1, 1.5, 2][int(r, 0, 3)];
      const answer = (4 / 3) * 5.1232 * Math.sqrt(V0) * L; // 2∫κ dx for V − E falling linearly from V0 to 0 over L
      return {
        q: `<p>An electron meets a barrier whose height above its energy falls linearly from ${V0} eV to 0 over ${L} nm. Find the WKB exponent 2∫κ dx (so that T ≈ e<sup>−exponent</sup>). Use √(2m<sub>e</sub>·1 eV)/ħ = 5.123 nm⁻¹.</p>`,
        answer, unit: '', tol: 0.005,
        hint: 'κ(x) = √(2m(V − E))/ħ = 5.123 √(ΔV(x)/eV) nm⁻¹ with ΔV = V₀(1 − x/L). The integral of √(1 − x/L) from 0 to L is 2L/3.',
        solution: steps(`κ(x) = 5.123 √${V0} √(1 − x/L) nm⁻¹.`, `∫₀ᴸ √(1 − x/L) dx = 2L/3, so 2∫κ dx = 2 × 5.123 √${V0} × 2(${L})/3.`, `Exponent = <b>${answer.toFixed(3)}</b>, T ≈ ${Math.exp(-answer).toExponential(2)}. A rectangular barrier of the same peak and width would give ${(2 * 5.1232 * Math.sqrt(V0) * L).toFixed(2)}.`),
        V0, L,
      };
    },
    verify(p) { let s = 0; const N = 20000, h = p.L / N; for (let i = 0; i < N; i++) { const x = (i + 0.5) * h; s += 5.1232 * Math.sqrt(p.V0 * (1 - x / p.L)) * h; } return 2 * s; },
  },
  'rabi-detuned': {
    title: 'a detuned Rabi pulse',
    make(r) {
      const O = int(r, 1, 4), D = int(r, 0, 4), t = [0.1, 0.15, 0.2, 0.25, 0.4][int(r, 0, 4)];
      const W = Math.sqrt(O * O + D * D), answer = (O * O / (W * W)) * Math.sin(Math.PI * W * t) ** 2;
      return {
        q: `<p>A two-level atom starts in its lower state and is driven with Rabi frequency Ω = 2π × ${O} MHz at detuning Δ = 2π × ${D} MHz. Find the probability of the upper state after ${t} µs.</p>`,
        answer, unit: '', tol: 0.005, abs: 0.002,
        hint: 'P(t) = (Ω²/W²) sin²(Wt/2) with W = √(Ω² + Δ²). With everything written as 2π × (MHz), Wt/2 = π × (W in MHz) × (t in µs).',
        solution: steps(`W = 2π × √(${O * O} + ${D * D}) MHz = 2π × ${(W).toFixed(3)} MHz.`, `Wt/2 = π × ${W.toFixed(3)} × ${t} = ${(Math.PI * W * t).toFixed(4)} rad.`, `P = (${O * O}/${(W * W).toFixed(0)}) × sin²(${(Math.PI * W * t).toFixed(4)}) = <b>${answer.toFixed(4)}</b>.`),
        O, D, t,
      };
    },
    verify(p) { // integrate the rotating-frame Schrödinger equation with RK4 (units: MHz and µs, ħ = 1)
      const w = 2 * Math.PI, Om = w * p.O, De = w * p.D, n = 4000, h = p.t / n;
      let a = [1, 0], b = [0, 0]; // complex amplitudes [re, im]
      const der = (A, B) => { const ha = [-De / 2 * A[0] + Om / 2 * B[0], -De / 2 * A[1] + Om / 2 * B[1]], hb = [Om / 2 * A[0] + De / 2 * B[0], Om / 2 * A[1] + De / 2 * B[1]]; return [[ha[1], -ha[0]], [hb[1], -hb[0]]]; };
      for (let i = 0; i < n; i++) {
        const k1 = der(a, b), a2 = [a[0] + h / 2 * k1[0][0], a[1] + h / 2 * k1[0][1]], b2 = [b[0] + h / 2 * k1[1][0], b[1] + h / 2 * k1[1][1]];
        const k2 = der(a2, b2), a3 = [a[0] + h / 2 * k2[0][0], a[1] + h / 2 * k2[0][1]], b3 = [b[0] + h / 2 * k2[1][0], b[1] + h / 2 * k2[1][1]];
        const k3 = der(a3, b3), a4 = [a[0] + h * k3[0][0], a[1] + h * k3[0][1]], b4 = [b[0] + h * k3[1][0], b[1] + h * k3[1][1]];
        const k4 = der(a4, b4);
        for (const c of [0, 1]) { a[c] += h / 6 * (k1[0][c] + 2 * k2[0][c] + 2 * k3[0][c] + k4[0][c]); b[c] += h / 6 * (k1[1][c] + 2 * k2[1][c] + 2 * k3[1][c] + k4[1][c]); }
      }
      return b[0] ** 2 + b[1] ** 2;
    },
  },
  'fermi-fill': {
    title: 'filling a well with electrons',
    make(r) {
      const N = int(r, 2, 11), well = r() < 0.5;
      let E = 0; for (let k = 0; k < N; k++) { const n = Math.floor(k / 2); E += well ? (n + 1) ** 2 : n + 0.5; }
      return {
        q: `<p>${N} non-interacting electrons are placed in a 1D ${well ? 'infinite square well (levels n²E₁)' : 'harmonic oscillator (levels (n + ½)ħω)'}. Find the ground-state energy in units of ${well ? 'E₁' : 'ħω'}.</p>`,
        answer: E, unit: well ? 'E₁' : 'ħω', tol: 0.001,
        hint: 'Electrons are fermions with two spin states, so each spatial level holds two of them (spin up and spin down). Fill from the bottom.',
        solution: steps(`Levels filled: ${Math.floor(N / 2)} full level${Math.floor(N / 2) === 1 ? '' : 's'}${N % 2 ? ' and one electron in the next' : ''}.`, `E = ${Array.from({ length: N }, (_, k) => (well ? (Math.floor(k / 2) + 1) ** 2 : Math.floor(k / 2) + 0.5)).join(' + ')}.`, `E = <b>${E} ${well ? 'E₁' : 'ħω'}</b>. Spinless fermions would need one level each; bosons would all sit in the lowest level.`),
        N, well,
      };
    },
    verify(p) { const lv = []; for (let n = 0; n < 20; n++) { const e = p.well ? (n + 1) ** 2 : n + 0.5; lv.push(e, e); } lv.sort((a, b) => a - b); return lv.slice(0, p.N).reduce((s, x) => s + x, 0); },
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
};

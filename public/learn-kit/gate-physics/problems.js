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
  // ---------- 3.1 Boundary value problems ----------
  'sphere-legendre': {
    title: 'potential from a Legendre expansion on a sphere',
    make(r) {
      const a = int(r, 0, 3) * 10, b = int(r, 1, 4) * 10, g = int(r, 1, 4) * 15, k = [1.5, 2, 3][int(r, 0, 2)];
      const A0 = a + g / 3, A1 = b, A2 = 2 * g / 3;
      const answer = A0 / k + A1 / k ** 2 + A2 / k ** 3;
      return {
        q: `<p>A thin spherical surface of radius R is held at V(θ) = ${a ? a + ' + ' : ''}${b} cos θ + ${g} cos²θ volts, with no other charges anywhere. Find the potential on the +z axis at r = ${k}R, in volts.</p>`,
        answer, unit: 'V', tol: 0.01,
        hint: 'Rewrite cos²θ as 1/3 + (2/3)P₂(cos θ). Outside, each Legendre term A<sub>l</sub>P<sub>l</sub> becomes A<sub>l</sub>(R/r)<sup>l+1</sup>P<sub>l</sub>, and on the axis every P<sub>l</sub> = 1.',
        solution: steps(`Legendre coefficients: A₀ = ${a} + ${g}/3 = ${+A0.toFixed(3)}, A₁ = ${b}, A₂ = 2×${g}/3 = ${+A2.toFixed(3)}.`, `Outside: V = A₀(R/r) + A₁(R/r)²cos θ + A₂(R/r)³P₂(cos θ).`, `At r = ${k}R on the axis: ${+A0.toFixed(3)}/${k} + ${b}/${k ** 2} + ${+A2.toFixed(3)}/${+(k ** 3).toFixed(3)} = <b>${answer.toFixed(3)} V</b>.`),
        A0, A1, A2, k,
      };
    },
    verify: (p) => p.A0 / p.k + p.A1 / p.k ** 2 + p.A2 / p.k ** 3,
  },
  'rect-mode': {
    title: 'one Fourier mode in a rectangle',
    make(r) {
      const V0 = [50, 100, 200][int(r, 0, 2)], ba = [0.5, 1, 2][int(r, 0, 2)], fx = [0.25, 0.5][int(r, 0, 1)], fy = [0.25, 0.5, 0.75][int(r, 0, 2)];
      const answer = V0 * Math.sin(Math.PI * fx) * Math.sinh(Math.PI * fy * ba) / Math.sinh(Math.PI * ba);
      return {
        q: `<p>A rectangle 0 ≤ x ≤ a, 0 ≤ y ≤ b with b = ${ba}a has V = 0 on three sides and V = ${V0} sin(πx/a) volts on the side y = b. There is no charge inside. Find V at x = ${fx}a, y = ${fy}b.</p>`,
        answer, unit: 'V', tol: 0.01,
        hint: 'Try V = C sin(πx/a) sinh(πy/a). It is harmonic, vanishes on x = 0, x = a and y = 0; fix C from the top edge.',
        solution: steps(`V = ${V0} sin(πx/a) sinh(πy/a)/sinh(πb/a). By uniqueness this is the answer.`, `πy/a = ${(Math.PI * fy * ba).toFixed(4)}, πb/a = ${(Math.PI * ba).toFixed(4)}, sin(πx/a) = ${Math.sin(Math.PI * fx).toFixed(4)}.`, `V = ${V0} × ${Math.sin(Math.PI * fx).toFixed(4)} × ${Math.sinh(Math.PI * fy * ba).toFixed(4)}/${Math.sinh(Math.PI * ba).toFixed(4)} = <b>${answer.toFixed(3)} V</b>.`),
        V0, ba, fx, fy,
      };
    },
    verify: (p) => p.V0 * Math.sin(Math.PI * p.fx) * Math.sinh(Math.PI * p.fy * p.ba) / Math.sinh(Math.PI * p.ba),
  },
  // ---------- 3.2 Method of images ----------
  'cavity-image-force': {
    title: 'force on a charge in a grounded spherical cavity',
    make(r) {
      const q = int(r, 1, 5), R = [5, 8, 10][int(r, 0, 2)], d = int(r, 1, 3);
      const k = 8.9875517923e9, Rm = R / 100, dm = d / 100;
      const answer = k * (q * 1e-9) ** 2 * Rm * dm / (Rm * Rm - dm * dm) ** 2 * 1e6;
      return {
        q: `<p>A charge of ${q} nC sits ${d} cm from the centre of a grounded spherical cavity of radius ${R} cm cut in a block of metal. Find the size of the force on it, in μN.</p>`,
        answer, unit: 'μN', tol: 0.01,
        hint: 'The image is q′ = −qR/d at R²/d from the centre, outside the cavity, on the same side as q.',
        solution: steps(`Image: q′ = −${q}×${R}/${d} = ${(-q * R / d).toFixed(3)} nC at ${(R * R / d).toFixed(3)} cm from the centre.`, `Separation: R²/d − d = ${(R * R / d - d).toFixed(3)} cm.`, `F = k q |q′| / sep² = kq²Rd/(R² − d²)² = <b>${answer.toFixed(3)} μN</b>, pulling q towards the nearest wall.`),
        qc: q, Rm, dm,
      };
    },
    verify: (p) => 8.9875517923e9 * (p.qc * 1e-9) ** 2 * p.Rm * p.dm / (p.Rm ** 2 - p.dm ** 2) ** 2 * 1e6,
  },
  'wire-plane-capacitance': {
    title: 'capacitance of a wire above a ground plane',
    make(r) {
      const a = [0.5, 1, 2][int(r, 0, 2)], x = [2, 5, 10, 50][int(r, 0, 3)];
      const answer = 2 * Math.PI * 8.8541878128e-12 / Math.acosh(x) * 1e12;
      return {
        q: `<p>A wire of radius ${a} mm runs parallel to a large grounded plane with its axis ${a * x} mm above it. Find the capacitance per metre between wire and plane, in pF/m.</p>`,
        answer, unit: 'pF/m', tol: 0.01,
        hint: 'Replace the wire and plane by line charges ±λ at ±c with c² = h² − a². The result is C′ = 2πε₀ / cosh⁻¹(h/a).',
        solution: steps(`h/a = ${x}, so cosh⁻¹(${x}) = ln(${x} + √(${x * x} − 1)) = ${Math.acosh(x).toFixed(4)}.`, `2πε₀ = 5.563 × 10⁻¹¹ F/m.`, `C′ = 5.563 × 10⁻¹¹ / ${Math.acosh(x).toFixed(4)} = <b>${answer.toFixed(3)} pF/m</b>.`),
        x,
      };
    },
    verify: (p) => 2 * Math.PI * 8.8541878128e-12 / Math.acosh(p.x) * 1e12,
  },
  // ---------- 3.3 Multipoles ----------
  'quadrupole-component': {
    title: 'a component of the quadrupole tensor',
    make(r) {
      const pool = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, 0, 1], [0, 0, -1], [1, 1, 0], [0, 1, 1]];
      const i1 = int(r, 0, 6), i2 = (i1 + 1 + int(r, 0, 5)) % 7;
      const P = [pool[i1], pool[i2], [0, 0, 0]], Q = [int(r, 1, 3), int(r, 1, 3)];
      Q.push(-(Q[0] + Q[1]));
      const comp = [[2, 2, 'zz'], [0, 0, 'xx'], [0, 1, 'xy']][int(r, 0, 2)];
      let answer = 0;
      const parts = P.map((v, n) => { const r2 = v[0] ** 2 + v[1] ** 2 + v[2] ** 2; const t = Q[n] * (3 * v[comp[0]] * v[comp[1]] - (comp[0] === comp[1] ? r2 : 0)); answer += t; return t; });
      return {
        q: `<p>Charges (in units of q) at positions in units of a: ${P.map((v, n) => `${Q[n] > 0 ? '+' : ''}${Q[n]} at (${v.join(', ')})`).join('; ')}. Find Q<sub>${comp[2]}</sub> = Σ q(3x<sub>i</sub>x<sub>j</sub> − r²δ<sub>ij</sub>) about the origin, in units of qa².</p>`,
        answer, unit: 'qa²', tol: 0, abs: 1e-9,
        hint: comp[0] === comp[1] ? 'Diagonal component: each charge contributes q(3x<sub>i</sub>² − r²).' : 'Off-diagonal component: each charge contributes 3q x<sub>i</sub>x<sub>j</sub>, with no r² term.',
        solution: steps(...parts.map((t, n) => `Charge ${Q[n]} at (${P[n].join(', ')}): ${t}.`), `Sum: <b>${answer}</b> qa². (The charge at the origin adds nothing.)`),
        P, Q, c0: comp[0], c1: comp[1],
      };
    },
    verify: (p) => p.P.reduce((s, v, n) => s + p.Q[n] * (3 * v[p.c0] * v[p.c1] - (p.c0 === p.c1 ? v[0] ** 2 + v[1] ** 2 + v[2] ** 2 : 0)), 0),
  },
  'dipole-field-angle': {
    title: 'field of a point dipole at an angle',
    make(r) {
      const p = int(r, 1, 5), rr = [1, 2, 5][int(r, 0, 2)], th = [0, 30, 45, 60, 90][int(r, 0, 4)];
      const c = Math.cos(th * Math.PI / 180);
      const answer = 8.9875517923e9 * p * 1e-12 * Math.sqrt(3 * c * c + 1) / (rr / 100) ** 3;
      return {
        q: `<p>A point dipole of moment ${p} × 10⁻¹² C m sits at the origin. Find the field strength ${rr} cm away, at ${th}° from the dipole axis, in V/m.</p>`,
        answer, unit: 'V/m', tol: 0.01,
        hint: 'E<sub>r</sub> = 2kp cos θ / r³ and E<sub>θ</sub> = kp sin θ / r³; combine them.',
        solution: steps(`kp/r³ = 8.99 × 10⁹ × ${p} × 10⁻¹² / (${rr / 100})³ = ${(8.9875517923e9 * p * 1e-12 / (rr / 100) ** 3).toFixed(2)} V/m.`, `|E| = (kp/r³)√(3cos²θ + 1), and √(3cos²${th}° + 1) = ${Math.sqrt(3 * c * c + 1).toFixed(4)}.`, `|E| = <b>${answer.toFixed(1)} V/m</b>.`),
        p, rr, th,
      };
    },
    verify: (q) => { const c = Math.cos(q.th * Math.PI / 180); return 8.9875517923e9 * q.p * 1e-12 * Math.sqrt(3 * c * c + 1) / (q.rr / 100) ** 3; },
  },
  // ---------- 3.4 Fields in matter ----------
  'dielectric-body-field': {
    title: 'field inside a dielectric sphere or cylinder',
    make(r) {
      const sph = r() < 0.5, er = [2, 3, 4, 6, 10][int(r, 0, 4)], E0 = [100, 300, 1000][int(r, 0, 2)];
      const answer = sph ? 3 * E0 / (er + 2) : 2 * E0 / (er + 1);
      return {
        q: `<p>A ${sph ? 'sphere' : 'long cylinder, axis across the field,'} of linear dielectric with ε<sub>r</sub> = ${er} is placed in a uniform field of ${E0} V/m. Find the field inside, in V/m.</p>`,
        answer, unit: 'V/m', tol: 0.01,
        hint: sph ? 'Separation in spherical coordinates with only the l = 1 term: E<sub>in</sub> = 3E₀/(ε<sub>r</sub> + 2).' : 'Separation in polar coordinates with only cos φ terms: E<sub>in</sub> = 2E₀/(ε<sub>r</sub> + 1).',
        solution: steps(`Match V and ε ∂V/∂n at the surface; inside the field is uniform.`, `E<sub>in</sub> = ${sph ? `3 × ${E0}/(${er} + 2)` : `2 × ${E0}/(${er} + 1)`} = <b>${answer.toFixed(2)} V/m</b>.`, `Polarisation P = ε₀(ε<sub>r</sub> − 1)E<sub>in</sub> = ${(8.854e-12 * (er - 1) * answer * 1e9).toFixed(2)} nC/m².`),
        sph, er, E0,
      };
    },
    verify: (p) => (p.sph ? 3 * p.E0 / (p.er + 2) : 2 * p.E0 / (p.er + 1)),
  },
  'dielectric-image': {
    title: 'force on a charge near a dielectric boundary',
    make(r) {
      const e1 = [1, 2, 4][int(r, 0, 2)], e2 = [3, 5, 80][int(r, 0, 2)], q = int(r, 1, 5), d = [0.5, 1, 2][int(r, 0, 2)];
      const qp = -(e2 - e1) / (e2 + e1);
      const answer = Math.abs(8.9875517923e9 / e1 * (q * 1e-9) ** 2 * qp / (2 * d / 100) ** 2 * 1e6);
      return {
        q: `<p>A charge of ${q} nC sits in a medium with ε<sub>r</sub> = ${e1}, ${d} cm from its flat boundary with a medium of ε<sub>r</sub> = ${e2}. Find the size of the force on it, in μN.</p>`,
        answer, unit: 'μN', tol: 0.01,
        hint: 'In the charge\'s own medium the field is that of q and an image q′ = −q(ε₂ − ε₁)/(ε₂ + ε₁), a distance d beyond the boundary. Use ε₁ in Coulomb\'s law.',
        solution: steps(`q′ = −q(${e2} − ${e1})/(${e2} + ${e1}) = ${qp.toFixed(4)} q.`, `F = q|q′| / (4π ε₁ (2d)²) = (8.99 × 10⁹/${e1}) × ${Math.abs(qp).toFixed(4)} × (${q} × 10⁻⁹)² / (${2 * d / 100})².`, `F = <b>${answer.toFixed(3)} μN</b>, ${e2 > e1 ? 'attracting the charge towards the denser medium' : 'pushing it away'}.`),
        e1, e2, qc: q, d,
      };
    },
    verify: (p) => Math.abs(8.9875517923e9 / p.e1 * (p.qc * 1e-9) ** 2 * (-(p.e2 - p.e1) / (p.e2 + p.e1)) / (2 * p.d / 100) ** 2 * 1e6),
  },
  // ---------- 3.5 Potentials and gauges ----------
  'solenoid-vector-potential': {
    title: 'vector potential outside a solenoid',
    make(r) {
      const n = [500, 1000, 2000][int(r, 0, 2)], I = int(r, 1, 5), R = int(r, 1, 3), s = R * [2, 3, 5][int(r, 0, 2)];
      const B = 1.25663706212e-6 * n * I;
      const answer = B * (R / 100) ** 2 / (2 * s / 100) * 1e6;
      return {
        q: `<p>A long solenoid of radius ${R} cm has ${n} turns per metre carrying ${I} A. Outside it the magnetic field is zero. Find the size of the vector potential ${s} cm from the axis, in μT m.</p>`,
        answer, unit: 'μT m', tol: 0.01,
        hint: 'Use ∮A·dl = Φ around a circle of radius s: A × 2πs equals the flux inside the solenoid.',
        solution: steps(`B inside = μ₀nI = ${(B * 1e3).toFixed(4)} mT.`, `Φ = BπR² = ${(B * Math.PI * (R / 100) ** 2).toExponential(3)} Wb.`, `A = Φ/(2πs) = BR²/(2s) = <b>${answer.toFixed(4)} μT m</b>, circling the axis, although B = 0 there.`),
        B, R, s,
      };
    },
    verify: (p) => p.B * (p.R / 100) ** 2 / (2 * p.s / 100) * 1e6,
  },
  'lienard-wiechert-factor': {
    title: 'the Liénard-Wiechert factor',
    make(r) {
      const b = [0.2, 0.5, 0.6, 0.8, 0.9][int(r, 0, 4)], a = [0, 30, 60, 90, 120, 180][int(r, 0, 5)];
      const answer = 1 / (1 - b * Math.cos(a * Math.PI / 180));
      return {
        q: `<p>At the retarded time, a charge moving at ${b}c has its velocity at ${a}° to the line from it towards the observer. By what factor does its Liénard-Wiechert potential exceed q/4πε₀𝓇, where 𝓇 is the retarded distance?</p>`,
        answer, unit: '', tol: 0.005,
        hint: 'V = q / [4πε₀ (𝓇 − 𝓇·v/c)]: divide by the Coulomb value.',
        solution: steps(`The factor is 1/(1 − (v/c) cos α).`, `(v/c) cos ${a}° = ${(b * Math.cos(a * Math.PI / 180)).toFixed(4)}.`, `Factor = 1/${(1 - b * Math.cos(a * Math.PI / 180)).toFixed(4)} = <b>${answer.toFixed(4)}</b>. ${a < 90 ? 'Approaching: stronger.' : a > 90 ? 'Receding: weaker.' : 'Sideways: no change.'}`),
        b, a,
      };
    },
    verify: (p) => 1 / (1 - p.b * Math.cos(p.a * Math.PI / 180)),
  },
  // ---- Module 2: classical mechanics ----
  'hoop-equilibrium': {
    title: 'bead on a spinning hoop',
    make(r) {
      const R = [0.1, 0.15, 0.2, 0.25, 0.3][int(r, 0, 4)], w = int(r, 9, 16);
      const c = 9.8 / (w * w * R), answer = c < 1 ? Math.acos(c) * 180 / Math.PI : 0;
      return {
        q: `<p>A smooth vertical hoop of radius ${R} m spins at ${w} rad/s about its vertical diameter. A bead slides on it. At what angle from the bottom (in degrees) does the bead stay at rest relative to the hoop? (Enter 0 if only the bottom is possible; g = 9.8 m/s².)</p>`,
        answer, unit: '°', tol: 0.005, abs: 0.2,
        hint: 'Write L = ½mR²(θ̇² + ω²sin²θ) + mgR cos θ and look for θ with θ̈ = 0. Compare ω² with g/R.',
        solution: steps(`Euler-Lagrange: θ̈ = sin θ (ω² cos θ − g/R).`, `g/R = ${(9.8 / R).toFixed(2)} s⁻² and ω² = ${w * w} s⁻².`, c < 1 ? `Since ω² > g/R, cos θ₀ = g/(ω²R) = ${c.toFixed(4)}, so θ₀ = <b>${answer.toFixed(2)}°</b>.` : `Since ω² ≤ g/R, the bottom is the only equilibrium: <b>0</b>.`),
        R, w,
      };
    },
    verify: (p) => { const c = 9.8 / (p.w * p.w * p.R); return c < 1 ? Math.acos(c) * 180 / Math.PI : 0; },
  },
  'atwood-lagrange': {
    title: 'Atwood machine with a heavy pulley',
    make(r) {
      const m1 = int(r, 3, 9), m2 = int(r, 1, m1 - 1), Ir = int(r, 0, 6);
      const answer = (m1 - m2) * 9.8 / (m1 + m2 + Ir);
      return {
        q: `<p>Masses of ${m1} kg and ${m2} kg hang over a pulley whose moment of inertia is I = ${Ir} kg × R² (the string does not slip). Use the Lagrangian to find the acceleration of the masses in m/s² (g = 9.8 m/s²).</p>`,
        answer, unit: 'm/s²', tol: 0.005,
        hint: 'One coordinate x is enough. The pulley turns through x/R, so its kinetic energy is ½(I/R²)ẋ².',
        solution: steps(`T = ½(${m1} + ${m2} + ${Ir})ẋ², V = −(${m1} − ${m2})gx.`, `Euler-Lagrange: ${m1 + m2 + Ir} ẍ = ${m1 - m2} × 9.8.`, `ẍ = <b>${answer.toFixed(3)}</b> m/s².`),
        m1, m2, Ir,
      };
    },
    verify: (p) => (p.m1 - p.m2) * 9.8 / (p.m1 + p.m2 + p.Ir),
  },
  'adiabatic-oscillator': {
    title: 'slowly stiffened oscillator',
    make(r) {
      const w1 = int(r, 1, 5), f = [2, 3, 4, 9][int(r, 0, 3)], A1 = int(r, 2, 10);
      const answer = A1 / Math.sqrt(f);
      return {
        q: `<p>An oscillator swings with amplitude ${A1} cm at ${w1} rad/s. Its spring is stiffened very slowly until the angular frequency is ${w1 * f} rad/s. Find the new amplitude in cm.</p>`,
        answer, unit: 'cm', tol: 0.005,
        hint: 'For slow changes the action ∮p dx = 2πE/ω stays fixed. Write E = ½mω²A².',
        solution: steps('E/ω is an adiabatic invariant, so ½mω²A²/ω = ½mωA² is constant.', `A ∝ ω<sup>−1/2</sup>: A = ${A1}/√${f} = <b>${answer.toFixed(3)}</b> cm.`, `The energy grows by a factor ${f} even though the amplitude falls.`),
        A1, f,
      };
    },
    verify: (p) => p.A1 / Math.sqrt(p.f),
  },
  'pb-monomial': {
    title: 'Poisson bracket of two monomials',
    make(r) {
      const a = int(r, 1, 3), b = int(r, 0, 2), c = int(r, 0, 2), d = int(r, 1, 3), q = int(r, 1, 3), p = int(r, 1, 3);
      const answer = (a * d - b * c) * q ** (a + c - 1) * p ** (b + d - 1);
      const mono = (x, y) => `${x ? (x === 1 ? 'q' : `q<sup>${x}</sup>`) : ''}${y ? (y === 1 ? 'p' : `p<sup>${y}</sup>`) : ''}` || '1';
      return {
        q: `<p>With {f, g} = ∂f/∂q ∂g/∂p − ∂f/∂p ∂g/∂q, find {${mono(a, b)}, ${mono(c, d)}} at q = ${q}, p = ${p}.</p>`,
        answer, unit: '', tol: 0, abs: 1e-9,
        hint: 'Differentiate each monomial by q and by p, then form the two products and subtract.',
        solution: steps(`∂f/∂q · ∂g/∂p = ${a}q<sup>${a - 1}</sup>p<sup>${b}</sup> · ${d}q<sup>${c}</sup>p<sup>${d - 1}</sup>.`, `∂f/∂p · ∂g/∂q = ${b}q<sup>${a}</sup>p<sup>${b - 1}</sup> · ${c}q<sup>${c - 1}</sup>p<sup>${d}</sup>.`, `Difference = (${a * d} − ${b * c}) q<sup>${a + c - 1}</sup>p<sup>${b + d - 1}</sup> = <b>${answer}</b> at the given point.`),
        a, b, c, d, qv: q, pv: p,
      };
    },
    verify: (x) => (x.a * x.d - x.b * x.c) * x.qv ** (x.a + x.c - 1) * x.pv ** (x.b + x.d - 1),
  },
  'rutherford-impact': {
    title: 'Rutherford impact parameter',
    make(r) {
      const Z = [13, 29, 47, 79][int(r, 0, 3)], E = int(r, 3, 9), th = [30, 60, 90, 120][int(r, 0, 3)];
      const k = 2 * Z * 1.44, answer = k / (2 * E) / Math.tan(th * Math.PI / 360);
      return {
        q: `<p>An alpha particle (z = 2) of ${E} MeV is deflected through ${th}° by a fixed nucleus with Z = ${Z}. Using e²/4πε₀ = 1.44 MeV fm, find its impact parameter in fm.</p>`,
        answer, unit: 'fm', tol: 0.005,
        hint: 'For a repulsive k/r potential, cot(Θ/2) = 2Eb/k with k = zZe²/4πε₀.',
        solution: steps(`k = 2 × ${Z} × 1.44 = ${k.toFixed(2)} MeV fm.`, `b = (k/2E) cot(Θ/2) = (${k.toFixed(2)}/${2 * E}) × cot ${th / 2}°.`, `b = <b>${answer.toFixed(2)}</b> fm.`),
        Z, E, th,
      };
    },
    verify: (p) => 2 * p.Z * 1.44 / (2 * p.E) / Math.tan(p.th * Math.PI / 360),
  },
  'two-mass-modes': {
    title: 'normal modes of two coupled masses',
    make(r) {
      const m = int(r, 1, 4), k = int(r, 4, 30), kc = int(r, 1, 20), hi = r() < 0.5;
      const answer = Math.sqrt((hi ? k + 2 * kc : k) / m);
      return {
        q: `<p>Two ${m} kg masses between walls are each joined to their wall by a ${k} N/m spring and to each other by a ${kc} N/m spring. Find the ${hi ? 'higher' : 'lower'} normal-mode angular frequency in rad/s.</p>`,
        answer, unit: 'rad/s', tol: 0.005,
        hint: 'Write K = [[k + k<sub>c</sub>, −k<sub>c</sub>], [−k<sub>c</sub>, k + k<sub>c</sub>]] and solve det(K − ω²M) = 0, or guess the modes (1, 1) and (1, −1).',
        solution: steps('In step (1, 1): the middle spring never stretches, ω² = k/m.', 'Opposite (1, −1): the middle spring stretches by twice the displacement, ω² = (k + 2k<sub>c</sub>)/m.', `${hi ? 'Higher' : 'Lower'}: ω = <b>${answer.toFixed(3)}</b> rad/s.`),
        m, k, kc, hi,
      };
    },
    verify: (p) => Math.sqrt((p.hi ? p.k + 2 * p.kc : p.k) / p.m),
  },
  'top-precession': {
    title: 'precession of a fast top',
    make(r) {
      const M = int(r, 1, 5) / 10, l = int(r, 2, 8) / 100, I3 = int(r, 2, 8) * 1e-4, w = int(r, 10, 40) * 10;
      const answer = 2 * Math.PI * I3 * w / (M * 9.8 * l);
      return {
        q: `<p>A top of mass ${M} kg has its centre of mass ${l} m from its tip and I<sub>3</sub> = ${(I3 * 1e4).toFixed(0)} × 10⁻⁴ kg m². It spins at ${w} rad/s. Find the period of its slow precession in seconds (g = 9.8 m/s²).</p>`,
        answer, unit: 's', tol: 0.005,
        hint: 'For a fast top, the gravitational torque Mgl sin θ turns the horizontal part of I₃ω₃: Ω = Mgl/(I₃ω₃).',
        solution: steps(`Ω = Mgl/(I₃ω₃) = (${M} × 9.8 × ${l}) / (${I3.toExponential(1)} × ${w}) = ${(M * 9.8 * l / (I3 * w)).toFixed(4)} rad/s.`, `Period = 2π/Ω = <b>${answer.toFixed(3)}</b> s.`),
        M, l, I3, w,
      };
    },
    verify: (p) => 2 * Math.PI * p.I3 * p.w / (p.M * 9.8 * p.l),
  },
  'threshold-kinetic': {
    title: 'threshold energy of a reaction',
    make(r) {
      const rx = [
        ['p + p → p + p + π⁰', 938.27, 938.27, 938.27 * 2 + 134.98],
        ['π⁻ + p → K⁰ + Λ', 139.57, 938.27, 497.61 + 1115.68],
        ['γ + p → n + π⁺', 0, 938.27, 939.57 + 139.57],
        ['p + p → p + p + η', 938.27, 938.27, 938.27 * 2 + 547.86],
      ][int(r, 0, 3)];
      const [name, ma, mb, Mf] = rx;
      const answer = (Mf * Mf - ma * ma - mb * mb) / (2 * mb) - ma;
      return {
        q: `<p>Find the threshold kinetic energy (MeV) of the beam particle for ${name}, with the target proton at rest. Masses (MeV/c²): beam ${ma}, target ${mb}; total mass of the products ${Mf.toFixed(2)}.</p>`,
        answer, unit: 'MeV', tol: 0.003,
        hint: 'At threshold the products are at rest in the centre-of-mass frame, so √s equals the sum of their masses. Use s = m<sub>a</sub>² + m<sub>b</sub>² + 2E<sub>a</sub>m<sub>b</sub> (c = 1).',
        solution: steps(`√s = ${Mf.toFixed(2)} MeV at threshold.`, `E<sub>a</sub> = (${Mf.toFixed(2)}² − ${ma}² − ${mb}²)/(2 × ${mb}) = ${(answer + ma).toFixed(2)} MeV.`, `T<sub>a</sub> = E<sub>a</sub> − m<sub>a</sub> = <b>${answer.toFixed(2)}</b> MeV.`),
        ma, mb, Mf,
      };
    },
    verify: (p) => (p.Mf ** 2 - p.ma ** 2 - p.mb ** 2) / (2 * p.mb) - p.ma,
  },
  // ---------- Module 6: atomic and molecular physics ----------
  'fs-splitting': {
    title: 'fine-structure splitting of a hydrogen-like level',
    make(r) {
      const Z = int(r, 1, 3), n = int(r, 2, 4), l = int(r, 1, n - 1);
      const answer = 5.8437 * Z ** 4 / (n ** 3 * l * (l + 1));
      return {
        q: `<p>Find the separation, in cm⁻¹, between the j = l + ½ and j = l − ½ levels of the ${n}${'spdf'[l]} state of a hydrogen-like ion with Z = ${Z}. Use the Dirac shift −(R∞α²Z⁴/n⁴)(n/(j + ½) − ¾) with R∞α² = 5.8437 cm⁻¹.</p>`,
        answer, unit: 'cm⁻¹', tol: 0.005,
        hint: 'Only the n/(j + ½) term differs between the two levels; 1/l − 1/(l + 1) = 1/[l(l + 1)].',
        solution: steps(`j = ${l + 0.5} and ${l - 0.5} give n/(j + ½) = ${n}/${l + 1} and ${n}/${l}.`, `ΔE = (5.8437 × ${Z ** 4}/${n ** 4}) × ${n} × (1/${l} − 1/${l + 1}) = 5.8437 × ${Z ** 4}/(${n ** 3} × ${l * (l + 1)}).`, `<b>${answer.toPrecision(4)} cm⁻¹</b>.`),
        Z, n, l,
      };
    },
    verify: (p) => 5.8437 * p.Z ** 4 / p.n ** 3 * (1 / p.l - 1 / (p.l + 1)),
  },
  'dirac-shift': {
    title: 'fine-structure shift of a hydrogen level',
    make(r) {
      const n = int(r, 1, 4), j = int(r, 0, n - 1) + 0.5;
      const answer = -(724.52 / n ** 4) * (n / (j + 0.5) - 0.75);
      return {
        q: `<p>By how much (in μeV, with sign) does fine structure shift the hydrogen level n = ${n}, j = ${2 * j}/2 from its Bohr energy? Use R∞hcα² = 724.52 μeV.</p>`,
        answer, unit: 'μeV', tol: 0.005,
        hint: 'ΔE = −(R∞hcα²/n⁴)(n/(j + ½) − ¾). It is always negative.',
        solution: steps(`n/(j + ½) − ¾ = ${n}/${j + 0.5} − 0.75 = ${(n / (j + 0.5) - 0.75).toFixed(4)}.`, `724.52/${n ** 4} = ${(724.52 / n ** 4).toFixed(4)} μeV.`, `ΔE = <b>${answer.toFixed(2)} μeV</b>.`),
        n, j,
      };
    },
    verify: (p) => -(724.52 / p.n ** 4) * (p.n / (p.j + 0.5) - 0.75),
  },
  'lande-interval': {
    title: 'Landé interval rule',
    make(r) {
      const S = [0.5, 1, 1.5, 2][int(r, 0, 3)], L = int(r, Math.max(1, Math.ceil(S)), 4), A = int(r, 5, 80);
      const Jmax = L + S, Jmin = Math.abs(L - S), J = Jmin + int(r, 1, Math.round(Jmax - Jmin));
      const answer = A * J;
      const fr = (x) => (Number.isInteger(x) ? String(x) : `${Math.round(2 * x)}/2`);
      return {
        q: `<p>A term with S = ${fr(S)} and L = ${L} has spin-orbit constant A = ${A} cm⁻¹. By how many cm⁻¹ does the J = ${fr(J)} level lie above the J = ${fr(J - 1)} level?</p>`,
        answer, unit: 'cm⁻¹', tol: 0.001,
        hint: 'E<sub>J</sub> = (A/2)[J(J + 1) − L(L + 1) − S(S + 1)]; subtract two neighbours.',
        solution: steps('E<sub>J</sub> − E<sub>J−1</sub> = (A/2)[J(J + 1) − (J − 1)J] = AJ.', `= ${A} × ${fr(J)} = <b>${answer} cm⁻¹</b>.`),
        A, J,
      };
    },
    verify: (p) => p.A * p.J,
  },
  'helium-like-energy': {
    title: 'ionisation energy of a two-electron ion (variational)',
    make(r) {
      const Z = int(r, 2, 8);
      const answer = 2 * (Z - 5 / 16) ** 2 * 13.6 - 13.6 * Z * Z;
      return {
        q: `<p>With the variational trial function e<sup>−Z′(r₁+r₂)/a₀</sup>, a two-electron ion of nuclear charge Z = ${Z} has Z′ = Z − 5/16 and E = −2Z′² × 13.6 eV. Find the energy (eV) needed to remove one electron, leaving the one-electron ion in its ground state.</p>`,
        answer, unit: 'eV', tol: 0.005,
        hint: 'Ionisation energy = E(one-electron ion) − E(two-electron ion), with E(one-electron ion) = −13.6 Z² eV.',
        solution: steps(`Z′ = ${Z - 0.3125}; E = −2 × ${((Z - 0.3125) ** 2).toFixed(4)} × 13.6 = ${(-2 * (Z - 0.3125) ** 2 * 13.6).toFixed(2)} eV.`, `One-electron ion: −13.6 × ${Z * Z} = ${(-13.6 * Z * Z).toFixed(1)} eV.`, `Difference: <b>${answer.toFixed(2)} eV</b>.`),
        Z,
      };
    },
    verify: (p) => -13.6 * p.Z ** 2 + 2 * (p.Z - 0.3125) ** 2 * 13.6,
  },
  'lande-g': {
    title: 'Landé g factor and sublevel spacing',
    make(r) {
      const lv = [[0.5, 1, 0.5], [0.5, 1, 1.5], [0.5, 2, 1.5], [0.5, 2, 2.5], [1, 1, 1], [1, 1, 2], [1, 2, 1], [1, 2, 3], [1.5, 3, 1.5], [2, 2, 4], [1, 0, 1], [0, 2, 2]][int(r, 0, 11)];
      const [S, L, J] = lv, B = int(r, 2, 20) / 10;
      const g = 1 + (J * (J + 1) + S * (S + 1) - L * (L + 1)) / (2 * J * (J + 1));
      const answer = g * 13.996 * B;
      const fr = (x) => (Number.isInteger(x) ? String(x) : `${Math.round(2 * x)}/2`);
      return {
        q: `<p>A level with S = ${fr(S)}, L = ${L}, J = ${fr(J)} sits in a weak field of ${B} T. Find the frequency spacing, in GHz, between adjacent Zeeman sublevels. Use μ<sub>B</sub>/h = 13.996 GHz/T.</p>`,
        answer, unit: 'GHz', tol: 0.005,
        hint: 'Spacing = g<sub>J</sub>μ<sub>B</sub>B, with g<sub>J</sub> = 1 + [J(J+1) + S(S+1) − L(L+1)]/[2J(J+1)].',
        solution: steps(`g<sub>J</sub> = 1 + (${J * (J + 1)} + ${S * (S + 1)} − ${L * (L + 1)})/${2 * J * (J + 1)} = ${g.toFixed(4)}.`, `Spacing = ${g.toFixed(4)} × 13.996 × ${B} = <b>${answer.toFixed(3)} GHz</b>.`),
        S, L, J, B,
      };
    },
    verify: (p) => (1 + (p.J * (p.J + 1) + p.S * (p.S + 1) - p.L * (p.L + 1)) / (2 * p.J * (p.J + 1))) * 13.996 * p.B,
  },
  'zeeman-normal': {
    title: 'normal Zeeman splitting in wavelength',
    make(r) {
      const lam = int(r, 4000, 7000) / 10, B = int(r, 5, 30) / 10;
      const answer = (lam * 1e-7) ** 2 * 0.46686 * B * 1e10;
      return {
        q: `<p>A singlet line at ${lam} nm is placed in a ${B} T field. Find the wavelength spacing, in pm, between adjacent components of the normal Zeeman triplet. Use μ<sub>B</sub>/hc = 0.46686 cm⁻¹/T.</p>`,
        answer, unit: 'pm', tol: 0.005,
        hint: 'Δν̃ = μ<sub>B</sub>B/hc, and Δλ = λ²Δν̃ (λ in cm when ν̃ is in cm⁻¹).',
        solution: steps(`Δν̃ = 0.46686 × ${B} = ${(0.46686 * B).toFixed(4)} cm⁻¹.`, `Δλ = (${lam}×10⁻⁷ cm)² × ${(0.46686 * B).toFixed(4)} cm⁻¹ = ${(answer / 1e10).toExponential(3)} cm = <b>${answer.toFixed(2)} pm</b>.`),
        lam, B,
      };
    },
    verify: (p) => (p.lam * 1e-7) ** 2 * 0.46686 * p.B * 1e10,
  },
  'rotor-bond': {
    title: 'bond length from rotational line spacing',
    make(r) {
      const mols = [['¹H³⁵Cl', 1.007825, 34.968853], ['¹²C¹⁶O', 12, 15.994915], ['¹H¹⁹F', 1.007825, 18.998403], ['¹H⁷⁹Br', 1.007825, 78.918338], ['¹⁴N¹⁶O', 14.003074, 15.994915], ['⁷Li¹H', 7.016004, 1.007825]];
      const [name, m1, m2] = mols[int(r, 0, mols.length - 1)];
      const mu = m1 * m2 / (m1 + m2), rr = int(r, 900, 1700) / 10;
      const sp = +(2 * 16.8576 / (mu * (rr / 100) ** 2)).toFixed(3);
      const answer = Math.sqrt(16.8576 / ((sp / 2) * mu)) * 100;
      return {
        q: `<p>Adjacent lines in the far-infrared rotational spectrum of ${name} (atomic masses ${m1.toFixed(3)} u and ${m2.toFixed(3)} u) are ${sp} cm⁻¹ apart (a practice value, not the real one). Find the bond length in pm. Use I (u Å²) = 16.8576/B (cm⁻¹).</p>`,
        answer, unit: 'pm', tol: 0.005,
        hint: 'The spacing is 2B. Then I = 16.8576/B and r = √(I/μ) with μ = m₁m₂/(m₁ + m₂).',
        solution: steps(`B = ${sp}/2 = ${(sp / 2).toFixed(4)} cm⁻¹.`, `μ = ${mu.toFixed(4)} u; I = 16.8576/${(sp / 2).toFixed(4)} = ${(16.8576 / (sp / 2)).toFixed(4)} u Å².`, `r = √(I/μ) = ${(answer / 100).toFixed(4)} Å = <b>${answer.toFixed(1)} pm</b>.`),
        sp, mu,
      };
    },
    verify: (p) => Math.sqrt(16.8576 / ((p.sp / 2) * p.mu)) * 100,
  },
  'rotor-jmax': {
    title: 'most populated rotational level',
    make(r) {
      const B = int(r, 5, 200) / 10, T = [100, 200, 300, 500, 1000][int(r, 0, 4)];
      const f = (J) => (2 * J + 1) * Math.exp(-1.438777 * B * J * (J + 1) / T);
      let answer = 0; for (let J = 1; J < 200; J++) if (f(J) > f(answer)) answer = J;
      return {
        q: `<p>A diatomic molecule has B = ${B} cm⁻¹. Which rotational level J is most populated at ${T} K? Use hc/k = 1.4388 cm K.</p>`,
        answer, unit: '', tol: 0, abs: 1e-9,
        hint: 'Population ∝ (2J + 1)e<sup>−hcBJ(J+1)/kT</sup>; start from J ≈ √(kT/2hcB) − ½ and compare the neighbouring integers.',
        solution: steps(`kT/hc = ${T}/1.4388 = ${(T / 1.438777).toFixed(1)} cm⁻¹.`, `√(kT/2hcB) − ½ = ${(Math.sqrt(T / (2 * 1.438777 * B)) - 0.5).toFixed(2)}.`, `Comparing (2J + 1)e<sup>−BJ(J+1)hc/kT</sup> at the integers nearby: <b>J = ${answer}</b>.`),
        B, T,
      };
    },
    verify: (p) => { const f = (J) => (2 * J + 1) * Math.exp(-1.438777 * p.B * J * (J + 1) / p.T); let b = 0; for (let J = 1; J < 200; J++) if (f(J) > f(b)) b = J; return b; },
  },
  'vib-anharmonic': {
    title: 'ω̃e and the Morse well depth from two bands',
    make(r) {
      const we = int(r, 1000, 4000), x = int(r, 40, 250) / 10;
      const n1 = +(we - 2 * x).toFixed(1), n2 = +(2 * we - 6 * x).toFixed(1);
      const W = 3 * n1 - n2, X = (W - n1) / 2;
      const answer = W * W / (4 * X) * 1.239842e-4;
      return {
        q: `<p>A diatomic molecule shows its fundamental at ${n1} cm⁻¹ and first overtone at ${n2} cm⁻¹. Find ω̃e and ω̃e·xe from G(v) = ω̃e(v + ½) − ω̃e·xe(v + ½)², then the Morse well depth De = ω̃e²/(4ω̃e·xe) in eV (1 cm⁻¹ = 1.2398×10⁻⁴ eV).</p>`,
        answer, unit: 'eV', tol: 0.005,
        hint: 'Fundamental = ω̃e − 2ω̃e·xe; overtone = 2ω̃e − 6ω̃e·xe. So 3 × fundamental − overtone = ω̃e.',
        solution: steps(`ω̃e = 3(${n1}) − ${n2} = ${W.toFixed(1)} cm⁻¹.`, `ω̃e·xe = (${W.toFixed(1)} − ${n1})/2 = ${X.toFixed(2)} cm⁻¹.`, `De = ${W.toFixed(1)}²/(4 × ${X.toFixed(2)}) = ${(W * W / (4 * X)).toFixed(0)} cm⁻¹ = <b>${answer.toFixed(3)} eV</b>.`),
        n1, n2,
      };
    },
    verify: (p) => { const W = 3 * p.n1 - p.n2, X = (W - p.n1) / 2; return W * W / (4 * X) * 1.239842e-4; },
  },
  'raman-stokes': {
    title: 'wavelength of a Raman line',
    make(r) {
      const lams = [532, 514.5, 488, 632.8, 785, 355], lam = lams[int(r, 0, 5)], sh = int(r, 200, 3500), stokes = r() < 0.7;
      const answer = 1e7 / (1e7 / lam + (stokes ? -sh : sh));
      return {
        q: `<p>A sample is excited at ${lam} nm. At what wavelength (nm) does the ${stokes ? 'Stokes' : 'anti-Stokes'} line of a ${sh} cm⁻¹ vibration appear?</p>`,
        answer, unit: 'nm', tol: 0.0005,
        hint: 'Work in wavenumbers: ν̃ = 10⁷/λ(nm). Stokes lines are lower by the shift, anti-Stokes higher.',
        solution: steps(`ν̃₀ = 10⁷/${lam} = ${(1e7 / lam).toFixed(1)} cm⁻¹.`, `${stokes ? 'Stokes' : 'Anti-Stokes'}: ${(1e7 / lam).toFixed(1)} ${stokes ? '−' : '+'} ${sh} = ${(1e7 / answer).toFixed(1)} cm⁻¹.`, `λ = 10⁷/${(1e7 / answer).toFixed(1)} = <b>${answer.toFixed(2)} nm</b>.`),
        lam, sh, stokes,
      };
    },
    verify: (p) => 1e7 / (1e7 / p.lam + (p.stokes ? -p.sh : p.sh)),
  },
  'raman-temp': {
    title: 'temperature from the anti-Stokes to Stokes ratio',
    make(r) {
      const sh = int(r, 200, 1500), T = int(r, 250, 1200);
      const ratio = +Math.exp(-1.438777 * sh / T).toPrecision(3);
      const answer = 1.438777 * sh / Math.log(1 / ratio);
      return {
        q: `<p>The anti-Stokes to Stokes intensity ratio of a ${sh} cm⁻¹ Raman band, already corrected for the ν⁴ factor, is ${ratio}. Find the temperature in K (hc/k = 1.4388 cm K).</p>`,
        answer, unit: 'K', tol: 0.005,
        hint: 'After the ν⁴ correction the ratio is the Boltzmann factor e<sup>−hcν̃/kT</sup>.',
        solution: steps(`ln(1/${ratio}) = ${Math.log(1 / ratio).toFixed(4)}.`, `T = 1.4388 × ${sh}/${Math.log(1 / ratio).toFixed(4)} = <b>${answer.toFixed(0)} K</b>.`),
        sh, ratio,
      };
    },
    verify: (p) => 1.438777 * p.sh / Math.log(1 / p.ratio),
  },
  'laser-threshold': {
    title: 'threshold gain of a laser',
    make(r) {
      const R1 = [1, 0.999, 0.99][int(r, 0, 2)], R2 = int(r, 50, 99) / 100, L = int(r, 5, 100) / 100, a = int(r, 0, 20) / 10;
      const answer = a + Math.log(1 / (R1 * R2)) / (2 * L);
      return {
        q: `<p>A ${L} m gain medium with internal loss ${a} m⁻¹ sits between mirrors of reflectance ${R1} and ${R2}. Find the threshold gain coefficient in m⁻¹.</p>`,
        answer, unit: 'm⁻¹', tol: 0.005,
        hint: 'One round trip multiplies the intensity by R₁R₂e<sup>2(g − α)L</sup>; set that equal to 1.',
        solution: steps(`ln(1/R₁R₂) = ln(1/${(R1 * R2).toFixed(4)}) = ${Math.log(1 / (R1 * R2)).toFixed(5)}.`, `Divide by 2L = ${+(2 * L).toFixed(2)}: ${(Math.log(1 / (R1 * R2)) / (2 * L)).toFixed(4)} m⁻¹.`, `Add α: g<sub>th</sub> = <b>${answer.toFixed(4)} m⁻¹</b>.`),
        R1, R2, L, a,
      };
    },
    verify: (p) => p.a + Math.log(1 / (p.R1 * p.R2)) / (2 * p.L),
  },
  'laser-modes': {
    title: 'longitudinal mode spacing of a laser',
    make(r) {
      const L = int(r, 10, 150) / 100, n = [1, 1, 1.5, 1.82][int(r, 0, 3)];
      const answer = 2.99792458e8 / (2 * n * L) / 1e6;
      return {
        q: `<p>A laser cavity is ${L} m long and filled with a medium of refractive index ${n}. Find the frequency spacing of its longitudinal modes in MHz.</p>`,
        answer, unit: 'MHz', tol: 0.003,
        hint: 'Standing waves need a whole number of half-wavelengths in the optical length nL, so Δν = c/(2nL).',
        solution: steps(`Δν = c/(2nL) = 2.998×10⁸/(2 × ${n} × ${L}).`, `= <b>${answer.toFixed(1)} MHz</b>. Divide the gain bandwidth by this to estimate how many modes can lase.`),
        L, n,
      };
    },
    verify: (p) => 2.99792458e8 / (2 * p.n * p.L) / 1e6,
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

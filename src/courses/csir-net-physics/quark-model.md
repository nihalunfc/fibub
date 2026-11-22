---
title: Isospin, strangeness and the quark model
summary: 'Flavour symmetry in hadron physics: isospin multiplets and Clebsch-Gordan predictions for decays and cross sections, strangeness and associated production, the Gell-Mann–Nishijima relation Q = I₃ + Y/2, SU(3) weight diagrams of the baryon octet and decuplet and the meson nonet, 3 ⊗ 3̄ = 8 ⊕ 1 and 3 ⊗ 3 ⊗ 3 = 10 ⊕ 8 ⊕ 8 ⊕ 1, the Gell-Mann–Okubo and equal-spacing mass rules, the Ω⁻ prediction, colour, and quark-model magnetic moments.'
minutes: 50
updated: 2026-11-22
quiz:
  - q: 'A hadron has baryon number 1, strangeness −2 and I₃ = +½. Its charge is'
    choices: ['0 (it is the Ξ⁰)', '+1', '−1', '+2']
    ans: 0
    why: 'Y = B + S = 1 − 2 = −1, so Q = I₃ + Y/2 = ½ − ½ = 0. Quark content uss: the Ξ⁰.'
  - q: 'At the Δ(1232) resonance, where only I = 3/2 contributes, σ(π⁺p → π⁺p) : σ(π⁻p → π⁻p) : σ(π⁻p → π⁰n) is'
    choices: ['9 : 1 : 2', '1 : 1 : 1', '3 : 1 : 2', '9 : 2 : 1']
    ans: 0
    why: 'π⁺p is pure |3/2, 3/2⟩ (amplitude 1). π⁻p contains |3/2, −½⟩ with amplitude √(1/3), and π⁰n with √(2/3). The amplitudes are 1, 1/3 and √2/3, so the cross sections go 1 : 1/9 : 2/9 = 9 : 1 : 2.'
  - q: 'Which reaction is forbidden for the strong interaction?'
    choices: ['π⁻ + p → K⁻ + Σ⁺', 'π⁻ + p → K⁰ + Λ', 'K⁻ + p → Ξ⁻ + K⁺', 'p + p → p + Λ + K⁺']
    ans: 0
    why: 'Initial strangeness 0; K⁻ (S = −1) plus Σ⁺ (S = −1) gives −2. The others conserve S: 0 → +1 − 1; −1 → −2 + 1; 0 → 0 − 1 + 1.'
sources:
  - 'D. Griffiths, Introduction to Elementary Particles, 2nd ed. (2008), chapters 1, 4 and 5'
  - 'B. R. Martin and G. Shaw, Particle Physics, 4th ed. (2017), chapters 3 and 6'
  - 'F. Halzen and A. D. Martin, Quarks and Leptons (1984), chapter 2'
  - 'Particle Data Group, Review of Particle Physics (2024), baryon and meson summary tables'
  - 'CSIR-UGC NET Physical Sciences syllabus, Part C nuclear and particle physics, published by the National Testing Agency'
---

**Module 10 · about 50 minutes.** By 1960 dozens of hadrons were known, with no obvious order. Two quantum numbers sorted them: isospin, a symmetry between proton and neutron that the [deuteron](/learn/courses/csir-net-physics/deuteron-nuclear-force/) already hinted at, and strangeness, a label for particles made fast but decaying slowly. Gell-Mann and Ne'eman then put them together in SU(3), predicted a missing particle, and the pattern turned out to be the quark content. NET Part C tests the bookkeeping: charges, multiplets, mass rules and isospin ratios.

<div class="bigidea">The strong interaction does not care whether a quark is u or d (isospin, an SU(2) symmetry, broken only by electromagnetism and a small mass difference), and cares only a little whether it is s (SU(3), broken by the larger s mass). Hadrons therefore come in families with nearly equal masses, the weight diagrams, and every member obeys Q = I₃ + Y/2. The patterns are just the ways of combining three light quarks.</div>

## 1. Isospin

Treat the proton and neutron as two states of one particle, the nucleon, with isospin `$I = \tfrac12$`: `$p$` has `$I_3 = +\tfrac12$`, `$n$` has `$I_3 = -\tfrac12$`. Isospin works exactly like spin (see [angular momentum](/learn/courses/gate-physics/angular-momentum/)): the same algebra, ladder operators and Clebsch-Gordan coefficients, in an abstract internal space.

<div class="meaning">

<dl>
<dt>Multiplets</dt><dd>`$2I + 1$` members of nearly equal mass: N `$(p, n)$` with `$I = \tfrac12$`; π `$(\pi^+, \pi^0, \pi^-)$` with `$I = 1$`; Δ `$(\Delta^{++}, \Delta^+, \Delta^0, \Delta^-)$` with `$I = \tfrac32$`; Λ with `$I = 0$`</dd>
<dt>Conservation</dt><dd>the strong interaction conserves `$I$` and `$I_3$`; electromagnetism conserves only `$I_3$` (it sees charge); the weak interaction conserves neither</dd>
<dt>Quarks</dt><dd>`$u$` (`$I_3 = +\tfrac12$`) and `$d$` (`$-\tfrac12$`) form the doublet; antiquarks `$(\bar d, -\bar u)$` form the conjugate doublet (the minus sign makes them transform the same way)</dd>
</dl>

</div>

**Using Clebsch-Gordan coefficients.** Write the initial state in total isospin; the strong interaction acts on each `$I$` separately. For `$\pi N$`, `$1\otimes\tfrac12 = \tfrac32\oplus\tfrac12$`:

```math
|\pi^+p\rangle = |\tfrac32, \tfrac32\rangle, \quad |\pi^-p\rangle = \sqrt{\tfrac13}\,|\tfrac32, -\tfrac12\rangle - \sqrt{\tfrac23}\,|\tfrac12, -\tfrac12\rangle, \quad |\pi^0n\rangle = \sqrt{\tfrac23}\,|\tfrac32, -\tfrac12\rangle + \sqrt{\tfrac13}\,|\tfrac12, -\tfrac12\rangle
```

**Worked example.** The `$\Delta^+$` (`$I = \tfrac32$`, `$I_3 = +\tfrac12$`) decays to `$p\pi^0$` or `$n\pi^+$`. Since `$|\tfrac32, \tfrac12\rangle = \sqrt{2/3}\,|p\pi^0\rangle + \sqrt{1/3}\,|n\pi^+\rangle$`, the branching ratio is `$p\pi^0 : n\pi^+ = 2 : 1$`. At the Δ peak, `$\sigma(\pi^+p)/\sigma(\pi^-p)_{\text{total}} = 1/(1/9 + 2/9) = 3$`, exactly what the 1952 Fermi experiments found: the first quantitative success of isospin.

## 2. Strangeness

Kaons and hyperons (Λ, Σ, Ξ) are produced in strong collisions with cross sections of millibarns, so the interaction making them is strong, yet they live about `$10^{-10}$` s, typical of weak decays. Gell-Mann and Nishijima explained this with a new additive number, strangeness `$S$`, conserved by the strong and electromagnetic interactions and changed by `$\pm1$` in weak decays.

<div class="steps">
<div class="step"><p><b>Associated production.</b> From non-strange beams, strange particles come in pairs with S adding to zero: π⁻p → K⁰Λ (S: 0 → +1 − 1).</p></div>
<div class="step"><p><b>Slow decay.</b> The lightest strange baryon, Λ (S = −1), has no strong decay that conserves S, so it waits for the weak decay Λ → pπ⁻ (ΔS = +1, τ = 2.6 × 10⁻¹⁰ s). Compare Δ → Nπ, strong, τ ≈ 5.6 × 10⁻²⁴ s.</p></div>
<div class="step"><p><b>Assignments.</b> s quark S = −1 (so s̄ has +1). K⁺ (us̄) and K⁰ (ds̄): S = +1; K⁻, K̄⁰: S = −1; Λ, Σ: −1; Ξ: −2; Ω⁻: −3.</p></div>
</div>

**Worked example.** Threshold for `$\pi^-p \to K^0\Lambda$` on protons at rest (see [relativistic kinematics](/learn/courses/gate-physics/relativistic-kinematics/)): at threshold `$\sqrt s = m_K + m_\Lambda = 1613.3$` MeV, so `$T_\pi = [(1613.3)^2 - (139.6 + 938.3)^2]/(2\times938.3) = 768$` MeV.

<div class="problem" data-problem="kaon-threshold"></div>

## 3. The Gell-Mann–Nishijima relation

Define hypercharge `$Y = B + S$`. Then for every hadron made of u, d, s:

```math
Q = I_3 + \frac{Y}{2} = I_3 + \frac{B + S}{2}
```

With heavy quarks, `$Y = B + S + C + \tilde B + T$` (charm `$+1$` for c, bottomness `$-1$` for b, topness `$+1$` for t). The quark table follows:

<div class="meaning">

<dl>
<dt>u</dt><dd>`$Q = +\tfrac23$`, `$I_3 = +\tfrac12$`, `$S = 0$`, `$B = \tfrac13$`, `$Y = \tfrac13$`</dd>
<dt>d</dt><dd>`$Q = -\tfrac13$`, `$I_3 = -\tfrac12$`, `$S = 0$`, `$B = \tfrac13$`, `$Y = \tfrac13$`</dd>
<dt>s</dt><dd>`$Q = -\tfrac13$`, `$I_3 = 0$`, `$S = -1$`, `$B = \tfrac13$`, `$Y = -\tfrac23$`</dd>
</dl>

</div>

Lines of equal charge in an `$(I_3, Y)$` diagram run diagonally (slope `$-2$`), and moving one step along a line of constant `$Q$` swaps a d for an s (U-spin).

## 4. SU(3): octets, decuplets and nonets

With three quark flavours, the symmetry group is SU(3). The quark triplet **3** is a triangle in the `$(I_3, Y)$` plane; the antiquarks form an inverted triangle **3̄**. Combining:

```math
\mathbf 3\otimes\bar{\mathbf 3} = \mathbf 8\oplus\mathbf 1, \qquad \mathbf 3\otimes\mathbf 3\otimes\mathbf 3 = \mathbf{10}\oplus\mathbf 8\oplus\mathbf 8\oplus\mathbf 1
```

<div class="steps">
<div class="step"><p><b>Mesons (q q̄).</b> Nine states: an octet and a singlet. For J<sup>P</sup> = 0⁻: K⁰, K⁺ (Y = +1), π⁻, π⁰, π⁺ and η₈ (Y = 0), K⁻, K̄⁰ (Y = −1), plus the singlet η₁. The physical η and η′ are mixtures of η₈ and η₁.</p></div>
<div class="step"><p><b>Baryon octet (J<sup>P</sup> = ½⁺).</b> n, p (Y = 1, I = ½); Σ⁻, Σ⁰, Σ⁺ (Y = 0, I = 1) and Λ (Y = 0, I = 0), both uds at the centre; Ξ⁻, Ξ⁰ (Y = −1, I = ½). A hexagon with two states in the middle.</p></div>
<div class="step"><p><b>Baryon decuplet (J<sup>P</sup> = 3/2⁺).</b> Δ (4 states, Y = 1), Σ* (3, Y = 0), Ξ* (2, Y = −1), Ω⁻ (1, Y = −2): an inverted triangle with one state at each corner (uuu, ddd, sss).</p></div>
<div class="step"><p><b>Counting check.</b> Rows of constant Y are isospin multiplets; their sizes add up to the dimension: 2 + 4 + 2 = 8 for the octet (counting Σ and Λ as 3 + 1), 4 + 3 + 2 + 1 = 10 for the decuplet.</p></div>
</div>

<figure class="fig" data-fig="baryon-weights"><figcaption>SU(3) weight diagrams with I₃ across and Y = B + S up: the baryon octet, the baryon decuplet with the Ω⁻ at the bottom corner, and the pseudoscalar mesons. Label the points by name, quark content, charge or strangeness. Dashed diagonals join states of equal charge, as Q = I₃ + Y/2 requires.</figcaption></figure>

Switch between octet, decuplet and mesons and click a particle for its quarks.

<figure class="fig" data-fig="@qm-eightfold-way"><figcaption>Each pattern comes from combining u, d and s quarks. Lines of equal charge run diagonally (Q = I₃ + Y/2), and the decuplet's equal mass steps predicted the Ω⁻.</figcaption></figure>

### Mass rules and the Ω⁻

SU(3) is broken because `$m_s$` exceeds `$m_u \approx m_d$` by about 100 to 150 MeV. To first order, the mass splitting goes like `$M = a + bY + c[I(I+1) - Y^2/4]$` (Gell-Mann–Okubo). For the baryon octet this gives

```math
2(M_N + M_\Xi) = 3M_\Lambda + M_\Sigma
```

**Worked example.** With `$M_N = 939$`, `$M_\Xi = 1318$`, `$M_\Sigma = 1193$` MeV: `$M_\Lambda = (4514 - 1193)/3 = 1107$` MeV, against the measured 1115.7 MeV (under 1% off). For mesons the same rule is applied to the squared masses.

<div class="problem" data-problem="gmo-predict"></div>

In the decuplet, `$I = 1 + Y/2$` for every row, which makes the formula linear in `$Y$`: **equal spacing**. Δ(1232), Σ*(1385), Ξ*(1533) step up by about 150 MeV, each step being one more s quark. In 1962 Gell-Mann predicted the missing corner: an `$S = -3$`, `$Q = -1$` baryon near 1680 MeV, stable against strong decay because no lighter S = −3 state exists (`$\Xi\bar K$` would need about 1810 MeV). The Ω⁻ was found at Brookhaven in 1964 at 1672 MeV, decaying weakly in a chain of `$\Delta S = 1$` steps.

## 5. Quarks, colour and moments

<div class="meaning">

<dl>
<dt>Colour</dt><dd>the `$\Delta^{++}$` is uuu with all spins up (`$J = \tfrac32$`) in an S-wave ground state: symmetric in flavour, spin and space. Fermi statistics then needs a hidden antisymmetric label: three colours, with every hadron a colour singlet. Evidence: the `$\pi^0 \to 2\gamma$` rate and `$R = \sigma(e^+e^- \to \text{hadrons})/\sigma(e^+e^- \to \mu^+\mu^-) = 3\sum Q_q^2$` (2 for u, d, s; 10/3 with c)</dd>
<dt>Spin-flavour</dt><dd>the octet has mixed flavour symmetry with `$S = \tfrac12$`; the decuplet is fully symmetric in flavour with `$S = \tfrac32$`, which is why it has spin 3/2 and no Λ-like state</dd>
<dt>Magnetic moments</dt><dd>`$\mu_p = \tfrac13(4\mu_u - \mu_d)$`, `$\mu_n = \tfrac13(4\mu_d - \mu_u)$`. With `$\mu_q \propto Q_q$`, so `$\mu_d = -\mu_u/2$`: `$\mu_n/\mu_p = -\tfrac23$` (measured `$-0.685$`). Constituent masses near 336 MeV give `$\mu_p \approx 2.79\,\mu_N$`</dd>
<dt>Hyperfine splitting</dt><dd>spin-spin colour-magnetic forces raise the decuplet above the octet (Δ − N ≈ 290 MeV) and split Σ from Λ (77 MeV), with strength falling as `$1/m_im_j$`</dd>
</dl>

</div>

**Worked example: Σ⁰ and Λ.** Both are uds. In the Σ⁰ the ud pair has isospin 1 (and so, for an S-wave ground state, spin 1); in the Λ it has isospin 0 and spin 0. The Λ's s quark therefore carries the whole spin and magnetic moment: `$\mu_\Lambda = \mu_s \approx -0.61\,\mu_N$`, a clean measurement of `$m_s \approx 510$` MeV (constituent). The Σ⁰ decays electromagnetically to `$\Lambda\gamma$` (both S = −1, `$\Delta I = 1$` allowed for the photon), in about `$7\times10^{-20}$` s.

<div class="myth">

**"Isospin is a kind of spin, so particles with I = ½ must be fermions."** Isospin lives in flavour space and has nothing to do with rotations in real space. Kaons have `$I = \tfrac12$` and spin 0; Δ baryons have `$I = \tfrac32$` and spin 3/2 by coincidence of the quark structure, not by any rule. What isospin shares with spin is only the algebra, so the same Clebsch-Gordan tables apply.

</div>

<div class="keypoints">

- Isospin: `$N$` (½), π (1), Δ (3/2), Λ (0); conserved by strong forces only. Clebsch-Gordan coefficients give branching ratios (`$\Delta^+$`: `$p\pi^0 : n\pi^+ = 2 : 1$`) and cross-section ratios (9 : 1 : 2 at the Δ).
- Strangeness: conserved in strong and EM interactions, `$|\Delta S| = 1$` in weak decays; associated production; s quark has `$S = -1$`.
- Gell-Mann–Nishijima: `$Q = I_3 + Y/2$`, `$Y = B + S\ (+ C + \tilde B + T)$`.
- SU(3): `$3\otimes\bar 3 = 8\oplus1$` (meson nonets), `$3\otimes3\otimes3 = 10\oplus8\oplus8\oplus1$` (baryon octet ½⁺, decuplet 3/2⁺).
- GMO octet `$2(M_N + M_\Xi) = 3M_\Lambda + M_\Sigma$`; decuplet equal spacing (about 150 MeV); Ω⁻ predicted and found (1672 MeV, weak decay).
- Colour from `$\Delta^{++}$`; `$\mu_n/\mu_p = -2/3$`; `$R = 3\sum Q_q^2$`.

</div>

## Practise: exam questions on this lesson

<div class="qbank" data-bank="physics" data-topics="quark-model" data-exam="net" data-n="10"></div>

**Next:** this completes the Part C units of the course. For reaction thresholds and Q values in nuclear processes, revisit the JAM lesson on [nuclear reactions](/learn/courses/iit-jam-physics/nuclear-reactions/); for four-vectors and invariant mass, see [special relativity](/learn/courses/iit-jam-physics/special-relativity/).

---
title: Klein-Gordon and Dirac equations
summary: 'Relativistic quantum mechanics for CSIR NET: the Klein-Gordon equation and its density, the Yukawa range of a force, the Dirac equation, alpha, beta and gamma matrices with their traces, free spinors and negative energies, spin and helicity, zitterbewegung, the non-relativistic limit with g = 2, the exact Dirac hydrogen levels and the Klein paradox.'
minutes: 55
updated: 2026-11-22
quiz:
  - q: Why can the Klein-Gordon density ρ = (iħ/2mc²)(ψ*∂ψ/∂t − ψ∂ψ*/∂t) not be read as a probability density?
    choices: ['It is not conserved', 'It is complex', 'It vanishes for plane waves', 'It can be negative']
    ans: 3
    why: "ρ is real and obeys a continuity equation, but for a plane wave ρ ∝ E, which is negative on the negative-energy branch. It is reinterpreted as a charge density, positive for particles and negative for antiparticles."
  - q: What are the eigenvalues of each component of the Dirac velocity operator cα?
    choices: ['±c', '0 and ±c', '±v', '±c/2']
    ans: 0
    why: "Each αᵢ squares to 1, so its eigenvalues are ±1 and those of cαᵢ are ±c. A measured velocity component of a free Dirac particle is always ±c; the smooth classical velocity is an average over the rapid zitterbewegung."
  - q: In the exact Dirac spectrum of hydrogen, which levels remain degenerate?
    choices: ['All levels of the same n', 'Levels of the same n and j, such as 2s₁/₂ and 2p₁/₂', 'Levels of the same n and l', 'None at all']
    ans: 1
    why: "E depends only on n and j, so 2s₁/₂ and 2p₁/₂ coincide. The Lamb shift (about 1058 MHz), a QED effect from vacuum fluctuations, lifts 2s₁/₂ above 2p₁/₂."
sources:
  - 'J. J. Sakurai, Advanced Quantum Mechanics (1967), chapter 3'
  - 'J. D. Bjorken and S. D. Drell, Relativistic Quantum Mechanics (1964), chapters 1 to 5'
  - 'F. Schwabl, Advanced Quantum Mechanics, 4th ed. (2008), chapters 5 to 10'
  - 'CODATA 2018 recommended values of the fundamental constants (fine-structure constant, electron mass)'
  - 'CSIR-UGC NET Physical Sciences syllabus, Quantum Mechanics unit, published by the National Testing Agency'
---

**Module 5 · about 55 minutes.** Schrödinger's equation treats time and space unequally (one time derivative, two space derivatives), so it cannot be relativistic. Making it relativistic produced two equations, two surprises (negative energies and spin) and, after reinterpretation, antimatter. CSIR NET asks about the algebra of the Dirac matrices, the meaning of the negative-energy states and the hydrogen fine structure. The kinematics, `$E^2 = p^2c^2 + m^2c^4$` and four-vectors, are in [relativistic kinematics](/learn/courses/gate-physics/relativistic-kinematics/) and [special relativity](/learn/courses/iit-jam-physics/special-relativity/); the perturbative fine structure is in [fine structure](/learn/courses/gate-physics/fine-structure/).

<div class="bigidea">Quantise E² = p²c² + m²c⁴ directly and you get the Klein-Gordon equation, right for spin 0 but with no positive probability. Demand an equation first order in time and space and you are forced to 4 × 4 matrices: the Dirac equation, which brings spin ½, g = 2 and the fine structure of hydrogen for free, and whose negative-energy solutions are antiparticles.</div>

## 1. The Klein-Gordon equation

Substitute `$E \to i\hbar\partial_t$`, `$\vec p \to -i\hbar\nabla$` in `$E^2 = p^2c^2 + m^2c^4$`:

```math
\left(\frac{1}{c^2}\frac{\partial^2}{\partial t^2} - \nabla^2 + \frac{m^2c^2}{\hbar^2}\right)\psi = 0, \qquad (\Box + \mu^2)\psi = 0, \quad \mu = \frac{mc}{\hbar}
```

Plane waves `$e^{i(\vec p\cdot\vec r - Et)/\hbar}$` solve it for `$E = \pm\sqrt{p^2c^2 + m^2c^4}$`: both signs. The conserved current is

```math
\rho = \frac{i\hbar}{2mc^2}\left(\psi^*\frac{\partial\psi}{\partial t} - \psi\frac{\partial\psi^*}{\partial t}\right), \qquad \vec j = \frac{\hbar}{2mi}(\psi^*\nabla\psi - \psi\nabla\psi^*)
```

For a plane wave `$\rho = (E/mc^2)|\psi|^2$`, negative on the lower branch. The cure (Pauli and Weisskopf) is to read `$e\rho$` as a *charge* density: positive for particles, negative for antiparticles. The Klein-Gordon equation describes spin-0 particles such as pions, as a field theory rather than a one-particle wave equation.

**Yukawa's range.** The static Klein-Gordon equation with a point source, `$(\nabla^2 - \mu^2)\phi = -g\,\delta^3(\vec r)$`, gives

```math
\phi(r) = \frac{g}{4\pi}\frac{e^{-r/\lambda}}{r}, \qquad \lambda = \frac{\hbar}{mc}
```

A force carried by a particle of mass `$m$` has range equal to its reduced Compton wavelength. For the pion, `$\hbar c/m_\pi c^2 = 197.3/139.6 = 1.41$` fm, the range of the nuclear force; massless photons give the infinite-range Coulomb law. This is the Yukawa potential whose Born cross-section appears in [scattering theory](/learn/courses/csir-net-physics/scattering-theory/).

## 2. The Dirac equation

Dirac wanted `$i\hbar\,\partial_t\psi = H\psi$` with `$H$` linear in `$\vec p$`:

```math
i\hbar\frac{\partial\psi}{\partial t} = \left(c\,\vec\alpha\cdot\vec p + \beta mc^2\right)\psi
```

Squaring must give `$E^2 = p^2c^2 + m^2c^4$`, which requires

```math
\alpha_i^2 = \beta^2 = 1, \qquad \alpha_i\alpha_j + \alpha_j\alpha_i = 0\ (i \ne j), \qquad \alpha_i\beta + \beta\alpha_i = 0
```

Four mutually anticommuting matrices that square to 1 must be traceless with eigenvalues `$\pm1$`, so even-dimensional; 2 × 2 has room for only three (the Pauli matrices). The smallest choice is 4 × 4, and `$\psi$` has four components. In the standard (Dirac) representation

```math
\beta = \begin{pmatrix} I & 0 \\ 0 & -I \end{pmatrix}, \qquad \alpha_i = \begin{pmatrix} 0 & \sigma_i \\ \sigma_i & 0 \end{pmatrix}
```

**Covariant form.** With `$\gamma^0 = \beta$`, `$\gamma^i = \beta\alpha_i$`: `$(i\hbar\gamma^\mu\partial_\mu - mc)\psi = 0$` and `$\{\gamma^\mu, \gamma^\nu\} = 2g^{\mu\nu}$` (metric `$+---$`). Facts that NET tests:

| Quantity | Value |
|---|---|
| `$(\gamma^0)^2$`, `$(\gamma^i)^2$` | `$+1$`, `$-1$` |
| `$\text{Tr}\,\gamma^\mu$`, trace of any odd number of `$\gamma$`s | 0 |
| `$\text{Tr}(\gamma^\mu\gamma^\nu)$` | `$4g^{\mu\nu}$` |
| `$\text{Tr}(\gamma^\mu\gamma^\nu\gamma^\rho\gamma^\sigma)$` | `$4(g^{\mu\nu}g^{\rho\sigma} - g^{\mu\rho}g^{\nu\sigma} + g^{\mu\sigma}g^{\nu\rho})$` |
| `$\gamma^5 = i\gamma^0\gamma^1\gamma^2\gamma^3$` | `$(\gamma^5)^2 = 1$`, `$\{\gamma^5, \gamma^\mu\} = 0$`, `$\text{Tr}\,\gamma^5 = 0$` |
| `$\gamma_\mu\gamma^\mu$` | 4 |

The density `$\rho = \psi^\dagger\psi$` is positive definite, which is what Dirac was after.

<div class="meaning">

<dl>
<dt>ψ (Dirac)</dt><dd>four-component spinor: two spin states times two energy signs</dd>
<dt>α, β</dt><dd>4 × 4 anticommuting matrices, each squaring to 1</dd>
<dt>γ<sup>μ</sup></dt><dd>covariant matrices, {γ<sup>μ</sup>, γ<sup>ν</sup>} = 2g<sup>μν</sup></dd>
<dt>λ = ħ/mc</dt><dd>reduced Compton wavelength: 386 fm for the electron, 1.41 fm for the pion</dd>
<dt>Helicity</dt><dd>spin along the momentum, Σ·p̂/2, conserved for a free particle</dd>
<dt>Physical meaning</dt><dd>Spin is not put in by hand: a first-order relativistic equation needs a multi-component wavefunction, and the extra components behave as spin ½ with magnetic moment g = 2.</dd>
</dl>

</div>

## 3. Free particles, spin and the negative sea

For a particle at rest, `$H = \beta mc^2$`: two solutions with `$E = +mc^2$` (upper components) and two with `$E = -mc^2$` (lower). In motion, the positive-energy spinor is

```math
u(\vec p) = \sqrt{\frac{E + mc^2}{2mc^2}}\begin{pmatrix} \chi \\[2pt] \dfrac{c\,\vec\sigma\cdot\vec p}{E + mc^2}\chi \end{pmatrix}
```

The lower ("small") components are of order `$v/2c$`: about 0.4% of the upper ones for an electron in hydrogen.

**Spin.** `$[H, \vec L] = -i\hbar c\,\vec\alpha\times\vec p \ne 0$`, so orbital angular momentum alone is not conserved. What commutes with `$H$` is `$\vec J = \vec L + \tfrac\hbar2\vec\Sigma$`, with `$\vec\Sigma = \text{diag}(\vec\sigma, \vec\sigma)$`. The electron has spin ½ built in. The helicity `$h = \vec\Sigma\cdot\hat p$` commutes with the free `$H$`, so free particles keep their helicity.

**Zitterbewegung.** The velocity operator is `$\dot{\vec r} = i[H, \vec r]/\hbar = c\vec\alpha$`, with eigenvalues `$\pm c$`. A wave packet built from positive-energy states alone moves smoothly; one that mixes in negative energies jitters at angular frequency `$2mc^2/\hbar$` (about `$1.6\times10^{21}$` s⁻¹) with amplitude about `$\hbar/2mc = 1.9\times10^{-13}$` m. Localising an electron more sharply than its Compton wavelength needs negative-energy components, which is the deeper reason a one-particle picture breaks down there.

**Hole theory.** Why do electrons not fall into the negative-energy states, radiating forever? Dirac's answer: all of them are already filled. A hole in the sea behaves as a particle of charge `$+e$` and positive energy: the positron (found by Anderson in 1932). Lifting an electron out of the sea, across the gap `$2mc^2$`, is pair creation.

<figure class="fig" data-fig="dirac-branches"><figcaption>The two branches E = ±√(p²c² + m²c⁴) with the 2mc² gap, the light cone and the non-relativistic parabola. The second view plots the exact Dirac binding of hydrogen-like ions against Z: 2s₁/₂ and 2p₁/₂ stay together, and 1s₁/₂ runs out at Z = 137.</figcaption></figure>

**Pair-production thresholds.** A single photon cannot make a pair in empty space (momentum cannot be conserved). Near a nucleus of mass `$M$` the threshold is `$2mc^2(1 + m/M) \approx 1.022$` MeV; near a free electron at rest it is `$4mc^2 = 2.044$` MeV, from the invariant mass `$s = m^2c^4 + 2E_\gamma mc^2 \ge (3mc^2)^2$`.

## 4. The non-relativistic limit and hydrogen

Coupling to fields by `$\vec p \to \vec p - q\vec A$`, `$E \to E - qV$`, and eliminating the small components to order `$v^2/c^2$` gives

```math
H = \frac{(\vec p - q\vec A)^2}{2m} - \frac{q\hbar}{2m}\vec\sigma\cdot\vec B + qV - \frac{p^4}{8m^3c^2} + \frac{1}{2m^2c^2}\frac{1}{r}\frac{dU}{dr}\vec S\cdot\vec L + \frac{\hbar^2}{8m^2c^2}\nabla^2U
```

The second term is the Pauli spin coupling with **g = 2** exactly (QED adds `$\alpha/2\pi$`). The last three are the fine-structure terms: relativistic kinetic energy, spin-orbit (with the Thomas factor ½ already included) and the Darwin term, which acts only on s states and comes from zitterbewegung smearing the electron over a Compton wavelength.

**Exact Dirac hydrogen.** For a point nucleus of charge `$Ze$`, with `$\alpha = 1/137.036$`,

```math
E_{nj} = \frac{mc^2}{\sqrt{1 + \left(\dfrac{Z\alpha}{n - \delta_j}\right)^2}}, \qquad \delta_j = j + \tfrac12 - \sqrt{\left(j + \tfrac12\right)^2 - Z^2\alpha^2}
```

Expanding in `$Z\alpha$`:

```math
E_{nj} \approx mc^2 - \frac{mc^2(Z\alpha)^2}{2n^2} - \frac{mc^2(Z\alpha)^4}{2n^4}\left(\frac{n}{j + \frac12} - \frac34\right)
```

The levels depend on `$n$` and `$j$` only. For `$n = 2$`, `$2p_{3/2}$` lies above the degenerate pair `$2s_{1/2}$`, `$2p_{1/2}$` by `$mc^2\alpha^4/32 = 4.53\times10^{-5}$` eV (10.9 GHz) in hydrogen. The Lamb shift, 1058 MHz, separates `$2s_{1/2}$` from `$2p_{1/2}$`, and is beyond the Dirac equation.

### Worked example: a heavy ion

<div class="steps">
<div class="step"><p><b>Ground state.</b> For n = 1, j = ½, δ = 1 − √(1 − Z²α²), so n − δ = √(1 − Z²α²) and E<sub>1s</sub> = mc²√(1 − Z²α²).</p></div>
<div class="step"><p><b>Lead, Z = 82.</b> Zα = 0.5984, √(1 − 0.3581) = 0.8012, E = 409.4 keV, so the binding energy is 511.0 − 409.4 = 101.6 keV.</p></div>
<div class="step"><p><b>Compare Bohr.</b> 13.606 × 82² eV = 91.5 keV. Relativity binds the 1s electron 11% more tightly: the electron moves at about Zαc = 0.6c.</p></div>
<div class="step"><p><b>The edge.</b> At Zα = 1 (Z ≈ 137) the square root vanishes and beyond it E is complex for a point nucleus. Real nuclei have finite size, which pushes the critical charge to about Z = 170, where the 1s level would touch −mc² and the vacuum would spark pairs.</p></div>
</div>

<div class="problem" data-problem="dirac-binding"></div>

## 5. The Klein paradox

Send an electron of energy `$E$` at a potential step of height `$V_0$`. If `$V_0 > E + mc^2$`, the region beyond the step has `$(E - V_0)^2 > m^2c^4$` with `$E - V_0 < -mc^2$`: propagating *negative-energy* states. The wave is transmitted, and for a sharp step the reflection coefficient can exceed the naive value. The resolution is pair creation at the step: the strong field rips electron-positron pairs from the vacuum, and the positrons travel into the barrier. A step is "sharp" if it rises by `$2mc^2$` over less than a Compton wavelength, a field of order `$m^2c^3/e\hbar = 1.3\times10^{18}$` V/m (the Schwinger field). The paradox shows a single-particle Dirac theory is incomplete; quantum field theory finishes the job.

<div class="myth">

**"The Dirac equation predicts spin because it is relativistic."** Not quite. Spin ½ and `$g = 2$` come from the equation being *first order* with a multi-component wavefunction. The non-relativistic Pauli-Schrödinger equation written as `$(\vec\sigma\cdot\vec\pi)^2/2m$`, with `$\vec\pi = \vec p - q\vec A$`, also gives `$g = 2$` (Lévy-Leblond). What relativity adds is the negative-energy solutions, the Thomas factor and the exact fine structure.

</div>

<div class="keypoints">

- Klein-Gordon `$(\Box + m^2c^2/\hbar^2)\psi = 0$`, spin 0; `$\rho \propto E$` can be negative, so it is a charge density. Static Green's function: Yukawa `$e^{-r/\lambda}/r$`, `$\lambda = \hbar/mc$` (pion 1.41 fm).
- Dirac `$H = c\vec\alpha\cdot\vec p + \beta mc^2$`, `$\alpha_i^2 = \beta^2 = 1$`, all anticommute, 4 × 4 minimum; `$\{\gamma^\mu, \gamma^\nu\} = 2g^{\mu\nu}$`, `$\text{Tr}\,\gamma^\mu\gamma^\nu = 4g^{\mu\nu}$`, odd traces vanish, `$(\gamma^5)^2 = 1$`.
- `$\vec J = \vec L + \tfrac\hbar2\vec\Sigma$` conserved; helicity conserved when free; velocity `$c\vec\alpha$` has eigenvalues `$\pm c$`; zitterbewegung at `$2mc^2/\hbar$`, amplitude `$\hbar/2mc$`.
- Holes are positrons; pair threshold `$2mc^2$` near a nucleus, `$4mc^2$` on a free electron.
- Non-relativistic limit: Pauli term with `$g = 2$`, plus `$p^4$`, spin-orbit and Darwin terms.
- `$E_{nj} = mc^2[1 + (Z\alpha/(n - \delta_j))^2]^{-1/2}$`, `$\delta_j = j + \tfrac12 - \sqrt{(j + \tfrac12)^2 - Z^2\alpha^2}$`; depends on `$n, j$`; `$E_{1s} = mc^2\sqrt{1 - Z^2\alpha^2}$`; hydrogen 2p splitting 4.53 × 10⁻⁵ eV.
- Klein paradox: step `$V_0 > E + mc^2$` transmits through negative-energy states, really pair creation.

</div>

## Practise: exam questions on this lesson

NET Part C style, each with a full solution. More on the [CSIR NET Physics practice page](/learn/courses/csir-net-physics/practice/).

<div class="qbank" data-bank="physics" data-topics="relativistic-quantum" data-exam="net" data-n="10"></div>

**Next:** the statistical physics module continues with [fluctuations, diffusion and Brownian motion](/learn/courses/csir-net-physics/fluctuations-brownian/). For the angular momentum algebra behind j = l ± ½, see [angular momentum](/learn/courses/gate-physics/angular-momentum/).

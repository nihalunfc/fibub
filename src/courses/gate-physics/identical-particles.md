---
title: 'Identical particles'
summary: 'What changes when particles cannot be told apart: the exchange operator, symmetric bosons and antisymmetric fermions, the Pauli principle and Slater determinants, counting two-particle states, the exchange effect on distances, spin singlets and triplets, helium and its ortho and para levels, and filling wells with electrons.'
minutes: 50
updated: 2026-11-22
quiz:
  - q: 'Two electrons are in the spin triplet state. What symmetry must their spatial wavefunction have?'
    choices: ['Antisymmetric under exchange of x₁ and x₂', 'Symmetric under exchange', 'No particular symmetry', 'It must be the same single-particle state for both']
    ans: 0
    why: 'The total state of two fermions is antisymmetric. Triplet spin states are symmetric, so the spatial part must be antisymmetric.'
  - q: 'Two identical particles share three single-particle states. How many two-particle states are there for spinless fermions?'
    choices: ['3', '6', '9', '4']
    ans: 0
    why: 'Fermions need two different states, order not counted: 3 × 2/2 = 3. Bosons have 6 (adding the 3 doubly occupied ones) and distinguishable particles 9.'
  - q: 'Why does the 1s2s triplet of helium lie below the singlet?'
    choices: ['Its antisymmetric spatial state keeps the electrons apart, lowering their repulsion', 'A magnetic force between the spins pulls it down', 'The triplet has more nuclear attraction because of spin-orbit coupling', 'The triplet has a lower kinetic energy because the spins are parallel']
    ans: 0
    why: 'The spin is only a label: the antisymmetric spatial state vanishes at r₁ = r₂, so the electrons avoid each other and the Coulomb repulsion is smaller by twice the exchange integral.'
sources:
  - 'D. J. Griffiths and D. F. Schroeter, Introduction to Quantum Mechanics, 3rd ed. (2018), chapter 5: identical particles'
  - 'J. J. Sakurai and J. Napolitano, Modern Quantum Mechanics, 3rd ed. (2021), chapter 7: identical particles'
  - 'L. D. Landau and E. M. Lifshitz, Quantum Mechanics (Non-relativistic Theory), 3rd ed. (1977), sections 61 to 64'
  - 'GATE Physics (PH) syllabus, quantum mechanics section, published by the organising institute each year'
---

**Module 4 · about 50 minutes.** By the end you will be able to build symmetric and antisymmetric states for two or more particles, count the allowed states, explain the exchange effect and compute it for a well, combine spin and space for two electrons, explain the singlet and triplet levels of helium, and find the ground state of several fermions or bosons in a well. You need the wells and oscillator of [lesson 4.3](/learn/courses/gate-physics/one-dimensional-potentials/) and [lesson 4.4](/learn/courses/gate-physics/harmonic-oscillator/), and singlets and triplets from [lesson 4.7](/learn/courses/gate-physics/spin-addition/).

<div class="bigidea">Two electrons are not two different things that happen to look alike: swapping them gives the same physical state. So the wavefunction may only change sign under the swap. For fermions it does, for bosons it does not, and that single sign builds the periodic table, holds up white dwarfs and makes lasers and superfluids possible.</div>

## 1. The exchange operator

For two particles, define `$P_{12}\psi(1, 2) = \psi(2, 1)$`, where 1 stands for the position and spin of particle 1.

<div class="steps">
<div class="step">

**Same physics.** If the particles are identical, `$|\psi(1,2)|^2$` and `$|\psi(2,1)|^2$` must be equal, so `$\psi(2,1) = e^{i\theta}\psi(1,2)$`.

</div>
<div class="step">

**Swap twice.** `$P_{12}^2 = 1$`, so `$e^{2i\theta} = 1$` and the eigenvalue is `$+1$` or `$-1$`.

</div>
<div class="step">

**It lasts.** For identical particles `$H$` is symmetric, so `$[H, P_{12}] = 0$` and the symmetry never changes in time.

</div>
<div class="step">

**Nature chooses by spin.** Integer-spin particles (photons, pions, `$^4$`He atoms) are **bosons**, symmetric. Half-integer-spin particles (electrons, protons, neutrons, `$^3$`He atoms) are **fermions**, antisymmetric. This is the spin-statistics theorem of relativistic field theory; in non-relativistic quantum mechanics it is taken as a rule.

</div>
</div>

With one particle in state `$a$` and one in state `$b$`:

```math
\psi_\pm(1, 2) = \frac{1}{\sqrt2}\big[\psi_a(1)\psi_b(2) \pm \psi_b(1)\psi_a(2)\big], \qquad + \text{ bosons}, \; - \text{ fermions}
```

For `$a = b$` the fermion state vanishes: **no two fermions can occupy the same single-particle state** (the Pauli principle). For bosons with `$a = b$`, the state is just `$\psi_a(1)\psi_a(2)$`. For `$N$` fermions the antisymmetric state is the Slater determinant, `$\psi = \dfrac{1}{\sqrt{N!}}\det[\psi_{a_i}(j)]$`, which vanishes whenever two rows (states) or two columns (particles) coincide.

<div class="meaning">
<dl>
<dt>`$P_{12}$`</dt><dd>swaps all labels of particle 1 and particle 2 (position and spin together)</dd>
<dt>`$\psi_a, \psi_b$`</dt><dd>single-particle states, including spin when spin matters</dd>
<dt>`$\pm$`</dt><dd>the exchange symmetry: + for bosons, − for fermions</dd>
</dl>
</div>

## 2. Counting states

Two identical particles share `$g$` single-particle states. Count the two-particle states:

```math
\text{distinguishable: } g^2, \qquad \text{bosons: } \frac{g(g + 1)}{2}, \qquad \text{fermions: } \frac{g(g - 1)}{2}
```

Bosons allow the `$g$` doubly occupied states; fermions do not. Check: `$\tfrac12g(g+1) + \tfrac12g(g-1) = g^2$`.

**Worked example.** Two particles in a 1D oscillator with total energy `$3\hbar\omega$`: the pairs `$(n_1, n_2)$` with `$n_1 + n_2 = 2$` are `$(0,2), (2,0), (1,1)$`. Distinguishable: 3 states. Bosons: 2 (the symmetric combination of `$0,2$`, and `$1,1$`). Spinless fermions: 1 (the antisymmetric combination of `$0,2$`).

**Worked example (spin-½ particles).** Two electrons in a 1D well with total energy `$5E_1$` (one in level 1, one in level 2). Spatially there are `$\psi_+$` and `$\psi_-$`; combined with spin, the allowed states are `$\psi_+\chi_{\text{singlet}}$` (1 state) and `$\psi_-\chi_{\text{triplet}}$` (3 states), 4 in all. Direct check: each electron is in a different level and has 2 spin choices, `$2\times2 = 4$`.

## 3. The exchange effect

Symmetry changes where the particles are, even without any force between them. For `$\psi_\pm$`:

```math
\langle(x_1 - x_2)^2\rangle_\pm = \langle x^2\rangle_a + \langle x^2\rangle_b - 2\langle x\rangle_a\langle x\rangle_b \mp 2|\langle x\rangle_{ab}|^2, \qquad \langle x\rangle_{ab} = \int\psi_a^*x\,\psi_b\,dx
```

The last term is the exchange term. Bosons (upper sign) sit closer together than distinguishable particles, fermions (lower sign) further apart, as if there were a force. It matters only when the two wavefunctions overlap, so that `$\langle x\rangle_{ab} \ne 0$`.

**Worked example (levels 1 and 2 of a well of width a).** `$\langle x\rangle_{12} = -\dfrac{16a}{9\pi^2} = -0.180a$` and `$\langle x^2\rangle_n = a^2\left(\tfrac13 - \tfrac{1}{2n^2\pi^2}\right)$`. So `$\langle(x_1 - x_2)^2\rangle$` is `$0.103a^2$` for distinguishable particles, `$0.038a^2$` for bosons and `$0.168a^2$` for spinless fermions. The probability that both are in the left half is `$\tfrac14$` for distinguishable particles, `$\tfrac14 \pm \left(\tfrac{4}{3\pi}\right)^2$` for bosons and fermions: 0.430 and 0.070.

<figure class="fig" data-fig="exchange-density"><figcaption>The joint probability density of two particles in a well, one in each of two levels, with x₁ across and x₂ up. Distinguishable particles give a plain product; bosons pile up along the diagonal x₁ = x₂; fermions leave it empty. The readout gives the mean squared separation and the probability that both are in the left half.</figcaption></figure>

## 4. Two electrons: spin and space together

The full state of two electrons is spatial × spin and must be antisymmetric overall. From [lesson 4.7](/learn/courses/gate-physics/spin-addition/), the triplet (`$S = 1$`) spin states are symmetric and the singlet (`$S = 0$`) antisymmetric, so

```math
\Psi = \psi_+(\mathbf r_1, \mathbf r_2)\,\chi_{\text{singlet}} \quad \text{or} \quad \Psi = \psi_-(\mathbf r_1, \mathbf r_2)\,\chi_{\text{triplet}}
```

Two electrons in the same orbital must form a singlet. Electrons with parallel spins (triplet) have an antisymmetric spatial state and so avoid each other.

**Helium.** The ground state `$1s^2$` is a singlet: both electrons in `$1s$`, spatially symmetric. In the excited configuration `$1s\,2s$` both options exist. With the electron repulsion `$V_{ee}$` treated to first order,

```math
E_\pm = E_{1s} + E_{2s} + J \pm K, \qquad J = \langle V_{ee}\rangle_{\text{direct}}, \quad K = \iint\psi_{1s}^*(1)\psi_{2s}^*(2)\,V_{ee}\,\psi_{2s}(1)\psi_{1s}(2)
```

with `$K > 0$`. The upper sign (symmetric space) goes with the singlet, so the **triplet (orthohelium) lies lower by `$2K$`**. For `$1s\,2s$` the measured levels are 19.82 eV (triplet) and 20.62 eV (singlet) above the ground state, so `$2K \approx 0.80$` eV. Because dipole transitions keep `$S$` ([lesson 4.10](/learn/courses/gate-physics/time-dependent-perturbation/)), the two sets of levels hardly connect, and early spectroscopists thought they were two different gases. The same effect is behind Hund's first rule (maximum `$S$` lies lowest) and ferromagnetism; in the hydrogen molecule it runs the other way and the singlet bonds.

<div class="myth">

**"Parallel spins repel each other magnetically, so the triplet should be higher."** The magnetic interaction of two electron spins is a tiny correction. The splitting comes from the Coulomb repulsion and the spatial symmetry the spin forces on the electrons.

**"Electrons far apart must still be antisymmetrised."** Formally yes, but if the wavefunctions do not overlap the exchange terms vanish and the answer is the same as for distinguishable particles. You need not antisymmetrise with every electron in the universe.

**"Bosons attract each other."** There is no force. The symmetric state simply gives more weight to configurations where the particles are close; with an actual interaction added, this changes the energy, but the symmetry itself does no work.

</div>

## 5. Filling levels

For non-interacting particles, the ground state fills single-particle levels from the bottom, as the symmetry allows.

- **Bosons:** all `$N$` in the lowest level. In a 1D oscillator `$E_0 = N\hbar\omega/2$`.
- **Spinless fermions:** one per level. In the oscillator `$E_0 = \sum_{n=0}^{N-1}(n + \tfrac12)\hbar\omega = \tfrac12N^2\hbar\omega$`.
- **Spin-½ fermions:** two per spatial level (spin up and down). Three electrons in a well of levels `$n^2E_1$`: `$2E_1 + 4E_1 = 6E_1$`.

For `$N$` electrons in a 1D well of length `$L$` (with `$N$` even), the highest filled level is `$n = N/2$`, so the Fermi energy is `$E_F = \dfrac{\pi^2\hbar^2N^2}{8mL^2}$`. In three dimensions the same counting gives the free-electron Fermi energy of metals (a few eV) and the degeneracy pressure that holds up white dwarfs, which you will meet in module 5 together with Bose-Einstein condensation.

<div class="problem" data-problem="fermi-fill"></div>

<div class="keypoints">

- `$P_{12}$` has eigenvalues `$\pm1$`; bosons (integer spin) symmetric, fermions (half-integer spin) antisymmetric.
- `$\psi_\pm = [\psi_a(1)\psi_b(2) \pm \psi_b(1)\psi_a(2)]/\sqrt2$`; fermions cannot share a state (Pauli); Slater determinant for `$N$`.
- Two particles in `$g$` states: `$g^2$`, `$g(g + 1)/2$`, `$g(g - 1)/2$`.
- Exchange term `$\mp2|\langle x\rangle_{ab}|^2$` in `$\langle(x_1 - x_2)^2\rangle$`: bosons closer, fermions apart.
- Two electrons: symmetric space with singlet, antisymmetric space with triplet; helium `$1s\,2s$` triplet lower by `$2K \approx 0.8$` eV.
- Ground states: bosons all in the lowest level; spin-½ fermions two per level; `$E_F = \pi^2\hbar^2N^2/8mL^2$` in a 1D well.

</div>

To see how these rules fill levels at a temperature, try [Bose-Einstein and Fermi-Dirac statistics](/science/quantum-statistics/).

## Practise: GATE questions on this lesson

They start easy and climb to top-rank level. More on the [identical particles practice page](/learn/courses/gate-physics/practice/identical-particles/) and the [GATE Physics practice page](/learn/courses/gate-physics/practice/).

<div class="qbank" data-bank="physics" data-topics="identical-particles" data-exam="gate" data-n="10"></div>

**Next:** this ends module 4, quantum mechanics. [Module 5](/learn/courses/gate-physics/ensembles/) turns to statistical physics, where the Bose and Fermi rules of this lesson decide how gases of many particles behave. Back to the [GATE Physics course](/learn/courses/gate-physics/).

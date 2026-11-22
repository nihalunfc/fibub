---
title: 'Structure of the atom: question types and traps'
seoTitle: 'Atomic structure questions for JEE and NEET: types and traps'
summary: 'Every way entrance exams ask about atomic structure: Bohr-model numbers, spectral lines and series, photoelectric graphs, de Broglie and uncertainty, quantum numbers and nodes, configurations and magnetic moments, each with a method and its trap. Then practise.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: 'The ratio of the radii of the first Bohr orbits of H and He⁺ is:'
    choices: ['1 : 2', '2 : 1', '1 : 4', '4 : 1']
    ans: 1
    why: 'r ∝ n²/Z. For n = 1, r(H)/r(He⁺) = (1/1)/(1/2) = 2 : 1.'
  - q: 'Which set of quantum numbers is NOT allowed?'
    choices: ['n = 2, l = 1, m = 0', 'n = 3, l = 2, m = −2', 'n = 2, l = 2, m = 1', 'n = 4, l = 0, m = 0']
    ans: 2
    why: 'l can only go up to n − 1. For n = 2, l = 2 is impossible.'
  - q: 'In the photoelectric effect, doubling the intensity of light (same frequency) doubles:'
    choices: ['the maximum kinetic energy', 'the stopping potential', 'the number of electrons emitted per second', 'the work function']
    ans: 2
    why: 'More photons per second free more electrons per second; each photon still has the same energy, so the kinetic energy and stopping potential stay the same.'
sources:
  - 'JEE Main, JEE Advanced 2026 and NEET (UG) syllabi: Structure of atom; question patterns studied from published papers (no questions copied)'
---

**Chemistry · Class 11 · about 25 minutes.** Read [Structure of the atom](/learn/courses/engineering-entrance/atomic-structure/) first. Here are the question types, worked examples and practice.

<div class="bigidea">Atomic structure questions are either Bohr-model arithmetic (with Z and n), light arithmetic (E = hc/λ), or rule-checking (quantum numbers, filling order, exceptions). Ratios and the 1240 eV nm shortcut save most of the time.</div>

## The question types

<div class="steps" data-ms="8000">
<div class="step"><b>1. Bohr ratios.</b> r ∝ n²/Z, v ∝ Z/n, E ∝ Z²/n², time period ∝ n³/Z². <i>Trap:</i> mixing up which way Z goes.</div>
<div class="step"><b>2. Spectral lines.</b> Wavelength of a transition, series limits, number of lines n(n − 1)/2, "which line of He⁺ has the same wavelength as a hydrogen line" (match Z²(1/n₁² − 1/n₂²)).</div>
<div class="step"><b>3. Photoelectric effect.</b> KE vs frequency (slope h, intercept −φ), stopping potential, threshold wavelength. <i>Trap:</i> intensity changes the current, not the energy.</div>
<div class="step"><b>4. de Broglie and uncertainty.</b> λ = h/mv, λ = h/√(2mKE), 12.27/√V Å; Δx·Δv ≥ h/4πm.</div>
<div class="step"><b>5. Quantum numbers and orbitals.</b> Allowed sets, number of orbitals and electrons with given numbers, nodes n − l − 1 and l.</div>
<div class="step"><b>6. Configurations and magnetism.</b> Exceptions (Cr, Cu), ions (remove 4s before 3d), unpaired electrons, μ = √(n(n + 2)) BM.</div>
<div class="step"><b>7. Particles and isotopes.</b> Electrons, protons and neutrons in ions; isotopes, isobars, isotones; e/m comparisons.</div>
</div>

## Worked examples

**Example 1 (level 3, matching lines).** Which transition in He⁺ gives the same wavelength as the n = 2 → 1 line of hydrogen? *Solution.* Need 4(1/n₁² − 1/n₂²) = 1 − 1/4 = 3/4, so 1/n₁² − 1/n₂² = 3/16: n₁ = 2, n₂ = 4. **He⁺ 4 → 2.**

**Example 2 (level 3, photoelectric).** Light of 248 nm falls on a metal with work function 3.0 eV. Find the stopping potential. *Solution.* E = 1240/248 = 5.0 eV; KE_max = 5.0 − 3.0 = 2.0 eV, so **V₀ = 2.0 V**.

**Example 3 (level 4, de Broglie).** An electron and a proton have the same kinetic energy. Which has the longer de Broglie wavelength, and by about how much? *Solution.* λ = h/√(2mKE) ∝ 1/√m, so the electron's is longer by √(1836) ≈ **43 times**.

**Example 4 (level 4, magnetism).** Find the spin-only magnetic moment of Fe²⁺ (Z = 26). *Solution.* Fe: [Ar]3d⁶4s². Fe²⁺ loses the 4s electrons first: 3d⁶, four unpaired. μ = √(4 × 6) = **4.90 BM**. *Trap:* removing 3d electrons first gives 3d⁴4s², which is wrong.

**Example 5 (level 5, multi-correct).** For a hydrogen atom in the n = 3 state, which are correct? (a) its energy is −1.51 eV; (b) its radius is 9 times the ground-state radius; (c) its speed is one third of the ground-state speed; (d) its angular momentum is 3h/2π. *Solution.* (a) −13.6/9 = −1.51 ✓; (b) n² = 9 ✓; (c) v ∝ 1/n ✓; (d) mvr = nh/2π ✓. **All four.**

<div class="myth">

**"For ions, fill the electrons in the same order and stop earlier."** For transition-metal ions, the 4s electrons leave first even though 4s filled first. Fe²⁺ is 3d⁶, Cu²⁺ is 3d⁹, Zn²⁺ is 3d¹⁰.

</div>

<div class="meaning">
<dl>
<dt>Bohr ratios</dt><dd>r ∝ n²/Z, v ∝ Z/n, E ∝ Z²/n²</dd>
<dt>Light shortcut</dt><dd>E (eV) = 1240 / λ (nm)</dd>
<dt>Physical meaning</dt><dd>A bigger nuclear charge pulls the electron closer, faster and deeper; a higher level does the opposite.</dd>
</dl>
</div>

## Practise

<div class="qbank" data-bank="entrance-chemistry" data-topics="atomic-structure" data-mode="practice"></div>

<div class="keypoints">

- Bohr ratios: r ∝ n²/Z, v ∝ Z/n, E ∝ Z²/n².
- Match lines between ions by equating Z²(1/n₁² − 1/n₂²).
- E (eV) = 1240/λ (nm); eV₀ = hν − φ; intensity changes only the number of electrons.
- λ = h/√(2mKE): lighter particle, longer wavelength.
- l ≤ n − 1, |m| ≤ l; radial nodes n − l − 1.
- Transition-metal ions lose 4s electrons first.

</div>

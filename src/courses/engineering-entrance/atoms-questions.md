---
title: 'Atoms: question types and traps'
seoTitle: 'Atoms and Bohr model questions for JEE and NEET'
summary: 'Every way entrance exams ask about atoms: alpha scattering and closest approach, Bohr orbit ratios for hydrogen-like ions, energy levels, spectral lines and their number, matching lines of different ions, excitation by photons and electrons, recoil, orbital current and magnetic field, and X-rays with Moseley''s law, each with a method and its trap.'
minutes: 26
updated: 2026-11-22
quiz:
  - q: 'The ratio of the radius of the first orbit of Li²⁺ to that of hydrogen is:'
    choices: ['3', '1/3', '9', '1/9']
    ans: 1
    why: 'rₙ ∝ n²/Z. Same n, Z = 3, so the Li²⁺ orbit is 1/3 the size.'
  - q: 'The wavelength of the first Lyman line of hydrogen is λ. The series limit of the Lyman series is:'
    choices: ['3λ/4', '4λ/3', 'λ/2', '2λ']
    ans: 0
    why: 'First line: 1/λ = R(1 − 1/4) = 3R/4. Limit: 1/λ∞ = R. So λ∞ = (3/4)λ.'
  - q: 'An electron of energy 12.5 eV collides with hydrogen atoms in the ground state. The highest level they can be raised to is:'
    choices: ['n = 2', 'n = 3', 'n = 4', 'ionised']
    ans: 1
    why: 'Levels are at 10.2 eV (n = 2), 12.09 eV (n = 3) and 12.75 eV (n = 4) above the ground state. 12.5 eV reaches n = 3 but not n = 4.'
sources:
  - 'JEE Main, JEE Advanced 2026 and NEET (UG) syllabi: Atoms and nuclei; question patterns studied from the exams'' published papers (no questions copied)'
---

**Physics · Class 12 · about 26 minutes.** Read the lesson [Atoms](/learn/courses/engineering-entrance/atoms/) first. Here you meet every question type, with the method and the trap, then practise.

<div class="bigidea">Almost every atoms question is a ratio. Know how each Bohr quantity scales with n and Z (r ∝ n²/Z, v ∝ Z/n, E ∝ Z²/n², T ∝ n³/Z²), and the energy ladder −13.6, −3.4, −1.51, −0.85 eV, and most answers take one line.</div>

## The nine question types

<div class="steps" data-ms="9000">
<div class="step"><b>1. Alpha scattering.</b> r₀ = 2.88Z/K fm; impact parameter b ∝ cot(θ/2); counts ∝ 1/sin⁴(θ/2). <i>Trap:</i> using Z instead of 2Z (the alpha has charge 2e).</div>
<div class="step"><b>2. Ratios of orbit properties.</b> r ∝ n²/Z, v ∝ Z/n, E ∝ Z²/n², T ∝ n³/Z², f ∝ Z²/n³, L ∝ n. <i>Trap:</i> angular momentum depends on n only, not Z.</div>
<div class="step"><b>3. Energy, K and U.</b> E = −K, U = 2E. <i>Trap:</i> sign of U and E; K is always positive.</div>
<div class="step"><b>4. Spectral lines.</b> 1/λ = RZ²(1/n₁² − 1/n₂²); first line and series limit; ratios between series. <i>Trap:</i> using n₂ = ∞ for the first line.</div>
<div class="step"><b>5. Number of lines.</b> A sample: n(n − 1)/2; one atom: n − 1; lines within one series: n − n₁. <i>Trap:</i> not reading whether it is one atom or many.</div>
<div class="step"><b>6. Matching lines of different ions.</b> Z²(1/n₁² − 1/n₂²) equal; for He⁺ double the hydrogen n's. <i>Trap:</i> forgetting Z².</div>
<div class="step"><b>7. Excitation and ionisation.</b> Photons: exact energy (or ≥ ionisation). Electrons: any energy above the gap; leftover stays with the electron. <i>Trap:</i> letting a 12.5 eV photon excite hydrogen (no level matches, so it passes through).</div>
<div class="step"><b>8. Orbit as a current, recoil, reduced mass.</b> I = ef = ev/(2πr); B at the nucleus μ₀I/(2r) ∝ Z³/n⁵; recoil speed hν/(Mc); reduced mass for positronium (E halves). <i>Trap:</i> ignoring the nucleus's motion when the problem says "taking recoil into account".</div>
<div class="step"><b>9. X-rays.</b> λ_min = 1240/V nm; Kα from Moseley ν ∝ (Z − 1)²; voltage versus current effects. <i>Trap:</i> thinking characteristic lines move when the voltage changes.</div>
</div>

## Worked examples

**Example 1 (level 3, ratio of series wavelengths).** Find the ratio of the longest wavelength of the Lyman series to that of the Balmer series in hydrogen.

*Solution.* Lyman 2 → 1: 1/λ_L = R(1 − 1/4) = 3R/4. Balmer 3 → 2: 1/λ_B = R(1/4 − 1/9) = 5R/36. Ratio λ_L/λ_B = (5/36)/(3/4) = **5/27**.

**Example 2 (level 4, unknown ion).** A hydrogen-like ion emits a photon of 40.8 eV when its electron goes from n = 2 to n = 1. Identify the ion and its ionisation energy.

*Solution.* 13.6Z²(1 − 1/4) = 10.2Z² = 40.8, so Z² = 4 and Z = 2: **He⁺**. Ionisation energy = 13.6 × 4 = **54.4 eV**.

**Example 3 (level 4, photoelectric effect with hydrogen light).** Light from the hydrogen transition 4 → 2 falls on a metal of work function 2 eV. Find the stopping potential.

*Solution.* Photon energy = 13.6(1/4 − 1/16) = 2.55 eV. K = 2.55 − 2 = 0.55 eV, so **V₀ = 0.55 V**.

**Example 4 (level 5, Moseley).** The Kα line of a target has wavelength 0.179 nm; that of copper (Z = 29) is 0.154 nm. Find the target's Z.

*Solution.* ν ∝ (Z − 1)², so λ ∝ 1/(Z − 1)². `$\dfrac{(Z - 1)^2}{28^2} = \dfrac{0.154}{0.179} = 0.860$`, so Z − 1 = 28 × 0.928 ≈ 26 and **Z = 27 (cobalt)**.

<div class="myth">

**"An atom absorbs any photon with enough energy to excite it."** A photon cannot give part of its energy. Below ionisation, only photons whose energy exactly matches a gap are absorbed; others pass through. Electrons in a beam, by contrast, can hand over just the energy needed.

</div>

<div class="meaning">
<dl>
<dt>Hydrogen ladder</dt><dd>−13.6, −3.4, −1.51, −0.85, −0.54 eV for n = 1 to 5</dd>
<dt>Gaps from n = 1</dt><dd>10.2, 12.09, 12.75, 13.06 eV; ionisation 13.6 eV</dd>
<dt>Physical meaning</dt><dd>Each line is the difference of two rungs, so knowing the rungs lets you predict every colour the atom can show.</dd>
</dl>
</div>

## Practise

The set climbs from level 1 to level 5 and includes numericals, assertion-reason, statements, matching lists, multi-correct and passage questions. Templates give new numbers each time.

<div class="qbank" data-bank="entrance-physics" data-topics="atoms" data-mode="practice"></div>

<div class="keypoints">

- Nine types: scattering, orbit ratios, energies, lines, number of lines, matching ions, excitation, orbit current and recoil, X-rays.
- r ∝ n²/Z, v ∝ Z/n, E ∝ Z²/n², T ∝ n³/Z², L ∝ n.
- Lyman longest : Balmer longest = 5 : 27.
- He⁺ lines match hydrogen's with doubled n.
- Photons excite only with an exact match; electrons can share their energy.
- Moseley: λ_Kα ∝ 1/(Z − 1)².

</div>

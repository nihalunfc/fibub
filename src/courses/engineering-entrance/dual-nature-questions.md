---
title: 'Dual nature of radiation and matter: question types and traps'
seoTitle: 'Photoelectric effect and de Broglie questions: JEE, NEET'
summary: 'Every way entrance exams ask about the dual nature: photon energy and numbers, Einstein''s equation, two-reading problems, changes in intensity and frequency, photoelectric graphs, photoelectrons in fields, radiation pressure, and de Broglie wavelengths compared for different particles, each with a method and its trap.'
minutes: 26
updated: 2026-11-22
quiz:
  - q: 'The threshold wavelength of a metal is 500 nm. Its work function is about:'
    choices: ['1.24 eV', '2.48 eV', '4.96 eV', '0.62 eV']
    ans: 1
    why: 'φ = 1240/λ₀ = 1240/500 = 2.48 eV.'
  - q: 'If the frequency of light on a metal is doubled (above threshold), the maximum kinetic energy of the photoelectrons:'
    choices: ['doubles', 'becomes more than double', 'becomes less than double', 'stays the same']
    ans: 1
    why: 'K = hν − φ. New K = 2hν − φ = 2K + φ, which is more than 2K.'
  - q: 'An electron and an alpha particle are accelerated through the same voltage. The ratio of their de Broglie wavelengths (electron : alpha) is roughly:'
    choices: ['1 : 1', 'about 120 : 1', 'about 8 : 1', '1 : 120']
    ans: 1
    why: 'λ ∝ 1/√(mq). Alpha: mass about 7300 m_e, charge 2e, so √(7300 × 2) ≈ 121.'
sources:
  - 'JEE Main, JEE Advanced 2026 and NEET (UG) syllabi: Dual nature of matter and radiation; question patterns studied from the exams'' published papers (no questions copied)'
---

**Physics · Class 12 · about 26 minutes.** Read the lesson [Dual nature of radiation and matter](/learn/courses/engineering-entrance/dual-nature/) first. Here you meet every question type, with the method and the trap, then practise.

<div class="bigidea">Work in electron volts and nanometres with E = 1240/λ, and this chapter's arithmetic shrinks to one line. Then sort every question into "photon in" (Einstein's equation) or "particle as wave" (λ = h/p).</div>

## The nine question types

<div class="steps" data-ms="9000">
<div class="step"><b>1. Photon energy and number.</b> E = 1240/λ eV; N = Pλ/(hc). <i>Trap:</i> mixing joules and eV; 1 eV = 1.6 × 10⁻¹⁹ J.</div>
<div class="step"><b>2. Einstein's equation.</b> K = hν − φ, eV₀ = K, φ = 1240/λ₀. <i>Trap:</i> using λ₀ where λ is meant, or getting a negative K (no emission).</div>
<div class="step"><b>3. Two readings.</b> Two wavelengths and two stopping potentials: subtract to remove φ and find h, or divide when given a ratio. <i>Trap:</i> assuming V₀ ∝ ν (it is linear, not proportional).</div>
<div class="step"><b>4. What changes when.</b> Intensity: current only. Frequency: V₀ and K. Distance of the lamp: intensity ∝ 1/r², so current changes, V₀ does not. <i>Trap:</i> thinking a closer lamp gives faster electrons.</div>
<div class="step"><b>5. Graphs.</b> V₀-ν (slope h/e), I-V (same V₀ for the same ν), K-ν for two metals (parallel lines). <i>Trap:</i> lines for different metals with different slopes.</div>
<div class="step"><b>6. Photoelectrons in fields.</b> Fastest electrons with v = √(2K/m) in a magnetic field: r = mv/(eB); in a retarding field they stop after K/(eE). <i>Trap:</i> using K in joules versus eV in the same line.</div>
<div class="step"><b>7. Photon momentum and pressure.</b> F = P/c absorbed, 2P/c reflected; partial reflection r: (1 + r)P/c. <i>Trap:</i> forgetting the factor 2 or the cos θ terms at an angle.</div>
<div class="step"><b>8. de Broglie wavelength.</b> λ = h/p = h/√(2mK) = h/√(2mqV); compare particles by which quantity is equal. <i>Trap:</i> λ ∝ 1/V instead of 1/√V.</div>
<div class="step"><b>9. Matter-wave experiments.</b> Davisson-Germer, electron diffraction with Bragg's law 2d sin θ = nλ, Bohr orbits as standing waves (2πr = nλ). <i>Trap:</i> using the photon formula λ = hc/E for an electron.</div>
</div>

## Worked examples

**Example 1 (level 3, two metals).** Light of 400 nm falls on metal A (φ = 2 eV) and metal B (φ = 3.5 eV). Which emits, and with what stopping potential?

*Solution.* Photon energy = 1240/400 = 3.1 eV. A emits with V₀ = **1.1 V**; B does **not** emit, since 3.1 < 3.5 eV.

**Example 2 (level 4, ratio of speeds).** Light of frequency 2ν₀ and then 5ν₀ falls on a metal of threshold ν₀. Find the ratio of the maximum speeds of the photoelectrons.

*Solution.* K₁ = h(2ν₀ − ν₀) = hν₀; K₂ = 4hν₀. Speeds go as √K: **v₁ : v₂ = 1 : 2**.

**Example 3 (level 4, magnetic field).** Photoelectrons from a surface (φ = 2.3 eV) lit by 248 nm light enter a 0.5 mT field at right angles. Largest radius?

*Solution.* E = 1240/248 = 5 eV, K = 2.7 eV = 4.32 × 10⁻¹⁹ J. `$p = \sqrt{2mK} = \sqrt{2 \times 9.1\times10^{-31} \times 4.32\times10^{-19}} \approx 8.87\times10^{-25}$` kg m/s. r = p/(eB) = 8.87 × 10⁻²⁵/(1.6 × 10⁻¹⁹ × 5 × 10⁻⁴) ≈ **1.1 cm**.

**Example 4 (level 5, photon and electron with the same wavelength).** A photon and an electron both have λ = 1 nm. Compare their energies.

*Solution.* Photon: 1240/1 = **1240 eV**. Electron: K = p²/2m = h²/(2mλ²) = (6.63 × 10⁻³⁴)²/(2 × 9.1 × 10⁻³¹ × 10⁻¹⁸) ≈ 2.4 × 10⁻¹⁹ J ≈ **1.5 eV**. Same momentum, very different energy: the photon's energy is pc, the electron's p²/2m.

<div class="myth">

**"Light is sometimes a wave and sometimes a particle, depending on its mood."** Light is one thing that shows wave behaviour when it spreads and interferes, and particle behaviour when it gives up energy to a single electron. Which side you see depends on the experiment, not on the light.

</div>

<div class="meaning">
<dl>
<dt>eV shortcuts</dt><dd>photon E = 1240/λ(nm) eV; electron λ = 1.227/√V nm</dd>
<dt>Comparisons</dt><dd>equal p: equal λ; equal K: λ ∝ 1/√m; equal V: λ ∝ 1/√(mq)</dd>
<dt>Physical meaning</dt><dd>A photon's energy and momentum are tied by E = pc; a slow particle's by K = p²/2m. That single difference explains why equal wavelengths mean very unequal energies.</dd>
</dl>
</div>

## Practise

The set climbs from level 1 to level 5 and includes numericals, assertion-reason, statements, matching lists, multi-correct and passage questions. Templates give new numbers each time.

<div class="qbank" data-bank="entrance-physics" data-topics="dual-nature" data-mode="practice"></div>

<div class="keypoints">

- Nine types: photon numbers, Einstein, two readings, changes, graphs, fields, pressure, de Broglie, experiments.
- Work in eV and nm: E = 1240/λ.
- Two readings remove φ: e(V₁ − V₂) = h(ν₁ − ν₂).
- Doubling ν more than doubles K.
- Same λ: photon E = pc, electron K = p²/2m.
- Lamp distance changes current, not V₀.

</div>

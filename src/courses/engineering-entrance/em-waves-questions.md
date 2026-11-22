---
title: 'Electromagnetic waves: question types and traps'
seoTitle: 'Electromagnetic waves questions for JEE and NEET'
summary: 'Every way entrance exams ask about EM waves: displacement current, reading a wave equation, E and B amplitudes and directions, energy density, intensity and point sources, radiation pressure and force, waves in a medium, and the spectrum with its sources and uses, each with a method and its trap.'
minutes: 24
updated: 2026-11-22
quiz:
  - q: 'An EM wave travels along +z with its electric field along +x. Its magnetic field points along:'
    choices: ['+x', '+y', '−y', '+z']
    ans: 1
    why: 'E × B must point along the travel direction: x̂ × ŷ = ẑ, so B is along +y.'
  - q: 'A light wave goes from air into glass of refractive index 1.5. Which quantity does not change?'
    choices: ['Speed', 'Wavelength', 'Frequency', 'Amplitude of E']
    ans: 2
    why: 'The frequency is set by the source. Speed and wavelength both drop by the factor 1.5.'
  - q: 'The waves used in a TV remote control are:'
    choices: ['microwaves', 'infrared', 'ultraviolet', 'radio waves']
    ans: 1
    why: 'Remote controls use infrared from an LED. Microwaves are used for radar and ovens, radio for broadcasting.'
sources:
  - 'JEE Main, JEE Advanced 2026 and NEET (UG) syllabi: Electromagnetic waves; question patterns studied from the exams'' published papers (no questions copied)'
---

**Physics · Class 12 · about 24 minutes.** Read the lesson [Electromagnetic waves](/learn/courses/engineering-entrance/em-waves/) first. Here you meet every question type, with the method and the trap, then practise.

<div class="bigidea">This chapter has few formulas and many facts. The formulas all come from E₀ = cB₀ and I = ½ε₀cE₀²; the facts come from one table, the spectrum. Learn both and every question is a one-liner.</div>

## The eight question types

<div class="steps" data-ms="9000">
<div class="step"><b>1. Displacement current.</b> I_d = ε₀ dΦ_E/dt = C dV/dt; equals the conduction current in the wires. B between plates ∝ r inside, ∝ 1/r outside. <i>Trap:</i> thinking no magnetic field exists between the plates.</div>
<div class="step"><b>2. Reading a wave equation.</b> λ = 2π/k, f = ω/2π, v = ω/k, direction from the sign: (kx − ωt) moves to +x. <i>Trap:</i> confusing k with 1/λ.</div>
<div class="step"><b>3. Directions of E, B and travel.</b> E × B along the travel direction. <i>Trap:</i> giving B parallel to E.</div>
<div class="step"><b>4. Amplitudes and energy density.</b> B₀ = E₀/c; u_E = u_B; average u = ½ε₀E₀², rms fields E₀/√2. <i>Trap:</i> thinking the magnetic part carries less energy because B is numerically tiny.</div>
<div class="step"><b>5. Intensity and point sources.</b> I = ½ε₀cE₀²; I = P/(4πr²); E₀ ∝ 1/r. <i>Trap:</i> using E_rms in place of E₀ in the ½ formula (with rms the ½ goes away).</div>
<div class="step"><b>6. Momentum and radiation pressure.</b> p = U/c; force IA/c or 2IA/c; at angle θ, normal force (IA cos²θ/c)(1 + reflectivity). <i>Trap:</i> forgetting the factor 2 for reflection, or one cos θ for the tilted area.</div>
<div class="step"><b>7. Waves in a medium.</b> v = c/√(μ_rε_r) = c/n; λ shrinks, f stays. <i>Trap:</i> changing the frequency.</div>
<div class="step"><b>8. The spectrum.</b> Order, typical wavelengths, sources and uses; photon energy 1240/λ(nm) eV. <i>Trap:</i> swapping UV and IR uses (UV sterilises, IR heats).</div>
</div>

## Worked examples

**Example 1 (level 3, rms fields).** Sunlight at the Earth has intensity about 1.4 kW/m². Find the rms and peak electric field.

*Solution.* I = ε₀cE_rms², so `$E_{\text{rms}} = \sqrt{\dfrac{1400}{8.85\times10^{-12}\times3\times10^8}} \approx 726$` V/m. Peak = √2 × 726 ≈ **1030 V/m**. B₀ = 1030/c ≈ 3.4 µT.

**Example 2 (level 4, tilted mirror).** A beam of intensity I falls on a perfect mirror of area A at angle θ to the normal. Find the force on the mirror.

*Solution.* The beam's cross-section that hits the mirror is A cos θ, so momentum arrives at IA cos θ/c per second. On reflection only the normal part reverses, changing by 2 cos θ times. Force = **2IA cos²θ/c**, along the normal. *Trap:* answers with one cos θ only.

**Example 3 (level 4, capacitor with changing voltage).** A 2 µF capacitor's voltage rises at 5 × 10⁶ V/s. Find the displacement current between its plates.

*Solution.* I_d = ε₀ dΦ_E/dt = ε₀A d(V/d)/dt = C dV/dt = 2 × 10⁻⁶ × 5 × 10⁶ = **10 A**, equal to the current in the wires.

**Example 4 (level 3, wave in a medium).** An EM wave of frequency 5 × 10¹⁴ Hz enters a medium with ε_r = 2.25 and μ_r = 1. Find its speed and wavelength there.

*Solution.* n = √2.25 = 1.5, so v = 2 × 10⁸ m/s and λ = v/f = **400 nm** (it was 600 nm in vacuum). Same frequency, same colour to the eye.

<div class="myth">

**"Gamma rays and X-rays differ because they have different wavelengths."** Their ranges overlap. The names tell where they come from: X-rays from electrons outside the nucleus, gamma rays from the nucleus itself.

</div>

<div class="meaning">
<dl>
<dt>Wave equation</dt><dd>E = E₀ sin(kx − ωt): λ = 2π/k, f = ω/2π, v = ω/k</dd>
<dt>Intensity forms</dt><dd>½ε₀cE₀² = ε₀cE_rms² = cB₀²/2μ₀</dd>
<dt>Physical meaning</dt><dd>Light pushes because it carries momentum as well as energy; a mirror takes twice the push of a black surface because it sends the momentum back.</dd>
</dl>
</div>

## Practise

The set climbs from level 1 to level 5 and includes numericals, assertion-reason, statements, matching lists, multi-correct and passage questions. Templates give new numbers each time.

<div class="qbank" data-bank="entrance-physics" data-topics="em-waves" data-mode="practice"></div>

<div class="keypoints">

- Eight types: displacement current, wave equations, directions, amplitudes, intensity, radiation pressure, media, spectrum.
- I_d = C dV/dt equals the wire current.
- E × B along travel; B₀ = E₀/c; equal energy shares.
- Tilted perfect mirror: 2IA cos²θ/c.
- In a medium only f stays the same.
- X-rays from electrons, gamma rays from nuclei.

</div>

---
title: 'Dual nature of radiation and matter'
seoTitle: 'Dual nature of radiation and matter: JEE and NEET'
summary: 'Photons and their energy and momentum, the photoelectric effect with its experimental laws, Einstein''s equation, threshold and stopping potential, graphs of current and kinetic energy, radiation pressure, de Broglie waves of electrons and other particles, and the Davisson-Germer experiment.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: 'Doubling the intensity of light on a photocell (same frequency) doubles:'
    choices: ['the stopping potential', 'the maximum kinetic energy', 'the saturation current', 'the threshold frequency']
    ans: 2
    why: 'Twice the intensity means twice as many photons per second, so twice as many electrons. Each photon''s energy is unchanged, so K_max and V₀ stay the same.'
  - q: 'The slope of a graph of stopping potential against frequency is:'
    choices: ['h', 'h/e', 'e/h', 'the work function']
    ans: 1
    why: 'eV₀ = hν − φ, so V₀ = (h/e)ν − φ/e. The slope h/e is the same for every metal; the intercept depends on the metal.'
  - q: 'A proton and an electron have the same de Broglie wavelength. They have the same:'
    choices: ['speed', 'kinetic energy', 'momentum', 'mass']
    ans: 2
    why: 'λ = h/p, so equal wavelengths mean equal momenta. The lighter electron then moves faster and has more kinetic energy.'
sources:
  - 'National Medical Commission NEET (UG) syllabus and JEE Main / JEE Advanced 2026 syllabi: Dual nature of matter and radiation'
  - 'Planck constant h = 6.626 070 15 × 10⁻³⁴ J s (exact) and electron mass, CODATA 2022 via NIST https://physics.nist.gov/cuu/Constants/'
  - 'Work functions of metals vary with surface condition; typical values from the CRC Handbook of Chemistry and Physics (electron work function of the elements)'
---

**Physics · Class 12 · about 30 minutes.** By the end you will be able to solve any photoelectric problem with Einstein's equation, read its graphs, work out photon numbers and light pressure, and find de Broglie wavelengths of electrons, protons and neutrons.

<div class="bigidea">Light arrives in packets called photons, each carrying energy hν. One photon frees at most one electron, and only if its energy beats the metal's grip, the work function. Matter has the matching surprise: moving particles behave as waves of wavelength h/p.</div>

## 1. Photons

Light of frequency ν comes in photons, each with

```math
E = h\nu = \frac{hc}{\lambda}, \qquad p = \frac{E}{c} = \frac{h}{\lambda}
```

A handy number: `$E\,(\text{eV}) = \dfrac{1240}{\lambda\,(\text{nm})}$`. A 620 nm photon carries 2 eV. Photons have zero rest mass, always move at c in vacuum, and are neither made nor destroyed in collisions with electrons, only absorbed or scattered. A source of power P emitting wavelength λ sends out `$N = \dfrac{P\lambda}{hc}$` photons per second.

<div class="problem" data-problem="dn-photon-rate"></div>

**Radiation pressure** follows from photon momentum: a beam of power P falling on a black surface pushes with P/c; a perfect mirror, 2P/c.

## 2. The photoelectric effect: what experiments show

Light on a clean metal surface can knock out electrons. Measuring the current between the metal and a collecting plate shows:

- Below a **threshold frequency** ν₀, no electrons come out, however bright the light.
- Above it, electrons come out **instantly** (within 10⁻⁹ s), even for dim light.
- The **maximum kinetic energy** of the electrons grows with frequency and does not depend on intensity.
- The **number** of electrons (the saturation current) is proportional to intensity.

The wave picture fails on all four: waves would deliver energy gradually, so bright light of any colour should work after a delay.

## 3. Einstein's equation

One photon gives all its energy to one electron. Part pays the work function φ (the least energy needed to escape), the rest is kinetic energy:

```math
K_{\max} = h\nu - \varphi = eV_0, \qquad \varphi = h\nu_0 = \frac{hc}{\lambda_0}
```

<div class="meaning">
<dl>
<dt>φ</dt><dd>work function of the metal (eV), a few eV for most metals</dd>
<dt>ν₀, λ₀</dt><dd>threshold frequency and threshold wavelength: no emission below ν₀ or above λ₀</dd>
<dt>V₀</dt><dd>stopping potential: the reverse voltage that just stops the fastest electrons</dd>
<dt>K_max</dt><dd>energy of the fastest electrons; others lose some energy inside the metal and come out slower</dd>
<dt>Physical meaning</dt><dd>Brightness decides how many photons arrive, colour decides how much each one carries. Only colour can free an electron; brightness only frees more of them.</dd>
</dl>
</div>

Explore both graphs together.

<figure class="fig" data-fig="photoelectric-kv"><figcaption>Top: maximum kinetic energy against frequency, one straight line per metal, all with slope h, starting at each threshold. Bottom: photocurrent against anode voltage. The current stops at −V₀; brighter light raises the flat (saturation) part but leaves V₀ the same.</figcaption></figure>

<div class="problem" data-problem="dn-stopping"></div>

**Graphs to know.** V₀ against ν: straight line, slope h/e, cutting the ν axis at ν₀ and the V₀ axis at −φ/e. Current against voltage: same V₀ for the same frequency, higher saturation for higher intensity; higher frequency gives a more negative stopping voltage. Current against intensity: a straight line through the origin.

<div class="myth">

**"Brighter light gives faster photoelectrons."** Each photon's energy depends only on frequency. Brighter light means more photons, more electrons, a bigger current, but the same top speed. To get faster electrons, use bluer light.

</div>

## 4. Matter waves

De Broglie proposed that every moving particle has a wavelength

```math
\lambda = \frac{h}{p} = \frac{h}{mv} = \frac{h}{\sqrt{2mK}}
```

For a charge q accelerated through V volts, K = qV, so `$\lambda = \dfrac{h}{\sqrt{2mqV}}$`. For an electron this becomes `$\lambda \approx \dfrac{1.227}{\sqrt V}$` nm. For a particle in thermal motion at temperature T, `$\lambda = \dfrac{h}{\sqrt{3mkT}}$`.

<div class="problem" data-problem="dn-debroglie-v"></div>

Everyday objects have wavelengths far too small to notice: a 0.15 kg cricket ball at 30 m/s has λ ≈ 1.5 × 10⁻³⁴ m. Electrons at 100 V have λ ≈ 0.12 nm, about the spacing of atoms in a crystal, so crystals diffract them.

**Davisson and Germer** (1927) fired 54 eV electrons at a nickel crystal and found a strong reflected beam at 50°, just as X-ray diffraction would predict for λ = 0.167 nm. De Broglie's formula gives 1.227/√54 = 0.167 nm. Matter waves were real. Electron microscopes use them: shorter wavelength than light, so finer detail.

<div class="steps">
<div class="step"><b>Same momentum</b>: same de Broglie wavelength, whatever the mass.</div>
<div class="step"><b>Same kinetic energy</b>: λ ∝ 1/√m, so the electron's wavelength is about 43 times the proton's.</div>
<div class="step"><b>Same accelerating voltage</b>: λ ∝ 1/√(mq). An alpha particle (4m, 2e) has λ = 1/√8 of a proton's.</div>
<div class="step"><b>Photon and electron with the same energy E</b>: photon λ = hc/E, electron λ = h/√(2mE); the photon's is much longer at low energy.</div>
</div>

**Worked example (level 4).** Light of 300 nm and then 400 nm falls on a metal; the stopping potentials are V₁ and V₂ with V₁ − V₂ = 1.03 V. Since `$e(V_1 - V_2) = hc\left(\dfrac1{\lambda_1} - \dfrac1{\lambda_2}\right)$`, the right side is 1240 × (1/300 − 1/400) = 1.03 eV ✓. The work function cancels: two readings give h (or hc) without knowing the metal.

<div class="keypoints">

- Photon E = hν = hc/λ, E(eV) = 1240/λ(nm), p = h/λ; N = Pλ/hc per second.
- Photoelectric laws: threshold frequency, instant emission, K_max ∝ (ν − ν₀), current ∝ intensity.
- Einstein: K_max = hν − φ = eV₀; φ = hν₀.
- V₀-ν graph: slope h/e, same for all metals.
- Intensity changes current, frequency changes V₀.
- de Broglie λ = h/p = h/√(2mK); electron 1.227/√V nm; thermal h/√(3mkT).
- Davisson-Germer: 54 eV electrons, 0.167 nm, diffracted by nickel.

</div>

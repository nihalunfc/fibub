---
title: 'Physics: electromagnetic waves'
seoTitle: 'Electromagnetic waves and spectrum for CUET Physics'
summary: 'Displacement current, how changing E and B fields carry each other through space at the speed of light, and the electromagnetic spectrum from radio waves to gamma rays with their uses, with a live wavelength problem.'
minutes: 14
updated: 2026-11-22
quiz:
  - q: 'In an electromagnetic wave, E and B are:'
    choices: ['perpendicular to each other and to the direction of travel', 'parallel to each other', 'along the direction of travel']
    ans: 0
    why: 'EM waves are transverse: E, B and the direction of motion form a right-handed set.'
  - q: 'Which waves are used to kill microbes in water purifiers?'
    choices: ['Ultraviolet', 'Infrared', 'Microwaves']
    ans: 0
    why: 'UV photons carry enough energy to damage the DNA of microbes.'
  - q: 'Which has the longest wavelength?'
    choices: ['Radio waves', 'Visible light', 'X-rays']
    ans: 0
    why: 'The order of wavelength, longest first: radio, microwave, infrared, visible, UV, X-ray, gamma.'
sources:
  - 'NCERT, Physics Part I (Class 12), Electromagnetic Waves'
  - 'National Testing Agency, CUET (UG) Physics syllabus https://cuet.nta.nic.in/ (checked 2026-11-22)'
  - 'Questions: original fibub writing for this course'
---

**Module 6 · about 14 minutes.** A short, high-scoring chapter: by the end you will know the properties of EM waves and the spectrum in order, with a use for each band. Read first: [electromagnetic induction](/learn/courses/cuet/physics-emi-ac/).

<div class="bigidea">A changing magnetic field makes an electric field (Faraday), and a changing electric field makes a magnetic field (Maxwell). Each keeps making the other, and the pair races off through empty space as light.</div>

**Everyday picture:** two people passing a ball back and forth while running forward. Neither could cross the field alone, but together they keep moving. E and B do the same.

## 1. Displacement current

While a capacitor charges, no charge crosses the gap, yet a magnetic field still circles it. Maxwell explained this with the **displacement current** I_d = ε₀ dΦ_E/dt: a changing electric field acts like a current. With it, the equations predict waves moving at

```math
c = \frac{1}{\sqrt{\mu_0\varepsilon_0}} = 3\times10^8\ \text{m/s} \qquad c = f\lambda \qquad \frac{E_0}{B_0} = c
```

<div class="meaning">

<dl>
<dt>μ₀, ε₀</dt><dd>constants measured with magnets and capacitors on a bench. That they give the speed of light showed light is an electromagnetic wave.</dd>
<dt>E₀/B₀ = c</dt><dd>the electric part is much "bigger" in SI units; both carry equal energy.</dd>
<dt>Physical meaning</dt><dd>EM waves need no medium. They carry energy and momentum, so light can push (radiation pressure, used by solar sails).</dd>
</dl>

</div>

<div class="problem" data-problem="em-wavelength"></div>

## 2. The spectrum, longest wavelength first

<div class="steps" data-title="From radio to gamma">
<div class="step"><b>Radio</b> (&gt; 0.1 m): made by charges oscillating in antennas. AM, FM, TV, mobile phones.</div>
<div class="step"><b>Microwaves</b> (0.1 m to 1 mm): radar, satellite links, microwave ovens (they shake water molecules).</div>
<div class="step"><b>Infrared</b> (1 mm to 700 nm): heat radiation. TV remotes, night vision, greenhouse effect.</div>
<div class="step"><b>Visible</b> (700 to 400 nm): the narrow band our eyes evolved for, red to violet.</div>
<div class="step"><b>Ultraviolet</b> (400 to 1 nm): sterilising water, LASIK eye surgery; the ozone layer blocks most of it.</div>
<div class="step"><b>X-rays</b> (1 nm to 10⁻³ nm): pass through flesh but not bone, so medical imaging.</div>
<div class="step"><b>Gamma rays</b> (&lt; 10⁻³ nm): from nuclei; used to kill cancer cells.</div>
</div>

<div class="myth">

**"Different EM waves travel at different speeds in vacuum."** Every band, from radio to gamma, travels at c in vacuum. They differ only in frequency and wavelength (and so photon energy).

</div>

## See it move

Play with these before you practise. Each one runs in your browser; move the sliders and press the buttons.

<figure class="fig" data-fig="@em-wave-3d"><figcaption>Electromagnetic wave in 3D with linear or circular polarisation (drag to turn).</figcaption></figure>

## 3. Practice

<div class="qbank" data-bank="entrance-physics" data-topics="em-waves" data-exam="cuet" data-n="10" data-mode="practice" data-type="mcq"></div>

<div class="keypoints">

- Displacement current I_d = ε₀ dΦ_E/dt completes Ampere's law.
- c = 1/√(μ₀ε₀) = fλ; E₀/B₀ = c; transverse, no medium needed.
- Order: radio, micro, IR, visible, UV, X, gamma (wavelength falls, energy rises).
- Know one use for each band.

</div>

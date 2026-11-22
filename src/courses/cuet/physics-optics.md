---
title: 'Physics: ray and wave optics'
seoTitle: 'Ray and wave optics for CUET Physics: lenses, YDSE'
summary: 'Mirrors and lenses with the sign convention, refraction, total internal reflection, prisms, the eye''s helpers (microscope and telescope), then Huygens, Young''s double slit, diffraction and polarisation, with a live ray diagram.'
minutes: 24
updated: 2026-11-22
quiz:
  - q: 'An object is placed between the focus and a convex lens. The image is:'
    choices: ['virtual, upright and magnified', 'real and inverted', 'real and the same size']
    ans: 0
    why: 'With u less than f the rays spread out after the lens; traced back they meet on the object side, giving a magnifying-glass image.'
  - q: 'In Young''s double slit experiment, the fringe width β = λD/d. If the slits are moved closer together, β:'
    choices: ['increases', 'decreases', 'stays the same']
    ans: 0
    why: 'β is inversely proportional to d, the slit separation.'
  - q: 'Total internal reflection needs light to go from:'
    choices: ['a denser to a rarer medium at more than the critical angle', 'a rarer to a denser medium', 'any medium at any angle']
    ans: 0
    why: 'Only going into a rarer medium does the refracted ray bend away from the normal and, beyond the critical angle, disappear.'
sources:
  - 'NCERT, Physics Part II (Class 12), Ray Optics and Optical Instruments; Wave Optics'
  - 'National Testing Agency, CUET (UG) Physics syllabus https://cuet.nta.nic.in/ (checked 2026-11-22)'
  - 'Questions: original fibub writing for this course'
---

**Module 6 · about 24 minutes.** The biggest physics chapter by marks. By the end you will locate images, explain fibre optics and rainbows, and use the double-slit formula.

<div class="bigidea">Ray optics treats light as straight lines that bend at surfaces. Wave optics remembers that light is a wave, which explains the bright and dark bands that rays cannot.</div>

**Everyday picture:** a straw in a glass of water looks bent at the surface. Light from the straw speeds up as it leaves the water and bends away from the normal, so your eye traces it back to a point that is higher than the real straw.

## 1. Mirrors and lenses

```math
\frac{1}{v} + \frac{1}{u} = \frac{1}{f}\ \text{(mirror)} \qquad \frac{1}{v} - \frac{1}{u} = \frac{1}{f}\ \text{(lens)} \qquad P = \frac{1}{f\ (\text{m})}
```

<div class="meaning">

<dl>
<dt>Sign convention</dt><dd>measure from the pole or optical centre; distances along the incoming light are +, against it −. So a real object has u negative; a convex lens has f positive, a concave lens f negative.</dd>
<dt>m = v/u (lens)</dt><dd>negative m means inverted, |m| &gt; 1 means magnified.</dd>
<dt>Power P</dt><dd>in dioptres. Lenses in contact add powers: P = P₁ + P₂. A −2 D lens corrects short sight.</dd>
</dl>

</div>

<figure class="fig" data-fig="lens-rays"><figcaption>Slide the object. Beyond F the image is real and inverted; inside F the rays spread out and the image is virtual and magnified.</figcaption></figure>

<div class="problem" data-problem="lens-image"></div>

## 2. Refraction, TIR and prisms

Snell's law: n₁ sin i = n₂ sin r, and n = c/v. Going from dense to rare, beyond the **critical angle** (sin C = 1/n) all the light reflects back: total internal reflection, used in optical fibres and the sparkle of diamonds (C ≈ 24°). A prism deviates light by δ, smallest when the ray passes symmetrically: n = sin((A + δ_m)/2) / sin(A/2). Violet bends most, so white light spreads into a spectrum (dispersion).

| Instrument | Magnifying power (normal use) |
|---|---|
| Simple microscope | m = 1 + D/f (image at 25 cm) |
| Compound microscope | m ≈ (L/f_o)(D/f_e) |
| Astronomical telescope | m = f_o/f_e, tube length f_o + f_e |

## 3. Wave optics

<div class="steps" data-title="Young's double slit, step by step">
<div class="step"><b>Two slits</b> lit by the same source act as two coherent sources, in step.</div>
<div class="step"><b>Bright fringe</b> where the path difference is nλ: crests meet crests.</div>
<div class="step"><b>Dark fringe</b> where it is (n + ½)λ: crests meet troughs and cancel.</div>
<div class="step"><b>Fringe width</b> β = λD/d: longer wavelength or farther screen spreads the fringes; wider slit spacing squeezes them.</div>
<div class="step"><b>Single slit</b> gives a wide central bright band (width 2λD/a) with weaker bands beside it: diffraction.</div>
</div>

Polarisation shows light is transverse. Malus's law: I = I₀ cos²θ through an analyser. Light reflected at Brewster's angle (tan θ_B = n) is fully polarised, which is why polarising sunglasses cut glare from roads and water.

<div class="myth">

**"Diffraction and interference are different kinds of light."** Both are superposition of waves. Interference usually means a few sources (two slits); diffraction means many tiny sources across one opening.

</div>

## See it move

Play with these before you practise. Each one runs in your browser; move the sliders and press the buttons.

<figure class="fig" data-fig="@em-mirror-rays"><figcaption>Concave and convex mirror ray diagrams with a movable object and the mirror formula.</figcaption></figure>

<figure class="fig" data-fig="@em-snell-tir"><figcaption>Snell's law, critical angle and Fresnel shares, plus an optical fibre with its acceptance angle.</figcaption></figure>

<figure class="fig" data-fig="@em-prism-dispersion"><figcaption>Prism with seven traced colours, apex and incidence sliders and a minimum-deviation button.</figcaption></figure>

<figure class="fig" data-fig="@em-single-slit"><figcaption>Single-slit and finite-width double-slit intensity patterns with the screen strip.</figcaption></figure>

<figure class="fig" data-fig="@em-brewster"><figcaption>Reflection polarisation at the Brewster angle and a Malus-law stack of polaroids.</figcaption></figure>

## 4. Practice

<div class="qbank" data-bank="entrance-physics" data-topics="ray-optics,wave-optics" data-exam="cuet" data-n="10" data-mode="practice" data-type="mcq"></div>

<div class="keypoints">

- Mirror 1/v + 1/u = 1/f; lens 1/v − 1/u = 1/f; P = 1/f (m), powers add.
- Snell n₁ sin i = n₂ sin r; TIR when dense → rare beyond sin C = 1/n.
- Telescope m = f_o/f_e; microscope m ≈ (L/f_o)(D/f_e).
- YDSE: β = λD/d; bright at nλ path difference, dark at (n + ½)λ.
- Malus I = I₀cos²θ; Brewster tan θ_B = n.

</div>

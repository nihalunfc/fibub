---
title: 'Ray optics and optical instruments: question types and traps'
seoTitle: 'Ray optics questions for JEE and NEET'
summary: 'Every way entrance exams ask about ray optics: mirror and lens images with signs, moving objects, slabs and apparent depth, total internal reflection, curved surfaces and ball lenses, lensmaker and liquids, combinations and silvered lenses, prisms and dispersion, eye defects and instruments, each with a method and its trap.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: 'An object is placed 10 cm in front of a convex lens of focal length 15 cm. The image is:'
    choices: ['real, 30 cm behind', 'virtual, 30 cm in front, magnified 3 times', 'virtual, 6 cm in front', 'at infinity']
    ans: 1
    why: '1/v = 1/15 − 1/10 = −1/30, so v = −30 cm (same side as the object, virtual). m = v/u = 3: upright and magnified.'
  - q: 'A glass slab 6 cm thick (μ = 1.5) is placed over a mark. The mark appears raised by:'
    choices: ['2 cm', '4 cm', '3 cm', '1.5 cm']
    ans: 0
    why: 'Shift = t(1 − 1/μ) = 6 × (1 − 2/3) = 2 cm.'
  - q: 'A thin prism of angle 5° and μ = 1.6 deviates a ray by:'
    choices: ['8°', '3°', '5°', '1.6°']
    ans: 1
    why: 'For a thin prism δ = (μ − 1)A = 0.6 × 5° = 3°.'
sources:
  - 'JEE Main, JEE Advanced 2026 and NEET (UG) syllabi: Optics; question patterns studied from the exams'' published papers (no questions copied)'
---

**Physics · Class 12 · about 30 minutes.** Read the lesson [Ray optics and optical instruments](/learn/courses/engineering-entrance/ray-optics/) first. Here you meet every question type, with the method and the trap, then practise.

<div class="bigidea">Nearly every ray optics mistake is a sign mistake. Write u, v, f and R with their signs before touching a formula, treat a multi-element system one element at a time (each image is the next object), and check the answer with a rough ray sketch.</div>

## The ten question types

<div class="steps" data-ms="9000">
<div class="step"><b>1. Mirror and lens images.</b> Formula with signs, then m for size and orientation. <i>Trap:</i> u entered as positive.</div>
<div class="step"><b>2. Moving objects and mirrors.</b> Image speed v_i = −m² v_o along the axis (mirror); plane mirror moved at v: image moves at 2v. <i>Trap:</i> using m instead of m².</div>
<div class="step"><b>3. Slabs and apparent depth.</b> Shift t(1 − 1/μ) towards the observer; several layers: add d/μ for each. Mirror at the bottom of water: the light crosses the water twice. <i>Trap:</i> applying d/μ to oblique viewing.</div>
<div class="step"><b>4. Total internal reflection.</b> sin C = μ_rare/μ_dense; circle of light radius h/√(μ² − 1); fibre acceptance angle sin θ = √(μ₁² − μ₂²). <i>Trap:</i> going from rare to dense, TIR is impossible.</div>
<div class="step"><b>5. Single curved surface.</b> μ₂/v − μ₁/u = (μ₂ − μ₁)/R; a bubble or fish in a sphere; ball lens f = μR/[2(μ − 1)] from the centre. <i>Trap:</i> sign of R when light meets a concave surface.</div>
<div class="step"><b>6. Lensmaker and liquids.</b> 1/f = (μ_rel − 1)(1/R₁ − 1/R₂). <i>Trap:</i> in a denser liquid a convex lens diverges.</div>
<div class="step"><b>7. Combinations and silvered lenses.</b> Contact: powers add; separated: image of one is the object for the next; silvered: P = 2P_lens + P_mirror. <i>Trap:</i> counting the lens only once in a silvered lens (light crosses it twice).</div>
<div class="step"><b>8. Prisms and dispersion.</b> Minimum deviation, thin prism, grazing emergence, achromatic pairs (ω₁/f₁ + ω₂/f₂ = 0 for lenses). <i>Trap:</i> using the thin prism formula for a 60° prism.</div>
<div class="step"><b>9. The eye.</b> Myopia: f = −far point; hypermetropia: lens so that an object at 25 cm images at the near point. <i>Trap:</i> sign of the power (myopia: negative).</div>
<div class="step"><b>10. Instruments.</b> Microscope (both lenses short f), telescope (long f_o), normal adjustment versus near point, tube length. <i>Trap:</i> microscope at near point uses m_e = 1 + D/f_e, at infinity D/f_e.</div>
</div>

## Worked examples

**Example 1 (level 3, displacement method).** An object and a screen are 90 cm apart. A convex lens gives sharp images at two positions 30 cm apart. Find f.

*Solution.* f = (D² − x²)/(4D) = (8100 − 900)/360 = **20 cm**. Also the object height is the geometric mean of the two image heights: h = √(h₁h₂).

**Example 2 (level 4, silvered lens).** A biconvex lens (μ = 1.5, both radii 20 cm) is silvered on one face. Find the focal length of the system.

*Solution.* Lens: 1/f = 0.5 × (1/20 + 1/20), so f_L = 20 cm, P_L = +5 D. Silvered face is a concave mirror of radius 20 cm: f_M = 10 cm, P_M = +10 D (converging). P = 2 × 5 + 10 = 20 D: it acts as a **concave mirror of focal length 5 cm**.

**Example 3 (level 4, image speed).** An object moves towards a concave mirror (f = 20 cm) at 2 cm/s. Find the image speed when the object is 30 cm away.

*Solution.* v from 1/v + 1/(−30) = 1/(−20): v = −60 cm, m = −v/u = −2. Image speed = m² × 2 = **8 cm/s**, moving away from the mirror (as the object approaches, a real image recedes).

**Example 4 (level 5, fish in a bowl).** A fish is at the centre of a spherical bowl of water (μ = 4/3, radius R). Where does an observer outside see it?

*Solution.* Light goes from water (μ₁ = 4/3) to air (μ₂ = 1) through the surface. With u = −R and the surface concave towards the light (R negative, −R): `$\dfrac{1}{v} - \dfrac{4/3}{-R} = \dfrac{1 - 4/3}{-R}$` gives 1/v = −1/R, so **v = −R**: the fish appears at the centre, but magnified 4/3 times. Rays from the centre meet the surface along the normal and do not bend.

<div class="myth">

**"Covering half a lens cuts off half the image."** Every part of the lens forms the whole image. Covering half lets through half the light: the full image appears, only dimmer.

</div>

<div class="meaning">
<dl>
<dt>Image speed</dt><dd>along the axis −m²·(object speed) for a mirror, +m²·(object speed) for a lens</dd>
<dt>Chain rule</dt><dd>for several elements, the image from each becomes the object for the next, with distances measured from the next element</dd>
<dt>Physical meaning</dt><dd>Signs are just directions written down. Once every length carries its direction, one formula covers every mirror and lens case.</dd>
</dl>
</div>

## Practise

The set climbs from level 1 to level 5 and includes numericals, assertion-reason, statements, matching lists, multi-correct and passage questions. Templates give new numbers each time.

<div class="qbank" data-bank="entrance-physics" data-topics="ray-optics" data-mode="practice"></div>

<div class="keypoints">

- Ten types: images, moving objects, slabs, TIR, curved surfaces, lensmaker, combinations, prisms, the eye, instruments.
- Image speed m² × object speed.
- Silvered lens: P = 2P_lens + P_mirror; the system is a mirror.
- Displacement method f = (D² − x²)/4D; h = √(h₁h₂).
- Ball lens focuses at μR/[2(μ − 1)] from its centre.
- A half-covered lens gives the full image, dimmer.

</div>

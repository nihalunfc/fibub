---
title: 'Ray optics and optical instruments'
seoTitle: 'Ray optics and instruments: JEE and NEET physics'
summary: 'Reflection and spherical mirrors, refraction, apparent depth and lateral shift, total internal reflection and optical fibres, refraction at a curved surface, thin lenses and the lensmaker''s formula, lens combinations and silvered lenses, prisms and dispersion, the eye and its defects, microscopes and telescopes.'
minutes: 36
updated: 2026-11-22
quiz:
  - q: 'A convex lens of focal length 20 cm is dipped in water (μ = 1.33). Its glass has μ = 1.5. Its focal length becomes about:'
    choices: ['20 cm', '27 cm', '78 cm', '15 cm']
    ans: 2
    why: '1/f ∝ (μ_lens/μ_medium − 1). In air 0.5, in water 1.5/1.33 − 1 ≈ 0.128. So f grows about 3.9 times, to about 78 cm.'
  - q: 'Total internal reflection can happen when light goes:'
    choices: ['from air to glass', 'from glass to air at an angle above the critical angle', 'from glass to air at any angle', 'from water to glass']
    ans: 1
    why: 'It needs light going from a denser to a rarer medium, at an angle of incidence greater than the critical angle, sin C = 1/μ.'
  - q: 'An object is at the centre of curvature of a concave mirror. Its image is:'
    choices: ['at infinity', 'at the focus, diminished', 'at the centre of curvature, real, inverted, same size', 'behind the mirror']
    ans: 2
    why: 'Put the object 2f in front of the mirror; the mirror formula gives an image 2f in front too: real, inverted, magnification −1.'
sources:
  - 'National Medical Commission NEET (UG) syllabus and JEE Main / JEE Advanced 2026 syllabi: Optics'
  - 'Refractive indices of water (1.33) and crown glass (about 1.5): refractiveindex.info database https://refractiveindex.info'
---

**Physics · Class 12 · about 36 minutes.** By the end you will be able to locate images for mirrors, lenses and refracting surfaces with one sign convention, handle prisms and total internal reflection, and work out the magnifying power of microscopes and telescopes.

<div class="bigidea">Light travels in straight lines until it meets a surface; then it either bounces (reflection) or bends (refraction) by rules set by the angle and the refractive index. Every mirror, lens and instrument is these two rules applied again and again, with one sign convention to keep track of directions.</div>

## 1. Sign convention and mirrors

Use the **Cartesian convention**: measure all distances from the pole or optical centre; distances in the direction the light travels are positive, against it negative; heights up are positive. An object in front is at negative u.

```math
\text{Mirror: } \frac1v + \frac1u = \frac1f, \quad m = -\frac vu, \qquad f = \frac R2
```

A concave mirror has negative f, a convex mirror positive f. A plane mirror forms a virtual image as far behind as the object is in front; turning the mirror by θ turns the reflected ray by 2θ; two mirrors at angle θ give `$\dfrac{360°}{\theta} - 1$` images (when 360/θ is even).

<div class="myth">

**"A concave mirror always forms a real image."** Only if the object is beyond the focus. Inside the focus, it forms a virtual, upright, magnified image: that is how a shaving or make-up mirror works.

</div>

## 2. Refraction

**Snell's law:** `$\mu_1\sin i = \mu_2\sin r$`, where `$\mu = c/v$`. Light bends towards the normal on entering a denser medium. Frequency stays the same; speed and wavelength drop by μ.

- **Apparent depth** (looking straight down): real depth/μ, so an object in water seems raised by `$d\left(1 - \dfrac1\mu\right)$`.
- **Glass slab:** the ray comes out parallel to its original direction, shifted sideways by `$t\,\dfrac{\sin(i - r)}{\cos r}$`. An object seen through a slab shifts by `$t(1 - 1/\mu)$` towards the slab.

<div class="problem" data-problem="ro-apparent-depth"></div>

**Total internal reflection.** Going from denser to rarer, the refracted ray grazes the surface at the critical angle C, `$\sin C = \dfrac{\mu_{\text{rarer}}}{\mu_{\text{denser}}}$`. Beyond C, all the light reflects. Glass-air: C ≈ 42°; water-air: C ≈ 49°; diamond: C ≈ 24°, which is why diamonds sparkle. **Optical fibres** guide light by repeated total internal reflection. A lamp at depth h in water lights a circle of radius `$\dfrac{h}{\sqrt{\mu^2 - 1}}$` at the surface. Mirages and the shimmer over hot roads are total internal reflection in air layers.

## 3. Refraction at a curved surface and thin lenses

At one spherical surface of radius R between media μ₁ (object side) and μ₂:

```math
\frac{\mu_2}{v} - \frac{\mu_1}{u} = \frac{\mu_2 - \mu_1}{R}
```

Two such surfaces make a thin lens:

```math
\frac1v - \frac1u = \frac1f, \qquad \frac1f = (\mu - 1)\left(\frac1{R_1} - \frac1{R_2}\right), \qquad m = \frac vu, \qquad P = \frac{1}{f\,(\text{m})}
```

<div class="meaning">
<dl>
<dt>u, v</dt><dd>object and image distances with signs (object in front: u negative)</dd>
<dt>f</dt><dd>focal length: positive for convex (converging) lenses and convex mirrors, negative for concave lenses and concave mirrors</dd>
<dt>R₁, R₂</dt><dd>radii of the first and second surfaces met by the light, with signs</dd>
<dt>P</dt><dd>power in dioptres (D) when f is in metres</dd>
<dt>Physical meaning</dt><dd>A lens bends light because its thickness changes across it; the more the surfaces curve and the bigger the index difference, the stronger the bend.</dd>
</dl>
</div>

Try every case here: lens or mirror, object far or near.

<figure class="fig" data-fig="lens-image"><figcaption>Two rays from the tip of the object find the image: one parallel to the axis, one through the centre of the lens (or to the pole of the mirror). Dashed lines are rays traced backwards to a virtual image.</figcaption></figure>

<div class="problem" data-problem="ro-lens-image"></div>

In a liquid, replace (μ − 1) by `$\left(\dfrac{\mu_{\text{lens}}}{\mu_{\text{liquid}}} - 1\right)$`. If the liquid is denser than the lens, the lens changes from converging to diverging.

**Combinations.** Thin lenses in contact: `$P = P_1 + P_2$`. Separated by d: `$\dfrac1F = \dfrac1{f_1} + \dfrac1{f_2} - \dfrac{d}{f_1f_2}$`. A lens silvered on one face acts as a mirror with `$P = 2P_{\text{lens}} + P_{\text{mirror}}$`. **Displacement method:** for a fixed object-screen distance D > 4f, two lens positions a distance x apart give sharp images, with `$f = \dfrac{D^2 - x^2}{4D}$`.

## 4. Prisms and dispersion

For a prism of angle A, deviation δ = i + e − A. At **minimum deviation** the ray passes symmetrically (r = A/2):

```math
\mu = \frac{\sin\left(\frac{A + \delta_m}{2}\right)}{\sin\left(\frac A2\right)}, \qquad \text{thin prism: } \delta = (\mu - 1)A
```

<div class="problem" data-problem="ro-prism"></div>

μ is larger for violet than for red, so white light spreads into a spectrum. **Dispersive power** `$\omega = \dfrac{\mu_v - \mu_r}{\mu_y - 1}$`. Two prisms can cancel dispersion while keeping deviation (achromatic), or cancel deviation while keeping dispersion (direct vision). A rainbow is refraction, dispersion and internal reflection in raindrops; the primary bow has red outside.

## 5. The eye and its defects

The eye lens changes its focal length (accommodation) to focus objects from the near point (25 cm for a normal eye) to infinity.

| Defect | Problem | Correction |
|---|---|---|
| Myopia (short sight) | far point too close | concave lens, f = −(far point distance) |
| Hypermetropia (long sight) | near point too far | convex lens, image of an object at 25 cm placed at the near point |
| Presbyopia | weak accommodation with age | bifocals |
| Astigmatism | cornea curved unequally | cylindrical lens |

## 6. Microscopes and telescopes

- **Simple microscope** (magnifier): `$M = 1 + \dfrac Df$` (image at D = 25 cm), or D/f (image at infinity, relaxed eye).
- **Compound microscope:** `$M = m_o \times m_e \approx \dfrac{L}{f_o}\cdot\dfrac{D}{f_e}$` (final image at infinity, L the tube length). Both lenses have short focal lengths.
- **Astronomical telescope:** `$M = \dfrac{f_o}{f_e}$` at normal adjustment, tube length f_o + f_e; with the image at D, `$M = \dfrac{f_o}{f_e}\left(1 + \dfrac{f_e}{D}\right)$`. A large objective gathers more light and resolves finer detail. Reflecting telescopes use a concave mirror: no chromatic aberration and easier to build large.

**Worked example (level 4).** A compound microscope has f_o = 1 cm and f_e = 5 cm, with the lenses 20 cm apart, and the final image at 25 cm. The eyepiece needs its object at u_e: 1/(−25) − 1/u_e = 1/5 gives u_e = −25/6 ≈ −4.17 cm. So the objective's image is 20 − 4.17 = 15.83 cm behind it, and its object at u_o with 1/15.83 − 1/u_o = 1 gives u_o ≈ −1.07 cm. m_o = 15.83/(−1.07) ≈ −14.8, m_e = 1 + 25/5 = 6. **M ≈ −89** (inverted).

<div class="keypoints">

- Cartesian signs: along the light positive; object in front has negative u.
- Mirror 1/v + 1/u = 1/f, m = −v/u; lens 1/v − 1/u = 1/f, m = v/u.
- Snell μ₁ sin i = μ₂ sin r; apparent depth d/μ; sin C = 1/μ for glass to air.
- Lensmaker 1/f = (μ − 1)(1/R₁ − 1/R₂); in a liquid use μ_lens/μ_liquid − 1.
- Contact P = P₁ + P₂; silvered lens P = 2P_lens + P_mirror; displacement f = (D² − x²)/4D.
- Prism μ = sin((A + δm)/2)/sin(A/2); thin prism δ = (μ − 1)A.
- Myopia: concave lens; hypermetropia: convex.
- Microscope M ≈ (L/f_o)(D/f_e); telescope f_o/f_e.

</div>

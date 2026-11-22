---
title: Ray Optics and Optical Instruments
seoTitle: 'Ray Optics Class 12 notes: mirrors, lenses, prism'
summary: 'Class 12 Ray Optics with animations: mirror and lens formulae, refraction, total internal reflection, lens maker’s formula, prism, microscope and telescope.'
minutes: 70
updated: 2026-11-22
quiz:
  - q: 'An object is placed 30 cm in front of a concave mirror of focal length 10 cm. The image is:'
    choices: ['real, inverted, diminished', 'virtual, erect, magnified', 'real, erect, same size', 'virtual, inverted, diminished']
    ans: 0
    why: '1/v = 1/f − 1/u = −1/10 + 1/30 = −2/30, so v = −15 cm: in front of the mirror (real), m = −v/u = −0.5 (inverted, half size).'
  - q: 'Light goes from glass (n = 1.5) to air. The critical angle is about:'
    choices: ['30°', '42°', '60°', '90°']
    ans: 1
    why: 'sin θc = 1/n = 1/1.5 = 0.667, so θc ≈ 41.8°. Beyond this angle of incidence the light is totally reflected.'
  - q: 'Two thin lenses of power +4 D and −2 D are placed in contact. The focal length of the combination is:'
    choices: ['50 cm', '25 cm', '+2 m', '12.5 cm']
    ans: 0
    why: 'Powers add: P = 4 − 2 = +2 D, so f = 1/P = 0.5 m = 50 cm (converging).'
sources:
  - 'NCERT Class 12 Physics, Chapter 9 “Ray Optics and Optical Instruments” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Refractive indices at 589 nm: CRC Handbook of Chemistry and Physics, 97th edition (2016), table “Index of refraction of inorganic liquids and solids” (water 1.333, crown glass about 1.52, diamond 2.417)'
  - 'Near point of the normal eye, 25 cm: standard convention used in optics texts (Hecht, Optics, 5th ed.)'
---

**Physics · Class 12 · Chapter 9 · about 70 minutes.** By the end you will be able to find images in mirrors and lenses, use the sign convention, explain refraction and total internal reflection, use the lens maker's formula and the prism formula, and work out the magnification of a microscope and a telescope.

<div class="bigidea">When an object is much bigger than the wavelength of light, light can be treated as straight lines called rays. Mirrors turn rays round, glass bends them. Two ideas do almost everything: the laws of reflection and refraction, and a sign convention that lets one formula handle every case.</div>

## 1. Reflection by spherical mirrors

The law of reflection: the angle of reflection equals the angle of incidence, and the incident ray, the normal and the reflected ray lie in one plane. A **spherical mirror** is a piece of a sphere: **concave** if the reflecting side is the inside (like a spoon's bowl), **convex** if it is the outside.

Terms: the **pole** `$P$` (middle of the mirror), the **centre of curvature** `$C$` and **radius of curvature** `$R$` of the sphere, the **principal axis** through `$P$` and `$C$`. Rays close to the axis (paraxial rays) parallel to it meet at the **principal focus** `$F$` (real for concave, apparent for convex). For small apertures

```math
f = \frac{R}{2}
```

**Sign convention (New Cartesian).** Put the pole at the origin with the principal axis as the x-axis and the **incident light travelling in the +x direction**. All distances are measured from the pole; distances against the incident light (to the left) are negative, along it are positive. Heights above the axis are positive. So for a mirror used with an object in front: `$u < 0$`, the focal length of a concave mirror is **negative** and of a convex mirror **positive**.

Principal rays used for a ray diagram: (1) a ray parallel to the axis passes through (concave) or appears to come from (convex) `$F$` after reflection; (2) a ray through `$P$` reflects at the same angle on the other side of the axis; (3) a ray through `$F$` (or aimed at it) emerges parallel to the axis. Where the reflected rays meet is the image.

<figure class="fig" data-fig="c12p-ray-mirror"><figcaption>Drag the object along the axis (or use the slider). Switch between concave and convex and change f. Solid rays meet at a real image; dashed ones appear to meet at a virtual image behind the mirror.</figcaption></figure>

### Mirror formula

```math
\frac{1}{v} + \frac{1}{u} = \frac{1}{f}, \qquad m = \frac{h'}{h} = -\frac{v}{u}
```

<div class="steps" data-fig="c12p-ray-mirrorderive">
<div class="step">An object AB (height h) stands in front of a concave mirror. Its image A′B′ has height h′. Write u = BP, v = B′P and f = FP (all positive in this picture).</div>
<div class="step">The ray from A to the pole P reflects at an equal angle, so triangles ABP and A′B′P are similar: h′/h = B′P/BP = v/u.</div>
<div class="step">The ray from A parallel to the axis meets the mirror at M, where MP = AB = h, and reflects through F. Triangles MPF and A′B′F are similar: h′/h = B′F/FP = (v − f)/f.</div>
<div class="step">Equate: v/u = (v − f)/f, so fv = uv − uf. Divide every term by uvf: 1/u = 1/f − 1/v, i.e. 1/f = 1/u + 1/v.</div>
<div class="step">In the sign convention u, v and f are all measured against the light, so each is negative: 1/v + 1/u = 1/f. The magnification is m = −v/u: negative means inverted, positive means erect.</div>
</div>

<div class="meaning">
<dl>
<dt>u, v, f</dt><dd>object distance, image distance and focal length, with signs from the pole</dd>
<dt>m</dt><dd>magnification = image height/object height; |m| &gt; 1 magnified; m &lt; 0 inverted</dd>
<dt>Physical meaning</dt><dd>The formula is similar triangles in disguise: it ties the distances together so that a point on the object maps to a point on the image.</dd>
</dl>
</div>

<div class="problem" data-problem="c12p-ray-mirror"></div>

**Uses.** Concave mirrors: shaving and make-up mirrors (an erect, magnified virtual image at short range), dentists' mirrors, torch and headlight reflectors (lamp at F gives a parallel beam), solar cookers. Convex mirrors: vehicle rear-view mirrors and street-corner mirrors, because they always give an erect, diminished image with a wide field of view.

<div class="myth">

**“A convex mirror cannot form a real image.”** It can’t, with a real object: it always gives a virtual, erect, smaller image behind the mirror. That is exactly why it is safe: things always look small and in view, which is why the rear-view mirror says “objects in mirror are closer than they appear”.

</div>

For another ray-diagram tool with the formula, see [Mirror ray diagram](/learn/mirror-ray-diagram/).

## 2. Refraction

When light enters another transparent medium, it changes speed, and its path bends at the boundary: **refraction**. In a medium the speed is `$v = c/n$`, where `$n$` is the **refractive index**: `$n = c/v$`, always at least 1. **Snell's law** relates the angles from the normal:

```math
n_1\sin i = n_2\sin r
```

Going into a **denser** medium (higher n) the ray bends **towards** the normal; into a **rarer** one, **away**. The frequency stays fixed while the speed and wavelength both change: `$\lambda_{medium} = \lambda_0/n$`. Ray paths can be reversed.

<figure class="fig" data-fig="@em-snell-tir"><figcaption>Change the two refractive indices and the angle of incidence. Past the critical angle (when going from the denser to the rarer medium) the refracted ray disappears. The lower picture shows an optical fibre.</figcaption></figure>

<div class="problem" data-problem="c12p-ray-snell"></div>

### Apparent depth

Look straight down into water of depth `$d$`. Rays leaving the coin bend away from the normal when they exit, so you trace them back to a point nearer the surface. For rays close to the vertical:

```math
\text{apparent depth} = \frac{\text{real depth}}{n}
```

A 1.33 m deep pool looks only 1 m deep. A diamond (n = 2.42) makes the apparent depth of a scratch on its far side much smaller.

<figure class="fig" data-fig="c12p-ray-depth"><figcaption>Choose water, glass or diamond and the real depth. Two rays from the coin bend at the surface; the dashed lines are what your eye “sees”, converging at depth d/n.</figcaption></figure>

<div class="problem" data-problem="c12p-ray-depth"></div>

## 3. Total internal reflection

When light goes from a denser to a rarer medium, the refracted ray bends away from the normal. At a certain angle of incidence, the **critical angle** `$\theta_c$`, the refracted ray grazes the surface (angle of refraction 90°). Beyond it there is no refracted ray at all: **total internal reflection (TIR)**. It needs (1) light going from the denser to the rarer medium and (2) an angle of incidence greater than `$\theta_c$`.

```math
n\sin\theta_c = 1\cdot\sin 90^\circ \;\Longrightarrow\; \sin\theta_c = \frac{1}{n}\quad(\text{medium to air})
```

For water `$\theta_c \approx 49^\circ$`; for crown glass `$\approx 41^\circ$`; for diamond only `$24.4^\circ$`.

**Applications.**
- **Diamond**: its small critical angle makes light that enters bounce around inside by TIR several times before leaving, giving its sparkle.
- **Prisms** (45°-45°-90°) turn light through 90° or 180° with no loss, in periscopes and binoculars, and are better than silvered mirrors because TIR is 100 % efficient.
- **Mirage** and shimmering roads: hot air near the ground is rarer, so light from the sky bends and is totally reflected upwards; you see a “water” patch.
- **Optical fibres**: a thin glass core (index n₁) is inside a cladding of lower index (n₂). Light entering within the acceptance angle strikes the wall beyond `$\theta_c$` every time and is trapped, travelling kilometres with little loss. Used for broadband (BharatNet), telephone links and endoscopes. For a fibre, `$\sin\alpha_{max} = \sqrt{n_1^2 - n_2^2}$`.

<!--fig:tool optical-fibre-->

<div class="problem" data-problem="c12p-ray-critical"></div>

## 4. Refraction at spherical surfaces and lenses

A **lens** is a piece of transparent material bounded by two curved surfaces (or one curved and one flat). A **convex (converging)** lens is thicker in the middle; a **concave (diverging)** lens is thinner in the middle. For a **thin lens** the thickness is small compared with the radii and focal length, so distances can all be measured from its **optical centre**.

### Refraction at one spherical surface

For a surface of radius `$R$` between media of index `$n_1$` (object side) and `$n_2$`, with paraxial rays, the object distance `$u$` and image distance `$v$` satisfy

```math
\frac{n_2}{v} - \frac{n_1}{u} = \frac{n_2 - n_1}{R}
```

### The lens maker's formula and the thin lens formula

Apply this to two surfaces in turn: the image from the first is the object for the second. Adding the two equations, the intermediate image drops out:

<div class="steps" data-fig="c12p-ray-lensderive">
<div class="step">One curved surface between index n₁ and n₂, radius R, centre C, pole P. A ray from O hits it at M and refracts towards the image I.</div>
<div class="step">For small angles: i = α + γ (exterior angle of triangle OMC) and r = γ − β (exterior angle of MCI). With α ≈ MN/u, γ ≈ MN/R and β ≈ MN/v where MN is the height of M above the axis.</div>
<div class="step">Snell's law for small angles, n₁i = n₂r, gives n₁(1/u + 1/R) = n₂(1/R − 1/v). With the sign convention: n₂/v − n₁/u = (n₂ − n₁)/R.</div>
<div class="step">A thin glass lens (index n) in air has two surfaces. Surface 1 (radius R₁) alone would form an image I₁ at v₁: n/v₁ − 1/u = (n − 1)/R₁.</div>
<div class="step">I₁ acts as the (virtual) object for surface 2 (radius R₂), glass to air: 1/v − n/v₁ = (1 − n)/R₂.</div>
<div class="step">Add the two: 1/v − 1/u = (n − 1)(1/R₁ − 1/R₂). For u at infinity, v = f: the lens maker's formula. In general 1/v − 1/u = 1/f.</div>
</div>

```math
\frac{1}{f} = (n - 1)\left(\frac{1}{R_1} - \frac{1}{R_2}\right), \qquad \frac{1}{v} - \frac{1}{u} = \frac{1}{f}, \qquad m = \frac{h'}{h} = \frac{v}{u}
```

If the lens (index `$n_l$`) sits in a medium of index `$n_m$`, use `$n = n_l/n_m$`: a glass convex lens can become diverging in a denser liquid. A lens is converging if `$f > 0$` (convex), diverging if `$f < 0$`.

<figure class="fig" data-fig="c12p-ray-lensmaker"><figcaption>Choose a shape and set the radii. The lens is drawn from its two surfaces, and parallel rays show the focus. A meniscus switches between converging and diverging as R₂ passes R₁. Switch the surrounding medium to water and watch f grow.</figcaption></figure>

<div class="problem" data-problem="c12p-ray-lensmaker"></div>

### Ray diagrams for lenses

Three principal rays: (1) parallel to the axis, then through the far focus (convex) or as if from the near focus (concave); (2) through the optical centre, undeviated; (3) through the near focus, then parallel to the axis. A convex lens gives a real, inverted image for an object beyond `$F$`, and a virtual, erect, magnified image (a **magnifying glass**) for an object inside `$F$`. A concave lens always gives a virtual, erect, diminished image.

<figure class="fig" data-fig="c12p-ray-lens"><figcaption>Drag the object toward and away from the lens. Notice the image jumping from real to virtual as it crosses the focus. The readout gives v, m, and the power in dioptres.</figcaption></figure>

<div class="problem" data-problem="c12p-ray-lens"></div>

### Power and combinations of lenses

The **power** of a lens is `$P = 1/f$` with `$f$` in metres, in **dioptres (D)**: converging is positive, diverging negative. A +2 D lens has `$f = 50$` cm. Lenses placed in contact add their powers, because the first lens's image is the second one's object:

```math
\frac{1}{f} = \frac{1}{f_1} + \frac{1}{f_2}, \qquad P = P_1 + P_2, \qquad m = m_1 m_2
```

<div class="problem" data-problem="c12p-ray-power"></div>

<div class="myth">

**“Cover half the lens and half the picture disappears.”** The whole image is still formed, because every point of the object sends rays through every part of the lens. Covering half only makes the image dimmer.

</div>

More practice with ray diagrams: [Lens ray diagram](/learn/lens-ray-diagram/) and [Snell's law](/learn/snell-law/), and the [Lens ray tracer](/science/lens-ray-tracer/) for real aberrations.

## 5. Refraction through a prism and dispersion

A **prism** is a transparent solid with two plane faces inclined at the **angle of the prism** `$A$`. A ray bends towards the base at each face, so it is deviated by an angle `$\delta$` from its original direction. The derivation:

<div class="steps" data-fig="c12p-ray-prismderive">
<div class="step">A ray enters face AB at angle of incidence i, refracts at r₁, meets AC at r₂ (inside) and leaves at angle e.</div>
<div class="step">The two normals meet at N and make 90° with their faces, so ∠N = 180° − A. In triangle P₁NP₂: r₁ + r₂ + (180° − A) = 180°, hence r₁ + r₂ = A.</div>
<div class="step">At face 1 the ray bends by (i − r₁); at face 2 by (e − r₂). The total deviation is δ = i + e − (r₁ + r₂) = i + e − A.</div>
<div class="step">Plot δ against i: a U-shaped curve, least at one angle. By reversibility the least deviation happens when the path is symmetric: i = e and r₁ = r₂ = A/2, so D<sub>m</sub> = 2i − A.</div>
<div class="step">Then i = (A + D<sub>m</sub>)/2 and r = A/2, so n = sin i / sin r = sin[(A + D<sub>m</sub>)/2] / sin(A/2).</div>
</div>

```math
\delta = i + e - A, \qquad n = \frac{\sin\frac{A + D_m}{2}}{\sin\frac{A}{2}}
```

For a thin prism (`$A$` small) the formula becomes `$\delta = (n-1)A$`.

<div class="problem" data-problem="c12p-ray-prism"></div>

**Dispersion.** The refractive index depends on wavelength: for glass it is larger for violet than for red (`$n_v > n_r$`), so violet bends more. A prism therefore spreads white light into a spectrum (**dispersion**), from red (least deviated) to violet (most). The spread is measured by the **angular dispersion** `$\delta_v - \delta_r = (n_v - n_r)A$` and the **dispersive power** `$\omega = (n_v - n_r)/(n_y - 1)$`, where `$n_y$` is the mean (yellow) index. A second prism of different glass can recombine the colours (or give deviation without colour).

<figure class="fig" data-fig="@em-prism-dispersion"><figcaption>A prism with seven traced colours: change the apex angle and the angle of incidence, and press the minimum-deviation button to find the symmetrical path.</figcaption></figure>

> **Beyond the syllabus.** The 2023 rationalised book leaves out the natural phenomena due to sunlight: the **rainbow** (refraction, one internal reflection and refraction in raindrops; red outside at about 42°) and the blue colour of the sky (Rayleigh scattering, ∝ 1/λ⁴). See the raindrop below if you are curious.

<figure class="fig" data-fig="@em-rainbow-drop"><figcaption>Beyond the syllabus: a step player through a raindrop that makes a rainbow.</figcaption></figure>

## 6. Optical instruments

**Simple microscope (magnifying glass).** A convex lens of short focal length with the object just inside its focus. The image is virtual, erect and magnified. Using `$D = 25$` cm as the **least distance of distinct vision**, the angular magnification is

```math
m = 1 + \frac{D}{f}\ (\text{image at } D), \qquad m = \frac{D}{f}\ (\text{image at infinity, relaxed eye})
```

**Compound microscope.** Two convex lenses: a short-focus **objective** forms a magnified, real, inverted image of the object, and the **eyepiece** acts as a magnifier on that image. The total magnification is the product

```math
m = m_o m_e = \frac{v_o}{|u_o|}\left(1 + \frac{D}{f_e}\right) \approx \frac{L}{f_o}\cdot\frac{D}{f_e}
```

where `$L$` is the distance between the focal points (the tube length) when the object is near `$f_o$`.

**Astronomical (refracting) telescope.** An objective of large focal length forms a real image of a distant object at its focus; the eyepiece magnifies it. In **normal adjustment** (image at infinity, relaxed eye) the lenses are `$f_o + f_e$` apart and

```math
m = \frac{\beta}{\alpha} = \frac{f_o}{f_e}
```

where `$\alpha$` and `$\beta$` are the angles the object and final image subtend. A larger objective collects more light and resolves finer detail. **Reflecting telescopes** use a large concave mirror as objective (with a small secondary mirror, as in Cassegrain designs): no colour fringes, easy to make large and support from the back, which is why all large research telescopes, such as the 3.6 m Devasthal Optical Telescope in Uttarakhand, are reflectors.

<figure class="fig" data-fig="@em-scope-rays"><figcaption>Rays through a compound microscope and through an astronomical telescope. Change the focal lengths and watch the magnification.</figcaption></figure>

<!--fig:tool microscope-telescope-->

<div class="problem" data-problem="c12p-ray-telescope"></div>

<div class="problem" data-problem="c12p-ray-microscope"></div>

<div class="history">

<ul class="timeline">
<li><b>about 1010</b> Ibn al-Haytham (Alhazen) writes the Book of Optics, studying reflection, refraction and the camera obscura with experiments.</li>
<li><b>1621</b> Willebrord Snellius finds the law of refraction; Descartes publishes it in 1637.</li>
<li><b>1608-1609</b> The telescope appears in the Netherlands; Galileo builds his own and sees the moons of Jupiter.</li>
<li><b>1666</b> Isaac Newton splits sunlight with a prism and recombines it, showing white light is a mixture of colours.</li>
</ul>

</div>

<div class="keypoints">

- Mirror formula 1/v + 1/u = 1/f, f = R/2, m = −v/u. New Cartesian convention: distances from the pole, positive along the incident light; concave f &lt; 0, convex f &gt; 0.
- Refraction: n₁ sin i = n₂ sin r, n = c/v. Apparent depth = real depth/n.
- TIR needs dense to rare and i &gt; θ<sub>c</sub> where sin θ<sub>c</sub> = 1/n. Used in diamonds, prisms, mirages and optical fibres.
- Surface: n₂/v − n₁/u = (n₂ − n₁)/R. Lens maker's: 1/f = (n − 1)(1/R₁ − 1/R₂). Thin lens: 1/v − 1/u = 1/f, m = v/u.
- Power P = 1/f (dioptre). In contact: P = P₁ + P₂, m = m₁m₂.
- Prism: r₁ + r₂ = A, δ = i + e − A, n = sin[(A + D<sub>m</sub>)/2]/sin(A/2); thin prism δ = (n − 1)A. Dispersion: n<sub>v</sub> &gt; n<sub>r</sub>.
- Microscope: m ≈ (L/f<sub>o</sub>)(D/f<sub>e</sub>). Telescope: m = f<sub>o</sub>/f<sub>e</sub>, length f<sub>o</sub> + f<sub>e</sub>.

</div>

Going further for JEE/NEET: [Ray optics (engineering entrance)](/learn/courses/engineering-entrance/ray-optics/) for exam-level problems, and [Wave optics](/learn/courses/engineering-entrance/wave-optics/) for the next chapter's ideas.

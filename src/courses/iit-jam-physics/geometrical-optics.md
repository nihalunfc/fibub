---
title: 'Geometrical optics: mirrors, lenses and systems'
seoTitle: Geometrical optics, mirrors and lenses for IIT JAM
summary: 'Fermat''s principle, reflection, refraction and total internal reflection, apparent depth, prisms and dispersion, spherical mirrors, refraction at a curved surface, thin lenses and the lensmaker''s formula, lens combinations, instruments, aberrations, thick lenses and ray matrices, with one sign convention throughout.'
minutes: 55
updated: 2026-11-22
quiz:
  - q: 'A glass lens (n = 1.5) has focal length 20 cm in air. What is it in water (n = 4/3)?'
    choices: ['80 cm', '20 cm', '26.7 cm', '15 cm']
    ans: 0
    why: '1/f is proportional to (n_lens/n_medium − 1): 0.5 in air and 0.125 in water, so f grows four times.'
  - q: 'Two thin lenses of focal lengths 20 cm and 20 cm are 10 cm apart. What is the equivalent focal length?'
    choices: ['13.3 cm', '10 cm', '40 cm', '20 cm']
    ans: 0
    why: '1/F = 1/20 + 1/20 − 10/400 = 3/40, so F = 13.3 cm. Only lenses in contact give 10 cm.'
  - q: 'Why does a thin layer of hot air above a road look like water?'
    choices: ['Hot air has a lower refractive index, so light from the sky curves back up towards the eye', 'Water vapour reflects the sky', 'The road reflects by total internal reflection', 'Hot air has a higher refractive index']
    ans: 0
    why: 'Rays heading down at a grazing angle bend away from the faster, lower-index air near the road and curve up: the least-time path dips into the hot layer.'
sources:
  - 'E. Hecht, Optics, 5th ed. (2017), chapters 4 to 6'
  - 'F. A. Jenkins and H. E. White, Fundamentals of Optics, 4th ed. (1976), chapters 1 to 10'
  - 'A. Ghatak, Optics, 7th ed. (2020), chapters 2 to 5'
  - 'IIT JAM Physics syllabus (Oscillations, Waves and Optics section), published by the organising IIT each year'
---

**Module 3 · about 55 minutes.** By the end you will be able to derive the laws of reflection and refraction from one principle, handle total internal reflection, slabs and prisms, find the image formed by any mirror, curved surface, lens or system of lenses with one sign convention, design an achromatic doublet, and use cardinal points and ray matrices for thick systems.

<div class="bigidea">When the wavelength is tiny compared with everything it meets, light travels in straight rays that bend only where the refractive index changes. Every rule in this lesson, from Snell's law to the lens formula, follows from one idea: light takes the path of stationary travel time.</div>

## 1. Fermat's principle

Light travels between two points along a path for which the **optical path** `$\int n\,ds$` (and so the travel time) is stationary: usually a minimum. Two laws follow at once:

- **Reflection**: the angle of reflection equals the angle of incidence (the shortest route via a mirror).
- **Refraction** (Snell's law): `$n_1\sin\theta_1 = n_2\sin\theta_2$`. Light trades a longer path in the fast medium for a shorter one in the slow medium, like a lifeguard running along the beach before swimming.

A mirage is Fermat at work: near a hot road the air has a lower index, so grazing rays bend away from it and curve back up. Turning a mirror by `$\theta$` turns the reflected ray by `$2\theta$`. The [Snell's law](/learn/snell-law/) tool shows the bending live.

## 2. Total internal reflection, slabs and apparent depth

Going from a higher index `$n_1$` to a lower one `$n_2$`, the refracted ray reaches `$90^\circ$` at the **critical angle**, `$\sin C = n_2/n_1$`; beyond it all the light reflects. Glass in air: `$41.8^\circ$`; water: `$48.6^\circ$`; diamond (`$n = 2.42$`): `$24.4^\circ$`, which traps light and makes it sparkle. Optical fibres guide light this way ([Optical fibre](/learn/optical-fibre/)).

Seen straight down, an object at depth `$d$` in a medium of index `$n$` appears at `$d/n$`; for several layers add `$t_i/n_i$`. A slab of thickness `$t$` raises an object behind it by `$t(1 - 1/n)$`.

**Worked example.** A coin under 4 cm of water (`$n = 4/3$`) on top of 6 cm of glass (`$n = 1.5$`) appears `$4/(4/3) + 6/1.5 = 3 + 4 = 7$` cm below the surface, instead of 10 cm.

## 3. Prisms and dispersion

A prism of apex angle `$A$` deviates a ray least when the ray passes through symmetrically. Then

```math
n = \frac{\sin[(A + D_m)/2]}{\sin(A/2)}, \qquad \delta \approx (n - 1)A \ \text{(thin prism)}
```

**Worked example.** `$A = 60^\circ$`, `$D_m = 40^\circ$`: `$n = \sin50^\circ/\sin30^\circ = 1.532$`. With `$n = \sqrt2$`: `$\sin[(60^\circ + D)/2] = 0.707$`, so `$D = 30^\circ$`.

Because `$n$` depends on wavelength, the prism spreads colours by `$(n_v - n_r)A$`. The **dispersive power** is `$\omega = (n_v - n_r)/(n - 1)$`. Two thin prisms of different glass, apex opposite, cancel the spread (no dispersion, some deviation) if `$(n_v - n_r)A = (n'_v - n'_r)A'$`, or cancel the deviation (a direct-vision prism) if `$(n - 1)A = (n' - 1)A'$`. Rainbows are prisms made of drops: about `$42^\circ$` from the antisolar point, red outside; the secondary bow has two internal reflections and reversed colours. See [Prism and dispersion](/learn/prism-dispersion/).

## 4. One sign convention for everything

Mixed-up signs cause more lost marks in optics than anything else, so this course uses one rule (the **Cartesian convention**): light travels left to right; measure every distance from the mirror, surface or lens; distances in the direction of the light are positive, against it negative; heights above the axis are positive. A real object is at negative `$u$`.

```math
\text{Mirror: } \frac1v + \frac1u = \frac1f,\ f = \frac R2,\ m = -\frac vu \qquad \text{Lens: } \frac1v - \frac1u = \frac1f,\ m = \frac vu
```

In this convention a concave mirror has negative `$f$`, a convex lens positive `$f$`.

<div class="meaning">

<dl>
<dt>u</dt><dd>object distance from the mirror or lens (negative for a real object in front)</dd>
<dt>v</dt><dd>image distance: for a lens, positive means a real image behind it; for a mirror, negative means a real image in front</dd>
<dt>f</dt><dd>focal length: positive for converging lenses, negative for diverging lenses; negative for concave mirrors</dd>
<dt>m</dt><dd>lateral magnification: negative means inverted</dd>
<dt>Physical meaning</dt><dd>Lenses and mirrors map each object point to one image point. The formulas just say where; the signs say on which side and which way up.</dd>
</dl>

</div>

**Worked example (mirror).** Object 10 cm in front of a concave mirror of radius 30 cm: `$f = -15$`, `$u = -10$`. `$1/v = -1/15 + 1/10 = 1/30$`, `$v = +30$` cm: virtual, behind the mirror, `$m = -v/u = 3$`, upright and magnified: a shaving mirror.

**Worked example (lens).** Object 30 cm in front of a convex lens of 20 cm: `$1/v = 1/20 - 1/30 = 1/60$`, `$v = 60$` cm, `$m = 60/(-30) = -2$`: real, inverted, twice the size.

<figure class="fig" data-fig="lens-ray"><figcaption>Three rays from the tip of the object: parallel to the axis, through the centre and through the front focal point. Move the object across the focal point and watch the image jump from real to virtual. Switch to two lenses and set f₁ + f₂ = d to make a telescope.</figcaption></figure>

<div class="problem" data-problem="thin-lens-image"></div>

## 5. Refraction at a curved surface and the lensmaker's formula

At a single spherical surface of radius `$R$` between indices `$n_1$` (light comes from here) and `$n_2$`:

```math
\frac{n_2}{v} - \frac{n_1}{u} = \frac{n_2 - n_1}{R}
```

Apply it twice (two surfaces, thin glass) and you get the **lensmaker's formula**, with `$n$` the index of the lens relative to its surroundings:

```math
\frac1f = \left(\frac{n_{lens}}{n_{medium}} - 1\right)\left(\frac1{R_1} - \frac1{R_2}\right)
```

**Worked example.** An equiconvex lens, `$R = 20$` cm, `$n = 1.5$`: `$1/f = 0.5(1/20 + 1/20)$`, `$f = 20$` cm. In water the bracket factor becomes `$1.5/1.333 - 1 = 0.125$`, so `$f = 80$` cm. Cut it across the axis into two plano-convex halves and each has `$f = 40$` cm.

**Worked example (two surfaces, done carefully).** A glass sphere (`$n = 1.5$`, `$R = 10$` cm) in a parallel beam: the first surface alone would focus at 30 cm, which is 10 cm beyond the back surface; the second surface (glass to air, `$R = -10$`, `$u = +10$`) gives `$1/v = 0.05 + 0.15$`, `$v = 5$` cm beyond the sphere.

## 6. Lens combinations and instruments

Thin lenses in contact add powers: `$P = P_1 + P_2$`. Separated by `$d$`:

```math
\frac1F = \frac1{f_1} + \frac1{f_2} - \frac{d}{f_1f_2}
```

**Worked example.** Two 20 cm lenses 10 cm apart: `$1/F = 3/40$`, `$F = 13.3$` cm, measured from the principal planes (section 8). A +30 cm lens 20 cm in front of a −10 cm lens: `$1/F = 1/30 - 1/10 + 20/300 = 0$`, an afocal system: a Galilean telescope with magnification 3.

<div class="problem" data-problem="two-lens-focal"></div>

For a real object between two lenses, find the first image, then use it as the object of the second lens (it may be virtual, with positive `$u$`). Magnifications multiply.

| Instrument | Angular magnification |
|---|---|
| magnifier (image at near point `$D = 25$` cm / at infinity) | `$1 + D/f$` / `$D/f$` |
| compound microscope | `$m_o \times D/f_e$` |
| astronomical telescope, normal adjustment | `$f_o/f_e$`, length `$f_o + f_e$`, inverted |
| Galilean telescope | `$f_o/\lvert f_e\rvert$`, length `$f_o - \lvert f_e\rvert$`, upright |

**Worked example.** A microscope with `$f_o = 1$` cm, `$f_e = 5$` cm, lenses 20 cm apart, final image at infinity: the objective must put its image at the eyepiece focus, `$v_o = 15$` cm, so `$u_o = -15/14$` cm and `$m_o = -14$`; total `$14\times5 = 70$`. The [Microscope and telescope](/learn/microscope-telescope/) tool lets you try other designs.

**Displacement method.** With object and screen a fixed `$D$` apart, a convex lens gives two sharp images (if `$D > 4f$`) at positions `$x$` apart, and `$f = (D^2 - x^2)/(4D)$`; the object height is `$\sqrt{h_1h_2}$`.

## 7. Aberrations

**Chromatic aberration**: a lens is a weak prism, so violet focuses closer than red. Two lenses in contact are achromatic if `$\omega_1/f_1 + \omega_2/f_2 = 0$`.

**Worked example.** A +40 cm doublet from crown (`$\omega = 0.02$`) and flint (`$\omega = 0.04$`): `$f_2 = -2f_1$` and `$1/f_1 + 1/f_2 = 1/(2f_1) = 1/40$`, so a +20 cm crown lens and a −40 cm flint lens. The less dispersive glass must be the converging lens.

**Spherical aberration**: edge rays focus closer than central ones. A plano-convex lens does best with its curved side towards the parallel light, so both surfaces share the bending.

<div class="myth">

**"The image is always where the lens formula says, so signs do not matter if I take magnitudes."** Magnitudes hide the physics. `$|v|$` alone cannot tell a real image you can catch on a screen from a virtual one you can only look at, and in a two-lens problem the sign of the first image decides whether the second lens sees a real or a virtual object, which changes the final answer completely. Pick one convention, write the sign of every distance before you substitute, and read the sign of the answer.

</div>

## 8. Thick lenses, cardinal points and ray matrices

A thick lens or a system of lenses behaves like a thin lens if you measure from two **principal planes** instead of from the lens. Together with the two focal points and the two **nodal points** (the same as the principal points when the medium is the same on both sides) these are the six **cardinal points**. For a thick lens of thickness `$d$`:

```math
\frac1f = (n - 1)\left[\frac1{R_1} - \frac1{R_2} + \frac{(n - 1)d}{nR_1R_2}\right]
```

An equiconvex lens with `$R = 20$` cm, `$d = 3$` cm, `$n = 1.5$` has `$f = 20.5$` cm instead of 20 cm.

**Ray matrices** (GATE and NET) write a ray as (height, angle) and each element as a `$2\times2$` matrix: a gap `$d$` is `$\begin{pmatrix}1 & d\\0 & 1\end{pmatrix}$`, a thin lens `$\begin{pmatrix}1 & 0\\-1/f & 1\end{pmatrix}$`. Multiply them right to left. The system's power is `$-C$`; between equal media the determinant is 1; if `$B = 0$` the planes are object and image, with magnification `$A$`. The [Lens ray tracer](/science/lens-ray-tracer/) handles multi-element systems.

<div class="keypoints">

- Fermat: optical path stationary. Snell `$n_1\sin\theta_1 = n_2\sin\theta_2$`; critical angle `$\sin C = n_2/n_1$`; apparent depth `$d/n$`; slab shift `$t(1 - 1/n)$`.
- Prism: `$n = \sin[(A + D_m)/2]/\sin(A/2)$`; thin prism `$(n - 1)A$`; dispersive power `$(n_v - n_r)/(n - 1)$`.
- Cartesian convention: mirror `$1/v + 1/u = 1/f$`, `$m = -v/u$`; lens `$1/v - 1/u = 1/f$`, `$m = v/u$`; surface `$n_2/v - n_1/u = (n_2 - n_1)/R$`.
- Lensmaker uses the relative index; in water a glass lens weakens about four times.
- Separated lenses `$1/F = 1/f_1 + 1/f_2 - d/f_1f_2$`; `$F = \infty$` when `$d = f_1 + f_2$` (telescope).
- Achromat `$\omega_1/f_1 + \omega_2/f_2 = 0$`. Thick systems: measure from principal planes; ray matrices multiply.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. More on the [geometrical optics practice page](/learn/courses/iit-jam-physics/practice/geometrical-optics/).

<div class="qbank" data-bank="physics" data-topics="geometrical-optics" data-exam="jam" data-n="10"></div>

**Next:** rays are the short-wavelength limit of waves. [Lesson 3.7](/learn/courses/iit-jam-physics/interference/) brings the wave nature back with interference, then [diffraction](/learn/courses/iit-jam-physics/diffraction/) and [polarisation](/learn/courses/iit-jam-physics/polarisation/). For drawing ray diagrams by hand first, try the [Lens ray diagram](/learn/lens-ray-diagram/) and [Mirror ray diagram](/learn/mirror-ray-diagram/) tools.

**Go deeper:** GATE Physics derives the laws of reflection and refraction, and how much light each surface reflects, from Maxwell's equations in [the Fresnel equations](/learn/courses/gate-physics/fresnel-equations/).

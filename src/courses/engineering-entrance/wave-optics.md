---
title: 'Wave optics'
seoTitle: 'Wave optics: JEE and NEET physics'
summary: 'Wavefronts and Huygens'' principle, coherent sources and interference, Young''s double slit with fringe width, intensity and shifts by slabs and media, thin films, single slit diffraction, resolving power, and polarisation with Malus''s law and Brewster''s angle.'
minutes: 32
updated: 2026-11-22
quiz:
  - q: 'In Young''s experiment the whole apparatus is dipped in water (μ = 4/3). The fringe width:'
    choices: ['increases to 4/3 of its value', 'decreases to 3/4 of its value', 'stays the same', 'becomes zero']
    ans: 1
    why: 'β = λD/d and the wavelength in water is λ/μ. So β falls to 3/4 of its value in air.'
  - q: 'Two coherent sources of intensity I each interfere. The maximum and minimum intensities are:'
    choices: ['2I and 0', '4I and 0', '2I and I', '4I and 2I']
    ans: 1
    why: 'Amplitudes add: (√I + √I)² = 4I at maxima, (√I − √I)² = 0 at minima. The average stays 2I: energy is only moved around.'
  - q: 'Unpolarised light falls on a glass surface (μ = √3) at the Brewster angle. The angle of incidence is:'
    choices: ['30°', '45°', '60°', '90°']
    ans: 2
    why: 'tan θ_B = μ = √3, so θ_B = 60°. The reflected light is then completely polarised.'
sources:
  - 'National Medical Commission NEET (UG) syllabus and JEE Main / JEE Advanced 2026 syllabi: Wave optics'
  - 'Rayleigh criterion for a circular aperture θ = 1.22 λ/D: standard result, see HyperPhysics (Georgia State University) http://hyperphysics.phy-astr.gsu.edu/hbase/phyopt/Raylei.html'
---

**Physics · Class 12 · about 32 minutes.** By the end you will be able to find fringe positions and intensities in Young's experiment and its variations, handle single slit diffraction and resolving power, and solve polarisation problems.

<div class="bigidea">Light is a wave, so two beams can add up (bright) or cancel (dark) depending on how far each has travelled. A path difference of a whole number of wavelengths means bright; an odd number of half wavelengths means dark. Almost every result in this chapter is that sentence turned into geometry.</div>

## 1. Wavefronts and Huygens' principle

A **wavefront** joins points vibrating in step (same phase). Rays are perpendicular to wavefronts. **Huygens' principle:** every point on a wavefront acts as a source of small secondary waves, and the new wavefront is the surface touching them all. It explains reflection and refraction: in a slower medium the secondary waves travel less far, so the wavefront tilts, giving Snell's law `$\dfrac{\sin i}{\sin r} = \dfrac{v_1}{v_2}$`. (Newton's particle model wrongly predicted light speeds up in water.)

Slide the angle and the index ratio. Watch the small wavelets from the boundary build the new, bent wavefront.

<figure class="fig" data-fig="@em-huygens"><figcaption>The wavelets in the second medium are smaller, so their common tangent is turned: that gives Snell's law, sin θ₁/sin θ₂ = n.</figcaption></figure>

## 2. Interference and coherence

Two waves of amplitudes a₁, a₂ with phase difference φ give intensity

```math
I = I_1 + I_2 + 2\sqrt{I_1I_2}\cos\varphi, \qquad \varphi = \frac{2\pi}{\lambda}\,\Delta x
```

Maxima `$(\sqrt{I_1} + \sqrt{I_2})^2$` where Δx = nλ; minima `$(\sqrt{I_1} - \sqrt{I_2})^2$` where Δx = (n + ½)λ. A steady pattern needs **coherent** sources: same frequency and a fixed phase difference. Two separate bulbs are never coherent, so Young split one source into two slits.

<div class="myth">

**"Dark fringes mean energy is destroyed."** Energy is only moved from the dark places to the bright ones. Bright fringes get 4I (not 2I), dark get 0, and the average over the pattern is exactly 2I.

</div>

## 3. Young's double slit

Slits a distance d apart, screen D away. At a point y from the centre the path difference is `$\Delta x = d\sin\theta \approx \dfrac{yd}{D}$`.

```math
y_{\text{bright}} = \frac{n\lambda D}{d}, \qquad y_{\text{dark}} = \left(n + \tfrac12\right)\frac{\lambda D}{d}, \qquad \beta = \frac{\lambda D}{d}
```

<div class="meaning">
<dl>
<dt>λ</dt><dd>wavelength of the light (in the medium between slits and screen)</dd>
<dt>d</dt><dd>distance between the two slits</dd>
<dt>D</dt><dd>distance from slits to screen</dd>
<dt>β</dt><dd>fringe width, the gap between neighbouring bright (or dark) fringes</dd>
<dt>Physical meaning</dt><dd>Moving one fringe along the screen adds one whole wavelength to the path difference; slits closer together need a longer move to do that, so the fringes spread out.</dd>
</dl>
</div>

Try it here, then switch to a single slit.

<figure class="fig" data-fig="ydse-pattern"><figcaption>Intensity across the screen, with the pattern as it looks below. Double slit: evenly spaced fringes inside a broad diffraction envelope set by the slit width. Single slit: a bright central band twice as wide as the faint side bands.</figcaption></figure>

<div class="problem" data-problem="wo-fringe-width"></div>

**Variations (JEE favourites).**
- In a medium of index μ: β becomes β/μ.
- A thin slab (thickness t, index μ) over one slit adds an extra path `$(\mu - 1)t$`; the whole pattern shifts towards that slit by `$\dfrac{(\mu - 1)tD}{d}$`, with β unchanged.
- **White light:** the central fringe is white, the others coloured (violet inside, red outside), and after a few fringes the colours overlap into white again.
- Source moved sideways or slits at unequal distances: add the extra path before the slits to the path after.
- Intensity at a point: `$I = I_{\max}\cos^2\left(\dfrac{\pi\,\Delta x}{\lambda}\right)$` for equal slits.

## 4. Thin films

Light reflecting off the top and bottom of a thin film (thickness t, index μ) interferes. The extra path is 2μt cos r, plus an extra λ/2 for a reflection off a denser medium. For a soap film in air seen in reflection at near-normal incidence: bright when `$2\mu t = \left(n + \tfrac12\right)\lambda$`, dark when `$2\mu t = n\lambda$`. This makes the colours of soap bubbles and oil on water. An **anti-reflection coating** of thickness λ/(4μ) makes the two reflections cancel.

Slide the thickness and the viewing angle, for a soap film and then a coating on glass. Look for the wavelengths that disappear.

<figure class="fig" data-fig="@em-thin-film"><figcaption>The reflected colour depends on thickness through 2nt cos θ and on whether a half-wave phase flip occurs. A quarter-wave coating cancels reflection.</figcaption></figure>

## 5. Single slit diffraction

Light through a single slit of width a spreads out. Pairing up points across the slit, the first dark band is where `$a\sin\theta = \lambda$`:

```math
\text{minima: } a\sin\theta = n\lambda, \qquad \text{central maximum width on screen} = \frac{2\lambda D}{a}
```

Secondary maxima are at about `$a\sin\theta = \left(n + \tfrac12\right)\lambda$` and much fainter (the first is under 5% of the central one). Diffraction is noticeable only when the opening is not too large compared with λ: sound bends round doors, light hardly does. The **Fresnel distance** `$z_F = a^2/\lambda$` is how far a beam travels before diffraction spreading matches the aperture size; ray optics works for shorter distances.

<div class="problem" data-problem="wo-single-slit"></div>

**Resolving power.** Diffraction blurs every point into a small disc. Two points are just resolved when the centre of one disc falls on the first dark ring of the other (Rayleigh): for a circular aperture of diameter D, `$\theta_{\min} = \dfrac{1.22\lambda}{D}$`. Bigger telescopes and shorter wavelengths resolve finer detail. A microscope's resolving power improves with an oil-immersion lens.

Narrow the slit and watch the central band widen. Then switch to two slits of finite width.

<figure class="fig" data-fig="@em-single-slit"><figcaption>The first dark point is at sin θ = λ/a. With two slits the fine fringes sit inside the single-slit envelope, and some orders go missing.</figcaption></figure>

## 6. Polarisation

Light is a transverse wave, so its vibration direction can be filtered. A polaroid passes only the electric field along its axis. Unpolarised light loses half its intensity in the first polaroid. After that, **Malus's law**:

```math
I = I_0\cos^2\theta
```

where θ is the angle between the light's vibration and the polaroid's axis. Crossed polaroids (90°) block everything; a third between them at 45° lets through I₀/8 of the original unpolarised intensity.

**Brewster's law.** Reflected light is fully polarised when the reflected and refracted rays are at 90°, at `$\tan\theta_B = \mu$`. Sky light scattered at 90° is also polarised, which is why polarising sunglasses darken the sky and cut glare from water.

<div class="problem" data-problem="wo-malus"></div>

**Worked example (level 4).** In a double slit set-up with β = 0.4 mm, a mica sheet (μ = 1.6) 6 µm thick covers one slit, with λ = 600 nm. Extra path = 0.6 × 6 = 3.6 µm = 6λ. The pattern shifts by **6 fringes** (2.4 mm) towards the covered slit; the fringe width stays 0.4 mm.

Slide the angle of incidence to the Brewster angle, then try the three polaroids.

<figure class="fig" data-fig="@em-brewster"><figcaption>At θB the in-page polarisation is not reflected and the reflected and refracted rays are at 90°. Each polaroid multiplies the light by cos² of the angle between neighbouring axes.</figcaption></figure>

<div class="keypoints">

- Huygens: each point of a wavefront is a new source; light is slower in denser media.
- I = I₁ + I₂ + 2√(I₁I₂) cos φ; φ = 2πΔx/λ. Coherent sources needed.
- YDSE: β = λD/d; bright at nβ, dark at (n + ½)β; in a medium β/μ.
- Slab on one slit: shift (μ − 1)tD/d towards it; β unchanged.
- Soap film (reflection): bright 2μt = (n + ½)λ; coating thickness λ/4μ.
- Single slit: minima a sin θ = nλ; central width 2λD/a.
- Resolution θ = 1.22λ/D.
- Malus I = I₀cos²θ; unpolarised loses half; Brewster tan θ_B = μ.

</div>

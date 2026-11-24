---
title: Interference and diffraction
seoTitle: Interference, diffraction and gratings | GATE Physics
summary: 'Optical physics for GATE 2027, part one: temporal and spatial coherence and fringe visibility, thin films and Newton''s rings, the Michelson and Fabry-Perot interferometers with finesse and resolving power, Fresnel and Fraunhofer diffraction, the single slit, the Rayleigh criterion and diffraction gratings with dispersion and resolving power.'
minutes: 65
updated: 2026-11-24
quiz:
  - q: 'In Newton''s rings seen by reflection, the 9th dark ring has diameter 6.0 mm. What is the diameter of the 4th dark ring?'
    choices: ['4.0 mm', '2.7 mm', '4.5 mm', '2.0 mm']
    ans: 0
    why: 'The dark rings satisfy D² = 4mλR, so D is proportional to √m. Then D₄ = 6.0 × √(4/9) = 4.0 mm. Making D proportional to m would give 2.7 mm, which is the common slip.'
  - q: 'A grating must just resolve the sodium doublet (589.0 nm and 589.6 nm) in second order. About how many lines must be illuminated?'
    choices: ['About 490', 'About 980', 'About 250', 'About 1960']
    ans: 0
    why: 'The resolving power needed is λ/Δλ = 589.3/0.6 ≈ 982. The grating gives R = mN, so with m = 2, N = 982/2 ≈ 490. In first order you would need about 980 lines.'
  - q: 'A telescope has a circular aperture of diameter 0.10 m and works at 500 nm. What is its diffraction-limited angular resolution by the Rayleigh criterion?'
    choices: ['6.1 × 10⁻⁶ rad', '5.0 × 10⁻⁶ rad', '1.2 × 10⁻⁵ rad', '3.1 × 10⁻⁶ rad']
    ans: 0
    why: 'For a circular aperture θ = 1.22λ/D = 1.22 × 500×10⁻⁹/0.10 = 6.1 × 10⁻⁶ rad. The value 5.0 × 10⁻⁶ rad is λ/D, which is the figure for a slit of width D, and the factor 1.22 comes from the first zero of the circular (Airy) pattern.'
sources:
  - 'E. Hecht, Optics, 5th ed. (2017), chapters 9 to 11'
  - 'M. Born and E. Wolf, Principles of Optics, 7th ed. (1999), chapters 7, 8 and 10'
  - 'F. L. Pedrotti, L. M. Pedrotti and L. S. Pedrotti, Introduction to Optics, 3rd ed. (2007), chapters 7 to 11'
  - 'A. Ghatak, Optics, 6th ed. (2017), chapters on interference, interferometers and diffraction'
  - 'GATE 2027 Physics (PH) syllabus, section on Optical Physics, https://gate2027.iitm.ac.in/static/doc/GATE2027_Syllabus/PH_GATE2027_Syllabus.pdf (checked 2026-11-24)'
---

**Module 3 · about 65 minutes.** Optical physics is a new section of the GATE 2027 PH syllabus. This lesson covers the wave side (interference and diffraction); [the next lesson](/learn/courses/gate-physics/polarisation-ray-optics/) covers polarisation and ray matrices. By the end you will be able to find coherence lengths and fringe visibility, work out thin-film and Newton's-ring patterns, use the Michelson and Fabry-Perot interferometers, tell Fresnel from Fraunhofer diffraction, and compute single-slit patterns, Rayleigh limits and grating resolving power. The JAM versions are in [interference](/learn/courses/iit-jam-physics/interference/) and [diffraction](/learn/courses/iit-jam-physics/diffraction/); the reflection phases used below come from [lesson 3.7](/learn/courses/gate-physics/fresnel-equations/).

<div class="bigidea">Light from two paths adds as waves: the intensity depends on the phase difference `$\delta = 2\pi\,\Delta/\lambda$` between them. Interference shows up only if the two waves keep a steady phase relation (coherence). Diffraction is interference of the many secondary wavelets across an opening or a grating. The same few ideas produce thin-film colours, interferometers, slit patterns and spectrometers.</div>

## 1. Coherence

Two waves of equal intensity `$I_0$` and phase difference `$\delta$` give `$I = 2I_0(1 + \gamma\cos\delta)$`. The number `$\gamma$` between 0 and 1 says how well the phase relation holds, and the **fringe visibility** is

```math
V = \frac{I_{\max} - I_{\min}}{I_{\max} + I_{\min}} = \gamma
```

<div class="meaning">

<dl>
<dt>temporal coherence</dt><dd>how long a wave train keeps a predictable phase; set by the bandwidth. Coherence time `$\tau_c \approx 1/\Delta\nu$`, coherence length `$\ell_c = c\tau_c \approx \lambda^2/\Delta\lambda$`. Interference fades once the path difference exceeds `$\ell_c$`</dd>
<dt>spatial coherence</dt><dd>how well the phase agrees between different points across the beam; set by the size of the source. A source of angular size `$\alpha$` is coherent over a transverse width about `$\lambda/\alpha$`. Young's slits must sit within this width</dd>
<dt>visibility V</dt><dd>1 for perfect fringes, 0 for none. For two equal-intensity beams `$V = \gamma$`; for unequal intensities `$V = 2\sqrt{I_1I_2}\,\gamma/(I_1 + I_2)$`</dd>
</dl>

</div>

**Worked example.** Compare a green LED with `$\lambda = 520$` nm and `$\Delta\lambda = 30$` nm, and a He-Ne laser with a Doppler-broadened width `$\Delta\nu \approx 1.5$` GHz.

1. LED: `$\ell_c = \lambda^2/\Delta\lambda = (520)^2/30$` nm `$= 9.0$` µm, so you see only a few fringes.
2. Laser: `$\ell_c = c/\Delta\nu = 3\times10^8/1.5\times10^9 = 0.20$ m`.
3. A Michelson interferometer with arms differing by a few centimetres therefore works with the laser but not with the LED.

## 2. Thin films

Light reflected from the top and the bottom of a film of thickness `$t$` and index `$n$` has a path difference `$2nt\cos\theta_t$`. Add a half-wavelength for every reflection off a denser medium (a phase jump of `$\pi$`, from the Fresnel equations). For a film in air, only the top reflection gains a jump, so at normal incidence

```math
\text{reflected maxima: } 2nt = \left(m + \tfrac12\right)\lambda, \qquad \text{reflected minima: } 2nt = m\lambda
```

and the transmitted pattern is the complement. If the film is a coating whose index lies between that of the air and that of the glass beneath it (`$n_{\text{air}} < n_f < n_{\text{glass}}$`), both reflections jump, and the two conditions swap.

**Worked example.** A soap film (`$n = 1.33$`) of thickness 300 nm in air at normal incidence. The bright wavelengths are `$\lambda = 2nt/(m + \tfrac12) = 798/(m + \tfrac12)$` nm: 1596 nm (m = 0, infrared), 532 nm (m = 1), 319 nm (m = 2, ultraviolet). So the film looks green in reflection. The dark wavelengths are 798, 399 and 266 nm, so only the edge of violet is removed.

**Newton's rings.** A convex lens of radius of curvature `$R$` rests on a flat plate. At radius `$r$` the air gap is `$t = r^2/2R$`. Reflected light gains a `$\pi$` jump only at the flat plate, so the centre is dark:

```math
\text{dark: } r_m^2 = m\lambda R, \qquad \text{bright: } r_m^2 = \left(m - \tfrac12\right)\lambda R, \qquad D_m^2 = 4m\lambda R
```

The ring radii go as `$\sqrt m$`, so the rings crowd together outwards. Two ring diameters give `$R$` without finding the centre: `$D_{m+p}^2 - D_m^2 = 4p\lambda R$`. Filling the gap with liquid of index `$n$` divides `$D^2$` by `$n$`.

**Worked example.** `$R = 1.00$` m and `$\lambda = 589$ nm`. The 10th dark ring has `$D_{10} = 2\sqrt{10\times589\times10^{-9}\times1.00} = 4.85$ mm`.

## 3. The Michelson and Fabry-Perot interferometers

**Michelson.** A beam splitter sends light down two arms; mirrors return it and the beams recombine. If one mirror moves by `$d$`, the path difference changes by `$2d$` and the fringes move by `$N = 2d/\lambda$`:

```math
d = \frac{N\lambda}{2}
```

Circular fringes of equal inclination satisfy `$2d\cos\theta = m\lambda$`, so for `$d \to 0$` the central order falls and fringes vanish into the centre. The instrument measures lengths to a fraction of a wavelength, wavelengths, and small differences in index (a gas cell in one arm).

**Worked example (fringes).** The mirror is moved until 100 fringes pass at 632.8 nm: `$d = 100\times632.8/2 = 31.64$` µm.

**Worked example (the sodium doublet).** The D lines are at 589.592 nm and 588.995 nm. As `$d$` increases, the fringes of the two lines drift in and out of step, and the visibility cycles. The fringes first vanish when the maxima of one line fall on the minima of the other: `$m\lambda_1 = (m + \tfrac12)\lambda_2$`, i.e. a path difference `$\lambda_1\lambda_2/(2\Delta\lambda) = 0.291$` mm, so the mirror has moved `$0.145$` mm. Measuring those positions gives `$\Delta\lambda$` for the doublet.

**Fabry-Perot.** Two parallel mirrors of reflectance `$R$` a distance `$d$` apart multiply the interference of all the beams that bounce between them. The transmission is the Airy function

```math
T = \frac{1}{1 + F\sin^2(\delta/2)}, \qquad \delta = \frac{4\pi nd\cos\theta}{\lambda}, \qquad F = \frac{4R}{(1 - R)^2}
```

with sharp peaks at `$\delta = 2\pi m$`. Three numbers describe it:

- **Free spectral range** (peak spacing in frequency): `$\Delta\nu_{\text{FSR}} = c/(2nd)$`.
- **Finesse**: `$\mathcal F = \pi\sqrt R/(1 - R)$`, the ratio of the spacing to the width of a peak.
- **Resolving power**: `$\nu/\delta\nu = m\mathcal F$`, with order `$m = 2nd/\lambda$`.

**Worked example.** `$d = 5.0$` mm in air, `$R = 0.95$`, `$\lambda = 532$` nm.

1. FSR `$= 3\times10^8/(2\times0.005) = 30$` GHz.
2. `$\mathcal F = \pi\sqrt{0.95}/0.05 = 61.2$`, so each peak is `$30/61.2 = 0.49$` GHz wide.
3. Order `$m = 2(0.005)/532\times10^{-9} = 18\,800$`, so `$\nu/\delta\nu = 18\,800\times61.2 = 1.15\times10^6$`.

A free spectral range is the largest spread of wavelengths that can be analysed without overlapping orders, so a Fabry-Perot is used with a pre-filter or a grating. Laser cavities are Fabry-Perot resonators ([lesson 6.7](/learn/courses/gate-physics/lasers/)).

## 4. Fresnel and Fraunhofer diffraction

Diffraction is the spreading of a wave past an obstacle or through an opening, found by adding the Huygens wavelets from the open part. Whether the pattern changes shape with distance depends on the **Fresnel number**:

```math
N_F = \frac{a^2}{\lambda L}
```

with `$a$` the size of the opening and `$L$` the screen distance.

- `$N_F \gg 1$`: **Fresnel (near-field)** diffraction. The shadow edges are sharp, with fine fringes whose shape keeps changing with `$L$`. The Fresnel half-period zones explain the on-axis intensity and the bright spot behind a disc.
- `$N_F \ll 1$`: **Fraunhofer (far-field)** diffraction. The pattern keeps its shape and simply grows in proportion to `$L$`; it is the Fourier transform of the aperture. A lens moves the far field to its focal plane.

**Worked example.** A slit of width 0.20 mm (half-width `$a = 0.10$` mm) at 600 nm. The Fraunhofer limit needs `$L \gg a^2/\lambda = (10^{-4})^2/6\times10^{-7} = 17$` mm. At `$L = 2$` m, `$N_F = 0.0083$`, so the far-field formulas are excellent.

## 5. The single slit and the Rayleigh criterion

For a slit of width `$b$` in the Fraunhofer region, with `$\beta = \pi b\sin\theta/\lambda$`,

```math
I(\theta) = I_0\left(\frac{\sin\beta}{\beta}\right)^2, \qquad \text{minima at } b\sin\theta = m\lambda\ (m = \pm1, \pm2, \dots)
```

The central maximum is twice as wide as the others, and the first secondary maximum (at `$\beta \approx 1.43\pi$`) has only 4.7 % of the central intensity.

**Worked example.** `$b = 0.10$ mm`, `$\lambda = 633$ nm`, screen at 2.0 m. The first minima are at `$\sin\theta = 6.33\times10^{-3}$`, so the central maximum has width `$2\lambda D/b = 2(633\times10^{-9})(2.0)/10^{-4} = 25.3$` mm.

**Resolution.** Two point sources form two overlapping diffraction patterns. The **Rayleigh criterion** calls them just resolved when the maximum of one falls on the first minimum of the other:

```math
\theta_{\min} = \frac{\lambda}{b}\ \text{(slit)}, \qquad \theta_{\min} = 1.22\,\frac{\lambda}{D}\ \text{(circular aperture of diameter } D)
```

The 1.22 is the first zero of the Bessel pattern (`$J_1$`) of a circular opening. Larger apertures and shorter wavelengths resolve finer detail.

**Worked example.** A 0.20 m telescope at 550 nm resolves `$1.22(550\times10^{-9})/0.20 = 3.4\ \mu$rad` `$= 0.69$` arcsec. The 3 mm pupil of the eye gives `$224\ \mu$rad` (46 arcsec): this is why binoculars and telescopes separate stars your eye cannot.

## 6. Diffraction gratings

A grating with spacing `$d$` and `$N$` illuminated lines gives sharp principal maxima where all slits are in step, with `$N - 2$` weak secondary maxima between them:

```math
d\sin\theta = m\lambda, \qquad I \propto \left(\frac{\sin\beta}{\beta}\right)^2\left(\frac{\sin N\gamma}{\sin\gamma}\right)^2, \quad \gamma = \frac{\pi d\sin\theta}{\lambda}
```

The slit factor (width `$b$`) shapes the envelope, so an order is missing wherever `$d\sin\theta$` is a multiple of `$\lambda$` and `$b\sin\theta$` a multiple of `$\lambda$` at once (for `$d = 2b$`, every second order). The two figures of merit:

- **Angular dispersion**: `$\dfrac{d\theta}{d\lambda} = \dfrac{m}{d\cos\theta}$`. Larger order and finer spacing spread the colours more.
- **Chromatic resolving power**: `$\dfrac{\lambda}{\Delta\lambda} = mN$`. Only the number of lines used and the order matter, not the spacing.

**Worked example.** A grating has 600 lines/mm, so `$d = 1.667\ \mu$m`, and is used at 589 nm.

1. First-order angle `$\sin\theta = 0.589/1.667 = 0.353$`, so `$\theta = 20.7^\circ$`. The highest order is `$d/\lambda = 2.83$`, so orders up to 2 exist.
2. Dispersion in first order: `$1/(d\cos\theta) = 6.4\times10^5$ rad/m, which is 0.64 mrad per nm.
3. To resolve the sodium doublet (`$\lambda/\Delta\lambda = 589.3/0.597 = 987$`) in first order we need `$N \ge 987$` lines, i.e. a beam 1.65 mm wide on this grating. In second order 494 lines would do.

<div class="myth">

**"Fresnel and Fraunhofer are different physical effects."** They are the same diffraction. Which description is simpler depends only on the Fresnel number, i.e. on how far the screen is compared with `$a^2/\lambda$`.

**"A grating with a finer spacing has a higher resolving power."** The resolving power is `$mN$`. A finer spacing spreads the lines apart (more dispersion) but does not by itself sharpen them; more lines illuminated does.

**"Thin-film fringes need a very coherent source."** The film is so thin that the two paths differ by only a few wavelengths, well within the coherence length of white light, which is why soap bubbles show colours in sunlight.

</div>

<div class="keypoints">

- Visibility `$V = (I_{\max} - I_{\min})/(I_{\max} + I_{\min})$`. Coherence length `$\ell_c \approx \lambda^2/\Delta\lambda = c/\Delta\nu$`.
- Thin film in air at normal incidence: reflected maxima at `$2nt = (m + \tfrac12)\lambda$`, minima at `$2nt = m\lambda$`.
- Newton's rings (reflection): centre dark; `$D_m^2 = 4m\lambda R$`; `$D_{m+p}^2 - D_m^2 = 4p\lambda R$`.
- Michelson: `$d = N\lambda/2$`; doublet fringes vanish at `$d = \lambda_1\lambda_2/(4\Delta\lambda)$`.
- Fabry-Perot: `$F = 4R/(1 - R)^2$`, `$\mathcal F = \pi\sqrt R/(1 - R)$`, FSR `$= c/2nd$`, resolving power `$m\mathcal F$`.
- Fresnel number `$a^2/\lambda L$`: much larger than 1 is near field, much smaller than 1 is far field.
- Single slit: minima at `$b\sin\theta = m\lambda$`; first secondary maximum 4.7 %.
- Rayleigh: `$\lambda/b$` for a slit, `$1.22\lambda/D$` for a circular aperture.
- Grating: `$d\sin\theta = m\lambda$`; dispersion `$m/(d\cos\theta)$`; resolving power `$mN$`.

</div>

## Practise: exam questions on this lesson

From definitions up to GATE top-rank level, with full solutions. More on the [interference practice page](/learn/courses/gate-physics/practice/interference/) and the [diffraction practice page](/learn/courses/gate-physics/practice/diffraction/).

<div class="qbank" data-bank="physics" data-topics="interference,diffraction" data-exam="gate" data-n="10"></div>

**Before this:** [lesson 3.7, the Fresnel equations](/learn/courses/gate-physics/fresnel-equations/), where the reflection phase jumps come from. **Next:** [lesson 3.12](/learn/courses/gate-physics/polarisation-ray-optics/) covers polarisation, wave plates, Jones calculus and ray matrices. Back to the [GATE Physics course](/learn/courses/gate-physics/).

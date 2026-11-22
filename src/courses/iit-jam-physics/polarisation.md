---
title: 'Polarisation: Malus, Brewster and wave plates'
seoTitle: Polarisation, Malus and Brewster for IIT JAM Physics
summary: 'What polarised light is, polarisers and Malus''s law (including the surprise of the third polariser), polarisation by reflection and Brewster''s angle, scattering, double refraction, quarter- and half-wave plates, circular and elliptical light, optical activity, and Jones vectors for GATE and NET.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: 'Unpolarised light passes two crossed polarisers. A third is slipped between them at 45°. What fraction of the original intensity now gets through?'
    choices: ['1/8', 'Zero', '1/4', '1/2']
    ans: 0
    why: 'Half passes the first; the middle one passes cos²45° = 1/2 of that; the last passes another 1/2: 1/2 × 1/2 × 1/2 = 1/8.'
  - q: 'Light reflects from glass (n = 1.5) at the Brewster angle. Which is true?'
    choices: ['The reflected light is completely polarised perpendicular to the plane of incidence', 'The transmitted light is completely polarised', 'No light is reflected', 'The reflected light is circularly polarised']
    ans: 0
    why: 'At tan θ = n the p component does not reflect at all, so the reflected beam is pure s. Most of the light (including some s) is transmitted, which is only partly polarised.'
  - q: 'Linear light at 45° to the axes of a quarter-wave plate comes out as'
    choices: ['circularly polarised light', 'linear light turned by 90°', 'unpolarised light', 'linear light, unchanged']
    ans: 0
    why: 'The two equal components come out a quarter cycle apart, which is circular light. Turning linear light by 90° needs a half-wave plate.'
sources:
  - 'E. Hecht, Optics, 5th ed. (2017), chapter 8: polarization'
  - 'F. A. Jenkins and H. E. White, Fundamentals of Optics, 4th ed. (1976), chapters 24 to 28'
  - 'A. Ghatak, Optics, 7th ed. (2020), chapter 22'
  - 'IIT JAM Physics syllabus (Oscillations, Waves and Optics section), published by the organising IIT each year'
---

**Module 3 · about 45 minutes.** By the end you will be able to follow light through any chain of polarisers, find Brewster's angle and the Fresnel reflectances, explain double refraction, choose and size wave plates to turn linear light into circular light or rotate it, identify unknown polarisation states, and use Jones vectors.

<div class="bigidea">Light is a transverse wave: its electric field points across the direction of travel, and how that direction behaves (fixed, turning, or random) is its polarisation. Polarisers select one direction, reflection and scattering prefer one, and crystals that slow one direction more than another can turn a line into a circle.</div>

## 1. States of polarisation

Write the field of a wave going along `$z$` as two perpendicular components:

```math
E_x = E_{0x}\cos(kz - \omega t), \qquad E_y = E_{0y}\cos(kz - \omega t + \delta)
```

At a fixed point the tip of the field traces a Lissajous figure of equal frequencies ([lesson 3.3](/learn/courses/iit-jam-physics/superposition-coupled/)):

- `$\delta = 0$` or `$\pi$`: a line: **linearly polarised** light;
- `$\delta = \pm\pi/2$` with `$E_{0x} = E_{0y}$`: a circle: **circularly polarised**;
- anything else: an ellipse: **elliptically polarised**. With `$\delta = \pi/2$` and unequal amplitudes the ellipse has its axes along `$x$` and `$y$`.

**Unpolarised** light (sunlight, a bulb) changes its state randomly billions of times a second. Only transverse waves can be polarised, which is why polarisation, not interference, proved that light is transverse.

## 2. Polarisers and Malus's law

An ideal polariser passes the field component along its transmission axis. For linear light at angle `$\theta$` to the axis, the field passed is `$E\cos\theta$`, so

```math
I = I_0\cos^2\theta \quad\text{(Malus)}, \qquad I = \tfrac12I_0 \ \text{for unpolarised light}
```

<div class="meaning">

<dl>
<dt>I₀</dt><dd>intensity arriving at the polariser</dd>
<dt>θ</dt><dd>angle between the light's plane of polarisation and the polariser's axis</dd>
<dt>cos²θ</dt><dd>the field goes as cos θ and intensity as field squared</dd>
<dt>½ for unpolarised light</dt><dd>the average of cos²θ over all directions</dd>
<dt>Physical meaning</dt><dd>A polariser does not just block or pass: it projects the field onto its axis, and the light that leaves is always polarised along that axis, whatever came in.</dd>
</dl>

</div>

**Worked example.** Crossed polarisers pass nothing. Slip a third between them at `$45^\circ$`: unpolarised `$I_0 \to I_0/2 \to I_0/4 \to I_0/8$`. Adding a polariser let light through, because each one re-polarises the light along its own axis. At a general angle `$\theta$` the result is `$\tfrac18I_0\sin^22\theta$`. With many polarisers in small steps, `$\cos^{2N}(\pi/2N) \to 1$`: the light can be turned through `$90^\circ$` with almost no loss, which is how a twisted liquid-crystal display works.

<figure class="fig" data-fig="polarisers"><figcaption>"Polarisers": move the middle and last polarisers and watch the intensity after each; take the middle one out to see crossed polarisers block everything. "Wave plate": choose a quarter- or half-wave plate and the angle of the incoming light, and watch the path of the field tip.</figcaption></figure>

<div class="problem" data-problem="malus-chain"></div>

**Partial polarisation.** A mix of polarised and unpolarised light gives a rotating analyser a maximum and a minimum. The degree of polarisation is `$P = (I_{\max} - I_{\min})/(I_{\max} + I_{\min})$`; a ratio of 3 : 1 means `$P = 1/2$`.

## 3. Polarisation by reflection: Brewster's angle

Light reflecting from glass or water is partly polarised. The component vibrating in the plane of incidence (`$p$`) reflects less than the one perpendicular to it (`$s$`), and at one angle not at all:

```math
\tan\theta_B = \frac{n_2}{n_1}, \qquad \theta_B + \theta_t = 90^\circ
```

At `$\theta_B$` the reflected and refracted rays are at right angles. The refracted ray drives electrons in the glass to oscillate across it; for the `$p$` component that oscillation points along the reflected direction, and an oscillating dipole sends nothing along its own axis. So the reflected light is **completely `$s$`-polarised**. Glass: `$56.3^\circ$`; water: `$53.1^\circ$`; from water onto glass: `$\tan^{-1}(1.5/1.333) = 48.4^\circ$`.

**Worked example.** For `$n = \sqrt3$`, `$\theta_B = 60^\circ$` and the refracted ray is at `$30^\circ$`. Reflected glare from a road is mostly horizontally polarised, so polaroid sunglasses have vertical axes.

<div class="problem" data-problem="brewster-angle"></div>

**Fresnel's formulas** give the amounts. At normal incidence `$R = [(n - 1)/(n + 1)]^2 = 4\%$` for glass. As the angle grows, `$R_s$` rises steadily to 100%, while `$R_p$` falls to zero at `$\theta_B$` (its amplitude changes sign there) and then rises. At Brewster's angle on glass, `$R_s = [(n^2 - 1)/(n^2 + 1)]^2 = 0.148$`, so a stack of plates at that angle (a pile-of-plates polariser) gradually strips the `$s$` light from the transmitted beam. The [Polarisation calculator](/science/polarisation-calculator/) gives the full curves.

**Scattering.** Air molecules scatter sunlight like tiny dipoles. Seen at `$90^\circ$` from the Sun, sky light is strongly polarised (bees navigate by it), and blue scatters most, which is why the sky is blue ([Sky colour](/learn/sky-colour/)).

## 4. Double refraction

In crystals such as calcite and quartz, light polarised in different directions travels at different speeds. In a **uniaxial** crystal there is one special direction, the **optic axis**:

- the **ordinary ray** (o) has index `$n_o$` in every direction and obeys Snell's law;
- the **extraordinary ray** (e) has an index between `$n_o$` and `$n_e$`, depending on its angle to the optic axis;
- the two are polarised at right angles; along the optic axis they do not separate.

Calcite (`$n_o = 1.658$`, `$n_e = 1.486$`) separates them so strongly that a dot seen through it looks double. A Nicol prism removes one ray by total internal reflection to make a polariser.

## 5. Wave plates

Cut a crystal with its optic axis in the face. Light going straight through is split into components along the **fast** and **slow** axes, which travel together but at different speeds. A plate of thickness `$d$` puts them out of step by

```math
\delta = \frac{2\pi}{\lambda}\,|n_e - n_o|\,d
```

| Plate | Retardation | Linear light at 45° | Linear light at θ | Circular light |
|---|---|---|---|---|
| quarter-wave | `$\lambda/4$` | circular | elliptical (axes along the plate's) | linear |
| half-wave | `$\lambda/2$` | linear, turned by 90° | linear, turned by `$2\theta$` | circular, other hand |

Light along either axis passes any plate unchanged.

**Worked example.** Quartz with `$|n_e - n_o| = 0.009$` at 589 nm: the thinnest quarter-wave plate is `$d = \lambda/(4\times0.009) = 16.4\ \mu$`m, and a half-wave plate twice that. Linear light at `$30^\circ$` to its axis comes out as an ellipse with axis ratio `$\tan30^\circ = 0.577$`.

<div class="steps">
<div class="step"><p><b>Split.</b> Linear light at 45° to the axes of a quarter-wave plate has equal components along the fast and slow axes, in step.</p></div>
<div class="step"><p><b>Delay.</b> Inside the plate the slow component falls a quarter cycle behind.</p></div>
<div class="step"><p><b>Recombine.</b> Equal components a quarter cycle apart: when one is at its peak the other is zero. The tip of the field goes round a circle.</p></div>
<div class="step"><p><b>Run it backwards.</b> Circular light into a quarter-wave plate comes out linear at 45°. That is how you tell circular light from unpolarised light: put a quarter-wave plate before the analyser; circular light can then be blocked completely.</p></div>
</div>

**Identifying light.** Rotate an analyser. Goes to zero: linear. Changes but never zero: elliptical or partly polarised. Constant: circular or unpolarised; add a quarter-wave plate first to decide.

**Optical isolator.** Polariser, then a quarter-wave plate at `$45^\circ$`, then a mirror: the light passes the plate twice, which acts as a half-wave plate and turns the polarisation by `$90^\circ$`, so the polariser blocks the return beam. A Fresnel rhomb does the job of a quarter-wave plate using two total internal reflections, each adding a `$45^\circ$` phase difference between `$s$` and `$p$`.

<div class="myth">

**"A polariser just blocks light, so adding one can never let more through."** Two crossed polarisers pass nothing, yet a third one between them at `$45^\circ$` lets one eighth through. A polariser is not a sieve with fixed holes; it projects the field onto its axis and sends out light polarised along that axis. The middle polariser turns the light halfway, so the last one has something to pass. The same idea, done in many tiny steps, turns polarisation through `$90^\circ$` with almost no loss.

</div>

## 6. Optical activity

Some materials (quartz along its axis, sugar solutions) rotate the plane of linear light as it travels: `$\theta = [\alpha]\,l\,c$`, with `$l$` in decimetres and `$c$` in g/cm³ for solutions. A 20 cm tube of 0.10 g/cm³ sugar turning the light by `$13.3^\circ$` has `$[\alpha] = 66.5$`. Quartz turns 589 nm light by `$21.7^\circ$` per mm. Natural rotation follows the handedness of the molecules, so a trip there and back cancels; **Faraday rotation** in a magnetic field follows the field, so a return trip doubles it (the basis of optical isolators for lasers).

## 7. Jones vectors (GATE and NET)

Write fully polarised light as a vector of complex amplitudes `$(E_x, E_y)$`: horizontal `$(1, 0)$`, `$45^\circ$` linear `$\tfrac1{\sqrt2}(1, 1)$`, circular `$\tfrac1{\sqrt2}(1, \pm i)$`. Elements are `$2\times2$` matrices: a horizontal polariser `$\begin{pmatrix}1&0\\0&0\end{pmatrix}$`, a quarter-wave plate with fast axis horizontal `$\begin{pmatrix}1&0\\0&i\end{pmatrix}$`, a half-wave plate at `$45^\circ$` `$\begin{pmatrix}0&1\\1&0\end{pmatrix}$` (up to a phase). Multiply right to left and square the magnitudes for intensity. **Stokes parameters** `$(S_0, S_1, S_2, S_3)$` also describe partly polarised light: `$S_1 = S_2 = S_3 = 0$` for unpolarised light and `$S_0^2 = S_1^2 + S_2^2 + S_3^2$` for fully polarised light.

<div class="keypoints">

- Polarisation is the behaviour of the field direction: linear, circular, elliptical or random. Only transverse waves have it.
- Malus `$I = I_0\cos^2\theta$`; unpolarised `$\to I_0/2$`; crossed with a middle one at `$\theta$`: `$\tfrac18I_0\sin^22\theta$`.
- Brewster `$\tan\theta_B = n_2/n_1$`; reflected light pure `$s$`; reflected and refracted rays perpendicular. Normal-incidence reflectance `$[(n - 1)/(n + 1)]^2$`.
- Uniaxial crystals: o-ray (fixed `$n_o$`) and e-ray (direction-dependent), polarised at right angles.
- Quarter-wave `$d = \lambda/4|\Delta n|$`: 45° linear `$\leftrightarrow$` circular. Half-wave: rotates linear light by `$2\theta$`.
- Optical activity `$\theta = [\alpha]lc$` cancels on return; Faraday rotation doubles.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. More on the [polarisation practice page](/learn/courses/iit-jam-physics/practice/polarisation/).

<div class="qbank" data-bank="physics" data-topics="polarisation" data-exam="jam" data-n="10"></div>

**Next:** polarisation closes the optics part of Module 3. Look back at [interference](/learn/courses/iit-jam-physics/interference/) (thin films use the same reflection phases) and [diffraction](/learn/courses/iit-jam-physics/diffraction/), and at [superposition](/learn/courses/iit-jam-physics/superposition-coupled/) for the Lissajous figures that polarisation states really are. Electromagnetic waves themselves are treated in [Module 4](/learn/courses/iit-jam-physics/maxwell-em-waves/), which begins with [electric fields and Gauss's law](/learn/courses/iit-jam-physics/electrostatics-gauss/).

**Go deeper:** GATE Physics derives Brewster's angle and the polarisation of reflected light from Maxwell's equations in [the Fresnel equations](/learn/courses/gate-physics/fresnel-equations/).

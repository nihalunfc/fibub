---
title: Reflection, refraction and the Fresnel equations
seoTitle: Fresnel equations, Brewster angle and TIR | GATE Physics
summary: 'Boundary conditions and the laws of reflection and refraction, the Fresnel amplitude coefficients for s and p polarisation, reflectance and transmittance with the beam-area factor, the Brewster angle, total internal reflection with its phase shifts and evanescent wave, metals with a complex index, magnetic media and impedance matching, Stokes relations and antireflection coatings.'
minutes: 60
updated: 2026-11-22
quiz:
  - q: Unpolarised light falls on glass at the Brewster angle. What is reflected?
    choices: ['Only the s component (E perpendicular to the plane of incidence)', 'Only the p component (E in the plane of incidence)', 'Nothing at all', 'Both components equally']
    ans: 0
    why: "At the Brewster angle r_p = 0, so only s light is reflected. The transmitted beam keeps all the p light and most of the s light, so it is only partly polarised."
  - q: "Glass to air: which angle is larger, the critical angle or the internal Brewster angle?"
    choices: ['The critical angle', 'The Brewster angle', 'They are equal', 'It depends on the index']
    ans: 0
    why: "tan θB = n₂/n₁ = sin θc, and tan x > sin x, so θB < θc for every pair of indices. Glass (n = 1.5): 33.7° against 41.8°."
  - q: Beyond the critical angle, does any light energy cross into the rarer medium?
    choices: ['On average no: an evanescent field exists but carries no net power across', 'Yes, a fraction equal to R_p', 'Yes, all of the s light', 'No, and there is no field at all on the other side']
    ans: 0
    why: "The field on the far side decays exponentially and runs along the surface. Its Poynting vector normal to the surface averages to zero, unless a second surface comes within a few wavelengths (frustrated TIR)."
sources:
  - 'E. Hecht, Optics, 5th ed. (2017), chapter 4'
  - 'M. Born and E. Wolf, Principles of Optics, 7th ed. (1999), chapter 1.5'
  - 'D. J. Griffiths, Introduction to Electrodynamics, 4th ed. (2017), chapter 9.3'
  - 'J. D. Jackson, Classical Electrodynamics, 3rd ed. (1999), chapter 7.3 and 7.4'
  - 'GATE Physics (PH) syllabus, Electromagnetic Theory section, published by the organising institute each year'
---

**Module 3 · about 60 minutes.** By the end you will be able to derive and use the Fresnel equations for both polarisations, compute reflectance and transmittance at any angle (checking that they add to 1), find Brewster and critical angles and the phase shifts of total internal reflection, estimate evanescent penetration depths, handle metals and magnetic media, and design a single-layer antireflection coating. Normal-incidence reflection and the Brewster angle at JAM level are in [Maxwell's equations and electromagnetic waves](/learn/courses/iit-jam-physics/maxwell-em-waves/) and [polarisation](/learn/courses/iit-jam-physics/polarisation/); the media themselves are in [lesson 3.6](/learn/courses/gate-physics/em-waves-media/).

<div class="bigidea">At a boundary the fields must join smoothly. Matching the phases everywhere along the surface gives the directions (Snell's law); matching the tangential fields gives the amplitudes (Fresnel). Everything else, Brewster, total internal reflection, coatings, follows from those two steps.</div>

## 1. What the boundary demands

Let a plane wave in index `$n_1$` hit the plane `$z = 0$` at angle `$\theta_i$`, making reflected and transmitted waves. For linear, non-magnetic media with no surface charge or current, the tangential components of `$\vec E$` and `$\vec H$` are continuous.

**Kinematics.** Every wave carries a factor `$e^{i(\vec k\cdot\vec r - \omega t)}$`. For the conditions to hold at every point of the surface and at every time, all three waves must share `$\omega$` and the tangential component of `$\vec k$`:

```math
k_1\sin\theta_i = k_1\sin\theta_r = k_2\sin\theta_t \;\Rightarrow\; \theta_r = \theta_i, \quad n_1\sin\theta_i = n_2\sin\theta_t
```

This is pure phase matching, valid for any wave. **Dynamics** (the field conditions) then fixes the amplitudes, separately for the two polarisations:

- **s** (TE, `$\vec E$` perpendicular to the plane of incidence): `$E_i + E_r = E_t$` and `$n_1\cos\theta_i(E_i - E_r) = n_2\cos\theta_tE_t$`.
- **p** (TM, `$\vec E$` in the plane of incidence): the same with the roles of the cosines crossed.

## 2. The Fresnel equations

```math
r_s = \frac{n_1\cos\theta_i - n_2\cos\theta_t}{n_1\cos\theta_i + n_2\cos\theta_t}, \qquad t_s = \frac{2n_1\cos\theta_i}{n_1\cos\theta_i + n_2\cos\theta_t}
```

```math
r_p = \frac{n_2\cos\theta_i - n_1\cos\theta_t}{n_2\cos\theta_i + n_1\cos\theta_t}, \qquad t_p = \frac{2n_1\cos\theta_i}{n_2\cos\theta_i + n_1\cos\theta_t}
```

The sign of `$r_p$` depends on how a book orients the reflected p field; magnitudes and reflectances do not. Using Snell's law, they take compact forms worth remembering:

```math
r_s = -\frac{\sin(\theta_i - \theta_t)}{\sin(\theta_i + \theta_t)}, \qquad |r_p| = \left|\frac{\tan(\theta_i - \theta_t)}{\tan(\theta_i + \theta_t)}\right|
```

**Energy.** Reflectance is `$R = |r|^2$`, but transmittance carries two extra factors: the intensity in a medium is `$\frac12n\epsilon_0c|E|^2$`, and the transmitted beam crosses the interface with a different cross-section (`$\cos\theta_t/\cos\theta_i$`):

```math
T = \frac{n_2\cos\theta_t}{n_1\cos\theta_i}|t|^2, \qquad R + T = 1
```

So `$|t| > 1$` is allowed (glass to air at normal incidence, `$t = 1.2$`, yet `$T = 0.96$`).

**Worked example.** Air to glass (`$n = 1.5$`) at `$60^\circ$`: `$\sin\theta_t = 0.577$`, `$\cos\theta_t = 0.816$`. Then `$r_s = (0.5 - 1.225)/(0.5 + 1.225) = -0.420$`, `$R_s = 0.177$`; `$r_p = (0.75 - 0.816)/(0.75 + 0.816) = -0.042$`, `$R_p = 0.0018$`. We are close to Brewster (`$56.3^\circ$`), so p light is barely reflected.

<figure class="fig" data-fig="fresnel-curves"><figcaption>R_s and R_p (or r_s and r_p) against the angle of incidence. Choose n₁ > n₂ to see the critical angle and total internal reflection; the readout then gives the s-p phase difference.</figcaption></figure>

<div class="meaning">

<dl>
<dt>r, t</dt><dd>amplitude ratios of reflected and transmitted to incident tangential fields</dd>
<dt>R = |r|², T = (n₂cosθₜ/n₁cosθᵢ)|t|²</dt><dd>fractions of power; they add to 1</dd>
<dt>θB: tan θB = n₂/n₁</dt><dd>Brewster angle: r_p = 0, reflected and refracted rays perpendicular</dd>
<dt>θc: sin θc = n₂/n₁</dt><dd>critical angle (only for n₁ > n₂): beyond it both polarisations are totally reflected</dd>
<dt>Physical meaning</dt><dd>The reflected wave is radiated by dipoles induced in the second medium. They oscillate along the transmitted E; when the reflected direction lies along that axis (p light at Brewster), they cannot radiate that way, and nothing is reflected.</dd>
</dl>

</div>

## 3. Brewster angle and polarisation by reflection

`$r_p = 0$` when `$\theta_i + \theta_t = 90^\circ$`, i.e. `$\tan\theta_B = n_2/n_1$`. Only s light is reflected: glare from a lake (`$n = 1.33$`, `$\theta_B = 53^\circ$`) is mostly horizontally polarised, which polarising sunglasses block. `$r_s$` never vanishes between non-magnetic media.

Useful consequences:

- External and internal Brewster angles are complementary (`$56.3^\circ$` and `$33.7^\circ$` for glass): the refraction angle at one is the Brewster angle of the other. So a tilted plate at Brewster passes p light through **both** faces without loss. Laser **Brewster windows** use this; the s loss (about 15% per face for `$n = 1.5$`) stops s from lasing.
- At Brewster, `$\theta_t = 90^\circ - \theta_B$` turns `$r_s$` into `$\cos2\theta_B$`, so `$|r_s| = \dfrac{n^2 - 1}{n^2 + 1}$` (from air, `$n = n_2$`): 0.385 for glass, 0.486 for `$n = 1.7$`.
- Away from Brewster the reflected light is partly polarised: `$P = \frac{R_s - R_p}{R_s + R_p}$` (0.75 for glass at `$70^\circ$`).
- A **pile of plates** at Brewster strips more s light from the transmitted beam at each surface.

**If the media are magnetic**, use impedances. At normal incidence `$r = \frac{\eta_2 - \eta_1}{\eta_2 + \eta_1}$` with `$\eta = \eta_0\sqrt{\mu_r/\epsilon_r}$`; a material with `$\mu_r = \epsilon_r$` reflects nothing although its index is not 1. For equal `$\epsilon$` and different `$\mu$`, the duality `$\epsilon \leftrightarrow \mu$` swaps s and p, and it is **s** that has a Brewster angle.

<div class="problem" data-problem="frs-reflect"></div>

## 4. Total internal reflection

For `$n_1 > n_2$` and `$\sin\theta_i > n_2/n_1$`, Snell gives `$\sin\theta_t > 1$` and `$\cos\theta_t = i\sqrt{\sin^2\theta_t - 1}$`. Both `$r_s$` and `$r_p$` become of the form `$(a - ib)/(a + ib)$`: magnitude exactly 1, with phases

```math
\tan\frac{\phi_s}{2} = \frac{\sqrt{\sin^2\theta - n^2}}{\cos\theta}, \qquad \tan\frac{\phi_p}{2} = \frac{\sqrt{\sin^2\theta - n^2}}{n^2\cos\theta}, \qquad n = \frac{n_2}{n_1}
```

The phase **difference** `$\Delta = \phi_p - \phi_s$` satisfies

```math
\tan\frac{\Delta}{2} = \frac{\cos\theta\sqrt{\sin^2\theta - n^2}}{\sin^2\theta}
```

It is zero at the critical angle and at grazing incidence, with a maximum `$\tan(\Delta_{\max}/2) = \frac{1 - n^2}{2n}$`: `$45.2^\circ$` for glass of index 1.5. One reflection cannot make a quarter-wave (`$90^\circ$`) shift, so Fresnel's **rhomb** uses two reflections of `$45^\circ$` each (at `$54.6^\circ$` for `$n = 1.51$`) to turn `$45^\circ$` linear light into circular light, almost independently of wavelength.

**The evanescent wave.** The transmitted field keeps `$k_x = n_1k_0\sin\theta$` along the surface and decays as `$e^{-\kappa z}$` with

```math
\kappa = k_0\sqrt{n_1^2\sin^2\theta - n_2^2}
```

**Worked example.** Glass to air at `$45^\circ$`, 633 nm: `$1/\kappa = \frac{633}{2\pi\sqrt{1.125 - 1}} = 285$` nm. The depth grows without bound as `$\theta \to \theta_c$` (2.2 μm in a fibre at `$85^\circ$` with core 1.47 and cladding 1.46). The evanescent wave is not transverse (p light has a field component along `$k_x$`), carries energy along the surface but none across it on average, and couples light into a second surface brought within about `$1/\kappa$`: **frustrated TIR**, the optical twin of quantum tunnelling, used in beam splitters and fingerprint sensors.

<div class="myth">

**"Past the critical angle there is no light in the second medium."** There is a field there: the evanescent wave, decaying over a fraction of a wavelength. Without it the boundary conditions could not be met. What vanishes is the average energy flow across the boundary. Bring a second prism close and light tunnels through, with transmission falling roughly as `$e^{-2\kappa d}$` with the gap `$d$`.

</div>

## 5. Metals, Stokes relations and coatings

**Metals.** With complex index `$\tilde n = n + i\kappa$`, normal incidence gives

```math
R = \frac{(n - 1)^2 + \kappa^2}{(n + 1)^2 + \kappa^2}
```

Silver at 600 nm (`$\tilde n \approx 0.06 + 4.0i$`) reflects 98.6%. For a good conductor at radio frequencies this becomes `$1 - R \approx 4R_s/\eta_0$` ([lesson 3.6](/learn/courses/gate-physics/em-waves-media/)).

**Stokes relations.** Time-reversing a lossless reflection and transmission must rebuild the incident wave alone:

```math
r' = -r, \qquad tt' = 1 - r^2
```

(primes: light from the other side). So the internal and external reflectances are equal at normal incidence, and a thin film's two reflections differ by a sign when its index lies between those of its neighbours or not.

**Antireflection coatings.** A layer of index `$n_c$` and optical thickness `$\lambda/4$` on glass `$n_g$` makes the glass look like index `$n_c^2/n_g$`:

```math
R = \left(\frac{n_0n_g - n_c^2}{n_0n_g + n_c^2}\right)^2
```

zero when `$n_c = \sqrt{n_0n_g}$`. **Worked example.** MgF₂ (`$n_c = 1.38$`) on glass (1.52): `$R = (1.52 - 1.904)^2/(1.52 + 1.904)^2 = 1.26\%$` at the design wavelength (against 4.3% bare), rising to about 1.6% at 450 nm, which gives coated lenses their purple tint. The quarter-wave layer is exactly the quarter-wave transformer of transmission lines ([lesson 3.8](/learn/courses/gate-physics/waveguides/)).

<div class="keypoints">

- Phase matching: same `$\omega$` and tangential `$k$`, so `$\theta_r = \theta_i$` and `$n_1\sin\theta_i = n_2\sin\theta_t$`. Field matching gives the Fresnel equations.
- `$r_s = \frac{n_1\cos\theta_i - n_2\cos\theta_t}{n_1\cos\theta_i + n_2\cos\theta_t}$`, `$r_p$` with the cosines crossed; `$r_s = -\frac{\sin(\theta_i - \theta_t)}{\sin(\theta_i + \theta_t)}$`, `$|r_p| = \left|\frac{\tan(\theta_i - \theta_t)}{\tan(\theta_i + \theta_t)}\right|$`.
- `$R = |r|^2$`, `$T = \frac{n_2\cos\theta_t}{n_1\cos\theta_i}|t|^2$`, `$R + T = 1$`; `$|t|$` may exceed 1.
- Brewster: `$\tan\theta_B = n_2/n_1$`, `$\theta_i + \theta_t = 90^\circ$`, only s reflected; `$|r_s| = \frac{n^2 - 1}{n^2 + 1}$` there; internal and external Brewster angles add to `$90^\circ$`; `$\theta_B < \theta_c$`.
- Magnetic media: `$r = \frac{\eta_2 - \eta_1}{\eta_2 + \eta_1}$`; `$\mu_r = \epsilon_r$` means no reflection.
- TIR: `$|r| = 1$`, phase difference `$\tan\frac\Delta2 = \frac{\cos\theta\sqrt{\sin^2\theta - n^2}}{\sin^2\theta}$`, maximum `$\tan\frac{\Delta_{\max}}{2} = \frac{1 - n^2}{2n}$`; evanescent depth `$1/\kappa = \frac{\lambda_0}{2\pi\sqrt{n_1^2\sin^2\theta - n_2^2}}$`.
- Metals: `$R = \frac{(n - 1)^2 + \kappa^2}{(n + 1)^2 + \kappa^2}$`. Stokes: `$r' = -r$`, `$tt' = 1 - r^2$`. Quarter-wave coating: `$n_c = \sqrt{n_0n_g}$`, `$d = \lambda/4n_c$`.

</div>

## Practise: exam questions on this lesson

From warm-up to top-rank level, with full solutions. More on the [practice page](/learn/courses/gate-physics/practice/fresnel-equations/).

<div class="qbank" data-bank="physics" data-topics="fresnel-equations" data-exam="gate" data-n="10"></div>

**Before this:** [lesson 3.6, waves in matter](/learn/courses/gate-physics/em-waves-media/), and the JAM lesson on [polarisation](/learn/courses/iit-jam-physics/polarisation/). **Next:** [lesson 3.8, waveguides](/learn/courses/gate-physics/waveguides/), where repeated reflection between walls guides a wave. Back to the [GATE Physics course home](/learn/courses/gate-physics/).

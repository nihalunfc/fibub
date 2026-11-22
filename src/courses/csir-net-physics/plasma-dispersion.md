---
title: Plasma oscillations and dispersion
summary: 'Plasmas for CSIR NET: the plasma frequency, cutoff and evanescence, phase and group velocity, Debye screening and the plasma parameter, Bohm-Gross and ion-acoustic waves, the ionosphere and metals, cyclotron and upper-hybrid frequencies, Faraday rotation, whistlers and pulsar dispersion.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: A radio wave meets a plasma whose plasma frequency is higher than the wave frequency. What happens?
    choices: ['It travels on with phase velocity below c', 'It is absorbed by collisions only', 'It decays exponentially and is reflected', 'It is converted into a plasma wave']
    ans: 2
    why: "Below ω_p, k² = (ω² − ω_p²)/c² is negative, so k is imaginary and the field decays as exp(−x/δ) with δ = c/√(ω_p² − ω²). No energy is carried in; a collisionless plasma reflects the wave."
  - q: In an unmagnetised plasma, what is the product of phase and group velocities of an electromagnetic wave?
    choices: ['c²', 'ω_p²/k²', 'Zero', 'c²(1 − ω_p²/ω²)']
    ans: 0
    why: "From ω² = ω_p² + c²k², v_p = ω/k and v_g = dω/dk = c²k/ω, so v_p v_g = c². The phase velocity exceeds c but the group velocity, which carries signals, stays below it."
  - q: Two pulses from a pulsar, at 400 MHz and 800 MHz, arrive at Earth. Which arrives first and why?
    choices: ['400 MHz, because low frequencies travel faster in plasma', '800 MHz, because the group delay goes as 1/f²', 'Both together, because space is a vacuum', '800 MHz, because the phase velocity is larger']
    ans: 1
    why: "Interstellar electrons give a group delay Δt ≈ (e²/8π²ε₀mc) DM/f², so the higher frequency arrives first. The 400 MHz pulse is late by 3/4 of its own delay relative to infinite frequency."
sources:
  - 'F. F. Chen, Introduction to Plasma Physics and Controlled Fusion, 3rd ed. (2016), chapters 1 and 4'
  - 'D. J. Griffiths, Introduction to Electrodynamics, 4th ed. (2017), section 9.4'
  - 'J. D. Jackson, Classical Electrodynamics, 3rd ed. (1999), sections 7.5 and 7.6'
  - 'D. R. Lorimer and M. Kramer, Handbook of Pulsar Astronomy (2005), chapter 4 (dispersion measure)'
  - 'CSIR-UGC NET Physical Sciences syllabus, Electromagnetic Theory unit, published by the National Testing Agency'
---

**Module 4 · about 45 minutes.** A plasma is a gas of free charges, and its electrons respond to an electric field as one body. That collective response gives a natural frequency, makes the gas opaque below it and dispersive above it, and screens any charge inside it. CSIR NET asks for the plasma frequency, the cutoff, group delays and Debye lengths with numbers, so this lesson works them all through. Waves in ordinary dielectrics and conductors are in [Maxwell's equations and waves](/learn/courses/iit-jam-physics/maxwell-em-waves/) and [fields in matter](/learn/courses/gate-physics/fields-in-matter/).

<div class="bigidea">Free electrons have no restoring spring of their own, but displace them and the charge left behind pulls them back. They oscillate at ω_p = √(ne²/ε₀m). Light below ω_p cannot get in; light above it gets through with ω² = ω_p² + c²k², slower in group and faster in phase than c. Every plasma result in this lesson follows from that one frequency, plus a pressure term or a magnetic field when they matter.</div>

## 1. The plasma frequency

Shift a slab of electrons (density `$n$`) by `$x$` relative to the ions. Surface charges `$\pm nex$` appear and the field between them is `$E = nex/\epsilon_0$`. Each electron then feels `$m\ddot x = -ne^2x/\epsilon_0$`, simple harmonic motion at

```math
\omega_p = \sqrt{\frac{ne^2}{\epsilon_0m}}, \qquad f_p = \frac{\omega_p}{2\pi} \approx 8.98\sqrt{n\,[\text{m}^{-3}]}\ \text{Hz}
```

The frequency depends only on the density: no wavelength appears, so in a cold plasma these oscillations do not propagate (group velocity zero). Ions are 1836 or more times heavier and barely move at `$\omega_p$`; their own plasma frequency is `$\sqrt{m/M}$` times smaller.

| Plasma | `$n$` (m⁻³) | `$f_p$` |
|---|---|---|
| solar wind near Earth | `$5\times10^6$` | 20 kHz |
| ionosphere F layer, by day | `$10^{12}$` | 9 MHz |
| tokamak core | `$10^{20}$` | 90 GHz |
| sodium metal (conduction electrons) | `$2.65\times10^{28}$` | `$1.5\times10^{15}$` Hz (`$\hbar\omega_p \approx 6$` eV) |

Slide the electron density and the frequency of a test wave. Check whether it is reflected or transmitted.

<figure class="fig" data-fig="@em-plasma-slab"><figcaption>The slab oscillates at ω_p = √(ne²/ε₀m); waves below that frequency are reflected, those above pass.</figcaption></figure>

## 2. Light in a plasma

A field `$E_0e^{-i\omega t}$` drives each free electron to `$x = eE_0/m\omega^2$` (opposite to the force, since there is no spring). The polarisation `$P = -nex$` gives the dielectric function

```math
\epsilon(\omega) = 1 - \frac{\omega_p^2}{\omega^2}, \qquad \omega^2 = \omega_p^2 + c^2k^2
```

This dispersion relation is the whole story of transverse waves in a cold plasma:

- **Above cutoff** (`$\omega > \omega_p$`): the refractive index `$n = \sqrt{1 - \omega_p^2/\omega^2}$` is below 1. Phase velocity `$v_p = c/n > c$`; group velocity `$v_g = cn < c$`; and `$v_pv_g = c^2$`.
- **Below cutoff** (`$\omega < \omega_p$`): `$k$` is imaginary, the field decays as `$e^{-x/\delta}$` with `$\delta = c/\sqrt{\omega_p^2 - \omega^2}$`, and a collisionless plasma reflects the wave completely. Deep below cutoff, `$\delta \to c/\omega_p$`, the collisionless skin depth (about 5 m in the F layer, 33 nm in sodium).

<figure class="fig" data-fig="plasma-omega-k"><figcaption>Dispersion of a plasma. The electromagnetic branch ω² = ω<sub>p</sub>² + c²k² approaches the light line at high frequency and starts at ω<sub>p</sub> with zero group velocity. The Bohm-Gross branch for electron plasma waves lies below it. Below ω<sub>p</sub> (shaded) there is no real k.</figcaption></figure>

### Worked example: the ionosphere and the maximum usable frequency

<div class="steps">
<div class="step"><p><b>Vertical sounding.</b> The F layer peaks at n = 1.0 × 10¹² m⁻³, so f<sub>p</sub> = 8.98 × 10⁶ Hz ≈ 9.0 MHz. A pulse sent straight up below 9 MHz comes back; above it, it escapes to space.</p></div>
<div class="step"><p><b>Oblique incidence.</b> Treat the layer as stratified. Snell's law n(z) sin θ = sin θ₀ means the ray turns back where n = sin θ₀, that is where f<sub>p</sub>²/f² = cos²θ₀.</p></div>
<div class="step"><p><b>Secant law.</b> So a wave entering at θ₀ from the vertical is reflected if f &lt; f<sub>p</sub>/cos θ₀. At θ₀ = 70°: f &lt; 9.0/0.342 = 26 MHz.</p></div>
<div class="step"><p><b>Meaning.</b> Grazing paths let short-wave signals well above f<sub>p</sub> hop around the Earth, while FM and TV (around 100 MHz) pass straight through, which is why satellites can use them.</p></div>
</div>

**Metals.** The same physics with `$n \sim 10^{28}$` to `$10^{29}$` m⁻³ puts `$\omega_p$` in the ultraviolet. Metals reflect visible light and become transparent above `$\omega_p$`: sodium near 205 nm, potassium near 315 nm. Collisions add a damping term (Drude), `$\epsilon = 1 - \omega_p^2/(\omega^2 + i\omega/\tau)$`, which matters at low frequency.

<div class="problem" data-problem="plasma-cutoff"></div>

## 3. Debye screening

Put a test charge `$Q$` in a plasma at temperature `$T$`. Electrons crowd towards it (Boltzmann factor `$e^{e\phi/k_BT}$`), and linearising Poisson's equation gives `$\nabla^2\phi = \phi/\lambda_D^2$`, so

```math
\phi(r) = \frac{Q}{4\pi\epsilon_0r}e^{-r/\lambda_D}, \qquad \lambda_D = \sqrt{\frac{\epsilon_0k_BT}{ne^2}} \approx 69\sqrt{\frac{T\,[\text{K}]}{n\,[\text{m}^{-3}]}}\ \text{m}
```

Note `$\lambda_D = v_{\rm th}/\omega_p$` with `$v_{\rm th} = \sqrt{k_BT/m}$`: the distance a thermal electron moves in one plasma period. A gas of charges behaves as a plasma when

- it is larger than `$\lambda_D$`,
- the **plasma parameter** `$N_D = \tfrac43\pi n\lambda_D^3 \gg 1$` (many electrons in a Debye sphere, so screening is collective and smooth),
- and `$\omega_p\tau_{\rm coll} > 1$` (oscillations outlast collisions).

For the F layer at 1000 K, `$\lambda_D = 69\sqrt{10^{-9}} = 2.2$` mm and `$N_D \approx 4\times10^4$`. In a metal `$\lambda_D$` is replaced by the Thomas-Fermi length, about 0.05 nm, because the electrons are degenerate.

<div class="meaning">

<dl>
<dt>ω<sub>p</sub></dt><dd>electron plasma frequency, √(ne²/ε₀m); cutoff for transverse waves</dd>
<dt>λ<sub>D</sub></dt><dd>Debye length, √(ε₀k<sub>B</sub>T/ne²); range over which a charge's field survives</dd>
<dt>N<sub>D</sub></dt><dd>plasma parameter, electrons per Debye sphere; must be large</dd>
<dt>ω<sub>c</sub></dt><dd>electron cyclotron frequency eB/m, 28 GHz per tesla</dd>
<dt>DM</dt><dd>dispersion measure ∫n<sub>e</sub> dl, usually in pc cm⁻³</dd>
<dt>Physical meaning</dt><dd>A plasma has a natural time (1/ω<sub>p</sub>) and a natural length (λ<sub>D</sub>). Slower disturbances and longer distances are screened out by the electrons; faster and shorter ones see bare charges.</dd>
</dl>

</div>

Change the density and the temperature. See how the electron cloud and the potential change.

<figure class="fig" data-fig="@em-debye-screen"><figcaption>The potential of a test charge in a plasma falls faster than 1/r: e^(−r/λ_D)/r.</figcaption></figure>

## 4. Waves with pressure: Bohm-Gross and ion acoustic

Warm electrons add a pressure gradient. With an adiabatic one-dimensional compression (`$\gamma = 3$`), the electron plasma oscillation becomes a travelling wave:

```math
\omega^2 = \omega_p^2 + 3k^2v_{\rm th}^2 \quad\text{(Bohm-Gross)}
```

Its group velocity `$3kv_{\rm th}^2/\omega$` is small but not zero. For `$k\lambda_D \gtrsim 1$` the wave's phase velocity comes down to the thermal speed, electrons surf it and drain its energy: **Landau damping**, damping with no collisions at all.

At low frequency the ions move too. Electrons, being light, follow the ion density and supply the pressure; ions supply the inertia. The result is a sound wave:

```math
\omega = kc_s, \qquad c_s = \sqrt{\frac{k_BT_e + 3k_BT_i}{M}} \approx \sqrt{\frac{k_BT_e}{M}}\ \ (T_e \gg T_i)
```

In a hydrogen plasma with `$T_e = 10$` eV, `$c_s = 3.1\times10^4$` m/s. Ion-acoustic waves exist only when `$T_e \gg T_i$`; otherwise they are Landau damped by the ions.

## 5. Magnetised plasma

A field `$\vec B_0$` adds the cyclotron frequency `$\omega_c = eB_0/m$` (28 GHz per tesla for electrons). Three results are standard:

- **Upper hybrid oscillation** across `$\vec B_0$`: `$\omega_{UH}^2 = \omega_p^2 + \omega_c^2$`. The magnetic force adds to the electrostatic restoring force.
- **Faraday rotation.** Along `$\vec B_0$`, right and left circular waves have `$n_{R,L}^2 = 1 - \omega_p^2/\omega(\omega \mp \omega_c)$`. For `$\omega \gg \omega_p, \omega_c$` the plane of linear polarisation turns by `$\Delta\psi = \text{RM}\,\lambda^2$` with rotation measure `$\text{RM} = \dfrac{e^3}{8\pi^2\epsilon_0m^2c^3}\displaystyle\int n_eB_\parallel\,dl = 2.63\times10^{-13}\int n_eB_\parallel\,dl$` rad/m² (SI units). The `$\lambda^2$` law is how astronomers separate it from intrinsic polarisation.
- **Whistlers.** For `$\omega \ll \omega_c \ll \omega_p$` the right-hand wave has `$\omega = c^2k^2\omega_c/\omega_p^2$`, so `$v_g = 2\sqrt{\omega\omega_c}\,c/\omega_p$` rises with frequency. Lightning's radio burst, guided along Earth's field lines, arrives high notes first, as a falling whistle.

### Dispersion as a ruler: pulsars

In the interstellar medium `$\omega \gg \omega_p$` (`$n_e \approx 3\times10^4$` m⁻³, `$f_p \approx 1.6$` kHz), so expand `$v_g \approx c(1 - \omega_p^2/2\omega^2)$`. The extra travel time over a path is

```math
\Delta t = \frac{e^2}{8\pi^2\epsilon_0mc}\frac{\text{DM}}{f^2} \approx 4.15\ \text{ms}\times\frac{\text{DM}\,[\text{pc cm}^{-3}]}{(f\,[\text{GHz}])^2}
```

A pulsar with DM = 50 pc cm⁻³ observed at 400 MHz lags its infinite-frequency arrival by `$4.15 \times 50/0.16 = 1.30$` s. Measuring the delay between two frequencies gives DM, and with a model of `$n_e$` (about 0.03 cm⁻³), a distance: here about 1.7 kpc.

<div class="myth">

**"The phase velocity in a plasma exceeds c, so signals do too."** The phase velocity `$c/\sqrt{1 - \omega_p^2/\omega^2}$` is indeed larger than `$c$`, but a crest of a single infinite sine wave carries no information. Signals and energy travel at the group velocity `$c\sqrt{1 - \omega_p^2/\omega^2}$`, which is always below `$c$`. The two are linked by `$v_pv_g = c^2$`, and the front of any pulse (its highest frequencies) moves at exactly `$c$`.

</div>

<div class="keypoints">

- `$\omega_p = \sqrt{ne^2/\epsilon_0m}$`, `$f_p \approx 8.98\sqrt n$` Hz; cold oscillations do not propagate.
- `$\epsilon = 1 - \omega_p^2/\omega^2$`, `$\omega^2 = \omega_p^2 + c^2k^2$`, `$v_pv_g = c^2$`; below cutoff `$\delta = c/\sqrt{\omega_p^2 - \omega^2}$`.
- Ionosphere: reflects vertically below `$f_p$`, obliquely below `$f_p/\cos\theta_0$`. Metals turn transparent above `$\omega_p$` (UV).
- `$\lambda_D = \sqrt{\epsilon_0k_BT/ne^2} = v_{\rm th}/\omega_p \approx 69\sqrt{T/n}$` m; plasma needs `$N_D = \tfrac43\pi n\lambda_D^3 \gg 1$`.
- Bohm-Gross `$\omega^2 = \omega_p^2 + 3k^2v_{\rm th}^2$`; ion acoustic `$c_s = \sqrt{k_BT_e/M}$`; Landau damping without collisions.
- `$\omega_c = eB/m$` (28 GHz/T), `$\omega_{UH}^2 = \omega_p^2 + \omega_c^2$`; Faraday rotation `$\text{RM}\lambda^2$`; whistlers `$v_g \propto \sqrt\omega$`.
- Pulsar delay `$4.15$` ms DM/f²[GHz]; higher frequencies arrive first.

</div>

## Practise: exam questions on this lesson

NET Part C style, each with a full solution. More on the [CSIR NET Physics practice page](/learn/courses/csir-net-physics/practice/).

<div class="qbank" data-bank="physics" data-topics="plasma-dispersion" data-exam="net" data-n="10"></div>

**Next:** the quantum mechanics module starts with its [roadmap](/learn/courses/csir-net-physics/quantum-roadmap/), then [scattering theory](/learn/courses/csir-net-physics/scattering-theory/). Back to [retarded and Liénard-Wiechert potentials](/learn/courses/csir-net-physics/retarded-potentials/) for the radiation of a single shaken electron.

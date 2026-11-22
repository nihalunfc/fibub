---
title: Electromagnetic waves in matter, conductors and plasmas
seoTitle: EM waves in matter, conductors and plasmas | GATE Physics
summary: 'Waves in linear dielectrics and the intrinsic impedance, complex permittivity and the loss tangent, good and poor conductors (skin depth, the 45° lag of B, surface resistance), charge relaxation, cold plasmas (dispersion, cutoff, evanescent waves, ionospheric reflection), the Drude and Lorentz models, group velocity and the Kramers-Kronig relations.'
minutes: 60
updated: 2026-11-22
quiz:
  - q: "A 2 MHz wave meets a plasma whose plasma frequency is 5 MHz. What happens?"
    choices: ['It is reflected; inside, the field decays without travelling', 'It passes through with phase velocity below c', 'It is absorbed and heats the plasma', 'It passes through unchanged']
    ans: 0
    why: "Below the plasma frequency k² = (ω² − ωp²)/c² is negative, so k is imaginary. The field decays as e^(−κz) and, with no collisions, carries no average power in: everything is reflected."
  - q: When a material is a good conductor, how does the skin depth change if the frequency is made 4 times larger?
    choices: ['It halves', 'It doubles', 'It falls to a quarter', 'It does not change']
    ans: 0
    why: "δ = √(2/μσω) goes as ω^(−1/2), so four times the frequency gives half the skin depth."
  - q: In a good conductor, which carries most of a wave's energy?
    choices: ['The magnetic field', 'The electric field', 'They share it equally', 'Neither: the energy is all in the moving charges']
    ans: 0
    why: "u_B/u_E = σ/(ωε), which is huge in a good conductor. The wave there is almost entirely magnetic, with B lagging E by 45°."
sources:
  - 'D. J. Griffiths, Introduction to Electrodynamics, 4th ed. (2017), chapter 9.3 and 9.4'
  - 'J. D. Jackson, Classical Electrodynamics, 3rd ed. (1999), chapter 7'
  - 'F. F. Chen, Introduction to Plasma Physics and Controlled Fusion, 3rd ed. (2016), chapter 4'
  - 'E. Hecht, Optics, 5th ed. (2017), chapter 3.5 (dispersion)'
  - 'GATE Physics (PH) syllabus, Electromagnetic Theory section, published by the organising institute each year'
---

**Module 3 · about 60 minutes.** By the end you will be able to describe a plane wave in any linear medium by one complex wavenumber, decide whether a material acts as a conductor or a dielectric at a given frequency, compute skin depths, surface resistance and energy ratios in metals, handle the cold-plasma dispersion relation with its cutoff, read the Drude and Lorentz models, and work with group velocity and the Kramers-Kronig idea. The vacuum basics (plane waves, Poynting vector, impedance `$\eta_0$`) are in the JAM lesson on [Maxwell's equations and electromagnetic waves](/learn/courses/iit-jam-physics/maxwell-em-waves/).

<div class="bigidea">Every linear medium is summed up by one complex number at each frequency, its permittivity. Its real part slows the wave; its imaginary part (or a conductivity) eats it. Metals, plasmas and glass are the same equations with different numbers.</div>

## 1. One complex wavenumber for every linear medium

In a homogeneous medium with permittivity `$\epsilon$`, permeability `$\mu$` and conductivity `$\sigma$`, Maxwell's equations with `$\vec J = \sigma\vec E$` give, for fields `$\propto e^{i(\tilde kz - \omega t)}$`,

```math
\tilde k^2 = \mu\epsilon\omega^2 + i\mu\sigma\omega = \mu\omega^2\left(\epsilon + \frac{i\sigma}{\omega}\right)
```

So a conductivity is the same as an imaginary part of the permittivity, `$\epsilon'' = \sigma/\omega$`. Write `$\tilde k = k + i\kappa$`: the fields go as `$e^{-\kappa z}\cos(kz - \omega t)$`, with wavelength `$2\pi/k$` and `$1/e$` length `$1/\kappa$`. The magnetic field follows from Faraday's law, `$\tilde B = (\tilde k/\omega)\tilde E$`, so a complex `$\tilde k$` also puts `$B$` out of phase with `$E$`.

The single number that decides everything is the **loss tangent**, the ratio of conduction to displacement current:

```math
\tan\delta = \frac{\sigma}{\omega\epsilon}
```

- `$\sigma \ll \omega\epsilon$`: a **low-loss dielectric**. `$k \approx \omega\sqrt{\mu\epsilon}$` and `$\kappa \approx \frac{\sigma}{2}\sqrt{\mu/\epsilon}$`, independent of frequency.
- `$\sigma \gg \omega\epsilon$`: a **good conductor**. `$\tilde k \approx (1 + i)/\delta$` with `$\delta = \sqrt{2/(\mu\sigma\omega)}$`.

The same material can be both: sea water (`$\sigma = 4$` S/m, `$\epsilon_r = 81$`) is a good conductor below about 100 MHz and a lossy dielectric at optical frequencies. For lossless dielectrics, the intrinsic impedance `$\eta = \sqrt{\mu/\epsilon} = \eta_0\sqrt{\mu_r/\epsilon_r}$` replaces 377 Ω: water at radio frequencies has `$\eta \approx 42\ \Omega$`.

**Worked example.** Soil with `$\sigma = 0.01$` S/m and `$\epsilon_r = 10$` at 10 MHz: `$\omega\epsilon = 5.6\times10^{-3}$` S/m, so `$\tan\delta = 1.8$`. Neither limit holds, and you must take the square root of `$\tilde k^2$` exactly. Ground-penetrating radar engineers live in this awkward middle.

<div class="meaning">

<dl>
<dt>k̃ = k + iκ</dt><dd>complex wavenumber: k sets the wavelength, κ the decay</dd>
<dt>ε'' = σ/ω</dt><dd>imaginary permittivity: any loss mechanism, conduction included</dd>
<dt>tan δ = σ/ωε</dt><dd>loss tangent: conduction current over displacement current</dd>
<dt>δ = √(2/μσω)</dt><dd>skin depth of a good conductor: the field falls by e in this distance</dd>
<dt>ωp = √(ne²/mε₀)</dt><dd>plasma frequency: below it free electrons screen the wave out</dd>
<dt>Physical meaning</dt><dd>A medium is a crowd of charges driven by the wave. If they keep up in phase (bound electrons far below resonance), the wave is slowed; if they lag by 90° (free electrons), they reflect it; if they lag in between, they absorb it.</dd>
</dl>

</div>

## 2. Good conductors: skin depth, phase and surface resistance

With `$\tilde k = (1 + i)/\delta$`, five facts follow at once:

1. The amplitude falls as `$e^{-z/\delta}$`; the power as `$e^{-2z/\delta}$`, i.e. 8.686 dB per skin depth.
2. The wavelength inside is `$2\pi\delta$` and the phase velocity `$\omega\delta$`, tiny (copper at 1 GHz: `$\delta = 2.1\ \mu$`m, `$v_p \approx 13$` km/s). Since `$\omega \propto k^2$`, the group velocity is `$2v_p$`.
3. `$\tilde k = \frac{\sqrt2}{\delta}e^{i\pi/4}$`, so **B lags E by 45°**, and `$B_0/E_0 = \sqrt{\mu\sigma/\omega} \gg 1/c$`.
4. The energy is mostly magnetic: `$u_B/u_E = \sigma/(\omega\epsilon)$`, about `$10^9$` for copper at 1 GHz.
5. The current flows in a layer about `$\delta$` thick, so a square of surface has resistance `$R_s = 1/(\sigma\delta) = \sqrt{\mu\omega/2\sigma}$`. The time-averaged power absorbed per unit area is `$\frac12R_s|H_0|^2$`, where `$H_0$` is the tangential magnetic field at the surface.

**Worked example.** Aluminium at 50 Hz: `$\delta = \sqrt{2/(1.2566\times10^{-6}\times3.5\times10^7\times314)} = 12$` mm. Thick power conductors therefore carry current mainly in their outer centimetre. Copper at 10 GHz: `$R_s = \sqrt{\pi f\mu_0/\sigma} = 26$` mΩ; a cavity wall where `$H_0 = 20$` A/m loses `$\frac12\times0.026\times400 = 5.2$` W/m².

The surface impedance of a good conductor is `$\eta_c = R_s(1 - i)$` (with `$e^{-i\omega t}$`), with magnitude `$\sqrt{\mu\omega/\sigma} \ll \eta_0$`. That mismatch is why metals reflect: `$1 - R \approx 4R_s/\eta_0$`, about `$3\times10^{-4}$` for copper at 10 GHz.

<div class="problem" data-problem="emm-skin"></div>

**Charge relaxation.** Gauss plus continuity plus Ohm give `$\partial\rho_f/\partial t = -(\sigma/\epsilon)\rho_f$`. Free charge inside a conductor disappears with time constant `$\tau = \epsilon/\sigma$` (`$1.5\times10^{-19}$` s for copper, far shorter than any wave period), which is why we set `$\rho_f = 0$` inside metals.

## 3. Cold plasmas: dispersion, cutoff and the ionosphere

Free electrons obey `$m\dot{\vec v} = -e\vec E$`, so for `$e^{-i\omega t}$`, `$\vec J = \frac{ine^2}{m\omega}\vec E$`: a purely imaginary conductivity, current 90° out of phase, no loss. Then

```math
\epsilon(\omega) = \epsilon_0\left(1 - \frac{\omega_p^2}{\omega^2}\right), \qquad \omega^2 = \omega_p^2 + c^2k^2, \qquad \omega_p^2 = \frac{ne^2}{m\epsilon_0}
```

Numerically `$f_p \approx 8.98\sqrt{n}$` Hz (with `$n$` in m⁻³). The dispersion relation has the form of `$E^2 = m^2c^4 + p^2c^2$`: the plasma gives light an effective mass.

- **Above cutoff** (`$\omega > \omega_p$`): `$n = \sqrt{1 - \omega_p^2/\omega^2} < 1$`, `$v_p = c/n > c$`, `$v_g = cn < c$`, and `$v_pv_g = c^2$`.
- **Below cutoff**: `$k = i\kappa$` with `$\kappa = \sqrt{\omega_p^2 - \omega^2}/c$`. The field decays without travelling, its average Poynting vector is zero, and the wave is totally reflected.

<figure class="fig" data-fig="plasma-dispersion"><figcaption>Plasma view: the dispersion curve against the light line; the slope of the chord is the phase velocity and the slope of the curve the group velocity. Conductor view: a snapshot of the field inside a metal, decaying within a few skin depths, for any metal and frequency.</figcaption></figure>

**Worked example: oblique reflection.** An ionospheric layer with peak density `$2.5\times10^{12}$` m⁻³ has `$f_p = 14.2$` MHz. A ray entering at angle `$\theta$` from the vertical turns back where `$n = \sin\theta$` (Snell in a flat, layered medium), i.e. where `$f_p = f\cos\theta$`. At `$\theta = 70^\circ$` the layer reflects up to `$14.2/\cos70^\circ = 42$` MHz, which is why short-wave radio reaches beyond the horizon while FM (100 MHz) does not.

**Worked example: dispersion of pulsar signals.** For `$f \gg f_p$` the extra group delay over a path is `$t = \frac{e^2}{8\pi^2\epsilon_0m_ec}\frac{\int n\,dl}{f^2}$`. With 30 pc cm⁻³ of electrons, the 400 MHz pulse lags the 800 MHz pulse by 0.58 s; astronomers read the electron column straight off the sweep.

## 4. Drude and Lorentz: metals and dielectrics as driven oscillators

Add collisions (time `$\tau$`) to the free electrons and you get the **Drude** conductivity

```math
\sigma(\omega) = \frac{\sigma_0}{1 - i\omega\tau}, \qquad \sigma_0 = \frac{ne^2\tau}{m}
```

For `$\omega\tau \ll 1$` it is Ohm's law; for `$\omega\tau \gg 1$` it becomes the lossless plasma with `$\omega_p^2 = \sigma_0/(\epsilon_0\tau)$`. Metals have `$n \sim 10^{28}$` m⁻³ and `$\omega_p$` in the ultraviolet, so they reflect visible light and become transparent in the ultraviolet: sodium turns transparent below about 205 nm.

Give the electrons a spring (bound charges, natural frequency `$\omega_0$`, damping `$\gamma$`) and you get the **Lorentz** model:

```math
\frac{\epsilon(\omega)}{\epsilon_0} = 1 + \frac{Ne^2}{m\epsilon_0}\frac{1}{\omega_0^2 - \omega^2 - i\gamma\omega}
```

Far below `$\omega_0$` the refractive index is above 1 and rises with frequency (**normal dispersion**: blue bends more than red). Near `$\omega_0$` the imaginary part peaks (absorption, full width `$\gamma$`) and `$n$` falls with frequency across the line (**anomalous dispersion**), with its maximum and minimum at `$\omega_0 \mp \gamma/2$`. Setting `$\omega_0 = 0$` gives back the free-electron plasma.

## 5. Group velocity and causality

A pulse moves at `$v_g = d\omega/dk$`. With `$k = n\omega/c$`:

```math
v_g = \frac{c}{n + \omega\,dn/d\omega} = \frac{c}{n - \lambda\,dn/d\lambda}
```

**Worked example.** Glass with `$n = 1.52$` and `$dn/d\lambda = -0.050\ \mu$`m⁻¹ at 500 nm: group index `$1.52 + 0.025 = 1.545$`, so `$v_g = 1.94\times10^8$` m/s, slower than `$v_p = 1.97\times10^8$` m/s.

Inside an absorption line `$n + \omega\,dn/d\omega$` can drop below 1 or go negative, so "`$v_g > c$`" appears. No signal beats light: the pulse is heavily absorbed and reshaped, and the front of a switched-on signal travels at the high-frequency limit where `$n \to 1$`.

Causality also ties absorption to refraction. Because the polarisation cannot precede the field, `$\epsilon(\omega)$` is analytic in the upper half of the complex `$\omega$` plane, and its real and imaginary parts are linked by the **Kramers-Kronig relations** (the contour methods of [lesson 1.4 on residues](/learn/courses/gate-physics/residues/)):

```math
\epsilon'(\omega) - \epsilon_0 = \frac{2}{\pi}\,\text{PV}\!\int_0^\infty\frac{\omega'\epsilon''(\omega')}{\omega'^2 - \omega^2}\,d\omega'
```

Two consequences: a material that absorbed nowhere would have `$\epsilon = \epsilon_0$` everywhere, and every absorption band raises the index at frequencies below it. Glass is transparent and has `$n > 1$` in the visible because it absorbs in the ultraviolet.

<div class="myth">

**"A decaying wave means energy is being absorbed."** Not necessarily. Below the plasma frequency the field decays as `$e^{-\kappa z}$` in a perfectly lossless plasma: `$E$` and `$B$` are 90° out of phase, the average Poynting vector is zero, and all the energy is reflected. Absorption needs a real part of the conductivity (collisions), not just an imaginary wavenumber. The same holds for evanescent waves in total internal reflection and below-cutoff waveguides.

</div>

<div class="keypoints">

- `$\tilde k^2 = \mu\omega^2(\epsilon + i\sigma/\omega)$`; `$\tan\delta = \sigma/\omega\epsilon$` decides conductor or dielectric, at each frequency.
- Low-loss: `$\kappa \approx \frac{\sigma}{2}\sqrt{\mu/\epsilon}$` (frequency independent). Lossless: `$\eta = \eta_0\sqrt{\mu_r/\epsilon_r}$`.
- Good conductor: `$\tilde k = (1 + i)/\delta$`, `$\delta = \sqrt{2/\mu\sigma\omega}$`; `$\lambda = 2\pi\delta$`, `$v_p = \omega\delta$`, `$v_g = 2v_p$`; B lags E by 45°; `$u_B/u_E = \sigma/\omega\epsilon$`; `$R_s = 1/\sigma\delta$`, loss `$\frac12R_sH_0^2$`; `$1 - R \approx 4R_s/\eta_0$`.
- Charge relaxation `$\tau = \epsilon/\sigma$`.
- Plasma: `$\omega^2 = \omega_p^2 + c^2k^2$`, `$f_p = 8.98\sqrt n$` Hz, `$v_pv_g = c^2$`; below cutoff evanescent with `$1/\kappa = c/\sqrt{\omega_p^2 - \omega^2}$`; oblique reflection up to `$f_p\sec\theta$`; delay `$\propto 1/f^2$`.
- Drude `$\sigma_0/(1 - i\omega\tau)$`; metals transparent above `$\omega_p$` (ultraviolet). Lorentz: normal dispersion away from lines, anomalous inside, extremes at `$\omega_0 \mp \gamma/2$`.
- `$v_g = c/(n + \omega\,dn/d\omega)$`; Kramers-Kronig from causality: absorption below raises `$n$`.

</div>

## Practise: exam questions on this lesson

From warm-up to top-rank level, with full solutions. More on the [practice page](/learn/courses/gate-physics/practice/em-waves-media/).

<div class="qbank" data-bank="physics" data-topics="em-waves-media" data-exam="gate" data-n="10"></div>

**Before this:** the JAM lesson on [Maxwell's equations and electromagnetic waves](/learn/courses/iit-jam-physics/maxwell-em-waves/) and, for group velocity in general, [waves](/learn/courses/iit-jam-physics/waves/). **Next:** [lesson 3.7, the Fresnel equations](/learn/courses/gate-physics/fresnel-equations/), where these media meet at a boundary. Back to the [GATE Physics course home](/learn/courses/gate-physics/).

**Going on to CSIR NET?** [Plasma oscillations and dispersion](/learn/courses/csir-net-physics/plasma-dispersion/) goes further with the plasma frequency and cutoffs.

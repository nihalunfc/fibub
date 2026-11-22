---
title: Dielectric and optical properties of solids
seoTitle: Dielectric and optical properties of solids | CSIR NET
summary: 'How solids respond to electric fields from DC to ultraviolet: electronic, ionic and orientational polarisability, the Lorentz local field and the Clausius-Mossotti relation, the Langevin-Debye law, Debye relaxation and dielectric loss, the Lorentz oscillator and the Lyddane-Sachs-Teller relation, the Drude metal with its plasma frequency, reflectivity and skin depth, and the Kramers-Kronig link between ε′ and ε″.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: 'In a Debye dielectric with ε_s = 50 and ε∞ = 4, the loss ε″ is largest when'
    choices: ['ωτ = 1, where ε″ = 23', 'ωτ = 1, where ε″ = 46', 'ω → 0, where ε″ = 50', 'ωτ = √(ε_s/ε∞)']
    ans: 0
    why: 'ε″ = (ε_s − ε∞)ωτ/(1 + ω²τ²), which peaks at ωτ = 1 with height (ε_s − ε∞)/2 = 23.'
  - q: 'A free-electron metal has ħω_p = 9 eV. Light of photon energy 5 eV falling on it is'
    choices: ['almost totally reflected, since ε′ < 0', 'transmitted, since ε′ > 0', 'absorbed in the bulk with ε′ = 0', 'reflected only at grazing incidence']
    ans: 0
    why: 'ε′ = 1 − ω_p²/ω² = 1 − 81/25 < 0, so the refractive index is imaginary and the wave decays within the surface: R ≈ 1.'
  - q: 'An ionic crystal has ε(0) = 9.0, ε(∞) = 4.0 and transverse optical frequency ω_T. The longitudinal optical frequency is'
    choices: ['1.5 ω_T', '2.25 ω_T', '0.67 ω_T', '√5 ω_T']
    ans: 0
    why: 'Lyddane-Sachs-Teller: ω_L²/ω_T² = ε(0)/ε(∞) = 2.25, so ω_L = 1.5 ω_T.'
sources:
  - 'C. Kittel, Introduction to Solid State Physics, 8th ed. (2005), chapters 14 and 15 and appendix'
  - 'M. Fox, Optical Properties of Solids, 2nd ed. (2010), chapters 2 and 7'
  - 'N. W. Ashcroft and N. D. Mermin, Solid State Physics (1976), chapters 1 and 27'
  - 'CSIR-UGC NET Physical Sciences syllabus, Part C condensed matter physics, published by the National Testing Agency'
---

**Module 9 · about 45 minutes.** The JAM lesson on [dielectrics](/learn/courses/iit-jam-physics/dielectrics/) and the GATE lesson on [fields in matter](/learn/courses/gate-physics/fields-in-matter/) treated `$\varepsilon_r$` as a number. Here it becomes a complex function of frequency, `$\varepsilon(\omega) = \varepsilon' + i\varepsilon''$`, built from the motion of the charges inside. One function explains why glass is transparent, why metals shine, why water heats in a microwave oven and why sodium lets ultraviolet through.

<div class="bigidea">Every polarisation mechanism is a charge that can be pushed: bound electrons, ions, or whole dipoles. Each one follows the field up to a characteristic frequency and then drops out. Below it, the mechanism adds to ε′; near it, energy is lost (ε″ peaks); above it, it is gone. Free electrons have no restoring force at all, so in a metal ε′ is negative up to the plasma frequency and the metal reflects.</div>

## 1. Polarisability and the local field

An atom in a field `$E_{\text{loc}}$` gets a dipole `$p = \alpha E_{\text{loc}}$`. Three mechanisms add:

<div class="meaning">

<dl>
<dt>Electronic `$\alpha_e$`</dt><dd>the electron cloud shifts against its nucleus; follows the field into the ultraviolet (resonance near 10¹⁶ rad/s). For an atom of radius `$R$`, a uniform-cloud model gives `$\alpha_e = 4\pi\varepsilon_0R^3$`</dd>
<dt>Ionic `$\alpha_i$`</dt><dd>positive and negative ions shift oppositely; follows up to the infrared (transverse optical phonon, 10¹³ rad/s)</dd>
<dt>Orientational `$p_0^2/3k_BT$`</dt><dd>permanent dipoles turn towards the field against thermal agitation (Langevin-Debye); drops out in the microwave, where rotation cannot keep up</dd>
</dl>

</div>

In a dense solid the field at an atom is not the average field `$E$`. Cut out a small sphere around the atom: the polarised material outside leaves a surface charge on the sphere that adds `$P/3\varepsilon_0$` (for cubic symmetry the dipoles inside the sphere cancel). This is the Lorentz local field.

<div class="steps">
<div class="step"><p><b>Local field.</b> E<sub>loc</sub> = E + P/3ε₀.</p></div>
<div class="step"><p><b>Polarisation.</b> P = Nα E<sub>loc</sub> = Nα(E + P/3ε₀), so P = NαE/(1 − Nα/3ε₀).</p></div>
<div class="step"><p><b>Permittivity.</b> ε<sub>r</sub> = 1 + P/ε₀E. Writing x = Nα/3ε₀ gives ε<sub>r</sub> = (1 + 2x)/(1 − x), which rearranges to Clausius-Mossotti.</p></div>
</div>

```math
\frac{\varepsilon_r - 1}{\varepsilon_r + 2} = \frac{N\alpha}{3\varepsilon_0}, \qquad \alpha = \alpha_e + \alpha_i + \frac{p_0^2}{3k_BT}
```

At optical frequencies only `$\alpha_e$` survives and `$\varepsilon_r = n^2$`: the same equation with `$n^2$` is the Lorentz-Lorenz formula.

**Worked example.** Liquid argon has `$N = 2.1\times10^{28}$` m⁻³ and `$\alpha/4\pi\varepsilon_0 = 1.64\times10^{-30}$` m³. Then `$x = N\alpha/3\varepsilon_0 = 2.1\times10^{28}\times4\pi\times1.64\times10^{-30}/3 = 0.144$`, so `$\varepsilon_r = 1.288/0.856 = 1.51$` (measured 1.50). Ignoring the local field gives `$1 + 3x = 1.43$`: the local field matters as soon as `$x$` is not small. As `$x \to 1$` the permittivity diverges: the polarisation catastrophe, where a soft optical mode freezes and the crystal becomes ferroelectric (BaTiO₃).

<div class="problem" data-problem="clausius-polarisability"></div>

**Separating the mechanisms.** Plot `$(\varepsilon_r - 1)$` (for a gas) against `$1/T$`: the intercept gives `$\alpha_e + \alpha_i$`, the slope gives `$Np_0^2/3\varepsilon_0k_B$`. Comparing `$\varepsilon_r$` at low frequency with `$n^2$` at optical frequency separates ionic from electronic parts.

## 2. Debye relaxation: dipoles that lag

Permanent dipoles align with a relaxation time `$\tau$` (picoseconds for water). If `$P_{\text{or}}$` relaxes towards its static value as `$dP/dt = (P_s - P)/\tau$`, a field `$E_0e^{-i\omega t}$` gives

```math
\varepsilon(\omega) = \varepsilon_\infty + \frac{\varepsilon_s - \varepsilon_\infty}{1 - i\omega\tau}, \quad
\varepsilon' = \varepsilon_\infty + \frac{\varepsilon_s - \varepsilon_\infty}{1 + \omega^2\tau^2}, \quad
\varepsilon'' = \frac{(\varepsilon_s - \varepsilon_\infty)\,\omega\tau}{1 + \omega^2\tau^2}
```

<div class="meaning">

<dl>
<dt>Step in `$\varepsilon'$`</dt><dd>from `$\varepsilon_s$` (dipoles follow) to `$\varepsilon_\infty$` (dipoles frozen), centred on `$\omega\tau = 1$`</dd>
<dt>Loss peak</dt><dd>`$\varepsilon''_{\max} = (\varepsilon_s - \varepsilon_\infty)/2$` at `$\omega\tau = 1$`; full width 1.14 decades on a log scale</dd>
<dt>Cole-Cole plot</dt><dd>`$\varepsilon''$` against `$\varepsilon'$` is a semicircle of radius `$(\varepsilon_s - \varepsilon_\infty)/2$`; a flattened arc means a spread of relaxation times</dd>
<dt>Power absorbed</dt><dd>per volume `$\tfrac12\omega\varepsilon_0\varepsilon''E_0^2$`; loss tangent `$\tan\delta = \varepsilon''/\varepsilon'$`</dd>
</dl>

</div>

**Worked example.** Water near room temperature: `$\varepsilon_s \approx 80$`, `$\varepsilon_\infty \approx 5$`, `$\tau \approx 8.3$` ps. The loss peaks at `$f = 1/2\pi\tau = 19$` GHz with `$\varepsilon'' \approx 37$`. A microwave oven runs at 2.45 GHz, well below the peak (`$\omega\tau = 0.128$`): `$\varepsilon'' \approx 75\times0.128/1.016 \approx 9.4$`, enough to heat food yet small enough that the waves get a few centimetres in before they are absorbed.

## 3. Bound charges: the Lorentz oscillator

An electron (or ion) on a spring of natural frequency `$\omega_0$` with damping `$\gamma$`: `$m(\ddot x + \gamma\dot x + \omega_0^2x) = -eE$`. With `$N$` such oscillators per volume and `$\omega_p^2 = Ne^2/\varepsilon_0m$`:

```math
\varepsilon(\omega) = 1 + \frac{\omega_p^2}{\omega_0^2 - \omega^2 - i\gamma\omega}
```

<div class="steps">
<div class="step"><p><b>Below ω₀.</b> ε′ > 1 and rises with ω: normal dispersion (blue light bends more in glass).</p></div>
<div class="step"><p><b>Near ω₀.</b> ε″ peaks with width γ (absorption line); ε′ falls with ω: anomalous dispersion.</p></div>
<div class="step"><p><b>Between ω₀ and √(ω₀² + ω<sub>p</sub>²).</b> With little damping ε′ < 0: no wave propagates, and the crystal reflects almost perfectly. For ionic crystals this is the reststrahlen band in the infrared.</p></div>
<div class="step"><p><b>Far above.</b> ε → 1 − ω<sub>p</sub>²/ω²: the charges respond as if free.</p></div>
</div>

For an ionic crystal with a background `$\varepsilon(\infty)$` from the electrons, the zero of `$\varepsilon(\omega)$` (a longitudinal wave can exist only where `$\varepsilon = 0$`) sits at the longitudinal optical frequency `$\omega_L$`, the pole at the transverse frequency `$\omega_T$`. That gives the Lyddane-Sachs-Teller relation (see also [phonons](/learn/courses/gate-physics/phonons/)):

```math
\frac{\omega_L^2}{\omega_T^2} = \frac{\varepsilon(0)}{\varepsilon(\infty)}
```

NaCl: `$\varepsilon(0) = 5.9$`, `$\varepsilon(\infty) = 2.25$`, `$\bar\nu_T = 164$` cm⁻¹, so `$\bar\nu_L = 164\sqrt{2.62} = 266$` cm⁻¹, close to the measured 264 cm⁻¹. NaCl reflects strongly between about 61 and 38 μm.

<figure class="fig" data-fig="dielectric-function"><figcaption>ε′ (real part), ε″ (loss) and the normal-incidence reflectivity in four models. Clausius-Mossotti: the local field and the polarisation catastrophe. Debye: a step and a loss peak at ωτ = 1. Lorentz: dispersion, absorption and the band of strong reflection. Drude: a metal mirrors below ω<sub>p</sub> and turns transparent above it.</figcaption></figure>

## 4. Free electrons: the Drude metal

Set `$\omega_0 = 0$` (no restoring force) and call the damping `$\gamma = 1/\tau$`:

```math
\varepsilon(\omega) = 1 - \frac{\omega_p^2}{\omega^2 + i\gamma\omega}, \qquad \omega_p = \sqrt{\frac{ne^2}{\varepsilon_0 m}}, \qquad \sigma(\omega) = \frac{\sigma_0}{1 - i\omega\tau}
```

<div class="meaning">

<dl>
<dt>`$\omega < \omega_p$` (with `$\gamma \ll \omega$`)</dt><dd>`$\varepsilon' < 0$`, the index `$\tilde n = n + i\kappa$` is almost purely imaginary, and `$R = |(\tilde n - 1)/(\tilde n + 1)|^2 \approx 1$`: metals shine</dd>
<dt>`$\omega > \omega_p$`</dt><dd>`$\varepsilon' > 0$`, the metal transmits: the ultraviolet transparency of the alkali metals</dd>
<dt>`$\omega = \omega_p$`</dt><dd>`$\varepsilon = 0$`: a longitudinal collective oscillation of the electron gas, the plasmon (seen as energy-loss peaks of fast electrons)</dd>
<dt>Low frequency, `$\omega\tau \ll 1$`</dt><dd>`$\varepsilon'' = \sigma_0/\varepsilon_0\omega$` dominates; fields fall off over the skin depth `$\delta = \sqrt{2/\mu_0\sigma_0\omega}$`</dd>
<dt>Absorption coefficient</dt><dd>`$\alpha = 2\omega\kappa/c$` for any medium, from the intensity `$e^{-\alpha z}$`</dd>
</dl>

</div>

**Worked example.** Sodium has one conduction electron per atom, `$n = 2.65\times10^{28}$` m⁻³. Then `$\omega_p = \sqrt{ne^2/\varepsilon_0m} = 9.2\times10^{15}$` rad/s, `$\hbar\omega_p = 6.0$` eV and `$\lambda_p = 2\pi c/\omega_p = 205$` nm. Sodium is a mirror in the visible and transparent below about 210 nm, as measured. For copper at 1 GHz, `$\sigma_0 = 5.96\times10^7$` S/m gives `$\delta = \sqrt{2/(4\pi\times10^{-7}\times5.96\times10^7\times2\pi\times10^9)} = 2.1\ \mu$`m, which is why microwave conductors need only a thin plating.

<div class="problem" data-problem="drude-reflect"></div>

In real metals the bound electrons add a background: `$\varepsilon = \varepsilon_b - \omega_p^2/\omega^2$`, so the edge moves to `$\omega_p/\sqrt{\varepsilon_b}$`. Interband absorption from the d bands gives copper and gold their colour by cutting the reflectivity in the blue. In a doped semiconductor, use `$m^*$` and the lattice permittivity: `$\omega_p = \sqrt{ne^2/\varepsilon_0\varepsilon_L m^*}$`, which puts the edge in the infrared.

## 5. Causality: Kramers-Kronig

Because the polarisation cannot come before the field, `$\varepsilon(\omega) - 1$` is analytic in the upper half of the complex `$\omega$`-plane (see [complex analysis](/learn/courses/gate-physics/complex-analysis/)). This ties the two parts together:

```math
\varepsilon'(\omega) - 1 = \frac{2}{\pi}\,\mathcal P\!\int_0^\infty \frac{\omega'\varepsilon''(\omega')}{\omega'^2 - \omega^2}\,d\omega'
```

Every absorption band therefore produces dispersion, and the static `$\varepsilon_s - 1 = (2/\pi)\int\varepsilon''(\omega')\,d\omega'/\omega'$` counts all the absorption at every frequency. A related sum rule fixes `$\int_0^\infty\omega\varepsilon''\,d\omega = \tfrac\pi2\omega_p^2$` with the total electron density.

<div class="myth">

**"A material with ε′ < 0 absorbs the light."** Negative `$\varepsilon'$` with small `$\varepsilon''$` means the wave cannot travel in, but nothing is absorbed: the energy comes back out as reflection. Absorption needs `$\varepsilon'' > 0$`. A good metal below `$\omega_p$` and NaCl in its reststrahlen band are nearly perfect mirrors for this reason, and the small loss that remains (`$1 - R$`) comes from `$\gamma$`.

</div>

<div class="keypoints">

- Lorentz local field `$E + P/3\varepsilon_0$`; Clausius-Mossotti `$(\varepsilon_r - 1)/(\varepsilon_r + 2) = N\alpha/3\varepsilon_0$`; Lorentz-Lorenz with `$n^2$`; catastrophe at `$N\alpha/3\varepsilon_0 = 1$`.
- `$\alpha = \alpha_e + \alpha_i + p_0^2/3k_BT$`; mechanisms drop out in UV, IR and microwave in turn.
- Debye: `$\varepsilon = \varepsilon_\infty + (\varepsilon_s - \varepsilon_\infty)/(1 - i\omega\tau)$`; loss peak `$(\varepsilon_s - \varepsilon_\infty)/2$` at `$\omega\tau = 1$`; Cole-Cole semicircle.
- Lorentz oscillator: normal and anomalous dispersion; reflecting band from `$\omega_T$` to `$\omega_L$`; LST `$\omega_L^2/\omega_T^2 = \varepsilon(0)/\varepsilon(\infty)$`.
- Drude: `$\varepsilon = 1 - \omega_p^2/(\omega^2 + i\gamma\omega)$`, `$\omega_p^2 = ne^2/\varepsilon_0m$`; `$R \approx 1$` below `$\omega_p$`, transparent above; plasmon at `$\varepsilon = 0$`; skin depth `$\sqrt{2/\mu_0\sigma\omega}$`.
- Kramers-Kronig: causality links `$\varepsilon'$` and `$\varepsilon''$`; every absorption brings dispersion.

</div>

## Practise: exam questions on this lesson

<div class="qbank" data-bank="physics" data-topics="dielectric-optical" data-exam="net" data-n="10"></div>

**Next:** [lesson 9.4](/learn/courses/csir-net-physics/quantum-hall/) confines electrons to two dimensions and puts them in a strong magnetic field. For how ε(ω) sets the reflection at an interface, see [Fresnel equations](/learn/courses/gate-physics/fresnel-equations/) and [waves in media](/learn/courses/gate-physics/em-waves-media/).

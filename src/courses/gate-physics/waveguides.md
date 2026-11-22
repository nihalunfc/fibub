---
title: Waveguides
seoTitle: Waveguides, cavities and optical fibres | GATE Physics
summary: 'Guided waves in hollow metal pipes: TE and TM modes of a rectangular guide, cutoff frequencies and the dominant TE10 mode, guide wavelength, phase and group velocity, wave impedance, evanescent modes and power flow; the bouncing plane-wave picture; circular guides; TEM lines and transmission-line basics; cavity resonators; and step-index optical fibres.'
minutes: 60
updated: 2026-11-22
quiz:
  - q: Why can a hollow rectangular metal pipe not carry a TEM wave?
    choices: ['A TEM field would be a 2D electrostatic field inside a single conductor, which must be zero', 'Because its walls are too lossy', 'Because TEM waves travel faster than light', 'It can, but only at high frequency']
    ans: 0
    why: "For TEM the transverse field obeys Laplace's equation in the cross-section. With only one conductor, the boundary is one equipotential, so the field vanishes. Coaxial lines have two conductors and carry TEM."
  - q: A guide's TE10 cutoff is 6 GHz. What happens to a 4 GHz signal?
    choices: ['It decays exponentially along the guide and is reflected', 'It travels slowly', 'It travels at c', 'It switches to the TM11 mode']
    ans: 0
    why: "Below cutoff k_z is imaginary, so the fields fall as e^(−αz) with no travelling phase. A short length of guide below cutoff is a strong attenuator."
  - q: In a hollow guide, which quantity is below c for a propagating mode?
    choices: ['The group velocity', 'The phase velocity', 'Both', 'Neither']
    ans: 0
    why: "ω² = ωc² + c²k_z² gives v_p = c/√(1 − (fc/f)²) > c and v_g = c√(1 − (fc/f)²) < c, with v_p·v_g = c²."
sources:
  - 'D. J. Griffiths, Introduction to Electrodynamics, 4th ed. (2017), chapter 9.5'
  - 'J. D. Jackson, Classical Electrodynamics, 3rd ed. (1999), chapter 8'
  - 'D. M. Pozar, Microwave Engineering, 4th ed. (2012), chapters 2 and 3'
  - 'J. M. Senior, Optical Fiber Communications, 3rd ed. (2009), chapter 2'
  - 'GATE Physics (PH) syllabus, Electromagnetic Theory section, published by the organising institute each year'
---

**Module 3 · about 60 minutes.** By the end you will be able to find the modes and cutoff frequencies of rectangular and circular guides, say which modes propagate at a given frequency, compute guide wavelength, phase and group velocities, wave impedance, attenuation below cutoff and carried power, picture modes as bouncing plane waves, and apply the same ideas to coaxial lines, cavity resonators and optical fibres. It builds on [lesson 3.7](/learn/courses/gate-physics/fresnel-equations/): a guided mode is a wave reflected back and forth between walls.

<div class="bigidea">Walls force the field into standing waves across the guide. Each standing pattern costs a fixed transverse wavenumber, so the wave can travel along the guide only if its frequency is high enough to pay that cost: every mode has a cutoff.</div>

## 1. Guided waves: the general recipe

Take a perfectly conducting hollow pipe along `$z$`, filled with a medium of wave speed `$v = 1/\sqrt{\mu\epsilon}$`. Look for fields `$\propto e^{i(k_zz - \omega t)}$`. The longitudinal components `$E_z$` and `$B_z$` each obey the 2D Helmholtz equation in the cross-section,

```math
\left(\partial_x^2 + \partial_y^2 + k_c^2\right)\{E_z, B_z\} = 0, \qquad k_c^2 = \frac{\omega^2}{v^2} - k_z^2
```

and every transverse component follows from them by differentiation. The walls set the boundary conditions: `$E_z = 0$` (tangential `$E$` vanishes) and `$\partial B_z/\partial n = 0$` (normal `$B$` vanishes). Three families:

- **TE** (`$E_z = 0$`, `$B_z \ne 0$`) and **TM** (`$B_z = 0$`, `$E_z \ne 0$`). Each has a discrete set of `$k_c$` values.
- **TEM** (`$E_z = B_z = 0$`): needs `$k_c = 0$`, and then the transverse field is a 2D electrostatic field. Inside one closed conductor that field is zero, so **hollow guides have no TEM mode**. Two conductors (coax, parallel plates, a twisted pair) allow it, with no cutoff.

From `$k_c^2 = \omega^2/v^2 - k_z^2$`, a mode propagates only above its **cutoff** `$\omega_c = vk_c$`:

```math
\omega^2 = \omega_c^2 + v^2k_z^2
```

the same form as the cold plasma of [lesson 3.6](/learn/courses/gate-physics/em-waves-media/). Hence, with `$s = \sqrt{1 - (f_c/f)^2}$`:

```math
\lambda_g = \frac{\lambda}{s}, \qquad v_p = \frac{v}{s} > v, \qquad v_g = vs < v, \qquad v_pv_g = v^2
```

Below cutoff `$k_z = i\alpha$` with `$\alpha = \sqrt{k_c^2 - k^2}$`: an **evanescent** mode, decaying without travelling.

## 2. The rectangular guide

For a guide `$0 \le x \le a$`, `$0 \le y \le b$` with `$a > b$`, separation of variables gives

```math
B_z \propto \cos\frac{m\pi x}{a}\cos\frac{n\pi y}{b}\ (\text{TE}_{mn}), \qquad E_z \propto \sin\frac{m\pi x}{a}\sin\frac{n\pi y}{b}\ (\text{TM}_{mn})
```

```math
f_{c,mn} = \frac{v}{2}\sqrt{\left(\frac{m}{a}\right)^2 + \left(\frac{n}{b}\right)^2}
```

TE allows one index to be zero; TM needs both at least 1 (otherwise `$E_z \equiv 0$` and nothing is left). So:

- The **dominant mode** is TE₁₀, with `$f_c = v/2a$` and cutoff wavelength `$2a$`: half a wavelength must fit across the broad side.
- Its field: `$E_y \propto \sin(\pi x/a)$`, uniform in `$y$`, largest in the middle and zero at the side walls; `$B_x \propto \sin(\pi x/a)$` and `$B_z \propto \cos(\pi x/a)$`.
- The next modes are TE₂₀ (`$v/a$`) and TE₀₁ (`$v/2b$`). Choosing `$a \approx 2b$` makes them coincide and gives a single-mode band of a full factor 2 in frequency. TE and TM with the same `$m, n \ge 1$` always share a cutoff.

**Worked example.** An air guide 2.5 cm × 1.0 cm: TE₁₀ at 6.0 GHz, TE₂₀ at 12.0, TE₀₁ at 15.0, TE₁₁/TM₁₁ at 16.2 GHz. Single-mode operation runs from 6 to 12 GHz. At 9.0 GHz, `$s = \sqrt{1 - (6/9)^2} = 0.745$`: `$\lambda_g = 3.33/0.745 = 4.47$` cm, `$v_g = 0.745c$` and `$v_p = 1.34c$`. At 20 GHz eight modes propagate.

<figure class="fig" data-fig="waveguide-modes"><figcaption>Top: the cutoff ladder for a guide of aspect ratio b/a; modes to the left of the operating frequency propagate. Bottom: the transverse electric field of the chosen mode in the cross-section.</figcaption></figure>

**Wave impedance and power.** The ratio of transverse `$E$` to transverse `$H$` is

```math
Z_{TE} = \frac{\eta}{s}, \qquad Z_{TM} = \eta s
```

`$Z_{TE}$` rises without limit and `$Z_{TM}$` falls to zero at cutoff; both tend to `$\eta$` far above it. For TE₁₀ with peak field `$E_0$`, integrating the Poynting vector over the cross-section gives `$P = \dfrac{E_0^2ab}{4Z_{TE}}$`. With air breaking down near 3 MV/m, the 2.5 × 1.0 cm guide at 9 GHz carries at most about 1.1 MW.

**Below cutoff.** At 3 GHz in the same guide, `$\alpha = \sqrt{(\pi/a)^2 - k^2} = 109$` Np/m: 47 dB over 5 cm. Far below cutoff `$\alpha \approx \pi/a$` hardly depends on frequency, which makes below-cutoff attenuators precise, and is why a microwave oven door's small holes block 2.45 GHz while letting light through.

<div class="problem" data-problem="wvg-te10"></div>

## 3. The bouncing plane-wave picture

TE₁₀ is two plane waves zigzagging between the side walls at angle `$\theta$` to the axis. Their sum must vanish at `$x = 0$` and `$x = a$`, so `$k\sin\theta = \pi/a$`:

```math
\sin\theta = \frac{\lambda}{2a} = \frac{f_c}{f}, \qquad k_z = k\cos\theta, \qquad v_g = c\cos\theta, \qquad v_p = \frac{c}{\cos\theta}
```

At cutoff `$\theta = 90^\circ$`: the waves bounce straight across and get nowhere. Far above cutoff they travel almost along the axis. Energy moves along the zigzag at `$c$`, so its axial speed is `$c\cos\theta$`; the phase velocity is just how fast the crossing point of a slanted wavefront slides along the wall.

<div class="myth">

**"The phase velocity in a waveguide exceeds c, so signals do too."** Signals and energy travel at the group velocity, `$c\sqrt{1 - (f_c/f)^2}$`, always below `$c$`. The phase velocity is the speed of a pattern, like the point where a wave breaks along a beach, which can run faster than any water. A 9 GHz pulse needs 44.7 ns for 10 m of the guide above, against 33.4 ns in free space.

</div>

## 4. Circular guides, TEM lines and transmission lines

**Circular guide** (radius `$R$`): the modes involve Bessel functions. TM modes use zeros of `$J_n$`, TE modes zeros of `$J_n'$`: `$f_c = \frac{v\,x}{2\pi R}$` with `$x$` = 1.841 (TE₁₁, dominant), 2.405 (TM₀₁), 3.054 (TE₂₁), 3.832 (TE₀₁ and TM₁₁, degenerate because `$J_0' = -J_1$`). The single-mode band is only a factor 1.31 wide. A 1.0 cm radius air guide has TE₁₁ cutoff 8.78 GHz.

**Coaxial line** (radii `$a < b$`): TEM with `$v = c/\sqrt{\epsilon_r}$` at every frequency (no dispersion) and

```math
Z_0 = \sqrt{\frac{L'}{C'}} = \frac{\eta_0}{2\pi\sqrt{\epsilon_r}}\ln\frac ba
```

`$b/a = 3.6$` with polyethylene gives 51 Ω. Above roughly `$\lambda_c \approx \pi(a + b)\sqrt{\epsilon_r}$` a TE₁₁ mode appears, which sets a cable's upper frequency.

**Transmission-line basics.** A load `$Z_L$` on a line of impedance `$Z_0$` reflects `$\Gamma = \frac{Z_L - Z_0}{Z_L + Z_0}$`, making a standing wave with `$\text{VSWR} = \frac{1 + |\Gamma|}{1 - |\Gamma|}$` (75 Ω on 50 Ω: `$\Gamma = 0.2$`, VSWR 1.5, 4% of the power back). A line a quarter wavelength long transforms `$Z_L$` into `$Z_0^2/Z_L$`; that is how a quarter-wave section matches two impedances, the same physics as an antireflection coating.

## 5. Cavities and optical fibres

**Cavity resonators.** Close a rectangular guide at both ends (length `$d$`) and the field must form a standing wave along `$z$` too:

```math
f_{mnp} = \frac{v}{2}\sqrt{\left(\frac ma\right)^2 + \left(\frac nb\right)^2 + \left(\frac pd\right)^2}
```

Index sets with all three non-zero carry two modes (TE and TM), those with one zero carry one. A 2.5 × 1.0 × 5.0 cm box has its TE₁₀₁ resonance at 6.70 GHz. The quality factor from wall loss is roughly `$Q \sim V/(S\delta)$` (stored volume over lossy skin volume), around `$10^4$` for copper at microwave frequencies; better conductors and smoother walls raise it.

**Step-index optical fibres** are dielectric waveguides that guide by total internal reflection. Core `$n_1$`, cladding `$n_2$`:

```math
\text{NA} = \sqrt{n_1^2 - n_2^2} = \sin\theta_a, \qquad V = \frac{2\pi a}{\lambda}\text{NA}
```

The fibre is **single-mode** for `$V < 2.405$` (the first zero of `$J_0$`, again); for large `$V$` it carries about `$V^2/2$` modes. **Worked example.** Core radius 4.0 μm, NA 0.12, at 1.31 μm: `$V = 2.30$`, single-mode. In a multimode step-index fibre, ray optics gives an intermodal delay spread `$\Delta t = \frac{Ln_1}{c}\left(\frac{n_1}{n_2} - 1\right)$`: 68 ns per km for `$n_1 = 1.50$`, `$n_2 = 1.48$`, which limits the bit rate. Single-mode fibre removes it and leaves only material and waveguide dispersion.

<div class="meaning">

<dl>
<dt>f_c = (v/2)√((m/a)² + (n/b)²)</dt><dd>cutoff of the TE or TM (m, n) mode of a rectangular guide</dd>
<dt>s = √(1 − (f_c/f)²)</dt><dd>the one factor behind λ_g = λ/s, v_p = v/s, v_g = vs, Z_TE = η/s, Z_TM = ηs</dd>
<dt>α = √(k_c² − k²)</dt><dd>decay constant of a mode below cutoff</dd>
<dt>V = (2πa/λ)NA</dt><dd>normalised frequency of a fibre; single-mode below 2.405</dd>
<dt>Physical meaning</dt><dd>A guide trades frequency for a transverse pattern. The pattern's wavenumber k_c is fixed by the walls, and only the remainder √(k² − k_c²) is left to travel along the guide.</dd>
</dl>

</div>

<div class="keypoints">

- Modes: TE (`$E_z = 0$`), TM (`$B_z = 0$`); TEM only with two or more conductors. `$\omega^2 = \omega_c^2 + v^2k_z^2$`.
- Rectangular: `$f_c = \frac v2\sqrt{(m/a)^2 + (n/b)^2}$`; TE allows one zero index, TM none; dominant TE₁₀, `$\lambda_c = 2a$`, `$E_y \propto \sin(\pi x/a)$`.
- `$\lambda_g = \lambda/s$`, `$v_p = v/s$`, `$v_g = vs$`, `$v_pv_g = v^2$`; `$Z_{TE} = \eta/s$`, `$Z_{TM} = \eta s$`; TE₁₀ power `$E_0^2ab/4Z_{TE}$`.
- Below cutoff: `$\alpha = \sqrt{k_c^2 - k^2}$`, about `$\pi/a$` far below.
- Bouncing waves: `$\sin\theta = f_c/f$`, `$v_g = c\cos\theta$`.
- Circular: TE₁₁ dominant (1.841), then TM₀₁ (2.405); `$f_c = vx/2\pi R$`.
- Coax: TEM, `$Z_0 = \frac{\eta_0}{2\pi\sqrt{\epsilon_r}}\ln\frac ba$`. Lines: `$\Gamma = \frac{Z_L - Z_0}{Z_L + Z_0}$`, quarter-wave gives `$Z_0^2/Z_L$`.
- Cavity: `$f_{mnp} = \frac v2\sqrt{(m/a)^2 + (n/b)^2 + (p/d)^2}$`; `$Q \sim V/S\delta$`.
- Fibre: NA `$= \sqrt{n_1^2 - n_2^2}$`, single-mode for `$V < 2.405$`, about `$V^2/2$` modes, intermodal spread `$\frac{Ln_1}{c}(\frac{n_1}{n_2} - 1)$`.

</div>

## Practise: exam questions on this lesson

From warm-up to top-rank level, with full solutions. More on the [practice page](/learn/courses/gate-physics/practice/waveguides/).

<div class="qbank" data-bank="physics" data-topics="waveguides" data-exam="gate" data-n="10"></div>

**Before this:** [lesson 3.7, the Fresnel equations](/learn/courses/gate-physics/fresnel-equations/). **Next:** [lesson 3.9, radiation](/learn/courses/gate-physics/radiation/), where waves are launched rather than guided. Back to the [GATE Physics course home](/learn/courses/gate-physics/).

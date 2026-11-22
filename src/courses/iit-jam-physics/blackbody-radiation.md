---
title: 'Blackbody radiation: Planck, Wien and Stefan-Boltzmann'
seoTitle: Blackbody radiation for IIT JAM Physics
summary: 'Cavity radiation from Kirchhoff to Planck: counting modes, the Rayleigh–Jeans law and its ultraviolet catastrophe, Planck''s law and its limits, Wien''s displacement law (per wavelength and per frequency), the Stefan–Boltzmann law, energy density, radiation pressure and the photon gas, with stars, planets and the cosmic background as worked examples.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: 'The absolute temperature of a blackbody doubles. What happens to the wavelength of peak emission and to the total power per unit area?'
    choices: ['The peak wavelength halves and the power grows 16 times', 'The peak wavelength doubles and the power grows 16 times', 'The peak wavelength halves and the power doubles', 'Both stay the same']
    ans: 0
    why: 'Wien: λmax T = b, so λmax halves. Stefan–Boltzmann: M = σT⁴, so the power grows by 2⁴ = 16.'
  - q: 'Isotropic blackbody radiation has energy density u. What pressure does it exert on the walls of its cavity?'
    choices: ['u/3', 'u', '2u', 'u/4']
    ans: 0
    why: 'For photons E = pc, and averaging over all directions gives P = u/3. (cu/4 is the power per area leaving through a small hole, a different average.)'
  - q: 'Where does the classical Rayleigh–Jeans law agree with Planck''s law?'
    choices: ['At long wavelengths, where hν is much less than kT', 'At short wavelengths, where hν is much more than kT', 'Only at the peak of the spectrum', 'Nowhere']
    ans: 0
    why: 'Planck''s mean energy per mode hν/(e^(hν/kT) − 1) tends to the classical kT when hν ≪ kT. At short wavelengths Rayleigh–Jeans grows without limit: the ultraviolet catastrophe.'
sources:
  - 'R. Eisberg and R. Resnick, Quantum Physics of Atoms, Molecules, Solids, Nuclei and Particles, 2nd ed. (Wiley, 1985), chapter 1'
  - 'F. Reif, Fundamentals of Statistical and Thermal Physics (McGraw-Hill, 1965; reissued 2009), section 9.13'
  - 'S. J. Blundell and K. M. Blundell, Concepts in Thermal Physics, 2nd ed. (Oxford, 2010), chapter 23'
  - 'IIT JAM Physics syllabus (Kinetic theory and thermodynamics section), published by the organising IIT each year'
---

**Module 5 · about 45 minutes.** By the end you will be able to explain what a blackbody is and why its spectrum is universal, count the modes of a cavity, derive the Rayleigh–Jeans law and see why it fails, use Planck's law and its two limits, apply Wien's and Stefan's laws to stars, planets and furnaces without the usual slips, and treat blackbody radiation as a gas with energy density, pressure and entropy.

<div class="bigidea">The light inside a hot cavity depends on its temperature and nothing else. Classical physics predicts infinite energy; Planck's idea that light energy comes in lumps hν gives the right spectrum, and with it the T⁴ law and Wien's law.</div>

## 1. What a blackbody is, and why it is universal

Every object glows: its charges jiggle with the thermal motion and radiate. A **blackbody** absorbs every bit of radiation that falls on it, at every wavelength. The best real example is a small hole in the wall of a closed oven: light that enters bounces around inside and is almost never reflected back out. The light coming *out* of the hole is the radiation in equilibrium with the walls.

**Kirchhoff's law** says that in thermal equilibrium a body's emissivity equals its absorptivity at each wavelength, `$\varepsilon(\lambda) = \alpha(\lambda)$`. If a body absorbed more than it emitted at some wavelength, two bodies at the same temperature could exchange heat on their own, breaking the second law. Two consequences:

- good absorbers are good emitters (a blackbody is the best emitter at every wavelength; polished silver is a poor one, which is why vacuum flasks are silvered);
- the radiation in a cavity cannot depend on the wall material, only on `$T$`. So its spectrum `$u(\nu, T)$` is a universal function, and finding it was one of the big problems of 1900.

For the astronomer's side of the story (star colours, the H-R diagram and spectra of real stars) see the astronomy course lesson on [blackbody radiation and star colour](/learn/courses/astronomy/blackbody-radiation/). Here we do the physics that JAM asks about.

## 2. Counting modes and the Rayleigh–Jeans law

Inside a cubical cavity of side `$a$`, the field must form standing waves. Allowed wave vectors are `$\vec k = (\pi/a)(n_x, n_y, n_z)$` with positive integers. Each allowed `$\vec k$` occupies a volume `$(\pi/a)^3$` of `$k$`-space. Counting the points in one octant of a shell of radius `$k$` and thickness `$dk$`, and doubling for the two polarisations of light:

```math
N(k)\,dk = 2\times\frac{1}{8}\times\frac{4\pi k^2\,dk}{(\pi/a)^3} \quad\Rightarrow\quad \frac{N(\nu)\,d\nu}{V} = \frac{8\pi\nu^2}{c^3}\,d\nu
```

using `$k = 2\pi\nu/c$`. The number of modes per unit frequency grows as `$\nu^2$`: there are many more ways to fit short waves into a box.

Classical physics gives each mode (a harmonic oscillator) an average energy `$kT$` (equipartition: `$\tfrac12kT$` each for its electric and magnetic energy). Multiply:

```math
u_{\rm RJ}(\nu) = \frac{8\pi\nu^2}{c^3}\,kT
```

This is the **Rayleigh–Jeans law**. It fits measured spectra well at long wavelengths, but it keeps growing as `$\nu^2$`, so the total energy `$\int u\,d\nu$` is infinite. Ehrenfest called this the **ultraviolet catastrophe**. A real oven does not hold infinite energy, so something in the classical picture must be wrong.

## 3. Planck's law

Planck (1900) found the formula that fits, and then the assumption behind it: a mode of frequency `$\nu$` can hold energy only in whole lumps, `$E_n = nh\nu$`. With Boltzmann weights `$e^{-E_n/kT}$`, the average energy of the mode is

```math
\bar E = \frac{\sum_n nh\nu\,e^{-nx}}{\sum_n e^{-nx}} = \frac{h\nu}{e^{h\nu/kT} - 1}, \qquad x = \frac{h\nu}{kT}
```

For low frequencies (`$x \ll 1$`) this is `$kT$`, as classically. For high frequencies the mode would need a lump much bigger than `$kT$` and is almost never excited: the catastrophe disappears. Multiplying by the mode density:

```math
u(\nu, T) = \frac{8\pi h\nu^3}{c^3}\,\frac{1}{e^{h\nu/kT} - 1}
```

Per unit wavelength (use `$u_\lambda\,|d\lambda| = u_\nu\,|d\nu|$` with `$|d\nu/d\lambda| = c/\lambda^2$`):

```math
u(\lambda, T) = \frac{8\pi hc}{\lambda^5}\,\frac{1}{e^{hc/\lambda kT} - 1}
```

<div class="meaning">

<dl>
<dt>8πν²/c³</dt><dd>number of standing-wave modes per unit volume per unit frequency, including two polarisations</dd>
<dt>hν/(e^(hν/kT) − 1)</dt><dd>average energy per mode when energy comes in lumps hν (Planck); tends to kT when hν ≪ kT</dd>
<dt>u(ν, T)</dt><dd>energy per unit volume per unit frequency inside the cavity</dd>
<dt>Limits</dt><dd>hν ≪ kT: Rayleigh–Jeans, 8πν²kT/c³ (no h). hν ≫ kT: Wien's tail, (8πhν³/c³)e^(−hν/kT)</dd>
<dt>Physical meaning</dt><dd>Short-wavelength modes are frozen out because the thermal energy kT cannot pay for even one quantum. Quantum theory began here.</dd>
</dl>

</div>

<figure class="fig" data-fig="planck-curves"><figcaption>Planck's law per unit wavelength (solid) against the classical Rayleigh–Jeans law at the same temperature (dashed). They agree on the right (long wavelengths) and part company long before the peak. Raise the temperature: the peak slides towards the blue and the area grows as T⁴. Switch the height to "Sun = 1" to see how steeply brightness rises.</figcaption></figure>

**Worked example.** For a mode with `$h\nu = kT$`, Planck gives `$\bar E = kT/(e - 1) = 0.58kT$`, already well below the classical `$kT$`. At `$h\nu = 5kT$` it is `$5kT/(e^5 - 1) = 0.034kT$`.

## 4. Wien's displacement law

Set `$du_\lambda/d\lambda = 0$`. With `$x = hc/(\lambda kT)$` this gives `$x = 5(1 - e^{-x})$`, whose root is `$x = 4.965$`. So

```math
\lambda_{\max}T = \frac{hc}{4.965\,k} = b = 2.898\times10^{-3}\ \text{m K}
```

**Worked examples.** The Sun (5800 K) peaks at `$2.898\times10^{-3}/5800 = 500$` nm, in the green. You (310 K) peak at 9.3 μm, which is why thermal cameras look at 8 to 14 μm. The cosmic microwave background (2.725 K) peaks at 1.06 mm. A star peaking at 290 nm is at about 10 000 K.

<div class="problem" data-problem="wien-star"></div>

Maximising `$u_\nu$` instead gives `$h\nu_{\max} = 2.821kT$`. The two peaks do **not** correspond: `$c/\lambda_{\max} = 1.76\,\nu_{\max}$`. For the Sun, `$\nu_{\max} = 3.4\times10^{14}$` Hz, a wavelength of 880 nm, not 500 nm. Where a curve peaks depends on whether you count energy per nanometre or per hertz; only the total is the same.

## 5. Stefan–Boltzmann: total energy and power

Integrate Planck's law over all frequencies, using `$\int_0^\infty x^3/(e^x - 1)\,dx = \pi^4/15$`:

```math
u = aT^4, \quad a = \frac{8\pi^5k^4}{15h^3c^3} = 7.566\times10^{-16}\ \text{J m}^{-3}\text{K}^{-4}
```

The power per unit area leaving a blackbody surface (or a hole in a cavity) is `$\tfrac14$` of `$c$` times the energy density, the same `$\tfrac14 n\bar v$` that gives the effusion rate of a gas:

```math
M = \frac{c}{4}u = \sigma T^4, \qquad \sigma = \frac{2\pi^5k^4}{15c^2h^3} = 5.67\times10^{-8}\ \text{W m}^{-2}\text{K}^{-4}
```

A real body with emissivity `$\varepsilon$` emits `$\varepsilon\sigma T^4$`. A body at `$T$` in surroundings at `$T_0$` loses net power `$\varepsilon\sigma A(T^4 - T_0^4)$`; for small differences that is `$4\varepsilon\sigma AT^3\Delta T$`, Newton's law of cooling.

**Worked example (the Sun's temperature from the solar constant).** Sunlight brings `$S = 1361$` W/m² at `$d = 1.496\times10^{11}$` m. The Sun's power `$4\pi R^2\sigma T^4$` spreads over `$4\pi d^2$`, so `$S = \sigma T^4(R/d)^2$` and

```math
T = \left[\frac{S}{\sigma}\left(\frac{d}{R}\right)^2\right]^{1/4} = \left[\frac{1361\times214.9^2}{5.67\times10^{-8}}\right]^{1/4} = 5772\ \text{K}
```

**Worked example (a planet's temperature).** A fast-rotating black planet absorbs on its disc `$\pi r^2$` and radiates from its whole surface `$4\pi r^2$`: `$\sigma T_s^4(R_s/d)^2\pi r^2 = 4\pi r^2\sigma T^4$`, so `$T = T_s\sqrt{R_s/2d} = 278$` K at the Earth's distance. With 30% of the light reflected (albedo 0.3), multiply by `$0.7^{1/4}$`: 255 K. The real average, 288 K, is 33 K warmer because of the greenhouse effect. Mind the geometry: a flat plate facing the Sun and radiating from one face reaches 394 K.

<div class="problem" data-problem="star-luminosity"></div>

## 6. Radiation as a gas: pressure, photons and entropy

A photon has momentum `$p = E/c$`. Averaging over all directions (as in kinetic theory) gives the pressure of isotropic radiation:

```math
P = \frac{u}{3} = \frac{aT^4}{3}
```

(A parallel beam of intensity `$I$` pushes with `$I/c$` on an absorber and `$2I/c$` on a mirror, as in [the photons lesson](/learn/courses/iit-jam-physics/photons/).)

Thermodynamics then gives the rest. With `$U = aT^4V$` and `$P = U/3V$`:

- entropy `$S = \tfrac43aT^3V$`; in a reversible adiabatic change `$VT^3$` and `$PV^{4/3}$` stay constant (`$\gamma = 4/3$`);
- photon number density `$n = 2.03\times10^7\,T^3$` m⁻³ and mean photon energy `$u/n = 2.70kT$`;
- in an isothermal expansion the walls create new photons (`$n$` is fixed by `$T$`); in an adiabatic one the photon number `$nV \propto T^3V$` stays fixed.

**Worked example (the cosmic background).** As the universe expands, the background radiation expands adiabatically, so `$T \propto 1/(\text{scale factor})$`. Released when the universe was 1100 times smaller and about 3000 K, it is now 2.725 K, with about 411 photons in every cubic centimetre. The [cosmology course](/learn/courses/cosmology/) tells that story.

**Worked example (radiation pressure in stars).** Radiation pressure equals the gas pressure `$nkT$` when `$aT^4/3 = nkT$`. For `$n = 10^{30}$` m⁻³ that is `$T = (3nk/a)^{1/3} = 3.8\times10^7$` K. Radiation pressure grows as `$T^4$` and gas pressure as `$T$`, so it dominates in the hottest, most massive stars.

<div class="myth">

**"The Sun's spectrum peaks at 500 nm, so its photons are most common at 500 nm."** The peak depends on how you plot. Per unit frequency it peaks near 880 nm; counted as photons per unit wavelength it peaks elsewhere again. Use `$\lambda_{\max}T = 2.898$` mm K only for the per-wavelength curve.

**"A white surface is a poor emitter."** Only in visible light. Snow and white paint absorb strongly near 10 μm, so they radiate almost like blackbodies at room temperature. Emissivity depends on wavelength, and Kirchhoff's law holds wavelength by wavelength.

</div>

To put real numbers in (any temperature, any band, luminosity from radius), use fibub's [blackbody calculator](/science/blackbody-calculator/).

<div class="keypoints">

- Kirchhoff: `$\varepsilon(\lambda) = \alpha(\lambda)$` in equilibrium; cavity radiation depends on `$T$` only.
- Modes: `$8\pi\nu^2/c^3$` per unit volume per unit frequency. Rayleigh–Jeans `$u = 8\pi\nu^2kT/c^3$` fails at high `$\nu$` (ultraviolet catastrophe).
- Planck: `$u(\nu) = \dfrac{8\pi h\nu^3}{c^3}\dfrac{1}{e^{h\nu/kT} - 1}$`; mean energy per mode `$h\nu/(e^{h\nu/kT} - 1)$`.
- Wien: `$\lambda_{\max}T = 2.898\times10^{-3}$` m K (from `$x = 4.965$`); per frequency `$h\nu_{\max} = 2.821kT$`; the peaks do not correspond.
- `$u = aT^4$`, `$M = cu/4 = \sigma T^4$`, `$\sigma = 5.67\times10^{-8}$` W m⁻² K⁻⁴; net loss `$\varepsilon\sigma A(T^4 - T_0^4)$`.
- Radiation pressure `$u/3$` (isotropic); `$I/c$` or `$2I/c$` for a beam. Adiabatic: `$VT^3$` constant, `$\gamma = 4/3$`. `$n \propto T^3$`, mean photon energy `$2.70kT$`.
- Planet: `$T = T_s\sqrt{R_s/2d}\,(1 - A)^{1/4}$`; star: `$L = 4\pi R^2\sigma T^4$`.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. Check each answer, then read the full solution. More on the [blackbody radiation practice page](/learn/courses/iit-jam-physics/practice/blackbody-radiation/).

<div class="qbank" data-bank="physics" data-topics="blackbody-radiation" data-exam="jam" data-n="10"></div>

**Before this:** [lesson 5.5, phase changes](/learn/courses/iit-jam-physics/phase-changes/). **Next:** module 6 begins with [photons](/learn/courses/iit-jam-physics/photons/), where Einstein takes Planck's lumps literally. Going on to GATE or CSIR NET? The GATE Physics course derives [Planck's law again](/learn/courses/gate-physics/photon-phonon-gases/) from [Bose–Einstein statistics](/learn/courses/gate-physics/quantum-statistics/).

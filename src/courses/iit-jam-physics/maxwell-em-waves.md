---
title: Maxwell's equations and electromagnetic waves
seoTitle: Maxwell's equations and EM waves for IIT JAM Physics
summary: 'The displacement current and the four Maxwell equations, charge conservation, the wave equation and the speed of light, plane waves and their directions, energy density, the Poynting vector, intensity, momentum and radiation pressure, waves in dielectrics and conductors, and reflection at normal incidence and at Brewster''s angle.'
minutes: 50
updated: 2026-11-22
quiz:
  - q: A capacitor is charging. Is there a magnetic field around the gap between its plates?
    choices: ['Yes, the same as around the wires', 'No, because no charge crosses the gap', 'Only if the plates are magnetic', 'Only after the capacitor is fully charged']
    ans: 0
    why: The growing electric field in the gap is a displacement current equal to the current in the wires, and it makes the same magnetic field. Without it Ampère's law would give two answers.
  - q: A plane wave has E = E0 sin(kz − ωt) along x. Along which direction does B point (when E is along +x)?
    choices: ['+y', '−y', '+z', '+x']
    ans: 0
    why: The wave travels along +z, and E × B must point along the travel. x̂ × ŷ = ẑ, so B is along +y, in phase with E.
  - q: Light of intensity I falls normally on a perfect mirror. What is the radiation pressure?
    choices: ['2I/c', 'I/c', 'I/(2c)', 'Ic']
    ans: 0
    why: Light carries momentum I/c per unit area per second. A mirror reverses it, so the change, and the pressure, is 2I/c. An absorber gets I/c.
sources:
  - 'D. J. Griffiths, Introduction to Electrodynamics, 4th ed. (2017), chapters 7.3, 8 and 9'
  - 'E. M. Purcell and D. J. Morin, Electricity and Magnetism, 3rd ed. (2013), chapter 9'
  - 'E. Hecht, Optics, 5th ed. (2017), chapters 3 and 4 (energy, momentum and Fresnel equations)'
  - 'IIT JAM Physics syllabus (Electricity and Magnetism section), published by the organising IIT each year'
---

**Module 4 · about 50 minutes.** By the end you will be able to explain why Maxwell needed the displacement current, write the four equations in vacuum and in matter, derive the wave equation, handle the directions and amplitudes of plane waves, compute intensity, energy flow, momentum and radiation pressure, and find how much light a surface reflects.

<div class="bigidea">A changing magnetic field makes an electric field, and Maxwell saw that a changing electric field must make a magnetic field; together they can keep each other going through empty space, as a wave that travels at exactly the speed of light.</div>

## 1. The missing term

Ampère's law, `$\nabla\times\vec B = \mu_0\vec J$`, has a hidden flaw. The divergence of a curl is always zero, so it demands `$\nabla\cdot\vec J = 0$`: current can never pile up anywhere. But while a capacitor charges, charge piles up on its plates.

Look at it with a loop round the wire. A flat surface bounded by the loop is crossed by the current `$I$`, but a balloon-shaped surface bounded by the same loop and passing between the plates is crossed by none. Same loop, two answers. Maxwell's fix was to add a term:

```math
\nabla\times\vec B = \mu_0\vec J + \mu_0\epsilon_0\frac{\partial\vec E}{\partial t}
```

`$\epsilon_0\,\partial\vec E/\partial t$` is the **displacement current density**. Between the plates, `$E = Q/\epsilon_0A$`, so `$\epsilon_0A\,dE/dt = dQ/dt = I$`: exactly the wire's current, and the balloon surface now gets the same answer. Taking the divergence of the new law and using Gauss's law gives `$\nabla\cdot\vec J + \partial\rho/\partial t = 0$`, charge conservation, built in.

**Worked example.** Circular plates of radius 5.0 cm with `$dE/dt = 2.0\times10^{12}$` V m⁻¹ s⁻¹: the Ampère-Maxwell law on a circle of radius `$r < R$` gives `$B = \dfrac{\mu_0\epsilon_0r}{2}\dfrac{dE}{dt}$`, so at the rim `$B = \dfrac{0.05\times2\times10^{12}}{2c^2} = 0.56\ \mu$`T. Inside it grows as `$r$`; outside it falls as `$1/r$`, just as round a thick wire.

## 2. Maxwell's equations

| | Differential form | What it says |
|---|---|---|
| Gauss | `$\nabla\cdot\vec E = \rho/\epsilon_0$` | charges are sources of `$\vec E$` |
| No monopoles | `$\nabla\cdot\vec B = 0$` | `$\vec B$` lines never start or end |
| Faraday | `$\nabla\times\vec E = -\partial\vec B/\partial t$` | changing `$\vec B$` makes circulating `$\vec E$` |
| Ampère-Maxwell | `$\nabla\times\vec B = \mu_0\vec J + \mu_0\epsilon_0\,\partial\vec E/\partial t$` | currents and changing `$\vec E$` make circulating `$\vec B$` |

In matter, written with free sources only: `$\nabla\cdot\vec D = \rho_f$` and `$\nabla\times\vec H = \vec J_f + \partial\vec D/\partial t$`, while the other two are unchanged (see [dielectrics](/learn/courses/iit-jam-physics/dielectrics/) and [magnetic materials](/learn/courses/iit-jam-physics/magnetic-materials/)). Add the Lorentz force `$\vec F = q(\vec E + \vec v\times\vec B)$` and that is all of classical electromagnetism.

<div class="myth">

**"Displacement current is charge moving across the gap."** Nothing crosses the gap. The term is a changing electric field. It earned the name "current" because it enters Ampère's law exactly as `$\vec J$` does and makes magnetic field exactly as a current would.

</div>

## 3. Electromagnetic waves

In empty space (`$\rho = 0$`, `$\vec J = 0$`), take the curl of Faraday's law and use the other equations:

```math
\nabla^2\vec E = \mu_0\epsilon_0\frac{\partial^2\vec E}{\partial t^2}, \qquad c = \frac{1}{\sqrt{\mu_0\epsilon_0}} = 3.00\times10^8\ \text{m/s}
```

and the same for `$\vec B$`. Maxwell computed this speed from electrical measurements, found it equal to the speed of light, and concluded that light is an electromagnetic wave. It contains no frequency, so in vacuum all colours, radio waves and X-rays travel at the same speed.

**A plane wave.** `$\vec E = E_0\cos(kz - \omega t)\,\hat x$`, `$\vec B = B_0\cos(kz - \omega t)\,\hat y$` with `$\omega = ck$`. The four equations force:

- both fields are **transverse** (perpendicular to the travel direction);
- `$\vec E\perp\vec B$`, and **`$\vec E\times\vec B$` points along the travel**;
- they are **in phase**, with `$B_0 = E_0/c$`.

Reading the direction: `$\cos(kz - \omega t)$` travels along `$+z$`, `$\cos(kz + \omega t)$` along `$-z$`. Then get `$\vec B$` from `$\hat B = \hat k\times\hat E$`. Example: `$\vec B = B_0\cos(kx + \omega t)\hat z$` travels along `$-x$`, so `$\vec E = -cB_0\cos(kx + \omega t)\hat y$`.

**Polarisation** is the direction of `$\vec E$`. Equal `$x$` and `$y$` components in phase: linear at `$45^\circ$`. Equal components `$90^\circ$` apart: circular, `$\vec E$` turning at constant length. Unequal: elliptical. ([Lesson 3.9](/learn/courses/iit-jam-physics/polarisation/) covers polarisers and wave plates.)

<figure class="fig" data-fig="em-wave"><figcaption>A plane wave travelling to the right: E (vertical) and B (at right angles) oscillate together, and the Poynting vector S points forward, pulsing at twice the frequency. With circular polarisation E turns at constant length and S is steady.</figcaption></figure>

## 4. Energy, intensity and the Poynting vector

The energy density is `$u = \tfrac12\epsilon_0E^2 + \dfrac{B^2}{2\mu_0}$`. In a wave the two halves are **equal** (`$B = E/c$` and `$c^2 = 1/\mu_0\epsilon_0$`), so `$u = \epsilon_0E^2$`. The energy flow per unit area is the **Poynting vector**

```math
\vec S = \frac{1}{\mu_0}\vec E\times\vec B, \qquad I = \langle S\rangle = \tfrac12c\epsilon_0E_0^2 = \frac{E_0^2}{2\mu_0c}
```

and Poynting's theorem, `$\nabla\cdot\vec S + \partial u/\partial t = -\vec J\cdot\vec E$`, is energy conservation for fields. The ratio `$E/H = \sqrt{\mu_0/\epsilon_0} \approx 377\ \Omega$` is the impedance of free space.

<div class="meaning">

<dl>
<dt>c = 1/√(μ₀ε₀)</dt><dd>how fast a disturbance in E and B spreads, set by the two constants of electricity and magnetism</dd>
<dt>B₀ = E₀/c</dt><dd>in a wave the magnetic field is "small" in tesla, yet carries exactly half the energy</dd>
<dt>S = E × B/μ₀</dt><dd>the energy crossing each square metre per second, and its direction</dd>
<dt>I = ½cε₀E₀²</dt><dd>the average of S: what a light meter or a solar panel measures</dd>
<dt>Physical meaning</dt><dd>Light is energy carried by fields that regenerate each other: a falling B makes E, a changing E makes B, and the pair move forward together at c with nothing else needed.</dd>
</dl>

</div>

**Worked example.** A 1.0 mW laser, beam 1.0 mm across: `$I = \dfrac{10^{-3}}{\pi(5\times10^{-4})^2} = 1270$` W/m², so `$E_0 = \sqrt{2I/c\epsilon_0} = 980$` V/m and `$B_0 = 3.3\ \mu$`T.

<div class="problem" data-problem="laser-field"></div>

**Energy does not flow along wires.** In a resistor carrying `$I$`, `$E$` points along the wire and `$B$` circles it, so `$\vec S$` points radially **into** the wire; over its surface `$S\cdot2\pi aL = I^2R$`, exactly the heating. Charging a capacitor, `$\vec S$` points inward through the open edge of the gap, and its flux equals the rate of growth of `$\tfrac12\epsilon_0E^2$` inside. The energy travels through the space around the conductors.

## 5. Momentum and radiation pressure

Electromagnetic waves carry momentum `$p = U/c$`. On a surface at normal incidence:

```math
P_{\text{absorb}} = \frac Ic, \qquad P_{\text{reflect}} = \frac{2I}{c}
```

At angle `$\theta$` to the normal on a mirror, `$P = \dfrac{2I\cos^2\theta}{c}$` (one `$\cos\theta$` because the beam spreads over more area, one because only the normal momentum reverses). Sunlight at Earth, 1360 W/m², pushes a 1 m² mirror with 9.1 µN: tiny, but enough to steer solar sails and to shape comet tails.

## 6. Waves in matter

**Dielectrics.** In a linear medium `$v = 1/\sqrt{\mu\epsilon} = c/n$` with `$n = \sqrt{\epsilon_r\mu_r} \approx \sqrt{\epsilon_r}$`. The frequency stays fixed at a boundary; the wavelength becomes `$\lambda_0/n$` (600 nm light is 451 nm in water).

**Reflection at normal incidence.**

```math
R = \left(\frac{n_1 - n_2}{n_1 + n_2}\right)^2, \qquad T = 1 - R
```

Air to glass (`$n = 1.5$`): 4% reflected per surface. Air to diamond (2.4): 17%. A thick glass plate with both surfaces (no interference) passes `$(1 - R)/(1 + R) = 92.3\%$`. At oblique incidence the light polarised in the plane of incidence is not reflected at all at **Brewster's angle**, `$\tan\theta_B = n_2/n_1$` (`$56.3^\circ$` for glass), while the other polarisation still reflects about 15%.

**Conductors.** In a medium with conductivity `$\sigma$`, conduction and displacement currents compare as `$\sigma/(\omega\epsilon)$`. When this is large (a good conductor) the wave dies within the **skin depth**

```math
\delta = \sqrt{\frac{2}{\omega\mu_0\sigma}}
```

and `$\vec B$` lags `$\vec E$` by `$45^\circ$`, with the wave mostly magnetic. Copper at 1 MHz: `$\delta = 66\ \mu$`m. Sea water at 1 MHz has `$\sigma/\omega\epsilon \approx 900$`, which is why submarines need very low frequencies. The [skin depth calculator](/science/skin-depth-calculator/) gives `$\delta$` for any metal, and the [waveguide mode calculator](/science/waveguide-modes/) shows waves confined between conductors.

**Plasmas.** Free electrons give `$\omega^2 = \omega_p^2 + c^2k^2$` with `$\omega_p = \sqrt{ne^2/\epsilon_0m_e}$`. Below `$\omega_p$` the wave cannot travel and is reflected: the ionosphere (`$f_p \approx 9$` MHz for `$10^{12}$` electrons per m³) bounces shortwave radio but lets FM and satellite signals through.

<div class="keypoints">

- Displacement current `$\epsilon_0\partial\vec E/\partial t$` makes Ampère's law consistent with charge conservation; between capacitor plates it equals the wire current.
- Maxwell: `$\nabla\cdot\vec E = \rho/\epsilon_0$`, `$\nabla\cdot\vec B = 0$`, `$\nabla\times\vec E = -\dot{\vec B}$`, `$\nabla\times\vec B = \mu_0\vec J + \mu_0\epsilon_0\dot{\vec E}$`. In matter use `$\vec D$`, `$\vec H$` with free sources.
- Vacuum waves: `$c = 1/\sqrt{\mu_0\epsilon_0}$`, transverse, `$\vec E\perp\vec B$`, in phase, `$B_0 = E_0/c$`, `$\vec E\times\vec B$` along travel.
- `$u_E = u_B$`; `$\vec S = \vec E\times\vec B/\mu_0$`; `$I = \tfrac12c\epsilon_0E_0^2$`; `$E/H = 377\ \Omega$`.
- Momentum `$U/c$`: pressure `$I/c$` absorbed, `$2I/c$` reflected, `$2I\cos^2\theta/c$` at an angle.
- `$v = c/n$`, `$\lambda = \lambda_0/n$`; `$R = ((n_1 - n_2)/(n_1 + n_2))^2$`; Brewster `$\tan\theta_B = n_2/n_1$`; skin depth `$\sqrt{2/\omega\mu_0\sigma}$`; plasma cut-off `$\omega_p = \sqrt{ne^2/\epsilon_0m_e}$`.

</div>

## Practise: exam questions on this lesson

These start easy and climb to top-rank level. Check each answer, then read the full solution. More on the [Maxwell's equations practice page](/learn/courses/iit-jam-physics/practice/maxwell-em-waves/).

<div class="qbank" data-bank="physics" data-topics="maxwell-em-waves" data-exam="jam" data-n="10"></div>

**Next:** this completes electricity and magnetism. Waves of light meeting slits are in [interference](/learn/courses/iit-jam-physics/interference/) and [diffraction](/learn/courses/iit-jam-physics/diffraction/); light as particles is in [photons](/learn/courses/iit-jam-physics/photons/). The induced electric field that started it all is in [electromagnetic induction](/learn/courses/iit-jam-physics/induction/). For potentials, gauges, radiation from accelerating charges and relativity at MSc level, see the [GATE Physics course](/learn/courses/gate-physics/).

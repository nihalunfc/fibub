---
title: Radiation from dipoles and accelerated charges
seoTitle: Dipole radiation and the Larmor formula | GATE Physics
summary: 'Retarded potentials and the radiation zone, the oscillating electric dipole (fields, sin²θ pattern, total power), magnetic dipole radiation, the Larmor formula and its relativistic Liénard form, antennas (radiation resistance, directivity, two-element arrays), Thomson and Rayleigh scattering, radiation reaction, cyclotron and synchrotron radiation and the classical atom.'
minutes: 60
updated: 2026-11-22
quiz:
  - q: An oscillating dipole keeps its amplitude while its frequency triples. By what factor does its radiated power change?
    choices: ['81', '9', '27', '3']
    ans: 0
    why: "Dipole power goes as p₀²ω⁴, so tripling ω multiplies it by 3⁴ = 81."
  - q: Why does the power radiated through a large sphere not depend on the sphere's radius?
    choices: ['The radiation fields fall as 1/r, so the intensity falls as 1/r² while the area grows as r²', 'Because the fields are static', 'Because the intensity is the same everywhere', 'It does depend on the radius']
    ans: 0
    why: "Only the 1/r part of the field carries energy to infinity; it gives an intensity ∝ 1/r², exactly compensating the r² growth of the sphere's area. That constant flux is what radiation means."
  - q: For a fixed acceleration, why do electrons in a ring radiate so much more at high energy?
    choices: ['For acceleration perpendicular to the velocity the power grows as γ⁴', 'Because their charge grows with speed', 'Because the ring is smaller', 'They do not: the Larmor formula has no speed in it']
    ans: 0
    why: "Liénard's formula gives P ∝ γ⁴a² for circular motion (γ⁶a² for linear). At GeV energies γ is thousands, so γ⁴ is around 10¹⁵."
sources:
  - 'D. J. Griffiths, Introduction to Electrodynamics, 4th ed. (2017), chapters 10 and 11'
  - 'J. D. Jackson, Classical Electrodynamics, 3rd ed. (1999), chapters 9, 14 and 16'
  - 'C. A. Balanis, Antenna Theory, 4th ed. (2016), chapter 4'
  - 'A. Hofmann, The Physics of Synchrotron Radiation (2004), chapter 1'
  - 'GATE Physics (PH) syllabus, Electromagnetic Theory section, published by the organising institute each year'
---

**Module 3 · about 60 minutes.** By the end you will be able to explain which part of a field carries energy away, derive and use the dipole radiation fields and power, apply the Larmor and Liénard formulas, compute radiation resistance and directivity of simple antennas, find Thomson and Rayleigh cross-sections, estimate synchrotron and cyclotron losses, and see why the classical atom collapses. Lesson [3.8](/learn/courses/gate-physics/waveguides/) guided waves; here we launch them.

<div class="bigidea">Only accelerated charges radiate. Their fields carry a part that falls as 1/r and points across the line of sight, and its strength is set by the acceleration seen at the retarded time. Everything in this lesson, from antennas to the blue sky to synchrotrons, is that one fact with different accelerations.</div>

## 1. Retarded fields and the radiation zone

In the Lorenz gauge the potentials are sums over sources evaluated at the **retarded time** `$t_r = t - |\vec r - \vec r'|/c$`:

```math
\phi(\vec r, t) = \frac{1}{4\pi\epsilon_0}\int\frac{\rho(\vec r', t_r)}{|\vec r - \vec r'|}d^3r', \qquad \vec A(\vec r, t) = \frac{\mu_0}{4\pi}\int\frac{\vec J(\vec r', t_r)}{|\vec r - \vec r'|}d^3r'
```

For a source of size `$d$` oscillating at `$\omega$`, three length scales matter: `$d$`, the wavelength `$\lambda$` and the distance `$r$`. The **dipole approximation** needs `$d \ll \lambda$`; the **radiation zone** is `$r \gg \lambda$`. The fields there have three kinds of terms, in the ratio `$1 : kr : (kr)^2$` for the `$1/r^3$` (quasi-static), `$1/r^2$` (induction) and `$1/r$` (radiation) parts. Only the `$1/r$` part delivers power to infinity: its intensity falls as `$1/r^2$`, so the power through every large sphere is the same. A steady current, or a charge in uniform motion, has no such part.

## 2. The oscillating electric dipole

For `$\vec p(t) = p_0\cos\omega t\,\hat z$`, the radiation fields are

```math
\vec E = -\frac{\mu_0p_0\omega^2}{4\pi}\frac{\sin\theta}{r}\cos[\omega(t - r/c)]\,\hat\theta, \qquad \vec B = \frac{E}{c}\,\hat\phi
```

transverse, in phase, with `$E = cB$`. Averaging the Poynting vector over a cycle:

```math
\langle S\rangle = \frac{\mu_0p_0^2\omega^4}{32\pi^2c}\frac{\sin^2\theta}{r^2}, \qquad \langle P\rangle = \frac{\mu_0p_0^2\omega^4}{12\pi c}
```

- **No radiation along the axis**, maximum in the equatorial plane (a doughnut).
- **`$\omega^4$`**: double the frequency, sixteen times the power. This is why the sky is blue.
- **Directivity** (peak over average) is 1.5, because `$\int\sin^2\theta\,d\Omega = 8\pi/3$`: `$I(\theta) = \frac{3P}{8\pi r^2}\sin^2\theta$`.

**Worked example.** A dipole with `$p_0 = 1.0\times10^{-11}$` C m at 1.0 GHz: `$\omega^4 = 1.56\times10^{39}$` s⁻⁴, and `$\langle P\rangle = \frac{1.257\times10^{-6}\times10^{-22}\times1.56\times10^{39}}{12\pi\times3\times10^8} = 17$` W.

**Magnetic dipole.** A small loop with moment `$m_0\cos\omega t$` radiates the same pattern with `$\vec E$` and `$c\vec B$` exchanged (polarisation rotated by `$90^\circ$`), and `$\langle P\rangle = \frac{\mu_0m_0^2\omega^4}{12\pi c^3}$`, i.e. the electric result with `$p_0 \to m_0/c$`. For charges moving in a region of size `$a$`, `$m/c \sim (ka)p$`, so magnetic dipole radiation is weaker by `$(ka)^2$`. A rotating dipole (two perpendicular dipoles in quadrature) radiates twice the power of one, circularly polarised along its axis and linearly polarised in its plane.

<figure class="fig" data-fig="dipole-pattern"><figcaption>Polar plots of radiated intensity: short dipole (sin²θ), half-wave dipole, and a charge accelerated along its velocity, whose lobes tip forward as β grows. The readout gives the directivity and the angle of peak emission.</figcaption></figure>

## 3. The Larmor formula and its relativistic form

A point charge with acceleration `$\vec a$` (and `$v \ll c$`) has radiation field

```math
\vec E_{\text{rad}} = \frac{q}{4\pi\epsilon_0c^2r}\,\hat n\times(\hat n\times\vec a), \qquad \frac{dP}{d\Omega} = \frac{q^2a^2}{16\pi^2\epsilon_0c^3}\sin^2\theta, \qquad P = \frac{q^2a^2}{6\pi\epsilon_0c^3}
```

with `$\theta$` measured from `$\vec a$`. The field is minus the part of `$\vec a$` perpendicular to the line of sight, so the radiation is linearly polarised in the plane of `$\hat n$` and `$\vec a$`. The dipole result is the special case `$q\vec a \to \ddot{\vec p}$`.

**Worked example.** An electron with `$a = 10^{18}$` m/s² radiates only `$5.7\times10^{-18}$` W: the `$c^3$` makes single-charge radiation feeble.

At high speed, Liénard's generalisation is

```math
P = \frac{\mu_0q^2\gamma^6}{6\pi c}\left(a^2 - \frac{|\vec v\times\vec a|^2}{c^2}\right)
```

So `$P \propto \gamma^6a^2$` for `$\vec a \parallel \vec v$` and `$\gamma^4a^2$` for `$\vec a \perp \vec v$`. The pattern is swept forward by aberration: for circular motion into a cone of half-angle about `$1/\gamma$`; for linear deceleration (bremsstrahlung) into two lobes tipped forward, `$\frac{dP}{d\Omega} \propto \frac{\sin^2\theta}{(1 - \beta\cos\theta)^5}$`, still zero exactly along `$\vec v$`.

Linear accelerators lose almost nothing: writing the power in terms of the force, the ratio of radiated to gained power is `$\frac{e^2}{6\pi\epsilon_0m^2c^4}\frac{dE}{dx}$`, about `$4\times10^{-14}$` at 10 MeV/m.

## 4. Antennas

An antenna's radiated power, written as `$\frac12I_0^2R_{\text{rad}}$`, defines its **radiation resistance**:

- **Short (Hertzian) dipole** of length `$l$` with uniform current: `$p_0 = I_0l/\omega$`, so `$R_{\text{rad}} = \frac{2\pi}{3}\eta_0\left(\frac l\lambda\right)^2 \approx 790\left(\frac l\lambda\right)^2\ \Omega$`. At `$l = \lambda/20$`, only 2 Ω: short antennas are hard to feed efficiently.
- **Half-wave dipole**: `$R_{\text{rad}} \approx 73\ \Omega$`, directivity 1.64, pattern `$\left[\frac{\cos(\frac\pi2\cos\theta)}{\sin\theta}\right]^2$`.
- **Small loop** (circumference `$C$`): `$R_{\text{rad}} = \frac{\pi}{6}\eta_0\left(\frac C\lambda\right)^4 \approx 197(C/\lambda)^4\ \Omega$`, tiny: good receivers, poor transmitters. `$N$` turns multiply it by `$N^2$`.

**Worked example.** A 1.0 m dipole at 3.0 MHz (`$\lambda = 100$` m) with 10 A amplitude: `$R = 790\times10^{-4} = 0.079\ \Omega$`, and `$P = \frac12\times100\times0.079 = 3.95$` W.

**Arrays.** Two identical antennas a quarter wavelength apart, the far one fed `$90^\circ$` behind: towards the lagging element the path and feed phases cancel and the waves add; the other way they differ by `$180^\circ$` and cancel. The result is a cardioid beam (end-fire). Spacing and phasing steer beams in every radar and 5G array.

<div class="problem" data-problem="rdn-dipole"></div>

## 5. Scattering

A free electron driven by a wave oscillates with `$a = eE_0/m$` and re-radiates. Dividing its power by the incident intensity gives the **Thomson cross-section**, independent of frequency:

```math
\sigma_T = \frac{8\pi}{3}r_e^2 = 6.65\times10^{-29}\ \text{m}^2, \qquad r_e = \frac{e^2}{4\pi\epsilon_0m_ec^2}
```

For unpolarised light `$\frac{d\sigma}{d\Omega} = r_e^2\frac{1 + \cos^2\theta}{2}$`, fully polarised at `$90^\circ$`. Protons scatter `$(m_e/m_p)^2$` less. When `$\hbar\omega \gtrsim m_ec^2$`, recoil matters and Compton scattering takes over.

A **bound** electron driven well below its resonance has an amplitude nearly independent of frequency, so its acceleration, and the scattered power, go as `$\omega^4$`: **Rayleigh scattering**. Blue (450 nm) is scattered `$(700/450)^4 = 5.9$` times more than red (700 nm). A small dielectric sphere of radius `$a$` has `$\sigma = \frac{8\pi}{3}k^4a^6\left(\frac{\epsilon_r - 1}{\epsilon_r + 2}\right)^2$`: the `$a^6$` is why haze thickens so fast as droplets grow.

## 6. Radiation reaction, cyclotron and synchrotron radiation

**Radiation reaction.** Energy balance demands a recoil force, the Abraham-Lorentz force `$m\tau\dot{\vec a}$` with

```math
\tau = \frac{e^2}{6\pi\epsilon_0mc^3} = \frac23\frac{r_e}{c} = 6.3\times10^{-24}\ \text{s}
```

It is negligible unless the motion changes on the scale `$\tau$`, and it has unphysical runaway solutions: a sign that classical point charges fail there. A damped classical oscillator gets a natural linewidth `$\Delta\omega = \omega^2\tau$`, which in wavelength is a constant `$2\pi c\tau = \frac{4\pi}{3}r_e = 1.2\times10^{-14}$` m.

**The classical atom.** An electron circling at the Bohr radius radiates continuously and spirals in. Energy balance gives `$\dot r = -\frac{4r_e^2c}{3r^2}$`, and the collapse time is

```math
t = \frac{a_0^3}{4r_e^2c} = 1.6\times10^{-11}\ \text{s}
```

with a continuous, rising-frequency spectrum. Stable atoms with sharp lines were one of the facts that forced quantum mechanics.

**Cyclotron radiation.** A slow electron in a field `$B$` has `$a = evB/m$`, so `$P \propto v^2 \propto K$`: its energy decays exponentially with `$\tau = \frac{3\pi\epsilon_0m^3c^3}{e^4B^2} = 2.6$` s at 1 T, at any starting energy.

**Synchrotron radiation.** Ultra-relativistic electrons on a circle of radius `$R$` lose per turn

```math
\Delta E = \frac{e^2\gamma^4}{3\epsilon_0R} \approx 88.5\,\frac{E^4[\text{GeV}]}{R[\text{m}]}\ \text{keV}
```

717 keV per turn at 3 GeV and `$R = 10$` m, all of which the RF cavities must replace. The cone of half-angle `$1/\gamma$` sweeps past an observer in a time about `$R/(c\gamma^3)$`, so the spectrum reaches the critical energy `$\hbar\omega_c = \frac32\hbar\gamma^3c/R$`, about 6 keV here: hard X-rays from a beam circling at a few MHz. At equal energy and radius a proton radiates `$(m_e/m_p)^4 \approx 10^{-13}$` as much, which is why the LHC uses protons.

<div class="myth">

**"Any moving charge radiates."** Radiation needs acceleration. A charge moving at constant velocity carries a squashed Coulomb field along with it ([lesson 3.10](/learn/courses/gate-physics/covariant-electrodynamics/)) whose energy flux through a distant sphere vanishes. Conversely, a charge moving at constant speed in a circle does radiate: its velocity changes direction, so it accelerates.

</div>

<div class="meaning">

<dl>
<dt>t_r = t − |r − r'|/c</dt><dd>retarded time: the field now reports what the source did earlier</dd>
<dt>P = q²a²/(6πε₀c³)</dt><dd>Larmor power of a slowly moving charge</dd>
<dt>⟨P⟩ = μ₀p₀²ω⁴/(12πc)</dt><dd>power of an oscillating electric dipole</dd>
<dt>R_rad</dt><dd>radiation resistance: the resistor that would absorb what the antenna radiates</dd>
<dt>σ_T = (8π/3)r_e²</dt><dd>Thomson cross-section: the effective area a free electron presents to light</dd>
<dt>Physical meaning</dt><dd>When a charge accelerates, the news spreads out at c as a kink in its field lines. The kink is transverse and stretches as it travels, so its field falls only as 1/r: that kink is the radiation.</dd>
</dl>

</div>

<div class="keypoints">

- Radiation zone `$r \gg \lambda$`: only the `$1/r$` fields carry power; constant flux through every sphere.
- Electric dipole: `$\langle S\rangle \propto \frac{\sin^2\theta}{r^2}$`, `$\langle P\rangle = \frac{\mu_0p_0^2\omega^4}{12\pi c}$`, directivity 1.5. Magnetic dipole: `$p_0 \to m_0/c$`, weaker by `$(ka)^2$`.
- Larmor `$P = \frac{q^2a^2}{6\pi\epsilon_0c^3}$`, pattern `$\sin^2\theta$` about `$\vec a$`, `$\vec E$` along `$-\vec a_\perp$`. Liénard: `$\gamma^6$` (linear), `$\gamma^4$` (circular); forward beaming within `$1/\gamma$`.
- Antennas: `$R = 790(l/\lambda)^2$` (short), 73 Ω and directivity 1.64 (half-wave), `$197(C/\lambda)^4$` (small loop, times `$N^2$`). Quarter-wave spaced, `$90^\circ$` phased pair beams towards the lagging element.
- Thomson `$\sigma_T = 6.65\times10^{-29}$` m², frequency independent, `$\frac{1 + \cos^2\theta}{2}$`; Rayleigh `$\propto \omega^4$`, sphere `$\propto k^4a^6$`.
- `$\tau = 6.3\times10^{-24}$` s; classical linewidth `$2\pi c\tau$`; atom collapse `$a_0^3/4r_e^2c = 1.6\times10^{-11}$` s.
- Cyclotron decay `$\tau = 3\pi\epsilon_0m^3c^3/e^4B^2$`; synchrotron `$\Delta E = e^2\gamma^4/3\epsilon_0R$`, `$\hbar\omega_c = \frac32\hbar\gamma^3c/R$`, protons `$(m_e/m_p)^4$` less.

</div>

## Practise: exam questions on this lesson

From warm-up to top-rank level, with full solutions. More on the [practice page](/learn/courses/gate-physics/practice/radiation/).

<div class="qbank" data-bank="physics" data-topics="radiation" data-exam="gate" data-n="10"></div>

**Before this:** [lesson 3.8, waveguides](/learn/courses/gate-physics/waveguides/), and the JAM lesson on [Maxwell's equations and electromagnetic waves](/learn/courses/iit-jam-physics/maxwell-em-waves/). **Next:** [lesson 3.10, electrodynamics and relativity](/learn/courses/gate-physics/covariant-electrodynamics/), where the fields of moving charges are found by a Lorentz boost. Back to the [GATE Physics course home](/learn/courses/gate-physics/).

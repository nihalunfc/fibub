---
title: Retarded and Liénard-Wiechert potentials
summary: 'Radiation from moving charges for CSIR NET: retarded time, the Liénard-Wiechert velocity and acceleration fields, the Larmor and Liénard formulas, dipole antennas and radiation resistance, Thomson and Rayleigh scattering, synchrotron beaming and energy loss, and radiation reaction.'
minutes: 50
updated: 2026-11-22
quiz:
  - q: An electron in a linear accelerator and one in a circular ring feel the same force F perpendicular or parallel to v. At large γ, which radiates more?
    choices: ['The linear one, by a factor γ²', 'They radiate the same', 'The circular one, by a factor γ²', 'The circular one, by a factor γ⁴']
    ans: 2
    why: "Liénard gives P ∝ γ⁶(a² − |v×a|²/c²). Along v, F = γ³ma so P ∝ F²; across v, F = γma so P ∝ γ⁶a²/γ² = γ⁴a² ∝ γ²F². Circular machines lose far more."
  - q: How does the Thomson cross-section of a free electron depend on the frequency of the incident light (well below mc²/h)?
    choices: ['It grows as ω⁴', 'It falls as 1/ω²', 'It grows as ω²', 'It does not depend on frequency']
    ans: 3
    why: "A free electron's acceleration is eE₀/m at every frequency, so the radiated power and σ_T = (8π/3)r_e² = 0.665 b do not depend on ω. The ω⁴ law is for bound electrons far below resonance (Rayleigh)."
  - q: The far-field radiation from a charge depends on which property of its motion at the retarded time?
    choices: ['Its acceleration', 'Its position only', 'Its velocity only', 'Its jerk (rate of change of acceleration)']
    ans: 0
    why: "The velocity field falls as 1/R² and carries no net energy to infinity. The acceleration field falls as 1/R, so its Poynting flux through a large sphere is finite: no acceleration, no radiation."
sources:
  - 'D. J. Griffiths, Introduction to Electrodynamics, 4th ed. (2017), sections 10.3 and 11.1 to 11.2'
  - 'J. D. Jackson, Classical Electrodynamics, 3rd ed. (1999), chapters 9, 14 and 16'
  - 'A. Zangwill, Modern Electrodynamics (2013), chapters 20 and 23'
  - 'CSIR-UGC NET Physical Sciences syllabus, Electromagnetic Theory unit, published by the National Testing Agency'
---

**Module 4 · about 50 minutes.** The potentials of a moving charge, and the retarded time that goes with them, are set up in the GATE lesson on [potentials and gauges](/learn/courses/gate-physics/potentials-gauges/). This lesson takes the next step that CSIR NET Part C keeps returning to: the *fields* of a moving charge, the part of them that radiates, how much power leaves, in which directions, and what that does back to the charge. Relativity enters through `$\gamma$`; revise it in [relativistic kinematics](/learn/courses/gate-physics/relativistic-kinematics/) if the factors look unfamiliar.

<div class="bigidea">A charge's field at a point is set by where the charge was, how fast it moved and how it accelerated at the retarded time. The velocity part falls as 1/R² and stays attached to the charge; the acceleration part falls as 1/R and flies off as radiation. Almost every radiation formula (Larmor, Liénard, dipole antennas, Thomson scattering, synchrotron light) is that 1/R field squared and integrated over a sphere.</div>

## 1. Retarded time, once more

A field point at `$\vec r$` at time `$t$` hears from the charge at the earlier time `$t_r$` fixed by

```math
c\,(t - t_r) = |\vec r - \vec w(t_r)| \equiv \mathscr r
```

where `$\vec w(t)$` is the charge's path. For any charge slower than light exactly one `$t_r$` solves this: two would need the charge to keep pace with its own light. Write `$\hat n = \vec{\mathscr r}/\mathscr r$` and `$\vec\beta = \vec v(t_r)/c$`. The factor that appears everywhere is

```math
\kappa = 1 - \hat n\cdot\vec\beta, \qquad \frac{dt}{dt_r} = \kappa
```

The second form says what `$\kappa$` means: a stretch of the charge's history `$dt_r$` long reaches the observer squeezed into `$dt = \kappa\,dt_r$`. For a charge heading straight at you at `$\beta = 0.9$`, `$\kappa = 0.1$`: ten seconds of its life arrive in one. This is the same Doppler compression that turns the gentle dipole pattern of a slow charge into the narrow forward beam of a fast one.

<figure class="fig" data-fig="retarded-time"><figcaption>Light spheres sent out by a moving charge. The sphere that passes through the observer now was emitted from the retarded position. Push β up and the spheres crowd ahead of the charge, so κ = 1 − n̂·β falls and the field ahead grows.</figcaption></figure>

## 2. The Liénard-Wiechert fields

Differentiating the Liénard-Wiechert potentials (the retarded time depends on position, which is where the work lies) gives, with `$\vec u = c\hat n - \vec v$`,

```math
\vec E(\vec r, t) = \frac{q}{4\pi\epsilon_0}\frac{\mathscr r}{(\vec{\mathscr r}\cdot\vec u)^3}\Big[(c^2 - v^2)\,\vec u + \vec{\mathscr r}\times(\vec u\times\vec a)\Big], \qquad \vec B = \frac{1}{c}\,\hat n\times\vec E
```

Everything on the right is taken at `$t_r$`. Two pieces:

- the **velocity field** `$\propto (c^2 - v^2)\vec u$`, which falls as `$1/\mathscr r^2$`. For uniform motion it is the squashed Coulomb field pointing from the *present* position, `$\gamma$` times stronger sideways and `$\gamma^2$` times weaker ahead;
- the **acceleration field** `$\propto \vec{\mathscr r}\times(\vec u\times\vec a)$`, which falls as `$1/\mathscr r$` and is perpendicular to `$\hat n$`. This is the radiation.

For a slow charge (`$v \ll c$`) the acceleration field reduces to

```math
\vec E_{\rm rad} = \frac{q}{4\pi\epsilon_0c^2\mathscr r}\,\hat n\times(\hat n\times\vec a), \qquad |\vec E_{\rm rad}| = \frac{q\,a\sin\theta}{4\pi\epsilon_0c^2\mathscr r}
```

with `$\theta$` measured from `$\vec a$`. A useful picture (J. J. Thomson's): kink a field line by jerking the charge, and the kink travels out at `$c$`; its transverse part grows relative to the radial part in proportion to `$\mathscr r$`, which is why `$E_{\rm rad}/E_{\rm Coulomb} = a\mathscr r\sin\theta/c^2$`.

<div class="meaning">

<dl>
<dt>t<sub>r</sub></dt><dd>retarded time, c(t − t<sub>r</sub>) = distance from the retarded position</dd>
<dt>κ = 1 − n̂·β</dt><dd>compression factor dt/dt<sub>r</sub>; small when the charge moves fast towards the observer</dd>
<dt>Velocity field</dt><dd>the generalised Coulomb field, ∝ 1/R², carries no energy to infinity</dd>
<dt>Acceleration field</dt><dd>the radiation field, ∝ 1/R, transverse, E ⊥ B ⊥ n̂</dd>
<dt>Physical meaning</dt><dd>Energy flux S ∝ E² ∝ 1/R² from the acceleration field, times area 4πR², stays finite as R grows: energy leaves for good. That is what radiation means.</dd>
</dl>

</div>

## 3. How much power: Larmor and Liénard

Square the slow-charge radiation field, divide by `$\mu_0c$` and integrate over a sphere:

```math
\frac{dP}{d\Omega} = \frac{q^2a^2}{16\pi^2\epsilon_0c^3}\sin^2\theta, \qquad P = \frac{q^2a^2}{6\pi\epsilon_0c^3} \quad\text{(Larmor)}
```

No power goes along `$\vec a$`; the most goes at right angles. Larmor's formula is Lorentz invariant once written with four-vectors, and the relativistic version (Liénard) is

```math
P = \frac{q^2\gamma^6}{6\pi\epsilon_0c^3}\left(a^2 - \frac{|\vec v\times\vec a|^2}{c^2}\right)
```

Two special cases do most exam work:

| Motion | Force-acceleration link | Power |
|---|---|---|
| linear (`$\vec a \parallel \vec v$`) | `$F = \gamma^3ma$` | `$P = \dfrac{q^2\gamma^6a^2}{6\pi\epsilon_0c^3} = \dfrac{q^2F^2}{6\pi\epsilon_0m^2c^3}$` |
| circular (`$\vec a \perp \vec v$`) | `$F = \gamma ma$` | `$P = \dfrac{q^2\gamma^4a^2}{6\pi\epsilon_0c^3} = \dfrac{q^2\gamma^2F^2}{6\pi\epsilon_0m^2c^3}$` |

For the same force a circular orbit radiates `$\gamma^2$` times more. And everything scales as `$1/m^2$`: protons radiate `$(1836)^2 \approx 3.4\times10^6$` times less than electrons under the same force, which is why the largest proton machines are circular and the largest electron machines will be linear.

### Worked example: is a linac wasteful?

<div class="steps">
<div class="step"><p><b>Set-up.</b> Electrons gain 10 MeV per metre in a linear accelerator, so F = 10 MeV/m = 1.60 × 10⁻¹² N, at any γ.</p></div>
<div class="step"><p><b>Power radiated.</b> P = e²F²/(6πε₀m²c³) = (2/3) r<sub>e</sub> F²/(mc), with r<sub>e</sub> = e²/4πε₀mc² = 2.818 fm.</p></div>
<div class="step"><p><b>Compare with the energy gain per second,</b> Fc: P/(Fc) = (2/3) r<sub>e</sub> F/(mc²) = (2/3) × 2.818 × 10⁻¹⁵ m × (10 MeV/m)/(0.511 MeV) = 3.7 × 10⁻¹⁴.</p></div>
<div class="step"><p><b>Answer.</b> Radiation loss in a linac is utterly negligible; it would matter only for fields near mc²/r<sub>e</sub> ≈ 2 × 10²⁰ V/m.</p></div>
</div>

### Synchrotron radiation

For a ring of radius `$R$`, `$a = v^2/R$`, and the energy lost per turn is `$P \cdot 2\pi R/v$`:

```math
\Delta E_{\rm turn} = \frac{q^2\beta^3\gamma^4}{3\epsilon_0R}, \qquad \Delta E_{\rm turn}[\text{keV}] \approx 88.5\,\frac{E^4[\text{GeV}]}{R[\text{m}]}\ \ (\text{electrons})
```

A 3 GeV electron ring with a 10 m bending radius loses about 717 keV a turn, supplied by RF cavities. The light comes out in a forward cone of half-angle about `$1/\gamma$` (the `$\kappa^{-5}$` factor in the relativistic angular distribution), so an observer sees a flash lasting about `$R/(c\gamma^3)$` and a spectrum reaching up to the critical frequency `$\omega_c = \tfrac32\gamma^3c/R$`: from a 3 GeV ring with R = 10 m, ħω<sub>c</sub> ≈ 6 keV, X-rays.

<div class="problem" data-problem="larmor-power"></div>

## 4. Dipoles and antennas

An oscillating dipole `$p(t) = p_0\cos\omega t$` is a charge `$q$` with `$a = -\omega^2x$`. Larmor's formula averaged over a cycle gives

```math
\langle P\rangle = \frac{\mu_0p_0^2\omega^4}{12\pi c}, \qquad \frac{d\langle P\rangle}{d\Omega} = \frac{\mu_0p_0^2\omega^4}{32\pi^2c}\sin^2\theta
```

The `$\omega^4$` is the heart of the matter. A short centre-fed antenna of length `$l \ll \lambda$` carrying a uniform current `$I_0\cos\omega t$` has `$p_0\omega = I_0l$`, and defining `$\langle P\rangle = \tfrac12I_0^2R_{\rm rad}$`,

```math
R_{\rm rad} = \frac{2\pi}{3}Z_0\left(\frac{l}{\lambda}\right)^2 \approx 789\left(\frac{l}{\lambda}\right)^2\ \Omega
```

with `$Z_0 = \mu_0c = 376.7\ \Omega$`. A 1 m whip at 15 MHz (`$\lambda = 20$` m) has `$R_{\rm rad} \approx 2$` Ω, so most of the power fed to it is lost as heat in the wire and the matching coil: short antennas are inefficient. (If the current tapers to zero at the ends, as in a real short dipole, `$R_{\rm rad}$` drops by a factor 4.) A half-wave dipole is not short, and its exact resistance is 73 Ω.

The **magnetic dipole** `$m_0\cos\omega t$` radiates `$\langle P\rangle = \mu_0m_0^2\omega^4/12\pi c^3$`, with `$\vec E$` and `$\vec B$` swapped relative to the electric case. For a loop of size `$b$` the ratio to an electric dipole of similar size is `$(\omega b/c)^2$`: small loops are weak radiators.

## 5. Scattering of light by charges

**Free electron (Thomson).** A wave of amplitude `$E_0$` shakes an electron with `$a = eE_0/m$`. Radiated power over incident intensity is

```math
\sigma_T = \frac{8\pi}{3}r_e^2 = 6.652\times10^{-29}\ \text{m}^2 = 0.665\ \text{b}
```

independent of frequency. Unpolarised light scatters with angular weight `$\tfrac12(1 + \cos^2\theta)$`, and at 90° the scattered light is completely polarised.

**Bound electron (Lorentz model).** An electron on a spring of frequency `$\omega_0$` responds with amplitude `$\propto 1/(\omega_0^2 - \omega^2)$`, so

```math
\sigma(\omega) = \sigma_T\frac{\omega^4}{(\omega_0^2 - \omega^2)^2 + \gamma_d^2\omega^2}
```

Far below resonance (`$\omega \ll \omega_0$`) this is **Rayleigh scattering**, `$\sigma \approx \sigma_T(\omega/\omega_0)^4$`: violet light at 400 nm scatters `$(700/400)^4 = 9.4$` times more than red at 700 nm, and the sky is blue. Far above, the electron behaves as free and `$\sigma \to \sigma_T$`.

## 6. Radiation reaction

A radiating charge must lose energy, so something pushes back. Balancing the Larmor power on average gives the Abraham-Lorentz force

```math
\vec F_{\rm rad} = m\tau\,\dot{\vec a}, \qquad \tau = \frac{q^2}{6\pi\epsilon_0mc^3} = \frac{2r_e}{3c} = 6.26\times10^{-24}\ \text{s (electron)}
```

`$\tau$` is the light-crossing time of a classical electron, so radiation reaction matters only on time scales that short or for motion sustained over many cycles. Two consequences:

- **Line width.** A classical oscillator loses energy at the rate `$\Gamma = \omega_0^2\tau$`, so its line has width `$\Delta\lambda = 2\pi c\tau = \tfrac{4\pi}{3}r_e = 1.18\times10^{-14}$` m, the same at every wavelength.
- **The classical atom collapses.** An electron spiralling in from the Bohr radius radiates all the way and reaches the nucleus in `$t = a_0^3/(4r_e^2c) \approx 1.6\times10^{-11}$` s. Classical physics cannot make a stable atom; quantum mechanics does.

The Abraham-Lorentz equation has runaway solutions (`$a \propto e^{t/\tau}$`) and, if they are excluded, pre-acceleration that starts a time `$\tau$` before the force. These signal that a point charge is not a consistent classical object; they never matter at measurable scales.

<div class="myth">

**"Any moving charge radiates."** Only an *accelerated* charge radiates. A charge in uniform motion carries its field along: in its rest frame there is nothing but a Coulomb field, and a Lorentz boost cannot create an energy flux that escapes to infinity. The current in a straight DC wire does not radiate either. What does radiate is any change of velocity, including a change of *direction* at constant speed: a circular orbit radiates at all times.

</div>

<div class="keypoints">

- Retarded time: `$c(t - t_r) = \mathscr r$`; compression factor `$\kappa = 1 - \hat n\cdot\vec\beta = dt/dt_r$`.
- LW fields: velocity part `$\propto 1/\mathscr r^2$`, acceleration part `$\propto 1/\mathscr r$` and transverse; `$\vec B = \hat n\times\vec E/c$`.
- Larmor `$P = q^2a^2/6\pi\epsilon_0c^3$`, pattern `$\sin^2\theta$`. Liénard `$P \propto \gamma^6(a^2 - |\vec v\times\vec a|^2/c^2)$`: linear `$\gamma^6a^2$`, circular `$\gamma^4a^2$`; for equal force circular wins by `$\gamma^2$`; everything `$\propto 1/m^2$`.
- Synchrotron: `$\Delta E_{\rm turn} = q^2\beta^3\gamma^4/3\epsilon_0R$` (88.5 keV `$E^4$`[GeV]/R[m] for electrons), cone `$1/\gamma$`, `$\omega_c = \tfrac32\gamma^3c/R$`.
- Dipole `$\langle P\rangle = \mu_0p_0^2\omega^4/12\pi c$`; short antenna `$R_{\rm rad} = 789(l/\lambda)^2$` Ω; half-wave dipole 73 Ω.
- Thomson `$\sigma_T = \tfrac{8\pi}{3}r_e^2 = 0.665$` b, frequency independent; Rayleigh `$\sigma \propto \omega^4$` below resonance.
- Radiation reaction `$F = m\tau\dot a$`, `$\tau = 6.26\times10^{-24}$` s; classical line width 1.18 × 10⁻¹⁴ m; classical atom lifetime 1.6 × 10⁻¹¹ s.

</div>

## Practise: exam questions on this lesson

NET Part C style, each with a full solution. More on the [CSIR NET Physics practice page](/learn/courses/csir-net-physics/practice/).

<div class="qbank" data-bank="physics" data-topics="retarded-potentials" data-exam="net" data-n="10"></div>

**Next:** [plasma oscillations and dispersion](/learn/courses/csir-net-physics/plasma-dispersion/), where the same shaken electrons act together and turn a medium opaque below a cutoff frequency. For waves in ordinary media see [Maxwell's equations and waves](/learn/courses/iit-jam-physics/maxwell-em-waves/).

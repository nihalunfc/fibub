---
title: Fluctuations, diffusion and Brownian motion
seoTitle: Fluctuations and Brownian motion | CSIR NET Physics
summary: 'Fluctuations for CSIR NET: energy and number fluctuations in the canonical and grand canonical ensembles, random walks and the diffusion equation, the Einstein and Stokes-Einstein relations, the Langevin equation and the fluctuation-dissipation theorem, Johnson, shot and kT/C noise, sedimentation, polymers and optical traps.'
minutes: 50
updated: 2026-11-22
quiz:
  - q: In the canonical ensemble, the mean square energy fluctuation equals what?
    choices: ['k_B T C_V', 'k_B T² C_V', 'k_B² T C_V', '(k_B T)²/C_V']
    ans: 1
    why: "⟨E²⟩ − ⟨E⟩² = ∂²ln Z/∂β² = −∂⟨E⟩/∂β = k_BT²C_V. Because C_V and ⟨E⟩ both grow as N, the relative spread falls as 1/√N."
  - q: A Brownian particle's mean square displacement grows as t² at very short times and as t at long times. What sets the crossover?
    choices: ['The momentum relaxation time m/γ', 'The collision time of the solvent molecules', 'The time to diffuse one radius', 'The thermal de Broglie time ħ/k_BT']
    ans: 0
    why: "The Langevin solution is ⟨x²⟩ = 2D[t − τ(1 − e^(−t/τ))] with τ = m/γ. For t ≪ τ the velocity has not yet been randomised (ballistic, ⟨x²⟩ = k_BT t²/m); for t ≫ τ it is diffusive, 2Dt."
  - q: What links the random force in the Langevin equation to the friction coefficient γ?
    choices: ['Nothing: they are independent inputs', 'The force strength is proportional to √γ, with no temperature', 'The equipartition theorem fixes ⟨F(t)F(t′)⟩ = 2γk_BT δ(t − t′)', 'The force must be zero on average and its strength is set by the particle size']
    ans: 2
    why: "Without the link the particle would not reach ⟨½mv²⟩ = ½k_BT. The same collisions cause both the friction and the kicks: that is the fluctuation-dissipation theorem in its simplest form."
sources:
  - 'F. Reif, Fundamentals of Statistical and Thermal Physics (1965), chapters 1 and 15'
  - 'R. K. Pathria and P. D. Beale, Statistical Mechanics, 3rd ed. (2011), chapter 15'
  - 'A. Einstein, "Über die von der molekularkinetischen Theorie der Wärme geforderte Bewegung von in ruhenden Flüssigkeiten suspendierten Teilchen", Annalen der Physik 17, 549 (1905)'
  - 'H. Nyquist, "Thermal agitation of electric charge in conductors", Physical Review 32, 110 (1928)'
  - 'CSIR-UGC NET Physical Sciences syllabus, Thermodynamic and Statistical Physics unit, published by the National Testing Agency'
---

**Module 6 · about 50 minutes.** Thermodynamics deals in averages, but every average comes with a spread, and the spread carries information. Energy fluctuations measure the heat capacity; number fluctuations measure the compressibility; the jiggling of a pollen grain measured Avogadro's number; and the hiss in an amplifier measures temperature. This lesson covers the fluctuation results NET asks for, then random walks, diffusion and the Langevin equation. The ensembles themselves are in [ensembles](/learn/courses/gate-physics/ensembles/) and [partition functions](/learn/courses/gate-physics/partition-functions/); equipartition, used throughout, is in [the classical gas](/learn/courses/gate-physics/classical-gas-equipartition/).

<div class="bigidea">The same molecular collisions that make a system dissipate (friction, resistance, viscosity) also make it fluctuate. The size of the fluctuation is always k_BT times the response: energy spread from heat capacity, number spread from compressibility, voltage noise from resistance, and diffusion from mobility. That is the fluctuation-dissipation theorem, and it runs through every section below.</div>

## 1. Fluctuations in the ensembles

**Energy (canonical).** With `$Z = \sum e^{-\beta E}$`, `$\langle E\rangle = -\partial_\beta\ln Z$` and

```math
\langle(\Delta E)^2\rangle = \frac{\partial^2\ln Z}{\partial\beta^2} = k_BT^2C_V, \qquad \frac{\Delta E_{\rm rms}}{\langle E\rangle} \sim \frac{1}{\sqrt N}
```

For a monatomic ideal gas, `$\langle E\rangle = \tfrac32Nk_BT$` and `$C_V = \tfrac32Nk_B$`, so `$\Delta E/E = \sqrt{2/3N}$`: for a mole, about `$10^{-12}$`. This is why the canonical and microcanonical ensembles give the same thermodynamics. A positive `$C_V$` is also forced: a variance cannot be negative.

**Particle number (grand canonical).**

```math
\langle(\Delta N)^2\rangle = k_BT\left(\frac{\partial\langle N\rangle}{\partial\mu}\right)_{T,V} = \frac{\langle N\rangle^2k_BT\,\kappa_T}{V}
```

For a classical ideal gas `$\kappa_T = 1/P$`, so `$\langle(\Delta N)^2\rangle = \langle N\rangle$`: Poisson statistics. Quantum gases differ: bosons fluctuate more (`$\langle n\rangle(1 + \langle n\rangle)$` per mode, bunching) and fermions less (`$\langle n\rangle(1 - \langle n\rangle)$`, antibunching). Near a liquid-gas critical point `$\kappa_T \to \infty$`: density fluctuations grow to the wavelength of light and scatter it strongly, the milky **critical opalescence**.

**Einstein's formula.** The probability of a fluctuation away from equilibrium is `$P \propto e^{\Delta S_{\rm tot}/k_B}$`. For a small system in contact with a reservoir it gives, for example, `$\langle(\Delta T)^2\rangle = k_BT^2/C_V$` and `$\langle(\Delta V)^2\rangle = k_BTV\kappa_T$`.

<div class="meaning">

<dl>
<dt>⟨(ΔX)²⟩</dt><dd>variance, ⟨X²⟩ − ⟨X⟩²; its square root is the rms fluctuation</dd>
<dt>D</dt><dd>diffusion coefficient: ⟨x²⟩ = 2Dt along each axis</dd>
<dt>γ</dt><dd>friction coefficient, force per unit velocity; for a sphere in a fluid 6πηa</dd>
<dt>μ</dt><dd>mobility, drift velocity per unit force, 1/γ</dd>
<dt>Physical meaning</dt><dd>Fluctuations are not noise to be averaged away. Their size, k<sub>B</sub>T times a response, is a measurement of the response itself, and Brownian motion was the first direct evidence that atoms exist.</dd>
</dl>

</div>

## 2. Random walks and diffusion

A walker takes `$N$` independent steps of length `$l$`, each left or right with probability ½. The displacement `$x = l\sum s_i$` has

```math
\langle x\rangle = 0, \qquad \langle x^2\rangle = Nl^2, \qquad P(m) = \frac{N!}{\left(\frac{N + m}{2}\right)!\left(\frac{N - m}{2}\right)!}\,2^{-N}
```

for net displacement `$ml$`. The cross terms `$\langle s_is_j\rangle$` vanish for `$i \ne j$`, which is the whole reason for the `$\sqrt N$`. For large `$N$` the binomial becomes a Gaussian, and with steps every `$\tau$`, so `$N = t/\tau$`,

```math
P(x, t) = \frac{1}{\sqrt{4\pi Dt}}e^{-x^2/4Dt}, \qquad \frac{\partial P}{\partial t} = D\frac{\partial^2P}{\partial x^2}, \qquad D = \frac{l^2}{2\tau}
```

In `$d$` dimensions, `$\langle r^2\rangle = 2dDt$`. With unequal step probabilities `$p$` and `$q$`, the mean drifts as `$N(p - q)l$` and the variance is `$4Npql^2$`.

<figure class="fig" data-fig="random-walk"><figcaption>Three hundred walkers take unit steps in random directions. The cloud's rms radius grows as √N (circle), and the measured ⟨r²⟩ follows the line N l². In two dimensions ⟨r²⟩ = 4Dt with D = l²/4τ.</figcaption></figure>

**Einstein relation.** In a weak force `$F$`, particles drift at `$v = \mu F$`. In equilibrium in a potential, the drift current `$n\mu F$` must cancel the diffusion current `$-D\,dn/dx$`, and the density must be Boltzmann, `$n \propto e^{-U/k_BT}$`. Together:

```math
D = \mu k_BT, \qquad D = \frac{k_BT}{6\pi\eta a}\ \ (\text{Stokes-Einstein, sphere of radius } a)
```

For electrons in a semiconductor, `$D/\mu_e = k_BT/e$` (about 26 mV at room temperature). Perrin used Stokes-Einstein in 1908: measure `$\langle x^2\rangle$`, `$\eta$`, `$a$` and `$T$`, and out comes `$k_B$`, hence Avogadro's number.

**Sedimentation.** Spheres of density `$\rho_p$` in a fluid of density `$\rho_f$` settle into `$n(z) \propto e^{-z/h}$` with `$h = k_BT/m_{\rm eff}g$` and `$m_{\rm eff} = \tfrac43\pi a^3(\rho_p - \rho_f)$`. For 0.5 μm radius latex (`$\Delta\rho = 50$` kg/m³) at 300 K, `$h = 16$` μm, easy to see in a microscope.

<div class="problem" data-problem="stokes-einstein-rms"></div>

## 3. The Langevin equation

Newton's law for a particle of mass `$m$` in a fluid, with friction and random kicks:

```math
m\frac{dv}{dt} = -\gamma v + F(t), \qquad \langle F(t)\rangle = 0, \qquad \langle F(t)F(t')\rangle = 2\gamma k_BT\,\delta(t - t')
```

The strength of the random force is not free: it is fixed so that the particle reaches `$\langle\tfrac12mv^2\rangle = \tfrac12k_BT$`. Results, with `$\tau_m = m/\gamma$`:

- velocity correlation `$\langle v(0)v(t)\rangle = \dfrac{k_BT}{m}e^{-t/\tau_m}$`; integrating it gives `$D = \displaystyle\int_0^\infty\langle v(0)v(t)\rangle dt = k_BT/\gamma$` (a Green-Kubo formula);
- mean square displacement

```math
\langle x^2(t)\rangle = 2D\left[t - \tau_m\left(1 - e^{-t/\tau_m}\right)\right] \longrightarrow \begin{cases} \dfrac{k_BT}{m}t^2 & t \ll \tau_m \ \ (\text{ballistic}) \\[6pt] 2Dt & t \gg \tau_m \ \ (\text{diffusive}) \end{cases}
```

### Worked example: when is a bead ballistic?

<div class="steps">
<div class="step"><p><b>The bead.</b> Silica, radius 0.5 μm, density 2000 kg/m³, in water (η = 1.0 mPa s) at 293 K. Mass m = (4/3)π(0.5 × 10⁻⁶)³ × 2000 = 1.05 × 10⁻¹⁵ kg.</p></div>
<div class="step"><p><b>Friction.</b> γ = 6πηa = 9.42 × 10⁻⁹ kg/s, so τ<sub>m</sub> = m/γ = 1.1 × 10⁻⁷ s.</p></div>
<div class="step"><p><b>Diffusion.</b> D = k<sub>B</sub>T/γ = 4.3 × 10⁻¹³ m²/s: in 1 s the rms step along one axis is √(2D) = 0.93 μm.</p></div>
<div class="step"><p><b>Ballistic regime.</b> Below about 0.1 μs the bead moves in straight lines at v<sub>rms</sub> = √(k<sub>B</sub>T/m) = 2 mm/s, covering only about 0.2 nm before its velocity is randomised. Einstein thought this regime unmeasurable; optical tweezers resolved it in 2010.</p></div>
</div>

**Optical trap.** Add a spring `$-\kappa x$`. Equipartition gives `$\kappa\langle x^2\rangle = k_BT$` at once, which is how trap stiffness is calibrated: a 2 nm rms jitter at 300 K means `$\kappa = 4.14\times10^{-21}/(2\times10^{-9})^2 \approx 1$` mN/m. Positions relax with time constant `$\gamma/\kappa$`.

**Escape over a barrier.** A Brownian particle in a well of depth `$E_b \gg k_BT$` escapes at a rate `$\propto e^{-E_b/k_BT}$` (Kramers), the Arrhenius law. Raising `$T$` from 300 K to 310 K speeds a 0.5 eV process by a factor `$e^{(0.5/k_B)(1/300 - 1/310)} = 1.9$`.

## 4. Noise in circuits

The fluctuation-dissipation theorem applied to charges in a resistor gives **Johnson-Nyquist noise**:

```math
\langle V^2\rangle = 4k_BTR\,\Delta f, \qquad \langle I^2\rangle = \frac{4k_BT\Delta f}{R}
```

white up to `$f \sim k_BT/h \approx 6$` THz at room temperature. A 1 MΩ resistor at 300 K over a 10 kHz bandwidth produces `$\sqrt{4k_BTR\Delta f} = 12.9$` μV rms. Maximum noise power delivered to a matched load is `$k_BT\Delta f$`, independent of `$R$`, which defines an amplifier's noise temperature.

- **kT/C noise.** A capacitor `$C$` in contact with any resistor at `$T$` has `$\tfrac12C\langle V^2\rangle = \tfrac12k_BT$`: `$V_{\rm rms} = \sqrt{k_BT/C}$`, 64 μV for 1 pF at 300 K, whatever `$R$` is. It sets the floor of camera pixels.
- **Shot noise.** Current carried by discrete independent charges fluctuates as `$\langle I^2\rangle = 2eI\Delta f$` (Poisson arrivals). It is not thermal: it exists at zero temperature. For 1 mA over 1 MHz, `$I_{\rm rms} = 18$` nA.

## 5. Polymers as random walks

A freely jointed chain of `$N$` links of length `$b$` is a three-dimensional random walk: `$R_{\rm rms} = \sqrt Nb$`. The number of configurations with end-to-end vector `$\vec R$` is Gaussian, so the entropy is `$S = S_0 - 3k_BR^2/2Nb^2$`. Stretching it needs a force

```math
F = -T\frac{\partial S}{\partial R} = \frac{3k_BT}{Nb^2}R
```

an entropic spring, stiffer when hotter. A stretched rubber band warms up when stretched quickly and contracts when heated, the opposite of a metal wire.

<div class="myth">

**"Fluctuations are always negligible in macroscopic systems."** Relative fluctuations of extensive quantities fall as `$1/\sqrt N$`, but two important exceptions exist. Near a critical point the response functions (`$C_V$`, `$\kappa_T$`, the susceptibility) diverge, and so do the fluctuations, over all length scales: you can see them as critical opalescence. And in small systems (a single protein, a nanoscale capacitor, a single trapped bead), `$k_BT$` fluctuations are the main physics, not a correction.

</div>

<div class="keypoints">

- `$\langle(\Delta E)^2\rangle = k_BT^2C_V$`; `$\langle(\Delta N)^2\rangle = k_BT\,\partial N/\partial\mu = N^2k_BT\kappa_T/V$`; classical ideal gas Poisson; diverge at the critical point.
- Random walk `$\langle x^2\rangle = Nl^2$`; diffusion `$\langle x^2\rangle = 2Dt$` per axis, `$\langle r^2\rangle = 2dDt$`; `$D = l^2/2\tau$` in 1D.
- Einstein `$D = \mu k_BT$`; Stokes-Einstein `$D = k_BT/6\pi\eta a$`; sedimentation height `$k_BT/m_{\rm eff}g$`.
- Langevin: `$\langle F F\rangle = 2\gamma k_BT\delta$`; `$\tau_m = m/\gamma$`; `$\langle x^2\rangle$` ballistic `$k_BTt^2/m$` then diffusive `$2Dt$`; `$D = \int\langle v(0)v(t)\rangle dt$`.
- Trap `$\kappa\langle x^2\rangle = k_BT$`; Kramers/Arrhenius `$e^{-E_b/k_BT}$`.
- Johnson `$4k_BTR\Delta f$`; kT/C `$V_{\rm rms} = \sqrt{k_BT/C}$`; shot `$2eI\Delta f$`.
- Polymer `$R_{\rm rms} = \sqrt Nb$`, entropic spring `$F = 3k_BTR/Nb^2$`.

</div>

## Practise: exam questions on this lesson

NET Part C style, each with a full solution. More on the [CSIR NET Physics practice page](/learn/courses/csir-net-physics/practice/).

<div class="qbank" data-bank="physics" data-topics="fluctuations-brownian" data-exam="net" data-n="10"></div>

**Next:** [the Ising model and Landau theory](/learn/courses/csir-net-physics/ising-landau/), where fluctuations grow without limit at a critical point. Molecular motion behind diffusion is in [kinetic theory](/learn/courses/iit-jam-physics/kinetic-theory/).

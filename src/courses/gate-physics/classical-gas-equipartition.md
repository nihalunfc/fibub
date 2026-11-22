---
title: 'The classical ideal gas and equipartition'
seoTitle: Classical ideal gas and equipartition for GATE Physics
summary: 'The ideal gas from a phase-space partition function: thermal wavelength, Sackur-Tetrode entropy, the Gibbs paradox and entropy of mixing, chemical potential, when classical statistics hold, the generalised equipartition and virial theorems, gases in gravity and centrifuges, and the Langevin paramagnet.'
minutes: 40
updated: 2026-11-22
quiz:
  - q: "A classical particle moves in one dimension in the potential V = bx⁴. Its mean potential energy is"
    choices: ['kT/4', 'kT/2', 'kT', '2kT']
    ans: 0
    why: "Generalised equipartition: ⟨x ∂H/∂x⟩ = kT, and x V′ = 4V, so ⟨V⟩ = kT/4. Only quadratic terms carry kT/2."
  - q: Two samples of the same ideal gas at the same T and P are allowed to mix. The entropy change is
    choices: ['zero', '2Nk ln 2', 'Nk ln 2', 'negative']
    ans: 0
    why: "With the 1/N! in Z (indistinguishable particles), S depends on V/N, which does not change. Without it you get the spurious 2Nk ln 2 of the Gibbs paradox."
  - q: The classical treatment of an ideal gas is valid when
    choices: ['nλ³ ≪ 1', 'nλ³ ≫ 1', 'T ≪ T_F', 'μ > 0']
    ans: 0
    why: "When the thermal wavelength is much smaller than the spacing between particles, wave packets do not overlap and quantum statistics do not matter. Then μ = kT ln(nλ³) is large and negative."
sources:
  - 'R. K. Pathria and P. D. Beale, Statistical Mechanics, 4th ed. (Academic Press, 2021), chapters 1 to 3'
  - 'K. Huang, Statistical Mechanics, 2nd ed. (Wiley, 1987), chapters 6 and 8'
  - 'S. J. Blundell and K. M. Blundell, Concepts in Thermal Physics, 2nd ed. (Oxford, 2010), chapters 19 and 21'
  - 'D. V. Schroeder, An Introduction to Thermal Physics (Addison-Wesley, 2000), chapters 2 and 6'
  - 'GATE Physics (PH) syllabus, Statistical Physics section, published by the organising institute each year'
---

**Module 5 · about 40 minutes.** By the end you will be able to derive the full thermodynamics of an ideal gas from one integral, resolve the Gibbs paradox, judge when classical statistics are safe, use equipartition for any power-law energy, and handle gases in external fields. The kinetic-theory basics (Maxwell speeds, mean free path, simple equipartition) are in the IIT JAM lesson on [kinetic theory](/learn/courses/iit-jam-physics/kinetic-theory/); here we derive them.

<div class="bigidea">For a classical gas the partition function is a Gaussian integral over momenta times the volume. Planck's constant fixes the size of a phase-space cell, the N! removes double counting, and out comes everything: PV = NkT, U, S and μ.</div>

## 1. The ideal gas partition function

For one particle, divide phase space into cells of volume `$h^3$`:

```math
Z_1 = \frac{1}{h^3}\int d^3x\,d^3p\,e^{-p^2/2mkT} = \frac{V}{\lambda^3}, \qquad \lambda = \frac{h}{\sqrt{2\pi mkT}}
```

<div class="meaning">

<dl>
<dt>λ</dt><dd>the thermal de Broglie wavelength: 0.050 nm for helium at 300 K, 0.19 μm for rubidium at 1 μK</dd>
<dt>V/λ³</dt><dd>the number of thermal "boxes" a particle can occupy</dd>
<dt>Physical meaning</dt><dd>Classical statistics hold when each particle has many boxes to itself: nλ³ ≪ 1. For helium gas at room conditions nλ³ ≈ 3×10⁻⁶; for electrons in a metal it is about 10⁴, which is why they need Fermi-Dirac statistics.</dd>
</dl>

</div>

For `$N$` identical particles `$Z_N = Z_1^N/N!$`. With Stirling's formula, `$F = -kT\ln Z_N = -NkT[\ln(V/N\lambda^3) + 1]$`, and then:

```math
P = \frac{NkT}{V}, \quad U = \tfrac32NkT, \quad \mu = kT\ln(n\lambda^3), \quad S = Nk\left[\ln\frac{V}{N\lambda^3} + \frac52\right]
```

The last one is the **Sackur-Tetrode equation**. It contains `$h$`, yet it is a classical result that agrees with calorimetry: for argon at 300 K and 1 bar it gives 155 J mol⁻¹ K⁻¹, matching measured third-law entropies. It fails as `$T \to 0$` (it goes negative), where `$n\lambda^3$` is no longer small.

<div class="problem" data-problem="stat-sackur-tetrode"></div>

Hit the walls first: see where the pressure comes from for the gas whose partition function you are about to write down.

<figure class="fig" data-fig="@wt-gas-box"><figcaption>The partition function says P = NkT/V; the box shows it microscopically as wall hits. Notice that ⟨v_x²⟩ = kT/m and the Maxwell histogram matches the curve.</figcaption></figure>


## 2. The Gibbs paradox and mixing

Leave out the `$N!$` and the entropy has `$\ln V$` instead of `$\ln(V/N)$`. Joining two identical boxes of the same gas would then "create" `$2Nk\ln2$` of entropy although nothing changed. Gibbs resolved this by dividing by `$N!$`: identical particles cannot be labelled, a point quantum mechanics later made exact.

For genuinely different gases the mixing entropy is real:

```math
\Delta S_{\rm mix} = -Nk\sum_i x_i\ln x_i \qquad (\text{same } T, P)
```

**Worked example.** 1 mol of He and 3 mol of Ne: `$\Delta S = -R[\ln\tfrac14 + 3\ln\tfrac34] = 18.7$` J/K.

Mix two gases and then the same gas to see where the Gibbs paradox comes from.

<div class="steps" data-fig="@wt-mixing-entropy"><div class="step"><b>Different gases, partition in.</b> Each species fills half the box.</div><div class="step"><b>Partition out.</b> Every molecule can now be anywhere; the entropy rises.</div><div class="step"><b>Mixed.</b> ΔS = N k ln 2 for distinguishable gases (about 0.69 k per molecule). Now switch to "The same gas": the picture is the same but ΔS = 0 because the 1/N! in the partition function counts permutations of identical molecules only once.</div></div>


## 3. Equipartition, generalised

For any canonical coordinate `$x_i$` (a `$q$` or a `$p$`), integrating by parts in the canonical average gives

```math
\left\langle x_i\frac{\partial H}{\partial x_j}\right\rangle = \delta_{ij}\,kT
```

provided `$x_ie^{-\beta H}$` vanishes at the ends of the range. Consequences:

| Term in `$H$` | Mean value | Example |
|---|---|---|
| `$ax^2$` (quadratic) | `$\tfrac12kT$` | kinetic energy, harmonic potential |
| `$a|x|$` (linear) | `$kT$` | ultra-relativistic `$c|p|$`, uniform gravity |
| `$a|x|^s$` | `$kT/s$` | quartic well: `$kT/4$` |

So an ultra-relativistic gas (`$H = c|\mathbf p|$`) has `$U = 3NkT$`, yet still `$PV = NkT$`, because `$Z_1 \propto V$` whatever the dispersion relation. And a fully classical linear triatomic like CO₂ would have `$C_V = (3 + 2 + 2\times4)R/2 = 6.5R$`; the measured 3.5R near room temperature shows most vibrations frozen ([lesson 5.2](/learn/courses/gate-physics/partition-functions/)).

**Virial theorem.** Summing over coordinates, `$2\langle K\rangle = \langle\mathbf r\cdot\nabla V\rangle$`. For `$V \propto r^n$`: `$2\langle K\rangle = n\langle V\rangle$`. For the walls of a box it gives `$PV = \tfrac23\langle K\rangle$`; for a self-gravitating star (`$n = -1$`) `$E = -K$`, so a star that radiates energy heats up: a negative heat capacity.

See which quadratic terms are really active as the temperature changes.

<figure class="fig" data-fig="@wt-dof-freeze"><figcaption>Generalised equipartition holds only for modes that are classical: kT ≫ level spacing. Notice the heat capacity steps and the freeze-out of rotation and vibration.</figcaption></figure>


## 4. Gases in external fields

The Boltzmann factor includes potential energy, so density follows `$n(\mathbf r) \propto e^{-U(\mathbf r)/kT}$`.

- **Gravity:** `$n(z) = n(0)e^{-mgz/kT}$`, scale height `$H = kT/mg$` (7.6 km for N₂ at 250 K). Each molecule carries an extra `$\langle mgz\rangle = kT$`, so a tall isothermal column has `$C = \tfrac52k$` per molecule.
- **Centrifuge:** in the rotating frame `$U = -\tfrac12m\omega^2r^2$`, so `$n(R)/n(0) = e^{m\omega^2R^2/2kT}$`. Two isotopes separate by `$e^{\Delta m\,\omega^2R^2/2kT}$`, only about 1.5% per stage for UF₆.
- **Harmonic trap:** a Gaussian cloud of width `$\sqrt{kT/m\omega^2}$` with peak `$n(0)\lambda^3 = N(\hbar\omega/kT)^3$`: the route to Bose-Einstein condensation in [lesson 5.5](/learn/courses/gate-physics/photon-phonon-gases/).

**Worked example.** UF₆ (352 u) at 300 K in a centrifuge of radius 5.0 cm at 500 rev/s: `$\tfrac12m\omega^2R^2 = 1.74kT$`, so the wall density is `$e^{1.74} = 5.7$` times the axis density.

**Langevin paramagnet.** A classical dipole free to point anywhere: `$Z_1 \propto \sinh x/x$`, `$\langle\cos\theta\rangle = \coth x - 1/x$`, and at small `$x$` the Curie-law value `$x/3$`. The same function gives the Debye orientational polarisability `$p^2/3kT$` of polar molecules.

<div class="myth">

**"Every degree of freedom carries ½kT."** Only quadratic terms do, and only when the levels are closely spaced compared with `$kT$`. A linear term carries `$kT$`, a quartic `$kT/4$`. And quantised modes whose spacing exceeds `$kT$` carry almost nothing: vibrations of N₂ at room temperature, rotations of H₂ below 50 K, conduction electrons in a metal.

</div>

<div class="keypoints">

- `$Z_1 = V/\lambda^3$`, `$\lambda = h/\sqrt{2\pi mkT}$`; `$Z_N = Z_1^N/N!$`.
- `$PV = NkT$`, `$U = \tfrac32NkT$`, `$\mu = kT\ln(n\lambda^3) < 0$`, Sackur-Tetrode `$S = Nk[\ln(V/N\lambda^3) + \tfrac52]$`.
- Classical statistics need `$n\lambda^3 \ll 1$`.
- The `$N!$` removes the Gibbs paradox; mixing different gases gives `$-Nk\sum x\ln x$`.
- `$\langle x_i\partial H/\partial x_j\rangle = \delta_{ij}kT$`: `$kT/s$` for a term `$\propto|x|^s$`; virial `$2\langle K\rangle = n\langle V\rangle$`.
- External fields: `$n \propto e^{-U/kT}$` (barometric law, centrifuge, traps); Langevin `$\coth x - 1/x$`.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. Check each answer, then read the full solution. More on the [GATE practice page](/learn/courses/gate-physics/practice/).

<div class="qbank" data-bank="physics" data-topics="classical-gas-equipartition" data-exam="gate" data-n="10"></div>

**Next:** [lesson 5.4, Bose-Einstein and Fermi-Dirac statistics](/learn/courses/gate-physics/quantum-statistics/), for what happens when `$n\lambda^3$` is no longer small. Try fibub's [real gas calculator](/science/real-gas-calculator/) to see where interactions, rather than quantum effects, make a gas non-ideal.

**Going on to CSIR NET?** [The kinetic theory of transport](/learn/courses/csir-net-physics/transport/) uses the same molecular speeds for viscosity, conduction and diffusion.

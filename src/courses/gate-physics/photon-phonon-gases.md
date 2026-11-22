---
title: 'Blackbody radiation and Bose-Einstein condensation'
seoTitle: Photon gas and Bose-Einstein condensation for GATE Physics
summary: 'Bose gases with and without a conserved particle number: Planck’s law from mode counting and Bose statistics, the thermodynamics of the photon gas (n, u, P, S, adiabats, the CMB), phonons and the Debye T³ law, and Bose-Einstein condensation in a box and in a harmonic trap.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: Why is the chemical potential of blackbody photons zero?
    choices: ['Their number is not conserved', 'They have no rest mass', 'They are fermions', 'They do not interact']
    ans: 0
    why: "Walls absorb and emit photons freely, so N adjusts to minimise F at fixed T and V: μ = ∂F/∂N = 0. Masslessness alone would not force μ = 0."
  - q: An ideal Bose gas in a box is at T = T_c/2. What fraction of atoms is in the condensate?
    choices: ['about 0.65', '0.5', '0.875', '0.25']
    ans: 0
    why: "N_ex/N = (T/T_c)^{3/2} = 0.354, so the condensate holds 0.646. In a 3D harmonic trap the exponent is 3 and the answer would be 0.875."
  - q: "Blackbody radiation is expanded slowly and adiabatically to 8 times its volume. Its temperature"
    choices: ['halves', 'falls by a factor 8', 'falls by a factor 4', 'stays the same']
    ans: 0
    why: "S = (4/3)aVT³ is constant, so T ∝ V^{−1/3} = 8^{−1/3} = 1/2. This is why the CMB cools inversely with the scale factor of the universe."
sources:
  - 'R. K. Pathria and P. D. Beale, Statistical Mechanics, 4th ed. (Academic Press, 2021), chapter 7'
  - 'K. Huang, Statistical Mechanics, 2nd ed. (Wiley, 1987), chapter 12'
  - 'C. Kittel and H. Kroemer, Thermal Physics, 2nd ed. (W. H. Freeman, 1980), chapters 4 and 7'
  - 'C. J. Pethick and H. Smith, Bose-Einstein Condensation in Dilute Gases, 2nd ed. (Cambridge, 2008), chapter 2'
  - 'GATE Physics (PH) syllabus, Statistical Physics section, published by the organising institute each year'
---

**Module 5 · about 45 minutes.** By the end you will be able to derive Planck's law and the Stefan-Boltzmann constant from Bose statistics, work out every thermodynamic property of the photon gas, explain the Debye `$T^3$` law as a phonon gas, and calculate condensation temperatures and condensate fractions for atoms in a box or a trap. The radiation laws as such (Wien, Stefan, emissivity) are in the IIT JAM course ([blackbody radiation](/learn/courses/iit-jam-physics/blackbody-radiation/)); here we derive them. You need the Bose-Einstein occupation from [lesson 5.4](/learn/courses/gate-physics/quantum-statistics/).

<div class="bigidea">A Bose gas whose particle number is not conserved (photons, phonons) has μ = 0, and its thermodynamics follows from mode counting alone. A Bose gas whose number is conserved (atoms) cannot fit all its particles in excited states below a critical temperature, and the rest pile into the ground state: Bose-Einstein condensation.</div>

## 1. Planck's law from Bose statistics

In a cavity of volume `$V$`, electromagnetic modes fill `$k$`-space with density `$V/(2\pi)^3$`, with 2 polarisations. Per unit volume, the number of modes between `$\nu$` and `$\nu + d\nu$` is `$8\pi\nu^2d\nu/c^3$`. Each mode is an oscillator holding `$\langle n\rangle = 1/(e^{h\nu/kT} - 1)$` photons ([lesson 5.2](/learn/courses/gate-physics/partition-functions/)):

```math
u_\nu\,d\nu = \underbrace{\frac{8\pi\nu^2}{c^3}d\nu}_{\text{modes}}\times\underbrace{h\nu}_{\text{energy}}\times\underbrace{\frac{1}{e^{h\nu/kT} - 1}}_{\text{photons per mode}}
```

<div class="meaning">

<dl>
<dt>hν ≪ kT</dt><dd>⟨n⟩ ≈ kT/hν: Rayleigh-Jeans, u<sub>ν</sub> = 8πν²kT/c³, equipartition per mode</dd>
<dt>hν ≫ kT</dt><dd>⟨n⟩ ≈ e<sup>−hν/kT</sup>: Wien's tail, modes essentially empty</dd>
<dt>Peak of u<sub>ν</sub></dt><dd>hν = 2.821 kT (from x = 3(1 − e<sup>−x</sup>)); the peak of u<sub>λ</sub> is at hc/λ = 4.965 kT, a different place</dd>
<dt>Physical meaning</dt><dd>The ultraviolet catastrophe disappears because high-frequency modes are quantised in lumps hν bigger than kT and stay unoccupied.</dd>
</dl>

</div>

<figure class="fig" data-fig="planck-curves"><figcaption>Planck spectra at T, 0.75 T and 0.5 T, with the Rayleigh-Jeans line. The peak frequency moves in proportion to T while the area grows as T⁴; the classical line agrees only at the low-frequency end.</figcaption></figure>

## 2. Thermodynamics of the photon gas

Integrating over all frequencies with `$x = h\nu/kT$` uses two standard integrals, `$\int_0^\infty x^3dx/(e^x - 1) = \pi^4/15$` and `$\int_0^\infty x^2dx/(e^x - 1) = 2\zeta(3)$`:

```math
u = aT^4,\ a = \frac{\pi^2k^4}{15\hbar^3c^3}, \qquad n = \frac{2\zeta(3)}{\pi^2}\left(\frac{kT}{\hbar c}\right)^3 \approx 2.03\times10^7\,T^3\ \text{m}^{-3}
```

and, since `$\mu = 0$` means `$G = 0$`:

| Quantity | Result |
|---|---|
| pressure | `$P = u/3 = aT^4/3$` |
| free energy | `$F = -PV = -\tfrac13aVT^4$` |
| entropy | `$S = \tfrac43aVT^3 = \tfrac43U/T$`, about `$3.60k$` per photon |
| heat capacity | `$C_V = 4aVT^3$` (and `$C_P$` is not finite: `$P$` depends on `$T$` only) |
| mean photon energy | `$u/n = 2.701\,kT$` |
| adiabat | `$VT^3$` and `$PV^{4/3}$` constant |
| emitted flux | `$\sigma T^4$` with `$\sigma = ca/4 = \pi^2k^4/60\hbar^3c^2$`; photon flux `$cn/4$` |

**Worked example (CMB).** At `$T = 2.725$` K: `$n = 411$` photons per cm³, entropy density `$1.48\times10^3k$` per cm³, mean photon energy `$0.63$` meV. Because the universe expands adiabatically, `$T \propto 1/a$` (the scale factor), the same law as a slowly expanded cavity. See the [cosmology course](/learn/courses/cosmology/) for where this leads.

<div class="problem" data-problem="stat-photon-gas"></div>

## 3. Phonons: the same physics with a cut-off

Lattice vibrations of a crystal are bosons with `$\mu = 0$` too. At low `$T$` only long-wavelength acoustic phonons with `$\omega = v_sk$` are excited: a photon gas with three polarisations and the sound speed instead of `$c$`. So `$U \propto T^4$` and

```math
C = \frac{12\pi^4}{5}Nk\left(\frac{T}{\theta_D}\right)^3 \qquad (T \ll \theta_D)
```

The difference from photons: a crystal of `$N$` atoms has only `$3N$` modes, cut off at the Debye frequency. At `$T \gg \theta_D$` each mode holds `$kT$` and `$C \to 3Nk$` (Dulong-Petit). For copper (`$\theta_D = 343$` K) at 10 K the lattice gives only 0.048 J mol⁻¹ K⁻¹. The full Debye and Einstein models, with dispersion, are in GATE module 7.

## 4. Bose-Einstein condensation in a box

For atoms `$N$` is fixed, so `$\mu < 0$` adjusts with `$T$`. The excited states can hold at most (at `$\mu = 0$`)

```math
N_{\rm ex}^{\max} = \int_0^\infty\frac{g(\varepsilon)\,d\varepsilon}{e^{\beta\varepsilon} - 1} = \zeta(3/2)\frac{V}{\lambda^3}, \qquad \zeta(3/2) = 2.612
```

which shrinks as `$T^{3/2}$`. When `$n\lambda^3$` reaches 2.612, there is no room left, and further cooling sends a macroscopic number into the single lowest state:

```math
T_c = \frac{2\pi\hbar^2}{mk}\left(\frac{n}{2.612}\right)^{2/3}, \qquad \frac{N_0}{N} = 1 - \left(\frac{T}{T_c}\right)^{3/2}
```

**Worked example (liquid helium).** With the density of liquid ⁴He, `$n = 2.18\times10^{28}$` m⁻³ gives `$T_c = 3.13$` K, remarkably close to the observed lambda point, 2.17 K (the liquid is far from ideal).

Below `$T_c$` the condensate has zero momentum and no entropy, so the pressure `$P = \zeta(5/2)kT/\lambda^3 \propto T^{5/2}$` does not depend on density: isotherms are flat, as in liquid-vapour coexistence. The heat capacity rises as `$T^{3/2}$` to `$1.93Nk$` at `$T_c$` and then falls towards `$\tfrac32Nk$`: a cusp.

<div class="problem" data-problem="stat-bec"></div>

## 5. Condensation in traps and in two dimensions

Condensation needs the excited-state integral to converge at `$\varepsilon \to 0$`, which depends on `$g(\varepsilon)$`:

| Confinement | `$g(\varepsilon)$` | BEC at `$T > 0$`? | Condensate fraction |
|---|---|---|---|
| 3D box | `$\propto\sqrt\varepsilon$` | yes | `$1 - (T/T_c)^{3/2}$` |
| 3D harmonic trap | `$\varepsilon^2/2(\hbar\omega)^3$` | yes, `$kT_c = \hbar\omega(N/\zeta(3))^{1/3}$` | `$1 - (T/T_c)^3$` |
| 2D box | constant | no (integral diverges) | n/a |
| 2D harmonic trap | `$\propto\varepsilon$` | yes | `$1 - (T/T_c)^2$` |

**Worked example.** `$10^6$` rubidium atoms in a trap with `$\omega = 2\pi\times100$` s⁻¹: `$\hbar\omega/k = 4.80$` nK and `$(10^6/1.202)^{1/3} = 94$`, so `$T_c = 0.45\ \mu$`K, which is where the 1995 experiments saw condensation.

<div class="myth">

**"Bose-Einstein condensation is atoms condensing into a droplet in space."** It is condensation in momentum (or single-particle state) space: the atoms crowd into the lowest quantum state of the box or trap. It needs no attraction at all, and happens in an ideal gas purely from Bose statistics. In a trap the condensate does show up as a dense central peak, but only because the lowest trap state is small.

</div>

<div class="keypoints">

- Photons and phonons: `$\mu = 0$` because number is not conserved. Modes `$8\pi\nu^2d\nu/c^3$` × `$h\nu$` × `$1/(e^{h\nu/kT} - 1)$` = Planck.
- `$u = aT^4$`, `$n \approx 2.03\times10^7T^3$` m⁻³, `$P = u/3$`, `$S = \tfrac43aVT^3$`, `$u/n = 2.70kT$`, `$S/N = 3.60k$`; adiabat `$VT^3$` constant.
- Peaks: `$h\nu = 2.821kT$` for `$u_\nu$`, `$hc/\lambda = 4.965kT$` for `$u_\lambda$`.
- Phonons: Debye `$C \propto T^3$` at low `$T$`, `$3Nk$` at high `$T$` because of the `$3N$`-mode cut-off.
- BEC in a box at `$n\lambda^3 = 2.612$`; `$N_0/N = 1 - (T/T_c)^{3/2}$`; `$P \propto T^{5/2}$` below `$T_c$`; `$C_V$` cusp of `$1.93Nk$`.
- Traps: `$kT_c = \hbar\omega(N/1.202)^{1/3}$`, fraction `$1 - (T/T_c)^3$`; no BEC in a 2D box.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. Check each answer, then read the full solution. More on the [GATE practice page](/learn/courses/gate-physics/practice/).

<div class="qbank" data-bank="physics" data-topics="photon-phonon-gases" data-exam="gate" data-n="10"></div>

**Next:** [lesson 5.6, the Fermi gas](/learn/courses/gate-physics/fermi-gas/), the opposite case where statistics forbid crowding. For stellar spectra, use fibub's [blackbody calculator](/science/blackbody-calculator/).

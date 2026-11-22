---
title: 'Bose-Einstein and Fermi-Dirac statistics'
seoTitle: Bose-Einstein and Fermi-Dirac statistics for GATE Physics
summary: 'Identical particles in quantum mechanics: spin and statistics, counting microstates for bosons and fermions, the Bose-Einstein and Fermi-Dirac occupations from the grand canonical ensemble, the classical limit, densities of states in one, two and three dimensions, and the first quantum corrections to the ideal gas.'
minutes: 40
updated: 2026-11-22
quiz:
  - q: Two identical bosons are placed in three single-particle states of equal energy. How many microstates are there?
    choices: ['6', '9', '3', '8']
    ans: 0
    why: "Only the occupation numbers matter: both in one state (3 ways) or in two different states (3 ways). Distinguishable particles would give 9, fermions 3."
  - q: The mean occupation of a fermion state lying exactly at the chemical potential is
    choices: ['1/2', '1', '0', '1/e']
    ans: 0
    why: "1/(e⁰ + 1) = 1/2 at every temperature."
  - q: "At the same density and temperature, with nλ³ small but not negligible, which ideal gas has the highest pressure?"
    choices: ['Fermions', 'Bosons', 'Classical particles', 'All have the same pressure']
    ans: 0
    why: "P/nkT = 1 ± nλ³/(g 2^{5/2}): plus for fermions, minus for bosons. Exchange acts like a repulsion for fermions and an attraction for bosons."
sources:
  - 'R. K. Pathria and P. D. Beale, Statistical Mechanics, 4th ed. (Academic Press, 2021), chapters 5 and 6'
  - 'K. Huang, Statistical Mechanics, 2nd ed. (Wiley, 1987), chapters 8 and 11'
  - 'C. Kittel and H. Kroemer, Thermal Physics, 2nd ed. (W. H. Freeman, 1980), chapters 6 and 7'
  - 'F. Reif, Fundamentals of Statistical and Thermal Physics (McGraw-Hill, 1965; reissued 2009), chapter 9'
  - 'GATE Physics (PH) syllabus, Statistical Physics section, published by the organising institute each year'
---

**Module 5 · about 40 minutes.** By the end you will be able to tell bosons from fermions, count their microstates, derive both quantum distributions in two lines, find when they reduce to Maxwell-Boltzmann, write the density of states in any dimension, and quote the first quantum correction to the gas law. You need the grand canonical ensemble from [lesson 5.1](/learn/courses/gate-physics/ensembles/).

<div class="bigidea">Identical quantum particles cannot be labelled. A many-particle state is fixed by how many particles sit in each single-particle state: any number for bosons, zero or one for fermions. That single rule produces two new distributions, superfluidity and the stability of matter.</div>

## 1. Spin and statistics

Exchanging two identical particles leaves `$|\psi|^2$` unchanged, so the wavefunction is symmetric (bosons) or antisymmetric (fermions). The spin-statistics theorem fixes which: integer spin gives bosons, half-integer spin fermions. For composites, count the elementary fermions: an even number makes a boson.

| Bosons | Fermions |
|---|---|
| photon, phonon, ⁴He, ⁸⁷Rb, ²³Na, deuteron, Cooper pair | electron, proton, neutron, ³He, ⁶Li, ⁴⁰K |

Antisymmetry gives the Pauli principle: at most one fermion per single-particle state (spin included). It also gives correlations without forces: two bosons in different orbitals are twice as likely as distinguishable particles to be found at the same point, two same-spin fermions never are.

## 2. Counting microstates

Put `$n$` particles into `$g$` degenerate single-particle states:

| Particles | Number of microstates |
|---|---|
| distinguishable | `$g^n$` |
| bosons | `$\binom{n + g - 1}{n}$` |
| fermions | `$\binom{g}{n}$` |

**Worked example.** Two particles in three states: 9, 6 and 3. The probability that both share a state (all microstates equally likely) is 3/9 = 1/3 for distinguishable particles, 3/6 = 1/2 for bosons and 0 for fermions: bosons bunch, fermions avoid each other. When `$g \gg n$`, both quantum counts approach `$g^n/n!$`, the corrected Boltzmann count of [lesson 5.3](/learn/courses/gate-physics/classical-gas-equipartition/).

## 3. The two distributions in two lines

Non-interacting particles: each single-particle state `$\varepsilon$` is an independent system in the grand canonical ensemble, with occupation `$n$` and weight `$e^{-\beta(\varepsilon - \mu)n}$`.

<div class="steps">
<div class="step"><p><b>Fermions.</b> n = 0 or 1, so the grand sum is 1 + e<sup>−β(ε−μ)</sup>.</p></div>
<div class="step"><p><b>Bosons.</b> n = 0, 1, 2, …, a geometric series: 1/(1 − e<sup>−β(ε−μ)</sup>), which converges only if ε > μ.</p></div>
<div class="step"><p><b>Mean occupation.</b> ⟨n⟩ = kT ∂ ln(grand sum)/∂μ gives the two results below.</p></div>
</div>

```math
\langle n\rangle_{FD} = \frac{1}{e^{(\varepsilon - \mu)/kT} + 1}, \qquad \langle n\rangle_{BE} = \frac{1}{e^{(\varepsilon - \mu)/kT} - 1}, \qquad \langle n\rangle_{MB} = e^{-(\varepsilon - \mu)/kT}
```

<div class="meaning">

<dl>
<dt>μ</dt><dd>the chemical potential, fixed by the total particle number: N = Σ⟨n⟩ over all states</dd>
<dt>Fermi-Dirac</dt><dd>always between 0 and 1; exactly 1/2 at ε = μ; symmetric: f(μ + δ) = 1 − f(μ − δ)</dd>
<dt>Bose-Einstein</dt><dd>needs μ below the lowest level; can be much larger than 1 near it</dd>
<dt>Physical meaning</dt><dd>The ±1 is the whole of quantum statistics. When e<sup>(ε−μ)/kT</sup> ≫ 1 for every state, all occupations are small and both reduce to Maxwell-Boltzmann.</dd>
</dl>

</div>

<figure class="fig" data-fig="stat-distributions"><figcaption>Mean occupation against (ε − μ)/kT. Bose-Einstein lies above Maxwell-Boltzmann, which lies above Fermi-Dirac; the three agree once ε − μ is a few kT (within 1% beyond 4.6 kT). Only fermions may have states below μ.</figcaption></figure>

The same counting gives the entropy: `$S = -k\sum[f\ln f + (1 - f)\ln(1 - f)]$` for fermions and `$S = k\sum[(1 + n)\ln(1 + n) - n\ln n]$` for bosons; completely full or empty fermion states carry no entropy.

<div class="problem" data-problem="stat-occupation"></div>

Fill eight levels with classical particles, fermions and bosons and compare.

<figure class="fig" data-fig="@wt-boltzmann-levels"><figcaption>Fermions fill one per level up to the Fermi level, bosons pile into the ground level, classical particles spread by e^(−E/kT). Notice that raising T makes all three look alike.</figcaption></figure>


## 4. Density of states

Sums over states become integrals. In a box of side `$L$`, allowed wavevectors fill `$k$`-space with density `$(L/2\pi)^d$`. For `$\varepsilon = \hbar^2k^2/2m$` and spin degeneracy `$g_s$`:

```math
g(\varepsilon) = g_s\frac{V}{4\pi^2}\left(\frac{2m}{\hbar^2}\right)^{3/2}\sqrt\varepsilon \ (3D), \qquad g_s\frac{Am}{2\pi\hbar^2} \ (2D), \qquad \propto \varepsilon^{-1/2} \ (1D)
```

In general `$g \propto \varepsilon^{d/2 - 1}$`. Massless particles (`$\varepsilon = pc$`) in 3D have `$g \propto \varepsilon^2$`; a 3D harmonic trap also gives `$\varepsilon^2$`. These powers decide whether Bose condensation can happen ([lesson 5.5](/learn/courses/gate-physics/photon-phonon-gases/)) and how the Fermi level moves with temperature ([lesson 5.6](/learn/courses/gate-physics/fermi-gas/)).

**Worked example.** Electron states (both spins) below 1.0 meV in a 1 μm cube: `$N = g_sVk^3/6\pi^2$` with `$k = \sqrt{2m\varepsilon}/\hbar = 1.62\times10^8$` m⁻¹ gives `$1.4\times10^5$`.

Now count states in k-space: see how many fit under a given energy and why g(E) ∝ √E.

<figure class="fig" data-fig="@wt-fermi-sphere"><figcaption>States are evenly spaced in k, so the number below energy E is the volume of a sphere in k-space, N ∝ k³ ∝ E^(3/2), and g(E) ∝ √E. Notice the sphere growing as electrons are added.</figcaption></figure>


## 5. The classical limit and the first quantum correction

Expanding the grand potential in powers of the fugacity `$z = e^{\beta\mu}$` (small when `$n\lambda^3$` is small):

```math
\frac{P}{nkT} = 1 \pm \frac{n\lambda^3}{g_s\,2^{5/2}} + \ldots \qquad (+ \text{ fermions},\ - \text{ bosons})
```

Fermions push slightly harder than a classical gas and bosons slightly less, with no interactions at all. For spinless bosons `$n\lambda^3 = g_{3/2}(z) = z + z^2/2^{3/2} + \ldots$`, which reaches its maximum `$\zeta(3/2) = 2.612$` at `$z = 1$`: the threshold of condensation.

Two exact relations hold for any ideal non-relativistic gas in 3D, whatever the statistics: `$PV = \tfrac23U$` (because every level scales as `$V^{-2/3}$`) and `$PV^{5/3} =$` constant in an adiabatic change.

<div class="myth">

**"Two electrons can share an orbital, so the Fermi-Dirac occupation can reach 2."** The occupation `$\langle n\rangle_{FD} \le 1$` refers to a single-particle state including its spin label. An orbital with spin up and spin down is two states, each holding at most one electron. Densities of states for electrons carry the factor `$g_s = 2$` for exactly this reason.

</div>

<div class="keypoints">

- Integer spin: bosons (any occupation); half-integer: fermions (0 or 1). Composites: count the fermions inside.
- Counting `$n$` in `$g$` states: `$g^n$`, `$\binom{n + g - 1}{n}$` (bosons), `$\binom{g}{n}$` (fermions).
- `$\langle n\rangle = 1/(e^{\beta(\varepsilon - \mu)} \pm 1)$`: + Fermi-Dirac, − Bose-Einstein; both → MB when all occupations are small.
- Bosons need `$\mu \le \varepsilon_0$`; fermions have `$f = 1/2$` at `$\mu$` and `$f(\mu + \delta) + f(\mu - \delta) = 1$`.
- `$g(\varepsilon) \propto \varepsilon^{d/2 - 1}$`; `$\varepsilon^2$` for photons and harmonic traps.
- `$P/nkT = 1 \pm n\lambda^3/(g_s2^{5/2})$`; `$PV = \tfrac23U$` for any ideal non-relativistic gas.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. Check each answer, then read the full solution. More on the [GATE practice page](/learn/courses/gate-physics/practice/).

<div class="qbank" data-bank="physics" data-topics="quantum-statistics" data-exam="gate" data-n="10"></div>

**Next:** [lesson 5.5, photon and phonon gases and Bose-Einstein condensation](/learn/courses/gate-physics/photon-phonon-gases/). Plot all three distributions for your own numbers with fibub's [quantum statistics plotter](/science/quantum-statistics/); semiconductors, where the Fermi function meets band structure, are in the JAM lesson on [semiconductors](/learn/courses/iit-jam-physics/semiconductors/).

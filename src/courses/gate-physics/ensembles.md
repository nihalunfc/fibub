---
title: 'Microstates, entropy and the statistical ensembles'
seoTitle: Statistical ensembles for GATE Physics
summary: 'How statistical mechanics turns counting into thermodynamics: microstates and macrostates, Boltzmann and Gibbs entropy, temperature from S(E), the microcanonical, canonical and grand canonical ensembles, fluctuations, Liouville’s theorem and negative temperature.'
minutes: 40
updated: 2026-11-22
quiz:
  - q: Which quantities are fixed in the canonical ensemble?
    choices: ['T, V and N', 'E, V and N', 'T, V and μ', 'T, P and N']
    ans: 0
    why: The system exchanges energy with a large bath at temperature T but not particles or volume, so T, V and N are fixed and the energy fluctuates.
  - q: "For N two-level units isolated with more than half of them excited, the temperature is"
    choices: ['negative', 'very large but positive', 'zero', 'undefined because the system is isolated']
    ans: 0
    why: "S(E) = k ln C(N, n) falls once n > N/2, so 1/T = ∂S/∂E is negative. A negative-temperature system gives heat to any positive-temperature system."
  - q: In the canonical ensemble the variance of the energy equals
    choices: ['kT²C_V', 'kT C_V', 'C_V/kT²', 'zero']
    ans: 0
    why: "⟨ΔE²⟩ = ∂² ln Z/∂β² = −∂⟨E⟩/∂β = kT² C_V. Since C_V ∝ N, the relative width falls as 1/√N."
sources:
  - 'R. K. Pathria and P. D. Beale, Statistical Mechanics, 4th ed. (Academic Press, 2021), chapters 1 to 4'
  - 'K. Huang, Statistical Mechanics, 2nd ed. (Wiley, 1987), chapters 6 and 7'
  - 'F. Reif, Fundamentals of Statistical and Thermal Physics (McGraw-Hill, 1965; reissued 2009), chapters 2 to 6'
  - 'D. V. Schroeder, An Introduction to Thermal Physics (Addison-Wesley, 2000), chapters 2, 3 and 6'
  - 'GATE Physics (PH) syllabus, Statistical Physics section, published by the organising institute each year'
---

**Module 5 · about 40 minutes.** By the end you will be able to count microstates, get the temperature of an isolated system from its entropy, choose the right ensemble for a problem, compute energy and particle-number fluctuations, and explain why all ensembles agree for large systems (and when they do not). Thermodynamics itself (entropy, potentials, Maxwell relations) is in the IIT JAM lessons on [the second law](/learn/courses/iit-jam-physics/second-law-entropy/) and [thermodynamic potentials](/learn/courses/iit-jam-physics/thermodynamic-potentials/); here we derive it from counting.

<div class="bigidea">A macroscopic state is compatible with an astronomically large number of microscopic arrangements. Entropy is the logarithm of that number, and every equilibrium property follows from how this number changes with energy, volume and particle number.</div>

## 1. Microstates, macrostates and the basic postulate

A **microstate** says exactly what every particle is doing (every quantum number, or a point in phase space). A **macrostate** gives only a few numbers: `$E$`, `$V$`, `$N$`, perhaps a magnetisation. The basic postulate of statistical mechanics:

<div class="meaning">

<dl>
<dt>Equal a priori probabilities</dt><dd>In an isolated system in equilibrium, every accessible microstate (consistent with the fixed E, V, N) is equally likely.</dd>
<dt>Ω(E, V, N)</dt><dd>the number of accessible microstates. For classical systems, the phase-space volume of the energy shell divided by h<sup>3N</sup> (and N! for identical particles).</dd>
<dt>Physical meaning</dt><dd>Macrostates are <em>not</em> equally likely. The one with the most microstates wins, overwhelmingly, which is why systems evolve towards equilibrium and stay there.</dd>
</dl>

</div>

**Worked example (spins).** `$N$` distinguishable spin-1/2 moments in zero field: the macrostate "`$n$` up" has `$\Omega = \binom{N}{n}$` microstates. For `$N = 100$` the middle one, `$n = 50$`, has `$1.0\times10^{29}$`, about 8% of all `$2^{100}$`; for `$N = 10^{23}$` the fluctuations about the middle are only `$\sim\sqrt N/N \sim 10^{-11.5}$` of the total.

**Einstein solid.** `$N$` oscillators sharing `$q$` quanta: `$\Omega = \binom{q + N - 1}{q}$` (stars and bars: arrange `$q$` quanta and `$N - 1$` dividers). This one formula drives most of the counting problems examiners set.

## 2. Entropy and temperature from counting

Boltzmann defined

```math
S = k\ln\Omega, \qquad \frac{1}{T} = \left(\frac{\partial S}{\partial E}\right)_{V,N}, \qquad \frac{P}{T} = \left(\frac{\partial S}{\partial V}\right)_{E,N}, \qquad \frac{\mu}{T} = -\left(\frac{\partial S}{\partial N}\right)_{E,V}
```

Why is this the temperature? Put two systems in thermal contact. The combined number of states is `$\Omega_1(E_1)\Omega_2(E - E_1)$`; it is overwhelmingly peaked where `$\partial\ln\Omega_1/\partial E_1 = \partial\ln\Omega_2/\partial E_2$`. So the quantity that becomes equal in equilibrium is `$\partial S/\partial E$`: that is what thermometers read.

**Worked example (ideal gas from counting).** For a monatomic ideal gas the phase-space volume gives `$\Omega \propto V^NE^{3N/2}$`. Then `$1/T = \tfrac{3N}{2}k/E$`, so `$E = \tfrac32NkT$`, and `$P/T = Nk/V$`: the ideal gas law, with no kinetic theory at all.

The **Gibbs entropy** generalises Boltzmann's to any probability distribution over microstates:

```math
S = -k\sum_i p_i\ln p_i
```

It reduces to `$k\ln\Omega$` when all `$p_i = 1/\Omega$`, and it is largest for the uniform distribution. Maximising it with the mean energy fixed gives `$p_i \propto e^{-\beta E_i}$`, the canonical distribution, with `$\beta$` appearing as a Lagrange multiplier.

<div class="problem" data-problem="stat-boltzmann-ratio"></div>

## 3. The three ensembles

An ensemble is an imagined collection of copies of the system, one per microstate, weighted by probability. Which one you use depends on what crosses the boundary.

| Ensemble | What is fixed | Probability of a microstate | Bridge to thermodynamics |
|---|---|---|---|
| microcanonical | `$E, V, N$` | `$1/\Omega$` | `$S = k\ln\Omega$` |
| canonical | `$T, V, N$` | `$e^{-\beta E_i}/Z$` | `$F = -kT\ln Z$` |
| grand canonical | `$T, V, \mu$` | `$e^{-\beta(E_i - \mu N_i)}/\mathcal Z$` | `$\Phi_G = -kT\ln\mathcal Z = -PV$` |

The canonical rule follows from the microcanonical one. A small system in contact with a huge reservoir: the probability of a system microstate of energy `$E_i$` is proportional to the number of reservoir states left, `$\Omega_R(E_{\rm tot} - E_i)$`. Expand the logarithm:

```math
\ln\Omega_R(E_{\rm tot} - E_i) \approx \ln\Omega_R(E_{\rm tot}) - E_i\frac{\partial\ln\Omega_R}{\partial E} = \text{const} - \frac{E_i}{kT}
```

so `$P_i \propto e^{-E_i/kT}$`. Let particles cross as well and the same expansion adds `$+\mu N_i/kT$`. The fugacity `$z = e^{\beta\mu}$` then weights each particle.

**Worked example (a tiny reservoir).** A two-level unit (levels `$0$`, `$\varepsilon$`) shares `$4\varepsilon$` with an Einstein solid of 3 oscillators. Excited: the solid holds 3 quanta, `$\binom{5}{3} = 10$` states. Ground: 4 quanta, `$\binom{6}{4} = 15$`. So `$P_1 = 10/25 = 0.4$`. With a huge reservoir the ratio `$\Omega_R(E - \varepsilon)/\Omega_R(E)$` would become exactly `$e^{-\varepsilon/kT}$`.

## 4. Fluctuations and why ensembles agree

In the canonical ensemble the energy is not fixed. Differentiating `$Z = \sum e^{-\beta E_i}$`:

```math
\langle E\rangle = -\frac{\partial\ln Z}{\partial\beta}, \qquad \langle(\Delta E)^2\rangle = \frac{\partial^2\ln Z}{\partial\beta^2} = kT^2C_V
```

Both `$\langle E\rangle$` and `$C_V$` are proportional to `$N$`, so `$\Delta E/\langle E\rangle \propto 1/\sqrt N$`. For a monatomic gas it is exactly `$\sqrt{2/3N}$`. Similarly, in the grand canonical ensemble

```math
\langle(\Delta N)^2\rangle = kT\left(\frac{\partial\langle N\rangle}{\partial\mu}\right)_{T,V} = \langle N\rangle^2\frac{kT\kappa_T}{V}
```

which is `$\langle N\rangle$` (Poisson statistics) for the ideal gas. Move `$N$` in the figure: the distribution of energy per particle narrows to a spike.

<figure class="fig" data-fig="energy-sharpening"><figcaption>The canonical energy distribution P(E) ∝ Ω(E)e<sup>−E/kT</sup> for N two-level units. Ω(E) rises steeply and e<sup>−E/kT</sup> falls; their product is a peak whose relative width shrinks as 1/√N. For a macroscopic system the energy is effectively fixed, so canonical and microcanonical answers coincide.</figcaption></figure>

The exception is a critical point: there `$C_V$` or `$\kappa_T$` diverge, fluctuations become huge (critical opalescence) and the choice of ensemble matters for finite systems ([lesson 5.7](/learn/courses/gate-physics/phase-transitions/)).

## 5. Phase space, Liouville and ergodicity

Classical microstates are points in a `$6N$`-dimensional phase space. Two facts make the ensemble picture consistent:

- **Liouville’s theorem.** Hamilton's equations make the flow of phase points incompressible: `$d\rho/dt = \partial\rho/\partial t + \{\rho, H\} = 0$`. A uniform distribution on the energy shell stays uniform, so the microcanonical ensemble is stationary.
- **Ergodic hypothesis.** A single system, followed long enough, spends equal times in equal areas of its energy shell, so time averages (what we measure) equal ensemble averages (what we compute).

Counting quantum states from phase space: one state per volume `$h$` per degree of freedom. For the 1D oscillator the region `$H \le E$` is an ellipse of area `$2\pi E/\omega$`, giving `$E/\hbar\omega$` states, in agreement with the levels `$(n + \tfrac12)\hbar\omega$`. In many dimensions almost all of the volume of a ball lies in a thin outer shell (99% shell of a 100-dimensional ball: 63% of the volume), so "states below `$E$`" and "states near `$E$`" give the same entropy.

## 6. Negative temperature

For `$N$` two-level units (levels `$0$`, `$\varepsilon$`) with `$n$` excited, Stirling's formula gives

```math
\frac{S}{k} \approx N\ln N - n\ln n - (N - n)\ln(N - n), \qquad \frac{1}{kT} = \frac1\varepsilon\ln\frac{N - n}{n}
```

`$S(E)$` rises, peaks at `$n = N/2$` and falls again. Beyond the peak `$T < 0$`. This needs an energy spectrum with an upper bound (spins in a field, lasing atoms); a free gas can never do it.

**Worked example.** Nuclear spins with splitting `$1.0$` meV, prepared with 60% in the upper level: `$1/kT = \varepsilon^{-1}\ln(0.4/0.6)$`, so `$T = -28.6$` K.

<div class="myth">

**"A system at −200 K is colder than one at +300 K."** No. Heat flows from small `$\beta = 1/kT$` to large `$\beta$`, and `$\beta_{-200} < 0 < \beta_{300}$`. A negative-temperature system is hotter than any positive-temperature one: the order of hotness is `$+0$` K, …, `$+\infty$`, then `$-\infty$`, …, `$-0$` K. Order temperatures by `$-\beta$`, not by `$T$`.

</div>

<div class="keypoints">

- `$S = k\ln\Omega$`; `$1/T = \partial S/\partial E$`, `$P/T = \partial S/\partial V$`, `$\mu/T = -\partial S/\partial N$`. Gibbs entropy `$-k\sum p\ln p$` reduces to it for equal probabilities.
- Counting: `$\binom{N}{n}$` for two-state units, `$\binom{q + N - 1}{q}$` for an Einstein solid.
- Microcanonical `$(E, V, N)$`: `$p = 1/\Omega$`. Canonical `$(T, V, N)$`: `$p \propto e^{-\beta E}$`, `$F = -kT\ln Z$`. Grand canonical `$(T, V, \mu)$`: `$p \propto e^{-\beta(E - \mu N)}$`, `$PV = kT\ln\mathcal Z$`.
- `$\langle(\Delta E)^2\rangle = kT^2C_V$`, `$\langle(\Delta N)^2\rangle = kT\,\partial\langle N\rangle/\partial\mu$`; relative fluctuations `$\sim N^{-1/2}$` except near critical points.
- Liouville: phase-space volume is conserved; ergodicity links time and ensemble averages.
- Bounded spectra allow `$T < 0$`, which is hotter than any positive temperature.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. Check each answer, then read the full solution. More on the [GATE practice page](/learn/courses/gate-physics/practice/).

<div class="qbank" data-bank="physics" data-topics="ensembles" data-exam="gate" data-n="10"></div>

**Next:** [lesson 5.2, partition functions](/learn/courses/gate-physics/partition-functions/), where the canonical ensemble becomes a working tool for two-level systems, oscillators, rotors and paramagnets. fibub's [Ising model simulator](/science/ising-model/) shows microstates being sampled with the Boltzmann weight in real time.

**Going on to CSIR NET?** [Fluctuations, diffusion and Brownian motion](/learn/courses/csir-net-physics/fluctuations-brownian/) asks how far a system strays from these averages.

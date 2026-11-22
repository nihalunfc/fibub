---
title: 'Partition functions and thermodynamics'
seoTitle: Partition functions for GATE Physics
summary: 'The canonical partition function as a machine for thermodynamics: F, U, S and C from Z, factorisation, the two-level system and Schottky anomaly, the quantum oscillator, rotors with symmetry numbers and ortho/para hydrogen, paramagnets, Curie’s law and adiabatic demagnetisation.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: A two-level system has levels 0 and ε. Its mean energy at very high temperature tends to
    choices: ['ε/2', 'ε', 'kT', 'zero']
    ans: 0
    why: "U = ε/(e^{ε/kT} + 1) → ε/2 when kT ≫ ε: both levels equally full. It can never exceed ε/2 at positive temperature."
  - q: "Every energy level of a system is shifted up by E₀. Which quantity is unchanged?"
    choices: ['The heat capacity', 'The partition function', 'The free energy', 'The internal energy']
    ans: 0
    why: "Z → Z e^{−βE₀}, so F and U shift by E₀ but the probabilities, entropy and heat capacity are unchanged."
  - q: "For an ideal paramagnet the magnetisation depends on B and T only through"
    choices: ['B/T', 'BT', 'B − T', 'B²/T']
    ans: 0
    why: "Each moment has energies ∝ B, so Z depends on B/kT. This is why an adiabatic (constant-S) demagnetisation keeps B/T fixed and cools the salt."
sources:
  - 'R. K. Pathria and P. D. Beale, Statistical Mechanics, 4th ed. (Academic Press, 2021), chapter 3'
  - 'S. J. Blundell and K. M. Blundell, Concepts in Thermal Physics, 2nd ed. (Oxford, 2010), chapters 20 and 21'
  - 'F. Reif, Fundamentals of Statistical and Thermal Physics (McGraw-Hill, 1965; reissued 2009), chapter 7'
  - 'C. Kittel and H. Kroemer, Thermal Physics, 2nd ed. (W. H. Freeman, 1980), chapters 3 and 4'
  - 'GATE Physics (PH) syllabus, Statistical Physics section, published by the organising institute each year'
---

**Module 5 · about 45 minutes.** By the end you will be able to write down `$Z$` for any system with known levels, extract `$F$`, `$U$`, `$S$`, `$C$`, `$P$` and `$M$` from it, and work the standard models (two-level, oscillator, rotor, paramagnet) that GATE and CSIR NET use again and again. The ensemble ideas come from [lesson 5.1](/learn/courses/gate-physics/ensembles/).

<div class="bigidea">Z is a sum of Boltzmann factors. Its logarithm is the free energy in disguise, so once you have Z, every thermodynamic property is one derivative away.</div>

## 1. From Z to everything

```math
Z = \sum_j g_j\,e^{-\beta E_j}, \qquad F = -kT\ln Z
```

<div class="meaning">

<dl>
<dt>g<sub>j</sub></dt><dd>degeneracy: the number of microstates with energy E<sub>j</sub></dd>
<dt>β</dt><dd>1/kT. Derivatives with respect to β are often cleaner than with respect to T: ∂/∂β = −kT²∂/∂T.</dd>
<dt>Physical meaning</dt><dd>Z counts the number of states that are thermally accessible: about 1 when only the ground state is reached, and the total number of states when kT is much larger than every gap.</dd>
</dl>

</div>

The derivatives you need, all from `$F = -kT\ln Z$`:

| Quantity | From `$Z$` |
|---|---|
| internal energy | `$U = -\partial\ln Z/\partial\beta = kT^2\,\partial\ln Z/\partial T$` |
| entropy | `$S = (U - F)/T = k(\ln Z + \beta U)$` |
| heat capacity | `$C_V = \partial U/\partial T = k\beta^2\,\partial^2\ln Z/\partial\beta^2$` |
| pressure | `$P = kT\,\partial\ln Z/\partial V$` |
| magnetisation | `$M = kT\,\partial\ln Z/\partial B$` |
| chemical potential | `$\mu = -kT\,\partial\ln Z/\partial N$` |

**Factorisation.** If the energy is a sum of independent parts, `$Z$` is a product, and `$\ln Z$`, `$F$`, `$U$`, `$S$`, `$C$` are sums. `$N$` independent distinguishable units (spins on lattice sites): `$Z = Z_1^N$`. A dilute gas of identical molecules: `$Z = Z_1^N/N!$`, with `$Z_1 = Z_{\rm trans}Z_{\rm rot}Z_{\rm vib}Z_{\rm el}$`. Only `$Z_{\rm trans} = V/\lambda^3$` depends on volume, so internal motions never change `$PV = NkT$` ([lesson 5.3](/learn/courses/gate-physics/classical-gas-equipartition/)).

## 2. The two-level system and the Schottky anomaly

Levels `$0$` (degeneracy 1) and `$\varepsilon$` (degeneracy `$g$`), `$x = \varepsilon/kT$`:

```math
Z = 1 + g\,e^{-x}, \qquad U = \frac{g\varepsilon}{e^{x} + g}, \qquad C = k\,x^2\,\frac{g\,e^{x}}{(e^{x} + g)^2}
```

For `$g = 1$`, `$U = \varepsilon/(e^x + 1)$` rises to `$\varepsilon/2$` and `$C/k = x^2e^x/(1 + e^x)^2$` has a single bump of height `$0.44$` at `$kT = 0.42\varepsilon$`. At low `$T$` it is exponentially small (`$\propto x^2e^{-x}$`, the gap freezes the system); at high `$T$` it falls as `$1/T^2$` (the system is already as disordered as it can be). Such a bump on top of the lattice `$T^3$` in a heat-capacity measurement reveals crystal-field or hyperfine splittings.

<figure class="fig" data-fig="two-level"><figcaption>Upper-level share, entropy and heat capacity of a two-level system against kT/ε. The entropy climbs to k ln(1 + g); the heat capacity is a single Schottky bump. Changing g moves the high-temperature limits.</figcaption></figure>

**Worked example.** At `$kT = \varepsilon$` with `$g = 1$`: `$Z = 1.368$`, `$U = 0.269\varepsilon$`, `$S/k = \ln1.368 + 0.269 = 0.582$`, `$C/k = e/(1 + e)^2 = 0.197$`.

<div class="problem" data-problem="stat-schottky"></div>

## 3. The quantum harmonic oscillator

Levels `$(n + \tfrac12)\hbar\omega$`, a geometric series:

```math
Z = \frac{e^{-x/2}}{1 - e^{-x}} = \frac{1}{2\sinh(x/2)}, \qquad U = \hbar\omega\left(\frac12 + \frac{1}{e^{x} - 1}\right), \qquad C = k\frac{x^2e^x}{(e^x - 1)^2}
```

with `$x = \hbar\omega/kT$`. The mean quantum number `$\langle n\rangle = 1/(e^x - 1)$` is the Bose-Einstein occupation with `$\mu = 0$`: it is what we will use for photons and phonons in [lesson 5.5](/learn/courses/gate-physics/photon-phonon-gases/). Limits: `$kT \gg \hbar\omega$` gives `$U \to kT$` (equipartition) and `$C \to k$`; `$kT \ll \hbar\omega$` gives `$C \approx kx^2e^{-x}$`, which is why the Einstein solid fails at low `$T$` (it predicts an exponential, while experiment shows `$T^3$`).

**Worked example (vibrations).** Cl₂ has `$\theta_v = \hbar\omega/k = 805$` K. At 300 K, `$x = 2.68$` and the share of molecules with `$v \ge 1$` is `$e^{-x} = 6.8\%$`; the vibrational `$C/R = 0.57$`.

## 4. Rotors: symmetry numbers and ortho/para hydrogen

A linear rotor has levels `$J(J + 1)k\theta_r$` with degeneracy `$2J + 1$`, `$\theta_r = \hbar^2/2Ik$`:

```math
Z_{\rm rot} = \sum_{J=0}^\infty(2J + 1)e^{-J(J+1)\theta_r/T} \approx \frac{T}{\sigma\theta_r} + \frac13 + \ldots \quad (T \gg \theta_r)
```

The symmetry number `$\sigma = 2$` for homonuclear molecules, because only half the `$J$` values are allowed for each nuclear-spin state. For H₂ the coupling between nuclear spin and `$J$` is strict: para-H₂ (singlet) takes even `$J$`, ortho-H₂ (triplet, weight 3) odd `$J$`. At high `$T$` the ratio is 3 : 1; in true equilibrium at 77 K it falls to about 1 : 1, and at 20 K almost everything is para. The slow conversion releases heat, which plagued early hydrogen liquefiers.

The heat capacity of a whole diatomic gas puts sections 3 and 4 together. Pick a molecule:

<figure class="fig" data-fig="diatomic-cv"><figcaption>C<sub>V</sub>/R of an ideal diatomic gas from the partition function: 3/2 from translation, then rotation switching on around θ<sub>r</sub> (with a small overshoot, a quantum effect) and vibration around θ<sub>v</sub>/3. Classical equipartition would give 7/2 at all temperatures.</figcaption></figure>

## 5. Paramagnets

A moment `$\mu$` with two orientations in field `$B$` (energies `$\mp\mu B$`), `$x = \mu B/kT$`:

```math
Z_1 = 2\cosh x, \qquad M = N\mu\tanh x, \qquad \chi \approx \frac{\mu_0N\mu^2}{VkT}\ \ (x \ll 1)
```

For ions of angular momentum `$J$` the sum over `$m_J = -J, \ldots, J$` gives the Brillouin function `$B_J$`, with saturation moment `$gJ\mu_B$` and Curie constant `$\propto g^2J(J+1)$`. A classical moment free to point anywhere gives the Langevin function `$\coth x - 1/x$` and a susceptibility 3 times smaller than the two-state result at the same `$\mu$`.

**Adiabatic demagnetisation.** For an ideal paramagnet `$Z$` depends on `$B/T$` only, so `$S = S(B/T)$`. Magnetise at fixed `$T$` (entropy falls, heat flows out), isolate, then lower `$B$` slowly: `$S$` constant means `$B/T$` constant. Going from 2 T at 1 K to 0.05 T gives 25 mK (internal fields set the real floor).

<div class="myth">

**"Adding a constant to every energy level changes the thermodynamics."** It changes `$Z$` by a factor `$e^{-\beta E_0}$`, and so shifts `$F$` and `$U$` by `$E_0$`, but probabilities `$p_i = e^{-\beta E_i}/Z$` are untouched. Entropy, heat capacity, magnetisation and pressure (if `$E_0$` does not depend on `$V$`) are unchanged. This is why the oscillator's zero-point energy never shows up in `$C_V$`.

</div>

<div class="keypoints">

- `$Z = \sum g_je^{-\beta E_j}$`, `$F = -kT\ln Z$`, `$U = -\partial_\beta\ln Z$`, `$S = k(\ln Z + \beta U)$`, `$C_V = k\beta^2\partial_\beta^2\ln Z$`.
- Independent parts: `$Z$` multiplies; identical gas molecules: `$Z_1^N/N!$`.
- Two-level: `$U = \varepsilon/(e^x + 1) \le \varepsilon/2$`; Schottky peak `$0.44k$` at `$kT = 0.42\varepsilon$`.
- Oscillator: `$Z = 1/2\sinh(x/2)$`, `$\langle n\rangle = 1/(e^x - 1)$`, `$C = kx^2e^x/(e^x - 1)^2$`.
- Rotor: `$Z_{\rm rot} \approx T/\sigma\theta_r$`; H₂ ortho : para → 3 : 1 at high `$T$`.
- Paramagnet: `$M = N\mu\tanh(\mu B/kT)$`, Curie law, `$S = S(B/T)$` → adiabatic demagnetisation.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. Check each answer, then read the full solution. More on the [GATE practice page](/learn/courses/gate-physics/practice/).

<div class="qbank" data-bank="physics" data-topics="partition-functions" data-exam="gate" data-n="10"></div>

**Next:** [lesson 5.3, the classical ideal gas and equipartition](/learn/courses/gate-physics/classical-gas-equipartition/), where `$Z$` is an integral over phase space. For heat-capacity data, fibub's [heat capacity fitter](/science/heat-capacity-fitter/) separates electronic, Debye and Schottky terms.

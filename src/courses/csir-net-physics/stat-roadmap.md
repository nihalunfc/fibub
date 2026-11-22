---
title: 'Statistical physics: what NET asks and where to study it'
seoTitle: CSIR NET Physics statistical physics roadmap
summary: 'What CSIR NET asks from thermodynamics and statistical physics in Part B (laws of thermodynamics, potentials and Maxwell relations, ensembles and partition functions, classical and quantum statistics, Bose and Fermi gases, blackbody radiation) and Part C (phase transitions, magnetism, the Ising model, Bose-Einstein condensation, diffusion and Brownian motion), the study order, the lessons to use, a self-check list and a worked partition-function example.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: 'Each particle has a level at 0 and a doubly degenerate level at ε. At very high temperature the mean energy per particle tends to'
    choices: ['2ε/3', 'ε/2', 'ε', '0']
    ans: 0
    why: 'At high T all three states are equally likely; two of the three have energy ε, so the mean is 2ε/3.'
  - q: 'The chemical potential of a photon gas in equilibrium is'
    choices: ['zero', 'kT', 'equal to the Fermi energy', 'negative and large']
    ans: 0
    why: 'Photon number is not conserved (walls absorb and emit them), so the free energy is minimised with respect to N, which makes μ = 0.'
  - q: 'In the mean-field (Landau) theory of a second-order transition, the order parameter near T_c grows as'
    choices: ['(T_c − T)^(1/2)', '(T_c − T)', '(T_c − T)²', 'it jumps discontinuously']
    ans: 0
    why: 'Minimising a(T − T_c)m² + bm⁴ gives m² ∝ (T_c − T), so β = 1/2. A jump would be a first-order transition.'
sources:
  - 'CSIR-UGC NET Physical Sciences syllabus: Thermodynamic and Statistical Physics (core and advanced), CSIR HRDG / National Testing Agency, checked 2026-11-22'
  - 'R. K. Pathria and P. D. Beale, Statistical Mechanics, 3rd ed. (Academic Press, 2011)'
  - 'F. Reif, Fundamentals of Statistical and Thermal Physics (McGraw-Hill, 1965)'
  - 'K. Huang, Statistical Mechanics, 2nd ed. (Wiley, 1987)'
---

**Module 6 · about 30 minutes to read, 3 weeks to work through.** This roadmap covers what NET asks from thermodynamics and statistical physics, the order to study it, where each topic is taught, a worked example and a self-check list.

<div class="bigidea">Write the partition function, then differentiate. Mean energy, heat capacity, entropy, pressure, magnetisation and fluctuations all come from Z (or the grand partition function), and its high- and low-temperature limits tell you which option survives.</div>

## 1. What NET asks

Described from the published syllabus (check the current one):

**Part B (core):**
- The laws of thermodynamics and their consequences.
- Thermodynamic potentials, Maxwell relations, chemical potential and phase equilibria.
- Phase space, microstates and macrostates; the microcanonical, canonical and grand canonical ensembles and their partition functions.
- Free energy and its link to thermodynamic quantities.
- Classical and quantum statistics; ideal Bose and Fermi gases; detailed balance.
- Blackbody radiation and Planck's law.

**Part C (advanced):**
- First- and second-order phase transitions.
- Diamagnetism, paramagnetism and ferromagnetism; the Ising model.
- Bose-Einstein condensation.
- The diffusion equation, random walks and Brownian motion; an introduction to non-equilibrium processes.

<div class="meaning">

<dl>
<dt>Partition function</dt><dd>Z = Σ g_i e^(−E_i/kT), a sum over states (with degeneracies)</dd>
<dt>From Z</dt><dd>F = −kT ln Z, ⟨E⟩ = −∂ ln Z/∂β, S = −∂F/∂T, C = ∂⟨E⟩/∂T</dd>
<dt>Energy fluctuation</dt><dd>⟨ΔE²⟩ = kT²C in the canonical ensemble</dd>
<dt>Physical meaning</dt><dd>At low T only the lowest states matter (quantities freeze out exponentially); at high T every state is equally likely (classical limits, equipartition, entropy k ln of the number of states).</dd>
</dl>

</div>

## 2. The order to study it

1. **Thermodynamics** refresher from JAM: [first law](/learn/courses/iit-jam-physics/first-law/), [second law and entropy](/learn/courses/iit-jam-physics/second-law-entropy/), [potentials and Maxwell relations](/learn/courses/iit-jam-physics/thermodynamic-potentials/), [phase changes](/learn/courses/iit-jam-physics/phase-changes/), [kinetic theory](/learn/courses/iit-jam-physics/kinetic-theory/).
2. **Ensembles**: GATE [microstates, entropy and the ensembles](/learn/courses/gate-physics/ensembles/).
3. **Partition functions**: GATE [partition functions and free energy](/learn/courses/gate-physics/partition-functions/).
4. **Classical gas**: GATE [classical ideal gas and equipartition](/learn/courses/gate-physics/classical-gas-equipartition/).
5. **Quantum statistics**: GATE [Bose-Einstein and Fermi-Dirac statistics](/learn/courses/gate-physics/quantum-statistics/).
6. **Photons, phonons, condensation**: GATE [blackbody radiation and Bose-Einstein condensation](/learn/courses/gate-physics/photon-phonon-gases/); JAM [blackbody radiation](/learn/courses/iit-jam-physics/blackbody-radiation/) for the basics.
7. **Fermi gas**: GATE [the Fermi gas](/learn/courses/gate-physics/fermi-gas/).
8. **Phase transitions** (Part C): GATE [phase transitions](/learn/courses/gate-physics/phase-transitions/), and [magnetism](/learn/courses/gate-physics/magnetism/) for dia-, para- and ferromagnetism.
9. **NET extras in this course**: [lesson 6.2](/learn/courses/csir-net-physics/fluctuations-brownian/) (fluctuations, diffusion and Brownian motion), [lesson 6.3](/learn/courses/csir-net-physics/ising-landau/) (the Ising model and Landau theory) and [lesson 6.4](/learn/courses/csir-net-physics/transport/) (kinetic theory of transport).

## 3. Where each topic is taught

| Topic | Learn it from | NET emphasis |
|---|---|---|
| Laws, potentials, Maxwell relations | [JAM potentials](/learn/courses/iit-jam-physics/thermodynamic-potentials/), [JAM second law](/learn/courses/iit-jam-physics/second-law-entropy/) | deriving one partial derivative from others, C_P − C_V |
| Phase equilibria | [JAM phase changes](/learn/courses/iit-jam-physics/phase-changes/) | Clausius-Clapeyron, Gibbs phase rule |
| Ensembles | [GATE 5.1](/learn/courses/gate-physics/ensembles/) | counting microstates, S = k ln Ω |
| Partition functions | [GATE 5.2](/learn/courses/gate-physics/partition-functions/) | two-level and multi-level systems, Schottky peak |
| Classical gas, equipartition | [GATE 5.3](/learn/courses/gate-physics/classical-gas-equipartition/) | Maxwell distribution averages, Gibbs paradox |
| Bose and Fermi statistics | [GATE 5.4](/learn/courses/gate-physics/quantum-statistics/) | occupation numbers, classical limit |
| Photon and phonon gases, BEC | [GATE 5.5](/learn/courses/gate-physics/photon-phonon-gases/) | T⁴ law, Wien's law, condensation temperature |
| Fermi gas | [GATE 5.6](/learn/courses/gate-physics/fermi-gas/) | E_F from density, linear-T heat capacity, degeneracy pressure |
| Phase transitions, magnetism | [GATE 5.7](/learn/courses/gate-physics/phase-transitions/), [GATE 7.9](/learn/courses/gate-physics/magnetism/) | order of a transition, Curie-Weiss law, critical exponents |
| Brownian motion, Ising, transport | lessons 6.2 to 6.4 | ⟨x²⟩ = 2Dt, mean-field Ising, mean free path |

## 4. A worked NET-style example

**Question (Part C style).** A system of `$N$` independent, distinguishable particles has, for each particle, a non-degenerate level at energy 0 and a doubly degenerate level at energy `$\varepsilon$`. At very high temperature the mean energy and the entropy of the system tend to

(a) `$N\varepsilon/2$` and `$Nk\ln2$` (b) `$2N\varepsilon/3$` and `$Nk\ln3$` (c) `$N\varepsilon$` and `$Nk\ln3$` (d) `$2N\varepsilon/3$` and `$Nk\ln2$`.

**Solution.**

1. One particle: `$Z_1 = 1 + 2e^{-\beta\varepsilon}$`, and for distinguishable independent particles `$Z = Z_1^N$`.
2. Mean energy:

```math
\langle E\rangle = -N\frac{\partial\ln Z_1}{\partial\beta} = N\,\frac{2\varepsilon e^{-\beta\varepsilon}}{1 + 2e^{-\beta\varepsilon}} \;\xrightarrow{\;\beta\to0\;}\; \frac{2N\varepsilon}{3}
```

3. Entropy: at high `$T$` each particle is equally likely to be in any of its 3 states, so `$S \to Nk\ln3$`. (From the formula, `$S = Nk\ln Z_1 + \langle E\rangle/T$`, and as `$T \to \infty$` the second term vanishes while `$\ln Z_1 \to \ln3$`.)
4. Option (b).

**Traps.** Forgetting the degeneracy gives (a), the answer for a plain two-level system. Option (c) assumes the particles all go to the upper level, which never happens in equilibrium at positive temperature. **Low-temperature check:** `$\langle E\rangle \approx 2N\varepsilon e^{-\varepsilon/kT} \to 0$` and the heat capacity vanishes exponentially, the sign of a gap.

**A related live problem** (the non-degenerate two-level system):

<div class="problem" data-problem="net-two-level"></div>

## 5. Self-check before moving on

You are ready for electronics when you can, without notes:

- derive a Maxwell relation from a potential and use it to find `$(\partial S/\partial P)_T$`;
- count the microstates of `$N$` spins with `$n$` up and find the entropy for large `$N$`;
- write `$Z$` for a two-level system, an oscillator (classical and quantum) and a rigid rotor at high `$T$`;
- get `$\langle E\rangle$`, `$C$`, `$S$` and `$F$` from `$Z$`, and the energy fluctuation `$kT^2C$`;
- explain the Gibbs paradox and the `$1/N!$`;
- write the Bose-Einstein and Fermi-Dirac occupation numbers and their classical limit;
- derive the `$T^4$` law and Wien's displacement law from Planck's law;
- find `$E_F$` from the electron density, and why the electronic heat capacity is linear in `$T$`;
- give the condensation temperature of an ideal Bose gas in terms of the density;
- tell a first-order from a second-order transition, and write the Curie-Weiss law;
- use `$\langle x^2\rangle = 2Dt$` for a random walk in one dimension.

<div class="myth">

**"At high temperature, a two-level system ends up with all particles in the upper level."** It ends up with the levels equally filled (weighted by degeneracy), never inverted. A population inversion needs a non-equilibrium pump, which is why lasers need one.

</div>

<div class="keypoints">

- Part B: laws and potentials, ensembles and partition functions, classical and quantum statistics, Bose and Fermi gases, blackbody radiation.
- Part C: phase transitions, magnetism and the Ising model, Bose-Einstein condensation, diffusion and Brownian motion.
- Order: thermodynamics refresher, ensembles, partition functions, classical gas, quantum statistics, photons and condensation, Fermi gas, phase transitions, lessons 6.2 to 6.4.
- Everything from Z; check every option against the high- and low-temperature limits.

</div>

## Practise: a mixed statistical physics set

<div class="qbank" data-bank="physics" data-topics="ensembles,partition-functions,classical-gas-equipartition,quantum-statistics,photon-phonon-gases,fermi-gas,phase-transitions,thermodynamic-potentials,second-law-entropy" data-exam="net" data-n="10"></div>

**Next:** [electronics and experimental methods roadmap](/learn/courses/csir-net-physics/electronics-roadmap/).

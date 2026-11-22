---
title: 'Nuclear and particle physics: what NET asks'
seoTitle: CSIR NET Physics nuclear and particle physics roadmap
summary: 'What CSIR NET Part C asks from nuclear and particle physics (nuclear size, spin and parity, binding energy and the liquid-drop formula, the nuclear force and the deuteron, the shell model, alpha, beta and gamma decay, fission, fusion and reactions, particle quantum numbers, the quark model, C, P and T), the order to study it, the lessons to use, a self-check list and a worked shell-model example.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: 'The shell model predicts the ground-state spin and parity of ¹⁷O to be'
    choices: ['5/2⁺', '1/2⁻', '3/2⁺', '0⁺']
    ans: 0
    why: '¹⁷O has 8 protons (closed) and 9 neutrons: the ninth neutron sits alone in the 1d₅/₂ orbit, so J = 5/2 and parity (−1)² = +.'
  - q: 'A nucleus with A = 220 at rest alpha-decays with Q = 6.6 MeV. The alpha particle''s kinetic energy is'
    choices: ['6.48 MeV', '6.60 MeV', '0.12 MeV', '6.72 MeV']
    ans: 0
    why: 'Momentum conservation shares Q in the inverse ratio of the masses: T_α = Q(A − 4)/A = 6.6 × 216/220 = 6.48 MeV; the daughter recoils with the remaining 0.12 MeV.'
  - q: 'Using the Gell-Mann–Nishijima formula Q = I₃ + (B + S)/2, a baryon with I₃ = +1 and S = −1 has charge'
    choices: ['+1', '0', '−1', '+2']
    ans: 0
    why: 'Q = 1 + (1 − 1)/2 = +1. This is the Σ⁺ (quark content uus).'
sources:
  - 'CSIR-UGC NET Physical Sciences syllabus: Nuclear and Particle Physics (advanced), CSIR HRDG / National Testing Agency, checked 2026-11-22'
  - 'K. S. Krane, Introductory Nuclear Physics (Wiley, 1988)'
  - 'D. J. Griffiths, Introduction to Elementary Particles, 2nd ed. (Wiley-VCH, 2008)'
  - 'B. R. Martin, Nuclear and Particle Physics: An Introduction, 2nd ed. (Wiley, 2009)'
---

**Module 10 · about 30 minutes to read, 1 to 2 weeks to work through.** Nuclear and particle physics is a Part C unit whose questions repeat a small set of ideas: radius and binding energy scaling, shell-model spins and parities, decay kinematics and selection rules, and particle quantum numbers. That makes it very learnable. This roadmap gives what is asked, the order, the lessons, a worked example and a checklist.

<div class="bigidea">Nuclear and particle questions are mostly bookkeeping with conservation laws: energy and momentum for decays and reactions; angular momentum and parity for shell-model states and selection rules; charge, baryon number, lepton number, strangeness and isospin for particle reactions. Check each conserved quantity in turn and the answer is usually forced.</div>

## 1. What NET asks

Described from the published syllabus (check the current one). All of it is **Part C**:

- Basic nuclear properties: size, shape and charge distribution, spin and parity.
- Binding energy, the semi-empirical mass formula and the liquid-drop model.
- The nuclear force: the form of the nucleon-nucleon potential, charge independence and charge symmetry; the deuteron.
- Evidence for shell structure; the single-particle shell model, its successes and limits; rotational spectra of deformed nuclei.
- Alpha, beta and gamma decay and their selection rules.
- Fission and fusion; nuclear reactions, compound-nucleus and direct reactions.
- The fundamental forces; elementary particles and their quantum numbers (charge, spin, parity, isospin, strangeness); the Gell-Mann–Nishijima formula.
- The quark model, baryons and mesons; C, P and T invariance; symmetry arguments for particle reactions; parity violation in the weak interaction.
- Relativistic kinematics.

<div class="meaning">

<dl>
<dt>Nuclear radius</dt><dd>R ≈ 1.2 A^(1/3) fm, so nuclear density is nearly the same for all nuclei</dd>
<dt>Shell-model ground state (odd A)</dt><dd>J and parity of the last unpaired nucleon (or hole): parity (−1)^l</dd>
<dt>Q value</dt><dd>(initial rest mass − final rest mass)c²; positive means energy released</dd>
<dt>Gell-Mann–Nishijima</dt><dd>Q = I₃ + (B + S)/2 (with charm and others added to S when present)</dd>
<dt>Physical meaning</dt><dd>The strong force conserves almost everything; the weak force breaks strangeness, parity and charge conjugation, which is how you tell which force drives a decay.</dd>
</dl>

</div>

## 2. The order to study it

1. **Basics** from JAM: [nuclei, binding energy and radioactivity](/learn/courses/iit-jam-physics/nuclei-radioactivity/) and [nuclear reactions, fission and fusion](/learn/courses/iit-jam-physics/nuclear-reactions/).
2. **Nuclear properties and the mass formula**: the GATE lessons on nuclear size, spin and moments and on binding energy and the semi-empirical mass formula.
3. **Shell model**: the GATE lesson on the nuclear shell model. Revise GATE [angular momentum](/learn/courses/gate-physics/angular-momentum/) first if spin-orbit coupling is shaky.
4. **Decays and reactions**: the GATE lessons on alpha, beta and gamma decay and on nuclear reactions and Q values.
5. **Particles**: the GATE lessons on elementary particles and quarks and on conservation laws and symmetries.
6. **Relativistic kinematics**: GATE [four-vectors and relativistic kinematics](/learn/courses/gate-physics/relativistic-kinematics/) (thresholds and invariant mass).
7. **NET extras in this course**: lesson 10.2 (the deuteron and the nuclear force), lesson 10.3 (the collective model and nuclear deformation) and lesson 10.4 (isospin, strangeness and the quark model).

Several GATE nuclear lessons are still being written; until they appear, use the JAM lessons, the practice sets and the textbooks in the sources.

## 3. Where each topic is taught

| Topic | Learn it from | NET emphasis |
|---|---|---|
| Radioactivity, binding energy | [JAM nuclei](/learn/courses/iit-jam-physics/nuclei-radioactivity/) | decay chains, activity, B/A curve |
| Reactions, fission, fusion | [JAM reactions](/learn/courses/iit-jam-physics/nuclear-reactions/), GATE reactions lesson | Q value, threshold energy, compound nucleus |
| Size, spin, moments | GATE nuclear properties lesson | R ∝ A^(1/3), magnetic moments, quadrupole moments and shape |
| Mass formula | GATE mass formula lesson | most stable Z for given A, mirror-nucleus energies |
| Shell model | GATE shell model lesson | magic numbers, spin-parity, Schmidt lines |
| Decays and selection rules | GATE decays lesson | Gamow factor, Fermi and Gamow-Teller rules, multipolarity of gamma rays |
| Particles, quarks, symmetries | GATE particles and conservation lessons, lesson 10.4 | quark content, which force, allowed or forbidden reactions |
| Deuteron, nuclear force | lesson 10.2 | tensor force, mixed ³S₁ and ³D₁ ground state, only one bound state |
| Collective model | lesson 10.3 | rotational bands E ∝ J(J + 1), ratio E(4⁺)/E(2⁺) = 10/3 |
| Relativistic kinematics | [GATE 2.7](/learn/courses/gate-physics/relativistic-kinematics/) | thresholds, two-body decays at rest |

## 4. A worked NET-style example

**Question (Part C style).** In the single-particle shell model, the ground-state spins and parities of ¹⁷O, ¹⁵N and ⁴¹Ca are

(a) `$\tfrac52^+$`, `$\tfrac12^-$`, `$\tfrac72^-$` (b) `$\tfrac52^+$`, `$\tfrac32^-$`, `$\tfrac72^-$` (c) `$\tfrac12^+$`, `$\tfrac12^-$`, `$\tfrac72^+$` (d) `$\tfrac32^+$`, `$\tfrac12^+$`, `$\tfrac72^-$`.

**Solution.** With spin-orbit coupling the levels fill in the order `$1s_{1/2}$` (2), `$1p_{3/2}$` (4), `$1p_{1/2}$` (2), `$1d_{5/2}$` (6), `$2s_{1/2}$` (2), `$1d_{3/2}$` (4), `$1f_{7/2}$` (8), giving magic numbers 2, 8, 20, 28. The even group (protons or neutrons) pairs to `$0^+$`, so the odd nucleon or hole decides.

1. ¹⁷O: 8 protons (closed), 9 neutrons. The 9th neutron is the first in `$1d_{5/2}$`: `$J = \tfrac52$`, parity `$(-1)^2 = +$`.
2. ¹⁵N: 7 protons, 8 neutrons (closed). The protons are one short of filling `$1p_{1/2}$`: a hole in `$1p_{1/2}$`, so `$J = \tfrac12$`, parity `$(-1)^1 = -$`.
3. ⁴¹Ca: 20 protons (closed), 21 neutrons. The 21st neutron is the first in `$1f_{7/2}$`: `$J = \tfrac72$`, parity `$(-1)^3 = -$`.
4. Option (a).

**Traps.** Option (b) puts the ¹⁵N hole in `$1p_{3/2}$`, forgetting that spin-orbit coupling puts `$p_{1/2}$` above `$p_{3/2}$`. Options (c) and (d) get parities wrong: parity depends only on `$l$` (`$s, d$` even; `$p, f$` odd).

**A related live problem** (decay kinematics):

<div class="problem" data-problem="net-alpha-ke"></div>

## 5. Self-check before you finish the course

You are ready for full NET mocks when you can, without notes:

- compare the radii and densities of two nuclei from `$R = 1.2A^{1/3}$` fm;
- use the semi-empirical mass formula to find the most stable `$Z$` for a given `$A$` and the energy difference of mirror nuclei;
- explain why the deuteron has only one bound state and why its quadrupole moment shows a tensor force;
- give shell-model ground-state spins and parities for odd-A nuclei near magic numbers;
- find the alpha energy and recoil from a Q value, and explain the Geiger-Nuttall trend with the Gamow factor;
- classify a beta decay as Fermi or Gamow-Teller, allowed or forbidden, from the spins and parities;
- find the multipolarity of a gamma transition from the spins and parities of the levels;
- compute a reaction Q value and its threshold energy;
- give the quark content, charge, strangeness and isospin of common mesons and baryons;
- decide whether a particle reaction is allowed, and by which force, by checking each conservation law.

<div class="myth">

**"Parity is conserved in every decay."** It is conserved by the strong and electromagnetic interactions, but not by the weak interaction. Beta decay and the decays of strange particles violate parity, which is why spin-polarised beta decay emits electrons preferentially in one direction.

</div>

<div class="keypoints">

- Part C only: nuclear properties, mass formula, nuclear force and deuteron, shell and collective models, decays, reactions, particles and the quark model, symmetries, relativistic kinematics.
- Order: JAM basics, properties and mass formula, shell model, decays and reactions, particles, kinematics, lessons 10.2 to 10.4.
- Check each conservation law in turn; parity of a shell-model state is `$(-1)^l$`.

</div>

## Practise: a mixed nuclear and particle set

<div class="qbank" data-bank="physics" data-topics="nuclei-radioactivity,nuclear-reactions,relativistic-kinematics,special-relativity" data-exam="net" data-n="10"></div>

**Next:** you have the plan for every unit. Sit a full [mock test](/learn/courses/csir-net-physics/mock-test/), review it, and return to the roadmap of your weakest unit.

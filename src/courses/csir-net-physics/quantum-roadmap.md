---
title: 'Quantum mechanics: what NET asks and where to study it'
seoTitle: CSIR NET Physics quantum mechanics roadmap
summary: 'What CSIR NET asks from quantum mechanics in Part B (Schrödinger equation, operators and commutators, Dirac notation, angular momentum and spin, hydrogen, perturbation and variational methods, Fermi''s golden rule, identical particles) and Part C (spin-orbit coupling, WKB, scattering, Klein-Gordon and Dirac equations, semi-classical radiation), the study order, the lessons to use, a self-check list and a worked spin-measurement example.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: 'A spin-1/2 particle is in the state (|↑⟩ + 2|↓⟩)/√5. The probability of finding S_x = +ħ/2 is'
    choices: ['9/10', '1/5', '1/2', '4/5']
    ans: 0
    why: 'The S_x = +ħ/2 state is (|↑⟩ + |↓⟩)/√2. The overlap is (1 + 2)/√10, and its square is 9/10.'
  - q: 'For a particle in a 1D infinite well, the energy of level n grows as'
    choices: ['n²', 'n', '√n', 'n³']
    ans: 0
    why: 'Eₙ = n²π²ħ²/(2mL²). The oscillator grows linearly (n + ½)ħω, and hydrogen goes as −1/n².'
  - q: 'Which of these is a Part C (advanced) quantum topic in the NET syllabus?'
    choices: ['Partial waves, phase shifts and the Born approximation', 'The particle in a box', 'Commutators and the uncertainty principle', 'Spin and the Stern-Gerlach experiment']
    ans: 0
    why: 'Spin-orbit coupling, WKB, scattering theory, relativistic quantum mechanics and semi-classical radiation are advanced; the others are core.'
sources:
  - 'CSIR-UGC NET Physical Sciences syllabus: Quantum Mechanics (core and advanced), CSIR HRDG / National Testing Agency, checked 2026-11-22'
  - 'D. J. Griffiths and D. F. Schroeter, Introduction to Quantum Mechanics, 3rd ed. (Cambridge, 2018)'
  - 'J. J. Sakurai and J. Napolitano, Modern Quantum Mechanics, 3rd ed. (Cambridge, 2020)'
  - 'R. Shankar, Principles of Quantum Mechanics, 2nd ed. (Springer, 1994)'
---

**Module 5 · about 30 minutes to read, 4 weeks to work through.** Quantum mechanics is the single biggest unit in NET: it is a large part of Part B and the base of the atomic, condensed matter and nuclear questions in Part C. This roadmap shows what is asked, the order to study it, where it is taught, and how to check you are ready.

<div class="bigidea">Almost every NET quantum question is linear algebra in a small space: expand the state in the right basis, square the amplitudes, use a commutator or a ladder operator. The calculus problems (wells, barriers, hydrogen) need a handful of results you should know by heart.</div>

## 1. What NET asks

Described from the published syllabus (check the current one):

**Part B (core):**
- Wave-particle duality; the time-dependent and time-independent Schrödinger equation.
- Eigenvalue problems: particle in a box, harmonic oscillator; tunnelling through a barrier.
- Wavefunctions in position and momentum space; commutators and the uncertainty principle; Dirac notation.
- Central potentials: orbital angular momentum and its algebra, spin, addition of angular momenta, the hydrogen atom, the Stern-Gerlach experiment.
- Time-independent perturbation theory; the variational method.
- Time-dependent perturbation theory, Fermi's golden rule and selection rules.
- Identical particles, the Pauli principle and the spin-statistics connection.

**Part C (advanced):**
- Spin-orbit coupling and fine structure.
- The WKB approximation.
- Scattering: phase shifts, partial waves and the Born approximation.
- Relativistic quantum mechanics: the Klein-Gordon and Dirac equations.
- Semi-classical theory of radiation.

<div class="meaning">

<dl>
<dt>Born rule</dt><dd>the probability of result a is |⟨a|ψ⟩|² for a normalised state</dd>
<dt>Commutator</dt><dd>[A, B] = AB − BA; ΔA ΔB ≥ ½|⟨[A, B]⟩|</dd>
<dt>First-order shift</dt><dd>E⁽¹⁾ = ⟨n|H′|n⟩; second order is always negative for the ground state</dd>
<dt>Golden rule</dt><dd>transition rate = (2π/ħ)|⟨f|H′|i⟩|² ρ(E_f)</dd>
<dt>Physical meaning</dt><dd>A measurement picks one eigenvalue at random with the Born probabilities; everything else (averages, spreads, rates) is built from those squares.</dd>
</dl>

</div>

## 2. The order to study it

1. **Refresh the basics** if needed with JAM [matter waves](/learn/courses/iit-jam-physics/matter-waves/) and [the Schrödinger equation](/learn/courses/iit-jam-physics/schrodinger-equation/).
2. **The formal frame**: GATE [linear vector spaces and Dirac notation](/learn/courses/gate-physics/linear-vector-spaces/), [postulates and operators](/learn/courses/gate-physics/postulates-operators/), [commutators and uncertainty](/learn/courses/gate-physics/commutators-uncertainty/).
3. **Solvable problems**: GATE [one-dimensional potentials](/learn/courses/gate-physics/one-dimensional-potentials/) and [the harmonic oscillator](/learn/courses/gate-physics/harmonic-oscillator/).
4. **Angular momentum**: GATE [angular momentum](/learn/courses/gate-physics/angular-momentum/), then the GATE lessons on [the hydrogen atom](/learn/courses/gate-physics/hydrogen-atom/) and on [spin and the addition of angular momenta](/learn/courses/gate-physics/spin-addition/).
5. **Approximation methods**: the GATE lessons on [time-independent perturbation theory](/learn/courses/gate-physics/perturbation-theory/), [the variational method and WKB](/learn/courses/gate-physics/variational-wkb/), and [time-dependent perturbation theory](/learn/courses/gate-physics/time-dependent-perturbation/).
6. **Identical particles**: the GATE lesson on [identical particles](/learn/courses/gate-physics/identical-particles/).
7. **Fine structure** (Part C): GATE [hydrogen spectra and fine structure](/learn/courses/gate-physics/fine-structure/).
8. **NET extras in this course**: [lesson 5.2](/learn/courses/csir-net-physics/scattering-theory/) (scattering: Born approximation and partial waves) and [lesson 5.3](/learn/courses/csir-net-physics/relativistic-quantum/) (Klein-Gordon and Dirac equations).

Some GATE quantum lessons in steps 4 to 6 are still being written; until they appear, the practice sets and the textbooks in the sources cover them.

## 3. Where each topic is taught

| Topic | Learn it from | NET emphasis |
|---|---|---|
| Postulates, operators | [GATE 4.1](/learn/courses/gate-physics/postulates-operators/) | expectation values, measurement and collapse, Hermiticity |
| Commutators, uncertainty | [GATE 4.2](/learn/courses/gate-physics/commutators-uncertainty/) | [x, p] identities, minimum-uncertainty states |
| Wells, barriers, delta potentials | [GATE 4.3](/learn/courses/gate-physics/one-dimensional-potentials/), [JAM](/learn/courses/iit-jam-physics/schrodinger-equation/) | bound-state counting, transmission, parity |
| Harmonic oscillator | [GATE 4.4](/learn/courses/gate-physics/harmonic-oscillator/) | ladder operators, ⟨x²⟩ in level n, coherent states |
| Angular momentum | [GATE 4.5](/learn/courses/gate-physics/angular-momentum/) | L² and L_z eigenvalues, Pauli matrices, raising operators |
| Hydrogen, spin, addition | GATE lessons [4.6](/learn/courses/gate-physics/hydrogen-atom/) and [4.7](/learn/courses/gate-physics/spin-addition/) | degeneracy n², Clebsch-Gordan for two spin-½ |
| Perturbation, variational, WKB | GATE lessons [4.8](/learn/courses/gate-physics/perturbation-theory/) and [4.9](/learn/courses/gate-physics/variational-wkb/) | first- and second-order shifts, trial functions, WKB quantisation |
| Golden rule, selection rules | [GATE lesson 4.10](/learn/courses/gate-physics/time-dependent-perturbation/) | Δl = ±1, transition rates |
| Identical particles | [GATE lesson 4.11](/learn/courses/gate-physics/identical-particles/) | symmetric and antisymmetric states, exchange |
| Fine structure | [GATE 6.1](/learn/courses/gate-physics/fine-structure/) | spin-orbit splitting, j quantum numbers |
| Scattering | [lesson 5.2](/learn/courses/csir-net-physics/scattering-theory/) | Born amplitude of a Yukawa potential, s-wave phase shift |
| Relativistic QM | [lesson 5.3](/learn/courses/csir-net-physics/relativistic-quantum/) | Dirac matrices, negative energies, spin from the Dirac equation |

## 4. A worked NET-style example

**Question (Part B style).** A spin-½ particle is in the normalised state `$|\psi\rangle = \frac{1}{\sqrt5}\big(|{\uparrow}\rangle + 2|{\downarrow}\rangle\big)$`, where the arrows are eigenstates of `$S_z$`. A measurement of `$S_x$` gives `$+\hbar/2$` with probability

(a) `$1/2$` (b) `$1/5$` (c) `$9/10$` (d) `$4/5$`.

**Solution.**

1. The eigenstate of `$S_x$` with eigenvalue `$+\hbar/2$` is `$|{+x}\rangle = \frac{1}{\sqrt2}\big(|{\uparrow}\rangle + |{\downarrow}\rangle\big)$`.
2. The amplitude is

```math
\langle +x|\psi\rangle = \frac{1}{\sqrt2}\cdot\frac{1}{\sqrt5}(1 + 2) = \frac{3}{\sqrt{10}}
```

3. The probability is `$9/10$`: option (c).

**Check.** `$\langle S_x\rangle = \frac\hbar2\left(\frac{9}{10} - \frac{1}{10}\right) = \frac{2\hbar}{5}$`. Directly, for a state `$(a, b)$`, `$\langle\sigma_x\rangle = 2\,\text{Re}(a^*b) = 2\cdot\frac{1\cdot2}{5} = \frac45$`, so `$\langle S_x\rangle = \frac{2\hbar}{5}$`. The two agree. The tempting wrong answers are `$1/5$` (the `$S_z$` probability of up) and `$4/5$` (the `$S_z$` probability of down): reading the amplitudes in the wrong basis.

**Part C follow-up.** If the result was `$+\hbar/2$`, the state is now `$|{+x}\rangle$`, and a following `$S_z$` measurement gives up or down with probability `$1/2$` each: the earlier `$S_z$` information is gone.

**A related live problem.** The particle in a box sets the scale of quantum energies:

<div class="problem" data-problem="net-box-level"></div>

## 5. Self-check before moving on

You are ready for statistical physics when you can, without notes:

- find probabilities, `$\langle A\rangle$` and `$\Delta A$` for a state written in any basis;
- evaluate commutators like `$[x, p^2]$`, `$[L_x, L_y]$` and `$[a, a^\dagger]$`;
- write the energies and parities of the box and oscillator levels, and count bound states of a finite well;
- use `$a$` and `$a^\dagger$` to find `$\langle x^2\rangle$` in level `$n$` of the oscillator;
- list the allowed `$l$`, `$m$` for hydrogen level `$n$` and its degeneracy (with spin, `$2n^2$`);
- add two spin-½ (and a spin-1 and a spin-½) and give the possible total `$j$`;
- do first-order perturbation theory, including a degenerate pair, and a one-parameter variational estimate;
- state Fermi's golden rule and the electric-dipole selection rules;
- write the symmetric and antisymmetric two-particle states and explain why fermions avoid each other;
- write the first Born amplitude as a Fourier transform of the potential.

<div class="myth">

**"Quantum questions in NET are mostly long calculations."** Most are short if you choose the basis well. When a question looks long, look for a symmetry (parity, rotation) or an operator identity first; the intended route is usually three lines.

</div>

<div class="keypoints">

- Part B: Schrödinger equation and solvable problems, operators and commutators, Dirac notation, angular momentum and spin, hydrogen, approximation methods, golden rule, identical particles.
- Part C: spin-orbit coupling, WKB, scattering, Klein-Gordon and Dirac, semi-classical radiation.
- Order: formal frame, 1D problems and the oscillator, angular momentum and hydrogen, approximation methods, identical particles, fine structure, lessons [5.2](/learn/courses/csir-net-physics/scattering-theory/) and [5.3](/learn/courses/csir-net-physics/relativistic-quantum/).
- Probabilities are squares of overlaps in the basis of the quantity measured.

</div>

## Practise: a mixed quantum set

<div class="qbank" data-bank="physics" data-topics="postulates-operators,commutators-uncertainty,one-dimensional-potentials,harmonic-oscillator,angular-momentum,schrodinger-equation,fine-structure,linear-vector-spaces" data-exam="net" data-n="10"></div>

**Next:** [statistical physics roadmap](/learn/courses/csir-net-physics/stat-roadmap/).

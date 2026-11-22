---
title: Small oscillations and normal modes
seoTitle: Small oscillations and normal modes for GATE Physics
summary: 'Expanding about a stable equilibrium, the mass and stiffness matrices, the secular equation det(K − ω²M) = 0, normal coordinates and their orthogonality, beats, zero modes, a linear triatomic molecule, the double pendulum, and the chain of beads that turns into a wave.'
minutes: 50
updated: 2026-11-22
quiz:
  - q: 'A free linear molecule of three atoms, joined by two springs, moves only along its axis. How many normal modes does it have, and how many have zero frequency?'
    choices: ['Two modes, none at zero', 'Three modes, none at zero', 'Three modes, one at zero', 'Three modes, two at zero']
    ans: 2
    why: Three coordinates give three modes. Shifting the whole molecule costs no energy, so one mode (uniform translation) has ω = 0. The other two are the symmetric and antisymmetric stretches.
  - q: 'Two identical pendulums joined by a weak spring are started with one swinging and the other at rest. What happens?'
    choices: ['The energy passes back and forth between them at the difference of the two mode frequencies', 'Both settle into equal swinging at once', 'The second pendulum never moves', 'The motion grows without limit']
    ans: 0
    why: The start is an equal mixture of the in-step mode (ω₁) and the opposite mode (ω₂). Their sum beats, so each pendulum's amplitude swells and fades and the energy swaps over with period 2π/(ω₂ − ω₁).
  - q: 'In the secular equation det(K − ω²M) = 0, a negative root ω² means'
    choices: ['A mode with a very low frequency', 'An error, since roots are always positive', 'A mode that does not move', 'The equilibrium is unstable along that mode']
    ans: 3
    why: ω² < 0 makes the mode grow as e^(|ω|t) instead of oscillating. It happens when the potential has a maximum or saddle along that direction, so K is not positive definite.
sources:
  - 'H. Goldstein, C. Poole and J. Safko, Classical Mechanics, 3rd ed. (2002), chapter 6'
  - 'L. D. Landau and E. M. Lifshitz, Mechanics, 3rd ed. (1976), chapter 5'
  - 'A. P. French, Vibrations and Waves (1971), chapters 5 and 6'
  - 'GATE Physics syllabus (Classical Mechanics), IIT organising institute; CSIR-UGC NET Physical Sciences syllabus, Part A Classical Mechanics'
---

**Module 2 · about 50 minutes.** By the end you will be able to set up the mass and stiffness matrices for any system near equilibrium, find its normal-mode frequencies and shapes, use symmetry to guess modes, spot zero modes and instabilities, and see how a chain of masses turns into a wave.

The single oscillator and two coupled pendulums are in the JAM lessons on [simple harmonic motion](/learn/courses/iit-jam-physics/simple-harmonic-motion/) and [superposition and coupled oscillators](/learn/courses/iit-jam-physics/superposition-coupled/). Here the method is made general with matrices.

<div class="bigidea">Near a stable equilibrium every system, however complicated, is a set of independent simple harmonic oscillators. Finding them is an eigenvalue problem.</div>

## 1. Expanding about equilibrium

Take a system with generalised coordinates `$q_1, \dots, q_n$` (lesson 2.1, [Lagrangian mechanics](/learn/courses/gate-physics/lagrangian-mechanics/)), fixed constraints, and an equilibrium where `$\partial V/\partial q_j = 0$`. Measure each coordinate from there, `$\eta_j = q_j - q_j^{(0)}$`, and keep terms up to second order:

```math
V \approx \tfrac12\sum_{jk}K_{jk}\,\eta_j\eta_k, \quad K_{jk} = \left.\frac{\partial^2V}{\partial q_j\partial q_k}\right|_0, \qquad T \approx \tfrac12\sum_{jk}M_{jk}\,\dot\eta_j\dot\eta_k
```

Both `$K$` and `$M$` are constant symmetric matrices (`$M$` evaluated at equilibrium). The equilibrium is **stable** when `$K$` is positive definite, so that `$V$` has a true minimum. The Euler-Lagrange equations become `$M\ddot\eta + K\eta = 0$`, a set of coupled linear equations.

## 2. The secular equation

Try a solution where everything moves at one frequency with fixed proportions, `$\eta = a\cos(\omega t + \phi)$`. Then `$(K - \omega^2M)a = 0$`, which has a non-zero `$a$` only if

```math
\det\left(K - \omega^2M\right) = 0
```

This polynomial of degree `$n$` in `$\omega^2$` gives `$n$` **normal-mode frequencies**. Each root's `$a$` is the **mode shape**. The general motion is a sum of all the modes, each with its own amplitude and phase set by the starting conditions.

<div class="meaning">

<dl>
<dt>K<sub>jk</sub></dt><dd>stiffness matrix: how much force on coordinate j a unit displacement of coordinate k causes</dd>
<dt>M<sub>jk</sub></dt><dd>mass (inertia) matrix: from the kinetic energy; off-diagonal terms are inertial coupling</dd>
<dt>ω²</dt><dd>eigenvalues of M⁻¹K; all positive at a stable equilibrium</dd>
<dt>a<sup>(r)</sup></dt><dd>the shape of mode r: the fixed ratios in which every part moves, all in step or in antiphase</dd>
<dt>Physical meaning</dt><dd>A normal mode is a way of moving in which every part oscillates at the same frequency and passes through equilibrium at the same instant, so the pattern keeps its shape for ever.</dd>
</dl>

</div>

**Worked example: two masses hanging from one wall.** A mass `$m$` is joined to a wall by a spring `$k$`, and a second mass `$m$` hangs from the first by another spring `$k$` (motion along the line only). Then

```math
K = \begin{pmatrix}2k & -k\\ -k & k\end{pmatrix}, \quad M = m\,I, \qquad (2k - m\omega^2)(k - m\omega^2) - k^2 = 0
```

So `$m^2\omega^4 - 3km\omega^2 + k^2 = 0$` and `$\omega^2 = \tfrac{3\mp\sqrt5}{2}\,\tfrac km$`, about `$0.382\,k/m$` and `$2.618\,k/m$`. For the slow mode, `$a_2/a_1 = 2 - 0.382 = 1.618$`: both masses move the same way, the outer one further, by the golden ratio. For the fast mode, `$a_2/a_1 = -0.618$`.

## 3. Normal coordinates and orthogonality

Mode shapes belonging to different frequencies are **orthogonal with the mass matrix as weight**: `$a^{(r)\,T}Ma^{(s)} = 0$` for `$r \ne s$`. Scale them so that `$a^{(r)\,T}Ma^{(r)} = 1$` and collect them as the columns of a matrix `$A$`. Then `$A^TMA = I$` and `$A^TKA = {\rm diag}(\omega_1^2, \dots, \omega_n^2)$`. The **normal coordinates** `$\zeta = A^{-1}\eta$` separate the Lagrangian completely:

```math
L = \sum_r\tfrac12\left(\dot\zeta_r^2 - \omega_r^2\zeta_r^2\right)
```

Each `$\zeta_r$` is one independent oscillator, and the energy in it never leaks to the others while the motion stays small. In quantum mechanics each becomes a ladder of levels `$(n_r + \tfrac12)\hbar\omega_r$`: phonons in a crystal, photons in a cavity.

## 4. Symmetry finds modes, beats show them

When the system has a symmetry, the mode shapes must be symmetric or antisymmetric under it, so they can often be guessed without solving anything.

**Two masses between walls.** Two masses `$m$` are joined to their walls by springs `$k$` and to each other by a spring `$k_c$`. Swapping the masses is a symmetry, so the modes are `$(1, 1)$` and `$(1, -1)$`. In step, the middle spring never stretches: `$\omega_1^2 = k/m$`. In opposition, each mass stretches the middle spring by twice its own displacement: `$\omega_2^2 = (k + 2k_c)/m$`.

<div class="problem" data-problem="two-mass-modes"></div>

**Beats.** Start mass 1 at displacement `$A$` and mass 2 at zero, both at rest. That is half of each mode, so `$x_1 = A\cos\bar\omega t\,\cos\Delta t$` and `$x_2 = A\sin\bar\omega t\,\sin\Delta t$`, with `$\bar\omega = (\omega_1 + \omega_2)/2$` and `$\Delta = (\omega_2 - \omega_1)/2$`. For a weak coupling the masses swap all their energy back and forth with period `$2\pi/(\omega_2 - \omega_1)$`. The same arithmetic describes neutrino oscillations and the transfer of an electron between two identical wells.

**Zero modes.** If nothing ties the system to the outside (a free molecule, two masses joined only to each other), moving everything together costs no energy, `$\omega = 0$`. The "mode" is a steady drift `$\zeta = c_1 + c_2t$`, not an oscillation. A free three-dimensional body has six such modes (three translations and three rotations), a linear molecule five.

**Worked example: a linear triatomic molecule.** Model CO₂ as masses `$m$`, `$M$`, `$m$` in a line with springs `$k$` (motion along the axis). The three modes are:

<div class="steps">
<div class="step"><p><b>Translation.</b> All three move together: ω = 0.</p></div>
<div class="step"><p><b>Symmetric stretch.</b> By symmetry the centre atom stays still and the outer ones move in opposite directions: each is a mass m on one spring, ω = √(k/m).</p></div>
<div class="step"><p><b>Antisymmetric stretch.</b> The outer atoms move together and the centre moves the other way, keeping the centre of mass fixed: m x + M X + m x = 0, so X = −2mx/M, and ω = √((k/m)(1 + 2m/M)).</p></div>
</div>

For CO₂ (`$m/M = 16/12$`) the ratio of the two stretch frequencies is `$\sqrt{1 + 8/3} = 1.91$`. The measured ratio, 2349 cm⁻¹ to 1388 cm⁻¹, is 1.69: the simple model leaves out the coupling between the two bonds, but it gets the order and the size right. Only the antisymmetric stretch changes the dipole moment, so only it absorbs infrared light; this is the vibration behind CO₂'s greenhouse effect.

## 5. Inertial coupling: the double pendulum

Coupling can sit in the mass matrix rather than the springs. Two equal bobs `$m$` on equal light rods `$l$`, one hanging from the other, have for small angles

```math
M = ml^2\begin{pmatrix}2 & 1\\ 1 & 1\end{pmatrix}, \qquad K = mgl\begin{pmatrix}2 & 0\\ 0 & 1\end{pmatrix}
```

Here `$K$` is diagonal and all the coupling is in `$M$`. The secular equation gives `$\omega^2 = (2\mp\sqrt2)\,g/l$`, that is `$0.586\,g/l$` and `$3.414\,g/l$`, with shapes `$\theta_2/\theta_1 = +\sqrt2$` (in step) and `$-\sqrt2$` (opposite). At larger amplitudes the double pendulum is chaotic; normal modes describe only the small motions.

**Small oscillations about steady motion.** The same method works about any steady state, not only rest. A circular orbit is an equilibrium of the effective potential (lesson 2.4, [central forces and scattering](/learn/courses/gate-physics/central-force-scattering/)), and small radial oscillations about it have `$\omega_r^2 = U_{\rm eff}''(r_0)/\mu$`. The bead on the spinning hoop of [lesson 2.1](/learn/courses/gate-physics/lagrangian-mechanics/) oscillates about its tilted equilibrium at `$\omega' = \omega\sin\theta_0$`.

<div class="myth">

**"A system started in a normal mode will drift into the other modes."** Not while the motion is small and linear. Each normal coordinate is an independent oscillator and its energy stays put. Energy moves between modes only through the cubic and higher terms left out of the expansion. When Fermi, Pasta, Ulam and Tsingou put a weak nonlinearity in a chain in 1955, they expected the energy to spread evenly and were surprised that it came back almost entirely to the first mode.

</div>

## 6. The beaded string and the wave limit

Put `$N$` beads of mass `$m$`, spaced `$a$`, on a string of tension `$T$` fixed at both ends, and let them move sideways. Each bead feels `$(T/a)(y_{j+1} - 2y_j + y_{j-1})$`. Try `$y_j = A\sin(jk a)$`: the walls (`$y_0 = y_{N+1} = 0$`) need `$k a = n\pi/(N + 1)$`, and then

```math
\omega_n = 2\omega_0\sin\frac{n\pi}{2(N + 1)}, \qquad \omega_0 = \sqrt{\frac{T}{ma}}, \qquad n = 1, \dots, N
```

<figure class="fig" data-fig="normal-modes-chain"><figcaption>N beads on a taut string. Each mode keeps its shape (a sampled sine) while it swings; the dots below mark all N frequencies, crowded together near 2ω₀. Pluck one bead instead and the shape keeps changing, because it mixes modes whose frequencies are not in whole-number ratios.</figcaption></figure>

Three lessons sit in this formula.

- **Only N modes.** Mode `$N + 1$` would put every bead at a node; higher `$n$` just repeat lower ones. A lattice has a shortest wavelength, `$2a$`, and a highest frequency, `$2\omega_0$`.
- **Dispersion.** `$\omega$` is not proportional to `$k$`. Short waves travel more slowly than long ones: the group velocity `$d\omega/dk$` falls to zero at the edge `$k = \pi/a$`. This is the acoustic phonon branch of a crystal.
- **The continuum limit.** Let `$N \to \infty$` with `$\mu = m/a$` and `$L = (N + 1)a$` fixed. For low modes, `$\omega_n \approx n\pi\sqrt{T/\mu}/L$`: the harmonics of a continuous string, with wave speed `$\sqrt{T/\mu}$`. The equations of motion become the wave equation. See the JAM lesson on [waves](/learn/courses/iit-jam-physics/waves/).

**Worked example.** Three beads (`$N = 3$`) give `$\omega_n/\omega_0 = 2\sin(n\pi/8)$` = 0.765, 1.414, 1.848. The middle mode has shape `$(1, 0, -1)$`: the centre bead sits still at a node. Each outer bead then moves between two fixed points a distance `$a$` away on either side, exactly like a single bead (`$N = 1$`), so `$\omega = \sqrt{2T/(ma)} = \sqrt2\,\omega_0$`, as the formula says.

<div class="keypoints">

- Near equilibrium: `$V = \tfrac12\eta^TK\eta$`, `$T = \tfrac12\dot\eta^TM\dot\eta$`, with `$K$` the Hessian of `$V$`; stable when `$K$` is positive definite.
- Secular equation `$\det(K - \omega^2M) = 0$`; `$n$` frequencies, each with a fixed mode shape.
- Modes are `$M$`-orthogonal; normal coordinates make `$L$` a sum of independent oscillators.
- Use symmetry: `$(1, 1)$` and `$(1, -1)$` for two identical masses; `$\omega^2 = k/m$` and `$(k + 2k_c)/m$`. Beats swap energy at `$\omega_2 - \omega_1$`.
- Free systems have zero modes; negative `$\omega^2$` means instability.
- Linear triatomic: `$0$`, `$\sqrt{k/m}$`, `$\sqrt{(k/m)(1 + 2m/M)}$`. Double pendulum: `$\omega^2 = (2\mp\sqrt2)g/l$`.
- Beaded string: `$\omega_n = 2\omega_0\sin\dfrac{n\pi}{2(N + 1)}$`; `$N$` modes, dispersion, wave equation in the continuum limit.

</div>

As the number of beads grows, the beaded string becomes a continuous one. Pluck a continuous string and see it as a sum of its normal modes.

<figure class="fig" data-fig="@wt-string-modes"><figcaption>Each normal mode oscillates at its own frequency, and any motion is the sum of modes with weights set by the initial shape: b_n ∝ sin(nπx₀/L)/n². Notice which modes are absent when you pluck at a node of that mode.</figcaption></figure>


## Practise: exam questions on this lesson

They start easy and climb to top-rank level. More on the [normal modes practice page](/learn/courses/gate-physics/practice/normal-modes/).

<div class="qbank" data-bank="physics" data-topics="normal-modes" data-exam="gate" data-n="10"></div>

**Before this:** lesson 2.4, [central forces and scattering](/learn/courses/gate-physics/central-force-scattering/). **Next:** lesson 2.6, [rigid body dynamics](/learn/courses/gate-physics/rigid-body-dynamics/).

**Going on to CSIR NET?** [Phase space and stability](/learn/courses/csir-net-physics/phase-space-stability/) classifies the fixed points these modes oscillate about, and [nonlinear dynamics and chaos](/learn/courses/csir-net-physics/nonlinear-dynamics-chaos/) asks what happens when the amplitude is not small.

---
title: 'Classical mechanics: what NET asks and where to study it'
seoTitle: CSIR NET Physics classical mechanics roadmap
summary: 'What CSIR NET asks from classical mechanics in Part B (Lagrangian and Hamiltonian mechanics, central forces, collisions, rigid bodies, small oscillations, relativity) and Part C (phase space and stability, Poisson brackets and canonical transformations, Noether''s theorem, Hamilton-Jacobi theory), the study order, the GATE and JAM lessons to use, a self-check list and a worked normal-mode example.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: 'A particle of mass m moves in the plane with V = ½k(x² + y² + xy). The ratio of its two normal-mode frequencies is'
    choices: ['√3', '2', '3', '√2']
    ans: 0
    why: 'The stiffness matrix k[[1, ½], [½, 1]] has eigenvalues 3k/2 and k/2, so ω² is in the ratio 3 : 1 and the frequencies are in the ratio √3.'
  - q: 'Is the transformation Q = p, P = −q canonical?'
    choices: ['Yes: {Q, P} = 1', 'No: {Q, P} = −1', 'No: it changes the Hamiltonian', 'Only for a harmonic oscillator']
    ans: 0
    why: '{Q, P} = {p, −q} = −{p, q} = {q, p} = 1, so the fundamental bracket is kept and the map is canonical (it swaps the roles of coordinate and momentum).'
  - q: 'A fixed point of a 2D system has a Jacobian with eigenvalues ±2i. Linear analysis says it is'
    choices: ['A centre (closed orbits around it)', 'A saddle', 'A stable spiral', 'An unstable node']
    ans: 0
    why: 'Purely imaginary eigenvalues give oscillation with no growth or decay: a centre. Real parts of opposite sign would give a saddle, negative real parts a stable node or spiral.'
sources:
  - 'CSIR-UGC NET Physical Sciences syllabus: Classical Mechanics (core and advanced), CSIR HRDG / National Testing Agency, checked 2026-11-22'
  - 'H. Goldstein, C. Poole and J. Safko, Classical Mechanics, 3rd ed. (Addison-Wesley, 2002)'
  - 'L. D. Landau and E. M. Lifshitz, Mechanics, 3rd ed. (Pergamon, 1976)'
  - 'S. H. Strogatz, Nonlinear Dynamics and Chaos, 2nd ed. (Westview, 2015)'
---

**Module 3 · about 30 minutes to read, 2 weeks to work through.** This roadmap covers what NET asks from classical mechanics, the order to learn it, where each topic is taught on fibub, a worked example in NET style and a checklist to finish with.

<div class="bigidea">NET mechanics rewards one habit: write the Lagrangian or Hamiltonian first. Conserved quantities, equations of motion, small-oscillation frequencies and phase-space pictures all come out of that one function, usually in a few lines.</div>

## 1. What NET asks

Described from the published syllabus (check the current one):

**Part B (core):**
- Newton's laws; non-inertial frames and pseudo-forces.
- Central-force motion; two-body collisions and scattering in the laboratory and centre-of-mass frames.
- Rigid bodies: the moment of inertia tensor.
- The variational principle, generalised coordinates, Lagrangian and Hamiltonian equations; conservation laws and cyclic coordinates.
- Small oscillations and normal modes.
- Special relativity: Lorentz transformations, relativistic kinematics, mass-energy equivalence.

**Part C (advanced):**
- Dynamical systems: phase-space dynamics and stability analysis.
- Poisson brackets and canonical transformations.
- Symmetry, invariance and Noether's theorem.
- Hamilton-Jacobi theory.

Part B questions are usually one clean step: count degrees of freedom, read off a conserved momentum, find a normal-mode frequency or a relativistic threshold energy. Part C questions test the formal machinery (is this map canonical? what does this generating function give? is this fixed point stable?) or ask for a full phase-space picture.

<div class="meaning">

<dl>
<dt>Cyclic coordinate</dt><dd>a coordinate absent from L; its conjugate momentum ∂L/∂q̇ is conserved</dd>
<dt>Normal mode</dt><dd>a motion in which every coordinate oscillates at one frequency; ω² are the eigenvalues of M⁻¹K</dd>
<dt>Canonical transformation</dt><dd>a change of (q, p) that keeps {Q, P} = 1 and so keeps Hamilton's equations</dd>
<dt>Physical meaning</dt><dd>Symmetries of L give conservation laws (Noether); the shape of V near a minimum gives the oscillation frequencies.</dd>
</dl>

</div>

## 2. The order to study it

1. **Refresh Newtonian mechanics** if needed: JAM [Newton's laws and frames](/learn/courses/iit-jam-physics/newtons-laws-frames/), [collisions](/learn/courses/iit-jam-physics/work-energy-collisions/), [central forces](/learn/courses/iit-jam-physics/central-forces/), [rigid-body rotation](/learn/courses/iit-jam-physics/rigid-body-rotation/).
2. **Lagrangian mechanics**: GATE [Lagrangian mechanics](/learn/courses/gate-physics/lagrangian-mechanics/) (constraints, Euler-Lagrange equations, Noether's theorem).
3. **Hamiltonian mechanics**: GATE [Hamiltonian mechanics](/learn/courses/gate-physics/hamiltonian-mechanics/) (Legendre transform, phase space).
4. **Poisson brackets and canonical transformations**: GATE [Poisson brackets](/learn/courses/gate-physics/poisson-brackets/).
5. **Central forces and scattering**: GATE [central forces and scattering](/learn/courses/gate-physics/central-force-scattering/).
6. **Small oscillations**: GATE [normal modes](/learn/courses/gate-physics/normal-modes/).
7. **Rigid bodies**: GATE [inertia tensor and Euler's equations](/learn/courses/gate-physics/rigid-body-dynamics/).
8. **Relativity**: JAM [special relativity](/learn/courses/iit-jam-physics/special-relativity/), then GATE [four-vectors and relativistic kinematics](/learn/courses/gate-physics/relativistic-kinematics/).
9. **NET extras in this course**: [lesson 3.2](/learn/courses/csir-net-physics/hamilton-jacobi/) (canonical transformations and Hamilton-Jacobi theory), [lesson 3.3](/learn/courses/csir-net-physics/phase-space-stability/) (phase space, fixed points and stability) and [lesson 3.4](/learn/courses/csir-net-physics/nonlinear-dynamics-chaos/) (nonlinear dynamics and chaos).

## 3. Where each topic is taught

| Topic | Learn it from | NET emphasis |
|---|---|---|
| Lagrangian, constraints, Noether | [GATE 2.1](/learn/courses/gate-physics/lagrangian-mechanics/) | conserved quantities from symmetry, velocity-dependent potentials |
| Hamiltonian, phase space | [GATE 2.2](/learn/courses/gate-physics/hamiltonian-mechanics/) | phase-space area, H for a charge in a field |
| Poisson brackets, canonical maps | [GATE 2.3](/learn/courses/gate-physics/poisson-brackets/), [lesson 3.2](/learn/courses/csir-net-physics/hamilton-jacobi/) | checking canonicity, generating functions |
| Central forces, scattering | [GATE 2.4](/learn/courses/gate-physics/central-force-scattering/), [JAM central forces](/learn/courses/iit-jam-physics/central-forces/) | effective potential, orbit stability, cross-sections |
| Normal modes | [GATE 2.5](/learn/courses/gate-physics/normal-modes/) | frequencies from trace and determinant, zero modes |
| Rigid bodies | [GATE 2.6](/learn/courses/gate-physics/rigid-body-dynamics/) | inertia tensor of simple shapes, principal axes |
| Relativity | [GATE 2.7](/learn/courses/gate-physics/relativistic-kinematics/), [JAM relativity](/learn/courses/iit-jam-physics/special-relativity/) | invariant mass, threshold energies, velocity addition |
| Non-inertial frames | [JAM Newton's laws and frames](/learn/courses/iit-jam-physics/newtons-laws-frames/) | Coriolis and centrifugal terms |
| Stability, chaos, Hamilton-Jacobi | lessons 3.2 to 3.4 | fixed-point types, Lyapunov exponents, separation of the HJ equation |

## 4. A worked NET-style example

**Question (Part B style).** A particle of mass `$m$` moves in the plane in the potential `$V = \tfrac12k(x^2 + y^2 + xy)$`. Its normal-mode angular frequencies are

(a) `$\sqrt{k/m}$` and `$\sqrt{2k/m}$` (b) `$\sqrt{3k/2m}$` and `$\sqrt{k/2m}$` (c) `$\sqrt{3k/m}$` and `$\sqrt{k/m}$` (d) `$\sqrt{k/2m}$` only.

**Solution.**

1. Write `$V = \tfrac12\,\mathbf q^{T}K\mathbf q$` with `$\mathbf q = (x, y)$`. The cross term `$\tfrac12kxy$` is split equally between the two off-diagonal entries:

```math
K = k\begin{pmatrix}1 & 1/2\\ 1/2 & 1\end{pmatrix}, \qquad M = m\begin{pmatrix}1 & 0\\ 0 & 1\end{pmatrix}
```

2. Normal modes solve `$\det(K - \omega^2M) = 0$`. The eigenvalues of the symmetric matrix are `$k(1 \pm \tfrac12)$`, along `$(1, 1)$` and `$(1, -1)$`.
3. So `$\omega^2 = 3k/2m$` (the in-phase mode, `$x = y$`) and `$\omega^2 = k/2m$` (the out-of-phase mode, `$x = -y$`): option (b).

**Check.** The two `$\omega^2$` must add to `$\text{tr}(M^{-1}K) = 2k/m$` and multiply to `$\det(M^{-1}K) = \tfrac34k^2/m^2$`. They do. The classic trap is to put `$k$` (not `$k/2$`) in the off-diagonal entries, which gives option (c).

**A related live problem.** Near a minimum, any potential looks like a spring with stiffness `$V''$`:

<div class="problem" data-problem="net-double-well"></div>

## 5. Self-check before moving on

You are ready for electromagnetism when you can, without notes:

- count degrees of freedom and choose generalised coordinates for a double pendulum and a bead on a rotating hoop;
- write the Lagrangian of a charge in electromagnetic fields and its canonical momentum `$\vec p = m\vec v + q\vec A$`;
- go from a Lagrangian to the Hamiltonian, and read conserved quantities off either;
- test a transformation for canonicity with a Poisson bracket, and use a generating function `$F_2(q, P)$`;
- find the radius and stability of a circular orbit from the effective potential;
- find normal-mode frequencies of two or three coupled masses and recognise a zero-frequency mode;
- find the principal moments of inertia of a cube about its body diagonal;
- compute the threshold energy of a reaction using the invariant mass;
- classify a 2D fixed point (node, saddle, spiral, centre) from the trace and determinant of its Jacobian.

<div class="myth">

**"Hamilton-Jacobi theory is too abstract to be asked."** NET asks it in a very concrete way: separate the HJ equation for a free particle or an oscillator, or say what a given generating function does. One worked example of each is enough.

</div>

<div class="keypoints">

- Part B: Lagrangian and Hamiltonian mechanics, conservation laws, central forces and collisions, rigid bodies, small oscillations, relativity.
- Part C: phase space and stability, Poisson brackets and canonical transformations, Noether's theorem, Hamilton-Jacobi theory.
- Order: Lagrangian, Hamiltonian, Poisson brackets, central forces, normal modes, rigid bodies, relativity, then lessons 3.2 to 3.4.
- Normal modes: ω² are the eigenvalues of `$M^{-1}K$`; check with trace and determinant.

</div>

## Practise: a mixed mechanics set

<div class="qbank" data-bank="physics" data-topics="lagrangian-mechanics,hamiltonian-mechanics,poisson-brackets,central-force-scattering,normal-modes,rigid-body-dynamics,relativistic-kinematics,special-relativity" data-exam="net" data-n="10"></div>

**Next:** [electromagnetic theory roadmap](/learn/courses/csir-net-physics/em-roadmap/).

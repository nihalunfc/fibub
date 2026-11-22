---
title: Canonical transformations and Hamilton-Jacobi theory
seoTitle: Hamilton-Jacobi theory for CSIR NET Physics
summary: 'The Hamilton-Jacobi equation and Hamilton''s principal and characteristic functions, solving problems by separation of variables, action-angle variables and frequencies without solving the motion, adiabatic invariants (pendulum, oscillator, gyrating charge, magnetic mirror), the Kepler problem and its degeneracy, Bohr-Sommerfeld quantisation and the link to the Schrödinger equation.'
minutes: 55
updated: 2026-11-22
quiz:
  - q: 'An oscillator''s frequency is increased slowly from 2 Hz to 6 Hz. If its energy was 1 J, its energy afterwards is'
    choices: ['3 J', '1 J', '9 J', '1/3 J']
    ans: 0
    why: 'The action J = E/ν is an adiabatic invariant, so E grows in proportion to ν: 1 J × 6/2 = 3 J.'
  - q: 'In Hamilton-Jacobi theory the new Hamiltonian is chosen to be'
    choices: ['zero, so every new coordinate and momentum is constant', 'equal to the old one', 'the Lagrangian', 'the action variable']
    ans: 0
    why: 'The principal function S generates a canonical transformation with K = H + ∂S/∂t = 0; then Hamilton''s equations make all new variables constant.'
  - q: 'For a particle in a box of width L, the action is J = ∮ p dq = 2Lp. If L is doubled slowly, the energy becomes'
    choices: ['one quarter of its value', 'half its value', 'twice its value', 'unchanged']
    ans: 0
    why: 'J is invariant, so p ∝ 1/L and E = p²/2m ∝ 1/L²: doubling L gives a quarter of the energy.'
sources:
  - 'H. Goldstein, C. Poole and J. Safko, Classical Mechanics, 3rd ed. (2002), chapter 10'
  - 'L. D. Landau and E. M. Lifshitz, Mechanics, 3rd ed. (1976), chapter 7'
  - 'J. V. José and E. J. Saletan, Classical Dynamics: A Contemporary Approach (1998), chapter 6'
  - 'CSIR-UGC NET Physical Sciences syllabus, Classical Mechanics (Poisson brackets, canonical transformations, Hamilton-Jacobi)'
---

**Module 3 · about 55 minutes.** By the end you will be able to write and solve the Hamilton-Jacobi equation by separation of variables, find action variables and use them to get frequencies without solving the motion, apply adiabatic invariance to slowly changing systems, and connect all of this to the old quantum theory and to the Schrödinger equation.

This lesson builds on two GATE lessons; read them first if canonical transformations are new: [Hamiltonian mechanics](/learn/courses/gate-physics/hamiltonian-mechanics/) and [Poisson brackets and canonical transformations](/learn/courses/gate-physics/poisson-brackets/) (generating functions, the canonical test `$\{Q, P\} = 1$`).

<div class="bigidea">Choose new variables so cleverly that nothing changes in time. The function that does it, Hamilton's principal function, is the classical action, and its constant momenta (the actions) are exactly the quantities that survive slow changes and that the old quantum theory quantised.</div>

## 1. The Hamilton-Jacobi equation

A type-2 generating function `$S(q, P, t)$` gives `$p = \partial S/\partial q$`, `$Q = \partial S/\partial P$` and the new Hamiltonian `$K = H + \partial S/\partial t$`. Demand `$K = 0$`:

```math
H\left(q_1, \dots, q_n, \frac{\partial S}{\partial q_1}, \dots, \frac{\partial S}{\partial q_n}, t\right) + \frac{\partial S}{\partial t} = 0
```

Then `$\dot P = \dot Q = 0$`: the new momenta are constants `$\alpha_i$`, the new coordinates are constants `$\beta_i = \partial S/\partial\alpha_i$`, and solving these `$n$` equations for `$q_i(t)$` gives the motion. Along the true path `$dS/dt = \sum p_i\dot q_i - H = L$`, so `$S$` is the action `$\int L\,dt$`.

For a time-independent `$H$`, put `$S = W(q, \alpha) - Et$`. Hamilton's **characteristic function** `$W$` obeys

```math
H\left(q, \frac{\partial W}{\partial q}\right) = E
```

**Worked example: the oscillator.** `$\dfrac{1}{2m}W'^2 + \tfrac12m\omega^2q^2 = E$` gives `$W = \int\sqrt{2mE - m^2\omega^2q^2}\,dq$`. Then

<div class="steps">
<div class="step"><p><b>Differentiate with respect to E.</b> ∂W/∂E = ∫ m dq / √(2mE − m²ω²q²) = (1/ω) arcsin(q √(mω²/2E)).</p></div>
<div class="step"><p><b>Set ∂S/∂E = β.</b> ∂W/∂E − t = β, so arcsin(q √(mω²/2E)) = ω(t + β).</p></div>
<div class="step"><p><b>Solve.</b> q = √(2E/mω²) sin ω(t + β): the familiar motion, with the constants E and β as amplitude and time origin.</p></div>
</div>

Move the two wobble sliders away from zero and watch the action, then press True path.

<figure class="fig" data-fig="@mech-action-path"><figcaption>Any wobble with the same start and end raises the action, so the true path is where the action is stationary (here a minimum).</figcaption></figure>

## 2. Separation of variables

The equation is a nonlinear PDE, but it is often **separable**: try `$W = W_1(q_1) + W_2(q_2) + \dots$`. Each piece then obeys an ordinary equation with its own separation constant.

- **Cartesian:** `$V = V_1(x) + V_2(y) + V_3(z)$` separates, with `$E = \alpha_1 + \alpha_2 + \alpha_3$`.
- **Spherical:** `$V = a(r) + \dfrac{b(\theta)}{r^2} + \dfrac{c(\phi)}{r^2\sin^2\theta}$` separates. A cyclic coordinate (here `$\phi$` if `$c = 0$`) gives `$\partial W/\partial\phi = p_\phi$` = constant.
- **Parabolic:** the Coulomb potential plus a uniform field, `$-k/r + Fz$` (the Stark problem).

**Worked example: planar Kepler.** `$\dfrac{1}{2m}\left[W_r'^2 + \dfrac{W_\theta'^2}{r^2}\right] - \dfrac kr = E$`. `$\theta$` is cyclic, so `$W_\theta = l\theta$` with `$l$` the angular momentum, and `$W_r = \int\sqrt{2m(E + k/r) - l^2/r^2}\,dr$`. Setting `$\partial W/\partial l = \beta_2$` gives the conic orbit.

## 3. Action-angle variables

For a periodic motion, define the **action**

```math
J = \oint p\,dq
```

the area enclosed by the orbit in phase space (some books divide by `$2\pi$`; then every frequency below gains a `$2\pi$`). Use `$J$` as the new momentum: `$H = H(J)$`, the conjugate **angle** `$w$` is cyclic, and

```math
\dot w = \frac{\partial H}{\partial J} = \nu(J), \qquad w = \nu t + \beta, \qquad \frac{dJ}{dE} = \frac1\nu = T
```

So the frequency comes from `$J(E)$` alone, without solving for `$q(t)$`.

<div class="meaning">

<dl>
<dt>J = ∮ p dq</dt><dd>the action: the phase-space area inside the orbit, in J s (the units of ħ)</dd>
<dt>w</dt><dd>the angle variable: it increases by exactly 1 per cycle</dd>
<dt>ν = ∂H/∂J</dt><dd>the frequency of the motion, found by differentiating the energy as a function of the action</dd>
<dt>T = dJ/dE</dt><dd>the period: how fast the enclosed area grows as you raise the energy</dd>
<dt>Physical meaning</dt><dd>Each degree of freedom of an integrable system moves round a circle at a steady rate. The actions say which circle (they are constants), the angles say where on it. Quantum mechanics later made the circles discrete: J ≈ (n + ½)h.</dd>
</dl>

</div>

| System | `$J(E)$` | `$E(J)$` | Period |
|---|---|---|---|
| oscillator | `$2\pi E/\omega$` | `$\nu J$` | `$2\pi/\omega$`, independent of `$E$` |
| particle in a box, width `$L$` | `$2L\sqrt{2mE}$` | `$J^2/8mL^2$` | `$2L/v$` |
| `$V = k\vert q\vert$` | `$\dfrac{8\sqrt{2m}}{3k}E^{3/2}$` | `$\propto J^{2/3}$` | `$4\sqrt{2mE}/k$` |
| `$V \propto \vert q\vert^n$` | `$\propto E^{1/2 + 1/n}$` | `$\propto J^{2n/(n+2)}$` | `$\propto E^{1/n - 1/2}$` |

<figure class="fig" data-fig="action-area"><figcaption>Phase-space orbits for V = |q|ⁿ. The shaded area is the action J at the chosen energy; the readout gives the period T = dJ/dE and the frequency. For the oscillator the area grows exactly in proportion to E, so the period never changes; for |q| it grows faster than E (periods lengthen), for q⁴ slower (periods shorten).</figcaption></figure>

**The Kepler problem.** For bound orbits, `$H = -\dfrac{2\pi^2mk^2}{(J_r + J_\theta + J_\phi)^2}$`. All three frequencies are equal: the orbit closes, and `$T \propto J^3 \propto a^{3/2}$` (Kepler's third law). Any extra force, such as a `$1/r^3$` term from general relativity, separates the frequencies and the ellipse precesses.

<div class="problem" data-problem="action-oscillator"></div>

## 4. Adiabatic invariants

If a parameter of `$H$` (a length, a spring constant, a field) changes slowly compared with the period, the energy changes but **the action stays constant**. This is the most useful result of the lesson for NET.

**Worked example: the shortening pendulum.** A small-amplitude pendulum's string is pulled from 1 m to 0.25 m.

<div class="steps">
<div class="step"><p><b>Invariant.</b> J = E/ν stays fixed, and ν ∝ l<sup>−1/2</sup>, so E ∝ l<sup>−1/2</sup>: the energy doubles.</p></div>
<div class="step"><p><b>Amplitude.</b> E = ½ m g l θ₀², so θ₀² ∝ E/l ∝ l<sup>−3/2</sup> and θ₀ ∝ l<sup>−3/4</sup>.</p></div>
<div class="step"><p><b>Number.</b> θ₀ grows by 4<sup>3/4</sup> = 2.83: the swing widens as the string shortens.</p></div>
</div>

Other cases: an oscillator whose frequency is raised keeps `$E/\omega$`, so its energy rises in proportion. A gas particle in a box with a slowly receding wall keeps `$J = 2Lp$`, so `$E \propto L^{-2}$`. A charge gyrating in a magnetic field keeps its magnetic moment `$\mu = mv_\perp^2/2B$` (equivalently the flux through its orbit), so `$K_\perp \propto B$`. In a **magnetic mirror**, with constant speed, `$\sin^2\alpha/B$` is fixed, and a particle at the centre is reflected only if `$\sin^2\alpha_0 > B_0/B_{\max}$`; smaller pitch angles form the loss cone.

<div class="problem" data-problem="pendulum-adiabatic"></div>

<div class="myth">

**"The energy is conserved when the change is slow."** No: the Hamiltonian depends on time, so energy is not conserved, however slow the change. What survives is the action. Doubling an oscillator's frequency slowly doubles its energy; the work is done by whatever changes the parameter. The quantum version is the adiabatic theorem: the system stays in the same level `$n$` while that level's energy moves.

</div>

## 5. From Hamilton-Jacobi to quantum mechanics

Put `$\psi = A\,e^{iS/\hbar}$` into the Schrödinger equation. The terms of order `$\hbar^0$` give exactly the Hamilton-Jacobi equation for `$S$`, and the next order gives a continuity equation for `$A^2$`. Classical trajectories are the rays perpendicular to the wavefronts `$S$` = constant, as light rays are to optical wavefronts: this is the WKB (semiclassical) limit.

The old quantum theory quantised the actions, `$\oint p\,dq = nh$`. The WKB rule adds the Maslov correction: `$J = (n + \tfrac12)h$` for two soft turning points, which gives the oscillator exactly, `$E = (n + \tfrac12)\hbar\omega$`. For hard walls the phases cancel and `$J = nh$` gives the box levels `$n^2h^2/8mL^2$` exactly.

<div class="keypoints">

- HJ equation: `$H(q, \partial S/\partial q, t) + \partial S/\partial t = 0$`; new variables `$\alpha_i$`, `$\beta_i = \partial S/\partial\alpha_i$` are constants; `$dS/dt = L$`.
- Time-independent: `$S = W - Et$`, `$H(q, \partial W/\partial q) = E$`; separate coordinate by coordinate.
- Action `$J = \oint p\,dq$` (phase-space area); `$\nu = \partial H/\partial J$`; period `$T = dJ/dE$`.
- Oscillator `$J = 2\pi E/\omega$`; box `$E = J^2/8mL^2$`; `$V \propto |q|^n$`: `$E \propto J^{2n/(n+2)}$`.
- Adiabatic invariance: slow changes keep `$J$`. Pendulum `$\theta_0 \propto l^{-3/4}$`; gyration `$\mu$` fixed; mirror loss cone `$\sin^2\alpha_0 = B_0/B_{\max}$`.
- Kepler: `$H$` depends on `$J_r + J_\theta + J_\phi$` only, so orbits close; `$T \propto J^3$`.
- `$\psi \sim e^{iS/\hbar}$`: HJ is the `$\hbar\to0$` limit of Schrödinger; `$J = (n + \tfrac12)h$`.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. More on the [practice page](/learn/courses/csir-net-physics/practice/).

<div class="qbank" data-bank="physics" data-topics="hamilton-jacobi,poisson-brackets" data-exam="net" data-n="10"></div>

**Next:** lesson 3.3, [phase space, fixed points and stability](/learn/courses/csir-net-physics/phase-space-stability/). For central forces and orbits see the [GATE lesson on central forces and scattering](/learn/courses/gate-physics/central-force-scattering/), and for the quantum side the [GATE lesson on one-dimensional potentials](/learn/courses/gate-physics/one-dimensional-potentials/).

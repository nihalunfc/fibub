---
title: Hamiltonian mechanics and phase space
seoTitle: Hamiltonian mechanics and phase space for GATE Physics
summary: 'The Legendre transform from L to H, Hamilton''s equations, when H is the energy and when it is conserved, phase space and phase portraits, the pendulum''s separatrix, Liouville''s theorem, the Routhian, action variables and adiabatic invariants.'
minutes: 50
updated: 2026-11-22
quiz:
  - q: 'For a particle in a rotating frame, H = p²/2m + V(r) − ω·L, with ω constant. Which statement is true?'
    choices: ['H is conserved but is not the energy measured in the rotating frame', 'H is not conserved because the frame rotates', 'H equals the kinetic plus potential energy in the inertial frame', 'H is conserved only if V = 0']
    ans: 0
    why: H has no explicit time dependence, so dH/dt = ∂H/∂t = 0 and H is conserved. It is the Jacobi integral, which includes the −ω·L term and so is not T + V in either frame.
  - q: 'Liouville''s theorem says that, for a Hamiltonian system, a cloud of phase points'
    choices: ['Shrinks to a point', 'Keeps its phase-space volume while it moves and changes shape', 'Keeps its shape exactly', 'Spreads until it fills all of phase space at once']
    ans: 1
    why: Hamiltonian flow has zero divergence in phase space (∂q̇/∂q + ∂ṗ/∂p = ∂²H/∂q∂p − ∂²H/∂p∂q = 0), so the density of points is constant along the flow and the volume is preserved. The shape can stretch and fold.
  - q: 'A pendulum''s length is shortened very slowly. Which quantity stays (almost) constant?'
    choices: ['Its energy', 'Its amplitude', 'Its period', 'Its energy divided by its frequency']
    ans: 3
    why: For slow changes the action J = ∮p dq is an adiabatic invariant. For small oscillations J = 2πE/ω, so E/ω stays fixed while E and ω both change.
sources:
  - 'H. Goldstein, C. Poole and J. Safko, Classical Mechanics, 3rd ed. (2002), chapters 8 and 10'
  - 'L. D. Landau and E. M. Lifshitz, Mechanics, 3rd ed. (1976), chapter 7'
  - 'V. I. Arnold, Mathematical Methods of Classical Mechanics, 2nd ed. (1989), chapters 3 and 9'
  - 'GATE Physics syllabus (Classical Mechanics), IIT organising institute; CSIR-UGC NET Physical Sciences syllabus, Part A Classical Mechanics'
---

**Module 2 · about 50 minutes.** By the end you will be able to build a Hamiltonian from a Lagrangian, write and solve Hamilton's equations, tell when H is conserved and when it is the energy, sketch and read phase portraits, use Liouville's theorem, and use adiabatic invariants for slowly changing systems.

This lesson builds on lesson 2.1, [Lagrangian mechanics](/learn/courses/gate-physics/lagrangian-mechanics/).

<div class="bigidea">Trade n second-order equations in q for 2n first-order equations in q and p. The motion becomes a flow in phase space, and that flow has a geometry (it keeps volumes) that Newton's form hides.</div>

## 1. The Legendre transform

The Lagrangian is a function of `$q$` and `$\dot q$`. To use the momentum `$p = \partial L/\partial\dot q$` as a variable instead of `$\dot q$`, take the **Legendre transform**:

```math
H(q, p, t) = \sum_j p_j\dot q_j - L(q, \dot q, t), \qquad \text{with every } \dot q_j \text{ written in terms of } q, p
```

The last step matters: `$H$` must be a function of `$q$` and `$p$` only. Leaving a `$\dot q$` in it is the commonest mistake. The transform works when `$p = \partial L/\partial\dot q$` can be solved for `$\dot q$` (the matrix `$\partial^2L/\partial\dot q_j\partial\dot q_k$` is invertible).

**Worked example: polar coordinates.** `$L = \tfrac12m(\dot r^2 + r^2\dot\theta^2) - U(r)$` gives `$p_r = m\dot r$` and `$p_\theta = mr^2\dot\theta$`. Then `$\dot r = p_r/m$`, `$\dot\theta = p_\theta/(mr^2)$`, and

```math
H = \frac{p_r^2}{2m} + \frac{p_\theta^2}{2mr^2} + U(r)
```

**Worked example: a charge.** From `$L = \tfrac12mv^2 + q\vec v\cdot\vec A - q\phi$`, `$\vec p = m\vec v + q\vec A$`, so `$H = \dfrac{(\vec p - q\vec A)^2}{2m} + q\phi$`. The rule `$\vec p \to \vec p - q\vec A$` (minimal coupling) carries over directly into quantum mechanics.

## 2. Hamilton's equations

Take the differential of `$H$` and use the Euler-Lagrange equation `$\dot p_j = \partial L/\partial q_j$`:

```math
\dot q_j = \frac{\partial H}{\partial p_j}, \qquad \dot p_j = -\frac{\partial H}{\partial q_j}, \qquad \frac{dH}{dt} = \frac{\partial H}{\partial t} = -\frac{\partial L}{\partial t}
```

<div class="meaning">

<dl>
<dt>(q, p)</dt><dd>a point in phase space: 2n numbers that fix the state completely, so the future follows from them alone</dd>
<dt>q̇ = ∂H/∂p</dt><dd>the velocity follows from the momentum (for H = p²/2m + V it is just p/m)</dd>
<dt>ṗ = −∂H/∂q</dt><dd>the force: momentum changes as H falls with q</dd>
<dt>dH/dt = ∂H/∂t</dt><dd>H is conserved whenever it has no explicit time dependence</dd>
<dt>Physical meaning</dt><dd>H is the generator of time evolution. Knowing one function of (q, p) tells you how every point of phase space moves in the next instant.</dd>
</dl>

</div>

A cyclic coordinate is even more useful here: if `$q_k$` is missing from `$H$`, then `$p_k$` is a constant number `$\alpha$` and can be put straight into `$H$`, which then has one fewer degree of freedom. In the central-force `$H$` above, `$p_\theta = \ell$` and the radial problem is `$H = p_r^2/2m + U_{\rm eff}(r)$`.

**Worked example.** `$H = \dfrac{p^2}{2m} + \tfrac12m\omega^2q^2$`. Hamilton's equations give `$\dot q = p/m$` and `$\dot p = -m\omega^2 q$`, so `$\ddot q = -\omega^2q$`. In phase space the orbits are ellipses `$p^2/(2mE) + q^2/(2E/m\omega^2) = 1$` with area `$\pi\sqrt{2mE}\sqrt{2E/(m\omega^2)} = 2\pi E/\omega$`.

The same equations follow from a variational principle in phase space, `$\delta\int(\sum p_j\dot q_j - H)\,dt = 0$`, with `$q$` and `$p$` varied independently. That form is the starting point for canonical transformations in [lesson 2.3](/learn/courses/gate-physics/poisson-brackets/).

## 3. Is H the energy? Is it conserved?

These are two separate questions, and exams test both.

| Situation | H conserved? | H = T + V? |
|---|---|---|
| fixed constraints, V(q) only | yes | yes |
| coordinates have explicit t (spinning hoop, rotating frame) but L has no explicit t | yes | no |
| explicit t in L (a driven oscillator, V = −qE₀x cos ωt) | no | yes, if coordinates are fixed |

**Worked example: a rotating frame.** In a frame turning at constant `$\vec\omega$`, a free particle in potential `$V$` has `$L = \tfrac12m(\dot{\vec r} + \vec\omega\times\vec r)^2 - V$`. Then `$\vec p = m(\dot{\vec r} + \vec\omega\times\vec r)$`, the inertial momentum, and

```math
H = \frac{p^2}{2m} + V - \vec\omega\cdot(\vec r\times\vec p)
```

It is conserved (no explicit `$t$`) but is the inertial energy minus `$\vec\omega\cdot\vec L$`. In celestial mechanics this is the **Jacobi integral** of the restricted three-body problem, and it fixes where the Lagrange points are.

## 4. Phase portraits and the pendulum

For one degree of freedom with `$\partial H/\partial t = 0$`, each orbit lies on a curve `$H(q, p) = E$`, so the whole motion can be drawn as a **phase portrait** without solving anything. Fixed points are where `$\partial H/\partial q = \partial H/\partial p = 0$`: a minimum of `$H$` is a **centre** (closed orbits around it, stable), a saddle is a **hyperbolic point** (unstable).

The pendulum has `$H = \dfrac{p^2}{2ml^2} - mgl\cos\theta$`:

<div class="steps">
<div class="step"><p><b>E just above −mgl.</b> Small ellipses round θ = 0: simple harmonic motion with period 2π√(l/g).</p></div>
<div class="step"><p><b>Larger E &lt; mgl.</b> Closed but squashed orbits: the pendulum still swings back and forth (libration), and the period grows with amplitude.</p></div>
<div class="step"><p><b>E = mgl, the separatrix.</b> The orbit runs into the inverted position θ = ±π, taking infinite time to get there. It separates swinging from spinning.</p></div>
<div class="step"><p><b>E &gt; mgl.</b> Open wavy curves: the pendulum goes over the top and keeps turning (rotation), with p never zero.</p></div>
</div>

<figure class="fig" data-fig="pendulum-phase"><figcaption>Phase portrait of a pendulum (units m = l = g = 1). Move the energy slider: the point follows its orbit by Hamilton's equations, and the period, from the exact elliptic integral, grows without limit as the energy reaches the separatrix at 1.</figcaption></figure>

The exact period for amplitude `$\theta_0$` is `$T = 4\sqrt{l/g}\,K(\sin^2(\theta_0/2))$`, with `$K$` the complete elliptic integral. For small amplitudes, `$T \approx 2\pi\sqrt{l/g}\,(1 + \theta_0^2/16)$`. At 30° the correction is about 1.7%.

Drag the red handle anywhere to choose a start, then change the system.

<figure class="fig" data-fig="@mech-phase-drag"><figcaption>Each curve is one motion: closed loops are oscillations, spirals are damped, a limit cycle attracts every nearby start. Fixed points and the separatrix organise the whole picture.</figcaption></figure>

## 5. Liouville's theorem

Think of many copies of the same system, started at slightly different points: a cloud of points in phase space. Hamilton's equations make the cloud flow like a fluid, and that fluid is incompressible:

```math
\nabla\cdot(\dot q, \dot p) = \sum_j\left(\frac{\partial^2 H}{\partial q_j\partial p_j} - \frac{\partial^2 H}{\partial p_j\partial q_j}\right) = 0 \quad\Longrightarrow\quad \frac{d\rho}{dt} = \frac{\partial\rho}{\partial t} + \{\rho, H\} = 0
```

The density of points along any flow line stays fixed, so **phase-space volume is conserved**. Consequences:

- There are no attractors in Hamiltonian systems: friction (which does shrink phase volume) cannot be described by an ordinary time-independent `$H$`.
- A beam of particles cannot be focused in position without spreading in momentum. Beam "emittance" is a phase-space area, and reducing it needs a non-Hamiltonian process such as cooling.
- In statistical mechanics, a density that depends only on `$H$` is unchanged by the motion. This is why the microcanonical and canonical ensembles are equilibrium states.

**Worked example.** Particles in free fall, `$H = p^2/2m + mgq$`, start in the square `$0 < q < a$`, `$0 < p < b$`. After time `$t$`, `$p \to p - mgt$` and `$q \to q + pt/m - \tfrac12gt^2$`. The square becomes a parallelogram sheared by `$t/m$`: same base `$b$`, same height `$a$`, so the area `$ab$` is unchanged.

Press Play and watch the blob of starting states stretch, then switch on friction.

<figure class="fig" data-fig="@mech-liouville"><figcaption>The shape distorts enormously, but with no friction its area stays the same. This is Liouville's theorem; friction compresses phase space.</figcaption></figure>

## 6. The Routhian

Sometimes it pays to Legendre-transform only the cyclic coordinates. The **Routhian** `$R = L - \sum_{\rm cyclic} p_k\dot q_k$`, written in terms of the conserved `$p_k$`, acts as a Lagrangian for the remaining coordinates. For a central force, `$R(r, \dot r) = \tfrac12m\dot r^2 - \ell^2/(2mr^2) - U(r)$`, and the Euler-Lagrange equation for `$r$` follows at once with the centrifugal term built in. Note the sign: the centrifugal energy enters `$R$` with a minus sign, as part of an effective potential.

## 7. Action variables and adiabatic invariants

For a periodic motion in one degree of freedom, the **action**

```math
J = \oint p\,dq
```

is the area enclosed by the orbit in phase space. Its use is that it survives slow change: if a parameter (the length of a pendulum, the stiffness of a spring, a magnetic field) changes over many periods, `$J$` stays very nearly constant even though the energy does not. It is an **adiabatic invariant**.

**Worked example.** For an oscillator `$J = 2\pi E/\omega$`. Stiffen the spring slowly until `$\omega$` doubles: `$E$` doubles too. Because `$E = \tfrac12m\omega^2A^2$`, the amplitude falls as `$A \propto \omega^{-1/2}$`, so it drops by `$\sqrt2$`. The same rule in old quantum theory, `$J = nh$`, gave `$E = n\hbar\omega$`, which is why quantum numbers do not jump when a potential is changed slowly.

Other examples: a gas compressed slowly in a box (the action of each bouncing molecule `$2mvL$` is fixed, which gives the adiabatic law `$TV^{2/3}$` = constant for a monatomic gas), and a charged particle gyrating in a slowly changing magnetic field, whose magnetic moment `$\mu = mv_\perp^2/2B$` stays fixed. That is what makes magnetic mirrors and the Van Allen belts trap particles.

<div class="problem" data-problem="adiabatic-oscillator"></div>

<div class="myth">

**"Slow changes keep the energy fixed."** They keep the action fixed, not the energy. A slowly shortened pendulum gains energy (the hand pulling the string up does work against the tension, which is larger than average while the bob swings fast at the bottom). The energy goes up as `$\omega$` does, keeping `$E/\omega$` constant.

</div>

Writing `$H$` as a function of action alone, `$H(J)$`, gives the frequency at once: `$\nu = \partial H/\partial J$`. For the oscillator `$H = J\omega/2\pi$`, so `$\nu = \omega/2\pi$`, as it should be. The angle variable conjugate to `$J$` then grows uniformly in time; this action-angle picture is the language of perturbation theory and of the KAM theorem on which orbits survive a small perturbation.

<div class="keypoints">

- `$H = \sum p_j\dot q_j - L$`, written in `$q, p$` only; `$p_j = \partial L/\partial\dot q_j$`.
- Hamilton's equations: `$\dot q = \partial H/\partial p$`, `$\dot p = -\partial H/\partial q$`; `$dH/dt = \partial H/\partial t$`.
- `$H$` is conserved when it has no explicit `$t$`; it is `$T + V$` when the coordinates have no explicit `$t$`. A rotating frame gives `$H = E - \vec\omega\cdot\vec L$`.
- Charge: `$H = (\vec p - q\vec A)^2/2m + q\phi$`.
- Phase portraits: minima of `$H$` are centres, saddles are unstable; the pendulum's separatrix `$E = mgl$` divides swinging from spinning.
- Liouville: phase-space volume is conserved; no attractors without dissipation.
- Action `$J = \oint p\,dq$` is an adiabatic invariant; for an oscillator `$E/\omega$` is fixed and `$A \propto \omega^{-1/2}$`; `$\nu = \partial H/\partial J$`.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. More on the [Hamiltonian mechanics practice page](/learn/courses/gate-physics/practice/hamiltonian-mechanics/).

<div class="qbank" data-bank="physics" data-topics="hamiltonian-mechanics" data-exam="gate" data-n="10"></div>

**Before this:** lesson 2.1, [Lagrangian mechanics](/learn/courses/gate-physics/lagrangian-mechanics/). **Next:** lesson 2.3, [Poisson brackets and canonical transformations](/learn/courses/gate-physics/poisson-brackets/). Basics: the JAM lesson on [simple harmonic motion](/learn/courses/iit-jam-physics/simple-harmonic-motion/).

**Going on to CSIR NET?** [Phase space, fixed points and stability](/learn/courses/csir-net-physics/phase-space-stability/) reads Hamilton's equations as a flow in phase space.

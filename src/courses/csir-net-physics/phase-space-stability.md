---
title: Phase space, fixed points and stability
summary: 'Flows on a line and in the plane, fixed points and linearisation, classifying fixed points by trace and determinant (nodes, spirals, saddles, centres), conservative systems and the pendulum separatrix, damping, Liouville''s theorem, Lyapunov functions, limit cycles (van der Pol, Hopf), Bendixson and Poincaré-Bendixson, index theory, bifurcations and population models.'
minutes: 55
updated: 2026-11-22
quiz:
  - q: 'The linear system ẋ = 2x + y, ẏ = −x has a fixed point at the origin. It is'
    choices: ['an unstable degenerate node', 'a saddle', 'a centre', 'a stable spiral']
    ans: 0
    why: 'τ = 2 and Δ = 0·2 − (1)(−1) = 1, so τ² − 4Δ = 0: a repeated eigenvalue λ = 1 > 0. That is an unstable degenerate node.'
  - q: 'Why can a Hamiltonian system never have an attracting fixed point?'
    choices: ['Its flow keeps phase-space volume, so it cannot squeeze a region onto a point', 'Its energy always grows', 'It has no fixed points at all', 'Its trajectories always cross']
    ans: 0
    why: 'Liouville''s theorem: the divergence of a Hamiltonian flow is zero. An attractor would shrink a ball of initial conditions, which a volume-preserving flow cannot do.'
  - q: 'In polar form a system reads ṙ = r(0.04 − r²), θ̇ = 1. Its stable limit cycle has radius'
    choices: ['0.2', '0.04', '0.4', '1']
    ans: 0
    why: 'ṙ = 0 at r = √0.04 = 0.2, and ṙ changes from positive to negative there, so that circle attracts nearby orbits: a supercritical Hopf cycle.'
sources:
  - 'S. H. Strogatz, Nonlinear Dynamics and Chaos, 2nd ed. (2015), chapters 2 to 8'
  - 'D. W. Jordan and P. Smith, Nonlinear Ordinary Differential Equations, 4th ed. (2007), chapters 1 to 3'
  - 'H. Goldstein, C. Poole and J. Safko, Classical Mechanics, 3rd ed. (2002), chapter 11'
  - 'CSIR-UGC NET Physical Sciences syllabus, Classical Mechanics (phase space dynamics, stability analysis)'
---

**Module 3 · about 55 minutes.** By the end you will be able to find and classify the fixed points of one- and two-dimensional systems in seconds from the trace and determinant, sketch phase portraits, decide stability with a Lyapunov function, recognise limit cycles and when they are impossible, and name the basic bifurcations. NET Part C loves a quick "classify this fixed point" question.

Background: phase space and Hamilton's equations in the [GATE lesson on Hamiltonian mechanics](/learn/courses/gate-physics/hamiltonian-mechanics/), and damping in the [JAM lesson on damped and forced oscillations](/learn/courses/iit-jam-physics/damped-forced-oscillations/).

<div class="bigidea">You can understand a nonlinear system without solving it. Find where it stands still, look at what happens just next to those points, and the whole picture of its motion (where things settle, oscillate or escape) follows.</div>

## 1. Flows on a line

For `$\dot x = f(x)$` the fixed points are the roots of `$f$`. The flow moves right where `$f > 0$` and left where `$f < 0$`, so

```math
f'(x^*) < 0 \Rightarrow \text{stable}, \qquad f'(x^*) > 0 \Rightarrow \text{unstable}
```

and nearby solutions behave as `$e^{f'(x^*)t}$`. On a line, stable and unstable points alternate (for simple roots). Nothing can oscillate: trajectories move monotonically. Nonlinear flows can still escape in finite time: `$\dot x = 1 + x^2$` gives `$x = \tan t$`, which blows up at `$t = \pi/2$`.

**Worked example.** `$\dot x = 4x - x^3$`: fixed points `$0, \pm2$`; `$f'(x) = 4 - 3x^2$` gives `$f'(0) = 4$` (unstable) and `$f'(\pm2) = -8$` (stable).

## 2. Fixed points in the plane

For `$\dot x = f(x, y)$`, `$\dot y = g(x, y)$`, linearise about a fixed point with the **Jacobian**

```math
J = \begin{pmatrix}\partial f/\partial x & \partial f/\partial y\\ \partial g/\partial x & \partial g/\partial y\end{pmatrix}, \qquad \lambda = \tfrac12\left(\tau \pm\sqrt{\tau^2 - 4\Delta}\right), \quad \tau = \mathrm{tr}\,J, \ \Delta = \det J
```

| Condition | Type |
|---|---|
| `$\Delta < 0$` | saddle (real eigenvalues of opposite sign) |
| `$\Delta > 0$`, `$\tau^2 > 4\Delta$` | node: stable if `$\tau < 0$`, unstable if `$\tau > 0$` |
| `$\Delta > 0$`, `$\tau^2 < 4\Delta$` | spiral (focus): stable if `$\tau < 0$`, unstable if `$\tau > 0$` |
| `$\tau^2 = 4\Delta$` | degenerate (or star) node |
| `$\tau = 0$`, `$\Delta > 0$` | centre (linear); nonlinear terms may turn it into a weak spiral |

<div class="meaning">

<dl>
<dt>τ = λ₁ + λ₂</dt><dd>the rate at which areas grow near the point: negative means areas shrink and the point can attract</dd>
<dt>Δ = λ₁λ₂</dt><dd>negative means the eigenvalues have opposite signs: one direction in, one out (a saddle)</dd>
<dt>τ² − 4Δ</dt><dd>the sign decides between straight-in approach (node) and spiralling (spiral)</dd>
<dt>Im λ</dt><dd>the angular frequency of the spiral or centre</dd>
<dt>Physical meaning</dt><dd>The determinant asks "is this a hilltop or a valley?" (saddle or not); the trace asks "is energy being fed in or taken out?"; the discriminant asks "is the damping heavy enough to stop the oscillation?".</dd>
</dl>

</div>

<figure class="fig" data-fig="phase-portrait"><figcaption>Phase portrait of ẋ = Ax. Arrows show the direction of motion, coloured curves are trajectories run forwards and backwards in time, and dashed lines are the real eigen-directions. Pick a type, then move a and d to change the trace and watch a spiral turn into a node, a centre or a saddle.</figcaption></figure>

**Worked example.** `$\dot x = -x + y$`, `$\dot y = -x - y$`: `$\tau = -2$`, `$\Delta = 2$`, `$\tau^2 - 4\Delta = -4$`, so `$\lambda = -1\pm i$`: a stable spiral, decaying as `$e^{-t}$` while turning at 1 rad per unit time.

<div class="problem" data-problem="linear-eigen"></div>

## 3. Conservative systems and the pendulum

For `$m\ddot x = -V'(x)$`, minima of `$V$` are centres and maxima are saddles, with small-oscillation frequency `$\omega = \sqrt{V''(x^*)/m}$` at a minimum. A Hamiltonian flow has `$\tau = 0$` everywhere (`$\partial_q\dot q + \partial_p\dot p = H_{qp} - H_{pq} = 0$`): by **Liouville's theorem** phase-space areas are preserved, so there are no nodes, spirals or attractors, only saddles and centres.

**The pendulum** `$\ddot\theta = -\omega_0^2\sin\theta$` has centres at `$\theta = 0, \pm2\pi, \dots$` and saddles at `$\theta = \pm\pi$`. The orbits through the saddles, the **separatrix**,

```math
\dot\theta = \pm2\omega_0\cos(\theta/2)
```

divide swinging (closed curves) from whirling over the top (open curves). On the separatrix the period is infinite: the pendulum creeps towards the top forever.

**Damping** adds `$-b\dot x$`, the trace becomes `$-b/m < 0$`, and the centre becomes a stable spiral (underdamped), a degenerate node (critical, `$b = 2\sqrt{km}$`) or a stable node (overdamped).

<div class="problem" data-problem="separatrix-speed"></div>

## 4. Lyapunov functions and limit cycles

A **Lyapunov function** is a positive definite `$V(x, y)$` (zero only at the fixed point) with `$\dot V \leq 0$` along trajectories. If `$\dot V < 0$` away from the point, it is asymptotically stable, even when linearisation gives a centre. Example: for `$\dot x = -x + y$`, `$\dot y = -x - y^3$`, `$V = x^2 + y^2$` gives `$\dot V = -2x^2 - 2y^4 < 0$`.

A **limit cycle** is an isolated closed orbit. Three results decide whether one can exist in the plane:

- **Bendixson:** if `$\partial_xf + \partial_yg$` has one sign (and is not identically zero) in a simply connected region, there is no closed orbit there.
- **Index theory:** nodes, spirals and centres have index `$+1$`, saddles `$-1$`; a closed orbit must enclose fixed points with indices adding to `$+1$`.
- **Poincaré-Bendixson:** a bounded trajectory that avoids fixed points approaches a closed orbit. Consequence: no chaos in a plane.

**Hopf bifurcation.** `$\dot r = \mu r - r^3$`, `$\dot\theta = \omega$`: for `$\mu < 0$` the origin is a stable spiral; for `$\mu > 0$` it is unstable and a stable limit cycle of radius `$\sqrt\mu$` appears. Radial perturbations of the cycle decay at rate `$2\mu$`. The **van der Pol** oscillator `$\ddot x - \mu(1 - x^2)\dot x + x = 0$` has negative damping at small `$x$` and positive at large `$x$`; for small `$\mu$` its cycle has amplitude 2.

## 5. Bifurcations and population models

| Normal form | Bifurcation at 0 | What happens |
|---|---|---|
| `$\dot x = r - x^2$` | saddle-node | two fixed points `$\pm\sqrt r$` merge and vanish |
| `$\dot x = rx - x^2$` | transcritical | `$0$` and `$r$` exchange stability |
| `$\dot x = rx - x^3$` | supercritical pitchfork | origin destabilises; stable `$\pm\sqrt r$` grow from it |
| `$\dot x = rx + x^3$` | subcritical pitchfork | unstable branches shrink onto the origin; then a jump |
| `$\dot r = \mu r - r^3$` | Hopf | spiral changes stability; limit cycle of radius `$\sqrt\mu$` |

Just past a saddle-node the flow lingers near the vanished points: crossing `$\dot x = r + x^2$` takes `$\pi/\sqrt r$`.

**Lotka-Volterra.** `$\dot x = x(a - by)$`, `$\dot y = y(-c + dx)$`: the coexistence point `$(c/d, a/b)$` has eigenvalues `$\pm i\sqrt{ac}$`, a centre surrounded by closed cycles of prey and predators. In **competition** models the coexistence point is often a saddle, and one species wins.

**Worked example.** `$\dot x = x(3 - x - 2y)$`, `$\dot y = y(2 - x - y)$`. At `$(1, 1)$` the Jacobian is `$\begin{pmatrix}-1 & -2\\ -1 & -1\end{pmatrix}$`, `$\Delta = -1$`: a saddle. The points `$(3, 0)$` and `$(0, 2)$` are stable nodes, and the saddle's stable manifold divides their basins.

<div class="myth">

**"A centre in the linearisation means closed orbits in the real system."** Only if something protects them, such as a conserved energy or a symmetry. Otherwise the nonlinear terms can turn the centre into a slow spiral, in or out. The trace and determinant test is decisive for saddles, nodes and spirals (they are robust), but not for centres. Use a conserved quantity or a Lyapunov function to settle the borderline case.

</div>

<div class="keypoints">

- 1D: stable if `$f'(x^*) < 0$`; no oscillations on a line.
- 2D: `$\Delta < 0$` saddle; `$\Delta > 0$` with `$\tau^2 > 4\Delta$` node, `$\tau^2 < 4\Delta$` spiral; stable when `$\tau < 0$`; `$\tau = 0$`, `$\Delta > 0$` centre.
- Conservative: minima of `$V$` are centres, maxima saddles, `$\omega = \sqrt{V''/m}$`. Hamiltonian flows: `$\tau = 0$`, no attractors (Liouville).
- Pendulum separatrix `$\dot\theta = \pm2\omega_0\cos(\theta/2)$`; critical damping `$b = 2\sqrt{km}$`.
- Lyapunov: `$V > 0$`, `$\dot V < 0$` proves stability. Bendixson: one-signed divergence forbids cycles. Indices: saddle `$-1$`, others `$+1$`.
- Hopf cycle radius `$\sqrt\mu$`; van der Pol amplitude 2. Saddle-node bottleneck time `$\pi/\sqrt r$`.
- Lotka-Volterra coexistence: centre with `$\lambda = \pm i\sqrt{ac}$`.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. More on the [practice page](/learn/courses/csir-net-physics/practice/).

<div class="qbank" data-bank="physics" data-topics="phase-space-stability" data-exam="net" data-n="10"></div>

**Before this:** lesson 3.2, [Hamilton-Jacobi theory](/learn/courses/csir-net-physics/hamilton-jacobi/). **Next:** lesson 3.4, [nonlinear dynamics and chaos](/learn/courses/csir-net-physics/nonlinear-dynamics-chaos/). Small oscillations about a stable point with many degrees of freedom are the subject of the [GATE lesson on normal modes](/learn/courses/gate-physics/normal-modes/).

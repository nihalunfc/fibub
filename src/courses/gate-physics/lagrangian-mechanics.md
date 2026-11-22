---
title: Lagrangian mechanics
seoTitle: Lagrangian mechanics for GATE and CSIR NET Physics
summary: 'Generalised coordinates, constraints and degrees of freedom, d''Alembert''s principle, the Euler-Lagrange equations, cyclic coordinates and conserved momenta, Noether''s theorem, velocity-dependent potentials, Lagrange multipliers and Hamilton''s principle, with the shortcuts GATE and NET reward.'
minutes: 50
updated: 2026-11-22
quiz:
  - q: 'A bead slides on a frictionless wire bent into a fixed circle in a vertical plane. How many degrees of freedom does it have?'
    choices: ['3', '2', '1', '0']
    ans: 2
    why: Three Cartesian coordinates minus two holonomic constraints (stay in the plane, stay on the circle) leave one. The angle along the circle is a good generalised coordinate.
  - q: 'In L = ½m(ṙ² + r²θ̇²) − U(r), which quantity is conserved because θ does not appear?'
    choices: ['mr²θ̇, the angular momentum', 'mṙ, the radial momentum', 'The radial force', 'The kinetic energy alone']
    ans: 0
    why: θ is cyclic, so ∂L/∂θ = 0 and the Euler-Lagrange equation says d(∂L/∂θ̇)/dt = 0. The conjugate momentum ∂L/∂θ̇ = mr²θ̇ is the angular momentum.
  - q: 'Adding dF/dt to a Lagrangian, where F(q, t) is any function of the coordinates and time,'
    choices: ['Adds a friction force', 'Changes the equations of motion by a constant', 'Leaves the equations of motion unchanged', 'Makes energy stop being conserved in every case']
    ans: 2
    why: The action changes only by F at the two end points, which are held fixed in the variation, so the Euler-Lagrange equations are the same. Lagrangians are not unique.
sources:
  - 'H. Goldstein, C. Poole and J. Safko, Classical Mechanics, 3rd ed. (2002), chapters 1 and 2'
  - 'L. D. Landau and E. M. Lifshitz, Mechanics, 3rd ed. (1976), chapters 1 and 2'
  - 'J. R. Taylor, Classical Mechanics (2005), chapters 6 and 7'
  - 'GATE Physics syllabus (Classical Mechanics), IIT organising institute; CSIR-UGC NET Physical Sciences syllabus, Part A Classical Mechanics'
---

**Module 2 · about 50 minutes.** By the end you will be able to count degrees of freedom, choose generalised coordinates, write a Lagrangian and get the equations of motion from it, spot conserved quantities without solving anything, handle a charge in a magnetic field, and find a constraint force with a Lagrange multiplier.

Newton's laws in vectors are covered in the JAM lesson on [Newton's laws and frames](/learn/courses/iit-jam-physics/newtons-laws-frames/). Here the same physics is written in a form that works in any coordinates and makes conservation laws easy to see.

<div class="bigidea">Write one scalar, L = T − V, in whatever coordinates suit the problem. The equations of motion, the conserved quantities and even the constraint forces all come out of it by differentiation.</div>

## 1. Constraints and generalised coordinates

A system of `$N$` particles needs `$3N$` coordinates. A **holonomic constraint** is an equation `$f(\vec r_1, \dots, \vec r_N, t) = 0$` that removes one of them: a rigid rod fixes a distance, a bead on a wire must sit on a curve. With `$k$` such constraints there are `$n = 3N - k$` **degrees of freedom**, and any `$n$` independent quantities `$q_1, \dots, q_n$` that fix the configuration are **generalised coordinates**: angles, distances, or anything else.

Constraints that cannot be written that way are **non-holonomic**, for example `$r \ge R$` (a particle outside a sphere) or rolling without slipping on a plane, where the condition ties velocities together and cannot be integrated. A constraint that depends on time (a bead on a wire that is being turned) is **rheonomic**; one that does not is **scleronomic**.

**Worked example.** A rigid body is `$N$` particles with fixed distances between every pair. Fix three points that are not in a line: that is 9 coordinates and 3 distances, so 6 degrees of freedom, and every other particle is then fixed. Three of them say where the centre is and three (for example the Euler angles) say how the body is turned.

## 2. From d'Alembert to the Euler-Lagrange equations

Ideal constraint forces (a smooth wire, a rigid rod) do no work in a **virtual displacement**, an instant small change allowed by the constraints. Newton's second law then gives d'Alembert's principle, `$\sum_i (\vec F_i - \dot{\vec p}_i)\cdot\delta\vec r_i = 0$`, with only the applied forces. Rewriting it in the `$q_j$`:

<div class="steps">
<div class="step"><p><b>Change variables.</b> r<sub>i</sub> = r<sub>i</sub>(q, t), so δr<sub>i</sub> = Σ<sub>j</sub> (∂r<sub>i</sub>/∂q<sub>j</sub>) δq<sub>j</sub>, with no δt term (virtual means at one instant).</p></div>
<div class="step"><p><b>Generalised force.</b> The applied part becomes Σ<sub>j</sub> Q<sub>j</sub> δq<sub>j</sub>, with Q<sub>j</sub> = Σ<sub>i</sub> F<sub>i</sub>·∂r<sub>i</sub>/∂q<sub>j</sub>. For a conservative force, Q<sub>j</sub> = −∂V/∂q<sub>j</sub>.</p></div>
<div class="step"><p><b>Two identities.</b> ∂ṙ<sub>i</sub>/∂q̇<sub>j</sub> = ∂r<sub>i</sub>/∂q<sub>j</sub> and d/dt(∂r<sub>i</sub>/∂q<sub>j</sub>) = ∂ṙ<sub>i</sub>/∂q<sub>j</sub> turn the inertia term into d/dt(∂T/∂q̇<sub>j</sub>) − ∂T/∂q<sub>j</sub>.</p></div>
<div class="step"><p><b>Independence.</b> The δq<sub>j</sub> are independent, so each coefficient vanishes separately. With V independent of q̇, put L = T − V.</p></div>
</div>

```math
\frac{d}{dt}\frac{\partial L}{\partial \dot q_j} - \frac{\partial L}{\partial q_j} = 0, \qquad j = 1, \dots, n
```

<div class="meaning">

<dl>
<dt>q<sub>j</sub>, q̇<sub>j</sub></dt><dd>a generalised coordinate and its generalised velocity, treated as independent variables in L</dd>
<dt>p<sub>j</sub> = ∂L/∂q̇<sub>j</sub></dt><dd>the canonical (conjugate) momentum; it is mẋ for a Cartesian coordinate and an angular momentum for an angle</dd>
<dt>∂L/∂q<sub>j</sub></dt><dd>the generalised force, including the "fictitious" centrifugal terms that come from T</dd>
<dt>n equations</dt><dd>one second-order equation for each degree of freedom, with no constraint forces in sight</dd>
<dt>Physical meaning</dt><dd>Each equation says "rate of change of the momentum belonging to q<sub>j</sub> = the force belonging to q<sub>j</sub>", which is Newton's second law in whatever coordinates you chose.</dd>
</dl>

</div>

**Worked example: the Atwood machine with a heavy pulley.** Masses `$m_1 > m_2$` hang over a pulley of moment of inertia `$I$` and radius `$R$`. One coordinate, the drop `$x$` of `$m_1$`, fixes everything: the pulley turns through `$x/R$`. So `$T = \tfrac12(m_1 + m_2 + I/R^2)\dot x^2$` and `$V = -(m_1 - m_2)gx$`. The Euler-Lagrange equation gives

```math
\ddot x = \frac{(m_1 - m_2)\,g}{m_1 + m_2 + I/R^2}
```

with no string tensions anywhere. A pulley made of a uniform disc has `$I/R^2 = M/2$`.

<div class="problem" data-problem="atwood-lagrange"></div>

## 3. A spinning hoop: equilibria that move

A bead slides on a smooth vertical hoop of radius `$R$` that is forced to spin at a fixed rate `$\omega$` about its vertical diameter. Measure `$\theta$` from the bottom. The bead moves along the hoop at `$R\dot\theta$` and around the axis at `$\omega R\sin\theta$`, so

```math
L = \tfrac12 mR^2\left(\dot\theta^2 + \omega^2\sin^2\theta\right) + mgR\cos\theta, \qquad \ddot\theta = \sin\theta\left(\omega^2\cos\theta - \frac{g}{R}\right)
```

Equilibria are where `$\ddot\theta = 0$`: the bottom, the top, and, only if `$\omega^2 > g/R$`, the angle with `$\cos\theta_0 = g/(\omega^2R)$`. Spin the hoop past `$\sqrt{g/R}$` and the bottom stops being stable: the bead climbs to `$\theta_0$`. This is a **bifurcation**, the same mathematics as a magnet ordering below its Curie point.

<figure class="fig" data-fig="bead-hoop"><figcaption>The bead on the spinning hoop, with its effective potential. Raise ω past √(g/R) and the single minimum at the bottom splits into two side minima; the bead settles into one of them.</figcaption></figure>

Here the time-dependent constraint does work on the bead, so `$T + V$` is **not** conserved. But `$L$` has no explicit `$t$`, so `$h = \dot\theta\,\partial L/\partial\dot\theta - L = \tfrac12mR^2\dot\theta^2 - \tfrac12mR^2\omega^2\sin^2\theta - mgR\cos\theta$` is. Section 5 explains why.

<div class="problem" data-problem="hoop-equilibrium"></div>

## 4. Cyclic coordinates and Noether's theorem

If a coordinate `$q_k$` is missing from `$L$` (it is **cyclic**, or ignorable), the Euler-Lagrange equation reads `$\dot p_k = 0$`: its conjugate momentum is conserved. This is the simplest case of **Noether's theorem**: every continuous symmetry of the Lagrangian gives a conserved quantity.

| Symmetry of L | Conserved quantity |
|---|---|
| shift every position by the same vector (homogeneity of space) | total linear momentum |
| turn the system about an axis (isotropy of space) | angular momentum about that axis |
| shift the time origin (L has no explicit t) | the energy function h |

**Worked example.** A particle moves on the surface of a cone `$z = r\cot\alpha$` under gravity. With `$r$` and `$\phi$` as coordinates, `$L = \tfrac12m(\dot r^2\csc^2\alpha + r^2\dot\phi^2) - mgr\cot\alpha$`. `$\phi$` is cyclic, so `$p_\phi = mr^2\dot\phi$` is conserved: the vertical component of angular momentum, because the cone is symmetric about its axis. The `$x$`-momentum is **not** conserved, since gravity and the cone break that symmetry.

A symmetry tells you a conserved quantity before you solve anything. For a charge near an infinite straight wire, the system is unchanged by moving along the wire and turning around it, so `$p_z$` and `$p_\phi$` are conserved even though the motion is complicated.

## 5. The energy function and when it is the energy

Define the **energy function**

```math
h = \sum_j \dot q_j\,\frac{\partial L}{\partial \dot q_j} - L, \qquad \frac{dh}{dt} = -\frac{\partial L}{\partial t}
```

So `$h$` is conserved whenever `$L$` has no explicit time dependence. It equals the total energy `$T + V$` only when `$T$` is a quadratic form in the velocities (`$T = \tfrac12\sum a_{jk}\dot q_j\dot q_k$`) and `$V$` does not depend on velocities, which is true when the transformation `$\vec r_i(q)$` has no explicit `$t$`. Euler's theorem on homogeneous functions then gives `$\sum\dot q_j\partial T/\partial\dot q_j = 2T$`, so `$h = 2T - (T - V) = T + V$`.

On the spinning hoop, the kinetic energy has a velocity-free part `$\tfrac12mR^2\omega^2\sin^2\theta$`, so `$h \ne T + V$`: `$h$` is conserved, `$T + V$` is not. Two separate questions are worth keeping apart: **is h conserved?** (look for explicit `$t$` in `$L$`) and **is h the energy?** (look for explicit `$t$` in the coordinates).

## 6. Velocity-dependent potentials: a charge in a field

The Lorentz force depends on velocity, yet it fits the Lagrangian scheme with a **generalised potential** `$U = q\phi - q\,\vec v\cdot\vec A$`:

```math
L = \tfrac12 m v^2 - q\phi + q\,\vec v\cdot\vec A, \qquad \vec p = m\vec v + q\vec A
```

The Euler-Lagrange equations give `$m\dot{\vec v} = q(\vec E + \vec v\times\vec B)$` with `$\vec E = -\nabla\phi - \partial\vec A/\partial t$` and `$\vec B = \nabla\times\vec A$`. The canonical momentum `$\vec p$` is **not** `$m\vec v$`; it is the one that becomes `$-i\hbar\nabla$` in quantum mechanics. A gauge change `$\vec A \to \vec A + \nabla\chi$`, `$\phi \to \phi - \partial\chi/\partial t$` adds `$q\,d\chi/dt$` to `$L$`, a total derivative, so the motion is unchanged.

**Worked example.** A uniform field `$\vec B = B\hat z$` can be written with `$\vec A = (-By, 0, 0)$`. Then `$L = \tfrac12m(\dot x^2 + \dot y^2 + \dot z^2) - qB\dot x y$`. Both `$x$` and `$z$` are cyclic, so `$p_x = m\dot x - qBy$` and `$p_z = m\dot z$` are conserved. The first says `$m\dot x = p_x + qBy$`: the orbit centre sits at `$y_c = -p_x/(qB)$`, the canonical momentum labels the guiding centre. With the symmetric gauge `$\vec A = \tfrac12B(-y, x, 0)$` the cyclic coordinate is `$\phi$` instead; different gauges show different conserved quantities.

<div class="myth">

**"The canonical momentum is always mass times velocity."** Only for a Cartesian coordinate with a velocity-free potential. For an angle it is an angular momentum, for a charge in a magnetic field it is `$m\vec v + q\vec A$` (which depends on the gauge), and on the spinning hoop `$p_\theta = mR^2\dot\theta$`. Always compute `$\partial L/\partial\dot q$`.

</div>

## 7. Constraint forces with Lagrange multipliers

Choosing coordinates that satisfy the constraints hides the constraint forces. To find one, keep an extra coordinate and impose the constraint `$f(q) = 0$` with a multiplier `$\lambda$`:

```math
\frac{d}{dt}\frac{\partial L}{\partial \dot q_j} - \frac{\partial L}{\partial q_j} = \lambda\,\frac{\partial f}{\partial q_j}
```

The right side is the generalised constraint force. The method also handles non-holonomic constraints written in differential form, `$\sum_j a_j\,dq_j = 0$`, by replacing `$\partial f/\partial q_j$` with `$a_j$`.

**Worked example: when does a particle leave a sphere?** A particle slides from rest at the top of a smooth sphere of radius `$R$`. Keep `$r$` with the constraint `$r - R = 0$`, and measure `$\theta$` from the top, so the height is `$r\cos\theta$` and `$L = \tfrac12m(\dot r^2 + r^2\dot\theta^2) - mgr\cos\theta$`. The `$r$` equation at `$r = R$` is `$-mR\dot\theta^2 + mg\cos\theta = \lambda$`. Energy gives `$R\dot\theta^2 = 2g(1 - \cos\theta)$`, so the normal force is `$\lambda = mg(3\cos\theta - 2)$`. It reaches zero at `$\cos\theta = 2/3$`, about 48.2° from the top, where the particle flies off.

## 8. Hamilton's principle

The Euler-Lagrange equations are exactly the condition that the **action** is stationary for paths with fixed end points:

```math
S[q] = \int_{t_1}^{t_2} L(q, \dot q, t)\,dt, \qquad \delta S = 0
```

This is the cleanest statement of classical mechanics: it needs no forces or coordinates, it shows at once that adding `$dF(q,t)/dt$` to `$L$` changes nothing (it only adds a constant `$F(t_2) - F(t_1)$` to `$S$`), and it carries straight into field theory and, via Feynman's path integral, quantum mechanics. The same calculus of variations solves geometric problems: the shortest path on a surface, the soap film between two rings (a catenoid), and the **brachistochrone**, the curve of fastest descent, which is a cycloid.

**Worked example.** A Lagrangian `$L = \tfrac12m\dot x^2 - \tfrac12kx^2$` gives SHM. Multiply it by any constant, or add `$\frac{d}{dt}(x^2t)$`, and the equation of motion `$m\ddot x = -kx$` is unchanged. A test question that offers two Lagrangians differing by such a term expects you to call them equivalent.

<div class="keypoints">

- Degrees of freedom `$n = 3N - k$` for `$k$` holonomic constraints; rolling without slipping on a plane is non-holonomic.
- Euler-Lagrange: `$\dfrac{d}{dt}\dfrac{\partial L}{\partial\dot q_j} = \dfrac{\partial L}{\partial q_j}$`, `$L = T - V$`; ideal constraint forces drop out.
- Canonical momentum `$p_j = \partial L/\partial\dot q_j$`; a cyclic coordinate means a conserved `$p_j$` (Noether: symmetry gives a conservation law).
- `$h = \sum\dot q_j p_j - L$` is conserved when `$\partial L/\partial t = 0$`; it equals `$T + V$` only when the coordinates have no explicit time dependence.
- A charge: `$L = \tfrac12mv^2 - q\phi + q\vec v\cdot\vec A$`, `$\vec p = m\vec v + q\vec A$`; gauge changes add a total derivative.
- Constraint forces: `$\lambda\,\partial f/\partial q_j$`. A particle leaves a smooth sphere at `$\cos\theta = 2/3$`.
- Hamilton's principle `$\delta\int L\,dt = 0$`; `$L$` and `$L + dF(q,t)/dt$` give the same motion.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. More on the [Lagrangian mechanics practice page](/learn/courses/gate-physics/practice/lagrangian-mechanics/).

<div class="qbank" data-bank="physics" data-topics="lagrangian-mechanics" data-exam="gate" data-n="10"></div>

**Basics:** the JAM lessons on [Newton's laws and frames](/learn/courses/iit-jam-physics/newtons-laws-frames/) and [potential energy](/learn/courses/iit-jam-physics/potential-energy/). **Next:** lesson 2.2, [Hamiltonian mechanics](/learn/courses/gate-physics/hamiltonian-mechanics/).

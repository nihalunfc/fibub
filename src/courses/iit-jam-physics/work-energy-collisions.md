---
title: Work, energy, momentum and collisions
seoTitle: Work, energy and collisions for IIT JAM Physics
summary: 'Work and the work-energy theorem, conservative forces and energy diagrams, the centre-of-mass frame, and every kind of collision JAM asks about: elastic, inelastic, oblique and with restitution.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: Two bodies collide and stick together. Which of these is still conserved (no outside forces)?
    choices: ['Total momentum', 'Total kinetic energy', 'Both', 'Neither']
    ans: 0
    why: With no outside force, momentum is always conserved. Kinetic energy is not, because some of it becomes heat and deformation when the bodies stick.
  - q: A light ball hits a much heavier ball at rest, head-on and elastically. What happens to the light ball?
    choices: ['It bounces back with almost its original speed', 'It stops dead', 'It carries on at almost its original speed', 'It moves on with the heavy ball']
    ans: 0
    why: 'v₁ = (m₁ − m₂)u/(m₁ + m₂). When m₂ is much larger than m₁ this is close to −u: the ball bounces back like a ball off a wall.'
  - q: In a perfectly inelastic collision, which kinetic energy is lost?
    choices: ['The kinetic energy measured in the centre-of-mass frame', 'All of the kinetic energy measured in the lab', 'Half of the lab kinetic energy, always', 'None, if the masses are equal']
    ans: 0
    why: Momentum must stay the same, so the motion of the centre of mass (energy ½MV²) cannot be lost. Only the energy of motion relative to the centre of mass, ½μv_rel², can turn into heat.
sources:
  - 'D. Kleppner and R. Kolenkow, An Introduction to Mechanics, 2nd ed. (2014), chapters 4 and 5'
  - 'J. R. Taylor, Classical Mechanics (2005), chapters 3 and 4'
  - 'H. Goldstein, C. Poole and J. Safko, Classical Mechanics, 3rd ed. (2002), chapter 1'
  - 'IIT JAM Physics syllabus (Mechanics and General Properties of Matter), published by the organising IIT each year'
---

**Module 2 · about 45 minutes.** By the end you will be able to compute work for any force, read an energy diagram to find equilibria and oscillation frequencies, use the centre-of-mass frame to solve collisions in a few lines, and handle elastic, inelastic and two-dimensional collisions without memorising long formulas.

<div class="bigidea">Momentum is always conserved when no outside force acts; energy is always conserved in total but kinetic energy only in elastic collisions, and the centre-of-mass frame shows exactly how much can be lost.</div>

## 1. Work: force times displacement, done properly

For a constant force and a straight displacement, work is a dot product. For a force that changes along a curved path, add up small pieces:

```math
W = \vec F\cdot\Delta\vec r \qquad\longrightarrow\qquad W = \int_A^B \vec F\cdot d\vec r
```

Only the part of the force along the motion does work. A string holding a stone in a circle, a normal force on a body sliding along a floor and the magnetic force on a charge all do **zero** work, because they stay at right angles to the velocity.

**Worked example.** `$F = 3x^2$` N acts along `$x$`. From `$x = 0$` to `$x = 2$` m: `$W = \int_0^2 3x^2\,dx = [x^3]_0^2 = 8$` J. Multiplying the final force (12 N) by the distance (2 m) would give 24 J, which is wrong because the force was smaller earlier.

## 2. Kinetic energy and the work-energy theorem

Put `$\vec F = m\,d\vec v/dt$` into the work integral and you get a result that holds for **every** kind of force:

```math
W_{\rm net} = \Delta K, \qquad K = \tfrac12mv^2 = \frac{p^2}{2m}
```

Power is the rate of doing work: `$P = dW/dt = \vec F\cdot\vec v$`.

**Worked example (constant power).** A 1000 kg car starts from rest and its engine supplies a steady 2 kW with no losses. Then `$\tfrac12mv^2 = Pt$`, so `$v = \sqrt{2Pt/m} = 2\sqrt t$` m/s, and the distance in 9 s is `$\int_0^9 2\sqrt t\,dt = \tfrac43(27) = 36$` m. The acceleration is not constant, so the familiar `$s = \tfrac12at^2$` would be wrong.

## 3. Conservative forces and energy diagrams

A force is **conservative** if the work it does between two points does not depend on the path. Equivalent tests:

- the work around every closed loop is zero;
- `$\nabla\times\vec F = 0$` (in a region without holes);
- `$\vec F = -\nabla U$` for some potential energy `$U$`.

Gravity, springs and electrostatic forces pass; friction and drag fail. For conservative forces `$K + U$` stays constant. In one dimension `$F = -dU/dx$`, which turns a graph of `$U(x)$` into a complete picture of the motion.

<div class="meaning">

<dl>
<dt>F = −dU/dx</dt><dd>the force always points downhill on the U(x) graph</dd>
<dt>U′(x₀) = 0</dt><dd>an equilibrium point: no force there</dd>
<dt>U″(x₀) &gt; 0</dt><dd>a valley: stable; small oscillations with ω = √(U″(x₀)/m)</dd>
<dt>E ≥ U(x)</dt><dd>the only places the particle can be; where E = U it turns round</dd>
<dt>Physical meaning</dt><dd>Picture a marble rolling on a track shaped like U(x), with total energy E as the highest level it can reach. Valleys trap it, hilltops balance it, and if E is above every hill on one side it escapes.</dd>
</dl>

</div>

**Worked example.** A 0.5 kg particle moves in `$U(x) = x^4 - 2x^2$` (SI units).

1. Equilibria: `$U'(x) = 4x^3 - 4x = 0$` at `$x = 0, \pm1$`.
2. `$U''(x) = 12x^2 - 4$`: at `$x = \pm1$` it is 8 (valleys, stable); at `$x = 0$` it is `$-4$` (a hilltop).
3. Near `$x = 1$`, `$U \approx U(1) + \tfrac12(8)(x - 1)^2$`: a spring of stiffness 8 N/m, so `$\omega = \sqrt{8/0.5} = 4$` rad/s.

## 4. Momentum and the centre of mass

For a system of particles, internal forces cancel in pairs (third law), so only outside forces change the total momentum:

```math
\vec P = \sum m_i\vec v_i = M\vec V_{cm}, \qquad \frac{d\vec P}{dt} = \vec F_{\rm ext}, \qquad \vec R_{cm} = \frac{\sum m_i\vec r_i}{M}
```

With no outside force the centre of mass glides at constant velocity, whatever happens inside: explosions, collisions, people walking on boats.

The **centre-of-mass (CM) frame** moves with `$\vec V_{cm}$`, so the total momentum in it is zero. The kinetic energy splits neatly (König's theorem):

```math
K_{\rm lab} = \tfrac12MV_{cm}^2 + K_{cm}, \qquad K_{cm} = \tfrac12\mu v_{\rm rel}^2 \text{ for two bodies}, \quad \mu = \frac{m_1m_2}{m_1 + m_2}
```

The first part cannot change while momentum is conserved. **Only `$K_{cm}$` is available to be turned into heat, sound or internal excitation.** That one sentence solves most "how much energy is lost" questions.

## 5. Head-on collisions

In every collision without outside forces, momentum is conserved. What happens to kinetic energy is described by the **coefficient of restitution**:

```math
e = \frac{\text{speed of separation}}{\text{speed of approach}}, \qquad e = 1 \text{ elastic}, \quad 0 < e < 1 \text{ inelastic}, \quad e = 0 \text{ perfectly inelastic (stick)}
```

Here is how the elastic results come out, with target `$m_2$` at rest:

<div class="steps">
<div class="step"><p><b>Two laws.</b> Momentum: m₁u = m₁v₁ + m₂v₂. Energy: ½m₁u² = ½m₁v₁² + ½m₂v₂².</p></div>
<div class="step"><p><b>Group the terms of each body.</b> m₁(u − v₁) = m₂v₂ and m₁(u − v₁)(u + v₁) = m₂v₂².</p></div>
<div class="step"><p><b>Divide.</b> u + v₁ = v₂, that is v₂ − v₁ = u: in an elastic collision the bodies separate as fast as they met (e = 1).</p></div>
<div class="step"><p><b>Solve the two linear equations.</b> v₁ = (m₁ − m₂)u/(m₁ + m₂) and v₂ = 2m₁u/(m₁ + m₂).</p></div>
<div class="step"><p><b>Check the limits.</b> Equal masses swap velocities; a light ball bounces off a heavy one (v₁ ≈ −u); a heavy ball barely notices a light one (v₁ ≈ u, v₂ ≈ 2u).</p></div>
</div>

With restitution `$e$` and the same set-up, the general results and the energy lost are

```math
v_1 = \frac{m_1 - e\,m_2}{m_1 + m_2}\,u, \qquad v_2 = \frac{(1 + e)\,m_1}{m_1 + m_2}\,u, \qquad \Delta K = \tfrac12\mu(1 - e^2)\,u_{\rm rel}^2
```

<figure class="fig" data-fig="collision-1d"><figcaption>Change the mass ratio and the restitution. For e = 1 nothing is lost; for e = 0 the blocks stick and lose the most energy that momentum allows. A light block hitting a heavy one bounces back.</figcaption></figure>

**Worked example.** A 2 kg ball at 6 m/s hits a 1 kg ball at rest with `$e = 0.5$`. Momentum: `$2v_1 + v_2 = 12$`. Restitution: `$v_2 - v_1 = 3$`. So `$v_1 = 3$` m/s and `$v_2 = 6$` m/s. Energy lost: `$36 - 27 = 9$` J, which matches `$\tfrac12\cdot\tfrac23\cdot0.75\cdot36 = 9$` J.

<div class="problem" data-problem="elastic-collision"></div>

**A frame trick worth knowing.** A ball meets a heavy wall moving towards it at 2 m/s. In the wall's frame the ball arrives at `$10 + 2 = 12$` m/s and leaves at 12 m/s; back in the ground frame it leaves at 14 m/s. The same idea explains why a small ball dropped on top of a big one rebounds to nine times its height, and how spacecraft gain speed from planets.

<div class="myth">

**"In a perfectly inelastic collision all the kinetic energy is lost."** Only if the centre of mass was at rest. A moving lump of clay that sticks to a cart still leaves the pair moving, because momentum must be conserved. The energy lost is `$\tfrac12\mu v_{\rm rel}^2$`, the CM-frame energy, which is always less than the lab kinetic energy unless the total momentum is zero.

</div>

## 6. Collisions in two dimensions

Momentum is a vector, so it is conserved component by component. Two results save a lot of time:

- **Equal masses, elastic, one at rest:** the two bodies leave at **right angles** (unless the hit is head-on). Squaring `$\vec u = \vec v_1 + \vec v_2$` and comparing with `$u^2 = v_1^2 + v_2^2$` forces `$\vec v_1\cdot\vec v_2 = 0$`.
- **Heavy hits light, elastic:** the heavy body can be deflected by at most `$\sin\theta_{\max} = m_2/m_1$`. An alpha particle (4 u) hitting a proton (1 u) turns through no more than about `$14.5^\circ$`.

**Worked example.** A puck at 4 m/s hits an identical puck at rest elastically and moves off at `$30^\circ$`. The other puck leaves at `$60^\circ$` on the other side; the momentum triangle is right-angled with hypotenuse 4, so the speeds are `$4\cos30^\circ \approx 3.46$` m/s and `$4\sin30^\circ = 2$` m/s.

For a quick check of any collision with your own numbers, use the [collision calculator](/science/collision-calculator/).

<div class="keypoints">

- `$W = \int\vec F\cdot d\vec r$`; forces at right angles to the motion do no work. `$W_{\rm net} = \Delta K$` for any forces; `$P = \vec F\cdot\vec v$`.
- Conservative: path-independent work, `$\nabla\times\vec F = 0$`, `$\vec F = -\nabla U$`. Equilibrium at `$U' = 0$`, stable if `$U'' > 0$`, with `$\omega = \sqrt{U''/m}$`.
- No outside force: total momentum constant and the centre of mass moves uniformly.
- `$K_{\rm lab} = \tfrac12MV_{cm}^2 + \tfrac12\mu v_{\rm rel}^2$`; only the second part can be lost.
- Elastic head-on, target at rest: `$v_1 = \frac{m_1 - m_2}{m_1 + m_2}u$`, `$v_2 = \frac{2m_1}{m_1 + m_2}u$`. With restitution, `$\Delta K = \tfrac12\mu(1 - e^2)u_{\rm rel}^2$`.
- Equal masses, elastic, oblique: right angles after. Heavy on light: `$\sin\theta_{\max} = m_2/m_1$`.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. More on the [work, energy and collisions practice page](/learn/courses/iit-jam-physics/practice/work-energy-collisions/).

<div class="qbank" data-bank="physics" data-topics="work-energy-collisions" data-exam="jam" data-n="10"></div>

**Before this:** lesson 2.1, [Newton's laws and frames](/learn/courses/iit-jam-physics/newtons-laws-frames/). **Next:** [lesson 2.3](/learn/courses/iit-jam-physics/variable-mass/) on variable-mass systems and rockets, then 2.4, [central forces and orbits](/learn/courses/iit-jam-physics/central-forces/), where energy and angular momentum together decide the shape of every orbit. Going on to GATE? [Central forces and scattering](/learn/courses/gate-physics/) takes collisions into cross-sections.

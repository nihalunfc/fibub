---
title: Centre of mass, momentum and collisions
seoTitle: 'Centre of mass and collisions: JEE and NEET physics'
summary: 'Centre of mass of particles and shapes (including cut-outs), motion of the centre of mass, momentum conservation and impulse, explosions, rockets and variable mass, elastic and inelastic collisions, the coefficient of restitution, collisions in two dimensions and the ballistic pendulum.'
minutes: 34
updated: 2026-11-22
quiz:
  - q: 'A shell flying along a parabola explodes in mid-air into two pieces. Just after the explosion, the centre of mass of the pieces:'
    choices: ['stops', 'falls straight down', 'carries on along the same parabola', 'moves along a straight line']
    ans: 2
    why: 'The explosion forces are internal. The only outside force is still gravity, so the centre of mass keeps following the original path until a piece lands.'
  - q: 'In a perfectly inelastic collision:'
    choices: ['momentum and kinetic energy are both kept', 'momentum is kept, the bodies move together and kinetic energy is lost', 'kinetic energy is kept but momentum is not', 'neither is kept']
    ans: 1
    why: 'Momentum is always kept when no outside force acts. In a perfectly inelastic collision the bodies stick (e = 0), and the largest possible share of kinetic energy becomes heat and sound.'
  - q: 'A ball moving at u hits an identical ball at rest head-on, elastically. After the collision:'
    choices: ['both move at u/2', 'the first stops and the second moves at u', 'the first bounces back at u', 'both stop']
    ans: 1
    why: 'Equal masses in a head-on elastic collision swap velocities. The striker stops and the target moves off at u, as in a Newton''s cradle.'
sources:
  - 'National Medical Commission NEET (UG) syllabus and JEE Main / JEE Advanced 2026 syllabi: System of particles (centre of mass, momentum conservation, collisions)'
---

**Physics · Class 11 · about 34 minutes.** By the end you will be able to find the centre of mass of particles, rods, plates and shapes with holes, use momentum conservation for explosions and rockets, and solve any collision in one or two dimensions.

<div class="bigidea">A system of many bodies moves, as a whole, like one particle of the total mass sitting at the centre of mass and pushed only by the outside forces. Inside forces (explosions, collisions, people walking on boats) can rearrange the parts, but they cannot move the centre of mass.</div>

## 1. Centre of mass

For particles of masses mᵢ at positions xᵢ:

```math
x_{cm} = \frac{\sum m_i x_i}{\sum m_i}, \qquad \text{and for a continuous body}\quad x_{cm} = \frac{1}{M}\int x\,dm
```

The same formula works for y and z. For two particles, the centre of mass lies on the line joining them, closer to the heavier one, and divides the distance in the inverse ratio of the masses: `$r_1/r_2 = m_2/m_1$`.

**Standard shapes** (uniform; distance from the centre of the flat face or diameter):

| Shape | Centre of mass |
|---|---|
| Rod of length L | middle, L/2 from an end |
| Semicircular ring (wire) of radius R | `$2R/\pi$` from the centre |
| Semicircular disc | `$4R/3\pi$` |
| Hemispherical shell | `$R/2$` |
| Solid hemisphere | `$3R/8$` |
| Solid cone of height h | `$h/4$` from the base |
| Triangle plate | where the medians meet |

**Cut-outs.** Treat a hole as a negative mass. Full shape (centre known) minus the removed piece:
`$x_{cm} = \dfrac{M x_1 - m x_2}{M - m}$`, with masses in proportion to areas (or volumes).

<div class="problem" data-problem="com-disc-hole"></div>

<div class="myth">

**"The centre of mass must be inside the body."** A ring's centre of mass is at its empty centre, and a boomerang's is in the air between its arms. It is a point of balance in the maths, not a piece of material.

</div>

## 2. Motion of the centre of mass

Differentiate the definition: `$M\vec v_{cm} = \sum m_i\vec v_i = \vec P_{total}$` and

```math
M\vec a_{cm} = \vec F_{external}
```

- No outside force: the centre of mass keeps a constant velocity (stays still if it started still).
- **Man on a boat:** a man of mass m walks a distance L along a boat of mass M on still water. The boat moves back `$mL/(m + M)$`, so that the centre of mass stays put.
- A shell that explodes in flight: its centre of mass keeps following the original parabola.

## 3. Momentum and impulse

Momentum `$\vec p = m\vec v$`. Impulse `$\vec J = \int\vec F\,dt = \Delta\vec p$`, the area under the F-t graph. With no outside impulse, the **total momentum is conserved**. During a short collision or explosion, outside forces like gravity are tiny compared with the internal forces, so momentum is conserved "just before to just after" even then.

**Explosions.** A body at rest that breaks into two pieces gives them equal and opposite momenta. Their kinetic energies are in the **inverse** ratio of their masses: the lighter piece gets more energy.

## 4. Variable mass: rockets and conveyor belts

When mass flows in or out at rate dm/dt with speed u relative to the body, there is a thrust `$F = u\,\dfrac{dm}{dt}$`.

- **Rocket** in free space, exhaust speed u relative to the rocket: `$v = v_0 + u\ln\dfrac{m_0}{m}$`. Against gravity, the starting acceleration is `$\dfrac{u}{m}\dfrac{dm}{dt} - g$`.
- **Conveyor belt** moving at v while sand drops on at rate dm/dt: an extra force `$v\,dm/dt$` is needed to keep it moving, and the power is `$v^2\,dm/dt$`. Half of that becomes kinetic energy of the sand; the other half is heat from sliding.

## 5. Collisions in one dimension

In every collision with no outside impulse, momentum is conserved. The **coefficient of restitution** tells how bouncy it is:

```math
e = \frac{\text{speed of separation}}{\text{speed of approach}} = \frac{v_2 - v_1}{u_1 - u_2}
```

<div class="meaning">
<dl>
<dt>u₁, u₂</dt><dd>velocities just before the collision (with signs)</dd>
<dt>v₁, v₂</dt><dd>velocities just after</dd>
<dt>e</dt><dd>1 for elastic (no kinetic energy lost), 0 for perfectly inelastic (they stick), in between for real collisions</dd>
<dt>Physical meaning</dt><dd>Momentum is shared by the push between the bodies, which is always equal and opposite. How much they bounce apart depends on the materials, and that is what e measures.</dd>
</dl>
</div>

Set the masses, speeds and e below and watch the centre of mass glide on unchanged.

<figure class="fig" data-fig="com-collision"><figcaption>Two carts collide. Momentum is the same before and after for every e; kinetic energy is kept only when e = 1. The centre of mass (triangle) never changes speed.</figcaption></figure>

**Elastic, target at rest** (m₁ hits m₂ at rest with u):

```math
v_1 = \frac{m_1 - m_2}{m_1 + m_2}\,u, \qquad v_2 = \frac{2m_1}{m_1 + m_2}\,u
```

Equal masses swap velocities. A heavy ball hitting a light one at rest sends it off at almost 2u. A light ball hitting a heavy wall bounces back with almost the same speed.

<div class="problem" data-problem="com-elastic"></div>

**Perfectly inelastic:** common velocity `$V = \dfrac{m_1u_1 + m_2u_2}{m_1 + m_2}$`. With the target at rest, the fraction of kinetic energy lost is `$\dfrac{m_2}{m_1 + m_2}$`.

**A ball bouncing on the floor:** each bounce multiplies the speed by e and the height by e². Total time before it stops `$= \sqrt{2h/g}\,\dfrac{1 + e}{1 - e}$`.

<div class="problem" data-problem="com-bounce"></div>

**Ballistic pendulum.** A bullet (m, speed u) lodges in a block (M) hanging on a string. Momentum in the collision: `$mu = (m + M)V$`. Energy afterwards: `$V = \sqrt{2gh}$`. So `$u = \dfrac{m + M}{m}\sqrt{2gh}$`. Never use energy across the collision itself; most of the bullet's energy becomes heat.

<div class="myth">

**"In an inelastic collision, momentum is lost too."** Momentum is never lost in a collision with no outside impulse, however crumpled the bodies get. Only kinetic energy is lost.

</div>

## 6. Collisions in two dimensions (JEE Advanced)

Momentum is conserved separately along x and along y. For smooth spheres, restitution applies only **along the line of centres** at the moment of impact; the velocity parts perpendicular to that line do not change.

A key result: when a ball hits an **identical** ball at rest elastically and not head-on, the two move off **at 90° to each other** (equal masses, kinetic energy kept: `$u^2 = v_1^2 + v_2^2$` along with the momentum triangle).

**Oblique hit on a wall** at angle θ to the normal with coefficient e: the part along the wall is unchanged, the normal part becomes e times as big and reverses, so the ball leaves at `$\tan\theta' = \tan\theta/e$`.

<div class="keypoints">

- x_cm = Σmx/Σm; holes are negative masses; know 2R/π, 4R/3π, 3R/8, h/4.
- M a_cm = external force; internal forces cannot move the centre of mass.
- Impulse = Δp = area under F-t; momentum is kept in every collision and explosion.
- Explosion from rest: equal momenta, energies in the inverse ratio of masses.
- Thrust = u dm/dt; rocket v = v₀ + u ln(m₀/m).
- e = separation speed / approach speed; elastic e = 1, stick e = 0.
- Elastic with target at rest: v₂ = 2m₁u/(m₁ + m₂); equal masses swap velocities.
- Bounce: height × e² each time. Ballistic pendulum: momentum in the hit, energy after.
- Equal masses, elastic, glancing: they separate at 90°.

</div>

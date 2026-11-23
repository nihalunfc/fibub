---
title: System of Particles and Rotational Motion
seoTitle: 'Rotational Motion Class 11 notes, moment of inertia'
summary: 'Class 11 System of Particles and Rotational Motion with animations: centre of mass, torque, moment of inertia of every shape, angular momentum and rolling.'
minutes: 110
updated: 2026-11-22
quiz:
  - q: 'Particles of mass 1 kg at x = 0 and 3 kg at x = 4 m lie on a line. The centre of mass is at:'
    choices: ['1 m', '2 m', '3 m', '2.5 m']
    ans: 2
    why: 'X = (1×0 + 3×4)/(1 + 3) = 12/4 = 3 m, nearer the heavier particle.'
  - q: 'A ring and a solid disc of the same mass and radius are released together at the top of an incline and roll without slipping. Which reaches the bottom first?'
    choices: ['the ring', 'the disc', 'both together', 'depends on the mass']
    ans: 1
    why: 'a = g sin θ / (1 + I/MR²). The disc has I/MR² = ½ (smaller than the ring’s 1), so it has the larger acceleration. The mass cancels.'
  - q: 'A skater spinning with arms out pulls her arms in. Her angular speed:'
    choices: ['decreases', 'increases', 'stays the same', 'becomes zero']
    ans: 1
    why: 'No external torque, so L = Iω is constant. Pulling the arms in reduces I, so ω must increase.'
sources:
  - 'NCERT Class 11 Physics, Chapter 6 “System of Particles and Rotational Motion” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Moments of inertia of standard bodies: Young and Freedman, University Physics, table of moments of inertia (formulas only)'
  - 'Rolling motion and the parallel-axis theorem: Kleppner and Kolenkow, An Introduction to Mechanics, chapter 7'
---

**Physics · Class 11 · Chapter 6 · about 110 minutes.** By the end you will be able to find a centre of mass, use torque and angular momentum, compute the moment of inertia of rings, discs, rods and spheres about any axis, apply the parallel and perpendicular axis theorems, and solve problems on rotation, conservation of angular momentum and rolling.

<div class="bigidea">Every straight-line idea has a spinning twin: displacement becomes angle, velocity becomes angular velocity, force becomes torque, mass becomes moment of inertia and momentum becomes angular momentum. The new thing is that mass now matters <b>where</b> it sits: mass far from the axis is harder to turn. Learn one table of twins and rotation becomes translation in disguise.</div>

## 1. Rigid bodies and their motion

Real objects are made of enormous numbers of particles. A **rigid body** is an idealised object whose particles never change their distances from each other, whatever forces act. A steel wheel is close to rigid; a jelly is not.

A rigid body can show three kinds of motion:

- **Pure translation**: every particle moves the same way (a box sliding on ice).
- **Pure rotation about a fixed axis**: every particle goes in a circle about the axis (a ceiling fan, a potter’s wheel).
- **A mix of both**: a wheel rolling along a road, or a cricket bat flung into the air.

The key discovery is that complicated motion splits neatly into the motion of one special point, the centre of mass, plus rotation about it.

## 2. Centre of mass

The **centre of mass (CM)** is the single point where, for the purpose of the translation, all the mass can be imagined to be concentrated. For particles of masses `$m_1, m_2, \dots$` at positions `$\vec r_1, \vec r_2, \dots$`:

```math
\vec R_{CM} = \frac{\sum m_i \vec r_i}{\sum m_i}, \qquad X = \frac{\sum m_i x_i}{M}, \quad Y = \frac{\sum m_i y_i}{M}
```

<div class="meaning">

<dl>
<dt>M</dt><dd>total mass `$\sum m_i$`</dd>
<dt>X, Y</dt><dd>coordinates of the CM</dd>
<dt>Physical meaning</dt><dd>It is the mass-weighted average position, like the average of marks weighted by credits. It always lies nearer the heavier particles. A flat board balanced on a pin placed at its CM will not tip.</dd>
</dl>

</div>

Drag the masses below and watch the cross move.

<figure class="fig" data-fig="c11p-rot-com"><figcaption>Three masses you can drag and change. The centre of mass is the mass-weighted average position: heavier masses pull it closer to themselves.</figcaption></figure>

<div class="problem" data-problem="c11p-rot-com"></div>

For **continuous bodies** the sum becomes an integral, but symmetry gives the answer quickly: the CM of a uniform rod, ring, disc, sphere or rectangle is at its geometric centre. A uniform triangle has it where the medians meet, one third of the way up from the base.

### Trick: a body with a hole

If part of a uniform body is removed, treat the hole as a piece of **negative mass**. Follow the example of a disc with a hole.

<div class="steps" data-fig="c11p-rot-holesteps">
<div class="step">A uniform disc of radius R has a circular hole of radius R/2 whose centre is R/2 from the disc’s centre O. Where is the centre of mass of what is left?</div>
<div class="step">Pretend the hole is filled with the same material. The whole disc has mass M and its CM is at O.</div>
<div class="step">The hole’s area is (½R)²/R² = ¼ of the disc, so the missing piece has mass M/4 and sits at x = R/2. The remaining plate has mass 3M/4.</div>
<div class="step">Whole disc = remaining plate + the filled-in piece, so M × 0 = (3M/4) x_cm + (M/4)(R/2).</div>
<div class="step">Solving: x_cm = −R/6. The CM is on the side opposite the hole, as expected.</div>
</div>

## 3. Motion of the centre of mass

For a system of particles Newton’s second law takes a lovely form. The internal forces between particles cancel in pairs (Newton’s third law), so only external forces change the motion of the CM:

```math
M\,\vec a_{CM} = \vec F_{ext}, \qquad \vec P = M\,\vec v_{CM} = \sum m_i\vec v_i
```

If `$\vec F_{ext} = 0$` the total momentum `$\vec P$` is constant: this is the law of conservation of momentum for a system. A bomb that explodes in the air, or a spinning dumbbell thrown across a field, shows it vividly: all the pieces fly in complicated ways, but the CM keeps tracing the same smooth parabola.

<figure class="fig" data-fig="c11p-rot-comtoss"><figcaption>A dumbbell thrown and spinning. The ends trace wavy paths, but the centre of mass (the +) follows the ordinary projectile parabola. Change the masses: the + stays nearer the heavy end.</figcaption></figure>

<figure class="fig" data-fig="@mech-com-explode"><figcaption>A shell bursting in flight. The fragments scatter, yet their centre of mass carries on along the original parabola.</figcaption></figure>

Try placing your own masses in the tool, and compare your answers with the formula.

<!--fig:tool centre-of-mass-->

<div class="myth">

**“The centre of mass must lie inside the body.”** It need not. For a ring or a boomerang the CM is in the empty middle. A high-jumper using the Fosbury flop arches over the bar so that her body goes over it while her CM passes under it.

</div>

## 4. The vector product

Rotation needs a new multiplication. The **vector product** (cross product) of two vectors `$\vec a$` and `$\vec b$` is a vector:

```math
\vec a\times\vec b = a\,b\sin\theta\;\hat n
```

Its magnitude `$ab\sin\theta$` is the area of the parallelogram built on the two vectors. Its direction `$\hat n$` is perpendicular to both, given by the **right-hand rule**: curl the fingers of your right hand from `$\vec a$` towards `$\vec b$` and your thumb points along the answer. Note: `$\vec a\times\vec b = -\,\vec b\times\vec a$`, and `$\vec a\times\vec a = 0$`.

In the figure, drag the particle and the arrow tip. The shaded area is the size of the product; a dot means “out of the page” (anticlockwise turn), a cross means “into the page” (clockwise).

<figure class="fig" data-fig="c11p-rot-cross"><figcaption>Torque r × F and angular momentum r × p are the same mathematics. The size is r F sin θ, the shaded parallelogram. If the vector points along r, the area is zero and there is no turning effect.</figcaption></figure>

## 5. Angular velocity, angular acceleration and the kinematics of rotation

For a body rotating about a fixed axis, every particle turns through the same angle `$\theta$` in the same time. So we describe the whole body with:

- **angular displacement** `$\theta$` (radian),
- **angular velocity** `$\omega = d\theta/dt$` (rad/s),
- **angular acceleration** `$\alpha = d\omega/dt$` (rad/s²).

A particle at distance r from the axis then has

```math
v = \omega r,\qquad a_t = \alpha r,\qquad a_c = \omega^2 r = \frac{v^2}{r}
```

<figure class="fig" data-fig="c11p-rot-point"><figcaption>A point on a wheel: its speed v = ωr is along the tangent, the tangential acceleration αr also, and the centripetal acceleration ω²r points to the axis. Slide r: points farther from the axis move faster though they share the same ω.</figcaption></figure>

If α is constant, the equations are the twins of the straight-line ones:

| Straight line | Rotation about a fixed axis |
|---|---|
| `$v = u + at$` | `$\omega = \omega_0 + \alpha t$` |
| `$s = ut + \tfrac12 at^2$` | `$\theta = \omega_0 t + \tfrac12\alpha t^2$` |
| `$v^2 = u^2 + 2as$` | `$\omega^2 = \omega_0^2 + 2\alpha\theta$` |

<div class="myth">

**“A point near the rim and a point near the axis have different angular speeds.”** All points of a rigid body share the same ω and α. Only their *linear* speeds `$v = \omega r$` differ.

</div>

## 6. Torque and angular momentum

### Torque: the turning effect of a force

A force can turn a body about a point O. The **torque** (moment of force) is

```math
\vec\tau = \vec r\times\vec F, \qquad \tau = r F\sin\theta = F\,d_\perp
```

where `$\vec r$` goes from O to the point where the force acts, and `$d_\perp = r\sin\theta$` is the perpendicular distance from O to the line of the force, called the **lever arm**. Torque is measured in N m (not joules, though the units look alike: torque is a vector and is not energy).

That is why a long spanner loosens a stuck nut and why the door handle is put far from the hinges. Pushing on the hinge side, or straight along the line through the hinge, gives zero torque.

<figure class="fig" data-fig="@mech-torque"><figcaption>A wrench or door: change the force, the position and the angle. The torque is largest when the force is perpendicular to the arm (θ = 90°).</figcaption></figure>

<div class="problem" data-problem="c11p-rot-torque"></div>

### Angular momentum

For a particle of momentum `$\vec p = m\vec v$` at position `$\vec r$` from O:

```math
\vec L = \vec r\times\vec p, \qquad L = r\,m v\sin\theta
```

A particle moving in a circle of radius r has `$L = m v r = m r^2\omega$`. Differentiating gives the rotational form of Newton’s second law:

```math
\frac{d\vec L}{dt} = \vec\tau_{ext}
```

The rate of change of angular momentum equals the net external torque. If the net external torque is zero, `$\vec L$` is constant: **conservation of angular momentum**. A planet’s speed changes along its orbit because gravity always points to the Sun (zero torque about the Sun), so its L is constant.

<div class="meaning">

<dl>
<dt>τ</dt><dd>torque about a point (N m)</dd>
<dt>L</dt><dd>angular momentum about the same point (kg m²/s)</dd>
<dt>Physical meaning</dt><dd>Force changes momentum; torque changes angular momentum. Both must be measured about the same point.</dd>
</dl>

</div>

## 7. Equilibrium of a rigid body

A rigid body is in **mechanical equilibrium** when it has neither a net force nor a net torque:

1. `$\sum\vec F = 0$` (no linear acceleration), and
2. `$\sum\vec\tau = 0$` about any point (no angular acceleration).

For a see-saw or a lever the second condition is the **principle of moments**: clockwise moments = anticlockwise moments, `$W_1 d_1 = W_2 d_2$`. The pivot supplies the upward force that satisfies the first condition. Drag the weights and find the balance.

<figure class="fig" data-fig="c11p-rot-lever"><figcaption>A plank on a pivot. The plank tips towards the larger torque. When W₁d₁ = W₂d₂ it balances, and the pivot pushes up with W₁ + W₂.</figcaption></figure>

<div class="problem" data-problem="c11p-rot-lever"></div>

Two equal and opposite forces that do not act along the same line form a **couple**. A couple has zero net force but a torque `$F\times$` (separation): it only turns the body, as when you open a tap with finger and thumb or steer a bicycle with both hands. The **centre of gravity** is the point where the body’s weight acts; for everyday sizes it coincides with the centre of mass.

## 8. Moment of inertia: how hard is it to spin?

In a straight line, mass is the resistance to a change in velocity. For rotation, the resistance to a change in angular velocity is the **moment of inertia**:

```math
I = \sum m_i r_i^2 \quad(\text{or } I = \int r^2\,dm)
```

where `$r_i$` is the perpendicular distance of each particle from the **axis**. Because of the square, mass far from the axis counts much more than mass near it. Unlike mass, I is **not a property of the body alone**: it depends on the axis. A rod is easy to spin about its own length but hard to spin end over end.

Start with the explorer: pick a shape, set its mass and size, and *drag* the shape sideways to move the axis. The bar splits I into the shape’s own part and the extra `$Md^2$` from moving the axis.

<figure class="fig" data-fig="c11p-rot-moi"><figcaption>Moment of inertia explorer. Choose a ring, disc, rod, solid or hollow sphere, or cylinder. Drag the shape away from the axis and watch I grow by Md². Press “Spin it” to apply a 5 N m torque and see α = τ/I.</figcaption></figure>

<div class="problem" data-problem="c11p-rot-moi"></div>

### How the shapes compare

For the same mass M and radius R, the moment of inertia about the axis through the centre depends only on how the mass is spread:

| Body | Axis | I |
|---|---|---|
| Thin ring (or hollow cylinder) | through centre, perpendicular to plane (cylinder: its own axis) | `$MR^2$` |
| Disc (or solid cylinder) | through centre, perpendicular to plane | `$\tfrac12 MR^2$` |
| Thin rod, length L | through centre, perpendicular to rod | `$\tfrac{1}{12}ML^2$` |
| Thin rod, length L | through one end, perpendicular | `$\tfrac13 ML^2$` |
| Solid sphere | any diameter | `$\tfrac25 MR^2$` |
| Hollow (thin-shell) sphere | any diameter | `$\tfrac23 MR^2$` |

The ring has all its mass at the full radius, so its I is the largest possible, MR². Concentrating the mass towards the centre (disc, then solid sphere) cuts I. In the race below every shape has the same mass and radius, and the same torque pushes each for the same time. The one with the smallest I spins up fastest.

<figure class="fig" data-fig="c11p-rot-moibars"><figcaption>Same mass, same radius, same torque. Bars show how fast each shape is turning: α = τ/I, so the smaller the I, the quicker the spin-up. The rod is shown about its middle and about its end (the end is four times harder to turn).</figcaption></figure>

Here is the shared 3D explorer with every standard axis, so you can see that the *same* body has different I about different axes:

<figure class="fig" data-fig="@moi-shapes"><figcaption>Dots sized by r²: moment of inertia of each shape about each standard axis. Compare the formula with the value summed from the dots, then spin it up with the same push.</figcaption></figure>

The tool lets you build and compare shapes on your own:

<!--fig:tool moment-of-inertia-->

### Where does ½MR² come from? Adding up rings

<div class="steps" data-fig="c11p-rot-discsteps">
<div class="step">Cut a uniform disc of mass M and radius R into thin rings. Each ring is at one radius r, so all its particles share the same distance from the axis.</div>
<div class="step">A ring of radius r and width dr has area 2πr dr. The disc has mass per area M/πR², so the ring’s mass is dm = (M/πR²)(2πr dr) = (2M/R²) r dr.</div>
<div class="step">Every bit of this ring is at distance r, so its moment of inertia is dI = r² dm = (2M/R²) r³ dr.</div>
<div class="step">Add all the rings from the centre (r = 0) to the rim (r = R): I = ∫(2M/R²) r³ dr = (2M/R²) × R⁴/4. The shaded area under the r³ curve is I.</div>
<div class="step">So for a disc I = ½ M R². The mass near the rim contributes most because of the r³.</div>
</div>

### Radius of gyration

We often write `$I = Mk^2$`, where `$k = \sqrt{I/M}$` is the **radius of gyration**: the distance at which all the mass could be placed to give the same I. For a ring k = R; for a solid disc `$k = R/\sqrt2$`.

### Two theorems that save pages of calculus

**Parallel axis theorem.** If `$I_{CM}$` is the moment of inertia about an axis through the centre of mass, then about a *parallel* axis a distance d away

```math
I = I_{CM} + M d^2
```

**Perpendicular axis theorem** (for a flat plate in the xy-plane): the moment of inertia about the z-axis (perpendicular to the plate) equals the sum of those about two perpendicular axes in the plane that meet it:

```math
I_z = I_x + I_y
```

Slide the axis away from the centre and watch the parabola, and check the perpendicular-axis result on dots of a disc:

<figure class="fig" data-fig="@mech-axis-theorems"><figcaption>Slide the axis for the parallel-axis theorem (I grows as a parabola with d), and check I_z = I_x + I_y on a flat shape.</figcaption></figure>

Worked uses: a disc about a tangent in its plane. By symmetry the two diameters of a disc have the same I, so `$I_x = I_y = I_z/2 = \tfrac14MR^2$`. The tangent is a parallel axis at d = R, so `$I = \tfrac14MR^2 + MR^2 = \tfrac54MR^2$`. A rod about its end: `$\tfrac1{12}ML^2 + M(L/2)^2 = \tfrac13ML^2$`, matching the table.

<div class="myth">

**“The perpendicular-axis theorem works for any body.”** It holds only for **flat (planar) bodies**, and the two axes in the plane must meet the third axis at the same point. The parallel-axis theorem needs one of the two axes to pass through the centre of mass.

</div>

## 9. Dynamics of rotation about a fixed axis

With the twin table the equations of rotation can be written at once:

| Translation | Rotation about a fixed axis |
|---|---|
| displacement s | angle θ |
| velocity v | angular velocity ω |
| acceleration a | angular acceleration α |
| mass m | moment of inertia I |
| force F | torque τ |
| momentum p = mv | angular momentum L = Iω |
| F = ma | `$\tau = I\alpha$` |
| kinetic energy ½mv² | `$\tfrac12 I\omega^2$` |
| power F v | `$\tau\omega$` |
| work F s | `$\tau\theta$` |

**Torque and angular acceleration** are linked by `$\tau = I\alpha$`: the larger the moment of inertia, the less a given torque can speed the wheel up. This is why a heavy flywheel keeps an engine running smoothly (large I resists changes in ω) and why a figure skater spins up faster with arms in.

<div class="problem" data-problem="c11p-rot-alpha"></div>

## 10. Angular momentum of a rigid body and its conservation

For a body rotating about a fixed axis, `$L = I\omega$`. Combined with `$\tau_{ext} = dL/dt$`, if there is no external torque then

```math
I_1\omega_1 = I_2\omega_2
```

A skater spins fast when she pulls her arms in and slows when she opens them. A diver tucks to flip and opens out to enter the water. A cat falling from a height twists to land on its feet. Experiment with the skater:

<figure class="fig" data-fig="@mech-skater"><figcaption>Pull the weights in: I falls, so ω must rise to keep L = Iω constant. The kinetic energy bar rises too, because the skater does work pulling the arms in.</figcaption></figure>

<div class="problem" data-problem="c11p-rot-skater"></div>

The next picture is a classic classroom demonstration: stand on a rotating stool holding a spinning bicycle wheel. Turn the wheel upside down and you start to rotate the other way. The total angular momentum cannot change, so the angular momentum given to the wheel is taken by you.

<figure class="fig" data-fig="c11p-rot-stool"><figcaption>Flip the wheel: its angular momentum changes from +L to −L, so the stool and person take +2L. The bars show wheel, stool and total; the total never changes.</figcaption></figure>

For more, try the spinning skater tool: [Spinning skater](/learn/spinning-skater/).

## 11. Rolling motion

A wheel rolling without slipping on the ground combines translation and rotation. The point touching the ground is momentarily at rest, so the speed of the centre is `$v_{CM} = \omega R$`.

The kinetic energy has two parts, one for the motion of the centre and one for the rotation about it:

```math
K = \tfrac12 M v_{CM}^2 + \tfrac12 I_{CM}\omega^2 = \tfrac12 M v_{CM}^2\Big(1 + \frac{k^2}{R^2}\Big)
```

On an incline, friction at the contact point is what makes the body roll; it does no work (that point is at rest), so no mechanical energy is lost. Follow the derivation:

<div class="steps" data-fig="c11p-rot-rollsteps">
<div class="step">A round body of mass m and radius R rolls down an incline of angle θ. The forces are its weight mg, the normal force N, and static friction f acting up the slope at the contact point.</div>
<div class="step">Along the slope, Newton’s second law for the motion of the centre: m a = m g sin θ − f.</div>
<div class="step">About the centre of mass, only friction gives a torque (weight acts at the centre and N passes through it): f R = I α.</div>
<div class="step">Rolling without slipping links the two motions: a = αR, so α = a/R and f = I a/R².</div>
<div class="step">Substituting f in the first equation and solving: a = g sin θ / (1 + I/mR²).</div>
<div class="step">Shapes with a small I/mR² accelerate more: a block (sliding) g sin θ; solid sphere 5/7 of it; disc 2/3; hollow sphere 3/5; ring 1/2. The mass and radius have cancelled.</div>
</div>

Now watch it. Choose the slope and race a block, a solid ball, a disc, a hollow ball and a ring from above:

<figure class="fig" data-fig="c11p-rot-roll"><figcaption>A race down the same slope: block (sliding) > solid ball > disc > hollow ball > ring. Change the angle: every time changes, but the order never does, whatever the masses and radii.</figcaption></figure>

<div class="problem" data-problem="c11p-rot-roll"></div>

Check the order and the times in the tool:

<!--fig:tool rolling-race-->

<div class="myth">

**“A heavier object rolls down faster.”** Mass cancels out of a = g sin θ/(1 + I/mR²). A small ring and a big ring, a heavy disc and a light disc, all behave alike. Only the shape, through I/mR², matters.

</div>

<div class="history">

- **~250 BC** Archimedes states the law of the lever: weights balance when each is inversely proportional to its distance from the pivot.
- **1750s** Leonhard Euler works out the equations for the rotation of rigid bodies.
- **1800s** The parallel-axis theorem becomes known as Steiner’s theorem, after the geometer Jakob Steiner.
- **20th century** Gyroscopes in ships, aircraft and spacecraft use conservation of angular momentum to hold direction.

</div>

<div class="keypoints">

- Centre of mass: `$X = \sum m_ix_i/M$`; it moves as if all the mass were there and all external forces acted on it: `$M\vec a_{CM} = \vec F_{ext}$`.
- Vector product `$\vec a\times\vec b = ab\sin\theta\,\hat n$`, direction by the right-hand rule.
- Rotation: `$v = \omega r$`, `$a_t = \alpha r$`, `$a_c = \omega^2 r$`; `$\omega = \omega_0 + \alpha t$`, `$\theta = \omega_0 t + \tfrac12\alpha t^2$`, `$\omega^2 = \omega_0^2 + 2\alpha\theta$`.
- Torque `$\vec\tau = \vec r\times\vec F$`; angular momentum `$\vec L = \vec r\times\vec p$`; `$\vec\tau = d\vec L/dt$`.
- Equilibrium: `$\sum\vec F = 0$` and `$\sum\vec\tau = 0$`; principle of moments.
- Moment of inertia `$I = \sum mr^2$`: ring MR², disc ½MR², rod ML²/12 (centre) and ML²/3 (end), solid sphere ⅖MR², hollow sphere ⅔MR².
- Parallel axis `$I = I_{CM} + Md^2$`; perpendicular axis `$I_z = I_x + I_y$` (flat bodies only).
- `$\tau = I\alpha$`; `$K = \tfrac12I\omega^2$`; `$L = I\omega$` is conserved when no external torque acts.
- Rolling: `$K = \tfrac12Mv^2(1 + k^2/R^2)$`; `$a = g\sin\theta/(1 + I/mR^2)$`.

</div>

Going further for JEE/NEET: exam-level rolling with slipping, impulsive torque, angular-momentum collisions and the gyroscope are in [Rotational motion (JEE)](/learn/courses/engineering-entrance/rotational-motion/); centre-of-mass collisions are in [Centre of mass, momentum and collisions (JEE)](/learn/courses/engineering-entrance/centre-of-mass-collisions/).

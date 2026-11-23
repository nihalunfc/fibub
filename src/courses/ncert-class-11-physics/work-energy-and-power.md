---
title: Work, Energy and Power
seoTitle: 'Work, Energy and Power Class 11 notes and examples'
summary: 'Class 11 Physics Work, Energy and Power with animations: work and the area under F-x, kinetic and spring energy, conservation, power and collisions.'
minutes: 80
updated: 2026-11-22
quiz:
  - q: 'A force of 10 N pulls a trolley 5 m along the floor, the rope making 60° with the floor. The work done is:'
    choices: ['50 J', '25 J', '43.3 J', '0 J']
    ans: 1
    why: 'W = F d cos θ = 10 × 5 × cos 60° = 10 × 5 × 0.5 = 25 J. Only the component of the force along the motion does work.'
  - q: 'The speed of a car doubles. Its stopping distance with the same braking force becomes:'
    choices: ['2 times', '4 times', '8 times', 'the same']
    ans: 1
    why: 'Braking work F d must remove the kinetic energy ½mv². So d is proportional to v²; doubling v gives 4 times the distance.'
  - q: 'In a perfectly inelastic collision between two bodies:'
    choices: ['momentum is lost', 'kinetic energy is conserved', 'the bodies move together afterwards and momentum is conserved', 'the bodies stop']
    ans: 2
    why: 'Momentum is always conserved when no external force acts. In a perfectly inelastic collision the bodies stick, so they share one final velocity, and the largest possible kinetic energy is lost.'
sources:
  - 'NCERT Class 11 Physics, Chapter 5 “Work, Energy and Power” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Typical braking friction coefficients (dry 0.7, wet 0.4, ice 0.1): Halliday, Resnick and Walker, Fundamentals of Physics, Table of friction coefficients'
---

**Physics · Class 11 · Chapter 5 · about 80 minutes.** By the end you will be able to calculate the work done by constant and varying forces, use the work-energy theorem, track kinetic, gravitational and spring energy, apply conservation of energy, work out power, and solve one-dimensional collisions.

<div class="bigidea">Energy is the currency of physics: forces pay for changes in motion with work. Work is force times the distance moved along the force; the work done on a body equals the change in its kinetic energy. When only “nice” forces like gravity and springs act, the total of kinetic and potential energy never changes, and that single fact solves problems that would be hard with forces alone.</div>

## 1. Work done by a force

In physics, **work** is done only when a force moves something. Holding a heavy bag at the bus stop tires you, but the bag does not move, so you do zero work on it in the physics sense.

For a constant force `$\vec F$` acting while the body moves a displacement `$\vec d$`:

```math
W = \vec F \cdot \vec d = F\,d\cos\theta
```

<div class="meaning">

<dl>
<dt>W</dt><dd>work in joules (J): 1 J = 1 N × 1 m</dd>
<dt>F</dt><dd>magnitude of the force (N)</dd>
<dt>d</dt><dd>magnitude of the displacement (m), not the distance travelled along a curve</dd>
<dt>θ</dt><dd>angle between the force and the displacement</dd>
<dt>Physical meaning</dt><dd>Only the part of the force along the motion, `$F\cos\theta$`, does work. Pushing a trolley forward helps; the part of your pull that lifts it upward does nothing to its forward motion.</dd>
</dl>

</div>

Work is a **scalar**, but it can be positive, negative or zero:

- θ < 90°: positive work (the force helps the motion, like a push on a car).
- θ = 90°: zero work (the force is sideways to the motion: gravity on a car on a level road, the tension on a swinging pendulum bob).
- θ > 90°: negative work (the force opposes the motion: friction, a goalkeeper’s hands stopping a ball).

Drag the angle in this figure and see how the useful part of the pull changes, and where the best angle lies when friction is present.

<figure class="fig" data-fig="@mech-work-angle"><figcaption>A crate pulled at an angle φ: the work is F d cos φ, but a steeper pull also lifts the crate and reduces friction. The best angle depends on the friction.</figcaption></figure>

<div class="problem" data-problem="c11p-work-wd"></div>

<div class="myth">

**“Work is force times distance, always.”** It is force times the distance moved **along the force**. A coolie walking at steady speed on a platform with a suitcase on his head does no work on the suitcase: the force (up) is at 90° to the displacement (forward).

</div>

## 2. Work done by a variable force: the area under the graph

Many real forces change as the body moves: a spring pulls harder the more it is stretched, gravity weakens far from the Earth. For a force that changes, split the path into tiny steps `$dx$`; in each step the force is almost constant, so the work is `$F\,dx$`. Add them all:

```math
W = \int_{x_1}^{x_2} F(x)\,dx = \text{area under the } F\text{–}x \text{ graph}
```

A constant force gives a rectangle (area = F x). A spring force F = kx gives a triangle. Any other shape is a bunch of thin strips. Try them below and slide the end point.

<figure class="fig" data-fig="c11p-work-area"><figcaption>Work as area. Pick a force, move the end point and watch the shaded area (the work) grow. For the spring the area is a triangle, ½ k x².</figcaption></figure>

If the force and displacement are along the same line the area is positive above the axis and negative below it. The tool below lets you draw your own force curve.

[Variable force work](/learn/variable-force-work/)

## 3. Kinetic energy and the work-energy theorem

A moving body can do work: a cricket ball can knock the stumps down. The work it can do on stopping is its **kinetic energy**:

```math
K = \tfrac{1}{2} m v^2
```

Follow the derivation in the player below for a constant force.

<div class="steps" data-fig="c11p-work-wet">
<div class="step">A block of mass 2 kg moves at u = 2 m/s. A constant force F = 6 N pushes it along its direction of motion through d = 4 m.</div>
<div class="step">Newton’s second law gives the acceleration: a = F/m = 6/2 = 3 m/s².</div>
<div class="step">The equation of motion v² = u² + 2ad (the one without time) links speeds and distance: v² − u² = 2ad = 2 × 3 × 4 = 24.</div>
<div class="step">Multiply both sides by m/2: ½mv² − ½mu² = m a d. But m a is the force F, so this equals F d.</div>
<div class="step">So the work done by the net force equals the change in kinetic energy. This is the **work-energy theorem**: `$W_{net} = K_f - K_i$`.</div>
<div class="step">Check: the KE goes from 4 J to 28 J, a change of 24 J, and F d = 6 × 4 = 24 J.</div>
</div>

The same result holds for varying forces and curved paths (it comes from adding up many tiny steps), so you can use it without ever finding the acceleration.

<div class="meaning">

<dl>
<dt>K</dt><dd>kinetic energy (J). It depends on `$v^2$`, so doubling the speed gives four times the energy.</dd>
<dt>W<sub>net</sub></dt><dd>work done by all forces together (J)</dd>
<dt>Physical meaning</dt><dd>Positive net work speeds a body up; negative net work slows it. The theorem is Newton’s second law rewritten in terms of distance instead of time.</dd>
</dl>

</div>

<div class="problem" data-problem="c11p-work-ke"></div>

A neat everyday use: the stopping distance of a vehicle. Friction `$\mu m g$` acts over the braking distance d and must remove all the kinetic energy: `$\mu m g\, d = \tfrac12 m v^2$`, so `$d = v^2/(2\mu g)$`. The mass cancels, and speed matters squared.

<figure class="fig" data-fig="c11p-work-brake"><figcaption>Braking distance against speed on a dry road, a wet road and ice. Press Brake! and watch the car. A speed of 72 km/h (20 m/s) needs about 29 m on a dry road but over 100 m on a wet one.</figcaption></figure>

<div class="myth">

**“A faster car just needs twice the distance.”** Because K = ½mv², doubling the speed quadruples the energy to be removed, so the braking distance is four times as long. That is why speed limits near schools are low.

</div>

## 4. Potential energy and conservative forces

Lift a book onto a shelf: you do work against gravity and that work is stored. Release the book and it comes back as kinetic energy. This stored energy of position is **potential energy**.

A force is **conservative** if the work it does between two points does not depend on the path taken (equivalently, the work around any closed loop is zero). Gravity and the spring force are conservative. Friction is not: a longer path means more work lost to heat.

<figure class="fig" data-fig="c11p-work-path"><figcaption>Three paths from A to B up a hillside. Gravity’s work is −mgh for all three, so gravity has a potential energy. Friction’s loss grows with the length of the path, so no potential energy can be defined for it.</figcaption></figure>

For a conservative force the **potential energy** U is defined so that the work done by the force equals the fall in U:

```math
W_{\text{by force}} = -\Delta U
```

**Gravitational potential energy** near the Earth: `$U = m g h$` (taking U = 0 at h = 0). Only the *change* in U has meaning; the zero is chosen for convenience, like measuring heights from the ground floor or from sea level.

## 5. Conservation of mechanical energy

If only conservative forces do work, then `$K + U$` stays constant:

```math
\tfrac12 m v^2 + U = \text{constant}
```

A ball thrown up loses KE as it climbs and gains PE; the sum stays the same. The track below shows the energy changing form as a cart rolls over hills. Switch on friction: the missing energy is not destroyed, it turns into heat.

<figure class="fig" data-fig="c11p-work-conserve"><figcaption>A cart on a roller-coaster. The bar splits the total energy into potential, kinetic and (with a rough track) heat. Change the mass: the motion stays the same, because the mass cancels from both sides of ½mv² = mgh.</figcaption></figure>

<div class="problem" data-problem="c11p-work-height"></div>

Use the picture of a potential energy graph to read off motion: the cart can only be where the total-energy line is above the curve (KE can’t be negative), and it turns back where the line meets the curve.

<figure class="fig" data-fig="@mech-potential-landscape"><figcaption>A ball on a potential-energy landscape. Drag the starting point; the energy line shows the turning points and where it moves fastest.</figcaption></figure>

Try your own tracks in the tool below.

<!--fig:tool energy-track-->

## 6. Potential energy of a spring

A spring that obeys Hooke’s law pulls back with force `$F = -kx$`, where x is the stretch (or squeeze) from its natural length and k is the **spring constant** (N/m, a stiff spring has a large k). To stretch it by x we must pull with a force that grows from 0 to kx. The work done is the area of the triangle under the F–x line:

```math
U = \tfrac12 k x^2
```

<figure class="fig" data-fig="c11p-work-spring"><figcaption>Stretch or squeeze the spring and see the stored energy as the triangle’s area. Release the block and the energy swaps between spring and motion, forever, because there is no friction.</figcaption></figure>

<div class="meaning">

<dl>
<dt>k</dt><dd>spring constant (N/m)</dd>
<dt>x</dt><dd>extension or compression from the natural length (m)</dd>
<dt>Physical meaning</dt><dd>The energy depends on x², so a squeezed and a stretched spring of the same size store equal energy. Doubling the stretch stores four times as much.</dd>
</dl>

</div>

<div class="problem" data-problem="c11p-work-spring"></div>

The mechanical energy of a mass on a spring is `$\tfrac12 m v^2 + \tfrac12 k x^2$`, constant for a frictionless spring. At the ends of the swing all the energy is in the spring; at the middle it is all kinetic. See the same story in the tool:

<!--fig:tool spring-energy-->

## 7. The many forms of energy and the law of conservation

Mechanical energy is only one form. Others: heat, chemical (food, petrol), electrical, nuclear, light and sound. When friction acts, mechanical energy goes down but heat goes up by exactly the same amount. The **law of conservation of energy** says: energy cannot be created or destroyed, only changed from one form to another; the total energy of an isolated system is constant.

Examples from daily life: a hydropower dam turns the gravitational energy of water into electrical energy; a mixer grinder turns electrical energy into kinetic energy and heat; the food you eat is chemical energy that your muscles convert to work and warmth.

<div class="history">

- **1807** Thomas Young introduces the word “energy” in physics.
- **1840s** James Joule measures the mechanical equivalent of heat by stirring water with falling weights: 4.18 J of work gives 1 calorie.
- **1847** Hermann von Helmholtz states the law of conservation of energy in general form.
- **1905** Einstein shows that mass itself is a form of energy: `$E = mc^2$` (beyond the syllabus here; you will meet it in nuclei).

</div>

## 8. Power

**Power** is the rate of doing work, or of transferring energy:

```math
P = \frac{W}{t}, \qquad P = \vec F\cdot\vec v = F v\cos\theta
```

The SI unit is the **watt** (W) = 1 J/s. One horsepower is about 746 W. Electricity bills use the **kilowatt-hour** (kWh), a unit of energy: 1 kWh = 3.6 × 10⁶ J.

<figure class="fig" data-fig="c11p-work-power"><figcaption>Two motors lifting the same load by 5 m. The work is the same, m g h, but the motor with more power finishes sooner. Change the load and the powers to see the times change.</figcaption></figure>

<div class="meaning">

<dl>
<dt>P</dt><dd>power in watts</dd>
<dt>F v</dt><dd>instantaneous power from a force acting on a body moving at speed v</dd>
<dt>Physical meaning</dt><dd>A weak and a strong engine can do the same total work; the strong one does it faster. A car at higher speed with the same engine power gets less pulling force (F = P/v), which is why you change to a lower gear to climb a hill.</dd>
</dl>

</div>

<div class="problem" data-problem="c11p-work-power"></div>

## 9. Collisions

A collision is a short, strong interaction between bodies. During it the internal forces are huge and external forces (like friction) are negligible, so the **total momentum is conserved**:

```math
m_1 u_1 + m_2 u_2 = m_1 v_1 + m_2 v_2
```

What differs is the kinetic energy:

- **Elastic collision**: kinetic energy is also conserved (hard steel balls, gas molecules).
- **Inelastic collision**: some kinetic energy is lost as heat and sound.
- **Perfectly inelastic collision**: the bodies stick together; the maximum possible energy is lost.

The **coefficient of restitution** `$e$` (speed of separation ÷ speed of approach) is 1 for elastic, 0 for perfectly inelastic and in between otherwise. Play with the masses and speeds:

<figure class="fig" data-fig="c11p-work-collide"><figcaption>Two blocks collide. Choose elastic, inelastic or stick-together; the bars show that momentum before and after is the same while kinetic energy may drop.</figcaption></figure>

### Elastic collision in one dimension

<div class="steps" data-fig="c11p-work-relspeed">
<div class="step">A 2 kg block moving at u₁ = 5 m/s hits a 3 kg block at rest (u₂ = 0). The collision is elastic. We want v₁ and v₂.</div>
<div class="step">Momentum is conserved: m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂, which we rearrange as m₁(u₁ − v₁) = m₂(v₂ − u₂).</div>
<div class="step">Kinetic energy is conserved: m₁(u₁² − v₁²) = m₂(v₂² − u₂²).</div>
<div class="step">Divide the energy equation by the momentum equation, using a² − b² = (a − b)(a + b). All the masses cancel and we are left with u₁ + v₁ = u₂ + v₂, that is: speed of approach = speed of separation.</div>
<div class="step">Use this simple equation with the momentum equation to get the formulas for v₁ and v₂ in terms of masses and initial speeds.</div>
<div class="step">Put in the numbers: v₁ = −1 m/s (the lighter block bounces back) and v₂ = 4 m/s. Momentum: 10 = −2 + 12. Energy: 25 J = 1 J + 24 J. Both conserved.</div>
</div>

```math
v_1 = \frac{(m_1 - m_2)u_1 + 2 m_2 u_2}{m_1 + m_2}, \qquad v_2 = \frac{(m_2 - m_1)u_2 + 2 m_1 u_1}{m_1 + m_2}
```

Special cases worth remembering: **equal masses** swap velocities (this is how Newton’s cradle works); a **light body hitting a heavy one** bounces back at nearly the same speed; a **heavy body hitting a light one** hardly slows down and shoots the light one off at about twice its speed.

<div class="problem" data-problem="c11p-work-collide"></div>

For a perfectly inelastic collision, `$v = \dfrac{m_1 u_1 + m_2 u_2}{m_1+m_2}$` and the loss of kinetic energy is `$\dfrac{m_1 m_2}{2(m_1+m_2)}(u_1-u_2)^2$`. More practice with different masses and e in the tool below, which also shows collisions in two dimensions (the 2D case, glancing blows, uses momentum along both axes; the Class 11 book treats it briefly).

<!--fig:tool collision-lab-->

Other tools for this chapter: [Collision carts](/learn/collision-carts/), [Collision calculator](/science/collision-calculator/) and [Vertical circle](/learn/vertical-circle/).

<div class="myth">

**“Energy is lost in an inelastic collision.”** Kinetic energy is lost, but the total energy is not: it becomes heat, sound and the deformation of the bodies. Momentum is never lost in any collision when no external force acts.

</div>

<div class="keypoints">

- Work `$W = F d\cos\theta$` is a scalar; it is the area under the F–x graph for a varying force. Unit: joule.
- Work-energy theorem: net work = change in kinetic energy, `$K = \tfrac12 mv^2$`.
- Conservative forces (gravity, spring) have potential energy; friction is not conservative.
- Gravity: `$U = mgh$`; spring: `$U = \tfrac12 kx^2$`. With only conservative forces `$K + U$` is constant.
- Total energy is always conserved; friction turns mechanical energy into heat.
- Power `$P = W/t = Fv$`; unit watt; 1 kWh = 3.6 × 10⁶ J.
- Collisions: momentum is always conserved. Elastic: kinetic energy conserved, e = 1. Perfectly inelastic: bodies stick, e = 0.
- Elastic 1D: speed of approach = speed of separation; equal masses swap velocities.

</div>

Going further for JEE/NEET: exam-level problems on friction with energy, variable power and the energy-method for circular motion are in [Work, energy and power (JEE)](/learn/courses/engineering-entrance/work-energy-power/); collisions in two dimensions and the centre-of-mass frame are in [Centre of mass, momentum and collisions (JEE)](/learn/courses/engineering-entrance/centre-of-mass-collisions/).

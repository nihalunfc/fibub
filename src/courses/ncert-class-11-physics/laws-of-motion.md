---
title: Laws of Motion
seoTitle: 'Laws of Motion Class 11 notes, Newton, friction, circular'
summary: 'Class 11 Laws of Motion with animations: inertia, F = ma, impulse, momentum conservation, free-body diagrams, friction and motion on a circular road.'
minutes: 100
updated: 2026-11-23
quiz:
  - q: 'A 2 kg body is acted on by two forces: 10 N to the east and 6 N to the west. Its acceleration is:'
    choices: ['2 m/s² east', '8 m/s² east', '2 m/s² west', '0']
    ans: 0
    why: 'The net force is 10 − 6 = 4 N east, so a = F/m = 4/2 = 2 m/s² east.'
  - q: 'A 60 kg person stands in a lift that accelerates upward at 2 m/s² (g = 10 m/s²). The normal force from the floor is:'
    choices: ['600 N', '480 N', '720 N', '120 N']
    ans: 2
    why: 'N − mg = ma, so N = m(g + a) = 60 × 12 = 720 N.'
  - q: 'On a flat bend of radius r with coefficient of friction μ, the greatest speed without skidding is:'
    choices: ['√(μ r g)', 'μ r g', '√(r g / μ)', 'μ √(r g)']
    ans: 0
    why: 'Friction supplies the centripetal force: μ m g = m v²/r, so v = √(μ r g). The mass cancels.'
sources:
  - 'NCERT Class 11 Physics, Chapter 4 “Laws of Motion” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Isaac Newton, Philosophiae Naturalis Principia Mathematica (1687), Axioms or Laws of Motion (for the history box)'
  - 'Friction coefficients in the examples are rounded, typical textbook values chosen for clean arithmetic, not measurements'
---

**Physics · Class 11 · Chapter 4 · about 100 minutes.** By the end you will be able to state and use Newton’s three laws, explain inertia, find impulse and use conservation of momentum, draw free-body diagrams, solve problems with strings, pulleys and slopes, handle static and kinetic friction, and explain why a car needs friction (or banking) to turn.

<div class="bigidea">A force does not keep something moving; it changes how it moves. With no net force, a body keeps its velocity (the first law). With a net force, its momentum changes at the rate of that force (the second law). And forces always come in pairs on two different bodies (the third law). Everything else in the chapter is learning to draw the forces on one body and add them correctly.</div>

## 1. Aristotle’s fallacy and Galileo’s idea

For nearly two thousand years people believed Aristotle: a body needs a push to keep moving, and it stops when you stop pushing. Everyday life seems to agree: a cycle stops when you stop pedalling.

But the cycle stops because of **friction** and air, which are forces too. Galileo rolled balls down one slope and up another. On a rougher slope the ball stopped sooner; on a smoother one it climbed almost as high as it started. He imagined a perfectly smooth, horizontal surface: the ball would roll on for ever. **Motion needs no force; only a change of motion does.**

## 2. Newton’s first law: inertia

> A body stays at rest, or moves in a straight line with constant velocity, unless a net external force acts on it.

**Inertia** is this unwillingness to change the state of motion. The greater the mass, the greater the inertia: a loaded truck is harder to start and to stop than an empty autorickshaw. Mass is the measure of inertia.

Everyday cases: passengers lurch backward when a bus starts and forward when it brakes; dust flies out when you beat a carpet; a coin drops into a glass when the card below it is flicked away.

<figure class="fig" data-fig="c11p-laws-inertia"><figcaption>A block on the floor of a bus. Press play, switch between “starts off” and “brakes hard”, change to a rough floor, and change the viewpoint between the road and the inside of the bus.</figcaption></figure>

The first law also says which frames of reference are fair to use. A frame in which a body with no force keeps moving at constant velocity is an **inertial frame** (a train at constant speed on a straight track is one; a braking bus is not).

<div class="myth">

**“A body moving at constant speed must have a force pushing it.”** If the speed and direction are both constant, the net force is zero. A cyclist riding steadily pedals only to cancel friction and air drag.

</div>

## 3. Momentum and Newton’s second law

**Momentum** is mass times velocity, `$\vec p = m\vec v$` (unit kg m/s). A cricket ball at 30 m/s has far more momentum than a tennis ball at the same speed because it is heavier; a slow truck has more momentum than a fast scooter.

> The rate of change of momentum of a body is proportional to the net force on it, and it is in the direction of the force.

```math
\vec F_{net} = \frac{d\vec p}{dt} = m\vec a \quad(\text{constant mass}), \qquad 1\ \text{N} = 1\ \text{kg m s}^{-2}
```

<div class="meaning">

<dl>
<dt>F<sub>net</sub></dt><dd>the vector sum of all the forces on the body (not one of them alone)</dd>
<dt>m</dt><dd>mass: how strongly the body resists acceleration</dd>
<dt>a</dt><dd>acceleration, in the direction of the net force</dd>
<dt>Physical meaning</dt><dd>The same push gives a cricket ball a large acceleration and a car almost none. Double the force: double the acceleration. Double the mass: half the acceleration.</dd>
</dl>

</div>

<figure class="fig" data-fig="c11p-laws-fma"><figcaption>Your trolley races a reference trolley (10 N on 5 kg). Change the force and the mass and see how the acceleration, and so the distance covered, changes.</figcaption></figure>

<div class="problem" data-problem="c11p-laws-fma"></div>

The second law is a vector equation, so it holds separately along each axis: `$F_x = ma_x$`, `$F_y = ma_y$`.

<!--fig:tool newtons-laws-->

### Impulse

When a large force acts for a very short time (a bat hitting a ball, a collision), we do not know the force at each moment, but we know its total effect. The **impulse** is

```math
\vec J = \int \vec F\,dt = \vec F_{avg}\,\Delta t = \Delta\vec p = m\vec v - m\vec u
```

Impulse is the **area under the force–time graph**, and it equals the change of momentum. Its unit (N s) equals kg m/s.

Why does a cricketer pull his hands back while catching a fast ball? The ball must lose all its momentum, so the impulse is fixed. By moving the hands back he increases the time Δt, and F_avg = Δp/Δt gets smaller. For the same reason a car has crumple zones, a high jumper lands on foam, and a person lands with bent knees.

<figure class="fig" data-fig="c11p-laws-impulse"><figcaption>The force–time graph of a ball being caught. The shaded area (the impulse) stays the same; slide the contact time and watch the peak force fall.</figcaption></figure>

<div class="problem" data-problem="c11p-laws-impulse"></div>

## 4. Newton’s third law and conservation of momentum

> To every action there is an equal and opposite reaction: if body A exerts a force on body B, then B exerts an equal and opposite force on A.

The two forces act on **different bodies**, they always occur together, and they are of the same kind (both gravitational, or both contact...). A swimmer pushes the water back, and the water pushes the swimmer forward; a rocket pushes gas down and the gas pushes the rocket up; you push the ground backward when you walk, and the ground pushes you forward.

<div class="myth">

**“Action and reaction cancel, so nothing can ever move.”** They are on different bodies, so they cannot cancel each other. A horse pulls the cart (a force on the cart) and the cart pulls the horse back (a force on the horse). The cart moves because the horse’s pull on the **cart** is larger than the friction on the cart; the horse moves because the ground pushes the **horse** forward more than the cart pulls it back.

</div>

### Conservation of momentum

For a system on which no net external force acts, the total momentum stays constant. It follows from the second and third laws: in a collision the force on A is the negative of the force on B for the same time, so the impulses cancel and the total momentum does not change: `$m_1\vec u_1 + m_2\vec u_2 = m_1\vec v_1 + m_2\vec v_2$`.

Two skaters at rest push each other: they move off in opposite directions with `$m_1v_1 = m_2v_2$`, and the lighter one is faster. A gun recoils when it fires a bullet for the same reason; a balloon lets out air and shoots forward.

<figure class="fig" data-fig="c11p-laws-recoil"><figcaption>Two skaters pushing apart. Change either mass and press play: the impulses are equal and opposite, the speeds are inversely proportional to the masses, and the total momentum bar stays at zero.</figcaption></figure>

<div class="problem" data-problem="c11p-laws-recoil"></div>

## 5. Equilibrium of a particle

A particle is in **equilibrium** when the net force on it is zero: `$\sum \vec F = 0$`, so `$\sum F_x = 0$` and `$\sum F_y = 0$`. A lamp hanging from the ceiling by two strings is in equilibrium: the two tensions and the weight add up to zero. Drawn head to tail, three such forces make a closed triangle (and for a triangle Lami’s theorem says each force is proportional to the sine of the angle between the other two).

<figure class="fig" data-fig="c11p-laws-tension"><figcaption>A lamp on two strings. Change the angles and the weight; the force triangle always closes. Make the strings nearly horizontal and notice how huge the tensions become: that is why a clothes line can never be pulled completely straight.</figcaption></figure>

## 6. Common forces in mechanics, and free-body diagrams

- **Weight** `$W = mg$`, downward, from the Earth’s gravity.
- **Normal reaction N**: the push of a surface, perpendicular to it. It adjusts to what is needed (it is not always equal to mg).
- **Tension T**: the pull of a string or rope, along the string. For a light string over a smooth pulley the tension is the same throughout.
- **Friction f**: parallel to the surface, opposing the relative (or attempted) motion.
- **Spring force** `$F = -kx$` (restoring), and the contact and applied forces.

A **free-body diagram (FBD)** is the key to every mechanics problem: draw the body alone as a dot and show **only the forces acting on it**, with arrows. Then write F = ma along the chosen axes.

<div class="steps" data-fig="c11p-laws-fbdsteps">
<div class="step">A 3 kg block rests on a smooth table, joined by a light string over a pulley to a 2 kg block hanging at the edge. Take g = 10 m/s². Both blocks have the same acceleration a and the string has the same tension T.</div>
<div class="step">FBD of block 1: weight m₁g down, normal N up (they cancel: no vertical acceleration), and the string pulls it sideways with T.</div>
<div class="step">FBD of block 2: weight m₂g down and tension T up.</div>
<div class="step">Newton’s second law along the motion. Block 1: T = m₁a. Block 2 (taking down as positive): m₂g − T = m₂a.</div>
<div class="step">Add the two equations: m₂g = (m₁ + m₂)a. So a = 20/5 = 4 m/s².</div>
<div class="step">Substitute back: T = m₁a = 3 × 4 = 12 N. Check block 2: 20 − 12 = 8 = 2 × 4. ✓</div>
</div>

<div class="problem" data-problem="c11p-laws-pulley"></div>

Build and test free-body diagrams here:

<!--fig:tool free-body-diagram-->

For two hanging masses over a pulley (the Atwood machine), and for a person weighed in a lift, the same method works:

<figure class="fig" data-fig="@mech-atwood"><figcaption>Atwood machine or mass on a table with sliders for the masses. The tension and acceleration follow from the two equations.</figcaption></figure>

<figure class="fig" data-fig="@mech-lift-pseudo"><figcaption>A person on a scale in a lift. The scale reads the normal force N = m(g + a) when accelerating up, m(g − a) when accelerating down, and zero in free fall.</figcaption></figure>

<div class="problem" data-problem="c11p-laws-lift"></div>

## 7. Friction

Friction is the force between two surfaces in contact that opposes their relative motion.

- **Static friction** f_s acts when there is no sliding. It adjusts to match the applied force, up to a maximum `$f_{s,max} = \mu_s N$`.
- **Kinetic (sliding) friction** acts once sliding starts: `$f_k = \mu_k N$`, with `$\mu_k$` slightly less than `$\mu_s$`.
- **Rolling friction** (a wheel, a ball bearing) is much smaller than sliding friction, which is why wheels were invented.

μ is the **coefficient of friction**, a pure number set by the two surfaces. To a good approximation friction does not depend on the area of contact, only on N.

<figure class="fig" data-fig="c11p-laws-friction"><figcaption>Push a block with a force you choose. While it is at rest the friction equals the push (the sloping line); beyond the limit μₛN the block slides and the friction falls to μₖN (the flat line). Change the two coefficients.</figcaption></figure>

On a slope of angle θ the weight splits into `$mg\sin\theta$` along the slope and `$mg\cos\theta$` into it, so `$N = mg\cos\theta$`. A block just starts to slide when `$\tan\theta = \mu_s$` (the **angle of repose**). If it slides, `$a = g(\sin\theta - \mu_k\cos\theta)$`.

<div class="problem" data-problem="c11p-laws-incline"></div>

Try a block on a ramp with your own angle and friction:

<!--fig:tool friction-ramp-->

<div class="myth">

**“Friction is always a nuisance.”** Without friction you could not walk, grip a pencil, drive or brake. We want more friction on tyres and brakes and less in bearings and engines.

</div>

## 8. Circular motion and the need for a centripetal force

From the last chapter, a body moving in a circle has an acceleration v²/r towards the centre. By the second law there must be a net force that way: the **centripetal force** `$F = \dfrac{mv^2}{r}$`. It is not a new force, only the name for the sum of the real forces pointing to the centre: tension for a stone on a string, gravity for a satellite, friction for a car on a flat bend.

**Car on a flat bend.** The centripetal force is the friction between tyres and road: `$\mu mg \ge \dfrac{mv^2}{r}$`, so

```math
v_{max} = \sqrt{\mu\,r\,g}
```

The mass cancels: a heavy lorry and a small car have the same limit. On a wet road μ is smaller, so the safe speed drops.

<figure class="fig" data-fig="c11p-laws-curve"><figcaption>A car on a flat circular road. Raise the speed or switch to a wet or icy road: beyond v_max the friction cannot supply enough centripetal force and the car shoots off along the tangent.</figcaption></figure>

<div class="problem" data-problem="c11p-laws-curve"></div>

**Banked road.** If the road is banked at angle θ, the horizontal part of the normal force supplies the centripetal force, so a car can turn without needing friction at the **design speed**:

```math
\tan\theta = \frac{v^2}{r g} \quad\Rightarrow\quad v = \sqrt{r g \tan\theta}
```

Explore banking, with and without friction, in the [Banked curve](/learn/banked-curve/) tool and the conical-pendulum figure:

<figure class="fig" data-fig="@mech-banked-conical"><figcaption>A banked road (normal force, weight, and the friction needed) and a conical pendulum.</figcaption></figure>

<div class="history">

<ul class="timeline">
<li><b>c. 335 BCE</b> Aristotle: motion needs a continuing push.</li>
<li><b>1638</b> Galileo’s smooth-plane thought experiment: motion continues by itself without friction.</li>
<li><b>1687</b> Newton’s <i>Principia</i> states the three laws of motion.</li>
<li><b>1969</b> Apollo 11’s rocket obeys the third law all the way to the Moon: gas goes down, the rocket goes up.</li>
</ul>

</div>

<div class="history">

**Beyond the syllabus.** In a frame that is itself accelerating (a lift, a turning bus) Newton’s laws can be kept by adding a fictitious “pseudo force” −ma. It is not examined in Class 11, but the lift problem above is easier with it: in the lift’s frame the person feels an extra weight force ma downward.

</div>

<div class="keypoints">

- First law: no net force means constant velocity (or rest). Inertia is measured by mass.
- Second law: F_net = dp/dt = ma. Unit newton: 1 N = 1 kg m/s². It works component by component.
- Impulse J = F_avg Δt = Δp = area under the F–t graph. A longer contact time means a smaller force.
- Third law: equal and opposite forces on different bodies. In an isolated system total momentum is conserved: m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂.
- Equilibrium: ΣF = 0. Draw a free-body diagram (forces on one body only), then write F = ma on each axis.
- Friction: static f ≤ μ_sN; kinetic f = μ_kN; on a slope N = mg cosθ and tanθ = μ_s at the angle of repose.
- Circular motion needs centripetal force mv²/r. Flat bend: v_max = √(μrg). Banked road: tanθ = v²/rg.
- Lift: N = m(g + a) going up faster, m(g − a) down faster, 0 in free fall.

</div>

Going further for JEE/NEET: pseudo forces, constraint relations for pulleys, friction on blocks stacked on blocks and variable-mass motion are in [Laws of motion (JEE)](/learn/courses/engineering-entrance/laws-of-motion/).

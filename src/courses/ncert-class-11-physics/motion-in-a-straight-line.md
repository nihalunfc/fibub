---
title: Motion in a Straight Line
seoTitle: 'Motion in a Straight Line Class 11 notes and graphs'
summary: 'Class 11 Motion in a Straight Line with animations: velocity, acceleration, x-t and v-t graphs, equations of motion, free fall and relative velocity.'
minutes: 85
updated: 2026-11-23
quiz:
  - q: 'A car travels 30 km at 30 km/h and then 30 km at 60 km/h along a straight road. Its average speed is:'
    choices: ['45 km/h', '40 km/h', '50 km/h', '36 km/h']
    ans: 1
    why: 'Total distance 60 km. Time = 1 h + 0.5 h = 1.5 h. Average speed = 60/1.5 = 40 km/h, not the plain average 45 km/h.'
  - q: 'The area under a velocity–time graph between two instants gives:'
    choices: ['acceleration', 'displacement', 'speed', 'jerk']
    ans: 1
    why: 'Area under v–t is the integral of v dt, the displacement (signed). Slope of v–t gives acceleration.'
  - q: 'A stone is thrown up at 20 m/s. Taking g = 10 m/s², the time it takes to return to the hand is:'
    choices: ['2 s', '4 s', '6 s', '8 s']
    ans: 1
    why: 'Up and down both take u/g = 2 s, so the total is 4 s. Check with s = ut − ½gt² = 0, giving t = 2u/g = 4 s.'
sources:
  - 'NCERT Class 11 Physics, Chapter 2 “Motion in a Straight Line” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Standard gravity g = 9.80665 m/s² exactly: BIPM, SI Brochure, 9th edition (2019); surface gravity of Moon, Mars and Jupiter: NASA Planetary Fact Sheets'
  - 'Galileo Galilei, Discorsi e dimostrazioni matematiche intorno a due nuove scienze (1638), Third Day, on the odd-number rule for falling bodies (for the history box)'
---

**Physics · Class 11 · Chapter 2 · about 85 minutes.** By the end you will be able to describe straight-line motion with position, displacement, velocity and acceleration, read and draw x–t and v–t graphs, derive and use the three equations of uniform acceleration, solve free-fall problems and find how fast two bodies approach each other.

<div class="bigidea">Motion is change of position with time. Everything in this chapter comes from two questions asked again and again: “how fast is the position changing?” (velocity, the slope of the x–t graph) and “how fast is the velocity changing?” (acceleration, the slope of the v–t graph). Go the other way and you get areas: the area under v–t is how far you went.</div>

## 1. Position, path length and displacement

To say that something moves we need a **frame of reference**: a place to measure from (the origin), a direction, and a clock. A train passenger is at rest in the train’s frame and moving at 100 km/h in the frame of the platform.

For motion along a straight line we choose an axis with a sign convention: one direction is positive, the opposite is negative. The **position** x is the signed distance from the origin.

- **Path length (distance)** is the total length of the route actually travelled. It is never negative and never decreases.
- **Displacement** `$\Delta x = x_2 - x_1$` is the change of position: the straight-line gap from the start to the end, with a sign. It can be positive, negative or zero.

A morning jogger runs 400 m once round the school track and ends where she began: path length 400 m, displacement 0. Because the straight line is the shortest path, `$|\Delta x| \le$` path length, always.

<div class="myth">

**“If displacement is zero, nothing happened.”** A lot happened: the jogger ran 400 m! Displacement only compares the end points. That is why distance and displacement must never be mixed up, and why average speed and average velocity can differ.

</div>

## 2. Average velocity, speed and instantaneous velocity

**Average velocity** is displacement divided by the time taken: `$\bar v = \dfrac{\Delta x}{\Delta t}$`. **Average speed** is path length divided by time. Speed has no direction and is never negative.

A bus covers 60 km east in 1 h and returns 60 km west in the next hour: average speed 60 km/h, average velocity zero.

A common trap: if you travel the first half of a **distance** at v₁ and the second half at v₂, the average speed is the **harmonic** mean `$\dfrac{2v_1v_2}{v_1+v_2}$`, not the simple average, because you spend more time at the slower speed.

<div class="problem" data-problem="c11p-line-avg"></div>

### Instantaneous velocity: the slope of a tangent

The speedometer does not show an average; it shows the velocity at this instant. To find it, take a shorter and shorter time interval:

```math
v = \lim_{\Delta t \to 0}\frac{\Delta x}{\Delta t} = \frac{dx}{dt}
```

On an x–t graph, the average velocity is the slope of the **chord** joining two points; as the interval shrinks the chord turns into the **tangent**, and its slope is the instantaneous velocity. Drag the interval down to see it.

<figure class="fig" data-fig="c11p-line-slope"><figcaption>The position curve is x = 0.4t² + 0.5t. The orange line is the chord for the interval Δt you choose, the green dashed line is the tangent. As Δt shrinks, the two slopes agree.</figcaption></figure>

<div class="meaning">

<dl>
<dt>Δx / Δt</dt><dd>average velocity over an interval; a chord slope</dd>
<dt>dx / dt</dt><dd>instantaneous velocity at one instant; a tangent slope. Read it as “a tiny bit of x per tiny bit of t”</dd>
<dt>Speed</dt><dd>the magnitude of the instantaneous velocity (for a straight line, instantaneous speed and the size of velocity are equal)</dd>
<dt>Physical meaning</dt><dd>A taxi meter shows the average fare per km for the trip, while the speedometer shows what the car is doing right now.</dd>
</dl>

</div>

## 3. Acceleration

**Acceleration** is the rate of change of velocity: `$a = \dfrac{dv}{dt}$`, average acceleration `$\bar a = \dfrac{\Delta v}{\Delta t}$`, in m/s². A car that goes from 0 to 100 km/h (27.8 m/s) in 10 s has an average acceleration of 2.78 m/s².

- If a and v have the same sign the body speeds up; with opposite signs it slows down (a **retardation**, or deceleration).
- A negative acceleration does not always mean slowing: a car reversing and speeding up has negative v and negative a.
- Velocity can be zero while acceleration is not: a ball at the top of its flight.

### Three graphs, one motion

Motion has three “faces”: the position x(t), the velocity v(t) and the acceleration a(t). Each is the slope of the one before and the area under the one after.

<figure class="fig" data-fig="c11p-line-car"><figcaption>Pick a motion and press play. The car moves on the road while the marker travels across all three graphs. Slope of x–t = v; slope of v–t = a; the v graph is the running area of the a graph.</figcaption></figure>

| Graph | Slope gives | Area under it gives |
|---|---|---|
| position–time (x–t) | velocity | no simple meaning |
| velocity–time (v–t) | acceleration | displacement |
| acceleration–time (a–t) | jerk (rate of change of a) | change in velocity |

Shapes to know: a horizontal x–t line = at rest; a sloped straight x–t line = uniform velocity; a parabola x–t = uniform acceleration; a horizontal v–t line = uniform velocity; a sloped straight v–t line = uniform acceleration.

Build your own three-stage journey and watch all graphs update:

<figure class="fig" data-fig="@mech-vt-builder"><figcaption>Three stages of constant acceleration with linked a–t, v–t and x–t graphs and a car on the road.</figcaption></figure>

<!--fig:tool motion-graphs-->

### Displacement and distance from a v–t graph

The signed area gives the displacement; the area ignoring signs gives the distance. A ball thrown up at 20 m/s and caught after 4 s has displacement 0 (back at the hand) but has travelled 40 m.

<figure class="fig" data-fig="c11p-line-area"><figcaption>Velocity of a ball thrown up at 20 m/s. The blue area (going up) is positive, the orange area (coming down) is negative. Move the time and compare the signed area (displacement) with the plain area (distance).</figcaption></figure>

<div class="problem" data-problem="c11p-line-area"></div>

<div class="myth">

**“A bigger velocity means a bigger acceleration.”** Acceleration tells how fast the velocity changes. A jet cruising at 900 km/h steadily has zero acceleration; a cricket ball just hit has a huge acceleration at the bat although its speed is small just before.

</div>

## 4. Equations of uniformly accelerated motion

If the acceleration a is **constant** (a car pulling away smoothly, a stone falling), three equations connect u (initial velocity), v (final velocity), a, t and s (displacement). The v–t graph of such motion is a straight line, and the whole derivation comes from reading that line.

<div class="steps" data-fig="c11p-line-derive">
<div class="step">Draw the v–t graph for a body that starts with velocity u and has constant acceleration a, reaching v after time t. It is a straight line.</div>
<div class="step">The slope of the line is the acceleration: a = (v − u)/t. Rearranged, the **first equation**: v = u + at.</div>
<div class="step">The displacement is the area under the graph, which is a trapezoid; split it into a rectangle (height u, width t) and a triangle on top (height v − u).</div>
<div class="step">Rectangle: ut. Triangle: ½ × t × (v − u) = ½ × t × at = ½at². Add them: the **second equation** s = ut + ½at².</div>
<div class="step">The trapezoid area is also (average of the two parallel sides) × width = ½(u + v)t: displacement = average velocity × time.</div>
<div class="step">Put t = (v − u)/a into s = ½(u + v)t: s = (v² − u²)/2a, so the **third equation** v² = u² + 2as. It has no t in it.</div>
</div>

```math
v = u + at \qquad s = ut + \tfrac12 at^2 \qquad v^2 = u^2 + 2as \qquad s = \tfrac{u+v}{2}\,t
```

A related result: the distance covered in the n-th second is `$s_n = u + a\left(n - \tfrac12\right)$`.

**Calculus route** (elementary differentiation and integration, which the syllabus allows): since `$a = dv/dt$` is constant, integrating gives `$v = u + at$`; since `$v = dx/dt$`, integrating again gives `$x = x_0 + ut + \tfrac12 at^2$`.

<div class="meaning">

<dl>
<dt>u, v</dt><dd>velocity at the start and at the end of the time t (signed)</dd>
<dt>a</dt><dd>constant acceleration (signed: use a negative number for a retardation)</dd>
<dt>s</dt><dd>displacement in time t (not distance, if the body turns back)</dd>
<dt>Physical meaning</dt><dd>Which equation? List what you know and what you want. No v and no s given: use the first. No v: the second. No t: the third.</dd>
</dl>

</div>

<div class="problem" data-problem="c11p-line-eqn"></div>

Test your choice of equation by changing the numbers:

<!--fig:tool equations-of-motion-->

### Why stopping distance grows so quickly

On the road, the car travels at the old speed v during your **reaction time** t_r before braking starts, and then needs v²/2a more. Because of the square, doubling the speed quadruples the braking distance. This is why speed limits are lower near schools and on wet roads (a is smaller).

<figure class="fig" data-fig="c11p-line-brake"><figcaption>Reaction distance plus braking distance. Raise the speed or switch to a wet road and see whether the car stops before the child.</figcaption></figure>

## 5. Free fall

An object that moves only under gravity is in **free fall**. Near the Earth’s surface, without air resistance, every body has the same acceleration `$g \approx 9.8\ \text{m/s}^2$` directed downward, whatever its mass. (On a rainy day a feather falls slowly only because of the air, not because it is light. An astronaut on the Moon drops both a hammer and a feather and they land together.)

Take the upward direction as positive, so a = −g in all the equations:

- Dropped from rest: `$h = \tfrac12 gt^2$`, `$v = gt$`, `$v^2 = 2gh$`.
- Thrown up at u: time to the top `$t = u/g$`, maximum height `$H = u^2/2g$`, total time of flight `$2u/g$`. It returns to the hand with the same speed u.

<figure class="fig" data-fig="c11p-line-freefall"><figcaption>A ball released from a height. The ghosts are equal time apart, and the gaps between them grow as 1 : 3 : 5 : 7. Change the world: the pattern stays and only g changes.</figcaption></figure>

<div class="problem" data-problem="c11p-line-fall"></div>

<div class="problem" data-problem="c11p-line-up"></div>

<div class="history">

<ul class="timeline">
<li><b>c. 335 BCE</b> Aristotle teaches that heavy bodies fall faster, in proportion to their weight.</li>
<li><b>1638</b> Galileo, studying balls on slopes, shows that the distances covered in equal times from rest are in the ratio 1 : 3 : 5 : 7 ... and all bodies fall alike.</li>
<li><b>1971</b> Apollo 15 astronaut David Scott drops a hammer and a falcon feather on the Moon; they land together.</li>
</ul>

</div>

## 6. Relative velocity in one dimension

The velocity of A **relative to B** is what B sees: `$v_{AB} = v_A - v_B$` (both measured in the same frame). Two cars on the same road at 20 m/s and 15 m/s in the same direction: the faster one gains 5 m every second, so a gap of 100 m closes in 20 s. If they run toward each other, the speeds add: 35 m/s.

A moving train always makes the one on the next track look slow or fast. When your train overtakes another, the other seems to go backwards.

<figure class="fig" data-fig="c11p-line-meet"><figcaption>Two vehicles on one road. The point where the x–t lines cross is where they meet; the steeper the gap closes (the bigger vA − vB), the sooner. Make B negative to see a head-on meeting.</figcaption></figure>

<div class="problem" data-problem="c11p-line-meet"></div>

<div class="keypoints">

- Displacement Δx = x₂ − x₁ (signed); distance is the path length, ≥ |Δx|.
- Average velocity = Δx/Δt; average speed = distance/time. Instantaneous velocity v = dx/dt = slope of the tangent on x–t.
- Acceleration a = dv/dt = slope of v–t. Same sign for v and a: speeding up; opposite signs: slowing down.
- Area under v–t = displacement (signed); area ignoring signs = distance.
- For constant a: v = u + at; s = ut + ½at²; v² = u² + 2as; s = ½(u + v)t; s_n = u + a(n − ½).
- Free fall: a = −g = −9.8 m/s² for up or down. Thrown up: t = u/g, H = u²/2g, time of flight 2u/g. Equal-time distances 1 : 3 : 5 : ...
- Stopping distance = v t_r + v²/2a. Relative velocity v_AB = v_A − v_B.

</div>

Going further for JEE/NEET: variable acceleration, graph tricks, and chase and meet problem sets are in [Motion in a straight line (JEE)](/learn/courses/engineering-entrance/motion-straight-line/).

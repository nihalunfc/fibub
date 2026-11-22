---
title: Motion in a straight line
seoTitle: 'Motion in a straight line: JEE and NEET kinematics'
summary: 'Displacement, velocity and acceleration, reading x-t and v-t graphs, the equations of uniformly accelerated motion, free fall, the distance in the nth second, relative velocity, and motion with changing acceleration using calculus.'
minutes: 32
updated: 2026-11-22
quiz:
  - q: 'A car''s velocity-time graph is a straight line sloping down and crossing the time axis. After it crosses, the car is:'
    choices: ['Stopped', 'Moving backwards and speeding up', 'Moving forwards and slowing down', 'Moving backwards and slowing down']
    ans: 1
    why: 'Below the axis the velocity is negative (backwards). Its size grows as the line goes further down, so the car speeds up in the backward direction, with the same negative acceleration throughout.'
  - q: 'A ball is thrown straight up. At the highest point:'
    choices: ['velocity and acceleration are both zero', 'velocity is zero, acceleration is g downwards', 'velocity is maximum, acceleration is zero']
    ans: 1
    why: 'The ball stops for an instant, but gravity never switches off: the acceleration stays 9.8 m/s² downwards. That is why it comes back down.'
  - q: 'Two trains move towards each other on parallel tracks at 20 m/s and 30 m/s. The speed of one as seen from the other is:'
    choices: ['10 m/s', '25 m/s', '50 m/s']
    ans: 2
    why: 'Relative velocity = v₁ − v₂ with signs. Taking one direction as positive: 20 − (−30) = 50 m/s.'
sources:
  - 'National Medical Commission NEET (UG) syllabus and JEE Main / JEE Advanced 2026 syllabi: Kinematics'
  - 'Standard gravity g = 9.806 65 m/s² (exact by definition), BIPM SI Brochure, 9th edition https://www.bipm.org/en/publications/si-brochure'
---

**Physics · Class 11 · about 32 minutes.** By the end you will be able to describe any straight-line motion with graphs and equations, solve free-fall and chase problems, and handle acceleration that changes with time, position or speed.

<div class="bigidea">Velocity is how fast position changes, and acceleration is how fast velocity changes. On graphs, a slope gives the next quantity down the chain and an area gives the one before it. Everything in this chapter follows from that one picture.</div>

## 1. Position, displacement, distance

Choose an **origin** and a **positive direction**; write them down before every problem. Position x is where the body is. **Displacement** is the change in position, `$\Delta x = x_2 - x_1$`, and can be negative. **Distance** is the total path length, never negative and never less than the size of the displacement.

- **Average velocity** = displacement / time. **Average speed** = distance / time.
- **Instantaneous velocity** `$v = \dfrac{dx}{dt}$`, the slope of the x-t graph at that instant.
- **Acceleration** `$a = \dfrac{dv}{dt} = \dfrac{d^2x}{dt^2}$`, the slope of the v-t graph.

<div class="myth">

**"Negative acceleration means slowing down."** Not always. Slowing down happens when velocity and acceleration point in **opposite** directions. A body moving in the negative direction with negative acceleration is **speeding up**. Always compare the signs of v and a.

</div>

## 2. One motion, three graphs

Watch a motion drawn three ways at once. Pick a motion, play it, and watch how the slope of each graph is the height of the one below.

<figure class="fig" data-fig="motion-graphs"><figcaption>Top: position. Middle: velocity, the slope of the top graph. Bottom: acceleration, the slope of the middle graph. The area under the velocity graph is the displacement.</figcaption></figure>

<div class="steps">
<div class="step"><b>Slope of x-t = velocity.</b> A straight x-t line means constant velocity; a curve bending upwards means the velocity is increasing.</div>
<div class="step"><b>Slope of v-t = acceleration.</b> A straight v-t line means constant acceleration, which is when the equations below apply.</div>
<div class="step"><b>Area under v-t = displacement.</b> Area below the time axis counts as negative. Add the sizes of all areas to get the distance.</div>
<div class="step"><b>Area under a-t = change in velocity.</b> You need the starting velocity to know the velocity itself.</div>
<div class="step"><b>Impossible graphs.</b> Two velocities at one instant, a vertical x-t line (infinite speed) or a negative distance can never happen; exams use them as wrong options.</div>
</div>

## 3. The equations of constant acceleration

When the acceleration a is constant (and only then):

```math
v = u + at, \qquad s = ut + \tfrac12 at^2, \qquad v^2 = u^2 + 2as, \qquad s = \tfrac{(u+v)}{2}\,t
```

<div class="meaning">
<dl>
<dt>u</dt><dd>velocity at t = 0 (with a sign)</dd>
<dt>v</dt><dd>velocity at time t</dd>
<dt>a</dt><dd>the constant acceleration (with a sign)</dd>
<dt>s</dt><dd>displacement in time t, not distance</dd>
<dt>Physical meaning</dt><dd>With constant acceleration the velocity grows in equal steps each second, so the average velocity is exactly halfway between u and v, and the displacement is that average times the time.</dd>
</dl>
</div>

**Distance in the nth second** (the second from t = n − 1 to t = n): `$s_n = u + \tfrac{a}{2}(2n - 1)$`. Starting from rest, the distances in successive seconds are in the ratio **1 : 3 : 5 : 7 …** (Galileo's odd-number rule), and the distances in the first 1, 2, 3 seconds are in the ratio 1 : 4 : 9.

<div class="problem" data-problem="nth-second"></div>

**Stopping distance** grows as the square of speed: `$s = u^2/(2a)$`. Double the speed and the braking distance becomes four times as long.

<div class="problem" data-problem="brake-distance"></div>

## 4. Free fall and vertical throws

Near the Earth, without air resistance, every body has the same downward acceleration g ≈ 9.8 m/s² (exams sometimes use 10). Take **up as positive**, so a = −g.

- Thrown up at u: time to the top `$u/g$`, maximum height `$u^2/(2g)$`, total time back to the hand `$2u/g$`, and it returns with speed u.
- At equal heights going up and coming down, the speeds are equal (energy is conserved).
- Dropped from height h: time `$\sqrt{2h/g}$`, landing speed `$\sqrt{2gh}$`.

<div class="problem" data-problem="throw-up"></div>

<div class="myth">

**"A body thrown downwards from a tower and one thrown upwards with the same speed land with different speeds."** They land with the same speed. The one thrown up comes back past the top of the tower moving down at the same speed u, and from there its motion is identical to the other's. It just takes longer.

</div>

## 5. Relative velocity in one dimension

The velocity of A as seen by B is `$v_{AB} = v_A - v_B$` (with signs). Two bodies moving the same way close at the **difference** of their speeds; moving towards each other, at the **sum**. In chase problems, write each position as a function of time and set them equal.

<div class="problem" data-problem="chase"></div>

Two bodies in free fall have **zero relative acceleration** (both accelerate at g), so seen from one, the other moves at a constant velocity. Many "two balls thrown at different times" questions become one-line problems this way.

## 6. When the acceleration changes (JEE Main and Advanced)

The constant-acceleration equations fail when a changes. Go back to the definitions:

| Given | Use |
|---|---|
| a as a function of t | `$v = u + \int_0^t a\,dt$`, then `$x = x_0 + \int_0^t v\,dt$` |
| a as a function of x | `$a = v\dfrac{dv}{dx}$`, so `$\int v\,dv = \int a\,dx$` |
| a as a function of v | `$\dfrac{dv}{dt} = a(v)$` gives t; `$v\dfrac{dv}{dx} = a(v)$` gives x |

**Example (level 4).** A particle moving with v₀ has retardation proportional to its speed, a = −kv. Then `$dv/dt = -kv$` gives `$v = v_0 e^{-kt}$`, and `$v\,dv/dx = -kv$` gives `$v = v_0 - kx$`: it stops after a distance `$v_0/k$`, but only after an infinite time.

<div class="keypoints">

- Fix an origin and a positive direction first; displacement, velocity and acceleration carry signs.
- Speeding up when v and a have the same sign, slowing down when opposite.
- Slope of x-t = v, slope of v-t = a; area under v-t = displacement, area under a-t = change in velocity.
- v = u + at, s = ut + ½at², v² = u² + 2as, only for constant acceleration; nth-second distance u + a(2n − 1)/2.
- Free fall: a = −g with up positive; time up u/g, height u²/2g, returns with speed u.
- Relative velocity v_A − v_B; bodies in free fall have zero relative acceleration.
- Changing acceleration: integrate, using a = dv/dt or a = v dv/dx.

</div>

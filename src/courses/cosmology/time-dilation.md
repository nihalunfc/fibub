---
title: 'Time dilation and length contraction'
seoTitle: 'Time dilation and length contraction, simply explained'
summary: 'Why moving clocks tick slower and moving rulers shrink, worked out with a light clock and Pythagoras. Cosmic-ray muons, clocks flown on planes and the twin paradox, with a live light clock and problems.'
minutes: 15
updated: 2026-11-22
quiz:
  - q: A clock moves past you at 0.6 times the speed of light (γ = 1.25). While your clock ticks 10 seconds, how many does it tick?
    choices: ["12.5 seconds","10 seconds","8 seconds"]
    ans: 2
    why: Moving clocks run slow by the factor γ. 10 ÷ 1.25 = 8 seconds.
  - q: Why do muons made high in the atmosphere reach the ground?
    choices: ["They are not affected by air","Their fast-moving internal clocks run slow, so fewer decay on the way","They travel faster than light"]
    ans: 1
    why: Muons live about 2.2 microseconds at rest. Moving near light speed, their time runs several times slower as seen from the ground, so many survive the trip.
  - q: In the twin paradox, why is it the travelling twin who ends up younger?
    choices: ["The Earth twin moves faster","The traveller turns round, so the two journeys are not the same","Space travel is bad for clocks"]
    ans: 1
    why: Only the traveller changes direction (speeds up and slows down), so the situation is not symmetrical. Every careful calculation and experiment agrees the traveller ages less.
sources:
  - 'A. Einstein (1905), Zur Elektrodynamik bewegter Körper, Annalen der Physik 17, 891 https://doi.org/10.1002/andp.19053221004'
  - 'J. C. Hafele and R. E. Keating (1972), Around-the-world atomic clocks: observed relativistic time gains, Science 177, 168 https://doi.org/10.1126/science.177.4044.168'
  - 'C. M. Will (2014), The confrontation between general relativity and experiment, Living Reviews in Relativity 17, 4 https://doi.org/10.12942/lrr-2014-4'
---

**Module 3 · about 15 minutes.** Read first: [3.1 The speed of light](/learn/courses/cosmology/speed-of-light/). By the end you will be able to explain why moving clocks run slow, work out by how much, and say how we know it is real.

<div class="bigidea">Time is not the same for everyone. A clock that moves past you ticks slower than yours, and the faster it goes, the slower it ticks.</div>

## 1. The light clock

Imagine the simplest possible clock: two mirrors facing each other, with a flash of light bouncing between them. Each round trip is one "tick".

Put one light clock beside you and let an identical one fly past. To you, the light in the moving clock does not go straight up and down. It goes up on a slant, because the mirrors move sideways while the light travels. A slanted path is longer. Light's speed is the same for you as for anyone (Lesson 3.1), so a longer path takes longer. **The moving clock ticks slower.**

<figure class="fig" data-fig="light-clock"><figcaption>Two identical light clocks. The one on the right moves; from the ground its light runs on a longer, slanted path at the same speed c, so each tick takes longer. Drag its speed and compare the tick counts.</figcaption></figure>

## 2. By how much? Pythagoras tells us

<div class="steps">
<div class="step">In the moving clock's own frame, light goes straight up a height L in time t₀ (its own tick): L = c t₀.</div>
<div class="step">From the ground, the same trip takes a longer time t. In that time the clock moves sideways a distance v t, and the light travels a slanted path c t.</div>
<div class="step">The three lengths make a right-angled triangle: (c t)² = (c t₀)² + (v t)².</div>
<div class="step">Solve for t: t = t₀ ÷ √(1 − v²/c²). The square root is less than 1, so t is longer than t₀: the moving clock's tick lasts longer.</div>
</div>

```math
t = \gamma\, t_0, \qquad \gamma = \frac{1}{\sqrt{1 - v^{2}/c^{2}}}
```

<div class="meaning">

<dl>
<dt>t₀</dt><dd>time on the moving clock (its "own" or proper time)</dd>
<dt>t</dt><dd>time on your clock for the same tick</dd>
<dt>γ (gamma)</dt><dd>the stretch factor; 1 at everyday speeds, 1.25 at 0.6 c, 7.1 at 0.99 c, and endless at c</dd>
<dt>Physical meaning</dt><dd>At everyday speeds γ is so close to 1 that nobody notices. Near light speed time for the mover slows dramatically. Nothing with mass can reach c, because γ would become infinite.</dd>
</dl>

</div>

A jet airliner at 250 m/s has γ = 1.000 000 000 000 35. Tiny, but in 1971 Joseph Hafele and Richard Keating flew atomic clocks around the world and measured the difference: tens to hundreds of nanoseconds, as predicted.

<div class="problem" data-problem="twin-clock"></div>

## 3. Muons: time dilation in the sky

Cosmic rays hitting the top of the atmosphere, about 15 km up, make particles called **muons**. A muon at rest lives only about 2.2 millionths of a second. Even at nearly the speed of light it could only travel about 660 m in that time, so almost none should reach the ground. Yet detectors at sea level count them all the time.

The reason: they move at about 0.995 c, where γ ≈ 10. From the ground their clocks run about 10 times slow, so they live about ten times longer and many survive the trip. From the muon's point of view, the other half of the story applies: the atmosphere rushing past it is **shortened** by the same factor, so the trip is shorter.

## 4. Length contraction

That second effect is general. A ruler moving along its length is measured shorter, by the same factor γ:

```math
L = \frac{L_0}{\gamma}
```

<div class="meaning">

<dl>
<dt>L₀</dt><dd>the length of an object measured by someone moving with it</dd>
<dt>L</dt><dd>its length measured by someone it moves past</dd>
<dt>Physical meaning</dt><dd>Time and length change together, so that everyone still gets the same speed of light. Neither view is "the real one": they are two viewpoints of one four-dimensional spacetime.</dd>
</dl>

</div>

<div class="myth">

**"Time dilation is just clocks misbehaving."** It is time itself. Heartbeats, chemical reactions, decaying particles and the ageing of a traveller all slow by the same factor. It is a property of space and time, not of any machine.

</div>

<div class="history">

**The twin paradox.** One twin flies to a star at 0.8 c and back; the other stays home. Each sees the other's clock running slow on the way, which sounds like a contradiction. It is not: only the traveller turns round, and that breaks the symmetry. When they meet, the traveller is younger. Particle accelerators and flying clocks confirm the arithmetic.

</div>

<div class="keypoints">

- A moving clock ticks slower by the factor γ = 1/√(1 − v²/c²), which follows from a light clock and Pythagoras.
- A moving object is shorter along its motion by the same factor.
- γ is about 1 at everyday speeds and grows without limit near c, so nothing with mass reaches c.
- It is tested every day: cosmic-ray muons reach the ground, and atomic clocks on planes and satellites show the predicted shifts.

</div>

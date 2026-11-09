---
name: Newton's laws sandbox
num: 1023
shelf: learn
section: school-physics
title: "Newton's laws of motion simulator: push a trolley (F = ma, friction, inertia), action and reaction, momentum and impulse"
summary: "Push a trolley with a force and mass you choose on ice, a smooth floor or carpet and watch a = F/m and friction at work; push two trolleys apart to see equal and opposite forces and momentum conserved; and catch a ball to see why a longer stopping time means a smaller force."
status: live
ads: false
order: 1023
icon: sliders
works: offline
updated: 2026-11-09
related: [equations-of-motion, motion-graphs, collision-calculator]
sources:
  - "Newton's three laws of motion, friction (static up to μs N, kinetic μk N), momentum p = mv and impulse = change in momentum: standard school physics found in any textbook. g = 9.8 m/s² (rounded)."
  - "The time-stepped trolley was checked against the closed-form results v = (F − μmg)t/m and coasting distance v²/2μg; the push-apart and catch results against hand-worked examples. The friction coefficients and ball sizes are made-up, rounded teaching values."
flow:
  - { icon: sliders, label: "Set force" }
  - { icon: pointer, label: "Push" }
  - { icon: chart, label: "a = F/m" }
  - { icon: check, label: "Check" }
---

## What it does

Three small experiments show Newton's laws of motion in action.

**Push a trolley.** Set the push force, the mass of the trolley and its load, and the surface (ice, a smooth floor or carpet). Press **Push for 2 s** (or hold the **Hold to push** button) and watch the trolley speed up. Arrows show your push and the friction; the readouts show the net force, the acceleration a = (F − friction) ÷ m, the velocity, the distance and the momentum. Let go on ice and it keeps going (inertia); on carpet it soon stops. A push that is too small does nothing at all: the forces are balanced.

**Action and reaction.** Two people on trolleys push each other apart. The forces on the two trolleys are always the same size and opposite in direction, yet the lighter trolley moves off faster. Their momenta add up to zero, just as before the push.

**Catch a ball.** Choose the ball's mass and speed and how long you take to stop it. The picture is the force on your hands against time: the shaded area (the impulse) is fixed by the ball's momentum, so a longer time means a lower, gentler force.

It follows the school topics on force: push and pull, friction, balanced and unbalanced forces (Class 8 Science, exploring forces), the three laws of motion, inertia and momentum (Class 9 Science, force and laws of motion), and impulse, conservation of momentum and static and kinetic friction (Class 11 Physics, laws of motion). The motion it makes is described by [[equations-of-motion]] and drawn as graphs in [[motion-graphs]]; for collisions see [[collision-calculator]].

## How to use it

1. Pick a **Level**. Class 8 keeps to pushes, friction and balanced forces. Class 9 adds momentum and the laws by name. Class 11 adds the free-body diagram (weight and normal force), separate static and kinetic friction, and impulse as the area under a force-time graph.
2. Choose an experiment with the buttons under the level.
3. Move the sliders. Every number on the page updates, and the formulas show your own numbers.
4. **Reset** puts the trolleys back at the start.

## Worked example

On the **smooth floor** (made-up values: static μ 0.15, kinetic μ 0.1) a **10 N** push on a **2 kg** trolley beats the 2.94 N that friction can hold, so it moves. While sliding, friction is 0.1 × 2 × 9.8 = 1.96 N, so a = (10 − 1.96) ÷ 2 = **4.02 m/s²**. After 2 s it is moving at **8.04 m/s**. Then only friction acts and it coasts to a stop **41.02 m** from the start.

In Action and reaction, A (50 kg) and B (25 kg) push with **100 N** for 0.5 s. A rolls left at **1 m/s** and B right at **2 m/s**. Momentum: 50 × (−1) + 25 × 2 = **0**.

Catching a **160 g** ball at **25 m/s** in **0.1 s**: change in momentum 4 kg m/s, so the average force is **40 N**. Take 0.4 s instead and it drops to 10 N.

## Tips

- Mass is how hard it is to change an object's motion (its inertia). Weight is the pull of gravity on it, mass × g.
- Action and reaction act on **different** objects, so they never cancel each other.
- Friction at rest is only as big as it needs to be, up to a limit. That is why a small push leaves the trolley still.

## FAQ

**Why does the trolley on ice never stop?** With no friction there is no unbalanced force once you let go, so by the first law it keeps its velocity. Real ice has a little friction, so a real trolley would slow very slowly.

**Why does a heavier trolley need a bigger push to start?** Friction grows with the weight pressing on the floor, and a bigger mass also needs more force for the same acceleration.

**Is anything stored?** No. The questions are made fresh in your browser and nothing is saved or sent.

---
name: Collision calculator
num: 905
shelf: science
section: classical-mechanics
title: "Collision calculator: elastic and inelastic collisions in 1D and 2D, coefficient of restitution, momentum diagram"
summary: "Work out the velocities after two bodies collide, in a line or at a glancing angle, for any coefficient of restitution from perfectly elastic to sticking together. See the momentum and energy before and after, the impulse, a before-and-after momentum diagram, or find e from your own air-track measurements."
status: live
ads: true
order: 5
icon: target
works: offline
updated: 2026-11-09
related: [moment-of-inertia, projectile-drag, two-body-orbit, uncertainty-calculator, video-motion-tracker, relativistic-kinematics, pendulum-analyser]
sources:
  - "Conservation of momentum, Newton's experimental law of restitution and the oblique impact of smooth spheres: standard classical mechanics."
  - "Checked against SymPy solutions of the momentum and restitution equations in 1D, and in 2D with the impulse along the line of centres, plus closed-form special cases (equal masses swapping speeds, 90° separation, perfectly inelastic energy loss)."
  - "The example numbers are made up."
flow:
  - { icon: sliders, label: "Bodies" }
  - { icon: target, label: "Impact" }
  - { icon: calculator, label: "After" }
  - { icon: chart, label: "Momentum" }
---

## What it does

When two bodies collide, their **total momentum** is the same before and after (as long as nothing outside pushes on them during the impact). That alone is not enough to say how they move off; the second piece is the **coefficient of restitution e**, the ratio of the speed at which they separate to the speed at which they approached. With e = 1 the collision is **elastic** and no kinetic energy is lost; with e = 0 it is **perfectly inelastic** and they move off together; real collisions lie in between (a steel ball on steel is close to 1, a clay ball close to 0).

This calculator has three modes:

- **In a line (1D):** two bodies on a track. Gives both final velocities, the momentum and kinetic energy before and after, the energy lost, the impulse, and the centre-of-mass velocity.
- **Glancing (2D):** two smooth spheres meeting at an angle, like pool balls. You give the direction of the **line of centres** at the moment of contact; only the velocity parts along that line change. Tick **They stick together** for a perfectly inelastic 2D impact.
- **Find e from a lab run:** type the speeds you measured before and after on an air track and get e, how well momentum was conserved, and the energy lost.

Each mode draws a **momentum diagram**: the two momentum arrows added tip to tail, before and after. The dashed total arrow is the same in both, which is conservation of momentum made visible.

Measure the speeds before and after from a video with the [[video-motion-tracker]], and for particles near the speed of light switch to the [[relativistic-kinematics|relativistic kinematics calculator]].

## How to use it

1. Choose a mode.
2. Type both **masses** in kg and the **velocities before** in m/s. In 1D, positive is to the right and negative to the left. In 2D give x and y parts.
3. Set **e** (or press **Elastic** or **Stick**). In 2D also give the **line-of-centres angle**, measured from the +x axis, pointing from body 1 to body 2.
4. In the lab mode, type the two measured velocities after the collision instead of e.

## Worked example

In 1D, a made-up 2 kg cart at **3 m/s** catches a 1 kg cart moving the other way at **−1 m/s**, with **e = 0.6**. The page shows **0.867 m/s and 3.27 m/s** after. The momentum is 5 kg·m/s before and after; kinetic energy falls from 9.500 J to 6.087 J, so **3.413 J (35.9 %)** goes into heat, sound and deformation. The impulse on the light cart is 4.267 N·s and the centre of mass moves at 1.67 m/s throughout. Switch to **2D** with body 1 at (3, 1) m/s, body 2 at (−1, 0.5) m/s and the line of centres at 20°: body 1 leaves at **1.07 m/s at 15.4°** and body 2 at **3.52 m/s at 33.3°**, with momentum (5, 2.500) kg·m/s kept. In the lab mode, two 0.5 kg gliders with 0.8 m/s and 0 before and 0.1 and 0.62 m/s after give **e = 0.650**, with momentum down 10 %.

## Tips

- For equal masses, an elastic head-on collision simply **swaps** the velocities; in 2D with one at rest, they leave at **90°** to each other.
- A ball dropped on the floor: the floor is a body of huge mass, so e = rebound speed ÷ impact speed = √(rebound height ÷ drop height).
- In a lab run, a momentum change of more than a few per cent points to friction, a sloping track or timing errors, not to physics breaking.

## FAQ

**Is energy really lost?** It changes form: into heat, sound and permanent deformation. Total energy is conserved; kinetic energy is not, unless e = 1.

**Why is e between 0 and 1?** Above 1 the bodies would gain kinetic energy (only possible with an explosion or a spring that was already loaded); below 0 they would pass through each other.

**Does spin matter?** Here the spheres are smooth, so no friction acts at contact and spin is not changed. Real pool balls have friction and spin, which this model leaves out. It is for study and planning, not a substitute for professional judgement.

---
name: Collision carts
num: 1257
shelf: learn
code: L129
section: school-physics
title: "Collision carts simulator: conservation of momentum, elastic and sticky collisions, recoil of a gun or boat"
summary: "Roll two carts into each other on a track, bouncy or sticky, and watch the momentum bars before and after: the total never changes. See where the kinetic energy goes, then fire a cannon or jump off a boat to see recoil."
status: live
ads: false
order: 1257
icon: sliders
works: offline
updated: 2026-11-09
related: [newtons-laws, collision-calculator, equations-of-motion, energy-track]
sources:
  - "Conservation of linear momentum, the velocities after a head-on collision with coefficient of restitution e, v₁ = (m₁u₁ + m₂u₂ + m₂e(u₂ − u₁)) ÷ (m₁ + m₂) and v₂ = (m₁u₁ + m₂u₂ + m₁e(u₁ − u₂)) ÷ (m₁ + m₂), kinetic energy ½mv² and recoil V = −mv ÷ M: standard school physics found in any textbook."
  - "Checked against an independent implementation (fibub's collision-calculator maths) for random masses, velocities and e, and against hand-worked examples (equal masses swap velocities; 2 kg at 3 m/s sticking to 1 kg gives 2 m/s). Cart and cannon sizes are made-up round values."
flow:
  - { icon: sliders, label: "Set carts" }
  - { icon: pointer, label: "Run" }
  - { icon: chart, label: "Momentum" }
  - { icon: check, label: "Check" }
---

## What it does

Two carts roll along a straight track and crash. Choose their masses and velocities and whether they **bounce** (an elastic collision, like carts with spring buffers) or **stick** (like carts with Velcro). Press **Run** and watch them meet. Arrows show each velocity, and the bars under the track show each cart's momentum before (pale) and after (solid). Whatever you choose, the **Total** bar stays exactly the same: momentum is conserved.

The **Recoil** experiment starts with everything at rest, so the total momentum is zero. Fire a toy cannon, jump off a boat or throw a medicine ball from a skateboard, and the two parts move apart with equal and opposite momentum. The heavier part moves more slowly.

It follows the school topics on momentum: momentum, its conservation and recoil (Class 9 Science, how forces affect motion) and collisions, impulse and the coefficient of restitution (Class 11 Physics, laws of motion and work, energy and power). The forces behind a collision are in [[newtons-laws]]; for glancing collisions and your own air-track data use [[collision-calculator]], and see where the lost kinetic energy fits in [[energy-track]].

## How to use it

1. Pick a **Level**. Class 9 has the bouncy and sticky buttons. Class 11 swaps them for a slider of the coefficient of restitution **e** (1 is elastic, 0 is sticky) and adds the impulse.
2. In **Two carts**, set the mass and velocity of each cart. Positive velocity is to the right; give B a negative velocity to make a head-on crash. If A cannot catch B, the page says they never meet.
3. Press **Run**. **Reset** puts the carts back.
4. In **Recoil**, choose an example and set the two masses and the speed of the thrown part, then press **Fire**.

## Worked example

Two **1 kg** carts, bouncy: A at **2 m/s**, B at rest. After the crash A stops and B moves off at **2 m/s**. Momentum 1 × 2 = **2 kg m/s** before and after; kinetic energy **2 J** before and after.

Make it **sticky**: they move off together at 2 ÷ 2 = **1 m/s**. Momentum is still **2 kg m/s**, but the kinetic energy is now ½ × 2 × 1² = **1 J**: half went into heat, sound and squashing the Velcro.

Recoil: a **5 kg** cannon fires a **0.5 kg** ball at **20 m/s**. The ball's momentum is 10 kg m/s forwards, so the cannon gets 10 kg m/s backwards: V = −0.5 × 20 ÷ 5 = **−2 m/s**.

## Tips

- Momentum has a direction. A cart moving left has negative momentum, so a head-on crash can leave both carts stopped when the momenta cancel.
- Momentum is kept in every collision; kinetic energy is kept only in an elastic one.
- In recoil the kinetic energies are not equal: the light, fast part gets most of the energy.

## FAQ

**Why is momentum always conserved?** During the crash each cart pushes the other with an equal and opposite force for the same time (Newton's third law), so one gains exactly the momentum the other loses.

**Are real collisions perfectly elastic?** Almost never. Steel balls and spring buffers come close; clay and cars that crumple are nearly sticky.

**Is anything stored?** No. The questions are made fresh in your browser and nothing is saved or sent.

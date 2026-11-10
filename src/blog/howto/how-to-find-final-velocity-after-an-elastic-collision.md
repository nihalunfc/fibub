---
title: "How to find final velocity after an elastic collision"
summary: "Use momentum conservation plus kinetic energy conservation (or the two ready-made formulas) to get both velocities after a head-on elastic collision. Worked example and checks."
tools: [collision-calculator, collision-carts, collision-lab]
updated: 2026-11-10
sources:
  - "Conservation of momentum, conservation of kinetic energy in an elastic collision and the one-dimensional elastic collision formulas: standard classical mechanics (Class 11 physics, first-year university mechanics)."
---

For a head-on elastic collision, the velocities afterwards are v₁ = [(m₁ − m₂)u₁ + 2m₂u₂] / (m₁ + m₂) and v₂ = [(m₂ − m₁)u₂ + 2m₁u₁] / (m₁ + m₂). These two formulas come from keeping both momentum and kinetic energy the same. The [[collision-calculator]] works them out for any masses and speeds, and also shows the momentum, the energy and the impulse before and after.

## What you need

- **Both masses**, m₁ and m₂, in kilograms.
- **Both velocities before**, u₁ and u₂, in m/s, **with signs**. Choose one direction as positive (the calculator uses right as +). A body moving left gets a minus sign, and a body at rest has u = 0.
- **Confirmation that the collision is elastic.** That means no kinetic energy turns into heat, sound or dents. Steel ball bearings, billiard balls and gas molecules come close; questions often just say "elastic". If the bodies stick together instead, see the questions at the end.

## Step by step

1. **Open the collision calculator** and keep the mode on **In a line (1D)**.
2. **Type the masses** into Mass 1 and Mass 2, and the starting velocities into Velocity 1 before and Velocity 2 before. Body 1 has to be catching up with body 2 (u₁ bigger than u₂), or they never meet; the page warns you if not.
3. **Press Elastic (1).** This sets the coefficient of restitution e to 1. e compares how fast the bodies separate with how fast they approached, and 1 means no kinetic energy is lost.
4. **Read the result line** for both final velocities. Below it you get the momentum before and after, the kinetic energy before and after, the impulse on body 2 and the velocity of the centre of mass. A diagram adds the momentum arrows tip to tail, before and after.

Behind the scenes there are two facts:

- Momentum: m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂
- Kinetic energy: ½m₁u₁² + ½m₂u₂² = ½m₁v₁² + ½m₂v₂²

Solving those two equations together gives the v₁ and v₂ formulas at the top. A handy shortcut falls out on the way: in an elastic collision the **relative speed is the same before and after**, so u₁ − u₂ = v₂ − v₁. That is a straight-line equation, much easier to use than the squared energy one.

## A worked example

A 0.5 kg ball rolling at 4 m/s hits a 1.5 kg ball that is at rest, head on and elastically. Find both velocities afterwards.

- m₁ = 0.5 kg, u₁ = 4 m/s, m₂ = 1.5 kg, u₂ = 0.
- m₁ + m₂ = 2 kg.
- v₁ = [(0.5 − 1.5) × 4 + 2 × 1.5 × 0] / 2 = (−4 + 0) / 2 = **−2 m/s**
- v₂ = [(1.5 − 0.5) × 0 + 2 × 0.5 × 4] / 2 = (0 + 4) / 2 = **2 m/s**

The light ball bounces back at 2 m/s (the minus sign means it now moves left), and the heavy ball moves off to the right at 2 m/s. Type these numbers in and press Elastic (1). The page gives −2 m/s and 2 m/s, a momentum of 2 kg·m/s before and after, and 4 J of kinetic energy before and after with none lost. It also shows an impulse of 3 N·s on the heavy ball and a centre of mass moving at 1 m/s the whole time.

For comparison, press **Stick (0)** with the same numbers. The balls now move off together at 1 m/s, and the kinetic energy falls from 4 J to 1 J, so 3 J (75 %) is lost. Same momentum, very different outcome. That is why you must know which kind of collision a question means.

To watch the same crash play out, the [[collision-carts]] and [[collision-lab]] pages animate two trolleys on a track with momentum bars.

## Check your answer

- **Momentum.** Before: 0.5 × 4 + 1.5 × 0 = 2 kg·m/s. After: 0.5 × (−2) + 1.5 × 2 = −1 + 3 = 2 kg·m/s. They match.
- **Energy.** Before: ½ × 0.5 × 4² = 4 J. After: ½ × 0.5 × 2² + ½ × 1.5 × 2² = 1 + 3 = 4 J. They match, so it really is elastic.
- **Relative speed.** Approach: 4 − 0 = 4 m/s. Separation: 2 − (−2) = 4 m/s. Equal, as an elastic collision needs.
- **Common sense.** A light body hitting a heavier one at rest should bounce back. If your light ball carries on forwards faster than the heavy one, a sign has gone wrong.

## Questions people ask

**What happens when the masses are equal?** The formulas reduce to v₁ = u₂ and v₂ = u₁: the bodies simply swap velocities. That is why a moving snooker ball stops dead after a full-on hit on a still one.

**What if they stick together?** That is a perfectly inelastic collision, and only momentum is kept: v = (m₁u₁ + m₂u₂) / (m₁ + m₂). Press Stick (0) on the calculator.

**What about collisions at an angle?** Then momentum is kept separately in the x and y directions. Switch the calculator to **Glancing (2D)** and give the line-of-centres angle at impact.

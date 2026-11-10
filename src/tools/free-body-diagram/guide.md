---
name: Free-body diagram builder
num: 1333
shelf: learn
code: L195
section: school-physics
title: "Free-body diagram practice: tick the forces, check them, then solve for acceleration and tension (Atwood machine, lift, pulleys)"
summary: "Pick a set-up (a box pulled along the floor, a block on a slope, scales in a lift, two blocks pushed together, a block on a table pulled over a pulley, or an Atwood machine), tick the forces you think act on each body, check your diagram, then see it drawn to scale and solved for the acceleration, tension and normal force."
status: live
ads: false
order: 1333
icon: pointer
works: offline
updated: 2026-11-09
related: [newtons-laws, friction-ramp, vector-adder, simple-machines]
sources:
  - "Newton's second and third laws applied body by body, with friction up to μN, for standard set-ups: Atwood machine a = (m₂ − m₁)g/(m₁ + m₂), T = 2m₁m₂g/(m₁ + m₂); apparent weight in a lift N = m(g + a). Standard school physics found in any textbook. g = 9.8 m/s² (rounded)."
  - "Checked by adding every body's forces as x-y vectors on 3000 random set-ups (they must equal m a in the direction of motion) and against hand-worked examples."
flow:
  - { icon: sliders, label: "Set-up" }
  - { icon: check, label: "Tick forces" }
  - { icon: pointer, label: "Diagram" }
  - { icon: calculator, label: "Solve" }
---

## What it does

A **free-body diagram** is a sketch of one body on its own with an arrow for every force acting **on** it. It is the first step in almost every mechanics problem, and the step where most marks are lost: a force is forgotten, or something that is not a force gets drawn in.

This page gives you six classic set-ups. For each one you pick a body, tick the forces you think act on it, and press **Check my diagram**. The page tells you what is missing, what does not act in this set-up, and what is not a force at all (a "force of motion", or ma drawn as if it were a force). Then **Show the answer** draws the correct diagram to scale with the size of each force, and the **Solve it** card works out the acceleration, tension, normal force, friction or contact force with Newton's second law, step by step.

The set-ups are: pulling a box along a rough floor with a rope at an angle; a block on a rough slope; a person on bathroom scales in a lift; pushing two blocks along a smooth floor; a block on a rough table tied over a pulley to a hanging block; and an Atwood machine, two blocks hanging over one pulley.

It follows Class 11 Physics, laws of motion (Newton's laws, free-body diagrams, equilibrium of a particle, connected bodies, friction) and the Class 9 Science ideas of balanced and unbalanced forces. For a single block with friction, try [[friction-ramp]]; to add forces at angles, use [[vector-adder]]; and for pushes and momentum on the flat, see [[newtons-laws]].

## How to use it

1. Choose a **set-up** and set its masses, pull, angle, friction or lift acceleration with the sliders.
2. When there are two blocks, choose which **body** you are drawing.
3. Tick the forces on that body. Your arrows appear in the box below as you tick.
4. Press **Check my diagram**. Fix anything missing or extra, or press **Show the answer**.
5. Read **Solve it**: the equation for each body, then the result, and a final check that the forces on the chosen body really add up to m a.

## Worked example

Open the page: a **5 kg** box pulled with **30 N** at **30°** above the floor, μ = 0.2. The forces on the box are its weight (49 N down), the normal force from the floor, the pull, and friction backwards. Four forces; nothing else.

Up and down: N + 30 sin 30° = 49, so **N = 34 N** (less than the weight, because the rope lifts a little). Along the floor: 30 cos 30° = 25.98 N forward, friction μN = 0.2 × 34 = 6.8 N back, so a = (25.98 − 6.8) ÷ 5 = **3.84 m/s²**.

Switch to the **Atwood machine** with 3 kg and 5 kg: a = (5 − 3) × 9.8 ÷ 8 = **2.45 m/s²** and T = 2 × 3 × 5 × 9.8 ÷ 8 = **36.75 N**, between the two weights (29.4 N and 49 N), as it must be.

## Tips

- Only two kinds of force act: gravity (at a distance) and contact forces (from anything touching the body: a surface, a string, your hand).
- The force that one block exerts on another, and the other's push back, are a third-law pair; they act on **different** bodies, so only one of them goes on each diagram.
- ma is not a force. It is what the forces add up to.

## FAQ

**Why do the scales in a lift read more when it speeds up going up?** The floor has to push you up harder than gravity pulls you down to give you an upward acceleration: N = m(g + a). Scales measure that push.

**Why is the tension in an Atwood machine not equal to either weight?** If it equalled the lighter weight, nothing would lift it; if it equalled the heavier, nothing would pull it down. It has to be in between for both to accelerate.

**Is anything stored?** No. Everything is worked out in your browser and nothing is saved or sent.

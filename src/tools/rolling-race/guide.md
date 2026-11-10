---
name: Rolling race
num: 1492
shelf: learn
code: L310
section: school-physics
title: "Rolling race: ring, disc, sphere and block down a ramp"
summary: "Release a ring, a disc, a solid sphere and a sliding block together down a ramp. See why the acceleration is g sinθ ÷ (1 + I/mr²) and who wins."
status: live
ads: false
order: 1492
icon: curve
works: offline
updated: 2026-11-10
related: [spinning-skater, friction-ramp]
sources:
  - "Rolling without slipping on an incline, a = g sinθ ÷ (1 + I/mr²), with I/mr² = 1 for a ring, 1/2 for a disc and 2/5 for a solid sphere: standard Class 11 physics (system of particles and rotational motion). g = 9.8 m/s². The picture is fibub's own teaching model."
flow:
  - { icon: sliders, label: "Set ramp" }
  - { icon: curve, label: "Release" }
  - { icon: check, label: "Check" }
---

## What it does

Four things start together at the top of a ramp: a **ring**, a **disc**, a **solid sphere** that roll without slipping, and a **block** that slides with no friction. They all lose the same height, but only the block puts all that energy into moving down the slope. The rolling ones must also spin, so some energy goes into rotation and they are slower.

The acceleration of a rolling body is **a = g sinθ ÷ (1 + I/mr²)**. The ratio I/mr² is 1 for a ring, ½ for a disc and ⅖ for a sphere, and 0 for the block, so the order is always block, sphere, disc, ring. Mass and size cancel out. To see how a sliding block behaves with friction, try [[friction-ramp]], and for how a spinning body's I affects its spin see [[spinning-skater]].

## How to use it

1. Set the ramp angle and length.
2. Press **Release** and watch the four lanes (seen from above, slowed down).
3. Read the acceleration and time for each racer in the table.

## What each setting does

- **Ramp angle θ**: a steeper ramp gives bigger accelerations for all.
- **Ramp length**: a longer ramp means longer times (t grows as √L) but never changes the order.

## Worked example

Take θ = 30° and a length of 2 m. The block has a = 9.8 × 0.5 = **4.9 m/s²** and takes √(2 × 2 ÷ 4.9) = **0.904 s**. The sphere has a = 4.9 ÷ 1.4 = **3.5 m/s²** and takes **1.07 s**. The disc has a = 4.9 ÷ 1.5 = 3.27 m/s² and takes **1.11 s**. The ring has a = 4.9 ÷ 2 = 2.45 m/s² and takes **1.28 s**.

## FAQs

**Does a heavier ring beat a lighter one?** No. The mass cancels, so the same shape always takes the same time.

**Why does the ring lose?** Its mass is all at the rim, so for a given speed it needs the most energy to spin.

**Why must friction be there for rolling?** Static friction makes the body turn. It does no work when there is no slipping, so energy is conserved.

**Is anything stored?** No. Everything is worked out in your browser.

---
name: Spring energy
num: 1490
shelf: learn
code: L321
section: school-physics
title: "Spring energy: launch a block with a compressed spring"
summary: "Compress a spring, release a block and see the stored energy ½kx² turn into motion. Find the launch speed, and how far the block slides when the floor has friction."
status: live
ads: false
order: 1490
icon: sliders
works: offline
updated: 2026-11-10
related: [spring-mass, variable-force-work]
sources:
  - "Elastic potential energy ½kx², the work-energy theorem and kinetic friction μmg: standard Class 11 physics (work, energy and power). g = 9.8 m/s². The picture is fibub's own teaching model."
flow:
  - { icon: sliders, label: "Compress" }
  - { icon: curve, label: "Release" }
  - { icon: check, label: "Check" }
---

## What it does

A spring squeezed by a distance x stores energy **½ k x²**, where k is its stiffness in newtons per metre. When you let go, that energy pushes a block, and by the time the block leaves the spring it has kinetic energy ½ m v². With no friction the two are equal, so the launch speed is **v = x √(k/m)**.

On a rough floor some of the energy is used up as heat. The spring must first beat friction, then it loses **μ m g x** while pushing, and after the block leaves it slides until friction stops it. This is a teaching model: the block is only pushed, not fixed to the spring. To see how a spring force varies, try [[spring-mass]], and for the idea of work done by a changing force see [[variable-force-work]].

## How to use it

1. Set the stiffness **k**, the compression **x** and the block's mass **m**.
2. Leave **friction μ** at 0 for a smooth floor, or raise it.
3. Press **Release** and watch the block; **Reset** puts it back.
4. Read the stored energy, the launch speed and the sliding distance under the picture.

## What each setting does

- **Stiffness k**: a stiffer spring stores more energy for the same squeeze.
- **Compression x**: the energy grows with x squared.
- **Mass m**: a heavier block ends up slower for the same energy.
- **Friction μ**: how rough the floor is. Zero means smooth.

## Worked example

Take k = 100 N/m, x = 10 cm and m = 0.5 kg on a smooth floor. The stored energy is ½ × 100 × 0.1² = **0.5 J**, and v = 0.1 × √(100 ÷ 0.5) = **1.41 m/s**.

Now add friction μ = 0.2. Then v² = (100 × 0.01 − 2 × 0.2 × 0.5 × 9.8 × 0.1) ÷ 0.5 = 1.61, so v = **1.27 m/s**, and the block slides 1.61 ÷ (2 × 0.2 × 9.8) = **0.41 m** before it stops.

## FAQs

**Why does doubling x quadruple the energy?** Because the force grows with x and the distance also grows with x, so the work (area under the force graph) grows with x².

**Does the block stay joined to the spring?** Not in this model. It leaves where the spring reaches its natural length.


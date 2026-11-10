---
name: Centre of mass
num: 1336
shelf: learn
section: school-physics
title: "Centre of mass"
summary: "Slide children along a seesaw and see the clockwise and anticlockwise moments, whether it tips and where it would balance; drag point masses around a grid and watch their centre of mass move; or build a flat shape from squares and find the point you could balance it on."
status: live
ads: false
order: 1336
icon: target
works: offline
updated: 2026-11-09
related: [simple-machines, moment-of-inertia, free-body-diagram, collision-lab]
sources:
  - "Moment of a force (force × perpendicular distance), the principle of moments, and the centre of mass x = Σmx / Σm for point masses and for a uniform lamina: standard school physics found in any textbook. g = 9.8 m/s² (rounded)."
  - "Checked against hand-worked seesaws and rods, the rule that moments about the centre of mass always cancel (500 random cases), and the shape centres against a fine-grid area integral."
flow:
  - { icon: pointer, label: "Place mass" }
  - { icon: compass, label: "Moments" }
  - { icon: target, label: "CM" }
  - { icon: check, label: "Balance" }
---

## What it does

Every body has a point where its whole weight seems to act: the **centre of mass** (for a body in ordinary gravity, the same as the centre of gravity). Support a body exactly there and it balances; support it anywhere else and its weight has a **moment** (a turning effect) about the support, so it tips.

This page has three ways in:

- **Seesaw.** Put up to three children (or boxes) on a plank and move the pivot. The page works out the anticlockwise moment from the left, the clockwise moment from the right, tilts the plank if they do not match, marks the balance point, and says where the second mass would have to sit to balance. You can also give the plank its own mass.
- **Point masses.** Drag three balls of any mass around a grid in metres and watch the centre of mass, marked with a red cross, move towards the heaviest.
- **Flat shape.** Tap squares to build a shape (or start from an L, a frame or a T). The page marks its centre of mass and tells you when it lies outside the shape itself, as it does for a frame.

It follows Class 11 Physics, systems of particles and rotational motion (centre of mass, moment of a force, the principle of moments, centre of gravity, equilibrium of a rigid body), and the Class 9 and 10 ideas of levers and balancing. The lever in [[simple-machines]] uses the same principle of moments; the centre of mass is the point that moves steadily in a [[collision-lab]] crash; and [[moment-of-inertia]] builds on it for spinning bodies.

## How to use it

1. Pick **Seesaw**, **Point masses** or **Flat shape**.
2. Seesaw: drag the coloured blocks along the plank or drag the pivot; set the masses and the plank's own mass with the sliders. Press **Move the pivot to the balance point** to make it balance.
3. Point masses: drag the balls; set each mass with its slider (a mass of 0 leaves that ball out).
4. Flat shape: tap squares on and off, or pick a ready-made shape.
5. Read the working: the moments, Σmx ÷ Σm, and what it means.

## Worked example

Open the page: a **30 kg** child sits **1 m** left of the pivot and a **20 kg** child **1.5 m** to the right. The anticlockwise moment is 30 × 9.8 × 1 = **294 N m**, the clockwise moment 20 × 9.8 × 1.5 = **294 N m**. They are equal, so the seesaw **balances**, and the centre of mass, (30 × (−1) + 20 × 1.5) ÷ 50 = **0 m**, is right over the pivot.

Switch to **Point masses**: 30 kg at (2, 2) and 20 kg at (8, 3). The centre of mass is at x = (30 × 2 + 20 × 8) ÷ 50 = **4.4 m**, y = (30 × 2 + 20 × 3) ÷ 50 = **2.4 m**, closer to the heavier ball.

## Tips

- In the principle of moments g cancels, so you can compare mass × distance on each side.
- The centre of mass of a symmetric body lies on its line of symmetry.
- A ring, a frame or a boomerang has its centre of mass in empty space.

## FAQ

**Is the centre of mass the same as the centre of gravity?** Near the Earth's surface, where g is the same everywhere across the body, yes.

**How do I find the centre of mass of a real flat object?** Hang it from one point with a plumb line and draw the vertical line, then hang it from another point. The lines cross at the centre of mass.

**Is anything stored?** No. Everything is worked out in your browser and nothing is saved or sent.

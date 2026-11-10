---
name: Friction ramp
num: 1024
shelf: learn
section: school-physics
title: "Friction ramp"
summary: "Tilt a ramp, pick the surfaces, set the mass and push, and see at once whether the block stays, slides down or moves up, with the gravity, support, friction and push arrows drawn on it and the numbers worked out."
status: live
ads: false
order: 1024
icon: mountain
works: offline
updated: 2026-11-09
related: [newtons-laws, equations-of-motion]
sources:
  - "Forces on an inclined plane (mg sin θ along, mg cos θ across), static friction up to μs N and kinetic friction μk N, and the angle of repose tan θ = μs: standard school physics found in any textbook. g = 9.8 m/s² (rounded)."
  - "Checked against an independent x-y vector sum of the forces on 500 random cases and against hand-worked examples. The friction coefficients for the surfaces are made-up, rounded teaching values."
flow:
  - { icon: mountain, label: "Tilt ramp" }
  - { icon: sliders, label: "Push" }
  - { icon: pointer, label: "Arrows" }
  - { icon: check, label: "Slides?" }
---

## What it does

A block sits on a ramp. Drag the ramp to tilt it, choose the surfaces, set the block's mass and give it a push up or down the slope. The page tells you straight away whether the block **stays still**, **slides down** or **moves up**, and draws the forces on it as arrows: **gravity** straight down, the **support** (normal force) at right angles to the ramp, **friction** along the ramp, and your **push**. Press **Let go** to watch it slide, and the page says how long it took to reach the end.

It also works out the angle at which the block starts to slide on its own, the push that just holds it, and the push needed to start it moving up the slope.

It follows the school topics on friction and force: friction and its effects, rough and smooth surfaces, balanced and unbalanced forces (Class 8 Science, exploring forces), and static and kinetic friction, the angle of repose and free-body diagrams (Class 11 Physics, laws of motion). For forces on the flat, with pushes and momentum, see [[newtons-laws]]; for what happens once it slides with steady acceleration, see [[equations-of-motion]].

## How to use it

1. Choose a **Level**. Class 8 names the forces in words and explains in plain sentences why the block moves or not. Class 11 puts the numbers on the arrows, adds the dashed mg sin θ component, the normal force, the net force and the acceleration, and lets you set your own μs and μk.
2. Tilt the ramp with the **angle** slider, or drag up and down on the picture.
3. Pick the **surfaces**. Each has a static value μs (how strongly it grips at rest) and a kinetic value μk (the drag while sliding). They are made-up round numbers to show the idea.
4. Set the **push** along the slope: positive pushes up the slope, negative pushes down.
5. Press **Let go**. If friction holds it, nothing happens; otherwise it slides to the end of the 4 m ramp.

## Worked example

Open the page: a **10 kg** block of wood on a wooden ramp (μs 0.5, μk 0.3) at **20°**. Gravity pulls it down the slope with 10 × 9.8 × sin 20° = **33.5 N**; friction can hold up to 0.5 × 92.1 = **46 N**, so it **stays still**, held by 33.5 N of friction. It would slide on its own above **26.6°** (tan θ = 0.5).

Tilt it to **30°**. Now the pull is 49 N but friction can only hold 42.4 N, so it **slides down**. At Class 11 the page shows a = (−49 + 25.46) ÷ 10 = **−2.35 m/s²** (2.35 m/s² down the slope). Pushing up the slope with **10 N** is enough to hold it, and a push of more than **91.4 N** starts it moving up.

## Tips

- The angle at which a block starts to slide does not depend on its mass: both the pull down the slope and the friction grow with the weight.
- Friction at rest is only as big as it needs to be. It can point up or down the slope, whichever way stops the block moving.
- Sliding friction is usually smaller than the grip at rest, which is why something that just starts to slide speeds up.

## FAQ

**Why does a steeper slope have less friction?** The block presses less hard on a steeper ramp (the normal force is mg cos θ, which shrinks as θ grows), and friction is proportional to how hard the surfaces press together.

**Are the μ values real?** They are rounded teaching numbers chosen to behave like the named surfaces. Real values depend on how clean, dry and smooth the surfaces are; measure your own with a tilting board.

**Is anything stored?** No. The questions are made in your browser and nothing is saved or sent.

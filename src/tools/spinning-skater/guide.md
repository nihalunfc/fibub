---
name: Spinning skater
num: 1491
shelf: learn
code: L322
section: school-physics
title: "Spinning skater: angular momentum and pulling arms in"
summary: "Pull a skater's arms in and watch the spin speed up while the angular momentum L = Iω stays the same and the kinetic energy rises."
status: live
ads: false
order: 1491
icon: orbit
works: offline
updated: 2026-11-10
related: [centre-of-mass, rolling-race]
sources:
  - "Conservation of angular momentum, I = ΣmR² and rotational kinetic energy ½Iω²: standard Class 11 physics (system of particles and rotational motion). The skater is fibub's own teaching model: a body of I = 1 kg m² holding two weights."
flow:
  - { icon: sliders, label: "Set" }
  - { icon: orbit, label: "Pull in" }
  - { icon: check, label: "Check" }
---

## What it does

A spinning body keeps its **angular momentum L = I ω** as long as nothing twists it from outside. The moment of inertia I depends on where the mass is: the further from the axis, the bigger I. So when a skater pulls her arms in, I falls, and ω must rise to keep L the same.

The kinetic energy is ½ I ω², which equals L² ÷ 2I. With L fixed and I smaller, the energy goes up. It comes from the work her muscles do pulling the arms inwards against the "pull outwards" you feel when spinning. This is a teaching model, not a real skater. To find where the mass is balanced first, see [[centre-of-mass]], and for rotation with moving along a surface see [[rolling-race]].

## How to use it

1. Set the weight in each hand and the starting spin.
2. Press **Pull arms in** (or move the **r** slider yourself) and watch ω, I, L and the kinetic energy.
3. **Arms out** takes them back; **Pause** freezes the picture.

## What each setting does

- **Hands from the axis r**: how far the weights are from the middle.
- **Spin with arms out ω₀**: the speed when r = 1 m.
- **Weight in each hand**: more weight means arms matter more.

## Worked example

Leave the starting spin at 2 rad/s and the weights at 2 kg. With arms out, I = 1 + 2 × 2 × 1² = **5 kg m²**, so L = 5 × 2 = **10 kg m²/s** and the kinetic energy is ½ × 5 × 2² = **10 J**.

Pull the hands in to r = 0.5 m. Now I = 1 + 2 × 2 × 0.5² = **2 kg m²**. L is still 10, so ω = 10 ÷ 2 = **5 rad/s**, and the kinetic energy is ½ × 2 × 5² = **25 J**.

## FAQs

**Where does the extra energy come from?** From the skater: her muscles do work moving the weights inwards.

**Is the angular momentum really constant?** Yes, in this model there is no friction or outside twist, so L cannot change.

**What if the weights are zero?** Then the arms hardly matter in the model, so I stays 1 kg m² and nothing changes.

**Is anything stored?** No. Everything is worked out in your browser.

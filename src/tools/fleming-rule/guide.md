---
name: Fleming's left-hand rule and DC motor
num: 1044
shelf: learn
section: school-physics
title: "Fleming's left-hand rule: force on a current-carrying wire in a magnetic field, and how a DC motor turns"
summary: "Turn a 3D picture of a wire between magnet poles and see the field, current and force arrows of Fleming's left-hand rule. Change the field, current, length and angle and watch F = BIL sin θ. Then watch a DC motor coil turn, with and without its split-ring commutator."
status: live
ads: false
order: 1044
icon: target
works: offline
updated: 2026-11-09
related: [magnetic-field-mapper, ohms-law-lab, coil-field-designer, magnetic-circuit]
sources:
  - "Force on a current-carrying conductor F = I L × B (size B I L sin θ), Fleming's left-hand rule, and the torque on a coil τ = N B I A sin φ with a split-ring commutator: standard school physics results."
  - "Checked against numpy.cross for the force vector at several angles, a hand calculation of the coil's largest torque, and the textbook direction case (field to the right, current into the page, force downwards)."
flow:
  - { icon: sliders, label: "Set B, I" }
  - { icon: pointer, label: "Turn view" }
  - { icon: target, label: "See force" }
  - { icon: orbit, label: "Motor" }
---

## What it does

A wire carrying a current in a magnetic field feels a push. Which way? Hold your **left hand** with the first finger, the second finger and the thumb all at right angles: the **F**irst finger points along the **F**ield, the se**C**ond finger along the **C**urrent, and the thu**M**b gives the **M**otion (the force). This page shows that as three arrows on a wire between two magnet poles, in a 3D picture you can drag round to look at from any side.

Below it, a **DC motor** turns: a coil sits between the poles, the forces on its two sides push one up and one down, and a **split-ring commutator** swaps the current every half turn so the coil keeps turning the same way. A graph shows the turning effect as the coil goes round.

It follows the Class 10 Science topics on the magnetic effects of electric current (force on a current-carrying conductor, Fleming's left-hand rule, the electric motor) and the Class 12 Physics topics on moving charges and magnetism (F = I L × B, torque on a current loop). Before this, see the field itself in the [[magnetic-field-mapper]]; to design real coils, try the [[coil-field-designer]].

## How to use it

1. Pick a **level**. Class 12 adds the vector form of the force and the torque formula with your numbers.
2. Slide the **field strength** B (tesla), the **current** I (amperes), the **length** of wire in the field and the **angle** θ between the wire and the field.
3. Tap **Swap the poles** or **Reverse the current** and watch the force arrow flip.
4. **Drag** the 3D picture to turn it. Hold up your own left hand and match it to the arrows.
5. In the motor, tap **Pause** or **Play**, slide the **coil angle** by hand, and untick **Split-ring commutator** to see why a motor needs one.

## Worked example

The page starts with B = 0.50 T, I = 3.0 A, L = 10 cm and θ = 90°, with the field from left to right and the current going into the screen at the start view. The force is F = B I L sin θ = 0.50 × 3.0 × 0.10 × sin 90° = 0.15 N, downwards. Slide θ to 30°: sin 30° = 0.5, so F = 0.075 N. At 0° the wire lies along the field and F = 0 N.

For the motor coil (50 turns, 5 cm by 5 cm, so A = 0.0025 m²) the biggest turning effect is N B I A = 50 × 0.50 × 3.0 × 0.0025 = 0.1875 N m, when the coil lies flat along the field. When the coil stands upright (90°) the forces pull straight outwards and the turning effect is zero; that is where the split ring swaps the current.

## Tips

- Reversing the current or swapping the poles reverses the force. Doing both leaves it as it was.
- The force is always at right angles to both the wire and the field.
- A real motor uses many turns, a stronger magnet and a soft iron core to make the turning effect bigger.

## FAQ

**Why the left hand?** The left-hand rule is for motors (force from current). For generators (current from motion) Fleming's right-hand rule is used instead.

**What does the split ring do?** It reverses the current in the coil every half turn, just as the coil passes upright, so the forces always turn it the same way.

**Is anything saved?** No. Everything is worked out on this page and nothing leaves your device.

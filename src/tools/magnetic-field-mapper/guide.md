---
name: Magnetic field mapper
num: 1043
shelf: learn
code: L18
section: school-physics
title: "Magnetic field lines of a bar magnet, a wire, a loop and a solenoid, with a compass you can drag"
summary: "See the magnetic field lines of a bar magnet, a straight current-carrying wire, a circular loop and a solenoid. Drag a compass around to see which way its needle points and how strong the field is there, and learn the right-hand thumb rule. Class 12 level adds B = μ₀I/2πr, μ₀NI/2a and μ₀nI with your numbers."
status: live
ads: false
order: 1043
icon: compass
works: offline
updated: 2026-11-16
related: [ohms-law-lab, coil-field-designer, field-line-plotter, magnetic-circuit]
sources:
  - "Field of a long straight wire B = μ₀I/(2πr), of a circular loop from the Biot-Savart law (exact form with complete elliptic integrals, as in standard electromagnetism texts), of a solenoid as a stack of loops, and a bar magnet modelled as a short solenoid (same field outside): standard physics results."
  - "μ₀ = 1.25663706127 × 10⁻⁶ N/A² (CODATA 2022 recommended value)."
  - "Checked against an independent NumPy script that adds up the Biot-Savart field of 200,000 short pieces of the loop, the textbook loop-centre value μ₀NI/2a, and the published values K(0.5) = 1.85407 and E(0.5) = 1.35064."
  - "Solve my numbers uses μ₀ = 4π × 10⁻⁷ T m/A, the usual school value (it agrees with the CODATA value above to about 9 figures), with the standard formulas for a long wire, the centre of a circular coil B = μ₀NI/2R, a long solenoid B = μ₀NI/L, the force F = BIL sin θ and the force between two parallel wires F/L = μ₀I₁I₂/2πd."
flow:
  - { icon: compass, label: "Pick source" }
  - { icon: curve, label: "Field lines" }
  - { icon: pointer, label: "Drag compass" }
  - { icon: check, label: "Check" }
---

## What it does

A magnetic field cannot be seen, but a compass needle shows which way it points and iron filings show its pattern. This page draws the **field lines** for four sources and gives you a compass to drag around:

- a **bar magnet**, with lines leaving the north pole and curving round to the south pole;
- a long **straight wire** carrying a current, with circles round it;
- a single circular **loop** (or a flat coil of several turns), seen edge-on;
- a **solenoid**, a long coil whose field inside is strong and almost uniform, and whose field outside looks like a bar magnet's.

Arrows on the lines show the direction of the field. The compass needle (north end in red) lines up with the field wherever you put it, and the page tells you which way it points and how strong the field is there. A short panel explains the **right-hand thumb rule** for the setup on screen.

It follows the Class 10 Science topics on the magnetic effects of electric current (field lines, the field round a wire, a loop and a solenoid, the right-hand thumb rule) and the Class 12 Physics topics on moving charges and magnetism and on magnetism and matter (Biot-Savart and Ampère's laws, the current loop as a magnetic dipole, Gauss's law for magnetism). Before this, see how current flows with the [[ohms-law-lab]]; for real coil design, the [[coil-field-designer]] takes it further, and the [[field-line-plotter]] does the same job for electric charges.

## How to use it

1. Pick a **level**. Class 12 adds the formula with your numbers and a line of deeper explanation.
2. Pick the **source**: bar magnet, straight wire, loop or solenoid.
3. For the wire, loop and solenoid, slide the **current** (0.5 to 10 A) and, for the loop and solenoid, pick the number of **turns**.
4. Tap **Reverse the current** (or **Flip the magnet**): every arrow and the compass swing round.
5. **Drag the compass**, or tap anywhere on the picture to move it there. On a keyboard, focus the picture and use the arrow keys.

The picture is 20 cm across with the source in the middle. The loop has a radius of 4 cm, the solenoid is 12 cm long and 5 cm across, and the magnet is 8 cm long. The Earth's own field is left out so you only see the field of the source.

## Worked example

Pick the straight wire with 5 A flowing out of the screen. The compass starts 6 cm to the right and 4.5 cm up, which is 7.5 cm from the wire. At Class 12 level the page shows B = μ₀I/(2πr) = 4π × 10⁻⁷ × 5 / (2π × 0.075) = 13.3 µT, and the needle points up and to the left (127°), at right angles to the line from the wire, going anticlockwise as the right-hand thumb rule says.

Now pick the loop with 10 turns and 5 A. The field at the centre is μ₀NI/(2a) = 4π × 10⁻⁷ × 10 × 5 / 0.08 = 785 µT. For the 200-turn solenoid with 5 A, the long-solenoid formula μ₀nI gives 10.5 mT; because this solenoid is short and fat, the exact value in its middle is a little lower, 9.67 mT.

## Tips

- Field lines never cross: at any point the field has only one direction.
- Where the lines crowd together the field is strong; where they spread out it is weak.
- A solenoid with a current is an electromagnet: its right-hand end is north when the current goes anticlockwise as you look at that end.

## Solve my numbers

The first card is for your own problem. Choose what you want: the field of a long straight wire, at the centre of a circular coil, inside a solenoid, the force on a wire in a field, or the force between two parallel wires. Type the current, distance, turns or length, change the unit if it is in cm, mm or mA, and the answer appears at the top in tesla, mT or µT with the working under it: formula, numbers with units, result. A **common mistake** line follows each problem, for example using centimetres without converting, or using the diameter where the radius is wanted. Five worked-example buttons fill in typical numbers. Zero or negative lengths and currents give a plain message, not a wrong number.

## FAQ

**How do I find the magnetic field near a wire?** Use B = μ₀ I / (2π r): a 10 A wire gives 40 µT at 5 cm. The Solve my numbers card does it with your numbers and shows the working.

**Why does the bar magnet look like a solenoid?** The page treats the magnet as a short, fat solenoid. Outside, that gives the same field as a magnet; inside, it shows the lines running from S back to N, so every line is a closed loop.

**How strong is the bar magnet?** It is a made-up teaching magnet, so its field values are only a guide.

**Is anything saved?** No. Everything is worked out on this page and nothing leaves your device.

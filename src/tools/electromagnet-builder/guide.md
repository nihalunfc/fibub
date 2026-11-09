---
name: Electromagnet builder
num: 1049
shelf: learn
section: school-physics
title: "Electromagnet builder: wind a coil on a nail, add cells, and see how many paper clips it picks up"
summary: "Make an electromagnet from a coil of wire, some cells and an iron nail. Change the number of turns and cells, take the nail out, switch it off or turn the cells round, and watch three compasses swing and paper clips get picked up or dropped."
status: live
ads: false
order: 1049
icon: link
works: offline
updated: 2026-11-09
related: [magnetic-field-mapper, ohms-law-lab, coil-field-designer]
sources:
  - "Field of a coil from the Biot-Savart law (a stack of circular loops), and the long-coil result B = μ₀ n I: standard physics results. μ₀ = 1.25663706127 × 10⁻⁶ N/A² (CODATA 2022)."
  - "Teaching models, not measurements: the iron nail multiplies the field by 100, one paper clip is held for every 8 mT at the end, the cells are 1.5 V with 0.5 Ω each, the wire is 0.02 Ω a turn, and the Earth's horizontal field is taken as 40 µT."
  - "The field at the end of the coil was checked against the finite-coil formula B = μ₀ n I L / (2 √(L² + a²)) computed independently in NumPy."
flow:
  - { icon: sliders, label: "Turns, cells" }
  - { icon: link, label: "Iron core" }
  - { icon: compass, label: "Compasses" }
  - { icon: check, label: "Check" }
---

## What it does

Wrap insulated wire round an iron nail, join the ends to a cell, and the nail becomes a magnet that can pick up paper clips. Switch off and the clips drop. That is an **electromagnet**, and this page lets you build one without a single burnt finger.

You choose the number of **turns** of wire (10 to 100) and the number of **cells** (1 to 4), and you can take the **iron nail** out to see what the coil does on its own. The picture shows the coil, the cells and the switch, the paper clips hanging from the end of the nail, and three **compasses** around it. North is up the screen; the north end of each needle is red. When the current flows, the needles swing towards or away from the ends of the electromagnet, more strongly the closer they are.

It follows the Class 8 Science chapter on electricity and its magnetic and heating effects (the magnetic effect of a current, making an electromagnet, what makes it stronger) and, with the Level switch on Class 10, the Class 10 topics on the field of a solenoid and how a soft iron core turns it into an electromagnet. To see the field lines themselves, open the [[magnetic-field-mapper]]; for how current depends on voltage and resistance, the [[ohms-law-lab]].

## How to use it

1. Pick the number of **cells** and slide the number of **turns**.
2. Tick or untick **Iron nail inside the coil**.
3. Tap **Switch off** and **Switch on**, and **Turn the cells round** to reverse the current.
4. Read how many clips it picks up, the current, the field at the end of the nail and which end is the north pole.
5. At Class 10 level, read the line with B = μ₀ n I worked out for your coil.

## Worked example

The page starts with 2 cells and 50 turns on an iron nail. The current is 3 V ÷ (1 Ω in the cells + 1 Ω of wire + 0.5 Ω of leads) = 1.2 A. The field at the end of the nail comes out at 47 mT, enough for 5 paper clips in this model. Take the nail out and the field drops to 470 µT: no clips at all, and the compasses barely move. Put the nail back, use 4 cells and 100 turns: the current is 1.33 A, the field 104 mT, and it holds 13 clips.

Notice that adding turns also adds wire, which adds resistance, so 100 turns on 2 cells gives less current (0.857 A) than 50 turns, but the electromagnet still gets stronger (8 clips).

## Tips

- An electromagnet's strength grows with the current and with the number of turns, and an iron core makes a huge difference.
- Soft iron is used because it loses its magnetism when the current stops. A steel core would stay magnetised.
- Reversing the current swaps the north and south poles; paper clips are attracted either way.

## FAQ

**Are the numbers real?** The coil's field is worked out properly, but the iron's effect, the paper-clip count and the cells are simple teaching models, so treat the numbers as a guide to what gets bigger or smaller.

**Why do the compasses not point straight at the magnet?** Each needle follows the Earth's field and the electromagnet's field added together, so a weak field only turns it a little.

**Is anything saved?** No. Everything is worked out on this page and nothing leaves your device.

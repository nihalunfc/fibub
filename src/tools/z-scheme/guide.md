---
name: Z-scheme stepper
num: 1393
shelf: learn
code: L235
section: school-biology
title: "Z-scheme of photosynthesis: electron flow through photosystem II and I, step by step"
summary: "Follow one electron from water through photosystem II, plastoquinone, cytochrome b6f, plastocyanin and photosystem I to NADPH on the Z-shaped energy diagram. Compare cyclic and non-cyclic flow and count the photons, O₂, NADPH, H⁺ and ATP for any number of electrons."
status: live
ads: false
order: 1393
icon: orbit
works: offline
updated: 2026-11-09
related: [pigment-spectra, photosynthesis-lab, galvanic-cell]
sources:
  - "The order of carriers in the light reactions (P680, pheophytin, plastoquinone, cytochrome b6f, plastocyanin, P700, ferredoxin, NADP⁺ reductase), the 2 H₂O → 4 H⁺ + O₂ + 4 e⁻ and NADP⁺ + 2 e⁻ + H⁺ → NADPH equations, and the cyclic path: general plant biology. Redox potentials are rounded textbook values, drawn only to show the shape of the Z."
  - "H⁺ counts (1 per electron from water, 2 per electron through cytochrome b6f) and about 14 H⁺ per 3 ATP are rounded, commonly used figures; real values vary and are still studied."
  - "Checked in the tests against hand counts: 12 electrons give 24 photons, 6 H₂O, 3 O₂, 6 NADPH, 36 H⁺ and 36 × 3/14 = 7.71 ATP. Teaching model only. Nothing you enter is stored or sent anywhere."
flow:
  - { icon: target, label: "Light" }
  - { icon: orbit, label: "Electron" }
  - { icon: calculator, label: "Tally" }
  - { icon: check, label: "Check" }
---

## What it does

In the light reactions of photosynthesis, light energy is turned into two useful molecules: **ATP** and **NADPH**. It happens through a chain of electron carriers in the thylakoid membrane of the chloroplast. Drawn by energy, the chain looks like a sideways letter Z, so it is called the **Z-scheme**.

This page draws the Z and moves one electron along it, one step at a time, with a short explanation of what happens at each carrier: where light lifts the electron, where water is split and oxygen is released, where H⁺ is pumped into the thylakoid lumen, and where NADP⁺ is turned into NADPH. Switch to the **cyclic** path to see how photosystem I alone can make extra ATP. Below, a tally counts the photons, water, oxygen, NADPH, H⁺ and ATP for any number of electrons.

It fits Class 11 Biology (photosynthesis in higher plants: the light reaction, the electron transport chain, splitting of water, cyclic and non-cyclic photophosphorylation and chemiosmosis). First see which colours of light the pigments catch in [[pigment-spectra]]; see what limits the overall rate in [[photosynthesis-lab]].

## How to use it

1. Leave **Non-cyclic** chosen and press **Next step**. The red dot is the electron; the big line names the carrier it is on and the text explains the step. **Back** goes one step back; **Play** steps by itself.
2. Look at the dashed orange lines marked **light**: the two places where a photon lifts the electron (at P680 in photosystem II and at P700 in photosystem I).
3. Switch to **Cyclic** and step through again. The electron leaves P700, reaches ferredoxin, then goes back to plastoquinone and cytochrome b6f and returns to P700.
4. In the tally, slide **Electrons sent through** and read what is made.

## Worked example

Send **12 electrons** through the non-cyclic chain. Each electron is lifted twice, so 24 photons are absorbed (12 at each photosystem). Water gives 4 electrons for every 2 molecules split, so 6 H₂O are split and 3 O₂ given off. Each NADPH takes 2 electrons, so 6 NADPH are made. The lumen gains 12 H⁺ from water and 24 from cytochrome b6f, 36 in all, and with about 14 H⁺ per 3 ATP that makes 36 × 3 / 14 ≈ **7.71 ATP**.

Switch to **Cyclic** with the same 12 electrons: 12 photons, no water split, no O₂, no NADPH, 24 H⁺ and about 5.14 ATP.

## Tips

- The electron only gains energy at the two photosystems. Everywhere else it goes downhill, and some of that energy is used to pump H⁺.
- ATP is not made by the electrons directly. They build up H⁺ in the lumen, and H⁺ flowing back through ATP synthase makes ATP (**chemiosmosis**).
- The Calvin cycle needs 3 ATP for every 2 NADPH. Non-cyclic flow alone gives a little less ATP than that, which is one reason plants also run cyclic flow.

## FAQ

**Why is it called P680 and P700?** They are special pairs of chlorophyll a molecules that absorb best at about 680 nm and 700 nm.

**Why does the diagram go "up" for negative potentials?** A more negative redox potential means the electron is held less tightly and has more energy to give. Putting those at the top makes the energy picture easy to read.

**Is 14 H⁺ per 3 ATP exact?** No. It is a rounded figure often used for the chloroplast ATP synthase; textbooks also use simpler numbers. The idea that matters is that more H⁺ means more ATP.

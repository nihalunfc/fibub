---
name: Electron configuration filler
num: 1082
shelf: learn
section: school-chemistry
title: "Electron configuration with orbital boxes: Aufbau, Pauli, Hund, quantum numbers and the Cr and Cu exceptions"
summary: "Watch electrons fill orbital boxes from 1s to 4p one at a time, or fill them yourself and see which rule (Aufbau, Pauli or Hund) a wrong tap breaks. Tap any arrow for its four quantum numbers. Chromium and copper explained. Ends with fresh practice questions."
status: live
ads: false
order: 1082
icon: sliders
works: offline
updated: 2026-11-09
related: [build-an-atom, periodic-table, hydrogen-orbitals]
sources:
  - "Ground-state configurations from fibub's periodic table code: the Aufbau (Madelung, n + l) order with the measured exceptions (chromium 3d⁵ 4s¹, copper 3d¹⁰ 4s¹) from the NIST Atomic Spectra Database, checked there against the mendeleev and pymatgen Python packages."
  - "Aufbau principle, Pauli exclusion principle, Hund's rule and quantum numbers: general chemistry facts, written fresh for fibub."
flow:
  - { icon: pointer, label: "Pick" }
  - { icon: sliders, label: "Fill boxes" }
  - { icon: target, label: "Quantum no." }
  - { icon: check, label: "Practise" }
---

## What it does

An electron configuration says which orbitals an atom's electrons sit in. This page draws every orbital from 1s to 4p as a box on an energy ladder and fills them with arrows, one electron at a time. It covers hydrogen to krypton (1 to 36 electrons).

- **Watch it fill.** Pick an element, or tap + and − (or drag the slider), and watch where each new electron goes. The page writes the configuration in filling order and in n, l order, gives the short form with a noble-gas core (such as [Ne] 3s¹), counts the unpaired electrons and names the outer shell.
- **Fill it yourself.** Pick an element and tap the boxes to place its electrons. A tap that breaks a rule is refused and the page says which rule and why: the Aufbau principle (fill lower energy first), Pauli's exclusion principle (at most two electrons per box, with opposite spins) or Hund's rule (one in each box of a subshell before any pair up).
- **Quantum numbers.** Tap any arrow to see its four quantum numbers: n (shell), l (subshell: 0 for s, 1 for p, 2 for d), mₗ (which box) and mₛ (spin, +½ or −½).
- **Chromium and copper.** For these two the page shows the real configuration and explains why it differs from the simple rule.

It follows Class 11 Chemistry (structure of the atom: quantum numbers, shapes of orbitals, filling of orbitals, the Aufbau principle, Pauli exclusion principle, Hund's rule of maximum multiplicity, the electronic configuration of atoms and the stability of half-filled and completely filled orbitals). Start with [[build-an-atom]] for the simple shell picture, then see the whole table in the [[periodic-table]] or the orbital shapes in [[hydrogen-orbitals]].

## How to use it

1. Choose an element, or use + and − to step through the electrons. The newest electron is described under the boxes.
2. Tap an arrow to read its quantum numbers. Tap the same box again to switch between its two electrons.
3. Switch to **Fill it yourself** to place the electrons by hand. **Undo** takes back the last one; **Start again** empties the boxes.
4. Try the **Check yourself** questions. You can type configurations as 1s2 2s2 2p6 or with a noble-gas core, such as [Ar] 4s1.

## Worked example: nitrogen

Nitrogen has 7 electrons. Two go into 1s and two into 2s. The next three go into 2p, and by Hund's rule each takes its own box with the same spin, so the page shows three single up-arrows in 2p. The configuration is 1s² 2s² 2p³, the short form is [He] 2s² 2p³, and there are 3 unpaired electrons.

The last electron is in 2p, in the right-hand box, spin up: n = 2, l = 1, mₗ = +1, mₛ = +½.

In Fill it yourself, if you try to put the fifth electron into 2p before 2s is full, the page answers "Aufbau principle: fill 2s first". If you try to pair two electrons in one 2p box while another 2p box is empty, it answers with Hund's rule.

## Chromium and copper

The Aufbau order predicts [Ar] 3d⁴ 4s² for chromium and [Ar] 3d⁹ 4s² for copper. Real atoms are [Ar] 3d⁵ 4s¹ and [Ar] 3d¹⁰ 4s¹. Moving one electron from 4s into 3d makes the 3d set exactly half full (chromium) or completely full (copper). Such arrangements are extra stable: the electrons are spread evenly and more of them can exchange places with others of the same spin (exchange energy). The page shows both the prediction and the real atom.

## Tips

- The n + l rule: lower n + l fills first; when two subshells have the same n + l, the one with lower n fills first. That is why 4s (4 + 0 = 4) comes before 3d (3 + 2 = 5).
- When an atom of a transition metal forms a positive ion, it loses its 4s electrons before 3d ones.
- The way the boxes are numbered (mₗ from −l on the left) and the first spin being "up" are conventions. Other books may draw them the other way round; the physics is the same.

## FAQ

**Why stop at krypton?** That covers the elements most school questions use. For heavier atoms and ions, use the periodic table tool.

**Is anything saved?** No. Everything runs in your browser and nothing is stored or sent.

**Is this an official textbook tool?** No. It is an independent practice page that follows the same school topics.

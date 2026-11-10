---
name: Asexual reproduction explorer
num: 1267
shelf: learn
code: L135
section: school-biology
title: "Asexual reproduction explorer: fission, budding, fragmentation, regeneration and spores"
summary: "Step through binary and multiple fission, budding, fragmentation, regeneration and spore formation as simple moving drawings, then see how fast one cell becomes millions when it keeps splitting in two."
status: live
ads: false
order: 1267
icon: eye
works: offline
updated: 2026-11-09
related: [cell-division, flower-pollination, population-growth-models, growth-curve-od600]
sources:
  - "Modes of asexual reproduction and the examples (Amoeba, Plasmodium, Hydra, yeast, Spirogyra, Planaria, Rhizopus) are standard school biology. Drawings and text are fibub's own; a teaching model, not to scale."
  - "Growth by doubling N = N₀·2^(t/T) checked by hand and in tests/sci-tools/reproduction-modes.mjs (20-minute doubling: 512 cells after 3 hours; a million after about 399 minutes)."
flow:
  - { icon: eye, label: "Pick a way" }
  - { icon: sliders, label: "Stages" }
  - { icon: chart, label: "Doubling" }
  - { icon: check, label: "Practise" }
---

## What it does

In **asexual reproduction** a single parent makes offspring without any partner, and the offspring are copies of the parent. This page shows six ways it happens, each as a short moving drawing you can step through:

- **Binary fission** (Amoeba, bacteria): the nucleus divides, then the cell pinches into two.
- **Multiple fission** (Plasmodium): inside a protective cyst the nucleus divides many times, then many small cells are released at once.
- **Budding** (Hydra, yeast): a bump grows on the side, becomes a small copy and breaks off.
- **Fragmentation** (Spirogyra): a filament breaks into pieces and each grows into a new filament.
- **Regeneration** (Planaria): each cut piece grows back the parts it is missing.
- **Spore formation** (Rhizopus, bread mould): a spore case bursts and light spores drift away to grow somewhere damp.

A second panel shows why fission is so powerful: one cell becomes 2, 4, 8, 16 ... With a doubling time of 20 minutes, a single bacterium could pass a million in under seven hours, if food and space lasted.

It follows the Class 9 science chapter *Reproduction: How Life Continues* and the Class 10 chapter on how organisms reproduce. How the nucleus copies itself is in [[cell-division]], and sexual reproduction in flowers is in [[flower-pollination]].

## How to use it

1. Pick a way of reproducing.
2. Move the **Stage** slider, or press **Play**. The caption says what is happening.
3. In **Population from fission**, set the starting cells N₀, the doubling time T and the time t. Tick **Log scale** to see big numbers clearly.

## A worked example

Start with N₀ = 1, T = 20 min, t = 180 min. That is 180 ÷ 20 = 9 doublings, so N = 1 × 2⁹ = 512 cells. Reaching a million needs log₂(1 000 000) ≈ 19.9 doublings, about 399 minutes.

## Tips

- Binary fission gives 2 cells; multiple fission gives many at once.
- On a log scale, steady doubling is a straight line.
- Real populations slow down when food or space runs out.

## FAQ

**Why do living things also reproduce sexually?** Mixing two parents' genes makes varied offspring, which helps a species survive when conditions change.

**Is this the NCERT book?** No. It covers the same topic with fibub's own drawings. fibub is not part of NCERT.

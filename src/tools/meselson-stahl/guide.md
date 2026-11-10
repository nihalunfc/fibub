---
name: Meselson-Stahl experiment
num: 1446
shelf: learn
section: school-biology
title: "Meselson-Stahl experiment: semi-conservative DNA replication with ¹⁵N and ¹⁴N bands"
summary: "Grow heavy ¹⁵N DNA in light ¹⁴N for up to four generations and see the bands each model of copying predicts in a density gradient: semi-conservative, conservative or dispersive. Compare with the real result, separate the strands with heat, and see every DNA molecule's old and new strands."
status: live
ads: false
order: 1446
icon: eye
works: offline
updated: 2026-11-09
related: [central-dogma, cell-division, mendel-peas, centrifuge-calculator]
sources:
  - "The 1958 Meselson-Stahl experiment and the three models of DNA replication are standard biology; the band fractions follow from counting strands and were checked in the tests against the textbook fractions for every model and generation."
  - "Band positions are drawn schematically (light above, hybrid in the middle, heavy below), not to the measured densities. Drawings are fibub's own. Nothing you enter is stored or sent anywhere."
flow:
  - { icon: flask, label: "¹⁵N to ¹⁴N" }
  - { icon: sliders, label: "Generations" }
  - { icon: eye, label: "Bands" }
  - { icon: check, label: "Compare" }
---

## What it does

When a cell divides it must copy its DNA. In the 1950s there were three ideas about how the two strands of the double helix are copied:

- **Semi-conservative:** the strands separate and each one is a template for a new partner, so each new molecule has one old strand and one new strand.
- **Conservative:** the old molecule stays whole and a completely new molecule is built beside it.
- **Dispersive:** old and new pieces are mixed along every strand.

Matthew Meselson and Franklin Stahl tested them with nitrogen. They grew bacteria for many generations in heavy nitrogen (¹⁵N), so all their DNA was heavy, then moved them to normal light nitrogen (¹⁴N). DNA samples spun in a caesium chloride solution settle at their own density: heavy DNA lower down, light DNA higher, hybrid DNA in between.

- **Models and generations.** Pick a model and move the generation slider. The tube shows the bands the model predicts, with thicker, darker bands for larger shares. The text gives each band's share.
- **The real result.** Tick the box to put the observed tube beside the prediction (it is the semi-conservative one). The page tells you whether the model survives.
- **Heat.** Heating separates the two strands. Tick it to see single-strand bands.
- **Every molecule.** Below the tubes, each DNA molecule is drawn as two strands, dark for ¹⁵N and pale for ¹⁴N, so you can see where the old strands went.

This fits **Class 12 Biology: molecular basis of inheritance** (DNA replication, the experimental proof of semi-conservative replication). See where replication fits between DNA, RNA and protein in the [[central-dogma]] tool, and how copied chromosomes are shared out in [[cell-division]]; the spinning itself is a centrifuge, which the [[centrifuge-calculator]] describes.

## How to use it

1. Choose **Semi-conservative**, **Conservative** or **Dispersive**.
2. Move **Gen.** from the start (all ¹⁵N) to 4 generations in ¹⁴N.
3. Tick **Show what Meselson and Stahl saw** to compare.
4. Tick **Heat to separate the strands** for single strands.
5. Try the **Check yourself** questions.

## Worked example

Generation 1: semi-conservative copying gives 100 % hybrid DNA, one band in the middle. Conservative copying would give two bands, 50 % heavy and 50 % light. The real tube had one hybrid band, so conservative copying was ruled out.

Generation 2: semi-conservative gives 50 % hybrid and 50 % light. Dispersive copying gives one band of DNA that is 25 % ¹⁵N, between hybrid and light. The real tube had two bands, so dispersive copying was ruled out too. After 3 generations semi-conservative gives 25 % hybrid and 75 % light: the 2 original strands are still there, in 2 of the 8 molecules.

## Tips

- The hybrid band never disappears: the two original heavy strands are passed on forever, just diluted.
- The share of hybrid DNA after g generations is 2/2^g; the rest is light.
- Heated to single strands, semi-conservative and conservative look alike, which is why the experiment used double-stranded DNA.

## FAQ

**Why nitrogen?** Every base in DNA contains nitrogen, and ¹⁵N makes the molecule measurably denser without changing how it works.

**Is anything saved?** No. Everything runs in your browser and nothing is stored or sent.

**Is this an official textbook tool?** No. It is an independent practice page that follows the same school topics.

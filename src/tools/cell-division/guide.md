---
name: Cell division
num: 1132
shelf: learn
section: school-biology
title: "Cell division: mitosis and meiosis stage by stage, chromosome numbers and the onion root tip"
summary: "Step through mitosis and meiosis with a few coloured chromosomes, see the chromosome number and DNA amount at every stage, shuffle the meiosis line-up, and count dividing cells in a virtual onion root tip to find the mitotic index."
status: live
ads: false
order: 1132
icon: eye
works: offline
updated: 2026-11-09
related: [cell-explorer, mendel-peas, central-dogma]
sources:
  - "Stages of mitosis and meiosis, chromosome numbers (2n and n), DNA amounts (C values) and 2^n gamete types from independent assortment: standard textbook ideas, written by fibub."
  - "The onion root tip stage shares (90 % interphase, 5 % prophase, 2 % metaphase, 1 % anaphase, 2 % telophase, 24 hour cycle) are made-up round values for teaching."
  - "The chromosome and DNA tables were checked in the tests against a separate step-by-step simulation of chromosomes being copied and shared out."
  - "Drawings are fibub's own simple shapes. Nothing you enter is stored or sent anywhere."
flow:
  - { icon: pointer, label: "Pick" }
  - { icon: eye, label: "Step" }
  - { icon: table, label: "Count" }
  - { icon: check, label: "Check" }
---

## What it does

Cells make more cells by dividing. **Mitosis** makes two cells that are exact copies of the parent, for growth and repair. **Meiosis** makes four cells with half the number of chromosomes, which become gametes (sperm, eggs, pollen). This page draws a small cell with two or three pairs of chromosomes and lets you step through each stage, with the chromosome number, the number of cells and (at Class 11 level) the amount of DNA at every step. A second part is a virtual onion root tip: you look at fields of cells, count the stages, and work out the mitotic index and how long each stage lasts. To see where the chromosomes sit inside the cell, open the [[cell-explorer]]; to follow the genes they carry into the next generation, grow plants in [[mendel-peas]]; and to see how DNA is read, try the [[central-dogma]].

## Using it

1. Pick a **Level**. Class 10 shows chromosome numbers and cells. Class 11 adds the DNA amount (C values) and the number of different gametes.
2. Pick **Mitosis** or **Meiosis**, and a body cell with **2n = 4** or **2n = 6** chromosomes.
3. Step with **Next** and **Back**, tap a stage name, or press **Play**. Filled shapes came from the mother and outlined shapes from the father; each bar is one chromatid.
4. In meiosis, leave **Crossing over** ticked to see pieces swapped between partner chromosomes, and press **Shuffle line-up** in metaphase I to see independent assortment.
5. In the **onion root tip** part, press **Look at a new field** a few times. The table keeps a running count and estimates each stage's length. Download the counts as a CSV file.

## What the numbers mean

- **2n and n:** a body cell has two sets of chromosomes (2n; 46 in humans). A gamete has one set (n; 23 in humans).
- **Chromatids:** after DNA is copied in S phase, each chromosome is two identical sister chromatids joined at the centromere. The chromosome number does not change, but the DNA doubles.
- **DNA amount (C):** a gamete has 1C. A body cell has 2C in G1 and 4C after S phase. Mitosis takes it back to 2C; meiosis to 2C after the first division and 1C after the second.
- **Anaphase:** when the chromatids of each chromosome separate, each one counts as a chromosome, so for a moment the cell holds 4n (mitosis) or 2n (anaphase II).
- **Mitotic index:** dividing cells ÷ all cells counted. The share of cells in a stage, times the cycle length, estimates how long that stage lasts.

## Worked example

Take a cell with 2n = 4 through meiosis. After interphase it still has 4 chromosomes but 4C of DNA. In prophase I the two pairs line up side by side and swap pieces. At the end of meiosis I there are 2 cells, each with 2 chromosomes (n) and 2C. In meiosis II the chromatids separate, giving 4 cells, each with 2 chromosomes and 1C. With 2 pairs there are 2² = 4 kinds of gamete from the line-up alone; with 23 pairs, as in humans, 2²³ = 8,388,608.

In the root tip, if 20 of 200 cells are dividing, the mitotic index is 10 %. If 10 of the 200 are in prophase and the cycle takes 24 hours, prophase lasts about 10 ÷ 200 × 24 = 1.2 hours.

## Where this fits in school

Class 10 science (how organisms reproduce) explains why gametes need half the chromosome number. Class 11 biology (cell cycle and cell division) covers interphase, the stages of mitosis and meiosis, crossing over and the significance of each division, and the root tip practical. This page is an independent learning aid. It is not made by or connected with NCERT, and it does not copy any textbook.

## Questions

**Why are only four or six chromosomes drawn?** So you can follow each one. The rules are the same for 46.

**Why does the chromosome number double in anaphase?** It is a counting rule: a chromosome is counted by its centromeres. Once the chromatids separate, each has its own centromere.

**Is anything saved?** No. The counts stay on this page until you leave it.

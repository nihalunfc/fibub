---
name: Field trial designer
num: 385
shelf: science
code: T273
section: agronomy-and-soil-science
title: "Field trial designer: randomised complete block, Latin square and completely randomised layouts with a plot map"
summary: "Lay out a field or glasshouse trial as a randomised complete block, Latin square or completely randomised design. Random but repeatable from a seed, checked, drawn as a plot map, and saved as a CSV field book. Nothing is uploaded."
status: live
ads: false
order: 385
icon: table
works: offline
updated: 2026-11-09
related: [sample-size, plate-layout, field-sampling-planner, seeding-rate-calculator, fertiliser-blend-calculator]
sources:
  - "Design rules (each treatment once per block; once per row and column in a Latin square) and the analysis of variance degrees of freedom are standard experimental design, as in Cochran and Cox, Experimental Designs, and Gomez and Gomez, Statistical Procedures for Agricultural Research."
  - "Randomisation: Fisher-Yates shuffle with the mulberry32 seeded generator. Checked against an independent Python version of the same generator and shuffle (five layouts, cell for cell), and for fairness with chi-square tests over thousands of seeds."
  - "The example treatments are made up."
flow:
  - { icon: pencil, label: "Treatments" }
  - { icon: sliders, label: "Design" }
  - { icon: table, label: "Plot map" }
  - { icon: download, label: "CSV" }
---

## What it does

A fair field trial needs two things: replication (each treatment on several plots) and randomisation (chance, not you, decides which plot gets which treatment). This tool does the randomising for three classic designs and shows the result as a plot map you can take to the field.

- **Randomised complete block design (RCBD)**: the field is split into blocks, and each block holds every treatment once, in its own random order. Blocks soak up differences in the field (a slope, a wet corner, a shade line), so the comparison between treatments is cleaner. This is the most used design in agronomy.
- **Latin square**: as many rows and columns as treatments, with each treatment exactly once in every row and every column. It removes two gradients at once, for example slope along the rows and an irrigation line along the columns. It suits 4 to 8 treatments.
- **Completely randomised design (CRD)**: every plot gets a treatment at random, with no blocking. Use it only where conditions are even, such as pots on a glasshouse bench or a growth room.

Each layout is checked after it is made: the page shows a green **Checked** label once it has confirmed that every treatment is in every block once (RCBD), in every row and column once (Latin square), or has the right number of plots (CRD).

Decide how many replicates you need with the [[sample-size|sample size calculator]], and analyse the harvest with the [[yield-trial-anova|yield trial ANOVA]].

## How to use it

1. Type your treatments, one per line. Names can be varieties, fertiliser rates, sowing dates or spray programmes.
2. Pick the design and the number of blocks or replicates. For a CRD you can also set how many plots fit in one row of the map.
3. Pick how plots are numbered: 1, 2, 3 in field order, or 101, 102 for block 1 and 201, 202 for block 2. **Serpentine numbering** runs every second row right to left, which is how a planter or harvester usually moves up and down a field.
4. Read the plot map and the field book, then download the plot list as a CSV for your notebook, tablet or labels. The Image, PDF and Word buttons save the map, the analysis outline and the field book as a report.

**The random seed** is the number that starts the random generator. The same treatments, design, number of blocks and seed always give exactly the same layout, so write the seed in your trial notes and anyone can make the layout again. **New random layout** picks a fresh seed.

## Worked example

Press **Use the example**: five made-up varieties (A to E), randomised complete block design, 4 blocks, seed 2026. The page shows "20 plots: 5 treatments × 4 blocks" and the Checked label. Block 1 (plots 1 to 5) reads Variety A, E, D, B, C; block 2 (plots 6 to 10) reads D, B, C, E, A. Every variety is in every block once.

The analysis of variance outline shows the degrees of freedom you will have: blocks 3, treatments 4, error 12, total 19. Twelve error degrees of freedom is a fair minimum; with fewer, the trial will struggle to show real differences.

Switch the design to **Latin square** and the same five varieties make a 5 × 5 square of 25 plots with 12 error degrees of freedom (rows 4, columns 4, treatments 4).

## Tips

- Lay blocks so the conditions **within** a block are as even as possible; the blocks themselves may differ.
- Keep the plot list with the seed. If plot labels are lost, the seed rebuilds the layout.
- Once the trial is harvested, analyse the yields with the [yield trial ANOVA and LSD](/science/yield-trial-anova/) tool.

## FAQ

**Is this random enough?** Yes for laying out trials: every order of treatments within a block is equally likely, and the tool's tests check this. It is not meant for anything secret, such as passwords.

**How is the Latin square randomised?** A standard square is made, then its rows, its columns and the treatment names are each shuffled at random, the usual method in design textbooks.

**Can I have unequal replication?** Not in this tool: equal replication keeps the analysis simple and fair.

**Is my data uploaded?** No. Everything runs in your browser and works offline.

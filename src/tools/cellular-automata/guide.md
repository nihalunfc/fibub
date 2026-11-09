---
name: Cellular automata explorer
num: 589
shelf: science
section: complex-systems-and-network-science
title: "Cellular automata explorer: elementary rules 0 to 255, Conway's Game of Life and Life-like rules, with RLE import and export"
summary: "Explore Wolfram's 256 elementary cellular automata as space-time pictures, and run Conway's Game of Life or any Life-like B/S rule on a grid you can draw on, with famous patterns, step and run, wrap or dead edges, cycle detection and RLE import and export."
status: live
ads: true
order: 589
icon: table
works: offline
updated: 2026-11-09
related: [agent-based-models, chaos-explorer, network-metrics, plot-maker]
sources:
  - "Rules: Wolfram's numbering of elementary cellular automata (1983) and the B/S notation for Life-like rules; the patterns (glider, spaceship, blinker, pulsar, R-pentomino, acorn, Gosper glider gun) are well-known Game of Life objects, typed in by fibub."
  - "Checked against an independent Python implementation (NumPy for the elementary rules, SciPy's convolve2d for Life-like rules) on 40 random elementary runs and 30 random Life-like runs with both kinds of edge, identical cell for cell; the RLE reader against a separate Python decoder."
flow:
  - { icon: sliders, label: "Rule" }
  - { icon: pencil, label: "Start" }
  - { icon: eye, label: "Run" }
  - { icon: download, label: "Export" }
---

## What it does

A cellular automaton is a row or grid of cells, each alive or dead, that all update together by one simple rule based on their neighbours. Tiny rules can make order, chaos, and even working computers. This explorer has two kinds:

- **Elementary (one-dimensional)**: a row of cells where each new cell depends on itself and its two neighbours. There are 2⁸ = 256 such rules, numbered 0 to 255 in **Wolfram's numbering**: write the rule number in binary and read off the new cell for each of the eight neighbourhoods, from 111 down to 000. Each generation is drawn under the last, making a space-time picture.
- **Life-like (two-dimensional)**: a grid where each cell counts its eight neighbours. In **B/S notation**, B lists the counts that bring a dead cell to life and S the counts that keep a live cell alive. **Conway's Game of Life** is B3/S23; HighLife, Seeds, Day & Night, Maze and others are in the list, or type any rule.

## How to use it

**Elementary**: type a rule number, the width and the number of generations. Start from one live cell, a random row (with a seed, so it can be repeated) or your own row of 1s and 0s. The rule table shows each neighbourhood and the cell it makes.

**Life-like**: choose a rule and a starting pattern, or a random grid. Press **Step** or **Run**, and tap the grid to draw or erase cells. **Edges** either wrap round (the grid is a torus) or are dead beyond the border. The page notices when the grid repeats and tells you whether it became a still life, an oscillator with a given period, or died out. The population is charted over the generations.

**RLE**: Run Length Encoded patterns are the usual way Life patterns are shared, such as `bo$2bo$3o!` for a glider. Paste one or open an .rle file to load it; if it names a rule, the rule is set too. Export writes the current grid as RLE.

## Worked examples

**Rule 30** from a single cell, 201 cells wide for 100 generations, makes the famous chaotic triangle: 103 cells are alive in the last row and 26.1 % of the whole picture is alive. Rule 30 is binary 00011110, so for example 100 becomes 1 and 111 becomes 0. **Rule 90** draws a Sierpiński triangle, and **rule 110** is known to be able to compute anything.

**Gosper glider gun** (the default 2D pattern, 80 × 60 cells, dead edges): it starts with 36 live cells and fires a glider every 30 generations, so the population is 41 at generation 30, 46 at 60 and 51 at 90. Gliders that reach the dead edge break up into debris, and from generation 87 the whole grid repeats every 60 generations. With wrapping edges the gliders come round and wreck the gun; the grid ends in a period-2 pattern of 88 cells.

## Things to know

- Grids are finite (up to 400 × 400). A pattern that grows for ever on an infinite plane will meet the edges here.
- Repeats are found by comparing whole-grid states, for the first 5,000 generations.
- Elementary runs go up to 1,000 cells and 1,000 generations.

## Frequently asked questions

**Why is the rule number backwards from the picture?** The rightmost binary digit is the new cell for neighbourhood 000, the leftmost for 111. The rule table on the page shows them from 111 to 000, matching the binary number read left to right.

**Is anything uploaded?** No. Everything runs in your browser, and opened pattern files never leave your device.

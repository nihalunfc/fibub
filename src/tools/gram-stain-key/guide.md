---
name: Gram stain and biochemical test key
num: 197
shelf: science
section: microbiology
title: "Gram stain and biochemical test identification key: step by step, ranked results and a printed key"
summary: "A teaching identification key for common bacteria groups: answer one test at a time (Gram stain, shape, catalase, oxidase, coagulase, lactose, motility and more) and watch the candidates narrow, tick the results you have and see the groups ranked by fit, or print a numbered dichotomous key. Load your own key as CSV or JSON. For teaching, not clinical identification."
status: live
ads: false
order: 4
icon: flask
works: offline
updated: 2026-11-09
related: [hemocytometer, media-recipe-scaler, cell-doubling-time, plate-layout, cfu-counter, growth-curve-od600, dichotomous-key-builder, f0-calculator]
sources:
  - "The example key (19 groups, 15 tests) is written by fibub from general textbook microbiology and simplified for teaching; it is not copied from any published table, and real strains vary. Edit it or load your own."
  - "The key builder, candidates and ranking are written by fibub and checked in the tests against an independent Python version on the example and 60 random keys."
  - "A key file you open is read on the page only. It is never uploaded or stored."
flow:
  - { icon: table, label: "Key table" }
  - { icon: flask, label: "Do a test" }
  - { icon: search, label: "Candidates" }
  - { icon: check, label: "Best fit" }
---

## What it does

Microbiology classes identify bacteria with a chain of quick tests: the Gram stain, the shape under the microscope, then catalase, oxidase, coagulase, lactose on MacConkey agar, motility and so on. This page turns a table of groups and their expected results into three ways of working:

- **Step by step.** The page asks one test at a time. Answer positive, negative, or *Not done, skip*, and it shows your path, how many groups are left after each answer, and which groups were ruled out by which test. You can also answer a different test from the list.
- **Results** (a results table). Set the results you already have and every group is ranked: fewest conflicting results first, then by fit, which is (agree + half of variable) divided by the results compared. A test that is not used for a group (blank in the table) is left out of that group's fit.
- **Printed key.** The whole table written out as a numbered dichotomous key (1a, 1b, go to 2 ...), ready to print or hand out.

**Choose tests** sets the order: *In the table's order* asks the first test, left to right, that still separates the groups, which follows the usual lab order (Gram stain first). *Fewest steps* asks the test that leaves the fewest groups on average.

A group with a **variable** result (strains differ) or a blank result stays on both sides of that test, so it is never ruled out by it.

**This page is for teaching only.** It is not a clinical or diagnostic identification. Real identification needs pure cultures, controls, validated kits or methods and a trained laboratory. The example table is simplified and written by fibub; real strains vary.

Count colonies before you pick one with the [[cfu-counter|CFU counter]], and build your own identification key with the [[dichotomous-key-builder]].

## How to use it

1. **Key table.** The example loads by itself. Edit it in the box, or open your own CSV, TSV or JSON key.
2. **Do a test.** In *Step by step*, press the result you see for the test shown.
3. **Candidates.** Watch the list of groups still possible shrink. Use *Back one step* if you made a mistake.
4. **Best fit.** Press *Rank in the results table* to see every group ranked against your answers, and download the ranking (CSV), the printed key (text) or a report as an image, PDF or Word file.

### Your own key

One row per group and one column per test. Use **+**, **-**, **v** (variable) or leave the cell blank (not used). Words such as *pos*, *negative* or *n/a* also work. Two optional rows, starting **+ means** and **- means**, name the two outcomes of each test (for shape, *Cocci* and *Rods*). A column called **Note** adds a short note. *Download key (CSV)* or *(JSON)* gives you a file to start from.

## Worked example

With the example key, answer *Gram-negative (pink)*: 9 groups are left. Then *Rods* leaves 8 (Neisseria is out), *Oxidase: no colour* leaves 6, *Lactose: pink colonies* leaves 3 (E. coli, Klebsiella and Enterobacter), *Motile* leaves 2, and *Indole: red ring* leaves 1: the page shows **Matches: Escherichia coli**.

In the results table, *Use example results* sets seven results (Gram-negative rod, oxidase negative, lactose negative, motile, urease negative, H2S positive). The page shows **Best fit: Salmonella (7 of 7 results agree)**. Proteus comes second at 85.7 %, because it agrees on six but conflicts on urease.

The printed key has 20 couplets in table order and 19 with *Fewest steps*.

## Tips

- Always confirm with more tests than the key needs. One wrong Gram stain sends you down the wrong half of any key.
- Add the tests your class uses, and mark results that differ between strains as **v** rather than guessing.

## FAQ

**Why does a group appear twice in the printed key?** It has a variable or blank result for a test in its path, so it goes down both branches.

**Is anything sent anywhere?** No. Everything runs in your browser and nothing is stored.

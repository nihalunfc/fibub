---
name: Pedigree drawing tool
num: 205
shelf: science
section: genetics
title: "Pedigree chart maker: draw a family tree with standard genetic symbols (free)"
summary: "Type or paste a family table, or add relatives with buttons, and get a pedigree drawn with the standard NSGC symbols: affected, carrier, deceased, proband, twins, adoption and consanguinity, with generation numbers. Checks for loops, missing parents and sex conflicts. Download SVG or PNG. Nothing leaves your device."
status: live
ads: false
order: 4
icon: table
works: offline
updated: 2026-11-09
related: [tree-viewer, sequence-tools, primer-checker, plot-maker, punnett-square, crossing-plan, hardy-weinberg-tester]
sources:
  - "Symbols and layout conventions: Bennett, R. L. et al. (2008), Standardized human pedigree nomenclature: update and assessment of the recommendations of the National Society of Genetic Counselors, Journal of Genetic Counseling 17: 424–433."
  - "Family structure checks (loops, generations, common ancestors) compared with an independent Python check using networkx 3.7 on the example family and on deliberately broken tables."
  - "The example family is made up."
flow:
  - { icon: table, label: "Family table" }
  - { icon: check, label: "Check" }
  - { icon: pencil, label: "Draw" }
  - { icon: download, label: "SVG / PNG" }
---

## What it does

A pedigree is a family tree drawn with a small set of standard symbols, used in genetics teaching, genetic counselling and breeding to show how a trait runs through a family. This tool draws one for you from a simple table. It places everyone in generations automatically, numbers the generations with Roman numerals and the people in each generation from left to right, and uses the symbols recommended by the National Society of Genetic Counselors (Bennett et al. 2008). It also checks the table for mistakes that would make the pedigree impossible. Everything is done in your browser: family details never leave your device. It is for study and teaching, not for clinical use.

## How to use it

1. Type or paste a table with one person per row: **id, father, mother, sex, affected, carrier, deceased, proband, twin, adopted, note**. A header row lets the columns come in any order. Leave father and mother blank for people whose parents are not drawn, such as someone who married into the family. You can also open a CSV or Excel file.
2. Or build the family with the buttons: pick a person (from the list, or by tapping their symbol) and press **Add parents**, **Add son**, **Add daughter**, **Add brother** or **Add sister**. New people get names like Son1, which you can change in the table. **Remove** works for people with no children in the pedigree.
3. Tick **Affected**, **Carrier**, **Deceased** or **Proband** and set the **sex** for the chosen person without typing.
4. Download the drawing as **SVG** (sharp at any size, editable in vector programs) or **PNG**, the table as CSV, or a report as an image, PDF or Word file.

## The symbols

- **Square** male, **circle** female, **diamond** sex unknown.
- **Filled** symbol: affected. **Dot** in the middle: carrier.
- **Slash** through the symbol: deceased.
- **Arrow with P**: the proband, the person through whom the family came to attention.
- **Horizontal line** between partners, with a vertical line down to their children's line. A **double line** marks partners who are blood relatives; the tool finds this itself from shared ancestors in the table.
- **Twins** hang from one point on the children's line. Give both the same label in the twin column: starting with **MZ** draws the bar for identical twins, starting with **?** marks unknown zygosity, anything else is non-identical.
- **Brackets** around a symbol: adopted. "Adopted in" draws a dashed line to the adoptive parents; "adopted out" a solid line to the birth parents.

## What the check looks for

Missing parents (a parent named who has no row), people with only one parent given, ids used twice, someone listed as their own parent or ancestor (a loop), sex conflicts (a father marked female, a mother marked male, or one person as both), twins with different parents and identical twins of different sex. Structural errors stop the drawing until they are fixed; the rest are listed and drawn.

## Worked example

The page opens with a made-up family of 15 people in four generations, with a trait that follows an X-linked recessive pattern. Arthur (I-1, deceased) and Beatrice (I-2, carrier) have an affected son Colin (II-1), a carrier daughter Diana (II-4) and a daughter Edith. Diana's twin sons Jack and Kevin (III-4 and III-3) are non-identical; Jack is affected. Lena (III-5) was adopted in. Colin's daughter Iris (III-2), an obligate carrier, has children with her first cousin Kevin, so their partner line is double. Their son Max (IV-1) is affected and is the proband.

## Frequently asked questions

**Can it draw very large families?** Up to 500 people. Large pedigrees scroll sideways; the SVG keeps every detail.

**Can I draw several partners for one person?** Yes: each pair with children gets its own partner line.

**Is anything stored?** Only if you tick "Remember this table on this device", and then only in this browser. Clear removes it. Nothing is ever uploaded.

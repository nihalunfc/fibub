---
name: Log scale calculator
num: 335
shelf: science
code: T250
section: forestry
title: "Log scale calculator: board feet by Doyle, International 1/4-inch and Scribner rules, and cubic volume by Smalian, Huber and Newton"
summary: "Scale a list of logs in board feet by the Doyle rule, the International 1/4-inch rule and the Scribner formula rule, side by side, and in cubic feet or cubic metres by Smalian's, Huber's and Newton's formulas. Every rule is worked out from its formula, with no volume tables."
status: live
ads: true
order: 335
icon: ruler
works: offline
updated: 2026-11-09
related: [tree-carbon, field-sampling-planner, calibration-curve, tree-height-basal-area, forest-inventory-summary, unit-converter]
sources:
  - "Doyle rule (D − 4)²·L/16; Scribner formula rule (0.79D² − 2D − 4)·L/16 (Bruce's formula version, not the Scribner Decimal C table); International 1/8-inch rule 0.22D² − 0.71D per 4-foot section (J. F. Clark, 1906) with ½-inch taper per section and × 0.905 for a ¼-inch kerf; Smalian, Huber and Newton (Riecke) cubic formulas: standard forest mensuration, as in Avery and Burkhart, Forest Measurements. Formulas only; no log rule tables copied."
  - "Checked in the tests against an independent Python calculation, and the International ¼-inch result against L. R. Grosenbaugh's (1952) closed-form fit of that rule (agrees within 0.5 % for 8 to 30 inch logs, 8 to 20 ft long). The example logs are made up."
flow:
  - { icon: ruler, label: "Measure" }
  - { icon: table, label: "Logs" }
  - { icon: calculator, label: "Rules" }
  - { icon: chart, label: "Board feet" }
---

## What it does

A **log rule** estimates how much sawn lumber a log will give, in **board feet** (a board 1 inch thick, 12 inches wide and 1 foot long). Rules differ in how they allow for saw kerf, slabs and taper, so the same log gets different numbers. This tool scales each of your logs by the three rules most used in North America, worked out from their formulas:

- **Doyle**: (D − 4)² × L / 16, with D the small-end diameter inside bark in inches and L the length in feet. Simple, but it gives far too little for small logs.
- **International ¼-inch** (formula version): the log is cut into 4-foot sections, each ½ inch wider than the one before, and each section gives 0.22 d² − 0.71 d board feet for a ⅛-inch saw, × 0.905 for a ¼-inch saw. A piece shorter than 4 feet left over gets its share of the next section. The closest of the three to real mill output.
- **Scribner, formula version**: (0.79 D² − 2D − 4) × L / 16. The official Scribner Decimal C table is a rounded, tabulated version and will not match exactly.

It also gives **cubic volume** from the diameters:

- **Smalian**: length × (area of small end + area of large end) / 2. Needs both ends; tends to overestimate.
- **Huber**: length × area at the middle. Needs the middle diameter.
- **Newton**: length × (small + 4 × middle + large areas) / 6. Needs all three; the most accurate.

Measure the standing trees first with the [[tree-height-basal-area|tree height and basal area calculator]], and total the stand in the [[forest-inventory-summary]].

## How to use it

1. Choose **inches and feet** (cubic feet) or **cm and metres** (cubic metres). In metric the board-foot rules use the diameter and length converted to inches and feet.
2. Paste or open one row per log: an optional name, the small-end diameter, the length, and if you have them the large-end and middle diameters. Diameters are inside the bark.
3. Read the totals, the table for each log, and the chart, which draws the three rules against small-end diameter for any log length you type.

## Worked example (made-up logs)

Six logs from 9 to 24 inches at the small end and 8 to 18 feet long scale to **925 board feet by International ¼-inch, 867 by Scribner and 775 by Doyle**. Doyle falls well below the others for the smaller logs (L1, L2, L4 and L6). The 12-inch, 16-foot log L1 is 97 board feet International, 86 Scribner and only 64 Doyle. In cubic measure the six logs hold 132.5 ft³ by Smalian, 131.3 ft³ by Huber and 131.7 ft³ by Newton.

## Tips

- Printed log rule tables usually round diameters down to the inch, lengths down to the foot, and volumes to the nearest 5 or 10 board feet; this tool does not round, so expect small differences.
- Deduct for defects (rot, sweep, splits) separately; no rule here does that.
- Use the rule your buyer or region uses. Prices are quoted per thousand board feet (MBF) of a named rule.

## FAQs

**Why are the rules so different?** They were built at different times with different assumptions about kerf, slab width and taper. Doyle subtracts a fixed 4 inches for slabs, which is far too much for small logs and too little for large ones.

**Can I use this to sell timber?** It is for learning, planning and checking. Official scaling follows the rules, rounding and defect deductions of your local scaling authority.

**Is my data uploaded?** No. Everything runs in your browser.

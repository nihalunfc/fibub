---
name: Level book reducer
num: 133
shelf: science
code: T133
section: geodesy-and-surveying
title: "Level book reducer: rise and fall, height of collimation, arithmetic checks and misclosure adjustment"
summary: "Paste or open a levelling field book (back, intermediate and fore sights). Get reduced levels by both rise-and-fall and height of collimation, every arithmetic check, the closing error against a benchmark or loop, the allowed misclosure from your own k, adjusted levels and a profile."
status: live
ads: true
order: 2
icon: ruler
works: offline
updated: 2026-11-08
related: [traverse-calculator, darcy-flow-calculator, uncertainty-calculator, plot-maker]
sources:
  - "Rise-and-fall and height-of-collimation reduction, their arithmetic checks, k√K misclosure limits and the distribution of the closing error: standard plane surveying, written by fibub from first principles."
  - "No national or agency levelling standards are bundled: the user enters k from the specification for their job."
  - "The example level book is made up by fibub for illustration."
flow:
  - { icon: table, label: "Readings" }
  - { icon: calculator, label: "Reduce" }
  - { icon: check, label: "Check" }
  - { icon: chart, label: "Profile" }
---

## What it does

Levelling finds heights. A level is set up, a staff is read on a point of known height (the **back sight**, BS), then on other points (**intermediate sights**, IS), and finally on a **change point** (the **fore sight**, FS) before the level moves on. The field book of readings is then **reduced** to heights, called reduced levels (RL).

This tool reduces a whole book by both classic methods, **height of collimation** and **rise and fall**. It runs every arithmetic check, compares the end with a known benchmark or with the start of a loop, tests the misclosure against a limit you set, shares the error out and draws the profile. Nothing leaves your browser.

For horizontal positions from a survey, use the [[traverse-calculator]]; to turn well levels into a groundwater gradient, the [[darcy-flow-calculator]].

## How to use it

1. Paste or open the book: one row per reading with **station, BS, IS, FS**, and optionally **distance** and **remarks**. Separate the columns with tabs or commas and leave empty cells blank. A change point has its FS and BS on the same row.
2. Enter the reduced level of the first point (the starting benchmark).
3. Say how the run closes: on a known benchmark, back at the start (a loop), or not at all.
4. Enter **k** for the allowed misclosure, k√K millimetres, where K is the route length in km or the number of setups. Use the value from your job's specification.
5. Choose how to share the error: equally per setup, or in proportion to distance.

## The checks

- **ΣBS − ΣFS = last RL − first RL**: confirms the arithmetic of either method.
- **ΣRise − ΣFall = ΣBS − ΣFS**: the rise-and-fall check.
- **Full collimation check**: Σ(RLs after the first) = Σ(each height of instrument × readings taken from it) − ΣIS − ΣFS. Unlike the first check, this one also catches mistakes in intermediate sights.

The arithmetic checks only prove the sums. Only closing on a known level shows how good the field work was.

## Worked example

The made-up example levels a road centre line from BM A (RL 85.210) to BM B (known RL 85.821) over 165 m with two change points. ΣBS − ΣFS = 0.615, so BM B comes out at 85.825: a **closing error of +4.0 mm**. With k = 12 mm per √km the limit is 12 × √0.165 = **4.9 mm**, so the work passes. Sharing the error equally over the 3 setups takes about 1.3 mm off the first setup's readings, 2.7 mm off the second's and 4 mm off the third's.

## Good to know

- Keep back and fore sight lengths about equal on each setup, so collimation and curvature errors cancel.
- An intermediate sight is never checked by closing on a benchmark: a misread IS gives a wrong level with no warning except the full collimation check.
- For feet, enter readings in feet; the misclosure is then shown as thousandths of a foot labelled mm, so read it as such or convert.

## FAQ

**Which method should I use?** Both give the same levels. Rise and fall has a check on every reading; height of collimation is quicker for many intermediate sights. The tool shows both.

**Where does k come from?** From the specification for the job or the agency you work to. Typical values range from a few millimetres for precise work to tens of millimetres for rough construction levelling.

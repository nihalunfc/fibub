---
name: Drill hole composites
num: 131
shelf: science
section: mining-and-economic-geology
title: "Drill hole assay compositing and significant intercept calculator with strip logs"
summary: "Paste or open drill hole assay intervals. Check them for gaps and overlaps, make length-weighted composites to a fixed length or by lithology, find significant intercepts written as \"x m @ y g/t from z m\" with \"including\" high-grade parts, and draw a strip log of each hole."
status: live
ads: true
order: 2
icon: ruler
works: offline
updated: 2026-11-08
related: [grade-tonnage-calculator, stereonet, ternary-plot-maker, uncertainty-calculator]
sources:
  - "Length-weighted compositing, partial-composite rules and significant intercept rules (cut-off, internal dilution, minimum length): standard exploration geology practice, written by fibub from first principles."
  - "Example holes DDH-01 to DDH-03, their depths, lithologies and grades are made up by fibub for illustration."
flow:
  - { icon: table, label: "Assays" }
  - { icon: check, label: "Check" }
  - { icon: ruler, label: "Composite" }
  - { icon: target, label: "Intercepts" }
---

## What it does

A drill hole is sampled in pieces of core or chips, each sent to the lab for a grade. Those pieces are rarely the same length, so before the numbers are used for a resource estimate they are **composited**: averaged, weighted by length, into equal pieces. When a company reports a hole, it gives **significant intercepts** such as "6.0 m @ 2.51 g/t gold from 20.0 m", often with a richer part "including 4.0 m @ 3.13 g/t".

This tool does both, checks the data first, and draws a strip log of each hole. It runs in your browser; nothing is uploaded.

## How to use it

1. Paste or open your assay table: **hole, from, to, grade**, and optionally **lithology** (a rock code such as QV or SED). A header row is fine. Depths are in metres along the hole.
2. Pick the grade unit and, if you want, a **top cut**: grades above it are lowered to the cap.
3. Set the intercept rules and the composite method.
4. Read the checks, the intercepts for each hole, the strip log and the composites table, and download them as PNG, PDF or Word.

## The settings

- **Cut-off grade**: an intercept starts and ends on a sample at or above this grade.
- **Most internal waste in a row**: lower-grade samples may sit inside an intercept, but only up to this many metres in a row, and only if the whole intercept still averages at least the cut-off.
- **Shortest intercept**: shorter ones are not reported.
- **"Including" cut-off**: a higher grade for the rich parts inside each intercept, with the same waste rule.
- **Composite length** and **short last piece**: the last piece of a hole is usually short. You can keep it if at least half the length (else add it to the one above), always add it, keep it, drop it, or share the hole into equal composites close to your length.
- **Least sampled length**: a composite with less sampled core than this share is left out.
- **One per lithology run** makes one composite for each run of the same rock code instead.

## Checks

The tool flags rows where "from" is not above "to" (skipped), **gaps** between samples (treated as unsampled core), and **overlaps** (the later sample is trimmed to start where the one above ends). Fix the source data if you can.

## Worked example

The three holes are made up. With a 0.5 g/t cut-off, at most 2 m of internal waste and a 2 m minimum:

- DDH-01: **6.0 m @ 2.51 g/t from 20.0 m, including 4.0 m @ 3.13 g/t from 21.0 m**. The 1 m at 0.31 g/t inside it is internal waste.
- DDH-02: 6.0 m @ 0.85 g/t from 12.0 m. The check also finds a 1 m gap at 20 to 21 m.
- DDH-03: **4.0 m @ 4.72 g/t from 9.0 m, including 3.0 m @ 6.05 g/t**. It has the most grade times metres (18.9), so it is the best intercept. With a 10 g/t top cut the 11.4 g/t sample is capped and the intercept drops to 4.37 g/t.

## Good to know

- Intercept lengths are down-hole lengths, not true widths. The true width depends on the angle between the hole and the vein.
- Unsampled gaps count as zero-grade waste inside intercepts, which is cautious; they are left out of composite grades.
- Public reports of exploration results follow codes such as NI 43-101 or JORC, which ask for the cut-off, dilution and top-cut rules to be stated. This tool helps with the arithmetic only.

## FAQ

**Why weight by length?** A 2 m sample stands for twice as much rock as a 1 m sample, so it counts twice as much in the average.

**Can I use it for base metals?** Yes. Pick % as the unit and set the cut-offs in %.

**What about density?** Weighting by length assumes the rock density is the same along the hole, which is the usual first step.

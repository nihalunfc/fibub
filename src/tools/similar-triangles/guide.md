---
name: Similar triangles
num: 1159
shelf: learn
code: L76
section: school-maths
title: "Similar triangles: basic proportionality theorem, AA, SSS and SAS tests, and heights from shadows"
summary: "Drag a line parallel to one side of a triangle and watch AD/DB = AE/EC hold. Test two triangles for similarity with AA, SSS or SAS, and find a tree's height from its shadow."
status: live
ads: false
order: 1159
icon: target
works: offline
updated: 2026-11-09
related: [pythagoras-proofs, heights-distances, geometry-construction]
sources:
  - "The basic proportionality (Thales) theorem, the AA, SSS and SAS similarity criteria and the area ratio of similar triangles are standard geometry. Pictures and wording are fibub's own."
  - "Checked on 300 random triangles (ratios equal, DE parallel to BC) and against Python's math.acos for the cosine-rule angles."
flow:
  - { icon: pointer, label: "Drag" }
  - { icon: ruler, label: "Ratios" }
  - { icon: check, label: "Test" }
  - { icon: mountain, label: "Shadows" }
---

## What it does

Two triangles are **similar** when one is a scaled copy of the other: the same angles, and sides in the same ratio. This page has three parts:

1. **The basic proportionality theorem** (also called Thales' theorem): a line drawn parallel to one side of a triangle cuts the other two sides in the same ratio. Drag the triangle's corners and the point D, and the page measures AD/DB and AE/EC for you.
2. **Similarity tests**: type two angles (AA), three sides (SSS), or two sides with the angle between them (SAS) for two triangles. The page draws both, says whether they are similar and explains why.
3. **Heights from shadows**: a stick and a tree in the sun make similar triangles, so a short stick tells you how tall the tree is.

It follows the Class 10 chapter *triangles* (similar figures, the basic proportionality theorem and the criteria for similarity).

The theorem behind right triangles is in [[pythagoras-proofs]], and the trigonometry version of the shadow problem is in [[heights-distances]]. To build your own figures with a ruler and compass, use [[geometry-construction]].

## How to use it

- **Top picture**: drag A, B or C to reshape the triangle. Drag the green point D along AB, or use the slider. E moves along AC so that DE stays parallel to BC. Lengths are shown in grid units.
- **Similarity test**: choose AA, SSS or SAS, then type the numbers for both triangles. A green "Similar" or red "Not similar" label appears, with the reason.
- **Shadows**: type the stick's height, its shadow and the tree's shadow (all in metres).

## A worked example

At the start D sits 40 % of the way from A to B, so AD/DB = 0.4/0.6 = 0.667, and E sits 40 % of the way along AC, so AE/EC is also 0.667. DE is 0.4 times BC.

In the similarity test the page starts with AA: triangle 1 has angles 50° and 60° (so the third is 70°), triangle 2 has 50° and 70° (third 60°). Same three angles, so they are similar. Switch to SSS: 3, 4, 5 and 6, 8, 10 give ratios 0.5, 0.5, 0.5, so they are similar with scale factor 2, and the bigger one has 4 times the area.

Shadows: a 1.5 m stick casts a 2 m shadow, and the tree's shadow is 12 m. Then 1.5/2 = h/12, so the tree is 9 m tall.

## Tips

- In AA you only need two angles: the third is 180° minus the other two.
- In SAS the angle must be the one **between** the two sides.
- Areas of similar triangles grow with the **square** of the scale factor.

## Check yourself

Four fresh questions each time: a missing length with the basic proportionality theorem, a side of a similar triangle, a shadow problem and an area ratio. Type the answer, press **Check**, and open the worked answer if you need it. Nothing is saved.

## FAQ

**Are congruent triangles similar?** Yes, with scale factor 1.

**Is this from the NCERT book?** It covers the same topic with fibub's own pictures and examples. fibub is not part of NCERT.

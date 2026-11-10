---
name: Tessellation and symmetry studio
num: 1244
shelf: learn
section: school-maths
title: "Tessellation and symmetry studio: which regular polygons tile, mixes that fit round a point, and a rangoli pattern pad"
summary: "Put triangles, squares, pentagons, hexagons and more around one point and see whether their corners close up to 360°, leave a gap or overlap. See a patch of the three shapes that tile alone, then draw a rangoli-style pattern that repeats round the centre with rotational and mirror symmetry."
status: live
ads: false
order: 1244
icon: compass
works: offline
updated: 2026-11-09
related: [polyhedron-viewer, quadrilateral-explorer, matrix-transform]
sources:
  - "Interior angles of regular polygons, regular and semi-regular tilings, and rotational and line symmetry are standard geometry. Wording, pictures and examples are fibub's own."
  - "Checked against the standard facts: only triangles, squares and hexagons tile on their own, and exactly 17 combinations of regular polygons fit round a point (found by searching every combination up to 42 sides)."
flow:
  - { icon: pencil, label: "Add shapes" }
  - { icon: compass, label: "Angles" }
  - { icon: check, label: "Fit?" }
  - { icon: star, label: "Rangoli" }
---

## What it does

A **tessellation** (or tiling) covers a floor with shapes that leave no gaps and never overlap. Where the corners of the tiles meet, their angles must add up to exactly **360°**, a full turn. This studio lets you test that idea by hand.

- **Polygons around a point:** tap shapes to place them corner to corner around one point. The page adds up their corners and tells you if they close exactly, leave a gap (shaded) or overlap (dashed red).
- **A patch of tiles:** the three regular shapes that tile a floor on their own (triangles, squares and hexagons), drawn as a real patch.
- **Rangoli pattern pad:** draw a few lines and the pad turns them round the centre k times. With mirrors on, each line is also reflected, as in many rangoli and kolam designs. The page tells you the order of rotational symmetry and the number of lines of symmetry.

It fits Class 8 Mathematics, exploring some geometric themes (tilings, angles of polygons and symmetry), and links back to polygons and symmetry in earlier classes. Solids whose faces are these same regular polygons are in the [[polyhedron-viewer]]; turning and reflecting a whole grid is in [[matrix-transform]].

## How to use it

- Tap **Triangle**, **Square**, **Pentagon** and the others to add one at the point (up to 8). **Take one off** removes the last; **Clear** starts again.
- The quick buttons load six triangles, four squares, three hexagons, three pentagons and the mixes 4.8.8 (a square and two octagons), 3.12.12 and 3.4.6.4. The numbers name the polygons met going round the point.
- In **A patch of tiles**, pick triangles, squares or hexagons.
- On the **pattern pad**, set **k** (2 to 12 copies), tick or untick **Mirrors**, then draw. **Sample pattern** draws a small flower to start with; **Undo** removes your last line.

## A worked example

The corner of a regular polygon with n sides is 180° × (n − 2) ÷ n.

- Hexagon: 180 × 4 ÷ 6 = 120°. Three hexagons make 3 × 120 = 360°, so hexagons tile (as in a honeycomb).
- Pentagon: 180 × 3 ÷ 5 = 108°. Three make 324°, leaving a 36° gap; a fourth would make 432°, an overlap of 72°. So regular pentagons cannot tile alone.
- 3.4.6.4: 60 + 90 + 120 + 90 = 360°, so a triangle, two squares and a hexagon fit together.

On the pad with k = 6 and mirrors on, the pattern looks the same after every turn of 60°, so it has rotational symmetry of order 6, and it has 6 lines of symmetry.

## Check yourself

Five fresh questions each time: an interior angle, how many tiles meet at a corner, the gap left by shapes that do not tile, the missing polygon in a mix, and the lines of symmetry of a rangoli. Nothing is saved.

## FAQ

**Why only triangles, squares and hexagons?** Their corners (60°, 90°, 120°) divide 360 exactly. The next shape with a corner that divides 360 would need a corner of 180°, which is a straight line, not a polygon.

**Do the mixes always tile a whole floor?** Fitting round one point is needed, but not always enough: a few mixes (such as 5.5.10) close round one point but cannot be carried on across a whole floor. The ones in the quick buttons all do.

**Is this from the NCERT book?** It covers the same topic with fibub's own pictures and examples. fibub is not part of NCERT.

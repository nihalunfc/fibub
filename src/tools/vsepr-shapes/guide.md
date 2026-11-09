---
name: VSEPR shape viewer
num: 1101
shelf: learn
section: school-chemistry
title: "VSEPR shape viewer: bond pairs and lone pairs to 3D molecule shapes, bond angles and hybridisation"
summary: "Add bonded atoms and lone pairs to a central atom and watch the 3D shape change: linear, bent, trigonal planar, pyramidal, tetrahedral, see-saw, T-shaped, square planar and octahedral. Turn it with your finger, read the ideal bond angle and the hybridisation, count the pairs from any formula, and test yourself."
status: live
ads: false
order: 1101
icon: compass
works: offline
updated: 2026-11-09
related: [point-group-finder, molecule-viewer, hydrogen-orbitals]
sources:
  - "VSEPR rules (pairs spread as far apart as possible; lone pair repulsion greater than bond pair repulsion; lone pairs equatorial in a trigonal bipyramid) and the shape names are general chemistry, written fresh for fibub."
  - "Ideal angles worked out from the geometry of each arrangement (tetrahedral angle = arccos(−1/3) ≈ 109.47°). The measured angles for NH₃ (about 107°), H₂O (about 104.5°) and SO₂ (about 119°) are the rounded values quoted in general chemistry teaching."
  - "Checked: all 18 example molecules and 52 practice species give the shapes in the standard VSEPR table (AX₂ to AX₆ with up to 3 lone pairs)."
flow:
  - { icon: sliders, label: "Add pairs" }
  - { icon: compass, label: "Turn it" }
  - { icon: ruler, label: "Read angle" }
  - { icon: check, label: "Check" }
---

## What it does

Why is water bent but carbon dioxide straight? Why is ammonia a pyramid? **VSEPR** (valence shell electron pair repulsion) answers it with one idea: the electron pairs around a central atom push each other as far apart as they can. This page lets you add bonded atoms and lone pairs with big **+** and **−** buttons and see the 3D shape at once. Drag the picture to turn it; the orange arc marks a bond angle.

It follows the Class 11 Chemistry chapter on chemical bonding and molecular structure (VSEPR theory and hybridisation), and it is a good way to picture the carbon compounds of Class 10 too. For the full symmetry of a shape, go on to the [[point-group-finder]]; to turn real molecules from a file, use the [[molecule-viewer]].

## How to use it

1. Pick a **Molecule** from the list (NH₃ is first), or press **+** and **−** under **Bonded atoms** and **Lone pairs** to make your own AXₙEₘ.
2. Read the shape name, the arrangement of the electron pairs, the ideal **bond angle** and the **hybridisation** under the picture.
3. Untick **Show lone pairs** to see only the atoms: that is what the shape name describes.
4. In **Count the pairs from a formula**, choose a central atom, the outer atom, how many there are and the charge. The tool counts the electrons left on the central atom, step by step, and **Show this shape above** draws it.
5. In **Check yourself**, choose the shape of four molecules or ions and press **Check** for the worked answers.

## Worked example: ammonia, NH₃

Nitrogen has 5 valence electrons. Three single bonds to hydrogen use 3 of them, so 2 are left: one lone pair. Electron pairs = bonded atoms + lone pairs = 3 + 1 = 4, so the pairs point to the corners of a tetrahedron and nitrogen is **sp³**. The atoms make a **trigonal pyramidal** shape. The lone pair pushes harder than the bonds, so the bond angle is **less than 109.5°** (measured about 107°). Press **−** on Bonded atoms and **+** on Lone pairs and you get water: 2 + 2 = 4 pairs, still sp³, now **bent**.

## Shapes at a glance

| Pairs | Lone pairs | Shape | Ideal angle | Hybrid |
|---|---|---|---|---|
| 2 | 0 | linear | 180° | sp |
| 3 | 0, 1 | trigonal planar, bent | 120° | sp² |
| 4 | 0, 1, 2 | tetrahedral, pyramidal, bent | 109.5° | sp³ |
| 5 | 0, 1, 2, 3 | trigonal bipyramidal, see-saw, T-shaped, linear | 90°, 120° | sp³d |
| 6 | 0, 1, 2 | octahedral, square pyramidal, square planar | 90° | sp³d² |

## Tips

- **Multiple bonds count once.** In CO₂ each C=O double bond is one "pair direction", so carbon has 2, and CO₂ is linear.
- **Lone pairs in a trigonal bipyramid go round the middle** (equatorial), where they have fewer close neighbours. That is why SF₄ is a see-saw and XeF₂ is linear.
- **Polar or not?** If all the outer atoms are the same and the shape is symmetric (linear, trigonal planar, tetrahedral, square planar, octahedral), the bond dipoles cancel.

## FAQ

**Why does the counter treat O as using 2 electrons?** Oxygen usually forms a double bond to the central atom, so the central atom spends 2 electrons on it. Hydrogen and the halogens use 1, nitrogen 3.

**What happens with an odd number of electrons, like NO₂?** The single leftover electron still takes up space, so it counts as a domain; the molecule is a radical.

**Is this an official NCERT tool?** No. It is a free fibub page written to help with these chapters. Your choices stay on your device.

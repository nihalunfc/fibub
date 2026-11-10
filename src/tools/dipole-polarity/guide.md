---
name: Dipole polarity
num: 1109
shelf: learn
section: school-chemistry
title: "Dipole polarity"
summary: "Pick a molecule, see each bond dipole as an arrow from the electronegativity difference, and watch them add up or cancel on the 3D VSEPR shape. Swap outer atoms (CH₄ to CH₃Cl to CCl₄), compare with measured dipole moments, see why NF₃ is far less polar than NH₃, and test yourself."
status: live
ads: false
order: 1109
icon: flask
works: offline
updated: 2026-11-09
related: [vsepr-shapes, lewis-structures, point-group-finder]
sources:
  - "Pauling electronegativities (H 2.20, C 2.55, N 3.04, O 3.44, F 3.98, Cl 3.16 and so on) are the standard published values. Bond dipoles as ΔEN along the bond, added as vectors over the ideal VSEPR shape, are a relative teaching model written fresh for fibub, not debye values."
  - "Measured dipole moments (H₂O 1.85 D, NH₃ 1.47 D, NF₃ 0.23 D, HCl 1.11 D, CH₃Cl 1.87 D, CHCl₃ 1.04 D, SO₂ 1.63 D and others) are standard data-book gas-phase values. Polar and non-polar verdicts checked against the textbook outcomes for all 19 molecules."
flow:
  - { icon: flask, label: "Molecule" }
  - { icon: eye, label: "Turn it" }
  - { icon: sigma, label: "Add arrows" }
  - { icon: check, label: "Check" }
---

## What it does

A bond between two different atoms is **polar**: the more electronegative atom pulls the shared electrons towards itself and gets a small negative charge (δ−), the other gets δ+. That bond has a **dipole**, drawn as an arrow with a plus sign at its tail, pointing to the δ− end. A whole molecule is polar only if its bond dipoles do **not** cancel when you add them as arrows (vectors), and that depends on the **shape**. This page draws every bond dipole on a 3D model you can turn, sizes it by the electronegativity difference (ΔEN), and draws their sum as one red arrow: the dipole of the molecule. No red arrow means non-polar.

It follows the Class 11 Chemistry chapter on chemical bonding and molecular structure (polar covalent bonds, dipole moment, why CO₂ and BF₃ are non-polar while H₂O and NH₃ are polar). Find the shape first with the [[vsepr-shapes]] tool, count the bonds and lone pairs with [[lewis-structures]], and see the symmetry that makes dipoles cancel in the [[point-group-finder]].

## How to use it

1. Choose a **Molecule**. The verdict, polar or non-polar, appears with a one-line reason.
2. **Drag the picture** to turn it. The grey arrows are the bond dipoles; the red one is their sum.
3. Swap any outer H or halogen with the drop-downs under the menu. Turning CH₄ into CH₃Cl, then CH₂Cl₂, CHCl₃ and CCl₄ shows how the balance breaks and comes back.
4. Switch **Level** to **With numbers** to see each ΔEN, the vector sum written out, the model's net value and the measured dipole moment in debye (D).
5. In **Check yourself**, decide whether four molecules are polar, then press **Check**.

## Worked example: CO₂ against H₂O

In CO₂ each C=O bond has ΔEN = 3.44 − 2.55 = 0.89, pointing to O. The molecule is **linear**: the two arrows point in exactly opposite directions and cancel. Net dipole 0, so CO₂ is non-polar, even with two polar bonds.

In H₂O each O–H bond has ΔEN = 3.44 − 2.20 = 1.24, pointing to O. The two lone pairs on oxygen make the molecule **bent**, so both arrows lean the same way. Their sum points from between the H atoms towards O: the molecule is polar (measured 1.85 D).

## Why NF₃ is less polar than NH₃

Both are pyramidal with one lone pair on N, and their bond dipoles are similar in size (ΔEN 0.84 and 0.94). But in NH₃ the N–H dipoles point **towards** N, the same way as the lone pair, so they add: 1.47 D. In NF₃ the N–F dipoles point **away** from N, against the lone pair, so they partly cancel: only 0.23 D. The simple arrow model leaves out the lone pair, so the tool adds a note whenever one helps or hinders.

## Tips

- Same outer atoms + a symmetric shape (linear, trigonal planar, tetrahedral, trigonal bipyramidal, square planar, octahedral) = non-polar.
- Lone pairs on the central atom usually make a shape lopsided: bent, pyramidal, see-saw and T-shaped molecules are polar.
- Different outer atoms (CH₃Cl, CHCl₃) break the balance even on a perfect tetrahedron.

## FAQ

**Are the numbers real dipole moments?** The model value is only a relative size from ΔEN; it ignores lone pairs, bond lengths and real angles. The measured values in debye are real data-book values.

**Is this an NCERT tool?** No. It is a free fibub page made for this chapter; it runs on your device.

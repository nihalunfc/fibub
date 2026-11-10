---
name: Lewis structures
num: 1102
shelf: learn
section: school-chemistry
title: "Lewis structures"
summary: "Count the valence electrons, tap bonds to make them single, double or triple, and watch the lone pairs, formal charges and octets update. Get the best Lewis structure and every resonance form for 29 molecules and ions (H₂O, CO₂, O₃, NO₃⁻, CO₃²⁻, SO₄²⁻, CO, N₂O …) or build your own, with the steps written out."
status: live
ads: false
order: 1102
icon: pencil
works: offline
updated: 2026-11-09
related: [vsepr-shapes, unsaturation-calculator, electron-count-calculator]
sources:
  - "Lewis structure rules (octet and duet, formal charge = valence electrons − lone electrons − bonds, smallest formal charges with minus charges on the more electronegative atom, resonance) are general chemistry, written fresh for fibub."
  - "Pauling electronegativities and valence electron counts: general chemistry facts (periodic table)."
  - "Checked against the Lewis structures quoted in general chemistry texts for 29 molecules and ions: bond orders, formal charges (CO: C −1, O +1; O₃: centre +1; NH₄⁺: N +1), 3 resonance forms for NO₃⁻ and CO₃²⁻ with average bond order 4/3, 6 expanded-octet forms for SO₄²⁻ with average 1.5, the incomplete octet of BF₃ and the odd electron of NO₂."
flow:
  - { icon: calculator, label: "Count" }
  - { icon: pointer, label: "Tap bonds" }
  - { icon: check, label: "Octets" }
  - { icon: copy, label: "Resonance" }
---

## What it does

A **Lewis structure** (electron dot structure) shows every valence electron in a molecule: shared pairs as bonds, the rest as dots. This page counts the electrons for you, places the lone pairs, and lets you **tap a bond** to change it from single to double to triple. At once you see whether every atom has its octet (2 for hydrogen), the **formal charge** on each atom, and whether you have found the best structure. For ions like nitrate it shows each **resonance form**.

It follows Class 10 Science (carbon and its compounds: electron dot structures of H₂, O₂, N₂, CH₄ and CO₂) and the Class 11 Chemistry chapter on chemical bonding (the Kössel–Lewis approach, formal charge, resonance and the limits of the octet rule). Switch **Level** to Class 10 to hide formal charges and resonance. Next, see the 3D shape with the [[vsepr-shapes]] tool; for rings and double bonds from a formula use the [[unsaturation-calculator]].

## How to use it

1. Pick a **Molecule or ion**, or **Build your own**: choose a central atom, type the outer atoms with spaces (e.g. `O O O`) and choose the charge.
2. The grey box shows the valence electron count with the live numbers.
3. **Tap a bond** in the picture to change it. Lone pairs are placed for you: outer atoms are filled to 8 first, then the central atom.
4. Read the result: red rings and messages show any atom that is short of, or over, its octet. "Best structure" means every rule is met with the smallest formal charges.
5. **Best structure** jumps to the answer, **Next resonance form** steps through equal forms, **All single bonds** starts again.
6. **Allow expanded octets** lets atoms from period 3 down (S, P, Cl …) take double bonds beyond 8 electrons when that lowers the formal charges.

## Worked example: the nitrate ion, NO₃⁻

Valence electrons: N 5 + O 6 × 3 + 1 (charge 1−) = 24. Three single bonds use 6, leaving 18; each oxygen takes 6 as lone pairs, so nitrogen has only 6 electrons. Turning one oxygen lone pair into a second bond gives nitrogen its octet. Formal charges: N = 5 − 0 − 4 = **+1**; the double-bonded O = 6 − 4 − 2 = **0**; each single-bonded O = 6 − 6 − 1 = **−1**. They add up to −1, the charge of the ion. The double bond can be on any of the three oxygens, so there are **3 resonance forms** and the average N–O bond order is 1.33: in the real ion all three bonds are the same length.

## Tips

- **Formal charges always add up to the overall charge.** Use that to check your sums.
- **B, Be and Al** are happy with fewer than 8 (BF₃ has 6 round boron). Atoms in period 2 (C, N, O, F) can never have more than 8.
- **An odd total** (NO₂ has 17) means one atom must have 7: a free radical.

## FAQ

**Is the Lewis structure of O₂ wrong?** It pairs every electron, but oxygen is attracted to a magnet because it has two unpaired electrons. Molecular orbital theory explains that; Lewis structures cannot.

**Does the tool handle any molecule?** It handles the listed examples (including chains like ethene and methanol) and any molecule with one central atom. Skeletons with several central atoms are given as examples only.

**Is this an NCERT tool?** No. It is a free fibub page written to help with these topics. Everything runs on your device.

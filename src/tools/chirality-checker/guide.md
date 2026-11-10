---
name: R/S checker
num: 1107
shelf: learn
section: school-chemistry
title: "R/S checker"
summary: "Turn a carbon with four groups in 3D, see whether it is chiral, rank the groups by CIP priority with each step explained, and read R or S with the lowest-priority group put at the back and a curved arrow. Flip to the mirror image, swap two groups, build your own from 19 groups, and test yourself."
status: live
ads: false
order: 1107
icon: compass
works: offline
updated: 2026-11-09
related: [isomer-explorer, vsepr-shapes, point-group-finder]
sources:
  - "Cahn–Ingold–Prelog priority rules (atomic number first, then the atoms one step further out, a double bond read as two single bonds to duplicate atoms) and the R/S convention are general organic chemistry, written fresh for fibub."
  - "Checked against the priority orders given in textbooks for lactic acid, alanine, glyceraldehyde, butan-2-ol and 3-methylhexane, and the standard comparisons CH=CH₂ > CH(CH₃)₂, CHO > CN and D > H; R/S checked by hand on a drawn CHFClBr, with mirror images and swaps flipping it."
flow:
  - { icon: compass, label: "Turn it" }
  - { icon: sigma, label: "Priorities" }
  - { icon: eye, label: "4 at back" }
  - { icon: check, label: "R or S" }
---

## What it does

A carbon joined to **four different groups** is a **chiral centre** (stereocentre): the molecule and its mirror image cannot be turned to match, like your left and right hands. This page shows one such carbon in 3D. Drag to turn it; bold, larger groups point towards you and thin, dashed ones point away.

It ranks the four groups by the **CIP priority rules** and explains each step, then names the arrangement **R** or **S**. Press **Put 4 at the back** and the view turns so the lowest-priority group points away from you; a curved arrow runs 1 → 2 → 3. Clockwise is R, anticlockwise is S. **Mirror image** shows the other enantiomer, and **Swap two groups** shows that swapping any two flips the letter.

It follows the Class 12 Chemistry chapter on haloalkanes and haloarenes (optical isomerism, chirality, R and S, retention and inversion) and the Class 11 introduction to stereoisomerism. Find which isomers have a chiral carbon with the [[isomer-explorer]], see the tetrahedral shape behind it in the [[vsepr-shapes]] tool, and check the full symmetry of any molecule with the [[point-group-finder]].

## How to use it

1. Choose a **Molecule**: CHFClBr, butan-2-ol, 2-chlorobutane, lactic acid, alanine, glyceraldehyde, 3-methylhexane, but-3-en-2-ol, or two that are not chiral. Or **Build your own** from 19 groups (H, D, halogens, OH, OCH₃, NH₂, CH₃, C₂H₅, propyl, isopropyl, CH₂OH, CH₂Cl, CHO, COOH, CN, CH=CH₂).
2. Read the priorities (the blue numbers) and the steps that decide them.
3. Press **Put 4 at the back** and follow the arrow.
4. Try **Mirror image** and **Swap two groups**, and drag the picture to see that turning it never changes R or S.

## Worked example: butan-2-ol

Carbon 2 holds H, OH, CH₃ and C₂H₅: four different groups, so it is chiral. First atoms: O (8) beats C (6), C (6) and H (1), so OH is 1 and H is 4. CH₃ and C₂H₅ tie on carbon; one atom further out, C₂H₅ has {C, H, H} and CH₃ has {H, H, H}, so C₂H₅ is 2 and CH₃ is 3. In the starting arrangement, putting H at the back gives OH → C₂H₅ → CH₃ going clockwise: **(R)-butan-2-ol**. Its mirror image is (S).

## Tips

- **Compare atoms, not whole groups.** At the first difference, the higher atomic number wins; a big group of light atoms loses to a single heavy atom (Cl beats CH₂CH₂CH₃).
- **Double bonds count twice**: CHO is read as C attached to (O, O, H).
- **If the lowest group points towards you**, read the arrow and then take the opposite letter.

## FAQ

**Does R mean it turns light to the right?** No. R and S describe the arrangement; the direction a compound rotates polarised light (+ or −) has to be measured.

**Is this an NCERT tool?** No. It is a free fibub page made for these chapters; it runs on your device.

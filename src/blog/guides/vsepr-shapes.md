---
title: "VSEPR shapes explained: count electron pairs to predict a molecule's 3D shape"
summary: "How VSEPR theory turns a formula into a 3D shape: count the bonded atoms and lone pairs around the central atom, then read off the shape, the ideal bond angle and the hybridisation. Worked examples for ClF₃ and NH₄⁺."
tools: [vsepr-shapes, point-group-finder, molecule-viewer, hydrogen-orbitals]
updated: 2026-11-10
sources:
  - "VSEPR (valence shell electron pair repulsion) rules and shape names: standard general chemistry, Class 11 level."
  - "Ideal tetrahedral angle = arccos(−1/3) ≈ 109.47°, worked out from the geometry. Measured angles quoted in teaching are rounded."
---

Why is a water molecule bent while carbon dioxide is straight? **VSEPR** (valence shell electron pair repulsion) gives a simple answer: the electron pairs around a central atom push each other as far apart as they can. Count those pairs, and the shape follows. The [[vsepr-shapes]] tool lets you build a shape with the + and − buttons and turn it in 3D. Once you can predict a shape, the [[point-group-finder]] shows its full symmetry, the [[molecule-viewer]] shows real molecules from a data file, and the [[hydrogen-orbitals]] tool shows the orbitals behind the hybrid labels such as sp³.

## What it is

Every bond and every lone pair on the central atom counts as one **electron pair region**. A double bond is still one region, because its two pairs sit in the same direction. The pairs arrange themselves to keep their distance:

- 2 regions: linear, 180°
- 3 regions: trigonal planar, 120°
- 4 regions: tetrahedral, 109.5°
- 5 regions: trigonal bipyramidal, with angles of 90° and 120°
- 6 regions: octahedral, 90°

A lone pair takes up more room than a bonding pair, so it pushes the bonds closer together. The **arrangement** names where all the pairs point. The **shape** names only where the atoms are. Water has four pairs in a tetrahedral arrangement, but its atoms form a bent shape.

To count the pairs from a formula:

1. Take the valence electrons of the central atom.
2. Add one for each negative charge, and take one away for each positive charge.
3. Subtract the electrons the central atom spends on bonds to outer atoms: one for each single bond, and two for a double bond (the tool uses two for an outer oxygen).
4. Divide what is left by two. That is the number of lone pairs.
5. Add the bonded atoms and the lone pairs. That is the number of regions, and it gives the hybridisation: 2 is sp, 3 is sp², 4 is sp³, 5 is sp³d and 6 is sp³d².

## How to use it

1. Pick a molecule from the list, or press **+** and **−** under **Bonded atoms** and **Lone pairs** to build your own shape.
2. Read the shape name, the arrangement of the pairs, the ideal bond angle and the hybridisation under the picture.
3. Untick **Show lone pairs** to see only the atoms. The shape name describes those atoms, not the pairs.
4. In **Count the pairs from a formula**, choose the central atom, the outer atom, how many outer atoms there are and the charge. The tool shows each step, and **Show this shape above** draws the result.
5. In **Check yourself**, predict the shapes of four molecules or ions, press **Check**, and compare with the worked answers.

## A worked example

**ClF₃.** Chlorine has 7 valence electrons. Three single bonds to fluorine use 3 of them, so 7 − 3 = 4 are left. Four electrons make 2 lone pairs. The regions are 3 bonds + 2 lone pairs = **5**, so the arrangement is trigonal bipyramidal and the hybridisation is **sp³d**.

Lone pairs are placed in the equatorial positions, where they have fewer close neighbours. That leaves the three fluorines in a **T-shape**, with an ideal angle of **90°**. The real molecule is slightly less than 90°, because the lone pairs push a little harder than the bonds.

**NH₄⁺.** Nitrogen has 5 valence electrons. The + charge removes one, leaving 4. Four bonds to hydrogen use all four, so there are 0 lone pairs. The regions are 4 + 0 = **4**, giving a **tetrahedral** shape, an ideal angle of **109.5°** and hybridisation **sp³**. Compare this with ammonia, NH₃, which has one lone pair and a measured angle of about 107°.

## Where it is used

- **Exam questions** in Class 11 and first-year chemistry, where shape predicts properties.
- **Polarity.** A molecule with polar bonds may still be non-polar if its shape makes the bond dipoles cancel. Shape is the first thing to check.
- **Boiling points and solubility.** Shape affects how molecules pack and how they attract each other.
- **Drug design.** Chemists match a molecule's 3D shape to the shape of a binding site in a protein.
- **Materials.** The shape of small building blocks, such as silicon-oxygen groups, helps explain how solids are built.

## Common mistakes

1. **Counting a double bond as two regions.** In ethene, C₂H₄, each carbon has two C-H bonds and one C=C double bond. That is 3 regions, not 4, so each carbon is trigonal planar with angles near 120°.
2. **Naming the arrangement when the question asks for the shape.** Water's pairs are tetrahedral, but its molecular shape is bent. Read the question carefully.
3. **Putting lone pairs in the wrong place.** With 5 regions, lone pairs go in the middle ring first. For ClF₃, putting a lone pair at the top or bottom would give a different shape from the T-shape that is observed.
4. **Ignoring the charge.** A negative charge adds an electron to the count, and a positive one removes an electron. Forgetting this gives the wrong number of lone pairs.
5. **Quoting a measured angle as the ideal one.** Ammonia's measured angle of about 107° is smaller than the ideal 109.5°. Say which one you mean.

## Questions people ask

**Is the bond angle always the ideal one?** No. Lone pairs push the bonds closer together, so most molecules with lone pairs have angles smaller than the ideal value.

**Why does a lone pair push harder than a bond?** A bonding pair is held between two nuclei. A lone pair belongs to one nucleus only, so its cloud spreads out wider and takes more room.

**Do I need hybridisation for the exam?** Often yes, because it is asked alongside the shape. Remember it by the number of regions: 2 is sp, 3 is sp², 4 is sp³, 5 is sp³d and 6 is sp³d².

---
name: Newman projection spinner
num: 1105
shelf: learn
section: school-chemistry
title: "Newman projection spinner: conformations of ethane and butane with an energy vs dihedral angle graph"
summary: "Turn the back carbon of ethane or butane with your finger and watch the Newman projection change between staggered and eclipsed, anti and gauche. The energy graph follows along, with the formula and numbers filled in, and a quick quiz on naming conformations."
status: live
ads: false
order: 1105
icon: compass
works: offline
updated: 2026-11-09
related: [carbon-chain-namer, vsepr-shapes, molecule-viewer]
sources:
  - "Conformation names (staggered, eclipsed, anti, gauche, syn) and Newman projections are general organic chemistry, written fresh for fibub."
  - "Energies are rounded teaching values (ethane barrier about 12.5 kJ/mol; butane gauche about 3.8, eclipsed about 16, fully eclipsed about 19 kJ/mol) joined by a cosine series solved by hand: a model, not measured data. Gas constant from CODATA."
  - "Checked: the curve passes through all four butane values and the ethane barrier; the anti share at 25 °C (about 70 %) matches the value quoted in textbooks."
flow:
  - { icon: pointer, label: "Drag" }
  - { icon: eye, label: "Newman" }
  - { icon: chart, label: "Energy" }
  - { icon: check, label: "Name it" }
---

## What it does

Single C–C bonds can turn. Look straight along the bond and you see a **Newman projection**: the front carbon is a point with three bonds, the back carbon is a circle with three bonds sticking out from behind it. This page lets you turn the back carbon of **ethane** or **butane** by dragging round the circle (or with the slider and the ±60° buttons), and shows at once the name of the conformation, its **torsional energy** with the formula filled in, and where you are on the energy graph.

It follows the Class 11 Chemistry chapter on hydrocarbons (alkanes: conformations, Newman projections, staggered and eclipsed forms, and why they cannot be separated). Before this, build the molecules with the [[carbon-chain-namer]] and see the tetrahedral carbons in the [[vsepr-shapes]] tool; to turn real 3D structures from a file, use the [[molecule-viewer]].

## How to use it

1. Choose **Ethane** or **Butane**.
2. Drag round the Newman projection: the back group follows your finger. The slider and the **−60°** / **+60°** buttons do the same.
3. Read the name (staggered, eclipsed, anti, gauche, fully eclipsed or skew), the energy and the formula with the numbers in it.
4. Tap the **energy graph** to jump to an angle; press **Spin** to watch it turn.
5. Try **Check yourself**: name four conformations from their pictures.

## Worked example: butane at 60°

At φ = 60° the two CH₃ groups are next to each other but staggered: the **gauche** form. The model gives E = 9.77 + 2.27 cos 60° − 0.27 cos 120° + 7.23 cos 180° = **3.8 kJ/mol** above the anti form. Turn to 120°: a CH₃ now sits behind an H (**eclipsed**), 16.0 kJ/mol. At 0° the two CH₃ groups eclipse each other (**fully eclipsed**, 19.0 kJ/mol), the highest point. At 180° they are opposite (**anti**), the lowest. With 3.8 kJ/mol between anti and gauche, about 70 % of butane molecules are anti at 25 °C.

For ethane all the groups are H, so the curve is simpler: E = ½ × 12.5 × (1 + cos 3φ), with staggered forms at 0 and eclipsed forms at 12.5 kJ/mol.

## Tips

- **Staggered beats eclipsed**: in eclipsed forms the bonds' electron pairs are closest and repel (torsional strain).
- **Gauche costs a little**: the CH₃ groups bump (steric strain), so anti is the most stable butane.
- **Barriers are small**: 12.5 kJ/mol is easily crossed at room temperature, so the forms turn into each other all the time.

## FAQ

**Are these energies exact?** No. They are rounded values used in teaching, joined by a smooth curve. Real values differ a little between sources.

**Why can't we bottle the eclipsed form?** It is a peak, not a valley, and even the valleys are only a few kJ/mol apart, so the molecule keeps turning.

**Is this an NCERT tool?** No. It is a free fibub page made to help with this chapter; it runs on your device.

---
name: Periodic trends
num: 1356
shelf: learn
code: L218
section: school-chemistry
title: "Periodic trends explorer: atomic radius, ionisation energy and electronegativity across a period and down a group, with the exceptions explained"
summary: "Colour the periodic table by atomic radius, first ionisation energy or electronegativity, tap any element, and graph the trend across its period or down its group. The exceptions to each trend (beryllium to boron, nitrogen to oxygen, aluminium to gallium) are flagged in red with the reason."
status: live
ads: false
order: 1356
icon: table
works: offline
updated: 2026-11-09
related: [periodic-table, electron-configuration, element-temp-name, mendeleev-predictor]
sources:
  - "First ionisation energies: NIST Atomic Spectra Database values (public domain), rounded to 0.01 eV and converted with 1 eV per atom = 96.485 kJ/mol. Electronegativities: the Pauling scale values most textbooks print, rounded. Both from the site's periodic table data (src/lib/sci/ptable.ts)."
  - "Atomic radii: approximate single-bond covalent radii rounded to the nearest 5 pm, for the s- and p-block elements of periods 1 to 6; published sets differ by 5 to 10 pm, so the tool is for reading trends, not for exact values."
  - "The trends and their exceptions (Be → B and N → O in ionisation energy; Al ≈ Ga in size) are general chemistry found in any textbook. Checked: radius falls across periods 2 and 3 and grows down groups 1 and 2; the exceptions are flagged exactly where expected."
flow:
  - { icon: table, label: "Pick element" }
  - { icon: sliders, label: "Property" }
  - { icon: chart, label: "Trend" }
  - { icon: check, label: "Check" }
---

## What it does

The periodic table is not just a list: its rows (**periods**) and columns (**groups**) show smooth patterns in how big atoms are, how tightly they hold their electrons, and how strongly they pull on shared electrons in a bond. This tool colours the table by one of three properties at a time: **atomic radius**, **first ionisation energy** and **electronegativity**. Tap any element and a bar graph shows the trend across its period or down its group.

Trends have exceptions, and exam questions love them. Where a value breaks the usual direction, its bar turns red and a short reason appears underneath: why boron is easier to ionise than beryllium, why oxygen is easier than nitrogen, and why gallium is no bigger than aluminium.

It follows the school topics on the modern periodic table and periodic trends in properties (Class 11 Chemistry, classification of elements and periodicity), and the periodic table in Class 10. For every element's full data see [[periodic-table]], for how electrons fill the shells behind these trends [[electron-configuration]], and for how the table was first built [[mendeleev-predictor]].

## How to use it

1. Pick the **property**: atomic radius, ionisation energy or electronegativity. The table recolours: pale is low, dark is high.
2. **Tap an element**. Its period (or group) is outlined and graphed below.
3. Switch between **Across the period** and **Down the group**.
4. Read the element's values and the explanation of the trend and any exceptions under the graph.

## Worked example

Open the page: **carbon** is chosen and the graph shows **atomic radius across period 2**: lithium about 130 pm, beryllium 95, boron 85, carbon 75, nitrogen 70, oxygen 65 and fluorine 55. Each step adds a proton that pulls the same second shell in tighter. Neon has no bar: noble gases form almost no bonds, so their size is measured differently.

Switch to **ionisation energy**: the bars rise from lithium (520 kJ/mol) to neon (2080 kJ/mol), but two are red. Boron (801) is below beryllium (899) because its electron sits alone in a 2p orbital, and oxygen (1314) is below nitrogen (1402) because its fourth p electron has to pair up. Carbon's own value is **1086 kJ/mol** (11.26 eV per atom).

Tap **aluminium**, choose **Down the group** with atomic radius: gallium (about 120 pm) is flagged, no bigger than aluminium, because of the ten poorly shielding 3d electrons added in between.

## Tips

- Size and ionisation energy usually move in opposite directions: big atoms lose electrons easily.
- Fluorine is the most electronegative element; caesium and francium the least.
- Exceptions to ionisation energy come at half-full and full subshells.

## FAQ

**Why are some radii missing?** Radii are shown only for the s- and p-block elements, where the trend is clearest and the values agree best between sources. Noble gases are left out on purpose.

**Why kJ/mol and not eV?** Textbooks give ionisation enthalpy per mole; the facts also show eV per atom. Multiply eV by 96.485 to get kJ/mol.

**Is anything stored?** No. It all runs in your browser.

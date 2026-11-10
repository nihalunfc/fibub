---
name: Interactive periodic table
num: 835
shelf: science
code: T571
section: general-and-lab-chemistry
title: "Periodic table: electron configurations, oxidation states, electronegativity and trends for all 118 elements"
summary: "Tap any of the 118 elements for its atomic weight, group, period and block, its ground-state electron configuration in full and noble-gas notation (with the exceptions to the Aufbau rule), the configuration of any ion, common oxidation states, Pauling electronegativity and first ionisation energy. Colour the whole table by a property and chart the trend against atomic number. Download an element card or every element as a CSV."
status: live
ads: true
order: 835
icon: table
works: offline
updated: 2026-11-09
related: [molar-mass-calculator, electron-count-calculator, crystal-field-calculator, isotope-pattern-calculator, equation-balancer, concentration-converter, physical-constants, hydrogen-orbitals]
sources:
  - "Names, symbols and standard atomic weights: IUPAC/CIAAW abridged values, as in fibub's molar mass calculator. Radioactive elements show the mass number of their longest-lived isotope in brackets."
  - "Electron configurations are worked out by fibub from the Aufbau (Madelung) rule; the 20 neutral atoms that differ (chromium, copper, palladium, gadolinium, uranium and others) use the measured ground states listed in the NIST Atomic Spectra Database. From rutherfordium on they are predictions."
  - "First ionisation energies: NIST Atomic Spectra Database, rounded to 0.01 eV. Electronegativity: Pauling's scale as revised by A. L. Allred (1961), the values most textbooks print. Common oxidation states: the usual textbook list. All are general facts, rounded."
  - "Checked in the tests against the mendeleev and pymatgen Python packages for all 118 elements (configurations, cores, unpaired electrons, positions, electronegativity, ionisation energy, oxidation states)."
flow:
  - { icon: table, label: "Pick" }
  - { icon: flask, label: "Config" }
  - { icon: sliders, label: "Colour by" }
  - { icon: chart, label: "Trend" }
---

## What it does

This is a periodic table you can tap. Choose an element, from the grid or by typing its symbol, name or atomic number, and the card below shows:

- **Atomic number, standard atomic weight, group, period and block.** Radioactive elements with no standard weight show the mass number of their longest-lived isotope in brackets, such as [97] for technetium.
- **Category**: alkali metal, transition metal, halogen, lanthanoid and so on. Books draw some borders differently (polonium, astatine, which elements count as metalloids), so treat the borderline ones loosely.
- **Electron configuration**, in full and in noble-gas notation, written either by shell (1s 2s 2p 3s 3p 3d 4s, as spectroscopists and the NIST tables write it) or in **filling order** (4s before 3d, as many school books write it).
- **Exceptions**: where the real ground state differs from the Aufbau rule, the card says so and shows what the rule alone would predict.
- **Ion configurations** for any charge: type 3 for Fe³⁺ or −2 for O²⁻.
- **Common oxidation states, Pauling electronegativity, first ionisation energy** (in eV and kJ/mol), unpaired electrons in the free atom and the natural isotopes with their abundances.

The **Colour by** menu paints the whole table by category, block, electronegativity, ionisation energy, atomic weight, unpaired electrons or the highest common oxidation state, so trends jump out. The chart at the bottom plots the same property against atomic number, with the chosen element in red.

Add up the masses in a formula with the [[molar-mass-calculator]], and see the shapes of the orbitals in [[hydrogen-orbitals]].

## How to use it

1. Tap an element. On a phone, swipe the table sideways, or type in **Find an element** (Fe, iron, 26 all work; US spellings like cesium too).
2. Use **Previous** and **Next** to walk along the table, or the arrow keys on a keyboard.
3. Switch **By shell** and **Filling order** to see both ways of writing a configuration.
4. Type a **Charge** to get the ion's configuration.
5. Pick a property under **Colour by** or under the chart.
6. Download the **Element card** as PNG, PDF or Word, or **All 118 elements** as a CSV for a spreadsheet.

## How the configurations are worked out

The Aufbau rule fills subshells in order of n + l, and for equal n + l the smaller n first: 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p, 5s, 4d, 5p, 6s, 4f, 5d, 6p, 7s, 5f, 6d, 7p. An s subshell holds 2 electrons, p 6, d 10 and f 14. Twenty atoms up to lawrencium are measured to differ, for example chromium (3d⁵ 4s¹, not 3d⁴ 4s²), copper (3d¹⁰ 4s¹), palladium (4d¹⁰ with an empty 5s), gadolinium (4f⁷ 5d¹ 6s²) and lawrencium (7p¹ instead of 6d¹). Those use the measured ground state. Ions lose electrons from the outermost shell first, so iron loses 4s before 3d and europium loses 6s before 4f.

Unpaired electrons follow Hund's rule: electrons spread out over the orbitals of a subshell before they pair up.

## Worked example

Tap **Fe**. The card shows atomic number 26, standard atomic weight 55.845 g/mol, group 8, period 4, d block. The full configuration is 1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁶ 4s², in noble-gas notation [Ar] 3d⁶ 4s² (in filling order [Ar] 4s² 3d⁶). Iron has 4 unpaired electrons, common oxidation states +2 and +3, electronegativity 1.83 and first ionisation energy 7.9 eV (762 kJ/mol). With a charge of 2 the ion line reads Fe²⁺: [Ar] 3d⁶ (24 electrons): both 4s electrons have gone, not two 3d ones. Tap **Cr** and the card notes the exception: the rule alone would give [Ar] 3d⁴ 4s².

## Where group 3 sits

Tables differ here. Some put lanthanum and actinium under yttrium; IUPAC's own table leaves a gap for all 15 lanthanoids and actinoids. This one puts **lutetium and lawrencium** in group 3 with scandium and yttrium, which keeps the f block 14 elements wide and matches the filling order. Lutetium and lawrencium still count as a lanthanoid and an actinoid.

## Tips

- Electronegativity has no value for helium, neon and argon (they form almost no compounds) or for the heaviest elements. Ionisation energies from rutherfordium on are only calculated, so they are left out.
- Oxidation states listed are the common ones; most transition metals reach others in rarer compounds.
- Hover over a cell on a computer to see its value for the colouring.

## FAQ

**Why is 4s written after 3d?** By shell, subshells are listed by n and then l, which is how measured configurations are usually printed. Choose **Filling order** to see the order in which the rule fills them.

**Are the superheavy configurations real?** Not measured. From rutherfordium on the card says "predicted": they follow the Aufbau rule, and some calculations predict exceptions (darmstadtium and roentgenium, for example).

**Is anything sent anywhere?** No. The table and all the working are in the page.

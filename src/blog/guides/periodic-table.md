---
title: "How to read the periodic table: electron configurations and trends"
summary: "A plain guide to the interactive periodic table: how electron configurations are built, why copper breaks the rule, how ions lose electrons, and how to spot trends in electronegativity and ionisation energy."
tools: [periodic-table, molar-mass-calculator, hydrogen-orbitals, electron-count-calculator]
updated: 2026-11-10
sources:
  - "Standard atomic weights: IUPAC/CIAAW abridged values. Electron configurations: Aufbau (Madelung) order with measured exceptions from the NIST Atomic Spectra Database."
  - "First ionisation energies: NIST Atomic Spectra Database, rounded. Electronegativity: Pauling scale (Allred, 1961 revision). 1 eV per atom = 96.485 kJ/mol."
---

The periodic table packs a huge amount of chemistry into one grid. The [[periodic-table]] tool makes that grid tappable: pick any of the 118 elements to see its weight, its place in the table, how its electrons are arranged, the ions it forms and how strongly it holds on to electrons. You can also colour the whole table by one property to see the patterns at a glance. It is useful for Class 11 and 12 chemistry, first-year university courses and anyone who needs a quick fact. When you need the mass of a whole compound, move on to the [[molar-mass-calculator]]; to see what an orbital looks like, open [[hydrogen-orbitals]].

## What it is

Every element has an **atomic number** Z: the number of protons, which is also the number of electrons in the neutral atom. The electrons live in **subshells** named s, p, d and f. An s subshell holds up to 2 electrons, p holds 6, d holds 10 and f holds 14. Each subshell also has a shell number n, so 3d means the d subshell of shell 3.

An **electron configuration** lists how many electrons sit in each subshell. For most atoms you can build it with the **Aufbau rule**: fill the subshells from lowest energy upward, in the order given by n + l (where l is 0 for s, 1 for p, 2 for d and 3 for f), taking the smaller n first when there is a tie. That is why 4s fills before 3d.

**Noble-gas notation** is a shortcut. Instead of writing every inner electron, you write the previous noble gas in brackets, such as [Ar], and then only the outer electrons.

Two other numbers describe how an atom treats electrons:

- **First ionisation energy**: the energy needed to pull one electron off a gaseous atom. It is given in electronvolts (eV); multiply by 96.485 for kJ/mol.
- **Electronegativity**: how strongly an atom pulls shared electrons in a bond, on Pauling's scale (fluorine is highest, at about 4).

## How to use it

1. Tap an element in the grid, or type a symbol, name or atomic number in **Find an element**. On a phone, swipe the grid sideways to reach all 18 groups.
2. Step through neighbours with **‹ Previous** and **Next ›**, or the left and right arrow keys.
3. Read the card: atomic number, standard atomic weight, group, period, block, electronegativity, first ionisation energy, common oxidation states and unpaired electrons.
4. Under **Electron configuration**, switch between **By shell** and **Filling order** to see the two common ways of writing it. Look for a note if the element breaks the Aufbau rule.
5. Type a charge under **Ion** (from −4 to 8) to get that ion's configuration and electron count.
6. Use **Colour by** to paint the table by category, block, electronegativity, ionisation energy, atomic weight, unpaired electrons or highest common oxidation state. The **Trend across the table** chart plots a number against atomic number, with your element in red.
7. Save the element card as PNG, PDF or Word, or download **All 118 elements (.csv)**.

## A worked example

Look up **manganese** (Mn). The card shows:

- atomic number **25**, standard atomic weight **54.938 g/mol**, group 7, period 4, d block
- configuration **[Ar] 3d⁵ 4s²** by shell, or **[Ar] 4s² 3d⁵** in filling order
- **5** unpaired electrons, one in each 3d orbital
- first ionisation energy **7.43 eV**, which is 7.43 × 96.485 ≈ **717 kJ/mol**

Count the electrons: argon has 18, plus 5 + 2 = 7, giving 25. Now set the charge to **2**. The ion line reads **Mn²⁺: [Ar] 3d⁵ (23 electrons)**. The two 4s electrons leave first, so the half-filled 3d set stays.

Next, press **Next ›** four times to reach **copper** (Cu, Z = 29). The rule alone predicts [Ar] 3d⁹ 4s², but the card shows the measured **[Ar] 3d¹⁰ 4s¹** and flags it as an exception. A full 3d subshell is lower in energy, so one electron moves from 4s. With charge 2, Cu²⁺ is **[Ar] 3d⁹** with 27 electrons.

## Where it is used

- **Chemistry classes.** Configurations, ions and trends are core topics, and the card shows the working behind each one.
- **Transition metal chemistry.** The number of d electrons in an ion decides its colour and magnetism. Pair the ion line with the [[electron-count-calculator|18-electron rule tool]] for metal complexes.
- **Lab work.** Atomic weights feed straight into molar mass and concentration sums.
- **Materials and batteries.** Electronegativity differences hint at whether a bond is ionic or covalent, which matters when choosing materials.
- **Data projects.** The CSV gives every element in one file for spreadsheet charts.

## Common mistakes

- **Removing 3d electrons first from transition metals.** Ions lose the outer 4s electrons before 3d. The ion line shows this.
- **Forgetting the exceptions.** Chromium and copper are the famous ones; the card flags every measured exception.
- **Mixing eV and kJ/mol.** They differ by a factor of about 96.5. Check the unit before comparing.
- **Expecting a value for every element.** Some noble gases and the heaviest elements have no electronegativity. Faded cells mean no value.
- **Treating predicted configurations as measured.** From rutherfordium on, the card says the configuration is predicted.

## Questions people ask

**Why does ionisation energy drop at the start of each period?** The new period starts a new, larger shell. The outer electron is further from the nucleus and better shielded, so it is easier to remove. The chart shows a sharp fall after each noble gas.

**What does "block" mean?** It is the type of subshell the last electrons go into: s, p, d or f. The blocks make the shape of the table.

**Why is the atomic weight in brackets for some elements?** Those elements have no stable isotope, so there is no fixed natural mixture to average. The bracket gives the mass number of the longest-lived isotope.

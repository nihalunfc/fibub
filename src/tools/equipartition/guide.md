---
name: Equipartition of energy and γ
num: 1349
shelf: learn
section: school-physics
title: "Equipartition of energy: degrees of freedom, Cv, Cp and γ for monatomic, diatomic and polyatomic gases"
summary: "Watch a helium atom, a nitrogen molecule, a CO₂ molecule and a water molecule move, turn and vibrate. Count their degrees of freedom, give each ½kT, and get the internal energy, Cv, Cp and γ with the numbers filled in; then mix two gases."
status: live
ads: false
order: 1349
icon: flask
works: offline
updated: 2026-11-09
related: [kinetic-theory, carnot-engine, gas-law-calculator, temperature-scales]
sources:
  - "Law of equipartition of energy: ½kT per quadratic degree of freedom; a vibration mode counts twice (kinetic and potential); 3N = translations + rotations + vibration modes; Cv = (f/2)R, Cp = Cv + R (Mayer's relation), γ = 1 + 2/f: standard kinetic theory."
  - "Gas constant R = 8.314462618 J/(mol K) (CODATA 2018)."
  - "Checked against hand counts and an independent Python calculation."
flow:
  - { icon: eye, label: "Molecule" }
  - { icon: calculator, label: "Count f" }
  - { icon: sigma, label: "Cv, Cp, γ" }
  - { icon: check, label: "Check" }
---

## What it does

Heat a gas and the energy goes into its molecules. A single atom can only store energy by **moving** (along x, y and z). A two-atom molecule can also **turn** end over end (two ways). A hot molecule can **vibrate** too, its atoms bouncing on the bond like masses on a spring. The **law of equipartition** says that, on average, every one of these independent ways (each **degree of freedom**, f) holds the same energy, **½kT** per molecule.

This page shows each molecule moving, turning and vibrating, counts its degrees of freedom, and works out from them the **internal energy U = (f/2) nRT**, the molar heat capacities **Cv = (f/2) R** and **Cp = Cv + R**, and their ratio **γ = 1 + 2/f**. A table puts all four molecules side by side, and a mixer finds Cv and γ for a blend of a one-atom and a two-atom gas.

It serves Class 11 Physics, Kinetic Theory (law of equipartition of energy, specific heat capacity of monatomic, diatomic and polyatomic gases) and Thermodynamics (Cp − Cv = R and the adiabatic exponent γ). Start from [[kinetic-theory]] to see where ½kT per direction comes from, and use γ in [[carnot-engine]] and in the gas laws in [[gas-law-calculator]].

## How to use it

1. Pick a molecule: **one atom** (helium, neon, argon), **two atoms** (nitrogen, oxygen), **three in a line** (carbon dioxide) or **bent** (water vapour).
2. Tick **Hot gas: count vibrations too** to unfreeze the vibrations. At room temperature they hardly take part for light molecules, so the box starts unticked.
3. **Temperature** and **amount** change the internal energy U. Cv, Cp and γ do not depend on them in this model.
4. In **Mix two gases**, type the moles of a one-atom gas and of a two-atom gas.

## Worked example

As the page opens, 1 mol of helium at 300 K: f = 3, so Cv = 3/2 × 8.314 = **12.47 J/(mol K)**, Cp = **20.79 J/(mol K)**, γ = 5/3 = **1.667**, and U = 3/2 × 1 × 8.314 × 300 = **3742 J**.

Nitrogen (rigid): f = 3 + 2 = 5, Cv = 5/2 R = 20.79, Cp = 7/2 R = 29.10, γ = 7/5 = 1.4. With the vibration counted, f = 7 and γ = 9/7 = 1.286.

Water vapour (rigid): f = 3 + 3 = 6, γ = 4/3. Carbon dioxide, hot: 3 + 2 + 4 × 2 = 13.

Mixing 1 mol of helium with 1 mol of nitrogen: Cv = (1.5 + 2.5) R / 2 = 2R, so γ = 3R / 2R = **1.5**.

## Check yourself

Five fresh questions: γ and Cv for a gas, the internal energy of a diatomic gas, γ of a mixture, and which gas has the largest γ. Answers are checked on the page and the working is shown. Nothing is saved.

## Tips

- Count f as 3 (moving) + rotations (0, 2 or 3) + 2 × each vibration you allow.
- A line of atoms (N₂, CO₂) has only 2 rotations; a bent molecule (H₂O) has 3.
- A molecule of N atoms has 3N ways in total. Take away the moving and turning ones and the rest are vibration modes.

## FAQ

**Why are vibrations "frozen" at room temperature?** Vibrations come in quantum steps that are big compared with kT at room temperature for light molecules, so they rarely get excited. Equipartition, a classical idea, cannot explain that; quantum physics does. As a gas gets hotter, γ slowly falls as the vibrations wake up.

**Why is Cp bigger than Cv?** At constant pressure the gas expands as it warms and does work pushing the surroundings back. That extra energy, R per mole per kelvin for an ideal gas, has to be supplied as heat.

**Do real gases follow this?** Noble gases match the one-atom values very closely, and air at room temperature has γ very close to 1.4. Heavier molecules and hot gases fall between the rigid and fully vibrating values.

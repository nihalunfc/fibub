---
name: Galvanic cell builder
num: 1089
shelf: learn
section: school-chemistry
title: "Galvanic cell simulator: Daniell cell, E°cell, electron and ion flow, ΔG = −nFE and the Nernst equation"
summary: "Pick two half-cells and see the cell work: which electrode is the anode, electrons moving through the wire, ions moving in the salt bridge and the voltmeter reading. E°cell, the cell reaction and notation, ΔG° = −nFE° and K, and sliders for the Nernst equation. Ends with fresh practice questions."
status: live
ads: false
order: 1089
icon: flask
works: offline
updated: 2026-11-09
related: [nernst-calculator, reactivity-series, oxidation-number]
sources:
  - "Standard reduction potentials (25 °C, 1 bar, against the standard hydrogen electrode): rounded values from the CRC Handbook electrochemical series and Bard, Parsons and Jordan, as in fibub's Nernst calculator."
  - "Faraday constant and gas constant: CODATA recommended values (NIST)."
flow:
  - { icon: flask, label: "Half-cells" }
  - { icon: pointer, label: "Electrons" }
  - { icon: calculator, label: "E° and ΔG" }
  - { icon: sliders, label: "Nernst" }
---

## What it does

A galvanic (voltaic) cell turns a redox reaction into electricity by keeping the two halves apart: oxidation in one beaker, reduction in the other, electrons travelling through a wire between them and ions moving through a salt bridge to keep each beaker neutral. This page builds one from two half-cells you choose.

- **The picture.** Two beakers, each with an electrode in a solution of its ions (or the standard hydrogen electrode, platinum in acid with hydrogen gas). The page marks the anode (−, where oxidation happens) and the cathode (+, where reduction happens). Electrons move through the wire from the anode to the cathode; in the salt bridge, negative ions drift towards the anode and positive ions towards the cathode. The voltmeter shows the cell voltage.
- **The numbers.** E°cell = E°cathode − E°anode, the balanced cell reaction, the cell notation (anode | anode ion ‖ cathode ion | cathode), the electrons transferred n, ΔG° = −nFE°cell and the equilibrium constant K.
- **Nernst.** Sliders set each ion's concentration from 0.001 M to 2 M. The cell voltage follows the Nernst equation, Ecell = E°cell − (0.0592 / n) log Q, with every number shown.

It follows Class 12 Chemistry (electrochemistry: galvanic cells, the Daniell cell, standard electrode potentials, the Nernst equation, equilibrium constant from the Nernst equation, and the relation between Gibbs energy and cell voltage). The order of the metals matches the [[reactivity-series]]; for any half-reaction, pH or temperature use the [[nernst-calculator]]; to see where the electrons come from, try the [[oxidation-number]] finder.

## How to use it

1. Choose the left and right half-cells. Each shows its standard reduction potential E°.
2. The page works out which is the anode: always the one with the lower E°, whatever side you put it on.
3. Read E°cell, the reaction and ΔG°.
4. Move the concentration sliders and watch the voltage change.

## Worked example: the Daniell cell

Pick zinc on the left and copper on the right. Zinc (E° = −0.76 V) is lower than copper (+0.34 V), so zinc is the anode and copper the cathode.

- Anode: Zn → Zn²⁺ + 2e⁻. Cathode: Cu²⁺ + 2e⁻ → Cu.
- Cell reaction: Zn(s) + Cu²⁺(aq) → Zn²⁺(aq) + Cu(s), with n = 2.
- E°cell = 0.342 − (−0.762) = 1.104 V; the voltmeter reads 1.10.
- ΔG° = −2 × 96 485 × 1.104 J/mol = −213.0 kJ/mol: the reaction is spontaneous.
- K = 10^37.3, so the reaction goes essentially to completion.

Now set [Cu²⁺] to 0.01 M with [Zn²⁺] at 1 M. Q = [Zn²⁺]/[Cu²⁺] = 100, so Ecell = 1.104 − (0.0592 / 2) × 2 = 1.045 V. Less copper ion to take electrons means a lower voltage.

## Tips

- A positive E°cell means the cell works as drawn; the page always puts the anode where E° is lower, so E°cell is always positive here.
- The zinc electrode gets thinner and the copper one thicker as the cell runs.
- The salt bridge is usually a gel or paper soaked in KNO₃ or KCl. Without it, charge builds up and the current stops.

## FAQ

**Why are the potentials slightly different from my book?** Books round them differently (for example −0.76 or −0.763 V for zinc). The page uses rounded handbook values.

**Is anything saved?** No. Everything runs in your browser and nothing is stored or sent.

**Is this an official textbook tool?** No. It is an independent practice page that follows the same school topics.

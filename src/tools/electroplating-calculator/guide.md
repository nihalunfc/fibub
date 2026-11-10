---
name: Electroplating
num: 97
shelf: science
section: electrochemistry-and-battery-science
title: "Electroplating"
summary: "Plating thickness from current, time and area, or the time or current needed for a thickness, for copper, nickel, zinc, chrome, silver, gold, tin and more (or your own metal), with current efficiency, current density in A/dm² and ASF, plating rate, mass and charge. Also gas volumes from electrolysis of water or brine."
status: live
ads: true
order: 3
icon: ruler
works: offline
updated: 2026-11-08
related: [nernst-calculator, cyclic-voltammetry, molar-mass-calculator, gas-law-calculator]
sources:
  - "Atomic weights: IUPAC/CIAAW standard atomic weights (abridged values)."
  - "Metal densities: CRC Handbook room-temperature values."
  - "Physical constants: CODATA recommended values (NIST)."
flow:
  - { icon: flask, label: "Metal" }
  - { icon: sliders, label: "Current" }
  - { icon: clock, label: "Time" }
  - { icon: ruler, label: "Thickness" }
---

## What it does

Every electron that passes through a plating bath can reduce part of one metal ion. Michael Faraday turned that into two laws, and they are all you need to plan a plating job:

m = I · t · M · η / (n · F)

where I is the current, t the time, M the molar mass, n the number of electrons per atom (2 for Cu²⁺ and Ni²⁺, 1 for silver and gold from cyanide baths, 6 for chromium from chromic acid), F = 96,485 C/mol is the Faraday constant, and η is the current efficiency, the share of the current that actually deposits metal rather than making hydrogen. Dividing the mass by the density and the area gives the average thickness.

The tool works out whichever of these you need:

- **Thickness** from current, time and area.
- **Time** to reach a thickness at a given current.
- **Current** to reach a thickness in a given time, also shown as current density.

Alongside the answer it shows the mass deposited, the current density in A/dm², mA/cm² and A/ft² (ASF, common in North American shops), the plating rate in µm per hour, and the charge in coulombs and amp-hours. A plot shows the thickness building up over time.

Choose hydrogen, oxygen or chlorine instead of a metal to get the volume of gas from electrolysis at any temperature and pressure.

For the potential a cell needs, use the [[nernst-calculator]]; for how fast the plated metal corrodes later, the [[tafel-corrosion-rate|Tafel corrosion rate]] tool.

## How to use it

1. Pick the metal. For one that is not listed, choose "Your own metal" and type the electrons per atom, molar mass and density.
2. Pick what you want to find: thickness, time or current.
3. Type the area being plated (both sides of a panel count), the current, the time or the thickness wanted, and the current efficiency. Typical efficiencies: acid copper and Watts nickel 95–98 %, zinc 80–95 %, hard chrome 10–25 % (the tool sets 15 % when you choose chromium).
4. Read the answer and download a report if you need one.

## Worked example: nickel on a 100 cm² part

A Watts nickel bath at 2 A over 100 cm² (2 A/dm²) and 95 % efficiency:

- Plating rate = j · M · η / (n · F · ρ) = 0.02 × 58.693 × 0.95 / (2 × 96,485 × 8.908) cm/s, which is **23.4 µm per hour**.
- For 25 µm the tool gives **64.2 minutes**.
- In one hour you get 23.4 µm, or 2.08 g of nickel, for 7,200 C (2 A·h) of charge.

For copper at 2 A/dm² and 100 %, the rate is 26.5 µm/h, close to the familiar rule of thumb of about 0.2 µm per minute per A/dm².

## Questions

**Why is my real deposit thinner or uneven?** The answer is an average. Current crowds onto edges and points, so they plate thicker, while holes and recesses plate thinner. Measure critical areas, and use the real efficiency of your bath.

**What area should I use?** The whole surface being plated, including the back and edges if they are in the bath. Getting the area wrong is the most common cause of a wrong current setting.

**How much gas does electrolysis of water give?** One amp for one hour makes 0.0187 mol of hydrogen, 462 mL at 25 °C and 1 bar, and half that volume of oxygen.

**Is anything sent anywhere?** No. It all runs in your browser and works offline once the page has loaded.

---
name: Osmosis lab
num: 1121
shelf: learn
code: L55
section: school-biology
title: "Osmosis lab: potato, raisin and cells in hypotonic, isotonic and hypertonic solutions"
summary: "Drop a potato piece, a raisin, an onion cell or a red blood cell into sugar or salt water and watch water move in or out. See plasmolysis, a % mass change graph, water potential at Class 11 level, a virtual practical and quick questions."
status: live
ads: false
order: 1121
icon: flask
works: offline
updated: 2026-11-16
related: [diffusion-calculator, colligative-properties, osmolarity-calculator]
sources:
  - "Water potential ψ = ψs + ψp and ψs = −iCRT (van 't Hoff), with R = 8.314462618 J/(mol·K) (CODATA 2018). Written by fibub from these standard formulas."
  - "The cell sap strengths, wall stiffness and soaking times are made-up round numbers chosen so the model behaves like a school practical; they are not measurements of real potatoes, raisins or cells."
  - "Equilibrium sizes were checked in the tests against a separate Python solution of ψ cell = ψ outside (bisection, numpy 2.5)."
  - "Drawings are fibub's own simple shapes. Nothing you enter is stored or sent anywhere."
flow:
  - { icon: flask, label: "Solution" }
  - { icon: eye, label: "Watch" }
  - { icon: chart, label: "Graph" }
  - { icon: check, label: "Check" }
---

## What it does

Osmosis is water moving through a membrane that lets water pass but holds back dissolved sugar or salt. Water moves from the side with more free water (a weaker solution) to the side with less (a stronger solution). This lab lets you put four things into sugar or salt water and see what happens:

- **Potato piece** and **raisin**: they gain or lose mass, like the practical many schools do.
- **Onion peel cell**: a plant cell under the microscope, where you can see **plasmolysis**: the inside of the cell shrinks and pulls away from the wall.
- **Red blood cell**: an animal cell with no wall, so in plain water it swells and bursts, and in strong salt it shrinks and crinkles.

The picture shows the beaker, an arrow for the way water moves and one cell zoomed in. It fits **Class 9 Science: the fundamental unit of life** (cell membrane, cell wall, osmosis, plasmolysis) and **Class 11 Biology: cell, the unit of life**, with water potential (ψ) at the Class 11 level. This is a teaching model with made-up round numbers, not real measurements. To go further, see [[diffusion-calculator]] for how fast things spread, [[colligative-properties]] for osmotic pressure in chemistry and [[osmolarity-calculator]] for counting dissolved particles.

## Solve your own numbers

The card at the top takes the numbers from your question and answers in one sentence, with the working underneath. Choose what to find:

- **Osmotic pressure π.** Pick the solute (sugar or glucose i = 1, salt i = 2, CaCl₂ i = 3, or type your own i), the concentration and the temperature (°C or K) for π = iCRT. The answer is in MPa with bar, atm and kPa beside it.
- **Concentration from π.** The same formula the other way round, with π typed in MPa, kPa, Pa, bar or atm.
- **Water potential ψ.** ψs = −iCRT, then ψ = ψs + ψp, with the pressure potential ψp optional.
- **Which way does water move?** Type the water potential of A and B (units can differ, for example MPa and bar); water moves from the higher (less negative) to the lower.
- **% change in mass.** Type the mass before and after (g or mg) and read the percentage change with the words hypotonic, isotonic or hypertonic.
- **Isotonic concentration from 2 readings.** Type the % change at two concentrations, one gain and one loss, and the card reads off where the straight line crosses 0.

Seven worked-example presets fill the card, for example 0.5 mol/L sugar at 25 °C gives about 1.24 MPa and 0.15 mol/L salt at 37 °C about 0.774 MPa. Blank, negative or impossible entries (a temperature below absolute zero, two readings on the same side of zero) give a friendly message. Common mistakes: using °C in RT, forgetting i for salt, and dividing by the final mass instead of the starting mass. R = 0.008314 MPa·L/(mol·K) is the CODATA value. For other solutions use the [[colligative-properties]] calculator.

## How to use it

1. **Pick the level.** *Class 9* shows the words hypotonic, isotonic and hypertonic and the % change sum. *Class 11* adds solute potential (ψs), pressure potential (ψp, the wall pushing back) and the cell's water potential ψ, in megapascals (MPa).
2. **Pick what goes in** and **what is dissolved**. Salt counts about double, because each unit of salt splits into two particles (Na⁺ and Cl⁻) and osmosis depends on the number of particles.
3. **Slide the concentration.** The quick buttons jump to plain water, the strength that matches the cell (isotonic) and a strong 1 M solution.
4. **Slide the time** or press **Play from the start** to watch the cell change. A potato takes about an hour, an onion cell a few minutes and a red blood cell a few seconds.
5. Read the **graph** of % change against concentration. Press **Run the practical** for six pieces in six solutions with slightly messy readings, as in a real lab, and download them as a CSV file.
6. Try the **Check yourself** questions. Each press of *New questions* makes fresh numbers, and *Check answers* shows the working.

## What the words mean

- **Hypotonic**: the solution outside is weaker than the cell sap. Water moves in. Plant cells become firm (**turgid**), animal cells swell and may burst.
- **Isotonic**: the same strength. Water moves in and out at the same rate, so nothing changes overall. Plant cells are soft (**flaccid**).
- **Hypertonic**: the solution outside is stronger. Water moves out. Plant cells **plasmolyse**, animal cells shrink (**crenation**).

## Worked example

Start with the potato in plain water, time at the end. The page shows **Hypotonic: water moves in** and an end change of **+8.0 %**: a 2.50 g piece becomes about 2.70 g, so % change = (2.70 − 2.50) ÷ 2.50 × 100 = +8.0 %. Press *Same as the cell*: the slider jumps to 0.30 M sugar and the change is **0.0 %**. Switch to salt and press it again: 0.15 M salt is enough, because salt makes two particles. At Class 11 level, 1 M sugar gives ψs = −1 × 1 × 0.008314 × 298.15 = **−2.479 MPa** outside, far below the potato's −0.74 MPa, so water rushes out and the piece loses 35 %.

## Tips

- In the practical, the point where your line crosses zero estimates the strength of the cell sap. Real school results are often 0.2 to 0.4 M sugar for potato.
- Blot pieces dry before weighing in a real lab; extra water on the surface makes the gain look bigger.
- A plant cell does not burst because its wall pushes back: in the model that push is ψp, and it stops water coming in once ψ inside equals ψ outside.

## FAQ

**Which way does water move in osmosis?** From the region with the higher water potential (weaker solution, less negative ψ) to the lower (stronger solution, more negative ψ).

**Why does the potato only gain 8 % in plain water but lose 35 % in strong sugar?** The wall stops it swelling much, but nothing stops it shrinking.

**Is the raisin really a plant cell?** A raisin is a dried grape full of sugar, so it is many plant cells with very strong sap. It swells a lot in water and takes hours.

**Are these real numbers?** No. They are round teaching values. Use your own lab results for a report.

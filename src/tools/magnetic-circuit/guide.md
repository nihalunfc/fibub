---
name: Magnetic circuit solver
num: 914
shelf: science
section: electromagnetism
title: "Magnetic circuit calculator: reluctance, flux, air gap field, inductance and force for cores and gaps"
summary: "Describe a core as segments of iron or ferrite and air gaps, in one loop or as a three-leg core, and get the reluctance of each part, the flux and flux density everywhere, the inductance, the stored energy, the pull across a gap and the current needed for a target gap field."
status: live
ads: true
order: 6
icon: compass
works: offline
updated: 2026-11-09
related: [capacitor-inductor-calculator, coil-field-designer]
sources:
  - "Magnetic circuit analysis (reluctance l/μA, Hopkinson's law, flux division between parallel legs), inductance N²/ℜ, stored energy and the Maxwell-stress pull B²A/2μ₀: standard results, for example Hughes' Electrical and Electronic Technology and Fitzgerald, Kingsley and Umans, Electric Machinery."
  - "The fringing allowance (√A + g)² is a common first approximation for square poles, not an exact result."
  - "μ₀ = 1.25663706127 × 10⁻⁶ N/A² (CODATA 2022). The saturation value offered is a rounded example; no material data tables are used."
  - "Checked against an exact SymPy (rational arithmetic) solution of the same circuits and against Ampère's law and flux conservation, written for the tests. The example cores are made up."
flow:
  - { icon: pencil, label: "Segments" }
  - { icon: sliders, label: "Coil" }
  - { icon: calculator, label: "Flux" }
  - { icon: target, label: "Gap field" }
---

## What it does

A coil wound on an iron or ferrite core drives magnetic flux round the core much as a battery drives current round a circuit. The **magnetomotive force** N I (ampere-turns) plays the part of voltage, flux Φ plays the part of current, and each part of the core has a **reluctance** ℜ = l/(μ₀ μr A), like a resistor. An air gap, with μr = 1, has thousands of times the reluctance of the same length of iron, so even a 1 mm gap usually decides how much flux flows.

This solver adds up the reluctances of the segments you list, solves the circuit and gives:

- the total reluctance, the **flux** and the **flux density B** and field strength H in every segment;
- the **inductance** N²/ℜ, the A_L value and the **stored energy** (and how much of it sits in the gaps);
- the **pull** across a gap, B²A/2μ₀, as in an electromagnet or relay;
- the **current** needed for a target flux density in the gap;
- a warning when any core segment goes past the saturation value you set.

It handles a single loop, or a **three-leg core** (like an E-core or a transformer core) with the coil on the centre leg and two return legs that share the flux.

## How to use it

1. Pick a starting core or type your own. Each line is one segment: `core length area μr` or `gap length area`, lengths in mm along the middle of the core, areas in mm².
2. For a three-leg core, put the coil leg (with its gap, if any) in the first box and the two outer legs in the return boxes. Leave the return boxes empty for a single loop.
3. Give the turns and current, the saturation value of your core material, and optionally a target B in the gap.
4. Tick **fringing** to let the gap flux spread over a slightly larger area, which lowers the gap reluctance a little.

## Worked example

A made-up ring core with a 300 mm mean path, a 20 × 20 mm (400 mm²) section, μr 2000 and a 1 mm gap, wound with 500 turns carrying 2 A. The core's reluctance is 298 k A-t/Wb and the gap's 1.99 M A-t/Wb, so the gap uses **87 %** of the 1000 ampere-turns. The page shows **Φ = 437.1 µWb, B = 1.093 T in the gap**, an inductance of **109.3 mH**, 218.5 mJ stored (87 % of it in the gap) and a pull of 190 N across the gap. For 0.8 T in the gap you would need 1.464 A. Ticking fringing lowers the gap field to 1.078 T, spread over 441 mm².

## Tips

- Gaps are added to inductors on purpose: they store the energy, keep L steady as μr varies and stop the core saturating.
- Because the gap dominates, doubling μr of the core barely changes L once there is a gap.
- In a three-leg core with equal outer legs, each carries half the centre-leg flux, so the outer legs can have half the area.

## FAQ

**Does it model saturation?** No: μr is constant. It warns when a core segment passes the saturation value you give; above that the real flux is lower than shown.

**Why is my real inductance a bit higher?** Some flux leaks around the coil without following the core, and fringing at gaps widens their effective area. Tick fringing for a better estimate.

**Is anything uploaded?** No. Everything is worked out in your browser.

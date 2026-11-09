---
name: Real gas calculator
num: 916
shelf: science
section: thermodynamics-and-statistical-physics
title: "Real gas calculator: compressibility factor Z from van der Waals, Redlich-Kwong, Soave and Peng-Robinson"
summary: "Compare the ideal gas law with four cubic equations of state for any gas: compressibility factor Z, molar volume, density and fugacity side by side, the saturation pressure each equation predicts, and charts of Z against pressure, the P-V isotherm and a generalised Z chart."
status: live
ads: true
order: 1
icon: curve
works: offline
updated: 2026-11-09
related: [gas-law-calculator, phase-diagram-calculator, vapour-pressure-calculator, thermochemistry-calculator]
sources:
  - "van der Waals (1873); Redlich, O. and Kwong, J. N. S. (1949), Chemical Reviews 44, 233; Soave, G. (1972), Chemical Engineering Science 27, 1197; Peng, D.-Y. and Robinson, D. B. (1976), Industrial and Engineering Chemistry Fundamentals 15, 59: the equations and their standard constants, as given in thermodynamics textbooks."
  - "Critical temperatures, pressures and acentric factors: rounded general values for common gases, editable on the page."
  - "Gas constant R: CODATA (exact since 2019)."
  - "Checked against an independent NumPy/SciPy solution written for the tests (polynomial roots in volume, fugacity by integrating the residual Helmholtz energy, saturation pressure by Brent's method)."
  - "The example state is made up."
flow:
  - { icon: flask, label: "Gas" }
  - { icon: sliders, label: "T and P" }
  - { icon: table, label: "Compare Z" }
  - { icon: chart, label: "Charts" }
---

## What it does

The ideal gas law, PV = nRT, assumes molecules have no size and do not attract each other. Real molecules do both, and the **compressibility factor** Z = PV/(nRT) measures the result: Z = 1 for an ideal gas, Z below 1 when attraction pulls the gas into a smaller volume, and Z above 1 when the molecules' own size pushes it out.

This calculator works out Z with four classic **cubic equations of state** and the ideal gas law side by side, so you can see how much they agree:

- **van der Waals** (1873): the first real-gas equation, good for ideas, rough for numbers.
- **Redlich-Kwong** (1949): a temperature-dependent attraction term; much better for gases.
- **Soave-Redlich-Kwong** and **Peng-Robinson**: add the **acentric factor ω** so they also fit vapour pressures. They are the workhorses of chemical engineering; Peng-Robinson gives better liquid densities.

All four need only the gas's **critical temperature, critical pressure** and (for the last two) **ω**. The plain van der Waals answer with tabulated constants is in the [gas law calculator](/science/gas-law-calculator/); this tool is for comparing equations and drawing Z charts.

## How to use it

1. Pick a **gas**. Its critical point, ω and molar mass fill in (rounded values). For anything else, type the constants yourself.
2. Give the **temperature** (K, °C or °F) and **pressure** (bar, MPa, kPa, atm or psi).
3. Choose which **equation** the isotherm and generalised charts use.

The results show Z, molar volume, density and fugacity for the chosen equation, a table for every equation, and three charts: **Z against pressure** for all equations at your temperature, the **P-V isotherm** (with the van der Waals loop and the saturation line below the critical temperature), and a **generalised compressibility chart** of Z against reduced pressure for several reduced temperatures. A CSV of the Z curves is one click away, and the whole report downloads as an image, PDF or Word file.

## Worked example

Carbon dioxide at **300 K and 50 bar** (the made-up example). The ideal gas law gives 0.499 L/mol. Peng-Robinson gives **Z = 0.6712**, so the gas fills only 67 % of that: 0.3348 L/mol, a density of 131.4 kg/m³ and a fugacity of 37.33 bar (φ = 0.7466). The other equations agree within a few per cent: van der Waals 0.7315, Redlich-Kwong 0.6974, Soave 0.6947. At 300 K CO₂ is just below its critical temperature (Tr = 0.9865), and Peng-Robinson puts its saturation pressure at **67.33 bar**, so at 50 bar it is a vapour. Raise the pressure to 80 bar and Z drops to 0.2047: the gas has condensed to a liquid.

## Tips

- **Saturation pressure** comes from the equal-fugacity rule (Maxwell's equal areas on the isotherm). Peng-Robinson and Soave usually land within a few per cent of measured vapour pressures; van der Waals is far off.
- Near the **critical point** all cubic equations are least accurate, and very close to it the two roots cannot be told apart.
- The generalised chart shows the **law of corresponding states**: different gases at the same Tr and Pr have similar Z.

## FAQ

**Which equation should I trust?** For gases away from condensation, all except van der Waals agree within a few per cent. For vapour pressures and liquids, use Peng-Robinson or Soave.

**Why are there several roots?** Below the critical temperature the cubic can have a liquid-like and a vapour-like root at the same pressure. The calculator shows both and uses the one with the lower Gibbs energy.

**Is this good for design?** It is a sound first estimate, for study and planning, not a substitute for measured data or professional judgement.

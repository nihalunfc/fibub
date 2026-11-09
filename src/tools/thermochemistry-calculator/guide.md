---
name: Thermochemistry calculator
num: 95
shelf: science
section: physical-chemistry
title: "Thermochemistry calculator: ΔH, ΔS, ΔG and K of a reaction from standard formation values"
summary: "Type a balanced reaction and get its standard enthalpy, entropy and Gibbs energy change, the equilibrium constant, ΔG and K at other temperatures, and the temperature where the reaction turns spontaneous. Values for 38 common substances fill in by themselves; type your own for anything else."
status: live
ads: true
order: 8
icon: flask
works: offline
updated: 2026-11-08
related: [equilibrium-solver, gas-law-calculator, equation-balancer, colligative-properties]
sources:
  - "Atomic weights: IUPAC/CIAAW standard atomic weights (abridged values)."
  - "Standard formation values (ΔfH°, S°, ΔfG°) for 38 substances: NIST Chemistry WebBook and CRC Handbook values at 298.15 K, which you can type over."
flow:
  - { icon: pencil, label: "Reaction" }
  - { icon: table, label: "Values" }
  - { icon: sigma, label: "ΔH ΔS ΔG" }
  - { icon: chart, label: "ΔG vs T" }
---

## What it does

Whether a reaction gives out heat, whether it goes by itself and how far it goes all follow from three numbers per substance: the standard enthalpy of formation ΔfH°, the standard entropy S° and the standard Gibbs energy of formation ΔfG°. This tool adds them up for you using Hess's law.

- **ΔrH°** = Σ ν ΔfH°(products) − Σ ν ΔfH°(reactants). Negative means exothermic (heat given out).
- **ΔrS°** = Σ ν S°(products) − Σ ν S°(reactants), in J/(mol·K). Positive usually means more gas on the product side.
- **ΔrG°** at 298.15 K from the ΔfG° values when every species has one, otherwise from ΔH° − TΔS°. Negative means the reaction goes forward as written under standard conditions.
- **K** = exp(−ΔG°/RT), the equilibrium constant, and whether products or reactants are favoured.
- **ΔG and K at your temperature**, with ΔH° and ΔS° kept constant.
- **The turnover temperature** T = ΔH°/ΔS°, where ΔG changes sign, and which side of it is spontaneous.
- A **plot of ΔG° against temperature**, with zero, the turnover point and your temperature marked.

To turn ΔG into an equilibrium constant and back, use the [[equilibrium-solver]]; balance the reaction first with the [[equation-balancer]].

## How to use it

1. Type the balanced reaction with state symbols, such as `CaCO3(s) → CaO(s) + CO2(g)`. Use `→`, `->` or `=` for the arrow. Coefficients can be whole numbers, decimals or fractions such as `1/2O2(g)`.
2. The table below fills in values for any substance in the built-in table. Water appears twice, as liquid and vapour, so the state symbol matters. For anything not in the table, type ΔfH° (kJ/mol), S° (J/(mol·K)) and, if you have it, ΔfG° (kJ/mol). You can also overwrite any value.
3. Set the temperature in kelvin if you want ΔG and K somewhere other than 25 °C.
4. Read the headline and facts, check the plot, and download a PNG, PDF or Word report if you need one.

If the elements on the two sides do not match, a warning names them, so you can fix the coefficients (the equation balancer can do this for you).

## Worked example: burning methane

CH₄(g) + 2O₂(g) → CO₂(g) + 2H₂O(l).

- ΔrH° = −393.51 + 2(−285.83) − (−74.6) − 0 = **−890.6 kJ/mol**, strongly exothermic: this is the heat of combustion of natural gas.
- ΔrS° = 213.79 + 2(69.95) − 186.3 − 2(205.15) = **−242.9 J/(mol·K)**: three moles of gas become one, and the water is liquid.
- ΔrG° = −394.37 + 2(−237.14) − (−50.5) = **−818.2 kJ/mol**, so K is about 10¹⁴³: the reaction goes to completion.
- Since ΔH and ΔS are both negative, ΔG turns positive above ΔH/ΔS ≈ 3670 K, far above any real flame, and only in the constant-ΔH approximation.

For the decomposition of limestone, CaCO₃(s) → CaO(s) + CO₂(g), ΔH° = +179.2 kJ/mol and ΔS° = +160.2 J/(mol·K). It is not spontaneous at room temperature, but turns over at about 1119 K (845 °C), which is why lime kilns run at around 900 °C.

## Questions

**Why are the elements zero?** ΔfH° and ΔfG° of an element in its standard state (O₂ gas, graphite, iron metal) are zero by definition. Their entropy is not zero, because S° is an absolute value.

**Why does my answer differ slightly from my textbook?** Tables differ in the last digit or two, and older ones use 1 atm instead of 1 bar. The built-in values come from the CRC Handbook and NIST at 298.15 K and 1 bar. Overwrite them with your textbook's numbers if you need to match exactly.

**How accurate is ΔG at other temperatures?** The tool assumes ΔH° and ΔS° do not change with temperature. That is good to a few kJ/mol over a few hundred kelvin, but not across a phase change: if water boils on the way, use the vapour values.

**Does spontaneous mean fast?** No. A negative ΔG says the reaction can go, not how quickly. Methane and air sit together for years until a spark starts the reaction.

**Is anything sent anywhere?** No. Everything runs in your browser and works offline once the page has loaded.

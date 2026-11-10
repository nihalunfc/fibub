---
name: Gas law calculator
num: 83
shelf: science
code: T83
section: physical-chemistry
title: "Gas law calculator: PV = nRT, combined gas law and van der Waals real gases"
summary: "Work out pressure, volume, amount or temperature of a gas in any units, with the mass and density of a named gas, the van der Waals real-gas answer and how far the ideal gas law is off."
status: live
ads: true
order: 6
icon: calculator
works: offline
updated: 2026-11-08
related: [molar-mass-calculator, equation-balancer, psychrometric-calculator, solution-calculator, reaction-kinetics-fitter]
sources:
  - "Atomic weights: IUPAC/CIAAW standard atomic weights (abridged values)."
  - "van der Waals constants: common values for 13 gases from the CRC Handbook, which you can type over."
  - "Physical constants: CODATA recommended values (NIST)."
flow:
  - { icon: pencil, label: "3 values" }
  - { icon: calculator, label: "PV = nRT" }
  - { icon: check, label: "Real gas" }
---

## What it does

The ideal gas law, PV = nRT, links the pressure, volume, amount and temperature of a gas. It holds well for most gases at everyday conditions and is the basis of gas stoichiometry. This calculator solves it in whatever units you have, and checks how far a real gas departs from it.

- **Solve for any one quantity.** Give three of pressure, volume, amount and temperature, and leave the fourth empty. Pressure works in Pa, kPa, bar, atm, mmHg, torr or psi; volume in L, mL, m³, cm³, cubic feet or US gallons; temperature in °C, K or °F.
- **Grams instead of moles.** Choose the gas, or type any formula, to give or get the amount as a mass. You also get the gas's density.
- **Real gases.** For 13 common gases the tool also solves the **van der Waals** equation, (P + an²/V²)(V − nb) = nRT, with constants from the CRC Handbook. It shows the compressibility factor Z = PV/nRT and how far off the ideal answer is.
- **Critical point.** When the gas is below its critical temperature, the tool says that enough pressure would liquefy it.
- **Change of state.** The combined gas law, P₁V₁/T₁ = P₂V₂/T₂, finds the new pressure, volume or temperature when a fixed amount of gas is compressed, heated or cooled.

For moist air and dew point, use the [[psychrometric-calculator]]; to convert a gas reading between ppm and µg/m³, the [[air-quality-calculator]].

## How to use it

1. Type three of the four values and choose their units. Leave the one you want empty.
2. Choose the gas if you know it. "Any gas (ideal)" works for everything except grams.
3. Read the answer, its value in other units, the density and the real-gas check.
4. For a change of state, fill in the start and two of the end values below.

## Worked examples

**Molar volume.** 1 mol of nitrogen at 0 °C and 101.325 kPa (1 atm) takes up 1 × 8.314 × 273.15 ÷ 101,325 = 22.414 L. At the newer IUPAC standard of 1 bar it is 22.711 L, and at 25 °C and 1 bar it is 24.790 L.

**Real gas.** Squeeze 1 mol of carbon dioxide into 1.00 L at 27 °C (300 K). The ideal gas law says 24.9 bar. The van der Waals equation, with a = 3.640 L²·bar/mol² and b = 0.04267 L/mol, gives 22.4 bar: the molecules attract one another, so they hit the walls less hard. The ideal answer is 11 % too high. CO₂'s van der Waals critical temperature is 304 K (31 °C), close to the measured 304.1 K, so at 27 °C it would liquefy under enough pressure.

**Change of state.** 2.0 L of gas at 1 atm and 25 °C is heated to 100 °C and its pressure doubled. V₂ = 2.0 × (1/2) × (373.15/298.15) = 1.25 L. Always convert temperatures to kelvin first, which the tool does for you.

## Questions

**When is the ideal gas law good enough?** At pressures near 1 atm and temperatures well above the boiling point, the error is usually under 1 %. It grows at high pressure, at low temperature and for gases with strong attractions, such as ammonia, water vapour and CO₂.

**Where do the van der Waals constants come from?** The CRC Handbook of Chemistry and Physics. The equation is a simple model, good to a few percent at moderate pressures. Near condensation even it is only approximate; check measured data for precise work.

**Is anything sent anywhere?** No, it all runs in your browser.

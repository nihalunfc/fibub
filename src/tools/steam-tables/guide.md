---
name: Steam tables and Rankine cycle
num: 661
shelf: science
section: thermal-and-fluid-engineering
title: "Steam tables calculator (IAPWS-IF97) and Rankine cycle efficiency with a T-s diagram"
summary: "Look up water and steam properties from pressure and temperature, saturation by pressure or temperature, or from pressure with enthalpy, entropy or quality, using the IAPWS-IF97 industrial formulation. Then work out a simple or reheat Rankine power cycle: turbine and pump work, heat in, thermal efficiency, exit quality, steam rate and a temperature-entropy diagram."
status: live
ads: true
order: 661
icon: chart
works: offline
updated: 2026-11-09
related: [pipe-network-solver, thermochemistry-calculator, psychrometric-calculator, gas-law-calculator, pump-system-curve, hvac-room-load, heat-engine-cycles, heat-exchanger-sizing, real-gas-calculator]
sources:
  - "IAPWS (2007), Revised Release on the IAPWS Industrial Formulation 1997 for the Thermodynamic Properties of Water and Steam (IAPWS-IF97), International Association for the Properties of Water and Steam, www.iapws.org. Equations and coefficients of regions 1, 2, 3 and 4 and the B23 boundary are used as published in the release, a public international standard formulation."
  - "Rankine cycle analysis with isentropic efficiencies: standard engineering thermodynamics, for example Çengel and Boles, Thermodynamics: An Engineering Approach (method only)."
  - "Checked against the verification values printed in the IAPWS-IF97 release and against the Python iapws package (IAPWS97) at about 100 points and five cycles. The example cycle is made up."
flow:
  - { icon: target, label: "State" }
  - { icon: table, label: "Properties" }
  - { icon: curve, label: "Cycle" }
  - { icon: chart, label: "T-s plot" }
---

## What it does

This is a steam table you never have to interpolate in. It works out the properties of water and steam from the **IAPWS-IF97** formulation, the international standard used by power plant and boiler engineers, and then uses them to analyse a **Rankine cycle**, the cycle behind coal, gas, nuclear, solar-thermal and geothermal steam power stations.

**Properties.** Choose what you know:

- **Pressure and temperature** for compressed liquid, superheated steam or supercritical fluid.
- **Saturation at a pressure** or **at a temperature**: the boiling point, and side by side the liquid and vapour volume, enthalpy, internal energy and entropy, plus the heat of evaporation.
- **Pressure and enthalpy**, **pressure and entropy** or **pressure and quality**, which tell you whether a state is wet steam (and how wet) or superheated, as you need after a turbine or a throttle valve.

You get specific volume, density, enthalpy, internal energy, entropy, cp, cv and the speed of sound, the IF97 region used, and the superheat or subcooling.

**Rankine cycle.** Give the boiler pressure, turbine inlet temperature, condenser pressure and the turbine and pump efficiencies. The tool follows the water round: pump (1 to 2), boiler (2 to 3), turbine (3 to 4) and condenser (back to 1), with an optional **reheat** stage. It reports the net work, heat in and out, thermal efficiency, back work ratio, turbine exit quality, steam rate, the Carnot limit and the steam flow for a given power, with a T-s diagram and a table of states.

Use the properties in a power cycle with [[heat-engine-cycles|heat engine cycles]], or size a heater with the [[heat-exchanger-sizing|heat exchanger sizing tool]].

## How to use it

1. Pick the pressure unit: kPa, bar or MPa (1 MPa = 10 bar = 1,000 kPa). Temperatures are in °C.
2. Choose what you know and type the values. The answer updates as you type.
3. For the cycle, set the efficiencies to 100 % to see the ideal cycle, then lower them to see what real machines lose.
4. Tick **Reheat** and give the reheat pressure and temperature to see how reheating dries the turbine exhaust.

## Worked example

**Superheated steam at 10 MPa and 500 °C:** h = 3375.1 kJ/kg, s = 6.5993 kJ/kg·K, v = 0.032813 m³/kg. Water boils at 311.0 °C at this pressure, so the steam has 189 K of superheat.

**Rankine cycle (made-up plant):** boiler 10 MPa, turbine inlet 550 °C, condenser 10 kPa (0.01 MPa, boiling at 45.81 °C), turbine 85 %, pump 75 %. The turbine gives 1157.3 kJ/kg and the pump takes 13.43 kJ/kg, so the net work is 1143.9 kJ/kg from 3296.7 kJ/kg of heat: a **thermal efficiency of 34.70 %**, against a Carnot limit of 61.25 %. The exhaust has a quality of 0.9000 (10 % moisture). The steam rate is 3.147 kg/kWh, so a 100 MW plant needs 87.42 kg/s of steam. Add reheat at 2 MPa back to 550 °C and the efficiency rises to 36.98 % with nearly dry exhaust (quality 0.997).

## Tips

- The reference state is the IF97 one: liquid water at the triple point has zero internal energy and entropy, so values match printed steam tables.
- Very close to the critical point (373.946 °C, 22.064 MPa) properties change fast and IF97 is least certain; treat the last digit with care there.
- Region 5 (above 800 °C) is not included.

## FAQ

**Why IF97 and not IAPWS-95?** IF97 is the industrial standard: fast, and within a fraction of a percent of the scientific IAPWS-95 formulation, which it was fitted to.

**Is this good enough for design?** It is for study and planning, not a substitute for professional judgement. The cycle ignores pressure drops, heat losses and feedwater heaters.

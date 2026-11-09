---
name: Engineering unit converter
num: 692
shelf: science
section: metrology-and-quality
title: "Engineering unit converter: SI and imperial units, pressure, energy, flow, viscosity, with a free-form expression converter"
summary: "Convert between SI, metric and US/imperial units for length, area, volume, mass, force, pressure, energy, power, temperature, flow, viscosity, density, torque, heat transfer and more, or type any expression such as 3 kN*m to lbf*ft and get the answer with a dimension check that catches impossible conversions."
status: live
ads: true
order: 692
icon: ruler
works: offline
updated: 2026-11-09
related: [uncertainty-calculator, pvt-correlations, gas-law-calculator, psychrometric-calculator]
sources:
  - "SI units and prefixes: BIPM, The International System of Units (SI brochure, 9th edition). Inch, foot, yard, mile and pound: the 1959 international yard and pound agreement. US gallon (231 cubic inches) and imperial gallon (4.54609 litres) by definition; standard gravity 9.80665 m/s² (CGPM 1901); thermochemical calorie 4.184 J; international table calorie and Btu."
  - "Each factor is written by fibub as arithmetic on those definitions. Checked against the Python pint package (BSD licence), used only for testing; no code copied."
flow:
  - { icon: pencil, label: "Type" }
  - { icon: check, label: "Dimensions" }
  - { icon: convert, label: "Convert" }
  - { icon: table, label: "Tables" }
---

## What it does

Engineering work mixes unit systems all the time: a pump curve in US gallons per minute, a pipe in millimetres, a pressure in psi, a heat exchanger datasheet in Btu per hour per square foot per °F. This converter does two jobs:

- **Unit tables**: pick a quantity (24 of them, from length and pressure to kinematic viscosity, thermal conductivity and specific heat), type a value, choose the unit, and see it in every common SI, metric and US/imperial unit at once.
- **Convert anything**: type a quantity and the unit you want, such as `3 kN*m to lbf*ft` or `450 bbl/d to m^3/h`. The tool works out the dimensions of both sides (length, mass, time, temperature and so on) and refuses a conversion that is physically impossible, such as metres per second to newtons, telling you what each side actually is.

All factors are **exact definitions**, not rounded table values: the inch is 25.4 mm, the pound 0.45359237 kg, the pound-force a pound times standard gravity (9.80665 m/s²), the US gallon 231 cubic inches, and the Btu and calorie follow their international table definitions. Everything runs in your browser.

## How to use the expression box

- Multiply with `*`, `·` or a space (`kN m`), divide with `/`, and raise to powers with `^`, `**`, digits or superscripts: `m^2`, `m2`, `m²`, `s-1`.
- Brackets group: `W/(m*K)`. Without brackets, `/` and `*` read left to right, so `W/m*K` means (W/m)·K.
- Any SI unit takes an SI prefix: km, µm, MPa, kWh, mN, GJ. Units are case-sensitive where it matters: `mm` is a millimetre and `Mm` a megametre; `t` is a tonne and `T` a tesla.
- Leave out "to" to see the value in SI base units and its dimension.
- Temperatures: `20 °C to K` gives 293.15 (absolute). Inside a compound unit such as `Btu/(h*ft*°F)`, °F is a temperature difference (1 °F = 5/9 K).

## Worked examples

- `3 kN*m to lbf*ft` gives **2212.686448 lbf·ft**, with the dimension L²·M·T⁻² (energy, work or torque) and 3000 in SI base units.
- `450 bbl/d to m^3/h` gives 2.98101178 m³/h.
- `25 MPa to psi` gives 3625.943443 psi.
- `1 W/(m*K) to Btu/(h*ft*°F)` gives 0.5777893165.
- `100 °C to °F` gives 212 °F.
- `5 m/s to N` is refused: "5 m/s" is L·T⁻¹ (speed), but "N" is L·M·T⁻² (force).
- In the tables, 1 bar is 100,000 Pa, 14.50377377 psi, 0.9869232667 atm and 750.0616827 Torr.

## Tips

- Angles are treated as dimensionless, so torque × speed gives power: `100 N*m * 3000 rpm to kW` is 31.42 kW. For a shaft, use rpm or rev/s rather than Hz: 1 rev/s is 60 rpm, while Hz is just 1/s.
- inH₂O, mmH₂O and inHg use conventional densities (water 1000 kg/m³, mercury 13.5951 g/cm³) and standard gravity; instruments calibrated at another water temperature differ slightly.
- The year is the Julian year of 365.25 days; the therm is 100,000 IT Btu.

## FAQ

**How accurate is it?** The factors are exact definitions; results are shown to 10 significant figures. Every table entry was checked against the open-source pint package.

**Can it convert currencies or US survey feet?** No: currencies change daily (see the currency converter), and the US survey foot was retired in 2023, so the international foot is used.

**Is anything sent anywhere?** No. It works offline once the page has loaded.

---
name: Concentration converter
num: 517
shelf: science
section: general-and-lab-chemistry
title: "Concentration converter: molarity, molality, % w/w, % w/v, % v/v, ppm, mg/L, mole fraction and normality"
summary: "Type one concentration and see it in every common unit at once: mol/L, mmol/L, µmol/L, mol/kg, g/L, mg/L, µg/L, mg/kg, % w/w, % w/v, % v/v, ppm, ppb and ppt by mass, mole fraction, mol % and normality, or ppmv and mg/m³ for gases at your temperature and pressure. The molar mass comes from a formula, every step of the working is shown, and a whole column converts at once."
status: live
ads: true
order: 517
icon: convert
works: offline
updated: 2026-11-09
related: [solution-calculator, molar-mass-calculator, gas-law-calculator, reaction-equivalents, colligative-properties, lab-unit-converter, periodic-table, buffer-recipe-calculator]
sources:
  - "Unit definitions and the ideal gas law are standard; the gas constant is the exact SI value (Avogadro constant × Boltzmann constant). Code written by fibub and checked in the tests against an independent Python version built on pint and scipy.optimize.brentq."
  - "Molar masses: IUPAC/CIAAW standard atomic weights (abridged values), through the molar mass calculator's formula reader. Dry air is taken as 28.9647 g/mol."
  - "The example densities (salt water, ethanol and water, dilute sulfuric acid) are rounded values made up for the demonstration; they are not reference data. Type the density of your own solution."
flow:
  - { icon: flask, label: "Solute" }
  - { icon: pencil, label: "Value" }
  - { icon: convert, label: "All units" }
  - { icon: download, label: "CSV" }
---
## What it does

Concentrations come in a dozen units, and changing between them is where lab and homework mistakes creep in. This converter takes one value in one unit and writes it in all the others at once:

- **Amount per volume:** mol/L (molarity, M), mmol/L, µmol/L, nmol/L, and normality (eq/L).
- **Amount per mass of solvent:** mol/kg (molality) and mmol/kg.
- **Mass per volume:** g/L, mg/L, µg/L and % w/v (grams per 100 mL).
- **Mass per mass:** % w/w, mg/kg, mass fraction, and ppm, ppb and ppt by mass.
- **Volume per volume:** % v/v.
- **Amount per amount:** mole fraction and mol %.
- **Gases:** ppmv, ppbv, pptv, % v/v, mg/m³ and µg/m³, plus mol/L and the mass-based units, at the temperature and pressure you give.

Type the solute as a formula (NaCl, CuSO4·5H2O, C2H5OH) and its molar mass is worked out for you, or type the molar mass in g/mol. For each answer, the page shows the working: the formula used and the numbers put into it. It all runs in your browser and keeps working offline.

Look up molar masses with the [[molar-mass-calculator]], and make up the solution with the [[solution-calculator]].

## How to use it

1. **Pick the mixture.** A liquid solution (a solute in one solvent), or a gas mixture, treated as an ideal gas.
2. **Describe the solute.** Formula or molar mass. For a liquid also give the **solution density** (g/mL, of the solution at this concentration, not of the pure solvent), the **solvent** (formula or molar mass; water is H2O), and if you want them, the **pure solute's density** (for % v/v) and the **equivalents per mole z** (for normality). For a gas, give the **temperature** (°C), the **pressure** (kPa; 1 atm is 101.325 kPa) and the **other gas** (the rest of the mixture; type "air" for dry air).
3. **Type the value and pick its unit.** The table fills with every unit. A unit that needs a value you left empty says what it needs instead of guessing.
4. **Show the working.** Pick a unit under "Show the working" to see each step from your value to that unit.
5. **Convert a column.** Paste many values, or open a CSV or Excel file, pick their unit and the unit to show. A second column, if present, is each row's own solution density. **Download all units (CSV)** gives every unit for every row.

### What each value is for

- **Solution density ρ** links volume-based units (mol/L, g/L, % w/v, normality) to mass-based ones (% w/w, molality, ppm by mass, mole fraction). Density changes with concentration, so use the density measured for this solution or read from a density table for it.
- **Solvent molar mass** is used only for the mole fraction and mol %.
- **Pure solute density ρs** is used only for % v/v, defined here as the volume of pure solute you would measure out per 100 mL of finished solution. Liquids such as ethanol and water shrink when mixed, so % v/v does not add up to 100 with the water's own share.
- **Equivalents per mole z** is used only for normality: N = z × molarity. For an acid it is the number of H⁺ it gives (2 for H₂SO₄ when both react), for a base the OH⁻ it takes up, for a redox reagent the electrons per formula unit. It depends on the reaction, which is why you type it.

## How it works

For a liquid, every unit goes through the **mass fraction w**, the grams of solute per gram of solution. With molar mass M (g/mol), solution density ρ (g/mL) and solvent molar mass Ms:

- c (mol/L) = 1000·ρ·w / M, and back w = c·M / (1000·ρ)
- molality b (mol/kg) = 1000·w / (M·(1 − w))
- g/L = 1000·ρ·w; % w/v = 100·ρ·w; % v/v = 100·ρ·w / ρs
- % w/w = 100·w; ppm by mass = mg/kg = 10⁶·w
- mole fraction x = (w/M) / (w/M + (1 − w)/Ms)

For a gas, every unit goes through the **mole fraction x**. For an ideal gas the volume fraction equals the mole fraction, so ppmv = 10⁶·x and % v/v = mol % = 100·x. The total amount per litre is P/(RT), so c = x·P/(RT) and the mass concentration is x·P·M/(RT); mg/m³ is the same number as µg/L. The mass fraction is w = x·M / (x·M + (1 − x)·Mg), with Mg the molar mass of the other gas.

## Worked examples

**Salt water** (the first example; the density 1.02 g/mL is a rounded, made-up value). 0.5 mol/L NaCl, M = 58.44 g/mol from the formula. Mass fraction w = 0.5 × 58.44 / (1000 × 1.02) = 0.0286471. From there: 29.22 g/L, 2.86471 % w/w, 28647.1 ppm by mass, molality 0.504653 mol/kg, and with water at 18.015 g/mol a mole fraction of 0.00900941 (0.900941 mol %).

**Ethanol in water.** 40 % v/v C2H5OH (46.069 g/mol), pure ethanol 0.789 g/mL, solution 0.95 g/mL (rounded example values): 33.2211 % w/w, 6.85059 mol/L, 10.7985 mol/kg and a mole fraction of 0.162855.

**Sulfuric acid.** 1 N H2SO4 with z = 2 is 0.5 mol/L; at a made-up 1.06 g/mL that is 49.036 g/L or 4.62604 % w/w.

**Carbon dioxide in air.** 400 ppmv CO2 at 25 °C and 101.325 kPa: the molar volume is 24.4654 L/mol, so 400 × 10⁻⁶ × 44.009 g/mol / 24.4654 L/mol gives 719.53 mg/m³ (16.3496 µmol/L). By mass, against air at 28.9647 g/mol, it is 607.634 ppm.

## Tips

- **ppm in water.** People often say "ppm" for mg/L in dilute water samples. That is only the same as ppm by mass (mg/kg) when the density is 1 g/mL. This page keeps them apart: mg/L is in the table, ppm here is by mass.
- **Hydrates.** Type the formula you weigh. CuSO4·5H2O gives concentrations of the hydrate; type CuSO4 for the anhydrous salt.
- **Dilutions and weighing** are on the [solutions and dilutions calculator](/science/solution-calculator/); clinical results (mg/dL to mmol/L for glucose and cholesterol) are on the [lab unit converter](/science/lab-unit-converter/).

## FAQ

**Why does mol/L need the density but mol/kg does not?** Molarity is per litre of solution and molality per kilogram of solvent. Going from mass fraction to molality uses masses only; going to molarity needs to know how much a litre of the solution weighs.

**Can it handle concentrated solutions?** Yes, as long as you type the density of that solution. The formulas are exact; the only assumption is a single solute in a single solvent.

**Why does the gas mode assume an ideal gas?** At everyday pressures the difference is far below 1 % for air pollutants and breathing gases. At high pressure, use a real-gas correction.

**Does anything I type leave my device?** No. Nothing is sent or stored; the page works offline once loaded.

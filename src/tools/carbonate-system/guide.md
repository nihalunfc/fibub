---
name: Seawater carbonate system calculator
num: 868
shelf: science
section: chemical-and-biological-oceanography
title: "Seawater carbonate system calculator (CO2SYS style): pH, pCO2, alkalinity, DIC, saturation state Ω and Revelle factor"
summary: "Give any two of total alkalinity, dissolved inorganic carbon, pH and pCO2 with salinity, temperature and pressure, and get the rest of the seawater carbonate system: every pH scale, pCO2, fCO2 and xCO2, carbonate ion, calcite and aragonite saturation, the Revelle factor and the alkalinity part by part, at the input conditions and any others, for one sample or a whole table."
status: live
ads: true
order: 868
icon: flask
works: offline
updated: 2026-11-09
related: [tide-predictor, equilibrium-solver, titration-curve, water-quality-index, dissolved-oxygen, coral-cover-calculator]
sources:
  - "Method as in CO2SYS (Lewis and Wallace 1998) and PyCO2SYS (Humphreys et al. 2022, Geosci. Model Dev. 15, 15). Published equations: K1, K2 Lueker, Dickson and Keeling (2000, Mar. Chem. 70, 105); K0 and fugacity Weiss (1974, Mar. Chem. 2, 203); KB Dickson (1990, Deep-Sea Res. 37, 755); KW Millero (1995, Geochim. Cosmochim. Acta 59, 661); KHSO4 Dickson (1990, J. Chem. Thermodyn. 22, 113); KHF Dickson and Riley (1979, Mar. Chem. 7, 89); calcite and aragonite Mucci (1983, Am. J. Sci. 283, 780); pressure Millero (1995) and Ingle (1975); borate Uppström (1974) or Lee et al. (2010); sulfate Morris and Riley (1966); fluoride Riley (1965); calcium Riley and Tongudai (1967); vapour pressure Weiss and Price (1980). fibub's code is its own, checked in the tests against PyCO2SYS."
  - "The example water and samples are made up. Nothing you type or open is sent or stored."
flow:
  - { icon: sliders, label: "S, T, P" }
  - { icon: table, label: "Two values" }
  - { icon: calculator, label: "Solve" }
  - { icon: chart, label: "pH, Ω" }
---

## What it does

The carbon dioxide dissolved in seawater is spread over three forms (CO2, bicarbonate and carbonate) whose balance is set by the water's pH, temperature, salinity and pressure. Two measured quantities are enough to fix all the rest. This calculator does what the oceanographers' standard program CO2SYS does:

- **Any two inputs** from total alkalinity (TA), dissolved inorganic carbon (DIC), pH on the total scale and pCO2.
- **Every output**: TA, DIC, pH on the total, free and seawater scales, pCO2, fCO2 (fugacity) and xCO2 (mole fraction in dry air), CO2, bicarbonate, carbonate, borate and hydroxide, the saturation states Ω of calcite and aragonite, and the Revelle (buffer) factor.
- **Pressure** for deep samples, with the constants corrected to the depth you give.
- **The same water at other conditions**: TA and DIC do not change with temperature and pressure, so give a second temperature and pressure to see the pH and pCO2 there (for example, the lab at 25 °C against the sea at 4 °C).
- **Alkalinity part by part**, the constants used (as pK) with their sources, a speciation plot, and a CSV of everything.
- **Many samples at once**: paste or open a table and download every result.

The constants are the CO2SYS defaults for seawater: K1 and K2 of Lueker et al. (2000), the bisulfate constant of Dickson (1990), HF of Dickson and Riley (1979), and borate from salinity after Uppström (1974) or Lee et al. (2010). Phosphate and silicate alkalinity are left out.

Work through the equilibria by hand with the [[equilibrium-solver]], and add the oxygen side of the story with the [[dissolved-oxygen|dissolved oxygen calculator]].

## How to use it

1. Type the salinity, temperature and pressure (0 dbar at the surface; 1 dbar is about 1 m of depth).
2. Choose what you measured in "First" and "Second" and type the values: TA and DIC in µmol/kg, pH on the total scale, pCO2 in µatm.
3. Read the results. To see the same water elsewhere, type another temperature and pressure.
4. For a batch, put one sample per line (salinity, temperature, pressure, then your two values in the order chosen above) and press "Download all samples".

## Worked example

The made-up water: salinity 35, 20 °C, at the surface, TA 2300 and DIC 2000 µmol/kg. The page gives pH 8.122 (total scale; 8.213 on the free scale), pCO2 323.9 µatm (fCO2 322.8, xCO2 331.4 ppm), CO2 10.46, bicarbonate 1778.1 and carbonate 211.4 µmol/kg, Ω calcite 5.06, Ω aragonite 3.29 and a Revelle factor of 9.67. The alkalinity is 1778.1 from bicarbonate, 422.9 from carbonate, 94.0 from borate and 5.1 from hydroxide. Warmed to 25 °C the same water has pH 8.046 and pCO2 397.0 µatm.

## Tips

- pH must be on the total scale. A pH from an NBS-buffer glass electrode is not the same and can be off by 0.1 or more in seawater.
- TA and DIC are the most stable pair to measure and store; computing from pH and pCO2 magnifies errors.
- Ω below 1 means the water is corrosive to that mineral. Aragonite (corals, pteropods) dissolves first.

## FAQ

**Is it the same as CO2SYS?** With the same options, yes: every number agreed with PyCO2SYS to about 13 significant figures in our tests.

**What is the Revelle factor?** The percentage change in pCO2 for a 1 % change in DIC at constant alkalinity. Around 8 to 15 in the ocean; higher values mean the water takes up less extra CO2.

**Is my data uploaded?** No. Everything runs in your browser.

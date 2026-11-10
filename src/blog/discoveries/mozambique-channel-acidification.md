---
title: "Ocean acidification speeding up in the Mozambique Channel: pH and aragonite"
summary: "New ship, float and model data show surface pH in the Mozambique Channel falling about twice as fast since 1995. See how pH and aragonite saturation follow from alkalinity and DIC."
tools: [carbonate-system, trend-analyser, dissolved-oxygen]
updated: 2026-11-10
sources:
  - "Metzl N, Lo Monaco C, Tribollet A, Ternon J-F, Chevallier F, Gehlen M (2025), Biogeosciences 22: 7187-7204, CC BY 4.0, the paper described here (including its regional alkalinity-salinity relation, quoted as the paper's)."
  - "Carbonate constants as used in CO2SYS: K1 and K2 of Lueker, Dickson and Keeling (2000), Mar. Chem. 70: 105."
  - "The water samples in the worked example are made up by fibub."
paper:
  title: "New observations confirm the progressive acidification in the Mozambique Channel"
  authors: "Metzl N, Lo Monaco C, Tribollet A, Ternon J-F, Chevallier F, Gehlen M"
  journal: "Biogeosciences"
  year: 2025
  doi: "10.5194/bg-22-7187-2025"
  url: "https://bg.copernicus.org/articles/22/7187/2025/"
  licence: "CC BY 4.0"
  reviewed: true
---

The ocean soaks up about a quarter of the carbon dioxide people release. That slows global warming, but the dissolved CO2 turns into carbonic acid and lowers the water's pH. In the warm Mozambique Channel, between Madagascar and the African coast, coral reefs sit right in the path of that change. A French team brought together six decades of ship data, a robotic float and a neural-network model, and in November 2025 reported in Biogeosciences that the acidification there is speeding up. This page explains the study in our own words and shows how the [[carbonate-system|carbonate system calculator]] turns two measured numbers into pH and coral-relevant saturation, with the [[trend-analyser]] for the long-term slope.

## What they found

Using surface samples taken in April and May, the authors found that pH (on the total scale) fell by about 0.012 per decade between 1963 and 1995, then by about 0.027 per decade from 1995 to 2022. In other words, the decline has roughly doubled in pace. The model, which covers every month, shows the same speeding up, if a little weaker.

The aragonite saturation state, written Ωar, also dropped. Aragonite is the form of calcium carbonate that corals build with, and Ωar says how easily it forms: above 1 the water favours it, below 1 it dissolves. The paper gives May values of about 3.86 in 1963 and 3.49 in 2022. In the model the lowest value, around 3.23 in September 2023, dipped just below 3.25, a level earlier work proposed as a risk line for reefs. During a marine heatwave in early 2025 the float recorded pH as low as about 7.95.

Under a high-emission future, the authors project Ωar falling below 3 by about 2034. Their model also shows dissolved inorganic carbon (DIC) rising about 1 µmol/kg each year since 1985, while total alkalinity barely changed.

## Why it matters

The islands and coasts around the channel have coral reefs that feed fisheries and shelter shorelines from waves. Lower Ωar makes it harder for corals, shellfish and some plankton to build skeletons and shells, and acidification adds to the stress of hotter water. Long records from the tropical Indian Ocean are rare, so a careful one from this region fills a real gap.

## How they did it

The seawater carbonate system has four main measurable quantities: total alkalinity (TA, the water's capacity to neutralise acid), DIC (all the dissolved CO2, bicarbonate and carbonate together), pH and the CO2 fugacity, fCO2 (the effective CO2 pressure). Know any two, plus temperature and salinity, and the rest follow from chemical equilibrium constants.

The team measured fCO2 continuously from ships on cruises between 2004 and 2022, and on some cruises titrated TA and DIC. Older cruise data came from the SOCAT database. Where alkalinity was not measured, they estimated it from salinity with their own regional line, TA ≈ 73.841 × S − 291.02 µmol/kg. They then computed pH and Ωar with the standard CO2SYS program and the Lueker constants. A neural network trained on fCO2 data filled in the months and years with no ships, and a BGC-Argo float added 2024 and 2025.

## Check it yourself with fibub

Our fibub calculator uses the same constant set as the paper's CO2SYS runs. Every sample below is made up.

1. **Set the water.** Type salinity 35, temperature 26 °C and pressure 0 dbar. With the paper's relation, S = 35 gives TA ≈ 2293 µmol/kg (73.841 × 35 − 291.02 = 2293.4).
2. **Choose the pair.** Set **First** to total alkalinity, 2293, and **Second** to DIC.
3. **An "old" sample.** Type DIC = 1940 µmol/kg. The tool gives pH about **8.118**, pCO2 about 321 µatm and Ωar about **3.95**.
4. **A "new" sample.** Add 60 µmol/kg of DIC, as if it rose 1 µmol/kg a year for 60 years, and type 2000. Now pH is about **8.020**, pCO2 about 425 µatm and Ωar about **3.33**. That is a pH drop of 0.098, or about 0.016 per decade over the 60 years, with alkalinity unchanged.
5. **Use fCO2 instead.** Change **Second** to pCO2 and type 420 µatm. The tool works the DIC back out as about 1998 µmol/kg, with Ωar about 3.36. This is the route the paper takes for ship fCO2 data.
6. **A heatwave.** Keep TA 2293 and DIC 2000 and type 28 °C into **Also at temperature**. The same water at 28 °C has pH about 7.990 and pCO2 about 460 µatm, while Ωar edges up slightly to about 3.38. Warming alone lowers pH because it shifts the equilibrium, even with no extra carbon.

For many samples, paste one per line in **Many samples at once** and download the table. Paste a year-by-pH column into the trend analyser to get Sen's slope per decade and whether it is significant. To add the oxygen side of a cruise, the [[dissolved-oxygen|dissolved oxygen calculator]] gives saturation and oxygen use from the same temperatures and salinities.

## The fine print

- The observed trends rest on few samples, all from April and May, in one part of the channel.
- Most alkalinity values come from salinity, not titration, so small regional changes in TA would be missed.
- Eddies make DIC and TA swing by tens of µmol/kg, so the gap between any two cruises is not only carbon uptake.
- The neural network gives smaller trends than the ship data and depends on what it was trained on.
- The 2034 projection holds temperature and salinity fixed, and the 3.25 and 3 thresholds are guides, not proven tipping points; some reefs live at lower Ωar.

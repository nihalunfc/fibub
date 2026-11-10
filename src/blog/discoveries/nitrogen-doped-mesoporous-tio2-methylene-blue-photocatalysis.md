---
title: "Nitrogen-doped mesoporous carbon–TiO2 degrades methylene blue under UV"
summary: "A 2026 RSC Advances study made black, nitrogen-doped carbon–TiO2 spheres that removed about 95 % of methylene blue in an hour. Here is how to check a dye-removal rate constant yourself."
tools: [reaction-kinetics-fitter, calibration-curve, beer-lambert-calculator]
updated: 2026-11-10
sources:
  - "Abdu MT (2026), RSC Advances, CC BY 3.0, the paper described here."
  - "Pseudo-first-order rate law ln(C0/C) = kt and half-life ln 2 / k: standard physical chemistry."
  - "Molar mass of methylene blue chloride (C16H18ClN3S), 319.85 g/mol, from IUPAC standard atomic weights."
paper:
  title: "Harnessing mesoporosity and nitrogen doping to engineer a superior carbon-TiO2 photocatalyst for methylene blue degradation"
  authors: "Abdu MT"
  journal: "RSC Advances"
  year: 2026
  doi: "10.1039/d5ra07840g"
  url: "https://pubs.rsc.org/en/content/articlelanding/2026/ra/d5ra07840g"
  licence: "CC BY 3.0"
  reviewed: true
---

Textile mills release dyes that colour rivers and resist ordinary treatment. One fix is a photocatalyst: a solid that soaks up light and uses the energy to break dye molecules apart. A 2026 paper in RSC Advances (CC BY 3.0) describes black titanium dioxide spheres, laced with carbon and nitrogen and full of tiny pores, that removed about 95 % of the blue dye methylene blue in one hour under UV light. Below we explain the work in our own words and show how the [[reaction-kinetics-fitter]] gets a rate constant and half-life from the same kind of experiment. To turn absorbance readings into concentrations first, use the [[calibration-curve]] or the [[beer-lambert-calculator]].

## What they found

The catalyst, called mNC-TiO2, is made of round clusters roughly half a micrometre to three quarters of a micrometre across, built from grains a few tens of nanometres wide. It has a large internal surface (the paper reports close to 300 m² per gram) and pores about 5 nm wide. The titanium dioxide is in its anatase form.

Adding carbon and nitrogen pulled the band gap, the smallest photon energy the solid can absorb, down to about 2.85 eV. Plain anatase needs about 3.2 eV. With 1 g of catalyst per litre and a 365 nm lamp, a 50 mg/L dye solution lost about 94.7 % of its colour in 60 minutes. In the dark the same powder only soaked up about 30 %, so most of the removal was driven by light. The author fitted a pseudo-first-order law and reports a rate constant of about 0.045 to 0.048 per minute. It stayed useful over several reuse cycles and removed about three quarters of the dye from a real textile effluent.

## Why it matters

Titanium dioxide is cheap, stable and non-toxic, but it mostly absorbs UV, which is only a few per cent of sunlight. Doping it to shift its absorption toward visible light, and giving it many pores so dye molecules can reach the surface, are two of the main routes to a practical catalyst. A rate constant lets different catalysts be compared, as long as the conditions match.

## How they did it

1. A surfactant template (Pluronic P123) was mixed with a titanium precursor and a urea–formaldehyde resin, the source of carbon and nitrogen.
2. The gel was dried, aged and heated under argon to burn the template away and leave pores.
3. Diffraction, gas adsorption, microscopy and photoelectron spectroscopy described the solid.
4. Dye solutions were stirred with the catalyst, first in the dark and then under the UV lamp, with samples taken over time and measured by absorbance.
5. They varied dye concentration, pH and catalyst reuse, and tried an industrial effluent.

## Check it yourself with fibub

Here is a worked example with **our own invented numbers**, not the paper's data. Imagine a 50 mg/L dye run where the light goes on after 30 minutes of dark stirring. Samples are diluted ten times and read at 664 nm in a 1 cm cell.

**Step 1: a calibration line.** Paste these standards into the calibration curve tool (concentration in mg/L, then absorbance):

| mg/L | 0.5 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| Absorbance | 0.110 | 0.214 | 0.433 | 0.641 | 0.858 | 1.072 |

The tool gives a slope of 0.2139 per mg/L, R² = 0.99997 and an LOQ of about 0.11 mg/L.

**Step 2: read the samples.** In the unknowns box put one sample per line, named by its time, and set the dilution factor to 10:

| Time (min) | 0 | 10 | 20 | 30 | 40 | 50 | 60 |
|---|---|---|---|---|---|---|---|
| Absorbance (diluted) | 0.751 | 0.507 | 0.338 | 0.226 | 0.153 | 0.102 | 0.069 |

The original concentrations come out as 35.0, 23.6, 15.7, 10.5, 7.05, 4.67 and 3.13 mg/L. It starts below 50 mg/L because some dye stuck to the powder in the dark.

**Step 3: the rate constant.** Paste time and concentration into the kinetics fitter, with min as the time unit and mg/L as the concentration unit. First order wins with essentially 100 % support: **k ≈ 0.0402 per minute**, **half-life ≈ 17.3 minutes**, R² above 0.9999. The free-order fit gives n = 0.99 ± 0.01. Tap ln [A] and the points fall on a straight line. That is the pseudo-first-order behaviour photocatalysis papers report. Our made-up run removes 91 % of the dye present when the light came on.

**Step 4: a cross-check.** In the Beer–Lambert card, type absorbance 0.751, path length 1 cm, an ε of 68,400 L/(mol·cm) (our calibration slope, 0.2139 L/mg per cm, times 319,850 mg/mol) and the molar mass 319.85 g/mol, and leave concentration empty. It gives about 11.0 µmol/L, or 3.51 mg/L, which is 35.1 mg/L after the tenfold dilution. That agrees with step 2 to within the small intercept of the calibration line.

To compare with a paper, start the clock when the light goes on, and quote k with the catalyst dose and dye concentration it belongs to.

## The fine print

- One dye, one lamp and one catalyst batch were tested. Methylene blue also absorbs light itself, which can make catalysts look better than they are.
- The study reports no radical scavenger tests, so the claimed roles of hydroxyl and superoxide radicals come from the proposed mechanism, not direct proof.
- A few numbers differ between sections of the paper (heating temperature, rate constant, reuse figures). Read the full text for the values in each experiment.
- Colour loss is not full breakdown: in the effluent test, total organic carbon fell by about half.

---
name: Bioaccumulation factor calculator
num: 159
shelf: science
code: T159
section: ecotoxicology
title: "Bioconcentration factor (BCF) calculator: fit k1 and k2 to a fish uptake and depuration test, plus trophic magnification factor (TMF)"
summary: "Work out a kinetic bioconcentration factor from a fish test: fit the uptake rate k1 and depuration rate k2 to your time course and get BCF = k1/k2 with a confidence interval, half-life, time to steady state, steady-state BCF, growth correction and lipid normalisation. Or get the trophic magnification factor of a food web from trophic levels and concentrations."
status: live
ads: true
order: 3
icon: flask
works: offline
updated: 2026-11-09
related: [lc50-probit, species-sensitivity, non-detects, margin-of-exposure, benchmark-dose, water-quality-index]
sources:
  - "The first-order one-compartment uptake and depuration model, the kinetic and steady-state BCF, growth correction and lipid normalisation to 5 %, as used in flow-through fish bioconcentration tests (OECD Test Guideline 305 describes the test design; only the method is used, no text or data copied)."
  - "TMF as 10 to the power of the slope of log₁₀ concentration against trophic level: standard method from the food-web literature."
  - "Checked in the tests against SciPy curve_fit (log and raw fits, standard errors) and scipy.stats.linregress. The fish test and food web data are made up."
flow:
  - { icon: table, label: "Fish data" }
  - { icon: curve, label: "Fit k1, k2" }
  - { icon: sliders, label: "Corrections" }
  - { icon: chart, label: "BCF" }
---

## What it does

A chemical **bioconcentrates** when fish take it up from the water faster than they get rid of it. The standard way to measure this is a fish test with two phases: an **uptake** phase where the fish swim in water with a steady concentration of the chemical, then a **depuration** phase in clean water. This tool fits the classic one-compartment model to the fish concentrations:

- during uptake, dC/dt = k1 × Cw − k2 × C
- after uptake, dC/dt = −k2 × C

where k1 is the uptake rate (L/kg per day), k2 the depuration rate (per day) and Cw the water concentration. The **kinetic BCF** is k1/k2, the concentration ratio fish/water that the fish would reach at steady state.

It also works out the **trophic magnification factor (TMF)**: how much a chemical's concentration goes up with each step in a food web.

Toxicity results from the same fish can go into the [[lc50-probit|LC50 probit analysis]], and values for many species into a [[species-sensitivity|species sensitivity distribution]].

## How to use it

**Bioconcentration factor.** Paste or open the time (days) and fish concentration, one row per fish or pooled sample. Give the water concentration during uptake (in matching units, such as µg/L for µg/kg fish) and the day uptake ended. Choose to fit on **log** concentrations (usual, as scatter tends to grow with the level) or **raw** ones. Optional: the fish lipid content to normalise the BCF to 5 % lipid, and the fish weight at the end of uptake and at the end of the test to correct for growth (growing fish dilute the chemical, which looks like faster depuration).

**Trophic magnification.** Paste organism (optional), trophic level and concentration (lipid-normalised for fat-loving chemicals). The tool fits log₁₀ concentration against trophic level; TMF = 10^slope.

## Worked example

The made-up fish test ran 28 days of uptake at 1 µg/L and 28 days of depuration. Fitting on logs gives k1 = **150.8 L/kg per day** and k2 = **0.1202 per day**, so the kinetic **BCF is 1,254 L/kg** (95 % CI 1,205 to 1,304). The half-life in clean water is 5.76 days, and 95 % of steady state is reached after 24.9 days, so the 28-day uptake was long enough. The last three uptake days are within ±20 % of their mean, giving a steady-state BCF of 1,114 L/kg.

The fish grew from 2.0 to 2.6 g during depuration, a growth rate of 0.0094 per day. Taking that off k2 gives a **growth-corrected BCF of 1,360 L/kg**. At 4 % lipid, the BCF normalised to 5 % lipid is 1,568 L/kg (1,700 growth-corrected).

In the made-up food web of ten organisms, the slope is 0.435 per trophic level, so **TMF = 2.72** (95 % CI 2.27 to 3.26): the chemical biomagnifies.

## FAQs

**Why does the kinetic BCF differ from the steady-state one?** Steady-state BCF uses only the end of uptake and assumes the fish have levelled off. The kinetic BCF uses every point and does not need a plateau, so it is preferred when the fish have not quite reached steady state.

**Which fit should I use?** Log fitting treats a 10 % miss the same at low and high levels, which suits most test data. Raw fitting gives more weight to the high concentrations.

**Can I use this for a dietary test?** No. A feeding study needs the food concentration and feeding rate; this tool is for water exposure.

**Is my data uploaded?** No. Everything is calculated in your browser.

Regulatory thresholds for "bioaccumulative" differ between regions; check the rules that apply to you.

---
title: "Daphnia magna bioaccumulation test for heterocyclic PAHs: depuration rate k2"
summary: "A 2025 study tested water fleas as a stand-in for fish in bioaccumulation tests and found four heterocyclic PAHs very bioaccumulative. Here is how to fit k2 from a depuration curve."
tools: [bioaccumulation-factor, lc50-probit, species-sensitivity]
updated: 2026-11-10
sources:
  - "Çelik G et al. (2025), Environmental Science & Technology 59(18): 8984-8996, open access (CC BY), the paper described here."
  - "One-compartment uptake and depuration model, kinetic BCF = k1/k2, half-life = ln 2 / k2, growth correction and lipid normalisation to 5 %: standard bioconcentration test methods (OECD Test Guideline 305 describes the fish test; method only)."
paper:
  title: "Daphnia magna as an Alternative Model for (Simultaneous) Bioaccumulation and Chronic Toxicity Assessment: Controlled Exposure Study Indicates High Hazard of Heterocyclic PAHs"
  authors: "Çelik G, Healy SA, Stolte S, Mayer P, Markiewicz M"
  journal: "Environmental Science & Technology"
  year: 2025
  doi: "10.1021/acs.est.5c00384"
  url: "https://doi.org/10.1021/acs.est.5c00384"
  licence: "CC BY"
  reviewed: true
---

Whether a chemical builds up in living things is normally tested on fish, which takes many animals and months of work. A 2025 study in Environmental Science & Technology tried the water flea *Daphnia magna* instead, and ran its bioaccumulation and chronic toxicity tests together. Four heterocyclic PAHs, ring-shaped tar compounds that carry a sulfur, oxygen or nitrogen atom, came out as very bioaccumulative under criteria the authors propose for daphnids. The key number in such a test is the depuration rate k2, and the [[bioaccumulation-factor]] calculator fits it from your own uptake and clean-water data. Toxicity counts from the same animals fit into the [[lc50-probit|LC50 probit analysis]].

## What they found

Daphnids took up all four compounds and cleared them slowly. After correcting for growth, the paper reports depuration rates from about 0.011 to 0.109 per hour, with half-lives below 54 hours. Expressed as a bioaccumulation factor normalised to 5 % lipid, log values reached about 4.6 for one compound in a 21-day test. The compounds also cut daphnid reproduction at low concentrations, down to about 0.2 µg/L for the most toxic one.

Because daphnids are small and turn chemicals over fast, fish-based cut-offs do not fit them. The authors derived daphnid k2 thresholds of 0.48 per hour for "bioaccumulative" and 0.25 per hour for "very bioaccumulative". All four compounds cleared more slowly than the lower of these.

## Why it matters

Heterocyclic PAHs come from coal tar, creosote and fuel and are found in polluted groundwater and sediments, yet few have been tested for build-up. A cheap invertebrate test that gives both toxicity and bioaccumulation at once could screen many such chemicals and save fish tests for the ones that matter most.

## How they did it

1. They held the water concentration steady with passive dosing: silicone loaded with the chemical releases it into the water at a constant level.
2. Ten-day-old daphnids were exposed for five days, sampled daily, then moved to clean medium and sampled four more times over three to four days.
3. In a combined test, a 21-day chronic reproduction test served as the uptake phase, followed by 12 days in clean water.
4. They took k2 from the slope of the log of the body concentration against time in clean water, and corrected it for growth using the slope of log body weight.
5. They could not separate uptake from water and from the algae the daphnids ate, so they did not report a reliable uptake rate k1.

## Check it yourself with fibub

The [[bioaccumulation-factor]] page fits the classic one-compartment model to "day, concentration" rows. Its time unit is days, so for a fast daphnid test enter fractions of a day. Here is a worked example with **our own made-up data**, not the paper's.

Water at 1 µg/L for 5 days, then clean water for 4 days; body concentration in µg/kg:

| Day | 1 | 2 | 3 | 4 | 5 | 5.5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|---|---|
| µg/kg | 1,113 | 1,258 | 1,412 | 1,357 | 1,416 | 655 | 342 | 74 | 20 | 4 |

1. Pick "Bioconcentration factor from a fish test", paste the rows, set the water concentration to 1 and **Uptake ends on day** to 5.
2. Leave **Fit on** at log concentrations.
3. Read the result: k1 = 2,029 L/kg per day, k2 = **1.449 per day**, and a kinetic BCF (k1/k2) of **1,400 L/kg**, with a 95 % interval of 1,332 to 1,468 L/kg.
4. The half-life is 0.478 days, or 11.5 hours. 95 % of steady state is reached in 2.07 days, so a five-day uptake was long enough, and days 3 to 5 give a steady-state BCF of 1,395 L/kg.
5. For growth, type an animal weight of 0.00030 g at the end of uptake and 0.00042 g at the end. The growth rate is ln(0.42/0.30) ÷ 4 = 0.084 per day, so the growth-corrected k2 is 1.365 per day and the BCF rises to 1,486 L/kg.
6. For lipid, type 2 %. The BCF at 5 % lipid is 1,400 × 5 ÷ 2 = 3,500 L/kg.

To compare with the paper's daphnid thresholds, turn k2 into hours: 1.365 ÷ 24 = 0.057 per hour. That is far below 0.25 per hour, so our imaginary chemical would also count as very bioaccumulative under those proposed criteria.

One caution: the tool assumes the animals take the chemical up from water only. If they also eat contaminated food, as in the paper, k1 and the BCF mix both routes, while k2 from the clean-water phase still holds.

## The fine print

- Steady state was not reached in the paper's tests, so its bioaccumulation factors are described as best-case estimates.
- The daphnid k2 thresholds are a proposal from this study, not an adopted rule.
- Values for one of the four compounds are flagged by the authors as less reliable.
- Lipid normalisation used an assumed daphnid lipid content.
- Our numbers above are invented. Regulatory cut-offs for "bioaccumulative" differ between regions, so check the official source.

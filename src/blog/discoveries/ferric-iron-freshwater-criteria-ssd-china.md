---
title: "Ferric iron freshwater quality criteria from a species sensitivity distribution"
summary: "A 2025 study used a species sensitivity distribution to set iron limits for Chinese fresh waters and found long-term limits exceeded at most sites. Here is how to fit an HC5 yourself."
tools: [species-sensitivity, lc50-probit, non-detects]
updated: 2026-11-10
sources:
  - "Geng Q, Guo F (2025), Toxics 13(6): 475, CC BY, the paper described here."
  - "Species sensitivity distributions, HC5 and risk quotients (measured concentration ÷ no-effect concentration): standard ecological risk assessment methods (Aldenberg and Slob 1993)."
paper:
  title: "Derivation of a Freshwater Quality Benchmark and an Ecological Risk Assessment of Ferric Iron in China"
  authors: "Geng Q, Guo F"
  journal: "Toxics"
  year: 2025
  doi: "10.3390/toxics13060475"
  url: "https://www.mdpi.com/2305-6304/13/6/475"
  licence: "CC BY"
  reviewed: true
---

Iron is not usually thought of as a pollutant, but water draining from mines can carry so much of it that rivers turn orange and small animals suffer. A 2025 study in the journal Toxics gathered published toxicity tests for ferric iron, the oxidised form, and used them to propose short-term and long-term limits for Chinese fresh waters. Compared with measured iron levels, the long-term limit was exceeded in most of the waters studied. The core step, a species sensitivity distribution, runs in your browser with the [[species-sensitivity]] tool, and each species' input value can come from a test fitted with the [[lc50-probit|LC50 probit analysis]].

## What they found

From the screened data, the authors fitted a curve to acute (short-term) values for 18 species and read off an HC5 of 689 µg/L. The HC5 is the hazardous concentration for 5 % of species: the level that only 5 % of species are expected to be more sensitive than. Dividing by an assessment factor of 2 gave a short-term limit of 345 µg/L. Chronic data were too few to fit a curve, so they divided the HC5 by an acute-to-chronic ratio of about 25 and got a long-term limit of about 28 µg/L.

Then they compared these limits with iron levels reported for rivers, lakes and reservoirs across eight river basins. About 30 % of the short-term risk quotients and about 83 % of the long-term ones were above 1, which flags possible harm. Basins in northern China showed the highest values.

## Why it matters

Many countries have iron limits written for drinking water, where the concern is taste and staining, not for wildlife. A limit built from the sensitivity of water animals and plants fills that gap. The result also points to where follow-up monitoring would help most.

## How they did it

1. They searched toxicity databases and the literature for iron tests on freshwater species and kept studies with clear methods and reporting.
2. Where one species had several values, they used the geometric mean, so each species counted once.
3. They fitted several curve shapes to the log values with national benchmark software and chose a logistic curve as the best fit.
4. They read the HC5 and turned it into short-term and long-term limits, as above.
5. They divided measured iron concentrations, collected from studies published between 2009 and 2024, by the limits to get risk quotients. A quotient above 1 means the measured level is higher than the limit.

## Check it yourself with fibub

Paste one row per test into the [[species-sensitivity]] page: species, an optional group, and the value. Here is a worked example with **our own made-up acute LC50 values** for an imaginary metal, in µg/L. They are not the paper's data.

| Species | Group | LC50 (µg/L) |
|---|---|---|
| Oligochaete worm | worm | 300 |
| Water flea | crustacean | 900 |
| Water flea | crustacean | 1,600 |
| Ostracod | crustacean | 2,500 |
| Midge | insect | 4,000 |
| Pond snail | mollusc | 6,000 |
| Amphipod | crustacean | 8,000 |
| Bluegill | fish | 15,000 |
| Minnow | fish | 22,000 |
| Crayfish | crustacean | 40,000 |
| Toad tadpole | amphibian | 70,000 |

1. Paste the rows. The tool combines the two water flea values into their geometric mean, √(900 × 1,600) = 1,200 µg/L, leaving 10 species.
2. Set the unit to µg/L and keep **Protect (HCp)** at 5 %.
3. Leave **Model** on "Average of both". Log-normal gets 56 % of the weight and log-logistic 44 %, from their AICc scores, so neither shape clearly wins.
4. Read the result: an **HC5 of about 491 µg/L**, with bootstrap 95 % limits of roughly 99 to 2,700 µg/L. Wide limits are normal with only 10 species.
5. Type 150 in **Fraction affected at**. About 1 % of species are expected to be affected at 150 µg/L. At 1,000 µg/L it is about 11 %.

Now copy the paper's logic by hand. A short-term limit of HC5 ÷ 2 is about 245 µg/L. A made-up site with a mean of 150 µg/L has a risk quotient of 150 ÷ 245 = 0.61, below 1. Using our own invented acute-to-chronic ratio of 25, the long-term limit is 491 ÷ 25 = 19.6 µg/L, and the same site's quotient becomes 7.6, well above 1. That jump is the same pattern the paper reports: short-term risk at a minority of sites, long-term risk at most.

If your field results include values reported only as "below the detection limit", work out their mean with the [[non-detects]] tool before dividing.

## The fine print

- Only four species had chronic data, so the long-term limit rests on an acute-to-chronic ratio rather than a fitted curve.
- The measured data were mostly total iron, used as a stand-in for ferric iron, and some toxicity tests included solid iron particles.
- The limits were not adjusted for pH, dissolved organic matter or hardness, which change how much iron organisms take up.
- Exposure data span about 15 years and some regions had few studies.
- The paper's text and its species table do not match exactly in places; read it in full.
- This is general science education, not a regulatory limit. Check the official guideline where you work.

---
name: Crime rate calculator
num: 767
shelf: science
code: T535
section: criminology-and-legal-studies
title: "Crime rate calculator per 1,000 or 100,000 with exact Poisson confidence intervals, rate ratios and age standardisation (free)"
summary: "Work out crime rates per 1,000, 10,000 or 100,000 people with exact Poisson or Byar confidence intervals. Compare areas or years with rate ratios, an exact test and percent change, and age-standardise rates by the direct method with the Fay–Feuer interval. Runs in your browser."
status: live
ads: true
order: 767
icon: calculator
works: offline
updated: 2026-11-09
related: [sample-size, uncertainty-calculator, trend-analyser, hotspot-density, rate-standardisation, population-pyramid]
sources:
  - "Exact (Garwood 1936) Poisson interval and Byar's approximation (as given by Breslow and Day 1987); exact conditional rate ratio test; direct standardisation with the gamma interval of Fay and Feuer (1997). Methods only; no data or tables are copied."
  - "Written by fibub and checked in the tests against SciPy (chi2.ppf, beta.ppf, binomtest with exact Clopper–Pearson intervals) and NumPy."
  - "All example counts, populations and the standard population are made up."
flow:
  - { icon: table, label: "Counts" }
  - { icon: percent, label: "Rate" }
  - { icon: chart, label: "Compare" }
---

## What it does

A raw count of offences means little until it is set against how many people live in the area. This calculator turns counts into **rates per 1,000, 10,000 or 100,000 people**, adds a **confidence interval** that shows how much the rate could move by chance alone, and answers the two questions that follow: is this area or year really different from that one (**rate ratio**, **exact test**, **percent change**), and is the difference just down to age mix (**age-standardised rate**)? Nothing you type leaves the page.

See where incidents cluster with the [[hotspot-density|hot spot density]] map, and compare age mixes in detail with [[rate-standardisation|rates and age standardisation]].

## How to use it

1. Choose **One rate**, **Compare areas or years** or **Age-standardised**.
2. Pick the rate base (per 1,000, 10,000 or 100,000 people) and the confidence level (90, 95 or 99 %).
3. **One rate:** enter the number of offences and the population at risk. Choose the **exact Poisson** interval (the standard, built from the chi-square distribution) or **Byar's approximation** (a close formula used in many published tables).
4. **Compare:** one row per area or year as name, count, population. Pick the reference row; every other row gets a rate ratio against it with an exact interval and p-value, and the percent change.
5. **Age-standardised:** one row per age group as group, count, population, standard population. The standard population sets the age mix every area is weighed to.
6. Download the table as CSV, or the report as PNG, PDF or Word.

## The formulas

- **Rate** = count ÷ population × base. The exact 95 % interval for a count k runs from ½ χ²(0.025; 2k) to ½ χ²(0.975; 2k + 2), divided by the population and multiplied by the base.
- **Rate ratio** RR = (k₁/n₁) ÷ (k₂/n₂). Given the total k₁ + k₂, the count k₁ is binomial with chance n₁·RR ÷ (n₁·RR + n₂), so an exact (Clopper–Pearson) interval and test follow; the log-method interval exp(ln RR ± 1.96 √(1/k₁ + 1/k₂)) is shown too. **Percent change** = 100 × (RR − 1).
- **Direct standardisation:** ASR = Σ wᵢ rᵢ ÷ Σ wᵢ, with rᵢ the rate in age group i and wᵢ its standard population. The interval is the Fay–Feuer gamma interval, which behaves well with small counts.

## Worked example

With the made-up figures of **412 offences in a population of 185,000**, the rate is **222.7 per 100,000** (95 % exact interval 201.7 to 245.3). Byar's approximation agrees to one decimal.

Comparing three made-up years (356 in 181,000; 412 in 185,000; 389 in 188,500) against Year 1, Year 3 has 206.4 per 100,000 against 196.7: a rate ratio of **1.049** (exact interval 0.906 to 1.215, p = 0.533), a change of **+4.9 %** that chance alone could easily give. Year 2's ratio of 1.132 has p = 0.090.

The made-up age table gives a crude rate of 200.0 per 100,000 but an **age-standardised rate of 193.1** (Fay–Feuer interval 173.2 to 215.1), because the standard puts more weight (20 %) on 10–17 year olds, the lowest-rate group, than their 11 % share of this population.

## Frequently asked questions

**Why are intervals so wide for small areas?** A count of 10 could easily have been 5 or 17 in another year with the same underlying risk. Many agencies do not publish rates on fewer than 10 to 20 events.

**Is the population the right denominator?** Not always. Shoplifting per shop, burglary per household or offences per visitor can be fairer measures; the maths is the same.

**Are these official figures?** No. Check counting rules and population estimates with the official source you report from.

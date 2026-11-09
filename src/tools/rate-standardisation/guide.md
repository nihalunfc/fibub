---
name: Rates and age standardisation
num: 463
shelf: science
section: epidemiology
title: "Incidence rate, prevalence and age-standardised rate calculator (direct and indirect, SMR with CI)"
summary: "Incidence rates, cumulative incidence and prevalence with confidence intervals, directly age-standardised rates with Fay-Feuer gamma intervals, and indirect standardisation: expected events and the SMR with exact Poisson limits. Paste data by age group or open a file."
status: live
ads: false
order: 3
icon: percent
works: offline
updated: 2026-11-09
related: [odds-risk-ratio, nnt-calculator, diagnostic-test-calculator, sample-size, uncertainty-calculator]
sources:
  - "Formulas: Garwood (1936, Biometrika 28:437) exact Poisson limits; Wilson (1927, J Am Stat Assoc); Clopper and Pearson (1934, Biometrika); Fay and Feuer (1997, Stat Med 16:791) gamma interval for directly standardised rates; Breslow and Day (1987, Statistical Methods in Cancer Research vol. II, IARC Sci Publ 82) for the SMR and its exact limits."
  - "The example standard population and standard rates are made up (rounded numbers for teaching), not any official standard."
flow:
  - { icon: table, label: "Age groups" }
  - { icon: sliders, label: "Standard" }
  - { icon: percent, label: "Adj. rate" }
---

## What it does

Comparing death or disease rates between places or years is misleading when their populations have different ages: an older town will have more deaths even if every age group is just as healthy. Age standardisation removes that difference. This calculator does the three jobs that come up in every epidemiology course:

- **Crude rate:** an incidence rate (cases per person-time), a cumulative incidence (risk over a period) or a prevalence, with its confidence interval.
- **Direct standardisation:** the rate your study population would have with the age mix of a **standard population**, with the Fay and Feuer gamma interval or a normal approximation, plus each age group's rate.
- **Indirect standardisation:** the number of events you would expect if your population had the **standard rates**, and the **standardised mortality (or incidence) ratio**, SMR = observed ÷ expected, with exact Poisson limits and an exact test.

For study and teaching, not medical advice. Check with a qualified professional.

## How to use it

1. Choose **Crude rate**, **Direct** or **Indirect (SMR)**, and the unit (per 100 to per 100 000) and confidence level.
2. **Crude rate:** pick the measure and type the cases and the person-years or people. For a risk or prevalence choose Wilson or exact limits; an incidence rate always uses exact Poisson limits.
3. **Direct:** paste one row per age group with the events, your population (or person-years) and the standard population, or open a CSV or Excel file.
4. **Indirect:** paste each age group's population and the standard rate in the chosen unit, then type the total events observed. Add the standard's crude rate to get an indirectly standardised rate too.
5. Download the table as CSV, or a report as an image, PDF or Word file.

The standard population and standard rates in the examples are **made up** with rounded numbers. For real work use the official standard you need (for example a national census standard or the WHO world standard) and check the official source.

## The formulas

Direct: with weights wᵢ = standard populationᵢ ÷ total standard, the standardised rate is Σ wᵢ dᵢ/nᵢ and its variance Σ wᵢ² dᵢ/nᵢ². The gamma limits of Fay and Feuer use that variance and the largest wᵢ/nᵢ, and stay accurate when counts are small. Indirect: expected E = Σ nᵢ × standard rateᵢ, SMR = O/E, and the limits are the exact Poisson limits of O divided by E: χ²(α/2, 2O)/2E and χ²(1 − α/2, 2O + 2)/2E.

## Worked example

**Crude:** 17 cases in 5230.5 person-years is 325 per 100 000 person-years (95 % interval 189.3 to 520.4).

**Direct:** the made-up study has 228 events in 100 000 people, a crude rate of 228 per 100 000. Standardised to the made-up standard, the page shows **295.2 per 100 000** (gamma 95 % interval 257.4 to 337.2): the study population is younger than the standard, so its crude rate understates its risk.

**Indirect:** with the made-up standard rates, 199.5 events are expected but 260 were seen, so **SMR 1.303 (130)**, 95 % interval 1.150 to 1.472, exact p < 0.001.

## Tips

- Compare directly standardised rates only when they use the same standard population.
- Use indirect standardisation when age-specific counts in your study are small or unknown; you only need the total observed.
- Give the age groups and the standard you used in any report.

## Frequently asked questions

**Gamma or normal interval?** The gamma interval is the usual choice in health statistics because it works with few events; the normal one is the simple textbook formula and can go wrong with small counts.

**Why is an SMR sometimes written as 130?** It is the same ratio multiplied by 100.

**Is my data stored?** No. Everything is worked out in your browser and nothing is sent anywhere.

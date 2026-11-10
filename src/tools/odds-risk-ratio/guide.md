---
name: Odds and risk ratio
num: 466
shelf: science
code: T317
section: epidemiology
title: "Odds and risk ratio"
summary: "Odds ratio and risk ratio from a 2 × 2 table with Woolf, exact and mid-p intervals, chi-square and Fisher exact tests, or several strata pooled by Mantel-Haenszel with the Breslow-Day test and a forest plot. Case-control or cohort."
status: live
ads: false
order: 6
icon: sigma
works: offline
updated: 2026-11-09
related: [nnt-calculator, diagnostic-test-calculator, sample-size, uncertainty-calculator, reliability-analysis]
sources:
  - "Formulas: Woolf (1955, Ann Hum Genet 19:251); Katz et al. (1978, Biometrics 34:469); Fisher (1935, J R Stat Soc); Cornfield (1956) and Rothman, Greenland and Lash, Modern Epidemiology, 3rd ed. (textbook) for exact and mid-p odds ratio limits; Mantel and Haenszel (1959, J Natl Cancer Inst 22:719); Robins, Breslow and Greenland (1986, Biometrics 42:311); Greenland and Robins (1985, Biometrics 41:55); Breslow and Day (1980, IARC Sci Publ 32); Tarone (1985, Biometrika 72:91)."
  - "Example numbers are made up for teaching."
flow:
  - { icon: table, label: "2×2 tables" }
  - { icon: sigma, label: "OR and RR" }
  - { icon: chart, label: "Forest plot" }
---

## What it does

The odds ratio (OR) and the risk ratio (RR, also called relative risk) say how strongly an exposure is linked to a disease or outcome. This calculator works them out from a 2 × 2 table, with every interval and test that epidemiology courses and journals ask for, and it can pool several tables, for example one per age group, by the Mantel-Haenszel method to remove confounding.

For one table it gives:

- the **odds ratio** with Woolf's log interval, the **exact** conditional interval and the **mid-p** interval;
- for a cohort or trial, the **risk in each group**, the **risk ratio** and the **risk difference**;
- **Pearson's chi-square** (with and without Yates' correction), **Fisher's exact test** and the **mid-p exact test**.

For several strata it gives the **Mantel-Haenszel OR** (and RR for cohorts) with intervals, the crude value for comparison, the **Mantel-Haenszel chi-square test**, the **Breslow-Day test** of equal odds ratios (with Tarone's correction), each stratum's own ratio and a **forest plot**.

For study and teaching, not medical advice. Check with a qualified professional.

Turn the risk difference into a number needed to treat with the [[nnt-calculator]], and pool several studies with the [[meta-analysis]] tool.

## How to use it

1. Choose **One table** or **Strata**.
2. Pick the **study design**. In a *case-control* study people were chosen because they had the disease or not, so only the odds ratio is valid. In a *cohort or trial* groups were chosen by exposure, so the risk ratio can be worked out too.
3. Type the counts: exposed and unexposed rows, cases (ill) and controls (well) columns. For strata, paste one row per stratum: name, exposed cases, exposed non-cases, unexposed cases, unexposed non-cases, or open a CSV or Excel file.
4. Choose the confidence level, and for strata whether the Mantel-Haenszel test uses a continuity correction.
5. Download the results as CSV, the forest plot as PNG, or a report as an image, PDF or Word file.

## The formulas

With exposed cases a, exposed non-cases b, unexposed cases c and unexposed non-cases d: OR = ad/bc with limits exp(ln OR ± z√(1/a + 1/b + 1/c + 1/d)) (Woolf). RR = [a/(a + b)]/[c/(c + d)] with SE(ln RR) = √(1/a − 1/(a + b) + 1/c − 1/(c + d)). The exact odds ratio is the conditional maximum likelihood estimate from the noncentral hypergeometric distribution, and its limits are where each tail probability equals α/2; mid-p limits count half the probability of the table seen. The MH OR is Σ(ad/n)/Σ(bc/n), with the Robins-Breslow-Greenland variance; the MH RR is Σ(a(c + d)/n)/Σ(c(a + b)/n), with the Greenland-Robins variance.

## Worked example

The made-up case-control study has 40 exposed and 20 unexposed cases, against 60 exposed and 80 unexposed controls. The page shows **OR 2.67 (1.42 to 5.02)**; the exact estimate is 2.65 (1.36 to 5.31) and the mid-p interval 1.42 to 5.07. Pearson's chi-square is 9.524 (p = 0.002) and Fisher's exact p is 0.003. Switch to *Cohort or trial* and the RR is 2 (1.26 to 3.17).

The made-up strata example (three age groups) gives a Mantel-Haenszel **OR 2.84 (1.69 to 4.76)** against a crude OR of 2.67. Breslow-Day is 0.130 on 2 df (p = 0.937), so the strata agree, and the MH chi-square is 16.055 (p < 0.001).

## Tips

- When any expected count is below 5, report Fisher's exact test or the mid-p test and the exact interval. The page warns you.
- If the crude and adjusted ratios differ by more than about 10 %, the stratifying factor is a likely confounder.
- If Breslow-Day is significant, the effect differs between strata (effect modification): report each stratum rather than one pooled number.

## Frequently asked questions

**Why do the exact and Woolf odds ratios differ?** The exact one is the conditional maximum likelihood estimate, as R's fisher.test gives. It is close to ad/bc in large samples.

**What if a cell is zero?** The OR is then 0 or infinite and Woolf's interval does not exist, but the exact interval still does. Strata with zeros still count in the Mantel-Haenszel estimate.

**Is my data stored?** No. Everything is worked out in your browser and nothing is sent anywhere.

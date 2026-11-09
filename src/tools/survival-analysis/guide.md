---
name: Survival analysis (Kaplan-Meier, log-rank, Cox)
num: 467
shelf: science
section: biostatistics
title: "Kaplan-Meier survival curve, log-rank test and Cox regression calculator (free, in browser)"
summary: "Paste time, event and group to draw Kaplan-Meier curves with Greenwood intervals, median survival with its interval, a number-at-risk table, the log-rank test for two or more groups and a Cox proportional hazards model with hazard ratios. Matches lifelines and statsmodels."
status: live
ads: false
order: 7
icon: curve
works: offline
updated: 2026-11-09
related: [sample-size, non-detects, reliability-analysis, plot-maker, data-cleaner, lc50-probit, dose-response]
sources:
  - "Formulas: Kaplan and Meier (1958) JASA 53:457; Greenwood (1926), Reports on Public Health and Medical Subjects 33; log-log interval as in Kalbfleisch and Prentice (2002), The Statistical Analysis of Failure Time Data, 2nd ed.; Mantel (1966) Cancer Chemotherapy Reports 50:163 and Peto and Peto (1972) JRSS A 135:185 (log-rank test); Cox (1972) JRSS B 34:187; Efron (1977) JASA 72:557 (tied times)."
  - "Example data: made up for this page."
flow:
  - { icon: table, label: "Paste data" }
  - { icon: curve, label: "KM curves" }
  - { icon: sigma, label: "Log-rank" }
  - { icon: download, label: "Report" }
---

## What it does

Survival analysis studies how long it takes until something happens: death, relapse, a machine breaking, a student dropping out. The difficulty is **censoring**: some people leave the study or are still well at the end, so we know only that their time is *at least* so long. This tool handles that properly. Paste one row per subject and it draws the **Kaplan-Meier curve** for each group, gives the **median survival** with its confidence interval, a **number-at-risk** table, the **log-rank test** of whether the groups differ, and a **Cox proportional hazards model** with hazard ratios. It all runs in your browser; nothing is uploaded.

## How to use it

1. Paste or open a file with one row per subject: **time**, **event** (1 = the event happened, 0 = censored; yes/no and dead/alive work too), then the **group** and any numeric **covariates** such as age. A header row is optional and names the covariates.
2. If column 3 is not a group, set **Column 3 is** to *A covariate*; everyone is then one group.
3. Choose the **interval** and its **level**. All use Greenwood's variance. *Log-log* (the default, as in lifelines and Stata) keeps the band inside 0 to 1 and behaves well in small samples. *Log* is R's default. *Plain* is the textbook S ± z·SE, cut at 0 and 1.
4. In the **Cox model** card, tick which terms to include and pick the **reference group**. Each other group gets a hazard ratio against it.
5. Download the report as an image, PDF or Word file, or the full life table as CSV.

## What the numbers mean

- **Kaplan-Meier estimate:** at each event time, survival is multiplied by (1 − events ÷ number at risk). Censored people leave the risk set without making the curve drop.
- **Median survival:** the first time the curve reaches 0.5. Its interval is where the lower and upper bands reach 0.5 (as lifelines and R do). "Not reached" means more than half were still event-free at the end. If the curve sits at exactly 0.5 for a while, the middle of that stretch is used, as in R.
- **Log-rank test:** compares observed with expected events in each group at every event time; χ² with (groups − 1) degrees of freedom.
- **Cox model:** the hazard ratio (HR) is how much the event rate is multiplied for that group, or per unit of a covariate, holding the others fixed. Fitted by Newton-Raphson; tied times use Efron's method.

## Worked example

The sample is 40 made-up people followed for up to 35 months, half on a new treatment. The page shows:

- Median survival: Control **9.5 months** (95 % interval 4 to 18); Treatment **not reached** (14 to –).
- Log-rank χ² = **6.119** on 1 df, p = **0.013**.
- Cox model with group and age: Treatment vs Control HR = **0.3384** (95 % interval 0.1369 to 0.8364, p = 0.019); Age HR = **1.022** per year (0.9818 to 1.065, p = 0.284). Likelihood ratio test χ² = 7.312 on 2 df, p = 0.026.

So the treated group had about a third of the event rate, after allowing for age.

## Tips

- Time zero must mean the same for everyone (diagnosis, randomisation, surgery).
- Aim for at least 10 events per Cox term; the page warns when there are fewer.
- If the curves cross, the hazards are not proportional and a single hazard ratio is misleading.
- A covariate that perfectly predicts the event makes the coefficient run off to infinity; the page warns you.

## FAQ

**Why does my median differ slightly from lifelines?** Only when the curve is exactly 0.5 over an interval: lifelines' rounding takes the end of that stretch, this page and R take the middle.

**Can I use categorical covariates?** Put them in as 0/1 columns, or use the group column.

**How big can the data be?** Up to 5,000 rows.

**Is my data sent anywhere?** No. Everything is worked out on your device and the page keeps working offline.

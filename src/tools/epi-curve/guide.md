---
name: Epidemic curve and attack rates
num: 464
shelf: science
section: epidemiology
title: "Epi curve maker for outbreaks: epidemic curve from onset dates, incubation and food attack rates"
summary: "Draw an outbreak epidemic curve from onset dates (or dates and counts) in bars of hours, days or weeks, with the peak, median onset and incubation from a shared exposure. Add a food-history table for attack rates, attack-rate ratios with intervals and Fisher's exact p. PNG and CSV downloads."
status: live
ads: false
order: 4
icon: chart
works: offline
updated: 2026-11-09
related: [odds-risk-ratio, rate-standardisation, nnt-calculator, plot-maker, sample-size, epidemic-model, diagnostic-test-calculator, herd-immunity]
sources:
  - "Methods: Centers for Disease Control and Prevention, Principles of Epidemiology in Public Health Practice, 3rd ed. (2006, textbook), lesson 6 on epidemic curves and food-specific attack rates; Katz et al. (1978, Biometrics 34:469) for the risk ratio interval; Fisher (1935, J R Stat Soc) for the exact test."
  - "The example outbreak and food-history numbers are made up for teaching."
flow:
  - { icon: calendar, label: "Onsets" }
  - { icon: chart, label: "Epi curve" }
  - { icon: table, label: "Attack rate" }
---

## What it does

The epidemic curve is the first picture drawn in any outbreak investigation: the number of cases by date (or hour) of symptom onset. Its shape hints at how the outbreak spread, when people were exposed and whether it is over. This tool draws it from a plain list of onset dates, and works out the attack rates in a food-history (or exposure-history) table, the classic way to find the meal or item behind a food-borne outbreak.

- **Epidemic curve:** bars of 1, 6 or 12 hours, 1 to 3 days, or weeks starting Monday or Sunday, with empty bars kept so gaps show.
- **Summary:** number of cases, first and last onset, the peak bar and the median onset.
- **Incubation:** with a shared exposure time (a meal or event), the shortest, median and longest incubation period, and a marker on the curve.
- **Attack rates:** for each item, the share of eaters and non-eaters who fell ill, the attack-rate ratio with its interval, and Fisher's exact p.

For study and teaching, not medical advice. Check with a qualified professional.

Compare exposed and unexposed groups with the [[odds-risk-ratio|odds ratio and risk ratio calculator]], and model how the outbreak could grow with the [[epidemic-model|epidemic model simulator]].

## How to use it

1. Paste one onset per line as YYYY-MM-DD (add a time such as 2026-06-10 14:30 if you have one), or a date, a comma and a number of cases. Or open a CSV or Excel file.
2. Choose the **bar width**. A width of about a quarter to a third of the usual incubation period shows the shape best: hours for a toxin with a short incubation, days for most bacteria and viruses, weeks for long outbreaks. Hour bars need onset times.
3. Optionally type the **shared exposure**. With dates only, incubation is counted in whole days.
4. In **Attack rates**, paste one row per item: ate and ill, ate and well, did not eat and ill, did not eat and well.
5. Download the curve as PNG, the counts or attack rates as CSV, or a report as an image, PDF or Word file.

## The formulas

The attack rate is ill ÷ (ill + well) in each group. The attack-rate ratio is the attack rate among eaters divided by that among non-eaters, with limits exp(ln RR ± z·SE), SE = √(1/a − 1/(a + b) + 1/c − 1/(c + d)). Fisher's exact test gives the probability of a table at least as unusual as the one seen if the item made no difference.

## Worked example

The made-up outbreak has 44 cases from 2026-06-08 to 2026-06-17. With daily bars the page shows a peak on 2026-06-12 with 12 cases and a median onset of 2026-06-12. With the shared meal on 2026-06-07, the incubation runs from 1 to 10 days with a median of 5 days. Weekly bars from Monday give 41 cases in the week of 8 June and 3 in the next.

In the made-up food table, 38 of 58 people who ate the chicken salad fell ill (65.5 %) against 6 of 42 who did not (14.3 %): an attack-rate ratio of 4.59 (95 % interval 2.14 to 9.85), Fisher p < 0.001. Rice, fruit and ice cream show no clear link.

## Tips

- Use the onset of symptoms, not the date of the test or report.
- Keep empty days in the picture: gaps are information.
- The item behind the outbreak usually has a high attack rate among eaters, a low one among non-eaters, and accounts for most cases.

## Frequently asked questions

**Which date format can I use?** Year first: 2026-06-10 or 2026/06/10, with an optional time. Day-first dates such as 10/06/2026 are refused because they are easy to misread.

**Why are times shown without a time zone?** Times are taken as typed and never shifted, so a case at 23:30 stays on its own day.

**Is my data stored?** No. Everything is worked out in your browser and nothing is sent anywhere.

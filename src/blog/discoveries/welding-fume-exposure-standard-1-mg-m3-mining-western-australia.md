---
title: "Welding fume exposure in mining after the 1 mg/m³ standard: 8-hour TWA"
summary: "A 2025 open-access study of 4,035 welding fume samples from Western Australian mines found about 70% above the new 1 mg/m³ limit. Here is how to work a shift's TWA."
tools: [exposure-twa]
updated: 2026-11-10
sources:
  - "Oosthuizen M, Staples K, Liebenberg A, Padamsey K, Cattani M, McCarthy A, Oosthuizen J (2025), Welding Fume in the Western Australian Mining Industry: Impact of a Change to the Workplace Exposure Standard, International Journal of Environmental Research and Public Health 22(8): 1238. Open access under the Creative Commons Attribution (CC BY) license, as stated on the publisher's page, checked 2026-11-10."
  - "Brief RS and Scala RA (1975), Occupational exposure limits for novel work schedules, American Industrial Hygiene Association Journal 36: 467-469 (the long-shift adjustment)."
paper:
  title: "Welding Fume in the Western Australian Mining Industry: Impact of a Change to the Workplace Exposure Standard"
  authors: "Oosthuizen M, Staples K, Liebenberg A, Padamsey K, Cattani M, McCarthy A, Oosthuizen J"
  journal: "International Journal of Environmental Research and Public Health"
  year: 2025
  doi: "10.3390/ijerph22081238"
  url: "https://www.mdpi.com/1660-4601/22/8/1238"
  licence: "CC BY"
  reviewed: true
---

Welding makes a fine smoke of metal oxide particles, called welding fume, that workers can breathe in. Health agencies class welding fume as a cause of lung cancer in people, and in 2024 Australia cut its workplace exposure standard for welding fume from 5 to 1 milligram per cubic metre of air (mg/m³), averaged over an 8-hour day. A 2025 open-access study looked back at nearly four decades of air samples from Western Australian mines to see how many would pass the new limit. The [[exposure-twa]] calculator does the sum at the heart of that question: it turns a worker's sampled periods into an 8-hour time-weighted average (TWA) and compares it with a limit, including the cut that long mining shifts need.

## What they found

The team analysed a database of more than 10,800 welding fume samples taken in the state's mines from 1986 to 2024, and used the 4,035 samples from 2018 to 2024 to check compliance. The paper reports that about 70% of those recent samples were above the new 1 mg/m³ standard, and about 21% were above even the old 5 mg/m³ standard.

The share above the new limit varied by the mineral being mined, from just under half in nickel operations to almost 90% in rare earth operations. The authors also found no sign of a downward trend: their model suggests the average result rose by about 1.5% a year.

## Why it matters

A lower limit only protects workers if real exposures come down to meet it. These results suggest that, at least on paper, most sampled welding work in the state's mining industry would need better controls, such as local exhaust ventilation (extraction at the arc), fume-reducing welding methods, or powered air-purifying respirators (PAPRs) built into the welding helmet. Other countries are reviewing their own limits, so the study gives a sense of the gap that can open up when a standard is tightened.

## How they did it

The samples were collected by personal air sampling: a small pump worn by the worker draws air through a filter in a sampling head near the breathing zone, and the filter is weighed afterwards. The method collects the inhalable fraction, all the particles small enough to be breathed in through the nose and mouth. The authors then adjusted results for the long rosters common in mining, often 12-hour shifts on many days in a row, and compared them with both the old and new standards. They split the data by mineral, job role and surface or underground work.

## Check it yourself with fibub

The shift below is **our own invented example**, not data from the paper. A welder on a 12-hour shift wears a sampler for four periods, with a 30-minute break unsampled:

| Period | Task | Welding fume (mg/m³) |
|---|---|---|
| 06:00 to 08:00 | Preparation | 0.5 |
| 08:00 to 11:30 | Welding | 1.6 |
| 12:00 to 15:00 | Welding | 1.4 |
| 15:00 to 18:00 | Clean-up | 0.3 |

**Step 1: enter the periods.** In the calculator, type one period per line as start, end and concentration, with the task name at the end (for example `08:00 11:30 1.6 Welding`). Choose mg/m³ as the unit, set the shift length to 12 hours, and set *Time not sampled* to **Counts as zero exposure**, since nobody was welding during the break.

**Step 2: the TWA.** Each period's concentration times its minutes adds up to 702 mg·min/m³ (60 + 336 + 252 + 54). Divided by 480 minutes, the 8-hour TWA is **1.46 mg/m³**. Type 1 as the 8-hour limit: the worker is at about **1.46 times** the new standard. Change the limit to 5 and the same shift sits at under a third of the old one, which is exactly the kind of switch from pass to fail the paper describes.

**Step 3: the long-shift adjustment.** A 12-hour shift means more time breathing fume and less time to recover. With the limit back at 1, choose **Brief and Scala, daily**. The tool cuts the limit by a factor of (8 / 12) × (24 − 12) / 16 = **0.5**, to 0.5 mg/m³, and compares it with the 12-hour shift average of 702 / 720 = **0.98 mg/m³**. The shift is now at almost **twice** the adjusted limit. Try **Brief and Scala, weekly** with 84 hours per week (seven 12-hour shifts) and the limit drops further, to about 0.31 mg/m³.

**Step 4: what if the break was not clean?** Switch *Time not sampled* to **At the sampled average**. The break is then filled in at the sampled average of 1.02 mg/m³, and the TWA rises to about **1.53 mg/m³**. That shows why unsampled time needs a stated, honest assumption.

## The fine print

- The sampling head was often outside the welding helmet, and the database does not record which workers wore a PAPR. Some samples above the limit may overstate what the worker actually breathed.
- Inhalable sampling catches all particles, including dust from nearby grinding, so not every milligram is welding fume.
- The data were collected for routine compliance checks, not designed for research, and the paper does not describe its TWA or shift-adjustment method in detail.
- A few counts in the text do not match each other exactly; the main 2018 to 2024 figures are the clearest.
- Exposure limits and the rules for long shifts differ between countries and change over time. This is general education, not safety advice: check the official source, and ask a qualified occupational hygienist to assess a real workplace.

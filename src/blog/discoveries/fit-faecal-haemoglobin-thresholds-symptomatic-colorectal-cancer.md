---
title: "FIT thresholds for triage of symptomatic colorectal cancer referrals"
summary: "A 2025 New Zealand pilot tested a stool blood test (FIT) on 1,043 people referred with bowel symptoms. Here is how to rework its cut-off trade-offs with a free calculator."
tools: [diagnostic-test-calculator, roc-curve]
updated: 2026-11-10
sources:
  - "Saw KS, Ngatai L, Whiteside C, Parry S, Bissett I (2025), Faecal immunochemical test to triage patients with possible colorectal cancer symptoms: insights from the New Zealand FIT for symptomatic pilot, Frontiers in Gastroenterology 4: 1622258. Open access under the Creative Commons Attribution License (CC BY), as stated on the publisher's page, checked 2026-11-10."
  - "Altman DG and Bland JM (1994), Diagnostic tests 1 and 2, BMJ 308: 1552 and 309: 102 (sensitivity, specificity and predictive values)."
paper:
  title: "Faecal immunochemical test to triage patients with possible colorectal cancer symptoms: insights from the New Zealand FIT for symptomatic pilot"
  authors: "Saw KS, Ngatai L, Whiteside C, Parry S, Bissett I"
  journal: "Frontiers in Gastroenterology"
  year: 2025
  doi: "10.3389/fgstr.2025.1622258"
  url: "https://www.frontiersin.org/journals/gastroenterology/articles/10.3389/fgstr.2025.1622258/full"
  licence: "CC BY"
  reviewed: true
---

When someone sees a doctor with bowel symptoms such as bleeding or a change in habit, the usual next step is a colonoscopy, a camera test of the large bowel. Colonoscopy lists are long, and most people referred turn out not to have cancer. A faecal immunochemical test (FIT) measures tiny amounts of blood in a stool sample, and a 2025 open-access pilot from New Zealand asked how well a single FIT sorts referred patients into higher and lower risk. The answer depends on where you set the cut-off, and the [[diagnostic-test-calculator]] lets you see that trade-off for yourself from four counts.

## What they found

The team sent a FIT kit to 1,413 patients referred for possible colorectal cancer in two health districts, and 1,043 had both a valid FIT result and a full colonoscopy. Of those, 32 had colorectal cancer. FIT reports faecal haemoglobin in micrograms per gram of stool (µg Hb/g), and the paper looked at five cut-offs: 4, 10 and 20 as possible "rule-out" levels, and 100 and 150 as "rule-in" levels.

At the lowest cut-off of 4 µg/g, the authors report that the test picked up about 94% of the cancers and that roughly three in four patients had a negative result. The share of negative-result patients who were truly cancer-free (the negative predictive value) was above 99%. At 150 µg/g, sensitivity fell to about 78%, but specificity rose to about 96%, and around 37% of the people above that line had cancer. The overall area under the ROC curve was about 0.93.

FIT did much less well for other important findings, such as inflammatory bowel disease and high-risk polyps, and the authors say it should not be used to rule those out.

## Why it matters

A good rule-out test could let a service put patients with very low blood levels on a slower track and see the highest-risk patients faster. The catch is that no cut-off catches every cancer: even at 4 µg/g, two of the 32 cancers in this study were missed. Health services in several countries already use FIT this way, and each needs local numbers to pick a cut-off that balances missed cancers against colonoscopy demand.

## How they did it

The study was double-blinded: neither the patients nor the doctors doing the colonoscopy knew the FIT result. Each patient returned one stool sample, tested on a single quantitative analyser. Colonoscopy served as the reference standard, the best available way of knowing who really had cancer. For each cut-off the team counted true and false positives and negatives, then worked out sensitivity, specificity, predictive values and the number of colonoscopies needed to find one cancer.

## Check it yourself with fibub

The numbers below are **our own invented example**, chosen to be easy to follow. They are not the paper's data.

**Step 1: a low cut-off.** Imagine 500 referred patients, 20 of whom have cancer (4%). At a low cut-off, 19 cancers test positive and 1 is missed; 75 cancer-free people test positive and 405 test negative. Open the calculator, keep **2 × 2 table**, and type 19 true positives, 75 false positives, 1 false negative and 405 true negatives. Leave the intervals on *Exact (Clopper-Pearson)* at 95%.

The calculator shows sensitivity **95.0%** (exact interval 75.1% to 99.9%), specificity **84.4%**, PPV **20.2%** and NPV **99.75%**. The negative likelihood ratio is about **0.059**. With only 20 cancers the sensitivity interval is wide, and the real study, with 32, has the same problem.

**Step 2: a high cut-off.** Now change the counts to 17, 20, 3 and 460. Sensitivity drops to **85.0%**, but specificity climbs to **95.8%** and the PPV more than doubles to **45.9%**. The positive likelihood ratio rises from about 6.1 to **20.4**.

**Step 3: colonoscopies per cancer found.** The calculator does not show this one, but it is a quick division: positives divided by true positives. At the low cut-off, (19 + 75) / 19 = **4.9** colonoscopies per cancer. At the high cut-off, 37 / 17 = **2.2**. The paper reports the same kind of figure, falling from about 9 at 4 µg/g to under 3 at 150 µg/g in its own data.

**Step 4: a different setting.** Switch to **Sensitivity and specificity** and type 90, 85 and a prevalence of 3. The calculator expects 27 true positives and 145.5 false positives per 1,000 people, so the PPV is only **15.7%**. A test that looks good in a study still sends many cancer-free people for colonoscopy when cancer is uncommon.

If you have raw FIT values with the colonoscopy outcome for each person, paste them into the [[roc-curve]] tool instead: it lists every possible cut-off with its sensitivity and specificity, so you can choose a line rather than test one at a time.

## The fine print

- Only 32 cancers were found, so every accuracy figure has a wide confidence interval. The authors note the study was not formally powered.
- About 18% of invited patients did not return a valid sample, and return rates were lower among men, people under 50, and Māori and Pacific patients. The people tested may not represent everyone referred.
- Patients came from secondary care in two districts and used one brand of analyser; other assays and settings can give different numbers.
- 115 people with a valid FIT were left out because their colonoscopy was incomplete.
- This is general education, not medical advice. Anyone with bowel symptoms should talk to a qualified professional, and screening and referral rules differ by country, so check the official source.

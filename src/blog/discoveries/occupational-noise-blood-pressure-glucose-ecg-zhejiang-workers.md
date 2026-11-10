---
title: "Occupational noise, blood pressure and ECG changes in 64,000 workers"
summary: "A 2026 open-access study of 64,382 Chinese workers links each extra decibel of daily noise to slightly higher blood pressure, glucose and ECG changes. Here is how to turn a shift into a noise dose yourself."
tools: [noise-dose, decibel-distance]
updated: 2026-11-10
sources:
  - "Tan Q, Hu Y, Xue P, Li F, Wei F, Xie H, Zhou Z, Quan C, Wang D, Zou H, Lou X and Zhou L (2026), Occupational noise exposure and cardiovascular disease risk factors in China: mediating role of hearing loss, Frontiers in Public Health 14, 1901898. Open access, CC BY. Details checked on the publisher's PDF, 2026-11-10."
  - "Noise dose D = 100 × Σ tᵢ/Tᵢ with Tᵢ = 8 h / 2^((Lᵢ − 85)/3), and the 8-hour TWA: NIOSH (1998), Criteria for a Recommended Standard: Occupational Noise Exposure. Check the official source for the rules where you work."
paper:
  title: "Occupational noise exposure and cardiovascular disease risk factors in China: mediating role of hearing loss"
  authors: "Tan Q, Hu Y, Xue P, Li F, Wei F, Xie H, Zhou Z, Quan C, Wang D, Zou H, Lou X, Zhou L"
  journal: "Frontiers in Public Health"
  year: 2026
  doi: "10.3389/fpubh.2026.1901898"
  url: "https://doi.org/10.3389/fpubh.2026.1901898"
  licence: "CC BY"
  reviewed: true
---

Loud workplaces damage hearing; that much is long settled. Whether the same noise also nudges up blood pressure and blood sugar is harder to show, because the effects are small and need very large groups. A 2026 open-access study in *Frontiers in Public Health* uses health-check data from 64,382 workers in Zhejiang Province, China, and finds small but steady links between daily noise level and several heart-related measures. Everything in it starts from one number per worker, the 8-hour average noise level, and the [[noise-dose|noise dose calculator]] shows how that number is built from a real shift. The [[decibel-distance]] tool helps with the step before: how loud a machine is where the worker actually stands.

## What they found

The average 8-hour level was about 84.6 dB(A) for the 51,056 workers counted as noise-exposed and about 77.3 dB(A) for the 13,326 who were not. Higher noise went with slightly higher fasting blood glucose and systolic blood pressure, and with more abnormal electrocardiograms (ECGs, the recording of the heart's electrical activity). The authors report an odds ratio of about 1.014 per decibel for an abnormal ECG: roughly 1.4 per cent higher odds for every extra dB.

For glucose and ECG changes the link was not a straight line. The curves bent upward at around 81 to 82 dB(A), below China's 85 dB(A) workplace limit. The links were stronger in workers over 43, in those also exposed to dust or heat, and in those with more than five years in the job. Hearing loss explained only a small part (about 4 to 11 per cent) of the links with blood pressure and ECG changes, so most of the link with the heart measures does not run through damaged hearing.

## Why it matters

Workplace noise limits were set to protect hearing. If heart-related changes start at lower levels, that is an argument for keeping noise down even where hearing rules are already met. This is general education, not medical advice: a study like this describes patterns in a population, not risk for any one person.

## How they did it

The data came from a 2024 provincial surveillance programme for occupational disease. Workers wore personal noise dosimeters, small meters clipped near the ear, that report an A-weighted level averaged over the shift and scaled to 8 hours, written L_Aeq,8h. "A-weighted" means the meter counts each pitch roughly as loudly as the ear hears it. Each company's exposure was then taken as the average of its measured workers. Blood tests, blood pressure, ECGs and hearing tests came from the same health checks. The team used regression models, flexible spline curves to find where the dose-response bends, and mediation analysis to ask how much of each link runs through hearing loss.

## Check it yourself with fibub

The study gives each worker a single L_Aeq,8h. Here is how a day turns into that number, using **an invented shift, not the paper's data**.

1. Open the [[noise-dose]] tool and choose the preset "EU and UK upper action value: 85 dB(A), 3 dB". The exchange rate of 3 dB means the allowed time halves for every 3 dB louder.
2. In the exposures box, one line per task, with times in minutes:
   - `Press line, 92, 90`
   - `Assembly, 84, 240`
   - `Forklift, 88, 90`
   - `Canteen, 70, 60`
3. Read the results. The dose is about **172 per cent**, the 8-hour TWA is about **87.3 dB(A)**, and LEX,8h is the same, **87.3 dB(A)**. The 90 minutes at the press alone use about 95 per cent of the day's allowance.
4. Switch to "US OSHA PEL: 90 dB(A), 5 dB, threshold 90". The same day now scores only about **25 per cent**, with a TWA near **80 dB(A)**, because levels under 90 dB(A) are not counted at all and each 5 dB only halves the time. The rules you pick change the answer a lot.
5. Back on the 3 dB preset, move 30 minutes from the press to assembly (`92, 60` and `84, 270`). The dose falls to about **146 per cent**. Time at the loudest task matters most.

You can also run the paper's headline averages backwards. On the 3 dB rule, an 8-hour level of **84.6 dB(A)** is a dose of about **91 per cent**, and the bend near **82 dB(A)** is a dose of only **50 per cent**: half of what the 85 dB(A) limit allows. On the odds side, 1.014 per dB over 5 dB works out to 1.014⁵ ≈ **1.07**, about 7 per cent higher odds of an abnormal ECG between 80 and 85 dB(A).

## The fine print

This is a cross-sectional study, a snapshot in time, so it shows associations, not cause and effect. Using the company average for every worker can blur individual differences. Glucose data were available for only about 12,000 people. The authors note that the 82 dB(A) turning point needs checking in other groups, and the paper gives slightly different turning points in different places. The effect sizes are small per decibel, and other factors that come with noisy jobs, such as shift work, are hard to separate fully.

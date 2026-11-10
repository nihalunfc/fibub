---
title: "Smartphone accelerometer gait analysis: step time validity against Vicon"
summary: "A 2025 study strapped a phone to the lower back of 26 young adults and found its step and stride times matched motion capture closely, but toe-off timings did not. Here is how to test phone gait data yourself."
tools: [gait-cadence, bland-altman]
updated: 2026-11-10
sources:
  - "Liang SG, Chung HY, Chu KW et al. (2025), Validity and Reliability of a Smartphone-Based Gait Assessment in Measuring Temporal Gait Parameters: Challenges and Recommendations, Biosensors 15(7): 397. Open access under a CC BY licence, checked on the publisher's article page 2026-11-10."
  - "Hausdorff JM (2005), Gait variability: methods, modeling and meaning, J NeuroEng Rehabil 2: 19."
  - "Bland JM and Altman DG (1986), The Lancet 327: 307-310 (limits of agreement)."
paper:
  title: "Validity and Reliability of a Smartphone-Based Gait Assessment in Measuring Temporal Gait Parameters: Challenges and Recommendations"
  authors: "Liang SG, Chung HY, Chu KW, Gao YH, Lau FY, Lai WI, Fong GCH, Kwong PWH, Lam FMH"
  journal: "Biosensors"
  year: 2025
  doi: "10.3390/bios15070397"
  url: "https://www.mdpi.com/2079-6374/15/7/397"
  licence: "CC BY"
  reviewed: true
---

Can the phone in your pocket replace a gait lab? A 2025 study in *Biosensors* put a smartphone on the lower back of healthy young adults and compared its timing of each step with a 16-camera motion capture system. Step time and stride time came out very close to the cameras. Measures that depend on the moment the toes leave the ground were much less reliable. The [[gait-cadence]] tool finds steps in phone accelerometer data the same basic way, and the [[bland-altman]] tool shows how to judge whether two ways of timing steps agree.

## What they found

The phone's step time (the time from one heel strike to the next, both legs together) correlated with the camera system at r = 0.977, and stride time (heel strike to the next heel strike of the same foot) at r = 0.969. The average error for timings based only on heel strikes was small.

Toe-off was the weak point. Heel-strike timings were off by about 0.01 s on average, but toe-off timings by about 0.045 s. Measures built on toe-off, such as stance, swing and double support, agreed only weakly to moderately, and proportions such as "swing as a share of the gait cycle" did not agree in any useful way.

Test-retest reliability, checked by repeating the session one to four weeks later, was good for step time (intraclass correlation 0.845) and stride time (0.829), but poor for right step time on its own (0.388). People who walked more steps got better agreement, and the authors recommend at least 100 steps per leg for clinical use.

## Why it matters

Gait labs are expensive and rare, while almost everyone carries a phone. Step and stride timing matter in rehabilitation, fall-risk research and sport. This study suggests a phone handles the basic rhythm of walking well, but not yet the finer phases of each step.

## How they did it

Twenty-six students (13 men and 13 women, about 21 years old) walked at their preferred speed along a lab walkway. A Samsung Galaxy S22 sat flat against the lower back at about the L4-L5 level, held by an elastic belt, recording at over 400 Hz, later cut down to 100 Hz. At the same time, a Vicon camera system tracked 39 reflective markers on the body as the reference. A Bluetooth signal from the phone lined up the two clocks.

The team smoothed the forward-backward acceleration with a Butterworth low-pass filter at 2 Hz, then marked heel strikes at its low points and toe-offs at its high points, and used the gyroscope to tell left steps from right. The first and last three steps of each walk were left out, since people speed up and slow down there. They compared phone and camera with correlations and Bland-Altman analysis, and judged repeatability with intraclass correlations.

## Check it yourself with fibub

**Step 1: see how processing settings change the answer.** The gait cadence page opens with its own made-up 20-second walk, sampled 50 times a second. With the default low-pass cut-off of 3 Hz, it finds 37 steps, a cadence of 111.2 steps/min and a step-time CV (SD ÷ mean) of 2.87%.

1. Change the **Low-pass cut-off** to 2 Hz, the value used in the paper. The step count stays at 37 and cadence barely moves (111.0 steps/min), but the step-time CV falls to **2.72%**.
2. Now try 5 Hz. Cadence is again 111.2 steps/min, but the CV rises to **3.60%**.

Cadence is robust; variability is not. A smoother filter makes steps look more regular, so always report the filter you used.

**Step 2: why 100 steps matters.** The example has a step-time SD of about 15.5 ms. The uncertainty of the mean step time (the standard error, SD ÷ √n) is about 2.6 ms with 36 step intervals, 1.6 ms with 100 and 1.1 ms with 200. Longer walks give steadier averages, which matches the paper's subgroup finding.

**Step 3: compare phone with a reference.** The numbers below are **our own invented mean step times** for 8 walkers, in milliseconds, not the paper's data.

| Walker | Phone (ms) | Camera (ms) |
|---|---|---|
| 1 | 510 | 512 |
| 2 | 541 | 538 |
| 3 | 544 | 547 |
| 4 | 558 | 561 |
| 5 | 527 | 529 |
| 6 | 579 | 575 |
| 7 | 550 | 553 |
| 8 | 586 | 590 |

Paste the phone column as method A and the camera column as method B in the Bland-Altman tool, with `ms` as the unit. The bias is **−1.25 ms** (95% CI −3.77 to +1.27), so on average the phone reads very slightly short, but the interval includes zero. The limits of agreement are **−7.15 to +4.65 ms**: for most walkers the phone would be within about 7 ms of the camera. For a study of step-time variability, where group differences can be only a few milliseconds, that might not be good enough.

## The fine print

- The walkers were healthy young students. People with Parkinson's disease, after a stroke or using walking aids may give harder signals.
- Only straight, level walking at a comfortable pace indoors, with a limited number of steps per trial, so gait variability could not be studied.
- One phone model, one placement and one step-finding method. Other phones, pockets or algorithms may do better or worse.
- The fibub tool works on the overall size of the acceleration and finds peaks, which is a simpler method than the paper's. It gives cadence and step timing, not toe-off or stance phases.
- This is general education about gait measurement, not a medical assessment.

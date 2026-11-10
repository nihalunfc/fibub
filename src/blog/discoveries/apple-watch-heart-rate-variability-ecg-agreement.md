---
title: "Apple Watch heart rate variability against ECG: a Bland-Altman check"
summary: "A 2025 open-access study compared pulse intervals from a smartwatch with a lab ECG in 78 adults. Agreement was close at rest and weaker after walking. Here is how to test that kind of claim yourself."
tools: [bland-altman, reliability-analysis, sample-size]
updated: 2026-11-10
sources:
  - "Bonneval L, Wing D, Sharp S et al. (2025), Validity of Heart Rate Variability Measured with Apple Watch Series 6 Compared to Laboratory Measures, Sensors 25(8): 2380. Open access under CC BY 4.0, as stated on the publisher's article page, checked 2026-11-10."
  - "Bland JM and Altman DG (1986), The Lancet 327: 307-310 (the limits of agreement method)."
  - "Lin LI (1989), Biometrics 45: 255-268 (the concordance correlation coefficient)."
paper:
  title: "Validity of Heart Rate Variability Measured with Apple Watch Series 6 Compared to Laboratory Measures"
  authors: "Bonneval L, Wing D, Sharp S, Tristao Parra M, Moran R, LaCroix A, Godino J"
  journal: "Sensors"
  year: 2025
  doi: "10.3390/s25082380"
  url: "https://www.mdpi.com/1424-8220/25/8/2380"
  licence: "CC BY"
  reviewed: true
---

How close is a smartwatch's heart rhythm reading to a proper lab recording? A 2025 study in the journal *Sensors* put one popular watch side by side with an electrocardiogram (ECG) and found that it agreed well when people lay still, and less well straight after a walk. The paper is open access under a CC BY licence. Comparing two methods that measure the same thing is what the [[bland-altman]] tool is built for, and it runs in your browser.

## What they found

The team recorded 78 healthy adults while each wore an Apple Watch Series 6 on the left wrist and was wired to a three-lead lab ECG. The watch does not see the heart's electrical signal. It shines light into the skin and picks up the pulse wave, so what it measures is strictly *pulse* rate variability, a stand-in for heart rate variability.

At rest, lying on their backs, the watch's average beat-to-beat interval was very close to the ECG's. The authors report a mean bias of about −1.7 milliseconds and a concordance coefficient of 0.991. Heart rate in beats per minute agreed just as well. After a short walk the picture changed: the bias on the beat interval grew to roughly −33 ms and the concordance fell to about 0.88. The beat-to-beat intervals that depend on individual "normal" beats (called N-N intervals) agreed poorly even at rest, with a typical miss of about 31%.

## Why it matters

Heart rate variability (HRV) is used in research on stress, sleep, fitness and recovery. If a cheap wrist device gives the same answer as an ECG, large studies can run outside the lab for weeks at a time. This paper suggests that is reasonable for still, resting readings and much less certain when the body is moving or just after exercise.

## How they did it

Each person went through five short conditions: lying at rest, holding a conversation, watching a film clip, standing before a walk and standing just after it. The three-lead ECG was the reference, and each watch value was paired with the ECG value from the same minutes.

They then used three measures of agreement. The **Bland-Altman** approach looks at the difference between the two methods for each person: the average difference is the bias, and the spread of differences gives the limits of agreement, the range expected to hold about 95% of them. The **mean absolute percentage error** gives the typical miss. **Lin's concordance correlation coefficient** (CCC) scores how close the points sit to the line where both methods give the same number, with 1 meaning perfect.

## Check it yourself with fibub

The numbers below are **our own invented readings**, not the paper's data. Picture 12 people whose average beat-to-beat interval was measured by a watch and by an ECG at the same time, in milliseconds.

| Person | ECG (ms) | Watch (ms) |
|---|---|---|
| 1 | 812 | 818 |
| 2 | 845 | 840 |
| 3 | 790 | 801 |
| 4 | 930 | 921 |
| 5 | 1005 | 1012 |
| 6 | 760 | 772 |
| 7 | 880 | 874 |
| 8 | 955 | 948 |
| 9 | 700 | 712 |
| 10 | 1040 | 1029 |
| 11 | 865 | 877 |
| 12 | 910 | 905 |

1. Open the Bland-Altman tool and paste two columns over the sample: the watch first (method A), then the ECG (method B), with a header row such as `Watch ECG`.
2. Type `ms` as the unit. Leave the scale on *Difference (A − B)*, the x axis on the mean of the two, and the limits at 95%.
3. Read the result. For these readings the bias is **1.42 ms** (95% CI −4.49 to 7.32 ms), so on average the watch is not clearly off. The SD of the differences is 9.30 ms, which gives limits of agreement of **−16.8 to 19.6 ms**.
4. Look at the intervals on the limits. With only 12 pairs the lower limit could be anywhere from about −31 to −10 ms (exact method). That is why method studies need dozens of people, and the [[sample-size]] tool helps plan how many.
5. Check the proportional bias line. Here its slope is −0.062 with p = 0.023: the watch tends to read a little long when the true interval is short (a faster heart) and a little short when it is long.
6. Note Lin's CCC: 0.995 for these made-up pairs. Compare that with the paper's 0.991 at rest and about 0.88 after walking, and you can see how much room a "good" coefficient still leaves.

With repeat readings from each person, the [[reliability-analysis]] tool adds an intraclass correlation.

## The fine print

- One watch model and one software version were tested.
- All 78 people were healthy adults aged 20 to 75. People with irregular heart rhythms were not the focus, and that is where wrist readings are hardest.
- Each condition was a short recording, and the paper reports that some readings were missing or unusable; check its tables for how many.
- The authors define their limits of agreement with the standard error of the differences rather than the usual SD, so recompute the limits from their bias and SD if you want to compare studies.
- This is general education about measurement, not health advice. For exact values and methods, read the paper itself.

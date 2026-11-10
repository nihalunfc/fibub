---
title: "Chikungunya in Foshan 2025: R0 and doubling time of the early outbreak"
summary: "A 2025 open-access study of the Foshan chikungunya outbreak estimated a doubling time of 3.5 days and a very high R0. Here is how to explore what those numbers mean."
tools: [epidemic-model, herd-immunity, epi-curve]
updated: 2026-11-10
sources:
  - "Zhang M, Li Y, Huang X et al. (2025), Epidemiological characteristics and transmission dynamics of the early stage Chikungunya fever outbreak in Foshan City, Guangdong Province, China in 2025, Infectious Diseases of Poverty 14: 93. Open access under a Creative Commons Attribution 4.0 International License, as stated on the PMC copy, checked 2026-11-10."
  - "Wallinga J and Lipsitch M (2007), How generation intervals shape the relationship between growth rates and reproductive numbers, Proceedings of the Royal Society B 274: 599-604 (the growth-rate formula used below)."
paper:
  title: "Epidemiological characteristics and transmission dynamics of the early stage Chikungunya fever outbreak in Foshan City, Guangdong Province, China in 2025"
  authors: "Zhang M, Li Y, Huang X, Liu M, Jiang S, Zeng B, Ouyang L, Huang J, Mai B, Guan Q, Zeng J, Fu M, Zhuo B, Liu Y, Zeng Q, Zhu N, Wang T, Huang X, Pan Y, Cheng M, Jia P, Peng X, Duan J, Li B, He J, Zhang Y, Zhou L, Kang M, Xiao J, Yang Z, Li Y"
  journal: "Infectious Diseases of Poverty"
  year: 2025
  doi: "10.1186/s40249-025-01364-y"
  url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12424219"
  licence: "CC BY 4.0"
  reviewed: true
---

In the summer of 2025 the city of Foshan in southern China had a fast-growing outbreak of chikungunya. Chikungunya is a virus spread by *Aedes* mosquitoes; it causes fever and painful joints that can last for months. A team of Chinese public health researchers published an open-access account of the first weeks, with the outbreak's speed expressed as a doubling time and a basic reproduction number (R0). You can get a feel for what those two numbers imply with the [[epidemic-model]] and [[herd-immunity]] tools, and draw your own case counts by date with the [[epi-curve]] tool.

## What they found

By late July 2025, 4,754 local cases had been confirmed by laboratory test (RT-PCR), most of them in Shunde District. The paper reports a median age of 44, roughly equal numbers of men and women, and the highest rate per 100,000 people in those aged 65 and over.

In the early phase, cases grew by about 20% a day, which the authors convert into a doubling time of about 3.5 days. Their main estimate of R0, the average number of new cases caused by one case in a fully susceptible population, was about 16.3 (95% interval 15.0 to 17.5). That is far higher than the 5.5 the authors cite for a 2010 chikungunya outbreak in nearby Dongguan.

The paper also notes that the time from falling ill to being reported shrank from a median of 4 days to 1 day as testing and mosquito control were stepped up.

## Why it matters

A doubling time of a few days leaves very little room to respond. An R0 of about 16 also means that, in theory, almost everyone would need to be immune to stop spread by immunity alone, so the realistic levers are mosquito control and fast case finding. Southern China, like much of the tropics and subtropics, has the *Aedes albopictus* mosquito, and its range is spreading with warmer weather, so these early numbers help planners elsewhere judge how fast a first outbreak could move.

## How they did it

The team used surveillance records of confirmed cases and their dates of symptom onset. They fitted an exponential curve to the early rise to get the growth rate, then turned the growth rate into R0. That step needs the generation time, the average gap between one person being infected and the people they infect. For a mosquito-borne virus this includes time inside the mosquito, so the authors assumed a long generation time of about two weeks. They checked R0 with a second method and with different start and end dates.

## Check it yourself with fibub

Everything below uses **our own invented numbers**, not the paper's data.

**Step 1: growth rate to R0.** Suppose an outbreak's case counts grow by 15% a day (r = 0.15 per day). The doubling time is ln 2 / r = 0.693 / 0.15 = **4.6 days**. If the generation time has a mean of 12 days and a standard deviation of 6, the Wallinga and Lipsitch formula for a gamma-shaped generation time, R = (1 + r × SD² / mean)^(mean² / SD²), gives R = (1 + 0.15 × 36 / 12)^4 = 1.45^4 ≈ **4.4**. Lengthen the mean generation time and the same growth rate gives a bigger R0, which is why the long mosquito cycle pushes the Foshan estimate so high.

**Step 2: run an outbreak.** Open the epidemic model, choose **SEIR (with a latent stage)**, and type population 100000, R0 6, latent period 5 days, infectious period 7 days, 10 initial infectious cases and 200 days to run. The infectious curve peaks around **day 43** with about **29,300** people infectious at once, and almost everyone (**99.7%**) is infected by the end. In the early part of the run, daily new infections double about every **3 days**.

**Step 3: add control.** In the interventions box type `30, 200, 60`, a 60% contact cut from day 30. The peak drops to about **16,200** and the final share infected to about **90%**. Change it to `30, 200, 85`: R0 times 0.15 is 0.9, below 1, so the curve turns soon after day 30 and the share infected falls to about **48%**. Starting control late still leaves a large outbreak; the earlier the cut, the bigger the gain.

**Step 4: the immunity line.** In the herd immunity tool, type R0 6 and vaccine effectiveness 90%. The threshold is 1 − 1/6 = **83.3%** immune, and the coverage needed is 92.6%. Now try R0 16: the threshold is **93.75%**, and with a 90% effective vaccine the coverage needed is over 100%, so vaccination alone could not reach it.

**Step 5: your own curve.** If you have onset dates for a local outbreak, paste them into the epidemic curve tool with 1-day bars to see the rise, the peak and the median onset date.

## The fine print

- fibub's epidemic model spreads infection directly from person to person. Chikungunya goes through mosquitoes, so the model is a rough stand-in for teaching, not a fit to this outbreak.
- The R0 estimate depends heavily on the assumed generation time; a shorter one would give a smaller R0.
- Passive surveillance misses mild cases, and the authors say early under-reporting may have pushed R0 upwards.
- The study covers the first weeks only and did not estimate how R changed as control measures started.
- This is general education, not medical advice. For travel or health questions about chikungunya, check the official source in your country.

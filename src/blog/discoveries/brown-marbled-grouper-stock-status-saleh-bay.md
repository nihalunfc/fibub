---
title: "Brown-marbled grouper growth, maturity and stock status (LB-SPR) in Indonesia"
summary: "A 2025 study of brown-marbled grouper in Saleh Bay, Indonesia, finds the stock below its spawning potential target. Here is how to explore fishing pressure with yield per recruit."
tools: [yield-per-recruit, von-bertalanffy-fitter, fish-length-weight]
updated: 2026-11-10
sources:
  - "Herdiana Y, Coulson PG, Tweedley JR, Wiryawan B, Wisudo SH, Loneragan NR (2025), Fishes 10(12): 611, CC BY, the paper described here. Title, authors, volume, article number and licence checked on the publisher's page, 2026-11-10."
  - "Yield per recruit: Beverton and Holt (1957), On the Dynamics of Exploited Fish Populations. F0.1: Gulland and Boerema (1973). Length-based spawning potential ratio (LB-SPR): Hordyk et al. (2015), ICES Journal of Marine Science 72: 217-231."
paper:
  title: "Growth, Reproductive Parameters and Stock Status of Brown-Marbled Grouper Epinephelus fuscoguttatus, a Commonly Targeted Grouper in Saleh Bay, Indonesia"
  authors: "Herdiana Y, Coulson PG, Tweedley JR, Wiryawan B, Wisudo SH, Loneragan NR"
  journal: "Fishes"
  year: 2025
  doi: "10.3390/fishes10120611"
  url: "https://www.mdpi.com/2410-3888/10/12/611"
  licence: "CC BY"
  reviewed: true
---

The brown-marbled grouper is a big, blotchy reef fish prized in the live-fish trade across Southeast Asia. Like many groupers, it grows slowly and starts life as a female, turning male only when large. That makes it easily overfished. A November 2025 paper in *Fishes* pulled together six years of landings and new biological samples from Saleh Bay, on the island of Sumbawa in Indonesia, to ask how the local stock is doing. The answer: better than an earlier estimate suggested, but still below the target set for managing the bay's groupers and snappers. To explore how fishing pressure and catch size change the yield from a stock like this, try the [[yield-per-recruit]] calculator. Fit the growth curve it needs with the [[von-bertalanffy-fitter]], and turn lengths into weights with the [[fish-length-weight]] tool.

## What they found

Half of the sampled fish were mature at about 49 cm total length (both sexes together). Growth fitted to ear-stone (otolith) ages was slow, with a growth coefficient K of about 0.12 per year and an asymptotic length near 86 cm.

The key result is the spawning potential ratio, or SPR. This compares the eggs a fished population produces over its life with what it would produce if nobody fished it. The study puts SPR between 0.13 and 0.28 depending on the year. That is below the local target of 0.30. Fishing mortality was roughly twice natural mortality. Earlier estimates had put SPR much lower, at 0.05 to 0.07, mostly because they used the larger maturity size.

## Why it matters

An SPR well below 0.3 is often read as a sign that a stock cannot keep replacing itself at the current catch. Groupers are especially exposed. Fishers tend to take the largest fish, and in this species those are the males. A better maturity size changed the picture a lot, showing how much an assessment leans on one biological number.

## How they did it

1. Enumerators recorded lengths of grouper landed in Saleh Bay from 2017 to 2022. A separate biological sample in 2020 and 2021 was cut short by COVID-19.
2. For the biological fish, the team weighed them, staged their gonads by eye and read the rings in their otoliths. Opaque bands were assumed to form once a year.
3. Growth was fitted two ways: a von Bertalanffy curve to otolith ages, and a length-frequency method. The otolith sample lacked the largest fish, so the length-frequency values were used in the stock assessment.
4. Natural mortality was taken from thirteen published rules of thumb that link it to growth, size and lifespan.
5. A length-based SPR model compared each year's landed lengths with what an unfished population would show.

## Check it yourself with fibub

The SPR model used in the paper is not on fibub. Yield per recruit asks a related question, though. It follows one batch of young fish through life and adds up the weight caught at each level of fishing.

**Our own rounded, made-up values** for a slow-growing reef fish, not the paper's estimates: natural mortality M = 0.25 per year, K = 0.12 per year, t₀ = −1.5 years, asymptotic weight W∞ = 12,000 g, recruitment at age 1, first capture at age 5 and a maximum age of 30. In this made-up fish, age 5 corresponds to about 46 cm.

1. Type those values into the yield per recruit boxes, and set the current fishing mortality F to 0.5, twice M.
2. Read the headline: **F0.1 = 0.271 per year and Fmax = 1.99 per year.** F0.1 is the point where extra fishing starts adding very little catch. It is a cautious target.
3. Read the current F line: 668 g per recruit, at 1.85 × F0.1. At F0.1 the yield is 590 g per recruit. Fishing 85 % harder than F0.1 buys only about 13 % more catch.
4. Look at the best age at first capture at the current F. It is about 4.55 years, very close to the age 5 already in use, so in pure yield terms catch size looks fine.
5. Now set the age at first capture to 7 (about 55 cm in our made-up fish, taking an asymptotic length of 86 cm, above the size at maturity). F0.1 rises to 0.330 and there is no Fmax at all up to F = 5. At F = 0.5, yield drops to 591 g per recruit, but every fish caught has had a chance to spawn.

Step 5 shows what yield per recruit leaves out. It counts kilograms, not eggs, so it can favour catching fish before they breed. That gap is exactly why the paper used SPR. Use yield per recruit to see the cost in catch of a size limit, and an SPR model to see the gain in spawning.

## The fine print

- The biological sample was small, at 116 fish, with few large fish and few males. Growth and sex-specific maturity are uncertain.
- Maturity came from looking at gonads, not from microscope sections, and only one size at maturity could be used.
- Yearly band formation in the otoliths was assumed from related species, not checked in this one.
- The thirteen natural mortality rules disagreed, and several depend on the same growth figures, so their agreement is less independent than it looks.
- The species changes sex, which the SPR model does not handle. Removing large males could hurt spawning more than the model shows.
- A few summary numbers differ slightly between sections of the paper. Our values above are made up; use the paper for the real ones.

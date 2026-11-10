---
title: "Measles outbreak in Mexico 2025-2026: Jalisco epicentre and vaccination"
summary: "A 2026 study traced how Mexico's measles outbreak moved from Chihuahua to Jalisco and how cases fell during mass vaccination. Here is how to check the herd immunity sums behind it."
tools: [herd-immunity, epi-curve, epidemic-model]
updated: 2026-11-10
sources:
  - "Sandoval-Pinto E, Cremades R, Pérez-Gómez HR et al. (2026), Spatiotemporal Dynamics of the 2025–2026 Measles Outbreak in Mexico: Jalisco as the Emerging Epicenter and the Impact of Intensive Immunization Efforts, Pathogens 15(6): 572. Open access under a CC BY licence, as stated in the publisher's article, checked 2026-11-10."
  - "Anderson RM and May RM (1985), Nature 318: 323-329 (the herd immunity threshold 1 − 1/R0)."
  - "Fine PEM (1993), Epidemiologic Reviews 15: 265-302 (herd immunity, history and theory)."
paper:
  title: "Spatiotemporal Dynamics of the 2025–2026 Measles Outbreak in Mexico: Jalisco as the Emerging Epicenter and the Impact of Intensive Immunization Efforts"
  authors: "Sandoval-Pinto E, Cremades R, Pérez-Gómez HR, Rivera-Ávila RC, Domínguez Barbosa CA, Premkumar L, Sierra-Díaz E, Martínez-Fernández DE, Regla-Nava JA"
  journal: "Pathogens"
  year: 2026
  doi: "10.3390/pathogens15060572"
  url: "https://www.mdpi.com/2076-0817/15/6/572"
  licence: "CC BY"
  reviewed: true
---

Measles came back to Mexico in 2025. A 2026 paper in *Pathogens* follows the outbreak from its first hotspot in the northern state of Chihuahua to Jalisco, which became the centre of cases early in 2026, and describes how weekly cases fell while millions of vaccine doses were given. The paper is open access under a CC BY licence. Two questions sit under every measles outbreak: how many people must be immune to stop it, and what shape the outbreak takes week by week. The [[herd-immunity]] calculator answers the first and the [[epi-curve]] tool draws the second.

## What they found

Using national surveillance data up to early May 2026, the authors count 6,681 confirmed cases in Jalisco, with 596 people in hospital and 5 deaths. Across the country there were about 17,000 cases from the start of 2025. In Jalisco, weekly cases peaked at 735 in the sixth week of 2026 and then fell steadily.

Most cases were in people who had not been vaccinated: about 63% had no recorded dose, about 13% had one dose and only about 4% had two or more. For about a fifth, the vaccine history was unknown. Unusually for measles, the largest age group was adults aged 20 to 49, at about 42% of cases. Over the same months Jalisco gave more than 3 million vaccine doses.

The study also compares the two states. Weekly incidence and the share of cases that died differed between Chihuahua and Jalisco, and the two outbreaks rose and fell at different times.

## Why it matters

Measles is one of the most contagious infections known. The paper quotes a basic reproduction number (R0, the number of people one case infects when nobody is immune) of about 12 to 18, taken from earlier research. With an R0 that high, only a very small share of people can be left unprotected before outbreaks take off again. Many adults born in years with weaker vaccine coverage may never have had two doses, which fits the age pattern seen here. Vaccine rules and schedules differ between countries, so check the official source where you live; this article is general education, not medical advice.

## How they did it

This is a descriptive study of surveillance records, not a transmission model. The authors took confirmed cases from Mexico's national reporting system and dose counts from the national vaccination programme. They built weekly time series for each state, compared them with rank-based statistical tests and a correlation, and worked out incidence per 100,000 people. They did not estimate R0 themselves; the threshold they discuss is the familiar 95% two-dose coverage target.

## Check it yourself with fibub

**Part 1: the threshold.** Take the R0 range the paper quotes, 12 to 18. For the vaccine, use an **assumed round effectiveness of 97%** and an **assumed coverage of 85%**. These are our own teaching numbers, not results from the paper.

1. Open the herd immunity calculator and type R0 = 12, effectiveness = 97 and coverage = 85.
2. The herd immunity threshold, 1 − 1/R0, comes out at **91.7%**. With a 97% effective vaccine, the page says you would need to vaccinate **94.5%** of people.
3. The effective R at 85% coverage is 12 × (1 − 0.85 × 0.97) = **2.11**. That is above 1, so outbreaks can still grow.
4. Change R0 to 18. The threshold rises to **94.4%**, the coverage needed to **97.4%**, and the effective R to **3.16**.
5. Look at the line "Highest R0 this holds below 1". At 85% coverage it is about **5.7**, far below measles' range. Put 12 and 18 into **Compare diseases** to see both rows side by side on the chart.

**Part 2: the curve.** Here are **made-up weekly counts** for an outbreak shaped roughly like the one described, not the paper's data. Each line is the Monday that starts the week and the cases that week.

```
Week,Cases
2026-01-05,120
2026-01-12,260
2026-01-19,430
2026-01-26,560
2026-02-02,690
2026-02-09,640
2026-02-16,520
2026-02-23,380
2026-03-02,250
2026-03-09,150
2026-03-16,90
```

1. Paste the lines into the epi-curve tool and clear the shared exposure box (this is not a single-meal outbreak).
2. Choose bars of **1 week (from Monday)**.
3. The page counts **4,090 cases** over 11 weekly bars, with the peak in the week of 2 February (690 cases) and a median onset of 2026-02-02.

To see how a falling curve might follow a rise in immunity, run the [[epidemic-model]] with the same R0 and different starting shares of immune people.

## The fine print

- The study shows that cases fell while vaccination rose; it does not prove the vaccine campaign alone caused the fall. Rising natural immunity, behaviour change and reporting also play a part.
- Passive reporting misses mild cases, and about a fifth of vaccine histories were unknown.
- No virus sequencing was done, so chains of infection between states were not traced.
- R0 for measles depends on crowding and contact patterns; the simple threshold assumes everyone mixes evenly, which real towns do not.
- The data stop in early May 2026, so later weeks are not included.

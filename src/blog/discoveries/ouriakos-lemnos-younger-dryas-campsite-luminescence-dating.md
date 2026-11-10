---
title: "Luminescence dating puts a Lemnos hunter-gatherer campsite in the Younger Dryas"
summary: "A 2025 study dated soils at Ouriakos on Lemnos, Greece, with feldspar luminescence and mapped the drowned coast around it. See how to rebuild a luminescence age yourself."
tools: [luminescence-age-calculator, uncertainty-calculator, radiocarbon-calibration, age-depth-model]
updated: 2026-11-10
sources:
  - "Gkouma M, Karkanas P, Koukousioura O, Syrides G, Chalkioti A, Tsakalos E, Ntinou M, Efstratiou N (2025), Quaternary 8(3): 42, CC BY, the paper described here."
  - "Central age model: Galbraith RF et al. (1999), Archaeometry 41: 339-364. Water correction: Zimmerman (1971); Aitken (1985), Thermoluminescence Dating."
  - "The aliquot doses and dose rates in the worked example are made up by fibub."
paper:
  title: "Exploring Continental and Submerged Paleolandscapes at the Pre-Neolithic Site of Ouriakos, Lemnos Island, Northeastern Aegean, Greece"
  authors: "Gkouma M, Karkanas P, Koukousioura O, Syrides G, Chalkioti A, Tsakalos E, Ntinou M, Efstratiou N"
  journal: "Quaternary"
  year: 2025
  doi: "10.3390/quat8030042"
  url: "https://www.mdpi.com/2571-550X/8/3/42"
  licence: "CC BY"
  reviewed: true
---

On the south-east coast of the Greek island of Lemnos, a small spot called Ouriakos holds stone microliths and burnt bone left by hunter-gatherers before farming reached the Aegean. A study published in the journal Quaternary in August 2025 read the layers of soil and sand at the site, dated them with luminescence, and rebuilt the coastline of the time, when the sea stood tens of metres lower and Lemnos was joined to the mainland. The buried soil that holds the tools dates to the Younger Dryas, a cold snap near the end of the last Ice Age. This page explains the work and shows how to rebuild a luminescence age, and see what drives its error bar, with the [[luminescence-age-calculator]]. To set the age beside radiocarbon dates from the same layers, use [[radiocarbon-calibration]], and to turn a column of dated samples into ages for every depth, try the [[age-depth-model]].

## What they found

The site sits on an old marine terrace of limestone-cemented sand (calcarenite) over older flysch rock. Under a cover of wind-blown sand, the team found an ancient soil surface, their Unit 6, with the microliths and burnt bone. Luminescence put that soil at roughly 11,850 years ago, with an uncertainty of about 860 years: inside the Younger Dryas, about 12,900 to 11,700 years ago. Deeper river-laid silty sands (Unit 4) gave ages of 25,000 to 27,000 years, which the authors take to be older sediment that was moved without its clock being reset.

Using sea-level models, they place the shoreline at about 65 m below today's in the Younger Dryas. Lemnos was then part of a wide plain linked to Imbros and the Anatolian coast, so the campsite stood well inland, on land that is now close to the shore.

## Why it matters

Traces of people from before farming are rare in the Aegean islands, partly because the land they used has since drowned. A dated, stable land surface with tools on it shows when people were moving across this plain, and hints where drowned sites may lie.

## How they did it

Luminescence dating works because buried mineral grains slowly store energy from natural radioactivity in the surrounding soil, and lose it again when sunlight reaches them. In the lab, a measured flash of light from the grains gives the **equivalent dose** De (in grays, Gy): the radiation they took in since they were last in daylight. The soil's radioactivity, from potassium, uranium and thorium plus cosmic rays, gives the **dose rate** (Gy per thousand years, Gy/ka). The age is simply De divided by the dose rate.

Quartz from the site gave unstable signals, so the team used feldspar with a post-infrared IRSL method (a two-step reading at 50 °C and then 160 °C that favours the more stable signal). Lab checks, such as recovering a known given dose within 10 %, came out well. They tested how much signal fades over time, and combined their aliquots (small portions of the sample) with both the central age model (CAM) and the minimum age model, preferring the minimum model where the doses spread more widely.

## Check it yourself with fibub

The paper's dose table is not something to copy, so here is a **made-up sample** of our own. Eight aliquots gave these equivalent doses, each ± its uncertainty in Gy: 33.5 ± 1.6, 35.2 ± 1.8, 36.8 ± 1.7, 34.1 ± 1.5, 37.9 ± 1.9, 35.6 ± 1.6, 42.3 ± 2.1 and 34.8 ± 1.7.

1. Paste the eight rows (name, De, uncertainty) into the equivalent dose box and keep "Central age model (CAM)". The tool gives a CAM dose of about 36.1 ± 0.9 Gy with an overdispersion near 5 %: the scatter is only a little more than the stated errors explain.
2. Switch "Combine with" to the weighted mean and compare: about 35.9 ± 0.6 Gy. Close here; widely spread samples differ more.
3. For the dose rate, choose "Alpha, beta and gamma dose rates" and enter, as dry values, alpha 0.30 ± 0.03, beta 1.80 ± 0.09 and gamma 1.00 ± 0.05 Gy/ka. Set water content to 10 ± 5 % and cosmic dose rate to 0.15 ± 0.015 Gy/ka.
4. Read the age: about 12.4 ± 0.8 ka, from a wet dose rate of about 2.91 Gy/ka.
5. Open the uncertainty table. Water content carries about 61 % of the age's variance, far more than the dose itself (about 14 %).
6. Change the water to 20 % and the age moves to about 13.7 ka. A guess about how wet the soil stayed over twelve thousand years shifts the age by more than a thousand years, enough to slide a layer in or out of the Younger Dryas.

That last step is the main lesson to take back to any paper: look at how the authors chose the water content. If you have their dose rates and De, you can rebuild each age and test how much it leans on that choice. The tool does not run the minimum age model or a fading correction, so for samples where those were used, check the central value rather than expect an exact match.

## The fine print

Only four samples were dated, so the link between ages and layers is thin. The choice of the minimum age model rests on the spread of the doses. The text calls the method OSL in places although the reading is infrared-stimulated feldspar, and the full dose and dose-rate table sits in the paper rather than in the text summary. The environmental clues from soil chemistry are, by the authors' own account, open to other readings. And as with any luminescence date, the age is only as good as the water and radioactivity history behind it.

---
title: "Palila decline on Mauna Kea: point transect distance sampling and density maps"
summary: "A 2025 study used quarterly point counts and a density surface model to track the critically endangered palila, which fell by about two thirds in five years. Here is how distance sampling works."
tools: [distance-sampling, occupancy-estimator, mark-recapture]
updated: 2026-11-10
sources:
  - "Camp RJ et al. (2025), Frontiers in Conservation Science 6: 1564661, CC BY, the paper described here. Title, authors, volume and licence checked on the publisher's page, 2026-11-10."
  - "Point transect density D = n / (K π ρ²) and the half-normal and hazard-rate detection functions: Buckland ST et al. (2001), Introduction to Distance Sampling, Oxford University Press."
paper:
  title: "Fine-grained temporal population monitoring of a declining, critically endangered Hawaiian honeycreeper"
  authors: "Camp RJ, Asing CK, Hunt N, Wang A, Farmer C, Neitmann L, Banko PC"
  journal: "Frontiers in Conservation Science"
  year: 2025
  doi: "10.3389/fcosc.2025.1564661"
  url: "https://www.frontiersin.org/journals/conservation-science/articles/10.3389/fcosc.2025.1564661/full"
  licence: "CC BY"
  reviewed: true
---

The palila is a small, yellow-headed Hawaiian honeycreeper that lives almost nowhere except the dry māmane forest high on the slopes of Mauna Kea. A June 2025 paper in *Frontiers in Conservation Science* counted it four times a year instead of once, and mapped where the birds were. The authors estimate that the population fell by roughly two thirds between early 2020 and mid 2024, and that the core area where palila were densest shrank by about the same share. The counts rest on distance sampling: for every bird heard or seen, the observer notes how far away it was. The [[distance-sampling]] tool does that core step in your browser. If you only record presence or absence, try the [[occupancy-estimator]] instead, and for marked birds the [[mark-recapture]] tool.

## What they found

The paper's density surface model put the population at about 1,550 birds in the first quarter of 2020 and about 530 in the second quarter of 2024. The 95 % intervals for those two dates do not overlap. The decline was steady enough to be a clear statistical trend over the 12 surveys.

The map matters as much as the total. In 2020 the authors found a hotspot of about 690 hectares where densities reached roughly 3.4 birds per hectare. By 2024 that hotspot covered about 230 hectares, and the peak density had dropped below 1.2 birds per hectare.
## Why it matters

Palila are listed as critically endangered. Once a year is a long gap for a species that can lose hundreds of birds between counts, and a single yearly number hides when in the year the losses happen. Quarterly counts, combined into one model, give managers a sharper picture of the trend and of which patches of forest still hold the most birds. That helps when deciding where to fence out grazing animals, control predators or restore trees.

The authors also report that their model's confidence intervals were on average about three quarters shorter than those from plain distance sampling of the same surveys. Narrower intervals mean a real decline is noticed sooner.

## How they did it

1. Observers stood at points about 150 m apart along 13 transects between roughly 2,000 and 3,000 m elevation, and counted for six minutes at each point.
2. Each palila detected got a distance from the observer. Annual surveys ran from 2020 to 2024, with extra quarterly surveys from 2022 to 2024.
3. Detections beyond 87.5 m were left out (truncation). A hazard-rate detection function, with the survey as a covariate, described how detection fell with distance. Within that radius the average chance of detecting a bird was about 0.56.
4. The corrected counts at each point went into a density surface model: a smooth surface across the landscape and through time, bounded by the shape of the survey area.

## Check it yourself with fibub

The density surface model needs specialist software, but its first step is ordinary point transect distance sampling, and that is what the tool does. The tool comes with a **made-up** point survey of 27 detections at 12 points, so you can repeat every number below. It is not the paper's data.

1. Press **Point transects**. The data box fills with one row per bird (point name, then distance in metres) and a box for the number of points appears, set to 12. Keep it at 12: points with no birds still count as surveyed.
2. Leave the truncation distance w at 50 m. Six of the 27 birds were farther away, so 21 detections are used.
3. Leave the detection model on **Best by AIC** and the confidence at 95 %.

The tool picks the half-normal model (AIC 370.8, against 371.0 for the hazard-rate model, so the two fit about equally well). It gives:

- an effective detection radius of 31.5 m, so each point counts as if every bird within 31.5 m was seen and none beyond;
- an effective area of about 3,125 m² per point;
- a detection probability of 0.398 within 50 m;
- an encounter rate of 1.75 birds per point;
- a density of about 560 birds per km² (5.6 per hectare), with a 95 % interval of about 284 to 1,105 per km².

You can check the core sum by hand: 21 birds ÷ (12 points × 3,125 m²) = 0.00056 birds per m², which is 5.6 per hectare. Now switch the model to **Hazard-rate**: the density rises to about 728 per km² (7.3 per hectare) with a much wider interval of about 263 to 2,017. Go back to **Best by AIC** and raise w to 80 m: the tool now prefers the hazard-rate model and gives about 704 per km², against about 447 per km² for the half-normal one. The shape of the detection curve and the cut-off distance both shape the answer, which is why the paper checks its detection function with such care. Download the results as CSV to keep the numbers for each survey, and plot them over time to see a trend.

## The fine print

The paper's headline numbers come from a spatial model, which smooths and borrows strength across points and surveys. A plain distance sampling estimate from the tool will not match them exactly. It is a check on the method, not a copy of the result.

Distance sampling also assumes birds on or near the point are always detected, that distances are measured without error, and that birds do not move before they are counted. Palila are often found by their calls, so distances are estimates. The surveys cover the core range on one side of Mauna Kea, and the authors do not quantify the causes of the decline. Drought, predators and the state of the māmane trees are all candidates the counts alone cannot separate.

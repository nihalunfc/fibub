---
title: "Bear, wolf and lynx site use from camera traps: occupancy vs N-mixture"
summary: "A 2025 PLOS ONE study ran occupancy and N-mixture models on camera-trap data for three carnivores in northeastern Türkiye. Here is how to try the occupancy half yourself."
tools: [occupancy-estimator, camera-trap-tagger, sample-size]
updated: 2026-11-10
sources:
  - "Blount JD et al. (2025), PLOS ONE 20(5): e0320768, CC BY, the paper described here. Title, authors, volume and licence checked on the publisher's page, 2026-11-10."
  - "Single-season occupancy model: MacKenzie DI et al. (2002), Ecology 83: 2248-2255. Chance of at least one detection in K surveys = 1 - (1 - p)^K: standard probability."
paper:
  title: "Combining N-mixture and occupancy analysis offers a more complete picture of carnivore habitat use in Northeastern Türkiye"
  authors: "Blount JD, Green AM, Chynoweth M, Çoban E, Kusak J, Şekercioğlu ÇH"
  journal: "PLOS ONE"
  year: 2025
  doi: "10.1371/journal.pone.0320768"
  url: "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0320768"
  licence: "CC BY 4.0"
  reviewed: true
---

A camera that never photographs a wolf does not prove there are no wolves nearby. Ecologists deal with this by modelling detection separately from presence. A May 2025 paper in PLOS ONE took more than a decade of camera-trap records from the Kars-Ardahan plateau in northeastern Türkiye and analysed them in two ways: occupancy models, which ask whether a site is used at all, and N-mixture models, which ask how heavily it is used. Their message is that each answers a different question, so the pair tells you more than either alone. The [[occupancy-estimator]] lets you fit the occupancy side to your own detection records in a browser. To build those records from photos, start with the [[camera-trap-tagger]]. To plan how many cameras you need, try the [[sample-size]] tool.

## What they found

The study followed three large carnivores: the Eurasian brown bear, the grey wolf and the Caucasian lynx. In the occupancy models, the estimated share of sites used was about 0.57 for lynx and 0.86 for wolves, and above 0.9 for bears (the paper gives 0.91 in one place and 0.96 in another). The chance of picking up an animal in one week at a site it used was low, roughly 0.06 to 0.18 depending on species and site conditions.

The more interesting result is where the two models disagreed. Each produced about ten clear habitat effects, but only around half of them were shared. Now and then the two models even pointed in opposite directions for the same factor. One effect held in both: sites farther from towns were used more. The N-mixture models tended to give stronger, more clear-cut results than the occupancy models.

## Why it matters

Bears, wolves and lynx roam far. In farmland they come into contact with people and livestock. Wildlife managers often have only camera data and limited money, so they need to squeeze the most from it. If one model says a road or village matters and another says it does not, the choice of model can change a management decision. Running both, as the authors suggest, shows which findings are robust and which depend on the method.

## How they did it

1. Cameras were set up between 2010 and 2023 across an area of about 550 km², split into a grid of 2 km² cells. Most were placed along roads.
2. In total there were 151 sites, 229 camera deployments and more than 25,000 camera-days. Together these gave about 1,500 detections of the three species.
3. Records were grouped into seven-day sampling occasions. For each occasion, a site got a 1 (species seen) or a 0 (not seen).
4. The occupancy models used these 1s and 0s. The N-mixture models used the counts of animals seen in each occasion.
5. Both were hierarchical models that fit the three species together. They included habitat and human factors, such as distance from towns.

## Check it yourself with fibub

The occupancy tool fits the simplest version of this model: one species, one season, and no habitat factors. That is enough to see why naive counts mislead.

**Our own made-up example** (not the paper's data): twelve camera sites, each run for four weeks. A wolf is seen at six of them. Paste one row per site, a 1 or a 0 for each week:

```
0100
0000
1010
0000
0001
0000
1100
0000
0010
0000
0110
0000
```

1. Paste the rows into the detection histories box. Compact rows like these are fine, and a dash marks a week a camera was not working.
2. Leave the detection model on **Best by AIC**. The tool fits both "same p every week" and "p differs by week" and keeps the one with the lower AIC (a score that rewards fit and penalises extra parameters). Here the constant model wins: AIC 49.64 against 53.83.
3. Read the result. Naive occupancy is 6 ÷ 12 = 0.500. The model gives **ψ = 0.704** (95 % interval 0.151 to 0.969), with weekly detection **p = 0.266**.
4. Look at the never-detected sites. Each still has about a 0.41 chance of holding wolves, so the tool expects about 8.4 occupied sites, not 6.
5. Open the survey chart. With p = 0.266, four weeks give a 1 − 0.734⁴ = 0.71 chance of seeing wolves at a used site. You would need about 10 weeks for 95 %.

Now try the detection levels the paper reports. If p were 0.10 a week, four weeks would catch a used site only 34 % of the time. Even twelve weeks would reach just 72 %. That is why long deployments matter for shy animals like lynx. Notice also how wide the interval is with only 12 sites. The paper's 151 sites are what make its estimates reasonably tight.

## The fine print

- Every camera sat along a road, so the results describe how carnivores use roads and their edges, not the whole landscape.
- The models assume a site's status stays fixed over the season. The authors note this was not strictly true over many years and repeat deployments, which may push estimates up.
- Bear numbers may mix animals that visit a town dump with animals that never do. The dump itself had no camera.
- Some effects were called moderate using 85 % credible intervals, a looser standard than the usual 95 %.
- Our tool has no habitat covariates and handles one species at a time, so it cannot reproduce the paper's models. It shows the core idea only. Read the full paper for the exact methods and figures.

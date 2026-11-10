---
title: "When did the Castelnovian begin? Bayesian radiocarbon dating at Romagnano Loc III"
summary: "New AMS dates on bone and an OxCal model put the start of the Castelnovian at Romagnano, northern Italy, early in the 7th millennium BCE. See how to calibrate dates like these yourself."
tools: [radiocarbon-calibration, uncertainty-calculator]
updated: 2026-11-10
sources:
  - "Pardo-Gordó S, Fontana A, Extrem-Membrado V, Vacas-Fumero E, Duches R, Flor E, Fontana F (2025), PLOS ONE 20(9): e0331392, Creative Commons Attribution License, the paper described here."
  - "Calibration curve: IntCal20, Reimer et al. (2020), Radiocarbon 62: 725-757."
  - "The radiocarbon ages in the worked example are made up by fibub; they are not the paper's dates."
paper:
  title: "The timing of the Castelnovisation of southwestern Europe: A Bayesian modelling insight from the Romagnano Loc III rock shelter sequence (Trento, Italy)"
  authors: "Pardo-Gordó S, Fontana A, Extrem-Membrado V, Vacas-Fumero E, Duches R, Flor E, Fontana F"
  journal: "PLOS ONE"
  year: 2025
  doi: "10.1371/journal.pone.0331392"
  url: "https://doi.org/10.1371/journal.pone.0331392"
  licence: "CC BY"
  reviewed: true
---

The last hunter-gatherers of southern Europe changed their stone tools well before farming arrived. Small, regular blades and trapezes replaced the older tiny points, a style archaeologists call the Castelnovian. Where and when did that change start? A team working on a rock shelter in the Adige Valley of northern Italy redated its layers and ran a Bayesian model. They argue that the Castelnovian there began at the end of the 8th or the start of the 7th millennium BCE, a few centuries earlier than most sites further west. The paper appeared in PLOS ONE in September 2025. Here is what they did, and how to calibrate radiocarbon dates of your own with the [[radiocarbon-calibration]] tool, then carry the error through later sums with the [[uncertainty-calculator]].

## What they found

Romagnano Loc III holds about six metres of Mesolithic deposits under later Neolithic and Bronze Age layers. The older Mesolithic style there is the Sauveterrian; the newer one is the Castelnovian. In the first model that agreed well with the data, the change from one to the other falls somewhere between about 7684 and 6872 BCE (95 % probability). The Castelnovian ends, and the Neolithic begins, at roughly 5188 to 4878 BCE in that model. Their oldest Castelnovian date, from one layer, is earlier than most comparable dates in the western Mediterranean. They put forward a working idea, not a settled result: the Castelnovian may have started in the Alpine part of northern Italy and spread west in less than 500 years.

## Why it matters

How fast a new way of making tools spreads tells us whether people moved, or ideas moved between groups who stayed put. Answering that needs dates that are both precise and trustworthy. Many Mesolithic sites were dug decades ago and dated on charcoal that nobody identified. Charcoal from an old tree, or charcoal that slipped down from another layer, can shift a date by centuries.

## How they did it

The site already had 25 conventional radiocarbon dates from the 1970s, mostly on charcoal. The team added 17 new AMS (accelerator mass spectrometry) dates on bones and teeth of red deer, chamois, wild boar and ibex, and checked each sample's collagen quality. They calibrated every date with the IntCal20 curve in OxCal 4.4, then built seven versions of a Bayesian sequence model. A sequence model uses the order of the layers: a date from a deeper layer should be older. An outlier model let the software down-weight dates that did not fit. The first models agreed poorly with the data, so the team removed doubtful dates step by step until the final model passed the usual agreement checks.

## Check it yourself with fibub

fibub calibrates single dates. It does not build Bayesian sequences, so use it to see what each date says on its own before any model. The ages below are **made up** for an imaginary three-layer shelter. They are not the paper's dates.

1. Open the radiocarbon calibration tool and type one date per line, a name, the age in years BP (before 1950) and the ± error:
   `Upper layer bone: 6150 30`
   `Middle layer bone: 7120 35`
   `Lower layer bone: 7900 35`
   `Lower layer charcoal: 8150 60`
2. Set **Show dates as** to BCE / CE, the style the paper uses.
3. Read the table. With IntCal20 the tool gives these 95.4 % ranges:
   - upper layer bone: 5208 to 5006 BCE, median 5105 BCE;
   - middle layer bone: 6066 to 5973 BCE (74.5 %) or 5949 to 5915 BCE (21.0 %), median 5999 BCE;
   - lower layer bone: mostly 6838 to 6646 BCE (76.3 %), plus four short, older pieces back to 7030 BCE, median 6760 BCE;
   - lower layer charcoal: 7350 to 7037 BCE (94.9 %), median 7151 BCE.
4. Pick **Lower layer bone** under **Plot**. The lower chart shows the measured age, a flat line, crossing a wiggly part of the curve more than once. That is why its range breaks into pieces. Wiggles like this are one reason modellers lean on layer order.
5. Compare the two lower-layer dates. The charcoal median is about 390 years older than the bone from the same layer. Either the charcoal came from old wood or it moved down from above, or the layer mixes material of different ages. The paper faced the same kind of problem, and partly for this reason it relied on the new bone dates.
6. Keep the order in mind. Here each layer's bone is younger than the one below, so the dates agree with the stratigraphy. A date that broke that order would be a candidate outlier.

To put a date's spread into a later sum, such as a rate of sediment build-up between two layers, use the uncertainty calculator with the medians and half-widths of the ranges, and say that you treated them as normal errors (a rough approximation).

## The fine print

- About a third of the samples were flagged as outliers in the first model, and several dates had to be removed before the models passed. The final picture depends on those choices.
- The old charcoal dates were on unidentified species, so they carry old-wood risk.
- The early start rests partly on the oldest date from a single layer. The authors call the Alpine origin a hypothesis that needs more dates.
- Few other sites in the region have dates of modern quality, so comparisons are thin.
- A calibrated range from fibub is one date on its own. It is not the same as a modelled boundary from a Bayesian sequence, which combines many dates with the layer order.

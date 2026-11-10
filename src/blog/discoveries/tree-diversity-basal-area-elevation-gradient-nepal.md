---
title: "Tree diversity and basal area along an elevation gradient in Nepal"
summary: "A 2025 plot survey from 600 to 3,200 m in Dailekh, Nepal, finds tree diversity peaks at mid-elevation while basal area is highest near the top. Here is how to compute both from your own plots."
tools: [biodiversity-indices, tree-height-basal-area, community-ordination]
updated: 2026-11-10
sources:
  - "Acharya S et al. (2025), Diversity 17(8): 588, CC BY, the paper described here. Title, authors, volume and licence checked on the publisher's page, 2026-11-10."
  - "Shannon, Simpson and Pielou indices: Magurran AE (2004), Measuring Biological Diversity, Blackwell. Basal area of a stem = π × DBH² / 4: standard forestry formula."
paper:
  title: "Unraveling Elevation-Driven Variations in Forest Structure and Composition in Western Nepal"
  authors: "Acharya S, Joshi R, Maraseni TN, Bhattarai P"
  journal: "Diversity"
  year: 2025
  doi: "10.3390/d17080588"
  url: "https://www.mdpi.com/1424-2818/17/8/588"
  licence: "CC BY"
  reviewed: true
---

Climb a Himalayan hillside and the forest changes around you: sal trees in the warm valleys, then pines and chestnuts, then rhododendron and finally high-altitude oak. An August 2025 paper in *Diversity* measured that change along one route in Dailekh district, Nepal, from about 600 to 3,200 m. The authors found that the number of tree species and how evenly they share the forest peak around 1,500 m, while the biggest trees, and the most wood per hectare, are found high up. Both halves of that finding come from simple plot sums. The [[biodiversity-indices]] tool computes the diversity side from species counts, and [[tree-height-basal-area]] turns trunk diameters into basal area per hectare. To compare whole plots by their species mix, try [[community-ordination]].

## What they found

Across 27 plots the team recorded 504 trees of 35 species from 21 families. Shannon diversity (a measure that rises with both the number of species and their evenness) ranged from 0 in single-species plots to about 2.15, with its highest values near 1,500 m. Its link with elevation was not statistically significant.

Forest structure told a different story. Tree density ranged from 250 to 800 trees per hectare, and basal area (the total cross-section of trunks at breast height, per hectare) from about 7 to 82 m²/ha. The highest basal area was at about 3,100 m, with a second peak near 2,400 m. Sal (*Shorea robusta*) dominated the lowest forests and the oak *Quercus semicarpifolia* the highest. The high plots had few small stems, which the authors read as a sign of weak regeneration.

## Why it matters

Mountain forests store carbon, hold soil on steep slopes and supply fuel, fodder and timber to villages. Knowing where diversity is highest and where young trees are missing helps decide where to protect, where to limit grazing and logging, and where to plant. Baselines like this also make it possible to see, years from now, whether species are moving uphill as the climate warms.

## How they did it

1. The team laid out 27 square plots of 20 × 20 m, one in each 100 m band of elevation, along a trekking route, each at least 100 m from the trail.
2. In each plot they recorded every tree with a diameter at breast height (DBH) of at least 5 cm, its species, DBH and height, measured with a clinometer.
3. Basal area came from DBH, and plot values were scaled up to one hectare.
4. They computed Shannon, Simpson and Pielou evenness indices per plot and tested their relation with elevation and slope aspect.

## Check it yourself with fibub

Here are two **made-up plots** of 20 × 20 m (400 m²), one mid-slope and one high.

Mid-slope plot, 22 trees: 6 sal, 3 chir pine, 5 *Schima*, 4 *Castanopsis*, 2 rhododendron, 1 *Lyonia*, 1 *Myrica*. High plot, 16 trees: 12 oak, 3 rhododendron, 1 *Lyonia*.

1. In the biodiversity tool, put species names in the first column and the two plots as columns of counts, with a header row naming the plots (a 0 where a species is absent).
2. Read the table:
   - mid-slope: 7 species, Shannon H′ 1.77, Simpson 1 − D 0.81, Pielou evenness 0.91, and 27 % of trees are the commonest species (Berger-Parker);
   - high: 3 species, H′ 0.70, 1 − D 0.40, evenness 0.64, and oak makes up 75 %.
3. The tool also compares the plots: they share only 2 of 8 species (Jaccard 0.25), and their Bray-Curtis dissimilarity is 0.84.

Now the structure. In the basal area part of the second tool, choose **A fixed-area plot**, plot area 400 m², and paste each tree's DBH in cm. Our made-up diameters are, for the mid-slope plot, 6, 7, 8, 8, 9, 10, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 23, 26, 29, 33 and 38; and for the high plot, 10, 14, 18, 22, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56 and 58. The mid-slope plot (22 stems) gives 0.60 m² of basal area in the plot, which is 14.9 m²/ha and 550 stems per hectare. The high plot (16 stems, mostly large oaks) gives 2.21 m², which is 55.3 m²/ha from only 400 stems per hectare. The quadratic mean diameter rises from 18.6 cm to 42.0 cm. Fewer but much bigger trees: the pattern the paper reports for its upper plots.

The same tool can work out a tree's height from two clinometer readings, which is how the heights in the study were measured.

## The fine print

One 400 m² plot per elevation band is a small sample, and a single plot can land in an unusual patch. The plots follow one trekking route, so elevation is tied up with distance from villages and with human use, which the authors describe but did not measure. Simpson's index is written in two ways in the literature: D itself, which rises as one species dominates, and 1 − D, which rises with diversity. The tool shows 1 − D and its inverse, so check which version a paper uses before comparing numbers. The paper's own text also gives slightly different figures for the lowest elevation in different sections, so treat its exact range as approximate.

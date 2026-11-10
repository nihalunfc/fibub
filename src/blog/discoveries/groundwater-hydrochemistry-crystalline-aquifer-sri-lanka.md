---
title: "Groundwater hydrochemistry in a fractured crystalline aquifer, Sri Lanka"
summary: "A 2026 Water study sampled dug wells, tube wells and surface water in Sri Lanka's dry zone. See what its Piper diagram and Gibbs plot showed, and how to plot water types yourself."
tools: [piper-diagram, mixing-model-calculator]
updated: 2026-11-10
sources:
  - "Hansani U, Witharana SA, Dharmapriya PL, Wijekoon P, Wu Z, Chen X, Jinadasa S, Weerasooriya R (2026), Water 18: 89, CC BY, the paper described here."
  - "meq/L conversion and ion balance error: standard hydrochemistry; molar masses from the standard atomic weights."
  - "The four water analyses in the worked example are made up by fibub."
paper:
  title: "Multivariate Analysis and Hydrogeochemical Evolution of Groundwater in a Geologically Controlled Aquifer System: A Case Study in North Central Province, Sri Lanka"
  authors: "Hansani U, Witharana SA, Dharmapriya PL, Wijekoon P, Wu Z, Chen X, Jinadasa S, Weerasooriya R"
  journal: "Water"
  year: 2026
  doi: "10.3390/w18010089"
  url: "https://doi.org/10.3390/w18010089"
  licence: "CC BY"
  reviewed: true
---

In the dry zone of north central Sri Lanka, many villages rely on wells dug into weathered rock or drilled into fractures in hard basement rock. What decides the chemistry of that water: the rock type, the folds and fractures that guide the flow, or evaporation at the surface? A team of hydrogeologists sampled 130 wells and surface waters around one village and found that the water's chemistry follows the geological structure more than the map of rock types. This page explains the study in plain words and shows how to sort your own analyses into water types with the [[piper-diagram|Piper diagram maker]], and how to go further by unmixing two waters with the [[mixing-model-calculator]].

## What they found

- **Ca-HCO₃ water dominates.** Most samples sit in the calcium-bicarbonate corner of the Piper diagram, the signature of young rainwater that has recently soaked through weathering rock.
- **Five water types, not tied to rock type.** Besides Ca-HCO₃ they found Na-Cl (mostly in surface water), mixed Ca-Mg-Cl, Ca-Na-HCO₃ and Ca-Cl. These groups did not line up with the mapped rock units.
- **Weathering wins.** On a Gibbs-type plot of dissolved solids against Cl/(Cl + HCO₃), most samples had ratios below 0.5, which points to rock weathering. A few clusters lay above 0.5, which the authors link to evaporation.
- **Ion exchange and evaporation shape the rest.** Sodium-rich bicarbonate water was put down to cation exchange: clay swaps sodium into the water and takes calcium out. Being far inland, the site rules out seawater, so the chloride comes from other sources.
- **Deep wells carry more nitrate.** Mean nitrate was reported as about 37 mg/L in the deep tube wells, against about 8 mg/L in shallow dug wells.

## Why it matters

Hard-rock aquifers store water only in thin weathered zones and scattered fractures, so a well a few hundred metres away can tap different water. If structure matters more than rock type, then siting new wells and protecting existing ones means mapping folds and fracture zones, not only the geology map. Deeper wells are not automatically cleaner, either.

## How they did it

The team collected 98 shallow dug wells (about 8 m deep), 16 deep tube wells (deeper than 25 m) and 16 surface waters in one season. They measured pH, conductivity and dissolved solids in the field, titrated alkalinity in the lab, and ran anions by ion chromatography and cations and trace elements by ICP-OES. They plotted Piper and Gibbs-type diagrams, worked out chloro-alkaline indices (measures of ion exchange), and grouped samples with principal component analysis and hierarchical clustering, which gave seven clusters.

## Check it yourself with fibub

The Piper diagram maker reads a table with a header row. The four analyses below are **made up by fibub**, in mg/L. They are not the paper's data.

| sample | Ca | Mg | Na | K | HCO3 | SO4 | Cl | NO3 | source |
|---|---|---|---|---|---|---|---|---|---|
| DW1 | 72 | 18 | 22 | 3 | 300 | 20 | 25 | 6 | Dug well |
| DW2 | 40 | 12 | 65 | 4 | 330 | 15 | 24 | 4 | Dug well |
| TW1 | 95 | 38 | 80 | 5 | 420 | 60 | 110 | 40 | Tube well |
| SW1 | 20 | 10 | 70 | 6 | 110 | 20 | 105 | 2 | Tank |

1. **Paste the table** and leave **Values are in** at mg/L. Under **Colour by**, pick the source column so each kind of water gets its own colour and marker.
2. **Check the ion balance.** All four pass: DW1 about −0.2 %, TW1 −1.7 %, SW1 −1.9 % and DW2 −4.4 %, close to the usual ±5 % limit. Now change TW1's chloride from 110 to 11, as if a zero were dropped. The balance jumps to about +11.6 % and the table marks it "check". That is the first thing to look at in any data set.
3. **Read the water types.** DW1 comes out as Ca-Mg-HCO₃, like the dominant type in the paper. DW2 is Na-Ca-HCO₃, the kind of water that ion exchange makes. The tube well TW1 is a mixed Ca-Na-Mg-HCO₃-Cl water, and the tank SW1 is Na-Cl-HCO₃ and falls in the Na-K-Cl-SO₄ field of the diamond.
4. **Look at hardness.** DW1 is about 254 mg/L as CaCO₃ and TW1 about 394 mg/L, both hard waters; DW2, with its sodium swapped in, is only about 149 mg/L.
5. **Work out the Gibbs ratio by hand.** The tool does not draw a Gibbs plot, but the ratio is easy: divide chloride by 35.45 and bicarbonate by 61.02 to get meq/L. For DW1 that is 0.71 and 4.92 meq/L, so Cl/(Cl + HCO₃) is about 0.13, well on the weathering side. For SW1 it is about 0.62, on the evaporation side.

If you suspect a well is a blend of tank water and deep groundwater, put the two end-members and the well's ions into the mixing model calculator to estimate the fractions.

## The fine print

- One season only; dry-zone wells can change a lot between monsoon and dry months.
- Wells mix water from different depths, so a sample may blend aquifer layers.
- The geology map is at 1:100,000, too coarse to match every well to a rock unit.
- Nitrate and boron sources were not traced with isotopes, so their origin is an interpretation.
- Seven clusters came from cutting a dendrogram by eye; other choices would give other groups.
- For drinking water, follow your national standards and get water tested by an accredited lab.

---
name: CIPW norm calculator
num: 871
shelf: science
code: T607
section: mineralogy-and-petrology
title: "CIPW norm calculator: normative minerals from a rock's major-oxide analysis"
summary: "Paste or open whole-rock major-oxide analyses, one or many. Get the CIPW norm in wt% (quartz, feldspars, feldspathoids, pyroxenes, olivine, oxides, apatite), the differentiation index, plagioclase An, colour index and silica saturation, with Le Maitre or fixed-ratio Fe2O3/FeO adjustment and a check that the norm adds up to the analysis."
status: live
ads: true
order: 871
icon: mountain
works: offline
updated: 2026-11-09
related: [mineral-formula, ternary-plot-maker, molar-mass-calculator, piper-diagram, point-counter, mineral-id-key]
sources:
  - "CIPW norm procedure: Cross, Iddings, Pirsson and Washington (1902, Journal of Geology 10, 555), in the step order restated by Verma, Torres-Alvarado and Velasco-Tapia (2003, Schweiz. Mineral. Petrogr. Mitt. 83, 197). Iron: Le Maitre (1976, Contrib. Mineral. Petrol. 56, 181). Differentiation index: Thornton and Tuttle (1960). fibub's code is its own, checked in the tests against pyrolite's CIPW_norm."
  - "Molar masses from standard atomic weights. The example rocks are made up and rounded. Nothing you paste or open is sent or stored."
flow:
  - { icon: table, label: "Oxide wt%" }
  - { icon: sliders, label: "Iron" }
  - { icon: calculator, label: "Norm" }
  - { icon: chart, label: "Minerals" }
---

## What it does

A rock analysis lists oxides; the CIPW norm turns them into an ideal set of anhydrous minerals that the melt could have crystallised. Petrologists use it to compare rocks of any grain size, glassy ones included, and to see whether a magma is oversaturated in silica (quartz in the norm), saturated (hypersthene) or undersaturated (olivine, nepheline, leucite). This page:

- Works out the norm for one rock or a whole table, in the standard order: apatite, ilmenite, orthoclase, albite, acmite, anorthite (corundum if alumina is left), titanite, magnetite (hematite), diopside, wollastonite and hypersthene; then quartz from the silica left over, or, if silica runs short, hypersthene to olivine, titanite to perovskite, albite to nepheline, orthoclase to leucite, wollastonite to dicalcium silicate, diopside to dicalcium silicate and olivine, and leucite to kaliophilite.
- Puts MnO with FeO, as the method does.
- Splits total iron into FeO and Fe2O3 by Le Maitre's (1976) volcanic or plutonic formula, or by a fixed ratio you choose, or uses them as analysed.
- Gives the **differentiation index** (Q + Or + Ab + Ne + Lc + Kp), the **An content of normative plagioclase**, a **colour index**, the Mg share in the mafic minerals and the silica saturation.
- Checks the mass balance: the minerals add up to the oxides, so the total is 100 % after recalculation.

Compare the norm with the minerals you actually see using the [[point-counter]], and work out single-mineral formulas from analyses with the [[mineral-formula|mineral formula calculator]].

## How to use it

1. Paste analyses with oxide names on top and one rock per row, or open a CSV or Excel file. LOI, H2O and CO2 columns are ignored.
2. Choose the iron option and whether to recalculate to 100 % on a volatile-free basis (the usual practice).
3. Read the table; pick a rock for the bar chart; download the CSV (with the diopside, hypersthene and olivine end-member parts) or the report.

## Worked example

The made-up basalt (SiO2 49.5, TiO2 1.8, Al2O3 15.0, FeO 10.5 as total iron, MnO 0.18, MgO 8.0, CaO 10.5, Na2O 2.8, K2O 0.6, P2O5 0.25 wt%, plus LOI) with Le Maitre's volcanic iron split (7.08 % FeO and 3.86 % Fe2O3 after recalculation) gives **Or 3.56, Ab 23.81, An 26.72, Di 19.25, Hy 14.74, Ol 2.30, Mt 5.59, Il 3.44 and Ap 0.58 wt%**: olivine and hypersthene-normative, a tholeiite. The differentiation index is 27.4 and the normative plagioclase is An 52.9. The made-up granite has 30.79 % quartz and 0.73 % corundum (it is slightly peraluminous) with a differentiation index of 88.4, and the nephelinite has 20.91 % nepheline, 7.04 % leucite and no albite or hypersthene.

## Tips

- The iron split changes the norm a lot: more Fe2O3 means more magnetite and less olivine, pushing a rock towards silica saturation. Say which option you used.
- Altered or weathered rocks, and rocks with much LOI, give norms that mean little.
- The norm is an idealised mineralogy for comparison, not what the rock actually contains.

## FAQ

**Why is there acmite or sodium metasilicate?** The rock has more Na2O + K2O than Al2O3 (peralkaline), so not all the alkalis fit into feldspar.

**Why is the total above 100?** Only for very silica-poor rocks: even the most silica-poor norm minerals need more silica than the rock has, and the page reports how much is missing.

**Is my data uploaded?** No. Everything runs in your browser.

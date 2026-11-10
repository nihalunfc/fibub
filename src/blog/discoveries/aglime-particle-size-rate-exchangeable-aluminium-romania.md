---
title: "Aglime particle size and rate: pH, CEC and exchangeable aluminium over 18 months"
summary: "A Romanian field trial compared fine and coarse ground limestone at 3 and 6 t/ha on an acid soil. Here is what changed, and how to work out a lime rate yourself."
tools: [soil-test-interpreter, yield-trial-anova, field-trial-designer]
updated: 2026-11-10
sources:
  - "Lațo A et al. (2025), Sustainability 17(18): 8135, CC BY, the paper described here."
  - "Lime from a charge balance: acidity (cmol(+)/kg) x soil mass of the layer x 50.04 g CaCO3 per mole of charge; standard soil chemistry."
paper:
  title: "Mitigating Soil Acidity: Impact of Aglime (CaCO3) Particle Size and Application Rate on Exchangeable Aluminium and Base Cations Dynamics"
  authors: "Lațo A, Berbecea A, Lațo I, Crista F, Crista L, Sala F, Radulov I"
  journal: "Sustainability"
  year: 2025
  doi: "10.3390/su17188135"
  url: "https://www.mdpi.com/2071-1050/17/18/8135"
  licence: "CC BY"
  reviewed: true
---

Acid soil is a quiet yield thief. Below a pH of about 5.5, aluminium comes loose from clay minerals and harms roots, while calcium and magnesium are washed away. Farmers fix this by spreading ground limestone, called aglime. A team in western Romania tested two questions that matter for cost: does it help to buy finer lime, and is double the rate worth it? They followed a field of acid soil for 18 months. The paper was published in Sustainability in September 2025 under a CC BY licence. This page explains it in plain words, and shows how the [[soil-test-interpreter]] turns your own soil test into a lime rate. If you plan a similar trial, the [[field-trial-designer]] lays out the plots and [[yield-trial-anova]] compares them.

## What they found

Liming raised the pH of the top 20 cm from just above 5. The authors report the highest topsoil pH, 6.60, under 6 t/ha of lime (coarse or fine) after 18 months. Fine lime at 6 t/ha gave the largest rise in cation exchange capacity (CEC), the soil's ability to hold nutrient ions, up by about a quarter at 18 months. Exchangeable aluminium in the topsoil dropped to zero under two treatments by the end. Exchangeable calcium almost doubled.

The layer below, 20 to 40 cm, changed far less. Lime moves slowly downward when it is mixed only into the top 15 cm.

## Why it matters

Lime is cheap per tonne, but spreading it is not, and a farm may need several tonnes per hectare. Knowing whether fine lime works faster, and whether the higher rate pays back in the topsoil or below it, helps farmers spend less for the same result. Removing toxic aluminium is often the real goal, more than reaching a particular pH number.

## How they did it

1. They chose a field of acid, gley-affected river soil in western Romania, with a pH near 5.1.
2. They spread limestone of 98 % calcium carbonate in two sizes, coarse (1 to 2 mm) and fine (about 0.1 mm), at 3 and 6 t/ha, and mixed it into the top 15 cm.
3. Each of the four treatments had three plots of 50 by 30 m, arranged in randomised blocks.
4. They grew rain-fed maize with no fertiliser, so only the lime could cause differences.
5. They sampled 0 to 20 cm and 20 to 40 cm before liming and after 6, 12 and 18 months, and measured pH, CEC and the exchangeable cations.
6. They compared means with analysis of variance and Tukey's test, and used principal component analysis to see which properties moved together.

## Check it yourself with fibub

How much lime does a soil need? One clear way is a charge balance: the lime must neutralise the acid charge that sits on the clay. The [[soil-test-interpreter]] does this from CEC and base saturation, the share of the CEC held by calcium, magnesium, potassium and sodium. The soil below is **our own made-up example**, not a plot from the paper.

**Step 1: base saturation from the soil test.** Say the lab reports a CEC of 10 cmol(+)/kg and exchangeable calcium 4.5, magnesium 0.8, potassium 0.2 and sodium 0.1, all in cmol(+)/kg. The bases add up to 5.6, so base saturation is 5.6 ÷ 10 = 56 %.

**Step 2: open the tool.** Choose "CEC and base saturation". Type CEC 10, base saturation now 56 and a target of 80 %. Set the depth to 20 cm and bulk density to 1.4 g/cm³.

The tool shows the acidity to neutralise as 10 × (80 − 56) ÷ 100 = **2.4 cmol(+)/kg**, in **2,800 t/ha** of soil (20 cm × 100 × 1.4). That needs about **3,363 kg/ha of pure calcium carbonate**.

**Step 3: allow for your lime.** Type a neutralising value (CCE) of 98 %. Fineness efficiency is the share that reacts in the time you care about. Our made-up values: 95 % for a fine powder, 50 % for a coarse grit.

- Fine lime: effective value 93.1 %, so the tool says spread **3.61 t/ha**.
- Coarse lime: effective value 49 %, so **6.86 t/ha**.

That is a neat way to see why a trial might test 3 and 6 t/ha: in our example, coarse lime needs nearly twice the tonnage for the same effect in the first year. If you want to lift the 20 to 40 cm layer too, set the depth to 40 cm: the need doubles to about 6,726 kg/ha of pure carbonate, or 7.22 t/ha of the fine lime, and it still has to be mixed down to work.

**Step 4: rate the nutrients.** In the second box, type your results with your lab's ranges, one per line, for example "Magnesium, 0.8, 1, 3, cmol/kg". The tool marks each one low, in range or high.

## The fine print

- One field, one soil type and one crop, over two seasons. Other soils, especially heavy clays or very sandy ones, behave differently.
- Only three replicate plots per treatment, which limits how small a difference the test can detect.
- No maize yields are given in the results, so the economic payback is not shown.
- Some explanations, such as how aluminium is locked away, are inferred from the chemistry rather than measured.
- Our worked example uses invented numbers and a simple charge balance. Lime advice varies by country and lab method: check the official source or your adviser. Read the full paper for its exact figures.

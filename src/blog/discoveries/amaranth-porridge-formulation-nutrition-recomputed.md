---
title: "Amaranth porridge for malnourished children: do the blends add up?"
summary: "A 2026 paper formulates five amaranth-maize-soy-sesame porridges against the CSB++ specification. Weighting its own flour analyses in fibub's recipe nutrition calculator reproduces the measured product and shows where the planning table went wrong."
tools: [recipe-nutrition-calculator, concentration-converter, nutrient-planner]
updated: 2026-11-24
sources:
  - "Mwikwabe, A. S., Martin, H. D., Mushi, B. K. and Kejo, D. D. (2026), Development and nutritional evaluation of an extruded grain amaranth-instant porridge as a supplementary food for children under five with moderate acute malnutrition, Frontiers in Nutrition 13: 1895788, doi:10.3389/fnut.2026.1895788. Licence CC BY, stated in the article itself (with its copyright line) and checked there on 2026-11-24; api.crossref.org was rate-limited on the day, so only the publisher page was read for the licence, and no correction or retraction notice appears on it. Values used here: blend ratios (grain amaranth / pro-vitamin A maize / soybean / sesame, per cent) F1 35/45/15/5, F2 41/39/15/5, F3 31/37/21/11, F4 41/38/16/5, F5 40/35/20/5; measured flour composition (g/100 g) amaranth 17.46 protein, 6.05 fat, 4.18 fibre, 2.88 ash, 11.17 moisture; maize 11.13, 3.33, 2.17, 1.14, 9.33; soybean 38.29, 17.41, 6.01, 5.18, 7.90; sesame 25.46, 50.48, 8.77, 6.28, 5.27; the planning table's values per 100 g (F1 369.3 kcal, 14.6 g protein, 9.6 g fat, 10.5 g fibre, to F5 372.1 kcal, 16.2 g protein, 10.3 g fat, 10.9 g fibre); measured products F1 379.67 kcal, 18.14 g protein, 8.75 g fat and F5 391.93 kcal, 20.53 g protein, 11.95 g fat; F5 minerals calcium 587.86, iron 11.44, zinc 8.98 mg per 100 g; the CSB++ targets quoted in the paper (energy ≥ 400 kcal, protein ≥ 16 g, fat ≥ 9 g, calcium 420-660 mg, iron 9.0-14.8 mg, zinc 8.0-14.0 mg, sodium ≤ 270 mg, potassium 650-1050 mg per 100 g)."
  - "General Atwater factors 4 kcal/g protein, 9 fat, 4 available carbohydrate, 2 fibre, as used by the tool."
paper:
  title: "Development and nutritional evaluation of an extruded grain amaranth-instant porridge as a supplementary food for children under five with moderate acute malnutrition"
  authors: "Mwikwabe AS, Martin HD, Mushi BK, Kejo DD"
  journal: "Frontiers in Nutrition"
  year: 2026
  doi: "10.3389/fnut.2026.1895788"
  url: "https://www.frontiersin.org/journals/nutrition/articles/10.3389/fnut.2026.1895788/full"
  licence: "CC BY"
  reviewed: true
---

Designing a supplementary food is arithmetic before it is anything else: pick the proportions of a few flours, add up what they contain, and see whether the blend clears the specification it has to meet. A 2026 paper in *Frontiers in Nutrition* does exactly this for an extruded instant porridge of grain amaranth, pro-vitamin A maize, soybean and sesame, aimed at children under five with moderate acute malnutrition in Tanzania, and tests the two best blends against the WFP/UNICEF CSB++ specification. Because the paper prints both its blend ratios and the composition of each flour it used, the whole planning step can be redone in a browser with the [[recipe-nutrition-calculator]]. The result reproduces the measured product almost exactly in one case, and shows that the paper's own planning table was built from different numbers. Along the way the [[concentration-converter]] handles the mineral units, and the [[nutrient-planner]] turns the same figures into a daily intake.

## The paper in brief

The authors made four flours, analysed each one, and blended them in five ratios (F1 to F5), with amaranth between 31 and 41 %, maize 35 to 45 %, soybean 15 to 21 % and sesame 5 to 11 %. The blends were extruded into an instant porridge; two of them, F1 and F5, went forward to full analysis and a sensory panel.

The headline numbers for F5: **391.93 kcal, 20.53 g protein and 11.95 g fat per 100 g**, with calcium 587.86, iron 11.44 and zinc 8.98 mg per 100 g — protein, fat, calcium, iron and zinc all inside or above the CSB++ range, energy 98 % of the minimum and potassium only 37 % of its lower bound. Extrusion also cut phytate sharply, bringing the phytate-to-iron and phytate-to-zinc molar ratios down towards the levels at which absorption is not badly inhibited.

## Checked with the tools

This is a **recomputation from the paper's own tables**: the five blend ratios and the four measured flour compositions. Nothing is simulated. Two of our steps are additions the paper does not make, and we label them: carbohydrate by difference (100 minus moisture, protein, fat, fibre and ash, because the paper reports no carbohydrate for the flours) and energy from the general Atwater factors.

**Step 1: the flours.** By difference, carbohydrate runs from **3.74 g/100 g in sesame** to **72.90 in maize**, and Atwater energy from **365.69 kcal/100 g for amaranth** to **588.66 for sesame**. Sesame is the energy lever in this formulation, and soybean (422.71 kcal, 38.29 g protein) the protein lever.

**Step 2: the blends, worked out properly.** Entering each formulation as a four-ingredient recipe of 100 g gives:

| Blend | Energy (kcal) | Protein (g) | Fat (g) | Carbohydrate (g) | Crude fibre (g) |
|---|---|---|---|---|---|
| F1 | 387.52 | 18.14 | 8.75 | 57.16 | 3.78 |
| F2 | 387.24 | 18.52 | 8.91 | 56.29 | 3.90 |
| F3 | 403.94 | 20.37 | 12.32 | 50.74 | 4.33 |
| F4 | 387.76 | 18.79 | 9.06 | 55.81 | 3.94 |
| F5 | 389.90 | 19.81 | 9.59 | 54.05 | 4.07 |

**Step 3: F1 lands on the measured product to the second decimal.** The paper measured F1 at 18.14 g protein and 8.75 g fat per 100 g. Weighting its own flour analyses by the F1 ratios gives **18.14 and 8.75**: differences of **0.004 and 0.002 g**. For F5 the agreement is looser but still close, **19.81 against 20.53 g protein** (−0.7) and **9.59 against 11.95 g fat** (−2.4). A mass balance that tight for F1 says the blending arithmetic in the paper is sound; the F5 fat gap is the kind of thing a slightly oilier sesame batch, or a sampling difference in a high-fat blend, would produce.

<!-- fig:protein -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 293" role="img" aria-label="For each of the five formulations, the protein content in the paper planning table, the value obtained by weighting the authors own flour analyses by the blend ratios, and the two products they actually analysed." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Protein per 100 g: planned, mass-weighted, measured</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Protein per 100 g: planned, mass-weighted, measured</text><line x1="58" x2="546" y1="225.1" y2="225.1" style="stroke:var(--line)"/><text x="52" y="229.1" text-anchor="end" style="fill:var(--muted)">14</text><line x1="58" x2="546" y1="181.3" y2="181.3" style="stroke:var(--line)"/><text x="52" y="185.3" text-anchor="end" style="fill:var(--muted)">16</text><line x1="58" x2="546" y1="137.6" y2="137.6" style="stroke:var(--line)"/><text x="52" y="141.6" text-anchor="end" style="fill:var(--muted)">18</text><line x1="58" x2="546" y1="93.8" y2="93.8" style="stroke:var(--line)"/><text x="52" y="97.8" text-anchor="end" style="fill:var(--muted)">20</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">22</text><line x1="89.8" x2="89.8" y1="247" y2="251" style="stroke:var(--muted)"/><text x="89.8" y="264" text-anchor="middle" style="fill:var(--muted)">F1</text><line x1="195.9" x2="195.9" y1="247" y2="251" style="stroke:var(--muted)"/><text x="195.9" y="264" text-anchor="middle" style="fill:var(--muted)">F2</text><line x1="302" x2="302" y1="247" y2="251" style="stroke:var(--muted)"/><text x="302" y="264" text-anchor="middle" style="fill:var(--muted)">F3</text><line x1="408.1" x2="408.1" y1="247" y2="251" style="stroke:var(--muted)"/><text x="408.1" y="264" text-anchor="middle" style="fill:var(--muted)">F4</text><line x1="514.2" x2="514.2" y1="247" y2="251" style="stroke:var(--muted)"/><text x="514.2" y="264" text-anchor="middle" style="fill:var(--muted)">F5</text><line x1="58" x2="546" y1="247" y2="247" style="stroke:var(--muted)"/><text x="302" y="285" text-anchor="middle" style="fill:var(--ink)">Formulation</text><text transform="translate(14 148.5) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Protein (g per 100 g)</text><circle cx="89.8" cy="212" r="4.5" style="fill:var(--c-blog);opacity:1"/><circle cx="195.9" cy="205.4" r="4.5" style="fill:var(--c-blog);opacity:1"/><circle cx="302" cy="168.2" r="4.5" style="fill:var(--c-blog);opacity:1"/><circle cx="408.1" cy="196.7" r="4.5" style="fill:var(--c-blog);opacity:1"/><circle cx="514.2" cy="177" r="4.5" style="fill:var(--c-blog);opacity:1"/><circle cx="89.8" cy="134.5" r="4.5" style="fill:var(--c-tools);opacity:1"/><circle cx="195.9" cy="126.2" r="4.5" style="fill:var(--c-tools);opacity:1"/><circle cx="302" cy="85.7" r="4.5" style="fill:var(--c-tools);opacity:1"/><circle cx="408.1" cy="120.3" r="4.5" style="fill:var(--c-tools);opacity:1"/><circle cx="514.2" cy="97.9" r="4.5" style="fill:var(--c-tools);opacity:1"/><circle cx="89.8" cy="134.5" r="6" style="fill:var(--ink);opacity:1"/><circle cx="514.2" cy="82.2" r="6" style="fill:var(--ink);opacity:1"/><circle cx="63" cy="36" r="4" style="fill:var(--c-blog)"/><text x="74" y="40" style="fill:var(--muted)">Planning table</text><circle cx="189.8" cy="36" r="4" style="fill:var(--c-tools)"/><text x="200.8" y="40" style="fill:var(--muted)">From their own flours</text><circle cx="367" cy="36" r="4" style="fill:var(--ink)"/><text x="378" y="40" style="fill:var(--muted)">Measured in the product</text><text class="fibub-mark" x="546" y="285" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. Protein per 100 g for the five blends. The paper's planning table (first colour) sits about 3 g low; weighting its own flour analyses by the blend ratios (second colour) lands on the measured products (dark points).</figcaption></figure>
<!-- /fig:protein -->

**Step 4: the planning table was built from other numbers.** The paper's own planning values sit **3.5 g lower in protein** for every single blend (14.6 against 18.14 for F1), **18 kcal lower in energy**, and **about 6.7 g higher in fibre**. A constant offset across all five blends is the signature of a different composition source, not an arithmetic slip: the planning table reads like published food-composition values (and a *dietary* fibre figure), while the products match the authors' own flour analyses (and crude fibre). Both are defensible; mixing them in one paper is what makes the planned and measured columns look inconsistent.

**Step 5: the energy shortfall is real, and it is a formulation problem.** CSB++ asks for at least 400 kcal per 100 g. Of the five blends, **only F3**, the one with 11 % sesame, clears 400 kcal on our recomputation (403.94), and its planning value was also the highest. F5, the blend chosen on sensory grounds, comes to 389.90 kcal, close to the 391.93 measured. So the 2 % energy gap the paper reports is not a measurement artefact: at 5 % sesame the blend cannot reach 400 kcal, and the tool shows how much more oilseed it would take.

<!-- fig:energy -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 293" role="img" aria-label="Energy per 100 g for the five formulations: the paper planning values, the values worked out with Atwater factors from its own flour analyses, and the two measured products, against the 400 kcal CSB++ minimum." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Energy per 100 g against the CSB++ minimum</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Energy per 100 g against the CSB++ minimum</text><line x1="58" x2="546" y1="247" y2="247" style="stroke:var(--line)"/><text x="52" y="251" text-anchor="end" style="fill:var(--muted)">360</text><line x1="58" x2="546" y1="171.2" y2="171.2" style="stroke:var(--line)"/><text x="52" y="175.2" text-anchor="end" style="fill:var(--muted)">380</text><line x1="58" x2="546" y1="95.5" y2="95.5" style="stroke:var(--line)"/><text x="52" y="99.5" text-anchor="end" style="fill:var(--muted)">400</text><line x1="89.8" x2="89.8" y1="247" y2="251" style="stroke:var(--muted)"/><text x="89.8" y="264" text-anchor="middle" style="fill:var(--muted)">F1</text><line x1="195.9" x2="195.9" y1="247" y2="251" style="stroke:var(--muted)"/><text x="195.9" y="264" text-anchor="middle" style="fill:var(--muted)">F2</text><line x1="302" x2="302" y1="247" y2="251" style="stroke:var(--muted)"/><text x="302" y="264" text-anchor="middle" style="fill:var(--muted)">F3</text><line x1="408.1" x2="408.1" y1="247" y2="251" style="stroke:var(--muted)"/><text x="408.1" y="264" text-anchor="middle" style="fill:var(--muted)">F4</text><line x1="514.2" x2="514.2" y1="247" y2="251" style="stroke:var(--muted)"/><text x="514.2" y="264" text-anchor="middle" style="fill:var(--muted)">F5</text><line x1="58" x2="546" y1="247" y2="247" style="stroke:var(--muted)"/><text x="302" y="285" text-anchor="middle" style="fill:var(--ink)">Formulation</text><text transform="translate(14 148.5) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Energy (kcal per 100 g)</text><line x1="58" x2="546" y1="95.5" y2="95.5" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="90.5" text-anchor="end" style="fill:var(--muted)">CSB++ minimum, 400 kcal</text><circle cx="89.8" cy="211.8" r="4.5" style="fill:var(--c-blog);opacity:1"/><circle cx="195.9" cy="209.1" r="4.5" style="fill:var(--c-blog);opacity:1"/><circle cx="302" cy="152.7" r="4.5" style="fill:var(--c-blog);opacity:1"/><circle cx="408.1" cy="209.1" r="4.5" style="fill:var(--c-blog);opacity:1"/><circle cx="514.2" cy="201.2" r="4.5" style="fill:var(--c-blog);opacity:1"/><circle cx="89.8" cy="142.7" r="4.5" style="fill:var(--c-tools);opacity:1"/><circle cx="195.9" cy="143.8" r="4.5" style="fill:var(--c-tools);opacity:1"/><circle cx="302" cy="80.5" r="4.5" style="fill:var(--c-tools);opacity:1"/><circle cx="408.1" cy="141.8" r="4.5" style="fill:var(--c-tools);opacity:1"/><circle cx="514.2" cy="133.7" r="4.5" style="fill:var(--c-tools);opacity:1"/><circle cx="89.8" cy="172.5" r="6" style="fill:var(--ink);opacity:1"/><circle cx="514.2" cy="126" r="6" style="fill:var(--ink);opacity:1"/><circle cx="63" cy="36" r="4" style="fill:var(--c-blog)"/><text x="74" y="40" style="fill:var(--muted)">Planning table</text><circle cx="189.8" cy="36" r="4" style="fill:var(--c-tools)"/><text x="200.8" y="40" style="fill:var(--muted)">Atwater from their own flours</text><circle cx="424.6" cy="36" r="4" style="fill:var(--ink)"/><text x="435.6" y="40" style="fill:var(--muted)">Measured in the product</text><text class="fibub-mark" x="546" y="285" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. The same three views of energy per 100 g, with the CSB++ minimum of 400 kcal. Only F3, the blend with 11 % sesame, clears it on either calculation.</figcaption></figure>
<!-- /fig:energy -->

| Check | Paper | Tool gives (from its own tables) |
|---|---|---|
| F1 protein, measured | 18.14 g/100 g | 18.14 (mass-weighted from their flours) |
| F1 fat, measured | 8.75 g/100 g | 8.75 |
| F5 protein / fat, measured | 20.53 / 11.95 g | 19.81 / 9.59 |
| F1 planning protein | 14.6 g | 18.14 (+3.5 g) |
| Blends reaching 400 kcal/100 g | F5 at 98 % of the minimum | F3 only, at 403.94 kcal |

The earlier article [[blog:discoveries/squid-powder-burger-buns-protein-energy-atwater|on squid-powder buns]] runs the same check on a bakery product, where the mass balance did **not** reproduce the measured protein; the contrast is instructive.

## How we made the graphs

The charts and every number come from `scripts/blog-figures/amaranth-porridge-formulation-nutrition-recomputed.mjs` in fibub's public code. It calls `parseRecipe`, `recipe` and `atwater` from `src/lib/sci/nutrition.ts`, the maths behind the [[recipe-nutrition-calculator]], once per formulation, with each flour entered at its blend percentage in grams so that "per 100 g of recipe" is "per 100 g of blend".

The blend ratios, the flour analyses, the planning values and the two measured products are the paper's. **Our additions**: carbohydrate by difference, energy from the 4/9/4/2 Atwater factors, zero cooking loss (the porridge is a dry powder, so the blend's dry mass is its mass), and the reading that the planning table uses dietary fibre where the flour table uses crude fibre.

## How we test the maths

On every change to fibub, `tests/sci.mjs` runs `tests/sci-tools/recipe-nutrition-calculator.mjs`, which pins the calculator against an independent NumPy sum:

- The tool's example recipe must give a raw weight of 1520 g, 1002.5 kcal in total and 77.5929 kcal per 100 g cooked after a 15 % loss, with the energy shares of the five ingredients adding to exactly 1.
- Switching energy to the macronutrients must give 1006 kcal, and the US-style "carbohydrate includes fibre" option 894 kcal.
- Impossible rows must be refused with a reason: a missing amount, saturates above total fat, more than 100 g of nutrients in 100 g, a 100 % cooking loss.
- An earlier article's paper is pinned too: its bun energies must follow 4/9/4/2 to 0.1 kcal.
- New with this article: the four flour compositions, carbohydrate by difference, must give Atwater energies of 365.69, 370.43, 422.71 and 588.66 kcal/100 g, and the F1 and F5 blends must come to 387.52 and 389.90 kcal with 18.14 and 19.81 g protein and 8.75 and 9.59 g fat per 100 g.

## Check it yourself

On the [[recipe-nutrition-calculator]], in the *Your ingredients* card:

1. Clear the box and paste this header and four rows (the amounts are the F1 percentages, so the recipe weighs 100 g):

   `Ingredient, Amount (g), Energy (kcal), Fat, Saturates, Carbohydrate, Sugars, Fibre, Protein, Salt`
   `Grain amaranth, 35, 365.69, 6.05, 0, 58.26, 0, 4.18, 17.46, 0`
   `Maize, 45, 370.43, 3.33, 0, 72.9, 0, 2.17, 11.13, 0`
   `Soybean, 15, 422.71, 17.41, 0, 25.21, 0, 6.01, 38.29, 0`
   `Sesame, 5, 588.66, 50.48, 0, 3.74, 0, 8.77, 25.46, 0`
2. Set *Servings* to **1** and leave *Weight lost in cooking (%)* at **0**.
3. Set *Energy* to **From the nutrients (4/9/4/2)**.
4. Under *Nutrition*, the per-100 g column reads **387.5 kcal**, **18.1 g protein**, **8.8 g fat**, **57.2 g carbohydrate** and **3.8 g fibre** — the paper's measured F1 protein and fat, to the first decimal.
5. Change the amounts to **40, 35, 20, 5** for F5: energy rises to **389.9 kcal** and protein to **19.8 g**.
6. Now try **31, 37, 21, 11** (F3): energy passes **403.9 kcal**, clearing the 400 kcal CSB++ minimum, and *Where the energy comes from* shows sesame's share jumping to 16 %.

## What researchers can use it for

- **Check a formulation table before publishing it**: weight your own ingredient analyses by the blend and see whether the planned column follows from them, as in Step 4.
- **Decide how much oilseed an energy target needs**, by stepping one ingredient up and watching energy per 100 g, instead of making another batch.
- **Separate a measurement problem from a design problem**: here the 400 kcal shortfall survives the recomputation, so no amount of re-analysis would fix it.
- **Keep fibre definitions straight.** Crude fibre and total dietary fibre differ by a factor of two or three, and the energy factor only applies to the dietary figure.
- **Teach food formulation** with a published, open case study rather than invented numbers.

## The fine print

- Carbohydrate by difference carries every other error in the proximate analysis, and it includes some components that are not fully available.
- The general Atwater factors are an approximation; specific factors for legumes and oilseeds differ by a few per cent.
- We compared dry blends. The paper's products are extruded, which changes water, bulk density and starch digestibility but not the mass of protein or fat.
- We did not recompute the minerals or the anti-nutrients; the tool has no mineral columns, and phytate ratios need molar masses.
- Nothing here is dietary advice, and the CSB++ figures are quoted from the paper. For a real programme, check the current specification from its own source.

---
title: "Squid powder in burger buns: why the protein rose but the calories did not"
summary: "A 2025 Frontiers in Nutrition study adds steamed squid powder to burger buns. We rebuild its energy and protein tables with fibub's recipe nutrition calculator and find one that checks out and one that does not."
tools: [recipe-nutrition-calculator, brine-calculator, shelf-life-estimator, thermal-process-calculator]
updated: 2026-11-24
sources:
  - "Ali, R. F. M. and El-Anany, A. M. (2025), Nutritional and sensory characteristics of developed wheat burger buns incorporated with different levels of steamed-squid (Loligo forbesii) powder, Frontiers in Nutrition 12: 1615629, doi:10.3389/fnut.2025.1615629. Licence CC BY 4.0 (checked in the Crossref record for the DOI and on the Frontiers article page, 2026-11-24). Values used here: wheat flour and steamed squid powder analyses (protein 10.60 and 78.98, fat 1.25 and 3.90, crude fibre 0.59 and none detected, ash 0.60 and 3.75, carbohydrate 86.96 and 13.37 g/100 g dry weight, energy 401.49 and 404.50 kcal/100 g); the 1,000 g flour dough formulation with 60 g sugar, 30 mL palmolein oil, 12.5 g dry yeast, 10 g salt and 5 g improver; and the six buns, protein 12.13 to 17.31, fat 4.08 to 4.41, carbohydrate 82.06 to 76.16 g/100 g dry weight with energy 415.08 to 415.27 kcal/100 g."
  - "General Atwater factors (4 kcal/g protein and available carbohydrate, 9 kcal/g fat, 2 kcal/g fibre): FAO (2003), Food energy: methods of analysis and conversion factors, FAO Food and Nutrition Paper 77."
paper:
  title: "Nutritional and sensory characteristics of developed wheat burger buns incorporated with different levels of steamed-squid (Loligo forbesii) powder"
  authors: "Ali RFM, El-Anany AM"
  journal: "Frontiers in Nutrition"
  year: 2025
  doi: "10.3389/fnut.2025.1615629"
  url: "https://www.frontiersin.org/journals/nutrition/articles/10.3389/fnut.2025.1615629/full"
  licence: "CC BY 4.0"
  reviewed: true
---

Food papers are full of composition tables, and almost nobody checks them. Yet two things in such a table must agree: the energy must follow from the macronutrients, and the product's composition must follow from the ingredients that went in. A 2025 study in *Frontiers in Nutrition* replaced 1 to 5 % of the wheat flour in burger buns with powder made from steamed squid, and reports both the ingredient analyses and the finished buns, so both checks can be done. We did them with the [[recipe-nutrition-calculator]]: the energy table comes out exact to the last decimal, and the protein table does not add up. For the rest of a small food-science workflow, the [[brine-calculator]], [[shelf-life-estimator]] and [[thermal-process-calculator]] sit beside it.

## The paper in brief

The authors dried and ground steamed squid (*Loligo forbesii*) and used it to replace 1, 2, 3, 4 and 5 % of the wheat flour in a burger bun recipe built on 1,000 g of flour, with sugar, oil, dry yeast, salt and an improver. They report the composition of both flours, of the six baked buns, the amino acids, loaf volume and a sensory panel.

The headline results: squid powder is 78.98 % protein on a dry basis against the wheat flour's 10.60 %, and the buns' protein rises from 12.13 to 17.31 g per 100 g dry weight as substitution goes from 0 to 5 %. Carbohydrate falls by about the same amount. Loaf volume drops at 4 and 5 % substitution, lysine stays below the FAO/WHO reference, and the sensory scores stay high. The reported energy of the six buns hardly moves at all: 415.08 to 415.27 kcal per 100 g.

## Checked with the tools

Everything below is a **recomputation from the numbers printed in the paper's own tables**. Nothing is simulated.

**Step 1: the energy table is exactly the general Atwater sum.** The tool has a switch, *Energy*, that either takes the energy from the labels or works it out from the nutrients at 4 kcal per gram of protein, 9 for fat, 4 for carbohydrate and 2 for fibre. Run on each bun's own macronutrients, the 4/9/4/2 rule gives **415.14, 415.21, 415.08, 415.13, 415.27 and 415.19 kcal per 100 g**: every published value, to the last decimal place (Figure 1). Leave fibre out, as many labs do, and every value drops by 1.6 to 1.7 kcal, so the match would be gone. The two ingredient analyses, though, follow the *other* convention: 4/9/4 without fibre gives exactly 401.49 and 404.50 kcal, the published values, while counting fibre would make the flour 402.67. The paper switched conventions between its tables, which is worth knowing before anyone reuses those figures.

<!-- fig:energy -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 308" role="img" aria-label="The published energy of the six burger buns against the tool’s Atwater energy from the same macronutrients, with and without fibre counted at 2 kcal per gram. The 4/9/4/2 line sits exactly on the published points." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Burger buns: energy against squid powder added</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Burger buns: energy against squid powder added</text><line x1="58" x2="546" y1="262" y2="262" style="stroke:var(--line)"/><text x="52" y="266" text-anchor="end" style="fill:var(--muted)">410</text><line x1="58" x2="546" y1="209" y2="209" style="stroke:var(--line)"/><text x="52" y="213" text-anchor="end" style="fill:var(--muted)">412</text><line x1="58" x2="546" y1="156" y2="156" style="stroke:var(--line)"/><text x="52" y="160" text-anchor="end" style="fill:var(--muted)">414</text><line x1="58" x2="546" y1="103" y2="103" style="stroke:var(--line)"/><text x="52" y="107" text-anchor="end" style="fill:var(--muted)">416</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">418</text><line x1="80.2" x2="80.2" y1="262" y2="266" style="stroke:var(--muted)"/><text x="80.2" y="279" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="168.9" x2="168.9" y1="262" y2="266" style="stroke:var(--muted)"/><text x="168.9" y="279" text-anchor="middle" style="fill:var(--muted)">1</text><line x1="257.6" x2="257.6" y1="262" y2="266" style="stroke:var(--muted)"/><text x="257.6" y="279" text-anchor="middle" style="fill:var(--muted)">2</text><line x1="346.4" x2="346.4" y1="262" y2="266" style="stroke:var(--muted)"/><text x="346.4" y="279" text-anchor="middle" style="fill:var(--muted)">3</text><line x1="435.1" x2="435.1" y1="262" y2="266" style="stroke:var(--muted)"/><text x="435.1" y="279" text-anchor="middle" style="fill:var(--muted)">4</text><line x1="523.8" x2="523.8" y1="262" y2="266" style="stroke:var(--muted)"/><text x="523.8" y="279" text-anchor="middle" style="fill:var(--muted)">5</text><line x1="58" x2="546" y1="262" y2="262" style="stroke:var(--muted)"/><text x="302" y="300" text-anchor="middle" style="fill:var(--ink)">Flour replaced by squid powder (%)</text><text transform="translate(14 156) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Energy (kcal per 100 g dry)</text><circle cx="80.2" cy="125.8" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="168.9" cy="123.9" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="257.6" cy="127.4" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="346.4" cy="126.1" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="435.1" cy="122.3" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="523.8" cy="124.5" r="4" style="fill:var(--c-blog);opacity:1"/><path d="M80.2 125.8L168.9 123.9L257.6 127.4L346.4 126.1L435.1 122.3L523.8 124.5" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><path d="M80.2 169.8L168.9 167.9L257.6 170.8L346.4 169.5L435.1 165.3L523.8 167.4" style="fill:none;stroke:var(--ink);stroke-width:2;stroke-linejoin:round;stroke-dasharray:5 4"/><circle cx="63" cy="36" r="4" style="fill:var(--c-blog)"/><text x="74" y="40" style="fill:var(--muted)">Paper</text><line x1="120" x2="132" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="136" y="40" style="fill:var(--muted)">Tool, 4/9/4/2 (fibre counted)</text><line x1="354.8" x2="366.8" y1="36" y2="36" style="stroke:var(--ink);stroke-width:2;stroke-dasharray:5 4"/><text x="370.8" y="40" style="fill:var(--muted)">Tool, 4/9/4 (fibre not counted)</text><text class="fibub-mark" x="546" y="300" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. The paper’s published energy for each bun (dots) and the energy the Recipe nutrition calculator’s maths works out from the same protein, fat, carbohydrate and fibre. Counting fibre at 2 kcal per gram reproduces every published value to 0.01 kcal.</figcaption></figure>
<!-- /fig:energy -->

**Step 2: why the energy could not have changed.** The paper notes the energy stayed almost constant. The tool shows why in one line. From the control to the 5 % bun, protein adds 4 × 5.18 = **+20.72 kcal**, carbohydrate takes away 4 × 5.90 = **−23.60**, fat adds 9 × 0.33 = **+2.97** and fibre takes 0.04 away. The four terms come to **+0.05 kcal per 100 g**, exactly the published change. Protein and available carbohydrate carry the same 4 kcal per gram, so swapping one for the other cannot move the energy; only the small fat rise can, and it does not. "Higher protein at the same calories" is arithmetic here, not an effect of the squid.

**Step 3: the protein table does not follow from the ingredients.** The tool's main job is a mass balance: put in each ingredient's weight and its values per 100 g, and it adds the nutrients up. We built each dough from the paper's own two analyses, on a dry-solids basis (flour at 11.50 % moisture, squid powder at 8.50 %), with the sugar, oil, yeast, salt and improver from its formulation table. Their label values are **our assumption** (sugar as pure carbohydrate, palmolein oil as pure fat at 0.9 g/mL, dry yeast as 40 % protein, 40 % carbohydrate and 20 % fibre).

The result (Figure 2): the dough's protein should be **9.89 g per 100 g dry solids** for the control and **13.01 g** at 5 % substitution. The paper measured 12.13 and 17.31. The gap is 2.2 points at the bottom and 4.3 at the top, and the slope is wrong too: each 1 % of flour replaced can only add **0.62 points** of protein, because squid powder at 78.98 % replaces flour at 10.60 % in a dough that is only about 89 % flour solids, while the measured buns gain **1.04 points** per 1 %.

| Check | Paper | Our tool result |
|---|---|---|
| Energy of the six buns | 415.08 to 415.27 kcal/100 g | the same six values, exactly, from 4/9/4/2 |
| Energy of flour and squid powder | 401.49 and 404.50 kcal/100 g | the same two values, from 4/9/4 (fibre not counted) |
| Energy change, control to 5 % | +0.05 kcal/100 g | +0.05 (+20.72 protein, −23.60 carbohydrate, +2.97 fat, −0.04 fibre) |
| Protein, control bun | 12.13 g/100 g dry | 9.89 from the ingredients |
| Protein, 5 % bun | 17.31 g/100 g dry | 13.01 from the ingredients |
| Protein gained per 1 % flour replaced | 1.04 points | 0.62 points |
| Carbohydrate, control bun | 82.06 g/100 g dry | 84.00 from the ingredients |

<!-- fig:protein -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 308" role="img" aria-label="Measured bun protein rises from 12.13 to 17.31 g per 100 g dry weight, while a mass balance of the dough from the paper’s own ingredient analyses rises from 9.89 to 13.02." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Protein: measured against what the ingredients allow</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Protein: measured against what the ingredients allow</text><line x1="58" x2="546" y1="223.5" y2="223.5" style="stroke:var(--line)"/><text x="52" y="227.5" text-anchor="end" style="fill:var(--muted)">10</text><line x1="58" x2="546" y1="175.3" y2="175.3" style="stroke:var(--line)"/><text x="52" y="179.3" text-anchor="end" style="fill:var(--muted)">13</text><line x1="58" x2="546" y1="127.1" y2="127.1" style="stroke:var(--line)"/><text x="52" y="131.1" text-anchor="end" style="fill:var(--muted)">15</text><line x1="58" x2="546" y1="78.9" y2="78.9" style="stroke:var(--line)"/><text x="52" y="82.9" text-anchor="end" style="fill:var(--muted)">18</text><line x1="80.2" x2="80.2" y1="262" y2="266" style="stroke:var(--muted)"/><text x="80.2" y="279" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="168.9" x2="168.9" y1="262" y2="266" style="stroke:var(--muted)"/><text x="168.9" y="279" text-anchor="middle" style="fill:var(--muted)">1</text><line x1="257.6" x2="257.6" y1="262" y2="266" style="stroke:var(--muted)"/><text x="257.6" y="279" text-anchor="middle" style="fill:var(--muted)">2</text><line x1="346.4" x2="346.4" y1="262" y2="266" style="stroke:var(--muted)"/><text x="346.4" y="279" text-anchor="middle" style="fill:var(--muted)">3</text><line x1="435.1" x2="435.1" y1="262" y2="266" style="stroke:var(--muted)"/><text x="435.1" y="279" text-anchor="middle" style="fill:var(--muted)">4</text><line x1="523.8" x2="523.8" y1="262" y2="266" style="stroke:var(--muted)"/><text x="523.8" y="279" text-anchor="middle" style="fill:var(--muted)">5</text><line x1="58" x2="546" y1="262" y2="262" style="stroke:var(--muted)"/><text x="302" y="300" text-anchor="middle" style="fill:var(--ink)">Flour replaced by squid powder (%)</text><text transform="translate(14 156) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Protein (g per 100 g dry)</text><circle cx="80.2" cy="182.4" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="168.9" cy="161.6" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="257.6" cy="139.8" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="346.4" cy="116.5" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="435.1" cy="100.5" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="523.8" cy="82.6" r="4" style="fill:var(--c-blog);opacity:1"/><path d="M80.2 182.4L168.9 161.6L257.6 139.8L346.4 116.5L435.1 100.5L523.8 82.6" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><path d="M80.2 225.6L168.9 213.6L257.6 201.5L346.4 189.5L435.1 177.4L523.8 165.4" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><circle cx="63" cy="36" r="4" style="fill:var(--c-blog)"/><text x="74" y="40" style="fill:var(--muted)">Paper, measured buns</text><line x1="228" x2="240" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="244" y="40" style="fill:var(--muted)">Tool, mass balance of the dough</text><text class="fibub-mark" x="546" y="300" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. Measured bun protein against the mass balance of the dough worked out with the tool from the paper’s own flour and squid analyses, with our assumed values for sugar, oil, yeast, salt and improver. The two disagree by about 2 g per 100 g at every level.</figcaption></figure>
<!-- /fig:protein -->

**Step 4: what could explain the gap, and what cannot.** Baking loss cannot: both sides are on a dry-weight basis, and losing water changes neither. Fermentation can only remove sugar, and removing all 60 g of it still leaves the control bun at 10.5 % protein. For the mass balance to reach 12.13 %, **18.5 %** of the dough's dry matter would have to disappear, which no bun does. A different nitrogen-to-protein factor would help a little (6.25 instead of a wheat-specific 5.70 raises the flour's 10.60 to about 11.6) but not enough, and it would not fix the slope. The likeliest reading is that the bun analyses and the ingredient analyses were not done on matching material or on the same basis. Either way, anyone reusing this paper's protein figures should treat the ingredient table and the bun table as separate measurements rather than as one consistent set.

## How we made the graphs

Both figures and every number come from `scripts/blog-figures/squid-powder-burger-buns-protein-energy-atwater.mjs` in fibub's public code. It calls `parseRecipe`, `recipe` and `atwater` from `src/lib/sci/nutrition.ts`, the maths behind the [[recipe-nutrition-calculator]]. The recipes are fed to it as the same comma-separated rows a reader would paste into the tool, and `cookedWeight` is set to the dough's dry-solids weight, which turns the tool's "per 100 g" column into a dry-weight composition.

Inputs from the paper: the two ingredient analyses, the formulation table and the six bun analyses. **Our assumptions**: the label values for sugar, oil, yeast, salt and improver; oil at 0.9 g per mL; and that the improver behaves as carbohydrate. None of them changes the conclusion, because together they are under 12 % of the dry solids and carry almost no protein.

## How we test the maths

On every change to fibub, `tests/sci.mjs` runs `tests/sci-tools/recipe-nutrition-calculator.mjs`, which pins this maths against an independent NumPy sum on the tool's own example recipe:

- The example's totals must be 1,002.5 kcal, 25.6 g fat, 127.5 g carbohydrate and 52.4 g protein, and 77.5929 kcal per 100 g of cooked food after a 15 % cooking loss.
- With the Atwater switch on, the same recipe must give 1,006 kcal, and 894 kcal when the carbohydrate column is read US-style as including fibre.
- A kJ column must convert at 4.184 kJ per kcal and a sodium column at 2.5 g salt per gram of sodium.
- New with this article: the 4/9/4/2 rule must give 415.14 kcal for the control bun and 415.19 for the 5 % bun, 4/9/4 must give 401.49 for the flour, and the 5 % dough built from the paper's analyses must come to 1,001 g of dry solids with 13.0124 g protein, 80.6427 g carbohydrate and 411.44 kcal per 100 g.

## Check it yourself

On the [[recipe-nutrition-calculator]] page, press *Start a blank table* and paste these rows, which are the 5 % dough on a dry-solids basis (the first two lines are the paper's analyses, the rest our assumed values):

```
Ingredient, Amount (g), Energy (kcal), Fat, Saturates, Carbohydrate, Sugars, Fibre, Protein, Salt
Wheat flour (dry solids), 840.75, 401.49, 1.25, 0, 86.96, 0, 0.59, 10.6, 0
Squid powder (dry solids), 45.75, 404.5, 3.9, 0, 13.37, 0, 0, 78.98, 0
Sugar, 60, 400, 0, 0, 100, 0, 0, 0, 0
Palmolein oil, 27, 900, 100, 0, 0, 0, 0, 0, 0
Dry active yeast, 12.5, 360, 0, 0, 40, 0, 20, 40, 0
Salt, 10, 0, 0, 0, 0, 0, 0, 0, 100
Improver, 5, 400, 0, 0, 100, 0, 0, 0, 0
```

1. Set *Servings* to **1** and *Or weight after cooking (g)* to **1001**, the dry-solids weight, so the per-100-g column is a dry-weight composition.
2. Set *Energy* to **From the nutrients (4/9/4/2)**.
3. The per-100-g column should read about **411 kcal**, protein **13.0 g**, carbohydrate **80.6 g**, fat **3.9 g**, salt **1.00 g**. That is the most protein these ingredients can give; the paper measured 17.31.
4. Change the squid powder row's amount to **0** and the flour's to **885** (the control dough) and protein falls to **9.9 g**, against the paper's 12.13.
5. To see the energy identity, make a one-line table with the control bun's own macronutrients: `Bun, 100, 0, 4.08, 0, 82.06, 0, 0.83, 12.13, 0`, keep *Energy* on **From the nutrients**, and the energy shows **415** kcal.

## What researchers can use it for

- **Check a composition table before citing it**: the energy column should follow from the macronutrients, and the product should follow from the ingredients. Both take two minutes here.
- **Say which energy convention you used**: 4/9/4 and 4/9/4/2 differ by a couple of kcal per 100 g in a bread, which is enough to make a table look reproducible or not.
- **Design a substitution trial**: before baking, the mass balance tells you how much protein a given replacement level can add, so you can choose levels that give a measurable difference.
- **Report per serving and per 100 g**: the tool gives both from one table, which is what a food label and a paper's table respectively need.
- **Teach mass balance**: the dry-solids trick (setting the cooked weight to the solids weight) makes composition tables comparable whatever the moisture.

## The fine print

- The labels for sugar, oil, yeast, salt and improver are our assumptions, not the paper's; it does not analyse them.
- The oil is given in mL, so its weight depends on a density we chose (0.9 g/mL). Using 30 g instead changes the control's protein by 0.03 points.
- We did not touch the amino acid, loaf volume or sensory results, and we are not questioning them.
- A mass balance assumes nutrients neither appear nor vanish in baking. Protein can be lost from a bun's crust in theory, but that would lower the measured protein, not raise it.
- Crude fibre, as measured here, is not the dietary fibre a food label reports, which is one more reason the 2 kcal per gram term should be stated rather than assumed.

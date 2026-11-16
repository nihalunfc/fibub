---
title: "Silver oak (Grevillea robusta) biomass equations from harvested trees"
summary: "A 2026 pilot study cuts down and weighs eight silver oak trees in Thailand to build biomass and carbon equations. We refit them and turn them into stored CO₂ with fibub's allometry and tree carbon tools."
tools: [tree-carbon, allometry-calculator, tree-height-basal-area]
updated: 2026-11-16
sources:
  - "Uttaruk, Y., Laosuwan, T., Sangpradid, S., Samek, J. H., Butthep, C., Rotjanakusol, T. et al. (2026), Species-Specific Allometric Models for Biomass and Carbon Stock Estimation in Silver Oak (Grevillea robusta) Plantation Forests in Thailand: A Pilot-Scale Destructive Study, Forests 17: 100, doi:10.3390/f17010100. Licence CC BY (Creative Commons Attribution), checked on the article file, 2026-11-16. Values used here: one harvested tree per age from 2 to 9 years, with height, DBH and dry above-ground and root biomass of each; the above-ground equation 0.1609 (D²H)^0.7846 (R² 0.8409); mean carbon fraction of all parts 47.135 %; 3 × 3 m spacing; Nakhon Ratchasima Province."
  - "Log-scale fitting and bias corrections: Baskerville, G. L. (1972), Canadian Journal of Forest Research 2: 49-53; Sprugel, D. G. (1983), Ecology 64: 209-210; Duan, N. (1983), Journal of the American Statistical Association 78: 605-610."
  - "CO₂ from carbon: the ratio of molar masses 44.0095 / 12.011 (standard atomic weights)."
paper:
  title: "Species-Specific Allometric Models for Biomass and Carbon Stock Estimation in Silver Oak (Grevillea robusta) Plantation Forests in Thailand: A Pilot-Scale Destructive Study"
  authors: "Uttaruk Y, Laosuwan T, Sangpradid S, Samek JH, Butthep C, Rotjanakusol T et al."
  journal: "Forests"
  year: 2026
  doi: "10.3390/f17010100"
  url: "https://www.mdpi.com/1999-4907/17/1/100"
  licence: "CC BY"
  reviewed: true
---

How much carbon does a plantation tree hold? Nobody can weigh every tree, so foresters use an **allometric equation**: a formula that predicts a tree's dry weight from things you can measure standing, such as its diameter at breast height (DBH, 1.3 m above the ground) and its height. Equations built for tropical forests in general can be far off for one fast-growing plantation species. A 2026 pilot study in *Forests* builds the first equations for silver oak, *Grevillea robusta*, grown in Thailand for timber and carbon credits. This article shows how the [[allometry-calculator]] refits such an equation and how the [[tree-carbon]] calculator turns it into stored carbon dioxide; heights and diameters for a whole plot come from the [[tree-height-basal-area]] tool.

## The paper in brief

The team felled one tree of each age from 2 to 9 years in a commercial plantation in Nakhon Ratchasima Province, measured its height and DBH, then separated stem, branches, leaves and roots, dried and weighed them. They fitted equations of the form **biomass = a (D²H)^b**, where D is DBH in cm and H is height in m (D²H is roughly proportional to the stem's volume), by straight-line regression on log scales. They also measured the carbon content of each part with a laboratory analyser: **47.1 %** of the dry weight on average, close to the 47 % default of the Intergovernmental Panel on Climate Change. The authors call the study a pilot: eight trees from one site, to be tested on more.

## Checked with the tools

Here we **refit the paper's own published tree measurements** (height, DBH and weighed biomass of all eight trees) with fibub's maths, and use its equation and carbon fraction to work out stored CO₂. Nothing is simulated.

**Step 1: refit the above-ground equation.** The [[allometry-calculator]]'s least-squares fit on log scales gives **biomass = 0.147 (D²H)^0.795**, with an R² of 0.942 on the log scale. Multiplying a by Duan's smearing factor (1.057), the usual correction for the bias of back-transforming from logs, gives **a = 0.155**. The paper reports a = 0.1609 and b = 0.7846: very close, but not identical. The small gap probably comes from details the paper does not give, such as its exact smearing factor, or from the first tree's D²H, which the paper lists as 267.1 although 6.05² × 6.65 = 243.4.

**Step 2: how certain is the exponent?** With only eight trees, the 95 % interval for b is wide: **0.60 to 0.99**. An exponent of 1 (biomass rising in step with stem volume) lies just outside it. The paper's R² of 0.84 is lower than our 0.94 because it is measured in kilograms rather than on the log scale; in kilograms we get 0.72 for the paper's equation, because the heaviest tree dominates.

**Step 3: the 9-year tree.** The weighed 9-year tree had 860 kg of dry biomass above ground, of which 263 kg was branches. The equation predicts **465 kg** for it, barely more than for the 8-year tree, which is almost the same size (Figure 1). Is the 9-year tree an outlier? The calculator's **95 % prediction limits** for one new tree of that size are **168 to 1,330 kg**, so no: with eight trees, a single tree typically sits within a factor of about 1.45 of the line, and the limits are wider still. Equations like this predict a stand's total well, but individual trees only roughly.

<!-- fig:allo -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 298" role="img" aria-label="Eight harvested silver oak trees on log scales with the paper's equation and the 95 % prediction limits of our refit. The 9-year tree (860 kg) sits above the line (473 kg predicted) but inside the limits." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Silver oak: above-ground biomass against D²H</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Silver oak: above-ground biomass against D²H</text><line x1="58" x2="546" y1="218.3" y2="218.3" style="stroke:var(--line)"/><text x="52" y="222.3" text-anchor="end" style="fill:var(--muted)">10</text><line x1="58" x2="546" y1="151" y2="151" style="stroke:var(--line)"/><text x="52" y="155" text-anchor="end" style="fill:var(--muted)">100</text><line x1="58" x2="546" y1="83.7" y2="83.7" style="stroke:var(--line)"/><text x="52" y="87.7" text-anchor="end" style="fill:var(--muted)">1000</text><line x1="228.8" x2="228.8" y1="252" y2="256" style="stroke:var(--muted)"/><text x="228.8" y="269" text-anchor="middle" style="fill:var(--muted)">1000</text><line x1="472.8" x2="472.8" y1="252" y2="256" style="stroke:var(--muted)"/><text x="472.8" y="269" text-anchor="middle" style="fill:var(--muted)">10000</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--muted)"/><text x="302" y="290" text-anchor="middle" style="fill:var(--ink)">D²H (cm² m, log scale)</text><text transform="translate(14 151) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Dry biomass (kg, log scale)</text><circle cx="79" cy="202" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="127.5" cy="208.6" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="351" cy="159.4" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="387.2" cy="153.1" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="465.7" cy="141.7" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="451.3" cy="131" r="4" style="fill:var(--c-blog);opacity:1"/><path d="M58 217.6L70.2 215L82.4 212.3L94.6 209.6L106.8 207L119 204.4L131.2 201.7L143.4 199.1L155.6 196.5L167.8 193.8L180 191.2L192.2 188.5L204.4 185.9L216.6 183.3L228.8 180.6L241 177.9L253.2 175.3L265.4 172.7L277.6 170.1L289.8 167.4L302 164.7L314.2 162.1L326.4 159.5L338.6 156.9L350.8 154.2L363 151.5L375.2 148.9L387.4 146.3L399.6 143.6L411.8 141L424 138.3L436.2 135.7L448.4 133.1L460.6 130.4L472.8 127.8L485 125.1L497.2 122.5L509.4 119.8L521.6 117.2L533.8 114.6L546 111.9" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><path d="M58 185.5L70.2 183.1L82.4 180.8L94.6 178.4L106.8 176L119 173.7L131.2 171.3L143.4 168.9L155.6 166.5L167.8 164.1L180 161.6L192.2 159.1L204.4 156.7L216.6 154.2L228.8 151.7L241 149.2L253.2 146.7L265.4 144.2L277.6 141.6L289.8 139.1L302 136.5L314.2 133.9L326.4 131.3L338.6 128.6L350.8 126L363 123.4L375.2 120.7L387.4 118L399.6 115.3L411.8 112.6L424 109.9L436.2 107.1L448.4 104.3L460.6 101.6L472.8 98.8L485 96L497.2 93.2L509.4 90.3L521.6 87.5L533.8 84.6L546 81.7" style="fill:none;stroke:var(--muted);stroke-width:2;stroke-linejoin:round;stroke-dasharray:3 3"/><path d="M58 251.7L70.2 248.7L82.4 245.7L94.6 242.7L106.8 239.7L119 236.8L131.2 233.8L143.4 230.9L155.6 227.9L167.8 225L180 222L192.2 219.1L204.4 216.2L216.6 213.4L228.8 210.5L241 207.7L253.2 204.8L265.4 202L277.6 199.2L289.8 196.4L302 193.6L314.2 190.9L326.4 188.1L338.6 185.4L350.8 182.6L363 180L375.2 177.3L387.4 174.6L399.6 171.9L411.8 169.3L424 166.7L436.2 164.1L448.4 161.5L460.6 158.9L472.8 156.3L485 153.8L497.2 151.3L509.4 148.7L521.6 146.2L533.8 143.7L546 141.2" style="fill:none;stroke:var(--muted);stroke-width:2;stroke-linejoin:round;stroke-dasharray:3 3"/><circle cx="63" cy="36" r="4" style="fill:var(--c-blog)"/><text x="74" y="40" style="fill:var(--muted)">Harvested trees</text><line x1="192" x2="204" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="208" y="40" style="fill:var(--muted)">Paper equation</text><line x1="318.8" x2="330.8" y1="36" y2="36" style="stroke:var(--muted);stroke-width:2;stroke-dasharray:3 3"/><text x="334.8" y="40" style="fill:var(--muted)">95 % prediction</text></svg><figcaption>Figure 1. The eight harvested trees (weighed above-ground dry biomass against D²H, both on log scales), the paper's equation 0.1609 (D²H)^0.7846, and the 95 % prediction limits for one new tree from our refit with the Allometry calculator's maths.</figcaption></figure>
<!-- /fig:allo -->

**Step 4: from biomass to CO₂.** The [[tree-carbon]] calculator adds roots with a root-to-shoot ratio (we used 0.20, the weighed roots of all eight trees divided by their above-ground biomass), multiplies by the paper's 47.135 % carbon and converts carbon to CO₂ with 44.0095 ÷ 12.011 = 3.664. The equation gives about **243 kg of CO₂** in a 5-year tree and **963 kg** in the 9-year tree; the weighed biomass of the same trees gives 221 kg and **1,665 kg** (Figure 2). Up to 8 years the two differ by up to about 40 % either way (most at 2 and 6 years); at 9 years the equation finds only 58 % of the weighed CO₂. Anyone selling carbon credits from such equations should check them against more large trees first.

<!-- fig:co2 -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 278" role="img" aria-label="Whole-tree CO2 equivalent for each harvested tree: from the weighed biomass (roots included) and from the paper's AGB equation with a root-to-shoot ratio of 0.20. They agree up to 8 years; at 9 years the equation gives about half." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>CO₂ held in each tree, by age</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">CO₂ held in each tree, by age</text><line x1="58" x2="546" y1="232" y2="232" style="stroke:var(--line)"/><text x="52" y="236" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="181.4" y2="181.4" style="stroke:var(--line)"/><text x="52" y="185.4" text-anchor="end" style="fill:var(--muted)">500</text><line x1="58" x2="546" y1="130.9" y2="130.9" style="stroke:var(--line)"/><text x="52" y="134.9" text-anchor="end" style="fill:var(--muted)">1e+3</text><line x1="58" x2="546" y1="80.3" y2="80.3" style="stroke:var(--line)"/><text x="52" y="84.3" text-anchor="end" style="fill:var(--muted)">1.5e+3</text><line x1="88.5" x2="88.5" y1="232" y2="236" style="stroke:var(--muted)"/><text x="88.5" y="249" text-anchor="middle" style="fill:var(--muted)">2</text><line x1="149.5" x2="149.5" y1="232" y2="236" style="stroke:var(--muted)"/><text x="149.5" y="249" text-anchor="middle" style="fill:var(--muted)">3</text><line x1="210.5" x2="210.5" y1="232" y2="236" style="stroke:var(--muted)"/><text x="210.5" y="249" text-anchor="middle" style="fill:var(--muted)">4</text><line x1="271.5" x2="271.5" y1="232" y2="236" style="stroke:var(--muted)"/><text x="271.5" y="249" text-anchor="middle" style="fill:var(--muted)">5</text><line x1="332.5" x2="332.5" y1="232" y2="236" style="stroke:var(--muted)"/><text x="332.5" y="249" text-anchor="middle" style="fill:var(--muted)">6</text><line x1="393.5" x2="393.5" y1="232" y2="236" style="stroke:var(--muted)"/><text x="393.5" y="249" text-anchor="middle" style="fill:var(--muted)">7</text><line x1="454.5" x2="454.5" y1="232" y2="236" style="stroke:var(--muted)"/><text x="454.5" y="249" text-anchor="middle" style="fill:var(--muted)">8</text><line x1="515.5" x2="515.5" y1="232" y2="236" style="stroke:var(--muted)"/><text x="515.5" y="249" text-anchor="middle" style="fill:var(--muted)">9</text><line x1="58" x2="546" y1="232" y2="232" style="stroke:var(--muted)"/><text x="302" y="270" text-anchor="middle" style="fill:var(--ink)">Age (years)</text><text transform="translate(14 141) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">CO₂ equivalent (kg per tree)</text><circle cx="88.5" cy="227.7" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="149.5" cy="228.9" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="210.5" cy="214.2" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="271.5" cy="209.7" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="332.5" cy="201.2" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="393.5" cy="192.2" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="454.5" cy="132.9" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="515.5" cy="63.6" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="88.5" cy="229.5" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="149.5" cy="228.4" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="210.5" cy="213.2" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="271.5" cy="207.4" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="332.5" cy="188" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="393.5" cy="192.5" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="454.5" cy="136.8" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="515.5" cy="134.6" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="63" cy="36" r="4" style="fill:var(--c-blog)"/><text x="74" y="40" style="fill:var(--muted)">From weighed biomass</text><circle cx="233" cy="36" r="4" style="fill:var(--c-tools)"/><text x="244" y="40" style="fill:var(--muted)">From the paper equation</text></svg><figcaption>Figure 2. CO₂ held in each harvested tree (above and below ground, carbon fraction 0.471), worked out with the Tree carbon calculator's maths: from the weighed biomass, and from the paper's equation with the pooled root-to-shoot ratio.</figcaption></figure>
<!-- /fig:co2 -->

| Check | Paper | Our tool result |
|---|---|---|
| Exponent b | 0.7846 | 0.795 (95 % interval 0.60 to 0.99) |
| Coefficient a | 0.1609 | 0.147, or 0.155 with Duan's smearing |
| R² | 0.8409 | 0.942 on log scale, 0.72 in kg |
| 9-year tree, above ground | 860.42 kg weighed | 465 kg from the equation; 95 % limits 168 to 1,330 |
| Carbon fraction | 47.135 % | used as given; 3.664 kg CO₂ per kg C |

## How we made the graphs

The charts and numbers come from `scripts/blog-figures/silver-oak-grevillea-biomass-allometry-thailand.mjs` in fibub's public code. It calls `fitAllometry` and `predictY` from `src/lib/sci/allomfit.ts`, the maths behind the [[allometry-calculator]], and `agb`, `stock` and `forest` from `src/lib/sci/treecarbon.ts`, the maths behind the [[tree-carbon]] calculator. Duan's smearing factor is worked out in the script itself (the calculator reports the similar log-normal factor, 1.072 here).

The heights, diameters and weighed biomass of the eight trees, the AGB equation and the carbon fraction come from the paper. The root-to-shoot ratio of 0.20 is ours, worked out from the paper's weighed roots; the paper fits a separate root equation instead.

## How we test the maths

On every change to fibub, `tests/sci.mjs` runs these checks:

- `tests/sci-tools/allometry-calculator.mjs`: on 14 made-up species, the log-scale fit must give b = 0.74149 with standard error 0.017376, as SciPy's `linregress` does, with matching limits and t tests.
- New with this article, `tests/sci-tools/tree-carbon.mjs`: the Chave et al. (2014) tropical equation must give 723.137 kg for a tree of DBH 30 cm, height 25 m and wood density 0.6 g/cm³; the silver oak equation must give 464.509 kg above ground, 262.736 kg of carbon and 962.690 kg of CO₂ for the 9-year tree with a root ratio of 0.2; all checked against plain arithmetic done separately.
- In `tests/sci.mjs` itself, the tree carbon totals for eight made-up trees must match an independent NumPy sum, for example 9,004.73 kg of CO₂ with a DBH-only equation.

## Check it yourself

**Refit the equation, on the [[allometry-calculator]]:**

1. In the box for *Body mass M and the trait Y*, paste the eight trees as D²H, biomass: **243.4, 17.49**; **384.5, 13.94**; **3172, 75.05**; **4459.1, 93.11**; **9360.6, 137.29**; **8158.5, 198.22**; **24990, 444.77**; **25730.6, 860.42** (one pair per line).
2. Type **1** in *Test b against* and **25730.6** in *Predict Y at mass*.
3. It reads **Y = 0.147 × M^0.795**, with *R² (log scale)* **0.942** and *Bias correction factor* about **1.07**.
4. The *b against 1* line says 1 is outside the 95 % limits, and the prediction for the 9-year tree is about **473 kg**, with limits for one new tree of about **168 to 1,330**.

**Turn it into CO₂, on the [[tree-carbon]] calculator:**

1. Set *Equation* to **Biomass = a × (ρ × DBH² × H)^b**, type **0.1609** in *a*, **0.7846** in *b* and **1** in *Wood density ρ* (the paper's equation has no density term).
2. Type **0.2** in *Root-to-shoot ratio* and **0.47135** in *Carbon fraction of dry biomass*.
3. Replace the tree list with one row: **SO09, 36.8, 19**.
4. It reads about **963 kg CO₂e stored in 1 tree**, with *Carbon* **263 kg** and *Dry biomass* **557 kg** (465 kg above ground).

## What researchers can use it for

- **Build or refit a species equation** from your own harvested trees with the [[allometry-calculator]], with honest prediction limits for single trees.
- **Check a published equation** against the paper's own tree table, as here, before using it for carbon accounting.
- **Estimate plot carbon** from a DBH and height tally with the [[tree-carbon]] calculator, and yearly uptake from two measurements.
- **Compare equations**: run the same trees through a general tropical equation and a species one, and see how much the carbon estimate moves.
- **Teach** why log-scale fits need a bias correction, and why eight trees are not enough to pin down an exponent.

## The fine print

- The equations come from eight trees on one site; the authors say so and call them preliminary.
- Our refit differs slightly from the paper's, probably because of an unreported smearing factor and one D²H value; we cannot tell which from the paper alone.
- The single root-to-shoot ratio of 0.20 is a simplification: in the weighed trees it ranged from about 0.12 to 0.42.
- CO₂ per tree is not CO₂ per hectare: multiplying by 1,000 trees per hectare would assume every tree is the size of the one harvested, which plantations rarely are.

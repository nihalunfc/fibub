---
title: "Alligator weed in Assam: an importance value index rechecked"
summary: "A 2025 survey of three wetland sites near Guwahati puts alligator weed first everywhere. We rebuild the quadrat sheet, recompute the importance value out of 300 and find the lead survives, but the runners-up change."
tools: [quadrat-transect-analyser, biodiversity-indices, community-ordination]
updated: 2026-11-24
sources:
  - "Sharma, N. and Das, G. (2025), An approach to ecological balance and indigenous knowledge of Alternanthera philoxeroides (Mart.) Griseb in Panikhaiti village of Kamrup (Metropolitan) district of Assam, Frontiers in Conservation Science 6: 1615630, doi:10.3389/fcosc.2025.1615630. Licence CC BY 4.0 (Creative Commons Attribution), checked on the Frontiers article page, 2026-11-24. Values used here: 45 quadrats of 1.5 m x 1.5 m, 15 per site at three sites, 4 to 8 m apart, surveyed April 2022 to December 2023; the per-species percentages labelled relative density, relative frequency and relative dominance, and the importance values 125.5 (site 1), 91.8 (site 2) and 107.7 (site 3) for Alternanthera philoxeroides; Simpson's diversity 0.79, 0.85 and 0.85, Margalef richness 3.45, 3.08 and 1.78 and Pielou's evenness 0.21, 0.75 and 0.63."
  - "Methods: J. T. Curtis and R. P. McIntosh (1951), Ecology 32: 476-496, for the importance value; D. R. Margalef (1958) for species richness; E. C. Pielou (1966), Journal of Theoretical Biology 13: 131-144, for evenness; C. J. Krebs, Ecological Methodology (1999), for the standard definitions of density, frequency and cover."
paper:
  title: "An approach to ecological balance and indigenous knowledge of Alternanthera philoxeroides (Mart.) Griseb in Panikhaiti village of Kamrup (Metropolitan) district of Assam"
  authors: "Sharma N, Das G"
  journal: "Frontiers in Conservation Science"
  year: 2025
  doi: "10.3389/fcosc.2025.1615630"
  url: "https://www.frontiersin.org/journals/conservation-science/articles/10.3389/fcosc.2025.1615630/full"
  licence: "CC BY 4.0"
  reviewed: true
---

Alligator weed (*Alternanthera philoxeroides*) is one of the world's most troublesome wetland invaders: it roots in mud, floats in mats and regrows from fragments. A 2025 paper in *Frontiers in Conservation Science* surveyed three sites in a village on the Brahmaputra floodplain in Assam, India, and reported that alligator weed had the highest **importance value index** at all three. The importance value index, or IVI, is the oldest and most used single number in plant ecology: it adds up how many plants a species has, how widely it is spread and how much ground it covers, and it should run from 0 to 300. This article rebuilds the survey with the [[quadrat-transect-analyser]], which is the tool that turns quadrat counts into exactly those numbers, and then checks the paper's diversity figures. For the steps after that, the [[biodiversity-indices]] tool gives Shannon, Simpson and evenness from the same counts, and [[community-ordination]] places the sites side by side.

## The paper in brief

The authors laid **45 quadrats of 1.5 m by 1.5 m**, 15 at each of three sites in Panikhaiti village, Kamrup (Metropolitan) district, between April 2022 and December 2023. Quadrats were spaced 4 to 8 m apart. Site 1 is the wettest, with floating and marsh plants; site 2 is drier ground with grasses and sedges; site 3 holds tall weeds such as *Parthenium hysterophorus*. Alongside the survey the authors recorded how villagers use the weed, mainly as green fodder.

For each species they printed four numbers: percentages labelled **relative density**, **relative frequency** and **relative dominance**, and an **importance value index**. Alligator weed came first at every site, with an importance value of 125.5 at site 1, 91.8 at site 2 and 107.7 at site 3. A fifth table gives Simpson's diversity (0.79, 0.85, 0.85), Margalef's richness (3.45, 3.08, 1.78) and Pielou's evenness (0.21, 0.75, 0.63).

The ecological claim is clear and worth checking: one species leads three quite different patches of vegetation. The arithmetic behind it is where a tool helps.

## Checked with the tools

**Step 1: the importance values add up.** For all 30 species rows at the three sites, the printed importance value is exactly the sum of the three printed percentages: the largest difference we find is **0.000**. So the paper's own additions are sound.

**Step 2: but the three columns are not relative values.** A relative value is a share, so each column must add to 100 % across the species at a site, and the importance values must add to 300. They do not. At site 1 the columns add to **210.9 %, 433.2 % and 373.6 %**, and the 11 importance values add to **1017.7** rather than 300. Site 2 gives 323.7, 271.7 and 75.5 (total 670.9) and site 3 gives 172.8, 276.1 and 312.2 (total 761.1). The numbers behave like plain per-species percentages: percentage cover, and the percentage of quadrats a species was found in. They are not on the 0 to 300 scale, so they cannot be compared with importance values from any other study.

**Step 3: rebuild the sheet and let the tool do the normalising.** Reading the three columns as plain percentages, we rebuilt a quadrat sheet for each site (**our assumption**, described under "How we made the graphs"): 15 quadrats of 2.25 m², a species present in a number of quadrats matching its published frequency percentage, counts in proportion to its published density percentage and its published dominance as percentage cover where it occurs. The Quadrat transect analyser then works out density per square metre, frequency, mean cover, the three relative values and the importance value out of 300.

Alligator weed comes first at every site, as the paper says, with **39.3 of 300** at site 1, **44.7** at site 2 and **44.8** at site 3. The order below it moves. At site 2 the published table puts *Rottboellia exaltata* second (83.7) and *Alternanthera sessilis* third; after proper normalisation *Rottboellia* falls to **sixth** (33.6) and *Cynodon dactylon* rises to third. The reason is simple: dominance was the smallest column at site 2 (adding to only 75.5 %), so dividing by that small total magnifies the cover differences that the published sum had buried.

<!-- fig:ivi -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 308" role="img" aria-label="For every species at the three sites, the importance value printed in the paper against the one the Quadrat transect analyser gives out of 300 for the rebuilt quadrat sheet. The clouds are wide, so the two orders are not the same." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Published importance value against a proper one</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Published importance value against a proper one</text><line x1="58" x2="546" y1="262" y2="262" style="stroke:var(--line)"/><text x="52" y="266" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="219.6" y2="219.6" style="stroke:var(--line)"/><text x="52" y="223.6" text-anchor="end" style="fill:var(--muted)">10</text><line x1="58" x2="546" y1="177.2" y2="177.2" style="stroke:var(--line)"/><text x="52" y="181.2" text-anchor="end" style="fill:var(--muted)">20</text><line x1="58" x2="546" y1="134.8" y2="134.8" style="stroke:var(--line)"/><text x="52" y="138.8" text-anchor="end" style="fill:var(--muted)">30</text><line x1="58" x2="546" y1="92.4" y2="92.4" style="stroke:var(--line)"/><text x="52" y="96.4" text-anchor="end" style="fill:var(--muted)">40</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">50</text><line x1="58" x2="58" y1="262" y2="266" style="stroke:var(--muted)"/><text x="58" y="279" text-anchor="middle" style="fill:var(--muted)">20</text><line x1="146.7" x2="146.7" y1="262" y2="266" style="stroke:var(--muted)"/><text x="146.7" y="279" text-anchor="middle" style="fill:var(--muted)">40</text><line x1="235.5" x2="235.5" y1="262" y2="266" style="stroke:var(--muted)"/><text x="235.5" y="279" text-anchor="middle" style="fill:var(--muted)">60</text><line x1="324.2" x2="324.2" y1="262" y2="266" style="stroke:var(--muted)"/><text x="324.2" y="279" text-anchor="middle" style="fill:var(--muted)">80</text><line x1="412.9" x2="412.9" y1="262" y2="266" style="stroke:var(--muted)"/><text x="412.9" y="279" text-anchor="middle" style="fill:var(--muted)">100</text><line x1="501.6" x2="501.6" y1="262" y2="266" style="stroke:var(--muted)"/><text x="501.6" y="279" text-anchor="middle" style="fill:var(--muted)">120</text><line x1="58" x2="546" y1="262" y2="262" style="stroke:var(--muted)"/><text x="302" y="300" text-anchor="middle" style="fill:var(--ink)">Importance value as published</text><text transform="translate(14 156) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Importance value out of 300 (tool)</text><circle cx="526" cy="95.4" r="3.4" style="fill:var(--c-blog);opacity:1"/><circle cx="441.3" cy="122.5" r="3.4" style="fill:var(--c-blog);opacity:1"/><circle cx="427.1" cy="131" r="3.4" style="fill:var(--c-blog);opacity:1"/><circle cx="418.2" cy="138.2" r="3.4" style="fill:var(--c-blog);opacity:1"/><circle cx="387.6" cy="139.5" r="3.4" style="fill:var(--c-blog);opacity:1"/><circle cx="389.4" cy="142" r="3.4" style="fill:var(--c-blog);opacity:1"/><circle cx="362.8" cy="147.9" r="3.4" style="fill:var(--c-blog);opacity:1"/><circle cx="389" cy="152.2" r="3.4" style="fill:var(--c-blog);opacity:1"/><circle cx="326" cy="165.3" r="3.4" style="fill:var(--c-blog);opacity:1"/><circle cx="299.8" cy="184.8" r="3.4" style="fill:var(--c-blog);opacity:1"/><circle cx="209.6" cy="190.3" r="3.4" style="fill:var(--c-blog);opacity:1"/><circle cx="376.5" cy="72.5" r="3.4" style="fill:var(--c-tools);opacity:1"/><circle cx="327.7" cy="96.6" r="3.4" style="fill:var(--c-tools);opacity:1"/><circle cx="326.4" cy="98.3" r="3.4" style="fill:var(--c-tools);opacity:1"/><circle cx="306.9" cy="110.2" r="3.4" style="fill:var(--c-tools);opacity:1"/><circle cx="322" cy="118.3" r="3.4" style="fill:var(--c-tools);opacity:1"/><circle cx="340.6" cy="119.5" r="3.4" style="fill:var(--c-tools);opacity:1"/><circle cx="316.2" cy="120.4" r="3.4" style="fill:var(--c-tools);opacity:1"/><circle cx="299.8" cy="122.9" r="3.4" style="fill:var(--c-tools);opacity:1"/><circle cx="83.7" cy="227.2" r="3.4" style="fill:var(--c-tools);opacity:1"/><circle cx="447.1" cy="72" r="3.4" style="fill:var(--ink);opacity:1"/><circle cx="357.9" cy="114.4" r="3.4" style="fill:var(--ink);opacity:1"/><circle cx="347.3" cy="122.9" r="3.4" style="fill:var(--ink);opacity:1"/><circle cx="289.6" cy="128.4" r="3.4" style="fill:var(--ink);opacity:1"/><circle cx="295.8" cy="128.9" r="3.4" style="fill:var(--ink);opacity:1"/><circle cx="284.3" cy="133.5" r="3.4" style="fill:var(--ink);opacity:1"/><circle cx="341.9" cy="141.6" r="3.4" style="fill:var(--ink);opacity:1"/><circle cx="335.3" cy="145.4" r="3.4" style="fill:var(--ink);opacity:1"/><circle cx="201.7" cy="176.4" r="3.4" style="fill:var(--ink);opacity:1"/><circle cx="168.5" cy="184.4" r="3.4" style="fill:var(--ink);opacity:1"/><circle cx="63" cy="36" r="4" style="fill:var(--c-blog)"/><text x="74" y="40" style="fill:var(--muted)">Site 1</text><circle cx="132.2" cy="36" r="4" style="fill:var(--c-tools)"/><text x="143.2" y="40" style="fill:var(--muted)">Site 2</text><circle cx="201.4" cy="36" r="4" style="fill:var(--ink)"/><text x="212.4" y="40" style="fill:var(--muted)">Site 3</text><text class="fibub-mark" x="546" y="300" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. For every species at the three sites: the importance value printed in the paper (horizontal) against the importance value out of 300 that the Quadrat transect analyser gives for our rebuilt quadrat sheet (vertical). A species high in one is not always high in the other.</figcaption></figure>
<!-- /fig:ivi -->

**Step 4: how big is the lead, really?** If every species at a site mattered equally, each would score 300 divided by the number of species: 27.3 at site 1, 33.3 at site 2 and 30.0 at site 3. Alligator weed reaches **1.44, 1.34 and 1.49 times** that even share. That is a real lead and worth reporting, but it is a long way from the 50 to 70 % of 300 that a mat-forming monoculture would score. The vegetation at all three sites is close to even: the tool's rebuilt counts give Pielou's evenness of 0.98 to 1.00.

<!-- fig:even -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 308" role="img" aria-label="Each species importance value divided by an even share of 300 among the species at its site. Alligator weed reaches only about 1.3 to 1.5 times an even share, so its lead is real but small." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Importance value as a multiple of an even share</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Importance value as a multiple of an even share</text><line x1="58" x2="546" y1="262" y2="262" style="stroke:var(--line)"/><text x="52" y="266" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="199.6" y2="199.6" style="stroke:var(--line)"/><text x="52" y="203.6" text-anchor="end" style="fill:var(--muted)">0.5</text><line x1="58" x2="546" y1="137.3" y2="137.3" style="stroke:var(--line)"/><text x="52" y="141.3" text-anchor="end" style="fill:var(--muted)">1</text><line x1="58" x2="546" y1="74.9" y2="74.9" style="stroke:var(--line)"/><text x="52" y="78.9" text-anchor="end" style="fill:var(--muted)">1.5</text><line x1="58" x2="58" y1="262" y2="266" style="stroke:var(--muted)"/><text x="58" y="279" text-anchor="middle" style="fill:var(--muted)">1</text><line x1="106.8" x2="106.8" y1="262" y2="266" style="stroke:var(--muted)"/><text x="106.8" y="279" text-anchor="middle" style="fill:var(--muted)">2</text><line x1="155.6" x2="155.6" y1="262" y2="266" style="stroke:var(--muted)"/><text x="155.6" y="279" text-anchor="middle" style="fill:var(--muted)">3</text><line x1="204.4" x2="204.4" y1="262" y2="266" style="stroke:var(--muted)"/><text x="204.4" y="279" text-anchor="middle" style="fill:var(--muted)">4</text><line x1="253.2" x2="253.2" y1="262" y2="266" style="stroke:var(--muted)"/><text x="253.2" y="279" text-anchor="middle" style="fill:var(--muted)">5</text><line x1="302" x2="302" y1="262" y2="266" style="stroke:var(--muted)"/><text x="302" y="279" text-anchor="middle" style="fill:var(--muted)">6</text><line x1="350.8" x2="350.8" y1="262" y2="266" style="stroke:var(--muted)"/><text x="350.8" y="279" text-anchor="middle" style="fill:var(--muted)">7</text><line x1="399.6" x2="399.6" y1="262" y2="266" style="stroke:var(--muted)"/><text x="399.6" y="279" text-anchor="middle" style="fill:var(--muted)">8</text><line x1="448.4" x2="448.4" y1="262" y2="266" style="stroke:var(--muted)"/><text x="448.4" y="279" text-anchor="middle" style="fill:var(--muted)">9</text><line x1="497.2" x2="497.2" y1="262" y2="266" style="stroke:var(--muted)"/><text x="497.2" y="279" text-anchor="middle" style="fill:var(--muted)">10</text><line x1="546" x2="546" y1="262" y2="266" style="stroke:var(--muted)"/><text x="546" y="279" text-anchor="middle" style="fill:var(--muted)">11</text><line x1="58" x2="546" y1="262" y2="262" style="stroke:var(--muted)"/><text x="302" y="300" text-anchor="middle" style="fill:var(--ink)">Rank at the site (1 = highest)</text><text transform="translate(14 156) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Importance value ÷ even share</text><line x1="58" x2="546" y1="137.3" y2="137.3" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="132.3" text-anchor="end" style="fill:var(--muted)">an even share</text><path d="M58 82.5L106.8 111.4L155.6 120.8L204.4 128.6L253.2 129.9L302 132.7L350.8 139.2L399.6 143.8L448.4 157.9L497.2 178.8L546 184.8" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 94.8L106.8 116.2L155.6 117.6L204.4 127.9L253.2 135.3L302 136.3L350.8 136.9L399.6 139.3L448.4 231.3" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><path d="M58 75.9L106.8 117.5L155.6 125.6L204.4 131.1L253.2 131.7L302 135.9L350.8 143.9L399.6 147.6L448.4 177.8L497.2 186.1" style="fill:none;stroke:var(--ink);stroke-width:2;stroke-linejoin:round"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Site 1</text><line x1="127.2" x2="139.2" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="143.2" y="40" style="fill:var(--muted)">Site 2</text><line x1="196.4" x2="208.4" y1="36" y2="36" style="stroke:var(--ink);stroke-width:2"/><text x="212.4" y="40" style="fill:var(--muted)">Site 3</text><text class="fibub-mark" x="546" y="300" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. The same importance values divided by an even share of 300 (300 ÷ number of species at the site). Alligator weed, at rank 1 everywhere, reaches 1.3 to 1.5 times an even share: a clear lead, but far from a monoculture.</figcaption></figure>
<!-- /fig:even -->

**Step 5: the diversity table does not fit the survey.** Two of its three columns cannot be right.

- **Evenness.** Site 1 is reported at Pielou's evenness **0.21** with Simpson's diversity **0.79**. Evenness of 0.21 with 11 species means one species holds almost everything (Shannon's H would be only 0.21 × ln 11 = 0.50), which would push Simpson's diversity down near 0.2, not up to 0.79. The two numbers in the same row contradict each other. The paper's own density percentages are nearly even, and the [[biodiversity-indices]] maths on our rebuilt counts gives H 2.39, Simpson's diversity **0.908** and evenness **0.997** at site 1: close to the reported Simpson value, nowhere near the reported evenness.
- **Richness.** Margalef's richness is (S − 1) ÷ ln N, with S species and N plants counted. Site 1 has 11 species, so the reported 3.45 needs **N ≈ 18 plants in 15 quadrats**. But the published frequencies say alligator weed alone was found in about 8 of the 15 quadrats and every other species in 3 to 8, so at least **66 plants** were seen, which caps Margalef at **2.39**. Site 2 is capped at 2.15 against a reported 3.08. Only site 3 (reported 1.78, cap 2.42) is possible.

| Check | Paper | Tool |
|---|---|---|
| Importance value = the three columns added | 30 of 30 rows | agrees exactly (largest gap 0.000) |
| Column sums per site (should be 100 % each) | 210.9, 433.2, 373.6 % at site 1 | normalised to 100 % each |
| Importance values add to 300 | 1017.7, 670.9, 761.1 | 300.0 at every site |
| Top species, site 1 | *A. philoxeroides*, 125.5 | *A. philoxeroides*, **39.3** of 300 |
| Second, site 2 | *Rottboellia exaltata*, 83.7 | *Alternanthera sessilis*, 39.0 (*Rottboellia* sixth, 33.6) |
| Pielou's evenness, site 1 | 0.21 | 0.997 on the rebuilt counts |
| Margalef richness, site 1 | 3.45 | at most 2.39 for 11 species and 66+ plants |

None of this touches the paper's main point. Alligator weed does lead all three sites, and it leads them in our recomputation too. What changes is the scale the lead is reported on, the species just behind it, and two numbers in the diversity table.

## How we made the graphs

Every number and both charts come from `scripts/blog-figures/alternanthera-philoxeroides-assam-importance-value-index-recomputed.mjs` in fibub's public code. It calls:

- `quadrats()` from `src/lib/sci/quadrat.ts`, the maths behind the [[quadrat-transect-analyser]]: density = individuals ÷ (quadrats × quadrat area), frequency = quadrats with the species ÷ quadrats, cover = total cover ÷ quadrats, each relative value = 100 × the species value ÷ the total over species, and the importance value = their sum.
- `diversity()` from `src/lib/sci/diversity.ts`, the maths behind the [[biodiversity-indices]] tool, for Shannon's H, Simpson's diversity, Pielou's evenness and Margalef's richness.

From the paper's text we took the quadrat size (1.5 m × 1.5 m), 15 quadrats per site, and the three percentage columns for all 30 species rows. Everything else is **our assumption**, chosen to be the plainest reading of those percentages:

- a species was present in round(frequency % × 15) quadrats, at least one;
- its total number of plants is twice its published density percentage, which only sets the scale and never changes a relative value or an importance value;
- its published dominance is its percentage cover in the quadrats where it occurs;
- plants are spread as evenly as whole numbers allow across its quadrats.

The rebuilt sheets are **not the paper's data**, which is only published as the percentage tables. They are the simplest sheet that reproduces those percentages, which is what makes the recomputation meaningful: any sheet with the same proportions gives the same relative values.

## How we test the maths

On every change to fibub, `tests/sci.mjs` runs `tests/sci-tools/quadrat-transect-analyser.mjs`, which pins the quadrat maths against an independent pandas calculation of the same made-up 8-quadrat sheet:

- white clover must come out at density 32 plants/m², frequency 0.625 and mean cover 21.25 %, with relative values 52.0325, 25 and 52.3077 and an importance value of 129.3402 out of 300;
- dandelion must score 25.3290 out of 300, and the site totals must be 61.5 plants/m² and 40.625 % cover;
- declaring 12 quadrats instead of the 8 listed must lower density and frequency but leave relative frequency at 25 %, the check that catches the commonest quadrat mistake of all;
- with counts and no cover, the importance value must be out of 200, not 300.

New with this article: the four-species sheet in the next section must give alligator weed an importance value of **103.8 out of 300**, with relative density 27.1, relative frequency 29.4 and relative cover 47.3, and *Phyla nodiflora* 43.6.

## Check it yourself

On the [[quadrat-transect-analyser]], with **Quadrats** selected:

1. Set *Quadrat area (m²)* to **2.25** (a 1.5 m by 1.5 m frame) and *Number of quadrats* to **15**, because most quadrats hold none of these four species.
2. Clear the data box and paste these 17 rows (quadrat, species, number of plants, percentage cover), which are four species of the paper's site 3 as we rebuilt them:

```
Q1	Alternanthera philoxeroides	8	54.5
Q2	Alternanthera philoxeroides	8	54.5
Q3	Alternanthera philoxeroides	8	54.5
Q4	Alternanthera philoxeroides	8	54.5
Q5	Alternanthera philoxeroides	7	54.5
Q1	Parthenium hysterophorus	10	44.9
Q2	Parthenium hysterophorus	10	44.9
Q3	Parthenium hysterophorus	9	44.9
Q4	Parthenium hysterophorus	9	44.9
Q1	Cyperus rotundus	8	19.8
Q2	Cyperus rotundus	7	19.8
Q3	Cyperus rotundus	7	19.8
Q4	Cyperus rotundus	7	19.8
Q5	Cyperus rotundus	7	19.8
Q1	Phyla nodiflora	11	8.5
Q2	Phyla nodiflora	10	8.5
Q3	Phyla nodiflora	10	8.5
```

3. Under *Per species*, alligator weed should read density **1.16** plants/m², frequency **33.3 %** and mean cover **18.17 %**, with relative density **27.1**, relative frequency **29.4** and relative cover **47.3**.
4. The *Importance value* chart should put alligator weed first on **103.8** of 300, then *Parthenium hysterophorus* 81.1, *Cyperus rotundus* 71.6 and *Phyla nodiflora* 43.6. The four add to 300.0, which is the check that the values really are relative.
5. Now change *Number of quadrats* to **5**. Density and frequency treble, every relative value and every importance value stays the same, and the totals change from 4.27 to 12.80 plants/m². That is the difference between an absolute number and a share, and it is why a published importance value is only readable if its scale is stated.
6. Press **Download results (CSV)** to keep the table.

## What researchers can use it for

- **Report importance values on the standard scale.** Paste your quadrat sheet into the [[quadrat-transect-analyser]] and the three relative columns add to 100 % each by construction, so your numbers can be compared with any other study.
- **Recheck a published table in two minutes.** Add up each relative column over the species at a site: every column should come to 100 %, and the importance values to 300 in total. If they do not, the table is on its own private scale and cannot be compared with anyone else's.
- **See how fragile a ranking is.** Rebuild a published table at several plausible scalings and watch which species keep their rank. In this paper the top species holds; the second does not.
- **Keep diversity indices honest.** Feed the same counts to [[biodiversity-indices]]: evenness, Simpson and Shannon are all functions of one set of proportions, so they must agree with each other, and Margalef needs the number of plants counted to be stated.
- **Compare sites, not just species.** With three or more sites, [[community-ordination]] turns the species-by-site table into a Bray-Curtis ordination and a dendrogram, which says whether the wet, dry and weedy sites really hold different communities.

## The fine print

- Our quadrat sheets are **rebuilt**, not the paper's data. The paper publishes only the percentage tables, so the counts, the spread across quadrats and the scale factor are our assumptions.
- Reading the published "relative dominance" as cover where the species occurs is one reading. If it is instead mean cover over all 15 quadrats, the relative cover column changes a little, though alligator weed still leads at all three sites.
- We did not recheck the paper's botany, its site descriptions or its interview material; only the arithmetic of the tables.
- The paper's text names 10 species at site 2 while its table lists 9; we used the 9 in the table.
- Simpson's diversity is reported in the paper as 0.79 to 0.85 and is roughly what near-even communities of this size should give, so that column is the one that survives the check.

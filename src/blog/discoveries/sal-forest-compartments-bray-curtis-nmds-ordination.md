---
title: "Sal forest compartments ordinated: what Bray-Curtis adds to a similarity table"
summary: "A 2025 survey of seven Sal forest compartments in Himachal Pradesh reports presence-absence similarity. We rerun it as an abundance-weighted ordination with fibub's community ordination tool."
tools: [community-ordination, biodiversity-indices, quadrat-transect-analyser, forest-inventory-summary]
updated: 2026-11-24
sources:
  - "Sharma, A., Bhardwaj, D. R., Thakur, C. L., Katoch, N. and Sharma, J. P. (2025), Floristic diversity and dominance patterns of Sal (Shorea robusta Gaertn. f.) forests in North Western Himalayas: implications for conservation and sustainable management, Frontiers in Forests and Global Change 8: 1524808, doi:10.3389/ffgc.2025.1524808. Licence CC BY 4.0 (checked in the Crossref record for the DOI and on the Frontiers article page, 2026-11-24). Values used here: seven compartments of the Paonta forest range, Himachal Pradesh, India, each with a 0.1 ha tree plot; the tree-layer importance value index per species per compartment; Shorea robusta importance value 126.72 to 156.59; tree Shannon-Wiener 1.44 to 1.83 and Pielou evenness 0.75 to 0.88; tree similarity between compartments 0.67 to 1.00."
  - "Bray, J. R. and Curtis, J. T. (1957), Ecological Monographs 27: 325-349 (the dissimilarity measure); Legendre, P. and Gallagher, E. D. (2001), Oecologia 129: 271-280 (the Hellinger transform for ordination of species data)."
paper:
  title: "Floristic diversity and dominance patterns of Sal (Shorea robusta Gaertn. f.) forests in North Western Himalayas: implications for conservation and sustainable management"
  authors: "Sharma A, Bhardwaj DR, Thakur CL, Katoch N, Sharma JP"
  journal: "Frontiers in Forests and Global Change"
  year: 2025
  doi: "10.3389/ffgc.2025.1524808"
  url: "https://www.frontiersin.org/journals/forests-and-global-change/articles/10.3389/ffgc.2025.1524808/full"
  licence: "CC BY 4.0"
  reviewed: true
---

Forest surveys usually end with two kinds of table: a diversity index per stand, and a similarity matrix saying how alike the stands are. Both throw away most of what was counted. A 2025 survey of seven Sal (*Shorea robusta*) forest compartments in the North Western Himalayas gives the tree-layer **importance value index** of every species in every compartment, which is enough to redo the comparison properly, with the abundances kept. This article takes those values into the [[community-ordination]] tool and shows what an ordination says that a similarity table cannot. On the way we check the paper's own diversity indices with the [[biodiversity-indices]] tool, and its stand numbers are the sort the [[quadrat-transect-analyser]] and [[forest-inventory-summary]] are built for.

## The paper in brief

The authors surveyed seven compartments of the Paonta forest range in Himachal Pradesh, India, laying a 0.1 hectare plot for trees in each, with nested quadrats for shrubs and herbs. They record 10 tree species, and report for each compartment an **importance value index** (IVI) per species: the sum of its relative density, relative frequency and relative dominance (basal area share), so the ten species in a compartment add up to 300.

Their findings: *S. robusta* dominates every compartment, with an IVI between 126.72 and 156.59, which is 42 to 52 % of the whole tree layer. Tree Shannon-Wiener diversity runs from 1.44 to 1.83 and Pielou evenness from 0.75 to 0.88. Between compartments they report a tree-layer similarity of 0.67 to 1.00, and conclude that regeneration of the associated broadleaf species, not of Sal itself, is what needs management attention.

## Checked with the tools

Everything below is **recomputed from the importance values printed in the paper's own text**. Nothing is simulated. The first thing the tool's reader does is add up each compartment's column: all seven sum to 300.00, give or take 0.01, so the table is internally consistent and nothing is missing. That matters for the maths: because every compartment has the same total, Bray-Curtis dissimilarity on these values is exactly half the summed absolute difference divided by 300, and no transform is needed to stop a big site dominating.

**Step 1: which index did the paper use?** The paper's similarity matrix only takes the values 1.00, 0.77, 0.67 and 0.75. Feeding the species lists to the tool's `compare` maths gives a Jaccard similarity of 1.00, 0.63, 0.78 or 0.50, and the Sørensen coefficient (twice the shared species over the sum of the two richnesses) of **1.00, 0.769, 0.875 and 0.667**. So the paper's table is Sørensen on presence and absence: three of its four distinct values come out exactly, including the lowest, 0.67, which is any of the six-species compartments against the nine-species Lai C28. The value 0.75 cannot arise from these species lists at all, and the printed matrix is misaligned in the HTML, so we treat that one as a typesetting problem rather than a result.

| Check | Paper | Our tool result |
|---|---|---|
| Similarity index used | "similarity", 0.67 to 1.00 | Sørensen on presence/absence: 1.00, 0.769, 0.875, 0.667 |
| Lowest tree similarity | 0.67 | 0.667 (six-species compartments against Lai C28) |
| Shannon-Wiener, tree layer | 1.44 to 1.83 | 1.46 to 1.81 from the IVI shares |
| Most diverse compartment | Lai C28, 1.83 | Lai C28, 1.81 |
| Pielou evenness | 0.75 to 0.88 | 0.78 to 0.87 |
| Shorea robusta share | IVI 126.72 to 156.59 | 42.2 % to 52.2 % of the tree layer |

**Step 2: the trouble with presence and absence.** Four of the seven compartments (Rajban C6, Rajban C7, Kukron C14 and Gorakhpur C7) hold the same six tree species, so the paper's index calls every pair among them identical: 1.00. The tool's Bray-Curtis dissimilarity, which uses the importance values themselves, separates them: **0.029** between Rajban C6 and Kukron C14, but **0.119** between Rajban C6 and Gorakhpur C7, four times as far, because Gorakhpur C7 has much more *Syzygium cuminii* (an IVI of 51.88 against about 28) and the lowest Sal share of all. A table of 1.00s hides a real gradient.

**Step 3: the ordination.** A principal component analysis of the Hellinger-transformed values puts **73.4 % of the variation on the first axis and 20.7 % on the second**, so Figure 1's flat picture holds 94 % of what there is to see. The axes are easy to read from the species loadings the tool prints: axis 1 runs from the compartments that still carry *Cassia fistula* (loading +0.52) to those that carry *Callicarpa japonica* and *Ficus palmata* instead (−0.48 and −0.50); axis 2 is almost entirely *Eucalyptus* (+0.63) and *Acacia catechu* (+0.53), the two species found only in Lai C28.

<!-- fig:pca -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 330" role="img" aria-label="Principal component analysis of Hellinger-transformed tree importance values for seven Sal forest compartments. PC1 explains 73.4 per cent and PC2 20.7 per cent." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Sal compartments: PCA of the tree layer</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Sal compartments: PCA of the tree layer</text><line x1="58" x2="546" y1="268.9" y2="268.9" style="stroke:var(--line)"/><text x="52" y="272.9" text-anchor="end" style="fill:var(--muted)">-0.20</text><line x1="58" x2="546" y1="216.8" y2="216.8" style="stroke:var(--line)"/><text x="52" y="220.8" text-anchor="end" style="fill:var(--muted)">-0.10</text><line x1="58" x2="546" y1="164.6" y2="164.6" style="stroke:var(--line)"/><text x="52" y="168.6" text-anchor="end" style="fill:var(--muted)">0.00</text><line x1="58" x2="546" y1="112.5" y2="112.5" style="stroke:var(--line)"/><text x="52" y="116.5" text-anchor="end" style="fill:var(--muted)">0.10</text><line x1="58" x2="546" y1="60.3" y2="60.3" style="stroke:var(--line)"/><text x="52" y="64.3" text-anchor="end" style="fill:var(--muted)">0.20</text><line x1="100.5" x2="100.5" y1="284" y2="288" style="stroke:var(--muted)"/><text x="100.5" y="301" text-anchor="middle" style="fill:var(--muted)">-0.40</text><line x1="232.3" x2="232.3" y1="284" y2="288" style="stroke:var(--muted)"/><text x="232.3" y="301" text-anchor="middle" style="fill:var(--muted)">-0.20</text><line x1="364.2" x2="364.2" y1="284" y2="288" style="stroke:var(--muted)"/><text x="364.2" y="301" text-anchor="middle" style="fill:var(--muted)">0.00</text><line x1="496" x2="496" y1="284" y2="288" style="stroke:var(--muted)"/><text x="496" y="301" text-anchor="middle" style="fill:var(--muted)">0.20</text><line x1="58" x2="546" y1="284" y2="284" style="stroke:var(--muted)"/><text x="302" y="322" text-anchor="middle" style="fill:var(--ink)">PC1 (73.4 % of the variation)</text><text transform="translate(14 158) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">PC2 (20.7 %)</text><line x1="58" x2="546" y1="164.6" y2="164.6" style="stroke:var(--muted);stroke-dasharray:4 4"/><line x1="364.2" x2="364.2" y1="32" y2="284" style="stroke:var(--muted);stroke-dasharray:4 4"/><circle cx="472.2" cy="151.9" r="4" style="fill:var(--c-blog);opacity:1"/><text x="463.2" y="155.9" text-anchor="end" style="fill:var(--ink)">Rajban C6</text><circle cx="477.9" cy="152" r="4" style="fill:var(--c-blog);opacity:1"/><text x="468.9" y="170" text-anchor="end" style="fill:var(--ink)">Rajban C7</text><circle cx="481.4" cy="144.8" r="4" style="fill:var(--c-tools);opacity:1"/><text x="472.4" y="135.8" text-anchor="end" style="fill:var(--ink)">Kukron C14</text><circle cx="261.6" cy="237.7" r="4" style="fill:var(--ink);opacity:1"/><text x="268.6" y="241.7" text-anchor="start" style="fill:var(--ink)">Rajban C10</text><circle cx="252.1" cy="250.6" r="4" style="fill:var(--ink);opacity:1"/><text x="259.1" y="267.6" text-anchor="start" style="fill:var(--ink)">Kukron C15</text><circle cx="481.3" cy="150" r="4" style="fill:var(--c-tools);opacity:1"/><text x="472.3" y="182" text-anchor="end" style="fill:var(--ink)">Gorakhpur C7</text><circle cx="122.6" cy="65.3" r="4" style="fill:var(--c-blog);opacity:1"/><text x="129.6" y="69.3" text-anchor="start" style="fill:var(--ink)">Lai C28</text><text class="fibub-mark" x="546" y="322" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. Principal component analysis of the seven compartments, run on the Hellinger-transformed tree importance values with the Community ordination tool’s own maths. Each point is one compartment. Figures worked out by fibub from values in the paper’s text, not the paper’s own plot.</figcaption></figure>
<!-- /fig:pca -->

**Step 4: the groups.** Clustering the Bray-Curtis dissimilarities with average linkage (UPGMA) gives the tree in Figure 2, with a **cophenetic correlation of 0.890** (how faithfully the tree represents the dissimilarities; above about 0.8 is usually called good). Cut into three groups, the tool returns exactly what the ordination shows: {Rajban C6, Rajban C7, Kukron C14, Gorakhpur C7}, {Rajban C10, Kukron C15} and {Lai C28} on its own. The join heights are 0.029, 0.058, 0.073, 0.110, 0.139 and 0.224, so the last compartment is twice as far from the rest as any earlier merge.

<!-- fig:tree -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 300" role="img" aria-label="Dendrogram of the seven Sal compartments from Bray-Curtis dissimilarity with average linkage. Rajban C6, Rajban C7, Kukron C14 and Gorakhpur C7 join at low dissimilarity; Lai C28 joins last." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Compartments clustered on Bray-Curtis dissimilarity (UPGMA)</title><text x="12" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Compartments clustered on Bray-Curtis dissimilarity</text><line x1="112.0" x2="112.0" y1="28" y2="246" style="stroke:var(--line)"/><text x="112.0" y="263" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="201.8" x2="201.8" y1="28" y2="246" style="stroke:var(--line)"/><text x="201.8" y="263" text-anchor="middle" style="fill:var(--muted)">0.05</text><line x1="291.6" x2="291.6" y1="28" y2="246" style="stroke:var(--line)"/><text x="291.6" y="263" text-anchor="middle" style="fill:var(--muted)">0.1</text><line x1="381.3" x2="381.3" y1="28" y2="246" style="stroke:var(--line)"/><text x="381.3" y="263" text-anchor="middle" style="fill:var(--muted)">0.15</text><line x1="471.1" x2="471.1" y1="28" y2="246" style="stroke:var(--line)"/><text x="471.1" y="263" text-anchor="middle" style="fill:var(--muted)">0.2</text><text x="321.0" y="282" text-anchor="middle" style="fill:var(--ink)">Bray-Curtis dissimilarity at which they join</text><path d="M112.0 200.6H163.3V230.9H112.0" style="fill:none;stroke:var(--c-tools);stroke-width:2"/><path d="M112.0 170.3H216.9V215.7H163.3" style="fill:none;stroke:var(--c-tools);stroke-width:2"/><path d="M112.0 79.4H242.6V109.7H112.0" style="fill:none;stroke:var(--c-tools);stroke-width:2"/><path d="M112.0 140.0H309.7V193.0H216.9" style="fill:none;stroke:var(--c-tools);stroke-width:2"/><path d="M242.6 94.6H360.6V166.5H309.7" style="fill:none;stroke:var(--c-tools);stroke-width:2"/><path d="M112.0 49.1H513.9V130.5H360.6" style="fill:none;stroke:var(--c-tools);stroke-width:2"/><text x="106.0" y="53.1" text-anchor="end" style="fill:var(--ink)">Lai C28</text><text x="106.0" y="83.4" text-anchor="end" style="fill:var(--ink)">Rajban C10</text><text x="106.0" y="113.7" text-anchor="end" style="fill:var(--ink)">Kukron C15</text><text x="106.0" y="144.0" text-anchor="end" style="fill:var(--ink)">Gorakhpur C7</text><text x="106.0" y="174.3" text-anchor="end" style="fill:var(--ink)">Rajban C7</text><text x="106.0" y="204.6" text-anchor="end" style="fill:var(--ink)">Rajban C6</text><text x="106.0" y="234.9" text-anchor="end" style="fill:var(--ink)">Kukron C14</text><text class="fibub-mark" x="554" y="294" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. The same seven compartments clustered with average linkage (UPGMA) on Bray-Curtis dissimilarity. The scale shows the dissimilarity at which each pair or group joins; Lai C28 joins last.</figcaption></figure>
<!-- /fig:tree -->

**Step 5: where NMDS fails, and the tool says so.** Running non-metric multidimensional scaling on the same dissimilarities gives a **stress of 0.000** from 12 of 21 starts. That is not a triumph; with only seven points, two dimensions can reproduce any ranking of 21 dissimilarities. The tool prints a warning for exactly this case ("with few sites... NMDS can squash each group to a point: compare with the PCA and the dendrogram before reading much into it"). For a seven-stand survey, the PCA and the dendrogram are the honest pictures.

**Step 6: the diversity indices, and a column-order warning.** Treating each compartment's IVI shares as the abundance vector, the [[biodiversity-indices]] maths gives Shannon values of 1.46, 1.53, 1.47, 1.51, 1.54, 1.56 and 1.81 for the seven compartments in the order the paper's tree table lists them. Five of the seven are within 0.04 of the paper's published values, and the ranking of the most diverse stand (Lai C28, 1.81 against 1.83) agrees. Gorakhpur C7 does not: we get 1.56 where the paper prints 1.44. Margalef richness tells the same story: with seven species in a compartment the formula gives 1.05 and with six it gives 0.88, and the paper prints those two numbers against different compartments than its own species table implies. Whoever reuses this paper's Table 6 should check its column order against its Table 3 first.

## How we made the graphs

Both figures and every number above come from `scripts/blog-figures/sal-forest-compartments-bray-curtis-nmds-ordination.mjs` in fibub's public code. It calls `transform`, `distances`, `pca`, `nmds`, `cluster`, `cophenetic` and `cutTree` from `src/lib/sci/ordination.ts`, the maths behind the [[community-ordination]] tool, and `diversity` and `compare` from `src/lib/sci/diversity.ts`, behind the [[biodiversity-indices]] tool.

The only inputs are the tree-layer importance values in the paper's text, one per species per compartment, with a species absent from a compartment entered as 0. Nothing else is assumed. The Hellinger transform for the PCA, average linkage for the tree and Bray-Curtis for the dissimilarities are **our choices**, and they are the tool's own defaults; the raw-value PCA puts less on axis 1 (50.2 %) and we say so rather than quietly picking the prettier one. Figure 2 is drawn by the script in the same shape the tool's dendrogram uses.

## How we test the maths

On every change to fibub, `tests/sci.mjs` runs `tests/sci-tools/community-ordination.mjs`, which pins this maths against NumPy, SciPy and scikit-learn on a made-up 12-species, 12-quadrat example:

- PCA eigenvalues must equal NumPy's SVD values (375.9129417353 and 297.9276000789) and the Hellinger PCA must put 68.9 % on axis 1.
- Bray-Curtis dissimilarities must equal SciPy's `pdist(..., 'braycurtis')` to 1e-9, and all four linkages must match SciPy's `linkage` heights and cophenetic correlation (0.7913 for UPGMA).
- NMDS stress-1 must match scikit-learn's best of 50 starts, 0.023823, to 2e-5, and the Shepard fit must be monotone.
- New with this article: the seven Sal compartments must give Bray-Curtis 0.028583 between Rajban C6 and Kukron C14, a Hellinger PC1 share of 73.40 %, UPGMA join heights ending at 0.223847 with a cophenetic correlation of 0.889656, and a three-group cut of {C6, C7, C14, Gorakhpur}, {C10, C15}, {Lai}.

## Check it yourself

The paper is CC BY, so its importance-value table is free to download and reuse with credit. On the [[community-ordination]] tool page:

1. Paste the paper's tree importance values into *Community table*, species in the first column and one column per compartment, then set *PCA on* to **Hellinger-transformed values**, *Dissimilarity* to **Bray-Curtis on raw values**, *Clustering* to **UPGMA (average)** and *Groups to colour* to **3**.
2. The PCA card should read **PC1 73.4 %, PC2 20.7 % of the variation**, with *Sites, species* 7, 10.
3. The NMDS card should read **Stress 0.000**, with the warning about few sites.
4. The cluster card should read **3 groups, cophenetic correlation 0.890**, and Lai C28 should sit alone on its own branch.

To check the tool itself in ten seconds, paste this made-up table instead:

```
Species	S1	S2	S3
Oak	10	0	5
Pine	0	10	5
Birch	5	5	5
```

With *Dissimilarity* on **Bray-Curtis on raw values**, S1 against S2 is 0.667, S1 against S3 is 0.333, and the dendrogram joins S1 and S3 first at 0.333.

## What researchers can use it for

- **Get more out of a published survey**: if a paper prints abundances or importance values per site, the ordination can be redone in the browser without asking anyone for data.
- **Choose an index on purpose**: Sørensen, Jaccard and Bray-Curtis answer different questions; the tool shows all of them side by side, so a methods section can say why.
- **Check a similarity matrix** before building on it, as the Sørensen and Margalef checks above did here.
- **Report a cophenetic correlation** with every dendrogram, so readers know how much the tree distorted the distances.
- **Teach ordination** with a real stand table: switch the transform and the linkage and watch the groups hold or fall apart ([[quadrat-transect-analyser]] prepares the per-quadrat counts that feed it).

## The fine print

- Importance values are not counts. They mix density, frequency and dominance, so a Bray-Curtis dissimilarity on IVI measures how differently the species *share the stand*, not how many stems differ. It is well defined here because every compartment totals 300.
- Only the tree layer is used. The paper's shrub table prints identical rows for Kukron C14 and Kukron C15, which cannot both be right, so we left the shrub and herb layers out.
- Seven sites is few. The ordination picture is stable (the PCA holds 94 % on two axes) but no significance test is possible, and the NMDS stress of zero is an artefact of the small number of sites.
- Our diversity values use the IVI shares as abundances. The paper does not say what it used, which is the likeliest reason for the small differences.
- We did not recompute basal area, density or frequency: the paper does not publish the per-species stem counts those would need.

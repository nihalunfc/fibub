---
name: Community ordination
num: 306
shelf: science
code: T221
section: ecology
title: "Community ordination online: PCA, NMDS (Bray-Curtis) and cluster dendrogram for species-by-site data"
summary: "Paste a species-by-site table and get a PCA (with the Hellinger transform), an NMDS on Bray-Curtis with its stress and Shepard plot, and a cluster dendrogram (UPGMA, Ward, single or complete linkage). Download the scores, the dissimilarities and the tree. Runs in your browser."
status: live
ads: true
order: 306
icon: chart
works: offline
updated: 2026-11-09
related: [biodiversity-indices, plot-maker, tree-viewer, sample-size, quadrat-transect-analyser, tree-builder, metabolite-volcano-pca, embedding-visualiser]
sources:
  - "Methods: Legendre and Legendre, Numerical Ecology (3rd ed., 2012) for PCA, the Hellinger transform (Legendre and Gallagher 2001), Bray-Curtis, and the linkage rules; Kruskal (1964) for non-metric scaling and stress-1, fitted by SMACOF (de Leeuw 1977) with monotone regression; Clarke (1993) for the rule-of-thumb stress bands."
  - "Code written by fibub. Checked in the tests against NumPy 2 (PCA by SVD), SciPy 1.18 (Bray-Curtis, linkage heights and merge order for all four methods, cophenetic correlation, cluster cuts) and scikit-learn 1.9 (non-metric MDS: the stress-1 here matches its best of 50 starts to 0.00001)."
  - "The example table is made up (simulated counts along a marsh-to-dune transect)."
flow:
  - { icon: table, label: "Site table" }
  - { icon: chart, label: "PCA, NMDS" }
  - { icon: sigma, label: "Clusters" }
  - { icon: download, label: "Scores" }
---

## What it does

Community data come as a table: species down the side, sites (quadrats, traps, plots, samples) across the top, and a count, cover value or biomass in each cell. With more than a handful of species, it is hard to see which sites are alike just by reading the table. **Ordination** draws the sites as points on a map where similar communities sit close together, and **cluster analysis** joins them into a tree of groups. This tool does the three methods ecologists use most, side by side, from one pasted table:

- **PCA** (principal component analysis), on raw values or after the **Hellinger transform**, with a biplot of the species.
- **NMDS** (non-metric multidimensional scaling) on **Bray-Curtis** or another dissimilarity, with its **stress** and a **Shepard plot**.
- **Hierarchical clustering** by **UPGMA**, **Ward**, **single** or **complete** linkage, drawn as a **dendrogram**, with the cophenetic correlation and a cut into groups that also colours both maps.

Nothing is uploaded: every number is worked out in your browser.

Collect the species table with the [[quadrat-transect-analyser|quadrat and transect analyser]], and work out each site's diversity with the [[biodiversity-indices|biodiversity indices calculator]].

## How to use it

1. Put **species in the first column** and **one column per site**, with the site names in the first row. This is the same layout as the biodiversity index calculator, so the same table works in both. Paste from a spreadsheet, or open a CSV, TSV, TXT or Excel file. Blank cells count as zero.
2. Pick what the **PCA** runs on. Hellinger is the safe default for species data; raw values suit measurements such as soil variables that are already on similar scales.
3. Pick the **dissimilarity** for NMDS and the clusters. Bray-Curtis on raw counts is the usual choice; square roots or proportions reduce the weight of the most abundant species.
4. Pick the **clustering** method and how many **groups** to colour.
5. Read the results, and download the site scores (CSV), the dissimilarity matrix (CSV), the dendrogram (Newick, opens in the tree viewer) or the whole report as an image, PDF or Word file.

## What each option does

- **Hellinger-transformed values**: each value becomes the square root of its share of the site total. A PCA on these (a "transformation-based PCA") gives Hellinger distances between sites, which handle many zeros sensibly.
- **Square roots** and **proportions** tone down abundant species, or remove differences in total abundance between sites.
- **Bray-Curtis** dissimilarity runs from 0 (identical) to 1 (no species shared). **Hellinger distance** is Euclidean distance on Hellinger values. **Euclidean on raw values** is mainly for environmental measurements.
- **UPGMA** joins groups at their average dissimilarity. **Ward** joins the pair that adds least spread inside groups and gives compact groups. **Complete linkage** uses the largest dissimilarity between members, **single linkage** the smallest (it tends to chain).
- **Show species on the PCA plot** adds the 12 most strongly loading species, scaled to fit the site scores.

## Reading the results

- **Explained variation**: how much of the total variance each PCA axis holds. Two axes holding most of it means the plot is a fair picture.
- **Stress** (Kruskal's stress-1) says how well the 2-D NMDS map keeps the order of the dissimilarities. As a rule of thumb, below 0.05 is excellent, below 0.1 good, below 0.2 usable, and above 0.2 poor. The tool runs 21 starts (one from a classical scaling, 20 random) and keeps the best; it tells you how many reached the same stress, a sign that the best layout was found.
- **Cophenetic correlation**: how well the tree's merge heights match the original dissimilarities. Above about 0.75 the tree is a fair summary.

## Worked example

The made-up example is a transect of 12 quadrats from a wet marsh (Q1) through meadow to sand dunes (Q12), with 12 plant species. With the defaults:

- **PCA on Hellinger values**: PC1 holds 68.9 % of the variation and PC2 23.1 %. PC1 is the wet-to-dry gradient: *Carex nigra* and *Juncus effusus* load at one end, *Ammophila arenaria* and *Festuca rubra* at the other, and the quadrats line up in order along it.
- **NMDS on Bray-Curtis**: stress 0.024 (excellent), with 20 of the 21 starts reaching it.
- **UPGMA**: cut into 3 groups, Q1 to Q3 (marsh), Q4 to Q7 (meadow) and Q8 to Q12 (dune). The cophenetic correlation is 0.791, and the top merge is at a Bray-Curtis dissimilarity of 0.762. Switching to Ward gives the same three groups.

## Tips

- Use PCA on Hellinger values or NMDS on Bray-Curtis for species counts; a PCA on raw counts is pulled about by the commonest species and by shared absences.
- If the NMDS stress is nearly zero, your sites may fall into clearly separate groups. NMDS can then squash each group into a point, so check the PCA and the dendrogram.
- Rare species have little effect on Bray-Curtis or Hellinger. There is no need to delete them unless you have a reason.
- Site scores have no units and their signs are arbitrary: a plot flipped left to right means the same thing.

## Frequently asked questions

**Is this the same as vegan's metaMDS in R?** The stress is the same measure (Kruskal's stress-1), and the map is centred and turned so axis 1 holds the most spread, as metaMDS does. metaMDS also applies a square-root and Wisconsin transform automatically for large counts; here you pick the transform yourself.

**Can I add environmental variables?** Not yet. Export the site scores and correlate them with your variables in a spreadsheet or the plot maker.

**How many sites can I use?** Up to 150 sites and 1,000 species. With more than 60 sites the NMDS uses 7 starts instead of 21 so the page stays quick.

**Is my data sent anywhere?** No. The page keeps working offline once it has loaded.

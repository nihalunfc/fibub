---
name: Biodiversity indices
num: 39
shelf: science
section: ecology
title: "Biodiversity index calculator: Shannon, Simpson, Chao1 and rarefaction (free)"
summary: "Paste species counts for one or more sites and get Shannon, Simpson, evenness, Chao1 richness, rarefaction curves and Bray-Curtis similarity in one table. Runs in your browser."
status: live
ads: true
order: 10
icon: chart
works: offline
updated: 2026-11-08
related: [sample-size, plot-maker, sql-playground, uncertainty-calculator]
sources:
  - "Formulas: Magurran, Measuring Biological Diversity (2004); Chao (1987, 2005)."
flow:
  - { icon: table, label: "Paste counts" }
  - { icon: sigma, label: "Indices" }
  - { icon: chart, label: "Rarefy" }
  - { icon: download, label: "Report" }
---

## What it does

Field surveys, pitfall traps, quadrats, plankton tows and sequencing runs all end with the same thing: a table of species and how many individuals of each you found at each site. This calculator turns that table into the diversity numbers ecologists report, side by side for every site: richness, Chao1, Shannon, Simpson, evenness and dominance. It draws rarefaction curves so sites with different sample sizes can be compared fairly, and gives Bray-Curtis and Jaccard values for every pair of sites. Nothing is uploaded.

## How to use it

1. Put **species in the first column** and **one column of counts per site** after it. The first row holds the site names. Copying a block straight from Excel or Google Sheets works; tabs, commas and semicolons are all understood.
2. Use **whole-number counts** of individuals (or of reads). Blank cells count as zero. Rarefaction and Chao1 are built on counts, so percentages or cover values will not give meaningful results.
3. The table and charts update as you type. Download the results as PNG, PDF or Word with the buttons at the bottom.

## What each number means

- **Species (S)** is the number of species seen. **Chao1** estimates how many there really are, using how many species were seen only once (singletons) or twice (doubletons). The bias-corrected form is used, so it still works when there are no doubletons.
- **Shannon H′** uses the natural log. **exp(H′)** turns it into an "effective number of species": the number of equally common species that would give the same H′. It is easier to compare than H′ itself.
- **Simpson 1 − D** is the chance that two individuals picked at random are different species. **1/D** is the matching effective number of species. Both use the plain proportions (pᵢ²).
- **Pielou J′** = H′ / ln S, from 0 (one species dominates) to 1 (all equally common).
- **Berger-Parker** is the share of the most common species.
- **Rarefaction** (Hurlbert 1971, variance by Heck et al. 1975) gives the species you would expect in a smaller sample of m individuals. A dashed line marks the smallest site's total, where all sites can be compared.
- **Bray-Curtis** dissimilarity compares the counts. **Jaccard** similarity compares only which species are present.

## Worked example

The sample data is an invented beetle survey of a meadow and a hedgerow, with ten species. The meadow has 85 beetles of 8 species: Shannon H′ = 1.569, exp(H′) = 4.80, Simpson 1 − D = 0.736, 1/D = 3.79, Pielou J′ = 0.755 and Chao1 = 8.49 (three singletons, one doubleton). The hedgerow has 66 beetles of 8 species, with H′ = 1.601. Because the meadow sample is larger, the fair comparison is at 66 individuals, where the meadow is expected to hold 7.50 ± 0.62 species. The two sites share 6 of their 10 species (Jaccard 0.6), and the Bray-Curtis dissimilarity is 0.550.

## Frequently asked questions

**Which index should I report?** Many journals now prefer the effective numbers (exp(H′) and 1/D) alongside observed and estimated richness, because they are in units of species and behave sensibly when compared. Say which log base you used for Shannon: this tool uses the natural log.

**Can I use it for sequencing (OTU or ASV) tables?** Yes, as long as the values are read counts. Chao1 relies on singletons, which some pipelines remove, so treat it with care for denoised data.

**How many sites can I paste?** As many columns as you like. Pairs of sites for Bray-Curtis are listed up to 200 rows on the page.

**Is my data sent anywhere?** No. Every number is worked out in your browser, and the page keeps working offline once it has loaded.

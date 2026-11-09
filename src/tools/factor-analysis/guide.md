---
name: Factor analysis
num: 724
shelf: science
section: psychology-and-psychometrics
title: "Exploratory factor analysis online: KMO, parallel analysis, varimax and promax (free)"
summary: "Run an exploratory factor analysis in your browser: correlation matrix, KMO and Bartlett's test, scree plot with parallel analysis, principal axis or maximum likelihood extraction, varimax or promax rotation, loadings and communalities. Matches Python's factor_analyzer."
status: live
ads: false
order: 724
icon: chart
works: offline
updated: 2026-11-09
related: [reliability-analysis, sample-size, data-cleaner, plot-maker]
sources:
  - "Methods: Kaiser (1970, 1974) KMO; Bartlett (1950); Horn (1965) parallel analysis; iterated principal axis factoring; maximum likelihood with the objective of R's factanal (Joreskog 1967); varimax (Kaiser 1958) and promax (Hendrickson and White 1964) with Kaiser normalisation."
  - "Example data: made up for this page."
flow:
  - { icon: table, label: "Paste" }
  - { icon: chart, label: "Scree" }
  - { icon: sliders, label: "Rotate" }
  - { icon: download, label: "Loadings" }
---

## What it does

Exploratory factor analysis (EFA) looks for a small number of hidden factors that explain why a set of questionnaire items or test scores go together. It is the usual first step when you build a new scale or check that an existing one has the structure you expect. This tool runs the whole EFA routine in your browser: it checks whether the data is suitable, helps you decide how many factors to keep, extracts and rotates them, and shows the loadings in a table you can download. Nothing is uploaded.

The results match the Python package factor_analyzer (minres and ML extraction, varimax and promax rotation) to within 0.00002 on the example.

## How to use it

1. **Paste your data**: one row per person and one column per variable, or open a CSV or Excel file. Rows with a blank are left out. If you only have a correlation matrix, choose "A correlation matrix" and enter the number of people.
2. **Factors**: by default the tool keeps the number suggested by **parallel analysis**. Pick a number yourself to compare solutions.
3. **Extraction**: *principal axis* (iterated until the communalities settle; the same solution as minres) works with any data. *Maximum likelihood* also gives a chi-square test of model fit, but assumes roughly normal scores.
4. **Rotation**: *promax* lets the factors correlate, which is usual for psychological traits, and shows the factor correlations. *Varimax* keeps them independent. *None* shows the raw extraction.
5. **Grey out loadings below** 0.30 or 0.40 to make the pattern easier to read. Each variable's largest loading is bold.

## What the numbers mean

- **KMO** (Kaiser-Meyer-Olkin) says how much the variables share. Above 0.8 is good, below 0.6 is poor. **MSA** is the same measure for each variable.
- **Bartlett's test** checks that the variables are correlated at all. It should be significant.
- **Parallel analysis** keeps factors whose eigenvalues beat the 95th percentile of eigenvalues from 100 random data sets of the same size. It is more trustworthy than the "eigenvalue above 1" rule, which is shown too.
- **h²** (communality) is the share of a variable's variance explained by the factors, and **u²** the rest.

## Worked example

The made-up example has 150 people and 8 items. KMO is 0.801 (meritorious) and Bartlett's test gives χ²(28) = 290.3, p < 0.001, so the data is suitable. The first eigenvalues are 3.123 and 1.479, above the random 95th percentiles of 1.457 and 1.306, while the third (0.761) is not: parallel analysis suggests **2 factors**. With principal axis and promax, V1 to V4 load on F1 (V2 highest at 0.808) and V5 to V8 on F2, and the two factors correlate at 0.467. With maximum likelihood, the chi-square test is χ²(13) = 10.77, p = 0.630, so two factors fit well.

## Tips

- Aim for at least 5 to 10 people per variable, and at least 100 to 200 people in all.
- Drop variables with a low MSA or a communality under about 0.2, then run the analysis again.
- A communality near 1 (a Heywood case) means the model is asking too much of the data: try fewer factors.
- To confirm a structure you already expect, use confirmatory factor analysis in a dedicated program afterwards.

## Frequently asked questions

**Why do my loadings have opposite signs to another program?** The sign and order of factors are arbitrary. This tool orders factors by size and makes each column's loadings sum to a positive number.

**Can I use Likert items?** Yes, Pearson correlations of 5- or 7-point items are common in practice. With very skewed items, results are rougher.

**Is my data sent anywhere?** No. Everything runs in your browser and the page keeps working offline.

---
name: Embedding visualiser (PCA and t-SNE)
num: 572
shelf: science
section: data-science-and-machine-learning
title: "PCA and t-SNE plot maker: see your data in two dimensions, coloured by a label, in your browser"
summary: "Turn a table of numbers (up to 2,000 rows) into a two-dimensional map with PCA and exact t-SNE, coloured by a label column. See the explained variance, loadings, scree plot, KL divergence and how well neighbours are kept. Matches scikit-learn. Nothing is uploaded."
status: live
ads: false
order: 572
icon: target
works: offline
updated: 2026-11-09
related: [small-model-trainer, csv-profiler, plot-maker, confusion-matrix, train-test-splitter, community-ordination, factor-analysis, metabolite-volcano-pca, neural-network-toys]
sources:
  - "Methods as in scikit-learn: PCA (explained variance with n − 1, svd_flip signs) and TSNE(method='exact') with its perplexity search, early exaggeration, momentum and gains; trustworthiness as sklearn.manifold.trustworthiness. Checked against scikit-learn 1.9."
  - "The example of 120 readings from four machines is made up for this tool."
flow:
  - { icon: file, label: "Open data" }
  - { icon: sliders, label: "Settings" }
  - { icon: target, label: "Map" }
  - { icon: download, label: "Download" }
---

## What it does

A table with many number columns is hard to picture. This tool draws it as a two-dimensional map, so you can see groups, gradients and odd rows at a glance, coloured by a label column such as a species, a machine or a diagnosis. It runs two classic methods in a background worker:

- **PCA (principal component analysis)** finds the straight directions along which the rows spread most. You get the share of the variance each component explains (scree plot), the **loadings** (how much each column counts in each component) and a scatter plot of any two components.
- **t-SNE** (exact, as in scikit-learn) places rows that are similar in the data close together on the map. It is often better than PCA at separating groups, at the cost of distances that are not to scale. You get the **KL divergence** it reached and two checks of how faithful the map is: **trustworthiness** and the share of each row's 10 nearest neighbours that stay among its 10 nearest on the map.

Profile the table before you start with the [[csv-profiler|CSV profiler]], and test whether the groups you see can be predicted with the [[small-model-trainer|small model trainer]].

## How to use it

1. Paste a table or open a CSV, TSV or Excel file of up to 2,000 rows.
2. Pick the label column to **colour by** (or none) and tick the **number columns** to use.
3. Keep **standardise** on unless all columns share the same units; otherwise the column with the biggest numbers dominates.
4. For t-SNE, set the **perplexity** (roughly how many neighbours each row pays attention to: 5 to 50, below the number of rows) and the number of steps. Starting from PCA gives the same map every time; a random start uses the seed.
5. Download the coordinates as CSV, or the report as an image, PDF or Word file.

A t-SNE of 2,000 rows takes about half a minute; the progress and the KL divergence are shown as it runs, and **Stop** cancels it.

## Worked example

The made-up example has 120 readings from four machines (two presses, a lathe and a pump), each with temperature, vibration, current, noise, pressure and speed. Standardised, PC1 and PC2 explain 93.9 % of the variance (74.2 % and 19.6 %). PC1 weighs vibration, current, noise and pressure about equally (loadings 0.43 to 0.45) against speed (−0.378): it separates the fast lathe from the pump. The t-SNE map, at perplexity 30, ends with a KL divergence of 0.057 after 1,000 steps and a trustworthiness of 0.981. It keeps 77.1 % of each reading's 10 nearest neighbours, against 67.3 % for the PCA map, and shows the four machines as four groups, the two similar presses side by side.

## Reading the maps

- In PCA, distances and directions mean something: rows far apart along PC1 differ in the columns with large PC1 loadings.
- In t-SNE, only who sits next to whom matters. The size of a cluster and the gaps between clusters mean little, and different perplexities can give different-looking maps of the same data.
- Neither method uses the label column: if the colours form clean groups, the number columns really do tell the labels apart.

## How it was checked

PCA components, signs, explained variance and scores match scikit-learn exactly. For t-SNE, the neighbour probabilities, the KL divergence and its gradient match scikit-learn's own functions, and a full run on the example and on generated clusters ends within 10 % of scikit-learn's KL divergence with the same trustworthiness (scikit-learn computes in single precision, so the maps are not identical point by point).

## What it does not do

No Barnes-Hut or UMAP (so no more than 2,000 rows), no 3-D maps, and no placing of new rows on an existing t-SNE map.

## Frequently asked questions

**Is my data uploaded?** No. Everything is worked out in your browser, and nothing is stored or sent anywhere.

**Why does the t-SNE map change when I change the perplexity?** Perplexity sets how local the map is: small values stress tiny groups, large values the overall shape. Try two or three values.

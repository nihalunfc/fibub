---
title: Hierarchical clustering and dendrograms
seoTitle: 'Hierarchical clustering and dendrograms explained'
summary: 'Start with every point alone and keep merging the two closest clusters. The dendrogram records every merge, so you can choose the number of clusters afterwards by cutting it. Try the linkages and cut the tree.'
minutes: 20
updated: 2026-11-21
quiz:
  - q: 'Agglomerative clustering starts with:'
    choices: ['Every point in its own cluster', 'All points in one cluster', 'k random centres']
    ans: 0
    why: It works bottom-up, merging the two closest clusters at each step until one is left.
  - q: In a dendrogram, the height where two branches join is
    choices: ['The distance between those two clusters when they merged', 'The number of points', 'The time the merge took']
    ans: 0
    why: Low joins are close neighbours; high joins are clusters that were far apart.
  - q: 'Single linkage measures the distance between two clusters as:'
    choices: ['The distance between their closest pair of points', 'The distance between their farthest pair', 'The distance between their centres']
    ans: 0
    why: That is why single linkage can chain long, thin clusters together through close neighbours.
---

**Module 8 · about 20 minutes · read first: 8.1.** You'll be able to build a small dendrogram by hand, choose a linkage, and cut the tree into clusters.

## 1. Why this matters

Hierarchical clustering gives a whole family tree of groupings in one run, so you can look at 2 broad groups or 10 fine ones without starting again. Biologists use it for gene expression and the tree of life, shops for product ranges, and analysts for any small table where they want to see how things group together.

## 2. Merging step by step

**Agglomerative** (bottom-up) clustering:

1. Put every point in its own cluster.
2. Find the two closest clusters and merge them.
3. Repeat until only one cluster is left.

The **dendrogram** draws this history: the points along the bottom, and a bracket for each merge, drawn at the height of the distance at which it happened.

<!--fig:dendrogram-->

To get clusters, **cut** the dendrogram with a horizontal line: every branch it crosses is one cluster. A long stretch with no merges is a natural place to cut, because the groups below it are far apart.

## 3. Linkage: distance between clusters

Points have distances; clusters need a rule:

- **Single linkage:** the closest pair of points. Finds long, chain-like clusters; also chains together groups joined by a few stray points.
- **Complete linkage:** the farthest pair. Gives compact, similar-sized clusters.
- **Average linkage:** the mean of all pairs. A middle way.
- **Ward's method:** the merge that increases the total within-cluster squared distance least: k-means' objective, built up step by step. Often the default.

Hierarchical clustering compares every pair of points, so it is slow for big data (tens of thousands of rows and up). There, k-means or a sample is the usual choice.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** repeatedly merge the closest pair of clusters, recording the distance of each merge.

**Linkages** between clusters `$A$` and `$B$`, with `$d$` the distance between points:

```math
d_{\text{single}} = \min_{a \in A,\, b \in B} d(a, b)
```

```math
d_{\text{complete}} = \max_{a \in A,\, b \in B} d(a, b)
```

```math
d_{\text{average}} = \frac{1}{\lvert A \rvert \lvert B \rvert} \sum_{a \in A} \sum_{b \in B} d(a, b)
```

**Cost:** with `$n$` points there are `$n(n-1)/2$` pairs to compare, and `$n - 1$` merges.

**Analogy:** families merging into clans and clans into tribes; the family tree shows who joined whom, and when.

**Try it:** points 0, 1, 5, 6, 20 on a line, single linkage. List the merges and their heights. ({0, 1} at 1; {5, 6} at 1; {0, 1} with {5, 6} at 4; then 20 joins at 14.)
</details>

## 4. Worked example

*Made-up numbers.* Five shops by weekly sales (in $1,000s): A 10, B 12, C 30, D 33, E 60. Average linkage:

1. Closest pair: A and B (2). Merge at height 2.
2. Next: C and D (3). Merge at 3.
3. Distances now: {A, B} to {C, D} = mean of 20, 23, 18, 21 = 20.5; {C, D} to E = mean of 30, 27 = 28.5; {A, B} to E = mean of 50, 48 = 49. Merge {A, B} with {C, D} at 20.5.
4. Last: E joins at mean distance from 10, 12, 30, 33 = (50 + 48 + 30 + 27)/4 = 38.75.

Cut at 10: three clusters, {A, B}, {C, D}, {E}. The big gap between 3 and 20.5 says two or three clusters are natural; E, far from everyone, may be a flagship store.

## 5. Practice

1. In the simulation, which cut height gives the three real groups?
2. Switch to single linkage. What changes in the dendrogram?
3. Why is hierarchical clustering slow for a million rows?

<details>
<summary>Answers</summary>

1. Any height in the long gap between the low merges inside each group and the high merges between groups.
2. Merges happen at lower heights (closest pairs), and the gap between the groups is shorter, so the groups are less clearly separated.
3. It needs the distance between every pair: about half a trillion for a million rows.
</details>

**Try it on your own data:** the [[community-ordination]] tool draws a cluster dendrogram (single, complete, average or Ward linkage) from a table of samples.

**New words:** *hierarchical clustering*, *agglomerative*, *dendrogram*, *linkage* (single, complete, average, Ward), *cutting the tree*.

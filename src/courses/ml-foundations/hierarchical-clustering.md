---
title: Hierarchical clustering and dendrograms
seoTitle: 'Hierarchical clustering and dendrograms explained'
summary: 'Start with every point alone and keep merging the two closest clusters. The dendrogram records every merge, so you can choose the number of clusters afterwards by cutting it. Try the linkages and cut the tree.'
minutes: 20
updated: 2026-11-22
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
sources:
  - 'James, Witten, Hastie, Tibshirani and Taylor (2023), An Introduction to Statistical Learning with Applications in Python, Springer, Section 12.4.2 (hierarchical clustering) https://www.statlearning.com/'
  - 'Hastie, Tibshirani and Friedman (2009), The Elements of Statistical Learning, 2nd edition, Springer, Section 14.3.12'
  - 'Ward (1963), Hierarchical grouping to optimize an objective function, Journal of the American Statistical Association 58(301), 236-244 https://doi.org/10.1080/01621459.1963.10500845'
---

**Module 8 · about 20 minutes · read first: 8.1.** You'll be able to build a small dendrogram by hand, choose a linkage, and cut the tree into clusters.

<div class="bigidea">Start with everyone alone, keep joining the two closest groups, and draw a family tree of the joins; then cut the tree at whatever level of detail you need.</div>

## 1. Why this matters

Hierarchical clustering gives a whole family tree of groupings in one run. You can look at 2 broad groups or 10 fine ones without starting again, and you don't have to choose `$k$` first. Biologists use it for gene measurements and the tree of life, shops for product ranges, and analysts for any small table where they want to see how things group together.

## 2. Merging step by step

**Agglomerative** (bottom-up, "gathering together") clustering:

1. Put every point in its own cluster.
2. Find the two closest clusters and merge them.
3. Repeat until only one cluster is left.

The **dendrogram** (from the Greek for "tree drawing") records this history. The points sit along the bottom, and each merge is a bracket drawn at the height of the distance at which it happened.

### Watch it happen

Five shops by weekly sales (in $1,000s): A 10, B 12, C 30, D 33, E 60. Average linkage.

<div class="steps" data-fig="hierarchical-clustering-merges">
<div class="step"><p><b>Everyone alone.</b> Five clusters of one shop each.</p></div>
<div class="step"><p><b>First merge.</b> The closest pair is A and B, 2 apart. They join at height 2.</p></div>
<div class="step"><p><b>Second merge.</b> Next closest: C and D, 3 apart. They join at height 3.</p></div>
<div class="step"><p><b>Groups join.</b> Now compare whole clusters. {A, B} to {C, D}: the average of the four pair distances 20, 23, 18, 21 is 20.5. That beats {C, D} to E (28.5), so they join at 20.5.</p></div>
<div class="step"><p><b>Last merge.</b> E joins everyone at the average of 50, 48, 30, 27 = 38.75. One cluster left.</p></div>
<div class="step"><p><b>Cut the tree.</b> Draw a line at height 10. It crosses three branches: {A, B}, {C, D} and {E}. A higher cut, say at 30, would give two.</p></div>
</div>

<!--fig:dendrogram-->

To get clusters, **cut** the dendrogram with a horizontal line: every branch it crosses is one cluster. A long stretch with no merges is a natural place to cut, because the groups below it are far apart.

## 3. Linkage: distance between clusters

Points have distances, but clusters need a rule. Think of measuring how far apart two towns are: from their nearest houses, their farthest houses, or on average.

- **Single linkage:** the closest pair of points. Finds long, chain-like clusters; also chains together groups joined by a few stray points.
- **Complete linkage:** the farthest pair. Gives compact, similar-sized clusters.
- **Average linkage:** the mean over all pairs. A middle way.
- **Ward's method:** the merge that increases the total within-cluster squared distance the least. This is k-means' goal, built up one merge at a time, and is often the default.

<div class="problem" data-problem="hierarchical-clustering-linkage"></div>

Hierarchical clustering compares every pair of points, so it is slow for big data (tens of thousands of rows and up). There, k-means or a sample is the usual choice.

<div class="meaning">

<dl>
<dt>d(a, b)</dt><dd>the distance between two single points</dd>
<dt>d_single</dt><dd>distance between the two clusters' closest members</dd>
<dt>d_complete</dt><dd>distance between their farthest members</dd>
<dt>d_average</dt><dd>the average distance over every pair, one member from each cluster</dd>
<dt>Merge height</dt><dd>the linkage distance at the moment two clusters join; low joins are close relatives</dd>
<dt>Physical meaning</dt><dd>A family tree. Siblings join low down, cousins higher up, distant relatives near the top. Cutting the tree at one height is like deciding to count "families", or "clans", or "tribes": the same history, read at different levels of detail.</dd>
</dl>

</div>

<div class="myth">

**"Leaves drawn next to each other in a dendrogram are the most similar."** Not necessarily. At each bracket, the two branches can be swapped left-to-right without changing anything, so neighbours along the bottom may only be related high up the tree. Read similarity from the **height** where two leaves first meet, never from how close they are drawn side by side.

</div>

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

<div class="keypoints">

- Agglomerative clustering starts with every point alone and keeps merging the two closest clusters until one is left.
- The dendrogram draws each merge at the height of its distance; cut it with a horizontal line to get clusters, ideally across a long gap.
- Linkage decides cluster-to-cluster distance: single (closest pair), complete (farthest pair), average (all pairs), Ward (smallest rise in squared distance).
- It compares every pair of points, so it suits small to medium tables; use k-means or a sample for big data.

</div>

---
title: 'Choosing k: elbow and silhouette'
seoTitle: 'How to choose k in k-means: elbow method and silhouette'
summary: 'Inertia always falls as k grows, so it cannot pick k alone. Look for the elbow, or for the peak of the silhouette score, which compares each point''s own cluster with the next nearest. Then ask whether the clusters are useful.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: Why can't you choose k by the lowest inertia?
    choices: ['Inertia always falls as k grows, reaching 0 when every point is its own cluster', 'Inertia always rises with k', 'Inertia is random']
    ans: 0
    why: More centres always sit closer to the points, so the lowest inertia is always the largest k.
  - q: A point's silhouette is close to 1. It means
    choices: ['It sits well inside its own cluster, far from the next one', 'It is on the border between two clusters', 'It is probably in the wrong cluster']
    ans: 0
    why: s = (b − a)/max(a, b); near 1 when its own cluster's mean distance a is much smaller than the next cluster's b.
  - q: Elbow and silhouette disagree, and neither is clear. What then?
    choices: ['There may be no natural number of groups; pick k by what is useful for the job', 'Always take k = 2', 'Use the test set']
    ans: 0
    why: Real data often has no sharp groups. A k that gives actionable segments (say, 4 marketing campaigns) is a fine choice.
sources:
  - 'Rousseeuw (1987), Silhouettes: a graphical aid to the interpretation and validation of cluster analysis, Journal of Computational and Applied Mathematics 20, 53-65 https://doi.org/10.1016/0377-0427(87)90125-7'
  - 'James, Witten, Hastie, Tibshirani and Taylor (2023), An Introduction to Statistical Learning with Applications in Python, Springer, Section 12.4 (clustering methods) https://www.statlearning.com/'
  - 'scikit-learn user guide, Clustering performance evaluation: silhouette coefficient https://scikit-learn.org/stable/modules/clustering.html#silhouette-coefficient'
---

**Module 8 · about 20 minutes · read first: 8.1.** You'll be able to read an elbow plot, compute a silhouette score by hand, and choose k with both the numbers and the use in mind.

<div class="bigidea">More clusters always fit tighter, so pick the number where adding one more stops helping much, where points sit snugly in their own group, and where the groups are useful.</div>

## 1. Why this matters

k-means needs `$k$` before it starts. But the "right" number of customer segments, store types or document topics is exactly what you don't know. Choose badly and you get segments that are either too vague to act on or too many to manage. The two plots in this lesson appear in nearly every clustering report.

## 2. The elbow

Run k-means for `$k = 1, 2, \dots, 10$` and plot the inertia (Lesson 8.1). It always falls. But if the data has `$g$` real groups, it falls steeply up to `$k = g$`, because each new centre takes over a whole group. After that it falls slowly, because new centres just split groups that were fine. The bend is the **elbow**.

Think of hiring cashiers for a shop. The first few cut the queue a lot. After a point, each extra cashier saves only seconds. The elbow is where hiring stops paying.

The elbow is easy to explain, but it is often soft: on real data the curve may bend gently, and two people will point at different `$k$`.

## 3. The silhouette

The silhouette asks each point: are you closer to your own group than to the next-nearest group? For each point:

- `$a$` = mean distance to the other points in its own cluster,
- `$b$` = mean distance to the points of the nearest **other** cluster,
- `$s = \dfrac{b - a}{\max(a, b)}$`.

`$s$` is near 1 if the point sits snugly in its cluster, near 0 if it is on a border, and negative if it is probably in the wrong cluster. Average `$s$` over all points, and choose the `$k$` with the highest average.

### Watch it happen

One shopper, three segments.

<div class="steps">
<div class="step"><p><b>Own group.</b> Her distances to the other members of her own segment are 1, 2 and 3. So a = (1 + 2 + 3) ÷ 3 = 2.</p></div>
<div class="step"><p><b>Other groups.</b> To segment 2: 4, 5, 6 (average 5). To segment 3: 7, 8, 9 (average 8).</p></div>
<div class="step"><p><b>Nearest neighbour group.</b> b is the smaller average: 5. Segment 2 is where she would go if her own segment vanished.</p></div>
<div class="step"><p><b>Her silhouette.</b> s = (5 − 2) ÷ max(2, 5) = 3 ÷ 5 = 0.6. Comfortably inside her own segment.</p></div>
<div class="step"><p><b>Score the whole k.</b> Do this for every shopper and average. Repeat for k = 2, 3, 4, ... and pick the k with the highest average.</p></div>
</div>

<!--fig:choose-k-->

<div class="problem" data-problem="choosing-k-silhouette"></div>

Rough guide for the average silhouette: above 0.7 strong structure, 0.5 to 0.7 reasonable, 0.25 to 0.5 weak, below that little real structure.

<div class="meaning">

<dl>
<dt>a(i)</dt><dd>how far point i is, on average, from its own group-mates: small is good</dd>
<dt>b(i)</dt><dd>how far it is, on average, from the nearest other group: big is good</dd>
<dt>s(i)</dt><dd>the gap between the two, scaled to lie between −1 and 1</dd>
<dt>Average s</dt><dd>one score for the whole clustering, for comparing different k</dd>
<dt>Physical meaning</dt><dd>Seating guests at a wedding. A good seating plan has everyone closer to their own table-mates than to the next table. A guest with s near 0 could sit at either table; a guest with negative s is at the wrong one.</dd>
</dl>

</div>

## 4. The question numbers can't answer

Clusters are useful if they help a decision. A marketing team that can run four campaigns may want `$k = 4$` even if the silhouette prefers 3. Look at each cluster's averages, give it a name ("young commuters", "weekend families"), and check that the groups are stable: rerun with another seed or on a sample of the data and see if they come back.

<div class="myth">

**"There is one correct k, and the elbow tells you what it is."** Most real data, such as customers, has no sharp borders: shoppers shade from one type into another. Then the elbow is soft, the silhouette is low for every k, and several choices are equally defensible. The numbers narrow the range; usefulness and stability make the final choice.

</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** good clusters are tight inside and far apart.

**Silhouette of point `$i$`** in cluster `$C$`, with `$d$` the distance:

```math
a(i) = \frac{1}{\lvert C \rvert - 1} \sum_{j \in C,\, j \ne i} d(i, j)
```

```math
b(i) = \min_{C' \ne C} \frac{1}{\lvert C' \rvert} \sum_{j \in C'} d(i, j)
```

```math
s(i) = \frac{b(i) - a(i)}{\max\{a(i), b(i)\}}
```

**Why inertia always falls:** with one more centre, you could put it on any point and leave the rest as they were; that alone lowers the total. The best `$k+1$` solution is at least that good.

**Analogy:** seating guests at tables. A good seating has everyone closer to their own table-mates than to the next table.

**Try it:** a point's mean distance to its own cluster is 2, and to the nearest other cluster 5. Silhouette? (`$(5 - 2)/5 = 0.6$`.)
</details>

## 5. Worked example

*Made-up numbers.* Clustering 2,000 shoppers by visits, spend and basket size (scaled):

| k | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|
| inertia | 3,900 | 2,600 | 1,700 | 1,520 | 1,390 |
| silhouette | 0.41 | 0.47 | 0.53 | 0.46 | 0.42 |

Inertia drops by 1,300, then 900, then only 180: the elbow is at 4. The silhouette also peaks at 4 (0.53, reasonable structure). Four segments it is, provided the team can describe each one and the same four come back with another seed.

## 6. Practice

1. In the simulation, set 3 real groups with small spread. Where are the elbow and the silhouette peak?
2. Widen the groups to 0.6. What happens to both signals?
3. Can the silhouette help choose `$k = 1$`?

<details>
<summary>Answers</summary>

1. Both at k = 3.
2. The elbow softens and the silhouette falls and flattens: the groups overlap, and there is no clear answer.
3. No: with one cluster there is no "other cluster", so `$b$` is undefined. Use it to compare k = 2 and up.
</details>

**Try it on your own data:** the [[small-model-trainer]] draws an elbow plot of inertia for k-means on your CSV.

**New words:** *elbow method*, *silhouette score*, *cluster stability*, *segment*.

<div class="keypoints">

- Inertia always falls as k grows, so it can't choose k on its own.
- The elbow is the k after which extra clusters stop cutting inertia much; it is often soft.
- The silhouette compares each point's distance to its own cluster (a) with the nearest other cluster (b): s = (b − a)/max(a, b). Pick the k with the highest average.
- The final k should also give clusters you can name, use and reproduce with another seed.

</div>

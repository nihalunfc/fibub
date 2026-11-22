---
title: Clustering with k-means
seoTitle: 'k-means clustering explained step by step'
summary: 'With no labels at all, k-means finds k groups by repeating two steps: give each point to its nearest centre, then move each centre to the middle of its points. Run it by hand, see it settle, and learn its blind spots.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: 'The two steps of k-means are:'
    choices: ['Assign each point to the nearest centre; move each centre to the mean of its points', 'Split the data by Gini; prune', 'Compute gradients; update weights']
    ans: 0
    why: Assign, update, repeat until no point changes cluster.
  - q: Why run k-means several times from different starts?
    choices: ['It can settle in a poor solution that depends on where the centres started', 'It is random every time it runs, even with the same start', 'To get more clusters']
    ans: 0
    why: Each run only goes downhill from its start, so keep the run with the lowest inertia (k-means++ starts help too).
  - q: k-means struggles most with clusters that are
    choices: ['Round and of similar size', 'Long and curved, or very different in size', 'Well separated']
    ans: 1
    why: It gives each point to the nearest centre, which carves space into straight-edged cells. Curved or uneven groups get cut wrongly.
sources:
  - 'James, Witten, Hastie, Tibshirani and Taylor (2023), An Introduction to Statistical Learning with Applications in Python, Springer, Section 12.4.1 (k-means clustering) https://www.statlearning.com/'
  - 'Lloyd (1982), Least squares quantization in PCM, IEEE Transactions on Information Theory 28(2), 129-137 https://doi.org/10.1109/TIT.1982.1056489'
  - 'Arthur and Vassilvitskii (2007), k-means++: the advantages of careful seeding, Proceedings of the 18th ACM-SIAM Symposium on Discrete Algorithms, 1027-1035'
  - 'scikit-learn user guide, Clustering: K-means https://scikit-learn.org/stable/modules/clustering.html#k-means'
---

**Module 8 · about 25 minutes · read first: 1.4, 2.4.** You'll be able to run k-means by hand, explain inertia and why the algorithm always stops, and say when k-means is the wrong tool.

<div class="bigidea">k-means finds groups in data nobody has labelled, by repeating two simple moves: join the nearest centre, then move each centre to the middle of its group.</div>

## 1. Why this matters

Most data has no labels. A shop has purchase histories, but nobody has tagged customers as "bargain hunters" or "big weekly shoppers". **Clustering** finds such groups for you, and k-means is the classic way. It is used for customer segments, grouping stores or products, shrinking the number of colours in an image, and as a first look at any new table.

## 2. Learning without labels

In supervised learning (Modules 3 to 7) every row had an answer to copy. In **unsupervised learning** there is no answer: the model looks for structure in the inputs alone. Clustering asks: which rows are like each other, and different from the rest?

Think of tipping a box of mixed buttons onto a table. Nobody tells you the categories, but you soon push them into piles of similar ones. k-means does that with numbers.

## 3. The algorithm

k-means needs one choice from you: `$k$`, the number of clusters (groups). Then:

1. **Start:** place `$k$` centres. At random, or better with k-means++, which spreads them out.
2. **Assign:** give every point to its nearest centre.
3. **Update:** move each centre to the mean (average position) of the points assigned to it. The centre is also called the **centroid**.
4. Repeat 2 and 3 until no point changes cluster.

### Watch it happen

Six points on a line, k = 2, and a deliberately bad start.

<div class="steps" data-fig="k-means-line">
<div class="step"><p><b>Start.</b> Points at 1, 2, 3, 10, 11, 12. The two centres start side by side at 1 and 2: a poor guess, to see k-means fix it.</p></div>
<div class="step"><p><b>Assign.</b> The border is halfway between the centres, at 1.5. Only the point at 1 is nearer centre 1. The other five go to centre 2.</p></div>
<div class="step"><p><b>Update.</b> Centre 1 stays at 1. Centre 2 moves to the average of its points: (2 + 3 + 10 + 11 + 12) ÷ 5 = 7.6.</p></div>
<div class="step"><p><b>Assign again.</b> The border is now at (1 + 7.6) ÷ 2 = 4.3. Points 2 and 3 switch to centre 1.</p></div>
<div class="step"><p><b>Update again.</b> Centre 1 = (1 + 2 + 3) ÷ 3 = 2. Centre 2 = (10 + 11 + 12) ÷ 3 = 11.</p></div>
<div class="step"><p><b>Stop.</b> Assigning again changes nothing. Inertia (squared distances to the centres) = 1 + 0 + 1 + 1 + 0 + 1 = 4.</p></div>
</div>

<!--fig:kmeans-steps-->

<div class="problem" data-problem="k-means-step"></div>

Both steps lower the **inertia**, the total squared distance from each point to its centre, so the algorithm always stops. But it only goes downhill from where it started, so different starts can end in different answers. Libraries run it several times (often 10) and keep the run with the lowest inertia.

<div class="meaning">

<dl>
<dt>k</dt><dd>how many groups you ask for</dd>
<dt>Sⱼ</dt><dd>cluster j: the set of points whose nearest centre is centre j</dd>
<dt>μⱼ (mu)</dt><dd>the centre of cluster j, the average position of its points</dd>
<dt>‖x − μⱼ‖²</dt><dd>squared distance from a point to its centre</dd>
<dt>J (inertia)</dt><dd>all those squared distances added up: small when every point is close to its centre</dd>
<dt>Physical meaning</dt><dd>Opening k shops in a town. Each resident uses the nearest shop; each shop then moves to the middle of its customers; repeat until nobody switches. The final shops sit in the hearts of the neighbourhoods, and inertia is the town's total walking.</dd>
</dl>

</div>

<div class="problem" data-problem="k-means-inertia"></div>

## 4. Things to know

- **Scale first** (Lesson 2.4). Distances mix the columns, so a column in dollars would swamp one in years.
- **Round, similar-sized clusters** suit k-means best. It carves space into straight-edged cells round each centre, so long, curved or nested groups get cut badly. Density-based methods such as DBSCAN handle those.
- **Every point gets a cluster,** outliers included, and they can drag a centre away.
- **You must choose `$k$`.** Lesson 8.2 shows how.

<div class="myth">

**"k-means finds the true groups in the data."** It finds the best `$k$` round blobs it can reach from its start, whether or not real groups exist. Give it random noise and k = 5 and it will happily return 5 clusters. Its answer depends on `$k$`, on the scaling and on the start. Clusters are a useful summary to check and name, not a discovery to trust blindly.

</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** find `$k$` centres so that each point is close to its own centre.

**Objective (inertia):** with clusters `$S_1, \dots, S_k$` and centres `$\boldsymbol{\mu}_1, \dots, \boldsymbol{\mu}_k$`,

```math
J = \sum_{j=1}^{k} \sum_{\mathbf{x} \in S_j} \lVert \mathbf{x} - \boldsymbol{\mu}_j \rVert^2
```

**Why each step helps:** with centres fixed, giving each point to its nearest centre can only shrink its term. With clusters fixed, the point that minimises the total squared distance to a set of points is their mean (the same fact as Lesson 5.4's leaf mean). There are only finitely many ways to assign points, and `$J$` never rises, so the loop must end.

**Analogy:** opening `$k$` shops in a town. Each resident uses the nearest shop; each shop then moves to the middle of its customers; repeat until nobody switches.

**Try it:** points 1, 2, 3, 10, 11, 12 on a line, `$k = 2$`, centres start at 1 and 2. Run it. (Assign: {1} and {2, 3, 10, 11, 12}. Update: 1 and 7.6. Assign: {1, 2, 3} and {10, 11, 12}. Update: 2 and 11. Assign: no change. Done.)
</details>

## 5. Worked example

*Made-up numbers.* Six customers by (visits per month, average spend in $10s): A (1, 9), B (2, 8), C (2, 10), D (8, 2), E (9, 3), F (10, 1). Start with centres at A and D.

- **Assign:** A, B, C are nearest (1, 9); D, E, F nearest (8, 2).
- **Update:** centre 1 = mean of A, B, C = (1.67, 9); centre 2 = mean of D, E, F = (9, 2).
- **Assign:** no change. Done.

Inertia: cluster 1: (0.44 + 0) + (0.11 + 1) + (0.11 + 1) = 2.67; cluster 2: (1 + 0) + (0 + 1) + (1 + 1) = 4. Total 6.67. Two clear segments: occasional big spenders, and frequent small spenders.

## 6. Practice

1. In the simulation, find a start where two centres share one group and another centre covers two. What does the inertia say?
2. Why must the columns be scaled before k-means?
3. A cluster ends up with no points. What would you do?

<details>
<summary>Answers</summary>

1. The inertia stays higher than in a good run; keeping the lowest-inertia run of several avoids this.
2. Distance adds up differences in every column, so a column with big numbers would decide the clusters on its own.
3. Restart that centre somewhere else, for example at the point farthest from its centre (libraries do this automatically).
</details>

**Try it on your own data:** the [[small-model-trainer]] runs k-means on your CSV with k-means++ starts and the best of 10 runs.

**New words:** *unsupervised learning*, *clustering*, *k-means*, *centroid*, *inertia*, *k-means++*, *local minimum*.

<div class="keypoints">

- Clustering finds groups in data with no labels; k-means is the classic method.
- k-means repeats two steps: assign each point to its nearest centre, move each centre to the mean of its points, until nothing changes.
- Inertia (total squared distance to the centres) falls at every step, so it always stops, but the result depends on the start: run it several times and keep the lowest inertia.
- Scale the columns first; k-means suits round, similar-sized groups and puts every point, even outliers, in some cluster.

</div>

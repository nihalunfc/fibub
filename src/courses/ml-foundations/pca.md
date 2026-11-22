---
title: 'PCA: squashing many columns into two'
seoTitle: 'PCA (principal component analysis) explained simply'
summary: 'Principal component analysis finds the directions along which the data spreads the most, so a table with many columns can be drawn in two with little lost. Turn a line through a cloud of points and find the first component.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: 'The first principal component is:'
    choices: ['The direction along which the data varies the most', 'The column with the biggest numbers', 'The first column of the table']
    ans: 0
    why: PCA finds new axes ordered by how much of the spread (variance) they capture.
  - q: Why scale the columns before PCA?
    choices: ['Otherwise the column with the largest units dominates the variance', 'PCA only accepts numbers between 0 and 1', 'It makes PCA supervised']
    ans: 0
    why: A column in grams has a huge variance compared with one in kilograms, purely because of its units.
  - q: The first two components keep 85 % of the variance. This means
    choices: ['A 2D plot of the data loses about 15 % of its spread', 'The model is 85 % accurate', '85 % of the columns are useful']
    ans: 0
    why: The share of variance kept is a measure of how faithful the 2D picture is.
sources:
  - 'James, Witten, Hastie, Tibshirani and Taylor (2023), An Introduction to Statistical Learning with Applications in Python, Springer, Section 12.2 (principal components analysis) https://www.statlearning.com/'
  - 'Jolliffe and Cadima (2016), Principal component analysis: a review and recent developments, Philosophical Transactions of the Royal Society A 374, 20150202 https://doi.org/10.1098/rsta.2015.0202'
  - 'Pearson (1901), On lines and planes of closest fit to systems of points in space, Philosophical Magazine 2(11), 559-572 https://doi.org/10.1080/14786440109462720'
---

**Module 8 · about 25 minutes · read first: 1.4, 1.6, 2.3.** You'll be able to explain what a principal component is, read the share of variance it keeps, and use PCA to draw or compress a wide table.

<div class="bigidea">When many columns move together, a few new "summary" directions can carry almost all the information, so a wide table can be drawn in two dimensions with little lost.</div>

## 1. Why this matters

Tables often have dozens or hundreds of columns: survey answers, sensor readings, gene measurements, word counts. People can't see in 50 dimensions, and many models struggle there (the curse of dimensionality, Lesson 4.7). PCA finds the few directions that carry most of the information. Then you can plot the data in 2D, spot groups and outliers, and feed fewer, cleaner columns to a model.

## 2. Directions of spread

When columns are correlated (Lesson 2.3), much of the information is repeated. A fish's length and weight rise together: one number, "size", says most of what the two say.

PCA makes that idea exact. It looks for the line through the centre of the data along which the points spread out the most. That direction is the **first principal component** (PC1). The second (PC2) is the direction of most remaining spread at right angles to the first, and so on. There are as many components as columns, ordered by how much **variance** (spread) they capture.

Think of the shadow of your hand on a wall. Turn your hand flat to the light and the shadow shows all five fingers; turn it edge-on and you see a thin line. PCA turns the data until its "shadow" on a few axes shows as much as possible.

<!--fig:pca-project-->

Two ways to see the same line:

- the direction that **keeps** the most spread when points are dropped onto it, and
- the line that is **closest** to the points (the smallest total squared distance from each point to the line).

These are the same line. By Pythagoras, each point's squared distance from the centre splits into the part along the line and the part across it. The total is fixed, so more along means less across.

### Watch it happen

Two scaled columns, each with variance 1, correlation 0.8. Total variance: 1 + 1 = 2.

<div class="steps">
<div class="step"><p><b>Centre the data.</b> Subtract each column's mean, so the cloud of points sits around (0, 0). Scaling has already given both columns variance 1.</p></div>
<div class="step"><p><b>Try the old axis.</b> Drop every point straight down onto the x-axis. The spread kept is just column 1's variance: 1 out of 2, or 50 %.</p></div>
<div class="step"><p><b>Turn the line to 45°.</b> Now both columns help: variance kept = ½ × (1 + 0.8 + 0.8 + 1) = 1.8 out of 2, or 90 %. No other angle does better: this is PC1.</p></div>
<div class="step"><p><b>The right angle.</b> At 135°, across the cloud, only 0.2 is left: 10 %. This is PC2. Together, 1.8 + 0.2 = 2, all of it.</p></div>
<div class="step"><p><b>Score a point.</b> A centred customer at (1.2, 0.8) gets PC1 score (1.2 + 0.8) ÷ √2 ≈ 1.41 and PC2 score (0.8 − 1.2) ÷ √2 ≈ −0.28. Keep only PC1 and you keep 90 % of the picture with one number.</p></div>
</div>

<div class="problem" data-problem="pca-project"></div>

## 3. Using PCA

- **Scale first** (Lesson 2.4), or the column with the biggest units dominates.
- **Look at the share of variance** each component keeps (a "scree plot"). If PC1 and PC2 together keep, say, 80 %, a 2D scatter is a faithful picture.
- **Read the loadings.** Each component is a weighted sum of the original columns, and the weights tell you what it means ("PC1 = overall size", "PC2 = long and thin against short and wide").
- **Not for every job.** PCA finds straight directions. Curved structure (a spiral, two interlocking moons) needs non-linear methods such as t-SNE or UMAP. And PCA ignores labels, so the direction of most spread need not be the one that separates your classes.

<div class="problem" data-problem="pca-variance-share"></div>

<div class="meaning">

<dl>
<dt>u</dt><dd>a direction: an arrow of length 1 that says how much of each column to mix in</dd>
<dt>uᵀx</dt><dd>a point's score along that direction: where its shadow lands on the new axis</dd>
<dt>S</dt><dd>the covariance matrix: every column's variance and how each pair moves together</dd>
<dt>λ (lambda, eigenvalue)</dt><dd>the variance a component keeps; the λs add up to the total variance</dd>
<dt>Loadings</dt><dd>the numbers inside u: how much each original column counts in the component</dd>
<dt>Physical meaning</dt><dd>Photographing a teapot. From the side you see the spout, handle and shape; from directly above you see a circle. PCA chooses the camera angle that shows the most, so one or two photos describe a many-sided object.</dd>
</dl>

</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** rotate the axes so the first one points along the greatest variance, the next along the greatest remaining variance at right angles, and so on.

**Variance along a unit direction `$\mathbf{u}$`:** with the data centred and covariance matrix `$\mathbf{S}$`,

```math
\operatorname{Var}(\mathbf{u}^\top \mathbf{x}) = \mathbf{u}^\top \mathbf{S} \, \mathbf{u}
```

Maximising this over unit vectors gives the **eigenvector** of `$\mathbf{S}$` with the largest **eigenvalue** `$\lambda_1$`; the eigenvalue is the variance kept. The next components are the next eigenvectors.

**Share kept by the first `$m$` of `$d$` components:**

```math
\frac{\lambda_1 + \dots + \lambda_m}{\lambda_1 + \dots + \lambda_d}
```

**Analogy:** photographing a teapot. From the side you see its shape; from directly above you see a circle. The side view keeps the most information, and PCA picks that angle for the data.

**Try it:** two scaled columns have variance 1 each and correlation 0.8. The covariance matrix is [[1, 0.8], [0.8, 1]]; its eigenvalues are 1.8 and 0.2. What share does PC1 keep? (1.8 / 2 = 90 %.)
</details>

<div class="myth">

**"PCA picks out the most important columns."** It doesn't pick columns at all. Each component is a **new** column, a blend of all the old ones. And "most spread" is not the same as "most useful": the direction that best predicts your target, or separates your classes, may have little spread and end up in a minor component. PCA is a summary of the inputs, not a judge of what matters for a prediction.

</div>

## 4. Worked example

*Made-up numbers.* A survey has 6 questions about a phone, each scored 1 to 7 and scaled. PCA gives:

| component | variance kept | biggest loadings |
|---|---|---|
| PC1 | 52 % | battery, speed, screen, camera (all positive) |
| PC2 | 23 % | price (+), value for money (−) |
| PC3 to PC6 | 25 % in total | mixed |

PC1 is "overall satisfaction": people who like one feature tend to like them all. PC2 is "price sensitivity". Plotting every respondent on PC1 and PC2 keeps 75 % of the spread and shows, at a glance, a group of happy but price-sensitive customers worth a discount campaign.

## 5. Practice

1. In the simulation, what share of the variance does PC1 keep? What about the angle at right angles to it?
2. Why does PCA need scaled columns?
3. Two classes differ only along a direction with little spread. Will a PCA plot show them apart?

<details>
<summary>Answers</summary>

1. Most of it (around 85 to 90 %); the right-angle direction keeps the rest, which is PC2.
2. Variance depends on units: a column in metres would have a millionth of the variance of the same column in millimetres.
3. Probably not: PCA keeps the directions of most spread and ignores the labels, so the separating direction may be dropped.
</details>

**Try it on your own data:** the [[embedding-visualiser]] runs PCA on your own table and shows the share of variance, the loadings and a scree plot.

**New words:** *principal component analysis*, *principal component*, *variance explained*, *loadings*, *scree plot*, *eigenvector*, *eigenvalue*, *dimensionality reduction*.

<div class="keypoints">

- PCA finds new axes (principal components) ordered by how much of the data's spread they keep; each is at right angles to the ones before.
- Each component is a weighted blend of all the original columns; the weights (loadings) say what it means.
- The share of variance kept, λ₁ + ... + λₘ over the total, tells you how faithful a picture with m components is.
- Scale the columns first; PCA finds straight directions only and ignores labels.

</div>

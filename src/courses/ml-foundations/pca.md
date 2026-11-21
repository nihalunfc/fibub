---
title: 'PCA: squashing many columns into two'
seoTitle: 'PCA (principal component analysis) explained simply'
summary: 'Principal component analysis finds the directions along which the data spreads the most, so a table with many columns can be drawn in two with little lost. Turn a line through a cloud of points and find the first component.'
minutes: 25
updated: 2026-11-21
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
---

**Module 8 · about 25 minutes · read first: 1.4, 1.6, 2.3.** You'll be able to explain what a principal component is, read the share of variance it keeps, and use PCA to draw or compress a wide table.

## 1. Why this matters

Tables often have dozens or hundreds of columns: survey answers, sensor readings, gene measurements, word counts. People can't see in 50 dimensions, and many models struggle there (the curse of dimensionality, Lesson 4.7). PCA finds the few directions that carry most of the information, so you can plot the data in 2D, spot groups and outliers, and feed fewer, cleaner columns to a model.

## 2. Directions of spread

When columns are correlated (Lesson 2.3), much of the information is repeated. A fish's length and weight rise together: one number, "size", says most of what the two say.

PCA makes that idea exact. It looks for the line through the centre of the data along which the points spread out the most. That direction is the **first principal component** (PC1). The second (PC2) is the direction of most remaining spread at right angles to the first, and so on. There are as many components as columns, ordered by the variance they capture.

<!--fig:pca-project-->

Two ways to see the same line:

- the direction that **keeps** the most spread when points are dropped onto it, and
- the line that is **closest** to the points (the smallest total squared distance from each point to the line).

These are the same line, because each point's squared distance from the centre is split, by Pythagoras, into the part along the line and the part across it.

## 3. Using PCA

- **Scale first** (Lesson 2.4), or the column with the biggest units dominates.
- **Look at the share of variance** each component keeps (a "scree plot"). If PC1 and PC2 together keep, say, 80 %, a 2D scatter is a faithful picture.
- **Read the loadings**: each component is a weighted sum of the original columns, and the weights tell you what it means ("PC1 = overall size", "PC2 = long and thin against short and wide").
- **Not for every job:** PCA finds straight directions. Curved structure (a spiral, the two moons) needs non-linear methods such as t-SNE or UMAP, and PCA ignores labels, so the direction of most spread need not be the one that separates your classes.

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

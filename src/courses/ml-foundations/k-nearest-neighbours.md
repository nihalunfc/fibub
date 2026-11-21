---
title: k-nearest neighbours
seoTitle: 'k-nearest neighbours (k-NN) explained, with a simulation'
summary: 'The simplest classifier of all: to label a new point, find the k closest examples and let them vote. No training, flexible boundaries, and one dial, k, that runs from overfitting to underfitting. Change k on the two-moons data.'
minutes: 20
updated: 2026-11-21
quiz:
  - q: With k = 1, what is the training accuracy of k-NN (when no two identical points have different labels)?
    choices: ['About 50 %', '100 %', 'It depends on the test set']
    ans: 1
    why: Each training point's nearest neighbour is itself, so it always gets its own label right. A classic sign that training accuracy means nothing here.
  - q: What happens as k grows very large?
    choices: ['The boundary gets more jagged', 'The boundary smooths out, and at k = n every point gets the majority class', 'Nothing changes']
    ans: 1
    why: 'More voters average out local detail. With every point voting, the answer is always the most common class: underfitting.'
  - q: Why must inputs be scaled for k-NN?
    choices: ['It makes training faster', 'Distances would be dominated by whichever feature has the largest numbers', 'k-NN needs numbers between 0 and 1']
    ans: 1
    why: As in Lesson 2.4, a feature in dollars swamps one in years unless both are scaled.
---

**Module 4 · about 20 minutes · read first: 2.4, 3.7.** You'll be able to classify a point with k-NN by hand, choose k, and explain the method's strengths and its weakness with many features.

## 1. Why this matters

k-nearest neighbours is the plainest form of "learning from examples": things that are alike tend to have the same label. It needs no training, draws boundaries of any shape, and is easy to explain ("these five similar past cases were approved"). The same idea of "find the nearest" powers recommendation systems and the document search behind many AI assistants, where the "points" are embeddings (Lesson 10.2).

## 2. The method

To classify a new point:

1. Compute its distance to every training example (usually straight-line, Euclidean, distance on scaled features).
2. Take the `$k$` closest.
3. Let them vote: predict the most common class. The share of votes is a rough probability.

For regression, predict the average of the `$k$` neighbours' values instead.

There is no training step: the model *is* the training data. That makes it quick to set up and slow to use, because every prediction compares the new point with every stored example (smart index structures help).

## 3. The one dial: k

<!--fig:knn-regions-->

- **k = 1:** the boundary wraps round every single point, including noisy ones on the wrong side. Training accuracy is 100 %, test accuracy is lower. Overfitting.
- **Middle k (say 9 to 21 here):** smooth boundaries that follow the two moons. The best test accuracy.
- **Very large k:** the vote is swamped by far-away points; the boundary flattens into a straight-ish line and then into "always the majority class". Underfitting.

Choose `$k$` with a validation set or cross-validation (Lesson 7.2). With two classes, odd `$k$` avoids ties.

## 4. The curse of dimensionality

k-NN works beautifully in 2 or 3 dimensions and can fail in 300. In high dimensions, points spread out so thinly that every point is far from every other, and the "nearest" neighbours are barely nearer than the rest. Irrelevant features make it worse, because they add noise to every distance. Use a handful of good features, or reduce the dimensions first (PCA, Lesson 8.4).

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** similar inputs should get similar outputs. k-NN estimates the class probability as the share of each class among the nearest examples.

**Equations:** Euclidean distance between rows `$\mathbf{a}$` and `$\mathbf{b}$`, and the estimate for a query `$\mathbf{x}$` with neighbour set `$N_k(\mathbf{x})$`:

```math
d(\mathbf{a}, \mathbf{b}) = \sqrt{\sum_{j=1}^{d} (a_j - b_j)^2}, \qquad \hat{P}(y = c \mid \mathbf{x}) = \frac{1}{k} \sum_{i \in N_k(\mathbf{x})} [\, y_i = c \,]
```

A popular variant weights each vote by `$1/d$`, so closer neighbours count more.

**The curse in one number:** in `$d$` dimensions, to capture 1 % of points spread evenly in a unit cube, a smaller cube must have side `$0.01^{1/d}$`: 0.1 in 2 dimensions, but 0.63 in 10 and 0.95 in 100. "Local" stops being local.

**Analogy:** asking the neighbours. To guess how a new family on the street will vote, ask the five nearest houses.

**Try it:** training points (1, 1) class A, (2, 2) class A, (4, 4) class B, (5, 4) class B, (5, 5) class B. Classify (3, 3) with k = 3. (Distances: 2.83, 1.41, 1.41, 2.24, 2.83. Nearest three: (2, 2) A, (4, 4) B, (5, 4) B. Vote: B.)
</details>

## 5. Worked example

*Made-up numbers.* A library suggests whether a new member will like a book club, using two scaled features: books read last year and average book length. For a new member at (0.4, −0.2), the 5 nearest past members are at distances 0.15, 0.22, 0.30, 0.31 and 0.45; three of them joined and liked it, two didn't. Plain vote: 3 to 2, "will like it", with a probability of 0.6. Distance-weighted vote: if the two closest (1/0.15 = 6.7 and 1/0.22 = 4.5) are the ones who liked it, along with the fourth (3.2), the weights are 14.4 for "like" against 3.3 + 2.2 = 5.5 for "not": about 0.72.

## 6. Practice

1. Why does k-NN have "no training", and what is the cost of that?
2. With 3 classes and k = 4, how could a tie happen, and how might you break it?
3. Would k-NN work well on raw pixel values of photos? Why or why not?

<details>
<summary>Answers</summary>

1. It just stores the data. The cost is that each prediction compares against every stored example, which is slow and needs all the data kept.
2. Two classes get 2 votes each. Break ties by the closest neighbour, by distance weighting, or by using a different k.
3. Poorly: thousands of dimensions, and pixel distance doesn't match meaning (the same cat shifted a little is "far" in pixels). Use learned features (embeddings) instead.
</details>

**Try it on your own data:** the [[small-model-trainer]] runs k-NN on your CSV and shows test accuracy as you change k.

**New words:** *k-nearest neighbours*, *Euclidean distance*, *distance weighting*, *lazy learning* (no training step), *curse of dimensionality*.

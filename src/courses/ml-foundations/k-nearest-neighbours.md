---
title: k-nearest neighbours
seoTitle: 'k-nearest neighbours (k-NN) explained, with a simulation'
summary: 'The simplest classifier of all: to label a new point, find the k closest examples and let them vote. No training, flexible boundaries, and one dial, k, that runs from overfitting to underfitting. Change k on the two-moons data.'
minutes: 20
updated: 2026-11-22
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
sources:
  - 'Cover and Hart (1967), Nearest neighbor pattern classification, IEEE Transactions on Information Theory 13(1), 21-27 https://doi.org/10.1109/TIT.1967.1053964'
  - 'James, Witten, Hastie and Tibshirani (2021), An Introduction to Statistical Learning, 2nd edition, Springer, Sections 2.2.3 and 4.7.6 (K-nearest neighbors) https://www.statlearning.com/'
  - 'scikit-learn user guide: Nearest neighbors https://scikit-learn.org/stable/modules/neighbors.html'
---

**Module 4 · about 20 minutes · read first: 2.4, 3.7.** You'll be able to classify a point with k-NN by hand, choose k, and explain the method's strengths and its weakness with many features.

<div class="bigidea">To guess the label of something new, find the most similar things you have already seen and go with what most of them were.</div>

## 1. Why this matters

k-nearest neighbours (k-NN) is the plainest form of "learning from examples": things that are alike tend to have the same label. It needs no training, draws borders of any shape, and is easy to explain ("these five similar past cases were approved"). The same "find the nearest" idea powers recommendation systems and the document search behind many AI assistants, where the "points" are embeddings (Lesson 10.2).

## 2. The method

To classify a new point:

1. Measure its distance to every stored example. Usually this is straight-line (**Euclidean**) distance, the kind you'd measure with a ruler, on scaled features.
2. Keep the `$k$` closest. (`$k$` is just a number you choose, such as 3 or 9.)
3. Let them vote: predict the most common class. The share of votes is a rough probability.

For regression, predict the average of the `$k$` neighbours' values instead.

There is no training step: the model *is* the stored data. That makes it quick to set up and slow to use, because every prediction compares the new point with every stored example. Smart index structures help. Because it puts off all the work until a question arrives, k-NN is called a **lazy learner**.

<div class="steps" data-fig="knn-vote">
<div class="step"><p><b>A new point arrives</b> at (3, 3). Five stored points: two of class A, three of class B.</p></div>
<div class="step"><p><b>Measure every distance.</b> For (2, 2): √((3−2)² + (3−2)²) = √2 ≈ 1.41. The others: 2.83, 1.41, 2.24 and 2.83.</p></div>
<div class="step"><p><b>Keep the 3 nearest.</b> (2, 2) at 1.41, (4, 4) at 1.41 and (5, 4) at 2.24. The two far corners drop out.</p></div>
<div class="step"><p><b>Vote.</b> One A, two B. The new point is labelled B, with a rough probability of 2/3.</p></div>
</div>

<div class="meaning">

<dl>
<dt>d(a, b)</dt><dd>The straight-line distance between two rows: square each feature's difference, add them up, take the square root.</dd>
<dt>k</dt><dd>How many neighbours get a vote.</dd>
<dt>N<sub>k</sub>(x)</dt><dd>The set of the k stored examples closest to the new point x.</dd>
<dt>Physical meaning</dt><dd>Asking the neighbours. To guess how a new family on the street will vote, ask the five nearest houses. Ask only one and you may get the odd one out; ask the whole town and you lose what is special about the street.</dd>
</dl>

</div>

A popular version weights each vote by `$1/d$`, so closer neighbours count more.

<div class="problem" data-problem="k-nearest-neighbours-vote"></div>

## 3. The one dial: k

<!--fig:knn-regions-->

- **k = 1:** the border wraps round every single point, including noisy ones on the wrong side. Training accuracy is 100 %, test accuracy is lower. Overfitting.
- **Middle k (say 9 to 21 here):** smooth borders that follow the two moons. The best test accuracy.
- **Very large k:** far-away points swamp the vote; the border flattens out and then becomes "always the majority class". Underfitting.

Choose `$k$` with a validation set or cross-validation (Lesson 7.2). With two classes, an odd `$k$` avoids ties.

## 4. The curse of dimensionality

k-NN works beautifully in 2 or 3 dimensions and can fail in 300. With many features, points spread out so thinly that every point is far from every other, and the "nearest" neighbours are barely nearer than the rest. Picture friends who live on one street: easy to find the closest. Now give every friend a house in a 300-storey building on a 300-street grid: everyone is far from everyone. Irrelevant features make it worse, because they add noise to every distance. Use a handful of good features, or reduce the dimensions first (PCA, Lesson 8.4).

<div class="myth">

**"k-NN has no settings, so there is nothing to get wrong."** It has two big ones hiding in plain sight: the value of k, and how distance is measured. Forget to scale your features and a column in dollars (thousands) drowns out a column in years (tens), so the "nearest" neighbours are just the ones with similar incomes.

</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** similar inputs should get similar outputs. k-NN estimates the class probability as the share of each class among the nearest examples.

**Equations:** Euclidean distance between rows `$\mathbf{a}$` and `$\mathbf{b}$`, and the estimate for a new point `$\mathbf{x}$` with neighbour set `$N_k(\mathbf{x})$`:

```math
d(\mathbf{a}, \mathbf{b}) = \sqrt{\sum_{j=1}^{d} (a_j - b_j)^2}, \qquad \hat{P}(y = c \mid \mathbf{x}) = \frac{1}{k} \sum_{i \in N_k(\mathbf{x})} [\, y_i = c \,]
```

**The curse in one number:** in `$d$` dimensions, to capture 1 % of points spread evenly in a unit cube, a smaller cube must have side `$0.01^{1/d}$`: 0.1 in 2 dimensions, but 0.63 in 10 and 0.95 in 100. "Local" stops being local.

**Try it:** training points (1, 1) class A, (2, 2) class A, (4, 4) class B, (5, 4) class B, (5, 5) class B. Classify (3, 3) with k = 3. (Distances: 2.83, 1.41, 1.41, 2.24, 2.83. Nearest three: (2, 2) A, (4, 4) B, (5, 4) B. Vote: B.)
</details>

## 5. Worked example

*Made-up numbers.* A library guesses whether a new member will like a book club, using two scaled features: books read last year and average book length. For a new member at (0.4, −0.2), the 5 nearest past members are at distances 0.15, 0.22, 0.30, 0.31 and 0.45; three of them joined and liked it, two didn't. Plain vote: 3 to 2, "will like it", with a probability of 0.6. Distance-weighted vote: if the two closest (1/0.15 = 6.7 and 1/0.22 = 4.5) are the ones who liked it, along with the fourth (3.2), the weights are 14.4 for "like" against 3.3 + 2.2 = 5.5 for "not": about 0.72.

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

<div class="keypoints">

- k-NN labels a new point by a vote of its k nearest stored examples; there is no training step.
- Small k overfits (jagged borders), large k underfits (everything becomes the majority class); choose k by validation.
- Features must be scaled, or the one with the biggest numbers decides every distance.
- With many features, "nearest" loses its meaning: the curse of dimensionality.

</div>

**Try it on your own data:** the [[small-model-trainer]] runs k-NN on your CSV and shows test accuracy as you change k.

**New words:** *k-nearest neighbours*, *Euclidean distance*, *distance weighting*, *lazy learning* (no training step), *curse of dimensionality*.

---
title: Vectors and the dot product
summary: A vector is a list of numbers, such as one row of a table. The dot product multiplies two lists item by item and adds the results. It powers linear models, neurons and the attention inside language models.
minutes: 20
updated: 2026-11-22
quiz:
  - q: What is the dot product of (2, 3) and (4, −1)?
    choices: ['5', '11', '8']
    ans: 0
    why: 2 × 4 + 3 × (−1) = 8 − 3 = 5.
  - q: Two arrows are at right angles. What is their dot product?
    choices: ['1', '0', 'It depends on their lengths']
    ans: 1
    why: cos 90° = 0, so |a||b| cos θ = 0 whatever the lengths. Arrows at right angles share no direction.
  - q: 'A model is ŷ = w · x + b with w = (3, 0.5), x = (100, 20) and b = 10. What is ŷ?'
    choices: ['320', '310', '120']
    ans: 0
    why: w · x = 3 × 100 + 0.5 × 20 = 310, then add b = 10 to get 320.
sources:
  - 'Strang, G. (2016), Introduction to Linear Algebra, 5th ed., Wellesley-Cambridge Press, Chapter 1 (vectors, lengths and dot products)'
  - 'Goodfellow, I., Bengio, Y. and Courville, A. (2016), Deep Learning, MIT Press, Chapter 2 (linear algebra) https://www.deeplearningbook.org/'
  - 'Manning, C. D., Raghavan, P. and Schütze, H. (2008), Introduction to Information Retrieval, Cambridge University Press, Chapter 6 (cosine similarity)'
---

**Module 1 · about 20 minutes · read first: 1.3.** You'll be able to add and scale vectors, compute a dot product two ways, measure the length of a vector, and write a linear model in one line.

<div class="bigidea">A vector is a list of numbers; the dot product multiplies two lists item by item and adds up, giving one number that says how much they agree.</div>

## 1. Why this matters

A row of a data table is a list of numbers. Machine learning treats that list as one object, a **vector**, and the most important thing it does with vectors is the **dot product**. A linear model is a dot product plus a number. A neuron is a dot product passed through a bend. Attention in a language model is a table of dot products between words. Learn this one operation well and you hold the main tool of the whole subject.

## 2. A vector is a list of numbers

A home with floor area 95 m², 3 bedrooms and age 40 years is the vector

```math
\mathbf{x} = (95,\ 3,\ 40)
```

Each number is a **component** (or dimension), and vectors are written in bold. With 2 components you can draw a vector as an arrow from (0, 0) to the point, like directions on a map: "3 blocks east, 4 blocks north". With 3 you need a 3-D picture, and with 300 you can't draw it at all, but the arithmetic is exactly the same. That is the beauty of vectors: picture ideas in 2-D, then trust them in any number of dimensions.

Two simple operations:

- **Add** vectors component by component: `$(1, 2) + (3, 1) = (4, 3)$`. As arrows, walk the first, then the second.
- **Scale** by a number: `$2 \times (1, 2) = (2, 4)$`. The arrow keeps its direction and doubles in length.

## 3. The dot product

Multiply matching components, then add:

```math
\mathbf{a} \cdot \mathbf{b} = a_1 b_1 + a_2 b_2 + \dots + a_d b_d = \sum_{j=1}^{d} a_j b_j
```

The answer is one number, not a vector. You already do this at the shop till:

<div class="steps">
<div class="step"><b>Two lists.</b> Quantities q = (2 loaves, 3 litres of milk, 4 apples). Prices p = ($3, $2, $0.50).</div>
<div class="step"><b>Multiply matching items.</b> 2 × 3 = 6; 3 × 2 = 6; 4 × 0.50 = 2.</div>
<div class="step"><b>Add them up.</b> 6 + 6 + 2 = 14. So q · p = 14: the bill is $14.</div>
<div class="step"><b>The model view.</b> A linear model works the same way. The features are the quantities, the weights are the prices of each feature, and the prediction is the bill (plus a fixed charge, the bias).</div>
</div>

Now drag the arrows:

<!--fig:dot-product-->

## 4. What the dot product means

The same number can be found from lengths and the angle between the arrows:

```math
\mathbf{a} \cdot \mathbf{b} = \lVert \mathbf{a} \rVert \, \lVert \mathbf{b} \rVert \cos\theta
```

Here `$\lVert \mathbf{a} \rVert$` is the length of `$\mathbf{a}$` and `$\theta$` (theta) is the angle between the arrows. Since `$\cos\theta$` is 1 at 0°, 0 at 90° and −1 at 180°:

- **Large positive:** the arrows point the same way. They "agree".
- **Zero:** at right angles. They share nothing.
- **Negative:** they point apart. They "disagree".

This is why the dot product measures **similarity**. In Lesson 10.2, words become vectors, and words with similar meanings have arrows pointing the same way, so their dot product is large.

## 5. Length and the angle

By Pythagoras, the length of a vector is

```math
\lVert \mathbf{a} \rVert = \sqrt{a_1^2 + a_2^2 + \dots + a_d^2} = \sqrt{\mathbf{a} \cdot \mathbf{a}}
```

Rearranging the formula of section 4 gives the **cosine similarity**, a score from −1 to 1 that ignores length and keeps only direction:

```math
\cos\theta = \frac{\mathbf{a} \cdot \mathbf{b}}{\lVert \mathbf{a} \rVert \, \lVert \mathbf{b} \rVert}
```

<div class="myth">

**"A bigger dot product always means more alike."** Only if the lengths are equal. A huge basket and a small basket can have a big dot product just because the huge one has big numbers. Cosine similarity divides out the lengths, so a family's weekly shop and a single person's can still score close to 1 if they buy things in the same proportions.

</div>

<div class="problem" data-problem="vectors-dot-product-cosine"></div>

## 6. A linear model is a dot product

The many-input line from Lesson 1.3, `$\hat y = w_1 x_1 + w_2 x_2 + \dots + w_d x_d + b$`, is just

```math
\hat{y} = \mathbf{w} \cdot \mathbf{x} + b
```

The **weight vector** `$\mathbf{w}$` says how much each feature counts. Training finds `$\mathbf{w}$` and `$b$`. Seen as arrows, the prediction is large when the example points in the direction the weights "like".

<div class="meaning">

<dl>
<dt>x</dt><dd>The features of one example, as a list: (floor area, bedrooms, age).</dd>
<dt>w</dt><dd>The weights: how much each feature is "worth" in the prediction. A negative weight pulls the prediction down.</dd>
<dt>w · x</dt><dd>Multiply each feature by its weight and add: one number.</dd>
<dt>b</dt><dd>The bias: a fixed amount added at the end.</dd>
<dt>cos θ</dt><dd>How much two lists point the same way, from −1 (opposite) to 1 (same direction), ignoring size.</dd>
<dt>Physical meaning</dt><dd>The dot product is a weighted vote. Each feature casts a vote of its size times its importance, and the votes are added. A till adding up a bill, a judge totalling marks with different weights per round, and a neuron deciding whether to fire all do exactly this.</dd>
</dl>

</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** the dot product turns two lists into one number that measures how much they point the same way, scaled by their lengths.

**Equation:** `$\mathbf{a} \cdot \mathbf{b} = \sum_j a_j b_j = \lVert \mathbf{a} \rVert \lVert \mathbf{b} \rVert \cos\theta$`.

**Analogy:** a shopping bill. The vector of quantities (2 loaves, 3 litres of milk) dotted with the vector of prices ($3 a loaf, $2 a litre) gives the total: 2 × 3 + 3 × 2 = $12. A linear model is a bill where the weights are the prices of each feature.

**Try it:** `$\mathbf{a} = (3, 4)$`, `$\mathbf{b} = (4, 3)$`. Dot product? Lengths? Angle? (24; both 5; `$\cos\theta = 24/25 = 0.96$`, so about 16°.)
</details>

## 7. Worked example

*Made-up numbers.* A simple house-price model has weights `$\mathbf{w} = (3.1, 12, -0.9)$` for (floor area in m², bedrooms, age in years) and bias `$b = 60$`, with prices in $000. For the home `$\mathbf{x} = (95, 3, 40)$`:

```math
\hat y = 3.1 \times 95 + 12 \times 3 + (-0.9) \times 40 + 60 = 294.5 + 36 - 36 + 60 = 354.5
```

So the model predicts about $354,500. The negative weight on age says older homes sell for less, other things being equal. Computers do this for millions of rows at once by stacking rows into a matrix (Lesson 3.4).

<div class="problem" data-problem="vectors-dot-product-price"></div>

## 8. Practice

1. Compute `$(1, 2, 3) \cdot (4, 0, -1)$`.
2. What is the length of `$(6, 8)$`?
3. Two word vectors have cosine similarity 0.95, and another pair has −0.1. Which pair is more alike in meaning?

<details>
<summary>Answers</summary>

1. 4 + 0 − 3 = 1.
2. `$\sqrt{36 + 64} = 10$`.
3. The first: 0.95 means the arrows point almost the same way.
</details>

**Try it on your own data:** the [[embedding-visualiser]] places text as vectors and compares them with cosine similarity.

**New words:** *vector*, *component* or *dimension*, *dot product*, *length* or *norm*, *cosine similarity*, *weight vector*.

<div class="keypoints">

- A vector is a list of numbers, such as one row of a data table.
- Dot product: multiply matching items and add; the answer is one number.
- It also equals length × length × cos(angle), so it measures how much two vectors agree.
- Cosine similarity divides out the lengths and keeps only direction, from −1 to 1.
- A linear model is ŷ = w · x + b: a weighted vote of the features plus a fixed amount.

</div>

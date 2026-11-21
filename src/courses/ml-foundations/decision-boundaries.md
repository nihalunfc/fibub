---
title: Decision boundaries
summary: 'A classifier splits the space of inputs into regions, one per class. Logistic regression draws a straight boundary; add squared features and it can draw circles. Watch a boundary learn live, add your own points, and meet the XOR problem.'
minutes: 25
updated: 2026-11-21
quiz:
  - q: 'For logistic regression with threshold 0.5, the decision boundary is where:'
    choices: ['w·x + b = 0', 'w·x + b = 0.5', 'x = 0']
    ans: 0
    why: p = 0.5 exactly when the score z = w·x + b is 0, because σ(0) = 0.5.
  - q: Why can't plain logistic regression solve the XOR pattern (opposite corners share a class)?
    choices: ['Too little data', 'No single straight line separates the two classes', 'The learning rate is wrong']
    ans: 1
    why: Any straight line leaves at least one corner on the wrong side. You need a curved boundary, new features, or a different model.
  - q: 'Adding the feature x₁·x₂ to logistic regression lets it:'
    choices: ['Draw boundaries that curve, such as the ones XOR needs', 'Train faster', 'Use fewer weights']
    ans: 0
    why: The model stays linear in its weights, but in terms of x₁ and x₂ the boundary w₁x₁ + w₂x₂ + w₃x₁x₂ + b = 0 is a curve.
---

**Module 4 · about 25 minutes · read first: 4.2, 4.3.** You'll be able to find a logistic regression's decision boundary, explain when a straight boundary is not enough, and fix it with features.

## 1. Why this matters

Pictures of decision boundaries are the quickest way to understand what a classifier can and can't do. Every classifier in this course, from k-nearest neighbours to neural networks, can be compared by the shapes of boundary it is able to draw. It is also how the "AI winter" of the 1970s began: a single neuron couldn't learn XOR (Lesson 9.1).

## 2. Where the boundary is

Logistic regression predicts class 1 when `$p \ge 0.5$`, that is when `$z = \mathbf{w} \cdot \mathbf{x} + b \ge 0$`. The boundary is the set of points where `$z = 0$`:

```math
w_1 x_1 + w_2 x_2 + b = 0 \quad\Longleftrightarrow\quad x_2 = -\frac{w_1}{w_2}\,x_1 - \frac{b}{w_2}
```

That is a straight line (a flat plane with three inputs, a hyperplane with more). The weight vector `$\mathbf{w}$` points across the line, towards class 1; its length sets how quickly the probability changes as you cross. Moving away from the line, the model gets surer.

## 3. Watch it learn

<!--fig:boundary-->

Try:

- **Two groups:** a straight boundary settles between them within a few hundred steps.
- **Add a few circles deep in the square region** (tap with "a circle" selected): the boundary tilts to compromise. One straight line can't please everyone.
- **One group inside a ring:** no straight line works, and the model stays unsure (pale shading, accuracy near 50 %). Switch on the squared features and it draws an ellipse round the inner group.
- **Four corners (XOR):** also impossible for a line. The product feature `$x_1 x_2$` is exactly what it needs, because `$x_1 x_2$` is positive in two opposite corners and negative in the other two.

## 4. Linear in what?

The model with squared features is

```math
z = w_1 x_1 + w_2 x_2 + w_3 x_1^2 + w_4 x_2^2 + w_5 x_1 x_2 + b
```

It is still logistic regression, trained in the same way, and still linear in its weights. In the five-dimensional space of the new features, the boundary is a flat hyperplane. Seen back in the original two dimensions, it is a curve. This idea, "map the data into a space where a straight boundary works", is the heart of kernel methods and, in a learned form, of neural networks: their hidden layers learn the new features by themselves (Lesson 9.3).

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a linear classifier's boundary is the hyperplane `$\mathbf{w}\cdot\mathbf{x} + b = 0$`. Data that some hyperplane splits perfectly is called **linearly separable**.

**Distance from the boundary:** for a point `$\mathbf{x}$`, the signed distance to the boundary is

```math
d(\mathbf{x}) = \frac{\mathbf{w} \cdot \mathbf{x} + b}{\lVert \mathbf{w} \rVert}
```

so the score `$z$` is distance times `$\lVert \mathbf{w} \rVert$`. A larger `$\lVert \mathbf{w} \rVert$` makes the probability climb faster with distance: a steeper S across the line.

**Analogy:** a fence across a field. Plain logistic regression can only build straight fences. Feature tricks let it build curved fences by first redrawing the map.

**Try it:** `$w = (2, -1)$`, `$b = 1$`. Which class for the point (1, 1)? For (−1, 1)? (`$z = 2 - 1 + 1 = 2 > 0$`: class 1. `$z = -2 - 1 + 1 = -2 < 0$`: class 0.)
</details>

## 5. Worked example

*Made-up numbers.* A loan model uses income `$x_1$` and existing debt `$x_2$`, both standardised, to predict repayment: `$z = 1.8 x_1 - 2.4 x_2 + 0.6$`.

- Boundary: `$x_2 = 0.75 x_1 + 0.25$`. Above that line (more debt for the income), the model predicts default.
- An applicant at average income and average debt (`$x_1 = x_2 = 0$`): `$z = 0.6$`, `$p = \sigma(0.6) \approx 0.65$` of repaying. On the "repays" side, but not by much.
- The ratio of the weights, 1.8 / 2.4 = 0.75, says one standard deviation more debt is offset by 1.33 standard deviations more income.

## 6. Practice

1. Find the boundary of `$z = x_1 + x_2 - 1$` and say which side is class 1.
2. Which data in the simulation is linearly separable?
3. Why does the model stay pale (unsure) on the ring data with plain features?

<details>
<summary>Answers</summary>

1. The line `$x_1 + x_2 = 1$`; class 1 is above and to the right, where `$x_1 + x_2 > 1$`.
2. The two groups (apart from the odd overlapping point).
3. No straight line helps, so the best it can do is keep `$\mathbf{w}$` near zero and predict about the base rate everywhere.
</details>

**Try it on your own data:** the [[small-model-trainer]] trains logistic regression on your own CSV; add a product of two columns as an extra column to give it a curved boundary.

**New words:** *decision boundary*, *hyperplane*, *linearly separable*, *XOR problem*, *feature map*.

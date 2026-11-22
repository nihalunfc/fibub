---
title: Decision boundaries
summary: 'A classifier splits the space of inputs into regions, one per class. Logistic regression draws a straight boundary; add squared features and it can draw circles. Watch a boundary learn live, add your own points, and meet the XOR problem.'
minutes: 25
updated: 2026-11-22
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
sources:
  - 'James, Witten, Hastie and Tibshirani (2021), An Introduction to Statistical Learning, 2nd edition, Springer, Chapters 4 and 9 https://www.statlearning.com/'
  - 'Hastie, Tibshirani and Friedman (2009), The Elements of Statistical Learning, 2nd edition, Springer, Section 4.4 (Logistic regression) and 4.5 (Separating hyperplanes)'
  - 'Minsky and Papert (1969), Perceptrons: An Introduction to Computational Geometry, MIT Press (the XOR limit of a single layer)'
---

**Module 4 · about 25 minutes · read first: 4.2, 4.3.** You'll be able to find a logistic regression's decision boundary, explain when a straight boundary is not enough, and fix it with features.

<div class="bigidea">Every classifier draws a border across the map of its inputs; what a model can learn is exactly the shapes of border it is able to draw.</div>

## 1. Why this matters

A picture of the **decision boundary** (the border between the regions where a model says "yes" and "no") is the quickest way to see what a classifier can and can't do. Every classifier in this course, from k-nearest neighbours to neural networks, can be compared by the border shapes it can draw. It is also how the "AI winter" of the 1970s began: a single neuron couldn't learn a simple pattern called XOR (Lesson 9.1).

## 2. Where the boundary is

Logistic regression predicts class 1 when `$p \ge 0.5$`. Because `$\sigma(0) = 0.5$`, that is the same as the score `$z = \mathbf{w} \cdot \mathbf{x} + b \ge 0$`. So the boundary is the set of points where the score is exactly zero:

```math
w_1 x_1 + w_2 x_2 + b = 0 \quad\Longleftrightarrow\quad x_2 = -\frac{w_1}{w_2}\,x_1 - \frac{b}{w_2}
```

With two inputs that is a straight line. With three it is a flat sheet (a plane), and with more a **hyperplane**, the same idea in more dimensions. The weight vector `$\mathbf{w}$` points straight across the line, towards class 1. The farther a point is from the line, the surer the model is.

<div class="steps" data-fig="decision-boundaries-line">
<div class="step"><p><b>The model.</b> A loan model uses income x₁ and debt x₂ (both standardised: 0 is average). Its score is z = 1.8x₁ − 2.4x₂ + 0.6.</p></div>
<div class="step"><p><b>Find the border.</b> Set z = 0 and solve for debt: x₂ = 0.75x₁ + 0.25. That straight line is the decision boundary.</p></div>
<div class="step"><p><b>Pick a side.</b> Below the line (less debt for the income) z is positive: "repays". Above it, "defaults".</p></div>
<div class="step"><p><b>Test an applicant.</b> Average income and average debt, (0, 0): z = 0.6, p = σ(0.6) ≈ 0.65. Just on the "repays" side.</p></div>
<div class="step"><p><b>Farther means surer.</b> An applicant at (1, −1) gets z = 1.8 + 2.4 + 0.6 = 4.8, p ≈ 0.99. Deep inside the "repays" region.</p></div>
</div>

<div class="meaning">

<dl>
<dt>w·x + b = 0</dt><dd>The decision boundary: every point where the model is exactly 50/50.</dd>
<dt>w</dt><dd>The weights. Together they form an arrow pointing across the boundary towards class 1.</dd>
<dt>‖w‖</dt><dd>The length of that arrow: how quickly the probability changes as you cross the line.</dd>
<dt>Physical meaning</dt><dd>A fence across a field. Plain logistic regression can only build straight fences. Feature tricks let it build curved fences by first redrawing the map.</dd>
</dl>

</div>

<div class="problem" data-problem="decision-boundaries-debt"></div>

## 3. Watch it learn

<!--fig:boundary-->

Try:

- **Two groups:** a straight boundary settles between them within a few hundred steps.
- **Add a few circles deep in the square region** (tap with "a circle" selected): the boundary tilts to compromise. One straight line can't please everyone.
- **One group inside a ring:** no straight line works, and the model stays unsure (pale shading, accuracy near 50 %). Switch on the squared features and it draws an oval round the inner group.
- **Four corners (XOR):** also impossible for a line. The product feature `$x_1 x_2$` is exactly what it needs, because `$x_1 x_2$` is positive in two opposite corners and negative in the other two.

## 4. Straight in what?

The model with squared features is

```math
z = w_1 x_1 + w_2 x_2 + w_3 x_1^2 + w_4 x_2^2 + w_5 x_1 x_2 + b
```

It is still logistic regression, trained the same way, and still a straight-line sum of its weights. In the five-dimensional space of the new features, the boundary is a flat hyperplane. Seen back in the original two dimensions, it is a curve. Picture drawing on a sheet of paper, then bending the paper: a straight line on the bent sheet can look curved from above. This idea, "remap the data so a straight boundary works", is the heart of kernel methods and, in a learned form, of neural networks, whose hidden layers find the new features by themselves (Lesson 9.3).

<div class="myth">

**"Logistic regression can only ever draw straight lines, so it is useless for curved patterns."** It draws straight lines in whatever features you give it. Give it squares and products of the inputs and its boundary in the original inputs becomes a circle, an oval or a saddle. What is fixed is that the score is a weighted sum; what the sum is made of is up to you.

</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a linear classifier's boundary is the hyperplane `$\mathbf{w}\cdot\mathbf{x} + b = 0$`. Data that some hyperplane splits perfectly is called **linearly separable**.

**Distance from the boundary:** for a point `$\mathbf{x}$`, the signed distance to the boundary is

```math
d(\mathbf{x}) = \frac{\mathbf{w} \cdot \mathbf{x} + b}{\lVert \mathbf{w} \rVert}
```

so the score `$z$` is distance times `$\lVert \mathbf{w} \rVert$`. A longer `$\mathbf{w}$` makes the probability climb faster with distance: a steeper S across the line.

**Try it:** `$w = (2, -1)$`, `$b = 1$`. Which class for the point (1, 1)? For (−1, 1)? (`$z = 2 - 1 + 1 = 2 > 0$`: class 1. `$z = -2 - 1 + 1 = -2 < 0$`: class 0.)
</details>

## 5. Worked example

*Made-up numbers.* A loan model uses income `$x_1$` and existing debt `$x_2$`, both standardised, to predict repayment: `$z = 1.8 x_1 - 2.4 x_2 + 0.6$`.

- Boundary: `$x_2 = 0.75 x_1 + 0.25$`. Above that line (more debt for the income), the model predicts default.
- An applicant at average income and average debt (`$x_1 = x_2 = 0$`): `$z = 0.6$`, `$p = \sigma(0.6) \approx 0.65$` of repaying. On the "repays" side, but not by much.
- The ratio of the weights, 1.8 / 2.4 = 0.75, says one standard deviation more debt is balanced by 1.33 standard deviations more income.

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

<div class="keypoints">

- The decision boundary is where the model is exactly 50/50; for logistic regression that is w·x + b = 0.
- With plain inputs the boundary is a straight line (a hyperplane in more dimensions).
- Data a straight line can split perfectly is called linearly separable; XOR and rings are not.
- Adding squares and products of inputs lets the same model draw curved boundaries.

</div>

**Try it on your own data:** the [[small-model-trainer]] trains logistic regression on your own CSV; add a product of two columns as an extra column to give it a curved boundary.

**New words:** *decision boundary*, *hyperplane*, *linearly separable*, *XOR problem*, *feature map*.

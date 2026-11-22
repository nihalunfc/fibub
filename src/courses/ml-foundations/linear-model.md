---
title: What a linear model is
summary: 'A linear model predicts by adding up each input times its weight, plus a bias. See it as a picture, fit one by hand with two sliders, and learn why such a simple model is still used everywhere.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: 'A model is ŷ = 4x₁ − 2x₂ + 10. What does it predict for x₁ = 3, x₂ = 5?'
    choices: ['12', '32', '2']
    ans: 0
    why: 4 × 3 − 2 × 5 + 10 = 12 − 10 + 10 = 12.
  - q: In a price model, the weight on "distance to the station (km)" is −8 ($000 per km). What does it mean?
    choices: ['Each km closer to the station adds about $8,000, other things equal', 'Homes 8 km away are free', 'Distance does not matter']
    ans: 0
    why: A negative weight lowers the prediction as the input grows. Each extra km takes off about $8,000, so each km closer adds it back.
  - q: 'Which is NOT a linear model?'
    choices: ['ŷ = 3x + 2', 'ŷ = 2x₁ + 5x₂ − 1', 'ŷ = x₁ × x₂ with no weights to learn, chosen by hand']
    ans: 2
    why: The first two are weighted sums with learnable weights. The third is a fixed product with nothing to learn. (A model with a weighted x₁x₂ column is still linear in its weights, as Lesson 3.6 shows.)
sources:
  - 'James, G., Witten, D., Hastie, T., Tibshirani, R. and Taylor, J. (2023), An Introduction to Statistical Learning with Applications in Python, Springer, Chapter 3 (linear regression) https://www.statlearning.com/'
  - 'Hastie, T., Tibshirani, R. and Friedman, J. (2009), The Elements of Statistical Learning, 2nd ed., Springer, Chapter 3 (linear methods for regression) https://hastie.su.domains/ElemStatLearn/'
  - 'scikit-learn user guide: Linear models https://scikit-learn.org/stable/modules/linear_model.html'
---

**Module 3 · about 20 minutes · read first: 1.3, 1.4.** You'll be able to write down a linear model, explain what each weight means, fit one by hand, and say when a linear model is a good first choice.

<div class="bigidea">A linear model predicts with a recipe: start from a base amount, then add a fixed amount for each unit of each input.</div>

## 1. Why this matters

Linear regression is the oldest and most used model in data work. Banks use it for risk scores, economists to estimate effects, shops to forecast sales and scientists to fit calibration lines. It is fast, easy to explain and hard to break. It is also the building block of everything later in this course: logistic regression adds an S-curve on top, and a neural network stacks thousands of these sums.

Think of a taxi meter: a starting charge, plus so much per kilometre, plus so much per minute waiting. Each part adds on by itself. That is a linear model.

## 2. The model

With one input, the model is the straight line of Lesson 1.3:

```math
\hat{y} = w x + b
```

With `$d$` inputs, each gets its own weight:

```math
\hat{y} = w_1 x_1 + w_2 x_2 + \dots + w_d x_d + b = \mathbf{w} \cdot \mathbf{x} + b
```

<!--fig:linear-anatomy-->

"Linear" means the prediction is a **weighted sum**: doubling an input's change doubles its effect, and the effects of different inputs simply add up. One input gives a line, two give a flat plane (Lesson 3.4), and more give a flat "hyperplane" that we can't draw but can compute just the same.

## 3. Reading the weights

Each weight answers: "if this input goes up by 1, and the others stay the same, how much does the prediction change?"

- **Sign:** positive weights push the prediction up, negative ones pull it down.
- **Size:** depends on the units. A weight of 3.1 per m² and 12 per bedroom can't be compared directly, because a bedroom is a much bigger step than a square metre. Standardise the inputs first (Lesson 2.4) and the weights become comparable: each is then "per standard deviation".
- **"Other things equal":** a weight is the effect with the other inputs held still. If two inputs move together (size and bedrooms), the model splits the credit between them, sometimes strangely.

The **bias** `$b$` is the prediction when every input is 0. It often has no real-world meaning; it just puts the line at the right height.

<div class="myth">

**"The biggest weight is the most important feature."** Only if the features are in the same units. A weight of 3.1 per square metre and 12 per bedroom can't be compared: a bedroom is a much bigger step than a square metre. Standardise the inputs first, and then each weight means "per standard deviation", which can be compared fairly.

</div>

## 4. Fit one yourself

<!--fig:fit-by-hand-->

You'll find it is hard to get both sliders right: changing the slope moves the best intercept too. Lessons 3.2 and 3.3 show two ways a computer finds the best pair exactly: a formula, and walking downhill.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a linear model predicts with a weighted sum of the inputs plus a bias. Training picks the weights that make the **mean squared error** (MSE) on the training data smallest.

**Equations:**

```math
\hat{y}_i = \mathbf{w} \cdot \mathbf{x}_i + b, \qquad \text{MSE}(\mathbf{w}, b) = \frac{1}{n} \sum_{i=1}^{n} \left( y_i - \hat{y}_i \right)^2
```

The gap `$y_i - \hat{y}_i$` is the **residual** (or error) for example `$i$`.

**Analogy:** a recipe for a price. Start with a base (the bias), add so much per square metre, so much per bedroom, take off so much per year of age.

**Try it:** with `$\hat y = 2x + 1$` and data (1, 4), (2, 4), (3, 8), find the MSE. (Predictions 3, 5, 7; residuals 1, −1, 1; squares 1, 1, 1; MSE = 1.)
</details>

<div class="meaning">

<dl>
<dt>ŷ</dt><dd>The prediction: the model's guess for one example.</dd>
<dt>wⱼ</dt><dd>The weight of input j: how much the prediction changes when that input goes up by 1 and the others stay the same.</dd>
<dt>b</dt><dd>The bias: the prediction when every input is 0, the base of the recipe.</dd>
<dt>y − ŷ</dt><dd>The residual: how far the true value is from the prediction.</dd>
<dt>MSE</dt><dd>The average of the squared residuals: one number for how wrong the model is overall.</dd>
<dt>Physical meaning</dt><dd>A linear model is a price list. The shop says: $1,150 for an ordinary weekday, plus $3.20 for every dollar spent on ads, plus $410 if it's a weekend. Anyone can read it, check it and argue with it, which is exactly why banks and governments still love it.</dd>
</dl>

</div>

## 5. When a linear model is a good choice

- **As a first model, almost always.** It sets a baseline that fancier models must beat.
- **When you need to explain the result**: each weight is a plain statement about one input.
- **With little data:** few parameters, so it is hard to overfit.
- **When the relationship is roughly straight**, or can be made so with extra columns (squares, logs, Lesson 3.6).

It struggles when effects interact (a garden adds more value to a family home than to a studio flat) or curve strongly, unless you add those columns yourself. Trees and networks find such patterns on their own.

## 6. Worked example

*Made-up numbers.* An online shop models daily sales (in $) from two inputs: the ad spend that day `$x_1$` (in $) and whether it is a weekend `$x_2$` (1 or 0). The fitted model is

```math
\widehat{\text{sales}} = 3.2\,x_1 + 410\,x_2 + 1150
```

- A weekday with no ads: 1,150 dollars. That is the bias.
- Each extra dollar of ads goes with $3.20 more sales, weekday or weekend.
- A weekend adds $410 whatever the ad spend.
- A Saturday with $200 of ads: 3.2 × 200 + 410 + 1150 = **$2,200**.

Here is that Saturday prediction built up one piece at a time:

<div class="steps">
<div class="step"><b>Start from the bias.</b> With no ads on a weekday, the model predicts $1,150.</div>
<div class="step"><b>Add the ads.</b> $200 of ads × 3.2 = $640. Running total: $1,790.</div>
<div class="step"><b>Add the weekend.</b> Saturday sets weekend = 1, so add 410 × 1 = $410. Running total: $2,200.</div>
<div class="step"><b>The prediction.</b> ŷ = $2,200. Each input added its own piece; none changed the size of another's. That is what "linear" means, and also its limit.</div>
</div>

<div class="problem" data-problem="linear-model-predict"></div>

The model can't say that ads work *better* at weekends, because each input's effect simply adds on. To allow that, add the column `$x_1 \times x_2$` with its own weight, an **interaction** term.

## 7. Practice

1. `$\hat y = 0.5x_1 + 2x_2 - 3$`. Predict for `$x_1 = 10$`, `$x_2 = 4$`.
2. Why are the raw weights of "income in dollars" and "age in years" not comparable?
3. Name one thing a linear model with only `$x_1$` and `$x_2$` cannot capture.

<details>
<summary>Answers</summary>

1. 5 + 8 − 3 = 10.
2. They are in different units: one dollar and one year are very different steps. Standardise the inputs to compare them.
3. A curve, or an interaction (one input's effect depending on the other), unless you add columns for them.
</details>

**Try it on your own data:** the [[regression-workbench]] fits linear models to your CSV and lists each weight with its uncertainty.

**New words:** *linear model*, *weighted sum*, *weight*, *bias*, *residual*, *mean squared error*, *interaction term*.

<div class="keypoints">

- A linear model predicts with a weighted sum of the inputs plus a bias: ŷ = w · x + b.
- Each weight is the change in the prediction for a one-unit rise in that input, with the others held still.
- Compare weights only after standardising the inputs.
- Training picks the weights with the smallest mean squared error; a linear model is the baseline every fancier model must beat.
- Curves and interactions need extra columns (squares, products) or a more flexible model.

</div>

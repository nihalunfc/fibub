---
title: Overfitting and underfitting
summary: 'A model can be too simple to catch the pattern, or so flexible it learns the noise. Watch training and test error as a polynomial gets more flexible, find the sweet spot, and learn the five main cures for overfitting.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: Training error 2 %, test error 25 %. What is most likely?
    choices: ['Underfitting', 'Overfitting', 'A perfect model']
    ans: 1
    why: A big gap between a very low training error and a high test error is the signature of overfitting.
  - q: Training error 30 %, test error 31 %, and a simple baseline gets 32 %. What is most likely?
    choices: ['Underfitting: the model is too simple (or the features too weak)', 'Overfitting', 'Data leakage']
    ans: 0
    why: Both errors are high and close together, barely better than the baseline. The model can't capture the pattern.
  - q: Which of these does NOT help against overfitting?
    choices: ['More training data', 'A simpler model or a penalty', 'Making the model more flexible']
    ans: 2
    why: More flexibility makes overfitting worse. More data, simpler models, penalties and early stopping all help.
sources:
  - 'James, G., Witten, D., Hastie, T., Tibshirani, R. and Taylor, J. (2023), An Introduction to Statistical Learning with Applications in Python, Springer, Sections 2.2.1 to 2.2.2 (the bias-variance trade-off) https://www.statlearning.com/'
  - 'Hastie, T., Tibshirani, R. and Friedman, J. (2009), The Elements of Statistical Learning, 2nd ed., Springer, Chapter 7 (model assessment and selection) https://hastie.su.domains/ElemStatLearn/'
  - 'Geman, S., Bienenstock, E. and Doursat, R. (1992), Neural Networks and the Bias/Variance Dilemma, Neural Computation 4(1), 1-58'
---

**Module 3 · about 25 minutes · read first: 2.5, 3.6.** You'll be able to recognise underfitting and overfitting from training and test errors, explain why test error is U-shaped, and choose a cure.

<div class="bigidea">A model that fits its training data too closely learns the noise as well as the pattern, and does worse on new data: the art is to stop at the sweet spot.</div>

## 1. Why this matters

Overfitting is the central problem of machine learning. A model is useful only for data it hasn't seen, yet it learns only from data it has. Every model in the rest of this course has a "flexibility dial" (the degree of a polynomial, the depth of a tree, the number of trees, the size of a network) and every one can be turned too far. Learning to spot it, and to stop before it, is what separates a working model from an impressive-looking broken one.

## 2. Two ways to fail

- **Underfitting:** the model is too simple to follow the real pattern. A straight line through a curve. Training and test errors are both high.
- **Overfitting:** the model is so flexible it fits the noise, the random wiggles of this particular sample. Training error is very low; test error is high. The model has memorised instead of learned.

Think of a student preparing for an exam. One reads only the chapter titles (underfitting) and can't answer anything. Another memorises last year's paper word for word, typos included (overfitting), and is lost when the questions change. The one who learns the ideas does best on the real exam.

Between them is a **sweet spot** where the test error is lowest.

<!--fig:overfit-curve-->

The two curves on the right are the most important chart in machine learning. Training error falls for ever as flexibility grows: more freedom always fits the training rows better. Test error falls at first (the model catches the real curve) and then rises (it starts chasing noise).

Here is the U-shape in numbers, for 14 noisy points fitted with polynomials of rising degree:

<div class="steps">
<div class="step"><b>Degree 1 (a straight line).</b> Training error 9.0, test error 9.5. Both high and close together: the line is too stiff for the curve. Underfitting.</div>
<div class="step"><b>Degree 3.</b> Training error 2.1, test error 2.6. Both low: the model follows the real curve. The sweet spot.</div>
<div class="step"><b>Degree 8.</b> Training error 1.2, test error 4.8. Training still improves, but test error is climbing: the extra bends are fitting noise.</div>
<div class="step"><b>Degree 13.</b> Training error 0: the curve threads all 14 points. Test error 40: wild swings between them. The model has memorised, not learned.</div>
<div class="step"><b>The rule.</b> Choose the flexibility with the lowest validation error, never the lowest training error. (The numbers are illustrative; the simulation above shows the same shape.)</div>
</div>

Try it: press Play to see a new random set of neurons switched off at every step, raise the drop chance, then flip to Predicting.

<figure class="fig" data-fig="@ai-dropout"><figcaption>Dropout trains many thinned networks that share weights. No neuron can be relied on, so none can memorise one training example alone. At prediction time all neurons are on, which acts like averaging the thinned networks.</figcaption></figure>

## 3. Why it happens

The training data is the true pattern **plus noise**. A flexible model can't tell the two apart, and given enough freedom it fits both. The noise is different in every sample, so the noise-fitting parts are pure error on new data.

Overfitting gets worse with:

- **More flexibility:** more parameters, more features, deeper trees.
- **Less data:** 14 points can be threaded by a degree-13 polynomial exactly; 14,000 cannot.
- **More noise** in the labels.

Try it: pick the line, then degree 9, and slide the number of examples. Watch training and test error meet or stay apart.

<figure class="fig" data-fig="@ai-learning-curves"><figcaption>A line is too simple (both errors stay high: more data will not help). A flexible model has a big gap that shrinks as data grows (more data helps). No model gets below the noise floor.</figcaption></figure>

## 4. Cures

1. **Get more data.** The most reliable cure. Noise averages out; the pattern doesn't.
2. **Use a simpler model**, or turn its dial down (lower degree, shallower tree).
3. **Add a penalty** for complexity: regularisation (Lesson 3.8).
4. **Stop early:** when training by gradient descent, stop when the validation error starts rising (Lesson 9.5).
5. **Average many models**: random forests (Lesson 6.3) average away much of the noise-fitting.

And for underfitting: a more flexible model, better features (Lesson 3.6), or less penalty.

<div class="myth">

**"My model is 100 % right on the training data, so it's excellent."** That is usually a warning sign, not a triumph. A flexible enough model can memorise any training set, noise and all. Only the score on rows the model has never seen tells you whether it learned something real. A big gap between training and test scores is the signature of overfitting.

</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** the expected error on new data splits into three parts.

**Equation:** for squared error, at a given input,

```math
\mathbb{E}\big[(y - \hat{y})^2\big] = \underbrace{\big(\text{bias}\big)^2}_{\text{too simple}} + \underbrace{\text{variance}}_{\text{too jumpy}} + \underbrace{\sigma^2}_{\text{noise}}
```

- **Bias** is how far the *average* fitted model (over many possible training sets) is from the truth. Simple models have high bias.
- **Variance** is how much the fitted model changes from one training set to another. Flexible models have high variance.
- **Noise** `$\sigma^2$` can't be removed by any model.

Turning up flexibility lowers bias and raises variance; the test error is lowest where their sum is smallest. Lesson 7.1 shows this with a dartboard.

**Analogy:** a tailor. Off-the-peg sizes (underfitting) fit nobody well. A suit cut to every crease of the clothes you wore that day (overfitting) won't fit tomorrow. A good tailor fits the body, not the creases.

**Try it:** with 10 training points, what degree of polynomial can pass through all of them exactly? (Degree 9: 10 weights for 10 points. Its training error is 0, and almost certainly it overfits.)
</details>

<div class="meaning">

<dl>
<dt>Bias²</dt><dd>How far the model's average guess is from the truth: the error from being too simple.</dd>
<dt>Variance</dt><dd>How much the fitted model jumps around when trained on a different sample: the error from being too jumpy.</dd>
<dt>σ² (noise)</dt><dd>Randomness in the labels themselves, which no model can predict.</dd>
<dt>Sweet spot</dt><dd>The flexibility where bias² + variance is smallest, so the test error is lowest.</dd>
<dt>Physical meaning</dt><dd>A tailor. Off-the-peg sizes (high bias) fit nobody well. A suit cut to every crease of the clothes you happened to wear today (high variance) won't fit tomorrow. A good tailor fits the body, not the creases, and the creases are the noise.</dd>
</dl>

</div>

<div class="problem" data-problem="overfitting-decompose"></div>

## 5. Worked example

*Made-up numbers.* A team predicts monthly energy use of 300 office buildings from 40 features. Results:

| Model | Training RMSE | Validation RMSE |
|---|---|---|
| Mean of all buildings (baseline) | 48 | 49 |
| Linear regression, 5 features | 31 | 32 |
| Linear regression, all 40 features | 24 | 29 |
| Degree-2 polynomial, all features (861 columns) | 3 | 71 |

The 5-feature model underfits a little (training and validation close but high). The 40-feature model is the best on validation. The polynomial model, with more columns than buildings, memorises: training error nearly zero, validation error worse than the baseline. The team keeps the 40-feature model and tries a penalty to see if it can do better still.

## 6. Practice

1. A tree of depth 20 has training accuracy 100 % and test accuracy 71 %; depth 5 gives 86 % and 84 %. Which do you choose, and why?
2. You can't collect more data. Name two other cures for overfitting.
3. Why does training error keep falling as flexibility grows, even past the sweet spot?

<details>
<summary>Answers</summary>

1. Depth 5: its test accuracy is higher, and its small train-test gap shows it hasn't memorised.
2. A simpler model, a penalty (regularisation), early stopping, or averaging many models.
3. A more flexible model can do everything a less flexible one can, and more, so on the rows it is fitted to it can only do as well or better.
</details>

**Try it on your own data:** the [[small-model-trainer]] shows training and test scores side by side as you change a tree's depth or k in k-nearest neighbours.

**New words:** *underfitting*, *overfitting*, *sweet spot*, *noise*, *bias* and *variance*, *early stopping*.

<div class="keypoints">

- Underfitting: too simple, both errors high. Overfitting: too flexible, training error low but test error high.
- Training error always falls as flexibility grows; test error falls then rises in a U.
- Expected test error = bias² + variance + noise; flexibility trades bias for variance.
- Cures for overfitting: more data, a simpler model, a penalty, early stopping, or averaging many models.

</div>

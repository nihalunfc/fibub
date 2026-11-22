---
title: 'Boosting: each model fixes the last one''s mistakes'
seoTitle: 'Boosting explained: AdaBoost and the idea behind it'
summary: 'Bagging trains models side by side; boosting trains them one after another, each paying most attention to what the others got wrong. Follow AdaBoost through one round by hand and compare the two ideas.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: 'The main difference between bagging and boosting is:'
    choices: ['Boosting trains models in sequence, each focusing on the previous ones'' mistakes', 'Boosting uses bigger trees', 'Bagging cannot use trees']
    ans: 0
    why: Bagging's models are independent and can be trained in parallel; boosting's form a chain.
  - q: 'In AdaBoost, after a round, the weights of the rows the model got wrong:'
    choices: ['Go up', 'Go down', 'Stay the same']
    ans: 0
    why: The next model then pays more attention to the hard rows.
  - q: 'Boosting mainly reduces:'
    choices: ['Bias: many weak, simple models add up to a flexible one', 'Only variance', 'Training time']
    ans: 0
    why: Each weak learner (say a stump) is too simple alone; adding them step by step builds a complex model. Bagging, by contrast, mainly cuts variance.
sources:
  - 'Freund and Schapire (1997), A decision-theoretic generalization of on-line learning and an application to boosting, Journal of Computer and System Sciences 55(1), 119-139 https://doi.org/10.1006/jcss.1997.1504'
  - 'Friedman, Hastie and Tibshirani (2000), Additive logistic regression: a statistical view of boosting, The Annals of Statistics 28(2), 337-407 https://doi.org/10.1214/aos/1016218223'
  - 'Hastie, Tibshirani and Friedman (2009), The Elements of Statistical Learning, 2nd edition, Springer, Chapter 10 (Boosting and additive trees)'
---

**Module 6 · about 25 minutes · read first: 6.2.** You'll be able to explain how boosting differs from bagging, follow one round of AdaBoost by hand, and say why boosting can overfit if run too long.

<div class="bigidea">Boosting builds a strong model from a chain of weak ones, where each new model studies hardest the cases the earlier ones got wrong.</div>

## 1. Why this matters

Boosting turned a theory question ("can many weak learners make a strong one?", Kearns and Valiant, 1988) into some of the most accurate models in use. AdaBoost (Freund and Schapire, 1995) powered the first real-time face detectors in cameras; its descendant, gradient boosting (Lesson 6.6), runs much of the world's credit scoring, ranking and demand forecasting.

## 2. A chain of weak learners

A **weak learner** is a model only a little better than guessing, such as a **stump**: a tree with a single question. Boosting builds a strong model from many of them:

1. Train a weak learner on the data.
2. Find where it is wrong.
3. Train the next weak learner to do better exactly there.
4. Repeat for hundreds of rounds, and combine them all in a weighted vote (or sum).

<!--fig:bag-vs-boost-->

Bagging and boosting attack different errors. Bagging averages strong, overfitting models side by side to cut **variance** (wobble). Boosting adds up weak, underfitting models one after another to cut **bias** (being too simple). Adding models to bagging can't hurt much; boosting, run too long, starts fitting noise, so the number of rounds must be chosen with validation data.

## 3. AdaBoost

AdaBoost ("adaptive boosting") gives every training row a **weight**, starting equal. A weight is how much that row counts when the next stump is scored.

1. Train a stump that makes the **weighted** error `$\varepsilon$` (epsilon) as small as possible: rows with big weights count more.
2. Give the stump a say `$\alpha = \tfrac12 \ln \frac{1 - \varepsilon}{\varepsilon}$` (alpha): big when its error is small, zero at 50 %.
3. Multiply the weights of the rows it got wrong by `$e^{\alpha}$` and of those it got right by `$e^{-\alpha}$`, then rescale so the weights add to 1.
4. Repeat. The final classifier takes the sign of the weighted vote `$\sum_t \alpha_t h_t(\mathbf{x})$`, with each stump answering +1 or −1.

<div class="steps">
<div class="step"><p><b>Ten rows, equal weights</b> of 0.1 each. Stump 1 gets 3 of them wrong, so its weighted error ε = 0.3.</p></div>
<div class="step"><p><b>Its say.</b> α = ½ ln(0.7 ÷ 0.3) = 0.424. A decent stump earns a decent vote.</p></div>
<div class="step"><p><b>Reweight.</b> The 3 mistakes: 0.1 × e<sup>0.424</sup> = 0.153 each. The 7 right ones: 0.1 × e<sup>−0.424</sup> = 0.065 each.</p></div>
<div class="step"><p><b>Rescale to add up to 1.</b> The total is 0.917, so the mistakes become 0.167 each and the others 0.071. The 3 hard rows now hold half of all the weight.</p></div>
<div class="step"><p><b>Next round.</b> Stump 2 is trained on these weights, so getting those three rows right is now worth as much as all the other seven together.</p></div>
</div>

<div class="meaning">

<dl>
<dt>w<sub>i</sub></dt><dd>The weight of row i: how much it counts when the next stump is scored.</dd>
<dt>ε</dt><dd>The stump's weighted error: the total weight of the rows it gets wrong.</dd>
<dt>α = ½ ln((1 − ε)/ε)</dt><dd>The stump's say in the final vote: 0 for a coin-flip stump, large for an accurate one.</dd>
<dt>F(x) = Σ α<sub>t</sub> h<sub>t</sub>(x)</dt><dd>The final model: a weighted sum of all the stumps' ±1 answers. Its sign is the prediction.</dd>
<dt>Physical meaning</dt><dd>A student revising for an exam who keeps a pile of the questions they got wrong and practises those more each day. Each day's practice is narrow, but over weeks the gaps close.</dd>
</dl>

</div>

<div class="problem" data-problem="boosting-alpha"></div>

Rows that keep being misclassified get heavier and heavier, so later stumps concentrate on them. That is also AdaBoost's weakness.

<div class="myth">

**"Boosting focuses on hard cases, so it is great on messy data."** A row with a wrong label is "hard" for ever: no honest model can get it right, so its weight keeps growing and later stumps bend themselves to fit it. On noisy data AdaBoost can overfit badly. Gradient boosting with a gentler loss (Lesson 6.6), a small learning rate and early stopping copes much better.

</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** build an additive model one piece at a time, each piece chosen to reduce what is still wrong.

**The model after `$M$` rounds:**

```math
F_M(\mathbf{x}) = \sum_{t=1}^{M} \alpha_t \, h_t(\mathbf{x}), \qquad \hat{y} = \operatorname{sign} F_M(\mathbf{x})
```

**Why those weights:** AdaBoost is exactly what you get by adding one stump at a time to minimise the exponential loss `$\sum_i e^{-y_i F(\mathbf{x}_i)}$` with labels `$y_i = \pm 1$` (Friedman, Hastie and Tibshirani, 2000). Choosing the next piece to cut a loss is the general idea that Lesson 6.6 turns into gradient boosting.

**Try it:** a stump has weighted error 0.2. What is its say `$\alpha$`, and by what factor do the weights of its mistakes grow? (`$\alpha = \tfrac12 \ln 4 = 0.693$`; mistakes are multiplied by `$e^{0.693} = 2$` and correct rows by 0.5, before rescaling.)
</details>

## 4. Worked example

*Made-up numbers.* Ten rows, each with weight 0.1. Stump 1 gets 3 wrong.

- Weighted error `$\varepsilon = 0.3$`. Say: `$\alpha_1 = \tfrac12 \ln (0.7/0.3) = 0.424$`.
- Wrong rows: 0.1 × `$e^{0.424}$` = 0.1 × 1.528 = 0.153. Right rows: 0.1 × `$e^{-0.424}$` = 0.1 × 0.655 = 0.065.
- Total: 3 × 0.153 + 7 × 0.065 = 0.458 + 0.458 = 0.917. Rescaled: each wrong row 0.167, each right row 0.071.

After rescaling, the three mistakes hold exactly half the total weight (3 × 0.167 = 0.5). That is no accident: AdaBoost always reweights so the last stump would score exactly 50 % on the new weights, forcing the next stump to find something new.

## 5. Practice

1. Why can't you train boosting's rounds in parallel, as you can bagging's trees?
2. What is a stump's say `$\alpha$` if its weighted error is 0.5?
3. Why does AdaBoost struggle with mislabelled data?

<details>
<summary>Answers</summary>

1. Each round needs the previous rounds' mistakes (the new weights) before it can start.
2. `$\tfrac12 \ln 1 = 0$`: a coin-flip stump gets no vote.
3. A wrong label is always "misclassified", so its weight keeps growing and later stumps bend to fit it.
</details>

<div class="keypoints">

- Boosting trains weak learners one after another, each focusing on the earlier ones' mistakes.
- Bagging mainly cuts variance; boosting mainly cuts bias.
- AdaBoost raises the weights of misclassified rows and gives each stump a say α = ½ ln((1 − ε)/ε).
- Boosting run too long fits noise, especially wrong labels; choose the number of rounds with validation data.

</div>

**Try it on your own data:** the [[small-model-trainer]] grows a depth-1 tree (a stump) if you set the maximum depth to 1: see how weak one stump is on your CSV.

**New words:** *boosting*, *weak learner*, *stump*, *AdaBoost*, *sample weights*, *additive model*, *exponential loss*.

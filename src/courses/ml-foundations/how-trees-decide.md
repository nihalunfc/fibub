---
title: 'Twenty questions: how a tree decides'
seoTitle: 'How a decision tree works, explained with a simulation'
summary: 'A decision tree classifies by asking yes/no questions about one column at a time, like a game of twenty questions. Grow a tree on exam data one question at a time and see the boxes it draws.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: 'Each question in a decision tree looks at:'
    choices: ['All the columns at once, as a weighted sum', 'One column, compared with one threshold', 'The distance to the nearest training points']
    ans: 1
    why: 'A question is "is column j ≤ t?". That is why the regions have straight sides parallel to the axes.'
  - q: A tree predicts "pass" for a leaf holding 9 passes and 3 fails. What probability can it give?
    choices: ['100 %', '75 %', '50 %']
    ans: 1
    why: The share of the class in the leaf, 9 out of 12 = 75 %, is the tree's probability.
  - q: Why do trees need no scaling of the inputs?
    choices: ['They only compare one column with a threshold, so the units never mix', 'They scale the data themselves', 'They only work with numbers between 0 and 1']
    ans: 0
    why: 'Multiplying a column by 1,000 just multiplies its thresholds by 1,000: the same questions, the same tree.'
sources:
  - 'James, Witten, Hastie and Tibshirani (2021), An Introduction to Statistical Learning, 2nd edition, Springer, Chapter 8 (Tree-based methods) https://www.statlearning.com/'
  - 'Breiman, Friedman, Olshen and Stone (1984), Classification and Regression Trees, Wadsworth'
  - 'scikit-learn user guide: Decision trees https://scikit-learn.org/stable/modules/tree.html'
---

**Module 5 · about 20 minutes · read first: 4.1.** You'll be able to follow a decision tree to a prediction, read the boxes it draws, and say why trees are popular in business.

<div class="bigidea">A decision tree is a game of twenty questions: each question looks at one column, and the answers lead you down to a box of similar past cases.</div>

## 1. Why this matters

Decision trees are the models people can read. A bank can print one on a page and show why a loan was refused; a doctor can follow one at the bedside. On their own they are easy to understand but rarely the most accurate. Grown by the hundred, as random forests and gradient boosting (Module 6), they are the most successful models for table data (spreadsheets, databases, CSV files), often beating neural networks there.

## 2. A game of twenty questions

A tree sorts a new case by asking yes/no questions, one after another, like a flowchart:

1. Start at the top (the **root**).
2. Each **node** (a branching point) asks about one column: "Studied ≤ 3.5 hours?"
3. Go down the "yes" or "no" branch to the next question.
4. Stop at a **leaf** (an end point). It holds the answer: the most common class among the training rows that ended up there, and their share as a probability.

The number of questions on the longest path is the tree's **depth**.

<!--fig:tree-grow-->

<div class="steps">
<div class="step"><p><b>A new student arrives:</b> studied 8 hours, slept 5 hours. Start at the root.</p></div>
<div class="step"><p><b>Question 1: studied ≤ 3.5 hours?</b> No (8 hours), so go down the "no" branch.</p></div>
<div class="step"><p><b>Question 2: slept ≤ 5.5 hours?</b> Yes (5 hours), so go down the "yes" branch.</p></div>
<div class="step"><p><b>Question 3: studied ≤ 7 hours?</b> No (8 hours). We reach a leaf.</p></div>
<div class="step"><p><b>Read the leaf.</b> It holds 8 past students, 6 of whom passed. Prediction: pass, with probability 6 ÷ 8 = 75 %.</p></div>
</div>

<div class="meaning">

<dl>
<dt>R<sub>m</sub></dt><dd>The m-th box (leaf region): all the inputs that end up at leaf m.</dd>
<dt>c<sub>m</sub></dt><dd>What leaf m predicts: the share of each class in it (or the average, for numbers).</dd>
<dt>[x ∈ R<sub>m</sub>]</dt><dd>1 if x lands in box m, 0 if not. Exactly one box gets a 1.</dd>
<dt>Physical meaning</dt><dd>A parcel-sorting machine. Each gate checks one thing (weight, size, postcode) and sends the parcel left or right, until it drops into a bin. The bin's label is the prediction.</dd>
</dl>

</div>

<div class="problem" data-problem="how-trees-decide-leaf"></div>

## 3. Boxes with straight sides

Each question cuts one box of the input space into two, along a single column. So a tree's regions are always rectangles (boxes, with more columns), with sides parallel to the axes. A slanting border, which logistic regression draws in one go, takes a tree a whole staircase of small boxes.

That shape has upsides:

- **No scaling needed.** A question compares one column with a number, so units never mix.
- **Mixed data types.** Categories ("city = Toronto?") and numbers fit the same way.
- **Interactions for free.** "Only if they also slept enough" is just a question further down one branch. (An **interaction** is when the effect of one column depends on another.)
- **Readable.** The path to a leaf is a plain rule.

And downsides: single trees are **unstable** (change a few rows and the top question may change, and with it the whole tree), and grown deep they **overfit** (Lesson 5.5).

## 4. How the questions are chosen

The tree is built **greedily**, top-down. At each box it tries every column and every possible threshold, and keeps the question that makes the two new boxes as **pure** as possible (each mostly one class). Then it repeats inside each new box. Lessons 5.2 and 5.3 give the measure of purity.

"Greedy" means it never looks ahead, like a hiker who always takes the steepest path down without checking the map: the best first question is not always part of the best tree. Finding the very best tree is far too slow, and greedy trees work well in practice.

<div class="myth">

**"The column at the top of the tree is the most important one."** Not always. The root question is simply the best single split for all the rows. A column used lower down in many branches can matter more overall, and two nearly equal columns can swap places when a few rows change. Lesson 6.4 shows better ways to measure importance.

</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a tree splits the input space into boxes `$R_1, \dots, R_M$` and predicts a constant in each.

**Prediction:** for a classification tree, the leaf `$R_m$` that the input `$\mathbf{x}$` falls in gives

```math
\hat{P}(y = 1 \mid \mathbf{x}) = \frac{\text{class-1 rows in } R_m}{\text{all rows in } R_m}
```

and the predicted class is the one with the larger share.

**As a formula:** with `$[\cdot]$` meaning 1 if true and 0 if not, the whole tree is a sum over leaves,

```math
f(\mathbf{x}) = \sum_{m=1}^{M} c_m \, [\, \mathbf{x} \in R_m \,]
```

where `$c_m$` is the leaf's value. Each box is defined by the thresholds on the path to it.

**Try it:** a tree asks "income ≤ 40 (thousand)?"; yes leads to a leaf of 12 refused and 4 approved; no leads to "debt ≤ 10?", whose yes-leaf has 2 refused and 18 approved. Predict for income 55, debt 6. (No, then yes: approved, with probability 18/20 = 90 %.)
</details>

## 5. Worked example

*Made-up numbers.* A tree for exam results:

- Studied ≤ 3.5 h? **Yes:** leaf, 2 passed of 25: predict *fail* (8 %).
- **No:** Slept ≤ 5.5 h?
  - **Yes:** Studied ≤ 7 h? **Yes:** leaf, 1 of 10 passed: *fail*. **No:** leaf, 6 of 8 passed: *pass* (75 %).
  - **No:** leaf, 33 of 37 passed: *pass* (89 %).

A student who studied 8 hours and slept 5: not ≤ 3.5, slept ≤ 5.5, not ≤ 7, so *pass*, 75 %. In words: "plenty of study makes up for a short night". The tree found that interaction without being told.

## 6. Practice

1. In the simulation, which column does the first question use, and why that one?
2. Why does a tree need many questions to copy a slanting border?
3. After 3 questions, at most how many leaves can a tree have?

<details>
<summary>Answers</summary>

1. The one that separates passes from fails best on its own; on this data, hours studied.
2. Each question can only cut straight across one axis, so a slanting line is built from a staircase of small steps.
3. Four: every question turns one leaf into two, and a tree with one leaf plus 3 questions has 4 leaves.
</details>

<div class="keypoints">

- A decision tree asks yes/no questions, each about one column, until it reaches a leaf.
- A leaf predicts the most common class among its training rows, and their share as a probability.
- The regions are boxes with sides parallel to the axes, so trees need no scaling and find interactions by themselves.
- Trees are grown greedily: the best question now, without looking ahead.
- Single trees are easy to read but unstable, and overfit when grown deep.

</div>

**Try it on your own data:** the [[small-model-trainer]] grows a decision tree on your CSV and draws it, so you can read its questions.

**New words:** *decision tree*, *root*, *node*, *leaf*, *depth*, *greedy*, *axis-parallel split*, *interaction*.

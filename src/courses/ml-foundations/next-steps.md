---
title: 'Where to go next'
seoTitle: 'After machine learning basics: what to learn next'
summary: 'You can now explain every common model from a straight line to an LLM. Here are three ways to continue: run AI on your own computer, become a data analyst, or practise on your own data, plus the maths worth learning next.'
minutes: 15
updated: 2026-11-22
quiz:
  - q: The three areas of maths behind this course are
    choices: ['Linear algebra, calculus and probability', 'Geometry, trigonometry and logic', 'Number theory, topology and graphs']
    ans: 0
    why: Data and weights are vectors and matrices, learning is following derivatives downhill, and predictions are probabilities.
  - q: 'The best next step for most people after a course like this is:'
    choices: ['A small project on real data you care about', 'Reading every research paper', 'Memorising formulas']
    ans: 0
    why: A project makes you clean messy data, choose and judge a model, and explain it, which is the job itself.
  - q: 'A good portfolio project shows:'
    choices: ['A question, a baseline, a fair test and a plain-words conclusion', 'The most complex model possible', 'Only the final accuracy']
    ans: 0
    why: Employers look for judgement. The capstone (Lesson 11.1) is a template.
sources:
  - 'Deisenroth, M. P., Faisal, A. A. and Ong, C. S. (2020), Mathematics for Machine Learning, Cambridge University Press https://mml-book.github.io/'
  - 'James, G., Witten, D., Hastie, T., Tibshirani, R. and Taylor, J. (2023), An Introduction to Statistical Learning with Applications in Python, Springer https://www.statlearning.com/'
  - 'Goodfellow, I., Bengio, Y. and Courville, A. (2016), Deep Learning, MIT Press, part I (applied maths and machine learning basics) https://www.deeplearningbook.org/'
---

**Module 11 · about 15 minutes · read first: 11.1.** You'll be able to choose a next course that fits your goal, plan a first project of your own, and name the maths that will deepen what you learned here.

<div class="bigidea">You learn machine learning for good by using it: pick one real question you care about and carry it from data to a plain-words answer.</div>

## 1. Why this matters

You started with a straight line and finished with the parts of an LLM. You can now:

- read a model's description and know what it does;
- judge whether a result is honest;
- work the key formulas by hand.

Skills fade without use, like a language you stop speaking. The best time to pick a next step is now.

## 2. Three ways to continue

<!--fig:course-map-->

- **Run AI yourself.** The [Offline AI course](/learn/courses/offline-ai/) on this site takes Module 10 into practice: pick a model that fits your computer, run it offline, and build tools around it.
- **Become a data analyst.** [Pipeline to Dashboard](/learn/courses/etl/) teaches the work around the models: getting data in, cleaning it, loading a warehouse and building dashboards. [Data at Scale](/learn/courses/data-at-scale/) covers the tools for data too big for one computer.
- **Practise on your own data.** Pick a question you care about (your spending, a club's attendance, a public dataset from your city) and follow the capstone's seven steps.

Try it: press Generate from noise, then raise Guess error and generate again.

<figure class="fig" data-fig="@ai-diffusion-denoise"><figcaption>An image model starts from pure noise and repeatedly guesses and removes noise. Better guesses and more steps give a cleaner picture; poor guesses leave artefacts.</figcaption></figure>

## 3. Your first project

1. **One clear question** with a number or category to predict, and a reason someone would act on the answer.
2. **A few hundred rows or more,** from an open-data portal or your own records (with nothing personal about anyone else).
3. **The seven steps** of Lesson 11.1: frame, look and clean, split, baseline, fit two or three models, compare once, explain.
4. **Write it up** in one page: the question, the data, what beat the baseline and by how much, what drives the answer, what you would do next. That page is worth more in a job interview than any certificate.

Watch a first project take shape, from question to one-page report:

<div class="steps">
<div class="step"><p><b>The question.</b> "How many runners will come to my club next week?" The answer decides how much coffee to buy and how many marshals to ask.</p></div>
<div class="step"><p><b>The data.</b> 104 weekly counts (two years), with the weather, the week of the year, and whether a race is coming up. Nothing personal about anyone.</p></div>
<div class="step"><p><b>The split.</b> Train on the first 80 weeks, test on the last 24. The test weeks come after the training weeks, as they will in real life.</p></div>
<div class="step"><p><b>The baseline.</b> "Same as this week last year" misses by, say, <b>9 runners</b> a week on the test weeks. That is the number to beat.</p></div>
<div class="step"><p><b>The model and report.</b> Linear regression misses by about <b>6</b>. "Rain costs about 8 runners; a race in the next fortnight adds 12." One page, ready to act on.</p></div>
</div>

<div class="problem" data-problem="next-steps-baseline"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** three areas of maths carry almost everything in machine learning.

**Linear algebra:** data and weights are vectors and matrices. Linear regression (Lesson 3.4), PCA (Lesson 8.4) and attention (Lesson 10.4) are all matrix products:

```math
\hat{\mathbf{y}} = \mathbf{X}\mathbf{w}
```

**Calculus:** learning follows the gradient downhill, and backpropagation is the chain rule (Lesson 9.4):

```math
\mathbf{w} \leftarrow \mathbf{w} - \eta \, \nabla_{\mathbf{w}} L
```

**Probability:** predictions are probabilities, and losses are their negative logarithms (Lessons 4.3 and 10.3):

```math
L = -\ln p(\text{true answer})
```

To go deeper, learn matrix multiplication and eigenvectors, partial derivatives, and conditional probability with Bayes' rule.

**Analogy:** learning a language. You can now hold a conversation; grammar books (the maths) and travel (projects) are what make you fluent.

**Try it:** which of the three areas does each belong to: the dot product, a derivative, softmax? (Linear algebra; calculus; probability.)
</details>

<div class="meaning">

<dl>
<dt><b>ŷ</b> = <b>X</b><b>w</b></dt><dd>linear algebra: multiply the data table by the weights to get every prediction at once</dd>
<dt><b>w</b> ← <b>w</b> − η∇L</dt><dd>calculus: move every weight a small step (size η) downhill on the loss</dd>
<dt>L = −ln p</dt><dd>probability: the loss is small when the model gave the true answer a high chance</dd>
<dt>Physical meaning</dt><dd>Every model in this course, from a straight line to an LLM, is the same three moves: turn data into predictions with a matrix product, measure how wrong they are, and nudge the weights downhill. Learn these three well and new models stop looking like magic.</dd>
</dl>

</div>

## 4. Worked example

Planning a first project: "Can I predict how many people come to my running club each week?"

- **Data:** two years of weekly counts (104 rows), with the weather, the week of the year, and whether a race was coming up.
- **Baseline:** the average weekly turnout; a better one, last year's count for the same week.
- **Models:** linear regression, then a random forest. With only 104 rows, expect the simple model to hold its own (Lesson 11.1).
- **Split:** train on the first 80 weeks, test on the last 24.
- **Report:** "We can predict turnout to within about 6 people; rain costs about 8 runners and a race in the next fortnight adds 12." Plan coffee and marshals from it.

<div class="myth">

**"I must master all the maths before I start a real project."** The maths deepens your understanding, but projects teach the job: messy data, honest tests, clear writing. Start the project now and learn the maths you need as it comes up.

</div>

## 5. Practice

1. Write down one question from your own life or work that a model could answer. What would you predict, and what would you do with the answer?
2. What is the baseline for your question?
3. Which next course fits your goal best, and why?

<details>
<summary>Answers</summary>

1. Any clear question works, for example "how many orders will we get on Saturday?" so you can staff the shop.
2. Usually the average, the most common class, or "the same as last time".
3. Running models yourself: Offline AI. Working with business data: Pipeline to Dashboard, then Data at Scale.
</details>

**Try it on your own data:** start your project in the [[csv-profiler]]: it shows every column of your table at a glance, before any model.

**New words:** *portfolio project*, *linear algebra*, *calculus*, *probability*, *open data*.

<div class="keypoints">

- Pick a next step for your goal: run AI yourself, work with business data, or practise on your own data.
- A first project needs one clear question, a few hundred rows, and the capstone's seven steps.
- Always name the baseline and say by how much your model beats it.
- A one-page plain-words write-up shows judgement better than any certificate.
- Linear algebra, calculus and probability carry almost all of machine learning.

</div>

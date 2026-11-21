---
title: 'Where to go next'
seoTitle: 'After machine learning basics: what to learn next'
summary: 'You can now explain every common model from a straight line to an LLM. Here are three ways to continue: run AI on your own computer, become a data analyst, or practise on your own data, plus the maths worth learning next.'
minutes: 15
updated: 2026-11-21
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
---

**Module 11 · about 15 minutes · read first: 11.1.** You'll be able to choose a next course that fits your goal, plan a first project of your own, and name the maths that will deepen what you learned here.

## 1. Why this matters

You started with a straight line and finished with the parts of an LLM. You can now read a model's description and know what it does, judge whether a result is honest, and work the key formulas by hand. Skills fade without use, so the best time to pick a next step is now.

## 2. Three ways to continue

<!--fig:course-map-->

- **Run AI yourself.** The [Offline AI course](/learn/courses/offline-ai/) on this site takes Module 10 into practice: pick a model that fits your computer, run it offline, and build tools around it.
- **Become a data analyst.** [Pipeline to Dashboard](https://nihalsulaiman.com/learn/etl-course/) teaches the work around the models: getting data in, cleaning it, loading a warehouse and building dashboards. [Data at Scale](https://nihalsulaiman.com/learn/big-data-cloud/) covers the tools for data too big for one computer.
- **Practise on your own data.** Pick a question you care about (your spending, a club's attendance, a public dataset from your city) and follow the capstone's seven steps.

## 3. Your first project

1. **One clear question** with a number or category to predict, and a reason someone would act on the answer.
2. **A few hundred rows or more,** from an open-data portal or your own records (with nothing personal about anyone else).
3. **The seven steps** of Lesson 11.1: frame, look and clean, split, baseline, fit two or three models, compare once, explain.
4. **Write it up** in one page: the question, the data, what beat the baseline and by how much, what drives the answer, what you would do next. That page is worth more in a job interview than any certificate.

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

## 4. Worked example

Planning a first project: "Can I predict how many people come to my running club each week?"

- **Data:** two years of weekly counts (104 rows), with the weather, the week of the year, and whether a race was coming up.
- **Baseline:** the average weekly turnout; a better one, last year's count for the same week.
- **Models:** linear regression, then a random forest. With only 104 rows, expect the simple model to hold its own (Lesson 11.1).
- **Split:** train on the first 80 weeks, test on the last 24.
- **Report:** "We can predict turnout to within about 6 people; rain costs about 8 runners and a race in the next fortnight adds 12." Plan coffee and marshals from it.

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

---
title: What data analytics and machine learning are
seoTitle: 'What is machine learning? A plain introduction'
summary: Data analytics describes what happened; machine learning finds a rule from examples so it can predict what has not happened yet. See the difference, and let a machine learn its first rule.
minutes: 15
updated: 2026-11-21
quiz:
  - q: In machine learning, what does the computer get, and what does it produce?
    choices: ['It gets rules and data, and produces answers', 'It gets data and the right answers, and produces a rule (the model)', 'It gets a question and searches the internet']
    ans: 1
    why: Normal programming gives the computer the rules. Machine learning gives it examples with answers and lets it find the rule, which is then used on new data.
  - q: 'Which of these is descriptive analytics rather than machine learning?'
    choices: ['A chart of last month''s sales by store', 'Predicting tomorrow''s sales from past sales and the weather', 'Sorting new emails into spam and not spam']
    ans: 0
    why: Describing what already happened is analytics. The other two predict something not yet known from patterns in past examples, which is machine learning.
  - q: What is "training" in the cut-off simulation?
    choices: ['Typing in the best cut-off by hand', 'Trying many cut-offs and keeping the one with the fewest mistakes on the examples', 'Adding more students']
    ans: 1
    why: Training is a search for the settings that make the fewest mistakes on known examples. Every model in this course is trained this way, only with smarter searches.
---

**Module 1 · about 15 minutes · no maths needed yet.** You'll be able to say what data analytics and machine learning are, how they differ from normal programming, and what "training a model" means.

## 1. Why this matters

Every day, programs decide which email is spam, which song plays next, how much a house might sell for and which words a chatbot writes. Most of these programs were not written rule by rule by a person. They **learned** their rules from examples. This course shows you how, step by step, from the simplest learner (a straight line) to the largest (a language model such as the ones behind chat assistants).

## 2. Three kinds of work with data

People use "data analytics", "data science" and "machine learning" loosely. A useful way to keep them apart is by the question each answers:

| Kind | The question | Example |
|---|---|---|
| **Descriptive analytics** | What happened? | A dashboard of last month's sales by store. |
| **Diagnostic analytics** | Why did it happen? | Sales fell in stores where a competitor opened. |
| **Predictive (machine learning)** | What will happen, or what is this new thing? | Next week's sales; is this email spam? |

Descriptive and diagnostic work mostly uses summaries, charts and careful comparisons (Module 2). Predictive work needs a **model**: a rule that turns inputs into a prediction. Machine learning is the craft of finding that rule from data.

## 3. Rules written by people, or rules found by the machine

<!--fig:rules-vs-learning-->

In normal programming, a person writes the rule: "if the mark is 40 or more, print pass". That works when the rule is known and simple. It fails when nobody can write the rule down. Try writing exact rules for "is this photo a cat?" or "will this customer cancel?" and you'll see the problem.

Machine learning turns it round. You give the computer many **examples** together with the **right answers** (photos labelled cat or not cat; past customers marked cancelled or stayed). The computer searches for a rule that gets those examples right. The rule it finds is the **model**. Then you use the model on new examples whose answers you don't know.

## 4. The smallest possible learning machine

Here are 24 students. For each, we know how many hours they studied and whether they passed. We want a rule of the form "pass if hours ≥ some cut-off". Move the slider to try cut-offs yourself, then let the machine do it.

<!--fig:learn-a-rule-->

What the machine did is exactly what training means in every model of this course:

1. **Choose a family of rules** (here: "pass if hours ≥ c", for any number c).
2. **Measure how wrong a rule is** on the known examples (here: count the mistakes).
3. **Search** for the setting with the smallest error (here: try every c in steps of 0.25).

The number c is called a **parameter**: a setting the machine learns. A straight line has 2 parameters, a decision tree has a few dozen, and a large language model has billions. Steps 1 to 3 stay the same. What changes is the family of rules and how clever the search is.

Notice also that even the best cut-off makes a few mistakes. Some students studied little and passed; some studied a lot and failed. Real data is noisy, and a model is a useful summary, not a perfect oracle.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a model is a function with adjustable parameters. Training picks the parameters that make the error on known examples as small as possible.

**Equation:** for the cut-off model, the prediction for a student who studied `$h$` hours is

```math
\hat{y} = \begin{cases} \text{pass} & \text{if } h \ge c \\ \text{fail} & \text{if } h < c \end{cases}
```

and training finds

```math
c^{*} = \arg\min_{c} \; \sum_{i=1}^{n} \big[\, \hat{y}_i(c) \ne y_i \,\big]
```

Read it as: "c-star is the value of c that makes the count of wrong predictions smallest". The hat on `$\hat y$` means "predicted"; `$y_i$` is the true answer for student `$i$`; the square brackets count 1 when the statement inside is true and 0 when false; `$\sum$` adds those up over all `$n$` students.

**Analogy:** tuning a radio. The dial is the parameter, the static is the error, and you turn the dial until the static is least.

**Try it:** 5 students studied 1, 3, 4, 6 and 8 hours. Only the last two passed. How many mistakes does c = 5 make? (None: 6 and 8 are at least 5 and passed; the rest are below 5 and failed.)
</details>

## 5. Worked example

*Made-up numbers.* A small shop wants to know which online orders will be returned. Writing rules by hand ("if size is XL and colour is beige...") quickly gets out of control. Instead it takes 2,000 past orders, each with columns such as price, category, delivery days and whether the customer had returned something before, plus the answer: returned or not. A model trained on 1,500 of them is checked on the other 500 it never saw, and gets 82 % right, against 70 % for the simple guess "nothing is ever returned". That 12-point gain is what the model is worth. The shop then uses it to add a sizing tip to the risky orders. Every step of that story (choosing columns, splitting off 500 rows, comparing with a simple guess) is a lesson in this course.

## 6. Practice

1. Is each one descriptive analytics or machine learning? (a) Average delivery time per city last year. (b) Estimating the delivery time of an order placed now.
2. In the simulation, what is the parameter, and what is the error being made small?
3. Why can't the best cut-off get every student right?

<details>
<summary>Answers</summary>

1. (a) Descriptive: it summarises the past. (b) Machine learning: it predicts an unknown from patterns in past orders.
2. The parameter is the cut-off c. The error is the number of students predicted wrongly.
3. Because some students who studied little passed and some who studied a lot failed. Hours alone don't decide the result, so no single cut-off separates them perfectly.
</details>

**New words:** *model* (a rule found from data that turns inputs into a prediction), *training* (searching for the parameter values with the least error), *parameter* (a setting the machine learns), *prediction* (the model's output, written `$\hat y$`).

**Next:** the words used for every dataset: features, labels and examples.

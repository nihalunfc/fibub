---
title: What data analytics and machine learning are
seoTitle: 'What is machine learning? A plain introduction'
summary: Data analytics describes what happened; machine learning finds a rule from examples so it can predict what has not happened yet. See the difference, and let a machine learn its first rule.
minutes: 15
updated: 2026-11-22
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
sources:
  - 'Mitchell, T. M. (1997), Machine Learning, McGraw-Hill, Chapter 1 (the "learning from experience" definition)'
  - 'James, G., Witten, D., Hastie, T., Tibshirani, R. and Taylor, J. (2023), An Introduction to Statistical Learning with Applications in Python, Springer, Chapter 2 https://www.statlearning.com/'
  - 'Goodfellow, I., Bengio, Y. and Courville, A. (2016), Deep Learning, MIT Press, Chapter 5 (machine learning basics) https://www.deeplearningbook.org/'
---

**Module 1 · about 15 minutes · no maths needed yet.** You'll be able to say what data analytics and machine learning are, how they differ from normal programming, and what "training a model" means.

<div class="bigidea">Machine learning means showing a computer many examples with their answers, and letting it find the rule by itself.</div>

## 1. Why this matters

Every day, programs decide which email is spam, which song plays next, what a house might sell for and which words a chatbot writes. Nobody wrote most of these rules by hand. The programs **learned** them from examples.

Think of how a child learns what a dog is. Nobody gives the child a rule book ("four legs, fur, barks"). The child sees many dogs, hears "dog" each time, and slowly works out the pattern. Machine learning does the same thing with numbers.

This course takes you from the simplest learner (a straight line) to the largest (the language models behind chat assistants), one small step at a time.

## 2. Three kinds of work with data

People mix up "data analytics", "data science" and "machine learning". The easiest way to keep them apart is to ask which question each one answers:

| Kind | The question | Example |
|---|---|---|
| **Descriptive analytics** | What happened? | A dashboard of last month's sales by store. |
| **Diagnostic analytics** | Why did it happen? | Sales fell in stores where a competitor opened. |
| **Predictive (machine learning)** | What will happen, or what is this new thing? | Next week's sales; is this email spam? |

The first two look backwards. They use summaries, charts and careful comparisons (Module 2). The third looks forwards. It needs a **model**: a rule that turns inputs (what you know) into a prediction (what you want to know). Machine learning is the craft of finding that rule from data.

Try it: pick the line, then degree 9, and slide the number of examples. Watch training and test error meet or stay apart.

<figure class="fig" data-fig="@ai-learning-curves"><figcaption>A line is too simple (both errors stay high: more data will not help). A flexible model has a big gap that shrinks as data grows (more data helps). No model gets below the noise floor.</figcaption></figure>

## 3. Rules written by people, or rules found by the machine

<!--fig:rules-vs-learning-->

In normal programming, a person writes the rule: "if the mark is 40 or more, print pass". That works when the rule is simple and known. It breaks when nobody can write the rule down. Try writing exact rules for "is this photo a cat?" or "will this customer cancel?" and you'll soon give up.

Machine learning turns this round. You give the computer many **examples** together with the **right answers**: photos labelled cat or not cat, past customers marked "cancelled" or "stayed". The computer searches for a rule that gets those examples right. The rule it finds is the **model**. Then you use the model on new cases whose answers you don't know yet.

<div class="myth">

**"A model that has learned is always right."** No. A model is a summary of past examples, and real life is noisy. Even the best rule in the simulation below gets some students wrong, because hours of study don't decide everything. A good model is right *more often* than a simple guess, and you measure how often on cases it has never seen (Lesson 2.5).

</div>

Try it: press New start a few times with random starts, then with k-means++, then Run 30 starts for each.

<figure class="fig" data-fig="@ai-kmeans-init"><figcaption>k-means only finds a nearby good answer, so a bad start can strand two centres in one blob. Spreading the starting centres out (k-means++) and trying several starts both help.</figcaption></figure>

## 4. The smallest possible learning machine

Here are 24 students. For each one, we know how many hours they studied and whether they passed. We want a rule of the form "pass if hours ≥ some cut-off". Move the slider to try cut-offs yourself, then let the machine do it.

<!--fig:learn-a-rule-->

What the machine did is exactly what "training" means for every model in this course:

1. **Choose a family of rules.** Here: "pass if hours ≥ c", for any number c.
2. **Measure how wrong a rule is** on the known examples. Here: count the mistakes.
3. **Search** for the setting with the smallest error. Here: try every c in steps of 0.25.

Watch the same three steps with just eight students:

<div class="steps" data-fig="what-is-machine-learning-cutoff">
<div class="step"><b>The examples.</b> Eight students studied 1 to 8 hours. P means passed, F means failed. Mostly, more hours means a pass, but student 3 passed with little study and student 5 failed with a lot.</div>
<div class="step"><b>Try c = 2.</b> The rule says everyone with 2 or more hours passes. It is wrong about students 2, 4 and 5, who failed. That is 3 mistakes.</div>
<div class="step"><b>Try c = 4.</b> Now students 1 to 3 are predicted to fail. Student 3 actually passed, and 4 and 5 still failed. Still 3 mistakes.</div>
<div class="step"><b>Try c = 6.</b> Students 1 to 5 are predicted to fail, 6 to 8 to pass. Only student 3 is wrong: 1 mistake.</div>
<div class="step"><b>Keep the best.</b> No other cut-off does better, so training keeps c = 6. Student 3 is still wrong. That is noise, not a bug: no single cut-off can fix it.</div>
</div>

The number c is called a **parameter**: a setting the machine learns. A straight line has 2 parameters, a decision tree a few dozen, and a large language model billions. The three steps stay the same. Only the family of rules and the cleverness of the search change.

<div class="problem" data-problem="what-is-machine-learning-cutoff"></div>

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

<div class="meaning">

<dl>
<dt>Model</dt><dd>A rule that turns what you know (hours studied) into a guess about what you want to know (pass or fail).</dd>
<dt>Parameter (c)</dt><dd>A dial inside the model that training turns. Here, the cut-off number of hours.</dd>
<dt>Error</dt><dd>How often, or how badly, the model is wrong on examples whose answers you already know.</dd>
<dt>Training</dt><dd>Turning the dials until the error is as small as possible.</dd>
<dt>Physical meaning</dt><dd>The model is a compressed memory of experience. A tutor who has seen hundreds of students can guess who will pass; the machine does the same with a written-down rule, and it never gets tired or forgets an example.</dd>
</dl>

</div>

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

<div class="keypoints">

- Analytics describes the past; machine learning predicts what is not yet known.
- In machine learning you give examples with answers, and the computer finds the rule (the model).
- Training has three steps: choose a family of rules, measure the error, search for the settings with the least error.
- A parameter is a dial the machine sets; big models have billions of them, but the idea is the same.
- Real data is noisy, so even the best model makes some mistakes.

</div>

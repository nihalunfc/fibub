---
title: Why analysts need statistics
summary: 'What statistics adds to dashboards and SQL: describing what happened, and judging whether a change is real or just noise. The two halves of the subject and how this course is laid out.'
minutes: 15
updated: 2026-11-22
quiz:
  - q: Sales were 3 % higher this week than last week. What is the first statistical question to ask?
    choices: ['Which product caused it', 'How much do weekly sales normally move up and down by chance', 'Whether to report it to the CEO']
    ans: 1
    why: 'A change only means something compared with the normal week-to-week wobble. If sales usually move ±5 %, a 3 % rise is ordinary noise.'
  - q: Which of these is inferential statistics rather than descriptive?
    choices: ['The median order value last month was $42', 'We are 95 % confident the new checkout lifts conversion by 0.4 to 1.8 points', 'Toronto stores had 1,204 returns in October']
    ans: 1
    why: 'Inference goes beyond the rows you have to a wider truth (all future customers) and states how sure you can be. The other two simply describe the data.'
  - q: Why can a dashboard without statistics mislead?
    choices: ['Dashboards cannot show averages', 'It shows every change with the same weight, so random movement looks like a trend', 'Charts always use the wrong colours']
    ans: 1
    why: 'A line chart moves every day. Without a sense of normal variation, people react to noise: celebrating lucky weeks and punishing unlucky ones.'
sources:
  - 'OpenIntro Statistics, 4th edition (Diez, Cetinkaya-Rundel, Barr), Chapter 1 https://www.openintro.org/book/os/'
  - 'NIST/SEMATECH e-Handbook of Statistical Methods, Chapter 1 Exploratory Data Analysis https://www.itl.nist.gov/div898/handbook/'
---

**Module 1 · about 15 minutes · no maths yet.** You'll be able to say what statistics adds to an analyst's work, tell descriptive from inferential statistics, and know how this course is laid out.

<div class="bigidea">Every number from data is the truth plus some noise; statistics measures the noise so you can tell a real change from luck.</div>

**In everyday terms:** your bathroom scale reads a little differently each time you step on it. You would not panic over 0.3 kg on one morning, but you would notice a steady climb over a month. Statistics is the rulebook for telling the two apart.

## 1. The question behind every report

An analyst's day is full of questions like these:

- Sales are up 3 % on last week. Is that the new promotion, or an ordinary week?
- The new checkout page converts 4.4 % of visitors, the old one 4.1 %. Should we switch?
- Store A has more complaints than store B. Is store A worse, or just bigger and busier?
- A survey of 300 customers says 62 % like the new menu. How sure can we be about all customers?

SQL and dashboards answer **what happened in these rows**. Statistics answers the next question: **how much of that would change if we had different rows**, such as another week, another sample of customers or another month of visitors. Without it, every random wiggle in a chart looks like news.

<!--fig:analyst-loop-->

## 2. The two halves of statistics

**Descriptive statistics** summarise the data you have: averages, spreads, percentages, charts. "The median delivery took 31 minutes" is descriptive. Module 1 covers it.

**Inferential statistics** reason from a sample to something bigger: all customers, all future visitors, the true effect of a change. It always comes with a statement of uncertainty, such as a margin of error, a confidence interval or a p-value. "Between 58 % and 66 % of all customers like the new menu" is inferential. Modules 4 to 7 cover it.

Between the two sits **probability** (Modules 2 and 3): the language for chance, which inference is built on.

## 3. Noise is normal

Imagine a shop whose true average is 500 sales a day. Even if nothing changes, some days bring 470 and some 530, because customers decide independently. Weekly totals wobble too. A rise of 3 % in one week means nothing until you know how big the usual wobble is. This one idea, **compare a change with normal variation**, runs through the whole course:

- a z-score compares one value with the usual spread (Lesson 1.5);
- a standard error measures how much a sample average wobbles (Lesson 4.4);
- a confidence interval gives the range the truth probably sits in (Lesson 5.1);
- a hypothesis test asks whether a difference is bigger than chance would produce (Module 6);
- an A/B test applies all of this to a product decision (Module 7).

<div class="meaning">

<dl>
<dt>Descriptive statistics</dt><dd>Summaries of the rows you have: averages, percentages, charts.</dd>
<dt>Inferential statistics</dt><dd>Claims about something bigger than your rows (all customers, next month), always with a statement of how sure you are.</dd>
<dt>Noise (variation)</dt><dd>The ordinary up-and-down that happens even when nothing has changed.</dd>
<dt>Physical meaning</dt><dd>A sales figure is like a photo taken in wind: the building (the true level) is still, but the trees (the noise) move. Statistics tells you how much the trees usually move, so you can say whether the building moved.</dd>
</dl>

</div>

<div class="myth">

**"The number went up, so something changed."** Numbers go up and down every week with no cause at all. A change is only news when it is bigger than the usual wobble, and the first job is always to measure that wobble.

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>The claim.</b> A café usually sells 200 coffees a day. After a new sign goes up, Monday brings 215.</div>
<div class="step"><b>Measure the usual wobble.</b> Looking back over past days, sales typically move about 20 coffees from the average (the standard deviation, Lesson 1.3).</div>
<div class="step"><b>Compare.</b> 215 is 15 above average: 15 ÷ 20 = 0.75 of a usual wobble.</div>
<div class="step"><b>How rare is that?</b> Days at least that good happen about one day in four or five with no sign at all (Lesson 3.4).</div>
<div class="step"><b>Decide.</b> One good Monday is not evidence. Two weeks after against two weeks before would be (Lesson 6.3).</div>
</div>

<div class="problem" data-problem="why-statistics-wobble"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** every number from data is the truth plus noise. Statistics measures the size of the noise so you can see whether a pattern rises above it.

**Equation (in words):** `$\text{what you measure} = \text{true value} + \text{random noise}$`. Much of this course is about the size of that noise term and how it shrinks with more data.

**Analogy:** a bathroom scale that reads 0.5 kg differently each time you step on it. One reading up 0.3 kg proves nothing; a steady rise over many readings does.
</details>

## 4. Worked example

*Made-up numbers.* A café sells a mean of 200 coffees a day with a typical day-to-day difference (standard deviation) of 20. After a new sign goes up, Monday brings 215 coffees.

- 215 is 15 above the mean, which is 15 ÷ 20 = 0.75 standard deviations.
- Days that far above average happen often by chance (roughly one day in four or five, as Lesson 3.4 will show).
- So one good Monday says almost nothing about the sign. Two weeks of data, compared with two weeks before, would say much more (Lesson 6.3 shows how).

## 5. How this course works

Every lesson has a picture or a simulation to play with, a **Maths and principle** box with the formula explained symbol by symbol, a worked example with small numbers, practice questions with answers, and a three-question quiz. The maths is school level, and each formula is explained the first time it appears.

The machine learning course [From a straight line to an LLM](/learn/courses/ml-foundations/) covers fitting models; this course covers judging data and decisions. They link to each other where they meet. You finish with a capstone (Lesson 9.1): an **experiment readout** for your portfolio.

## 6. Practice

1. Label each as descriptive or inferential: (a) "Average basket was $38 in October." (b) "The loyalty scheme raises spend by $2 to $5 per visit, with 95 % confidence." (c) "42 % of survey respondents were students."
2. A manager says a store "got worse" because its rating fell from 4.5 to 4.3 stars in a month with 12 reviews. What would you ask first?

<details>
<summary>Answers</summary>

1. (a) Descriptive. (b) Inferential: it is about the true effect and states uncertainty. (c) Descriptive, as long as it only describes those respondents; if it is used to claim 42 % of all customers are students, it becomes inference.
2. How much does a monthly average of only 12 ratings normally move? With so few reviews, one or two unhappy customers can shift it by 0.2.
</details>

**Try it on your own data:** the [[csv-profiler]] gives a first descriptive summary of any CSV file, all in your browser.

**New words:** *descriptive statistics*, *inferential statistics*, *sample*, *noise*, *variation*, *uncertainty*.

<div class="keypoints">

- SQL and dashboards say what happened in these rows; statistics says how much would change with different rows.
- Descriptive statistics summarise the data you have; inferential statistics reason beyond it and state uncertainty.
- Compare every change with normal variation before calling it real.
- Probability (Modules 2-3) is the language inference (Modules 4-7) is built on.

</div>

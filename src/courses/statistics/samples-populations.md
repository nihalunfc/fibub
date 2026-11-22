---
title: Populations and samples
summary: 'The population is everyone you care about; the sample is who you actually measured. Parameters versus statistics, random sampling, and why a sample of 1,000 can describe millions while every sample result wobbles.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: 'A bank wants the average balance of all its 2 million customers and checks 5,000 random accounts. Which is the parameter?'
    choices: ['The average of the 5,000 accounts', 'The true average of all 2 million accounts', 'The number 5,000']
    ans: 1
    why: 'A parameter describes the whole population and is usually unknown. The average of the 5,000 is a statistic, used to estimate it.'
  - q: 'Two random samples of 200 customers give satisfaction of 71 % and 76 %. What is the most likely reason?'
    choices: ['One sample was done wrong', 'Ordinary sampling variation: each random sample lands somewhere different', 'Satisfaction changed between samples']
    ans: 1
    why: 'With 200 people, sample percentages typically wander a few points from the truth. A 5-point gap between two such samples is not surprising.'
  - q: 'Does a sample of 1,000 work as well for a country of 40 million as for a city of 1 million?'
    choices: ['No, it needs to be 40 times bigger', 'Yes, nearly: precision depends on the sample size, not the population size, unless the sample is a big share of the population', 'Only if the country is homogeneous']
    ans: 1
    why: 'The standard error depends on n, not on N. A spoonful of well-stirred soup tells you the taste whether the pot holds 1 litre or 40.'
---

**Module 4 · about 20 minutes · school maths.** You'll be able to tell populations from samples and parameters from statistics, explain random sampling, and describe sampling variation.

## 1. The words

- **Population:** everyone or everything you want to know about: all customers, all transactions this year, all future visitors to a page.
- **Sample:** the part you actually measure.
- **Parameter:** a number describing the population, such as the true average order value `$\mu$` or the true conversion rate `$p$`. Usually unknown.
- **Statistic:** the same number worked out from the sample, such as `$\bar{x}$` or `$\hat p$` ("p hat"). Known, and used as an **estimate** of the parameter.

Sometimes analysts have the whole population (every transaction in the warehouse). Even then, the question is often about a bigger, future population: next month's customers, or what *would* happen if a change were rolled out. Last month's data is then a sample of a process that keeps going.

## 2. Random samples

A sample tells you about the population only if it is chosen in a way unrelated to what you measure. The gold standard is a **simple random sample**: every member has the same chance of being picked. Variants:

- **Stratified:** sample separately within groups (regions, store sizes) so each is represented; then combine with the right weights.
- **Cluster:** pick whole groups (stores) at random, then measure everyone in them. Cheaper, less precise.
- **Systematic:** every 50th invoice. Fine unless the list has a pattern every 50 rows.

In SQL, `ORDER BY RANDOM() LIMIT 1000` (or `TABLESAMPLE`) draws a random sample; in pandas, `df.sample(n=1000, random_state=1)`.

## 3. Sampling variation

<!--fig:poll-sim-->

Each random sample gives a different answer. That spread of answers is **sampling variation**, and it is the "noise" from Lesson 1.1. Run 50 surveys of 100 people: answers range roughly from 28 % to 48 %. With 1,000 people: about 35 % to 41 %. Two facts to take away:

1. Bigger samples scatter less, but only with the **square root** of the size (Lesson 4.4).
2. The size of the **population** hardly matters. What matters is the size of the sample and that it is random.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a statistic from a random sample is a random variable. Its distribution over all possible samples (the **sampling distribution**) tells you how far it is likely to be from the parameter.

**Notation:** population `$\mu, \sigma, p$`; sample `$\bar{x}, s, \hat{p}$`. For a sample proportion, the typical distance from the truth is `$\sqrt{p(1-p)/n}$` (Lesson 3.2).

**Finite population correction:** if the sample is more than about 5 % of the population, multiply that by `$\sqrt{(N-n)/(N-1)}$`. Sampling 1,000 of 40 million: factor ≈ 1. Sampling 900 of 1,000 employees: factor ≈ 0.32, much more precise.
</details>

## 4. Worked example

*Made-up numbers.* A retailer has 800,000 loyalty members. It emails a survey to a random 2,000 and 400 reply; 62 % of replies say they'd use same-day delivery.

- Population: all 800,000 members. Parameter: the true share who'd use it.
- Sample: the 400 who replied. Statistic: `$\hat p$` = 0.62.
- Typical sampling error: √(0.62 × 0.38 ÷ 400) ≈ 0.024, about **±2.4 points**. Roughly 95 % of random samples land within about ±4.8 points of the truth.
- But: only 20 % of those emailed replied. If repliers differ from non-repliers, the error could be far bigger than ±4.8 points, and no formula shows it. Lesson 4.2 is about that.

## 5. Practice

1. Label each as parameter or statistic: (a) the conversion rate of all visitors to the site this year, (b) the conversion rate in a 2-week test, (c) the median income of everyone in Ontario.
2. Sample A has 400 people, sample B 1,600. Roughly how much smaller is B's sampling error?
3. Why might an analyst with every transaction from last year still talk about "sampling"?

<details>
<summary>Answers</summary>

1. (a) Parameter if "this year's visitors" is the whole population of interest. (b) Statistic. (c) Parameter.
2. Half: √1,600 = 40 is twice √400 = 20.
3. Because decisions concern future customers. Last year is one sample from an ongoing process, and a different year would have given somewhat different numbers.
</details>

**Try it on your own data:** the [[sample-size]] calculator says how many to sample for a chosen margin of error, and the [[sample-chopper]] splits a list into random groups.

**New words:** *population*, *sample*, *parameter*, *statistic*, *estimate*, *simple random sample*, *stratified sample*, *sampling variation*, *sampling distribution*.

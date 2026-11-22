---
title: 'Bias: survivorship, selection and non-response'
summary: 'Random error shrinks with more data; bias does not. The common biases in business data (survivorship, selection, non-response, self-selection, convenience samples) and the questions that catch them.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: 'An analysis of "what our successful stores have in common" looks only at stores still open. What bias is this?'
    choices: ['Non-response bias', 'Survivorship bias: closed stores, which may have shared the same features, are missing', 'Measurement error']
    ans: 1
    why: 'If failed stores had the same features, those features do not explain success. Looking only at survivors hides that.'
  - q: 'A survey has a biased sample. What happens if you collect ten times as many responses the same way?'
    choices: ['The bias goes away', 'The answer gets more precise around the same wrong value', 'The bias doubles']
    ans: 1
    why: 'More data shrinks random error but repeats the bias every time. You get a confident wrong answer.'
  - q: 'Which question best catches selection bias?'
    choices: ['How many rows are there?', 'Who is missing from this data, and could they differ?', 'What is the standard deviation?']
    ans: 1
    why: 'Bias comes from who got into the data. Asking who is left out, and why, is the most useful habit.'
---

**Module 4 · about 20 minutes · no new maths.** You'll be able to name the common sampling biases, spot them in business data, and explain why more data does not fix them.

## 1. Two kinds of error

Every estimate has two kinds of error:

- **Random error** (sampling variation): different random samples give different answers. It averages out and shrinks with more data. Formulas measure it.
- **Bias**: the way the data was collected pushes answers in one direction. It does **not** shrink with more data, and no standard error formula shows it.

A big biased sample is worse than a small fair one, because it looks convincing.

<!--fig:response-bias-->

## 2. Biases analysts meet

**Survivorship bias.** You only see what survived. Studying "features of our long-time customers" misses those who left because of the same features. Analysing only current products hides the ones that were dropped. The classic case: WWII engineers wanted to armour the places where returning planes had bullet holes; the statistician Abraham Wald pointed out that planes hit elsewhere didn't come back.

**Selection bias.** The way rows enter the data depends on the outcome. Customers who answer an NPS survey after a support call; loan performance measured only for approved loans; app ratings only from people who open the app.

**Non-response bias.** People who reply differ from those who don't. Unhappy customers often ignore satisfaction surveys (or, sometimes, only unhappy ones reply).

**Self-selection.** People choose to be in the group. Customers who joined the loyalty scheme spend more, but they were probably bigger spenders already. That's why Module 7 randomises.

**Convenience samples.** Whoever was easy to reach: one store, one week, the first 500 rows of a file sorted by date.

**Time-window bias.** A "last 30 days" window that includes a holiday, or a cohort that hasn't had time to churn yet.

## 3. Catching bias: questions to ask

1. **Who is not in this data?** And could they differ on what you measure?
2. **How did each row get here?** Was the outcome involved in getting in?
3. **Who chose?** If people chose their own group, compare like with like, or randomise.
4. **Does the sample match known totals?** Compare its mix (region, age, device) with the full customer base.

## 4. What you can do

- **Randomise** whenever you control who gets what (Module 7).
- **Weight** responses so the sample's mix matches the population (if young customers are half of members but a quarter of replies, count each young reply double). This fixes bias from *known* traits only.
- **Follow up** with non-responders, or offer a small incentive to raise response.
- **Say it**: "Results reflect customers who completed the survey (18 % response)."

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** total error = bias + random error. The mean squared error of an estimate is

```math
\text{MSE} = \text{bias}^2 + \text{variance}
```

More data shrinks the variance term (like `$1/n$`) but leaves bias² untouched. Past a point, a bigger biased sample buys nothing.

**Analogy:** a scale that reads 2 kg heavy. Weighing yourself 100 times and averaging gets you a very precise wrong number.
</details>

## 5. Worked example

*Made-up numbers.* A hotel emails a survey after checkout. Satisfaction among all guests, which you never see directly: 3.4 out of 5. Happy guests (4–5 stars) reply 30 % of the time; unhappy guests (1–2) reply 10 %.

- Suppose 55 % of guests are happy, 25 % unhappy, 20 % neutral (reply 20 %).
- Replies per 1,000 guests: happy 165, neutral 40, unhappy 25. Happy guests make up 165 ÷ 230 ≈ 72 % of replies but only 55 % of guests.
- The survey average comes out well above 3.4 (try the simulation: about +0.4).
- Weighting fix: give each reply a weight of (share of guests) ÷ (share of replies). Happy replies get 0.55 ÷ 0.72 ≈ 0.77, unhappy replies 0.25 ÷ 0.11 ≈ 2.3.

## 6. Practice

1. An app measures "average session length" only for sessions over 10 seconds. Which way is the bias?
2. A bank studies defaults among approved loans to set rules for all applicants. Name the bias and the risk.
3. Loyalty members spend 40 % more than non-members. Why doesn't that prove the scheme raises spending?

<details>
<summary>Answers</summary>

1. Upward: the shortest sessions are cut off, so the average is too high.
2. Selection bias (reject inference problem): you never see how rejected applicants would have behaved, so rules may be wrong for them.
3. Self-selection: people who already spend a lot are more likely to join. Compare members with similar non-members before joining, or test the scheme with random invitations.
</details>

**Try it on your own data:** the [[crosstab-chi-square]] tool compares your sample's mix with known population shares (a goodness-of-fit check).

**New words:** *bias*, *random error*, *survivorship bias*, *selection bias*, *non-response bias*, *self-selection*, *convenience sample*, *weighting*.

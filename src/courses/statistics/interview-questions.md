---
title: 'Statistics interview questions, answered'
summary: '40 statistics questions that come up in data analyst, BI and data scientist interviews, from mean vs median to A/B test design, each with a short answer you can say out loud and a link to the lesson that explains it.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: 'An interviewer asks "what is a p-value?". Which answer is right?'
    choices: ['The chance the null hypothesis is true', 'The chance of seeing a result at least this extreme if the null hypothesis were true', 'The chance the result will replicate']
    ans: 1
    why: 'It is a statement about the data assuming the null, not about the null itself (Lesson 6.2).'
  - q: 'Your test result is significant but the lift is tiny. What do you say?'
    choices: ['Ship it, it is significant', 'Statistically clear but maybe not worth it: compare the interval with the smallest lift that matters for the business', 'The test is wrong']
    ans: 1
    why: 'Significance is not importance. The decision weighs the effect size and its interval against cost and value.'
  - q: 'How do you answer a question you are not sure about?'
    choices: ['Guess confidently', 'Say what you would check and how you would reason about it', 'Refuse']
    ans: 1
    why: 'Interviewers value clear reasoning and honesty about uncertainty, which is the whole point of statistics.'
sources:
  - 'Wasserstein, R. L. and Lazar, N. A. (2016), The ASA Statement on p-Values, The American Statistician 70(2), 129-133 https://doi.org/10.1080/00031305.2016.1154108'
  - 'OpenIntro Statistics, 4th edition (Diez, Cetinkaya-Rundel, Barr) https://www.openintro.org/book/os/'
---

**Module 9 · about 45 minutes · revision.** Read each question, answer it out loud in under a minute, then open the answer. The lesson number tells you where to go deeper.

<div class="bigidea">Good interview answers give the one-line definition, a business example and the trap, in under a minute.</div>

**In everyday terms:** like explaining a recipe to a friend: what it is, when you would make it, and the one mistake that ruins it.

**How to answer:** give the one-line definition, an example from business data, and the trap. "The median is the middle value. For order values it's better than the mean because a few huge orders drag the mean up. I'd report both if they differ a lot."

## Describing data

<details><summary>1. Mean or median: when do you use which?</summary>

Median for skewed data (income, order value, time on page) or with outliers; mean when the data is roughly symmetric or when totals matter (mean × count = total). Report both if they differ a lot. (Lesson 1.2)
</details>

<details><summary>2. What does the standard deviation tell you?</summary>

The typical distance of values from the mean, in the data's own units. For roughly normal data about 68 % fall within 1 SD and 95 % within 2. (Lesson 1.3)
</details>

<details><summary>3. How do you find outliers?</summary>

Plot first (box plot, histogram). Common rules: beyond 1.5 × IQR from the quartiles, or |z| > 3. Then investigate: error, or a real extreme? Never delete without a reason you can state. (Lesson 1.4)
</details>

<details><summary>4. What is a z-score?</summary>

How many SDs a value is from the mean: (x − mean) ÷ SD. It puts different scales on one footing. (Lesson 1.5)
</details>

<details><summary>5. What does a right-skewed distribution look like, and an example?</summary>

A long tail to the right; mean above median. Revenue per customer, delivery times, house prices. (Lesson 1.4)
</details>

## Probability

<details><summary>6. A test for a rare condition is 99 % accurate. A positive result: how likely is the condition?</summary>

It depends on the base rate. If 1 in 1,000 have it, most positives are false: about 9 %. Use Bayes' rule or a table of 100,000 people. (Lesson 2.2)
</details>

<details><summary>7. What is conditional probability?</summary>

The chance of A given that B happened: P(A and B) ÷ P(B). Example: chance a customer churns given they contacted support. (Lesson 2.2)
</details>

<details><summary>8. What is expected value, and where do businesses use it?</summary>

The long-run average outcome: sum of value × probability. Pricing warranties, valuing a lead, deciding whether a promotion pays. (Lesson 2.3)
</details>

<details><summary>9. Which distribution for the number of support tickets per hour?</summary>

Poisson, if tickets arrive independently at a steady rate; check whether the variance is close to the mean. (Lesson 3.3)
</details>

<details><summary>10. Why is the normal distribution so common?</summary>

The central limit theorem: sums and averages of many independent effects tend towards normal, whatever the shape of each effect. (Lessons 3.4 and 4.3)
</details>

## Sampling and estimation

<details><summary>11. What is the central limit theorem?</summary>

The average of a large enough random sample is roughly normally distributed around the true mean, with spread σ/√n, even if the data itself isn't normal. It's why confidence intervals and tests work. (Lesson 4.3)
</details>

<details><summary>12. Standard deviation vs standard error?</summary>

SD describes the spread of individual values; SE describes the uncertainty of an estimate such as a mean: SD ÷ √n. More data shrinks the SE, not the SD. (Lesson 4.4)
</details>

<details><summary>13. Name three kinds of sampling bias.</summary>

Selection (only app users answer), non-response (unhappy customers skip the survey), survivorship (only products still on sale are analysed). (Lesson 4.2)
</details>

<details><summary>14. What is bootstrapping?</summary>

Resampling your data with replacement many times and recomputing the statistic each time to see how much it varies. Gives intervals for medians, ratios and anything without a formula. (Lesson 4.5)
</details>

<details><summary>15. What does a 95 % confidence interval mean?</summary>

If we repeated the study many times, 95 % of intervals built this way would contain the true value. Not "95 % chance the true value is in this interval" (that's a Bayesian credible interval). (Lesson 5.3)
</details>

<details><summary>16. How many people to survey for ±3 points at 95 %?</summary>

About 1,070 for a proportion near 50 %: n = 1.96² × 0.25 ÷ 0.03². (Lesson 5.4)
</details>

## Hypothesis tests

<details><summary>17. Explain a p-value to a manager.</summary>

"If there were really no difference, a gap this big would show up by chance only 2 % of the time. So chance alone is an unlikely explanation." It isn't the chance the result is wrong. (Lesson 6.2)
</details>

<details><summary>18. Type I and type II errors?</summary>

Type I: a false alarm (calling a difference real when it isn't), rate α. Type II: a miss (failing to detect a real difference), rate β; power = 1 − β. (Lesson 6.4)
</details>

<details><summary>19. What is statistical power and what raises it?</summary>

The chance of detecting a real effect of a given size. Raise it with more data, a bigger effect, less noise (better metrics, CUPED) or a higher α. (Lesson 6.4)
</details>

<details><summary>20. When do you use a t-test, and which one?</summary>

Comparing means. Welch's two-sample t-test by default (doesn't assume equal variances); paired t-test for before/after on the same units; one-sample against a fixed value. (Lesson 6.3)
</details>

<details><summary>21. When do you use a chi-square test?</summary>

For counts in categories: whether two categorical variables are related (contingency table), or whether counts fit expected shares (goodness of fit, such as an A/B split). (Lesson 6.5)
</details>

<details><summary>22. What does ANOVA test?</summary>

Whether several group means are all equal. A significant F says at least one differs; follow up with corrected pairwise comparisons. (Lesson 6.6)
</details>

<details><summary>23. When would you use a non-parametric test?</summary>

Small samples from clearly non-normal data, ranks or ratings, or heavy outliers: Mann-Whitney instead of a two-sample t-test, Wilcoxon signed-rank instead of paired. (Lesson 6.7)
</details>

<details><summary>24. You test 20 metrics and one is significant. Excited?</summary>

No: at α = 0.05 you expect about one false positive in 20. Correct with Holm or Benjamini-Hochberg, or treat it as a lead for a new test. (Lesson 6.8)
</details>

<details><summary>25. Statistical vs practical significance?</summary>

Statistical: unlikely to be chance. Practical: big enough to matter. Huge samples make trivial effects significant; always report the effect size and interval. (Lesson 6.9)
</details>

## A/B testing

<details><summary>26. Walk me through designing an A/B test.</summary>

Hypothesis with a because; randomisation unit (usually user); eligible population and trigger; one primary metric, secondary metrics and guardrails; sample size from baseline, MDE, α and power; whole weeks; a written decision rule. Freeze it before launch. (Lesson 7.1)
</details>

<details><summary>27. How do you choose the primary metric?</summary>

Tied to value, sensitive enough to move during the test, hard to game. Often conversion or revenue per user, with guardrails for what must not get worse. (Lesson 7.2)
</details>

<details><summary>28. How long should a test run?</summary>

Until it reaches the planned sample size, rounded up to whole weeks (at least one, ideally two) so every weekday counts equally. Not "until it's significant". (Lesson 7.3)
</details>

<details><summary>29. What's wrong with stopping when p drops below 0.05?</summary>

Peeking: each look is another chance for noise to cross the line, so false wins rise from 5 % to 20 % or more. Use a fixed horizon or a sequential design. (Lesson 7.4)
</details>

<details><summary>30. What is a sample ratio mismatch?</summary>

When the split between groups differs from the plan more than chance allows (chi-square p < 0.001). It signals a bug (tracking, redirects, bots) and invalidates the result until fixed. (Lesson 7.6)
</details>

<details><summary>31. Frequentist vs Bayesian A/B testing?</summary>

Frequentist: p-value and confidence interval, fixed sample. Bayesian: chance B is better and expected loss, with a prior. Bayesian answers read more naturally; neither fixes peeking or bad data. (Lesson 7.7)
</details>

<details><summary>32. The test won in week one, but the effect faded. Why?</summary>

Likely a novelty effect. Check lift by day and new vs returning users; run longer or keep a holdout. (Lesson 7.8)
</details>

<details><summary>33. You can't randomise users (a price change in stores). What do you do?</summary>

Randomise larger units (stores, regions, weeks), use a switchback design, or a quasi-experiment such as difference-in-differences with careful comparison groups. (Lessons 7.1 and 7.8)
</details>

## Relationships and time

<details><summary>34. Correlation vs causation, with an example.</summary>

Ice cream sales and drownings correlate because hot weather drives both. To show cause you need an experiment or a design that rules out confounders. (Lesson 8.1)
</details>

<details><summary>35. Pearson vs Spearman?</summary>

Pearson measures straight-line association and is sensitive to outliers; Spearman uses ranks and measures any steady rising or falling relationship. Use Spearman for skewed data. (Lesson 8.1)
</details>

<details><summary>36. How do you interpret a regression coefficient?</summary>

The average change in Y for one more unit of X, holding other inputs fixed, with a CI. It's an association unless the design supports a causal reading. (Lesson 8.2)
</details>

<details><summary>37. What is Simpson's paradox?</summary>

A trend in every subgroup reverses when the groups are combined, because the groups are mixed differently. Example: a version wins on phones and computers but loses overall because most of its traffic is phones. (Lesson 8.3)
</details>

<details><summary>38. Sales dropped 8 % this week. How do you tell if it's real?</summary>

Compare with the same week last year and the same weekday last week; check the 7-day average; put it on a control chart. Check data issues (tracking, late-arriving data) before looking for business causes. (Lessons 8.4 and 8.6)
</details>

<details><summary>39. How would you forecast next month's demand?</summary>

Start with a seasonal naive baseline, try exponential smoothing or regression with calendar features, compare on a held-out recent period with MAE, and give a range. (Lesson 8.5)
</details>

<details><summary>40. What is R², and is a low R² bad?</summary>

The share of the variation in Y explained by the model. A low R² is fine when you're estimating an effect (a slope can be clearly real) but poor for prediction of individual values. (Lesson 8.2)
</details>

<div class="meaning">

<dl>
<dt>Definition</dt><dd>One sentence, plain words.</dd>
<dt>Example</dt><dd>A real analyst situation: orders, conversion, stores.</dd>
<dt>Trap</dt><dd>The common misreading, and how you avoid it.</dd>
<dt>Physical meaning</dt><dd>Interviewers test whether you can use statistics to make a decision safely, not whether you remember formulas. Showing the trap shows judgement.</dd>
</dl>

</div>

<div class="myth">

**"I must know every formula by heart."** Interviewers care more that you know which tool fits and what can go wrong. Saying "I would check the formula, but the idea is..." is fine.

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>The question.</b> "What is a p-value?"</div>
<div class="step"><b>Definition.</b> The chance of data at least this extreme if there were no real effect.</div>
<div class="step"><b>Example.</b> Our checkout test had p = 0.005: a gap this big would be rare if the forms converted equally.</div>
<div class="step"><b>Trap.</b> It is not the chance the effect is real, and it says nothing about size, so I report the interval too.</div>
<div class="step"><b>Close.</b> "So we shipped, because the whole interval for the lift was above zero."</div>
</div>

<div class="problem" data-problem="interview-margin"></div>

<details class="maths" open>
<summary>Maths and principle: the five formulas worth knowing by heart</summary>

```math
\text{SE} = \frac{s}{\sqrt n}, \qquad \bar x \pm 1.96\,\text{SE}, \qquad z = \frac{\hat p_B - \hat p_A}{\text{SE}}, \qquad n \approx \frac{16\,\sigma^2}{\delta^2}, \qquad P(A \mid B) = \frac{P(B \mid A)P(A)}{P(B)}
```

Standard error, a 95 % interval, a test statistic, Lehr's rule for sample size (80 % power, α = 0.05) and Bayes' rule cover most whiteboard questions.
</details>

## Worked example: a case question

*"Our sign-up rate fell from 12 % to 10 % after the redesign. What do you do?"*

1. **Clarify:** over what period, how many visitors, same traffic sources? Was it an A/B test or a before/after?
2. **Check the data:** tracking changes in the redesign, bot traffic, a campaign that changed the visitor mix (Simpson's paradox).
3. **Check it's beyond noise:** with 5,000 visitors a week each side, 12 % vs 10 % gives z ≈ 3.2, p ≈ 0.001, so unlikely to be chance, if the comparison is fair.
4. **Before/after isn't an experiment:** seasonality or traffic mix may explain it. Propose an A/B test of old vs new.
5. **Recommend:** revert or test, depending on cost; monitor the guardrails.

## Practice

1. Explain the central limit theorem in two sentences to a non-technical manager.
2. Explain why you shouldn't stop a test early when it looks good.
3. Answer: "How would you test whether a new recommendation widget increases revenue?"

<details>
<summary>Answers</summary>

1. "If you take lots of random samples and average each one, those averages form a bell curve around the true value, even if the raw data is lopsided. That's why we can put a margin of error on an average."
2. Each look gives noise another chance to look like a win; stopping on a good look turns a 5 % false alarm rate into 20 % or more.
3. Randomise users 50/50; primary metric revenue per user (capped, or with CUPED); guardrails page speed and returns; size from historical variance; two full weeks; decide with the 95 % CI for the lift; check SRM and novelty.
</details>

**Try it on your own data:** practise questions 17 to 25 with [[hypothesis-tests]], and 28 with [[sample-size]].

**New words:** none; this lesson revises the course.

<div class="keypoints">

- Answer in three parts: definition, example, trap.
- Use business examples: orders, conversion, stores.
- Mention uncertainty (intervals) whenever you give a number.
- It is fine to say what you would check if unsure.

</div>

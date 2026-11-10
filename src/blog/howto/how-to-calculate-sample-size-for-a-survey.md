---
title: "How to calculate sample size for a survey (with a worked example)"
summary: "Work out how many survey responses you need for a chosen margin of error and confidence level, with the small-population correction and a worked example."
tools: [sample-size, polling-average]
updated: 2026-11-10
sources:
  - "Sample size for a proportion, n = z²p(1 − p)/E², and the finite population correction: standard survey sampling results, for example Cochran, W. G. (1977), Sampling Techniques, 3rd edition, Wiley."
---

To find how many people a survey needs, square the z value for your confidence level, multiply by p(1 − p), and divide by the square of the margin of error you can accept; if the whole group you are studying is small, shrink the answer with the finite population correction. The [[sample-size]] tool does all of this when you set "Comparing" to "Survey: margin of error", and draws a curve of margin against number of responses so you can see the trade-off.

## What you need

- **The margin of error** you can live with, such as ± 4 percentage points. This is how far the survey's percentage may sit from the true one.
- **A confidence level**, usually 95 %. It says how often a margin built this way would contain the true value if you repeated the survey many times.
- **A guess at the answer**, as a percentage. If you have no idea, use 50 %: it gives the largest number, so you cannot fall short.
- **The population size**, only if the group is small, like one school, one company or one town.

## Step by step

1. Open [[sample-size]] and pick **Survey: margin of error** from the Comparing menu. The boxes for means and power hide, and four survey boxes appear.
2. Type the **Margin of error (± %)**. Keep in mind that halving the margin roughly quadruples the number you need.
3. Choose the **Confidence** from the menu: 90 %, 95 % or 99 %.
4. Type the **Expected answer (%)**. Leave it at 50 when unsure.
5. Fill in **Population size** only for a small, known group. Leave it blank for a city or a country.
6. Read the large number at the top of the result card. Below it you will find the count before the population correction, and a line telling you how many invitations to send if only half the people reply.

The maths behind it is short. First the count for a very large population:

n₀ = z² × p(1 − p) ÷ E²

Here z is the number of standard errors that covers your confidence level (1.645 for 90 %, 1.960 for 95 %, 2.576 for 99 %), p is the expected answer as a fraction, and E is the margin as a fraction. For a group of N people, the correction is:

n = n₀ ÷ (1 + (n₀ − 1) ÷ N)

The tool rounds up to a whole response, because 600.2 people cannot fill in a form.

## A worked example

A student council wants to ask a school of 2,500 pupils whether they support a later start time. They want the result within ± 4 points at 95 % confidence, and they have no prior idea of the answer, so p = 0.5.

- z² = 1.960² = 3.8415
- p(1 − p) = 0.5 × 0.5 = 0.25
- E² = 0.04² = 0.0016
- n₀ = 3.8415 × 0.25 ÷ 0.0016 = 600.2, so 601 responses for a huge population

Now the school is only 2,500 strong:

- n = 600.2 ÷ (1 + 599.2 ÷ 2,500) = 600.2 ÷ 1.2397 = 484.2, so **485 responses**

Typed into the tool (margin 4, confidence 95 %, expected answer 50, population 2500), the result card shows 485 responses, 601 without the correction, and advice to send the survey to 970 pupils if only half will answer. The curve on the chart drops steeply at first and then flattens: going from 485 to 970 replies would only bring the margin from ± 4 to about ± 2.5 points.

If the council had a good reason to expect an answer near 20 %, the same margin would need only 334 replies, because p(1 − p) is smaller away from 50 %. But a wrong guess here leaves the survey too small, which is why 50 % is the safe default.

## Check your answer

- **Know a few landmarks.** For a large population at 95 % and p = 50 %, ± 5 points needs 385 and ± 3 points needs 1,068. If your number is far from these for similar settings, check that you typed the margin as a percentage, not a fraction.
- **Work it backwards.** The margin for n responses is z × √(p(1 − p) ÷ n). With 601 replies: 1.96 × √(0.25 ÷ 601) = 0.040, which is the ± 4 points we asked for.
- **The correction can only make the number smaller.** If adding a population size raised your answer, something was typed wrongly.
- After the survey closes, put your real number of replies into the [[polling-average]] tool to see the margin you actually achieved, which matters if fewer people answered than you hoped.

## Questions people ask

**Does a bigger population need a much bigger sample?** Hardly. Above about 20,000 people the correction barely changes anything, so a national poll and a poll of one large city need roughly the same number of replies for the same margin.

**Can I use this for comparing two groups?** Not this mode. The margin here is for one percentage. To find whether two groups really differ, switch the menu to **Two proportions (percentages)**, which adds a significance level and power.

**Do more responses fix a biased sample?** No. The formula only covers random sampling error. If only the keenest people answer, a larger count just measures their opinion more precisely. Spread the invitation fairly and follow up with people who did not reply.

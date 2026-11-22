---
title: 'A/B testing pitfalls'
summary: 'Novelty effects, the winner''s curse, too many metrics and segments, users who interact with each other, and the habit of trusting results that look too good. The checks that catch them.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: 'A new design shows +6 % in its first week and +1 % by week six. What is the likely explanation?'
    choices: ['A novelty effect: people click on anything new, then settle back', 'The test broke in week two', 'Weekends']
    ans: 0
    why: 'Plot the lift by day and compare new with returning users. Novelty fades; the long-run lift is what you will keep.'
  - q: 'Tests that only just reach significance tend to overstate the true effect. Why?'
    choices: ['Because of rounding', 'Because among noisy estimates, the ones that cross the line are mostly the lucky high ones (the winner''s curse)', 'Because significant tests are always wrong']
    ans: 1
    why: 'Filtering on significance selects estimates that noise pushed up. Expect the shipped effect to be smaller, especially in underpowered tests.'
  - q: 'A test of a ride-sharing price change randomises riders. What could go wrong?'
    choices: ['Nothing', 'Riders share the same drivers, so treated riders change what control riders experience (interference)', 'Riders are not users']
    ans: 1
    why: 'When units interact, the control group is not a clean "no change" world. Randomise by city or time window instead.'
sources:
  - 'Kohavi, R., Tang, D. and Xu, Y. (2020), Trustworthy Online Controlled Experiments: A Practical Guide to A/B Testing, Cambridge University Press, Chapters 3 and 23'
  - 'Gelman, A. and Carlin, J. (2014), Beyond Power Calculations: Assessing Type S and Type M Errors, Perspectives on Psychological Science 9(6), 641-651 https://doi.org/10.1177/1745691614551642'
---

**Module 7 · about 20 minutes · no new maths.** You'll be able to spot the common ways a "winning" test misleads, and know the check for each.

<div class="bigidea">Lifts from tests usually shrink after launch: novelty wears off, lucky winners regress, and wins from different tests do not simply add up.</div>

**In everyday terms:** a new café on the high street is packed in its first week because it is new. Judging its long-term business by that week overestimates it badly. A redesign gets the same first-week bump.

## 1. Novelty and learning effects

People react to *change* itself. A shiny new button gets clicks because it's new (**novelty effect**); a rearranged menu annoys regulars at first (**learning effect**, or change aversion). Either way, the first days mislead.

<!--fig:novelty-sim-->

With the starting settings, stopping after one week estimates about +5 %; the true long-run lift is +1 %. Run to six weeks and the running estimate falls to about +2 %, much closer; the last weeks alone sit right on +1 %. Set the launch value negative to see a change that looks bad at first and comes good.

**Checks:** plot the lift by day; compare **new users** (who have nothing to be surprised by) with returning ones; run at least two full weeks; for big changes, keep a small **holdout** group on the old version for months.

## 2. The winner's curse

If a test has low power, it only reaches significance when noise pushes the estimate up. So significant results from small tests **overstate** the effect, sometimes by double. Over a portfolio of tests, the sum of all "wins" is bigger than the real gain.

**Checks:** plan for power (Lesson 7.3); treat a surprising win as a hypothesis and replicate it; shrink estimates towards zero (a Bayesian prior, Lesson 7.7, does this).

Switch between the pooled line and the by-group lines.

<figure class="fig" data-fig="@data-simpson-scatter"><figcaption>Notice that every group trends up while the pooled trend goes down: the hidden group variable flips the story.</figcaption></figure>


## 3. Too many metrics and segments

Twenty metrics or twenty segments ("it worked for Android users in Ontario on weekends!") give about one false win at 5 % each (Lesson 6.8).

**Checks:** one primary metric decided in advance (Lesson 7.2); treat segment findings as ideas for the next test; if you must look at many, correct for it (Holm or Benjamini-Hochberg).

## 4. Interference between users

Standard tests assume one user's group doesn't affect another's outcome. That fails when users share something:

- **Marketplaces:** a discount for buyers in B uses up stock that buyers in A wanted.
- **Social features:** a sharing tool in B sends messages to users in A.
- **Shared budgets:** an ad test where both groups bid from the same budget.

**Checks:** randomise larger units (cities, time windows, clusters of friends) and analyse at that level.

## 5. Twyman's law

"Any figure that looks interesting or different is usually wrong." A +30 % lift from a button colour is almost always a bug: a tracking change, SRM (Lesson 7.6), bots, or a metric that double counts. Check the plumbing before celebrating.

<div class="meaning">

<dl>
<dt>Novelty effect</dt><dd>Users react to anything new; the effect fades.</dd>
<dt>Winner's curse</dt><dd>Tests that pass with low power overstate the true effect.</dd>
<dt>Interference</dt><dd>Users in A and B affect each other (marketplaces, social features), so the groups are not separate.</dd>
<dt>Non-additivity</dt><dd>Two +3 % wins on the same page rarely give +6 %.</dd>
<dt>Physical meaning</dt><dd>A test measures a short window in an artificial setting. The long-run effect is usually smaller, so trust repeated, well-powered results and holdout groups over single exciting numbers.</dd>
</dl>

</div>

<div class="myth">

**"12 winning tests at +1.5 % each mean +18 % this quarter."** Inflated winners, novelty and overlap mean the real total is usually far smaller. A long-running holdout group shows what all the changes really added.

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>The report.</b> 12 winning tests add up to +18 % conversion.</div>
<div class="step"><b>Reality.</b> Conversion over the quarter rose 3 %.</div>
<div class="step"><b>Winner's curse.</b> Several tests had about 30 % power, so their winning lifts were inflated.</div>
<div class="step"><b>Novelty.</b> Three wins were measured in the first week of eye-catching redesigns.</div>
<div class="step"><b>Fix.</b> Power tests properly, run whole weeks, re-test big winners, and keep a holdout group.</div>
</div>

<div class="problem" data-problem="winners-curse"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** selecting results on significance biases their size upward.

**How big is the curse?** If the true effect is `$\delta$` and the test's SE is `$s$`, a significant estimate must exceed about `$1.96s$`. When `$\delta$` is well below that (low power), the average significant estimate is close to `$2s$` or more, however small `$\delta$` is.

**Example:** true lift 0.5 points, SE 0.5 points (power about 17 %). Significant positive estimates average about **1.25 points**, two and a half times the truth.

**Novelty:** if the lift on day `$t$` is `$L + N e^{-t/\tau}$`, the average over the first `$d$` days is biased upwards by about `$N\tau/d$` once `$d$` is several times `$\tau$`, so longer tests shrink the bias.
</details>

## 6. Worked example

*Made-up story.* A team's quarterly report lists 12 winning tests adding up to +18 % conversion. Actual conversion over the quarter rose 3 %.

- Several tests had power around 30 %: their significant lifts were inflated (winner's curse).
- Three wins were measured in the first week of eye-catching redesigns (novelty).
- Two "wins" were in segments picked after the fact.
- Lifts from different tests on the same page don't simply add up.

The fix: plan power, run full weeks, one primary metric, replicate surprising wins, and keep a long-term holdout to measure the combined effect.

## 7. Practice

1. How would you tell a novelty effect from a real lift?
2. A test with 15 % power comes out significant with +8 %. What do you expect the true effect to be?
3. Suggest a randomisation unit for testing a new delivery-fee rule in a food delivery app.

<details>
<summary>Answers</summary>

1. Plot lift by day (novelty fades), compare new and returning users (new users show no novelty), and use a long-term holdout.
2. Probably much smaller than 8 %, possibly near zero; replicate before trusting it.
3. City (or city × week), because riders, restaurants and couriers are shared within a city.
</details>

**Try it on your own data:** the [[bootstrap-permutation]] tool lets you see how much an estimate wobbles by chance; [[sample-size]] tells you whether a test had the power to be trusted.

**New words:** *novelty effect*, *learning effect*, *holdout group*, *winner's curse*, *interference*, *Twyman's law*.

<div class="keypoints">

- Watch for novelty: compare early and late weeks of the test.
- Low-powered wins exaggerate effects (the winner's curse).
- Interference between users breaks the A/B separation; randomise by cluster if needed.
- Lifts from separate tests do not simply add; use a holdout to measure the total.

</div>

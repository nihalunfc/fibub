---
title: The peeking problem
summary: 'Checking an A/B test every day and stopping the first time it looks significant turns a 5 % false positive rate into 20 % or more. Why it happens, and the honest options: fixed horizons, sequential tests and Bayesian monitoring.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: 'An A/A test (no real difference) is checked daily for 4 weeks and stopped at the first p < 0.05. Roughly what share of such tests end with a false "win"?'
    choices: ['5 %', 'Around 20-25 %', '50 %']
    ans: 1
    why: 'Each look is another chance for noise to cross the line. Over 28 looks the false win rate climbs to around a quarter.'
  - q: 'Which is safe?'
    choices: ['Watching the dashboard daily but deciding only at the planned end', 'Stopping as soon as p < 0.05', 'Extending the test when p is 0.06 until it drops below 0.05']
    ans: 0
    why: 'Looking is harmless; acting on the look is what breaks the error rate. Extending until significant is peeking in reverse.'
  - q: 'You must be able to stop early for a clear win or a harmful loss. What should you use?'
    choices: ['A sequential test designed for repeated looks', 'A lower p-value threshold chosen after looking', 'Nothing, just stop']
    ans: 0
    why: 'Group sequential designs (e.g. O''Brien-Fleming boundaries) or always-valid methods keep the false positive rate at 5 % across planned looks.'
---

**Module 7 · about 20 minutes · no new maths.** You'll be able to explain why stopping on a peek inflates false positives, and choose an honest way to monitor a test.

## 1. Each look is another lottery ticket

A p-value threshold of 0.05 assumes you test **once**, at a sample size fixed in advance. During a test, the running p-value wanders up and down. If you check every day and stop the first time it dips below 0.05, you give noise many chances to cross the line.

<!--fig:peeking-sim-->

Run 500 A/A tests. Checked once at the end, about 5 % "win", as promised. Stopped at the first daily p < 0.05, around a quarter "win", all of them false. The lines show why: early on, with little data, the p-value swings wildly.

The same problem in reverse: **extending** a test because p = 0.07 "is nearly there" and stopping as soon as it crosses 0.05.

## 2. Honest options

**1. Fixed horizon (the default).** Plan the sample size (Lesson 7.3), look at the dashboard for bugs and guardrails as often as you like, but make the decision only at the end. Simple and correct.

**2. Group sequential designs.** Plan a few interim looks (say at 25 %, 50 %, 75 %, 100 % of the sample) with stricter thresholds early on. O'Brien-Fleming boundaries use very strict early thresholds (about p < 0.0001 at the first of four looks) and close to 0.05 at the end, so overall α stays at 5 % and you can still stop early for a dramatic effect.

**3. Always-valid / sequential tests.** Methods such as mSPRT give p-values (or confidence sequences) that stay valid however often you look. Many commercial A/B tools use these. They need somewhat more data for the same power when you don't stop early.

**4. Bayesian monitoring** (Lesson 7.7) with a decision rule based on expected loss. It's less sensitive to peeking in practice, but it isn't magic: repeatedly stopping on "P(B better) > 95 %" still raises the false win rate for null effects.

**Stopping for harm** is different: if a guardrail shows clear damage (errors spike, revenue drops sharply), stop. Protecting users matters more than a clean experiment; just don't then claim the test "proved" anything about the primary metric.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** the chance that a random walk crosses a boundary *at some point* is much higher than the chance it ends beyond it.

**Numbers:** with `$k$` equally spaced looks at α = 0.05 each, the overall false positive rate is about 8 % for 2 looks, 11 % for 3, 14 % for 5, 19 % for 10 and approaching 1 (eventually certain) for unlimited looks. A Pocock design keeps the total at 5 % over 5 looks by testing each at about 0.016.

**Analogy:** asking "is it raining?" every five minutes all week; sooner or later you'll see a shower, even in a dry week.
</details>

## 3. Worked example

*Made-up story.* A team runs a 4-week test of a new banner. On day 5, B is ahead with p = 0.03. They stop and ship. Over the next month, conversion is unchanged.

- Day 5 of 28 had only 18 % of the planned sample. The running estimate at that point was very noisy (the simulation shows how wildly it swings).
- With daily peeking, the chance of a false win was around 20 %, not 5 %.
- Had they planned a sequential design with O'Brien-Fleming boundaries, the day-5 look would have needed p < 0.0001 or so, which 0.03 doesn't meet.

## 4. Practice

1. A test is planned for 14 days. On day 14, p = 0.08. Your manager suggests 3 more days. What do you say?
2. Why is looking at guardrails daily fine?
3. Name two ways to allow early stopping without inflating false positives.

<details>
<summary>Answers</summary>

1. That's peeking in reverse: extending until it crosses 0.05 inflates false positives. Report the result as it stands (effect and interval); if the decision needs more certainty, plan a fresh, larger test.
2. Because stopping for harm doesn't create a false "win"; it protects users. The primary metric decision still waits.
3. A group sequential design with pre-set boundaries (e.g. O'Brien-Fleming), or an always-valid sequential test (e.g. mSPRT / confidence sequences).
</details>

**Try it on your own data:** the [[bayesian-ab-test]] tool shows how the chance that B beats A moves as data arrives; watch it, but decide at the planned end.

**New words:** *peeking*, *optional stopping*, *fixed horizon*, *group sequential design*, *O'Brien-Fleming boundary*, *always-valid inference*, *confidence sequence*.
